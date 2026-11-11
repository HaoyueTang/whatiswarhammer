/* engine.js — pure game state machine & rules (SPEC §3, §5, §8). Owned by: web.
 * NO DOM access here: tools/dev/validate.js runs this file inside a Node vm context.
 *
 * Usage:
 *   var g = new WH.Game("imperium", {rng: WH.RNG(1234)});
 *   var step = g.start(originId);    // enters the origin's startNode (SPEC §16); no id = first origin
 *   WH.newGame("imperium", "agri")   // same, returns {game, step}
 *   WH.Game.origins(faction)         // faction.origins, or one default origin synthesized from the faction fields
 *   g.choices();                     // visible choices with lock / roll info
 *   step = g.choose(0);              // -> step {kind:"node"|"event", ...}
 *   step.consequence                 // what the UI shows between the click and the next node (see consequenceOf)
 *   if (step.kind === "event") { g.eventChoices(); var r = g.eventChoose(1); step = g.eventContinue(); }
 *   SPEC §19: faction.taintMod scales positive taint; event choices may `goto` a node (string or {faction:id});
 *   claim events fire at most twice per god (2nd only if flag resisted_<god>); claim endings = ids with "_end_claim_<god>".
 *   SPEC §20 rumours: entering a node without eventRoll (not an ending, no pending death) → with p = RUMOR_P (own seeded
 *   stream, so the main RNG sequence is unchanged) one unseen eligible rumour → step.rumor / step.rumorCodex, g.currentRumor().
 *   new WH.Game(fid, {rumors:false}) or g.rumors = false turns them off (UI setting 传闻).
 *   SPEC §23: origin.max:{hp,sanity} (70–130, default 100) → state.max; hp/sanity clamp to g.cap(k); start values default to the caps.
 *   g.toRecord() / WH.Game.fromRecord(rec)
 */
(function (root) {
  var WH = root.WH = root.WH || {};

  var STATS = ["hp", "sanity", "corruption", "renown"];
  var GODS = ["khorne", "nurgle", "tzeentch", "slaanesh"];      // hidden taint tracks (SPEC §18)
  function zeroTaint() { return {khorne: 0, nurgle: 0, tzeentch: 0, slaanesh: 0}; }
  var CLAIM_MAX = 2;                                             // SPEC §19: a god's claim event fires at most twice per run
  /* SPEC §19: "<prefix>end_claim_<god>" → god, else null */
  function claimGodOf(nodeId) {
    var m = /_end_claim_(khorne|nurgle|tzeentch|slaanesh)(?:$|_)/.exec(String(nodeId || ""));
    return m ? m[1] : null;
  }
  var HOURS_PER_YEAR = 8760;
  var WARP_MIN = 0.4, WARP_MAX = 3.0;
  var HISTORY_MAX = 30;
  var RUMOR_P = 0.25;                                            // SPEC §20: chance per eligible node
  var CAP_MIN = 70, CAP_MAX = 130, CAP_DEFAULT = 100;            // SPEC §23: per-run caps for hp / sanity
  var CAPPED = ["hp", "sanity"];
  /* SPEC §23: the run's caps from an origin's max:{hp,sanity} (missing → 100, clamped 70–130) */
  function capsOf(o) {
    var m = (o && o.max) || {}, out = {};
    for (var i = 0; i < CAPPED.length; i++) {
      var v = +m[CAPPED[i]];
      out[CAPPED[i]] = (m[CAPPED[i]] === undefined || m[CAPPED[i]] === null || !isFinite(v)) ? CAP_DEFAULT : clamp(Math.round(v), CAP_MIN, CAP_MAX);
    }
    return out;
  }

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
    if (req.taint) {
      var tv = (state.taint && state.taint[req.taint]) || 0;
      if (req.min !== undefined && req.min !== null && tv < req.min) return false;
      if (req.max !== undefined && req.max !== null && tv > req.max) return false;
    }
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

  /* the codex id of a god: "god_<god>", else any cat:"god" entry whose id contains the god's name */
  function godCodexId(data, god) {
    var cx = (data && data.codex) || {};
    if (cx["god_" + god]) return "god_" + god;
    for (var k in cx) if (cx[k] && cx[k].cat === "god" && k.indexOf(god) >= 0) return k;
    return null;
  }

  /* ---------- consequence beat (SPEC §11) ----------
   * Pure data for the UI's consequence panel, attached to every step returned by choose() as step.consequence:
   *   {text:{zh,en}|null, auto:bool, deltas:{hp,…}, roll:{pEff,success,stat}|null, flags:bool, death:cause|null,
   *    time:step.time|null, show:bool}
   * text  = choice.result, or choice.rollResult.success/fail for roll choices (falls back to result).
   * auto  = no text but real (clamped) stat deltas → UI prints a compact "生命 −10 · 理智 −5" line.
   * show  = there is something to show (text, deltas, a roll outcome or a death). Flags alone → nothing. */
  function hasDeltas(d) {
    if (!d) return false;
    for (var i = 0; i < STATS.length; i++) if (d[STATS[i]]) return true;
    return false;
  }
  function consequenceOf(c, step, isEvent) {
    var text = null, roll = step.roll || null;
    if (c.roll && roll) {
      var rr = c.rollResult || {};
      text = (roll.success ? rr.success : rr.fail) || c.result || null;
    } else text = c.result || null;
    var d = step.choiceDeltas || {}, dl = hasDeltas(d);
    var eff = c.effects || {};
    return {text: text, auto: !text && dl, deltas: d, roll: roll, flags: !!(eff.set || eff.unset),
            death: step.death || null, time: isEvent ? null : (step.time || null),
            show: !!(text || dl || roll || step.death)};
  }

  /* ---------- origins (SPEC §16) ---------- */
  /* faction.origins if present, else one default origin built from the faction's own fields (data written before §16) */
  function origins(f) {
    if (f && Array.isArray(f.origins) && f.origins.length) return f.origins;
    if (!f) return [];
    if (!f._defaultOrigin) {
      var ss = f.startStats || {};
      f._defaultOrigin = [{id: "default", _default: true, name: f.role || f.name, desc: f.tagline || null,
        sprite: f.playerSprite, startNode: f.startNode,
        stats: {hp: ss.hp !== undefined ? ss.hp : 100, sanity: ss.sanity !== undefined ? ss.sanity : 100,
                corruption: ss.corruption || 0, renown: ss.renown || 0}, set: {}}];
    }
    return f._defaultOrigin;
  }
  function findOrigin(f, id) {
    var list = origins(f);
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0] || null;
  }

  /* ---------- Game ---------- */
  function Game(factionId, opts) {
    opts = opts || {};
    this.data = opts.data || WH;
    this.rng = opts.rng || Math.random;
    this.faction = this.data.factions[factionId];
    if (!this.faction) throw new Error("Unknown faction: " + factionId);
    this.state = null;
    /* SPEC §20: rumours draw from their own stream (derived from the main seed) so turning them on/off never changes
     * rolls, events or warp time of a seeded run */
    this.rumors = opts.rumors !== false;
    this.rumorChance = typeof opts.rumorChance === "number" ? opts.rumorChance : RUMOR_P;
    this.rumorRng = opts.rumorRng || RNG(((this.rng.getState ? this.rng.getState() : Math.floor(Math.random() * 4294967296)) ^ 0x2545F491) >>> 0);
  }

  Game.STATS = STATS;
  Game.origins = origins;
  Game.findOrigin = findOrigin;

  /* the origin of the current run (falls back to the first origin for legacy saves / unknown ids) */
  Game.prototype.origin = function () { return findOrigin(this.faction, this.state && this.state.origin); };
  /* SPEC §23: upper bound of a stat this run (hp/sanity per origin, corruption/renown 100) */
  Game.prototype.cap = function (k) {
    var m = this.state && this.state.max;
    return (CAPPED.indexOf(k) >= 0 && m && typeof m[k] === "number") ? m[k] : 100;
  };
  Game.prototype.playerSprite = function () { var o = this.origin(); return (o && o.sprite) || this.faction.playerSprite; };

  Game.prototype.freshState = function (origin) {
    var f = this.faction, ss = (origin && origin.stats) || f.startStats || {}, mx = capsOf(origin);
    return {
      faction: f.id, origin: origin ? origin.id : null, nodeId: null, chapter: 1,
      max: mx,                                                     // SPEC §23: start values default to the caps
      stats: {hp: ss.hp !== undefined ? clamp(ss.hp, 0, mx.hp) : mx.hp, sanity: ss.sanity !== undefined ? clamp(ss.sanity, 0, mx.sanity) : mx.sanity,
              corruption: ss.corruption || 0, renown: ss.renown || 0},
      runId: Date.now().toString(36) + Math.floor(Math.random() * 1e8).toString(36),
      flags: {}, codex: [], seenEvents: [], seenRumors: [], rumor: null, hours: startHours(f), taint: zeroTaint(), claims: {},
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

  Game.prototype.start = function (originId) {
    var o = findOrigin(this.faction, originId);
    this.state = this.freshState(o);
    if (o && o.set) for (var k in o.set) this.state.flags[k] = o.set[k];
    var step = newStep();
    step.origin = o ? o.id : null;
    return this._enter((o && o.startNode) || this.faction.startNode, step);
  };

  function newStep() {
    return {kind: "node", nodeId: null, choiceDeltas: {}, nodeDeltas: {}, deltas: {},
            time: null, chapterChanged: false, fromChapter: null, codexNew: [],
            roll: null, death: null, ending: null, event: null, deathPending: null, rumor: null, rumorCodex: []};
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
        st[k] = clamp(before + eff[k], 0, this.cap(k));
        if (st[k] !== before) d[k] = st[k] - before;
        if (into) into[k] = (into[k] || 0) + (st[k] - before);
      }
    }
    if (eff.taint) this._applyTaint(eff.taint);       // hidden: never part of the returned (visible) deltas
    if (eff.set) for (var f in eff.set) this.state.flags[f] = eff.set[f];
    if (eff.unset) for (var j = 0; j < eff.unset.length; j++) delete this.state.flags[eff.unset[j]];
    return d;
  };

  /* SPEC §19: per-route multiplier for one god (positive deltas only), default 1 */
  Game.prototype.taintMod = function (god) {
    var m = this.faction.taintMod, v = m && +m[god];
    return (typeof v === "number" && isFinite(v) && v >= 0) ? v : 1;
  };

  /* taint:{god:±n} or {all:±n}; net positive deltas × faction.taintMod[god] (Math.round), cleanses unscaled; clamped 0–100 */
  Game.prototype._applyTaint = function (tt) {
    var st = this.state;
    if (!st.taint) st.taint = zeroTaint();
    for (var i = 0; i < GODS.length; i++) {
      var g = GODS[i], n = (+tt[g] || 0) + (+tt.all || 0);
      if (n > 0) n = Math.round(n * this.taintMod(g));
      if (n) st.taint[g] = clamp((st.taint[g] || 0) + n, 0, 100);
    }
  };

  /* times god G's claim event has fired this run (state.claims; legacy saves derive it in fromRecord) */
  Game.prototype.claimCount = function (god) {
    var c = this.state && this.state.claims;
    return (c && +c[god]) || 0;
  };

  /* SPEC §18/§19: a god at 100 taint whose claim event may fire: never fired yet, or fired once and the player
   * resisted (flag resisted_<god>) — at most CLAIM_MAX times. All other events stay once per run. */
  Game.prototype.claimDue = function () {
    var st = this.state, evs = this.data.events || [];
    if (!st || !st.taint) return null;
    for (var i = 0; i < GODS.length; i++) {
      var god = GODS[i];
      if ((st.taint[god] || 0) < 100) continue;
      var n = this.claimCount(god);
      if (n >= CLAIM_MAX || (n >= 1 && !st.flags["resisted_" + god])) continue;
      for (var j = 0; j < evs.length; j++) {
        var e = evs[j];
        if (e.trigger !== "claim" || e.god !== god) continue;
        var fs = e.factions || ["*"];
        if (fs.indexOf("*") < 0 && fs.indexOf(st.faction) < 0) continue;
        if (!e.choices || !e.choices.length) continue;
        return e;
      }
    }
    return null;
  };

  /* random-event weight (SPEC §18): god events 1 + taint/25, cleansing events 1 + sum(taint)/100 */
  Game.prototype.eventWeight = function (e) {
    var tt = this.state.taint || zeroTaint();
    if (e.cleanse) return 1 + (tt.khorne + tt.nurgle + tt.tzeentch + tt.slaanesh) / 100;
    if (GODS.indexOf(e.god) >= 0) return 1 + (tt[e.god] || 0) / 25;
    return 1;
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
    st.rumor = null;
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
      var cg = claimGodOf(id);                              // SPEC §19: a claim ending also unlocks the god's codex entry
      if (cg) { step.claimGod = cg; this._unlock(godCodexId(this.data, cg), step); }
    } else {
      var cause = this.deathCause();
      if (cause) {
        st.deathPending = cause;
        step.deathPending = cause;
      } else if (!node.eventRoll) this._rollRumor(node, step);
    }
    return step;
  };

  /* ---------- rumours (SPEC §20) ---------- */
  function rumorEligible(r, fid, chapter) {
    if (!r || !r.id || !r.text) return false;
    var fs = r.factions || ["*"];
    if (fs.indexOf("*") < 0 && fs.indexOf(fid) < 0) return false;
    if (typeof r.minChapter === "number" && chapter < r.minChapter) return false;
    if (typeof r.maxChapter === "number" && chapter > r.maxChapter) return false;
    return true;
  }
  /* unseen rumours this run could show in `chapter` (default: current chapter) */
  Game.prototype.eligibleRumors = function (chapter) {
    var st = this.state, list = this.data.rumors || [], out = [];
    if (chapter === undefined) chapter = st.chapter;
    for (var i = 0; i < list.length; i++) {
      var r = list[i];
      if ((st.seenRumors || []).indexOf(r.id) >= 0) continue;
      if (rumorEligible(r, st.faction, chapter)) out.push(r);
    }
    return out;
  };
  Game.prototype.rumor = function (id) {
    var list = this.data.rumors || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  };
  /* the rumour overheard at the current node (null if none) */
  Game.prototype.currentRumor = function () { return this.state && this.state.rumor ? this.rumor(this.state.rumor) : null; };

  /* called by _enter for nodes without eventRoll / ending / pending death; one draw per node from rumorRng */
  Game.prototype._rollRumor = function (node, step) {
    var st = this.state;
    if (!this.rumors || !(this.data.rumors && this.data.rumors.length)) return;
    if (this.rumorRng() >= this.rumorChance) return;
    var ch = typeof node.chapter === "number" ? node.chapter : st.chapter;
    var pool = this.eligibleRumors(ch);
    if (!pool.length) return;
    var r = pool[Math.min(pool.length - 1, Math.floor(this.rumorRng() * pool.length))];
    if (!st.seenRumors) st.seenRumors = [];
    st.seenRumors.push(r.id);
    st.rumor = r.id;
    step.rumor = r;
    var tmp = {codexNew: []};
    this._unlock(r.codex, tmp);
    step.rumorCodex = tmp.codexNew;
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
    if (cause) {
      step.death = cause;
      step = this._enter(this.deathNodeId(cause), step);
      step.consequence = consequenceOf(c, step);
      return step;
    }
    var target = c.next;
    if (c.roll) {
      var p = rollChance(c.roll, st.stats), r = this.rng(), ok = r < p;
      step.roll = {pEff: p, success: ok, stat: c.roll.stat || null};
      target = ok ? c.roll.success : c.roll.fail;
    }
    step = this._goTo(target, step);
    step.consequence = consequenceOf(c, step);
    return step;
  };

  Game.prototype.eligibleEvents = function (chapter) {
    var out = [], evs = this.data.events || [], st = this.state;
    for (var i = 0; i < evs.length; i++) {
      var e = evs[i];
      if (st.seenEvents.indexOf(e.id) >= 0) continue;
      var fs = e.factions || ["*"];
      if (fs.indexOf("*") < 0 && fs.indexOf(st.faction) < 0) continue;
      if ((e.minChapter || 0) > chapter) continue;
      if (e.trigger === "claim") continue;                 // claim events only fire from claimDue()
      if (!e.choices || !e.choices.length) continue;
      out.push(e);
    }
    return out;
  };

  Game.prototype._openEvent = function (e, target, step) {
    var st = this.state;
    st.pendingEvent = e.id; st.pendingNext = target; st.eventChoice = null; st.eventDeath = null;
    if (e.trigger === "claim" && e.god) { if (!st.claims) st.claims = {}; st.claims[e.god] = this.claimCount(e.god) + 1; }
    if (st.seenEvents.indexOf(e.id) < 0) st.seenEvents.push(e.id);
    step.kind = "event"; step.event = e; step.nodeId = target;
    return step;
  };

  Game.prototype._goTo = function (target, step) {
    var node = this.node(target);
    if (!node.ending) {
      var claim = this.claimDue();                         // a god at 100 taint claims you before anything else
      if (claim) return this._openEvent(claim, target, step);
    }
    if (node.eventRoll && !node.ending && this.rng() < node.eventRoll) {
      var ch = typeof node.chapter === "number" ? node.chapter : this.state.chapter;
      var pool = this.eligibleEvents(ch);
      if (pool.length) {
        var tot = 0, i, w = [];
        for (i = 0; i < pool.length; i++) { w.push(this.eventWeight(pool[i])); tot += w[i]; }
        var r = this.rng() * tot, e = pool[pool.length - 1];
        for (i = 0; i < pool.length; i++) { r -= w[i]; if (r < 0) { e = pool[i]; break; } }
        return this._openEvent(e, target, step);
      }
    }
    return this._enter(target, step);
  };

  Game.prototype.currentEvent = function () {
    return this.state && this.state.pendingEvent ? this.event(this.state.pendingEvent) : null;
  };

  /* Choices of the pending event, filtered by `require` like node choices (SPEC §19).
   * Each: {index (into e.choices), choice, locked, fallback}. hideIfLocked + failing require → omitted. */
  Game.prototype.eventChoices = function () {
    var st = this.state, e = this.currentEvent(), out = [];
    if (!e) return out;
    var list = e.choices || [];
    for (var i = 0; i < list.length; i++) {
      var c = list[i], ok = requireOK(c.require, st);
      if (!ok && c.hideIfLocked) continue;
      out.push({index: i, choice: c, locked: !ok});
    }
    if (!out.some(function (v) { return !v.locked; }) && list.length) {   // softlock guard (validator reports it)
      if (out.length) { out[out.length - 1].locked = false; out[out.length - 1].fallback = true; }
      else out.push({index: list.length - 1, choice: list[list.length - 1], locked: false, fallback: true});
    }
    return out;
  };

  /* SPEC §19: resolve a choice's goto for this faction → node id or null (unknown/missing → null = resume pending) */
  Game.prototype.gotoOf = function (c) {
    if (!c || !c.goto) return null;
    var id = typeof c.goto === "string" ? c.goto : c.goto[this.faction.id];
    return (id && this.faction.nodes && this.faction.nodes[id]) ? id : null;
  };

  /* choose option i (index into e.choices) of the pending event. Returns {result, deltas, codexNew, death, goto, choice, consequence}.
   * A goto into an ending overrides a lethal stat change from the same choice (the ending is the fate). */
  Game.prototype.eventChoose = function (i) {
    var st = this.state, e = this.currentEvent();
    if (!e || st.eventChoice !== null) return null;
    var c = e.choices[i], vis = this.eventChoices(), ok = false;
    for (var k = 0; k < vis.length; k++) if (vis[k].index === i && !vis[k].locked) ok = true;
    if (!c || !ok) return null;
    var tmp = {codexNew: []}, sum = {};
    var deltas = this._applyEffects(c.effects, sum);
    this._unlock(e.codex, tmp);
    this._unlock(c.codex, tmp);
    st.eventChoice = i;
    var go = this.gotoOf(c), cause = this.deathCause();
    if (cause && go && this.node(go).ending) cause = null;
    if (cause) st.eventDeath = cause;
    return {result: c.result || null, deltas: deltas, codexNew: tmp.codexNew, death: cause, choice: c, goto: go,
            consequence: consequenceOf(c, {choiceDeltas: deltas, roll: null, death: cause, time: null}, true)};
  };

  /* resume the node the event interrupted — or the choice's goto node (SPEC §19), or the death node if the event killed you */
  Game.prototype.eventContinue = function () {
    var st = this.state, e = this.currentEvent();
    if (!st.pendingEvent) return null;
    var c = e && st.eventChoice !== null ? e.choices[st.eventChoice] : null;
    var go = this.gotoOf(c);
    var next = go || st.pendingNext, death = st.eventDeath;
    if (go && this.node(go).ending) death = null;
    st.pendingEvent = null; st.pendingNext = null; st.eventChoice = null; st.eventDeath = null;
    var step = newStep();
    if (go) step.goto = go;
    if (death) { step.death = death; return this._enter(this.deathNodeId(death), step); }
    var claim = this.claimDue();                           // the event's own taint pushed a god to 100
    if (claim && !this.node(next).ending) return this._openEvent(claim, next, step);
    return this._enter(next, step);
  };

  Game.prototype.date = function () { return dateParts(this.state.hours, this.faction.startDate); };

  /* ---------- save records (SPEC §9) ---------- */
  Game.prototype.toRecord = function (extra) {
    var st = this.state, rec = {
      schema: WH.SAVE_SCHEMA || 1, gameVersion: WH.VERSION || "0", savedAt: new Date().toISOString(),
      faction: st.faction, origin: st.origin, runId: st.runId, nodeId: st.nodeId, chapter: st.chapter,
      max: {hp: (st.max && st.max.hp) || CAP_DEFAULT, sanity: (st.max && st.max.sanity) || CAP_DEFAULT},
      stats: JSON.parse(JSON.stringify(st.stats)), flags: JSON.parse(JSON.stringify(st.flags)),
      codex: st.codex.slice(), seenEvents: st.seenEvents.slice(), seenRumors: (st.seenRumors || []).slice(), rumor: st.rumor || null, hours: st.hours,
      taint: JSON.parse(JSON.stringify(st.taint || zeroTaint())), claims: JSON.parse(JSON.stringify(st.claims || {})),
      pendingEvent: st.pendingEvent, pendingNext: st.pendingNext,
      eventChoice: st.eventChoice, eventDeath: st.eventDeath, deathPending: st.deathPending,
      history: st.history.slice(), visits: st.visits, playMs: Math.round(st.playMs), ended: st.ended
    };
    if (extra) for (var k in extra) rec[k] = extra[k];
    // SPEC §22: fields this version doesn't know (written by a newer/older build) survive a load → save round trip
    if (this.extraFields) for (var x in this.extraFields) if (!has(rec, x)) rec[x] = this.extraFields[x];
    return rec;
  };
  var RECORD_KEYS = ["schema", "gameVersion", "savedAt", "faction", "origin", "runId", "nodeId", "chapter", "max", "stats", "flags", "codex",
    "seenEvents", "seenRumors", "rumor", "hours", "taint", "claims", "pendingEvent", "pendingNext", "eventChoice", "eventDeath",
    "deathPending", "history", "visits", "playMs", "ended", "lang"];

  Game.fromRecord = function (rec, opts) {
    var g = new Game(rec.faction, opts);
    var st = g.freshState();
    st.nodeId = rec.nodeId;
    st.origin = findOrigin(g.faction, rec.origin) ? findOrigin(g.faction, rec.origin).id : null;
    st.runId = rec.runId || ("legacy-" + rec.faction + "-" + (rec.savedAt || ""));
    st.chapter = rec.chapter || 1;
    st.max = capsOf({max: rec.max});                                   // SPEC §23: saves without max → 100/100
    for (var i = 0; i < STATS.length; i++) {
      var k = STATS[i];
      if (rec.stats && typeof rec.stats[k] === "number") st.stats[k] = clamp(rec.stats[k], 0, CAPPED.indexOf(k) >= 0 ? st.max[k] : 100);
    }
    st.flags = rec.flags || {};
    st.taint = zeroTaint();
    if (rec.taint) for (var gi = 0; gi < GODS.length; gi++) { var tv = +rec.taint[GODS[gi]]; if (tv) st.taint[GODS[gi]] = clamp(tv, 0, 100); }
    st.codex = (rec.codex || []).slice();
    st.seenEvents = (rec.seenEvents || []).slice();
    st.seenRumors = Array.isArray(rec.seenRumors) ? rec.seenRumors.slice() : [];     // SPEC §20, additive (older saves: none)
    st.rumor = typeof rec.rumor === "string" && g.rumor(rec.rumor) ? rec.rumor : null;
    st.claims = {};
    if (rec.claims) for (var ci = 0; ci < GODS.length; ci++) { var cn = +rec.claims[GODS[ci]]; if (cn > 0) st.claims[GODS[ci]] = Math.min(CLAIM_MAX, Math.floor(cn)); }
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
    g.extraFields = {};
    for (var rk in rec) if (has(rec, rk) && RECORD_KEYS.indexOf(rk) < 0) g.extraFields[rk] = JSON.parse(JSON.stringify(rec[rk]));
    if (!rec.claims) st.seenEvents.forEach(function (id) {             // pre-§19 saves: each claim event fired once
      var e = g.event(id); if (e && e.trigger === "claim" && GODS.indexOf(e.god) >= 0) st.claims[e.god] = Math.min(CLAIM_MAX, (st.claims[e.god] || 0) + 1); });
    var n = g.node(); // throws if node missing
    if (typeof n.chapter === "number") st.chapter = n.chapter;
    return g;
  };

  WH.RNG = RNG;
  WH.Game = Game;
  WH.newGame = function (factionId, originId, opts) {
    var g = new Game(factionId, opts);
    return {game: g, step: g.start(originId)};
  };
  WH.Rules = {
    STATS: STATS, GODS: GODS, zeroTaint: zeroTaint, CLAIM_MAX: CLAIM_MAX, claimGodOf: claimGodOf, godCodexId: godCodexId, clamp: clamp, rollChance: rollChance, requireOK: requireOK,
    timeHours: timeHours, dateParts: dateParts, startHours: startHours, consequenceOf: consequenceOf, hasDeltas: hasDeltas,
    WARP_MIN: WARP_MIN, WARP_MAX: WARP_MAX, HOURS_PER_YEAR: HOURS_PER_YEAR, RUMOR_P: RUMOR_P, rumorEligible: rumorEligible,
    capsOf: capsOf, CAP_MIN: CAP_MIN, CAP_MAX: CAP_MAX, CAP_DEFAULT: CAP_DEFAULT, CAPPED: CAPPED
  };
})(typeof window !== "undefined" ? window : globalThis);
