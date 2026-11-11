# Changelog

Format follows Keep a Changelog; versions follow SemVer.

## [Unreleased]

## [0.2.2] — 2026-11-11
### Added
- Lore clues for veterans: 36 chronicle entries (M25→M42, dates checked against Lexicanum), 72 overheard rumours, 9 campaign events; codex 战史 / Chronicle timeline.
- Tzeentch collection easter egg (25 / 50 / 75 / 99 / 100 % tiers, hidden reply letter, "Tzeentch's joke").
- Origins are trade-offs: per-run HP / Sanity caps (70–130), all 15 origins rebalanced.
- Updates never touch local progress: version check + "saves and records kept" notice, full-progress export / import (clipboard fallback).
### Changed
- Claim endings v0.2.1 (20 endings, per-route taint multipliers).
### Added
- Engine (SPEC §19): per-route `taintMod` (scales positive taint only); event choices can `goto` a node (string or per-faction map, ending nodes allowed); claim events can fire a second time after `resisted_<god>`, at most twice per god; event choices honour `require` / `hideIfLocked`; claim endings (`<prefix>end_claim_<god>`) unlock the god's codex entry.
- Ending screen: claim endings show the god's sigil banner and the verdict "你已归属于<神>".
- Validator: taintMod / goto / claim-event / claim-ending checks; per-god claim table (fired, 2nd fire, claimed, resisted, avg taint) and §19 target band per route with ✓/✗.
- Saves: optional `claims` counts (derived for older saves, no schema bump).

## [0.2.0] — 2026-11-11
### Added
- Story: 2 new routes — Aeldari (97 nodes, 13 endings) and Necrons (95 nodes, 11 endings); race → origin selection with 3 origins per race (prologues + origin-only choices); consequence beats after choices on all routes; faction-stat help (`renownHelp`); hidden chaos-god taint on choices; 32 taint events (5 per route incl. cleanses, 4 claim events, 3 shared); codex taxonomy v2 (`race` × `type`), 156 entries.
- Art: 18 sprites, 7 omens, 7 scenes, 2 icons for Aeldari & Necrons.
- Release: public `main` built from `dev` via `release/build_public.py`; gameplay-only public README.
- Audio: 2 new original moods — `aeldari` (D dorian 70 bpm, harp arps + long echo) and `necron` (A minor/locrian 88 bpm, drones, narrow pulses, metallic ticks, glitch scans); `moodFor` maps the new route scenes/factions and new boss foes; new SFX `consequence` (consequence panel) and `scan`.
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
