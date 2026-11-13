# Shared events & rumours pass (SPEC §32.1 rule 11, §5, §20b/§20c, §27) — 2026-11-12

Scope: shared/generic entries in `data/events.js`, `data/events_lore.js`, `data/events_taint.js` (`evt_t_any_*`), `data/rumors.js`, `data/sector.js`.
Route events (`evt_t_<route>_*`, events inside `data/factions/*.js`) were read against their nodes and left as the writers set them (no errors found).
New tool: `tools/dev/event_matrix.js` — per route and `eventRoll` node: chapter / scene / time / text excerpt and every event that can fire there
(faction, excludeFactions, minChapter, `where`; flag-gated ones marked `?`), then event → routes → nodes, then dead rolls.
`node tools/dev/event_matrix.js [--faction f] [--event id] [--en] [--text] [--table-only] [--nodes-only] [--dead]`.

## Baseline → after (validate.js --allow-missing-ending-art, seed 1, 3000 runs)

| route | death | claim | good |
|---|---|---|---|
| imperium | 30.7 → 29.6 | 13.2 → 13.5 | 24.8 → 25.0 |
| chaos | 26.5 → 26.1 | 23.8 → 24.1 | 26.6 → 26.1 |
| tau | 25.4 → 25.2 | 8.3 → 8.3 | 25.3 → 25.1 |
| aeldari | 18.3 → 17.1 | 13.4 → 14.6 | 22.6 → 22.2 |
| necrons | 29.4 → 28.3 | 3.6 → 3.3 | 28.9 → 29.5 |
| orks | 31.7 → 30.9 | 6.3 → 6.1 | 25.8 → 26.1 |
| gsc | 21.9 → 21.8 | 3.8 → 3.7 | 23.3 → 23.4 |
| mechanicus | 26.3 → 26.3 | 9.2 → 9.1 | 24.7 → 24.8 |

Seed-1 numbers move with any change to the event pool, because the RNG stream shifts. A controlled A/B (same engine, my `where` / `excludeFactions` removed at runtime vs kept;
4 × 8000 runs per route, seeds 37/41/53/67 and 11/23) gives the real effect: imperium death −0.5, aeldari −0.5 (claim +0.7), necrons −0.7, orks −1.0 (claim −0.7, after adding `evt_nurgle_pen`), gsc −0.6, mechanicus −0.5,
chaos / tau ±0.2. All claim bands still ✓. Warnings 39 → 35 (rumour count, 3 never-heard rumours gone, chaos deserter ending now reached; new: two "never visited" rare claim/death nodes on necrons/mechanicus, seed noise).
Errors 0. `date_audit.js` 0 anachronisms. `smoke_test.py --only-v040` 30/30.

## Events (19 shared events changed, 1 added)

"Sleep set" = notNodes `imp_306` (warboss charge, 2 h after the previous trench node), `imp_714` (day five of the siege, "can't remember the last time you slept"),
`cha_701` (charge into Aldrin), `nec_504` (thawed from 380 years of stasis an hour ago), `nec_810` (minutes after the shard fight).
`stasis_gallery` is excluded from every generic event (only `nec_504` uses it; the gallery events `evt_t_nec_slaanesh`, `evt_lore_war_in_heaven` remain).

| event | change | why |
|---|---|---|
| evt_khorne_1 (arena dream) | notScenes stasis_gallery, notNodes sleep set | a dream between two moments of one battle / in stasis |
| evt_khorne_2 (comrade shoves you over a ration) | excludeFactions aeldari, orks, gsc; notScenes tomb_interior, stasis_gallery, mars_vista, craftworld, webway, maiden_world | needs human comrades sharing rations (barracks scene); nonsense on the ark, among orks, in a cult family, in a tomb |
| evt_nurgle_1 (fever, old man by the bunk) | excludeFactions aeldari, orks; notScenes tomb_interior, stasis_gallery; notNodes sleep set | barracks/bunk scene; Ork route gets its own version below |
| **evt_nurgle_pen** (new, orks) | fever in the scrapyard, same effects as evt_nurgle_1 | keeps the Ork route's Nurgle/death balance after removing the barracks events (A/B: without it orks death −1.1) |
| evt_nurgle_2, evt_tzeentch_2, evt_slaanesh_2, evt_t_any_note | notScenes stasis_gallery | — |
| evt_tzeentch_1 ("don't go left tomorrow") | + notNodes sleep set | needs a day between |
| evt_slaanesh_1 (perfect fruit) | + notNodes imp_402 | "every meal tastes of ash" right before "the soup is good" |
| evt_undivided_1 (star under your bunk, "report it") | excludeFactions chaos, orks, aeldari, gsc; notScenes tomb_interior, stasis_gallery, mars_vista; notNodes imp_306, imp_714, nec_504, nec_810 | needs a bunk and an authority that burns heresy; on the Chaos route the star is normal, on Ork/GSC/ark "report it" is meaningless |
| evt_undivided_2 (knocking) | notScenes stasis_gallery, notNodes sleep set; text "solid rock" → "there should be nothing at all" | most rolls are aboard ships (the other side of a hull is void, not rock) |
| evt_other_1 (distant light) | notScenes webway, tomb_interior, stasis_gallery, daemon_world, mars_vista; notNodes imp_501, tau_511, tau_601, gsc_504, gsc_509; text: the light now seeps "through the Rift", faint | `place_arcosa`: the Astronomican no longer reaches Arcosa; not where the Shadow in the Warp has fallen (imp_501 "a shadow blocks the light", T'au ch6 dreams, GSC ch5), not in the Eye, the webway, a null tomb, or right before mech_607's own golden vision |
| evt_other_2 (the warp falls silent) | factions imperium, tau, gsc; where nodes imp_501, tau_511, tau_601, gsc_409, gsc_504, gsc_509 | it is the Shadow in the Warp (codex `xenos_shadow_in_warp`): only where the hive fleet approaches |
| evt_t_any_dice, evt_t_any_feast (dreams) | notScenes stasis_gallery, notNodes sleep set | — |
| evt_lore_armageddon (tattooed cook) | where nodes imp_208, imp_400, imp_501, imp_611 | troopship mess; was firing in the trench charge, at Brin's soup (imp_402/403/707: two soups at once) and on day five of the siege |
| evt_lore_cadia (Cadian in the ruins) | where scenes ruins, underhive | text sets it in ruins; was firing mid-charge, mid-jump, in the Eye |
| evt_lore_badab (Red Corsair on a nearby channel) | notScenes warp, daemon_world | no vox traffic mid-jump; the Maelstrom's corsairs, not inside the Eye |
| evt_lore_terra_vision | notScenes webway | robustness (sealed from the warp) |

No dead rolls (event_matrix and validator). No `eventRoll` node has to move. Optional for route writers: `imp_306` and `imp_714` roll in the middle of a battle — only waking-moment events fit there now (8 and 9 eligible).

## Rumours

- **Never heard → fixed** (wording + `when`, no route files touched):
  `rum_cha_isstvan` — was outscored at every ch5–6 gather node; now a veteran hawking Heresy-era armour at the Eye bazaar (cha_509: scene + codex `place_bazaar_eye` + keyword, ties `rum_cha_eye` 3:3).
  `rum_eld_fall` — now talk in the theatre hall before the Harlequins play the Fall (eld_501 "丑角剧团来了", score 2, top there).
  `rum_eld_iyanden` — now news a Ranger brings in at the docks (eld_506, ties `rum_eld_war_heaven` 2:2).
  Side effect fixed: `rum_eld_guilliman` lost eld_501, so it got sprite `aeldari_seer` ("the seers still argue") → ties `rum_eld_age_of_strife` at eld_411.
- **Imperium 15 → 12 route rumours** (ids referenced nowhere else — chronicle, achievements, codex, events, src, tools grepped):
  removed `rum_imp_armageddon_tattoo` (duplicate of `evt_lore_armageddon`, same cook and tattoo; `chr_second_armageddon` still unlocked by that event and by Ork/Mechanicus rumours),
  `rum_any_kraken` (no Kraken link on the Imperium route; `chr_iyanden_kraken` still via `rum_eld_iyanden`),
  `rum_any_leviathan` (a dream, not a crowd; `chr_leviathan` still via `evt_lore_silent_king`, `rum_tau_leviathan`, a GSC rumour).
- **Crowd wording (§20c)**: all 13 shared rumours were memories/dreams ("you remember…", "you dream…") — rewritten as overheard talk, a lullaby at the next table, a coin passed round, children's skipping rhyme, a hymn someone starts, a pilgrim's story, a charm on the next bench; header comments updated. `rum_nec_unification` (professor's notes) → she reads them aloud to the mess table.
- **Dates / lore**: `rum_imp_baal` (a wounded man who saw Baal would be 120+ in 114.M42) → second-hand "Grandad said…"; `rum_imp_plague_wars` speaker → "an old broadcast on a loop" (rule 7: Indomitus-era news not presented as new);
  `rum_eld_octarius` claimed the Aeldari burned the worlds around Octarius (not canon) → Kryptman's gambit seen by Aspect Warriors (both sides growing).
  Checked on Lexicanum: Aun'Va died at Mu'gulath Bay (Second Agrellan Campaign, Culexus, covered up) — `rum_tau_mugulath` ok; Leviathan 997.M41 from below the galactic plane — `rum_tau_leviathan` ok.
- All rumours ≤ 50 zh / ≤ 35 en words; speakers ≤ 6 en words. Per route ever-heard: all route rumours heard (aeldari 11/12: `rum_any_eye` never fits the ark — NOTE only).

## Taint / claim (events_taint.js)

Shared `evt_t_any_dice/feast/note` placed as above; route taint events read against their nodes, all fit. Claim bands all ✓ (necrons 3.3 % is near its 3 % floor, as before: 3.6 → 3.3 seed 1, A/B 3.13 → 3.20).

## Echo templates (sector.js)

New endings checked (`tau_end_thirdwave`, `gsc_end_passenger` are bad endings where the person lives; the other three are good and never echoed).
`echo_casualty_list` "list of the dead" → "a list of names"; `echo_sermon` / `echo_choir` "the dead" → "the lost", so a survivor's bad ending isn't read as a death.
`echo_sermon` (street preacher, "The Emperor remembers") no longer on the Aeldari route (ark crowds have no street preachers). Orks / GSC / Mechanicus use the four "*" templates only — fine.

## Leftover / doubts

- Necron tombs suppress the warp (§19 taintMod 0.5), yet generic chaos dreams can still fire on `tomb_interior` nodes (nec_301/311/401/702), like the writer's own `evt_t_nec_tzeentch`. Kept for the claim band (necrons is near its floor); a lead decision if stricter.
- GSC ch5 ("the Shadow has fallen") still allows generic chaos-god events; removing them would push the GSC claim rate below 3 %. Lore: the Shadow muffles, not erases (GSC taintMod 0.6).
- Arcosa "beyond the Astronomican" (place_arcosa) vs. Navigator talk of "the light" on the Imperium route (imp_501) — route text, not changed.
- `rum_any_eye` never fits the Aeldari route (NOTE). `rum_tau_mugulath` calls Mu'gulath Bay a loss "for Shadowsun"; Lexicanum ties her to the earlier win only — vague enough to leave.
