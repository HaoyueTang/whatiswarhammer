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
 *   SPEC §20/§20b/§20c rumours: heard ONLY on gathering-place nodes (`node.gather = {zh, en}` label; mess hall, market, hab-block
 *   commons …) — nodes without `gather`, endings, pending deaths and eventRoll nodes never roll. At a gather node every unseen eligible
 *   rumour is a candidate and is scored by its `when` matches (scene / speaker+foe sprite / codex unlocked here / run flags / keywords
 *   in the zh+en text; 0 matches is allowed = idle chatter); the best score wins (ties random) and fires with p 0.7 (score ≥2),
 *   0.6 (score 1) or 0.45 (score 0) — at least 3 nodes since the last rumour, at most 2 per chapter. Own seeded stream, so the main
 *   RNG sequence is unchanged. → step.rumor / step.rumorScore / step.rumorCodex, g.currentRumor(), g.rumorMatches(nodeId).
 *   new WH.Game(fid, {rumors:false}) or g.rumors = false turns them off (UI setting 传闻); opts.rumorChance forces p (tests).
 *   SPEC §27/§20c echoes: g.echoPool = [{runId, echo:{faction, role, world, cause, kind, dateKey, claimedBy}}] (past bad/death runs, set by
 *   the UI from the run records); heard like a rumour, so only on gather nodes; at most ONE per run, p 0.3 on gather nodes with chapter ≥2,
 *   no eventRoll, not an ending, no rumour here and ≥3 nodes since the last rumour; only echoes dated ≤ now; other routes preferred; text from WH.echoTemplates → state.echo / step.echo.
 *   Own seeded stream (echoRng); opts.echoes:false or g.echoes = false turns them off; opts.echoChance forces p (tests).
 *   SPEC §23: origin.max:{hp,sanity} (70–130, default 100) → state.max; hp/sanity clamp to g.cap(k); start values default to the caps.
 *   SPEC §28 grudges: faction.npcs + choice.grudge {npc, p?, effects?, note} + node.grudgeLine {npc, text}. A grudge is ACTIVE while
 *   flags["wronged_"+npc] && !flags["forgiven_"+npc]. g.choices()[i].grudge = {npc, note, p, effects} (only while active; roll.pEff already
 *   includes p, final clamp 0.05–0.95); choose() merges grudge.effects into the applied effects and sets step.grudge = {npc, note}
 *   (also step.consequence.grudge); g.grudgeLine() → {npc, text} of the current node while active; g.nodeText() → node text + that line.
 *   No extra RNG draws, no new state: runs/saves without an active grudge behave exactly as before.
 *   SPEC §30 rewind: new WH.Game(fid, {rewind:true}) or g.rewindEnabled = true. While enabled, choose() pushes a snapshot of the COMPLETE state
 *   (deep copy of g.state + the three RNG states) before applying a choice (not for the forced "you die" choice); max 30 deep, in memory only.
 *   g.canRewind() / g.rewind() → true|false pops one snapshot and restores it (same RNG → re-picking a roll gives the same result); g.rewindCount =
 *   rewinds used this run (saved as rec.rewinds). Knowledge is not rewound: state.codex stays a superset, playMs keeps running. Off = no snapshots.
 *   SPEC §32 story overhaul: node.alt [{if:Cond, text|add}] is resolved on ARRIVAL (before the node's own effects, no RNG) into state.altSel =
 *   {node, t:index|-1, a:[indexes]} (saved as rec.altSel; reload / rewind / validator sims show the same text): g.altText(), g.altAdds(), g.nodeBody()
 *   (alt-resolved text + adds joined by "\n\n"), g.nodeText() = nodeBody + grudge line. The "previous node" of the from* conditions is the node
 *   before the current one in state.history. choice.resultAlt [{if, text}] → first match replaces choice.result in the consequence (state BEFORE the
 *   choice's effects). eligibleEvents(chapter, node) filters by event.where / excludeFactions (WH.Rules.whereOK, WH.Rules.condOK).
 *   Save fallback: fromRecord() with an unknown node id → WH.Game.fallbackNode(faction, chapter, origin), g.fallbackFrom = the missing id.
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
  var RUMOR_P = 0.25;                                            // SPEC §20 (v0.2.2 flat roll; kept for reference)
  var RUMOR_P2 = 0.7, RUMOR_P1 = 0.6, RUMOR_P0 = 0.45;            // SPEC §20c: chance at a gather node when the best match scores ≥2 / 1 / 0
  var RUMOR_GAP = 3, RUMOR_PER_CHAPTER = 2;                      // SPEC §20b: ≥3 nodes since the last rumour, ≤2 per chapter
  var ECHO_P = 0.3;                                              // SPEC §27/§20c: chance of a past life's echo on an eligible gather node
  var ALT_ADD_MAX = 2;                                           // SPEC §32.2: at most 2 alt `add` paragraphs per node
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
  /* extra = optional additive modifier after the stat adjustment (SPEC §28 grudge p); with extra the result is clamped 0.05–0.95 */
  function rollChance(roll, stats, extra) {
    var p = +roll.p;
    if (isNaN(p)) p = 0.5;
    if (roll.stat && stats && typeof stats[roll.stat] === "number") {
      p = clamp(p + (stats[roll.stat] - 50) / 200, 0.05, 0.95);
    }
    if (extra) p = clamp(p + extra, 0.05, 0.95);
    return p;
  }

  /* ---------- grudges (SPEC §28) ---------- */
  function grudgeActive(gr, flags) {
    return !!(gr && gr.npc && flags && flags["wronged_" + gr.npc] && !flags["forgiven_" + gr.npc]);
  }
  /* an active grudge of choice c → {npc, note, p, effects} or null. p only counts on roll choices. */
  function grudgeOf(c, state) {
    var gr = c && c.grudge;
    if (!grudgeActive(gr, state && state.flags)) return null;
    var p = +gr.p;
    return {npc: gr.npc, note: gr.note || null, p: (c.roll && isFinite(p) && p < 0) ? p : 0, effects: gr.effects || null};
  }
  /* effects a + grudge effects b (stat deltas and taint summed; set/unset stay a's) — never mutates the data */
  function mergeEffects(a, b) {
    if (!b) return a;
    var o = {}, k, i;
    for (k in (a || {})) o[k] = a[k];
    for (i = 0; i < STATS.length; i++) if (typeof b[STATS[i]] === "number" && b[STATS[i]]) o[STATS[i]] = (+o[STATS[i]] || 0) + b[STATS[i]];
    if (b.taint) {
      var t = {};
      for (k in (o.taint || {})) t[k] = o.taint[k];
      for (k in b.taint) t[k] = (+t[k] || 0) + (+b.taint[k] || 0);
      o.taint = t;
    }
    return o;
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

  /* ---------- SPEC §32.2 conditions (node.alt / choice.resultAlt) ----------
   * Cond = {flag} | {notFlag} | {flags:[…]} (all) | {anyFlag:[…]} | {stat, min, max} | {taint:"god", min, max} | {fromChapter:{min,max}} |
   *        {fromScene:[…]} | {fromNode:[…]} | {any:[Cond…]} | {all:[Cond…]} | {not:Cond}; several keys in one object = all of them.
   * ctx = {state, prev:{id, scene, chapter}|null} — prev = the previously played node. Unknown keys are ignored (the validator rejects them). */
  function inRange(r, v) {
    if (r === undefined || r === null) return true;
    if (typeof r === "number") return v === r;
    if (typeof v !== "number") return false;
    if (r.min !== undefined && r.min !== null && v < r.min) return false;
    if (r.max !== undefined && r.max !== null && v > r.max) return false;
    return true;
  }
  function condOK(cond, ctx) {
    if (cond === undefined || cond === null || cond === true) return true;
    if (Array.isArray(cond)) { for (var a = 0; a < cond.length; a++) if (!condOK(cond[a], ctx)) return false; return true; }
    if (typeof cond !== "object") return false;
    var st = ctx.state, fl = (st && st.flags) || {}, prev = ctx.prev || null, i, l;
    if (has(cond, "flag") && !fl[cond.flag]) return false;
    if (has(cond, "notFlag") && fl[cond.notFlag]) return false;
    if (has(cond, "flags")) { l = [].concat(cond.flags); for (i = 0; i < l.length; i++) if (!fl[l[i]]) return false; }
    if (has(cond, "anyFlag")) { l = [].concat(cond.anyFlag); var any = false; for (i = 0; i < l.length; i++) if (fl[l[i]]) { any = true; break; } if (!any) return false; }
    if (cond.stat !== undefined || cond.taint !== undefined) { if (!requireOK({stat: cond.stat, taint: cond.taint, min: cond.min, max: cond.max}, st)) return false; }
    if (has(cond, "fromChapter") && !(prev && typeof prev.chapter === "number" && inRange(cond.fromChapter, prev.chapter))) return false;
    if (has(cond, "fromScene") && !(prev && prev.scene && [].concat(cond.fromScene).indexOf(prev.scene) >= 0)) return false;
    if (has(cond, "fromNode") && !(prev && prev.id && [].concat(cond.fromNode).indexOf(prev.id) >= 0)) return false;
    if (has(cond, "any")) { l = [].concat(cond.any); var ok = false; for (i = 0; i < l.length; i++) if (condOK(l[i], ctx)) { ok = true; break; } if (!ok) return false; }
    if (has(cond, "all")) { l = [].concat(cond.all); for (i = 0; i < l.length; i++) if (!condOK(l[i], ctx)) return false; }
    if (has(cond, "not") && condOK(cond.not, ctx)) return false;
    return true;
  }
  /* SPEC §32.3: event.where against the node about to be entered (node, id) and the arrival state; absent → always true */
  function listOf(x) { return x === undefined || x === null ? null : [].concat(x); }
  function whereOK(w, node, id, state) {
    if (!w || typeof w !== "object") return true;
    var l, fl = (state && state.flags) || {}, i;
    var sc = node && node.scene, ch = node && typeof node.chapter === "number" ? node.chapter : (state && state.chapter);
    if ((l = listOf(w.scenes)) && l.indexOf(sc) < 0) return false;
    if ((l = listOf(w.notScenes)) && l.indexOf(sc) >= 0) return false;
    if ((l = listOf(w.nodes)) && l.indexOf(id) < 0) return false;
    if ((l = listOf(w.notNodes)) && l.indexOf(id) >= 0) return false;
    if (w.chapter !== undefined && w.chapter !== null && !inRange(w.chapter, ch)) return false;
    if (w.flag && !fl[w.flag]) return false;
    if (w.notFlag && fl[w.notFlag]) return false;
    if ((l = listOf(w.flags))) for (i = 0; i < l.length; i++) if (!fl[l[i]]) return false;
    if ((l = listOf(w.anyFlag))) { var any = false; for (i = 0; i < l.length; i++) if (fl[l[i]]) { any = true; break; } if (!any) return false; }
    if (w.stat !== undefined || w.taint !== undefined) { if (!requireOK({stat: w.stat, taint: w.taint, min: w.min, max: w.max}, state)) return false; }
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
   *    time:step.time|null, grudge:{npc,note}|null (SPEC §28: shown first), show:bool}
   * text  = choice.result, or choice.rollResult.success/fail for roll choices (falls back to result).
   * auto  = no text but real (clamped) stat deltas → UI prints a compact "生命 −10 · 理智 −5" line.
   * show  = there is something to show (text, deltas, a roll outcome, a death or an active grudge). Flags alone → nothing. */
  function hasDeltas(d) {
    if (!d) return false;
    for (var i = 0; i < STATS.length; i++) if (d[STATS[i]]) return true;
    return false;
  }
  /* resText = the matching choice.resultAlt entry's text (SPEC §32.2), replaces choice.result; a roll's own rollResult still wins */
  function consequenceOf(c, step, isEvent, resText) {
    var text = null, roll = step.roll || null, base = resText || c.result || null;
    if (c.roll && roll) {
      var rr = c.rollResult || {};
      text = (roll.success ? rr.success : rr.fail) || base;
    } else text = base;
    var d = step.choiceDeltas || {}, dl = hasDeltas(d);
    var eff = c.effects || {};
    var gr = step.grudge || null;
    return {text: text, auto: !text && dl, deltas: d, roll: roll, flags: !!(eff.set || eff.unset),
            death: step.death || null, time: isEvent ? null : (step.time || null), grudge: gr,
            show: !!(text || dl || roll || step.death || gr)};
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
    this.rumorChance = typeof opts.rumorChance === "number" ? opts.rumorChance : null;     // null = SPEC §20c 0.7 / 0.6 / 0.45
    var seed0 = this.rng.getState ? this.rng.getState() : Math.floor(Math.random() * 4294967296);
    this.rumorRng = opts.rumorRng || RNG((seed0 ^ 0x2545F491) >>> 0);
    this.echoes = opts.echoes !== false;                             // SPEC §27
    this.echoChance = typeof opts.echoChance === "number" ? opts.echoChance : ECHO_P;
    this.echoRng = opts.echoRng || RNG((seed0 ^ 0x6A09E667) >>> 0);
    this.echoPool = opts.echoPool || [];
    this.rewindEnabled = opts.rewind === true;                       // SPEC §30
    this.rewindStack = [];
    this.rewindCount = 0;
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
      flags: {}, codex: [], seenEvents: [], seenRumors: [], rumor: null, rumorLog: [], echo: null, echoRun: null, hours: startHours(f), taint: zeroTaint(), claims: {},
      pendingEvent: null, pendingNext: null, eventChoice: null, eventDeath: null,
      deathPending: null, history: [], visits: 0, playMs: 0, ended: false, altSel: null     // SPEC §32.2 (additive)
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
            roll: null, death: null, ending: null, event: null, deathPending: null, rumor: null, rumorCodex: [], grudge: null};
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
        if (e.excludeFactions && e.excludeFactions.indexOf(st.faction) >= 0) continue;     // SPEC §32.3
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

  /* ---------- SPEC §32.2 alt / resultAlt ---------- */
  /* {id, scene, chapter} of a node id for the from* conditions (null for none / unknown) */
  Game.prototype._prevInfo = function (id) {
    if (!id) return null;
    var n = this.faction.nodes && this.faction.nodes[id];
    return n ? {id: id, scene: n.scene || null, chapter: typeof n.chapter === "number" ? n.chapter : null} : {id: id, scene: null, chapter: null};
  };
  /* id of the node played before the current one (state.history; tolerates a history whose last entry is not the current node) */
  Game.prototype._prevId = function () {
    var st = this.state, h = (st && st.history) || [];
    if (!h.length) return null;
    return h[h.length - 1] === st.nodeId ? (h.length > 1 ? h[h.length - 2] : null) : h[h.length - 1];
  };
  /* node.alt against the arrival state → {node, t:index|-1, a:[indexes]} or null when no entry matches (or the node has no alt). No RNG. */
  Game.prototype._resolveAlt = function (id, node, prev) {
    var alt = node && node.alt, ctx = {state: this.state, prev: prev || null}, t = -1, adds = [];
    if (!Array.isArray(alt) || !alt.length) return null;
    for (var i = 0; i < alt.length; i++) {
      var a = alt[i];
      if (!a || !condOK(a["if"], ctx)) continue;
      if (a.text) { if (t < 0) t = i; }
      else if (a.add && adds.length < ALT_ADD_MAX) adds.push(i);
    }
    return (t < 0 && !adds.length) ? null : {node: id, t: t, a: adds};
  };
  /* the stored selection for node `id` (default: current) → {t, a} or null; a selection of another node is ignored */
  Game.prototype.altSel = function (id) {
    var st = this.state, s = st && st.altSel;
    if (id === undefined) id = st && st.nodeId;
    return (s && s.node === id) ? s : null;
  };
  /* node text {zh,en} with the matching alt `text` entry in place of the main text (no adds, no grudge line) */
  Game.prototype.altText = function (id) {
    var node = this.node(id), s = this.altSel(id), e = s && s.t >= 0 && node.alt && node.alt[s.t];
    return (e && e.text) || node.text || {};
  };
  /* matching alt `add` paragraphs → [{zh,en}] (≤ 2, in order) */
  Game.prototype.altAdds = function (id) {
    var node = this.node(id), s = this.altSel(id), out = [];
    if (s && node.alt) for (var i = 0; i < s.a.length; i++) { var e = node.alt[s.a[i]]; if (e && e.add) out.push(e.add); }
    return out;
  };
  /* what the player reads for node `id` (default: current): alt-resolved text + alt adds as separate paragraphs ("\n\n"); no grudge line */
  Game.prototype.nodeBody = function (id) {
    var tx = this.altText(id), ad = this.altAdds(id), z = tx.zh || "", e = tx.en || "";
    for (var i = 0; i < ad.length; i++) { z += "\n\n" + (ad[i].zh || ""); e += "\n\n" + (ad[i].en || ""); }
    return {zh: z, en: e};
  };
  /* SPEC §32.2: first matching choice.resultAlt entry's text for choice c, judged on the state BEFORE the choice's effects; "from" = the
   * node played before the current one (history). null = none → choice.result. */
  Game.prototype._resultAlt = function (c) {
    var ra = c && c.resultAlt, st = this.state;
    if (!Array.isArray(ra) || !ra.length) return null;
    var ctx = {state: st, prev: this._prevInfo(this._prevId())};
    for (var i = 0; i < ra.length; i++) if (ra[i] && ra[i].text && condOK(ra[i]["if"], ctx)) return ra[i].text;
    return null;
  };

  Game.prototype._enter = function (id, step) {
    var node = this.node(id), st = this.state;
    var prev = this._prevInfo(st.nodeId);                      // SPEC §32.2: the node played before this one (null at a run's start)
    step.nodeId = id;
    st.nodeId = id;
    st.altSel = this._resolveAlt(id, node, prev);              // arrival state: before this node's own effects
    st.deathPending = null;
    st.rumor = null;
    st.echo = null;
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
      } else if (!node.eventRoll) {
        this._rollRumor(node, step);
        if (!step.rumor) this._rollEcho(node, step);
      }
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

  /* SPEC §20b: how many `when` criteria a node context matches (0 = not relevant). ctx: {scene, sprites[], codex[], flags{}, zh, en} */
  function lc(x) { return String(x || "").toLowerCase(); }
  function rumorScore(r, ctx) {
    var w = r && r.when, n = 0, i;
    if (!w || typeof w !== "object") return 0;
    var anyIn = function (list, set) { if (!Array.isArray(list)) return false; for (var j = 0; j < list.length; j++) if (set.indexOf(list[j]) >= 0) return true; return false; };
    if (anyIn(w.scenes, ctx.scene ? [ctx.scene] : [])) n++;
    if (anyIn(w.sprites, ctx.sprites || [])) n++;
    if (anyIn(w.codex, ctx.codex || [])) n++;
    if (Array.isArray(w.flags)) for (i = 0; i < w.flags.length; i++) if (ctx.flags && ctx.flags[w.flags[i]]) { n++; break; }
    if (w.keywords && typeof w.keywords === "object") {
      var hay = lc(ctx.zh) + "\n" + lc(ctx.en), kws = [].concat(w.keywords.zh || [], w.keywords.en || []);   // language-independent
      for (i = 0; i < kws.length; i++) if (kws[i] && hay.indexOf(lc(kws[i])) >= 0) { n++; break; }
    }
    return n;
  }
  function nodeContext(node, flags) {
    var t = node.text || {};
    return {scene: node.scene || null, sprites: [node.speaker && node.speaker.sprite, node.foe].filter(Boolean),
            codex: [].concat(node.codex || []), flags: flags || {}, zh: t.zh || "", en: t.en || ""};
  }
  /* SPEC §20c: rumours are heard only where people gather */
  function isGather(node) {
    var g = node && node.gather;
    return !!(g && typeof g === "object" && (g.zh || g.en));
  }
  /* the rumour candidates of node `id` (default: current), best score first: [{rumor, score}] — every eligible unseen rumour
   * (score 0 = no `when` criterion matches, still allowed in a crowd); [] for nodes that are not gathering places. No RNG draws. */
  Game.prototype.rumorMatches = function (id, chapter) {
    var st = this.state, node = this.node(id === undefined ? st.nodeId : id);
    if (!isGather(node)) return [];
    var ch = chapter !== undefined ? chapter : (typeof node.chapter === "number" ? node.chapter : st.chapter);
    var ctx = nodeContext(node, st.flags), out = [];
    this.eligibleRumors(ch).forEach(function (r) { out.push({rumor: r, score: rumorScore(r, ctx)}); });
    out.sort(function (a, b) { return b.score - a.score; });
    return out;
  };
  /* spacing / per-chapter cap (SPEC §20b) from state.rumorLog [{id, visit, chapter}] */
  Game.prototype.rumorAllowed = function (chapter) {
    var log = (this.state && this.state.rumorLog) || [], last = log[log.length - 1], n = 0;
    if (last && this.state.visits - last.visit < RUMOR_GAP) return false;
    for (var i = 0; i < log.length; i++) if (log[i].chapter === chapter) n++;
    return n < RUMOR_PER_CHAPTER;
  };

  /* ---------- SPEC §27 echoes ---------- */
  /* absolute in-game time as a number: mill×1000 + year + fraction of the year (comparable across routes) */
  function dateKey(hours, startDate) { var d = dateParts(hours, startDate); return d.mill * 1000 + d.year + ((hours || 0) % HOURS_PER_YEAR) / HOURS_PER_YEAR; }
  function fillEcho(tpl, e, lang) {
    var gods = (WH.echoGods) || {}, pick = function (o) { return o && typeof o === "object" ? (o[lang] || o.zh || o.en || "") : (o || ""); };
    return String(pick(tpl.text)).replace(/\{(role|world|cause|god)\}/g, function (m, k) {
      if (k === "god") return pick(gods[e.claimedBy]) || e.claimedBy || "";
      return pick(e[k]);
    });
  }
  Game.prototype.dateKey = function () { return dateKey(this.state.hours, this.faction.startDate); };
  /* past-run echoes that could be heard now (date ≤ now; other routes first) */
  Game.prototype.echoCandidates = function () {
    var now = this.dateKey(), fid = this.faction.id, pool = (this.echoPool || []).filter(function (r) {
      return r && r.echo && typeof r.echo.dateKey === "number" && r.echo.dateKey <= now + 1e-9; });
    var other = pool.filter(function (r) { return r.echo.faction !== fid; });
    return other.length ? other : pool;
  };
  Game.prototype.echoTemplates = function (claim) {
    var fid = this.faction.id;
    return (this.data.echoTemplates || []).filter(function (tp) {
      if (!tp || !tp.text || !!tp.claim !== !!claim) return false;
      var fs = tp.factions || ["*"];
      return fs.indexOf("*") >= 0 || fs.indexOf(fid) >= 0;
    });
  };
  Game.prototype._rollEcho = function (node, step) {
    var st = this.state;
    if (!isGather(node)) return;                           // SPEC §20c: overheard where people gather, like a rumour
    if (!this.echoes || st.echoRun || !(this.echoPool && this.echoPool.length)) return;
    var ch = typeof node.chapter === "number" ? node.chapter : st.chapter;
    if (ch < 2) return;
    var log = st.rumorLog || [], last = log[log.length - 1];
    if (last && st.visits - last.visit < RUMOR_GAP) return;
    var cands = this.echoCandidates();
    if (!cands.length) return;
    if (this.echoRng() >= this.echoChance) return;
    var run = cands[Math.min(cands.length - 1, Math.floor(this.echoRng() * cands.length))], e = run.echo;
    var tpls = this.echoTemplates(!!e.claimedBy);
    if (!tpls.length) return;
    var tpl = tpls[Math.min(tpls.length - 1, Math.floor(this.echoRng() * tpls.length))];
    st.echo = {runId: run.runId, endingId: run.endingId || null, template: tpl.id || null, text: {zh: fillEcho(tpl, e, "zh"), en: fillEcho(tpl, e, "en")}};
    st.echoRun = run.runId;
    step.echo = st.echo;
  };
  Game.prototype.currentEcho = function () { return this.state && this.state.echo ? this.state.echo : null; };

  /* called by _enter for nodes without eventRoll / ending / pending death; SPEC §20c: acts only on gather nodes; draws from rumorRng
   * only when a candidate exists */
  Game.prototype._rollRumor = function (node, step) {
    var st = this.state;
    if (!isGather(node)) return;
    if (!this.rumors || !(this.data.rumors && this.data.rumors.length)) return;
    var ch = typeof node.chapter === "number" ? node.chapter : st.chapter;
    if (!this.rumorAllowed(ch)) return;
    var m = this.rumorMatches(st.nodeId, ch);
    if (!m.length) return;
    var best = m[0].score, top = m.filter(function (x) { return x.score === best; });
    var p = this.rumorChance !== null && this.rumorChance !== undefined ? this.rumorChance : (best >= 2 ? RUMOR_P2 : best === 1 ? RUMOR_P1 : RUMOR_P0);
    if (this.rumorRng() >= p) return;
    var pick = top.length > 1 ? top[Math.min(top.length - 1, Math.floor(this.rumorRng() * top.length))] : top[0], r = pick.rumor;
    if (!st.seenRumors) st.seenRumors = [];
    if (!st.rumorLog) st.rumorLog = [];
    st.seenRumors.push(r.id);
    st.rumorLog.push({id: r.id, visit: st.visits, chapter: ch, score: pick.score});
    st.rumor = r.id;
    step.rumor = r;
    step.rumorScore = pick.score;
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
      var gr = ok ? grudgeOf(c, st) : null;                // SPEC §28 (locked choices unaffected)
      var ent = {index: i, choice: c, locked: !ok,
                 roll: c.roll ? {pEff: rollChance(c.roll, st.stats, gr ? gr.p : 0), stat: c.roll.stat || null} : null};
      if (gr) ent.grudge = gr;
      out.push(ent);
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

  /* SPEC §28: the current node's presence line while its grudge is active → {npc, text:{zh,en}} or null */
  Game.prototype.grudgeLine = function (id) {
    var st = this.state;
    if (!st) return null;
    var node;
    try { node = this.node(id); } catch (e) { return null; }
    var gl = node && node.grudgeLine;
    return (gl && gl.text && grudgeActive(gl, st.flags)) ? gl : null;
  };
  /* node text {zh,en} with the active grudge line appended */
  Game.prototype.nodeText = function (id) {
    var gl = this.grudgeLine(id), tx = this.nodeBody(id);          // SPEC §32.2: alt-resolved text + alt adds
    if (!gl) return tx;
    return {zh: (tx.zh || "") + (gl.text.zh || ""), en: (tx.en || "") + " " + (gl.text.en || "")};
  };
  /* npc ids currently wronged and not forgiven */
  Game.prototype.activeGrudgeNpcs = function () {
    var fl = (this.state && this.state.flags) || {}, out = [];
    for (var k in fl) if (k.indexOf("wronged_") === 0 && fl[k] && !fl["forgiven_" + k.slice(8)]) out.push(k.slice(8));
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
    if (this.rewindEnabled) this._pushSnapshot();                             // SPEC §30: state + RNG before the choice
    var c = v.choice, gr = v.grudge || null, resAlt = this._resultAlt(c);     // SPEC §32.2: judged before the choice's effects
    if (gr) step.grudge = {npc: gr.npc, note: gr.note};                       // SPEC §28
    step.choiceDeltas = this._applyEffects(gr ? mergeEffects(c.effects, gr.effects) : c.effects, step.deltas);
    this._unlock(c.codex, step);
    var cause = this.deathCause();
    if (cause) {
      step.death = cause;
      step = this._enter(this.deathNodeId(cause), step);
      step.consequence = consequenceOf(c, step, false, resAlt);
      return step;
    }
    var target = c.next;
    if (c.roll) {
      var p = rollChance(c.roll, st.stats, gr ? gr.p : 0), r = this.rng(), ok = r < p;
      step.roll = {pEff: p, success: ok, stat: c.roll.stat || null};
      target = ok ? c.roll.success : c.roll.fail;
    }
    step = this._goTo(target, step);
    step.consequence = consequenceOf(c, step, false, resAlt);
    return step;
  };

  /* ---------- rewind (SPEC §30) ---------- */
  var REWIND_MAX = 30;
  function rngState(r) { return r && typeof r.getState === "function" ? r.getState() : null; }
  function rngRestore(r, v) { if (v !== null && r && typeof r.setState === "function") r.setState(v); }
  Game.prototype._pushSnapshot = function () {
    this.rewindStack.push({st: JSON.parse(JSON.stringify(this.state)), rng: rngState(this.rng), rumorRng: rngState(this.rumorRng), echoRng: rngState(this.echoRng)});
    if (this.rewindStack.length > REWIND_MAX) this.rewindStack.shift();
  };
  Game.prototype.setRewind = function (on) {
    this.rewindEnabled = !!on;
    if (!on) this.rewindStack = [];                                  // off = nothing kept
  };
  Game.prototype.canRewind = function () { return !!(this.rewindEnabled && this.state && this.rewindStack.length); };
  /* back to just before the last choice: complete state + all three RNG streams. Codex entries unlocked since stay unlocked
   * (state.codex only grows), and real play time keeps counting. Returns true if a snapshot was restored. */
  Game.prototype.rewind = function () {
    if (!this.canRewind()) return false;
    var snap = this.rewindStack.pop(), cur = this.state, st = snap.st;
    st.playMs = cur.playMs;
    for (var i = 0; i < cur.codex.length; i++) if (st.codex.indexOf(cur.codex[i]) < 0) st.codex.push(cur.codex[i]);
    this.state = st;
    rngRestore(this.rng, snap.rng); rngRestore(this.rumorRng, snap.rumorRng); rngRestore(this.echoRng, snap.echoRng);
    this.rewindCount++;
    return true;
  };

  /* SPEC §32.3: node = the node about to be entered (id string or node object); with it, events' `where` is matched against that node and the
   * arrival state. Without it (legacy callers) `where` is ignored. */
  Game.prototype.eligibleEvents = function (chapter, node) {
    var out = [], evs = this.data.events || [], st = this.state, nid = null, nobj = null;
    if (typeof node === "string") { nid = node; nobj = (this.faction.nodes && this.faction.nodes[node]) || null; }
    else if (node && typeof node === "object") {
      nobj = node;
      for (var k in (this.faction.nodes || {})) if (this.faction.nodes[k] === node) { nid = k; break; }
    }
    for (var i = 0; i < evs.length; i++) {
      var e = evs[i];
      if (st.seenEvents.indexOf(e.id) >= 0) continue;
      var fs = e.factions || ["*"];
      if (fs.indexOf("*") < 0 && fs.indexOf(st.faction) < 0) continue;
      if (e.excludeFactions && e.excludeFactions.indexOf(st.faction) >= 0) continue;
      if (nobj && e.where && !whereOK(e.where, nobj, nid, st)) continue;
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
      var pool = this.eligibleEvents(ch, target);
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
      codex: st.codex.slice(), seenEvents: st.seenEvents.slice(), seenRumors: (st.seenRumors || []).slice(), rumor: st.rumor || null,
      rumorLog: JSON.parse(JSON.stringify(st.rumorLog || [])), echo: st.echo ? JSON.parse(JSON.stringify(st.echo)) : null, echoRun: st.echoRun || null,
      hours: st.hours,
      taint: JSON.parse(JSON.stringify(st.taint || zeroTaint())), claims: JSON.parse(JSON.stringify(st.claims || {})),
      pendingEvent: st.pendingEvent, pendingNext: st.pendingNext,
      eventChoice: st.eventChoice, eventDeath: st.eventDeath, deathPending: st.deathPending,
      history: st.history.slice(), visits: st.visits, playMs: Math.round(st.playMs), ended: st.ended
    };
    if (this.rewindCount) rec.rewinds = this.rewindCount;                                  // SPEC §30 (absent = 0, no schema change)
    if (st.altSel) rec.altSel = JSON.parse(JSON.stringify(st.altSel));                     // SPEC §32.2 (additive: the alt entries chosen on arrival)
    if (extra) for (var k in extra) rec[k] = extra[k];
    // SPEC §22: fields this version doesn't know (written by a newer/older build) survive a load → save round trip
    if (this.extraFields) for (var x in this.extraFields) if (!has(rec, x)) rec[x] = this.extraFields[x];
    return rec;
  };
  var RECORD_KEYS = ["schema", "gameVersion", "savedAt", "faction", "origin", "runId", "nodeId", "chapter", "max", "stats", "flags", "codex",
    "seenEvents", "seenRumors", "rumor", "rumorLog", "echo", "echoRun", "hours", "taint", "claims", "pendingEvent", "pendingNext", "eventChoice", "eventDeath",
    "deathPending", "history", "visits", "playMs", "ended", "lang", "rewinds", "altSel"];

  /* ---------- SPEC §32.4 save fallback ----------
   * A saved node id that no longer exists → the first node of the saved chapter: chapter 1 → the origin's startNode; otherwise the chapter's
   * lowest-numbered `bridge` node, else its lowest-numbered entry node (reached from an earlier chapter), else its lowest-numbered node
   * (endings and origin prologue nodes `<prefix>o_*` excluded). A chapter without nodes falls back to the previous chapters, then the start node. */
  function natCmp(a, b) {
    var x = String(a).split(/(\d+)/), y = String(b).split(/(\d+)/);
    for (var i = 0; i < Math.max(x.length, y.length); i++) {
      if (x[i] === y[i]) continue;
      if (x[i] === undefined) return -1;
      if (y[i] === undefined) return 1;
      var p = parseInt(x[i], 10), q = parseInt(y[i], 10);
      if (i % 2 === 1 && !isNaN(p) && !isNaN(q) && p !== q) return p - q;
      return x[i] < y[i] ? -1 : 1;
    }
    return 0;
  }
  function fallbackNode(f, chapter, originId) {
    var nodes = (f && f.nodes) || {}, ids = Object.keys(nodes), o = findOrigin(f, originId);
    var startId = (o && o.startNode && nodes[o.startNode]) ? o.startNode : (nodes[f.startNode] ? f.startNode : ids.sort(natCmp)[0]);
    chapter = Math.floor(+chapter);
    if (!isFinite(chapter) || chapter <= 1) return startId;
    var entered = {};
    ids.forEach(function (id) {
      (nodes[id].choices || []).forEach(function (c) {
        [c.next, c.roll && c.roll.success, c.roll && c.roll.fail].forEach(function (t) {
          if (t && nodes[t] && typeof nodes[id].chapter === "number" && nodes[t].chapter > nodes[id].chapter) entered[t] = 1; });
      });
    });
    for (var ch = chapter; ch > 1; ch--) {
      var inCh = ids.filter(function (id) { var n = nodes[id]; return n.chapter === ch && !n.ending && !/^[a-z]+_o_/.test(id); }).sort(natCmp);
      if (!inCh.length) continue;
      var br = inCh.filter(function (id) { return nodes[id].bridge; }), en = inCh.filter(function (id) { return entered[id]; });
      return (br.length ? br : en.length ? en : inCh)[0];
    }
    return startId;
  }
  Game.fallbackNode = fallbackNode;

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
    st.echo = rec.echo && typeof rec.echo === "object" && rec.echo.text ? rec.echo : null;          // SPEC §27
    st.echoRun = typeof rec.echoRun === "string" ? rec.echoRun : null;
    st.rumorLog = Array.isArray(rec.rumorLog) ? rec.rumorLog.filter(function (x) { return x && typeof x.visit === "number"; }) : [];
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
    /* SPEC §32.4: the saved node (or the node an event was going to resume) no longer exists → chapter start, stats / flags kept */
    var nodeOK = function (id) { return !!(id && ((g.faction.nodes && g.faction.nodes[id]) || String(id).indexOf("__death_") === 0)); };
    var missing = !nodeOK(rec.nodeId) ? rec.nodeId : (st.pendingEvent && st.pendingNext && !nodeOK(st.pendingNext) ? st.pendingNext : null);
    if (missing) {
      var fb = fallbackNode(g.faction, st.chapter, st.origin);
      g.fallbackFrom = String(missing);
      if (st.deathPending || st.ended) {                              // a death or ending that belonged to the vanished node must not carry over
        if (st.stats.hp <= 0) st.stats.hp = 1;
        if (st.stats.sanity <= 0) st.stats.sanity = 1;
        if (st.stats.corruption >= 100) st.stats.corruption = 99;
      }
      st.nodeId = fb; st.deathPending = null; st.ended = false; st.rumor = null; st.echo = null;
      st.pendingEvent = null; st.pendingNext = null; st.eventChoice = null; st.eventDeath = null;
      st.history.push(fb);
      if (st.history.length > HISTORY_MAX) st.history.shift();
    }
    g.state = st;
    g.rewindCount = Math.max(0, Math.floor(+rec.rewinds || 0));
    g.extraFields = {};
    for (var rk in rec) if (has(rec, rk) && RECORD_KEYS.indexOf(rk) < 0) g.extraFields[rk] = JSON.parse(JSON.stringify(rec[rk]));
    if (!rec.claims) st.seenEvents.forEach(function (id) {             // pre-§19 saves: each claim event fired once
      var e = g.event(id); if (e && e.trigger === "claim" && GODS.indexOf(e.god) >= 0) st.claims[e.god] = Math.min(CLAIM_MAX, (st.claims[e.god] || 0) + 1); });
    var n = g.node();
    if (typeof n.chapter === "number") st.chapter = n.chapter;
    /* SPEC §32.2: the alt entries chosen on arrival come from the record when they still fit this node; older records / a changed node → re-resolved */
    var sel = rec.altSel, selOK = !missing && sel && typeof sel === "object" && sel.node === st.nodeId && typeof sel.t === "number" && Array.isArray(sel.a)
      && Array.isArray(n.alt) && sel.t < n.alt.length && sel.a.every(function (x) { return typeof x === "number" && x >= 0 && x < n.alt.length; });
    if (selOK) st.altSel = {node: sel.node, t: sel.t, a: sel.a.slice(0, ALT_ADD_MAX)};
    else if (Array.isArray(n.alt) && n.alt.length) st.altSel = g._resolveAlt(st.nodeId, n, g._prevInfo(missing ? null : g._prevId()));
    else st.altSel = null;
    return g;
  };

  /* ---------- SPEC §25 achievements: DOM-free evaluator over global stores ----------
   * S = {endingStats:{"fid:node":{count}}, codexGlobal:[ids], eggTiers:{tierId:date}, stats:<achStats>, data:WH}
   * achStats (whatiswh.achStats) = {resists, rumorsHeard, origins:{fid:{oid:1}}, flags:{fid:{flag:1}}, fastest, surviveMin:{hp,sanity}, taintMax}
   * Counts are "times reached" (endingStats counts), never distinct endings. */
  var ACH_TYPES = ["ending", "endingKind", "endingsAll", "claim", "claimAll", "chosen", "resist", "deaths", "runs", "origins", "factionsAll",
                   "codexPct", "chronicleAll", "rumors", "egg", "survive", "fast", "flag", "taintSum"];
  var EGG_AT = {25: "whisper", 50: "letter", 75: "flame", 99: "last", 100: "planned"};
  var CAT_TYPE = {leader: "figure", boss: "figure", enemy: "unit", god: "deity", lore: "concept", place: "place"};
  function achEmptyStats() { return {resists: 0, rumorsHeard: 0, origins: {}, flags: {}, fastest: null, surviveMin: {}, taintMax: 0}; }
  function endingRows(S) {
    var es = S.endingStats || {}, fs = (S.data && S.data.factions) || {}, out = [];
    for (var k in es) {
      var i = k.indexOf(":"), fid = k.slice(0, i), nid = k.slice(i + 1), c = (es[k] && +es[k].count) || 0;
      if (!c) continue;
      var f = fs[fid], n = f && f.nodes && f.nodes[nid], kind = n && n.ending ? n.ending.kind : null, cause = null;
      if (f && f.deathNodes) for (var dk in f.deathNodes) if (f.deathNodes[dk] === nid) cause = dk;
      out.push({faction: fid, node: nid, count: c, kind: kind, cause: cause});
    }
    return out;
  }
  function factionEndings(f) { return Object.keys((f && f.nodes) || {}).filter(function (id) { return f.nodes[id].ending; }); }
  /* → {ok, n, t} (n/t = progress for the UI) */
  function achEval(cond, S) {
    cond = cond || {};
    var type = Object.keys(cond)[0], c = cond[type] || {}, st = S.stats || achEmptyStats(), data = S.data || {};
    var rows = endingRows(S), fs = data.factions || {}, sum = function (f) { return rows.filter(f).reduce(function (a, r) { return a + r.count; }, 0); };
    var cnt = function (n, t) { t = Math.max(1, t || 1); return {ok: n >= t, n: Math.min(n, t), t: t}; };
    var cg = {}; (S.codexGlobal || []).forEach(function (id) { cg[id] = 1; });
    switch (type) {
      case "ending": return cnt(rows.some(function (r) { return r.node === c.id; }) ? 1 : 0, 1);
      case "endingKind": return cnt(sum(function (r) { return r.kind === c.kind && (!c.faction || r.faction === c.faction); }), c.count || 1);
      case "deaths": return cnt(sum(function (r) { return r.kind === "death" && (!c.cause || r.cause === c.cause) && (!c.faction || r.faction === c.faction); }), c.count || 1);
      case "runs": return cnt(sum(function () { return true; }), c.count || 1);
      case "endingsAll": {
        var all = factionEndings(fs[c.faction]), got = all.filter(function (id) { return rows.some(function (r) { return r.faction === c.faction && r.node === id; }); }).length;
        return all.length ? {ok: got === all.length, n: got, t: all.length} : {ok: false, n: 0, t: 0};
      }
      case "claim": return cnt(rows.some(function (r) { return claimGodOf(r.node) === c.god; }) ? 1 : 0, 1);
      case "claimAll": return cnt(GODS.filter(function (g) { return rows.some(function (r) { return claimGodOf(r.node) === g; }); }).length, 4);
      case "chosen": return cnt(rows.some(function (r) { return /_end_claim_(khorne|nurgle|tzeentch|slaanesh)_chosen$/.test(r.node); }) ? 1 : 0, 1);
      case "resist": return cnt(+st.resists || 0, c.count || 1);
      case "rumors": return cnt(+st.rumorsHeard || 0, c.count || 1);
      case "origins": {
        var os = origins(fs[c.faction]).map(function (o) { return o.id; }), done = (st.origins && st.origins[c.faction]) || {};
        var gotO = os.filter(function (o) { return done[o]; }).length;
        return os.length ? {ok: gotO === os.length, n: gotO, t: os.length} : {ok: false, n: 0, t: 0};
      }
      case "factionsAll": {
        var ids = Object.keys(fs), gotF = ids.filter(function (fid) { return rows.some(function (r) { return r.faction === fid && r.kind; }); }).length;
        return ids.length ? {ok: gotF === ids.length, n: gotF, t: ids.length} : {ok: false, n: 0, t: 0};
      }
      case "codexPct": case "chronicleAll": {
        var cx = data.codex || {}, pool = Object.keys(cx).filter(function (id) {
          var e = cx[id];
          if (!e || e.hidden) return false;
          if (type === "chronicleAll") return Array.isArray(e.tags) && e.tags.indexOf("chronicle") >= 0;
          if (c.type && (e.type || CAT_TYPE[e.cat] || "concept") !== c.type) return false;
          if (c.race && e.race !== c.race) return false;
          return true;
        });
        var gotC = pool.filter(function (id) { return cg[id]; }).length, need = type === "chronicleAll" ? pool.length : Math.ceil(pool.length * (c.pct || 0) / 100);
        return pool.length ? {ok: gotC >= need, n: Math.min(gotC, need), t: need} : {ok: false, n: 0, t: 0};
      }
      case "egg": {
        var tiers = (data.easter && data.easter.tzeentch && data.easter.tzeentch.tiers) || [], tid = EGG_AT[c.tier];
        tiers.forEach(function (x) { if (x.at === c.tier) tid = x.id; });
        return cnt(tid && S.eggTiers && S.eggTiers[tid] ? 1 : 0, 1);
      }
      case "survive": { var m = st.surviveMin && st.surviveMin[c.stat]; return cnt(typeof m === "number" && m <= c.max ? 1 : 0, 1); }
      case "fast": return cnt(typeof st.fastest === "number" && st.fastest <= c.maxNodes ? 1 : 0, 1);
      case "flag": {
        var fl = st.flags || {}, hit = c.faction ? !!(fl[c.faction] && fl[c.faction][c.id]) : Object.keys(fl).some(function (k) { return fl[k] && fl[k][c.id]; });
        return cnt(hit ? 1 : 0, 1);
      }
      case "taintSum": return cnt((+st.taintMax || 0) >= c.min ? 1 : 0, 1);
    }
    return {ok: false, n: 0, t: 0, unknown: true};
  }
  /* fold one finished run record into achStats (pure; returns the same object) */
  function achApplyRun(st, run) {
    st = st || achEmptyStats();
    if (!run) return st;
    if (run.faction && run.origin) { st.origins[run.faction] = st.origins[run.faction] || {}; st.origins[run.faction][run.origin] = 1; }
    if (run.faction && Array.isArray(run.flags)) { st.flags[run.faction] = st.flags[run.faction] || {}; run.flags.forEach(function (x) { st.flags[run.faction][x] = 1; }); }
    /* SPEC §30: what rewards one clean run (fast finish, low stats at a good ending, a taint peak) and the per-run resist tally (a continued run
     * writes several records, which would count the same resists twice) only count runs that never used a rewind */
    if (run.rewinds > 0) return st;
    if (typeof run.resists === "number") st.resists = (st.resists || 0) + run.resists;
    if (typeof run.visits === "number" && run.visits > 0 && (st.fastest === null || st.fastest === undefined || run.visits < st.fastest)) st.fastest = run.visits;
    if (run.kind === "good" && run.endStats) ["hp", "sanity"].forEach(function (k) {
      var v = run.endStats[k]; if (typeof v === "number" && (st.surviveMin[k] === undefined || v < st.surviveMin[k])) st.surviveMin[k] = v; });
    if (run.taint) { var ts = 0; GODS.forEach(function (g) { ts += +run.taint[g] || 0; }); if (ts > (st.taintMax || 0)) st.taintMax = ts; }
    return st;
  }
  WH.Achievements = {TYPES: ACH_TYPES, EGG_AT: EGG_AT, evaluate: achEval, applyRun: achApplyRun, emptyStats: achEmptyStats,
    /* ids of achievements whose condition holds now */
    unlockedNow: function (S) { return ((S.data && S.data.achievements) || []).filter(function (a) { return a && a.id && achEval(a.cond, S).ok; }).map(function (a) { return a.id; }); }};

  WH.RNG = RNG;
  WH.Game = Game;
  WH.newGame = function (factionId, originId, opts) {
    var g = new Game(factionId, opts);
    return {game: g, step: g.start(originId)};
  };
  WH.Rules = {
    condOK: condOK, whereOK: whereOK, fallbackNode: fallbackNode,
    STATS: STATS, GODS: GODS, zeroTaint: zeroTaint, CLAIM_MAX: CLAIM_MAX, claimGodOf: claimGodOf, godCodexId: godCodexId, clamp: clamp, rollChance: rollChance, requireOK: requireOK, grudgeActive: grudgeActive, grudgeOf: grudgeOf, mergeEffects: mergeEffects,
    timeHours: timeHours, dateParts: dateParts, startHours: startHours, consequenceOf: consequenceOf, hasDeltas: hasDeltas,
    WARP_MIN: WARP_MIN, WARP_MAX: WARP_MAX, HOURS_PER_YEAR: HOURS_PER_YEAR, RUMOR_P: RUMOR_P, RUMOR_P0: RUMOR_P0, RUMOR_P1: RUMOR_P1, RUMOR_P2: RUMOR_P2, RUMOR_GAP: RUMOR_GAP, RUMOR_PER_CHAPTER: RUMOR_PER_CHAPTER,
    rumorEligible: rumorEligible, rumorScore: rumorScore, nodeContext: nodeContext, isGather: isGather,
    ECHO_P: ECHO_P, dateKey: dateKey, fillEcho: fillEcho,
    capsOf: capsOf, CAP_MIN: CAP_MIN, CAP_MAX: CAP_MAX, CAP_DEFAULT: CAP_DEFAULT, CAPPED: CAPPED
  };
})(typeof window !== "undefined" ? window : globalThis);
