# What is Warhammer? / 什么是战锤

[English](#english) · [中文](#中文)

---

## English

A bilingual (English / 中文) pixel-art text adventure for newcomers to the Warhammer 40,000 setting.
You play an **ordinary human** who is slowly dragged into the 41st millennium. Pick a faction —
**Imperium of Man**, **Chaos** or the **T'au Empire** — and over a route of about 45–60 minutes
you meet that faction's leaders, its main enemies and its final boss, through what people do and say, not through lectures.

### How to play
- **Double-click `index.html`.** It runs straight from `file://` in any modern browser (Chrome, Edge, Firefox, Safari):
  no server, no install, no internet, no build step.
- Pick **New Game**, choose a faction, read, choose. Music starts on your first click.

### Controls
| Key | Action |
|---|---|
| `1`–`4` | pick a choice (`1`–`3` inside a warp event) |
| `Space` / `Enter` / click the dialogue | finish the typewriter text, skip the chapter card |
| `Esc` | close codex, save, settings |
| `Tab` | move between buttons (every screen works from the keyboard) |

In-game buttons (top right): **Codex · Save · Load · Settings · 中/EN · 🔊 · ⌂ title**.
The language switch re-renders the current scene immediately.

### Rules
- Four stats, 0–100: **HP**, **Sanity**, **Corruption** and a faction stat (Faith / Favor / Greater Good).
- HP 0, Sanity 0 or Corruption 100 means death. Some choices need an earlier decision or a stat value (🔒 shows what is missing).
- Choices marked **Risky nn%** are dice rolls; the chance shifts with the stat involved.
- Time jumps unevenly between scenes: hours, days, sometimes years. Warp travel bends the clock.
- Chaos gods sometimes intrude with random events.
- Below 30 Sanity the screen starts to whisper; above 60 Corruption the edges bleed red.

### Codex, lore cards, records
- The first time you discover something, a short **lore card** explains it (Enter = next, Esc = skip all; auto-popup can be switched off).
- Names you have already discovered are underlined in the dialogue: hover for a tooltip, click or tap to reopen the card.
- The **Codex** has four views: **Entries** (leaders, enemies, bosses, gods, lore), **Places** (with scene pictures),
  **Endings** (every ending found, with cause and survival time) and **Service Record** — your last 50 lives with cause of death,
  time survived and the Chaos gods you met.
- The ending screen shows cause of death, time survived, a "You met" checklist and the Chaos gods who watched you.

### Saves
- 3 manual slots plus an **autosave** at every chapter change and every 5 scenes. **Continue** loads the most recent save.
- Saves live in the browser's `localStorage` (keys start with `whatiswh.`). If storage is blocked (some privacy modes / `file://` policies),
  the game keeps saves in memory for the session and says so.
- **Export** downloads the current run as `.json`; **Import** loads one back (validated first; bad files are rejected with a message).
- Codex progress and run records are kept across runs.
- Settings: text speed, visual effects, music / SFX volume, mute, lore cards (pop up / codex only), language. The OS "reduce motion" setting is respected.

### Music
- 11 original procedural 16-bit-style chiptune moods (title, calm, holy, tense, battle, boss, warp, T'au, happy, death, bad) and 15 sound effects,
  synthesized live with the Web Audio API — no audio files needed. The mood follows the scene automatically.
- To use your own CC0 tracks instead, see `assets/audio/README.md`. Audition everything in `tools/dev/audio_test.html`.

### Project structure
```
index.html                 entry; plain <script> tags in SPEC load order
src/js/registry.js         shared registry (WH.register*)
src/js/i18n.js             UI strings
src/js/save.js             saves, schema + migrations, run records
src/js/engine.js           pure rules / state machine (no DOM)
src/js/ui.js               screens, dialogue, modals, FX
src/js/audio.js            procedural chiptune music + SFX
src/js/main.js             boot (+ ?sample=1 / ?seed=N / ?debug=1 dev params)
src/css/style.css          gothic pixel UI, landscape + portrait
data/codex.js  data/events.js  data/factions/{imperium,chaos,tau}.js   story data
assets/manifest.js  assets/{sprites,scenes,ui}/*.png  assets/audio/     art + audio
tools/art/                 Python generators for every PNG
tools/dev/                 validator, simulator, smoke tests, audio checks
docs/SPEC.md               design contract;  docs/DEVLOG.md  dev log
CLAUDE.md                  project memory for contributors
```

### Developer commands
```bash
node tools/dev/validate.js            # check data + assets, then 3000 simulated runs per faction
node tools/dev/validate.js --sample   # same, against tools/dev/sample_data.js
#   options: --runs N  --seed S  --faction imperium  --quiet  --force-sim
python3 tools/art/build_all.py        # regenerate every PNG + assets/manifest.js
python3 tools/dev/smoke_test.py       # headless Chrome test on sample data (Python Playwright + Chrome)
python3 tools/dev/smoke_test.py --real  # same flow against the real data
node tools/dev/audio_check.js         # static check of music/SFX data
```
The validator runs the real `engine.js` in a Node `vm`, so simulated runs use exactly the game rules. It exits non-zero on any error
(missing ids, unreachable nodes, dead ends, softlocks, loops, missing translations); length limits and balance figures are warnings.
Dev URL parameters: `?sample=1` loads the sample faction, `?seed=123` makes new games deterministic, `?debug=1` shows asset keys.
Missing images are drawn as a pixel slime, and a missing data file shows a notice on the title screen, so the game always boots.

### Credits
- Design, story, pixel art, music and code: the What is Warhammer? project (owner: Howie), written with Claude.
- All prose, pixel art and music are original. No text is quoted from books or codexes. Named canon characters appear only in dialogue,
  rumour or as `omen_*` images (skies, fleets, light), never as portraits. No Games Workshop logos or iconography are used.
- Fonts: system fonts only (optionally Zpix / Fusion Pixel if installed locally); nothing is downloaded.

### Disclaimer
This is an **unofficial, non-commercial fan project**. It is not endorsed by or affiliated with Games Workshop.
Warhammer 40,000, Warhammer and associated names are trademarks of Games Workshop Limited. All text, art and music in this project are original works made for fans.

---

## 中文

一部面向战锤 40K 新人的中英双语像素文字冒险。你扮演一个**普通人**，被一点点卷入第 41 个千年。
选择**人类帝国**、**混沌**或**钛帝国**，用约 45–60 分钟，通过人物的言行而不是说教，认识这个阵营的领袖、主要敌人和最终首领。

### 怎么玩
- **双击 `index.html`** 即可。任何现代浏览器（Chrome、Edge、Firefox、Safari）都能直接从本地打开：
  不需要服务器、安装、联网或构建。
- 点 **新游戏**，选阵营，阅读，做选择。第一次点击后音乐开始播放。

### 操作
| 按键 | 作用 |
|---|---|
| `1`–`4` | 选择选项（亚空间事件中为 `1`–`3`） |
| `空格` / `回车` / 点击对话框 | 显示全文、跳过章节卡 |
| `Esc` | 关闭图鉴、存档、设置窗口 |
| `Tab` | 在按钮间切换（所有界面都能用键盘操作） |

游戏内右上角按钮：**图鉴 · 存档 · 读档 · 设置 · 中/EN · 🔊 · ⌂ 标题**。切换语言会立即重绘当前场景。

### 规则
- 四项数值（0–100）：**生命**、**理智**、**腐化**，以及阵营数值（信仰 / 神恩 / 大义）。
- 生命归零、理智归零或腐化满 100 即死亡。部分选项需要之前的决定或数值达标（🔒 会提示缺什么）。
- 标有 **险 nn%** 的选项是掷骰判定，成功率随相关数值浮动。
- 场景之间时间流速不固定：几小时、几天，有时是几年。亚空间航行会扭曲时间。
- 混沌诸神会通过随机事件闯入你的人生。
- 理智低于 30 时屏幕开始低语；腐化高于 60 时画面边缘渗出血色。

### 图鉴、知识卡片、生涯
- 第一次遇到某个概念时，会弹出一张简短的**知识卡片**（回车 = 下一张，Esc = 全部跳过；可关闭自动弹出）。
- 已解锁的名词会在对话中加下划线：悬停显示提示，点击重新打开卡片。
- **图鉴**有四个分页：**条目**（领袖、敌人、首领、邪神、设定）、**地点**（附场景图）、
  **结局**（已达成的结局、死因与存活时长）、**往生录**（最近 50 次人生：死因、存活时长、遇到的邪神）。
- 结局界面显示死因、存活时长、"你认识了"清单，以及注视过你的邪神。

### 存档
- 3 个手动存档位，另有**自动存档**（每次换章和每 5 个场景）。**继续**读取最近的存档。
- 存档保存在浏览器的 `localStorage`（键名以 `whatiswh.` 开头）。若存储被禁用（部分隐私模式或 `file://` 策略），
  游戏会在本次会话内用内存保存并给出提示。
- **导出**把当前进度下载为 `.json`；**导入**读回（先校验，无效文件会被拒绝并提示）。
- 图鉴进度和生涯记录跨周目保留。
- 设置：文字速度、视觉特效、音乐 / 音效音量、静音、知识卡片（自动弹出 / 仅图鉴）、语言。会遵循系统的"减少动态效果"设置。

### 音乐
- 11 种原创程序化 16-bit 风格芯片音乐情绪（标题、舒缓、神圣、紧张、战斗、首领、亚空间、钛、欢快、死亡、坏结局）和 15 种音效，
  由 Web Audio API 实时合成，无需音频文件。音乐会根据场景自动切换。
- 想换成自己下载的 CC0 曲目，见 `assets/audio/README.md`。所有音乐音效可在 `tools/dev/audio_test.html` 试听。

### 目录结构
```
index.html                 入口；按 SPEC 顺序加载的普通 <script>
src/js/registry.js         共享注册表（WH.register*）
src/js/i18n.js             界面文字
src/js/save.js             存档、版本迁移、生涯记录
src/js/engine.js           纯规则 / 状态机（不操作 DOM）
src/js/ui.js               界面、对话、弹窗、特效
src/js/audio.js            程序化芯片音乐与音效
src/js/main.js             启动（开发参数 ?sample=1 / ?seed=N / ?debug=1）
src/css/style.css          哥特像素风界面，横屏 + 竖屏
data/codex.js  data/events.js  data/factions/{imperium,chaos,tau}.js   剧情数据
assets/manifest.js  assets/{sprites,scenes,ui}/*.png  assets/audio/     美术 + 音频
tools/art/                 生成所有 PNG 的 Python 脚本
tools/dev/                 校验器、模拟器、冒烟测试、音频检查
docs/SPEC.md               设计规格；docs/DEVLOG.md 开发日志
CLAUDE.md                  项目记忆（给开发协作者）
```

### 开发命令
```bash
node tools/dev/validate.js            # 检查数据和素材，并对每个阵营模拟 3000 局
node tools/dev/validate.js --sample   # 同上，使用测试数据
#   参数：--runs N  --seed S  --faction imperium  --quiet  --force-sim
python3 tools/art/build_all.py        # 重新生成所有 PNG 和 assets/manifest.js
python3 tools/dev/smoke_test.py       # 无头 Chrome 冒烟测试（需要 Python Playwright + Chrome）
python3 tools/dev/smoke_test.py --real  # 同上，使用正式数据
node tools/dev/audio_check.js         # 音乐 / 音效数据静态检查
```
校验器在 Node `vm` 中运行真实的 `engine.js`，所以模拟结果与游戏规则完全一致。任何错误（缺失 id、不可达节点、死路、
软锁、死循环、缺少翻译）都会以非零状态退出；文字长度和平衡数据作为警告报告。
开发参数：`?sample=1` 载入测试阵营，`?seed=123` 让新游戏可复现，`?debug=1` 显示素材键名。
图片缺失时显示像素史莱姆，数据文件缺失时标题页会提示，游戏始终能启动。

### 致谢
- 设计、剧情、像素美术、音乐与代码：什么是战锤项目（负责人：Howie），与 Claude 协作完成。
- 所有文字、像素美术和音乐均为原创，未引用任何小说或规则书原文。官方角色只出现在对话、传闻或 `omen_*` 意象图（天空、舰队、光）中，
  不绘制其肖像。未使用 Games Workshop 的任何标志或图标。
- 字体：仅使用系统字体（若本地安装了 Zpix / Fusion Pixel 则优先使用），不下载任何资源。

### 声明
本作品为**非官方、非商业**的粉丝创作，与 Games Workshop 无关，也未获其认可。
Warhammer 40,000、Warhammer 及相关名称为 Games Workshop Limited 的商标。本项目中的所有文字、美术与音乐均为原创。
