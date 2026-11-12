# Route digest: imperium — 109 nodes, origins: hive@imp_101, agri@imp_o_agri_1, noble@imp_o_noble_1

Entered by the engine from anywhere (stat deaths, claim jumps): imp_death_hp, imp_death_sanity, imp_death_corruption, imp_end_claim_khorne, imp_end_claim_nurgle, imp_end_claim_tzeentch, imp_end_claim_slaanesh

Random events (eventRoll → data/events*.js) are not in this graph; they can also set flags. Time `d`/`h`/`y` is applied on entering the node. MUST = on every path to the node; MAY = on some path.

## Automatic findings (33)
- **INFO** `imp_105`: flag 'hidMina' is set (at imp_105) but never used by a require — only text may rely on it
- **INFO** `imp_105`: flag 'reportedMina' is set (at imp_105) but never used by a require — only text may rely on it
- **INFO** `imp_108`: flag 'deserter' is set (at imp_108) but never used by a require — only text may rely on it
- **INFO** `imp_109`: flag 'marked' is set (at imp_109) but never used by a require — only text may rely on it
- **INFO** `imp_o_agri_2`: flag 'volunteered' is set (at imp_o_agri_2) but never used by a require — only text may rely on it
- **INFO** `imp_o_agri_2`: flag 'gaveStash' is set (at imp_o_agri_2) but never used by a require — only text may rely on it
- **INFO** `imp_o_noble_2`: flag 'signedTithe' is set (at imp_o_noble_2) but never used by a require — only text may rely on it
- **INFO** `imp_o_noble_3`: flag 'serrinRing' is set (at imp_o_noble_3) but never used by a require — only text may rely on it
- **INFO** `imp_o_noble_4`: flag 'giltBook' is set (at imp_o_noble_4) but never used by a require — only text may rely on it
- **INFO** `imp_202`: flag 'sawExecution' is set (at imp_202) but never used by a require — only text may rely on it
- **INFO** `imp_204`: flag 'lullaby' is set (at imp_204) but never used by a require — only text may rely on it
- **INFO** `imp_207`: flag 'blessedGun' is set (at imp_207) but never used by a require — only text may rely on it
- **INFO** `imp_210`: flag 'warpWhisper' is set (at imp_210) but never used by a require — only text may rely on it
- **INFO** `imp_301`: flag 'extraAmmo' is set (at imp_301) but never used by a require — only text may rely on it
- **INFO** `imp_310`: flag 'wavered' is set (at imp_310) but never used by a require — only text may rely on it
- **INFO** `imp_307`: flag 'hero' is set (at imp_307) but never used by a require — only text may rely on it
- **INFO** `imp_402`: flag 'cultTouched' is set (at imp_402) but never used by a require — only text may rely on it
- **INFO** `imp_404`: flag 'cultist' is set (at imp_404) but never used by a require — only text may rely on it
- **INFO** `imp_407`: flag 'confessed' is set (at imp_407) but never used by a require — only text may rely on it
- **INFO** `imp_408`: flag 'spy' is set (at imp_408) but never used by a require — only text may rely on it
- **INFO** `imp_405`: flag 'toldInq' is set (at imp_405) but never used by a require — only text may rely on it
- **INFO** `imp_411`: flag 'informer' is set (at imp_411) but never used by a require — only text may rely on it
- **INFO** `imp_413`: flag 'sawAltar' is set (at imp_413) but never used by a require — only text may rely on it
- **INFO** `imp_505`: flag 'kissed' is set (at imp_505) but never used by a require — only text may rely on it
- **INFO** `imp_507`: flag 'pellSavedYou' is set (at imp_507) but never used by a require — only text may rely on it
- **INFO** `imp_513`: flag 'voskDead' is set (at imp_513) but never used by a require — only text may rely on it
- **INFO** `imp_511`: flag 'savedBaby' is set (at imp_511) but never used by a require — only text may rely on it
- **INFO** `imp_602`: flag 'corporal' is set (at imp_602) but never used by a require — only text may rely on it
- **INFO** `imp_602`: flag 'askedDravik' is set (at imp_602) but never used by a require — only text may rely on it
- **INFO** `imp_604`: flag 'penal' is set (at imp_604) but never used by a require — only text may rely on it
- **INFO** `imp_610`: flag 'pellPromise' is set (at imp_610) but never used by a require — only text may rely on it
- **INFO** `imp_714`: flag 'pellDead' is set (at imp_714) but never used by a require — only text may rely on it
- **INFO** `imp_805`: flag 'dravikDead' is set (at imp_805) but never used by a require — only text may rely on it

Join nodes (≥3 different parents — check the text does not assume any single parent's events): imp_104, imp_201, imp_311, imp_405, imp_412, imp_506, imp_516, imp_707, imp_714, imp_806

## Nodes

### imp_death_corruption · chundefined · warp · 亚空间 · **ENDING death**
那个敲船壳的声音，终于等到了回答。 / 你的皮肤在发光，你的影子在说话。政委的子弹来得很快，但还是晚了一步——从你身上爬出来的东西，已经开始笑了。
ending: 「开门的回答」 cause: 被亚空间之物附身
flags on arrival — MUST: ∅ · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, dravikDead, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellDead, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawExecution, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell

### imp_death_hp · chundefined · ruins · 旁白 · **ENDING death**
你倒下的地方没有墓碑，只有一个编号。 / 多年后，某位执事念到这个编号，语气依旧感恩。 / 帝国从不缺人。它只缺时间。
ending: 「无名之墓」 cause: 战死，葬于无名墓
flags on arrival — MUST: ∅ · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, dravikDead, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellDead, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawExecution, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell

### imp_death_sanity · chundefined · barracks · 阿诺医师 · **ENDING death**
你开始笑，停不下来。阿诺医师给你打了一针，又一针。 / 后来你被送进一座安静的修道院。那里的人都穿着束缚衣，都在数墙上别人看不见的眼睛。
ending: 「数眼睛的人」 cause: 理智崩溃
flags on arrival — MUST: ∅ · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, dravikDead, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellDead, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawExecution, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell

### imp_end_claim_khorne · chundefined · trench · 铜色的鼓声 · time{y:3} · **ENDING bad**
你不再等口令。中士在身后喊你，你只听得见鼓声。 / 多年后，有人在一片无名的战场上见过你：军服早烂成了布条，你还在冲锋，身后的头盔堆成了小山。 / 血神从不问血是谁的，只要王座下的头骨更高。
ending: 「无名的冲锋」 cause: 被恐虐收为猎犬
on enter:   codex:god_khorne
flags on arrival — MUST: ∅ · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, dravikDead, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellDead, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawExecution, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell

### imp_end_claim_nurgle · chundefined · ruins · 慈祥的声音 · time{d:40} · **ENDING bad**
你不再怕病，也不再怕死。野战医院的伤员一个个好了，又病了，全都笑眯眯的。 / 政委来查时，营地已成了一座花园：苍蝇在唱歌，伤口在开花，没人再喊疼。 / 慈父爱他的每一个孩子，从不让谁孤单。
ending: 「花园营地」 cause: 成为纳垢的园丁
on enter:   codex:god_nurgle
flags on arrival — MUST: ∅ · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, dravikDead, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellDead, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawExecution, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell

### imp_end_claim_slaanesh · chundefined · cathedral · 甜得发苦的声音 · time{y:1} · **ENDING bad**
勋章、掌声、香膏、更响的赞美诗，你都要，而且要更多。 / 每一样都比上一样淡。最后你站在凯旋礼上，全舰队都在为你欢呼，你什么也感觉不到。 / 她把你一次次装满，又一次次倒空，直到你只剩下想要。
ending: 「掌声之后」 cause: 被色孽掏空
on enter:   codex:god_slaanesh
flags on arrival — MUST: ∅ · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, dravikDead, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellDead, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawExecution, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell

### imp_end_claim_tzeentch · chundefined · ship_interior · 镜子里的人 · time{y:2} · **ENDING bad**
你总能先知道命令、战局，和谁会背叛谁。你升到了上尉。 / 某天你在作战图上画了一道线，整个团跟着它走进了埋伏。那道线，是镜子里的人替你画的。 / 你以为自己在下棋，其实你只是一颗棋子。
ending: 「一步好棋」 cause: 沦为奸奇的棋子
on enter:   codex:god_tzeentch
flags on arrival — MUST: ∅ · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, dravikDead, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellDead, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawExecution, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell

### imp_101 · ch1 · hive_hab · 旁白
第六班汽笛响了三声。墙上的帝皇画像被蒸汽熏得只剩一双眼睛。 / 今天是什一税日。整栋居住块都在假装自己很忙。
on enter:   codex:imp_hive,imp_emperor,place_aurex,place_tower_three
flags on arrival — MUST: origin_hive · MAY-only: ∅
  1. “准时去工厂上工” → imp_102 ⇒ 你一路小跑下了三层楼梯。打卡机还是比你快了一分钟。
  2. “先去楼梯间找佩尔” → imp_103

### imp_o_agri_1 · ch1 · jungle · 旁白
巢都外的灰原上，七号穹顶农庄。玻璃顶裂了一道缝，黄色的天从缝里漏进来。 / 父亲说，巢都一天吃掉的麦子，比这里一年种的还多。 / 今天，收割机又坏了。
on enter:   codex:imp_hive,imp_emperor,place_aurex
flags on arrival — MUST: origin_agri · MAY-only: ∅
  1. “弯腰用镰刀割” → imp_o_agri_2 eff{hp:-5,renown:2} ⇒ 你割到太阳沉进裂缝。手上磨出了血泡，麦捆码得整整齐齐。
  2. “钻到收割机底下修” → imp_o_agri_2 ⇒ 你对着机器念了三遍父亲教的祷词，又踹了两脚。它咳嗽着醒了。

### imp_o_noble_1 · ch1 · hive_spire · 旁白
尖塔第九十层，赛伦家族。家徽是一座塔和一柄断剑，挂在早已抵押出去的大厅里。 / 长子继承家名和债务。次子，用来还债。 / 今晚，父亲第一次请你喝酒。
on enter:   codex:imp_hive,imp_emperor,place_aurex
flags on arrival — MUST: origin_noble · MAY-only: ∅
  1. “举杯，等他开口” → imp_o_noble_2
  2. “先问他要什么” → imp_o_noble_2 eff{sanity:-5} ⇒ 父亲放下酒杯，笑容僵了一下。“你一直比你哥哥聪明。麻烦就在这儿。”

### imp_102 · ch1 · manufactorum · 格鲁斯克监工 · time{h:1}
“又迟到，扣一天口粮。”格鲁斯克在名册上画了个圈，“名单今天下来。帝皇要兵，巢都要配额。” / 他看着你，“你年轻。祝你好运——或者说，祝我好运。”
on enter:   codex:imp_tithe,place_manufactorum_six
from: imp_101 ⟵ “准时去工厂上工”
flags on arrival — MUST: origin_hive · MAY-only: ∅
certainly visited before (nearest 6): imp_101
  1. “低头干活” → imp_104 eff{hp:-5,renown:2} ⇒ 你把脸埋进蒸汽里拧了一上午螺栓。手掌起了泡，格鲁斯克没再看你一眼。
  2. “问他名单上还有谁” → imp_103 eff{sanity:-5} ⇒ 格鲁斯克合上名册：“问这个的人，通常都在上面。”他挥手让你去楼梯间透透气。

### imp_103 · ch1 · hive_hab · 佩尔 · time{h:1}
佩尔在楼梯间卖再生咖啡，一杯掺三成水。“今天免费，”他咧嘴笑，“万一咱俩被抽中，就当我的遗产。” / 他妹妹米娜躲在他身后，指尖结着一层薄霜。
from: imp_101 ⟵ “先去楼梯间找佩尔” | imp_102 ⟵ “问他名单上还有谁”
flags on arrival — MUST: origin_hive · MAY-only: ∅
certainly visited before (nearest 6): imp_101
  1. “接过咖啡，聊点别的” → imp_104 eff{sanity:5} ⇒ 咖啡烫嘴，淡得像刷锅水。你们聊下巢的赛鼠，谁都没提名单。
  2. “盯着米娜的手” → imp_105 eff{set:{sawMina:true}} ⇒ 霜花在她指缝间长成细小的蕨叶。楼梯间好像冷了两度。

### imp_o_agri_2 · ch1 · jungle · 什一税官 · time{d:3}
什一税官来了。他数完粮仓，又数了一遍人。 / “麦子差三成，”他说，“配额可以用别的东西补。” / 笔尖在你家的名字上停住。父亲握紧了镰刀，又慢慢松开。
on enter:   codex:imp_tithe
from: imp_o_agri_1 ⟵ “弯腰用镰刀割” | imp_o_agri_1 ⟵ “钻到收割机底下修”
flags on arrival — MUST: origin_agri · MAY-only: ∅
certainly visited before (nearest 6): imp_o_agri_1
  1. ““我去。把麦子的数抹平。”” → imp_o_agri_3 eff{renown:5,set:{volunteered:true}} ⇒ 税官在名册上画了个勾，像在核对一袋麦子。父亲转身进了屋。
  2. “把粮仓的暗格指给他” → imp_o_agri_3 eff{sanity:-10,set:{gaveStash:true}} ⇒ 他收走了暗格里的麦子，笔尖却没离开你的名字。“配额就是配额。”

### imp_o_noble_2 · ch1 · hive_spire · 旁白 · time{h:1}
“家族欠总督府一笔什一税，”父亲说，“按惯例，我们该给你买个军官衔。” / 他推来一份文件，签名栏空着。 / “可衔位太贵了。这一次，你得从列兵做起。”
on enter:   codex:imp_tithe
from: imp_o_noble_1 ⟵ “举杯，等他开口” | imp_o_noble_1 ⟵ “先问他要什么”
flags on arrival — MUST: origin_noble · MAY-only: ∅
certainly visited before (nearest 6): imp_o_noble_1
  1. “签字” → imp_o_noble_3 eff{renown:5,set:{signedTithe:true}} ⇒ 笔尖划过纸面，墨水是家族的蓝色。父亲吹干字迹，没再看你。
  2. “求他再卖掉点什么” → imp_o_noble_3 eff{sanity:-5} ⇒ 父亲指了指墙上那些空着的钉子。能卖的早就卖了。你签了字。

### imp_104 · ch1 · cathedral · 哈洛执事 · time{h:3}
广场挤满了人。哈洛执事念着名单，语气像在感恩祷告：“……佩尔·奥斯特。还有你。” / 他抬起头：“赞美帝皇，你们被选中了。”有人鼓掌，有人哭。
on enter:   codex:imp_ecclesiarchy
from: imp_102 ⟵ “低头干活” | imp_103 ⟵ “接过咖啡，聊点别的” | imp_105 ⟵ “替他们保密” | imp_106 ⟵ “去广场听名单”
flags on arrival — MUST: origin_hive · MAY-only: hidMina, reportedMina, sawMina, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_101
  1. “接受命运” → imp_107 eff{renown:3} ⇒ 你走上台阶，执事在你额头点了一滴圣油。人群里有人喊你的名字，你没看清是谁。
  2. “趁乱钻进排污管” ROLL p=0.4+hp ✓imp_108 ✗imp_109 ⇒✓ 你趁人群推搡掀开格栅，滑进黑暗。头顶的赞美诗越来越远。 ⇒✗ 你钻进了管道，身后却响起靴子声。他们早就在下面等着了。

### imp_105 · ch1 · hive_hab · 佩尔 · time{h:1}
米娜把手缩进袖子。“别说出去，”佩尔压低声音，“上个月她梦见三号塔塌了，第二天就塌了。” / 走廊尽头，执事在贴告示：举报巫者，赏一周口粮。
on enter:   codex:imp_psyker
from: imp_103 ⟵ “盯着米娜的手”
flags on arrival — MUST: origin_hive, sawMina · MAY-only: ∅
certainly visited before (nearest 6): imp_103, imp_101
  1. “替他们保密” → imp_104 eff{sanity:-5,set:{hidMina:true}} ⇒ 你点了点头。从那以后，每次看见执事，你的后颈都会冒冷汗。
  2. “去找执事” → imp_106 eff{renown:5,set:{reportedMina:true,wronged_mina:true,wronged_pell:true}} ⇒ 你在走廊尽头拉住执事的袖子。说出米娜的名字时，你的声音比想象中平静。走廊另一头，佩尔全看见了。

### imp_o_agri_3 · ch1 · jungle · 旁白 · time{h:20}
临走前，母亲往你口袋里塞了一把麦种。“到了哪儿，都找块土。” / 父亲没出来送。走出很远，你回头看见他站在穹顶裂缝下，替你割完了最后一垄。
from: imp_o_agri_2 ⟵ ““我去。把麦子的数抹平。”” | imp_o_agri_2 ⟵ “把粮仓的暗格指给他”
flags on arrival — MUST: origin_agri · MAY-only: gaveStash, volunteered
certainly visited before (nearest 6): imp_o_agri_2, imp_o_agri_1
  1. “攥紧麦种” → imp_o_agri_4 eff{sanity:5,set:{agriSeeds:true}} ⇒ 麦种有点潮，还带着穹顶里的温度。你一路都没松手。
  2. “把麦种留给她” → imp_o_agri_4 eff{renown:3} ⇒ “明年的地比我更需要它们。”你把麦种放回她手里。她没再坚持。

### imp_o_noble_3 · ch1 · hive_spire · 旁白 · time{d:1}
出发前三天，哥哥在走廊里等你。他穿着一身崭新的军官制服，是为下个月的宴会订做的。 / “我会替你祈祷，”他说，“每天。” / 他把家族戒指塞进你手里，戒面上是那座塔和那柄断剑。
from: imp_o_noble_2 ⟵ “签字” | imp_o_noble_2 ⟵ “求他再卖掉点什么”
flags on arrival — MUST: origin_noble · MAY-only: signedTithe
certainly visited before (nearest 6): imp_o_noble_2, imp_o_noble_1
  1. “收下戒指” → imp_o_noble_4 eff{renown:3,set:{serrinRing:true},taint:{slaanesh:15}} ⇒ 戒指有点大，你把它穿在绳子上挂在脖子里。哥哥松了口气，像卸下了一笔账。
  2. ““留着还债吧。”” → imp_o_noble_4 eff{sanity:5} ⇒ 哥哥攥着戒指站了很久。走廊尽头，他的影子比他矮了一截。

### imp_106 · ch1 · hive_hab · 哈洛执事 · time{h:10}
执事给了你一张口粮券，拍了拍你的头，像奖励一条好狗。 / 当晚，一艘不亮灯的黑船悬在尖塔上空。此后很久，佩尔都没跟你说过一句话。
on enter: {sanity:-5}  codex:imp_black_ships
from: imp_105 ⟵ “去找执事”
flags on arrival — MUST: origin_hive, reportedMina, sawMina, wronged_mina, wronged_pell · MAY-only: ∅
certainly visited before (nearest 6): imp_105, imp_103, imp_101
  1. “去广场听名单” → imp_104

### imp_107 · ch1 · ship_interior · 旁白 · time{h:14}
运兵车升离巢都时，你第一次看见天空——黄色的，像一道旧伤。 / 佩尔把额头贴在舷窗上，自言自语：“听说外面的星球有真正的雨。” / 没人告诉他，有些雨是酸的。
on enter:   codex:place_imp_troopship
from: imp_104 ⟵ “接受命运” | imp_109 ⟵ “被押上运兵车”
flags on arrival — MUST: origin_hive · MAY-only: deserter, hidMina, marked, reportedMina, sawMina, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_104, imp_101
  1. “闭上眼睛” → imp_201 eff{sanity:5} ⇒ 你闭上眼听着引擎轰鸣，居然睡着了。梦里没有天空。
  2. “一直看着巢都变小” → imp_201 eff{renown:2} ⇒ 巢都缩成一根针，又缩成一个点。你在心里为那个点念了一句祷词。

### imp_108 · ch1 · underhive · 旁白 · time{d:3}
你一路往下钻。下巢的空气是甜的，甜得发腥。 / 第三天，你饿得啃完了靴带。一个独眼拾荒者递来一块肉：“别问是什么肉。” / 远处传来执法官的哨声。他们在清扫配额。
on enter: {hp:-10,set:{deserter:true}}
from: imp_104(success) ⟵ “趁乱钻进排污管”
flags on arrival — MUST: origin_hive · MAY-only: hidMina, reportedMina, sawMina, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_104, imp_101
  1. “吃下去” → imp_109 eff{hp:10,corruption:3,taint:{nurgle:15}} ⇒ 肉有股甜味，跟这里的空气一样甜。你没问，他也没说。
  2. “摇头，继续躲” → imp_109 eff{hp:-5} ⇒ 你蜷进一截废管道，胃拧成了一团。哨声越来越近。

### imp_109 · ch1 · underhive · 执法官 · time{h:2}
电棍在你肋下停了一秒。 / “逃兵？”执法官翻着记录板，“不对。配额还差一个，所以你是志愿者。” / 你的档案上多了一个红色印章。
on enter: {hp:-10,set:{marked:true}}  codex:imp_arbites
from: imp_104(fail) ⟵ “趁乱钻进排污管” | imp_108 ⟵ “吃下去” | imp_108 ⟵ “摇头，继续躲”
flags on arrival — MUST: origin_hive · MAY-only: deserter, hidMina, reportedMina, sawMina, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_104, imp_101
  1. “被押上运兵车” → imp_107 ⇒ 车厢里挤满了被抽中的人。佩尔看见你，愣了一下，往旁边挪了挪。

### imp_o_agri_4 · ch1 · barracks · 征兵医官 · time{d:2}
巢都底层的征兵站。医官掰开你的嘴看牙，又翻过你的手。 / “种地的？”他在表格上打了个勾，“手上有茧，背是直的。比巢都里长大的强。” / 他压低声音：“别跟他们说你见过天。巢都人会嫉妒。”
from: imp_o_agri_3 ⟵ “攥紧麦种” | imp_o_agri_3 ⟵ “把麦种留给她”
flags on arrival — MUST: origin_agri · MAY-only: agriSeeds, gaveStash, volunteered
certainly visited before (nearest 6): imp_o_agri_3, imp_o_agri_2, imp_o_agri_1
  1. “点头，把手揣进兜里” → imp_o_agri_5 ⇒ 你把手插进兜里，摸到了口袋底的麦糠。医官已经在喊下一个了。
  2. “问他巢都人什么样” → imp_o_agri_5 eff{sanity:-3} ⇒ “跟你一样，”他说，“只是没见过太阳。”他顿了顿，“大部分也见不到了。”

### imp_o_noble_4 · ch1 · cathedral · 告解神父 · time{d:2}
家族礼拜堂里，告解神父把赛伦家徽绣进你的军服内衬，一针一针。 / “下面的人不认这个，”他说，“但帝皇认。” / 他又递来一本金边祈祷书。在下巢，这样一本书能换一个月口粮。
on enter:   codex:imp_ecclesiarchy
from: imp_o_noble_3 ⟵ “收下戒指” | imp_o_noble_3 ⟵ ““留着还债吧。””
flags on arrival — MUST: origin_noble · MAY-only: serrinRing, signedTithe
certainly visited before (nearest 6): imp_o_noble_3, imp_o_noble_2, imp_o_noble_1
  1. “撕掉金边再带上” → imp_o_noble_5 eff{sanity:5} ⇒ 神父看着你撕，没有阻止。“聪明，”他叹气，“下面的人会为了金子割喉咙。”
  2. “原样收下，留住家族的体面” → imp_o_noble_5 eff{renown:5,set:{giltBook:true},taint:{slaanesh:25}} ⇒ 金边在烛光下闪闪发亮。你把书贴身收好，像揣着一小块尖塔。

### imp_o_agri_5 · ch1 · ship_interior · 佩尔 · time{d:1}
运兵车里全是巢都人，脸白得像没晒过太阳。一个叫佩尔的递来一杯再生咖啡，掺了三成水。 / “今天免费，”他咧嘴笑，“万一咱俩都死了，就当我的遗产。” / 他盯着你晒黑的手：“你见过天？”
on enter:   codex:place_imp_troopship
from: imp_o_agri_4 ⟵ “点头，把手揣进兜里” | imp_o_agri_4 ⟵ “问他巢都人什么样”
flags on arrival — MUST: origin_agri · MAY-only: agriSeeds, gaveStash, volunteered
certainly visited before (nearest 6): imp_o_agri_4, imp_o_agri_3, imp_o_agri_2, imp_o_agri_1
  1. “跟他讲穹顶外的天” → imp_201 eff{sanity:5} ⇒ 你讲黄色的天、裂开的玻璃、风吹过麦浪。佩尔听得忘了喝咖啡。
  2. ““见过。没什么好看的。”” → imp_201 ⇒ 佩尔不信，趴在舷窗上看了一路。下船时他说你骗人，天好看极了。

### imp_o_noble_5 · ch1 · ship_interior · 佩尔 · time{d:3}
运兵车里没人知道你是谁，直到你掏出那本祈祷书。 / 一个叫佩尔的年轻人吹了声口哨，递来一杯掺水的再生咖啡：“尖塔上来的？今天免费。就当我巴结过贵人。” / 周围的人都笑了。
on enter:   codex:place_imp_troopship
from: imp_o_noble_4 ⟵ “撕掉金边再带上” | imp_o_noble_4 ⟵ “原样收下，留住家族的体面”
flags on arrival — MUST: origin_noble · MAY-only: giltBook, serrinRing, signedTithe
certainly visited before (nearest 6): imp_o_noble_4, imp_o_noble_3, imp_o_noble_2, imp_o_noble_1
  1. “跟着笑，接过咖啡” → imp_201 eff{sanity:5} ⇒ 咖啡淡得像刷锅水。你一口喝完，说比家里的好喝。佩尔笑得差点呛着。
  2. ““现在我是列兵。”” → imp_201 eff{renown:2} ⇒ 佩尔挑挑眉，把杯子塞进你手里：“那就喝吧，列兵。”

### imp_201 · ch2 · barracks · 沃斯克中士 · time{d:2}
沃斯克中士只有一只眼，但她能看见你枪管里的每一粒灰。 / “激光枪不是武器，是你的老婆、你的神龛、你的命。”她把枪塞给你，“擦亮。它比你值钱。”
on enter:   codex:imp_guard,imp_lasgun
from: imp_107 ⟵ “闭上眼睛” | imp_107 ⟵ “一直看着巢都变小” | imp_o_agri_5 ⟵ “跟他讲穹顶外的天” | imp_o_agri_5 ⟵ ““见过。没什么好看的。”” | imp_o_noble_5 ⟵ “跟着笑，接过咖啡” | imp_o_noble_5 ⟵ ““现在我是列兵。””
flags on arrival — MUST: ∅ · MAY-only: agriSeeds, deserter, gaveStash, giltBook, hidMina, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, wronged_mina, wronged_pell
  1. “认真擦枪” → imp_202 eff{renown:3} ⇒ 你擦到枪管能照出人影。沃斯克路过时停了半秒。在她那里，这就算表扬。
  2. “问她眼睛怎么没的” → imp_203

### imp_202 · ch2 · barracks · 德拉维克政委 · time{d:20}
训练第二十天。一个新兵扔下枪，哭着说想回家。 / 德拉维克政委走了过去。你没看见发生了什么，只听见一声枪响。 / 她走回来时，正不紧不慢地换着弹匣。
on enter: {sanity:-5,set:{sawExecution:true}}  codex:imp_commissar
from: imp_201 ⟵ “认真擦枪” | imp_203 ⟵ “记住了”
flags on arrival — MUST: ∅ · MAY-only: agriSeeds, deserter, gaveStash, giltBook, hidMina, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_201
  1. “立正，目视前方” → imp_204 eff{renown:3} ⇒ 你盯着前方一块污渍，盯到它成了整个世界。政委从你身边经过，脚步没停。
  2. “去看看那个新兵” → imp_204 eff{sanity:-5,renown:-2} ⇒ 他很年轻，脸朝下，手里攥着一封没寄出去的信。中士揪着领子把你拽回了队列。

### imp_203 · ch2 · barracks · 沃斯克中士 · time{h:1}
“兽人。”她说，“它咬掉我眼睛的时候在笑。兽人打仗不为赢，为了开心。” / 她顿了顿，“所以，别让它们开心。”
on enter:   codex:xenos_ork
from: imp_201 ⟵ “问她眼睛怎么没的”
flags on arrival — MUST: ∅ · MAY-only: agriSeeds, deserter, gaveStash, giltBook, hidMina, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_201
  1. “记住了” → imp_202 eff{sanity:3} ⇒ “很好。”她敲了敲你的头盔，力气大得让你牙齿打颤。那晚你睡得出奇地好。

### imp_204 · ch2 · ship_interior · 奎尔-7神甫 · time{d:6}
运兵舰机库里，一个机仆在搬弹药箱，嘴里反复哼着半句摇篮曲。 / “它以前是罪犯，”奎尔-7神甫说，“或者欠债的。区别不大。机魂需要双手。”
on enter:   codex:imp_servitor,imp_mechanicus,place_imp_troopship
from: imp_202 ⟵ “立正，目视前方” | imp_202 ⟵ “去看看那个新兵”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, deserter, gaveStash, giltBook, hidMina, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_202, imp_201
  1. “哼出摇篮曲的下一句” → imp_206 eff{sanity:-5,set:{lullaby:true}} ⇒ 那首歌你母亲唱过。旋律自己从喉咙里爬了出来。
  2. “请神甫祝福你的枪” → imp_207

### imp_206 · ch2 · ship_interior · 机仆 · time{h:1}
你哼出下一句。机仆停住了，箱子悬在半空。 / 它转过那张缝合过的脸，看了你很久。 / 然后它继续搬箱子，哼的还是那半句。
from: imp_204 ⟵ “哼出摇篮曲的下一句”
flags on arrival — MUST: lullaby, sawExecution · MAY-only: agriSeeds, deserter, gaveStash, giltBook, hidMina, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_204, imp_202, imp_201
  1. “走开” → imp_208 ⇒ 你走出机库很远，那半句调子还在耳朵里打转。

### imp_207 · ch2 · ship_interior · 奎尔-7神甫 · time{h:1}
“机器不会坏，只会生气。”奎尔-7往你的枪托上抹了一道圣油，念了三句二进制祷文。 / “现在它原谅你上次摔了它。” / 他看起来是认真的。
on enter: {renown:3,set:{blessedGun:true}}
from: imp_204 ⟵ “请神甫祝福你的枪”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, deserter, gaveStash, giltBook, hidMina, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_204, imp_202, imp_201
  1. “谢谢神甫” → imp_208

### imp_208 · ch2 · warp · 旁白 · time{d:30,warp:true} · eventRoll 0.49
跃迁警报响了。舷窗全部封死。 / 你仍然听见有东西在外面敲船壳，很有礼貌，像在问能不能进来。 / 铺位上的老兵用被子蒙住头：“别回答。千万别回答。”
on enter: {sanity:-5}  codex:imp_navigator,chaos_warp
from: imp_206 ⟵ “走开” | imp_207 ⟵ “谢谢神甫”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, deserter, gaveStash, giltBook, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_204, imp_202, imp_201
  1. “握紧祈祷书” → imp_209 eff{sanity:5,renown:2,taint:{all:-5}} ⇒ 你一页一页地念，念到嗓子发干。敲门声没停，但你不再听得见它。
  2. “把耳朵贴上船壳” → imp_210 eff{sanity:-10,corruption:5,taint:{tzeentch:40}} ⇒ 船壳冰得像墓碑。敲门声就在你耳朵另一边，一下，又一下，越来越近。

### imp_209 · ch2 · ship_interior · 沃斯克中士 · time{d:1}
出亚空间时，日历跳了。有人说过了一个月，有人说过了半年。 / 沃斯克只问一句：“死了几个？” / “三个，长官。没人知道怎么死的。” / “那就是正常航行。”
on enter: {sanity:5}
from: imp_208 ⟵ “握紧祈祷书” | imp_210 ⟵ “什么都别说”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, deserter, gaveStash, giltBook, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_208, imp_204, imp_202, imp_201
  1. “准备登陆” → imp_301 ⇒ 沃斯克看着舷窗外的尘落星：“打散的绿皮会往海湾那边飘。到时候，就是那边异形的麻烦了。”

### imp_210 · ch2 · warp · 旁白 · time{h:3,warp:true}
敲门声停了。一个声音用你母亲的语调说：“你冷吗？” / 回过神时，佩尔正死死掐着你的胳膊。 / 你的嘴唇在动。你不知道自己刚才答应了什么。
on enter: {set:{warpWhisper:true},taint:{tzeentch:20}}
from: imp_208 ⟵ “把耳朵贴上船壳”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, deserter, gaveStash, giltBook, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_208, imp_204, imp_202, imp_201
  1. “什么都别说” → imp_209 ⇒ 佩尔看着你，你摇了摇头。他再也没问过。

### imp_301 · ch3 · trench · 沃斯克中士 · time{d:4} · eventRoll 0.42
尘落星。战壕里的水没过脚踝，远处传来引擎轰鸣和走调的歌声。 / “兽人在唱歌，”沃斯克说，“说明它们心情很好。” / 她把一颗手雷放进你手里，像给小孩一块糖。
on enter:   codex:xenos_ork,xenos_waaagh,place_dustfall
from: imp_209 ⟵ “准备登陆”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, deserter, gaveStash, giltBook, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_209, imp_208, imp_204, imp_202, imp_201
  1. “守在射击位上” → imp_302
  2. “去补给点多领电池” → imp_302 eff{hp:-5,set:{extraAmmo:true}} ⇒ 你在泥水里跑了个来回，摔了两跤，怀里多了四个电池。军需官骂你的话够写一本书。

### imp_302 · ch3 · trench · 旁白 · foe:ork · time{h:3}
它们来了。绿色的潮水，扛着比你还大的枪，边冲边笑。 / 你开火。激光枪像手电一样一闪一闪，那东西中了五枪还在跑。 / “打头！”有人喊，“那是它们唯一算得上器官的地方！”
on enter: {hp:-10}
from: imp_301 ⟵ “守在射击位上” | imp_301 ⟵ “去补给点多领电池”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, deserter, extraAmmo, gaveStash, giltBook, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_301, imp_209, imp_208, imp_204, imp_202, imp_201
  1. “瞄准头部” ROLL p=0.5+hp ✓imp_304 ✗imp_305 ⇒✓ 你屏住呼吸，等那颗绿脑袋冲进准星。扣扳机的那一下，手指一点没抖。 ⇒✗ 你的第一枪打掉了它一只耳朵。它笑得更开心了。
  2. “扔出手雷，趴下” → imp_304 eff{hp:-10,renown:2,taint:{khorne:20}} ⇒ 手雷炸开，泥浆和碎片泼了你一背。你抬起头，还有一个绿影在往前冲。

### imp_304 · ch3 · trench · 佩尔 · foe:ork · time{h:1}
兽人倒在你一臂远的地方，倒下前还冲你竖了个大拇指。 / 佩尔趴在你旁边，笑得发抖：“它在夸你！它在夸你！” / 你没笑。你的手停不下来。
on enter: {renown:5,sanity:-5}
from: imp_302(success) ⟵ “瞄准头部” | imp_302 ⟵ “扔出手雷，趴下”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, deserter, extraAmmo, gaveStash, giltBook, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_302, imp_301, imp_209, imp_208, imp_204, imp_202
  1. “重新装填” → imp_306

### imp_305 · ch3 · trench · 沃斯克中士 · foe:ork · time{h:1}
一把砍刀从烟里劈下来。 / 醒来时你躺在战壕底，沃斯克正往你肩膀上倒酒精。 / “帝皇今天不收你，”她说，“嫌你太吵。”
on enter: {hp:-20}
from: imp_302(fail) ⟵ “瞄准头部”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, deserter, extraAmmo, gaveStash, giltBook, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_302, imp_301, imp_209, imp_208, imp_204, imp_202
  1. “咬牙爬起来” → imp_306

### imp_306 · ch3 · trench · 德拉维克政委 · foe:ork_boss · time{h:2}
一个兽人军阀踏过铁丝网，大得像一座会走路的锅炉。第一排崩了，有人往后跑。 / 德拉维克政委站上胸墙，拔出手枪。她没喊口号，只是看着那些逃跑的人。
on enter: {sanity:-5}  codex:xenos_ork_warboss
from: imp_304 ⟵ “重新装填” | imp_305 ⟵ “咬牙爬起来”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, deserter, extraAmmo, gaveStash, giltBook, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_302, imp_301, imp_209, imp_208, imp_204, imp_202
  1. “冲上去堵缺口” ROLL p=0.4+hp ✓imp_307 ✗imp_308 ⇒✓ 你从阵亡者身上抓起手雷，边跑边拧成一捆。军阀没注意到这么小的东西。 ⇒✗ 冲到它跟前你才发现，自己只到它的腰带。
  2. “守住原位开火” → imp_309
  3. “跟着人群跑” → imp_310 eff{renown:-5} ⇒ 你扔下阵地，跟着人群往后挤。没人回头，也没人说话。

### imp_307 · ch3 · trench · 德拉维克政委 · foe:ork_boss · time{h:1}
你把集束手雷塞进锅炉般的胸甲缝，然后扑倒。 / 爆炸后，军阀的半个头盔落在你脚边。政委看了你一眼，在本子上记了一笔。 / 这是第一次有人记住你。
on enter: {renown:10,set:{hero:true},taint:{khorne:30}}
from: imp_306(success) ⟵ “冲上去堵缺口”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, deserter, extraAmmo, gaveStash, giltBook, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_306, imp_302, imp_301, imp_209, imp_208, imp_204
  1. “撑着站起来” → imp_311

### imp_308 · ch3 · trench · 旁白 · foe:ork_boss · time{h:1}
军阀一巴掌把你扇进弹坑。你听见骨头响，是你自己的。 / 最后是坦克把它轰倒的。没人记得你冲过，但医护兵记得你骂的每一句脏话。
on enter: {hp:-25,renown:3}
from: imp_306(fail) ⟵ “冲上去堵缺口”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, deserter, extraAmmo, gaveStash, giltBook, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_306, imp_302, imp_301, imp_209, imp_208, imp_204
  1. “让他们抬你走” → imp_311

### imp_309 · ch3 · trench · 佩尔 · time{h:5}
你守着射击位，换了一个又一个电池。兽人退下去时，天已经黑了。 / 佩尔坐在空电池堆里掰着手指：“七个。我数了，我打中了七个。” / 他只剩九根手指了。
(grudgeLine pell: 他数到一半才看见你，抿紧嘴，把流血的手往身后藏。)
on enter: {renown:3,sanity:-5,hp:-5}
from: imp_306 ⟵ “守住原位开火” | imp_310 ⟵ “转身回到阵线”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, deserter, extraAmmo, gaveStash, giltBook, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wavered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_306, imp_302, imp_301, imp_209, imp_208, imp_204
  1. “帮他包扎” → imp_311 eff{sanity:5} grudge(pell) ⇒ 你撕下袖子给他缠手。他一直在数，数到七就从头再来。

### imp_310 · ch3 · trench · 德拉维克政委 · time{h:1}
你跑了二十步，身后一声枪响，身边的人倒下了。 / 德拉维克的声音不大，却像贴在你耳边：“下一个。” / 你还来得及停下。
on enter: {sanity:-5}
from: imp_306 ⟵ “跟着人群跑”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, deserter, extraAmmo, gaveStash, giltBook, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_306, imp_302, imp_301, imp_209, imp_208, imp_204
  1. “转身回到阵线” → imp_309 eff{set:{wavered:true}} ⇒ 你转过身，迎着政委的枪口走回去。那枪口一路跟着你，直到你趴回射击位。
  2. “继续跑” ROLL p=0.65 ✓imp_311 ✗imp_end_commissar ⇒✓ 你翻过土坡，滚进一辆救护车的阴影里。身后又响了一枪，倒下的不是你。 ⇒✗ 你跑得很快。你觉得已经够快了。

### imp_311 · ch3 · barracks · 阿诺医师 · time{d:9}
野战医院。阿诺医师给你缝针，嘴里叼着一根没点着的烟。 / “兽人死了会撒孢子，”他说，“明年这里会长出更多兽人。我们不是在打仗，是在除草。”
on enter: {hp:25}
from: imp_310(success) ⟵ “继续跑” | imp_307 ⟵ “撑着站起来” | imp_308 ⟵ “让他们抬你走” | imp_309 ⟵ “帮他包扎”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, deserter, extraAmmo, gaveStash, giltBook, hero, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wavered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_306, imp_302, imp_301, imp_209, imp_208, imp_204
  1. “好好睡一觉” → imp_401 eff{sanity:10} ⇒ 你睡了整整十四个小时，没有做梦。醒来时，邻床已经换了三个人。
  2. “多要点止痛药” → imp_401 eff{hp:10,sanity:-5,taint:{nurgle:20}} ⇒ 阿诺多给了你两支。疼痛退得很远，远到这副身体好像不是你的。

### imp_end_commissar · ch3 · trench · 随军牧师 · time{d:1} · **ENDING bad**
你没听见第二声枪响。 / 第二天的阵亡名单上，你的名字后面写着两个字：怯战。 / 随军牧师念到这里没有停顿，语气仍然是感恩的。
ending: 「政委的子弹」 cause: 临阵脱逃，被政委处决
from: imp_310(fail) ⟵ “继续跑”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, deserter, extraAmmo, gaveStash, giltBook, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_310, imp_306, imp_302, imp_301, imp_209, imp_208

### imp_401 · ch4 · ruins · 旁白 · time{y:1} · eventRoll 0.42
一年过去了。团里换了三拨新兵，你已经能闭着眼拆枪。 / 部队驻防在雨城维瑟尔。城里人很和善，太和善了。送汤的布琳婆婆每天都来，从不收钱。
on enter: {sanity:15,hp:10}  codex:place_vessel
from: imp_311 ⟵ “好好睡一觉” | imp_311 ⟵ “多要点止痛药”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, deserter, extraAmmo, gaveStash, giltBook, hero, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wavered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_311, imp_306, imp_302, imp_301, imp_209, imp_208
  1. “喝下那碗汤” → imp_402 eff{hp:5,corruption:5,taint:{nurgle:25}} ⇒ 你接过碗。布琳在你身边坐下，看着你喝，像看着自己的孩子。
  2. “趁她不注意倒掉” → imp_403

### imp_402 · ch4 · hive_hab · 布琳婆婆 · time{h:1}
汤很好喝，带点铁锈味。布琳握着你的手：“孩子，你的帝皇在金椅子上坐了一万年，看过你一眼吗？” / 她笑了，“我们的神会看你。”
on enter:   codex:chaos_cult
from: imp_401 ⟵ “喝下那碗汤”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, deserter, extraAmmo, gaveStash, giltBook, hero, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wavered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_401, imp_311, imp_306, imp_302, imp_301, imp_209
  1. “她说得……有点道理” → imp_404 eff{corruption:10,taint:{nurgle:40},set:{cultTouched:true}} ⇒ 你没有抽回手。布琳笑得更深了：“今晚来地窖，带上你的问题。”
  2. “去报告政委” → imp_405 ⇒ 你放下碗，径直去找政委。她听完，只点了一下头。

### imp_403 · ch4 · ruins · 旁白 · time{h:2}
你把汤倒进排水沟。一只老鼠喝了几口，没死，反而长出了第三只眼睛，好奇地看着你。 / 你决定今晚不睡了。
on enter: {sanity:-5}  codex:chaos_mutant
from: imp_401 ⟵ “趁她不注意倒掉”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, deserter, extraAmmo, gaveStash, giltBook, hero, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wavered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_401, imp_311, imp_306, imp_302, imp_301, imp_209
  1. “跟踪布琳” → imp_404
  2. “去报告政委” → imp_405 ⇒ 你找到政委，说了老鼠和那第三只眼。她没笑。

### imp_404 · ch4 · cult_shrine · 镜面人 · time{d:2}
你跟着布琳下了地窖。烛光里，几十个人念着一个你听不懂的名字，像一个人在说话。 / 台上的人戴着镜面面具：“欢迎。你一直在听，对吗？在船上，那个敲门声。”
on enter: {sanity:-5,corruption:5}
from: imp_402 ⟵ “她说得……有点道理” | imp_403 ⟵ “跟踪布琳”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, cultTouched, deserter, extraAmmo, gaveStash, giltBook, hero, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wavered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_401, imp_311, imp_306, imp_302, imp_301, imp_209
  1. “接过他递来的匕首” → imp_407 eff{corruption:10,taint:{tzeentch:40},set:{cultist:true}} ⇒ 你伸出手。念诵声戛然而止，几十双眼睛同时转向你。
  2. “假装入会，打探消息” → imp_408 ⇒ 你学着他们的样子低下头。镜面人看了你很久，面具里映着你自己的脸。
  3. “转身冲出地窖” → imp_405 eff{sanity:-5} ⇒ 你撞翻蜡烛冲上台阶，没人追。他们只是一起笑了一声。

### imp_405 · ch4 · cathedral · 哈克审判官 · time{h:4}
政委一言不发，把你带进大教堂的告解室。里面坐着的不是神父。 / “哈克审判官。”她手里转着一枚旧硬币，“说说那碗汤。慢慢说，我们有一整晚。”
on enter:   codex:imp_inquisition
from: imp_402 ⟵ “去报告政委” | imp_403 ⟵ “去报告政委” | imp_404 ⟵ “转身冲出地窖” | imp_407 ⟵ “把匕首交给政委”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, gaveStash, giltBook, hero, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wavered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_401, imp_311, imp_306, imp_302, imp_301, imp_209
  1. “全说出来” → imp_412 eff{renown:5,taint:{all:-10},set:{toldInq:true,wronged_brin:true}} ⇒ 你说了汤、地窖、布琳的名字，还有那个念不出的名字。哈克一直在转硬币，直到你说完才停。
  2. “隐瞒自己喝过的部分” ROLL p=0.6 ✓imp_412 ✗imp_411 ⇒✓ 你讲得滴水不漏。哈克的硬币顿了一下，又接着转。 ⇒✗ 讲到一半，那股铁锈味又涌上了喉咙。哈克的硬币停住了。

### imp_407 · ch4 · cult_shrine · 镜面人 · time{h:3}
匕首很轻，像本来就是你的。 / “明晚换岗时，有朋友从天上来，”镜面人说，“你只需要打开城门。” / 你的旧伤不疼了。一点都不疼了。
on enter: {hp:20,corruption:5,taint:{tzeentch:20}}
from: imp_404 ⟵ “接过他递来的匕首”
flags on arrival — MUST: cultist, sawExecution · MAY-only: agriSeeds, blessedGun, cultTouched, deserter, extraAmmo, gaveStash, giltBook, hero, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wavered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_404, imp_401, imp_311, imp_306, imp_302, imp_301
  1. “去开城门” → imp_410 ⇒ 换岗的钟声响了。你把匕首藏进袖子走向城门，雨水冲掉了你的脚印。
  2. “把匕首交给政委” → imp_405 eff{sanity:-5,set:{confessed:true}} ⇒ 你把匕首放在政委桌上。它在木头上烫出了一道焦痕。

### imp_408 · ch4 · cult_shrine · 旁白 · time{d:5}
你学会了他们的手势和祷词。白天擦枪，夜里念那个名字。每念一次，你就忘掉一点母亲的脸。 / 第五晚，有人在你耳边说：“审判庭想见你。别回头。”
on enter: {corruption:10,sanity:-5,renown:5,taint:{tzeentch:15}}
from: imp_404 ⟵ “假装入会，打探消息”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, cultTouched, deserter, extraAmmo, gaveStash, giltBook, hero, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wavered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_404, imp_401, imp_311, imp_306, imp_302, imp_301
  1. “不回头，跟他走” → imp_412 eff{set:{spy:true,inqCoin:true,wronged_brin:true}} ⇒ 那人往你手心塞了一枚旧硬币：“天亮前带路。”等你回头，巷子里只剩下雨。要去的是布琳的地窖。

### imp_411 · ch4 · cathedral · 哈克审判官 · time{h:6}
哈克蹲下来，盯着你的眼睛，像在读一份很长的报告。 / “你还有用，”她终于说，“只是不需要带着脑子用。” / 她朝机械神教的人点了点头。
on enter: {sanity:-5}
from: imp_405(fail) ⟵ “隐瞒自己喝过的部分” | imp_410 ⟵ “跪下认罪”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, gaveStash, giltBook, hero, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wavered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_401, imp_311, imp_306, imp_302, imp_301, imp_209
  1. “求她再给一次机会” ROLL p=0.6+renown ✓imp_412 ✗imp_end_servitor ⇒✓ 你把这辈子做过的好事全说了一遍。哈克叹了口气，挥手让神甫们退下。 ⇒✗ 哈克耐心听完，看了看时间。神甫们已经在量你的头围了。
  2. “供出镜面人的藏身处” → imp_412 eff{sanity:-10,renown:-5,set:{informer:true,wronged_brin:true}} ⇒ 你说出了地窖的位置，还有布琳的名字。说完，你觉得自己轻了一点，也脏了一点。

### imp_412 · ch4 · cult_shrine · 哈克审判官 · foe:cult_magus · time{h:6}
黎明前，审判庭的人冲进地窖，你在前面带路。 / 镜面人没逃，反而笑了：“你以为她是来救你们的？她会烧掉整座城，连雨一起。” / 哈克一枪打碎了那面镜子。
on enter: {renown:5,sanity:-5}  codex:imp_inquisition
from: imp_408 ⟵ “不回头，跟他走” | imp_405 ⟵ “全说出来” | imp_405(success) ⟵ “隐瞒自己喝过的部分” | imp_411(success) ⟵ “求她再给一次机会” | imp_411 ⟵ “供出镜面人的藏身处”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, gaveStash, giltBook, hero, hidMina, informer, inqCoin, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_401, imp_311, imp_306, imp_302, imp_301, imp_209
  1. “搜查祭坛” → imp_413
  2. “趁乱把布琳推出地窖后门” → imp_415 require{flag:wronged_brin} eff{sanity:-3,renown:-5,taint:{nurgle:12},set:{forgiven_brin:true}} ⇒ 你在人群里认出那条旧头巾，把她推向后门。她回头看了你一眼，没说话，也没道谢。
  3. “去追逃散的信徒” → imp_415 eff{hp:-10,renown:3,taint:{khorne:25}} ⇒ 你在雨里追了三条街，胳膊挨了一菜刀。抓到的那个人，嘴里还在念那个名字。

### imp_410 · ch4 · burning_city · 哈克审判官 · time{h:20}
你的手刚碰到门闩，探照灯就亮了。哈克审判官坐在城墙上晃着腿。 / “谢谢，”她说，“我等这扇门打开等了三周。” / 士兵们举起了枪。佩尔也在里面。
on enter: {sanity:-5}  codex:imp_inquisition
from: imp_407 ⟵ “去开城门”
flags on arrival — MUST: cultist, sawExecution · MAY-only: agriSeeds, blessedGun, cultTouched, deserter, extraAmmo, gaveStash, giltBook, hero, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wavered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_407, imp_404, imp_401, imp_311, imp_306, imp_302
  1. “跪下认罪” → imp_411 ⇒ 你扔下匕首，跪进泥水里。佩尔的枪口垂下一寸，又抬了起来。
  2. “拔出匕首” → imp_end_heretic ⇒ 雨忽然停了。

### imp_413 · ch4 · cult_shrine · 哈克审判官 · time{h:1}
祭坛上刻着一颗八芒星，每道芒尖渗出不同的颜色：血红、腐绿、幻蓝、艳紫。 / 你盯得太久，颜色开始盯着你。哈克捂住你的眼睛：“别数。数完了，你就是他们的了。”
on enter: {sanity:-5,corruption:3,set:{sawAltar:true},taint:{all:10}}  codex:chaos_gods
from: imp_412 ⟵ “搜查祭坛”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, gaveStash, giltBook, hero, hidMina, informer, inqCoin, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_412, imp_401, imp_311, imp_306, imp_302, imp_301
  1. “闭上眼，退后” → imp_415 ⇒ 你闭上眼往后退，差点绊倒。眼皮里，那些颜色还在一圈圈地转。

### imp_415 · ch4 · burning_city · 哈克审判官 · time{d:2}
两天后，维瑟尔上城区被封锁了。哈克说“净化”，政委说“必要”，没人说“烧”。 / 临走前，哈克把那枚旧硬币弹给你：“你眼神不错。哪天我需要一双眼睛，会来找你。”
on enter: {sanity:-5}
from: imp_412 ⟵ “趁乱把布琳推出地窖后门” | imp_412 ⟵ “去追逃散的信徒” | imp_413 ⟵ “闭上眼，退后”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_412, imp_401, imp_311, imp_306, imp_302, imp_301
  1. “收好硬币” → imp_501 eff{set:{inqCoin:true}} ⇒ 硬币比看上去沉。你把它缝进了军服内衬。
  2. “把硬币扔进火里” → imp_501 eff{sanity:5,set:{inqCoin:false}} ⇒ 硬币在火里翻了个身，就不见了。你觉得自己少欠了某个人一点东西。

### imp_end_servitor · ch4 · ship_interior · 机仆 · time{y:3} · **ENDING bad**
很多年后，某艘运兵舰的机库里，一个机仆在搬弹药箱。 / 它一直哼着半句摇篮曲，没人知道下一句。 / 偶尔有新兵停下来看它，好像认出了什么。
ending: 「机魂需要双手」 cause: 被改造成机仆
from: imp_411(fail) ⟵ “求她再给一次机会”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, gaveStash, giltBook, hero, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wavered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_411, imp_401, imp_311, imp_306, imp_302, imp_301

### imp_end_heretic · ch4 · burning_city · 旁白 · time{h:1} · **ENDING bad**
匕首在你手里尖叫，像终于等到了这一刻。 / 后来，维瑟尔的人只记得那晚城门口烧起了一堆火，颜色很奇怪。 / 佩尔没有开枪。他闭上了眼睛。
ending: 「城门之火」 cause: 持邪刃反抗，焚于城门
from: imp_410 ⟵ “拔出匕首”
flags on arrival — MUST: cultist, sawExecution · MAY-only: agriSeeds, blessedGun, cultTouched, deserter, extraAmmo, gaveStash, giltBook, hero, hidMina, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawMina, serrinRing, signedTithe, volunteered, warpWhisper, wavered, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_410, imp_407, imp_404, imp_401, imp_311, imp_306

### imp_501 · ch5 · warp · 领航员 · time{d:50,warp:true} · eventRoll 0.49
第二次跃迁。这一次亚空间很安静，静得不对劲。 / 领航员从舱室里走出来，眼角淌着血，只说了一句：“有个影子挡住了光。很大，很饿。” / 然后他再也没开过口。
on enter: {sanity:-5}  codex:xenos_shadow_in_warp
from: imp_415 ⟵ “收好硬币” | imp_415 ⟵ “把硬币扔进火里”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_415, imp_412, imp_401, imp_311, imp_306, imp_302
  1. “抵达目的地” → imp_502

### imp_502 · ch5 · jungle · 沃斯克中士 · time{d:3}
赫斯珀农业星。麦田一望无际，村庄完好，人却少得吓人。剩下的人很友善，身材矮壮，眼神整齐划一。 / “他们笑得一模一样，”沃斯克低声说，“我不喜欢一模一样的东西。”
on enter:   codex:place_hesper
from: imp_501 ⟵ “抵达目的地”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_501, imp_415, imp_412, imp_401, imp_311, imp_306
  1. “去村里的礼拜堂看看” → imp_503
  2. “去谷仓搜索” → imp_504
  3. “掰开一株麦穗看看” → imp_504 require{flag:origin_agri} eff{sanity:-3,renown:2} ⇒ 麦粒是空的。这片地种了一整季，却没人收割。谷仓的门，从里面闩上了。

### imp_503 · ch5 · cathedral · 年轻神父 · time{h:2}
礼拜堂的帝皇像被人改过：多了一对手臂，背后画着一颗坠落的星。 / 年轻的神父额头有点过高。“救主要来了，”他温柔地说，“从星星上来。我们会被接回家。”
on enter: {sanity:-5}
from: imp_502 ⟵ “去村里的礼拜堂看看”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_502, imp_501, imp_415, imp_412, imp_401, imp_311
  1. “接受他的祝福” → imp_505 ⇒ 你低下头。神父的手掌很软，指甲却很长。
  2. “退出去报告” → imp_506

### imp_504 · ch5 · jungle · 旁白 · foe:genestealer · time{h:2}
谷仓深处窸窸窣窣。手电照到一只四臂的东西，紫色甲壳，爪子像镰刀。 / 它没有扑过来，只是歪了歪头，像在判断你是食物，还是家人。
on enter: {sanity:-5}  codex:xenos_genestealer
from: imp_502 ⟵ “去谷仓搜索” | imp_502 ⟵ “掰开一株麦穗看看”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_502, imp_501, imp_415, imp_412, imp_401, imp_311
  1. “开火” ROLL p=0.45+hp ✓imp_506 ✗imp_507 ⇒✓ 激光连射，紫色甲壳冒起青烟。它尖叫一声，钻进地板下不见了。 ⇒✗ 你扣下扳机。它比激光还快。
  2. “一步一步后退” → imp_506 eff{sanity:-5} ⇒ 你一步一步退出谷仓。它一直歪着头看你，直到门板合上。

### imp_505 · ch5 · cathedral · 年轻神父 · time{h:1}
神父把手放在你头顶。一阵暖意，后颈刺了一下，像被虫子咬。 / “现在你是家人了。” / 你有点困。周围的人都在冲你笑，一模一样的笑。
on enter: {sanity:-5,hp:-5,set:{kissed:true}}  codex:xenos_genestealer
from: imp_503 ⟵ “接受他的祝福”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_503, imp_502, imp_501, imp_415, imp_412, imp_401
  1. “就睡一会儿” ROLL p=0.65+sanity ✓imp_506 ✗imp_end_brood ⇒✓ 你梦见一颗星坠向麦田，尖叫着醒来，人已经在村子外面。你不记得自己是怎么跑出来的。 ⇒✗ 你睡得很沉。梦里有人一遍遍摸着你的头发，叫你“家人”。
  2. “咬破舌头，撞门逃走” → imp_506 eff{hp:-10} ⇒ 血腥味让你清醒过来。你撞开木门，一路跑到看见营地的灯。身后的人还在笑。

### imp_506 · ch5 · barracks · 沃斯克中士 · time{h:3}
你把看见的告诉了沃斯克。她没笑你，立刻呼叫轨道。 / 回电只有一行：“确认虫巢舰队触须，预计四十小时后抵达。坚守。” / “坚守，”她重复，“他们总是这么说。”
on enter:   codex:xenos_tyranid
from: imp_503 ⟵ “退出去报告” | imp_504(success) ⟵ “开火” | imp_504 ⟵ “一步一步后退” | imp_505(success) ⟵ “就睡一会儿” | imp_505 ⟵ “咬破舌头，撞门逃走” | imp_507 ⟵ “撤回营地”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, origin_agri, origin_hive, origin_noble, pellSavedYou, reportedMina, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_502, imp_501, imp_415, imp_412, imp_401, imp_311
  1. “挖战壕” → imp_509 eff{hp:-5} ⇒ 你挖了一天一夜，铲柄磨掉了手上一层皮。战壕很深，深得像坟。
  2. “去礼拜堂祈祷” → imp_509 eff{sanity:5,renown:2,taint:{all:-5}} ⇒ 礼拜堂里只剩几支蜡烛。你点燃一支，祈祷到它烧完。

### imp_507 · ch5 · jungle · 佩尔 · foe:genestealer · time{h:1}
你开了两枪，第三枪还没扣下，它已经扑到眼前。 / 是佩尔把你拖了出来。你胸口多了三道口子，他胳膊少了一块肉。 / “这下扯平了，”他喘着气，“那杯咖啡的事。”
on enter: {hp:-25,set:{pellSavedYou:true}}
from: imp_504(fail) ⟵ “开火”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_504, imp_502, imp_501, imp_415, imp_412, imp_401
  1. “撤回营地” → imp_506

### imp_509 · ch5 · spore_sky · 沃斯克中士 · foe:gaunt · time{h:37}
第四十个小时，天空变成紫色。孢子像雪一样落下，麦田半小时就枯了。 / 然后是几百万只爪子同时落地的声音。 / “没了头领，它们就是蚂蚁，”沃斯克说，“找大的，打大的。”
on enter: {sanity:-5,hp:-10}  codex:xenos_tyranid,xenos_hive_mind
from: imp_506 ⟵ “挖战壕” | imp_506 ⟵ “去礼拜堂祈祷”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, origin_agri, origin_hive, origin_noble, pellSavedYou, reportedMina, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_506, imp_502, imp_501, imp_415, imp_412, imp_401
  1. “跟沃斯克去找大家伙” → imp_510
  2. “守住平民撤离点” → imp_511

### imp_end_brood · ch5 · jungle · 旁白 · foe:genestealer · time{y:6} · **ENDING bad**
你在赫斯珀住了下来，成了家。孩子的皮肤带点紫色，手臂多了两条，你觉得他们完美无缺。 / 某天夜里，天上出现了无数颗星星，越来越近。你带着全家出去迎接。
ending: 「一家人」 cause: 受基因窃取者感染
from: imp_505(fail) ⟵ “就睡一会儿”
flags on arrival — MUST: kissed, sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, lullaby, marked, origin_agri, origin_hive, origin_noble, reportedMina, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_505, imp_503, imp_502, imp_501, imp_415, imp_412

### imp_510 · ch5 · spore_sky · 沃斯克中士 · foe:tyranid_warrior · time{h:2}
那是一只泰伦武士，比人高两倍，挥着骨刃。周围的小虫跟着它一起转向，像同一个身体。 / 沃斯克装上最后一发爆弹——你从不知道她还藏着这个。 / “替我瞄准，”她说，“我只有一只眼。”
on enter:   codex:xenos_tyranid_warrior
from: imp_509 ⟵ “跟沃斯克去找大家伙”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, origin_agri, origin_hive, origin_noble, pellSavedYou, reportedMina, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_509, imp_506, imp_502, imp_501, imp_415, imp_412
  1. “稳住她的枪口” ROLL p=0.5+sanity ✓imp_512 ✗imp_513 ⇒✓ 你托住她的枪管，呼吸跟着她的呼吸。世界缩成了准星里的一个点。 ⇒✗ 一只小虫撞上你的腿。你的手抖了，就一下。

### imp_511 · ch5 · spore_sky · 惊慌的母亲 · time{h:2}
撤离点挤满平民，运输机只能再飞一趟。 / 一个母亲把襁褓塞进你怀里：“带她走。” / 舱门正在关闭。只剩一个位置。
from: imp_509 ⟵ “守住平民撤离点”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, origin_agri, origin_hive, origin_noble, pellSavedYou, reportedMina, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_509, imp_506, imp_502, imp_501, imp_415, imp_412
  1. “把婴儿送上去” → imp_514 eff{renown:5,set:{savedBaby:true}} ⇒ 你把襁褓递进舱门，一只手接住了她。舱门在你鼻尖前合拢。
  2. “自己挤上去” → imp_515 eff{renown:-10,sanity:-10,set:{fledHesper:true},taint:{nurgle:15}} ⇒ 你把襁褓塞回母亲怀里。她没骂你，只是看着你。

### imp_512 · ch5 · spore_sky · 沃斯克中士 · foe:gaunt · time{h:1}
爆弹打碎了泰伦武士的头冠。周围的虫子突然乱了，像断了线的木偶，互相撕咬。 / 沃斯克放下枪：“看见了？砍头。对谁都管用。”
on enter: {renown:8}
from: imp_510(success) ⟵ “稳住她的枪口”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, origin_agri, origin_hive, origin_noble, pellSavedYou, reportedMina, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_510, imp_509, imp_506, imp_502, imp_501, imp_415
  1. “撤向着陆场” → imp_516

### imp_513 · ch5 · spore_sky · 旁白 · foe:tyranid_warrior · time{h:1}
爆弹打偏了。骨刃落下时，沃斯克把你推开了。 / 你最后一次看见她，她在笑，就像她讲过的那个兽人。 / 你捡起了她的眼罩。
on enter: {sanity:-10,hp:-10,set:{voskDead:true}}
from: imp_510(fail) ⟵ “稳住她的枪口”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, origin_agri, origin_hive, origin_noble, pellSavedYou, reportedMina, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_510, imp_509, imp_506, imp_502, imp_501, imp_415
  1. “带着眼罩撤退” → imp_516

### imp_514 · ch5 · spore_sky · 旁白 · foe:gaunt · time{h:4}
运输机带着婴儿起飞了。你在孢子雪里打光了最后一个电池，才被最后一架女武神拖上去。 / 你没看见那位母亲上来。
on enter: {hp:-15,sanity:5}
from: imp_511 ⟵ “把婴儿送上去”
flags on arrival — MUST: savedBaby, sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, origin_agri, origin_hive, origin_noble, pellSavedYou, reportedMina, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_511, imp_509, imp_506, imp_502, imp_501, imp_415
  1. “望着下面的麦田” → imp_516 ⇒ 孢子雪下，麦田变成了紫色，一路紫到地平线。

### imp_515 · ch5 · ship_interior · 德拉维克政委 · time{h:1}
你挤了上去。舱门合上时，外面有人在喊一个名字，也许是那婴儿的。 / 德拉维克政委坐在对面，一路都没看你。 / 这比看你更可怕。
from: imp_511 ⟵ “自己挤上去”
flags on arrival — MUST: fledHesper, sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, origin_agri, origin_hive, origin_noble, pellSavedYou, reportedMina, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_511, imp_509, imp_506, imp_502, imp_501, imp_415
  1. “盯着自己的靴子” → imp_516 ⇒ 你数着靴子上的泥点。数到第三百个，运输机才不再颠簸。

### imp_516 · ch5 · void · 舰队命令 · time{d:1}
第二天，舰队对赫斯珀执行了灭绝令。你从舷窗看着那颗星球燃烧，像一根被摁灭的烟头。 / “虫子吃不到的，就不算输，”一个军官说。 / 没人鼓掌，也没人反对。
on enter: {sanity:-5}  codex:imp_exterminatus
from: imp_512 ⟵ “撤向着陆场” | imp_513 ⟵ “带着眼罩撤退” | imp_514 ⟵ “望着下面的麦田” | imp_515 ⟵ “盯着自己的靴子”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, origin_agri, origin_hive, origin_noble, pellSavedYou, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_509, imp_506, imp_502, imp_501, imp_415, imp_412
  1. “转身离开舷窗” → imp_601 ⇒ 你转过身。那团光在你背后烧了很久，你一直没回头。
  2. “攥紧母亲给的麦种” → imp_601 require{flag:agriSeeds} eff{sanity:5} ⇒ 麦种在掌心硌出了印子。赫斯珀烧完了，可你口袋里还有一整片麦田。

### imp_601 · ch6 · ship_interior · 舰内广播 · time{y:2}
两年，三个团，两次改编。 / 这天舰上所有屏幕同时亮起。光里站着一个巨人的剪影，声音平静：“帝国还活着。我们去把它找回来。” / 老兵们哭了。他们说那是基里曼，帝皇之子。
on enter: {sanity:20,renown:5}  codex:imp_guilliman,imp_indomitus,place_terra
from: imp_516 ⟵ “转身离开舷窗” | imp_516 ⟵ “攥紧母亲给的麦种”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, origin_agri, origin_hive, origin_noble, pellSavedYou, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_516, imp_509, imp_506, imp_502, imp_501, imp_415
  1. “跟大家一起敬礼” → imp_602 require{notFlag:fledHesper} ⇒ 全舰几万人同时抬手，甲板都在震。
  2. “跟大家一起敬礼” → imp_604 require{flag:fledHesper} ⇒ 全舰几万人同时抬手，甲板都在震。
  3. “问老兵他是谁” → imp_603

### imp_602 · ch6 · barracks · 德拉维克政委 · time{d:10}
德拉维克政委把一枚铜徽章别在你领口。 / “下士，”她说，“这意味着以后有人逃跑，由你开枪。” / 她的语气，像在通知今天的口粮是什么。
on enter: {renown:5,set:{corporal:true}}
from: imp_601 ⟵ “跟大家一起敬礼” | imp_603 ⟵ “点点头”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, origin_agri, origin_hive, origin_noble, pellSavedYou, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_601, imp_516, imp_509, imp_506, imp_502, imp_501
  1. “敬礼” → imp_605 ⇒ 你敬了礼。她回礼的动作分毫不差，像一台机器。
  2. “问她有没有后悔过” → imp_605 eff{sanity:-5,set:{askedDravik:true}} ⇒ 她想了很久：“后悔需要时间。我的时间都拿去换弹匣了。”

### imp_603 · ch6 · ship_interior · 独臂老兵 · time{h:1}
“帝皇有二十个儿子，”老兵说，“一半背叛了他，剩下的死的死、丢的丢。这一个挨了一刀，睡了一万年。” / 他擦擦眼睛，“现在他醒了，还给咱们发新枪。这不是神迹是什么？”
on enter:   codex:chaos_horus_heresy
from: imp_601 ⟵ “问老兵他是谁”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, origin_agri, origin_hive, origin_noble, pellSavedYou, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_601, imp_516, imp_509, imp_506, imp_502, imp_501
  1. “点点头” → imp_602 require{notFlag:fledHesper} ⇒ “新枪有了，口粮却减了三成。”他啐了一口，“赫斯珀烧了，瓦尔达的运粮船一年没来，没人说得清。”
  2. “点点头” → imp_604 require{flag:fledHesper} ⇒ “新枪有了，口粮却减了三成。”他啐了一口，“赫斯珀烧了，瓦尔达的运粮船一年没来，没人说得清。”

### imp_604 · ch6 · barracks · 德拉维克政委 · time{d:10}
政委把你叫进办公室，桌上摊着赫斯珀撤离名单。 / “一个座位，”她说，“一个婴儿。”她没拔枪，只是推过来一支笔。 / “签字。下一仗，你去惩戒营第一排。”
on enter: {renown:-5,sanity:-5,set:{penal:true}}
from: imp_601 ⟵ “跟大家一起敬礼” | imp_603 ⟵ “点点头”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, blessedGun, confessed, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, origin_agri, origin_hive, origin_noble, pellSavedYou, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_601, imp_516, imp_509, imp_506, imp_502, imp_501
  1. “签字” → imp_605 ⇒ 笔很沉。你签下名字，她吹干墨迹，把纸收进抽屉。

### imp_605 · ch6 · ship_interior · 米娜 · time{d:3}
一队灵能者被铁链拴着经过走廊。其中一个女孩蒙着眼，指尖结着霜，却准确地转向了你。 / “你住在三号塔附近，”她说，“我梦见过你。你会回家，但家已经着火了。”
(grudgeLine mina: 她顿了顿：“还有一个梦。你站在执事面前，开了口。”)
on enter: {sanity:-5}  codex:imp_psyker
from: imp_602 ⟵ “敬礼” | imp_602 ⟵ “问她有没有后悔过” | imp_604 ⟵ “签字”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, origin_agri, origin_hive, origin_noble, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_601, imp_516, imp_509, imp_506, imp_502, imp_501
  1. “米娜？佩尔一直在找你” → imp_607 require{flag:sawMina} eff{sanity:5,set:{minaMessage:true}} ⇒ 她的嘴角动了一下，像是想笑。“替我告诉他，我不冷。”
  2. “你看见了什么？” → imp_607 grudge(mina)
  3. “离我远点，巫婆” → imp_607 eff{renown:2,sanity:-5} grudge(mina) ⇒ 押送的士兵笑了，用枪托推了她一把。她踉跄一下，还是朝你伸出了手。
  4. ““对不起，米娜。是我说的。”” → imp_607 require{flag:wronged_mina} eff{sanity:-5,set:{forgiven_mina:true}} ⇒ 她没说原谅。只是把结霜的手，轻轻放在你手背上：“我知道。我梦见过。”

### imp_607 · ch6 · warp · 幻象 · time{h:1}
她抓住你的手。一瞬间你看见：故乡的黄色天空裂开，一支黑色舰队从裂口落下，旗舰大得像一座倒悬的城市。 / 舰桥上站着一个身穿黑甲的人，胸前有一只睁开的眼。
(grudgeLine mina: 米娜没有松手。结霜的指尖顺着你的手腕往上爬。)
on enter: {sanity:-5,corruption:3}
from: imp_605 ⟵ “米娜？佩尔一直在找你” | imp_605 ⟵ “你看见了什么？” | imp_605 ⟵ “离我远点，巫婆” | imp_605 ⟵ ““对不起，米娜。是我说的。””
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_605, imp_601, imp_516, imp_509, imp_506, imp_502
  1. “挣开她的手” → imp_608 grudge(mina) ⇒ 你挣开了手，幻象却没走。之后四天，你一闭眼就看见那只眼睛。

### imp_608 · ch6 · ship_interior · 舰长 · time{d:4}
四天后，星语者证实了幻象：黑色军团的远征舰队闯进了奥雷克斯星系。 / “阿巴顿，”舰长说出这个名字时，几个老兵下意识摸了摸胸前的护身符。 / 舰队调头。你要回家了。
on enter:   codex:chaos_abaddon,chaos_black_legion,chaos_black_crusade,place_cadia,chaos_eye_of_terror
from: imp_607 ⟵ “挣开她的手”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_607, imp_605, imp_601, imp_516, imp_509, imp_506
  1. “去找佩尔喝一杯” → imp_610
  2. “去礼拜堂报上家人的名字” → imp_611 eff{renown:5,sanity:-5} ⇒ 执事把名字一个一个写进祈祷簿。写到最后一个，墨水用完了。

### imp_610 · ch6 · barracks · 佩尔 · time{h:3}
佩尔弄来一瓶机油味的私酿。“我一直想回家，”他说，“但不是这样回去。” / 他掏出一张旧口粮券：“要是我先死，替我在楼梯间卖一天咖啡。免费的。”
(grudgeLine pell: 他只给你倒了半杯，没抬头。米娜的事，他一个字也没提。)
on enter: {sanity:10,hp:-5,set:{pellPromise:true}}
from: imp_608 ⟵ “去找佩尔喝一杯”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_608, imp_607, imp_605, imp_601, imp_516, imp_509
  1. “碰杯” → imp_611 grudge(pell) ⇒ 酒难喝得要命。你们一人喝了半瓶，谁也没提回家以后的事。
  2. “转告他：米娜说她不冷” → imp_611 require{flag:minaMessage} eff{sanity:5,set:{forgiven_pell:true}} ⇒ 佩尔盯着你，喉结滚了很久。“……她还会说这种话。”他把整瓶酒推给你，肩膀抖了一下，没再说别的。

### imp_611 · ch6 · warp · 旁白 · time{d:20,warp:true} · eventRoll 0.56
这次跃迁颠簸得厉害。亚空间里有东西追着舰队，像鲨鱼闻到了血。 / 第三天，船尾整个舱段的人都疯了。他们反锁舱门，用同一个声音唱歌。 / 舰长下令抽真空。
on enter: {sanity:-5}
from: imp_608 ⟵ “去礼拜堂报上家人的名字” | imp_610 ⟵ “碰杯” | imp_610 ⟵ “转告他：米娜说她不冷”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_608, imp_607, imp_605, imp_601, imp_516, imp_509
  1. “堵住耳朵” → imp_701 eff{sanity:5} ⇒ 你塞上棉絮，捂住耳朵，再蒙上被子。歌声还是渗进来一点，然后停了。
  2. “去听那首歌” → imp_701 eff{corruption:15,sanity:-5,taint:{slaanesh:55},set:{heardSong:true}} ⇒ 你贴在舱门上。歌很美，唱的是下水道、蜡烛和一扇会打开的门。然后空气抽空，歌停了。

### imp_701 · ch7 · burning_city · 哈洛执事 · time{d:1}
奥雷克斯。黄色的天空裂成了紫色，巢都尖塔烧得像一根巨大的蜡烛。 / 哈洛执事站在着陆场上，嗓子哑了，仍在念名单：“……格鲁斯克监工，带着工人用铆钉枪守住了第六工厂。赞美帝皇。”
on enter: {sanity:-5}  codex:place_manufactorum_six,imp_great_rift,place_aurex,place_arcosa
from: imp_611 ⟵ “堵住耳朵” | imp_611 ⟵ “去听那首歌”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_611, imp_608, imp_607, imp_605, imp_601, imp_516
  1. “直接去前线报到” → imp_703 eff{renown:2} ⇒ 你没回头看巢都，背起枪就走。哈洛在你身后补念了一句祝福。
  2. “问他三号塔怎么样了” → imp_703 eff{sanity:-5,hp:5} ⇒ 哈洛翻了很久名单，最后合上本子，塞给你半块干粮。
  3. “问他赛伦家怎么样了” → imp_703 require{flag:origin_noble} eff{sanity:5,renown:3} ⇒ 哈洛翻到尖塔那页：“赛伦家打开地窖收容难民。”你父亲在里面分粥。

### imp_703 · ch7 · trench · 旁白 · foe:heretic_astartes · time{h:9}
第一次见到叛变星际战士，你才明白什么叫巨人。 / 黑色动力甲，头盔上长角，一步跨过整条壕沟。激光打在它身上，像雨点打在铁皮屋顶。 / 它低头看了你一眼，没停。你不值得。
on enter: {sanity:-5}  codex:chaos_heretic_astartes
from: imp_701 ⟵ “直接去前线报到” | imp_701 ⟵ “问他三号塔怎么样了” | imp_701 ⟵ “问他赛伦家怎么样了”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_701, imp_611, imp_608, imp_607, imp_605, imp_601
  1. “朝它背包上的管线开火” ROLL p=0.35+renown ✓imp_704 ✗imp_705 ⇒✓ 你瞄准那根泛着蓝光的管子，开了一枪。只有一枪，正中。 ⇒✗ 激光打在管线旁的装甲上，只留下一个黑点。巨人停下了脚步。
  2. “缩在泥里，等它走远” → imp_707 eff{sanity:-10,hp:-10} ⇒ 你把脸埋进泥里，听着它的脚步从头顶跨过。有人没趴下，你听见了。

### imp_704 · ch7 · trench · 星际战士 · foe:heretic_astartes · time{h:1}
那根管子炸出一串火花，巨人踉跄着转过身。 / 一道蓝灰色的影子从天而降——一名忠诚的星际战士把它按进了泥里。 / 他朝你点了点头。仅此而已，但你会记一辈子。
on enter: {renown:10}  codex:imp_astartes
from: imp_703(success) ⟵ “朝它背包上的管线开火”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_703, imp_701, imp_611, imp_608, imp_607, imp_605
  1. “回礼” → imp_707 ⇒ 你抬手回礼时，他已经扑向下一个目标。你的手在半空停了很久。

### imp_705 · ch7 · ruins · 旁白 · foe:heretic_astartes · time{h:1}
它转过身，随手一挥。你飞出去十几米，撞在墙上。 / 你躺在瓦砾里，看着它走远。它甚至没确认你死没死。 / 这让你莫名地愤怒。
on enter: {hp:-25,renown:3,taint:{khorne:30}}
from: imp_703(fail) ⟵ “朝它背包上的管线开火”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_703, imp_701, imp_611, imp_608, imp_607, imp_605
  1. “爬起来” → imp_707

### imp_707 · ch7 · ruins · 布琳婆婆 · time{h:8} · eventRoll 0.42
夜里，废墟里响起一个熟悉的声音。是布琳——或者是披着布琳样子的东西。 / 她捧着一碗冒热气的汤：“你的帝皇没来，孩子。来的是黑色的战帅。他会让活下来的人吃饱。”
(grudgeLine brin: 她递汤的手停了停：“孩子，你把我的地窖，指给了别人。”)
on enter: {sanity:-5,corruption:5}  codex:chaos_gods
from: imp_703 ⟵ “缩在泥里，等它走远” | imp_704 ⟵ “回礼” | imp_705 ⟵ “爬起来”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_703, imp_701, imp_611, imp_608, imp_607, imp_605
  1. “喝下那碗汤” → imp_708 eff{corruption:20,hp:30,taint:{nurgle:65}} grudge(brin) ⇒ 你接过碗。这一次，你没有问汤里放了什么。
  2. “开枪” → imp_709 eff{sanity:-5} ⇒ 激光穿过她的身体，打在后面的墙上。她没倒，只是叹了口气。
  3. “念出阵亡者的名字” → imp_709 eff{sanity:10,renown:3,taint:{all:-10}} grudge(brin) ⇒ 你从训练营里那个新兵念起。每念一个名字，她就淡一分。

### imp_708 · ch7 · ruins · 布琳婆婆 · time{h:1}
汤是热的。伤口在合拢，恐惧在融化。 / 布琳摸着你的脸：“明天，叛军会从第六工厂的下水道进城。你只要告诉长官——那边很安全。”
from: imp_707 ⟵ “喝下那碗汤”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_707, imp_703, imp_701, imp_611, imp_608, imp_607
  1. “照她说的做” → imp_end_traitor ⇒ 第二天一早，你告诉中尉，第六工厂那边很安全。他向你道了谢。
  2. “把这个情报反过来交给政委” → imp_710 eff{sanity:-10,set:{knowRoute:true}} ⇒ 你点头答应。等她消失了，你才发现自己咬破了嘴唇。

### imp_709 · ch7 · ruins · 旁白 · time{h:1}
那东西消失了，只留下一碗冷汤。汤面映出的不是你的脸，是一只睁开的眼。 / 你一脚踢翻碗，坐到天亮。你知道它还会回来。
from: imp_707 ⟵ “开枪” | imp_707 ⟵ “念出阵亡者的名字”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_707, imp_703, imp_701, imp_611, imp_608, imp_607
  1. “去指挥所” → imp_710

### imp_710 · ch7 · barracks · 德拉维克政委 · time{h:10}
德拉维克把地图摊在弹药箱上。“轨道防御全灭，援军最快七天。我们守七天。” / 她看着你：“你在这儿长大。有什么建议？” / 这是她第一次问别人的意见。
from: imp_708 ⟵ “把这个情报反过来交给政委” | imp_709 ⟵ “去指挥所”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_707, imp_703, imp_701, imp_611, imp_608, imp_607
  1. “叛军会走第六工厂的下水道” → imp_711 require{flag:knowRoute} ⇒ 德拉维克盯着你看了三秒，然后在地图上第六工厂的位置画了个圈。
  2. “那首歌里……提到过下水道” → imp_711 require{flag:heardSong} eff{sanity:-5,taint:{slaanesh:25}} ⇒ 你哼出那首歌的一句，自己先打了个寒颤。德拉维克没说话，在第六工厂画了个圈。
  3. “守住大教堂和难民” → imp_712 ⇒ 难民里有几张生面孔，说话带着卡尔卡罗斯口音。他们说，自家的天也这样裂开过。
  4. “炸掉通往上巢的大桥” → imp_713 ⇒ 德拉维克只问了一句：“炸药够吗？”工兵们连夜把桥墩塞满了。

### imp_end_traitor · ch7 · burning_city · 黑色军团 · time{y:1} · **ENDING bad**
第六工厂陷落了。布琳兑现了承诺：你活着，吃得很饱，胸口多了一只睁开的眼。 / 后来，你跟着黑色军团去了下一个世界，教他们哪里的门最容易打开。
ending: 「开门人」 cause: 为黑色军团打开城门
from: imp_708 ⟵ “照她说的做”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_708, imp_707, imp_703, imp_701, imp_611, imp_608

### imp_711 · ch7 · underhive · 德拉维克政委 · time{h:14}
你们在下水道口等了一夜。黎明时，第一批邪教徒爬了出来，手里还捧着蜡烛。 / 埋伏只用了几分钟。德拉维克没问你是怎么知道的。 / “有些问题，”她说，“最好别问。”
on enter: {renown:10}
from: imp_710 ⟵ “叛军会走第六工厂的下水道” | imp_710 ⟵ “那首歌里……提到过下水道”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_710, imp_707, imp_703, imp_701, imp_611, imp_608
  1. “回到防线” → imp_714

### imp_712 · ch7 · cathedral · 哈洛执事 · time{d:1}
大教堂挤满了难民。哈洛分发最后的圣水——其实就是过滤过的循环水。 / “信仰比水管用，”他说，“但水好歹能喝。” / 外面的炮声一夜没停。
on enter: {renown:5,hp:-10,sanity:5}
from: imp_710 ⟵ “守住大教堂和难民”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_710, imp_707, imp_703, imp_701, imp_611, imp_608
  1. “帮他分水” → imp_714 ⇒ 你把水一杯杯递出去。一个孩子喝完，把空杯还给你：“谢谢帝皇。”

### imp_713 · ch7 · burning_city · 德拉维克政委 · time{h:6}
桥塌了，叛军坦克被挡在下巢。一起被挡在下面的，还有三万个没撤上来的工人。 / 德拉维克在报告上写：“战术必要。” / 她写字的手很稳。你的不稳。
on enter: {sanity:-5,renown:5}
from: imp_710 ⟵ “炸掉通往上巢的大桥”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_710, imp_707, imp_703, imp_701, imp_611, imp_608
  1. “别去想” → imp_714 ⇒ 你努力不去想。可一闭上眼，你就听见桥下有人在敲铁板。

### imp_714 · ch7 · burning_city · 佩尔 · time{d:5} · eventRoll 0.42
第五天。你已经不记得上次睡觉是什么时候。 / 佩尔被流弹击中，倒在你怀里，把一张旧口粮券塞进你手心：“楼梯间……免费的……” / 远处，一个巨大的黑影降落在巢都尖顶。
(grudgeLine pell: 说完楼梯间，他的目光落在你脸上，又轻轻叫了一声：“米娜。”)
on enter: {sanity:-5,set:{pellDead:true}}
from: imp_711 ⟵ “回到防线” | imp_712 ⟵ “帮他分水” | imp_713 ⟵ “别去想”
flags on arrival — MUST: sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_710, imp_707, imp_703, imp_701, imp_611, imp_608
  1. “抱着他直到最后” → imp_801 eff{sanity:5} grudge(pell) ⇒ 你抱着他，直到他的手变凉。那张口粮券被你攥出了汗。
  2. “放下他，回到阵地” → imp_801 eff{renown:5,sanity:-5,taint:{khorne:25}} ⇒ 你合上他的眼睛，把他放在沙袋后面。回到阵地，你的枪比以前更准了。

### imp_801 · ch8 · hive_spire · 阿巴顿的声音 · time{h:6}
巢都尖顶。你们小队守着星语塔的电梯，塔里的星语者还在向外求救。 / 广播响了。一个低沉的声音，不急不慢：“你们的神是一具尸体。跪下的人可以活。” / 是阿巴顿。他甚至没提高音量。
on enter: {sanity:-5,corruption:5}  codex:chaos_abaddon,chaos_black_crusade,place_astropath_tower
from: imp_714 ⟵ “抱着他直到最后” | imp_714 ⟵ “放下他，回到阵地”
flags on arrival — MUST: pellDead, sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_714, imp_710, imp_707, imp_703, imp_701, imp_611
  1. “砸掉广播” → imp_802 ⇒ 你用枪托砸了三下，广播才哑掉。他的最后一个字还在走廊里回荡。
  2. “唱圣歌盖过他” → imp_802 eff{renown:5,sanity:5,taint:{all:-5}} ⇒ 你起了个头，跑调了。然后小队里每个人都跟着唱，跑得一样厉害。
  3. “在心里……数一数跪下的好处” → imp_802 eff{corruption:20,hp:15,taint:{tzeentch:40}} ⇒ 你没跪，只是算了算。伤口忽然不疼了，像有人替你记下了这笔账。

### imp_802 · ch8 · hive_spire · 德拉维克政委 · foe:heretic_astartes · time{h:2}
电梯门开了。走出来三个黑色军团的战士，个个比门框还高。 / 德拉维克拔出链锯剑：“替我记住这一刻。总得有人记得。”
on enter: {sanity:-5,hp:-10}
from: imp_801 ⟵ “砸掉广播” | imp_801 ⟵ “唱圣歌盖过他” | imp_801 ⟵ “在心里……数一数跪下的好处”
flags on arrival — MUST: pellDead, sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_801, imp_714, imp_710, imp_707, imp_703, imp_701
  1. “跟她一起冲” ROLL p=0.4+hp ✓imp_804 ✗imp_805 ⇒✓ 你紧跟政委冲进去，边跑边开火，枪管烧得发红。 ⇒✗ 冲到一半，一只铁拳朝你当头砸下。
  2. “把手雷绑上电梯缆绳” → imp_807 require{stat:renown,min:40} ⇒ 你扑向电梯井，把手雷一颗颗绑上缆绳。德拉维克明白了，把三个巨人往轿厢里逼。
  3. “把它们引进你家的旧电梯” → imp_807 require{flag:origin_noble} ⇒ 这部电梯你小时候坐过上百次。你记得哪根缆绳最旧，把手雷全绑在了那根上。
  4. “在侧面掩护射击” → imp_805 eff{sanity:-5} ⇒ 你从侧面开火，激光在黑甲上溅起火星。一个巨人转过身，朝你走来。

### imp_804 · ch8 · hive_spire · 德拉维克政委 · foe:heretic_astartes · time{h:1}
你不知道自己是怎么活下来的。只记得政委的剑在尖叫，你的枪烫得握不住，最后一个巨人倒下时砸碎了半面墙。 / 德拉维克靠墙坐下，伤得很重，还在换弹匣。
on enter: {renown:15,hp:-20,taint:{khorne:30}}
from: imp_802(success) ⟵ “跟她一起冲”
flags on arrival — MUST: pellDead, sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_802, imp_801, imp_714, imp_710, imp_707, imp_703
  1. “扶她起来” → imp_806 ⇒ 她甩开你的手，自己站了起来。“去塔顶，”她说，“看看我们在替谁守。”

### imp_805 · ch8 · hive_spire · 旁白 · foe:heretic_astartes · time{h:1}
动力拳落下的那一刻，德拉维克一脚把你踹开。 / 你滚到电梯井边，回头只看见她的军帽，在地上转了两圈。 / 你把它捡起来，戴在了自己头上。
on enter: {hp:-20,sanity:-5,renown:5,set:{dravikDead:true}}
from: imp_802(fail) ⟵ “跟她一起冲” | imp_802 ⟵ “在侧面掩护射击”
flags on arrival — MUST: pellDead, sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_802, imp_801, imp_714, imp_710, imp_707, imp_703
  1. “守住电梯口” → imp_806 ⇒ 你戴着她的军帽守在电梯口。再也没有人上来。

### imp_807 · ch8 · hive_spire · 德拉维克政委 · time{h:1}
你拉开引信。电梯带着三个巨人坠入三公里深的井道。 / 你听了很久，没听见落地的声音。 / “好主意，”德拉维克说，“我本来打算让你去送死的。”
on enter: {renown:10}
from: imp_802 ⟵ “把手雷绑上电梯缆绳” | imp_802 ⟵ “把它们引进你家的旧电梯”
flags on arrival — MUST: pellDead, sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_802, imp_801, imp_714, imp_710, imp_707, imp_703
  1. “守到天亮” → imp_806 ⇒ 井道里再没上来任何东西。天快亮时，你决定去塔顶看看。

### imp_806 · ch8 · hive_spire · 老星语者 · time{h:9}
你爬上星语塔顶。十几个星语者围坐成圈，嘴里念着同一句话，已经念了七天。 / 其中一个忽然停下，空洞的眼眶转向你：“有回应了。不是星际战士。是……更大的东西。” / 她笑了，嘴角流着血。
on enter: {sanity:10}
from: imp_804 ⟵ “扶她起来” | imp_805 ⟵ “守住电梯口” | imp_807 ⟵ “守到天亮”
flags on arrival — MUST: pellDead, sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, dravikDead, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_802, imp_801, imp_714, imp_710, imp_707, imp_703
  1. “握住她的手” → imp_808 eff{sanity:5} ⇒ 她的手冷得像冰，却握得很紧。你们一起等着，谁也没说话。
  2. “冲到窗边看天” → imp_808 eff{renown:3} ⇒ 窗外还是紫色的天。你盯着裂隙，一直盯到眼睛发疼。

### imp_808 · ch8 · throne_light · 无畏远征舰队 · time{h:12}
第七天黎明，天空的裂口里亮起一道金光。 / 不是太阳。是一整支蓝金色的舰队，多得遮住了裂隙。广播里那个平静的声音响起：“奥雷克斯，我们来了。” / 黑色舰队开始撤退。
on enter: {sanity:20,renown:10}  codex:imp_indomitus,imp_guilliman
from: imp_806 ⟵ “握住她的手” | imp_806 ⟵ “冲到窗边看天”
flags on arrival — MUST: pellDead, sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, dravikDead, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_806, imp_802, imp_801, imp_714, imp_710, imp_707
  1. “掏出审判官的硬币” → imp_end_inquisition require{flag:inqCoin} ⇒ 硬币在金光里发烫。半小时后，一架没有标记的穿梭机落在塔顶。
  2. “登上远征舰队” → imp_end_crusade require{stat:renown,min:50} ⇒ 你在征兵站排了一整天队。登记官问你的名字，你想了一会儿才答上来。
  3. “留下，重建家园” → imp_end_hold ⇒ 你走下星语塔，搬起了第一块砖。
  4. “躲开那道光” → imp_end_purged require{stat:corruption,min:60} ⇒ 光照到你时，皮肤像被烫了一下。你躲进阴影，祈祷没人看见。

### imp_end_crusade · ch8 · void · 远征舰队 · time{d:30} · **ENDING good**
你登上了蓝金色的战舰。新军服，新番号，新的一万光年。 / 启航时，你最后看了一眼故乡的天空。那道裂隙还在，像一道永远合不上的伤口。 / 但至少，现在有人在缝它了。
ending: 「无畏远征」 cause: 随远征舰队离去
on enter:   codex:imp_great_rift
from: imp_808 ⟵ “登上远征舰队”
flags on arrival — MUST: pellDead, sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, dravikDead, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_808, imp_806, imp_802, imp_801, imp_714, imp_710

### imp_end_hold · ch8 · hive_hab · 哈洛执事 · time{y:1} · **ENDING good**
一年后，你站在重建的楼梯间里，卖掺三成水的再生咖啡。今天免费。 / 哈洛念阵亡名单，念到佩尔时放慢了，像在道谢。 / 帝皇从没看过你一眼。但你看见了他的人民。
ending: 「防线未破」 cause: 留守故乡，重建巢都
from: imp_808 ⟵ “留下，重建家园”
flags on arrival — MUST: pellDead, sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, dravikDead, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_808, imp_806, imp_802, imp_801, imp_714, imp_710

### imp_end_inquisition · ch8 · ship_interior · 哈克审判官 · time{d:2} · **ENDING good**
穿梭机里，哈克审判官在剥一个橘子。“你还留着它，”她瞥了眼硬币，“很好。” / “从今天起你不存在了。你会去很多地方，看很多不该看的东西，然后决定谁活。” / 她递给你半个橘子。
ending: 「审判庭之眼」 cause: 成为审判官的侍从
from: imp_808 ⟵ “掏出审判官的硬币”
flags on arrival — MUST: pellDead, sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, dravikDead, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_808, imp_806, imp_802, imp_801, imp_714, imp_710

### imp_end_purged · ch8 · cathedral · 审判庭清查官 · time{d:3} · **ENDING bad**
胜利之后，审判庭开始清查。他们只用一盏灯，照一照你的眼睛。 / 灯光里，你的影子多了一只手。 / 他们很有礼貌，甚至给了你一碗热汤。
ending: 「光下的影子」 cause: 腐化败露，被审判庭清除
from: imp_808 ⟵ “躲开那道光”
flags on arrival — MUST: pellDead, sawExecution · MAY-only: agriSeeds, askedDravik, blessedGun, confessed, corporal, cultTouched, cultist, deserter, dravikDead, extraAmmo, fledHesper, forgiven_brin, forgiven_mina, forgiven_pell, gaveStash, giltBook, heardSong, hero, hidMina, informer, inqCoin, kissed, knowRoute, lullaby, marked, minaMessage, origin_agri, origin_hive, origin_noble, pellPromise, pellSavedYou, penal, reportedMina, savedBaby, sawAltar, sawMina, serrinRing, signedTithe, spy, toldInq, volunteered, voskDead, warpWhisper, wavered, wronged_brin, wronged_mina, wronged_pell
certainly visited before (nearest 6): imp_808, imp_806, imp_802, imp_801, imp_714, imp_710
