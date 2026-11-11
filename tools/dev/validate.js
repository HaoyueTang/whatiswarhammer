#!/usr/bin/env node
/* validate.js — data + link checker and Monte-Carlo playthrough simulator (SPEC §10). Owned by: web.
 *
 *   node tools/dev/validate.js              validate real data (data/**, assets/manifest.js)
 *   node tools/dev/validate.js --sample     validate tools/dev/sample_data.js instead of data/
 *   options: --runs N (default 3000)  --seed S (default 1)  --faction id  --quiet (errors/warnings summary only)
 *   SPEC §20: also checks data/chronicle.js (timeline codex entries), data/rumors.js and data/events_lore.js, and
 *   reports rumours per route, chronicle entries per millennium and avg rumours overheard per simulated run.
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
/* SPEC §14 (v0.2) keys — referenced data is accepted before the art lands (warning "art pending", UI shows a placeholder) */
const SPEC2_SPRITES = ("player_aeldari player_necrons aeldari_guardian aeldari_seer aeldari_ranger aeldari_bonesinger aeldari_masked " +
  "drukhari_raider wraith_construct greater_daemon_slaanesh necron_warrior necron_lord cryptek flayed_one canoptek_scarab canoptek_spyder " +
  "dig_leader explorator omen_farseer omen_ynnead omen_khaine omen_silent_king omen_ctan omen_stormlord omen_collector").split(" ");
const SPEC2_SCENES = "craftworld webway maiden_world dig_site tomb_exterior tomb_interior stasis_gallery".split(" ");
const SPEC2_UI = ["icon_fate", "icon_worth"];
const RACES = ["imperium", "chaos", "tau", "aeldari", "necrons", "orks", "tyranids", "other"];
const TYPES = ["figure", "deity", "organization", "unit", "place", "concept"];
const CODEX_FILES = ["data/codex.js", "data/codex_aeldari.js", "data/codex_necrons.js", "data/chronicle.js", "data/easter_tzeentch.js"];
const EVENT_FILES = ["data/events.js", "data/events_taint.js", "data/events_lore.js", "data/rumors.js"];   // SPEC §18/§20 load order
const RUMOR_ZH = 50, RUMOR_EN = 35;     // SPEC §20 rumour text limits (warn)
const MAX_CHAPTER = 8;
const FACTION_FILES = ["imperium", "chaos", "tau", "aeldari", "necrons"];
const GODS = ["khorne", "nurgle", "tzeentch", "slaanesh", "undivided", "other"];
const TAINT_GODS = ["khorne", "nurgle", "tzeentch", "slaanesh"];   // SPEC §18
const CODEX_CATS = ["leader", "enemy", "boss", "god", "lore", "place"];
const CODEX_FACTIONS = ["imperium", "chaos", "tau", "aeldari", "necrons", "xenos", "any"];
const STATS = ["hp", "sanity", "corruption", "renown"];
const PREFIX = {imperium: "imp_", chaos: "cha_", tau: "tau_", aeldari: "eld_", necrons: "nec_"};
const RESULT_ZH = 50, RESULT_EN = 35;   // SPEC §11 consequence text limits (warn)
/* SPEC §19 lore table: per-route taintMod guide + target claim rate (random play, any god, % of runs ending in a claim ending) */
const TAINT_GUIDE = {
  imperium: {mod: {khorne: 0.9, nurgle: 0.9, tzeentch: 0.9, slaanesh: 0.9}, band: [12, 18]},
  chaos:    {mod: {khorne: 1.3, nurgle: 1.3, tzeentch: 1.3, slaanesh: 1.3}, band: [20, 30]},
  tau:      {mod: {khorne: 0.7, nurgle: 0.7, tzeentch: 0.7, slaanesh: 0.7}, band: [6, 12]},
  aeldari:  {mod: {khorne: 0.9, nurgle: 0.9, tzeentch: 0.9, slaanesh: 1.3}, band: [12, 18]},
  necrons:  {mod: {khorne: 0.5, nurgle: 0.5, tzeentch: 0.5, slaanesh: 0.5}, band: [3, 8]}
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
      if (!fs.existsSync(path.join(ROOT, a.src))) warn(`manifest ${g}.${k}: file not found ${a.src}`);
      if (!a.w || !a.h) warn(`manifest ${g}.${k}: missing w/h`);
    }
  }
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
    for (const k of Object.keys(r)) if (!["id", "factions", "minChapter", "maxChapter", "speaker", "text", "codex"].includes(k)) warn(`${w}: unknown key "${k}"`);
  });
}
function rumorReport() {
  const list = WH.rumors || [];
  if (!list.length) return;
  const shared = list.filter((r) => (r.factions || []).includes("*")).length;
  const parts = Object.keys(WH.factions).filter((id) => !ONLY || id === ONLY).map((fid) => {
    const own = list.filter((r) => (r.factions || []).includes(fid)).length;
    const chs = Object.keys(WH.factions[fid].chapters || {}).map(Number).sort((a, b) => a - b);
    const per = chs.map((ch) => list.filter((r) => WH.Rules.rumorEligible(r, fid, ch)).length);
    const gaps = chs.filter((ch, i) => !per[i]);
    if (!SAMPLE && own && (own < 8 || own > 12)) warn(`rumours: ${fid} has ${own} route rumours (SPEC §20: 8–12)`);
    if (gaps.length && !SAMPLE) note(`rumours: ${fid} chapter(s) ${gaps.join(",")} have no eligible rumour`);
    return `${fid} ${own}+${shared} (ch ${per.join("/")})`;
  });
  if (!SAMPLE && (shared < 10 || shared > 20)) warn(`rumours: ${shared} shared ("*") rumours (SPEC §20: ~15)`);
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
    const applies = Object.keys(WH.factions).filter((fid) => (e.factions || ["*"]).some((x) => x === "*" || x === fid));
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
  const lo = ["aeldari", "necrons"].includes(f.id) ? 75 : 70, hi = ["aeldari", "necrons"].includes(f.id) ? 90 : 95;
  if (!SAMPLE && (ids.length - pro < lo || ids.length - pro > hi)) warn(`${w}: ${ids.length - pro} spine nodes + ${pro} prologue (spec ${lo}–${hi} + prologues)`);
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
  if (!SAMPLE && cons.eff && cons.effWithResult < cons.eff && ["aeldari", "necrons"].includes(f.id))
    warn(`${w}: ${cons.eff - cons.effWithResult} effect/set choice(s) without result (SPEC §11): ${cons.missing.slice(0, 8).join(", ")}${cons.missing.length > 8 ? ", …" : ""}`);
  return {endings, nodeCount: ids.length, chapters: chapterIds.length, cons};
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
function simulate(f) {
  const origins = WH.Game.origins(f);
  const res = {runs: RUNS, visits: [], endings: {}, kinds: {good: 0, bad: 0, death: 0}, deathCause: {}, loops: 0, crashes: 0,
               softlocks: new Map(), events: {}, eventsPerRun: [], years: [], visited: new Set(), firstCrash: null, maxRevisit: 0, maxRevisitNode: null,
               perOrigin: {}};
  origins.forEach((o) => { res.perOrigin[o.id] = {runs: 0, visits: [], kinds: {good: 0, bad: 0, death: 0}, endings: new Set()}; });
  res.taint = {khorne: [], nurgle: [], tzeentch: [], slaanesh: []}; res.claims = {}; res.cleanses = 0;
  res.rumors = []; res.rumorIds = {}; res.chrUnlocked = [];      // SPEC §20
  // SPEC §19 per-god run counts: claim fired ≥1 / fired twice / ended in that god's claim ending / resisted (flag) and not claimed
  res.claimRuns = {}, res.claimTwice = {}, res.claimEnd = {}, res.resisted = {}; res.anyClaimEnd = 0; res.anyClaimFired = 0;
  TAINT_GODS.forEach((gd) => { res.claimRuns[gd] = 0; res.claimTwice[gd] = 0; res.claimEnd[gd] = 0; res.resisted[gd] = 0; });
  for (let r = 0; r < RUNS; r++) {
    const rng = WH.RNG(SEED * 100003 + r);
    const origin = origins[r % origins.length], po = res.perOrigin[origin.id];
    po.runs++;
    let g, steps = 0, evCount = 0;
    const fired = {};
    try {
      g = new WH.Game(f.id, {rng, data: WH});
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
      const sr = g.state.seenRumors || [];
      res.rumors.push(sr.length);
      sr.forEach((id) => { res.rumorIds[id] = (res.rumorIds[id] || 0) + 1; });
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
checkRumors();
console.log(`events per god: ${JSON.stringify(perGod)}`);
if ((ctx.__loreEvents || []).length) console.log(`lore events (SPEC §20, data/events_lore.js): ${ctx.__loreEvents.length} — ${ctx.__loreEvents.join(", ")}`);
else if (!SAMPLE) note("lore events (SPEC §20): data/events_lore.js has none yet");
chronicleReport();
rumorReport();
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
if (pending.size) warn(`art pending (SPEC §14 keys referenced but not in the manifest yet; UI shows placeholders): ${[...pending.keys()].join(", ")}`);
for (const r of reports) {
  const f = WH.factions[r.id];
  console.log(`\n--- ${r.id}: ${f.name && f.name.en} / ${f.name && f.name.zh} ---`);
  console.log(`nodes ${r.st.nodeCount} · chapters ${r.st.chapters} · endings good ${r.st.endings.good.length} / bad ${r.st.endings.bad.length} / death ${r.st.endings.death.length}`);
  const cn = r.st.cons;
  console.log(`consequences (SPEC §11): effect/set choices with result ${cn.effWithResult}/${cn.eff} (${pct(cn.effWithResult, cn.eff)}) · ` +
    `all choices ${cn.withResult}/${cn.choices} (${pct(cn.withResult, cn.choices)}) · rolls with rollResult ${cn.rollsWithResult}/${cn.rolls}`);
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
    if ((WH.rumors || []).length) {
      const elig = WH.rumors.filter((x) => (x.factions || []).some((y) => y === "*" || y === r.id));
      const never = elig.filter((x) => !s.rumorIds[x.id]).map((x) => x.id);
      const lore = (ctx.__loreEvents || []).filter((id) => s.events[id]);
      console.log(`rumours (SPEC §20): avg ${avg(s.rumors).toFixed(2)} overheard/run (max ${Math.max(...s.rumors)}) · ${elig.length - never.length}/${elig.length} ever heard · ` +
        `chronicle entries unlocked/run avg ${avg(s.chrUnlocked).toFixed(2)}${(ctx.__loreEvents || []).length ? ` · lore events fired: ${lore.length}/${ctx.__loreEvents.length} ids` : ""}`);
      if (never.length) warn(`${r.id}: ${never.length} eligible rumour(s) never heard in ${RUNS} runs: ${never.slice(0, 8).join(", ")}${never.length > 8 ? ", …" : ""}`);
      r.rumorAvg = avg(s.rumors);
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

if (reports.some((r) => r.rumorAvg !== undefined)) console.log(`\n§20 rumours overheard per run: ${reports.filter((r) => r.rumorAvg !== undefined).map((r) => `${r.id} ${r.rumorAvg.toFixed(2)}`).join(" · ")}`);
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
