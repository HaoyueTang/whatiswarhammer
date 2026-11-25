# Effect review — necrons (2026-11-25, cut short by the 20:00 UTC deadline)

## Changes (9 outcomes; 2 effect changes, 1 effect swap, 6 text-only)
- nec_205.1 (hold the exit): text "绿光一次也没碰到你" → "绿光只燎到了你的手背" — effect is 命-6, the text said you were untouched. Effect kept.
- nec_303.0 (pretend to eat): text adds "胃在偷偷地叫" — motivates the 命-5 (hunger). Effect kept.
- nec_312.1 (swear to the Stormlord): text adds "那一夜没有打雷" — motivates 智+5 (the safe option; sibling .2 gets the lightning). Effect kept.
- nec_404.1 (take me, free my companions): 望-5 → 望-5 智+5; text adds "一件会讲价的回礼：他的眼光暗了一度。你却松了口气。" — mercy eases conscience, haggling is the rudeness that costs worth (rule 2).
- nec_407.0 (back away from the shard): 命-5 → 望-3; text adds "像送回一件想逃的回礼" — the spyder lifts you "very gently", so no hp loss; flight costs worth.
- nec_601.0 (help the rangers free the seer): 望-5 → 望-5 智+3 — defiant/merciful choice spares conscience; siblings (alarm / trap) are 望+ 智-5.
- nec_805.1 ("I'm nobody special"): text adds "它的目光刮过你，冷进骨头" — motivates 智-10. Effect kept.
- nec_808.0 fail (run for the shuttle): text "一发子弹打穿了你的腿" → "打飞了你脚边的沙" — a roll outcome cannot carry its own effects and nec_809 has no hp loss, so the wound had no delta.
- nec_810.0 (stand between the lines): text adds "一发走火擦破了你的小腿" — motivates 命-5. Effect kept.

## Flags left (5), judged fine
- nec_504.2 INJURY: heuristic hit on "打断" (interrupt); nobody is hurt.
- nec_701.1 fail INJURY: heuristic; 智-5 is the landing node (inquisitor called).
- nec_509.3 success FREE: reward is the `stasisKey` flag; the risk is the fail branch (命-10 望-5).
- nec_808.0 success/fail FREE: ending roll; fail text no longer claims a wound.

## Seen, NOT changed (out of time — candidates for a next pass)
- nec_504.3 success (joke lands, "讲解员会幽默") gains nothing while safe siblings give 望+5..+10: needs per-outcome roll effects (engine has none) or a landing-node change.
- nec_o_convict_1.1 (call the guard): no effect although marked "积极" and the convicts go silent (suggest 望+2 智-3).
- nec_o_convict_3.0 (bet it's a prank, lose rations): 智+5 not explained in the result.
- nec_210.1 (teach easier dig): 智+5 not explained.
- nec_307.1 ("Show me"): 腐+5 though refused; "好奇心记一笔" reads like 望+.
- nec_602.2 (go with the rangers) 智-5, nec_806a.1 (stay) 智-3: no reason in the result.
- nec_708.2 (tear the book): 望+3 and 命-5 weakly motivated.
- nec_810.1 (hide in a crater): 智+5 with no worth cost for hiding.

## Numbers
- Changes: 9 outcomes. Flags 5 → 5 (all judged fine).
- Gates after edit: file loads, route_graph 0 ERROR, intro_audit unchanged, effect_audit runs.
- Death rate: baseline validator PASS 0 errors / 36 warnings, necrons claim rate 4.2% (band 3–8); route death-rate line not captured and NO validator run after the edits (deadline). Expected drift small and downward (one 命-5 removed, 智+5 / 智+3 added on gated or minority choices).
