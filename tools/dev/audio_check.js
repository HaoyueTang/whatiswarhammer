#!/usr/bin/env node
/* audio_check.js — static checks for src/js/audio.js (audio role).
 *   node tools/dev/audio_check.js
 * Parses every song's pattern data (note names, chord symbols, per-bar step counts, drum pattern lengths,
 * section inheritance), checks all moods / SFX exist, reports harmony stats, and unit-tests moodFor().
 * Exit code 1 on any error.
 */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
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

const REQUIRED_MOODS = ["title", "calm", "holy", "tense", "battle", "boss", "warp", "tau", "happy", "death", "bad"];
const REQUIRED_SFX = ["click", "hover", "select", "start", "type", "damage", "heal", "sanity", "corrupt", "event", "warp", "codex", "save", "death", "ending_good"];
const API = ["unlock", "setMood", "stop", "sfx", "setMusicVolume", "setSfxVolume", "mute", "isMuted", "moodFor", "current"];
const WAVES = new Set(["p12", "p25", "p50", "tri", "sine", "saw", "sq"]);

console.log("API");
API.forEach((f) => { if (typeof A[f] !== "function") err("WH.Audio." + f + " missing"); });
console.log("Moods / SFX");
REQUIRED_MOODS.forEach((m) => { if (!A._songs[m]) err("mood '" + m + "' not defined"); });
REQUIRED_SFX.forEach((s) => { if (typeof A._sfx[s] !== "function") err("sfx '" + s + "' not implemented"); });
A.sfxNames.forEach((s) => { if (!REQUIRED_SFX.includes(s)) warn("extra sfx name " + s); });

console.log("\nSongs");
console.log("  mood     key                          bpm  intro loop(bars)  loop(s)  lead chord-tones on beats  range");
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
  const nm = (m) => ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][m % 12] + (Math.floor(m / 12) - 1);
  if (strong && pct < 60 && id !== "warp") warn(`${id}: only ${pct}% of on-beat melody notes are chord tones`);
  if (hi > 96 || lo < 40) warn(`${id}: melody range ${nm(lo)}–${nm(hi)} is extreme`);
  console.log("  " + id.padEnd(8) + " " + String(c.key).padEnd(28) + " " + String(c.bpm).padStart(3) + "  " +
    String(c.introBars).padStart(5) + " " + String(c.loopBars).padStart(10) + " " + c.loopSec.toFixed(1).padStart(8) + "  " +
    (strong ? (pct + "% (" + tones + "/" + strong + ")") : "-").padStart(26) + "  " + (strong ? nm(lo) + "–" + nm(hi) : "-") +
    "   [" + names.join(",") + "]");
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
  for (const f of fs.readdirSync(fdir)) if (f.endsWith(".js")) vm.runInContext(fs.readFileSync(path.join(fdir, f), "utf8"), data);
  const tally = {};
  for (const fac of Object.values(data.WH.factions)) for (const n of Object.values(fac.nodes || {})) {
    const m = A.moodFor(n, {stats: {sanity: 100}}, fac.id);
    if (!A._songs[m]) err(`node mood ${m} undefined`);
    tally[fac.id] = tally[fac.id] || {}; tally[fac.id][m] = (tally[fac.id][m] || 0) + 1;
    if (n.music && !A._songs[n.music]) err(`node music '${n.music}' is not a mood`);
  }
  for (const [f, t] of Object.entries(tally)) console.log("  " + f.padEnd(9) + Object.entries(t).sort((a, b) => b[1] - a[1]).map(([m, k]) => m + " " + k).join(", "));
} catch (e) { warn("could not load story data for mood tally: " + e.message); }

console.log(`\n${errors ? "FAIL" : "OK"} — ${errors} errors, ${warns} warnings`);
process.exit(errors ? 1 : 0);
