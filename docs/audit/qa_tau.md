# qa_tau.md — QA read-through, T'au route (v0.4.0)

Reader: Opus QA. Runs read: 17 (colonist --first, pow --last, trader seed 7 / --first, --en seeds 3 & 11, plus seeds 21/42/99 for each origin as path + spot reads), and the whole `data/factions/tau.js` read node by node (all alt / resultAlt / grudgeLine / death / claim / ending nodes).

Baseline = after: death 25.4 % · claims 8.3 % · good 25.3 % · gather 12 · median run 61 · false choices 0 · never-read flags 0 · route_graph checks: no ERROR/WARN · date_audit 0 anachronisms.

## Fixed (16)

| node | cat | problem | change |
|---|---|---|---|
| tau_101 | 1 people | choice names 雷娜姨 before she is introduced | label → 先去看看邻居雷娜姨 / "Visit your neighbour, Aunt Rena, first" |
| tau_107b | 5 stacking | lateSigner text says Jory left a week ago, but renaDistrust add says "she turns back to look at Jory" | add now `all[renaDistrust, notFlag lateSigner]` |
| tau_205 | 2 time | jump label "训练第三周" but clock is ~day 36 (201 d1 + 202 d10 + 204 d5 + 205 d20) | label → 训练一个多月后 / "Over a month into training" |
| tau_402 | 5 stacking | renaDistrust text "she didn't want to ask you" + add "she walks in the way family does" | family add now excludes renaDistrust |
| tau_405b | 5 stacking | helpedRena+logged text replaces the drone-scan line, then the helpedRena add "扫描停在你脸上很久" has no antecedent | add only when helpedRena and not logged/flagged |
| tau_407b | 7 pronoun | firedHigh add "她删了" follows the 409 Grrak'tha add (he) — unclear who deleted the log | 她 → 凯尔拉 / "Kel'ra deleted it" |
| tau_506 | 9 taint | "Hear him out" (+50 Slaanesh) narrated only as sweet sugar and a kind voice — no felt contact | result: something else in the room listens so intently you flush |
| tau_507 | 9 taint | "Let the mark stay" (+50 Khorne): good physical beat but nothing Khornate | + dream of a brass plain with a throne of skulls |
| tau_605 | 3 logic | confession result "I know your footsteps" — the report was made at the water-caste office | → "you walked out that day and never looked back; I watched from the window" (echoes 405) |
| tau_607 | 2 place | scene `tau_city`, text is still in the refugee camp outside the city | scene → `jungle` (same as 606/608) |
| tau_609 | 7 lang | toldQuarter add genders the player ("他早告诉过我们" / "He told us") | neutral wording zh+en |
| tau_706a | 5 repeat | first line repeats 706's last line ("humans were never on the string") | → "你的喊声还没落，哈斯克第一个应声…" |
| tau_802/805/807 | 3 logic | 802 sends you to "the last ship", 805 closes its hatch, then 807 opens with "the last ship waits" | 802 label/resultAlt → "去港口上船" / "那边还有船！" (807 is the real last ship) |
| tau_end_watch | 6 ending | Kroot-who-remember-Grrak'tha text fired on grrakDead even when you refused him (krootLeft: the Kroot left in silence) | condition → `flags[grrakDead, rememberGrrak]` |
| tau_end_claim_khorne | 6 ending | claim fires during the Swarmlord siege (706b/802) but text is a peacetime "one day you walk into the jungle" | + alt `fromChapter ≥7`: siege/evacuation-list version |
| tau_605 (en) | 7 length | new result line 36 en words | shortened |

## 807 gates (checked)
enclaves [farsightPact, !kelraDead] 4.1 % · citizen [renown ≥ 40, !cultMark, !watched] 6.5 % · watch [rooted] 14.7 % · thirdwave (fallback) 15.1 % · devoured via 806b [turnBack ← 605a renaStayed / 705 droneLost] 9.3 %. All satisfiable; each result line and ending text fits the paths that open it (devoured has the Rena alt for renaStayed without the drone fragment; watch alts for Jory/Rena/Kroot; citizen alts for keptName/liaison; thirdwave alt for smuggledRefugees).

## Taint +50 contacts (checked)
505 stare (an eye that recognises you) · 506 Silas (now: an unseen listener) · 507 mark (second heartbeat + brass/skull dream) · 706b "something floods out of you… you can't stop laughing" · 802 "something takes your hands and aims for you". All now read as direct contact.

## Listed, not fixed
- Structural: shallow branches 13/31 (42 %, rule 2 ≤ 20 %) — validator WARN only; needs follow-up beats, not text edits (101, 102, 105, 201, 205 …).
- tau_807: with farsightPact + kelraDead the "Go with Kel'ra" choice shows locked (🔒) although she is dead — consider `hideIfLocked:true` (author's call; no balance effect).
- tau_108: Rena/Jory are re-introduced ("以前教堂的执事") for pow/trader players who already met them in their prologue — harmless redundancy.
- tau_707 "第四天": counting from 701 (night of day 1) the clock lands on ~day 5; the text chain 707→708 "第七天"→801 "第八天"→806b "第九天" is self-consistent, so left.
- tau_502→504: result says "第二天" ordered back, 504 `time:{d:3}` — travel + assembly delay, acceptable.
- tau_402 alt "推开你的门" for the pow origin who lodges in Rena's house — reads as your room's door; left.
- Lore: nothing found wrong (Kauyon/Mont'ka, Shadowsun = Kauyon, Farsight's Dawn Blade "from a dead world", GSC calling the fleet, Swarmlord learning). Ethereal death → fire warriors "freeze like puppets" is a stylisation of canon despair/shock — acceptable.
- Shared files: none seen contradicting the route in the events that fired (evt_t_tau_tzeentch / slaanesh / khorne, evt_khorne_1, evt_slaanesh_1/2, evt_tzeentch_2, evt_t_any_dice).
