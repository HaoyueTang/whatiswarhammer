/* main.js — boot. Owned by: web.
 *   index.html            real game (data/** + assets/**)
 *   index.html?sample=1   swaps in tools/dev/sample_data.js (dev/testing only)
 *   index.html?seed=123   deterministic RNG for new games (testing)
 */
(function () {
  "use strict";
  var WH = window.WH;

  function fatal(e) {
    var pre = document.createElement("pre");
    pre.style.cssText = "position:fixed;left:0;top:0;right:0;z-index:9999;margin:0;padding:12px;background:#200;color:#f99;font:12px monospace;white-space:pre-wrap";
    pre.textContent = "Boot error / 启动错误:\n" + (e && (e.stack || e.message) || e);
    document.body.appendChild(pre);
  }

  function boot() {
    try { WH.UI.init(); } catch (e) { fatal(e); throw e; }
  }

  if (/[?&]sample=1(&|$)/.test(location.search)) {
    WH.SAMPLE = true;
    WH.factions = {}; WH.events = []; WH.codex = {}; WH.rumors = []; WH.achievements = []; delete WH.difficulty;
    window.WH_LOAD_ERRORS = [];
    var s = document.createElement("script");
    s.src = "tools/dev/sample_data.js";
    s.onload = boot;
    s.onerror = function () { window.WH_LOAD_ERRORS.push({file: "tools/dev/sample_data.js", msg: "missing"}); boot(); };
    document.body.appendChild(s);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else boot();
})();
