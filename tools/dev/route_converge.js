#!/usr/bin/env node
/* route_converge.js — finds "cosmetic choices" and abrupt jumps in a route (story overhaul, SPEC §32). Owned by: web.
 *   node tools/dev/route_converge.js --faction imperium [--md]      summary (+ per-node lists with --md)
 *   node tools/dev/route_converge.js --all                          one summary line per route
 * The measures live in tools/dev/story_lib.js (shared with validate.js, which gates them):
 *  (1) FALSE CHOICE nodes — ≥2 choices that all lead to the same next node AND set no distinct flag that is read later (alt / resultAlt /
 *      require / grudge / event where / rumour / achievement); (2) SHALLOW BRANCHES — sibling targets that re-merge within ≤1 step AND no read flag tells the choices apart;
 *  (3) FORCED CHAPTER STEPS — a node whose choices all lead to ONE node of a later chapter that is not a `bridge:true` node;
 *  (4) HARD JUMPS — edges where the scene changes AND time jumps (≥3 days / years / warp) or the chapter advances; justified when the target
 *      is a `bridge` / `jump` node (or the source carries `jump`). */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const L = require("./story_lib.js");
const ROOT = path.resolve(__dirname, "..", "..");
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d; };
const ctx = {console}; ctx.window = ctx; ctx.self = ctx; vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, {filename: f});
const tryLoad = (f) => { try { load(f); } catch (e) { /* optional */ } };
load("src/js/registry.js"); load("assets/manifest.js");
for (const f of ["data/events.js", "data/events_taint.js", "data/events_lore.js", "data/rumors.js"]) tryLoad(f);
for (const f of fs.readdirSync(path.join(ROOT, "data", "factions")).sort()) load("data/factions/" + f);
tryLoad("data/achievements.js");
const WH = ctx.WH, ALL = ["imperium", "chaos", "tau", "aeldari", "necrons", "orks", "gsc", "mechanicus"].filter((f) => WH.factions[f]);
const pc = (a, b) => Math.round(100 * a / Math.max(1, b)) + "%";
if (argv.includes("--all")) {
  ALL.forEach((f) => { const a = L.storyMetrics(WH, f);
    console.log(f.padEnd(11), "nodes", String(a.nodes).padStart(3), "| multi-choice", String(a.multi).padStart(3), "| false-choice", String(a.falseChoice.length).padStart(3), "(" + pc(a.falseChoice.length, a.multi) + ")",
      "| own follow-up", pc(a.choicesOwnFollowUp, a.choicesTotal), "| shallow", a.shallow.length + "/" + a.branching, "| forced chapter steps", a.forced.length, "| hard jumps", a.hard.length, "(unjustified " + a.hardUnjustified.length + ")",
      "| bridges", a.bridges.length, "| never-read flags", a.neverRead.length); });
  process.exit(0);
}
const fid = arg("--faction", null); if (!fid || !WH.factions[fid]) { console.error("usage: --faction <id> [--md] | --all"); process.exit(2); }
const a = L.storyMetrics(WH, fid), out = [];
out.push("# Convergence report: " + fid);
out.push("");
out.push("- nodes: " + a.nodes + "; nodes with ≥2 choices: " + a.multi + "; branching nodes (≥2 different targets): " + a.branching);
out.push("- **false-choice nodes** (all choices → same next node and no distinct read flag): " + a.falseChoice.length + " (" + pc(a.falseChoice.length, a.multi) + " of multi-choice nodes; SPEC §32.1 rule 1: warn > 5 %, error > 10 %)" + (a.falseByFlagOnly ? " — plus " + a.falseByFlagOnly + " same-target nodes saved by a distinct read flag" : ""));
out.push("- choices that have their own follow-up node (not shared with a sibling): " + a.choicesOwnFollowUp + "/" + a.choicesTotal + " (" + pc(a.choicesOwnFollowUp, a.choicesTotal) + ")");
out.push("- shallow branches (siblings re-merge within ≤1 step AND no read flag distinguishes the choices): " + a.shallow.length + " (" + pc(a.shallow.length, a.branching) + " of branching nodes; limit 20 %)");
out.push("- INFO branches re-merging after ≤1 own node: " + a.rejoin1.length + "/" + a.branching + ", of which flag-echoed: " + a.rejoin1Echoed.length);
out.push("- forced chapter steps (a node whose choices all lead to one non-bridge node of a LATER chapter): " + a.forced.length + " (limit 0)");
out.push("- hard jumps (scene change + big time or chapter advance): " + a.hard.length + ", unjustified " + a.hardUnjustified.length + " (limit 3; justify with `bridge:true` / `jump:{zh,en}`)");
out.push("- bridges: " + a.bridges.length + " · marked jumps: " + a.jumps.length + " · alt nodes: " + a.altNodes + " · resultAlt choices: " + a.resultAlt);
out.push("- flags set and never read: " + a.neverRead.length + " (limit 3)");
out.push("");
out.push("## False-choice nodes"); out.push(a.falseChoice.join(", ") || "none");
out.push(""); out.push("## Shallow branches"); out.push(a.shallow.join(", ") || "none");
out.push(""); out.push("## INFO: re-merge within ≤1 step but flag-echoed (not shallow)"); out.push(a.rejoin1Echoed.join(", ") || "none");
out.push(""); out.push("## Forced chapter steps"); out.push(a.forced.join("\n") || "none");
out.push(""); out.push("## Hard jumps (edge: scene/time/chapter change)"); out.push(a.hard.map((h) => (a.hardUnjustified.includes(h) ? "UNJUSTIFIED " : "ok          ") + h).join("\n") || "none");
out.push(""); out.push("## Flags set and never read"); out.push(a.neverRead.join(", ") || "none");
console.log(out.join("\n"));
