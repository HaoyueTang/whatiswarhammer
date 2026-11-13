#!/usr/bin/env node
/* playthrough.js — print one seeded random run of a route as readable text (QA tool, no DOM).
 *   node tools/dev/playthrough.js <faction> [--seed N] [--origin <id|index>] [--en] [--stats] [--flags] [--max N] [--first|--last]
 * Uses the real engine (src/js/engine.js) and loads data exactly like index.html. Random choices unless --first / --last
 * (always pick the first / last unlocked choice). Locked choices are shown with a lock and never picked unless all are locked.
 * Prints per node: id, chapter, scene, gather tag, time, text (alt/grudge resolved), choices, the picked one and its result.
 */
const fs = require("fs"), vm = require("vm"), path = require("path");
const root = path.resolve(__dirname, "..", "..");
const args = process.argv.slice(2);
const fid = args.find((a) => !a.startsWith("--") && isNaN(+a));
const opt = (k, d) => { const i = args.indexOf("--" + k); return i < 0 ? d : (args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true); };
if (!fid) { console.log("usage: node tools/dev/playthrough.js <faction> [--seed N] [--origin id|index] [--en] [--stats] [--flags] [--max N] [--first|--last]"); process.exit(1); }
const seed = +opt("seed", 1), EN = !!opt("en", false), MAX = +opt("max", 220), SHOW_STATS = !!opt("stats", false), SHOW_FLAGS = !!opt("flags", false);
const ctx = {console, Math, Date, JSON}; ctx.window = ctx; vm.createContext(ctx);
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const t of [...html.matchAll(/<script\s+src="([^"]+)"/g)].map((m) => m[1]).filter((s) => /^(src\/js\/(registry|engine)|assets\/manifest|data\/)/.test(s))) {
  try { vm.runInContext(fs.readFileSync(path.join(root, t), "utf8"), ctx, {filename: t}); } catch (e) { console.error("load fail", t, e.message); }
}
const WH = ctx.WH, F = WH.factions[fid];
if (!F) { console.log("unknown faction", fid, Object.keys(WH.factions).join(",")); process.exit(1); }
const origins = WH.Game.origins(F);
let oi = opt("origin", 0); oi = isNaN(+oi) ? Math.max(0, origins.findIndex((o) => o.id === oi)) : (+oi % origins.length);
const L = (x) => (x && typeof x === "object" && ("zh" in x || "en" in x)) ? (EN ? x.en : x.zh) : (x || "");
const g = new WH.Game(fid, {rng: WH.RNG(seed), rumors: true});
let step = g.start(origins[oi].id);
const rnd = WH.RNG(seed * 7 + 3);
console.log(`# ${fid} · origin ${origins[oi].id} · seed ${seed} · ${EN ? "en" : "zh"}`);
for (let n = 0; n < MAX; n++) {
  if (step.kind === "event") {
    const ev = step.event || {};
    console.log(`\n[EVENT ${ev.id}] ${L(ev.text)}`);
    const ch = g.eventChoices(); ch.forEach((c, i) => console.log(`   - [${i}] ${L((c.choice || c).text)}`));
    const k = Math.floor(rnd() * ch.length); console.log("   → pick", k);
    const r = g.eventChoose(k); if (r && r.consequence && (r.consequence.text||r.consequence.result)) console.log("   ⤷", L(r.consequence.text||r.consequence.result));
    step = g.eventContinue(); continue;
  }
  const id = g.state.nodeId, node = g.node(id) || {};
  console.log(`\n### ${id} · ch${node.chapter || "?"} · ${node.scene || ""}${node.gather ? " · 〔聚集:" + L(node.gather) + "〕" : ""}${node.bridge ? " · (bridge)" : ""} · t=${JSON.stringify(node.time || {})}${node.speaker ? " · " + (node.speaker.name ? L(node.speaker.name) : (node.speaker.sprite || "")) : ""}`);
  const t = g.nodeText(); console.log(typeof t === "string" ? t : L(t));
  if (step.rumor) console.log("  ✉ 传闻:", L(step.rumor.text));
  if (step.echo) console.log("  ✝ 死讯:", typeof step.echo === "string" ? step.echo : JSON.stringify(step.echo).slice(0, 200));
  if (SHOW_STATS) console.log("  stats", JSON.stringify(g.state.stats));
  if (SHOW_FLAGS) console.log("  flags", Object.keys(g.state.flags || {}).filter((k) => g.state.flags[k]).join(","));
  if (node.ending || g.state.ended) { console.log("== ENDING =="); break; }
  const cs = g.choices(); if (!cs.length) { console.log("(no choices)"); break; }
  cs.forEach((c, i) => console.log(`   ${c.locked ? "🔒" : "-"} [${i}] ${L(c.choice && c.choice.text)}${c.roll ? " 🎲" : ""}`));
  const open = cs.map((c, i) => ({c, i})).filter((x) => !x.c.locked), pool = open.length ? open : cs.map((c, i) => ({c, i}));
  const pick = opt("first", false) ? pool[0].i : opt("last", false) ? pool[pool.length - 1].i : pool[Math.floor(rnd() * pool.length)].i;
  console.log("   → pick", pick);
  step = g.choose(pick);
  { const cq = step.consequence || {}, rt = cq.text || cq.result; if (rt) console.log("   ⤷", L(rt).slice(0, 400)); }
  if (step.roll) console.log("   🎲", JSON.stringify(step.roll).slice(0, 120));
}
