/* registry.js — shared global registry. Loaded FIRST. Owned by: lead (do not change API without updating docs/SPEC.md).
 * Data files (data/*.js, assets/manifest.js) call these functions; the engine reads WH.* afterwards.
 * Plain <script> loading (no fetch) so the game also runs from file:// by double-clicking index.html.
 */
(function (root) {
  var WH = root.WH = root.WH || {};
  WH.VERSION = "0.1.0";
  WH.SAVE_SCHEMA = 1;

  WH.factions = WH.factions || {};   // id -> faction object (see SPEC §3)
  WH.events   = WH.events   || [];   // random warp/chaos-god events (SPEC §5)
  WH.codex    = WH.codex    || {};   // id -> codex entry (SPEC §6)
  WH.sprites  = WH.sprites  || {};   // key -> {src,w,h,name}  (SPEC §7)
  WH.scenes   = WH.scenes   || {};   // key -> {src,w,h,name}  (SPEC §7)
  WH.ui       = WH.ui       || {};   // key -> {src,w,h}       (SPEC §7)

  WH.registerFaction = function (f) { WH.factions[f.id] = f; };
  WH.registerEvents  = function (list) { Array.prototype.push.apply(WH.events, list); };
  WH.registerCodex   = function (obj) { for (var k in obj) WH.codex[k] = obj[k]; };
  WH.registerSprites = function (obj) { for (var k in obj) WH.sprites[k] = obj[k]; };
  WH.registerScenes  = function (obj) { for (var k in obj) WH.scenes[k] = obj[k]; };
  WH.registerUI      = function (obj) { for (var k in obj) WH.ui[k] = obj[k]; };
})(typeof window !== "undefined" ? window : globalThis);
