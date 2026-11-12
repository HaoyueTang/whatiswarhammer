# Plan · gsc route overhaul (v0.4.0, SPEC §32)

Baseline v0.3.3 (validate seed 1, 3000 runs): 98 nodes · death 23.9 % (miner 27.9 / warden 20.5 / kin 23.3) · good 15.9 % · claim 3.7 % (band 3–8) · median run 47 · false-choice 39/77 (51 %; converge 68 %) · forced chapter steps 10 · hard jumps 39 · never-read flags 48 · gather 0.
Targets: death 17.9–29.9 %, origins ±6, claim 3–8 %, good ≥ 22 %, nodes ≤ 145, median run 52–68, false choice ≤ 5 %.

## Decisions
- Conditional text = `alt` / `resultAlt` (no duplicate kin/warden nodes). Origin variants by `origin_kin` / `origin_warden`.
- `carrier` flag (A43): set by kin origin and by every blessing; carriers fail the blood test, their hatch ending is "The Seed".
- `withKids` (A24): the Ark needs children you really brought (cellar 704, Wren's plan 609, Primus hands them over at renown ≥ 25, Reyes' alliance). Self-boarders get the new bad ending **gsc_end_passenger 一个座位 / One Seat** or give their seat away (Last Shift).
- `linked` (A4/A53): only those who stood before the Grandsire get the hum; 310 has a no-hum variant.
- Lore (A52): killing the Patriarch does not lift the Shadow; it breaks the brood's song so the astropath can scream through a crack. Ship en name → *Endurance* (A54).
- Lusk vanishes on the spine (300 bridge) and his letter brings Thorne (600 bridge) (A19/A28/A39). Reyes introduced at the 405 checkpoint (A26). Brann introduced in 208 (A27).
- Ids kept; no node removed. New ending: 1.

## Spine per chapter (new nodes in **bold**)
1. Miner: 101 → 102 (with Teo) / **102b** (alone at the deep face: knock / wait dark) → 103 (alt savedTeo/knocked/waitedDark) or 104 (→ silence → **104b** a week of silence) → 105 gather 工棚 (smash → **105a** cell night, Vask; speak → ganttMarked; head down) → 106 (alt wronged_teo/headDown) → 107 gather 霍林家 (hand fix, alt) → 108 → 201.
   Warden: o_1 → o_2 gather 井口 (smile = Wren) → o_3 (ossaInvite / ossaWary) → o_4 (vaskAgent / toldMarr) → 201. Kin: o_1 (devout / motherWarned) → o_2 gather 计数室 (+6 y, kinExposed) → o_3 (高祖母; smuggler / askedDay) → o_4 (hesperQuestion) → 201.
2. **201 bridge** gather 饭桌 (introduces Teo/Jory/Gant for all; kin transferred to the lift-head tally) → **201a** kitchen gossip (heardGant) / **201b** Jory's card table (joryCrew) / icon → 202 strike (sit roll; joryCrew better odds; inform → **203b** Teo brings soup anyway) → 203 → 204 (sawOffice / lookedAway) → 205 Vask (lie / scratches → **205b** Gant's lamp at Shaft 13 seal, vaskAgent / warden report / silence = cellNight) → 206 gather 礼拜堂 → 207 Wren → 208 (Brann introduced; eventRoll) → 209 gather 小教堂 (Lusk's letter) → 210 → 300 / 211 (a week; Lusk gone) → 212 / 300.
3. **300 bridge** (rest-day, Teo fetches you; "Father away" notice) → 301 → 302 gather 操练场 → 303 (alt pattern/cellNight/joryCarried, kin) → 304 → 305 → 306 (sets linked) / 307 (fled) → 308 / 309 → 310 gather 食堂 (no-hum variant) → 311 (arrest caused by wire / toldVask / Vask's own work) → **312** Jory's homecoming + "what you did for the years" (eventRoll).
4. **401 bridge** (+12 y; alt years*) → 402 / 403 (eventRoll) → 404 gather 葬礼 (+ second blessing → **404b**) → 405 (Reyes' checkpoint; taughtWren odds) → 407 (→ traitor → **407b** the Magus "heals" you once) → 408 gather 工棚 (Brann) → 409 (eventRoll; slate decision).
5. **501 bridge** gather 礼拜堂 (+3 y) → 502 (Reyes fetches carriers) → 503 gather 候船厅 → 504 (eventRoll) → 505 → 506 (alt: slate / astropath / archive) → 508 (→ fail → **508a** half truth) / 509 (eventRoll) / 510 gather 集会.
6. **600 bridge** (black ship, Lusk's letter) → 601 gather 验血队伍 (carrier fails) → 602 (turn away → **604** Nell snatched back) / 603 (→ **603b** cell blown open) → 605 gather 霍林家 → 606 → 607 / 608 → 609 / 610.
7. **701 bridge** → 702 / 703 / 704 → 705 → 706 → 707 (pull → **707b** the purge) / 708.
8. **801 bridge** → 802 → 803 / 805 (→ **805b** ways aboard) → 806 → endings; 807; 809 (h:8); 810.

## Flags read (new readers)
deepFace→208 resultAlt · savedTeo/knocked/waitedDark→103 alt · tookHand→108 alt · climbedAlone/lateGuest/smashedBoard→107 alt · headDown/wronged_teo→106 alt · ganttMarked→204 alt · vaskKnows→202/205 alt · askedIcon/devout→206 alt · prayedFirst/lookedAway/suspicious→209 alt · promisedJory/shunnedJory/ossaInvite/ossaWary→201 alt · smiledWren/leftEarly→207 alt · pattern→303 alt, end_witness alt · vaskAgent→202/212/702 alt, 312 option · toldMarr→311 option, 702 option · reported→212 alt · heardGant→204 alt · joryCrew→202 option · returnedChit→205 alt · cellNight/joryCarried→303 alt · favoured/workedWithBrann→408 alt · confessedLusk/informer/watchedMagus→210 alt, 300 alt · defendedHollins/hesitated/wire/refusedVask→300/311 alt · counted→801 alt, 809 resultAlt, end_buried alt · drilled→510 resultAlt, 703 alt · unproven/fist/heldOut/refusedTwice→510 alt · joryBond→603 option, 603b alt · knelt/lookedEye/prayedThrone→308 alt · cameBack/refusedKiss→secondChance→404 option · shutTeo/content→310/505 alt · alibi/marrHelped/joryMaimed→312 alt, 401 alt, 601 resultAlt · years*→401 alt · askedOssa→404 alt · brawl/smuggler/yearsReport→407 alt · toldNellFear→504 alt · taughtWren→405 option · correctedOnce→408/610 alt · hesperQuestion→408/506 alt · brannSky→706 · slateHidden/gaveSlate/doubtSong→501/505 · astroCalm→803 alt · reyesWary/warnedReyes→600/601/703 alt · knowsHauler→609 option, 805b option · nellDream/huggedNell→505/806 alt · truthSlate/truthAstro→506 alt · halfTruth→606/608 · mended/secretTruth/teoKnows→510/704 alt · causedScene→605 alt · shipThought→806 alt · forgiven→606/608 alt · spokeHalf→608 · askedMercy/noTerms→end_ark/end_witness alt · savedVask/savedMarr→805b/806 alt · reyesEscaped→805b option · portHeld→805 alt · inBunker→706 option · sawPurge→801/802/810 alt · heardTeo/teoForgot→708 alt, end_ark alt · withKids→805/806 · carrier→601/806.

## Events
Route events get `where` (chapter windows; pedlar ch4 only, census ch4–5, cleanse ch3–6). eventRoll on 208, 312, 403, 409, 504, 509 (removed from 304, 311, 510, 801).

## Gather nodes (13)
105, o_warden_2, o_kin_2, 107 (ch1) · 201, 206, 209 (ch2) · 302, 310 (ch3) · 404, 408 (ch4) · 501, 503, 510 (ch5) · 601, 605 (ch6).

## Endings
New: gsc_end_passenger (bad, 一个座位 / One Seat). Ark gated on withKids & not carrier; 806 rebuilt (A24/A43/A50). Claim/death nodes rewritten time/place-neutral (A48/A49). end_shadow lore (A52), end_seed y:5 (A41), end_devoured cause (A51).

## Result (2026-11-12, validate seed 1 / 3000 runs; `--story-gate` PASS, 0 errors)
116 nodes (+18, none removed) · multi-choice 87 · false-choice 0 % · shallow 19 % · forced chapter steps 0 · hard jumps 42, unjustified 0 (7 bridges: 201, 300, 401, 501, 600, 701, 801; 25 `jump` marks) · never-read flags 0 · alt 69 nodes / 179 entries · resultAlt 12 · gather 13 (ch 1–6; passes/run ≈ 11) · rumours 5.4/run · median run 53.
Death 21.9 % (v0.3.3: 23.9) — miner 24.1 · warden 19.7 · kin 21.9 · seeds 5/9: 23.0 / 22.8. Good 23.3 % (22.5 / 24.3). Claim 3.8 % (3.5 / 3.8).
Deviations: gather dropped from 105/310/605 (rumour rate); 408 kept as gather. 806 lost "drag Nell aboard" (now 4 partitioned choices). Kin never reaches ark/passenger (carrier → The Seed) — intended, validator WARN.
New nodes: 102b, 104b, 105a, 201a, 201b, 203b, 205b, 300, 312, 404b, 407b, 508a, 600, 603b, 604, 707b, 805b, gsc_end_passenger.
