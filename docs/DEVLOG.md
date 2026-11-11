# Dev log

Newest at the bottom. Format: `## YYYY-MM-DD · role` then short bullets (what changed, decisions, open issues).

## 2026-11-11 · lead
- Project kicked off. Spec v0.1 (`docs/SPEC.md`), registry API (`src/js/registry.js`), project memory (`CLAUDE.md`).
- Work split across three roles running in parallel: text (data/), art (assets/), web (src/, index.html, tools/dev/).
- Scope v0.1: 3 factions (Imperium / Chaos / T'au), bilingual, saves, codex, random chaos-god events, death + bad endings.

## 2026-11-11 · web
- **Playable end-to-end now** with whatever data exists: double-click `index.html` → 新游戏 → 人类帝国 runs from `imp_001` to an ending (checked in headless Chrome; only console noise is the not-yet-written `data/codex.js`, `data/events.js`, `assets/manifest.js`, `chaos.js`, `tau.js`, which the title screen lists in a small notice).
- Engine/UI test bed without real data: `index.html?sample=1` (tiny 16-node faction in `tools/dev/sample_data.js`); `?seed=N` = deterministic RNG; `?debug=1` = show asset key captions on placeholders.
- Missing / failing images render as a **pixel slime** (hand-authored grid → canvas data URL in `ui.js`, tinted by the faction colour, idle squish); missing scenes render as a dark gradient backdrop. No dark boxes.
- `node tools/dev/validate.js` works on the current imperium.js: 0 loops / 0 crashes in 3000 runs, avg 44 nodes (min 16, max 60). Only blocking errors are codex ids that don't exist yet (reported once per id).

## 2026-11-11 · art
- All SPEC §7 art delivered: 51 sprites (39 characters + 7 omens + 5 sigils), 20 scenes (192×108, opaque), 10 UI icons (16×16). `assets/manifest.js` is generated and registers every key with `{src,w,h,name:{zh,en}}`; UI entries have no name.
- Source: `tools/art/` (Pillow, deterministic). Entry point `python3 tools/art/build_all.py`, about 7 s. It writes the PNGs, the manifest and `tools/art/contact_sheet.png`, then checks the key list against SPEC §7 (`--check` runs only the check). `preview.py out.png key…` renders chosen keys at a larger scale for review.
- How it works: `pxlib.Sprite` stacks shape regions. It shades each region with a 4-tone hue-shifted ramp lit from the top-left, adds 1px separation lines and an auto outline in a dark shade of the local hue, and reduces each sprite to ≤12 colours. Human and T'au faces are hand-pixelled grids (`parts.HEADT` / `TAUHEADT`). Scenes and omens use `scenekit` (banded Bayer dithering, value noise, spires and ships).
- Conventions: characters are half-body portraits. Players, NPCs and the T'au cast face right. Daemons, xenos, enemy astartes (heretic_astartes, chaos_sorcerer) and grey_knight face left. They are drawn facing right and mirrored before shading, so the light stays top-left.
- Deviations / notes: omens are framed, opaque "vision" pictures with clipped corners. They are not cut-outs, and as scene-like art they are not held to the 12-colour cap (19–32 colours). Sigils are original designs, not the published god symbols. No aquila, no chapter or sept marks, no inquisitorial "I". Badges are plain diamonds or chevrons.
- Open: if the UI shows sprites over very dark scenes, the dark outlines on black-armoured figures (enforcer, commissar) are subtle; a faint rim or backdrop helps.
- 2026-11-11 · art (polish): reworked these assets; keys and sizes are unchanged. chaos_sorcerer now has a gold-spine crown with horns, a brow gem and cowl edges. gaunt is now small and eyeless, with a bio-gun and glowing sac. tyranid_warrior now has a tall bone crest, burning eyes and raised blades, so it no longer reads like the gaunt. ship_interior gains slung cables, plain livery banners, amber deck lumens and steam. barracks gains pipes, helmet and rifle racks, plain posters and a back light. Manifest and contact sheet regenerated.
- Portraits now get a faction-tinted radial glow + light rim (CSS drop-shadows) so dark-armoured sprites read on dark scenes; foes get a red-tinted glow.
- Fixed: per-faction accent shades (card bands, frames) now follow the faction colour; nodes whose `time` adds 0 hours no longer show a "+0 h" ticker.
- Data notes for text role (not blocking web): `data/codex.js` + `data/events.js` still missing (73 validator errors are all unknown codex ids); `cha_101`/`imp_101` have `time:{h:0}`; `cha_705` zh text 93 > 90; chaos has a `{y:1000, warp:true}` jump (→ 400–3000 years, date rolls over millennia correctly — confirm intended); `imp_death_corruption` never reached in 3000 random runs; `imp_603` has only hideIfLocked+require choices (no softlock seen in simulation).

## 2026-11-11 · lead
- User requests: 16-bit mood music + click SFX → new audio role (`src/js/audio.js`, procedural WebAudio chiptune, `assets/audio/` drop-in override; CC0 sites unreachable from build env).
- User requests: pop-up lore cards on first codex unlock (skippable, can disable), keyword links in dialogue, ending screen lists chaos gods met. SPEC §6 extended with `more` + `aliases`.
- Approved engine contract: death caused by a node's own effects shows the node, then a forced "continue" to the death node.
- Audio hooks (audio role owns `src/js/audio.js`): index.html loads `assets/audio/files.js` + `src/js/audio.js` (onerror-tolerant) before engine.js. ui.js calls everything through a guarded `au(fn, …)` bridge, so the game runs without audio. Hooks: unlock()+mood on first pointerdown/keydown; delegated `sfx('click')` on every button (override per button with `data-sfx`, used for `start`/`select`) and `sfx('hover')`; `setMood(WH.Audio.moodFor(node,state,faction))` on node render; `damage|corrupt|sanity|heal` on stat deltas (one per step, in that priority); `event` + `setMood('warp')`; `warp`; `codex`; `save`; ending → `setMood(death|bad|happy)` + `sfx(death|ending_good)`; `type` (throttled 55 ms). Settings gain music/SFX volume sliders + mute (`musicVol`, `sfxVol`, `muted`), plus a 🔊 toggle in the game toolbar, title and ending screens.
- Lore cards: the first time a codex entry is unlocked *globally* (not yet in `whatiswh.codexGlobal`), it queues a card that pops after the typewriter (or over an event result): sprite/slime, category badge, text, optional `more`, `n/m` counter, 继续 (Enter/Space/click outside), 跳过全部 (Esc), "不再自动弹出" checkbox. Setting `loreCards: "auto"|"codex"` (Settings → 知识卡片). Re-unlocks within the same run → toast only.
- Keyword links: after typing finishes, the first occurrence of each unlocked codex name (current language; plus optional `aliases:{zh:[],en:[]}`; en also matches without a leading "The"), longest match first, gets a dotted accent underline with a hover tooltip (desktop) and opens the lore card on click/tap. Not applied to the speaker plate.
- Ending: new "你遇到的邪神 / Chaos gods you met" row (sigil, name, codex text + `more`, or dim ??? 本局未遇见). Met = saw an event with that `god`, or unlocked a `cat:"god"` codex id containing the god name. Ending nodes append "这一路上，注视过你的有：…" when any god was met. The "You met" and gods lists share a scroll area.
- Mobile: dialogue box now fits its content (min 150 px) instead of filling the screen.
- Validator: codex `more` (≤90 zh / 65 en words, warn) and `aliases` shape are checked.
- Real data now (3 factions): 0 loops / 0 crashes; avg nodes imperium 44.8, chaos 46.5, tau 48.7. Still blocked only by missing `data/codex.js` / `data/events.js`. `tau_101` also has `time:{h:0}`; `tau_death_corruption` never reached in random runs.

## 2026-11-11 · text
- Wrote `data/factions/imperium.js` (95 nodes), `chaos.js` (90), `tau.js` (84), `data/events.js` (12 events: 2 each khorne/nurgle/tzeentch/slaanesh/undivided/other, all `factions:["*"]`), `data/codex.js` (68 entries).
- Each route: 8 chapters, 3 good endings, 4–6 choice-driven bad endings, 3 death nodes; 7–8 `eventRoll` nodes; ≥3 `warp:true` jumps. Validator: PASS (0 errors). Random-walk avg nodes: imp 45.3 / cha 45.8 / tau 48.5; deaths ~25–33% (careless play dies, deliberate play survives).
- Codex follows the lead's extension: every learn id + 4 gods + chaos_gods/chaos_warp have `more`; most entries have `aliases {zh:[],en:[]}` (note: some aliases are substrings of others, e.g. 星际战士 inside 叛变星际战士 — UI should prefer the longest match).
- Data files use small local helpers inside an IIFE (`L()`, `S()`, `C()`, `R()`); output objects match SPEC §3 exactly. Recurring speaker objects are shared references — engine must not mutate `speaker`.
- `require` arrays (AND) are used in a few places (engine already supports them). `imp_603` has two mutually exclusive hideIfLocked choices (flag fledHesper / notFlag) — validator warns, but exactly one is always open.
- Start nodes have no `time` (was h:0). `cha_end_feast` uses plain `{y:1000}` (no warp multiplier). Death nodes have no `chapter`.
- Art: only SPEC sprite/scene keys used. Canon figures appear only via omen_* speakers (omen_primarch = Guilliman broadcast/fleet, omen_black_crusade = Abaddon/Black Legion, omen_tau_fleet = Shadowsun, omen_farsight = crimson battlesuit, omen_hivemind = Hive Mind/Swarmlord, omen_emperor = Golden Throne visions, omen_purge = Exterminatus/Strand broadcast). Sigils used as speakers for gods/warp in events and death nodes.
- Open: no minute-level `time` key in SPEC, so the tensest beats use `{h:1}`; could add `m` later if wanted.
- (text) Added `ending.cause:{zh,en}` (≤12 zh / ≤6 en words) to every ending node — all bad, death and good endings in the three factions (33 total).
- (text) Added 25 `cat:"place"` codex entries (with `scene`, `more`, `aliases`) and re-categorised imp_great_rift / chaos_eye_of_terror / tau_farsight_enclaves as places; unlocked on arrival/first mention, mostly on spine nodes.
- Codex window now has 4 views: 条目 Entries (categories as before, `place` excluded) · 地点 Places (16:9 scene thumbnails from `WH.scenes[entry.scene]`, faction filter 全部/帝国/混沌/钛/通用, locked = darkened ???, click → detail with large scene + text + `more`) · 结局 Endings (per faction, every ending node as a tile: kind badge, title or ???, cause, first/longest survival, ×count, "已解锁 n/t") · 生涯 Records (往生录).
- Run records: when the ending screen is reached, the run is recorded once (dedupe key `runId:endingNodeId`, kept in `whatiswh.runsSeen`; `runId` now lives in engine state + save records). Stores: `whatiswh.runs` (newest first, max 50), `whatiswh.runStats` (totals, deaths, longest, cause counts), `whatiswh.endingStats` (`faction:node` → count/first/best). "清空记录" (in-UI confirm) clears runs + runStats only; the endings collection stays.
- Cause: `node.ending.cause {zh,en}` if present; otherwise deathNodes by stat → 伤重不治 / 理智崩溃 / 被混沌吞噬; otherwise the ending title. Survival = in-game hours from start to end, shown as "3年 41天 6小时" / "3 y 41 d 6 h" (`WH.fmtDur`).
- Ending screen: a fate row with 死因 (bad/death) + 存活时长, plus "★ 新纪录！" when it beats the previous longest survival. Removed the empty codex meter bar; codex/god texts are no longer truncated (the lists scroll).
- Places: lore cards for `cat:"place"` show a wide scene banner and a 地点 badge; keyword links cover place names/aliases. Validator accepts `place`, checks `scene` keys, and prints codex counts per category and places per faction; also checks `ending.cause` (≤16 zh / 8 en words).
- Real data (codex 93, events 12, 3 factions): `validate.js` PASS (0 errors, 2 warnings on imp_603); `smoke_test.py --real` 49/49, 0 console errors. Sample: 71/71.

## 2026-11-11 · audio
- **`src/js/audio.js`** gives `WH.Audio`: original procedural 16-bit chiptune plus synthesized SFX in Web Audio. No deps, no files, works from `file://`. Music is 11 looping moods. Each one has a real melody over a chord progression in A/B(/A2/B2) sections, 16–32 bars. Each section is written as compact note and chord-pattern strings in the file. The sound is pulse waves at 12.5/25/50 % duty (duty changes between sections), triangle/sine bass, a noise drum kit, per-mood feedback echo, a shared generated-IR reverb and delayed vibrato on the leads. Timing comes from a lookahead scheduler (25 ms timer, 150 ms ahead on the AudioContext clock).
- **Moods:** `title` D minor 76 bpm (gothic organ) · `calm` F major 84 · `holy` G mixolydian 66 (pulse choir and bells) · `tense` C minor 92 (heartbeat bass, clock ticks) · `battle` E minor 150 · `boss` D harmonic minor 172 · `warp` C augmented/whole-tone ~78 with ±16 % tempo wobble and random detune · `tau` D Lydian 112 · `happy` C major 132 · `death` A minor 60 (4-bar lament, then a near-silent loop) · `bad` B phrygian 58.
- **SFX:** `click hover select start type damage heal sanity corrupt event warp codex save death ending_good`. `type` is rate-limited to 40 ms and `hover` to 45 ms.
- **API:** `unlock()`, `setMood(mood,{fade,force})`, `stop({fade})`, `sfx(name)`, `setMusicVolume(0..1)`, `setSfxVolume(0..1)`, `mute(bool)`, `isMuted()`, `moodFor(node,state,faction)`, `current()`, `wanted()`, `songInfo(mood)`, `moods`, `sfxNames`.
  - Default volumes are music 0.5 and sfx 0.7, with a perceptual curve (v^1.5).
  - Mute is also kept in `localStorage["whatiswh.audio"]`. The settings record still wins because `applyAudioSettings()` calls `mute()`.
  - There is no sound before `unlock()`. The context suspends while the tab is hidden and while muted, and scheduling stops when muted.
  - Polyphony is capped at 40 music voices, 14 drum voices and 24 sfx voices. Each mood's player and buses are cached and reused.
- **moodFor rules, in order:**
  1. `node.music`
  2. ending kind: death→`death`, bad→`bad`, good→`happy`
  3. boss-class foe (`hive_tyrant daemon_prince grey_knight tyranid_warrior ork_boss heretic_astartes chaos_sorcerer`, any `omen_*`) → `boss`
  4. any other foe → `battle`
  5. scenes `warp daemon_world cult_shrine` → `warp`
  6. scenes `cathedral throne_light` → `holy`
  7. scenes `tau_city tau_outpost` → `tau`
  8. scenes `trench burning_city ruins spore_sky`, or sanity < 30 → `tense`
  9. T'au faction → `tau`
  10. otherwise `calm`
- **Hysteresis:** `calm/holy/tense/tau` switch at most every 8 s; a newer request replaces the deferred one. `battle boss warp death bad happy title` switch at once. `warp` is in that set so chaos events hit at once. `{force:true}` overrides.
- **Real files (optional):** `assets/audio/files.js` (empty template) sets `WH.audioFiles = {mood: "assets/audio/x.ogg"}`. Those moods play through a looping `<audio>` element with crossfade; on error they fall back to the synth. See `assets/audio/README.md`.
- **Integration status:** web's `ui.js` bridge already does everything below, and I checked it in headless Chrome on the real game. If you touch these, keep:
  - first `pointerdown`/`keydown` → `unlock()`, then apply settings, then `setMood(screenMood())`
  - title/select screens → `setMood('title')`
  - every button → `sfx(data-sfx || 'click')`; hover → `sfx('hover')`
  - New Game → `start`; faction card → `select`
  - node render → `setMood(moodFor(node, state, faction))` (not while an event is open)
  - stat deltas: hp−→`damage`, corruption+→`corrupt`, sanity−→`sanity`, gains→`heal`
  - event overlay → `sfx('event')` + `setMood('warp')`
  - warp time jump → `sfx('warp')`
  - codex unlock → `codex`; save → `save`
  - ending → mood by kind + `ending_good`/`death` stinger
  - typewriter → `type`
  - settings sliders/mute → setters
  - Optional: show the `death` stinger only for `kind:"death"` and play nothing extra for `bad` (the bad mood is bleak enough).
- **Tests (mine):**
  - `node tools/dev/audio_check.js` (static): every note, chord, bar length, drum pattern and section; 16 `moodFor` cases; a tally of moods per route from the real story data. 0 errors. 80–98 % of on-beat melody notes are chord tones.
  - `python3 tools/dev/audio_render.py` (headless Chrome): live API checks (gesture gating, every mood/SFX button, crossfade cleanup, hysteresis, mute/suspend, visibility, file fallback, no console errors). Then it renders every mood and SFX through `OfflineAudioContext` with the real synth to `/tmp/wh_audio_renders/*.wav`. At music volume 1.0 all moods peak −2.0…−5.0 dBFS with 0 clipped samples. RMS is −13…−22 dBFS. There are no silent gaps. Loop lengths match the data exactly, and the loop restart is spectrally ≥ 0.97 similar to the top. 0 failed checks.
- **Not listen-tested by a human yet.** Please audition `tools/dev/audio_test.html` and report any mood that grates.

## 2026-11-11 · lead
- v0.1.0 integrated: validate.js PASS (0 err), smoke real 49/49 + sample 71/71 with 0 console errors, audio_check OK. Avg nodes/run imp 45.3 · cha 45.8 · tau 48.5.
- Lead polish: toasts moved to above the dialogue box (max 3), locked place tiles darkened/blurred with ???.
- Repo created on GitHub (HaoyueTang/whatiswarhammer), first push of v0.1.0.

## 2026-11-11 · lead (v0.2 kickoff)
- User asked for more races + better codex classification; mid-request also reported: choices jump to the next node with no consequence beat.
- Scope v0.2: Aeldari + Necron routes (Orks / Genestealer Cult deferred), choice consequences (`result` / `rollResult` + auto summary), codex taxonomy v2 (`race` × `type`, search, NEW badge). SPEC §11–§15.
- Applying v0.1 lessons: workspace is now a git repo (branch `v0.2-new-races`); one text agent per route (2 new routes + 3 consequence editors); agents don't run git, lead commits per milestone.
