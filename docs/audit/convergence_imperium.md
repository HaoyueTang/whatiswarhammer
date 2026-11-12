# Convergence report: imperium

- nodes: 109; nodes with ≥2 choices: 61
- **false-choice nodes** (all choices → same next node; choice changes only a result line): 26 (43% of multi-choice nodes)
- choices that have their own follow-up node (not shared with a sibling): 66/138 (48%)
- shallow branches (siblings re-merge within ≤1 step, i.e. the branch has no follow-up scene of its own): 26
- forced chapter steps (a node whose choices all lead to one node in a LATER chapter): 9
- hard jumps (chapter advances, or scene change + big time jump, along an edge): 36

## False-choice nodes
imp_108, imp_107, imp_o_agri_1, imp_o_agri_2, imp_o_agri_3, imp_o_agri_4, imp_o_agri_5, imp_o_noble_1, imp_o_noble_2, imp_o_noble_3, imp_o_noble_4, imp_o_noble_5, imp_202, imp_301, imp_311, imp_415, imp_506, imp_516, imp_602, imp_605, imp_610, imp_611, imp_701, imp_714, imp_801, imp_806

## Shallow branches
imp_101(rejoin@1), imp_102(rejoin@1), imp_103(rejoin@1), imp_105(rejoin@1), imp_201(rejoin@1), imp_204(rejoin@1), imp_208(rejoin@1), imp_302(rejoin@1), imp_306(rejoin@1), imp_401(rejoin@1), imp_402(rejoin@1), imp_403(rejoin@1), imp_407(rejoin@1), imp_405(rejoin@1), imp_412(rejoin@1), imp_502(rejoin@1), imp_503(rejoin@1), imp_504(rejoin@1), imp_510(rejoin@1), imp_511(rejoin@1), imp_603(rejoin@1), imp_608(rejoin@1), imp_703(rejoin@1), imp_707(rejoin@1), imp_710(rejoin@1), imp_802(rejoin@1)

## Forced chapter steps
imp_107→imp_201(ch1→2)
imp_o_agri_5→imp_201(ch1→2)
imp_o_noble_5→imp_201(ch1→2)
imp_209→imp_301(ch2→3)
imp_311→imp_401(ch3→4)
imp_415→imp_501(ch4→5)
imp_516→imp_601(ch5→6)
imp_611→imp_701(ch6→7)
imp_714→imp_801(ch7→8)

## Hard jumps (edge: scene/time/chapter change)
imp_104→imp_108(cathedral→underhive, time {"d":3})
imp_107→imp_201(ship_interior→barracks, ch1→2)
imp_o_agri_5→imp_201(ship_interior→barracks, ch1→2)
imp_o_noble_4→imp_o_noble_5(cathedral→ship_interior, time {"d":3})
imp_o_noble_5→imp_201(ship_interior→barracks, ch1→2)
imp_202→imp_204(barracks→ship_interior, time {"d":6})
imp_206→imp_208(ship_interior→warp, time {"d":30,"warp":true})
imp_207→imp_208(ship_interior→warp, time {"d":30,"warp":true})
imp_209→imp_301(ship_interior→trench, time {"d":4}, ch2→3)
imp_310→imp_311(trench→barracks, time {"d":9})
imp_307→imp_311(trench→barracks, time {"d":9})
imp_308→imp_311(trench→barracks, time {"d":9})
imp_309→imp_311(trench→barracks, time {"d":9})
imp_311→imp_401(barracks→ruins, time {"y":1}, ch3→4)
imp_411→imp_end_servitor(cathedral→ship_interior, time {"y":3})
imp_415→imp_501(burning_city→warp, time {"d":50,"warp":true}, ch4→5)
imp_501→imp_502(warp→jungle, time {"d":3})
imp_505→imp_end_brood(cathedral→jungle, time {"y":6})
imp_516→imp_601(void→ship_interior, time {"y":2}, ch5→6)
imp_601→imp_602(ship_interior→barracks, time {"d":10})
imp_601→imp_604(ship_interior→barracks, time {"d":10})
imp_603→imp_602(ship_interior→barracks, time {"d":10})
imp_603→imp_604(ship_interior→barracks, time {"d":10})
imp_602→imp_605(barracks→ship_interior, time {"d":3})
imp_604→imp_605(barracks→ship_interior, time {"d":3})
imp_607→imp_608(warp→ship_interior, time {"d":4})
imp_608→imp_611(ship_interior→warp, time {"d":20,"warp":true})
imp_610→imp_611(barracks→warp, time {"d":20,"warp":true})
imp_611→imp_701(warp→burning_city, ch6→7)
imp_708→imp_end_traitor(ruins→burning_city, time {"y":1})
imp_711→imp_714(underhive→burning_city, time {"d":5})
imp_712→imp_714(cathedral→burning_city, time {"d":5})
imp_714→imp_801(burning_city→hive_spire, ch7→8)
imp_808→imp_end_crusade(throne_light→void, time {"d":30})
imp_808→imp_end_hold(throne_light→hive_hab, time {"y":1})
imp_808→imp_end_purged(throne_light→cathedral, time {"d":3})
