# Route digest: orks — 97 nodes, origins: scrap@ork_101, guard@ork_o_guard_1, ganger@ork_o_ganger_1

Entered by the engine from anywhere (stat deaths, claim jumps): ork_death_hp, ork_death_sanity, ork_death_corruption, ork_end_claim_khorne, ork_end_claim_nurgle, ork_end_claim_tzeentch, ork_end_claim_slaanesh

Random events (eventRoll → data/events*.js) are not in this graph; they can also set flags. Time `d`/`h`/`y` is applied on entering the node. MUST = on every path to the node; MAY = on some path.

## Automatic findings (21)
- **INFO** `ork_o_guard_1`: flag 'packs' is set (at ork_o_guard_1) but never used by a require — only text may rely on it
- **INFO** `ork_o_ganger_3`: flag 'gotShoota' is set (at ork_o_ganger_3, ork_302) but never used by a require — only text may rely on it
- **INFO** `ork_204`: flag 'snitchedSnag' is set (at ork_204) but never used by a require — only text may rely on it
- **INFO** `ork_205`: flag 'stoleTeef' is set (at ork_205) but never used by a require — only text may rely on it
- **INFO** `ork_208`: flag 'needsReactor' is set (at ork_208) but never used by a require — only text may rely on it
- **INFO** `ork_302`: flag 'petSquig' is set (at ork_302) but never used by a require — only text may rely on it
- **INFO** `ork_308`: flag 'mekLoyal' is set (at ork_308) but never used by a require — only text may rely on it
- **INFO** `ork_401`: flag 'burnedSpores' is set (at ork_401) but never used by a require — only text may rely on it
- **INFO** `ork_402`: flag 'snitched' is set (at ork_402) but never used by a require — only text may rely on it
- **INFO** `ork_407`: flag 'snagGrudge' is set (at ork_407) but never used by a require — only text may rely on it
- **INFO** `ork_404`: flag 'flare' is set (at ork_404) but never used by a require — only text may rely on it
- **INFO** `ork_406`: flag 'betrayedResistance' is set (at ork_406) but never used by a require — only text may rely on it
- **INFO** `ork_501`: flag 'zogFriend' is set (at ork_501) but never used by a require — only text may rely on it
- **INFO** `ork_507`: flag 'gork' is set (at ork_507) but never used by a require — only text may rely on it
- **INFO** `ork_507`: flag 'mork' is set (at ork_507) but never used by a require — only text may rely on it
- **INFO** `ork_605`: flag 'moreBitz' is set (at ork_605) but never used by a require — only text may rely on it
- **INFO** `ork_606`: flag 'relicArmour' is set (at ork_606) but never used by a require — only text may rely on it
- **INFO** `ork_705`: flag 'toldWarboss' is set (at ork_705) but never used by a require — only text may rely on it
- **INFO** `ork_804`: flag 'shinyWon' is set (at ork_804) but never used by a require — only text may rely on it
- **INFO** `ork_805`: flag 'blamedMek' is set (at ork_805) but never used by a require — only text may rely on it
- **INFO** `ork_812`: flag 'luckyUmie' is set (at ork_812) but never used by a require — only text may rely on it

Join nodes (≥3 different parents — check the text does not assume any single parent's events): ork_104, ork_106, ork_207, ork_303, ork_405, ork_603, ork_707, ork_708, ork_811

## Nodes

### ork_death_corruption · chundefined · burning_city · 旁白 · **ENDING death**
你身上的记号越来越多，越来越烫。 / 某天早上，你的身体终于撑不住了，变成一团不停冒出新嘴巴的东西。 / 兽人们兴奋地围过来：“好怪的家伙！揍它！”这是它们能给的最高赞美。
ending: 「好怪的家伙」 cause: 腐化成了混沌怪物
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, blamedMek, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, luckyUmie, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, shinyWon, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend

### ork_death_hp · chundefined · ork_scrapyard · 旁白 · **ENDING death**
你倒在废铁堆里，和一千件别的废品躺在一起。 / 地精仔来了，拿走你的靴子、你的扳手、你兜里那颗牙。 / 明年这里会长出蘑菇，蘑菇底下会长出兽人。兽人不会知道你是谁。
ending: 「废铁堆」 cause: 倒在废铁堆里
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, blamedMek, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, luckyUmie, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, shinyWon, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend

### ork_death_sanity · chundefined · ork_fort · 旁白 · **ENDING death**
你开始在梦里吼“Waaagh！”，后来醒着也吼。 / 你把自己刷成绿色，相信自己会变大、变强、变快。兽人们看着你，没笑，有点感动。 / 你信得很用力。可惜，信念只对兽人管用。
ending: 「绿色的梦」 cause: 疯到以为自己是兽人
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, blamedMek, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, luckyUmie, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, shinyWon, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend

### ork_end_claim_khorne · chundefined · burning_city · 远处的鼓 · time{y:1} · **ENDING bad**
伊斯卡隆的仗没完没了：兽人打，人类打，红甲巨人也打。你打得越来越好，越来越停不下来。 / 有一天你发现，你已经不在乎打的是谁了。 / 血神很满意。这颗星球永远不缺头骨，现在也不缺你。
ending: 「永不停歇的仗」 cause: 在战争里被恐虐收走
on enter:   codex:god_khorne
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, blamedMek, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, luckyUmie, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, shinyWon, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend

### ork_end_claim_nurgle · chundefined · ork_scrapyard · 慈祥的声音 · time{d:40} · **ENDING bad**
你在蘑菇地里躺下歇一会儿。孢子很暖，泥土很软。 / 醒来时，你身上也长出了小小的蘑菇，带着一股甜腻的、放久了的味道。 / 兽人以为你是一种新的史奎格。慈父知道你是谁的孩子。
ending: 「蘑菇地」 cause: 孢子地里被纳垢收走
on enter:   codex:god_nurgle
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, blamedMek, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, luckyUmie, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, shinyWon, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend

### ork_end_claim_slaanesh · chundefined · ork_fort · 甜得发苦的声音 · time{y:3} · **ENDING bad**
你开始擦亮一切：枪、牙、护目镜、自己的脸。 / 兽人里最爱臭美的“亮仔”都夸你擦得好。可再亮也不够亮。 / 你擦了很多年，直到镜子里的自己完美得不像人。她喜欢完美。
ending: 「永远不够亮」 cause: 沉迷完美被色孽收走
on enter:   codex:god_slaanesh
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, blamedMek, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, luckyUmie, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, shinyWon, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend

### ork_end_claim_tzeentch · chundefined · manufactorum · 多出来的一行 · time{d:30} · **ENDING bad**
你终于弄懂了兽人的科技：信念让机器转动。 / 可你想得太深，想到了更深处那个也靠信念活着的东西。它说：你相信的，我都能让它成真。 / 你造的第一台机器完美无缺。它会变。它一直在变。
ending: 「会变的机器」 cause: 因求知被奸奇收走
on enter:   codex:god_tzeentch
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, blamedMek, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, luckyUmie, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, shinyWon, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend

### ork_101 · ch1 · ork_scrapyard · 旁白
伊斯卡隆，阿尔科萨星区的拆船星。你在废船骨架之间倒卖铜线和阀门，日子不坏。 / 那天，天空变绿了。一块块装着引擎的大石头砸进船坞。 / 石头里传出笑声。
on enter:   codex:place_iskaron,place_arcosa,xenos_ork
flags on arrival — MUST: origin_scrap · MAY-only: ∅
  1. “钻进一艘废船的肚子里躲起来” → ork_102
  2. “跑去防卫军的集结点” → ork_103
  3. “先抱起最值钱的那箱货” → ork_102 eff{renown:3,hp:-5} ⇒ 一箱伺服马达，沉得要命。你抱着它跑，像抱着自己的命。

### ork_o_ganger_1 · ch1 · underhive · 旁白
你是伊斯卡隆居住堆底层“锈牙帮”的人。绿天降临那晚，总督的卫兵全跑了。 / 帮主说：上面的人在逃，上面的东西没人看。 / 你们背起撬棍，往上爬。
on enter:   codex:place_iskaron
flags on arrival — MUST: origin_ganger · MAY-only: ∅
  1. “带头往上爬” → ork_o_ganger_2 eff{hp:-5,renown:3} ⇒ 你爬得最快，也最先被碎玻璃划破手。帮主拍你的肩：“好样的。”
  2. “留在后面放风” → ork_o_ganger_2 eff{sanity:5} ⇒ 你蹲在楼梯口，看着天上的绿光越来越亮，想着这辈子从没这么安静过。

### ork_o_guard_1 · ch1 · trench · 沃斯中士
你是星界军的列兵，驻守伊斯卡隆的船坞。沃斯中士嚼着烟草，看着天边那片绿。 / “兽人，”他说，“别想着赢。想着多拉几个垫背的。” / 第一块带引擎的石头落在三公里外。
on enter:   codex:imp_guard,place_iskaron
flags on arrival — MUST: origin_guard · MAY-only: ∅
  1. “把激光枪电池擦得锃亮” → ork_o_guard_2 eff{renown:3,set:{packs:true}} ⇒ 中士瞥了一眼：“好习惯。兽人最爱抢这玩意儿。”
  2. “给家里写最后一封信” → ork_o_guard_2 eff{sanity:5} ⇒ 你写了三行，划掉两行。剩下那句是：别等我吃饭。

### ork_102 · ch1 · ork_scrapyard · 旁白 · foe:ork · time{h:1}
你钻进的是那艘瓦尔达什一税船的残骸。它当年没飞到奥雷克斯二号，坠在了这儿。 / 外面，一个绿皮大块头肚子挨了一枪，低头看看，大笑着接着冲。 / 然后它闻到了你。
on enter:   codex:place_valda_wreck
from: ork_101 ⟵ “钻进一艘废船的肚子里躲起来” | ork_101 ⟵ “先抱起最值钱的那箱货”
flags on arrival — MUST: origin_scrap · MAY-only: ∅
certainly visited before (nearest 6): ork_101
  1. “一动不动，装死” → ork_104 eff{sanity:-5} ⇒ 它用靴子把你翻过来，嗅了嗅，失望地嘟囔：“没打。”然后拎起了你的后领。
  2. “抄起扳手砸它” → ork_104 eff{hp:-15,renown:3,taint:{khorne:10}} ⇒ 扳手弹了回来。兽人摸摸脑门，咧嘴一笑：“小家伙有种！”一拳把你打晕了。
  3. “举起一个闪亮的阀门” → ork_104 eff{renown:3} ⇒ 它盯着阀门，眼睛发直，伸手把阀门连同你一起抓走了。

### ork_103 · ch1 · trench · 防卫军士兵 · foe:ork · time{h:1}
防卫军沿着船坞挖了一道壕沟。军官喊：“守住！”然后兽人来了。 / 它们不躲子弹，它们迎着子弹跑，一边跑一边吼：“Waaagh！” / 吼声大得让你的牙齿都在嗡嗡响。
on enter:   codex:xenos_waaagh
from: ork_101 ⟵ “跑去防卫军的集结点”
flags on arrival — MUST: origin_scrap · MAY-only: ∅
certainly visited before (nearest 6): ork_101
  1. “捡起死人的激光枪开火” ROLL p=0.5+hp ✓ork_104 ✗ork_105 ⇒✓ 你打光了一整个电池。倒下三个兽人，站起来两个。最后一个笑着把你拎出了壕沟。 ⇒✗ 一把砍刀拍在你肩上。用的是刀面，因为兽人觉得这样好玩。
  2. “趴在壕沟底下” → ork_104 eff{sanity:-10} ⇒ 兽人一个接一个从你头顶跳过去。有一个踩在你背上，停下来，嫌你太软。

### ork_o_ganger_2 · ch1 · hive_spire · 红戈布船长 · foe:ork · time{h:5}
总督塔里已经有人了：一伙兽人正在拆金框画、撬门把手，往一艘破船上搬。 / 领头的戴着一顶插羽毛的帽子。看见你们，他没开枪。 / “人仔！”他说，“你们认得哪些值钱？”
on enter:   codex:ork_freebooterz
from: ork_o_ganger_1 ⟵ “带头往上爬” | ork_o_ganger_1 ⟵ “留在后面放风”
flags on arrival — MUST: origin_ganger · MAY-only: ∅
certainly visited before (nearest 6): ork_o_ganger_1
  1. “认得，我带路” → ork_o_ganger_3 eff{renown:5,set:{freebooterFriend:true}} ⇒ 船长咧嘴一笑，满嘴金牙。“聪明人仔！聪明的不用揍。”
  2. “拔腿就跑” → ork_o_ganger_3 eff{hp:-15} ⇒ 你跑了三层楼，小腿挨了一枪。羽毛帽亲自把你拎了回来，表示欣赏。

### ork_o_guard_2 · ch1 · trench · 旁白 · foe:ork · time{h:6}
冲锋来了。兽人跑得比你见过的任何东西都快，有的骑着冒黑烟的摩托，车身全刷成红色。 / 你开枪，开枪，开枪。沃斯中士在吼什么，全被引擎声盖住了。
on enter:   codex:xenos_waaagh
from: ork_o_guard_1 ⟵ “把激光枪电池擦得锃亮” | ork_o_guard_1 ⟵ “给家里写最后一封信”
flags on arrival — MUST: origin_guard · MAY-only: packs
certainly visited before (nearest 6): ork_o_guard_1
  1. “守住阵地，打到最后” → ork_o_guard_3 eff{hp:-20,renown:5,taint:{khorne:10}} ⇒ 你打倒了一个，又一个。然后一个兽人用整辆摩托砸中了你。
  2. “跟着中士后撤” → ork_o_guard_3 eff{sanity:-5} ⇒ 你们退了两百米。中士回头看了一眼阵地，从此没再说话。后来你们被冲散了。

### ork_104 · ch1 · ork_fort · 旁白 · foe:gretchin · time{d:1}
俘虏被赶进一圈废铁围栏。看守是一群尖耳朵的小绿东西，扛着比自己还大的枪，互相踢屁股。 / 每隔一会儿就有兽人进来挑人：能打的拉去打架坑，太瘦的拉去喂史奎格。
on enter:   codex:ork_gretchin,place_ork_fort
from: ork_102 ⟵ “一动不动，装死” | ork_102 ⟵ “抄起扳手砸它” | ork_102 ⟵ “举起一个闪亮的阀门” | ork_103(success) ⟵ “捡起死人的激光枪开火” | ork_103 ⟵ “趴在壕沟底下” | ork_105 ⟵ “爬起来”
flags on arrival — MUST: origin_scrap · MAY-only: ∅
certainly visited before (nearest 6): ork_101
  1. “挺起胸膛，装作能打” → ork_107 eff{hp:-10,taint:{khorne:10}} ⇒ 一个头目捏了捏你的胳膊，大笑：“软！”你被一脚踢进了史奎格圈。
  2. “缩着脖子，显得没用” → ork_107 eff{sanity:-5} ⇒ 你成功地显得很没用。于是你被分去了史奎格那边。
  3. “大声念出废料上的帝国标签” → ork_106 eff{renown:5} ⇒ “……等离子导管，第三型，严禁敲击。”一个挂满扳手的兽人猛地转过头来。

### ork_105 · ch1 · ruins · 巴兹戈布医生佬 · time{h:3}
你醒来时，一个兽人正拿着锯子打量你的肩膀。它的围裙上全是油，还有别的什么。 / “医生佬瞅瞅……”它嘟囔，“人仔的零件太小，不好修。不修了。” / 它把你扔上了俘虏堆。
on enter: {hp:-15}  codex:ork_painboyz
from: ork_103(fail) ⟵ “捡起死人的激光枪开火”
flags on arrival — MUST: origin_scrap · MAY-only: ∅
certainly visited before (nearest 6): ork_103, ork_101
  1. “爬起来” → ork_104

### ork_o_ganger_3 · ch1 · hive_spire · 红戈布船长 · time{h:6}
红戈布船长是自由海盗：被自己部落踢出来的兽人，谁给的牙多就替谁打。 / 你帮他们找到了总督的金库。他赏你一把牙，真正的兽人牙，沉甸甸的。 / “牙就是钱，”他说，“掉了还会长。”
on enter: {renown:5}  codex:ork_teef
from: ork_o_ganger_2 ⟵ “认得，我带路” | ork_o_ganger_2 ⟵ “拔腿就跑”
flags on arrival — MUST: origin_ganger · MAY-only: freebooterFriend
certainly visited before (nearest 6): ork_o_ganger_2, ork_o_ganger_1
  1. “把牙塞满每个口袋” → ork_o_ganger_4 eff{renown:5,taint:{slaanesh:15}} ⇒ 你走路时它们叮当作响，像在笑。你忍不住一遍遍去摸。
  2. “要一把枪，不要牙” → ork_o_ganger_4 eff{set:{gotShoota:true}} ⇒ 船长扔给你一把突突枪，比你的胳膊还长。“别冲着自己。”

### ork_o_guard_3 · ch1 · ork_fort · 斯卡巴德头目 · time{d:1}
你醒来时躺在俘虏堆里。一个比门还宽的兽人头目踢了踢你。 / “这个打过。打得不赖，”他说，“打架坑留着。” / 人堆里有人小声说：进坑的人仔，没一个活过第二场。
on enter:   codex:place_ork_fort
from: ork_o_guard_2 ⟵ “守住阵地，打到最后” | ork_o_guard_2 ⟵ “跟着中士后撤”
flags on arrival — MUST: origin_guard · MAY-only: packs
certainly visited before (nearest 6): ork_o_guard_2, ork_o_guard_1
  1. “站起来，迎着他的目光” → ork_o_guard_4 eff{renown:5,hp:-5,taint:{khorne:10}} ⇒ 头目一巴掌把你扇回地上，笑得很开心：“对！就要这个！”
  2. “低头不动” → ork_o_guard_4 eff{sanity:-5} ⇒ 头目失去了兴趣。你听见他在跟别人赌你能撑几分钟。

### ork_106 · ch1 · manufactorum · 机械佬瓦兹格布 · time{h:2}
挂满扳手的兽人把你拎进一座塞满废铁的旧工厂，往地上一扔。 / “俺是瓦兹格布，机械佬。你，人仔，认得人仔的字。”他敲敲一块帝国铭牌，“这个。念。” / 他脑子里知道怎么造枪，只是不识字。
on enter:   codex:ork_meks,place_wazgob_shop
from: ork_104 ⟵ “大声念出废料上的帝国标签” | ork_107(success) ⟵ “一动不动” | ork_107 ⟵ “把旁边的地精仔推进去” | ork_107 ⟵ “往史奎格嘴里塞一根铁管” | ork_109 ⟵ “一瘸一拐地跟上” | ork_o_guard_4 ⟵ “告诉他电池怎么充电” | ork_o_guard_4 ⟵ “一言不发” | ork_o_ganger_4 ⟵ ““说话算话！”” | ork_o_ganger_4 ⟵ “朝他啐一口”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, origin_ganger, origin_guard, origin_scrap, packs
  1. “照实念” → ork_108 eff{renown:5} ⇒ “……警告：反应堆过热时请勿……”瓦兹格布听完大笑，把铭牌拧下来当了锅盖。
  2. “编一句吓唬他” → ork_108 eff{renown:-3,sanity:5,set:{wronged_wazgob:true}} ⇒ “上面说，碰它会爆炸。”瓦兹格布立刻碰了它。没炸。他盯着你看了很久，一扳手敲在你头上：“骗俺！”
  3. “问他能给你什么” → ork_108 eff{renown:3,hp:-5} ⇒ 他用扳手敲了你一下，不重。“给你？命。有用的话，再给颗牙。”

### ork_107 · ch1 · ork_fort · 地精仔斯纳吉特 · foe:squig · time{h:4}
史奎格圈里全是球：长着腿和一张大嘴的球。它们吃铁皮、吃靴子、吃同类，什么都吃。 / 一个地精仔隔着栅栏冲你笑：“新来的？别动。它们追会动的。” / 离你最近的那只开始流口水。
on enter:   codex:ork_squigs
from: ork_104 ⟵ “挺起胸膛，装作能打” | ork_104 ⟵ “缩着脖子，显得没用”
flags on arrival — MUST: origin_scrap · MAY-only: ∅
certainly visited before (nearest 6): ork_104, ork_101
  1. “一动不动” ROLL p=0.5+sanity ✓ork_106 ✗ork_109 ⇒✓ 史奎格嗅了你半天，只咬走了一只靴子。地精仔用长杆把你钩出栅栏：“机械佬要人。你。” ⇒✗ 你的膝盖在抖。史奎格看见了。
  2. “把旁边的地精仔推进去” → ork_106 eff{renown:3,sanity:-5,taint:{khorne:15}} ⇒ 史奎格欢快地追着那个地精跑了。栅栏外的地精仔笑得很开心，眼睛却记住了你。
  3. “往史奎格嘴里塞一根铁管” → ork_106 eff{hp:-5,renown:2} ⇒ 它咬断铁管，嚼得嘎嘣响，满意地走开了。栅栏外，一个挂满扳手的兽人点了点头。

### ork_o_ganger_4 · ch1 · ork_scrapyard · 红戈布船长 · time{d:3}
三天后海盗船要起飞，船上没有人仔的位置。红戈布把你推给一个挂满扳手的机械佬，换了一把定做的突突枪。 / “别哭，”船长拍拍你的脸，“要是你零件还齐，俺回来买你。”
from: ork_o_ganger_3 ⟵ “把牙塞满每个口袋” | ork_o_ganger_3 ⟵ “要一把枪，不要牙”
flags on arrival — MUST: origin_ganger · MAY-only: freebooterFriend, gotShoota
certainly visited before (nearest 6): ork_o_ganger_3, ork_o_ganger_2, ork_o_ganger_1
  1. ““说话算话！”” → ork_106 eff{set:{freebooterFriend:true}} ⇒ 船长大笑：“自由海盗从不算话。不过俺记性好。”
  2. “朝他啐一口” → ork_106 eff{renown:-3,sanity:5} ⇒ 他擦掉唾沫，笑得更开心了。“有种！”你心里好受了一点。

### ork_o_guard_4 · ch1 · ork_fort · 机械佬瓦兹格布 · time{h:5}
开坑前，一个挂满扳手的兽人挤了过来，拎起你的电池包闻了闻。 / “这个人仔认得发光枪的电池，”他对头目说，“换给俺。俺给你一把会喷火的。” / 讨价还价持续了一拳。
from: ork_o_guard_3 ⟵ “站起来，迎着他的目光” | ork_o_guard_3 ⟵ “低头不动”
flags on arrival — MUST: origin_guard · MAY-only: packs
certainly visited before (nearest 6): ork_o_guard_3, ork_o_guard_2, ork_o_guard_1
  1. “告诉他电池怎么充电” → ork_106 eff{renown:5} ⇒ 你说得很快。他只听懂一半，可听懂的那一半让他非常满意。
  2. “一言不发” → ork_106 eff{sanity:-5} ⇒ 他不在乎你说不说话，只在乎你有没有用。你被他扛上了肩膀。

### ork_108 · ch1 · manufactorum · 地精仔斯纳吉特 · time{h:8}
夜里，你被链子拴在工作台腿上。地精仔斯纳吉特蹲在台面上啃一根螺栓。 / “你运气好，机械佬的人仔活得久一点。上一个活了三个星期。” / 他想了想：“不，两个。”
from: ork_106 ⟵ “照实念” | ork_106 ⟵ “编一句吓唬他” | ork_106 ⟵ “问他能给你什么”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, origin_ganger, origin_guard, origin_scrap, packs, wronged_wazgob
certainly visited before (nearest 6): ork_106
  1. “问上一个人仔怎么了” → ork_201 eff{sanity:-5} ⇒ “他跟机械佬说，红的不会跑得快。”斯纳吉特耸耸肩，“后来他跑得很快。从炮管里。”
  2. “分给他一点口粮” → ork_201 eff{hp:-5,set:{snagFriend:true}} ⇒ 斯纳吉特一把抢过去塞进嘴里，然后小声说：“明天别站在测试台前面。”
  3. “闭上眼睡觉” → ork_201 eff{hp:5} ⇒ 你梦见船坞，梦见铜线的价钱。外面兽人在唱歌，或者在打架，听不出区别。

### ork_109 · ch1 · ork_fort · 旁白 · foe:squig · time{h:1}
史奎格追会动的东西。你的膝盖动了。 / 地精仔用带钩的长杆把你拖出来，顺手摸走了你的打火机。 / “机械佬要人，”他说，“算你走运。”
on enter: {hp:-15}
from: ork_107(fail) ⟵ “一动不动”
flags on arrival — MUST: origin_scrap · MAY-only: ∅
certainly visited before (nearest 6): ork_107, ork_104, ork_101
  1. “一瘸一拐地跟上” → ork_106

### ork_201 · ch2 · manufactorum · 机械佬瓦兹格布 · time{d:3}
瓦兹格布在造“大亮闪”：一副比房子还高的动力甲，给要当老大的那位穿。 / 他不画图纸，他敲。敲不响就换个地方敲，敲响了就算修好。 / 怪就怪在，它真的越敲越好。
(grudgeLine wazgob: 瓦兹格布一边敲，一边斜着眼瞪你：“上回骗俺那句，俺记着呢。”)
on enter:   codex:ork_mega_armour
from: ork_108 ⟵ “问上一个人仔怎么了” | ork_108 ⟵ “分给他一点口粮” | ork_108 ⟵ “闭上眼睡觉”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, origin_ganger, origin_guard, origin_scrap, packs, snagFriend, wronged_wazgob
certainly visited before (nearest 6): ork_108, ork_106
  1. “递给他正确的扳手” → ork_202 eff{renown:3} grudge(wazgob) ⇒ 他看都没看就接了过去。“好人仔。”这是你头一回被兽人夸，感觉很怪。
  2. “指出他接错了线” → ork_203 eff{renown:-2,taint:{tzeentch:15}} ⇒ 他瞪着你，又瞪着线。“错了？”他想了想，“那它咋能用？”
  3. “偷偷看他怎么敲” → ork_202 eff{sanity:-5,taint:{tzeentch:25}} ⇒ 你看了一整天，得出结论：这不可能。你又看了一天，结论没变，机器照转。

### ork_202 · ch2 · ork_scrapyard · 机械佬瓦兹格布 · time{h:6}
瓦兹格布把一辆破车刷成红色。“红的跑得快！” / “油漆不会让车变快，”你说。 / 他把车开上测试道。车快得发了疯，冒着火冲过终点，撞穿两堵墙。 / “看见没？红的！”
on enter:   codex:ork_belief_tech
from: ork_201 ⟵ “递给他正确的扳手” | ork_201 ⟵ “偷偷看他怎么敲”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, origin_ganger, origin_guard, origin_scrap, packs, snagFriend, wronged_wazgob
certainly visited before (nearest 6): ork_201, ork_108, ork_106
  1. “掏出测速仪测一次” → ork_204 eff{sanity:-5,renown:3} ⇒ 你测了三次。红车比同型号的灰车快百分之十一。你把测速仪扔进了熔炉。
  2. ““对！红的快！”” → ork_204 eff{renown:5,sanity:-5} ⇒ 瓦兹格布拍你的背，差点拍断。“这人仔，懂！”

### ork_203 · ch2 · manufactorum · 机械佬瓦兹格布 · time{h:2}
你照帝国手册把线重接了一遍，整整齐齐。 / 瓦兹格布按下开关。什么都没发生。 / 他把线扯回原来的乱样子，再按。机器轰地转了起来。 / “人仔的办法，”他宽容地说，“兽人不信，所以不灵。”
on enter: {sanity:-5}  codex:ork_belief_tech
from: ork_201 ⟵ “指出他接错了线”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, origin_ganger, origin_guard, origin_scrap, packs, snagFriend, wronged_wazgob
certainly visited before (nearest 6): ork_201, ork_108, ork_106
  1. ““……好吧。”” → ork_204

### ork_204 · ch2 · manufactorum · 地精仔斯纳吉特 · time{d:2}
斯纳吉特把你拉到角落：“机械佬的牙罐子就在工作台底下。拿一点，他数不清。他只会数到‘好多’。” / 地精仔眼睛发亮。在兽人底下活着的东西，都学会了偷。
(grudgeLine wazgob: 机械佬就睡在三步外，一只眼睁着，脚还压着罐盖。)
on enter:   codex:ork_teef
from: ork_202 ⟵ “掏出测速仪测一次” | ork_202 ⟵ ““对！红的快！”” | ork_203 ⟵ ““……好吧。””
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, origin_ganger, origin_guard, origin_scrap, packs, snagFriend, wronged_wazgob
certainly visited before (nearest 6): ork_201, ork_108, ork_106
  1. “跟他一起偷” ROLL p=0.55 ✓ork_205 ✗ork_206 grudge(wazgob) ⇒✓ 你们得手了。罐子里的牙少了一把，罐子看起来还是“好多”。 ⇒✗ 你的手刚伸进罐子，一只绿色的大手就按住了你的手。
  2. “告诉机械佬” → ork_207 eff{renown:5,set:{snitchedSnag:true,wronged_snaggit:true}} ⇒ 瓦兹格布一脚把斯纳吉特踢出了窗户。地精仔落地，爬起来，回头看了你一眼。
  3. “不掺和” → ork_207 eff{hp:-5} ⇒ 斯纳吉特耸耸肩，自己去了。第二天他的口袋鼓了，你的口粮少了一半。

### ork_205 · ch2 · manufactorum · 地精仔斯纳吉特 · time{h:3}
斯纳吉特分给你三颗，自己留了七颗，说这叫“地精的算术”。 / 那天晚上，瓦兹格布数了数罐子：“好多。” / 他满意地睡着了。
on enter: {renown:8,set:{stoleTeef:true,snagFriend:true}}
from: ork_204(success) ⟵ “跟他一起偷”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, origin_ganger, origin_guard, origin_scrap, packs, snagFriend, wronged_wazgob
certainly visited before (nearest 6): ork_204, ork_201, ork_108, ork_106
  1. “把牙藏进鞋里” → ork_207

### ork_206 · ch2 · manufactorum · 机械佬瓦兹格布 · time{h:1}
瓦兹格布从你手里拿回牙，没生气。他把你倒提起来晃，直到所有口袋都空了。 / “偷，好！”他说，“被抓，蠢！” / 为了公平，他也踢了斯纳吉特一脚。
on enter: {hp:-15,renown:-3}  codex:ork_kultur
from: ork_204(fail) ⟵ “跟他一起偷”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, origin_ganger, origin_guard, origin_scrap, packs, snagFriend, wronged_wazgob
certainly visited before (nearest 6): ork_204, ork_201, ork_108, ork_106
  1. “揉着脑袋爬起来” → ork_207

### ork_207 · ch2 · manufactorum · 旁白 · foe:squig · time{d:4} · eventRoll 0.35
一只史奎格猎犬挣断了链子。它只有一张嘴，和一张嘴能装下的所有牙。 / 兽人们没去抓它，反而围成一圈开始下注。 / 它朝你冲了过来。
from: ork_204 ⟵ “告诉机械佬” | ork_204 ⟵ “不掺和” | ork_205 ⟵ “把牙藏进鞋里” | ork_206 ⟵ “揉着脑袋爬起来”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, origin_ganger, origin_guard, origin_scrap, packs, snagFriend, snitchedSnag, stoleTeef, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_204, ork_201, ork_108, ork_106
  1. “跳上工作台” ROLL p=0.5+hp ✓ork_208 ✗ork_209 ⇒✓ 你跳得够高。史奎格在下面绕圈，最后被套住了。押你输的兽人骂骂咧咧。 ⇒✗ 你的脚滑了一下。
  2. “把晚饭扔给它” → ork_208 eff{hp:-5,renown:2} ⇒ 史奎格接住晚饭，嚼了两下，又看向你。不过这时它已经被套住了。
  3. “拿扳手迎上去” → ork_208 eff{hp:-15,renown:6,taint:{khorne:15}} ⇒ 一扳手敲在它鼻子上。它愣住了，兽人们疯了，赢钱的几个把你扛起来转圈。

### ork_208 · ch2 · manufactorum · 斯卡巴德头目 · time{d:5}
斯卡巴德头目来看大亮闪。他比别的兽人高一个头，因为他打赢的架比别人多一倍。 / “穿上它，俺就揍扁格鲁卡，当大老大。谁最大，谁说了算。” / 他低头看你：“人仔，这个，结实不？”
on enter:   codex:ork_nobz,ork_kultur
from: ork_207(success) ⟵ “跳上工作台” | ork_207 ⟵ “把晚饭扔给它” | ork_207 ⟵ “拿扳手迎上去” | ork_209 ⟵ “一瘸一拐地回去干活”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, origin_ganger, origin_guard, origin_scrap, packs, snagFriend, snitchedSnag, stoleTeef, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_207, ork_204, ork_201, ork_108, ork_106
  1. ““结实得很，头目”” → ork_210 eff{renown:3} ⇒ 斯卡巴德满意地拍了拍盔甲。一块护板掉了下来。所有人都假装没看见。
  2. ““还差一颗够劲的心脏”” → ork_210 eff{renown:5,set:{needsReactor:true}} ⇒ 斯卡巴德转向瓦兹格布：“听见没？够劲的！”瓦兹格布看你的眼神多了点什么。
  3. ““它会让您变得更大”” → ork_210 eff{renown:5,taint:{slaanesh:15}} ⇒ 斯卡巴德愣住了，然后笑了很久。“更大。”他重复了一遍，像在尝这个词。

### ork_209 · ch2 · manufactorum · 旁白 · foe:squig · time{h:1}
你跳得不够高。 / 史奎格咬住了你的靴子，和靴子里的东西。兽人们哄堂大笑，有人赢了很多牙。 / 瓦兹格布最后用撬棍撬开了它的嘴，嘟囔：“别弄坏俺的人仔。”
on enter: {hp:-20}
from: ork_207(fail) ⟵ “跳上工作台”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, origin_ganger, origin_guard, origin_scrap, packs, snagFriend, snitchedSnag, stoleTeef, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_207, ork_204, ork_201, ork_108, ork_106
  1. “一瘸一拐地回去干活” → ork_208

### ork_210 · ch2 · ork_scrapyard · 兽人小子 · time{d:2}
小子们在试新枪。他们不瞄准，只是开枪，越多越好。 / “更多突突！”一个小子吼。瓦兹格布给每把枪又加了一根枪管。 / 测试靶子是一块铁板，和站在铁板旁边扶着它的你。
from: ork_208 ⟵ ““结实得很，头目”” | ork_208 ⟵ ““还差一颗够劲的心脏”” | ork_208 ⟵ ““它会让您变得更大””
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, needsReactor, origin_ganger, origin_guard, origin_scrap, packs, snagFriend, snitchedSnag, stoleTeef, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_208, ork_207, ork_204, ork_201, ork_108, ork_106
  1. “站着别动，相信他们打不准” → ork_301 eff{hp:-10,renown:5} ⇒ 子弹打得到处都是，唯独没打中铁板。你被擦破几处皮，小子们为你的勇气欢呼。
  2. “扔下铁板趴下” → ork_301 eff{sanity:-5} ⇒ 你趴下的瞬间，铁板被打成了筛子。小子们对你的反应速度表示失望。

### ork_301 · ch3 · ork_fort · 机械佬瓦兹格布 · time{d:20}
瓦兹格布第一次给你发工钱：一颗兽人牙，还带着点血。 / “牙币，兽人的钱。掉了还会长，所以谁都有，所以谁都想要更多。” / 堡垒的集市开张了，每个摊子都在吼。
on enter: {renown:3,hp:5}  codex:ork_teef
from: ork_210 ⟵ “站着别动，相信他们打不准” | ork_210 ⟵ “扔下铁板趴下”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, needsReactor, origin_ganger, origin_guard, origin_scrap, packs, snagFriend, snitchedSnag, stoleTeef, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_210, ork_208, ork_207, ork_204, ork_201, ork_108
  1. “去黄月亮部落的摊子逛逛” → ork_302
  2. “去打架坑下注” → ork_304
  3. “把牙藏好，攒着” → ork_303 eff{renown:2} ⇒ 你把牙缝进了衣角。走到半路，有人拦住了你。

### ork_302 · ch3 · ork_fort · 黄月亮商人 · time{h:2}
黄月亮部落的商人满嘴金牙。他们的牙长得比谁都快，所以最有钱。 / 摊上有：一把突突枪，一罐“幸运蓝漆”，一只关在笼里的小史奎格。 / “人仔价，”他说，“加倍。”
on enter:   codex:ork_klans
from: ork_301 ⟵ “去黄月亮部落的摊子逛逛”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, needsReactor, origin_ganger, origin_guard, origin_scrap, packs, snagFriend, snitchedSnag, stoleTeef, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_301, ork_210, ork_208, ork_207, ork_204, ork_201
  1. “买那把突突枪” → ork_303 require{stat:renown,min:15} eff{renown:-8,set:{gotShoota:true}} ⇒ 枪很重，瞄不准，但很响。兽人说响的枪更准。你开始怀疑他们是对的。
  2. “买蓝漆抹在额头上” → ork_303 eff{renown:-4,set:{luckyBlue:true}} ⇒ 死头骷部落相信蓝色带来好运。兽人看你的眼神变了：一个懂规矩的人仔。
  3. “买下那只小史奎格” → ork_303 eff{renown:-4,hp:5,set:{petSquig:true}} ⇒ 它咬了你一口，然后就认了你。你叫它“抽屉”，因为它总想往里钻。
  4. “只看不买” → ork_303

### ork_303 · ch3 · ork_fort · 巴兹戈布医生佬 · time{h:4}
巴兹戈布医生佬拦住了你。“人仔！胳膊伸出来。” / 他另一只手里拿着锯子，桶里泡着几条绿胳膊，有的还在动。 / “兽人的零件，换上更结实，”他热情地说，“免费！医生佬想试试。”
on enter:   codex:ork_painboyz
from: ork_301 ⟵ “把牙藏好，攒着” | ork_302 ⟵ “买那把突突枪” | ork_302 ⟵ “买蓝漆抹在额头上” | ork_302 ⟵ “买下那只小史奎格” | ork_302 ⟵ “只看不买” | ork_304 ⟵ “押个子大的” | ork_304(fail) ⟵ “押个子小的” | ork_304 ⟵ “自己跳下去” | ork_307 ⟵ “抱着桶溜走”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, luckyBlue, needsReactor, origin_ganger, origin_guard, origin_scrap, packs, petSquig, snagFriend, snitchedSnag, stoleTeef, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_301, ork_210, ork_208, ork_207, ork_204, ork_201
  1. “拔腿就跑” ROLL p=0.55+hp ✓ork_305 ✗ork_306 ⇒✓ 你跑进了人堆。医生佬在后面喊：“下次！” ⇒✗ 你没跑过一个拿着锯子、心情很好的兽人。
  2. “拿牙贿赂他” → ork_305 require{stat:renown,min:8} eff{renown:-5} ⇒ 医生佬咬了咬牙币，确认是真的，挥手放你走了。“下次！”
  3. “让他换” → ork_306 eff{sanity:-10} ⇒ 你闭上眼。锯子声很快，缝线很慢。医生佬一直在哼歌。

### ork_304 · ch3 · ork_fort · 旁白 · foe:ork_nob · time{h:3}
打架坑里，两个兽人在吵：谁的突突枪更响。 / 解决办法很简单：打一架。赢的就是对的。 / 观众吼着下注，牙币像雨一样落进坑边的桶里。
on enter:   codex:place_fight_pit,ork_kultur
from: ork_301 ⟵ “去打架坑下注”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, needsReactor, origin_ganger, origin_guard, origin_scrap, packs, snagFriend, snitchedSnag, stoleTeef, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_301, ork_210, ork_208, ork_207, ork_204, ork_201
  1. “押个子大的” → ork_303 eff{renown:4} ⇒ 大个子赢了。兽人从不押小的，所以赔率很低，但你赢了。
  2. “押个子小的” ROLL p=0.3 ✓ork_307 ✗ork_303 ⇒✓ 小个子一头撞翻了大个子。全场安静了一秒。 ⇒✗ 小个子被一拳打出了坑。你的牙落进了别人的桶里。
  3. “自己跳下去” → ork_303 eff{hp:-25,renown:10,taint:{khorne:10}} ⇒ 你被揍得很惨，可你站着出来了。兽人们觉得这又好笑又可敬。坑边的血让你心跳很响。

### ork_305 · ch3 · ork_fort · 格鲁卡大老大 · time{d:1} · eventRoll 0.35
格鲁卡大老大来巡视了。他是这颗星球上最大的兽人，大到走路时地面都在让路。 / 两个小子在他面前吵架。他没听，一个头槌，两个都躺下了。纠纷解决。 / 他看见了你。“这是啥？”
on enter:   codex:xenos_ork_warboss,ork_grukka
from: ork_303(success) ⟵ “拔腿就跑” | ork_303 ⟵ “拿牙贿赂他” | ork_306 ⟵ “活动一下那根手指”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, luckyBlue, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, snagFriend, snitchedSnag, stoleTeef, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_303, ork_301, ork_210, ork_208, ork_207, ork_204
  1. ““机械佬的人仔，大老大”” → ork_308 eff{renown:3} ⇒ 格鲁卡哼了一声：“瓦兹格布的玩具。”他提到这个名字时，口气不太好。
  2. “讲个笑话” ROLL p=0.45+sanity ✓ork_308 ✗ork_310 ⇒✓ 你讲了个政委的笑话。格鲁卡笑得一拳打塌了一根柱子。 ⇒✗ 格鲁卡没笑。兽人不懂讽刺，只懂拳头。
  3. “跪下” → ork_310 eff{renown:-3} ⇒ 兽人不懂下跪。格鲁卡以为你在找掉在地上的东西，帮你找了一会儿，没找到，有点生气。

### ork_306 · ch3 · ork_fort · 巴兹戈布医生佬 · time{d:2}
你醒来时，左手多了一根绿色的手指。它不太听你的，但很有劲。 / 医生佬很得意：“没长好就再来！” / 你决定以后绕着他的帐篷走。
on enter: {hp:-10,set:{orkBitz:true}}
from: ork_303(fail) ⟵ “拔腿就跑” | ork_303 ⟵ “让他换”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, luckyBlue, needsReactor, origin_ganger, origin_guard, origin_scrap, packs, petSquig, snagFriend, snitchedSnag, stoleTeef, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_303, ork_301, ork_210, ork_208, ork_207, ork_204
  1. “活动一下那根手指” → ork_305 eff{sanity:-5,taint:{nurgle:15}} ⇒ 它自己弯了一下，像在跟你打招呼。伤口闻起来有股蘑菇味。

### ork_307 · ch3 · ork_fort · 旁白 · time{h:1}
然后所有兽人都转过头，看着那个押了小个子的人仔。 / 桶里的牙，一半归你了。 / 这下全堡垒的兽人都认得你了。这不一定是好事。
on enter: {renown:12,sanity:5}
from: ork_304(success) ⟵ “押个子小的”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, needsReactor, origin_ganger, origin_guard, origin_scrap, packs, snagFriend, snitchedSnag, stoleTeef, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_304, ork_301, ork_210, ork_208, ork_207, ork_204
  1. “抱着桶溜走” → ork_303

### ork_308 · ch3 · manufactorum · 机械佬瓦兹格布 · time{d:2}
瓦兹格布听说了大老大的事，把你拉回作坊，第一次跟你说悄悄话。 / “格鲁卡喜欢俺的枪，不喜欢俺。等大亮闪好了，斯卡巴德当老大，俺当大机械佬。” / 兽人的悄悄话，整条街都听得见。
from: ork_305 ⟵ ““机械佬的人仔，大老大”” | ork_305(success) ⟵ “讲个笑话” | ork_310 ⟵ “打” | ork_310 ⟵ “跟地精仔一起演一场” | ork_310 ⟵ “拒绝”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, luckyBlue, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, snagFriend, snitchedSnag, stoleTeef, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_305, ork_303, ork_301, ork_210, ork_208, ork_207
  1. ““我能帮什么？”” → ork_311 eff{renown:3,set:{mekLoyal:true}} ⇒ 瓦兹格布咧嘴一笑：“活着。别被吃了。”
  2. ““格鲁卡会杀了你。”” → ork_311 eff{sanity:-5} ⇒ “当然！”瓦兹格布很高兴，“要么俺杀了他。都好！”

### ork_310 · ch3 · ork_fort · 格鲁卡大老大 · foe:gretchin · time{h:1}
“人仔有用？证明！”格鲁卡把一个地精仔推到你面前，“打赢它。” / 地精仔比你还害怕，举着一把小刀，刀在抖。 / 围观的兽人开始下注。
from: ork_305(fail) ⟵ “讲个笑话” | ork_305 ⟵ “跪下”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, luckyBlue, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, snagFriend, snitchedSnag, stoleTeef, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_305, ork_303, ork_301, ork_210, ork_208, ork_207
  1. “打” → ork_308 eff{hp:-10,renown:3,taint:{khorne:10}} ⇒ 你们在泥里扭成一团。你赢了，大概。地精仔跑了，你的耳朵少了一小块。
  2. “跟地精仔一起演一场” → ork_308 eff{renown:6,sanity:-5} ⇒ 你们打得很响，打得很假。兽人看得很开心，因为兽人不在乎真假，只在乎响不响。
  3. “拒绝” → ork_308 eff{hp:-20} ⇒ 格鲁卡不喜欢“不”。他用一根手指把你弹进了泥坑。“软！”

### ork_311 · ch3 · ork_fort · 老埃德娜 · time{d:3}
奴隶圈里还关着几十个人类，替兽人拣弹壳、喂史奎格。领头的是老埃德娜，从前在船坞教堂扫地。 / “孩子，在机械佬那儿吃得饱吗？”她塞给你一小块面包，“帝皇看着呢。”
from: ork_308 ⟵ ““我能帮什么？”” | ork_308 ⟵ ““格鲁卡会杀了你。””
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, luckyBlue, mekLoyal, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, snagFriend, snitchedSnag, stoleTeef, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_308, ork_305, ork_303, ork_301, ork_210, ork_208
  1. “收下面包，跟她念一段祷文” → ork_401 eff{sanity:10,taint:{all:-15}} ⇒ 你很久没念过祷文了。念到一半，你发现自己记得每一个字。
  2. “把面包还给她” → ork_401 eff{sanity:5,hp:-3} ⇒ “您更需要。”埃德娜看着你，眼睛湿了一下。“帝皇看见了。”
  3. ““帝皇在哪儿？”” → ork_401 eff{sanity:-5,taint:{tzeentch:20}} ⇒ 埃德娜没有回答。她继续拣弹壳，嘴唇一直在动。
  4. “一把抢走她手里的面包” → ork_401 eff{hp:8,set:{wronged_edna:true}} ⇒ 面包很硬。老埃德娜没喊，只把空了的手慢慢缩回袖子里。周围的奴隶都看着你，没人说话。

### ork_401 · ch4 · ruins · 旁白 · time{d:90}
三个月过去了。旧居住区的地下室长满了蘑菇，蘑菇底下又长出了别的东西。 / 你亲眼看见一个兽人从土里爬出来，抖掉泥巴，捡起钢管，就去找架打了。 / 它出生还不到一分钟。
on enter: {hp:15,sanity:5}  codex:ork_spores
from: ork_311 ⟵ “收下面包，跟她念一段祷文” | ork_311 ⟵ “把面包还给她” | ork_311 ⟵ ““帝皇在哪儿？”” | ork_311 ⟵ “一把抢走她手里的面包”
flags on arrival — MUST: ∅ · MAY-only: freebooterFriend, gotShoota, luckyBlue, mekLoyal, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, snagFriend, snitchedSnag, stoleTeef, wronged_edna, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_311, ork_308, ork_305, ork_303, ork_301, ork_210
  1. “走近看看” → ork_402 eff{sanity:-5,taint:{nurgle:25}} ⇒ 土里还埋着十几个，正在慢慢长。一个地精仔在给它们浇水，像在照料菜园。
  2. “赶紧走开” → ork_402 eff{sanity:-3} ⇒ 你走得很快。脚下的土软软的，好像有什么在翻身。
  3. “用喷灯烧掉这片” → ork_402 eff{hp:-5,renown:-3,set:{burnedSpores:true},taint:{nurgle:-10}} ⇒ 火烧了一整夜。兽人以为是庆典，围着火唱歌。只有瓦兹格布若有所思地看着你。

### ork_402 · ch4 · ork_scrapyard · 黑尔政委 · time{d:2}
你在废料里翻出一台还能用的通讯器，里面传来一个冷硬的声音。 / “我是黑尔政委。伊斯卡隆没有沦陷，只是暂时被占。” / “你在机械佬身边。我要你的眼睛，你的手，必要时，你的命。”
on enter:   codex:imp_commissar,imp_imperium
from: ork_401 ⟵ “走近看看” | ork_401 ⟵ “赶紧走开” | ork_401 ⟵ “用喷灯烧掉这片”
flags on arrival — MUST: ∅ · MAY-only: burnedSpores, freebooterFriend, gotShoota, luckyBlue, mekLoyal, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, snagFriend, snitchedSnag, stoleTeef, wronged_edna, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_401, ork_311, ork_308, ork_305, ork_303, ork_301
  1. ““我听您的，政委。”” → ork_403 eff{set:{resistance:true}} ⇒ “很好。”通讯器沉默了一会儿，“记住，帝皇在看着你。我也在。”
  2. “把通讯器交给瓦兹格布” → ork_406 eff{renown:8,set:{snitched:true},taint:{khorne:15}} ⇒ 瓦兹格布听完，眼睛亮了。“打架！更多打架！”他立刻去喊小子们。
  3. “关掉它，埋回废料堆” → ork_405 eff{sanity:-5} ⇒ 你把它埋进铁屑里。那天夜里你一直听见它在响，其实它没响。

### ork_403 · ch4 · manufactorum · 旁白 · time{d:3}
政委要你给大亮闪的动力管线动手脚：不必炸掉，只要它在要紧时候熄火。 / 你半夜溜到盔甲底下。斯纳吉特睡在它脚边，鼾声像漏气的轮胎。 / 钳子在你手里很沉。
from: ork_402 ⟵ ““我听您的，政委。””
flags on arrival — MUST: resistance · MAY-only: burnedSpores, freebooterFriend, gotShoota, luckyBlue, mekLoyal, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, snagFriend, snitchedSnag, stoleTeef, wronged_edna, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_402, ork_401, ork_311, ork_308, ork_305, ork_303
  1. “剪断一根，接成假线” ROLL p=0.5+sanity ✓ork_404 ✗ork_407 eff{set:{sabotaged:true}} ⇒✓ 你剪得很轻，接得很像。斯纳吉特翻了个身，接着打鼾。 ⇒✗ 钳子“咔”地响了一声。鼾声停了。
  2. “只画下动力舱的位置” → ork_404 eff{set:{mapped:true}} ⇒ 你把位置刻在一块铁皮背面。政委会满意的，大概。
  3. “改主意，回去睡觉” → ork_405 eff{sanity:-5,unset:[resistance]} ⇒ 你把钳子放回原处。第二天，通讯器再也没响过。

### ork_405 · ch4 · manufactorum · 机械佬瓦兹格布 · time{d:5}
瓦兹格布给了你一样东西：三个地精仔，归你管。 / “你是监工了。它们偷懒，你踢。它们偷东西，踢两下。” / 三个地精仔仰头看你。那眼神你很熟悉：几个月前，你就是这么看兽人的。
on enter: {renown:5}
from: ork_402 ⟵ “关掉它，埋回废料堆” | ork_403 ⟵ “改主意，回去睡觉” | ork_404 ⟵ ““中士，是我。”” | ork_404 ⟵ “交出你画的位置图” | ork_404 ⟵ “收好信号弹” | ork_406 ⟵ “别过脸去” | ork_406 ⟵ “跟着笑”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, burnedSpores, flare, forgiven_snaggit, freebooterFriend, gotShoota, luckyBlue, mapped, mekLoyal, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, resistance, sabotaged, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_402, ork_401, ork_311, ork_308, ork_305, ork_303
  1. “踢一脚立威” → ork_408 eff{renown:5,sanity:-5,taint:{khorne:10}} ⇒ 地精们立刻干活，干得很好。你的脚有点疼，心里也有点。
  2. “分给它们口粮” → ork_408 eff{hp:-5,sanity:5,set:{grotCrew:true}} ⇒ 地精们愣住了，然后把口粮藏起来，像藏一个秘密。从那以后，它们干活时总哼着歌。

### ork_406 · ch4 · ruins · 斯卡巴德头目 · time{h:6}
小子们在旧教堂的地窖里找到了抵抗军。仗打得很短：兽人比人多，也比人高兴。 / 斯卡巴德把一面帝国旗帜披在肩上当披风。 / “好人仔！”他拍你的背，“下回有架打，先告诉俺！”
on enter: {sanity:-10,renown:5,set:{betrayedResistance:true}}
from: ork_402 ⟵ “把通讯器交给瓦兹格布”
flags on arrival — MUST: snitched · MAY-only: burnedSpores, freebooterFriend, gotShoota, luckyBlue, mekLoyal, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, snagFriend, snitchedSnag, stoleTeef, wronged_edna, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_402, ork_401, ork_311, ork_308, ork_305, ork_303
  1. “别过脸去” → ork_405 eff{sanity:-3} ⇒ 你没看地窖里还剩什么。你只听见有个声音一直在念帝皇的名字，后来不念了。
  2. “跟着笑” → ork_405 eff{renown:5,corruption:5,taint:{khorne:10}} ⇒ 你笑出了声，小子们笑得更响。你不知道自己在笑什么。

### ork_404 · ch4 · ruins · 沃斯中士 · time{d:4}
抵抗军藏在旧教堂的地窖里，二十来个人，三支枪。沃斯中士少了一只眼，可还是那么站着。 / “舰队会来的，政委这么说。在那之前，得让绿皮一直往错的地方打。” / 他塞给你一枚信号弹。
on enter: {set:{flare:true}}
from: ork_403(success) ⟵ “剪断一根，接成假线” | ork_403 ⟵ “只画下动力舱的位置” | ork_407 ⟵ “给他牙” | ork_407 ⟵ “求他” | ork_407 ⟵ “威胁他”
flags on arrival — MUST: resistance · MAY-only: burnedSpores, forgiven_snaggit, freebooterFriend, gotShoota, luckyBlue, mapped, mekLoyal, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, sabotaged, snagFriend, snagGrudge, snitchedSnag, stoleTeef, wronged_edna, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_403, ork_402, ork_401, ork_311, ork_308, ork_305
  1. ““中士，是我。”” → ork_405 require{flag:origin_guard} eff{sanity:10,set:{vossTrust:true}} ⇒ 沃斯盯着你看了很久，然后抱住了你，抱得很重。“我以为整个排都没了。”
  2. “交出你画的位置图” → ork_405 require{flag:mapped} eff{set:{vossTrust:true}} ⇒ 沃斯把铁皮摊在棺材盖上，看了很久。“这值一百条命。”他说的是绿皮的命。
  3. “收好信号弹” → ork_405 eff{hp:-5} ⇒ “堡垒的门打开那天，打响它。”回去的路上，你差点被巡逻的小子撞见。

### ork_407 · ch4 · manufactorum · 地精仔斯纳吉特 · time{h:1}
斯纳吉特睁开一只眼。 / 他看看你手里的钳子，又看看被你剪断的线。 / “俺啥都没看见，”他慢慢地说，“不过俺的嘴，要三颗牙才能闭得更紧。”
from: ork_403(fail) ⟵ “剪断一根，接成假线”
flags on arrival — MUST: resistance, sabotaged · MAY-only: burnedSpores, freebooterFriend, gotShoota, luckyBlue, mekLoyal, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, snagFriend, snitchedSnag, stoleTeef, wronged_edna, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_403, ork_402, ork_401, ork_311, ork_308, ork_305
  1. “给他牙” → ork_404 require{stat:renown,min:5} eff{renown:-5,set:{forgiven_snaggit:true}} grudge(snaggit) ⇒ 斯纳吉特把牙一颗颗咬过，满意地翻了个身。“晚安，人仔。”
  2. “求他” → ork_404 require{flag:snagFriend} eff{sanity:5} ⇒ 斯纳吉特叹了口气：“你给过俺吃的。”他闭上眼，“俺打呼噜很响，听不见剪东西。”
  3. “威胁他” → ork_404 eff{hp:-10,set:{snagGrudge:true,wronged_snaggit:true}} ⇒ 你们扭在一起，他咬你，你掐他。最后他跑了，留下一句：“地精会记仇的！”

### ork_408 · ch4 · ork_scrapyard · 机械佬瓦兹格布 · time{d:10} · eventRoll 0.35
大亮闪缺一颗心脏：一台真正够劲的反应堆。 / 瓦兹格布听说，那艘坠毁的瓦尔达什一税船底舱里，还有一台没碎的。 / “人仔，你认得人仔的船，”他说，“你带路。”
on enter:   codex:place_valda_wreck
from: ork_405 ⟵ “踢一脚立威” | ork_405 ⟵ “分给它们口粮”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, burnedSpores, flare, forgiven_snaggit, freebooterFriend, gotShoota, grotCrew, luckyBlue, mapped, mekLoyal, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, resistance, sabotaged, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_405, ork_402, ork_401, ork_311, ork_308, ork_305
  1. “带路，走最稳的通道” → ork_409 eff{renown:5,hp:-5} ⇒ 拆了一整天。反应堆拖出来时还在发热，瓦兹格布抱着它，像抱一窝蛋。
  2. ““这船我卖过零件”” → ork_409 require{flag:origin_scrap} eff{renown:10} ⇒ 你记得这艘船的每一根肋骨。三个小时，反应堆出舱，没死一个小子。
  3. “故意带进辐射舱” → ork_409 require{flag:resistance} eff{hp:-15,set:{hotReactor:true}} ⇒ 大家都吃了一肚子辐射。兽人毫不在意，你很在意。反应堆的读数从此不太对。

### ork_409 · ch4 · manufactorum · 机械佬瓦兹格布 · time{d:4}
瓦兹格布把反应堆塞进大亮闪的胸口，接好线，退后三步，又退后三步。 / “人仔，按按钮。” / “为什么是我？” / “因为俺不想炸。”
from: ork_408 ⟵ “带路，走最稳的通道” | ork_408 ⟵ ““这船我卖过零件”” | ork_408 ⟵ “故意带进辐射舱”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, burnedSpores, flare, forgiven_snaggit, freebooterFriend, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, resistance, sabotaged, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_408, ork_405, ork_402, ork_401, ork_311, ork_308
  1. “按下按钮” → ork_501 eff{hp:-10,renown:5} ⇒ 反应堆轰地活了。你被震飞三米，眉毛没了。瓦兹格布抱着盔甲跳舞。
  2. “让斯纳吉特去按” → ork_501 eff{renown:3,sanity:-5,set:{wronged_snaggit:true}} ⇒ 斯纳吉特按了，飞了，落地，爬起来骂了一整天。反应堆运转良好。
  3. “按之前悄悄调低读数” → ork_501 require{flag:hotReactor} eff{hp:-5,set:{shinyDead:true}} ⇒ 反应堆活了，嗡嗡声低了半个调。只有你听得出来。

### ork_501 · ch5 · ork_fort · 怪小子佐格拉克 · time{d:7}
怪小子佐格拉克被两个兽人用铜杆牵着走进堡垒。他的脑袋冒着绿烟，眼睛里有闪电。 / 周围越吵，他越难受；打得越凶，他头顶越亮。 / “太……吵……了，”他呻吟，“全是……Waaagh！”
on enter:   codex:ork_weirdboyz,xenos_waaagh
from: ork_409 ⟵ “按下按钮” | ork_409 ⟵ “让斯纳吉特去按” | ork_409 ⟵ “按之前悄悄调低读数”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, burnedSpores, flare, forgiven_snaggit, freebooterFriend, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob
certainly visited before (nearest 6): ork_409, ork_408, ork_405, ork_402, ork_401, ork_311
  1. “递给他一块湿布” → ork_502 eff{sanity:-5,set:{zogFriend:true},taint:{tzeentch:20}} ⇒ 他把布盖在头上，布“嘶”地一声干了。“好人仔，”他喃喃，“安静的人仔。”
  2. “离他远点” → ork_502 eff{sanity:5} ⇒ 牵铜杆的兽人告诉你：上一个离他太近的，脑袋现在挂在大门上。
  3. “问他看见了什么” → ork_502 eff{sanity:-5,taint:{tzeentch:30}} ⇒ 他转过头，眼里的闪电映出你看不懂的东西。“俺看见……两个大的。”

### ork_502 · ch5 · ork_fort · 云里的两个大家伙 · time{h:1}
佐格拉克抓住你的手腕。一瞬间，你看见云里站着两个巨大的绿色影子，没有脸，只有拳头和笑声。 / 一个很凶，但很狡猾。一个很狡猾，但很凶。 / 兽人的神只想要一样东西：好仗。
on enter: {sanity:-5}  codex:ork_gork_mork
from: ork_501 ⟵ “递给他一块湿布” | ork_501 ⟵ “离他远点” | ork_501 ⟵ “问他看见了什么”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, burnedSpores, flare, forgiven_snaggit, freebooterFriend, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_501, ork_409, ork_408, ork_405, ork_402, ork_401
  1. ““哪个是戈克，哪个是莫克？”” → ork_503 eff{renown:3} ⇒ 佐格拉克认真想了很久：“看你问谁。问错了会挨揍。”
  2. “闭上眼” → ork_503 eff{sanity:5} ⇒ 闭眼也没用，影子还在。但它们没注意你。对神来说，你太小，打不了架。

### ork_503 · ch5 · ork_fort · 怪小子佐格拉克 · time{d:1} · eventRoll 0.35
佐格拉克说起了“先知”：一个脑袋被打穿的大兽人，医生佬给他换了块铁的，从此戈克和莫克就在他脑子里说话。 / “先知要来了，”怪小子眼睛冒光，“他的大Waaagh!要来了。”
on enter:   codex:ork_ghazghkull,ork_great_waaagh
from: ork_502 ⟵ ““哪个是戈克，哪个是莫克？”” | ork_502 ⟵ “闭上眼”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, burnedSpores, flare, forgiven_snaggit, freebooterFriend, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_502, ork_501, ork_409, ork_408, ork_405, ork_402
  1. ““先知叫什么？”” → ork_504 eff{sanity:-5} ⇒ “加兹库尔！”周围的兽人一起吼出这个名字，房顶的灰都震了下来。
  2. “把这些刻在铁皮上” → ork_504 eff{renown:3,taint:{tzeentch:20}} ⇒ 刻完你才发现，周围的铁皮上早就刻满了同一个名字，写法五花八门。
  3. “问先知去过哪里” → ork_504 eff{sanity:-5} ⇒ “阿玛吉顿！打了两回！打得可爽了！”佐格拉克笑着说，“下一个，这儿。”

### ork_504 · ch5 · ork_fort · 旁白 · foe:ork_weirdboy · time{d:3}
小子们打了一整夜架。佐格拉克的脑袋亮得像一颗绿太阳。 / 牵铜杆的兽人跑了。他在膨胀，在尖叫，在往外漏闪电。 / 你离他只有十步。
from: ork_503 ⟵ ““先知叫什么？”” | ork_503 ⟵ “把这些刻在铁皮上” | ork_503 ⟵ “问先知去过哪里”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, burnedSpores, flare, forgiven_snaggit, freebooterFriend, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_503, ork_502, ork_501, ork_409, ork_408, ork_405
  1. “趴下” ROLL p=0.5+hp ✓ork_506 ✗ork_505 ⇒✓ 闪电从你头顶扫过，烧焦了一排兽人的头发。它们觉得很好玩。 ⇒✗ 你趴得不够低。
  2. “把铜杆插进他脚边的地里” → ork_506 eff{renown:8,hp:-10} ⇒ 铜杆引走了一半闪电。另一半从你头顶飞过，把一个吵闹的兽人变成了一缕安静的烟。
  3. “转身跑” → ork_505 eff{sanity:-5} ⇒ 你跑得不够快。没人跑得够快。

### ork_505 · ch5 · ork_fort · 旁白 · time{h:2}
绿光吞没了一切。恍惚间，你看见一片极古老的战场：绿皮的祖先在替早已消失的造物主打一场天上的仗。 / 你醒来时头发全竖着，嘴里有铁锈味。 / 佐格拉克躺在冒烟的坑里打鼾，很舒服的样子。
on enter: {hp:-15,sanity:-5,taint:{tzeentch:20}}  codex:ork_krork
from: ork_504(fail) ⟵ “趴下” | ork_504 ⟵ “转身跑”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, burnedSpores, flare, forgiven_snaggit, freebooterFriend, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_504, ork_503, ork_502, ork_501, ork_409, ork_408
  1. “爬起来” → ork_506

### ork_506 · ch5 · ork_scrapyard · 机械佬瓦兹格布 · time{d:6}
瓦兹格布有了个点子：“人仔能不能也让东西变快？” / 他递给你一桶红漆、一辆破摩托。“刷。然后信。使劲信。” / 小子们围过来看热闹。
from: ork_504(success) ⟵ “趴下” | ork_504 ⟵ “把铜杆插进他脚边的地里” | ork_505 ⟵ “爬起来”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, burnedSpores, flare, forgiven_snaggit, freebooterFriend, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_504, ork_503, ork_502, ork_501, ork_409, ork_408
  1. “刷，然后真心相信” → ork_507 eff{sanity:-15,renown:8,taint:{tzeentch:25}} ⇒ 你信了，真的信了。摩托快了一点点，也许是因为旁边五十个兽人也在信。你不敢细想。
  2. “刷，但心里不信” → ork_507 eff{renown:-3} ⇒ 摩托跑得和灰的一样慢。瓦兹格布失望地拍拍你的头：“人仔不行。脑子太小。”
  3. “刷成蓝色” → ork_507 require{flag:luckyBlue} eff{renown:6,hp:5} ⇒ 摩托没变快，可它翻车时你毫发无伤。几个死头骷部落的小子鼓起了掌。

### ork_507 · ch5 · ork_fort · 怪小子佐格拉克 · time{d:2}
佐格拉克醒过来后，一直盯着你看。 / “人仔，”他突然问，“戈克还是莫克？” / 周围的兽人全安静了。看来这个问题很要紧。
from: ork_506 ⟵ “刷，然后真心相信” | ork_506 ⟵ “刷，但心里不信” | ork_506 ⟵ “刷成蓝色”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, burnedSpores, flare, forgiven_snaggit, freebooterFriend, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_506, ork_504, ork_503, ork_502, ork_501, ork_409
  1. ““戈克！”” → ork_601 eff{hp:-5,set:{gork:true},taint:{khorne:15}} ⇒ 一半兽人欢呼，另一半揍了你一拳。佐格拉克满意地点头：“对。也不对。”
  2. ““莫克！”” → ork_601 eff{hp:-5,set:{mork:true}} ⇒ 另一半兽人欢呼，这一半揍了你一拳。佐格拉克满意地点头：“对。也不对。”
  3. ““两个都是。”” → ork_601 eff{renown:5} ⇒ 兽人们愣住了，然后一齐大笑。佐格拉克说：“这人仔，脑子里有点绿。”

### ork_601 · ch6 · burning_city · 旁白 · foe:heretic_astartes · time{d:30}
一个月后，天上裂开一道血红的口子。一艘缠满尖刺的战舰撞进了伊斯卡隆的大气层。 / 下来的是穿红甲的巨人，盔甲上挂满头骨。他们是来收更多头骨的。 / 兽人们看着他们，眼睛全亮了：“好架！”
on enter: {hp:10}  codex:chaos_heretic_astartes,chaos_gods
from: ork_507 ⟵ ““戈克！”” | ork_507 ⟵ ““莫克！”” | ork_507 ⟵ ““两个都是。””
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, burnedSpores, flare, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_507, ork_506, ork_504, ork_503, ork_502, ork_501
  1. “跟着兽人冲过去” → ork_602 eff{hp:-10,taint:{khorne:10}} ⇒ 你不知道自己为什么也在跑。周围全是吼声，你的吼声也在里面。
  2. “留在作坊帮机械佬” → ork_603 eff{renown:3} ⇒ 瓦兹格布在给小子们的枪加火力。“更多突突！给他们更多突突！”
  3. “躲进地下室” → ork_603 eff{sanity:-5} ⇒ 地下室里挤满了地精仔。它们给你让了个位置，然后一起发抖。

### ork_602 · ch6 · burning_city · 旁白 · foe:heretic_astartes · time{h:3}
红甲狂战士和兽人撞在一起，双方都在笑。 / 你看懂了一件可怕的事：血神不在乎血是谁的。兽人在打，狂战士在打，他都高兴。 / 一把斧头转向了你。
on enter:   codex:god_khorne,ork_good_fight
from: ork_601 ⟵ “跟着兽人冲过去”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, burnedSpores, flare, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_601, ork_507, ork_506, ork_504, ork_503, ork_502
  1. “滚进弹坑” ROLL p=0.5+hp ✓ork_603 ✗ork_605 ⇒✓ 斧头砍进了你刚才站的地方。弹坑里很挤，有个地精仔，还有一只很生气的史奎格。 ⇒✗ 你没滚够远。
  2. “躲到一个头目身后” → ork_603 eff{hp:-10,renown:3} ⇒ 头目替你挡了一斧，高兴地回了一拳。他根本没注意身后有你。
  3. “捡起一把链锯斧” → ork_603 eff{hp:-15,corruption:10,taint:{khorne:15}} ⇒ 斧头比你重，可挥起来很顺手，太顺手了。打完以后，你很久没能松开手指。

### ork_603 · ch6 · ork_scrapyard · 披红布的人 · time{h:6}
一个披着红布的人类在废料堆里找到了你。他也是奴隶，曾经是。 / “兽人把我们当工具。血神不一样，他只要你拿起刀。谁的血都行，兽人的也行。” / 他递过来一把刻着记号的匕首。
from: ork_601 ⟵ “留在作坊帮机械佬” | ork_601 ⟵ “躲进地下室” | ork_602(success) ⟵ “滚进弹坑” | ork_602 ⟵ “躲到一个头目身后” | ork_602 ⟵ “捡起一把链锯斧” | ork_605 ⟵ ““别！”” | ork_605 ⟵ ““……用吧。”” | ork_605 ⟵ ““再多换点。””
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, burnedSpores, flare, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_601, ork_507, ork_506, ork_504, ork_503, ork_502
  1. “接过匕首” → ork_604 eff{corruption:10,renown:3,set:{bloodDagger:true},taint:{khorne:20}} ⇒ 匕首是温的。你把它藏进靴子。那夜你梦见一个铜色的王座，底下堆满了东西。
  2. “把他交给兽人” → ork_604 eff{renown:6,sanity:-5} ⇒ 小子们很高兴：又一个能打的！他们把他扔进了打架坑。他打得很好，打了很久。
  3. “拒绝，走开” → ork_604 eff{sanity:-5} ⇒ 他在身后说：“你会回来的。每个人都会。”你没回头。

### ork_604 · ch6 · burning_city · 斯卡巴德头目 · time{d:2}
仗打完了。红甲巨人的船被小子们拆光，零件已经摆上了三个机械佬的摊子。 / 斯卡巴德扛着一个狂战士的头盔，当酒杯用。 / “那帮红的，打得好！”他意犹未尽，“希望他们再来！”
from: ork_603 ⟵ “接过匕首” | ork_603 ⟵ “把他交给兽人” | ork_603 ⟵ “拒绝，走开”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, bloodDagger, burnedSpores, flare, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_603, ork_601, ork_507, ork_506, ork_504, ork_503
  1. “在战场上捡件战利品” → ork_606 eff{renown:5,set:{chaosRelic:true},taint:{khorne:10}} ⇒ 一个刻着记号的护符，在你手里嗡嗡作响，像一颗不属于你的心跳。
  2. “帮地精仔收拾尸体” → ork_606 eff{sanity:-5,hp:5} ⇒ 地精们把死兽人拖进蘑菇地。“明年，”一个地精说，“这儿会长出好多小子。”
  3. “回作坊” → ork_606

### ork_605 · ch6 · ruins · 巴兹戈布医生佬 · time{h:5}
一斧头。你只记得这么多。 / 醒来时，巴兹戈布医生佬正在你身上忙活，嘴里哼着歌。 / “好消息：人仔还活着。坏消息：零件不够。不过俺有兽人的！”
on enter: {hp:-15}  codex:ork_painboyz
from: ork_602(fail) ⟵ “滚进弹坑”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, burnedSpores, flare, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_602, ork_601, ork_507, ork_506, ork_504, ork_503
  1. ““别！”” → ork_603 eff{hp:-5} ⇒ 医生佬叹了口气，只用了线和订书钉。你活了，难看地活了。
  2. ““……用吧。”” → ork_603 eff{hp:25,sanity:-5,set:{orkBitz:true},taint:{nurgle:20}} ⇒ 醒来时，你身体里多了些绿色的东西。它们不疼，很有劲，偶尔会自己想打架。
  3. ““再多换点。”” → ork_603 require{flag:orkBitz} eff{hp:35,sanity:-15,set:{moreBitz:true},taint:{nurgle:20}} ⇒ 医生佬欢呼起来。这回他换得更多。你照镜子时，已经不太确定镜子里是谁。

### ork_606 · ch6 · manufactorum · 机械佬瓦兹格布 · time{d:10} · eventRoll 0.3
瓦兹格布把红甲战舰的零件全用上了。大亮闪现在浑身尖刺，能喷火，胸口装着瓦尔达的反应堆。 / “就差一样，”他说，“一个好名字。” / 他看着你，等你开口。
from: ork_604 ⟵ “在战场上捡件战利品” | ork_604 ⟵ “帮地精仔收拾尸体” | ork_604 ⟵ “回作坊”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_604, ork_603, ork_601, ork_507, ork_506, ork_504
  1. ““大亮闪·终极版”” → ork_607 eff{renown:3} ⇒ 瓦兹格布念了三遍，不满意。“太短。”他自己又加了四个词。
  2. ““格鲁卡的末日”” → ork_607 eff{renown:6,taint:{khorne:15}} ⇒ 他用红漆把这几个字刷在胸甲上，写反了。斯卡巴德说正好，格鲁卡看得懂。
  3. “把嗡嗡响的护符装上去” → ork_607 require{flag:chaosRelic} eff{renown:5,set:{relicArmour:true},taint:{khorne:-25}} ⇒ 护符一离手，你的心跳就静了下来。盔甲却开始嗡嗡响。瓦兹格布很喜欢这个声音。

### ork_607 · ch6 · ork_scrapyard · 地精仔斯纳吉特 · time{d:3}
斯纳吉特在开会。几十个地精仔挤在油桶后面，商量怎么推翻兽人。 / “俺们人多！”斯纳吉特说，“人仔也来，人仔聪明。” / 就在这时，一个兽人打着哈欠走了过来。
(grudgeLine snaggit: 斯纳吉特死盯着你，手里攥着一颗牙，像在数你欠的账。)
on enter:   codex:ork_gretchin
from: ork_606 ⟵ ““大亮闪·终极版”” | ork_606 ⟵ ““格鲁卡的末日”” | ork_606 ⟵ “把嗡嗡响的护符装上去”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_606, ork_604, ork_603, ork_601, ork_507, ork_506
  1. “给它们出个主意” → ork_608 eff{renown:3,set:{snagFriend:true}} grudge(snaggit) ⇒ 你的计划很周密。兽人走过来时，所有地精假装在擦靴子，包括擦你的靴子。
  2. “一起假装擦靴子” → ork_608 eff{sanity:5} ⇒ 兽人看了看一圈擦靴子的地精和一个人仔，挠挠头，走了。会议改天再开。
  3. “教它们锈牙帮的规矩” → ork_608 require{flag:origin_ganger} eff{renown:6,set:{grotCrew:true}} ⇒ 放哨、分赃、跑路。斯纳吉特说，这是他这辈子听过最美的东西。

### ork_608 · ch6 · ork_fort · 老埃德娜 · time{d:4}
红甲巨人来过以后，奴隶圈少了一半人。老埃德娜病了，咳得直不起腰，还在拣弹壳。 / “孩子，”她说，“我要是走了，替我把这本祷文书给下一个人。” / 书很薄，边角全被翻烂了。
from: ork_607 ⟵ “给它们出个主意” | ork_607 ⟵ “一起假装擦靴子” | ork_607 ⟵ “教它们锈牙帮的规矩”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_607, ork_606, ork_604, ork_603, ork_601, ork_507
  1. “把你的口粮给她” → ork_701 eff{hp:-10,sanity:5,taint:{all:-10},set:{forgiven_edna:true}} grudge(edna) ⇒ 她吃得很慢，很仔细。那天夜里她没再咳。你饿着肚子，睡得很好。
  2. “求医生佬看看她” → ork_701 require{stat:renown,min:20} eff{renown:-8,hp:-5} ⇒ 医生佬收了牙，往她嘴里灌了一勺绿东西。她第二天能站起来了，只是总想打架。
  3. “收下书，说不出话” → ork_701 eff{sanity:-5} grudge(edna) ⇒ 你把书揣进怀里。第三天，奴隶圈的角落空了。

### ork_701 · ch7 · ork_scrapyard · 旁白 · foe:astartes · time{d:40} · eventRoll 0.35
第四十天，天上落下了燃烧的钢铁种子。 / 空降舱一个接一个砸进堡垒外的荒地。舱门炸开，走出来的人比兽人还高，盔甲蓝得发亮。 / 星际战士来了。兽人欢呼得比谁都响。
on enter: {hp:10}  codex:imp_astartes,ork_good_fight
from: ork_608 ⟵ “把你的口粮给她” | ork_608 ⟵ “求医生佬看看她” | ork_608 ⟵ “收下书，说不出话”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_608, ork_607, ork_606, ork_604, ork_603, ork_601
  1. “拿上信号弹，去找政委” → ork_702 require{flag:resistance} eff{sanity:-5} ⇒ 你穿过混乱的营地。没有兽人拦你，它们都忙着往前冲。
  2. “跟着瓦兹格布守作坊” → ork_707 eff{renown:3,hp:-15} ⇒ 瓦兹格布往每把枪里多塞了一倍火药。“最好的一天！”一把枪在你旁边炸了膛。
  3. “趁乱逃向城外的山” ROLL p=0.45+hp ✓ork_708 ✗ork_704 ⇒✓ 你钻过铁丝网，跑过弹坑，一直跑到听不见吼声的地方。 ⇒✗ 你跑出两百米，一只大手揪住了你的后领。

### ork_702 · ch7 · ork_fort · 黑尔政委 · time{h:2}
通讯器里，黑尔政委的声音压过了炮火。 / “星际战士要攻堡垒，门是铁的，太厚。从里面打开它，士兵。从里面。” / 大门的绞盘就在你面前，四个兽人守着它。
from: ork_701 ⟵ “拿上信号弹，去找政委”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_701, ork_608, ork_607, ork_606, ork_604, ork_603
  1. “喊“那边打得更凶！”引开守卫” ROLL p=0.55+renown ✓ork_705 ✗ork_706 ⇒✓ 四个兽人同时转头，同时跑了。兽人永远相信别处的架更好。 ⇒✗ 三个跑了，一个留下来，因为他认得你，也认得你手里的信号弹。
  2. “让你的地精仔去转绞盘” → ork_705 require{flag:grotCrew} eff{renown:3} ⇒ 地精们哼着歌爬上绞盘，守卫以为是机械佬的命令。门开了，地精跑得比谁都快。
  3. “自己冲上去转” → ork_705 eff{hp:-30,taint:{khorne:10}} ⇒ 你被揍得很惨，可绞盘转动了。门开了一道缝，然后是一道光。

### ork_704 · ch7 · ork_scrapyard · 斯卡巴德头目 · time{h:1}
斯卡巴德揪着你的后领，把你提到眼前。 / “跑？今天？”他大惑不解，“今天是最好的一天！人仔不懂。” / 他把你扔回作坊，顺手塞给你一把枪：“去打！打完再跑！”
on enter: {hp:-15}
from: ork_701(fail) ⟵ “趁乱逃向城外的山”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_701, ork_608, ork_607, ork_606, ork_604, ork_603
  1. “握紧那把枪” → ork_707

### ork_707 · ch7 · ork_fort · 机械佬瓦兹格布 · time{d:20}
星际战士打下了半个堡垒，又被兽人抢了回来。然后再打下，再抢回。 / 二十天后，他们撤到城外山上，等更多的人来。兽人也在等更多的兽人来。 / 瓦兹格布满意地说：“这仗能打一百年。”
from: ork_701 ⟵ “跟着瓦兹格布守作坊” | ork_704 ⟵ “握紧那把枪” | ork_706(success) ⟵ “趁炮击扑进壕沟”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_701, ork_608, ork_607, ork_606, ork_604, ork_603
  1. ““一百年太长了。”” → ork_709 eff{sanity:-5} ⇒ “对，”瓦兹格布同意，“太短了。”
  2. “帮他修被打坏的大亮闪” → ork_709 eff{renown:5,hp:-5} ⇒ 你们修了二十天，敲坏了三把锤子。盔甲比以前更响了。

### ork_708 · ch7 · trench · 疤脸老兵 · time{d:3}
城外山上，星际战士的营地静得吓人。一位老兵摘下头盔，脸上的疤比你的年纪还长。 / “兽人要选新老大，选的时候会聚在一起。回去，做我们的眼睛。” / “然后我们来接你。如果你还活着。”
on enter: {set:{beacon:true}}
from: ork_701(success) ⟵ “趁乱逃向城外的山” | ork_705 ⟵ ““政委派我来的。”” | ork_705 ⟵ “指出大老大的位置” | ork_706 ⟵ ““我一直在帮你们！””
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_701, ork_608, ork_607, ork_606, ork_604, ork_603
  1. ““我会回去。”” → ork_709 eff{renown:5} ⇒ 他递给你一枚小小的信标。它很轻，可你觉得自己揣着一整个战团。
  2. ““求你们现在就带我走。”” → ork_709 eff{sanity:-10} ⇒ “帝国不需要又一个难民，”他说，“需要一双眼睛。”他把信标塞进你手里。

### ork_705 · ch7 · ork_fort · 疤脸老兵 · time{h:1}
大门开了。蓝甲巨人涌进堡垒，像潮水冲进沙堡。 / 其中一个停在你面前，头盔的目镜冷冷发光。 / “你是谁？”他的声音很平静，“你身上有异形的气味。”
from: ork_702(success) ⟵ “喊“那边打得更凶！”引开守卫” | ork_702 ⟵ “让你的地精仔去转绞盘” | ork_702 ⟵ “自己冲上去转”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_702, ork_701, ork_608, ork_607, ork_606, ork_604
  1. ““政委派我来的。”” → ork_708 eff{renown:3} ⇒ 他点了一下头，算是信了。然后走向枪声最密的地方，像去赴约。
  2. “指出大老大的位置” → ork_708 eff{renown:5,set:{toldWarboss:true}} ⇒ “东边最大的棚子。”他已经走了。身后，兽人和星际战士撞在一起，像两座山。
  3. “把绿手指藏到背后” → ork_706 require{flag:orkBitz} eff{sanity:-5} ⇒ 可他已经看见了。目镜一闪，枪口抬了起来。

### ork_706 · ch7 · trench · 黑尔政委 · time{d:1}
你被押到黑尔政委面前。他的大衣沾满泥，眼神比泥还冷。 / “你替绿皮修了几个月机器，”他说，“那些机器杀了我们的人。” / 他的手搭在枪套上。
from: ork_702(fail) ⟵ “喊“那边打得更凶！”引开守卫” | ork_705 ⟵ “把绿手指藏到背后”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_702, ork_701, ork_608, ork_607, ork_606, ork_604
  1. ““我一直在帮你们！”” → ork_708 require{flag:vossTrust} eff{sanity:5} ⇒ 沃斯中士从人群里走出来，站到你身边。政委看了他很久，把手从枪套上拿开了。
  2. ““我只是想活下去。”” → ork_end_collaborator eff{sanity:-10} ⇒ “我知道，”政委说，“每个人都这么说。”
  3. “趁炮击扑进壕沟” ROLL p=0.4+hp ✓ork_707 ✗ork_end_collaborator ⇒✓ 一发炮弹落在附近，所有人都趴下了。你爬起来时，已经在兽人这边了。 ⇒✗ 你扑得不够远。两个卫兵按住了你。

### ork_709 · ch7 · ork_scrapyard · 红戈布船长 · time{d:5}
一艘涂得乱七八糟的海盗船降在废料场。红戈布船长跳下来，帽子上的羽毛又多了几根。 / “先知的大Waaagh!要来了，这儿要挤爆了。俺不喜欢挤，俺要走。” / 他打量你：“人仔，有多少牙？”
on enter:   codex:ork_freebooterz
from: ork_707 ⟵ ““一百年太长了。”” | ork_707 ⟵ “帮他修被打坏的大亮闪” | ork_708 ⟵ ““我会回去。”” | ork_708 ⟵ ““求你们现在就带我走。””
flags on arrival — MUST: ∅ · MAY-only: beacon, betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_701, ork_608, ork_607, ork_606, ork_604, ork_603
  1. “掏出所有的牙” → ork_711 require{stat:renown,min:55} eff{renown:-10,set:{berth:true}} ⇒ 红戈布数了数，咬了几颗。“够了。大Waaagh!那天起飞，迟到不等。”
  2. ““你说过回来买我。”” → ork_711 require{flag:freebooterFriend} eff{set:{berth:true}} ⇒ 红戈布大笑：“俺说过？”他想了想，“俺说过。好吧，自由海盗偶尔也算话。”
  3. ““我还有事要做。”” → ork_711 eff{renown:3} ⇒ “人仔有事！”船长觉得这话好笑极了，一路笑着走开了。

### ork_711 · ch7 · manufactorum · 格鲁卡大老大 · time{d:3}
格鲁卡大老大亲自来到作坊，绕着大亮闪走了一圈，敲了敲胸甲。 / “盔甲好，”他说，“穿它的不好。” / 他一拳把工作台砸成两半，然后看着你：“人仔。你的机械佬，想当大机械佬？”
on enter:   codex:ork_mega_armour
from: ork_709 ⟵ “掏出所有的牙” | ork_709 ⟵ ““你说过回来买我。”” | ork_709 ⟵ ““我还有事要做。””
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_709, ork_701, ork_608, ork_607, ork_606, ork_604
  1. ““他只想造好东西，大老大。”” → ork_710 eff{renown:3} ⇒ 格鲁卡哼了一声。“好东西，”他重复，“俺喜欢好东西。”他走了，带走了半张工作台。
  2. ““您最大，大老大。”” → ork_710 eff{renown:5,sanity:-5} ⇒ “对。”格鲁卡很满意，拍了拍你的头。你的脖子响了一声。
  3. “一言不发” → ork_710 eff{hp:-10} ⇒ 格鲁卡不喜欢沉默。他把你拎起来闻了闻，又扔下了。“软。”

### ork_end_collaborator · ch7 · trench · 黑尔政委 · time{d:1} · **ENDING bad**
军事法庭只开了四分钟。罪名：通敌。证据：你还活着。 / 黑尔政委亲自执行。枪声被兽人的吼声盖住了，没人听见。 / 档案上写着：伊斯卡隆，平民一名，已处理。
ending: 「通敌者」 cause: 以通敌罪被政委处决
from: ork_706 ⟵ ““我只是想活下去。”” | ork_706(fail) ⟵ “趁炮击扑进壕沟”
flags on arrival — MUST: ∅ · MAY-only: betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_706, ork_702, ork_701, ork_608, ork_607, ork_606

### ork_710 · ch7 · ork_fort · 怪小子佐格拉克 · time{d:14}
先知的舰队越来越近，伊斯卡隆的兽人越来越吵。打架坑一天开二十场，锤子声整夜不停。 / 佐格拉克的脑袋又在冒烟。 / “都感觉到了，”他说，“人仔也是。听，你的心在跟着吼。”
from: ork_711 ⟵ ““他只想造好东西，大老大。”” | ork_711 ⟵ ““您最大，大老大。”” | ork_711 ⟵ “一言不发”
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_711, ork_709, ork_701, ork_608, ork_607, ork_606
  1. “承认你听见了” → ork_801 eff{sanity:-5,taint:{khorne:10}} ⇒ 咚，咚，咚。你分不清那是兽人的Waaagh!，还是别的什么在借它的声音。
  2. “堵住耳朵” → ork_801 eff{sanity:5} ⇒ 没用。可佐格拉克说，试过的人仔比较不容易炸。

### ork_801 · ch8 · ork_scrapyard · 绿色风暴 · time{d:7}
第七天，天空彻底绿了。绿色雷暴从地平线压过来，雷声里全是吼叫。 / 轨道上，一支比月亮还大的舰队正在降落。每个兽人都仰着头，每个兽人都知道那是谁。 / 先知来了。伊斯卡隆得出一个老大去见他。
on enter: {sanity:-10}  codex:ork_great_waaagh,ork_ghazghkull
from: ork_710 ⟵ “承认你听见了” | ork_710 ⟵ “堵住耳朵”
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_710, ork_711, ork_709, ork_701, ork_608, ork_607
  1. “去打架坑” → ork_802

### ork_802 · ch8 · ork_fort · 机械佬瓦兹格布 · time{h:6} · eventRoll 0.3
斯卡巴德要在打架坑挑战格鲁卡，当着全星球的兽人。 / 大亮闪立在坑边，冒着烟，嗡嗡作响。瓦兹格布把最后一把扳手塞给你。 / “人仔，最后一下，你来。”
on enter:   codex:place_fight_pit
from: ork_801 ⟵ “去打架坑”
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_801, ork_710, ork_711, ork_709, ork_701, ork_608
  1. “刷上红漆：红的打得快！” → ork_803 eff{renown:5,set:{shinyRed:true}} ⇒ 全场兽人都看见了，全场兽人都信了。你觉得盔甲在你手底下变快了。
  2. “按帝国标准拧紧每颗螺栓” → ork_803 eff{renown:3,taint:{tzeentch:20}} ⇒ 你拧得整整齐齐。瓦兹格布皱眉看了半天：“太整齐了。俺不信。”
  3. “剪断那根假线” → ork_803 require{flag:sabotaged} eff{set:{shinyDead:true}} ⇒ 你剪得很轻，没人看见。盔甲的嗡嗡声低了半个调。
  4. “把匕首焊在它拳头上” → ork_803 require{flag:bloodDagger} eff{corruption:10,set:{shinyRed:true},taint:{khorne:15}} ⇒ 匕首一碰铁就烧得通红。盔甲里传出一声鼓响，你听过这个声音。

### ork_803 · ch8 · ork_fort · 旁白 · foe:ork_boss · time{h:1}
格鲁卡跳进坑里，大地一震。斯卡巴德穿着大亮闪迎上去，每一步都喷着火。 / 两个巨人撞在一起，像两艘船对撞。全场在吼，吼声和天上的雷连成一片。 / 大亮闪的胸口开始冒黑烟。
from: ork_802 ⟵ “刷上红漆：红的打得快！” | ork_802 ⟵ “按帝国标准拧紧每颗螺栓” | ork_802 ⟵ “剪断那根假线” | ork_802 ⟵ “把匕首焊在它拳头上”
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_802, ork_801, ork_710, ork_711, ork_709, ork_701
  1. “跳下去拍一巴掌反应堆” ROLL p=0.5+hp ✓ork_804 ✗ork_805 ⇒✓ 你一巴掌拍下去。反应堆咳了一声，活了。兽人的机器，就吃这一套。 ⇒✗ 反应堆把你烫了回来。黑烟更浓了。
  2. “带头大吼“Waaagh！”” ROLL p=0.5+renown ✓ork_804 ✗ork_805 ⇒✓ 全场跟着你吼。盔甲又亮了。兽人的信念，有时候需要一个人仔起头。 ⇒✗ 你的嗓子太小了，没人听见。
  3. ““红的！打得快！”” → ork_804 require{flag:shinyRed} eff{renown:5} ⇒ 几千个兽人同时想起盔甲是红的。大亮闪的拳头快得看不见。
  4. “看着它熄火” → ork_805 require{flag:shinyDead} eff{sanity:-5} ⇒ 嗡嗡声停了。就在那一刻，正是政委要的那一刻。

### ork_804 · ch8 · ork_fort · 斯卡巴德头目 · time{h:1}
格鲁卡倒下了，没再起来。斯卡巴德从大亮闪里爬出来，踩在他身上大吼。 / 全星球的兽人跟着他吼。他现在是大老大了，因为他现在最大。 / 他转向瓦兹格布和你：“好盔甲！好人仔！”
on enter: {renown:10,set:{shinyWon:true}}
from: ork_803(success) ⟵ “跳下去拍一巴掌反应堆” | ork_803(success) ⟵ “带头大吼“Waaagh！”” | ork_803 ⟵ ““红的！打得快！””
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_803, ork_802, ork_801, ork_710, ork_711, ork_709
  1. “跟着吼” → ork_811 eff{sanity:-5} ⇒ 你吼得嗓子都破了。这是你这辈子最响的一声。
  2. “悄悄退到人群后面” → ork_811

### ork_805 · ch8 · ork_fort · 格鲁卡大老大 · time{h:1}
大亮闪跪下了，胸口冒火。格鲁卡把斯卡巴德从盔甲里拽出来，扔出了坑外。 / 然后他转过头，看着坑边的瓦兹格布。看着你。 / “这堆破烂，谁造的？”
on enter: {hp:-15}
from: ork_803(fail) ⟵ “跳下去拍一巴掌反应堆” | ork_803(fail) ⟵ “带头大吼“Waaagh！”” | ork_803 ⟵ “看着它熄火”
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_803, ork_802, ork_801, ork_710, ork_711, ork_709
  1. “指着瓦兹格布” → ork_809 eff{renown:-10,sanity:-10,set:{blamedMek:true,wronged_wazgob:true}} ⇒ 瓦兹格布看了你一眼，没生气，好像早就知道。格鲁卡把他拎了起来。
  2. ““我造的！”跳进坑里” → ork_810 eff{taint:{khorne:15}} ⇒ 全场静了一秒，然后爆发出比雷还响的笑声：一个人仔，要跟大老大打。
  3. “趁乱溜走” ROLL p=0.5+hp ✓ork_811 ✗ork_809 ⇒✓ 你钻过几百条腿，溜出了堡垒。没人注意一个人仔，大家都在看坑里。 ⇒✗ 一个地精仔指着你尖叫。你被抬了回去。

### ork_809 · ch8 · ork_fort · 旁白 · time{d:1}
格鲁卡还是大老大。他带着伊斯卡隆所有的兽人去见先知了。 / 作坊空了。瓦兹格布被拉去造别的东西，斯卡巴德被拉去当炮灰。 / 你被留在一张很长的名单上：没用的东西。
from: ork_805 ⟵ “指着瓦兹格布” | ork_805(fail) ⟵ “趁乱溜走” | ork_813 ⟵ “爬起来”
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, blamedMek, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_805, ork_803, ork_802, ork_801, ork_710, ork_711
  1. “溜去海盗船” → ork_807 require{flag:berth} eff{hp:-5} ⇒ 海盗船还在废料场，舱门半开着，引擎已经在吼。
  2. “按下信标” → ork_808 require{flag:beacon} eff{sanity:-5} ⇒ 信标亮起一个小小的红点。你蹲在空荡荡的堡垒里，数着心跳等。
  3. “去找医生佬” → ork_end_dok require{flag:orkBitz} eff{sanity:-10} ⇒ 巴兹戈布正在收拾桶。他看见你，眼睛亮了：“人仔！俺的人仔！”
  4. “跟上瓦兹格布” → ork_end_grot eff{sanity:-5} ⇒ 瓦兹格布回头看了你一眼，没赶你走。这大概是兽人最温柔的样子。

### ork_810 · ch8 · ork_fort · 格鲁卡大老大 · time{h:1}
格鲁卡蹲下来，差不多和你一样高了。他咧开嘴，每颗牙都比你的小臂长。 / “人仔有种，”他说，“俺让你先打。” / 全星球的兽人都在看。天上，先知的雷暴也在看。
from: ork_805 ⟵ ““我造的！”跳进坑里”
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_805, ork_803, ork_802, ork_801, ork_710, ork_711
  1. “用扳手砸他的牙” ROLL p=0.35+hp ✓ork_812 ✗ork_813 ⇒✓ 扳手砸在他嘴上，一颗牙飞了出去。 ⇒✗ 扳手断了。格鲁卡叹了口气，像是有点失望。
  2. “引他踩进冒火的反应堆” ROLL p=0.4+renown ✓ork_812 ✗ork_813 ⇒✓ 格鲁卡一脚踩进火里，烧得跳了起来，跳得太高，磕掉了一颗牙。 ⇒✗ 格鲁卡跨过了火。他早就看见了。
  3. “指着额头的蓝漆” → ork_812 require{flag:luckyBlue} eff{renown:5} ⇒ 格鲁卡的拳头停在半空，盯着那道蓝色看了很久。兽人不打运气好的东西。

### ork_811 · ch8 · ork_scrapyard · 绿色风暴 · time{h:3}
绿色雷暴裂开了。一个巨大的身影站在闪电里，比任何兽人都大，头顶闪着金属的光。 / 你看不清他的脸，只听见几十万兽人同时安静了一秒，然后吼出同一个名字。 / 先知看了伊斯卡隆一眼。
on enter: {sanity:-5}  codex:ork_ghazghkull
from: ork_804 ⟵ “跟着吼” | ork_804 ⟵ “悄悄退到人群后面” | ork_805(success) ⟵ “趁乱溜走” | ork_812 ⟵ “把牙挂在脖子上”
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, luckyUmie, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, shinyWon, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_803, ork_802, ork_801, ork_710, ork_711, ork_709
  1. “跟着吼那个名字” → ork_806 eff{renown:3,taint:{khorne:10}} ⇒ “加兹库尔！”你的声音淹没在吼声里。那一刻，你觉得自己也很大。
  2. “低下头” → ork_806 eff{sanity:3} ⇒ 你盯着自己的靴子。有些东西，人类最好不要看得太清楚。

### ork_806 · ch8 · ork_scrapyard · 机械佬瓦兹格布 · time{h:6}
绿色雷暴落地了。成千上万的兽人涌向先知的舰队，伊斯卡隆的小子们也在其中。 / 瓦兹格布在收拾工具：“先知要大机械佬，俺要去。你，人仔，来不来？” / 听说下一站是奥雷克斯二号。
on enter:   codex:place_aurex
from: ork_811 ⟵ “跟着吼那个名字” | ork_811 ⟵ “低下头”
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, luckyUmie, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, shinyWon, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_811, ork_803, ork_802, ork_801, ork_710, ork_711
  1. ““我跟你走，大机械佬。”” → ork_end_big_umie require{stat:renown,min:70} eff{renown:5} ⇒ 瓦兹格布把一副护目镜扣在你脸上。“俺的人仔，”他说，“不卖。”
  2. “跟着大军走” → ork_end_grot eff{sanity:-10} ⇒ 你被人流卷着往前走。没人在乎你，你也不知道能去哪儿。
  3. “溜去海盗船” → ork_807 require{flag:berth} eff{hp:-5} ⇒ 你逆着人流往废料场跑，被撞倒了好几次。
  4. “按下信标” → ork_808 require{flag:beacon} eff{sanity:-5} ⇒ 信标亮起一个小小的红点。在这片绿色里，它显得那么孤单。

### ork_807 · ch8 · ork_scrapyard · 红戈布船长 · time{h:1}
海盗船的舱门正在关，引擎喷出的火把废料烧得通红。 / 红戈布站在舱口，帽子被风吹歪了：“人仔！快！不等！” / 舱门离地面有两米高。
from: ork_806 ⟵ “溜去海盗船” | ork_809 ⟵ “溜去海盗船”
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, blamedMek, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, luckyUmie, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, shinyWon, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_803, ork_802, ork_801, ork_710, ork_711, ork_709
  1. “助跑，跳！” ROLL p=0.6+hp ✓ork_end_freebooter ✗ork_end_grot ⇒✓ 一只绿色的大手抓住了你的手腕，把你拽了上去。 ⇒✗ 你的指尖擦过舱门。船飞走了，地上只剩你和一个拿着鞭子的牧地精兽人。

### ork_808 · ch8 · burning_city · 疤脸老兵 · time{h:2}
三分钟后，一艘炮艇贴着绿色雷暴俯冲下来，舱门大开。 / 那位疤脸老兵伸出手：“你看到的，全部告诉我们。” / 身后，兽人们根本没注意。它们都在看天上的先知。
from: ork_806 ⟵ “按下信标” | ork_809 ⟵ “按下信标”
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, blamedMek, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, luckyUmie, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, shinyWon, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_803, ork_802, ork_801, ork_710, ork_711, ork_709
  1. “抓住他的手” → ork_end_evacuated eff{sanity:10} ⇒ 他的手套又冷又硬，可握得很稳。你这才发现，自己已经很久没碰过人类的手了。

### ork_812 · ch8 · ork_fort · 格鲁卡大老大 · time{h:1}
你没打赢。没人能打赢格鲁卡。可你还站着，地上还有他的一颗牙。 / 格鲁卡捡起那颗牙看了看，大笑着扔给你。 / “人仔赢了一颗牙！”全场一起吼。从今天起，你有了一个兽人名字。
on enter: {renown:15,set:{luckyUmie:true}}
from: ork_810(success) ⟵ “用扳手砸他的牙” | ork_810(success) ⟵ “引他踩进冒火的反应堆” | ork_810 ⟵ “指着额头的蓝漆”
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_810, ork_805, ork_803, ork_802, ork_801, ork_710
  1. “把牙挂在脖子上” → ork_811

### ork_813 · ch8 · ork_fort · 旁白 · foe:ork_boss · time{h:1}
格鲁卡只用了一下。 / 你飞出打架坑，落在废铁堆上，听见身体里有几样东西换了位置。 / 兽人们在笑。不是嘲笑，是那种看了一场好戏的笑。
on enter: {hp:-50}
from: ork_810(fail) ⟵ “用扳手砸他的牙” | ork_810(fail) ⟵ “引他踩进冒火的反应堆”
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_810, ork_805, ork_803, ork_802, ork_801, ork_710
  1. “爬起来” → ork_809

### ork_end_dok · ch8 · ork_fort · 巴兹戈布医生佬 · time{y:1} · **ENDING bad**
巴兹戈布医生佬把你当成了毕生杰作。一条绿胳膊，两条绿腿，一颗不知道是谁的心。 / 你比任何人类都强壮，打架时会忍不住吼。 / 只是有时候，你想不起自己吼的是哪种语言。
ending: 「医生佬的杰作」 cause: 被改造成兽人零件
from: ork_809 ⟵ “去找医生佬”
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, blamedMek, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_809, ork_805, ork_803, ork_802, ork_801, ork_710

### ork_end_grot · ch8 · ork_scrapyard · 地精仔斯纳吉特 · time{y:10} · **ENDING bad**
你跟着大Waaagh!走了十年，从一颗星球到另一颗。 / 你给机械佬递扳手，给地精分口粮，给史奎格喂剩饭。没人记得你的名字，地精们管你叫“大地精”。 / 你不再数日子了。兽人不数，你也不数。
ending: 「大地精」 cause: 当了一辈子奴隶
from: ork_806 ⟵ “跟着大军走” | ork_809 ⟵ “跟上瓦兹格布” | ork_807(fail) ⟵ “助跑，跳！”
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, blamedMek, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, luckyUmie, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, shinyWon, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_803, ork_802, ork_801, ork_710, ork_711, ork_709

### ork_end_big_umie · ch8 · ork_scrapyard · 机械佬瓦兹格布 · time{y:2} · **ENDING good**
两年后，大Waaagh!里流传着一个传说：人仔机械佬，认得人仔的字，修得好人仔的船。 / 兽人叫你“牙人仔”。你有一罐牙，一副护目镜，和一个没人敢动的位置。 / 有时你想起自己曾是人。偶尔。
ending: 「牙人仔」 cause: 当了人仔机械佬
from: ork_806 ⟵ ““我跟你走，大机械佬。””
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, luckyUmie, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, shinyWon, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_806, ork_811, ork_803, ork_802, ork_801, ork_710

### ork_end_evacuated · ch8 · void · 旁白 · time{d:20,warp:true} · **ENDING good**
炮艇载着你穿过雷暴。你把看到的一切告诉星际战士：机械佬、怪小子、先知的舰队。 / 情报被发往奥雷克斯二号，大Waaagh!的下一站。 / 那边的人能比伊斯卡隆多准备几天。也许就够了。
ending: 「几天的预警」 cause: 带着情报撤离
on enter:   codex:place_aurex
from: ork_808 ⟵ “抓住他的手”
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, blamedMek, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, luckyUmie, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, shinyWon, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_808, ork_803, ork_802, ork_801, ork_710, ork_711

### ork_end_freebooter · ch8 · void · 红戈布船长 · time{d:60,warp:true} · **ENDING good**
海盗船冲出伊斯卡隆的绿天时，你回头看了一眼。整颗星球在燃烧，在吼叫。 / 红戈布扔给你一顶插羽毛的帽子。“自由海盗，”他说，“没有老大，只有牙。” / 你把帽子戴上了。有点大，不过你会长的。
ending: 「自由海盗」 cause: 随自由海盗远走星海
from: ork_807(success) ⟵ “助跑，跳！”
flags on arrival — MUST: ∅ · MAY-only: beacon, berth, betrayedResistance, blamedMek, bloodDagger, burnedSpores, chaosRelic, flare, forgiven_edna, forgiven_snaggit, freebooterFriend, gork, gotShoota, grotCrew, hotReactor, luckyBlue, luckyUmie, mapped, mekLoyal, moreBitz, mork, needsReactor, origin_ganger, origin_guard, origin_scrap, orkBitz, packs, petSquig, relicArmour, resistance, sabotaged, shinyDead, shinyRed, shinyWon, snagFriend, snagGrudge, snitched, snitchedSnag, stoleTeef, toldWarboss, vossTrust, wronged_edna, wronged_snaggit, wronged_wazgob, zogFriend
certainly visited before (nearest 6): ork_807, ork_803, ork_802, ork_801, ork_710, ork_711
