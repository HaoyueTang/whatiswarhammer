# Effect review — aeldari (2026-11-25, cut short by the 20:00 UTC deadline)

Only `data/factions/aeldari.js` edited. 3 changes, all effect-only (no text, ids, next, flags, rolls touched).

## Changes
- eld_w04.1 "告诉她：石头里住着死人": 智+3 望-3 → 智+3. Honesty is what 命运 rewards (renownHelp), and Heska hands the stones over anyway, so the job is done; the −3 had no reason in the text. The thief sibling keeps 望+5 / 智-6, so siblings still differ.
- eld_407.1 "鞠躬，退出神殿": 望+2 → no effect. Backing out of the shrine is a retreat; the result says the bow is "exactly what a guest is owed, no more, no less" = neutral.
- eld_608.2 "躲进树洞": 智-8 → 智-8 望-5 (table shows 智-13 with the landing node). Hiding while Mireth calls your name is the route's clearest 退缩与背弃; siblings gain 望+10/+15 for fighting. Not a death stat; may shift ending mix slightly (renown-gated good endings).

## ⚑ rows judged fine (all 10 left)
- eld_204 0/1/2 success (INJURY): the "wounds" are the skeleton's, not yours.
- eld_o_trooper_2s.0 (PRAISE): text says the lieutenant did NOT praise you.
- eld_806.3 (HORROR): "skull" is the Ynnari pendant; eld_804.0 fail (FREE): leads to an ending.
- eld_105.0 fail (HORROR), eld_310.0 success (INJURY, "喊到嗓子出血"), eld_706b.0 (INJURY), eld_801.2 (PIOUS, prayer row shows 腐+5 from the landing node): NOT reviewed in source — see open list.

## Read from the table but NOT fixed (candidates for a follow-up; source not checked)
- eld_801.2 pray: 腐+5 on a prayer row (probably landing node) — choice should offset it (rule: prayer never raises corruption).
- eld_411c.2 success "自己说": the brave/honest option gets no 望 while asking Elaris/the Exarch (0/1, identical effects) gets 望+5.
- eld_603.1 put the fruit down and leave: 望+5 unmotivated. eld_706.1 "再想一晚": 智-10 looks too harsh for the text.
- eld_o_pilgrim_4.0 lie to the priest: 智-13, no 望 cost for dishonesty. eld_202.0/1: handing Nell over 智+5 望+5 vs keeping her 智-5 reads inverted against the follow-up text.
- eld_106.1 success: 命-5 with no harm in the result. eld_105 fail / eld_o_trooper_2.1 fail: sparks in your hands, no 命 loss. eld_310.0 success: throat bleeds, no 命 loss.
- eld_305.1/.2 identical 望+2 (lowering your head is not "unexpected"). eld_610.0/.1, eld_o_pilgrim_5.1 / eld_o_trooper_5.1 / eld_107.1 (hiding gives 望+3): check text.

## Numbers
- Changes: 3. Flags: 10 → 10 (none of the edits touched a flagged row).
- Death rate before: 17.5% (agri 15.7, pilgrim 17.9, trooper 18.9; claim endings 13.8%). After: NOT measured (validator skipped per deadline; no hp/sanity/corruption value changed, so stat deaths should be unchanged).
- route_graph --checks-only and intro_audit run after the edits (file loads).
