/* data/factions/mechanicus.js — Adeptus Mechanicus route (text role: text-mechanicus). SPEC §3, §11, §16–§19, §20b, §23, §26, §27.
 * Player: a human menial on Forge World Gravex (阿尔科萨星区 / Arcosa Sector), one red mark from servitor conversion, 113.M42.
 * Climbs the Cult: menial → lexmechanic's menial → initiate → explorator scribe → a choice about how much flesh to keep.
 * Teaches: the Omnissiah, Mars & the Fabricator-General, Cawl (rumour, omen_cawl only), Magi/Tech-Priests, Skitarii;
 * machine spirits, STCs, tech-heresy, the Treaty of Olympus, servitors/menials, the Quest for Knowledge.
 * Enemies: the Dark Mechanicum, Necrons (an explorator tomb raid on Moonlet G-7), Orks (who steal everything).
 * Boss: Warsmith Syrredin's daemon engine. Sector links: Gravex sponsored the Thessa Null dig (necrons route),
 * ships lasguns to Aurex Secundus (imperium route); Valda's grain ships stopped coming (aeldari route).
 * Helpers as in necrons.js: L · S · C · X · RR · R · Q · O. Taint (SPEC §18) is hidden: never mentioned in text.
 */
(function () {
  function L(zh, en) { return {zh: zh, en: en}; }
  function S(sprite, zh, en) { return {sprite: sprite, name: {zh: zh, en: en}}; }
  function O() { var o = {}; for (var i = 0; i < arguments.length; i++) { var a = arguments[i]; if (a) for (var k in a) o[k] = a[k]; } return o; }
  function C(zh, en, next, extra) {
    var c = {text: {zh: zh, en: en}};
    if (next) c.next = next;
    if (extra) for (var k in extra) c[k] = extra[k];
    return c;
  }
  function X(effects, zh, en) { var o = {result: {zh: zh, en: en}}; if (effects) o.effects = effects; return o; }
  function RR(szh, sen, fzh, fen) { return {success: {zh: szh, en: sen}, fail: {zh: fzh, en: fen}}; }
  function R(p, stat, success, fail, rr) { var o = {roll: {p: p, stat: stat, success: success, fail: fail}}; if (rr) o.rollResult = rr; return o; }
  function Q(req, hide) { var o = {require: req}; if (hide) o.hideIfLocked = true; return o; }

  var GRIES    = S("hive_foreman", "监工格里斯", "Overseer Gries");
  var TOBINMAN = S("player_mechanicus", "托宾", "Tobin");
  var TOBIN    = S("servitor", "T-0B1N", "T-0B1N");
  var RUMM     = S("tech_priest", "铸工神甫鲁姆", "Enginseer Rumm");
  var VALLEN   = S("magos", "瓦伦贤者", "Magos Vallen");
  var OSSIA    = S("tech_priest", "书记神甫奥西娅", "Lexmechanic Ossia");
  var KESH     = S("skitarius", "凯什-43阿尔法", "Alpha Kesh-43");
  var HOLLON   = S("tech_priest", "数据铸匠赫隆", "Datasmith Hollon");
  var FULGUR   = S("electro_priest", "电祭司", "Electro-Priest");
  var CALANTIS = S("explorator", "探索贤者卡兰提斯", "Explorator Calantis");
  var MEK      = S("ork_mek", "兽人机械佬", "Ork Mek");
  var SYRREDIN = S("dark_mechanicus", "铸魔匠塞瑞丁", "Warsmith Syrredin");
  var OMNI     = S("omen_omnissiah", "金色齿轮", "The Golden Gear");
  var MARS     = S("omen_mars", "火星的广播", "Broadcast from Mars");
  var CAWL     = S("omen_cawl", "考尔的数据包", "Cawl's Data-Packet");
  var CLERK    = S("hive_foreman", "债务官", "The Debt Clerk");
  var KASTELAN = S("kastelan_robot", "卡斯特兰机器人", "Kastelan Robot");

  var N = {};

  /* ============ Chapter 1 · The Quota ============ */
  N.mech_101 = {chapter: 1, scene: "forge_floor", speaker: null,
    text: L("格拉维克斯，阿尔科萨星区唯一的铸造世界。天是红的，雨里有铁味。\n你是第七熔炉的杂役，编号G7-2291。\n配额板上，你的数字又是红的。三次红，就送去转化线。",
            "Gravex, the Arcosa Sector's only forge world. The sky is red; the rain tastes of iron.\nYou are a menial of the Seventh Furnace, number G7-2291.\nOn the quota board your number is red again. Three reds, and it's the conversion line."),
    codex: ["place_gravex", "mech_menials", "place_arcosa"],
    choices: [
      C("去配额板前看个清楚", "Go and read the quota board", "mech_102"),
      C("去找咳嗽的托宾", "Find Tobin, who's been coughing", "mech_103")
    ]};

  N.mech_102 = {chapter: 1, scene: "forge_floor", speaker: GRIES, time: {h: 1},
    text: L("监工格里斯用烙铁敲了敲你的数字。“两次红。”\n他身后，一台机仆推着矿车，脸上还留着一道你认识的伤疤。\n“再红一次，”他说，“你就再也不用吃饭了。”",
            "Overseer Gries taps your number with a branding rod. “Two reds.”\nBehind him a servitor pushes an ore cart. Its face still bears a scar you recognise.\n“One more,” he says, “and you'll never need to eat again.”"),
    choices: [
      C("连上两个班", "Work a double shift", "mech_104", X({hp: -10, renown: 3},
        "你在熔炉边站了二十个小时。数字变黄了，手掌变黑了。",
        "Twenty hours at the furnace. Your number turns yellow. Your palms turn black.")),
      C("求他宽限几天", "Beg him for a few days' grace", "mech_104", X({sanity: -5},
        "格里斯笑着在你的数字旁画了个小齿轮。“宽限已记录。利息另算。”",
        "Gries laughs and draws a tiny cog beside your number. “Grace logged. Interest extra.”")),
      C("趁他转身，顺走格里斯腰带上的口粮券", "While his back is turned, lift the ration chits from Gries's belt", "mech_104", X({hp: 5, renown: -2, set: {wronged_gries: true}},
        "你摸走了格里斯腰带上的两张券。他回头摸了摸空腰带，目光在整条线上扫了一圈，在你的数字上停了一下。",
        "You palm two chits from Overseer Gries's belt. He turns, pats the empty loop, sweeps his eyes down the line, and pauses on your number."))
    ]};

  N.mech_103 = {chapter: 1, scene: "forge_floor", speaker: TOBINMAN, time: {h: 1},
    text: L("托宾把半块口粮掰给你。“瓦尔达的粮船再没来过，口粮又减了。”\n他咳得很厉害，数字和你一样红。\n“要是我先进转化线，”他说，“记得我会哼什么歌。”",
            "Tobin breaks you half a ration bar. “The grain ships from Valda stopped coming. Rations cut again.”\nHe coughs hard. His number is as red as yours.\n“If I go to the line first,” he says, “remember what song I hum.”"),
    choices: [
      C("把口粮推回给他", "Push the ration back to him", "mech_104", X({hp: -5, sanity: 5, set: {tobinFriend: true, knowsTobin: true}},
        "他推辞两次，第三次收下了，然后哼起那首歌，跑调跑得很认真。",
        "He refuses twice and accepts the third time, then hums the song, earnestly off-key.")),
      C("收下，记住那首歌", "Take it, and learn the song", "mech_104", X({hp: 5, set: {tobinFriend: true, knowsTobin: true}},
        "口粮是灰的，有机油味。那首歌只有四个音，你记住了。",
        "The bar is grey and tastes of oil. The song has four notes. You remember them.")),
      C("趁托宾咳嗽，把他那份口粮也拿走", "While Tobin coughs, take his share of the ration too", "mech_104", X({hp: 5, sanity: -5, set: {knowsTobin: true, wronged_tobin: true}},
        "托宾弯着腰咳，没有拦你。你嚼着他那份口粮，味道像机油，也像你欠他的什么。",
        "Tobin is doubled over coughing and doesn't stop you. You chew his share of the bar. It tastes of oil, and of something you owe him."))
    ]};

  N.mech_104 = {chapter: 1, scene: "manufactorum", speaker: RUMM, time: {h: 6}, eventRoll: 0.3,
    text: L("冲压机停了，整条线跟着停。铸工神甫鲁姆绕着它摇香炉，念了三遍祷文。\n它不动。\n“机魂受了冒犯，”他说，“有人在它面前说了脏话。”杂役们都低下了头。",
            "The stamping press stops, and the whole line with it. Enginseer Rumm circles it swinging a censer, reciting the litany three times.\nIt doesn't move.\n“Its spirit is offended,” he says. “Someone swore in front of it.” Every menial stares at the floor."),
    codex: ["mech_machine_spirit", "imp_mechanicus"],
    choices: [
      C("跟着哼神甫的祷文", "Hum along with the enginseer's litany", null, R(0.5, "sanity", "mech_105", "mech_106",
        RR("你哼到第二句，冲压机打了个嗝，醒了。高处有一只镜头转向你。", "Halfway through your second line the press hiccups and wakes. High above, a lens turns toward you.",
           "你哼走了调。神甫瞪了你一眼，冲压机睡得更沉了。", "You drift off-key. The enginseer glares; the press sleeps deeper."))),
      C("按老杂役的规矩，拍它三下", "Slap it three times, the old menials' way", "mech_105", X({renown: 3, set: {tapped: true}},
        "左侧，右侧，再左侧。冲压机抖了抖，像被人挠醒。神甫假装没看见。",
        "Left side, right side, left again. The press shivers as if tickled awake. The enginseer pretends not to see.")),
      C("踢它一脚", "Kick it", "mech_106", X({hp: -10, taint: {khorne: 25}},
        "你的脚趾比钢板先认输。疼痛让你想再踢一脚。",
        "Your toes surrender before the steel does. The pain makes you want to kick again."))
    ]};

  N.mech_105 = {chapter: 1, scene: "manufactorum", speaker: VALLEN, time: {h: 1},
    text: L("一位贤者从步道上降下来，袍下伸出六根机械触手。\n“巧合是一个变量，”瓦伦贤者说，“我记录变量。”\n触手读走了你的编号。“送去转化线。评估。”",
            "A Magos descends from the gantry, six mechadendrites trailing from his robe.\n“Coincidence is a variable,” says Magos Vallen. “I record variables.”\nA tendril reads your number. “Send it to the conversion line. For assessment.”"),
    effects: {renown: 5, set: {noticed: true}},
    codex: ["mech_magi"],
    choices: [
      C("鞠躬", "Bow", "mech_107", X({renown: 2},
        "你鞠躬的角度大概不合规程，但贤者的镜头记下了它。",
        "Your bow is probably not to regulation, but the Magos's lens records it.")),
      C("问他机魂是不是真的", "Ask him if machine spirits are real", "mech_107", X({sanity: -3},
        "贤者停了半秒。“问题已记录。答案需要更高权限。”",
        "The Magos pauses half a second. “Query logged. The answer requires higher clearance.”"))
    ]};

  N.mech_106 = {chapter: 1, scene: "forge_floor", speaker: GRIES, time: {d: 2},
    text: L("第三次红。格里斯亲手把你的数字从板上擦掉，像擦掉一点油污。\n托宾的数字也没了。\n两个护教军走过来，一左一右，步伐整齐得像同一个人。",
            "Third red. Gries wipes your number off the board himself, like a smear of grease.\nTobin's number is gone too.\nTwo Skitarii approach, one on each side, moving in step like a single person."),
    effects: {sanity: -5},
    choices: [
      C("跟他们走", "Go with them", "mech_107"),
      C("挣扎", "Struggle", "mech_107", X({hp: -10},
        "护教军没打你，只是握得更紧。他们的手是机器，不会累。",
        "The Skitarii don't strike you. They just grip tighter. Their hands are machines; they don't tire."))
    ]};

  N.mech_107 = {chapter: 1, scene: "manufactorum", speaker: null, time: {h: 3},
    text: L("转化线前排着长队。手术台在尽头，上方挂着一排待装的机械臂。\n排在你前面的杂役回头冲你笑了笑，开始哼一首只有四个音的歌。\n轮到他了。然后，轮到你。",
            "The conversion line is long. The surgery table waits at its end, mechanical arms hanging above it.\nThe menial ahead of you turns, smiles, and starts humming a song of four notes.\nHis turn comes. Then yours."),
    codex: ["imp_servitor"],
    choices: [
      C("报出贤者记下的编号", "Give the number the Magos recorded", "mech_108", O(Q({flag: "noticed"}), X({renown: 5},
        "神甫查了查数据圈，把你推向另一扇门。前面那个人没有回头。",
        "The priest checks the noosphere and pushes you toward another door. The man ahead never looks back."))),
      C("背出一段刚听来的祷文", "Recite a litany you overheard", null, R(0.55, "sanity", "mech_108", "mech_109",
        RR("你背得磕磕巴巴，但每个音都对。神甫歪了歪头，记下一笔。", "You stumble, but every syllable is right. The priest tilts his head and notes something.",
           "你背错了一个音。神甫连头都没抬。", "You get one syllable wrong. The priest doesn't even look up."))),
      C("把前面那人往后拽", "Pull the man ahead back out of line", "mech_109", X({hp: -10, sanity: -5, set: {pulledTobin: true}},
        "你拽住他的袖子。护教军把你们分开，像拆开两根缠住的电线。",
        "You grab his sleeve. The Skitarii pull you apart like two tangled cables.")),
      C("把托宾往前推，抢出十分钟", "Shove Tobin ahead of you and buy ten minutes", "mech_109", O(Q({flag: "knowsTobin"}, true), X({sanity: -5, set: {wronged_tobin: true}},
        "你把托宾往前一推。他回头看你，没生气，像早就料到，然后继续哼歌。你多出了十分钟，他多出了一张台。",
        "You shove Tobin forward. He glances back, not angry, as if he expected it, and goes on humming. You gain ten minutes. He gains a table.")))
    ]};

  N.mech_109 = {chapter: 1, scene: "manufactorum", speaker: OSSIA, time: {h: 1},
    text: L("你被按上手术台。一个戴单片镜的书记神甫路过，停下来看了看你的手。\n“这只手在桌面上数铆钉，”她说，“数得比计算机快。谁送它来的？”\n手术锯停在半空。",
            "They press you onto the table. A lexmechanic with a monocle passes, stops, and looks at your hand.\n“This hand is counting the rivets on the table,” she says. “Faster than a cogitator. Who sent it here?”\nThe surgical saw halts in mid-air."),
    choices: [
      C("“我还会数别的！”", "“I can count other things too!”", "mech_108", X({renown: 3},
        "她挑了挑眉，把你从台上拉下来。“证明给我看。”",
        "She raises an eyebrow and pulls you off the table. “Prove it.”")),
      C("“也看看前面那个人！”", "“Look at the man before me too!”", "mech_108", X({sanity: -5, set: {askedTobin: true}},
        "她看了一眼隔壁台。“那一个已经开始了。”她的声音没有起伏，只是走得快了些。",
        "She glances at the next table. “That one has already begun.” Her voice is flat; she just walks a little faster.")),
      C("闭上眼，不挣扎了", "Close your eyes and stop fighting", "mech_end_servitor", O(Q([{notFlag: "origin_conscript"}, {stat: "hp", max: 80}], true), X({sanity: -10},
        "你闭上眼。锯子重新转起来，那首四个音的歌越来越远。",
        "You close your eyes. The saw spins up again; the four-note song fades away."))),
      C("任由恐惧把你淹没", "Let the fear drown you", "mech_end_servitor", O(Q([{flag: "origin_conscript"}, {stat: "sanity", max: 70}], true), X({sanity: -10},
        "没有晶片替你关掉恐惧了。你抖得说不出话，神甫把这记录为“同意”。",
        "There's no wafer to switch the fear off now. You shake too hard to speak; the priest logs it as consent.")))
    ]};

  N.mech_108 = {chapter: 1, scene: "tech_vault", speaker: OSSIA, time: {d: 1},
    text: L("“书记神甫奥西娅，”她说，“现在你是我的杂役。别感动，我只是缺个会数数的。”\n第七圣库里堆满了没人读过的数据板。\n“按神圣顺序排好。哪种顺序？你自己猜。”",
            "“Lexmechanic Ossia,” she says. “You're my menial now. Don't be moved. I just needed something that counts.”\nThe Seventh Vault is stacked with data-slates nobody has read.\n“Sort them in sacred order. Which order? Guess.”"),
    effects: {set: {apprentice: true}},
    codex: ["place_gravex_vault"],
    choices: [
      C("按日期排", "Sort by date", "mech_201", X({renown: 3},
        "你排了三天。奥西娅检查了一遍，没有夸你，只是又搬来三箱。",
        "Three days of sorting. Ossia checks it, offers no praise, and brings three more crates.")),
      C("按灰尘的厚度排", "Sort by the thickness of the dust", "mech_201", X({sanity: 5},
        "奥西娅看了很久。“灰尘也是时间。这个答案……可以接受。”",
        "Ossia studies it a long time. “Dust is also time. That answer is… acceptable.”"))
    ]};

  /* ---------- Origin prologue · Hive-born savant ---------- */
  N.mech_o_savant_1 = {chapter: 1, scene: "hive_hab", speaker: CLERK,
    text: L("你在格拉维克斯的居住尖塔长大，念过三年经院，背得出四千位数字。\n后来家里欠了神教的电费。\n债务官翻开账本：“抵债。你的脑子，十年。”",
            "You grew up in Gravex's hab-spire: three years of scholam, four thousand digits memorised.\nThen your family fell behind on the Cult's power tithe.\nThe debt clerk opens his ledger. “Payment in kind. Your brain. Ten years.”"),
    codex: ["place_gravex", "place_arcosa"],
    choices: [
      C("签字", "Sign", "mech_o_savant_2", X({renown: 3},
        "签名时你顺手纠正了他账本上的一处加法。他没有谢你。",
        "As you sign you correct an addition in his ledger. He doesn't thank you.")),
      C("要求看合同细则", "Demand to read the fine print", "mech_o_savant_2", X({sanity: -5, set: {readContract: true}},
        "细则第九条：若债务人失去计算价值，转作机仆抵偿余额。",
        "Clause nine: should the debtor lose computational value, convert to servitor to settle the balance."))
    ]};

  N.mech_o_savant_2 = {chapter: 1, scene: "manufactorum", speaker: GRIES, time: {d: 3},
    text: L("你被分到第七熔炉，负责用眼睛给铆钉计数。\n第三天你发现，配额板上的数比实际少一成。少掉的那一成，进了监工格里斯的口袋。\n他注意到你在看。",
            "You're assigned to the Seventh Furnace, counting rivets by eye.\nOn day three you notice the quota board reads a tenth short. That tenth goes into Overseer Gries's pocket.\nHe notices you looking."),
    codex: ["mech_menials"],
    choices: [
      C("当面指出", "Point it out to his face", "mech_o_savant_3", X({renown: 5, hp: -10},
        "格里斯没否认，只罚你搬了一夜矿渣。第二天，你的数字是红的。",
        "Gries doesn't deny it. He just has you haul slag all night. Next day your number is red.")),
      C("装作没看见", "Pretend you saw nothing", "mech_o_savant_3", X({sanity: -5},
        "你低头继续数。数字很准，良心不太准。",
        "You lower your head and keep counting. The numbers are accurate. Your conscience, less so.")),
      C("匿名举报格里斯克扣配额", "Report Gries's skimming anonymously", "mech_o_savant_3", X({renown: 3, set: {wronged_gries: true}},
        "巡查书记查了格里斯的账，罚了他三个月的烙铁津贴。他认得那手字：整座熔炉，只有你那样写小数点。",
        "The inspecting clerk audits Gries's books and docks his branding-rod allowance for three months. He knows the hand: on this furnace, nobody else writes decimals that way."))
    ]};

  N.mech_o_savant_3 = {chapter: 1, scene: "tech_vault", speaker: OSSIA, time: {d: 2},
    text: L("一位书记神甫来熔炉借人：圣库的计算机坏了，需要有人心算校对。\n奥西娅考了你一道题，又一道，又一道。\n“你的大脑，”她说，“是一台没装外壳的计算机。”",
            "A lexmechanic comes to borrow a menial: the Vault's cogitator is down and someone must check sums by hand.\nOssia tests you with one problem, then another, then another.\n“Your brain,” she says, “is a cogitator without a casing.”"),
    codex: ["place_gravex_vault"],
    choices: [
      C("答对，再指出她题里的错", "Answer, then correct her question", "mech_o_savant_4", X({renown: 5, set: {noticed: true}},
        "奥西娅沉默片刻，在数据板上记下你的编号。“我会再来借你。”",
        "Ossia is silent a moment, then logs your number. “I'll borrow you again.”")),
      C("故意答错一题，免得惹眼", "Miss one on purpose, to stay unnoticed", "mech_o_savant_4", X({sanity: 3},
        "她点点头，把你送回熔炉。低调是一种安全，也是一种浪费。",
        "She nods and sends you back. Keeping low is safe. It's also a waste."))
    ]};

  N.mech_o_savant_4 = {chapter: 1, scene: "forge_floor", speaker: GRIES, time: {d: 4},
    text: L("第三次红。格里斯擦掉你的数字时凑近说：“会数数的人，进了转化线也能数。”\n两个护教军一左一右架起你。\n你开始默数步子：一百一十七步，到转化线。",
            "Third red. As Gries wipes your number he leans close. “A counting man can count on the conversion line too.”\nTwo Skitarii take you by the arms.\nYou count the steps: one hundred and seventeen, to the line."),
    effects: {sanity: -5},
    choices: [
      C("继续数", "Keep counting", "mech_107")
    ]};

  /* ---------- Origin prologue · Skitarii conscript ---------- */
  N.mech_o_conscript_1 = {chapter: 1, scene: "barracks", speaker: KESH,
    text: L("你抽中了护教军辅兵的签。手术只花了十分钟：后颈多了一个插槽。\n凯什-43阿尔法插进一枚晶片，你突然不怕了，不怕得很奇怪。\n“恐惧已关闭，”她说，“以后由我决定你什么时候怕。”",
            "Your lot was drawn for the Skitarii auxilia. The surgery took ten minutes: a socket in the back of your neck.\nAlpha Kesh-43 slots in a wafer and suddenly you're unafraid. Strangely so.\n“Fear disabled,” she says. “From now on, I decide when you're afraid.”"),
    codex: ["mech_skitarii", "place_gravex", "place_arcosa"],
    choices: [
      C("向她敬礼", "Salute her", "mech_o_conscript_2", X({renown: 3},
        "你的手抬得太快，像被线拉着。凯什点头：“同步率良好。”",
        "Your hand snaps up too fast, as if on a string. Kesh nods. “Synchronisation nominal.”")),
      C("摸后颈的插槽", "Touch the socket on your neck", "mech_o_conscript_2", X({sanity: -5},
        "插槽是凉的。你摸到它时，晶片里的勇气轻轻颤了一下。",
        "The socket is cold. As you touch it, the courage in the wafer flickers."))
    ]};

  N.mech_o_conscript_2 = {chapter: 1, scene: "ruins", speaker: KESH, foe: "gretchin", time: {d: 5},
    text: L("实弹演练在渣场进行。靶子是活的：一群溜进来偷废料的绿皮小东西。\n“辐射卡宾枪，”凯什说，“别站在下风口。”\n一只小绿皮抱着半个齿轮，冲你做鬼脸。",
            "Live-fire drill on the slag fields. The targets are alive: a pack of little greenskins sneaking in to steal scrap.\n“Radium carbine,” says Kesh. “Don't stand downwind.”\nOne little greenskin hugs half a cog and pulls faces at you."),
    codex: ["xenos_ork"],
    choices: [
      C("开火", "Fire", "mech_o_conscript_3", X({hp: -10, renown: 5, taint: {khorne: 25}},
        "你命中了。卡宾枪的辐射也命中了你，牙龈开始发麻。",
        "You hit it. The carbine's radiation hits you too; your gums go numb.")),
      C("朝天鸣枪吓走它", "Fire into the air to scare it off", "mech_o_conscript_3", X({renown: -3, sanity: 5},
        "小东西扔下齿轮逃了。凯什记录：“射击偏差：情感性。”",
        "The little thing drops the cog and flees. Kesh logs: “Firing deviation: emotional.”"))
    ]};

  N.mech_o_conscript_3 = {chapter: 1, scene: "barracks", speaker: KESH, time: {d: 10},
    text: L("第十天，你的身体开始排斥插槽。后颈发烫，晶片里的命令变成了杂音。\n凯什给你做了检测，没有表情。\n“组织排异。不适合护教军，”她说，“适合别的用途。”",
            "On day ten your body starts rejecting the socket. Your neck burns; the wafer's commands turn to static.\nKesh tests you, expressionless.\n“Tissue rejection. Unfit for the Skitarii,” she says. “Fit for other purposes.”"),
    effects: {hp: -10},
    choices: [
      C("“我还能打！”", "“I can still fight!”", "mech_o_conscript_4", X({renown: 3, set: {noticed: true}},
        "凯什停顿了一下，在你的档案里加了一行备注，没告诉你写了什么。",
        "Kesh pauses and adds a line to your file. She doesn't tell you what it says.")),
      C("“什么用途？”", "“What purposes?”", "mech_o_conscript_4", X({sanity: -5},
        "她指了指窗外。一列机仆推着矿车，步伐整齐，和护教军一模一样。",
        "She points out the window. A file of servitors pushes ore carts, perfectly in step, just like Skitarii."))
    ]};

  N.mech_o_conscript_4 = {chapter: 1, scene: "forge_floor", speaker: null, time: {h: 6},
    text: L("他们拔掉了你的晶片。恐惧一下子全回来了，连同这十天欠下的份。\n你被编进一队杂役，押往转化线。\n队伍里有个咳嗽的人在哼歌，只有四个音。",
            "They pull your wafer. All the fear comes back at once, with ten days' interest.\nYou're added to a file of menials, marched to the conversion line.\nSomeone in the file is coughing and humming a song. Four notes."),
    effects: {sanity: -5},
    choices: [
      C("问他叫什么", "Ask his name", "mech_107", X({set: {tobinFriend: true, knowsTobin: true}},
        "“托宾，”他说，“要是我先进去，记住这首歌。”",
        "“Tobin,” he says. “If I go in first, remember the song.”")),
      C("低头走路", "Keep your head down", "mech_107")
    ]};

  /* ============ Chapter 2 · The Lexmechanic ============ */
  N.mech_201 = {chapter: 2, scene: "tech_vault", speaker: OSSIA, time: {d: 20},
    text: L("二十天后，你学会了十六句二进制祷词。奥西娅说，这相当于会说“你好”和“请原谅我”。\n“机器能听懂你了，”她说，“但它不一定原谅你。”",
            "Twenty days on you've learned sixteen binary prayers. Ossia says that's like knowing “hello” and “forgive me.”\n“The machines can understand you now,” she says. “That doesn't mean they forgive you.”"),
    codex: ["mech_noosphere"],
    choices: [
      C("通宵练习二进制", "Practise binary all night", "mech_202", X({sanity: -3, renown: 5},
        "你在梦里也用0和1说话。醒来时，你的牙齿在打拍子。",
        "You dream in ones and zeros. When you wake, your teeth are keeping time.")),
      C("问她机仆还记不记得从前", "Ask her if servitors remember", "mech_202", X({set: {askedServitor: true}},
        "奥西娅停下笔。“正式答案：不记得。”她顿了顿，“非正式答案：去问问它们。”",
        "Ossia stops writing. “Official answer: no.” A pause. “Unofficial answer: go and ask them.”"))
    ]};

  N.mech_202 = {chapter: 2, scene: "forge_floor", speaker: TOBIN, time: {h: 4},
    grudgeLine: {npc: "gries", text: L("这是格里斯监工管的炉子。他叉着手站在炉口，目光钉在你身上。", "This is Overseer Gries's furnace. He stands arms folded at the furnace mouth, eyes fixed on you.")},
    text: L("一台机仆在熔炉边搬钢锭，编号牌上写着T-0B1N。是转化线上排在你前面的那个人。\n它的嘴不会说话了，喉咙里却在哼一首歌。四个音，跑调跑得很认真。\n它没有看你。",
            "A servitor hauls ingots by the furnace. Its plate reads T-0B1N. It is the man who stood ahead of you on the line.\nIts mouth no longer speaks, but its throat hums a song. Four notes, earnestly off-key.\nIt doesn't look at you."),
    codex: ["mech_menials"],
    choices: [
      C("跟着哼", "Hum along", "mech_203", O({grudge: {npc: "gries", effects: {hp: -6},
          note: L("格里斯在场：你在他的炉前偷懒，他会罚你多搬钢锭。", "Gries is watching: loitering at his furnace, you'll be docked extra ingots.")}},
        X({sanity: 5, set: {tobinSong: true, keeper: true}},
        "你哼第二遍时，它的手停了半秒。只有半秒。然后钢锭继续往前走。",
        "On your second time through, its hands stop for half a second. Only half. Then the ingots move on."))),
      C("别过脸去", "Look away", "mech_203", X({sanity: -5},
        "歌声一直跟着你，直到被熔炉的轰鸣吞掉。",
        "The humming follows you until the furnace's roar swallows it.")),
      C("替它擦掉脸上的油", "Wipe the oil from its face", "mech_203", X({hp: -5, sanity: 3, set: {tobinSong: true, keeper: true}},
        "钢锭的热度隔着布烫伤了你的手。它的脸干净了。它不会知道。",
        "The ingot's heat burns your hand through the cloth. Its face is clean now. It will never know."))
    ]};

  N.mech_203 = {chapter: 2, scene: "tech_vault", speaker: VALLEN, time: {d: 3},
    text: L("瓦伦贤者让你抄录一块残片：标准模板构造，黑暗科技时代的遗物，缺了三成。\n“我们不发明，”他说，“我们回忆。人类曾经知道一切，后来忘了。”\n“我们的工作是把它想起来。”",
            "Magos Vallen sets you to copy a fragment: a Standard Template Construct, relic of the Dark Age of Technology, a third of it missing.\n“We do not invent,” he says. “We remember. Humanity once knew everything, then forgot.”\n“Our work is to recall it.”"),
    codex: ["mech_stc", "mech_quest_knowledge"],
    choices: [
      C("一笔一画照抄", "Copy it stroke for stroke", "mech_204", X({renown: 5},
        "你连残片上的划痕都抄了下来。贤者说，划痕也可能是神圣的。",
        "You copy even the scratches. The Magos says scratches may also be sacred.")),
      C("“缺的部分，为什么不自己补？”", "“Why not complete the missing part ourselves?”", "mech_204", X({renown: -3, set: {askedNew: true}},
        "贤者的触手全停住了。“上一个问这个问题的人，现在在搬钢锭。”",
        "All his mechadendrites freeze. “The last one to ask that now hauls ingots.”"))
    ]};

  N.mech_204 = {chapter: 2, scene: "tech_vault", speaker: OSSIA, time: {d: 6},
    text: L("深夜，奥西娅给你看一个小东西：一把她自己设计的扳手，能拧七种规格的螺栓。\n没有STC，没有先例。是她想出来的。\n“它很好用，”她低声说，“这就是异端。”",
            "Late at night Ossia shows you something small: a spanner she designed herself, fitting seven bolt gauges.\nNo STC, no precedent. She thought of it.\n“It works beautifully,” she whispers. “That's what makes it heresy.”"),
    codex: ["mech_tech_heresy"],
    choices: [
      C("帮她改进设计", "Help her improve the design", "mech_205", X({renown: 3, set: {ossiaFriend: true}, taint: {tzeentch: 25}},
        "你们改到天亮。第八种规格成功时，你笑出了声，把自己吓了一跳。",
        "You work till dawn. When the eighth gauge works you laugh aloud, startling yourself.")),
      C("劝她熔掉它", "Urge her to melt it down", "mech_205", X({set: {ossiaWarned: true}},
        "她沉默很久，把扳手放进抽屉。没熔，也没再拿出来。",
        "She's silent a long time, then puts it in a drawer. Not melted. Not taken out again.")),
      C("报告瓦伦贤者", "Report it to Magos Vallen", "mech_206", X({renown: 10, sanity: -10, set: {reportedOssia: true, wronged_ossia: true}},
        "贤者听完，只说了一个词：“确认。”那晚圣库的门第一次在你身后锁上。",
        "The Magos listens and says one word: “Confirmed.” That night the Vault door locks behind you for the first time."))
    ]};

  N.mech_205 = {chapter: 2, scene: "tech_vault", speaker: KESH, time: {d: 2}, eventRoll: 0.35,
    text: L("护教军包围了圣库。凯什-43阿尔法宣布：“侦测到未授权设计。技术异端。”\n她的辐射卡宾枪扫过每一张脸，在你脸上多停了一秒。\n奥西娅的抽屉就在你身后。",
            "Skitarii surround the Vault. Alpha Kesh-43 announces: “Unsanctioned design detected. Tech-heresy.”\nHer radium carbine sweeps every face and lingers a second on yours.\nOssia's drawer is right behind you."),
    codex: ["mech_skitarii"],
    choices: [
      C("平静地说谎", "Lie, calmly", null, R(0.5, "sanity", "mech_207", "mech_206",
        RR("“这里只有档案，阿尔法。”你的声音稳得像校准过的机器。她走了。", "“Only archives here, Alpha.” Your voice is steady as a calibrated machine. She leaves.",
           "你说谎时眨了一下眼。凯什的镜头捕捉到了。抽屉被拉开了。", "You blink as you lie. Kesh's lens catches it. The drawer is opened."))),
      C("“是我做的。”", "“I made it.”", "mech_207", X({hp: -15, renown: -5, set: {tookBlame: true, ossiaFriend: true}},
        "电鞭抽了你十二下，每下都很准。奥西娅在旁边看着，指甲掐进手心。",
        "The electro-flail strikes twelve times, each exact. Ossia watches, nails digging into her palms.")),
      C("看向奥西娅，把她交出去", "Look at Ossia, giving her up", "mech_206", X({sanity: -5, set: {wronged_ossia: true}},
        "你什么也没说，只是看了奥西娅一眼。对凯什来说，一眼就够了。",
        "You say nothing. You only glance at Ossia. For Kesh, a glance is enough."))
    ]};

  N.mech_206 = {chapter: 2, scene: "tech_vault", speaker: VALLEN, time: {d: 1},
    text: L("审判很快。奥西娅被剥夺职衔，发配到外围熔炉做忏悔劳役。\n她被带走时没有看你。\n瓦伦贤者把她的单片镜交给你。“职位空缺，”他说，“效率要求填补。”",
            "The judgement is quick. Ossia is stripped of rank and sent to penance labour at the outer furnaces.\nShe doesn't look at you as they take her.\nMagos Vallen hands you her monocle. “A vacancy,” he says. “Efficiency demands it be filled.”"),
    effects: {renown: 5, sanity: -5, set: {ossiaGone: true}},
    choices: [
      C("戴上单片镜", "Put on the monocle", "mech_207", X({renown: 3},
        "镜片里还留着她的校准参数。整个世界看起来都有点歪。",
        "The lens still holds her calibration. The whole world looks slightly askew.")),
      C("收起来，不戴", "Pocket it, unworn", "mech_207", X({sanity: 3},
        "你把它放进口袋。它很沉，比它该有的重量沉。",
        "You pocket it. It's heavy there, heavier than it should be."))
    ]};

  N.mech_207 = {chapter: 2, scene: "forge_floor", speaker: FULGUR, time: {d: 10},
    text: L("格拉维克斯的建厂日。电祭司们赤着上身走过熔炉，皮肤上爬满蓝色电弧。\n人群伸手去碰，被电得倒地，又爬起来笑。\n一位电祭司向你伸出手：“原动力在召唤你。”",
            "Gravex's Founding Day. Electro-priests walk bare-chested past the furnaces, blue arcs crawling over their skin.\nThe crowd reaches out to touch them, gets knocked flat, and gets up laughing.\nAn electro-priest holds out a hand. “The Motive Force calls you.”"),
    codex: ["mech_electro_priests"],
    choices: [
      C("握住那只手", "Take the hand", "mech_208", X({hp: -8, renown: 5, sanity: 5},
        "你醒来时躺在地上，头发竖着，心跳像一台新校准的泵。周围的人在鼓掌。",
        "You wake on the floor, hair on end, heart beating like a freshly calibrated pump. People applaud.")),
      C("鞠躬，退后", "Bow and step back", "mech_208", X({renown: -2},
        "电祭司收回手，没生气。“下次。”他的指尖在空气里留下焦味。",
        "The priest withdraws his hand without offence. “Next time.” His fingertips leave a scorched smell."))
    ]};

  N.mech_208 = {chapter: 2, scene: "mars_vista", speaker: MARS, time: {h: 2},
    text: L("节日的高潮：一段来自火星的广播，在数据圈里迟到了四十年。\n画面里，红色星球被熔炉的光环包围。一个声音宣读铸造将军的诏令：什一税提高，祈祷加倍。\n全场的神甫同时跪下。",
            "The festival's climax: a broadcast from Mars, forty years late through the noosphere.\nOn screen the Red Planet is ringed with forge-light. A voice reads the Fabricator-General's decree: tithes raised, prayers doubled.\nEvery tech-priest kneels at once."),
    codex: ["place_mars", "mech_fabricator_general"],
    choices: [
      C("问身边的神甫：火星听帝皇的吗", "Ask a priest: does Mars obey the Emperor?", "mech_209", X({set: {askedTreaty: true}},
        "神甫想了想。“火星听万机之神的。帝皇就是万机之神。所以……是的。大概。”",
        "The priest considers. “Mars obeys the Omnissiah. The Emperor is the Omnissiah. So… yes. Roughly.”")),
      C("跟着跪下", "Kneel with them", "mech_209", X({renown: 3},
        "地板是热的。四十年前的声音在你头顶念完了最后一个数字。",
        "The floor is warm. A forty-year-old voice finishes its last number above your head."))
    ]};

  N.mech_209 = {chapter: 2, scene: "tech_vault", speaker: VALLEN, time: {d: 5},
    text: L("瓦伦贤者召见你。“帝皇登上火星，我们认出了他，订立了奥林匹斯条约。”\n“火星给帝国枪炮，帝国给火星自由。今天，我们的激光枪还在运往奥雷克斯二号。”\n“你可以申请入教了。”",
            "Magos Vallen summons you. “The Emperor came to Mars, we recognised him, and the Treaty of Olympus was sealed.”\n“Mars gives the Imperium guns; the Imperium gives Mars freedom. Today our lasguns still ship to Aurex Secundus.”\n“You may petition for initiation.”"),
    codex: ["mech_treaty_olympus", "place_aurex"],
    choices: [
      C("背出整座圣库的索引", "Recite the Vault's entire index", "mech_301", O(Q({flag: "origin_savant"}, true), X({renown: 10},
        "你背了四十分钟。贤者听完，第一次用“我们”称呼你。",
        "You recite for forty minutes. When you finish, the Magos calls you “we” for the first time."))),
      C("“我申请。”", "“I petition.”", "mech_301", X({renown: 5},
        "贤者在数据圈里给你开了新档案。名字一栏，暂时空着。",
        "The Magos opens a new file for you in the noosphere. The name field stays blank for now.")),
      C("“入教要换掉多少肉？”", "“How much flesh does initiation cost?”", "mech_301", X({sanity: -5},
        "“第一次，一点点，”他说，“之后，取决于你有多想靠近神。”",
        "“The first time, a little,” he says. “After that, it depends how close to the god you wish to be.”"))
    ]};

  /* ============ Chapter 3 · Initiation ============ */
  N.mech_301 = {chapter: 3, scene: "manufactorum", speaker: VALLEN, time: {d: 14},
    text: L("入教仪式。焚香呛得你流泪，十二位神甫用二进制合唱，赞美万机之神。\n瓦伦贤者举着三样东西：一只光学眼、一根机械触手、一块空白的铭牌。\n“第一次改造。选一样，或者选择不选。”",
            "The initiation rite. Incense makes your eyes stream; twelve priests chant the Omnissiah's praise in binary.\nMagos Vallen holds up three things: an optical eye, a mechadendrite, a blank name-plate.\n“Your first augmentation. Choose one. Or choose not to.”"),
    codex: ["mech_omnissiah"],
    choices: [
      C("光学眼", "The optical eye", "mech_302", X({hp: -10, renown: 5, set: {aug: true}},
        "旧眼睛被取走时不疼。疼的是新眼睛第一次看见你自己的数据。",
        "Losing the old eye doesn't hurt. What hurts is the new eye's first look at your own data.")),
      C("机械触手", "The mechadendrite", "mech_302", X({hp: -15, renown: 8, set: {aug: true}},
        "触手接上脊椎的那一刻，你多了一只手，也多了一种挠不到的痒。",
        "When it meets your spine you gain a hand, and an itch you can never reach.")),
      C("空白铭牌：暂时不改", "The blank plate: no change, for now", "mech_302", X({renown: -5, set: {fleshFirst: true}},
        "合唱停了一拍。瓦伦贤者把铭牌交给你：“血肉是一种拖延。”",
        "The chant skips a beat. Vallen hands you the plate. “Flesh is a form of procrastination.”"))
    ]};

  N.mech_302 = {chapter: 3, scene: "manufactorum", speaker: null, time: {d: 3},
    text: L("新的你需要磨合。夜里，你听见身体里有两种声音：心跳，和风扇。\n其他初学者在比较植入体的型号，像比较勋章。\n有人说，火星上的贤者全身没有一块原装零件。",
            "The new you needs breaking in. At night you hear two sounds in your body: a heartbeat, and a fan.\nThe other initiates compare implant models like medals.\nSomeone says the Magi of Mars have not one original part left."),
    choices: [
      C("申请一个更好的型号", "Apply for a better model", "mech_303", X({hp: -5, renown: 3, taint: {slaanesh: 40}},
        "新型号更安静、更精准。你盯着它看了很久，想象下一个会有多完美。",
        "The new model is quieter, more precise. You stare at it a long time, imagining how perfect the next will be.")),
      C("念点火祷文，安抚新零件", "Recite the Litany of Ignition to settle it", "mech_303", X({sanity: 5},
        "你念了七遍。风扇和心跳慢慢对上了拍子。",
        "Seven recitations. Slowly the fan and the heartbeat fall into step."))
    ]};

  N.mech_303 = {chapter: 3, scene: "barracks", speaker: KESH, time: {d: 2},
    text: L("你被派给凯什-43的护教军分队当书记。她九成是机器，剩下一成归教条晶片管。\n“圣库，”她说，“我见过你。我记得所有见过的东西。”\n听起来不像是在夸自己。",
            "You're assigned as lexmechanic to Kesh-43's Skitarii maniple. She's nine-tenths machine; the rest belongs to her doctrina wafers.\n“The Vault,” she says. “I've seen you. I remember everything I've seen.”\nIt doesn't sound like a boast."),
    codex: ["mech_skitarii"],
    choices: [
      C("“你记得自己的名字吗？”", "“Do you remember your name?”", "mech_304", X({sanity: -5, set: {keshTalk: true}},
        "她停了三秒，对护教军来说很久。“名字字段已覆写。保留一个音节：‘凯’。”",
        "She pauses three seconds, an age for a Skitarius. “Name field overwritten. One syllable retained: ‘Ke’.”")),
      C("专心记录分队数据", "Focus on logging the maniple's data", "mech_304", X({renown: 3},
        "报表一个数都没错。凯什把它转发给瓦伦贤者，附言：可用。",
        "Not one wrong digit. Kesh forwards the report to Vallen, annotated: usable.")),
      C("“我认识这种晶片。”", "“I know these wafers.”", "mech_304", O(Q({flag: "origin_conscript"}, true), X({renown: 5, set: {keshTalk: true}},
        "凯什看了看你后颈的伤疤。“排异者。”她停了停，“你比大多数人撑得久。”",
        "Kesh looks at the scar on your neck. “A rejector.” A pause. “You lasted longer than most.”")))
    ]};

  N.mech_304 = {chapter: 3, scene: "ruins", speaker: HOLLON, foe: "kastelan_robot", time: {d: 4},
    text: L("渣场试炮。一台卡斯特兰机器人站在那里，高得像钟楼。\n数据铸匠赫隆往它胸口插指令晶片：“它只做晶片说的事。它不许思考。思考是罪。”\n机器人的头微微转向你，像在等你开口。",
            "Gunnery trial on the slag fields. A Kastelan robot stands there, tall as a bell tower.\nDatasmith Hollon slots protocol wafers into its chest. “It does only what the wafer says. It may not think. Thinking is sin.”\nThe robot's head turns slightly toward you, as if waiting for you to speak."),
    codex: ["mech_kastelan"],
    choices: [
      C("替赫隆校对指令", "Proofread Hollon's protocols", null, R(0.55, "renown", "mech_305", "mech_306",
        RR("指令无误。机器人举拳，把靶子砸进了地里。赫隆点头。", "Protocols correct. The robot raises a fist and drives the target into the ground. Hollon nods.",
           "你漏了一个分号。机器人转身，朝错误的方向开了火。", "You miss a semicolon. The robot turns and fires the wrong way."))),
      C("对它的机魂念祷文", "Pray to its machine spirit", "mech_305", X({sanity: -3, renown: 3},
        "机器人听完，胸口的灯闪了两下。赫隆说这是故障。你不太确定。",
        "The robot listens; its chest light blinks twice. Hollon calls it a fault. You're not so sure.")),
      C("请求亲手试射", "Ask to fire it yourself", "mech_305", X({hp: -5, renown: 3, taint: {khorne: 30}},
        "后坐力把你掀翻在地。你爬起来的第一个念头是：再来一次。",
        "The recoil throws you flat. Your first thought as you rise: again."))
    ]};

  N.mech_306 = {chapter: 3, scene: "ruins", speaker: HOLLON, foe: "kastelan_robot", time: {h: 1},
    text: L("炮弹落在观礼台边上。弹片飞过时，你听见赫隆在喊一个分号。\n你趴在渣堆里，耳朵嗡嗡作响，在流血。\n机器人停了火，安静地站着，像在为自己做错的事发呆。",
            "The shell lands beside the viewing stand. As shrapnel flies you hear Hollon shouting about a semicolon.\nYou lie in the slag, ears ringing, bleeding.\nThe robot ceases fire and stands quiet, as if puzzling over what it did wrong."),
    effects: {hp: -12},
    choices: [
      C("爬起来，修正指令", "Get up and fix the protocol", "mech_307", X({renown: 3},
        "你改好了分号。机器人重新开火，这次命中。赫隆没说谢谢。",
        "You fix the semicolon. The robot fires again and hits. Hollon doesn't say thanks."))
    ]};

  N.mech_305 = {chapter: 3, scene: "ruins", speaker: KESH, time: {h: 2},
    text: L("试炮结束。凯什的分队列队向机器人致敬。\n“它比我们老，”她说，“它打过我们没打过的仗，可它不知道自己打过。”\n“这算幸运吗？”她问。没人回答。",
            "The trial ends. Kesh's maniple salutes the robot.\n“It is older than us,” she says. “It fought wars we never did, but it doesn't know it fought them.”\n“Is that fortunate?” she asks. Nobody answers."),
    choices: [
      C("“我觉得是。”", "“I think so.”", "mech_307", X({sanity: 3},
        "凯什点头。“记录：书记神甫倾向于不记得。”",
        "Kesh nods. “Logged: the lexmechanic prefers not to remember.”")),
      C("“我觉得不是。”", "“I think not.”", "mech_307", X({sanity: -3, set: {keshTalk: true}},
        "凯什沉默片刻，把这句话存了档。“我也这么计算。”",
        "Kesh is silent a moment, then archives the remark. “I calculate the same.”"))
    ]};

  N.mech_307 = {chapter: 3, scene: "tech_vault", speaker: CAWL, time: {d: 20},
    text: L("圣库收到一份数据包，署名是火星的大贤者贝利撒留·考尔：索要星区内所有STC残片的副本。\n瓦伦贤者读完，触手不安地卷了起来。\n“考尔‘重新发现’的东西，”他说，“多得不像重新发现。”",
            "The Vault receives a data-packet signed by Archmagos Belisarius Cawl of Mars, requesting copies of every STC fragment in the sector.\nMagos Vallen reads it, mechadendrites curling uneasily.\n“The things Cawl ‘rediscovers’,” he says, “are too many to be rediscoveries.”"),
    codex: ["mech_cawl"],
    choices: [
      C("“那不就是发明吗？”", "“Isn't that just inventing?”", "mech_308", X({renown: -2, set: {askedNew: true}},
        "贤者盯着你。“大贤者发明，叫启示。书记神甫发明，叫异端。”",
        "The Magos stares. “When an Archmagos invents, it is revelation. When a lexmechanic does, heresy.”")),
      C("加急发出副本", "Send the copies, priority", "mech_308", X({renown: 5},
        "三天后回执到了，只有一个字：“谢。”后面跟着十七页新的请求。",
        "Three days later the receipt arrives: one word, “Thanks,” followed by seventeen pages of new requests."))
    ]};

  N.mech_308 = {chapter: 3, scene: "manufactorum", speaker: VALLEN, time: {d: 10}, eventRoll: 0.35,
    text: L("立誓之夜。你跪在熔炉前，念自己写的誓词：肉体会疲倦，机器会坚持；知识属于神，你只是抄写员。\n瓦伦贤者在你额头点了一滴圣油。\n从今天起，你是神教的初学者。",
            "The night of oaths. You kneel before the furnace and recite the vow you wrote: flesh tires, the machine endures; knowledge belongs to the god, you are only its scribe.\nMagos Vallen touches sacred oil to your brow.\nFrom today you are an initiate of the Cult."),
    effects: {set: {initiate: true}},
    choices: [
      C("全心全意地发誓", "Swear with your whole heart", "mech_309", X({renown: 8, sanity: -3},
        "誓词说完，你觉得自己轻了一点。也许是灵魂，也许只是一部分怀疑。",
        "When the vow ends you feel lighter. Perhaps your soul. Perhaps just some doubt.")),
      C("发誓，但在心里留一句保留", "Swear, keeping one silent reservation", "mech_309", X({sanity: 5, set: {doubter: true}},
        "你在心里加了一句：“除非神错了。”圣油顺着眉毛流下来，很凉。",
        "Silently you add: unless the god is wrong. The oil runs down your brow, cold."))
    ]};

  N.mech_309 = {chapter: 3, scene: "ship_interior", speaker: VALLEN, time: {d: 30},
    text: L("探索舰队到了，缺书记神甫。瓦伦贤者填上了你的名字。\n“忒萨零号的考察是格拉维克斯出的钱，”他说，“维克崔斯-9贤者至今没有回来。”\n“这次去G-7号卫星。带回知识，或者带回你自己。”",
            "An explorator fleet has arrived, short of lexmechanics. Magos Vallen enters your name.\n“Gravex paid for the dig on Thessa Null,” he says. “Magos Vektrix-9 has still not returned.”\n“This time, Moonlet G-7. Bring back knowledge. Or bring back yourself.”"),
    codex: ["mech_explorators", "place_thessa_null"],
    choices: [
      C("“哪个优先？”", "“Which comes first?”", "mech_401", X({sanity: -3},
        "贤者想了想。“知识。但我会为另一个结果预留一个档案位。”",
        "The Magos considers. “Knowledge. But I will reserve a file slot for the other outcome.”")),
      C("领命", "Accept the posting", "mech_401", X({renown: 3},
        "你领到一个新编号、一件不合身的探索者斗篷，和一份遗嘱模板。",
        "You receive a new designation, an ill-fitting explorator's cloak, and a will template."))
    ]};

  /* ============ Chapter 4 · Explorator ============ */
  N.mech_401 = {chapter: 4, scene: "ship_interior", speaker: CALANTIS, time: {d: 40, warp: true},
    text: L("探索贤者卡兰提斯有四条腿、两个大脑，其中一个专门用来好奇。\n“G-7的墓穴可能比人类还老，”她说，“老东西知道得多。我想知道它知道什么。”\n舰船在亚空间里颠了一下。",
            "Explorator Calantis has four legs and two brains, one reserved entirely for curiosity.\n“The tomb on G-7 may be older than humanity,” she says. “Old things know a lot. I want to know what it knows.”\nThe ship lurches in the warp."),
    effects: {hp: 15},
    choices: [
      C("“它会愿意被知道吗？”", "“Will it want to be known?”", "mech_402", X({sanity: -3},
        "卡兰提斯的两个大脑讨论了一会儿。“无关紧要。”她们一致决定。",
        "Calantis's two brains confer. “Irrelevant,” they agree.")),
      C("帮她整理探测数据", "Help her sort the survey data", "mech_402", X({renown: 3},
        "你把三千份扫描按热度排好。最热的那一点，在金字塔正中央。",
        "You sort three thousand scans by heat. The hottest point sits dead centre in the pyramid."))
    ]};

  N.mech_402 = {chapter: 4, scene: "tomb_exterior", speaker: CALANTIS, time: {d: 2},
    text: L("G-7上空无一物，只有一座黑色金字塔，符文发着淡绿的光。\n护教军在四周布防。卡兰提斯的伺服颅骨绕着塔尖飞，像一群好奇的苍蝇。\n“扫描铭文，”她说，“全部。”",
            "G-7 is empty but for a black pyramid, its glyphs glowing faintly green.\nSkitarii deploy around it. Calantis's servo-skulls circle the apex like curious flies.\n“Scan the inscriptions,” she says. “All of them.”"),
    codex: ["place_tomb_moon", "nec_necrons"],
    choices: [
      C("把铭文导入植入体", "Load the glyphs into your implant", "mech_403", X({renown: 5, sanity: -5, taint: {tzeentch: 25}},
        "符文流进你的脑子，冰得发甜。有几行你看懂了，你宁愿没看懂。",
        "The glyphs flow in, cold enough to taste sweet. A few lines you understand. You wish you didn't.")),
      C("跟护教军一起守外围", "Hold the perimeter with the Skitarii", "mech_403", X({hp: -5},
        "沙子冷得像金属屑。夜里，金字塔低声嗡鸣，像一台待机的发动机。",
        "The sand is cold as metal filings. At night the pyramid hums low, like an engine on standby."))
    ]};

  N.mech_403 = {chapter: 4, scene: "tomb_interior", speaker: CALANTIS, time: {h: 8},
    text: L("墓道里整整齐齐站着几千具金属骷髅，一动不动。\n卡兰提斯用熔切器切开一具，切口在她眼前慢慢合拢。\n“自我修复！”她的两个大脑同时尖叫，“带回去，全部带回去！”",
            "Thousands of metal skeletons stand in the tomb halls, utterly still.\nCalantis slices one open with a melta-cutter. The cut slowly closes before her eyes.\n“Self-repair!” both her brains shriek. “Take it back, take all of it!”"),
    codex: ["nec_living_metal"],
    choices: [
      C("“它们只是在睡觉。”", "“They're only sleeping.”", "mech_404", X({renown: 3, set: {warnedTomb: true}},
        "卡兰提斯把你的意见归档为：“胆怯，但可能正确。”",
        "Calantis files your opinion under: ‘cowardly, but possibly correct’.")),
      C("帮她拆一具下来", "Help her dismantle one", "mech_404", X({renown: 5, hp: -5},
        "金属在你手里发热，好像不太愿意被拆。",
        "The metal warms in your hands, as if it doesn't much want to be taken apart."))
    ]};

  N.mech_404 = {chapter: 4, scene: "tomb_interior", speaker: KESH, foe: "necron_warrior", time: {h: 2}, eventRoll: 0.35,
    text: L("所有骷髅的眼睛同时亮了。\n它们一齐迈步，像阅兵的队伍。护教军开火，骷髅倒下，又站起来。\n“撤退协议！”凯什喊，“书记神甫，带上数据核心！”",
            "Every skeleton's eyes light at once.\nThey step forward together like a parade. The Skitarii open fire; skeletons fall, and stand again.\n“Withdrawal protocol!” Kesh shouts. “Lexmechanic, take the data-core!”"),
    codex: ["nec_canoptek"],
    choices: [
      C("抱起数据核心就跑", "Grab the data-core and run", null, R(0.5, "hp", "mech_405", "mech_406",
        RR("你冲出墓道，数据核心在怀里烫得像一块炭。", "You burst from the tunnel, the core burning in your arms like a coal.",
           "绿光削过你的后背。你摔倒了，数据核心滚了出去。", "Green light shaves your back. You fall; the core rolls away."))),
      C("掩护后面的机仆", "Cover the servitors behind you", "mech_405", X({hp: -10, renown: 3, set: {savedServitors: true}},
        "你把三个机仆推进运输车。它们不会感谢你，但它们记得路线。",
        "You shove three servitors into the transport. They can't thank you, but they remember the route.")),
      C("躲进冷却液池", "Hide in the coolant pool", "mech_405", X({hp: -5, sanity: -5, taint: {nurgle: 35}},
        "冷却液是温的，黏的，有点甜。你泡了一小时，爬出来时皮肤上长了一层膜。",
        "The coolant is warm, sticky, slightly sweet. You soak an hour; when you climb out a film has grown on your skin."))
    ]};

  N.mech_406 = {chapter: 4, scene: "tomb_interior", speaker: null, foe: "canoptek_scarab", time: {h: 1},
    text: L("一群金属甲虫爬上你的身体。它们不咬肉，只吃金属。\n皮带扣、工具、植入体的外壳，一样一样被拆走。\n它们拆得很仔细，像在给你做一次免费维修。",
            "A swarm of metal scarabs climbs your body. They don't bite flesh; they eat metal.\nBuckle, tools, the casings of your implants, taken one by one.\nThey work carefully, like a free maintenance service."),
    effects: {hp: -12},
    choices: [
      C("爬向出口", "Crawl for the exit", "mech_405", X({sanity: -5},
        "你爬出来时轻了好几斤。剩下的，都是原装的。",
        "You crawl out several pounds lighter. Everything left is original."))
    ]};

  N.mech_405 = {chapter: 4, scene: "tomb_exterior", speaker: CALANTIS, time: {h: 1},
    text: L("运输艇的舱门正在关闭。卡兰提斯站在墓道口，没有上船。\n“还有一个墓室，”她说，“只看一眼。”\n她走回了黑暗里。舱门合上了。",
            "The lander's hatch is closing. Calantis stands at the tunnel mouth and doesn't board.\n“One more chamber,” she says. “Just one look.”\nShe walks back into the dark. The hatch seals."),
    choices: [
      C("“贤者！”", "“Magos!”", "mech_407", X({sanity: -5},
        "她没回头。伺服颅骨跟了进去，像一群忠诚的狗。",
        "She doesn't turn. Her servo-skulls follow her in like loyal dogs.")),
      C("记下她最后的坐标", "Log her last coordinates", "mech_407", X({renown: 3},
        "坐标很精确。你知道它不会再变了。",
        "The coordinates are precise. You know they won't change again."))
    ]};

  N.mech_407 = {chapter: 4, scene: "ship_interior", speaker: null, time: {h: 6},
    text: L("舰船逃离G-7。通讯频道里传来卡兰提斯的最后一段数据，断断续续：\n“补充记录：它们不是机器。它们曾经是——”\n然后是一长串零。",
            "The ship flees G-7. Calantis's last data comes over the channel, broken:\n“Addendum: they are not machines. They were once—”\nThen a long string of zeros."),
    effects: {sanity: -5},
    choices: [
      C("把遗言存进圣库", "Archive her last words in the Vault", "mech_408", X({renown: 5},
        "你给文件加了个标签：未完成。所有好问题都该有这个标签。",
        "You tag the file: incomplete. Every good question should carry that tag.")),
      C("删掉损坏的文件", "Delete the corrupted file", "mech_408", X({sanity: 5, renown: -3},
        "文件消失了。那串零还在你脑子里响了很多天。",
        "The file is gone. The zeros ring in your head for days."))
    ]};

  N.mech_408 = {chapter: 4, scene: "ship_interior", speaker: KESH, time: {d: 30, warp: true},
    text: L("货舱里，带回来的死灵金属在自我修复，长出了细小的纹路。舰船的机魂不安地闪着灯。\n凯什拿枪对着它。“它在学习我们的船。”\n“扔出去，”她说，“或者你负责。”",
            "In the hold, the necron metal you brought back is repairing itself, growing fine new patterns. The ship's spirit flickers uneasily.\nKesh aims at it. “It's learning our ship.”\n“Jettison it,” she says. “Or it's your responsibility.”"),
    choices: [
      C("扔进虚空", "Jettison it", "mech_409", X({renown: -3, sanity: 5},
        "金属在舱外翻滚。最后一刻，它朝舰船伸出了一根细丝。",
        "It tumbles outside. At the last moment it reaches a thread toward the ship.")),
      C("封进铅箱带回去", "Seal it in lead and bring it home", "mech_409", X({renown: 8, set: {crystal: true}, taint: {tzeentch: 15}},
        "箱子上贴了七道封条。每天夜里，你都能听见它在里面重新排列自己。",
        "Seven seals on the box. Every night you hear it rearranging itself inside."))
    ]};

  N.mech_409 = {chapter: 4, scene: "burning_city", speaker: VALLEN, time: {d: 5},
    text: L("舰船回到格拉维克斯，看见的是浓烟。\n外围熔炉在燃烧，天上落着绿色的登陆舱，歪歪扭扭，像用废铁焊的。\n瓦伦贤者的声音响彻数据圈：“兽人。它们在偷东西。偷一切。”",
            "The ship returns to Gravex and finds smoke.\nThe outer furnaces burn. Green drop-pods rain from the sky, lopsided, welded from scrap.\nMagos Vallen's voice fills the noosphere: “Orks. They are stealing things. Everything.”"),
    codex: ["xenos_ork"],
    choices: [
      C("降落", "Make planetfall", "mech_501")
    ]};

  /* ============ Chapter 5 · The Green Tide ============ */
  N.mech_501 = {chapter: 5, scene: "burning_city", speaker: null, foe: "ork", time: {h: 3},
    text: L("兽人从星区边缘飘过来，像一场绿色的冰雹。\n它们不占领，不谈判。拆传送带，扛发电机，把神甫的香炉戴在头上当帽子。\n一个兽人抱着一台冲压机跑过街角，笑得很开心。",
            "The orks drifted in from the sector's edge like green hail.\nThey don't occupy; they don't negotiate. They rip out conveyors, carry off generators, wear priests' censers as hats.\nOne ork runs round a corner hugging a stamping press, laughing happily."),
    codex: ["xenos_waaagh"],
    choices: [
      C("去护教军的防线", "Head for the Skitarii line", "mech_502"),
      C("去抢救圣库", "Go save the Vault", "mech_503")
    ]};

  N.mech_502 = {chapter: 5, scene: "ruins", speaker: KESH, foe: "ork_nob", time: {h: 1},
    text: L("凯什的分队守在第三熔炉前。对面冲来一个兽人头目，比卡斯特兰矮不了多少，挥着链锯斧。\n“书记神甫，”凯什说，“我需要火力校准，或者需要一个人。”\n她等你选。",
            "Kesh's maniple holds before the Third Furnace. An ork boss charges, not much shorter than a Kastelan, swinging a chain-axe.\n“Lexmechanic,” says Kesh, “I need fire calibration. Or I need a body.”\nShe waits for your choice."),
    choices: [
      C("拿起卡宾枪顶上去", "Take a carbine and step in", "mech_504", X({hp: -12, renown: 5, taint: {khorne: 30}},
        "你打空了一个弹匣。头目倒下前咧嘴冲你笑，像在说：好玩。",
        "You empty a magazine. Before the boss falls it grins at you, as if to say: fun.")),
      C("接入火炮，计算弹道", "Patch into the artillery, plot the shot", null, R(0.5, "renown", "mech_504", "mech_505",
        RR("第一发就命中。头目连同半堵墙一起不见了。凯什给你发了个二进制的赞。", "First shot hits. The boss vanishes with half a wall. Kesh sends you a binary thumbs-up.",
           "你算错了风速。炮弹落在自己阵地前，气浪把你掀进了兽人堆里。", "You misjudge the wind. The shell lands before your own line; the blast throws you among the orks."))),
      C("“老规矩，阿尔法。”", "“The old drill, Alpha.”", "mech_504", O(Q({flag: "origin_conscript"}, true), X({hp: -5, renown: 8},
        "凯什的晶片和你后颈的旧伤同时一热。你们像同一台机器的两只手那样开火。",
        "Kesh's wafer and your old scar warm at once. You fire like two hands of one machine.")))
    ]};

  N.mech_503 = {chapter: 5, scene: "manufactorum", speaker: null, foe: "gretchin", time: {h: 1},
    text: L("圣库门口，一个小绿皮抱着神甫的香炉往外跑，后面三个扛着一卷数据线。\n它们看见你，愣住了。\n领头的把香炉举起来，好像在问：换不换？",
            "At the Vault door a little greenskin is running off with a priest's censer; three more follow, lugging a coil of data-cable.\nThey see you and freeze.\nThe leader holds up the censer, as if asking: wanna trade?"),
    choices: [
      C("追上去夺回香炉", "Chase it down and take the censer", "mech_504", X({hp: -10},
        "你抢回了香炉，也挨了一口。小绿皮的牙比看上去锋利。",
        "You get the censer back, and a bite. Their teeth are sharper than they look.")),
      C("用一个亮闪闪的齿轮换", "Trade it for a shiny cog", "mech_504", X({renown: 3, set: {grotDeal: true}},
        "成交。小绿皮把香炉还给你，郑重地把齿轮挂在了脖子上。",
        "Deal. The greenskin returns the censer and solemnly hangs the cog round its neck.")),
      C("随它们去", "Let them go", "mech_504", X({renown: -3, sanity: 3},
        "它们跑了，边跑边唱。那卷数据线，后来出现在一门兽人大炮上。",
        "They run off singing. That cable later turns up on an ork cannon."))
    ]};

  N.mech_505 = {chapter: 5, scene: "ork_scrapyard", speaker: MEK, time: {h: 4},
    text: L("你醒来时被铁链拴在废铁堆旁。一个兽人机械佬在拆你的工具包，边拆边嘟囔。\n他发现你会用扳手，眼睛亮了：“小东西！你修！修好了，有肉吃！”\n他指了指一门歪歪扭扭的大炮。",
            "You wake chained to a scrap pile. An Ork Mek is taking your toolkit apart, muttering.\nHe sees you know how to hold a spanner and his eyes light up. “Little fing! You fix! Fix good, get meat!”\nHe points at a lopsided cannon."),
    choices: [
      C("故意修坏它", "Fix it badly, on purpose", null, R(0.5, "hp", "mech_504", "mech_end_looted",
        RR("大炮第一发就炸了膛。你趁乱挣开锁链，一头钻进废铁场深处。", "The cannon bursts on its first shot. In the chaos you slip your chains and dive deeper into the scrapyard.",
           "机械佬发现了你的小动作，反而大笑：“聪明小东西！留着！”", "The Mek spots your trick and roars with laughter. “Clever little fing! Keepin' you!”"))),
      C("等护教军来救", "Wait for the Skitarii", "mech_504", X({hp: -10, sanity: -5},
        "两天后护教军炸开了废铁场。找到你时，你正在给兽人大炮刷第三遍红漆。",
        "Two days later the Skitarii blast the scrapyard open. They find you giving the cannon its third coat of red."))
    ]};

  N.mech_504 = {chapter: 5, scene: "ork_scrapyard", speaker: MEK, foe: "kastelan_robot", time: {h: 6},
    text: L("废铁场中央站着一台卡斯特兰机器人，刷成了红色，头上焊着两只角。\n它在动。没有晶片，没有祷文，它在动。\n“红的跑得快，”兽人机械佬骄傲地拍着它，“它信，所以它跑！”",
            "In the middle of the scrapyard stands a Kastelan robot, painted red, two horns welded to its head.\nIt's moving. No wafers, no litanies. It's moving.\n“Red ones go fasta,” the Ork Mek says proudly, slapping it. “It believes, so it goes!”"),
    codex: ["ork_belief_tech"],
    choices: [
      C("侵入它的指令核心", "Hack its command core", null, R(0.5, "renown", "mech_506", "mech_507",
        RR("你找到一枚兽人没拆的旧晶片，改了一个字。机器人转身，把机械佬拍进了废铁堆。", "You find an old wafer the orks missed and change one word. The robot turns and swats the Mek into the scrap.",
           "核心里全是兽人的涂鸦和一个很丑的笑脸。机器人一脚把你踢飞。", "The core is all ork graffiti and an ugly smiley face. The robot kicks you flying."))),
      C("引爆它的能源舱", "Detonate its power cell", "mech_506", X({hp: -10, renown: 3},
        "爆炸把机器人和半个废铁场送上了天。可惜。它是一台好机器。",
        "The blast sends the robot and half the scrapyard skyward. A pity. It was a good machine.")),
      C("看机械佬怎么让它动起来", "Watch how the Mek makes it move", "mech_506", X({sanity: -10, renown: -3, set: {mekWatch: true}},
        "你看了很久，还是不懂。兽人什么原理都没用，只用了信心。这比任何异端都可怕。",
        "You watch a long time and still don't understand. The ork uses no principle at all, only conviction. Worse than any heresy."))
    ]};

  N.mech_507 = {chapter: 5, scene: "ork_scrapyard", speaker: null, foe: "kastelan_robot", time: {h: 1},
    text: L("你躺在废铁堆里，肋骨断了几根。红色的机器人朝你走来，每一步都踩碎一块金属。\n它胸口的灯在闪。\n闪了两下，和试炮那天一样。",
            "You lie in the scrap with several ribs broken. The red robot walks toward you, each step crushing metal.\nIts chest light is blinking.\nTwice, just like the day of the gunnery trial."),
    effects: {hp: -12},
    choices: [
      C("念那天念过的祷文", "Recite the prayer from that day", "mech_506", X({sanity: 5, renown: 5},
        "机器人停住了。它站了很久，然后转身走向兽人，像想起了自己是谁。",
        "The robot stops. It stands a long while, then turns toward the orks, as if remembering who it is.")),
      C("爬开", "Crawl away", "mech_506", X({hp: -5},
        "你爬了很久。它没有追。也许它根本没在看你。",
        "You crawl a long way. It doesn't follow. Perhaps it was never looking at you."))
    ]};

  N.mech_506 = {chapter: 5, scene: "forge_floor", speaker: KESH, time: {d: 2},
    grudgeLine: {npc: "gries", text: L("格里斯监工提着账本站在尸堆旁：清点死人归他管。", "Overseer Gries stands among the dead with his ledger; counting the dead is his job.")},
    text: L("兽人被打退了，带走了能带走的一切：三座发电站、半个铸造厂，还有那块STC残片。\n凯什丢了一条腿，拄着一根管子站岗。\n“损失已记录，”她说，“悲伤未记录。没有那个字段。”",
            "The orks are driven off with everything they could carry: three power plants, half a foundry, and that STC fragment.\nKesh has lost a leg. She stands guard propped on a pipe.\n“Losses logged,” she says. “Grief not logged. There is no field for it.”"),
    effects: {hp: 10},
    choices: [
      C("帮凯什修腿", "Repair Kesh's leg", "mech_508", X({renown: 5, hp: -5, set: {keshRepair: true}},
        "你用冲压机的连杆给她做了条新腿。不太合规，但她站得很稳。",
        "You make her a new leg from a press linkage. Not quite canonical, but she stands firm.")),
      C("去点算死去的杂役", "Go and count the dead menials", "mech_508", O({grudge: {npc: "gries", effects: {sanity: -6},
          note: L("格里斯拿着账本在场：他逼你把每个编号念两遍，错一个重来。", "Gries is there with his ledger: he makes you recite every number twice, and restart on any slip.")}},
        X({sanity: -5, renown: 3},
        "三百四十一个。你把每个编号都念了一遍，一个不落。",
        "Three hundred and forty-one. You read every number aloud, not one skipped."))),
      C("去熔炉边找T-0B1N", "Look for T-0B1N by the furnace", "mech_508", O(Q({flag: "tobinSong"}, true), X({sanity: 8},
        "它还在搬钢锭，浑身是灰，喉咙里还在哼那四个音。你从没觉得一首歌这么好听。",
        "It's still hauling ingots, covered in ash, still humming the four notes. No song ever sounded better.")))
    ]};

  N.mech_508 = {chapter: 5, scene: "manufactorum", speaker: null, time: {d: 3}, eventRoll: 0.35,
    text: L("兽人待过的地方，一夜之间长出了蘑菇，红的绿的，塞满了冷却管道。\n杂役说那是兽人的孢子，烧不干净，明年还会长出小绿皮。\n管道里的蘑菇微微发热，摸上去像一只温顺的动物。",
            "Where the orks stayed, fungus sprouts overnight, red and green, choking the coolant pipes.\nMenials say they're ork spores: you can never burn them all, and next year little greenskins will grow.\nThe fungus is faintly warm, like a docile animal to the touch."),
    choices: [
      C("全部烧掉", "Burn it all", "mech_509", X({hp: -5, renown: 3},
        "火焰喷射器烧了一整天。烟是甜的，你咳了一整夜。",
        "The flamer burns all day. The smoke is sweet; you cough all night.")),
      C("留一片，研究研究", "Keep one patch to study", "mech_509", X({sanity: 5, taint: {nurgle: 35}},
        "你给它浇了点机油，它长得很好。你开始期待每天早上去看它。",
        "You give it a little machine oil. It thrives. You start looking forward to visiting it each morning."))
    ]};

  N.mech_509 = {chapter: 5, scene: "tech_vault", speaker: VALLEN, time: {d: 4},
    text: L("瓦伦贤者在圣库最底层等你。封印在兽人袭击那夜被人从里面打开过。\n墙上留着一行废码，像霉斑一样慢慢扩散。\n“有人趁乱进来过，”贤者说，“不是兽人。兽人不会关门。”",
            "Magos Vallen waits on the Vault's lowest level. Its seal was opened from inside on the night of the ork raid.\nA line of scrapcode remains on the wall, spreading slowly like mildew.\n“Someone came in under cover of chaos,” he says. “Not orks. Orks don't close doors.”"),
    codex: ["mech_scrapcode"],
    choices: [
      C("追踪废码的来源", "Trace the scrapcode to its source", "mech_601", X({sanity: -5, renown: 3},
        "废码一路通向外围熔炉，忏悔劳役的地方。",
        "The scrapcode trails all the way to the outer furnaces, where the penitents labour.")),
      C("请贤者封锁圣库", "Ask the Magos to seal the Vault", "mech_601", X({renown: 5},
        "封锁令下达三分钟后，有人在门外敲了三下：左，右，左。",
        "Three minutes after the seal order, someone knocks outside: left, right, left."))
    ]};

  /* ============ Chapter 6 · The Schism ============ */
  N.mech_601 = {chapter: 6, scene: "tech_vault", speaker: OSSIA, time: {d: 1},
    text: L("是奥西娅。她的袍子烧焦了，一只手换成了你没见过的型号，多一个关节。\n“格拉维克斯在关门，”她说，“我在开门。”\n她身后，废码像藤蔓一样爬满了砖缝。",
            "It's Ossia. Her robe is scorched; one hand has been replaced with a model you've never seen, one joint too many.\n“Gravex is closing doors,” she says. “I'm opening them.”\nBehind her, scrapcode climbs the mortar like ivy."),
    codex: ["mech_dark_mechanicum"],
    choices: [
      C("听她说下去", "Let her talk", "mech_602", O({grudge: {npc: "ossia", effects: {sanity: -6},
          note: L("奥西娅记得是你把她交了出去，每个字都扎在你身上。", "Ossia remembers who gave her up; every word she says lands on you.")}},
        X({sanity: -5, set: {heardOssia: true}, taint: {tzeentch: 20}},
        "她说得很快，用了很多你没听过的概念。每一个都像一扇刚推开的门。",
        "She speaks fast, using concepts you've never heard. Each one is like a door just pushed open."))),
      C("“回来吧，奥西娅。”", "“Come back, Ossia.”", "mech_602", O(Q({flag: "ossiaFriend"}), {grudge: {npc: "ossia", effects: {sanity: -8},
          note: L("她记得你的背叛，这声“回来吧”只换来冷笑。", "She remembers your betrayal; “come back” earns only a cold laugh.")}}, X({sanity: 5},
        "她的笑僵了一下。“你还记得那把扳手。”她摇头，“回不去了。”",
        "Her smile falters. “You remember the spanner.” She shakes her head. “There's no going back.”"))),
      C("呼叫凯什", "Call Kesh", "mech_603", X({renown: 5},
        "你向数据圈发出信号。奥西娅听见了，没有逃，只是叹了口气。",
        "You signal into the noosphere. Ossia hears it. She doesn't run. She only sighs."))
    ]};

  N.mech_602 = {chapter: 6, scene: "tech_vault", speaker: OSSIA, time: {h: 1},
    text: L("“火星分裂从来没结束，”奥西娅说，“一半的神甫选择了不再害怕知识。”\n“铸魔匠塞瑞丁就要来了。你想问的、不敢问的，他都会回答。”\n她把一枚数据钥匙放在你手心。",
            "“The Schism of Mars never ended,” Ossia says. “Half the priesthood chose to stop fearing knowledge.”\n“Warsmith Syrredin is coming. The questions you want to ask, the ones you dare not: he answers them all.”\nShe presses a data-key into your palm."),
    codex: ["chr_schism_of_mars"],
    choices: [
      C("握紧钥匙", "Close your hand on the key", "mech_604", X({corruption: 10, set: {ossiaKey: true}, taint: {tzeentch: 20}},
        "钥匙在掌心发热，像一颗小小的心脏。你没告诉任何人。",
        "The key warms in your palm like a tiny heart. You tell no one.")),
      C("把钥匙扔进熔炉", "Throw the key into the furnace", "mech_604", X({sanity: -5, renown: 5},
        "奥西娅看着它熔化，没阻止。“它会再长出来的，”她说，“知识都这样。”",
        "Ossia watches it melt and doesn't stop you. “It'll grow back,” she says. “Knowledge always does.”"))
    ]};

  N.mech_603 = {chapter: 6, scene: "barracks", speaker: KESH, time: {h: 2},
    text: L("凯什逮捕了奥西娅。奥西娅没反抗，被押走时一直在笑。\n“太晚了，”她说，“熔炉的机魂已经替他开了门。它也想知道答案。”\n凯什把这句话存档，标记为：威胁等级未知。",
            "Kesh arrests Ossia. Ossia doesn't resist and laughs all the way out.\n“Too late,” she says. “The forge's spirit has already opened the door for him. It wants the answers too.”\nKesh archives the remark, flagged: threat level unknown."),
    effects: {sanity: -5},
    choices: [
      C("去找瓦伦贤者", "Go to Magos Vallen", "mech_604")
    ]};

  N.mech_604 = {chapter: 6, scene: "manufactorum", speaker: VALLEN, time: {d: 2},
    text: L("瓦伦贤者把你叫到手术台前。不是转化线那张，是神甫们自己用的那张。\n“铸魔匠要来了。恐惧会让你犯错，血肉会让你流血。”\n“你可以决定，”他说，“留下多少个自己。”",
            "Magos Vallen calls you to the surgery table. Not the one on the conversion line: the one the priests use themselves.\n“The warsmith is coming. Fear will make you err; flesh will make you bleed.”\n“You may decide,” he says, “how much of yourself to keep.”"),
    codex: ["mech_rite_pure_thought"],
    choices: [
      C("“留下心和手。”", "“Keep my heart and hands.”", "mech_605", X({renown: -5, sanity: 10, set: {fleshKept: true}},
        "贤者没反对，只在你的档案里把一个数值标成“低效”。你的手还是你的手。",
        "The Magos doesn't object; he just marks one value in your file ‘inefficient’. Your hands are still your hands.")),
      C("“换掉软弱的部分。”", "“Replace what's weak.”", "mech_605", X({hp: 15, sanity: -10, renown: 10, set: {augHalf: true}, taint: {slaanesh: 35}},
        "醒来时你胸腔里多了一台泵，比心脏更稳。你照了镜子，一遍，又一遍。",
        "You wake with a pump in your chest, steadier than a heart. You look in the mirror. Again. Again.")),
      C("“纯思仪式。全部。”", "“The Rite of Pure Thought. All of it.”", "mech_606", X({sanity: -5},
        "贤者的触手第一次完全静止。“你确定？”这是他第一次用问句。",
        "For the first time his tendrils go perfectly still. “Are you certain?” His first question ever."))
    ]};

  N.mech_606 = {chapter: 6, scene: "manufactorum", speaker: VALLEN, time: {h: 1},
    text: L("纯思仪式。手术锯悬在你头顶，比转化线上那把精致得多。\n“恐惧、悔恨、爱，”瓦伦贤者说，“切除之后，你将看清一切。”\n“但你不会再在乎看清了什么。”",
            "The Rite of Pure Thought. The saw hangs above you, far finer than the one on the conversion line.\n“Fear, regret, love,” says Magos Vallen. “Once excised, you will see everything clearly.”\n“But you will no longer care what you see.”"),
    choices: [
      C("“继续。”", "“Proceed.”", "mech_end_pure", O(Q({stat: "renown", min: 45}), X({taint: {all: -50}},
        "锯子转起来时，你想起那首四个音的歌。然后，想不起为什么要想起它。",
        "As the saw spins, you remember the four-note song. Then you can't remember why you remembered it."))),
      C("“你自己做过吗？”", "“Have you done it yourself?”", "mech_605", X({sanity: 5, set: {fleshKept: true}},
        "贤者沉默了很久。“做过。所以我知道，你还没准备好。”他关掉了锯子。",
        "The Magos is silent a long time. “I have. So I know you are not ready.” He switches off the saw.")),
      C("“停下！我要留着它们。”", "“Stop! I'm keeping them.”", "mech_605", X({sanity: -5, renown: -5, set: {fleshKept: true}},
        "贤者关掉了锯子。“记录：候选者选择了痛苦。有意思。”",
        "The Magos switches off the saw. “Logged: candidate chose pain. Interesting.”"))
    ]};

  N.mech_605 = {chapter: 6, scene: "forge_floor", speaker: null, time: {d: 3},
    text: L("新的你走在熔炉之间。护教军向你点头，杂役给你让路，就像当年你给神甫让路。\n格拉维克斯的灯一闪一闪，像在用二进制说话。\n你听懂了。它在说：害怕。",
            "The new you walks among the furnaces. Skitarii nod to you; menials step aside, as you once stepped aside for priests.\nGravex's lights flicker as if speaking binary.\nYou understand. It's saying: afraid."),
    choices: [
      C("去冥想室为熔炉祈祷", "Go to the meditation cell to pray for the forge", "mech_607")
    ]};

  N.mech_607 = {chapter: 6, scene: "mars_vista", speaker: OMNI, time: {h: 6},
    text: L("你在维护冥想中看见一道金光，像一个巨大的齿轮光环，缓缓转动。\n是万机之神吗？还是你的植入体过热了？\n光环里有一个声音，说着你听不懂、却觉得应该懂的二进制。",
            "In maintenance meditation you see a golden light, like a vast gear-halo, slowly turning.\nIs it the Omnissiah? Or are your implants overheating?\nWithin the halo a voice speaks binary you can't understand, but feel you ought to."),
    codex: ["mech_omnissiah"],
    choices: [
      C("祈祷，不提问", "Pray, and ask nothing", "mech_608", X({sanity: 5, renown: 5, taint: {all: -15}},
        "你只是念着点火祷文。光环慢慢暗下去，留下一种干净的安静。",
        "You only recite the Litany of Ignition. The halo slowly dims, leaving a clean kind of quiet.")),
      C("问它：帝皇就是你吗？", "Ask it: are you the Emperor?", "mech_608", X({sanity: -10, taint: {tzeentch: 20}},
        "光环停了一下，然后变了颜色：从金色，变成一种你叫不出名字的蓝。",
        "The halo pauses, then changes colour: from gold to a blue you have no name for."))
    ]};

  N.mech_608 = {chapter: 6, scene: "forge_floor", speaker: RUMM, time: {h: 4}, eventRoll: 0.4,
    text: L("废码在熔炉间蔓延。传送带倒着转，机仆停下来对着墙发呆。\n鲁姆抱着反应堆的控制台哭：“它害怕！它说它听见了别的声音！”\n格拉维克斯的心脏，一座等离子反应堆，在颤抖。",
            "Scrapcode spreads among the furnaces. Conveyors run backward; servitors stop and stare at walls.\nRumm clings to the reactor console, weeping. “It's afraid! It says it hears other voices!”\nGravex's heart, a plasma reactor, is trembling."),
    choices: [
      C("对反应堆唱祷文", "Sing a litany to the reactor", "mech_609", X({sanity: -5, taint: {all: -10}, set: {calmedReactor: true, keeper: true}},
        "你唱到嗓子出血。反应堆的颤抖慢慢平了，像一只被抚摸的巨兽。",
        "You sing until your throat bleeds. The trembling slowly stills, like a great beast being stroked.")),
      C("切断它的数据接口", "Cut its data ports", "mech_609", X({hp: -10, renown: 3},
        "拔接口时电弧烧了你的手。反应堆安静了，安静得像在生闷气。",
        "The arc burns your hand as you pull the port. The reactor goes quiet. Sulkily quiet."))
    ]};

  N.mech_609 = {chapter: 6, scene: "void", speaker: SYRREDIN, time: {d: 2},
    text: L("天空裂开了。一艘黄铜与血肉焊成的舰船挂在轨道上，像一座倒悬的铸造厂。\n一个声音挤进每一台机器：\n“格拉维克斯，我是塞瑞丁。你们的神是一台坏掉的计算机。我的神会回答。”",
            "The sky splits. A ship welded from brass and flesh hangs in orbit like an upturned foundry.\nA voice forces itself into every machine:\n“Gravex. I am Syrredin. Your god is a broken calculator. Mine answers.”"),
    codex: ["mech_warsmith"],
    choices: [
      C("拿起武器", "Take up arms", "mech_701", X({renown: 3},
        "你领到一支电弧步枪。它的机魂很紧张，你也是。",
        "You draw a galvanic rifle. Its spirit is nervous. So are you.")),
      C("捂住耳朵", "Cover your ears", "mech_701", X({sanity: -5},
        "声音直接从植入体里钻进来。捂耳朵没有用。",
        "The voice comes straight through your implants. Covering your ears does nothing."))
    ]};

  /* ============ Chapter 7 · Iron and Daemons ============ */
  N.mech_701 = {chapter: 7, scene: "burning_city", speaker: KESH, foe: "dark_mechanicus", time: {h: 6},
    text: L("铸魔匠的部队降落了：浑身管线的异端神甫，被废码驱动的机仆，还有一些叫不出名字的东西。\n凯什的分队在燃烧的街道上组成防线。\n“书记神甫，”她说，“选一个地方去死。或者去活。”",
            "The warsmith's forces land: heretek priests bristling with cables, scrapcode-driven servitors, things you cannot name.\nKesh's maniple forms a line in the burning streets.\n“Lexmechanic,” she says. “Choose a place to die. Or to live.”"),
    choices: [
      C("留在防线上", "Hold the line", "mech_702", X({hp: -15, renown: 5, taint: {khorne: 30}},
        "开火，装弹，开火。你不再数打倒了多少。数字开始让你觉得无聊。",
        "Fire, reload, fire. You stop counting how many you've dropped. The numbers start to bore you.")),
      C("带杂役们撤进地下", "Lead the menials underground", "mech_702", X({hp: -5, sanity: 5, set: {savedMenials: true}},
        "你领着三百个杂役钻进冷却隧道。他们没有名字，只有编号，可他们都活着。",
        "You lead three hundred menials into the coolant tunnels. They have only numbers, no names. But they're alive.")),
      C("去圣库", "Go to the Vault", "mech_703")
    ]};

  N.mech_702 = {chapter: 7, scene: "ruins", speaker: null, foe: "daemon_engine", time: {h: 2},
    text: L("它从烟里走出来：黄铜的腿，钢铁的爪，炮管里有东西在呼吸。\n装甲上刻满了符文，那些符文在动，在笑。\n凯什开火了。炮弹打在它身上，像打在一块活着的肉上。",
            "It strides out of the smoke: brass legs, steel claws, something breathing inside the gun barrels.\nIts armour is carved with runes that move. That laugh.\nKesh fires. The shells strike it like striking living meat."),
    effects: {sanity: -10, hp: -5},
    codex: ["mech_daemon_engine"],
    choices: [
      C("跟凯什一起后撤", "Fall back with Kesh", "mech_704", X({hp: -10},
        "它的爪子擦过你的肩膀。被碰过的地方，金属在生锈，皮肤在发烫。",
        "Its claw grazes your shoulder. Where it touched, metal rusts and skin burns.")),
      C("盯着那些符文看", "Stare at the runes", "mech_704", X({sanity: -10, taint: {tzeentch: 20}},
        "符文在你眼里重新排列，拼出了你的名字。一个字都没错。",
        "The runes rearrange in your eyes and spell your name. Not a letter wrong."))
    ]};

  N.mech_703 = {chapter: 7, scene: "tech_vault", speaker: null, time: {h: 2},
    text: L("圣库最底层的封印在发光。废码在门上写好了一行字：“请输入钥匙。”\n门后是格拉维克斯锁了一万年的东西：会思考的机器、禁用的公式、没人敢回答的问题。\n它在等你。",
            "The seal on the Vault's lowest level glows. Scrapcode has written across the door: “Please enter key.”\nBehind it lies all Gravex has locked away for ten thousand years: thinking machines, banned equations, questions nobody dared answer.\nIt is waiting for you."),
    choices: [
      C("用奥西娅的钥匙打开", "Open it with Ossia's key", "mech_704", O(Q({flag: "ossiaKey"}, true), X({renown: -5, corruption: 10, set: {openedArchive: true}, taint: {tzeentch: 30}},
        "门开了。你只读了一行，就懂了三件以前不懂的事，和一件再也忘不掉的事。",
        "The door opens. You read one line and understand three things you didn't before, and one you can never forget."))),
      C("用自己的权限重新封印", "Reseal it with your own codes", "mech_704", X({hp: -5, renown: 8},
        "封印咬住你的植入体，抽走了一部分电流。门安静了。",
        "The seal bites your implants and drains some of your current. The door goes quiet.")),
      C("只看一眼", "Just one look", "mech_704", X({sanity: -10, taint: {tzeentch: 25}},
        "你从门缝里看了一眼。里面的东西也看了你一眼。",
        "You glance through the crack. What's inside glances back."))
    ]};

  N.mech_704 = {chapter: 7, scene: "forge_floor", speaker: TOBIN, time: {h: 3},
    grudgeLine: {npc: "tobin", text: L("废码掀开了手术刀盖住的一层：它想起了你，想起了你亏欠它的那一次。", "Scrapcode has peeled back what the surgeons laid over it: it remembers you, and what you owed it.")},
    text: L("熔炉边，T-0B1N停下了。废码爬进了它的脑子，那首歌倒着唱，四个音全错了。\n它慢慢转向你，手里还握着一根烧红的钢锭。\n它从来没有看过你。现在它在看。",
            "By the furnace, T-0B1N has stopped. Scrapcode has crept into its head; the song runs backward, all four notes wrong.\nIt turns slowly toward you, a red-hot ingot still in its grip.\nIt has never looked at you. Now it does."),
    choices: [
      C("把那首歌正着唱给它听", "Sing it the song the right way round", "mech_705", O(Q({flag: "tobinSong"}, true), {grudge: {npc: "tobin", effects: {hp: -8},
          note: L("托宾想起了你对他做过的事，握着烧红的钢锭朝你走来。", "Tobin remembers what you did to him, and comes at you with the red-hot ingot.")}},
        X({sanity: 10, set: {tobinSaved: true, forgiven_tobin: true}},
        "第一个音，它停住了。第四个音，它放下钢锭，跟着你哼了起来。还是跑调。",
        "First note: it stops. Fourth: it sets down the ingot and hums along. Still off-key."))),
      C("关掉它", "Shut it down", "mech_705", O({grudge: {npc: "tobin", effects: {hp: -6},
          note: L("它想起了你，被按下开关前死死抓住了你的手腕。", "It remembers you, and grips your wrist hard before the switch goes down.")}},
        X({sanity: -8},
        "你按下它后颈的开关。它倒下时很轻，像一件终于脱下的外套。",
        "You press the switch at its neck. It falls lightly, like a coat finally taken off."))),
      C("让锈接管它", "Let the rust take it", "mech_705", X({sanity: -5, taint: {nurgle: 40}},
        "锈从它的关节里开出花来，橙色的，很暖。它又能动了，比以前更有耐心。",
        "Rust blooms from its joints, orange and warm. It moves again, more patient than before."))
    ]};

  N.mech_705 = {chapter: 7, scene: "manufactorum", speaker: VALLEN, foe: "dark_mechanicus", time: {h: 2},
    text: L("瓦伦贤者挡在反应堆大门前，六根触手断了五根。\n他把一枚权限芯片塞进你手里：“熔炉的心脏不认职衔，只认虔诚。”\n“去。我来计算怎么让他们慢一点。”他的发声器在冒烟。",
            "Magos Vallen blocks the reactor doors, five of his six mechadendrites severed.\nHe presses an override chip into your hand. “The forge's heart heeds no rank. Only devotion.”\n“Go. I'll calculate a way to slow them.” His vox-grille is smoking."),
    choices: [
      C("收下芯片，走", "Take the chip and go", "mech_706", X({renown: 10, set: {vallenKey: true}},
        "你跑出很远才回头。贤者的最后一根触手正在把门焊死，从里面。",
        "You run a long way before looking back. His last tendril is welding the door shut. From the inside.")),
      C("拖着他一起走", "Drag him with you", "mech_706", X({hp: -10, renown: 5, set: {vallenKey: true}},
        "他太重了，大半是黄铜。走到一半，他关掉自己的推进器，松开了你的手。",
        "He's too heavy, mostly brass. Halfway, he shuts off his own motors and lets go of your hand."))
    ]};

  N.mech_706 = {chapter: 7, scene: "burning_city", speaker: KESH, time: {h: 3}, eventRoll: 0.4,
    text: L("最后的防线。凯什只剩一条胳膊和一条借来的腿。\n“最后一条教条，”她说，“我自己写的：保护书记神甫。”\n她的分队转身冲进烟里，步伐整齐，像同一个人。",
            "The last line. Kesh has one arm left and a borrowed leg.\n“Final doctrina,” she says. “I wrote it myself: protect the lexmechanic.”\nHer maniple turns and charges into the smoke, perfectly in step, like one person."),
    choices: [
      C("和她一起冲", "Charge with her", "mech_707", X({hp: -18, renown: 5},
        "冲到一半，凯什把你推了回来。她最后说的不是二进制，是她名字剩下的那个音节。",
        "Halfway in, Kesh shoves you back. Her last word isn't binary. It's the one syllable left of her name.")),
      C("跑向反应堆", "Run for the reactor", "mech_707", X({sanity: -5},
        "你没有回头。你知道她会这么计算：这是最优解。",
        "You don't look back. You know how she'd calculate it: optimal.")),
      C("走向铸魔匠的旗帜", "Walk toward the warsmith's banner", "mech_end_heretek", O(Q({flag: "heardOssia"}, true), X({corruption: 15},
        "你放下武器，朝那面黄铜旗帜走去。没人拦你。他们好像早就在等你。",
        "You lower your weapon and walk toward the brass banner. No one stops you. They seem to have been expecting you.")))
    ]};

  N.mech_707 = {chapter: 7, scene: "forge_floor", speaker: SYRREDIN, foe: "daemon_engine", time: {h: 1},
    text: L("反应堆大厅里，铸魔匠塞瑞丁在等你。他的身体是一座会走的工坊，身后蹲着那台恶魔引擎。\n“你也想过，残片为什么不能补全，”他说，“我能。我什么都能补全。”\n“跟我走吧。”",
            "In the reactor hall Warsmith Syrredin waits. His body is a walking workshop; the daemon engine crouches behind him.\n“You've wondered why the fragments can't be completed,” he says. “I can. I can complete anything.”\n“Come with me.”"),
    codex: ["mech_warsmith"],
    choices: [
      C("“不。”", "“No.”", "mech_801", X({renown: 5},
        "塞瑞丁叹了口气，像一位失望的老师。他打了个响指，恶魔引擎站了起来。",
        "Syrredin sighs like a disappointed teacher. He snaps his fingers. The daemon engine rises.")),
      C("“你的神要什么代价？”", "“What does your god charge?”", "mech_801", X({sanity: -8, taint: {tzeentch: 20}},
        "“问得好，”他微笑，“每次都不一样。这正是乐趣所在。”然后恶魔引擎站了起来。",
        "“Good question,” he smiles. “It's different every time. That's the fun.” Then the engine rises.")),
      C("“你说过会回答一切。”", "“You said you'd answer everything.”", "mech_end_heretek", O(Q({flag: "openedArchive"}, true), X({corruption: 20},
        "他伸出一只手，关节多一个，和奥西娅的一样。你握住了它。",
        "He offers a hand with one joint too many, like Ossia's. You take it.")))
    ]};

  /* ============ Chapter 8 · The Omnissiah ============ */
  N.mech_801 = {chapter: 8, scene: "forge_floor", speaker: null, foe: "daemon_engine", time: {h: 1},
    text: L("恶魔引擎扑向反应堆。它的每一步都让地面生锈，每一声吼都让灯光变色。\n格拉维克斯的心脏就在它爪下。\n你有的，是一点权限、几句祷文，和一具还没完全变成机器的身体。",
            "The daemon engine lunges for the reactor. Every step rusts the floor; every roar changes the colour of the lights.\nGravex's heart lies beneath its claws.\nYou have a little clearance, a few prayers, and a body not yet entirely machine."),
    choices: [
      C("用瓦伦的芯片唤醒反应堆", "Wake the reactor with Vallen's chip", "mech_802", O(Q([{flag: "vallenKey"}, {stat: "renown", min: 30}]), X({renown: 5},
        "芯片插进控制台。反应堆用二进制说了一个字，声音大得你从没听过：“是。”",
        "The chip slots in. The reactor speaks one binary word, louder than you've ever heard: “Yes.”"))),
      C("给反应堆唱那段祷文", "Sing the reactor that litany", "mech_802", O(Q({flag: "calmedReactor"}, true), X({sanity: -5},
        "它认出了你的声音。整个大厅的灯，同时变回了金色。",
        "It knows your voice. Every light in the hall turns gold at once."))),
      C("调来卡斯特兰机器人", "Summon the Kastelan robots", null, R(0.45, "renown", "mech_803", "mech_804",
        RR("三台卡斯特兰从侧门走进来，胸口的灯整齐地闪着，抓住了恶魔引擎的腿。", "Three Kastelans stride through the side door, chest lights blinking in unison, and seize the engine's legs.",
           "机器人收到了指令，可恶魔引擎先一步抓住了你。", "The robots receive the order, but the engine seizes you first."))),
      C("冲上去，用身体挡", "Charge it, body first", "mech_804", X({hp: -10},
        "你冲上去，没有计算。这是入教以来你第一次没有计算。",
        "You charge without calculating. The first time since your initiation."))
    ]};

  N.mech_802 = {chapter: 8, scene: "forge_floor", speaker: null, foe: "daemon_engine", time: {h: 1},
    text: L("反应堆苏醒了。等离子流涌出导管，可管道被恶魔引擎的爪子撕开了一半。\n必须有人握住导管，把光引到它身上。\n握住的人，大概剩不下多少。",
            "The reactor wakes. Plasma surges through the conduit, but the engine's claws have torn the pipe half open.\nSomeone must hold the conduit and aim the light at it.\nWhoever holds it will probably not have much left."),
    choices: [
      C("亲手握住导管", "Hold the conduit yourself", null, R(0.55, "hp", "mech_805", "mech_804",
        RR("你的手熔化了，导管稳住了。等离子流把恶魔引擎从中间劈开。", "Your hand melts; the conduit holds. The plasma splits the daemon engine down the middle.",
           "导管在你手里扭动，像活的。光打偏了，引擎转向了你。", "The conduit writhes like something alive. The light goes wide; the engine turns on you."))),
      C("让T-0B1N去握", "Let T-0B1N hold it", "mech_805", O(Q({flag: "tobinSaved"}, true), X({sanity: -15},
        "它走过去握住导管，没有犹豫。光吞没它之前，它哼完了那首歌。正着唱的。",
        "It walks over and takes the conduit without hesitation. Before the light swallows it, it finishes the song. The right way round.")))
    ]};

  N.mech_803 = {chapter: 8, scene: "forge_floor", speaker: KASTELAN, foe: "daemon_engine", time: {h: 1},
    text: L("卡斯特兰机器人按住恶魔引擎。一台被撕碎，另一台顶上去。\n它们不害怕，因为不许害怕；它们不撤退，因为晶片里没写。\n你把最后一条指令插进第三台：“打它的心。”",
            "The Kastelans pin the engine. One is torn apart; another takes its place.\nThey don't fear, because fear is not permitted. They don't retreat, because the wafers don't say to.\nYou slot the last order into the third: “Strike its heart.”"),
    effects: {renown: 5},
    choices: [
      C("看着它出拳", "Watch it strike", "mech_805")
    ]};

  N.mech_804 = {chapter: 8, scene: "forge_floor", speaker: null, foe: "daemon_engine", time: {h: 1},
    text: L("恶魔引擎的爪子把你按在地上。黄铜贴着你的脸，烫得发甜。\n炮管里那个呼吸的东西凑近你，用你母亲的声音念你的编号。\n你还有一只手能动。",
            "The engine's claws pin you to the floor. Brass against your cheek, hot enough to taste sweet.\nThe breathing thing in the gun barrel leans close and recites your number in your mother's voice.\nYou still have one hand free."),
    effects: {hp: -22, sanity: -5},
    choices: [
      C("把最后一枚手雷塞进炮管", "Shove your last grenade down its barrel", "mech_805", X({hp: -8},
        "爆炸把你们俩都掀翻了。它的吼声变成尖叫，又变成金属冷却的嘀嗒声。",
        "The blast throws you both. Its roar becomes a scream, then the ticking of cooling metal.")),
      C("念出它的真名", "Speak its true name", "mech_805", O(Q({flag: "openedArchive"}, true), X({sanity: -15, corruption: 10},
        "你在禁库里读过这个名字。恶魔在钢铁里抽搐，松开了爪子。你嘴里一股铁锈味。",
        "You read this name in the forbidden archive. The daemon convulses in its steel and lets go. Your mouth tastes of rust.")))
    ]};

  N.mech_805 = {chapter: 8, scene: "forge_floor", speaker: null, time: {d: 1},
    text: L("恶魔引擎倒下了。铸魔匠的舰船在轨道上燃烧，塞瑞丁的声音从所有机器里消失了。\n格拉维克斯还剩一半熔炉、三成杂役，和刚学会二进制没几年的你。\n天亮了。天还是红的。",
            "The daemon engine falls. The warsmith's ship burns in orbit; Syrredin's voice vanishes from every machine.\nGravex has half its furnaces, three-tenths of its menials, and you, barely a few years into binary.\nDawn comes. The sky is still red."),
    effects: {sanity: 5},
    choices: [
      C("穿上贤者的袍子，留着这颗心", "Take a Magos's robe, and keep your heart", "mech_end_magos", O(Q([{flag: "fleshKept"}, {stat: "renown", min: 35}]), X({renown: 10},
        "授袍那天，你没有换掉任何零件。神甫们窃窃私语，没人敢说出口。",
        "On the day of investiture you replace no parts. The priests whisper; none dare say it aloud."))),
      C("随探索舰队出发，去求知", "Sail with the explorators, on the Quest", "mech_end_explorator", O(Q({stat: "renown", min: 30}), X({renown: 5},
        "你把卡兰提斯的坐标抄进新舰的星图。第一个目的地，就是那里。",
        "You copy Calantis's coordinates into the new ship's charts. The first destination is there."))),
      C("留在第七熔炉，照看它的机魂", "Stay at the Seventh Furnace, tending its spirit", "mech_end_keeper", O(Q({flag: "keeper"}, true), X({sanity: 10},
        "你回到第七熔炉。反应堆认出了你的脚步，灯亮了一下。",
        "You return to the Seventh Furnace. The reactor recognises your footsteps; a light blinks once."))),
      C("把恶魔引擎的核心带回去研究", "Take the engine's core home to study", "mech_end_purged", X({corruption: 5},
        "核心还是热的，在你怀里轻轻跳动。你告诉自己，只是看看它怎么运转。",
        "The core is still warm, pulsing gently in your arms. You tell yourself you only want to see how it works."))
    ]};

  /* ============ Endings ============ */
  N.mech_end_magos = {chapter: 8, scene: "manufactorum", speaker: null, time: {y: 3},
    text: L("三年后，你成了格拉维克斯最年轻的贤者。袍子下是黄铜，胸口里仍是一颗会疼的心。\n你改了转化线的规矩：会数数的、会唱歌的，先送来见你。\n你的档案里，名字一栏终于填上了。",
            "Three years later you are Gravex's youngest Magos. Brass beneath the robe; in your chest, a heart that still aches.\nYou change the rules of the conversion line: anyone who can count, or sing, is sent to you first.\nIn your file, the name field is finally filled in."),
    ending: {kind: "good", title: L("有心的贤者", "The Magos With a Heart"), cause: L("成为保留人心的贤者", "Became a Magos who kept a heart")}};

  N.mech_end_explorator = {chapter: 8, scene: "void", speaker: null, time: {y: 1, warp: true},
    text: L("新的探索舰起航了。你在卡兰提斯的坐标旁画了一个问号。\n星区之外，还有一万座沉睡的墓穴、一万块失落的残片、一万个没人回答的问题。\n求知之旅没有终点。这正是你喜欢它的地方。",
            "The new explorator ship sets sail. Beside Calantis's coordinates you draw a question mark.\nBeyond the sector lie ten thousand sleeping tombs, ten thousand lost fragments, ten thousand unanswered questions.\nThe Quest has no end. That's what you love about it."),
    ending: {kind: "good", title: L("群星间的求知者", "Seeker Among the Stars"), cause: L("随探索舰队远行", "Sailed with the explorators")}};

  N.mech_end_keeper = {chapter: 8, scene: "forge_floor", speaker: null, time: {y: 2},
    text: L("你没有升职，留在第七熔炉当它的看守神甫。\n每天早上，你给反应堆念祷文，给传送带上油，给还在哼歌的机仆擦脸。\n杂役们说，第七熔炉的机魂是全星球脾气最好的。",
            "You decline promotion and stay on as keeper of the Seventh Furnace.\nEach morning you pray to the reactor, oil the conveyors, and wipe the faces of servitors that still hum.\nThe menials say the Seventh Furnace has the kindest machine spirit on the planet."),
    ending: {kind: "good", title: L("第七熔炉的看守", "Keeper of the Seventh Furnace"), cause: L("留作熔炉的看守神甫", "Stayed as the furnace's keeper")}};

  N.mech_end_servitor = {chapter: 1, scene: "forge_floor", speaker: S("servitor", "无名机仆", "A Nameless Servitor"), time: {d: 3},
    text: L("你醒来时，已经不再需要醒来。\n你的编号牌上有一串数字。你推着矿车，步伐整齐。\n隔壁的机仆在哼一首四个音的歌。你不知道为什么，也跟着哼了起来。",
            "You wake no longer needing to wake.\nYour plate bears a string of digits. You push an ore cart, perfectly in step.\nThe servitor beside you hums a four-note song. Without knowing why, you hum along."),
    ending: {kind: "bad", title: L("一串数字", "A String of Digits"), cause: L("被改造成机仆", "Converted into a servitor")}};

  N.mech_end_pure = {chapter: 6, scene: "manufactorum", speaker: VALLEN, time: {d: 7},
    text: L("仪式很成功。你看清了一切：格拉维克斯的产能、铸魔匠的弱点、自己剩余的寿命。\n你不害怕，不后悔，也不再记得那首歌。\n瓦伦贤者说你是他最好的作品。你同意。这是一个正确的数据。",
            "The Rite succeeds. You see everything clearly: Gravex's output, the warsmith's weaknesses, your own remaining lifespan.\nYou feel no fear, no regret, and no longer remember the song.\nMagos Vallen calls you his finest work. You agree. It is a correct datum."),
    ending: {kind: "bad", title: L("纯思", "Pure Thought"), cause: L("切除了一切感情", "Excised every feeling")}};

  N.mech_end_heretek = {chapter: 7, scene: "daemon_world", speaker: SYRREDIN, time: {y: 5, warp: true},
    text: L("塞瑞丁兑现了承诺：你问什么，他答什么。\n你学会了把恶魔写进机器，把机器写进血肉。格拉维克斯在身后燃烧，你忙着记笔记。\n很多年后，你给自己换了一只手，关节多一个。",
            "Syrredin keeps his promise: whatever you ask, he answers.\nYou learn to write daemons into machines and machines into flesh. Gravex burns behind you; you're busy taking notes.\nYears later you give yourself a new hand, with one joint too many."),
    ending: {kind: "bad", title: L("未缚者的学徒", "Apprentice of the Unbound"), cause: L("投身黑暗机械教", "Joined the Dark Mechanicum")}};

  N.mech_end_purged = {chapter: 8, scene: "tech_vault", speaker: S("magos", "铸造世界法庭", "The Forge Tribunal"), time: {d: 9},
    text: L("你把恶魔引擎的核心带回圣库，只想看看它是怎么运转的。\n法庭的判决只有一个二进制词：异端。\n他们没有把你改成机仆。他们怕那颗核心已经教会了你的大脑什么。",
            "You bring the engine's core back to the Vault. You only want to see how it works.\nThe tribunal's verdict is one binary word: heresy.\nThey don't make you a servitor. They fear what the core has already taught your brain."),
    ending: {kind: "bad", title: L("最后的好奇心", "The Last Curiosity"), cause: L("因技术异端被处决", "Executed for tech-heresy")}};

  N.mech_end_looted = {chapter: 5, scene: "ork_scrapyard", speaker: MEK, time: {y: 1},
    text: L("机械佬给你起了个名字：“小扳手”。你每天给兽人修枪，修得越好，它们越开心。\n后来你发现，枪修不修都能打响，只要它们相信。\n你开始怀疑学过的一切，也开始相信：红的跑得快。",
            "The Mek names you “Lil' Spanner”. Every day you fix ork guns; the better you fix them, the happier they are.\nLater you notice the guns fire whether fixed or not, as long as the orks believe.\nYou begin to doubt everything you learned. And to believe red ones go faster."),
    ending: {kind: "bad", title: L("小扳手", "Lil' Spanner"), cause: L("被兽人掳去修枪", "Kept by orks to fix their guns")}};

  /* ============ Claim endings (SPEC §19): reached via the claim events' goto ============ */
  N.mech_end_claim_tzeentch = {scene: "tech_vault", speaker: S("daemon_tzeentch", "多出来的一行", "The Extra Line"), time: {d: 9},
    text: L("你终于补全了那块STC残片。缺的三成，是奸奇亲手填上的。\n设计完美，能造出任何东西，可每造一件，图纸就改变一处。\n你造了一辈子，从没造出过同一样东西。这正是他的计划。",
            "At last you complete the STC fragment. The missing third was filled in by Tzeentch's own hand.\nThe design is perfect and can build anything, but each time it builds, the blueprint changes.\nYou build all your life and never make the same thing twice. Which was his plan."),
    codex: ["god_tzeentch"],
    ending: {kind: "bad", title: L("补全的残片", "The Completed Fragment"), cause: L("被奸奇的答案收走", "Taken by Tzeentch's answers")}};

  N.mech_end_claim_nurgle = {scene: "forge_floor", speaker: S("sigil_nurgle", "慈祥的锈", "A Kindly Rust"), time: {d: 30},
    text: L("你不再给机器上油。锈是温柔的，它让一切慢下来，却从不让它们停下。\n第七熔炉开满了橙色的锈花，机仆们在花丛里哼歌，永远不会坏，也永远不会好。\n慈父说，这才是不朽。",
            "You stop oiling the machines. Rust is gentle: it slows everything and never lets it stop.\nThe Seventh Furnace blooms with orange rust; servitors hum among the flowers, never breaking, never mending.\nGrandfather says this is the true immortality."),
    codex: ["god_nurgle"],
    ending: {kind: "bad", title: L("锈花", "Rust Blossoms"), cause: L("随锈蚀被纳垢收走", "Taken by Nurgle with the rust")}};

  N.mech_end_claim_khorne = {scene: "burning_city", speaker: S("sigil_khorne", "试射的鼓点", "The Test-Fire Drum"), time: {d: 20},
    text: L("你把卡宾枪焊在了手上，后来把整条胳膊换成了链锯。\n格拉维克斯造的每一门炮你都想亲手试射，靶子从铁板变成了人。\n血神不在乎你的植入体是什么型号，只在乎它们还在开火。",
            "You weld the carbine to your hand, and later swap the whole arm for a chainblade.\nYou want to test-fire every gun Gravex makes; the targets change from steel plates to people.\nThe Blood God doesn't care what model your implants are. Only that they keep firing."),
    codex: ["god_khorne"],
    ending: {kind: "bad", title: L("试射", "Test-Fire"), cause: L("化作恐虐的战争机器", "Became Khorne's war machine")}};

  N.mech_end_claim_slaanesh = {scene: "manufactorum", speaker: S("sigil_slaanesh", "下一个型号", "The Next Model"), time: {y: 4},
    text: L("每一个植入体都很完美，直到你看见下一个型号。\n你换了眼睛、手、心、声音，直到镜子里再没有一块原装零件。\n你仍不满意。色孽最爱的，正是这种永远差一点的完美。",
            "Every implant is perfect, until you see the next model.\nYou replace eyes, hands, heart, voice, until the mirror holds not one original part.\nStill you're not satisfied. Slaanesh loves exactly this: perfection forever one step away."),
    codex: ["god_slaanesh"],
    ending: {kind: "bad", title: L("下一个型号", "The Next Model"), cause: L("被色孽的完美收走", "Taken by Slaanesh's perfection")}};

  /* ============ Death nodes (engine-triggered) ============ */
  N.mech_death_hp = {scene: "forge_floor", speaker: null,
    text: L("你倒在熔炉边。两个机仆停下来，评估你身上还有多少可回收零件。\n不多。它们把你的植入体拆下来，整整齐齐码进回收箱。\n剩下的部分，被归档为“耗材”。",
            "You fall beside the furnace. Two servitors stop to assess how many recoverable parts you hold.\nNot many. They remove your implants and stack them neatly in the salvage bin.\nThe rest is filed as ‘consumables’."),
    ending: {kind: "death", title: L("耗材", "Consumables"), cause: L("倒在熔炉边", "Fell at the furnace")}};

  N.mech_death_sanity = {scene: "manufactorum", speaker: null,
    text: L("你开始只用二进制说话，后来只用二进制思考，最后只剩一串重复的数字。\n神甫们检查了你，宣布你的心智“已格式化”。\n转化线很欢迎你。这一次，你不用排队。",
            "You begin speaking only in binary, then thinking only in binary, until nothing is left but a repeating string of digits.\nThe priests examine you and declare your mind ‘formatted’.\nThe conversion line welcomes you. This time, no queue."),
    ending: {kind: "death", title: L("已格式化", "Formatted"), cause: L("心智崩溃，被格式化", "Mind wiped clean")}};

  N.mech_death_corruption = {scene: "daemon_world", speaker: null,
    text: L("你身体里的机器开始说另一种语言。它们不再听你的，也不再听万机之神的。\n你的植入体长出了牙齿，血变成了黄铜色。\n铸魔匠们会把你造成一台很好的引擎。",
            "The machines inside you start speaking another language. They no longer obey you, nor the Omnissiah.\nYour implants grow teeth; your blood turns the colour of brass.\nThe warsmiths will make you into a very fine engine."),
    ending: {kind: "death", title: L("黄铜之血", "Brass Blood"), cause: L("被恶魔机械吞噬", "Consumed by daemon-iron")}};

  /* ============ Route events: 5 taint (SPEC §18, 1 cleanse) + 2 route events ============ */
  function E(text, effects, result) { return {text: text, effects: effects, result: result}; }
  WH.registerEvents([
    {id: "evt_t_mech_tzeentch", god: "tzeentch", factions: ["mechanicus"], minChapter: 2,
     scene: "tech_vault", speaker: S("sigil_tzeentch", "数据里的幽灵", "A Ghost in the Data"), foe: null,
     text: L("你校对一份旧档案时，发现末尾多了一行公式。昨天还没有。\n它解开了圣库一千年没解开的问题。署名栏写着你的名字，笔迹也是你的。",
             "Proofreading an old archive, you find an extra line of equation at the end. It wasn't there yesterday.\nIt solves a problem the Vault has failed at for a thousand years. It is signed with your name, in your handwriting."),
     codex: ["god_tzeentch"],
     choices: [
       E(L("抄下公式，报给贤者", "Copy it out and report it"), {renown: 8, sanity: -5, taint: {tzeentch: 30}},
         L("贤者称之为奇迹。你知道不是。你的抄本里，公式又多长了一行。", "The Magos calls it a miracle. You know it isn't. In your copy, the equation has grown another line.")),
       E(L("删除这一行", "Delete the line"), {sanity: -5},
         L("你按下删除。档案沉默了一会儿，然后在别处，又多出了一行。", "You press delete. The archive is quiet a moment. Then, somewhere else, another line appears.")),
       E(L("给档案的机魂焚香", "Burn incense for the archive's spirit"), {renown: 2, taint: {tzeentch: -10}},
         L("香烟缭绕，那行字像受惊的虫子一样缩回了缝隙里。", "The smoke curls; the line shrinks back into the cracks like a startled insect."))
     ]},

    {id: "evt_t_mech_nurgle", god: "nurgle", factions: ["mechanicus"], minChapter: 3,
     scene: "forge_floor", speaker: S("sigil_nurgle", "慈祥的锈", "A Kindly Rust"), foe: null,
     text: L("一台老冲压机生了锈，却比以前跑得更稳。锈是暖的，摸上去软软的。\n老杂役说别擦，擦了它会生气。锈底下有很小很小的声音，像在哼歌。",
             "An old press has rusted, yet it runs steadier than ever. The rust is warm and soft to the touch.\nThe old menials say don't scrub it; it'll be cross. Under the rust something very small is humming."),
     codex: ["god_nurgle"],
     choices: [
       E(L("随它去，它跑得很好", "Leave it. It runs well"), {hp: 10, taint: {nurgle: 30}},
         L("那天配额超了一成。夜里你咳了一声，咳出来的东西是橙色的。", "That day the quota runs a tenth over. At night you cough, and what comes up is orange.")),
       E(L("按规程除锈", "De-rust it by the rubric"), {hp: -5, renown: 3},
         L("锈被刮掉时，冲压机像叹了口气。第二天，锈又长了回来。", "As the rust comes off, the press seems to sigh. Next day the rust is back."))
     ]},

    {id: "evt_t_mech_slaanesh", god: "slaanesh", factions: ["mechanicus"], minChapter: 3,
     scene: "manufactorum", speaker: S("sigil_slaanesh", "完美的齿轮", "The Perfect Cog"), foe: null,
     text: L("一批新植入体到货。其中一只机械手完美得不像人造的，每个关节都比你的心跳更准。\n它适合你。它比你还适合你。",
             "A shipment of new implants arrives. One mechanical hand is too perfect to be made: every joint keeps better time than your heart.\nIt fits you. It fits you better than you do."),
     codex: ["god_slaanesh"],
     choices: [
       E(L("当晚就换上", "Fit it that night"), {hp: -5, renown: 5, taint: {slaanesh: 30}},
         L("新手很完美。你用它摸了摸自己的脸，第一次觉得这张脸配不上它。", "The new hand is perfect. You touch your face with it and, for the first time, feel the face is unworthy of it.")),
       E(L("登记入库，不碰它", "Log it into stores, untouched"), {sanity: -3},
         L("你把它锁进柜子。夜里，你梦见它在柜子里轻轻敲门。", "You lock it in a cabinet. That night you dream of it knocking softly from inside."))
     ]},

    {id: "evt_t_mech_khorne", god: "khorne", factions: ["mechanicus"], minChapter: 4,
     scene: "barracks", speaker: S("sigil_khorne", "武器的机魂", "A Weapon's Spirit"), foe: null,
     text: L("你保养的那支卡宾枪不肯安静。它在枪架上微微发热，扳机自己弹了一下。\n枪的机魂在说一件事，用的是你听得懂的语言：再来。",
             "The carbine you maintain won't settle. It warms on the rack; the trigger twitches on its own.\nThe weapon's spirit is saying one thing, in a language you understand: again."),
     codex: ["god_khorne"],
     choices: [
       E(L("去靶场打空一整箱弹药", "Empty a whole crate at the range"), {renown: 5, hp: -5, taint: {khorne: 30}},
         L("你打了一夜。枪管红了，手也红了。天亮时，你发现自己在笑。", "You fire all night. The barrel glows red, and so do your hands. At dawn you find you're smiling.")),
       E(L("涂上圣油，念安抚祷文", "Anoint it and recite the soothing litany"), {sanity: -3},
         L("枪慢慢凉了。可它躺在枪架上的样子，像一只在装睡的狗。", "The gun slowly cools. But it lies on the rack like a dog pretending to sleep."))
     ]},

    {id: "evt_t_mech_cleanse", god: "other", cleanse: true, factions: ["mechanicus"], minChapter: 3,
     scene: "manufactorum", speaker: S("magos", "主持仪式的贤者", "The Officiating Magos"), foe: null,
     text: L("神殿举行小型纯思仪式：不切除什么，只是十二小时的冥想，二进制圣歌、焚香、一盏不灭的灯。\n贤者说，杂念像灰尘，机器和人都要定期清扫。",
             "The shrine holds a lesser Rite of Pure Thought: nothing is cut, only twelve hours of meditation, binary chant, incense and an undying lamp.\nThe Magos says stray thoughts are dust; machines and people alike need regular sweeping."),
     codex: ["mech_rite_pure_thought"],
     choices: [
       E(L("跪满十二个小时", "Kneel the full twelve hours"), {sanity: 8, renown: -2, taint: {all: -20}},
         L("圣歌结束时，你脑子里安静得像一间刚扫过的圣库。", "When the chant ends, your head is as quiet as a freshly swept vault.")),
       E(L("跪一会儿就溜走", "Kneel a while, then slip away"), {sanity: 3, taint: {all: -5}},
         L("你溜出去时，那盏灯朝你这边晃了一下，没有怪你。", "As you slip out the lamp sways your way once, without reproach.")),
       E(L("嫌太慢，回去干活", "Too slow. Back to work"), {renown: 2},
         L("你的配额多完成了一点。你的脑子里，灰还在。", "You get a little more of your quota done. The dust in your head stays."))
     ]},

    {id: "evt_mech_incense", god: "other", factions: ["mechanicus"], minChapter: 2,
     scene: "manufactorum", speaker: S("tech_priest", "焦虑的神甫", "An Anxious Priest"), foe: null,
     text: L("一台计算机拒绝开机。神甫已经焚了三炉香、念了九遍祷文，急得满头是油。\n“仪式全对！”他喊，“它就是不高兴！”",
             "A cogitator refuses to boot. The priest has burned three censers and recited nine litanies, sweating oil.\n“The rite is perfect!” he cries. “It's just not happy!”"),
     codex: ["mech_machine_spirit"],
     choices: [
       E(L("再焚一炉香", "Burn one more censer"), {sanity: 3},
         L("第四炉香烧到一半，屏幕亮了。神甫哭着说：“它要的只是多一点尊重。”", "Halfway through the fourth censer, the screen lights. The priest weeps: “All it wanted was a little more respect.”")),
       E(L("左右左，拍三下", "Left, right, left: three taps"), {renown: 3},
         L("计算机开机了。神甫盯着你的手，像在看一件圣物。", "The cogitator boots. The priest stares at your hand like a relic.")),
       E(L("低声骂它一句", "Mutter a curse at it"), {hp: -5},
         L("它听见了。它喷出一串火花，然后开机，用的是最慢的那种速度。", "It heard. It spits sparks, then boots, at the slowest speed it has."))
     ]},

    {id: "evt_mech_census", god: "other", factions: ["mechanicus"], minChapter: 4,
     scene: "forge_floor", speaker: S("hive_foreman", "普查官", "A Census-Taker"), foe: null,
     text: L("神教在做血肉普查。普查官扫描了你一遍：“原装率百分之六十二。\n低于你这个级别的平均值。”\n他在你的档案上画了一个小小的皱眉。",
             "The Cult is taking a flesh census. The census-taker scans you. “Sixty-two percent original.\nBelow average for your grade.”\nHe draws a tiny frown on your file."),
     codex: ["mech_magi"],
     choices: [
       E(L("申请降低百分比", "Apply to lower the percentage"), {renown: 3, hp: -5},
         L("下个月，你的百分比降了四点。普查官的皱眉被擦掉了。", "Next month your figure drops four points. The frown on your file is erased.")),
       E(L("问他平均值是多少", "Ask what the average is"), {sanity: -3},
         L("“平均值在逐年下降，”他说，“这是好事。”他说得很真诚。", "“The average falls every year,” he says. “That is good.” He sounds sincere.")),
       E(L("什么也不说", "Say nothing"), {sanity: 3},
         L("你摸了摸自己的手。百分之六十二。今晚，它们都还是你的。", "You touch your own hands. Sixty-two percent. Tonight, they're still yours."))
     ]}
  ]);

  /* ============ Route rumours (SPEC §20b): every one has a relevant `when` ============ */
  function RU(id, minC, maxC, speaker, text, codex, when) {
    return {id: id, factions: ["mechanicus"], minChapter: minC, maxChapter: maxC, speaker: speaker, text: text, codex: codex, when: when};
  }
  function W(scenes, sprites, codex, zh, en, flags) {
    var w = {};
    if (scenes && scenes.length) w.scenes = scenes;
    if (sprites && sprites.length) w.sprites = sprites;
    if (codex && codex.length) w.codex = codex;
    if ((zh && zh.length) || (en && en.length)) w.keywords = {zh: zh || [], en: en || []};
    if (flags && flags.length) w.flags = flags;
    return w;
  }
  if (WH.registerRumors) WH.registerRumors([
    RU("rum_mech_valda", 1, 2, L("排队的杂役", "A menial in the queue"),
      L("“瓦尔达的粮船？好久没来了。有人说那颗星球整个没了，像被谁从账本上划掉。”",
        "“Valda's grain ships? Not for ages. Some say the whole planet's gone, like someone struck it off the ledger.”"),
      ["place_valda"], W(["forge_floor"], ["player_mechanicus", "hive_foreman"], ["mech_menials"], ["口粮", "瓦尔达"], ["ration", "Valda"])),
    RU("rum_mech_aurex", 1, 3, L("装货单", "A shipping manifest"),
      L("装货单：激光枪两万支，目的地奥雷克斯二号。备注：“上一批还没付钱。”",
        "Manifest: twenty thousand lasguns, destination Aurex Secundus. Note: “Previous shipment still unpaid.”"),
      ["place_aurex"], W(["forge_floor", "manufactorum"], null, ["place_aurex"], ["激光枪", "配额", "奥雷克斯"], ["lasgun", "quota", "Aurex"])),
    RU("rum_mech_treaty", 2, 4, L("圣库门楣上的铭文", "An inscription over the Vault door"),
      L("门楣上刻着一行古老的条款：“火星不向泰拉下跪，泰拉不进火星的门。”下面有人用粉笔打了个问号。",
        "An old clause is carved over the door: “Mars kneels not to Terra; Terra enters not the gates of Mars.” Beneath, in chalk, someone has added a question mark."),
      ["chr_unification_wars"], W(["mars_vista", "tech_vault"], ["omen_mars"], ["mech_treaty_olympus", "place_mars"], ["条约", "火星"], ["Treaty", "Mars"])),
    RU("rum_mech_rift", 2, 6, L("数据圈里的杂音", "Noosphere static"),
      L("“大裂隙开了以后，火星的广播要么迟到四十年，要么提前到。提前到的那些，没人敢放。”",
        "“Since the Rift opened, broadcasts from Mars arrive forty years late, or early. Nobody dares play the early ones.”"),
      ["chr_great_rift_opens"], W(["mars_vista"], ["omen_mars"], ["place_mars", "mech_fabricator_general"], ["大裂隙", "广播"], ["Rift", "broadcast"])),
    RU("rum_mech_cawl", 3, 8, L("铸工神甫的闲话", "An enginseer's gossip"),
      L("“听说考尔大贤者不止一个。一个在火星，一个在船上，还有一个……谁也不知道在哪儿。”",
        "“They say there's more than one Archmagos Cawl. One on Mars, one on a ship, and one… nobody knows where.”"),
      ["chr_guilliman_returns"], W(["tech_vault"], ["omen_cawl"], ["mech_cawl"], ["考尔", "大贤者"], ["Cawl", "Archmagos"])),
    RU("rum_mech_men_of_iron", 3, 6, L("数据铸匠的低语", "A datasmith's whisper"),
      L("“为什么不许机器人思考？因为上一次让它们思考，人类差点没了。别问是哪一次。”",
        "“Why can't the robots think? Because the last time they did, humanity nearly ended. Don't ask which time.”"),
      ["mech_tech_heresy"], W(null, ["kastelan_robot"], ["mech_kastelan", "mech_tech_heresy"], ["思考", "机器人"], ["think", "robot"])),
    RU("rum_mech_thessa", 3, 4, L("探索舰的通讯员", "An explorator vox-officer"),
      L("“忒萨零号的最后一段信号？只有一句：‘请出示身份。’我们没回。”",
        "“The last signal from Thessa Null? Just one line: ‘Please identify yourself.’ We didn't reply.”"),
      ["place_thessa_null"], W(["tomb_exterior", "ship_interior"], ["explorator"], ["mech_explorators", "place_thessa_null"], ["忒萨"], ["Thessa"])),
    RU("rum_mech_pariah", 4, 4, L("卡兰提斯的自言自语", "Calantis, to herself"),
      L("“听说有一片星域，死灵的方尖碑让人连梦都不做了。我想要一座。就一座。”",
        "“They say there's a region where necron pylons stop people even dreaming. I want one. Just one.”"),
      ["chr_pariah_nexus"], W(["tomb_interior", "tomb_exterior"], ["necron_warrior", "canoptek_scarab"], ["nec_necrons", "nec_living_metal"], ["骷髅", "金字塔"], ["skeleton", "pyramid"])),
    RU("rum_mech_armageddon", 5, 5, L("老护教军的记忆晶片", "An old Skitarius's memory wafer"),
      L("“在阿玛吉顿，兽人用废铁焊出跟泰坦一样高的巨像，还让它走起来了。贤者们至今不愿提。”",
        "“On Armageddon the orks welded scrap into idols tall as Titans, and made them walk. The Magi still won't talk about it.”"),
      ["chr_second_armageddon"], W(["ork_scrapyard", "burning_city"], ["ork", "ork_mek", "ork_nob", "gretchin"], ["xenos_ork"], ["兽人", "绿皮"], ["ork", "greenskin"])),
    RU("rum_mech_schism", 6, 8, L("被删掉一半的布道", "A half-deleted sermon"),
      L("“……当红色星球的一半背弃了万机之神——”布道到这里断了，后面整段数据被人删除。",
        "“…when half the Red Planet turned from the Omnissiah—” The sermon cuts off there; the rest of the data has been erased."),
      ["chr_schism_of_mars"], W(null, ["dark_mechanicus"], ["mech_dark_mechanicum", "mech_scrapcode"], ["废码", "分裂", "黑暗机械"], ["scrapcode", "Schism", "Dark Mechanicum"]))
  ]);

  /* SPEC §27: register this route's world in the sector lookup (data/sector.js merges; load order safe) */
  WH.sector = WH.sector || {};
  WH.sector.worlds = WH.sector.worlds || {};
  WH.sector.worlds.gravex = {name: L("格拉维克斯", "Gravex"), codex: "place_gravex", routes: ["mechanicus"],
    kind: "forge world (sponsored the Thessa Null dig, 113.M42)"};

  WH.registerFaction({
    id: "mechanicus",
    name: L("机械神教", "Adeptus Mechanicus"),
    tagline: L("离机仆只差一次红，向万机之神攀爬", "One red mark from servitude, climb toward the Machine God"),
    role: L("铸造世界杂役", "Forge-world menial"),
    world: L("格拉维克斯", "Gravex"),
    playerSprite: "player_mechanicus",
    color: "#c0392b",
    startNode: "mech_101",
    startDate: {year: 113, mill: 42},
    startStats: {hp: 110, sanity: 95, corruption: 0, renown: 5},
    renownLabel: L("机眷", "Grace"),
    renownIcon: "icon_grace",
    taintMod: {khorne: 0.8, nurgle: 0.8, tzeentch: 1.1, slaanesh: 0.8},   // SPEC §26: forbidden knowledge tempts
    renownHelp: L("机眷是神教眼中你离万机之神有多近。仪式做对、计算精准、虔诚求知让它上升；怀疑、意气用事、留恋血肉让它下降。机眷够高，贤者才肯听你说话，更好的结局才会敞开。",
                  "Grace is how close the Cult thinks you stand to the Omnissiah. Correct rites, exact calculation and devout pursuit of knowledge raise it; doubt, sentiment and clinging to flesh lower it. High Grace makes the Magi listen, and opens better endings."),
    npcs: {
      tobin: {name: L("托宾", "Tobin"), aka: [L("T-0B1N", "T-0B1N")]},
      gries: {name: L("格里斯", "Gries"), aka: [L("监工格里斯", "Overseer Gries")]},
      ossia: {name: L("奥西娅", "Ossia"), aka: [L("书记神甫奥西娅", "Lexmechanic Ossia")]}
    },
    deathNodes: {hp: "mech_death_hp", sanity: "mech_death_sanity", corruption: "mech_death_corruption"},
    origins: [
      {id: "menial", name: L("铸造世界杂役", "Forge-world menial"),
       desc: L("第七熔炉的杂役，两次红。背扛得住，心早就累了，在神甫眼里只是个编号。", "A Seventh Furnace menial with two red marks. A strong back, a tired mind, and to the priests just a number."),
       sprite: "player_mechanicus", startNode: "mech_101",
       max: {hp: 110, sanity: 95}, stats: {hp: 110, sanity: 95, corruption: 0, renown: 5}, set: {origin_menial: true}},
      {id: "savant", name: L("巢都学者", "Hive-born savant"),
       desc: L("居住尖塔里长大的经院生，被卖来抵债。身子单薄，脑子清楚，会算数的人总有人要。", "A scholam student from the hab-spire, sold for a debt. Frail, clear-headed; someone always wants a person who can count."),
       sprite: "player_mechanicus", startNode: "mech_o_savant_1",
       max: {hp: 85, sanity: 110}, stats: {hp: 85, sanity: 110, corruption: 0, renown: 15}, set: {origin_savant: true}},
      {id: "conscript", name: L("护教军辅兵", "Skitarii conscript"),
       desc: L("被征去护教军、又因植入体排异被退回的辅兵。身体结实，恐惧失控，在神教里不受待见。", "Drafted into the Skitarii, returned when your body rejected the implant. Tough frame, fear off its leash, unwelcome in the Cult."),
       sprite: "player_mechanicus", startNode: "mech_o_conscript_1",
       max: {hp: 120, sanity: 85}, stats: {hp: 120, sanity: 85, corruption: 0, renown: 5}, set: {origin_conscript: true}}
    ],
    learn: {
      leaders: ["mech_omnissiah", "mech_fabricator_general", "mech_cawl", "mech_magi", "mech_skitarii"],
      enemies: ["mech_dark_mechanicum", "nec_necrons", "xenos_ork"],
      boss: ["mech_daemon_engine", "mech_warsmith"],
      lore: ["mech_machine_spirit", "mech_stc", "mech_tech_heresy", "mech_treaty_olympus", "mech_menials", "mech_quest_knowledge"]
    },
    chapters: {
      1: L("配额", "The Quota"),
      2: L("书记", "The Lexmechanic"),
      3: L("启蒙", "Initiation"),
      4: L("探索", "Explorator"),
      5: L("绿潮", "The Green Tide"),
      6: L("裂隙", "The Schism"),
      7: L("铁与恶魔", "Iron and Daemons"),
      8: L("万机之神", "The Omnissiah")
    },
    nodes: N
  });
})();
