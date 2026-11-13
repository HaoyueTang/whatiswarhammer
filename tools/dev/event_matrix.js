#!/usr/bin/env node
/* event_matrix.js — which random events can fire on which eventRoll node (SPEC §5, §32.3). QA tool, read-only. Owned by: text role.
 *   node tools/dev/event_matrix.js [--faction f] [--event id] [--en] [--table-only] [--nodes-only] [--dead]
 * Per route and per node with `eventRoll`: the node's chapter / scene / time / text excerpt and every non-claim event whose
 * factions / excludeFactions / minChapter / `where` (scenes, notScenes, nodes, notNodes, chapter) allow it there. Flag / stat parts of
 * `where` cannot be decided statically: such events are listed with "?flag…" (they may fire on some runs). Then a table
 * event → routes → nodes. --dead lists only eventRoll nodes with no eligible event (dead rolls).
 * Loads data exactly like index.html (vm context), no engine run.
 */
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const root = path.resolve(__dirname, "..", "..");
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf("--" + k); return i < 0 ? d : (args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true); };
const EN = !!opt("en", false), ONLY_F = opt("faction", null), ONLY_E = opt("event", null);
const ctx = {console, Math, Date, JSON}; ctx.window = ctx; vm.createContext(ctx);
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const t of [...html.matchAll(/<script\s+src="([^"]+)"/g)].map((m) => m[1]).filter((s) => /^(src\/js\/registry|assets\/manifest|data\/)/.test(s))) {
  try { vm.runInContext(fs.readFileSync(path.join(root, t), "utf8"), ctx, {filename: t}); } catch (e) { console.error("load fail", t, e.message); }
}
const WH = ctx.WH;
const arr = (x) => (x === undefined || x === null ? null : [].concat(x));
const L = (x) => (x && typeof x === "object" ? (EN ? x.en : x.zh) : (x || ""));
const cut = (s, n) => { s = String(s || "").replace(/\s+/g, " "); return s.length > n ? s.slice(0, n) + "…" : s; };
const inRange = (r, v) => r === undefined || r === null || (typeof r === "number" ? v === r : ((r.min === undefined || v >= r.min) && (r.max === undefined || v <= r.max)));
const timeStr = (t) => !t ? "" : Object.entries(t).filter(([k, v]) => v && k !== "warp").map(([k, v]) => v + k).join("") + (t.warp ? "~warp" : "");

/* static part of the engine's eligibleEvents(): returns null (never) or a list of runtime conditions still open ("" = always) */
function canFire(e, fid, id, n) {
  if (e.trigger === "claim" || !e.choices || !e.choices.length) return null;
  const fs_ = e.factions || ["*"];
  if (fs_.indexOf("*") < 0 && fs_.indexOf(fid) < 0) return null;
  if ((e.excludeFactions || []).indexOf(fid) >= 0) return null;
  const ch = n.chapter;
  if ((e.minChapter || 0) > ch) return null;
  const w = e.where; if (!w) return [];
  let l;
  if ((l = arr(w.scenes)) && l.indexOf(n.scene) < 0) return null;
  if ((l = arr(w.notScenes)) && l.indexOf(n.scene) >= 0) return null;
  if ((l = arr(w.nodes)) && l.indexOf(id) < 0) return null;
  if ((l = arr(w.notNodes)) && l.indexOf(id) >= 0) return null;
  if (w.chapter !== undefined && w.chapter !== null && !inRange(w.chapter, ch)) return null;
  const open = [];
  if (w.flag) open.push("flag " + w.flag);
  if (w.notFlag) open.push("!" + w.notFlag);
  if (w.flags) open.push("flags " + [].concat(w.flags).join("+"));
  if (w.anyFlag) open.push("any " + [].concat(w.anyFlag).join("|"));
  if (w.stat || w.taint) open.push("stat");
  return open;
}

const fids = Object.keys(WH.factions).filter((f) => !ONLY_F || f === ONLY_F);
const evs = (WH.events || []).filter((e) => e.trigger !== "claim" && (!ONLY_E || e.id === ONLY_E));
const table = {};   // event → fid → [node ids]
const dead = [];
for (const fid of fids) {
  const F = WH.factions[fid];
  const rolls = Object.entries(F.nodes || {}).filter(([, n]) => n.eventRoll && !n.ending)
    .sort((a, b) => (a[1].chapter - b[1].chapter) || a[0].localeCompare(b[0], "en", {numeric: true}));
  if (!opt("table-only", false)) console.log(`\n=== ${fid} · ${rolls.length} eventRoll node(s) ===`);
  for (const [id, n] of rolls) {
    const list = [];
    for (const e of evs) {
      const c = canFire(e, fid, id, n);
      if (c === null) continue;
      list.push({e, c});
      ((table[e.id] = table[e.id] || {})[fid] = table[e.id][fid] || []).push(id + (c.length ? "?" : ""));
    }
    const always = list.filter((x) => !x.c.length).length;
    if (!list.length || (opt("dead", false) && always === 0)) dead.push(`${fid}/${id}` + (list.length ? " (only flag-gated)" : ""));
    if (opt("table-only", false) || (opt("dead", false) && always > 0)) continue;
    console.log(`\n-- ${id} · ch${n.chapter} · ${n.scene} · t=${timeStr(n.time)} · roll ${n.eventRoll}${n.gather ? " · gather" : ""}${n.speaker && n.speaker.sprite ? " · " + n.speaker.sprite : ""}${n.foe ? " · foe " + (n.foe.sprite || n.foe) : ""}`);
    console.log("   " + cut(L(n.text), EN ? 220 : 110));
    if (!list.length) console.log("   !! DEAD ROLL — no event can fire here");
    for (const {e, c} of list) {
      const w = e.where ? " where" + JSON.stringify(e.where) : "";
      console.log(`   · ${e.id.padEnd(24)} ${String(e.god).padEnd(9)} ${("[" + (e.factions || ["*"]).join(",") + "]").padEnd(22)} min${e.minChapter || 0} ${e.scene}${e.cleanse ? " cleanse" : ""}${c.length ? "  ?" + c.join(", ") : ""}${w.length > 90 ? w.slice(0, 90) + "…" : w}`);
      if (opt("text", false)) console.log("       " + cut(L(e.text), EN ? 200 : 90));
    }
  }
}
if (!opt("nodes-only", false)) {
  console.log("\n=== event → routes → nodes ('?' = flag-gated there) ===");
  for (const e of evs) {
    const t = table[e.id] || {};
    const parts = Object.entries(t).map(([f, ids]) => `${f}(${ids.length}): ${ids.join(" ")}`);
    console.log(`${e.id.padEnd(26)} ${String(e.god).padEnd(9)} ${parts.length ? "" : "— never (no eventRoll node fits)"}`);
    for (const p of parts) console.log("    " + p);
  }
}
if (dead.length) { console.log(`\nDEAD ROLLS (${dead.length}): ${dead.join(", ")}`); }
else console.log("\nno dead rolls");
