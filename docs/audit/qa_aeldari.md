# QA read-through — Aeldari route (v0.4.0 story overhaul)

Reader: Opus QA (2026-11-12). File: `data/factions/aeldari.js` (140 nodes, unchanged count; no ids, flags, requires, effects, rolls or endings changed).

## Runs read
24 playthroughs: agri / pilgrim / trooper × seeds 2, 3, 4 + `--first` + `--last` + seed 7 `--en` (18), plus trooper seeds 11–16 (6), plus the whole file read node by node (incl. every `alt`, the never-visited `eld_end_claim_nurgle`, all death/claim nodes, `eld_106b`, `eld_108`, `eld_o_trooper_2s`, `eld_310`, `eld_end_lost`, `eld_end_drukhari`, `eld_805`, `eld_807`).

## Gates
- Baseline at start: good 22.6 % · death 18.3 % · claims 13.4 % · gather 12.
- Mid-session the shared event files changed (another agent added `where`s); the same numbers with the **original** route file became good 22.2 % · death 17.1 % · claims 14.6 %. With my edits: identical (22.2 / 17.1 / 14.6, origins agri 14.5 / pilgrim 18.4 / trooper 18.5 % death). Text edits changed nothing in the simulation.
- `validate.js --faction aeldari --story-gate --allow-missing-ending-art`: 0 errors. `route_graph --checks-only`: no ERROR/WARN. `date_audit`: 0 anachronisms.

## Defect log (node · category · problem · fix)
| # | node | cat. | problem | fix |
|---|------|------|---------|-----|
| 1 | eld_211 / eld_509 | 1, 4 | Path nellKept → 207 "Save this world" → 208 "Then I stay" → 210 → go with Mireth: Nell is simply left behind on the ridge, never mentioned again; 509 then tells the shuttle story (nellLander only). | 211: new `alt` add `{nellKept, not nellToJorban}`: Jorban climbs up, you give Nell to him for the old mines. 509 mine-version `alt` condition `nellToJorban` → `nellKept` (covers both). |
| 2 | eld_210n → eld_end_harvest | 3 | `nellToJorban` alt said you already climbed down into the mine with them; next choice was "go home and wait on the doorstep", and "run back up" led to 211 saying the priest is out of sight. | 210n alt now "the priest is carrying Nell toward the mines; you could still catch them"; choice label → "留下来，等它们来 / Stay, and wait for them to come". |
| 3 | eld_210 / 210n / 211 alts | 1 | Mireth's name used (result line, 210n text, 211 "from 210/210n" alts) before she ever says it on that path. | 210/210n say "那个年轻的守护者"; the 211 alts from 210/210n now have her say "米瑞丝" first. |
| 4 | eld_o_pilgrim_4 | 4 | Base text (Jorban stares at the nosebleed) assumed the night at the stones; barn path (o_pilgrim_2 → 4) had no nosebleed. | `alt` text for `fromNode o_pilgrim_2`: it bled again last night while telling Nell the dream. |
| 5 | eld_800 | 4 | "as Mireth promised to remember the child" assumed `mirethKnowsNell` (MAY). | Base neutral; `alt` add on `mirethKnowsNell`. |
| 6 | eld_death_hp / eld_death_sanity | 6 | Death while alone in the webway (308–310, 801–807) still said "the Aeldari pause and look down at you" / "they place you in a quiet room"; the `watched` add put a wraithbone giant "outside the door". | New first `alt` text for those `fromNode`s (alone in the webway; gate closes behind you); `watched` add excluded there. |
| 7 | eld_end_claim_khorne | 6 | Base "since that first blow" assumed the punch on Sylvaen; Khorne taint also comes from firing on the ranger, spitting, events. | Base neutral ("the fire in you never went out"); punch version as `alt` on `punchedSylvaen` (after the woreMask one). |
| 8 | eld_o_trooper_5 | 1 | wronged_edda alt "never heard Edda's voice again" — she reappears at 204 hours later. | "身后再没传来埃达的声音 / no more of Edda's voice came from behind you". |
| 9 | eld_107r | 1 | Trooper alt "empty holster": the un-wronged path has Edda press her pistol on you; what you lost is the lasgun. | "空空的枪背带 / the empty sling where your rifle used to hang". |
| 10 | eld_201b | 4 | "Whoever cut the tower came from that way" — pilgrim (and agri via 103/106) never learn the array was cut. | "看了一整夜 / watching all night". |
| 11 | eld_307 | 1 | `sylvaenWebway` alt names "西尔凡" — his name is first given at 506. | "游侠 / the Ranger". |
| 12 | eld_307 | 3 | Choice "wait until the crowd has gone" — no crowd in the node. | "在拱门下站一会儿，晚点再进 / Linger under the arch; go in later". |
| 13 | eld_509 | 3 | Result "harder to take than the punch" — 509 is reached by "And Nell?", not by punching. | "道谢比挨骂更难受 / thanks harder to take than blame". |
| 14 | eld_510 | 5 | `askedValda` add repeated the base sentence ("see what it bought"). | "答案的另一半在那里 / the other half of the answer is there". |
| 15 | eld_609, eld_611, eld_end_maiden | 4 | "the child you knocked down / pulled from under the hooks" — the trooper's gate option also sets `savedChild` without that. | "一个孩子", "被你救下的", "从掠夺者手里救下的". |
| 16 | eld_700 | 2 | "Only you and the Farseer on the ship" — someone pilots. | "船舱里 / in the cabin". |
| 17 | eld_806 | 1 | `honestDontKnow` alt: Taethra quotes words said to Mireth. | Now "米瑞丝说…" / "Mireth told me…". |
| 18 | eld_209 | 3 | agri `duskStones`: Sylvaen said "bring her, only her", then the Farseer refuses Nell; no echo. | `alt` add: the cloaked one who told you to bring her looks away. |
| 19 | eld_609m | 7/8 | "陨落之后很久，她选了另一条路" (everyone alive is "long after the Fall"). | "很多年前 / many years ago". |
| 20 | eld_604 | 7 | "一整颗猿人世界" (measure word). | "一整颗猿人星球". |

## Listed, not fixed
- **Shallow branches 33/69 (48 %)** (validator WARN, rule 2 ≤ 20 %): by design per writer notes; structural.
- **Vhessra / Marta / Sylvaen speaker labels** show the name before the text introduces them (e.g. 309, 608). Engine display; left.
- **eld_o_trooper_4 `time:{h:20}`** "next midnight" after a night patrol is a few hours off; invisible to players, left (time change could shift date audit).
- **eld_611 "ride home on Sylvaen's ship"** on the 600d path where Sylvaen is not mentioned on Ildaneth; plausible, left.
- **Good-ending share 22.2 %** after the shared-event change (was 22.6 %) — right at the 22 % floor; any further shared-event change may push it under.

## Shared files (for the lead)
- `evt_khorne_2` ("a comrade shoves you over half a ration bar") fires at `eld_601` (arrival on the maiden world, no comrades/rations) and other Aeldari nodes — needs `where`/`excludeFactions`.
- `evt_khorne_1` (arena dream) fires at `eld_301` (walking in the webway) — reads as a dream, acceptable but odd.
- Transient validator ERROR seen once: `evt_undivided_1.where.notNodes: "cha_701" does not exist…` (gone on the next run).
- `tools/art/endings_brief.json` is stale after the ending-text edits here (khorne claim, death alts) — run `node tools/dev/dump_endings.js` at the end.

## Lore checks
Eldrad: Lexicanum says he was "crystallising, but very much alive" and later joined the Ynnari — 405's "once stood like this… then woke and followed the Reborn" is loose but fair. Keeper of Secrets, Avatar/Young King, Path of the Outcast, Exodite world-spirit dead, Yvraine dying in a Commorragh arena, Ynnead waking when the last Aeldari dies — all consistent with canon. No lore text changed.
