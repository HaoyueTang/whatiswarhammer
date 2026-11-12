# Plan — Imperium route rewrite (v0.4.0, SPEC §32)

Baseline v0.3.3 (validator, seed 1 × 3000): 109 nodes · avg run 43.2 nodes · death 30.6 % (hive 34.4 / agri 31.7 / noble 25.8) · good 30.0 % · claim 12.7 % (band 12–18) · grudge +0.8 pt.
Targets: death 24.6–36.6 %, origins ±6 of route avg, good ≥ 22 %, claim 12–18 %, run 52–68 nodes, 80–145 nodes.

## Spine and bridges (new ids)
| ch | bridge / new nodes | where / when / who | carries over |
|---|---|---|---|
| 1 hive | `imp_106b` holding pen (gather 征兵仓) | night after the list → 3 days, hive base; Pell, the chosen, enforcers | reportedMina / hidMina / marked (deserter brought in) |
| 1 hive | `imp_108b` scavenger's drain route | underhive day 2; one-eyed scavenger | eat → `underhiveFriend` (read 711) |
| 1 agri | `imp_o_agri_2b` father punished | farm, same day; assessor, father, mother | gaveStash → agri_3 alt, 701a |
| 1 noble | `imp_o_noble_2b` brother called in | spire hall; father, brother | `brotherShamed` → noble_3 alt, 701n |
| 2 | `imp_200` (bridge) boarding troopship *Oath of Iron* | orbital dock, day 3–4; Vosk's roll call, all origins | origin / marked / giltBook / reportedMina |
| 2 | `imp_202b` the dead recruit's letter | barracks deck; Vosk, Dravik | `deadLetter` → 701h, 707, end_hold |
| 3 | `imp_300` (bridge) drop briefing | 4 days after the warp; Dravik, Vosk, Quell-7 | blessedGun / warpWhisper / lullaby |
| 4 | `imp_400` (bridge, eventRoll moved from 401) | a year later, transit Dustfall → Vessel ("second jump") | hero / fledDustfall / painkillers |
| 4 | `imp_411b` the leash | cathedral; Haak | `haakLeash` (no coin, brand) |
| 5 | `imp_500` (bridge) briefing: Hesper silent 3 months | ship, Vessel → Hesper; Vosk, an Inquisition aide | inqCoin / haakLeash / origin_agri / sawEyeShip |
| 5 | `imp_517` quarantine line (gather 检疫队伍) | day after Exterminatus; medic, Dravik | kissed → confess / `hidKiss` |
| 5 | `imp_518` Dravik's evacuation list | same day | fledHesper / fledDustfall → `penal` (604's sentence moved here); both → end_commissar |
| 6 | `imp_600` (bridge) two years | troopship; Pell | penal / voskDead |
| 7 | `imp_700` (bridge) drop into Aurex | orbit → landing; the lone loyal Marine on the tower | heardSong / penal / Mina's vision |
| 7 | `imp_701h` / `imp_701a` / `imp_701n` origin homecoming beats | landing field → own home | deadLetter, seedsHome/gaveStash, serrinRing/ringReturned/brotherShamed/knowDebt |
| 7 | `imp_702p` penal company | landing field | penal |
| 7 | `imp_713b` pulled workers off the bridge; `imp_713r` the runner (day 3) | | corporal → shoot / spare; others shield / look away |
| 8 | `imp_800` (bridge) retreat up the spire | night of day 5 | stayedWithPell / ambushSix / heldCathedral / blewBridge / voskDead |

## False choices → real branches (all 26)
agri_1 handsRaw/fixedHarvester (agri_4 alt, 207 alt) · agri_2 → agri_2b · agri_3 agriSeeds/seedsHome · agri_4 hidSky/askedHive (agri_5 alt) · agri_5 toldPellSky (714 alt) · noble_1 knowDebt (noble_2 alt, 701n) · noble_2 → noble_2b · noble_3 serrinRing/ringReturned (701n) · noble_4 plainBook/giltBook (noble_5 alt, 200 alt) · noble_5 pellFriend (304/714 alt) · 107 sawBlackShip (605 alt) · 108 → 108b · 202 → 202b · 301 extraAmmo (309 alt text) · 311 painkillers (400, 707 alt) · 415 inqCoin / refusedHaak / branded · 506 dugIn (509 alt) · 516 single choice + alt · 602 askedDravik (804/805 alt) · 605 minaMessage/spurnedMina/forgiven_mina (607/610/806 alt) · 610 forgiven_pell (714 alt) · 611 heardSong (710 require) · 701 → origin nodes / penal · 714 stayedWithPell (800, end_hold alt) · 801 sangHymn / weighedKneel (802 resultAlt, 806 alt) · 806 heldAstropath (end_hold alt).

## Fixes from the audit
D09 106 time · D10–12 405/411 gated on drankSoup / sawShrine · D13 caughtAtGate + 411b · D14 sky friends shot down (415 alt, sawEyeShip → 608) · D16 brood {h:40} · D17 517 · D23/24 605 origin alts, sanctioned psykers · D25 death_sanity no Arno · D26 lone Marine set up in 700 · D29 515 · D32 710 = volunteer for a post · D36 106b · D37 noble times · D38 201/204 text · D39 701 sky / great_rift codex moved to 601 · D41 701 origin options, end_hold alts · D43 ring no slaanesh · D45 808 gates · D46 claim texts time-neutral · D48 · D49 601/603/808 regent's edict, battle group · D50 tower is the sector relay (608, 801) · D51 kiss from the dark · D52 Exterminatus signed by the Inquisition aide · D54 prayer primer.

## Gather nodes (≥8, chapters 1–7)
103 楼梯间 · 104 广场 · 106b 征兵仓 (hive) · o_agri_4 征兵站 · o_noble_5 运兵车 · 201 军械库 · 209 食堂 · 311 野战医院 · 401 施汤队伍 · 506 营地食堂 · 517 检疫队伍 · 601 食堂 · 701 着陆场 · 712 大教堂.

## Events
eventRoll: 208 (warp), 306 (trench, after first wave; moved from 301), 400 (ship transit, moved from 401), 402/403 (Vessel rain), 501, 611, 707, 714.
`where`: evt_t_imp_tzeentch → ship/warp scenes · evt_t_imp_khorne → trench, ch 3 · evt_t_imp_nurgle → ch 4 Vessel nodes · evt_t_imp_slaanesh → ch 6 · evt_t_imp_cleanse → not warp.

## Endings
No new ending ids. 808: good endings need corruption ≤ 59 and no hidKiss; purged forced otherwise; crusade not for penal unless hero (pardon); coin only for those who helped and were not leashed. end_hold / crusade / servitor / commissar get alt lines; claim endings rewritten time-neutral.

## Outcome (validator, seeds 1/5/9)
128 nodes (+19, none removed) · multi-choice 66 · false choices 0 % · forced chapter steps 0 · hard jumps 11, unjustified 0 · never-read flags 0 · gather 13 (ch 1–7) · median run 58 (avg 53) · death 30.4–30.7 % (origins within ±2.4) · good 24.8–26.0 % · claim 13.2–14.5 % · grudge +0.6 pt.
Open: shallow branches 33/44 (75 %, warn) — most re-merge after one own node and carry a flag echoed later by `alt`; fixing structurally would need ~2 extra nodes per branch (over the size/run budget).
Changed vs plan: imp_701h/a/n merged into one `imp_702` (alt per origin, 4-choice cap); sawEyeShip folded into 608 base text; double flight (Dustfall + Hesper) → imp_end_commissar from imp_518; hidKiss → imp_end_purged decided at imp_806; 808 "躲开那道光" became a roll "咬着牙走进那道光" (hold / purged).
