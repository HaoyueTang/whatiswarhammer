#!/usr/bin/env node
/* tools/dev/date_audit.js — do the dates written in node text agree with the game clock?
 * For every node whose zh/en text contains an Imperial date (e.g. "112.M42"), compute from the node graph the earliest and
 * latest clock date a player can arrive with (warp nodes use ×0.4–×3.0). Text date inside the window = ok; earlier than the
 * clock = past reference ("lost 113.M42"), fine; later than the clock = anachronism (the story names a date that has not
 * come yet) — reported, exit code 1.
 * Usage: node tools/dev/date_audit.js [--faction id] [--all]    (--all also lists ok / past nodes) */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.resolve(__dirname, "..", "..");
const args = process.argv.slice(2);
const only = args.includes("--faction") ? args[args.indexOf("--faction") + 1] : null;
const ALL = args.includes("--all");
const HPY = 8760;

const ctx = vm.createContext({console: {log() {}, warn() {}, error() {}}, Math, Date, JSON, Object, Array});
ctx.window = ctx;
function load(rel) { try { vm.runInContext(fs.readFileSync(path.join(ROOT, rel), "utf8"), ctx, {filename: rel}); } catch (e) { console.error("load " + rel + ": " + e.message); } }
load("src/js/registry.js");
load("data/sector.js");
fs.readdirSync(path.join(ROOT, "data/factions")).sort().forEach((f) => load("data/factions/" + f));
const WH = ctx.WH;

const th = (t) => t ? (+t.h || 0) + (+t.d || 0) * 24 + (+t.w || 0) * 168 + (+t.y || 0) * HPY : 0;
const absYear = (d) => (d.mill || 42) * 1000 + (d.year || 0) + ((d.day || 1) - 1) / 365;
const fmt = (a) => { const m = Math.floor(a / 1000), y = Math.floor(a - m * 1000); return ("00" + y).slice(-3) + ".M" + m; };
const DATE_RE = /(\d{1,3})\.M(\d{2})/g;

function textsOf(n) {
  const out = [];
  const push = (o) => { if (!o) return; ["zh", "en"].forEach((k) => { if (o[k]) out.push(o[k]); }); };
  push(n.text); push(n.title);
  (n.choices || []).forEach((c) => { push(c.result); push(c.rollResult && (c.rollResult.success || c.rollResult)); });
  return out;
}
function datesIn(n) {
  const set = new Set();
  textsOf(n).forEach((s) => { let m; DATE_RE.lastIndex = 0; while ((m = DATE_RE.exec(String(s)))) set.add(m[1] + ".M" + m[2]); });
  return [...set];
}

let problems = 0, found = 0;
Object.values(WH.factions || {}).forEach((f) => {
  if (only && f.id !== only) return;
  const nodes = f.nodes || {};
  const start = f.startDate || {year: 111, mill: 42};
  const t0 = absYear(start) * HPY;                       // hours on an absolute scale
  const lo = {}, hi = {};
  const seeds = [f.startNode].concat((f.origins || []).map((o) => o.startNode)).filter(Boolean);
  const succ = (id) => { const o = []; ((nodes[id] || {}).choices || []).forEach((c) => (c.roll ? [c.roll.success, c.roll.fail] : [c.next]).forEach((t) => { if (t && nodes[t]) o.push(t); })); return o; };
  /* DFS from the starts: drop back edges (cycles), then relax in topological order → earliest / latest arrival */
  const state = {}, order = [], back = new Set();
  const dfs = (root) => {
    const stack = [[root, succ(root), 0]]; state[root] = 1;
    while (stack.length) {
      const top = stack[stack.length - 1];
      if (top[2] < top[1].length) {
        const t = top[1][top[2]++];
        if (state[t] === 1) back.add(top[0] + ">" + t);
        else if (!state[t]) { state[t] = 1; stack.push([t, succ(t), 0]); }
      } else { state[top[0]] = 2; order.push(top[0]); stack.pop(); }
    }
  };
  seeds.forEach((s0) => { if (!state[s0]) dfs(s0); });
  const arrive = (id, a, b) => {
    const n = nodes[id];
    const add = th(n.time), fa = n.time && n.time.warp ? 0.4 : 1, fb = n.time && n.time.warp ? 3.0 : 1;
    let na = a + add * fa, nb = b + add * fb;
    if (n.date) { const ah = absYear(n.date) * HPY; na = Math.max(na, ah); nb = Math.max(nb, ah); }
    return [na, nb];
  };
  seeds.forEach((s0) => { const r = arrive(s0, t0, t0); lo[s0] = Math.min(lo[s0] === undefined ? 1e18 : lo[s0], r[0]); hi[s0] = Math.max(hi[s0] === undefined ? -1 : hi[s0], r[1]); });
  order.slice().reverse().forEach((id) => {
    if (lo[id] === undefined) return;
    succ(id).forEach((t) => {
      if (back.has(id + ">" + t)) return;
      const r = arrive(t, lo[id], hi[id]);
      lo[t] = Math.min(lo[t] === undefined ? 1e18 : lo[t], r[0]);
      hi[t] = Math.max(hi[t] === undefined ? -1 : hi[t], r[1]);
    });
  });
  Object.keys(nodes).forEach((id) => {
    const n = nodes[id], ds = datesIn(n);
    if (!ds.length || lo[id] === undefined) return;
    found++;
    ds.forEach((d) => {
      const m = /(\d{1,3})\.M(\d{2})/.exec(d), a = absYear({year: +m[1], mill: +m[2]});
      const cl = lo[id] / HPY, ch = hi[id] / HPY;
      /* a text date earlier than the clock is a past reference ("lost 113.M42", "Cadia, 999.M41") and is fine;
       * a text date LATER than the latest possible clock is an anachronism (the story names a date that has not come yet) */
      const kind = a > Math.floor(ch) ? "LATE" : a < Math.floor(cl) ? "past" : "ok  ";
      if (kind === "LATE") problems++;
      if (kind === "LATE" || ALL) console.log(`${kind} ${f.id}/${id}  text ${d}  clock ${fmt(cl)} … ${fmt(ch)}${n.date ? "  anchor " + fmt(absYear(n.date)) : ""}`);
    });
  });
});
console.log(`\ndate audit: ${found} node(s) with a dated text, ${problems} anachronism(s)`);
process.exit(problems ? 1 : 0);
