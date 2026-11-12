#!/usr/bin/env node
/* route_converge.js — finds "cosmetic choices" and abrupt jumps in a route (story overhaul, SPEC §32). Owned by: web.
 *   node tools/dev/route_converge.js --faction imperium [--md]      summary (+ per-node markdown with --md)
 *   node tools/dev/route_converge.js --all                          one summary line per route
 * Measures: (1) FALSE CHOICE nodes — every choice of the node leads to the same next node (the choice changes only a result line);
 * (2) SHALLOW BRANCHES — sibling targets that re-merge within ≤1 step (the branch has no follow-up of its own);
 * (3) FORCED CHAPTER STEPS — an edge that crosses into a later chapter from a node whose choices all lead to the same target, i.e. the
 *     story advances a whole phase whatever the player did; (4) HARD JUMPS — edges where the scene changes AND time jumps (d≥3 / y≥1 / warp)
 *     or the chapter advances, with no bridging node between (the next node's text is the first the player sees of the new situation). */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.resolve(__dirname, "..", "..");
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d; };
const ctx = {console}; ctx.window = ctx; ctx.self = ctx; vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, {filename: f});
load("src/js/registry.js"); load("assets/manifest.js");
for (const f of fs.readdirSync(path.join(ROOT, "data", "factions")).sort()) load("data/factions/" + f);
function analyse(fid) {
  const F = ctx.WH.factions[fid], N = F.nodes, ids = Object.keys(N);
  const targets = (n) => (n.choices || []).map((c) => c.roll ? [c.roll.success, c.roll.fail] : [c.next]);
  const succ = (id) => { const s = new Set(); targets(N[id]).forEach((t) => t.forEach((x) => x && N[x] && s.add(x))); return [...s]; };
  const depthsFrom = (start, max) => { const d = {}; d[start] = 0; let fr = [start]; for (let k = 1; k <= max; k++) { const nx = []; fr.forEach((a) => succ(a).forEach((b) => { if (d[b] === undefined) { d[b] = k; nx.push(b); } })); fr = nx; } return d; };
  const falseChoice = [], shallow = [], forcedChap = [], hard = [];
  let multi = 0, cos = 0, choicesTotal = 0, choicesDistinct = 0;
  ids.forEach((id) => {
    const n = N[id]; if (n.ending || !(n.choices || []).length) return;
    const ts = targets(n), flat = [].concat(...ts).filter(Boolean), uniq = [...new Set(flat)];
    const nch = n.choices.length;
    if (nch >= 2) {
      multi++;
      choicesTotal += nch;
      if (uniq.length === 1) { cos++; falseChoice.push(id); }
      /* choices whose target is shared by a sibling are 'cosmetic' */
      n.choices.forEach((c, i) => { const mine = c.roll ? [c.roll.success, c.roll.fail] : [c.next]; const others = [].concat(...ts.filter((_, j) => j !== i)); if (!mine.every((m) => others.indexOf(m) >= 0)) choicesDistinct++; });
    }
    if (uniq.length >= 2) {
      /* re-merge depth of the branches */
      const ds = uniq.map((u) => depthsFrom(u, 4));
      let best = 99;
      Object.keys(ds[0]).forEach((x) => { const all = ds.every((d) => d[x] !== undefined); if (all) best = Math.min(best, Math.max.apply(null, ds.map((d) => d[x]))); });
      if (best <= 1) shallow.push(id + "(rejoin@" + best + ")");
    }
    uniq.forEach((t) => {
      const m = N[t]; if (!m) return;
      const dc = (m.chapter || 0) - (n.chapter || 0);
      const mt = m.time || {}, bigT = (mt.d || 0) >= 3 || (mt.y || 0) >= 1 || mt.warp;
      if (dc >= 1 && uniq.length === 1) forcedChap.push(id + "→" + t + "(ch" + n.chapter + "→" + m.chapter + ")");
      if ((n.scene !== m.scene && bigT) || dc >= 1) hard.push(id + "→" + t + "(" + (n.scene !== m.scene ? n.scene + "→" + m.scene : "same scene") + (bigT ? ", time " + JSON.stringify(mt) : "") + (dc >= 1 ? ", ch" + n.chapter + "→" + m.chapter : "") + ")");
    });
  });
  return {fid, nodes: ids.length, multi, cos, shallow, forcedChap, hard, falseChoice, choicesTotal, choicesDistinct};
}
const ALL = ["imperium", "chaos", "tau", "aeldari", "necrons", "orks", "gsc", "mechanicus"];
if (argv.includes("--all")) {
  ALL.forEach((f) => { const a = analyse(f); console.log(f.padEnd(11), "nodes", String(a.nodes).padStart(3), "| multi-choice nodes", String(a.multi).padStart(3), "| false-choice nodes", String(a.cos).padStart(3), "(" + Math.round(100 * a.cos / Math.max(1, a.multi)) + "%)", "| choices with own follow-up", Math.round(100 * a.choicesDistinct / Math.max(1, a.choicesTotal)) + "%", "| shallow-branch nodes", a.shallow.length, "| forced chapter steps", a.forcedChap.length, "| hard jumps", a.hard.length); });
  process.exit(0);
}
const fid = arg("--faction", null); if (!fid) { console.error("usage: --faction <id> [--md] | --all"); process.exit(2); }
const a = analyse(fid), L = [];
L.push("# Convergence report: " + fid);
L.push("");
L.push("- nodes: " + a.nodes + "; nodes with ≥2 choices: " + a.multi);
L.push("- **false-choice nodes** (all choices → same next node; choice changes only a result line): " + a.cos + " (" + Math.round(100 * a.cos / Math.max(1, a.multi)) + "% of multi-choice nodes)");
L.push("- choices that have their own follow-up node (not shared with a sibling): " + a.choicesDistinct + "/" + a.choicesTotal + " (" + Math.round(100 * a.choicesDistinct / Math.max(1, a.choicesTotal)) + "%)");
L.push("- shallow branches (siblings re-merge within ≤1 step, i.e. the branch has no follow-up scene of its own): " + a.shallow.length);
L.push("- forced chapter steps (a node whose choices all lead to one node in a LATER chapter): " + a.forcedChap.length);
L.push("- hard jumps (chapter advances, or scene change + big time jump, along an edge): " + a.hard.length);
L.push("");
L.push("## False-choice nodes"); L.push(a.falseChoice.join(", ") || "none");
L.push(""); L.push("## Shallow branches"); L.push(a.shallow.join(", ") || "none");
L.push(""); L.push("## Forced chapter steps"); L.push(a.forcedChap.join("\n") || "none");
L.push(""); L.push("## Hard jumps (edge: scene/time/chapter change)"); L.push(a.hard.join("\n") || "none");
console.log(L.join("\n"));
