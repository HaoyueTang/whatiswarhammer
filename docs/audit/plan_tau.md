# plan_tau.md — T'au route rewrite (v0.4.0, SPEC §32) — writer's working plan

Baseline v0.3.3 (validate, 3000 runs): 95 nodes · avg 48.3 visited · death 25.5% (band 19.5–31.5) · good 44.1% · claims 9.2% (band 6–12) · 36/59 false-choice nodes · 7 forced chapter steps · 34 hard jumps.

## Author decisions on the audit's open questions
1. Ethereal calm (A47): works on T'au only. Humans catch it second-hand from the faces around them (104/504 rewritten); 706 "humans were never on the string" stays.
2. Report Kel'ra (A8): she is taken for a "dialogue", returns after three days, cold; still flies (the Greater Good needs every pilot). Enclaves closed for her betrayer.
3. Shadowsun (A48): never on stage. 408 = a hunter cadre of her Kauyon school; 707/806b = a T'au relief fleet. She stays in rumour / Kel'ra's words.
4. Good-ending share drops (gated citizen/watch) — target ≈ 25–35%.
5. Events: `where.nodes` on all `evt_t_tau_*` + `evt_lore_damocles`; eventRoll moved off combat/warp nodes.
6. Size ≈ 115–120 nodes (95 + ~21 new + 1 new ending).

## Spine per chapter (new nodes in **bold**)
- Ch1: colonist 101 → 102 (gather Docks) / 103 → **103a** (drone in the alley) → 104 (Orin, calm by contagion) → 108 (gather Water station: Rena + Jory introduced for every path) → 107 (recruiting: sign / promise Rena / not yet → **107a** a week later).
  pow o_pow_1 → o_pow_2 (gather Camp mess) → **o_pow_2a** (last night of prayer, rosary) → o_pow_3 → 104. trader o_trader_1 (gather Port market) → 2 → 3 → 4 → 104.
- Ch2: **107b** bridge (gather Docks, departure; promisedRena / lateSigner / knowAquila alt) → 201 → 202/203 → 204 → 205 → 206/207 (failedAmbush) → 208 → 209 (gather Troop hold).
- Ch3: **300** bridge (40 days on the border moon; Hask/92 alt) → 301 → 302 (fire early → 305 / droneSilent → **305b**) / 303 (jump variant for ateWithKroot) → 304–307 → 308 (Jory falls on every path; Kel'ra orders a lure) → 309/310 → 311 (gather Quarter square; coveredJory alt).
- Ch4: **312** bridge (a year; eventRoll) → 401 → 402 (+heardBroadcast option) → 403/404/405 → **405b** (three days; drone logs, helpedRena/shotCommissar/reportedRena alt) → 406 → 407 → (409) → **407b** (six days of retreat; Kel'ra deletes firedHigh log) → 408 (Shadowsun's cadre) → 410 (gather Registration line; +water option) → **410a** (two weeks: the prisoner's fate) → 411 (liaison: reason by alt).
- Ch5: 501 bridge (a year, outpost) → 502/503 → 504 (gather Plaza) → 505 (warp hop to gulf-edge posting; no eventRoll) → 506 (metSilas) → 507 → 508 (crimson suit) → pact **509a** / refuse 509 / betray **509b** → 510 / **510b**.
- Ch6: **511** bridge (recall hop to Dal'nor; shared dream) → 601 (briefing called) → 602 (gather Briefing hall; liaison option) → 604 / 605 (→ **605a** Rena stays) → 606 (refugee camp explained; Jory in squad) → 607/608 → 609 (gather Port gate; liaison speech roll; trader channel → **609a**) → 610 (→ **610a** lock-up) → 611.
- Ch7: 701 bridge (first night) → 702 / 703 (only with grrakBond) → 704/705 → 706 (rally humans → **706a**; drag T'au; shake Kel'ra [sawString]; Silas → **706b**) → 707 (gather Wall camp) → 708.
- Ch8: 801 bridge (day 8 morning) → 802 → 803/804/805/806 → **806b** (dawn day 9: fleet, Swarmlord withdraws, council abandons Dal'nor) → 807 gated: enclaves [farsightPact, !kelraDead] · citizen [renown≥40, !cultMark, !watched] · watch [rooted] · devoured [renaStayed | droneLost] · fallback **tau_end_thirdwave** (new bad ending "第三批 / The Third Wave").

## Derived flags (require has no OR)
- `grrakBond` ← ateWithKroot / oweGrrak / grrakFriend choices. Gates 701 → 703.
- `sawString` ← noticedCalm / resistedCalm choices. Gates 706 "shake Kel'ra".
- `rooted` ← hasAquila (605) / forgiven_* / joryBond / rememberGrrak / smuggledRefugees / renaStayed. Gates watch.
- `watched` ← help Rena (402) / silence at 509a. Closes citizen.
- `keepsake` ← hasAquila / malosRosary / rememberGrrak / droneLost (801 alt).

## Flags and where they are read
knowAquila→402 alt · renaDistrust→402 alt · logged→405b alt · wavedDrone→202 alt · knelt/noticedCalm→504 alt, 706 · promisedRena→107b alt, 308 resultAlt · lateSigner→107b/201 alt · powDefiant→o_pow_2 alt · powSigned→209 alt · malosRosary→802 pray option · joryHero→107/308 alt · knowBatteries→406 alt · knowSmuggler→o_trader_3/609 require · soldRena→402 alt · hidStock→411 alt · tradeCard→107 alt · askedTerms→411 resultAlt · silentTea→411 alt · smiledForVash→509 alt · metGrrakEarly→204 alt · droneSilent→302 variant/305b · failedAmbush→208/501 alt · keptName→410/805/citizen alt · haskTaught→304 resultAlt/406 alt · kelraDisappointed→501 alt · coveredJory→311 alt · satWithRena/silentReport→402/411 alt · heardBroadcast→402 option · helpedRena/shotCommissar/reportedRena→405b/411 alt · firedHigh→407b alt · pitiedImperials→410 option · beggedForPOW/coachedPOW/gaveWater→410a alt, 606 alt · liaison→602/609 options · farsightCurious→508 alt · resistedCalm→706 (sawString) · sawEye→506/511 alt · told92→705 alt · reportedSilas→606 alt · scrapedMark→706 alt · vashanTrusts→609 alt · askedKelra→610/803 alt · grrakFriend→703 alt · renaCamp/renaStayed→606/707/806b/807 · toldQuarter→609 alt · besideOrin→706 alt · checkedCells→701 alt · arrestedAtGate→701 alt · rememberGrrak/krootLeft→805/806b alt · savedFireWarriors→802 cover variant · wokeKelra→803 alt · seenMarked→707 alt · joryBond/caredJory→802/805/watch · killedNode→801 alt · metSilas→death_corruption alt.

## Gather nodes (12, chapters 1–7)
o_trader_1 Port market · o_pow_2 Camp mess · 102 Docks · 108 Water station · 107b Docks · 209 Troop hold · 311 Quarter square · 410 Registration line · 504 Plaza · 602 Briefing hall · 609 Port gate · 707 Wall camp.

## Taint (pre-×0.7, every single delta ≤ 30, mapped by behaviour)
betrayal/scheming → Tzeentch (402 report, 502, 505 stare, 508, 509a lie) · vanity/perfection → Slaanesh (408 cheer, 506, 509 smile) · killing lust → Khorne (302, 403 shoot, 406 fire, 507 mark, 706/802 Silas) · despair → Nurgle (604, 605a, 610a, 708). Applause (102) and passing drills (206): no taint. Tuned by simulation to the 6–12 % band.

## Events
eventRoll on 202, 300, 312, 501, 511, 601, 708 only. `where.nodes` for evt_t_tau_tzeentch / khorne ("after the orks", ch4+) / cleanse / slaanesh / nurgle and evt_lore_damocles.

## Endings
Keep all 14 ids/titles. Rewrite: reeducation (no Rena), citizen (gate + "the street's children"), watch (gate + alt for Jory/Rena/Kroot), devoured (go back for Rena / 92's beacon, alt), death_sanity (neutral + alt), death_corruption (alt without Silas), claim_nurgle (no "returns"), claim_tzeentch ("people across the Gulf"). New: tau_end_thirdwave.

## Result (writer, end of run)
116 nodes (+21, none removed/renamed) · false choices 0 % · forced chapter steps 0 · hard jumps 29, unjustified 0 · never-read flags 0 · 12 gather nodes (ch1–7) · median run 61 · death 25.4 % (v0.3.3 25.5) · origins −1.7/+0.2/+1.5 · claims 8.3 % · good 25.3 % · new ending `tau_end_thirdwave`.
Taint note: ordinary behaviour ≤ 30 per choice; the three direct Chaos contacts (505 stare, 506 Silas, 507 mark) are 50 and the Silas-god invocations (706b, 802) 50 — needed to keep claims in the 6–12 % band at ×0.7 while no single click can claim.
