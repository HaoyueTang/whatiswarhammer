# Random events — choice → effect review (2026-11-25)

Scope: `data/events.js` (13 events), `data/events_lore.js` (9), `data/events_taint.js` (32). All choices read directly (effect_audit does not cover events). Ork / GSC / Mechanicus route events (`evt_t_gsc_*`, `evt_ork_*`, `evt_gsc_*` …) are registered outside these three files and were NOT reviewed.

Main pattern found: **renown given for things nobody sees** (dreams, a flower in a boot, a knock at night) or for acts only one faction would approve; in a shared (`*`) event renown must fit every faction, so those were removed or the result now shows a witness. Second pattern: **hp dropping while the text shows treatment or no harm**.

## Changes — events.js
- evt_khorne_1 “好”: renown +3 → 0. A private dream; only Chaos would count it.
- evt_khorne_2 还手: renown +3 → 0, hp −5 → −3; result now says your knuckles split and you keep the ration ("some fear, some respect" = mixed → neutral in every faction).
- evt_nurgle_2 一脚踩烂: renown +2 → 0 (unseen; Chaos would even disapprove).
- evt_tzeentch_1 照纸条做: renown +5 kept; result now shows why (you held the others back, they trust your word).
- evt_tzeentch_1 偏要走左边: hp −10, sanity +5 → sanity −3. Text says nothing happens to you; result ends on a chill instead of relief.
- evt_tzeentch_2 问它是哪一步: renown +6 kept; result now says you avoid the step and others take it for foresight.
- evt_slaanesh_1 把剩下的扔掉: sanity −8, renown +3 → sanity −5, hp −3 (text: can't eat for days; nobody saw it).
- evt_slaanesh_2 再做一次: sanity +3 → −3 (text: cannot sleep); renown +6 kept, result now says nobody can fault your work.
- evt_undivided_1 用刀刮掉: renown +3 → 0 (done alone at night; 上报 keeps +5 as the seen, obedient act).
- evt_undivided_2 敲回去: renown +5 → 0, sanity −5 → −2; result adds a quiet night's sleep. Now a clear trade against the prayer (sanity −8, no corruption).
- evt_other_1 背过身去: corruption +3, renown +2 → sanity −3 (turning away is not warp contact; Imperium would not reward it); result adds the noise returning.

## Changes — events_lore.js
- evt_lore_damocles 问人类为什么撤走: sanity +5 → −3 (you learn of the Tyranids; the reward is the codex entry).
- evt_lore_damocles 陪他看鱼: {} → sanity +4 (quiet company, pat on the shoulder).
- evt_lore_war_in_heaven 问“有机体”: sanity +5 → sanity −2, renown +2 ("because you rot" is no comfort; the question does make it think).
- evt_lore_silent_king 一言不发: sanity +3 → {} (an hour as nodding furniture is neither calming nor valued).
- evt_lore_isstvan “你们背叛了兄弟”: hp −5 → sanity −3 (no blow in the text); result adds the long stare and “有胆子” so renown +5 reads as daring.
- evt_lore_isstvan 悄悄走开: sanity +5 → sanity +3, renown −2 (walking out on a legionary's question = retreat in Chaos); result adds his snort.
- evt_lore_badab 关掉频道 renown 5 → 3; 报告上级 renown 3, sanity +3 → renown 5 (reporting should outrank ignoring; "no one thanks you" gave no reason for sanity).

## Changes — events_taint.js
- evt_t_imp_tzeentch 再翻一张: renown +5 kept; result adds bunkmates saying the Emperor guides you. 交给牧师 renown 2 → 3.
- evt_t_imp_khorne 追上去 renown 6 → 4 (brave but against the sergeant's order); 回掩体 gains renown +2 and the sergeant's nod (obedience).
- evt_t_imp_cleanse 都说出来: renown −2 kept; result now shows the priest writing a line in his ledger.
- evt_t_imp_nurgle 去找医师: hp −5, sanity +2 → hp +3, sanity −3 (a cleaned wound is treatment; the pain and his look are the cost).
- evt_t_tau_tzeentch 问使节: renown 2 → 3.
- evt_t_tau_khorne 敲到天亮: hp +8 kept; text changed from blisters to "old hurts stop aching, brimming with strength" (same Khorne gift as the other routes).
- evt_t_tau_nurgle 检疫站: hp −6 → hp −2, sanity −2 (an injection is not a wound; you queue coughing while alleys are sealed).
- evt_t_eld_cleanse 道谢不收: renown +2 → 0 (nothing in the text earns it).
- evt_t_eld_khorne 戴上面具: renown +5 → −3, result adds the guard shouting and the heat closing your wounds; 挂回去 gains renown +3 (the text already had the guard's first salute).
- evt_t_nec_khorne 握紧它: renown +5 → 0 (Necron 价值 has no reason to rise); hp +8 now in the text.
- evt_t_any_feast 热闹的那一头: renown +3 → 0 (praise in a dream).

## Judged fine / left for the owner
- evt_other_1 对着光祷告: no renown either way — private; Imperium would approve, Chaos and T'au would not, so neutral.
- evt_other_2 大声唱歌 sanity −10 vs 屏住呼吸 −5: singing holds the Shadow's gaze longer and buys renown +5; fits imperium / tau / gsc.
- evt_lore_terra_vision 看到最后 renown +5: fits imperium, chaos (not flinching), aeldari (courage); **weak for T'au** (a vision of the Emperor). No per-faction effects in the engine, so left.
- evt_lore_armageddon / cadia / fall / war_in_heaven "ask" choices (sanity −, renown +): grim knowledge, firmer standing; consistent pattern.
- evt_slaanesh_1 “我还要” sanity +8 and evt_t_nec_slaanesh 走近展台 sanity +6: the pleasure is the bait; the after-taste is the hidden taint.
- evt_t_nec_slaanesh 转身离开: text says a collector "will be disappointed, but not today" — no renown loss kept.
- **Claim events, resist choice: corruption +15** contradicts "refusing the voice never raises corruption", but it is the SPEC §18/§19 claim mechanic and moves claim-ending rates — not touched; owner's call.
- Taint-only temptations (no visible corruption) in events_taint.js are by design (SPEC §18).

## Numbers
- 31 choices changed in 25 events (effects on 26 choices, result text on 14); no ids, flags, conditions, order or `goto` touched.
- Files load: 13 / 9 / 32 events; `route_graph --faction imperium --checks-only` 0 ERROR.
- Death rate BEFORE (validator, start of session; other writers were editing in parallel): imperium 32.0 · chaos 28.2 · tau 26.0 · aeldari 17.5 · necrons 29.4 · orks 34.1 · gsc 23.3 · mechanicus 28.6; validate 0 errors. AFTER: **not measured** — deadline; coordinator runs the validator. Expected direction: slightly down (four hp losses removed or reduced, one hp +3; total renown from shared events lower).
