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
