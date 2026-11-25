# Effect review — imperium (2026-11-25, cut short by the 20:00 UTC deadline)

All 240 rows of `effects/imperium.md` were read; only the three changes I was sure of were applied.

## Changes (3)
- imp_402.1 "去报告政委": — → 望+3. Reporting heresy is what 信仰 rewards; the sibling (agreeing with Brin) costs 智-5 腐+15, this one had nothing.
- imp_403.1 "去报告政委": — → 望+3. Same reason (sibling: 智-5 腐+5).
- imp_703.2 "缩在泥里，等它走远": 命-10 智-10 → 智-10 望-5 (landing adds 智-5 腐+5). The text shows no bodily harm; hiding while a comrade dies is cowardice, which is 信仰↓.

## ⚑ rows judged fine (4, unchanged)
- imp_w06.1 success (INJURY): the "wound" is the dead gunner's, rewritten in the ledger; 智-5 is the guilt.
- imp_801.2 (INJURY): the text says the wound stops hurting; 命+5 腐+20 is intended.
- imp_504.0 success, imp_505.0 success (HORROR): roll successes, shared landing node; not changed (505 "wake screaming" could take 智-3..5 — candidate).

## Candidates NOT applied (not verified against the code in time)
- imp_310.1 success (keep running, survive): no 望 loss for the second flight.
- imp_407.1 hand the dagger to the commissar: same 智-5 as opening the gate, no 望 gain.
- imp_411.1 confess everything: 智-15, no 望.
- imp_412.1 push Brin out: 智-8 and 望-5 together (mercy should spare sanity).
- imp_608.1 chapel, names of family: 智-10 for a prayer; imp_610.0 clinking cups 智-5 (probably landing-node effects).
- imp_605.3 apology to Mina 智-10 equal to 605.2 insulting her.
- imp_708.0 lie to the lieutenant for Brin's ghost: no effect; imp_708.1 turn the intel over: 智-10, no 望.
- imp_713r.2 step between: 智-5 comes from the landing node imp_714 (choice itself is 命-5 望-5) — fine.
- imp_802.3 covering fire costs more (命-20 智-10) than a successful charge.
- imp_806.1 window gives more 望 (+13) than holding her hand (+10).
- imp_o_agri_3.1 / imp_o_noble_3.0: 望+3 weakly motivated.
- imp_w08p (pov) row shows 望+3: is it the landing node imp_w08's own effect? Not checked.

## Numbers
- Changes: 3. Flags: 4 → 4.
- Death rate before: 32.0% (sanity 22.4 / hp 4.9 / corruption 0.4; hive 34.6, agri 30.8, noble 30.5). After: NOT measured (validator not re-run; coordinator runs it). Expected direction: slightly down (one 命-10 removed).
- route_graph --checks-only: file loads; see hand-back for the ERROR count. intro_audit not re-run (no text changed).
