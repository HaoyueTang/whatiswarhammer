# Route digest: mechanicus — 89 nodes, origins: menial@mech_101, savant@mech_o_savant_1, conscript@mech_o_conscript_1

Entered by the engine from anywhere (stat deaths, claim jumps): mech_death_hp, mech_death_sanity, mech_death_corruption, mech_end_claim_khorne, mech_end_claim_nurgle, mech_end_claim_tzeentch, mech_end_claim_slaanesh

Random events (eventRoll → data/events*.js) are not in this graph; they can also set flags. Time `d`/`h`/`y` is applied on entering the node. MUST = on every path to the node; MAY = on some path.

## Automatic findings (28)
- **INFO** `mech_103`: flag 'tobinFriend' is set (at mech_103, mech_o_conscript_4) but never used by a require — only text may rely on it
- **INFO** `mech_104`: flag 'tapped' is set (at mech_104) but never used by a require — only text may rely on it
- **INFO** `mech_107`: flag 'pulledTobin' is set (at mech_107) but never used by a require — only text may rely on it
- **INFO** `mech_109`: flag 'askedTobin' is set (at mech_109) but never used by a require — only text may rely on it
- **INFO** `mech_108`: flag 'apprentice' is set (at mech_108) but never used by a require — only text may rely on it
- **INFO** `mech_o_savant_1`: flag 'readContract' is set (at mech_o_savant_1) but never used by a require — only text may rely on it
- **INFO** `mech_201`: flag 'askedServitor' is set (at mech_201) but never used by a require — only text may rely on it
- **INFO** `mech_203`: flag 'askedNew' is set (at mech_203, mech_307) but never used by a require — only text may rely on it
- **INFO** `mech_204`: flag 'ossiaWarned' is set (at mech_204) but never used by a require — only text may rely on it
- **INFO** `mech_204`: flag 'reportedOssia' is set (at mech_204) but never used by a require — only text may rely on it
- **INFO** `mech_205`: flag 'tookBlame' is set (at mech_205) but never used by a require — only text may rely on it
- **INFO** `mech_206`: flag 'ossiaGone' is set (at mech_206) but never used by a require — only text may rely on it
- **INFO** `mech_208`: flag 'askedTreaty' is set (at mech_208) but never used by a require — only text may rely on it
- **INFO** `mech_301`: flag 'aug' is set (at mech_301) but never used by a require — only text may rely on it
- **INFO** `mech_301`: flag 'fleshFirst' is set (at mech_301) but never used by a require — only text may rely on it
- **INFO** `mech_303`: flag 'keshTalk' is set (at mech_303, mech_305) but never used by a require — only text may rely on it
- **INFO** `mech_308`: flag 'initiate' is set (at mech_308) but never used by a require — only text may rely on it
- **INFO** `mech_308`: flag 'doubter' is set (at mech_308) but never used by a require — only text may rely on it
- **INFO** `mech_403`: flag 'warnedTomb' is set (at mech_403) but never used by a require — only text may rely on it
- **INFO** `mech_404`: flag 'savedServitors' is set (at mech_404) but never used by a require — only text may rely on it
- **INFO** `mech_408`: flag 'crystal' is set (at mech_408) but never used by a require — only text may rely on it
- **INFO** `mech_503`: flag 'grotDeal' is set (at mech_503) but never used by a require — only text may rely on it
- **INFO** `mech_504`: flag 'mekWatch' is set (at mech_504) but never used by a require — only text may rely on it
- **INFO** `mech_506`: flag 'keshRepair' is set (at mech_506) but never used by a require — only text may rely on it
- **INFO** `mech_604`: flag 'fleshKept' is set (at mech_604, mech_606) but never used by a require — only text may rely on it
- **INFO** `mech_604`: flag 'augHalf' is set (at mech_604) but never used by a require — only text may rely on it
- **INFO** `mech_701`: flag 'savedMenials' is set (at mech_701) but never used by a require — only text may rely on it
- **INFO** `mech_705`: flag 'vallenKey' is set (at mech_705) but never used by a require — only text may rely on it

Join nodes (≥3 different parents — check the text does not assume any single parent's events): mech_107, mech_504, mech_805

## Nodes

### mech_death_corruption · chundefined · daemon_world · 旁白 · **ENDING death**
你身体里的机器开始说另一种语言。它们不再听你的，也不再听万机之神的。 / 你的植入体长出了牙齿，血变成了黄铜色。 / 铸魔匠们会把你造成一台很好的引擎。
ending: 「黄铜之血」 cause: 被恶魔机械吞噬
flags on arrival — MUST: ∅ · MAY-only: apprentice, askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, initiate, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, vallenKey, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin

### mech_death_hp · chundefined · forge_floor · 旁白 · **ENDING death**
你倒在熔炉边。两个机仆停下来，评估你身上还有多少可回收零件。 / 不多。它们把你的植入体拆下来，整整齐齐码进回收箱。 / 剩下的部分，被归档为“耗材”。
ending: 「耗材」 cause: 倒在熔炉边
flags on arrival — MUST: ∅ · MAY-only: apprentice, askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, initiate, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, vallenKey, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin

### mech_death_sanity · chundefined · manufactorum · 旁白 · **ENDING death**
你开始只用二进制说话，后来只用二进制思考，最后只剩一串重复的数字。 / 神甫们检查了你，宣布你的心智“已格式化”。 / 转化线很欢迎你。这一次，你不用排队。
ending: 「已格式化」 cause: 心智崩溃，被格式化
flags on arrival — MUST: ∅ · MAY-only: apprentice, askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, initiate, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, vallenKey, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin

### mech_end_claim_khorne · chundefined · burning_city · 试射的鼓点 · time{d:20} · **ENDING bad**
你把卡宾枪焊在了手上，后来把整条胳膊换成了链锯。 / 格拉维克斯造的每一门炮你都想亲手试射，靶子从铁板变成了人。 / 血神不在乎你的植入体是什么型号，只在乎它们还在开火。
ending: 「试射」 cause: 化作恐虐的战争机器
on enter:   codex:god_khorne
flags on arrival — MUST: ∅ · MAY-only: apprentice, askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, initiate, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, vallenKey, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin

### mech_end_claim_nurgle · chundefined · forge_floor · 慈祥的锈 · time{d:30} · **ENDING bad**
你不再给机器上油。锈是温柔的，它让一切慢下来，却从不让它们停下。 / 第七熔炉开满了橙色的锈花，机仆们在花丛里哼歌，永远不会坏，也永远不会好。 / 慈父说，这才是不朽。
ending: 「锈花」 cause: 随锈蚀被纳垢收走
on enter:   codex:god_nurgle
flags on arrival — MUST: ∅ · MAY-only: apprentice, askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, initiate, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, vallenKey, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin

### mech_end_claim_slaanesh · chundefined · manufactorum · 下一个型号 · time{y:4} · **ENDING bad**
每一个植入体都很完美，直到你看见下一个型号。 / 你换了眼睛、手、心、声音，直到镜子里再没有一块原装零件。 / 你仍不满意。色孽最爱的，正是这种永远差一点的完美。
ending: 「下一个型号」 cause: 被色孽的完美收走
on enter:   codex:god_slaanesh
flags on arrival — MUST: ∅ · MAY-only: apprentice, askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, initiate, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, vallenKey, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin

### mech_end_claim_tzeentch · chundefined · tech_vault · 多出来的一行 · time{d:9} · **ENDING bad**
你终于补全了那块STC残片。缺的三成，是奸奇亲手填上的。 / 设计完美，能造出任何东西，可每造一件，图纸就改变一处。 / 你造了一辈子，从没造出过同一样东西。这正是他的计划。
ending: 「补全的残片」 cause: 被奸奇的答案收走
on enter:   codex:god_tzeentch
flags on arrival — MUST: ∅ · MAY-only: apprentice, askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, initiate, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, vallenKey, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin

### mech_101 · ch1 · forge_floor · 旁白
格拉维克斯，阿尔科萨星区唯一的铸造世界。天是红的，雨里有铁味。 / 你是第七熔炉的杂役，编号G7-2291。 / 配额板上，你的数字又是红的。三次红，就送去转化线。
on enter:   codex:place_gravex,mech_menials,place_arcosa
flags on arrival — MUST: origin_menial · MAY-only: ∅
  1. “去配额板前看个清楚” → mech_102
  2. “去找咳嗽的托宾” → mech_103

### mech_o_conscript_1 · ch1 · barracks · 凯什-43阿尔法
你抽中了护教军辅兵的签。手术只花了十分钟：后颈多了一个插槽。 / 凯什-43阿尔法插进一枚晶片，你突然不怕了，不怕得很奇怪。 / “恐惧已关闭，”她说，“以后由我决定你什么时候怕。”
on enter:   codex:mech_skitarii,place_gravex,place_arcosa
flags on arrival — MUST: origin_conscript · MAY-only: ∅
  1. “向她敬礼” → mech_o_conscript_2 eff{renown:3} ⇒ 你的手抬得太快，像被线拉着。凯什点头：“同步率良好。”
  2. “摸后颈的插槽” → mech_o_conscript_2 eff{sanity:-5} ⇒ 插槽是凉的。你摸到它时，晶片里的勇气轻轻颤了一下。

### mech_o_savant_1 · ch1 · hive_hab · 债务官
你在格拉维克斯的居住尖塔长大，念过三年经院，背得出四千位数字。 / 后来家里欠了神教的电费。 / 债务官翻开账本：“抵债。你的脑子，十年。”
on enter:   codex:place_gravex,place_arcosa
flags on arrival — MUST: origin_savant · MAY-only: ∅
  1. “签字” → mech_o_savant_2 eff{renown:3} ⇒ 签名时你顺手纠正了他账本上的一处加法。他没有谢你。
  2. “要求看合同细则” → mech_o_savant_2 eff{sanity:-5,set:{readContract:true}} ⇒ 细则第九条：若债务人失去计算价值，转作机仆抵偿余额。

### mech_102 · ch1 · forge_floor · 监工格里斯 · time{h:1}
监工格里斯用烙铁敲了敲你的数字。“两次红。” / 他身后，一台机仆推着矿车，脸上还留着一道你认识的伤疤。 / “再红一次，”他说，“你就再也不用吃饭了。”
from: mech_101 ⟵ “去配额板前看个清楚”
flags on arrival — MUST: origin_menial · MAY-only: ∅
certainly visited before (nearest 6): mech_101
  1. “连上两个班” → mech_104 eff{hp:-10,renown:3} ⇒ 你在熔炉边站了二十个小时。数字变黄了，手掌变黑了。
  2. “求他宽限几天” → mech_104 eff{sanity:-5} ⇒ 格里斯笑着在你的数字旁画了个小齿轮。“宽限已记录。利息另算。”
  3. “趁他转身，顺走格里斯腰带上的口粮券” → mech_104 eff{hp:5,renown:-2,set:{wronged_gries:true}} ⇒ 你摸走了格里斯腰带上的两张券。他回头摸了摸空腰带，目光在整条线上扫了一圈，在你的数字上停了一下。

### mech_103 · ch1 · forge_floor · 托宾 · time{h:1}
托宾把半块口粮掰给你。“瓦尔达的粮船再没来过，口粮又减了。” / 他咳得很厉害，数字和你一样红。 / “要是我先进转化线，”他说，“记得我会哼什么歌。”
from: mech_101 ⟵ “去找咳嗽的托宾”
flags on arrival — MUST: origin_menial · MAY-only: ∅
certainly visited before (nearest 6): mech_101
  1. “把口粮推回给他” → mech_104 eff{hp:-5,sanity:5,set:{tobinFriend:true,knowsTobin:true}} ⇒ 他推辞两次，第三次收下了，然后哼起那首歌，跑调跑得很认真。
  2. “收下，记住那首歌” → mech_104 eff{hp:5,set:{tobinFriend:true,knowsTobin:true}} ⇒ 口粮是灰的，有机油味。那首歌只有四个音，你记住了。
  3. “趁托宾咳嗽，把他那份口粮也拿走” → mech_104 eff{hp:5,sanity:-5,set:{knowsTobin:true,wronged_tobin:true}} ⇒ 托宾弯着腰咳，没有拦你。你嚼着他那份口粮，味道像机油，也像你欠他的什么。

### mech_o_conscript_2 · ch1 · ruins · 凯什-43阿尔法 · foe:gretchin · time{d:5}
实弹演练在渣场进行。靶子是活的：一群溜进来偷废料的绿皮小东西。 / “辐射卡宾枪，”凯什说，“别站在下风口。” / 一只小绿皮抱着半个齿轮，冲你做鬼脸。
on enter:   codex:xenos_ork
from: mech_o_conscript_1 ⟵ “向她敬礼” | mech_o_conscript_1 ⟵ “摸后颈的插槽”
flags on arrival — MUST: origin_conscript · MAY-only: ∅
certainly visited before (nearest 6): mech_o_conscript_1
  1. “开火” → mech_o_conscript_3 eff{hp:-10,renown:5,taint:{khorne:25}} ⇒ 你命中了。卡宾枪的辐射也命中了你，牙龈开始发麻。
  2. “朝天鸣枪吓走它” → mech_o_conscript_3 eff{renown:-3,sanity:5} ⇒ 小东西扔下齿轮逃了。凯什记录：“射击偏差：情感性。”

### mech_o_savant_2 · ch1 · manufactorum · 监工格里斯 · time{d:3}
你被分到第七熔炉，负责用眼睛给铆钉计数。 / 第三天你发现，配额板上的数比实际少一成。少掉的那一成，进了监工格里斯的口袋。 / 他注意到你在看。
on enter:   codex:mech_menials
from: mech_o_savant_1 ⟵ “签字” | mech_o_savant_1 ⟵ “要求看合同细则”
flags on arrival — MUST: origin_savant · MAY-only: readContract
certainly visited before (nearest 6): mech_o_savant_1
  1. “当面指出” → mech_o_savant_3 eff{renown:5,hp:-10} ⇒ 格里斯没否认，只罚你搬了一夜矿渣。第二天，你的数字是红的。
  2. “装作没看见” → mech_o_savant_3 eff{sanity:-5} ⇒ 你低头继续数。数字很准，良心不太准。
  3. “匿名举报格里斯克扣配额” → mech_o_savant_3 eff{renown:3,set:{wronged_gries:true}} ⇒ 巡查书记查了格里斯的账，罚了他三个月的烙铁津贴。他认得那手字：整座熔炉，只有你那样写小数点。

### mech_104 · ch1 · manufactorum · 铸工神甫鲁姆 · time{h:6} · eventRoll 0.3
冲压机停了，整条线跟着停。铸工神甫鲁姆绕着它摇香炉，念了三遍祷文。 / 它不动。 / “机魂受了冒犯，”他说，“有人在它面前说了脏话。”杂役们都低下了头。
on enter:   codex:mech_machine_spirit,imp_mechanicus
from: mech_102 ⟵ “连上两个班” | mech_102 ⟵ “求他宽限几天” | mech_102 ⟵ “趁他转身，顺走格里斯腰带上的口粮券” | mech_103 ⟵ “把口粮推回给他” | mech_103 ⟵ “收下，记住那首歌” | mech_103 ⟵ “趁托宾咳嗽，把他那份口粮也拿走”
flags on arrival — MUST: origin_menial · MAY-only: knowsTobin, tobinFriend, wronged_gries, wronged_tobin
certainly visited before (nearest 6): mech_101
  1. “跟着哼神甫的祷文” ROLL p=0.5+sanity ✓mech_105 ✗mech_106 ⇒✓ 你哼到第二句，冲压机打了个嗝，醒了。高处有一只镜头转向你。 ⇒✗ 你哼走了调。神甫瞪了你一眼，冲压机睡得更沉了。
  2. “按老杂役的规矩，拍它三下” → mech_105 eff{renown:3,set:{tapped:true}} ⇒ 左侧，右侧，再左侧。冲压机抖了抖，像被人挠醒。神甫假装没看见。
  3. “踢它一脚” → mech_106 eff{hp:-10,taint:{khorne:25}} ⇒ 你的脚趾比钢板先认输。疼痛让你想再踢一脚。

### mech_o_conscript_3 · ch1 · barracks · 凯什-43阿尔法 · time{d:10}
第十天，你的身体开始排斥插槽。后颈发烫，晶片里的命令变成了杂音。 / 凯什给你做了检测，没有表情。 / “组织排异。不适合护教军，”她说，“适合别的用途。”
on enter: {hp:-10}
from: mech_o_conscript_2 ⟵ “开火” | mech_o_conscript_2 ⟵ “朝天鸣枪吓走它”
flags on arrival — MUST: origin_conscript · MAY-only: ∅
certainly visited before (nearest 6): mech_o_conscript_2, mech_o_conscript_1
  1. ““我还能打！”” → mech_o_conscript_4 eff{renown:3,set:{noticed:true}} ⇒ 凯什停顿了一下，在你的档案里加了一行备注，没告诉你写了什么。
  2. ““什么用途？”” → mech_o_conscript_4 eff{sanity:-5} ⇒ 她指了指窗外。一列机仆推着矿车，步伐整齐，和护教军一模一样。

### mech_o_savant_3 · ch1 · tech_vault · 书记神甫奥西娅 · time{d:2}
一位书记神甫来熔炉借人：圣库的计算机坏了，需要有人心算校对。 / 奥西娅考了你一道题，又一道，又一道。 / “你的大脑，”她说，“是一台没装外壳的计算机。”
on enter:   codex:place_gravex_vault
from: mech_o_savant_2 ⟵ “当面指出” | mech_o_savant_2 ⟵ “装作没看见” | mech_o_savant_2 ⟵ “匿名举报格里斯克扣配额”
flags on arrival — MUST: origin_savant · MAY-only: readContract, wronged_gries
certainly visited before (nearest 6): mech_o_savant_2, mech_o_savant_1
  1. “答对，再指出她题里的错” → mech_o_savant_4 eff{renown:5,set:{noticed:true}} ⇒ 奥西娅沉默片刻，在数据板上记下你的编号。“我会再来借你。”
  2. “故意答错一题，免得惹眼” → mech_o_savant_4 eff{sanity:3} ⇒ 她点点头，把你送回熔炉。低调是一种安全，也是一种浪费。

### mech_105 · ch1 · manufactorum · 瓦伦贤者 · time{h:1}
一位贤者从步道上降下来，袍下伸出六根机械触手。 / “巧合是一个变量，”瓦伦贤者说，“我记录变量。” / 触手读走了你的编号。“送去转化线。评估。”
on enter: {renown:5,set:{noticed:true}}  codex:mech_magi
from: mech_104(success) ⟵ “跟着哼神甫的祷文” | mech_104 ⟵ “按老杂役的规矩，拍它三下”
flags on arrival — MUST: origin_menial · MAY-only: knowsTobin, tapped, tobinFriend, wronged_gries, wronged_tobin
certainly visited before (nearest 6): mech_104, mech_101
  1. “鞠躬” → mech_107 eff{renown:2} ⇒ 你鞠躬的角度大概不合规程，但贤者的镜头记下了它。
  2. “问他机魂是不是真的” → mech_107 eff{sanity:-3} ⇒ 贤者停了半秒。“问题已记录。答案需要更高权限。”

### mech_106 · ch1 · forge_floor · 监工格里斯 · time{d:2}
第三次红。格里斯亲手把你的数字从板上擦掉，像擦掉一点油污。 / 托宾的数字也没了。 / 两个护教军走过来，一左一右，步伐整齐得像同一个人。
on enter: {sanity:-5}
from: mech_104(fail) ⟵ “跟着哼神甫的祷文” | mech_104 ⟵ “踢它一脚”
flags on arrival — MUST: origin_menial · MAY-only: knowsTobin, tobinFriend, wronged_gries, wronged_tobin
certainly visited before (nearest 6): mech_104, mech_101
  1. “跟他们走” → mech_107
  2. “挣扎” → mech_107 eff{hp:-10} ⇒ 护教军没打你，只是握得更紧。他们的手是机器，不会累。

### mech_o_conscript_4 · ch1 · forge_floor · 旁白 · time{h:6}
他们拔掉了你的晶片。恐惧一下子全回来了，连同这十天欠下的份。 / 你被编进一队杂役，押往转化线。 / 队伍里有个咳嗽的人在哼歌，只有四个音。
on enter: {sanity:-5}
from: mech_o_conscript_3 ⟵ ““我还能打！”” | mech_o_conscript_3 ⟵ ““什么用途？””
flags on arrival — MUST: origin_conscript · MAY-only: noticed
certainly visited before (nearest 6): mech_o_conscript_3, mech_o_conscript_2, mech_o_conscript_1
  1. “问他叫什么” → mech_107 eff{set:{tobinFriend:true,knowsTobin:true}} ⇒ “托宾，”他说，“要是我先进去，记住这首歌。”
  2. “低头走路” → mech_107

### mech_o_savant_4 · ch1 · forge_floor · 监工格里斯 · time{d:4}
第三次红。格里斯擦掉你的数字时凑近说：“会数数的人，进了转化线也能数。” / 两个护教军一左一右架起你。 / 你开始默数步子：一百一十七步，到转化线。
on enter: {sanity:-5}
from: mech_o_savant_3 ⟵ “答对，再指出她题里的错” | mech_o_savant_3 ⟵ “故意答错一题，免得惹眼”
flags on arrival — MUST: origin_savant · MAY-only: noticed, readContract, wronged_gries
certainly visited before (nearest 6): mech_o_savant_3, mech_o_savant_2, mech_o_savant_1
  1. “继续数” → mech_107

### mech_107 · ch1 · manufactorum · 旁白 · time{h:3}
转化线前排着长队。手术台在尽头，上方挂着一排待装的机械臂。 / 排在你前面的杂役回头冲你笑了笑，开始哼一首只有四个音的歌。 / 轮到他了。然后，轮到你。
on enter:   codex:imp_servitor
from: mech_105 ⟵ “鞠躬” | mech_105 ⟵ “问他机魂是不是真的” | mech_106 ⟵ “跟他们走” | mech_106 ⟵ “挣扎” | mech_o_savant_4 ⟵ “继续数” | mech_o_conscript_4 ⟵ “问他叫什么” | mech_o_conscript_4 ⟵ “低头走路”
flags on arrival — MUST: ∅ · MAY-only: knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, readContract, tapped, tobinFriend, wronged_gries, wronged_tobin
  1. “报出贤者记下的编号” → mech_108 require{flag:noticed} eff{renown:5} ⇒ 神甫查了查数据圈，把你推向另一扇门。前面那个人没有回头。
  2. “背出一段刚听来的祷文” ROLL p=0.55+sanity ✓mech_108 ✗mech_109 ⇒✓ 你背得磕磕巴巴，但每个音都对。神甫歪了歪头，记下一笔。 ⇒✗ 你背错了一个音。神甫连头都没抬。
  3. “把前面那人往后拽” → mech_109 eff{hp:-10,sanity:-5,set:{pulledTobin:true}} ⇒ 你拽住他的袖子。护教军把你们分开，像拆开两根缠住的电线。
  4. “把托宾往前推，抢出十分钟” → mech_109 require{flag:knowsTobin} eff{sanity:-5,set:{wronged_tobin:true}} ⇒ 你把托宾往前一推。他回头看你，没生气，像早就料到，然后继续哼歌。你多出了十分钟，他多出了一张台。

### mech_108 · ch1 · tech_vault · 书记神甫奥西娅 · time{d:1}
“书记神甫奥西娅，”她说，“现在你是我的杂役。别感动，我只是缺个会数数的。” / 第七圣库里堆满了没人读过的数据板。 / “按神圣顺序排好。哪种顺序？你自己猜。”
on enter: {set:{apprentice:true}}  codex:place_gravex_vault
from: mech_107 ⟵ “报出贤者记下的编号” | mech_107(success) ⟵ “背出一段刚听来的祷文” | mech_109 ⟵ ““我还会数别的！”” | mech_109 ⟵ ““也看看前面那个人！””
flags on arrival — MUST: ∅ · MAY-only: askedTobin, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, pulledTobin, readContract, tapped, tobinFriend, wronged_gries, wronged_tobin
certainly visited before (nearest 6): mech_107
  1. “按日期排” → mech_201 eff{renown:3} ⇒ 你排了三天。奥西娅检查了一遍，没有夸你，只是又搬来三箱。
  2. “按灰尘的厚度排” → mech_201 eff{sanity:5} ⇒ 奥西娅看了很久。“灰尘也是时间。这个答案……可以接受。”

### mech_109 · ch1 · manufactorum · 书记神甫奥西娅 · time{h:1}
你被按上手术台。一个戴单片镜的书记神甫路过，停下来看了看你的手。 / “这只手在桌面上数铆钉，”她说，“数得比计算机快。谁送它来的？” / 手术锯停在半空。
from: mech_107(fail) ⟵ “背出一段刚听来的祷文” | mech_107 ⟵ “把前面那人往后拽” | mech_107 ⟵ “把托宾往前推，抢出十分钟”
flags on arrival — MUST: ∅ · MAY-only: knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, pulledTobin, readContract, tapped, tobinFriend, wronged_gries, wronged_tobin
certainly visited before (nearest 6): mech_107
  1. ““我还会数别的！”” → mech_108 eff{renown:3} ⇒ 她挑了挑眉，把你从台上拉下来。“证明给我看。”
  2. ““也看看前面那个人！”” → mech_108 eff{sanity:-5,set:{askedTobin:true}} ⇒ 她看了一眼隔壁台。“那一个已经开始了。”她的声音没有起伏，只是走得快了些。
  3. “闭上眼，不挣扎了” → mech_end_servitor require[{notFlag:origin_conscript},{stat:hp,max:80}] eff{sanity:-10} ⇒ 你闭上眼。锯子重新转起来，那首四个音的歌越来越远。
  4. “任由恐惧把你淹没” → mech_end_servitor require[{flag:origin_conscript},{stat:sanity,max:70}] eff{sanity:-10} ⇒ 没有晶片替你关掉恐惧了。你抖得说不出话，神甫把这记录为“同意”。

### mech_end_servitor · ch1 · forge_floor · 无名机仆 · time{d:3} · **ENDING bad**
你醒来时，已经不再需要醒来。 / 你的编号牌上有一串数字。你推着矿车，步伐整齐。 / 隔壁的机仆在哼一首四个音的歌。你不知道为什么，也跟着哼了起来。
ending: 「一串数字」 cause: 被改造成机仆
from: mech_109 ⟵ “闭上眼，不挣扎了” | mech_109 ⟵ “任由恐惧把你淹没”
flags on arrival — MUST: ∅ · MAY-only: knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, pulledTobin, readContract, tapped, tobinFriend, wronged_gries, wronged_tobin
certainly visited before (nearest 6): mech_109, mech_107

### mech_201 · ch2 · tech_vault · 书记神甫奥西娅 · time{d:20}
二十天后，你学会了十六句二进制祷词。奥西娅说，这相当于会说“你好”和“请原谅我”。 / “机器能听懂你了，”她说，“但它不一定原谅你。”
on enter:   codex:mech_noosphere
from: mech_108 ⟵ “按日期排” | mech_108 ⟵ “按灰尘的厚度排”
flags on arrival — MUST: apprentice · MAY-only: askedTobin, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, pulledTobin, readContract, tapped, tobinFriend, wronged_gries, wronged_tobin
certainly visited before (nearest 6): mech_108, mech_107
  1. “通宵练习二进制” → mech_202 eff{sanity:-3,renown:5} ⇒ 你在梦里也用0和1说话。醒来时，你的牙齿在打拍子。
  2. “问她机仆还记不记得从前” → mech_202 eff{set:{askedServitor:true}} ⇒ 奥西娅停下笔。“正式答案：不记得。”她顿了顿，“非正式答案：去问问它们。”

### mech_202 · ch2 · forge_floor · T-0B1N · time{h:4}
一台机仆在熔炉边搬钢锭，编号牌上写着T-0B1N。是转化线上排在你前面的那个人。 / 它的嘴不会说话了，喉咙里却在哼一首歌。四个音，跑调跑得很认真。 / 它没有看你。
(grudgeLine gries: 这是格里斯监工管的炉子。他叉着手站在炉口，目光钉在你身上。)
on enter:   codex:mech_menials
from: mech_201 ⟵ “通宵练习二进制” | mech_201 ⟵ “问她机仆还记不记得从前”
flags on arrival — MUST: apprentice · MAY-only: askedServitor, askedTobin, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, pulledTobin, readContract, tapped, tobinFriend, wronged_gries, wronged_tobin
certainly visited before (nearest 6): mech_201, mech_108, mech_107
  1. “跟着哼” → mech_203 eff{sanity:5,set:{tobinSong:true,keeper:true}} grudge(gries) ⇒ 你哼第二遍时，它的手停了半秒。只有半秒。然后钢锭继续往前走。
  2. “别过脸去” → mech_203 eff{sanity:-5} ⇒ 歌声一直跟着你，直到被熔炉的轰鸣吞掉。
  3. “替它擦掉脸上的油” → mech_203 eff{hp:-5,sanity:3,set:{tobinSong:true,keeper:true}} ⇒ 钢锭的热度隔着布烫伤了你的手。它的脸干净了。它不会知道。

### mech_203 · ch2 · tech_vault · 瓦伦贤者 · time{d:3}
瓦伦贤者让你抄录一块残片：标准模板构造，黑暗科技时代的遗物，缺了三成。 / “我们不发明，”他说，“我们回忆。人类曾经知道一切，后来忘了。” / “我们的工作是把它想起来。”
on enter:   codex:mech_stc,mech_quest_knowledge
from: mech_202 ⟵ “跟着哼” | mech_202 ⟵ “别过脸去” | mech_202 ⟵ “替它擦掉脸上的油”
flags on arrival — MUST: apprentice · MAY-only: askedServitor, askedTobin, keeper, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, pulledTobin, readContract, tapped, tobinFriend, tobinSong, wronged_gries, wronged_tobin
certainly visited before (nearest 6): mech_202, mech_201, mech_108, mech_107
  1. “一笔一画照抄” → mech_204 eff{renown:5} ⇒ 你连残片上的划痕都抄了下来。贤者说，划痕也可能是神圣的。
  2. ““缺的部分，为什么不自己补？”” → mech_204 eff{renown:-3,set:{askedNew:true}} ⇒ 贤者的触手全停住了。“上一个问这个问题的人，现在在搬钢锭。”

### mech_204 · ch2 · tech_vault · 书记神甫奥西娅 · time{d:6}
深夜，奥西娅给你看一个小东西：一把她自己设计的扳手，能拧七种规格的螺栓。 / 没有STC，没有先例。是她想出来的。 / “它很好用，”她低声说，“这就是异端。”
on enter:   codex:mech_tech_heresy
from: mech_203 ⟵ “一笔一画照抄” | mech_203 ⟵ ““缺的部分，为什么不自己补？””
flags on arrival — MUST: apprentice · MAY-only: askedNew, askedServitor, askedTobin, keeper, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, pulledTobin, readContract, tapped, tobinFriend, tobinSong, wronged_gries, wronged_tobin
certainly visited before (nearest 6): mech_203, mech_202, mech_201, mech_108, mech_107
  1. “帮她改进设计” → mech_205 eff{renown:3,set:{ossiaFriend:true},taint:{tzeentch:25}} ⇒ 你们改到天亮。第八种规格成功时，你笑出了声，把自己吓了一跳。
  2. “劝她熔掉它” → mech_205 eff{set:{ossiaWarned:true}} ⇒ 她沉默很久，把扳手放进抽屉。没熔，也没再拿出来。
  3. “报告瓦伦贤者” → mech_206 eff{renown:10,sanity:-10,set:{reportedOssia:true,wronged_ossia:true}} ⇒ 贤者听完，只说了一个词：“确认。”那晚圣库的门第一次在你身后锁上。

### mech_205 · ch2 · tech_vault · 凯什-43阿尔法 · time{d:2} · eventRoll 0.35
护教军包围了圣库。凯什-43阿尔法宣布：“侦测到未授权设计。技术异端。” / 她的辐射卡宾枪扫过每一张脸，在你脸上多停了一秒。 / 奥西娅的抽屉就在你身后。
on enter:   codex:mech_skitarii
from: mech_204 ⟵ “帮她改进设计” | mech_204 ⟵ “劝她熔掉它”
flags on arrival — MUST: apprentice · MAY-only: askedNew, askedServitor, askedTobin, keeper, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaWarned, pulledTobin, readContract, tapped, tobinFriend, tobinSong, wronged_gries, wronged_tobin
certainly visited before (nearest 6): mech_204, mech_203, mech_202, mech_201, mech_108, mech_107
  1. “平静地说谎” ROLL p=0.5+sanity ✓mech_207 ✗mech_206 ⇒✓ “这里只有档案，阿尔法。”你的声音稳得像校准过的机器。她走了。 ⇒✗ 你说谎时眨了一下眼。凯什的镜头捕捉到了。抽屉被拉开了。
  2. ““是我做的。”” → mech_207 eff{hp:-15,renown:-5,set:{tookBlame:true,ossiaFriend:true}} ⇒ 电鞭抽了你十二下，每下都很准。奥西娅在旁边看着，指甲掐进手心。
  3. “看向奥西娅，把她交出去” → mech_206 eff{sanity:-5,set:{wronged_ossia:true}} ⇒ 你什么也没说，只是看了奥西娅一眼。对凯什来说，一眼就够了。

### mech_206 · ch2 · tech_vault · 瓦伦贤者 · time{d:1}
审判很快。奥西娅被剥夺职衔，发配到外围熔炉做忏悔劳役。 / 她被带走时没有看你。 / 瓦伦贤者把她的单片镜交给你。“职位空缺，”他说，“效率要求填补。”
on enter: {renown:5,sanity:-5,set:{ossiaGone:true}}
from: mech_204 ⟵ “报告瓦伦贤者” | mech_205(fail) ⟵ “平静地说谎” | mech_205 ⟵ “看向奥西娅，把她交出去”
flags on arrival — MUST: apprentice · MAY-only: askedNew, askedServitor, askedTobin, keeper, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_204, mech_203, mech_202, mech_201, mech_108, mech_107
  1. “戴上单片镜” → mech_207 eff{renown:3} ⇒ 镜片里还留着她的校准参数。整个世界看起来都有点歪。
  2. “收起来，不戴” → mech_207 eff{sanity:3} ⇒ 你把它放进口袋。它很沉，比它该有的重量沉。

### mech_207 · ch2 · forge_floor · 电祭司 · time{d:10}
格拉维克斯的建厂日。电祭司们赤着上身走过熔炉，皮肤上爬满蓝色电弧。 / 人群伸手去碰，被电得倒地，又爬起来笑。 / 一位电祭司向你伸出手：“原动力在召唤你。”
on enter:   codex:mech_electro_priests
from: mech_205(success) ⟵ “平静地说谎” | mech_205 ⟵ ““是我做的。”” | mech_206 ⟵ “戴上单片镜” | mech_206 ⟵ “收起来，不戴”
flags on arrival — MUST: apprentice · MAY-only: askedNew, askedServitor, askedTobin, keeper, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, tookBlame, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_204, mech_203, mech_202, mech_201, mech_108, mech_107
  1. “握住那只手” → mech_208 eff{hp:-8,renown:5,sanity:5} ⇒ 你醒来时躺在地上，头发竖着，心跳像一台新校准的泵。周围的人在鼓掌。
  2. “鞠躬，退后” → mech_208 eff{renown:-2} ⇒ 电祭司收回手，没生气。“下次。”他的指尖在空气里留下焦味。

### mech_208 · ch2 · mars_vista · 火星的广播 · time{h:2}
节日的高潮：一段来自火星的广播，在数据圈里迟到了四十年。 / 画面里，红色星球被熔炉的光环包围。一个声音宣读铸造将军的诏令：什一税提高，祈祷加倍。 / 全场的神甫同时跪下。
on enter:   codex:place_mars,mech_fabricator_general
from: mech_207 ⟵ “握住那只手” | mech_207 ⟵ “鞠躬，退后”
flags on arrival — MUST: apprentice · MAY-only: askedNew, askedServitor, askedTobin, keeper, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, tookBlame, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_207, mech_204, mech_203, mech_202, mech_201, mech_108
  1. “问身边的神甫：火星听帝皇的吗” → mech_209 eff{set:{askedTreaty:true}} ⇒ 神甫想了想。“火星听万机之神的。帝皇就是万机之神。所以……是的。大概。”
  2. “跟着跪下” → mech_209 eff{renown:3} ⇒ 地板是热的。四十年前的声音在你头顶念完了最后一个数字。

### mech_209 · ch2 · tech_vault · 瓦伦贤者 · time{d:5}
瓦伦贤者召见你。“帝皇登上火星，我们认出了他，订立了奥林匹斯条约。” / “火星给帝国枪炮，帝国给火星自由。今天，我们的激光枪还在运往奥雷克斯二号。” / “你可以申请入教了。”
on enter:   codex:mech_treaty_olympus,place_aurex
from: mech_208 ⟵ “问身边的神甫：火星听帝皇的吗” | mech_208 ⟵ “跟着跪下”
flags on arrival — MUST: apprentice · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, keeper, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, tookBlame, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_208, mech_207, mech_204, mech_203, mech_202, mech_201
  1. “背出整座圣库的索引” → mech_301 require{flag:origin_savant} eff{renown:10} ⇒ 你背了四十分钟。贤者听完，第一次用“我们”称呼你。
  2. ““我申请。”” → mech_301 eff{renown:5} ⇒ 贤者在数据圈里给你开了新档案。名字一栏，暂时空着。
  3. ““入教要换掉多少肉？”” → mech_301 eff{sanity:-5} ⇒ “第一次，一点点，”他说，“之后，取决于你有多想靠近神。”

### mech_301 · ch3 · manufactorum · 瓦伦贤者 · time{d:14}
入教仪式。焚香呛得你流泪，十二位神甫用二进制合唱，赞美万机之神。 / 瓦伦贤者举着三样东西：一只光学眼、一根机械触手、一块空白的铭牌。 / “第一次改造。选一样，或者选择不选。”
on enter:   codex:mech_omnissiah
from: mech_209 ⟵ “背出整座圣库的索引” | mech_209 ⟵ ““我申请。”” | mech_209 ⟵ ““入教要换掉多少肉？””
flags on arrival — MUST: apprentice · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, keeper, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, tookBlame, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_209, mech_208, mech_207, mech_204, mech_203, mech_202
  1. “光学眼” → mech_302 eff{hp:-10,renown:5,set:{aug:true}} ⇒ 旧眼睛被取走时不疼。疼的是新眼睛第一次看见你自己的数据。
  2. “机械触手” → mech_302 eff{hp:-15,renown:8,set:{aug:true}} ⇒ 触手接上脊椎的那一刻，你多了一只手，也多了一种挠不到的痒。
  3. “空白铭牌：暂时不改” → mech_302 eff{renown:-5,set:{fleshFirst:true}} ⇒ 合唱停了一拍。瓦伦贤者把铭牌交给你：“血肉是一种拖延。”

### mech_302 · ch3 · manufactorum · 旁白 · time{d:3}
新的你需要磨合。夜里，你听见身体里有两种声音：心跳，和风扇。 / 其他初学者在比较植入体的型号，像比较勋章。 / 有人说，火星上的贤者全身没有一块原装零件。
from: mech_301 ⟵ “光学眼” | mech_301 ⟵ “机械触手” | mech_301 ⟵ “空白铭牌：暂时不改”
flags on arrival — MUST: apprentice · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, fleshFirst, keeper, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, tookBlame, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_301, mech_209, mech_208, mech_207, mech_204, mech_203
  1. “申请一个更好的型号” → mech_303 eff{hp:-5,renown:3,taint:{slaanesh:40}} ⇒ 新型号更安静、更精准。你盯着它看了很久，想象下一个会有多完美。
  2. “念点火祷文，安抚新零件” → mech_303 eff{sanity:5} ⇒ 你念了七遍。风扇和心跳慢慢对上了拍子。

### mech_303 · ch3 · barracks · 凯什-43阿尔法 · time{d:2}
你被派给凯什-43的护教军分队当书记。她九成是机器，剩下一成归教条晶片管。 / “圣库，”她说，“我见过你。我记得所有见过的东西。” / 听起来不像是在夸自己。
on enter:   codex:mech_skitarii
from: mech_302 ⟵ “申请一个更好的型号” | mech_302 ⟵ “念点火祷文，安抚新零件”
flags on arrival — MUST: apprentice · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, fleshFirst, keeper, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, tookBlame, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_302, mech_301, mech_209, mech_208, mech_207, mech_204
  1. ““你记得自己的名字吗？”” → mech_304 eff{sanity:-5,set:{keshTalk:true}} ⇒ 她停了三秒，对护教军来说很久。“名字字段已覆写。保留一个音节：‘凯’。”
  2. “专心记录分队数据” → mech_304 eff{renown:3} ⇒ 报表一个数都没错。凯什把它转发给瓦伦贤者，附言：可用。
  3. ““我认识这种晶片。”” → mech_304 require{flag:origin_conscript} eff{renown:5,set:{keshTalk:true}} ⇒ 凯什看了看你后颈的伤疤。“排异者。”她停了停，“你比大多数人撑得久。”

### mech_304 · ch3 · ruins · 数据铸匠赫隆 · foe:kastelan_robot · time{d:4}
渣场试炮。一台卡斯特兰机器人站在那里，高得像钟楼。 / 数据铸匠赫隆往它胸口插指令晶片：“它只做晶片说的事。它不许思考。思考是罪。” / 机器人的头微微转向你，像在等你开口。
on enter:   codex:mech_kastelan
from: mech_303 ⟵ ““你记得自己的名字吗？”” | mech_303 ⟵ “专心记录分队数据” | mech_303 ⟵ ““我认识这种晶片。””
flags on arrival — MUST: apprentice · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, tookBlame, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_303, mech_302, mech_301, mech_209, mech_208, mech_207
  1. “替赫隆校对指令” ROLL p=0.55+renown ✓mech_305 ✗mech_306 ⇒✓ 指令无误。机器人举拳，把靶子砸进了地里。赫隆点头。 ⇒✗ 你漏了一个分号。机器人转身，朝错误的方向开了火。
  2. “对它的机魂念祷文” → mech_305 eff{sanity:-3,renown:3} ⇒ 机器人听完，胸口的灯闪了两下。赫隆说这是故障。你不太确定。
  3. “请求亲手试射” → mech_305 eff{hp:-5,renown:3,taint:{khorne:30}} ⇒ 后坐力把你掀翻在地。你爬起来的第一个念头是：再来一次。

### mech_305 · ch3 · ruins · 凯什-43阿尔法 · time{h:2}
试炮结束。凯什的分队列队向机器人致敬。 / “它比我们老，”她说，“它打过我们没打过的仗，可它不知道自己打过。” / “这算幸运吗？”她问。没人回答。
from: mech_304(success) ⟵ “替赫隆校对指令” | mech_304 ⟵ “对它的机魂念祷文” | mech_304 ⟵ “请求亲手试射”
flags on arrival — MUST: apprentice · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, tookBlame, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_304, mech_303, mech_302, mech_301, mech_209, mech_208
  1. ““我觉得是。”” → mech_307 eff{sanity:3} ⇒ 凯什点头。“记录：书记神甫倾向于不记得。”
  2. ““我觉得不是。”” → mech_307 eff{sanity:-3,set:{keshTalk:true}} ⇒ 凯什沉默片刻，把这句话存了档。“我也这么计算。”

### mech_306 · ch3 · ruins · 数据铸匠赫隆 · foe:kastelan_robot · time{h:1}
炮弹落在观礼台边上。弹片飞过时，你听见赫隆在喊一个分号。 / 你趴在渣堆里，耳朵嗡嗡作响，在流血。 / 机器人停了火，安静地站着，像在为自己做错的事发呆。
on enter: {hp:-12}
from: mech_304(fail) ⟵ “替赫隆校对指令”
flags on arrival — MUST: apprentice · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, tookBlame, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_304, mech_303, mech_302, mech_301, mech_209, mech_208
  1. “爬起来，修正指令” → mech_307 eff{renown:3} ⇒ 你改好了分号。机器人重新开火，这次命中。赫隆没说谢谢。

### mech_307 · ch3 · tech_vault · 考尔的数据包 · time{d:20}
圣库收到一份数据包，署名是火星的大贤者贝利撒留·考尔：索要星区内所有STC残片的副本。 / 瓦伦贤者读完，触手不安地卷了起来。 / “考尔‘重新发现’的东西，”他说，“多得不像重新发现。”
on enter:   codex:mech_cawl
from: mech_306 ⟵ “爬起来，修正指令” | mech_305 ⟵ ““我觉得是。”” | mech_305 ⟵ ““我觉得不是。””
flags on arrival — MUST: apprentice · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, tookBlame, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_304, mech_303, mech_302, mech_301, mech_209, mech_208
  1. ““那不就是发明吗？”” → mech_308 eff{renown:-2,set:{askedNew:true}} ⇒ 贤者盯着你。“大贤者发明，叫启示。书记神甫发明，叫异端。”
  2. “加急发出副本” → mech_308 eff{renown:5} ⇒ 三天后回执到了，只有一个字：“谢。”后面跟着十七页新的请求。

### mech_308 · ch3 · manufactorum · 瓦伦贤者 · time{d:10} · eventRoll 0.35
立誓之夜。你跪在熔炉前，念自己写的誓词：肉体会疲倦，机器会坚持；知识属于神，你只是抄写员。 / 瓦伦贤者在你额头点了一滴圣油。 / 从今天起，你是神教的初学者。
on enter: {set:{initiate:true}}
from: mech_307 ⟵ ““那不就是发明吗？”” | mech_307 ⟵ “加急发出副本”
flags on arrival — MUST: apprentice · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, tookBlame, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_307, mech_304, mech_303, mech_302, mech_301, mech_209
  1. “全心全意地发誓” → mech_309 eff{renown:8,sanity:-3} ⇒ 誓词说完，你觉得自己轻了一点。也许是灵魂，也许只是一部分怀疑。
  2. “发誓，但在心里留一句保留” → mech_309 eff{sanity:5,set:{doubter:true}} ⇒ 你在心里加了一句：“除非神错了。”圣油顺着眉毛流下来，很凉。

### mech_309 · ch3 · ship_interior · 瓦伦贤者 · time{d:30}
探索舰队到了，缺书记神甫。瓦伦贤者填上了你的名字。 / “忒萨零号的考察是格拉维克斯出的钱，”他说，“维克崔斯-9贤者至今没有回来。” / “这次去G-7号卫星。带回知识，或者带回你自己。”
on enter:   codex:mech_explorators,place_thessa_null
from: mech_308 ⟵ “全心全意地发誓” | mech_308 ⟵ “发誓，但在心里留一句保留”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, doubter, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, tookBlame, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_308, mech_307, mech_304, mech_303, mech_302, mech_301
  1. ““哪个优先？”” → mech_401 eff{sanity:-3} ⇒ 贤者想了想。“知识。但我会为另一个结果预留一个档案位。”
  2. “领命” → mech_401 eff{renown:3} ⇒ 你领到一个新编号、一件不合身的探索者斗篷，和一份遗嘱模板。

### mech_401 · ch4 · ship_interior · 探索贤者卡兰提斯 · time{d:40,warp:true}
探索贤者卡兰提斯有四条腿、两个大脑，其中一个专门用来好奇。 / “G-7的墓穴可能比人类还老，”她说，“老东西知道得多。我想知道它知道什么。” / 舰船在亚空间里颠了一下。
on enter: {hp:15}
from: mech_309 ⟵ ““哪个优先？”” | mech_309 ⟵ “领命”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, doubter, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, tookBlame, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_309, mech_308, mech_307, mech_304, mech_303, mech_302
  1. ““它会愿意被知道吗？”” → mech_402 eff{sanity:-3} ⇒ 卡兰提斯的两个大脑讨论了一会儿。“无关紧要。”她们一致决定。
  2. “帮她整理探测数据” → mech_402 eff{renown:3} ⇒ 你把三千份扫描按热度排好。最热的那一点，在金字塔正中央。

### mech_402 · ch4 · tomb_exterior · 探索贤者卡兰提斯 · time{d:2}
G-7上空无一物，只有一座黑色金字塔，符文发着淡绿的光。 / 护教军在四周布防。卡兰提斯的伺服颅骨绕着塔尖飞，像一群好奇的苍蝇。 / “扫描铭文，”她说，“全部。”
on enter:   codex:place_tomb_moon,nec_necrons
from: mech_401 ⟵ ““它会愿意被知道吗？”” | mech_401 ⟵ “帮她整理探测数据”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, doubter, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, tookBlame, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_401, mech_309, mech_308, mech_307, mech_304, mech_303
  1. “把铭文导入植入体” → mech_403 eff{renown:5,sanity:-5,taint:{tzeentch:25}} ⇒ 符文流进你的脑子，冰得发甜。有几行你看懂了，你宁愿没看懂。
  2. “跟护教军一起守外围” → mech_403 eff{hp:-5} ⇒ 沙子冷得像金属屑。夜里，金字塔低声嗡鸣，像一台待机的发动机。

### mech_403 · ch4 · tomb_interior · 探索贤者卡兰提斯 · time{h:8}
墓道里整整齐齐站着几千具金属骷髅，一动不动。 / 卡兰提斯用熔切器切开一具，切口在她眼前慢慢合拢。 / “自我修复！”她的两个大脑同时尖叫，“带回去，全部带回去！”
on enter:   codex:nec_living_metal
from: mech_402 ⟵ “把铭文导入植入体” | mech_402 ⟵ “跟护教军一起守外围”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, doubter, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, tookBlame, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_402, mech_401, mech_309, mech_308, mech_307, mech_304
  1. ““它们只是在睡觉。”” → mech_404 eff{renown:3,set:{warnedTomb:true}} ⇒ 卡兰提斯把你的意见归档为：“胆怯，但可能正确。”
  2. “帮她拆一具下来” → mech_404 eff{renown:5,hp:-5} ⇒ 金属在你手里发热，好像不太愿意被拆。

### mech_404 · ch4 · tomb_interior · 凯什-43阿尔法 · foe:necron_warrior · time{h:2} · eventRoll 0.35
所有骷髅的眼睛同时亮了。 / 它们一齐迈步，像阅兵的队伍。护教军开火，骷髅倒下，又站起来。 / “撤退协议！”凯什喊，“书记神甫，带上数据核心！”
on enter:   codex:nec_canoptek
from: mech_403 ⟵ ““它们只是在睡觉。”” | mech_403 ⟵ “帮她拆一具下来”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, doubter, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_403, mech_402, mech_401, mech_309, mech_308, mech_307
  1. “抱起数据核心就跑” ROLL p=0.5+hp ✓mech_405 ✗mech_406 ⇒✓ 你冲出墓道，数据核心在怀里烫得像一块炭。 ⇒✗ 绿光削过你的后背。你摔倒了，数据核心滚了出去。
  2. “掩护后面的机仆” → mech_405 eff{hp:-10,renown:3,set:{savedServitors:true}} ⇒ 你把三个机仆推进运输车。它们不会感谢你，但它们记得路线。
  3. “躲进冷却液池” → mech_405 eff{hp:-5,sanity:-5,taint:{nurgle:35}} ⇒ 冷却液是温的，黏的，有点甜。你泡了一小时，爬出来时皮肤上长了一层膜。

### mech_405 · ch4 · tomb_exterior · 探索贤者卡兰提斯 · time{h:1}
运输艇的舱门正在关闭。卡兰提斯站在墓道口，没有上船。 / “还有一个墓室，”她说，“只看一眼。” / 她走回了黑暗里。舱门合上了。
from: mech_404(success) ⟵ “抱起数据核心就跑” | mech_404 ⟵ “掩护后面的机仆” | mech_404 ⟵ “躲进冷却液池” | mech_406 ⟵ “爬向出口”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, doubter, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_404, mech_403, mech_402, mech_401, mech_309, mech_308
  1. ““贤者！”” → mech_407 eff{sanity:-5} ⇒ 她没回头。伺服颅骨跟了进去，像一群忠诚的狗。
  2. “记下她最后的坐标” → mech_407 eff{renown:3} ⇒ 坐标很精确。你知道它不会再变了。

### mech_406 · ch4 · tomb_interior · 旁白 · foe:canoptek_scarab · time{h:1}
一群金属甲虫爬上你的身体。它们不咬肉，只吃金属。 / 皮带扣、工具、植入体的外壳，一样一样被拆走。 / 它们拆得很仔细，像在给你做一次免费维修。
on enter: {hp:-12}
from: mech_404(fail) ⟵ “抱起数据核心就跑”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, doubter, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_404, mech_403, mech_402, mech_401, mech_309, mech_308
  1. “爬向出口” → mech_405 eff{sanity:-5} ⇒ 你爬出来时轻了好几斤。剩下的，都是原装的。

### mech_407 · ch4 · ship_interior · 旁白 · time{h:6}
舰船逃离G-7。通讯频道里传来卡兰提斯的最后一段数据，断断续续： / “补充记录：它们不是机器。它们曾经是——” / 然后是一长串零。
on enter: {sanity:-5}
from: mech_405 ⟵ ““贤者！”” | mech_405 ⟵ “记下她最后的坐标”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, doubter, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_405, mech_404, mech_403, mech_402, mech_401, mech_309
  1. “把遗言存进圣库” → mech_408 eff{renown:5} ⇒ 你给文件加了个标签：未完成。所有好问题都该有这个标签。
  2. “删掉损坏的文件” → mech_408 eff{sanity:5,renown:-3} ⇒ 文件消失了。那串零还在你脑子里响了很多天。

### mech_408 · ch4 · ship_interior · 凯什-43阿尔法 · time{d:30,warp:true}
货舱里，带回来的死灵金属在自我修复，长出了细小的纹路。舰船的机魂不安地闪着灯。 / 凯什拿枪对着它。“它在学习我们的船。” / “扔出去，”她说，“或者你负责。”
from: mech_407 ⟵ “把遗言存进圣库” | mech_407 ⟵ “删掉损坏的文件”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, doubter, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_407, mech_405, mech_404, mech_403, mech_402, mech_401
  1. “扔进虚空” → mech_409 eff{renown:-3,sanity:5} ⇒ 金属在舱外翻滚。最后一刻，它朝舰船伸出了一根细丝。
  2. “封进铅箱带回去” → mech_409 eff{renown:8,set:{crystal:true},taint:{tzeentch:15}} ⇒ 箱子上贴了七道封条。每天夜里，你都能听见它在里面重新排列自己。

### mech_409 · ch4 · burning_city · 瓦伦贤者 · time{d:5}
舰船回到格拉维克斯，看见的是浓烟。 / 外围熔炉在燃烧，天上落着绿色的登陆舱，歪歪扭扭，像用废铁焊的。 / 瓦伦贤者的声音响彻数据圈：“兽人。它们在偷东西。偷一切。”
on enter:   codex:xenos_ork
from: mech_408 ⟵ “扔进虚空” | mech_408 ⟵ “封进铅箱带回去”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, crystal, doubter, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_408, mech_407, mech_405, mech_404, mech_403, mech_402
  1. “降落” → mech_501

### mech_501 · ch5 · burning_city · 旁白 · foe:ork · time{h:3}
兽人从星区边缘飘过来，像一场绿色的冰雹。 / 它们不占领，不谈判。拆传送带，扛发电机，把神甫的香炉戴在头上当帽子。 / 一个兽人抱着一台冲压机跑过街角，笑得很开心。
on enter:   codex:xenos_waaagh
from: mech_409 ⟵ “降落”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, crystal, doubter, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_409, mech_408, mech_407, mech_405, mech_404, mech_403
  1. “去护教军的防线” → mech_502
  2. “去抢救圣库” → mech_503

### mech_502 · ch5 · ruins · 凯什-43阿尔法 · foe:ork_nob · time{h:1}
凯什的分队守在第三熔炉前。对面冲来一个兽人头目，比卡斯特兰矮不了多少，挥着链锯斧。 / “书记神甫，”凯什说，“我需要火力校准，或者需要一个人。” / 她等你选。
from: mech_501 ⟵ “去护教军的防线”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, crystal, doubter, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_501, mech_409, mech_408, mech_407, mech_405, mech_404
  1. “拿起卡宾枪顶上去” → mech_504 eff{hp:-12,renown:5,taint:{khorne:30}} ⇒ 你打空了一个弹匣。头目倒下前咧嘴冲你笑，像在说：好玩。
  2. “接入火炮，计算弹道” ROLL p=0.5+renown ✓mech_504 ✗mech_505 ⇒✓ 第一发就命中。头目连同半堵墙一起不见了。凯什给你发了个二进制的赞。 ⇒✗ 你算错了风速。炮弹落在自己阵地前，气浪把你掀进了兽人堆里。
  3. ““老规矩，阿尔法。”” → mech_504 require{flag:origin_conscript} eff{hp:-5,renown:8} ⇒ 凯什的晶片和你后颈的旧伤同时一热。你们像同一台机器的两只手那样开火。

### mech_503 · ch5 · manufactorum · 旁白 · foe:gretchin · time{h:1}
圣库门口，一个小绿皮抱着神甫的香炉往外跑，后面三个扛着一卷数据线。 / 它们看见你，愣住了。 / 领头的把香炉举起来，好像在问：换不换？
from: mech_501 ⟵ “去抢救圣库”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, crystal, doubter, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_501, mech_409, mech_408, mech_407, mech_405, mech_404
  1. “追上去夺回香炉” → mech_504 eff{hp:-10} ⇒ 你抢回了香炉，也挨了一口。小绿皮的牙比看上去锋利。
  2. “用一个亮闪闪的齿轮换” → mech_504 eff{renown:3,set:{grotDeal:true}} ⇒ 成交。小绿皮把香炉还给你，郑重地把齿轮挂在了脖子上。
  3. “随它们去” → mech_504 eff{renown:-3,sanity:3} ⇒ 它们跑了，边跑边唱。那卷数据线，后来出现在一门兽人大炮上。

### mech_504 · ch5 · ork_scrapyard · 兽人机械佬 · foe:kastelan_robot · time{h:6}
废铁场中央站着一台卡斯特兰机器人，刷成了红色，头上焊着两只角。 / 它在动。没有晶片，没有祷文，它在动。 / “红的跑得快，”兽人机械佬骄傲地拍着它，“它信，所以它跑！”
on enter:   codex:ork_belief_tech
from: mech_502 ⟵ “拿起卡宾枪顶上去” | mech_502(success) ⟵ “接入火炮，计算弹道” | mech_502 ⟵ ““老规矩，阿尔法。”” | mech_503 ⟵ “追上去夺回香炉” | mech_503 ⟵ “用一个亮闪闪的齿轮换” | mech_503 ⟵ “随它们去” | mech_505(success) ⟵ “故意修坏它” | mech_505 ⟵ “等护教军来救”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, crystal, doubter, fleshFirst, grotDeal, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_501, mech_409, mech_408, mech_407, mech_405, mech_404
  1. “侵入它的指令核心” ROLL p=0.5+renown ✓mech_506 ✗mech_507 ⇒✓ 你找到一枚兽人没拆的旧晶片，改了一个字。机器人转身，把机械佬拍进了废铁堆。 ⇒✗ 核心里全是兽人的涂鸦和一个很丑的笑脸。机器人一脚把你踢飞。
  2. “引爆它的能源舱” → mech_506 eff{hp:-10,renown:3} ⇒ 爆炸把机器人和半个废铁场送上了天。可惜。它是一台好机器。
  3. “看机械佬怎么让它动起来” → mech_506 eff{sanity:-10,renown:-3,set:{mekWatch:true}} ⇒ 你看了很久，还是不懂。兽人什么原理都没用，只用了信心。这比任何异端都可怕。

### mech_505 · ch5 · ork_scrapyard · 兽人机械佬 · time{h:4}
你醒来时被铁链拴在废铁堆旁。一个兽人机械佬在拆你的工具包，边拆边嘟囔。 / 他发现你会用扳手，眼睛亮了：“小东西！你修！修好了，有肉吃！” / 他指了指一门歪歪扭扭的大炮。
from: mech_502(fail) ⟵ “接入火炮，计算弹道”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, crystal, doubter, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_502, mech_501, mech_409, mech_408, mech_407, mech_405
  1. “故意修坏它” ROLL p=0.5+hp ✓mech_504 ✗mech_end_looted ⇒✓ 大炮第一发就炸了膛。你趁乱挣开锁链，一头钻进废铁场深处。 ⇒✗ 机械佬发现了你的小动作，反而大笑：“聪明小东西！留着！”
  2. “等护教军来救” → mech_504 eff{hp:-10,sanity:-5} ⇒ 两天后护教军炸开了废铁场。找到你时，你正在给兽人大炮刷第三遍红漆。

### mech_506 · ch5 · forge_floor · 凯什-43阿尔法 · time{d:2}
兽人被打退了，带走了能带走的一切：三座发电站、半个铸造厂，还有那块STC残片。 / 凯什丢了一条腿，拄着一根管子站岗。 / “损失已记录，”她说，“悲伤未记录。没有那个字段。”
(grudgeLine gries: 格里斯监工提着账本站在尸堆旁：清点死人归他管。)
on enter: {hp:10}
from: mech_504(success) ⟵ “侵入它的指令核心” | mech_504 ⟵ “引爆它的能源舱” | mech_504 ⟵ “看机械佬怎么让它动起来” | mech_507 ⟵ “念那天念过的祷文” | mech_507 ⟵ “爬开”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, crystal, doubter, fleshFirst, grotDeal, keeper, keshTalk, knowsTobin, mekWatch, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_504, mech_501, mech_409, mech_408, mech_407, mech_405
  1. “帮凯什修腿” → mech_508 eff{renown:5,hp:-5,set:{keshRepair:true}} ⇒ 你用冲压机的连杆给她做了条新腿。不太合规，但她站得很稳。
  2. “去点算死去的杂役” → mech_508 eff{sanity:-5,renown:3} grudge(gries) ⇒ 三百四十一个。你把每个编号都念了一遍，一个不落。
  3. “去熔炉边找T-0B1N” → mech_508 require{flag:tobinSong} eff{sanity:8} ⇒ 它还在搬钢锭，浑身是灰，喉咙里还在哼那四个音。你从没觉得一首歌这么好听。

### mech_507 · ch5 · ork_scrapyard · 旁白 · foe:kastelan_robot · time{h:1}
你躺在废铁堆里，肋骨断了几根。红色的机器人朝你走来，每一步都踩碎一块金属。 / 它胸口的灯在闪。 / 闪了两下，和试炮那天一样。
on enter: {hp:-12}
from: mech_504(fail) ⟵ “侵入它的指令核心”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, crystal, doubter, fleshFirst, grotDeal, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_504, mech_501, mech_409, mech_408, mech_407, mech_405
  1. “念那天念过的祷文” → mech_506 eff{sanity:5,renown:5} ⇒ 机器人停住了。它站了很久，然后转身走向兽人，像想起了自己是谁。
  2. “爬开” → mech_506 eff{hp:-5} ⇒ 你爬了很久。它没有追。也许它根本没在看你。

### mech_end_looted · ch5 · ork_scrapyard · 兽人机械佬 · time{y:1} · **ENDING bad**
机械佬给你起了个名字：“小扳手”。你每天给兽人修枪，修得越好，它们越开心。 / 后来你发现，枪修不修都能打响，只要它们相信。 / 你开始怀疑学过的一切，也开始相信：红的跑得快。
ending: 「小扳手」 cause: 被兽人掳去修枪
from: mech_505(fail) ⟵ “故意修坏它”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, crystal, doubter, fleshFirst, keeper, keshTalk, knowsTobin, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_505, mech_502, mech_501, mech_409, mech_408, mech_407

### mech_508 · ch5 · manufactorum · 旁白 · time{d:3} · eventRoll 0.35
兽人待过的地方，一夜之间长出了蘑菇，红的绿的，塞满了冷却管道。 / 杂役说那是兽人的孢子，烧不干净，明年还会长出小绿皮。 / 管道里的蘑菇微微发热，摸上去像一只温顺的动物。
from: mech_506 ⟵ “帮凯什修腿” | mech_506 ⟵ “去点算死去的杂役” | mech_506 ⟵ “去熔炉边找T-0B1N”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, crystal, doubter, fleshFirst, grotDeal, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_506, mech_504, mech_501, mech_409, mech_408, mech_407
  1. “全部烧掉” → mech_509 eff{hp:-5,renown:3} ⇒ 火焰喷射器烧了一整天。烟是甜的，你咳了一整夜。
  2. “留一片，研究研究” → mech_509 eff{sanity:5,taint:{nurgle:35}} ⇒ 你给它浇了点机油，它长得很好。你开始期待每天早上去看它。

### mech_509 · ch5 · tech_vault · 瓦伦贤者 · time{d:4}
瓦伦贤者在圣库最底层等你。封印在兽人袭击那夜被人从里面打开过。 / 墙上留着一行废码，像霉斑一样慢慢扩散。 / “有人趁乱进来过，”贤者说，“不是兽人。兽人不会关门。”
on enter:   codex:mech_scrapcode
from: mech_508 ⟵ “全部烧掉” | mech_508 ⟵ “留一片，研究研究”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, crystal, doubter, fleshFirst, grotDeal, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_508, mech_506, mech_504, mech_501, mech_409, mech_408
  1. “追踪废码的来源” → mech_601 eff{sanity:-5,renown:3} ⇒ 废码一路通向外围熔炉，忏悔劳役的地方。
  2. “请贤者封锁圣库” → mech_601 eff{renown:5} ⇒ 封锁令下达三分钟后，有人在门外敲了三下：左，右，左。

### mech_601 · ch6 · tech_vault · 书记神甫奥西娅 · time{d:1}
是奥西娅。她的袍子烧焦了，一只手换成了你没见过的型号，多一个关节。 / “格拉维克斯在关门，”她说，“我在开门。” / 她身后，废码像藤蔓一样爬满了砖缝。
on enter:   codex:mech_dark_mechanicum
from: mech_509 ⟵ “追踪废码的来源” | mech_509 ⟵ “请贤者封锁圣库”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, crystal, doubter, fleshFirst, grotDeal, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_509, mech_508, mech_506, mech_504, mech_501, mech_409
  1. “听她说下去” → mech_602 eff{sanity:-5,set:{heardOssia:true},taint:{tzeentch:20}} grudge(ossia) ⇒ 她说得很快，用了很多你没听过的概念。每一个都像一扇刚推开的门。
  2. ““回来吧，奥西娅。”” → mech_602 require{flag:ossiaFriend} eff{sanity:5} grudge(ossia) ⇒ 她的笑僵了一下。“你还记得那把扳手。”她摇头，“回不去了。”
  3. “呼叫凯什” → mech_603 eff{renown:5} ⇒ 你向数据圈发出信号。奥西娅听见了，没有逃，只是叹了口气。

### mech_602 · ch6 · tech_vault · 书记神甫奥西娅 · time{h:1}
“火星分裂从来没结束，”奥西娅说，“一半的神甫选择了不再害怕知识。” / “铸魔匠塞瑞丁就要来了。你想问的、不敢问的，他都会回答。” / 她把一枚数据钥匙放在你手心。
on enter:   codex:chr_schism_of_mars
from: mech_601 ⟵ “听她说下去” | mech_601 ⟵ ““回来吧，奥西娅。””
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, crystal, doubter, fleshFirst, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_601, mech_509, mech_508, mech_506, mech_504, mech_501
  1. “握紧钥匙” → mech_604 eff{corruption:10,set:{ossiaKey:true},taint:{tzeentch:20}} ⇒ 钥匙在掌心发热，像一颗小小的心脏。你没告诉任何人。
  2. “把钥匙扔进熔炉” → mech_604 eff{sanity:-5,renown:5} ⇒ 奥西娅看着它熔化，没阻止。“它会再长出来的，”她说，“知识都这样。”

### mech_603 · ch6 · barracks · 凯什-43阿尔法 · time{h:2}
凯什逮捕了奥西娅。奥西娅没反抗，被押走时一直在笑。 / “太晚了，”她说，“熔炉的机魂已经替他开了门。它也想知道答案。” / 凯什把这句话存档，标记为：威胁等级未知。
on enter: {sanity:-5}
from: mech_601 ⟵ “呼叫凯什”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, crystal, doubter, fleshFirst, grotDeal, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_601, mech_509, mech_508, mech_506, mech_504, mech_501
  1. “去找瓦伦贤者” → mech_604

### mech_604 · ch6 · manufactorum · 瓦伦贤者 · time{d:2}
瓦伦贤者把你叫到手术台前。不是转化线那张，是神甫们自己用的那张。 / “铸魔匠要来了。恐惧会让你犯错，血肉会让你流血。” / “你可以决定，”他说，“留下多少个自己。”
on enter:   codex:mech_rite_pure_thought
from: mech_602 ⟵ “握紧钥匙” | mech_602 ⟵ “把钥匙扔进熔炉” | mech_603 ⟵ “去找瓦伦贤者”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, crystal, doubter, fleshFirst, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_601, mech_509, mech_508, mech_506, mech_504, mech_501
  1. ““留下心和手。”” → mech_605 eff{renown:-5,sanity:10,set:{fleshKept:true}} ⇒ 贤者没反对，只在你的档案里把一个数值标成“低效”。你的手还是你的手。
  2. ““换掉软弱的部分。”” → mech_605 eff{hp:15,sanity:-10,renown:10,set:{augHalf:true},taint:{slaanesh:35}} ⇒ 醒来时你胸腔里多了一台泵，比心脏更稳。你照了镜子，一遍，又一遍。
  3. ““纯思仪式。全部。”” → mech_606 eff{sanity:-5} ⇒ 贤者的触手第一次完全静止。“你确定？”这是他第一次用问句。

### mech_605 · ch6 · forge_floor · 旁白 · time{d:3}
新的你走在熔炉之间。护教军向你点头，杂役给你让路，就像当年你给神甫让路。 / 格拉维克斯的灯一闪一闪，像在用二进制说话。 / 你听懂了。它在说：害怕。
from: mech_604 ⟵ ““留下心和手。”” | mech_604 ⟵ ““换掉软弱的部分。”” | mech_606 ⟵ ““你自己做过吗？”” | mech_606 ⟵ ““停下！我要留着它们。””
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, crystal, doubter, fleshFirst, fleshKept, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_604, mech_601, mech_509, mech_508, mech_506, mech_504
  1. “去冥想室为熔炉祈祷” → mech_607

### mech_606 · ch6 · manufactorum · 瓦伦贤者 · time{h:1}
纯思仪式。手术锯悬在你头顶，比转化线上那把精致得多。 / “恐惧、悔恨、爱，”瓦伦贤者说，“切除之后，你将看清一切。” / “但你不会再在乎看清了什么。”
from: mech_604 ⟵ ““纯思仪式。全部。””
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, crystal, doubter, fleshFirst, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_604, mech_601, mech_509, mech_508, mech_506, mech_504
  1. ““继续。”” → mech_end_pure require{stat:renown,min:45} eff{taint:{all:-50}} ⇒ 锯子转起来时，你想起那首四个音的歌。然后，想不起为什么要想起它。
  2. ““你自己做过吗？”” → mech_605 eff{sanity:5,set:{fleshKept:true}} ⇒ 贤者沉默了很久。“做过。所以我知道，你还没准备好。”他关掉了锯子。
  3. ““停下！我要留着它们。”” → mech_605 eff{sanity:-5,renown:-5,set:{fleshKept:true}} ⇒ 贤者关掉了锯子。“记录：候选者选择了痛苦。有意思。”

### mech_607 · ch6 · mars_vista · 金色齿轮 · time{h:6}
你在维护冥想中看见一道金光，像一个巨大的齿轮光环，缓缓转动。 / 是万机之神吗？还是你的植入体过热了？ / 光环里有一个声音，说着你听不懂、却觉得应该懂的二进制。
on enter:   codex:mech_omnissiah
from: mech_605 ⟵ “去冥想室为熔炉祈祷”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, crystal, doubter, fleshFirst, fleshKept, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_605, mech_604, mech_601, mech_509, mech_508, mech_506
  1. “祈祷，不提问” → mech_608 eff{sanity:5,renown:5,taint:{all:-15}} ⇒ 你只是念着点火祷文。光环慢慢暗下去，留下一种干净的安静。
  2. “问它：帝皇就是你吗？” → mech_608 eff{sanity:-10,taint:{tzeentch:20}} ⇒ 光环停了一下，然后变了颜色：从金色，变成一种你叫不出名字的蓝。

### mech_end_pure · ch6 · manufactorum · 瓦伦贤者 · time{d:7} · **ENDING bad**
仪式很成功。你看清了一切：格拉维克斯的产能、铸魔匠的弱点、自己剩余的寿命。 / 你不害怕，不后悔，也不再记得那首歌。 / 瓦伦贤者说你是他最好的作品。你同意。这是一个正确的数据。
ending: 「纯思」 cause: 切除了一切感情
from: mech_606 ⟵ ““继续。””
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, crystal, doubter, fleshFirst, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_606, mech_604, mech_601, mech_509, mech_508, mech_506

### mech_608 · ch6 · forge_floor · 铸工神甫鲁姆 · time{h:4} · eventRoll 0.4
废码在熔炉间蔓延。传送带倒着转，机仆停下来对着墙发呆。 / 鲁姆抱着反应堆的控制台哭：“它害怕！它说它听见了别的声音！” / 格拉维克斯的心脏，一座等离子反应堆，在颤抖。
from: mech_607 ⟵ “祈祷，不提问” | mech_607 ⟵ “问它：帝皇就是你吗？”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, crystal, doubter, fleshFirst, fleshKept, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_607, mech_605, mech_604, mech_601, mech_509, mech_508
  1. “对反应堆唱祷文” → mech_609 eff{sanity:-5,taint:{all:-10},set:{calmedReactor:true,keeper:true}} ⇒ 你唱到嗓子出血。反应堆的颤抖慢慢平了，像一只被抚摸的巨兽。
  2. “切断它的数据接口” → mech_609 eff{hp:-10,renown:3} ⇒ 拔接口时电弧烧了你的手。反应堆安静了，安静得像在生闷气。

### mech_609 · ch6 · void · 铸魔匠塞瑞丁 · time{d:2}
天空裂开了。一艘黄铜与血肉焊成的舰船挂在轨道上，像一座倒悬的铸造厂。 / 一个声音挤进每一台机器： / “格拉维克斯，我是塞瑞丁。你们的神是一台坏掉的计算机。我的神会回答。”
on enter:   codex:mech_warsmith
from: mech_608 ⟵ “对反应堆唱祷文” | mech_608 ⟵ “切断它的数据接口”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_608, mech_607, mech_605, mech_604, mech_601, mech_509
  1. “拿起武器” → mech_701 eff{renown:3} ⇒ 你领到一支电弧步枪。它的机魂很紧张，你也是。
  2. “捂住耳朵” → mech_701 eff{sanity:-5} ⇒ 声音直接从植入体里钻进来。捂耳朵没有用。

### mech_701 · ch7 · burning_city · 凯什-43阿尔法 · foe:dark_mechanicus · time{h:6}
铸魔匠的部队降落了：浑身管线的异端神甫，被废码驱动的机仆，还有一些叫不出名字的东西。 / 凯什的分队在燃烧的街道上组成防线。 / “书记神甫，”她说，“选一个地方去死。或者去活。”
from: mech_609 ⟵ “拿起武器” | mech_609 ⟵ “捂住耳朵”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_609, mech_608, mech_607, mech_605, mech_604, mech_601
  1. “留在防线上” → mech_702 eff{hp:-15,renown:5,taint:{khorne:30}} ⇒ 开火，装弹，开火。你不再数打倒了多少。数字开始让你觉得无聊。
  2. “带杂役们撤进地下” → mech_702 eff{hp:-5,sanity:5,set:{savedMenials:true}} ⇒ 你领着三百个杂役钻进冷却隧道。他们没有名字，只有编号，可他们都活着。
  3. “去圣库” → mech_703

### mech_702 · ch7 · ruins · 旁白 · foe:daemon_engine · time{h:2}
它从烟里走出来：黄铜的腿，钢铁的爪，炮管里有东西在呼吸。 / 装甲上刻满了符文，那些符文在动，在笑。 / 凯什开火了。炮弹打在它身上，像打在一块活着的肉上。
on enter: {sanity:-10,hp:-5}  codex:mech_daemon_engine
from: mech_701 ⟵ “留在防线上” | mech_701 ⟵ “带杂役们撤进地下”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_701, mech_609, mech_608, mech_607, mech_605, mech_604
  1. “跟凯什一起后撤” → mech_704 eff{hp:-10} ⇒ 它的爪子擦过你的肩膀。被碰过的地方，金属在生锈，皮肤在发烫。
  2. “盯着那些符文看” → mech_704 eff{sanity:-10,taint:{tzeentch:20}} ⇒ 符文在你眼里重新排列，拼出了你的名字。一个字都没错。

### mech_703 · ch7 · tech_vault · 旁白 · time{h:2}
圣库最底层的封印在发光。废码在门上写好了一行字：“请输入钥匙。” / 门后是格拉维克斯锁了一万年的东西：会思考的机器、禁用的公式、没人敢回答的问题。 / 它在等你。
from: mech_701 ⟵ “去圣库”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_701, mech_609, mech_608, mech_607, mech_605, mech_604
  1. “用奥西娅的钥匙打开” → mech_704 require{flag:ossiaKey} eff{renown:-5,corruption:10,set:{openedArchive:true},taint:{tzeentch:30}} ⇒ 门开了。你只读了一行，就懂了三件以前不懂的事，和一件再也忘不掉的事。
  2. “用自己的权限重新封印” → mech_704 eff{hp:-5,renown:8} ⇒ 封印咬住你的植入体，抽走了一部分电流。门安静了。
  3. “只看一眼” → mech_704 eff{sanity:-10,taint:{tzeentch:25}} ⇒ 你从门缝里看了一眼。里面的东西也看了你一眼。

### mech_704 · ch7 · forge_floor · T-0B1N · time{h:3}
熔炉边，T-0B1N停下了。废码爬进了它的脑子，那首歌倒着唱，四个音全错了。 / 它慢慢转向你，手里还握着一根烧红的钢锭。 / 它从来没有看过你。现在它在看。
(grudgeLine tobin: 废码掀开了手术刀盖住的一层：它想起了你，想起了你亏欠它的那一次。)
from: mech_702 ⟵ “跟凯什一起后撤” | mech_702 ⟵ “盯着那些符文看” | mech_703 ⟵ “用奥西娅的钥匙打开” | mech_703 ⟵ “用自己的权限重新封印” | mech_703 ⟵ “只看一眼”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_701, mech_609, mech_608, mech_607, mech_605, mech_604
  1. “把那首歌正着唱给它听” → mech_705 require{flag:tobinSong} eff{sanity:10,set:{tobinSaved:true,forgiven_tobin:true}} grudge(tobin) ⇒ 第一个音，它停住了。第四个音，它放下钢锭，跟着你哼了起来。还是跑调。
  2. “关掉它” → mech_705 eff{sanity:-8} grudge(tobin) ⇒ 你按下它后颈的开关。它倒下时很轻，像一件终于脱下的外套。
  3. “让锈接管它” → mech_705 eff{sanity:-5,taint:{nurgle:40}} ⇒ 锈从它的关节里开出花来，橙色的，很暖。它又能动了，比以前更有耐心。

### mech_705 · ch7 · manufactorum · 瓦伦贤者 · foe:dark_mechanicus · time{h:2}
瓦伦贤者挡在反应堆大门前，六根触手断了五根。 / 他把一枚权限芯片塞进你手里：“熔炉的心脏不认职衔，只认虔诚。” / “去。我来计算怎么让他们慢一点。”他的发声器在冒烟。
from: mech_704 ⟵ “把那首歌正着唱给它听” | mech_704 ⟵ “关掉它” | mech_704 ⟵ “让锈接管它”
flags on arrival — MUST: apprentice, initiate · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_704, mech_701, mech_609, mech_608, mech_607, mech_605
  1. “收下芯片，走” → mech_706 eff{renown:10,set:{vallenKey:true}} ⇒ 你跑出很远才回头。贤者的最后一根触手正在把门焊死，从里面。
  2. “拖着他一起走” → mech_706 eff{hp:-10,renown:5,set:{vallenKey:true}} ⇒ 他太重了，大半是黄铜。走到一半，他关掉自己的推进器，松开了你的手。

### mech_706 · ch7 · burning_city · 凯什-43阿尔法 · time{h:3} · eventRoll 0.4
最后的防线。凯什只剩一条胳膊和一条借来的腿。 / “最后一条教条，”她说，“我自己写的：保护书记神甫。” / 她的分队转身冲进烟里，步伐整齐，像同一个人。
from: mech_705 ⟵ “收下芯片，走” | mech_705 ⟵ “拖着他一起走”
flags on arrival — MUST: apprentice, initiate, vallenKey · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_705, mech_704, mech_701, mech_609, mech_608, mech_607
  1. “和她一起冲” → mech_707 eff{hp:-18,renown:5} ⇒ 冲到一半，凯什把你推了回来。她最后说的不是二进制，是她名字剩下的那个音节。
  2. “跑向反应堆” → mech_707 eff{sanity:-5} ⇒ 你没有回头。你知道她会这么计算：这是最优解。
  3. “走向铸魔匠的旗帜” → mech_end_heretek require{flag:heardOssia} eff{corruption:15} ⇒ 你放下武器，朝那面黄铜旗帜走去。没人拦你。他们好像早就在等你。

### mech_707 · ch7 · forge_floor · 铸魔匠塞瑞丁 · foe:daemon_engine · time{h:1}
反应堆大厅里，铸魔匠塞瑞丁在等你。他的身体是一座会走的工坊，身后蹲着那台恶魔引擎。 / “你也想过，残片为什么不能补全，”他说，“我能。我什么都能补全。” / “跟我走吧。”
on enter:   codex:mech_warsmith
from: mech_706 ⟵ “和她一起冲” | mech_706 ⟵ “跑向反应堆”
flags on arrival — MUST: apprentice, initiate, vallenKey · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_706, mech_705, mech_704, mech_701, mech_609, mech_608
  1. ““不。”” → mech_801 eff{renown:5} ⇒ 塞瑞丁叹了口气，像一位失望的老师。他打了个响指，恶魔引擎站了起来。
  2. ““你的神要什么代价？”” → mech_801 eff{sanity:-8,taint:{tzeentch:20}} ⇒ “问得好，”他微笑，“每次都不一样。这正是乐趣所在。”然后恶魔引擎站了起来。
  3. ““你说过会回答一切。”” → mech_end_heretek require{flag:openedArchive} eff{corruption:20} ⇒ 他伸出一只手，关节多一个，和奥西娅的一样。你握住了它。

### mech_end_heretek · ch7 · daemon_world · 铸魔匠塞瑞丁 · time{y:5,warp:true} · **ENDING bad**
塞瑞丁兑现了承诺：你问什么，他答什么。 / 你学会了把恶魔写进机器，把机器写进血肉。格拉维克斯在身后燃烧，你忙着记笔记。 / 很多年后，你给自己换了一只手，关节多一个。
ending: 「未缚者的学徒」 cause: 投身黑暗机械教
from: mech_706 ⟵ “走向铸魔匠的旗帜” | mech_707 ⟵ ““你说过会回答一切。””
flags on arrival — MUST: apprentice, initiate, vallenKey · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_706, mech_705, mech_704, mech_701, mech_609, mech_608

### mech_801 · ch8 · forge_floor · 旁白 · foe:daemon_engine · time{h:1}
恶魔引擎扑向反应堆。它的每一步都让地面生锈，每一声吼都让灯光变色。 / 格拉维克斯的心脏就在它爪下。 / 你有的，是一点权限、几句祷文，和一具还没完全变成机器的身体。
from: mech_707 ⟵ ““不。”” | mech_707 ⟵ ““你的神要什么代价？””
flags on arrival — MUST: apprentice, initiate, vallenKey · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_707, mech_706, mech_705, mech_704, mech_701, mech_609
  1. “用瓦伦的芯片唤醒反应堆” → mech_802 require[{flag:vallenKey},{stat:renown,min:30}] eff{renown:5} ⇒ 芯片插进控制台。反应堆用二进制说了一个字，声音大得你从没听过：“是。”
  2. “给反应堆唱那段祷文” → mech_802 require{flag:calmedReactor} eff{sanity:-5} ⇒ 它认出了你的声音。整个大厅的灯，同时变回了金色。
  3. “调来卡斯特兰机器人” ROLL p=0.45+renown ✓mech_803 ✗mech_804 ⇒✓ 三台卡斯特兰从侧门走进来，胸口的灯整齐地闪着，抓住了恶魔引擎的腿。 ⇒✗ 机器人收到了指令，可恶魔引擎先一步抓住了你。
  4. “冲上去，用身体挡” → mech_804 eff{hp:-10} ⇒ 你冲上去，没有计算。这是入教以来你第一次没有计算。

### mech_802 · ch8 · forge_floor · 旁白 · foe:daemon_engine · time{h:1}
反应堆苏醒了。等离子流涌出导管，可管道被恶魔引擎的爪子撕开了一半。 / 必须有人握住导管，把光引到它身上。 / 握住的人，大概剩不下多少。
from: mech_801 ⟵ “用瓦伦的芯片唤醒反应堆” | mech_801 ⟵ “给反应堆唱那段祷文”
flags on arrival — MUST: apprentice, initiate, vallenKey · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_801, mech_707, mech_706, mech_705, mech_704, mech_701
  1. “亲手握住导管” ROLL p=0.55+hp ✓mech_805 ✗mech_804 ⇒✓ 你的手熔化了，导管稳住了。等离子流把恶魔引擎从中间劈开。 ⇒✗ 导管在你手里扭动，像活的。光打偏了，引擎转向了你。
  2. “让T-0B1N去握” → mech_805 require{flag:tobinSaved} eff{sanity:-15} ⇒ 它走过去握住导管，没有犹豫。光吞没它之前，它哼完了那首歌。正着唱的。

### mech_803 · ch8 · forge_floor · 卡斯特兰机器人 · foe:daemon_engine · time{h:1}
卡斯特兰机器人按住恶魔引擎。一台被撕碎，另一台顶上去。 / 它们不害怕，因为不许害怕；它们不撤退，因为晶片里没写。 / 你把最后一条指令插进第三台：“打它的心。”
on enter: {renown:5}
from: mech_801(success) ⟵ “调来卡斯特兰机器人”
flags on arrival — MUST: apprentice, initiate, vallenKey · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_801, mech_707, mech_706, mech_705, mech_704, mech_701
  1. “看着它出拳” → mech_805

### mech_804 · ch8 · forge_floor · 旁白 · foe:daemon_engine · time{h:1}
恶魔引擎的爪子把你按在地上。黄铜贴着你的脸，烫得发甜。 / 炮管里那个呼吸的东西凑近你，用你母亲的声音念你的编号。 / 你还有一只手能动。
on enter: {hp:-22,sanity:-5}
from: mech_801(fail) ⟵ “调来卡斯特兰机器人” | mech_801 ⟵ “冲上去，用身体挡” | mech_802(fail) ⟵ “亲手握住导管”
flags on arrival — MUST: apprentice, initiate, vallenKey · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_801, mech_707, mech_706, mech_705, mech_704, mech_701
  1. “把最后一枚手雷塞进炮管” → mech_805 eff{hp:-8} ⇒ 爆炸把你们俩都掀翻了。它的吼声变成尖叫，又变成金属冷却的嘀嗒声。
  2. “念出它的真名” → mech_805 require{flag:openedArchive} eff{sanity:-15,corruption:10} ⇒ 你在禁库里读过这个名字。恶魔在钢铁里抽搐，松开了爪子。你嘴里一股铁锈味。

### mech_805 · ch8 · forge_floor · 旁白 · time{d:1}
恶魔引擎倒下了。铸魔匠的舰船在轨道上燃烧，塞瑞丁的声音从所有机器里消失了。 / 格拉维克斯还剩一半熔炉、三成杂役，和刚学会二进制没几年的你。 / 天亮了。天还是红的。
on enter: {sanity:5}
from: mech_802(success) ⟵ “亲手握住导管” | mech_802 ⟵ “让T-0B1N去握” | mech_803 ⟵ “看着它出拳” | mech_804 ⟵ “把最后一枚手雷塞进炮管” | mech_804 ⟵ “念出它的真名”
flags on arrival — MUST: apprentice, initiate, vallenKey · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_801, mech_707, mech_706, mech_705, mech_704, mech_701
  1. “穿上贤者的袍子，留着这颗心” → mech_end_magos require[{flag:fleshKept},{stat:renown,min:35}] eff{renown:10} ⇒ 授袍那天，你没有换掉任何零件。神甫们窃窃私语，没人敢说出口。
  2. “随探索舰队出发，去求知” → mech_end_explorator require{stat:renown,min:30} eff{renown:5} ⇒ 你把卡兰提斯的坐标抄进新舰的星图。第一个目的地，就是那里。
  3. “留在第七熔炉，照看它的机魂” → mech_end_keeper require{flag:keeper} eff{sanity:10} ⇒ 你回到第七熔炉。反应堆认出了你的脚步，灯亮了一下。
  4. “把恶魔引擎的核心带回去研究” → mech_end_purged eff{corruption:5} ⇒ 核心还是热的，在你怀里轻轻跳动。你告诉自己，只是看看它怎么运转。

### mech_end_explorator · ch8 · void · 旁白 · time{y:1,warp:true} · **ENDING good**
新的探索舰起航了。你在卡兰提斯的坐标旁画了一个问号。 / 星区之外，还有一万座沉睡的墓穴、一万块失落的残片、一万个没人回答的问题。 / 求知之旅没有终点。这正是你喜欢它的地方。
ending: 「群星间的求知者」 cause: 随探索舰队远行
from: mech_805 ⟵ “随探索舰队出发，去求知”
flags on arrival — MUST: apprentice, initiate, vallenKey · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_805, mech_801, mech_707, mech_706, mech_705, mech_704

### mech_end_keeper · ch8 · forge_floor · 旁白 · time{y:2} · **ENDING good**
你没有升职，留在第七熔炉当它的看守神甫。 / 每天早上，你给反应堆念祷文，给传送带上油，给还在哼歌的机仆擦脸。 / 杂役们说，第七熔炉的机魂是全星球脾气最好的。
ending: 「第七熔炉的看守」 cause: 留作熔炉的看守神甫
from: mech_805 ⟵ “留在第七熔炉，照看它的机魂”
flags on arrival — MUST: apprentice, initiate, vallenKey · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_805, mech_801, mech_707, mech_706, mech_705, mech_704

### mech_end_magos · ch8 · manufactorum · 旁白 · time{y:3} · **ENDING good**
三年后，你成了格拉维克斯最年轻的贤者。袍子下是黄铜，胸口里仍是一颗会疼的心。 / 你改了转化线的规矩：会数数的、会唱歌的，先送来见你。 / 你的档案里，名字一栏终于填上了。
ending: 「有心的贤者」 cause: 成为保留人心的贤者
from: mech_805 ⟵ “穿上贤者的袍子，留着这颗心”
flags on arrival — MUST: apprentice, initiate, vallenKey · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_805, mech_801, mech_707, mech_706, mech_705, mech_704

### mech_end_purged · ch8 · tech_vault · 铸造世界法庭 · time{d:9} · **ENDING bad**
你把恶魔引擎的核心带回圣库，只想看看它是怎么运转的。 / 法庭的判决只有一个二进制词：异端。 / 他们没有把你改成机仆。他们怕那颗核心已经教会了你的大脑什么。
ending: 「最后的好奇心」 cause: 因技术异端被处决
from: mech_805 ⟵ “把恶魔引擎的核心带回去研究”
flags on arrival — MUST: apprentice, initiate, vallenKey · MAY-only: askedNew, askedServitor, askedTobin, askedTreaty, aug, augHalf, calmedReactor, crystal, doubter, fleshFirst, fleshKept, forgiven_tobin, grotDeal, heardOssia, keeper, keshRepair, keshTalk, knowsTobin, mekWatch, noticed, openedArchive, origin_conscript, origin_menial, origin_savant, ossiaFriend, ossiaGone, ossiaKey, ossiaWarned, pulledTobin, readContract, reportedOssia, savedMenials, savedServitors, tapped, tobinFriend, tobinSaved, tobinSong, tookBlame, warnedTomb, wronged_gries, wronged_ossia, wronged_tobin
certainly visited before (nearest 6): mech_805, mech_801, mech_707, mech_706, mech_705, mech_704
