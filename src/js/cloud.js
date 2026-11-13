/* cloud.js — optional cloud save mirror (SPEC §34). Owned by: web.
 * Only does anything inside a claude.ai artifact whose page declares the `db` + `user` capabilities (window.claude.use exists
 * and the viewer is signed in with write access). Everywhere else (file://, GitHub Pages, signed-out viewers) it stays "off" and the
 * game keeps using localStorage exactly as before.
 *
 * What is mirrored: Save.exportAll() minus bak.* / lastVersion, as one JSON text split into 60 000-char chunks in the viewer's PRIVATE
 * subtree  data/users/<id>/sv_0 … sv_<n-1>  plus  sv_meta {n, t, bytes, ver}  (a db document is capped at 256 KiB).
 * Boot: read → Save.importAll(backup, {newer:true}) (union of records / codex, newer save slot wins, never deletes) → push the merged result.
 * Afterwards every local write schedules a debounced push (only when the text changed). A failed or unreadable pull never pushes, so an
 * empty or stale browser can't overwrite the cloud copy.  API: WH.Cloud.{available, status, lastAt, onStatus(fn), syncNow(), debounce}.
 */
(function (root) {
  var WH = root.WH = root.WH || {};
  var Save = WH.Save;
  var CHUNK = 60000, TIMEOUT = 12000, MAX_CHUNKS = 64;
  var Cloud = WH.Cloud = {available: false, status: "off", lastAt: null, error: null, debounce: 5000, remoteN: 0};
  var listeners = [], col = null, ready = false, pushing = false, dirty = false, timer = null, retryTimer = null, lastSent = null, syncing = false, tries = 0;

  function setStatus(s, err) {
    Cloud.status = s; Cloud.error = err || null;
    for (var i = 0; i < listeners.length; i++) { try { listeners[i](s); } catch (e) { /* ignore */ } }
  }
  Cloud.onStatus = function (fn) { if (typeof fn === "function") listeners.push(fn); };

  function withTimeout(p, ms) {
    return new Promise(function (resolve, reject) {
      var t = setTimeout(function () { reject({code: "timeout"}); }, ms);
      Promise.resolve(p).then(function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(e); });
    });
  }

  /* the text that is mirrored; deterministic so "unchanged" can be detected */
  function snapshot() {
    var b = Save.exportAll(), d = {};
    Object.keys(b.data).forEach(function (k) {
      if (k.indexOf("bak.") === 0 || k === "lastVersion") return;
      d[k] = b.data[k];
    });
    return JSON.stringify({format: b.format, backupVersion: b.backupVersion, gameVersion: b.gameVersion, data: d});
  }

  /* → null (nothing stored yet) | {text, n} | throws {code:"broken"} */
  function readRemote() {
    return col.doc("sv_meta").get().then(function (m) {
      if (!m.exists) return null;
      var meta = m.data() || {}, n = meta.n | 0;
      if (!(n >= 1 && n <= MAX_CHUNKS)) throw {code: "broken"};
      var ps = [];
      for (var i = 0; i < n; i++) ps.push(col.doc("sv_" + i).get());
      return Promise.all(ps).then(function (snaps) {
        var text = "";
        for (var j = 0; j < snaps.length; j++) {
          var dd = snaps[j].exists && snaps[j].data();
          if (!dd || typeof dd.s !== "string") throw {code: "broken"};
          text += dd.s;
        }
        return {text: text, n: n};
      });
    });
  }

  /* merge the cloud copy into this browser → summary (or null when the cloud is empty) */
  function pull() {
    syncing = true;
    return readRemote().then(function (r) {
      if (!r) { Cloud.remoteN = 0; return null; }
      Cloud.remoteN = r.n;
      var p = Save.parseBackup(r.text);
      if (!p.ok) throw {code: "broken"};
      var sum = Save.importAll(p.backup, {newer: true});
      lastSent = r.text === snapshot() ? r.text : lastSent;        // identical after the merge → nothing to push
      return sum;
    }).then(function (sum) { syncing = false; return sum; }, function (e) { syncing = false; throw e; });
  }

  function pushNow() {
    if (!ready) return Promise.resolve();
    if (pushing) { dirty = true; return Promise.resolve(); }
    var text = snapshot();
    if (text === lastSent) { if (Cloud.status !== "ok") setStatus("ok"); return Promise.resolve(); }
    pushing = true; setStatus("syncing");
    var n = Math.max(1, Math.ceil(text.length / CHUNK)), prevN = Cloud.remoteN, chain = Promise.resolve();
    if (n > MAX_CHUNKS) { pushing = false; setStatus("error", "too_big"); return Promise.resolve(); }
    var put = function (i) { return function () { return col.doc("sv_" + i).set({i: i, s: text.slice(i * CHUNK, (i + 1) * CHUNK)}); }; };
    for (var i = 0; i < n; i++) chain = chain.then(put(i));
    chain = chain.then(function () { return col.doc("sv_meta").set({n: n, t: Date.now(), bytes: text.length, ver: WH.VERSION || ""}); });
    chain = chain.then(function () {
      var dels = [];
      for (var j = n; j < prevN; j++) dels.push(col.doc("sv_" + j).delete());
      return Promise.all(dels);
    });
    return chain.then(function () {
      lastSent = text; Cloud.remoteN = n; Cloud.lastAt = Date.now(); tries = 0;
      pushing = false; setStatus("ok");
      if (dirty) { dirty = false; schedule(); }
    }, function (e) {
      pushing = false; dirty = false;
      fail(e, schedule);
    });
  }

  function schedule() {
    if (!ready || syncing) return;
    clearTimeout(timer);
    timer = setTimeout(function () { timer = null; pushNow(); }, Cloud.debounce);
  }

  /* terminal codes stop syncing for this visit; anything else retries a few times */
  function fail(e, again) {
    var code = (e && e.code) || "unknown";
    setStatus("error", code);
    if (["quota_exceeded", "invalid_argument", "revoked", "not_granted", "capability_disabled", "capability_removed"].indexOf(code) >= 0 || ++tries > 4) { ready = false; return; }
    clearTimeout(retryTimer);
    retryTimer = setTimeout(again, 20000 * tries);
  }

  function connect() {
    var c = root.claude;
    if (!c || typeof c.use !== "function") return false;
    setStatus("connecting");
    Promise.all([withTimeout(c.use("db"), TIMEOUT), withTimeout(c.use("user"), TIMEOUT)]).then(function (r) {
      var db = r[0], user = r[1];
      if (!db || !user || typeof user.id !== "function") throw {code: "off"};   // capability not declared / not served: hidden, silent
      Cloud.available = true;                                                  // from here on Settings shows the cloud row
      return user.id().then(function (id) {
        if (!id) throw {code: "off"};
        col = db.collection("data/users/" + id);
      });
    }).then(function () {
      return pull();
    }).then(function (sum) {
      ready = true;
      if (sum && WH.UI && WH.UI.cloudPulled) WH.UI.cloudPulled(sum);
      return pushNow();
    }).then(function () {
      if (Cloud.status === "connecting") setStatus("ok");
    }, function (e) {
      var code = (e && e.code) || "unknown";
      if (code === "off") { setStatus("off", "off"); return; }          // signed out / no db here: stay local, no retries
      fail(e, connect);
    });
    return true;
  }

  /* "立即同步": pull again (merge), then push */
  Cloud.syncNow = function () {
    if (!col) { if (Cloud.status !== "connecting") connect(); return Promise.resolve(); }
    if (pushing || syncing) return Promise.resolve();
    setStatus("syncing");
    return pull().then(function (sum) {
      ready = true;
      if (sum && WH.UI && WH.UI.cloudPulled) WH.UI.cloudPulled(sum);
      lastSent = null;                                                   // force one push so the cloud copy is current
      return pushNow();
    }).then(null, function (e) { fail(e, Cloud.syncNow); });
  };

  /* hooks */
  if (Save && Save.onChange) Save.onChange(function (key) {
    if (!ready || syncing || /^(bak\.|corrupt\.)/.test(key) || key === "lastVersion") return;
    schedule();
  });
  if (root.document) root.document.addEventListener("visibilitychange", function () {
    if (root.document.visibilityState === "hidden" && ready && !pushing && !syncing) { clearTimeout(timer); pushNow(); }
  });

  /* window.claude is injected by the host; give it a moment before deciding this is not an artifact */
  var waited = 0;
  (function start() {
    if (connect()) return;
    if ((waited += 250) <= 3000) setTimeout(start, 250);
  })();
})(typeof window !== "undefined" ? window : this);
