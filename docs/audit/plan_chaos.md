# Plan · chaos route overhaul (v0.4.0, SPEC §32)

Baseline v0.3.3 (validate seed 1, 3000 runs): 111 nodes · death 27.0 % (scav 25.8 / des 27.6 / scribe 27.7) · good 27.7 % · claim 24.9 % (band 20–30) · avg nodes 42 · false-choice 44/75 (59 %) · forced chapter steps 7 · hard jumps 27.
Targets: death 21–33 %, origins ±6, claim 20–30 %, good ≥ 22 %, nodes ≤ 145, median run 52–68, false choice ≤ 5 %.

## Fixed decisions (D1–D4 of the audit)
- D1 conditional text = `alt` / `resultAlt` (§32.2). D2 death nodes: neutral text (+ `alt` on fromChapter). D3 size ≈ 135. D4 Ixaril = Black Legion sorcerer sent to the Choir, seen at Vellum's side from cha_208 on (scribe origin meets him earlier in cha_o_scribe_4a); Strand seen by everyone at cha_310 behind the Space Marines.
- No new endings. No ids removed.

## Spine per chapter (new nodes in **bold**)
1. 101 → 102 (**102a** idol night) / 103 (**103a** stolen bucket) → 104 (Tikka arrives on both paths; betray needs `metWhistle`; idol option) → 105 gather 拾荒集市 (→ **105a** theft) → 107 gather 施粥堂 (→ **107a** name wall: Vellum's "four" + the Warmaster's eye) → 108.
   Origins: deserter 1→2→3 (roll success → **o_deserter_3a** "dead on paper" `fakedDeath`; `soldBoots` option on corpse roll) → 4 (theft → 105a alt) → 107. Scribe: cathedral = mid-hive St Vorne's (same one burned in ch3); 1→2→3→4 (follow the song → **o_scribe_4a**, meets Ixaril, `metIxaril`) → 107.
2. 201 **bridge** gather 布道会 (alt `refusedWash`, `askedPrice`) → 202/203 → 204 (+ `keptCopy` offering) → 206 → 207 / sacrifice → 205 (alt `stubborn` explains brand) → 208 (Ixaril introduced) → 209 gather 领面包的队伍 → **209a** cobbler / Kade / **209b** Old Rust.
3. **210 bridge** (eve of Tithe Night, alt want*) → 301 (+ scribe undercroft option) → gate 302 → (**302a** alley) / prison 303 (`metWhistle` alt intro) → **303a** Whistle's drain / mansion 304 (mid-hive guild house) → **304a** mirror follows → 305 (drag Tikka → **305a** steps) → 307 gather 大教堂台阶 (alt fromNode 309 = next dusk) → **307a** bell tower (`heardWarmaster`) → 310 (Strand seen by all; eventRoll moved here) → **310a** marine's face → 311. Capture: 306 (alt kadeKnows/fakedDeath) → 308 (sanity roll, fail = babbling → pyre) → 309 → 307.
4. **312 bridge** (three days down, alt `leftVellum`) → 401 (alt want*/openedDoor) → 402–405 (alt intros: roared/knelt/ran; metIxaril/mocked; mirrorTouched) → 406 (whistle option gated `notFlag whistleLocked`) → 407/408/409/410 → 411 (alt leftVellum/namedVellum/namedNeighbor; `goldFrame` option).
5. **412 bridge** gather 藏身处 (forty days; Ixaril brings the "reply"; marines gone; Kade line closed by alt) → 501 (Rift already in the sky, A41) → **501a** hid → 502 → 503 (pistol given on entry) → 504 → **504b** boarding (Tikka aboard / alt leftTikka) → 505 gather 底舱 → 508 (fight success → **508a**) → 506 (warp) → 507 → 509 gather 集市.
6. 601 **bridge** (three years, alt foughtHold/fearless/honestHunger/fedThrall/devoted) → doors 602–609 → 610 → 611 gather 宣誓大厅 → 612.
7. **613 bridge** (briefing, jump: warp transit) → 701 → 702 (sing → **702a**) / 703 (spare → **703a** evac hint) → 704 (shadowBound option) → 705 (Strand projection; daemonBlade option) → 706/707 (alt leftTikka/savedTikka/sawMarks) → 708 → 709/710 (alt: flagship waits at system edge) → 711 gather 病患营地 (→ **711a** bridge ch8 Tikka leads to dock).
8. 801 **bridge** (intercepted Imperial channel; + toldStrand option) → 802 gather 撤离码头 (sparedGuard option; alt commissarKnows/fakedDeath) / 808 → 809 (crypt option) → 803 → 805 (lander needs notFlag toldStrand) / 806 (dig success → 802; blankBook option) / 807 (alt devoted_*). Endings: alt for origin wording and path.

## Flags read (new readers)
idol→104 option, end_prince alt · metWhistle(new)→104, 303 alt · robbedWhistle→303 alt · stoleMedicine→203 alt, 403 option · askedPrice→201/204 alt · refusedWash(new)→201 alt, 206 roll variant · soldBoots→deserter_3 option · taughtTikka→deserter_3 resultAlt, 711 option · fakedDeath(new)→306/802 alt · readBook→107 alt · keptCopy→204 option, scribe_3 alt · metIxaril(new)→208/404 alt · sawMarks(new)→707 alt · stubborn→205 alt · bloodGift/secretGift→402/404 alt · want*→210/401 alt · namedNeighbor(new)→411 alt · fakeName→210 alt · whistleLocked(new)→406 · mirrorTouched→304a/405 alt · smashed/goldFrame(new)→411 option · kneltRed/savedTikka(new)→402/707/711 · heardWarmaster(new)→412/501 alt · sawMarineFace(new)→704 alt · leftVellum(new)→312/401/411 alt · strandWatching→310/809 alt · spatKade(new)→308 alt · leftTikka→504b/707 alt · mockedIxaril→612 resultAlt · veiledMirror(new)→608 alt · wearHelmet/closedKadeEyes(new)→412 alt · kadeDead→412 alt · whistleGone→412 alt · choirSang/choirLoyal(new)→412 alt, 508 option · hidFromLegion(new)→502 alt · fearless(new)/honestHunger→601 alt · foughtHold/fedThrall(new)→601 alt · shadowBound(new)→704 option · soldMotherFace/soldYear(new)→711 alt, end_vanish alt · blankBook→806 option · sawPlan→708 alt · scribeLibrary→702 resultAlt · swornAbaddon/falseOath→805 alt · daemonBlade→705 option, 613 alt · sangHymn→806 resultAlt, end_light alt · sparedGuard→802 option · toldStrand→801/805 · slewMarine→end_champion alt · stayedRearguard(new)→808 alt · nurgleHealed(new)→711 alt · pistol→705 require · champion/patron→803/806 gates.
Stopped setting: none planned (patron kept as 806 gate).

## Events
evt_t_cha_khorne: text "in the nights after the rising", where ch3 → eventRoll moved 301→310. evt_t_cha_tzeentch: minChapter 2, where cult_shrine ch2 (cha_205). evt_t_cha_slaanesh: where ch5 ship (cha_506). evt_t_cha_nurgle: where daemon_world ch6+. evt_t_cha_cleanse: where ch2–4 Sump/shrine; "给他"→"给她" bug.
eventRoll nodes: 205, 310, 406, 506, 601, 701, 708.

## Gather nodes (11)
105, o_deserter_4 (ch1) · 107 (ch1) · 201 (ch2) · 209 (ch2) · 307 (ch3) · 412 (ch5) · 505, 509 (ch5) · 611 (ch6) · 711 (ch7) · 802 (ch8).

## Result (2026-11-12, validate seed 1 / 3000 runs)
135 nodes (+24, none removed) · false-choice 0 % · shallow 70 % (warn; see report) · forced chapter steps 0 · hard jumps 14, unjustified 0 · bridges 8 (201, 210, 312, 412, 601, 613, 711a, 801) · never-read flags 0 · alt 56 nodes / 114 entries · resultAlt 6 · gather 10 (ch 1,2,3,5,6,7,8; passes/run 7.9) · median run 55.
Death 26.5 % (v0.3.3: 27.0) — scavenger 28.3 · deserter 23.4 · scribe 27.9 · good 26.6 % · claim 23.8 % (seeds 5/9: 21.8 / 22.5).
Deviations from the plan: 105/o_deserter_4 not gather (would sit next to 107); 510 not added (601 is the ch6 bridge); flags `vellumDead`, `patron` no longer set; 809 gained a crypt exit; 801 "south dock" open to everyone (fled/sparedGuard echoed by alt).
