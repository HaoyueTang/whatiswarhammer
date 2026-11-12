/* audio_dsp.js — signal checks for rendered music (audio role). Plain JS: runs in the page (injected by audio_check.js, which
 * renders through headless Chrome's OfflineAudioContext) and in Node (module.exports) so the checks can be unit-tested.
 *   WH_DSP.analyze(L, R, sr, opts) -> metrics (all dB values are dBFS)
 *     opts: {bodyEnd: seconds (end of the first loop; RMS is measured on 0.5 s .. bodyEnd), seams: [seconds] loop restart(s),
 *            marks: [seconds] every section boundary (the seam is compared against the other boundaries), repMax: longest lag checked (s)}
 *   nan       number of NaN / Infinity samples
 *   peakDb    sample peak of both channels
 *   dc        largest |mean| of the two channels, as a fraction of full scale
 *   rmsDb     RMS of the mono mix over the body
 *   quiet     longest stretch (s) of near silence (< -58 dBFS) inside the body
 *   seam      {t, hf, ref, p99, ratio}: largest sample-to-sample step within -5 ms .. +30 ms of the loop restart; ref = the largest such step
 *             at the other section boundaries; p99 = 99th percentile of the same measure over every 35 ms of the body; ratio = hf / p99
 *             (a click at the seam would stand far above anything else in the piece, a drum hit on the downbeat does not)
 *   rep       {corr, at, lag}: highest correlation between two 10 s stretches (their band-energy movement over time, mean removed) that lie
 *             <= repMax s apart; static stretches (drones) are skipped; null when nothing to compare
 */
(function (root) {
  "use strict";

  function fft(re, im) {                       // in-place iterative radix-2 FFT (length = power of two)
    var n = re.length, i, j, k, m, t;
    for (i = 1, j = 0; i < n; i++) {
      var bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
    }
    for (var len = 2; len <= n; len <<= 1) {
      var ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang), h = len >> 1;
      for (i = 0; i < n; i += len) {
        var cr = 1, ci = 0;
        for (k = 0; k < h; k++) {
          var a = i + k, b = a + h, xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
          re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
          t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
        }
      }
    }
  }
  function db(x) { return 20 * Math.log10(Math.max(x, 1e-9)); }

  /* band-energy features: 24 log-spaced bands (100 Hz .. 8 kHz), one frame every 0.5 s (window ~0.37 s) */
  function features(mono, sr) {
    var N = 8192, hop = Math.round(sr / 2), nb = 24, out = [], re = new Float64Array(N), im = new Float64Array(N), win = new Float64Array(N);
    for (var i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1));
    var fmax = Math.min(8000, sr * 0.45), edges = [];
    for (var b = 0; b <= nb; b++) edges.push(Math.round(100 * Math.pow(fmax / 100, b / nb) * N / sr));
    for (var s = 0; s + N <= mono.length; s += hop) {
      for (i = 0; i < N; i++) { re[i] = mono[s + i] * win[i]; im[i] = 0; }
      fft(re, im);
      var f = new Float64Array(nb);
      for (b = 0; b < nb; b++) {
        var e = 0;
        for (var k = edges[b]; k < Math.max(edges[b + 1], edges[b] + 1); k++) e += re[k] * re[k] + im[k] * im[k];
        f[b] = Math.log(e + 1e-7);
      }
      out.push(f);
    }
    return {frames: out, hopSec: hop / sr};
  }
  function repetition(mono, sr, repMax, blockSec) {
    var F = features(mono, sr), fr = F.frames, B = Math.round(blockSec / F.hopSec), nb = fr.length ? fr[0].length : 0, V = [], act = [];
    for (var i = 0; i + B <= fr.length; i++) {
      var v = new Float64Array(B * nb), ss = 0;
      for (var b = 0; b < nb; b++) {
        var m = 0, f;
        for (f = 0; f < B; f++) m += fr[i + f][b];
        m /= B;
        for (f = 0; f < B; f++) { var d = fr[i + f][b] - m; v[f * nb + b] = d; ss += d * d; }
      }
      var a = Math.sqrt(ss / (B * nb));          // how much the block moves (nepers, RMS around its per-band mean)
      act.push(a);
      for (var q = 0; q < v.length; q++) v[q] /= (a * Math.sqrt(v.length) + 1e-12);
      V.push(v);
    }
    var best = {corr: null, at: 0, lag: 0}, maxLag = Math.floor(repMax / F.hopSec);
    for (i = 0; i < V.length; i++) {
      if (act[i] < 0.6) continue;
      for (var j = i + B; j < V.length && j - i <= maxLag; j++) {
        if (act[j] < 0.6) continue;
        var dot = 0, x = V[i], y = V[j];
        for (q = 0; q < x.length; q++) dot += x[q] * y[q];
        if (best.corr === null || dot > best.corr) best = {corr: dot, at: i * F.hopSec, lag: (j - i) * F.hopSec};
      }
    }
    return best;
  }
  function stepMax(x, sr, t0, t1) {              // largest |x[n] - x[n-1]| in [t0, t1]
    var a = Math.max(1, Math.floor(t0 * sr)), b = Math.min(x.length - 1, Math.floor(t1 * sr)), m = 0;
    for (var i = a; i <= b; i++) { var d = Math.abs(x[i] - x[i - 1]); if (d > m) m = d; }
    return m;
  }

  function analyze(L, R, sr, opts) {
    opts = opts || {};
    var n = L.length, nan = 0, pk = 0, sl = 0, sr_ = 0, i, mono = new Float32Array(n);
    for (i = 0; i < n; i++) {
      var l = L[i], r = R[i];
      if (!isFinite(l) || !isFinite(r)) { nan++; mono[i] = 0; continue; }
      if (Math.abs(l) > pk) pk = Math.abs(l);
      if (Math.abs(r) > pk) pk = Math.abs(r);
      sl += l; sr_ += r; mono[i] = (l + r) / 2;
    }
    var end = Math.min(n, Math.floor((opts.bodyEnd || n / sr) * sr)), s0 = Math.floor(0.5 * sr), ss = 0;
    for (i = s0; i < end; i++) ss += mono[i] * mono[i];
    var out = {nan: nan, peakDb: db(pk), dc: Math.max(Math.abs(sl / n), Math.abs(sr_ / n)), rmsDb: db(Math.sqrt(ss / Math.max(1, end - s0)))};
    var w = Math.floor(sr * 0.1), run = 0, quiet = 0;                       // longest near-silent stretch (< -58 dBFS RMS in 100 ms windows)
    for (i = s0; i + w <= end; i += w) {
      var q = 0;
      for (var j = i; j < i + w; j++) q += mono[j] * mono[j];
      if (Math.sqrt(q / w) < 0.00126) { run++; if (run > quiet) quiet = run; } else run = 0;
    }
    out.quiet = quiet * 0.1;
    // loop seam: the largest sample-to-sample step within -5 .. +30 ms of the restart, against the other section boundaries and
    // against the 99th percentile of the same measure over every 35 ms of the body (a drum hit on the downbeat is a normal step; a click is not)
    var seam = (opts.seams || [])[0];
    if (seam != null) {
      var hf = stepMax(mono, sr, seam - 0.005, seam + 0.03), ref = 0, others = 0, steps = [];
      (opts.marks || []).forEach(function (m) {
        if (Math.abs(m - seam) < 0.05 || m < 0.3 || m + 0.05 > n / sr) return;
        ref = Math.max(ref, stepMax(mono, sr, m - 0.005, m + 0.03)); others++;
      });
      for (var t0 = 0.3; t0 + 0.035 < Math.min(n / sr, opts.bodyEnd || n / sr); t0 += 0.035) steps.push(stepMax(mono, sr, t0, t0 + 0.035));
      steps.sort(function (a, b) { return a - b; });
      var p99 = steps.length ? steps[Math.floor(steps.length * 0.99)] : 0;
      out.seam = {t: seam, hf: hf, ref: ref, others: others, p99: p99, ratio: p99 > 0 ? hf / p99 : null};
    }
    out.rep = repetition(mono, sr, opts.repMax || 40, 10);
    return out;
  }

  var API = {analyze: analyze, fft: fft, repetition: repetition, features: features};
  if (typeof module !== "undefined" && module.exports) module.exports = API; else (root.WH_DSP = API);
})(typeof window !== "undefined" ? window : globalThis);
