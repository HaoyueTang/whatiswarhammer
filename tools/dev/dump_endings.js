#!/usr/bin/env node
/* dump_endings.js — writes tools/art/endings_brief.json: one entry per ending node (SPEC §31), the brief the art role
 * works from and the list build_all / validate use to check that every ending has an illustration.
 *   node tools/dev/dump_endings.js [--check]   (--check: exit 1 if tools/art/endings_brief.json is stale)
 * Owned by: web. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.resolve(__dirname, "..", "..");
const ctx = {console}; ctx.window = ctx; ctx.self = ctx; vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, {filename: f});
load("src/js/registry.js"); load("assets/manifest.js");
for (const f of fs.readdirSync(path.join(ROOT, "data", "factions")).sort()) load("data/factions/" + f);
for (const f of ["data/events.js", "data/events_lore.js", "data/events_taint.js"]) load(f);
const WH = ctx.WH, out = [], seen = {};
const order = ["good", "bad", "death"];
for (const fid of Object.keys(WH.factions).sort()) {
  const F = WH.factions[fid];
  const ids = Object.keys(F.nodes).filter((id) => F.nodes[id].ending);
  ids.sort((a, b) => order.indexOf(F.nodes[a].ending.kind) - order.indexOf(F.nodes[b].ending.kind) || (a < b ? -1 : 1));
  for (const id of ids) {
    const n = F.nodes[id];
    if (seen[id]) { console.error("duplicate ending id across routes: " + id); process.exit(1); }
    seen[id] = 1;
    const claim = /end_claim_(\w+)$/.exec(id);
    out.push({
      key: "end_" + id, file: "assets/endings/" + id + ".png", faction: fid, id: id, kind: n.ending.kind,
      claim: claim ? claim[1] : null,
      title: n.ending.title, cause: n.ending.cause || null, text: n.text,
      scene: n.scene || null, speaker: n.speaker || null, foe: n.foe || null,
    });
  }
}
const json = JSON.stringify({version: 1, count: out.length, endings: out}, null, 1) + "\n";
const target = path.join(ROOT, "tools", "art", "endings_brief.json");
if (process.argv.includes("--check")) {
  const cur = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
  if (cur !== json) { console.error("tools/art/endings_brief.json is stale — run: node tools/dev/dump_endings.js"); process.exit(1); }
  console.log("endings_brief.json up to date (" + out.length + " endings)");
} else {
  fs.writeFileSync(target, json);
  const by = {}; out.forEach((e) => { by[e.faction] = (by[e.faction] || 0) + 1; });
  console.log("wrote tools/art/endings_brief.json —", out.length, "endings", JSON.stringify(by));
}
