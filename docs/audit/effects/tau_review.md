# tau — effect logic review (2026-11-25, cut short by the 20:00 UTC deadline)

Scope: all 224 rows read once; only the four changes I was sure of were made. Renown only — no hp/sanity/corruption touched.

## Changes
- tau_102.1 举手问工钱的事: 智-5 → 智-5 望-3. Questioning in public is what 大义 marks down; the result (workers step away) already shows it.
- tau_105.1 坚持要一个答案: 智-5 → 智-5 望-3. Same: insisting after a warning; the drone follows you home.
- tau_205.1 让92号帮你赶走它: 望+8 → 望+4 (choice renown -4 on top of tau_206's +8). The safe option paid the same as passing the 14-hour roll.
- tau_303.2 留在树上掩护: 望+8 → 望+3 (choice renown +3 → -2, landing tau_306 gives +5). Staying in the tree paid more than jumping and winning the roll.

## Flags left (not reviewed in depth, not changed)
- tau_403.0成 INJURY, tau_606.0成 INJURY: the success beat mentions fighting nearby, the player is not hurt — looks fine.
- tau_609.1 FREE (带着人群往大门冲): the cost comes at tau_610 (Kel'ra's rifle, a roll or renown/sanity -10) — looks fine.

## Seen but not changed (candidates for a second pass)
- tau_107.2 先不签，再想想: 命-5 has no visible reason in the result.
- tau_508.1 拒绝，但替她保密: 智-5 望+2 — keeping a friend's secret costs sanity and gains renown; reads backwards.
- tau_706.2 摇醒凯尔拉 命+5 vs siblings 命-5: no reason in the text.
- tau_504.1 掐自己保持清醒 智-15: large for the label; label hints at resistance only.
- tau_o_pow_1.0 “为了吃饱” 智-5: result reads as approval, the sanity cost is not explained.

## Numbers
- Changes: 4 (all renown). Flags 3 → 3.
- Death rate before: 26.0% (sanity 22.1%, hp 3.8%). After: NOT measured (validator not re-run; deadline). Renown is not a death stat, so the rate should not move; ending mix (tau_end_citizen / thirdwave, renown-gated) may shift slightly.
- route_graph --checks-only: 0 ERROR after the edit; file loads.
