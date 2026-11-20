# UNIVERSAL_V2_BRIEF — all 8 factions through the universal birth (SPEC §37 v2)

Design brief for `data/universal.js` v2 + the entry alts in the faction files. Written 2026-11-20 against dev `e6ab6ef`.
Binding for Writer A (universal.js), Writer B (faction files) and the lead (engine / validator / tests).

## 中文摘要（给 Howie）

八个势力都能从「由选项决定势力」走进去：20 扇门（原 9 扇不动 + 新 11 扇），对应 20 个出身，每个出身只从一个阶层进入（★ = 序章里做过某个选择才会出现）。

| 阶层 | 帝国 | 混沌 | 钛 | 兽人 | 灵族 | 死灵 | 机械教 | 基因窃取者 |
|---|---|---|---|---|---|---|---|---|
| 下层 | 巢都工人 | 逃兵 | 归顺战俘 | ★被俘星界军 | — | ★罪犯劳工 | ★杂役 · ★护教军辅兵 | ★矿工 |
| 中层 | 农庄之子 | 下巢拾荒者 | 人类殖民者 | ★废品贩子 | ★星防卫军士兵 · ★做梦的朝圣者 | — | — | — |
| 上层 | 落魄贵族次子 | 教会抄写员 | 港口商人 | — | — | ★考察队档案员 · ★契约书记 | ★巢都学者 | — |

- **序章变长了**：26 个节点（原 12），每局会经过 8–10 个（原 6）。三个阶层各有两次“见谁、学什么”的选择：下层——替征调神甫送名册（开机械教两扇门），傍晚陪断腿老兵（开兽人）或下码头酒馆（开基因窃取者、死灵）；中层——替父亲去粮站（开灵族两扇门），帮拾荒队装车（开兽人）；上层——翻开红字账本（开机械教、死灵契约书记），下楼见来借钱的学者（开死灵档案员）。没开的门直接不显示；无论怎么选，每个阶层至少 3 扇门，每个岔路口至少 2 个选项。
- **故意不做的**：灵族「农业星农工」（亲妹妹妮尔、在瓦尔达长大）、基因窃取者「执法官之子」「素脸的孩子」（生在凯辛）、兽人「巢都帮派分子」（伊斯卡隆居住堆长大）；这 4 个出身仍可从「预选势力」进入。下层没有去瓦尔达的路，中层没有神教的债、矿船或考察队，上层没有理由去拆船星或矿井。
- **时间**：序章不写日期（顶栏显示“序章”），序章文本里不许出现年份；进门那一刻，时钟从该势力自己的开局日期算起（基因窃取者 100.M42，兽人 112，灵族/死灵/机械教 113）。所以“半年后”“三周前”这种话现在是对的：旧的 9 段过门文字都不用改。
- **想请你决定**：① 没解锁的门是隐藏（推荐）还是灰色🔒显示？② 进门时钟是 06:00，可有几扇门发生在夜里（例如“今晚父亲第一次请你喝酒”），要不要让每扇门自带钟点？③ 机械教词条「格拉维克斯……你的家」对从奥雷克斯来的人不对，可以改成一句中性的话吗？

---

## 0. What I verified, and where the lead's constraints were corrected

| Lead's assumption | Finding (source) | Consequence |
|---|---|---|
| Aeldari: sister "Nir" is a companion in all three origins | The girl is **妮尔 / Nell** (EN "Nell"). She is the player's **sister only in `agri`**: "妹妹" appears only in `eld_b02/b03` results, `eld_101` (+alts) and `eld_106`, all agri-only. In `pilgrim` she is a local child who brings you water (`eld_o_pilgrim_2`: “我叫妮尔。”). In `trooper` she is the daughter of the farm where the company is billeted (`eld_o_trooper_5`). | Aeldari is reachable through **trooper + pilgrim** with no sister in the prologue. `agri` stays out (raised on Valda, parents in `eld_107`). There is no Nir/Nell in the universal route. |
| GSC miner: "ten years in the mine" | "十年" appears only in the origin card `desc` (shown on origin cards only, `ui.js:922`) and in the per-route birth result `gsc_b02`. No node text restates it. `gsc_101` base says **"你没有家人。"**; the §35 alt already makes the miner a newcomer ("工牌还硌着你的手心"). | Miner works as an arrival from Aurex. The entry alt must replace "你没有家人" (the player has family on Aurex). |
| GSC warden / kin are birth-bound | Confirmed: warden's mother is Sergeant Marr (`gsc_o_warden_1…4`, `gsc_311`, `gsc_702` C2 "冲进去找母亲" requires `origin_warden`); kin "你生在霍林家", sets `carrier`. | Not reachable. |
| Orks / Necrons / Mechanicus have no family or birth ties | Mostly confirmed. Exceptions: `mech_o_savant_1` base "你在格拉维克斯的居住尖塔长大" (alt replaces it); `nec_o_convict_1` base "卡尔卡罗斯的总督把一整船犯人卖给了考察队" (alt replaces it); `ork_o_ganger_1` "你是伊斯卡隆居住堆底层'锈牙帮'的人" (ganger left out). The necron per-route birth (`nec_b01…b04`) already turns an outsider into all three necron origins, so it is the template. | See §5. |
| Forge world "Gravix" | It is **格拉维克斯 / Gravex** (`place_gravex`). Kessin is **凯辛三号 / Kessin Tertius**. The Kessin ore ship to Aurex is **“忍耐号” / the Endurance** (`gsc_503`, `gsc_end_seed`). | Use these spellings. |
| Codex places | `place_aurex` "你的家乡" (true for every universal player); `place_kessin` "矿石运往奥雷克斯二号" (supports the GSC door); `place_iskaron` names 112.M42; `place_valda_wreck` (Valda tithe ship crashed on Iskaron); `mech_209` "我们的激光枪至今运往奥雷克斯二号" (supports the Mechanicus levy); SPEC §27 "the forge world sponsoring the Thessa Null dig" (supports the lexmech offer). **Clash:** `place_gravex` ends "你的家。" and is unlocked at all three Mechanicus start nodes. | Open question for the lead/Howie (§8, R3). |
| Imperium noble: House Serrin's debt | `imp_o_noble_1` R1: "他说出了债主：总督府的税务官"; `imp_o_noble_2`: "家族欠总督府一笔什一税". The elder brother (unnamed "哥哥") appears in `imp_o_noble_2b/3`. | Up strand: the **governor's tithe is the big red line**; the Cult's arrears are a second, smaller line. The brother must not appear in the prologue. |
| Imperium hive: family | Shared imperium nodes mention "你母亲" (`imp_204`, `imp_210`, `imp_408`). | The low strand may show an unnamed mother. Name nobody new in the family. |

---

## 1. Goals & constraints

**Goals.** (1) All 8 factions reachable from the universal birth. (2) Text and clock agree. (3) A longer prologue whose choices about **whom you meet / what you learn** decide which doors exist.

**Rules every writer obeys (story text):**
1. Node text ≤ 90 zh chars (newlines not counted) and ≤ 65 EN words. A text `alt` replaces the text, so it has the same limit. `add` ≤ 45 zh. At most **2 adds** can show on one node (`ALT_ADD_MAX = 2`, engine.js:64). Choice label ≤ 24 zh / ≤ 14 EN words. `result` ≤ 90 zh.
2. ≤ 4 choices per node, **counted in the data array** (hidden choices count).
3. Original prose. Lore is shown through what NPCs do. No GW names beyond the ones the routes already use.
4. **Universal nodes are stat-neutral:** no `hp/sanity/corruption/renown/taint`, no `roll`, `eventRoll`, `ending`, `gather`, `grudge`, **no `codex`**, **no `time`**. Only `effects.set` of `class_*` / `u_*` flags, and the door's `faction` / `origin`. (I considered unlocking `place_aurex` at `u_b01` and rejected it: a lore card on the first screen right after the "do you know Warhammer?" dialog is noise. Every route that matters unlocks Aurex later.)
5. **No dates in universal text:** no year, no "M42/M4x", no 3-digit year number, no "第N日", no calendar day. Durations ("三年约", "二十九年") are fine. `born_universal` alts in the faction files follow the same rule: say how long ("几周", "半年"), never which year.
6. **Time-of-day:** after a door the HUD clock restarts at day 1 06:00 of the faction. New `born_universal` alts must not name a time of day (no 今晚 / 半夜 / 夜班 / 下午 / 傍晚). Use "那天", "当天", "落地那天". (Pre-existing exceptions are listed in §8 R2.)
7. **Time-safety of shared nodes.** The prologue is undated and the doors lead to different years (GSC 100, Imperium/Chaos/T'au 111, Orks 112, Aeldari/Necrons/Mechanicus 113). A node that comes before a door must be true in that door's year. Nodes that can precede the **GSC door (100.M42)** must be timeless: `u_b01–u_b03, u_low_1, u_low_1m, u_low_2, u_low_2d, u_low_3, u_low_ship`. In these nodes do **not** mention: Valda's silence or missing grain ships, the green sky / Waaagh!, the Thessa Null dig, Hesper, the Black Crusade, Dustfall's war, T'au rule over Dal'nor. Year-specific colour goes only into door `result`s and entry alts.
8. **§37.9 introductions.** Every character who appears for the first time is introduced in narration or self-introduction; a name tag is not enough. `intro_audit.js` ignores flags (it walks the graph as if every choice were open), so **every sub-door node names its speaker in its own base text**, even when only a gated path leads there.
9. **Gated choices:** `require: {flag: "<u_flag>"}, hideIfLocked: true`. Gated choices always come **after** the ungated ones in a node's array (stable click order). The engine's `require` only supports AND/NOT (engine.js:133), so the design uses no OR.
10. **Coherence first** (Howie's rule): nothing in the prologue may contradict what the origin's first ~10 nodes say. §5 lists every known hazard.

---

## 2. Final matrix

Class × faction → origin (start node). ★ = gated by a prologue flag. "—" = deliberately not reachable.

| | imperium | chaos | tau | orks | aeldari | necrons | mechanicus | gsc |
|---|---|---|---|---|---|---|---|---|
| **low** | hive `imp_101` | deserter `cha_o_deserter_1` | pow `tau_o_pow_1` | ★guard `ork_o_guard_1` | — | ★convict `nec_o_convict_1` | ★menial `mech_101` · ★conscript `mech_o_conscript_1` | ★miner `gsc_101` |
| **mid** | agri `imp_o_agri_1` | scavenger `cha_101` | colonist `tau_101` | ★scrap `ork_101` | ★trooper `eld_o_trooper_1` · ★pilgrim `eld_o_pilgrim_1` | — | — | — |
| **up** | noble `imp_o_noble_1` | scribe `cha_o_scribe_1` | trader `tau_o_trader_1` | — | — | ★archivist `nec_101` · ★lexmech `nec_o_lexmech_1` | ★savant `mech_o_savant_1` | — |

Totals: **20 doors, 20 distinct origins, each reached from exactly one class.** 17 of 24 class × faction pairs. Each new faction is reachable: orks (low, mid), aeldari (mid), necrons (low, up), mechanicus (low, up), gsc (low).

**Why each new pair works:**
- low → **orks/guard**: the veteran tells you about a third posting, the Aurex company that guards Iskaron's breaker docks ("no bounty, no fighting, just a gate"). Months later the Waaagh! lands on that gate (`place_iskaron`, 112).
- low → **gsc/miner**: Kessin ore goes to Aurex's factories (`place_kessin`, `gsc_101`); the Endurance's mate signs miners in a dockside bar. Shaft Nine is short-handed and pays double at the deep face (Gant's offer in `gsc_b02`).
- low → **necrons/convict**: a supply-ship purser hires hold-hands "paid on arrival". On Thessa Null your wages are less than your bunk; Sergeant Kaal's count is one convict short. You take the dead man's shackle (the same mechanism as `nec_b02/b04`).
- low → **mechanicus/menial, conscript**: Manufactorum Six owes Gravex hands. Gravex ships lasguns to Aurex (`mech_209`) and takes workers back. On landing the levy is sorted into the furnace line or the Skitarii lot-drum (`mech_b03`).
- mid → **orks/scrap**: the salvage boss sells scrap in Carcharos and buys parts on Iskaron. If you helped him load, he gives you a note to an old stallholder in the ship-bone market.
- mid → **aeldari/trooper**: a supply ship bound for Valda takes on stores at the ash-plain grain depot. Its escort sergeant (the same "押船的军士" as `eld_b02`) needs drilled hands because the Guard tithe took half of Third Company.
- mid → **aeldari/pilgrim**: at the same depot, Valdan seasonal hands describe wheat to the horizon and black stones in the fields. It is the field from your recurring dream. You buy a corner of the hold.
- up → **mechanicus/savant**: House Serrin owes the Cult for spire power and for the lease of the counting-room cogitator. The Cult's debt-collector takes payment in kind: a mind that counts, ten years on Gravex (`mech_o_savant_1`: "抵债：你的脑子，十年").
- up → **necrons/lexmech**: the house fitted you with a skull socket at twelve so you could run that cogitator instead of paying a clerk. The collector has a dead scribe's transferable contract, Magos Vektrix-9's on the Thessa Null dig (29 years left, `nec_o_lexmech_1`).
- up → **necrons/archivist**: Professor Marrow comes to beg House Serrin for money for her dig. The house has none, but she sees you can write and draw: no wages, meals (`nec_b03`).

**Why the gaps:**
- **eld/agri, gsc/warden, gsc/kin, orks/ganger**: these origins are birth-bound. agri has a sister and parents on Valda; warden's mother is Marr; kin was born a Hollin hybrid (`carrier`); ganger grew up in the Rustfang gang ("你从小饿到大"). All four stay reachable through 预选势力.
- **low × aeldari**: the only Valda link is the grain depot on the ash plains (the farm class's world). Low already has 4 roads (cap).
- **mid × necrons / mechanicus / gsc**: farm families pay their tithe in grain, not in bodies or debts to the Cult. No dig or ore ship touches the ash plains.
- **up × orks / aeldari / gsc**: a spire heir has no reason to hawk scrap, garrison a breaker yard, dig ore or ride a harvest ship. up × aeldari/pilgrim would be possible but would need a second pilgrim bridge and a fix of `eld_601a` ("父亲说过，好土会咬手指" fits a farmer father, not a spire lord). Not worth it.

---

## 3. Node map of the new `data/universal.js`

26 nodes, all `chapter: 1`. Status: **keep** = unchanged · **chg** = changed (listed exactly) · **new**.
Roles: **ROAD** = the class's last decision node (doors and roads); **SUB** = sub-door (only doors). Door depth from the ROAD is ≤ 2.

### 3.1 Cast (sprite keys that exist in `assets/manifest.js`)

| var | sprite | zh | en | status | first appears / introduced in |
|---|---|---|---|---|---|
| GRUSK | `hive_foreman` | 格鲁斯克监工 | Overseer Grusk | keep | u_low_1 |
| VOX | `servitor` | 广播伺服 | Vox-servitor | keep | u_b02 |
| RECRUIT | `guard_sergeant` | 征兵中士 | Recruiting Sergeant | keep | u_low_2 |
| VETERAN | `guardsman` | 断腿老兵 | One-legged Veteran | keep | u_low_2v or u_low_door (both name him in narration) |
| SALVAGE | `hive_foreman` | 拾荒队长 | Salvage Boss | keep | u_mid_2 |
| DEACON | `preacher` | 教会执事 | Church Deacon | keep | u_up_2 |
| **LEVY** | `tech_priest` | 征调神甫 | Levy-Priest | new | narration in u_low_1 ("一个红袍的征调神甫…"); speaks in u_low_1m, u_low_levy |
| **MATE** | `hive_foreman` | “忍耐号”的大副 | Mate of the Endurance | new | u_low_2d ("凯辛矿船'忍耐号'的大副…"); u_low_ship |
| **ESCORT** | `guardsman` | 押船的军士 | Escort Sergeant | new here; **same spelling as aeldari.js:60** | u_mid_2v ("瓦尔达星防卫军押船的军士…"); u_mid_valda |
| **MARROW** | `dig_leader` | 玛罗教授 | Professor Marrow | new here; **same spelling as necrons.js:35** | u_up_2m (she names herself) |
| **CULT** | `tech_priest` | 神教收债人 | Cult Debt-Collector | new | narration in u_up_1c (the steward says he comes tonight); speaks in u_up_cult |

Narration-only (no speaker tag; name them in plain words): Mother, Father (low/mid), the old steward (up), the labour-ship captain, the assessor, a supply-ship purser (事务长), Valdan seasonal hands. **Do not show** the elder brother (up) or any named family member.

### 3.2 Flags (all set on the **choice** that leads into the meeting node)

| flag | set at | opens | also read by |
|---|---|---|---|
| `class_low/mid/up` | u_b03 (keep) | — | (engine / records) |
| `u_low_grusk` | u_low_1 [0] | nothing (colour) | resultAlt of u_low_3 [0] (hive door) |
| `u_low_forge` | u_low_1 [1] | road u_low_3 [3] → menial, conscript | add on u_low_3 |
| `u_low_vet` | u_low_2 [0] | u_low_door [2] → guard | add on u_low_door |
| `u_low_docks` | u_low_2 [1] | road u_low_3 [2] → miner, convict | adds on u_low_3, u_low_door |
| `u_mid_valda` | u_mid_1 [1] | road u_mid_door [2] → trooper, pilgrim | add on u_mid_door |
| `u_mid_scrap` | u_mid_2 [1] | u_mid_road [2] → scrap | add on u_mid_door |
| `u_up_cult` | u_up_1 [1] | road u_up_door [2] → savant, lexmech | add on u_up_door |
| `u_up_dig` | u_up_2 [1] | u_up_go [2] → archivist | add on u_up_door |
| `u_door` | every door (helper `D`, keep) | — | — |

`u_low_vet` and `u_low_docks` are mutually exclusive (one fork). All other gates are independent.

### 3.3 Graph

```
u_b01 ─0→ u_b02 ─0→ u_b03 ─┬0 [class_low]→ u_low_1
                            ├1 [class_mid]→ u_mid_1
                            └2 [class_up] → u_up_1

LOW
u_low_1 ─┬0 [u_low_grusk]→ u_low_2
         └1 [u_low_forge]→ u_low_1m ─0→ u_low_2
u_low_2 ─┬0 [u_low_vet]  → u_low_2v ─0→ u_low_3
         └1 [u_low_docks]→ u_low_2d ─0→ u_low_3
u_low_3 (ROAD) ─┬0 DOOR imperium/hive          → imp_101
                ├1 → u_low_door (SUB) ─┬0 DOOR chaos/deserter → cha_o_deserter_1
                │                      ├1 DOOR tau/pow        → tau_o_pow_1
                │                      └2 DOOR orks/guard     → ork_o_guard_1        req u_low_vet
                ├2 → u_low_ship (SUB) ─┬0 DOOR gsc/miner      → gsc_101               (road req u_low_docks)
                │                      └1 DOOR necrons/convict→ nec_o_convict_1
                └3 → u_low_levy (SUB) ─┬0 DOOR mechanicus/menial    → mech_101        (road req u_low_forge)
                                       └1 DOOR mechanicus/conscript → mech_o_conscript_1

MID
u_mid_1 ─┬0 → u_mid_2
         └1 [u_mid_valda]→ u_mid_2v ─0→ u_mid_2
u_mid_2 ─┬0 → u_mid_door
         └1 [u_mid_scrap]→ u_mid_2s ─0→ u_mid_door
u_mid_door (ROAD) ─┬0 DOOR imperium/agri → imp_o_agri_1
                   ├1 → u_mid_road (SUB) ─┬0 DOOR chaos/scavenger → cha_101
                   │                      ├1 DOOR tau/colonist    → tau_101
                   │                      └2 DOOR orks/scrap      → ork_101           req u_mid_scrap
                   └2 → u_mid_valda (SUB)─┬0 DOOR aeldari/trooper → eld_o_trooper_1  (road req u_mid_valda)
                                          └1 DOOR aeldari/pilgrim → eld_o_pilgrim_1

UP
u_up_1 ─┬0 → u_up_2
        └1 [u_up_cult]→ u_up_1c ─0→ u_up_2
u_up_2 ─┬0 → u_up_door
        └1 [u_up_dig] → u_up_2m ─0→ u_up_door
u_up_door (ROAD) ─┬0 DOOR imperium/noble → imp_o_noble_1
                  ├1 → u_up_go (SUB)  ─┬0 DOOR chaos/scribe     → cha_o_scribe_1
                  │                    ├1 DOOR tau/trader       → tau_o_trader_1
                  │                    └2 DOOR necrons/archivist→ nec_101             req u_up_dig
                  └2 → u_up_cult (SUB)─┬0 DOOR mechanicus/savant → mech_o_savant_1   (road req u_up_cult)
                                       └1 DOOR necrons/lexmech   → nec_o_lexmech_1
```

Counts: birth 3 · low 9 · mid 7 · up 7 = **26 nodes**. A run sees 8–10 universal nodes (was 6). There are no click-through fillers: every new node either holds a fork or is a meeting that opens doors.

### 3.4 Node specs

Format: id · status · scene · speaker. **Beats** = what the text must contain (facts are binding, wording is the writer's). **Must not** = forbidden content. Choices: `[i] zh / en → next {effects} {require}`. A door is written `D(...)` with the existing helper.

**Birth (all keep):** `u_b01`, `u_b02`, `u_b03`. No change. (Rule 7: they precede the GSC door. They are already timeless.)

#### LOW — Tower Three hab-block and Manufactorum Six

**u_low_1** · chg (text + choices) · `manufactorum` · GRUSK
- Beats: keep Grusk's roll call and "名单念到谁，我就少一个人，配额照旧。今天，加班。" Add in narration a red-robed **征调神甫** behind Grusk, counting hands for the forge world (do not explain more here). ≤ 90 zh.
- `[0]` 低头加班，直到收工 / Keep your head down and work the overtime → u_low_2 `{set:{u_low_grusk:true}}`
- `[1]` 替神甫把名册送到厂门口 / Carry the priest's roll to the factory gate → u_low_1m `{set:{u_low_forge:true}}`

**u_low_1m** · new · `manufactorum` · LEVY
- Beats: at the gate the 征调神甫 explains, flat and exact: Gravex's guns come to Aurex and hands go back; Manufactorum Six owes its share to the **Seventh Furnace (第七熔炉)**; on landing the levy is sorted into two lines, the furnace tags or the Skitarii lot-drum; volunteers sail first. Show him valuing people as parts (e.g. he checks your grip like a tool).
- Must not: years; Valda; Thessa.
- `[0]` 收工，回居住块 / Clock off and head back to the hab-block → u_low_2

**u_low_2** · chg (choices only) · `hive_hab` · RECRUIT — text unchanged.
- `[0]` 在桌边站到天黑 / Stand by the table till dusk → u_low_2v `{set:{u_low_vet:true}}`
- `[1]` 下楼，去码头酒馆 / Go down to the dockside bar → u_low_2d `{set:{u_low_docks:true}}`

**u_low_2v** · new · `hive_hab` · VETERAN
- Beats: introduce the **断腿老兵** in narration (smoke, the stump). He tells how he lost the leg (greenskins; name no world, no year). He gives one tip nobody wants: an Aurex company is being sent to **guard the breaker docks of 伊斯卡隆 Iskaron**. "No bounty, no fighting, just a gate." Dramatic irony; don't wink.
- `[0]` 天黑了，回家 / Night falls; go home → u_low_3

**u_low_2d** · new · `underhive` · MATE
- Beats: a dockside bar by the cargo lifts. Introduce **凯辛矿船“忍耐号”的大副** signing miners for **九号矿井 Shaft Nine** ("缺人，最深处给双倍工分", free passage paid off in ore). At the next table a supply-ship **事务长** hires hold-hands for "卡尔卡罗斯港和更远的地方", "到港结清". Nobody asks questions.
- Must not (rule 7): Thessa Null, the dig, any year. Don't name Gant (optional; if you do, spell 甘特工头).
- `[0]` 喝完这杯，回家 / Finish your cup and go home → u_low_3

**u_low_3** · new · ROAD · `hive_hab` · null
- Beats: night at home, the last night before the draw. An unnamed mother or the family round one lamp; tomorrow the list comes down. Short, heavy. ≤ 90 zh.
- Adds (≤ 45 zh each): `{flag:"u_low_forge"}` 征调神甫说过，征调船后天开。 · `{flag:"u_low_docks"}` “忍耐号”天亮前离港。
- `[0]` **D** 不签了，等明天的名单 / Sign nothing; wait for tomorrow's list → `imp_101` imperium/hive. `result` = the existing one ("你把工牌塞回领口。明天，名单就下来了。"). `resultAlt` `{flag:"u_low_grusk"}`: one line in which Grusk's overtime remark comes back (e.g. he said overtime hands are "his"). ≤ 90 zh.
- `[1]` 回楼梯间，征兵桌还没收 / Back to the stairwell; the table's still out → u_low_door
- `[2]` 去码头，找“忍耐号” / Go to the docks and find the Endurance → u_low_ship `{require:{flag:"u_low_docks"}, hideIfLocked:true}`
- `[3]` 去厂门口，找征调神甫 / Go to the factory gate and the Levy-Priest → u_low_levy `{require:{flag:"u_low_forge"}, hideIfLocked:true}`

**u_low_door** · chg (choices + adds; text unchanged) · SUB (army) · `hive_hab` · VETERAN
- Text: keep. It names the veteran in narration (needed by the flag-blind audit).
- Adds: `{flag:"u_low_vet"}` 老兵还在原地，像是在等你。 · `{flag:"u_low_docks"}` 你从码头回来，征兵桌还没收。
- `[0]` **D** deserter: label, target and result unchanged (`签线列团，领厚赏钱` → `cha_o_deserter_1`)
- `[1]` **D** pow: unchanged (`签驻防团，去海湾边守着` → `tau_o_pow_1`)
- `[2]` **D** 签船坞连队，去伊斯卡隆 / Sign for the dock company bound for Iskaron → `ork_o_guard_1` orks/guard `{require:{flag:"u_low_vet"}, hideIfLocked:true}`. Result: no bounty, only an old greatcoat; the veteran nods, "a gate job beats digging graves".
- (The old hive door `不签，回家等抽签` moves to u_low_3 [0] with a new label.)

**u_low_ship** · new · SUB · `ship_interior` · MATE
- Beats: before dawn at the Endurance's ramp; the mate (named in text) ticks names; the purser's ship loads two berths down.
- `[0]` **D** 上“忍耐号”，去凯辛挖矿 / Board the Endurance and go dig on Kessin → `gsc_101` gsc/miner. Result: the mate stamps a mining-board mark on your hand; "九号井缺人，最深处给双倍工分。"
- `[1]` **D** 签舱工合同，跟补给船走 / Sign on as a hold-hand on the supply ship → `nec_o_convict_1` necrons/convict. Result: the purser folds the contract, "到港结清。" and smiles too politely.

**u_low_levy** · new · SUB · `manufactorum` · LEVY
- Beats: the factory gate before dawn; the Levy-Priest (named) at a cogitator lectern; two chalk lines on the floor: furnace / lot-drum. "Choose your line now; on Gravex there is no time."
- `[0]` **D** 站进熔炉的队 / Stand in the furnace line → `mech_101` mechanicus/menial. Result: he scans your wrist; "劳力。编号到港分配。"
- `[1]` **D** 站进签筒的队 / Stand in the lot-drum line → `mech_o_conscript_1` mechanicus/conscript. Result: his lens pauses; "自愿抽签者，记录在案。"

#### MID — Dome Farm Seven on the ash plains

**u_mid_1** · chg (choices only) · `jungle` · null — text unchanged (Father tapes the crack: the tape errand follows from it).
- `[0]` 扶好梯子，再去灰烬路口 / (keep) → u_mid_2
- `[1]` 替父亲去粮站换胶带 / Go to the depot for Father's tape → u_mid_2v `{set:{u_mid_valda:true}}`

**u_mid_2v** · new · `ship_interior` · ESCORT
- Beats: the ash-plain grain depot / landing pad. A **supply ship bound for 瓦尔达 Valda** takes on stores and Valdan seasonal hands going home. Its escort, a **瓦尔达星防卫军押船的军士** (named in narration), has an enlistment sheet: the Guard tithe took half of Third Company; "练过民兵的，签个名，管饭，有饷." (Dome-farm youths drill in the plains militia.) A seasonal hand says Valda's wheat runs to the horizon and black old stones stand in the fields. **You go cold: you have seen that field in a dream for years**, the one that leaves blood under your nose (no number of years).
- Must not: "tower silent", "no grain ships this year", any year, the sister. Do not call it a tithe/grain-collection ship: it is a **补给船** (supply ship).
- `[0]` 揣好胶带，去灰烬路口 / Pocket the tape; walk on to the ash road → u_mid_2

**u_mid_2** · chg (choices only) · `ruins` · SALVAGE — text unchanged (it introduces the boss and the labour-ship captain).
- `[0]` 回农庄吃晚饭 / (keep) → u_mid_door
- `[1]` 帮拾荒队装车 / Help the salvage crew load → u_mid_2s `{set:{u_mid_scrap:true}}`

**u_mid_2s** · new · `ruins` · SALVAGE
- Beats: loading with the **拾荒队长** (named). He pays in counted strips of dried meat; he sells in Carcharos's underhive and buys parts in the ship-bone market of **伊斯卡隆 Iskaron**, the breaker world: "a sharp kid with a stall can live there". He scrawls a note to an old stallholder he knows (no name).
- Must not: the Waaagh!, years.
- `[0]` 揣着干肉和条子回家 / Head home with the meat and the note → u_mid_door

**u_mid_door** · chg (choices + adds; text unchanged) · ROAD · `jungle` · null
- Adds: `{flag:"u_mid_valda"}` 粮站那条去瓦尔达的船，后天开。 · `{flag:"u_mid_scrap"}` 队长给的条子，还在你兜里。
- `[0]` **D** agri: unchanged (`留下，等税官上门` → `imp_o_agri_1`, same result)
- `[1]` 趁天没黑，再去灰烬路口 / Back to the ash road before dark → u_mid_road
- `[2]` 去粮站，找瓦尔达的船 / Go to the depot and the Valda ship → u_mid_valda `{require:{flag:"u_mid_valda"}, hideIfLocked:true}`
- (The scavenger and colonist doors move to u_mid_road, labels and results unchanged.)

**u_mid_road** · new · SUB · `ruins` · SALVAGE
- Beats: dusk on the ash road. The salvage crew ties down the last wagon to leave at dawn; the labour-ship captain folds his contract slate (his ship waits only till dark). Name the boss in narration.
- `[0]` **D** scavenger: unchanged label/result (`跟拾荒队上灰烬路` → `cha_101`)
- `[1]` **D** colonist: unchanged label/result (`在招工船的合同上按手印` → `tau_101`)
- `[2]` **D** 拿着队长的条子去伊斯卡隆 / Take the boss's note to Iskaron → `ork_101` orks/scrap `{require:{flag:"u_mid_scrap"}, hideIfLocked:true}`. Result: the boss puts you on a scrap freighter; "到了船骨市场，找老摊主。"

**u_mid_valda** · new · SUB · `ship_interior` · ESCORT
- Beats: the depot pad; the escort sergeant (named) holds the sheet out; the Valdan hands pass a flask; the ship leaves in two days.
- `[0]` **D** 在军士的单子上签名 / Sign the sergeant's sheet → `eld_o_trooper_1` aeldari/trooper. Result: he folds the sheet into his breast pocket; you'll have a uniform the day you land.
- `[1]` **D** 不签，买一个货舱角落 / Don't sign; buy a corner of the hold → `eld_o_pilgrim_1` aeldari/pilgrim. Result: you give the crew everything you saved; the field from the dream is where this ship is going. **No work contract** (the pilgrim must arrive free; see §5).

#### UP — House Serrin, spire level ninety

**u_up_1** · chg (choices only) · `hive_spire` · null — text unchanged.
- `[0]` 接过笔，替他抄完 / (keep) → u_up_2
- `[1]` 翻到红字最多的那一页 / Turn to the page with the most red → u_up_1c `{set:{u_up_cult:true}}`

**u_up_1c** · new · `hive_spire` · null
- Beats: the red lines. The biggest is **the governor's tithe** (must stay the main debt; see `imp_o_noble_1/2`). A second is owed to **the Cult (机械神教)**: spire power and the lease of the counting-room's old cogitator. You touch the **socket behind your ear**: the house had it fitted when you were twelve so you could run that cogitator instead of paying a clerk. The steward, quietly: the Cult's **收债人** comes tonight too.
- Must not: the brother; years.
- `[0]` 合上账本，去前厅 / Close the ledger; go to the antechamber → u_up_2

**u_up_2** · chg (text rewrite + choices) · `hive_spire` · DEACON
- Rewrite ≤ 90 zh. Keep: two visitors; the **教会执事** praises **"你案头的字"** (neutral: it fits both the decree copy and the ledger notes) and says the Carcharos scriptorium is short of copyists, rule "抄一份存档，原本烧掉" (`cha_o_scribe_1` quotes it); a captain in a worn coat pushes unsealed manifests across the table. Add: **a scholar has been waiting downstairs all afternoon** to ask the house for money.
- `[0]` 送走客人，回账房 / (keep) → u_up_door
- `[1]` 下楼，见那位等了一下午的学者 / Go down to the scholar who's waited all afternoon → u_up_2m `{set:{u_up_dig:true}}`

**u_up_2m** · new · `hive_spire` · MARROW
- Beats: she introduces herself as **玛罗教授** and wants a patron for a dig on a dead world at the sector's edge (you may name 忒萨零号 Thessa Null). She sees at once there is no money here and haggles like a merchant anyway. She looks at your handwriting or drawings: "I can't pay. I can feed you." She leaves the sailing time.
- Must not: her later lines (`nec_102` "你的名字会进脚注", `nec_102a` "学问也要吃饭的"); years; the Cult sponsorship.
- `[0]` 送她出门，回账房 / See her out; back to the counting-room → u_up_door

**u_up_door** · chg (choices + adds; text unchanged) · ROAD · `hive_spire` · null
- Adds: `{flag:"u_up_cult"}` 还有第四样：神教收债人的名片，背面压着一个齿轮。 · `{flag:"u_up_dig"}` 账本里夹着教授留下的开船时刻。
- `[0]` **D** noble: unchanged (`去书房，陪父亲喝酒` → `imp_o_noble_1`, same result)
- `[1]` 天亮前，带上荐信和货单去码头 / Before dawn, take the letter and manifests to the dock → u_up_go
- `[2]` 去前厅，见神教的收债人 / Go to the antechamber: the Cult's collector → u_up_cult `{require:{flag:"u_up_cult"}, hideIfLocked:true}`

**u_up_go** · new · SUB · `hive_spire` · null
- Beats: the spire's dock before dawn; the Church packet ship to Carcharos; the captain's unregistered ship; **the family seal is in your coat** (the trader door stamps with it). Write no speaker tag.
- `[0]` **D** 登上教会的班船 / Board the Church packet ship → `cha_o_scribe_1` chaos/scribe. Result: the existing one ("你随教会的班船离开奥雷克斯，去卡尔卡罗斯。赛伦家后来再没来过信。")
- `[1]` **D** trader: label and result unchanged (`替船长盖下那一枚章` → `tau_o_trader_1`)
- `[2]` **D** 上玛罗教授的考察船 / Board Professor Marrow's expedition ship → `nec_101` necrons/archivist `{require:{flag:"u_up_dig"}, hideIfLocked:true}`. Result: she pushes a sketchbook and a lamp at you: no wages, meals.

**u_up_cult** · new · SUB · `hive_spire` · CULT
- Beats: night, antechamber. The **神教收债人** (named): payment in kind clears the house's **Cult** arrears (not the governor's). Two contracts: the counting floors of **格拉维克斯 Gravex** for a mind that counts, ten years; or a magos on a dig needs a new scribe, his last died of data-burn, the contract is transferable and your socket fits. Lore: he reads you like an inventory.
- `[0]` **D** 把欠款一笔笔背给他听 / Recite the whole debt back to him → `mech_o_savant_1` mechanicus/savant. Result: his lens turns; "可用。格拉维克斯的计数台，十年。"
- `[1]` **D** 把耳后的插口转给他看 / Turn the socket behind your ear to him → `nec_o_lexmech_1` necrons/lexmech. Result: he touches it with a probe; "兼容。合同还剩二十九年，可以转让。"

### 3.5 Reachability: destinations per flag state

| class | flag state | doors visible | n |
|---|---|---|---|
| low | grusk + vet | hive, deserter, pow, guard | 4 |
| low | grusk + docks | hive, deserter, pow, miner, convict | 5 |
| low | forge + vet | hive, deserter, pow, guard, menial, conscript | 6 |
| low | forge + docks | hive, deserter, pow, miner, convict, menial, conscript | 7 |
| mid | — | agri, scavenger, colonist | 3 |
| mid | scrap | + scrap | 4 |
| mid | valda | + trooper, pilgrim | 5 |
| mid | valda + scrap | all 6 | 6 |
| up | — | noble, scribe, trader | 3 |
| up | dig | + archivist | 4 |
| up | cult | + savant, lexmech | 5 |
| up | cult + dig | all 6 | 6 |

Every ROAD shows ≥ 2 choices (low: hive + army; mid: agri + ash road; up: noble + dock). Every SUB shows ≥ 2 doors in every state that can reach it (gated roads lead only to SUBs whose doors are ungated; gated doors are always the 3rd entry beside 2 ungated). Every flag state has ≥ 3 destinations. All 8 factions are reachable.

---

## 4. New characters & introductions (§37.9)

| character | where introduced | how |
|---|---|---|
| 征调神甫 / Levy-Priest | u_low_1 (narration) | "a red-robed 征调神甫 behind Grusk counting hands". u_low_1m and u_low_levy name him again in their own text. |
| 断腿老兵 (keep) | u_low_2v **and** u_low_door | narration names him in both (players on the docks path meet him first in u_low_door) |
| “忍耐号”的大副 / Mate of the Endurance | u_low_2d | narration: "凯辛矿船'忍耐号'的大副" + what he wants; u_low_ship names him again |
| 事务长 (purser) | u_low_2d | narration only, never a speaker |
| 押船的军士 / Escort Sergeant | u_mid_2v | narration: "瓦尔达星防卫军押船的军士"; u_mid_valda names him again |
| Valdan seasonal hands | u_mid_2v | narration only |
| 拾荒队长 (keep) | u_mid_2 (existing), named again in u_mid_2s and u_mid_road | |
| 神教收债人 / Cult Debt-Collector | u_up_1c (the steward announces him) | u_up_cult names him in its own text (audit is flag-blind: u_up_door → u_up_cult is an edge even without u_up_1c) |
| 玛罗教授 / Professor Marrow | u_up_2 mentions "a scholar downstairs"; u_up_2m: self-introduction | |
| old steward, Father, Mother, the captain, the assessor | existing narration | unchanged |

Entry nodes in the faction files that need an introduction inside the alt (because the universal player never saw that route's birth): Sergeant **Voss** (`ork_o_guard_1`), **Edda** (`eld_o_trooper_1`), **Magos Vektrix-9** (`nec_o_lexmech_1`), Gravex's **债务官** (`mech_o_savant_1`), **Kesh-43 Alpha** (`mech_o_conscript_1`), **Tobin** (`mech_101`, via an add). See §5.

---

## 5. Per-leaf bridge spec

Every door: `D(label_zh, label_en, <startNode>, <faction>, <origin>, result)`. Every entry alt goes in the **faction file**, on the origin's start node, as a **text** alt `{if: {flag: "born_universal"}, text: L(zh, en)}` (or the file's `ALT(F("born_universal"), …)` helper). One alt per origin is enough: each origin is reached by exactly one class. Put it next to the existing `born_shared` alt; the two flags are never set together, so their order doesn't matter. Keep ≤ 90 zh / ≤ 65 EN. No year, no time of day. Hazards are marked **MUST FIX** or **AVOID BY WORDING**.

### 5.1 The 9 existing doors: unchanged

hive, deserter, pow, agri, scavenger, colonist, noble, scribe, trader. Writer B **does not touch** `imperium.js`, `chaos.js`, `tau.js`. I checked each existing `born_universal` alt against its new door scene; all still hold:
- `imp_101` "昨晚你没在征兵桌上留名" (the door is now on u_low_3 at night ✓)
- `cha_o_deserter_1` "三周前…翻了转运港的闸" ✓ · `tau_o_pow_1` "入伍一年" ✓
- `imp_o_agri_1` "一夜过去" ✓ · `cha_101` "拾荒队卖光了废铁就散了伙…熬了半年" ✓ · `tau_101` "已有半年" ✓
- `imp_o_noble_1` "今晚，父亲第一次请你喝酒" ✓ (time-of-day: pre-existing, §8 R2) · `cha_o_scribe_1` "一晃十一年" ✓ · `tau_o_trader_1` "半年前…替船长盖章挣的钱" ✓ (the seal is carried to u_up_go)

Because the prologue is undated and the clock starts at the faction date (111.M42) at the door, "半年 / 三周 / 一年 / 十一年" no longer contradict the HUD. **Howie's "半年后" complaint is fixed by the clock change, not by rewriting.**

Writer A only changes the labels of hive (`不签了，等明天的名单`) and scribe (`登上教会的班船`), because their scenes moved. Their results stay.

### 5.2 The 11 new doors

**(1) low → orks/guard** · door `u_low_door[2]` · target `ork_o_guard_1` (orks start 112)
- Alt establishes: your Aurex company was shipped to Iskaron to guard the breaker docks, **months** ago; you're in **沃斯中士 Sergeant Voss**'s platoon (introduce him: "排里的沃斯中士…"); the veteran's "just a gate" in one bitter half-line (optional); then the base beat: Voss chews tobacco and watches the green on the horizon, "兽人，别想着赢…", the first rock lands three kilometres off.
- Must not contradict: base "你是星界军的列兵，驻守伊斯卡隆的船坞" (✓ same fact); later `ork_404` "我以为整个排都没了" (Voss's platoon ✓); choice "给家里写最后一封信" (home = Aurex ✓). **AVOID BY WORDING:** don't use the §35 "手印还没干" (you enlisted months ago); not born on Iskaron.

**(2) low → gsc/miner** · `u_low_ship[0]` · `gsc_101` (gsc start **100**)
- Alt: weeks in the Endurance's ore hold → Kessin Tertius, Shaft Nine; the foreman gives you a tally token; your first shift two thousand metres down; the ore goes up the lift to Aurex's factories (you have handled it at Manufactorum Six, optional); end on the lamp.
- **MUST FIX:** base "你没有家人。" The player has family on Aurex → "在这颗星上，没人在井口等你下班。你的灯，是你唯一的朋友。" **AVOID:** "十年" (card text only); "当天夜班" (time of day) → "第一个班". Gant may be named as 甘特工头 (he is introduced again by `gsc_104`'s own text).
- Later: `gsc_503` Reyes's "你家里人，怎么一点也不慌？" means the Hollins ✓; `gsc_end_seed` (the Endurance reaches Aurex: "你在下巢找了份活") works. *Optional nice-to-have:* add `{flag:"born_universal"}` "你又回到了出生的巢都。" (≤ 45 zh).

**(3) low → necrons/convict** · `u_low_ship[1]` · `nec_o_convict_1` (113)
- Alt: **months** as a hold-hand; at Thessa Null the purser does the sums, you owe more for the bunk than you earned and the lander takes no debtors back; on the pad Sergeant **卡尔 Kaal**'s convict count is one short (a dead man under a blanket); shackle **4471** goes on your ankle; "挖满十年，刑期勾销" is now yours; end on "第一铲下去，沙子底下是金属。"
- **MUST FIX:** base "卡尔卡罗斯的总督把一整船犯人卖给了考察队" implies you were a Carcharos convict → use "总督按人头卖犯人" (as §35 does). **AVOID:** inventing a crime. Later: `nec_708` "4471后面写着'逃逸'" ✓. (Records will show the origin world Carcharos: §8 R6.)

**(4) low → mechanicus/menial** · `u_low_levy[0]` · `mech_101` (113)
- Alt: **weeks** on the levy ship from Aurex; Gravex, red sky, iron in the rain (optional); the Seventh Furnace registry gives you a meal ticket and an **old number G7-2291** whose last wearer collapsed by the furnace yesterday; the record goes with the number: two reds; three reds = the conversion line.
- **MUST FIX:** Tobin. The choice "去配给队列找咳嗽的托宾" names him before `mech_103` introduces him; the §35 path fixes this with `ADD(F("born_shared"), "带你的老杂役叫托宾…")`. Add the same add for `born_universal` (or change its condition to `{anyFlag:["born_shared","born_universal"]}`).
- **AVOID:** "榜上划掉了你家的名字" (that's a Gravex family debt). `place_gravex` "你的家" clash: §8 R3.

**(5) low → mechanicus/conscript** · `u_low_levy[1]` · `mech_o_conscript_1` (113)
- Alt: the levy ship lands; the square with the brass lot-drum; you put your hand in, the cog; **凯什-43阿尔法 Alpha Kesh-43** (named) takes you straight to the barracks; ten-minute surgery, a socket at the nape; the wafer; "恐惧已关闭…以后由我决定你什么时候怕。"
- **AVOID:** "阿尔法没让你回家" (you have no home on Gravex) → "没让你歇脚". The `drewForBoy` add never fires (flag only set by `mech_b03`) ✓.

**(6) mid → orks/scrap** · `u_mid_road[2]` · `ork_101` (112)
- Alt: the boss's note got you onto a scrap freighter to Iskaron; the old stallholder took you on, and **within months** the stall between the ship-bones was yours: copper wire, valves, **a crate of servo-motors** (needed: choice "先抱起最值钱的那箱货" refers to it). "日子不坏." Then the sky turns green; rocks with engines; the rocks laugh.
- **AVOID:** "半夜" (the §35 alt uses it) → "那天"; Iskaron native; naming the stallholder Magda (`ork_b03`; universal players never met her). Later: `ork_102` the Valda tithe-ship wreck "没飞到奥雷克斯二号" ✓.

**(7) mid → aeldari/trooper** · `u_mid_valda[0]` · `eld_o_trooper_1` (113)
- Alt: **weeks** later the supply ship comes down on Valda; **the day you land** you're issued a uniform and pushed into Third Company's barracks; cards on an ammo crate; the old hands boast that the worst enemy they ever faced is grain rats (**their** boast, not your life); **女兵埃达 Edda** (introduce) deals you in: the tower's been silent three days, "小故障要派两个人带枪去看？"
- **AVOID:** "下午"; "你们这辈子最大的敌人" as the player's own past. No sister: Nell first appears in `eld_o_trooper_5` as the billet family's daughter ✓.
- Later (**should fix**, 1 line): `eld_o_trooper_5` alt `{flag:"born_shared"}` ("连队这两天借住的那户农家…昨天下午你给她削过一个木头小兵") is the right text for any newcomer → change its condition to `{anyFlag:["born_shared","born_universal"]}` (helper `ANYF` exists in aeldari.js).

**(8) mid → aeldari/pilgrim** · `u_mid_valda[1]` · `eld_o_pilgrim_1` (113)
- Alt: the hold is packed with seasonal hands going home and a flask goes round; you paid your way, **no contract**; **十年了**, the same dream every night, the white-robed woman with stones turning round her head (the prologue said "for years", so ten is consistent); you wipe blood from under your nose; telling them would only make you the madman; the light turns red: landing.
- **MUST FIX by wording:** later the pilgrim preaches at the field's edge and sleeps in Nell's family's barn (`eld_o_pilgrim_2`), so the alt must not give you a job, a contract or a farm to go to. Keep "十年" (`eld_203p` "这十年，是我"; `eld_405` "这十年的梦"). No sister.

**(9) up → necrons/archivist** · `u_up_go[2]` · `nec_101` (113)
- Alt: **weeks** on the expedition ship; you draw the first page of the sketchbook: the dunes outside the landing pad lie in neat rows, as if swept daily; no wind, no moss, not even bacteria; the lander lifts off; you stand at the camp's edge with **the lamp the Professor gave you**.
- **AVOID:** the "footnote" line (it belongs to `nec_102`); years. `nec_102` (Marrow pushes a slab at you) and `nec_102a` read fine for someone she already hired.

**(10) up → necrons/lexmech** · `u_up_cult[1]` · `nec_o_lexmech_1` (113)
- Alt: the Cult's ship to Thessa Null; **维克崔斯-9贤者 Magos Vektrix-9** (named) plugs his data-cable into **the old socket House Serrin had fitted** behind your ear; the dead scribe's contract: thirty years, twenty-nine to go; you are his indentured scribe; "记录，今天，我们发现一位神。"
- Must agree with: `nec_701` "合同还剩二十九年" ✓. **AVOID:** Mechanicus birth.

**(11) up → mechanicus/savant** · `u_up_cult[0]` · `mech_o_savant_1` (113)
- Alt: on Gravex, **格拉维克斯的债务官** (introduce him: the clerk who files your contract) looks at you like a man pricing a cogitator; three years of scholam, four thousand digits; he draws a cog beside the name Serrin; House Serrin's arrears with the Cult are cleared; "抵债：你的脑子，十年。"
- **MUST FIX:** base "你在格拉维克斯的居住尖塔长大…家里欠了神教的电费" → replaced by the alt (you grew up in Aurex's spire; the debt is the House's power and cogitator lease). Later savant nodes (`mech_o_savant_2…4`, `mech_107/109`) don't restate the birthplace ✓.

### 5.3 Other later-node fixes (Writer B)

| node | issue | priority |
|---|---|---|
| `mech_101` | add the Tobin introduction for `born_universal` (5.2-4) | **must** |
| `eld_o_trooper_5` alt0 | condition `born_shared` → anyFlag born_shared/born_universal (5.2-7) | should |
| `eld_210` choice 1 result "绿光一片片扫过你长大的地方" | false for every pilgrim/trooper (already false on the old paths). Add `resultAlt` `{notFlag:"origin_agri"}`: "绿光一片片扫过底下的麦田。你把它记住了，每一块田。" (EN unchanged) | should |
| `gsc_end_seed` | optional homecoming add (5.2-2) | nice-to-have |
| `eld_601a` "父亲说过，好土会咬手指" | fits the mid (farm) father of both universal Aeldari origins ✓ | none |

---

## 6. Writer assignment

### Writer A: `data/universal.js` only

Work list:
1. Add the cast vars `LEVY, MATE, ESCORT, MARROW, CULT` (§3.1; ESCORT and MARROW spelled **exactly** as in aeldari.js / necrons.js). Add a helper `ONLY(f) → {require:{flag:f}, hideIfLocked:true}`. Keep `D()`.
2. Changed nodes, exactly: **u_low_1** (text: add the Levy-Priest; choices), **u_low_2** (choices), **u_low_door** (choices: hive door removed, guard door added; 2 adds), **u_mid_1** (choices), **u_mid_2** (choices), **u_mid_door** (choices: scavenger/colonist moved out, road choices; 2 adds), **u_up_1** (choices), **u_up_2** (text rewrite + choices), **u_up_door** (choices: scribe/trader moved out, road choices; 2 adds). Unchanged: u_b01, u_b02, u_b03.
3. New nodes: u_low_1m, u_low_2v, u_low_2d, u_low_3, u_low_ship, u_low_levy, u_mid_2v, u_mid_2s, u_mid_road, u_mid_valda, u_up_1c, u_up_2m, u_up_go, u_up_cult (14).
4. Choice order **exactly** as §3.4 (gated last). Data indices are used by the smoke tests (§7.3).
5. Update the file header comment (v2: roads / sub-doors, 20 doors). Don't touch `registerUniversal` fields except the comment; the lead handles `startDate` / `undated`.

Checklist (before handing back):
- [ ] Every node ≤ 90 zh / ≤ 65 EN; adds ≤ 45 zh; labels ≤ 24 zh / 14 EN; results ≤ 90 zh; both languages filled.
- [ ] No `time`, `codex`, stat, roll, `eventRoll`, `ending`, `gather`, `grudge` in any universal node or choice.
- [ ] No year / M4x / 3-digit number / "第N日" anywhere in universal.js.
- [ ] Rule 7 (time-safety) holds for u_b01–03, u_low_1, u_low_1m, u_low_2, u_low_2d, u_low_3, u_low_ship.
- [ ] Every speaker of a new or sub-door node is named in that node's base text.
- [ ] Only flags of §3.2. Each gated choice has `hideIfLocked:true`.
- [ ] `node tools/dev/intro_audit.js --route arcosa` → 0 gaps.
- [ ] `node tools/dev/validate.js`: 0 errors **except** the `universal.*` shape errors of the old prototype check (door count / "3 choices" / "9 origins"), which stay until the lead updates `checkUniversal`. Report exactly which errors remain.
- [ ] `node tools/dev/playthrough.js arcosa --seed 1..10` runs to an ending.

### Writer B: faction files

Work list:
1. `born_universal` text alts on the 11 start nodes of §5.2: `ork_o_guard_1`, `ork_101` (orks.js) · `eld_o_trooper_1`, `eld_o_pilgrim_1` (aeldari.js) · `nec_101`, `nec_o_convict_1`, `nec_o_lexmech_1` (necrons.js) · `mech_101` (+ Tobin add), `mech_o_conscript_1`, `mech_o_savant_1` (mechanicus.js) · `gsc_101` (gsc.js).
2. The fixes of §5.3 (must / should; nice-to-have only if time allows).
3. `imperium.js`, `chaos.js`, `tau.js`: **no changes.**
4. Use each file's own alt style (aeldari: `AT/A/F/ANYF`; mechanicus, gsc, imperium: `ALT/ADD/F`; orks, necrons: literal `{if:…, text: L(…)}` objects).

Checklist:
- [ ] Base text and existing alts unchanged (the origin-card path and §35 must still read right).
- [ ] Each alt ≤ 90 zh / ≤ 65 EN; adds ≤ 45 zh; ≤ 2 adds can fire per node.
- [ ] No year, no time-of-day word.
- [ ] Every "MUST FIX" of §5.2 handled; the named NPCs of §4's last paragraph introduced in the alt.
- [ ] `node tools/dev/intro_audit.js --all` → still 0 gaps on every route.
- [ ] `node tools/dev/route_graph.js --faction <id> --checks-only` for orks, aeldari, necrons, mechanicus, gsc → 0 ERROR.
- [ ] `node tools/dev/date_audit.js` → 0.
- [ ] `node tools/dev/validate.js` → 0 errors in faction files. The validator's "every door origin has a born_universal alt" check fails until Writer A's doors exist, then must pass.

### Interface A ↔ B (fixed; no talking needed)

B reads **only** the flag `born_universal` (plus its own route's flags). A never edits faction files. What the door promises and what the alt continues:

| door (node[idx]) | target · faction/origin | A's result promises (at departure) | B's alt picks up | elapsed (plain words) |
|---|---|---|---|---|
| u_low_door[2] | ork_o_guard_1 · orks/guard | dock company to Iskaron; no bounty; old greatcoat | months on the dock gate, Voss's platoon | 几个月 |
| u_low_ship[0] | gsc_101 · gsc/miner | the Endurance; mining stamp; Shaft Nine short, double at the deep face | ore hold → Kessin; tally token; first shift | 几周 |
| u_low_ship[1] | nec_o_convict_1 · necrons/convict | hold-hand contract "到港结清" | months of hold work; bunk debt; shackle 4471 | 几个月 |
| u_low_levy[0] | mech_101 · mechanicus/menial | furnace line; "number assigned on arrival" | levy ship → Gravex; G7-2291, two reds; Tobin | 几周 |
| u_low_levy[1] | mech_o_conscript_1 · mechanicus/conscript | lot-drum line; "recorded" | landing square; the cog; Kesh-43; socket | 几周 |
| u_mid_road[2] | ork_101 · orks/scrap | scrap freighter; "find the old stallholder" | the stall is yours; servo crate; green sky | 几个月 |
| u_mid_valda[0] | eld_o_trooper_1 · aeldari/trooper | signed the sheet; uniform on landing | landing day; Third Company; Edda | 几周 |
| u_mid_valda[1] | eld_o_pilgrim_1 · aeldari/pilgrim | paid for a corner of the hold; the dream's field | ten years of the dream; nosebleed; landing | 几周 (dream: 十年) |
| u_up_go[2] | nec_101 · necrons/archivist | sketchbook + lamp; no wages, meals | first page of dunes; the Professor's lamp | 几周 |
| u_up_cult[0] | mech_o_savant_1 · mechanicus/savant | "Gravex counting floors, ten years" | Gravex debt clerk; scholam; "你的脑子，十年" | 几周 |
| u_up_cult[1] | nec_o_lexmech_1 · necrons/lexmech | socket compatible; 29 years left | Vektrix-9's cable in the old socket | 几周 |
| (9 old doors) | unchanged | unchanged | unchanged alts | as written |

---

## 7. Lead's side (engine / validator / tests)

### 7.1 Engine / HUD (lead's decision, recorded here so the text rules make sense)
- The universal route is undated: the HUD shows 序章 / Prologue (`dateText` already does this when `!g.dated()`); `date_audit.js` skips universal nodes.
- At a door `_switchFaction` restarts the clock at the target faction's `startDate` (day 1, `startHours` → 06:00). Records / echoes / saves use the faction clock from then on.
- `story_lib.doorOrigins` and `route_graph` must pick up doors in **any** universal node (not just `u_*_door`), so that the 11 new origins get `born_universal` in `mayFlags`.

### 7.2 Validator: `checkUniversal` v2 invariants
1. Ids `u_*`; all `chapter: 1`; reachable from `u_b01`; no cycles; no dead ends; no `time`, `codex`, stat/taint effects, `roll`, `eventRoll`, `ending`, `gather`, `grudge`.
2. ≤ 4 entries in every `choices` array; text-length limits (rule 1) for text, alts, adds, labels, results, resultAlts.
3. Flags set in universal ⊆ {`class_low/mid/up`, `u_*`}. Every `u_*` flag that is set is read (require / alt / resultAlt) in universal; every flag in a `require` is set upstream on some path. Every choice with a `require` has `hideIfLocked:true`; gated choices come after ungated ones (warn).
4. **Door** = choice with `effects.faction`: `effects.origin` belongs to that faction, `next` = that origin's `startNode`, `set.u_door = "<faction>/<origin>"`, no `roll`. `effects.faction/origin` anywhere else is an error. Any choice whose `next` is an origin start node without `effects.origin` is an error.
5. u_b03 has exactly 3 class choices. For each class: find its ROAD (the first node holding a door or a choice into a node that holds only doors). Doors sit at depth ≤ 2 from the ROAD. Nodes after the ROAD hold only doors (SUB).
6. **Flag-state enumeration** per class: DFS over the class subgraph, carrying the set of flags; at each node keep only choices whose `require` passes. For every reachable state: every ROAD and SUB shows ≥ 2 choices, and the class has ≥ 3 distinct reachable destinations. (Expected result: the table in §3.5.)
7. Coverage: all 8 factions reachable; the set of reachable (faction, origin) pairs equals the §2 matrix (20). Warn on any origin reached by > 1 class: then each such class needs its own alt `{all:[{flag:"born_universal"},{flag:"class_<c>"}]}` on the start node (none in v2).
8. Every door's start node has a text alt whose condition mentions `born_universal` (error).
9. No dates: universal text (all languages, incl. results, alts) must not match `/M4\d|\b\d{3}\b|\d+\.M|第\s*[\d一二三四五六七八九十]+\s*日/`. `born_universal` alts in the faction files: same regex (error), plus warn on 今晚/半夜/夜班/下午/傍晚/tonight/midnight/afternoon/evening.
10. §37.9: `intro_audit` gaps on route `arcosa` = error (keep).

Self-test (`universalSelfTest`): for each of the 20 doors, ≥ 10 runs from `u_b01` along a path that opens it (use §7.3). After the door: faction / origin / caps / start stats equal a fresh `start(origin)` plus `born_universal` and the universal flags; the clock equals the faction's start; the HUD is dated. Rewind across the door returns the prologue and undated HUD. Save-record round trip before and after the door. Play to an ending.

### 7.3 Smoke paths (choice **data indices**, 0-based; the UI's buttons carry `data-i` = data index)

Prefix for all: `u_b01:0, u_b02:0, u_b03:<c>` with c = 0 low / 1 mid / 2 up.

| leaf | path after the prefix |
|---|---|
| imperium/hive | low_1:0, low_2:0, low_2v:0, low_3:0 |
| chaos/deserter | low_1:0, low_2:0, low_2v:0, low_3:1, low_door:0 |
| tau/pow | low_1:0, low_2:0, low_2v:0, low_3:1, low_door:1 |
| orks/guard | low_1:0, low_2:0, low_2v:0, low_3:1, low_door:2 |
| gsc/miner | low_1:0, low_2:1, low_2d:0, low_3:2, low_ship:0 |
| necrons/convict | low_1:0, low_2:1, low_2d:0, low_3:2, low_ship:1 |
| mech/menial | low_1:1, low_1m:0, low_2:0, low_2v:0, low_3:3, low_levy:0 |
| mech/conscript | low_1:1, low_1m:0, low_2:0, low_2v:0, low_3:3, low_levy:1 |
| imperium/agri | mid_1:0, mid_2:0, mid_door:0 |
| chaos/scavenger | mid_1:0, mid_2:0, mid_door:1, mid_road:0 |
| tau/colonist | mid_1:0, mid_2:0, mid_door:1, mid_road:1 |
| orks/scrap | mid_1:0, mid_2:1, mid_2s:0, mid_door:1, mid_road:2 |
| aeldari/trooper | mid_1:1, mid_2v:0, mid_2:0, mid_door:2, mid_valda:0 |
| aeldari/pilgrim | mid_1:1, mid_2v:0, mid_2:0, mid_door:2, mid_valda:1 |
| imperium/noble | up_1:0, up_2:0, up_door:0 |
| chaos/scribe | up_1:0, up_2:0, up_door:1, up_go:0 |
| tau/trader | up_1:0, up_2:0, up_door:1, up_go:1 |
| necrons/archivist | up_1:0, up_2:1, up_2m:0, up_door:1, up_go:2 |
| mech/savant | up_1:1, up_1c:0, up_2:0, up_door:2, up_cult:0 |
| necrons/lexmech | up_1:1, up_1c:0, up_2:0, up_door:2, up_cult:1 |

Extra smoke checks: (a) with no gate flags (low_1:0, low_2:0 / mid_1:0, mid_2:0 / up_1:0, up_2:0) the ROAD shows exactly 2 buttons and no locked buttons; (b) all gates open (low_1:1 + low_2:1; mid_1:1 + mid_2:1; up_1:1 + up_2:1): the ROAD shows 4 / 3 / 3 buttons; (c) HUD shows 序章 before the door and the faction date after; (d) theme switch, autosave on the door, rewind across the door (existing `--only-universal` checks, now over 20 doors).

---

## 8. Risks / open questions (ranked)

1. **Hidden vs greyed gates (ask Howie).** I chose `hideIfLocked:true`. A greyed "去码头，找'忍耐号'" shown to someone who never went to the docks reads as a contradiction. Greyed locks would advertise replay value. One-flag change either way.
2. **Time of day at the door (lead/Howie).** The clock restarts at 06:00, but the up/low doors happen at night, and existing alts say "今晚" (`imp_o_noble_1`, also its base text). New alts avoid time words (rule 6). Option: `startHours` already honours `startDate.hour`, so a door could carry an optional entry hour (e.g. `effects.clockHour`). Not needed for v2.
3. **Codex `place_gravex` says "你的家。"** It is unlocked at all three Mechanicus start nodes, and is wrong for the menial, conscript and savant arriving from Aurex. Suggested neutral ending: "很多人生在这里，死在这里。" It's text-role data outside A/B; the lead decides.
4. **Four origins are not reachable** (eld/agri, gsc/warden, gsc/kin, orks/ganger). They're still in 预选势力. If Howie wants all 24, eld/agri and gsc/kin cannot be done without rewriting their routes (sister/parents on Valda; hybrid birth).
5. **Time-safety is review-enforced.** The validator can't tell "Valda is silent" from "Valda is far". The lead should read the 9 nodes of rule 7 once after Writer A.
6. **Echo world for the universal convict** is the origin's `world` = Carcharos (`ui.js:2093`). Minor. Option: for `born_universal` runs use the faction world.
7. **The intro audit is flag-blind.** Hence the rule "name the speaker in every SUB node's base text", even where a gated path guarantees the meeting.
8. **Node count 26** is a little under the suggested 28–40. Every node either forks or opens doors; a run now sees 8–10 universal nodes. I didn't add a 4th birth node, because shared birth text must stay timeless for doors from 100 to 113.M42 and has nothing weighty to add that wouldn't break that.

**Changes relative to the lead's constraints, with reasons:** no sister/Nir in the mid strand (the sister belongs to the unreachable `agri`; trooper/pilgrim don't need her); Gravex/Kessin spellings corrected; the "door node" becomes ROAD + SUB, and the old `u_low_door` keeps its id and text as the army SUB while the low ROAD is the new `u_low_3`; one `born_universal` alt per origin suffices (no per-class alts); the 3 old faction files need no edits.
