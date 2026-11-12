# Convergence report: chaos

- nodes: 111; nodes with ≥2 choices: 75
- **false-choice nodes** (all choices → same next node; choice changes only a result line): 44 (59% of multi-choice nodes)
- choices that have their own follow-up node (not shared with a sibling): 56/184 (30%)
- shallow branches (siblings re-merge within ≤1 step, i.e. the branch has no follow-up scene of its own): 17
- forced chapter steps (a node whose choices all lead to one node in a LATER chapter): 7
- hard jumps (chapter advances, or scene change + big time jump, along an edge): 27

## False-choice nodes
cha_102, cha_103, cha_105, cha_107, cha_108, cha_o_deserter_1, cha_o_deserter_2, cha_o_deserter_4, cha_o_scribe_1, cha_o_scribe_2, cha_o_scribe_3, cha_o_scribe_4, cha_203, cha_205, cha_208, cha_209, cha_303, cha_304, cha_305, cha_306, cha_307, cha_310, cha_311, cha_402, cha_403, cha_404, cha_405, cha_407, cha_411, cha_501, cha_502, cha_505, cha_506, cha_508, cha_509, cha_606, cha_610, cha_611, cha_612, cha_707, cha_710, cha_711, cha_808, cha_809

## Shallow branches
cha_101(rejoin@1), cha_104(rejoin@1), cha_o_deserter_3(rejoin@1), cha_201(rejoin@1), cha_204(rejoin@1), cha_301(rejoin@1), cha_401(rejoin@1), cha_406(rejoin@1), cha_503(rejoin@1), cha_602(rejoin@1), cha_604(rejoin@1), cha_701(rejoin@1), cha_702(rejoin@1), cha_703(rejoin@1), cha_704(rejoin@1), cha_705(rejoin@1), cha_708(rejoin@1)

## Forced chapter steps
cha_108→cha_201(ch1→2)
cha_209→cha_301(ch2→3)
cha_311→cha_401(ch3→4)
cha_411→cha_501(ch4→5)
cha_509→cha_601(ch5→6)
cha_612→cha_701(ch6→7)
cha_711→cha_801(ch7→8)

## Hard jumps (edge: scene/time/chapter change)
cha_108→cha_201(same scene, time {"d":14}, ch1→2)
cha_207→cha_205(underhive→cult_shrine, time {"d":30})
cha_205→cha_208(cult_shrine→manufactorum, time {"d":20})
cha_208→cha_209(manufactorum→cult_shrine, time {"d":3})
cha_209→cha_301(cult_shrine→burning_city, time {"d":9}, ch2→3)
cha_311→cha_401(same scene, time {"d":3}, ch3→4)
cha_405→cha_406(cult_shrine→underhive, time {"d":4})
cha_411→cha_501(underhive→burning_city, time {"d":40}, ch4→5)
cha_503→cha_505(ruins→ship_interior, time {"d":5})
cha_504→cha_505(ruins→ship_interior, time {"d":5})
cha_506→cha_507(warp→daemon_world, time {"d":1,"warp":true})
cha_508→cha_506(ship_interior→warp, time {"d":60,"warp":true})
cha_509→cha_601(same scene, time {"y":3,"warp":true}, ch5→6)
cha_610→cha_611(daemon_world→ship_interior, time {"d":5})
cha_612→cha_701(ship_interior→burning_city, time {"d":30,"warp":true}, ch6→7)
cha_706→cha_708(burning_city→ruins, time {"d":3})
cha_708→cha_709(ruins→throne_light, time {"h":1,"warp":true})
cha_711→cha_801(ruins→burning_city, ch7→8)
cha_802→cha_end_vanish(ruins→underhive, time {"y":2})
cha_803→cha_807(ruins→warp, time {"h":1,"warp":true})
cha_805→cha_end_champion(ruins→void, time {"d":9,"warp":true})
cha_806→cha_end_vanish(cathedral→underhive, time {"y":2})
cha_806→cha_807(cathedral→warp, time {"h":1,"warp":true})
cha_807→cha_end_prince(warp→daemon_world, time {"y":100,"warp":true})
cha_claim_khorne→cha_end_claim_khorne_chosen(burning_city→daemon_world, time {"y":30,"warp":true})
cha_claim_nurgle→cha_end_claim_nurgle_chosen(underhive→daemon_world, time {"y":30,"warp":true})
cha_claim_slaanesh→cha_end_claim_slaanesh_chosen(daemon_world→throne_light, time {"y":30,"warp":true})
