/* save.js — save system (SPEC §9). Owned by: web.
 * localStorage (try/catch) with in-memory fallback. Keys: whatiswh.slot1..3, whatiswh.auto, whatiswh.settings, whatiswh.codexGlobal,
 * whatiswh.codexSeen (codex NEW badges), whatiswh.runs / runStats / endingStats / runsSeen (records), eggTiers, tipsSeen, lastVersion.
 * SPEC §22: NO version may delete, reset or rename whatiswh.* keys. Migrations work on a copy and keep unknown fields;
 * a corrupt JSON value is copied to whatiswh.corrupt.<key> before anything can overwrite it; whatiswh.lastVersion drives a
 * one-time "updated · data kept" notice (Save.bootCheck); exportAll / importAll move every key between browsers / addresses.
 */
(function (root) {
  var WH = root.WH = root.WH || {};
  var PREFIX = "whatiswh.";
  /* schema 2 (v0.2): records carry `origin` (SPEC §16) and hidden `taint` (SPEC §18). registry.js (lead-owned) still says 1,
   * so the bump lives here; engine.toRecord reads WH.SAVE_SCHEMA. v0.2.1 adds optional `claims:{god:n}` (SPEC §19) without a bump;
   * v0.2.2 adds optional `seenRumors:[id]` + `rumor:id|null` (SPEC §20), also without a bump (engine defaults them). */
  WH.SAVE_SCHEMA = Math.max(WH.SAVE_SCHEMA || 1, 2);
  var SLOTS = ["slot1", "slot2", "slot3", "auto"];
  var RUNS_MAX = 200;                // run records kept (v0.2.2: was 50; raised so records are effectively never dropped)
  var mem = {};
  var persistent = true;

  try {
    var t = PREFIX + "__test";
    root.localStorage.setItem(t, "1");
    root.localStorage.removeItem(t);
  } catch (e) { persistent = false; }

  function get(key) {
    if (persistent) { try { return root.localStorage.getItem(PREFIX + key); } catch (e) { persistent = false; } }
    return mem.hasOwnProperty(key) ? mem[key] : null;
  }
  function set(key, val) {
    mem[key] = val;
    if (persistent) { try { root.localStorage.setItem(PREFIX + key, val); return true; } catch (e) { persistent = false; } }
    return false;
  }
  function del(key) {
    delete mem[key];
    if (persistent) { try { root.localStorage.removeItem(PREFIX + key); } catch (e) { persistent = false; } }
  }
  function getJSON(key) {
    var s = get(key);
    if (!s) return null;
    try { return JSON.parse(s); }
    catch (e) {   // SPEC §22: keep the unreadable value (once) so a later write can never destroy it
      if (key.indexOf("corrupt.") !== 0 && get("corrupt." + key) === null) set("corrupt." + key, s);
      return null;
    }
  }
  /* every whatiswh.* key name (without prefix), from localStorage or the in-memory fallback */
  function allKeys() {
    var out = {}, k;
    for (k in mem) out[k] = 1;
    if (persistent) {
      try { for (var i = 0; i < root.localStorage.length; i++) { k = root.localStorage.key(i); if (k && k.indexOf(PREFIX) === 0) out[k.slice(PREFIX.length)] = 1; } }
      catch (e) { /* keep mem keys */ }
    }
    delete out.__test;
    return Object.keys(out).sort();
  }
  /* "0.2.10" > "0.2.9" */
  function cmpVer(a, b) {
    var x = String(a || "0").split(/[.\-+]/), y = String(b || "0").split(/[.\-+]/);
    for (var i = 0; i < Math.max(x.length, y.length); i++) {
      var p = parseInt(x[i] || "0", 10) || 0, q = parseInt(y[i] || "0", 10) || 0;
      if (p !== q) return p < q ? -1 : 1;
    }
    return 0;
  }

  /* schema migrations: MIGRATE[n] upgrades a record from schema n to n+1 */
  var MIGRATE = {
    1: function (rec) {               // v0.1 → v0.2: no taint yet, origin = faction default (only ADDS fields — SPEC §22)
      rec.taint = rec.taint || {khorne: 0, nurgle: 0, tzeentch: 0, slaanesh: 0};
      if (rec.origin === undefined) rec.origin = null;
      if (rec.seenRumors === undefined) rec.seenRumors = [];
      rec.schema = 2;
      return rec;
    }
  };
  function migrate(rec) {
    var cur = WH.SAVE_SCHEMA || 1;
    while (rec.schema < cur) {
      var fn = MIGRATE[rec.schema];
      if (!fn) { rec.schema = cur; break; }        // no migration needed for this step
      rec = fn(rec);
    }
    return rec;
  }

  /* returns {ok:true, rec} or {ok:false, error:"i18n key", arg} — never throws */
  function validate(rec) {
    if (!rec || typeof rec !== "object" || Array.isArray(rec)) return {ok: false, error: "err_schema"};
    if (typeof rec.schema !== "number" || typeof rec.faction !== "string" || typeof rec.nodeId !== "string") return {ok: false, error: "err_schema"};
    if (rec.schema > (WH.SAVE_SCHEMA || 1)) return {ok: false, error: "err_newer"};
    try { rec = migrate(JSON.parse(JSON.stringify(rec))); } catch (e) { return {ok: false, error: "err_schema"}; }
    var f = WH.factions && WH.factions[rec.faction];
    if (!f) return {ok: false, error: "err_faction", arg: rec.faction};
    /* SPEC §32.4: a node id that no longer exists is NOT an error any more — WH.Game.fromRecord moves the run to the start of the saved chapter
     * (stats / flags kept) and the UI shows a one-line notice. Unknown factions are still rejected. */
    if (!rec.stats || typeof rec.stats !== "object") return {ok: false, error: "err_schema"};
    if (rec.codex && !Array.isArray(rec.codex)) return {ok: false, error: "err_schema"};
    if (rec.seenEvents && !Array.isArray(rec.seenEvents)) return {ok: false, error: "err_schema"};
    if (rec.history && !Array.isArray(rec.history)) return {ok: false, error: "err_schema"};
    if (rec.flags && typeof rec.flags !== "object") return {ok: false, error: "err_schema"};
    // SPEC §19 (additive, no schema bump): per-god claim-event counts; absent in older saves (engine derives them)
    if (rec.claims !== undefined && (!rec.claims || typeof rec.claims !== "object" || Array.isArray(rec.claims))) return {ok: false, error: "err_schema"};
    // SPEC §20 (additive, no schema bump): rumours overheard this run + the one shown at the current node
    if (rec.seenRumors !== undefined && !Array.isArray(rec.seenRumors)) return {ok: false, error: "err_schema"};
    // SPEC §23 (additive): per-run caps; missing → 100/100 (engine fills it in)
    if (rec.max !== undefined && (!rec.max || typeof rec.max !== "object" || Array.isArray(rec.max))) return {ok: false, error: "err_schema"};
    if (rec.max === undefined) rec.max = {hp: 100, sanity: 100};
    if (rec.rumor !== undefined && rec.rumor !== null && typeof rec.rumor !== "string") return {ok: false, error: "err_schema"};
    if (rec.rumorLog !== undefined && !Array.isArray(rec.rumorLog)) return {ok: false, error: "err_schema"};   // SPEC §20b
    return {ok: true, rec: rec};
  }

  /* a finished run is counted once per (run, ending); records written after a SPEC §30 rewind carry rewinds ≥ 1 and get their own key */
  function runKey(r) { return r.runId + ":" + r.endingId + (r.rewinds > 0 ? ":r" + Math.floor(r.rewinds) : ""); }
  var Save = {
    PREFIX: PREFIX, SLOTS: SLOTS,
    isPersistent: function () { return persistent; },
    validate: validate, migrate: migrate, MIGRATE: MIGRATE,

    read: function (slot) {
      var r = getJSON(slot);
      if (!r) return null;
      var v = validate(r);
      return v.ok ? v.rec : null;
    },
    readRaw: function (slot) { return getJSON(slot); },
    write: function (slot, rec) { rec.savedAt = new Date().toISOString(); set(slot, JSON.stringify(rec)); return rec; },
    remove: function (slot) { del(slot); },
    list: function () {
      return SLOTS.map(function (s) { return {slot: s, rec: Save.read(s), raw: getJSON(s)}; });
    },
    latest: function () {
      var best = null;
      Save.list().forEach(function (e) {
        if (e.rec && !e.rec.ended && (!best || (e.rec.savedAt || "") > (best.rec.savedAt || ""))) best = e;
      });
      return best;
    },

    /* settings */
    defaultSettings: function () {
      var nav = (root.navigator && (root.navigator.language || "")) || "";
      return {lang: /^zh/i.test(nav) || !nav ? "zh" : "en", textSpeed: "normal", effects: true, musicVol: 60, sfxVol: 80, muted: false, loreCards: "new", keywordLinks: true, loreAsked: false, knownHint: "toast", consequences: true, rumors: true, echoes: true, tzeentchJoke: true, rewind: false, musicStyle: "chip", musicTrack: "auto"};
    },
    loadSettings: function () {
      var d = Save.defaultSettings(), s = getJSON("settings") || {};
      var askedStored = typeof s.loreAsked === "boolean";                  // SPEC §33: must be read before the defaults are merged in
      for (var k in d) if (s[k] === undefined) s[k] = d[k];
      if (s.lang !== "zh" && s.lang !== "en") s.lang = d.lang;
      if (s.loreCards === "auto" || ["new", "all", "codex"].indexOf(s.loreCards) < 0) s.loreCards = "new";   // v0.1 "auto" → "new"
      if (s.knownHint !== "silent") s.knownHint = "toast";
      s.keywordLinks = s.keywordLinks !== false;                           // SPEC §33: underlined codex terms inside story text
      if (!askedStored) s.loreAsked = Save.codexGlobal().length > 0 || Save.runs().length > 0;   // returning players are never asked
      s.rewind = s.rewind === true;                                        // SPEC §30 (default off)
      if (typeof s.musicStyle !== "string" || !/^[a-z0-9_-]{1,24}$/i.test(s.musicStyle)) s.musicStyle = "chip";   // SPEC §29 (audio.js maps unknown ids to chip)
      if (typeof s.musicTrack !== "string" || !/^[a-z0-9_-]{1,24}$/i.test(s.musicTrack)) s.musicTrack = "auto";   // SPEC §29b ("auto" or a mood id; the UI/audio.js map unknown ids to auto)
      return s;
    },
    saveSettings: function (s) { set("settings", JSON.stringify(s)); },

    /* codex progress across runs */
    codexGlobal: function () {
      var a = getJSON("codexGlobal");
      return Array.isArray(a) ? a : [];
    },
    addCodexGlobal: function (ids) {
      var a = Save.codexGlobal(), changed = false;
      (ids || []).forEach(function (id) { if (a.indexOf(id) < 0) { a.push(id); changed = true; } });
      if (changed) set("codexGlobal", JSON.stringify(a));
      return a;
    },

    /* codex "NEW" badges: ids already seen in the codex window (whatiswh.codexSeen). If the key does not exist yet
     * (first boot of v0.2), it is initialised from codexGlobal so upgrading players don't get 90 NEW badges. */
    codexSeen: function () {
      var a = getJSON("codexSeen");
      if (Array.isArray(a)) return a;
      a = Save.codexGlobal().slice();
      set("codexSeen", JSON.stringify(a));
      return a;
    },
    markCodexSeen: function (ids) {
      var a = Save.codexSeen(), changed = false;
      (ids || []).forEach(function (id) { if (a.indexOf(id) < 0) { a.push(id); changed = true; } });
      if (changed) set("codexSeen", JSON.stringify(a));
      return a;
    },
    /* unlocked (globally) but not yet seen in the codex window */
    codexUnseen: function () {
      var seen = {};
      Save.codexSeen().forEach(function (id) { seen[id] = 1; });
      return Save.codexGlobal().filter(function (id) { return !seen[id]; });
    },

    /* SPEC §25 achievements: whatiswh.achievements = {id: ISO date unlocked}; whatiswh.achStats = per-run extras that
     * endingStats can't give (resists, rumours heard, origins/flags finished, fastest run, lowest stat at a good end, max taint) */
    achievements: function () { var o = getJSON("achievements"); return (o && typeof o === "object" && !Array.isArray(o)) ? o : {}; },
    markAchievements: function (ids) {
      var o = Save.achievements(), added = [], now = new Date().toISOString();
      (ids || []).forEach(function (id) { if (!o[id]) { o[id] = now; added.push(id); } });
      if (added.length) set("achievements", JSON.stringify(o));
      return added;
    },
    achStats: function () { var o = getJSON("achStats"); return (o && typeof o === "object" && !Array.isArray(o)) ? o : null; },
    setAchStats: function (o) { set("achStats", JSON.stringify(o)); },

    /* SPEC §21: Tzeentch easter-egg tiers already triggered (whatiswh.eggTiers = {tierId: ISO date}) */
    eggTiers: function () { var o = getJSON("eggTiers"); return (o && typeof o === "object" && !Array.isArray(o)) ? o : {}; },
    markEggTier: function (id) { var o = Save.eggTiers(); if (!o[id]) { o[id] = new Date().toISOString(); set("eggTiers", JSON.stringify(o)); } return o; },

    /* SPEC §17: faction-stat tip shown once per faction (whatiswh.tipsSeen = {faction: ISO date}) */
    tipSeen: function (fid) { var o = getJSON("tipsSeen"); return !!(o && o[fid]); },
    markTipSeen: function (fid) { var o = getJSON("tipsSeen") || {}; o[fid] = new Date().toISOString(); set("tipsSeen", JSON.stringify(o)); },

    /* finished-run records ("往生录"): whatiswh.runs (newest first, max RUNS_MAX), whatiswh.runStats (totals),
     * whatiswh.endingStats ({"faction:node": {count, first, best, firstAt}}), whatiswh.runsSeen (dedupe keys) */
    runs: function () { var a = getJSON("runs"); return Array.isArray(a) ? a : []; },
    runStats: function () {
      var s = getJSON("runStats");
      return (s && typeof s === "object") ? s : {runs: 0, deaths: 0, longest: 0, causes: {}};
    },
    endingStats: function () { var s = getJSON("endingStats"); return (s && typeof s === "object") ? s : {}; },
    /* returns {added, newRecord, run}; each runId+ending is counted once (reload / re-render safe) */
    addRun: function (run) {
      var key = runKey(run);
      var seen = getJSON("runsSeen");
      if (!Array.isArray(seen)) seen = [];
      if (seen.indexOf(key) >= 0) return {added: false, newRecord: false, run: run};
      seen.push(key);
      if (seen.length > 500) seen = seen.slice(-500);
      set("runsSeen", JSON.stringify(seen));
      var runs = Save.runs();
      runs.unshift(run);
      if (runs.length > RUNS_MAX) runs = runs.slice(0, RUNS_MAX);
      set("runs", JSON.stringify(runs));
      var st = Save.runStats();
      var newRecord = st.runs > 0 && run.survived > (st.longest || 0);
      st.runs = (st.runs || 0) + 1;
      if (run.kind === "death") st.deaths = (st.deaths || 0) + 1;
      if (run.survived > (st.longest || 0)) st.longest = run.survived;
      if (run.kind !== "good" && run.cause) {
        st.causes = st.causes || {};
        var ck = run.cause.en || run.cause.zh;
        var c = st.causes[ck] || {count: 0, label: run.cause};
        c.count++; st.causes[ck] = c;
      }
      set("runStats", JSON.stringify(st));
      var es = Save.endingStats(), ek = run.faction + ":" + run.endingId;
      var e = es[ek] || {count: 0, first: null, best: null, firstAt: null};
      e.count++;
      if (e.first === null) { e.first = run.survived; e.firstAt = run.at; }
      e.best = Math.max(e.best || 0, run.survived);
      es[ek] = e;
      set("endingStats", JSON.stringify(es));
      return {added: true, newRecord: newRecord, run: run};
    },
    /* clears the service record; ending collection (endingStats) and dedupe keys stay */
    clearRuns: function () { del("runs"); del("runStats"); },

    /* ---------- SPEC §22: version check, full backup, merge import ---------- */
    keys: allKeys, cmpVer: cmpVer,
    /* On boot: if whatiswh.lastVersion is older than WH.VERSION (or missing while progress exists), migrate every save slot
     * IN PLACE on a copy (unknown fields kept; the pre-migration text is kept as whatiswh.bak.<old version>.<slot>), then
     * record the new version. Returns {updated, from, to, migrated:[slots]} — the UI shows a one-time toast if updated.
     * Never deletes or renames a key. A downgrade (stored version newer) changes nothing. */
    bootCheck: function () {
      var cur = WH.VERSION || "0", last = get("lastVersion"), out = {updated: false, from: last, to: cur, migrated: []};
      var hasData = allKeys().some(function (k) { return k !== "lastVersion" && k !== "settings" && k.indexOf("corrupt.") !== 0; }) || get("settings") !== null;
      if (last && cmpVer(last, cur) >= 0) return out;
      if (!last && !hasData) { set("lastVersion", cur); return out; }       // fresh install: nothing to keep
      SLOTS.forEach(function (sl) {
        var raw = get(sl), obj;
        if (!raw) return;
        try { obj = JSON.parse(raw); } catch (e) { getJSON(sl); return; }    // unreadable → copied to corrupt.<slot>, left in place
        if (!obj || typeof obj.schema !== "number" || obj.schema >= (WH.SAVE_SCHEMA || 1)) return;
        var v = validate(obj);
        if (!v.ok) return;                                                   // e.g. a faction file is missing today: leave it alone
        var bk = "bak." + (last || "pre-" + cur) + "." + sl;
        if (get(bk) === null) set(bk, raw);
        set(sl, JSON.stringify(v.rec));
        out.migrated.push(sl);
      });
      set("lastVersion", cur);
      out.updated = true;
      return out;
    },
    /* every whatiswh.* key as one object (values parsed when they are JSON) */
    exportAll: function () {
      var data = {};
      allKeys().forEach(function (k) {
        if (k.indexOf("corrupt.") === 0) return;
        var v = get(k);
        try { data[k] = JSON.parse(v); } catch (e) { data[k] = v; }
      });
      return {format: "whatiswh-backup", backupVersion: 1, gameVersion: WH.VERSION || "0", exportedAt: new Date().toISOString(), prefix: PREFIX, data: data};
    },
    downloadAll: function () {
      var obj = Save.exportAll(), d = new Date(), pad = function (n) { return ("0" + n).slice(-2); };
      var blob = new Blob([JSON.stringify(obj, null, 1)], {type: "application/json"});
      var a = document.createElement("a");
      a.download = "whatiswarhammer_backup_" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "_" + pad(d.getHours()) + pad(d.getMinutes()) + ".json";
      a.href = URL.createObjectURL(blob);
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      return obj;
    },
    /* parse a backup (object or JSON text) → {ok, backup} | {ok:false, error} */
    parseBackup: function (x) {
      var o = x;
      if (typeof x === "string") { try { o = JSON.parse(x); } catch (e) { return {ok: false, error: "err_json"}; } }
      if (!o || o.format !== "whatiswh-backup" || !o.data || typeof o.data !== "object") return {ok: false, error: "err_backup"};
      return {ok: true, backup: o};
    },
    /* save slots in the backup that would overwrite a different local save */
    backupConflicts: function (b) {
      return SLOTS.filter(function (sl) { var v = b.data[sl], cur = get(sl); return v && cur !== null && JSON.stringify(v) !== cur; });
    },
    /* Merge a backup into this browser (SPEC §22): run records union by runId:endingId, codex / seen / tips / egg tiers union,
     * ending stats max, save slots only into empty slots unless opts.overwrite, settings only if none here, any other
     * unknown key only if missing here. Returns a summary. Never deletes anything. */
    importAll: function (b, opts) {
      opts = opts || {};
      var d = b.data, sum = {runs: 0, codex: 0, endings: 0, slots: [], skipped: [], keys: 0};
      var union = function (key) {
        if (!Array.isArray(d[key])) return 0;
        var a = getJSON(key); if (!Array.isArray(a)) a = [];
        var n = 0; d[key].forEach(function (x) { if (a.indexOf(x) < 0) { a.push(x); n++; } });
        if (n) set(key, JSON.stringify(a));
        return n;
      };
      var mergeObj = function (key) {          // {id: date} maps: keep the earliest
        var src = d[key]; if (!src || typeof src !== "object" || Array.isArray(src)) return;
        var o = getJSON(key) || {}, ch = false;
        for (var k in src) if (!o[k] || (src[k] && String(src[k]) < String(o[k]))) { o[k] = src[k]; ch = true; }
        if (ch) set(key, JSON.stringify(o));
      };
      sum.codex = union("codexGlobal");
      union("codexSeen");
      mergeObj("tipsSeen"); mergeObj("eggTiers"); mergeObj("achievements");
      if (d.achStats && typeof d.achStats === "object") {          // SPEC §25 counters: max / union / min — never lowered
        var a = Save.achStats() || {}, b = d.achStats;
        ["resists", "rumorsHeard", "taintMax"].forEach(function (k) { if ((+b[k] || 0) > (+a[k] || 0)) a[k] = +b[k]; });
        if (typeof b.fastest === "number" && (typeof a.fastest !== "number" || b.fastest < a.fastest)) a.fastest = b.fastest;
        ["origins", "flags"].forEach(function (k) { a[k] = a[k] || {}; for (var f in (b[k] || {})) { a[k][f] = a[k][f] || {}; for (var x in b[k][f]) a[k][f][x] = 1; } });
        a.surviveMin = a.surviveMin || {};
        for (var sk in (b.surviveMin || {})) if (typeof b.surviveMin[sk] === "number" && (typeof a.surviveMin[sk] !== "number" || b.surviveMin[sk] < a.surviveMin[sk])) a.surviveMin[sk] = b.surviveMin[sk];
        Save.setAchStats(a);
      }
      // run records
      if (Array.isArray(d.runs)) {
        var seen = getJSON("runsSeen"); if (!Array.isArray(seen)) seen = [];
        var runs = Save.runs(), st = Save.runStats(), fresh = !(st.runs > 0), have = {};
        runs.forEach(function (r) { have[runKey(r)] = 1; });
        d.runs.forEach(function (r) {
          if (!r || !r.runId) return;
          var key = runKey(r);
          if (have[key]) return;
          var counted = seen.indexOf(key) >= 0;
          have[key] = 1; runs.push(r); sum.runs++;
          if (!counted) seen.push(key);
          if (!fresh && !counted) {          // add its totals once (imported runStats are taken whole when this browser has none)
            st.runs = (st.runs || 0) + 1;
            if (r.kind === "death") st.deaths = (st.deaths || 0) + 1;
            if (r.survived > (st.longest || 0)) st.longest = r.survived;
            if (r.kind !== "good" && r.cause) { st.causes = st.causes || {}; var ck = r.cause.en || r.cause.zh, c = st.causes[ck] || {count: 0, label: r.cause}; c.count++; st.causes[ck] = c; }
          }
        });
        runs.sort(function (a, b) { return String(b.at || "") < String(a.at || "") ? -1 : String(b.at || "") > String(a.at || "") ? 1 : 0; });
        set("runs", JSON.stringify(runs));                                  // union: nothing imported is dropped
        if (Array.isArray(d.runsSeen)) d.runsSeen.forEach(function (k) { if (seen.indexOf(k) < 0) seen.push(k); });
        set("runsSeen", JSON.stringify(seen.slice(-1000)));
        if (fresh && d.runStats && typeof d.runStats === "object") st = d.runStats;
        set("runStats", JSON.stringify(st));
      } else if (d.runStats && !(Save.runStats().runs > 0)) set("runStats", JSON.stringify(d.runStats));
      // ending collection: max per ending
      if (d.endingStats && typeof d.endingStats === "object") {
        var es = Save.endingStats();
        for (var ek in d.endingStats) {
          var x = d.endingStats[ek], y = es[ek];
          if (!x) continue;
          if (!y) { es[ek] = x; sum.endings++; continue; }
          y.count = Math.max(y.count || 0, x.count || 0);
          y.best = Math.max(y.best || 0, x.best || 0);
          if (x.firstAt && (!y.firstAt || x.firstAt < y.firstAt)) { y.firstAt = x.firstAt; y.first = x.first; }
        }
        set("endingStats", JSON.stringify(es));
      }
      // save slots
      SLOTS.forEach(function (sl) {
        var v = d[sl];
        if (!v || typeof v !== "object") return;
        var cur = get(sl), txt = JSON.stringify(v);
        if (cur === txt) return;
        if (cur !== null && !opts.overwrite) { sum.skipped.push(sl); return; }
        if (cur !== null && get("bak.import." + sl) === null) set("bak.import." + sl, cur);
        set(sl, txt); sum.slots.push(sl);
      });
      if (d.settings && get("settings") === null) set("settings", JSON.stringify(d.settings));
      // any other key we don't know: copy only if missing here
      var known = ["codexGlobal", "codexSeen", "tipsSeen", "eggTiers", "achievements", "achStats", "runs", "runsSeen", "runStats", "endingStats", "settings", "lastVersion"].concat(SLOTS);
      for (var k in d) {
        if (known.indexOf(k) >= 0 || k.indexOf("corrupt.") === 0 || get(k) !== null) continue;
        set(k, typeof d[k] === "string" ? d[k] : JSON.stringify(d[k])); sum.keys++;
      }
      return sum;
    },

    /* JSON export / import (works from file://: Blob URL + FileReader) */
    exportRecord: function (rec) {
      var blob = new Blob([JSON.stringify(rec, null, 2)], {type: "application/json"});
      var a = document.createElement("a");
      var d = new Date(), pad = function (n) { return ("0" + n).slice(-2); };
      a.download = "whatiswarhammer_" + rec.faction + "_" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "_" + pad(d.getHours()) + pad(d.getMinutes()) + ".json";
      a.href = URL.createObjectURL(blob);
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    },
    /* cb({ok, rec} | {ok:false, error, arg}) */
    importFile: function (file, cb) {
      if (!file) return cb({ok: false, error: "err_schema"});
      var fr = new FileReader();
      fr.onerror = function () { cb({ok: false, error: "err_json"}); };
      fr.onload = function () {
        var obj;
        try { obj = JSON.parse(String(fr.result)); } catch (e) { return cb({ok: false, error: "err_json"}); }
        cb(validate(obj));
      };
      fr.readAsText(file);
    },
    importText: function (text) {
      var obj;
      try { obj = JSON.parse(text); } catch (e) { return {ok: false, error: "err_json"}; }
      return validate(obj);
    }
  };

  WH.Save = Save;
})(typeof window !== "undefined" ? window : globalThis);
