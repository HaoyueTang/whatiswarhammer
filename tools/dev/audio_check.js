#!/usr/bin/env node
/* audio_check.js — checks for src/js/audio.js (audio role).
 *   node tools/dev/audio_check.js [--no-render] [--styles dark,organ] [--moods battle,calm] [--sr 22050] [--jobs 2] [--chip] [--json out.json | --from-json out.json]
 * 1. Static: parses every song's pattern data (note names, chord symbols, per-bar step counts, drum pattern lengths, section
 *    inheritance), checks all moods / SFX exist, reports harmony stats, unit-tests moodFor() and the music-style API (SPEC §29),
 *    and estimates polyphony of every style x mood against the voice caps.
 * 2. Render (needs Chrome / Edge and Node >= 22; skipped with a warning otherwise, or with --no-render): every style x mood is rendered
 *    through headless Chrome's OfflineAudioContext (the real synth, music volume 1.0 = worst case) and analysed by tools/dev/audio_dsp.js:
 *    no NaN, peak <= -1 dBFS, DC offset ~ 0, no dropped voices, no unintended silence, loudness within a few dB of the chip version
 *    of the same mood, loop seam no harsher than the other section boundaries, no obvious repetition within 40 s.
 *    --chip also renders the chip style (default: new styles only; the chip loudness baseline below was measured once).
 * Exit code 1 on any error.
 */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm"), os = require("os"), cp = require("child_process");
const ROOT = path.resolve(__dirname, "..", "..");
const sandbox = {console, setTimeout, clearTimeout, setInterval, clearInterval};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "src/js/registry.js"), "utf8"), sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "src/js/audio.js"), "utf8"), sandbox);
const A = sandbox.WH.Audio;

let errors = 0, warns = 0;
const err = (m) => { errors++; console.log("  ERROR " + m); };
const warn = (m) => { warns++; console.log("  warn  " + m); };

const REQUIRED_MOODS = ["title", "calm", "holy", "tense", "battle", "boss", "warp", "tau", "aeldari", "necron", "orks", "gsc", "mechanicus",
                        "happy", "death", "bad"];
const REQUIRED_SFX = ["click", "hover", "select", "start", "type", "damage", "heal", "sanity", "corrupt", "event", "warp", "codex", "save", "death", "ending_good",
                      "consequence", "scan"];
// v0.2/v0.3 moods: tempo window + minimum share of on-beat melody notes that are chord tones (SPEC §15, §26);
// drums = drum voices the mood's character relies on (orks big toms, gsc insect clicks, mechanicus anvil hits)
const NEW_MOODS = {aeldari: {bpm: [64, 76], tones: 75}, necron: {bpm: [80, 96], tones: 75},
                   orks: {bpm: [130, 150], tones: 75, drums: ["T", "k", "s"]},
                   gsc: {bpm: [60, 72], tones: 75, drums: ["i"], stacks: [11, -6]},
                   mechanicus: {bpm: [90, 104], tones: 75, drums: ["a", "m"], stacks: [7]}};
const API = ["unlock", "setMood", "stop", "sfx", "setMusicVolume", "setSfxVolume", "mute", "isMuted", "moodFor", "current",
             "getStyles", "getStyle", "setStyle", "previewStyle"];
const WAVES = new Set(["p12", "p25", "p50", "tri", "sine", "saw", "sq", "organ", "reed", "flute", "pno"]);
const ARGS = process.argv.slice(2), opt = (n, d) => (ARGS.includes(n) && ARGS[ARGS.indexOf(n) + 1] && !ARGS[ARGS.indexOf(n) + 1].startsWith("--") ? ARGS[ARGS.indexOf(n) + 1] : d);
const ONLY_STYLES = opt("--styles", "").split(",").filter(Boolean), ONLY_MOODS = opt("--moods", "").split(",").filter(Boolean);
const NEW_STYLES = ["dark", "organ", "synth", "piano"];

console.log("API");
API.forEach((f) => { if (typeof A[f] !== "function") err("WH.Audio." + f + " missing"); });
console.log("Moods / SFX");
REQUIRED_MOODS.forEach((m) => { if (!A._songs[m]) err("mood '" + m + "' not defined"); });
REQUIRED_SFX.forEach((s) => { if (typeof A._sfx[s] !== "function") err("sfx '" + s + "' not implemented"); });
A.sfxNames.forEach((s) => { if (!REQUIRED_SFX.includes(s)) warn("extra sfx name " + s); });

console.log("\nSongs");
console.log("  mood       key                        bpm  intro loop(bars)  loop(s)  lead chord-tones on beats  range");
for (const id of A.moods) {
  const S = A._songs[id], c = A._compile(id);
  c.errors.forEach((e) => err(e));
  // instrument sanity
  for (const [k, I] of Object.entries(S.ch)) {
    const ws = Array.isArray(I.w) ? I.w : [I.w];
    ws.forEach((w) => { if (!WAVES.has(w)) err(`${id}.ch.${k}: unknown wave ${w}`); });
    if (!(I.v > 0 && I.v <= 0.5)) err(`${id}.ch.${k}: volume ${I.v} out of range`);
    if (I.env && I.env.length !== 4) err(`${id}.ch.${k}: env must be [a,d,s,r]`);
  }
  for (const sec of Object.values(S.sections)) for (const ch of Object.values(sec.inst || {}))
    (Array.isArray(ch.w) ? ch.w : [ch.w]).forEach((w) => { if (w && !WAVES.has(w)) err(`${id}: inst override wave ${w}`); });
  // loop length rules: 16–32 bars (death = short intro + quiet loop)
  if (id !== "death" && (c.loopBars < 16 || c.loopBars > 32)) err(`${id}: loop is ${c.loopBars} bars (want 16–32)`);
  if (id === "death" && !(c.introBars > 0)) err("death: needs a one-shot intro phrase");
  // every channel defined in ch is used somewhere
  const used = new Set();
  c.sections.forEach((s) => s.ev.forEach((evs) => (evs || []).forEach((e) => e.c && used.add(e.c))));
  Object.keys(S.ch).forEach((k) => { if (!used.has(k)) warn(`${id}: channel '${k}' never plays`); });
  // sections differ (A/B variety)
  const names = c.sections.map((s) => s.name);
  if (new Set(S.order).size < 2 && !S.intro) warn(`${id}: order has a single section`);
  // harmony stats on literal melodies (main loop sections)
  let strong = 0, tones = 0, lo = 999, hi = 0;
  c.sections.forEach((s) => { strong += s.stat.strong; tones += s.stat.chordTone; if (s.stat.notes) { lo = Math.min(lo, s.stat.lo); hi = Math.max(hi, s.stat.hi); } });
  const pct = strong ? Math.round(100 * tones / strong) : 0;
  const NM = NEW_MOODS[id];
  if (NM) {
    if (c.bpm < NM.bpm[0] || c.bpm > NM.bpm[1]) err(`${id}: ${c.bpm} bpm outside ${NM.bpm[0]}–${NM.bpm[1]}`);
    if (pct < NM.tones) err(`${id}: ${pct}% on-beat chord tones (want ≥ ${NM.tones}%)`);
    const order = S.order.join(",");
    if (order !== "A,B,A2,B2") err(`${id}: order ${order} (want A,B,A2,B2)`);
    if (c.loopBars !== 32) err(`${id}: loop is ${c.loopBars} bars (want 32)`);
    const hits = new Set();
    c.sections.forEach((s) => s.ev.forEach((evs) => (evs || []).forEach((e) => e.k && hits.add(e.k))));
    (NM.drums || []).forEach((k) => { if (!hits.has(k)) err(`${id}: never plays drum voice '${k}'`); });
    const stacks = new Set([].concat(...Object.values(S.ch).map((I) => I.stack || [])));
    (NM.stacks || []).forEach((st) => { if (!stacks.has(st)) err(`${id}: no instrument stacks interval ${st}`); });
  }
  const nm = (m) => ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][m % 12] + (Math.floor(m / 12) - 1);
  if (strong && pct < 60 && id !== "warp") warn(`${id}: only ${pct}% of on-beat melody notes are chord tones`);
  if (hi > 96 || lo < 40) warn(`${id}: melody range ${nm(lo)}–${nm(hi)} is extreme`);
  console.log("  " + id.padEnd(10) + " " + String(c.key).padEnd(26) + " " + String(c.bpm).padStart(3) + "  " +
    String(c.introBars).padStart(5) + " " + String(c.loopBars).padStart(10) + " " + c.loopSec.toFixed(1).padStart(8) + "  " +
    (strong ? (pct + "% (" + tones + "/" + strong + ")") : "-").padStart(26) + "  " + (strong ? nm(lo) + "–" + nm(hi) : "-") +
    "   [" + names.join(",") + "]");
}

console.log("\nMusic styles (SPEC §29)");
const STY = A.getStyles(), styleIds = STY.map((x) => x.id);
if (styleIds[0] !== "chip") err("getStyles()[0] must be chip");
if (styleIds.filter((i) => i !== "chip").length < 3) err("need at least 3 new styles besides chip");
if (new Set(styleIds).size !== styleIds.length) err("duplicate style ids");
STY.forEach((x) => {
  if (!/^[a-z0-9_-]{1,24}$/i.test(x.id)) err(`style id '${x.id}' is not a plain id`);
  for (const f of ["name", "desc"]) for (const l of ["zh", "en"]) if (!x[f] || typeof x[f][l] !== "string" || !x[f][l].trim()) err(`style ${x.id}: ${f}.${l} missing`);
  if (x.desc && x.desc.zh && x.desc.zh.length > 60) warn(`style ${x.id}: zh description is ${x.desc.zh.length} chars`);
});
if (JSON.stringify(A.styles) !== JSON.stringify(STY)) err("WH.Audio.styles differs from getStyles()");
if (A.getStyle() !== "chip") err("default style must be chip");
if (A.setStyle("no-such-style") !== "chip" || A.getStyle() !== "chip") err("setStyle(unknown) must give chip");
const firstNew = styleIds.find((i) => i !== "chip");
if (A.setStyle(firstNew) !== firstNew || A.getStyle() !== firstNew) err("setStyle(id) / getStyle() mismatch");
A.setStyle("chip");
if (A.getStyle() !== "chip") err("setStyle('chip') did not restore chip");
try { if (A.previewStyle(firstNew) !== false) err("previewStyle without an AudioContext must return false"); } catch (e) { err("previewStyle threw: " + e.message); }
console.log("  styles: " + styleIds.join(", "));

const DRUM_END = {c: 1.5, w: 2.6, z: 0.6, a: 0.8, T: 0.6, g: 3.8, b: 0.7};
function polyphony(id, st) {                      // notes / oscillators / drum voices alive at once (same rule as Engine.voiceOk), 2 passes of the loop
  const S = A._styleSong(id, st), c = A._compile(id, st), seq = c.seq.concat(c.seq.slice(c.loopFrom));
  let t = 0; const N = [], D = [];
  for (const si of seq) {
    const sec = c.sections[si];
    sec.ev.forEach((evs, step) => (evs || []).forEach((e) => {
      const ts = t + step * c.stepSec;
      if (e.k) { D.push([ts, ts + (DRUM_END[e.k] || 0.4), 1]); return; }
      const I = S.ch[e.c], env = I.env || [0.01, 0.1, 0.7, 0.1], len = Math.max(0.03, e.d * c.stepSec * (I.gate == null ? 0.9 : I.gate));
      const n = Array.isArray(e.m) ? e.m.length : 1, osc = 1 + (I.uni ? 1 : 0) + (I.stack || []).length;
      for (let k = 0; k < n; k++) N.push([ts, ts + len + env[3] * 1.5 + 0.02, osc]);
    }));
    t += sec.len * c.stepSec;
  }
  const peak = (list) => {
    const ev = [];
    list.forEach(([a, b, w]) => { ev.push([a, w], [b, -w]); });
    ev.sort((x, y) => x[0] - y[0] || x[1] - y[1]);                  // ends before starts at the same time
    let cur = 0, max = 0;
    for (const [, w] of ev) { cur += w; if (cur > max) max = cur; }
    return max;
  };
  return {notes: peak(N.map(([a, b]) => [a, b, 1])), oscs: peak(N), drums: peak(D)};
}
const chipPoly = Math.max(...A.moods.map((m) => polyphony(m, "chip").oscs));
console.log(`  (chip's busiest mood: ${chipPoly} oscillators at once; caps: 40 notes, 14 drum voices)`);
console.log("  style  mood       bpm  loop(bars)  loop(s)  sects  notes/oscs/drums  chord-tones  channels");
const styleSongs = [];
for (const st of styleIds.filter((i) => i !== "chip")) {
  for (const id of A.moods) {
    const S = A._styleSong(id, st), c = A._compile(id, st), tag = `${st}.${id}`;
    styleSongs.push({st, id});
    c.errors.forEach((e) => err(e));
    for (const [k, I] of Object.entries(S.ch)) {
      const ws = Array.isArray(I.w) ? I.w : [I.w];
      ws.forEach((w) => { if (!WAVES.has(w)) err(`${tag}.ch.${k}: unknown wave ${w}`); });
      if (!(I.v > 0 && I.v <= 0.5)) err(`${tag}.ch.${k}: volume ${I.v} out of range`);
      if (I.env && I.env.length !== 4) err(`${tag}.ch.${k}: env must be [a,d,s,r]`);
      if (I.fe && (I.fe.length !== 3 || !(I.fe[2] > 0))) err(`${tag}.ch.${k}: fe must be [startX, endX, tau]`);
    }
    if (!S.trim || !(S.trim > 0.2 && S.trim < 4)) err(`${tag}: loudness trim ${S.trim} out of range (-14..+12 dB)`);
    if (c.loopBars < 16 || c.loopBars > 32) err(`${tag}: loop is ${c.loopBars} bars (want 16-32)`);
    if (c.loopSec < 40) err(`${tag}: loop is only ${c.loopSec.toFixed(1)} s (want >= 40 s before the music repeats)`);
    if (id === "death" && !(c.introBars > 0)) err(`${tag}: death needs a one-shot intro phrase`);
    if (id !== "death" && c.introBars) err(`${tag}: unexpected intro`);
    const used = new Set();
    c.sections.forEach((x) => x.ev.forEach((evs) => (evs || []).forEach((e) => e.c && used.add(e.c))));
    Object.keys(S.ch).forEach((k) => { if (!used.has(k)) err(`${tag}: channel '${k}' never plays`); });
    // sections must differ (no verbatim repeated 8-bar section inside the loop)
    const sig = c.sections.map((x) => JSON.stringify(x.ev));
    if (new Set(sig).size !== sig.length) err(`${tag}: two sections are identical`);
    if (new Set(c.seq.slice(c.loopFrom)).size !== c.seq.length - c.loopFrom) err(`${tag}: a section is played twice inside the loop`);
    // every drum voice / bar of a mood is used, patterns exist (compile already reports unknown names)
    let strong = 0, tones = 0;
    c.sections.forEach((x) => { strong += x.stat.strong; tones += x.stat.chordTone; });
    const pct = strong ? Math.round(100 * tones / strong) : 100;
    if (strong && pct < 45) warn(`${tag}: only ${pct}% of on-beat melody notes are chord tones`);
    const pp = polyphony(id, st);
    if (pp.notes > 40) err(`${tag}: ${pp.notes} simultaneous notes (cap 40 -> notes would be dropped)`);
    if (pp.drums > 14) err(`${tag}: ${pp.drums} simultaneous drum voices (cap 14)`);
    if (pp.oscs > Math.round(chipPoly * 1.5)) err(`${tag}: ${pp.oscs} simultaneous oscillators (chip peaks at ${chipPoly}; keep a mid-range phone in mind)`);
    else if (pp.oscs > Math.round(chipPoly * 1.25)) warn(`${tag}: ${pp.oscs} simultaneous oscillators (chip peaks at ${chipPoly})`);
    console.log("  " + st.padEnd(6) + " " + id.padEnd(10) + String(c.bpm).padStart(4) + String(c.loopBars + (c.introBars ? "+" + c.introBars : "")).padStart(10) +
      c.loopSec.toFixed(1).padStart(9) + String(c.sections.length).padStart(8) + `  ${pp.notes}/${pp.oscs}/${pp.drums}`.padEnd(18) + (strong ? pct + "%" : "-").padStart(8) + "     " + Object.keys(S.ch).join(","));
  }
}

console.log("\nmoodFor()");
const cases = [
  [{scene: "hive_hab", music: "holy"}, {}, "imperium", "holy"],
  [{scene: "hive_hab", ending: {kind: "death"}}, {}, "imperium", "death"],
  [{scene: "hive_hab", ending: {kind: "bad"}}, {}, "imperium", "bad"],
  [{scene: "hive_hab", ending: {kind: "good"}}, {}, "imperium", "happy"],
  [{scene: "hive_hab", foe: "hive_tyrant"}, {}, "tau", "boss"],
  [{scene: "void", foe: "omen_black_crusade"}, {}, "imperium", "boss"],
  [{scene: "trench", foe: "ork"}, {}, "imperium", "battle"],
  [{scene: "warp"}, {}, "chaos", "warp"],
  [{scene: "cult_shrine"}, {}, "chaos", "warp"],
  [{scene: "cathedral"}, {}, "imperium", "holy"],
  [{scene: "tau_city"}, {}, "imperium", "tau"],
  [{scene: "jungle"}, {}, {id: "tau"}, "tau"],
  [{scene: "ruins"}, {}, "tau", "tense"],
  [{scene: "hive_hab"}, {stats: {sanity: 20}}, "imperium", "tense"],
  [{scene: "hive_hab"}, {stats: {sanity: 80}}, "imperium", "calm"],
  [null, {}, "imperium", "calm"],
  // v0.2 — Aeldari / Necrons
  [{scene: "craftworld"}, {}, "aeldari", "aeldari"],
  [{scene: "webway"}, {}, "aeldari", "aeldari"],
  [{scene: "maiden_world"}, {stats: {sanity: 90}}, "imperium", "aeldari"],
  [{scene: "tomb_exterior"}, {}, "necrons", "necron"],
  [{scene: "tomb_interior"}, {}, "aeldari", "necron"],
  [{scene: "stasis_gallery"}, {}, "necrons", "necron"],
  [{scene: "dig_site"}, {}, "necrons", "necron"],
  [{scene: "jungle"}, {}, "aeldari", "aeldari"],
  [{scene: "void"}, {}, {id: "necrons"}, "necron"],
  [{scene: "void"}, {faction: "necrons"}, null, "necron"],
  [{scene: "ruins"}, {}, "aeldari", "tense"],
  [{scene: "ship_interior"}, {stats: {sanity: 10}}, "necrons", "tense"],
  [{scene: "warp"}, {}, "aeldari", "warp"],
  [{scene: "webway", foe: "drukhari_raider"}, {}, "aeldari", "battle"],
  [{scene: "craftworld", foe: "greater_daemon_slaanesh"}, {}, "aeldari", "boss"],
  [{scene: "craftworld", foe: "wraith_construct"}, {}, "aeldari", "boss"],
  [{scene: "tomb_interior", foe: "necron_warrior"}, {}, "necrons", "battle"],
  [{scene: "tomb_interior", foe: "necron_lord"}, {}, "necrons", "boss"],
  [{scene: "dig_site", foe: "canoptek_spyder"}, {}, "necrons", "boss"],
  [{scene: "stasis_gallery", foe: "omen_ctan"}, {}, "necrons", "boss"],
  [{scene: "tomb_interior", ending: {kind: "death"}}, {}, "necrons", "death"],
  [{scene: "craftworld", ending: {kind: "good"}}, {}, "aeldari", "happy"],
  [{scene: "dig_site", music: "tense"}, {}, "necrons", "tense"],
  // v0.3 — Orks / Genestealer Cult / Adeptus Mechanicus (SPEC §26)
  [{scene: "ork_scrapyard"}, {}, "orks", "orks"],
  [{scene: "ork_fort"}, {}, "orks", "orks"],
  [{scene: "ork_fort"}, {stats: {sanity: 10}}, "imperium", "orks"],
  [{scene: "mine_shaft"}, {}, "gsc", "gsc"],
  [{scene: "gsc_chapel"}, {}, "gsc", "gsc"],
  [{scene: "mine_shaft"}, {stats: {sanity: 5}}, "mechanicus", "gsc"],
  [{scene: "forge_floor"}, {}, "mechanicus", "mechanicus"],
  [{scene: "mars_vista"}, {}, "mechanicus", "mechanicus"],
  [{scene: "tech_vault"}, {}, "orks", "mechanicus"],
  [{scene: "hive_hab"}, {stats: {sanity: 80}}, "orks", "orks"],
  [{scene: "hive_hab"}, {}, {id: "gsc"}, "gsc"],
  [{scene: "void"}, {faction: "mechanicus"}, null, "mechanicus"],
  [{scene: "ruins"}, {}, "orks", "tense"],
  [{scene: "hive_hab"}, {stats: {sanity: 20}}, "gsc", "tense"],
  [{scene: "warp"}, {}, "mechanicus", "warp"],
  [{scene: "cathedral"}, {}, "gsc", "holy"],
  [{scene: "ork_scrapyard", foe: "gretchin"}, {}, "orks", "battle"],
  [{scene: "ork_fort", foe: "ork_nob"}, {}, "orks", "boss"],
  [{scene: "ork_fort", foe: "omen_waaagh"}, {}, "orks", "boss"],
  [{scene: "mine_shaft", foe: "gsc_neophyte"}, {}, "gsc", "battle"],
  [{scene: "gsc_chapel", foe: "gsc_patriarch"}, {}, "gsc", "boss"],
  [{scene: "mine_shaft", foe: "gsc_primus"}, {}, "gsc", "boss"],
  [{scene: "mine_shaft", foe: "hive_tyrant"}, {}, "gsc", "boss"],
  [{scene: "forge_floor", foe: "skitarius"}, {}, "mechanicus", "battle"],
  [{scene: "forge_floor", foe: "daemon_engine"}, {}, "mechanicus", "boss"],
  [{scene: "tech_vault", foe: "kastelan_robot"}, {}, "mechanicus", "boss"],
  [{scene: "mars_vista", foe: "dark_mechanicus"}, {}, "mechanicus", "boss"],
  [{scene: "gsc_chapel", ending: {kind: "bad"}}, {}, "gsc", "bad"],
  [{scene: "forge_floor", ending: {kind: "death"}}, {}, "mechanicus", "death"],
  [{scene: "ork_fort", ending: {kind: "good"}}, {}, "orks", "happy"],
  [{scene: "gsc_chapel", music: "warp"}, {}, "gsc", "warp"],
];
cases.forEach(([n, s, f, want]) => {
  const got = A.moodFor(n, s, f);
  if (got !== want) err(`moodFor(${JSON.stringify(n)}, ${JSON.stringify(s)}, ${JSON.stringify(f)}) = ${got}, expected ${want}`);
});
console.log("  " + cases.length + " cases checked");

// every scene / foe used in the story data maps to a defined mood
try {
  const data = {console};
  data.globalThis = data; vm.createContext(data);
  vm.runInContext(fs.readFileSync(path.join(ROOT, "src/js/registry.js"), "utf8"), data);
  const fdir = path.join(ROOT, "data/factions");
  for (const f of fs.readdirSync(fdir)) if (f.endsWith(".js")) {
    try { vm.runInContext(fs.readFileSync(path.join(fdir, f), "utf8"), data); }      // one broken / in-progress file
    catch (e) { warn(`mood tally skips data/factions/${f}: ${e.message}`); }          // must not hide the others
  }
  const tally = {};
  for (const fac of Object.values(data.WH.factions)) for (const n of Object.values(fac.nodes || {})) {
    const m = A.moodFor(n, {stats: {sanity: 100}}, fac.id);
    if (!A._songs[m]) err(`node mood ${m} undefined`);
    tally[fac.id] = tally[fac.id] || {}; tally[fac.id][m] = (tally[fac.id][m] || 0) + 1;
    if (n.music && !A._songs[n.music]) err(`node music '${n.music}' is not a mood`);
  }
  for (const [f, t] of Object.entries(tally)) console.log("  " + f.padEnd(9) + Object.entries(t).sort((a, b) => b[1] - a[1]).map(([m, k]) => m + " " + k).join(", "));
} catch (e) { warn("could not load story data for mood tally: " + e.message); }

/* =====================================================================================
 * Render stage: every style x mood through headless Chrome (CDP over the global WebSocket of Node >= 22, no npm packages)
 * ===================================================================================== */
// Chip loudness baseline: RMS (dBFS, mono, music volume 1.0, 0.5 s .. end of the first loop) of every chip mood at 22050 Hz, measured with
// `node tools/dev/audio_check.js --chip --print-baseline`. A new style must land within RMS_ERR dB of the chip version of the same mood.
const CHIP_RMS = {title: -13.1, calm: -16.9, holy: -14.4, tense: -21.9, battle: -16.7, boss: -17.1, warp: -14.2, tau: -14.9, aeldari: -14.4, necron: -18.8,
                  orks: -15.4, gsc: -14.5, mechanicus: -15.9, happy: -15.3, death: -16.5, bad: -14.9};
const RMS_WARN = 2.5, RMS_ERR = 4.0, SEAM_MAX = 2.0, SEAM_REF_MAX = 1.5, REP_MAX = 0.95, DC_MAX = 0.002, PEAK_MAX = -1.0;

function findChrome() {
  const c = [process.env.CHROME, "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"];
  return c.find((x) => x && fs.existsSync(x));
}
function cdpConnect(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url), pending = new Map(); let seq = 0;
    ws.onerror = () => reject(new Error("cannot connect to Chrome DevTools"));
    ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } };
    ws.onopen = () => resolve({
      send: (method, params, sessionId) => new Promise((res, rej) => { const id = ++seq; pending.set(id, {res, rej}); ws.send(JSON.stringify({id, method, params: params || {}, sessionId})); }),
      close: () => ws.close()
    });
  });
}
function evaluate(results, styles, sr, jobs, secs) {
    results.sort((a, b) => styleIds.indexOf(a.st) - styleIds.indexOf(b.st) || A.moods.indexOf(a.id) - A.moods.indexOf(b.id));
    console.log(`  ${results.length} renders${secs ? " in " + secs.toFixed(0) + " s" : ""} (sr ${sr}${jobs ? ", " + jobs + " parallel pages" : ""})`);
    console.log("  style  mood        peak dBFS   RMS dBFS (chip)   DC      quiet  seam/p99   repetition (corr @ s, lag s)   drops");
    for (const m of results) {
      const tag = `${m.st}.${m.id}`, base = CHIP_RMS[m.id], d = m.rmsDb - base, rep = m.rep && m.rep.corr != null ? m.rep : null;
      const seamR = m.seam && m.seam.ratio != null ? m.seam.ratio : null, drops = Object.values(m.drops || {}).reduce((a, b) => a + b, 0);
      console.log("  " + m.st.padEnd(6) + " " + m.id.padEnd(10) + m.peakDb.toFixed(1).padStart(8) + (m.rmsDb.toFixed(1) + " (" + (d >= 0 ? "+" : "") + d.toFixed(1) + ")").padStart(18) +
        m.dc.toFixed(4).padStart(9) + (m.quiet.toFixed(1) + "s").padStart(8) + (seamR == null ? "-" : seamR.toFixed(2)).padStart(9) +
        (rep ? (rep.corr.toFixed(3) + " @" + rep.at.toFixed(0) + " lag " + rep.lag.toFixed(0)).padStart(28) : "-".padStart(28)) + String(drops).padStart(8));
      if (m.nan) err(`${tag}: ${m.nan} NaN / infinite samples`);
      if (m.peakDb > PEAK_MAX) err(`${tag}: peak ${m.peakDb.toFixed(1)} dBFS (limit ${PEAK_MAX})`);
      if (m.dc > DC_MAX) err(`${tag}: DC offset ${m.dc.toFixed(4)} (limit ${DC_MAX})`);
      if (drops) err(`${tag}: ${drops} notes dropped by the voice caps ${JSON.stringify(m.drops)}`);
      if (m.quiet > (m.id === "death" || m.id === "bad" ? 6 : 3)) err(`${tag}: ${m.quiet.toFixed(1)} s of near silence`);
      if (m.st !== "chip" && Math.abs(d) > RMS_ERR) err(`${tag}: RMS ${m.rmsDb.toFixed(1)} dBFS is ${d.toFixed(1)} dB from the chip version (limit +-${RMS_ERR})`);
      else if (m.st !== "chip" && Math.abs(d) > RMS_WARN) warn(`${tag}: RMS ${d.toFixed(1)} dB from the chip version`);
      // a click = a step far above the piece AND harsher than the other section boundaries (an organ chiff or a drum hit on every downbeat is normal)
      const seamRef = m.seam && m.seam.others > 0 && m.seam.ref > 0 ? m.seam.hf / m.seam.ref : null;
      if (seamR != null && seamR > SEAM_MAX && (seamRef == null || seamRef > SEAM_REF_MAX)) err(`${tag}: the loop seam steps ${seamR.toFixed(2)}x the 99th percentile of the piece (limit ${SEAM_MAX})` + (seamRef == null ? "" : ` and ${seamRef.toFixed(2)}x the other section boundaries (limit ${SEAM_REF_MAX})`) + ": a click?");
      if (m.st !== "chip" && rep && rep.corr > REP_MAX) err(`${tag}: music repeats within 40 s (corr ${rep.corr.toFixed(3)} at ${rep.at.toFixed(0)} s, lag ${rep.lag.toFixed(0)} s)`);
    }
    if (ARGS.includes("--print-baseline")) console.log("\n  CHIP_RMS = " + JSON.stringify(Object.fromEntries(results.filter((m) => m.st === "chip").map((m) => [m.id, +m.rmsDb.toFixed(1)]))));
}
async function renderStage(jobs, sr, styles, moods) {
  const chrome = findChrome();
  if (typeof WebSocket === "undefined") { warn("render stage skipped: needs Node >= 22 (global WebSocket)"); return; }
  if (!chrome) { warn("render stage skipped: no Chrome / Edge found (set CHROME=/path/to/chrome)"); return; }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "wh-audio-"));
  const proc = cp.spawn(chrome, ["--headless=new", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage", "--no-first-run", "--remote-debugging-port=0",
    "--user-data-dir=" + tmp, "--autoplay-policy=no-user-gesture-required", "about:blank"], {stdio: ["ignore", "ignore", "pipe"]});
  let cleanup = () => { try { proc.kill(); } catch (e) {} try { fs.rmSync(tmp, {recursive: true, force: true}); } catch (e) {} };
  try {
    const wsUrl = await new Promise((res, rej) => {
      let buf = ""; const to = setTimeout(() => rej(new Error("Chrome did not start")), 20000);
      proc.stderr.on("data", (d) => { buf += d; const m = /DevTools listening on (ws:\/\/\S+)/.exec(buf); if (m) { clearTimeout(to); res(m[1]); } });
      proc.on("exit", () => rej(new Error("Chrome exited early")));
    });
    const br = await cdpConnect(wsUrl);
    const src = ["src/js/registry.js", "src/js/audio.js", "tools/dev/audio_dsp.js"].map((f) => fs.readFileSync(path.join(ROOT, f), "utf8")).join("\n;\n");
    const pages = [];
    for (let i = 0; i < jobs; i++) {
      const {targetId} = await br.send("Target.createTarget", {url: "about:blank"});
      const {sessionId} = await br.send("Target.attachToTarget", {targetId, flatten: true});
      const r = await br.send("Runtime.evaluate", {expression: src + "\n;typeof WH.Audio._render + typeof WH_DSP.analyze", returnByValue: true}, sessionId);
      if (r.exceptionDetails || r.result.value !== "functionfunction") throw new Error("could not load audio.js in Chrome: " + JSON.stringify(r.exceptionDetails || r.result));
      pages.push(sessionId);
    }
    const queue = [];
    for (const st of styles) for (const id of A.moods) if (!moods.length || moods.includes(id)) queue.push({st, id});
    const results = [], total = queue.length;
    const t0 = Date.now();
    await Promise.all(pages.map(async (sid) => {
      for (let job = queue.shift(); job; job = queue.shift()) {
        const expr = `(async () => { const A = WH.Audio, st = ${JSON.stringify(job.st)}, id = ${JSON.stringify(job.id)}, sr = ${sr};
          const info = A.songInfo(id, st), body = info.introSec + info.loopSec;
          const r = await A._render(id, body + 8, sr, st);
          const m = WH_DSP.analyze(r.buffer.getChannelData(0), r.buffer.getChannelData(1), sr, {bodyEnd: body, seams: r.loops, marks: r.marks, repMax: 40});
          m.drops = r.drops; m.loopSec = info.loopSec; m.introSec = info.introSec; return m; })()`;
        try {
          const r = await br.send("Runtime.evaluate", {expression: expr, awaitPromise: true, returnByValue: true}, sid);
          if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
          results.push(Object.assign({st: job.st, id: job.id}, r.result.value));
          process.stderr.write(`\r  rendered ${results.length}/${total}   `);
        } catch (e) { err(`${job.st}.${job.id}: render failed: ${e.message}`); }
      }
    }));
    br.close();
    if (opt("--json", "")) fs.writeFileSync(opt("--json", ""), JSON.stringify(results));
    evaluate(results, styles, sr, jobs, (Date.now() - t0) / 1000);
  } catch (e) { err("render stage failed: " + e.message); }
  finally { cleanup(); }
}

(async () => {
  if (!ARGS.includes("--no-render")) {
    console.log("\nRender stage (headless Chrome, OfflineAudioContext)");
    const styles = (ONLY_STYLES.length ? ONLY_STYLES : styleIds).filter((x) => styleIds.includes(x) && (x !== "chip" || ARGS.includes("--chip") || ONLY_STYLES.includes("chip")));
    if (opt("--from-json", "")) { const all = JSON.parse(fs.readFileSync(opt("--from-json", ""), "utf8")); evaluate(all.filter((m) => (!ONLY_STYLES.length || ONLY_STYLES.includes(m.st)) && (!ONLY_MOODS.length || ONLY_MOODS.includes(m.id))), styles, 0, 0, 0); }
    else await renderStage(Math.max(1, +opt("--jobs", 2) || 2), +opt("--sr", 22050) || 22050, styles, ONLY_MOODS);
  } else console.log("\nRender stage skipped (--no-render)");
  console.log(`\n${errors ? "FAIL" : "OK"} — ${errors} errors, ${warns} warnings`);
  process.exit(errors ? 1 : 0);
})();
