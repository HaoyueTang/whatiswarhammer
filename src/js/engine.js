/* engine.js — pure game state machine & rules (SPEC §3, §5, §8). Owned by: web.
 * NO DOM access here: tools/dev/validate.js runs this file inside a Node vm context.
 *
 * Usage:
 *   var g = new WH.Game("imperium", {rng: WH.RNG(1234)});
 *   var step = g.start();            // enters faction.startNode
 *   g.choices();                     // visible choices with lock / roll info
 *   step = g.choose(0);              // -> step {kind:"node"|"event", ...}
 *   if (step.kind === "event") { var r = g.eventChoose(1); step = g.eventContinue(); }
 *   g.toRecord() / WH.Game.fromRecord(rec)
 */
(function (root) {
  var WH = root.WH = root.WH || {};

  var STATS = ["hp", "sanity", "corruption", "renown"];
  var HOURS_PER_YEAR = 8760;
  var WARP_MIN = 0.4, WARP_MAX = 3.0;
  var HISTORY_MAX = 30;

  /* ---------- seedable RNG (mulberry32) ---------- */
  function RNG(seed) {
    var s = (seed === undefined || seed === null) ? (Date.now() ^ 0x5bd1e995) >>> 0 : (seed >>> 0);
    var f = function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    f.getState = function () { return s; };
    f.setState = function (v) { s = v >>> 0; };
    return f;
  }

  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
  function has(o, k) { return o && Object.prototype.hasOwnProperty.call(o, k); }

  /* ---------- pure helpers (exported for UI + validator) ---------- */
  function rollChance(roll, stats) {
    var p = +roll.p;
    if (isNaN(p)) p = 0.5;
    if (roll.stat && stats && typeof stats[roll.stat] === "number") {
      return clamp(p + (stats[roll.stat] - 50) / 200, 0.05, 0.95);
    }
    return p;
  }

  function requireOK(req, state) {
    if (!req) return true;
    if (Array.isArray(req)) { for (var i = 0; i < req.length; i++) if (!requireOK(req[i], state)) return false; return true; }
    if (has(req, "flag") && !state.flags[req.flag]) return false;
    if (has(req, "notFlag") && state.flags[req.notFlag]) return false;
    if (req.stat) {
      var v = state.stats[req.stat];
      if (typeof v !== "number") v = 0;
      if (req.min !== undefined && req.min !== null && v < req.min) return false;
      if (req.max !== undefined && req.max !== null && v > req.max) return false;
    }
    return true;
  }

  function timeHours(t) {
    if (!t) return 0;
    return (+t.h || 0) + (+t.d || 0) * 24 + (+t.w || 0) * 168 + (+t.y || 0) * HOURS_PER_YEAR;
  }

  /* Imperial-style date parts from internal hours. year = startDate.year + floor(hours/8760), millennium rollover. */
  function dateParts(hours, startDate) {
    startDate = startDate || {year: 111, mill: 42};
    hours = Math.max(0, Math.floor(hours || 0));
    var yearsPassed = Math.floor(hours / HOURS_PER_YEAR);
    var y = (startDate.year || 0) + yearsPassed;
    var mill = (startDate.mill || 42) + Math.floor(y / 1000);
    y = y % 1000;
    var inYear = hours % HOURS_PER_YEAR;
    return {year: y, mill: mill, day: Math.floor(inYear / 24) + 1, hour: inYear % 24,
            yearStr: ("00" + y).slice(-3), hourStr: ("0" + (inYear % 24)).slice(-2) + ":00"};
  }

  function startHours(faction) {
    var sd = faction.startDate || {};
    var day = sd.day || 1, hour = (sd.hour !== undefined) ? sd.hour : 6;
    return (day - 1) * 24 + hour;
  }

  /* fallback death node used only if data is missing one (validator reports it as an error) */
  function syntheticDeath(cause) {
    var t = {
      hp: {zh: "你的身体终于撑不住了。黑暗温柔地合拢。", en: "Your body finally gives out. The dark closes in, almost gently."},
      sanity: {zh: "低语填满了一切。你再也想不起自己的名字。", en: "The whispers fill everything. You can no longer recall your own name."},
      corruption: {zh: "血肉扭曲、绽开。你成了诸神的玩物。", en: "Flesh twists and blooms. You are now a plaything of the gods."}
    }[cause] || {zh: "终。", en: "The end."};
    return {chapter: null, scene: "warp", speaker: null, text: t,
            ending: {kind: "death", title: {zh: "死亡", en: "Death"}}, _synthetic: true};
  }

  /* ---------- Game ---------- */
  function Game(factionId, opts) {
    opts = opts || {};
    this.data = opts.data || WH;
    this.rng = opts.rng || Math.random;
    this.faction = this.data.factions[factionId];
    if (!this.faction) throw new Error("Unknown faction: " + factionId);
    this.state = null;
  }

  Game.STATS = STATS;

  Game.prototype.freshState = function () {
    var f = this.faction, ss = f.startStats || {};
    return {
      faction: f.id, nodeId: null, chapter: 1,
      stats: {hp: ss.hp !== undefined ? ss.hp : 100, sanity: ss.sanity !== undefined ? ss.sanity : 100,
              corruption: ss.corruption || 0, renown: ss.renown || 0},
      runId: Date.now().toString(36) + Math.floor(Math.random() * 1e8).toString(36),
      flags: {}, codex: [], seenEvents: [], hours: startHours(f),
      pendingEvent: null, pendingNext: null, eventChoice: null, eventDeath: null,
      deathPending: null, history: [], visits: 0, playMs: 0, ended: false
    };
  };

  Game.prototype.node = function (id) {
    if (id === undefined) id = this.state && this.state.nodeId;
    if (id && id.indexOf("__death_") === 0) return syntheticDeath(id.slice(8));
    var n = this.faction.nodes && this.faction.nodes[id];
    if (!n) throw new Error("Missing node: " + id);
    return n;
  };

  Game.prototype.event = function (id) {
    var evs = this.data.events || [];
    for (var i = 0; i < evs.length; i++) if (evs[i].id === id) return evs[i];
    return null;
  };

  Game.prototype.start = function () {
    this.state = this.freshState();
    var step = newStep();
    return this._enter(this.faction.startNode, step);
  };

  function newStep() {
    return {kind: "node", nodeId: null, choiceDeltas: {}, nodeDeltas: {}, deltas: {},
            time: null, chapterChanged: false, fromChapter: null, codexNew: [],
            roll: null, death: null, ending: null, event: null, deathPending: null};
  }

  /* apply {hp,sanity,corruption,renown,set,unset}; returns actual (clamped) deltas */
  Game.prototype._applyEffects = function (eff, into) {
    var d = {};
    if (!eff) return d;
    var st = this.state.stats;
    for (var i = 0; i < STATS.length; i++) {
      var k = STATS[i];
      if (typeof eff[k] === "number" && eff[k] !== 0) {
        var before = st[k];
        st[k] = clamp(before + eff[k], 0, 100);
        if (st[k] !== before) d[k] = st[k] - before;
        if (into) into[k] = (into[k] || 0) + (st[k] - before);
      }
    }
    if (eff.set) for (var f in eff.set) this.state.flags[f] = eff.set[f];
    if (eff.unset) for (var j = 0; j < eff.unset.length; j++) delete this.state.flags[eff.unset[j]];
    return d;
  };

  Game.prototype._unlock = function (ids, step) {
    if (!ids) return;
    if (typeof ids === "string") ids = [ids];
    for (var i = 0; i < ids.length; i++) {
      if (this.state.codex.indexOf(ids[i]) < 0) {
        this.state.codex.push(ids[i]);
        if (step) step.codexNew.push(ids[i]);
      }
    }
  };

  /* SPEC §3: hp → sanity → corruption */
  Game.prototype.deathCause = function () {
    var s = this.state.stats;
    if (s.hp <= 0) return "hp";
    if (s.sanity <= 0) return "sanity";
    if (s.corruption >= 100) return "corruption";
    return null;
  };

  Game.prototype.deathNodeId = function (cause) {
    var dn = this.faction.deathNodes || {};
    var id = dn[cause];
    if (id && this.faction.nodes && this.faction.nodes[id]) return id;
    return "__death_" + cause;
  };

  Game.prototype._enter = function (id, step) {
    var node = this.node(id), st = this.state;
    step.nodeId = id;
    st.nodeId = id;
    st.deathPending = null;
    st.history.push(id);
    if (st.history.length > HISTORY_MAX) st.history.shift();
    st.visits++;
    if (typeof node.chapter === "number" && node.chapter !== st.chapter) {
      step.chapterChanged = true;
      step.fromChapter = st.chapter;
      st.chapter = node.chapter;
    }
    if (st.visits === 1) step.chapterChanged = true;          // show first chapter card
    if (node.time) {
      var base = timeHours(node.time), factor = 1;
      if (node.time.warp) factor = WARP_MIN + this.rng() * (WARP_MAX - WARP_MIN);
      var added = Math.max(base > 0 ? 1 : 0, Math.round(base * factor));
      if (added > 0) {
        step.time = {from: st.hours, to: st.hours + added, added: added, base: base, warp: !!node.time.warp, factor: factor};
        st.hours += added;
      }
    }
    step.nodeDeltas = this._applyEffects(node.effects, step.deltas);
    this._unlock(node.codex, step);
    if (node.ending) {
      st.ended = true;
      step.ending = node.ending;
    } else {
      var cause = this.deathCause();
      if (cause) {
        st.deathPending = cause;
        step.deathPending = cause;
      }
    }
    return step;
  };

  /* Visible choices. Each: {index, choice, locked, roll:{pEff,stat}|null, forced, fallback} */
  Game.prototype.choices = function () {
    var st = this.state;
    if (!st || st.ended) return [];
    if (st.deathPending) return [{index: 0, forced: true, death: st.deathPending, locked: false, choice: null}];
    var node = this.node(), out = [], list = node.choices || [];
    for (var i = 0; i < list.length; i++) {
      var c = list[i], ok = requireOK(c.require, st);
      if (!ok && c.hideIfLocked) continue;
      out.push({index: i, choice: c, locked: !ok,
                roll: c.roll ? {pEff: rollChance(c.roll, st.stats), stat: c.roll.stat || null} : null});
    }
    var anyOpen = false;
    for (var j = 0; j < out.length; j++) if (!out[j].locked) anyOpen = true;
    if (!anyOpen) {
      // softlock guard (validator reports this as a data error): open the last listed choice
      if (out.length) { out[out.length - 1].locked = false; out[out.length - 1].fallback = true; }
      else if (list.length) out.push({index: list.length - 1, choice: list[list.length - 1], locked: false, fallback: true,
                                      roll: list[list.length - 1].roll ? {pEff: rollChance(list[list.length - 1].roll, st.stats)} : null});
    }
    return out;
  };

  /* i = position in this.choices() */
  Game.prototype.choose = function (i) {
    var st = this.state;
    if (!st || st.ended || st.pendingEvent) return null;
    var vis = this.choices(), v = vis[i];
    if (!v || v.locked) return null;
    var step = newStep();
    if (v.forced) {
      step.death = st.deathPending;
      return this._enter(this.deathNodeId(st.deathPending), step);
    }
    var c = v.choice;
    step.choiceDeltas = this._applyEffects(c.effects, step.deltas);
    this._unlock(c.codex, step);
    var cause = this.deathCause();
    if (cause) { step.death = cause; return this._enter(this.deathNodeId(cause), step); }
    var target = c.next;
    if (c.roll) {
      var p = rollChance(c.roll, st.stats), r = this.rng(), ok = r < p;
      step.roll = {pEff: p, success: ok, stat: c.roll.stat || null};
      target = ok ? c.roll.success : c.roll.fail;
    }
    return this._goTo(target, step);
  };

  Game.prototype.eligibleEvents = function (chapter) {
    var out = [], evs = this.data.events || [], st = this.state;
    for (var i = 0; i < evs.length; i++) {
      var e = evs[i];
      if (st.seenEvents.indexOf(e.id) >= 0) continue;
      var fs = e.factions || ["*"];
      if (fs.indexOf("*") < 0 && fs.indexOf(st.faction) < 0) continue;
      if ((e.minChapter || 0) > chapter) continue;
      if (!e.choices || !e.choices.length) continue;
      out.push(e);
    }
    return out;
  };

  Game.prototype._goTo = function (target, step) {
    var node = this.node(target);
    if (node.eventRoll && !node.ending && this.rng() < node.eventRoll) {
      var ch = typeof node.chapter === "number" ? node.chapter : this.state.chapter;
      var pool = this.eligibleEvents(ch);
      if (pool.length) {
        var e = pool[Math.floor(this.rng() * pool.length)];
        var st = this.state;
        st.pendingEvent = e.id; st.pendingNext = target; st.eventChoice = null; st.eventDeath = null;
        st.seenEvents.push(e.id);
        step.kind = "event"; step.event = e; step.nodeId = target;
        return step;
      }
    }
    return this._enter(target, step);
  };

  Game.prototype.currentEvent = function () {
    return this.state && this.state.pendingEvent ? this.event(this.state.pendingEvent) : null;
  };

  /* choose an option inside the pending event. Returns {result, deltas, codexNew, death} */
  Game.prototype.eventChoose = function (i) {
    var st = this.state, e = this.currentEvent();
    if (!e || st.eventChoice !== null) return null;
    var c = e.choices[i];
    if (!c) return null;
    var tmp = {codexNew: []}, sum = {};
    var deltas = this._applyEffects(c.effects, sum);
    this._unlock(e.codex, tmp);
    this._unlock(c.codex, tmp);
    st.eventChoice = i;
    var cause = this.deathCause();
    if (cause) st.eventDeath = cause;
    return {result: c.result || null, deltas: deltas, codexNew: tmp.codexNew, death: cause, choice: c};
  };

  /* resume the node the event interrupted (or the death node if the event killed you) */
  Game.prototype.eventContinue = function () {
    var st = this.state;
    if (!st.pendingEvent) return null;
    var next = st.pendingNext, death = st.eventDeath;
    st.pendingEvent = null; st.pendingNext = null; st.eventChoice = null; st.eventDeath = null;
    var step = newStep();
    if (death) { step.death = death; return this._enter(this.deathNodeId(death), step); }
    return this._enter(next, step);
  };

  Game.prototype.date = function () { return dateParts(this.state.hours, this.faction.startDate); };

  /* ---------- save records (SPEC §9) ---------- */
  Game.prototype.toRecord = function (extra) {
    var st = this.state, rec = {
      schema: WH.SAVE_SCHEMA || 1, gameVersion: WH.VERSION || "0", savedAt: new Date().toISOString(),
      faction: st.faction, runId: st.runId, nodeId: st.nodeId, chapter: st.chapter,
      stats: JSON.parse(JSON.stringify(st.stats)), flags: JSON.parse(JSON.stringify(st.flags)),
      codex: st.codex.slice(), seenEvents: st.seenEvents.slice(), hours: st.hours,
      pendingEvent: st.pendingEvent, pendingNext: st.pendingNext,
      eventChoice: st.eventChoice, eventDeath: st.eventDeath, deathPending: st.deathPending,
      history: st.history.slice(), visits: st.visits, playMs: Math.round(st.playMs), ended: st.ended
    };
    if (extra) for (var k in extra) rec[k] = extra[k];
    return rec;
  };

  Game.fromRecord = function (rec, opts) {
    var g = new Game(rec.faction, opts);
    var st = g.freshState();
    st.nodeId = rec.nodeId;
    st.runId = rec.runId || ("legacy-" + rec.faction + "-" + (rec.savedAt || ""));
    st.chapter = rec.chapter || 1;
    for (var i = 0; i < STATS.length; i++) {
      var k = STATS[i];
      if (rec.stats && typeof rec.stats[k] === "number") st.stats[k] = clamp(rec.stats[k], 0, 100);
    }
    st.flags = rec.flags || {};
    st.codex = (rec.codex || []).slice();
    st.seenEvents = (rec.seenEvents || []).slice();
    st.hours = typeof rec.hours === "number" ? rec.hours : st.hours;
    st.pendingEvent = rec.pendingEvent || null;
    st.pendingNext = rec.pendingNext || null;
    st.eventChoice = (typeof rec.eventChoice === "number") ? rec.eventChoice : null;
    st.eventDeath = rec.eventDeath || null;
    st.deathPending = rec.deathPending || null;
    st.history = (rec.history || []).slice(-HISTORY_MAX);
    st.visits = rec.visits || st.history.length || 1;
    st.playMs = rec.playMs || 0;
    st.ended = !!rec.ended;
    if (st.pendingEvent && !g.event(st.pendingEvent)) { st.pendingEvent = null; }
    g.state = st;
    var n = g.node(); // throws if node missing
    if (typeof n.chapter === "number") st.chapter = n.chapter;
    return g;
  };

  WH.RNG = RNG;
  WH.Game = Game;
  WH.Rules = {
    STATS: STATS, clamp: clamp, rollChance: rollChance, requireOK: requireOK,
    timeHours: timeHours, dateParts: dateParts, startHours: startHours,
    WARP_MIN: WARP_MIN, WARP_MAX: WARP_MAX, HOURS_PER_YEAR: HOURS_PER_YEAR
  };
})(typeof window !== "undefined" ? window : globalThis);
