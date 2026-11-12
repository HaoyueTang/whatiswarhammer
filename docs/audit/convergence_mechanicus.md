# Convergence report: mechanicus

- nodes: 89; nodes with ≥2 choices: 67
- **false-choice nodes** (all choices → same next node; choice changes only a result line): 46 (69% of multi-choice nodes)
- choices that have their own follow-up node (not shared with a sibling): 22/166 (13%)
- shallow branches (siblings re-merge within ≤1 step, i.e. the branch has no follow-up scene of its own): 16
- forced chapter steps (a node whose choices all lead to one node in a LATER chapter): 6
- hard jumps (chapter advances, or scene change + big time jump, along an edge): 31

## False-choice nodes
mech_102, mech_103, mech_105, mech_106, mech_108, mech_o_savant_1, mech_o_savant_2, mech_o_savant_3, mech_o_conscript_1, mech_o_conscript_2, mech_o_conscript_3, mech_o_conscript_4, mech_201, mech_202, mech_203, mech_206, mech_207, mech_208, mech_209, mech_301, mech_302, mech_303, mech_305, mech_307, mech_308, mech_309, mech_401, mech_402, mech_403, mech_405, mech_407, mech_408, mech_503, mech_507, mech_506, mech_508, mech_509, mech_602, mech_607, mech_608, mech_609, mech_702, mech_703, mech_704, mech_705, mech_804

## Shallow branches
mech_101(rejoin@1), mech_104(rejoin@1), mech_107(rejoin@1), mech_204(rejoin@1), mech_205(rejoin@1), mech_304(rejoin@1), mech_404(rejoin@1), mech_501(rejoin@1), mech_502(rejoin@1), mech_504(rejoin@1), mech_601(rejoin@1), mech_604(rejoin@1), mech_701(rejoin@1), mech_706(rejoin@1), mech_801(rejoin@1), mech_802(rejoin@1)

## Forced chapter steps
mech_108→mech_201(ch1→2)
mech_209→mech_301(ch2→3)
mech_309→mech_401(ch3→4)
mech_409→mech_501(ch4→5)
mech_509→mech_601(ch5→6)
mech_609→mech_701(ch6→7)

## Hard jumps (edge: scene/time/chapter change)
mech_109→mech_end_servitor(manufactorum→forge_floor, time {"d":3})
mech_108→mech_201(same scene, time {"d":20}, ch1→2)
mech_o_savant_1→mech_o_savant_2(hive_hab→manufactorum, time {"d":3})
mech_o_savant_3→mech_o_savant_4(tech_vault→forge_floor, time {"d":4})
mech_o_conscript_1→mech_o_conscript_2(barracks→ruins, time {"d":5})
mech_o_conscript_2→mech_o_conscript_3(ruins→barracks, time {"d":10})
mech_202→mech_203(forge_floor→tech_vault, time {"d":3})
mech_205→mech_207(tech_vault→forge_floor, time {"d":10})
mech_206→mech_207(tech_vault→forge_floor, time {"d":10})
mech_208→mech_209(mars_vista→tech_vault, time {"d":5})
mech_209→mech_301(tech_vault→manufactorum, time {"d":14}, ch2→3)
mech_303→mech_304(barracks→ruins, time {"d":4})
mech_306→mech_307(ruins→tech_vault, time {"d":20})
mech_305→mech_307(ruins→tech_vault, time {"d":20})
mech_307→mech_308(tech_vault→manufactorum, time {"d":10})
mech_308→mech_309(manufactorum→ship_interior, time {"d":30})
mech_309→mech_401(same scene, time {"d":40,"warp":true}, ch3→4)
mech_408→mech_409(ship_interior→burning_city, time {"d":5})
mech_409→mech_501(same scene, ch4→5)
mech_506→mech_508(forge_floor→manufactorum, time {"d":3})
mech_508→mech_509(manufactorum→tech_vault, time {"d":4})
mech_509→mech_601(same scene, ch5→6)
mech_604→mech_605(manufactorum→forge_floor, time {"d":3})
mech_606→mech_605(manufactorum→forge_floor, time {"d":3})
mech_609→mech_701(void→burning_city, ch6→7)
mech_706→mech_end_heretek(burning_city→daemon_world, time {"y":5,"warp":true})
mech_707→mech_801(same scene, ch7→8)
mech_707→mech_end_heretek(forge_floor→daemon_world, time {"y":5,"warp":true})
mech_805→mech_end_magos(forge_floor→manufactorum, time {"y":3})
mech_805→mech_end_explorator(forge_floor→void, time {"y":1,"warp":true})
mech_805→mech_end_purged(forge_floor→tech_vault, time {"d":9})
