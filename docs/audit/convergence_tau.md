# Convergence report: tau

- nodes: 95; nodes with ≥2 choices: 59
- **false-choice nodes** (all choices → same next node; choice changes only a result line): 36 (61% of multi-choice nodes)
- choices that have their own follow-up node (not shared with a sibling): 38/135 (28%)
- shallow branches (siblings re-merge within ≤1 step, i.e. the branch has no follow-up scene of its own): 17
- forced chapter steps (a node whose choices all lead to one node in a LATER chapter): 7
- hard jumps (chapter advances, or scene change + big time jump, along an edge): 34

## False-choice nodes
tau_103, tau_104, tau_108, tau_107, tau_o_pow_1, tau_o_pow_2, tau_o_pow_3, tau_o_trader_1, tau_o_trader_2, tau_o_trader_3, tau_o_trader_4, tau_202, tau_204, tau_208, tau_209, tau_311, tau_401, tau_406, tau_408, tau_410, tau_411, tau_502, tau_504, tau_505, tau_507, tau_508, tau_509, tau_510, tau_604, tau_605, tau_611, tau_703, tau_706, tau_707, tau_708, tau_801

## Shallow branches
tau_101(rejoin@1), tau_102(rejoin@1), tau_105(rejoin@1), tau_201(rejoin@1), tau_205(rejoin@1), tau_302(rejoin@1), tau_303(rejoin@1), tau_308(rejoin@1), tau_402(rejoin@1), tau_407(rejoin@1), tau_501(rejoin@1), tau_506(rejoin@1), tau_602(rejoin@1), tau_606(rejoin@1), tau_609(rejoin@1), tau_702(rejoin@1), tau_802(rejoin@1)

## Forced chapter steps
tau_107→tau_201(ch1→2)
tau_209→tau_301(ch2→3)
tau_311→tau_401(ch3→4)
tau_411→tau_501(ch4→5)
tau_510→tau_601(ch5→6)
tau_611→tau_701(ch6→7)
tau_708→tau_801(ch7→8)

## Hard jumps (edge: scene/time/chapter change)
tau_103→tau_104(hive_hab→tau_city, time {"d":3})
tau_108→tau_107(tau_city→tau_outpost, time {"d":10})
tau_107→tau_201(same scene, time {"d":3}, ch1→2)
tau_o_pow_2→tau_o_pow_3(tau_outpost→hive_hab, time {"d":10})
tau_o_pow_3→tau_104(hive_hab→tau_city, time {"d":3})
tau_204→tau_205(tau_outpost→jungle, time {"d":20})
tau_206→tau_208(jungle→tau_city, time {"d":30})
tau_207→tau_208(jungle→tau_city, time {"d":30})
tau_208→tau_209(tau_city→ship_interior, time {"d":6})
tau_209→tau_301(ship_interior→tau_outpost, time {"d":40}, ch2→3)
tau_309→tau_311(tau_outpost→tau_city, time {"d":15})
tau_310→tau_311(tau_outpost→tau_city, time {"d":15})
tau_311→tau_401(same scene, time {"y":1}, ch3→4)
tau_403→tau_406(ruins→burning_city, time {"d":3})
tau_404→tau_406(hive_hab→burning_city, time {"d":3})
tau_405→tau_406(tau_city→burning_city, time {"d":3})
tau_407→tau_408(burning_city→tau_city, time {"d":6})
tau_409→tau_408(ruins→tau_city, time {"d":6})
tau_410→tau_411(ruins→tau_city, time {"d":14})
tau_411→tau_501(tau_city→tau_outpost, time {"y":1}, ch4→5)
tau_502→tau_504(tau_outpost→tau_city, time {"d":4})
tau_503→tau_504(tau_outpost→tau_city, time {"d":4})
tau_504→tau_505(tau_city→warp, time {"d":12,"warp":true})
tau_505→tau_506(warp→cult_shrine, time {"d":9})
tau_506→tau_508(cult_shrine→tau_outpost, time {"d":20})
tau_507→tau_508(cult_shrine→tau_outpost, time {"d":20})
tau_509→tau_510(tau_city→tau_outpost, time {"d":15})
tau_510→tau_601(tau_outpost→tau_city, time {"d":40,"warp":true}, ch5→6)
tau_611→tau_701(same scene, ch6→7)
tau_707→tau_708(tau_city→spore_sky, time {"d":3})
tau_708→tau_801(same scene, time {"d":4}, ch7→8)
tau_807→tau_end_enclaves(void→tau_outpost, time {"d":60,"warp":true})
tau_807→tau_end_citizen(void→tau_city, time {"y":1})
tau_807→tau_end_watch(void→ruins, time {"y":2})
