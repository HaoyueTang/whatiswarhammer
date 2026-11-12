# Plan — Adeptus Mechanicus route rewrite (v0.4.0, SPEC §32)

Baseline v0.3.3 (validator seed 1 × 3000): 89 nodes · median run 51 · death 29.4 % (menial 25.3 / savant 31.8 / conscript 31.2) · good 22.4 % · claim 11.5 % (band 8–14) · grudge +1.9 pt · false choices 35/67 (52 % by the new definition; 69 % in the audit) · forced chapter steps 6 · unjustified hard jumps 20 · never-read flags 26 · gather 0.
Targets: death 23.4–35.4 %, origins ±6 of route avg, good ≥ 22 %, claim 8–14 %, run 52–68, 80–145 nodes.

## Spine, bridges and new nodes
| ch | node | where / when / who | carries over / reads |
|---|---|---|---|
| 1 | `mech_o_savant_2b` Gries asks you to cook his books | tally hall, same day | pretend-not-to-see → `griesBook` / `griesRed` (savant_4 alt) |
| 1 | 107 holding queue (gather 候审队列), 109 origin alts + contract clause option | conversion line | noticed / readContract / tapped / hidTalent / struggled |
| 2 | `mech_200` (bridge) first night in the Seventh Vault | Ossia, bunk among shelves | askedTobin / pulledTobin / wronged_tobin / origin_savant |
| 2 | `mech_205b` Vallen's judgement after "I made it" | Vault; Vallen, Ossia, Kesh | tookBlame → Ossia confesses, both punished (`ossiaGone`, `ossiaOwes`) |
| 2 | 208→209 merged at the broadcast square; `mech_209b` the fully-augmented priest at prayer | festival night | askedFlesh (301 resultAlt) |
| 3 | `mech_300` (bridge) fourteen days of probation | Vault antechamber; Vallen | lie-success path: Ossia transferred to the outer furnaces; reportedOssia / tookBlame / copyist / knelt |
| 3 | `mech_302b` the "original part" in the dormitory (fleshFirst) | novice dormitory (gather) | proudFlesh / optic (slaanesh) → 604 alt / resultAlt |
| 4 | `mech_400` (bridge) night before departure | Gravex orbital dock; Kesh's maniple lent as escort, T-0B1N farewell | tobinSong / avoidedTobin / askedPriority |
| 4 | `mech_403b` the perimeter watch (perimeter branch skips the tomb) | outside the pyramid | savedServitors |
| 5 | 501 = bridge (landing in the burning city) | ork raid, Kesh | conscript / crystal / dataCore |
| 6 | `mech_600` (bridge) the outer furnaces, Ossia's empty bench | penance yard | trace path; 601 alt fromNode |
| 7 | `mech_700` (bridge) six hours before the landing | muster point; Kesh assigns posts, electro-priests | armed / heardVoice / knowLanding / motiveLater |
| 7 | `mech_701b` coolant tunnels with 300 menials (gather) | under the Seventh Furnace | savedMenials / menialSong |
| 8 | `mech_802a` the melted hand | reactor hall | handLost (805, end_magos alts) |
| 8 | `mech_806` back at the Seventh Furnace | keeper vs. ordinary life | keeper → end_keeper / end_survivor |

## False choices → real branches (flag → where read)
102 doubleShift / griesGrace (106 alt) · 103 tobinFed / learnedSong (107, 202 alt) · 105 vallenBow / askedSpirit (203, 607 alt) · 106 struggled (107 alt) · 108 sortDate / sortDust (204 alt) · savant_1 correctedClerk / readContract (savant_2 alt, 109 option) · savant_2 → 2b · savant_3 noticed / hidTalent (109 alt) · conscript_1 syncGood / socketDoubt (conscript_3, 301 alt) · conscript_2 shotGrot / sparedGrot (503 alt) · conscript_3 noticed / sawServitors (202 alt) · conscript_4 knowsTobin / keshMemory (205, 303 alt) · 201 binary (304 split roll) / askedServitor (202 alt) · 202 tobinSong / avoidedTobin / wipedFace (400, 506, 704, end_keeper) · 203 copyist / askedNew (209, 707, 805) · 206 woreMonocle / keptMonocle (601) · 207 motiveTouched / motiveLater (607, 700 alt) · 208 askedTreaty / knelt (209 alt) · 301 eyeAug / armAug / fleshFirst (302/302b, 702, 802) · 302 upgraded / soothed (604, 608 resultAlt) · 303 keshTalk / keshTrust (502, 706) · 305 keshForget (706) · 307 askedNew / sentCawl (506, end_explorator) · 308 devout / doubter (606, 607, 707) · 309 askedPriority (405 alt) · 401 askedWill / hotspot (403, 404 alt) · 402 glyphs / perimeter (404 option / 403b) · 403 warnedTomb / tookMetal (405, 408 alt) · 404 grabbedCore / savedServitors / sleepCode · 405 calledCalantis / calantisCoords (407 alt, 805 gate `quest`) · 407 calantisFile (602 option, 805 gate) · 408 voidedMetal / crystal (509, 707) · 503 censer / grotDeal / cableLost (504, 608) · 504 mekWatch / blewKastelan (803 alt) · 506 keshRepair / countedDead / foundTobin (704, 706, 805) · 507 kastelanWoke (803) · 508 burnedSpores / sporePet (605, 704) · 509 → 600 / 601 · 602 ossiaKey / burnedKey / knowLanding · 607 quietFaith / askedOmni (707, 802) · 608 calmedReactor / cutReactor (801, 805) · 609 armed / heardVoice (804, 707) · 702 withKesh / runeName (706, 804) · 703 openedArchive / resealed / glimpsed · 704 tobinSaved / tobinOff / tobinRust (802, end_keeper) · 705 draggedVallen (805) · 706 keshLast.

## Endings
Gates: 706 heretek needs heardOssia + ossiaKey; 707 heretek via openedArchive or handing over the lead box (crystal); 805: magos = fleshKept + renown ≥ 35, explorator = renown ≥ 30 + `quest` (coords or archived file), purged = askedNew (curiosity), "回第七熔炉" → 806 (keeper if `keeper`, else / or by choice the new ending).
New ending (1): `mech_end_survivor` 「回到配额板前」(good) — an ordinary person survives and goes back to the quota board.
Death/claim nodes made location-neutral (B32, C15, C16); claim tzeentch text no longer assumes the stolen fragment.

## Gather nodes
103 配给队列 (menial) · o_savant_2 计数台 · 107 候审队列 · 207 建厂日庆典 · 302 / 302b 初学者宿舍 · 307 缮写大厅 · 401 舰员食堂 · 508 杂役食堂 · 605 熔炉配给站 · 609 杂役食堂 · 701b 冷却隧道.

## Events
eventRoll: 201, 303, 308, 402, 408, 607 (removed from 104, 205, 404, 508, 608, 706). Route events get `where` (scenes / chapter) so the rite, the census and the rack carbine only fire in fitting scenes.

## Outcome (validator, seeds 1/5/9 × 3000)
103 nodes (+14, none removed or renamed) · multi-choice 72 · false choices 0 % · shallow 2/27 (7 %) · forced chapter steps 0 · hard jumps 13, unjustified 0 · bridges 6 (200, 300, 400, 501, 600, 700) · never-read flags 2 (apprentice, initiate — folded into base text) · alt 61 nodes / 170 entries · resultAlt 8 · gather 12 (ch 1–7) · median run 56.
Death 26.3–26.5 % (v0.3.3: 29.4 %) · menial 22.4–25.2 / savant 29.2–31.9 / conscript 23.4–24.9 · good 22.8–24.7 % · claim 9.2–9.9 % (band 8–14) · grudge +1.3 pt.
Changed vs plan: 109 "我还会数别的" became a sanity roll (fail → servitor) so every origin can reach end_servitor; the give-up option is gated on sanity ≤ 75; 502 gained a savant-only option (mental ballistics) to keep the savant within ±6; 404 grab-the-core sets `grabbedCore`, 406 sets `coreLost` (the roll outcome is read as grabbedCore ∧ ¬coreLost); 509's two paths set `tracedCode` / `sealedVault` (601 alt).
