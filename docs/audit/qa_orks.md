# QA read-through · orks (v0.4.0, 2026-11-12)

Runs read: 18 `playthrough.js` runs (scrap / guard / ganger × seeds 1–3, `--first`, `--last`; one `--en` run per origin, seed 7) + 8 targeted seeds (10, 14, 18, 21, 27) to reach 814, 805b, 807, 702b, 706, collaborator, evacuated, freebooter. All nodes not seen in runs (102b, 105, 304/307, 408b, 702b, 705b, 706, 709b, 805b, 810/812/813, 814, every ending, claim and death nodes, route events and rumours) read in `data/factions/orks.js`. Lore checked against Lexicanum (Ghazghkull: 2nd and 3rd Armageddon wars, Grotsnik's adamantium plate, Da Great Waaagh! after Octarius with conflicting sightings in the Imperium Nihilus, so an Arcosa visit stays plausible-vague).

Gates (after the last edit): validate `--story-gate` PASS 0 errors · route_graph `--checks-only` 0 ERROR/WARN · date_audit 0 anachronisms. Story metrics unchanged (false choice 0, forced 0, unjustified jumps 0, never-read 0, gather 11, median 58). Death 31.9 → 30.9 %, good 26.0 → 26.1 %, claim 6.0 → 6.1 %: the shift appeared between two validator runs with no route-logic change and coincides with `data/events.js` being rewritten by the shared-events agent at 23:04 (its validator ERROR vanished at the same moment). My edits are text / `alt` / `resultAlt` only; re-running with my 708 change reverted gives the same 30.9 %.

## Fixed

| node | cat | problem | change |
|---|---|---|---|
| ork_504 | person/pronoun | "牵铜杆的兽人跑了。他在膨胀…" — "he" = the fled handler | → "牵铜杆的兽人都跑了。佐格拉克在膨胀…" (en "Zograk is swelling") |
| ork_312 alt ednaCircle | time | "埃德娜让你今晚去找她", but 402 (her vox scene) is ≥2 days later (401 h1 → 402 d2, or via 401b) | → "这两天夜里去找她" / "some night soon" |
| ork_606 alt sabotaged | assumed fact | "你把那根假线又做了一遍" assumes Wazgob repaired it — true only after 407b fail/confess; after 403 success or 407 pay/beg the cut was never found | neutral: "摸到动力管线，把那处假接头弄妥当" / "make sure of the fake join" |
| ork_702 alt flare | choice→result | "你打响的信号弹还挂在天上" — firing the flare is never shown (Voss: fire it when the gate opens) | → "你把沃斯给的信号弹打上了天。" |
| ork_708 | time/order | base ended "夜里，他们把你送到排水沟口" *before* the choice "我会回去 / 求你们现在就带我走"; alt lines from 701 ("hid in the hills a day…") and 706 were appended *after* being sent back | base → future ("天黑后，他们会送你回排水沟口"); 701 / 706 / 705b alts are now `text` replacements with the arrival first; the 705b version names "把你夹出来的老兵" (same veteran). Length ≤ 90 kept. |
| ork_301 alts askedPay / teefPockets | pronoun | "他又扔给你一颗" / "他瞥见你的口袋" follow the sentence about the pirate → reads as the pirate paying/robbing you | → "瓦兹格布…" (zh+en) |
| ork_301 alt origin_ganger | continuity | "红戈布的船还停在城外" — o_ganger_4 says the ship lifted off ~25 days earlier | → "红戈布的船又落在了城外" / "has set down… again" |
| ork_806 choice 0 | zh/en + assumed | zh "我跟你走，大机械佬。" shown even when Grukka won (Wazgob is not Big Mek); en was "Mek" | → "我跟你走，机械佬。" |
| ork_814 choice 0 | choice→result | "按下信标，等他们来接" right after pressing the beacon at 801 (strikePit path) | → "举起信标，等他们来接" / "Hold up the beacon and wait" |
| ork_803 "看着它熄火" result | repeated sentence | result "嗡嗡声停了…" then 814 opens "嗡嗡声停了。" | result → "你一动不动地看着。就是现在，正是政委要的那一刻。" |
| ork_404 choice "中士，是我。" | alt stacking | alt (heldLine / fledWithVoss) already has Voss recognise you; result had him "stare a long time" first | → "沃斯一把抱住了你…" |
| ork_603 | place | "在废料堆里找到了你" also after hiding in a cellar / staying in the workshop / the Dok's tent | → "仗还在打，一个披着红布的人类找到了你" |
| ork_506 | place | "瓦兹格布拦在门口" implies Zograk is in the workshop (scene fort, nothing moved him) | → "挡在他身前" / "plants himself in front of the Weirdboy" |
| ork_706 | choice→result | arriving from 705 (you just got the gate opened) Hale accuses you without any acknowledgement | new alt add fromNode 705: "大门是你打开的。可押你来的人只说了一句：他手上长着绿指头。" |
| ork_310 alt knelt | language | "格鲁卡还在为你那一跪生气：东西没找着。" (machine-like) | → "格鲁卡还在生气：刚才帮你在地上找了半天，啥也没找着。" |
| ork_104 choice 0 | person | after 102b the same nob already squeezed you and called you soft; generic result re-introduces "一个头目" | resultAlt hitOrk: "又是那个头目…“还是软！”" |
| ork_808 | person | "一位疤脸老兵" although on beacon paths it is the veteran you met (705/705b/708; alt marineOath "你说话算话…我也是") | → "舱口，疤脸老兵伸出手" |
| ork_end_grot alt snagFriend | alt stacking | "斯纳吉特一直跟在你身边" also when you later wronged him (409 button, 407 threat) | condition + notFlag wronged_snaggit |
| ork_o_ganger_4 en | zh/en | en adds "seventeen trips" (not in zh) | removed |

Names checked: 锯牙医生佬 / Dok Sawtoof (speaker, 303, 605, 809 choice, end_dok; short form 医生佬 / Dok elsewhere, codex `ork_painboyz` alias 医生佬/Dok) and 坏月亮 / Bad Moon(s) (302, 301 choice, 810, rumour `rum_ork_klans`, codex `ork_klans`, `ork_teef`) are consistent; no 巴兹戈布 / Buzzgob / 黄月亮 left anywhere in `data/`.

New nodes: **ork_814** follows both inbound edges (803 "看着它熄火" with shinyDead → base text; 801 beacon with strikePit → alt text) and hands off to 808/809 with matching alts (809 fromNode 814 text, ranToGunship). **ork_805b** follows 805 "盔甲打得够响" and 812 (alt for the knocked-out tooth); both read right.

## Listed, not fixed

- **ork_810 "用扳手砸他的牙"** is offered after 803b "朝格鲁卡的眼睛扔扳手" failed (spanner chewed up; 805 alt: "你的扳手还卡在格鲁卡的牙缝里"). Needs `require: {notFlag: "threwSpanner"}` → changes which choices exist (balance), left for the lead.
- **ork_712 strikePit** result "你照老兵教的拧了三圈" — 708 never shows the veteran teaching any tuning; harmless, could add a clause at 708 (length is at the limit).
- **ork_705 / 705b** speaker label "疤脸老兵" while still helmeted (the scar is first seen at 708). Cosmetic.
- **ork_609** "埃德娜病倒后的第四十天" with `d:38` after 608 (+2 d) — fine; not changed.
- **Structure:** 29/40 branches still re-merge after ≤1 own node (all flag-echoed). It reads acceptably because the alts are dense, but ch5 (501→503) and ch8 (803/803b → 804/805) are mostly "same scene, different line".

## Shared files (for the lead)

- `evt_undivided_1` produced a validator ERROR at the start of my pass (`where.notNodes` "cha_701" missing in imperium/tau/necrons/mechanicus); gone after `data/events.js` changed at 23:04.
- Route event `evt_t_ork_cleanse` (in orks.js) still fires for a player who robbed Edna (`wronged_edna`); its texts are neutral enough ("埃德娜没说什么，只是多看了你一眼"), so left as is; the plan's `notFlag wronged_edna` was not applied.
- Shared events seen firing on this route (tzeentch_1/2, slaanesh_1/2, khorne_1, nurgle_2, undivided_2, other_1, t_any_dice/note/feast, new evt_nurgle_pen at 707): no scene contradictions found.
