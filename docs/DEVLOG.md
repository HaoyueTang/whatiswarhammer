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

## 2026-11-11 · web (v0.2.1: SPEC §19 claims become endings)
- **taintMod.** `Game.prototype.taintMod(god)` reads `faction.taintMod[god]` and defaults to 1. `_applyTaint` scales a god's **net positive** delta (`god + all`) by `Math.round(n × mod)`. Cleanses and negative nets stay unscaled. The same path covers nodes, choices and events.
- **goto.** Event choices may carry `goto: "node"` or `goto: {faction: "node"}`. `g.gotoOf(c)` resolves the target. If the map has no entry for this faction, or the node is missing, the game resumes the pending node. `eventContinue()` then enters the goto node instead of `pendingNext`, through the normal `_enter`, so time, effects, codex and death checks apply. Before that, a non-ending goto target still gets the usual claim check. **Decision:** if the same choice's stats would kill you but the goto target is an ending, the ending wins. Otherwise accepting a claim at corruption ≥75 would always turn into "spawn of chaos" and you would never see the claim ending. `eventChoose` then reports `death: null`, so the consequence panel shows no fatal line. A non-ending goto does not override death.
- **Claims ×2.** `state.claims = {god: n}` is saved in records and validated as an optional object by `save.js`, with no schema bump. For older saves, `fromRecord` derives it from `seenEvents`. `claimDue()` fires god G's claim event when `taint[G] ≥ 100` and either `n = 0`, or `n = 1` with flag `resisted_<G>` set. `CLAIM_MAX` is 2. `seenEvents` stays unique, and all other events still fire once.
- **Event choices honour `require` + `hideIfLocked`.** New `g.eventChoices()` returns `{index, choice, locked, fallback}`, with a softlock guard. `eventChoose(i)` takes the index into `e.choices` and refuses locked choices. The UI renders locked choices greyed out with 🔒 and the hint, numbers visible choices 1..n, and omits hidden ones.
- **Claim endings.** `WH.Rules.claimGodOf(id)` matches `_end_claim_<god>`. Entering a claim ending sets `step.claimGod` and unlocks the god's codex entry (`god_<god>`, or a `cat:"god"` id containing the name), so the ending card shows its `more`. Ending screen: a `.claim-banner` at the top of the ending scroll shows the 96 px sigil, `烙印 · <神>`, the verdict **"你已归属于<神>。" / "You belong to <god> now."** (`tv_owned`) and a full bar. That god's card gets `.claimed` and the same verdict.
- **validate.js.** It checks:
  - `taintMod` shape (keys must be gods, values 0–5; warn if missing on a route).
  - Event-choice `require`.
  - `goto`: a string must exist in at least one applicable faction (warn for the others); map keys must be faction ids; every entry must exist in its faction (error); claim maps missing a route get a warning.
  - Claim events: one choice must be open on the first fire and on the second (flags `claimed_`/`resisted_`). Warn if the second fire still offers a choice without goto, if there is no goto choice, or if no choice sets `resisted_<god>`.
  - `<prefix>end_claim_<god>` for all 4 gods on every route (warn if missing). Each must be an ending of kind bad (chaos may be good), with a cause, and some goto must lead to it.
  - Event goto targets now count as reachability roots.

  The simulation picks only open event choices. Per route it prints taintMod vs the SPEC guide and a per-god table (fired / 2nd fire / claimed (ending) / resisted / avg taint), plus totals. It then gives the §19 target band with ✓/✗, plus a one-line summary of all bands. Until a route has claim endings, the band uses the claim-event rate (marked `*`).
- **sample_data.** Sample `taintMod` is tzeentch ×1.5, slaanesh ×0.5. `smp_claim_khorne` now has accept (goto → claim ending), resist (taint −40, `resisted_khorne`) and a forced choice ("铜王座不再询问", `require:{flag:"resisted_khorne"}`, goto). Added `smp_end_claim_khorne`.
- **Smoke tests.** The sample run has 11 new checks: taintMod maths, the first claim (2 choices, forced one hidden), accept → claim ending with banner, claimed card, god codex and EN verdict, resist → resumes with taint 60 and the flag, the second claim (only the forced choice) → ending with `claims=2`, and no third claim. `resolve_event` now picks only enabled buttons. Results: sample 159/159, real 71/71, 0 console errors. validate: real PASS (0 errors), sample PASS.
- **For the writer and lead.** The band is measured on **claim endings**. With random 50/50 accept/resist, the claim-ending rate will be roughly 0.5–0.65 × the current claim-event rate. Current event rates are imp 15.1, cha 22.6, tau 7.6, eld 13.6, nec 3.9 %, which would fall under most bands once the endings land. Either raise taint further or decide that the band means "claim fired". Resist currently gives `taint −30`; SPEC says −40.

## 2026-11-11 · text-claims (SPEC §19: claims become endings)
- **taintMod** on every faction, exactly per the §19 table: imperium all ×0.9 · chaos all ×1.3 · tau all ×0.7 · aeldari slaanesh ×1.3, others ×0.9 · necrons all ×0.5.
- **Claim events** (`data/events_taint.js`). Helpers `A`/`B`/`F` and a `CLAIM_GOTO[god][route]` map.
  - Accept: `require:{notFlag:"resisted_<god>"}` + hideIfLocked, `goto` to the route's claim ending. It now only sets `claimed_<god>`; the old boons and corruption +25 are gone, because the run ends right there and corruption 100 would otherwise race the goto into a death node.
  - Resist: same require. Costs corruption +15, sanity −20/−25, hp −10/−15 (tzeentch and slaanesh gained hp −10), `taint:{<god>:-40}`, and sets `resisted_<god>`.
  - Forced: `require:{flag:"resisted_<god>"}` + hideIfLocked, same goto. Texts: 鼓声太响了。应吧 / 太累了，赶不动了 / 这一句，他也料到了 / 就尝最后一口.
  - Every accept and forced choice has a `result` beat.
- **28 new nodes.** 20 claim endings `<prefix>end_claim_<god>`, each unlocking `god_<god>`. Chaos also has 4 pre-ending nodes `cha_claim_<god>` and 4 `cha_end_claim_<god>_chosen` endings (kind good). Claim nodes have no chapter, because they can fire in any chapter.
- **Chaos "chosen".** `devoted_<god>` is set by the god-path pact (cha_402–405, alongside pK/pN/pT/pS) and by passing that god's trial (cha_603/605/607/609, alongside markX). At `cha_claim_<god>`, "以他的勇士/园丁/书记 · 以她的宠儿之名回应" needs `devoted_<god>` (shown locked otherwise) and leads to `_chosen`. "任由它带走你" is always open and leads to the bad ending, so a devoted player can still refuse the honour.
- **Feasibility calls (lore):**
  - Imperium: all four gods can fully claim. Guardsmen are exposed and faith only slows it (×0.9). The endings use the setting (squad, field hospital, war map, fleet triumph), never a specific NPC.
  - Chaos: all four can fully claim. A claim by your own god = dark good ending (champion / gardener / scribe / favourite). Any other claim = thrall fate (hound, seedbed, footnote, hollowed out).
  - T'au: the T'au are warp-quiet, but their humans aren't. Claims show through how the T'au fail to perceive them: an "efficiency anomaly", a quarantined street of smiling sick, a triple agent dreaming T'au plans, a party in the human quarter. Random play: Tzeentch (dreams, Farsight, betraying Kel'ra) and Khorne (Silas's mark); Slaanesh rare; Nurgle only by deliberate play.
  - Aeldari: Slaanesh is the natural claimant (most common). `eld_end_claim_slaanesh` is a standalone ending rather than a bridge to `eld_end_thirst`. A claim can fire before the Unsated appears (ch3–7), so it uses the dream of Valda motif (eld_702) and "no spirit stone caught it". The thirst ending stays the finale-specific version. Khorne is the war-mask without a Path, contrasted with Khaine. Nurgle is the exiled gardener, echoing Isha in the Gardener's keeping. Tzeentch plucks fate-threads behind the Farseer.
  - Necrons: the tomb's null field means the god cannot take you inside. Khorne, Nurgle and Tzeentch take you **the moment you step outside** ("零场之外", "出墓的第一步", "星空下的答案"). Slaanesh gets a **lesser fate**: she cannot reach you, but your own wanting freezes you in stasis as a plaque reading "人类，渴望中". Random play: Tzeentch (curiosity/knowledge) and Nurgle (despair in the pit).
- **Taint sizes** (invisible, never in text; cleanses unchanged):
  - Shared events: primary choices +30, secondary +25 (khorne_2 hit back, nurgle_2), tzeentch_1 left +10, undivided all +12/+15.
  - Route taint events: +30 (tear page +8). Dice and feast: +25. `evt_eld_mirror`: +30.
  - Route node/choice deltas rose about 2–4×, and about 60 more tempting choices/nodes now carry taint. Each route now has 2–4 god threads instead of one, so gods spread.
    - Imperium: Brin/soup → nurgle; hull voice, cult dagger, kneeling → tzeentch; battle rage → khorne; song and vanity → slaanesh.
    - Chaos: god-path pacts 45–55, trials 30, plus offerings.
    - T'au: Silas's mark and his god → khorne (up to 90 at the last stand); warp dreams, Farsight pact, betraying Kel'ra → tzeentch; Silas's sermon → slaanesh.
    - Aeldari: webway, She Who Thirsts, the dream at eld_702 and the eld_803 loop → slaanesh; rune-stones and fate → tzeentch; war-mask → khorne.
    - Necrons: glyphs, the shard's name, counting time, sealed reports → tzeentch (needed raw 70–80 because of ×0.5); the pit, the 41st plinth, Kaal → nurgle.
  - `eventRoll` ×1.4 on all route nodes (0.25 → 0.35, 0.3 → 0.42, 0.35 → 0.49, 0.4 → 0.56). Events/run are now ≈2.9–3.1 (necrons 2.1).
  - Tuning scripts: `/tmp/claimsim/` (`apply.js`, `endings.py`, `splice_claims.py`, `build.sh` rebuild from pristine copies).
- **Results** (`validate.js`, 3000 runs/route; seeds 1/5/9). Claim endings, any god:

  | route | claim endings (seeds 1/5/9) | band | claim fired | death |
  |---|---|---|---|---|
  | imperium | 13.8 / 14.6 / 14.7 % | 12–18 ✓ | 26.9 % | 30.3 % (was 28.7) |
  | chaos | 25.2 / 24.2 / 26.2 % | 20–30 ✓ | 45 %; chosen ≈ 11 % of runs | 27.2 % |
  | tau | 9.3 / 9.4 / 8.9 % | 6–12 ✓ | 18 % | 24.4 % |
  | aeldari | 15.9 / 17.5 / 16.2 % | 12–18 ✓ | 29 %; slaanesh 10.4, tzeentch 4.1, khorne 1.4 | 21.5 % |
  | necrons | 4.2 / 5.3 / 5.4 % | 3–8 ✓ | 9 %; tzeentch 3.1, nurgle 1.1 | 28.5 % |

  - Before this change, claim events fired in 0 % of runs on every route.
  - All pre-existing endings are still reached.
  - Claim endings never reached by random play: tau nurgle, aeldari nurgle, necron khorne and slaanesh. They are reachable by feeding that god through events.
  - Avg nodes per run fell to imp 43.4, cha 42.1, eld 44.4 (target 45–60 warns), because claim endings cut runs short mid-route.
  - Claims mostly fire in ch4–8; Imperium has a handful in ch2–3.

## 2026-11-11 · text-lore (SPEC §20: lore clues for veterans)
- **New files** (text-lore only): `data/chronicle.js`, `data/rumors.js`, `data/events_lore.js`. Nothing else touched. `index.html` must load them in this order: chronicle.js after codex_necrons.js; events_lore.js and rumors.js after events_taint.js (web role). `validate.js` already loads them.
- **Chronicle** (36 `chr_*`, type concept, tags chronicle, faction any, cat lore, sprites from the SPEC key lists):
  - M25 1 · M30 3 · M31 6 · M32 1 · M36 1 · M41 19 · M42 5.
  - Covers the Age of Strife, the Eye of Terror's birth, Unification, the Great Crusade, Ullanor, Isstvan, the Siege of Terra, the Second Founding, Guilliman struck down, the 1st Black Crusade, the War of the Beast, the Age of Apostasy, the 1st/2nd/3rd Armageddon wars, Damocles, the Silent King's return, Macragge, Sabbat Worlds, the Farsight Expedition, Badab, Kraken/Iyanden, Leviathan, the Third Sphere, Taros, Octarius, the Fall of Cadia, the Great Rift, Baal, Ynnead, Guilliman's return, the Plague Wars, Vigilus, the Fourth Sphere, the Pariah Nexus and Arks of Omen.
  - Post-Rift (M42) canon has no fixed years, so those entries say "M42初 / early M42", "大裂隙后 / after the Rift" or "M42".
- **Dropped:** an entry for the War in Heaven / shattering of the C'tan (c. 60 million years ago). Its sortKey (−60,000,000) gave a "M-60000" millennium band in the UI and a validator warning. Rumours and events unlock the existing `nec_war_in_heaven` / `nec_great_sleep` instead. If the web role adds an "远古 / Ancient" band for sortKey < 1000, it can come back.
- **Not duplicated:** `chaos_horus_heresy`, `imp_great_rift`, `imp_indomitus`, `eld_the_fall`, `nec_war_in_heaven` and `place_cadia` stay as they are. Chronicle entries cover specific dated events, and their aliases avoid clashing with existing ones. "野兽" was removed because it already appears in route text.
- **Rumours** (72): imperium 12 · chaos 12 · tau 11 · aeldari 11 · necrons 11 · shared 15.
  - Every chr entry is unlocked by at least one rumour or event.
  - Shared rumours are memories, dreams, rhymes and found objects, so they fit a craftworld or a tomb.
  - When a first-hand witness would be too old (e.g. 941.M41 told in 111.M42), the line is second-hand ("照爷爷的纹身纹的").
  - The T'au "Third Sphere" line comes from the speaker's mother, because T'au lifespans are short.
- **Lore events** (9, god other/undivided; effects ±3–10; taint at most ±5):
  - `evt_lore_armageddon` (imperium): a cook with his grandfather's Hades tattoo.
  - `evt_lore_cadia` (imperium, chaos): a Cadian who won't talk about the Gate.
  - `evt_lore_damocles` (tau): an aged water-caste envoy remembers Dal'yth.
  - `evt_lore_fall` (aeldari): an old soul in wraithbone smells wheat; one choice cleanses slaanesh −5.
  - `evt_lore_war_in_heaven` (necrons): a cryptek for whom the War in Heaven is "recent".
  - `evt_lore_silent_king` (necrons): an overlord rattled by the King's return.
  - `evt_lore_terra_vision` (all but necrons, since the null field blocks visions): a vision of the Siege.
  - `evt_lore_isstvan` (chaos): a Black Legion veteran with a scraped pauldron.
  - `evt_lore_badab` (imperium, chaos, tau): a Red Corsair recruiting over an open channel.
- **Rules kept:** original prose, no GW slogans (e.g. "Cadia Stands" is deliberately avoided; the graffiti breaks off at "卡迪亚还……"), no gore.
- **Checks:** a /tmp vm checker with stubbed registerRumors (lengths, ids, codex refs, keys, sortKeys, coverage). `node tools/dev/validate.js` → PASS, 0 errors, no warnings from these files (2 notes: "after the Rift" dates group under M42 by sortKey). Simulated runs overhear 8.9–10.1 rumours each.
- **Sources** for dates and outcomes:
  - Lexicanum, 41st Millennium timeline (Damocles 742, Macragge 745, Sabbat 755, Farsight Enclaves 760, Badab 901–912, Armageddon 444/941/998, Kraken 992–993, Leviathan 997, Third Sphere 997, Taros 998, 13th Black Crusade / Fall of Cadia / Guilliman / Ynnari / Octarius c. 999): https://wh40k.lexicanum.com/wiki/41st_Millenium
  - Lexicanum, 31st Millennium (Ullanor 000, Isstvan III 005 / V 006, Siege 014, Second Founding 021, Thessala 121, 1st Black Crusade 781): https://wh40k.lexicanum.com/wiki/31st_Millennium
  - Lexicanum, 30th Millennium (Fall ca. M30, Unification ends 712, Olympus 739, Great Crusade c. 798): https://wh40k.lexicanum.com/wiki/30th_Millennium
  - Third Armageddon War (998, 57 years to the day, Ghazghkull leaves, Yarrick pursues): https://wh40k.lexicanum.com/wiki/Third_Armageddon_War
  - Age of Apostasy (M36, 70-year reign, Thor, Sororitas): https://wh40k.lexicanum.com/wiki/Reign_of_Blood
  - Farsight Expedition (~750s.M41, Enclaves 760.M41): https://wh40k.lexicanum.com/wiki/Farsight_Expedition
  - Great Beast (544.M32, attack moon, Imperial Fists rebuilt): https://wh40k.lexicanum.com/wiki/Great_Beast
  - Octarius (989 or 999.M41, Kryptman, ongoing): https://wh40k.lexicanum.com/wiki/Octavius_War
  - Devastation of Baal (~999.M41, Rift and daemons, Guilliman's relief): https://wh40k.lexicanum.com/wiki/Battle_of_Baal
  - Fourth Sphere (slipstream rift, about ¾ lost, Chalnath Expanse, Nem'yar): https://wh40k.lexicanum.com/wiki/Fourth_Sphere_Expansion
  - Vigilus (Nachmund Gauntlet, orks/GSC/Abaddon, outcome): https://wh40k.lexicanum.com/wiki/War_of_Nightmares
  - Pariah Nexus (M42): https://wh40k.lexicanum.com/wiki/War_in_the_Pariah_Nexus
  - Cadian pylons (Necron-like, their loss → Rift): https://wh40k.lexicanum.com/wiki/Pylon
  - Will of Eternity debris shattered Cadia: https://wh40k.lexicanum.com/wiki/Blackstone_Fortresses
  - War in Heaven (~60 Myr before M41): https://wh40k.lexicanum.com/wiki/War_in_Heaven_(Necron)
  - Szarekh (shattered the C'tan, Great Sleep, exile, return c. 744.M41 on seeing Tyranids): https://www.belloflostsouls.net/2026/05/40k-lore-szarekh-the-silent-king.html
  - Era overview (Age of Strife M25–M30; Indomitus = first century of M42): https://www.pcgamer.com/uk/major-events-in-the-warhammer-40000-timeline
  - Macragge details (First Company, Calgar): https://www.warhammer-community.com/en-gb/articles/sM45KF7s/3-key-conflicts-that-shaped-the-destiny-of-the-41st-millennium/
  - Arks of Omen (Vashtorr, arks from hulks + daemon fleshmetal): https://www.warhammer-community.com/en-gb/articles/jwWlgLqL/arks-of-omen-abaddon-is-your-first-step-into-an-even-grimmer-even-darker-future/
  - Arks of Omen: Farsight (three-way T'au / orks / Chaos): https://www.warhammer-community.com/2023/03/22/arks-of-omen-farsight-is-a-three-way-bloodbath-between-tau-orks-and-chaos/
  - Damocles withdrawal under truce when Behemoth arrived: https://2d4chan.org/wiki/Damocles_Crusade
  - Plague Wars (Guilliman ends the crusade's first phase; core worlds held, periphery infected): https://2d4chan.org/wiki/Plague_Wars
  - Post-Rift calendar drift: https://bolterandchainsword.com/topic/376462-can-anyone-explain-the-indomitus-crusade-timeline-devastation-of-baal/

## 2026-11-11 · balance (SPEC §23: origin trade-offs)
- User: "不同身份的人只有属性减益，没有属性增益" → every origin now trades off. Only the `origins` entries were edited (`max`, `stats`, `desc`); no story text changed.
- **Key finding:** in random play, Sanity is worth far more than HP. Most deaths are sanity deaths (Imperium ~85 %, T'au ~75 %, Necrons ~80 %). On Imperium, +20 max HP lowers the death rate by only ~3 points, but −15 Sanity raises it by ~15. Renown has almost no effect on death rate. So the profiles keep sanity moves small (±5–10) and HP moves large (±15–20), and pay the rest with renown. The brief's harsher examples (deserter 80 Sanity, convict 85, Guardsman 90/+5) came out 6–9 points over their route average.
- **Profiles** (max hp / max sanity / corruption / renown → budget; death % and Δ vs route avg from /tmp/balance/sim.js, 3000 runs × seeds 1/5/9 per origin):
  | route | origin | hp | san | cor | ren | budget | death | Δ |
  |---|---|---|---|---|---|---|---|---|
  | imperium | hive | 115 | 95 | 0 | 0 | 0 | 32.7 | +2.4 |
  | imperium | agri | 105 | 100 | 0 | 5 | 0 | 31.0 | +0.7 |
  | imperium | noble | 85 | 105 | 0 | 20 | 0 | 27.2 | −3.1 |
  | chaos | scavenger | 95 | 105 | 0 | 10 | 0 | 27.1 | −1.3 |
  | chaos | deserter | 115 | 90 | 0 | 5 | 0 | 29.9 | +1.5 |
  | chaos | scribe | 85 | 110 | 0 | 15 | 0 | 28.1 | −0.3 |
  | tau | colonist | 105 | 100 | 0 | 5 | 0 | 23.8 | −1.1 |
  | tau | pow | 115 | 95 | 0 | 0 | 0 | 25.1 | +0.1 |
  | tau | trader | 90 | 105 | 0 | 15 | 0 | 25.8 | +0.9 |
  | aeldari | agri | 100 | 90 | 0 | 20 | 0 | 21.7 | −0.1 |
  | aeldari | pilgrim | 80 | 110 | 5 | 25 | −2.5 | 20.1 | −1.7 |
  | aeldari | trooper | 110 | 95 | 0 | 5 | 0 | 23.6 | +1.8 |
  | necrons | archivist | 105 | 100 | 0 | 5 | 0 | 31.2 | +0.7 |
  | necrons | convict | 120 | 90 | 0 | 0 | 0 | 33.1 | +2.6 |
  | necrons | lexmech | 90 | 105 | 0 | 15 | 0 | 27.3 | −3.3 |
  Route averages: imperium 30.3 (was 30.3) · chaos 28.4 (27.3) · tau 24.9 (25.0) · aeldari 21.8 (22.0) · necrons 30.5 (29.9).
- **Compensations:**
  - Before this change the Aeldari prologues were very uneven at equal stats: farmhand 12.9 % deaths, pilgrim 28.3 %, trooper 25.1 %. So the farmhand (default) pays with Sanity 90 and gets Fate 20 ("never seen anything strange"). The pilgrim gets Sanity 110 to match the dream visions.
  - The farmhand keeps HP 100. With HP 110 the HP death (eld_death_hp) became too rare to show up in 1000 validator runs.
  - The Necron convict's prologue is the gentlest, so it can carry the full labourer trade-off of 120/90.
- **Checks:** a per-origin set of endings was compared with the old profiles (same seeds, 9000 runs per origin): no origin lost an ending. §19 claim rates are all in band (imp 13.6, cha 23.8, tau 8.7, eld 15.8, nec 5.4). `node tools/dev/validate.js` with seeds 1/5/9 gives PASS with 0 errors. The worst per-origin Δ in the validator is +3.7 (hive, seed 5). There are no §23 budget or trade-off warnings.
- **Left for others:** with some seeds the validator warns "tau.origin.pow/trader never reached tau_end_reeducation". The cause is structural, not stats: that ending sits in the colonist-only opening (tau_10x, before the merge at tau_104), and it was unreachable for those origins before as well. The per-origin ending check could skip endings that are only reachable from another origin's prologue. eld_end_claim_nurgle is ~1/9000 on every origin; that is a taint-tuning matter.
- desc texts now hint at the trade-off (≤40 zh / ≤25 en words). Deserter and Turned Guardsman share a soldier's profile (strong body, nightmares).

## 2026-11-11 · web (v0.2.2: SPEC §20 rumours + Chronicle · §21 Tzeentch egg · §22 local data · §23 caps · §24 difficulty)

### §20 — rumours and Chronicle
- **Registry.** Added `WH.rumors` and `WH.registerRumors(list)`.
- **Load order in index.html:** codex files → `chronicle.js` → `easter_tzeentch.js` → `events.js` → `events_taint.js` → `events_lore.js` → `rumors.js` → factions → `difficulty.js`. Every one of these script tags has `onerror` set, so a missing file does not stop the game.
- **Engine (no DOM).** Rumours roll in `_enter`, but only on nodes that have no `eventRoll`, are not endings, and have no pending death. The chance is `RUMOR_P = 0.25`.
  - The roll uses its own RNG stream, seeded from the main seed (seed XOR a constant). Turning rumours on or off therefore never changes nodes, rolls, events or time in a seeded run (a smoke test checks this).
  - One rumour per node at most. It is picked uniformly from the unseen eligible ones (faction or `*`, inside the min/max chapter window).
  - Results: `step.rumor` and `step.rumorCodex`; `state.seenRumors` and `state.rumor` are saved; `g.currentRumor()` returns the current one.
  - Off switch: `opts.rumors:false` or `g.rumors = false`. Older saves get empty defaults, and the schema number stays the same.
- **UI.** `#dlg-rumor` is an italic footer: "传闻 · 讲话者：…" in Chinese, "Overheard · …" in English, with dictionary words linked.
  - Its space is reserved while the typewriter runs; it fades in afterwards. Its codex ids then go through the normal toast and lore-card settings.
  - It is hidden during consequence panels and events.
  - The new setting is 传闻 / Overheard rumours (default on). Turning it off hides the footer immediately and stops new rolls.
- **Codex — 战史 / Chronicle view** (tab after 地点):
  - Timeline ordered by `sortKey`, with separators per millennium (M25…M42). Keys below 1000 go into an **远古 / Ancient** band for later entries such as the War in Heaven.
  - The date is always shown. Locked entries show "???" with the date and "此时，有事发生……". Unlocked entries show the name, a type·race badge, the text and `more`.
  - Race chips filter the list; the header shows "已知 n/t".
  - Chronicle entries are left out of the 条目 grid. Lore cards for them show the date, plus an "M41" seal when the entry has no sprite.

### §21 — Tzeentch easter egg
- **Progress:** `P = round(100 × (0.6 × codex + 0.4 × endings))`. P is capped at 99 while anything is still missing.
- **Hidden entries** (`hidden:true`) are never counted and never appear in any list or in the NEW badge.
- **Tiers** are stored in `whatiswh.eggTiers` and each fires once:
  - whisper — the subtitle glitches in blue/pink for 3 s.
  - letter — a sealed letter icon on the title screen; clicking it opens a card.
  - flame — a blue flame next to the logo; clicking it opens a mini-scene with 2 choices whose result lines change nothing in the game.
  - last — a codex-header line, shown for one opening.
  - planned — a full-screen glitch scene, then the hidden letter is unlocked and its card shown. After that the logo shimmers, and Settings gains 奸奇的玩笑 / Tzeentch's joke: while the codex is open, every 2.4 s one random locked "???" briefly shows that entry's real name, shuffled.
- **Debug:** `?egg=N` sets P to N and re-fires the tier at N once per page load.

### §22 — local data is never overwritten
- **Version check.** `Save.bootCheck()` runs first in `UI.init`. It compares `whatiswh.lastVersion` with `WH.VERSION`.
  - Every older save slot is migrated on a copy, and the raw text from before the migration is kept as `whatiswh.bak.<old>.<slot>`.
  - A one-time toast reads "已更新到 vX · 存档与记录已保留". A new install and a downgrade both stay silent.
  - It never deletes or renames a key.
- **Corrupt data.** A value that can't be parsed is copied to `whatiswh.corrupt.<key>` before anything could write over it.
- **Unknown fields.** Record fields this build doesn't know survive a load → save cycle (`g.extraFields`).
- **Run records.** The cap went from 50 to 200.
- **Settings → 数据 / Data** has: export everything (download), copy to clipboard (the JSON also appears in a box, for pages that block downloads), import from a file, and import from a paste box.
- **Merge rules on import:**
  - Run records: union by `runId:endingId`; totals are added once.
  - Codex, NEW-seen, tips and egg tiers: union.
  - Endings: the higher value wins.
  - Save slots: only empty slots are filled unless the player confirms overwriting; any overwritten slot is kept as `bak.import.<slot>`.
  - Settings and unknown keys: copied only if they don't exist yet.
- **README:** added a note in both languages that progress is tied to the browser and the address.

### §23 — stat caps
- **Engine.** `capsOf(origin)` gives hp/sanity caps of 70–130 (default 100) and fills `state.max`.
  - Starting stats default to the caps.
  - hp and sanity are clamped to `g.cap(k)`; corruption and renown still clamp to 0–100.
  - Saves store `max`; saves without it get 100/100.
- **HUD** shows "118/120" (`#sm-hp`), with the bar scaled to the cap.
- **Origin cards**
  - hp/sanity bars share a 0–130 scale with a tick at 100.
  - Deltas are measured against the neutral 100/100/0/10.
  - A cap line lists each cap that differs from 100, e.g. "生命上限 115 ▲ · 理智上限 95 ▼", or "均衡" when both are 100.
- **Validator**
  - Checks `max` ranges.
  - Applies the budget rule (`(maxHp−100)+(maxSan−100)+(renown−10)−1.5×corruption` within ±5) and the up+down rule for non-default origins.
  - Notes origins that start below their cap.
  - Per origin it reports caps, budget and death rate against the route average, and warns beyond ±6 points.
  - It also warns about route endings an origin never reached — only endings that origin can reach statically from its own start, and only those hit in at least 0.5 % of runs.

### §24 — difficulty
- Generated by `validate.js --write-difficulty`, which writes `data/difficulty.js` with levels only (faction and "faction/origin").
- **Current levels:** imperium 3, chaos 2, tau 2, aeldari 1, necrons 3.
- The skulls are drawn in code (like the slime placeholder) and tinted to the faction; the remainder are empty skulls. There is no text and no tooltip, only an aria-label.

### Validator, sample data and results
- **Validator now also checks:**
  - Rumours: unique ids, factions, chapter ranges, codex refs, zh/en, and ≤50 zh / ≤35 en.
  - Chronicle: tags, date, numeric `sortKey`, the date's millennium matching the `sortKey`, zh/en agreement, and entries that can never be unlocked.
  - Lore events, which go through the normal event checks.
  - Load order, hidden entries, and the shape of the egg tiers.
- **Validator reports:**
  - Rumours per route and per chapter.
  - Chronicle entries per millennium.
  - Average rumours heard per simulated run: imperium 9.1, chaos 8.8, tau 10.1, aeldari 9.4, necrons 9.9.
- **sample_data:** 3 chronicle entries, 2 rumours, the hidden egg entry, and the scav/clerk caps.
- **Results:**
  - validate (real): PASS, 0 errors.
  - Smoke, sample: 252 checks, all passing.
  - Smoke, real: 78 + 20 checks, all passing.
  - 0 console errors.
- **For lead:** the public `release/README.public.md` still lacks the §22 "per browser + address / full backup" note; I didn't edit `release/`.

## 2026-11-11 · lead (v0.2.2 / v0.2.3 release)
- v0.2.2 = stable §20–§23 snapshot (committed from a copy while §24 was in progress). v0.2.3 = §24 skulls + origin-card delta baseline (neutral 100/100/0/10) + fresh-install toast fix.
- Gates: validate PASS (0 err), smoke real 87/87, sample 253/253, 0 console errors.
- Public README gained the progress-per-browser note and difficulty line.
- **text-lore follow-up (SPEC §20b, relevance):** every rumour in `data/rumors.js` now has a `when` (helper `W(scenes, sprites, codex, zh[], en[], flags)`). Each `when` points at the rumour's topic using scene and sprite keys, codex ids and words that actually occur in that route's nodes. Some examples:
  - Armageddon ↔ ork sprites, trench, "兽人".
  - Damocles ↔ tau_water_caste, place_damocles_gulf, "海湾".
  - The Fall ↔ aeldari_guardian, eld_the_fall, "陨落/色孽".
  - War in Heaven ↔ cryptek, nec_ctan, "星神/天堂之战".
  - Gallery placards ↔ stasis_gallery, omen_collector.
  - Bug words use 虫子/虫群/虫族/虫潮, not 虫, because 虫 also matches the necrons' 甲虫.
- **Shared rumours** now list only the routes where their topic actually appears, instead of `["*"]` (0 remain as `"*"`). As a result, `validate.js` counts them as route rumours and prints the "8–12 per route" / "0 shared" warnings. Those warnings are a counting artefact.
- **Text changes:** some chapter windows were widened or moved (e.g. the Cadia graffiti now ch6–8, where the Black Crusade is), and 5 speakers were renamed to fit their trigger scenes. No rumour text was changed.
- **Coverage:** every rumour matches 3.2–15.8% of its route's nodes; none are unreachable, none are too generic. `validate.js` simulation: 6.3–7.8 rumours per run on every route (target 4–8), and 54–68% of them match on ≥2 criteria.

## 2026-11-11 · text (achievements, §25)
- **New file:** `data/achievements.js` with 60 achievements: 18 bronze, 26 silver, 16 gold; 15 are hidden. All 19 §25 condition types are used.
- **Themes:**
  - Milestones (5).
  - Every ending on each of the 8 routes (gold).
  - All origins on each of the 8 routes.
  - Gods (10): 4 claims, Ork-route Khorne claim, claimAll, chosen, resist ×2, taintSum. All hidden, because taint is a secret mechanic.
  - Deaths (14): 1/25/100, each cause, one per route.
  - Grit/speed (2).
  - Hidden moments (3): servitor ending, savedBaby, namedDrone.
  - Knowledge (8): codex 25/50/100, places, deities, Tyranids, chronicle, rumours.
  - Tzeentch egg 50/100.
- **Registry fallback:** if `WH.registerAchievements` is missing, the file pushes into `WH.achievements` (array). The registry and `index.html` still need the real API and a `<script src="data/achievements.js">` after the data files (web/lead).
- **v0.3 routes:** `orks` / `gsc` / `mechanicus` achievements use only faction-level conditions plus `ork_end_claim_khorne`. Their icons are the fixed §26 keys `player_orks`, `player_gsc`, `player_mechanicus`, `omen_waaagh`, `omen_four_armed` and `omen_omnissiah`, which are not yet in the manifest.
- **Semantics assumed (engine to confirm):**
  - `endingKind.count` / `deaths.count` / `runs.count` count occurrences, not distinct endings. The descriptions are worded as "N times".
  - `egg.tier` uses the §21 thresholds (50/100).
  - `fast.maxNodes` counts story nodes visited, including the start node.
- **Check:** a /tmp vm checker (registry + manifest + all data + stub) reports 0 errors and 16 warnings. Every warning is about a pending v0.3 faction, an icon key or a claim ending.

## 2026-11-11 · audio (v0.3)
- **New moods** (original, 32-bar A/B/A2/B2 like the others; calm-type, so they get the 8 s hysteresis):
  - `orks` "Scrap-Heap Stomp": G minor with blues colour, 140 bpm, 55 s loop. A runs a Gm–Gm/F#–Gm/F–C/E line-cliché into Eb–Db (the b5 chord)–D7. B is half-time Cm–Bb–Ab–G…Db–C–D. A brassy 50 % square lead doubled an octave down, offbeat horn stabs on the claps, a "grot" kazoo (12.5 % pulse, 45-cent 11 Hz vibrato) heckling in A2/B2, stomp-stomp-clap drums, big floor toms and scrap clanks.
  - `gsc` "Hymn Under the Mine": an F major hymn that keeps going wrong, 66 bpm, 116 s loop. iv minor (Bbm), bII (Gb) instead of V before the final F, bVI (Db). Organ chords, a flute-organ hymn voice, and a toll bell whose octave is flattened a semitone (stack 11). In A2/B2 the hymn moves to `lead2`, which adds a quiet detuned tritone shadow beneath every note (organum at the "wrong" interval), and the organ thins to 12.5 %. Insect chitter clicks grow denser on each pass.
  - `mechanicus` "Canticle of the Cogitator": F# aeolian with a C# major turn, 100 bpm, 77 s loop. A detuned choir-pulse chant in parallel fifths (stack 7) on a reciting tone in even 8th syllables. A 12.5 % "data" ostinato whose root/octave pattern spells a different binary word per section. A slow choir pad, machine kick, metal ticks, forge-anvil clangs on 2 & 4, and a glitch scan (z) in A2/B2.
- **Engine** (data-driven, backwards compatible): new drum keys `T` (big floor tom 118→50 Hz with a skin thwack), `a` (anvil: four inharmonic free-bar partials 1 / 2.76 / 5.4 / 8.93 plus a metallic transient) and `i` (insect chitter: 3–5 band-passed noise clicks 4.2–6.2 kHz at irregular 12–28 ms spacing). Drum cleanup now accepts a node list.
- **moodFor, new order:** … necron scenes → **v0.3 route scenes** (`ork_scrapyard ork_fort` → orks, `mine_shaft gsc_chapel` → gsc, `forge_floor mars_vista tech_vault` → mechanicus) → tense / sanity < 30 → faction default (**`orks`, `gsc`, `mechanicus`**) → calm. New boss-class foes: `ork_nob gsc_patriarch gsc_primus daemon_engine kastelan_robot dark_mechanicus`. Battle, boss, ending, warp and `node.music` keep priority.
- **Tests:**
  - `audio_check.js`: 16 moods, 17 SFX, 70 `moodFor` cases (31 new). New-mood checks: tempo window (orks 130–150, gsc 60–72, mechanicus 90–104), ≥ 75 % on-beat chord tones, A/B/A2/B2 order, 32 bars, signature drum voices actually played (orks T/k/s, gsc i, mechanicus a/m) and signature stacks (gsc 11 and −6, mechanicus 7). orks 100 %, gsc 96 %, mechanicus 100 % on-beat chord tones. The story-data tally now loads each faction file separately, so a half-written file only warns for itself. 0 errors.
  - `audio_render.py`: live checks that ork_scrapyard/gsc_chapel/forge_floor → new mood plays. New stats columns: share of spectral magnitude below 200 Hz and onsets/s.
    - orks: peak −2.0 dBFS, RMS −15.4, centroid ≈ 1890 Hz, 4.4 onsets/s.
    - gsc: peak −4.2, RMS −14.5, ≈ 790 Hz, 0.2 onsets/s.
    - mechanicus: peak −3.5, RMS −15.9, ≈ 1110 Hz, 2.4 onsets/s.
    - All three have 0 clipped samples, no gaps, exact loop length and loop-restart similarity ≥ 0.99. 0 failed checks.
  - `audio_test.html`: the scene row gains the 10 v0.3 scene/faction buttons.
- Still needs a human listen (`tools/dev/audio_test.html`), especially the gsc tritone shadow and the orks grot kazoo.

## 2026-11-11 · continuity editor (§27 shared sector + echoes)
- **New `data/sector.js`** (already loaded by index.html/validator after easter_tzeentch):
  - codex `place_arcosa` (阿尔科萨星区 / The Arcosa Sector; race imperium, scene void; text 38 zh, more 84 zh). Unlocked at imp_701, cha_501, tau_601, eld_201, nec_106 (each a node every run passes).
  - Every existing route world already had a place entry, so none were duplicated: place_aurex, place_dustfall, place_vessel, place_hesper, place_carcharos, place_aldrin, place_dalnor, place_valda, place_thessa_null.
  - `WH.sector.worlds` is a plain lookup table (name, codex id, routes). New routes can add themselves from their faction file with `WH.sector.worlds.<id> = {...}`; sector.js merges, so load order doesn't matter.
  - `WH.echoGods` maps each god to its {god} name.
  - `WH.echoTemplates`: 14 framings, 10 normal and 4 `claim:true`. Fields: `factions`, which works like rumours (["*"] = any route).
    - Normal: vox, casualty list, tavern, graffiti, sermon, Choir, xenos, T'au statistics, cryptek catalogue, seer.
    - Claim: whisper, graffiti, xenos, Choir.
    - Eligible per route (normal/claim): imperium 5/2, chaos 5/3, tau 7/3, aeldari 7/3, necrons 7/3. Future routes get the 4 generic normal templates and 2 generic claim ones.
  - Templates need only a plain string replace.
    - en: {role} and {cause} always start a fragment, so their capitals read right and there are no articles.
    - Claim templates don't use {cause}.
    - Filled with every current origin role/world and every bad/death cause, the longest is 47 zh / 24 en words, which leaves 3–11 zh spare for longer future world names.
- **World fields.** imperium Aurex Secundus · chaos Carcharos · tau Dal'nor · aeldari Valda · necrons Thessa Null (zh 忒萨零号, as in codex_necrons — SPEC §27 says 塞莎零号).
  - Origin override: the necrons convict → Carcharos.
  - The Imperium farmer's-child origin is **not** Hesper: the text puts the farm on Aurex's ash plains, with the hive recruiting station.
- **Cross-references.** All new lines are results on choices that had none, except the three marked as node-text edits, which stay ≤90 zh.
  - **Imperium**
    - imp_209: Vosk says scattered orks drift toward the Gulf.
    - imp_603: Hesper burned; Valda's grain ships missing a year.
    - imp_710 "hold the cathedral": refugees from Carcharos.
  - **Chaos**
    - cha_105, cha_o_deserter_4, cha_o_scribe_4: the tithe sends a regiment to Dustfall.
    - cha_610: after Aldrin the Warmaster's main host goes to Aurex.
  - **T'au**
    - tau_301 (node text): the ork rock came from the direction of Dustfall; unlocks place_dustfall.
    - tau_601 (node text): the biomass is bearing from Hesper; unlocks place_hesper.
    - tau_o_trader_1: Aurex Manufactorum Six power cells under the counter.
  - **Aeldari**
    - eld_101 "threshing yard": tithe sacks stamped for Aurex, no ship.
    - eld_o_pilgrim_2: a holy medal from Aldrin.
  - **Necrons**
    - nec_o_convict_1 (node text): the governor of Carcharos sold the convicts; unlocks place_carcharos.
    - nec_106 "say nothing": a forge world paid for the dig (unnamed until the Mechanicus route names its world).
    - nec_309 / nec_310: crypteks mention another tomb harvesting Valda.
- **Cause strings that read badly in third person:** nec_end_metal "Lost your soul to the metal" and nec_end_inquisition "Executed for what you knew". Suggested: "Soul lost to the metal" / "Executed for knowing too much". The zh is fine.

## 2026-11-11 · art (v0.3: SPEC §26 Orks · Genestealer Cult · Mechanicus)
- All §26 art delivered: 19 character sprites + 7 omens (26 sprite keys), 7 scenes, 3 icons. Totals are now 102 sprites, 34 scenes and 15 UI icons. `assets/manifest.js` (with `name {zh,en}`) and `tools/art/contact_sheet.png` are regenerated. `build_all.py --check` now covers §7 + §14 + §26 (`SPEC26_*` lists, appended so existing manifest order is unchanged).
- All 116 pre-existing PNGs are **byte-identical** (md5 against a pre-build snapshot). The manifest differs only by the appended entries: stripping the new keys gives the old file's md5 exactly.
- New modules, all registered in `build_all.MODULES`:
  - `chars_orks.py`: player_orks, ork_mek, ork_weirdboy, ork_nob(64), gretchin(32), squig(32). It reuses `chars_xenos.ork_head` and adds a `grin()` helper (open toothy grin with tusks) and `hazard_band()`.
  - `chars_gsc.py`: player_gsc, gsc_neophyte, gsc_acolyte, gsc_magus, gsc_primus(64), gsc_patriarch(96). It adds `ridged_scalp()` / `bald_head()` (a swollen bald cranium with bony ribs) and `KNOT5`, the original cult mark.
  - `chars_mechanicus.py`: player_mechanicus, skitarius, magos(64), electro_priest, kastelan_robot(64), dark_mechanicus(64), daemon_engine(96). It adds a `cog()` helper (plain gear; `broken=` leaves teeth off for the corrupted one).
  - `omens_v3.py`: the 7 omens, reusing `omens.frame`.
  - `scenes_v3.py`: the 7 scenes, reusing `scenes.corridor` for the mine shaft. It also adds `junk_heap`, `plate_wall`, `hazard_stripe` and a `gear()` with edge highlights.
  - `icons_v3.py`: icon_teef, icon_kinship, icon_grace.
- Palettes:
  - Orks: skin greens (`#5f8a34` family), rust, hazard `#d4b02a`/near-black, copper `#b8642e` for the weirdboy, squig `#d8542a`.
  - GSC: ochre work-suits `#b8902e`, cult purple `#5a2a6e`, hybrid skin from lilac-pale `#bfa6aa` (neophyte) to violet `#a587b0` (acolyte, primus) to deep purple `#8a4aa0` (patriarch), blue-violet carapace `#3e2a6a`.
  - Mechanicus: forge red `#8a1e1e`, brass, cable black, lens green `#5aff7a`. Dark Mechanicum is black `#26222a` with dark brass, red and violet lenses. The furnace is `#ff7a1e`.
- Facing:
  - Face **right**: all three players, ork_mek, ork_weirdboy, gretchin, every GSC sprite, skitarius, magos, electro_priest, kastelan_robot.
  - Face **left** (foe slot): ork_nob, squig, dark_mechanicus, daemon_engine.
  - gsc.js uses the patriarch mostly as a speaker ("The Grandsire") and once as `foe`, and the neophyte twice as `foe`. They keep facing right. Flipping a sprite is one decorator argument (`face="L"`).
- Character notes:
  - The neophyte is nearly human (pale, bald, faint ribs). The acolyte has a chitin-plated third arm with three bone talons. The magus is a gold-trimmed hood over a shadowed face with violet eyes, and carries a staff topped by the cult knot. The primus has a big ridged cranium, scars, a brass sight and a bone sword with a violet edge. The patriarch is a swept-back carapace-crowned cranium with slit eyes and a fanged maw. Its talons hook over a rock throne, and darkness swallows its lower body.
  - The electro-priest is deliberately **unhooded** (bald, circuit-tattoos, brass blindfold, blue arcs). That keeps him from being a third red hood next to the skitarius and the existing tech_priest.
- IP:
  - Every design is original. There are no named characters: no Ghazghkull, no Cawl, the boss nob is generic, and Cawl appears only as an empty workshop.
  - There is no GW iconography. Ork banners are a black/white check or a crude slash, not real glyphs. Cogs are plain gears with no skull-cog.
  - The cult mark (`KNOT5`, icon_kinship, the omen_four_armed / gsc_chapel emblem) is our own design: a halo ring, a lozenge and four curved clawed arms, two raised and two lowered. It is bilateral, not a pinwheel, and is not the published wyrm-form.
- Omens have no figures or faces:
  - omen_gork_mork is two green cloud-masses, one broad and one lean with a hooked crest.
  - omen_four_armed is a painted icon panel holding the abstract emblem, with candles.
  - omen_cawl is a workshop with an archeotech ring, manipulator arms and cable shadows, and no people.
- Colour caps:
  - Every new character sprite is ≤12 colours.
  - Icons are 8 colours.
  - Omens are 16–31 colours. They stay exempt from the cap, as in v0.1/v0.2.
- Every scene keeps its lower third calm with `calm_lower`.
- Build time is now about 12 s.

## 2026-11-11 · text-gsc — Genestealer Cult route (v0.3)
- Files: `data/factions/gsc.js` (route, 7 route events incl. 5 taint, 11 rumours, `WH.sector.worlds.kessin`), `data/codex_gsc.js` (17 entries).
- World (§27): **凯辛三号 / Kessin Tertius**, mining world of the Arcosa Sector; Shaft Nine, the Hollin house, the chapel under the grain store, Shaft Thirteen. `faction.world` set; registered in `WH.sector.worlds.kessin` (codex `place_kessin`).
- Timeline: starts **100.M42** (deliberately before the §27 window) because the route needs generations — two skips (12 y, 3 y) put Hesper's burning (112.M42, per place_hesper/sector.js) in ch.4 and the Day of Ascension in **115.M42**, inside the window. The bad ending `gsc_end_seed` is 30 years later (145.M42), so its echo will rarely/never surface — intended.
- Sector cross-refs: ore to Aurex Secundus (ch.1, rumour, `gsc_end_seed` = cult reaches Aurex's underhive); Hesper as the warning nobody heeded (Brann, the data-slate, rumour); rumours of Carcharos refugees and of drills sold to the Thessa Null dig.
- Structure: 8 chapters, 78 story nodes + 8 prologue (origins `miner` default / `warden` enforcer's child / `kin` fourth-gen "plain one"), endings: good 4 (ark, shadow, witness, lastshift) / bad 6 + 4 claims / death 3. Hidden taint on 14 choices, 8 of them `require:{taint:…}` hidden escalations so claims stay rare but reachable.
- Claims (§19): `gsc_end_claim_<god>`, written as the Shadow in the Warp muffling the gods (rage leaking under the Shadow; even the swarm passes a Nurgle-blessed body; a crack in the Shadow for Tzeentch; longing echoing in the empty chapel for Slaanesh). **Lead: `data/events_taint.js` CLAIM_GOTO needs `gsc: "gsc_end_claim_" + g`** — until then the 4 claim endings are unreachable (validator ERROR) and claims resume the pending node.
- Sim (2000 runs, seed 1, validator copy with the CLAIM_GOTO entry injected): avg 47.0 nodes · good 15.8 / bad 59.7 / death 24.4 % · claims 4.0 % (band 3–8 ✓) · rumours 6.9/run · origins death miner 27.3 / warden 22.3 / kin 23.7 (all within ±6).
- Codex `faction` field uses existing values (xenos / imperium) so the old field stays valid; race/type per §13. Reused shared ids: xenos_tyranid, xenos_hive_mind, xenos_hive_tyrant, xenos_genestealer, xenos_shadow_in_warp, imp_imperium, imp_inquisition, imp_arbites, imp_ecclesiarchy, place_hesper, place_aurex, place_carcharos, place_thessa_null, place_arcosa.

## 2026-11-11 · text-mechanicus (v0.3 Adeptus Mechanicus route, SPEC §26/§27)
- **Files (mine):** `data/factions/mechanicus.js` (route + 5 taint events + 2 route events + 10 rumours + sector world), `data/codex_mechanicus.js` (25 entries incl. 4 places and `chr_schism_of_mars`).
- **World (§27):** 格拉维克斯 / Gravex, the Arcosa Sector's only forge world (`world`, `place_gravex`, `WH.sector.worlds.gravex`). Cross-refs: Gravex paid for the Thessa Null dig, Vektrix-9 "has still not returned" (mech_309, rumour); lasguns to Aurex Secundus (mech_209, rumour); Valda's grain ships stopped (mech_103, rumour). Orks "drifted in from the sector's edge" (no named world, to avoid contradicting the Ork route).
- **Shape:** 8 chapters, 81 spine nodes + 8 prologue (savant 4, conscript 4). Endings: good 3 (magos / explorator / keeper), bad 5 (servitor, pure thought, heretek, purged, looted) + 4 claim (`mech_end_claim_<god>`), death 3. eventRoll on 7 nodes.
- **Lore choices:** the Dark Mechanicum boss is an original heretek "warsmith" (Syrredin), daemon engine via `daemon_engine`; Cawl only as a data-packet (`omen_cawl`) and rumour; Omnissiah as a vision (`omen_omnissiah`), Mars as a broadcast (`omen_mars`). Schism of Mars dated only "early M31 / early Heresy" (Lexicanum gives no firm year), sortKey 31005.5.
- **Claims:** taintMod per §26; Tzeentch dominates by design (forbidden knowledge); Khorne/Nurgle/Slaanesh claims are rare (~0.1–0.4%). Safety net at the end of mechanicus.js fills a missing `mechanicus` key in the claim events' goto maps (never overrides) — lead may add mechanicus to `CLAIM_GOTO` in events_taint.js and drop it.
- **Sim (2000 runs, seeds 1/5/9):** avg nodes 45.3–46.1, deaths 27.1–28.6% (hp ~15.6, sanity ~8–10), good ~22%, claim endings 11.3–12.3% (band 8–14 ✓); origins menial/savant/conscript within ±3.5 of route avg. Rumours ~6.9/run, all 10 heard. Known: `mech_death_corruption` not hit by random play (corruption sources are few: heresy choices + claim resists).
- References `ork_belief_tech` (codex_orks.js) at mech_504 — if the Ork writer renames it, update that node.

## 2026-11-12 · text-orks (Ork route)
- Files: `data/factions/orks.js` (97 nodes = 85 spine + 12 prologue; 8 chapters; endings 3 good / 7 bad incl. 4 claim / 3 death; 7 eventRoll nodes; 19 rolls all with `rollResult`; 169/169 effect choices with `result`), `data/codex_orks.js` (24 entries).
- World (SPEC §27): **Iskaron 伊斯卡隆**, ship-breaking world of the Arcosa Sector (`place_iskaron`; `place_arcosa` unlocked in ork_101). Cross-refs: wreck of the Valda tithe ship (never reached Aurex; `place_valda_wreck`), the Great Waaagh!'s next stop is Aurex Secundus (ork_806, ork_end_evacuated, rumour), Carcharos refugee rumour.
- Cast: Wazgob da Mek, Snaggit (grot), Zograk (weirdboy), Warboss Grukka (boss), Nob Skarbad, Dok Buzzgob, Kaptin Redgob (Freebooterz), Commissar Hale, Sgt Voss, Old Edna. Ghazghkull / Gork & Mork only via `omen_waaagh` / `omen_gork_mork` / rumours. Chinese voice: 兽人腔 (俺, 人仔, 小子们, 揍扁, 突突, 红的跑得快); English: classic orky spelling.
- Origins: scrap 105/95 ren 10 · guard 115/95 ren 0 (ork_o_guard_1–4) · ganger 95/95 ren 20 (ork_o_ganger_1–4); all budget +0, prologues merge at ork_106.
- Taint: taintMod khorne 1 / others 0.6; 5 route taint events (tzeentch, khorne, slaanesh, nurgle, cleanse) + 2 route events (squig race, grot heist); ~20 hidden-taint choices (mostly Khorne). Claim rate 6.4% (Khorne ≈ 6.1%, Tzeentch 0.3%; Nurgle/Slaanesh claim endings exist but are rare by design — ork-land is a Khorne feast, the others seldom bother).
- Rumours: 12 `rum_ork_*` registered in the faction file (Prophet/Armageddon/Beast/Ullanor/Octarius/Rift/Valda/Carcharos/Aurex…), 6.7 heard per run.
- Sim (3000 runs): avg 47.7 nodes, deaths 33.8%; origins scrap 31.0 / guard 35.3 / ganger 35.2%.
- Balance notes: first draft killed 60%+ (chapters 5–6); fixed with healing time-skips (+hp on ork_301/401/601/701), a market→Dok funnel (ork_303), ork_608/711/811 beats, and halved Khorne deltas. Causes kept ≤9 zh so the echo templates stay ≤50 zh.
- Corruption death node exists but is practically unreachable in random play (as on Necrons); `ork_end_claim_nurgle/slaanesh` likewise <0.1%.

## 2026-11-12 · web (v0.3.0: SPEC §20b relevance rumours · §25 achievements · §26 8-route picker · §27 echoes)
- **§20b rumours**: `when:{scenes,sprites,codex,flags,keywords}` scored per node (`nodeContext`, `rumorScore`); p 0.6 for score >= 2, else 0.35; `RUMOR_GAP` 3 nodes, `RUMOR_PER_CHAPTER` 2; own RNG stream (`rumorRng`, seed ^ 0x2545F491) so turning rumours off never changes a run. Validator reports coverage (rumours/run 4–8, share with score >= 2, never-heard).
- **§25 achievements**: `WH.Achievements` (DOM-free, shared with `validate.js`): 19 condition types, `evaluate(cond, ctx) -> {ok, n, t}`, `applyRun` updates `achStats` (origins, flags, fastest nodes, taint sums). Storage `whatiswh.achievements` ({id: date}) + `whatiswh.achStats`; both in `Save.exportAll/importAll` (merge: union / max / min, never lowers) and in the `bootCheck` known-keys list, so version updates never touch them (§22). UI: title `★ 成就 n/t`, grid with tier colours, `???` for hidden, progress bars, toast on run end / codex unlock; boot re-check is silent.
- **§26**: index.html loads codex_{orks,gsc,mechanicus} and factions/{orks,gsc,mechanicus} (all `onerror`); picker uses a `.grid` layout from 6 races up (4 x 2 on desktop, stacked on mobile); FACTION_ORDER / colours / icons for the new routes (glyph fallbacks if an icon is missing); validator PREFIX, taint guide, claim-rate bands (orks 5–10, gsc 3–8, mechanicus 8–14).
- **§27 echoes**: `echoPool` = earlier bad/death run records with `run.echo = {faction, role, world, cause, kind, dateKey, claimedBy}`; <= 1 per run, p 0.15, from chapter 2, >= 3 nodes after a rumour, never dated after the current `Rules.dateKey`; templates `WH.echoTemplates` / `WH.echoGods` from data/sector.js. Footer `✝ 前世死讯` shares the rumour footer, click opens 往生录 at that run (`openCodex(null,false,"records",{run})`). Setting 设置 -> 前世死讯. Own RNG stream (`echoRng`, seed ^ 0x6A09E667).
- **Version** bumped to 0.3.0 (`WH.VERSION`); CHANGELOG 0.3.0 entry added (audio writer's bullets kept under "Audio").
- **Tests**: smoke `--real` now starts every origin of all 8 routes from the picker, plays aeldari/necrons/orks/gsc/mechanicus to an ending, opens the achievements page and toggles zh/en (`run_real_v03`).
- **Not done / open**: `data/difficulty.js` still lacks orks/gsc/mechanicus (lead runs `--write-difficulty`); `release/README.public.md` lacks the §22 note; writer-owned warnings remain (see validator output).

## 2026-11-12 — 0.3.1 wording + date audit (lead)
- UI: "种族" → "势力" per Howie (`choose_race`, `back_race`, `sort_race` in i18n.js; English "faction"). Data key `race` / `RACES` stay (taxonomy key, not player-facing). README/SPEC §16/TODO updated.
- Howie asked that dates written in the text also feed the survival timeline and picked "make the clock match the text dates". Audit (`tools/dev/date_audit.js`): the only node with an explicit Imperial date in its text is `nec_701` ("lost 113.M42", a past reference — the clock there is centuries later, correctly). Relative phrases ("一年后", "三天后", "十二年过去了") also match `node.time` everywhere; the 4 that don't (`eld_108`, `imp_506`, `chaos/cha_end_purged`, `tau_end_gate`) are forecasts, not elapsed time. Nothing to fix in data; the tool stays as a guard. Asked Howie for a concrete spot if he saw a mismatch.
