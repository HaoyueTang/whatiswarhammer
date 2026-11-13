#!/usr/bin/env node
/* route_graph.js — reads a route like a story and finds logic gaps by data-flow (story overhaul, SPEC §32). Owned by: web.
 *
 *   node tools/dev/route_graph.js --faction imperium            markdown digest of the whole route (stdout)
 *   options: --en (also print English text)   --checks-only (just the automatic findings)   --json (machine-readable)
 *
 * For every node: chapter, scene, speaker, time, text, effects, choices (→ target, roll, require, result), the incoming
 * edges (with the choice text that leads here) and what is GUARANTEED on arrival (flags that every path sets, nodes that every
 * path has visited) versus only POSSIBLE. A node's text may only assume guaranteed facts; anything merely possible must be
 * stated in the text of a node that is only reachable through it, or gated with a `require`.
 * Automatic findings: dead gates (require flag that can never be true here / notFlag that is always false), flags read but
 * never set, flags set but never read, unreachable nodes, dead ends, rolls without both targets, choices that can never be offered.
 * SPEC §32.2: `alt` / `resultAlt` conditions count as reads; each alt entry is checked against the data-flow (flag MUST on arrival → decorative,
 * flag not MAY → can never match) and printed in the digest with the MUST / MAY status of its flags.
 * Random events (eventRoll → data/events*.js) may also set flags; they are not part of the graph (noted in the output). */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const SL = require("./story_lib.js");     // SPEC §32.2: alt / resultAlt conditions count as flag reads
const ROOT = path.resolve(__dirname, "..", "..");
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d; };
const FID = arg("--faction", null), EN = argv.includes("--en"), CHECKS = argv.includes("--checks-only"), JSON_OUT = argv.includes("--json");
if (!FID) { console.error("usage: node tools/dev/route_graph.js --faction <id> [--en] [--checks-only] [--json]"); process.exit(2); }

const ctx = {console}; ctx.window = ctx; ctx.self = ctx; vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, {filename: f});
load("src/js/registry.js"); load("assets/manifest.js");
for (const f of fs.readdirSync(path.join(ROOT, "data", "factions")).sort()) load("data/factions/" + f);
for (const f of ["data/events.js", "data/events_lore.js", "data/events_taint.js"]) { try { load(f); } catch (e) { /* optional */ } }
const F = ctx.WH.factions[FID];
if (!F) { console.error("unknown faction " + FID); process.exit(2); }
const N = F.nodes, ids = Object.keys(N);

/* ---- edges ---- */
const edges = [];   // {from, to, kind:"next"|"success"|"fail", ci, choice}
ids.forEach((id) => (N[id].choices || []).forEach((c, ci) => {
  if (c.roll) {
    if (c.roll.success) edges.push({from: id, to: c.roll.success, kind: "success", ci, c});
    if (c.roll.fail) edges.push({from: id, to: c.roll.fail, kind: "fail", ci, c});
  } else if (c.next) edges.push({from: id, to: c.next, kind: "next", ci, c});
}));
const out = {}, inn = {};
ids.forEach((id) => { out[id] = []; inn[id] = []; });
edges.forEach((e) => { if (N[e.to]) { out[e.from].push(e); inn[e.to].push(e); } });

/* nodes the ENGINE enters from anywhere: stat-death nodes and nodes that random events jump to (claim endings via choice.goto) */
const engineRoots = new Set(Object.values(F.deathNodes || {}));
(ctx.WH.events || []).forEach((ev) => (ev.choices || []).forEach((c) => {
  const g = c && c.goto; if (!g) return;
  const t = typeof g === "string" ? g : g[FID];
  if (t && N[t]) engineRoots.add(t);
}));
const starts = (F.origins || []).map((o) => ({node: o.startNode || F.startNode, flags: Object.keys(o.set || {}).filter((k) => o.set[k])}));
if (!starts.length) starts.push({node: F.startNode, flags: []});
const setOf = (eff) => { const on = [], off = []; const s = (eff && eff.set) || {}; Object.keys(s).forEach((k) => (s[k] ? on : off).push(k)); return {on, off}; };

/* ---- data-flow: MUST (guaranteed on every path) / MAY flags, and MUST-visited nodes ---- */
const universeF = new Set(), universeN = new Set(ids);
ids.forEach((id) => { const n = N[id]; setOf(n.effects).on.forEach((k) => universeF.add(k)); (n.choices || []).forEach((c) => setOf(c.effects).on.forEach((k) => universeF.add(k))); });
starts.forEach((s) => s.flags.forEach((k) => universeF.add(k)));
const mustF = {}, mayF = {}, mustN = {}, mayN = {}, dist = {};
ids.forEach((id) => { mustF[id] = null; mayF[id] = new Set(); mustN[id] = null; mayN[id] = new Set(); });
const inter = (a, b) => { if (a === null) return new Set(b); const r = new Set(); a.forEach((x) => { if (b.has(x)) r.add(x); }); return r; };
const eq = (a, b) => a !== null && b !== null && a.size === b.size && [...a].every((x) => b.has(x));
const queue = [];
function offer(to, fF, fMay, nMust, nMay) {
  let ch = false;
  const nm = inter(mustF[to], fF); if (!eq(nm, mustF[to])) { mustF[to] = nm; ch = true; }
  fMay.forEach((x) => { if (!mayF[to].has(x)) { mayF[to].add(x); ch = true; } });
  const vm_ = inter(mustN[to], nMust); if (!eq(vm_, mustN[to])) { mustN[to] = vm_; ch = true; }
  nMay.forEach((x) => { if (!mayN[to].has(x)) { mayN[to].add(x); ch = true; } });
  if (ch) queue.push(to);
}
starts.forEach((s) => { if (N[s.node]) { dist[s.node] = 0; offer(s.node, new Set(s.flags), new Set(s.flags), new Set(), new Set()); } });
let guard = 0;
while (queue.length && guard++ < 200000) {
  const id = queue.shift(), n = N[id];
  const arrF = mustF[id], arrMay = mayF[id];
  /* after entering the node: node effects */
  const ne = setOf(n.effects);
  let f1 = new Set(arrF); ne.on.forEach((k) => f1.add(k)); ne.off.forEach((k) => f1.delete(k));
  const m1 = new Set(arrMay); ne.on.forEach((k) => m1.add(k));
  const nM = new Set(mustN[id]); nM.add(id);
  const nY = new Set(mayN[id]); nY.add(id);
  out[id].forEach((e) => {
    const ce = setOf(e.c.effects);
    const f2 = new Set(f1); ce.on.forEach((k) => f2.add(k)); ce.off.forEach((k) => f2.delete(k));
    const m2 = new Set(m1); ce.on.forEach((k) => m2.add(k));
    if (dist[e.to] === undefined || dist[id] + 1 < dist[e.to]) dist[e.to] = dist[id] + 1;
    offer(e.to, f2, m2, nM, nY);
  });
}
/* engine roots: arrive from anywhere → nothing guaranteed, any flag possible */
engineRoots.forEach((id) => {
  if (!N[id]) return;
  if (dist[id] === undefined) dist[id] = 99;
  offer(id, new Set(), new Set(universeF), new Set(), new Set());
});
guard = 0;
while (queue.length && guard++ < 200000) {
  const id = queue.shift(), n = N[id];
  const arrF = mustF[id], arrMay = mayF[id];
  const ne = setOf(n.effects);
  let f1 = new Set(arrF); ne.on.forEach((k) => f1.add(k)); ne.off.forEach((k) => f1.delete(k));
  const m1 = new Set(arrMay); ne.on.forEach((k) => m1.add(k));
  const nM = new Set(mustN[id]); nM.add(id);
  const nY = new Set(mayN[id]); nY.add(id);
  out[id].forEach((e) => {
    const ce = setOf(e.c.effects);
    const f2 = new Set(f1); ce.on.forEach((k) => f2.add(k)); ce.off.forEach((k) => f2.delete(k));
    const m2 = new Set(m1); ce.on.forEach((k) => m2.add(k));
    if (dist[e.to] === undefined || dist[id] + 1 < dist[e.to]) dist[e.to] = dist[id] + 1;
    offer(e.to, f2, m2, nM, nY);
  });
}
const reached = (id) => mustF[id] !== null;

/* ---- automatic findings ---- */
const findings = [];
const add = (sev, id, msg) => findings.push({sev, id, msg});
const readFlags = {}, setFlags = {}, eventFlags = new Set();
(ctx.WH.events || []).forEach((ev) => { if (SL.appliesTo(ev, FID)) (ev.choices || []).forEach((c) => setOf(c.effects).on.forEach((k) => { eventFlags.add(k); (setFlags[k] = setFlags[k] || []).push("event " + ev.id); })); });
ids.forEach((id) => {
  const n = N[id];
  setOf(n.effects).on.forEach((k) => (setFlags[k] = setFlags[k] || []).push(id));
  (n.alt || []).forEach((a) => SL.condFlags(a && a["if"]).forEach((k) => (readFlags[k] = readFlags[k] || []).push(id)));
  (n.choices || []).forEach((c) => {
    setOf(c.effects).on.forEach((k) => (setFlags[k] = setFlags[k] || []).push(id));
    SL.requireFlags(c.require).forEach((k) => (readFlags[k] = readFlags[k] || []).push(id));
    (c.resultAlt || []).forEach((a) => SL.condFlags(a && a["if"]).forEach((k) => (readFlags[k] = readFlags[k] || []).push(id)));
  });
});
(ctx.WH.events || []).forEach((ev) => { if (SL.appliesTo(ev, FID)) SL.whereFlags(ev.where).forEach((k) => (readFlags[k] = readFlags[k] || []).push("event " + ev.id)); });
starts.forEach((s) => s.flags.forEach((k) => (setFlags[k] = setFlags[k] || []).push("origin")));
Object.keys(readFlags).forEach((k) => { if (!setFlags[k]) add("ERROR", readFlags[k][0], "flag '" + k + "' is required/tested but never set anywhere (read at " + [...new Set(readFlags[k])].join(", ") + ")"); });
Object.keys(setFlags).forEach((k) => {
  if (readFlags[k] || /^(origin_|wronged_|forgiven_)/.test(k)) return;
  add("INFO", setFlags[k][0], "flag '" + k + "' is set (at " + [...new Set(setFlags[k])].join(", ") + ") but never used by a require — only text may rely on it");
});
ids.forEach((id) => {
  const n = N[id];
  if (!reached(id)) { add("ERROR", id, "node unreachable from any origin start"); return; }
  if (!n.ending && !(n.choices && n.choices.length)) add("ERROR", id, "dead end: no choices and not an ending");
  if (n.ending && n.choices && n.choices.length) add("WARN", id, "ending node still has choices");
  (n.choices || []).forEach((c, ci) => {
    const lab = "choice " + (ci + 1) + " \"" + ((c.text && c.text.zh) || "") + "\"";
    if (c.roll && !(c.roll.success && c.roll.fail)) add("ERROR", id, lab + ": roll needs both success and fail targets");
    [c.next, c.roll && c.roll.success, c.roll && c.roll.fail].filter(Boolean).forEach((t) => { if (!N[t]) add("ERROR", id, lab + " → missing node " + t); });
    const rq = Array.isArray(c.require) ? (c.require[0] || {}) : (c.require || {});
    if (rq.flag && !mayF[id].has(rq.flag) && !eventFlags.has(rq.flag)) add("WARN", id, lab + " requires flag '" + rq.flag + "' which no path to this node can have set → never offered");
    if (rq.notFlag && mustF[id] && mustF[id].has(rq.notFlag)) add("WARN", id, lab + " needs flag '" + rq.notFlag + "' to be unset but every path sets it → never offered");
    if (rq.flag && mustF[id] && mustF[id].has(rq.flag)) add("INFO", id, lab + " requires flag '" + rq.flag + "' which every path already has → gate is decorative");
    if (!c.result && !(c.rollResult) && !c.roll && (c.effects && Object.keys(c.effects).some((k) => k !== "set"))) add("INFO", id, lab + " has stat effects but no result text (player sees numbers only)");
  });
});
/* SPEC §32.2 alt / resultAlt entries vs the data-flow: a top-level flag condition that is MUST on arrival is decorative, one that is not MAY can never match */
const flagState = (k, id) => (mustF[id] && mustF[id].has(k)) ? "MUST" : (mayF[id].has(k) || eventFlags.has(k)) ? "MAY" : "never";
function altChecks(id, list, label, extraMay) {
  (list || []).forEach((a, i) => {
    const q = (a && a["if"]) || {}, pos = [].concat(q.flag || [], q.flags || []);
    const st = (k) => (extraMay && extraMay.has(k)) && flagState(k, id) === "never" ? "MAY" : flagState(k, id);
    pos.forEach((k) => { if (st(k) === "never") add("WARN", id, label + "[" + i + "] needs flag '" + k + "' which no path to this node sets → can never match"); });
    if (pos.length && pos.every((k) => st(k) === "MUST") && !q.notFlag && !q.not && !q.any && !q.anyFlag && !q.all) add("INFO", id, label + "[" + i + "] needs " + pos.map((k) => "'" + k + "'").join(", ") + " which every path already has → always applies (make it the base text)");
    if (q.notFlag && mustF[id] && mustF[id].has(q.notFlag)) add("WARN", id, label + "[" + i + "] needs flag '" + q.notFlag + "' unset but every path sets it → can never match");
  });
}
ids.forEach((id) => {
  if (!reached(id)) return;
  const n = N[id];
  altChecks(id, n.alt, "alt");
  const nodeSet = new Set(setOf(n.effects).on);
  (n.choices || []).forEach((c, ci) => altChecks(id, c.resultAlt, "choice " + (ci + 1) + " resultAlt", nodeSet));
});
/* a node reached by only one incoming edge whose parent's text/choice is the only context: fine; nodes with ≥3 distinct parents are 'joins' — list them for continuity review */
const joins = ids.filter((id) => reached(id) && new Set(inn[id].map((e) => e.from)).size >= 3 && !N[id].ending);

if (JSON_OUT) {
  console.log(JSON.stringify({faction: FID, nodes: ids.length, findings, joins, must: Object.fromEntries(ids.map((i) => [i, mustF[i] ? [...mustF[i]] : null]))}, null, 1));
  process.exit(0);
}

/* ---- markdown ---- */
const L = [];
const sev = {ERROR: 0, WARN: 1, INFO: 2};
L.push("# Route digest: " + FID + " — " + ids.length + " nodes, origins: " + (F.origins || []).map((o) => o.id + "@" + o.startNode).join(", "));
L.push("");
L.push("Entered by the engine from anywhere (stat deaths, claim jumps): " + [...engineRoots].join(", "));
L.push("");
L.push("Random events (eventRoll → data/events*.js) are not in this graph; they can also set flags. Time `d`/`h`/`y` is applied on entering the node. MUST = on every path to the node; MAY = on some path.");
L.push("");
L.push("## Automatic findings (" + findings.length + ")");
findings.sort((a, b) => sev[a.sev] - sev[b.sev]).forEach((f) => L.push("- **" + f.sev + "** `" + f.id + "`: " + f.msg));
L.push("");
L.push("Join nodes (≥3 different parents — check the text does not assume any single parent's events): " + (joins.join(", ") || "none"));
L.push("");
if (!CHECKS) {
  const order = ids.slice().sort((a, b) => (N[a].chapter || 0) - (N[b].chapter || 0) || (dist[a] === undefined ? 999 : dist[a]) - (dist[b] === undefined ? 999 : dist[b]) || (a < b ? -1 : 1));
  const tstr = (t) => t ? Object.keys(t).map((k) => k + ":" + t[k]).join(",") : "";
  const estr = (e) => e ? JSON.stringify(e).replace(/"/g, "") : "";
  L.push("## Nodes");
  order.forEach((id) => {
    const n = N[id], sp = n.speaker ? ((n.speaker.name && n.speaker.name.zh) || n.speaker.sprite) : "旁白";
    L.push("");
    L.push("### " + id + " · ch" + n.chapter + " · " + n.scene + " · " + sp + (n.foe ? " · foe:" + n.foe : "") + (n.time ? " · time{" + tstr(n.time) + "}" : "") + (n.eventRoll ? " · eventRoll " + n.eventRoll : "") + (n.ending ? " · **ENDING " + n.ending.kind + "**" : ""));
    L.push(n.text.zh.replace(/\n/g, " / "));
    if (EN) L.push("_" + n.text.en.replace(/\n/g, " / ") + "_");
    if (n.grudgeLine) L.push("(grudgeLine " + n.grudgeLine.npc + ": " + n.grudgeLine.text.zh + ")");
    const cstr = (q) => JSON.stringify(q, (k, v) => v).replace(/"/g, "");
    const flagNote = (q) => { const fl = [...SL.condFlags(q)]; return fl.length && reached(id) ? " [" + fl.map((k) => k + ":" + flagState(k, id)).join(" ") + "]" : ""; };
    (n.alt || []).forEach((a, i) => L.push("  alt[" + i + "] if " + cstr(a["if"]) + flagNote(a["if"]) + (a.text ? " → TEXT: " + a.text.zh.replace(/\n/g, " / ") : " → ADD: " + ((a.add && a.add.zh) || "").replace(/\n/g, " / "))));
    if (n.bridge) L.push("(bridge node)");
    if (n.jump) L.push("(jump: " + n.jump.zh + ")");
    if (n.ending) L.push("ending: 「" + n.ending.title.zh + "」 cause: " + ((n.ending.cause && n.ending.cause.zh) || "—"));
    if (n.effects || (n.codex && n.codex.length)) L.push("on enter: " + estr(n.effects) + (n.codex && n.codex.length ? "  codex:" + n.codex.join(",") : ""));
    const pr = inn[id].map((e) => e.from + (e.kind !== "next" ? "(" + e.kind + ")" : "") + " ⟵ “" + ((e.c.text && e.c.text.zh) || "") + "”");
    if (pr.length) L.push("from: " + pr.join(" | "));
    if (reached(id)) {
      const must = [...mustF[id]].sort(), may = [...mayF[id]].filter((k) => !mustF[id].has(k)).sort();
      L.push("flags on arrival — MUST: " + (must.join(", ") || "∅") + " · MAY-only: " + (may.join(", ") || "∅"));
      const near = [...mustN[id]].sort((a, b) => (dist[b] || 0) - (dist[a] || 0)).slice(0, 6);
      if (near.length) L.push("certainly visited before (nearest 6): " + near.join(", "));
    }
    (n.choices || []).forEach((c, ci) => {
      const tgt = c.roll ? "ROLL p=" + c.roll.p + (c.roll.stat ? "+" + c.roll.stat : "") + " ✓" + c.roll.success + " ✗" + c.roll.fail : "→ " + c.next;
      const rq = c.require ? " require" + estr(c.require) : "";
      const eff = c.effects ? " eff" + estr(c.effects) : "";
      const gr = c.grudge ? " grudge(" + c.grudge.npc + ")" : "";
      let res = "";
      if (c.result) res = " ⇒ " + c.result.zh.replace(/\n/g, " / ");
      (c.resultAlt || []).forEach((a, i) => { res += " ⇒alt[" + i + "] if " + cstr(a["if"]) + flagNote(a["if"]) + ": " + ((a.text && a.text.zh) || "").replace(/\n/g, " / "); });
      if (c.rollResult) res += " ⇒✓ " + ((c.rollResult.success && c.rollResult.success.zh) || "") + " ⇒✗ " + ((c.rollResult.fail && c.rollResult.fail.zh) || "");
      L.push("  " + (ci + 1) + ". “" + ((c.text && c.text.zh) || "") + "” " + tgt + rq + eff + gr + res);
    });
  });
}
console.log(L.join("\n"));
