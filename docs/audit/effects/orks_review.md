# Effect review — orks (2026-11-25, cut short by the 20:00 UTC deadline)

## Changes (1)
- ork_210.1 "扔下铁板趴下 / Drop the plate and hit the dirt": `{sanity:-5}` → `{sanity:-3, renown:-3}`. The result says the boyz are disappointed (chickening out = 牙币 down per renownHelp); the sibling who stands gets 望+5, so ducking now has the opposite sign. Sanity cost reduced so the outcome is not harsher overall. Text unchanged.

## Flagged rows judged fine / not changed
- ork_210.1 INJURY (命+3): the +3 hp comes from the landing node ork_211, not the choice; the player is not hurt in the result (the plate is). Left.
- ork_303.2 INJURY (望+2, release the squig): nobody is hurt; the Dok is amused. Fine.
- ork_306.0 INJURY (智-5, taint n): the hp cost of the graft is already paid on the ork_303 fail branch; this row is the horror of the finger. Fine.
- 3 further flags (2 INJURY, 1 HORROR) in the rows after ork_701: NOT reviewed.

## Not reviewed (out of time)
- Rows from ork_701 to the end of the table were not read. Rows before that were read once but only the flagged ones were judged.
- Candidates noticed but not changed (not sure enough): ork_507.0/.1 (result says half the orks punch you, effects 命+5 — may be landing-node hp); ork_311.3 (snatching Edna's bread gives 智+5 — guilt for chosen cruelty should cost sanity; may be landing-node sanity); ork_204.1 (informing on Snaggit 望+5 with no sanity cost); ork_w07.0 / ork_w09.0 (腐+4 / 腐+3 for mundane gun-loading / taking teef, no warp tie in the text); ork_402.0 ("我听您的，政委" no effects while siblings cost).

## Numbers
- Changes: 1. Flags: 6 before → 6 after (the ork_210 flag is the landing node's hp).
- Death rate before: 34.1% (validator baseline, 0 change expected: the edit only lowers a sanity cost and moves renown by -3). After: not measured — full validator skipped per the deadline.
- route_graph / intro_audit: see handback.
