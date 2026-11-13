# QA read-through — Imperium (v0.4.0 story overhaul)

Reader: Opus QA. Date 2026-11-12. File: `data/factions/imperium.js` (only file edited).

## Runs read
27 runs read in full or by section: hive / agri / noble × seeds 2, 3, 4, 7 + `--first` + `--last` + `--en` (21), seed 1 hive, plus targeted seeds 33 (underhive friend), 39 (hive informer → penal), 46 (agri purged), 60 (spy → traitor), 65 (Pell rescue at 507). A 60-seed sweep (seeds 20–80) was used to find branch coverage (702p, 713b, 807, 604, end_purged, end_traitor, end_crusade, end_inquisition, end_brood). Every node not reached in those runs (407, 410, 411b, end_heretic, 504, 510–515, 704/705, 712, 804, claim and death nodes, all `alt` entries) was read in the source.

## Gates
Baseline (before my edits, current shared files): death 29.6 % · good 25.0 % · claim 13.5 % · gather 13 · median run 58 · grudge +1.0. (The first baseline earlier in the session read death 30.7 / good 24.8 / claim 13.2; the shift came from shared event edits by another agent: the same figures show with my original file restored.) After my edits: identical numbers. `validate --story-gate` PASS 0 errors · `route_graph --checks-only` no ERROR/WARN · `date_audit` 0 anachronisms. New WARN: `endings_brief.json` stale (ending texts changed) → lead should run `node tools/dev/dump_endings.js`.

## Defects fixed
| node | category | what was wrong | change |
|---|---|---|---|
| imp_106b | time | informer alt: "昨夜黑船带走了他妹妹", but the report, the list and the pen are all the same day (~10 h) | "天黑前" / "before dark" |
| imp_605 | people | speaker label "米娜" shown to agri/noble (never met her) and to hive players who skipped the stairwell; locked option "米娜？佩尔一直在找你" (no hideIfLocked) also leaked the name | speaker "结霜的女孩 / Frost-Fingered Girl" (sprite unchanged); `hideIfLocked:true` on that choice |
| imp_806 | lore/wording | "从黑船落下" — in this route 黑船 = the psyker Black Ships; here it means the Black Legion fleet | "从黑色舰队落下" / "since the black fleet fell" |
| imp_end_hold | ending/place | `sparedRunner` add "在楼梯间帮你烧水" stacks with the agri (Dome Seven) and noble (Serrin cellars) alts | location-neutral: "后来一直跟在你身边帮忙" |
| imp_707 | logic | `forgiven_brin` alt says "真的布琳", but "开枪" passes through her and 709 says "那东西消失了" | "是布琳——至少她说是" (ambiguous, both outcomes now fit) |
| imp_404 → imp_405 | choice→result | "转身冲出地窖" leads to the commissar taking you to Haak with no reason given | result adds "你一路跑到政委的帐篷前" |
| imp_415 | zh/en, coin | zh "天上的朋友" lacked "他们" (en "Their friends"); unexplained for players who never heard the cult's phrase. Spy resultAlt hands a coin as if the 408 coin did not exist | "他们天上的朋友"; spy: "她又弹来一枚，跟巷子里那枚一模一样" |
| imp_502 (agri choice) | choice→result | result "谷仓的门，从里面闩上了", next node you are inside the granary | "谷仓的门虚掩着，里面有动静" |
| imp_711 | time | `underhiveFriend` add "三天的逃亡" — the underhive escape lasts about a day | "当年逃亡走过的路" |
| imp_707 (choice result) | place | "训练营里那个被处决的新兵": training was aboard the Oath of Iron | "训练时" |
| imp_end_servitor | alt stacking | base "没人知道下一句" + lullaby add "有时它会哼出下一句" contradict | base "没人接得上下一句" |
| imp_end_commissar | alt stacking | alt from 518 "德拉维克没有再递笔" repeats 518's result line and implies an earlier pen | "德拉维克合上了名单" |
| imp_200 | assumed fact | red-stamp line only for `deserter`; players caught at the drain (104 roll fail → 109) also carry the stamp (`marked`) | condition `anyFlag:[deserter, marked]` |
| imp_304 | people | an informer who never apologised gets Pell laughing warmly beside them (only `apologizedPell` had an alt) | new ADD for `wronged_pell` ∧ ¬`apologizedPell`: he remembers and shifts away |
| imp_702 | people | noble alts are spoken by the father while the speaker is Hallow | "哈洛领你下到地窖时…" (Hallow leads you there) |

Checked and fine: Pell / Mina / Vosk / Dravik / Hallow names, titles, genders (Vosk, Dravik, Haak female; Hallow male) in zh and en through all three origins; Mina only named to hive players who saw her; Pell introduced per origin (103 / agri_5 / noble_5); the dead recruit's letter goes to Tower Three, the player's own block (codex agrees); Great Rift / Guilliman shown as known for ~100 years (603 "一百多年前醒来", 600 "裂隙边缘"); day counts in ch7–8 (siege day 3 → 5 → night of 5 → dawn of 7 = "援军最快七天"); death rate left as is.

## Listed, not fixed
1. **Shared events (for the lead).** `evt_t_imp_cleanse` and `evt_t_imp_nurgle` have `where.nodes` with `imp_402`/`imp_403`, which come 1–2 h after the soup in 401 in the middle of Brin's conversation. A confession queue or field-hospital scene drops between "你接过碗，布琳在你身边坐下" and "布琳握着你的手". The nurgle text also says "雨下了九天" after 2 days in Vessel. Suggestion: move the eventRoll to the transit bridge `imp_400`, which already has one, and `imp_405`, or give 402/403 no eventRoll. That needs a balance check, so I left it.
2. `imp_end_commissar` keeps `scene:"trench"` / chapter 3 when reached from `imp_518` (ch5, barracks). This is a node field and cannot be changed with alt (art and chapter label only).
3. `imp_410` has `scene:"burning_city"` before Vessel is burned (art only).
4. `imp_600` penal alt says "佩尔偷偷给你塞过两次烟" also for an unforgiven informer. It is plausible as pity, but it sits oddly next to 610's cold grudgeLine. An optional `wronged_pell` variant could fix it.
5. `imp_108b → imp_109`: `time {h:2}`, but the enforcer's lamp is already on you. Minor.
6. Shallow branches 21/44 (48 %, warn), the author's known open item.
7. `endings_brief.json` is stale after the ending text edits. Run `dump_endings.js`. The art pictures do not change.

## Lore doubts
- Current lore says the Indomitus Crusade officially ran about 100 years and Guilliman declared it complete. The fighting goes on under other designations. Around 114.M42 the route still says "无畏远征的一支战斗群", which follows SPEC §32.7 ("under way in M42"). If the lead wants it closer to canon, "远征舰队 / crusade battle group" without the Indomitus name would be safer. I left it unchanged.
- The chapter title "黑色远征" is used for an Abaddon raid on one world in M42. Canon "Black Crusades" are the 13 numbered ones, so a "Black Legion warband / 黑色军团" framing would be stricter. It is a design choice, so I did not change it.
