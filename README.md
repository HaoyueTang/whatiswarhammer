# 什么是战锤 / What is Warhammer?

A bilingual (中文 / English) pixel-art text adventure for newcomers to the Warhammer 40,000 setting.
You play an **ordinary human** who is slowly dragged into the 41st millennium. Pick a faction:
**Imperium of Man 人类帝国**, **Chaos 混沌** or the **T'au Empire 钛帝国**. Over a route of about 45–60 minutes
you meet that faction's leaders, its main enemies and its final boss, through what people do and say, not through lectures.

一部面向战锤 40K 新人的双语像素文字冒险。你扮演一个普通人，被一点点卷入第 41 个千年。
选择人类帝国、混沌或钛帝国，用约 45–60 分钟认识这个阵营的领袖、主要敌人和最终首领。

## How to play / 怎么玩
- **Double-click `index.html`.** It runs straight from `file://` in any modern browser (Chrome, Edge, Firefox, Safari):
  no server, no install, no internet, no build step.
- Pick **新游戏 / New Game**, choose a faction, read, choose.

### Controls / 操作
| Key / 按键 | Action / 作用 |
|---|---|
| `1`–`4` | pick a choice (`1`–`3` inside a warp event) / 选择选项 |
| `Space` / `Enter` / click the dialogue | finish the typewriter text, skip the chapter card / 显示全文、跳过章节卡 |
| `Esc` | close codex, save, settings / 关闭窗口 |
| `Tab` | move between buttons (all screens can be used from the keyboard) / 键盘导航 |

Top-right buttons in game: **图鉴 Codex · 存档 Save · 读档 Load · 设置 Settings · 中/EN · ⌂ title**.
The language switch re-renders the current scene immediately.

### Rules in one paragraph / 规则
Four stats, 0–100: **生命 HP**, **理智 Sanity**, **腐化 Corruption** and a faction stat (信仰 Faith / 神恩 Favor / 大义 Greater Good).
HP 0, Sanity 0 or Corruption 100 means death. Some choices need a past decision or a stat value (🔒 shows what is missing).
Choices marked **险 / Risky nn%** are dice rolls; the chance shifts with the stat involved.
Time jumps unevenly between scenes: hours, days, sometimes years. Warp travel bends the clock. Chaos gods sometimes intrude with random events.
Below 30 Sanity the screen starts to whisper; above 60 Corruption the edges bleed red.

### Saves / 存档
- 3 manual slots, plus an **autosave** made at every chapter change and every 5 scenes. **继续 / Continue** loads the most recent save.
- Saves live in the browser's `localStorage` (keys start with `whatiswh.`). If storage is blocked (some privacy modes / `file://` policies),
  the game keeps saves in memory for the session and says so.
- **导出 / Export** downloads the current run as `.json`; **导入 / Import** loads one back (it is validated first; bad files are rejected with a message).
- Codex progress is kept across runs; the title screen shows total completion.
- Settings: text speed, visual effects on/off, music / SFX volume, mute (also the 🔊 button), lore cards (pop up / codex only), language. The game also respects the OS "reduce motion" setting.

### Lore cards & keywords / 知识卡片
The first time you discover a codex entry, a small card explains it (Enter = next, Esc = skip all; you can switch auto-popup off).
The codex (图鉴) has four views: entries, places (with scene pictures), every ending you have found, and 往生录 / Service Record: your last 50 lives with cause of death and how long you survived.
Names you have already discovered are underlined in the dialogue: hover for a tooltip, click or tap to reopen the card.

## Project structure / 目录
```
index.html                 entry; plain <script> tags in SPEC load order
src/js/registry.js         shared registry (WH.register*)            — lead
src/js/i18n.js             UI strings, WH.t / WH.L                     — web
src/js/save.js             localStorage saves, schema + migrations     — web
src/js/engine.js           pure rules/state machine (no DOM)           — web
src/js/ui.js               screens, dialogue, modals, FX               — web
src/js/main.js             boot (+ ?sample=1 / ?seed=N / ?debug=1 dev params) — web
src/js/audio.js  assets/audio/   chiptune music + SFX (optional)    — audio
src/css/style.css          gothic pixel UI, landscape + portrait       — web
data/codex.js  data/events.js  data/factions/{imperium,chaos,tau}.js  — text
assets/manifest.js  assets/{sprites,scenes,ui}/*.png                    — art
tools/art/                 Python generators for every PNG            — art
tools/dev/validate.js      data checker + Monte-Carlo simulator        — web
tools/dev/sample_data.js   tiny test faction (never loaded by the real game)
tools/dev/smoke_test.py    headless-browser smoke test + screenshots
docs/SPEC.md               design contract;  docs/DEVLOG.md  dev log
```
Full data schema: `docs/SPEC.md`. Project memory for contributors: `CLAUDE.md`.

## Developer commands / 开发
```bash
node tools/dev/validate.js            # check data/** + assets/manifest.js, then 3000 simulated runs per faction
node tools/dev/validate.js --sample   # same, against tools/dev/sample_data.js
#   options: --runs N  --seed S  --faction imperium  --quiet  --force-sim
python3 tools/art/build_all.py        # regenerate every PNG + assets/manifest.js
python3 tools/dev/smoke_test.py       # headless Chrome test on sample data (needs Python Playwright + Chrome)
python3 tools/dev/smoke_test.py --real  # same flow against the real data
```
The validator loads the real `engine.js` in a Node `vm`, so simulated runs use exactly the game rules: effects, clamping,
death checks, the roll formula, warp time and random events. It exits non-zero on any error (missing ids, unreachable nodes, dead ends,
softlocks, loops, missing translations…). Length limits and balance figures are reported as warnings.

Dev URL parameters: `index.html?sample=1` swaps in the sample faction; `?seed=123` makes new games deterministic.
Missing images are drawn as labelled placeholders, and a missing data file shows a notice on the title screen, so the game always boots.

## Credits / 致谢
- Design, story, pixel art and code: the 什么是战锤 project team (owner: Howie), written with Claude.
- All prose and all pixel art are original. No text is quoted from books or codexes. Named canon characters appear only in dialogue,
  rumour or as `omen_*` images (skies, fleets, light), never as portraits. No Games Workshop logos or iconography are used.
- Fonts: system fonts only (optionally Zpix / Fusion Pixel if installed locally); nothing is downloaded.

## Disclaimer / 声明
This is an **unofficial, non-commercial fan project**. It is not endorsed by or affiliated with Games Workshop.
Warhammer 40,000, Warhammer and associated names are trademarks of Games Workshop Limited. All text and art in this project are original works made for fans.

本作品为**非官方、非商业**的粉丝创作，与 Games Workshop 无关。Warhammer 40,000 及相关名称为 Games Workshop Limited 的商标。本项目中的所有文字与美术均为原创。
