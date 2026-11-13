# qa_necrons.md — QA read-through, Necron route (v0.4.0)

Reader: Opus QA. Runs read: 24 — each origin × seeds 5 / 11 / 27, `--first`, `--last`, `--en` (seed 8), plus targeted seeds for the rare endings (47 lexmech → `nec_end_webway`, 38 lexmech → `nec_end_ceasefire` (zh + en), 43 convict → `nec_end_curator` via 806a, 87 archivist → `nec_end_claim_tzeentch`, 3 archivist pit path). The whole `data/factions/necrons.js` was read node by node (every alt / resultAlt / grudgeLine, all death / claim / ending nodes, route events), plus the route's taint/lore events and rumours.

Baseline = after (validate seed 1, 3000 runs): death 28.3 % (archivist 26.2 / convict 32.6 / lexmech 26.0) · good 29.5 % · claim 3.3 % · gather 9 · median run 55 · false choices 0 · never-read 0 · route_graph: no ERROR/WARN · date_audit 0 anachronisms. Text edits only; no effects, rolls, requires, ids or flags changed (one node `time` changed: 209a h6 → h12).

## Fixed (17)

| node | cat | problem | change |
|---|---|---|---|
| nec_209a | 2 time/place | arrives ~midday (h6 after dawn) yet "the last shuttle's trail scores the night" — the shuttle left at midnight, and on the pit path three days earlier; `learnedWords` result says "by dawn" | time h12 (evening); line → 天黑了，天上一架穿梭机也没有 / "Night falls; there isn't a single shuttle in the sky." |
| nec_208 | 3/5 | alt `fromNode 206` "cryptek measures the wound on your shoulder" — the kaalTrust "hold the exit" path also leads to 206 and says the light never touched you | → 技师先量了量你扣过扳机的那根手指 / "measures the finger that pulled the trigger" |
| nec_504 | 3 logic | "You haven't spoken in 380 years" — you just spoke to Imhet (501/502) | → 上一次有人认真听你说话，是三百八十年前 |
| nec_707 | 1 people | "A woman in a long dark coat laughs… Inquisitor Mordane turns to the magos" reads as two people | woman = Mordane, named in the first sentence; "She turns to the magos" |
| nec_802 | 6 ending | stasis key "melts into cold light" (consumed), but `nec_end_curator` alt [promiseKaal, stasisKey] thaws Kaal with that key | → 钥匙在你手里亮成一团冷光 / "blazes into cold light" (key survives) |
| nec_806 | 5 stacking | stasisKey add "He eyes the cold light in your hand" shows even when the key was not used at 802 (seed 38: sealed via drillStalled) | → glances at the coat lining where the key is sewn (true on every path) |
| nec_end_chronicler | 6 ending | neferDead add "a cryptek who took your death for you" — also fires on the 801 run → 803 path, where you fled and the crypteks plugged the breach | split: [neferDead, !shardHalf] keeps the line; [neferDead, shardHalf] → Nefer plugged the breach with his body while you ran |
| nec_end_truth | 5 stacking | freedColleagues add "You took Oriel's testimony too" — 708 shows ≤2 adds (origin line + pleaded/stalled first), so many players never saw the testimony | self-contained: Oriel's sealed testimony from the archive came with you too |
| nec_607 | 3 carry-over | after helping the rangers free the seer (aeldariFriend) the Collector/Imhet scene ignores the empty display | + first add: Imhet stood a long time before the seer's empty display, asked you nothing |
| nec_607 | 1 pronoun | askedShard add "he says" follows the new Imhet line — speaker unclear | "says the Collector" / 收藏家说 |
| nec_606a | 2/3 | choice "趁夜…" while the `counted` path arrives at dawn; result "the tunnels still know your footsteps" — you never walked the scarab tunnels | label 从甲虫隧道溜回墓里; result: the scarabs make way as if they still know you |
| nec_701 | 3 logic | drillHand add "my first bit drilled a hundred years" — the scarabs ate the drill in 201 | "The scarabs ate it. I have drilled for a century since." |
| nec_210 | 7 lang | quota add 监工画过勾的那种手法，甲虫好像也认得 — unclear zh/en | scarab scratches a tick in the sand each circuit, like the overseer |
| nec_209a / nec_301 | 7 zh≠en | zh 手背, en "on your arm" | en "on the back of your hand" |
| nec_808 | 7 lang | grudge note "anyone who turns his back" (player gender) | "their back" |
| nec_death_hp | 6 ending | base "You become one more tidy dune" also for deaths inside the tomb (308/309/404/408/801/804/807) | + alt `fromScene tomb_interior`: "one more tidy fixture of the tomb" |
| nec_313 | gather | barracks art; crowd only implied | "some thirty “useful” humans" (matches the 34 names in the pen) |

## Checked, fine
- Stasis jump 408a (jump label) → 409 → 501 (y 380, bridge, "493.M42") reads as intended; 510 (+9 y docent) and the "century of drilling" agree with 512a/606a/701/704; Vektrix-9 alive as "almost all machine".
- Imotekh (312, 401, 702, 705, 810): Lexicanum has him openly resentful of Szarekh (opposes him, revolted in the Pariah Nexus war). The text only has him demand Akhemet's fealty "first, kings later" — consistent and still vague; kept.
- New endings: `nec_end_ceasefire` gate 808 [stoodBetween from 810] + renown roll, grudge for betrayal; text fits shardHalf / mordaneSaw / sealed paths. `nec_end_webway` gate 810 [wentWebway], aeldariFriend is MUST there, resultAlt for shardHalf; purge fire behind consistent with 808.
- Claim endings: khorne (only from 810 — "leaving the null field" = the surface), slaanesh (gallery, a cryptek freezes you), nurgle/tzeentch generic "leaving the tomb" — all read sensibly.
- Gather nodes 313 / 502a (barracks art): both clearly a crowd (thirty captives; veteran, ganger, water-caste in the green room).
- Other lore: Necrontyr/biotransference, War in Heaven, 60 My sleep, Szarekh's pact/betrayal/exile and return because of the Tyranids, Trazyn's body-swap, Pariah Nexus rumour — OK.

## Listed, not fixed
- **Alt overflow (designed, but hides echoes):** 708 (8 adds — origin line always takes slot 1, so freedColleagues/marrowCopy only show without pleaded/stalled), 810 (8), 709 (7), 408a (6), 706 (5). Echoes late in the list (e.g. 709 wentWebway "cloaked shadows", 810 tyrantEye/neferDead) are often invisible. Consider fewer, merged lines.
- 809: Imhet is present by default, also after 806a "stay, go back up" where he vanished with the cube — he can reappear through a door, but no line says so.
- 702 base "the Collector re-gifted you?" + wentWebway add "Not the Collector's delivery?" reads as a self-correction — acceptable.
- 403 "It speaks our tongue" even for players who never learned a word — Sekhrat's sales talk; left.
- Gather passes/run 5.8 (warn < 6); shallow branches 17 %.
- Structural feel: 801 "Run" success silently kills Nefer and half-opens the cage (803) — the cause is told in one line; a beat showing it would help.

## Shared files (for the lead)
- `evt_slaanesh_1` (a stranger hands you a fruit) fired at nec_401 / 702 / 708 / 810 — no food or strangers in a necron tomb or the trench stand-off; needs `where`/`excludeFactions:["necrons"]` or notScenes tomb_*.
- `evt_tzeentch_2` (reflection in a puddle) fired at nec_702 / 708 — Thessa Null has no water/wind; `evt_nurgle_2` (flower growing in your boot) at nec_311 inside the tomb; `evt_claim_tzeentch` "mirror" in the tomb — generic but odd.
- `evt_t_nec_tzeentch`: "you've spent days copying the tomb-wall glyphs" fires at nec_301 = your first hour inside the tomb → add `notNodes:["nec_301"]`.
- `evt_t_nec_khorne` result "a fellow prisoner" (zh 同伴) at nec_810 — you are not a prisoner there any more.
- `evt_lore_silent_king` at nec_401: an unnamed "restless overlord" paces before his throne the same moment Imhet arrives — better at nec_313 or name Sekhrat.
- Transient during the pass: `evt_undivided_1.where.notNodes` "cha_701" ERROR (gone later); playthrough printed `load fail data/factions/gsc.js Unexpected token ')'` once (another agent mid-edit).
