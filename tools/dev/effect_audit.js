#!/usr/bin/env node
/* effect_audit.js — does every choice's stat effect follow from what the choice and its result SAY? (SPEC §39)
 *   node tools/dev/effect_audit.js [--route <id>|--all] [--write]   (--write: docs/audit/effects/<route>.md, one table per route)
 * Per choice: label, result / roll beats, choice effects + the landing node's own effects, taint. Heuristics flag likely mismatches:
 *   INJURY   text says you are hurt (血/伤/鞭/断/烧…) but hp does not drop
 *   REST     text says you rest / eat / are treated but hp or sanity drops
 *   CALM     text says you calm down / feel safe but sanity drops
 *   HORROR   text shows horror (尸/惨叫/噩梦…) on this choice, sanity unchanged and no other cost
 *   HERESY   text is plainly heretical (献祭/邪神/低语回应…) but corruption does not rise and no taint
 *   PIOUS    text is prayer / faith in the Emperor, yet corruption rises
 *   PRAISE   text says you are praised / promoted / rewarded but renown does not rise
 *   SHAME    text says you are punished / demoted / despised but renown rises
 *   FREE     siblings carry costs, this choice carries nothing and its text promises a gain or a risk
 * Heuristics only: every flag must be read by a human (or a writer agent) before anything changes.
 */
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const root = path.resolve(__dirname, "..", "..");
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf("--" + k); return i < 0 ? null : (args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true); };
const ctx = {console, Math, Date, JSON}; ctx.window = ctx; vm.createContext(ctx);
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const t of [...html.matchAll(/<script\s+src="([^"]+)"/g)].map((m) => m[1]).filter((s) => /^(src\/js\/(registry|engine)|assets\/manifest|data\/)/.test(s))) {
  try { vm.runInContext(fs.readFileSync(path.join(root, t), "utf8"), ctx, {filename: t}); } catch (e) { console.error("load fail", t, e.message); }
}
const WH = ctx.WH;
const Z = (x) => (x && typeof x === "object" ? (x.zh || "") : (x || ""));
const STATS = ["hp", "sanity", "corruption", "renown"];

const RX = {
  injury: /流血|血流|出血|鲜血直|伤口|受伤|挨了|挨打|鞭子抽|被打|打断|骨折|断了.{0,2}(手|腿|骨|肋)|烧伤|烫伤|灼伤|擦伤|划开|割开|咬住|咬伤|撕开|刺进|捅进|中弹|打中你|砸中你|疼得|痛得|剧痛|wound|bleed|broken (arm|leg|rib)/,
  rest: /睡了一觉|睡着了|好好睡|休息了|歇了|吃饱|喝饱|热汤|包扎|缝合|止血|治好|上了药|退烧|喘过气|slept|you rest|bandage|stitched/,
  calm: /平静下来|安心|松了口气|心里踏实|不再害怕|镇定下来|稳住了心|好受些|feel calm|at ease|relieved/,
  horror: /尸体|死尸|惨叫|尖叫|噩梦|腐烂|开膛|内脏|吊着的|骷髅|疯了|发疯|scream|corpse|nightmare|rotting/,
  heresy: /献祭|邪神|黑暗诸神|混沌诸神|回应了低语|答应了.{0,4}声音|签下.{0,4}契约|亵渎|异端仪式|血祭|sacrifice|dark gods|ruinous/,
  pious: /向帝皇祈祷|祈祷|念祷|祷文|圣像|帝皇保佑|圣徽|pray|the Emperor protects/,
  praise: /表彰|嘉奖|提拔|升你|升为|晋升|记功|赏你|奖赏|奖励|点头认可|夸你|称赞|promoted|commend|reward/,
  shame: /降级|撤职|记过|鞭刑|罚你|惩罚|鄙视|唾弃|除名|当众羞辱|demoted|punish|disgrace/,
};
function sum(a, b) { const o = {}; for (const k of STATS) o[k] = (+((a || {})[k]) || 0) + (+((b || {})[k]) || 0); return o; }
function fmt(e, taint) {
  const s = STATS.filter((k) => e[k]).map((k) => ({hp: "命", sanity: "智", corruption: "腐", renown: "望"}[k] + (e[k] > 0 ? "+" : "") + e[k])).join(" ");
  const t = taint && Object.keys(taint).length ? " 染" + Object.entries(taint).map(([g, v]) => g[0] + v).join(",") : "";
  return (s || "—") + t;
}
function auditRoute(F) {
  const nodes = F.nodes || {}, rows = [], flags = {};
  for (const [id, n] of Object.entries(nodes)) {
    const cs = n.choices || [];
    const infos = cs.map((c, i) => {
      const outs = [];
      if (c.roll) {
        for (const k of ["success", "fail"]) {
          const tn = nodes[c.roll[k]], beat = c.rollResult && c.rollResult[k];
          outs.push({tag: k === "success" ? "成" : "败", text: Z(beat) + " " + Z(tn && tn.text).slice(0, 40), e: sum(c.effects, tn && tn.effects), taint: Object.assign({}, c.effects && c.effects.taint, tn && tn.effects && tn.effects.taint)});
        }
      } else {
        const tn = nodes[c.next];
        outs.push({tag: "", text: Z(c.result), e: sum(c.effects, tn && tn.effects), taint: Object.assign({}, c.effects && c.effects.taint)});
      }
      return {i, c, outs};
    });
    const anyCost = infos.some((x) => x.outs.some((o) => STATS.some((k) => o.e[k])));
    for (const x of infos) {
      for (const o of x.outs) {
        const txt = Z(x.c.text) + " ｜ " + o.text, e = o.e, hasTaint = Object.keys(o.taint || {}).length > 0, f = [];
        if (RX.injury.test(o.text) && !(e.hp < 0)) f.push("INJURY");
        if (RX.rest.test(o.text) && (e.hp < 0 || e.sanity < 0)) f.push("REST");
        if (RX.calm.test(o.text) && e.sanity < 0) f.push("CALM");
        if (RX.horror.test(o.text) && !e.sanity && !STATS.some((k) => e[k])) f.push("HORROR");
        if (RX.heresy.test(txt) && !(e.corruption > 0) && !hasTaint && F.id !== "chaos") f.push("HERESY");
        if (RX.pious.test(txt) && e.corruption > 0) f.push("PIOUS");
        if (RX.praise.test(o.text) && !(e.renown > 0)) f.push("PRAISE");
        if (RX.shame.test(o.text) && e.renown > 0) f.push("SHAME");
        if (anyCost && !STATS.some((k) => e[k]) && !hasTaint && /(拿|偷|抢|领|赚|换来|得到|冲|闯|拼|赌)/.test(Z(x.c.text))) f.push("FREE");
        f.forEach((k) => { flags[k] = (flags[k] || 0) + 1; });
        rows.push({id, i: x.i, tag: o.tag, label: Z(x.c.text), text: o.text.replace(/\s+/g, " ").trim(), eff: fmt(e, o.taint), flags: f, chapter: n.chapter, pov: !!n.pov});
      }
    }
  }
  return {rows, flags};
}
const routes = opt("route") ? [opt("route")] : Object.keys(WH.factions);
const outDir = path.join(root, "docs", "audit", "effects");
if (opt("write")) fs.mkdirSync(outDir, {recursive: true});
let total = 0;
for (const r of routes) {
  const F = WH.faction ? WH.faction(r) : WH.factions[r];
  if (!F) { console.log("unknown route", r); continue; }
  const {rows, flags} = auditRoute(F), flagged = rows.filter((x) => x.flags.length);
  total += flagged.length;
  console.log(`${r.padEnd(11)} ${String(rows.length).padStart(4)} outcomes · ${flagged.length} flagged · ` + Object.entries(flags).map(([k, v]) => `${k} ${v}`).join(" · "));
  if (opt("write")) {
    const md = [`# Effect audit — ${r} (${new Date().toISOString().slice(0, 10)})`, "", "命=hp 智=sanity 腐=corruption 望=renown 染=taint · effects = choice + landing node. ⚑ = heuristic flag (SPEC §39).", "",
      "| node | # | label | result / beat | effects | ⚑ |", "|---|---|---|---|---|---|"];
    for (const x of rows) md.push(`| ${x.id}${x.pov ? " (pov)" : ""} | ${x.i}${x.tag} | ${x.label.replace(/\|/g, "/")} | ${x.text.slice(0, 70).replace(/\|/g, "/")} | ${x.eff} | ${x.flags.join(" ")} |`);
    fs.writeFileSync(path.join(outDir, r + ".md"), md.join("\n") + "\n");
  }
}
console.log(`total flagged outcomes: ${total}`);
