# Changelog

Format follows Keep a Changelog; versions follow SemVer.

## [Unreleased]

## [0.3.3] — 2026-11-12
### Added — Rewind (SPEC §30)
- Setting 设置 → 允许回到上一个选择 / Allow going back one choice (`settings.rewind`, default **off**; title screen and in-game). When on: a "↶ 回到上一个选择" button next to 主页 and the hotkey **Z** (shown in the button tooltip and the settings hint). It restores the complete engine state from just before the last choice: stats, flags, taint, clock, visited nodes, rumour / echo state, pending-event state and all three RNG streams, so picking the same roll again gives the same result (no re-rolling a gamble); a different choice works normally. 30-deep in-memory stack, not saved (after a reload the button stays disabled until the next choice). Switch off = no button, no history, no snapshots (identical to 0.3.2; validator death rates unchanged).
- Knowledge is not rewound: codex entries (and lore cards already shown), rumours heard, chronicle, achievements and the Tzeentch collection stay unlocked. Play time keeps running.
- Endings and death: with the switch on, the ending screen has "↶ 回到最后一个选择". The ending reached stays recorded; the continued run writes a new record with `rewinds` (shown as ↶N in 往生录 and as a chip on the ending screen). Run records, slots and the autosave carry `rewinds` (additive; save schema stays 2, §22).
- Fairness: achievements that reward one clean run (`ach_fast`, `ach_survive_sanity`, `ach_taint_200`, `ach_resist_1`, `ach_resist_5`) only count runs with `rewinds == 0`; cumulative counters, origins, flags and codex progress are unaffected. Engine: `Game.canRewind()`, `Game.rewind()`, `Game.rewindCount`, `Game.setRewind(on)`, option `rewind: true`.
- Music style selector (SPEC §29, UI only): 设置 → 配乐风格 / Music style, radio cards with a ▶ 试听 / Preview button per style, applied at start-up and on change, saved as `settings.musicStyle` (default `chip`, unknown value → `chip`) and included in the settings backup. Reads `WH.Audio.getStyles() / setStyle(id) / previewStyle(id)` when `audio.js` provides them; until then it shows the single built-in 8-bit style.
- Tests: `smoke_test.py --only-v033` (rewind: identical state + roll after A → rewind → A, A → rewind → B, depth limit, ending rewind keeps the old record, switch off hides everything, save / load, achievements guard, desktop + mobile, zh + en; music style: cards, preview, persistence, export, start-up apply).

### Added — Music styles (SPEC §29)
- Four new original procedural music styles next to the default `chip` (unchanged, bit-identical output): `dark` 暗黑氛围 (detuned drones and pads, sparse metal and bells, sub-bass pulses only in combat), `organ` 哥特管风琴 (pipe-organ chords, vowel-like choir pad, slow arpeggios, timpani and gong in combat), `synth` 合成波 (saw bass arpeggios, gated pads, four-on-the-floor drums in combat) and `piano` 钢琴弦乐 (sparse piano motifs over slow string pads, driving string ostinatos in combat).
- Every style covers all 16 moods, keeps the per-node mood auto-pick and the 8 s hysteresis, and is arranged from the same song data as `chip` (same keys and tempo families), so a mood keeps its identity across styles. Loops are seamless; sections are all different (no verbatim repeat inside a loop). Each style is trimmed to the loudness of `chip` (RMS within 2 dB, peaks at or below -1 dBFS). SFX are shared.
- API (`WH.Audio`): `getStyles()` (id, names, descriptions in zh / en), `getStyle()`, `setStyle(id)` (crossfade about 1.5 s, unknown id → `chip`, idempotent), `previewStyle(id)` (about 8 s: a calm phrase, then a short tense one; stops itself; the running mood is silent meanwhile and resumes afterwards; `setMood` during a preview is deferred; `stop()` cancels it; muted → no-op), `styles` (map of style objects). The module does not persist the style (the UI saves `settings.musicStyle`). Real files in `assets/audio/files.js` still override procedural music in every style.
- Engine: new waves (organ, reed, flute, piano), per-note filter envelopes, a formant bank for the choir, drum voices (sub boom, gong, clap), 5-note chord voicings, voice caps and drop counters (`E.drops`).
- `tools/dev/audio_check.js` renders every style × mood offline in headless Chrome (Node only, no dependencies; `audio_dsp.js` holds the DSP) and checks NaN, peak, DC, loudness vs `chip`, loop seam, repetition before 40 s, silence and voice load; `--json` / `--from-json` to save and re-evaluate. `tools/dev/audio_render.py --styles` renders them and tests the live API (crossfade, preview timeline, deferred `setMood`, mute, fallback). `tools/dev/audio_test.html` has a style dropdown and one preview button per style.
- Not verified by ear: all four styles were checked by measurement only; they need a human listen (`tools/dev/audio_test.html`).

## [0.3.2] — 2026-11-12
### Added — Grudges (SPEC §28)
- Hurting a person has later costs, but only where that person is really present. A route declares `faction.npcs`; a harming choice sets `wronged_<npc>`; a later choice carries `grudge:{npc, p?, effects?, note}`; a node can add a presence sentence with `grudgeLine:{npc, text}`. While `wronged_<npc>` is set (and `forgiven_<npc>` is not) the choice shows a ⚠ tag and a small line saying why it is riskier, its roll chance drops by `p` (final clamp 5–95 %), the grudge's own penalties (hp / sanity / renown ≤ 0, corruption ≥ 0, small taint bumps) are added when it is taken, the consequence panel starts with the note, and the node text is followed by the italic `grudgeLine`. Nothing changes while the flag is absent or forgiven (same RNG draws, same results); saves need no new fields.
- Engine: `Game.choices()[i].grudge`, `Rules.rollChance(roll, stats, extra)`, `Rules.grudgeActive / grudgeOf / mergeEffects`, `Game.grudgeLine()`, `Game.nodeText()`, `Game.activeGrudgeNpcs()`, `step.grudge`, `step.consequence.grudge`.
- Validator: all §28 coherence rules (npc exists, `wronged_` set by a choice and reachable, presence by name in zh and en text / speaker or foe sprite / grudgeLine, harm named in the choice, never before the harm, bounds), field shapes and length limits, and a per-route report (wronged npcs, grudge choices, activations per run, death and claim rate with vs without grudges; warns above +3 pts death or ±1.5 pts claim).
- Content: all 8 routes (2–4 people each, 6–11 grudge choices per route, redemption choices where the story allows). Random-play death rate rises 0.3–1.9 points per route (limit 3); claim-ending rates unchanged. A few existing lines were softened where they contradicted a later scene (e.g. "never speaks to you again" → "for a long time").
- Tests: sample data has two npcs (`vik` present by speaker sprite, `mira` through a `grudgeLine`) and a redemption choice; `smoke_test.py --only-grudge [--real]`.

## [0.3.1] — 2026-11-12
### Changed
- UI wording: "种族" → "势力" (title "选择势力", back button, codex sort "按势力"); English "Choose your faction" / "Factions" / "By faction". In-world prose that means a real species ("古老种族") is untouched.
### Added
- `tools/dev/date_audit.js`: checks every Imperial date written in node text against the earliest / latest game clock a player can arrive with (past references are fine, a date later than the clock is reported). Result today: the clock and the text agree on all 8 routes.

## [0.3.0] — 2026-11-12
### Added
- Routes (SPEC §26): three new playable races — Orks, Genestealer Cult, Adeptus Mechanicus — 8 routes in all (each with 3 origins, taint events, claim endings, rumours and codex entries). The race picker lays 8 cards out in a 4 x 2 grid on desktop and a stacked list on mobile; new faction accents, theme colours and faction-stat icons (glyph fallbacks if an icon is missing).
- Achievements (SPEC §25): 60 achievements (bronze / silver / gold, 15 hidden) from `data/achievements.js`, 19 condition types (endings, claims, deaths, origins, codex %, chronicle, rumours, Tzeentch egg, flags, speed...). A title-screen "★ 成就 n/t" button opens the grid (locked hidden ones show "???"; counters show progress bars); unlocking shows a toast at the end of a run or on a codex unlock. Stored in `whatiswh.achievements` / `whatiswh.achStats`; included in the full-progress export / import (merge never removes an unlock or lowers a counter) and never touched by a version update (SPEC §22).
- Echoes of past lives (SPEC §27): at most once per run, with a 15 % chance, from chapter 2, at least 3 nodes after a rumour, one line in the footer ("✝ 前世死讯", "A past life") about one of your own earlier bad / death endings, set on a shared Arcosa Sector world and told by the 14 templates in `data/sector.js`; claim endings name the god. Clicking it opens the 往生录 at that run. Never an echo of a run that happened "later" than the current date. Setting 设置 → 前世死讯 on / off.
- Validator: per-route PREFIX / taint guide for orks / gsc / mechanicus; claim-rate bands (orks 5-10 %, gsc 3-8 %, mechanicus 8-14 %); achievements checks (condition types, ids, targets exist and are reachable), echo template length / placeholder checks, per-origin reachable-ending check, rumour coverage report.
- Smoke tests: achievements, 8-race picker (desktop + mobile), echoes; `--real` starts every origin of all 8 routes from the picker, opens the achievements page and toggles zh / en.
### Changed
- Rumours (SPEC §20b) now appear by relevance instead of a flat chance: each rumour's `when` (scene, sprite, codex, flag, keyword) is scored against the current node; p = 0.6 for a strong match, 0.35 for a weak one, at least 3 nodes apart, at most 2 per chapter.
### Audio
- Audio (SPEC §26): three original music moods — `orks` "Scrap-Heap Stomp" (G minor/blues, 140 bpm), `gsc` "Hymn Under the Mine" (F major hymn with flattened chords, 66 bpm) and `mechanicus` "Canticle of the Cogitator" (F# aeolian chant in fifths, 100 bpm). New drum voices: big floor tom, anvil clang, insect chitter.
- moodFor: `ork_scrapyard`/`ork_fort` → orks, `mine_shaft`/`gsc_chapel` → gsc, `forge_floor`/`mars_vista`/`tech_vault` → mechanicus; route defaults for `orks`/`gsc`/`mechanicus`; boss-class foes `ork_nob`, `gsc_patriarch`, `gsc_primus`, `daemon_engine`, `kastelan_robot`, `dark_mechanicus`.

## [0.2.3] — 2026-11-11
### Added
- Difficulty skulls (SPEC §24): race and origin cards show 1–3 code-drawn pixel skulls, tinted to the faction. There is no text and no tooltip, only an aria-label "难度 n/3". Levels come from the new `data/difficulty.js`, generated by `node tools/dev/validate.js --write-difficulty` (seeds 1/5/9 × 3000 random runs; death rate <24 % = 1 skull, 24–29 % = 2, ≥29 % = 3). If the file is missing, no skulls are shown.
### Changed
- Origin cards compare stats with the neutral baseline 100/100/0/10 instead of the route's first origin. The cap line lists every hp/sanity cap that is not 100, with ▲ or ▼.
### Fixed
- A brand-new browser no longer gets the "updated" notice. The version check now runs before the first settings/codex write.

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
