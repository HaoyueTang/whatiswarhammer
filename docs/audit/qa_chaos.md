# QA · chaos route (v0.4.0 read-through, 2026-11-12)

Reader: Opus QA. File: `data/factions/chaos.js` (135 nodes, unchanged count; no ids/flags/endings/npcs changed).
Runs read: 23 — scavenger / deserter / scribe × (seeds 2,3,4 · `--first` · `--last` · `--en` seed 7) + seeds 1, 11–16 (mixed origins) + deserter `--en` seed 21. Plus the whole file read node by node (every bridge, death, claim and `alt`).

Baseline before edits (validate, current shared data): death 26.1 % · good 26.1 % · claim ≈ 24 % · gather 10 · median run 54. After edits: identical (checked by swapping the original file back in under the same shared data — the small drift vs the plan's 26.5 / 26.6 comes from concurrent edits in shared event files, not from this route).
Gates after last edit: `validate --faction chaos --story-gate` PASS 0 errors · `route_graph --checks-only` 0 ERROR/WARN · `date_audit` 0 anachronisms.

## Defect log

| node | cat. | what was wrong | change |
|---|---|---|---|
| cha_412 | 1 People | Ixaril named for the first time here on most paths (208/210/o_scribe_4a only say "feathered stranger"; only the 404 branch names him) | base text: "羽毛斗篷的人钻出管道，自称伊克萨里尔" / "the feathered stranger … gives his name: Ixaril" |
| cha_310 (→705, 801, 809) | 1 People | Strand is named only in the capture branch (308); everyone else meets "斯特兰德审判官" by name at 705/801/809 without introduction | 310 (seen by all): "有人认出她：斯特兰德审判官。" / "Someone knows her: Inquisitor Strand." (text trimmed to stay ≤ 90) |
| cha_703a, 801, 802 | 1 People | "Corporal Hale / 黑尔下士" clashes with **Commissar Hale / 黑尔政委** of the Orks route (same sector, two people one name) | renamed to 安瑟尔下士 / Corporal Ansel everywhere (speaker, text, alt, choice label, result). Flag `sparedGuard` unchanged |
| cha_711 | 1 People | Tikka suddenly runs a sick camp on Aldrin; players who skipped 707 never learn how she got there (601 even says she went through the rotten door, 504b alt leaves her on Carcharos) | base text: "蒂卡乘着苍蝇船也来了阿尔德林…" / "Tikka came to Aldrin too, on a ship full of flies…" |
| cha_411 | 1 People | with `leftTikka` (she stayed by the Nurgle pool, "doesn't follow you") she is back as if nothing happened | new `alt.add` {leftTikka}: she came back from the pool, still damp, little things at her feet |
| cha_809 | 4 Assumed | "这回是她本人 / in person this time" assumes the 705 projection, which many rearguard paths never see | neutral: "亲自走在光的前面 / walks before it in person" |
| cha_504b, cha_711a | 1/7 | "跟小时候一样 / 像小时候推你钻管道" — deserter and scribe met Tikka weeks earlier as adults | "跟在污池时一样" / "像当年在污池推你钻管道那样" (en 711a adjusted) |
| cha_802 alt commissarKnows | 2 Place | a Carcharos regimental wanted picture at a dock on Aldrin, years later, unexplained | now on the Inquisition's list, "sent from Carcharos" (Strand has tracked you since then) |
| cha_o_deserter_3 alt soldBoots | 3 Choice→result | "the enforcers thought they'd found you, and fired" contradicts the base text (Kade still searching shack by shack) and the following "hang your tags on him" option | "a freshly shot body in your boots; Kade hasn't checked its face yet" |
| cha_claim_khorne alt | 4/6 | "no brand yet" variant only for chapter 1; the brand is given at cha_205, so a claim from 201–204/206 would mention a brand you don't have | condition now `any:[fromChapter≤1, fromNode 201/202/203/204/206]` |
| cha_death_corruption alt ch≥5 | 4 Assumed | "沃加斯的战团" — a ch5 death at 412/501/501a happens before Vorgath is met | "黑色军团 / The Black Legion" |
| cha_end_claim_nurgle | 6 Endings | title "污池里的暖炉 / Warm Stove in the Sump" but a claim from ch5+ (ship, Eye, Aldrin) is far from any Sump | `alt.add` on `pistol` (set at 503 for everyone leaving Carcharos): "far from Carcharos… as if you came from some Sump" — title now fits |
| cha_807 | 2 Place | from the crypt (806) the Grey Knights are behind a wall, yet the base says a halberd stops an inch from you | `alt.text` {fromNode 806}: you break the crypt wall as you grow; the knight is outside |
| cha_303 alt | 5 Stacking | robbed + betrayed Whistle → two adds both starting "他认得你。" | split into three exclusive entries; both-flags case is one sentence |
| cha_412 alt | 5 Stacking | 7 adds; `heardWarmaster` + `choirSang/choirLoyal` (one is always set) filled both slots, so Kade's helmet / Kade's body / Whistle's whistle echoes almost never showed | reordered: heardWarmaster last (it is echoed again at 501) |
| cha_205 coldWater result | 7 Language | en has "The mirror shows only you", zh lacks it | zh: "镜子里只有你自己，烙印暗了下去" |
| cha_308 | 2 Place | scene `cathedral` for the Inquisition's white tower | scene `barracks` (prison) |

## Listed, not fixed
- **Shallow branches 36 %** (rule 2 limit 20 %, WARN): 17 branching nodes re-merge after one step without a read flag (cha_101, o_deserter_3, o_scribe_4, 201, 307 …). Structural — needs new flags/alt readers, not a text fix.
- cha_312 bridge: speaker sprite is Vellum even on the `leftVellum` variant where he is not there (alt cannot change `speaker`).
- cha_509 gather in scene `daemon_world` (validator WARN; the text is a crowded bazaar, reads fine).
- 613 says the Warmaster's host goes on to Aurex; 710 / end_champion put his flagship at Aldrin's system edge. Readable as "waits, then moves on"; no change.
- 401: when `leftVellum` + `openedDoor` both match, the want* hint ("…is closest") is not shown (2-add cap). Gameplay hint only.
- Shared files (not touched): `rum_cha_isstvan` never heard in 3000 runs (ch 5–6 window, no matching gather?); during the pass `evt_undivided_1.where.notNodes` briefly errored ("cha_701 does not exist in imperium/…") — another agent's edit, gone by the final gate run.

## Lore
No lore edits. Checked as consistent with canon: Abaddon's 13 Black Crusades / Great Rift after the 13th, Rift "over a century" in 111.M42, Talon of Horus silhouette, Black Legion as ex-Heresy veterans, Grey Knights with an Ordo Malleus inquisitor ordering Exterminatus, Abaddon carrying Horus's body (rum_cha_siege).
