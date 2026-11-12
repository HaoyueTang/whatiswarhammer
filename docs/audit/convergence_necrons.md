# Convergence report: necrons

- nodes: 99; nodes with ≥2 choices: 60
- **false-choice nodes** (all choices → same next node; choice changes only a result line): 37 (62% of multi-choice nodes)
- choices that have their own follow-up node (not shared with a sibling): 50/147 (34%)
- shallow branches (siblings re-merge within ≤1 step, i.e. the branch has no follow-up scene of its own): 16
- forced chapter steps (a node whose choices all lead to one node in a LATER chapter): 7
- hard jumps (chapter advances, or scene change + big time jump, along an edge): 18

## False-choice nodes
nec_102, nec_103, nec_105, nec_104, nec_106, nec_107, nec_o_convict_1, nec_o_convict_2, nec_o_convict_3, nec_o_convict_4, nec_o_lexmech_1, nec_o_lexmech_2, nec_o_lexmech_3, nec_o_lexmech_4, nec_209, nec_303, nec_307, nec_311, nec_312, nec_402, nec_407, nec_409, nec_503, nec_506, nec_505, nec_508, nec_602, nec_603, nec_607, nec_605, nec_702, nec_703, nec_705, nec_707, nec_708, nec_706, nec_810

## Shallow branches
nec_101(rejoin@1), nec_201(rejoin@1), nec_205(rejoin@1), nec_208(rejoin@1), nec_210(rejoin@1), nec_301(rejoin@1), nec_305(rejoin@1), nec_308(rejoin@1), nec_401(rejoin@1), nec_404(rejoin@1), nec_501(rejoin@1), nec_504(rejoin@1), nec_601(rejoin@1), nec_701(rejoin@1), nec_802(rejoin@1), nec_804(rejoin@1)

## Forced chapter steps
nec_107→nec_201(ch1→2)
nec_209→nec_301(ch2→3)
nec_312→nec_401(ch3→4)
nec_409→nec_501(ch4→5)
nec_510→nec_601(ch5→6)
nec_511→nec_601(ch5→6)
nec_706→nec_801(ch7→8)

## Hard jumps (edge: scene/time/chapter change)
nec_107→nec_201(tomb_exterior→dig_site, ch1→2)
nec_208→nec_210(tomb_exterior→tomb_interior, time {"d":3})
nec_209→nec_301(tomb_exterior→tomb_interior, ch2→3)
nec_210→nec_301(same scene, ch2→3)
nec_312→nec_401(tomb_exterior→tomb_interior, time {"d":40}, ch3→4)
nec_405→nec_409(tomb_interior→stasis_gallery, time {"d":6})
nec_406→nec_409(dig_site→stasis_gallery, time {"d":6})
nec_407→nec_409(tomb_interior→stasis_gallery, time {"d":6})
nec_408→nec_409(tomb_interior→stasis_gallery, time {"d":6})
nec_409→nec_501(same scene, time {"y":380}, ch4→5)
nec_510→nec_601(same scene, time {"d":5}, ch5→6)
nec_511→nec_601(same scene, time {"d":5}, ch5→6)
nec_605→nec_606(webway→tomb_exterior, time {"y":700,"warp":true})
nec_606→nec_701(tomb_exterior→dig_site, ch6→7)
nec_606→nec_702(tomb_exterior→tomb_interior, ch6→7)
nec_706→nec_801(same scene, ch7→8)
nec_808→nec_end_truth(dig_site→void, time {"d":30,"warp":true})
nec_809→nec_end_curator(tomb_interior→stasis_gallery, time {"y":1})
