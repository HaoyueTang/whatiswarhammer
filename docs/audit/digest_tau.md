# Route digest: tau — 95 nodes, origins: colonist@tau_101, pow@tau_o_pow_1, trader@tau_o_trader_1

Entered by the engine from anywhere (stat deaths, claim jumps): tau_death_hp, tau_death_sanity, tau_death_corruption, tau_end_claim_khorne, tau_end_claim_nurgle, tau_end_claim_tzeentch, tau_end_claim_slaanesh

Random events (eventRoll → data/events*.js) are not in this graph; they can also set flags. Time `d`/`h`/`y` is applied on entering the node. MUST = on every path to the node; MAY = on some path.

## Automatic findings (31)
- **INFO** `tau_103`: flag 'knowAquila' is set (at tau_103, tau_o_pow_3, tau_o_trader_2) but never used by a require — only text may rely on it
- **INFO** `tau_105`: flag 'flagged' is set (at tau_105) but never used by a require — only text may rely on it
- **INFO** `tau_104`: flag 'noticedCalm' is set (at tau_104) but never used by a require — only text may rely on it
- **INFO** `tau_107`: flag 'promisedRena' is set (at tau_107) but never used by a require — only text may rely on it
- **INFO** `tau_o_pow_1`: flag 'powDefiant' is set (at tau_o_pow_1) but never used by a require — only text may rely on it
- **INFO** `tau_o_pow_2`: flag 'powSigned' is set (at tau_o_pow_2) but never used by a require — only text may rely on it
- **INFO** `tau_o_trader_3`: flag 'hidStock' is set (at tau_o_trader_3) but never used by a require — only text may rely on it
- **INFO** `tau_204`: flag 'ateWithKroot' is set (at tau_204) but never used by a require — only text may rely on it
- **INFO** `tau_208`: flag 'keptName' is set (at tau_208) but never used by a require — only text may rely on it
- **INFO** `tau_305`: flag 'droneDamaged' is set (at tau_305) but never used by a require — only text may rely on it
- **INFO** `tau_307`: flag 'oweGrrak' is set (at tau_307, tau_409) but never used by a require — only text may rely on it
- **INFO** `tau_308`: flag 'coveredJory' is set (at tau_308) but never used by a require — only text may rely on it
- **INFO** `tau_401`: flag 'heardBroadcast' is set (at tau_401) but never used by a require — only text may rely on it
- **INFO** `tau_402`: flag 'helpedRena' is set (at tau_402) but never used by a require — only text may rely on it
- **INFO** `tau_402`: flag 'reportedRena' is set (at tau_402) but never used by a require — only text may rely on it
- **INFO** `tau_403`: flag 'shotCommissar' is set (at tau_403) but never used by a require — only text may rely on it
- **INFO** `tau_406`: flag 'firedHigh' is set (at tau_406) but never used by a require — only text may rely on it
- **INFO** `tau_408`: flag 'pitiedImperials' is set (at tau_408) but never used by a require — only text may rely on it
- **INFO** `tau_410`: flag 'beggedForPOW' is set (at tau_410) but never used by a require — only text may rely on it
- **INFO** `tau_410`: flag 'coachedPOW' is set (at tau_410) but never used by a require — only text may rely on it
- **INFO** `tau_411`: flag 'liaison' is set (at tau_411) but never used by a require — only text may rely on it
- **INFO** `tau_502`: flag 'farsightCurious' is set (at tau_502) but never used by a require — only text may rely on it
- **INFO** `tau_504`: flag 'resistedCalm' is set (at tau_504) but never used by a require — only text may rely on it
- **INFO** `tau_508`: flag 'farsightPact' is set (at tau_508) but never used by a require — only text may rely on it
- **INFO** `tau_508`: flag 'betrayedKelra' is set (at tau_508) but never used by a require — only text may rely on it
- **INFO** `tau_510`: flag 'askedKelra' is set (at tau_510) but never used by a require — only text may rely on it
- **INFO** `tau_604`: flag 'grrakFriend' is set (at tau_604) but never used by a require — only text may rely on it
- **INFO** `tau_609`: flag 'smuggledRefugees' is set (at tau_609) but never used by a require — only text may rely on it
- **INFO** `tau_703`: flag 'grrakDead' is set (at tau_703) but never used by a require — only text may rely on it
- **INFO** `tau_703`: flag 'rememberGrrak' is set (at tau_703) but never used by a require — only text may rely on it
- **INFO** `tau_804`: flag 'kelraDead' is set (at tau_804) but never used by a require — only text may rely on it

Join nodes (≥3 different parents — check the text does not assume any single parent's events): tau_104, tau_308, tau_406, tau_706, tau_807

## Nodes

### tau_death_corruption · chundefined · warp · 西拉斯的神 · **ENDING death**
西拉斯没有说谎：那个神真的会听人类说话。 / 它听得太仔细了，仔细到搬了进来。 / 钛人的传感器把你登记为“未知生物信号”。他们说，从没见过这种东西。
ending: 「会倾听的神」 cause: 被西拉斯的神占据
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, kelraDead, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena

### tau_death_hp · chundefined · tau_outpost · 瓦尚使节 · **ENDING death**
瓦尚在战报上签了字。你的名字被归入一栏：“可接受的伤亡（人类）”。 / 他的笑容一如既往。 / 后来，有个克鲁特说他记得你。没人知道他是怎么记住的。
ending: 「可接受的伤亡」 cause: 列为可接受的伤亡
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, kelraDead, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena

### tau_death_sanity · chundefined · spore_sky · 虫巢意志 · **ENDING death**
那张天上的嘴，终于不只是梦了。 / 你的脑子里只剩下一种声音，低沉、饥饿、没有尽头，像一亿只虫子在同一时刻呼吸。 / 你不再害怕了。你什么都不再是了。
ending: 「亚空间的阴影」 cause: 心智被虫巢意志吞没
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, kelraDead, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena

### tau_end_claim_khorne · chundefined · jungle · 远处的鼓 · time{d:60} · **ENDING bad**
钛人没见过这种病：一个古维萨，越打越不疼，越打越停不下。 / 无人机把你记作“效率异常”，火族不再和你一起出击。某天你独自走进丛林，去找下一场仗。 / 大义需要理由，血神不需要。他只要头骨。
ending: 「效率异常」 cause: 被恐虐收走
on enter:   codex:god_khorne
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, kelraDead, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena

### tau_end_claim_nurgle · chundefined · hive_hab · 慈祥的声音 · time{d:20} · **ENDING bad**
咳嗽病回到了人类街区，这次从你开始。你一点也不难受，挨家挨户给邻居送汤。 / 医疗无人机封了整条街。钛人隔着能量屏，困惑地看着一群笑眯眯的病人。 / 慈父不懂大义，他只知道每个孩子都该有个家。
ending: 「封锁的街道」 cause: 成为纳垢的信使
on enter:   codex:god_nurgle
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, kelraDead, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena

### tau_end_claim_slaanesh · chundefined · tau_city · 甜得发苦的声音 · time{y:1} · **ENDING bad**
钛人的世界太节制了：定量的口粮，定量的称赞。你要的不止这些。 / 你在人类街区办了一场不散的聚会：更甜的糖，更响的音乐，更多掌声。 / 客人们都很满足，第二天又来。最后被掏空的，是你自己。
ending: 「不散的聚会」 cause: 被色孽掏空
on enter:   codex:god_slaanesh
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, kelraDead, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena

### tau_end_claim_tzeentch · chundefined · tau_city · 挪动的字 · time{y:2} · **ENDING bad**
你在梦里看见钛人的作战计划，比以太族看得还远。 / 你把它们一页页写下来，卖给水族，卖给远见的人，也卖给帝国。每一方都以为你是自己人。 / 直到三方同时发现了。那一天，也写在计划里。
ending: 「三面间谍」 cause: 沦为奸奇的棋子
on enter:   codex:god_tzeentch
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, kelraDead, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena

### tau_101 · ch1 · tau_city · 旁白
新卡尔德，现在叫达尔诺尔。 / 六年前，帝国的船不再来了。三年前，白色的船来了。总督签了字，广场上的帝皇像换成了一个光滑的圆环。 / 你在港口卸货。钛人发工钱，从不迟到一天。
on enter:   codex:tau_empire,place_dalnor,imp_great_rift
flags on arrival — MUST: origin_colonist · MAY-only: ∅
  1. “去港口上工” → tau_102 ⇒ 汽笛响了。今天码头不开工——所有人都被叫去听演讲。
  2. “先去看看雷娜姨” → tau_103 ⇒ 人类街区的巷子还是老样子。雷娜姨家的门没锁，屋里有股蜡烛味。

### tau_o_pow_1 · ch1 · tau_outpost · 瓦尚使节
你的团在海湾边一颗无名星球上打了十一天，然后投降了。 / 战俘营没有铁丝网，只有一道蓝光。每天两顿饭，热的。 / 水族使节瓦尚微笑着问每个人：“你愿意为什么而活？”
on enter:   codex:tau_empire,tau_water_caste,place_damocles_gulf
flags on arrival — MUST: origin_pow · MAY-only: ∅
  1. ““为了吃饱。”” → tau_o_pow_2 eff{hp:5,renown:3} ⇒ 瓦尚记下你的回答，像记下一个可以接受的价格。“诚实。很好。”
  2. ““为了帝皇。”” → tau_o_pow_2 eff{sanity:5,renown:-3,set:{powDefiant:true}} ⇒ 瓦尚的笑容没变，在你名字旁画了个小记号。那天的晚饭，你的那份照样是热的。

### tau_o_trader_1 · ch1 · tau_city · 旁白
达尔诺尔港，第七泊位后面那个小货摊是你的。 / 帝国的船不来以后，旧圣像、祈祷书、双头鹰吊坠都成了稀罕货。钛人的电池和净水片，在走私船上也一样。 / 你两边都卖。两边都不问。
on enter:   codex:tau_empire,place_dalnor,place_dalnor_port
flags on arrival — MUST: origin_trader · MAY-only: ∅
  1. “清点今天的货” → tau_o_trader_2 ⇒ 柜台底下压着两箱激光枪电池，戳印是“奥雷克斯二号·第六工厂”。走私船换来的，两边都有人要。
  2. “去码头打听走私船” → tau_o_trader_2 eff{renown:-3} ⇒ 老船工朝海面努努嘴：“今晚，没灯的那艘。”他收下了你一包烟。

### tau_102 · ch1 · tau_city · 瓦尚使节 · time{h:2}
码头上，水族使节瓦尚在演讲。他的笑容完美得像量过尺寸。 / “每个种族都为大义贡献自己最擅长的东西，”他说，“人类的勤劳，我们非常珍视。” / 他身后的屏幕上，人类的工钱一栏比钛人短一截。
on enter:   codex:tau_water_caste,tau_greater_good,place_dalnor_port
from: tau_101 ⟵ “去港口上工”
flags on arrival — MUST: origin_colonist · MAY-only: ∅
certainly visited before (nearest 6): tau_101
  1. “跟着鼓掌” → tau_104 eff{renown:5,taint:{slaanesh:15}} ⇒ 你拍着手。瓦尚的目光扫过人群，在你身上停了一瞬，满意地移开。
  2. “举手问工钱的事” → tau_105 ⇒ 掌声停了。周围的人类同时往旁边让开半步，好像你身上有病。

### tau_103 · ch1 · hive_hab · 雷娜姨 · time{h:2}
雷娜姨以前是殖民地教堂的执事。教堂关了，她还每天擦那张空讲台。 / 她从围裙里掏出一枚双头鹰吊坠，又迅速塞回去。 / “乔里今天穿了钛人的衣服，”她说，“我儿子，穿得像个圆圈。”
on enter:   codex:imp_imperium,place_human_quarter
from: tau_101 ⟵ “先去看看雷娜姨”
flags on arrival — MUST: origin_colonist · MAY-only: ∅
certainly visited before (nearest 6): tau_101
  1. “帮她把吊坠藏好” → tau_104 eff{sanity:5,set:{knowAquila:true}} ⇒ 你把吊坠缝进她围裙的夹层。雷娜姨拍拍你的手，什么也没说。
  2. “劝她扔掉它” → tau_104 eff{renown:3} ⇒ 雷娜姨看了你很久，把吊坠攥得更紧了。“你也开始说圆圈话了。”

### tau_o_pow_2 · ch1 · tau_outpost · 马洛中士 · time{d:30}
一个月后，营里的人分成了两拨：签了字的，和马洛中士那拨。 / 中士每晚带剩下的人念祷词，声音一晚比一晚小。 / “你要是签了，”他说，“帝皇会记得。我也会。”
on enter: {sanity:-5}  codex:imp_guard,tau_greater_good
from: tau_o_pow_1 ⟵ ““为了吃饱。”” | tau_o_pow_1 ⟵ ““为了帝皇。””
flags on arrival — MUST: origin_pow · MAY-only: powDefiant
certainly visited before (nearest 6): tau_o_pow_1
  1. “签字，选择大义” → tau_o_pow_3 eff{renown:5,sanity:-5,set:{powSigned:true}} ⇒ 你在屏幕上按下手印。马洛中士背过身去，祷词里少了一个声音。
  2. “再陪中士念一晚祷词” → tau_o_pow_3 eff{sanity:5,taint:{all:-5}} ⇒ 你念完最后一句，天亮去签了字。中士没骂你，只把他的念珠塞进了你手里。

### tau_o_trader_2 · ch1 · tau_city · 雷娜姨 · time{h:4}
雷娜姨又来买蜡烛，一次只买一根，付的是钛人发的工钱。 / 她压低声音：“有没有……那种吊坠？” / 你柜台底下就有三枚。她儿子乔里在门口等，穿着钛人的衣服，假装没听见。
on enter:   codex:place_human_quarter,imp_imperium
from: tau_o_trader_1 ⟵ “清点今天的货” | tau_o_trader_1 ⟵ “去码头打听走私船”
flags on arrival — MUST: origin_trader · MAY-only: ∅
certainly visited before (nearest 6): tau_o_trader_1
  1. “白送她一枚” → tau_o_trader_3 eff{sanity:5,renown:-2,set:{knowAquila:true}} ⇒ 雷娜姨把吊坠缝进围裙夹层，拍了拍你的手。门口，乔里叹了口气。
  2. “照价卖给她” → tau_o_trader_3 eff{hp:5} ⇒ 她把钱数了三遍，才把吊坠揣进怀里。今晚你能吃上肉了。

### tau_104 · ch1 · tau_city · 奥林长者 · time{d:3}
以太族长者奥林来视察。他走过时，火族战士全都单膝跪下，连无人机都降低了高度。 / 他没说几句话，可整个广场突然安静得像水面。 / 你发现自己也平静了。这份平静不太像是你自己的。
on enter:   codex:tau_ethereal,tau_castes,place_tau_homeworld
from: tau_102 ⟵ “跟着鼓掌” | tau_103 ⟵ “帮她把吊坠藏好” | tau_103 ⟵ “劝她扔掉它” | tau_105 ⟵ “道歉，退回人群” | tau_106 ⟵ “说你完全想通了” | tau_106 ⟵ “喝茶，不说话” | tau_106(success) ⟵ “再问一次工钱” | tau_o_pow_3 ⟵ “跟雷娜姨讲帝国” | tau_o_pow_3 ⟵ “跟乔里讲钛人怎么赢的” | tau_o_trader_4 ⟵ “收下报名卡” | tau_o_trader_4 ⟵ “问他许可管几年”
flags on arrival — MUST: ∅ · MAY-only: flagged, hidStock, knowAquila, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned
  1. “跟着跪下” → tau_108 eff{renown:5,sanity:5,taint:{all:-5}} ⇒ 你跪下去，膝盖碰到冰凉的石板。那份平静像温水，漫过你的头顶。
  2. “偷偷观察钛人士兵的表情” → tau_108 eff{set:{noticedCalm:true}} ⇒ 火族战士的脸同时松弛下来。太一致了，像同一根线同时被拉了一下。

### tau_105 · ch1 · tau_city · 瓦尚使节 · foe:tau_drone · time{h:1}
瓦尚的笑容一丝没变。“这是一个暂时的误会，”他说，“大义按贡献分配，而贡献是可以成长的。” / 一架无人机悄悄飘到你面前，红光扫过你的脸。 / “谢谢你的提问，”他说，“我们会记住它。”
on enter: {sanity:-5,set:{flagged:true}}
from: tau_102 ⟵ “举手问工钱的事”
flags on arrival — MUST: origin_colonist · MAY-only: ∅
certainly visited before (nearest 6): tau_102, tau_101
  1. “道歉，退回人群” → tau_104 eff{renown:2} ⇒ 你低头道歉。无人机的红光熄灭了，瓦尚朝你点头，像在表扬一个学生。
  2. “坚持要一个答案” → tau_106 ⇒ 瓦尚只是微笑，转向下一个提问。无人机跟着你回了家，一直飘在窗外。

### tau_o_pow_3 · ch1 · hive_hab · 雷娜姨 · time{d:10}
你被安置到达尔诺尔的人类街区，借住在雷娜姨家。她以前是殖民地教堂的执事。 / 她看见你袖口上星界军的旧线头，眼眶红了：“你见过真正的帝国。” / 她儿子乔里却只想听钛人是怎么赢的。
on enter:   codex:place_dalnor,place_human_quarter,imp_imperium
from: tau_o_pow_2 ⟵ “签字，选择大义” | tau_o_pow_2 ⟵ “再陪中士念一晚祷词”
flags on arrival — MUST: origin_pow · MAY-only: powDefiant, powSigned
certainly visited before (nearest 6): tau_o_pow_2, tau_o_pow_1
  1. “跟雷娜姨讲帝国” → tau_104 eff{sanity:5,set:{knowAquila:true}} ⇒ 你讲大教堂和阅兵，不讲政委和战壕。雷娜姨从围裙里掏出一枚双头鹰吊坠，攥了很久。
  2. “跟乔里讲钛人怎么赢的” → tau_104 eff{renown:3} ⇒ “他们等，”你说，“等到你自己走进去。”乔里听得两眼发亮。厨房里，雷娜姨摔了一只碗。

### tau_o_trader_3 · ch1 · tau_city · 海关无人机 · time{d:5}
海关无人机在你的货摊上空悬停了三天。第四天，它把一份清单投在柜台上：十二枚吊坠，四十块电池，一件不差。 / 最后一行写着：“贡献可以成长。请考虑另一种申报方式。”
on enter: {sanity:-5}  codex:tau_drone,tau_greater_good
from: tau_o_trader_2 ⟵ “白送她一枚” | tau_o_trader_2 ⟵ “照价卖给她”
flags on arrival — MUST: origin_trader · MAY-only: knowAquila
certainly visited before (nearest 6): tau_o_trader_2, tau_o_trader_1
  1. “烧掉剩下的吊坠” → tau_o_trader_4 eff{renown:5,sanity:-5} ⇒ 吊坠在火盆里熔成一摊金水。无人机“嘀”了一声，飘走了。
  2. “把吊坠藏上走私船” → tau_o_trader_4 eff{renown:-5,set:{hidStock:true}} ⇒ 你半夜把货搬上没灯的船。第二天无人机又来了，这回它什么也没投。

### tau_106 · ch1 · tau_city · 瓦尚使节 · time{h:10}
当晚，一张淡蓝色的卡片出现在你门缝里：“诚邀参加一次友好的对话。茶点由大义提供。” / 对话室很干净，椅子很舒服。瓦尚为你倒茶：“我们来澄清一下误会。” / 房间里没有窗户。
on enter: {sanity:-5}
from: tau_105 ⟵ “坚持要一个答案”
flags on arrival — MUST: flagged, origin_colonist · MAY-only: ∅
certainly visited before (nearest 6): tau_105, tau_102, tau_101
  1. “说你完全想通了” → tau_104 eff{renown:5,sanity:-5} ⇒ 这句话说出口时，比你想的容易。瓦尚给你续了茶，笑容更深了。
  2. “喝茶，不说话” → tau_104 eff{renown:-3} ⇒ 茶是甜的。你喝完一杯又一杯，一个字也没说。三小时后，门开了。
  3. “再问一次工钱” ROLL p=0.5+sanity ✓tau_104 ✗tau_end_reeducation ⇒✓ 瓦尚沉默片刻，竟然记下了你的问题。“我们会研究。”门开了，你可以走了。 ⇒✗ 瓦尚叹了口气，按下桌上的一个按钮。“看来，我们需要更多时间。”门锁咔哒一响。

### tau_108 · ch1 · tau_city · 92号 · time{d:6}
土族在人类街区装了一台净水器。不收钱，不用排队，水干净得能照出人影。 / 孩子们围着它欢呼。帝国统治的两百年里，这条街从没喝过干净水。 / 净水器旁边，一架无人机安静地记录着每个来打水的人。
on enter: {hp:10,sanity:5}  codex:place_human_quarter
from: tau_104 ⟵ “跟着跪下” | tau_104 ⟵ “偷偷观察钛人士兵的表情”
flags on arrival — MUST: ∅ · MAY-only: flagged, hidStock, knowAquila, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned
certainly visited before (nearest 6): tau_104
  1. “喝一大口” → tau_107 eff{renown:3} ⇒ 水凉得发甜。无人机“嘀”了一声，把你记进了某张表格。
  2. “朝无人机挥挥手” → tau_107 eff{sanity:3} ⇒ 无人机停顿了一下，冲你点了点机身。孩子们笑成一片。

### tau_o_trader_4 · ch1 · tau_city · 瓦尚使节 · time{d:2}
瓦尚亲自来到你的货摊，挑了一根蜡烛，付了双倍的钱。 / “你很懂两边的价格，”他微笑，“大义需要这样的人。古维萨辅助军的家属，享有优先贸易许可。” / 他放下一张淡蓝色的报名卡。
on enter:   codex:tau_water_caste
from: tau_o_trader_3 ⟵ “烧掉剩下的吊坠” | tau_o_trader_3 ⟵ “把吊坠藏上走私船”
flags on arrival — MUST: origin_trader · MAY-only: hidStock, knowAquila
certainly visited before (nearest 6): tau_o_trader_3, tau_o_trader_2, tau_o_trader_1
  1. “收下报名卡” → tau_104 eff{renown:5} ⇒ 卡片比看上去沉。瓦尚走后，你把它压在了钱箱底下。
  2. “问他许可管几年” → tau_104 eff{sanity:5} ⇒ “暂时的，”瓦尚说，“和一切一样。”你还是收下了卡片。

### tau_107 · ch1 · tau_outpost · 乔里 · time{d:10}
征兵站前排着长队。人类辅助军，钛语叫“古维萨”：待遇好，口粮足，还发一副真正的护甲。 / 乔里第一个签了名，兴奋得脸通红：“一起吧！我们也能成为大义的一部分！”
on enter:   codex:tau_gue_vesa
from: tau_108 ⟵ “喝一大口” | tau_108 ⟵ “朝无人机挥挥手”
flags on arrival — MUST: ∅ · MAY-only: flagged, hidStock, knowAquila, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned
certainly visited before (nearest 6): tau_108, tau_104
  1. “跟乔里一起报名” → tau_201 eff{renown:5} ⇒ 你在屏幕上按下手印。乔里一把搂住你的肩，笑得像个孩子。
  2. “答应雷娜姨看着他，报名” → tau_201 eff{sanity:5,set:{promisedRena:true}} ⇒ 临走前，雷娜姨抓住你的手：“看着他。”你点头，在乔里后面签了名。

### tau_end_reeducation · ch1 · tau_city · 瓦尚使节 · time{y:2} · **ENDING bad**
对话进行了很久。两年。 / 你出来时皮肤白了些，说话慢了些，见人就笑，笑得完美得像量过尺寸。 / 雷娜姨在街上认不出你。你也不太记得她了。这是一个暂时的误会。
ending: 「友好的对话」 cause: 被水族“对话”改造
from: tau_106(fail) ⟵ “再问一次工钱”
flags on arrival — MUST: flagged, origin_colonist · MAY-only: ∅
certainly visited before (nearest 6): tau_106, tau_105, tau_102, tau_101

### tau_201 · ch2 · tau_outpost · 凯尔拉 · time{d:3}
教官是火族的凯尔拉，比你矮半头，蓝灰色的皮肤，额头中间有一道竖纹。 / “你们的身体很弱，”她说，“这是事实，不是侮辱。所以我们远距离杀敌。” / 她递给你一支脉冲步枪，轻得不像武器。
on enter:   codex:tau_fire_caste,place_frontier_outpost
from: tau_107 ⟵ “跟乔里一起报名” | tau_107 ⟵ “答应雷娜姨看着他，报名”
flags on arrival — MUST: ∅ · MAY-only: flagged, hidStock, knowAquila, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_107, tau_108, tau_104
  1. “接过步枪” → tau_202 eff{renown:3} ⇒ 步枪轻得像玩具。你的第一枪打飞了，凯尔拉面无表情地记下分数。
  2. “问她为什么不练近身格斗” → tau_203 ⇒ 几个新兵偷笑。凯尔拉额头的竖纹微微收紧。

### tau_202 · ch2 · tau_outpost · 92号 · time{d:10}
土族给每个小队配了一架无人机。你的那架编号92，跟着你飞，像一只有礼貌的铁皮鸟。 / 你每次脱靶，它都会在你开枪前半秒轻轻“哔”一声。 / 它比你先知道你会打偏。
on enter:   codex:tau_drone,tau_earth_caste
from: tau_201 ⟵ “接过步枪” | tau_203 ⟵ “盯着那些鸟喙”
flags on arrival — MUST: ∅ · MAY-only: flagged, hidStock, knowAquila, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_201, tau_107, tau_108, tau_104
  1. “给它起个名字” → tau_204 eff{sanity:5,set:{namedDrone:true}} ⇒ 你想了一整晚，给它起了个名字。它毫无反应。第二天早上，它在你床头哔了两声。
  2. “叫它闭嘴” → tau_204 eff{renown:2} ⇒ 它安静了。从此你脱靶之前，再也没人提醒你。

### tau_203 · ch2 · tau_outpost · 凯尔拉 · time{h:1}
“近身格斗，是计划失败的最后结果。”凯尔拉说，“我们不喜欢失败。” / 她朝营地另一头抬了抬下巴，那边有几个长着鸟喙的高大身影在磨刀。 / “近的部分，交给克鲁特。”
from: tau_201 ⟵ “问她为什么不练近身格斗”
flags on arrival — MUST: ∅ · MAY-only: flagged, hidStock, knowAquila, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_201, tau_107, tau_108, tau_104
  1. “盯着那些鸟喙” → tau_202 eff{sanity:-3} ⇒ 一个克鲁特抬起头，冲你张开了喙。你先移开了眼睛。

### tau_204 · ch2 · tau_outpost · 格拉克萨 · time{d:5} · eventRoll 0.35
克鲁特的塑形者格拉克萨正在吃一只沙蜥，连骨头一起。 / “克鲁特吃什么，就变成什么，”他咂咂嘴，“吃了沙蜥，跑得快。吃了聪明的敌人，就聪明。” / 他打量你：“人类……不好吃。太犹豫。”
on enter:   codex:tau_kroot
from: tau_202 ⟵ “给它起个名字” | tau_202 ⟵ “叫它闭嘴”
flags on arrival — MUST: ∅ · MAY-only: flagged, hidStock, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_202, tau_201, tau_107, tau_108, tau_104
  1. “接过他递来的一块肉” → tau_205 eff{hp:5,sanity:-5,set:{ateWithKroot:true}} ⇒ 肉又韧又腥，还带着沙子。你咽下去时，格拉克萨满意地咔哒着喙。
  2. “礼貌地拒绝” → tau_205 ⇒ 格拉克萨耸耸肩，把那块也吞了。“犹豫，”他说，“看吧。”

### tau_205 · ch2 · jungle · 凯尔拉 · time{d:20}
伏击训练。凯尔拉让你趴在泥里十四个小时，一动不动。 / “猎人要有耐心，”她说，“等猎物自己走进陷阱，这叫‘考尤’。然后一击致命，这叫‘蒙卡’。” / 第九个小时，一只虫子爬进了你的领口。
on enter:   codex:tau_kauyon
from: tau_204 ⟵ “接过他递来的一块肉” | tau_204 ⟵ “礼貌地拒绝”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, flagged, hidStock, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_204, tau_202, tau_201, tau_107, tau_108, tau_104
  1. “一动不动” ROLL p=0.5+sanity ✓tau_206 ✗tau_207 ⇒✓ 虫子爬过你的脊背，又爬了出去。你数着心跳，一直数到第十四个小时。 ⇒✗ 虫子停在你脖子上，咬了一口。你的手自己动了。
  2. “让92号帮你赶走它” → tau_206 require{flag:namedDrone} ⇒ 92号无声地降下来，用气流把虫子吹走，又悄悄升回原位。

### tau_206 · ch2 · jungle · 凯尔拉 · time{h:5}
第十四个小时，凯尔拉从你身边的草丛里站起来——你根本不知道她一直在那儿。 / “合格，”她说，又补了一句，“对人类来说，很好。” / 她不知道这后半句有多伤人，或者她知道。
on enter: {renown:8,taint:{slaanesh:10}}
from: tau_205(success) ⟵ “一动不动” | tau_205 ⟵ “让92号帮你赶走它”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, flagged, hidStock, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_205, tau_204, tau_202, tau_201, tau_107, tau_108
  1. “站起来敬礼” → tau_208 ⇒ 你的腿麻得发抖，敬礼歪了。凯尔拉还了你一个标准的礼。

### tau_207 · ch2 · jungle · 凯尔拉 · foe:tau_drone · time{h:5}
你一巴掌拍在脖子上。下一秒，一个训练标记弹打在你后背上。 / “你死了，”凯尔拉说，“明天再来。” / 92号在你头顶转了一圈，哔了一声，听起来像叹气。
on enter: {sanity:-5,hp:-5}
from: tau_205(fail) ⟵ “一动不动”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, flagged, hidStock, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_205, tau_204, tau_202, tau_201, tau_107, tau_108
  1. “明天再来” → tau_208 eff{renown:3} ⇒ 第二天你又趴进泥里。第三天，第四天。第五天，你终于没动。

### tau_208 · ch2 · tau_city · 乔里 · time{d:30}
结业典礼。每个人都领到一个钛语名字。乔里的新名字意思是“锐利的溪流”，他念了一整晚。 / 你的名字被念错了两次。 / 钛人的护甲是合金，你们的是复合板。“更轻便，”瓦尚说。
from: tau_206 ⟵ “站起来敬礼” | tau_207 ⟵ “明天再来”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, flagged, hidStock, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_205, tau_204, tau_202, tau_201, tau_107, tau_108
  1. “接受你的钛语名字” → tau_209 eff{renown:5} ⇒ 新名字在嘴里很陌生。乔里替你念了三遍，比你念得还准。
  2. “坚持用自己的名字” → tau_209 eff{sanity:5,set:{keptName:true}} ⇒ 登记官愣了一下，在名字栏里留了空。瓦尚微笑：“没关系，暂时的。”

### tau_209 · ch2 · ship_interior · 老哈斯克 · time{d:6}
运兵船上，一个满脸伤疤的古维萨老兵在擦枪，擦法和钛人教的不一样。 / “我以前是星界军，”他说，“整个团向钛人投降了。他们给我们饭吃。” / 他笑了笑：“换了帝国，会因为我们打输了枪毙我们。”
on enter:   codex:imp_guard,place_tau_transport
from: tau_208 ⟵ “接受你的钛语名字” | tau_208 ⟵ “坚持用自己的名字”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, flagged, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_208, tau_205, tau_204, tau_202, tau_201, tau_107
  1. “问他后不后悔” → tau_301 eff{sanity:-3} ⇒ 老哈斯克擦枪的手停了停。“后悔？我还活着。”他低下头，再没说话。
  2. “学他的擦枪方法” → tau_301 eff{renown:3} ⇒ 他教得很慢，手指全是老茧。“帝国别的不行，”他说，“擦枪这件事，没人比得上。”
  3. “报出你旧团的番号” → tau_301 require{flag:origin_pow} eff{sanity:5,renown:3} ⇒ 老哈斯克的手停了。“我们团就在你们隔壁。”他把擦枪布撕了一半给你，什么也没再问。

### tau_301 · ch3 · tau_outpost · 凯尔拉 · time{d:40} · eventRoll 0.42
边境前哨。昨晚，一块山那么大的石头从尘落星的方向坠下来，砸进了十公里外的丛林。 / 石头里在敲东西，还在唱歌。 / “兽人，”凯尔拉说，“它们把小行星当船。不，它们觉得那就是船。”
on enter:   codex:xenos_ork,place_dustfall
from: tau_209 ⟵ “问他后不后悔” | tau_209 ⟵ “学他的擦枪方法” | tau_209 ⟵ “报出你旧团的番号”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, flagged, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_209, tau_208, tau_205, tau_204, tau_202, tau_201
  1. “守在防线上” → tau_302 ⇒ 你把电池排成一排，盯着丛林的边缘。歌声越来越近。
  2. “跟克鲁特去丛林” → tau_303 ⇒ 格拉克萨冲你点点头，带你钻进树冠。克鲁特爬树比你走路还安静。

### tau_302 · ch3 · tau_outpost · 凯尔拉 · foe:ork · time{h:30}
兽人冲出丛林时笑得像过节。脉冲步枪的射程是它们的三倍，它们反而更开心：跑得越远，打得越爽。 / 凯尔拉一动不动：“等。等。等——”
on enter: {sanity:-5}
from: tau_301 ⟵ “守在防线上”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, flagged, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_301, tau_209, tau_208, tau_205, tau_204, tau_202
  1. “等她的命令” → tau_304 eff{renown:5} ⇒ 你的手指贴着扳机，汗流进眼睛。兽人近得能数清牙齿了。
  2. “忍不住先开火” → tau_305 eff{renown:-5,taint:{khorne:20}} ⇒ 你的手指先动了。一道蓝光孤零零地划过战场。

### tau_303 · ch3 · jungle · 格拉克萨 · foe:ork · time{h:28}
克鲁特在树上蹲了一整天，一声不出。一队兽人从下面走过，扛着一门炮在吵架。 / 格拉克萨的眼睛眯起来，羽冠一根根竖起。 / “现在，”他说，“吃饭时间。”
from: tau_301 ⟵ “跟克鲁特去丛林”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, flagged, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_301, tau_209, tau_208, tau_205, tau_204, tau_202
  1. “跟着跳下去” ROLL p=0.45+hp ✓tau_306 ✗tau_307 ⇒✓ 你落在一只兽人背上，枪托砸了下去。四周全是羽毛、刀光和吼叫。 ⇒✗ 跳下去的瞬间你就知道不对——树枝太高了，地面太硬了。
  2. “留在树上掩护” → tau_306 eff{renown:3} ⇒ 你在树上一枪一枪点射。每倒下一个，下面就有个克鲁特冲你咔哒一声。

### tau_304 · ch3 · tau_outpost · 凯尔拉 · foe:ork · time{h:1}
“开火。” / 一整排蓝光同时亮起。第一波兽人像被风吹倒的麦子。 / 第二波踩着第一波冲上来，还在笑。凯尔拉皱了皱眉：“它们不懂什么时候该输。”
from: tau_302 ⟵ “等她的命令”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, flagged, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_302, tau_301, tau_209, tau_208, tau_205, tau_204
  1. “继续射击” → tau_308 ⇒ 枪管烫得握不住，你就换一支。太阳落山前，兽人终于退回了丛林。

### tau_305 · ch3 · tau_outpost · 92号 · foe:ork · time{h:1}
你的第一枪暴露了阵地。一发粗糙的火箭呼啸而来，92号挡在你面前。 / 它掉在地上，冒着烟，还在“哔”。 / 凯尔拉看了你一眼，什么也没说。那一眼比骂你还难受。
on enter: {hp:-10,sanity:-5,set:{droneDamaged:true}}
from: tau_302 ⟵ “忍不住先开火”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, flagged, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_302, tau_301, tau_209, tau_208, tau_205, tau_204
  1. “抱起92号” → tau_308 eff{sanity:5} ⇒ 92号在你怀里发烫，一下一下地哔着。土族技师说能修，但不会和原来完全一样了。

### tau_306 · ch3 · jungle · 格拉克萨 · time{h:2}
战斗结束得很快，克鲁特开始“收拾”战场。你转过身去，没看。 / 格拉克萨啐了一口：“兽人的味道，全是愤怒。太多愤怒，不健康。” / 他又补了一句：“但是你，打得不错。可以吃。”他好像是在夸你。
on enter: {renown:5}  codex:tau_kroot
from: tau_303(success) ⟵ “跟着跳下去” | tau_303 ⟵ “留在树上掩护”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, flagged, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_303, tau_301, tau_209, tau_208, tau_205, tau_204
  1. “回到前哨” → tau_308 ⇒ 回去的路上，克鲁特们边走边嚼。你一路没回头。

### tau_307 · ch3 · jungle · 格拉克萨 · foe:ork · time{h:1}
你落地时崴了脚。一只兽人拎着你的领子把你提起来，像在看一件新玩具。 / 下一秒，它的脑袋不见了。格拉克萨站在它身后，舔了舔刀。 / “你欠克鲁特一顿饭。”
on enter: {hp:-20,set:{oweGrrak:true}}
from: tau_303(fail) ⟵ “跟着跳下去”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, flagged, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_303, tau_301, tau_209, tau_208, tau_205, tau_204
  1. “一瘸一拐地跟上” → tau_308 ⇒ 你的脚踝肿得像个果子。格拉克萨走得不快，好像故意在等你。

### tau_308 · ch3 · tau_outpost · 旁白 · foe:ork_boss · time{h:6}
傍晚，地面开始震动。兽人军阀来了，坐在一台冒黑烟的步行机甲里，全军跟着它吼同一个词：“哇——！” / 那声音让你的牙齿发麻。 / 凯尔拉打开通讯：“战斗服小队，准备蒙卡。”
on enter: {sanity:-5,hp:-5}  codex:xenos_waaagh,xenos_ork_warboss
from: tau_304 ⟵ “继续射击” | tau_305 ⟵ “抱起92号” | tau_306 ⟵ “回到前哨” | tau_307 ⟵ “一瘸一拐地跟上”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, droneDamaged, flagged, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_301, tau_209, tau_208, tau_205, tau_204, tau_202
  1. “引它进入射界” ROLL p=0.45+renown ✓tau_309 ✗tau_310 ⇒✓ 你跳出掩体，朝军阀挥枪大喊。它看见了你，咧开嘴，迈开了步子。 ⇒✗ 你刚冲出掩体，一发炮弹就在前方炸开。你扑倒在地，附近有人在喊你的名字——是乔里。
  2. “去护住受伤的乔里” → tau_310 eff{sanity:5,set:{coveredJory:true}} ⇒ 你逆着人流跑向乔里。他倒在弹坑边，还在笑，好像没发现自己少了什么。

### tau_309 · ch3 · tau_outpost · 战斗服小队 · foe:ork_boss · time{h:1}
你在军阀面前跑了两百米，它追着你，笑得前仰后合。 / 然后三台战斗服从天而降，喷射器的火光照亮了整片丛林。一击，干净利落。 / 凯尔拉在频道里只说了一个词：“蒙卡。”
on enter: {renown:10}  codex:tau_battlesuit
from: tau_308(success) ⟵ “引它进入射界”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, droneDamaged, flagged, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_308, tau_301, tau_209, tau_208, tau_205, tau_204
  1. “瘫坐在地上喘气” → tau_311 ⇒ 你躺在泥里，听着心跳慢下来。远处，克鲁特已经开始“收拾”了。

### tau_310 · ch3 · tau_outpost · 乔里 · foe:ork_boss · time{h:1}
你拖着乔里躲到掩体后面。他的左臂没了，脸白得像纸，却还在念他的钛语名字。 / 远处，三台战斗服从天而降，替你们完成了你们没完成的事。
on enter: {hp:-10,sanity:-10}  codex:tau_battlesuit
from: tau_308(fail) ⟵ “引它进入射界” | tau_308 ⟵ “去护住受伤的乔里”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, coveredJory, droneDamaged, flagged, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_308, tau_301, tau_209, tau_208, tau_205, tau_204
  1. “按住他的伤口” → tau_311 ⇒ 血从你指缝里往外冒。医疗无人机来得很快，快得像早就算好了。

### tau_311 · ch3 · tau_city · 瓦尚使节 · time{d:15}
土族给乔里装了一条新手臂，比原来的还灵巧。他很骄傲。雷娜姨看了一眼，转身走了。 / 瓦尚宣读了战报：“伤亡在可接受范围内。” / 你注意到，阵亡名单上只有人类和克鲁特。
on enter: {hp:20}
from: tau_309 ⟵ “瘫坐在地上喘气” | tau_310 ⟵ “按住他的伤口”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, coveredJory, droneDamaged, flagged, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_308, tau_301, tau_209, tau_208, tau_205, tau_204
  1. “什么也不说” → tau_401 eff{renown:3} ⇒ 你什么也没说。瓦尚念完名单，朝沉默的你满意地点了点头。
  2. “去陪雷娜姨坐一会儿” → tau_401 eff{sanity:10} ⇒ 雷娜姨给你泡了一杯苦茶。你们坐到天黑，谁也没提乔里的手。

### tau_401 · ch4 · tau_city · 帝国广播 · time{y:1} · eventRoll 0.42
一年后的一个清晨，所有频道都被一个陌生的声音占领了。 / “这里是帝国远征舰队。新卡尔德的子民，帝皇没有忘记你们。”停顿。“所有与异形合作者，皆为叛徒。” / 天上出现了一排灰色的船。
on enter: {sanity:-5}  codex:imp_imperium,imp_indomitus,place_terra
from: tau_311 ⟵ “什么也不说” | tau_311 ⟵ “去陪雷娜姨坐一会儿”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, coveredJory, droneDamaged, flagged, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_311, tau_308, tau_301, tau_209, tau_208, tau_205
  1. “关掉广播” → tau_402 ⇒ 你按下开关。街上，每扇窗户里还在传出同一个声音。
  2. “把它听完” → tau_402 eff{sanity:-5,set:{heardBroadcast:true},taint:{tzeentch:15}} ⇒ 广播最后念了一串名字：新卡尔德的“叛徒”。你听到了总督，听到了你那条街。

### tau_402 · ch4 · hive_hab · 雷娜姨 · time{h:5}
雷娜姨把双头鹰吊坠挂在胸前，眼睛亮得吓人。 / “他们来接我们了。”她拉住你，“今晚我要在钟楼上点一盏灯，告诉他们这里还有忠诚的人。你帮我。”
from: tau_401 ⟵ “关掉广播” | tau_401 ⟵ “把它听完”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, coveredJory, droneDamaged, flagged, heardBroadcast, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_401, tau_311, tau_308, tau_301, tau_209, tau_208
  1. “帮她” → tau_403 eff{renown:-10,set:{helpedRena:true}} ⇒ 你们趁夜摸上钟楼。雷娜姨的手在抖，划了三根火柴才点着灯芯。
  2. “劝她别做傻事” → tau_404 ⇒ “雷娜姨，他们不是来接我们的。”话一出口，你就后悔了。
  3. “去告诉水族” → tau_405 eff{renown:10,sanity:-15,taint:{nurgle:25},set:{reportedRena:true,wronged_rena:true,wronged_jory:true}} ⇒ 你走向水族办公楼，一路没敢回头。你说出雷娜姨的名字和住址。乔里也住在那里。

### tau_403 · ch4 · ruins · 帝国政委 · time{h:8}
灯亮了。半夜，一架帝国运输机降落在钟楼下。 / 政委走下舷梯，看了看雷娜姨的吊坠，又看了看你脚上钛人发的靴子。 / “合作者，”他说。他看雷娜姨的眼神，和看你的一模一样。
on enter:   codex:imp_commissar
from: tau_402 ⟵ “帮她”
flags on arrival — MUST: helpedRena · MAY-only: ateWithKroot, coveredJory, droneDamaged, flagged, heardBroadcast, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_402, tau_401, tau_311, tau_308, tau_301, tau_209
  1. ““我们一直是帝皇的子民！”” ROLL p=0.3+sanity ✓tau_406 ✗tau_end_collaborator ⇒✓ 政委盯着你看了很久，直到远处一声爆炸打断了他。他转身跑回运输机，把你们丢在原地。 ⇒✗ 你说得很急，很真诚。政委一边听，一边慢慢摘下了手套。
  2. “拉着雷娜姨逃跑” ROLL p=0.6+hp ✓tau_406 ✗tau_end_collaborator ⇒✓ 你拽着雷娜姨钻进小巷。激光在身后的墙上烧出一排黑洞，可你们跑掉了。 ⇒✗ 雷娜姨跑不动了。她拉住你，摇摇头。脚步声在你们身后停下。
  3. “朝政委开枪” → tau_406 eff{hp:-15,sanity:-10,set:{shotCommissar:true},taint:{khorne:25}} ⇒ 脉冲光打中了他的胸口。他倒下前开了一枪，打穿了你的肩膀。雷娜姨尖叫起来。

### tau_404 · ch4 · hive_hab · 雷娜姨 · time{h:2}
雷娜姨打了你一巴掌，然后哭了。 / “我知道，”她说，“我知道他们来了也会把我们都烧了。我只是……想有人还记得帝皇。” / 她把吊坠塞回围裙里，手一直在抖。
on enter: {sanity:-5}
from: tau_402 ⟵ “劝她别做傻事”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, coveredJory, droneDamaged, flagged, heardBroadcast, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_402, tau_401, tau_311, tau_308, tau_301, tau_209
  1. “抱住她” → tau_406 eff{sanity:5} ⇒ 她在你怀里哭了很久。窗外，灰色的船越来越近。

### tau_405 · ch4 · tau_city · 瓦尚使节 · time{h:3}
瓦尚听完，握住你的手，笑容完美：“谢谢你。你为大义做了一件困难而正确的事。” / 当晚，雷娜姨被“请”去参加一次友好的对话。 / 乔里整整一年没再跟你说一句话。
from: tau_402 ⟵ “去告诉水族”
flags on arrival — MUST: reportedRena, wronged_jory, wronged_rena · MAY-only: ateWithKroot, coveredJory, droneDamaged, flagged, heardBroadcast, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_402, tau_401, tau_311, tau_308, tau_301, tau_209
  1. “回营地” → tau_406 ⇒ 营房里，每个人都假装没看见你。你的床铺被人挪到了最角落。

### tau_406 · ch4 · burning_city · 凯尔拉 · foe:guardsman · time{d:3}
帝国的登陆部队冲进了达尔诺尔。你透过瞄准镜看见他们：和你一样的脸，一样的口音，拿着你小时候在画报上见过的激光枪。 / 凯尔拉在频道里说：“目标确认。开火。”
on enter: {sanity:-10}  codex:imp_guard
from: tau_403(success) ⟵ ““我们一直是帝皇的子民！”” | tau_403(success) ⟵ “拉着雷娜姨逃跑” | tau_403 ⟵ “朝政委开枪” | tau_404 ⟵ “抱住她” | tau_405 ⟵ “回营地”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, coveredJory, droneDamaged, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, powDefiant, powSigned, promisedRena, reportedRena, shotCommissar, wronged_jory, wronged_rena
certainly visited before (nearest 6): tau_402, tau_401, tau_311, tau_308, tau_301, tau_209
  1. “开火” → tau_407 eff{sanity:-5,renown:5,taint:{khorne:20}} ⇒ 一个和你差不多大的士兵倒下了。你看见他胸前挂着一枚双头鹰。
  2. “把枪口抬高一点” → tau_407 eff{renown:-5,set:{firedHigh:true}} ⇒ 你的子弹全打在了他们头顶的墙上。92号把每一发都记了下来。

### tau_end_collaborator · ch4 · ruins · 帝国政委 · time{h:1} · **ENDING bad**
政委耐心地听完了你的话，点点头，像是在认可一份报告。 / 然后他宣读了判决。很短。 / 第二天，帝国广播多了一条：“新卡尔德，清除叛徒两名。”雷娜姨的吊坠被收走了，说圣物不宜流落。
ending: 「合作者」 cause: 被帝国以通敌罪处决
from: tau_403(fail) ⟵ ““我们一直是帝皇的子民！”” | tau_403(fail) ⟵ “拉着雷娜姨逃跑”
flags on arrival — MUST: helpedRena · MAY-only: ateWithKroot, coveredJory, droneDamaged, flagged, heardBroadcast, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, powDefiant, powSigned, promisedRena
certainly visited before (nearest 6): tau_403, tau_402, tau_401, tau_311, tau_308, tau_301

### tau_407 · ch4 · burning_city · 凯尔拉 · foe:astartes · time{h:6} · eventRoll 0.42
中午，蓝色的巨人到了。一台战斗服被他们徒手掀翻，驾驶员没能出来。 / 凯尔拉的声音第一次变了调。然后奥林长者的声音插了进来，平静如水：“按计划撤退。让他们追。”
on enter: {hp:-10}  codex:imp_astartes
from: tau_406 ⟵ “开火” | tau_406 ⟵ “把枪口抬高一点”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, coveredJory, droneDamaged, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, powDefiant, powSigned, promisedRena, reportedRena, shotCommissar, wronged_jory, wronged_rena
certainly visited before (nearest 6): tau_406, tau_402, tau_401, tau_311, tau_308, tau_301
  1. “按计划撤退” → tau_408 ⇒ 你们一条街一条街地后撤，故意留下脚印和空电池。帝国军跟了上来。
  2. “留下来打掩护” ROLL p=0.35+hp ✓tau_408 ✗tau_409 ⇒✓ 你守住街角，一直打到最后一个钛人撤走，然后自己钻进了下水道。 ⇒✗ 一个蓝色巨人转过头，看向你的位置。他举起了手里那把粗大的枪。

### tau_408 · ch4 · tau_city · 影日的舰队 · time{d:6}
第六天，帝国军追进了城中心。然后，整片天空“亮”了——隐形的战斗服同时显形，白色的舰队从月亮背后滑出来。 / “影日指挥官，”凯尔拉的声音在发抖，“她等了整整六天。” / 这才是考尤。
on enter: {renown:10,sanity:10}  codex:tau_shadowsun,tau_kauyon
from: tau_407 ⟵ “按计划撤退” | tau_407(success) ⟵ “留下来打掩护” | tau_409 ⟵ “昏过去”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, coveredJory, droneDamaged, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, powDefiant, powSigned, promisedRena, reportedRena, shotCommissar, wronged_jory, wronged_rena
certainly visited before (nearest 6): tau_407, tau_406, tau_402, tau_401, tau_311, tau_308
  1. “欢呼” → tau_410 eff{renown:3} ⇒ 你和火族战士一起欢呼。凯尔拉回头看你，这一次，她也笑了。
  2. “看着被困的帝国士兵” → tau_410 eff{sanity:-5,set:{pitiedImperials:true}} ⇒ 他们困在广场中央，无处可逃。有人在祈祷，用的是你小时候学的那段祷词。

### tau_409 · ch4 · ruins · 格拉克萨 · foe:astartes · time{h:2}
一发爆弹在你身边炸开。你飞出去，耳朵里只剩嗡嗡声。 / 格拉克萨把你扛上肩，跑得比你见过的任何东西都快。 / “这顿饭，”他喘着说，“记在你账上。”
on enter: {hp:-20,set:{oweGrrak:true}}
from: tau_407(fail) ⟵ “留下来打掩护”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, coveredJory, droneDamaged, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, powDefiant, powSigned, promisedRena, reportedRena, shotCommissar, wronged_jory, wronged_rena
certainly visited before (nearest 6): tau_407, tau_406, tau_402, tau_401, tau_311, tau_308
  1. “昏过去” → tau_408 ⇒ 世界沉入黑暗，只剩羽毛的气味和克鲁特粗重的喘息。

### tau_410 · ch4 · ruins · 被俘的星界军 · time{d:1}
战俘营里，一个年轻的星界军抓住你的袖子，因为你是这里唯一的人类脸孔。 / “告诉他们我愿意皈依，什么大义都行，”他小声说，“我只想回家。” / 瓦尚在不远处，微笑着记录着什么。
from: tau_408 ⟵ “欢呼” | tau_408 ⟵ “看着被困的帝国士兵”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, coveredJory, droneDamaged, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, shotCommissar, wronged_jory, wronged_rena
certainly visited before (nearest 6): tau_408, tau_407, tau_406, tau_402, tau_401, tau_311
  1. “替他求情” → tau_411 eff{renown:-5,sanity:5,set:{beggedForPOW:true}} ⇒ 瓦尚听完，礼貌地点头，在那人的名字旁画了个小记号。你不知道那是什么意思。
  2. “把瓦尚的话翻译给他” → tau_411 eff{renown:5} ⇒ 你一字一句地翻译：“贡献，是可以成长的。”年轻人拼命点头，像抓住了一根绳子。
  3. “告诉他你是怎么熬过来的” → tau_411 require{flag:origin_pow} eff{sanity:5,renown:3,set:{coachedPOW:true}} ⇒ “先说‘为了吃饱’，”你低声说，“祷词留到晚上，念给自己听。”他用力点头。

### tau_411 · ch4 · tau_city · 瓦尚使节 · time{d:14}
两周后，战俘中有一半穿上了古维萨的制服。另一半，没人提起。 / 瓦尚请你喝茶：“你的语言能力很宝贵。愿意做人类与大义之间的联络官吗？” / 他的笑容，今天格外完美。
from: tau_410 ⟵ “替他求情” | tau_410 ⟵ “把瓦尚的话翻译给他” | tau_410 ⟵ “告诉他你是怎么熬过来的”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, beggedForPOW, coachedPOW, coveredJory, droneDamaged, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, shotCommissar, wronged_jory, wronged_rena
certainly visited before (nearest 6): tau_410, tau_408, tau_407, tau_406, tau_402, tau_401
  1. “接受” → tau_501 eff{renown:10,set:{liaison:true}} ⇒ 瓦尚给你别上一枚淡蓝色的徽章。从今天起，你开口说话，就代表人类。
  2. “推说自己只会打仗” → tau_501 eff{sanity:5} ⇒ 瓦尚的笑容一丝不变：“当然。大义尊重每个人的位置。”他收回了茶杯。
  3. “先谈谈联络官的报酬” → tau_501 require{flag:origin_trader} eff{renown:8,set:{liaison:true}} ⇒ 瓦尚的笑容第一次顿了半秒。最后，人类那栏工钱长了一截。只长了你那一行。

### tau_501 · ch5 · tau_outpost · 凯尔拉 · time{y:1}
又是一年。凯尔拉变了。她开始在夜里看星图，看的总是同一个方向。 / “你听说过远见吗？”某天她突然问，“一位指挥官。他去了海湾的另一边，再也没回来。” / 她说这话时，声音压得很低。
on enter: {sanity:15,hp:10}  codex:tau_farsight,place_damocles_gulf
from: tau_411 ⟵ “接受” | tau_411 ⟵ “推说自己只会打仗” | tau_411 ⟵ “先谈谈联络官的报酬”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, beggedForPOW, coachedPOW, coveredJory, droneDamaged, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, shotCommissar, wronged_jory, wronged_rena
certainly visited before (nearest 6): tau_411, tau_410, tau_408, tau_407, tau_406, tau_402
  1. “问她远见是谁” → tau_502 ⇒ 凯尔拉先看了一眼头顶的无人机，才把声音压得更低。
  2. “提醒她小心说话” → tau_503 ⇒ 你朝头顶的无人机抬了抬下巴。凯尔拉的话停在了半截。

### tau_502 · ch5 · tau_outpost · 凯尔拉 · time{h:1}
“他们说，他发现了以太族不想让我们知道的事。说他的剑来自一个死去的世界。” / 她停顿了一下，“还说，他那边的人吵架。真正地吵，不需要先‘澄清误会’。” / 她笑了。那个笑容不完美。
on enter:   codex:tau_farsight_enclaves
from: tau_501 ⟵ “问她远见是谁”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, beggedForPOW, coachedPOW, coveredJory, droneDamaged, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, shotCommissar, wronged_jory, wronged_rena
certainly visited before (nearest 6): tau_501, tau_411, tau_410, tau_408, tau_407, tau_406
  1. “那听起来不错” → tau_504 eff{set:{farsightCurious:true},taint:{tzeentch:25}} ⇒ 凯尔拉没有回答，只是把星图往你那边推了推，让你看清那个方向。
  2. “那听起来很危险” → tau_504 eff{renown:3} ⇒ “是的，”凯尔拉说，“很危险。”她卷起星图的动作比平时慢。

### tau_503 · ch5 · tau_outpost · 凯尔拉 · time{h:1}
凯尔拉看着你，过了很久才点头：“你说得对。” / 她把星图收起来。你知道她明晚还会拿出来。 / 92号在你们之间悬停着，安静得像在偷听。
from: tau_501 ⟵ “提醒她小心说话”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, beggedForPOW, coachedPOW, coveredJory, droneDamaged, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, shotCommissar, wronged_jory, wronged_rena
certainly visited before (nearest 6): tau_501, tau_411, tau_410, tau_408, tau_407, tau_406
  1. “去参加集会” → tau_504

### tau_504 · ch5 · tau_city · 奥林长者 · time{d:4}
奥林长者在广场上讲话。你看着人群里的凯尔拉：她来的时候眉头紧锁，听着听着，眉头松开了。 / 你也感到那份平静漫过来，温暖、柔软，像一条毯子。 / 毯子底下，有什么东西被盖住了。
on enter:   codex:tau_greater_good,tau_ethereal
from: tau_502 ⟵ “那听起来不错” | tau_502 ⟵ “那听起来很危险” | tau_503 ⟵ “去参加集会”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, beggedForPOW, coachedPOW, coveredJory, droneDamaged, farsightCurious, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, shotCommissar, wronged_jory, wronged_rena
certainly visited before (nearest 6): tau_501, tau_411, tau_410, tau_408, tau_407, tau_406
  1. “让那份平静流过你” → tau_505 eff{sanity:15,renown:5,taint:{all:-10}} ⇒ 你闭上眼。所有的问题都变得很远、很小，像水底的石头。
  2. “掐自己一下，保持清醒” → tau_505 eff{sanity:-5,set:{resistedCalm:true}} ⇒ 指甲陷进掌心。疼痛像一根钉子把你钉在原地，周围的人都在微笑。

### tau_505 · ch5 · warp · 凯尔拉 · time{d:12,warp:true} · eventRoll 0.49
部队乘船转移。钛人的船只在亚空间浅层“潜水”，一次跳一小段。 / 钛人船员安然无恙。人类却开始做梦：一扇门、一只眼、一首走调的歌。 / “我们看不见你们看见的东西，”凯尔拉说，“我很抱歉。”
on enter: {sanity:-10}  codex:chaos_warp,place_tau_transport
from: tau_504 ⟵ “让那份平静流过你” | tau_504 ⟵ “掐自己一下，保持清醒”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, beggedForPOW, coachedPOW, coveredJory, droneDamaged, farsightCurious, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, wronged_jory, wronged_rena
certainly visited before (nearest 6): tau_504, tau_501, tau_411, tau_410, tau_408, tau_407
  1. “跟92号说话” → tau_506 require{flag:namedDrone} eff{sanity:10} ⇒ 你跟92号讲雷娜姨、讲码头、讲小时候。它隔一会儿哔一声，像在点头。
  2. “盯着舷窗外” → tau_506 eff{corruption:8,sanity:-5,taint:{tzeentch:70}} ⇒ 窗外的颜色没有名字。有一瞬间，你觉得外面有什么东西也在看你，而且认出了你。
  3. “闭眼熬过去” → tau_506 ⇒ 你闭着眼数呼吸。那首走调的歌在你脑子里唱了一路。

### tau_506 · ch5 · cult_shrine · 西拉斯兄弟 · time{d:9}
新驻地的古维萨营房里，有人在偷偷聚会。领头的西拉斯给每个人分烟和糖，什么都不要。 / “钛人有他们的大义，”他说，“我们人类也该有个神，一个会听我们说话的神。不是那具尸体。”
on enter:   codex:chaos_cult
from: tau_505 ⟵ “跟92号说话” | tau_505 ⟵ “盯着舷窗外” | tau_505 ⟵ “闭眼熬过去”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, beggedForPOW, coachedPOW, coveredJory, droneDamaged, farsightCurious, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, wronged_jory, wronged_rena
certainly visited before (nearest 6): tau_505, tau_504, tau_501, tau_411, tau_410, tau_408
  1. “听他说完” → tau_507 eff{corruption:8,sanity:-5,taint:{slaanesh:70}} ⇒ 你留了下来。西拉斯的声音很温和，比瓦尚更像是在跟你说话。
  2. “报告凯尔拉” → tau_508 eff{renown:5} ⇒ 凯尔拉听完，只说了一句“知道了”。第二天，营房里的聚会散了，西拉斯不见了。

### tau_507 · ch5 · cult_shrine · 西拉斯兄弟 · time{h:3}
西拉斯在你手腕上画了一个符号，八道线从一个点散开。 / “你会更强，”他说，“不用等任何人批准你的贡献。” / 符号在发烫。你的伤疤全都不疼了。
from: tau_506 ⟵ “听他说完”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, beggedForPOW, coachedPOW, coveredJory, droneDamaged, farsightCurious, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, wronged_jory, wronged_rena
certainly visited before (nearest 6): tau_506, tau_505, tau_504, tau_501, tau_411, tau_410
  1. “让符号留下” → tau_508 eff{corruption:20,hp:20,taint:{khorne:65},set:{cultMark:true}} ⇒ 你放下袖子盖住符号。夜里，它在布料下轻轻地跳，像第二颗心脏。
  2. “用刀刮掉它” → tau_508 eff{hp:-10,sanity:-5,taint:{all:-5}} ⇒ 你刮到见血，符号才淡下去。西拉斯没拦你，只是笑了笑：“它记住你了。”

### tau_508 · ch5 · tau_outpost · 红色战斗服 · time{d:20}
深夜，前哨外的丛林里站着一台战斗服，涂成了红色，钛人从不用的颜色。 / 凯尔拉走出去和它说话。回来时，她直接来找你： / “他们愿意带愿意走的人去海湾那边。人类也可以。你跟我走吗？”
on enter:   codex:tau_farsight_enclaves
from: tau_506 ⟵ “报告凯尔拉” | tau_507 ⟵ “让符号留下” | tau_507 ⟵ “用刀刮掉它”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, beggedForPOW, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, wronged_jory, wronged_rena
certainly visited before (nearest 6): tau_506, tau_505, tau_504, tau_501, tau_411, tau_410
  1. “答应她，等时机” → tau_509 eff{set:{farsightPact:true},taint:{tzeentch:35}} ⇒ 凯尔拉握了一下你的手，很快松开。“别告诉任何人，”她说，“尤其是瓦尚。”
  2. “拒绝，但替她保密” → tau_509 eff{sanity:-5} ⇒ 凯尔拉点点头，不失望，也不生气。“谢谢你，”她说，“这比我预想的多。”
  3. “告发她” → tau_509 eff{renown:15,sanity:-15,taint:{tzeentch:60},set:{betrayedKelra:true,wronged_kelra:true}} ⇒ 你走进水族办公楼时，凯尔拉正从走廊另一头经过。她看见了你，什么也没问。

### tau_509 · ch5 · tau_city · 瓦尚使节 · time{d:2}
瓦尚请你吃晚饭。饭菜很精致，他一直在笑。 / “最近有些人产生了一些……暂时的误会，”他给你倒水，“我相信你没有。” / 你不知道他知道多少。你只知道，他想让你知道他知道。
on enter: {renown:2}
from: tau_508 ⟵ “答应她，等时机” | tau_508 ⟵ “拒绝，但替她保密” | tau_508 ⟵ “告发她”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_508, tau_506, tau_505, tau_504, tau_501, tau_411
  1. “微笑” → tau_510 eff{renown:3,taint:{slaanesh:25}} ⇒ 你笑了，笑得很完美，像量过尺寸。瓦尚满意地举起了杯子。
  2. “沉默地吃完” → tau_510 eff{sanity:-5} ⇒ 你把每道菜都吃得干干净净，一句话也没说。瓦尚一直看着你，直到最后一口。

### tau_510 · ch5 · tau_outpost · 凯尔拉 · time{d:15}
巡逻时，凯尔拉突然说：“影日和远见，是我们最好的两位指挥官。” / “影日是耐心的刀，远见是急躁的火。以太族更喜欢刀。” / 她把枪背到身后，“刀听话。”
on enter:   codex:tau_shadowsun,tau_farsight
from: tau_509 ⟵ “微笑” | tau_509 ⟵ “沉默地吃完”
flags on arrival — MUST: ∅ · MAY-only: ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_509, tau_508, tau_506, tau_505, tau_504, tau_501
  1. “那你是哪一种？” → tau_601 eff{set:{askedKelra:true}} ⇒ 凯尔拉没有回答。走出很远之后，她才说：“我还在想。”
  2. “默默走路” → tau_601 eff{sanity:3} ⇒ 你们并肩走着，只有脚步声和丛林的虫鸣。这样的沉默，不需要澄清。

### tau_601 · ch6 · tau_city · 旁白 · time{d:40,warp:true}
这个月，达尔诺尔所有的人类孩子都在做同一个噩梦：天上有一张很大很大的嘴。 / 钛人的孩子睡得很好。 / 远程传感器发来一行冷冰冰的数据：“检测到大规模生物质，自赫斯珀方向接近。”
on enter: {sanity:-5}  codex:xenos_shadow_in_warp,xenos_tyranid,xenos_hive_mind,place_hesper,place_arcosa
from: tau_510 ⟵ “那你是哪一种？” | tau_510 ⟵ “默默走路”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_510, tau_509, tau_508, tau_506, tau_505, tau_504
  1. “去听撤离简报” → tau_602 ⇒ 简报厅门口，人类和钛人排成了两列。你站进了更长的那一列。

### tau_602 · ch6 · tau_city · 瓦尚使节 · time{h:6}
瓦尚公布了撤离计划，语气像在念天气预报：钛族公民第一批，土族设备第二批，古维萨的家属第三批。 / “效率最大化，”他微笑，“大义从不浪费。” / 人群里有人小声问：克鲁特呢？没人回答。
from: tau_601 ⟵ “去听撤离简报”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_601, tau_510, tau_509, tau_508, tau_506, tau_505
  1. “去找格拉克萨” → tau_604 ⇒ 克鲁特的营地在城外，没人通知他们开会。你老远就听见了磨刀声。
  2. “去找雷娜姨” → tau_605 ⇒ 雷娜姨不在家。你在旧教堂找到了她。

### tau_604 · ch6 · tau_outpost · 格拉克萨 · time{h:3}
格拉克萨在磨刀，磨得很慢。 / “克鲁特吃东西，是为了记住，”他说，“虫子吃东西，是为了忘掉。它们吃掉一个星球，连星球的名字都吃掉。” / 他抬起头：“克鲁特恨虫子。很多年了。”
from: tau_602 ⟵ “去找格拉克萨”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_602, tau_601, tau_510, tau_509, tau_508, tau_506
  1. “帮他磨刀” → tau_606 eff{sanity:5,set:{grrakFriend:true}} ⇒ 你们磨了一整夜。天亮时，格拉克萨把一根自己的羽毛塞进你的口袋。
  2. “问克鲁特会不会被撤离” → tau_606 eff{sanity:-5} ⇒ 格拉克萨咔哒笑了一声：“克鲁特不在名单上。克鲁特从来不在名单上。”

### tau_605 · ch6 · hive_hab · 雷娜姨 · time{h:3}
雷娜姨坐在空讲台前，不肯走。 / “第三批？”她笑了，“孩子，第三批永远不会来的。我在帝国活了六十年，我懂排队。” / 她把双头鹰吊坠塞进你手心，合上你的手指。
(grudgeLine rena: 她从对话室回来后瘦了一圈。她没问是谁说的，你也没说。)
on enter: {sanity:-5,set:{hasAquila:true}}
from: tau_602 ⟵ “去找雷娜姨”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_602, tau_601, tau_510, tau_509, tau_508, tau_506
  1. “收下吊坠” → tau_606 eff{sanity:5} grudge(rena) ⇒ 吊坠还带着她的体温。你把它攥在手心很久，才放进贴身的口袋。
  2. “硬拉她走” → tau_606 eff{hp:-5,sanity:-5} grudge(rena) ⇒ 她比看上去有力气得多。她死死抓着讲台，指甲划破了你的手背。
  3. “向她坦白那一夜的事” → tau_606 require{flag:wronged_rena} eff{sanity:3,set:{forgiven_rena:true}} ⇒ 雷娜姨听完，沉默片刻，把吊坠放进你手心。“我知道是你，”她说，“脚步声，我认得。你肯来说，就够了。”

### tau_606 · ch6 · jungle · 旁白 · foe:genestealer · time{d:2} · eventRoll 0.42
难民营里有一家人很奇怪：父亲很高，母亲很矮，三个孩子的眼睛都是淡紫色，笑起来一模一样。 / 半夜你看见他们的影子在帐篷上，比人多了两条胳膊。
on enter: {sanity:-5}  codex:xenos_genestealer
from: tau_604 ⟵ “帮他磨刀” | tau_604 ⟵ “问克鲁特会不会被撤离” | tau_605 ⟵ “收下吊坠” | tau_605 ⟵ “硬拉她走” | tau_605 ⟵ “向她坦白那一夜的事”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, forgiven_rena, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_602, tau_601, tau_510, tau_509, tau_508, tau_506
  1. “开枪示警” ROLL p=0.5+renown ✓tau_607 ✗tau_608 ⇒✓ 枪声撕开夜色。火族战士几秒内就醒了，脉冲步枪的灯一盏接一盏亮起。 ⇒✗ 你开了枪。帐篷布上多了一个洞，可那东西已经不在帐篷里了。
  2. “悄悄去报告凯尔拉” → tau_607 eff{sanity:-5} ⇒ 你一步一步退出帐篷区，不敢跑。身后，那三个孩子一起笑出了声。

### tau_607 · ch6 · tau_city · 凯尔拉 · foe:genestealer · time{h:2}
火族包围了帐篷。里面的东西冲出来时，营地炸开了锅。 / 天亮后，难民营安静下来。可钛人看人类的眼神变了。 / 港口的大门关上了，门口多了两架炮塔无人机。
on enter: {renown:5}
from: tau_606(success) ⟵ “开枪示警” | tau_606 ⟵ “悄悄去报告凯尔拉”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, forgiven_rena, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_606, tau_602, tau_601, tau_510, tau_509, tau_508
  1. “去港口看看” → tau_609 ⇒ 通往港口的路上挤满了人，每个人都背着全部家当。

### tau_608 · ch6 · jungle · 乔里 · foe:genestealer · time{h:1}
那东西比枪声还快。你倒下时，看见一只金属手臂掐住了它的脖子。 / 是乔里，他的义肢咔咔作响。“钛人的手，”他喘着说，“还挺好用。” / 你的胸口在流血。
on enter: {hp:-25}
from: tau_606(fail) ⟵ “开枪示警”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, forgiven_rena, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_606, tau_602, tau_601, tau_510, tau_509, tau_508
  1. “让乔里扶你去港口” → tau_609 ⇒ 乔里用钛人的手撑着你，一路说个不停，好像一停下你就会睡过去。

### tau_609 · ch6 · tau_city · 瓦尚使节 · time{h:12}
瓦尚站在关闭的港口大门后，隔着能量屏和人群讲话。 / “鉴于近期的安全事件，第三批撤离暂时推迟。”他笑得很得体，“这只是暂时的。” / 人群开始往前挤。你手里还拿着枪。
on enter: {sanity:-5}  codex:place_dalnor_port
from: tau_607 ⟵ “去港口看看” | tau_608 ⟵ “让乔里扶你去港口”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, forgiven_rena, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_606, tau_602, tau_601, tau_510, tau_509, tau_508
  1. “回到防线去” → tau_611 eff{renown:5} ⇒ 你转身逆着人群走。身后的哭喊越来越远，你没有回头。
  2. “带着人群往大门冲” → tau_610 ⇒ 你举枪大喊一声。人群跟着你涌向能量屏，像决了堤的水。
  3. “带人走第七泊位下的水道” → tau_611 require{flag:origin_trader} eff{renown:-5,sanity:10,set:{smuggledRefugees:true}} ⇒ 你带几十个人钻进水道。没灯的船还在，船老大骂了一句，还是让他们上了船。

### tau_610 · ch6 · tau_city · 凯尔拉 · time{h:1}
一排火族战士举起了枪。站在最前面的是凯尔拉。 / 她的枪口对着你，手很稳，眼睛不稳。 / “请你停下，”她说，“这是命令。也是请求。”
(grudgeLine kelra: 她没忘走廊里的那一眼。这句请求，说得比命令还硬。)
from: tau_609 ⟵ “带着人群往大门冲”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, forgiven_rena, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_609, tau_606, tau_602, tau_601, tau_510, tau_509
  1. “放下武器” → tau_611 eff{renown:-10,sanity:-5} ⇒ 你的枪落在地上。凯尔拉的肩膀松了下来。两个火族战士把你押走，动作很轻。
  2. “继续往前走” ROLL p=0.4+renown ✓tau_611 ✗tau_end_gate grudge(kelra) ⇒✓ 凯尔拉的枪口抖了一下，垂了下去。你在能量屏前站了很久。门没开，也没人开枪。 ⇒✗ 你又迈了一步。凯尔拉的嘴唇动了动，像是在说“对不起”。

### tau_611 · ch6 · spore_sky · 奥林长者 · time{d:2}
天变成了紫色。孢子像雪一样落下。 / 奥林长者没有登船。他站在城墙上，长袍在风里纹丝不动。 / “恐惧，”他说，“只是一种暂时的状态。”这一次，你希望他是对的。
on enter: {sanity:10}
from: tau_609 ⟵ “回到防线去” | tau_609 ⟵ “带人走第七泊位下的水道” | tau_610 ⟵ “放下武器” | tau_610(success) ⟵ “继续往前走”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, forgiven_rena, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_609, tau_606, tau_602, tau_601, tau_510, tau_509
  1. “站到他身边” → tau_701 eff{renown:5} ⇒ 你爬上城墙，站到奥林身边。风里有股甜腥味，他的长袍依旧纹丝不动。
  2. “检查你的电池” → tau_701 eff{hp:5} ⇒ 你把每块电池擦干净，排好，再数一遍。数字很小，手很稳。

### tau_end_gate · ch6 · tau_city · 凯尔拉 · time{h:1} · **ENDING bad**
凯尔拉闭上了眼睛，然后扣下了扳机。 / 报告上写着：“安全事件，已处理。” / 一周后，第三批撤离如期“暂时推迟”。再也没有恢复。
ending: 「暂时推迟」 cause: 冲击港口，被射杀
from: tau_610(fail) ⟵ “继续往前走”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, forgiven_rena, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_610, tau_609, tau_606, tau_602, tau_601, tau_510

### tau_701 · ch7 · spore_sky · 凯尔拉 · foe:gaunt · time{h:8} · eventRoll 0.42
它们来了。不是一支军队，是一场雨——一场长着牙的雨。 / 脉冲步枪的蓝光连成一片，打在虫潮上就像往海里扔石头。 / “不要数它们，”凯尔拉说，“数你的电池。”
on enter: {hp:-10,sanity:-5}
from: tau_611 ⟵ “站到他身边” | tau_611 ⟵ “检查你的电池”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, forgiven_rena, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_611, tau_609, tau_606, tau_602, tau_601, tau_510
  1. “守住射击线” → tau_702 ⇒ 换电池，开火，换电池，开火。直到虫潮里有什么东西，让所有小虫同时停下。
  2. “跟克鲁特去侧翼” → tau_703 ⇒ 格拉克萨冲你吼了一声，像在笑。你跟着克鲁特跳下城墙，冲进了长着牙的雨里。
  3. “把一半电池分给凯尔拉” → tau_702 require{flag:wronged_kelra} eff{renown:2,set:{forgiven_kelra:true}} ⇒ 凯尔拉看看你递来的电池，又看看你。“大义不原谅，”她说，“我也许可以。”她把一块电池推进枪里。

### tau_702 · ch7 · spore_sky · 凯尔拉 · foe:tyranid_warrior · time{h:3}
虫潮中央站着一只更高大的东西。它一转头，周围几百只小虫同时转头。 / 你从瞄准镜里看它，它也在看你——不，是有什么更大的东西，借着它的眼睛在看你。 / “那是节点，”凯尔拉说，“打断它。”
on enter:   codex:xenos_tyranid_warrior
from: tau_701 ⟵ “守住射击线” | tau_701 ⟵ “把一半电池分给凯尔拉”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, forgiven_kelra, forgiven_rena, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_701, tau_611, tau_609, tau_606, tau_602, tau_601
  1. “屏住呼吸，开火” ROLL p=0.45+hp ✓tau_704 ✗tau_705 ⇒✓ 你屏住呼吸，世界缩成瞄准镜里的一个点。扣下扳机的那一刻，你就知道打中了。 ⇒✗ 你扣下扳机的瞬间，它往旁边让了一步，像早就知道你要开枪。
  2. “让92号给你标记目标” → tau_704 require[{flag:namedDrone},{notFlag:droneDamaged}] ⇒ 92号飞向前方，一道细细的光落在那东西的额头。你只需要扣扳机。

### tau_703 · ch7 · jungle · 格拉克萨 · foe:gaunt · time{h:3}
克鲁特从侧翼杀进虫群，像一把刀切进水里。格拉克萨冲在最前面。 / 战斗结束时，他靠着树坐下，肚子上有个洞。 / “克鲁特不埋死人，”他说，“克鲁特记住死人。你……吃一口。记住我。”
on enter: {hp:-10,set:{grrakDead:true}}
from: tau_701 ⟵ “跟克鲁特去侧翼”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, forgiven_rena, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_701, tau_611, tau_609, tau_606, tau_602, tau_601
  1. “答应他” → tau_706 eff{sanity:-10,renown:5,set:{rememberGrrak:true}} ⇒ 你照他说的做了。格拉克萨闭上眼，咔哒了一声，像一个满意的笑。
  2. “我做不到” → tau_706 eff{sanity:-5} ⇒ 格拉克萨看了你很久。“人类，”他叹气，“太犹豫。”然后就再也不说话了。

### tau_704 · ch7 · spore_sky · 凯尔拉 · foe:gaunt · time{h:1}
那东西倒下的瞬间，周围的小虫像突然忘了自己是谁，开始原地打转，互相撕咬。 / 凯尔拉看了你一眼：“干得好。” / 她没加“对人类来说”。你注意到了。
on enter: {renown:10}
from: tau_702(success) ⟵ “屏住呼吸，开火” | tau_702 ⟵ “让92号给你标记目标”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, forgiven_kelra, forgiven_rena, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_702, tau_701, tau_611, tau_609, tau_606, tau_602
  1. “换上新电池” → tau_706 ⇒ 电池咔哒一声卡进去。你抬起头，天上有一个巨大的影子正在俯冲。

### tau_705 · ch7 · spore_sky · 92号 · foe:tyranid_warrior · time{h:1}
你打偏了。骨刃落下时，一个小小的影子挡在你面前，哔了一声。 / 92号碎成了好几块。最大的那块还亮着灯，又哔了一声，然后灭了。 / 你把它塞进了口袋。
on enter: {hp:-15,sanity:-15,set:{droneLost:true}}
from: tau_702(fail) ⟵ “屏住呼吸，开火”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, farsightCurious, farsightPact, firedHigh, flagged, forgiven_kelra, forgiven_rena, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_702, tau_701, tau_611, tau_609, tau_606, tau_602
  1. “继续战斗” → tau_706 ⇒ 口袋里那块碎片还是温的。你咬着牙，继续开枪。

### tau_706 · ch7 · tau_city · 奥林长者 · foe:hive_tyrant · time{h:5}
一只长着翅膀的巨虫从天而降，城墙上的奥林长者倒下了。 / 那一刻，你身边的火族战士全都呆住了，像被抽走了线的木偶。 / 人类没有呆住。人类从没被那条线牵过。
on enter: {sanity:-10,hp:-5}  codex:xenos_hive_tyrant
from: tau_703 ⟵ “答应他” | tau_703 ⟵ “我做不到” | tau_704 ⟵ “换上新电池” | tau_705 ⟵ “继续战斗”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_701, tau_611, tau_609, tau_606, tau_602, tau_601
  1. “捡起长者的权杖，大喊集合” → tau_707 eff{renown:15,hp:-5} ⇒ 你举起权杖，用仅会的几句钛语大喊。火族战士一个接一个抬起头，跟着你的声音站了起来。
  2. “拖着发呆的钛人撤退” → tau_707 eff{renown:8,hp:-10} ⇒ 你揪着两个火族战士的领子往后拖。他们很轻，轻得像空壳。
  3. “呼唤西拉斯的神” → tau_707 require{flag:cultMark} eff{corruption:30,hp:30,renown:5,taint:{khorne:75}} ⇒ 手腕上的符号烧了起来。你冲上城墙，一枪比一枪准。你在笑，笑得停不下来。

### tau_707 · ch7 · tau_city · 乔里 · time{d:4}
第四天。舰队来讯：影日的舰队五天后到。“坚守。” / 乔里坐在你旁边，用钛人的手给你剥一个果子。 / “我妈说得对，”他说，“我们永远是第三批。可我还是想当他们的一部分。这是不是很傻？”
(grudgeLine jory: 他递果子时没抬头。雷娜姨的名字，你们谁也没提。)
from: tau_706 ⟵ “捡起长者的权杖，大喊集合” | tau_706 ⟵ “拖着发呆的钛人撤退” | tau_706 ⟵ “呼唤西拉斯的神”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_706, tau_701, tau_611, tau_609, tau_606, tau_602
  1. ““不傻。”” → tau_708 eff{sanity:10} grudge(jory) ⇒ 乔里笑了，把剥好的果子分你一半。那是你这几天吃过最甜的东西。
  2. ““我也不知道。”” → tau_708 eff{sanity:5,renown:3} ⇒ 乔里点点头，好像这个答案也挺好。你们一起看着紫色的天，没再说话。
  3. ““雷娜姨的事，是我干的。”” → tau_708 require{flag:wronged_jory} eff{sanity:4,set:{forgiven_jory:true}} ⇒ 乔里的手停在果子上。“我知道，”他说，“妈回来那天就告诉我了。”他把果子掰开，分你一半，没抬头。

### tau_708 · ch7 · spore_sky · 旁白 · time{d:3} · eventRoll 0.42
第七天夜里，所有人类同时流了鼻血。 / 不是因为受伤，是因为一种声音——一种低到听不见、却压在每个人脑子里的嗡鸣。 / 钛人什么都没感觉到。他们看着你们，第一次显得不知所措。
(grudgeLine jory: 乔里缩在营房角落，血滴在钛人的手背上。他看见你，把脸转开了。)
on enter: {sanity:-10}
from: tau_707 ⟵ ““不傻。”” | tau_707 ⟵ ““我也不知道。”” | tau_707 ⟵ ““雷娜姨的事，是我干的。””
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_707, tau_706, tau_701, tau_611, tau_609, tau_606
  1. “捂住耳朵” → tau_801 eff{sanity:5} ⇒ 没有用。那声音不是从耳朵进来的。可捂着耳朵的这双手，至少还属于你。
  2. “去照顾乔里” → tau_801 eff{renown:3} grudge(jory) ⇒ 乔里的鼻血止不住。你用袖子替他擦，他用钛人的手替你擦。

### tau_801 · ch8 · spore_sky · 虫巢意志 · foe:hive_tyrant · time{d:4}
第八天，它来了。比其他虫子都高，四条手臂，四把骨刃。 / 它不冲锋。它站着看你们的阵型，看了很久，像在下一盘棋。 / 凯尔拉的声音很轻：“虫群主宰。它会学。我们的每个战术，只能用一次。”
on enter: {sanity:-15,hp:-5}  codex:xenos_swarmlord
from: tau_708 ⟵ “捂住耳朵” | tau_708 ⟵ “去照顾乔里”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_708, tau_707, tau_706, tau_701, tau_611, tau_609
  1. “握紧步枪” → tau_802 ⇒ 步枪还是那么轻。你第一次希望它重一点。
  2. “握紧口袋里的东西” → tau_802 eff{sanity:5} ⇒ 口袋里的东西硌着你的手心。不管那是什么，它还在。

### tau_802 · ch8 · tau_city · 凯尔拉 · foe:hive_tyrant · time{h:6}
凯尔拉在城中心布下了考尤陷阱。虫群主宰走到陷阱边缘，停住了。 / 然后它从另一边绕了进来。它也在等。 / 防线一点点崩塌，港口方向传来平民的哭喊。
(grudgeLine kelra: 她这回没报战术。你只能凭她战斗服的火光，猜她在哪。)
on enter: {hp:-10}
from: tau_801 ⟵ “握紧步枪” | tau_801 ⟵ “握紧口袋里的东西”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_801, tau_708, tau_707, tau_706, tau_701, tau_611
  1. “掩护凯尔拉的战斗服” ROLL p=0.4+hp ✓tau_803 ✗tau_804 grudge(kelra) ⇒✓ 你冲出掩体，把一整块电池打进它的侧脸。它转过头，看向了你。 ⇒✗ 你的射击打在它的甲壳上，连一道痕都没留下。它甚至没有转头。
  2. “带平民去最后一艘船” → tau_805 ⇒ 你朝港口方向大喊，挥手让人往那边跑。乔里已经在舷梯口等你了。
  3. “握住雷娜姨的吊坠” → tau_806 require{flag:hasAquila} ⇒ 枪声和尖叫突然离你很远。你的手伸进口袋，摸到了那只小小的、冰凉的鹰。
  4. “向西拉斯的神献上一切” → tau_803 require{flag:cultMark} eff{corruption:40,hp:40,sanity:-10,taint:{khorne:90}} ⇒ 你说出了那个名字。有什么东西从你体内涌出来，接管了你的手，替你瞄准。

### tau_803 · ch8 · tau_city · 凯尔拉的战斗服 · foe:hive_tyrant · time{h:1}
你的射击逼它侧身了半步。就这半步，凯尔拉的战斗服从天而降，一记蒙卡斩在它肩上。 / 虫群主宰没有倒下。它后退了，盯着凯尔拉，像在背下她的样子。 / 它会记住的。下一次，就不灵了。
on enter: {renown:15}
from: tau_802(success) ⟵ “掩护凯尔拉的战斗服” | tau_802 ⟵ “向西拉斯的神献上一切”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_802, tau_801, tau_708, tau_707, tau_706, tau_701
  1. “撑住，等舰队” → tau_807 ⇒ 你靠着墙数电池。还剩三块。东方的天边开始发白。

### tau_804 · ch8 · tau_city · 旁白 · foe:hive_tyrant · time{h:1}
骨刃划过战斗服的驾驶舱。凯尔拉的频道里只剩下电流声。 / 你被甩出去，摔在一堵墙下。你看着那东西从凯尔拉身边走过，没有停留。 / 它已经学会了她。它不需要她了。
on enter: {hp:-20,sanity:-15,set:{kelraDead:true}}
from: tau_802(fail) ⟵ “掩护凯尔拉的战斗服”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_802, tau_801, tau_708, tau_707, tau_706, tau_701
  1. “爬向港口” → tau_807 ⇒ 你一寸一寸地爬。身后的城市在燃烧，前方的天边泛起了白光。

### tau_805 · ch8 · tau_city · 乔里 · foe:gaunt · time{h:3}
你和乔里守在舷梯口，把人一个一个推上船。人类，克鲁特，一个吓呆了的土族工程师。 / 没有人检查他们是第几批。 / 舱门关上时，乔里冲你笑：“看，我们是一批的。”
(grudgeLine jory: 他笑得有点勉强，像是在练习原谅你。)
on enter: {renown:10,hp:-10,sanity:10}
from: tau_802 ⟵ “带平民去最后一艘船”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_802, tau_801, tau_708, tau_707, tau_706, tau_701
  1. “转身面对虫群” → tau_807 grudge(jory) ⇒ 你和乔里背靠背站着，把最后的电池分成两份。虫潮涌上来时，天边亮了。

### tau_806 · ch8 · throne_light · 遥远的金光 · time{h:1}
你握着雷娜姨的吊坠，结结巴巴地念出一段小时候学的祷词。 / 什么都没发生。没有奇迹，没有光。 / 可你的手不抖了。在这个离帝皇最远的地方，你第一次明白雷娜姨为什么不肯扔掉它。
on enter: {sanity:20}  codex:imp_emperor
from: tau_802 ⟵ “握住雷娜姨的吊坠”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_802, tau_801, tau_708, tau_707, tau_706, tau_701
  1. “把吊坠戴上” → tau_807 ⇒ 你把吊坠挂在胸前，挂在钛人的护甲外面。没有人有空管你。

### tau_807 · ch8 · void · 影日的舰队 · time{d:1}
黎明时分，白色的舰队盖满了天空。轨道炮像一场倒着下的雨，烧穿了虫群的脊背。 / 虫群主宰最后看了一眼这座城，转身走进了孢子雾里。 / 它会回来的。但不是今天。
on enter: {sanity:10}  codex:tau_shadowsun
from: tau_803 ⟵ “撑住，等舰队” | tau_804 ⟵ “爬向港口” | tau_805 ⟵ “转身面对虫群” | tau_806 ⟵ “把吊坠戴上”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, kelraDead, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_802, tau_801, tau_708, tau_707, tau_706, tau_701
  1. “跟凯尔拉去海湾的另一边” → tau_end_enclaves require[{flag:farsightPact},{notFlag:kelraDead}] ⇒ 凯尔拉什么也没说，只递给你一套没有任何徽记的护甲。
  2. “接受大义的勋章” → tau_end_citizen require{stat:renown,min:40} ⇒ 你走向受勋台。台下的人类在鼓掌，台上的钛人在微笑。你分不清哪一边更响。
  3. “留在达尔诺尔的废墟上” → tau_end_watch ⇒ 最后一艘船起飞了。你没有上去，乔里也没有。
  4. “回头去找92号的碎片” → tau_end_devoured require{flag:droneLost} ⇒ 你逆着撤离的人流，走回了孢子雾里。

### tau_end_citizen · ch8 · tau_city · 瓦尚使节 · time{y:1} · **ENDING good**
瓦尚亲手把勋章别在你胸前，笑容完美。你成了第一个获此荣誉的古维萨。 / 你的孩子会在钛人的学校长大，学会说钛语，学会完美的微笑。 / 你常常想，这是好事。你几乎每次都这么想。
ending: 「大义的公民」 cause: 受勋成为大义公民
from: tau_807 ⟵ “接受大义的勋章”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, kelraDead, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_807, tau_802, tau_801, tau_708, tau_707, tau_706

### tau_end_devoured · ch8 · spore_sky · 旁白 · foe:gaunt · time{h:2} · **ENDING bad**
你在废墟里找到了92号最后一块碎片。它的灯，还亮着。 / 孢子雾里有东西在动。成千上万。 / 克鲁特吃东西是为了记住。虫子吃东西是为了忘掉。这一次，没有什么会留下来被记住。
ending: 「被吞噬」 cause: 被虫群吞噬
from: tau_807 ⟵ “回头去找92号的碎片”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, kelraDead, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_807, tau_802, tau_801, tau_708, tau_707, tau_706

### tau_end_enclaves · ch8 · tau_outpost · 红色战斗服 · time{d:60,warp:true} · **ENDING good**
红色的战斗服在海湾边等着。凯尔拉回头看了一眼达尔诺尔，没有说再见。 / 远见的飞地里，钛人、人类和克鲁特会为了一个决定吵上整整一夜。 / 没人叫这“暂时的误会”。他们叫它“开会”。
ending: 「海湾的另一边」 cause: 投奔远见飞地
from: tau_807 ⟵ “跟凯尔拉去海湾的另一边”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, kelraDead, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_807, tau_802, tau_801, tau_708, tau_707, tau_706

### tau_end_watch · ch8 · ruins · 乔里 · time{y:2} · **ENDING good**
你留了下来，和乔里、几个克鲁特，还有不肯走的人一起重建达尔诺尔。 / 旧教堂的空讲台上，挂着雷娜姨的双头鹰，旁边是钛人的圆环。 / 两年了，没人把哪一个摘下来。
ending: 「守望者」 cause: 留守达尔诺尔
from: tau_807 ⟵ “留在达尔诺尔的废墟上”
flags on arrival — MUST: ∅ · MAY-only: askedKelra, ateWithKroot, beggedForPOW, betrayedKelra, coachedPOW, coveredJory, cultMark, droneDamaged, droneLost, farsightCurious, farsightPact, firedHigh, flagged, forgiven_jory, forgiven_kelra, forgiven_rena, grrakDead, grrakFriend, hasAquila, heardBroadcast, helpedRena, hidStock, kelraDead, keptName, knowAquila, liaison, namedDrone, noticedCalm, origin_colonist, origin_pow, origin_trader, oweGrrak, pitiedImperials, powDefiant, powSigned, promisedRena, rememberGrrak, reportedRena, resistedCalm, shotCommissar, smuggledRefugees, wronged_jory, wronged_kelra, wronged_rena
certainly visited before (nearest 6): tau_807, tau_802, tau_801, tau_708, tau_707, tau_706
