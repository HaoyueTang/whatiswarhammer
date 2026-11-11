# Changelog

Format follows Keep a Changelog; versions follow SemVer.

## [Unreleased]
- Polish: toasts moved off the codex header (max 3); locked place tiles darkened.

## [0.1.0] — 2026-11-11
### Added
- Story: 3 faction routes (Imperium 95 / Chaos 90 / T'au 84 nodes, 8 chapters each, 33 endings with cause labels), 12 chaos-god events, 93 codex entries incl. 28 places (zh/en).
- Art: 51 original pixel sprites, 20 scenes, 10 UI icons + Python generators (`tools/art/`).
- Project skeleton, design spec, registry API, project memory, dev log.
- Web: `index.html` entry (plain `<script>` tags in SPEC load order, runs from `file://`, tolerant of missing data/asset files).
- Web: `src/js/engine.js` pure rules engine (effects, clamping, hp→sanity→corruption death checks, roll formula, require/hideIfLocked, flags, h/d/w/y time with warp ×0.4–3.0, eventRoll + random events, seedable RNG, save records). Reused by the validator in Node.
- Web: `src/js/ui.js` + `src/css/style.css` — title / faction select / game / ending screens; 16:9 stage scaled to the window, portrait phone layout; status bar with stat bars, Imperial date, chapter, play time; typewriter dialogue; numbered choices with 🔒 requirement hints and 险/Risky %; codex, save/load, settings modals; event overlay tinted by god; chapter title cards.
- Web: FX — floating stat deltas, time-skip ticker with rolling date, warp glitch (RGB split, jitter, `???.M4?`), low-sanity distortion + whispers, corruption vignette, damage shake/flash, foe lunge/hit; honours `prefers-reduced-motion` and the effects setting.
- Web: missing images render as a faction-tinted pixel slime (canvas-generated, no file); missing scenes as a dark backdrop; `?debug=1` shows asset keys.
- Web: `src/js/save.js` — 3 slots + autosave (chapter change / every 5 nodes), settings, cross-run codex progress, schema version + migration hook, JSON export/import with validation, in-memory fallback when storage is blocked.
- Web: `src/js/i18n.js` UI strings (中/EN), instant language switch.
- Web: `tools/dev/validate.js` (links, endings, reachability, dead ends, softlocks, translations, length limits, 3000-run Monte-Carlo per faction), `tools/dev/sample_data.js`, `tools/dev/smoke_test.py` (headless Chrome, 40 checks, desktop + mobile screenshots).
- Web: audio hooks for the optional `WH.Audio` module (moods, SFX, unlock on first gesture), music/SFX volume + mute settings and 🔊 buttons.
- Web: lore cards (知识卡片) for first-time codex unlocks, with queue, skip-all and an auto-popup setting; keyword links on unlocked codex names in dialogue (tooltip + card); codex `more` / `aliases` support.
- Web: ending screen "你遇到的邪神 / Chaos gods you met" section and a gods line on ending nodes.
- Web: portrait glow + rim light; per-faction accent shades; mobile dialogue fits content.
- Web: codex views 条目 / 地点 / 结局 / 生涯 — places gallery with scene thumbnails and detail, endings collection with causes and survival times, 往生录 service record of the last 50 runs (summary, clear with in-UI confirm).
- Web: run recording (once per run+ending), cause of death (`ending.cause` or stat defaults), survival duration, "新纪录！" on the ending screen; place lore cards with scene banners.
- Fixed: ending screen god/codex text no longer truncated; empty codex meter bar removed.
- `README.md`.
- Audio: `src/js/audio.js` (`WH.Audio`) — 11 original procedural 16-bit chiptune moods (title, calm, holy, tense, battle, boss, warp, tau, happy, death, bad) with crossfades, 8 s mood hysteresis and `moodFor(node,state,faction)`, plus 15 synthesized SFX; optional real-file override via `assets/audio/files.js` (+ README); audition page `tools/dev/audio_test.html`; checks `tools/dev/audio_check.js` and `tools/dev/audio_render.py` (headless offline render + level/loop stats).
