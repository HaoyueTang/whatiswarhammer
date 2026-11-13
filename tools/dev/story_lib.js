/* story_lib.js — shared story-quality analysis (SPEC §32). Owned by: web.
 * Used by tools/dev/validate.js (story gates + --story-report), route_converge.js and route_graph.js. Plain Node, no dependencies; works on the
 * registry object `WH` (factions, events, rumors, achievements) that the callers load into a vm context. Pure functions only.
 *
 *   storyMetrics(WH, factionId, opts)  → the per-route numbers of SPEC §32.1 rules 1–4 (false choices, shallow branches, forced chapter steps,
 *                                         hard jumps, never-read flags, bridges, alt / gather counts, event-roll coverage)
 *   readsOf(WH, F) / setsOf(F)         → flag read / set maps (alt, resultAlt, require, grudge, event where, rumour when, achievements)
 *   mayFlags(F, WH)                    → flags that MAY be set when a node is entered (forward data-flow over the choice graph)
 *   condFlags(cond), whereFlags(w), COND_KEYS, WHERE_KEYS
 */
"use strict";

const COND_KEYS = ["flag", "notFlag", "flags", "anyFlag", "stat", "min", "max", "taint", "fromChapter", "fromScene", "fromNode", "any", "all", "not"];
const WHERE_KEYS = ["scenes", "notScenes", "nodes", "notNodes", "chapter", "flag", "notFlag", "flags", "anyFlag", "stat", "min", "max", "taint"];
const BIG_HOURS = 72;                                        // "d ≥ 3" (SPEC §32.1 rule 3)
const arr = (x) => (x === undefined || x === null ? [] : Array.isArray(x) ? x : [x]);

/* every flag name a condition mentions (any polarity) */
function condFlags(cond, out) {
  out = out || new Set();
  if (!cond || typeof cond !== "object") return out;
  if (Array.isArray(cond)) { cond.forEach((c) => condFlags(c, out)); return out; }
  for (const k of ["flag", "notFlag"]) if (typeof cond[k] === "string") out.add(cond[k]);
  for (const k of ["flags", "anyFlag"]) arr(cond[k]).forEach((f) => typeof f === "string" && out.add(f));
  for (const k of ["any", "all"]) arr(cond[k]).forEach((c) => condFlags(c, out));
  if (cond.not) condFlags(cond.not, out);
  return out;
}
function whereFlags(w, out) {
  out = out || new Set();
  if (!w || typeof w !== "object") return out;
  for (const k of ["flag", "notFlag"]) if (typeof w[k] === "string") out.add(w[k]);
  for (const k of ["flags", "anyFlag"]) arr(w[k]).forEach((f) => typeof f === "string" && out.add(f));
  return out;
}
/* flag names of a `require` (object or array of objects) */
function requireFlags(r, out) {
  out = out || new Set();
  arr(r).forEach((q) => { if (q) { if (typeof q.flag === "string") out.add(q.flag); if (typeof q.notFlag === "string") out.add(q.notFlag); } });
  return out;
}
const truthyKeys = (o) => Object.keys(o || {}).filter((k) => o[k]);
const timeHours = (t) => !t ? 0 : (+t.h || 0) + (+t.d || 0) * 24 + (+t.w || 0) * 168 + (+t.y || 0) * 8760;
const appliesTo = (x, fid) => { const fs = x.factions || ["*"]; return (fs.indexOf("*") >= 0 || fs.indexOf(fid) >= 0) && !(x.excludeFactions || []).includes(fid); };

/* flags set by the route's own nodes / choices (truthy effects.set): flag → [node ids]; origin flags separately */
function setsOf(F) {
  const sets = {}, add = (k, id) => { (sets[k] = sets[k] || []).push(id); };
  for (const [id, n] of Object.entries(F.nodes || {})) {
    truthyKeys(n.effects && n.effects.set).forEach((k) => add(k, id));
    (n.choices || []).forEach((c) => truthyKeys(c.effects && c.effects.set).forEach((k) => add(k, id)));
  }
  return sets;
}
/* flag → [reader descriptions] over the route's nodes, the events that apply to it, rumours and achievements */
function readsOf(WH, F) {
  const reads = {}, add = (k, who) => { (reads[k] = reads[k] || []).push(who); };
  const npcsRead = new Set();
  for (const [id, n] of Object.entries(F.nodes || {})) {
    (n.alt || []).forEach((a, i) => condFlags(a && a["if"]).forEach((k) => add(k, `${id}.alt[${i}]`)));
    if (n.grudgeLine && n.grudgeLine.npc) npcsRead.add(n.grudgeLine.npc);
    (n.choices || []).forEach((c, ci) => {
      requireFlags(c.require).forEach((k) => add(k, `${id}#${ci + 1}.require`));
      (c.resultAlt || []).forEach((a, i) => condFlags(a && a["if"]).forEach((k) => add(k, `${id}#${ci + 1}.resultAlt[${i}]`)));
      if (c.grudge && c.grudge.npc) npcsRead.add(c.grudge.npc);
    });
  }
  npcsRead.forEach((npc) => { add("wronged_" + npc, "grudge"); add("forgiven_" + npc, "grudge"); });
  for (const e of WH.events || []) {
    if (!appliesTo(e, F.id)) continue;
    whereFlags(e.where).forEach((k) => add(k, `${e.id}.where`));
    (e.choices || []).forEach((c, ci) => requireFlags(c.require).forEach((k) => add(k, `${e.id}#${ci + 1}.require`)));
  }
  for (const r of WH.rumors || []) {
    if (!appliesTo(r, F.id)) continue;
    arr(r.when && r.when.flags).forEach((k) => add(k, `${r.id}.when`));
  }
  for (const a of WH.achievements || []) {
    const c = a && a.cond && a.cond.flag;
    if (c && c.id && (!c.faction || c.faction === F.id)) add(c.id, `${a.id}`);
  }
  return reads;
}

/* ---------- graph helpers ---------- */
function targetsOfChoice(c) { return (c.roll ? [c.roll.success, c.roll.fail] : [c.next]).filter(Boolean); }
function edgesOf(F) {
  const N = F.nodes || {}, out = [];
  for (const [id, n] of Object.entries(N)) (n.choices || []).forEach((c, ci) => targetsOfChoice(c).forEach((t) => { if (N[t]) out.push({from: id, to: t, ci}); }));
  return out;
}
/* nodes the engine enters from anywhere: stat-death nodes and event goto targets (claim endings) */
function engineRoots(WH, F) {
  const N = F.nodes || {}, roots = new Set(Object.values(F.deathNodes || {}).filter((x) => N[x]));
  for (const e of WH.events || []) {
    if (!appliesTo(e, F.id)) continue;
    (e.choices || []).forEach((c) => { const g = c && c.goto; const t = !g ? null : (typeof g === "string" ? g : g[F.id]); if (t && N[t]) roots.add(t); });
  }
  return roots;
}

/* flags that MAY be set on arrival at each node: {node → Set}, + preds {node → Set of predecessor ids}, + roots. Event-set flags count as possible everywhere. */
function mayFlags(F, WH) {
  const N = F.nodes || {}, ids = Object.keys(N), roots = engineRoots(WH || {}, F), edges = edgesOf(F);
  const may = {}, preds = {}, out = {};
  ids.forEach((id) => { may[id] = new Set(); preds[id] = new Set(); out[id] = []; });
  edges.forEach((e) => { out[e.from].push(e); preds[e.to].add(e.from); });
  const universe = new Set(), evFlags = new Set();
  Object.keys(setsOf(F)).forEach((k) => universe.add(k));
  const starts = [];
  const origins = Array.isArray(F.origins) && F.origins.length ? F.origins : [{startNode: F.startNode, set: {}}];
  origins.forEach((o) => { truthyKeys(o.set).forEach((k) => universe.add(k)); if (o.startNode && N[o.startNode]) starts.push([o.startNode, truthyKeys(o.set)]); });
  for (const e of (WH && WH.events) || []) {
    if (!appliesTo(e, F.id)) continue;
    (e.choices || []).forEach((c) => truthyKeys(c.effects && c.effects.set).forEach((k) => { evFlags.add(k); universe.add(k); }));
  }
  const q = [];
  const offer = (id, fl) => { let ch = false; fl.forEach((k) => { if (!may[id].has(k)) { may[id].add(k); ch = true; } }); if (ch || !q.includes(id)) q.push(id); };
  starts.forEach(([id, fl]) => offer(id, new Set(fl)));
  roots.forEach((id) => offer(id, universe));
  let guard = 0;
  while (q.length && guard++ < 400000) {
    const id = q.shift(), n = N[id], after = new Set(may[id]);
    truthyKeys(n.effects && n.effects.set).forEach((k) => after.add(k));
    out[id].forEach((e) => {
      const c = n.choices[e.ci], f2 = new Set(after);
      truthyKeys(c.effects && c.effects.set).forEach((k) => f2.add(k));
      let ch = false; f2.forEach((k) => { if (!may[e.to].has(k)) { may[e.to].add(k); ch = true; } });
      if (ch) q.push(e.to);
    });
  }
  ids.forEach((id) => evFlags.forEach((k) => may[id].add(k)));
  return {may, preds, roots, evFlags};
}

/* ---------- per-route metrics (SPEC §32.1) ---------- */
function storyMetrics(WH, fid, opts) {
  opts = opts || {};
  const F = WH.factions[fid], N = F.nodes || {}, ids = Object.keys(N);
  const reads = readsOf(WH, F), sets = setsOf(F);
  const targets = (n) => (n.choices || []).map(targetsOfChoice);
  const succ = (id) => { const s = new Set(); targets(N[id]).forEach((t) => t.forEach((x) => N[x] && s.add(x))); return [...s]; };
  const depthsFrom = (start, max) => { const d = {[start]: 0}; let fr = [start]; for (let k = 1; k <= max; k++) { const nx = []; fr.forEach((a) => succ(a).forEach((b) => { if (d[b] === undefined) { d[b] = k; nx.push(b); } })); fr = nx; } return d; };
  const readSig = (c) => {                                    // flags this choice sets or clears that something reads
    const e = c.effects || {}, sig = [];
    truthyKeys(e.set).forEach((k) => reads[k] && sig.push(k));
    Object.keys(e.set || {}).filter((k) => !e.set[k]).forEach((k) => reads[k] && sig.push("-" + k));
    arr(e.unset).forEach((k) => reads[k] && sig.push("-" + k));
    return sig.sort().join(",");
  };
  const m = {faction: fid, nodes: ids.length, endings: 0, multi: 0, falseChoice: [], falseByFlagOnly: 0, branching: 0, shallow: [], rejoin1: [], rejoin1Echoed: [], forced: [], hard: [], hardUnjustified: [],
             bridges: [], jumps: [], gather: [], altNodes: 0, altEntries: 0, resultAlt: 0, choicesTotal: 0, choicesOwnFollowUp: 0, neverRead: [], readByOtherOnly: [], eventRoll: {nodes: 0, dead: [], avg: 0}};
  const seenEdge = new Set();
  ids.forEach((id) => {
    const n = N[id];
    if (n.bridge) m.bridges.push(id);
    if (n.jump) m.jumps.push(id);
    if (n.gather) m.gather.push(id);
    if (Array.isArray(n.alt) && n.alt.length) { m.altNodes++; m.altEntries += n.alt.length; }
    if (n.ending) { m.endings++; return; }
    (n.choices || []).forEach((c) => { if (Array.isArray(c.resultAlt) && c.resultAlt.length) m.resultAlt++; });
    if (!(n.choices || []).length) return;
    const ts = targets(n), uniq = [...new Set([].concat(...ts))], nch = n.choices.length;
    if (nch >= 2) {
      m.multi++;
      if (uniq.length === 1) {
        const sigs = n.choices.map(readSig);
        if (sigs.every((s) => s === sigs[0])) m.falseChoice.push(id);
        else m.falseByFlagOnly++;
      }
      m.choicesTotal += nch;
      n.choices.forEach((c, i) => { const mine = targetsOfChoice(c), others = [].concat(...ts.filter((_, j) => j !== i)); if (!mine.every((x) => others.includes(x))) m.choicesOwnFollowUp++; });
    }
    if (uniq.length >= 2) {
      m.branching++;
      const ds = uniq.map((u) => depthsFrom(u, 4));
      let best = 99;
      Object.keys(ds[0]).forEach((x) => { if (ds.every((d) => d[x] !== undefined)) best = Math.min(best, Math.max.apply(null, ds.map((d) => d[x]))); });
      if (best <= 1) {                                          // siblings re-merge within ≤1 step; shallow only if no READ flag tells the choices apart
        m.rejoin1.push(`${id}(rejoin@${best})`);
        const sigs = n.choices.map(readSig);
        if (sigs.every((x) => x === sigs[0])) m.shallow.push(`${id}(rejoin@${best})`);
        else m.rejoin1Echoed.push(`${id}(rejoin@${best})`);
      }
    }
    uniq.forEach((t) => {
      const k = id + ">" + t; if (seenEdge.has(k)) return; seenEdge.add(k);
      const x = N[t]; if (!x || x.ending) return;
      const dc = (x.chapter || 0) - (n.chapter || 0), mt = x.time || {};
      const bigT = timeHours(mt) >= BIG_HOURS || mt.warp;
      if (dc >= 1 && uniq.length === 1 && !x.bridge) m.forced.push(`${id}→${t}(ch${n.chapter}→${x.chapter})`);
      if (n.scene !== x.scene && (bigT || dc >= 1)) {
        const label = `${id}→${t}(${n.scene}→${x.scene}${bigT ? ", time " + JSON.stringify(mt) : ""}${dc >= 1 ? ", ch" + n.chapter + "→" + x.chapter : ""})`;
        m.hard.push(label);
        if (!(x.bridge || x.jump || n.jump)) m.hardUnjustified.push(label);
      }
    });
  });
  /* flags set by a node / choice of the route and read by nothing */
  Object.keys(sets).forEach((k) => {
    if (reads[k]) { if (reads[k].every((w) => /^ach_/.test(w) || /\.when$/.test(w))) m.readByOtherOnly.push(k); return; }
    m.neverRead.push(k);
  });
  /* events: eventRoll nodes and how many events can statically fire there (faction, minChapter, where.scenes/nodes/chapter; flag conditions ignored) */
  const evs = (WH.events || []).filter((e) => e.trigger !== "claim" && appliesTo(e, fid) && (e.choices || []).length);
  let tot = 0;
  ids.forEach((id) => {
    const n = N[id]; if (!n.eventRoll || n.ending) return;
    m.eventRoll.nodes++;
    const ch = typeof n.chapter === "number" ? n.chapter : 1;
    const ok = evs.filter((e) => {
      if ((e.minChapter || 0) > ch) return false;
      const w = e.where; if (!w) return true;
      if (w.scenes && !arr(w.scenes).includes(n.scene)) return false;
      if (w.notScenes && arr(w.notScenes).includes(n.scene)) return false;
      if (w.nodes && !arr(w.nodes).includes(id)) return false;
      if (w.notNodes && arr(w.notNodes).includes(id)) return false;
      if (w.chapter && typeof w.chapter === "object" && ((w.chapter.min !== undefined && ch < w.chapter.min) || (w.chapter.max !== undefined && ch > w.chapter.max))) return false;
      return true;
    }).length;
    tot += ok;
    if (!ok) m.eventRoll.dead.push(id);
  });
  m.eventRoll.avg = m.eventRoll.nodes ? tot / m.eventRoll.nodes : 0;
  m.falsePct = m.multi ? 100 * m.falseChoice.length / m.multi : 0;
  m.shallowPct = m.branching ? 100 * m.shallow.length / m.branching : 0;
  m.ownFollowUpPct = m.choicesTotal ? 100 * m.choicesOwnFollowUp / m.choicesTotal : 0;
  return m;
}

const median = (a) => { if (!a.length) return 0; const s = a.slice().sort((x, y) => x - y), h = s.length >> 1; return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2; };

module.exports = {COND_KEYS, WHERE_KEYS, BIG_HOURS, condFlags, whereFlags, requireFlags, setsOf, readsOf, edgesOf, engineRoots, mayFlags, storyMetrics, median, appliesTo, targetsOfChoice};
