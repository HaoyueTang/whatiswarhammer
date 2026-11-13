# QA read-through · gsc (Genestealer Cult) · v0.4.0 · 2026-11-12

Runs read: 36 (miner / warden / kin × seeds 1–11, `--first`, `--last`; 3 in `--en`: kin s12, miner s13, plus spot checks), all 116 nodes and every `alt` / `resultAlt` read in `data/factions/gsc.js`.
Note: `tools/dev/playthrough.js` never prints choice results (it reads `step.consequence.result`, the engine field is `step.consequence.text`); results were read with a patched copy outside the repo.

Gates before → after (validate seed 1, 3000 runs): death 21.8 % → 21.8 % · claim 3.7 % → 3.7 % · good 23.4 % → 23.4 % · gather 13 → 13 · median run 53 → 53 · `--story-gate` PASS · route_graph no ERROR/WARN · date_audit 0 anachronisms. No effects / rolls / requires / ids / flags changed.

## Fixed (23 items)

| node | cat | defect | change |
|---|---|---|---|
| gsc_104b | 2 time | text "整整一个星期", `time {d:1}` | `time {d:7}` |
| gsc_105 (speak up) | 3 result | after you snubbed Teo (`wronged_teo`) the result has Teo clapping your back "你是个好人"; next node says he is still cold | `resultAlt` on `wronged_teo`: Teo watches from a distance |
| gsc_105a | 1/5 | `wronged_teo` path: Teo waits warmly at the cell door, then 106 says his face is still cold | `alt` text + `resultAlt` for `wronged_teo` (cold face, bread anyway) |
| gsc_204 | 5 contradiction | base "账本合着" + add "他的本子摊在桌上，翻开的那页" | add rewritten: the little book of names lies under the closed ledger |
| gsc_209 | 2 place | kin lives in the Hollin house: "星期天你没去霍林家" | `alt` for `origin_kin`: skips the family chapel instead |
| gsc_212 | 5 contradiction | warden who reported at 205 (`reported`) gets "我等你的报告等了一个月" and "你说对了" together | vaskAgent add now `{vaskAgent, notFlag reported}` |
| gsc_300 | 1/4 | `confessedLusk` add "台阶上那个兜帽小孩" — the child is only introduced on the *other* 209 choice | add introduces the child on the chapel steps |
| gsc_310 | 5/8 | kin: base "那之后，你脑子里多了一阵嗡鸣" + add "你从小就有嗡鸣" contradict | kin add → `alt` text (inborn hum, closer since the cavern) |
| gsc_310 | 7 | fled path: "老祖宗会再等你一回" said in 307 and again in 310 | 310 no-hum line → "不急。家里人有的是耐心。" |
| gsc_311 | 4 | `wire` add "通讯珠被捏碎前的最后几秒" also shown when the bead was never pressed/crushed (crushed only via 309) | split: `{wire, forgiven}` crushed version / `{wire, not forgiven}` "recorded by the bead in your collar" |
| gsc_401 | 1 age | "两鬓有了白发" — kin is ~28 here | "眼角也有了细纹" (en matched) |
| gsc_403 | 1 presence | Wren appears in the market without being brought along | "同来的雷恩" / "Wren, who came along" |
| gsc_502 | 2 time | "第二十天" after a 3-year jump (of what?) | "二十天后" (text + jump label, en matched) |
| gsc_505 | 7 | "在角落里摆清楚的甲壳和手" awkward | "在角落里把甲壳和手一样样想清楚" |
| gsc_603b | 3 result | "审判官的人去了十三号矿井" also after you said nothing / gave no place | neutral: "审判官带人下矿井搜去了" (base + joryMaimed alt, en) |
| gsc_701 | 3/8 | `smuggler` add "调转的炮口里，有你当年运进去的炮弹": set even when the truck was caught (crates seized), and the cargo was explosives, not shells | condition `kinLedger` OR (`smuggler` and not `heldOut`/`traitor`); text "炸开那些大门的，有你当年经手的那批炸药" |
| gsc_705 ("去找内尔") | 3 | after 704 "lead them out to welcome" you are already holding Nell's hand, result says you find her in the crowd | `resultAlt` fromNode 704 |
| gsc_707 | 4 | non-linked players (fled, never blessed) told "你脑子里的嗡鸣不见了" | `alt` for `not linked & not kin`: the city's song is gone |
| gsc_707 | 7 | choice "再打一拳，再一拳" offered before any punch | label "一拳接一拳地打他" / "Hit him, again and again" |
| gsc_803 | 4/1 | "十五年来第一次，只有你自己": kin has had the hum ~30 years, non-linked never had it | "只剩下你自己" |
| gsc_806 | 5 | `promisedNell` add "你做到了（拉着我的手跑）" shown to players who boarded alone | condition `{promisedNell, withNell}` |
| gsc_end_shadow | 6/8 | title "阴影散去 / The Shadow Lifts" vs text "影子还在" (A52) | text now: the Shadow remains but "掀开了一道缝" / "for the space of one sentence it lifted"; en last line matched to zh |
| gsc_death_sanity | 6 | ch 7–8: "家里多了一个总在微笑的人" when the family is being eaten; "他" for the player | `fromChapter ≥7` add → full `alt` text (follow the song into the violet haze); "他" → "这人" |

## Listed, not fixed

- gsc_105a → 106 (smash + `wronged_teo`): Teo hands you bread twice within a few days (motif, minor).
- gsc_801 "躲进九号矿井" result "那是你第一次下井的地方" — not quite true for kin (lift-head clerk). Minor.
- gsc_408: kin meets Brann "in the barracks" though kin lives at home — plausible, left.
- gsc_602 `foolTester` line "她的眼神骗不了机器" is a little opaque.
- gsc_end_ark "个个都是素脸": children from the Hollin cellar are plausibly 4th-generation; without `askedMercy` nobody tested them. Ambiguity may be intended (vs The Seed); author's call.
- Kin can never reach ark / passenger (carrier → The Seed) — by design, validator WARN.
- Brief names the priest "Rusk"; the file uses 卢斯克 / Lusk consistently (left).

## Shared / tools (for the lead)
- `tools/dev/playthrough.js` line ~52: `step.consequence.result` should be `step.consequence.text` (results never printed).
- First validate run showed `ERROR event.evt_undivided_1.where.notNodes: node "cha_701" does not exist in imperium/tau/necrons/mechanicus` (shared events file); it was gone on the next run (someone fixed it meanwhile).

## Lore checks
- Lexicanum (Genestealer Cult): Patriarch = psychic beacon to the hive fleet; when the fleet arrives the Patriarch's purestrain brood turns on the cult (supports 707b); 4th generation pass as human and produce purestrains (supports codex). Killing the Patriarch does not end the cult/Shadow — text says only the song stops (A52) ✓.
- Rumours (Macragge/Behemoth, Baal, Octarius/Kryptman, Leviathan, Vigilus) are hearsay and canon-consistent; "Vigilus … 差一点拿下整颗星" is an exaggeration but voiced as rumour.
