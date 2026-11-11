#!/usr/bin/env python3
"""audio_render.py — headless-Chrome test + offline render of every mood and SFX (audio role).

    python3 tools/dev/audio_render.py                  # live API test + render all moods/SFX, print stats
    options: --out /tmp/wh_audio_renders  --sr 22050  --chrome /usr/bin/google-chrome  --moods battle,boss  --no-live

1. Live: opens tools/dev/audio_test.html (file://), asserts no AudioContext before a gesture, clicks to unlock,
   auditions every mood button and SFX button, checks hysteresis/mute/volume API, collects console errors.
2. Offline: renders each mood through OfflineAudioContext with the real audio.js synth (music volume 1.0 = worst
   case), writes WAVs, and checks peak < 0 dBFS, no clipping, RMS in range, no unintended silence, loop length,
   and that the loop restarts (start of loop 1 vs loop 2 correlate).
"""
import base64, json, os, sys, wave
import numpy as np
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ARGS = sys.argv[1:]
def opt(name, default):
    return ARGS[ARGS.index(name) + 1] if name in ARGS and ARGS.index(name) + 1 < len(ARGS) else default
OUT = opt("--out", "/tmp/wh_audio_renders")
SR = int(opt("--sr", "22050"))
CHROME = opt("--chrome", "/usr/bin/google-chrome")
ONLY = [m for m in opt("--moods", "").split(",") if m]
os.makedirs(OUT, exist_ok=True)
URL = "file://" + os.path.join(ROOT, "tools", "dev", "audio_test.html")

fails, console_errors = [], []
def check(name, cond, detail=""):
    print(("  PASS " if cond else "  FAIL ") + name + (f"  — {detail}" if detail else ""))
    if not cond: fails.append(name)

def db(x): return 20 * np.log10(max(float(x), 1e-9))

def write_wav(path, data):
    pcm = (np.clip(data, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

JS_FETCH = """async ([kind, name, secs, sr]) => {
  const res = kind === 'mood' ? await WH.Audio._render(name, secs, sr) : {buffer: await WH.Audio._renderSfx(name, secs, sr)};
  const b = res.buffer, L = b.getChannelData(0), R = b.getChannelData(1), n = L.length;
  const out = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) { out[2*i] = L[i]; out[2*i+1] = R[i]; }
  const u8 = new Uint8Array(out.buffer); let s = '';
  for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  return {b64: btoa(s), loops: res.loops || [], info: res.info || null};
}"""

def fetch(page, kind, name, secs):
    r = page.evaluate(JS_FETCH, [kind, name, secs, SR])
    data = np.frombuffer(base64.b64decode(r["b64"]), dtype="<f4").reshape(-1, 2)
    return data, r["loops"], r["info"]

def spec_sim(x, y, n=4096):
    def spec(z):
        frames = len(z) // n
        f = z[: frames * n].reshape(frames, n) * np.hanning(n)
        return np.sqrt(np.mean(np.abs(np.fft.rfft(f, axis=1)) ** 2, axis=0))[: n // 4]   # up to SR/8 (~2.7 kHz)
    a, b = spec(x), spec(y)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-12))

def centroid(mono):
    """spectral centroid (Hz) of the whole render — a rough 'brightness' figure per mood"""
    n = 4096; frames = len(mono) // n
    if not frames: return 0.0
    f = mono[: frames * n].reshape(frames, n) * np.hanning(n)
    mag = np.mean(np.abs(np.fft.rfft(f, axis=1)), axis=0); hz = np.fft.rfftfreq(n, 1 / SR)
    return float(np.sum(hz * mag) / (np.sum(mag) + 1e-12))

def low_share(mono, cut=200):
    """share (%) of spectral magnitude below `cut` Hz — how bass/drum-heavy ('stompy') a mood is"""
    n = 4096; frames = len(mono) // n
    if not frames: return 0.0
    f = mono[: frames * n].reshape(frames, n) * np.hanning(n)
    mag = np.mean(np.abs(np.fft.rfft(f, axis=1)), axis=0); hz = np.fft.rfftfreq(n, 1 / SR)
    return float(100 * np.sum(mag[hz < cut]) / (np.sum(mag) + 1e-12))

def onset_rate(mono):
    """rough onsets per second (positive jumps of the 10 ms energy envelope) — a busy-ness figure"""
    e = window_rms(mono, int(SR * 0.01)); d = np.diff(np.log(e + 1e-6))
    return float(np.sum((d[1:] > 0.5) & (d[:-1] <= 0.5)) / (len(mono) / SR))

def window_rms(mono, win):
    n = len(mono) // win
    return np.sqrt(np.mean(mono[: n * win].reshape(n, win) ** 2, axis=1) + 1e-12)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=CHROME, args=["--autoplay-policy=no-user-gesture-required"])
    page = browser.new_page()
    page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: console_errors.append("pageerror: " + str(e)))
    page.goto(URL)
    page.wait_for_timeout(300)
    A = "WH.Audio"
    moods = page.evaluate(f"{A}.moods")
    sfxs = page.evaluate(f"{A}.sfxNames")

    if "--no-live" not in ARGS:
        print("Live API (headless Chrome, %s)" % URL)
        check("no AudioContext before a user gesture", page.evaluate(f"{A}._ctx() === null"))
        check("sfx() before unlock is silent (returns false)", page.evaluate(f"{A}.sfx('click') === false"))
        check("setMood() before unlock only records the wish", page.evaluate(f"{A}.setMood('title') === true && {A}.current() === null && {A}.wanted() === 'title'"))
        page.mouse.click(5, 5)
        page.wait_for_timeout(400)
        check("first click unlocks + starts the wished mood", page.evaluate(f"{A}._ctx().state === 'running' && {A}.current() === 'title'"),
              page.evaluate(f"{A}._ctx().state + ' / ' + {A}.current()"))
        for m in moods:
            page.click(f"button[data-mood='{m}']")
            page.wait_for_timeout(450)
            st = page.evaluate(f"(() => {{ const p = {A}._players()['{m}']; return {{cur: {A}.current(), active: !!(p && p.active), t: {A}._ctx().currentTime, next: p ? p.nextTime : 0}}; }})()")
            check(f"mood '{m}' plays (scheduler ahead of clock)", st["cur"] == m and st["active"] and st["next"] > st["t"], json.dumps(st))
        page.wait_for_timeout(1600)
        n_active = page.evaluate(f"Object.values({A}._players()).filter(p => p.active).length")
        check("old moods stop after their crossfade", n_active == 1, f"{n_active} active players")
        for s in sfxs:
            page.click(f"#sfx button:text-is('{s}')")
            page.wait_for_timeout(120)
        check("every SFX button ran", page.evaluate(f"{A}.sfxNames.every(s => typeof {A}._sfx[s] === 'function')"))
        page.wait_for_timeout(1200)
        ok = page.evaluate(f"(() => {{ let n = 0; for (let i = 0; i < 20; i++) if ({A}.sfx('type')) n++; return n; }})()")
        check("type sfx is rate-limited", ok == 1, f"{ok}/20 immediate calls played")
        # hysteresis
        page.evaluate(f"{A}.setMood('calm', {{force: true}})")
        r = page.evaluate(f"{A}.setMood('tense')")
        check("calm→tense within 8 s is deferred", r == "deferred" and page.evaluate(f"{A}.current()") == "calm", str(r))
        r = page.evaluate(f"{A}.setMood('battle')")
        check("battle bypasses hysteresis", r is True and page.evaluate(f"{A}.current()") == "battle")
        r = page.evaluate(f"{A}.setMood('battle')")
        check("same mood is a no-op", r is True and page.evaluate(f"Object.values({A}._players()).filter(p => p.active && p.stopAt == null).length") == 1)
        # volume / mute
        page.evaluate(f"{A}.setMusicVolume(0.2); {A}.setSfxVolume(0.9)")
        check("volume setters/getters", page.evaluate(f"{A}.getMusicVolume() === 0.2 && {A}.getSfxVolume() === 0.9"))
        page.evaluate(f"{A}.mute(true)")
        page.wait_for_timeout(250)
        check("mute suspends the context + persists", page.evaluate(f"{A}.isMuted() && {A}._ctx().state === 'suspended' && JSON.parse(localStorage.getItem('whatiswh.audio')).muted === true"))
        check("sfx while muted is skipped", page.evaluate(f"{A}.sfx('click') === false"))
        page.evaluate(f"{A}.mute(false)")
        page.wait_for_timeout(250)
        check("unmute resumes", page.evaluate(f"!{A}.isMuted() && {A}._ctx().state === 'running'"))
        # visibility (simulate hidden tab)
        page.evaluate("Object.defineProperty(document, 'hidden', {configurable: true, get: () => true}); document.dispatchEvent(new Event('visibilitychange'))")
        page.wait_for_timeout(200)
        check("hidden tab suspends audio", page.evaluate(f"{A}._ctx().state === 'suspended'"))
        page.evaluate("Object.defineProperty(document, 'hidden', {configurable: true, get: () => false}); document.dispatchEvent(new Event('visibilitychange'))")
        page.wait_for_timeout(200)
        check("visible tab resumes audio", page.evaluate(f"{A}._ctx().state === 'running'"))
        # v0.2 / v0.3 scene → mood wiring plays the new moods
        for scene, fac, want in [("craftworld", "aeldari", "aeldari"), ("tomb_interior", "necrons", "necron"),
                                 ("ork_scrapyard", "orks", "orks"), ("gsc_chapel", "gsc", "gsc"), ("forge_floor", "mechanicus", "mechanicus")]:
            got = page.evaluate(f"(() => {{ const m = {A}.moodFor({{scene: '{scene}'}}, {{stats: {{sanity: 90}}}}, '{fac}'); {A}.setMood(m, {{force: true}}); return m; }})()")
            page.wait_for_timeout(500)
            st = page.evaluate(f"(() => {{ const p = {A}._players()['{want}']; return !!(p && p.active) && {A}.current() === '{want}'; }})()")
            check(f"moodFor({scene}) → {want} plays", got == want and st, str(got))
        check("consequence/scan SFX play after unlock", page.evaluate(f"{A}.sfx('consequence') === true && {A}.sfx('scan') === true"))
        # real-file override falls back to synth on a missing file
        page.evaluate(f"WH.audioFiles = {{holy: 'assets/audio/does_not_exist.ogg'}}; {A}.setMood('holy', {{force: true}})")
        page.wait_for_timeout(800)
        fb = page.evaluate(f"[{A}.current(), !!{A}._players().holy, !!({A}._players().holy && {A}._players().holy.active)]")
        check("missing audio file falls back to synth", fb == ["holy", True, True], json.dumps(fb))
        page.evaluate(f"WH.audioFiles = {{}}; {A}.stop({{fade: 200}})")
        page.wait_for_timeout(500)
        check("stop() clears the mood", page.evaluate(f"{A}.current() === null"))
        errs = [e for e in console_errors if "does_not_exist" not in e and "ERR_FILE_NOT_FOUND" not in e]
        check("no console errors", not errs, "; ".join(errs[:5]))

    print(f"\nOffline renders → {OUT}  (sr {SR} Hz, music volume 1.0)")
    print("  mood       key                        bpm  loop(s) exp/actual   peak dBFS  RMS dBFS  clip  longest quiet  loop-sim  centroid  <200Hz  onsets/s")
    for m in moods:
        if ONLY and m not in ONLY: continue
        info = page.evaluate(f"{A}.songInfo('{m}')")
        exp_loop = info["introSec"] + info["loopSec"]
        secs = exp_loop * (1.25 if info["wobble"] else 1) + 6
        data, loops, _ = fetch(page, "mood", m, secs)
        write_wav(os.path.join(OUT, f"music_{m}.wav"), data)
        mono = data.mean(axis=1)
        peak = np.abs(data).max(); clip = int((np.abs(data) >= 0.999).sum())
        first = loops[0] if loops else None
        body = mono[int(SR * 0.5): int(SR * (first or exp_loop))]
        rms = db(np.sqrt(np.mean(body ** 2)))
        w = window_rms(body, int(SR * 0.1))
        quiet, run = 0, 0
        for v in w:
            run = run + 1 if v < 10 ** (-55 / 20) else 0; quiet = max(quiet, run)
        quiet_s = quiet * 0.1
        corr = float("nan")
        if loops:
            # same notes at the loop restart? cosine similarity of averaged magnitude spectra (4 s) of the song top
            # vs the top of loop 2 — robust to noise drums, reverb tails, slow pad attacks and the warp tempo wobble
            a0 = int(SR * (info["introSec"] + 0.06)); a1 = int(SR * loops[0]); L = int(SR * 4)
            if a1 + L <= len(mono):
                corr = spec_sim(mono[a0:a0 + L], mono[a1:a1 + L])
        actual = (loops[0] - 0.06) if loops else None
        cen, low, ons = centroid(body), low_share(body), onset_rate(body)
        print(f"  {m:10s} {info['key'][:24]:24s} {info['bpm']:4d}  {exp_loop:7.1f} / {('%.1f' % actual) if actual else '  -  ':>6s}   {db(peak):8.1f}  {rms:8.1f}  {clip:4d}  {quiet_s:9.1f} s   {corr:8.2f}  {cen:6.0f} Hz  {low:5.1f}%  {ons:6.1f}")
        check(f"{m}: peak < -0.5 dBFS", db(peak) < -0.5)
        check(f"{m}: no clipped samples", clip == 0)
        lo_rms = -40 if m in ("death", "bad") else -32
        check(f"{m}: RMS in range ({lo_rms}..-8 dBFS)", lo_rms < rms < -8, f"{rms:.1f}")
        allowed_quiet = 8.0 if m in ("death", "bad") else 1.0
        check(f"{m}: no unintended silence (> {allowed_quiet} s)", quiet_s <= allowed_quiet, f"{quiet_s:.1f} s")
        check(f"{m}: loop wraps", bool(loops))
        if actual and not info["wobble"]:
            check(f"{m}: loop length matches data", abs(actual - exp_loop) < 0.05, f"{actual:.2f} vs {exp_loop:.2f}")
        elif actual:
            check(f"{m}: wobbling loop within ±{info['wobble'][0]:.0%} of nominal", abs(actual / exp_loop - 1) <= info["wobble"][0], f"{actual:.2f} vs {exp_loop:.2f}")
        if corr == corr:
            check(f"{m}: loop restart matches the top (spectral sim > 0.95)", corr > 0.95, f"{corr:.2f}")

    print("\nSFX renders")
    print("  sfx           peak dBFS  length(s)")
    for s in sfxs:
        data, _, _ = fetch(page, "sfx", s, 4.0)
        write_wav(os.path.join(OUT, f"sfx_{s}.wav"), data)
        env = np.abs(data).max(axis=1)
        above = np.where(env > 10 ** (-50 / 20))[0]
        length = (above[-1] / SR) if len(above) else 0
        print(f"  {s:12s}  {db(env.max()):8.1f}  {length:8.2f}")
        check(f"sfx {s}: audible and peak < -1 dBFS", -40 < db(env.max()) < -1, f"{db(env.max()):.1f}")
        limit = {"hover": 0.15, "type": 0.15, "click": 0.3, "save": 1.5, "consequence": 1.5, "scan": 1.5}.get(s, 3.5)
        check(f"sfx {s}: short (< {limit} s)", length < limit, f"{length:.2f}s")
    errs = [e for e in console_errors if "does_not_exist" not in e and "ERR_FILE_NOT_FOUND" not in e]
    check("no console errors during renders", not errs, "; ".join(errs[:5]))
    browser.close()

print(f"\n{'FAIL' if fails else 'OK'} — {len(fails)} failed checks")
sys.exit(1 if fails else 0)
