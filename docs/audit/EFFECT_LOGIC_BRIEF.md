# Choice → effect logic — brief for the review writers (2026-11-25)

Owner (Howie): "重点要核查的是你的选择跟结果是否有逻辑 … 选择是否可以得到倾向于增加点数或者减少点数，这个中间的逻辑还差一点". Every stat change must follow from what the player chose and what the result says happened, and an attentive player should be able to guess the direction before clicking.

Your input: `docs/audit/effects/<route>.md` — one row per choice outcome (label | result / roll beat | effects = choice + landing node | ⚑ heuristic flag). Regenerate any time with `node tools/dev/effect_audit.js --route <id> --write`. The ⚑ flags are only hints; **read every row**, not just the flagged ones.

## What each stat means (apply everywhere)
- **命 hp** — the body. Drops only for physical harm or physical risk (fights, beatings, wounds, exposure, hunger, hard labour, surgery). Rises only for food, rest, treatment, augmetics. If the result shows you hurt → hp must drop; if it shows you fed / treated / rested → hp must not drop.
- **理智 sanity** — the mind and conscience. Drops for horror witnessed, warp contact, despair, and **guilt for cruelty you chose** (betraying, condemning, abandoning someone). Rises for rest, comfort, companionship, faith that steadies you, a mercy that eases your conscience. A choice described as calming must not cost sanity.
- **腐化 corruption** — warp taint, heresy, forbidden knowledge, bargains with voices, daemon contact (plus hidden `taint` toward a god). Prayer / faith / refusing the voice never raises it (Chaos route: corruption is the path, still only from warp/god contact). Mundane cruelty alone is sanity and renown, not corruption, unless the text ties it to the warp.
- **声望 renown** — what *this faction* values (label differs per route; it is the faction's judgement of you, not morality):
  - imperium 信仰: obedience, bravery, piety, reporting heresy ↑ · fleeing, cowardice, abandoning comrades, sparing heretics ↓
  - chaos 神恩: sacrifice, slaughter, daring to take, not flinching before the voice ↑ · mercy, retreat, betraying the warband ↓
  - tau 大义: obedience, patience, hard choices for the Greater Good ↑ · questioning, disobeying, favouring the old Imperium ↓
  - aeldari 命运: courage, honesty, the unexpected ↑ · retreat, betrayal ↓
  - necrons 价值: reading glyphs, keeping etiquette, telling good stories ↑ · rudeness, dullness, flight ↓
  - orks 牙币 (ork money + standing): work done fast, not chickening out in a fight ↑ · getting caught, spending, chickening out ↓
  - gsc 血亲: lying for the family, keeping the secret, giving effort ↑ · doubt, informing, refusing ↓
  - mechanicus 机眷: correct rite, precise calculation, pious inquiry ↑ · doubt, acting on feeling, clinging to flesh ↓

## Rules
1. **Direction follows the text.** Each delta is motivated by the label or the result; each thing the result says happened to you has its delta. No hidden opposite signs. If an outcome is deliberately a surprise, the result text says why.
2. **Conscience vs. faction is the core trade-off.** A merciful/defiant choice usually costs renown (in a faction that disapproves) and spares sanity; an obedient/cruel one gains renown and costs sanity. Do not reward both at once without a reason in the text.
3. **Predictable tendency.** From the label alone a player should guess which way it leans (whom you help, what risk you take, whom you obey). If a label hides a big cost, make the label hint at it (a verb of risk, a named victim).
4. **Risk ↔ reward.** A physically risky choice costs hp or is a roll; the safe choice gains less. A choice whose label grabs something (take, steal, rush, gamble) is not free when its siblings cost something.
5. **Siblings differ.** On one node, choices should not carry identical effects unless they differ in flags / route.
6. **Magnitude.** Keep the file's scale (small 2–5, normal 5–10, major 10–20). Keep the route's total balance: the validator simulates runs — death rate may move ≤ ±2 points, origins stay within ±6 of the route average, claim-ending rates in their band. Prefer sign/target fixes over making things harsher.
7. **pov nodes** stay effect-free.
8. You may change: effect numbers / signs / which stat, `result` texts (≤ 50 zh / 35 EN words), roll beats, labels (lightly, ≤ 24 zh). Never change ids, `next`, roll targets, flags, conditions, choice order. Keep zh and en in step.
9. Prefer fixing the **effect** when the text is right; fix the **text** when the effect is needed for balance or story.

## Verify (from /home/claude/whatiswarhammer)
- `node tools/dev/effect_audit.js --route <id>` (flag count down; leave a flag only if you judged it fine — note why)
- `node tools/dev/route_graph.js --faction <id> --checks-only` → 0 ERROR; `node tools/dev/intro_audit.js --route <id>` → 0 gaps
- `node tools/dev/validate.js 2>&1 | grep -E "^ERROR|^PASS|^FAIL|<id>"` — other writers edit other files in parallel; validate takes ~2–3 min; report death-rate before/after for your route (it is in the validator's route line).

## Hand back
Write `docs/audit/effects/<route>_review.md`: one line per change (node.choice: before → after, why), then the rows you judged fine despite a ⚑, then numbers (changes, flags before/after, death rate before/after). Reply with a 5-line summary.
