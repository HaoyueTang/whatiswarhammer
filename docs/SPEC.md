# 什么是战锤 / What is Warhammer? — Design Spec v0.1

Single source of truth for all contributors (text / art / web). If you need to change a contract here, note it in `docs/DEVLOG.md` and tell the lead.

## 1. Pitch
Browser text-adventure, pixel art, bilingual (中文 / English, switchable any time).
Player picks a faction at the start and lives as an **ordinary human** who is slowly pulled into the Warhammer 40,000 universe.
One faction route ≈ **45–60 min**. By the end the player has met (in story or codex) that faction's **leaders**, **main enemies**, and **final boss**.

Tone rules:
- **Show, don't lecture.** Lore comes from what NPCs do and say (a commissar's pistol, a preacher's fervor, a servitor that used to be a person). No encyclopedia paragraphs in the story.
- Short beats. Grimdark but not gory; violence implied, never graphic. No sexual content (Slaanesh = excess, vanity, perfection, obsession).
- Time does not flow evenly: hours, days, sometimes years pass between nodes; warp travel distorts time.
- Chaos gods intrude through random events.
- Status bar, death conditions, bad endings.

## 2. File layout (game-project standard)
```
index.html                 entry; plain <script> tags, runs from file:// (no fetch, no build)
README.md  CHANGELOG.md  CLAUDE.md
docs/SPEC.md  docs/DEVLOG.md
src/js/registry.js         shared registry (lead) — load first
src/js/i18n.js             UI strings (web)
src/js/save.js             save system (web)
src/js/engine.js           state machine, rules (web)
src/js/ui.js               rendering, screens, effects (web)
src/js/main.js             boot (web)
src/css/style.css          (web)
data/codex.js              codex entries (text)
data/events.js             random chaos-god events (text)
data/factions/imperium.js  chaos.js  tau.js   (text)
assets/manifest.js         sprite/scene/ui registry (art)
assets/sprites/*.png  assets/scenes/*.png  assets/ui/*.png   (art)
tools/art/                 python source that generates every PNG (art)
tools/dev/validate.js      data + link checker and Monte-Carlo playthrough simulator (web)
```
Load order in index.html: registry → assets/manifest → data/codex → data/events → data/factions/* → i18n → save → engine → ui → main.

**File ownership** — only edit your own files: text = `data/**`; art = `assets/**`, `tools/art/**`; web = `index.html`, `src/**` (except registry.js), `tools/dev/**`. Everyone may append to `docs/DEVLOG.md`.

## 3. Faction object
```js
WH.registerFaction({
  id: "imperium",                       // "imperium" | "chaos" | "tau"
  name:    {zh:"人类帝国", en:"Imperium of Man"},
  tagline: {zh:"…", en:"…"},            // ≤ 20 zh chars / 12 en words, shown on select card
  role:    {zh:"巢都工人", en:"Hive worker"},
  playerSprite: "player_imperium",
  color: "#c9a227",                     // UI accent
  startNode: "imp_001",
  startDate: {year: 111, mill: 42},     // shown as 111.M42
  startStats: {hp:100, sanity:100, corruption:0, renown:10},
  renownLabel: {zh:"信仰", en:"Faith"}, // faction stat: imperium 信仰/Faith, chaos 神恩/Favor, tau 大义/Greater Good
  renownIcon: "icon_faith",             // icon_faith | icon_favor | icon_greatergood
  deathNodes: {hp:"imp_death_hp", sanity:"imp_death_sanity", corruption:"imp_death_corruption"},
  learn: { leaders:[codexIds], enemies:[codexIds], boss:[codexIds] },   // end-screen checklist
  chapters: { 1:{zh:"…",en:"…"}, 2:…, … },   // chapter titles, 6–8 chapters
  nodes: { "imp_001": Node, … }
});
```

### Node
```js
"imp_014": {
  chapter: 3,
  scene: "trench",                                  // key from §7 scenes (required)
  speaker: {sprite:"commissar", name:{zh:"卡斯政委", en:"Commissar Kast"}},  // or null = narration
  foe: "ork",                                       // optional sprite key shown on right side (enemy/monster)
  time: {h:6} | {d:3} | {y:2} | {d:40, warp:true},  // applied when ENTERING node. warp:true = distorted clock + glitch FX
  text: {zh:"…", en:"…"},                           // ≤ 90 zh chars / ≤ 65 en words. Line breaks with \n
  effects: {hp:-10, sanity:-5, corruption:+3, renown:+2, set:{sawExecution:true}},   // applied on enter
  codex: ["ork_waaagh"],                            // unlocked on enter
  eventRoll: 0.35,                                  // optional: chance a random event (§5) fires BEFORE this node
  choices: [ Choice, … ],                           // 1–4; omit only on ending nodes
  ending: {kind:"good"|"bad"|"death", title:{zh,en}, cause:{zh,en}}  // marks an ending node (no choices); cause = short fate / cause-of-death label (≤12 zh), required on bad+death
}
```

### Choice
```js
{ text:{zh:"…",en:"…"},                // ≤ 24 zh chars / 14 en words
  next:"imp_015",                      // target node id
  effects:{sanity:-5, set:{x:true}},   // optional, applied on click (before next node's effects)
  require:{flag:"x"} | {notFlag:"x"} | {stat:"renown", min:20} | {stat:"corruption", max:30},
  hideIfLocked:false,                  // locked choices are shown greyed with 🔒 unless true
  roll:{p:0.5, stat:"hp", success:"imp_016a", fail:"imp_016b"}   // optional instead of next
}
```
Roll rule: `pEff = clamp(p + (stats[stat] - 50)/200, 0.05, 0.95)`; no stat → `p`. Show the player a hint like “(险 / risky)”.

Stats: all 0–100, clamped. After every effect application the engine checks, in order:
`hp <= 0` → `deathNodes.hp`; `sanity <= 0` → `deathNodes.sanity`; `corruption >= 100` → `deathNodes.corruption`.
(Chaos route too: 100 corruption = you become chaos spawn, a bad end.)
Low sanity (<30) and high corruption (>60) trigger visual effects (web).

Node id prefixes: `imp_`, `cha_`, `tau_`. Every id referenced must exist. Each faction: 6–8 chapters, **70–95 nodes** incl. branches, **≥2 good, ≥3 bad (choice-driven) + 3 death nodes**. A typical run visits 45–60 nodes. Branches should rejoin; avoid dead ends without endings.

## 4. Routes (text writer may refine; keep leaders / enemies / boss)
| | Imperium 人类帝国 | Chaos 混沌 | T'au 钛帝国 |
|---|---|---|---|
| You | hive worker 巢都工人, tithed into the Astra Militarum | underhive scavenger 下巢拾荒者, drawn into a cult | human colonist 人类殖民者 on a world that joined the T'au (Gue'vesa) |
| Leaders | 帝皇 Emperor, 基里曼 Guilliman (Indomitus Crusade), 审判庭 Inquisition / 政委 | 混沌四神, 阿巴顿 Abaddon (Warmaster, Black Legion) | 以太族 Ethereals / 大义, 影日 Shadowsun, 远见 Farsight (schism) |
| Main enemies | 兽人 Orks, 混沌 Chaos, 泰伦虫族 Tyranids | 审判庭 Inquisition, 星界军 Astra Militarum, 星际战士 Space Marines | 人类帝国 Imperium (crusade), 兽人 Orks, 泰伦虫族 Tyranids |
| Final boss | 阿巴顿 Abaddon's Black Crusade strikes the world | 灰骑士 Grey Knights + Inquisitor ordering purge; behind them 帝皇 | 虫群主宰 Swarmlord leading a hive fleet tendril |

Use established community Chinese terms (星际战士, 星界军, 政委, 审判庭, 机械神教, 帝皇, 恐虐, 纳垢, 奸奇, 色孽, 兽人, 泰伦虫族, 以太族, 克鲁特 …). Named canon characters may appear in dialogue, rumor, sighting or vision, but the player's direct NPCs are original characters. All prose original — never quote books or codexes.

## 5. Random events (data/events.js)
```js
WH.registerEvents([{
  id:"evt_khorne_1", god:"khorne",            // khorne | nurgle | tzeentch | slaanesh | undivided | other
  factions:["*"],                             // or ["imperium","tau"]
  minChapter:2,
  scene:"warp", speaker:{sprite:"daemon_khorne", name:{zh:"…",en:"…"}}, foe:null,
  text:{zh,en},
  codex:["god_khorne"],
  choices:[{text:{zh,en}, effects:{…}, result:{zh,en}}]   // 2–3 choices; result shown, then "continue" resumes the pending node
}])
```
Event fires once per run. ~12 events total (≥2 per god, 2 undivided/other). Engine picks a random unseen eligible event when a node's `eventRoll` hits.

## 6. Codex (data/codex.js)
```js
WH.registerCodex({
  "imperium_emperor": {cat:"leader", faction:"imperium", sprite:"omen_emperor",
     name:{zh:"帝皇", en:"The Emperor"}, text:{zh:"≤ 45 字", en:"≤ 30 words"}},
})
```
Optional: `more:{zh,en}` (≤ 90 zh chars, shown on lore cards / ending screen; required for god_khorne, god_nurgle, god_tzeentch, god_slaanesh and every `learn` id) and `aliases:{zh:[…],en:[…]}` (other names used in story text, for in-dialogue links).
cat: `leader | enemy | boss | god | lore | place`. Place entries also carry `scene:"<scene key>"` (thumbnail/banner) and are shown in the codex 地点 tab. faction: `imperium | chaos | tau | xenos | any`. Short, punchy, one fact + one flavor.

## 7. Art (assets/manifest.js) — fixed key list
Original pixel art only. **No likenesses of named canon characters**, no GW logos/icons/wordmarks (aquila, chapter badges, the official chaos star, T'au sept symbols). Generic archetypes in our own design. Named figures are represented by `omen_*` images (scenes, light, silhouettes of fleets/sky — never a portrait of the character).

```js
WH.registerSprites({ commissar:{src:"assets/sprites/commissar.png", w:48, h:48, name:{zh:"政委",en:"Commissar"}}, … })
WH.registerScenes ({ trench:{src:"assets/scenes/trench.png", w:192, h:108, name:{zh,en}}, … })
WH.registerUI     ({ icon_hp:{src:"assets/ui/icon_hp.png", w:16, h:16}, … })
```
PNG at native pixel size; engine scales with `image-rendering: pixelated`. Transparent background for sprites.

**Sprites (48×48 unless noted)**
- players: `player_imperium`, `player_chaos`, `player_tau`
- imperium: `hive_foreman`, `preacher`, `guardsman`, `guard_sergeant`, `commissar`, `medicae`, `tech_priest`, `servitor`, `inquisitor`, `psyker`, `enforcer`, `astartes`(64)
- chaos: `cultist`, `cult_magus`, `mutant`, `heretic_astartes`(64), `chaos_sorcerer`(64), `daemon_khorne`, `daemon_nurgle`, `daemon_tzeentch`, `daemon_slaanesh`, `daemon_prince`(96), `grey_knight`(64)
- t'au: `tau_warrior`, `tau_ethereal`, `tau_battlesuit`(64), `tau_drone`(32), `kroot`, `gue_vesa`, `tau_water_caste`
- xenos: `ork`, `ork_boss`(64), `gaunt`, `genestealer`, `tyranid_warrior`(64), `hive_tyrant`(96)
- omens (96×96, no faces): `omen_emperor`, `omen_primarch`, `omen_black_crusade`, `omen_hivemind`, `omen_purge`, `omen_tau_fleet`, `omen_farsight`
- sigils (32×32, original shapes): `sigil_khorne`, `sigil_nurgle`, `sigil_tzeentch`, `sigil_slaanesh`, `sigil_undivided`

**Scenes (192×108)**: `title`, `hive_hab`, `hive_spire`, `underhive`, `manufactorum`, `cathedral`, `barracks`, `trench`, `ship_interior`, `warp`, `void`, `ruins`, `jungle`, `cult_shrine`, `daemon_world`, `tau_city`, `tau_outpost`, `spore_sky`, `burning_city`, `throne_light`

**UI (16×16)**: `icon_hp`, `icon_sanity`, `icon_corruption`, `icon_faith`, `icon_favor`, `icon_greatergood`, `icon_clock`, `icon_codex`, `icon_save`, `icon_lang`

## 8. Engine & UI (web)
Screens: title (lang toggle, New / Continue / Load / Settings) → faction select (3 cards) → game → ending.
Game screen: status bar (HP, 理智 Sanity, 腐化 Corruption, faction stat, date `111.M42 · 第37日 06:00`, chapter, play time), scene layer (scene PNG scaled to fit, pixelated), speaker left / foe right, dialogue box with typewriter (click = finish), choices (keys 1–4), buttons: 图鉴 Codex, 存档 Save, 设置 Settings, 中/EN.
FX: floating stat deltas, time-skip ticker, warp glitch for `warp:true` and chaos events, low-sanity distortion, high-corruption red vignette, screen shake on damage. `prefers-reduced-motion` + setting to disable.
Ending screen: ending title + kind badge, final date, play time, “你认识了 / You met” checklist from `learn` (leaders / enemies / boss, ✓ unlocked, ??? if not), codex completion %, buttons restart / choose another faction.
Clock: internal `hours`; year = startDate.year + floor(hours/8760) with millennium rollover. Warp: real added time = given × random(0.4–3.0), display flickers “???.M4?” for a moment.
Language switch re-renders current node instantly, persists in settings.

## 9. Save system (web, src/js/save.js)
- localStorage (wrapped in try/catch; falls back to in-memory with a notice). Key prefix `whatiswh.`.
- 3 manual slots + 1 autosave (on every chapter change and every 5 nodes) + settings record.
- Save record: `{schema:1, gameVersion, savedAt, faction, nodeId, chapter, stats, flags, codex:[], seenEvents:[], hours, pendingEvent:null|id, pendingNext, history:[last 30 node ids], playMs, lang}`.
- Slot UI shows faction, chapter title, date, play time, saved-at.
- Export current save → `.json` download; import from `.json` file. Validate schema; reject unknown faction/node gracefully.
- Codex progress across runs stored separately (`whatiswh.codexGlobal`) so the title screen can show total completion.

## 10. Quality gates
`node tools/dev/validate.js` must pass: all referenced node ids / sprites / scenes / codex ids / icons exist; every faction has its death nodes, ≥2 good and ≥3 bad endings; no unreachable nodes; no node without choices unless it's an ending; all strings have zh+en; text length limits (warn). Monte-Carlo 3000 random runs per faction: report avg nodes visited, ending distribution, % deaths, no infinite loops.

---

# v0.2 additions (2026-11-11)

## 11. Choice consequences (过场后果)
Every choice that changes stats, flags or direction should show a short consequence beat after the click, before the next node.
```js
{ text:{…}, next:"imp_015", effects:{hp:-10},
  result:{zh:"你扑进弹坑，碎石擦过脸颊。", en:"You dive into the crater; gravel tears your cheek."} }   // ≤ 50 zh / ≤ 35 en words
// roll choices: per outcome
{ text:{…}, roll:{p:.5, stat:"hp", success:"x", fail:"y"},
  rollResult:{success:{zh,en}, fail:{zh,en}} }
```
UI: after click → consequence panel (typewriter, stat deltas animate, time-skip ticker if the next node has `time`) → 继续 (Enter/Space/click) → next node. Choices without `result` but with effects get an automatic one-line summary (e.g. "生命 −10 · 理智 −5") instead of a silent jump. Setting: 过场提示 on/off (default on).
Writers: give `result` to every choice that has `effects`, `set`, or where the outcome is not obvious from the next node's first line. Show the consequence in action/sensation, not as a stat report.

## 12. New routes
| | Aeldari 灵族 | Necrons 死灵 |
|---|---|---|
| id / prefix | `aeldari` / `eld_` | `necrons` / `nec_` |
| You | human survivor of an agri-world the farseers chose to sacrifice; spared as a "thread of fate", taken through the webway to a craftworld as a mon-keigh guest | human archaeologist on an Imperial dig on a "dead world" that is really a tomb world; becomes a living specimen |
| renownLabel / icon | 命运 Fate / `icon_fate` | 价值 Worth / `icon_worth` |
| color | `#5fb3a1` (wraithbone teal) | `#4fd16b` (necron green) |
| Leaders | 先知 Farseers (艾德拉德 Eldrad as distant presence), 伊芙蕾恩与恩灵 Yvraine & the Ynnari, Path system, fallen gods (凯恩 Khaine) | 寂静之王 the Silent King, 风暴领主 Imotekh, 无尽者特拉赞 Trazyn (collector), Necrontyr history & biotransference |
| Main enemies | 色孽 Slaanesh (She Who Thirsts), 死灵 Necrons, 人类帝国 (mon-keigh); lore: Drukhari, Harlequins | 太空死神 C'tan (天堂之战 War in Heaven), 灵族 Aeldari, 泰伦虫族 Tyranids, 人类帝国 |
| Final boss | a Greater Daemon of Slaanesh (色孽大魔) hunting Aeldari souls | an awakened C'tan shard (夜幕使者碎片 Nightbringer shard) breaking its tesseract prison |

Each new route: 8 chapters, 75–90 nodes, ≥2 good, ≥3 bad, 3 death nodes, `ending.cause` on all endings, `result` on choices (§11), eventRoll on 6–8 nodes (shared chaos events apply), may add 1–2 route-specific events via `WH.registerEvents` in its own faction file. Named canon figures appear only via omen_* sprites.

## 13. Codex taxonomy v2
Every codex entry gets two new required fields (old `cat` kept for compatibility; UI uses these):
- `race`: who it belongs to — `imperium | chaos | tau | aeldari | necrons | orks | tyranids | other`
- `type`: what it is — `figure` 人物 (named people/characters) · `deity` 神祇 (Chaos gods, C'tan, Aeldari gods, Gork & Mork, the Emperor as worshipped) · `organization` 组织 (Inquisition, Black Legion, castes, craftworlds, dynasties) · `unit` 兵种/生物 (troop types, creatures, war machines) · `place` 地点 · `concept` 设定 (warp, tech, events, history, ideas)
Route-relative roles (leader / main enemy / final boss) stay in each faction's `learn` lists.
Codex UI: race filter chips (with counts, progress per race) × type tabs, plus 地点 / 结局 / 生涯 views, search box, "NEW" badge on entries unlocked since last opened, sort (discovered / A–Z / race). Lore-card badge shows `type · race`.
Codex files: `data/codex.js` (shared + v0.1 routes), `data/codex_aeldari.js`, `data/codex_necrons.js` (new routes). Load order: codex.js → codex_aeldari.js → codex_necrons.js → events.js → factions/*.

## 14. New asset keys (art) — fixed list
Sprites (48 unless noted): `player_aeldari` (human survivor in a borrowed alien shawl), `player_necrons` (human archaeologist, goggles, lamp) ·
`aeldari_guardian`, `aeldari_seer`, `aeldari_ranger`, `aeldari_bonesinger`, `aeldari_masked` (masked troupe performer, original design), `drukhari_raider`, `wraith_construct`(64), `greater_daemon_slaanesh`(96) ·
`necron_warrior`, `necron_lord`(64), `cryptek`, `flayed_one`, `canoptek_scarab`(32), `canoptek_spyder`(64), `dig_leader` (human expedition leader), `explorator` (Mechanicus explorer, distinct from tech_priest)
Omens (96): `omen_farseer` (rune stones orbiting light), `omen_ynnead` (pale soul-light rising from the dead), `omen_khaine` (burning heart in an iron chamber), `omen_silent_king` (vast cold throne in darkness, no figure), `omen_ctan` (star-shard of dark gold in a lattice prison), `omen_stormlord` (green lightning over a city), `omen_collector` (gallery of stasis-frozen scenes)
Scenes (192×108): `craftworld`, `webway`, `maiden_world`, `dig_site`, `tomb_exterior`, `tomb_interior`, `stasis_gallery`
UI (16): `icon_fate`, `icon_worth`

## 15. Audio
New moods: `aeldari` (ethereal, harp-like arps, slow, modal) and `necron` (cold, mechanical, low drones, sparse metallic percussion). moodFor: aeldari route scenes craftworld/webway/maiden_world → `aeldari`; tomb_exterior/tomb_interior/stasis_gallery/dig_site → `necron` (battle/boss/ending rules still take priority).

## 16. Race → Origin selection (先选种族，再选出身)
New game flow: **选择种族/势力** (race cards: imperium, chaos, tau, aeldari, necrons; later orks, tyranids) → **选择出身** (origin cards for that race) → prologue.
Each faction gets an optional `origins` array (if absent, the engine builds one default origin from the faction's own role/playerSprite/startNode/startStats):
```js
origins: [
  { id:"hive", name:{zh:"巢都工人",en:"Hive worker"}, desc:{zh:"≤40字",en:"≤25 words"},
    sprite:"player_imperium", startNode:"imp_001",                 // the existing opening = default origin
    stats:{hp:100, sanity:100, corruption:0, renown:10},            // full start stats for this origin
    set:{origin_hive:true} },
  { id:"agri", name:{…}, desc:{…}, sprite:"player_imperium", startNode:"imp_o_agri_1",
    stats:{hp:110, sanity:100, corruption:0, renown:5}, set:{origin_agri:true} },
]
```
- 3 origins per race (the existing opening stays as origin #1). Each new origin has a short **prologue of 3–6 nodes** (ids `<prefix>o_<origin>_N`, chapter 1) that merges into the route's existing spine at a sensible node (end of chapter 1 / start of chapter 2), so the rest of the route is shared.
- Origins differ in start stats (balanced: total within ±15 of the default) and set an `origin_<id>` flag; add 1–3 origin-specific choices/beats later in the route via `require:{flag:"origin_<id>"}` (+ `hideIfLocked`) where it's natural — not required everywhere.
- Prologue nodes follow all rules (result beats, scenes/sprites from the key lists, ≤90 zh).
- Records/saves store `origin`; the ending screen and 生涯 show race · origin.

## 17. Faction stat help after first death (第四属性说明)
Each faction gets `renownHelp:{zh,en}` (≤80 zh / ≤55 en words): what the faction stat (信仰 / 神恩 / 大义 / 命运 / 价值) means in-world, how it rises/falls, and what it unlocks (choices with `require:{stat:"renown"}`, better endings). The first time the player dies on a given faction (global, persisted per faction), the death/ending screen shows a "提示 / Tip" card with the stat icon, label and renownHelp. Also viewable afterwards via a ⓘ next to the stat in the status bar.

## 18. Hidden Chaos-god taint (邪神污染，隐藏)
- Engine state `taint:{khorne,nurgle,tzeentch,slaanesh}`, 0–100 each, starts 0, **never shown during play** (no bars, no numbers, no floaters).
- Effects anywhere (node, choice, event): `taint:{khorne:+10}`; cleanse with `taint:{nurgle:-15}` or `taint:{all:-10}`.
- Requirements: `require:{taint:"tzeentch", min:40}` (also `max`). Hidden choices using taint should use `hideIfLocked:true`.
- Event weighting: when picking a random event, an event of god G has weight `1 + taint[G]/25`; cleansing events (`cleanse:true`) have weight `1 + (sum of taint)/100`.
- Subtle tells only: at taint ≥ 50 for a god, rare one-line whispers / vignette tint in that god's colour (khorne #b3261e, nurgle #7a9a3a, tzeentch #3b6fd1, slaanesh #b45cc8); never a number.
- Claim: when any god reaches 100, the engine immediately fires that god's **claim event** (`trigger:"claim"`, `god`, from the event pool, fires once) — typically corruption +25, a flag `claimed_<god>`, sanity loss — then continues.
- Reveal: the ending screen's "你遇到的邪神" section shows the final taint per god as bars with a verdict line (e.g. "恐虐在注视你" ≥30, "你已被打上恐虐的烙印" ≥70). Run records store taint.
- Content: every route has **3–5 route-flavoured taint events** (at least 2 polluting different gods, at least 1 cleansing — e.g. Imperium confession / Ecclesiarch blessing, T'au Ethereal's calm, Aeldari spirit-stone ward, Necron null-field / soulless calm, Chaos route: a rival god's purge or a moment of human kindness), in `data/events_taint.js` with `factions:[route]`, plus **4 claim events** (one per god, `factions:["*"]`) and 2–4 shared taint events. Existing shared chaos events in data/events.js may gain `taint` deltas on their choices.
Load order: … data/events.js → data/events_taint.js → data/factions/*.
