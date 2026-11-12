# Aeldari route — rewrite plan (v0.4.0, story overhaul §32)

Writer notes, kept as part of the record. Source: `docs/audit/aeldari.md` (work list), SPEC §32.

## Baseline (v0.3.3, validator seed 1 × 3000)
101 nodes · false-choice 37/70 (53%) · shallow 22 · forced chapter steps 8 · hard jumps 18 · never-read flags 14 ·
death 21.3% (agri 21.4 / pilgrim 20.0 / trooper 22.6) · good 20.5% · claim 16.0% · avg nodes 44.4.
Targets: death 15.3–27.3%, origins ±6 of route avg, claim 12–18%, good ≥ 22%, nodes 80–145, typical run 52–68.

## Structure (spine per chapter; new ids in **bold**)
- Ch1 Valda. agri 101→102 (gather 打谷场)/103 → 104 (gather 礼拜堂)/105/106(**106b** cloak: duskStones)/108 → 107 (midnight, parents, ranger on ridge).
  pilgrim o_p_1 (gather 货舱; supply ship, not grain barge) → 2 → 3 → 4 → 5. trooper o_t_1 (gather 营房) → 2 (**o_trooper_2s** call sent) → 3 → 4 (**o_trooper_4c** Edda drags you, you part) → 5.
  Every origin ends with two choices: run now → **eld_107r** (ch2 bridge) / hide and watch till dawn → **eld_107w** (ch2 bridge, sawTally).
- Ch2 Harvest. 201 (dawn; no eventRoll) → 202 (gather 着陆场; **202l** shuttle rises, nellLander) → 204 (Edda; Nell stashed in culvert if nellKept) → 205 → **205w** (cross the burning fields to the ridge) / 206 (ditch) → 203;
  or 201 → **201b** (culvert all day; reasons to go to the white stones by flag; sets nellKept) → 203.
  Webway gate moved to the **white stones on the ridge** (A10); black old stones = tomb. Times agree: every path reaches 203 at dusk.
  203 (**203p** pilgrim) → 207 → 208 (price + mechanism B2) / 209 (Taethra herself closes the light on Nell; Jorban with alt) / 211;
  210 (Mireth) → **210n** (stay; pre-ending) → end_harvest. **211** threshold (Mireth introduced to all, the two numbers for all, Nell's fate by flag) → 301 / 302.
- Ch3 Webway. 301 (bridge, warp; **301t** touched wall) / 302 (bridge) → 303 (**303h** heardHer) → 304 → 305 → 306/307; 308 (**308s** Sylvaen with white stone) → 309 (metVhessra) → 310 (laugh option) → endings lost/drukhari.
  307 → 400 (port crowd) / 401 (arrive quietly).
- Ch4 Craftworld (B34: council). **400** port (gather 港口; Mireth appointed keeper) → 401 (**401r** rules) → 402 (403) → 404 → 405 (**405v** Valda in the runes) → 406 → 407/408 (**408d** Mireth's deep dream) → 410 (**410k** keep mask) → 409 (**409m** with Mireth) → 411 (gather 膳厅) → **411c** Seer Council: Ellaris speaks (bonesong) / Exarch speaks (maskOff) / own roll / silence → 501 or **501w** (under watch).
- Ch5 Masque. 501 (bridge, gather 剧场前廊; **501m** fetch Mireth) → 502 (four-armed dancer foreshadow) → 503/504 → 505 → 506 (gather 码头; Sylvaen, alt by sylvaenWord/sylvaenWebway/trooper flags) → 507/509/508 → 510 → **600** (willing) / **600d** (escorted).
- Ch6 Maiden world. 600/600d bridges → 601 (**601a** agri soil) → 602 (gather 长老树下; **602v** elderKnows) → 603 → 604 (Seyl has a reason) → 605 → 606/607 (**607w** watch the plucking hand = tzeentch by choice, B13)/608 → 609 (success: savedChild; Vhessra = Mireth's sister) / 610 (fail) / **610h** (hid) → **610s** (stone to Taethra) → 611 (gather 葬礼).
- Ch7 She Who Thirsts. **700** (with Taethra) / **700r** (with Sylvaen) → 701 (gather 追思厅; grudge moved to "keep the stone", B15) → **701e** → 702 (**702t** tasted) → 703 (bait = Mireth's stone or lure stone, B31) → 704/705/706 (**706b** pre-ending) ; 705 (gather 神殿外广场; **705c** charm; follow the Avatar if woreMask) → 707 → 801 / **800**.
- Ch8 Last Dance. 800 (farewell) / 801 (**801s** stone) → 802 (heardWord option) → 803 → 804 (Avatar holds the gate by alt) → 805/806/807 → endings; **806h** pre-ending for burned.
  806 gates: Ildaneth needs maidenOK (ateFruit / elderKnows / savedChild / soilFriend), Selunar needs canSing (bonesong / charm / sangDead), Ynnari needs ynnari.

## Gather nodes (13; ch1,2,4,5,6,7)
102, 104, o_pilgrim_1, o_trooper_1, 202, 400, 411, 501, 506, 602, 611, 701, 705.

## eventRoll (7) and event `where`
301, 404, 407, 409, 508, 601, 701e. Route events get `where` (scenes + chapter); evt_t_eld_tzeentch → webway ch3; evt_t_eld_cleanse sets wardStone; nurgle event: "find the elder".

## Flags read (new reads for the 14 never-read)
sentCall→202 alt/end_burned · heardWord→802 option · jorbanKnows→209 alt · knowsPrice→211 alt · mirethHand→211/302 alt · bonesong→411c option/canSing · toldDreams→703 alt · mirethFlower→609/610 alt · sawMasque→805 alt · forgave→700r alt · loyal→806 alt · mirethDead→701 alt · tasted→802/803 alt · bait→707 alt.

## New endings
None (≤2 allowed; not needed).

## Result (after rewrite, seeds 1/5/9 × 3000)
140 nodes (+39, none removed) · false-choice 0% · forced steps 0 · unjustified hard jumps 0 · never-read flags 0 · 14 bridges · 62 alt nodes · 12 gather nodes · median run 62.
Death 18.3–19.3% (baseline 21.3) · origins within ±5.3 · claims 12.6–13.4% · good 22.5–22.8%.
Deviations from the plan: o_trooper_4c dropped (prologue cap 3–6); 210n lets you run back to the gate (Mireth waits) to keep end_harvest near its old rate;
ch3 has no gather node (webway). Shallow-branch metric stays high (83%) by design: most branches are one-node beats whose flags are read later.
