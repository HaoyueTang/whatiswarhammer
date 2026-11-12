# Convergence report: aeldari

- nodes: 101; nodes with ≥2 choices: 70
- **false-choice nodes** (all choices → same next node; choice changes only a result line): 37 (53% of multi-choice nodes)
- choices that have their own follow-up node (not shared with a sibling): 61/166 (37%)
- shallow branches (siblings re-merge within ≤1 step, i.e. the branch has no follow-up scene of its own): 22
- forced chapter steps (a node whose choices all lead to one node in a LATER chapter): 8
- hard jumps (chapter advances, or scene change + big time jump, along an edge): 18

## False-choice nodes
eld_106, eld_107, eld_o_pilgrim_1, eld_o_pilgrim_3, eld_o_pilgrim_4, eld_o_trooper_1, eld_o_trooper_2, eld_o_trooper_3, eld_o_trooper_4, eld_202, eld_203, eld_301, eld_303, eld_304, eld_401, eld_404, eld_405, eld_408, eld_410, eld_409, eld_411, eld_501, eld_503, eld_504, eld_505, eld_508, eld_510, eld_601, eld_602, eld_603, eld_606, eld_610, eld_611, eld_701, eld_702, eld_705, eld_801

## Shallow branches
eld_101(rejoin@1), eld_102(rejoin@1), eld_103(rejoin@1), eld_104(rejoin@1), eld_105(rejoin@1), eld_o_pilgrim_2(rejoin@1), eld_204(rejoin@1), eld_207(rejoin@1), eld_208(rejoin@1), eld_209(rejoin@1), eld_302(rejoin@1), eld_305(rejoin@1), eld_306(rejoin@1), eld_308(rejoin@1), eld_402(rejoin@1), eld_406(rejoin@1), eld_407(rejoin@1), eld_502(rejoin@1), eld_506(rejoin@1), eld_608(rejoin@1), eld_703(rejoin@1), eld_807(rejoin@1)

## Forced chapter steps
eld_107→eld_201(ch1→2)
eld_o_pilgrim_5→eld_201(ch1→2)
eld_o_trooper_5→eld_201(ch1→2)
eld_307→eld_401(ch3→4)
eld_411→eld_501(ch4→5)
eld_510→eld_601(ch5→6)
eld_611→eld_701(ch6→7)
eld_707→eld_801(ch7→8)

## Hard jumps (edge: scene/time/chapter change)
eld_107→eld_201(tomb_exterior→burning_city, ch1→2)
eld_o_pilgrim_2→eld_o_pilgrim_4(jungle→cathedral, time {"d":3})
eld_o_pilgrim_3→eld_o_pilgrim_4(ruins→cathedral, time {"d":3})
eld_o_pilgrim_5→eld_201(tomb_exterior→burning_city, ch1→2)
eld_o_trooper_5→eld_201(same scene, ch1→2)
eld_207→eld_301(ruins→webway, time {"d":2,"warp":true}, ch2→3)
eld_208→eld_301(ruins→webway, time {"d":2,"warp":true}, ch2→3)
eld_209→eld_301(ruins→webway, time {"d":2,"warp":true}, ch2→3)
eld_210→eld_301(ruins→webway, time {"d":2,"warp":true}, ch2→3)
eld_307→eld_401(webway→craftworld, ch3→4)
eld_411→eld_501(same scene, time {"y":1}, ch4→5)
eld_510→eld_601(craftworld→maiden_world, time {"d":9,"warp":true}, ch5→6)
eld_611→eld_701(maiden_world→craftworld, time {"d":12}, ch6→7)
eld_706→eld_end_burned(craftworld→burning_city, time {"d":20})
eld_707→eld_801(same scene, time {"h":5,"warp":true}, ch7→8)
eld_806→eld_end_maiden(craftworld→maiden_world, time {"y":3})
eld_806→eld_end_burned(craftworld→burning_city, time {"d":20})
eld_806→eld_end_ynnari(craftworld→webway, time {"y":1,"warp":true})
