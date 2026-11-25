# Effect review — mechanicus (2026-11-25)

Only `data/factions/mechanicus.js` edited. Effects below are the **choice's own** effects (the audit table adds the landing node's). No ids / next / rolls / flags / conditions / order changed.

## Changes (22)
- mech_104.2 踢它一脚: hp-10 → hp-5 renown-3 (+ result: the enginseer notes your number). A stubbed toe is small harm; acting on temper is what the Cult marks down.
- mech_105.1 问机魂是不是真的: sanity-3 → renown-3. "Query logged" = doubt on record, not a mental wound.
- mech_106.1 挣扎: hp-10 → hp-5 renown-2; result adds "grip until the bones creak" (text said they did not hit you, yet hp fell 10).
- mech_107.2 把前面那人往后拽: hp-10 sanity-5 → hp-5 sanity-3 renown-3; result now shows the harm (slammed into the doorframe, he goes in anyway).
- mech_107.3 把托宾往前推: sanity-5 → sanity-8. Chosen betrayal of a named friend should weigh more than a failed rescue.
- mech_204.0 帮她改进设计: renown+3 → sanity+3. Secret unsanctioned design cannot earn the Cult's favour; the text shows joy (taint unchanged).
- mech_209.2 入教要换掉多少肉: sanity-3 → renown-3. Clinging to flesh in front of the Magos (landing node still carries sanity-5).
- mech_304.2 对机魂念祷文: sanity-3 renown+3 → renown+3. A correct, calming rite must not cost sanity.
- mech_308.0 全心全意地发誓: renown+8 sanity-3 → renown+8. Result says you feel lighter.
- mech_403.0 "它们只是在睡觉": renown+3 → renown-2 sanity+3. Filed as "cowardly"; Kesh heeding you is the comfort.
- mech_407.1 删掉损坏的文件: text only — the zeros now stop after one night and the log shows a gap (old text contradicted sanity+5; renown-3 now visible).
- mech_503.0 追上去夺回香炉: hp-10 → hp-10 renown+5. The risky recovery of a sacred object earned nothing while the free trade earned +3.
- mech_506.0 帮凯什修腿: renown+5 hp-5 → renown+3 sanity+3. No harm in the text; "not quite canonical" trims the renown; helping a comrade steadies you.
- mech_601.0 听她说下去: sanity-5 → corruption+5. Forbidden knowledge described as doors opening = taint, not horror.
- mech_602.1 把钥匙扔进焚档炉: sanity-5 renown+5 → renown+5. Refusing the forbidden thing must not hurt the mind.
- mech_606.3 "停下！我要留着它们": sanity-5 renown-5 → renown-5. Defiance costs standing, spares the conscience (rule 2).
- mech_608.0 对反应堆唱祷文: sanity-5 → hp-5 renown+3. "Sing until your throat bleeds" is bodily harm plus a correct rite (clears INJURY flag).
- mech_701.1 带杂役们撤进地下: + renown-3. Leaving the line was a pure gain next to the costly sibling.
- mech_704.3 让锈接管它: sanity-5 → corruption+5. Warm, blooming rust is warp taint; text has no horror.
- mech_705.0 收下芯片，走: + sanity-3. Leaving Vallen to weld himself in was free while dragging him cost hp.
- mech_706.1 跑向反应堆: + renown+3. "Optimal solution" is exactly what the Cult rewards; sanity-5 stays for leaving Kesh.
- mech_801.1 给反应堆唱那段祷文: sanity-5 → sanity+3. It knows your voice and the hall turns gold — nothing harmful in the text.

## Flags judged fine
- mech_o_savant_2.0 (SHAME): renown+5 for exposing a false ledger is precise calculation; the hauling punishment is the hp-5.
- mech_504.0 success (INJURY): the robot swats the Mek, not you; hp+10 is the landing node's rest after the battle.
- mech_707.3 (INJURY): "tears the seals" is about the box; corruption is the right stat.
- Not flagged, left on purpose: mech_o_conscript_2.0 hp-20 (radium carbine, stated in the result; origin balance), mech_804.3 sanity+5 ("still alive"), mech_505.2 (leads straight to an ending).

## Numbers
- 22 changes (21 effect, 1 text-only; 3 of the effect changes also touch the result text, zh+en).
- effect_audit flags 4 → 3.
- route_graph --checks-only: loads, no new findings. intro_audit: one pre-existing line (mech_end_claim_tzeentch speaker), untouched node.
- Death rate before: 28.6% (sanity 10.0% + hp 16.6%; claim 8.9%). After: NOT measured — deadline moved to 20:00 UTC, coordinator runs the validator. Expected direction: slightly down (several sanity/hp costs removed, few added).
