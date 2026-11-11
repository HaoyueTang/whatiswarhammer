/* files.js — optional real music files (audio role). Loaded by index.html before src/js/audio.js.
 * Map a mood to a file path relative to index.html. Any mood left out (or whose file fails to load)
 * uses the built-in procedural chiptune instead. See assets/audio/README.md.
 *
 * Moods: title, calm, holy, tense, battle, boss, warp, tau, happy, death, bad
 * Example:
 *   WH.audioFiles = { battle: "assets/audio/battle.ogg", title: "assets/audio/title.mp3" };
 */
(function (root) {
  var WH = root.WH = root.WH || {};
  WH.audioFiles = WH.audioFiles || {};
})(typeof window !== "undefined" ? window : globalThis);
