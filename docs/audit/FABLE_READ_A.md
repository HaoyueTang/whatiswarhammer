# FABLE_READ_A — universal route re-read, doors into imperium / chaos / tau / orks

2026-11-25. Read as a universal-born player: door `result` in `data/universal.js` → origin start node (`born_universal` alt) → next ~6 nodes.
Edits: text only, in `imperium.js`, `chaos.js`, `tau.js`, `orks.js`. `universal.js` not touched (problems listed in §2).

## 1. Doors

| Door | Entry node | Verdict |
|---|---|---|
| low → imperium/hive | `imp_101` | OK. |
| low → chaos/deserter | `cha_o_deserter_1` | FIXED: clumsy word order ("运兵船从奥雷克斯开到卡尔卡罗斯，三周前，你夜里…") → "三周前，奥雷克斯来的运兵船停靠卡尔卡罗斯，你夜里翻了转运港的闸。" EN matched. |
| low → tau/pow | `tau_o_pow_1` | OK. ("入伍一年" agrees with the garrison door.) |
| low → orks/guard | `ork_o_guard_1` | FIXED: choppy "几个月，只守个门" → "几个月，只守一道门" (echoes the veteran's "就守一道门"). |
| mid → imperium/agri | `imp_o_agri_1` | OK. Father/Mother are the prologue's own family; "一夜过去" follows the supper result. |
| mid → chaos/scavenger | `cha_101` | FIXED: Tikka appeared by bare name ("蒂卡说") to a player who has never met her → "同窝棚的女孩蒂卡说" / "Tikka, the girl who shares your shack, swears" (§37.9; agrees with `cha_102a`, where she sleeps beside you). |
| mid → tau/colonist | `tau_101` | FIXED: "帝国的船不再来了" contradicted the labour ship that has just brought you from Aurex → "帝国的税船不再来了" / "Imperial tithe ships". |
| mid → orks/scrap | `ork_101` | FIXED: "队长的条子" had no referent after the cut → "拾荒队长的条子" / "The Salvage Boss's note". |
| up → imperium/noble | `imp_o_noble_1` | FIXED: dropped "今晚 / Tonight" from the universal alt (time of day in an entry alt; HUD shows 06:00). Base text unchanged. |
| up → chaos/scribe | `cha_o_scribe_1` | OK. "家里送你来抄经，一晃十一年" holds with "家里能交出去的，只有你" and the door result. |
| up → tau/trader | `tau_o_trader_1` | FIXED: dangling subject ("…把你放在这里，替船长盖章挣的钱，盘下了…") → "…，你用替船长盖章挣的钱，盘下了…". EN was already right. |

Lengths after edits: all 11 alts ≤ 90 zh chars / ≤ 59 EN words.

Gates (2026-11-25): `intro_audit --all` 0 person gaps on all routes (arcosa 0); `route_graph --checks-only` 0 ERROR for imperium, chaos, tau, orks; `date_audit` 0 anachronisms; `validate.js` PASS, 0 errors, 34 warnings (unchanged).

## 2. Problems in `data/universal.js` (not edited — for the universal writer)

1. **`u_low_door` — time runs backwards.** Order of play is `u_low_2v` "天黑了，回家" → `u_low_3` "夜里，一家人围着一盏灯" → `u_low_door` "天黑了，征兵桌还没收" (EN "Dusk"). Suggested: "夜深了，征兵桌还没收。" / "Late at night, and the recruiting table is still out."
2. **`u_low_door` alt `u_low_docks` — stale.** "你从码头回来，征兵桌还没收。" But the player left the bar for home (`u_low_2d` "喝完这杯，回家") and comes here from the family lamp, not from the docks. Suggested: "码头那条路你也听过了，可你还是来了这儿。" / "You heard the docks' offer too, and still you came here."
3. **`u_mid_road` door chaos/scavenger, result — name slip.** "队头把一块干肉拍进你手里" — everywhere else he is 拾荒队长 / 队长 (`u_mid_2` has "拾荒队的头儿"). Suggested: "队长把一块干肉拍进你手里：…". EN "The boss" is fine.
4. **`u_up_door` door imperium/noble, result — stiff address.** "老爷等您一晚上了，次子少爷。" / "young sir. The second-born." Nobody says 次子少爷. Suggested: "老爷等您一晚上了，二少爷。" / "The master has waited all evening, young master."
5. **`u_low_3` — small mismatch with the hive route.** "明天，名单就要贴出来" but in `imp_104` Deacon Harlow reads the list aloud in the square, and the door result says "名单就下来了". Suggested: "明天，名单就下来了。" / "Tomorrow the list comes down."
6. **`u_mid_road` door tau/colonist, result — note only.** "新卡尔德那边缺人" sends an Aurex labour ship to a port the T'au have held for three years. It works now that `tau_101` says only the tithe ships stopped coming, but if the line is rewritten keep the name 新卡尔德 (the alt bridges on it) and avoid any hint that the Imperium still runs the port.
7. **`u_up_door` / noble door — note only.** The scene is at night and the door result says "等您一晚上了", while the Imperium clock starts at 06:00. The entry alt no longer says "今晚", so the only remaining evening words are in universal.js itself; acceptable (undated prologue), listed for completeness.
