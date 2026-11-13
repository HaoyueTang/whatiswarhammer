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

Node id prefixes: `imp_`, `cha_`, `tau_`. Every id referenced must exist. Each faction: 6–8 chapters, **70–95 nodes** (superseded by §32: 80–145) incl. branches, **≥2 good, ≥3 bad (choice-driven) + 3 death nodes**. A typical run visits 45–60 nodes. Branches should rejoin; avoid dead ends without endings.

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

## 16. Faction → Origin selection (先选势力，再选出身)
New game flow: **选择势力** (faction cards; the UI no longer says 种族 / "race" — the data field `race` stays as the codex taxonomy key: imperium, chaos, tau, aeldari, necrons; later orks, tyranids) → **选择出身** (origin cards for that race) → prologue.
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

## 19. Claims become endings (v0.2.1) — user decision: raise taint, gods separate, lore-based
- Each god's taint is computed and resolved independently (already true). Gains are scaled per route by `faction.taintMod:{khorne,nurgle,tzeentch,slaanesh}` (multiplier on POSITIVE deltas only; cleanses unscaled). Lore guide:
  | route | taintMod | why | target claim rate (random play, any god) |
  |---|---|---|---|
  | imperium | all 0.9 | faith and the Ecclesiarchy give some protection; humans are still exposed | 12–18% |
  | chaos | all 1.3 | living inside a cult, offerings everywhere | 20–30% |
  | tau | all 0.7 | T'au space is warp-quiet; its humans are not | 6–12% |
  | aeldari | slaanesh 1.3, others 0.9 | proximity to Aeldari souls, webway, She Who Thirsts hunting | 12–18% (Slaanesh most common) |
  | necrons | all 0.5 | tomb pylons and soulless hosts suppress the warp | 3–8% |
- Base deltas go up so the targets are met: polluting event choices ~+25–30, node/choice deltas ~1.5–2× current; cleanses keep their size.
- Claim event choices may carry `goto:"node"` or `goto:{imperium:"imp_end_claim_khorne", …}` — the engine jumps there instead of resuming the pending node (ending nodes allowed).
- Flow: god hits 100 → claim event (accept / resist). Accept → `goto` that route's claim ending. Resist → heavy cost, that god's taint −40, flag `resisted_<god>`. If the same god reaches 100 again, the claim event fires a second time and only the accept/forced choice is available (`require:{flag:"resisted_<god>"}` choices); claim events may fire at most twice per run.
- Endings: one per route × god = 20 nodes `<prefix>end_claim_<god>` (e.g. `imp_end_claim_khorne`), `ending.kind` "bad" — except on the Chaos route, where a claim by the god you devoted yourself to (flags from the god-path choices) may branch to a dark "good" variant via a short pre-ending node. Every claim ending has `ending.cause`, a scene fitting the god, sigil/daemon speaker, ≤90 zh text, and says something true about how that god treats its own in-lore (Khorne: endless war, skulls for the throne; Nurgle: loving rot, the garden; Tzeentch: plans within plans, change, betrayal; Slaanesh: excess that empties you). If a combination is lore-implausible as a full claim (e.g. deep in a Necron tomb), write the ending as the god taking you the moment you leave the null field, or as a lesser fate — explain choices in DEVLOG.
- Ending screen keeps the taint reveal; claim endings also unlock the god's codex entry `more`.

## 20. Lore clues for veterans (战史线索, v0.2.2)
Goal: newcomers aren't burdened, but people who know the setting spot named wars and events and smile.
- **Chronicle codex entries** — `data/chronicle.js`: `WH.registerCodex({...})` entries with `type:"concept"`, `tags:["chronicle"]`, `date:{zh,en}` (Imperial dating, e.g. "999.M41"), `sortKey` (number, e.g. 41999; M31 events ≈ 31xxx), `race`, `faction:"any"`, name/text (≤45 zh)/more (≤90 zh)/aliases. Facts must be canon-accurate (verify dates and outcomes against reliable sources such as Lexicanum / Warhammer Community; when canon is vague, say "约/c." or omit the date). Original prose only. Ids `chr_<slug>`.
- **Rumours** — `data/rumors.js`: `WH.registerRumors([{id, factions:["imperium",…]|["*"], minChapter, maxChapter, speaker:{zh,en}|null, text:{zh,en} (≤50 zh / ≤35 en words), codex:["chr_…"]}])`. Overheard lines, graffiti, a veteran's tattoo, a broadcast fragment — never an explanation. 8–12 per route + ~15 shared.
- **Lore events** — `data/events_lore.js`: 6–10 random events (SPEC §5 format, god "other"/"undivided") built around a named campaign (a veteran of Armageddon, a relic from Cadia, a Damocles veteran, an Aeldari who remembers the Fall, a cryptek who remembers the War in Heaven…), small effects, codex unlocks.
- **Engine/UI** — `WH.registerRumors` in the registry; on entering a node without `eventRoll`, with chance 0.25 (setting 传闻: on/off) show one unseen eligible rumour as an italic "传闻 / Overheard" footer under the node text (unlocks its codex ids; never during consequence panels or endings; max one per node; never repeats in a run). Codex gets a **战史 / Chronicle** view: a vertical timeline sorted by `sortKey`, dates always visible, locked entries shown as "???" (teasing that something happened then), unlocked show name/text/more. Validator: check rumours/chronicle ids, dates, sortKeys, codex references, lengths; report counts per route.

## 21. Tzeentch collection easter egg (奸奇彩蛋)
- Progress `P` = round(100 × (0.6 × codex unlocked / codex total + 0.4 × endings found / endings total)), global across runs, excluding the egg entry itself (codex entries with `hidden:true` are not counted and never shown as ??? anywhere).
- Data: `data/easter_tzeentch.js` → `WH.easter.tzeentch.tiers` (at 25 / 50 / 75 / 99 / 100) + hidden codex entry `egg_tzeentch_letter`. Load after the codex files.
- Each tier triggers **once** (persist), the next time the player is on the title screen or opens the codex after crossing it:
  - 25 `whisper`: the title subtitle briefly glitches into the tier text (blue-pink RGB split, 3 s), then reverts.
  - 50 `letter`: a sealed letter icon appears on the title screen; clicking shows a card with title/text (sigil_tzeentch).
  - 75 `flame`: a small blue flame flickers next to the title; clicking opens a mini-scene (sprite daemon_tzeentch, scene warp) with the two choices and their `result` lines (no gameplay effect).
  - 99 `last`: when exactly one countable item remains, the codex header shows the text in place of the counter for one opening.
  - 100 `planned`: full-screen scene (sprite daemon_tzeentch, glitch FX, sfx 'event'), then unlock `egg_tzeentch_letter` and show its card; from then on the title logo has a subtle blue-pink shimmer and Settings gains a toggle "奸奇的玩笑 / Tzeentch's joke": locked "???" in the codex shuffle their characters every few seconds.
- Debug: `?egg=25|50|75|99|100` forces a tier for testing.

## 22. Updates never touch the player's local data (版本更新不覆盖本地记录)
- All progress lives in the browser under `whatiswh.*` keys (saves, autosave, settings, codexGlobal, codexSeen, run records `whatiswh.runs`, run stats, ending stats, tier flags). **No version may delete, reset or rename these keys.** New data goes into new keys or new optional fields; old records must load (migration functions per schema step, unknown fields preserved, never dropped).
- On boot, compare stored `whatiswh.lastVersion` with `WH.VERSION`; if newer, run migrations, then show a one-time toast "已更新到 vX.Y.Z · 存档与记录已保留" / "Updated to vX.Y.Z · saves and records kept", and store the new version.
- **Full backup**: Settings → 数据 / Data: "导出全部进度" exports every `whatiswh.*` key as one JSON (game version + timestamp); "导入全部进度" merges it back (records union by run id, codex union, endings max, saves only into empty slots unless the player confirms overwrite). Inside sandboxed pages where downloads are blocked, offer "复制到剪贴板" and a paste box instead.
- Note for players (README): progress belongs to the browser and the address it was opened from (local file vs. GitHub Pages vs. artifact are separate) — use the full backup to move it.
- Repo/local folder: files players may customise (`assets/audio/files.js`, any `*.local.*`, `saves/`, `user/`, `logs/`, user audio files) are never overwritten by the local sync (`.sync/apply.py`).

## 23. Origin trade-offs (出身：有得有失)
User: origins must trade off, not just lose — e.g. a labourer has more HP but less Sanity; overall balanced.
- Stat caps become per run: an origin may set `max:{hp, sanity}` (default 100 each; allowed 70–130). Start values default to the caps (`stats.hp/sanity` may be lower than max but rarely). The engine clamps hp/sanity to the run's caps (`state.max`), corruption and renown stay 0–100. HUD bars scale to the cap and show e.g. "118/120". Saves store `max` (migration: missing → 100/100).
- Budget rule (validator): for each origin, (maxHp − 100) + (maxSanity − 100) + (renown − 10) − 1.5 × corruption must be within ±5 of 0 — every bonus is paid for. Each non-default origin should have at least one stat above default and one below.
- Every origin (including the default one) should get a distinct, lore-fitting profile; the default origin may stay 100/100/0/10.
- Balance target (random play): per-origin death rate within ±6 points of the route average, and every origin still reaches all of its route's endings.
- Origin cards show the trade-off clearly (e.g. "生命上限 120 ▲ · 理智上限 85 ▼").

## 24. Difficulty icons (难易图标)
- Race cards and origin cards show **only** 1–3 small pixel skulls (drawn in code like the slime, faction-tinted, empty skulls for the remainder). No text label, no tooltip, no numbers (aria-label "难度 n/3" for screen readers only).
- Levels live in `data/difficulty.js` (`WH.difficulty = {imperium:3, "imperium/hive":3, …}`); `node tools/dev/validate.js --write-difficulty` may regenerate them from the fixed-seed simulation. Missing file → no skulls.

## 20b. Rumours must be relevant (v0.2.4 — replaces the flat 25% roll)
User: rumours trigger too mechanically; they must only appear when relevant.
- Every rumour gets `when` (required): any match of
  `scenes:[scene keys]`, `sprites:[speaker/foe sprite keys]`, `codex:[ids unlocked by this node]`, `flags:[run flags set]`, `keywords:{zh:[…], en:[…]}` (substring of the node text in the current language… match on either language's text so behaviour is language-independent).
  Rumours without `when` never fire.
- Engine: on node enter (same exclusions as §20), collect eligible unseen rumours whose `when` matches this node's context (scene, speaker sprite, foe, codex unlocked here, flags, node text in zh+en); pick the best match (score = number of matched criteria, ties random) with probability 0.6 if score ≥ 2, 0.35 if score = 1. Spacing: at least 3 nodes since the last rumour; at most 2 rumours per chapter. Seeded as before.
- Content: each rumour's `when` should point at what it talks about — Orks/Armageddon ↔ ork sprites, trench, "兽人"; Cadia ↔ guardsman/commissar, "卡迪亚", place_cadia; Damocles ↔ tau_water_caste/tau_warrior, "海湾"; the Fall ↔ aeldari_seer, craftworld, "色孽"; War in Heaven ↔ cryptek, tomb_interior, "星神"/"C'tan" … Rewrite a rumour's wording if needed so the link reads naturally.
- Validator: every rumour has `when`; report per rumour how many nodes in its routes can match it (warn if 0 = unreachable, warn if > 40% of a route's nodes = too generic); simulate rumours heard per run (target 4–8) and the share that matched on ≥ 2 criteria.

## 20c. Rumours are heard where people gather (聚集区, v0.3.4 — replaces the "any node" rule of §20/§20b)
User 2026-11-12: "传闻现在出现的还是太不合时宜了 把一些剧情改到聚集区然后有机会听到传闻". A rumour popping up mid-fight, in a warp storm or alone in a tomb is wrong. Rumours (and past-life echoes, §27, which are overheard the same way) may only be heard on **gathering-place nodes**.
- **Data.** A node may carry `gather:{zh,en}` — the place label (zh ≤ 8 chars, en ≤ 4 words, e.g. `{zh:"食堂",en:"Mess hall"}`). It marks a scene that is really set where ordinary people gather and talk: mess hall / canteen, cantina or bar, market or bazaar, hab-block commons, dormitory, ration queue, hiring hall, station platform, pilgrim hostel, congregation / service, campfire circle or feast, dig-camp mess tent, refectory, festival… **Coherence rule (Howie: context must be coherent first):** the node text (zh **and** en) must show the place — it contains the label (zh label as a substring of `text.zh`, en label, case-insensitive, of `text.en`) and has other people present (the narration says so). Never on: ending nodes, death nodes, combat/ambush/solitary/warp-storm scenes, nodes with `eventRoll`, or any node whose text contradicts a crowd (a locked cell, an empty tomb). Not on `gatherOnly` events: random events keep their own rules.
- **Engine.** `_rollRumor` / `_rollEcho` return immediately unless `node.gather`. At a gather node: candidates = eligible unseen rumours (route / chapter as before); score = §20b `when` matches (now only a preference, 0 allowed: idle chatter about the wider war is natural in a crowd); pick the best score, ties random; chance p = 0.7 if score ≥ 2, 0.6 if score = 1, 0.45 if score = 0. Spacing / per-chapter caps unchanged (≥3 nodes since the last, ≤2 per chapter). Echoes: at a gather node with no rumour, chance 0.3 (still ≤1 per run, other rules of §27 unchanged). Own seeded streams as before, `opts.rumorChance` still overrides p (tests). Nothing else in the engine changes; saves need no new fields; rewind unaffected.
- **UI.** A gather node shows a small tag next to the scene/chapter line: "聚集区 · 食堂" / "Crowd · Mess hall" (muted, no emoji needed). The rumour footer is unchanged. Settings → 传闻 hint: "只会在聚集区听到 / Only heard in crowded places".
- **Content (text role).** Per route, existing story beats are re-set (or short transition nodes added) in gathering places: **≥ 8 gather nodes per route, in ≥ 6 different chapters (1–7), every origin passes ≥ 5 of them on any full run; at most 1 per 2 consecutive spine nodes (no wall of canteens).** Prefer re-setting an existing node (same id, same choices/effects/flags/gotos; change text, `scene`, `speaker`, and add `gather`) over adding nodes; an added transition node is allowed (1–3 choices, small effects, no new death route) if the story needs it. Each route has its own kinds of crowd (Imperium: hab canteen, barracks mess, ration queue, chapel service, troop-ship mess; Chaos: underhive bar, cult gathering, scavenger market; T'au: market, mess, Earth-caste commons; Aeldari: craftworld hall, Maiden-world market, festival; Necrons: dig-camp mess tent, workers' tents, supply convoy halt; Orks: feast fire, fighting pit crowd, scrap bazaar; GSC: congregation, hab-block commons, cult cell meeting; Mechanicus: refectory, forge-floor commissary, pilgrim hostel). Rumour wording in `data/rumors.js` must read naturally as something heard in a crowd (overheard talk, a vox broadcast in the commons, graffiti on the canteen wall, a veteran's story); fix any that do not.
- **Balance and rules.** Death rates stay inside the §23/§28 budgets (re-setting is neutral; added nodes must not shift a route's death rate by more than ±1 pt), claim-ending rates and origin balance unchanged, all existing validator rules (grudge presence §28, date consistency, text lengths, reachability) still pass. The node count rule of §3 still holds.
- **Validator.** `gather` shape and lengths; label contained in zh and en text; forbidden on endings / death / eventRoll nodes / foe nodes with a combat roll scene (warn); per route: gather node count, chapters covered, per-origin passes on simulated runs (error < 5 on average, warn < 6), rumours heard per run (target 3–6) and echo share; `--gather-report [--faction f]` prints the table (node id, chapter, scene, label, reachable by origin). Old §20b "rumour unreachable" warnings are replaced by: a rumour is unreachable if no route node that is a gather node in its chapter range exists.
- **Tests.** Smoke: a gather node shows the tag; non-gather nodes never show a rumour even with `rumorChance = 1`; gather node with `rumorChance = 1` shows one; zh + en, desktop + mobile; sample data has two gather nodes.

## 25. Achievements (成就, v0.3)
- Data: `data/achievements.js` → `WH.registerAchievements([...])` (registry adds `WH.achievements` + `registerAchievements`).
  `{ id:"ach_<slug>", name:{zh,en}, desc:{zh,en} (≤30 zh), icon:"<sprite or ui key>", hidden:false, tier:"bronze|silver|gold", cond:{…} }`
- Condition types (engine evaluates generically; all global across runs):
  `ending:{id}` · `endingKind:{kind, count, faction?}` · `endingsAll:{faction}` · `claim:{god}` · `claimAll:{}` (all 4 gods, any routes) · `chosen:{}` (a Chaos "chosen" ending) · `resist:{count}` · `deaths:{count, cause?:"hp|sanity|corruption", faction?}` · `runs:{count}` · `origins:{faction}` (all origins of a faction finished) · `factionsAll:{}` (an ending on every route) · `codexPct:{pct, type?, race?}` · `chronicleAll:{}` · `rumors:{count}` · `egg:{tier}` · `survive:{stat:"sanity|hp", max}` (reach a good ending with stat ≤ max) · `fast:{maxNodes}` (an ending in ≤ N nodes) · `flag:{id, faction?}` (a run flag ever set) · `taintSum:{min}` (end a run with total hidden taint ≥ min, revealed only by unlocking).
- UI: title-screen button 成就 / Achievements → grid (tier colour, icon, name, desc; locked: dim; `hidden` locked: "???" + "隐藏成就"), progress n/t; toast "成就解锁：…" with sfx('codex'); unlocked state stored in `whatiswh.achievements` (never cleared by updates, included in full backup).
- Tone: short, funny, lore-savvy names (original wording; no GW slogans verbatim).

## 26. New routes (v0.3): Orks · Genestealer Cult · Adeptus Mechanicus
All rules of §3, §11, §16 (3 origins), §17 (renownHelp), §18–§19 (taintMod, 4 claim endings, claim gotos), §20b (route rumours with `when`, may be registered in the faction file via `WH.registerRumors`), §23 (origin trade-offs) apply. 8 chapters, 75–90 spine nodes, ≥2 good / ≥3 bad endings + 3 death nodes, 5 route taint events (≥1 cleanse) and 1–2 route events inside the faction file. Player is always an ordinary human.
| | Orks 兽人 | Genestealer Cult 基因窃取者教派 | Adeptus Mechanicus 机械神教 |
|---|---|---|---|
| id / prefix | `orks` / `ork_` | `gsc` / `gsc_` | `mechanicus` / `mech_` |
| You | a human scrap-trader enslaved on an Imperial world overrun by a Waaagh!, kept alive because a Mek finds you useful | a human miner on a mining world drawn into the Cult of the Four-Armed Emperor | a human menial on a forge world, one step from servitor conversion, who climbs the Cult Mechanicus |
| renownLabel / icon | 牙币 Teef / `icon_teef` | 血亲 Kinship / `icon_kinship` | 机眷 Grace / `icon_grace` |
| color | `#6aa84f` | `#9b59b6` | `#c0392b` |
| Leaders | 加兹库尔 Ghazghkull (prophet), 戈克与莫克 Gork & Mork, Warbosses, Meks, Weirdboyz; Ork kultur (might makes right, belief makes tech work, spores) | Patriarch, Magus, Primus; the Four-Armed Emperor; generations of hybrids | the Omnissiah / Machine God, Mars & the Fabricator-General, 贝利撒留·考尔 Belisarius Cawl, Tech-Priests, Skitarii; STCs, tech-heresy |
| Main enemies | the Imperium (Armageddon-style war), everyone else, Chaos (Khorne loves it) | Imperium (Arbites, PDF, Inquisition) — and the hidden truth: the "Star Children" are a Tyranid hive fleet | Dark Mechanicum (Chaos), Necrons (explorators raid tombs), Orks (who steal everything) |
| Final boss | a Warboss duel as Ghazghkull's Waaagh! arrives (`omen_waaagh`) | Day of Ascension → the hive fleet devours the cult (`omen_star_children`, hive_tyrant) | a Dark Mechanicum magos's daemon engine (Dark Magos Syrredin; "warsmith" is an Iron Warriors rank — not used) (`daemon_engine`) |
| taintMod | khorne 1.0, others 0.6 (Orks are warp-loud but rarely corrupted) | all 0.6 (Shadow in the Warp) | tzeentch 1.1 (forbidden knowledge), others 0.8 |
| target claim band | 5–10% | 3–8% | 8–14% |

New asset keys (art, fixed list):
- Sprites (48 unless noted): `player_orks` (human scrap-trader, salvage goggles), `player_gsc` (miner, hazard helmet, lamp), `player_mechanicus` (grey-robed menial, small augment) · `ork_mek`, `ork_weirdboy`, `ork_nob`(64), `gretchin`(32), `squig`(32) · `gsc_neophyte`, `gsc_acolyte`, `gsc_magus`, `gsc_primus`(64), `gsc_patriarch`(96) · `skitarius`, `magos`(64), `electro_priest`, `kastelan_robot`(64), `dark_mechanicus`(64), `daemon_engine`(96)
- Omens (96, no figures): `omen_waaagh` (green storm over a scrap horizon), `omen_gork_mork` (two colossal green shapes in the clouds, no faces), `omen_star_children` (purple sky, descending lights), `omen_four_armed` (an original four-armed icon painting, abstract), `omen_mars` (red planet ringed by forges), `omen_cawl` (vast archeotech workshop, cable shadows), `omen_omnissiah` (golden gear halo)
- Scenes (192×108): `ork_scrapyard`, `ork_fort`, `mine_shaft`, `gsc_chapel`, `forge_floor`, `mars_vista`, `tech_vault`
- UI (16): `icon_teef`, `icon_kinship`, `icon_grace`
Audio moods: `orks` (rowdy, stompy, brassy square leads), `gsc` (hymn-like but wrong, organ + insectile clicks), `mechanicus` (binary chant, mechanical rhythm, choir-pad); moodFor maps the new scenes/factions.

## 27. One sector, and echoes of past lives (同一星区 · 前世死讯)
**Shared sector.** All routes happen in one original sector on the edge of the Great Rift, 111–115.M42: the **阿尔科萨星区 / Arcosa Sector**. Known worlds: 奥雷克斯二号 Aurex Secundus (Imperium hive; Hesper agri-world, Dustfall, rain-city Vessel nearby) · 卡尔卡罗斯 Carcharos (Chaos-route hive, Hive Vorne) and the shrine world Aldrin · 达尔诺尔 Dal'nor / New Kald (T'au colony across the gulf at the sector's edge) · 瓦尔达 Valda (agri-world the farseers let die) · 忒萨零号 Thessa Null (Necron tomb world) · the new routes' worlds (Ork-overrun world, GSC mining world, forge world — each writer names theirs and registers it). Light continuity only: 1–3 cross-references per route (a tithe ship from Valda that never reached Aurex; Aurex lasguns sold in Dal'nor's port; the forge world sponsoring the Thessa Null dig; refugees from Carcharos; a Waaagh! heading for the sector's edge…), plus a sector codex place entry `place_arcosa` and each world as a place. Never contradict existing text.
Each faction gets `world:{zh,en}` (home world name); origins may override with their own `world`.

**Echoes (死讯).** When a run ends in a **bad or death** ending, the run record stores an echo: `{faction, origin role, world, cause, kind, date, claimedBy?}`. In later runs (any route), the engine may surface ONE echo per run as an overheard line — **never guaranteed**: chance 0.15 on eligible nodes (chapter ≥ 2, no eventRoll, not an ending, ≥3 nodes since the last rumour), at most once per run, only echoes whose date ≤ the current in-game date, preferring other routes. Text from templates in `data/sector.js` (`WH.echoTemplates`, 8–12 framings: a broadcast, a casualty list, a tavern story, a graffiti, a sermon, a xenos remark…) filled with role/world/cause, e.g. "听说奥雷克斯二号有个巢都工人——临阵脱逃，被政委处决。" Claim endings phrase it as "有人说他被<神>带走了". Echo lines show in the 传闻 footer style with a small ✝ mark; clicking shows the past run's record (往生录). Setting: 前世死讯 on/off (default on).

## 28. Grudges — hurting people has later costs (人际后果, v0.3.2)
Requested by Howie 2026-11-12: if the player does something harmful to a person in the story, later choices that involve that person should become more dangerous — **but only where that person is genuinely present in the scene** (context must be coherent).

**Data.**
- `faction.npcs = { <npcId>: {name:{zh,en}, aka:[{zh,en}…]?, sprite?:"<sprite key>"} }` — the named people a route lets you wrong. Only people who really exist in the route's text. `<npcId>` is a short lowercase slug.
- **Wronging.** A choice that harms/betrays/abandons/informs on/sacrifices/robs that person sets the flag `wronged_<npcId>` in `effects.set` (alongside any existing flag; never rename an existing flag, saves hold them). The choice's own text or `result` must make the harm explicit and name the person (zh name or an `aka`).
- **Grudge on a later choice.** `choice.grudge = {npc:"<npcId>", p?:-0.15, effects?:{hp:-6,…}, note:{zh,en}}`:
  - active only when `state.flags["wronged_"+npc]` is set (and not `state.flags["forgiven_"+npc]`);
  - `p` (−0.30…0, roll choices only) is added to the roll's success chance after stat adjustment (final clamp 0.05–0.95);
  - `effects` (harmful deltas only: hp / sanity / renown ≤ 0, corruption ≥ 0, magnitudes ≤ 12; may add `taint` bumps 0–10) are merged into the choice's effects when it is taken;
  - `note` (≤ 30 zh / ≤ 20 en words) explains WHY it is riskier, shown on the choice (tooltip/small ⚠ tag, only while active) and as the first line of the consequence panel.
- **Presence line.** `node.grudgeLine = {npc, text:{zh,en}}` (≤ 60 zh chars): extra sentence appended to the node text only while the grudge is active — the person is visibly there (looks at you, stands at the door, is in the queue). Use it wherever the node's base text alone would not make their presence obvious.
- **Redemption (optional).** A choice may set `forgiven_<npcId>` (an apology, a repaid debt, a saved life), which switches the grudge off.

**Coherence rules (validator, ERROR unless noted).**
1. `grudge.npc` exists in `faction.npcs`; flag `wronged_<npc>` is set by at least one choice in the route, and a path exists from such a choice to the node carrying the grudge (graph reachability; events and `goto` ignored).
2. **Presence:** the node holding a grudge choice must mention the person — the node's zh text AND en text contain the NPC name (or an `aka`), or the node's `speaker`/`foe` sprite equals `npcs[npc].sprite`, or the node has a `grudgeLine` for that npc. Otherwise ERROR "grudge on <node>: <npc> is not present".
3. The choice that sets the flag names the person in its text, `result` or the node text (WARN if not).
4. A grudge never appears before the harm in time: the grudge node must come strictly after the wronging node on every path (node chapter ≥ chapter of the earliest wronging node; WARN if equal-chapter).
5. Bounds: ≤ 4 distinct `wronged_` npcs per route; ≤ 3 grudge choices per npc; `p` ≥ −0.30; effects magnitudes ≤ 12; texts within length limits.

**Engine/UI.** `Game.choices()` returns `grudge: {npc, note, p, effects}` for an active grudge; `rollChance` accepts the extra modifier; `choose()` merges effects and records `step.grudge = {npc, note}`; consequence panel shows it first. UI: ⚠ tag + note on the choice; locked choices unaffected. Backwards compatible: nodes without `grudge` behave exactly as before.

**Balance.** Grudges are a tax on harmful play, not a trap: with random play the route death rate may rise ≤ 3 points vs before; origins stay within ±6 of the route average (§23); claim-rate bands (§19) unchanged. Validator reports per route: wronged npcs, grudge choices, activations per run, death rate with/without.

**Content targets.** 2–4 npcs per route; each has 1–3 harmful choices that set `wronged_*` and 1–3 later grudge choices in nodes where the person is plainly present. Prefer people who already matter in the story; add a `grudgeLine` rather than inventing coincidences. Original prose only (no canon likenesses).

## 29. Music styles (配乐风格, v0.3.3)
Requested by Howie 2026-11-12: more soundtrack choices. All music stays original and procedural (WebAudio, no assets, no network).
- **Styles.** `WH.Audio.styles = [{id, name:{zh,en}, desc:{zh,en}}…]`. `chip` = today's 8-bit chiptune (default, unchanged). New, each covering all 16 moods (calm/tense/battle/death/joy/…, see §15) and keeping the per-node mood auto-pick:
  - `dark` 暗黑氛围 / Dark ambient — slow detuned drones and pads, sparse metallic hits and bells, sub-bass pulses only in combat.
  - `organ` 哥特管风琴 / Gothic organ — pipe-organ chords, choir-like vowel pads, slow arpeggios, timpani-like drums in combat.
  - `synth` 合成波 / Synthwave — saw bass arpeggios, gated pads, four-on-the-floor in combat, shimmering leads for joy.
  - `piano` 钢琴弦乐 / Piano & strings — sparse piano motifs with slow string pads; battle = driving ostinato strings.
  (The audio writer may swap one for a better idea, but ≥ 3 new styles, each clearly different, each original.)
- **API** (contract with the UI): `Audio.getStyles()`, `Audio.getStyle()`, `Audio.setStyle(id)` (crossfades the current mood into the new style within ~1.5 s; unknown id → `chip`), `Audio.previewStyle(id)` (~8 s sample: a calm phrase then a short tense one; stops itself, never overlaps the running mood; the previous style and mood resume afterwards).
- **Setting.** `settings.musicStyle` (string, default `"chip"`, kept by the UI in the normal settings store; unknown value → `chip`). Settings panel: a "配乐风格 / Music style" selector (radio cards or select) with a ▶ preview button per style; works on mobile; changing it applies immediately.
- **Real files** (`assets/audio/files.js`) keep working: a file mapped to a mood overrides the procedural music of any style, as before.
- **Quality.** `audio_check.js` renders every style × mood: no NaN, peak ≤ −1 dBFS, no DC offset, loop seam click-free, ≥ 40 s before obvious repetition; `audio_test.html` gets a style dropdown; zero console errors.

## 29b. Track selection (曲目选择, v0.3.4)
Requested by Howie 2026-11-12: "配乐变成可以选的" — answer chosen: **pick a track + keep the automatic mode**.
- **Setting** `settings.musicTrack`: `"auto"` (default — today's behaviour: the mood is picked per node, 8 s hysteresis) or one of the mood ids (16, see `WH.Audio.getMoods()`). Any fixed id plays in a seamless loop whatever happens in the story (ending and death jingles/moods included — the player chose it); `auto` restores story-driven moods immediately. Unknown stored value → `auto`. Included in the settings backup / import (§22); no save schema change.
- **Audio API** (`src/js/audio.js`, audio role): `WH.Audio.getMoods()` → `[{id, group, zh, en}]` (human names, e.g. 平静 / Calm, 紧张 / Tense, 战斗 / Battle, 死亡 / Death, 亚空间 / Warp … grouped: calm, tense, fight, end, faction), `WH.Audio.setTrack(id|"auto")`, `WH.Audio.getTrack()`, `WH.Audio.getPlayingMood()` (the mood actually sounding now, for the "now playing" label), `WH.Audio.previewMood(id)` (≈ 8 s of that mood in the current style; same rules as `previewStyle`: stops itself, the running music resumes after, muted → no-op). While a track is fixed, `setMood()` calls still update the remembered story mood but do not change what is heard; `setTrack("auto")` crossfades to the remembered story mood (≈1.5 s). Works in every style (§29); real files override as before.
- **UI** (web role): Settings → **曲目 / Track**: a list (radio cards or a select, grouped by `group`) with "自动（随剧情） / Auto (follows the story)" first and a ▶ 试听 / Preview button per track, plus a muted line "现在播放：<mood name>" that updates while in auto mode. Quick access during play: a **♪** button next to the sound button opens a small popover with the style choice (§29), the track list and the mute toggle (closes on outside click / Esc; keyboard usable; works on mobile). Both places stay in sync. Respect mute and the existing audio-unlock rule (browsers need a click first).
- **Tests.** `audio_check.js` unchanged (still renders every style × mood); `audio_render.py` checks the new API (fixed track survives `setMood`, `auto` restores, unknown id → auto, preview timeline); smoke test: setting persists, popover opens/closes, both controls in sync, zh + en, desktop + mobile, zero console errors.

## 30. Rewind — back to the previous choice (回到上一个选择, v0.3.3)
Requested by Howie 2026-11-12: a switch that lets the player go back to the previous choice.
- **Setting** `settings.rewind` (bool, default **false**): "允许回到上一个选择 / Allow going back one choice", in the settings panel (title screen and in-game). While off: no button, no history is kept (zero overhead, behaviour identical to 0.3.2).
- **When on:** a "↶ 回到上一个选择 / Back one choice" button next to Home during play (also a hotkey that does not clash with existing ones, shown in the hint). It restores the **complete engine state** from just before the last choice: stats, flags, taint, clock, visited nodes, rumours/echo state, event state and **the RNG states** — so picking the same roll choice again gives the same result (no re-rolling a gamble), while picking another choice works normally. History = in-memory stack of 30 snapshots; not persisted (after a reload the button is disabled until the next choice).
- **Knowledge is not rewound:** codex entries, lore cards already shown, chronicle unlocks, achievements and the Tzeentch collection stay unlocked.
- **Endings and death:** with the switch on, the ending/death screen also offers "回到最后一个选择 / Rewind to the last choice". The ending that was reached stays recorded (往生录, endings seen, death counters) — the player did see it. Continuing creates a new record for the same run with `rewinds` = number of rewinds used (shown as ↶N in 往生录).
- **Fairness:** run records carry `rewinds`. Achievements that reward a single clean run (no-death / low-stat / no-harm / fast-finish style conditions) only count runs with `rewinds == 0`; cumulative counters (times reached, endings seen, codex %) are unaffected. The web writer audits `data/achievements.js` and lists which conditions got the guard.
- **Engine API:** `Game.canRewind()`, `Game.rewind()` → true/false; `Game.rewindCount`. Saves: slots/autosave store `rewinds`; no schema break (§22).
- **Tests:** choose A → rewind → choose A again = identical state and roll outcome; A → rewind → B works; depth limit; ending rewind keeps the old record and adds a new one with `rewinds ≥ 1`; switch off hides everything; mobile layout; zh/en; save/load; achievements guard.

## 31. Ending illustrations (结局插图, v0.3.4)
Requested by Howie 2026-11-12: "给每个结局设定一个图片" — every ending gets its own picture. Today the ending screen only borrows the node's `scene` background, and many endings share one.
- **Scope.** One illustration per ending node: all `node.ending` nodes of all 8 routes (126 at v0.3.3: 30 good / 72 bad / 24 death; 36 of the bad ones are claim endings). The list is generated: `node tools/dev/dump_endings.js` → `tools/art/endings_brief.json` (id, kind, title, cause, text, scene, speaker, foe, claim god). Any future ending needs a picture too (validator error, see below).
- **Files / keys.** `assets/endings/<ending id>.png` (ids are unique across routes, e.g. `assets/endings/imp_end_claim_khorne.png`), **192 × 108** like scenes, shown scaled with `image-rendering: pixelated`. Registered in `assets/manifest.js` by the generator as **scenes** with key `end_<ending id>` (`WH.registerScenes`, `name` = ending title zh/en) — no registry change; `art("scene", key)` works as is. The `src` points into `assets/endings/`.
- **Generator.** `tools/art/endings_<route>.py` (one module per route, `imperium chaos tau aeldari necrons orks gsc mechanicus`), shared helpers in `tools/art/endkit.py`; registered through `@ending("<ending id>")` in `tools/art/reg.py` (`ENDINGS` registry); `python3 tools/art/build_all.py` writes the PNGs and manifest entries (deterministic: all randomness seeded from the ending id), `python3 tools/art/build_all.py --endings [--faction f]` renders only the endings (fast loop, no manifest rewrite needed for a single route), `--check` also verifies that every ending in the brief has a generator and the file list matches. Duplicate rule: a pair fails only if BOTH the aHash distance and the pixel-difference test are too low (`DUP_FLAG_IF = "both"`). Validator: `--allow-missing-ending-art` while art is in progress. Luminance bands (route averages, good > bad > death): good ≈ 65–85, bad ≈ 38–58, death ≈ 20–42. Contact sheets: `tools/art/contact_endings_<route>.png` (generated).
- **Art direction.**
  - *One picture = one fate, readable without text.* Compose a focal motif that says what happened (the single thing the title and cause name), a setting that matches the node's place, and a mood cue for the kind: **good** warm/clear light, open space; **bad** cold or sick colour, closing-in composition, a wrong detail; **death** dark, heavy vignette, the player's silhouette or a marker left behind — aftermath, never gore.
  - *Unique.* No two endings may look alike: different focal composition, not only a palette swap or a different sprite on the same background. Claim endings (4 gods × route) each show that god's omen/sigil colour language (red = Khorne, green/ochre = Nurgle, blue/pink-violet = Tzeentch, magenta/silver = Slaanesh), set in that route's own world.
  - *Same look as the scenes:* Bayer-dithered gradients, flat colour bands, ≤ 32 colours per image, existing sprites and omens may be reused as props and silhouettes (scaled ×1–×2, tinted), the player sprite of the route may appear.
  - *IP and taste:* no text or lettering in images, no GW marks, no likeness of named canon characters (omens and archetypes only), no gore / explicit violence (implied only), no real-world symbols.
- **UI (web).** Ending screen: the illustration is the top of the ending panel (16:9, pixel-crisp, 3 px frame in the kind colour; **portrait: full panel width; landscape: ×2 picture beside the title block, the panel scrolls, buttons pinned** — a full-width 16:9 does not fit the 960×540 stage); the old scene background stays as the dimmed screen background. 往生录 → endings grid: unlocked tiles show a thumbnail (16:9) above the title; **locked tiles show no picture** (flat dark placeholder, "???") so nothing is spoiled. If an image fails to load or the key is missing the old behaviour (node scene) is used — no broken-image icon. Helper `UI.endingArt(factionId, nodeId)` returns the key (`end_<id>` if present in `WH.scenes`, else the node's `scene`).
- **Validator / gates.** `validate.js`: error if an ending node has no `end_<id>` scene in the manifest or its PNG is missing; warning if the file is not 192 × 108. `tools/art/build_all.py --check-endings` (art gate): exactly one PNG per brief entry and no extras, 192 × 108, ≤ 32 colours, not near-empty (≥ 15 % of pixels differ from the dominant colour), no near-duplicates (average-hash Hamming distance ≥ 10 **and** ≥ 25 % differing pixels between every pair), mean luminance good > bad > death on average per route. The art role also looks at every contact sheet.
- **Not in scope:** animated images, per-origin variants of one ending, pictures for run records beyond the endings grid.

## 32. Story overhaul (大修故事线, v0.4.0)
Owner feedback 2026-11-12: "大修故事线 现在逻辑性不够用" · "故事线需要更多衔接 现在跳的很厉害 不同选项没有后续结果直接强制下一个阶段了". Eight Opus audits (`docs/audit/<route>.md`, plus `digest_*.md` and `convergence_*.md`) found ~500 defects (≈140 severity A). Measured at v0.3.3: 43–69 % of multi-choice nodes send every choice to the same next node, only 13–48 % of choices have their own follow-up, 6–10 forced chapter steps and 18–48 hard jumps per route, 21–49 flags set and never read. This section is the contract for the rewrite; where it contradicts §3 / §5 / §23 / §28 it wins.

### 32.1 Rules every route must satisfy
1. **No cosmetic choices.** A node with ≥2 choices must either (a) send choices to ≥2 different targets, or (b) have choices that set *different* flags (or stat-gated `require`s) that are **read later** — by a `require`, a roll, an `alt` condition (§32.2), a `grudge`, or an event `where`. A node whose choices only change a result line and all lead to the same node is a *false choice*. Validator: false-choice nodes ≤ 5 % of multi-choice nodes (error above 10 %).
2. **Consequence beats.** A branching choice gets its own follow-up of 1–3 nodes (or a flag read by an `alt` line in a node that follows soon) before branches re-merge; *shallow branches* ≤ 20 % of branching nodes (warn). A branching node (≥2 different targets) is shallow only if its sibling targets re-merge within ≤1 step **and** no flag that something reads (`alt` / `resultAlt` / `require` / `grudge` / event `where` / rumour / achievement) tells its choices apart; a branch that re-merges after one own node but sets different *read* flags is not shallow (the validator still prints the old figure as INFO: "branches re-merging after ≤1 own node: n/m, flag-echoed k").
3. **Bridges.** Every edge that advances the chapter passes through a **bridge node** (`bridge:true`) or comes from a node whose choices lead to different targets. A bridge states *where / when / why / who is present* and carries over the previous choice by `alt` lines; its `time` matches its text. Forced chapter steps = 0; remaining hard jumps (scene + big time change) must be justified (warp, vision, epilogue — mark `jump:{zh,en}` with the reason) — unjustified ≤ 3 per route. The validator (`tools/dev/route_converge.js`, now part of validate.js) reports and gates this.
4. **Memory.** Flags that are set must be read: ≤ 3 per route set-and-never-read (warn each). `alt`, `require`, `resultAlt`, `grudge` and event `where` count as reads. Important past choices must visibly echo later (an `alt` line, a changed option, a changed roll, a changed ending).
5. **Text may only assume what is guaranteed on arrival.** Use `node tools/dev/route_graph.js --faction <id>`: if a node's text (or a choice result) depends on a fact that is only MAY (not MUST) at that node, either make the text neutral, gate with `require`, or add an `alt` line for the flag. Shared nodes must not contradict any origin (use `alt` on `origin_<id>` flags).
6. **People.** Introduce before use (on every path, or via an `alt` introduction); no teleporting, no return from absence/death without a reason; presence rules of §28 still hold; a name or title is spelled the same everywhere (zh and en).
7. **Time and place.** `time` agrees with the words ("next morning" ↔ hours, "years later" ↔ y); scene/place changes are explained; the in-world date stays consistent with §27 and canon (Great Rift open since 999.M41; Indomitus Crusade under way in M42; Imperium route text must not present these as new in ~114.M42). Necron stasis jumps may take the Necron route beyond the M42 window (such endings are simply never heard as echoes elsewhere; `date_audit.js` exempts jumps flagged `time.warp` / stasis).
8. **Origins.** Each origin keeps its own opening beats and may use `alt` on `origin_*` for shared nodes; the three openings converge into the spine consistently.
9. **Endings.** Every ending is reached by choices that make it believable: gate with `require` on the last choice where a flag/stat decides (no "menu at the last node"); ending text fits every path that can reach it (use `alt`); ids and titles of existing endings, claim nodes, death nodes, start nodes, origins, npcs and all existing flag names stay. **New endings are allowed** (≤ 2 per route; id `<prefix>end_<slug>`, `ending.kind/title/cause`; art and achievements follow later). Death and claim nodes fire from anywhere: write them location-neutral or vary with `alt` (conditions `fromChapter`, `fromScene`, `fromNode`).
10. **Gathering places** (§20c): ≥ 8 gather nodes per route.
11. **Events** (§32.3): every event that can fire on a route has a `where` that makes sense; `eventRoll` only on nodes where at least one eligible event fits; no event fires where it contradicts the scene (before the uprising, in a tomb, mid-ambush, in the warp…).
12. **Lore** verified against canon (Lexicanum / Warhammer Community); where canon is vague, vague wording.
13. **Balance.** Random-play death rate per route within ±6 pts of the v0.3.3 value (`data/difficulty.js` baseline: imperium/chaos/tau/aeldari/necrons/orks/gsc/mechanicus — read it), origins within ±6 of their route average (§23), claim-ending rates inside the existing bands, good-ending share ≥ 22 % in random play (lowering from today is expected and accepted), every ending still reachable (validator), grudge budgets §28 hold, validator death-rate/claim reports reread after every batch of edits.
14. **Size.** Per route **80–145 nodes** (§3 superseded), typical run **52–68 nodes** (validator: median visited nodes per simulated run; warn > 70 or < 45, error > 80); node text ≤ 90 zh chars as before, `alt.add` lines ≤ 45 zh, `alt.text` ≤ 90 zh; en word limits scaled as before; choice labels ≤ 24 zh.
15. **Saves.** In-progress saves must not crash when a node id disappeared: spine ids stay unless merged; ids that are removed are listed in DEVLOG; the engine falls back (§32.4).

### 32.2 `alt` — flag-conditional text (node field) and `resultAlt` (choice field)
```js
node.alt = [ {if:Cond, text:{zh,en}}, {if:Cond, add:{zh,en}}, … ]     // ≤ 8 entries, evaluated in order against the ARRIVAL state (before this node's own effects)
choice.resultAlt = [ {if:Cond, text:{zh,en}}, … ]                     // first matching entry replaces choice.result (≤ 4 entries)
Cond = {flag:"x"} | {notFlag:"x"} | {flags:["a","b"]} (all) | {anyFlag:["a","b"]} | {stat:"renown",min:20,max:60} | {fromChapter:{min,max}} | {fromScene:["trench",…]} | {fromNode:["id",…]} | {any:[Cond,…]} | {all:[Cond,…]} | {not:Cond}
```
- `text`: the **first** matching entry with `text` replaces the node's main text; every matching `add` is appended as its own paragraph (max 2 shown, in order). The result is fixed on node entry and stored in the run state (`state.altSel`: indexes) so a reload, a rewind (§30) and the validator simulation show the same text; no RNG draws; saves stay compatible (additive field, §22).
- `fromScene` / `fromNode` / `fromChapter` refer to the previously played node (for death and claim endings and for shared joins). Conditions on stats use arrival stats.
- Validator: flags referenced exist and are set somewhere (error), shapes, lengths, ≤ 8 entries, no entry that can never match (flag not MAY at that node → warn), every `alt` read counts as a read for rule 4. `route_graph.js` shows the alt entries and uses them in MUST/MAY reasoning.
- UI: shows the resolved text; `alt` paragraphs look like normal narration (grudgeLine stays italic); the typewriter/skip logic is unchanged.

### 32.3 Events `where` (§5 addendum)
```js
event.where = { scenes:[…], notScenes:[…], nodes:[…], notNodes:[…], chapter:{min,max}, flag:"x", notFlag:"x", flags:[…], anyFlag:[…], stat:… }   // all given keys must hold; matched against the node about to be entered and the arrival state
```
- `eligibleEvents(chapter)` → `eligibleEvents(chapter, node)` and filters by `where`. Events without `where` behave as today (still allowed for generic events, but the validator reports each route node with `eventRoll` and how many events can fire there: warn if 0 eligible (dead roll), warn if an eligible event is route-specific and its text names a place/person the node's scene contradicts (heuristic list) — authors review manually).
- Faction conditions already exist (`factions`); add `excludeFactions:[…]`.
- Claim events (trigger "claim") are unchanged. Event text may use `alt`-style conditional lines in choices? No — keep events simple; use `where` to place them.

### 32.4 Save fallback
If a loaded slot/autosave points to a node id that no longer exists, the engine moves to the first node of the saved chapter (`faction.chapters` order → the lowest-numbered existing node of that chapter, or the chapter's bridge node) and keeps stats/flags; the UI shows a one-line notice "剧情已更新，已回到本章开头 / Story updated — back to the start of this chapter". Never a crash or a blank screen.

### 32.5 Work split and process
- Engine/validator (web role): `alt`/`resultAlt`, event `where` + `excludeFactions`, save fallback, `bridge`/`jump` fields (validator only), validator rules 1–4, 14 (false choices, shallow branches, bridges/hard jumps, never-read flags, run length), route_converge/route_graph folded in (`validate.js --story-report [--faction f]`), sample data, smoke tests.
- Text role: one **Opus writer per route** works from `docs/audit/<route>.md` (sections "选项后续 / 衔接" and the overhaul plan are the work list), edits only its route file (`data/factions/<route>.js`) and its own entries (`evt_t_<route>_*` in events_taint.js, route events, route rumours, route codex, route achievements text if a flag it removed is used — never rename flags). Shared files (data/events.js, events_lore.js, rumors.js shared part, codex shared part) are edited with small targeted Edits only for things the route needs; a final shared-events pass (events `where`, rumours wording) is done by one agent after the routes.
- Gates per route: `node tools/dev/validate.js --faction <id>` (0 errors; story metrics inside §32.1), `node tools/dev/route_converge.js --faction <id>`, `node tools/dev/route_graph.js --faction <id>` (no ERROR; read the new text against MUST/MAY), `node tools/dev/date_audit.js`. Whole-project gates at the end: validate, smoke --real, audio_check, endings brief regenerated (`node tools/dev/dump_endings.js`) → new/changed endings get their pictures (§31) afterwards.

### 32.6 Implementation notes (web role) — where the engine/validator differs from the text above
- **`alt` timing.** Resolved on arrival with no RNG draw, before the node's own effects; the result is `state.altSel = {node, t, a}` (saved as `rec.altSel`, additive, no schema bump). Death and claim nodes get `alt` too. `fromChapter/fromScene/fromNode` use the previously played node from `state.history`.
- **`resultAlt`.** Judged on the state *before* the choice's effects; "from" = the node before the current one; a roll's own `rollResult` text still wins over `resultAlt`.
- **Event `where`.** `stat` / `taint` take sibling `min` / `max` (`{stat:"hp", min:30}`); callers without a node (e.g. old tests) ignore `where`.
- **Save fallback order (§32.4).** Chapter 1 → the origin's `startNode`; otherwise the chapter's bridge node, else its entry node, else the lowest-numbered non-ending, non-prologue node; an empty chapter falls back to the nearest earlier one. `Save.validate` no longer rejects unknown node ids (an unknown faction is still rejected); the UI shows the `story_updated` toast.
- **Shown `add` lines.** At most 2 matching `add` entries are shown; more than 2 per node is a NOTE (use mutually exclusive conditions), > 8 a WARN.
- **Reads (rule 4).** Besides `alt`, `resultAlt`, `require`, `grudge` and event `where`, a flag read by a rumour `when.flags` or by an achievement `flag` condition counts as read (reported separately as "read only by achievements/rumours").
- **Hard jump** = an edge where the scene changes AND (≥ 72 h, or years, or `time.warp`, or the chapter advances); justified when the target has `bridge`/`jump` or the source has `jump`. **Forced chapter step** excludes bridge targets.
- **Severity.** Default `validate.js` prints the §32.1 story findings as WARN (so a route mid-rewrite keeps the older gates green); `--story-gate` turns the "error" limits into errors (false choice > 10 %, forced chapter step > 0, median run > 80).
- **Shallow branch (rule 2, lead decision 2026-11-12).** Defined in rule 2 above: re-merge within ≤ 1 step AND no read flag distinguishes the choices; the plain "re-merge within ≤ 1 step" count stays as an INFO figure.
- **Not implemented:** the §32.3 heuristic "event text contradicts the scene"; only the dead-roll check (an `eventRoll` node where no event can fire) exists.
(Note: `node tools/dev/playthrough.js <faction> [--seed N] [--origin id|index] [--en] [--stats] [--flags] [--first|--last]` prints one random run as readable text — QA tool.)

## 33. "Do you know Warhammer?" opening choice (开局选择是否熟悉战锤, v0.4.0)
- **Dialog.** The first time a player presses 开始新游戏 on the title screen (`settings.loreAsked` false) a modal asks 你熟悉战锤40K的设定吗？ with two buttons: **我是新人 · 开启条目** (keeps `loreCards: "new"`, `keywordLinks: true`) and **我很熟 · 关闭条目** (`loreCards: "codex"` = no pop-up cards, toasts only; `keywordLinks: false`). Entries are collected into the codex either way. ✕ / Esc / click-outside keeps the defaults and still counts as asked; then the faction picker opens. Asked once per browser profile.
- **Returning players are not asked.** If `settings.loreAsked` was never stored and the profile already has codex progress or finished runs, `Save.loadSettings` sets it to true (read *before* the defaults are merged in).
- **New setting `keywordLinks`** (default true; Settings → 台词里的条目链接 on/off). Off = `linkify` renders plain text (no dotted underline, no tooltip, no click-to-open); applies from the next text that is rendered. Independent of 知识卡片 (new / all / codex).
- **Code.** `UI.askFamiliarity(next)` in ui.js; i18n keys `fam_*`, `kw_links*`; CSS `.fam-*`.
- **Tests.** `smoke_test.py --only-fam` (28 sample / 26 real checks). Every smoke context starts with `loreAsked = true` via an init script (so older tests are unaffected) except contexts created with `_fam=True` / `new_ctx(fam=True)`.

## 34. Cloud save mirror for the claude.ai artifact (云端存档, v0.4.0)
- **Why.** Inside an artifact the page runs in a sandboxed frame; the platform says `localStorage` belongs to one viewer in one browser, can be missing or throw, and must not hold state that has to last. Result: progress vanished between visits. `Save` keeps working exactly as before (localStorage + in-memory fallback); the cloud copy is an add-on.
- **Where it works.** Only when the page runs inside an artifact whose declaration has `db` and `user` (`declare_capabilities {db:{}, user:{}}`, default rules), and the viewer is signed in with write access — the artifact's owner and organization members with Contributor access. Public visitors from outside have `view` only: for them `WH.Cloud` stays `off` and nothing changes. file:// and GitHub builds have no `window.claude` → `off`, `available:false`.
- **Storage layout.** `data/users/<id>/sv_meta {n,t,bytes,ver}` + `sv_0 … sv_<n-1> {i, s}`: the text of `Save.exportAll()` (minus `bak.*` and `lastVersion`) cut into 60 000-char chunks (a db document is capped at 256 KiB; ≤ 64 chunks). The subtree is private to the viewer, even from the owner. Never written outside it.
- **Flow (src/js/cloud.js, loaded after ui.js).** connect (waits up to 3 s for `window.claude`, 12 s per capability) → pull: read meta + chunks, `Save.importAll(backup, {newer:true})` (records / codex union; a save slot with a later `savedAt` replaces the local one, the old one kept as `bak.import.<slot>`; settings only if this browser has none; nothing is ever deleted) → `UI.cloudPulled(sum)` (applies imported settings, re-renders the title, toast 已从云端恢复) → push the merged text if it differs. After that every `Save` write / delete (`Save.onChange`) schedules a push after `Cloud.debounce` ms (5000); hidden tab → immediate push. Unchanged text is never re-sent; chunks are written one at a time, `sv_meta` last, stale chunks deleted.
- **Safety.** A pull that fails or reads an inconsistent copy (`broken`) never pushes (an empty or stale browser cannot overwrite the cloud); `off` (signed out / no db) is silent and final; transient errors retry (20 s × n, ≤ 4); `quota_exceeded` / `invalid_argument` / `revoked` stop syncing for the visit. Deletions are mirrored from the browser that makes them but a second browser that still holds the old data will merge it back (union semantics).
- **UI.** Settings → 云端存档 row (only when `WH.Cloud.available`): state text (连接中 / 同步中 / 已同步 · hh:mm / 失败 / 未登录或没有写入权限，只存在本机浏览器) + ⟳ 立即同步.
- **Tests.** `smoke_test.py --only-cloud` (23 checks) with a fake `window.claude` db injected by `add_init_script` (it must not touch localStorage: an init script that wrote storage raced with `page.reload()` in other tests).
