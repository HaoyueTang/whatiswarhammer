/* data/factions/imperium.js — Imperium route (text role).
 * Player: hive worker on Aurex Secundus, tithed into the Astra Militarum. Start 111.M42.
 * Helpers: L(zh,en) = localized string; S(sprite,zh,en) = speaker; C(zh,en,next,extra) = choice
 *   (extra may carry result: L(...), the consequence beat shown after the click — SPEC §11); R(...) = roll.
 */
(function () {
  function L(zh, en) { return {zh: zh, en: en}; }
  function S(sprite, zh, en) { return {sprite: sprite, name: {zh: zh, en: en}}; }
  function C(zh, en, next, extra) {
    var c = {text: {zh: zh, en: en}};
    if (next) c.next = next;
    if (extra) for (var k in extra) c[k] = extra[k];
    return c;
  }
  // R(p, stat, success, fail, okText, failText): roll choice; optional per-outcome consequence beats -> rollResult (SPEC §11)
  function R(p, stat, success, fail, okText, failText) {
    var c = {roll: {p: p, stat: stat, success: success, fail: fail}};
    if (okText && failText) c.rollResult = {success: okText, fail: failText};
    return c;
  }
  // SPEC §32.2 alt lines: ALT = replaces the node text, ADD = extra paragraph; F/NF = flag / not-flag condition
  function ALT(cond, zh, en) { return {if: cond, text: {zh: zh, en: en}}; }
  function ADD(cond, zh, en) { return {if: cond, add: {zh: zh, en: en}}; }
  function F(x) { return {flag: x}; }
  function NF(x) { return {notFlag: x}; }

  var GRUSK  = S("hive_foreman", "格鲁斯克监工", "Overseer Grusk");
  var HALLOW = S("preacher", "哈洛执事", "Deacon Hallow");
  var PELL   = S("guardsman", "佩尔", "Pell");
  var VOSK   = S("guard_sergeant", "沃斯克中士", "Sergeant Vosk");
  var DRAVIK = S("commissar", "德拉维克政委", "Commissar Dravik");
  var QUELL  = S("tech_priest", "奎尔-7神甫", "Tech-Priest Quell-7");
  var ARNO   = S("medicae", "阿诺医师", "Medicae Arno");
  var HAAK   = S("inquisitor", "哈克审判官", "Inquisitor Haak");
  var BRIN   = S("cultist", "布琳婆婆", "Old Brin");
  var MINA   = S("psyker", "米娜", "Mina");
  var CHAP   = S("preacher", "随军牧师", "Regimental Priest");

  var N = {};

  /* ============ Chapter 1 · The Tithe ============ */
  N.imp_101 = {chapter: 1, scene: "hive_hab", speaker: null,
    text: L("第六班汽笛响了三声。墙上的帝皇画像被蒸汽熏得只剩一双眼睛。\n今天是什一税日。整栋居住块都在假装自己很忙。",
            "The sixth-shift siren blows three times. The Emperor's portrait on the wall has been steamed down to a pair of eyes.\nToday is Tithe Day. The whole hab-block is pretending to be busy."),
    codex: ["imp_hive", "imp_emperor", "place_aurex", "place_tower_three"],
    choices: [
      C("准时去工厂上工", "Get to the manufactorum on time", "imp_102", {result: L("你一路小跑下了三层楼梯。打卡机还是比你快了一分钟。", "You jog down three flights of stairs. The time-clock still beats you by a minute.")}),
      C("先去楼梯间找佩尔", "Find Pell in the stairwell first", "imp_103")
    ]};

  N.imp_102 = {chapter: 1, scene: "manufactorum", speaker: GRUSK, time: {h: 1},
    text: L("“又迟到，扣一天口粮。”格鲁斯克在名册上画了个圈，“名单今天下来。帝皇要兵，巢都要配额。”\n他看着你，“你年轻。祝你好运——或者说，祝我好运。”",
            "“Late again. One day's rations.” Grusk circles your name. “The list comes down today. The Emperor wants soldiers; the hive wants its quota.”\nHe looks you over. “You're young. Good luck to you. Or to me, rather.”"),
    codex: ["imp_tithe", "place_manufactorum_six"],
    choices: [
      C("低头干活", "Keep your head down and work", "imp_104", {effects: {hp: -5, renown: 2}, result: L("你把脸埋进蒸汽里拧了一上午螺栓。手掌起了泡，格鲁斯克没再看你一眼。", "You bury your face in the steam and turn bolts all morning. Your palms blister. Grusk doesn't look at you again.")}),
      C("问他名单上还有谁", "Ask who else is on the list", "imp_103", {effects: {sanity: -5}, result: L("格鲁斯克合上名册：“问这个的人，通常都在上面。”他挥手让你去楼梯间透透气。", "Grusk shuts the ledger. “People who ask usually find themselves on it.” He waves you off to the stairwell for some air.")})
    ]};

  N.imp_103 = {chapter: 1, scene: "hive_hab", speaker: PELL, time: {h: 1}, gather: L("楼梯间", "Stairwell"),
    text: L("楼梯间挤满了等着上工的人。佩尔在这儿卖再生咖啡，一杯掺三成水。“今天免费，”他咧嘴笑，“万一咱俩被抽中，就当我的遗产。”\n他妹妹米娜躲在他身后，指尖结着一层薄霜。",
            "The stairwell is crammed with workers waiting for shift. Pell sells recaff here, a third of it water. “Free today,” he grins. “If we both get picked, call it my inheritance.”\nHis little sister Mina hides behind him. Frost is creeping over her fingertips."),
    choices: [
      C("接过咖啡，聊点别的", "Take the recaff, talk about anything else", "imp_104", {effects: {sanity: 5}, result: L("咖啡烫嘴，淡得像刷锅水。你们聊下巢的赛鼠，谁都没提名单。", "The recaff scalds and tastes like dishwater. You talk about underhive rat races. Neither of you mentions the list.")}),
      C("盯着米娜的手", "Stare at Mina's hands", "imp_105", {effects: {set: {sawMina: true}}, result: L("霜花在她指缝间长成细小的蕨叶。楼梯间好像冷了两度。", "Frost grows between her fingers in tiny fern shapes. The stairwell feels two degrees colder.")})
    ]};

  N.imp_105 = {chapter: 1, scene: "hive_hab", speaker: PELL, time: {h: 1},
    text: L("米娜把手缩进袖子。“别说出去，”佩尔压低声音，“上个月她梦见三号塔塌了，第二天就塌了。”\n走廊尽头，执事在贴告示：举报巫者，赏一周口粮。",
            "Mina pulls her hands into her sleeves. “Don't tell anyone,” Pell whispers. “Last month she dreamed Tower Three fell. Next day, it did.”\nDown the hall, a deacon pins up a notice: report a witch, earn a week's rations."),
    codex: ["imp_psyker"],
    choices: [
      C("替他们保密", "Keep their secret", "imp_104", {effects: {sanity: -5, set: {hidMina: true}}, result: L("你点了点头。从那以后，每次看见执事，你的后颈都会冒冷汗。", "You nod. From then on, the sight of any deacon makes the back of your neck run cold.")}),
      C("去找执事", "Go and find the deacon", "imp_106", {effects: {renown: 5, set: {reportedMina: true, wronged_mina: true, wronged_pell: true}}, result: L("你在走廊尽头拉住执事的袖子。说出米娜的名字时，你的声音比想象中平静。走廊另一头，佩尔全看见了。", "You catch the deacon's sleeve at the end of the hall. When you say Mina's name, your voice is calmer than you expected. At the far end of the hall, Pell sees it all.")})
    ]};

  N.imp_106 = {chapter: 1, scene: "hive_hab", speaker: HALLOW, time: {h: 1},
    text: L("哈洛执事在名册上写下米娜的名字，给了你一张口粮券，拍拍你的头，像奖励一条好狗。\n走廊那头，佩尔一直看着你。他什么也没说。",
            "Deacon Hallow writes Mina's name in his register, hands you a ration chit and pats your head like a good dog.\nAt the end of the hall, Pell watches you the whole time. He says nothing."),
    effects: {sanity: -5},
    codex: ["imp_black_ships"],
    choices: [
      C("去广场听名单", "Go to the square for the list", "imp_104")
    ]};

  N.imp_104 = {chapter: 1, scene: "cathedral", speaker: HALLOW, time: {h: 3},
    alt: [ADD(F("reportedMina"), "佩尔站在人群另一头。米娜不在他身边。", "Pell stands at the far edge of the crowd. Mina isn't with him."),
          ADD(F("hidMina"), "米娜缩在佩尔身后，把结霜的手藏得很好。", "Mina huddles behind Pell, her frosted hands well hidden.")],
    text: L("广场挤满了人。哈洛执事念着名单，语气像在感恩祷告：“……佩尔·奥斯特。还有你。”\n他抬起头：“赞美帝皇，你们被选中了。”有人鼓掌，有人哭。",
            "The square is packed. Deacon Hallow reads the list like a prayer of thanks. “...Pell Ost. And you.”\nHe looks up. “Praise the Emperor, you have been chosen.” Someone applauds. Someone weeps."),
    codex: ["imp_ecclesiarchy"],
    choices: [
      C("接受命运", "Accept it", "imp_106b", {effects: {renown: 3}, result: L("你走上台阶，执事在你额头点了一滴圣油。人群里有人喊你的名字，你没看清是谁。", "You climb the steps. The deacon dabs holy oil on your brow. Someone in the crowd shouts your name; you never see who.")}),
      C("趁乱钻进排污管", "Slip into a drain pipe in the crowd", null, R(0.4, "hp", "imp_108", "imp_109", L("你趁人群推搡掀开格栅，滑进黑暗。头顶的赞美诗越来越远。", "You lift a grate in the crush and slide into the dark. The hymns overhead grow faint."), L("你钻进了管道，身后却响起靴子声。他们早就在下面等着了。", "You make it into the pipe, but boots echo behind you. They were waiting down here all along.")))
    ]};

  N.imp_108 = {chapter: 1, scene: "underhive", speaker: null, time: {d: 1},
    text: L("你一路往下钻。下巢的空气是甜的，甜得发腥。\n第二天，你饿得啃起了靴带。一个独眼拾荒者递来一块肉：“别问是什么肉。”\n远处传来执法官的哨声。他们在清扫配额。",
            "You crawl down and down. Underhive air is sweet—sickly sweet.\nBy the second day you're chewing your bootlaces. A one-eyed scavenger offers you meat. “Don't ask what it was.”\nEnforcer whistles in the distance. They're sweeping for the quota."),
    effects: {hp: -10, set: {deserter: true}},
    choices: [
      C("吃下去", "Eat it", "imp_108b", {effects: {hp: 10, corruption: 3, taint: {nurgle: 15}}, result: L("肉有股甜味，跟这里的空气一样甜。你吃完，他咧开没牙的嘴：“跟我来。”", "The meat is sweet, like the air down here. When you finish, he grins toothlessly. “Follow me.”")}),
      C("摇头，继续躲", "Shake your head and keep hiding", "imp_109", {effects: {hp: -5}, result: L("你蜷进一截废管道，胃拧成了一团。哨声越来越近。", "You curl up in a dead pipe, stomach knotted. The whistles draw closer.")})
    ]};

  N.imp_108b = {chapter: 1, scene: "underhive", speaker: null, time: {h: 6},
    text: L("独眼人带你走“他的路”：一条贴着第六工厂渣池的排污管，一路通到巢都底层的泵站。\n“记住这些管子，”他说，“上面的人从不下来。”\n管道尽头，执法官的灯亮了。他早就不见了。",
            "The one-eyed man shows you “his road”: a sewer main running past Manufactorum Six's slag pits, all the way to the pumping station at the hive's foot.\n“Remember these pipes,” he says. “Topsiders never come down.”\nAt the end of the pipe, an enforcer's lamp snaps on. He has already vanished."),
    effects: {set: {underhiveFriend: true}},
    choices: [
      C("举起双手", "Raise your hands", "imp_109", {result: L("你举起手，眯眼看着那盏灯。身后的管道里，连脚步声都没有了。", "You raise your hands and squint into the lamp. Behind you, the pipe is silent, not even a footstep.")})
    ]};

  N.imp_109 = {chapter: 1, scene: "underhive", speaker: S("enforcer", "执法官", "Enforcer"), time: {h: 2},
    text: L("电棍在你肋下停了一秒。\n“逃兵？”执法官翻着记录板，“不对。配额还差一个，所以你是志愿者。”\n你的档案上多了一个红色印章。",
            "A shock maul rests against your ribs for one long second.\n“Deserter?” The enforcer checks his slate. “No. We're one short of quota. So you're a volunteer.”\nA red stamp appears on your file."),
    effects: {hp: -10, set: {marked: true}},
    codex: ["imp_arbites"],
    choices: [
      C("被押回上面", "Get marched back up", "imp_106b", {result: L("他们把你铐在一根管子上，一路押回巢都底层的征兵仓。", "They cuff you to a pipe and march you all the way back up to the holding pen at the hive's foot.")})
    ]};

  // bridge-in-chapter: the three days between the list and the transport (audit D36/D09)
  N.imp_106b = {chapter: 1, scene: "barracks", speaker: PELL, time: {h: 4}, gather: L("征兵仓", "Holding pen"),
    alt: [ALT(F("reportedMina"), "巢都底层的征兵仓。几百个被抽中的人挤在铺位上等运兵车，有人祈祷，有人哭。\n佩尔睡在最远的铺位上，背对着你。有人说，天黑前一艘不亮灯的黑船带走了他妹妹。",
              "The holding pen at the hive's foot. Hundreds of the chosen wait on bunks for the transport, praying or weeping.\nPell has the farthest bunk and keeps his back to you. People say a ship with no lights took his sister before dark."),
          ALT(F("marked"), "巢都底层的征兵仓。几百个被抽中的人挤在铺位上等运兵车。你被押进来时，所有人都看着你档案上的红章。\n佩尔愣了一下，往旁边挪了挪：“逃不掉的。坐吧。”",
              "The holding pen at the hive's foot. Hundreds of the chosen wait on bunks for the transport. When they march you in, everyone stares at the red stamp on your file.\nPell blinks, then shifts over. “Nobody gets out. Sit.”"),
          ADD(F("hidMina"), "夜里，米娜偷偷来过栅栏外，塞进来一条旧围巾。", "That night Mina creeps up to the fence and pushes an old scarf through.")],
    text: L("巢都底层的征兵仓。几百个被抽中的人挤在铺位上等运兵车，有人祈祷，有人哭。\n佩尔坐在你旁边，把一块口粮掰成两半：“听说要等三天。”",
            "The holding pen at the hive's foot. Hundreds of the chosen wait on bunks for the transport, praying or weeping.\nPell sits beside you and snaps a ration bar in two. “They say it's three days.”"),
    choices: [
      C("躺下，等运兵车", "Lie down and wait for the transport", "imp_107", {result: L("铺位上一股汗味。你数着头顶的铆钉，数到第三天。", "The bunk stinks of sweat. You count the rivets overhead until the third day.")}),
      C("走过去，跟佩尔说对不起", "Go over and tell Pell you're sorry", "imp_107", {require: {flag: "wronged_pell"}, hideIfLocked: true, effects: {sanity: -5, set: {apologizedPell: true}}, result: L("佩尔听完，没有回头。“跟我说没用，”他说，“去跟她说。”", "Pell hears you out without turning round. “Telling me is no use,” he says. “Tell her.”")})
    ]};

  N.imp_107 = {chapter: 1, scene: "ship_interior", speaker: null, time: {d: 2},
    text: L("第三天，运兵车终于升离巢都。你第一次看见天空——黄色的，像一道旧伤。\n佩尔把额头贴在舷窗上：“听说外面的星球有真正的雨。”\n没人告诉他，有些雨是酸的。",
            "On the third day the transport finally lifts off the hive. You see the sky for the first time. It is yellow, like an old bruise.\nPell presses his forehead to the viewport. “They say other worlds have real rain.”\nNobody tells him some rain is acid."),
    codex: ["place_imp_troopship"],
    choices: [
      C("闭上眼睛", "Close your eyes", "imp_200", {effects: {sanity: 5}, result: L("你闭上眼听着引擎轰鸣，居然睡着了。梦里没有天空。", "You close your eyes to the engines' roar and somehow fall asleep. There's no sky in your dreams.")}),
      C("一直看着巢都变小", "Watch the hive shrink away", "imp_200", {effects: {renown: 2, set: {sawBlackShip: true}}, result: L("巢都缩成一根针。尖塔旁悬着一艘不亮灯的黑船，正慢慢转向。", "The hive shrinks to a needle. Beside the spire hangs a ship with no lights, slowly turning."),
        resultAlt: [{if: F("reportedMina"), text: L("尖塔旁悬着一艘不亮灯的黑船。佩尔也看见了，攥紧的拳头抵在舷窗上。", "A ship with no lights hangs by the spire. Pell sees it too; his fist presses white against the glass.")}]})
    ]};

  /* ============ Origin prologues (SPEC §16) · merge at the chapter-2 bridge imp_200 ============ */
  /* --- 农庄之子 / Farmer's child (origin_agri) --- */
  N.imp_o_agri_1 = {chapter: 1, scene: "jungle", speaker: null,
    text: L("巢都外的灰原上，七号穹顶农庄。玻璃顶裂了一道缝，黄色的天从缝里漏进来。\n父亲说，巢都一天吃掉的麦子，比这里一年种的还多。\n今天，收割机又坏了。",
            "Out on the ash plains beyond the hive: Dome Farm Seven. A crack runs through the glass roof, and the yellow sky leaks in.\nFather says the hive eats more wheat in a day than this farm grows in a year.\nToday the harvester has broken down again."),
    codex: ["imp_hive", "imp_emperor", "place_aurex"],
    choices: [
      C("弯腰用镰刀割", "Bend down and cut by sickle", "imp_o_agri_2", {effects: {hp: -5, renown: 2, set: {handsRaw: true}}, result: L("你割到太阳沉进裂缝。手上磨出了血泡，麦捆码得整整齐齐。", "You cut until the sun sinks into the crack. Your palms blister; the sheaves stand in neat rows.")}),
      C("钻到收割机底下修", "Crawl under the harvester to fix it", "imp_o_agri_2", {effects: {set: {fixedHarvester: true}}, result: L("你对着机器念了三遍父亲教的祷词，又踹了两脚。它咳嗽着醒了。", "You recite Father's prayer to it three times, then kick it twice. It coughs awake.")})
    ]};

  N.imp_o_agri_2 = {chapter: 1, scene: "jungle", speaker: S("enforcer", "什一税官", "Tithe Assessor"), time: {d: 3},
    text: L("什一税官来了。他数完粮仓，又数了一遍人。\n“麦子差三成，”他说，“配额可以用别的东西补。”\n笔尖在你家的名字上停住。父亲握紧了镰刀，又慢慢松开。",
            "The tithe assessor arrives. He counts the granary, then counts the people.\n“The wheat is a third short,” he says. “The quota can be made up in other ways.”\nHis stylus stops on your family's name. Father grips his sickle, then slowly lets go."),
    codex: ["imp_tithe"],
    choices: [
      C("“我去。把麦子的数抹平。”", "“I'll go. Call the wheat even.”", "imp_o_agri_3", {effects: {renown: 5, set: {volunteered: true}}, result: L("税官在名册上画了个勾，像在核对一袋麦子。父亲转身进了屋。", "The assessor ticks the ledger as if checking off a sack of grain. Father turns and goes inside.")}),
      C("把粮仓的暗格指给他", "Show him the hidden grain store", "imp_o_agri_2b", {effects: {sanity: -5, set: {gaveStash: true}}, result: L("他收走了暗格里的麦子，笔尖却没离开你的名字。“配额就是配额。”", "He takes the hidden grain, but his stylus never leaves your name. “A quota is a quota.”")})
    ]};

  N.imp_o_agri_2b = {chapter: 1, scene: "jungle", speaker: S("enforcer", "什一税官", "Tithe Assessor"), time: {h: 2},
    text: L("税官把暗格里的麦子装上车，又当着全庄人的面，罚父亲跪在穹顶裂缝下。\n“私藏什一税，下一季配给减半。”\n母亲站在门口，一句话也没跟你说。",
            "The assessor loads the hidden grain onto his cart, then, in front of the whole farm, makes Father kneel beneath the cracked dome.\n“Hoarding tithe. Rations halved next season.”\nMother stands in the doorway and says nothing to you at all."),
    effects: {sanity: -5},
    choices: [
      C("回屋收拾行李", "Go inside and pack", "imp_o_agri_3", {result: L("你的东西装不满半个口袋。窗外，父亲还跪着。", "Your things don't fill half a sack. Outside the window, Father is still kneeling.")})
    ]};

  N.imp_o_agri_3 = {chapter: 1, scene: "jungle", speaker: null, time: {h: 20},
    alt: [ALT(F("gaveStash"), "临走前，母亲往你口袋里塞了一把麦种，手在发抖。“到了哪儿，都找块土。”\n父亲还跪在裂缝下，膝盖陷进了灰里。他没有抬头送你。",
              "Before you go, Mother pushes a handful of seed wheat into your pocket, her hand shaking. “Wherever you end up, find some soil.”\nFather still kneels under the crack, knees sunk in the ash. He doesn't look up to see you off.")],
    text: L("临走前，母亲往你口袋里塞了一把麦种。“到了哪儿，都找块土。”\n父亲没出来送。走出很远，你回头看见他站在穹顶裂缝下，替你割完了最后一垄。",
            "Before you go, Mother presses a handful of seed wheat into your pocket. “Wherever you end up, find some soil.”\nFather doesn't see you off. Far down the road you look back: he stands under the cracked dome, cutting your last row for you."),
    choices: [
      C("攥紧麦种", "Hold the seeds tight", "imp_o_agri_4", {effects: {sanity: 5, set: {agriSeeds: true}}, result: L("麦种有点潮，还带着穹顶里的温度。你一路都没松手。", "The seeds are a little damp, still warm from the dome. You don't let go the whole way.")}),
      C("把麦种留给她", "Leave the seeds with her", "imp_o_agri_4", {effects: {renown: 3, set: {seedsHome: true}}, result: L("“明年的地比我更需要它们。”你把麦种放回她手里。她没再坚持。", "“Next year's field needs them more than I do.” You put the seeds back in her hand. She doesn't argue.")})
    ]};

  N.imp_o_agri_4 = {chapter: 1, scene: "barracks", speaker: S("medicae", "征兵医官", "Muster Medicae"), time: {d: 2}, gather: L("征兵站", "Muster station"),
    alt: [ADD(F("handsRaw"), "他按了按你掌心新磨的血泡，在表格上多画了一个勾。", "He presses the fresh blisters on your palm and adds a second tick."),
          ADD(F("fixedHarvester"), "他瞥见你指甲缝里的机油：“修过机器？神甫们喜欢这种人。”", "He spots the engine oil under your nails. “Fixed machines? The tech-priests like that.”")],
    text: L("巢都底层的征兵站，一长排赤膊新兵等着验牙。医官掰开你的嘴，又翻过你的手。\n“种地的？比巢都里长大的强。”\n他压低声音：“别跟他们说你见过天。巢都人会嫉妒。”",
            "The muster station at the foot of the hive: a long line of shirtless recruits waiting to have their teeth checked. The medicae prises your mouth open, turns your hands over.\n“Farm stock? Better than hive-born.”\nHe lowers his voice. “Don't tell them you've seen the sky. Hive folk get jealous.”"),
    choices: [
      C("点头，把手揣进兜里", "Nod and pocket your hands", "imp_o_agri_5", {effects: {set: {hidSky: true}}, result: L("你把手插进兜里，摸到了口袋底的麦糠。医官已经在喊下一个了。", "You shove your hands in your pockets and feel chaff in the seams. The medicae is already calling the next one.")}),
      C("问他巢都人什么样", "Ask what hive folk are like", "imp_o_agri_5", {effects: {sanity: -3, set: {askedHive: true}}, result: L("“跟你一样，”他说，“只是没见过太阳。”他顿了顿，“大部分也见不到了。”", "“Like you,” he says. “Only they've never seen the sun.” A pause. “Most never will.”")})
    ]};

  N.imp_o_agri_5 = {chapter: 1, scene: "ship_interior", speaker: PELL, time: {d: 1},
    alt: [ADD(F("hidSky"), "你把手揣在兜里，他还是看见了你脖子上的晒痕。", "Your hands are in your pockets, but he still sees the sunburn on your neck."),
          ADD(F("askedHive"), "你想起医官的话：他们跟你一样，只是没见过太阳。", "You remember the medicae: like you, only they've never seen the sun.")],
    text: L("运兵车里全是巢都人，脸白得像没晒过太阳。一个叫佩尔的递来一杯再生咖啡，掺了三成水。\n“今天免费，”他咧嘴笑，“万一咱俩都死了，就当我的遗产。”\n他盯着你：“你见过天？”",
            "The transport is full of hive folk, pale as if they've never seen the sun. One called Pell hands you recaff, a third of it water.\n“Free today,” he grins. “If we both die, call it my inheritance.”\nHe eyes you. “You've seen the sky?”"),
    codex: ["place_imp_troopship"],
    choices: [
      C("跟他讲穹顶外的天", "Tell him about the sky beyond the dome", "imp_200", {effects: {sanity: 5, set: {toldPellSky: true}}, result: L("你讲黄色的天、裂开的玻璃、风吹过麦浪。佩尔听得忘了喝咖啡。", "You describe the yellow sky, the cracked glass, wind across the wheat. Pell forgets his recaff.")}),
      C("“见过。没什么好看的。”", "“I have. It's nothing special.”", "imp_200", {result: L("佩尔不信，趴在舷窗上看了一路。下车时他说你骗人，天好看极了。", "Pell doesn't believe you and spends the trip at the viewport. Getting off, he calls you a liar: the sky is gorgeous.")})
    ]};

  /* --- 落魄贵族次子 / Fallen noble's second-born (origin_noble) --- */
  N.imp_o_noble_1 = {chapter: 1, scene: "hive_spire", speaker: null,
    text: L("尖塔第九十层，赛伦家族。家徽是一座塔和一柄断剑，挂在早已抵押出去的大厅里。\n长子继承家名和债务。次子，用来还债。\n今晚，父亲第一次请你喝酒。",
            "Level ninety of the spire: House Serrin. The family crest, a tower and a broken sword, hangs in a hall long since mortgaged.\nThe eldest inherits the name and the debts. The second-born pays them.\nTonight, for the first time, Father pours you a drink."),
    codex: ["imp_hive", "imp_emperor", "place_aurex"],
    choices: [
      C("举杯，等他开口", "Raise your glass and wait", "imp_o_noble_2", {result: L("酒是好酒，家里最后一瓶。父亲看着你喝完，才开口。", "It's good wine, the house's last bottle. Father watches you finish it before he speaks.")}),
      C("先问他要什么", "Ask what he wants first", "imp_o_noble_2", {effects: {sanity: -5, set: {knowDebt: true}}, result: L("父亲放下酒杯：“你一直比你哥哥聪明。”他说出了债主：总督府的税务官。", "Father sets down his glass. “You were always cleverer than your brother.” He names the creditor: the governor's tithe office.")})
    ]};

  N.imp_o_noble_2 = {chapter: 1, scene: "hive_spire", speaker: null, time: {h: 1},
    alt: [ADD(F("knowDebt"), "那份文件的抬头，盖着总督府税务官的印。", "The document's heading bears the governor's tithe-office seal.")],
    text: L("“家族欠总督府一笔什一税，”父亲说，“按惯例，我们该给你买个军官衔。”\n他推来一份文件，签名栏空着。\n“可衔位太贵了。这一次，你得从列兵做起。”",
            "“The house owes the governor a tithe,” Father says. “By custom we'd buy you a commission.”\nHe slides a document across. The signature line is blank.\n“But commissions are dear. This time, you start as a trooper.”"),
    codex: ["imp_tithe"],
    choices: [
      C("签字", "Sign", "imp_o_noble_3", {effects: {renown: 5}, result: L("笔尖划过纸面，墨水是家族的蓝色。父亲吹干字迹，没再看你。", "The nib scratches across the page in the house's blue ink. Father blows it dry and doesn't look at you again.")}),
      C("求他再卖掉点什么", "Beg him to sell something else", "imp_o_noble_2b", {effects: {sanity: -5}, result: L("父亲指了指墙上那些空着的钉子，然后摇了摇铃。", "Father points at the empty nails on the wall. Then he rings the bell.")})
    ]};

  N.imp_o_noble_2b = {chapter: 1, scene: "hive_spire", speaker: null, time: {h: 1},
    text: L("铃声叫来了哥哥。他穿着新订的军官服，站在门口不肯进来。\n“衔位只买得起一个，”父亲说，“家族需要一个活着的继承人。”\n哥哥一直盯着地毯。你签了字。",
            "The bell brings your brother. He wears a new-tailored officer's uniform and won't come past the doorway.\n“We can afford one commission,” Father says. “The house needs a living heir.”\nYour brother stares at the carpet the whole time. You sign."),
    effects: {set: {brotherShamed: true}},
    choices: [
      C("把笔还给父亲", "Hand Father back the pen", "imp_o_noble_3", {result: L("哥哥终于抬起头，嘴唇动了动，什么也没说出来。", "Your brother finally looks up. His lips move. Nothing comes out.")})
    ]};

  N.imp_o_noble_3 = {chapter: 1, scene: "hive_spire", speaker: null, time: {d: 1},
    alt: [ALT(F("brotherShamed"), "出发前两天，哥哥在走廊里等你，还是那身新军服。\n“那天的事……”他没说完，把家族戒指塞进你手里，戒面上是那座塔和那柄断剑。\n“我会替你祈祷，每天。”",
              "Two days before you leave, your brother waits in the corridor, still in that new uniform.\n“About the other day...” He doesn't finish. He presses the family ring into your hand: the tower and the broken sword.\n“I'll pray for you. Every day.”")],
    text: L("出发前两天，哥哥在走廊里等你。他穿着一身崭新的军官制服，是为下个月的宴会订做的。\n“我会替你祈祷，”他说，“每天。”\n他把家族戒指塞进你手里，戒面上是那座塔和那柄断剑。",
            "Two days before you leave, your brother waits in the corridor. He wears a brand-new officer's uniform, tailored for next month's ball.\n“I'll pray for you,” he says. “Every day.”\nHe presses the family ring into your hand: the tower and the broken sword."),
    choices: [
      C("收下戒指", "Take the ring", "imp_o_noble_4", {effects: {renown: 3, set: {serrinRing: true}}, result: L("戒指有点大，你把它穿在绳子上挂在脖子里。哥哥松了口气，像卸下了一笔账。", "The ring is too big; you hang it on a cord round your neck. Your brother sighs with relief, like a debt settled.")}),
      C("“留着还债吧。”", "“Keep it. Pay the debts.”", "imp_o_noble_4", {effects: {sanity: 5, set: {ringReturned: true}}, result: L("哥哥攥着戒指站了很久。走廊尽头，他的影子比他矮了一截。", "Your brother stands holding the ring a long time. At the end of the corridor, his shadow looks smaller than he is.")})
    ]};

  N.imp_o_noble_4 = {chapter: 1, scene: "cathedral", speaker: S("preacher", "告解神父", "Father Confessor"), time: {d: 1},
    text: L("家族礼拜堂里，告解神父把赛伦家徽绣进你的军服内衬，一针一针。\n“下面的人不认这个，”他说，“但帝皇认。”\n他又递来一本金边祈祷书。在下巢，这样一本书能换一个月口粮。",
            "In the family chapel, the confessor stitches the Serrin crest inside your tunic, stitch by stitch.\n“Down below, nobody will know it,” he says. “The Emperor will.”\nHe hands you a gilt-edged prayer book. In the underhive, a book like that buys a month of rations."),
    codex: ["imp_ecclesiarchy"],
    choices: [
      C("撕掉金边再带上", "Tear off the gilt, then take it", "imp_o_noble_5", {effects: {sanity: 5, set: {plainBook: true}}, result: L("神父看着你撕，没有阻止。“聪明，”他叹气，“下面的人会为了金子割喉咙。”", "The confessor watches you tear it and doesn't stop you. “Wise,” he sighs. “Down there, men cut throats for gold.”")}),
      C("原样收下，留住家族的体面", "Keep it as it is, for the house's honour", "imp_o_noble_5", {effects: {renown: 5, set: {giltBook: true}, taint: {slaanesh: 25}}, result: L("金边在烛光下闪闪发亮。你把书贴身收好，像揣着一小块尖塔。", "The gilt gleams in the candlelight. You tuck the book against your chest like a small piece of the spire.")})
    ]};

  N.imp_o_noble_5 = {chapter: 1, scene: "ship_interior", speaker: PELL, time: {d: 1}, gather: L("运兵车", "Transport"),
    alt: [ALT(F("giltBook"), "第三天清晨，运兵车在尖塔底层等你。车里挤满巢都人，没人知道你是谁，直到你掏出那本金边祈祷书。\n一个叫佩尔的年轻人吹了声口哨：“尖塔上来的？咖啡免费，就当我巴结过贵人。”",
              "At dawn on the third day the transport waits at the spire's foot. It's packed with hive folk; nobody knows who you are, until you take out the gilt prayer book.\nA young man called Pell whistles. “Spire blood? Recaff's free. So I can say I bowed to nobility.”"),
          ADD(F("plainBook"), "你那本撕了金边的祈祷书，没人多看一眼。", "Your prayer book, its gilt torn off, draws no one's eye.")],
    text: L("第三天清晨，运兵车在尖塔底层等你。车里挤满巢都人，没人知道你是谁。\n一个叫佩尔的年轻人递来一杯掺水的再生咖啡：“今天免费。新来的？你的手太干净了。”\n周围的人都笑了。",
            "At dawn on the third day the transport waits at the spire's foot. It's packed with hive folk; nobody knows who you are.\nA young man called Pell hands you watered recaff. “Free today. New? Your hands are too clean.”\nEveryone around you laughs."),
    codex: ["place_imp_troopship"],
    choices: [
      C("跟着笑，接过咖啡", "Laugh along and take the recaff", "imp_200", {effects: {sanity: 5, set: {pellFriend: true}}, result: L("咖啡淡得像刷锅水。你一口喝完，说比家里的好喝。佩尔笑得差点呛着。", "It's dishwater-thin. You drain it and say it beats the stuff at home. Pell nearly chokes laughing.")}),
      C("“现在我是列兵。”", "“I'm a trooper now.”", "imp_200", {effects: {renown: 2}, result: L("佩尔挑挑眉，把杯子塞进你手里：“那就喝吧，列兵。”", "Pell raises an eyebrow and pushes the cup into your hands. “Drink up then, trooper.”")})
    ]};

  /* ============ Chapter 2 · The Making of a Guardsman ============ */
  N.imp_200 = {chapter: 2, scene: "ship_interior", speaker: VOSK, time: {h: 10}, bridge: true,
    alt: [ADD({anyFlag: ["deserter", "marked"]}, "念到你时，她看了一眼档案上逃兵的红章，什么也没说。", "At your name she glances at the deserter's red stamp on your file and says nothing."),
          ADD(F("giltBook"), "有人盯着你怀里那抹金边，舔了舔嘴唇。", "Someone eyes the glint of gilt at your chest and licks his lips.")],
    text: L("轨道港。三辆运兵车的新兵被赶进运兵舰“铁誓”号的机库，挤成一团。\n一个独眼女人跳上弹药箱：“我是沃斯克中士。训练就在这艘船上。从今天起，你们的命归帝皇，由我保管。”",
            "Orbital dock. Recruits from three transports are herded into the hangar of the troopship Oath of Iron.\nA one-eyed woman jumps onto an ammo crate. “I'm Sergeant Vosk. You train aboard this ship. From today your lives belong to the Emperor, and I hold them for Him.”"),
    effects: {sanity: 5},
    codex: ["imp_guard"],
    choices: [
      C("排进队列", "Fall into line", "imp_201", {result: L("你挤进第三排。前面那人的后脑勺上，有一块没洗掉的机油。", "You squeeze into the third rank. The man in front has a smear of engine grease he never washed off his neck.")})
    ]};

  N.imp_201 = {chapter: 2, scene: "barracks", speaker: VOSK, time: {d: 1}, gather: L("军械库", "Armoury"),
    text: L("下层甲板，军械库门口排着长队。沃斯克只有一只眼，但她能看见你枪管里的每一粒灰。\n“激光枪是你的老婆、你的神龛、你的命。”她把枪和一本薄薄的祈祷手册塞给你，“擦亮。它比你值钱。”",
            "Lower deck, a long queue outside the armoury. Vosk has one eye, and it sees every speck of dust in your barrel.\n“A lasgun is your spouse, your shrine, your life.” She shoves a rifle and a thin prayer primer into your hands. “Polish it. It's worth more than you.”"),
    codex: ["imp_guard", "imp_lasgun"],
    choices: [
      C("认真擦枪", "Clean it properly", "imp_202", {effects: {renown: 3}, result: L("你擦到枪管能照出人影。沃斯克路过时停了半秒。在她那里，这就算表扬。", "You polish until the barrel shows your reflection. Vosk pauses half a second as she passes. From her, that's praise.")}),
      C("问她眼睛怎么没的", "Ask how she lost the eye", "imp_203")
    ]};

  N.imp_203 = {chapter: 2, scene: "barracks", speaker: VOSK, time: {h: 1},
    text: L("“兽人。”她说，“它咬掉我眼睛的时候在笑。兽人打仗不为赢，为了开心。”\n她顿了顿，“所以，别让它们开心。”",
            "“Ork,” she says. “It was laughing when it took my eye. Orks don't fight to win. They fight because it's fun.”\nShe pauses. “So don't let them have fun.”"),
    codex: ["xenos_ork"],
    choices: [
      C("记住了", "Noted", "imp_202", {effects: {sanity: 3}, result: L("“很好。”她敲了敲你的头盔，力气大得让你牙齿打颤。那晚你睡得出奇地好。", "“Good.” She raps your helmet hard enough to rattle your teeth. That night you sleep surprisingly well.")})
    ]};

  N.imp_202 = {chapter: 2, scene: "barracks", speaker: DRAVIK, time: {d: 20},
    alt: [ADD(F("marked"), "她点名时，在你档案的红章上停了一秒。", "Calling the roll, she pauses one second on the red stamp in your file.")],
    text: L("训练第二十天。一个新兵扔下枪，哭着说想回家。\n德拉维克政委走了过去。你没看见发生了什么，只听见一声枪响。\n她走回来时，正不紧不慢地换着弹匣。",
            "Day twenty of training. A recruit drops his rifle and sobs that he wants to go home.\nCommissar Dravik walks over. You don't see what happens. You hear one shot.\nWhen she walks back, she is calmly changing the magazine."),
    effects: {sanity: -5},
    codex: ["imp_commissar"],
    choices: [
      C("立正，目视前方", "Stand at attention, eyes front", "imp_204", {effects: {renown: 3}, result: L("你盯着前方一块污渍，盯到它成了整个世界。政委从你身边经过，脚步没停。", "You fix on a stain ahead until it's the whole world. The commissar passes you without breaking stride.")}),
      C("去看看那个新兵", "Go and look at the recruit", "imp_202b", {effects: {sanity: -5, renown: -2}, result: L("你走出队列。没人拦你，这比有人拦更糟。", "You step out of line. Nobody stops you, which is worse than if someone had.")})
    ]};

  N.imp_202b = {chapter: 2, scene: "barracks", speaker: VOSK, time: {h: 1},
    text: L("他很年轻，脸朝下，手里攥着一封没寄出的信。信封上写着：奥雷克斯，三号塔，十四层。\n你把信塞进袖子。沃斯克揪着领子把你拽回队列。\n德拉维克看了你一眼，记下了你的编号。",
            "He is young, face down, clutching an unsent letter. The envelope reads: Aurex, Tower Three, level fourteen.\nYou slip it up your sleeve. Vosk hauls you back into line by the collar.\nDravik glances at you and notes your number."),
    effects: {set: {deadLetter: true}},
    choices: [
      C("把信藏进枕头里", "Hide the letter in your pillow", "imp_204", {result: L("那晚你摸着枕头里的信角，想着十四层那扇门后面是谁。", "That night you finger the corner of the letter in your pillow and wonder who waits behind a door on level fourteen.")})
    ]};

  N.imp_204 = {chapter: 2, scene: "ship_interior", speaker: QUELL, time: {d: 2},
    text: L("离港第二天，运兵舰机库里，一个机仆在搬弹药箱，嘴里反复哼着半句摇篮曲。\n“它以前是罪犯，”奎尔-7神甫说，“或者欠债的。区别不大。机魂需要双手。”",
            "Two days out of dock, in the troopship hangar, a servitor hauls ammo crates, humming half a lullaby over and over.\n“It was a criminal once,” says Tech-Priest Quell-7. “Or a debtor. The difference is small. The machine spirit needs hands.”"),
    codex: ["imp_servitor", "imp_mechanicus", "place_imp_troopship"],
    choices: [
      C("哼出摇篮曲的下一句", "Hum the next line of the lullaby", "imp_206", {effects: {sanity: -5, set: {lullaby: true}}, result: L("那首歌你母亲唱过。旋律自己从喉咙里爬了出来。", "Your mother used to sing it. The tune climbs out of your throat on its own.")}),
      C("请神甫祝福你的枪", "Ask the priest to bless your gun", "imp_207")
    ]};

  N.imp_206 = {chapter: 2, scene: "ship_interior", speaker: S("servitor", "机仆", "Servitor"), time: {h: 1},
    text: L("你哼出下一句。机仆停住了，箱子悬在半空。\n它转过那张缝合过的脸，看了你很久。\n然后它继续搬箱子，哼的还是那半句。",
            "You hum the next line. The servitor stops, the crate hanging in mid-air.\nIt turns its stitched face toward you and stares for a long time.\nThen it goes back to work, humming the same half-line."),
    choices: [
      C("走开", "Walk away", "imp_208", {result: L("你走出机库很远，那半句调子还在耳朵里打转。", "You're far from the hangar, and the half-tune is still circling in your ears.")})
    ]};

  N.imp_207 = {chapter: 2, scene: "ship_interior", speaker: QUELL, time: {h: 1},
    alt: [ADD(F("fixedHarvester"), "“你修过收割机？”他的镜头转向你，“它记得你。机器都记得。”", "“You mended a harvester?” His lens whirs toward you. “It remembers you. Machines remember.”")],
    text: L("“机器不会坏，只会生气。”奎尔-7往你的枪托上抹了一道圣油，念了三句二进制祷文。\n“现在它原谅你上次摔了它。”\n他看起来是认真的。",
            "“Machines do not break. They grow angry.” Quell-7 dabs sacred oil on your stock and recites three lines of binary prayer.\n“Now it forgives you for dropping it.”\nHe seems entirely serious."),
    effects: {renown: 3, set: {blessedGun: true}},
    choices: [
      C("谢谢神甫", "Thank the priest", "imp_208")
    ]};

  N.imp_208 = {chapter: 2, scene: "warp", speaker: null, time: {d: 30, warp: true}, eventRoll: 0.49,
    jump: L("亚空间跃迁，船上的日历不再可信", "A warp jump; the ship's calendar stops meaning much"),
    text: L("跃迁警报响了。舷窗全部封死。\n你仍然听见有东西在外面敲船壳，很有礼貌，像在问能不能进来。\n铺位上的老兵用被子蒙住头：“别回答。千万别回答。”",
            "The warp alarm sounds. Every viewport is shuttered.\nYou still hear something tapping on the hull. Politely. As if asking to be let in.\nAn old trooper pulls the blanket over his head. “Don't answer. Whatever you do, don't answer.”"),
    effects: {sanity: -5},
    codex: ["imp_navigator", "chaos_warp"],
    choices: [
      C("握紧祈祷手册", "Clutch your prayer primer", "imp_209", {effects: {sanity: 5, renown: 2, taint: {all: -5}}, result: L("你一页一页地念，念到嗓子发干。敲门声没停，但你不再听得见它。", "You read page after page until your throat is dry. The knocking never stops, but you stop hearing it.")}),
      C("把耳朵贴上船壳", "Press your ear to the hull", "imp_210", {effects: {sanity: -10, corruption: 5, taint: {tzeentch: 40}}, result: L("船壳冰得像墓碑。敲门声就在你耳朵另一边，一下，又一下，越来越近。", "The hull is cold as a gravestone. The tapping sits just past your ear. Once. Again. Closer.")})
    ]};

  N.imp_210 = {chapter: 2, scene: "warp", speaker: null, time: {h: 3, warp: true},
    text: L("敲门声停了。一个声音用你母亲的语调说：“你冷吗？”\n回过神时，佩尔正死死掐着你的胳膊。\n你的嘴唇在动。你不知道自己刚才答应了什么。",
            "The tapping stops. A voice, in your mother's tone, asks: “Are you cold?”\nWhen you come to, Pell is gripping your arm hard enough to bruise.\nYour lips are moving. You don't know what you just agreed to."),
    effects: {set: {warpWhisper: true}, taint: {tzeentch: 20}},
    choices: [
      C("什么都别说", "Say nothing to anyone", "imp_209", {result: L("佩尔看着你，你摇了摇头。他再也没问过。", "Pell looks at you. You shake your head. He never asks again.")})
    ]};

  N.imp_209 = {chapter: 2, scene: "ship_interior", speaker: VOSK, time: {d: 1}, gather: L("食堂", "Mess"),
    alt: [ADD(F("warpWhisper"), "佩尔端着餐盘，坐到了离你最远的那张桌子。", "Pell takes his tray to the table farthest from yours."),
          ADD(F("giltBook"), "你的金边书第一晚就不见了。没人承认，也没人需要承认。", "Your gilt book vanished the first night. Nobody owned up. Nobody needed to.")],
    text: L("出亚空间时，日历跳了。全连挤在食堂里点名，有人说过了一个月，有人说过了半年。\n沃斯克只问一句：“死了几个？”\n“三个，长官。没人知道怎么死的。”\n“那就是正常航行。”",
            "When the ship drops out of the warp, the calendar jumps. The whole company crowds into the mess for roll call; some say a month has passed, some say six.\nVosk asks one thing. “How many dead?”\n“Three, Sergeant. Nobody knows how.”\n“Then it was a normal voyage.”"),
    effects: {sanity: 5},
    choices: [
      C("准备登陆", "Prepare to land", "imp_300", {result: L("沃斯克看着舷窗外的灰色星球：“打散的绿皮会往海湾那边飘。到时候，就是那边异形的麻烦了。”", "Vosk eyes the grey world through the viewport. “The greenskins we scatter drift off toward the Gulf. Then they're the xenos' problem.”")})
    ]};

  /* ============ Chapter 3 · The Green Tide ============ */
  N.imp_300 = {chapter: 3, scene: "ship_interior", speaker: DRAVIK, time: {d: 3}, bridge: true,
    alt: [ADD(F("blessedGun"), "登艇前，奎尔-7又检查了一遍你的枪，满意地哼了一声。", "Before boarding, Quell-7 checks your rifle once more and hums in approval."),
          ADD(F("warpWhisper"), "佩尔没跟你坐一排。他一路盯着你的嘴唇。", "Pell doesn't sit in your row. He watches your lips the whole way down.")],
    text: L("登陆前一晚，简报室。德拉维克政委指着全息图：“尘落星。兽人的大进军撞上了我们的防线。没有撤退命令。”\n天亮时，登陆艇载着你们穿过灰色的云。",
            "The night before landing, in the briefing room. Commissar Dravik points at the hololith. “Dustfall. An ork Waaagh! has hit our line. There is no order to retreat.”\nAt dawn the landers carry you down through grey cloud."),
    codex: ["place_dustfall", "xenos_waaagh"],
    choices: [
      C("系紧安全带", "Buckle in", "imp_301", {result: L("登陆艇像一块石头往下掉。有人吐了，有人在笑，沃斯克在打盹。", "The lander drops like a stone. Someone throws up, someone laughs, Vosk dozes.")})
    ]};

  N.imp_301 = {chapter: 3, scene: "trench", speaker: VOSK, time: {h: 6},
    text: L("尘落星。战壕里的水没过脚踝，远处传来引擎轰鸣和走调的歌声。\n“兽人在唱歌，”沃斯克说，“说明它们心情很好。”\n她把一颗手雷放进你手里，像给小孩一块糖。",
            "Dustfall. Trench water up to your ankles. Engines roar in the distance, along with off-key singing.\n“Orks singing,” Vosk says. “Means they're in a good mood.”\nShe drops a grenade into your palm like candy for a child."),
    codex: ["xenos_ork"],
    choices: [
      C("守在射击位上", "Take your firing step", "imp_302", {result: L("你把枪架上沙袋，数着准星里晃动的烟尘。", "You rest your rifle on the sandbags and count the dust drifting through your sights.")}),
      C("去补给点多领电池", "Run to the dump for extra power packs", "imp_302", {effects: {hp: -5, set: {extraAmmo: true}}, result: L("你在泥水里跑了个来回，摔了两跤，怀里多了四个电池。军需官骂你的话够写一本书。", "You slog there and back through the mud, falling twice, four extra power packs clutched to your chest. The quartermaster's curses could fill a book.")})
    ]};

  N.imp_302 = {chapter: 3, scene: "trench", speaker: null, foe: "ork", time: {h: 3},
    text: L("它们来了。绿色的潮水，扛着比你还大的枪，边冲边笑。\n你开火。激光枪像手电一样一闪一闪，那东西中了五枪还在跑。\n“打头！”有人喊，“那是它们唯一算得上器官的地方！”",
            "Here they come. A green tide hauling guns bigger than you, laughing as they charge.\nYou fire. Your lasgun blinks like a torch. The thing takes five hits and keeps running.\n“Aim for the head!” someone yells. “It's the only organ they've got!”"),
    effects: {hp: -10},
    choices: [
      C("瞄准头部", "Aim for the head", null, R(0.5, "hp", "imp_304", "imp_305", L("你屏住呼吸，等那颗绿脑袋冲进准星。扣扳机的那一下，手指一点没抖。", "You hold your breath until the green head fills your sights. Your trigger finger doesn't shake at all."), L("你的第一枪打掉了它一只耳朵。它笑得更开心了。", "Your first shot takes off an ear. It only laughs harder."))),
      C("扔出手雷，趴下", "Throw the grenade and drop", "imp_304", {effects: {hp: -10, renown: 2, taint: {khorne: 20}}, result: L("手雷炸开，泥浆和碎片泼了你一背。你抬起头，还有一个绿影在往前冲。", "The grenade bursts; mud and shrapnel rain across your back. When you look up, one green shape is still coming.")})
    ]};

  N.imp_304 = {chapter: 3, scene: "trench", speaker: PELL, foe: "ork", time: {h: 1},
    text: L("兽人倒在你一臂远的地方，倒下前还冲你竖了个大拇指。\n佩尔趴在你旁边，笑得发抖：“它在夸你！它在夸你！”\n你没笑。你的手停不下来。",
            "The ork drops an arm's length away—giving you a thumbs-up on the way down.\nPell lies beside you, shaking with laughter. “It complimented you! It complimented you!”\nYou don't laugh. Your hands won't stop shaking."),
    effects: {renown: 5, sanity: -5},
    alt: [ADD(F("apologizedPell"), "他笑完才想起还在生你的气，别过脸去，嘴角却没放下来。", "Done laughing, he remembers he's still angry with you and looks away—but the grin doesn't quite go."),
          ADD({all: [F("wronged_pell"), NF("apologizedPell")]}, "笑完，他才想起你是谁，脸一沉，往旁边挪开了一截。", "Done laughing, he remembers who you are. His face shuts, and he shifts away.")],
    choices: [
      C("重新装填", "Reload", "imp_306", {result: L("你的手指终于不抖了，正好够把电池按进去。", "Your fingers finally stop shaking, just enough to seat the power pack.")})
    ]};

  N.imp_305 = {chapter: 3, scene: "trench", speaker: VOSK, foe: "ork", time: {h: 1},
    text: L("一把砍刀从烟里劈下来。\n醒来时你躺在战壕底，沃斯克正往你肩膀上倒酒精。\n“帝皇今天不收你，”她说，“嫌你太吵。”",
            "A cleaver swings out of the smoke.\nWhen you wake, you're at the bottom of the trench and Vosk is pouring alcohol on your shoulder.\n“The Emperor doesn't want you today,” she says. “Says you're too loud.”"),
    effects: {hp: -20},
    choices: [
      C("咬牙爬起来", "Grit your teeth and get up", "imp_306")
    ]};

  N.imp_306 = {chapter: 3, scene: "trench", speaker: DRAVIK, foe: "ork_boss", time: {h: 2}, eventRoll: 0.42,
    text: L("一个兽人军阀踏过铁丝网，大得像一座会走路的锅炉。第一排崩了，有人往后跑。\n德拉维克政委站上胸墙，拔出手枪。她没喊口号，只是看着那些逃跑的人。",
            "An Ork warboss stomps over the wire, big as a walking boiler. The front line breaks. Men start running.\nCommissar Dravik steps up onto the parapet and draws her pistol. No slogans. She just watches the ones who run."),
    effects: {sanity: -5},
    codex: ["xenos_ork_warboss"],
    choices: [
      C("冲上去堵缺口", "Charge into the breach", null, R(0.4, "hp", "imp_307", "imp_308", L("你从阵亡者身上抓起手雷，边跑边拧成一捆。军阀没注意到这么小的东西。", "You snatch grenades off the dead and twist them together as you run. The warboss doesn't notice anything so small."), L("冲到它跟前你才发现，自己只到它的腰带。", "You reach it before realising you only come up to its belt."))),
      C("守住原位开火", "Hold your spot and keep firing", "imp_309"),
      C("跟着人群跑", "Run with the others", "imp_310", {effects: {renown: -5}, result: L("你扔下阵地，跟着人群往后挤。没人回头，也没人说话。", "You abandon your post and shove back with the crowd. No one looks back. No one speaks.")})
    ]};

  N.imp_310 = {chapter: 3, scene: "trench", speaker: DRAVIK, time: {h: 1},
    text: L("你跑了二十步，身后一声枪响，身边的人倒下了。\n德拉维克的声音不大，却像贴在你耳边：“下一个。”\n你还来得及停下。",
            "Twenty steps. A shot cracks behind you and the man beside you drops.\nDravik's voice isn't loud, but it's right in your ear. “Next.”\nYou still have time to stop."),
    effects: {sanity: -5},
    choices: [
      C("转身回到阵线", "Turn back to the line", "imp_309", {effects: {set: {wavered: true}}, result: L("你转过身，迎着政委的枪口走回去。那枪口一路跟着你，直到你趴回射击位。", "You turn and walk back into the commissar's sights. Her muzzle follows you all the way to your firing step.")}),
      C("继续跑", "Keep running", null, Object.assign({effects: {set: {fledDustfall: true}}}, R(0.65, null, "imp_311", "imp_end_commissar", L("你翻过土坡，滚进一辆救护车的阴影里。身后又响了一枪，倒下的不是你。", "You vault a ridge and roll into an ambulance's shadow. Another shot cracks behind you. Someone else drops."), L("你跑得很快。你觉得已经够快了。", "You run fast. You think it's fast enough."))))
    ]};

  N.imp_end_commissar = {chapter: 3, scene: "trench", speaker: CHAP, time: {d: 1},
    alt: [ALT({fromNode: ["imp_518"]}, "德拉维克合上了名单。那一声枪响，你没听见。\n第二天的阵亡名单上，你的名字后面写着两个字：怯战。\n随军牧师念到这里没有停顿，语气仍然是感恩的。",
              "Dravik closes the manifest. You never hear the shot.\nOn the next day's casualty list, your name is followed by one word: cowardice.\nThe regimental priest reads it without pausing. He still sounds grateful.")],
    text: L("你没听见第二声枪响。\n第二天的阵亡名单上，你的名字后面写着两个字：怯战。\n随军牧师念到这里没有停顿，语气仍然是感恩的。",
            "You never hear the second shot.\nOn the next day's casualty list, your name is followed by one word: cowardice.\nThe regimental priest reads it without pausing. He still sounds grateful."),
    ending: {kind: "bad", title: L("政委的子弹", "The Commissar's Bullet"), cause: L("临阵脱逃，被政委处决", "Shot for desertion")}};

  N.imp_307 = {chapter: 3, scene: "trench", speaker: DRAVIK, foe: "ork_boss", time: {h: 1},
    text: L("你把集束手雷塞进锅炉般的胸甲缝，然后扑倒。\n爆炸后，军阀的半个头盔落在你脚边。政委看了你一眼，在本子上记了一笔。\n这是第一次有人记住你。",
            "You jam a bundle of grenades into a gap in the boiler-plate armour and dive.\nAfter the blast, half the warboss's helmet lands at your feet. The commissar glances at you and writes something down.\nIt's the first time anyone has remembered you."),
    effects: {renown: 10, set: {hero: true}, taint: {khorne: 30}},
    choices: [
      C("撑着站起来", "Haul yourself up", "imp_311")
    ]};

  N.imp_308 = {chapter: 3, scene: "trench", speaker: null, foe: "ork_boss", time: {h: 1},
    text: L("军阀一巴掌把你扇进弹坑。你听见骨头响，是你自己的。\n最后是坦克把它轰倒的。没人记得你冲过，但医护兵记得你骂的每一句脏话。",
            "The warboss backhands you into a crater. You hear bones crack. Yours.\nIn the end a tank brings it down. Nobody remembers your charge, but the medic remembers every curse you shouted."),
    effects: {hp: -25, renown: 3},
    choices: [
      C("让他们抬你走", "Let them carry you off", "imp_311")
    ]};

  N.imp_309 = {chapter: 3, scene: "trench", speaker: PELL, time: {h: 5},
    grudgeLine: {npc: "pell", text: L("他数到一半才看见你，抿紧嘴，把流血的手往身后藏。", "He sees you halfway through counting, presses his lips together and hides the bleeding hand behind him.")},
    alt: [ALT(F("extraAmmo"), "你守着射击位，换了一个又一个电池。佩尔的打光了，你把多领的四个扔给他。兽人退下去时，天已经黑了。\n佩尔坐在空电池堆里：“七个。我打中了七个。”他的十根手指都还在。",
              "You hold your firing step, swapping pack after pack. When Pell runs dry, you toss him your four spares. When the orks fall back, it's dark.\nPell sits among the spent cells. “Seven. I hit seven.” All ten of his fingers are still there."),
          ADD(F("wavered"), "你趴回射击位时，枪口还在发烫。政委的枪口也是。", "When you drop back onto your step your barrel is still hot. So is the commissar's."),
          ADD(F("pellFriend"), "“贵人，”他咧嘴笑，“你今天打得像个下巢人。”", "“Your lordship,” he grins, “you shot like underhive today.”")],
    text: L("你守着射击位，换了一个又一个电池。兽人退下去时，天已经黑了。\n佩尔坐在空电池堆里掰着手指：“七个。我数了，我打中了七个。”\n他只剩九根手指了。",
            "You hold your firing step, swapping pack after pack. When the orks fall back, it's dark.\nPell sits among the spent cells, counting on his fingers. “Seven. I counted. I hit seven.”\nHe has nine fingers left."),
    effects: {renown: 3, sanity: -5, hp: -5},
    choices: [
      C("帮他包扎", "Bandage his hand", "imp_311", {effects: {sanity: 5}, grudge: {npc: "pell", effects: {sanity: -4}, note: L("佩尔没忘米娜的事；他任你包扎，却不看你。", "Pell hasn't forgotten Mina. He lets you bind the hand, eyes elsewhere.")}, result: L("你撕下袖子给他缠手。他一直在数，数到七就从头再来。", "You tear off your sleeve to bind his hand. He keeps counting, starting over every time he reaches seven."),
        resultAlt: [{if: F("extraAmmo"), text: L("他只是擦破了皮。你还是给他缠上了，他笑你小题大做。", "It's only a graze. You bind it anyway; he laughs at the fuss.")}]})
    ]};

  N.imp_311 = {chapter: 3, scene: "barracks", speaker: ARNO, time: {d: 2}, gather: L("野战医院", "Field hospital"),
    alt: [ADD(F("hero"), "德拉维克来过病房，在你床头放了半包烟，一句话没说。", "Dravik came by the ward, left half a pack of lho-sticks by your bed, and said nothing."),
          ADD(F("fledDustfall"), "政委在帐篷门口站了很久。她认得你的背影。", "The commissar stands at the tent flap a long while. She knows your back."),
          ],
    text: L("战后第二天，野战医院。伤兵挤满了帐篷，阿诺医师给你缝针，嘴里叼着一根没点着的烟。\n“兽人死了会撒孢子，”他说，“明年这里会长出更多兽人。我们不是在打仗，是在除草。”",
            "Two days after the battle, the field hospital. Wounded men fill the tent. Medicae Arno stitches you up, an unlit lho-stick between his teeth.\n“Orks shed spores when they die,” he says. “Next year, more grow right here. We're not fighting a war. We're weeding.”"),
    effects: {hp: 25},
    codex: ["xenos_ork"],
    choices: [
      C("好好睡一觉", "Get some real sleep", "imp_400", {effects: {sanity: 10}, result: L("你睡了整整十四个小时，没有做梦。醒来时，邻床已经换了三个人。", "You sleep fourteen hours straight, dreamless. When you wake, the next bed has had three different occupants.")}),
      C("多要点止痛药", "Ask for extra painkillers", "imp_400", {effects: {hp: 10, sanity: -5, set: {painkillers: true}, taint: {nurgle: 25}}, result: L("阿诺多给了你两支。疼痛退得很远，远到这副身体好像不是你的。", "Arno slips you two extra. The pain drifts so far away the body no longer feels like yours.")})
    ]};

  /* ============ Chapter 4 · Whispers in the Rain ============ */
  N.imp_400 = {chapter: 4, scene: "ship_interior", speaker: PELL, time: {y: 1}, bridge: true, eventRoll: 0.42,
    jump: L("一年后：尘落星战线稳住，团被调往维瑟尔", "A year later: the Dustfall line holds; the regiment is moved to Vessel"),
    alt: [ADD(F("painkillers"), "止痛药早就停了。夜里，你的手还在找那支针。", "The painkillers stopped long ago. At night your hand still goes looking for the needle."),
          ADD(F("hero"), "有人传你要升职。政委的本子上，你名字后面画了一颗星。", "Word is you'll be promoted. In the commissar's book there's a star by your name.")],
    text: L("一年过去了。尘落星的战线稳住，团里换了三拨新兵，你已经能闭着眼拆枪。\n运兵舰又一次跃迁，把全团送去雨城维瑟尔驻防、休整。佩尔说那里的雨是甜的。",
            "A year goes by. The Dustfall line holds; three batches of recruits come and go, and you can strip your lasgun blindfolded.\nThe troopship jumps again, carrying the regiment to garrison and rest in Vessel, the city of rain. Pell says the rain there is sweet."),
    choices: [
      C("望着封死的舷窗", "Stare at the shuttered viewport", "imp_401", {result: L("跃迁很平静。出来时，舷窗外是一颗灰蓝色、永远在下雨的星球。", "The jump is calm. When the shutters lift, outside is a blue-grey world where it never stops raining.")})
    ]};

  N.imp_401 = {chapter: 4, scene: "ruins", speaker: BRIN, time: {d: 2}, gather: L("施汤队伍", "Soup line"),
    text: L("雨城维瑟尔。城里人很和善，太和善了。布琳婆婆每天在广场施汤，从不收钱，士兵和市民排成长长的施汤队伍。\n排在你后面的女人，一直在指间转一枚旧硬币。",
            "Vessel, the city of rain. The locals are kind. Too kind. Every day Old Brin ladles soup in the square for free, and soldiers and townsfolk form a long soup line.\nThe woman behind you in the line keeps turning an old coin across her fingers."),
    effects: {sanity: 15, hp: 10},
    codex: ["place_vessel"],
    choices: [
      C("喝下那碗汤", "Drink the soup", "imp_402", {effects: {hp: 5, corruption: 5, set: {drankSoup: true}, taint: {nurgle: 25}}, result: L("你接过碗。布琳在你身边坐下，看着你喝，像看着自己的孩子。", "You take the bowl. Brin sits beside you and watches you drink, like a mother watching her child.")}),
      C("趁她不注意倒掉", "Pour it out when she isn't looking", "imp_403", {result: L("你端着碗走到墙角。转硬币的女人看着你，什么也没说。", "You carry the bowl to a corner. The woman with the coin watches you and says nothing.")})
    ]};

  N.imp_402 = {chapter: 4, scene: "hive_hab", speaker: BRIN, time: {h: 1}, eventRoll: 0.3,
    text: L("汤很好喝，带点铁锈味。布琳握着你的手：“孩子，你的帝皇在金椅子上坐了一万年，看过你一眼吗？”\n她笑了，“我们的神会看你。”",
            "The soup is good, with a hint of rust. Brin holds your hand. “Child, your Emperor has sat on a golden chair for ten thousand years. Has he ever looked at you once?”\nShe smiles. “Our gods will.”"),
    codex: ["chaos_cult"],
    choices: [
      C("她说得……有点道理", "She... has a point", "imp_404", {effects: {corruption: 10, taint: {nurgle: 40}, set: {cultTouched: true}}, result: L("你没有抽回手。布琳笑得更深了：“今晚来地窖，带上你的问题。”", "You don't pull your hand away. Brin's smile deepens. “Come to the cellar tonight. Bring your questions.”")}),
      C("去报告政委", "Report this to the commissar", "imp_405", {result: L("你放下碗，径直去找政委。她听完，只点了一下头。", "You set down the bowl and go straight to the commissar. She hears you out and nods, once.")})
    ]};

  N.imp_403 = {chapter: 4, scene: "ruins", speaker: null, time: {h: 2}, eventRoll: 0.3,
    text: L("你把汤倒进排水沟。一只老鼠喝了几口，没死，反而长出了第三只眼睛，好奇地看着你。\n你决定今晚不睡了。",
            "You pour the soup into the gutter. A rat laps at it. It doesn't die. It grows a third eye and watches you, curious.\nYou decide not to sleep tonight."),
    effects: {sanity: -5},
    codex: ["chaos_mutant"],
    choices: [
      C("跟踪布琳", "Follow Brin", "imp_404"),
      C("去报告政委", "Report this to the commissar", "imp_405", {result: L("你找到政委，说了老鼠和那第三只眼。她没笑。", "You find the commissar and tell her about the rat and its third eye. She doesn't laugh.")})
    ]};

  N.imp_404 = {chapter: 4, scene: "cult_shrine", speaker: S("cult_magus", "镜面人", "The Mirrored Man"), time: {h: 6},
    text: L("你跟着布琳下了地窖。烛光里，几十个人念着一个你听不懂的名字，像一个人在说话。\n台上的人戴着镜面面具：“欢迎。你一直在听，对吗？在船上，那个敲门声。”",
            "You follow Brin down into a cellar. By candlelight dozens chant a name you can't parse, all in one voice.\nThe figure on the dais wears a mirrored mask. “Welcome. You've been listening, haven't you? On the ship. The knocking.”"),
    effects: {sanity: -5, corruption: 5, set: {sawShrine: true}},
    alt: [ADD(F("cultTouched"), "布琳一直握着你的手，把你领到了最前排。", "Brin keeps hold of your hand and leads you to the front row.")],
    choices: [
      C("接过他递来的匕首", "Take the dagger he offers", "imp_407", {effects: {corruption: 10, taint: {tzeentch: 40}, set: {cultist: true}}, result: L("你伸出手。念诵声戛然而止，几十双眼睛同时转向你。", "You reach out. The chanting stops dead, and dozens of eyes turn to you at once.")}),
      C("假装入会，打探消息", "Pretend to join and gather intel", "imp_408", {result: L("你学着他们的样子低下头。镜面人看了你很久，面具里映着你自己的脸。", "You bow your head like the rest. The Mirrored Man studies you a long time; his mask shows you your own face.")}),
      C("转身冲出地窖", "Turn and bolt from the cellar", "imp_405", {effects: {sanity: -5}, result: L("你撞翻蜡烛冲上台阶，没人追，他们只是一起笑了一声。你一路跑到政委的帐篷前。", "You knock over candles and bolt up the stairs. Nobody follows; they just laugh, once, all together. You run all the way to the commissar's tent.")})
    ]};

  N.imp_407 = {chapter: 4, scene: "cult_shrine", speaker: S("cult_magus", "镜面人", "The Mirrored Man"), time: {h: 3},
    text: L("匕首很轻，像本来就是你的。\n“明晚换岗时，有朋友从天上来，”镜面人说，“你只需要打开城门。”\n你的旧伤不疼了。一点都不疼了。",
            "The dagger is light, as if it was always yours.\n“Tomorrow at the change of watch, friends come from the sky,” says the Mirrored Man. “You need only open the gate.”\nYour old wounds stop aching. Not even a twinge."),
    effects: {hp: 20, corruption: 5, taint: {tzeentch: 20}},
    choices: [
      C("去开城门", "Go and open the gate", "imp_410", {result: L("换岗的钟声响了。你把匕首藏进袖子走向城门，雨水冲掉了你的脚印。", "The watch bell tolls. You tuck the dagger up your sleeve and walk to the gate. The rain washes away your footprints.")}),
      C("把匕首交给政委", "Hand the dagger to the commissar", "imp_405", {effects: {sanity: -5, set: {confessed: true}}, result: L("你把匕首放在政委桌上。它在木头上烫出了一道焦痕。", "You lay the dagger on the commissar's desk. It leaves a scorch mark in the wood.")})
    ]};

  N.imp_408 = {chapter: 4, scene: "cult_shrine", speaker: null, time: {d: 5},
    text: L("你学会了他们的手势和祷词。白天擦枪，夜里念那个名字。每念一次，你就忘掉一点母亲的脸。\n第五晚，有人在你耳边说：“审判庭想见你。别回头。”",
            "You learn their signs and prayers. By day you clean your rifle; by night you chant the name. Each time, a little more of your mother's face fades.\nOn the fifth night someone whispers: “The Inquisition wants a word. Don't turn around.”"),
    effects: {corruption: 10, sanity: -5, renown: 5, taint: {tzeentch: 15}},
    choices: [
      C("不回头，跟他走", "Don't turn. Follow.", "imp_412", {effects: {set: {spy: true, inqCoin: true, wronged_brin: true}}, result: L("那人往你手心塞了一枚旧硬币：“天亮前带路。”等你回头，巷子里只剩下雨。要去的是布琳的地窖。", "The stranger presses an old coin into your palm. “Lead the way before dawn.” When you turn, there's only rain. The place is Brin's cellar.")})
    ]};

  N.imp_405 = {chapter: 4, scene: "cathedral", speaker: HAAK, time: {h: 4},
    alt: [ALT(F("confessed"), "政委一言不发，把匕首和你一起带进大教堂的告解室。里面坐着的不是神父。\n“哈克审判官。”她转着一枚旧硬币——你在施汤队伍里见过它，“说说那把匕首。慢慢说。”",
              "The commissar says nothing. She brings you and the dagger to the cathedral confessional. The one inside is no priest.\n“Inquisitor Haak.” She turns an old coin, the one you saw in the soup line. “Tell me about the dagger. Slowly.”")],
    text: L("政委一言不发，把你带进大教堂的告解室。里面坐着的不是神父。\n“哈克审判官。”她转着一枚旧硬币——你在施汤队伍里见过它，“说说那碗汤。慢慢说。”",
            "The commissar says nothing. She walks you to the cathedral confessional. The one waiting inside is no priest.\n“Inquisitor Haak.” She turns an old coin, the one you saw in the soup line. “Tell me about the soup. Slowly.”"),
    codex: ["imp_inquisition"],
    choices: [
      C("全说出来", "Tell her everything", "imp_412", {effects: {renown: 5, taint: {all: -10}, set: {toldInq: true, wronged_brin: true}}, result: L("你说了汤、地窖、布琳的名字，还有那个念不出的名字。哈克一直在转硬币，直到你说完才停。", "You tell her about the soup, the cellar, Brin's name, the name you can't pronounce. Haak spins her coin the whole time, stopping only when you finish."),
        resultAlt: [{if: NF("sawShrine"), text: L("你说了汤、布琳的名字，还有那只长出第三只眼的老鼠。哈克听完，硬币停了：“地窖在哪儿，我们自己去找。”", "You tell her about the soup, Brin's name, the rat with the third eye. Haak's coin stops. “We'll find the cellar ourselves.”")}]}),
      C("隐瞒自己喝过的部分", "Leave out the part where you drank it", null, Object.assign({require: {flag: "drankSoup"}, hideIfLocked: true}, R(0.6, null, "imp_412", "imp_411", L("你讲得滴水不漏。哈克的硬币顿了一下，又接着转。", "Your story is airtight. Haak's coin pauses once, then spins on."), L("讲到一半，那股铁锈味又涌上了喉咙。哈克的硬币停住了。", "Halfway through, the rust taste rises in your throat again. Haak's coin stops spinning."))))
    ]};

  N.imp_410 = {chapter: 4, scene: "burning_city", speaker: HAAK, time: {h: 20},
    text: L("你的手刚碰到门闩，探照灯就亮了。哈克审判官坐在城墙上晃着腿。\n“谢谢，”她说，“我等这扇门打开等了三周。”\n士兵们举起了枪。佩尔也在里面。",
            "Your hand touches the gate bar and the floodlights snap on. Inquisitor Haak sits on the wall, swinging her legs.\n“Thank you,” she says. “I've waited three weeks for someone to open this door.”\nRifles rise. Pell is among them."),
    effects: {sanity: -5},
    codex: ["imp_inquisition"],
    choices: [
      C("跪下认罪", "Kneel and confess", "imp_411", {effects: {set: {caughtAtGate: true}}, result: L("你扔下匕首，跪进泥水里。佩尔的枪口垂下一寸，又抬了起来。", "You drop the dagger and kneel in the mud. Pell's rifle dips an inch, then rises again.")}),
      C("拔出匕首", "Draw the dagger", "imp_end_heretic", {result: L("雨忽然停了。", "The rain stops, all at once.")})
    ]};

  N.imp_end_heretic = {chapter: 4, scene: "burning_city", speaker: null, time: {h: 1},
    text: L("匕首在你手里尖叫，像终于等到了这一刻。\n后来，维瑟尔的人只记得那晚城门口烧起了一堆火，颜色很奇怪。\n佩尔没有开枪。他闭上了眼睛。",
            "The dagger shrieks in your hand, as if it had waited for this moment.\nAfterward, the people of Vessel remember only a fire at the gate that night, burning an odd colour.\nPell didn't fire. He closed his eyes."),
    ending: {kind: "bad", title: L("城门之火", "Fire at the Gate"), cause: L("持邪刃反抗，焚于城门", "Burned at the gate as heretic")}};

  N.imp_411 = {chapter: 4, scene: "cathedral", speaker: HAAK, time: {h: 6},
    text: L("哈克蹲下来，盯着你的眼睛，像在读一份很长的报告。\n“你还有用，”她终于说，“只是不需要带着脑子用。”\n她朝机械神教的人点了点头。",
            "Haak crouches and studies your eyes like a long report.\n“You're still useful,” she says at last. “Just not with your mind attached.”\nShe nods to the Mechanicus adepts."),
    effects: {sanity: -5},
    choices: [
      C("求她再给一次机会", "Beg for one more chance", null, R(0.6, "renown", "imp_411b", "imp_end_servitor", L("你把这辈子做过的好事全说了一遍。哈克叹了口气，挥手让神甫们退下。", "You list every good deed of your life. Haak sighs and waves the adepts back."), L("哈克耐心听完，看了看时间。神甫们已经在量你的头围了。", "Haak hears you out patiently, then checks the time. The adepts are already measuring your skull."))),
      C("供出你知道的一切", "Give up everything you know", "imp_412", {effects: {sanity: -10, renown: -5, set: {informer: true, wronged_brin: true}}, result: L("你说出了地窖的位置，还有布琳的名字。说完，你觉得自己轻了一点，也脏了一点。", "You give up the cellar, and Brin's name. Afterward you feel a little lighter, and a little filthier."),
        resultAlt: [{if: NF("sawShrine"), text: L("你说出了布琳的名字。哈克的人当晚就跟上了她，找到了她的地窖。", "You give up Brin's name. Haak's people tail her that night and find her cellar.")}]})
    ]};

  N.imp_411b = {chapter: 4, scene: "cathedral", speaker: HAAK, time: {h: 1},
    text: L("哈克让神甫们退下，却没让你站起来。\n“你会活着，因为我需要一个他们信任的人。”她把一块烧红的印按在你后颈，“你带路。从今往后，你的命是我手里的绳子。”",
            "Haak waves the adepts back, but doesn't let you rise.\n“You'll live, because I need someone they trust.” She presses a red-hot seal to the back of your neck. “You lead the way. From now on your life is a leash in my hand.”"),
    effects: {hp: -5, set: {haakLeash: true}},
    choices: [
      C("带路", "Lead the way", "imp_412", {result: L("你站起来时，烙印还在冒烟。你没有喊。", "When you stand, the brand is still smoking. You don't cry out.")})
    ]};

  N.imp_end_servitor = {chapter: 4, scene: "ship_interior", speaker: S("servitor", "机仆", "Servitor"), time: {y: 3},
    alt: [ADD(F("lullaby"), "有时它会哼出下一句，然后停住，像想起了谁。", "Sometimes it hums the next line, then stops, as if remembering someone.")],
    text: L("很多年后，某艘运兵舰的机库里，一个机仆在搬弹药箱。\n它一直哼着半句摇篮曲，没人接得上下一句。\n偶尔有新兵停下来看它，好像认出了什么。",
            "Years later, in a troopship hangar, a servitor hauls ammunition crates.\nIt hums half a lullaby, over and over. No one can supply the next line.\nNow and then a new recruit stops and stares, as if recognising something."),
    ending: {kind: "bad", title: L("机魂需要双手", "The Machine Needs Hands"), cause: L("被改造成机仆", "Rebuilt as a servitor")}};

  N.imp_412 = {chapter: 4, scene: "cult_shrine", speaker: HAAK, foe: "cult_magus", time: {h: 6},
    text: L("黎明前，审判庭的人冲进地窖，你在前面带路。\n镜面人没逃，反而笑了：“你以为她是来救你们的？她会烧掉整座城，连雨一起。”\n哈克一枪打碎了那面镜子。",
            "Before dawn, Inquisition storm-troopers hit the cellar. You lead the way.\nThe Mirrored Man doesn't run. He laughs. “You think she's here to save you? She'll burn the whole city, rain and all.”\nHaak's shot shatters the mirror."),
    effects: {renown: 5, sanity: -5},
    codex: ["imp_inquisition"],
    alt: [ADD(F("spy"), "镜面人认出了你：“你也念过那个名字。你会想它的。”", "The Mirrored Man knows you. “You chanted the name too. You'll miss it.”"),
          ADD(F("haakLeash"), "哈克的人跟在你身后三步，枪口没离开过你的后颈。", "Haak's men keep three paces behind you, muzzles never leaving the back of your neck.")],
    choices: [
      C("搜查祭坛", "Search the altar", "imp_413"),
      C("趁乱把布琳推出地窖后门", "Shove Brin out the cellar's back door", "imp_415", {require: {flag: "wronged_brin"}, hideIfLocked: true, effects: {sanity: -3, renown: -5, taint: {nurgle: 12}, set: {forgiven_brin: true}}, result: L("你在人群里认出那条旧头巾，把她推向后门。她回头看了你一眼，没说话，也没道谢。", "You spot the old headscarf in the crush and shove her toward the back door. She looks back once. She says nothing, not even thanks.")}),
      C("去追逃散的信徒", "Chase the scattering faithful", "imp_415", {effects: {hp: -10, renown: 3, taint: {khorne: 25}}, result: L("你在雨里追了三条街，胳膊挨了一菜刀。抓到的那个人，嘴里还在念那个名字。", "You chase them three streets through the rain and take a kitchen knife across the arm. The one you catch is still chanting that name.")})
    ]};

  N.imp_413 = {chapter: 4, scene: "cult_shrine", speaker: HAAK, time: {h: 1},
    text: L("祭坛上刻着一颗八芒星，每道芒尖渗出不同的颜色：血红、腐绿、幻蓝、艳紫。\n你盯得太久，颜色开始盯着你。哈克捂住你的眼睛：“别数。数完了，你就是他们的了。”",
            "The altar bears an eight-pointed star, each ray bleeding a colour: blood red, rot green, shifting blue, lurid violet.\nYou stare too long. The colours stare back. Haak covers your eyes. “Don't count them. Finish counting and you're theirs.”"),
    effects: {sanity: -5, corruption: 3, set: {sawAltar: true}, taint: {all: 10}},
    codex: ["chaos_gods"],
    choices: [
      C("闭上眼，退后", "Close your eyes and step back", "imp_415", {result: L("你闭上眼往后退，差点绊倒。眼皮里，那些颜色还在一圈圈地转。", "You shut your eyes and step back, nearly stumbling. Behind your eyelids, the colours keep turning.")})
    ]};

  N.imp_415 = {chapter: 4, scene: "burning_city", speaker: HAAK, time: {d: 2},
    alt: [ADD({all: [F("caughtAtGate"), NF("haakLeash")]}, "她看着你：“你开过一次门。我会记着。”", "She looks at you. “You opened a door once. I'll remember.”"),
          ADD(F("haakLeash"), "她没给你硬币，只按了按你颈后的烙印：“绳子在我手里。”", "She gives you no coin. She only presses the brand on your neck. “The leash is in my hand.”")],
    text: L("两天后，维瑟尔上城区被封锁了。哈克说“净化”，政委说“必要”，没人说“烧”。\n“他们天上的朋友也来了，”哈克说，“被我们打了下来。船身上画着一只睁开的眼。”",
            "Two days later Vessel's upper districts are sealed. Haak says “purged.” The commissar says “necessary.” Nobody says “burned.”\n“Their friends from the sky came too,” Haak says. “We shot them down. The hull bore an open eye.”"),
    effects: {sanity: -5},
    choices: [
      C("接住她弹来的硬币", "Catch the coin she flips you", "imp_500", {require: {notFlag: "haakLeash"}, hideIfLocked: true, effects: {set: {inqCoin: true}}, result: L("“你眼神不错。哪天我需要一双眼睛，会来找你。”硬币比看上去沉，你把它缝进了军服内衬。", "“You've got good eyes. Some day I'll need a pair.” The coin is heavier than it looks. You sew it into your tunic lining."),
        resultAlt: [{if: F("spy"), text: L("“你在他们中间待了五晚，还能回来。”她又弹来一枚，跟巷子里那枚一模一样，“哪天我需要一双眼睛，会来找你。”", "“Five nights among them, and you came back.” She flips you another coin, twin to the one from the alley. “Some day I'll need a pair of eyes.”")},
                    {if: F("informer"), text: L("“你说出了名字。这比勇敢更难。”她弹来硬币，“哪天我需要一双眼睛，会来找你。”", "“You gave up a name. That's harder than courage.” She flips you the coin. “Some day I'll need eyes.”")},
                    {if: F("sawAltar"), text: L("“你没数完那些颜色。很好。”她弹来硬币，“哪天我需要一双眼睛，会来找你。”", "“You didn't finish counting the colours. Good.” She flips you the coin. “Some day I'll need eyes.”")},
                    {if: F("toldInq"), text: L("“你一个字都没漏。”她弹来硬币，“哪天我需要一双眼睛，会来找你。”你把它缝进了内衬。", "“You left nothing out.” She flips you the coin. “Some day I'll need eyes.” You sew it into your lining.")}]}),
      C("让硬币落进火里", "Let the coin fall into the fire", "imp_500", {require: {notFlag: "haakLeash"}, hideIfLocked: true, effects: {sanity: 5, set: {inqCoin: false, refusedHaak: true}}, result: L("硬币在火里翻了个身。哈克看着它，又看了你一眼，像记下了一个名字。", "The coin flips once in the flames. Haak watches it, then you, as if noting down a name.")}),
      C("低下头", "Bow your head", "imp_500", {require: {flag: "haakLeash"}, hideIfLocked: true, effects: {sanity: -5}, result: L("你低下头。烙印还在疼，一跳一跳，像第二颗心。", "You bow your head. The brand throbs like a second heart.")})
    ]};

  /* ============ Chapter 5 · The Shadow ============ */
  N.imp_500 = {chapter: 5, scene: "ship_interior", speaker: VOSK, time: {d: 3}, bridge: true,
    alt: [ADD(F("origin_agri"), "“什一税”三个字，让你想起父亲握紧又松开的镰刀。", "The word “tithe” makes you think of Father's sickle, gripped and let go."),
          ADD(F("haakLeash"), "灰大衣的女人看了一眼你后颈的烙印，在本子上写了一笔。", "The grey-coated woman glances at the brand on your neck and writes something down.")],
    effects: {sanity: 5},
    text: L("离开维瑟尔第三天，简报室。沃斯克敲着星图：“赫斯珀，粮仓星。三个月没交什一税，也没回过一句话。我们去看看为什么。”\n后排坐着一个穿灰大衣的女人，一直在记笔记。",
            "Three days out from Vessel, the briefing room. Vosk taps the star chart. “Hesper. Agri-world. Three months without a tithe, or a word. We're going to find out why.”\nIn the back row sits a woman in a grey coat, taking notes the whole time."),
    choices: [
      C("问灰大衣的女人是谁", "Ask who the grey-coated woman is", "imp_501", {result: L("沃斯克没回头：“审判庭的人。别问第二遍。”", "Vosk doesn't turn round. “Inquisition staff. Don't ask twice.”")})
    ]};

  N.imp_501 = {chapter: 5, scene: "warp", speaker: S("psyker", "领航员", "The Navigator"), time: {d: 50, warp: true}, eventRoll: 0.49,
    jump: L("亚空间跃迁，船上的日历又跳了", "A warp jump; the ship's calendar skips again"),
    text: L("第三次跃迁。这一次亚空间很安静，静得不对劲。\n领航员从舱室里走出来，眼角淌着血，只说了一句：“有个影子挡住了光。很大，很饿。”\n然后他再也没开过口。",
            "The third jump. This time the warp is quiet. Wrongly quiet.\nThe Navigator steps out of his chamber, blood at the corners of his eyes, and says one thing: “A shadow is blocking the light. Huge. Hungry.”\nHe never speaks again."),
    effects: {sanity: -5},
    codex: ["xenos_shadow_in_warp"],
    choices: [
      C("抵达赫斯珀", "Arrive at Hesper", "imp_502", {result: L("出亚空间时，舷窗外是一颗金黄色的星球，安静得像一幅画。", "When you drop out, the viewport shows a golden world, quiet as a painting.")})
    ]};

  N.imp_502 = {chapter: 5, scene: "jungle", speaker: VOSK, time: {d: 2},
    text: L("赫斯珀农业星。麦田一望无际，村庄完好，人却少得吓人。剩下的人很友善，身材矮壮，眼神整齐划一。\n“他们笑得一模一样，”沃斯克低声说，“我不喜欢一模一样的东西。”",
            "Hesper, an agri-world. Endless wheat. Villages intact, but far too few people. Those left are friendly and stocky, their eyes moving in unison.\n“They all smile the same,” Vosk mutters. “I don't like things that are the same.”"),
    codex: ["place_hesper"],
    choices: [
      C("去村里的礼拜堂看看", "Check the village chapel", "imp_503"),
      C("去谷仓搜索", "Search the granary", "imp_504"),
      C("掰开一株麦穗看看", "Split open an ear of wheat", "imp_504", {require: {flag: "origin_agri"}, hideIfLocked: true, effects: {sanity: -3, renown: 2}, result: L("麦粒是空的。这片地种了一整季，却没人收割。谷仓的门虚掩着，里面有动静。", "The ear is empty. A whole season grown, and nobody has harvested it. The granary door stands ajar; something moves inside.")})
    ]};

  N.imp_503 = {chapter: 5, scene: "cathedral", speaker: S("preacher", "年轻神父", "Young Priest"), time: {h: 2},
    text: L("礼拜堂的帝皇像被人改过：多了一对手臂，背后画着一颗坠落的星。\n年轻的神父额头有点过高。“救主要来了，”他温柔地说，“从星星上来。我们会被接回家。”",
            "The Emperor's statue in the chapel has been altered: an extra pair of arms, a falling star painted behind it.\nThe young priest's forehead is a little too high. “The saviours are coming,” he says gently. “From the stars. They'll take us home.”"),
    effects: {sanity: -5},
    choices: [
      C("接受他的祝福", "Accept his blessing", "imp_505", {result: L("你低下头。神父按住你的肩，他的手很软，指甲却很长。", "You bow your head. The priest grips your shoulder. His palm is soft. His nails are very long.")}),
      C("退出去报告", "Back out and report", "imp_506", {result: L("你一步步退出礼拜堂。神父没拦你，只是一直在笑。", "You back out of the chapel step by step. The priest doesn't stop you. He just keeps smiling.")})
    ]};

  N.imp_504 = {chapter: 5, scene: "jungle", speaker: null, foe: "genestealer", time: {h: 2},
    text: L("谷仓深处窸窸窣窣。手电照到一只四臂的东西，紫色甲壳，爪子像镰刀。\n它没有扑过来，只是歪了歪头，像在判断你是食物，还是家人。",
            "Something rustles deep in the granary. Your lamp finds a four-armed thing: violet carapace, claws like scythes.\nIt doesn't pounce. It tilts its head, as if deciding whether you're food or family."),
    effects: {sanity: -5},
    codex: ["xenos_genestealer"],
    choices: [
      C("开火", "Open fire", null, R(0.45, "hp", "imp_506", "imp_507", L("激光连射，紫色甲壳冒起青烟。它尖叫一声，钻进地板下不见了。", "Las-bolts hammer the violet carapace until it smokes. It shrieks and vanishes beneath the floorboards."), L("你扣下扳机。它比激光还快。", "You squeeze the trigger. It moves faster than the light."))),
      C("一步一步后退", "Back away, step by step", "imp_506", {effects: {sanity: -5}, result: L("你一步一步退出谷仓。它一直歪着头看你，直到门板合上。", "You back out one step at a time. It watches, head tilted, until the door swings shut.")})
    ]};

  N.imp_505 = {chapter: 5, scene: "cathedral", speaker: S("preacher", "年轻神父", "Young Priest"), time: {h: 1},
    text: L("祭坛后的黑暗里，有什么东西俯下身来。后颈刺了一下，像被虫子咬。一阵暖意涌遍全身。\n“现在你是家人了，”神父说。\n你有点困。周围的人都在冲你笑，一模一样的笑。",
            "In the dark behind the altar, something leans down over you. The back of your neck pricks, like an insect bite. Warmth floods through you.\n“Now you're family,” the priest says.\nYou feel drowsy. Everyone around you smiles at you. The very same smile."),
    effects: {sanity: -5, hp: -5, set: {kissed: true}},
    codex: ["xenos_genestealer"],
    choices: [
      C("就睡一会儿", "Just rest a moment", null, R(0.65, "sanity", "imp_506", "imp_end_brood", L("你梦见一颗星坠向麦田，尖叫着醒来，人已经在村子外面。你不记得自己是怎么跑出来的。", "You dream of a star falling on the wheat and wake screaming, already outside the village. You don't remember running."), L("你睡得很沉。梦里有人一遍遍摸着你的头发，叫你“家人”。", "You sleep deeply. In the dream, someone strokes your hair over and over, calling you “family.”"))),
      C("咬破舌头，撞门逃走", "Bite your tongue and break for the door", "imp_506", {effects: {hp: -10}, result: L("血腥味让你清醒过来。你撞开木门，一路跑到看见营地的灯。身后的人还在笑。", "The taste of blood snaps you awake. You smash through the door and run until you see camp lights. Behind you, they're still smiling.")})
    ]};

  N.imp_end_brood = {chapter: 5, scene: "jungle", speaker: null, foe: "genestealer", time: {h: 40},
    text: L("你没有回营地。四十个小时里，他们给你换上干净衣服，叫你“家人”。你从没这么安心过。\n天黑时，紫色的天上落下无数颗星星。你和家人们一起走进麦田，张开双臂迎接。",
            "You never go back to camp. For forty hours they give you clean clothes and call you “family.” You have never felt so safe.\nAt nightfall countless stars fall from a violet sky. You walk into the wheat with your family and open your arms to welcome them."),
    ending: {kind: "bad", title: L("一家人", "Family"), cause: L("受基因窃取者感染", "Kissed by a genestealer")}};

  N.imp_507 = {chapter: 5, scene: "jungle", speaker: PELL, foe: "genestealer", time: {h: 1},
    alt: [ADD({all: [F("wronged_pell"), NF("forgiven_pell")]}, "松手时他补了一句：“米娜的事，不算在里面。”", "As he lets go he adds, “Mina's not part of the deal.”")],
    text: L("你开了两枪，第三枪还没扣下，它已经扑到眼前。\n是佩尔把你拖了出来。你胸口多了三道口子，他胳膊少了一块肉。\n“这下扯平了，”他喘着气，“那杯咖啡的事。”",
            "You get two shots off. Before the third, it's in your face.\nPell drags you out. You've three new gashes across your chest; he's missing a chunk of his arm.\n“Now we're even,” he pants. “For the recaff.”"),
    effects: {hp: -25, set: {pellSavedYou: true}},
    choices: [
      C("撤回营地", "Fall back to camp", "imp_506", {result: L("你们互相架着走回营地，一路上谁也没说话。", "You hold each other up all the way back to camp. Neither of you says a word.")})
    ]};

  N.imp_506 = {chapter: 5, scene: "barracks", speaker: VOSK, time: {h: 3}, gather: L("营地食堂", "Camp mess"),
    alt: [ADD(F("kissed"), "你后颈那个小包一直在痒。你没去挠。", "The little lump on the back of your neck keeps itching. You don't scratch."),
          ADD({fromNode: ["imp_507"]}, "佩尔胳膊上缠着绷带，坐在你对面，一口饭也没吃。", "Pell sits opposite, arm bandaged, not eating.")],
    text: L("你冲进营地食堂，把看见的告诉沃斯克。全排都放下了勺子。她立刻呼叫轨道。\n回电只有一行：“确认虫巢舰队触须，四十小时后抵达。坚守。”\n“坚守，”她重复，“他们总是这么说。”",
            "You burst into the camp mess and tell Vosk what you saw. The whole platoon sets down its spoons. She calls orbit at once.\nThe reply is one line: “Hive-fleet tendril confirmed. Arrival forty hours. Hold.”\n“Hold,” she repeats. “They always say that.”"),
    codex: ["xenos_tyranid"],
    choices: [
      C("挖战壕", "Start digging", "imp_509", {effects: {hp: -5, set: {dugIn: true}}, result: L("你挖了一天一夜，铲柄磨掉了手上一层皮。战壕很深，深得像坟。", "You dig through a day and a night until the shovel strips skin from your palms. The trench is deep. Grave-deep.")}),
      C("去礼拜堂祈祷", "Pray in the chapel", "imp_509", {effects: {sanity: 5, renown: 2, taint: {all: -5}}, result: L("营地礼拜堂里只剩几支蜡烛。你点燃一支，祈祷到它烧完。", "Only a few candles remain in the camp chapel. You light one and pray until it burns out.")})
    ]};

  N.imp_509 = {chapter: 5, scene: "spore_sky", speaker: VOSK, foe: "gaunt", time: {h: 37},
    alt: [ADD(F("dugIn"), "你挖的战壕又深又直，第一波小虫摔进去，再没爬出来。", "Your trench is deep and straight. The first wave of small beasts tumbles in and never climbs out.")],
    text: L("第四十个小时，天空变成紫色。孢子像雪一样落下，麦田半小时就枯了。\n然后是几百万只爪子同时落地的声音。\n“没了头领，它们就是蚂蚁，”沃斯克说，“找大的，打大的。”",
            "Hour forty. The sky turns violet. Spores fall like snow; the wheat withers in half an hour.\nThen comes the sound of millions of claws touching down at once.\n“Without their leader-beasts, they're ants,” Vosk says. “Find the big ones. Shoot the big ones.”"),
    effects: {sanity: -5, hp: -10},
    codex: ["xenos_tyranid", "xenos_hive_mind"],
    choices: [
      C("跟沃斯克去找大家伙", "Go with Vosk to find a big one", "imp_510"),
      C("守住平民撤离点", "Guard the civilian evacuation point", "imp_511")
    ]};

  N.imp_510 = {chapter: 5, scene: "spore_sky", speaker: VOSK, foe: "tyranid_warrior", time: {h: 2},
    text: L("那是一只泰伦武士，比人高两倍，挥着骨刃。周围的小虫跟着它一起转向，像同一个身体。\n沃斯克装上最后一发爆弹——你从不知道她还藏着这个。\n“替我瞄准，”她说，“我只有一只眼。”",
            "A Tyranid Warrior, twice a man's height, swinging bone-blades. The small ones turn when it turns, like one body.\nVosk loads her last bolt shell. You never knew she had one.\n“Aim for me,” she says. “I've only got the one eye.”"),
    codex: ["xenos_tyranid_warrior"],
    choices: [
      C("稳住她的枪口", "Steady her aim", null, R(0.5, "sanity", "imp_512", "imp_513", L("你托住她的枪管，呼吸跟着她的呼吸。世界缩成了准星里的一个点。", "You brace her barrel, breathing in time with her. The world shrinks to a point in the sights."), L("一只小虫撞上你的腿。你的手抖了，就一下。", "A small beast slams into your leg. Your hands jerk. Just once.")))
    ]};

  N.imp_512 = {chapter: 5, scene: "spore_sky", speaker: VOSK, foe: "gaunt", time: {h: 1},
    text: L("爆弹打碎了泰伦武士的头冠。周围的虫子突然乱了，像断了线的木偶，互相撕咬。\n沃斯克放下枪：“看见了？砍头。对谁都管用。”",
            "The bolt shatters the Warrior's crest. The swarm around it falters at once, tearing at each other like puppets with cut strings.\nVosk lowers her gun. “See? Cut off the head. Works on everything.”"),
    effects: {renown: 8},
    choices: [
      C("撤向着陆场", "Fall back to the landing field", "imp_516", {result: L("最后一架女武神把你们拖上天。下面的麦田，正一路紫到地平线。", "The last Valkyrie hauls you skyward. Below, the wheat is turning violet all the way to the horizon.")})
    ]};

  N.imp_513 = {chapter: 5, scene: "spore_sky", speaker: null, foe: "tyranid_warrior", time: {h: 1},
    text: L("爆弹打偏了。骨刃落下时，沃斯克把你推开了。\n你最后一次看见她，她在笑，就像她讲过的那个兽人。\n你捡起了她的眼罩。",
            "The shell goes wide. As the bone-blade falls, Vosk shoves you clear.\nThe last time you see her, she's laughing. Just like the ork she told you about.\nYou pick up her eyepatch."),
    effects: {sanity: -10, hp: -10, set: {voskDead: true}},
    choices: [
      C("带着眼罩撤退", "Retreat with the eyepatch", "imp_516", {result: L("你攥着眼罩爬上最后一架女武神。没人问那是谁的。", "You clutch the eyepatch as you climb into the last Valkyrie. Nobody asks whose it was.")})
    ]};

  N.imp_511 = {chapter: 5, scene: "spore_sky", speaker: S("guardsman", "惊慌的母亲", "Frantic Mother"), time: {h: 2},
    text: L("撤离点挤满平民，运输机只能再飞一趟。\n一个母亲把襁褓塞进你怀里：“带她走。”\n舱门正在关闭。只剩一个位置。",
            "The evac point is choked with civilians. The lander can lift once more.\nA mother shoves a bundle into your arms. “Take her.”\nThe hatch is closing. There's one seat left."),
    choices: [
      C("把婴儿送上去", "Hand the baby aboard", "imp_514", {effects: {renown: 5, set: {savedBaby: true}}, result: L("你把襁褓递进舱门，一只手接住了她。舱门在你鼻尖前合拢。", "You pass the bundle through the hatch; a hand takes her. The door seals an inch from your nose.")}),
      C("自己挤上去", "Squeeze aboard yourself", "imp_515", {effects: {renown: -10, sanity: -10, set: {fledHesper: true}, taint: {nurgle: 15}}, result: L("你把襁褓塞回母亲怀里。她没骂你，只是看着你。", "You push the bundle back into the mother's arms. She doesn't curse you. She just looks at you.")})
    ]};

  N.imp_514 = {chapter: 5, scene: "spore_sky", speaker: null, foe: "gaunt", time: {h: 4},
    text: L("运输机带着婴儿起飞了。你在孢子雪里打光了最后一个电池，才被最后一架女武神拖上去。\n你没看见那位母亲上来。",
            "The lander lifts with the baby aboard. You fight in the spore-snow until your last power pack is spent, and the final Valkyrie drags you up.\nYou never see the mother come aboard."),
    effects: {hp: -15, sanity: 5},
    choices: [
      C("望着下面的麦田", "Look down at the wheat", "imp_516", {result: L("孢子雪下，麦田变成了紫色，一路紫到地平线。", "Under the spore-snow the wheat turns violet, all the way to the horizon.")})
    ]};

  N.imp_515 = {chapter: 5, scene: "ship_interior", speaker: DRAVIK, time: {h: 1},
    text: L("你挤了上去。舱门合上时，外面有人在喊一个名字，也许是那婴儿的。\n德拉维克政委押着伤员坐在对面，手枪放在膝上，一路都没看你。\n这比看你更可怕。",
            "You squeeze aboard. As the hatch seals, someone outside screams a name. Maybe the baby's.\nCommissar Dravik, escorting the wounded, sits opposite with her pistol across her knees and never once looks your way.\nThat's worse than if she had."),
    choices: [
      C("盯着自己的靴子", "Stare at your boots", "imp_516", {result: L("你数着靴子上的泥点。数到第三百个，运输机才不再颠簸。", "You count the mud flecks on your boots. At three hundred, the lander finally stops shaking.")})
    ]};

  N.imp_516 = {chapter: 5, scene: "void", speaker: S("omen_purge", "舰队命令", "Fleet Order"), time: {d: 1},
    alt: [ADD(F("agriSeeds"), "母亲给的麦种在口袋里硌着你。赫斯珀烧了，你口袋里还有一片麦田。", "Mother's seed wheat presses into you through your pocket. Hesper is burning; there's still a field in your pocket."),
          ADD(F("refusedHaak"), "命令末尾的封蜡，你在维瑟尔的火光里见过。", "The wax seal at the foot of the order is one you saw by firelight in Vessel.")],
    text: L("第二天，灰大衣的女人以审判庭之名签署了灭绝令。你从舷窗看着赫斯珀燃烧，像一根被摁灭的烟头。\n“虫子吃不到的，就不算输，”一个军官说。\n没人鼓掌，也没人反对。",
            "Next day the woman in the grey coat signs the Exterminatus in the Inquisition's name. Through the viewport you watch Hesper burn like a stubbed-out lho-stick.\n“Whatever the bugs can't eat, we haven't lost,” an officer says.\nNobody applauds. Nobody objects."),
    effects: {sanity: -5},
    codex: ["imp_exterminatus"],
    choices: [
      C("转身离开舷窗", "Turn away from the viewport", "imp_517", {result: L("你转过身。那团光在你背后烧了很久，你一直没回头。", "You turn away. The glow burns at your back for a long time. You never look round.")})
    ]};

  N.imp_517 = {chapter: 5, scene: "barracks", speaker: ARNO, time: {h: 6}, gather: L("检疫队伍", "Quarantine line"),
    text: L("全团在医疗舱外排成检疫队伍。阿诺医师用一盏灯，挨个照每个人的后颈。\n“小孔，像虫咬的，”他说，“有一个，就送进焚化炉。”\n队伍里没人说话。",
            "The whole regiment forms a quarantine line outside the medicae bay. Arno shines a lamp on the back of each neck in turn.\n“A little hole, like an insect bite,” he says. “Anyone who has one goes to the incinerator.”\nNo one in the line speaks."),
    choices: [
      C("站直，让他照", "Stand straight and let him look", "imp_518", {require: {notFlag: "kissed"}, hideIfLocked: true, result: L("灯光扫过你的后颈。阿诺挥挥手：下一个。", "The lamp sweeps your neck. Arno waves: next.")}),
      C("主动说出那一下刺痛", "Tell him about the prick yourself", "imp_518", {require: {flag: "kissed"}, hideIfLocked: true, effects: {hp: -15, sanity: -5, renown: 3, set: {confessedKiss: true}}, result: L("阿诺盯着那个小孔看了很久，拿起手术刀：“忍着。帝皇保佑，它还没长进去。”", "Arno studies the little hole a long time, then picks up a scalpel. “Hold still. Emperor be thanked, it hasn't taken root.”")}),
      C("拉高领子，混过去", "Pull up your collar and slip past", "imp_518", {require: {flag: "kissed"}, hideIfLocked: true, effects: {corruption: 10, set: {hidKiss: true}}, result: L("你把领子拉到耳根。灯光扫过去，阿诺打了个哈欠：下一个。", "You turn your collar up to your ears. The lamp sweeps past; Arno yawns. Next.")})
    ]};

  N.imp_518 = {chapter: 5, scene: "barracks", speaker: DRAVIK, time: {h: 2},
    alt: [ADD(F("voskDead"), "念到沃斯克，她停了一下，把名字划掉了。", "At Vosk's name she pauses, then strikes it through."),
          ADD(F("savedBaby"), "她在你的名字旁边写了两个字：婴儿。", "Beside your name she writes one word: infant.")],
    text: L("检疫之后，德拉维克拿着撤离名单走过队伍，念一个名字，看一张脸。\n“在赫斯珀守住阵地的，记功。”她停下来，“挤上撤离机的，自己站出来。”",
            "After the quarantine, Dravik walks the line with the evacuation manifest, reading a name, looking at a face.\n“Those who held at Hesper: commended.” She stops. “Those who pushed onto an evac lander: step forward.”"),
    choices: [
      C("站在原地", "Stay where you are", "imp_600", {require: {notFlag: "fledHesper"}, hideIfLocked: true, result: L("她从你面前走过，脚步没停。", "She walks past you without breaking stride."),
        resultAlt: [{if: F("fledDustfall"), text: L("她在你面前停下：“尘落星，你跑过。赫斯珀，你没跑。”她划掉了你名字后的那个叉。", "She stops in front of you. “Dustfall, you ran. Hesper, you didn't.” She strikes out the cross by your name.")}]}),
      C("站出来", "Step forward", "imp_600", {require: [{flag: "fledHesper"}, {notFlag: "fledDustfall"}], hideIfLocked: true, effects: {renown: -5, sanity: -5, set: {penal: true}}, result: L("“一个座位，一个婴儿。”她推过来一支笔，“签字。从今天起，你去惩戒连第一排。”", "“One seat. One infant.” She slides a pen across. “Sign. From today you're in the penal company's front rank.”")}),
      C("站出来", "Step forward", "imp_end_commissar", {require: [{flag: "fledHesper"}, {flag: "fledDustfall"}], hideIfLocked: true, result: L("她看了你很久：“尘落星一次，赫斯珀一次。”这一次，她没有递笔。", "She looks at you a long time. “Dustfall once. Hesper once.” This time she doesn't offer a pen.")})
    ]};

  /* ============ Chapter 6 · Indomitus ============ */
  N.imp_600 = {chapter: 6, scene: "ship_interior", speaker: PELL, time: {y: 2}, bridge: true,
    jump: L("两年后：舰队在裂隙边缘转战", "Two years later: the fleet fights along the Rift's edge"),
    alt: [ALT(F("penal"), "两年。惩戒连的项圈从没摘下来过，走错一步它就会响。\n你们总是第一批登陆，最后一批撤回，每次点名都少几个人。佩尔偷偷给你塞过两次烟。",
              "Two years. The penal collar never comes off; one wrong step and it chimes.\nYou are always first down and last back, and every roll call is shorter. Pell has slipped you smokes twice."),
          ADD(F("confessedKiss"), "后颈的刀疤早就长好了，只在下雨前发痒。", "The scar on your neck healed long ago. It only itches before rain."),
          ADD(F("voskDead"), "沃斯克的位置换了三个中士，没有一个记得你的名字。", "Vosk's place has had three sergeants since. None of them remembers your name.")],
    text: L("两年。三次登陆，两次改编，你学会了在任何地方睡着。\n佩尔还活着，咖啡照样掺三成水。舰队一直在裂隙边缘打转，像在等一道命令。",
            "Two years. Three landings, two renumberings; you learn to sleep anywhere.\nPell is still alive, his recaff still a third water. The fleet circles along the edge of the Rift, as if waiting for an order."),
    choices: [
      C("把咖啡喝完", "Finish the recaff", "imp_601", {result: L("咖啡还是那么难喝。舰内广播在这时响了。", "The recaff is as bad as ever. Then the shipwide vox chimes.")})
    ]};

  N.imp_601 = {chapter: 6, scene: "ship_interior", speaker: S("omen_primarch", "舰内广播", "Shipwide Broadcast"), time: {h: 2}, gather: L("食堂", "Mess"),
    text: L("舰上食堂里，几千人放下餐盘。屏幕在转播摄政基里曼的新敕令：无畏远征的一支战斗群，将进驻阿尔科萨星区。\n那个平静的声音念出了你们星区的名字。老兵们哭了。",
            "In the ship's mess, thousands set down their trays. The screens relay a new edict of the Lord Regent Guilliman: a battle group of the Indomitus Crusade will be sent to the Arcosa Sector.\nThe calm voice speaks your sector's name. Veterans weep."),
    effects: {sanity: 20, renown: 5},
    codex: ["imp_guilliman", "imp_indomitus", "imp_great_rift", "place_terra"],
    choices: [
      C("跟大家一起敬礼", "Salute with everyone else", "imp_602", {require: {notFlag: "penal"}, hideIfLocked: true, result: L("全舰几万人同时抬手，甲板都在震。", "Tens of thousands raise their hands at once. The deck trembles.")}),
      C("跟大家一起敬礼", "Salute with everyone else", "imp_604", {require: {flag: "penal"}, hideIfLocked: true, result: L("全舰几万人同时抬手。惩戒连的项圈一起叮当作响。", "Tens of thousands raise their hands at once. The penal collars all chime together.")}),
      C("问老兵为什么哭", "Ask a veteran why he's crying", "imp_603")
    ]};

  // SPEC §27 sector continuity: Hesper burned (ch5), Valda's grain never shipped (Aeldari route, 113.M42)
  var VET_GRAIN = L("“新枪有了，口粮却减了三成。”他啐了一口，“赫斯珀烧了，瓦尔达的运粮船一年没来，没人说得清。”",
                    "“New guns, sure. Rations cut by a third, though.” He spits. “Hesper's ash, and Valda's grain ships haven't come in a year. Nobody can say why.”");
  N.imp_603 = {chapter: 6, scene: "ship_interior", speaker: S("guardsman", "独臂老兵", "One-Armed Veteran"), time: {h: 1},
    text: L("“他是帝皇的儿子，”老兵说，“兄弟背叛了他，他挨了一刀，睡了一万年。一百多年前醒来，就一个世界一个世界地往回打。”\n他擦擦眼睛，“这是他头一回念到咱们这个角落。”",
            "“He's a son of the Emperor,” the veteran says. “Betrayed by his brothers, struck down, asleep ten thousand years. He woke a century back and has been taking worlds back one by one ever since.”\nHe wipes his eyes. “First time he's ever named our little corner.”"),
    codex: ["chaos_horus_heresy"],
    choices: [
      C("点点头", "Nod", "imp_602", {require: {notFlag: "penal"}, hideIfLocked: true, result: VET_GRAIN}),
      C("点点头", "Nod", "imp_604", {require: {flag: "penal"}, hideIfLocked: true, result: VET_GRAIN})
    ]};

  N.imp_602 = {chapter: 6, scene: "ship_interior", speaker: DRAVIK, time: {d: 2},
    text: L("德拉维克政委把一枚铜徽章别在你领口。\n“下士，”她说，“这意味着以后有人逃跑，由你开枪。”\n她的语气，像在通知今天的口粮是什么。",
            "Commissar Dravik pins a copper badge to your collar.\n“Corporal,” she says. “It means from now on, when someone runs, you take the shot.”\nShe says it the way she'd announce today's rations."),
    effects: {renown: 5, set: {corporal: true}},
    choices: [
      C("敬礼", "Salute", "imp_605", {result: L("你敬了礼。她回礼的动作分毫不差，像一台机器。", "You salute. Her return salute is precise to the millimetre, like a machine.")}),
      C("问她有没有后悔过", "Ask if she has ever regretted it", "imp_605", {effects: {sanity: -5, set: {askedDravik: true}}, result: L("她想了很久：“后悔需要时间。我的时间都拿去换弹匣了。”", "She takes a long time to answer. “Regret takes time. I spend mine changing magazines.”")})
    ]};

  N.imp_604 = {chapter: 6, scene: "ship_interior", speaker: DRAVIK, time: {d: 2},
    text: L("惩戒连的舱室。德拉维克把一张纸拍在你面前：赫斯珀的撤离名单，你的签名还在上面。\n“远征战斗群要来了，”她说，“他们不要惩戒兵。你的命还没还清。下一仗，第一排。”",
            "The penal company's hold. Dravik slaps a sheet down in front of you: the Hesper manifest, your signature still on it.\n“The crusade battle group is coming,” she says. “They don't take penal troops. Your debt isn't paid. Next battle, front rank.”"),
    effects: {sanity: -5, set: {penal: true}},
    choices: [
      C("敬礼", "Salute", "imp_605", {result: L("项圈随着你的动作轻轻响了一声。她回了礼，分毫不差。", "Your collar chimes faintly as you move. She returns the salute, precise to the millimetre.")})
    ]};

  N.imp_605 = {chapter: 6, scene: "ship_interior", speaker: S("psyker", "结霜的女孩", "Frost-Fingered Girl"), time: {d: 3},   // unnamed: agri/noble never met Mina; the hive player names her via the first choice
    grudgeLine: {npc: "mina", text: L("她顿了顿：“还有一个梦。你站在执事面前，开了口。”", "She pauses. “Another dream. You, standing before the deacon, opening your mouth.”")},
    alt: [ADD(F("hidMina"), "黑船还是找到了她。不是你说的，她知道。", "The Black Ship found her anyway. Not through you. She knows."),
          ADD(F("sawBlackShip"), "“你看着我的船飞走，”她说，“我也看见你了。”", "“You watched my ship leave,” she says. “I saw you too.”")],
    text: L("走廊里，一队配属舰队的星语学徒在看守押送下经过，颈上都戴着铁圈。一个蒙眼的女孩指尖结着霜，准确地转向了你。\n“我梦见过你，”她说，“你会回家，但家已经着火了。”",
            "Down the corridor, a file of astropath novices assigned to the fleet passes under guard, iron rings at their throats. A blindfolded girl with frost on her fingertips turns straight to you.\n“I dreamed you,” she says. “You'll go home. But home is on fire.”"),
    effects: {sanity: -5},
    codex: ["imp_psyker", "imp_black_ships"],
    choices: [
      C("米娜？佩尔一直在找你", "Mina? Pell's been looking for you", "imp_607", {require: {flag: "sawMina"}, hideIfLocked: true, effects: {sanity: 5, set: {minaMessage: true}}, result: L("她的嘴角动了一下，像是想笑。“替我告诉他，我不冷。”", "Her mouth twitches, almost a smile. “Tell him I'm not cold.”")}),
      C("你看见了什么？", "What did you see?", "imp_607", {grudge: {npc: "mina", effects: {sanity: -4}, note: L("米娜梦见过是谁向执事说了她的名字。", "Mina dreamed who gave her name to the deacon.")}}),
      C("离我远点，巫婆", "Get away from me, witch", "imp_607", {effects: {renown: 2, sanity: -5, set: {spurnedMina: true}}, grudge: {npc: "mina", effects: {hp: -6}, note: L("你告发过她，还骂她巫婆；她指尖的霜咬了你。", "You reported her, then called her witch. Her frost bites.")}, result: L("押送的士兵笑了，用枪托推了她一把。她踉跄一下，还是朝你伸出了手。", "The escort laughs and shoves her with his rifle butt. She stumbles, but still reaches for you.")}),
      C("“对不起，米娜。是我说的。”", "“I'm sorry, Mina. It was me.”", "imp_607", {require: {flag: "wronged_mina"}, hideIfLocked: true, effects: {sanity: -5, set: {forgiven_mina: true}}, result: L("她没说原谅。只是把结霜的手，轻轻放在你手背上：“我知道。我梦见过。”", "She doesn't say she forgives you. She only lays a frosted hand on yours. “I know. I dreamed it.”")})
    ]};

  N.imp_607 = {chapter: 6, scene: "warp", speaker: S("omen_black_crusade", "幻象", "Vision"), time: {h: 1},
    grudgeLine: {npc: "mina", text: L("米娜没有松手。结霜的指尖顺着你的手腕往上爬。", "Mina doesn't let go. Frost climbs her fingertips up your wrist.")},
    alt: [ALT(F("spurnedMina"), "她抓住你的手，冷得像刀。你看见故乡在燃烧，看见一只睁开的眼——然后幻象像玻璃一样碎了，碎片扎进你的脑子。\n你没看清它要去哪儿。",
              "She seizes your hand, cold as a blade. You see home burning, an open eye—then the vision shatters like glass and the shards drive into your skull.\nYou never see where it's heading."),
          ADD(F("forgiven_mina"), "幻象的最后，塔顶亮起一点金光，很小，没有熄。", "At the vision's end a small gold light kindles atop the tower, and does not go out.")],
    text: L("她抓住你的手。一瞬间你看见：故乡的天被撕开，一支黑色舰队从裂口落下，扑向巢都尖顶的那座塔。\n舰桥上站着一个身穿黑甲的人，胸前有一只睁开的眼。",
            "She grips your hand. In an instant you see it: home's sky torn open, a black fleet falling through the wound, diving at the tower on the hive's crown.\nOn its bridge stands a figure in black armour, an open eye upon his chest."),
    effects: {sanity: -5, corruption: 3},
    choices: [
      C("挣开她的手", "Wrench your hand free", "imp_608", {grudge: {npc: "mina", effects: {hp: -5}, note: L("米娜记得是谁说出了她的名字；她的手很冷。", "Mina remembers who named her. Her hand is cold.")}, result: L("你挣开了手，幻象却没走。之后四天，你一闭眼就看见那只眼睛。", "You pull free, but the vision stays. For four days, every time you close your eyes, you see that eye.")})
    ]};

  N.imp_608 = {chapter: 6, scene: "ship_interior", speaker: S("guard_sergeant", "舰长", "Ship's Captain"), time: {d: 4},
    jump: L("幻象之后四天，星语者证实了它", "Four days after the vision, the astropaths confirm it"),
    text: L("四天后，星语者证实了幻象：一支黑色军团舰队闯进了奥雷克斯星系。维瑟尔那艘船上的眼，就是他们的。\n“阿巴顿的人，”舰长说，“他们要的不是巢都，是星语塔，整个星区的传声筒。”\n你要回家了。",
            "Four days later the astropaths confirm it: a Black Legion fleet has broken into the Aurex system, the open eye from the wreck at Vessel.\n“Abaddon's,” the captain says. “They don't want the hive. They want the astropathic tower, the whole sector's voice.”\nYou're going home."),
    codex: ["chaos_abaddon", "chaos_black_legion", "chaos_black_crusade", "place_cadia", "chaos_eye_of_terror"],
    choices: [
      C("去找佩尔喝一杯", "Find Pell for a drink", "imp_610"),
      C("去礼拜堂报上家人的名字", "Give your family's names at the chapel", "imp_611", {effects: {renown: 5, sanity: -5}, result: L("执事把名字一个一个写进祈祷簿。写到最后一个，墨水用完了。", "The deacon writes the names into the prayer book one by one. On the last one, the ink runs out.")})
    ]};

  N.imp_610 = {chapter: 6, scene: "barracks", speaker: PELL, time: {h: 3},
    grudgeLine: {npc: "pell", text: L("他只给你倒了半杯，没抬头。米娜的事，他一个字也没提。", "He pours you half a cup without looking up. He doesn't say one word about Mina.")},
    text: L("佩尔弄来一瓶机油味的私酿。“我一直想回家，”他说，“但不是这样回去。”\n他掏出一张旧口粮券：“要是我先死，替我在楼梯间卖一天咖啡。免费的。”",
            "Pell has scrounged a bottle of hooch that tastes like engine oil. “I always wanted to go home,” he says. “Not like this.”\nHe pulls out an old ration chit. “If I die first, sell recaff in the stairwell for a day. Free.”"),
    effects: {sanity: 10, hp: -5, set: {pellPromise: true}},
    choices: [
      C("碰杯", "Clink glasses", "imp_611", {grudge: {npc: "pell", effects: {sanity: -4}, note: L("佩尔举杯时没看你；他没原谅米娜的事。", "Pell raises his cup without looking at you. He hasn't forgiven the Mina business.")}, result: L("酒难喝得要命。你们一人喝了半瓶，谁也没提回家以后的事。", "The hooch is vile. You each drink half the bottle, and neither of you mentions what comes after home.")}),
      C("转告他：米娜说她不冷", "Tell him: Mina says she isn't cold", "imp_611", {require: {flag: "minaMessage"}, hideIfLocked: true, effects: {sanity: 5, set: {forgiven_pell: true}}, result: L("佩尔盯着你，喉结滚了很久。“……她还会说这种话。”他把整瓶酒推给你，肩膀抖了一下，没再说别的。", "Pell stares at you, throat working for a long time. “...She still says things like that.” He pushes the whole bottle over. His shoulders shake once. He says nothing more.")})
    ]};

  N.imp_611 = {chapter: 6, scene: "warp", speaker: null, time: {d: 20, warp: true}, eventRoll: 0.56,
    jump: L("舰队调头，跃迁回奥雷克斯", "The fleet turns and jumps for Aurex"),
    text: L("这次跃迁颠簸得厉害。亚空间里有东西追着舰队，像鲨鱼闻到了血。\n第三天，船尾整个舱段的人都疯了。他们反锁舱门，用同一个声音唱歌。\n舰长下令抽真空。",
            "This jump is rougher than any before. Something in the warp chases the fleet like a shark scenting blood.\nOn day three, an entire aft section goes mad. They lock themselves in and sing in one voice.\nThe captain orders it vented."),
    effects: {sanity: -5},
    choices: [
      C("堵住耳朵", "Cover your ears", "imp_700", {effects: {sanity: 5}, result: L("你塞上棉絮，捂住耳朵，再蒙上被子。歌声还是渗进来一点，然后停了。", "Cotton in your ears, hands over them, blanket over that. A little of the song still seeps through. Then it stops.")}),
      C("去听那首歌", "Go and listen to the song", "imp_700", {effects: {corruption: 15, sanity: -5, taint: {slaanesh: 55}, set: {heardSong: true}}, result: L("你贴在舱门上。歌很美，唱的是下水道、蜡烛和一扇会打开的门。然后空气抽空，歌停了。", "You press against the bulkhead. The song is beautiful: drains, candles, a door that will open. Then the air vents, and the song stops.")})
    ]};

  /* ============ Chapter 7 · The Black Crusade ============ */
  N.imp_700 = {chapter: 7, scene: "ship_interior", speaker: DRAVIK, time: {h: 12}, bridge: true,
    alt: [ALT(F("penal"), "出亚空间时，奥雷克斯的黄色烟幕底下翻着紫色的风暴，是黑色舰队带来的。\n惩戒连的登陆艇没有窗。你只听见别人说：星语塔顶站着全星球唯一的一个星际战士。",
              "When you drop out of the warp, a violet storm churns under Aurex's yellow smog, dragged in by the black fleet.\nThe penal lander has no windows. You only hear others say it: atop the astropathic tower stands the one Space Marine on the whole world."),
          ADD(F("heardSong"), "那首歌还在你脑子里，每次唱到下水道那一句就停。", "The song is still in your head. It always stops at the line about the drains."),
          ADD(F("spurnedMina"), "你没看清的那个幻象，现在补全了：那座塔。", "The vision you never saw to its end completes itself now: the tower.")],
    text: L("出亚空间时，奥雷克斯的黄色烟幕底下翻着紫色的风暴，是黑色舰队带来的。\n登陆艇掠过巢都尖顶。星语塔顶站着一个蓝灰色的巨人——全星球唯一的星际战士。",
            "When you drop out of the warp, a violet storm churns under Aurex's yellow smog, dragged in by the black fleet.\nYour lander skims the hive's crown. Atop the astropathic tower stands a blue-grey giant: the one Space Marine on the whole world."),
    choices: [
      C("抓紧扶手", "Grab the handrail", "imp_701", {result: L("登陆艇一头扎进烟里。再看见地面时，着陆场上全是人。", "The lander plunges into the smoke. When you see the ground again, the landing field is full of people.")})
    ]};

  N.imp_701 = {chapter: 7, scene: "burning_city", speaker: HALLOW, time: {h: 2}, gather: L("着陆场", "Landing field"),
    alt: [ADD(NF("voskDead"), "沃斯克拄着拐杖站在人群里，独眼扫过你，点了点头。", "Vosk leans on a crutch in the crowd. Her one eye finds you; she nods."),
          ADD(F("voskDead"), "一个老兵认出了你戴着的眼罩，朝你敬了个礼。", "An old trooper recognises the eyepatch you wear and salutes.")],
    text: L("着陆场上挤满了难民和伤兵。哈洛执事嗓子哑了，仍在念名单：“……第六工厂的老监工格鲁斯克，带着工人用铆钉枪守住了工厂。赞美帝皇。”\n巢都尖塔在烧，像一根巨大的蜡烛。",
            "The landing field is crammed with refugees and wounded. Deacon Hallow, voice hoarse, still reads names: “...Grusk, old overseer of Manufactorum Six, who held it with his workers and their rivet guns. Praise the Emperor.”\nThe hive spire burns like a giant candle."),
    effects: {sanity: -5},
    codex: ["place_manufactorum_six", "place_aurex", "place_arcosa"],
    choices: [
      C("直接去前线报到", "Report straight to the front", "imp_703", {require: {notFlag: "penal"}, hideIfLocked: true, effects: {renown: 2}, result: L("你没回头看巢都，背起枪就走。哈洛在你身后补念了一句祝福。", "You don't look back at the hive. You shoulder your rifle and go. Hallow tacks a blessing on behind you.")}),
      C("问他家里的消息", "Ask him for news of home", "imp_702", {require: {notFlag: "penal"}, hideIfLocked: true, result: L("哈洛翻着名单，一页又一页。", "Hallow leafs through the list, page after page.")}),
      C("跟上惩戒连", "Fall in with the penal company", "imp_702p", {require: {flag: "penal"}, hideIfLocked: true, result: L("项圈的红灯亮了。你没有别的路可走。", "Your collar's red light comes on. There's no other road for you.")})
    ]};

  N.imp_702 = {chapter: 7, scene: "hive_hab", speaker: HALLOW, time: {h: 3},
    alt: [ALT({flags: ["origin_agri", "gaveStash"]}, "七号穹顶离巢都太远，哈洛只查到一行：灰原的农庄都被征作难民营。\n你父亲的名字后面写着：罚没，已还清。母亲在营里给难民煮麦粥。",
              "Dome Seven is too far out; Hallow finds one line: the ash-plain farms have been made refugee camps.\nBy your father's name: penalty paid. Your mother cooks wheat porridge for the refugees."),
          ALT({flags: ["origin_agri", "seedsHome"]}, "七号穹顶离巢都太远，哈洛只查到一行：灰原的农庄都被征作难民营。\n“七号穹顶今年的新麦长得特别好，”他说，“全拿来喂难民了。”你留下的麦种，发芽了。",
              "Dome Seven is too far out; Hallow finds one line: the ash-plain farms have been made refugee camps.\n“Dome Seven's new wheat came up fine this year,” he says. “All of it feeds refugees.” The seeds you left behind took root."),
          ALT({flags: ["origin_agri", "volunteered"]}, "七号穹顶离巢都太远，哈洛只查到一行：灰原的农庄都被征作难民营。\n“你父亲托人带了句话，”他说，“那一垄，他替你割完了。”",
              "Dome Seven is too far out; Hallow finds one line: the ash-plain farms have been made refugee camps.\n“Your father sent word,” he says. “That last row: he cut it for you.”"),
          ALT(F("origin_agri"), "七号穹顶离巢都太远，哈洛只查到一行：灰原的农庄都被征作难民营。\n他翻到一页：“七号穹顶……交粮最多的一个。你父亲还在割麦。”",
              "Dome Seven is too far out; Hallow finds one line: the ash-plain farms have been made refugee camps.\nHe turns a page. “Dome Seven... delivered the most grain of any. Your father is still reaping.”"),
          ALT({flags: ["origin_noble", "ringReturned"]}, "赛伦家打开地窖收容难民。哈洛领你下到地窖时，父亲正在分粥。\n“你哥哥用那枚戒指，给难民换了三车水，”他说，“然后穿上那身军服，去了城墙。”",
              "House Serrin has opened its cellars to refugees. When Hallow leads you down, your father is ladling soup.\n“Your brother traded that ring for three carts of water,” he says. “Then he put on that uniform and went to the walls.”"),
          ALT(F("origin_noble"), "赛伦家打开地窖收容难民。哈洛领你下到地窖时，父亲正在分粥，勺子停在半空。\n“你哥哥去了城墙，”他说，“他说欠你的，总得还一点。”",
              "House Serrin has opened its cellars to refugees. When Hallow leads you down, your father is ladling soup; the ladle stops in mid-air.\n“Your brother went to the walls,” he says. “He said he owed you, and had to pay some of it.”")],
    text: L("三号塔塌了一半。十四层还在，楼梯间的咖啡摊被人改成了包扎点。\n哈洛说，你的邻居大多躲进了大教堂。墙上那幅帝皇像，还剩一双眼睛。",
            "Tower Three is half collapsed. Level fourteen still stands; the stairwell recaff stall has become a dressing station.\nHallow says most of your neighbours have taken refuge in the cathedral. On the wall, the Emperor's portrait still has its eyes."),
    codex: ["place_tower_three"],
    choices: [
      C("把那封信送到十四层", "Take the letter up to level fourteen", "imp_703", {require: [{flag: "deadLetter"}, {flag: "origin_hive"}], hideIfLocked: true, effects: {sanity: 5, set: {deliveredLetter: true}}, result: L("开门的是个老妇人。她读完信，把你拉进屋，给你倒了半杯掺水的咖啡。", "An old woman opens the door. She reads the letter, pulls you inside, and pours you half a cup of watered recaff.")}),
      C("把戒指留给父亲，换难民的撤离位", "Leave Father the ring for refugee berths", "imp_703", {require: {flag: "serrinRing"}, hideIfLocked: true, effects: {renown: 5, set: {ringGiven: true}}, result: L("父亲掂了掂戒指：“够换两个孩子。”他没再说别的，转身去找名单。", "Father weighs the ring. “Enough for two children.” He says nothing more, and goes for the list.")}),
      C("把麦种交给难民营", "Give the seed wheat to the refugee camp", "imp_703", {require: {flag: "agriSeeds"}, hideIfLocked: true, effects: {sanity: 5, set: {seedsGiven: true}}, result: L("你把一路攥着的麦种交给哈洛：“种在城墙下。”他用围巾把它们包好。", "You hand Hallow the seeds you've carried all this way. “Plant them under the walls.” He wraps them in his scarf.")}),
      C("回前线报到", "Report to the front", "imp_703", {effects: {renown: 2}, result: L("你没再多问。有些消息，等仗打完再听。", "You ask nothing more. Some news can wait till the fighting's done.")})
    ]};

  N.imp_702p = {chapter: 7, scene: "ruins", speaker: S("commissar", "惩戒连长", "Penal Custodian"), time: {h: 2},
    text: L("惩戒连在着陆场另一头卸下，项圈一个个亮起红灯。连长用电棍敲着铁轨：“你们的命是帝国借给你们的。今天开始还。”\n你们被第一批赶进了下巢的废墟。",
            "The penal company unloads at the far end of the field, collars blinking red one by one. The custodian raps a rail with his shock maul. “Your lives are on loan from the Imperium. Today you start repaying.”\nYou are the first driven into the ruins of the lower hive."),
    effects: {sanity: -5, taint: {khorne: 15}},
    choices: [
      C("往前走", "Walk forward", "imp_703", {result: L("你走在第一排。身后的人踩着你的脚印。", "You walk in the front rank. The men behind step in your footprints.")})
    ]};

  N.imp_703 = {chapter: 7, scene: "trench", speaker: null, foe: "heretic_astartes", time: {h: 9},
    text: L("第一次见到叛变星际战士，你才明白什么叫巨人。\n黑色动力甲，头盔上长角，一步跨过整条壕沟。激光打在它身上，像雨点打在铁皮屋顶。\n它低头看了你一眼，没停。你不值得。",
            "The first time you see a traitor Space Marine, you understand the word “giant.”\nBlack power armour, horned helm. It steps over the whole trench in one stride. Lasfire spatters off it like rain on a tin roof.\nIt glances down at you and walks on. You aren't worth it."),
    effects: {sanity: -5},
    codex: ["chaos_heretic_astartes"],
    choices: [
      C("朝它背包上的管线开火", "Shoot the conduit on its power pack", null, Object.assign({require: {notFlag: "blessedGun"}, hideIfLocked: true}, R(0.35, "renown", "imp_704", "imp_705", L("你瞄准那根泛着蓝光的管子，开了一枪。只有一枪，正中。", "You sight the conduit glowing blue and fire. One shot. Dead on."), L("激光打在管线旁的装甲上，只留下一个黑点。巨人停下了脚步。", "Your shot scorches the armour beside the conduit, leaving a black dot. The giant stops walking.")))),
      C("朝管线开火——奎尔-7祝福过这把枪", "Shoot the conduit with Quell-7's blessed rifle", null, Object.assign({require: {flag: "blessedGun"}, hideIfLocked: true}, R(0.45, "renown", "imp_704", "imp_705", L("枪托上那道圣油的痕迹还在。它原谅过你一次，这次也没让你失望。", "The oil-mark on the stock is still there. It forgave you once; it doesn't fail you now."), L("枪没让你失望。是你的手抖了。巨人停下了脚步。", "The rifle doesn't fail you. Your hand does. The giant stops walking.")))),
      C("缩在泥里，等它走远", "Press into the mud until it passes", "imp_707", {effects: {sanity: -10, hp: -10}, result: L("你把脸埋进泥里，听着它的脚步从头顶跨过。有人没趴下，你听见了。", "You bury your face in the mud as its footsteps pass overhead. Someone didn't get down. You hear it.")})
    ]};

  N.imp_704 = {chapter: 7, scene: "trench", speaker: S("astartes", "守塔的星际战士", "The Tower's Space Marine"), foe: "heretic_astartes", time: {h: 1},
    text: L("那根管子炸出一串火花，巨人踉跄着转过身。\n一道蓝灰色的影子从星语塔方向扑下——那个守塔的星际战士，把它按进了泥里。\n他朝你点了点头。仅此而已，但你会记一辈子。",
            "The conduit spits sparks; the giant staggers and turns.\nA blue-grey shape drops from the direction of the tower: the Space Marine who guards it drives the traitor into the mud.\nHe nods at you. That's all. You'll remember it for the rest of your life."),
    effects: {renown: 10},
    codex: ["imp_astartes"],
    choices: [
      C("回礼", "Return the nod", "imp_707", {result: L("你抬手回礼时，他已经扑向下一个目标。你的手在半空停了很久。", "By the time you raise your hand, he has already leapt toward the next target. Your hand stays up a long time.")})
    ]};

  N.imp_705 = {chapter: 7, scene: "ruins", speaker: null, foe: "heretic_astartes", time: {h: 1},
    text: L("它转过身，随手一挥。你飞出去十几米，撞在墙上。\n你躺在瓦砾里，看着它走远。它甚至没确认你死没死。\n这让你莫名地愤怒。",
            "It turns and swats you aside. You fly a dozen metres into a wall.\nLying in the rubble, you watch it walk on. It doesn't even check whether you're dead.\nFor some reason, that makes you furious."),
    effects: {hp: -25, renown: 3, taint: {khorne: 30}},
    choices: [
      C("爬起来", "Get up", "imp_707", {result: L("你吐掉一口带血的砂子，捡起枪。天快黑了。", "You spit out a mouthful of bloody grit and pick up your rifle. Night is coming.")})
    ]};

  N.imp_707 = {chapter: 7, scene: "ruins", speaker: BRIN, time: {h: 8}, eventRoll: 0.42,
    grudgeLine: {npc: "brin", text: L("她递汤的手停了停：“孩子，你把我的地窖，指给了别人。”", "Her hand stalls. “Child, you showed my cellar to others.”")},
    alt: [ALT(F("forgiven_brin"), "夜里，废墟里响起一个熟悉的声音。是布琳——至少她说是：从维瑟尔逃出来的，脸上长满了疮，笑得很慈祥。\n“你救过我一次，孩子。我来还。”她捧着一碗冒热气的汤。",
              "At night in the ruins, a familiar voice. It's Brin, or so she says: escaped from Vessel, her face covered in sores, her smile kind.\n“You saved me once, child. I've come to repay you.” She holds out a steaming bowl."),
          ADD(F("painkillers"), "“你一直在找那种不疼的感觉，”她说，“我这儿有。”", "“You've been looking for that painless feeling all along,” she says. “I have it here.”")],
    text: L("夜里，废墟里响起一个熟悉的声音。是布琳——或者是披着布琳样子的东西。\n她捧着一碗冒热气的汤：“你的帝皇没来，孩子。来的是黑色的战帅。他会让活下来的人吃饱。”",
            "At night in the ruins, a familiar voice. Brin—or something wearing Brin.\nShe holds out a steaming bowl of soup. “Your Emperor didn't come, child. The black Warmaster did. He'll feed whoever survives.”"),
    effects: {sanity: -5, corruption: 5},
    codex: ["chaos_gods"],
    choices: [
      C("喝下那碗汤", "Drink the soup", "imp_708", {effects: {corruption: 20, hp: 30, taint: {nurgle: 65}}, grudge: {npc: "brin", effects: {hp: -6}, note: L("你出卖过布琳；汤里有烧焦的味道。", "You betrayed Brin. The soup tastes of smoke.")}, result: L("你接过碗。这一次，你没有问汤里放了什么。", "You take the bowl. This time you don't ask what's in it.")}),
      C("开枪", "Shoot", "imp_709", {effects: {sanity: -5}, result: L("激光穿过她的身体，打在后面的墙上。她没倒，只是叹了口气。", "The las-bolt passes through her and hits the wall behind. She doesn't fall. She only sighs.")}),
      C("念出阵亡者的名字", "Recite the names of the dead", "imp_709", {effects: {sanity: 10, renown: 3, taint: {all: -10}}, grudge: {npc: "brin", effects: {sanity: -4}, note: L("布琳不在你的名单里；她正看着你。", "Brin isn't on your list. She is watching you.")}, result: L("你从训练时那个被处决的新兵念起。每念一个名字，她就淡一分。", "You begin with the recruit shot in training. With every name you say, she fades a little more."),
        resultAlt: [{if: F("deliveredLetter"), text: L("你从那个新兵念起——十四层的老妇人今天才知道他的名字。每念一个，她就淡一分。", "You begin with the recruit; the old woman on fourteen learned his name only today. With every name, she fades a little more.")}]})
    ]};

  N.imp_708 = {chapter: 7, scene: "ruins", speaker: BRIN, time: {h: 1},
    alt: [ADD(F("cultist"), "“你握过镜面人的匕首，”她说，“你知道开门是什么感觉。”", "“You held the Mirrored Man's dagger,” she says. “You know how opening a door feels.”")],
    text: L("汤是热的。伤口在合拢，恐惧在融化。\n布琳摸着你的脸：“明天，叛军会从第六工厂的下水道进城。你只要告诉长官——那边很安全。”",
            "The soup is warm. Your wounds close. Your fear melts away.\nBrin strokes your cheek. “Tomorrow the traitors come in through the drains under Manufactorum Six. All you have to do is tell your officers it's safe there.”"),
    choices: [
      C("照她说的做", "Do as she says", "imp_end_traitor", {result: L("第二天一早，你告诉中尉，第六工厂那边很安全。他向你道了谢。", "Next morning you tell the lieutenant the drains under Six are safe. He thanks you.")}),
      C("把这个情报反过来交给政委", "Turn the secret over to the commissar", "imp_710", {effects: {sanity: -10, set: {knowRoute: true}}, result: L("你点头答应。等她消失了，你才发现自己咬破了嘴唇。", "You nod along. Only after she's gone do you notice you've bitten through your lip.")})
    ]};

  N.imp_end_traitor = {chapter: 7, scene: "burning_city", speaker: S("omen_black_crusade", "黑色军团", "Black Legion"), time: {y: 1},
    text: L("第六工厂陷落了。布琳兑现了承诺：你活着，吃得很饱，胸口多了一只睁开的眼。\n后来，你跟着黑色军团去了下一个世界，教他们哪里的门最容易打开。",
            "Manufactorum Six falls. Brin keeps her word: you live, you eat well, and an open eye appears upon your chest.\nLater you follow the Black Legion to the next world, and teach them which doors open easiest."),
    ending: {kind: "bad", title: L("开门人", "The Doorkeeper"), cause: L("为黑色军团打开城门", "Opened the gates to traitors")}};

  N.imp_709 = {chapter: 7, scene: "ruins", speaker: null, time: {h: 1},
    text: L("那东西消失了，只留下一碗冷汤。汤面映出的不是你的脸，是一只睁开的眼。\n你一脚踢翻碗，坐到天亮。你知道它还会回来。",
            "The thing is gone, leaving a bowl of cold soup. Reflected in it is not your face but an open eye.\nYou kick the bowl over and sit awake till dawn. You know it'll be back."),
    choices: [
      C("去指挥所", "Go to the command post", "imp_710", {result: L("天亮时，你踩着碎玻璃走进指挥所。德拉维克已经在等人了。", "At dawn you crunch over broken glass into the command post. Dravik is already waiting.")})
    ]};

  N.imp_710 = {chapter: 7, scene: "barracks", speaker: DRAVIK, time: {h: 10},
    alt: [ADD(F("penal"), "她看了一眼你的项圈：“惩戒兵去桥墩。除非你有更有用的东西。”", "She glances at your collar. “Penal troops go to the bridge pylons. Unless you've something more useful.”"),
          ADD(F("underhiveFriend"), "你想起独眼拾荒者那条管子：它就从第六工厂底下穿过。", "You remember the one-eyed scavenger's pipe. It runs right under Manufactorum Six.")],
    text: L("指挥所。德拉维克把地图摊在弹药箱上：“轨道防御全灭，援军最快七天。三个口子：第六工厂的下水道、挤满难民的大教堂、通往上巢的大桥。”\n“每处都要志愿者。”",
            "The command post. Dravik spreads the map over an ammo crate. “Orbital defences gone. Relief is seven days out at best. Three gaps: the drains under Manufactorum Six, the cathedral full of refugees, the bridge to the upper hive.”\n“I need volunteers for each.”"),
    choices: [
      C("叛军会走第六工厂的下水道", "They'll come through the drains under Six", "imp_711", {require: {flag: "knowRoute"}, hideIfLocked: true, effects: {set: {ambushSix: true}}, result: L("德拉维克盯着你看了三秒，然后在地图上第六工厂的位置画了个圈：“你带路。”", "Dravik studies you for three seconds, then circles Manufactorum Six on the map. “You lead.”")}),
      C("那首歌里……提到过下水道", "That song... it mentioned the drains", "imp_711", {require: [{flag: "heardSong"}, {notFlag: "knowRoute"}], hideIfLocked: true, effects: {sanity: -5, set: {ambushSix: true}, taint: {slaanesh: 25}}, result: L("你哼出那首歌的一句，自己先打了个寒颤。德拉维克没说话，在第六工厂画了个圈。", "You hum one line of the song and shiver first. Dravik says nothing, and circles Manufactorum Six.")}),
      C("自愿去大教堂守难民", "Volunteer to hold the cathedral", "imp_712", {require: {notFlag: "penal"}, hideIfLocked: true, effects: {set: {heldCathedral: true}}, result: L("难民里有几张生面孔，说话带着卡尔卡罗斯口音。他们说，自家的天也这样裂开过。", "Among the refugees are strangers with Carcharos accents. They say the sky split like this over their world too.")}),
      C("加入桥墩爆破队", "Join the bridge demolition team", "imp_713", {effects: {set: {blewBridge: true}}, result: L("德拉维克只问了一句：“炸药够吗？”你跟着工兵去了桥墩。", "Dravik asks one question. “Enough charges?” You follow the sappers to the pylons.")})
    ]};

  N.imp_711 = {chapter: 7, scene: "underhive", speaker: DRAVIK, time: {h: 14},
    alt: [ADD(F("underhiveFriend"), "这些管子你认得。当年逃亡走过的路，你闭着眼都能走。", "You know these pipes. The road you fled down once; you could walk it blind."),
          ADD(F("penal"), "惩戒连被放在最前面当诱饵，项圈的红灯在黑暗里一闪一闪。", "The penal company goes first, as bait, collars blinking red in the dark.")],
    text: L("你们在下水道口等了一夜。黎明时，第一批邪教徒爬了出来，手里还捧着蜡烛。\n埋伏只用了几分钟。德拉维克没问你是怎么知道的。\n“有些问题，”她说，“最好别问。”",
            "You wait all night at the drain mouth. At dawn the first cultists climb out, still carrying candles.\nThe ambush takes minutes. Dravik doesn't ask how you knew.\n“Some questions,” she says, “are better left unasked.”"),
    effects: {renown: 10},
    choices: [
      C("回到防线", "Return to the line", "imp_713r", {result: L("你踩着蜡烛的残骸爬出下水道。第六工厂守住了。", "You climb out over the stubs of candles. Manufactorum Six holds.")})
    ]};

  N.imp_712 = {chapter: 7, scene: "cathedral", speaker: HALLOW, time: {d: 1}, gather: L("大教堂", "Cathedral"),
    text: L("大教堂挤满了难民。哈洛分发最后的圣水——其实就是过滤过的循环水。\n“信仰比水管用，”他说，“但水好歹能喝。”\n外面的炮声一夜没停。",
            "The cathedral is packed with refugees. Hallow hands out the last of the holy water—filtered recyc, really.\n“Faith works better than water,” he says. “But at least water's drinkable.”\nThe guns outside never stop all night."),
    effects: {renown: 5, hp: -10, sanity: 5},
    choices: [
      C("帮他分水", "Help him hand it out", "imp_713r", {result: L("你把水一杯杯递出去。一个孩子喝完，把空杯还给你：“谢谢帝皇。”", "You pass the water out cup by cup. A child drinks, hands back the empty cup and says, “Thank the Emperor.”")})
    ]};

  N.imp_713 = {chapter: 7, scene: "burning_city", speaker: DRAVIK, time: {h: 6},
    text: L("你跟着工兵在桥墩里塞了一夜炸药。天亮时，叛军坦克开上了下巢那头的桥面。\n桥上还有工人在往上跑——三万个没撤上来的人。\n德拉维克的命令只有一个字：“炸。”",
            "All night you pack the pylons with the sappers. At dawn traitor tanks roll onto the far end of the bridge.\nWorkers are still running up it: thirty thousand who never got out.\nDravik's order is one word. “Blow.”"),
    choices: [
      C("按下引爆器", "Press the detonator", "imp_713r", {effects: {sanity: -10, renown: 5, taint: {tzeentch: 15}}, result: L("桥塌了，坦克被挡在下巢，一起被挡在下面的还有三万个工人。德拉维克在报告上写：“战术必要。”", "The bridge falls. The tanks are stranded below, and thirty thousand workers with them. Dravik writes: “Tactically necessary.”")}),
      C("引爆前冲回去拉人", "Run back to pull people off first", null, Object.assign({effects: {hp: -10}}, R(0.45, "hp", "imp_713b", "imp_713r", L("你逆着人流冲上桥，抓住一只手，又一只。", "You run up the bridge against the flood of people and grab a hand, then another."), L("你刚冲到桥中间，脚下就塌了。你只抓住了一只手，桥下的敲铁声响了一夜。", "You're halfway up when it goes. You catch only one hand. All night, someone below bangs on metal.")))),
      C("带人走泵站的老管子上来", "Lead people up the old pump-station pipe", "imp_713b", {require: {flag: "underhiveFriend"}, hideIfLocked: true, effects: {hp: -5}, result: L("你想起独眼人的那条路，带着工人钻进了排污管。", "You remember the one-eyed man's road and lead the workers into the sewer main.")})
    ]};

  N.imp_713b = {chapter: 7, scene: "underhive", speaker: DRAVIK, time: {h: 2},
    text: L("你拖着四十几个工人钻出泵站的井口，身后的桥轰然塌下。\n德拉维克看着你身后那群灰头土脸的人，什么也没说，在报告上多写了一行数字。",
            "You haul some forty workers out of the pump-station shaft as the bridge thunders down behind you.\nDravik looks at the grimy crowd at your back, says nothing, and adds one more line of figures to her report."),
    effects: {renown: 5, sanity: 5, set: {pulledWorkers: true}},
    choices: [
      C("回到防线", "Back to the line", "imp_713r", {result: L("工人们自己捡起了枪。没人教，他们也会。", "The workers pick up rifles themselves. Nobody teaches them; they know how.")})
    ]};

  N.imp_713r = {chapter: 7, scene: "burning_city", speaker: null, time: {d: 2},
    alt: [ALT(F("corporal"), "守城第三天。一个十六岁的新兵扔下枪，往后跑。\n德拉维克在五十步外看着你，没有拔枪。“下士，”她说，“这是你的事。”",
              "Day three of the siege. A sixteen-year-old recruit drops his rifle and runs.\nFifty paces away, Dravik watches you and doesn't draw. “Corporal,” she says. “This one is yours.”")],
    text: L("守城第三天。一个十六岁的新兵扔下枪，往后跑。他跑过你身边时，你看清了他的脸——他在哭。\n五十步外，德拉维克正在拔枪。",
            "Day three of the siege. A sixteen-year-old recruit drops his rifle and runs. As he passes you, you see his face: he's crying.\nFifty paces away, Dravik is drawing her pistol."),
    choices: [
      C("举枪", "Raise your rifle", "imp_714", {require: {flag: "corporal"}, hideIfLocked: true, effects: {sanity: -10, renown: 5, set: {shotRunner: true}}, result: L("你开了枪。德拉维克点点头，走开了。那天晚上，你的手一直在抖。", "You fire. Dravik nods and walks away. That night your hands won't stop shaking.")}),
      C("放他走", "Let him go", "imp_714", {require: {flag: "corporal"}, hideIfLocked: true, effects: {renown: -5, sanity: 5, set: {sparedRunner: true}}, result: L("你垂下枪口。德拉维克看了你很久，在本子上写了一笔，什么也没说。", "You lower your muzzle. Dravik looks at you a long time, writes something in her book, and says nothing.")}),
      C("挡在他和政委之间", "Step between him and the commissar", "imp_714", {require: {notFlag: "corporal"}, hideIfLocked: true, effects: {hp: -5, renown: -5, set: {sparedRunner: true}}, result: L("她的枪托砸在你脸上。等你爬起来，那孩子已经跑远了。她没有追。", "Her pistol butt cracks across your face. By the time you're up, the boy is long gone. She doesn't follow.")}),
      C("转过脸去", "Look away", "imp_714", {require: {notFlag: "corporal"}, hideIfLocked: true, effects: {sanity: -5}, result: L("你没看。你只听见了枪声，和枪声之后很长的安静。", "You don't look. You only hear the shot, and the long quiet after.")})
    ]};

  N.imp_714 = {chapter: 7, scene: "burning_city", speaker: PELL, time: {d: 2}, eventRoll: 0.35,
    grudgeLine: {npc: "pell", text: L("说完楼梯间，他的目光落在你脸上，又轻轻叫了一声：“米娜。”", "After the stairwell, his eyes settle on your face and he softly says one more word: “Mina.”")},
    alt: [ALT(F("forgiven_pell"), "第五天。佩尔被流弹击中，倒在你怀里，把一张旧口粮券塞进你手心：“告诉米娜……她不冷就好。楼梯间……免费的……”\n远处，一个巨大的黑影降落在巢都尖顶。",
              "Day five. A stray round takes Pell. He falls into your arms and presses an old ration chit into your hand. “Tell Mina... as long as she's not cold. The stairwell... free...”\nIn the distance, a vast black shape lands atop the hive spire."),
          ALT(F("pellSavedYou"), "第五天。佩尔被流弹击中，倒在你怀里。“这回……扯不平了，”他咧嘴笑，把一张旧口粮券塞进你手心，“楼梯间……免费的……”\n远处，一个巨大的黑影降落在巢都尖顶。",
              "Day five. A stray round takes Pell. He falls into your arms. “Can't call it even... this time,” he grins, pressing an old ration chit into your hand. “The stairwell... free...”\nIn the distance, a vast black shape lands atop the hive spire."),
          ADD(F("toldPellSky"), "最后他问：“天……真的好看吗？”", "At the very end he asks: “The sky... is it really beautiful?”"),
          ADD(NF("ambushSix"), "第六工厂早就失守了，黑甲是从下面上来的。", "Manufactorum Six fell days ago. The black armour came up from below.")],
    text: L("第五天。你已经不记得上次睡觉是什么时候。\n佩尔被流弹击中，倒在你怀里，把一张旧口粮券塞进你手心：“楼梯间……免费的……”\n远处，一个巨大的黑影降落在巢都尖顶。",
            "Day five. You can't remember the last time you slept.\nA stray round takes Pell. He falls into your arms and presses an old ration chit into your hand. “The stairwell... free...”\nIn the distance, a vast black shape lands atop the hive spire."),
    effects: {sanity: -5},
    choices: [
      C("抱着他直到最后", "Hold him until it's over", "imp_800", {effects: {sanity: 5, set: {stayedWithPell: true}}, grudge: {npc: "pell", effects: {sanity: -5}, note: L("佩尔临终叫的是米娜，目光落在你身上。", "Pell dies saying Mina's name, his eyes on you.")}, result: L("你抱着他，直到他的手变凉。那张口粮券被你攥出了汗。", "You hold him until his hand goes cold. The ration chit is damp in your fist.")}),
      C("放下他，回到阵地", "Lay him down and go back to the line", "imp_800", {effects: {renown: 5, sanity: -5, taint: {khorne: 25}}, result: L("你合上他的眼睛，把他放在沙袋后面。回到阵地，你的枪比以前更准了。", "You close his eyes and lay him behind the sandbags. Back on the line, your aim is better than ever.")})
    ]};

  /* ============ Chapter 8 · Last Rites ============ */
  N.imp_800 = {chapter: 8, scene: "hive_spire", speaker: DRAVIK, time: {h: 8}, bridge: true,
    alt: [ADD(F("stayedWithPell"), "佩尔的口粮券还在你手心里，被汗浸软了。", "Pell's ration chit is still in your palm, soft with sweat."),
          ADD(F("pulledWorkers"), "你从桥下拉上来的工人，扛着弹药箱跟在队尾。", "The workers you pulled off the bridge bring up the rear, hauling ammo crates.")],
    text: L("第五天夜里，残部撤上巢都尖顶，退守星语塔。德拉维克数了数人头，没把数字念出来。\n电梯一层层往上爬。窗外，整座巢都都在烧。",
            "The night of day five. What's left of you falls back up the spire to hold the astropathic tower. Dravik counts heads and doesn't say the number aloud.\nThe lift crawls upward floor by floor. Outside, the whole hive is burning."),
    codex: ["place_astropath_tower"],
    choices: [
      C("守在电梯口", "Take position at the lift", "imp_801", {result: L("电梯停在塔腰。你们用桌椅堵住了走廊，然后等。", "The lift stops halfway up the tower. You barricade the corridor with desks and chairs, and wait.")})
    ]};

  N.imp_801 = {chapter: 8, scene: "hive_spire", speaker: S("omen_black_crusade", "阿巴顿的声音", "Abaddon's Voice"), time: {h: 6},
    alt: [ADD(F("penal"), "惩戒兵被推到电梯口最前面。你的项圈在黑暗里一闪一闪。", "The penal troops are pushed to the very front of the lift. Your collar blinks in the dark."),
          ADD(F("heldCathedral"), "下面的大教堂里，难民在唱歌，声音一直传到塔上。", "Far below in the cathedral, refugees are singing. The sound carries all the way up the tower.")],
    text: L("你们守着星语塔的电梯，塔顶的星语者还在向整个星区求救。\n广播响了。一个低沉的声音，不急不慢：“你们的神是一具尸体。跪下的人可以活。”\n是阿巴顿。他甚至没提高音量。",
            "You hold the lift to the astropathic tower; above, the astropaths are still calling the whole sector for help.\nThe vox crackles. A deep, unhurried voice: “Your god is a corpse. Those who kneel may live.”\nAbaddon. He doesn't even raise his voice."),
    effects: {sanity: -5, corruption: 5},
    codex: ["chaos_abaddon", "chaos_black_crusade"],
    choices: [
      C("砸掉广播", "Smash the vox-caster", "imp_802", {result: L("你用枪托砸了三下，广播才哑掉。他的最后一个字还在走廊里回荡。", "Three blows of your rifle butt silence the vox. His last word still echoes down the corridor.")}),
      C("唱圣歌盖过他", "Sing a hymn over him", "imp_802", {effects: {renown: 5, sanity: 5, set: {sangHymn: true}, taint: {all: -5}}, result: L("你起了个头，跑调了。然后小队里每个人都跟着唱，跑得一样厉害。", "You start the hymn off-key. Then the whole squad joins in, just as off-key.")}),
      C("在心里……数一数跪下的好处", "Quietly weigh the benefits of kneeling", "imp_802", {effects: {corruption: 20, hp: 15, set: {weighedKneel: true}, taint: {tzeentch: 40}}, result: L("你没跪，只是算了算。伤口忽然不疼了，像有人替你记下了这笔账。", "You don't kneel. You only do the sums. Your wounds stop hurting, as if someone has noted the account.")})
    ]};

  N.imp_802 = {chapter: 8, scene: "hive_spire", speaker: DRAVIK, foe: "heretic_astartes", time: {h: 2},
    alt: [ADD(F("sangHymn"), "小队还在哼那首跑调的圣歌，声音发抖，但没停。", "The squad is still humming that off-key hymn. Their voices shake, but don't stop."),
          ADD(F("penal"), "惩戒兵在前。你离那扇门最近。", "Penal troops in front. You are nearest the doors.")],
    text: L("电梯门开了。走出来三个黑色军团的战士，个个比门框还高。\n德拉维克拔出链锯剑：“替我记住这一刻。总得有人记得。”",
            "The lift doors open. Out step three Black Legion warriors, each taller than the doorframe.\nDravik draws her chainsword. “Remember this moment for me. Someone has to.”"),
    effects: {sanity: -5, hp: -10},
    choices: [
      C("跟她一起冲", "Charge with her", null, R(0.4, "hp", "imp_804", "imp_805", L("你紧跟政委冲进去，边跑边开火，枪管烧得发红。", "You charge in on the commissar's heels, firing as you run, barrel glowing red."), L("冲到一半，一只铁拳朝你当头砸下。", "Halfway there, an iron fist comes down at your head."))),
      C("把手雷绑上电梯缆绳", "Strap your grenades to the lift cables", "imp_807", {require: {stat: "renown", min: 40}, result: L("你扑向电梯井，把手雷一颗颗绑上缆绳。德拉维克明白了，把三个巨人往轿厢里逼。", "You dive for the shaft and lash grenade after grenade to the cables. Dravik sees it and drives the giants back into the car.")}),
      C("把它们引进你家的旧电梯", "Lure them into your family's old lift", "imp_807", {require: {flag: "origin_noble"}, hideIfLocked: true, result: L("这部电梯你小时候坐过上百次。你记得哪根缆绳最旧，把手雷全绑在了那根上。", "You rode this lift a hundred times as a child. You know which cable is oldest, and lash every grenade to it.")}),
      C("在侧面掩护射击", "Give covering fire from the flank", "imp_805", {effects: {sanity: -5}, result: L("你从侧面开火，激光在黑甲上溅起火星。一个巨人转过身，朝你走来。", "You fire from the flank; las-bolts spark off black armour. One giant turns and comes for you.")})
    ]};

  N.imp_804 = {chapter: 8, scene: "hive_spire", speaker: DRAVIK, foe: "heretic_astartes", time: {h: 1},
    alt: [ADD(F("askedDravik"), "“你问过我后不后悔，”她喘着气，“现在有答案了：没有。”", "“You asked if I ever regretted it,” she pants. “Now I know. No.”")],
    text: L("你不知道自己是怎么活下来的。只记得政委的剑在尖叫，你的枪烫得握不住，最后一个巨人倒下时砸碎了半面墙。\n德拉维克靠墙坐下，伤得很重，还在换弹匣。",
            "You don't know how you survived. You remember the commissar's sword screaming, your gun too hot to hold, the last giant falling and smashing half a wall.\nDravik slumps against the wall, badly hurt, still changing her magazine."),
    effects: {renown: 15, hp: -20, taint: {khorne: 30}},
    choices: [
      C("扶她起来", "Help her up", "imp_806", {result: L("她甩开你的手，自己站了起来。“去塔顶，”她说，“看看我们在替谁守。”", "She shakes off your hand and stands on her own. “Go up the tower,” she says. “See who we're holding for.”")})
    ]};

  N.imp_805 = {chapter: 8, scene: "hive_spire", speaker: null, foe: "heretic_astartes", time: {h: 1},
    alt: [ADD(F("askedDravik"), "踹开你之前，她说了半句：“你问过我后不后悔——”", "Before she kicks you clear she gets half a sentence out. “You asked if I regretted—”")],
    text: L("动力拳落下的那一刻，德拉维克一脚把你踹开。\n你滚到电梯井边，回头只看见她的军帽，在地上转了两圈。\n你把它捡起来，戴在了自己头上。",
            "As the power fist falls, Dravik kicks you clear.\nYou roll to the edge of the shaft. When you look back, you see only her cap, spinning twice on the floor.\nYou pick it up and put it on."),
    effects: {hp: -20, sanity: -5, renown: 5, set: {dravikDead: true}},
    choices: [
      C("守住电梯口", "Hold the lift", "imp_806", {result: L("你戴着她的军帽守在电梯口。再也没有人上来。", "You hold the lift wearing her cap. Nobody else comes up.")})
    ]};

  N.imp_807 = {chapter: 8, scene: "hive_spire", speaker: DRAVIK, time: {h: 1},
    text: L("你拉开引信。电梯带着三个巨人坠入三公里深的井道。\n你听了很久，没听见落地的声音。\n“好主意，”德拉维克说，“我本来打算让你去送死的。”",
            "You pull the pins. The lift car plunges three kilometres down the shaft with all three giants inside.\nYou listen a long time. You never hear it land.\n“Good idea,” Dravik says. “I was about to send you to die.”"),
    effects: {renown: 10},
    choices: [
      C("守到天亮", "Hold until dawn", "imp_806", {result: L("井道里再没上来任何东西。天快亮时，你决定去塔顶看看。", "Nothing else comes up the shaft. Near dawn, you decide to see the top of the tower.")})
    ]};

  N.imp_806 = {chapter: 8, scene: "hive_spire", speaker: S("psyker", "老星语者", "Old Astropath"), time: {h: 9},
    alt: [ADD(F("forgiven_mina"), "塔顶亮着一点金光，很小，跟米娜给你看的一样。", "A small gold light burns at the tower's top, just as Mina showed you."),
          ADD(F("weighedKneel"), "另一个星语者转向你，皱起鼻子：“你身上有他的味道。”", "Another astropath turns toward you and wrinkles her nose. “You smell of him.”")],
    text: L("你爬上星语塔顶。角落里放着那个守塔星际战士的蓝灰色头盔。十几个星语者围坐成圈，念着同一句话，从黑色舰队落下就没停过。\n一个忽然停下，空洞的眼眶转向你：“有回应了。是……更大的东西。”",
            "You climb to the top of the tower. In a corner lies the blue-grey helm of the Marine who guarded it. A dozen astropaths sit in a circle chanting one phrase, as they have since the black fleet fell.\nOne stops and turns her empty sockets toward you. “An answer. Something... bigger.”"),
    effects: {sanity: 10},
    choices: [
      C("握住她的手", "Hold her hand", "imp_808", {require: {notFlag: "hidKiss"}, hideIfLocked: true, effects: {sanity: 5, set: {heldAstropath: true}}, result: L("她的手冷得像冰，却握得很紧。你们一起等着，谁也没说话。", "Her hand is ice-cold but grips tight. You wait together, saying nothing.")}),
      C("冲到窗边看天", "Rush to the window", "imp_808", {require: {notFlag: "hidKiss"}, hideIfLocked: true, effects: {renown: 3}, result: L("窗外还是紫色的天。你盯着风暴，一直盯到眼睛发疼。", "Outside, the sky is still violet. You stare at the storm until your eyes ache.")}),
      C("后颈那个小孔，忽然烫了起来", "The little hole on your neck starts to burn", "imp_end_purged", {require: {flag: "hidKiss"}, hideIfLocked: true, result: L("星语者们同时停了下来，一起转向你。有人去叫审判庭的人了。", "The astropaths all stop at once and turn toward you. Someone goes to fetch the Inquisition.")})
    ]};

  N.imp_808 = {chapter: 8, scene: "throne_light", speaker: S("omen_primarch", "无畏远征战斗群", "Indomitus Battle Group"), time: {h: 12},
    text: L("第七天黎明，风暴的裂口里亮起一道金光。\n是无畏远征的战斗群，蓝金色的战舰遮住了半边天。广播里放着摄政录下的敕令：“奥雷克斯，我们来了。”\n黑色舰队开始撤退。",
            "Dawn, day seven. A golden light ignites in the wound in the storm.\nIt's the Indomitus battle group, blue-and-gold ships blotting out half the sky. The vox plays the Regent's recorded edict: “Aurex. We are here.”\nThe black fleet begins to withdraw."),
    effects: {sanity: 20, renown: 10},
    codex: ["imp_indomitus", "imp_guilliman"],
    choices: [
      C("掏出审判官的硬币", "Take out the Inquisitor's coin", "imp_end_inquisition", {require: [{flag: "inqCoin"}, {stat: "corruption", max: 59}], hideIfLocked: true, result: L("硬币在金光里发烫。半小时后，一架没有标记的穿梭机落在塔顶。", "The coin grows warm in the golden light. Half an hour later, an unmarked shuttle lands on the tower.")}),
      C("登上远征舰队", "Join the crusade fleet", "imp_end_crusade", {require: [{stat: "renown", min: 50}, {stat: "corruption", max: 59}, {notFlag: "penal"}], result: L("战斗群从守军里抽调老兵补员。名单上有你的名字——政委的本子记着你。", "The battle group draws veterans from the defenders to fill its ranks. Your name is on the list; the commissar's book remembered you.")}),
      C("留下，重建家园", "Stay and rebuild your home", "imp_end_hold", {require: {stat: "corruption", max: 59}, hideIfLocked: true, result: L("你走下星语塔，搬起了第一块砖。", "You climb down from the tower and lift the first brick.")}),
      C("咬着牙走进那道光", "Grit your teeth and step into the light", null, Object.assign({require: {stat: "corruption", min: 60}, hideIfLocked: true}, R(0.35, "renown", "imp_end_hold", "imp_end_purged", L("光照在身上，烫得像火。你没有躲。等它过去，你还站在原地，影子只有一个。", "The light burns like fire. You don't flinch. When it passes you're still standing, with only one shadow."), L("光照到你时，皮肤像被烫了一下。你下意识躲进了阴影。有人看见了。", "Where the light touches you, your skin flinches as if scalded. You duck into shadow without thinking. Someone sees."))))
    ]};

  N.imp_end_hold = {chapter: 8, scene: "hive_hab", speaker: HALLOW, time: {y: 1},
    alt: [ALT({flags: ["origin_agri", "seedsGiven"]}, "一年后，城墙下的废墟里长出了第一茬麦子，是你交给哈洛的那把种。\n哈洛念阵亡名单，念到佩尔时放慢了，像在道谢。\n帝皇从没看过你一眼。但你看见了他的人民。",
              "A year later, the first wheat comes up in the ruins under the walls, from the seeds you gave Hallow.\nHallow reads the names of the dead. At Pell's he slows, like a thank-you.\nThe Emperor never looked your way. But you saw his people."),
          ALT(F("origin_agri"), "一年后，你回到七号穹顶，替父亲割完最后一垄，麦子送进巢都喂难民。\n哈洛念阵亡名单，念到佩尔时放慢了，像在道谢。\n帝皇从没看过你一眼。但你看见了他的人民。",
              "A year later you go back to Dome Seven and cut the last row for your father; the wheat goes to the hive to feed refugees.\nHallow reads the names of the dead. At Pell's he slows, like a thank-you.\nThe Emperor never looked your way. But you saw his people."),
          ALT({flags: ["origin_noble", "ringGiven"]}, "一年后，你在赛伦家的地窖里分粥。那枚戒指换来的两个孩子，每天来帮忙。\n哈洛念阵亡名单，念到佩尔时放慢了，像在道谢。\n帝皇从没看过你一眼。但你看见了他的人民。",
              "A year later you ladle soup in House Serrin's cellars. The two children the ring bought come to help every day.\nHallow reads the names of the dead. At Pell's he slows, like a thank-you.\nThe Emperor never looked your way. But you saw his people."),
          ALT(F("origin_noble"), "一年后，你在赛伦家的地窖里分粥。家徽早就卖了，没人在意。\n哈洛念阵亡名单，念到佩尔时放慢了，像在道谢。\n帝皇从没看过你一眼。但你看见了他的人民。",
              "A year later you ladle soup in House Serrin's cellars. The crest was sold long ago; nobody minds.\nHallow reads the names of the dead. At Pell's he slows, like a thank-you.\nThe Emperor never looked your way. But you saw his people."),
          ALT(F("deliveredLetter"), "一年后，你在重建的楼梯间卖掺水的咖啡。十四层的老妇人每天来喝一杯，从不付钱。\n哈洛念阵亡名单，念到佩尔时放慢了，像在道谢。\n帝皇从没看过你一眼。但你看见了他的人民。",
              "A year later you sell watered recaff in the rebuilt stairwell. The old woman from fourteen drinks a cup every day and never pays.\nHallow reads the names of the dead. At Pell's he slows, like a thank-you.\nThe Emperor never looked your way. But you saw his people."),
          ADD(F("blewBridge"), "每年桥塌的那天，你都去桥墩下放一杯咖啡。", "Every year, on the day the bridge fell, you leave a cup of recaff at the pylons."),
          ADD(F("sparedRunner"), "那个你没让他死的新兵，后来一直跟在你身边帮忙。", "The recruit you didn't let die stays at your side and helps, every day.")],
    text: L("一年后，你站在重建的楼梯间里，卖掺三成水的再生咖啡。今天免费。\n哈洛念阵亡名单，念到佩尔时放慢了，像在道谢。\n帝皇从没看过你一眼。但你看见了他的人民。",
            "A year later you stand in the rebuilt stairwell selling recaff, a third of it water. Free today.\nHallow reads the names of the dead. At Pell's he slows down, like a thank-you.\nThe Emperor never looked your way. But you saw his people."),
    ending: {kind: "good", title: L("防线未破", "The Line Held"), cause: L("留守故乡，重建巢都", "Stayed home to rebuild")}};

  N.imp_end_crusade = {chapter: 8, scene: "void", speaker: S("omen_primarch", "远征舰队", "Crusade Fleet"), time: {d: 30},
    alt: [ADD(F("dravikDead"), "你戴着德拉维克的军帽登舰。没人让你摘下来。", "You board wearing Dravik's cap. Nobody tells you to take it off."),
          ADD(F("shotRunner"), "在新团里，你从不提守城第三天的那个新兵。", "In the new regiment you never mention the recruit from the third day of the siege.")],
    text: L("你登上了战斗群的蓝金色战舰。新军服，新番号，新的一万光年。\n启航时，你最后看了一眼故乡的天空。那道裂隙还在，像一道永远合不上的伤口。\n但至少，现在有人在缝它了。",
            "You board one of the battle group's blue-and-gold warships. New uniform, new regiment, ten thousand new light-years.\nAs the fleet departs you take a last look at home's sky. The rift is still there, a wound that will never close.\nBut at least someone is stitching it now."),
    codex: ["imp_great_rift"],
    ending: {kind: "good", title: L("无畏远征", "Indomitus"), cause: L("随远征舰队离去", "Left with the crusade fleet")}};

  N.imp_end_inquisition = {chapter: 8, scene: "ship_interior", speaker: HAAK, time: {d: 2},
    alt: [ADD(F("pellPromise"), "你还欠佩尔一天免费的咖啡。这笔账，你一直记着。", "You still owe Pell a day of free recaff. You never forget the debt."),
          ADD(F("heldAstropath"), "起飞时，那位老星语者站在塔顶，朝穿梭机点了点头。", "As you lift off, the old astropath stands atop the tower and nods toward the shuttle.")],
    text: L("穿梭机里，哈克审判官在剥一个橘子。“你还留着它，”她瞥了眼硬币，“很好。”\n“从今天起你不存在了。你会去很多地方，看很多不该看的东西，然后决定谁活。”\n她递给你半个橘子。",
            "In the shuttle, Inquisitor Haak is peeling an orange. “You kept it,” she says, eyeing the coin. “Good.”\n“From today, you don't exist. You'll go many places, see many things you shouldn't, and decide who lives.”\nShe hands you half the orange."),
    ending: {kind: "good", title: L("审判庭之眼", "Eyes of the Inquisition"), cause: L("成为审判官的侍从", "Became an Inquisitor's acolyte")}};

  N.imp_end_purged = {chapter: 8, scene: "cathedral", speaker: S("inquisitor", "审判庭清查官", "Inquisitorial Auditor"), time: {d: 3},
    text: L("胜利之后，审判庭开始清查。他们只用一盏灯，照一照你的眼睛。\n灯光里，你的影子多了一只手。\n他们很有礼貌，甚至给了你一碗热汤。",
            "After the victory, the Inquisition begins its audit. They use a single lamp and shine it in your eyes.\nIn its light, your shadow has an extra hand.\nThey're very polite. They even bring you a bowl of hot soup."),
    ending: {kind: "bad", title: L("光下的影子", "Shadow in the Light"), cause: L("腐化败露，被审判庭清除", "Purged by the Inquisition")}};

  /* ============ Claim endings (SPEC §19): a Chaos god's claim, accepted or forced. Reached via the claim events' goto. ============ */
  N.imp_end_claim_khorne = {scene: "trench", speaker: S("daemon_khorne", "铜色的鼓声", "The Brass Drum"), time: {y: 3},
    text: L("你不再等口令。中士在身后喊你，你只听得见鼓声。\n多年后，有人在一片无名的战场上见过你：军服早烂成了布条，你还在冲锋，身后的头盔堆成了小山。\n血神从不问血是谁的，只要王座下的头骨更高。",
            "You stop waiting for orders. The sergeant shouts your number behind you; all you hear is the drum.\nYears later someone glimpses you on a nameless battlefield: uniform rotted to rags, still charging, a hill of helmets at your back.\nThe Blood God never asks whose blood it was. He only wants the skulls piled higher."),
    codex: ["god_khorne"],
    ending: {kind: "bad", title: L("无名的冲锋", "The Endless Charge"), cause: L("被恐虐收为猎犬", "Taken as Khorne's hound")}};

  N.imp_end_claim_nurgle = {scene: "ruins", speaker: S("daemon_nurgle", "慈祥的声音", "A Fond Voice"), time: {d: 40},
    text: L("你不再怕病，也不再怕死。野战医院的伤员一个个好了，又病了，全都笑眯眯的。\n政委来查时，营地已成了一座花园：苍蝇在唱歌，伤口在开花，没人再喊疼。\n慈父爱他的每一个孩子，从不让谁孤单。",
            "You no longer fear sickness, or death. The field hospital's wounded get better one by one, then sick one by one, all of them smiling.\nWhen the commissar comes to inspect, the camp is a garden: flies singing, wounds in bloom, no one crying out.\nGrandfather loves every one of his children, and leaves none of them alone."),
    codex: ["god_nurgle"],
    ending: {kind: "bad", title: L("花园营地", "The Garden Camp"), cause: L("成为纳垢的园丁", "Became Nurgle's gardener")}};

  N.imp_end_claim_tzeentch = {scene: "ship_interior", speaker: S("sigil_tzeentch", "镜子里的人", "The One in the Mirror"), time: {y: 2},
    text: L("你总能先知道命令、战局，和谁会背叛谁。你一步步往上爬。\n某天你在作战图上画了一道线，整个团跟着它走进了埋伏。那道线，是镜子里的人替你画的。\n你以为自己在下棋，其实你只是一颗棋子。",
            "You always know first: the orders, the battle, who will betray whom. Over the years you climb, step by step.\nOne day you draw a line on the war map, and a whole regiment follows it into an ambush. The one in the mirror drew it for you.\nYou thought you were playing. You were only a piece."),
    codex: ["god_tzeentch"],
    ending: {kind: "bad", title: L("一步好棋", "A Clever Move"), cause: L("沦为奸奇的棋子", "Became Tzeentch's pawn")}};

  N.imp_end_claim_slaanesh = {scene: "cathedral", speaker: S("daemon_slaanesh", "甜得发苦的声音", "A Bittersweet Voice"), time: {y: 1},
    text: L("勋章、掌声、香膏、更响的赞美诗，你都要，而且要更多。\n每一样都比上一样淡。很多年后，人群为你欢呼，喊着你的名字，你什么也感觉不到。\n她把你一次次装满，又一次次倒空，直到你只剩下想要。",
            "Medals, applause, scented balm, louder hymns: you want them all, and more.\nEach tastes fainter than the last. Years later a crowd cheers your name, and you feel nothing.\nShe fills you and pours you out, again and again, until nothing is left of you but wanting."),
    codex: ["god_slaanesh"],
    ending: {kind: "bad", title: L("掌声之后", "After the Applause"), cause: L("被色孽掏空", "Hollowed out by Slaanesh")}};

  /* ============ Death nodes (engine-triggered) ============ */
  N.imp_death_hp = {scene: "ruins", speaker: null,
    text: L("你倒下的地方没有墓碑，只有一个编号。\n多年后，某位执事念到这个编号，语气依旧感恩。\n帝国从不缺人。它只缺时间。",
            "Where you fall there's no headstone, only a number.\nYears later, some deacon reads that number aloud, still sounding grateful.\nThe Imperium never runs short of people. Only of time."),
    ending: {kind: "death", title: L("无名之墓", "Unmarked Grave"), cause: L("战死，葬于无名墓", "Killed in action, unmarked grave")}};

  N.imp_death_sanity = {scene: "barracks", speaker: S("medicae", "军医", "Medic"),
    text: L("你开始笑，停不下来。军医给你打了一针，又一针。\n后来你被送进一座安静的修道院。那里的人都穿着束缚衣，都在数墙上别人看不见的眼睛。",
            "You start laughing and can't stop. A medic gives you a shot, then another.\nLater you're sent to a quiet monastery where everyone wears restraints and counts eyes on the walls that no one else can see."),
    ending: {kind: "death", title: L("数眼睛的人", "Counting Eyes"), cause: L("理智崩溃", "Mind shattered")}};

  N.imp_death_corruption = {scene: "warp", speaker: S("sigil_undivided", "亚空间", "The Warp"),
    text: L("那个一直在敲门的声音，终于等到了回答。\n你的皮肤在发光，你的影子在说话。政委的子弹来得很快，但还是晚了一步——从你身上爬出来的东西，已经开始笑了。",
            "The knocking that never stopped finally gets its answer.\nYour skin glows. Your shadow speaks. The commissar's bullet comes fast, but a moment too late. The thing climbing out of you has already begun to laugh."),
    ending: {kind: "death", title: L("开门的回答", "The Answer at the Door"), cause: L("被亚空间之物附身", "Possessed by the warp")}};

  WH.registerFaction({
    id: "imperium",
    name: L("人类帝国", "Imperium of Man"),
    tagline: L("一万亿人之一，被帝皇选中", "One in a trillion, chosen by the Emperor"),
    role: L("巢都工人", "Hive worker"),
    world: L("奥雷克斯二号", "Aurex Secundus"),   // SPEC §27 home world (all three origins grew up on Aurex)
    npcs: {   // SPEC §28 grudges: people the route lets you wrong
      mina: {name: L("米娜", "Mina")},
      pell: {name: L("佩尔", "Pell")},
      brin: {name: L("布琳", "Brin"), aka: [L("布琳婆婆", "Old Brin")]}
    },
    playerSprite: "player_imperium",
    color: "#c9a227",
    startNode: "imp_101",
    startDate: {year: 111, mill: 42},
    startStats: {hp: 100, sanity: 100, corruption: 0, renown: 10},
    renownLabel: L("信仰", "Faith"),
    renownIcon: "icon_faith",
    taintMod: {khorne: 0.9, nurgle: 0.9, tzeentch: 0.9, slaanesh: 0.9},   // SPEC §19: multiplier on positive taint deltas (cleanses unscaled)
    renownHelp: L("信仰是帝国眼中你的价值：服从、勇敢、虔诚。守住阵线、祈祷、举报异端会让它上升；逃跑、怯战、背弃同袍会让它下降。信仰够高，才做得出英勇之举，才会被远征舰队接纳。",
                  "Faith is your worth in the Imperium's eyes: obedience, courage, piety. Holding the line, praying, and reporting heresy raise it; fleeing, cowardice and abandoning comrades lower it. High Faith opens certain daring heroic deeds, and a place in the crusade."),
    origins: [
      {id: "hive", name: L("巢都工人", "Hive worker"),
       desc: L("奥雷克斯巢都的工人。重活练出一副硬身板，配额却磨掉了信仰和心气。", "An Aurex hive worker. Heavy shifts built a tough body; the quotas ground down your faith and nerve."),
       sprite: "player_imperium", startNode: "imp_101",
       max: {hp: 115, sanity: 95}, stats: {hp: 115, sanity: 95, corruption: 0, renown: 0}, set: {origin_hive: true}},
      {id: "agri", name: L("农庄之子", "Farmer's child"),
       desc: L("在灰原穹顶农庄长大，干农活练出好身板；可巢都的教堂不认得你。", "Raised on a domed farm on the ash plains. Farm work made you sturdy, but the hive's chapel barely knows your name."),
       sprite: "player_imperium", startNode: "imp_o_agri_1",
       max: {hp: 105, sanity: 100}, stats: {hp: 105, sanity: 100, corruption: 0, renown: 5}, set: {origin_agri: true}},
      {id: "noble", name: L("落魄贵族次子", "Fallen noble's second-born"),
       desc: L("尖塔破落家族的次子。读过经、受过祝福，却没吃过苦；只能当列兵替家族还债。", "Second-born of a sinking spire house. Schooled and blessed, but soft-handed. Too poor for a commission, you enlist to pay its debts."),
       sprite: "guardsman", startNode: "imp_o_noble_1",
       max: {hp: 85, sanity: 105}, stats: {hp: 85, sanity: 105, corruption: 0, renown: 20}, set: {origin_noble: true}}
    ],
    deathNodes: {hp: "imp_death_hp", sanity: "imp_death_sanity", corruption: "imp_death_corruption"},
    learn: {
      leaders: ["imp_emperor", "imp_guilliman", "imp_inquisition", "imp_commissar"],
      enemies: ["xenos_ork", "chaos_gods", "xenos_tyranid"],
      boss: ["chaos_abaddon", "chaos_black_crusade"]
    },
    chapters: {
      1: L("什一税", "The Tithe"),
      2: L("新兵", "The Making of a Guardsman"),
      3: L("绿潮", "The Green Tide"),
      4: L("雨中低语", "Whispers in the Rain"),
      5: L("虫影", "The Shadow"),
      6: L("无畏远征", "Indomitus"),
      7: L("黑色远征", "The Black Crusade"),
      8: L("最后的祷告", "Last Rites")
    },
    nodes: N
  });
})();
