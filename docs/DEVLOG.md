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

## 2026-11-11 · text-editor-tau (v0.2 choice consequences)
- `data/factions/tau.js`: added SPEC §11 consequence beats. 136 choices total → 135 with a beat (99.3 %); all 79 choices with `effects`/`set` covered (100 %); all 11 roll choices have `rollResult {success, fail}`. Only `tau_503#0` (“去参加集会”) left without one; the next node's first line already covers it.
- Each beat was written against its target node's opening line(s), so it bridges and never contradicts. Beats show action, sensation or NPC reaction, never stats. Max length 41 zh chars / 25 en words (limits 50 / 35).
- Helper change: `R(p, stat, ok, ko, okRes, koRes)` now emits `rollResult` when both beats are given. `C(...)` extra objects simply carry `result: L(..)`. Node text, ids, effects and structure are unchanged: I checked this by JSON diff against a backup, ignoring `result`/`rollResult`.
- Continuity notes for other editors: Rena's pendant is kept in an inner pocket (`tau_605`), so “put it on” (`tau_806`) still makes sense. After `tau_305`, 92 is “repaired, but not quite as it was”, matching `droneDamaged`. Reporting Silas (`tau_506#1`) makes him vanish from the barracks.
- Checks: `node tools/dev/validate.js --faction tau` passes with 0 errors and 0 warnings. The validator only length-checks `result` on events, so I also ran an ad-hoc checker (`/tmp/tau_results/check.js`), which also passes with 0 errors.

## 2026-11-11 · text-editor-chaos
- Added consequence beats (SPEC §11) to `data/factions/chaos.js`. Node text, ids, effects and structure are unchanged; I checked this with a JSON diff against a backup, ignoring `result`/`rollResult`.
- Helpers: `R(p,stat,ok,ko[,rr])` now takes an optional 5th arg; new `RR(L(),L())` builds `rollResult:{success,fail}`. Plain choices carry `result: L(zh,en)` in `extra`.
- Coverage: 171 choices, 127 with a beat (116 `result` + 11 `rollResult`). 104/104 choices with effects/set covered (100%); 11/11 roll choices covered. The 44 without a beat are on purpose: pure direction picks (faction doors, god paths, Ch3 uprising routes) and one-line "continue" choices where the next node's first line already shows the outcome.
- Max length 45 zh chars / 26 en words (limit 50/35). Voice: temptation, whispers, grim humour; violence only implied. Each beat was written against its target node's opening line so it doesn't repeat or contradict it (e.g. roll fails lead into "The doors hold." / "A las-bolt punches through your thigh.").
- Checks: `node tools/dev/validate.js --faction chaos` PASS 0/0. The validator doesn't check faction choice `result` lengths yet (only events), so I also wrote a vm checker at `/tmp/chaos_results/check.js` (parse, zh+en present, ≤50/≤35, coverage count, nothing else changed).

## 2026-11-11 · text-editor (v0.2: codex taxonomy v2 + Imperium consequence pass)
- **Codex taxonomy v2 (`data/codex.js`)**: all 93 entries now carry `race` + `type` (SPEC §13); `cat`/`faction`/ids unchanged. Helpers changed: `E("race/type", cat, faction, …)` and `P(race, faction, scene, …)` (P always sets `type:"place"`).
  - race: imperium 35 · chaos 24 · tau 21 · tyranids 7 · orks 3 · other 3 (aeldari / necrons 0 — new route files own those).
  - type: place 28 · unit 23 · organization 17 · concept 13 · deity 6 · figure 6.
  - Rules I applied (new codex files please follow): `type:"place"` ⇔ `cat:"place"` (so `imp_hive` "Hive City" is a concept, not a place). Top-level race/polity entries (`imp_imperium`, `tau_empire`, `xenos_ork`, `xenos_tyranid`) → organization. Kinds of people/creatures/machines you could meet (commissar, servitor, psyker, navigator, enforcer, Space Marines, daemons, battlesuit, drones, gue'vesa, kroot) → unit; armies/orders/castes/churches (Astra Militarum, Inquisition, Grey Knights, Mechanicus, castes) → organization. Weapons, events, history, ideas (lasgun, tithe, Black Ships, Black Crusade, Indomitus, Waaagh!) → concept.
  - Judgement calls: **the Emperor → imperium / deity** (he is presented as the worshipped God-Emperor; `more` keeps the "he denied being a god" nuance). Warp → other/concept; Great Rift → other/place (warp phenomena belong to no one). Horus Heresy → imperium/concept (Imperial civil war). Hive Mind → tyranids/figure (singular acting entity, not worshipped outside cults). Kroot and gue'vesa → race tau (they belong to the T'au Empire). Places: race = controller; Carcharos, the Sump, Aldrin, Hesper, Cadia → imperium; Damocles Gulf → other (contested).
  - Aliases added: Bloodletter/放血鬼, Plaguebearer/瘟疫使者/纳垢灵, Horror/惧妖, Daemonette/欲魔, 兽人军阀/Ork Warboss, Waaagh, 万机之神/Omnissiah, 伤痕/Cicatrix Maledictum, Adeptus Astartes, 巫婆, Tau.
  - Not present (route writers own them): generic 灵族 Aeldari race entry, 死灵 Necrons race entry, C'tan, Drukhari, Harlequins, Ynnari, Khaine. Orks (`xenos_ork`) and Tyranids (`xenos_tyranid`) already exist — reuse those ids, don't duplicate.
- **Imperium consequence pass (`data/factions/imperium.js`)**: added `result` / `rollResult` (SPEC §11). 143 choices total; 110 now have a beat: 63/63 choices with effects/set (100 %), 11/11 roll choices with `rollResult`, plus 36 navigation choices where the action itself deserved a beat (e.g. 准时去工厂上工 → still late; 炸桥; ending choices at imp_808). 33 left plain where the next node's first line already is the consequence (e.g. 问她眼睛怎么没的 → her answer).
  - `R(p, stat, success, fail, okText, failText)` now emits `rollResult`; `C(…, extra)` carries `result` in `extra`. No node text, ids, effects or structure changed.
  - Beat at imp_802 "把手雷绑上电梯缆绳" also smooths an old continuity seam (giants step out of the lift, then fall with it): Dravik drives them back into the car.
  - Checks: `node tools/dev/validate.js --faction imperium` PASS (0 errors; 2 pre-existing imp_603 warnings); extra vm check: every result has zh+en, ≤ 50 zh chars / ≤ 35 en words, no ASCII quotes, no `result` on roll choices.

## 2026-11-11 · audio (v0.2)
- **New moods** (original, same A/B/A2/B2 32-bar format as the others):
  - `aeldari` "Thread of Fate": D dorian, 70 bpm, 110 s loop. Dorian Dm–G colour, harp-like triangle arpeggios with an octave shimmer through a long 1.5-beat echo (fb 0.42), a glassy sine lead with slow vibrato (triangle on the repeats), open-fifth bass, sine pad, 12.5 % "glass" sparkles in A2/B2. The only percussion is a single wind swell, then soft open-hat and tom breaths.
  - `necron` "The Sleepers Wake": A minor with locrian/phrygian colour (Bb/A, Eb/D, Eb as b5), 88 bpm, 87 s loop. Detuned low-passed saw drone on pedal tones, a 12.5 % pulse ostinato, a stiff, sparse 12.5 %→25 % lead, sine "glyph" blips, kick heartbeat, metallic ticks, and a glitchy "scan" sweep every 4th bar (every 2nd bar in B2).
  - Engine additions (data-driven, backwards compatible): per-song `dly: [beats, feedback]` echo, and drum key `z` (stepped sample-and-hold 12.5 % pulse sweep up/down with random dropouts).
- **moodFor rules, new order:** `node.music` → ending → boss foe → foe → warp scenes → holy → tau → **aeldari scenes** (`craftworld webway maiden_world`) → **necron scenes** (`tomb_exterior tomb_interior stasis_gallery dig_site`) → tense scenes / sanity < 30 → faction default (`tau`→tau, **`aeldari`→aeldari, `necrons`→necron**) → calm.
  - Route scenes win over low sanity, the same as the T'au scenes. Elsewhere on the new routes, tense still beats the faction default.
  - New boss-class foes: `greater_daemon_slaanesh wraith_construct necron_lord canoptek_spyder omen_ctan` (`omen_*` already counted).
  - `aeldari` and `necron` are calm-type moods, so they get the 8 s hysteresis.
- **New SFX:**
  - `consequence`: a soft page-turn brush plus a quiet A5→E6 chime, −17 dBFS, 1.3 s with its tail.
  - `scan`: a stepped pulse sweep with metallic grit and a low servo hum, −12 dBFS, 1.1 s.
  - **Web:** please hook `sfx('consequence')` when the §11 consequence panel opens; the click on 继续 can stay `click`. `scan` is optional (e.g. a Necron scanning event or node).
- **Tests:**
  - `audio_check.js`: 13 moods, 17 SFX and 39 `moodFor` cases (23 new). New-mood checks: tempo window, ≥ 75 % on-beat chord tones and A/B/A2/B2 order. aeldari 98 % and necron 95 % of on-beat lead notes are chord tones. 0 errors, 0 warnings.
  - `audio_render.py`: adds key/bpm and spectral-centroid columns, live checks that craftworld/tomb_interior → new mood plays, and that `consequence`/`scan` play.
    - aeldari: peak −3.8 dBFS, RMS −14.4, centroid ≈ 790 Hz.
    - necron: peak −3.5 dBFS, RMS −18.8, centroid ≈ 1070 Hz.
    - Both have 0 clipped samples, no gaps, exact loop length and loop-restart similarity 1.00.
  - `audio_test.html` gains a "Scene → moodFor()" row for the new scenes.
- Still needs a human listen (`tools/dev/audio_test.html`).

## 2026-11-11 · art (v0.2)
- All SPEC §14 art delivered: 18 sprites + 7 omens (25 sprite keys), 7 scenes, 2 icons. Totals are now 76 sprites, 27 scenes and 12 UI icons. `assets/manifest.js` (with `name {zh,en}`) and `tools/art/contact_sheet.png` are regenerated. `build_all.py --check` now checks SPEC §7 + §14. The §14 keys are appended after the §7 ones, so the manifest order of the old keys is unchanged.
- The 81 v0.1 PNGs are **byte-identical**: I verified them with `cmp` against a pre-build copy. The new code is additive only.
- New modules:
  - `tools/art/chars_aeldari.py` has the guardian, seer, ranger, bonesinger, masked performer, drukhari raider, wraith construct and greater daemon of Slaanesh. It also adds `ELDHEADT` (a long narrow head with a pointed ear) and `ELDHELMT` (a hand-pixelled smooth egg helm with slanted almond lenses), shared by the guardian, seer and raider.
  - `tools/art/chars_necrons.py` has the warrior, lord, cryptek, flayed one, scarab, spyder, dig_leader and explorator. It also adds the `NECSKULLT` skull grid and a gauss rifle helper.
  - Appended to existing modules: `player_aeldari` and `player_necrons` in `chars_players.py`, the 7 omens in `omens.py`, the 7 scenes plus a `_eld_tower` helper in `scenes.py`, and `icon_fate` / `icon_worth` in `icons.py`.
- Palettes:
  - Aeldari: wraithbone `#e4d8b6`, jade `#2f9a86`, deep blue `#2c3f7c`, ruby spirit-stones `#e23a4e`, cyan rune glow.
  - Necrons: silver `#a8b0b8`, gunmetal, near-black, green `#4fd16b` (matches the route colour), gold accents on the lord and cryptek.
- Facing (no flip in the UI, so it is baked in):
  - Face **right**: Aeldari allies, wraith construct, necron_lord, cryptek, and all humans (players, dig_leader, explorator).
  - Face **left**: drukhari_raider, greater_daemon_slaanesh, necron_warrior, flayed_one, canoptek_scarab, canoptek_spyder.
  - The lord and cryptek face right because they are likely speakers on the Necron route. Tell me if the text puts them in the `foe` slot and I'll flip them; it's one argument in the decorator.
- IP:
  - The masked performer is an original design: a mirror-oval mask, a deep cowl and streaming ribbons. There is no diamond motley.
  - The necron lord's stepped crown and lappets are a generic headdress, not Imotekh, Trazyn or Szarekh.
  - The flayed one's "skins" are dark ragged tatters only, with no gore.
  - The greater daemon is robed and armoured, with a serene face, sweeping horns and an open pincer claw.
  - None of the omens has a figure or face. The Silent King omen is an empty throne, and Ynnead is soul-light rising over fallen helms and dimmed spirit-stones.
- The dig_site "black edge" has a faint green seam so it reads as necron. The tomb_interior alcoves hold dormant warrior silhouettes. stasis_gallery shows 27 pedestals with frozen tanks, trees, walkers, ships and beasts. All new scenes keep the lower third calm via `calm_lower`.
- Every new character sprite is ≤ 12 colours. Omens stay exempt from the cap, as in v0.1.

## 2026-11-11 · text-origins (v0.2: SPEC §16 origins + §17 renownHelp + §18 taint)
- **Origins** added to `imperium.js`, `chaos.js`, `tau.js` (origin #1 = the old opening, unchanged). New prologue nodes are all chapter 1, ids `<prefix>o_<origin>_N`; existing node text untouched.
  | route | origin (id) | sprite | stats hp/san/cor/ren (sum) | prologue | merges at |
  |---|---|---|---|---|---|
  | imperium | 巢都工人 hive | player_imperium | 100/100/0/10 (210) | — | imp_101 |
  | imperium | 农庄之子 agri | player_imperium | 95/100/0/20 (215) | 5 (imp_o_agri_1–5) | imp_201 |
  | imperium | 落魄贵族次子 noble | guardsman | 85/100/0/30 (215) | 5 (imp_o_noble_1–5) | imp_201 |
  | chaos | 下巢拾荒者 scavenger | player_chaos | 100/100/0/10 (210) | — | cha_101 |
  | chaos | 星界军逃兵 deserter | guardsman | 100/85/0/15 (200) | 5 (cha_o_deserter_1–5; _5 only on a failed roll) | cha_107 |
  | chaos | 教会抄写员 scribe | preacher | 90/95/0/20 (205) | 4 (cha_o_scribe_1–4) | cha_107 |
  | tau | 人类殖民者 colonist | player_tau | 100/100/0/10 (210) | — | tau_101 |
  | tau | 归顺的星界军俘虏 pow | guardsman | 100/85/0/20 (205) | 3 (tau_o_pow_1–3) | tau_104 |
  | tau | 港口商人 trader | player_tau | 95/100/0/20 (215) | 4 (tau_o_trader_1–4) | tau_104 |
  - Continuity: the farm is a dome farm on Aurex's own ash plains (not a separate agri-world), so later "home / Tower Three / you grew up here" lines still fit. Both Imperium prologues end on the transport with Pell offering the free watered recaff, so his later "we're even for the recaff" still lands. Both Chaos prologues introduce Tikka (coughing) and Kade (can set `kadeKnows`) before cha_107. Both T'au prologues introduce Aunt Rena and Jory before tau_104 → tau_108 → tau_107.
  - The noble is "second-born" in English to keep the player ungendered.
- **Origin beats** (`require:{flag:"origin_<id>"}` + `hideIfLocked`, all with `result`): imp_502 split a wheat ear (agri) · imp_516 clutch Mother's seeds (agri, `agriSeeds`) · imp_701 ask after House Serrin (noble) · imp_802 lure the traitors into the family lift → imp_807 (noble) · cha_302 shout the old regiment's challenge (deserter) · cha_703 give the pinned Guardsman your old patch (deserter) · cha_702 speak the verse the priest skipped (scribe) · cha_606 recognise your own handwriting (scribe) · tau_209 name your old regiment to Old Hask (pow) · tau_410 coach the captured Guardsman (pow) · tau_411 haggle the liaison's pay (trader) · tau_609 lead refugees through the smugglers' channel under Berth Seven (trader).
- **§17 `renownHelp`** on all three factions (≤80 zh / ≤55 en).
- **§18 taint** added to existing choice effects, never shown in text: Imperium 12 (soup/cult → nurgle, the hull voice / dagger / weighing kneeling → tzeentch, the song → slaanesh; prayer / confession / names of the dead → `all:-5..-10`); Chaos 11 + 3 on scribe origin choices (god paths +20 to their god, trials +15, bloodshed → khorne, mirror → slaanesh, singing the hymn → `all:-10`); T'au 10 + 1 on a pow choice (Silas's mark / god → khorne, warp gazing and betraying Kel'ra → tzeentch, Silas's sermon → slaanesh, Ethereal calm / scraping the mark → cleanse). Simulated average final taint per god stays under 8; ≥50 happens in under 2% of runs.
- **Checks:** `node tools/dev/validate.js` PASS with 0 errors. Remaining warnings: Imperium has 105 nodes and Chaos 99, over the §3 range of 70–95; the origins make that unavoidable. Also the old imp_603 warnings and missing files/claim events owned by others. Extra vm checker at `/tmp/origins/check.js` (2000 runs per origin): every origin reaches endings, has 0 loops and 0 dead ends, and visits every prologue node. Every origin beat is taken in the sim. Lengths are OK (nodes ≤90/65, choices ≤24/14, results ≤50/35, desc ≤40/25). Average nodes per origin: imp 45.6/45.3/45.5 · cha 45.5/46.3/45.5 · tau 48.4/49.4/51.1.

## 2026-11-11 · text-taint (SPEC §18)
- New `data/events_taint.js`: 32 events.
  - **25 route events**, 5 per route. Each route has all four gods polluting plus 1 cleanse (`cleanse:true`, `god:"other"`). `minChapter` runs from 2 to 6.
    - Imperium cleanse: confession to the regimental priest.
    - Chaos cleanse: an old woman sharing her mash.
    - T'au cleanse: meditation with an Ethereal.
    - Aeldari cleanse: a bonesinger's spirit stone.
    - Necrons cleanse: the null-pylon's quiet.
  - **4 claim events** `evt_claim_<god>` (`trigger:"claim"`, `factions:["*"]`). Each has two choices:
    - Accept: corruption +25, sanity −10/−15, a boon, and sets `claimed_<god>`.
    - Resist: corruption +15, sanity −20/−25, often hp −10/−15, god taint −30, and sets `claimed_<god>` + `resisted_<god>`.
  - **3 shared events**: `evt_t_any_dice` (undivided: khorne/tzeentch), `evt_t_any_feast` (undivided: slaanesh/nurgle) and `evt_t_any_note` (cleanse, a note from home; speaker has a name but no sprite).
- Taint sizes:
  - Route polluting choices +18/+20; shared ones +12.
  - Cleanses `all:−20/−25` (full), `all:−10/−15` (partial); the Aeldari stone also gives `slaanesh:−10`. Side choices ±5.
  - Every polluting choice pays something (hp, sanity, renown or foresight).
- Texts never name a specific route NPC. Events can fire in any later chapter, so they use generic speakers (Ethereal elder, kroot drummer, water-caste envoy, medicae) to avoid continuity breaks. The Necron events assume you are a captive in the tomb from chapter 2.
- `data/events.js`: added taint deltas to 15 choices.
  - khorne_1 +15; khorne_2 +10 / −5 (toss ration) / +15
  - nurgle_1 +15; nurgle_2 +10
  - tzeentch_1 +10 / +5 (go left); tzeentch_2 +12
  - slaanesh_1 +15 / −5 (throw away); slaanesh_2 +12
  - undivided_1 all +5; undivided_2 all +6
  - other_1 (pray) all −10
- Validator: PASS, 0 errors. My only warnings are "faction aeldari not loaded" (the route file is still being written).
- Monte-Carlo (random choices): average final taint 2–10 per god, claims at 0 %. With ~2 events per run, events alone rarely reach 100. Claims depend on node-level taint from the route files, or on a player who keeps feeding one god.

## 2026-11-11 · text-necrons
- New route `data/factions/necrons.js` (prefix `nec_`): 95 nodes (8 of them origin prologue), 8 chapters (死寂之星 → 苏醒 → 礼数 → 藏品 → 长廊 → 旧敌 → 回到墓穴 → 星神). Start 113.M42 on Thessa Null / the Akhemet tomb world. Two very large time jumps: stasis `{y:380}` (nec_501) and the dolmen-gate transit `{y:700, warp:true}` (nec_606).
- Origins (§16): `archivist` (default, nec_101), `convict` (nec_o_convict_1–4), `lexmech` (nec_o_lexmech_1–4). All prologues merge at nec_106. Origin beats: convict → nec_210, nec_801; lexmech → nec_701, nec_706 (sets `drillStalled`, which opens a sure reseal at nec_802).
- Endings: good `nec_end_truth`, `nec_end_curator`, `nec_end_chronicler`; bad `nec_end_inquisition`, `nec_end_exhibit`, `nec_end_devoured`, `nec_end_metal`, `nec_end_flayer`; death `nec_death_hp/sanity/corruption`. Every ending has a `cause`.
- `renownHelp` (§17) added. Hidden taint (§18) is on 15 choices (small +5/+10; stasis/null → `all:-10` at nec_409 and nec_802). Two route events (`evt_nec_scarab`, `evt_nec_echo`, god "other") are in the faction file. eventRoll is on 6 nodes.
- `data/codex_necrons.js`: 29 entries with race/type, including the shared `nec_necrons` and `nec_ctan` (race other, deity). The route reuses `xenos_tyranid`, `imp_imperium`, `imp_inquisition`, `eld_aeldari` (learn.enemies), `eld_rangers`, `eld_monkeigh`. `nec_old_enemies` is only the Necron side of the feud.
- `learn` has an extra `lore` key (Necrontyr, biotransference, Great Sleep, dynasties, crypteks, Flayer curse, old enemies). ui.js ignores it for now. Web could render it as a 4th group "设定 / Lore".
- validate.js --faction necrons: PASS 0 errors. 3000 runs: avg 46.7 nodes (26–55), good 24.8% / bad 45.5% / death 29.7%. All 11 endings were reached (corruption death is rare at 0.1%). Per origin the avg is 46.6 / 46.8 / 46.8 nodes. 100% of effect choices have `result`, and all 10 rolls have `rollResult`.

## 2026-11-11 · text-aeldari
- New route `data/factions/aeldari.js` (prefix `eld_`) + `data/codex_aeldari.js` (34 entries, all with race/type; places: Valda, the tomb, webway, Selunar, crystal dome, aspect shrine, Ildaneth, Commorragh).
- Story: Valda (agri-world, 41 M humans) is left to a waking Necron tomb so 6,000 Exodites on Ildaneth live; Farseer Taethra keeps you as a "thread", webway → Craftworld Selunar → Masque of the Fall → Ildaneth (Ynnari herald, Drukhari raid, Mireth's spirit stone) → bait for a Keeper of Secrets ("the Unsated").
- 97 nodes = 87 spine + 10 origin prologue (§16: `agri` default, `pilgrim` eld_o_pilgrim_1–5, `trooper` eld_o_trooper_1–5, merge at eld_201; origin-only choices at 203/204/405/506/601/608). 8 chapters, 7 eventRoll nodes, warp jumps in webway/maiden-world/finale.
- Endings: good 4 (maiden, guest, ynnari, masque) · bad 6 (harvest, lost, drukhari, burned, thirst, sealed) · death 3. All have `cause`. Every effect/set choice has `result`; all 11 rolls have `rollResult`.
- §17 renownHelp (命运/Fate) and §18 hidden taint on 15 node/choice effects (Slaanesh mostly; spirit stone / Ellaris charm / Bonesinger cleanse). 2 route events in the faction file: `evt_eld_mirror` (slaanesh), `evt_eld_laugh` (other).
- Term: mon-keigh = 猿人 throughout. Reused shared ids: god_slaanesh, chaos_warp, imp_emperor, imp_imperium, imp_inquisition, imp_psyker, imp_black_ships, imp_guard, nec_necrons.
- validate.js --faction aeldari: PASS 0/0. Sim 2000 runs ×3 seeds: avg 45.5–45.8 nodes, death ~20% (sanity 15 / corruption 2–3 / hp 2), good ~28%, every ending reached.

## 2026-11-11 · web (v0.2)
- **Consequence beats (§11).** `Game.choose()` / `eventChoose()` now return `consequence` = `{text, auto, deltas, roll, flags, death, time, show}` (pure data, `WH.Rules.consequenceOf`). UI: panel inside the dialogue box (previous node text dimmed), typewriter result, roll chip, stat line, time chip, fatal line, 继续. During the beat the HUD shows stats *before* the next node's own effects; the time-skip ticker plays in the beat; node deltas float after Continue. Death by choice → beat first, then the death node. Flags-only choices → no beat. Setting `consequences` (default on); off = v0.1 behaviour (roll toast). Events use the same `conseqBlock`. SFX: `consequence` on open (audio role), `scan` for Necron lore cards.
- **Race → origin (§16).** `WH.Game.origins(f)` returns `f.origins` or one synthesized default origin; `start(originId)` / `WH.newGame(fid, oid)` apply origin stats + `set`; `state.origin` in saves and run records; `g.playerSprite()` uses the origin sprite. Origin step is skipped when a faction has only one origin. Esc / ◂ 种族 go back.
- **Codex v2 (§13).** `raceOf()` / `typeOf()` with fallbacks from faction / id / sprite / cat. Filter state `UI.cx` lives for the session. NEW set = `whatiswh.codexSeen` (initialised from codexGlobal on first v0.2 boot so upgraders don't get 90 badges); snapshot on each fresh open, then everything unlocked is marked seen. Search only matches unlocked entries (no spoilers).
- **Taint (§18).** `state.taint` (hidden), `effects.taint` (`{god}` / `{all}`), `require:{taint}`, weighted event pick (one rng draw, deterministic), claim events (`trigger:"claim"`) checked in `_goTo` and `eventContinue`, never chosen randomly. Visible deltas never include taint. Tells: `#scr-game[data-taint]` vignette tint + ~18% chance of one god whisper per node at ≥50. Ending god cards show bar + verdict. **Save schema 2** is set in `save.js` (`WH.SAVE_SCHEMA = max(…, 2)`) because registry.js is lead-owned — lead may want to move the bump there; migration 1→2 adds zero taint / null origin.
- **§17** `whatiswh.tipsSeen` per faction; Tip card on the first bad/death ending (good endings never show it); ⓘ button in the HUD opens the same text.
- Home (⌂ 主页, H), lore-card modes (`loreCards: new|all|codex`, `knownHint: toast|silent`; v0.1 `auto` → `new`).
- Validator: per-route consequence coverage; codex race × type table + per-file counts + id-collision check; index.html load-order check; origins (stats 0–100, total ±15, `origin_<id>` flag, prologue 3–6 nodes and merges into origin #1's spine, chapter 1); node budget counts spine nodes only (`<prefix>o_*` excluded); taint keys / requires / claim events; simulation alternates origins (per-origin table) and reports avg final taint + claim frequency. SPEC §14 keys used before the art registers them → one "art pending" warning instead of errors.
- Results: validate PASS (5 routes, 0 errors); smoke sample 148/148, real 71/71 (incl. aeldari + necrons played to an ending), 0 console errors.
- Open for writers/design: claim events fire in **0 %** of random runs on every route (max avg final taint ≈ 21 Slaanesh on Aeldari; ≥50 in ≤10 % of runs) — fine if claims are meant for deliberate play, otherwise raise taint deltas. `imp_603` still warns (two exclusive hideIfLocked choices).

## 2026-11-11 · lead (v0.2.0 release)
- Integrated all v0.2 work. Gates: validate.js PASS (0 err), smoke real 71/71 + sample 148/148, audio_check OK. Avg nodes/run: imp 45.2 · cha 46.2 · tau 49.9 · eld 46.0 · nec 46.7.
- Moved SAVE_SCHEMA=2 / VERSION=0.2.0 into registry.js (save.js keeps a max() guard).
- Released to public `main` via release/build_public.py. Artifact republish blocked (link is publicly shared — needs user OK).
- Next (user decision): raise taint so claims happen, gods computed separately, lore-based feasibility per route, write claim endings.
