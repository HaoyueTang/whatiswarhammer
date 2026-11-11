#!/usr/bin/env node
/* validate.js — data + link checker and Monte-Carlo playthrough simulator (SPEC §10). Owned by: web.
 *
 *   node tools/dev/validate.js              validate real data (data/**, assets/manifest.js)
 *   node tools/dev/validate.js --sample     validate tools/dev/sample_data.js instead of data/
 *   options: --runs N (default 3000)  --seed S (default 1)  --faction id  --quiet (errors/warnings summary only)
 *
 * Loads registry + manifest + data + the REAL engine (src/js/engine.js) into a vm context, so simulated runs
 * use exactly the game rules (effects, clamps, death checks, roll formula, warp time, events).
 * Exit code 1 if any error.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..", "..");
const argv = process.argv.slice(2);
function arg(name, def) { const i = argv.indexOf(name); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : def; }
const SAMPLE = argv.includes("--sample");
const QUIET = argv.includes("--quiet");
const RUNS = parseInt(arg("--runs", "3000"), 10);
const SEED = parseInt(arg("--seed", "1"), 10);
const ONLY = arg("--faction", null);
const STEP_LIMIT = 1500;

const errors = [], warnings = [], notes = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m), note = (m) => notes.push(m);

/* ---------- SPEC §7 fixed key lists (used to cross-check the manifest, or as fallback if it's missing) ---------- */
const SPEC_SPRITES = ("player_imperium player_chaos player_tau hive_foreman preacher guardsman guard_sergeant commissar medicae " +
  "tech_priest servitor inquisitor psyker enforcer astartes cultist cult_magus mutant heretic_astartes chaos_sorcerer " +
  "daemon_khorne daemon_nurgle daemon_tzeentch daemon_slaanesh daemon_prince grey_knight tau_warrior tau_ethereal " +
  "tau_battlesuit tau_drone kroot gue_vesa tau_water_caste ork ork_boss gaunt genestealer tyranid_warrior hive_tyrant " +
  "omen_emperor omen_primarch omen_black_crusade omen_hivemind omen_purge omen_tau_fleet omen_farsight " +
  "sigil_khorne sigil_nurgle sigil_tzeentch sigil_slaanesh sigil_undivided").split(" ");
const SPEC_SCENES = ("title hive_hab hive_spire underhive manufactorum cathedral barracks trench ship_interior warp void ruins " +
  "jungle cult_shrine daemon_world tau_city tau_outpost spore_sky burning_city throne_light").split(" ");
const SPEC_UI = "icon_hp icon_sanity icon_corruption icon_faith icon_favor icon_greatergood icon_clock icon_codex icon_save icon_lang".split(" ");
const GODS = ["khorne", "nurgle", "tzeentch", "slaanesh", "undivided", "other"];
const CODEX_CATS = ["leader", "enemy", "boss", "god", "lore", "place"];
const CODEX_FACTIONS = ["imperium", "chaos", "tau", "xenos", "any"];
const STATS = ["hp", "sanity", "corruption", "renown"];
const PREFIX = {imperium: "imp_", chaos: "cha_", tau: "tau_"};

/* ---------- load into vm ---------- */
const ctx = vm.createContext({console: {log() {}, warn() {}, error() {}}, Math, Date, JSON, Object, Array});
const loaded = [];
function load(rel, required) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) { (required ? err : warn)(`file missing: ${rel}`); return false; }
  try { vm.runInContext(fs.readFileSync(p, "utf8"), ctx, {filename: rel}); loaded.push(rel); return true; }
  catch (e) { err(`${rel}: throws while loading → ${e.message}`); return false; }
}
load("src/js/registry.js", true);
const hasManifest = load("assets/manifest.js", false);
if (SAMPLE) load("tools/dev/sample_data.js", true);
else {
  load("data/codex.js", true);
  load("data/events.js", true);
  const fdir = path.join(ROOT, "data", "factions");
  const files = fs.existsSync(fdir) ? fs.readdirSync(fdir).filter((f) => f.endsWith(".js")).sort() : [];
  for (const id of ["imperium", "chaos", "tau"]) if (!files.includes(id + ".js")) warn(`data/factions/${id}.js missing (index.html loads it)`);
  for (const f of files) load("data/factions/" + f, false);
}
load("src/js/engine.js", true);
const WH = ctx.WH;
if (!WH || !WH.Game) { console.log("FATAL: registry/engine not loaded"); errors.forEach((e) => console.log("  ERROR " + e)); process.exit(2); }

/* ---------- helpers ---------- */
const zhLen = (s) => Array.from(String(s).replace(/\s/g, "")).length;
const enWords = (s) => String(s).trim().split(/\s+/).filter(Boolean).length;
function checkL(obj, where, zhMax, enMax, optional) {
  if (obj === undefined || obj === null) { if (!optional) err(`${where}: missing localized text`); return; }
  if (typeof obj !== "object") { err(`${where}: expected {zh,en}, got ${typeof obj}`); return; }
  for (const l of ["zh", "en"]) if (typeof obj[l] !== "string" || !obj[l].trim()) err(`${where}: missing ${l}`);
  if (zhMax && typeof obj.zh === "string" && zhLen(obj.zh) > zhMax) warn(`${where}: zh ${zhLen(obj.zh)} chars > ${zhMax}`);
  if (enMax && typeof obj.en === "string" && enWords(obj.en) > enMax) warn(`${where}: en ${enWords(obj.en)} words > ${enMax}`);
}
const spriteKeys = new Set(hasManifest && Object.keys(WH.sprites).length ? Object.keys(WH.sprites) : SPEC_SPRITES);
const sceneKeys = new Set(hasManifest && Object.keys(WH.scenes).length ? Object.keys(WH.scenes) : SPEC_SCENES);
const uiKeys = new Set(hasManifest && Object.keys(WH.ui).length ? Object.keys(WH.ui) : SPEC_UI);
if (!hasManifest) note("assets/manifest.js not found — asset keys checked against the SPEC §7 key list instead");
const sprite = (k, where) => { if (k && !spriteKeys.has(k)) err(`${where}: unknown sprite "${k}"`); };
const scene = (k, where) => { if (!k) err(`${where}: missing scene`); else if (!sceneKeys.has(k)) err(`${where}: unknown scene "${k}"`); };
const unknownCodex = new Map();   // id -> [where] (reported once per id at the end)
const codexRef = (ids, where) => { for (const id of [].concat(ids || [])) if (!WH.codex[id]) { if (!unknownCodex.has(id)) unknownCodex.set(id, []); unknownCodex.get(id).push(where); } };
function flushUnknownCodex() {
  for (const [id, ws] of unknownCodex) err(`unknown codex id "${id}" — referenced ${ws.length}× (${ws.slice(0, 4).join(", ")}${ws.length > 4 ? ", …" : ""})`);
  unknownCodex.clear();
}
function checkEffects(e, where) {
  if (!e) return;
  for (const k of Object.keys(e)) {
    if (STATS.includes(k)) { if (typeof e[k] !== "number") err(`${where}: effect ${k} not a number`); }
    else if (k === "set") { if (typeof e.set !== "object") err(`${where}: effects.set must be an object`); }
    else if (k === "unset") { if (!Array.isArray(e.unset)) err(`${where}: effects.unset must be an array`); }
    else warn(`${where}: unknown effect key "${k}"`);
  }
}
function checkRequire(r, where, flagsSet) {
  if (!r) return;
  for (const q of [].concat(r)) {
    const keys = Object.keys(q);
    if (!keys.length) err(`${where}: empty require`);
    for (const k of keys) if (!["flag", "notFlag", "stat", "min", "max"].includes(k)) err(`${where}: unknown require key "${k}"`);
    if (q.stat && !STATS.includes(q.stat)) err(`${where}: require.stat "${q.stat}" invalid`);
    if (q.stat && q.min === undefined && q.max === undefined) err(`${where}: require.stat without min/max`);
    for (const f of [q.flag, q.notFlag]) if (f && !flagsSet.has(f)) warn(`${where}: flag "${f}" is never set by any effect`);
  }
}

/* ---------- manifest ---------- */
function checkManifest() {
  if (!hasManifest) return;
  const groups = [["sprites", WH.sprites, SPEC_SPRITES], ["scenes", WH.scenes, SPEC_SCENES], ["ui", WH.ui, SPEC_UI]];
  for (const [g, reg, spec] of groups) {
    const missing = spec.filter((k) => !reg[k]);
    if (missing.length) warn(`manifest: ${missing.length} SPEC §7 ${g} key(s) not registered: ${missing.join(", ")}`);
    for (const k of Object.keys(reg)) {
      const a = reg[k];
      if (!a || !a.src) { err(`manifest ${g}.${k}: missing src`); continue; }
      if (!fs.existsSync(path.join(ROOT, a.src))) warn(`manifest ${g}.${k}: file not found ${a.src}`);
      if (!a.w || !a.h) warn(`manifest ${g}.${k}: missing w/h`);
    }
  }
}

/* ---------- codex + events ---------- */
function checkCodex() {
  const ids = Object.keys(WH.codex);
  if (!ids.length) err("codex: no entries registered");
  for (const id of ids) {
    const c = WH.codex[id], w = `codex.${id}`;
    if (!CODEX_CATS.includes(c.cat)) err(`${w}: bad cat "${c.cat}"`);
    if (!CODEX_FACTIONS.includes(c.faction)) err(`${w}: bad faction "${c.faction}"`);
    sprite(c.sprite, w);
    if (c.cat === "place") {
      if (!c.scene) warn(`${w}: place entry without scene`);
      else scene(c.scene, w + ".scene");
    } else {
      if (!c.sprite) warn(`${w}: no sprite`);
      if (c.scene) scene(c.scene, w + ".scene");
    }
    checkL(c.name, w + ".name");
    checkL(c.text, w + ".text", 45, 30);
    if (c.more !== undefined) checkL(c.more, w + ".more", 90, 65);
    if (c.aliases !== undefined) {
      if (typeof c.aliases !== "object") err(`${w}.aliases: expected {zh:[...], en:[...]}`);
      else for (const l of Object.keys(c.aliases)) {
        if (!["zh", "en"].includes(l)) warn(`${w}.aliases: unknown language "${l}"`);
        if (!Array.isArray(c.aliases[l]) || c.aliases[l].some((x) => typeof x !== "string" || !x.trim())) err(`${w}.aliases.${l}: must be an array of non-empty strings`);
      }
    }
  }
}
function checkEvents() {
  const seen = new Set(), perGod = {};
  if (!WH.events.length) warn("events: none registered");
  for (const e of WH.events) {
    const w = `event.${e.id}`;
    if (!e.id) { err("event without id"); continue; }
    if (seen.has(e.id)) err(`${w}: duplicate id`);
    seen.add(e.id);
    if (!GODS.includes(e.god)) err(`${w}: bad god "${e.god}"`);
    perGod[e.god] = (perGod[e.god] || 0) + 1;
    for (const f of e.factions || []) if (f !== "*" && !WH.factions[f]) warn(`${w}: faction "${f}" not loaded`);
    scene(e.scene, w);
    if (e.speaker) { sprite(e.speaker.sprite, w + ".speaker"); checkL(e.speaker.name, w + ".speaker.name"); }
    sprite(e.foe, w + ".foe");
    checkL(e.text, w + ".text", 90, 65);
    codexRef(e.codex, w);
    if (!e.choices || e.choices.length < 2 || e.choices.length > 3) err(`${w}: needs 2–3 choices (has ${(e.choices || []).length})`);
    (e.choices || []).forEach((c, i) => {
      checkL(c.text, `${w}.choice${i + 1}.text`, 24, 14);
      checkL(c.result, `${w}.choice${i + 1}.result`, 90, 65);
      checkEffects(c.effects, `${w}.choice${i + 1}`);
      codexRef(c.codex, `${w}.choice${i + 1}`);
    });
  }
  if (!SAMPLE) {
    if (WH.events.length && WH.events.length < 10) warn(`events: ${WH.events.length} registered (spec ~12)`);
    for (const g of ["khorne", "nurgle", "tzeentch", "slaanesh"]) if ((perGod[g] || 0) < 2) warn(`events: god ${g} has ${perGod[g] || 0} events (spec ≥2)`);
  }
  return perGod;
}

/* ---------- faction static checks ---------- */
function targetsOf(c) { return c.roll ? [c.roll.success, c.roll.fail] : [c.next]; }
function checkFaction(f) {
  const w = `faction.${f.id}`, nodes = f.nodes || {}, ids = Object.keys(nodes);
  const flagsSet = new Set();
  const collect = (e) => { if (e && e.set) Object.keys(e.set).forEach((k) => flagsSet.add(k)); };
  for (const id of ids) { collect(nodes[id].effects); (nodes[id].choices || []).forEach((c) => collect(c.effects)); }
  WH.events.forEach((e) => (e.choices || []).forEach((c) => collect(c.effects)));

  checkL(f.name, w + ".name"); checkL(f.tagline, w + ".tagline", 20, 12); checkL(f.role, w + ".role");
  checkL(f.renownLabel, w + ".renownLabel");
  sprite(f.playerSprite, w + ".playerSprite");
  if (!uiKeys.has(f.renownIcon)) err(`${w}: unknown renownIcon "${f.renownIcon}"`);
  if (!/^#[0-9a-f]{3,8}$/i.test(f.color || "")) warn(`${w}: color "${f.color}" is not a hex color`);
  if (!f.startDate || typeof f.startDate.year !== "number" || typeof f.startDate.mill !== "number") err(`${w}: startDate {year,mill} missing`);
  if (!nodes[f.startNode]) err(`${w}: startNode "${f.startNode}" missing`);
  for (const k of STATS) if (!f.startStats || typeof f.startStats[k] !== "number") warn(`${w}: startStats.${k} missing`);
  const chapterIds = Object.keys(f.chapters || {}).map(Number);
  if (!SAMPLE && (chapterIds.length < 6 || chapterIds.length > 8)) warn(`${w}: ${chapterIds.length} chapters (spec 6–8)`);
  for (const c of chapterIds) checkL(f.chapters[c], `${w}.chapters.${c}`);
  if (!SAMPLE && (ids.length < 70 || ids.length > 95)) warn(`${w}: ${ids.length} nodes (spec 70–95)`);
  if (PREFIX[f.id]) for (const id of ids) if (!id.startsWith(PREFIX[f.id])) warn(`${w}: node id "${id}" lacks prefix ${PREFIX[f.id]}`);

  // death nodes
  for (const k of ["hp", "sanity", "corruption"]) {
    const id = f.deathNodes && f.deathNodes[k];
    if (!id) err(`${w}: deathNodes.${k} missing`);
    else if (!nodes[id]) err(`${w}: deathNodes.${k} → "${id}" does not exist`);
    else if (!nodes[id].ending || nodes[id].ending.kind !== "death") err(`${w}: deathNodes.${k} "${id}" is not an ending of kind "death"`);
  }
  // learn
  for (const g of ["leaders", "enemies", "boss"]) {
    const l = f.learn && f.learn[g];
    if (!l || !l.length) err(`${w}: learn.${g} empty`);
    else codexRef(l, `${w}.learn.${g}`);
  }
  // nodes
  const endings = {good: [], bad: [], death: []};
  const codexUnlockable = new Set();
  WH.events.forEach((e) => { if ((e.factions || ["*"]).some((x) => x === "*" || x === f.id)) { [].concat(e.codex || []).forEach((c) => codexUnlockable.add(c)); (e.choices || []).forEach((c) => [].concat(c.codex || []).forEach((x) => codexUnlockable.add(x))); } });
  for (const id of ids) {
    const n = nodes[id], nw = `${f.id}/${id}`;
    if (typeof n.chapter !== "number" && !(n.ending && n.ending.kind === "death")) warn(`${nw}: no chapter`);
    if (typeof n.chapter === "number" && f.chapters && !f.chapters[n.chapter]) err(`${nw}: chapter ${n.chapter} has no title`);
    scene(n.scene, nw);
    if (n.speaker) { sprite(n.speaker.sprite, nw + ".speaker"); checkL(n.speaker.name, nw + ".speaker.name"); }
    sprite(n.foe, nw + ".foe");
    checkL(n.text, nw + ".text", 90, 65);
    checkEffects(n.effects, nw);
    codexRef(n.codex, nw);
    [].concat(n.codex || []).forEach((c) => codexUnlockable.add(c));
    if (n.time) {
      const h = WH.Rules.timeHours(n.time);
      if (!(h > 0)) warn(`${nw}: time ${JSON.stringify(n.time)} adds 0 hours`);
      for (const k of Object.keys(n.time)) if (!["h", "d", "w", "y", "warp"].includes(k)) warn(`${nw}: unknown time key "${k}"`);
    }
    if (n.eventRoll !== undefined && !(n.eventRoll > 0 && n.eventRoll <= 1)) err(`${nw}: eventRoll ${n.eventRoll} not in (0,1]`);
    if (n.ending) {
      if (!["good", "bad", "death"].includes(n.ending.kind)) err(`${nw}: ending.kind "${n.ending.kind}" invalid`);
      else endings[n.ending.kind].push(id);
      checkL(n.ending.title, nw + ".ending.title");
      if (n.ending.cause !== undefined) checkL(n.ending.cause, nw + ".ending.cause", 16, 8);
      if (n.choices && n.choices.length) err(`${nw}: ending node has choices`);
      continue;
    }
    const cs = n.choices || [];
    if (!cs.length) { err(`${nw}: no choices and not an ending (dead end)`); continue; }
    if (cs.length > 4) err(`${nw}: ${cs.length} choices (max 4)`);
    if (cs.every((c) => c.require && c.hideIfLocked)) warn(`${nw}: every choice is hideIfLocked — may show nothing`);
    if (!cs.some((c) => !c.require)) warn(`${nw}: every choice has a require — possible softlock (checked in simulation)`);
    cs.forEach((c, i) => {
      const cw = `${nw}.choice${i + 1}`;
      checkL(c.text, cw + ".text", 24, 14);
      checkEffects(c.effects, cw);
      codexRef(c.codex, cw);
      checkRequire(c.require, cw, flagsSet);
      if (c.roll) {
        if (c.next) warn(`${cw}: has both roll and next (next ignored)`);
        if (!(c.roll.p >= 0 && c.roll.p <= 1)) err(`${cw}: roll.p ${c.roll.p} not in [0,1]`);
        if (c.roll.stat && !STATS.includes(c.roll.stat)) err(`${cw}: roll.stat "${c.roll.stat}" invalid`);
        for (const t of ["success", "fail"]) if (!nodes[c.roll[t]]) err(`${cw}: roll.${t} → "${c.roll[t]}" does not exist`);
      } else if (!c.next) err(`${cw}: no next/roll`);
      else if (!nodes[c.next]) err(`${cw}: next → "${c.next}" does not exist`);
    });
  }
  if (endings.good.length < 2) err(`${w}: ${endings.good.length} good endings (need ≥2)`);
  if (endings.bad.length < 3) err(`${w}: ${endings.bad.length} bad endings (need ≥3)`);
  if (endings.death.length < 3) warn(`${w}: ${endings.death.length} death-kind endings (expected 3)`);
  // learn ids must be unlockable somewhere in this route
  for (const g of ["leaders", "enemies", "boss"]) for (const c of (f.learn && f.learn[g]) || []) if (WH.codex[c] && !codexUnlockable.has(c)) warn(`${w}.learn.${g}: "${c}" is never unlocked by any node/event of this faction`);

  // static reachability
  const reach = new Set([f.startNode]), queue = [f.startNode];
  Object.values(f.deathNodes || {}).forEach((d) => { if (nodes[d] && !reach.has(d)) { reach.add(d); queue.push(d); } });
  while (queue.length) {
    const n = nodes[queue.shift()];
    if (!n) continue;
    for (const c of n.choices || []) for (const t of targetsOf(c)) if (t && nodes[t] && !reach.has(t)) { reach.add(t); queue.push(t); }
  }
  const unreachable = ids.filter((id) => !reach.has(id));
  if (unreachable.length) err(`${w}: ${unreachable.length} unreachable node(s): ${unreachable.join(", ")}`);
  // can every reachable node reach some ending? (static)
  const canEnd = new Set(ids.filter((id) => nodes[id].ending));
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of ids) if (!canEnd.has(id) && (nodes[id].choices || []).some((c) => targetsOf(c).some((t) => canEnd.has(t)))) { canEnd.add(id); changed = true; }
  }
  const trapped = ids.filter((id) => reach.has(id) && !canEnd.has(id));
  if (trapped.length) err(`${w}: ${trapped.length} node(s) can never reach an ending (closed loop): ${trapped.join(", ")}`);
  return {endings, nodeCount: ids.length, chapters: chapterIds.length};
}

/* ---------- Monte-Carlo ---------- */
function simulate(f) {
  const res = {runs: RUNS, visits: [], endings: {}, kinds: {good: 0, bad: 0, death: 0}, deathCause: {}, loops: 0, crashes: 0,
               softlocks: new Map(), events: {}, eventsPerRun: [], years: [], visited: new Set(), firstCrash: null, maxRevisit: 0, maxRevisitNode: null};
  for (let r = 0; r < RUNS; r++) {
    const rng = WH.RNG(SEED * 100003 + r);
    let g, steps = 0, evCount = 0;
    try {
      g = new WH.Game(f.id, {rng, data: WH});
      let step = g.start();
      const counts = {};
      while (!g.state.ended && steps < STEP_LIMIT) {
        steps++;
        res.visited.add(g.state.nodeId);
        if (step && step.kind === "event") {
          const e = step.event; evCount++;
          res.events[e.id] = (res.events[e.id] || 0) + 1;
          g.eventChoose(Math.floor(rng() * e.choices.length));
          step = g.eventContinue();
          continue;
        }
        counts[g.state.nodeId] = (counts[g.state.nodeId] || 0) + 1;
        if (counts[g.state.nodeId] > res.maxRevisit) { res.maxRevisit = counts[g.state.nodeId]; res.maxRevisitNode = g.state.nodeId; }
        const cs = g.choices();
        const open = cs.map((c, i) => [c, i]).filter(([c]) => !c.locked);
        if (cs.some((c) => c.fallback)) res.softlocks.set(g.state.nodeId, (res.softlocks.get(g.state.nodeId) || 0) + 1);
        if (!open.length) { res.softlocks.set(g.state.nodeId, (res.softlocks.get(g.state.nodeId) || 0) + 1); break; }
        step = g.choose(open[Math.floor(rng() * open.length)][1]);
        if (step && step.death) res.deathCause[step.death] = (res.deathCause[step.death] || 0) + 1;
      }
      res.visited.add(g.state.nodeId);
      if (!g.state.ended) { res.loops++; continue; }
      const n = g.node();
      res.visits.push(g.state.visits);
      res.endings[g.state.nodeId] = (res.endings[g.state.nodeId] || 0) + 1;
      res.kinds[n.ending.kind] = (res.kinds[n.ending.kind] || 0) + 1;
      res.eventsPerRun.push(evCount);
      res.years.push((g.state.hours - WH.Rules.startHours(f)) / 8760);
    } catch (e) {
      res.crashes++;
      if (!res.firstCrash) res.firstCrash = `run ${r}: ${e.message}`;
    }
  }
  return res;
}

const pct = (a, b) => (b ? (100 * a / b).toFixed(1) : "0.0") + "%";
const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);

/* ---------- run ---------- */
const factionIds = Object.keys(WH.factions).filter((id) => !ONLY || id === ONLY);
console.log(`\n== 什么是战锤 / What is Warhammer? — validator (${SAMPLE ? "SAMPLE data" : "real data"}) ==`);
console.log(`loaded: ${loaded.join(", ")}`);
console.log(`registry: ${factionIds.length} faction(s), ${Object.keys(WH.codex).length} codex, ${WH.events.length} events, ` +
  `${Object.keys(WH.sprites).length} sprites, ${Object.keys(WH.scenes).length} scenes, ${Object.keys(WH.ui).length} ui icons`);
if (!factionIds.length) err("no factions registered");
checkManifest();
checkCodex();
const perGod = checkEvents();
console.log(`events per god: ${JSON.stringify(perGod)}`);
{
  const pc = {};
  for (const id of Object.keys(WH.codex)) if (WH.codex[id].cat === "place") pc[WH.codex[id].faction || "any"] = (pc[WH.codex[id].faction || "any"] || 0) + 1;
  const cats = {};
  for (const id of Object.keys(WH.codex)) cats[WH.codex[id].cat] = (cats[WH.codex[id].cat] || 0) + 1;
  console.log(`codex per category: ${JSON.stringify(cats)}`);
  console.log(`places per faction: ${JSON.stringify(pc)}`);
}

const reports = [];
for (const id of factionIds) {
  const f = WH.factions[id];
  flushUnknownCodex();
  const before = errors.length;
  const st = checkFaction(f);
  flushUnknownCodex();
  const rep = {id, st, sim: null};
  if (errors.length === before || argv.includes("--force-sim")) {
    rep.sim = simulate(f);
    const s = rep.sim;
    if (s.crashes) err(`${id}: ${s.crashes} simulated runs crashed — ${s.firstCrash}`);
    if (s.loops) err(`${id}: ${s.loops} runs hit the ${STEP_LIMIT}-step limit (infinite loop?)`);
    for (const [n, c] of s.softlocks) err(`${id}/${n}: all choices locked in ${c} simulated visit(s) (softlock; engine opened the last choice)`);
    const never = Object.keys(f.nodes).filter((n) => !s.visited.has(n));
    if (never.length) warn(`${id}: ${never.length} node(s) never visited in ${RUNS} random runs: ${never.join(", ")}`);
    const a = avg(s.visits);
    if (!SAMPLE && s.visits.length && (a < 45 || a > 60)) warn(`${id}: avg nodes visited ${a.toFixed(1)} (target 45–60)`);
    for (const k of ["good", "bad"]) if (s.visits.length && !s.kinds[k]) warn(`${id}: no "${k}" ending reached in ${RUNS} runs`);
  } else note(`${id}: Monte-Carlo skipped because of static errors (use --force-sim to run anyway)`);
  reports.push(rep);
}

flushUnknownCodex();
for (const r of reports) {
  const f = WH.factions[r.id];
  console.log(`\n--- ${r.id}: ${f.name && f.name.en} / ${f.name && f.name.zh} ---`);
  console.log(`nodes ${r.st.nodeCount} · chapters ${r.st.chapters} · endings good ${r.st.endings.good.length} / bad ${r.st.endings.bad.length} / death ${r.st.endings.death.length}`);
  const s = r.sim;
  if (!s) { console.log("simulation: skipped"); continue; }
  const v = s.visits;
  console.log(`simulation: ${RUNS} runs (seed ${SEED}) · finished ${v.length} · loops ${s.loops} · crashes ${s.crashes}`);
  if (v.length) {
    console.log(`nodes visited: avg ${avg(v).toFixed(1)} · min ${Math.min(...v)} · max ${Math.max(...v)}   (est. ${Math.round(avg(v) * 50 / 60)}–${Math.round(avg(v) * 70 / 60)} min at 50–70 s/node)`);
    console.log(`in-game time: avg ${avg(s.years).toFixed(2)} y · max ${Math.max(...s.years).toFixed(2)} y · events/run avg ${avg(s.eventsPerRun).toFixed(2)}`);
    console.log(`ending kinds: good ${pct(s.kinds.good, v.length)} · bad ${pct(s.kinds.bad, v.length)} · death ${pct(s.kinds.death, v.length)}`);
    console.log(`stat deaths (hp/sanity/corruption hit limit): ${Object.entries(s.deathCause).map(([k, c]) => `${k} ${pct(c, RUNS)}`).join(" · ") || "none"}`);
    console.log("ending distribution:");
    Object.entries(s.endings).sort((a, b) => b[1] - a[1]).forEach(([id, c]) => {
      const n = f.nodes[id] || {ending: {kind: "death", title: {en: "(synthetic)"}}};
      console.log(`  ${pct(c, v.length).padStart(6)}  ${n.ending.kind.padEnd(5)} ${id}  ${n.ending.title ? n.ending.title.en : ""}`);
    });
    const evs = Object.entries(s.events);
    if (evs.length) console.log(`events fired: ${evs.map(([k, c]) => `${k}×${c}`).join(", ")}`);
    console.log(`max visits of one node in a run: ${s.maxRevisit} (${s.maxRevisitNode})`);
  }
}

console.log("");
if (!QUIET || errors.length) notes.forEach((n) => console.log("NOTE    " + n));
const WARN_SHOW = QUIET ? 0 : 200;
warnings.slice(0, WARN_SHOW).forEach((w) => console.log("WARN    " + w));
if (warnings.length > WARN_SHOW) console.log(`WARN    … ${warnings.length - WARN_SHOW} more`);
errors.forEach((e) => console.log("ERROR   " + e));
console.log(`\n${errors.length ? "FAIL" : "PASS"} — ${errors.length} error(s), ${warnings.length} warning(s)\n`);
process.exit(errors.length ? 1 : 0);
