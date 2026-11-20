#!/usr/bin/env node
/* intro_audit.js — "a new character must be introduced" (SPEC §37.9). Owned by: web.
 *
 *   node tools/dev/intro_audit.js                    summary per route (+ the universal route)
 *   node tools/dev/intro_audit.js --route imperium   list every gap of one route   (--route arcosa = the universal route)
 *   node tools/dev/intro_audit.js --all              list every gap of every route
 *   node tools/dev/intro_audit.js --strict           exit 1 when the universal route has a gap (used by validate.js)
 *   node tools/dev/intro_audit.js --json
 *
 * Rule (Howie, 2026-11-20): when a character shows up for the first time, the story must give a short introduction / transition scene —
 * the reader should know who this is, and why they are here, before they speak.
 *
 * Heuristic, by data-flow over the choice graph (same edges as route_graph / story_lib):
 *   • a "character" is a node.speaker (named, with a sprite) or a node.foe that has a name; unnamed narration and "…" speakers are ignored;
 *   • MUST-SEEN(node) = characters that EVERY path into the node has already shown (intersection over predecessors; start nodes, birth nodes
 *     and engine roots have none), so a character who is only met on some paths counts as new for the paths that missed him;
 *   • a node has a GAP for character X when X speaks / is shown here, X ∉ MUST-SEEN, and X is not "introduced": the node's own text (base text
 *     and every alt, zh and en) does not name X (full name, a ≥2-char head or tail of it, or a significant en word), and no node that directly
 *     leads here names X in its narration either (a foreshadowing line counts as the lead-in);
 *   • random events are judged on their own: a speaker that the event text does not name is a gap (events can fire anywhere, so nothing is "seen").
 * It measures; it cannot judge whether the introduction is good. Output lines: route · node · character · why.
 */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.resolve(__dirname, "..", "..");
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d; };
const ONLY = arg("--route", null), ALL = argv.includes("--all"), STRICT = argv.includes("--strict"), JSON_OUT = argv.includes("--json");

function loadWH() {
  const ctx = {console}; ctx.window = ctx; ctx.self = ctx; vm.createContext(ctx);
  const load = (f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, {filename: f});
  load("src/js/registry.js"); load("assets/manifest.js");
  for (const f of fs.readdirSync(path.join(ROOT, "data", "factions")).sort()) load("data/factions/" + f);
  try { load("data/universal.js"); } catch (e) { /* optional (SPEC §37) */ }
  for (const f of ["data/events.js", "data/events_lore.js", "data/events_taint.js"]) { try { load(f); } catch (e) { /* optional */ } }
  return ctx.WH;
}

/* ---------- text helpers ---------- */
const txt = (x, lang) => (x && typeof x === "object" ? (x[lang] || "") : typeof x === "string" ? x : "");
function nodeTexts(n) {                         // every text the node can show: base + alts, per language
  const out = {zh: [], en: []};
  for (const l of ["zh", "en"]) { out[l].push(txt(n.text, l)); for (const a of n.alt || []) out[l].push(txt(a.text, l)); }
  return {zh: out.zh.join("\n"), en: out.en.join("\n")};
}
const EN_STOP = new Set(["the", "of", "and", "a", "an", "old", "young", "lord", "lady", "sir", "one", "legged", "from", "to"]);
function nameKeys(name) {
  const zh = txt(name, "zh").replace(/[“”"「」『』…\s]/g, ""), en = txt(name, "en").replace(/[“”"…]/g, "").trim();
  const keys = {zh: new Set(), en: new Set()};
  if (zh.length >= 2) {
    keys.zh.add(zh);
    for (const part of zh.split(/[·・]/)) if (part.length >= 2) keys.zh.add(part);
    if (zh.length >= 4) { keys.zh.add(zh.slice(0, 2)); keys.zh.add(zh.slice(-2)); }
    if (zh.length === 3) { keys.zh.add(zh.slice(0, 2)); keys.zh.add(zh.slice(1)); }
  }
  if (en.length >= 3) {
    keys.en.add(en.toLowerCase());
    for (const w of en.split(/[\s\-–]+/)) { const k = w.replace(/[^\p{L}']/gu, "").toLowerCase(); if (k.length >= 4 && !EN_STOP.has(k)) keys.en.add(k); }
  }
  return keys;
}
const mentions = (texts, keys) => { const zh = texts.zh, en = texts.en.toLowerCase(); for (const k of keys.zh) if (zh.includes(k)) return true; for (const k of keys.en) if (en.includes(k)) return true; return false; };
const SELF_ZH = /我是|我叫|叫我|吾乃|这里是|我们是/, SELF_EN = /\b(I am|I'm|call me|my name|this is|we are)\b/i;
const ABSTRACT_SPRITE = /^(omen_|sigil_|daemon_|warp|voice)/, QUOTE_OPEN = /^[“「"]/;
const isAnon = (name) => { const zh = txt(name, "zh").replace(/[…\s.。·?？!！]/g, ""), en = txt(name, "en").replace(/[…\s.。·?？!！]/g, ""); return !zh && !en; };

/* a node's characters: [{id, name, via}] (id = lowercase name key, so the same person under two sprites is still one person) */
function charsOf(n) {
  const out = [];
  const add = (sp, via) => { if (sp && typeof sp === "object" && sp.name && !isAnon(sp.name)) out.push({id: txt(sp.name, "zh") || txt(sp.name, "en"), name: sp.name, sprite: sp.sprite, via}); };
  add(n.speaker, "speaker");
  if (n.foe && typeof n.foe === "object") add(n.foe, "foe");
  for (const a of n.alt || []) if (a.speaker) add(a.speaker, "alt speaker");
  return out;
}

/* ---------- graph ---------- */
function edgesOf(N) {
  const succ = {}, pred = {};
  for (const id of Object.keys(N)) { succ[id] = new Set(); pred[id] = pred[id] || new Set(); }
  for (const [id, n] of Object.entries(N)) {
    const t = [];
    if (typeof n.next === "string") t.push(n.next);
    for (const c of n.choices || []) { if (c.roll) { t.push(c.roll.success, c.roll.fail); } else t.push(c.next); }
    for (const x of t) if (x && N[x]) { succ[id].add(x); pred[x].add(id); }
  }
  return {succ, pred};
}
function rootsOf(F, WH) {
  const N = F.nodes, r = new Set();
  const add = (x) => { if (x && N[x]) r.add(x); };
  add(F.startNode); add(F.birthNode);
  for (const o of (F.origins || [])) add(o.startNode);
  for (const x of Object.values(F.deathNodes || {})) add(x);
  for (const e of WH.events || []) for (const c of (e.choices || [])) { const g = c && c.goto; if (g) add(typeof g === "string" ? g : g[F.id]); }
  return r;
}

function auditRoute(WH, F, id) {
  const N = F.nodes, {succ, pred} = edgesOf(N), roots = rootsOf(F, WH), gaps = [], ids = Object.keys(N), deathSet = new Set(Object.values(F.deathNodes || {}));
  const chars = {};                                        // id → {name, first nodes}
  const outOf = (n) => charsOf(N[n]).map((c) => c.id);
  // must-seen: optimistic start (all characters), shrink
  const universe = new Set(); for (const n of ids) for (const c of outOf(n)) universe.add(c);
  const must = {}; for (const n of ids) must[n] = roots.has(n) ? new Set() : new Set(universe);
  let changed = true, guard = 0;
  while (changed && guard++ < 200) {
    changed = false;
    for (const n of ids) {
      if (roots.has(n)) continue;
      const ps = [...pred[n]];
      if (!ps.length) { if (must[n].size) { must[n] = new Set(); changed = true; } continue; }       // unreachable from any root: treat as nothing seen
      let acc = null;
      for (const p of ps) { const o = new Set([...must[p], ...outOf(p)]); acc = acc === null ? o : new Set([...acc].filter((x) => o.has(x))); }
      if (acc.size !== must[n].size) { must[n] = acc; changed = true; }
    }
  }
  const reach = new Set(roots); const q = [...roots];                                            // only judge nodes a player can reach
  while (q.length) { const n = q.pop(); for (const s of succ[n]) if (!reach.has(s)) { reach.add(s); q.push(s); } }
  for (const n of ids) {
    if (!reach.has(n)) continue;
    const node = N[n];
    for (const c of charsOf(node)) {
      if (must[n].has(c.id)) continue;
      const keys = nameKeys(c.name), own = nodeTexts(node);
            const lead = [...pred[n]].some((p) => mentions(nodeTexts(N[p]), keys));
      const named = mentions(own, keys) || lead;
      const selfIntro = (() => { const q = {zh: (txt(node.text, "zh").match(/[“「][^”」]*[”」]/g) || []).join(""), en: (txt(node.text, "en").match(/“[^”]*”/g) || []).join(" ")};
        return (SELF_ZH.test(q.zh) || SELF_EN.test(q.en)) && mentions(q, keys) || SELF_ZH.test(q.zh) && /这里是|我是|我们是/.test(q.zh) && !q.zh.includes("你们是谁"); })();
      const bare = QUOTE_OPEN.test(txt(node.text, "zh").trim()) && !lead && !selfIntro;   // the node opens with their own line: no narrated lead-in, and they do not introduce themselves
      const kind = ABSTRACT_SPRITE.test(c.sprite || "") || node.ending || deathSet.has(n) ? "voice" : "person";
      if (!named) gaps.push({route: id, node: n, chapter: node.chapter, who: txt(c.name, "zh") + " / " + txt(c.name, "en"), via: c.via, kind, level: "unnamed",
                 why: "not named / described in this node or in any node leading here" + (pred[n].size ? "" : " (entry node)")});
      else if (bare && !mentions({zh: txt(node.text, "zh").replace(/[“「][^”」]*[”」]/g, ""), en: ""}, keys) && kind === "person")
        gaps.push({route: id, node: n, chapter: node.chapter, who: txt(c.name, "zh") + " / " + txt(c.name, "en"), via: c.via, kind, level: "bare",
                   why: "the node opens with the character's own line; the name is only inside the quote"});
    }
  }
  return gaps;
}

function auditEvents(WH) {
  const gaps = [];
  for (const e of WH.events || []) {
    const sp = e.speaker; if (!sp || typeof sp !== "object" || !sp.name || isAnon(sp.name)) continue;
    const keys = nameKeys(sp.name), own = {zh: txt(e.text, "zh"), en: txt(e.text, "en")};
    if (!mentions(own, keys)) gaps.push({route: "(events)", node: e.id, chapter: null, who: txt(sp.name, "zh") + " / " + txt(sp.name, "en"), via: "event speaker", why: "event speaker not named in the event text"});
  }
  return gaps;
}

const WH = loadWH();
const routes = Object.keys(WH.factions).map((id) => [id, WH.factions[id]]);
if (WH.universal) routes.push([WH.universal.id, WH.universal]);
const result = {}, nodeCount = {};
for (const [id, F] of routes) { result[id] = auditRoute(WH, F, id); nodeCount[id] = Object.keys(F.nodes).length; }
const evGaps = auditEvents(WH);
const uniId = WH.universal && WH.universal.id;

if (JSON_OUT) { console.log(JSON.stringify({routes: result, events: evGaps}, null, 1)); }
else {
  console.log("intro audit — characters whose first appearance has no introduction (heuristic, SPEC §37.9)\n");
  let total = 0;
  for (const [id] of routes) {
    const g = result[id], pg = g.filter((x) => x.kind === "person"); total += pg.length;
    console.log(`  ${id.padEnd(12)} ${String(pg.length).padStart(3)} person gaps (${pg.filter((x) => x.level === "unnamed").length} unnamed + ${pg.filter((x) => x.level === "bare").length} bare-quote) · ${String(g.length - pg.length).padStart(2)} voices / ${String(nodeCount[id]).padStart(3)} nodes` + (id === uniId ? "   (universal route — must be 0 persons)" : ""));
  }
  console.log(`  ${"events".padEnd(12)} ${String(evGaps.length).padStart(3)} gaps / ${(WH.events || []).length} events`);
  console.log(`  total person gaps (routes) ${total}`);
  const show = ALL ? routes.map((r) => r[0]) : ONLY ? [ONLY] : [];
  for (const id of show) {
    if (!result[id]) { console.error("unknown route " + id); process.exit(2); }
    console.log(`\n--- ${id} ---`);
    for (const g of result[id]) console.log(`  ch${g.chapter} ${g.node}  ${g.kind}/${g.level}  ${g.who}  [${g.via}]  ${g.why}`);
  }
  if (ALL || ONLY === "events") { console.log("\n--- events ---"); for (const g of evGaps) console.log(`  ${g.node}  ${g.who}  ${g.why}`); }
}
const uniBad = uniId ? result[uniId].filter((x) => x.kind === "person") : [];
if (STRICT && uniBad.length) { if (!JSON_OUT) console.error(`\nERROR: the universal route has ${uniBad.length} unintroduced character(s)`); process.exit(1); }
