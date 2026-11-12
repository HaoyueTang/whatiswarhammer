# Convergence report: orks

- nodes: 97; nodes with ≥2 choices: 69
- **false-choice nodes** (all choices → same next node; choice changes only a result line): 44 (64% of multi-choice nodes)
- choices that have their own follow-up node (not shared with a sibling): 35/193 (18%)
- shallow branches (siblings re-merge within ≤1 step, i.e. the branch has no follow-up scene of its own): 18
- forced chapter steps (a node whose choices all lead to one node in a LATER chapter): 7
- hard jumps (chapter advances, or scene change + big time jump, along an edge): 34

## False-choice nodes
ork_102, ork_o_guard_1, ork_o_guard_2, ork_o_guard_3, ork_o_guard_4, ork_o_ganger_1, ork_o_ganger_2, ork_o_ganger_3, ork_o_ganger_4, ork_106, ork_108, ork_202, ork_208, ork_210, ork_302, ork_310, ork_308, ork_311, ork_401, ork_407, ork_404, ork_405, ork_406, ork_408, ork_409, ork_501, ork_502, ork_503, ork_506, ork_507, ork_603, ork_605, ork_604, ork_606, ork_607, ork_608, ork_707, ork_708, ork_709, ork_711, ork_710, ork_802, ork_804, ork_811

## Shallow branches
ork_101(rejoin@1), ork_103(rejoin@1), ork_104(rejoin@1), ork_107(rejoin@1), ork_201(rejoin@1), ork_204(rejoin@1), ork_207(rejoin@1), ork_301(rejoin@1), ork_303(rejoin@1), ork_304(rejoin@1), ork_305(rejoin@1), ork_402(rejoin@1), ork_504(rejoin@1), ork_601(rejoin@1), ork_602(rejoin@1), ork_702(rejoin@1), ork_705(rejoin@1), ork_803(rejoin@1)

## Forced chapter steps
ork_108→ork_201(ch1→2)
ork_210→ork_301(ch2→3)
ork_311→ork_401(ch3→4)
ork_409→ork_501(ch4→5)
ork_507→ork_601(ch5→6)
ork_608→ork_701(ch6→7)
ork_710→ork_801(ch7→8)

## Hard jumps (edge: scene/time/chapter change)
ork_o_ganger_3→ork_o_ganger_4(hive_spire→ork_scrapyard, time {"d":3})
ork_108→ork_201(same scene, time {"d":3}, ch1→2)
ork_210→ork_301(ork_scrapyard→ork_fort, time {"d":20}, ch2→3)
ork_308→ork_311(manufactorum→ork_fort, time {"d":3})
ork_311→ork_401(ork_fort→ruins, time {"d":90}, ch3→4)
ork_402→ork_403(ork_scrapyard→manufactorum, time {"d":3})
ork_402→ork_405(ork_scrapyard→manufactorum, time {"d":5})
ork_403→ork_404(manufactorum→ruins, time {"d":4})
ork_407→ork_404(manufactorum→ruins, time {"d":4})
ork_404→ork_405(ruins→manufactorum, time {"d":5})
ork_405→ork_408(manufactorum→ork_scrapyard, time {"d":10})
ork_406→ork_405(ruins→manufactorum, time {"d":5})
ork_408→ork_409(ork_scrapyard→manufactorum, time {"d":4})
ork_409→ork_501(manufactorum→ork_fort, time {"d":7}, ch4→5)
ork_504→ork_506(ork_fort→ork_scrapyard, time {"d":6})
ork_505→ork_506(ork_fort→ork_scrapyard, time {"d":6})
ork_507→ork_601(ork_fort→burning_city, time {"d":30}, ch5→6)
ork_604→ork_606(burning_city→manufactorum, time {"d":10})
ork_606→ork_607(manufactorum→ork_scrapyard, time {"d":3})
ork_607→ork_608(ork_scrapyard→ork_fort, time {"d":4})
ork_608→ork_701(ork_fort→ork_scrapyard, time {"d":40}, ch6→7)
ork_701→ork_707(ork_scrapyard→ork_fort, time {"d":20})
ork_701→ork_708(ork_scrapyard→trench, time {"d":3})
ork_704→ork_707(ork_scrapyard→ork_fort, time {"d":20})
ork_705→ork_708(ork_fort→trench, time {"d":3})
ork_706→ork_707(trench→ork_fort, time {"d":20})
ork_707→ork_709(ork_fort→ork_scrapyard, time {"d":5})
ork_708→ork_709(trench→ork_scrapyard, time {"d":5})
ork_709→ork_711(ork_scrapyard→manufactorum, time {"d":3})
ork_711→ork_710(manufactorum→ork_fort, time {"d":14})
ork_710→ork_801(ork_fort→ork_scrapyard, time {"d":7}, ch7→8)
ork_809→ork_end_grot(ork_fort→ork_scrapyard, time {"y":10})
ork_807→ork_end_freebooter(ork_scrapyard→void, time {"d":60,"warp":true})
ork_808→ork_end_evacuated(burning_city→void, time {"d":20,"warp":true})
