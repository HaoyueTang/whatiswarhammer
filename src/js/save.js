/* save.js — save system (SPEC §9). Owned by: web.
 * localStorage (try/catch) with in-memory fallback. Keys: whatiswh.slot1..3, whatiswh.auto, whatiswh.settings, whatiswh.codexGlobal,
 * whatiswh.codexSeen (codex NEW badges), whatiswh.runs / runStats / endingStats / runsSeen (records).
 */
(function (root) {
  var WH = root.WH = root.WH || {};
  var PREFIX = "whatiswh.";
  /* schema 2 (v0.2): records carry `origin` (SPEC §16) and hidden `taint` (SPEC §18). registry.js (lead-owned) still says 1,
   * so the bump lives here; engine.toRecord reads WH.SAVE_SCHEMA. */
  WH.SAVE_SCHEMA = Math.max(WH.SAVE_SCHEMA || 1, 2);
  var SLOTS = ["slot1", "slot2", "slot3", "auto"];
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
    try { return JSON.parse(s); } catch (e) { return null; }
  }

  /* schema migrations: MIGRATE[n] upgrades a record from schema n to n+1 */
  var MIGRATE = {
    1: function (rec) {               // v0.1 → v0.2: no taint yet, origin = faction default
      rec.taint = rec.taint || {khorne: 0, nurgle: 0, tzeentch: 0, slaanesh: 0};
      if (rec.origin === undefined) rec.origin = null;
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
    var nodeOK = (f.nodes && f.nodes[rec.nodeId]) || rec.nodeId.indexOf("__death_") === 0;
    if (!nodeOK) return {ok: false, error: "err_node", arg: rec.nodeId};
    if (rec.pendingNext && !(f.nodes && f.nodes[rec.pendingNext])) return {ok: false, error: "err_node", arg: rec.pendingNext};
    if (!rec.stats || typeof rec.stats !== "object") return {ok: false, error: "err_schema"};
    if (rec.codex && !Array.isArray(rec.codex)) return {ok: false, error: "err_schema"};
    if (rec.seenEvents && !Array.isArray(rec.seenEvents)) return {ok: false, error: "err_schema"};
    if (rec.history && !Array.isArray(rec.history)) return {ok: false, error: "err_schema"};
    if (rec.flags && typeof rec.flags !== "object") return {ok: false, error: "err_schema"};
    return {ok: true, rec: rec};
  }

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
      return {lang: /^zh/i.test(nav) || !nav ? "zh" : "en", textSpeed: "normal", effects: true, musicVol: 60, sfxVol: 80, muted: false, loreCards: "new", knownHint: "toast", consequences: true};
    },
    loadSettings: function () {
      var d = Save.defaultSettings(), s = getJSON("settings") || {};
      for (var k in d) if (s[k] === undefined) s[k] = d[k];
      if (s.lang !== "zh" && s.lang !== "en") s.lang = d.lang;
      if (s.loreCards === "auto" || ["new", "all", "codex"].indexOf(s.loreCards) < 0) s.loreCards = "new";   // v0.1 "auto" → "new"
      if (s.knownHint !== "silent") s.knownHint = "toast";
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

    /* SPEC §17: faction-stat tip shown once per faction (whatiswh.tipsSeen = {faction: ISO date}) */
    tipSeen: function (fid) { var o = getJSON("tipsSeen"); return !!(o && o[fid]); },
    markTipSeen: function (fid) { var o = getJSON("tipsSeen") || {}; o[fid] = new Date().toISOString(); set("tipsSeen", JSON.stringify(o)); },

    /* finished-run records ("往生录"): whatiswh.runs (newest first, max 50), whatiswh.runStats (totals),
     * whatiswh.endingStats ({"faction:node": {count, first, best, firstAt}}), whatiswh.runsSeen (dedupe keys) */
    runs: function () { var a = getJSON("runs"); return Array.isArray(a) ? a : []; },
    runStats: function () {
      var s = getJSON("runStats");
      return (s && typeof s === "object") ? s : {runs: 0, deaths: 0, longest: 0, causes: {}};
    },
    endingStats: function () { var s = getJSON("endingStats"); return (s && typeof s === "object") ? s : {}; },
    /* returns {added, newRecord, run}; each runId+ending is counted once (reload / re-render safe) */
    addRun: function (run) {
      var key = run.runId + ":" + run.endingId;
      var seen = getJSON("runsSeen");
      if (!Array.isArray(seen)) seen = [];
      if (seen.indexOf(key) >= 0) return {added: false, newRecord: false, run: run};
      seen.push(key);
      if (seen.length > 500) seen = seen.slice(-500);
      set("runsSeen", JSON.stringify(seen));
      var runs = Save.runs();
      runs.unshift(run);
      if (runs.length > 50) runs = runs.slice(0, 50);
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
