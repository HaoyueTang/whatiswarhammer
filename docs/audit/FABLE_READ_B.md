# FABLE_READ_B — universal-route re-read, doors into aeldari / necrons / mechanicus / gsc (2026-11-25)

Read as a universal-born player: door `result` in `data/universal.js` → origin start node (`born_universal` alt) → the origin strand up to the route's join node. Text-only fixes in the four faction files; universal.js not edited.

## Doors

| Door | Verdict |
|---|---|
| low · necrons/convict (`nec_o_convict_1`) | OK. Purser's "到港结清" pays off in the debt/shackle swap; Kaal named with rank; Hollis add introduces him. |
| low · mechanicus/menial (`mech_101`) | FIXED `mech_102`: the servitor's "一道你认识的伤疤" (a scar you recognise) is impossible for someone who landed that day → "一道做人时落下的伤疤" / "a scar from when it was a man" (base text, works for every origin). |
| low · mechanicus/conscript (`mech_o_conscript_1`) | OK. Tobin introduces himself in `mech_o_conscript_4`. |
| low · gsc/miner (`gsc_101`) | FIXED `gsc_103`: "是霍林家的表兄弟们" assumed the newcomer already knows the Hollin family (first mention on this path) → "是矿上人称“霍林家表兄弟”的那伙人" / "The ones the mine calls the Hollin cousins". Endurance / 忍耐号, Gant, Teo consistent with the door. |
| mid · aeldari/trooper (`eld_o_trooper_1`) | FIXED `eld_o_trooper_5` alt (born_shared/born_universal): "连队这两天借住的那户农家" contradicted the barracks of node 1, and "昨天下午" was a time-of-day word on the landing day → "营房隔壁那户农家…前一天你给她削过一个木头小兵" / "next to the barracks … the day before". Nell is a neighbour's child here, not kin. |
| mid · aeldari/pilgrim (`eld_o_pilgrim_1`) | FIXED entry alt last line: "舱壁灯转红：着陆。" clashed with both choice results ("船员们笑了一路" / "一路睡到着陆") and never named the planet → "舱壁灯转红：瓦尔达快到了。" / "Valda is close." Nell introduces herself in `eld_o_pilgrim_2`; resultAlt (plain old medal) fine. |
| up · necrons/archivist (`nec_101`) | OK. Sketchbook + lamp match the door result. |
| up · necrons/lexmech (`nec_o_lexmech_1`) | OK. Socket / dead scribe / 29 years match `u_up_cult`. |
| up · mechanicus/savant (`mech_o_savant_1`) | OK. Ten years, counting floors, House Serrin debt match the door. |

Gates after the edits: `validate.js` 0 errors (34 warn), `intro_audit.js --all` 0 person gaps on all 9 routes, `route_graph.js --checks-only` 0 ERROR ×4, `date_audit.js` 0 anachronisms. All edited texts stay inside the length limits (validator passes).

## Left alone (taste / judgement calls for Howie)

- `nec_o_convict_1` alt says "几个月舱工" while the other two Thessa Null doors say "几周" — different ships (supply run vs. expedition/Cult ship), so not a contradiction, but the supply-ship trip is noticeably longer than every other door ("几周后" ×6).
- `mech_o_conscript_1` alt EN has "no rest" which the ZH does not say (直奔兵营). Harmless.
- `eld_o_trooper_4` "第二天午夜" is then the trooper's second day on Valda: tower, sniper warning and the tomb waking all happen within ~36 h of landing. Reads fast but coherent.

## universal.js — suggestions (not edited)

- `u_low_ship`, door → `nec_o_convict_1`: the result never says where the supply ship is going, and the entry alt opens on debt, not on a place. Suggest result: "事务长折好合同，笑得太客气：“忒萨零号，到港结清。”" / "…“Thessa Null. Settled on arrival.”"
- `u_mid_valda` text: "船两天后起飞" is a countdown inside the undated prologue (§37.11), and both doors then jump "几周". Suggest "船装完货就起飞。" / "The ship lifts as soon as it is loaded."
- `u_mid_valda`, door → `eld_o_pilgrim_1`: result says "梦里那片田，就是这艘船的去处", while the entry alt says the dream is of a white-robed woman and circling stones (a field is never in it). Suggest: "你把攒下的钱都交给船员。梦里那圈石头，就在这艘船要去的地方。" / "The stones from your dream stand where this ship is going."
- `u_up_go`, door → `nec_101`: the Professor is "她" in necrons.js (`nec_102`); the door result uses no pronoun in ZH/EN, good — keep it that way in the rewrite. Result "不发工钱，管饭" is fine.
- `u_up_cult` text EN: "scribe to a magos on a dig, whose last scribe died of data-burn. The contract is transferable." — ZH is one clause ("前一任死于数据灼伤，合同可转让"); fine, but the 29 years appear only in the door result. OK as is.
- `u_low_levy`, door → `mech_o_conscript_1`: door says "自愿抽签者" and the entry alt has "签筒里的齿轮硌着掌心" — consistent. The `drewForBoy` add in `mech_o_conscript_1` belongs to the per-route birth and cannot fire here; nothing to do.
