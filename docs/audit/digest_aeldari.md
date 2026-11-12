# Route digest: aeldari — 101 nodes, origins: agri@eld_101, pilgrim@eld_o_pilgrim_1, trooper@eld_o_trooper_1

Entered by the engine from anywhere (stat deaths, claim jumps): eld_death_hp, eld_death_sanity, eld_death_corruption, eld_end_claim_khorne, eld_end_claim_nurgle, eld_end_claim_tzeentch, eld_end_claim_slaanesh

Random events (eventRoll → data/events*.js) are not in this graph; they can also set flags. Time `d`/`h`/`y` is applied on entering the node. MUST = on every path to the node; MAY = on some path.

## Automatic findings (14)
- **INFO** `eld_108`: flag 'sentCall' is set (at eld_108) but never used by a require — only text may rely on it
- **INFO** `eld_o_pilgrim_3`: flag 'heardWord' is set (at eld_o_pilgrim_3) but never used by a require — only text may rely on it
- **INFO** `eld_o_pilgrim_4`: flag 'jorbanKnows' is set (at eld_o_pilgrim_4) but never used by a require — only text may rely on it
- **INFO** `eld_208`: flag 'knowsPrice' is set (at eld_208) but never used by a require — only text may rely on it
- **INFO** `eld_210`: flag 'mirethHand' is set (at eld_210) but never used by a require — only text may rely on it
- **INFO** `eld_402`: flag 'bonesong' is set (at eld_402) but never used by a require — only text may rely on it
- **INFO** `eld_405`: flag 'toldDreams' is set (at eld_405) but never used by a require — only text may rely on it
- **INFO** `eld_408`: flag 'mirethFlower' is set (at eld_408) but never used by a require — only text may rely on it
- **INFO** `eld_502`: flag 'sawMasque' is set (at eld_502) but never used by a require — only text may rely on it
- **INFO** `eld_506`: flag 'forgave' is set (at eld_506) but never used by a require — only text may rely on it
- **INFO** `eld_605`: flag 'loyal' is set (at eld_605) but never used by a require — only text may rely on it
- **INFO** `eld_609`: flag 'mirethDead' is set (at eld_609, eld_610) but never used by a require — only text may rely on it
- **INFO** `eld_702`: flag 'tasted' is set (at eld_702) but never used by a require — only text may rely on it
- **INFO** `eld_703`: flag 'bait' is set (at eld_703, eld_704, eld_706) but never used by a require — only text may rely on it

Join nodes (≥3 different parents — check the text does not assume any single parent's events): eld_107, eld_201, eld_203, eld_301, eld_307, eld_508, eld_705, eld_806

## Nodes

### eld_death_corruption · chundefined · daemon_world · 渴求者 · **ENDING death**
你想要的越来越多，多到身体装不下。 / 你的皮肤开始发光，声音甜得像音乐。守护者们举起了枪，眼里没有恨，只有怜悯。 / 在他们开枪之前，很远的地方，有什么东西先一步把你喝干了。
ending: 「被饮尽」 cause: 被色孽之欲吞没
flags on arrival — MUST: ∅ · MAY-only: bait, betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethDead, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari

### eld_death_hp · chundefined · webway · 旁白 · **ENDING death**
你倒下了。灵族们停下脚步，低头看了你一会儿，很有礼貌。 / 没有灵魂石接住你。你的灵魂升起来，又亮又干净，像一盏灯，被远处某个很饿的东西看见了。 / 先知在符文上，轻轻划掉了一根线。
ending: 「断线」 cause: 伤重而死，灵魂无依
flags on arrival — MUST: ∅ · MAY-only: bait, betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethDead, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari

### eld_death_sanity · chundefined · craftworld · 旁白 · **ENDING death**
你开始听见墙里所有的声音，一万个死去的灵族同时说话，你一个也挡不住。 / 你给每个声音起了名字，日夜和他们聊天。 / 灵族把你送进一间安静的房间，天花板很矮，按猿人规格。
ending: 「墙里的客人」 cause: 理智崩溃
flags on arrival — MUST: ∅ · MAY-only: bait, betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethDead, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari

### eld_end_claim_khorne · chundefined · webway · 铁与火的轰鸣 · time{d:30,warp:true} · **ENDING bad**
你心里那张战面再也摘不下来了。灵族有道途约束杀意，你没有。 / 守护者把你送出了网道。你一路杀进黑暗，没回过头。 / 凯恩的怒火属于灵族。你的，被另一位神接住了。他不讲道途，只要头骨。
ending: 「摘不下的战面」 cause: 被恐虐收走
on enter:   codex:god_khorne
flags on arrival — MUST: ∅ · MAY-only: bait, betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethDead, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari

### eld_end_claim_nurgle · chundefined · maiden_world · 园丁 · time{y:3} · **ENDING bad**
你的伤口不再愈合，却开出了花。灵骨歌者的歌，在你身边一首首走了调。 / 灵族把你送到一颗无人的星球，留下一袋种子，走得远远的。 / 你在那里种出一座园子。苍蝇来了，园丁也来了。他说你种得真好。
ending: 「被流放的园丁」 cause: 成为纳垢的园丁
on enter:   codex:god_nurgle
flags on arrival — MUST: ∅ · MAY-only: bait, betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethDead, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari

### eld_end_claim_slaanesh · chundefined · craftworld · 渴求者 · **ENDING bad**
那个梦再也不醒了：瓦尔达的麦田，妮尔在门口喊你吃饭，一切都刚刚好。 / 灵族发现你时，你坐着微笑，灵魂早已不在，没有灵魂石接住它。 / 渴求者饿了一万年。一个猿人的灵魂，只是饭前的甜点。
ending: 「饭前的甜点」 cause: 灵魂被色孽吞噬
on enter:   codex:god_slaanesh
flags on arrival — MUST: ∅ · MAY-only: bait, betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethDead, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari

### eld_end_claim_tzeentch · chundefined · webway · 多出来的命运线 · time{d:90,warp:true} · **ENDING bad**
你看见的命运线越来越多，比先知还多。你开始悄悄拨动其中几根。 / 先知发现时，已有三条线因你而断。她第一次在你面前失了态。 / 你笑了。拨线的从来不是你，是一个比所有先知都更爱计划的东西。
ending: 「拨线的手」 cause: 沦为奸奇的棋子
on enter:   codex:god_tzeentch
flags on arrival — MUST: ∅ · MAY-only: bait, betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethDead, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari

### eld_101 · ch1 · jungle · 旁白
瓦尔达农业星，收割季。麦浪一直铺到天边，空气里全是谷壳。 / 妹妹妮尔骑在你肩上数运粮船：“一、二……今年怎么一艘都没有？” / 天上确实空荡荡的。星语塔已经三天没亮灯了。
on enter:   codex:place_valda
flags on arrival — MUST: origin_agri · MAY-only: ∅
  1. “去打谷场上工” → eld_102 ⇒ 场边的麻袋堆成了山，每袋都印着“什一税·奥雷克斯二号”。没有船来运。
  2. “带妮尔去田边的老石阵” → eld_103

### eld_o_pilgrim_1 · ch1 · ship_interior · 旁白
运粮驳船的货舱里，你缩在麦袋中间。十年来你一直做同一个梦：一个白袍女人，几颗石头绕着她的头转。 / 你从一个星球走到另一个星球，讲这个梦。大多数人当你是疯子。 / 下一站，瓦尔达。
on enter:   codex:place_valda
flags on arrival — MUST: origin_pilgrim · MAY-only: ∅
  1. “把梦讲给船员听” → eld_o_pilgrim_2 eff{renown:3,sanity:-5} ⇒ 船员们笑了一路。只有一个老水手没笑，下船时塞给你一块干粮：“别在那颗星球上说太大声。”
  2. “闭眼，什么也不说” → eld_o_pilgrim_2 eff{sanity:5} ⇒ 你一路睡到着陆。这次的梦里，那个女人第一次转过头来看你。

### eld_o_trooper_1 · ch1 · barracks · 埃达
瓦尔达星防卫军，第三连。你们这辈子最大的敌人是偷粮的老鼠。 / 埃达把纸牌拍在弹药箱上：“星语塔三天没出声了。中尉说是小故障。” / 她压低声音，“小故障需要派两个人带枪去看？”
on enter:   codex:place_valda,imp_guard
flags on arrival — MUST: origin_trooper · MAY-only: ∅
  1. “主动请缨去查看” → eld_o_trooper_2 eff{renown:3} ⇒ 中尉在名单上写下你的名字，表情像如释重负。
  2. “先打完这把牌” → eld_o_trooper_2 eff{sanity:5} ⇒ 你赢了埃达半周的口粮。然后中尉点了你们俩的名。

### eld_102 · ch1 · manufactorum · 玛尔塔监工 · time{h:1}
打谷机轰隆作响。玛尔塔监工在名册上画勾：“什一税照交，一粒不能少。” / 你问起运粮船，她压低声音：“星语塔一直没回话。总督说是小故障。” / 她自己也不信。
from: eld_101 ⟵ “去打谷场上工”
flags on arrival — MUST: origin_agri · MAY-only: ∅
certainly visited before (nearest 6): eld_101
  1. “低头干活” → eld_104 eff{hp:-5,sanity:5} ⇒ 你干到手掌起泡。麦秆的味道很熟悉，熟悉得让人安心。
  2. “溜去星语塔看看” → eld_105 eff{renown:2} ⇒ 玛尔塔看见你走了，没喊。她只是把你的名字从今天的名册上划掉。

### eld_103 · ch1 · ruins · 旁白 · time{h:1}
老石阵立在麦田尽头，黑得发亮，像一排牙。没人记得是谁立的。 / 妮尔从犁沟里捡起一块白石头，温的，滑得像骨头。 / 山脊上站着一个披斗篷的高个子。你一眨眼，他就不见了。
on enter:   codex:place_valda_tomb
from: eld_101 ⟵ “带妮尔去田边的老石阵”
flags on arrival — MUST: origin_agri · MAY-only: ∅
certainly visited before (nearest 6): eld_101
  1. “把白石头收进口袋” → eld_104 eff{renown:3,set:{runeStone:true}} ⇒ 石头贴着你的腿，一直是温的。那天夜里，你梦见一条发光的路。
  2. “追上山脊” → eld_106 eff{hp:-5} ⇒ 你在麦茬里摔了一跤，膝盖擦破了。山脊上的风里有一股陌生的甜香。

### eld_o_pilgrim_2 · ch1 · jungle · 旁白 · time{d:2}
你在麦田边讲道，农人们绕开你走。只有一个小女孩停下来，给你端来一碗水。 / “我叫妮尔。”她盯着你，“我也梦见过石头会转。” / 她的父母不太情愿地让你睡进了谷仓。
from: eld_o_pilgrim_1 ⟵ “把梦讲给船员听” | eld_o_pilgrim_1 ⟵ “闭眼，什么也不说”
flags on arrival — MUST: origin_pilgrim · MAY-only: ∅
certainly visited before (nearest 6): eld_o_pilgrim_1
  1. “在谷仓住下，帮她家干活” → eld_o_pilgrim_4 eff{hp:5,sanity:5} ⇒ 你学会了捆麦子。妮尔每晚都来听你讲梦，听到一半就睡着。
  2. “去田边的老石阵过夜” → eld_o_pilgrim_3 ⇒ 你枕着包袱躺下。包袱里有在圣地阿尔德林求来的圣徽，它从没让你少做一个梦。

### eld_o_trooper_2 · ch1 · hive_spire · 埃达 · time{h:5}
星语者们围坐成圈，安详地睡着，叫不醒。主天线被切断了，切口平滑得像玻璃。 / 埃达捡起一根细长的白羽毛：“这不是我们这儿的鸟。” / 她看你一眼，“也不是我们这儿的刀。”
from: eld_o_trooper_1 ⟵ “主动请缨去查看” | eld_o_trooper_1 ⟵ “先打完这把牌”
flags on arrival — MUST: origin_trooper · MAY-only: ∅
certainly visited before (nearest 6): eld_o_trooper_1
  1. “按条令，向上级报告” → eld_o_trooper_3 eff{renown:2} ⇒ 回电只有一句：“保持警戒，勿制造恐慌。”埃达把回执揉成一团。
  2. “试着自己接通线路” ROLL p=0.4 ✓eld_o_trooper_3 ✗eld_o_trooper_3 ⇒✓ 一声长长的蜂鸣，求救信号发了出去。没有回音，但至少，有人可能会听见。 ⇒✗ 线路在你手里炸出火花，彻底死了。埃达骂了一句，把你从烟里拖出来。

### eld_104 · ch1 · cathedral · 乔班神父 · time{h:8}
晚祷。乔班神父为丰收祝福，声音比往年小。 / “夜里地底下在嗡嗡响，”他对你耳语，“牲口都不叫了。我问过帝皇，他没回答。” / 话音刚落，圣像脚下的石板裂开一道缝，透出绿光。
on enter:   codex:imp_emperor
from: eld_102 ⟵ “低头干活” | eld_103 ⟵ “把白石头收进口袋”
flags on arrival — MUST: origin_agri · MAY-only: runeStone
certainly visited before (nearest 6): eld_101
  1. “抱起妮尔回家” → eld_107
  2. “去星语塔求救” → eld_105 eff{sanity:-5} ⇒ 你穿过麦田，脚下的土地在轻轻震动，像有什么在下面翻身。

### eld_105 · ch1 · hive_spire · 旁白 · time{h:2}
星语塔的门开着。星语者们围坐成一圈，安静地睡着，怎么叫都叫不醒。 / 主天线被切断了，切口平滑得像玻璃。 / 控制台上落着一根细长的白羽毛，不属于这颗星球上任何一种鸟。
from: eld_102 ⟵ “溜去星语塔看看” | eld_104 ⟵ “去星语塔求救”
flags on arrival — MUST: origin_agri · MAY-only: runeStone
certainly visited before (nearest 6): eld_101
  1. “接通备用线路，发出求救” ROLL p=0.45 ✓eld_108 ✗eld_107 ⇒✓ 备用线路吱吱作响，指示灯亮了。 ⇒✗ 火花在你指尖炸开。线路彻底死了，塔外的麦田开始发出绿光。
  2. “揣起羽毛，跑回家” → eld_107 eff{sanity:-5} ⇒ 羽毛轻得像没有重量，你却觉得口袋在往下坠。

### eld_106 · ch1 · jungle · 游侠西尔凡 · time{h:1}
斗篷人就坐在山脊背面，像在等你。他的脸太窄，耳朵太尖，眼睛里没有一点温度。 / “回家去，猿人。”他礼貌得过分，“今晚握紧你妹妹的手。” / 他的长枪比他还高。
on enter:   codex:eld_rangers,eld_monkeigh
from: eld_103 ⟵ “追上山脊”
flags on arrival — MUST: origin_agri · MAY-only: ∅
certainly visited before (nearest 6): eld_103, eld_101
  1. ““你是谁？为什么这么说？”” → eld_107 ⇒ 他想了很久，像在挑一个你听得懂的词。“记账的人。”然后他走进了风里。
  2. “抓住他的斗篷” ROLL p=0.35+hp ✓eld_107 ✗eld_107 eff{hp:-5} ⇒✓ 你抓住了一角布。他低头看你的手，像看一只落在袖子上的虫。“黄昏，石阵。”他抽回了斗篷。 ⇒✗ 你扑了个空，脸朝下栽进麦茬。抬起头时，山脊上只剩风。

### eld_o_pilgrim_3 · ch1 · ruins · 梦 · time{h:9}
你枕着黑色的石头睡着了。这一次梦太清楚：白袍女人站在一道光门前，符文绕着她旋转。 / 她看着你，说了一个词。你听不懂，却知道意思——“还没到时候”。 / 醒来时，你的鼻子在流血。
on enter: {sanity:-5}  codex:chaos_warp,place_valda_tomb
from: eld_o_pilgrim_2 ⟵ “去田边的老石阵过夜”
flags on arrival — MUST: origin_pilgrim · MAY-only: ∅
certainly visited before (nearest 6): eld_o_pilgrim_2, eld_o_pilgrim_1
  1. “记住那个词” → eld_o_pilgrim_4 eff{renown:5,set:{heardWord:true},taint:{tzeentch:15}} ⇒ 你在泥地上写了一百遍，还是写不对。但它在你舌头底下，像一颗种子。
  2. “擦掉血，回谷仓” → eld_o_pilgrim_4

### eld_o_pilgrim_4 · ch1 · cathedral · 乔班神父 · time{d:3}
乔班神父把你堵在礼拜堂门口，盯着你鼻孔下的血痕。 / “会做准的梦，会流鼻血。”他压低声音，“孩子，黑船来的时候，会先找你这样的人。” / 他身后，圣像脚下的石板裂开一道缝，透出绿光。
on enter:   codex:imp_psyker,imp_black_ships
from: eld_o_pilgrim_2 ⟵ “在谷仓住下，帮她家干活” | eld_o_pilgrim_3 ⟵ “记住那个词” | eld_o_pilgrim_3 ⟵ “擦掉血，回谷仓”
flags on arrival — MUST: origin_pilgrim · MAY-only: heardWord
certainly visited before (nearest 6): eld_o_pilgrim_2, eld_o_pilgrim_1
  1. ““我只是个朝圣者。”” → eld_o_pilgrim_5 eff{sanity:-5} ⇒ 他看了你很久，叹了口气：“那就当个安静的朝圣者。”你们都知道你在撒谎。
  2. “把梦全告诉他” → eld_o_pilgrim_5 eff{renown:3,set:{jorbanKnows:true}} ⇒ 神父听完，没去报告。他只是在胸前画了个圣徽：“愿帝皇的光挡在你和你梦见的东西之间。”

### eld_o_trooper_3 · ch1 · trench · 旁白 · time{h:9}
夜间巡逻，老石阵附近。一声轻响，你的激光枪枪管断成两截，切口还冒着烟——你却毫发无伤。 / 山脊上有个披斗篷的影子收起长枪，冲你微微点了点头。 / 那是警告。他打中了他想打中的地方。
on enter:   codex:eld_rangers
from: eld_o_trooper_2 ⟵ “按条令，向上级报告” | eld_o_trooper_2(success) ⟵ “试着自己接通线路” | eld_o_trooper_2(fail) ⟵ “试着自己接通线路”
flags on arrival — MUST: origin_trooper · MAY-only: ∅
certainly visited before (nearest 6): eld_o_trooper_2, eld_o_trooper_1
  1. “拔出手枪还击” → eld_o_trooper_4 eff{hp:-10,renown:2,taint:{khorne:15}} ⇒ 你打空了一个弹匣。第二声轻响，你的手枪也断了，虎口震裂。山脊上已经没人了。
  2. “放下枪，举起手” → eld_o_trooper_4 eff{sanity:-5,renown:3} ⇒ 影子停了一下，像有点意外，然后消失在麦田里。埃达说你疯了。你觉得自己刚刚活了下来。

### eld_107 · ch1 · tomb_exterior · 旁白 · foe:necron_warrior · time{h:6}
午夜，老石阵亮了。绿光沿着犁沟流淌，麦田像被掀开的被子一样翻起。 / 地底升起一座黑色金字塔。银色的骷髅一排排走出来，步伐整齐，不急不慢。 / 它们不像入侵者。像房东回家。
on enter:   codex:nec_necrons,place_valda_tomb
from: eld_104 ⟵ “抱起妮尔回家” | eld_105(fail) ⟵ “接通备用线路，发出求救” | eld_105 ⟵ “揣起羽毛，跑回家” | eld_106 ⟵ ““你是谁？为什么这么说？”” | eld_106(success) ⟵ “抓住他的斗篷” | eld_106(fail) ⟵ “抓住他的斗篷” | eld_108 ⟵ “跑回家找妮尔”
flags on arrival — MUST: origin_agri · MAY-only: runeStone, sentCall
certainly visited before (nearest 6): eld_101
  1. “抓起妮尔就跑” → eld_201 eff{hp:-5} ⇒ 你抱着妮尔冲出家门。身后，金属的脚踩碎麦穗，整齐得像钟。
  2. “躲在窗后看它们做什么” → eld_201 eff{sanity:-8,renown:3} ⇒ 一个骷髅停在邻居门口，抬手，一道绿光。房子还在，人没了。它像在清单上打了个勾，继续往前走。

### eld_108 · ch1 · hive_spire · 旁白 · time{h:1}
一阵杂音，然后是一声长长的蜂鸣。求救信号发出去了，只有一行，没有回音。 / 也许一年后，某个遥远的星语者会在梦里听见它。 / 窗外，老石阵的方向亮起了绿光。
on enter: {renown:5,set:{sentCall:true}}
from: eld_105(success) ⟵ “接通备用线路，发出求救”
flags on arrival — MUST: origin_agri · MAY-only: runeStone
certainly visited before (nearest 6): eld_105, eld_101
  1. “跑回家找妮尔” → eld_107

### eld_o_pilgrim_5 · ch1 · tomb_exterior · 旁白 · foe:necron_warrior · time{h:7}
午夜，老石阵亮了，和你梦里一模一样。黑色金字塔从麦田下升起，银色的骷髅排着队走出来。 / 妮尔家的农舍被绿光扫过。你冲进去时，只剩妮尔缩在灶台后面，她的父母不见了。 / 她朝你伸出手。
on enter: {sanity:-8}  codex:nec_necrons
from: eld_o_pilgrim_4 ⟵ ““我只是个朝圣者。”” | eld_o_pilgrim_4 ⟵ “把梦全告诉他”
flags on arrival — MUST: origin_pilgrim · MAY-only: heardWord, jorbanKnows
certainly visited before (nearest 6): eld_o_pilgrim_4, eld_o_pilgrim_2, eld_o_pilgrim_1
  1. “抱起她就跑” → eld_201 ⇒ 她很轻。你跑出门时，她在你耳边小声说：“你梦见过这个，对不对？”

### eld_o_trooper_4 · ch1 · tomb_exterior · 埃达 · foe:necron_warrior · time{h:20}
第二天午夜，老石阵亮了。黑色金字塔从麦田下升起，银色的骷髅排着队走出来。 / 第三连开火了。骷髅倒下，又站起来，伤口像水银一样合拢。 / “撤！”中尉喊完这一声，就被绿光吞没了。
on enter: {sanity:-8}  codex:nec_necrons,place_valda_tomb
from: eld_o_trooper_3 ⟵ “拔出手枪还击” | eld_o_trooper_3 ⟵ “放下枪，举起手”
flags on arrival — MUST: origin_trooper · MAY-only: ∅
certainly visited before (nearest 6): eld_o_trooper_3, eld_o_trooper_2, eld_o_trooper_1
  1. “掩护埃达撤退” → eld_o_trooper_5 eff{hp:-15,renown:5} ⇒ 一道绿光擦过你的肩膀，整条胳膊瞬间麻了。埃达回头把你拽进了麦田。
  2. “扔下阵地就跑” → eld_o_trooper_5 eff{sanity:-5,renown:-3,set:{wronged_edda:true}} ⇒ 你跑得比任何人都快。身后，埃达喊了你的名字，枪声一支支停了。

### eld_o_trooper_5 · ch1 · burning_city · 旁白 · time{h:2}
你们驻扎时借住的那户农家着了火。你冲进去，只找到了小女儿妮尔，缩在水缸后面。 / 她认得你，你给她削过木头小兵。 / 她没哭，只问：“你的枪呢？”
on enter: {hp:-5}
from: eld_o_trooper_4 ⟵ “掩护埃达撤退” | eld_o_trooper_4 ⟵ “扔下阵地就跑”
flags on arrival — MUST: origin_trooper · MAY-only: wronged_edda
certainly visited before (nearest 6): eld_o_trooper_4, eld_o_trooper_3, eld_o_trooper_2, eld_o_trooper_1
  1. “把她背起来” → eld_201 ⇒ 她搂住你的脖子，搂得很紧。外面，绿光正一片片扫过农庄。

### eld_201 · ch2 · burning_city · 旁白 · foe:necron_lord · time{h:5} · eventRoll 0.35
天亮时，瓦尔达在燃烧。没有抢劫，没有喊杀声，只有绿光一片片扫过农庄。 / 山丘上站着一个挂满金饰的骷髅领主，像在检阅一块收回的地产。 / 妮尔把脸埋在你脖子里：“帝皇什么时候来？”
on enter:   codex:nec_necrons,imp_imperium,place_arcosa
from: eld_107 ⟵ “抓起妮尔就跑” | eld_107 ⟵ “躲在窗后看它们做什么” | eld_o_pilgrim_5 ⟵ “抱起她就跑” | eld_o_trooper_5 ⟵ “把她背起来”
flags on arrival — MUST: ∅ · MAY-only: heardWord, jorbanKnows, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
  1. “去着陆场找穿梭机” → eld_202
  2. “去老石阵碰碰运气” → eld_203 eff{sanity:-5} ⇒ 你逆着逃难的人群往石阵走。有人骂你疯了，有人跟了几步，又折了回去。

### eld_202 · ch2 · ruins · 玛尔塔监工 · time{h:3}
着陆场只剩一架破旧的货运穿梭机。玛尔塔监工拿着名册，嗓子已经哑了。 / “只能再塞一个孩子。”她看着妮尔，“没有船会来。星语塔从头到尾没发出去一个字。” / 引擎已经在转了。
from: eld_201 ⟵ “去着陆场找穿梭机”
flags on arrival — MUST: ∅ · MAY-only: heardWord, jorbanKnows, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_201
  1. “把妮尔交给玛尔塔” → eld_204 eff{sanity:5,renown:5,set:{nellLander:true}} ⇒ 妮尔抓着你的袖子不放，你一根一根掰开她的手指。舱门关上前，她喊的是你的名字。
  2. “不，她跟着我” → eld_204 eff{sanity:-5,set:{nellKept:true}} ⇒ 玛尔塔没劝。她点点头，把名册上的一个名字划掉了。

### eld_203 · ch2 · ruins · 塔艾丝拉先知 · time{h:4}
黄昏，石阵中间的空气裂开了，像水面被手指划开。 / 几个戴高盔的瘦长身影走出光里，最后一位身披长袍，几颗符文石绕着她缓缓旋转。 / 她看了你很久，像在读一本只有她看得懂的书。“就是这一根线。”
on enter:   codex:eld_farseer,eld_aeldari
from: eld_201 ⟵ “去老石阵碰碰运气” | eld_204 ⟵ “往石阵跑” | eld_205 ⟵ ““一起走！”” | eld_206 ⟵ “拖着身子去石阵”
flags on arrival — MUST: ∅ · MAY-only: forgiven_edda, heardWord, jorbanKnows, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_201
  1. ““你们是谁？”” → eld_207
  2. ““我梦见过你。”” → eld_207 require{flag:origin_pilgrim} eff{renown:8,sanity:-5} ⇒ 符文石同时停顿了一下。先知第一次露出了一点表情——不是惊讶，是确认。“我知道。我让你梦见的。”

### eld_204 · ch2 · burning_city · 埃达 · foe:necron_warrior · time{h:1}
穿梭机歪歪扭扭地升空了。你不敢看它飞了多远。 / 防卫军的埃达一把抓住你：“骷髅过来了！帮我守住路口，让最后一批人上山！” / 远处，一排银色的身影正穿过冒烟的麦田。
(grudgeLine edda: 她抓着你的手臂，指节发白。上一回，你是第一个跑的。)
from: eld_202 ⟵ “把妮尔交给玛尔塔” | eld_202 ⟵ “不，她跟着我”
flags on arrival — MUST: ∅ · MAY-only: heardWord, jorbanKnows, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_202, eld_201
  1. “跟埃达守住路口” ROLL p=0.5+hp ✓eld_205 ✗eld_206 grudge(edda) ⇒✓ 你打中了一个。它倒下，站起，又倒下。你们拖住了它们一刻钟——够了。 ⇒✗ 一道绿光擦过你的肩膀，整条胳膊瞬间没了知觉。你栽进了水沟。
  2. “和埃达排成射击线，像操练时那样” ROLL p=0.75+hp ✓eld_205 ✗eld_206 require{flag:origin_trooper} grudge(edda) ⇒✓ “交替射击！”你们一个打一个装，像训练场上一样。骷髅的队形第一次乱了。 ⇒✗ 操练里没有会自己站起来的靶子。一道绿光扫过，你栽进了水沟。
  3. ““这回我不跑。”” ROLL p=0.5+hp ✓eld_205 ✗eld_206 require{flag:wronged_edda} eff{sanity:-3,renown:3,set:{forgiven_edda:true}} ⇒✓ 你站在她身边，一发不漏。埃达没夸你，只往旁边挪了半步，给你让出射击位。 ⇒✗ 你守得不够久。一道绿光扫过，你栽进水沟，听见埃达在喊你的名字——这回是叫你回来。
  4. “往石阵跑” → eld_203 eff{renown:-3} ⇒ 你跑出很远才回头。埃达还守在那里，一个人。

### eld_207 · ch2 · ruins · 塔艾丝拉先知 · time{h:1}
“我是塔艾丝拉，塞卢纳的先知。”她的声音很轻，每个字都像擦亮的银器。 / “这道门只为你开。网道很窄，未来更窄。” / 她身后，守护者们端着枪看你——像看一只误闯进屋的野兽。
on enter:   codex:eld_monkeigh,eld_guardian
from: eld_203 ⟵ ““你们是谁？”” | eld_203 ⟵ ““我梦见过你。””
flags on arrival — MUST: ∅ · MAY-only: forgiven_edda, heardWord, jorbanKnows, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_203, eld_201
  1. “把妮尔推向那道光” → eld_209 require{flag:nellKept}
  2. ““救救这个星球！”” → eld_208
  3. “跟她走” → eld_301 eff{renown:5} ⇒ 你迈进光里。身后，瓦尔达的天空是绿的。你没有回头，回头也看不清。

### eld_205 · ch2 · burning_city · 埃达 · foe:necron_warrior · time{h:1}
被你打倒的骷髅又站了起来，伤口像水银一样合拢。 / “它们会自己修好，”埃达喘着气，“我们只是在给它们添麻烦。” / 她把最后一块电池塞给你：“去石阵。听说那里……有别的东西。”
on enter: {renown:5}
from: eld_204(success) ⟵ “跟埃达守住路口” | eld_204(success) ⟵ “和埃达排成射击线，像操练时那样” | eld_204(success) ⟵ ““这回我不跑。””
flags on arrival — MUST: ∅ · MAY-only: forgiven_edda, heardWord, jorbanKnows, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_204, eld_202, eld_201
  1. ““一起走！”” → eld_203 eff{sanity:-5} grudge(edda) ⇒ 她摇头，转身对着骷髅举枪。你跑出很远，还听得见她的枪声。然后听不见了。

### eld_206 · ch2 · ruins · 旁白 · foe:canoptek_scarab · time{h:2}
你醒在水沟里，肩膀麻得像别人的。 / 一群甲虫似的小机器从你身上爬过，嗅了嗅，又走开了，好像你不值得拆。 / 埃达不见了。路口只剩她的枪，枪管还是热的。
on enter: {hp:-25,sanity:-5}
from: eld_204(fail) ⟵ “跟埃达守住路口” | eld_204(fail) ⟵ “和埃达排成射击线，像操练时那样” | eld_204(fail) ⟵ ““这回我不跑。””
flags on arrival — MUST: ∅ · MAY-only: forgiven_edda, heardWord, jorbanKnows, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_204, eld_202, eld_201
  1. “拖着身子去石阵” → eld_203

### eld_208 · ch2 · ruins · 塔艾丝拉先知 · time{h:1}
“四千一百万猿人。”她说出这个数，像在报天气。 / “若我阻止这场收割，死灵会转向伊尔达涅斯，那里住着六千个我的族人。” / “我没有权衡，”她纠正你，“我只是数过。”
on enter: {sanity:-8,set:{knowsPrice:true}}  codex:place_ildaneth
from: eld_207 ⟵ ““救救这个星球！””
flags on arrival — MUST: ∅ · MAY-only: forgiven_edda, heardWord, jorbanKnows, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_207, eld_203, eld_201
  1. “跟她走” → eld_301 eff{renown:5} ⇒ 你迈进光里，带着那两个数字。它们比你带走的任何东西都重。
  2. “朝她脚边啐一口，然后跟上” → eld_301 eff{sanity:5,renown:-3,taint:{khorne:10}} ⇒ 守护者们同时举起了枪。先知抬手制止，看都没看地上一眼，转身走进光里。
  3. ““那我留下，和他们一起。”” → eld_210

### eld_209 · ch2 · ruins · 乔班神父 · time{h:1}
光没有为妮尔打开。她伸手进去，光就是一堵墙。先知轻声说：“她的线不在这里。” / 乔班神父从麦田里跌跌撞撞地跑来，抱起妮尔：“去吧。我带她去旧矿井，那里深。” / 妮尔没有哭。她在看你。
on enter: {sanity:-10}
from: eld_207 ⟵ “把妮尔推向那道光”
flags on arrival — MUST: ∅ · MAY-only: forgiven_edda, heardWord, jorbanKnows, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_207, eld_203, eld_201
  1. “跟先知走” → eld_301 eff{renown:5} ⇒ 你走进光里。最后一眼，是神父抱着妮尔走进麦田，背影越来越小。
  2. “留下来陪妮尔” → eld_210

### eld_210 · ch2 · ruins · 守护者米瑞丝 · time{h:1}
一个年轻的守护者摘下头盔，是个女孩，眼睛像冬天的湖。“先知看见了上千种未来，”她低声说，“你留下的那些里，没有一种好结局。” / 她向你伸出手。在她们之中，这大概很失礼。
from: eld_208 ⟵ ““那我留下，和他们一起。”” | eld_209 ⟵ “留下来陪妮尔”
flags on arrival — MUST: ∅ · MAY-only: forgiven_edda, heardWord, jorbanKnows, knowsPrice, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_207, eld_203, eld_201
  1. “握住她的手” → eld_301 eff{sanity:5,set:{mirethHand:true}} ⇒ 她的手很凉，很稳。先知瞥了你们一眼，什么也没说，转身走进光里。
  2. “任守护者把你拖进去” → eld_301 eff{sanity:-8,hp:-5} ⇒ 两只细长有力的手架住你的胳膊。你一路都在喊，他们一路都很有礼貌。
  3. “最后看一眼瓦尔达，再走” → eld_301 eff{sanity:-8,renown:3} ⇒ 绿光一片片扫过你长大的地方。你把它记住了，每一块田。然后你转身，走进光里。
  4. “留在瓦尔达” → eld_end_harvest

### eld_end_harvest · ch2 · tomb_exterior · 旁白 · foe:necron_warrior · time{d:2} · **ENDING bad**
光门合上了。你回到麦田，坐在家门槛上等。 / 第二天，一个银色的骷髅停在你面前，抬起了手。你没有跑。 / 很久以后，瓦尔达又长满了麦子，没人收割。墓穴重新睡着了，睡得很满足。
ending: 「最后一季」 cause: 与瓦尔达一同被收割
from: eld_210 ⟵ “留在瓦尔达”
flags on arrival — MUST: ∅ · MAY-only: forgiven_edda, heardWord, jorbanKnows, knowsPrice, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_210, eld_207, eld_203, eld_201

### eld_301 · ch3 · webway · 旁白 · time{d:2,warp:true} · eventRoll 0.42
网道里没有上下。光做的走廊向四面八方弯曲，脚步声落下去，很久才传回来。 / 你数不清走了多久。也许一小时，也许三天。 / 守护者们走得很快。没人回头看你有没有跟上。
on enter:   codex:place_webway
from: eld_207 ⟵ “跟她走” | eld_208 ⟵ “跟她走” | eld_208 ⟵ “朝她脚边啐一口，然后跟上” | eld_209 ⟵ “跟先知走” | eld_210 ⟵ “握住她的手” | eld_210 ⟵ “任守护者把你拖进去” | eld_210 ⟵ “最后看一眼瓦尔达，再走”
flags on arrival — MUST: ∅ · MAY-only: forgiven_edda, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_207, eld_203, eld_201
  1. “紧跟着那个女孩” → eld_302
  2. “伸手摸一摸光墙” → eld_302 eff{sanity:-8,renown:3,taint:{tzeentch:20}} ⇒ 墙是暖的，像活物。墙后无数声音同时转向你，像满屋子人突然安静下来。

### eld_302 · ch3 · webway · 守护者米瑞丝 · time{h:3}
“我叫米瑞丝。”她瞥了眼先知的背影，声音更低了，“别碰墙，别离开路，别回应任何叫你名字的东西。” / 她胸前嵌着一颗乳白色的宝石，随着心跳微微发亮。 / 远处某个地方，有东西在挠。
from: eld_301 ⟵ “紧跟着那个女孩” | eld_301 ⟵ “伸手摸一摸光墙”
flags on arrival — MUST: ∅ · MAY-only: forgiven_edda, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_301, eld_207, eld_203, eld_201
  1. ““什么在挠？”” → eld_303
  2. ““你胸前的宝石是什么？”” → eld_304

### eld_303 · ch3 · webway · 守护者米瑞丝 · time{h:1}
她指向一道封死的岔路，封印上刻满符文，另一边的挠声很有耐心。 / “她。渴求者。你们叫她色孽。”米瑞丝摸了摸胸前的宝石，“我们每个人死后，灵魂都是她的食物——除非有地方可逃。”
on enter: {sanity:-5}  codex:eld_she_who_thirsts,god_slaanesh
from: eld_302 ⟵ ““什么在挠？””
flags on arrival — MUST: ∅ · MAY-only: forgiven_edda, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_302, eld_301, eld_207, eld_203, eld_201
  1. “离那道封印远一点” → eld_304
  2. “把耳朵贴上去听” → eld_304 eff{sanity:-8,corruption:8,taint:{slaanesh:25}} ⇒ 挠声停了。一个温柔的声音说：“你闻起来不一样。没有石头。真干净。”米瑞丝一把把你拽开。

### eld_304 · ch3 · webway · 守护者米瑞丝 · time{h:1}
“灵魂石。”她说，“我死的时候，灵魂会逃进这块石头，而不是落进她嘴里。” / “然后呢？” / “然后石头回到方舟，回到墙里，和祖先在一起。”她顿了顿，“你们猿人死了，灵魂去哪？” / 你答不上来。
on enter: {sanity:-5}  codex:eld_spirit_stone
from: eld_302 ⟵ ““你胸前的宝石是什么？”” | eld_303 ⟵ “离那道封印远一点” | eld_303 ⟵ “把耳朵贴上去听”
flags on arrival — MUST: ∅ · MAY-only: forgiven_edda, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_302, eld_301, eld_207, eld_203, eld_201
  1. ““我们向帝皇祈祷。”” → eld_305 eff{sanity:5} ⇒ 米瑞丝礼貌地点头，像在听孩子讲妖怪故事。她没有笑，这已经很客气了。
  2. ““我不知道。”” → eld_305 eff{renown:3} ⇒ 她沉默了一会儿：“那你比大多数猿人诚实。”这是你第一次听出她声音里的温度。

### eld_305 · ch3 · webway · 旁白 · time{h:5}
前方岔路口传来音乐，轻快、古怪，像有人在笑。 / 一队戴面具的人从横穿的走廊上舞过去，衣服的颜色每走一步就换一次。 / 守护者们停下来低头致意，连先知也是。那队人没有停。
from: eld_304 ⟵ ““我们向帝皇祈祷。”” | eld_304 ⟵ ““我不知道。””
flags on arrival — MUST: ∅ · MAY-only: forgiven_edda, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_304, eld_302, eld_301, eld_207, eld_203, eld_201
  1. “盯着那队舞者看” → eld_306
  2. “问米瑞丝他们是谁” → eld_307 eff{renown:2} ⇒ “丑角。”米瑞丝低声说，“他们演我们的历史，也守着我们的秘密。别盯着看，他们会把你写进戏里。”
  3. “低头，跟上守护者” → eld_307 eff{renown:2} ⇒ 你学着他们低下头。米瑞丝从眼角瞥了你一眼，嘴角动了动。

### eld_306 · ch3 · webway · 镜面舞者 · time{h:1}
最后一个舞者停下来，转过一张没有五官的镜面面具。面具里映着你自己。 / 他对你比划：一个小人从一只巨大的手掌下溜走，还回头做了个鬼脸。 / 然后他一转身，舞进了另一条走廊。
on enter:   codex:eld_harlequins
from: eld_305 ⟵ “盯着那队舞者看”
flags on arrival — MUST: ∅ · MAY-only: forgiven_edda, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_305, eld_304, eld_302, eld_301, eld_207, eld_203
  1. “追上去” → eld_308 eff{set:{harlequinFavor:true}} ⇒ 跑了几步，音乐就没了。回头时，守护者们也不见了。走廊安静得像一口井。
  2. “学他做个鬼脸，再回队伍” → eld_307 eff{renown:3,set:{harlequinFavor:true}} ⇒ 你冲着空走廊做了个鬼脸。远处传来一声笑，像回礼。

### eld_307 · ch3 · webway · 塔艾丝拉先知 · time{h:6}
先知在一道巨大的拱门前等着，符文石绕着她慢慢转。 / “线还在。”她说，没有看你，像在清点一件行李。 / 拱门那头，是你从未想象过的光：一座城漂浮在虚空里，骨白色的尖塔像一片森林。
from: eld_305 ⟵ “问米瑞丝他们是谁” | eld_305 ⟵ “低头，跟上守护者” | eld_306 ⟵ “学他做个鬼脸，再回队伍” | eld_308(success) ⟵ “朝笑声走” | eld_308 ⟵ “掏出那块白石头” | eld_309(success) ⟵ “跟她讨价还价” | eld_310(success) ⟵ “大声喊先知的名字”
flags on arrival — MUST: ∅ · MAY-only: forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_305, eld_304, eld_302, eld_301, eld_207, eld_203
  1. “跟着走进去” → eld_401

### eld_308 · ch3 · webway · 旁白 · time{h:8,warp:true}
你独自站在网道里。每条走廊看起来都一样，每条都在轻轻呼吸。 / 左边远处有人在笑，很轻，很快。 / 右边，一个温柔的声音在叫你的名字。它知道你的名字。
on enter: {sanity:-8}
from: eld_306 ⟵ “追上去”
flags on arrival — MUST: harlequinFavor · MAY-only: forgiven_edda, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_306, eld_305, eld_304, eld_302, eld_301, eld_207
  1. “朝笑声走” ROLL p=0.65+sanity ✓eld_307 ✗eld_309 ⇒✓ 笑声领着你拐了七个弯。最后一个弯后，米瑞丝正端着枪，一脸怒气地找你。 ⇒✗ 笑声忽远忽近，最后停了。你走进一条没有光的走廊，有人在那里等你。
  2. “回应那个声音” → eld_309 eff{corruption:5,taint:{slaanesh:25}} ⇒ 你应了一声。那声音很高兴。前面的走廊变暗、变窄，变得很香。
  3. “掏出那块白石头” → eld_307 require{flag:runeStone} eff{renown:5} ⇒ 石头在你掌心亮起来，像一盏小灯。没过多久，一个披斗篷的身影从光里走出来，叹了口气。

### eld_309 · ch3 · webway · 维丝拉 · time{h:2}
一个人从暗处走出来，和米瑞丝很像，却瘦得像一把刀，盔甲上挂满钩子。 / “一只走丢的猿人。”她笑得很甜，“网道真慷慨。科摩拉的市场正缺新鲜货。” / 她身后的影子里，还有好几双眼睛。
on enter: {sanity:-5}  codex:eld_drukhari,place_commorragh
from: eld_308(fail) ⟵ “朝笑声走” | eld_308 ⟵ “回应那个声音”
flags on arrival — MUST: harlequinFavor · MAY-only: forgiven_edda, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_308, eld_306, eld_305, eld_304, eld_302, eld_301
  1. “跟她讨价还价” ROLL p=0.5+renown ✓eld_307 ✗eld_end_drukhari ⇒✓ 你说你是先知的“线”，越说越大声。她犹豫的那一秒，守护者的枪声到了。 ⇒✗ 她听完，鼓了鼓掌：“好口才。到了科摩拉，讲给买家听吧。”
  2. “转身就跑” → eld_310 eff{hp:-20} ⇒ 钩子擦过你的后背，你没回头。等你停下，四周只剩光，和你自己的喘气声。

### eld_310 · ch3 · webway · 旁白 · time{d:1,warp:true}
你逃进了一条断头岔路。尽头是一面裂开的光墙，外面什么都没有，连黑暗都没有。 / 你在这里坐了很久。时间不对劲：指甲长了，伤口却不结痂。 / 没人来找你。也许，没人会来。
on enter: {sanity:-8}
from: eld_309 ⟵ “转身就跑”
flags on arrival — MUST: harlequinFavor · MAY-only: forgiven_edda, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_309, eld_308, eld_306, eld_305, eld_304, eld_302
  1. “大声喊先知的名字” ROLL p=0.65+renown ✓eld_307 ✗eld_end_lost ⇒✓ 你喊到嗓子出血。终于，一颗符文石从光里滚出来，停在你脚边，像一根牵绳。 ⇒✗ 你的声音被墙吸走了，一点回音都没有。
  2. “坐下来，等” → eld_end_lost

### eld_end_drukhari · ch3 · webway · 维丝拉 · time{d:3} · **ENDING bad**
科摩拉没有太阳。你学会了很多事：怎么笑得让主人满意，怎么在拍卖台上站得笔直。 / 你的新主人说，猿人最有趣的地方，是会一直抱着希望。 / 她说得对。你到现在还在希望。
ending: 「无日之城」 cause: 被黑暗灵族掳往科摩拉
from: eld_309(fail) ⟵ “跟她讨价还价”
flags on arrival — MUST: harlequinFavor · MAY-only: forgiven_edda, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_309, eld_308, eld_306, eld_305, eld_304, eld_302

### eld_end_lost · ch3 · webway · 旁白 · time{y:40,warp:true} · **ENDING bad**
你等了很久，久到忘了自己在等什么。 / 偶尔有一队舞者从远处经过，在你面前停一停，做个鬼脸，又走了。 / 网道很大。在它的某个角落，有一个不会变老的猿人，还在数脚步。
ending: 「迷失网道」 cause: 被遗弃在网道之中
from: eld_310(fail) ⟵ “大声喊先知的名字” | eld_310 ⟵ “坐下来，等”
flags on arrival — MUST: harlequinFavor · MAY-only: forgiven_edda, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_310, eld_309, eld_308, eld_306, eld_305, eld_304

### eld_401 · ch4 · craftworld · 旁白 · time{d:1}
塞卢纳方舟世界。你的房间按“猿人规格”准备：天花板矮一些，一碗水，一把椅子——他们显然查过资料，才知道椅子是什么。 / 门口放着一本小册子，标题是《与客人相处须知》。
on enter: {sanity:5}  codex:place_selunar,eld_craftworlds,eld_monkeigh
from: eld_307 ⟵ “跟着走进去”
flags on arrival — MUST: ∅ · MAY-only: forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_307, eld_305, eld_304, eld_302, eld_301, eld_207
  1. “翻开小册子” → eld_402 eff{sanity:-5,renown:2} ⇒ 第一条：勿突然靠近。第二条：它会饿，按时喂食。第三条：它活不长，不必建立感情。
  2. “出门走走” → eld_402

### eld_402 · ch4 · craftworld · 灵骨歌者艾拉瑞斯 · time{h:3}
走廊上，一位长者正对着墙上的裂缝唱歌。歌声落到哪里，裂缝就在哪里慢慢长拢，像伤口愈合。 / “灵骨，”他头也不回，“方舟的骨头。它听歌，不听锤子。” / 他停下来打量你：“你会唱歌吗，猿人？”
on enter:   codex:eld_wraithbone,eld_bonesinger
from: eld_401 ⟵ “翻开小册子” | eld_401 ⟵ “出门走走”
flags on arrival — MUST: ∅ · MAY-only: forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_401, eld_307, eld_305, eld_304, eld_302, eld_301
  1. “哼一段瓦尔达的收割歌” → eld_403 eff{sanity:10,set:{bonesong:true}} ⇒ 你哼得很难听。可墙壁轻轻颤了一下，像熟睡的人翻了个身。灵骨歌者第一次露出了惊讶。
  2. ““这里为什么这么安静？”” → eld_404

### eld_403 · ch4 · craftworld · 灵骨歌者艾拉瑞斯 · time{h:1}
“墙认得悲伤，”艾拉瑞斯说，“你的歌里有很多。” / 他递给你一小片灵骨，形状像一粒麦子：“留着。它会记得你哼过的调子。” / 这是你来到方舟后，收到的第一件礼物。
on enter: {renown:5}
from: eld_402 ⟵ “哼一段瓦尔达的收割歌”
flags on arrival — MUST: bonesong · MAY-only: forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_402, eld_401, eld_307, eld_305, eld_304, eld_302
  1. “收下，道谢” → eld_404

### eld_404 · ch4 · craftworld · 旁白 · foe:wraith_construct · time{h:4}
方舟能住下一百万人，你走过的街区却全是空的。花园没人修剪，长椅上落满光尘。 / 只有一个灵骨巨人在慢慢巡逻。它没有脸，胸口嵌着一颗发光的石头。 / 米瑞丝说，里面住着一位死去的诗人。
on enter:   codex:eld_wraith_construct,eld_infinity_circuit
from: eld_402 ⟵ ““这里为什么这么安静？”” | eld_403 ⟵ “收下，道谢”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_402, eld_401, eld_307, eld_305, eld_304, eld_302
  1. “把手放在墙上” → eld_405 eff{sanity:-8,renown:5} ⇒ 墙里有成千上万个声音在低声交谈，像一座图书馆。其中一个停下来，问你是谁。你没敢回答。
  2. “向巨人点头致意” → eld_405 eff{renown:3} ⇒ 巨人停下来，转过那颗没有脸的头。过了很久，它也点了点头，慢得像在回忆该怎么做。

### eld_405 · ch4 · craftworld · 塔艾丝拉先知 · time{d:2}
先知在水晶穹顶召见你。四周站着许多晶莹的人形，都是看未来太久、化成了水晶的先知。 / “最伟大的先知艾德拉德也曾这样站着，”她说，“后来他醒了，去追随重生者。” / “现在，说说你的梦。”
on enter:   codex:place_crystal_dome,eld_eldrad
from: eld_404 ⟵ “把手放在墙上” | eld_404 ⟵ “向巨人点头致意”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, wronged_edda
certainly visited before (nearest 6): eld_404, eld_402, eld_401, eld_307, eld_305, eld_304
  1. ““瓦尔达还剩下什么？”” → eld_406 eff{sanity:-8} ⇒ “麦子，”她说，“和一座重新睡着的墓穴。死灵很守时。”她把一颗符文石翻了个面。
  2. ““你为什么救我？”” → eld_406 eff{renown:5} ⇒ “我没有救你，”她纠正道，“我保留了你。很多种未来里，都有个猿人站在一扇门前。我还不知道是哪扇门。”
  3. “把梦讲给她听” → eld_406 eff{sanity:-5,renown:3,set:{toldDreams:true},taint:{tzeentch:20}} ⇒ 你讲了那条发光的路，和一只很大、很香的手。先知的符文石同时停了一下。
  4. ““这十年的梦，是你送来的。”” → eld_406 require{flag:origin_pilgrim} eff{renown:10,sanity:-5,set:{toldDreams:true},taint:{tzeentch:20}} ⇒ “线要先拉直，才能穿针。”她平静地说，“你每一次流鼻血，我都看见了。按你们的说法：我很抱歉。”

### eld_406 · ch4 · craftworld · 守护者米瑞丝 · time{d:3}
米瑞丝带你逛方舟。她说每个灵族一生都走“道途”：做诗人、战士、歌者……一次只走一条，走到尽头再换。 / “为什么？” / “因为我们的心太大了。”她笑了一下，“不给它一条路，它就会跑去找她。”
on enter:   codex:eld_path
from: eld_405 ⟵ ““瓦尔达还剩下什么？”” | eld_405 ⟵ ““你为什么救我？”” | eld_405 ⟵ “把梦讲给她听” | eld_405 ⟵ ““这十年的梦，是你送来的。””
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_405, eld_404, eld_402, eld_401, eld_307, eld_305
  1. ““带我去看战士之道。”” → eld_407
  2. ““你以前走的是哪条？”” → eld_408

### eld_407 · ch4 · craftworld · 相位督军 · time{h:2}
相位神殿里，战士们戴着面具静立。督军的盔甲上刻满前任的名字。 / “戴上战面，杀意就关进面具里，”他说，“摘下来，还能做回诗人。” / “我不能。我被困在这条路上了。凯恩的手在我心里。”
on enter:   codex:place_aspect_shrine,eld_aspect_warriors,eld_khaine
from: eld_406 ⟵ ““带我去看战士之道。””
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_406, eld_405, eld_404, eld_402, eld_401, eld_307
  1. ““让我戴一戴战面。”” → eld_410
  2. “鞠躬，退出神殿” → eld_408 eff{renown:2} ⇒ 他回礼的角度精确到分毫，正好是对客人的标准。不多，也不少。

### eld_408 · ch4 · craftworld · 守护者米瑞丝 · time{h:2}
她带你去一座小花园，所有的花都是她当年在“梦者之道”上种的。 / “那时我只做一件事：做梦，把梦种出来。”她摸着一朵发光的花，“后来梦得太深，差点回不来。” / “所以现在我拿枪。枪很简单。”
from: eld_406 ⟵ ““你以前走的是哪条？”” | eld_407 ⟵ “鞠躬，退出神殿”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_406, eld_405, eld_404, eld_402, eld_401, eld_307
  1. “摘一朵花给她” → eld_409 eff{sanity:5,renown:2,set:{mirethFlower:true}} ⇒ 她愣了一下，把花别在灵魂石旁边。“猿人送的花，”她说，“传出去，我会被笑一百年。”
  2. “静静陪她坐一会儿” → eld_409 eff{sanity:10} ⇒ 花园里没有声音。你第一次觉得，方舟的安静不是空，而是在等。

### eld_409 · ch4 · craftworld · 旁白 · time{h:10} · eventRoll 0.49
夜里，方舟的灯一层层暗下去。你梦见瓦尔达的麦田，妮尔在田埂上跑，越跑越远。 / 醒来时，枕头是湿的。窗外，一个灵骨巨人静静站着，像在守夜。 / 你分不清它是在保护你，还是在看着你。
from: eld_408 ⟵ “摘一朵花给她” | eld_408 ⟵ “静静陪她坐一会儿” | eld_410 ⟵ “摘下面具” | eld_410 ⟵ “再戴一会儿”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_406, eld_405, eld_404, eld_402, eld_401, eld_307
  1. “起身去找米瑞丝” → eld_411
  2. “躺着，数墙里的声音” → eld_411 eff{sanity:-5,renown:3,taint:{tzeentch:25}} ⇒ 数到第三百个，有个声音很客气地叫出了你的名字。你不再数了。

### eld_410 · ch4 · craftworld · 战面中的幻象 · time{h:1}
督军把一张小面具放进你手里。戴上的瞬间，你看见一只燃烧的铁手，攥着一颗心。 / 愤怒像潮水灌进来——为瓦尔达，为妮尔，为那两个数字。 / 你想杀人。想得很清楚，很平静。
on enter: {sanity:-8}
from: eld_407 ⟵ ““让我戴一戴战面。””
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_407, eld_406, eld_405, eld_404, eld_402, eld_401
  1. “摘下面具” → eld_409 eff{renown:5} ⇒ 你把面具摘下来，手在发抖。督军点头：“摘下来了。比大多数头一回的孩子强。”
  2. “再戴一会儿” → eld_409 eff{hp:-10,corruption:10,renown:3,taint:{khorne:60}} ⇒ 督军不得不掰开你的手指才拿走面具。指甲在掌心掐出了血，你却觉得很好。

### eld_411 · ch4 · craftworld · 塔艾丝拉先知 · time{w:6}
你学会了吃他们的食物：味道很淡，像怕吵醒什么。你学会了走路时不发出声音。 / 先知偶尔在走廊尽头看你一眼，像园丁看一株种错了地方的苗。 / 有一天她开口了：“你学得比预期快。”
from: eld_409 ⟵ “起身去找米瑞丝” | eld_409 ⟵ “躺着，数墙里的声音”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_409, eld_406, eld_405, eld_404, eld_402, eld_401
  1. ““你预见过我？”” → eld_501 eff{renown:3} ⇒ “我预见过很多个你，”她说，“大多数学得很慢。”她走开了，符文石转得比平时快一点。
  2. “鞠一个精确的客人礼” → eld_501 eff{sanity:5,renown:2} ⇒ 角度分毫不差。先知停了一拍，回了一个同样精确的礼。你们都没有笑。

### eld_501 · ch5 · craftworld · 守护者米瑞丝 · time{y:1} · eventRoll 0.42
一年过去了。灵族终于开始叫你的名字，只是后面仍要加上“猿人”，像加一个敬称。 / 米瑞丝教会了你三百个词，你教会了她吹口哨。 / 今天，丑角剧团来了。整座方舟都在说悄悄话。
on enter: {sanity:5,hp:5}
from: eld_411 ⟵ ““你预见过我？”” | eld_411 ⟵ “鞠一个精确的客人礼”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_411, eld_409, eld_406, eld_405, eld_404, eld_402
  1. “去看演出” → eld_502
  2. “拉上米瑞丝一起去看” → eld_502 eff{sanity:5} ⇒ 米瑞丝说她看过一百遍了。她还是来了，坐在你旁边，提前攥紧了袖口。

### eld_502 · ch5 · craftworld · 镜面舞者 · time{h:6}
剧团演的是《陨落》。舞者扮成远古的灵族，在群星间宴饮、追逐，要更多，再要更多。 / 音乐越来越快，越来越美，美得让你喘不过气。 / 观众里没有一个人动。连呼吸都没有。
on enter:   codex:eld_harlequins,eld_the_fall
from: eld_501 ⟵ “去看演出” | eld_501 ⟵ “拉上米瑞丝一起去看”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_501, eld_411, eld_409, eld_406, eld_405, eld_404
  1. “看到最后” → eld_503 eff{sanity:-8,set:{sawMasque:true},taint:{slaanesh:10}} ⇒ 你移不开眼睛。你知道接下来会发生什么，就像知道一个梦的结局，却醒不过来。
  2. “转头看观众” → eld_504

### eld_503 · ch5 · craftworld · 镜面舞者 · time{h:1}
音乐在最高处断了。舞台中央裂开一个洞，一声尖啸，所有舞者同时倒下。 / 只有一个丑角还站着。他踮着脚从倒下的人中间溜走，回头做了个鬼脸。 / 剧场里，终于有人哭出了声。
on enter: {sanity:-5}  codex:god_slaanesh,eld_laughing_god
from: eld_502 ⟵ “看到最后”
flags on arrival — MUST: sawMasque · MAY-only: bonesong, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_502, eld_501, eld_411, eld_409, eld_406, eld_405
  1. “跟着笑一声” → eld_505 eff{renown:5,set:{harlequinFavor:true}} ⇒ 你笑出了声。几百张冷漠的脸同时转向你。台上，那个丑角朝你深深鞠了一躬。
  2. “沉默地坐着” → eld_505

### eld_504 · ch5 · craftworld · 守护者米瑞丝 · time{h:1}
观众的脸都很平静，可每个人都在流泪，一直流到下巴。 / 米瑞丝在你耳边说：“这一夜，一个神诞生了。我们的帝国死在一声尖叫里。” / “我们每年都看。免得忘了，为什么要活得这么小心。”
on enter:   codex:eld_the_fall
from: eld_502 ⟵ “转头看观众”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_502, eld_501, eld_411, eld_409, eld_406, eld_405
  1. “握住她的手” → eld_505 eff{sanity:5} ⇒ 她没有抽回去。台上的鼓声停了，她的手指在你掌心里轻轻发抖。
  2. ““那个神，就是她？”” → eld_505 eff{sanity:-5} ⇒ 米瑞丝闭上眼，点了一下头。一整排观众同时转过头来，好像你说出了一个禁忌的名字。

### eld_505 · ch5 · craftworld · 镜面舞者 · time{h:3}
散场后，那个镜面舞者坐在你旁边的台阶上，好像他一直都在。 / “一个猿人观众。欢笑之神喜欢剧本之外的客人。”他歪了歪头， / “那个神永远在饿。我们的神只是一直跑，一直笑。你猜谁会赢？”
on enter:   codex:eld_laughing_god
from: eld_503 ⟵ “跟着笑一声” | eld_503 ⟵ “沉默地坐着” | eld_504 ⟵ “握住她的手” | eld_504 ⟵ ““那个神，就是她？””
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_502, eld_501, eld_411, eld_409, eld_406, eld_405
  1. ““跑的那个。”” → eld_506 eff{renown:5,set:{harlequinFavor:true}} ⇒ 他鼓掌，掌声没有声音。“答对了。轮到你跑的时候，记得笑。”然后台阶上就没人了。
  2. ““没有人会赢。”” → eld_506 eff{sanity:-5,renown:2} ⇒ 镜面里映出你的脸，很疲惫。“真无聊，”他说，“可惜你说对了。”

### eld_506 · ch5 · craftworld · 游侠西尔凡 · time{d:4}
码头上，游侠们回来了。其中一个摘下兜帽——是瓦尔达山脊上那个人。 / “西尔凡。”他报出名字，又补了一句，“星语塔的天线，是我切断的。” / 他说这话时没有低头。他在等你。
on enter:   codex:eld_rangers
from: eld_505 ⟵ ““跑的那个。”” | eld_505 ⟵ ““没有人会赢。””
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_505, eld_502, eld_501, eld_411, eld_409, eld_406
  1. “一拳打过去” → eld_507 eff{hp:-5,renown:3,taint:{khorne:35}} ⇒ 他没躲。你的指节撞在他颧骨上，疼的却是你。他擦擦嘴角：“这一拳，该挨。”
  2. ““那架穿梭机呢？”” → eld_509 require{flag:nellLander}
  3. ““你也是奉命行事。”” → eld_508 eff{sanity:-5,renown:5,set:{forgave:true}} ⇒ 他看了你很久。“我有选择，”他说，“我选了。”然后他第一次向你鞠躬，比对客人深一点。
  4. ““你打断我枪管那晚，为什么不开第二枪？”” → eld_508 require{flag:origin_trooper} eff{renown:5} ⇒ “因为你放下了枪，”西尔凡说，“在一万种未来里，你都会放下。我想亲眼看看。”

### eld_507 · ch5 · craftworld · 游侠西尔凡 · time{h:1}
你挥第二拳时，他接住了，很轻，像接住一片落叶。 / “游侠走的是放逐之路，”他说，“我们离开方舟，去外面看，去外面犯错。错得太多的，就回不来了。” / “我大概快回不来了。”
from: eld_506 ⟵ “一拳打过去”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_506, eld_505, eld_502, eld_501, eld_411, eld_409
  1. “松开拳头” → eld_508

### eld_508 · ch5 · craftworld · 守护者米瑞丝 · time{d:6}
夜里，米瑞丝来你房间坐：“你们只活七八十年，怎么受得了？” / “受不了，”你说，“所以我们什么都想快一点。” / 她想了想：“这听起来……很像她喜欢的那种灵魂。”说完，她自己先打了个寒战。
from: eld_506 ⟵ ““你也是奉命行事。”” | eld_506 ⟵ ““你打断我枪管那晚，为什么不开第二枪？”” | eld_507 ⟵ “松开拳头” | eld_509 ⟵ “谢谢他”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgave, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_506, eld_505, eld_502, eld_501, eld_411, eld_409
  1. “给她讲妮尔的事” → eld_510 eff{sanity:10} ⇒ 你讲了很久，米瑞丝一句也没插。讲完，她说：“我会记住她的名字。我们记得很久。”
  2. “问她怕不怕死” → eld_510 eff{sanity:-5,renown:3} ⇒ “不怕死，”她摸着灵魂石，“怕的是死后。可我有这个。”她顿了顿，“你什么都没有。”

### eld_509 · ch5 · craftworld · 游侠西尔凡 · time{h:1}
“穿梭机到了轨道，”西尔凡说，“一艘自由商船收容了它。之后……我没去看。” / “为什么？” / “因为我不想知道。先知说这是软弱。” / 转身前他补了一句：“那孩子一直在喊你的名字。”
on enter: {sanity:10,renown:3}
from: eld_506 ⟵ ““那架穿梭机呢？””
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_506, eld_505, eld_502, eld_501, eld_411, eld_409
  1. “谢谢他” → eld_508

### eld_510 · ch5 · craftworld · 塔艾丝拉先知 · time{d:2}
先知召见你，这次没有符文，也没有水晶。 / “我们要去伊尔达涅斯。你也去。” / “为什么带我？” / “因为你应该亲眼看看，”她说，“四千一百万换来了什么。”
from: eld_508 ⟵ “给她讲妮尔的事” | eld_508 ⟵ “问她怕不怕死”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgave, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_508, eld_506, eld_505, eld_502, eld_501, eld_411
  1. ““好。”” → eld_601
  2. ““我不想看。”” → eld_601 eff{sanity:-5} ⇒ “想不想，”她说，“从来不是未来关心的事。”第二天，你还是登上了船。

### eld_601 · ch6 · maiden_world · 旁白 · time{d:9,warp:true} · eventRoll 0.42
伊尔达涅斯。天空干净得发蓝，森林一直长到海边。巨大的蜥兽在河边饮水，背上骑着灵族的孩子。 / 这里没有方舟，没有城市。流亡者住在树下，种地，放牧。 / 空气里有麦子的味道。你差点没站稳。
on enter: {sanity:10}  codex:place_ildaneth,eld_exodites
from: eld_510 ⟵ ““好。”” | eld_510 ⟵ ““我不想看。””
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgave, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_510, eld_508, eld_506, eld_505, eld_502, eld_501
  1. “走向麦田” → eld_602
  2. “蹲下来，捻一捻土” → eld_602 require{flag:origin_agri} eff{sanity:10,renown:3} ⇒ 黑土，松软，带着露水的凉。父亲说过，好土会咬手指。这片土咬得很轻。

### eld_602 · ch6 · maiden_world · 流亡者长老 · time{h:3}
流亡者长老拄着一根骨杖，比先知老，也比先知随和。 / “我们的祖先在陨落之前就离开了，”她说，“他们说帝国太舒服，舒服得危险。” / “我们的死者不进石头，进这片土地。所以这里的树都会说话。”
from: eld_601 ⟵ “走向麦田” | eld_601 ⟵ “蹲下来，捻一捻土”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgave, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_601, eld_510, eld_508, eld_506, eld_505, eld_502
  1. ““你们知道瓦尔达吗？”” → eld_603 eff{sanity:-5} ⇒ 长老摇头。她是真的不知道。她甚至不知道自己欠了谁一条命。
  2. “跟着孩子们去果园” → eld_603

### eld_603 · ch6 · maiden_world · 旁白 · time{h:2}
一个流亡者孩子跑过来，往你手里塞了一个果子，然后躲到树后偷看你。 / 果子很普通，有点酸。不是完美的味道，只是一个果子。 / 这个孩子活着。四千一百万人，换了这六千个人。果子还是温的。
from: eld_602 ⟵ ““你们知道瓦尔达吗？”” | eld_602 ⟵ “跟着孩子们去果园”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgave, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_602, eld_601, eld_510, eld_508, eld_506, eld_505
  1. “吃掉果子，冲孩子笑” → eld_604 eff{sanity:10,renown:3} ⇒ 孩子从树后走出来，学你咧嘴笑，牙缝里也夹着果皮。你笑着笑着，眼睛就湿了。
  2. “放下果子，走开” → eld_604 eff{sanity:-8,renown:5} ⇒ 你吃不下。孩子不明白，捡起果子，困惑地看着你的背影。

### eld_604 · ch6 · maiden_world · 恩灵使者赛尔 · time{d:1}
第二天，一艘陌生的船降落，来人的盔甲上刻着骷髅与新芽。 / “我是赛尔，伊芙蕾恩的使者。我们侍奉恩灵，死者之神。” / “最后一个灵族死去时，恩灵会醒来，吞掉渴求者。我们只想让它早点醒。”
on enter:   codex:eld_ynnari,eld_yvraine,eld_ynnead
from: eld_603 ⟵ “吃掉果子，冲孩子笑” | eld_603 ⟵ “放下果子，走开”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgave, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_603, eld_602, eld_601, eld_510, eld_508, eld_506
  1. ““先知好像不太欢迎你。”” → eld_605

### eld_605 · ch6 · maiden_world · 塔艾丝拉先知 · time{h:1}
“恩灵派，”先知的语气冷得结霜，“他们要把墙里的祖先叫醒，拿去当武器。” / 赛尔笑了：“而你们把祖先关在墙里，当电池用。” / 两人同时看向你，好像该由一个猿人来评理。
from: eld_604 ⟵ ““先知好像不太欢迎你。””
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgave, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_604, eld_603, eld_602, eld_601, eld_510, eld_508
  1. ““讲讲你们的死神。”” → eld_606
  2. ““艾德拉德是谁？”” → eld_607
  3. ““我站在塔艾丝拉这边。”” → eld_608 eff{renown:8,set:{loyal:true}} ⇒ 先知没有道谢。可当晚，你房里多了一把更舒服的椅子。

### eld_606 · ch6 · maiden_world · 恩灵使者赛尔 · time{h:1}
“伊芙蕾恩死在黑暗之城的角斗场里，”赛尔说，“又带着恩灵的一部分站了起来。” / “我们的亡魂不落进她嘴里，也不关进石头，而是化作恩灵的力量。” / 她递来一枚骨白小骷髅：“猿人也能戴。”
from: eld_605 ⟵ ““讲讲你们的死神。””
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgave, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda
certainly visited before (nearest 6): eld_605, eld_604, eld_603, eld_602, eld_601, eld_510
  1. “戴上它” → eld_607 eff{renown:5,sanity:-5,set:{ynnari:true}} ⇒ 骷髅贴着胸口，凉得像井水。先知看见了，什么也没说。她的符文石却从此绕开了你。
  2. “礼貌地拒绝” → eld_607 eff{renown:3} ⇒ 赛尔并不意外：“死者有耐心。等你想要的时候，它会在。”

### eld_607 · ch6 · maiden_world · 幻象 · time{h:1}
你握住符文石，看见一个身影站在无数命运之线中间，像拨琴弦一样拨弄它们。 / “艾德拉德·乌斯兰，”塔艾丝拉说，“他拨动过整个银河，最后也被拨动了，跟着重生者走了。” / “再粗的线，也会松。”
on enter: {sanity:-5,renown:5,taint:{tzeentch:35}}  codex:eld_eldrad
from: eld_605 ⟵ ““艾德拉德是谁？”” | eld_606 ⟵ “戴上它” | eld_606 ⟵ “礼貌地拒绝”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgave, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda, ynnari
certainly visited before (nearest 6): eld_605, eld_604, eld_603, eld_602, eld_601, eld_510
  1. “放下符文石” → eld_608

### eld_608 · ch6 · maiden_world · 维丝拉 · foe:drukhari_raider · time{h:20}
夜里，黑色快艇掠过森林。刀一样瘦的身影跳下来，钩子闪着光，专挑孩子。 / “黑暗灵族，”米瑞丝举枪，“我们的表亲。陨落后，他们靠吃别人的痛苦活着。” / 果园里，那个给你果子的孩子在哭。
on enter: {sanity:-5,hp:-15}  codex:eld_drukhari
from: eld_605 ⟵ ““我站在塔艾丝拉这边。”” | eld_607 ⟵ “放下符文石”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgave, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda, ynnari
certainly visited before (nearest 6): eld_605, eld_604, eld_603, eld_602, eld_601, eld_510
  1. “冲进果园” ROLL p=0.5+hp ✓eld_609 ✗eld_610 ⇒✓ 你扑倒孩子，钩子从你头顶划过。米瑞丝的枪声在你身后连成一片。 ⇒✗ 钩子勾住你的外套，把你拖倒在地。米瑞丝冲过来，挡在你和刀之间。
  2. “像防卫军那样，守住果园入口” → eld_609 require{flag:origin_trooper} eff{hp:-10,renown:5} ⇒ 你找了块石头当掩体，一枪一枪地打，像在瓦尔达的路口。这一次，你守住了。
  3. “躲进树洞” → eld_610 eff{sanity:-8,taint:{nurgle:10},set:{wronged_mireth:true}} ⇒ 你在黑暗里捂着嘴，听着外面的一切。米瑞丝在喊你的名字，一遍，又一遍。你没有回答。

### eld_609 · ch6 · maiden_world · 守护者米瑞丝 · foe:drukhari_raider · time{h:1}
孩子安全了。快艇在燃烧，掠夺者笑着撤退，像游戏散场。 / 米瑞丝靠着树坐下，伤得很重。她把灵魂石按进你手心：“替我拿着。别让她……” / 石头在你掌心亮了一下，像一次心跳。然后稳稳地亮着。
on enter: {renown:10,sanity:-8,hp:-20,set:{carryStone:true,mirethDead:true}}
from: eld_608(success) ⟵ “冲进果园” | eld_608 ⟵ “像防卫军那样，守住果园入口”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgave, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda, ynnari
certainly visited before (nearest 6): eld_608, eld_605, eld_604, eld_603, eld_602, eld_601
  1. “握紧石头” → eld_611

### eld_610 · ch6 · maiden_world · 旁白 · time{h:2}
天亮时，掠夺者走了，带走了十几个孩子。 / 米瑞丝倒在果园边。她最后挡下的那把刀，本来是冲着你的。 / 她胸前的灵魂石滚落在草丛里，还在发光，像在等一只手。
on enter: {sanity:-10,hp:-20,set:{mirethDead:true}}
from: eld_608(fail) ⟵ “冲进果园” | eld_608 ⟵ “躲进树洞”
flags on arrival — MUST: ∅ · MAY-only: bonesong, forgave, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_608, eld_605, eld_604, eld_603, eld_602, eld_601
  1. “捡起灵魂石” → eld_611 eff{renown:5,set:{carryStone:true}} ⇒ 石头很暖。你觉得它在你掌心里轻轻松了一口气。
  2. “留给先知” → eld_611 eff{sanity:5} ⇒ 先知弯腰拾起石头，看了你一眼。那眼神你读不懂，但不像责备。

### eld_611 · ch6 · maiden_world · 塔艾丝拉先知 · time{d:1}
流亡者把死者埋进树根下，唱着你听不懂的歌。被掳走的孩子，没有坟。 / 先知站在你身边，轻声算了一遍：“六千，减十四。” / 她说这个数时，第一次没有像在报天气。
on enter: {sanity:-5}
from: eld_609 ⟵ “握紧石头” | eld_610 ⟵ “捡起灵魂石” | eld_610 ⟵ “留给先知”
flags on arrival — MUST: mirethDead · MAY-only: bonesong, carryStone, forgave, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_608, eld_605, eld_604, eld_603, eld_602, eld_601
  1. ““值得吗？”” → eld_701 eff{renown:3} ⇒ 她看着树根很久。“我不知道，”她说，“先知不该说这句话。我说了。”
  2. “默默跟着唱” → eld_701 eff{sanity:8} ⇒ 你不懂歌词，只跟着调子。一个流亡者孩子靠过来，握住了你的手指。

### eld_701 · ch7 · craftworld · 灵骨歌者艾拉瑞斯 · time{d:12}
回到塞卢纳。米瑞丝的灵魂石本该放进无尽回路，和祖先在一起。 / 可艾拉瑞斯脸色很差：“墙里的声音在变少。有东西在网道里，一口一口地吃。” / “它找最新鲜的灵魂。比如，刚死去的。”
(grudgeLine mireth: 艾拉瑞斯没问米瑞丝是怎么死的，只看了你一眼，又移开了。)
on enter: {sanity:-5}  codex:eld_infinity_circuit
from: eld_611 ⟵ ““值得吗？”” | eld_611 ⟵ “默默跟着唱”
flags on arrival — MUST: mirethDead · MAY-only: bonesong, carryStone, forgave, forgiven_edda, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_611, eld_608, eld_605, eld_604, eld_603, eld_602
  1. “把米瑞丝的石头交给他” → eld_702 require{flag:carryStone} eff{sanity:5,set:{carryStone:false}} grudge(mireth) ⇒ 艾拉瑞斯把石头贴在额头，唱了一句很短的歌。墙接过了它，像接过一个孩子。
  2. “把石头留在身边” → eld_702 require{flag:carryStone} eff{renown:5} ⇒ “她让你拿着，”艾拉瑞斯低声说，“那就拿着。灵骨记得谁答应过什么。”
  3. ““它在吃什么？”” → eld_702 eff{sanity:-5} ⇒ “我们的祖先，”艾拉瑞斯说，“还有我们的将来。”他把手按在墙上，墙在他手下发抖。
  4. “对石头说出树洞里的那一夜” → eld_702 require[{flag:carryStone},{flag:wronged_mireth}] eff{sanity:4,set:{forgiven_mireth:true}} ⇒ 你对石头说出了那一夜：树洞，黑暗，她喊你的名字。石头很久没有动静。然后，它暖了一度。

### eld_702 · ch7 · jungle · 完美的声音 · time{h:9} · eventRoll 0.49
那晚你梦见瓦尔达。麦子金黄，没有墓穴，妮尔长大了，在门口喊你吃饭。 / 一切都刚刚好，好得让人想哭。 / 一个声音轻轻地说：“这是可以的。只要你把那扇门打开一点点。”
on enter:   codex:eld_she_who_thirsts,god_slaanesh
from: eld_701 ⟵ “把米瑞丝的石头交给他” | eld_701 ⟵ “把石头留在身边” | eld_701 ⟵ ““它在吃什么？”” | eld_701 ⟵ “对石头说出树洞里的那一夜”
flags on arrival — MUST: mirethDead · MAY-only: bonesong, carryStone, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_701, eld_611, eld_608, eld_605, eld_604, eld_603
  1. “走进家门” → eld_703 eff{corruption:20,sanity:10,set:{tasted:true},taint:{slaanesh:45}} ⇒ 饭菜的香味完美无缺。你吃了一口，醒来时嘴里还有那个味道。之后的每一顿饭，都像嚼灰。
  2. “咬破手背，逼自己醒来” → eld_703 eff{hp:-5,sanity:-8,renown:5} ⇒ 你在黑暗里醒来，手背上一圈牙印。窗外的灵骨巨人转过头，看了你很久。

### eld_703 · ch7 · craftworld · 塔艾丝拉先知 · time{d:1}
水晶穹顶里，先知终于说出它的名字：无餍者，色孽的守密者，一个大魔。 / “它闻到你了。没有灵魂石的灵魂，又亮又干净。它会追你进网道。” / “我会在你身后封门。这就是你被留下的原因。”
on enter: {sanity:-8}  codex:eld_keeper_of_secrets,eld_the_unsated
from: eld_702 ⟵ “走进家门” | eld_702 ⟵ “咬破手背，逼自己醒来”
flags on arrival — MUST: mirethDead · MAY-only: bonesong, carryStone, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_702, eld_701, eld_611, eld_608, eld_605, eld_604
  1. ““我去。”” → eld_705 eff{renown:10,set:{bait:true}} ⇒ 先知微微低下头。那是你在方舟上见过的，最深的一次鞠躬。
  2. ““再看一次未来。为我。”” → eld_704 require{stat:renown,min:35}
  3. ““不。我受够了你的算术。”” → eld_706 eff{sanity:5,renown:-5} ⇒ 你转身就走。没人拦你，连符文石都停止了转动。

### eld_704 · ch7 · craftworld · 塔艾丝拉的符文 · time{h:3}
先知第一次为一个猿人重新抛出符文。石头在半空停住，排成一条你看不懂的路。 / “有一根线，”她的声音有些哑，“那里，你不是一个人在黑暗里。有人在笑，有人捧着死者。” / “很细。但它在。”
on enter: {renown:5,sanity:-5,set:{betterThread:true,bait:true}}
from: eld_703 ⟵ ““再看一次未来。为我。””
flags on arrival — MUST: mirethDead · MAY-only: bonesong, carryStone, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_703, eld_702, eld_701, eld_611, eld_608, eld_605
  1. ““那就走那根线。”” → eld_705

### eld_705 · ch7 · craftworld · 凯恩的化身 · time{d:2} · eventRoll 0.42
出发前夜，方舟深处传来心跳。一位年轻的灵族走进铁铸的密室，再没出来。 / 然后铁门熔化，一个燃烧的巨人走出来，手淌熔铁。整座方舟鸦雀无声。 / “凯恩的化身醒了，”艾拉瑞斯说，“这是战争。”
on enter: {sanity:-5}  codex:eld_khaine
from: eld_703 ⟵ ““我去。”” | eld_704 ⟵ ““那就走那根线。”” | eld_706 ⟵ “再想一晚” | eld_706 ⟵ “回去找先知”
flags on arrival — MUST: bait, mirethDead · MAY-only: betterThread, bonesong, carryStone, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_703, eld_702, eld_701, eld_611, eld_608, eld_605
  1. “看着那个燃烧的巨人” → eld_707 eff{renown:5,sanity:-5} ⇒ 它从你身边走过，热浪烤干了你的眼泪。它没看你。它只看得见战争。
  2. “去找艾拉瑞斯” → eld_707 eff{hp:10,sanity:5,set:{charm:true},taint:{all:-10}} ⇒ 艾拉瑞斯为你唱出一枚护身符，形状像麦穗。“灵骨记得你的歌，”他说，“它会替你记住回家的路。”

### eld_706 · ch7 · craftworld · 游侠西尔凡 · time{h:6}
码头上，西尔凡在等你，船的引擎已经热好了。 / “最近的猿人世界，三天航程，”他说，“我欠你的。” / 他顿了顿：“但先知看见的那些未来里，你回去的……没有一个是好的。”
from: eld_703 ⟵ ““不。我受够了你的算术。””
flags on arrival — MUST: mirethDead · MAY-only: bonesong, carryStone, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_703, eld_702, eld_701, eld_611, eld_608, eld_605
  1. “登船回家” → eld_end_burned eff{sanity:10} ⇒ 船离开塞卢纳时，你没有回头。你想象着一个有人叫你真名的地方。
  2. “再想一晚” → eld_705 eff{sanity:-5,set:{bait:true}} ⇒ 你在码头坐到天亮。西尔凡一直陪着，一句话也没说。天亮时，你自己走回了水晶穹顶。
  3. “回去找先知” → eld_705 eff{renown:5,set:{bait:true}} ⇒ 西尔凡关掉了引擎。“我猜到了，”他说，“我在网道口等你。”

### eld_707 · ch7 · webway · 塔艾丝拉先知 · time{h:4}
网道口。守护者列队，相位战士戴上了战面，燃烧的化身站在最前面。 / 先知最后一次看你：“走进去，一直走。它会来。我封门的时候，不要回头。” / “如果我回头了呢？” / “那就是另一根线了。”
from: eld_705 ⟵ “看着那个燃烧的巨人” | eld_705 ⟵ “去找艾拉瑞斯”
flags on arrival — MUST: bait, mirethDead · MAY-only: betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_705, eld_703, eld_702, eld_701, eld_611, eld_608
  1. “走进网道” → eld_801

### eld_end_burned · ch7 · burning_city · 审判官 · time{d:20} · **ENDING bad**
你回到人类世界，讲了一切：灵族、网道、先知、那两个数字。 / 审判官听得很仔细，记着笔记。 / “与异形同处逾年，”她合上本子，“灵魂已不可信。” / 第二天广场上点起火堆，人们唱着赞美帝皇的歌。
ending: 「归乡之火」 cause: 被当作异形同谋烧死
on enter:   codex:imp_inquisition
from: eld_706 ⟵ “登船回家” | eld_806 ⟵ ““回家。回人类那边。””
flags on arrival — MUST: mirethDead · MAY-only: bait, betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_703, eld_702, eld_701, eld_611, eld_608, eld_605

### eld_801 · ch8 · webway · 旁白 · time{h:5,warp:true}
你独自走着。光墙一层层暗下去，空气越来越甜，甜得发腻。 / 远处有音乐，不是丑角的——太完美了，每个音都落在你最想听的地方。 / 你的口袋里，有什么在发热。
(grudgeLine mireth: 你想起树洞里的那一夜：米瑞丝喊了你一整晚。)
from: eld_707 ⟵ “走进网道”
flags on arrival — MUST: bait, mirethDead · MAY-only: betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_707, eld_705, eld_703, eld_702, eld_701, eld_611
  1. “握住米瑞丝的灵魂石” → eld_802 require{flag:carryStone} eff{sanity:10,taint:{slaanesh:-10}} grudge(mireth) ⇒ 石头里有一声很轻的叹息，像米瑞丝在你耳边说：别回应叫你名字的东西。
  2. “握住那枚灵骨麦穗” → eld_802 require{flag:charm} eff{sanity:5,hp:5} ⇒ 灵骨在你掌心哼起了收割歌，跑调跑得和你一模一样。
  3. “继续往前走” → eld_802

### eld_802 · ch8 · webway · 无餍者 · foe:greater_daemon_slaanesh · time{h:1}
它从光里走出来，高得要仰头才看全。四只手臂，一张美得让人心碎的脸。 / “终于，”无餍者用妮尔的声音说，“一个干净的灵魂。没有石头，没有锁。” / “我不要你的命。我只想给你想要的一切。”
on enter: {sanity:-8,corruption:5,hp:-10}  codex:eld_keeper_of_secrets,eld_the_unsated
from: eld_801 ⟵ “握住米瑞丝的灵魂石” | eld_801 ⟵ “握住那枚灵骨麦穗” | eld_801 ⟵ “继续往前走”
flags on arrival — MUST: bait, mirethDead · MAY-only: betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_801, eld_707, eld_705, eld_703, eld_702, eld_701
  1. “听它说下去” → eld_803
  2. ““不。”” ROLL p=0.6+sanity ✓eld_804 ✗eld_803 ⇒✓ 你说得很清楚。它的笑容停了一瞬，像一幅画裂了道缝。 ⇒✗ 你张开嘴，说出来的却是：“……说下去。”
  3. “对着它大笑” → eld_805 require{flag:harlequinFavor} eff{renown:5} ⇒ 你笑了，笑得像个傻子。四周的光里，传来另一个笑声，回应着你。

### eld_803 · ch8 · jungle · 无餍者 · foe:greater_daemon_slaanesh · time{h:1}
它让你看：瓦尔达的麦田完好无损，妮尔长大了在门口等你，四千一百万人都活着。 / “只要你点头，”它温柔地说，“你就永远在那里。完美的，永远的。” / 你的心跳得很快。你从没这么想要过一样东西。
(grudgeLine mireth: 你想起米瑞丝在果园里的喊声。你没有应过。)
on enter: {corruption:15,taint:{slaanesh:25}}
from: eld_802 ⟵ “听它说下去” | eld_802(fail) ⟵ ““不。”” | eld_803 ⟵ ““先让我尝一口。””
flags on arrival — MUST: bait, mirethDead · MAY-only: betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_802, eld_801, eld_707, eld_705, eld_703, eld_702
  1. “点头” → eld_end_thirst
  2. ““先让我尝一口。”” → eld_803 eff{corruption:15,sanity:10,taint:{slaanesh:25}} ⇒ 一口就好。味道完美得让你发抖。它微笑着，又把盘子推近了一点。
  3. “把灵魂石按在心口” → eld_804 require{flag:carryStone} eff{corruption:-15,sanity:5,taint:{slaanesh:-15}} grudge(mireth) ⇒ 石头烫得像火。你听见米瑞丝在里面喊你的真名。麦田碎了，像一面镜子。
  4. “想起妮尔真正的样子” → eld_804 eff{sanity:-12,renown:3} ⇒ 真正的妮尔牙缝里塞着麦壳，数船总数错。这个完美的妮尔不会数错。你后退了一步。

### eld_804 · ch8 · webway · 旁白 · foe:greater_daemon_slaanesh · time{h:1}
身后的网道口亮起符文，一道接一道，像有人一页页合上一本书。先知在封门。 / 大魔察觉了陷阱。它尖啸着扑过来，四只手同时伸向你。 / 门只剩一道缝。你还在门里。
on enter: {hp:-20}
from: eld_802(success) ⟵ ““不。”” | eld_803 ⟵ “把灵魂石按在心口” | eld_803 ⟵ “想起妮尔真正的样子”
flags on arrival — MUST: bait, mirethDead · MAY-only: betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_802, eld_801, eld_707, eld_705, eld_703, eld_702
  1. “冲向那道缝” ROLL p=0.45+hp ✓eld_806 ✗eld_end_sealed ⇒✓ 你扑过门缝，后背一凉，一只手擦着你抓了个空。门在身后合上，轻轻“咔”的一声。 ⇒✗ 那只手比你快。你被拽回去的瞬间，看见门缝合拢，先知的脸消失在另一边。
  2. “站住，相信那根线” → eld_806 require{stat:renown,min:45} eff{renown:5} ⇒ 你闭上眼。一根看不见的线勒住你的腰，猛地一拽——你飞过门缝，摔在先知脚边。
  3. “呼唤恩灵” → eld_807 require{flag:ynnari}
  4. “寻找那个笑声” → eld_805 require{flag:betterThread}

### eld_805 · ch8 · webway · 镜面舞者 · foe:greater_daemon_slaanesh · time{h:1}
光墙裂开，一队丑角翻着跟头涌进来，衣服的颜色每一步都在变。 / 他们围着大魔起舞，学它的动作，更美、更快，还冲它做鬼脸。 / 大魔被激怒，追着他们撞进封印。镜面舞者伸手：“该跑了，观众。”
on enter:   codex:eld_harlequins,eld_laughing_god
from: eld_802 ⟵ “对着它大笑” | eld_804 ⟵ “寻找那个笑声”
flags on arrival — MUST: bait, mirethDead · MAY-only: betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_802, eld_801, eld_707, eld_705, eld_703, eld_702
  1. “跟着剧团走” → eld_end_masque ⇒ 你握住那只手。下一步，你已经在另一条走廊里，身后的尖啸像落幕的掌声。
  2. “回到先知那边” → eld_806

### eld_806 · ch8 · craftworld · 塔艾丝拉先知 · time{h:6}
封印合上了。网道深处，大魔的尖啸越来越远，最后变成一段听不清的歌。 / 先知站在你面前，看了你很久。 / “线还在，”她说。然后她做了一件从没做过的事——问你：“你想去哪里？”
on enter: {sanity:10,renown:10}
from: eld_804(success) ⟵ “冲向那道缝” | eld_804 ⟵ “站住，相信那根线” | eld_805 ⟵ “回到先知那边” | eld_807 ⟵ “回到先知身边”
flags on arrival — MUST: bait, mirethDead · MAY-only: betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_802, eld_801, eld_707, eld_705, eld_703, eld_702
  1. ““伊尔达涅斯。去种地。”” → eld_end_maiden
  2. ““留在塞卢纳，跟艾拉瑞斯学唱歌。”” → eld_end_guest
  3. ““回家。回人类那边。”” → eld_end_burned ⇒ 先知沉默了很久，最后只说：“我会为你备船。”她没有看你的眼睛。
  4. ““去找恩灵派。”” → eld_end_ynnari require{flag:ynnari}

### eld_807 · ch8 · webway · 恩灵之光 · foe:greater_daemon_slaanesh · time{h:1}
胸前的小骷髅忽然变冷。苍白的光从网道地面升起，像死者一个个站起来。 / 光里有个女人的轮廓，手持双刃——伊芙蕾恩的影子。亡魂们围住大魔，一寸寸把它推回黑暗。 / 其中一道光，经过你时停了一下。
on enter: {sanity:5}  codex:eld_ynnead,eld_yvraine
from: eld_804 ⟵ “呼唤恩灵”
flags on arrival — MUST: bait, mirethDead · MAY-only: betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_804, eld_802, eld_801, eld_707, eld_705, eld_703
  1. “跟着那道光走” → eld_end_ynnari
  2. “回到先知身边” → eld_806

### eld_end_masque · ch8 · webway · 镜面舞者 · time{y:7,warp:true} · **ENDING good**
丑角剧团多了一个观众，后来又多了一个角色：一个永远演不好的猿人。 / 每次《陨落》演到结尾，都由你在黑暗里笑出第一声。 / 有人说，欢笑之神本人来看过一场，笑得最响的就是他。
ending: 「欢笑之神的观众」 cause: 随丑角剧团远行
from: eld_805 ⟵ “跟着剧团走”
flags on arrival — MUST: bait, mirethDead · MAY-only: betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_805, eld_802, eld_801, eld_707, eld_705, eld_703

### eld_end_sealed · ch8 · webway · 旁白 · foe:greater_daemon_slaanesh · time{d:1,warp:true} · **ENDING bad**
门合上了。另一边，先知垂下眼睛，在符文上划掉一根线。 / 你和大魔一起被封在网道里。它不急，它有的是时间；你会慢慢变得不那么干净。 / 方舟上没人为猿人唱歌，只有一片灵骨偶尔哼起跑调的收割歌。
ending: 「封印之内」 cause: 为先知的幻象献祭
from: eld_804(fail) ⟵ “冲向那道缝”
flags on arrival — MUST: bait, mirethDead · MAY-only: betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_804, eld_802, eld_801, eld_707, eld_705, eld_703

### eld_end_thirst · ch8 · jungle · 无餍者 · time{y:1,warp:true} · **ENDING bad**
你点了头。瓦尔达的麦田在你周围展开，完美无缺，妮尔在门口等你。 / 你进门，坐下，吃饭。每一顿都一样完美。 / 每一天都一样。你想停下，却想不起该怎么停。很远的地方，有什么正吃得很开心。
ending: 「完美的晚餐」 cause: 灵魂被色孽吞噬
from: eld_803 ⟵ “点头”
flags on arrival — MUST: bait, mirethDead · MAY-only: betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_803, eld_802, eld_801, eld_707, eld_705, eld_703

### eld_end_guest · ch8 · craftworld · 灵骨歌者艾拉瑞斯 · time{y:5} · **ENDING good**
五年后，塞卢纳空荡的街区里，有一面墙是一个猿人唱好的。裂缝合得歪歪扭扭，可它不再漏光了。 / 艾拉瑞斯说，你永远成不了灵骨歌者。 / 他说这话时，正在教你下一首歌。
ending: 「会唱歌的客人」 cause: 留在方舟学唱灵骨
from: eld_806 ⟵ ““留在塞卢纳，跟艾拉瑞斯学唱歌。””
flags on arrival — MUST: bait, mirethDead · MAY-only: betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_806, eld_802, eld_801, eld_707, eld_705, eld_703

### eld_end_maiden · ch8 · maiden_world · 旁白 · time{y:3} · **ENDING good**
三年后，伊尔达涅斯河边多了一块麦田，是一个猿人种的。流亡者的孩子管它叫“会哭的人的田”。 / 你教他们唱收割歌。他们唱得比你还难听。 / 有时先知会来，站在田埂上，什么也不说，只看着麦子。
ending: 「处女世界的麦田」 cause: 在伊尔达涅斯种麦
from: eld_806 ⟵ ““伊尔达涅斯。去种地。””
flags on arrival — MUST: bait, mirethDead · MAY-only: betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_806, eld_802, eld_801, eld_707, eld_705, eld_703

### eld_end_ynnari · ch8 · webway · 恩灵派 · time{y:1,warp:true} · **ENDING good**
你跟着恩灵派走遍了网道。他们叫你“活着的那个”，因为你是队伍里唯一还会变老的人。 / 伊芙蕾恩远远地看过你一眼，点了点头。 / 你胸前的骷髅里，偶尔有一个声音在吹口哨。是你教的。
ending: 「死者的同行人」 cause: 随恩灵派同行
from: eld_806 ⟵ ““去找恩灵派。”” | eld_807 ⟵ “跟着那道光走”
flags on arrival — MUST: bait, mirethDead · MAY-only: betterThread, bonesong, carryStone, charm, forgave, forgiven_edda, forgiven_mireth, harlequinFavor, heardWord, jorbanKnows, knowsPrice, loyal, mirethFlower, mirethHand, nellKept, nellLander, origin_agri, origin_pilgrim, origin_trooper, runeStone, sawMasque, sentCall, tasted, toldDreams, wronged_edda, wronged_mireth, ynnari
certainly visited before (nearest 6): eld_802, eld_801, eld_707, eld_705, eld_703, eld_702
