# qa_mechanicus.md — QA read-through, Adeptus Mechanicus route (v0.4.0)

Reader: Opus QA. Runs read: 27 (menial / savant / conscript × seeds 3, 17, 42, 77 + `--first` + `--last` + `--en` seed 5; plus targeted seeds for keeper menial 126, magos savant 120, survivor conscript 136, looted menial 112, pure savant 104, servitor conscript 102). Also read all of `data/factions/mechanicus.js` node by node (every alt / resultAlt / grudgeLine / death / claim / ending node, route events and rumours) against `route_graph.js` MUST/MAY.

Baseline = after (unchanged): death 26.3 % · good 24.8 % · claims 9.1 % · gather 12 · median run 56 · false choices 0 · shallow 2/27 · forced chapter steps 0 · unjustified jumps 0 · grudge +1.4 pt · route_graph checks: no ERROR/WARN · date_audit 0 anachronisms. Node count 103 (no ids, flags, endings or effects changed).

Warsmith hunt: no "铸魔匠 / warsmith" left that refers to Syrredin. Remaining: codex id key `mech_warsmith` (ids are frozen) and the generic codex line "混沌的铸魔匠 / Chaos warpsmiths" in `mech_daemon_engine` (allowed).

## Fixed (21)

| node | cat | problem | change |
|---|---|---|---|
| mech_106 | 1 people | menials who went 101→103 never met Gries; 106 says just "格里斯" | "监工格里斯" / "Overseer Gries" |
| mech_107 | 5 stacking | base ends "轮到他了。然后，轮到你。"; the Tobin adds ("他小声说：谢了") then read after he has already gone | base → "就要轮到他了，然后是你。" / "His turn is next. Then yours." |
| mech_200 | 4 assumed | wronged_tobin add "你多出的那十分钟…" also fires for the 103 ration theft (no shove, no ten minutes) | → "托宾的事，你不愿去想。折叠铺很硬，你睡不着。" |
| mech_202 | 2 time / 1 people | tobinFriend add "几天前，他还告诉过你他的名字" — 20+ days have passed; the menial knew Tobin long before | → "你认得这张脸。他叫托宾。" |
| mech_309 | 1 people | "维克崔斯-9" introduced without title (en has Magos) | "维克崔斯-9贤者" |
| mech_401 | 7 zh/en | en lists servitors at the mess tables, zh doesn't | en "Skitarii and crew" |
| mech_405 | 5 stacking | perimeter add "卡兰提斯是最后一个跑出来的" after "she walks back into the dark, hatch seals" | → "她是最后一个跑出墓道的，也是第一个走回去的。" |
| mech_408 | 4 assumed (en) | "the necron metal you brought back" — perimeter players brought none | "brought aboard" |
| mech_502 | 5 contradiction | keshTrust add "你的报表从没错过" also shows after the 304 misfire ("误射一次，责任人是你") | condition + notFlag kastelanMisfire |
| mech_505 | 2 time | "等护教军来救" result "两天后" but 504 is +6 h | "天亮前" / "Before dawn" |
| mech_507 | 4 assumed | "闪了两下，和试炮那天一样" — only the 304 prayer path saw the double blink | base neutral ("闪两下，停一停，又闪两下") + alt add for prayedKastelan |
| mech_508 | 2 time | "兽人退后第三天" but clock is day 4 (506 +2 d, 508 +2 d) | "第四天" / "Four days after" |
| mech_602 | 3 choice→result | base puts the key in your palm; knowLanding result says "钥匙留在桌上" | "说完她就走了。你把钥匙放回桌上。" |
| mech_605 | 2 time | text "三天后", time {d:2} | "两天后" / "Two days later" |
| mech_608 | 1 people | savant/conscript never met Rumm (104 is menial-only); text says just "鲁姆" | "铸工神甫鲁姆" / "Enginseer Rumm" |
| mech_700 | 1 continuity | "凯什单腿撑着桌沿" contradicts keshRepair (you built her a leg; 706 alt says so) | "凯什撑着桌沿" |
| mech_707 | 3 continuity | hand-over result "他撕开七道封条" but 509 (always visited) tore one | "剩下的六道封条" / "six remaining seals" |
| mech_806 | 1 continuity | "你的旧编号还在，是绿的" — Gries wiped your number off the board (106 / savant_4) | "有人把你的旧编号重新写了上去，是绿的" |
| mech_end_magos | 5 contradiction | base "袍子下有黄铜" + fleshFirst add "袍子下没有黄铜" shown together | base → "黄铜比同僚少得多"; add → "当年你连第一次改造都没要。神甫们至今叫你“原装的贤者”。" |
| mech_end_keeper | 6 ending | tobinGave (Tobin died at the conduit) also has tobinSaved → "你每天在T-0B1N站过的地方停一下" + "然后给T-0B1N擦脸。它还在哼歌" | tobinSaved add now `all[tobinSaved, notFlag tobinGave]` |
| (en mirror) | 7 | each zh change above has its en counterpart | — |

## Listed, not fixed

| where | cat | note |
|---|---|---|
| mech_707 alt order | 5 / structural | 7 adds, max 2 shown; askedNew / glimpsed / askedOmni come first, so the big beat "奥西娅站在他身边" (heardOssia) and the cell message (ossiaArrested) are usually hidden. Reordering alt entries changes stored `altSel` indexes in saves, so left for the lead: move heardOssia / ossiaArrested to the front. |
| mech_107 shove option | 3 logic | "把托宾往前推，抢出十分钟" — Tobin already stands ahead of you, so pushing him forward does not obviously buy time. Readable as "push the hesitating man onto the table"; left as designed. |
| mech_405 / 403b | 3 | 403b "数到十七，就再没人上来了" then Calantis comes out last (she never boards, so not counted) — acceptable. |
| mech_707 lead box | 3 | the box was locked in the lander (501), then searched in the Vault (509); at 707 you hand it over in the reactor hall without it being fetched. Minor; would need a clause. |
| mech_509 zh/en | 7 | en adds "not the orks"; zh only "残片是他拿的" — same meaning, left. |
| codex `mech_warsmith` | 8 | "塞瑞丁曾是某个铸造世界的贤者" vs route "三十年前我们判过他" (Gravex). Vague enough, not contradictory. |
| mech_death_corruption | — | unreachable in random play (known). mech_end_claim_slaanesh never visited in 3000 runs (claim-event rate, not a text issue). |

## Shared files (for the lead)
- Earlier in the session `validate.js` reported `ERROR event.evt_undivided_1.where.notNodes: node "cha_701" does not exist in imperium/tau/necrons/mechanicus`; by my last gate run it was gone (someone else fixed it). Re-check after the shared-events pass.
- `evt_slaanesh_1` (a stranger hands you a fruit) fires at mech_201 inside the Vault; `evt_t_any_note` ("someone at home slipped it in") at mech_308 — this works for the savant, less well for menials/conscripts. Not wrong, just generic.

## Lore
No lore edits. Checked by reading: Treaty of Olympus, Fabricator-General's seat on the High Lords, Cawl and his copies, Motive Force, Rite of Pure Thought, doctrina wafers, Datasmiths and Kastelans, Schism of Mars / Kelbor-Hal, "Dark Magos" for Dark Mechanicum leaders: all consistent with canon. Doubts: "Kastelan 高得像钟楼" and "兽人头目比卡斯特兰矮不了多少" are hyperbole (a Kastelan is a few metres tall); harmless.
