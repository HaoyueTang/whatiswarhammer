#!/usr/bin/env node
/* validate.js — data + link checker and Monte-Carlo playthrough simulator (SPEC §10). Owned by: web.
 *
 *   node tools/dev/validate.js              validate real data (data/**, assets/manifest.js)
 *   node tools/dev/validate.js --sample     validate tools/dev/sample_data.js instead of data/
 *   options: --runs N (default 3000)  --seed S (default 1)  --faction id  --quiet (errors/warnings summary only)
 *   node tools/dev/validate.js --write-difficulty   also writes data/difficulty.js (SPEC §24): fixed seeds 1/5/9 × --runs per
 *     faction (origins alternate), level 1/2/3 by random-play death rate <24 / 24–29 / ≥29 %, per faction and per "faction/origin".
 *   SPEC §31 (v0.3.4): every ending node needs an illustration — a manifest scene `end_<id>` whose PNG exists (error; warning if it
 *   is not 192×108), plus tools/dev/dump_endings.js --check (tools/art/endings_brief.json stale → warning, or error if the ending
 *   count differs). --allow-missing-ending-art downgrades the "no scene / no PNG" errors to ONE summary warning (development only,
 *   while the art role is still producing). Not checked with --sample.
 *   SPEC §20: also checks data/chronicle.js (timeline codex entries), data/rumors.js and data/events_lore.js, and
 *   reports rumours per route, chronicle entries per millennium and avg rumours overheard per simulated run.
 *   SPEC §20c (v0.3.4): rumours / echoes are heard only on gather nodes (node.gather = {zh, en}); checks the shape, label-in-text coherence,
 *   forbidden places, per route count / chapters / per-origin passes / rumours per run / echo share; routes with NO gather node get one
 *   "no gather nodes yet" warning instead. `node tools/dev/validate.js --gather-report [--faction f] [--runs N]` prints the static table.
 *
 * Loads registry + manifest + data + the REAL engine (src/js/engine.js) into a vm context, so simulated runs
 * use exactly the game rules (effects, clamps, death checks, roll formula, warp time, events).
 * Exit code 1 if any error.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const SL = require("./story_lib.js");         // SPEC §32 story analysis (shared with route_converge.js / route_graph.js)

const ROOT = path.resolve(__dirname, "..", "..");
const argv = process.argv.slice(2);
function arg(name, def) { const i = argv.indexOf(name); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : def; }
const SAMPLE = argv.includes("--sample");
const QUIET = argv.includes("--quiet");
const RUNS = parseInt(arg("--runs", "3000"), 10);
const SEED = parseInt(arg("--seed", "1"), 10);
const ONLY = arg("--faction", null);
const WRITE_DIFF = argv.includes("--write-difficulty");
const STORY_GATE = argv.includes("--story-gate");       // SPEC §32: story-quality limits (false choices, forced chapter steps, run length …) fail the run
const GATHER_REPORT = argv.includes("--gather-report"); // SPEC §20c: print the per-route gather-node table and exit
const STORY_REPORT = argv.includes("--story-report");   // SPEC §32: print the per-route story table and exit
const ALLOW_MISSING_END_ART = argv.includes("--allow-missing-ending-art");   // SPEC §31: dev only — the default (no flag) is the real gate
const DIFF_SEEDS = [1, 5, 9];
const diffLevel = (deathPct) => deathPct < 24 ? 1 : deathPct < 29 ? 2 : 3;   // SPEC §24
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
/* SPEC §14 (v0.2) keys — referenced data is accepted before the art lands (warning "art pending", UI shows a placeholder) */
const SPEC2_SPRITES = ("player_aeldari player_necrons aeldari_guardian aeldari_seer aeldari_ranger aeldari_bonesinger aeldari_masked " +
  "drukhari_raider wraith_construct greater_daemon_slaanesh necron_warrior necron_lord cryptek flayed_one canoptek_scarab canoptek_spyder " +
  "dig_leader explorator omen_farseer omen_ynnead omen_khaine omen_silent_king omen_ctan omen_stormlord omen_collector").split(" ");
const SPEC2_SCENES = "craftworld webway maiden_world dig_site tomb_exterior tomb_interior stasis_gallery".split(" ");
const SPEC2_UI = ["icon_fate", "icon_worth"];
/* SPEC §26 (v0.3) keys — also accepted as "art pending" until the manifest registers them */
const SPEC3_SPRITES = ("player_orks player_gsc player_mechanicus ork_mek ork_weirdboy ork_nob gretchin squig gsc_neophyte gsc_acolyte gsc_magus " +
  "gsc_primus gsc_patriarch skitarius magos electro_priest kastelan_robot dark_mechanicus daemon_engine omen_waaagh omen_gork_mork " +
  "omen_star_children omen_four_armed omen_mars omen_cawl omen_omnissiah").split(" ");
const SPEC3_SCENES = "ork_scrapyard ork_fort mine_shaft gsc_chapel forge_floor mars_vista tech_vault".split(" ");
const SPEC3_UI = ["icon_teef", "icon_kinship", "icon_grace"];
SPEC2_SPRITES.push(...SPEC3_SPRITES); SPEC2_SCENES.push(...SPEC3_SCENES); SPEC2_UI.push(...SPEC3_UI);
const RACES = ["imperium", "chaos", "tau", "aeldari", "necrons", "orks", "tyranids", "other"];
const TYPES = ["figure", "deity", "organization", "unit", "place", "concept"];
const CODEX_FILES = ["data/codex.js", "data/codex_aeldari.js", "data/codex_necrons.js", "data/codex_orks.js", "data/codex_gsc.js", "data/codex_mechanicus.js",
                     "data/chronicle.js", "data/easter_tzeentch.js", "data/sector.js"];
const EVENT_FILES = ["data/events.js", "data/events_taint.js", "data/events_lore.js", "data/rumors.js"];   // SPEC §18/§20 load order
const RUMOR_ZH = 50, RUMOR_EN = 35;     // SPEC §20 rumour text limits (warn)
const MAX_CHAPTER = 8;
const FACTION_FILES = ["imperium", "chaos", "tau", "aeldari", "necrons", "orks", "gsc", "mechanicus"];
const NEW_ROUTES = ["aeldari", "necrons", "orks", "gsc", "mechanicus"];        // 75–90 spine nodes (SPEC §12 / §26)
const GODS = ["khorne", "nurgle", "tzeentch", "slaanesh", "undivided", "other"];
const TAINT_GODS = ["khorne", "nurgle", "tzeentch", "slaanesh"];   // SPEC §18
const CODEX_CATS = ["leader", "enemy", "boss", "god", "lore", "place"];
const CODEX_FACTIONS = ["imperium", "chaos", "tau", "aeldari", "necrons", "orks", "gsc", "mechanicus", "xenos", "any"];
const STATS = ["hp", "sanity", "corruption", "renown"];
const PREFIX = {imperium: "imp_", chaos: "cha_", tau: "tau_", aeldari: "eld_", necrons: "nec_", orks: "ork_", gsc: "gsc_", mechanicus: "mech_"};
const RESULT_ZH = 50, RESULT_EN = 35;   // SPEC §11 consequence text limits (warn)
/* SPEC §19 lore table: per-route taintMod guide + target claim rate (random play, any god, % of runs ending in a claim ending) */
const TAINT_GUIDE = {
  imperium: {mod: {khorne: 0.9, nurgle: 0.9, tzeentch: 0.9, slaanesh: 0.9}, band: [12, 18]},
  chaos:    {mod: {khorne: 1.3, nurgle: 1.3, tzeentch: 1.3, slaanesh: 1.3}, band: [20, 30]},
  tau:      {mod: {khorne: 0.7, nurgle: 0.7, tzeentch: 0.7, slaanesh: 0.7}, band: [6, 12]},
  aeldari:  {mod: {khorne: 0.9, nurgle: 0.9, tzeentch: 0.9, slaanesh: 1.3}, band: [12, 18]},
  necrons:  {mod: {khorne: 0.5, nurgle: 0.5, tzeentch: 0.5, slaanesh: 0.5}, band: [3, 8]},
  // SPEC §26
  orks:       {mod: {khorne: 1.0, nurgle: 0.6, tzeentch: 0.6, slaanesh: 0.6}, band: [5, 10]},
  gsc:        {mod: {khorne: 0.6, nurgle: 0.6, tzeentch: 0.6, slaanesh: 0.6}, band: [3, 8]},
  mechanicus: {mod: {khorne: 0.8, nurgle: 0.8, tzeentch: 1.1, slaanesh: 0.8}, band: [8, 14]}
};
const claimGodOf = (id) => { const m = /_end_claim_(khorne|nurgle|tzeentch|slaanesh)(?:$|_)/.exec(String(id || "")); return m ? m[1] : null; };

/* ---------- load into vm ---------- */
const ctx = vm.createContext({console: {log() {}, warn() {}, error() {}}, Math, Date, JSON, Object, Array});
ctx.window = ctx;   // some data files wrap themselves in (function (WH) {…})(window.WH)
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
  // codex files in SPEC §13 load order; detect ids that a later file silently overwrites
  const codexOwner = {};
  CODEX_FILES.forEach((rel, i) => {
    const before = ctx.WH ? Object.assign({}, ctx.WH.codex) : {};
    const snap = ctx.WH ? JSON.stringify(Object.keys(ctx.WH.codex)) : "[]";
    // capture registrations of this file
    let ids = [];
    if (ctx.WH) {
      const orig = ctx.WH.registerCodex;
      ctx.WH.registerCodex = (obj) => { ids = ids.concat(Object.keys(obj)); orig(obj); };
      if (load(rel, i === 0)) ids.forEach((id) => { if (codexOwner[id] && codexOwner[id] !== rel) err(`codex id "${id}" in ${rel} overwrites the one in ${codexOwner[id]}`); else codexOwner[id] = rel; });
      ctx.WH.registerCodex = orig;
    }
    void before; void snap;
  });
  ctx.__codexOwner = codexOwner;
  load("data/events.js", true);
  load("data/events_taint.js", false);
  {   // SPEC §20 lore events: remember which ids came from events_lore.js (for the report)
    const orig = ctx.WH.registerEvents, ids = [];
    ctx.WH.registerEvents = (list) => { (list || []).forEach((e) => e && ids.push(e.id)); orig(list); };
    load("data/events_lore.js", false);
    ctx.WH.registerEvents = orig;
    ctx.__loreEvents = ids;
  }
  if (ctx.WH.registerRumors) load("data/rumors.js", false);
  else if (fs.existsSync(path.join(ROOT, "data/rumors.js"))) err("data/rumors.js exists but registry.js has no WH.registerRumors");
  const fdir = path.join(ROOT, "data", "factions");
  const files = fs.existsSync(fdir) ? fs.readdirSync(fdir).filter((f) => f.endsWith(".js")).sort((a, b) => {
    const ia = FACTION_FILES.indexOf(a.slice(0, -3)), ib = FACTION_FILES.indexOf(b.slice(0, -3));
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || (a < b ? -1 : 1);
  }) : [];
  for (const id of FACTION_FILES) if (!files.includes(id + ".js")) warn(`data/factions/${id}.js missing (index.html loads it)`);
  for (const f of files) load("data/factions/" + f, false);
  // index.html must load every data file that exists (plain <script> tags, no fetch)
  const html = fs.existsSync(path.join(ROOT, "index.html")) ? fs.readFileSync(path.join(ROOT, "index.html"), "utf8") : "";
  const tags = [...html.matchAll(/<script\s+src="([^"]+)"/g)].map((m) => m[1]);
  const onDisk = CODEX_FILES.concat(EVENT_FILES, files.map((f) => "data/factions/" + f)).filter((r) => fs.existsSync(path.join(ROOT, r)));
  for (const r of onDisk) if (!tags.includes(r)) err(`index.html does not load ${r}`);
  for (const r of ["data/difficulty.js", "data/achievements.js"]) if (fs.existsSync(path.join(ROOT, r)) && !tags.includes(r)) err(`index.html does not load ${r}`);
  for (const id of FACTION_FILES) if (!tags.includes(`data/factions/${id}.js`)) warn(`index.html has no <script> for data/factions/${id}.js`);
  load("data/difficulty.js", false);
  load("data/achievements.js", false);
  const order = tags.filter((x) => x.startsWith("data/"));
  const want = CODEX_FILES.concat(EVENT_FILES);
  let last = -1;
  for (const r of want) { const i = order.indexOf(r); if (i < 0) continue; if (i < last) err(`index.html: ${r} loads out of SPEC §13/§20 order`); last = i; }
  for (const r of CODEX_FILES.concat(EVENT_FILES)) if (!tags.includes(r)) warn(`index.html has no <script> for ${r} (SPEC §20 load order)`);
  const fi = order.findIndex((x) => x.startsWith("data/factions/"));
  for (const r of EVENT_FILES) { const i = order.indexOf(r); if (i >= 0 && fi >= 0 && i > fi) err(`index.html: ${r} must load before data/factions/*`); }
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
const pending = new Map();   // SPEC §14 keys used before the art registered them: key -> count
const pend = (k) => pending.set(k, (pending.get(k) || 0) + 1);
const sprite = (k, where) => { if (k && !spriteKeys.has(k)) { if (SPEC2_SPRITES.includes(k)) pend("sprite " + k); else err(`${where}: unknown sprite "${k}"`); } };
const scene = (k, where) => {
  if (!k) err(`${where}: missing scene`);
  else if (!sceneKeys.has(k)) { if (SPEC2_SCENES.includes(k)) pend("scene " + k); else err(`${where}: unknown scene "${k}"`); }
};
const uiIcon = (k, where) => { if (!uiKeys.has(k)) { if (SPEC2_UI.includes(k)) pend("ui " + k); else err(`${where}: unknown icon "${k}"`); } };
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
    else if (k === "taint") {
      if (!e.taint || typeof e.taint !== "object" || Array.isArray(e.taint)) { err(`${where}: effects.taint must be {god:±n} or {all:±n}`); continue; }
      for (const g of Object.keys(e.taint)) {
        if (!TAINT_GODS.includes(g) && g !== "all") err(`${where}: taint key "${g}" (khorne|nurgle|tzeentch|slaanesh|all)`);
        if (typeof e.taint[g] !== "number" || !isFinite(e.taint[g])) err(`${where}: taint.${g} not a number`);
        else if (Math.abs(e.taint[g]) > 100) warn(`${where}: taint.${g} ${e.taint[g]} (|n| > 100)`);
      }
    }
    else warn(`${where}: unknown effect key "${k}"`);
  }
}
function checkRequire(r, where, flagsSet) {
  if (!r) return;
  for (const q of [].concat(r)) {
    const keys = Object.keys(q);
    if (!keys.length) err(`${where}: empty require`);
    for (const k of keys) if (!["flag", "notFlag", "stat", "min", "max", "taint"].includes(k)) err(`${where}: unknown require key "${k}"`);
    if (q.taint !== undefined) {
      if (!TAINT_GODS.includes(q.taint)) err(`${where}: require.taint "${q.taint}" invalid`);
      if (q.min === undefined && q.max === undefined) err(`${where}: require.taint without min/max`);
      if (q.stat) err(`${where}: require has both stat and taint (split into two requires)`);
    }
    if (q.stat && !STATS.includes(q.stat)) err(`${where}: require.stat "${q.stat}" invalid`);
    if (q.stat && q.min === undefined && q.max === undefined) err(`${where}: require.stat without min/max`);
    for (const f of [q.flag, q.notFlag]) if (f && !flagsSet.has(f)) warn(`${where}: flag "${f}" is never set by any effect`);
  }
}

/* ---------- SPEC §32.2 conditions: node.alt / choice.resultAlt ---------- */
const ALT_TEXT_ZH = 90, ALT_TEXT_EN = 65, ALT_ADD_ZH = 45, ALT_ADD_EN = 33, ALT_MAX = 8, RESULT_ALT_MAX = 4, JUMP_ZH = 40, JUMP_EN = 25;
const sceneKnown = (k) => sceneKeys.has(k) || SPEC2_SCENES.includes(k);
const arrOf = (x) => (x === undefined || x === null ? [] : Array.isArray(x) ? x : [x]);
const rangeOk = (r) => typeof r === "number" || (r && typeof r === "object" && !Array.isArray(r) && Object.keys(r).every((k) => ["min", "max"].includes(k) && typeof r[k] === "number") && Object.keys(r).length > 0);
/* env: {flagsSet:Set (every flag set anywhere that can reach this route), nodes:{id→node}} */
function checkCond(c, w, env) {
  if (c === undefined || c === null || typeof c !== "object" || Array.isArray(c)) { err(`${w}: condition must be an object (flag / notFlag / flags / anyFlag / stat / fromChapter / fromScene / fromNode / any / all / not)`); return; }
  const keys = Object.keys(c);
  if (!keys.length) { err(`${w}: empty condition`); return; }
  for (const k of keys) if (!SL.COND_KEYS.includes(k)) err(`${w}: unknown condition key "${k}"`);
  const needSet = (f) => { if (!env.flagsSet.has(f)) err(`${w}: flag "${f}" is never set anywhere (SPEC §32.2)`); };
  for (const k of ["flag", "notFlag"]) if (c[k] !== undefined) { if (typeof c[k] !== "string" || !c[k]) err(`${w}.${k}: must be a flag name`); else needSet(c[k]); }
  for (const k of ["flags", "anyFlag"]) if (c[k] !== undefined) {
    if (!Array.isArray(c[k]) || !c[k].length || c[k].some((x) => typeof x !== "string" || !x)) err(`${w}.${k}: must be a non-empty array of flag names`);
    else c[k].forEach(needSet);
  }
  if (c.stat !== undefined && !STATS.includes(c.stat)) err(`${w}.stat: "${c.stat}" invalid`);
  if (c.taint !== undefined && !TAINT_GODS.includes(c.taint)) err(`${w}.taint: "${c.taint}" invalid`);
  if (c.stat !== undefined && c.taint !== undefined) err(`${w}: both stat and taint (split into two conditions)`);
  if ((c.stat !== undefined || c.taint !== undefined) && c.min === undefined && c.max === undefined) err(`${w}: stat/taint condition without min/max`);
  if ((c.min !== undefined || c.max !== undefined) && c.stat === undefined && c.taint === undefined) err(`${w}: min/max without stat or taint`);
  for (const k of ["min", "max"]) if (c[k] !== undefined && typeof c[k] !== "number") err(`${w}.${k}: not a number`);
  if (c.fromChapter !== undefined && !rangeOk(c.fromChapter)) err(`${w}.fromChapter: needs a number or {min,max}`);
  if (c.fromScene !== undefined) { const l = arrOf(c.fromScene); if (!l.length || l.some((x) => typeof x !== "string")) err(`${w}.fromScene: needs scene keys`); else l.forEach((x) => { if (!sceneKnown(x)) err(`${w}.fromScene: unknown scene "${x}"`); }); }
  if (c.fromNode !== undefined) { const l = arrOf(c.fromNode); if (!l.length || l.some((x) => typeof x !== "string")) err(`${w}.fromNode: needs node ids`); else l.forEach((x) => { if (!env.nodes[x]) err(`${w}.fromNode: node "${x}" does not exist`); }); }
  for (const k of ["any", "all"]) if (c[k] !== undefined) {
    if (!Array.isArray(c[k]) || !c[k].length) err(`${w}.${k}: needs a non-empty array of conditions`);
    else c[k].forEach((x, i) => checkCond(x, `${w}.${k}[${i}]`, env));
  }
  if (c.not !== undefined) checkCond(c.not, w + ".not", env);
}
/* can the condition ever hold at a node? env.may = flags that may be set there, env.preds = ids of the nodes that lead here (null = entered from anywhere) */
function condPossible(c, env) {
  if (!c || typeof c !== "object" || Array.isArray(c)) return true;
  if (typeof c.flag === "string" && !env.may.has(c.flag)) return false;
  if (Array.isArray(c.flags) && c.flags.some((f) => !env.may.has(f))) return false;
  if (Array.isArray(c.anyFlag) && c.anyFlag.length && !c.anyFlag.some((f) => env.may.has(f))) return false;
  if (Array.isArray(c.any) && c.any.length && !c.any.some((x) => condPossible(x, env))) return false;
  if (Array.isArray(c.all) && c.all.some((x) => !condPossible(x, env))) return false;
  if (env.preds) {
    const P = [...env.preds].map((id) => env.nodes[id]).filter(Boolean), ids = [...env.preds];
    if (c.fromNode !== undefined && !arrOf(c.fromNode).some((x) => ids.includes(x))) return false;
    if (c.fromScene !== undefined && !P.some((n) => arrOf(c.fromScene).includes(n.scene))) return false;
    if (c.fromChapter !== undefined && rangeOk(c.fromChapter) && !P.some((n) => typeof n.chapter === "number" && (typeof c.fromChapter === "number" ? n.chapter === c.fromChapter
        : (c.fromChapter.min === undefined || n.chapter >= c.fromChapter.min) && (c.fromChapter.max === undefined || n.chapter <= c.fromChapter.max)))) return false;
  }
  return true;
}
/* node.alt: [{if, text:{zh,en}} | {if, add:{zh,en}}] ≤ 8 */
function checkAlt(n, nw, env) {
  if (n.alt === undefined) return;
  if (!Array.isArray(n.alt) || !n.alt.length) { err(`${nw}.alt: must be a non-empty array`); return; }
  if (n.alt.length > ALT_MAX) err(`${nw}.alt: ${n.alt.length} entries (max ${ALT_MAX})`);
  let adds = 0;
  n.alt.forEach((a, i) => {
    const aw = `${nw}.alt[${i}]`;
    if (!a || typeof a !== "object" || Array.isArray(a)) { err(`${aw}: must be {if, text|add}`); return; }
    for (const k of Object.keys(a)) if (!["if", "text", "add"].includes(k)) err(`${aw}: unknown key "${k}"`);
    if ((a.text === undefined) === (a.add === undefined)) err(`${aw}: needs exactly one of text / add`);
    checkCond(a["if"], aw + ".if", env);
    if (a.text !== undefined) checkL(a.text, aw + ".text", ALT_TEXT_ZH, ALT_TEXT_EN);
    if (a.add !== undefined) { checkL(a.add, aw + ".add", ALT_ADD_ZH, ALT_ADD_EN); adds++; }
    if (a["if"] && typeof a["if"] === "object" && !condPossible(a["if"], env)) warn(`${aw}: condition can never match here (no path to this node sets the flag / comes from that node, scene or chapter)`);
  });
  if (adds > 8) warn(`${nw}.alt: ${adds} add entries — the engine shows at most 2 matching ones, keep the conditions mutually exclusive`);
  else if (adds > 2) note(`${nw}.alt: ${adds} add entries — fine if their conditions are mutually exclusive (the engine shows at most 2 matching ones)`);
}
/* choice.resultAlt: [{if, text:{zh,en}}] ≤ 4, first match replaces choice.result */
function checkResultAlt(c, cw, env) {
  if (c.resultAlt === undefined) return;
  if (!Array.isArray(c.resultAlt) || !c.resultAlt.length) { err(`${cw}.resultAlt: must be a non-empty array`); return; }
  if (c.resultAlt.length > RESULT_ALT_MAX) err(`${cw}.resultAlt: ${c.resultAlt.length} entries (max ${RESULT_ALT_MAX})`);
  c.resultAlt.forEach((a, i) => {
    const aw = `${cw}.resultAlt[${i}]`;
    if (!a || typeof a !== "object" || Array.isArray(a)) { err(`${aw}: must be {if, text}`); return; }
    for (const k of Object.keys(a)) if (!["if", "text"].includes(k)) err(`${aw}: unknown key "${k}"`);
    checkCond(a["if"], aw + ".if", env);
    checkL(a.text, aw + ".text", ALT_TEXT_ZH, ALT_TEXT_EN);
    if (a["if"] && typeof a["if"] === "object" && !condPossible(a["if"], env)) warn(`${aw}: condition can never match here`);
  });
  if (c.result === undefined && c.rollResult === undefined) warn(`${cw}: resultAlt without a base result (shown only when a condition matches)`);
}
/* SPEC §32.3 event.where / excludeFactions */
function checkWhere(e, w, applies) {
  if (e.excludeFactions !== undefined) {
    if (!Array.isArray(e.excludeFactions) || !e.excludeFactions.length || e.excludeFactions.some((x) => typeof x !== "string")) err(`${w}.excludeFactions: must be a non-empty array of faction ids`);
    else for (const x of e.excludeFactions) {
      if (!FACTION_FILES.includes(x) && !WH.factions[x]) err(`${w}.excludeFactions: unknown faction "${x}"`);
      if ((e.factions || []).includes(x)) warn(`${w}: faction "${x}" is both in factions and excludeFactions`);
    }
  }
  if (e.where === undefined) return;
  const q = e.where;
  if (!q || typeof q !== "object" || Array.isArray(q) || !Object.keys(q).length) { err(`${w}.where: must be a non-empty object`); return; }
  for (const k of Object.keys(q)) if (!SL.WHERE_KEYS.includes(k)) err(`${w}.where: unknown key "${k}"`);
  for (const k of ["scenes", "notScenes"]) if (q[k] !== undefined) {
    const l = arrOf(q[k]); if (!l.length || l.some((x) => typeof x !== "string")) err(`${w}.where.${k}: needs scene keys`);
    else l.forEach((x) => { if (!sceneKnown(x)) err(`${w}.where.${k}: unknown scene "${x}"`); });
  }
  for (const k of ["nodes", "notNodes"]) if (q[k] !== undefined) {
    const l = arrOf(q[k]); if (!l.length || l.some((x) => typeof x !== "string")) err(`${w}.where.${k}: needs node ids`);
    else l.forEach((x) => { if (applies.length && !applies.some((fid) => WH.factions[fid] && WH.factions[fid].nodes && WH.factions[fid].nodes[x])) err(`${w}.where.${k}: node "${x}" does not exist in ${applies.join("/") || "any faction"}`); });
  }
  if (q.chapter !== undefined && !rangeOk(q.chapter)) err(`${w}.where.chapter: needs a number or {min,max}`);
  for (const k of ["flag", "notFlag"]) if (q[k] !== undefined) { if (typeof q[k] !== "string" || !q[k]) err(`${w}.where.${k}: must be a flag name`); else if (!ALL_FLAGS.has(q[k])) err(`${w}.where.${k}: flag "${q[k]}" is never set anywhere`); }
  for (const k of ["flags", "anyFlag"]) if (q[k] !== undefined) {
    if (!Array.isArray(q[k]) || !q[k].length || q[k].some((x) => typeof x !== "string")) err(`${w}.where.${k}: must be a non-empty array of flag names`);
    else q[k].forEach((x) => { if (!ALL_FLAGS.has(x)) err(`${w}.where.${k}: flag "${x}" is never set anywhere`); });
  }
  if (q.stat !== undefined && !STATS.includes(q.stat)) err(`${w}.where.stat: "${q.stat}" invalid`);
  if (q.taint !== undefined && !TAINT_GODS.includes(q.taint)) err(`${w}.where.taint: "${q.taint}" invalid`);
  if ((q.stat !== undefined || q.taint !== undefined) && q.min === undefined && q.max === undefined) err(`${w}.where: stat/taint without min/max`);
}

/* every flag set anywhere (factions, origins, events) — for require checks on event choices */
const ALL_FLAGS = new Set();
{
  const add = (e) => { if (e && e.set) Object.keys(e.set).forEach((k) => ALL_FLAGS.add(k)); };
  for (const f of Object.values(WH.factions)) {
    for (const n of Object.values(f.nodes || {})) { add(n.effects); (n.choices || []).forEach((c) => add(c.effects)); }
    WH.Game.origins(f).forEach(add);
  }
  WH.events.forEach((e) => (e.choices || []).forEach((c) => add(c.effects)));
}
/* SPEC §19 goto: "node" or {factionId:"node"}; targets must exist in the faction they are used in */
function eventGotoTargets(fid) {
  const out = [];
  for (const e of WH.events) {
    if (!(e.factions || ["*"]).some((x) => x === "*" || x === fid)) continue;
    for (const c of e.choices || []) {
      if (!c.goto) continue;
      const t = typeof c.goto === "string" ? c.goto : c.goto[fid];
      if (t) out.push(t);
    }
  }
  return out;
}
function checkGoto(go, cw, applies, e) {
  const known = new Set(Object.keys(WH.factions).concat(FACTION_FILES));
  if (typeof go === "string") {
    const has = applies.filter((fid) => WH.factions[fid].nodes && WH.factions[fid].nodes[go]);
    if (!has.length) err(`${cw}: goto → "${go}" does not exist in ${applies.length ? applies.join("/") : "any loaded faction"}`);
    else if (has.length < applies.length) warn(`${cw}: goto "${go}" only exists in ${has.join("/")} — other factions resume the pending node (use a per-faction map)`);
    return;
  }
  if (!go || typeof go !== "object" || Array.isArray(go)) { err(`${cw}: goto must be a node id or {faction:"node"}`); return; }
  for (const k of Object.keys(go)) {
    if (!known.has(k)) { err(`${cw}: goto key "${k}" is not a faction id`); continue; }
    if (typeof go[k] !== "string") { err(`${cw}: goto.${k} must be a node id`); continue; }
    const f = WH.factions[k];
    if (!f) continue;                                  // faction file not loaded (reported elsewhere)
    if (!applies.includes(k)) warn(`${cw}: goto.${k} but the event does not apply to ${k}`);
    if (!f.nodes || !f.nodes[go[k]]) err(`${cw}: goto.${k} → "${go[k]}" does not exist in ${k}`);
  }
  const miss = applies.filter((fid) => !go[fid] && fid !== "sample");
  if (miss.length && e.trigger === "claim") warn(`${cw}: goto map has no entry for ${miss.join(", ")} — those routes resume the pending node`);
}

/* ---------- manifest ---------- */
function checkManifest() {
  if (!hasManifest) return;
  const groups = [["sprites", WH.sprites, SPEC_SPRITES.concat(SPEC2_SPRITES)], ["scenes", WH.scenes, SPEC_SCENES.concat(SPEC2_SCENES)], ["ui", WH.ui, SPEC_UI.concat(SPEC2_UI)]];
  for (const [g, reg, spec] of groups) {
    const missing = spec.filter((k) => !reg[k]);
    if (missing.length) warn(`manifest: ${missing.length} SPEC §7/§14 ${g} key(s) not registered: ${missing.join(", ")}`);
    for (const k of Object.keys(reg)) {
      const a = reg[k];
      if (!a || !a.src) { err(`manifest ${g}.${k}: missing src`); continue; }
      if (g === "scenes" && /^end_/.test(k) && !SAMPLE) { /* SPEC §31 ending art: file presence is checked by checkEndingArt() */ }
      else if (!fs.existsSync(path.join(ROOT, a.src))) warn(`manifest ${g}.${k}: file not found ${a.src}`);
      if (!a.w || !a.h) warn(`manifest ${g}.${k}: missing w/h`);
    }
  }
}

/* ---------- ending illustrations (SPEC §31) ---------- */
const END_ART_W = 192, END_ART_H = 108;
function pngSize(file) {      // IHDR of a PNG, no dependencies → {w,h} or null if it is not a PNG
  let fd;
  try {
    fd = fs.openSync(file, "r");
    const b = Buffer.alloc(24);
    if (fs.readSync(fd, b, 0, 24, 0) < 24) return null;
    if (b.readUInt32BE(0) !== 0x89504e47 || b.readUInt32BE(4) !== 0x0d0a1a0a || b.toString("ascii", 12, 16) !== "IHDR") return null;
    return {w: b.readUInt32BE(16), h: b.readUInt32BE(20)};
  } catch (e) { return null; }
  finally { if (fd !== undefined) fs.closeSync(fd); }
}
function checkEndingArt() {
  if (SAMPLE) return;
  const ids = [];                                                  // [faction, id] for every ending node of every loaded route
  for (const fid of Object.keys(WH.factions)) {
    const nodes = WH.factions[fid].nodes || {};
    for (const id of Object.keys(nodes)) if (nodes[id].ending) ids.push([fid, id]);
  }
  const known = new Set(ids.map((x) => x[1]));
  const missing = [];                                              // [faction, id, reason]
  for (const [fid, id] of ids) {
    const key = "end_" + id, a = WH.scenes[key], w = `ending art ${fid}/${id}`;
    if (!a || !a.src) { missing.push([fid, id, `no manifest scene "${key}"`]); continue; }
    const want = `assets/endings/${id}.png`;
    if (a.src !== want) warn(`${w}: manifest src "${a.src}" (expected ${want}, SPEC §31)`);
    const file = path.join(ROOT, a.src);
    if (!fs.existsSync(file)) { missing.push([fid, id, `PNG missing: ${a.src}`]); continue; }
    const sz = pngSize(file);
    if (!sz) { err(`${w}: ${a.src} is not a readable PNG`); continue; }
    if (sz.w !== END_ART_W || sz.h !== END_ART_H) warn(`${w}: ${a.src} is ${sz.w}×${sz.h}, expected ${END_ART_W}×${END_ART_H} (SPEC §31)`);
    if (a.w !== END_ART_W || a.h !== END_ART_H) warn(`${w}: manifest w/h is ${a.w}×${a.h}, expected ${END_ART_W}×${END_ART_H}`);
    if (!a.name || !a.name.zh || !a.name.en) warn(`${w}: manifest scene "${key}" has no name {zh,en} (SPEC §31: the ending title)`);
  }
  if (ALLOW_MISSING_END_ART) {
    if (missing.length) warn(`ending art (SPEC §31): ${missing.length} of ${ids.length} ending(s) have no illustration yet (no manifest scene "end_<id>" or no PNG) — allowed by --allow-missing-ending-art; the real gate is the run without that flag`);
  } else for (const [fid, id, why] of missing) err(`ending art ${fid}/${id}: ${why} (SPEC §31; --allow-missing-ending-art while the art is in progress)`);
  // manifest scenes / PNG files for endings that do not exist (renamed or removed ending)
  const orphans = Object.keys(WH.scenes).filter((k) => /^end_/.test(k) && !known.has(k.slice(4)));
  if (orphans.length) warn(`ending art: ${orphans.length} manifest scene(s) end_* without an ending node: ${orphans.slice(0, 6).join(", ")}${orphans.length > 6 ? ", …" : ""}`);
  const dir = path.join(ROOT, "assets", "endings");
  if (fs.existsSync(dir)) {
    const extra = fs.readdirSync(dir).filter((f) => /\.png$/i.test(f) && !known.has(f.replace(/\.png$/i, "")));
    if (extra.length) warn(`ending art: ${extra.length} PNG(s) in assets/endings/ without an ending node: ${extra.slice(0, 6).join(", ")}${extra.length > 6 ? ", …" : ""}`);
  }
  // the brief the art role works from must match the data (tools/dev/dump_endings.js --check)
  const brief = path.join(ROOT, "tools", "art", "endings_brief.json");
  const r = require("child_process").spawnSync(process.execPath, [path.join(ROOT, "tools", "dev", "dump_endings.js"), "--check"], {encoding: "utf8"});
  if (r.error) warn(`ending brief: could not run tools/dev/dump_endings.js --check (${r.error.message})`);
  else if (r.status !== 0) {
    let n = null;
    try { n = JSON.parse(fs.readFileSync(brief, "utf8")).count; } catch (e) { /* missing or unreadable → count unknown */ }
    const msg = `tools/art/endings_brief.json is stale (${n === null ? "missing/unreadable" : n + " in the brief"} vs ${ids.length} ending nodes) — run: node tools/dev/dump_endings.js`;
    if (n !== ids.length) err(`ending brief: ${msg}; the ending count differs (SPEC §31)`); else warn(`ending brief: ${msg}`);
  } else note(`ending brief: ${(r.stdout || "").trim()}`);
  if (!QUIET) console.log(`ending art (SPEC §31): ${ids.length - missing.length}/${ids.length} illustrated${ALLOW_MISSING_END_ART ? " (missing allowed)" : ""}`);
}

/* ---------- codex + events ---------- */
function checkCodex() {
  const ids = Object.keys(WH.codex);
  if (!ids.length) err("codex: no entries registered");
  const noRace = [], noType = [];
  for (const id of ids) {
    const c = WH.codex[id], w = `codex.${id}`;
    if (c.race === undefined) noRace.push(id); else if (!RACES.includes(c.race)) err(`${w}: bad race "${c.race}" (${RACES.join("|")})`);
    if (c.type === undefined) noType.push(id); else if (!TYPES.includes(c.type)) err(`${w}: bad type "${c.type}" (${TYPES.join("|")})`);
    if (c.type === "place" && c.cat !== undefined && c.cat !== "place") warn(`${w}: type "place" but cat "${c.cat}" (places view uses type)`);
    const chr = isChr(c);
    if (c.hidden !== undefined && typeof c.hidden !== "boolean") err(`${w}: hidden must be true/false`);
    if (!CODEX_CATS.includes(c.cat) && !(chr && c.cat === undefined)) err(`${w}: bad cat "${c.cat}"`);   // chronicle entries may omit cat (SPEC §20)
    if (!CODEX_FACTIONS.includes(c.faction)) err(`${w}: bad faction "${c.faction}"`);
    sprite(c.sprite, w);
    if (chr) { checkChronicle(id, c, w); }
    else if (c.tags !== undefined && !Array.isArray(c.tags)) err(`${w}.tags: must be an array of strings`);
    else if (c.date !== undefined || c.sortKey !== undefined) warn(`${w}: has date/sortKey but no tags:["chronicle"] — not shown in 战史`);
    if (chr) { /* sprite optional: the lore card shows a millennium seal */ }
    else if (c.cat === "place") {
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
  const short = (a) => a.slice(0, 6).join(", ") + (a.length > 6 ? `, … (+${a.length - 6})` : "");
  if (noRace.length) warn(`codex: ${noRace.length} entr${noRace.length > 1 ? "ies" : "y"} without race (SPEC §13; UI derives one): ${short(noRace)}`);
  if (noType.length) warn(`codex: ${noType.length} entr${noType.length > 1 ? "ies" : "y"} without type (SPEC §13; UI derives one from cat): ${short(noType)}`);
}
/* ---------- SPEC §27 sector + echoes ---------- */
function checkEchoes() {
  const T = WH.echoTemplates || [];
  for (const fid of Object.keys(WH.factions)) {
    const f = WH.factions[fid];
    if (f.world === undefined) { if (!SAMPLE) warn(`faction.${fid}: no world {zh,en} (SPEC §27; echoes fall back to the sector name)`); }
    else checkL(f.world, `faction.${fid}.world`, 12, 6);
    WH.Game.origins(f).forEach((o) => { if (o.world !== undefined) checkL(o.world, `faction.${fid}.origins.${o.id}.world`, 12, 6); });
  }
  if (!T.length) { if (!SAMPLE) note("echoes (SPEC §27): no WH.echoTemplates yet (data/sector.js)"); return; }
  const seen = new Set(), known = new Set(FACTION_FILES.concat(Object.keys(WH.factions)));
  T.forEach((tp, i) => {
    const w = `echoTemplate.${(tp && tp.id) || "#" + i}`;
    if (!tp || !tp.id) { err(`${w}: missing id`); return; }
    if (seen.has(tp.id)) err(`${w}: duplicate id`); seen.add(tp.id);
    checkL(tp.text, w + ".text");
    for (const fx of tp.factions || ["*"]) if (fx !== "*" && !known.has(fx)) err(`${w}: unknown faction "${fx}"`);
    for (const l of ["zh", "en"]) {
      const txt = (tp.text && tp.text[l]) || "", ph = [...txt.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
      for (const p of ph) if (!["role", "world", "cause", "god"].includes(p)) err(`${w}.text.${l}: unknown placeholder {${p}}`);
      if (tp.claim && (!ph.includes("god") || ph.includes("cause"))) err(`${w}.text.${l}: claim templates use {god} and never {cause}`);
      if (!tp.claim && (!ph.includes("cause") || ph.includes("god"))) err(`${w}.text.${l}: non-claim templates use {cause} and never {god}`);
    }
  });
  for (const g of TAINT_GODS) if (!(WH.echoGods && WH.echoGods[g])) warn(`echoes: WH.echoGods.${g} missing`);
  // every route can hear both kinds; filled length with that route's longest role / world / cause (the echo's source can be any route)
  const vals = {role: [], world: [], cause: []};
  for (const f of Object.values(WH.factions)) {
    WH.Game.origins(f).forEach((o) => { vals.role.push(o.name || f.role); vals.world.push(o.world || f.world || f.name); });
    Object.values(f.nodes || {}).forEach((n) => { if (n.ending && n.ending.cause) vals.cause.push(n.ending.cause); });
  }
  const longest = (arr, l) => arr.reduce((a, x) => { const v = (x && x[l]) || ""; return v.length > a.length ? v : a; }, "");
  for (const fid of Object.keys(WH.factions)) {
    const ap = (tp) => (tp.factions || ["*"]).some((x) => x === "*" || x === fid);
    if (!T.some((tp) => ap(tp) && !tp.claim)) warn(`echoes: no non-claim template is heard on ${fid}`);
    if (!T.some((tp) => ap(tp) && tp.claim)) warn(`echoes: no claim template is heard on ${fid}`);
  }
  for (const tp of T) for (const l of ["zh", "en"]) {
    const e = {role: {[l]: longest(vals.role, l)}, world: {[l]: longest(vals.world, l)}, cause: {[l]: longest(vals.cause, l)}, claimedBy: "tzeentch"};
    const filled = WH.Rules.fillEcho(tp, e, l);
    if (l === "zh" && zhLen(filled) > 50) warn(`echoTemplate.${tp.id}: filled zh ${zhLen(filled)} chars > 50 with the longest role/world/cause`);
    if (l === "en" && enWords(filled) > 35) warn(`echoTemplate.${tp.id}: filled en ${enWords(filled)} words > 35 with the longest role/world/cause`);
  }
  console.log(`echoes (SPEC §27): ${T.length} templates (claim ${T.filter((x) => x.claim).length}) · worlds ${Object.keys(WH.factions).filter((fid) => WH.factions[fid].world).length}/${Object.keys(WH.factions).length} routes`);
}

/* ---------- SPEC §25 achievements ---------- */
const ACH_FIELDS = {ending: {id: "s!"}, endingKind: {kind: "kind!", count: "n", faction: "f"}, endingsAll: {faction: "f!"}, claim: {god: "god!"}, claimAll: {},
  chosen: {}, resist: {count: "n!"}, deaths: {count: "n!", cause: "cause", faction: "f"}, runs: {count: "n!"}, origins: {faction: "f!"}, factionsAll: {},
  codexPct: {pct: "pct!", type: "type", race: "race"}, chronicleAll: {}, rumors: {count: "n!"}, egg: {tier: "tier!"}, survive: {stat: "stat!", max: "n!"},
  fast: {maxNodes: "n!"}, flag: {id: "s!", faction: "f"}, taintSum: {min: "n!"}};
function checkAchievements() {
  const list = WH.achievements || [];
  if (!list.length) { if (!SAMPLE) note("achievements (SPEC §25): none registered yet (data/achievements.js)"); return; }
  const seen = new Set(), tiers = {}, types = {}, pendingRefs = [];
  const allEndings = new Set(); Object.values(WH.factions).forEach((f) => Object.keys(f.nodes || {}).forEach((id) => { if (f.nodes[id].ending) allEndings.add(id); }));
  const known = new Set(FACTION_FILES.concat(Object.keys(WH.factions)));
  list.forEach((a, i) => {
    const w = `achievement.${(a && a.id) || "#" + i}`;
    if (!a || typeof a !== "object") { err(`achievement #${i}: not an object`); return; }
    if (!a.id || !/^ach_[a-z0-9_]+$/.test(a.id)) err(`${w}: id must be ach_<slug>`);
    if (seen.has(a.id)) err(`${w}: duplicate id`); seen.add(a.id);
    checkL(a.name, w + ".name", 16, 8); checkL(a.desc, w + ".desc", 30, 20);
    if (!["bronze", "silver", "gold"].includes(a.tier)) err(`${w}: tier "${a.tier}" (bronze|silver|gold)`); tiers[a.tier] = (tiers[a.tier] || 0) + 1;
    if (a.hidden !== undefined && typeof a.hidden !== "boolean") err(`${w}: hidden must be true/false`);
    if (!a.icon) warn(`${w}: no icon`);
    else if (/^icon_/.test(a.icon)) uiIcon(a.icon, w + ".icon"); else sprite(a.icon, w + ".icon");
    const keys = Object.keys(a.cond || {});
    if (keys.length !== 1) { err(`${w}.cond: must have exactly one condition type (got ${keys.join(",") || "none"})`); return; }
    const type = keys[0], c = a.cond[type], spec = ACH_FIELDS[type];
    types[type] = (types[type] || 0) + 1;
    if (!spec) { err(`${w}.cond: unknown type "${type}" (${Object.keys(ACH_FIELDS).join("|")})`); return; }
    if (!c || typeof c !== "object" || Array.isArray(c)) { err(`${w}.cond.${type}: must be an object`); return; }
    for (const k of Object.keys(c)) if (!(k in spec)) err(`${w}.cond.${type}: unknown field "${k}"`);
    for (const [k, kind] of Object.entries(spec)) {
      const v = c[k], req = kind.endsWith("!"), kd = kind.replace("!", "");
      if (v === undefined) { if (req) err(`${w}.cond.${type}.${k} missing`); continue; }
      const bad = (m) => err(`${w}.cond.${type}.${k}: ${JSON.stringify(v)} (${m})`);
      if (kd === "n" && !(Number.isInteger(v) && v >= 0)) bad("need an integer ≥ 0");
      if (kd === "pct" && !(typeof v === "number" && v > 0 && v <= 100)) bad("need 1–100");
      if (kd === "kind" && !["good", "bad", "death"].includes(v)) bad("good|bad|death");
      if (kd === "god" && !TAINT_GODS.includes(v)) bad(TAINT_GODS.join("|"));
      if (kd === "cause" && !["hp", "sanity", "corruption"].includes(v)) bad("hp|sanity|corruption");
      if (kd === "stat" && !["hp", "sanity"].includes(v)) bad("hp|sanity");
      if (kd === "type" && !TYPES.includes(v)) bad(TYPES.join("|"));
      if (kd === "race" && !RACES.includes(v)) bad(RACES.join("|"));
      if (kd === "tier" && ![25, 50, 75, 99, 100].includes(v)) bad("25|50|75|99|100 (SPEC §21 values)");
      if (kd === "f") { if (!known.has(v)) bad("unknown faction"); else if (!WH.factions[v]) pendingRefs.push(`${a.id} → faction ${v}`); }
      if (kd === "s" && type === "ending" && !allEndings.has(v)) pendingRefs.push(`${a.id} → ending ${v}`);
    }
    if (type === "ending" && c.id && allEndings.has(c.id)) { const own = Object.values(WH.factions).find((f) => f.nodes && f.nodes[c.id]); if (own && !own.nodes[c.id].ending) err(`${w}: ${c.id} is not an ending`); }
    if (type === "flag" && c.id) {
      const pool = c.faction ? (WH.factions[c.faction] ? [WH.factions[c.faction]] : []) : Object.values(WH.factions);
      const setIn = pool.some((f) => Object.values(f.nodes || {}).some((n) => (n.effects && n.effects.set && n.effects.set[c.id]) || (n.choices || []).some((ch) => ch.effects && ch.effects.set && ch.effects.set[c.id])))
        || WH.events.some((e) => (e.choices || []).some((ch) => ch.effects && ch.effects.set && ch.effects.set[c.id]));
      if (pool.length && !setIn) warn(`${w}: flag "${c.id}" is never set${c.faction ? " in " + c.faction : ""} (unreachable)`);
    }
    if (type === "egg" && !(WH.easter && WH.easter.tzeentch)) warn(`${w}: easter egg data not loaded`);
  });
  if (pendingRefs.length) warn(`achievements: ${pendingRefs.length} reference(s) not loaded yet (pending route data): ${pendingRefs.slice(0, 8).join(", ")}${pendingRefs.length > 8 ? ", …" : ""}`);
  console.log(`achievements (SPEC §25): ${list.length} · tiers ${Object.entries(tiers).map(([k, v]) => `${k} ${v}`).join(" · ")} · hidden ${list.filter((a) => a.hidden).length} · types ${Object.keys(types).length}/${Object.keys(ACH_FIELDS).length}`);
}

/* ---------- SPEC §21 hidden entries + Tzeentch easter egg ---------- */
const EGG_TIERS = [[25, "whisper"], [50, "letter"], [75, "flame"], [99, "last"], [100, "planned"]];
function checkEgg() {
  const hidden = Object.keys(WH.codex).filter((id) => WH.codex[id].hidden);
  // hidden entries must not be things the player is told to collect (they never appear as ??? / in counts)
  const learnRefs = new Set();
  Object.values(WH.factions).forEach((f) => ["leaders", "enemies", "boss"].forEach((g) => ((f.learn && f.learn[g]) || []).forEach((x) => learnRefs.add(x))));
  for (const id of hidden) if (learnRefs.has(id)) err(`codex.${id}: hidden entry is in a faction's learn list (would show as ??? on the ending screen)`);
  const e = WH.easter && WH.easter.tzeentch;
  if (!e) { if (!SAMPLE) note("easter egg (SPEC §21): data/easter_tzeentch.js not loaded"); return hidden; }
  const w = "easter.tzeentch";
  sprite(e.sprite, w + ".sprite"); sprite(e.sigil, w + ".sigil");
  if (!Array.isArray(e.tiers)) { err(`${w}.tiers: must be an array`); return hidden; }
  for (const [at, id] of EGG_TIERS) {
    const tr = e.tiers.find((x) => x && x.id === id);
    if (!tr) { warn(`${w}: tier "${id}" (${at}) missing`); continue; }
    if (tr.at !== at) warn(`${w}.${id}: at ${tr.at} (SPEC §21: ${at})`);
    checkL(tr.text, `${w}.${id}.text`);
    if (["letter", "flame", "planned"].includes(id)) checkL(tr.title, `${w}.${id}.title`);
    if (id === "flame") {
      if (!Array.isArray(tr.choices) || tr.choices.length !== 2) err(`${w}.flame: needs 2 choices`);
      else tr.choices.forEach((c, i) => { checkL(c.text, `${w}.flame.choice${i + 1}.text`, 24, 14); checkL(c.result, `${w}.flame.choice${i + 1}.result`); });
    }
  }
  for (const tr of e.tiers) if (!EGG_TIERS.some(([, id]) => id === tr.id)) warn(`${w}: unknown tier id "${tr.id}"`);
  const eid = e.codex || "egg_tzeentch_letter";
  if (!WH.codex[eid]) err(`${w}: codex entry "${eid}" missing`);
  else if (!WH.codex[eid].hidden) err(`codex.${eid}: easter-egg entry must have hidden:true (SPEC §21)`);
  return hidden;
}

/* ---------- SPEC §20 chronicle entries ---------- */
const isChr = (c) => !!(c && Array.isArray(c.tags) && c.tags.includes("chronicle"));
/* "999.M41" → {mill:41, year:999, approx:false}; ranges "005–014.M31" use the LAST date; 约/c./ca. → approx */
function parseImpDate(s) {
  if (typeof s !== "string") return null;
  const all = [...s.matchAll(/(?:(\d{1,3})\s*\.\s*)?M\s*(\d{2})/g)];
  if (!all.length) return null;
  const m = all[all.length - 1];
  return {mill: +m[2], year: m[1] !== undefined ? +m[1] : null, approx: /约|c\.|ca\.|circa|~|左右|前后|末|初|早期|晚期|late|early|mid/i.test(s) || all.length > 1 || /[–—-]/.test(s)};
}
function checkChronicle(id, c, w) {
  if (!/^chr_/.test(id)) warn(`${w}: chronicle id should start with chr_ (SPEC §20)`);
  if (!c.tags.every((x) => typeof x === "string")) err(`${w}.tags: must be strings`);
  if (c.type !== "concept") warn(`${w}: chronicle entry type "${c.type}" (SPEC §20: concept)`);
  if (c.faction !== "any") warn(`${w}: chronicle entry faction "${c.faction}" (SPEC §20: any)`);
  if (c.race === undefined) err(`${w}: chronicle entry needs race (race chips in 战史)`);
  if (c.date === undefined) err(`${w}: chronicle entry needs date {zh,en} (shown even when locked)`);
  else if (typeof c.date === "string") warn(`${w}.date: plain string — use {zh,en}`);
  else checkL(c.date, w + ".date", 16, 8);
  if (typeof c.sortKey !== "number" || !isFinite(c.sortKey)) { err(`${w}: sortKey must be a number (e.g. 41999 for 999.M41)`); return; }
  if (c.sortKey > 43999) warn(`${w}: sortKey ${c.sortKey} beyond M43 (expected mill×1000 + year)`);
  if (c.sortKey < 1000) return;      // 远古 / Ancient band (e.g. War in Heaven, negative keys) — no Mxx check
  const ds = c.date && (typeof c.date === "string" ? c.date : (c.date.en || c.date.zh));
  const pd = parseImpDate(ds);
  if (!pd) { if (ds) note(`${w}: date "${ds}" has no Mxx — timeline groups it by sortKey M${Math.floor(c.sortKey / 1000)}`); return; }
  const km = Math.floor(c.sortKey / 1000);
  if (pd.mill !== km) warn(`${w}: date "${ds}" is M${pd.mill} but sortKey ${c.sortKey} sorts it into M${km}`);
  else if (pd.year !== null && !pd.approx && c.sortKey !== km * 1000 + pd.year && Math.floor(c.sortKey) !== km * 1000 + pd.year)
    warn(`${w}: date "${ds}" → sortKey ${km * 1000 + pd.year} expected, has ${c.sortKey}`);
  if (c.date && typeof c.date === "object" && c.date.zh && c.date.en) {
    const a = parseImpDate(c.date.zh), b = parseImpDate(c.date.en);
    if (a && b && (a.mill !== b.mill || a.year !== b.year)) warn(`${w}.date: zh "${c.date.zh}" and en "${c.date.en}" disagree`);
  }
}
function chronicleReport() {
  const ids = Object.keys(WH.codex).filter((id) => isChr(WH.codex[id]));
  if (!ids.length) { if (!SAMPLE) note("chronicle (SPEC §20): no entries yet (data/chronicle.js)"); return; }
  const by = {}, keys = new Map();
  for (const id of ids) {
    const k = WH.codex[id].sortKey, m = typeof k === "number" ? (k < 1000 ? "Ancient" : "M" + Math.floor(k / 1000)) : "M??";
    by[m] = (by[m] || 0) + 1;
    if (typeof k === "number") { if (keys.has(k)) note(`chronicle: ${id} and ${keys.get(k)} share sortKey ${k} (tie → id order)`); else keys.set(k, id); }
  }
  const mk = (m) => m === "Ancient" ? -1 : m === "M??" ? 999 : +m.slice(1);
  console.log(`chronicle (SPEC §20): ${ids.length} entries · by millennium ${Object.keys(by).sort((a, b) => mk(a) - mk(b)).map((m) => `${m} ${by[m]}`).join(" · ")}`);
  // every chronicle entry should be unlockable somewhere (rumour, event, node, choice)
  const refs = new Set();
  const add = (x) => [].concat(x || []).forEach((i) => refs.add(i));
  (WH.rumors || []).forEach((r) => add(r.codex));
  WH.events.forEach((e) => { add(e.codex); (e.choices || []).forEach((c) => add(c.codex)); });
  Object.values(WH.factions).forEach((f) => Object.values(f.nodes || {}).forEach((n) => { add(n.codex); (n.choices || []).forEach((c) => add(c.codex)); }));
  const orphan = ids.filter((id) => !refs.has(id));
  if (orphan.length) warn(`chronicle: ${orphan.length} entr${orphan.length > 1 ? "ies are" : "y is"} never unlocked by any rumour/event/node (stays ??? forever): ${orphan.slice(0, 8).join(", ")}${orphan.length > 8 ? ", …" : ""}`);
}

/* ---------- SPEC §20 rumours ---------- */
/* ---------- SPEC §20c gathering places (聚集区) ---------- */
const GATHER_ZH = 8, GATHER_EN = 4;                                  // label limits
const GATHER_MIN_NODES = 8, GATHER_MIN_CHAPTERS = 6;                  // per route
const GATHER_ERR_PASSES = 5, GATHER_WARN_PASSES = 6;                  // per origin, average gather nodes passed per finished random run
const GATHER_RUMOR_LO = 3, GATHER_RUMOR_HI = 6;                       // rumours heard per run (warn outside)
const GATHER_BAD_SCENES = ["warp", "void", "webway", "daemon_world", "tomb_interior", "stasis_gallery"];   // storm / solitude / tomb scenes contradict a crowd (warn)
/* pure: what is wrong with node.gather → {errs[], warns[]} (used by the validator and by --gather-report) */
function gatherProblems(n) {
  const E = [], W = [], g = n && n.gather;
  if (g === undefined) return {errs: E, warns: W};
  if (!g || typeof g !== "object" || Array.isArray(g)) { E.push("gather must be {zh, en}"); return {errs: E, warns: W}; }
  for (const k of Object.keys(g)) if (k !== "zh" && k !== "en") E.push(`gather: unknown key "${k}"`);
  let shape = true;
  for (const l of ["zh", "en"]) if (typeof g[l] !== "string" || !g[l].trim()) { E.push(`gather.${l} missing`); shape = false; }
  if (!shape) return {errs: E, warns: W};
  if (zhLen(g.zh) > GATHER_ZH) E.push(`gather.zh "${g.zh}" is ${zhLen(g.zh)} chars (max ${GATHER_ZH})`);
  if (enWords(g.en) > GATHER_EN) E.push(`gather.en "${g.en}" is ${enWords(g.en)} words (max ${GATHER_EN})`);
  if (n.ending) E.push("gather on an ending / death node (SPEC §20c: never)");
  if (n.eventRoll !== undefined) E.push("gather on a node with eventRoll (SPEC §20c: a crowd scene and a random event do not mix)");
  const t = n.text || {};
  if (typeof t.zh === "string" && !t.zh.includes(g.zh)) E.push(`text.zh does not contain the label "${g.zh}" (SPEC §20c coherence: the text must show the place)`);
  if (typeof t.en === "string" && !t.en.toLowerCase().includes(g.en.toLowerCase())) E.push(`text.en does not contain the label "${g.en}" (SPEC §20c coherence: the text must show the place)`);
  (Array.isArray(n.alt) ? n.alt : []).forEach((a, i) => {
    if (!a || !a.text || typeof a.text !== "object") return;
    if (typeof a.text.zh === "string" && !a.text.zh.includes(g.zh)) W.push(`alt[${i}].text.zh replaces the node text without the label "${g.zh}"`);
    if (typeof a.text.en === "string" && !a.text.en.toLowerCase().includes(g.en.toLowerCase())) W.push(`alt[${i}].text.en replaces the node text without the label "${g.en}"`);
  });
  if (n.foe) W.push(`gather on a foe node (${n.foe}) — a crowd and a fight rarely mix`);
  if (GATHER_BAD_SCENES.includes(n.scene)) W.push(`gather in scene "${n.scene}" (storm / solitude / tomb scenes contradict a crowd)`);
  if (n.time && n.time.warp) W.push("gather on a warp-time node");
  return {errs: E, warns: W};
}
/* static per-route facts: gather node ids (valid shape, not endings), chapters, gather→gather hops, gather nodes each origin can reach */
function gatherStatic(f) {
  const nodes = f.nodes || {}, ids = Object.keys(nodes).filter((id) => WH.Rules.isGather(nodes[id]) && !nodes[id].ending), set = new Set(ids);
  const chapters = [...new Set(ids.map((id) => nodes[id].chapter).filter((c) => typeof c === "number"))].sort((a, b) => a - b);
  const adjacent = [];
  ids.forEach((id) => (nodes[id].choices || []).forEach((c) => targetsOf(c).forEach((t) => { if (t && t !== id && set.has(t)) adjacent.push(`${id}→${t}`); })));
  const reach = {};
  WH.Game.origins(f).forEach((o) => { const r = originReach(f, o); reach[o.id] = ids.filter((id) => r.has(id)); });
  return {ids, chapters, adjacent: [...new Set(adjacent)], reach};
}
/* route-level verdict (after the simulation so a short route does not skip the Monte-Carlo): `s` = simulate() result or null */
function gatherVerdict(f, gi, s) {
  if (!gi.ids.length) { warn(`${f.id}: no gather nodes yet — rumours cannot fire (SPEC §20c)`); return; }
  if (!SAMPLE) {
    if (gi.ids.length < GATHER_MIN_NODES) err(`${f.id}: ${gi.ids.length} gather node(s) (SPEC §20c: ≥ ${GATHER_MIN_NODES})`);
    if (gi.chapters.length < GATHER_MIN_CHAPTERS) err(`${f.id}: gather nodes in ${gi.chapters.length} chapter(s) [${gi.chapters.join(",")}] (SPEC §20c: ≥ ${GATHER_MIN_CHAPTERS} different chapters)`);
    for (const [oid, list] of Object.entries(gi.reach)) if (list.length < GATHER_ERR_PASSES) err(`${f.id}.origin.${oid}: only ${list.length} gather node(s) reachable (SPEC §20c: every origin passes ≥ ${GATHER_ERR_PASSES})`);
  }
  if (gi.adjacent.length) warn(`${f.id}: ${gi.adjacent.length} gather node(s) lead straight to another gather node (SPEC §20c: at most 1 per 2 consecutive spine nodes): ${gi.adjacent.slice(0, 8).join(", ")}${gi.adjacent.length > 8 ? ", …" : ""}`);
  if (s && !SAMPLE) for (const [oid, o] of Object.entries(s.perOrigin)) {
    if (!o.gather.length) continue;
    const a = avg(o.gather);
    if (a < GATHER_ERR_PASSES) err(`${f.id}.origin.${oid}: passes ${a.toFixed(2)} gather nodes per finished run on average (SPEC §20c: every origin ≥ ${GATHER_ERR_PASSES})`);
    else if (a < GATHER_WARN_PASSES) warn(`${f.id}.origin.${oid}: passes ${a.toFixed(2)} gather nodes per finished run on average (SPEC §20c: aim for ≥ ${GATHER_WARN_PASSES})`);
  }
}

function checkRumors() {
  const list = WH.rumors || [], seen = new Set();
  const known = new Set(Object.keys(WH.factions).concat(FACTION_FILES));
  if (!list.length) { if (!SAMPLE) note("rumours (SPEC §20): none registered yet (data/rumors.js)"); return; }
  list.forEach((r, i) => {
    const w = `rumor.${(r && r.id) || "#" + i}`;
    if (!r || typeof r !== "object") { err(`rumor #${i}: not an object`); return; }
    if (!r.id || typeof r.id !== "string") err(`${w}: missing id`);
    else if (seen.has(r.id)) err(`${w}: duplicate id`);
    seen.add(r.id);
    if (!Array.isArray(r.factions) || !r.factions.length) err(`${w}: factions must be a non-empty array (ids or "*")`);
    else for (const f of r.factions) {
      if (f === "*") continue;
      if (!known.has(f) && !(SAMPLE && WH.factions[f])) err(`${w}: unknown faction "${f}"`);
      else if (!WH.factions[f]) warn(`${w}: faction "${f}" not loaded`);
    }
    for (const k of ["minChapter", "maxChapter"]) if (r[k] !== undefined && (typeof r[k] !== "number" || r[k] < 1 || r[k] > MAX_CHAPTER || r[k] % 1)) err(`${w}: ${k} ${r[k]} (need an integer 1–${MAX_CHAPTER})`);
    if (typeof r.minChapter === "number" && typeof r.maxChapter === "number" && r.minChapter > r.maxChapter) err(`${w}: minChapter ${r.minChapter} > maxChapter ${r.maxChapter} (never eligible)`);
    if (r.speaker !== null && r.speaker !== undefined) checkL(r.speaker, w + ".speaker", 10, 6);
    checkL(r.text, w + ".text", RUMOR_ZH, RUMOR_EN);
    if (r.codex !== undefined && !Array.isArray(r.codex)) err(`${w}.codex: must be an array of codex ids`);
    codexRef(r.codex, w);
    for (const k of Object.keys(r)) if (!["id", "factions", "minChapter", "maxChapter", "speaker", "text", "codex", "when"].includes(k)) warn(`${w}: unknown key "${k}"`);
    checkWhen(r, w);
  });
}
/* SPEC §20b: when = any of {scenes, sprites, codex, flags, keywords:{zh,en}}; SPEC §20c: only a preference now (a rumour without it is idle crowd chatter, score 0) */
function checkWhen(r, w) {
  const wh = r.when;
  if (wh === undefined) { warn(`${w}: no "when" — heard only as score-0 crowd chatter at gather nodes (SPEC §20c; add a "when" to make it relevant)`); return; }
  if (!wh || typeof wh !== "object" || Array.isArray(wh)) { err(`${w}.when: must be an object`); return; }
  const keys = Object.keys(wh);
  if (!keys.length) err(`${w}.when: empty (never matches)`);
  const strArr = (k) => { if (wh[k] === undefined) return []; if (!Array.isArray(wh[k]) || wh[k].some((x) => typeof x !== "string" || !x.trim())) { err(`${w}.when.${k}: must be an array of strings`); return []; } return wh[k]; };
  for (const k of keys) if (!["scenes", "sprites", "codex", "flags", "keywords"].includes(k)) err(`${w}.when: unknown criterion "${k}"`);
  strArr("scenes").forEach((x) => scene(x, `${w}.when.scenes`));
  strArr("sprites").forEach((x) => sprite(x, `${w}.when.sprites`));
  codexRef(strArr("codex"), `${w}.when.codex`);
  strArr("flags").forEach((x) => { if (!ALL_FLAGS.has(x)) warn(`${w}.when.flags: flag "${x}" is never set`); });
  if (wh.keywords !== undefined) {
    const kw = wh.keywords;
    if (!kw || typeof kw !== "object" || Array.isArray(kw)) err(`${w}.when.keywords: must be {zh:[…], en:[…]}`);
    else for (const l of Object.keys(kw)) {
      if (!["zh", "en"].includes(l)) warn(`${w}.when.keywords: unknown language "${l}"`);
      if (!Array.isArray(kw[l]) || kw[l].some((x) => typeof x !== "string" || !x.trim())) err(`${w}.when.keywords.${l}: must be an array of non-empty strings`);
      else kw[l].forEach((x) => { if (l === "en" && x.trim().length < 3) warn(`${w}.when.keywords.en: "${x}" is very short (substring match)`); });
    }
  }
}
/* SPEC §20c static coverage: a rumour can only be heard on a gather node (no ending, no eventRoll) whose chapter lies inside its window.
 * Routes without any gather node yet are skipped here (they get their own "no gather nodes yet" warning). */
function rumorNodes(f) {
  return Object.keys(f.nodes || {}).filter((id) => { const n = f.nodes[id]; return !n.ending && !n.eventRoll && WH.Rules.isGather(n); });
}
function rumorCoverage() {
  const list = (WH.rumors || []).filter((r) => r && r.id);
  if (!list.length) return;
  const withGather = Object.keys(WH.factions).filter((fid) => rumorNodes(WH.factions[fid]).length);
  if (!withGather.length) { note(`rumours (SPEC §20c): no route has gather nodes yet — none of the ${list.length} rumours can be heard`); return; }
  const rows = [], zero = [];
  for (const r of list) {
    const routes = withGather.filter((fid) => (r.factions || []).some((x) => x === "*" || x === fid));
    if (!routes.length) continue;                       // all of its routes are still without gather nodes
    const parts = [];
    let total = 0;
    for (const fid of routes) {
      const f = WH.factions[fid], ids = rumorNodes(f);
      const ok = ids.filter((id) => { const ch = f.nodes[id].chapter; return typeof ch !== "number" || WH.Rules.rumorEligible(r, fid, ch); });
      const hit = ok.filter((id) => WH.Rules.rumorScore(r, WH.Rules.nodeContext(f.nodes[id], {})) > 0);
      total += ok.length;
      parts.push(`${fid} ${ok.length}/${ids.length}${hit.length ? ` (${hit.length} match)` : ""}`);
    }
    if (!total) zero.push(r.id);
    rows.push(`  ${r.id.padEnd(30)} ${parts.join(" · ")}`);
  }
  if (zero.length) warn(`rumours (SPEC §20c): ${zero.length} have no gather node in their chapter range on any route that has gather nodes (unreachable): ${zero.slice(0, 10).join(", ")}${zero.length > 10 ? ", …" : ""}`);
  if (!QUIET) { console.log("rumour coverage (SPEC §20c: gather nodes in the rumour's chapter window / gather nodes of the route; match = `when` scores > 0):"); rows.forEach((x) => console.log(x)); }
}
function rumorReport() {
  const list = WH.rumors || [];
  if (!list.length) return;
  // single-route rumours count toward that route's 8–12 quota; "*" and multi-route rumours count as shared
  const isShared = (r) => (r.factions || []).includes("*") || (r.factions || []).length > 1;
  const shared = list.filter(isShared).length;
  const parts = Object.keys(WH.factions).filter((id) => !ONLY || id === ONLY).map((fid) => {
    const own = list.filter((r) => !isShared(r) && (r.factions || []).includes(fid)).length;
    const chs = Object.keys(WH.factions[fid].chapters || {}).map(Number).sort((a, b) => a - b);
    const per = chs.map((ch) => list.filter((r) => WH.Rules.rumorEligible(r, fid, ch)).length);
    const gaps = chs.filter((ch, i) => !per[i]);
    if (!SAMPLE && own && (own < 8 || own > 12)) warn(`rumours: ${fid} has ${own} route rumours (SPEC §20: 8–12)`);
    if (gaps.length && !SAMPLE) note(`rumours: ${fid} chapter(s) ${gaps.join(",")} have no eligible rumour`);
    return `${fid} ${own}+${shared} (ch ${per.join("/")})`;
  });
  if (!SAMPLE && (shared < 10 || shared > 25)) warn(`rumours: ${shared} shared ("*" or multi-route) rumours (SPEC §20: ~15)`);
  console.log(`rumours (SPEC §20): ${list.length} total · per route own+shared (eligible per chapter): ${parts.join(" · ")}`);
}

/* race × type table, using the same fallback as the UI for entries that lack the fields */
const CAT_TYPE = {leader: "figure", boss: "figure", enemy: "unit", god: "deity", lore: "concept", place: "place"};
function codexTable() {
  const tab = {}, tot = {};
  for (const id of Object.keys(WH.codex)) {
    const c = WH.codex[id];
    const r = RACES.includes(c.race) ? c.race : "(none)";
    const t = TYPES.includes(c.type) ? c.type : "(" + (CAT_TYPE[c.cat] || "?") + ")";
    tab[r] = tab[r] || {}; tab[r][t] = (tab[r][t] || 0) + 1; tot[r] = (tot[r] || 0) + 1;
  }
  const cols = TYPES.concat([...new Set(Object.values(tab).flatMap((o) => Object.keys(o)).filter((t) => !TYPES.includes(t)))]);
  const rows = RACES.concat(Object.keys(tab).filter((r) => !RACES.includes(r))).filter((r) => tab[r]);
  console.log("codex race × type:");
  console.log("  " + "race".padEnd(10) + cols.map((c) => c.slice(0, 9).padStart(10)).join("") + "     total");
  for (const r of rows) console.log("  " + r.padEnd(10) + cols.map((c) => String(tab[r][c] || "·").padStart(10)).join("") + String(tot[r]).padStart(10));
}
function checkEvents() {
  const seen = new Set(), perGod = {}, claims = {};
  if (!WH.events.length) warn("events: none registered");
  for (const e of WH.events) {
    const w = `event.${e.id}`;
    if (!e.id) { err("event without id"); continue; }
    if (seen.has(e.id)) err(`${w}: duplicate id`);
    seen.add(e.id);
    if (!GODS.includes(e.god)) err(`${w}: bad god "${e.god}"`);
    perGod[e.god] = (perGod[e.god] || 0) + 1;
    if (e.trigger !== undefined && e.trigger !== "claim") err(`${w}: unknown trigger "${e.trigger}"`);
    if (e.trigger === "claim") {
      if (!TAINT_GODS.includes(e.god)) err(`${w}: claim event needs god khorne|nurgle|tzeentch|slaanesh`);
      claims[e.god] = (claims[e.god] || 0) + 1;
      if (e.cleanse) warn(`${w}: claim event marked cleanse`);
    }
    if (e.cleanse !== undefined && typeof e.cleanse !== "boolean") err(`${w}: cleanse must be true/false`);
    for (const f of e.factions || []) if (f !== "*" && !WH.factions[f]) warn(`${w}: faction "${f}" not loaded`);
    scene(e.scene, w);
    if (e.speaker) { sprite(e.speaker.sprite, w + ".speaker"); checkL(e.speaker.name, w + ".speaker.name"); }
    sprite(e.foe, w + ".foe");
    checkL(e.text, w + ".text", 90, 65);
    codexRef(e.codex, w);
    if (!e.choices || e.choices.length < 2 || e.choices.length > 3) err(`${w}: needs 2–3 choices (has ${(e.choices || []).length})`);
    const applies = Object.keys(WH.factions).filter((fid) => (e.factions || ["*"]).some((x) => x === "*" || x === fid) && !(e.excludeFactions || []).includes(fid));
    checkWhere(e, w, applies);                          // SPEC §32.3 where / excludeFactions
    (e.choices || []).forEach((c, i) => {
      const cw = `${w}.choice${i + 1}`;
      checkL(c.text, `${cw}.text`, 24, 14);
      checkL(c.result, `${cw}.result`, 90, 65);
      checkEffects(c.effects, cw);
      codexRef(c.codex, cw);
      checkRequire(c.require, cw, ALL_FLAGS);
      if (c.goto !== undefined) checkGoto(c.goto, cw, applies, e);
    });
    // SPEC §19: at least one choice must be open on the first fire, and (claims) on the second fire after resisting
    const openWith = (flags) => (e.choices || []).filter((c) => WH.Rules.requireOK(c.require, {flags, stats: {hp: 50, sanity: 50, corruption: 50, renown: 50}, taint: WH.Rules.zeroTaint()}));
    if (e.choices && e.choices.length && !openWith({}).length) err(`${w}: every choice is locked on a fresh run (softlock; engine opens the last one)`);
    if (e.trigger === "claim" && TAINT_GODS.includes(e.god)) {
      const second = openWith({["claimed_" + e.god]: true, ["resisted_" + e.god]: true});
      if (!second.length) err(`${w}: no choice open on the 2nd claim (flag resisted_${e.god}) — softlock`);
      else if (second.some((c) => !c.goto)) warn(`${w}: 2nd claim (flag resisted_${e.god}) still offers a choice without goto — player can resist twice (SPEC §19: only accept/forced)`);
      if (!SAMPLE && !(e.choices || []).some((c) => c.goto)) warn(`${w}: claim event has no goto choice yet (SPEC §19 claim endings)`);
      if (!SAMPLE && !(e.choices || []).some((c) => c.effects && c.effects.set && c.effects.set["resisted_" + e.god])) warn(`${w}: no choice sets resisted_${e.god} (SPEC §19 resist path)`);
    }
  }
  if (!SAMPLE) {
    for (const g of TAINT_GODS) if (!claims[g]) warn(`events: no claim event (trigger:"claim") for ${g} — taint 100 does nothing (SPEC §18)`);
    for (const g of Object.keys(claims)) if (claims[g] > 1) warn(`events: ${claims[g]} claim events for ${g} (first eligible fires)`);
  }
  if (!SAMPLE) {
    if (WH.events.length && WH.events.length < 10) warn(`events: ${WH.events.length} registered (spec ~12)`);
    for (const g of ["khorne", "nurgle", "tzeentch", "slaanesh"]) if ((perGod[g] || 0) < 2) warn(`events: god ${g} has ${perGod[g] || 0} events (spec ≥2)`);
  }
  return perGod;
}

/* ---------- origins (SPEC §16) ---------- */
function checkOrigins(f, origins, nodes, flagsSet) {
  const w = `faction.${f.id}.origins`;
  if (f.origins === undefined) { if (!SAMPLE && ["imperium", "chaos", "tau", "aeldari", "necrons"].includes(f.id)) note(`${f.id}: no origins yet — engine uses one default origin built from the faction fields`); return; }
  if (!Array.isArray(f.origins) || !f.origins.length) { err(`${w}: must be a non-empty array`); return; }
  if (!SAMPLE && f.origins.length !== 3) warn(`${w}: ${f.origins.length} origins (spec 3)`);
  const seen = new Set();
  const base = f.startStats || f.origins[0].stats || {};
  const total = (st) => STATS.reduce((a, k) => a + (st[k] || 0), 0);
  f.origins.forEach((o, i) => {
    const ow = `${w}[${i}]${o && o.id ? "." + o.id : ""}`;
    if (!o || typeof o !== "object") { err(`${ow}: not an object`); return; }
    if (!o.id || typeof o.id !== "string") err(`${ow}: missing id`);
    else if (seen.has(o.id)) err(`${ow}: duplicate origin id`);
    seen.add(o.id);
    checkL(o.name, ow + ".name");
    checkL(o.desc, ow + ".desc", 40, 25, true);
    if (!o.sprite) warn(`${ow}: no sprite (falls back to playerSprite)`); else sprite(o.sprite, ow + ".sprite");
    if (!o.startNode || !nodes[o.startNode]) err(`${ow}: startNode "${o.startNode}" does not exist`);
    // SPEC §23 caps: max:{hp,sanity} 70–130 (default 100); start values default to the caps
    if (o.max !== undefined) {
      if (!o.max || typeof o.max !== "object" || Array.isArray(o.max)) err(`${ow}.max: must be {hp, sanity}`);
      else for (const k of Object.keys(o.max)) {
        if (!["hp", "sanity"].includes(k)) err(`${ow}.max: only hp/sanity can have a cap (got "${k}")`);
        else if (typeof o.max[k] !== "number" || o.max[k] < 70 || o.max[k] > 130) err(`${ow}.max.${k}: ${o.max[k]} (need 70–130)`);
      }
    }
    const caps = WH.Rules.capsOf ? WH.Rules.capsOf(o) : {hp: 100, sanity: 100};
    if (!o.stats || typeof o.stats !== "object") err(`${ow}: stats missing`);
    else {
      for (const k of STATS) {
        const v = o.stats[k], hi = caps[k] || 100;
        if (v === undefined && caps[k]) continue;                     // hp/sanity default to the cap
        if (typeof v !== "number" || v < 0 || v > hi) err(`${ow}.stats.${k}: ${v} (need a number 0–${hi})`);
        else if (caps[k] && v < hi) note(`${ow}: starts with ${k} ${v} below its cap ${hi} (SPEC §23: rare — intended?)`);
      }
      for (const k of Object.keys(o.stats)) if (!STATS.includes(k)) warn(`${ow}.stats: unknown stat "${k}"`);
      // SPEC §23 budget: (maxHp−100) + (maxSanity−100) + (renown−10) − 1.5 × corruption within ±5
      const ren = o.stats.renown || 0, cor = o.stats.corruption || 0;
      const budget = (caps.hp - 100) + (caps.sanity - 100) + (ren - 10) - 1.5 * cor;
      if (Math.abs(budget) > 5) warn(`${ow}: §23 budget ${budget >= 0 ? "+" : ""}${budget} (maxHp ${caps.hp}, maxSanity ${caps.sanity}, renown ${ren}, corruption ${cor}; need within ±5)`);
      if (i > 0) {
        const better = caps.hp > 100 || caps.sanity > 100 || ren > 10;
        const worse = caps.hp < 100 || caps.sanity < 100 || ren < 10 || cor > 0;
        if (!better || !worse) warn(`${ow}: §23 trade-off — needs at least one stat above default and one below (${better ? "no downside" : "no upside"})`);
      }
      o.__budget = budget;
    }
    void total;
    if (o.set !== undefined && (typeof o.set !== "object" || Array.isArray(o.set))) err(`${ow}.set: must be an object of flags`);
    if (o.id && (!o.set || !o.set["origin_" + o.id])) warn(`${ow}: does not set flag "origin_${o.id}" (SPEC §16)`);
    if (o.startNode && nodes[o.startNode] && nodes[o.startNode].chapter !== 1 && i > 0) warn(`${ow}: prologue start "${o.startNode}" is not in chapter 1`);
  });
  void flagsSet;
}

/* ---------- faction static checks ---------- */
function targetsOf(c) { return c.roll ? [c.roll.success, c.roll.fail] : [c.next]; }
function checkFaction(f) {
  const w = `faction.${f.id}`, nodes = f.nodes || {}, ids = Object.keys(nodes);
  const flagsSet = new Set();
  const collect = (e) => { if (e && e.set) Object.keys(e.set).forEach((k) => flagsSet.add(k)); };
  for (const id of ids) { collect(nodes[id].effects); (nodes[id].choices || []).forEach((c) => collect(c.effects)); }
  WH.events.forEach((e) => (e.choices || []).forEach((c) => collect(c.effects)));
  const origins = WH.Game.origins(f);
  origins.forEach((o) => collect(o));                 // origin.set flags (SPEC §16)

  checkL(f.name, w + ".name"); checkL(f.tagline, w + ".tagline", 20, 12); checkL(f.role, w + ".role");
  checkL(f.renownLabel, w + ".renownLabel");
  if (f.renownHelp === undefined) { if (!SAMPLE) warn(`${w}: no renownHelp (SPEC §17 tip after first death)`); }
  else checkL(f.renownHelp, w + ".renownHelp", 80, 55);
  sprite(f.playerSprite, w + ".playerSprite");
  uiIcon(f.renownIcon, w + ".renownIcon");
  if (!/^#[0-9a-f]{3,8}$/i.test(f.color || "")) warn(`${w}: color "${f.color}" is not a hex color`);
  if (!f.startDate || typeof f.startDate.year !== "number" || typeof f.startDate.mill !== "number") err(`${w}: startDate {year,mill} missing`);
  if (!nodes[f.startNode]) err(`${w}: startNode "${f.startNode}" missing`);
  checkOrigins(f, origins, nodes, flagsSet);
  // SPEC §19 taintMod
  if (f.taintMod === undefined) { if (!SAMPLE && TAINT_GUIDE[f.id]) warn(`${w}: no taintMod (SPEC §19; all gods ×1)`); }
  else if (!f.taintMod || typeof f.taintMod !== "object" || Array.isArray(f.taintMod)) err(`${w}.taintMod: must be {khorne,nurgle,tzeentch,slaanesh}`);
  else for (const k of Object.keys(f.taintMod)) {
    if (!TAINT_GODS.includes(k)) err(`${w}.taintMod: unknown god "${k}"`);
    else if (typeof f.taintMod[k] !== "number" || !(f.taintMod[k] >= 0) || f.taintMod[k] > 5) err(`${w}.taintMod.${k}: ${f.taintMod[k]} (need a number 0–5)`);
  }
  // SPEC §19 claim endings: <prefix>end_claim_<god> for all 4 gods (warn while the writer adds them)
  if (PREFIX[f.id]) for (const gd of TAINT_GODS) {
    const id = PREFIX[f.id] + "end_claim_" + gd, n = nodes[id];
    if (!n) { warn(`${w}: claim ending "${id}" missing (SPEC §19)`); continue; }
    if (!n.ending) err(`${f.id}/${id}: claim ending node has no ending`);
    else {
      if (n.ending.kind !== "bad" && !(f.id === "chaos" && n.ending.kind === "good")) warn(`${f.id}/${id}: claim ending kind "${n.ending.kind}" (SPEC §19: bad; chaos may be good)`);
      if (!n.ending.cause) warn(`${f.id}/${id}: claim ending without cause`);
    }
    // goto may land on a short pre-ending node (SPEC §19 chaos "chosen" branch): follow its choices one hop
    const gt = eventGotoTargets(f.id), viaPre = gt.some((t) => nodes[t] && (nodes[t].choices || []).some((c) => [c.next, c.roll && c.roll.success, c.roll && c.roll.fail].includes(id)));
    if (!gt.includes(id) && !viaPre) warn(`${f.id}/${id}: no claim-event goto leads here`);
  }
  for (const id of ids) {
    if (!nodes[id].ending) continue;
    const cg = claimGodOf(id);
    if (cg && PREFIX[f.id] && !id.startsWith(PREFIX[f.id] + "end_claim_")) warn(`${f.id}/${id}: looks like a claim ending but is not named ${PREFIX[f.id]}end_claim_<god>`);
  }
  for (const k of STATS) if (!f.startStats || typeof f.startStats[k] !== "number") warn(`${w}: startStats.${k} missing`);
  const chapterIds = Object.keys(f.chapters || {}).map(Number);
  if (!SAMPLE && (chapterIds.length < 6 || chapterIds.length > 8)) warn(`${w}: ${chapterIds.length} chapters (spec 6–8)`);
  for (const c of chapterIds) checkL(f.chapters[c], `${w}.chapters.${c}`);
  const pro = PREFIX[f.id] ? ids.filter((id) => id.startsWith(PREFIX[f.id] + "o_")).length : 0;   // SPEC §16 prologue nodes
  void pro;                                // SPEC §32.1 rule 14 (80–145 nodes per route, median run 45–70) is checked by storyGate() below
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
  const flowInfo = SL.mayFlags(f, WH), storyEnv = {flagsSet, nodes, may: new Set(), preds: null};   // SPEC §32.2 data-flow for "can never match" warnings
  const endings = {good: [], bad: [], death: []};
  const cons = {choices: 0, withResult: 0, eff: 0, effWithResult: 0, rolls: 0, rollsWithResult: 0, missing: []};
  const codexUnlockable = new Set();
  WH.events.forEach((e) => { if ((e.factions || ["*"]).some((x) => x === "*" || x === f.id)) { [].concat(e.codex || []).forEach((c) => codexUnlockable.add(c)); (e.choices || []).forEach((c) => [].concat(c.codex || []).forEach((x) => codexUnlockable.add(x))); } });
  for (const id of ids) {
    const n = nodes[id], nw = `${f.id}/${id}`;
    if (typeof n.chapter !== "number" && !(n.ending && n.ending.kind === "death") && !/_claim_/.test(nw)) warn(`${nw}: no chapter`);  // claim nodes fire in any chapter
    if (typeof n.chapter === "number" && f.chapters && !f.chapters[n.chapter]) err(`${nw}: chapter ${n.chapter} has no title`);
    scene(n.scene, nw);
    if (n.speaker) { sprite(n.speaker.sprite, nw + ".speaker"); checkL(n.speaker.name, nw + ".speaker.name"); }
    sprite(n.foe, nw + ".foe");
    checkL(n.text, nw + ".text", 90, 65);
    storyEnv.may = flowInfo.may[id]; storyEnv.preds = flowInfo.roots.has(id) ? null : flowInfo.preds[id];
    checkAlt(n, nw, storyEnv);                            // SPEC §32.2
    if (n.bridge !== undefined && n.bridge !== true) err(`${nw}.bridge: must be true`);
    if (n.jump !== undefined) checkL(n.jump, nw + ".jump", JUMP_ZH, JUMP_EN);
    checkEffects(n.effects, nw);
    codexRef(n.codex, nw);
    [].concat(n.codex || []).forEach((c) => codexUnlockable.add(c));
    if (n.time) {
      const h = WH.Rules.timeHours(n.time);
      if (!(h > 0)) warn(`${nw}: time ${JSON.stringify(n.time)} adds 0 hours`);
      for (const k of Object.keys(n.time)) if (!["h", "d", "w", "y", "warp"].includes(k)) warn(`${nw}: unknown time key "${k}"`);
    }
    if (n.eventRoll !== undefined && !(n.eventRoll > 0 && n.eventRoll <= 1)) err(`${nw}: eventRoll ${n.eventRoll} not in (0,1]`);
    if (n.gather !== undefined) { const gp = gatherProblems(n); gp.errs.forEach((m) => err(`${nw}: ${m}`)); gp.warns.forEach((m) => warn(`${nw}: ${m}`)); }   // SPEC §20c
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
      // SPEC §11 consequences
      const hasEff = !!(c.effects && Object.keys(c.effects).some((k) => (STATS.includes(k) && c.effects[k]) || k === "set" || k === "unset"));
      const hasRes = c.result !== undefined || c.rollResult !== undefined;
      cons.choices++; if (hasRes) cons.withResult++;
      if (hasEff) { cons.eff++; if (hasRes) cons.effWithResult++; else cons.missing.push(`${id}#${i + 1}`); }
      if (c.roll) { cons.rolls++; if (c.rollResult) cons.rollsWithResult++; }
      if (c.result !== undefined) checkL(c.result, cw + ".result", RESULT_ZH, RESULT_EN);
      if (c.rollResult !== undefined) {
        if (!c.roll) warn(`${cw}: rollResult on a choice without roll (use result)`);
        if (!c.rollResult || typeof c.rollResult !== "object") err(`${cw}.rollResult: expected {success:{zh,en}, fail:{zh,en}}`);
        else {
          for (const k of Object.keys(c.rollResult)) if (!["success", "fail"].includes(k)) warn(`${cw}.rollResult: unknown key "${k}"`);
          for (const k of ["success", "fail"]) {
            if (c.rollResult[k] === undefined) { if (c.result === undefined) warn(`${cw}.rollResult.${k} missing (no result fallback)`); }
            else checkL(c.rollResult[k], `${cw}.rollResult.${k}`, RESULT_ZH, RESULT_EN);
          }
        }
      }
      checkEffects(c.effects, cw);
      codexRef(c.codex, cw);
      checkRequire(c.require, cw, flagsSet);
      if (c.resultAlt !== undefined) {                    // SPEC §32.2: judged before the choice's effects, flags = arrival + this node's own effects
        const mayR = new Set(storyEnv.may); Object.keys((n.effects && n.effects.set) || {}).forEach((k) => n.effects.set[k] && mayR.add(k));
        checkResultAlt(c, cw, Object.assign({}, storyEnv, {may: mayR}));
      }
      if (c.goto !== undefined) warn(`${cw}: goto is only used on event choices (use next)`);
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

  // static reachability (from every origin's start node + the death nodes)
  const reachFrom = (starts) => {
    const r = new Set(), q = [];
    starts.forEach((x) => { if (nodes[x] && !r.has(x)) { r.add(x); q.push(x); } });
    while (q.length) {
      const n = nodes[q.shift()];
      if (!n) continue;
      for (const c of n.choices || []) for (const t of targetsOf(c)) if (t && nodes[t] && !r.has(t)) { r.add(t); q.push(t); }
    }
    return r;
  };
  const gotoT = eventGotoTargets(f.id).filter((x) => nodes[x]);       // SPEC §19: event gotos are entry points too
  const reach = reachFrom([f.startNode].concat(origins.map((o) => o.startNode), Object.values(f.deathNodes || {}), gotoT));
  // every origin's prologue must merge into the spine of the first (default) origin
  if (origins.length > 1) {
    const deathIds = new Set(Object.values(f.deathNodes || {}));
    const spine = reachFrom([origins[0].startNode]);
    for (const o of origins.slice(1)) {
      if (!nodes[o.startNode]) continue;
      const mine = reachFrom([o.startNode]);
      const merge = [...mine].filter((x) => spine.has(x) && !nodes[x].ending && !deathIds.has(x));
      if (!merge.length) err(`${w}.origin.${o.id}: prologue from "${o.startNode}" never merges into the spine of origin "${origins[0].id}"`);
      else {
        const prologue = [...mine].filter((x) => !spine.has(x));
        if (!SAMPLE && prologue.some((x) => !nodes[x].ending) && (prologue.filter((x) => !nodes[x].ending).length < 3 || prologue.filter((x) => !nodes[x].ending).length > 6))
          warn(`${w}.origin.${o.id}: prologue has ${prologue.filter((x) => !nodes[x].ending).length} own node(s) (spec 3–6)`);
      }
    }
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
  if (!SAMPLE && cons.eff && cons.effWithResult < cons.eff && NEW_ROUTES.includes(f.id))
    warn(`${w}: ${cons.eff - cons.effWithResult} effect/set choice(s) without result (SPEC §11): ${cons.missing.slice(0, 8).join(", ")}${cons.missing.length > 8 ? ", …" : ""}`);
  const grudge = checkGrudges(f);                      // SPEC §28
  return {endings, nodeCount: ids.length, chapters: chapterIds.length, cons, grudge, gather: gatherStatic(f)};
}

/* ---------- SPEC §28 grudges (人际后果) ----------
 * faction.npcs, choice.grudge, node.grudgeLine, flags wronged_<npc> / forgiven_<npc>. Coherence rules 1–5 + shape + lengths. */
const GRUDGE_NOTE_ZH = 30, GRUDGE_NOTE_EN = 20, GRUDGE_LINE_ZH = 60, GRUDGE_LINE_EN = 40;
const GRUDGE_P_MIN = -0.30, GRUDGE_EFF_MAX = 12, GRUDGE_TAINT_MAX = 10, GRUDGE_MAX_NPCS = 4, GRUDGE_MAX_PER_NPC = 3;
const lc = (s) => String(s || "").toLowerCase();
/* every name the player could read for this npc: [{zh,en}] (name + aka) */
function npcNames(def) {
  const out = [];
  if (def && def.name) out.push(def.name);
  if (def && Array.isArray(def.aka)) def.aka.forEach((a) => { if (a && typeof a === "object") out.push(a); });
  return out;
}
const mentions = (names, zh, en) => ({
  zh: names.some((n) => typeof n.zh === "string" && n.zh && String(zh || "").includes(n.zh)),
  en: names.some((n) => typeof n.en === "string" && n.en && lc(en).includes(lc(n.en)))});
function checkGrudges(f) {
  const w = `faction.${f.id}`, nodes = f.nodes || {}, ids = Object.keys(nodes);
  const info = {npcs: [], wronged: {}, grudgeChoices: 0, grudgeLines: 0, perNpc: {}, any: false};
  const hasNpcs = f.npcs !== undefined;
  let npcs = {};
  if (hasNpcs) {
    if (!f.npcs || typeof f.npcs !== "object" || Array.isArray(f.npcs)) err(`${w}.npcs: must be an object {npcId: {name:{zh,en}, aka?:[{zh,en}], sprite?}}`);
    else npcs = f.npcs;
  }
  for (const nid of Object.keys(npcs)) {
    const d = npcs[nid], nw = `${w}.npcs.${nid}`;
    if (!/^[a-z][a-z0-9_]*$/.test(nid)) err(`${nw}: npc id must be a short lowercase slug (a-z, 0-9, _)`);
    if (!d || typeof d !== "object" || Array.isArray(d)) { err(`${nw}: expected {name:{zh,en}, aka?, sprite?}`); continue; }
    for (const k of Object.keys(d)) if (!["name", "aka", "sprite"].includes(k)) warn(`${nw}: unknown key "${k}"`);
    checkL(d.name, nw + ".name", 14, 6);
    if (d.name && typeof d.name.zh === "string" && zhLen(d.name.zh) < 2) warn(`${nw}.name.zh "${d.name.zh}" is a single character — presence matching would be unreliable`);
    if (d.aka !== undefined) {
      if (!Array.isArray(d.aka)) err(`${nw}.aka: expected an array of {zh,en}`);
      else d.aka.forEach((a, i) => checkL(a, `${nw}.aka[${i}]`, 14, 6));
    }
    if (d.sprite !== undefined) sprite(d.sprite, nw + ".sprite");
    info.npcs.push(nid);
  }
  /* wronging choices: any choice whose effects.set sets wronged_<npc> */
  const wrongers = [];            // {node, i, npc}
  const grudges = [];             // {node, i, npc, g, c}
  const lines = [];               // {node, npc}
  const forgivers = new Set();
  for (const id of ids) {
    const n = nodes[id], nw = `${f.id}/${id}`;
    const setFlags = (e) => (e && e.set && typeof e.set === "object") ? Object.keys(e.set).filter((k) => e.set[k]) : [];
    for (const k of setFlags(n.effects)) {
      if (k.startsWith("wronged_")) warn(`${nw}: sets ${k} in node effects — SPEC §28 wronging belongs on the harming choice`);
      if (k.startsWith("forgiven_")) forgivers.add(k.slice(9));
    }
    (n.choices || []).forEach((c, i) => {
      for (const k of setFlags(c.effects)) {
        if (k.startsWith("wronged_")) wrongers.push({node: id, i, npc: k.slice(8)});
        if (k.startsWith("forgiven_")) forgivers.add(k.slice(9));
      }
      if (c.grudge !== undefined) grudges.push({node: id, i, npc: c.grudge && c.grudge.npc, g: c.grudge, c});
    });
    if (n.grudgeLine !== undefined) lines.push({node: id, npc: n.grudgeLine && n.grudgeLine.npc, gl: n.grudgeLine});
  }
  for (const e of WH.events) (e.choices || []).forEach((c, i) => { if (c.grudge !== undefined) warn(`event ${e.id}.choice${i + 1}: grudge is only used on node choices (ignored)`); });
  info.any = !!(wrongers.length || grudges.length || lines.length || Object.keys(npcs).length);
  if (!info.any) return info;

  // wronged npcs ↔ faction.npcs, bounds (rule 5)
  const wrongedBy = {};
  for (const x of wrongers) (wrongedBy[x.npc] = wrongedBy[x.npc] || []).push(x);
  info.wronged = wrongedBy;
  for (const npc of Object.keys(wrongedBy)) {
    if (!npcs[npc]) err(`${w}: flag wronged_${npc} is set (${wrongedBy[npc].map((x) => x.node).join(", ")}) but faction.npcs has no "${npc}"`);
    const nh = wrongedBy[npc].length;
    if (nh > GRUDGE_MAX_PER_NPC) warn(`${w}: ${nh} choices wrong "${npc}" (SPEC §28 content target 1–3)`);
  }
  if (Object.keys(wrongedBy).length > GRUDGE_MAX_NPCS) err(`${w}: ${Object.keys(wrongedBy).length} distinct wronged_ npcs (max ${GRUDGE_MAX_NPCS}, SPEC §28 rule 5)`);
  if (Object.keys(npcs).length && (Object.keys(npcs).length < 2 || Object.keys(npcs).length > 4)) note(`${w}: ${Object.keys(npcs).length} npc(s) (SPEC §28 content target 2–4)`);
  for (const f2 of forgivers) if (!npcs[f2]) warn(`${w}: flag forgiven_${f2} is set but faction.npcs has no "${f2}"`);

  /* graph reachability from a choice's targets (events and goto ignored — SPEC §28 rule 1) */
  const reachAfter = (nodeId, ci) => {
    const c = nodes[nodeId].choices[ci], r = new Set(), q = [];
    for (const t of targetsOf(c)) if (t && nodes[t] && !r.has(t)) { r.add(t); q.push(t); }
    while (q.length) for (const c2 of nodes[q.shift()].choices || []) for (const t of targetsOf(c2)) if (t && nodes[t] && !r.has(t)) { r.add(t); q.push(t); }
    return r;
  };
  const reachCache = new Map();
  const reachOf = (x) => { const k = x.node + "#" + x.i; if (!reachCache.has(k)) reachCache.set(k, reachAfter(x.node, x.i)); return reachCache.get(k); };
  const minChapter = (npc) => {
    const cs = (wrongedBy[npc] || []).map((x) => nodes[x.node].chapter).filter((c) => typeof c === "number");
    return cs.length ? Math.min(...cs) : null;
  };

  /* rule 1 + 4 for a node carrying a grudge choice or a grudgeLine */
  const place = (npc, nodeId, label) => {
    const where = `${f.id}/${nodeId}`;
    if (!npcs[npc]) return false;                          // reported by the caller
    const wr = wrongedBy[npc] || [];
    if (!wr.length) { err(`${label} on ${where}: no choice sets wronged_${npc} (SPEC §28 rule 1)`); return true; }
    if (!wr.some((x) => reachOf(x).has(nodeId))) err(`${label} on ${where}: no path from any wronged_${npc} choice (${wr.map((x) => x.node).join(", ")}) leads here (SPEC §28 rule 1)`);
    const nc = nodes[nodeId].chapter, mc = minChapter(npc);
    if (typeof nc === "number" && mc !== null) {
      if (nc < mc) err(`${label} on ${where}: chapter ${nc} is before the earliest harm to ${npc} (chapter ${mc}; SPEC §28 rule 4)`);
      else if (nc === mc) warn(`${label} on ${where}: same chapter (${nc}) as the earliest harm to ${npc} (SPEC §28 rule 4)`);
    }
    return true;
  };
  /* rule 2: the person is plainly there */
  const present = (npc, nodeId) => {
    const n = nodes[nodeId], def = npcs[npc] || {}, names = npcNames(def);
    const tx = n.text || {}, m = mentions(names, tx.zh, tx.en);
    if (m.zh && m.en) return "text";
    if (def.sprite && ((n.speaker && n.speaker.sprite === def.sprite) || n.foe === def.sprite)) return "sprite";
    if (n.speaker && n.speaker.name) { const ms = mentions(names, n.speaker.name.zh, n.speaker.name.en); if (ms.zh && ms.en) return "speaker"; }
    if (n.grudgeLine && n.grudgeLine.npc === npc && n.grudgeLine.text) return "grudgeLine";
    return null;
  };

  const perNpc = {};
  const bump = (npc, k) => { (perNpc[npc] = perNpc[npc] || {wrong: 0, grudge: 0, line: 0, presence: {}}); if (k) perNpc[npc][k]++; return perNpc[npc]; };
  for (const npc of Object.keys(wrongedBy)) bump(npc).wrong = wrongedBy[npc].length;

  for (const x of grudges) {
    const gw = `${f.id}/${x.node}.choice${x.i + 1}.grudge`, g = x.g;
    if (!g || typeof g !== "object" || Array.isArray(g)) { err(`${gw}: expected {npc, p?, effects?, note}`); continue; }
    info.grudgeChoices++;
    for (const k of Object.keys(g)) if (!["npc", "p", "effects", "note"].includes(k)) warn(`${gw}: unknown key "${k}"`);
    if (typeof g.npc !== "string" || !npcs[g.npc]) { err(`${gw}: npc "${g.npc}" is not in faction.npcs`); continue; }
    bump(g.npc, "grudge");
    // shape / bounds (rule 5)
    checkL(g.note, gw + ".note", GRUDGE_NOTE_ZH, GRUDGE_NOTE_EN);
    if (g.p !== undefined) {
      if (typeof g.p !== "number" || !isFinite(g.p)) err(`${gw}.p: not a number`);
      else {
        if (g.p < GRUDGE_P_MIN) err(`${gw}.p: ${g.p} < ${GRUDGE_P_MIN} (SPEC §28 rule 5)`);
        if (g.p > 0) err(`${gw}.p: ${g.p} > 0 — a grudge never helps`);
        if (!x.c.roll && g.p !== 0) warn(`${gw}.p: choice has no roll, p is ignored`);
      }
    }
    if (g.effects !== undefined) {
      const e = g.effects;
      if (!e || typeof e !== "object" || Array.isArray(e)) err(`${gw}.effects: expected {hp?, sanity?, corruption?, renown?, taint?}`);
      else for (const k of Object.keys(e)) {
        if (STATS.includes(k)) {
          const v = e[k];
          if (typeof v !== "number" || !isFinite(v)) { err(`${gw}.effects.${k}: not a number`); continue; }
          if (Math.abs(v) > GRUDGE_EFF_MAX) err(`${gw}.effects.${k}: |${v}| > ${GRUDGE_EFF_MAX} (SPEC §28 rule 5)`);
          if (k === "corruption" ? v < 0 : v > 0) err(`${gw}.effects.${k}: ${v} would help the player — grudge effects only hurt (hp/sanity/renown ≤ 0, corruption ≥ 0)`);
        } else if (k === "taint") {
          if (!e.taint || typeof e.taint !== "object" || Array.isArray(e.taint)) { err(`${gw}.effects.taint: expected {god:n}`); continue; }
          for (const gd of Object.keys(e.taint)) {
            const v = e.taint[gd];
            if (!TAINT_GODS.includes(gd) && gd !== "all") err(`${gw}.effects.taint.${gd}: unknown god`);
            else if (typeof v !== "number" || !isFinite(v)) err(`${gw}.effects.taint.${gd}: not a number`);
            else if (v < 0 || v > GRUDGE_TAINT_MAX) err(`${gw}.effects.taint.${gd}: ${v} (need 0–${GRUDGE_TAINT_MAX}, SPEC §28)`);
          }
        } else err(`${gw}.effects.${k}: only hp/sanity/corruption/renown/taint are allowed in a grudge`);
      }
    }
    if (g.p === undefined && g.effects === undefined) warn(`${gw}: no p and no effects — the grudge only shows its note`);
    place(g.npc, x.node, "grudge");
    // rule 2: presence
    const how = present(g.npc, x.node);
    if (!how) err(`grudge on ${f.id}/${x.node}: ${g.npc} is not present (name "${(npcs[g.npc].name && npcs[g.npc].name.zh) || g.npc}" missing from the zh+en node text, no speaker/foe sprite match, no grudgeLine) — SPEC §28 rule 2`);
    else { const p = bump(g.npc).presence; p[how] = (p[how] || 0) + 1; }
  }
  // per-npc grudge-choice cap (rule 5)
  for (const npc of Object.keys(perNpc)) if (perNpc[npc].grudge > GRUDGE_MAX_PER_NPC) err(`${w}: ${perNpc[npc].grudge} grudge choices for "${npc}" (max ${GRUDGE_MAX_PER_NPC}, SPEC §28 rule 5)`);

  // grudgeLine nodes
  for (const x of lines) {
    const lw = `${f.id}/${x.node}.grudgeLine`, gl = x.gl;
    if (!gl || typeof gl !== "object" || Array.isArray(gl)) { err(`${lw}: expected {npc, text:{zh,en}}`); continue; }
    info.grudgeLines++;
    for (const k of Object.keys(gl)) if (!["npc", "text"].includes(k)) warn(`${lw}: unknown key "${k}"`);
    checkL(gl.text, lw + ".text", GRUDGE_LINE_ZH, GRUDGE_LINE_EN);
    if (typeof gl.npc !== "string" || !npcs[gl.npc]) { err(`${lw}: npc "${gl.npc}" is not in faction.npcs`); continue; }
    bump(gl.npc, "line");
    if (nodes[x.node].ending) warn(`${lw}: grudgeLine on an ending node is not shown`);
    place(gl.npc, x.node, "grudgeLine");
    if (!grudges.some((g) => g.node === x.node && g.npc === gl.npc)) warn(`${lw}: node has no grudge choice for ${gl.npc} (the line alone changes nothing)`);
    if (gl.text) {                                                      // the line should show them, so it names them or is plainly about them
      const m = mentions(npcNames(npcs[gl.npc]), gl.text.zh, gl.text.en);
      if (!m.zh && !m.en && !(npcs[gl.npc].aka || []).length) note(`${lw}: line does not name ${gl.npc} (fine if it says "he/she")`);
    }
  }

  // rule 3: the harming choice names the person (WARN)
  for (const npc of Object.keys(wrongedBy)) {
    if (!npcs[npc]) continue;
    const names = npcNames(npcs[npc]);
    for (const x of wrongedBy[npc]) {
      const n = nodes[x.node], c = n.choices[x.i], rr = c.rollResult || {};
      const zh = [c.text, c.result, rr.success, rr.fail, n.text].map((t) => (t && t.zh) || "").join("\n");
      const en = [c.text, c.result, rr.success, rr.fail, n.text].map((t) => (t && t.en) || "").join("\n");
      const m = mentions(names, zh, en);
      if (!m.zh || !m.en) warn(`${f.id}/${x.node}.choice${x.i + 1}: sets wronged_${npc} but its text/result/node text does not name ${npc} in ${!m.zh && !m.en ? "zh or en" : (!m.zh ? "zh" : "en")} (SPEC §28 rule 3)`);
      if (c.result === undefined && c.rollResult === undefined) warn(`${f.id}/${x.node}.choice${x.i + 1}: wronging choice has no result text (SPEC §28: the harm must be explicit)`);
    }
  }
  // unused npcs
  for (const npc of Object.keys(npcs)) {
    const p = perNpc[npc] || {wrong: 0, grudge: 0};
    if (!p.wrong) warn(`${w}.npcs.${npc}: no choice wrongs this person (wronged_${npc} is never set)`);
    else if (!p.grudge && !(p.line)) warn(`${w}.npcs.${npc}: wronged but no grudge choice ever follows`);
  }
  info.perNpc = perNpc;
  return info;
}

/* static reachability from one origin's start node (+ death nodes + event gotos, which any origin can hit) */
function originReach(f, o) {
  const nodes = f.nodes || {}, r = new Set(), q = [];
  const push = (x) => { if (x && nodes[x] && !r.has(x)) { r.add(x); q.push(x); } };
  push((o && o.startNode) || f.startNode);
  Object.values(f.deathNodes || {}).forEach(push);
  eventGotoTargets(f.id).forEach(push);
  while (q.length) for (const c of nodes[q.shift()].choices || []) targetsOf(c).forEach(push);
  return r;
}

/* ---------- Monte-Carlo ---------- */
/* SPEC §28 baseline: the same faction without any grudge / grudgeLine (for the with/without comparison) */
function stripGrudges(f) {
  const nodes = {};
  for (const [id, n] of Object.entries(f.nodes || {})) {
    const m = Object.assign({}, n);
    delete m.grudgeLine;
    if (n.choices) m.choices = n.choices.map((c) => { if (c.grudge === undefined) return c; const d = Object.assign({}, c); delete d.grudge; return d; });
    nodes[id] = m;
  }
  return Object.assign({}, f, {nodes});
}
let SIM_RUNS = null;                       // --story-report: fewer runs
/* SPEC §20c: one synthetic past-life echo (dated before any route's start) so the simulation can measure the echo share */
const SIM_ECHO_POOL = [{runId: "sim_echo", endingId: null, echo: {faction: "__sim__", role: {zh: "工人", en: "worker"}, world: {zh: "某个世界", en: "some world"},
  cause: {zh: "战死", en: "died in battle"}, kind: "death", dateKey: 0, claimedBy: null}}];
function simulate(f, seed, data) {
  if (seed === undefined) seed = SEED;
  if (!data) data = WH;
  const origins = WH.Game.origins(f);
  const res = {runs: SIM_RUNS || RUNS, visits: [], endings: {}, kinds: {good: 0, bad: 0, death: 0}, deathCause: {}, loops: 0, crashes: 0,
               softlocks: new Map(), events: {}, eventsPerRun: [], years: [], visited: new Set(), firstCrash: null, maxRevisit: 0, maxRevisitNode: null,
               perOrigin: {}};
  origins.forEach((o) => { res.perOrigin[o.id] = {runs: 0, visits: [], kinds: {good: 0, bad: 0, death: 0}, endings: new Set(), gather: []}; });
  res.gatherPasses = []; res.echoRuns = 0; res.echoSim = !!(data.echoTemplates && data.echoTemplates.length);   // SPEC §20c: gather nodes passed per finished run; echo share with a synthetic pool
  res.taint = {khorne: [], nurgle: [], tzeentch: [], slaanesh: []}; res.claims = {}; res.cleanses = 0;
  res.rumors = []; res.rumorIds = {}; res.chrUnlocked = []; res.rumorScores = [];      // SPEC §20 / §20b
  res.grudge = {shown: [], taken: [], wronged: 0, active: 0, npcRuns: {}, npcTaken: {}, finished: 0};                // SPEC §28
  // SPEC §19 per-god run counts: claim fired ≥1 / fired twice / ended in that god's claim ending / resisted (flag) and not claimed
  res.claimRuns = {}, res.claimTwice = {}, res.claimEnd = {}, res.resisted = {}; res.anyClaimEnd = 0; res.anyClaimFired = 0;
  TAINT_GODS.forEach((gd) => { res.claimRuns[gd] = 0; res.claimTwice[gd] = 0; res.claimEnd[gd] = 0; res.resisted[gd] = 0; });
  for (let r = 0; r < (SIM_RUNS || RUNS); r++) {
    const rng = WH.RNG(seed * 100003 + r);
    const origin = origins[r % origins.length], po = res.perOrigin[origin.id];
    po.runs++;
    let g, steps = 0, evCount = 0, gShown = 0, gTaken = 0, gHere = 0;
    const fired = {};
    try {
      g = new WH.Game(f.id, {rng, data, echoPool: res.echoSim ? SIM_ECHO_POOL : []});
      let step = g.start(origin.id);
      const counts = {};
      while (!g.state.ended && steps < STEP_LIMIT) {
        steps++;
        res.visited.add(g.state.nodeId);
        if (step && step.kind === "event") {
          const e = step.event; evCount++;
          res.events[e.id] = (res.events[e.id] || 0) + 1;
          if (e.trigger === "claim") { res.claims[e.god] = (res.claims[e.god] || 0) + 1; fired[e.god] = (fired[e.god] || 0) + 1; }
          if (e.cleanse) res.cleanses++;
          const open = g.eventChoices().filter((v) => !v.locked);
          g.eventChoose(open[Math.floor(rng() * open.length)].index);
          step = g.eventContinue();
          continue;
        }
        counts[g.state.nodeId] = (counts[g.state.nodeId] || 0) + 1;
        if (WH.Rules.isGather(g.node())) gHere++;
        if (counts[g.state.nodeId] > res.maxRevisit) { res.maxRevisit = counts[g.state.nodeId]; res.maxRevisitNode = g.state.nodeId; }
        const cs = g.choices();
        const open = cs.map((c, i) => [c, i]).filter(([c]) => !c.locked);
        if (cs.some((c) => c.fallback)) res.softlocks.set(g.state.nodeId, (res.softlocks.get(g.state.nodeId) || 0) + 1);
        if (!open.length) { res.softlocks.set(g.state.nodeId, (res.softlocks.get(g.state.nodeId) || 0) + 1); break; }
        if (cs.some((c) => c.grudge && !c.locked)) gShown++;
        step = g.choose(open[Math.floor(rng() * open.length)][1]);
        if (step && step.grudge) { gTaken++; res.grudge.npcTaken[step.grudge.npc] = (res.grudge.npcTaken[step.grudge.npc] || 0) + 1; }
        if (step && step.death) res.deathCause[step.death] = (res.deathCause[step.death] || 0) + 1;
      }
      res.visited.add(g.state.nodeId);
      if (!g.state.ended) { res.loops++; continue; }
      const n = g.node();
      res.visits.push(g.state.visits);
      res.endings[g.state.nodeId] = (res.endings[g.state.nodeId] || 0) + 1;
      res.kinds[n.ending.kind] = (res.kinds[n.ending.kind] || 0) + 1;
      po.visits.push(g.state.visits); po.kinds[n.ending.kind]++; po.endings.add(g.state.nodeId);
      for (const gd of TAINT_GODS) res.taint[gd].push((g.state.taint && g.state.taint[gd]) || 0);
      const cg = claimGodOf(g.state.nodeId);
      if (cg) { res.claimEnd[cg]++; res.anyClaimEnd++; }
      if (Object.keys(fired).length) res.anyClaimFired++;
      for (const gd of TAINT_GODS) {
        if (fired[gd]) res.claimRuns[gd]++;
        if (fired[gd] > 1) res.claimTwice[gd]++;
        if (g.state.flags["resisted_" + gd] && cg !== gd) res.resisted[gd]++;
      }
      res.eventsPerRun.push(evCount);
      {
        const gr = res.grudge, wn = Object.keys(g.state.flags).filter((k) => k.startsWith("wronged_") && g.state.flags[k]).map((k) => k.slice(8));
        gr.finished++; gr.shown.push(gShown); gr.taken.push(gTaken);
        if (wn.length) gr.wronged++;
        if (gShown) gr.active++;
        wn.forEach((k) => { gr.npcRuns[k] = (gr.npcRuns[k] || 0) + 1; });
      }
      const sr = g.state.seenRumors || [];
      res.gatherPasses.push(gHere); po.gather.push(gHere);
      if (g.state.echoRun) res.echoRuns++;
      res.rumors.push(sr.length);
      sr.forEach((id) => { res.rumorIds[id] = (res.rumorIds[id] || 0) + 1; });
      (g.state.rumorLog || []).forEach((x) => res.rumorScores.push(x.score || 0));
      res.chrUnlocked.push(g.state.codex.filter((id) => isChr(WH.codex[id])).length);
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

/* ---------- SPEC §32.1 story-quality gates ----------
 * rules 1–4 + 14 per route: false choices, shallow branches, forced chapter steps, unjustified hard jumps, flags set and never read,
 * node count, median run length. Without --story-gate everything is a WARN (so a route mid-rewrite keeps the older gates green); with it the
 * spec's "error" limits (false choices > 10 %, forced chapter steps > 0, median run > 80) become errors. */
function storyLine(m, med) {
  return `story (§32): nodes ${m.nodes} · multi-choice ${m.multi} · false-choice ${m.falseChoice.length} (${m.falsePct.toFixed(0)}%) · shallow ${m.shallow.length}/${m.branching} (${m.shallowPct.toFixed(0)}%; INFO re-merge after ≤1 own node ${m.rejoin1.length}/${m.branching}, flag-echoed ${m.rejoin1Echoed.length}) · ` +
    `forced chapter steps ${m.forced.length} · hard jumps ${m.hard.length} (unjustified ${m.hardUnjustified.length}) · bridges ${m.bridges.length} · never-read flags ${m.neverRead.length} · ` +
    `alt ${m.altNodes} nodes/${m.altEntries} entries · resultAlt ${m.resultAlt} · gather ${m.gather.length}` + (med !== null && med !== undefined ? ` · median run ${med} nodes` : "");
}
function storyGate(rep) {
  const m = rep.story, id = rep.id;
  if (!m) return;
  const med = rep.sim && rep.sim.visits.length ? SL.median(rep.sim.visits) : null;
  rep.median = med;
  const emit = (asError, msg) => (STORY_GATE && asError ? err : warn)(`story ${id}: ${msg}`);
  const list = (a) => a.slice(0, 5).join(", ") + (a.length > 5 ? ", …" : "");
  if (m.falsePct > 10) emit(true, `${m.falseChoice.length}/${m.multi} multi-choice nodes (${m.falsePct.toFixed(0)}%) are false choices — all choices lead to the same node and set no distinct read flag (rule 1: error > 10 %): ${list(m.falseChoice)}`);
  else if (m.falsePct > 5) emit(false, `${m.falseChoice.length}/${m.multi} multi-choice nodes (${m.falsePct.toFixed(0)}%) are false choices (rule 1: warn > 5 %): ${list(m.falseChoice)}`);
  if (m.shallowPct > 20) emit(false, `${m.shallow.length}/${m.branching} branching nodes (${m.shallowPct.toFixed(0)}%) are shallow — siblings re-merge within ≤1 step AND no read flag tells the choices apart (rule 2: ≤ 20 %; INFO: ${m.rejoin1.length}/${m.branching} re-merge within ≤1 step, ${m.rejoin1Echoed.length} of them flag-echoed): ${list(m.shallow)}`);
  if (m.forced.length) emit(true, `${m.forced.length} forced chapter step(s) — one node, no real choice, jumps into a later chapter without a bridge (rule 3: 0): ${list(m.forced)}`);
  if (m.hardUnjustified.length > 3) emit(false, `${m.hardUnjustified.length} unjustified hard jumps (scene + big time / chapter change, no bridge or jump mark; rule 3: ≤ 3): ${list(m.hardUnjustified)}`);
  if (m.neverRead.length > 3) emit(false, `${m.neverRead.length} flags set and never read (rule 4: ≤ 3): ${list(m.neverRead)}`);
  if (m.nodes < 80 || m.nodes > 145) emit(false, `${m.nodes} nodes (rule 14: 80–145)`);
  if (med !== null) {
    if (med > 80) emit(true, `median run ${med} nodes (rule 14: error > 80)`);
    else if (med > 70 || med < 45) emit(false, `median run ${med} nodes (rule 14: 52–68 typical, warn > 70 or < 45)`);
  }
  if (m.eventRoll.dead.length) emit(false, `${m.eventRoll.dead.length} node(s) have eventRoll but no event can fire there (dead roll; rule 11): ${list(m.eventRoll.dead)}`);
}

/* node --gather-report [--faction f] [--runs N]: the per-route gather-node table (SPEC §20c), no other checks.
 * Columns: node id, chapter, scene, label, origins that can reach it (static); --runs N adds the random-play passes per origin. */
if (GATHER_REPORT) {
  const ids = Object.keys(WH.factions).filter((id) => !ONLY || id === ONLY);
  for (const fid of ids) {
    const f = WH.factions[fid], nodes = f.nodes || {}, gi = gatherStatic(f), origins = WH.Game.origins(f).map((o) => o.id);
    console.log(`\n== ${fid}: ${gi.ids.length} gather node(s) · chapters [${gi.chapters.join(",")}] · limits: ≥${GATHER_MIN_NODES} nodes, ≥${GATHER_MIN_CHAPTERS} chapters, every origin ≥${GATHER_ERR_PASSES} ==`);
    if (!gi.ids.length) { console.log("  no gather nodes yet — rumours cannot fire"); continue; }
    const rows = gi.ids.slice().sort((a, b) => (nodes[a].chapter || 0) - (nodes[b].chapter || 0) || a.localeCompare(b)).map((id) => {
      const n = nodes[id], pr = gatherProblems(n), reach = origins.filter((o) => gi.reach[o].includes(id));
      return [id, n.chapter === undefined ? "-" : n.chapter, n.scene || "-", `${n.gather.zh} / ${n.gather.en}`, reach.length === origins.length ? "all" : reach.join(","),
              pr.errs.length || pr.warns.length ? [...pr.errs.map((m) => "ERR " + m), ...pr.warns.map((m) => "warn " + m)].join("; ") : "ok"];
    });
    const head = ["node", "ch", "scene", "label", "reachable by", "check"], w = head.map((h, i) => Math.max(h.length, ...rows.map((r) => String(r[i]).length)));
    const fmt = (r) => r.map((c, i) => String(c)[i === 0 || i >= 2 ? "padEnd" : "padStart"](w[i])).join("  ");
    console.log(fmt(head)); console.log(w.map((x) => "-".repeat(x)).join("  "));
    rows.forEach((r) => console.log(fmt(r)));
    console.log(`reachable per origin: ${origins.map((o) => `${o} ${gi.reach[o].length}`).join(" · ")}` + (gi.adjacent.length ? ` · gather→gather hops: ${gi.adjacent.join(", ")}` : ""));
    if (argv.includes("--runs")) {
      const sm = simulate(f), po = Object.entries(sm.perOrigin);
      console.log(`random play (${RUNS} runs): passes/run avg ${avg(sm.gatherPasses).toFixed(2)} · ${po.map(([oid, o]) => `${oid} ${avg(o.gather).toFixed(2)}`).join(" · ")} · rumours heard/run ${avg(sm.rumors).toFixed(2)}`);
    }
  }
  process.exit(0);
}

/* node --story-report [--faction f] [--runs N]: the per-route table (SPEC §32.5), no other checks */
if (STORY_REPORT) {
  SIM_RUNS = argv.includes("--runs") ? RUNS : 400;
  const ids = Object.keys(WH.factions).filter((id) => !ONLY || id === ONLY), rows = [];
  const head = ["route", "nodes", "multi", "false%", "shallow%", "forced", "hard(unj)", "bridges", "neverRead", "alt", "resAlt", "gather", "median", "evDead"];
  for (const id of ids) {
    const m = SL.storyMetrics(WH, id);
    let med = "-";
    try { const s = simulate(WH.factions[id]); if (s.visits.length) med = String(SL.median(s.visits)); } catch (e) { med = "err"; }
    rows.push([id, m.nodes, m.multi, m.falsePct.toFixed(0) + "%", m.shallowPct.toFixed(0) + "%", m.forced.length, `${m.hard.length}(${m.hardUnjustified.length})`, m.bridges.length, m.neverRead.length,
      `${m.altNodes}/${m.altEntries}`, m.resultAlt, m.gather.length, med, m.eventRoll.dead.length]);
  }
  const w = head.map((h, i) => Math.max(h.length, ...rows.map((r) => String(r[i]).length)));
  const fmt = (r) => r.map((c, i) => String(c)[i === 0 ? "padEnd" : "padStart"](w[i])).join("  ");
  console.log(`story report (SPEC §32.1) — ${SIM_RUNS} random runs per route for the median; limits: false% warn>5 err>10 · shallow% (re-merge ≤1 step and no read flag distinguishes the choices) ≤20 · forced 0 · hard unjustified ≤3 · neverRead ≤3 · nodes 80–145 · median 45–70 (err>80)`);
  console.log(fmt(head)); console.log(w.map((x) => "-".repeat(x)).join("  "));
  rows.forEach((r) => console.log(fmt(r)));
  if (ONLY) {
    const m = SL.storyMetrics(WH, ONLY);
    const show = (t, a) => console.log(`${t} (${a.length}): ${a.slice(0, 40).join(", ")}${a.length > 40 ? ", …" : ""}`);
    show("false-choice nodes", m.falseChoice); show("shallow branches", m.shallow); show("INFO re-merge within ≤1 step but flag-echoed (not shallow)", m.rejoin1Echoed); show("forced chapter steps", m.forced); show("unjustified hard jumps", m.hardUnjustified);
    show("flags set and never read", m.neverRead); show("flags read only by achievements/rumours", m.readByOtherOnly); show("dead eventRoll nodes", m.eventRoll.dead);
  }
  process.exit(0);
}

/* ---------- run ---------- */
const factionIds = Object.keys(WH.factions).filter((id) => !ONLY || id === ONLY);
console.log(`\n== 什么是战锤 / What is Warhammer? — validator (${SAMPLE ? "SAMPLE data" : "real data"}) ==`);
console.log(`loaded: ${loaded.join(", ")}`);
console.log(`registry: ${factionIds.length} faction(s), ${Object.keys(WH.codex).length} codex, ${WH.events.length} events, ` +
  `${Object.keys(WH.sprites).length} sprites, ${Object.keys(WH.scenes).length} scenes, ${Object.keys(WH.ui).length} ui icons`);
if (!factionIds.length) err("no factions registered");
checkManifest();
checkEndingArt();
checkCodex();
const perGod = checkEvents();
checkRumors();
console.log(`events per god: ${JSON.stringify(perGod)}`);
if ((ctx.__loreEvents || []).length) console.log(`lore events (SPEC §20, data/events_lore.js): ${ctx.__loreEvents.length} — ${ctx.__loreEvents.join(", ")}`);
else if (!SAMPLE) note("lore events (SPEC §20): data/events_lore.js has none yet");
chronicleReport();
rumorReport();
rumorCoverage();
checkAchievements();
checkEchoes();
{
  const hidden = checkEgg();
  if (hidden.length) console.log(`hidden codex entries (SPEC §21, excluded from counts): ${hidden.join(", ")} · countable ${Object.keys(WH.codex).length - hidden.length}`);
}
{
  const pc = {};
  for (const id of Object.keys(WH.codex)) if (WH.codex[id].cat === "place") pc[WH.codex[id].faction || "any"] = (pc[WH.codex[id].faction || "any"] || 0) + 1;
  const cats = {};
  for (const id of Object.keys(WH.codex)) { const k = WH.codex[id].cat || (isChr(WH.codex[id]) ? "(chronicle)" : "(none)"); cats[k] = (cats[k] || 0) + 1; }
  console.log(`codex per category: ${JSON.stringify(cats)}`);
  console.log(`places per faction: ${JSON.stringify(pc)}`);
  if (ctx.__codexOwner) {
    const pf = {};
    for (const id of Object.keys(ctx.__codexOwner)) pf[ctx.__codexOwner[id]] = (pf[ctx.__codexOwner[id]] || 0) + 1;
    console.log(`codex per file: ${JSON.stringify(pf)}`);
  }
  codexTable();
}

const reports = [];
for (const id of factionIds) {
  const f = WH.factions[id];
  flushUnknownCodex();
  const before = errors.length;
  const st = checkFaction(f);
  flushUnknownCodex();
  const rep = {id, st, sim: null};
  if (!SAMPLE) { try { rep.story = SL.storyMetrics(WH, id); } catch (e) { warn(`story ${id}: metrics failed — ${e.message}`); } }
  if (errors.length === before || argv.includes("--force-sim")) {
    rep.sim = simulate(f);
    const s = rep.sim;
    if (s.crashes) err(`${id}: ${s.crashes} simulated runs crashed — ${s.firstCrash}`);
    if (s.loops) err(`${id}: ${s.loops} runs hit the ${STEP_LIMIT}-step limit (infinite loop?)`);
    for (const [n, c] of s.softlocks) err(`${id}/${n}: all choices locked in ${c} simulated visit(s) (softlock; engine opened the last choice)`);
    const never = Object.keys(f.nodes).filter((n) => !s.visited.has(n));
    if (never.length) warn(`${id}: ${never.length} node(s) never visited in ${RUNS} random runs: ${never.join(", ")}`);
    const a = avg(s.visits);
    void a;                                // the run-length target (SPEC §32.1 rule 14: median 45–70) is checked by storyGate()
    for (const k of ["good", "bad"]) if (s.visits.length && !s.kinds[k]) warn(`${id}: no "${k}" ending reached in ${RUNS} runs`);
  } else note(`${id}: Monte-Carlo skipped because of static errors (use --force-sim to run anyway)`);
  gatherVerdict(f, st.gather, rep.sim);                // SPEC §20c
  if (!SAMPLE) storyGate(rep);
  reports.push(rep);
}

flushUnknownCodex();
if (pending.size) warn(`art pending (SPEC §14 keys referenced but not in the manifest yet; UI shows placeholders): ${[...pending.keys()].join(", ")}`);
for (const r of reports) {
  const f = WH.factions[r.id];
  console.log(`\n--- ${r.id}: ${f.name && f.name.en} / ${f.name && f.name.zh} ---`);
  console.log(`nodes ${r.st.nodeCount} · chapters ${r.st.chapters} · endings good ${r.st.endings.good.length} / bad ${r.st.endings.bad.length} / death ${r.st.endings.death.length}`);
  const cn = r.st.cons;
  console.log(`consequences (SPEC §11): effect/set choices with result ${cn.effWithResult}/${cn.eff} (${pct(cn.effWithResult, cn.eff)}) · ` +
    `all choices ${cn.withResult}/${cn.choices} (${pct(cn.withResult, cn.choices)}) · rolls with rollResult ${cn.rollsWithResult}/${cn.rolls}`);
  if (r.story) console.log(storyLine(r.story, r.median));
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
    const fin = v.length;
    console.log(`hidden taint (avg final): ${TAINT_GODS.map((gd) => `${gd} ${avg(s.taint[gd]).toFixed(1)}`).join(" · ")} · ` +
      `≥50: ${TAINT_GODS.map((gd) => `${gd} ${pct(s.taint[gd].filter((x) => x >= 50).length, fin)}`).join(" ")}`);
    console.log(`claim events fired (all fires / runs): ${TAINT_GODS.map((gd) => `${gd} ${s.claims[gd] || 0}`).join(" · ")} · cleansing events fired ${s.cleanses}`);
    // SPEC §19 claims per god (% of finished runs)
    const tm = TAINT_GODS.map((gd) => `${gd} ×${(f.taintMod && typeof f.taintMod[gd] === "number") ? f.taintMod[gd] : 1}`).join(" ");
    const guide = TAINT_GUIDE[r.id];
    console.log(`claims (SPEC §19) · taintMod ${tm}${guide ? "  (guide " + TAINT_GODS.map((gd) => "×" + guide.mod[gd]).join(" ") + ")" : ""}`);
    console.log("  god        fired  2nd fire  claimed(end)  resisted  avg taint");
    for (const gd of TAINT_GODS) console.log(`  ${gd.padEnd(9)} ${pct(s.claimRuns[gd], fin).padStart(6)} ${pct(s.claimTwice[gd], fin).padStart(9)} ${pct(s.claimEnd[gd], fin).padStart(13)} ${pct(s.resisted[gd], fin).padStart(9)} ${avg(s.taint[gd]).toFixed(1).padStart(10)}`);
    const hasClaimEnds = Object.keys(f.nodes).some((id) => claimGodOf(id) && f.nodes[id].ending);
    console.log(`  total     ${pct(s.anyClaimFired, fin).padStart(6)} ${"".padStart(9)} ${pct(s.anyClaimEnd, fin).padStart(13)}`);
    if (guide) {
      const rate = 100 * (hasClaimEnds ? s.anyClaimEnd : s.anyClaimFired) / (fin || 1), [lo, hi] = guide.band;
      const ok = rate >= lo && rate <= hi;
      console.log(`  §19 target band ${lo}–${hi}% (claim ending, any god): ${rate.toFixed(1)}% ${ok ? "✓" : "✗"}${hasClaimEnds ? "" : "  (no claim endings yet — using claim-event rate)"}`);
      r.band = {rate, lo, hi, ok, proxy: !hasClaimEnds};
    }
    const evs = Object.entries(s.events);
    if (evs.length) console.log(`events fired: ${evs.map(([k, c]) => `${k}×${c}`).join(", ")}`);
    // SPEC §20c gathering places: passes per origin, rumours / echoes heard
    const gi = r.st.gather, hasGather = !!(gi && gi.ids.length);
    if (!hasGather) console.log("gather (SPEC §20c): no gather nodes yet — rumours and echoes cannot fire");
    else {
      const gp = s.gatherPasses, fin2 = gp.length || 1;
      console.log(`gather (SPEC §20c): ${gi.ids.length} nodes in chapters [${gi.chapters.join(",")}] · passes/run avg ${avg(gp).toFixed(2)} (min ${Math.min(...gp)} · max ${Math.max(...gp)}) · per origin ` +
        Object.entries(s.perOrigin).map(([oid, o]) => `${oid} ${avg(o.gather).toFixed(2)}`).join(" · ") + (gi.adjacent.length ? ` · gather→gather ${gi.adjacent.length}` : "") +
        (s.echoSim ? ` · echo heard in ${pct(s.echoRuns, fin2)} of runs (1 synthetic past life)` : " · echo share: no WH.echoTemplates loaded"));
      r.gatherAvg = avg(gp);
    }
    if ((WH.rumors || []).length && hasGather) {
      const elig = WH.rumors.filter((x) => (x.factions || []).some((y) => y === "*" || y === r.id));
      const never = elig.filter((x) => !s.rumorIds[x.id]).map((x) => x.id);
      const lore = (ctx.__loreEvents || []).filter((id) => s.events[id]);
      const strong = s.rumorScores.filter((x) => x >= 2).length, ra = avg(s.rumors);
      console.log(`rumours (SPEC §20c): avg ${ra.toFixed(2)} overheard/run (target ${GATHER_RUMOR_LO}–${GATHER_RUMOR_HI}; max ${Math.max(...s.rumors)}) · score ≥2 ${pct(strong, s.rumorScores.length)} · ${elig.length - never.length}/${elig.length} ever heard · ` +
        `chronicle entries unlocked/run avg ${avg(s.chrUnlocked).toFixed(2)}${(ctx.__loreEvents || []).length ? ` · lore events fired: ${lore.length}/${ctx.__loreEvents.length} ids` : ""}`);
      // a shared ("*") rumour that never fits this route is expected (relevance); only route-specific ones warn
      const byId = Object.fromEntries(WH.rumors.map((x) => [x.id, x]));
      const own = never.filter((id) => { const fs = byId[id].factions || []; return !fs.includes("*") && fs.length === 1; });
      const shared = never.filter((id) => !own.includes(id));
      if (own.length) warn(`${r.id}: ${own.length} route rumour(s) never heard in ${RUNS} runs: ${own.slice(0, 8).join(", ")}${own.length > 8 ? ", …" : ""}`);
      if (shared.length) note(`${r.id}: ${shared.length} shared rumour(s) never fit this route in ${RUNS} runs: ${shared.slice(0, 8).join(", ")}${shared.length > 8 ? ", …" : ""}`);
      r.rumorAvg = ra; r.rumorStrong = s.rumorScores.length ? 100 * strong / s.rumorScores.length : 0;
      if (!SAMPLE && (ra < GATHER_RUMOR_LO || ra > GATHER_RUMOR_HI)) warn(`${r.id}: ${ra.toFixed(2)} rumours overheard per run (SPEC §20c target ${GATHER_RUMOR_LO}–${GATHER_RUMOR_HI})`);
    }
    // SPEC §28 grudges: wronged npcs, grudge choices, activations per run, death / claim rate with vs without
    const gri = r.st.grudge;
    if (gri && gri.any) {
      const names = Object.keys(gri.perNpc), gr = s.grudge, nf = gr.finished || 1;
      const base = gri.grudgeChoices || gri.grudgeLines ? simulate(f, SEED, Object.assign({}, WH, {factions: Object.assign({}, WH.factions, {[f.id]: stripGrudges(f)})})) : null;
      const dWith = 100 * s.kinds.death / (v.length || 1), cWith = 100 * s.anyClaimEnd / (v.length || 1);
      console.log(`grudges (SPEC §28): npcs ${names.length ? names.map((n) => `${n} (wronged by ${gri.perNpc[n].wrong}, grudge choices ${gri.perNpc[n].grudge}${gri.perNpc[n].line ? ", lines " + gri.perNpc[n].line : ""})`).join(" · ") : "none"} · ` +
        `grudge choices ${gri.grudgeChoices}, presence lines ${gri.grudgeLines}`);
      console.log(`  per run: wronged someone ${pct(gr.wronged, nf)} · a grudge choice shown ${pct(gr.active, nf)} · shown/run ${avg(gr.shown).toFixed(2)} · taken/run ${avg(gr.taken).toFixed(2)}` +
        (Object.keys(gr.npcRuns).length ? ` · wronged: ${Object.entries(gr.npcRuns).map(([k, c]) => `${k} ${pct(c, nf)}`).join(" ")}` : ""));
      if (base && base.visits.length) {
        const dBase = 100 * base.kinds.death / base.visits.length, cBase = 100 * base.anyClaimEnd / base.visits.length, dd = dWith - dBase;
        console.log(`  death rate with grudges ${dWith.toFixed(1)}% · without ${dBase.toFixed(1)}% (${dd >= 0 ? "+" : ""}${dd.toFixed(1)} pts; SPEC §28 target ≤ +3) · claim endings ${cWith.toFixed(1)}% vs ${cBase.toFixed(1)}%`);
        if (dd > 3) warn(`${r.id}: grudges raise the random-play death rate by ${dd.toFixed(1)} pts (SPEC §28 balance: ≤ 3)`);
        if (Math.abs(cWith - cBase) > 1.5) warn(`${r.id}: grudges move the claim-ending rate ${cBase.toFixed(1)}% → ${cWith.toFixed(1)}% (SPEC §28: claim bands unchanged)`);
        r.grudgeDeath = {with: dWith, without: dBase};
      }
      if (gri.grudgeChoices && !gr.active) warn(`${r.id}: grudge choices exist but none was ever shown in ${RUNS} random runs`);
      else if (gri.grudgeChoices && gr.wronged && gr.taken.reduce((a, b) => a + b, 0) === 0) warn(`${r.id}: a grudge was shown but never chosen in ${RUNS} random runs`);
    }
    console.log(`max visits of one node in a run: ${s.maxRevisit} (${s.maxRevisitNode})`);
    const po = Object.entries(s.perOrigin);
    if (po.length > 1 || (f.origins && f.origins.length)) {
      // SPEC §23: per-origin death rate vs route average (flag > ±6 pts) + every origin reaches all route endings
      const routeDeath = 100 * s.kinds.death / (v.length || 1), allEnds = Object.keys(s.endings).filter((e) => s.endings[e] / (v.length || 1) >= 0.005);   // ignore ≤0.5% flukes
      console.log(`per origin (SPEC §23 caps · death vs route avg ${routeDeath.toFixed(1)}%):`);
      for (const [oid, o] of po) {
        const n = o.visits.length, d = 100 * o.kinds.death / (n || 1), diff = d - routeDeath;
        const og = WH.Game.findOrigin(f, oid), caps = WH.Rules.capsOf ? WH.Rules.capsOf(og) : {hp: 100, sanity: 100};
        const bud = og && og.__budget !== undefined ? ` · budget ${og.__budget >= 0 ? "+" : ""}${og.__budget}` : "";
        const flag = Math.abs(diff) > 6 ? "  ✗" : "";
        console.log(`  ${oid.padEnd(12)} max ${caps.hp}/${caps.sanity}${bud} · runs ${String(o.runs).padStart(5)} · avg nodes ${avg(o.visits).toFixed(1).padStart(5)} · good ${pct(o.kinds.good, n).padStart(6)} · bad ${pct(o.kinds.bad, n).padStart(6)} · death ${pct(o.kinds.death, n).padStart(6)} (${diff >= 0 ? "+" : ""}${diff.toFixed(1)})${flag}`);
        if (!SAMPLE && po.length > 1 && Math.abs(diff) > 6) warn(`${r.id}.origin.${oid}: death rate ${d.toFixed(1)}% vs route ${routeDeath.toFixed(1)}% (${diff >= 0 ? "+" : ""}${diff.toFixed(1)} pts; SPEC §23 ±6)`);
        const canReach = originReach(f, og);              // only endings this origin can statically reach (not another origin's prologue)
        const miss = allEnds.filter((e) => !o.endings.has(e) && !claimGodOf(e) && canReach.has(e));
        if (!SAMPLE && po.length > 1 && miss.length) warn(`${r.id}.origin.${oid}: never reached ${miss.length} route ending(s) in ${o.runs} runs: ${miss.slice(0, 6).join(", ")}${miss.length > 6 ? ", …" : ""}`);
      }
    }
  }
}

{
  const gr = reports.filter((r) => r.st && r.st.grudge && (r.st.grudge.grudgeChoices || r.st.grudge.grudgeLines));
  console.log(`\n§28 grudges: ${gr.length ? gr.map((r) => `${r.id} ${r.st.grudge.grudgeChoices} choice(s)/${r.st.grudge.grudgeLines} line(s)${r.grudgeDeath ? ` death ${r.grudgeDeath.with.toFixed(1)}% (was ${r.grudgeDeath.without.toFixed(1)}%)` : ""}`).join(" · ") : "no route has grudges yet"}`);
}
if (reports.some((r) => r.rumorAvg !== undefined)) console.log(`\n§20c rumours overheard per run (target ${GATHER_RUMOR_LO}–${GATHER_RUMOR_HI}) · share with score ≥2: ${reports.filter((r) => r.rumorAvg !== undefined).map((r) => `${r.id} ${r.rumorAvg.toFixed(2)} (${r.rumorStrong.toFixed(0)}%)`).join(" · ")}`);
/* ---------- SPEC §30 rewind determinism self-test (engine only; the simulation above never enables rewind) ---------- */
function rewindSelfTest(f, seed, nRuns) {
  const out = {runs: 0, rewinds: 0, replays: 0, mismatches: [], eventsSeen: 0, rolls: 0};
  const strip = (st) => { const c = JSON.parse(JSON.stringify(st)); delete c.playMs; delete c.codex; return JSON.stringify(c); };
  const origins = WH.Game.origins(f);
  for (let r = 0; r < nRuns; r++) {
    const drv = WH.RNG(seed * 7919 + r * 31 + 5);                   // driver stream: independent of the game's own RNG
    const g = new WH.Game(f.id, {rng: WH.RNG(seed * 104729 + r), data: WH, rewind: true});
    let step = g.start(origins[r % origins.length].id), n = 0;
    out.runs++;
    while (!g.state.ended && n < 400) {
      n++;
      if (step && step.kind === "event") {
        const open = g.eventChoices().filter((v) => !v.locked);
        g.eventChoose(open[Math.floor(drv() * open.length)].index);
        step = g.eventContinue();
        continue;
      }
      const cs = g.choices(), open = cs.map((c, i) => [c, i]).filter(([c]) => !c.locked);
      if (!open.length) break;
      const a = open[Math.floor(drv() * open.length)][1];
      if (!g.state.deathPending && drv() < 0.12) {
        const pre = strip(g.state), preRng = [g.rng.getState(), g.rumorRng && g.rumorRng.getState(), g.echoRng && g.echoRng.getState()];
        const wasRoll = !!cs[a].roll;
        const s1 = g.choose(a);
        const post1 = strip(g.state), rng1 = [g.rng.getState(), g.rumorRng && g.rumorRng.getState(), g.echoRng && g.echoRng.getState()];
        if (!g.canRewind() || !g.rewind()) { out.mismatches.push(`${g.state.nodeId}: rewind refused`); break; }
        out.rewinds++;
        if (strip(g.state) !== pre) out.mismatches.push(`${g.state.nodeId}: state after rewind differs from before the choice`);
        if (JSON.stringify([g.rng.getState(), g.rumorRng && g.rumorRng.getState(), g.echoRng && g.echoRng.getState()]) !== JSON.stringify(preRng)) out.mismatches.push(`${g.state.nodeId}: RNG state after rewind differs`);
        const cs2 = g.choices();
        if (JSON.stringify(cs2.map((c) => [c.locked, c.roll && c.roll.pEff])) !== JSON.stringify(cs.map((c) => [c.locked, c.roll && c.roll.pEff]))) out.mismatches.push(`${g.state.nodeId}: choices differ after rewind`);
        // same choice again must give the same step, state and RNG; otherwise another choice must work
        if (drv() < 0.6 || open.length < 2) {
          const s2 = g.choose(a);
          out.replays++;
          if (wasRoll) out.rolls++;
          if (strip(g.state) !== post1) out.mismatches.push(`${g.state.nodeId}: replay of choice ${a} gives a different state`);
          if (JSON.stringify([g.rng.getState(), g.rumorRng && g.rumorRng.getState(), g.echoRng && g.echoRng.getState()]) !== JSON.stringify(rng1)) out.mismatches.push(`${g.state.nodeId}: replay of choice ${a} gives a different RNG state`);
          if (JSON.stringify(s1 && [s1.kind, s1.roll && s1.roll.success, s1.death, !!s1.event]) !== JSON.stringify(s2 && [s2.kind, s2.roll && s2.roll.success, s2.death, !!s2.event])) out.mismatches.push(`${g.state.nodeId}: replay of choice ${a} gives a different step`);
          step = s2;
        } else {
          const b = open.filter(([, i]) => i !== a)[Math.floor(drv() * (open.length - 1))][1];
          step = g.choose(b);
        }
        if (step && step.kind === "event") out.eventsSeen++;
        if (out.mismatches.length > 5) return out;
        continue;
      }
      step = g.choose(a);
    }
    if (g.rewindStack.length > 30) out.mismatches.push("stack deeper than 30");
  }
  return out;
}
{
  const rows = [];
  for (const fid of factionIds) {
    const rp = reports.find((r) => r.id === fid);
    if (rp && !rp.sim && !argv.includes("--force-sim")) { rows.push(`${fid} skipped (static errors)`); continue; }   // a route mid-rewrite must not crash the run
    let res;
    try { res = rewindSelfTest(WH.factions[fid], SEED, SAMPLE ? 40 : 60); } catch (e) { err(`rewind (SPEC §30) ${fid}: self-test threw — ${e.message}`); rows.push(`${fid} threw`); continue; }
    rows.push(`${fid} ${res.rewinds} rewinds / ${res.replays} replays (${res.rolls} rolls)`);
    res.mismatches.forEach((m) => err(`rewind (SPEC §30) ${fid}: ${m}`));
  }
  console.log(`\n§30 rewind determinism (engine, random play with random rewind + same/other choice): ${rows.join(" · ")}`);
}
/* ---------- SPEC §24 difficulty levels ---------- */
if (WH.difficulty && !WRITE_DIFF) {
  const d = WH.difficulty;
  for (const k of Object.keys(d)) {
    const [fid, oid] = k.split("/");
    if (![1, 2, 3].includes(d[k])) err(`difficulty.${k}: ${d[k]} (need 1|2|3)`);
    if (!WH.factions[fid]) warn(`difficulty: "${k}" — faction ${fid} not loaded`);
    else if (oid && !WH.Game.origins(WH.factions[fid]).some((o) => o.id === oid)) warn(`difficulty: "${k}" — no origin ${oid}`);
  }
  for (const fid of factionIds) {
    if (d[fid] === undefined) warn(`difficulty: no level for ${fid} (run --write-difficulty)`);
    for (const o of WH.Game.origins(WH.factions[fid])) if (WH.Game.origins(WH.factions[fid]).length > 1 && d[fid + "/" + o.id] === undefined) warn(`difficulty: no level for ${fid}/${o.id}`);
  }
  console.log(`\ndifficulty (SPEC §24, data/difficulty.js): ${Object.entries(d).filter(([k]) => !k.includes("/")).map(([k, v]) => `${k} ${v}`).join(" · ")}`);
} else if (!WRITE_DIFF && !SAMPLE) note("difficulty (SPEC §24): data/difficulty.js missing — no skulls shown (run --write-difficulty)");
if (WRITE_DIFF && !SAMPLE && !errors.length) {
  const out = {}, lines = [];
  for (const fid of factionIds) {
    const f = WH.factions[fid], agg = {n: 0, death: 0, claim: 0}, po = {};
    for (const sd of DIFF_SEEDS) {
      const s = simulate(f, sd);
      agg.n += s.visits.length; agg.death += s.kinds.death; agg.claim += s.anyClaimEnd;
      for (const [oid, o] of Object.entries(s.perOrigin)) { po[oid] = po[oid] || {n: 0, death: 0}; po[oid].n += o.visits.length; po[oid].death += o.kinds.death; }
    }
    const dp = 100 * agg.death / (agg.n || 1);
    out[fid] = diffLevel(dp);
    lines.push(`  ${fid.padEnd(9)} death ${dp.toFixed(1)}% · claim ${(100 * agg.claim / (agg.n || 1)).toFixed(1)}% → ${out[fid]}`);
    if (Object.keys(po).length > 1) for (const [oid, o] of Object.entries(po)) {
      const op = 100 * o.death / (o.n || 1);
      out[fid + "/" + oid] = diffLevel(op);
      lines.push(`    ${(fid + "/" + oid).padEnd(20)} death ${op.toFixed(1)}% → ${out[fid + "/" + oid]}`);
    }
  }
  const body = "/* data/difficulty.js — GENERATED by `node tools/dev/validate.js --write-difficulty` (SPEC §24). Do not edit by hand.\n" +
    ` * Random-play death rate, seeds ${DIFF_SEEDS.join("/")} × ${RUNS} runs per faction (origins alternate): <24% → 1 · 24–29% → 2 · ≥29% → 3.\n */\n` +
    "WH.difficulty = {\n" + Object.entries(out).map(([k, v]) => `  ${/^[a-z_]+$/.test(k) ? k : JSON.stringify(k)}: ${v}`).join(",\n") + "\n};\n";
  fs.writeFileSync(path.join(ROOT, "data", "difficulty.js"), body);
  console.log(`\nwrote data/difficulty.js (SPEC §24):\n${lines.join("\n")}`);
} else if (WRITE_DIFF) note("--write-difficulty skipped (sample data or errors)");
{
  const banded = reports.filter((r) => r.band);
  if (banded.length) console.log(`\n§19 claim-rate bands: ${banded.map((r) => `${r.id} ${r.band.rate.toFixed(1)}% (${r.band.lo}–${r.band.hi}) ${r.band.ok ? "✓" : "✗"}${r.band.proxy ? "*" : ""}`).join(" · ")}` +
    (banded.some((r) => r.band.proxy) ? "   * = no claim endings yet, claim-event rate shown" : ""));
}
console.log("");
if (!QUIET || errors.length) notes.forEach((n) => console.log("NOTE    " + n));
const WARN_SHOW = QUIET ? 0 : 200;
warnings.slice(0, WARN_SHOW).forEach((w) => console.log("WARN    " + w));
if (warnings.length > WARN_SHOW) console.log(`WARN    … ${warnings.length - WARN_SHOW} more`);
errors.forEach((e) => console.log("ERROR   " + e));
console.log(`\n${errors.length ? "FAIL" : "PASS"} — ${errors.length} error(s), ${warnings.length} warning(s)\n`);
process.exit(errors.length ? 1 : 0);
