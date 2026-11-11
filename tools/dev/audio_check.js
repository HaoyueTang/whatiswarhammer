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
const API = ["unlock", "setMood", "stop", "sfx", "setMusicVolume", "setSfxVolume", "mute", "isMuted", "moodFor", "current"];
const WAVES = new Set(["p12", "p25", "p50", "tri", "sine", "saw", "sq"]);

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

console.log(`\n${errors ? "FAIL" : "OK"} — ${errors} errors, ${warns} warnings`);
process.exit(errors ? 1 : 0);
