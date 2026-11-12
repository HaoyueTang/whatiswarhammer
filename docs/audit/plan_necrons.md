# Plan · necrons route overhaul (v0.4.0, SPEC §32)

Baseline v0.3.3 (validate seed 1, 3000 runs): 99 nodes · death 30.4 % (archivist 30.2 / convict 33.1 / lexmech 28.0) · good 22.5 % · claim 3.9 % (band 3–8) · avg nodes 45.8 · false-choice 37/60 (62 %, validator 47 %) · forced chapter steps 7 · hard jumps 18 · never-read flags 31 · gather 0.
Targets: death 24.4–36.4 %, origins ±6, claim 3–8 %, good ≥ 22 %, nodes ≤ 145, median run 52–68, false choice ≤ 5 %, forced 0, unjustified hard jumps ≤ 3, never-read ≤ 3, gather ≥ 8 in ≥ 6 chapters.

## Fixed decisions
- **T1 / C8 / T2 (time).** The 700-year late arrival is dropped. Stasis 380 y stays (`nec_501`, the route's core idea; date ≈ 493.M42, still inside M42 — §32.7 allows leaving the 111–115 window). The humans returned during those centuries and have drilled for about a century; the Collector notices only when the drill reaches the cage's first layer (briefing `nec_512a`), so the trip through the dolmen gate is days (`nec_605`/`nec_606` d:2, no warp). `counted` now means "you arrive late by a night — the drill is a layer deeper" (alt). Vektrix-9 (≈ 500 years later) is explained as nearly all machine (E7).
- **L1.** `nec_312`: Imotekh demands fealty; the Silent King's summons is the old order. Three advices: delay both (`advisedDelay`), kneel to the Stormlord (`ahmetSubmit`), answer the King / defy Imotekh (`ahmetKing`, lightning strike kept). Echoed in `nec_313`, `nec_401`, `nec_702`, `nec_705`, `nec_810`.
- **Props (C2/O2).** No sketchbook in shared text: "your notes / 你的记录"; origin-specific wording via `alt` on `origin_*`. New merged flag `readsGlyphs` (set wherever `sketched` or `translator` is set) for glyph checks (`nec_802`).
- **Living voice rule (D3).** `nec_803`: without a living voice the crypteks plug the cage with their own bodies (Nefer dies, `neferDead`, new `shardHalf`) — echoed in `nec_810`, `nec_808`.
- **New endings (2):** `nec_end_ceasefire` 「两军之间」 good (`nec_808` negotiate, needs `stoodBetween` from `nec_810`, renown roll); `nec_end_webway` 「借道网道」 good (`nec_810`, needs `wentWebway` — you left the gallery with the rangers in ch6).

## Spine per chapter (new nodes in **bold**)
1. Archivist 101 → 102 (translate → **102a** Marrow's tent at night, `marrowPlan`) / 103 (`heardClick` / translator) → 105 gather 食堂帐篷 (`kaalTrust` / `bootsMocked`) → 104 (`sketched` / `dreamCorridor`) → 106 (`warned` / `drillHand` / `sawCog`; alt intro of Kaal+Oriel for lexmech) → 107 (`sawEyes`).
   Convict 1 (`quota` / `calledGuard`) → 2 (`hollisFriend`+kaalTrust / `sliver`) → 3 gather 犯人围栏 (`lostBet` / sketched) → 4 (`unshackled`) → 106. Lexmech 1 (`doubter`) → 2 (translator / wronged_vektrix) → 3 gather 配给队 (`marrowCopy` / `loyalScribe`; boots line O3) → 4 (`handshake`) → 106.
2. **108 bridge** gather 食堂帐篷 (evening after the seal; alt warned/sawEyes/drillHand) → 201 (+ unshackled pad run, warned alt) → 202/203/204 → 205 (+ kaalTrust exit option; eventRoll removed; alt marrowFled/notes) → 206/207/208 → 208 (speaker "cable-cloaked figure", language line, alt handshake/sliver/savedOriel) → 209 (alt first line by path) → **209a** gather 幸存者围栏 / 301; 210 pit (scene tomb_exterior) → 209 / 301.
3. 301 **bridge** (throne hall; alt pit = self-introduction, sawPen; eventRoll) → 302/303/304 (`askedCourtiers`) → 305 → 306/307 → 308 → 309/310/311 → 311 (eventRoll; `knelt` / `askedKing`) → 312 (three stances).
4. **313 bridge** gather 俘虏厅 (forty days; alt per stance) → 401 (alt per stance; eventRoll) → 402 (`defiant` / `askedCount`) → 403 (Kaal sold too; "tenant" hint E3) → 404 → 405/406/407/408 → **408a** Imhet's ship (`jump`, plaque engraved by origin, Kaal's cube) → 409 (pose flags).
5. 501 **bridge** (380 years; alt pose) → 502/503 (`seerScream` / `copiedPlaque`) → **502a** gather 候场间 → 504 (+ copiedPlaque option; eventRoll) → 505/506 (`booth41`) → 505 (`tyrantEye`) → 507 → 508 (`promiseKaal` / `lookedAway`) → 509 → 510/511/512/513 (`thiefMarked`).
6. **512a bridge** briefing (Collector's plan, stasis cube `collectorCube` or refuse) → 601 (resultAlt for glyph lock; docent option) → 602 (promise gated; + go with them → **602a** webway with the seer → **602b** rangers' gate on Thessa Null) / 603 (`rangerMarked`) / 604 → 607 (`warnedCollector`) → 605 (`counted`) → 606 → **606a** gather 朝圣者营地 (ch6) → 701 / 702.
7. 701 gather 劳工食堂 (alt doubter/loyalScribe/sawCog) → 703 (`pleaded` / `stalled`) / 704 → 708. 702 **bridge** (alt per stance, why he let the humans drill) → 705 (`servesSekhrat` / `forHumans`) → 707 truce gather 撤离集合点 / **707b** betrayal (`leftNote` → forgiven_mordane) / **707c** straight to the cage → 708 / 706. 708 (alt marrowCopy/freedColleagues/footnote by origin) → 706 (alt address: sawShard/drillHand/handshake) → **709 bridge** (dawn before the last layer).
8. 801 (alt shardWhisper/wentWebway) → 802 (readsGlyphs; + collector cube after sealing at 806) / 803 (`shardHalf`, Nefer) / 804 / 805 → 806 (alt first line; cube → **806a**) → 810 (alts sealed/shardHalf/betrayed/stance/tyrantEye; webway exit) → 808 (+ negotiate → ceasefire) → 809 (alts) → endings.

## Events
`where` on evt_t_nec_tzeentch (tomb, ch3–4), evt_t_nec_nurgle (captives' hall: nec_401, text "关在俘虏厅"), evt_t_nec_cleanse (tomb ch3–8), evt_t_nec_khorne (nec_810 only), evt_t_nec_slaanesh (gallery), evt_nec_scarab (tomb ch2–4), evt_nec_echo (tomb ch4–7), evt_lore_war_in_heaven (tomb/gallery ch3–5), evt_lore_silent_king (tomb ch4).
eventRoll nodes: 301, 311, 401, 504, 702, 708, 810 (205, 308, 606, 701 removed).

## Gather nodes (10)
105, o_convict_3, o_lexmech_3 (ch1) · 108, 209a (ch2) · 313 (ch4) · 502a (ch5) · 606a (ch6) · 701, 707 (ch7).

## Rumours
Plaque rumours reworded as read aloud in the green room (minChapter 5); rum_nec_pariah maxChapter 5.

## Result (2026-11-12, validate seed 1 / 3000 runs; seeds 5/9 in brackets)
115 nodes (+16, none removed) · multi-choice 68 · false-choice 0 % · shallow 17 % · forced chapter steps 0 · hard jumps 9, unjustified 0 · bridges 7 (108, 301, 313, 501, 512a, 702, 709) · jump marks 4 (408a, end_truth, end_curator, end_webway) · never-read flags 0 · alt 59 nodes / 157 entries · resultAlt 5 · gather 9 (ch 1,2,4,5,6,7; passes/run 5.8 — warn < 6) · median run 55 (avg 53.5).
Death 29.4 % (v0.3.3: 30.4) — archivist 28.1 · convict 33.6 · lexmech 26.5 [26.7 / 27.8] · good 28.9 % (was 22.5) · claim 3.6 % [3.6 / 3.8] (band 3–8) · grudges +1.0 pt.
Deviations from the plan: 701 is not a gather node (would follow 606a directly); 313/502a use the `barracks` scene (the validator flags tomb/gallery scenes for crowds); 209 → both choices lead to 209a (pen on the main path); flags `guest`, `banquet` no longer set; 806 has no Sekhrat grudge (≤3 per npc).
