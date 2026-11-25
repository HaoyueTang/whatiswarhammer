# gsc — effect logic review (2026-11-25)

Effects only; no ids, `next`, roll targets, flags, conditions, order or texts changed. 18 edits in `data/factions/gsc.js`.

## Changes (node.choice: before → after — why)
- gsc_104.0 向他道歉: 智-3 望+5 → 智+2 望+5 — an accepted apology eases the conscience; it must not cost sanity.
- gsc_105.1 替老工友说句话: 望+4 智-3 → 望+4 — speaking up for someone is not a sanity loss; the cost is the `ganttMarked` flag.
- gsc_202.3 指认提奥: 望-10 → 望-10 智-3 — betrayal carried no guilt on the choice and was cheaper than slipping away (智-5).
- gsc_205.2 “又是星期天。”: 智+3 → 智+3 望-3 — a hint to the enforcers is informing; kinship drops.
- gsc_205.3 一言不发: 命-8 → 命-6 望+3 — keeping the secret through a night in the cell earns kinship (renownHelp: 守秘).
- gsc_306.2 默念帝皇之名: 命-6 智+4 → 命-3 智+4 — aching temples are a small physical cost, not a wound.
- gsc_309 (landing effect): 命-10 望-10 → 智-4 望-10 — the text says "他没有打你"; hp loss contradicted it. Dread instead.
- gsc_wl_01.1 “要是她数出来不对呢？”: 智-2 望+2 → 智-2 — a doubting question must not raise kinship.
- gsc_wl_03.0 药归家里: 望+8 智-3 腐+3 → 望+8 智-4 — falsifying a register is mundane wrong: conscience, not corruption.
- gsc_wl_04.1 顶别人的工牌: 智-2 望+3 腐+2 → 智-3 望+3 — same reason (forty-seven men lose their rations = guilt).
- gsc_wl_06.0 提着灯等到吃完: 智-2 腐+2 → 智-3 腐+2 望+3 — staying is effort for the family (sibling "leave" costs 望-3); corruption kept, the supper is the brood's.
- gsc_504.0 “是爱。睡吧。”: 腐+3 望+4 → 智-3 望+4 — lying to a child and not sleeping is conscience, not taint.
- gsc_506.0 看那行蓝色的小字: 智-6 望+4 → 智-6 望-4 — "they are the meal, you need not be" sets you apart from the family.
- gsc_607.0 “我带你去。”: 望-5 → 望-5 智-3 — handing the family over with no terms.
- gsc_607.1 “先答应我：放过孩子们。”: 智-3 → 望-5 智+2 — same betrayal for the family (was free), but the terms ease the conscience.
- gsc_707.2 拉他一起走: 命-5 望+4 → 望+4 — nothing in the result hurts you.
- gsc_801.0 带审判官去找老祖宗: 望+2 → 望-6 — leading the Inquisitor to the Grandsire cannot raise kinship.
- gsc_803.0 去星语塔: 命-10 望+5 → 命-10 智+3 — warning the Imperium is not kinship; it is a deed that steadies you.

## Flagged rows judged fine
- gsc_o_kin_1.0 (PIOUS, 腐+2): the prayer is to the four-armed icon and the hum grows — brood contact, not Imperial faith.
- gsc_509.1 (CALM, 智-4): Teo is relieved, you are not — you now carry the truth alone.

## Seen, not changed (candidates for a later pass)
- gsc_o_warden_1.1 照规矩归档 望+2: reads as "the secret stays buried"; a player cannot guess it.
- gsc_305.1 转身就跑: no kinship loss for fleeing the Grandsire (roll choice; landing 307 gives 智-8 only).
- gsc_212.0 / gsc_312.2 (wearing the bead, reports to Vask): no kinship loss — the family does not know yet.
- gsc_408.3 “少说两句” 智+3; gsc_wl_08.1 望+3; gsc_108.1 智-5 without 望.
- Many odd-looking sums in the table come from landing-node effects (e.g. o_warden_3 智-6, 506 智-15, 407b 腐+8), which their node texts justify.

## Numbers
- Changes: 18 (17 choice effects + 1 node effect). Texts/labels: 0.
- Flags: 2 → 2 (both judged fine).
- Death rate before: 23.3% (sanity 22.2 / hp 1.0 / corruption 0.1); claim rate 4.0%.
- Death rate after: NOT measured — deadline moved to 20:00 UTC; coordinator runs the validator. Expected small: net sanity roughly neutral, hp slightly easier (−8 hp of costs removed on optional branches), corruption slightly lower.
- route_graph gsc: 0 ERROR; intro_audit gsc: 0 gaps; effect_audit runs.
