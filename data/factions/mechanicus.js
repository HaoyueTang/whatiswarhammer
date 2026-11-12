/* data/factions/mechanicus.js — Adeptus Mechanicus route (text role: text-mechanicus). SPEC §3, §11, §16–§19, §20b, §23, §26, §27.
 * Player: a human menial on Forge World Gravex (阿尔科萨星区 / Arcosa Sector), one red mark from servitor conversion, 113.M42.
 * Climbs the Cult: menial → lexmechanic's menial → initiate → explorator scribe → a choice about how much flesh to keep.
 * Teaches: the Omnissiah, Mars & the Fabricator-General, Cawl (rumour, omen_cawl only), Magi/Tech-Priests, Skitarii;
 * machine spirits, STCs, tech-heresy, the Treaty of Olympus, servitors/menials, the Quest for Knowledge.
 * Enemies: the Dark Mechanicum, Necrons (an explorator tomb raid on Moonlet G-7), Orks (who steal everything).
 * Boss: Dark Magos Syrredin's daemon engine. Sector links: Gravex sponsored the Thessa Null dig (necrons route),
 * ships lasguns to Aurex Secundus (imperium route); Valda's grain ships stopped coming (aeldari route).
 * Helpers as in necrons.js: L · S · C · X · RR · R · Q · O (+ ALT/ADD/RA/F/NF/FROM for SPEC §32 alt lines). Taint (SPEC §18) is hidden: never mentioned in text.
 * v0.4.0 story overhaul (SPEC §32): bridges mech_200/300/400/501/600/700, branch nodes o_savant_2b/205b/209b/302b/403b/701b/802a/806,
 * new ending mech_end_survivor; plan and numbers in docs/audit/plan_mechanicus.md.
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
  /* SPEC §32.2 helpers: alt lines (text replaces / add appends) and resultAlt entries */
  function ALT(cond, zh, en) { return {if: cond, text: {zh: zh, en: en}}; }
  function ADD(cond, zh, en) { return {if: cond, add: {zh: zh, en: en}}; }
  function RA(cond, zh, en) { return {if: cond, text: {zh: zh, en: en}}; }
  function F(x) { return {flag: x}; }
  function NF(x) { return {notFlag: x}; }
  function FROM(ids) { return {fromNode: ids}; }

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
  var SYRREDIN = S("dark_mechanicus", "黑暗马戈斯塞瑞丁", "Dark Magos Syrredin");
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
      C("去配给队列找咳嗽的托宾", "Find Tobin in the ration queue", "mech_103")
    ]};

  N.mech_102 = {chapter: 1, scene: "forge_floor", speaker: GRIES, time: {h: 1},
    text: L("监工格里斯用烙铁敲了敲你的数字。“两次红。”\n他身后，一台机仆推着矿车，脸上还留着一道你认识的伤疤。\n“再红一次，”他说，“你就再也不用吃饭了。”",
            "Overseer Gries taps your number with a branding rod. “Two reds.”\nBehind him a servitor pushes an ore cart. Its face still bears a scar you recognise.\n“One more,” he says, “and you'll never need to eat again.”"),
    choices: [
      C("连上两个班", "Work a double shift", "mech_104", X({hp: -10, renown: 3, set: {doubleShift: true}},
        "你在熔炉边站了二十个小时。数字变黄了，手掌变黑了。",
        "Twenty hours at the furnace. Your number turns yellow. Your palms turn black.")),
      C("求他宽限几天", "Beg him for a few days' grace", "mech_104", X({sanity: -5, set: {griesGrace: true}},
        "格里斯笑着在你的数字旁画了个小齿轮。“宽限已记录。利息另算。”",
        "Gries laughs and draws a tiny cog beside your number. “Grace logged. Interest extra.”")),
      C("趁他转身，顺走格里斯腰带上的口粮券", "While his back is turned, lift the ration chits from Gries's belt", "mech_104", X({hp: 5, renown: -2, set: {wronged_gries: true}},
        "你摸走了格里斯腰带上的两张券。他回头摸了摸空腰带，目光在整条线上扫了一圈，在你的数字上停了一下。",
        "You palm two chits from Overseer Gries's belt. He turns, pats the empty loop, sweeps his eyes down the line, and pauses on your number."))
    ]};

  N.mech_103 = {chapter: 1, scene: "forge_floor", speaker: TOBINMAN, time: {h: 1}, gather: L("配给队列", "Ration queue"),
    text: L("配给队列一直排到熔炉门口，前后都是灰扑扑的杂役。托宾把半块口粮掰给你：“瓦尔达的粮船再没来过，又减了。”\n他咳得很厉害，数字和你一样红。\n“要是我先进转化线，记得我哼的歌。”",
            "The ration queue runs to the furnace door, grey menials ahead and behind. Tobin breaks you half a bar. “Valda's grain ships stopped coming. Cut again.”\nHe coughs hard; his number is as red as yours.\n“If I go to the line first, remember the song I hum.”"),
    choices: [
      C("把口粮推回给他", "Push the ration back to him", "mech_104", X({hp: -5, sanity: 5, set: {tobinFriend: true, knowsTobin: true, tobinFed: true}},
        "他推辞两次，第三次收下了，然后哼起那首歌，跑调跑得很认真。",
        "He refuses twice and accepts the third time, then hums the song, earnestly off-key.")),
      C("收下，记住那首歌", "Take it, and learn the song", "mech_104", X({hp: 5, set: {tobinFriend: true, knowsTobin: true, learnedSong: true}},
        "口粮是灰的，有机油味。那首歌只有四个音，你记住了。",
        "The bar is grey and tastes of oil. The song has four notes. You remember them.")),
      C("趁托宾咳嗽，把他那份口粮也拿走", "While Tobin coughs, take his share of the ration too", "mech_104", X({hp: 5, sanity: -5, set: {knowsTobin: true, wronged_tobin: true}},
        "托宾弯着腰咳，没有拦你。你嚼着他那份口粮，味道像机油，也像你欠他的什么。",
        "Tobin is doubled over coughing and doesn't stop you. You chew his share of the bar. It tastes of oil, and of something you owe him."))
    ]};

  N.mech_104 = {chapter: 1, scene: "manufactorum", speaker: RUMM, time: {h: 6},
    alt: [ADD(F("doubleShift"), "你刚站完二十个小时，膝盖还在发抖。", "You've just done twenty hours; your knees are still shaking.")],
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
      C("鞠躬", "Bow", "mech_107", X({renown: 2, set: {vallenBow: true}},
        "你鞠躬的角度大概不合规程，但贤者的镜头记下了它。",
        "Your bow is probably not to regulation, but the Magos's lens records it.")),
      C("问他机魂是不是真的", "Ask him if machine spirits are real", "mech_107", X({sanity: -3, set: {askedSpirit: true}},
        "贤者停了半秒。“问题已记录。答案需要更高权限。”",
        "The Magos pauses half a second. “Query logged. The answer requires higher clearance.”"))
    ]};

  N.mech_106 = {chapter: 1, scene: "forge_floor", speaker: GRIES, time: {d: 2},
    alt: [ADD(F("doubleShift"), "二十个小时挣来的黄，四个小时的停线就抹掉了。", "Twenty hours of yellow, wiped out by four hours of stoppage."),
          ADD(F("griesGrace"), "“宽限到期，”格里斯说，“利息就是你的编号。”", "“Grace expired,” says Gries. “The interest is your number.”"),
          ADD(F("wronged_gries"), "他擦得很慢，另一只手一直摸着空了的腰带。", "He wipes slowly, his other hand on the empty loop of his belt.")],
    text: L("第三次红。冲压机停的那四个小时，格里斯全记在你名下，然后亲手把你的数字从板上擦掉，像擦掉一点油污。\n两个护教军走过来，一左一右，步伐整齐得像同一个人。",
            "Third red. Gries logs the press's four-hour stoppage against your name, then wipes your number off the board himself, like a smear of grease.\nTwo Skitarii approach, one on each side, moving in step like a single person."),
    effects: {sanity: -5},
    choices: [
      C("跟他们走", "Go with them", "mech_107", X(null,
        "你自己迈开了腿。护教军的手只是虚扶着你。",
        "You start walking on your own. The Skitarii's hands barely touch you.")),
      C("挣扎", "Struggle", "mech_107", X({hp: -10, set: {struggled: true}},
        "护教军没打你，只是握得更紧。他们的手是机器，不会累。",
        "The Skitarii don't strike you. They just grip tighter. Their hands are machines; they don't tire."))
    ]};

  N.mech_107 = {chapter: 1, scene: "manufactorum", speaker: null, time: {h: 3}, gather: L("候审队列", "Holding queue"),
    alt: [ADD(F("struggled"), "护教军的手一直压在你肩上，挣扎过的地方还在疼。", "A Skitarius hand stays clamped on your shoulder; where you struggled still aches."),
          ADD(F("tobinFed"), "他是托宾。“口粮那次，”他小声说，“谢了。”", "It's Tobin. “For the ration,” he whispers. “Thanks.”"),
          ADD(F("wronged_tobin"), "他是托宾。他认出了你，什么也没说。", "It's Tobin. He recognises you and says nothing."),
          ADD(F("origin_savant"), "你数过了：从配额板到这里，一百一十七步。", "You counted: from the quota board to here, one hundred and seventeen steps."),
          ADD(F("origin_conscript"), "后颈的插槽空了，恐惧在里面来回撞。", "The socket at your neck is empty; fear rattles around inside it.")],
    text: L("转化线前的候审队列很长。几十个人低声交换消息：谁的编号昨天被擦掉，谁的手被评估为“可用”。\n排在你前面的杂役回头冲你笑了笑，哼起一首只有四个音的歌。\n轮到他了。然后，轮到你。",
            "The holding queue for the conversion line is long. Dozens trade whispers: whose number was wiped yesterday, whose hands were rated ‘usable’.\nThe menial ahead of you turns, smiles, and hums a song of four notes.\nHis turn comes. Then yours."),
    codex: ["imp_servitor"],
    choices: [
      C("报出档案里的备注编号", "Quote the note number in your file", "mech_108", O(Q({flag: "noticed"}), X({renown: 5},
        "神甫查了查数据圈里贤者的记录，把你推向另一扇门。前面那个人没有回头。",
        "The priest checks the Magos's note in the noosphere and pushes you toward another door. The man ahead never looks back."),
        {resultAlt: [RA(F("origin_conscript"), "凯什的备注写着：排异者，坚韧，转作书记。神甫把你推向另一扇门。", "Kesh's note reads: rejector, durable, reassign as scribe. The priest pushes you toward another door."),
                     RA(F("origin_savant"), "奥西娅的记录还在数据圈里：“会再借。”神甫把你推向另一扇门。", "Ossia's entry is still in the noosphere: ‘will borrow again.’ The priest pushes you toward another door.")]})),
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
    alt: [ALT({all: [F("origin_savant"), F("hidTalent")]}, "你被按上手术台。一个戴单片镜的书记神甫路过，停下来看了你很久。\n“我考过你，”奥西娅说，“你答错过一题——是故意的吧？谁送它来的？”\n手术锯停在半空。",
              "They press you onto the table. A lexmechanic with a monocle passes, stops, and studies you a long while.\n“I tested you,” says Ossia. “You missed one. On purpose, I think. Who sent this one here?”\nThe surgical saw halts in mid-air."),
          ALT(F("origin_savant"), "你被按上手术台。一个戴单片镜的书记神甫路过，停下来看了你很久。\n“是你，”奥西娅说，“没装外壳的计算机。我说过会再来借。谁送它来的？”\n手术锯停在半空。",
              "They press you onto the table. A lexmechanic with a monocle passes, stops, and studies you a long while.\n“You,” says Ossia. “The cogitator without a casing. I said I'd borrow you again. Who sent it here?”\nThe surgical saw halts in mid-air."),
          ALT(F("origin_conscript"), "你被按上手术台。一个戴单片镜的书记神甫路过，停下来看你的手。\n“这只手在发抖，”她说，“可它在数手术锯的转速，一转不差。谁送它来的？”\n手术锯停在半空。",
              "They press you onto the table. A lexmechanic with a monocle passes, stops, and looks at your hand.\n“This hand is shaking,” she says, “but it's counting the saw's revolutions, every one. Who sent it here?”\nThe surgical saw halts in mid-air."),
          ADD(F("tapped"), "是冲压机的节拍：左，右，左。", "It's the press's rhythm: left, right, left.")],
    text: L("你被按上手术台。一个戴单片镜的书记神甫路过，停下来看你的手。\n“这只手在桌沿上敲节拍，一拍不差，”她说，“比计时器还准。谁送它来的？”\n手术锯停在半空。",
            "They press you onto the table. A lexmechanic with a monocle passes, stops, and looks at your hand.\n“This hand is tapping time on the table edge, not a beat off,” she says. “Better than a chronometer. Who sent it here?”\nThe surgical saw halts in mid-air."),
    choices: [
      C("“我还会数别的！”", "“I can count other things too!”", null, O({effects: {renown: 3}}, R(0.7, "sanity", "mech_108", "mech_end_servitor",
        RR("她挑了挑眉，考了你三道题，把你从台上拉了下来。“证明给我看。”", "She raises an eyebrow, sets you three sums, and pulls you off the table. “Prove it.”",
           "你张开嘴，数字全都卡在喉咙里。她等了三秒，走开了。锯子重新转了起来。", "You open your mouth and every number sticks in your throat. She waits three seconds and walks on. The saw spins up again.")))),
      C("“也看看前面那个人！”", "“Look at the man before me too!”", "mech_108", X({sanity: -5, set: {askedTobin: true}},
        "她看了一眼隔壁台。“那一个已经开始了。”她的声音没有起伏，只是走得快了些。",
        "She glances at the next table. “That one has already begun.” Her voice is flat; she just walks a little faster.")),
      C("引用合同第九条：我仍有计算价值", "Cite clause nine: I still have computational value", "mech_108", O(Q({flag: "readContract"}, true), X({renown: 3},
        "你一字不差地背出条款。奥西娅笑了：“合同上说得对。下来吧，债务人。”",
        "You recite the clause word for word. Ossia smiles. “The contract is right. Get down, debtor.”"))),
      C("闭上眼，不挣扎了", "Close your eyes and stop fighting", "mech_end_servitor", O(Q({stat: "sanity", max: 75}, true), X({sanity: -10},
        "你闭上眼。锯子重新转起来，那首四个音的歌越来越远。",
        "You close your eyes. The saw spins up again; the four-note song fades away."),
        {resultAlt: [RA(F("origin_conscript"), "没有晶片替你关掉恐惧了。你抖得说不出话，神甫把这记录为“同意”。", "There's no wafer to switch the fear off now. You shake too hard to speak; the priest logs it as consent.")]}))
    ]};

  N.mech_108 = {chapter: 1, scene: "tech_vault", speaker: OSSIA, time: {d: 1},
    alt: [ALT(F("origin_savant"), "“又见面了，”奥西娅说，“现在你是我的杂役。别感动，我只是缺个会数数的。”\n第七圣库里堆满了没人读过的数据板。\n“按神圣顺序排好。哪种顺序？你自己猜。”",
              "“We meet again,” says Ossia. “You're my menial now. Don't be moved. I just needed something that counts.”\nThe Seventh Vault is stacked with data-slates nobody has read.\n“Sort them in sacred order. Which order? Guess.”")],
    text: L("“书记神甫奥西娅，”她说，“现在你是我的杂役。别感动，我只是缺个会数数的。”\n第七圣库里堆满了没人读过的数据板。\n“按神圣顺序排好。哪种顺序？你自己猜。”",
            "“Lexmechanic Ossia,” she says. “You're my menial now. Don't be moved. I just needed something that counts.”\nThe Seventh Vault is stacked with data-slates nobody has read.\n“Sort them in sacred order. Which order? Guess.”"),
    effects: {set: {apprentice: true}},
    codex: ["place_gravex_vault"],
    choices: [
      C("按日期排", "Sort by date", "mech_200", X({renown: 3, set: {sortDate: true}},
        "你排到深夜。奥西娅检查了一遍，没有夸你，只是又搬来三箱。",
        "You sort into the night. Ossia checks it, offers no praise, and brings three more crates.")),
      C("按灰尘的厚度排", "Sort by the thickness of the dust", "mech_200", X({sanity: 5, set: {sortDust: true}},
        "奥西娅看了很久。“灰尘也是时间。这个答案……可以接受。”",
        "Ossia studies it a long time. “Dust is also time. That answer is… acceptable.”"))
    ]};

  /* ---------- Origin prologue · Hive-born savant ---------- */
  N.mech_o_savant_1 = {chapter: 1, scene: "hive_hab", speaker: CLERK,
    text: L("你在格拉维克斯的居住尖塔长大，念过三年经院，背得出四千位数字。\n后来家里欠了神教的电费。\n债务官翻开账本：“抵债。你的脑子，十年。”",
            "You grew up in Gravex's hab-spire: three years of scholam, four thousand digits memorised.\nThen your family fell behind on the Cult's power tithe.\nThe debt clerk opens his ledger. “Payment in kind. Your brain. Ten years.”"),
    codex: ["place_gravex", "place_arcosa"],
    choices: [
      C("签字，顺手纠正他的账", "Sign, and fix his sums while you're at it", "mech_o_savant_2", X({renown: 3, set: {correctedClerk: true}},
        "签名时你纠正了他账本上的一处加法。他没有谢你，只在你的档案上做了个记号。",
        "As you sign you correct an addition in his ledger. He doesn't thank you; he marks your file.")),
      C("要求看合同细则", "Demand to read the fine print", "mech_o_savant_2", X({sanity: -5, set: {readContract: true}},
        "细则第九条：若债务人失去计算价值，转作机仆抵偿余额。",
        "Clause nine: should the debtor lose computational value, convert to servitor to settle the balance."))
    ]};

  N.mech_o_savant_2 = {chapter: 1, scene: "manufactorum", speaker: GRIES, time: {d: 3}, gather: L("计数台", "Tally hall"),
    jump: L("抵债生效，你被押下居住尖塔", "The debt takes effect; you're marched down the spire"),
    alt: [ADD(F("correctedClerk"), "债务官的记号传到了这里。格里斯早就在等“那个会纠错的”。", "The clerk's mark has travelled here. Gries has been waiting for ‘the one who corrects’.")],
    text: L("你被分到第七熔炉的计数台。几十个计数员挤在长台前，用眼睛给铆钉计数，谁少数一颗大家都看得见。\n第三天你发现，配额板上的数比实际少一成，那一成进了监工格里斯的口袋。\n他注意到你在看。",
            "You're put on the Seventh Furnace's tally hall: dozens of counters elbow to elbow, counting rivets by eye, every slip in plain view.\nOn day three you notice the quota board reads a tenth short. That tenth goes into Overseer Gries's pocket.\nHe notices you looking."),
    codex: ["mech_menials"],
    choices: [
      C("当面指出", "Point it out to his face", "mech_o_savant_3", X({renown: 5, hp: -5, set: {griesRed: true}},
        "格里斯没否认，只罚你搬了一夜矿渣。第二天，你的数字是红的。",
        "Gries doesn't deny it. He just has you haul slag all night. Next day your number is red.")),
      C("装作没看见", "Pretend you saw nothing", "mech_o_savant_2b", X({sanity: -5},
        "你低头继续数。收工的哨声响时，格里斯的影子落在你的台面上。",
        "You lower your head and keep counting. When the shift whistle blows, Gries's shadow falls across your bench.")),
      C("匿名举报格里斯克扣配额", "Report Gries's skimming anonymously", "mech_o_savant_3", X({renown: 3, set: {wronged_gries: true}},
        "巡查书记查了格里斯的账，罚了他三个月的烙铁津贴。他认得那手字：整座熔炉，只有你那样写小数点。",
        "The inspecting clerk audits Gries's books and docks his branding-rod allowance for three months. He knows the hand: on this furnace, nobody else writes decimals that way."))
    ]};

  N.mech_o_savant_2b = {chapter: 1, scene: "manufactorum", speaker: GRIES, time: {h: 8},
    text: L("计数台空了，只剩你和格里斯。他把一本油腻的账本推到你面前。\n“你看见了，对吧？会数数的，替我把账做平。”\n“做得好，你的数字永远是绿的。”",
            "The tally hall has emptied; only you and Gries remain. He pushes a greasy ledger across to you.\n“You saw. Didn't you? You can count. Make my books balance.”\n“Do it well and your number stays green for ever.”"),
    choices: [
      C("接过账本", "Take the ledger", "mech_o_savant_3", X({sanity: -5, set: {griesBook: true}},
        "你做了一夜。账平得像镜面。格里斯拍拍你的肩，没说谢谢。",
        "You work all night. The books come out mirror-smooth. Gries pats your shoulder and doesn't say thanks.")),
      C("把账本推回去", "Push the ledger back", "mech_o_savant_3", X({renown: 3, set: {griesRed: true}},
        "格里斯把账本夹回腋下。“好，”他说，“那我们就按实数来。”第二天，你的数字是红的。",
        "Gries tucks the ledger back under his arm. “Fine,” he says. “Then we'll go by the true count.” Next day your number is red."))
    ]};

  N.mech_o_savant_3 = {chapter: 1, scene: "tech_vault", speaker: OSSIA, time: {d: 2},
    text: L("一位书记神甫来熔炉借人：圣库的计算机坏了，需要有人心算校对。\n奥西娅考了你一道题，又一道，又一道。\n“你的大脑，”她说，“是一台没装外壳的计算机。”",
            "A lexmechanic comes to borrow a menial: the Vault's cogitator is down and someone must check sums by hand.\nOssia tests you with one problem, then another, then another.\n“Your brain,” she says, “is a cogitator without a casing.”"),
    codex: ["place_gravex_vault"],
    choices: [
      C("答对，再指出她题里的错", "Answer, then correct her question", "mech_o_savant_4", X({renown: 5, set: {noticed: true}},
        "奥西娅沉默片刻，在数据板上记下你的编号。“我会再来借你。”",
        "Ossia is silent a moment, then logs your number. “I'll borrow you again.”")),
      C("故意答错一题，免得惹眼", "Miss one on purpose, to stay unnoticed", "mech_o_savant_4", X({sanity: 3, set: {hidTalent: true}},
        "她点点头，把你送回熔炉。低调是一种安全，也是一种浪费。",
        "She nods and sends you back. Keeping low is safe. It's also a waste."))
    ]};

  N.mech_o_savant_4 = {chapter: 1, scene: "forge_floor", speaker: GRIES, time: {d: 2},
    alt: [ADD(F("griesBook"), "你替他做的那本账，最后一页写着：亏空由计数员负责。", "The ledger you balanced for him ends with one line: shortfall charged to the counter."),
          ADD(F("griesRed"), "你戳破的那一成，他用三道红笔还给了你。", "The tenth you exposed, he has paid back in three red strokes."),
          ADD(F("wronged_gries"), "罚掉的津贴，他记得是谁的小数点。", "The docked allowance: he remembers whose decimal points did it.")],
    text: L("三天里三次红，都是格里斯的笔迹。他擦掉你的数字时凑近说：“会数数的人，进了转化线也能数。”\n两个护教军一左一右架起你。\n你开始默数步子。",
            "Three reds in three days, all in Gries's hand. As he wipes your number he leans close. “A counting man can count on the conversion line too.”\nTwo Skitarii take you by the arms.\nYou start counting your steps."),
    effects: {sanity: -5},
    choices: [
      C("继续数", "Keep counting", "mech_107", X(null,
        "一百一十七步。你数得很准，这一点也不让你好受。",
        "One hundred and seventeen steps. You count them exactly. It doesn't help."))
    ]};

  /* ---------- Origin prologue · Skitarii conscript ---------- */
  N.mech_o_conscript_1 = {chapter: 1, scene: "barracks", speaker: KESH,
    text: L("你抽中了护教军辅兵的签。手术只花了十分钟：后颈多了一个插槽。\n凯什-43阿尔法插进一枚晶片，你突然不怕了，不怕得很奇怪。\n“恐惧已关闭，”她说，“以后由我决定你什么时候怕。”",
            "Your lot was drawn for the Skitarii auxilia. The surgery took ten minutes: a socket in the back of your neck.\nAlpha Kesh-43 slots in a wafer and suddenly you're unafraid. Strangely so.\n“Fear disabled,” she says. “From now on, I decide when you're afraid.”"),
    codex: ["mech_skitarii", "place_gravex", "place_arcosa"],
    choices: [
      C("向她敬礼", "Salute her", "mech_o_conscript_2", X({renown: 3, set: {syncGood: true}},
        "你的手抬得太快，像被线拉着。凯什点头：“同步率良好。”",
        "Your hand snaps up too fast, as if on a string. Kesh nods. “Synchronisation nominal.”")),
      C("摸后颈的插槽", "Touch the socket on your neck", "mech_o_conscript_2", X({sanity: -5, set: {socketDoubt: true}},
        "插槽是凉的。你摸到它时，晶片里的勇气轻轻颤了一下。",
        "The socket is cold. As you touch it, the courage in the wafer flickers."))
    ]};

  N.mech_o_conscript_2 = {chapter: 1, scene: "ruins", speaker: KESH, foe: "gretchin", time: {d: 2},
    text: L("两天后，渣场实弹演练。靶子是活的：一群溜进来偷废料的绿皮小东西。\n“辐射卡宾枪，”凯什说，“别站在下风口。”\n一只小绿皮抱着半个齿轮，冲你做鬼脸。",
            "Two days on: live-fire drill on the slag fields. The targets are alive, a pack of little greenskins sneaking in to steal scrap.\n“Radium carbine,” says Kesh. “Don't stand downwind.”\nOne little greenskin hugs half a cog and pulls faces at you."),
    codex: ["xenos_ork"],
    choices: [
      C("开火", "Fire", "mech_o_conscript_3", X({hp: -10, renown: 5, set: {shotGrot: true}, taint: {khorne: 25}},
        "你命中了。卡宾枪的辐射也命中了你，牙龈开始发麻。",
        "You hit it. The carbine's radiation hits you too; your gums go numb.")),
      C("朝天鸣枪吓走它", "Fire into the air to scare it off", "mech_o_conscript_3", X({renown: -3, sanity: 5, set: {sparedGrot: true}},
        "小东西抱着半个齿轮逃了。凯什记录：“射击偏差：情感性。”",
        "The little thing flees, still hugging its half-cog. Kesh logs: “Firing deviation: emotional.”"))
    ]};

  N.mech_o_conscript_3 = {chapter: 1, scene: "barracks", speaker: KESH, time: {d: 8},
    jump: L("十天的同步训练后，插槽开始排异", "After ten days of sync drills, the socket starts to fail"),
    alt: [ADD(F("syncGood"), "凯什调出你的同步记录：第一天满分。“曾经，”她说。", "Kesh pulls up your sync log: perfect on day one. “Once,” she says."),
          ADD(F("socketDoubt"), "第一次摸插槽时它就在发凉。你早就知道。", "The socket was cold the first time you touched it. You knew."),
          ADD(F("sparedGrot"), "射击偏差那一行还挂在你的档案最上面。", "The firing-deviation line still heads your file.")],
    text: L("第十天，你的身体开始排斥插槽。后颈发烫，晶片里的命令变成了杂音。\n凯什给你做了检测，没有表情。\n“组织排异。不适合护教军，”她说，“适合别的用途。”",
            "On day ten your body starts rejecting the socket. Your neck burns; the wafer's commands turn to static.\nKesh tests you, expressionless.\n“Tissue rejection. Unfit for the Skitarii,” she says. “Fit for other purposes.”"),
    effects: {hp: -10},
    choices: [
      C("“我还能打！”", "“I can still fight!”", "mech_o_conscript_4", X({renown: 3, set: {noticed: true}},
        "凯什停顿了一下，在你的档案里加了一行备注，没告诉你写了什么。",
        "Kesh pauses and adds a line to your file. She doesn't tell you what it says.")),
      C("“什么用途？”", "“What purposes?”", "mech_o_conscript_4", X({sanity: -5, set: {sawServitors: true}},
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
      C("回头看凯什最后一眼", "Look back at Kesh one last time", "mech_107", X({sanity: 3, set: {keshMemory: true}},
        "她站在营房门口，镜头对着你，一直没移开。你记住了她肩甲上的刮痕。",
        "She stands at the barracks door, lens on you, never moving. You memorise the scratch on her pauldron."))
    ]};

/* ============ Chapter 2 · The Lexmechanic ============ */
  N.mech_200 = {chapter: 2, scene: "tech_vault", speaker: OSSIA, time: {h: 10}, bridge: true,
    alt: [ADD(F("askedTobin"), "你问起隔壁台上的那个人。“问题已记录，”她说，“答案你不会喜欢。”", "You ask about the man on the next table. “Query logged,” she says. “You won't like the answer.”"),
          ADD(F("pulledTobin"), "手腕上还有护教军的指印。你拽过的那只袖子，后来空了。", "Skitarius fingermarks still ring your wrist. The sleeve you pulled is empty now."),
          ADD(F("wronged_tobin"), "你多出的那十分钟，现在是一张折叠铺。你睡不着。", "The ten minutes you bought are a folding cot now. You can't sleep."),
          ADD(F("origin_savant"), "铺位上已经放好一块空白数据板。“我说过会再借你。”", "A blank data-slate waits on the cot. “I said I'd borrow you again.”"),
          ADD(F("origin_conscript"), "后颈的空插槽一碰枕头就疼。恐惧还在，只是累了。", "The empty socket aches against the pillow. The fear is still there, only tired.")],
    text: L("进圣库的第一夜。你睡在两排书架之间的折叠铺上，熔炉的轰鸣隔着墙传过来。\n奥西娅在书架后面还没睡，笔尖一直在响。\n“明天开始学二进制，”她说，“熄灯。”",
            "Your first night in the Vault. You sleep on a folding cot between two shelves; the furnaces roar through the wall.\nOssia is still up behind the shelves, her stylus scratching on.\n“Binary starts tomorrow,” she says. “Lights out.”"),
    choices: [
      C("闭上眼", "Close your eyes", "mech_201", X(null,
        "你闭上眼，第一次不用去想配额板。梦里全是数据板落灰的声音。",
        "You close your eyes and, for the first time, don't think of the quota board. You dream of dust settling on slates."))
    ]};

  N.mech_201 = {chapter: 2, scene: "tech_vault", speaker: OSSIA, time: {d: 20}, eventRoll: 0.3,
    text: L("二十天后，你的编号多了个后缀：圣库杂役。你学会了十六句二进制祷词，奥西娅说这相当于会说“你好”和“请原谅我”。\n“机器能听懂你了，”她说，“但它不一定原谅你。”",
            "Twenty days on, your number carries a suffix: Vault menial. You've learned sixteen binary prayers; Ossia says that's like knowing “hello” and “forgive me.”\n“The machines can understand you now,” she says. “That doesn't mean they forgive you.”"),
    codex: ["mech_noosphere"],
    choices: [
      C("通宵练习二进制", "Practise binary all night", "mech_202", X({sanity: -3, renown: 5, set: {binary: true}},
        "你在梦里也用0和1说话。醒来时，你的牙齿在打拍子。",
        "You dream in ones and zeros. When you wake, your teeth are keeping time.")),
      C("问她机仆还记不记得从前", "Ask her if servitors remember", "mech_202", X({set: {askedServitor: true}},
        "奥西娅停下笔。“正式答案：不记得。”她顿了顿，“非正式答案：去问问它们。”",
        "Ossia stops writing. “Official answer: no.” A pause. “Unofficial answer: go and ask them.”"))
    ]};

  N.mech_202 = {chapter: 2, scene: "forge_floor", speaker: TOBIN, time: {h: 4},
    grudgeLine: {npc: "gries", text: L("这是格里斯监工管的炉子。他叉着手站在炉口，目光钉在你身上。", "This is Overseer Gries's furnace. He stands arms folded at the furnace mouth, eyes fixed on you.")},
    alt: [ADD({all: [F("tobinFriend"), NF("learnedSong")]}, "你认得这张脸。几天前，他还告诉过你他的名字。", "You know this face. Days ago he told you his name."),
          ADD(F("askedServitor"), "“去问问它们，”奥西娅说过。你走近了一步。", "“Go and ask them,” Ossia said. You step closer."),
          ADD(F("learnedSong"), "那四个音你早就会了——配给队列里他教过你。", "You've known those four notes since the ration queue. He taught you."),
          ADD(F("sawServitors"), "它的步伐是护教军操典里的步伐，凯什指给你看过。", "Its gait is straight from the Skitarii drill-book. Kesh once pointed it out to you.")],
    text: L("一台机仆在熔炉边搬钢锭，编号牌上写着T-0B1N。是转化线上排在你前面的那个人。\n它的嘴不会说话了，喉咙里却在哼一首歌。四个音，跑调跑得很认真。\n它没有看你。",
            "A servitor hauls ingots by the furnace. Its plate reads T-0B1N. It is the man who stood ahead of you on the line.\nIts mouth no longer speaks, but its throat hums a song. Four notes, earnestly off-key.\nIt doesn't look at you."),
    codex: ["mech_menials"],
    choices: [
      C("跟着哼", "Hum along", "mech_203", O({grudge: {npc: "gries", effects: {hp: -6},
          note: L("格里斯在场：你在他的炉前偷懒，他会罚你多搬钢锭。", "Gries is watching: loitering at his furnace, you'll be docked extra ingots.")}},
        X({sanity: 5, set: {tobinSong: true, keeper: true}},
        "你哼第二遍时，它的手停了半秒。只有半秒。然后钢锭继续往前走。",
        "On your second time through, its hands stop for half a second. Only half. Then the ingots move on."))),
      C("别过脸去", "Look away", "mech_203", X({sanity: -5, set: {avoidedTobin: true}},
        "歌声一直跟着你，直到被熔炉的轰鸣吞掉。",
        "The humming follows you until the furnace's roar swallows it.")),
      C("替它擦掉脸上的油", "Wipe the oil from its face", "mech_203", X({hp: -5, sanity: 3, set: {tobinSong: true, keeper: true, wipedFace: true}},
        "钢锭的热度隔着布烫伤了你的手。它的脸干净了。它不会知道。",
        "The ingot's heat burns your hand through the cloth. Its face is clean now. It will never know."))
    ]};

  N.mech_203 = {chapter: 2, scene: "tech_vault", speaker: VALLEN, time: {d: 2},
    alt: [ADD({not: {anyFlag: ["vallenBow", "askedSpirit"]}}, "袍下伸出六根机械触手的瓦伦贤者，你是第一次见。", "Magos Vallen, six mechadendrites trailing from his robe: you've never met him before."),
          ADD(F("vallenBow"), "“鞠躬的那个，”他说，“角度仍不合规程。”", "“The one who bowed,” he says. “Angle still not to regulation.”"),
          ADD(F("binary"), "你用二进制向残片问好。贤者的一根触手微微抬起。", "You greet the fragment in binary. One of the Magos's tendrils lifts slightly.")],
    text: L("瓦伦贤者让你抄录一块残片：标准模板构造，黑暗科技时代的遗物，缺了三成。\n“我们不发明，”他说，“我们回忆。人类曾经知道一切，后来忘了。”\n“我们的工作是把它想起来。”",
            "Magos Vallen sets you to copy a fragment: a Standard Template Construct, relic of the Dark Age of Technology, a third of it missing.\n“We do not invent,” he says. “We remember. Humanity once knew everything, then forgot.”\n“Our work is to recall it.”"),
    codex: ["mech_stc", "mech_quest_knowledge", "mech_magi"],
    choices: [
      C("一笔一画照抄", "Copy it stroke for stroke", "mech_204", X({renown: 5, set: {copyist: true}},
        "你连残片上的划痕都抄了下来。贤者说，划痕也可能是神圣的。",
        "You copy even the scratches. The Magos says scratches may also be sacred.")),
      C("“缺的部分，为什么不自己补？”", "“Why not complete the missing part ourselves?”", "mech_204", X({renown: -3, set: {askedNew: true}},
        "贤者的触手全停住了。“上一个问这个问题的人，现在在搬钢锭。”",
        "All his mechadendrites freeze. “The last one to ask that now hauls ingots.”"))
    ]};

  N.mech_204 = {chapter: 2, scene: "tech_vault", speaker: OSSIA, time: {d: 6},
    alt: [ADD(F("sortDust"), "“你按灰尘排过档案，”她说，“你会懂的。”", "“You sorted the archive by dust,” she says. “You'll understand.”"),
          ADD(F("sortDate"), "她犹豫了很久才拿出来：“你只会按规矩排。可我总得给谁看看。”", "She hesitates a long time first. “You only sort by the rules. But I have to show someone.”"),
          ADD(F("askedNew"), "“你问过贤者为什么不补，”她说，“整座圣库都听说了。”", "“You asked the Magos why we don't complete it,” she says. “The whole Vault heard.”")],
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
        "贤者听完，只说了一个词：“确认。”那晚奥西娅在圣库里等到天亮，没有等到你。",
        "The Magos listens and says one word: “Confirmed.” That night Ossia waits in the Vault till dawn. You don't come."))
    ]};

  N.mech_205 = {chapter: 2, scene: "tech_vault", speaker: KESH, time: {d: 2},
    alt: [ADD(F("origin_conscript"), "“排异者，”她说，“你在这里做什么？”", "“Rejector,” she says. “What are you doing here?”"),
          ADD(F("keshMemory"), "你认得她肩甲上的刮痕。她也认得你。", "You know the scratch on her pauldron. She knows you."),
          ADD(F("ossiaFriend"), "第八种规格的图纸还摊在桌上，被你用袖子盖住。", "The eighth-gauge drawing is still on the desk, under your sleeve."),
          ADD(F("ossiaWarned"), "扳手没熔。你劝过她，她没听。", "The spanner was never melted. You told her. She didn't listen.")],
    text: L("护教军包围了圣库。凯什-43阿尔法宣布：“侦测到未授权设计。技术异端。”\n她的辐射卡宾枪扫过每一张脸，在你脸上多停了一秒。\n奥西娅的抽屉就在你身后。",
            "Skitarii surround the Vault. Alpha Kesh-43 announces: “Unsanctioned design detected. Tech-heresy.”\nHer radium carbine sweeps every face and lingers a second on yours.\nOssia's drawer is right behind you."),
    codex: ["mech_skitarii"],
    choices: [
      C("平静地说谎", "Lie, calmly", null, R(0.5, "sanity", "mech_207", "mech_206",
        RR("“这里只有档案，阿尔法。”你的声音稳得像校准过的机器。她走了。", "“Only archives here, Alpha.” Your voice is steady as a calibrated machine. She leaves.",
           "你说谎时眨了一下眼。凯什的镜头捕捉到了。抽屉被拉开了。", "You blink as you lie. Kesh's lens catches it. The drawer is opened."))),
      C("“是我做的。”", "“I made it.”", "mech_205b", X({set: {tookBlame: true, ossiaFriend: true}},
        "凯什的镜头在你和抽屉之间来回对焦。“嫌疑人自首。押送贤者裁决。”",
        "Kesh's lens refocuses between you and the drawer. “Suspect confesses. Remand to the Magos.”")),
      C("看向奥西娅，把她交出去", "Look at Ossia, giving her up", "mech_206", X({sanity: -5, set: {wronged_ossia: true}},
        "你什么也没说，只是看了奥西娅一眼。对凯什来说，一眼就够了。",
        "You say nothing. You only glance at Ossia. For Kesh, a glance is enough."))
    ]};

  N.mech_205b = {chapter: 2, scene: "tech_vault", speaker: VALLEN, time: {h: 6},
    text: L("瓦伦贤者翻着扳手：“杂役设计不出第七种规格。”\n奥西娅上前一步：“是我的。这孩子连规格都分不清。”\n判决：你挨十二下电鞭，她被剥夺职衔，发配外围熔炉做忏悔劳役。",
            "Magos Vallen turns the spanner over. “A menial could not design a seventh gauge.”\nOssia steps forward. “It's mine. This child can't tell one gauge from another.”\nThe sentence: twelve lashes of the electro-flail for you; for her, loss of rank and penance labour at the outer furnaces."),
    effects: {hp: -12, renown: -5, set: {ossiaGone: true, ossiaOwes: true}},
    choices: [
      C("咬牙挨完鞭子", "Grit your teeth through the lashes", "mech_207", X({sanity: -3},
        "十二下，每下都很准。奥西娅被押走时回头看了你一眼，那一眼像在说：记账。",
        "Twelve strokes, each exact. As they lead Ossia away she looks back once, a look that says: noted."))
    ]};

  N.mech_206 = {chapter: 2, scene: "tech_vault", speaker: VALLEN, time: {d: 1},
    alt: [ADD(F("reportedOssia"), "门口的护教军向你点头，像向同僚点头。", "The Skitarius at the door nods to you, as to a colleague.")],
    text: L("审判很快。奥西娅被剥夺职衔，发配到外围熔炉做忏悔劳役。\n她被带走时没有看你。\n瓦伦贤者把她的单片镜交给你：“她的档案没人会读。你来读，直到找到能读的人。”",
            "The judgement is quick. Ossia is stripped of rank and sent to penance labour at the outer furnaces.\nShe doesn't look at you as they take her.\nMagos Vallen hands you her monocle. “Nobody will read her archive. You will, until someone who can is found.”"),
    effects: {renown: 5, sanity: -5, set: {ossiaGone: true}},
    choices: [
      C("戴上单片镜", "Put on the monocle", "mech_207", X({renown: 3, set: {woreMonocle: true}},
        "镜片里还留着她的校准参数。整个世界看起来都有点歪。",
        "The lens still holds her calibration. The whole world looks slightly askew.")),
      C("收起来，不戴", "Pocket it, unworn", "mech_207", X({sanity: 3, set: {keptMonocle: true}},
        "你把它放进口袋。它很沉，比它该有的重量沉。",
        "You pocket it. It's heavy there, heavier than it should be."))
    ]};

  N.mech_207 = {chapter: 2, scene: "forge_floor", speaker: FULGUR, time: {d: 10}, gather: L("建厂日庆典", "Founding feast"),
    jump: L("十天后，格拉维克斯的建厂日", "Ten days later: Gravex's Founding Day"),
    alt: [ADD(F("tookBlame"), "鞭伤还没好，人群一挤，背上就火辣辣地疼。", "The lash-wounds haven't healed; every shove in the crowd sets your back on fire."),
          ADD(NF("ossiaGone"), "奥西娅挤在你身边，袖子里藏着她的扳手，一直没松手。", "Ossia is squeezed in beside you, her spanner hidden in her sleeve, never let go."),
          ADD(F("ossiaGone"), "奥西娅不在了。她的档案你读了十天，还没读完。", "Ossia is gone. You've read her archive for ten days and aren't through it.")],
    text: L("十天后，建厂日庆典。熔炉间挤满杂役、神甫和朝圣者。电祭司赤着上身走过，皮肤上爬满蓝色电弧。\n人群伸手去碰，被电倒，又爬起来笑。\n一位电祭司向你伸出手：“原动力在召唤你。”",
            "Ten days on: the Founding feast. Menials, priests and pilgrims pack the furnace halls. Electro-priests walk bare-chested through them, blue arcs crawling over their skin.\nPeople reach out, get knocked flat, and rise laughing.\nAn electro-priest holds out a hand. “The Motive Force calls you.”"),
    codex: ["mech_electro_priests"],
    choices: [
      C("握住那只手", "Take the hand", "mech_208", X({hp: -8, renown: 5, sanity: 5, set: {motiveTouched: true}},
        "你醒来时躺在地上，头发竖着，心跳像一台新校准的泵。周围的人在鼓掌。",
        "You wake on the floor, hair on end, heart beating like a freshly calibrated pump. People applaud.")),
      C("鞠躬，退后", "Bow and step back", "mech_208", X({renown: -2, set: {motiveLater: true}},
        "电祭司收回手，没生气。“下次。”他的指尖在空气里留下焦味。",
        "The priest withdraws his hand without offence. “Next time.” His fingertips leave a scorched smell."))
    ]};

  N.mech_208 = {chapter: 2, scene: "mars_vista", speaker: MARS, time: {h: 2},
    text: L("庆典的高潮：一段火星广播，经星语者转录，迟到了四十年。\n画面里，红色星球被熔炉的光环包围。一个声音宣读铸造将军的诏令：什一税提高，祈祷加倍。\n全场的神甫同时跪下。",
            "The feast's climax: a broadcast from Mars, relayed by astropaths, forty years late.\nOn screen the Red Planet is ringed with forge-light. A voice reads the Fabricator-General's decree: tithes raised, prayers doubled.\nEvery tech-priest kneels at once."),
    codex: ["place_mars", "mech_fabricator_general"],
    choices: [
      C("问身边的神甫：火星听帝皇的吗", "Ask a priest: does Mars obey the Emperor?", "mech_209", X({set: {askedTreaty: true}},
        "神甫想了想。“火星听万机之神的。帝皇就是万机之神。所以……是的。大概。”",
        "The priest considers. “Mars obeys the Omnissiah. The Emperor is the Omnissiah. So… yes. Roughly.”")),
      C("跟着跪下", "Kneel with them", "mech_209", X({renown: 3, set: {knelt: true}},
        "地板是热的。四十年前的声音在你头顶念完了最后一个数字。",
        "The floor is warm. A forty-year-old voice finishes its last number above your head."))
    ]};

  N.mech_209 = {chapter: 2, scene: "mars_vista", speaker: VALLEN, time: {h: 1},
    alt: [ADD(F("reportedOssia"), "“你证明了忠诚。”他说这话时，触手一动不动。", "“You have proven loyal.” His tendrils stay perfectly still as he says it."),
          ADD(F("tookBlame"), "“我需要把你放在看得见的地方。”", "“I need you where I can see you.”"),
          ADD(NF("ossiaGone"), "“奥西娅说你可用。我想亲自看看。”", "“Ossia says you are usable. I wish to see for myself.”"),
          ADD(F("askedTreaty"), "“你问过火星听不听帝皇的。这就是答案。”", "“You asked whether Mars obeys the Emperor. That is the answer.”"),
          ADD(F("copyist"), "“你抄残片时连划痕都没放过。”", "“You copied the fragment down to its scratches.”"),
          ADD(F("knelt"), "“我看见你跪下了。”", "“I saw you kneel.”")],
    text: L("广播结束，瓦伦贤者把你叫到一边。“帝皇登上火星，我们认出了他，订立了奥林匹斯条约。火星给枪炮，帝国给自由；我们的激光枪至今运往奥雷克斯二号。”\n“你可以申请入教了。”",
            "As the broadcast ends Magos Vallen draws you aside. “The Emperor came to Mars, we recognised him, and the Treaty of Olympus was sealed. Mars gives guns, the Imperium gives freedom; our lasguns still ship to Aurex Secundus.”\n“You may petition for initiation.”"),
    codex: ["mech_treaty_olympus", "place_aurex"],
    choices: [
      C("背出整座圣库的索引", "Recite the Vault's entire index", "mech_300", O(Q({flag: "origin_savant"}, true), X({renown: 10, set: {indexRecited: true}},
        "你背了四十分钟。贤者听完，第一次用“我们”称呼你。",
        "You recite for forty minutes. When you finish, the Magos calls you “we” for the first time."))),
      C("“我申请。”", "“I petition.”", "mech_300", X({renown: 5},
        "贤者在数据圈里给你开了新档案。名字一栏，暂时空着。",
        "The Magos opens a new file for you in the noosphere. The name field stays blank for now.")),
      C("“入教要换掉多少肉？”", "“How much flesh does initiation cost?”", "mech_209b", X({sanity: -3},
        "贤者没回答，转身就走。走了几步，他回头：“跟上。”",
        "The Magos doesn't answer; he turns and walks. A few steps on, he looks back. “Follow.”"))
    ]};

  N.mech_209b = {chapter: 2, scene: "manufactorum", speaker: VALLEN, time: {h: 2},
    text: L("瓦伦贤者带你走进一间小礼拜室。一位神甫跪在那里，全身没有一块原装零件，只剩一张脸还是肉做的。\n“他用了四十年才走到这里，”贤者说，“他很平静。”\n那张脸在哭，或者只是在漏冷却液。",
            "Magos Vallen leads you into a small chapel. A priest kneels there without one original part, only his face still flesh.\n“It took him forty years to come this far,” says the Magos. “He is at peace.”\nThe face is weeping. Or only leaking coolant."),
    effects: {sanity: -5, set: {askedFlesh: true}},
    choices: [
      C("“我明白了。我申请。”", "“I understand. I petition.”", "mech_300", X({renown: 3},
        "贤者给你开了档案，在“代价”一栏填了个问号。",
        "The Magos opens your file and writes a question mark in the field marked ‘cost’."))
    ]};

  /* ============ Chapter 3 · Initiation ============ */
  N.mech_300 = {chapter: 3, scene: "tech_vault", speaker: VALLEN, time: {d: 14}, bridge: true,
    alt: [ADD(F("indexRecited"), "考官们都听说了那四十分钟。你的考卷比别人少一半。", "The examiners have all heard of those forty minutes. Your papers are half the length of anyone's."),
          ADD(NF("ossiaGone"), "考核第三天，奥西娅被调往外围熔炉的数据回收站。“需要监视，”瓦伦说。", "On day three Ossia is posted to the outer furnaces' data-salvage yard. “She needs watching,” says Vallen."),
          ADD(F("askedFlesh"), "你一直想着礼拜室里那张漏冷却液的脸。", "You keep thinking of the face in the chapel, leaking coolant."),
          ADD(F("woreMonocle"), "奥西娅的单片镜卡在你眼眶里，世界还有点歪。", "Ossia's monocle sits in your eye; the world is still slightly askew.")],
    text: L("十四天的考核期。你住在圣库前厅，白天考二进制，夜里考教义，睡觉时也有一只伺服颅骨在头顶记录。\n第十四天，瓦伦贤者在你的档案上盖了章：“准予入教。明天受第一次改造。”",
            "Fourteen days of probation. You live in the Vault's antechamber: binary by day, doctrine by night, a servo-skull logging you even in your sleep.\nOn day fourteen Magos Vallen stamps your file. “Initiation granted. Tomorrow, your first augmentation.”"),
    choices: [
      C("去受礼", "Go to the rite", "mech_301", X(null,
        "你洗了三遍手。不知道明天以后，它们还算不算你的。",
        "You wash your hands three times. After tomorrow you don't know if they'll still count as yours."))
    ]};

  N.mech_301 = {chapter: 3, scene: "manufactorum", speaker: VALLEN, time: {d: 1},
    alt: [ADD(F("socketDoubt"), "你下意识摸了摸后颈的旧插槽。它从来没合适过。", "Without thinking you touch the old socket at your neck. It never fitted."),
          ADD(F("askedFlesh"), "礼拜室里那张脸又浮上来，你的手心出了汗。", "The face in the chapel comes back to you; your palms sweat.")],
    text: L("接纳仪式。焚香呛得你流泪，十二位神甫用二进制合唱。今天起，你是初学者。\n瓦伦贤者举着三样东西：一只光学眼、一根机械触手、一块空白的铭牌。\n“第一次改造。选一样，或者选择不选。”",
            "The rite of acceptance. Incense makes your eyes stream; twelve priests chant in binary. From today you are an initiate.\nMagos Vallen holds up three things: an optical eye, a mechadendrite, a blank name-plate.\n“Your first augmentation. Choose one. Or choose not to.”"),
    codex: ["mech_omnissiah"],
    choices: [
      C("光学眼", "The optical eye", "mech_302", X({hp: -10, renown: 5, set: {aug: true, eyeAug: true}},
        "旧眼睛被取走时不疼。疼的是新眼睛第一次看见你自己的数据。",
        "Losing the old eye doesn't hurt. What hurts is the new eye's first look at your own data.")),
      C("机械触手", "The mechadendrite", "mech_302", X({hp: -15, renown: 8, set: {aug: true, armAug: true}},
        "触手接上脊椎的那一刻，你多了一只手，也多了一种挠不到的痒。",
        "When it meets your spine you gain a hand, and an itch you can never reach.")),
      C("空白铭牌：暂时不改", "The blank plate: no change, for now", "mech_302b", O(Q({notFlag: "askedFlesh"}, true), X({renown: -5, set: {fleshFirst: true}},
        "合唱停了一拍。瓦伦贤者把铭牌交给你：“血肉是一种拖延。”",
        "The chant skips a beat. Vallen hands you the plate. “Flesh is a form of procrastination.”"))),
      C("空白铭牌：我见过代价", "The blank plate: I've seen the cost", "mech_302b", O(Q({flag: "askedFlesh"}, true), X({sanity: 3, set: {fleshFirst: true}},
        "瓦伦贤者看了你一会儿。“你见过代价。那就不算拖延。”他把铭牌放进你手里。",
        "Vallen regards you a while. “You have seen the cost. Then it is not procrastination.” He puts the plate in your hand.")))
    ]};

  N.mech_302 = {chapter: 3, scene: "manufactorum", speaker: null, time: {d: 3}, gather: L("初学者宿舍", "Novice dormitory"),
    alt: [ADD(F("eyeAug"), "新眼睛闭上也看得见数字，像一盏关不掉的灯。", "The new eye sees numbers even when shut, like a lamp you can't switch off."),
          ADD(F("armAug"), "触手在你睡着时自己动，把被子叠得整整齐齐。", "The tendril moves while you sleep, folding the blanket into perfect squares.")],
    text: L("初学者宿舍里，新的你需要磨合。夜里，你听见身体里有两种声音：心跳，和风扇。\n其他初学者在比较植入体的型号，像比较勋章。\n有人说，火星上的贤者全身没有一块原装零件。",
            "In the novice dormitory the new you needs breaking in. At night you hear two sounds in your body: a heartbeat, and a fan.\nThe other initiates compare implant models like medals.\nSomeone says the Magi of Mars have not one original part left."),
    choices: [
      C("申请一个更好的型号", "Apply for a better model", "mech_303", X({hp: -5, renown: 3, set: {upgraded: true}, taint: {slaanesh: 40}},
        "新型号更安静、更精准。你盯着它看了很久，想象下一个会有多完美。",
        "The new model is quieter, more precise. You stare at it a long time, imagining how perfect the next will be.")),
      C("念点火祷文，安抚新零件", "Recite the Litany of Ignition to settle it", "mech_303", X({sanity: 5, set: {soothed: true}},
        "你念了七遍。风扇和心跳慢慢对上了拍子。",
        "Seven recitations. Slowly the fan and the heartbeat fall into step."))
    ]};

  N.mech_302b = {chapter: 3, scene: "manufactorum", speaker: null, time: {d: 3}, gather: L("初学者宿舍", "Novice dormitory"),
    text: L("初学者宿舍里，其他人在比较植入体的型号，像比较勋章。\n轮到你，没什么可比。上铺有人笑：“原装货。”\n熄灯后，邻铺的光学眼在床头柜上幽幽发亮。",
            "In the novice dormitory the others compare implant models like medals.\nWhen it's your turn there's nothing to compare. Someone in a top bunk laughs: “Factory original.”\nAfter lights-out, the next bunk's optic glows softly on the nightstand."),
    choices: [
      C("“血肉也会计算。”", "“Flesh can calculate too.”", "mech_303", X({renown: -2, sanity: 5, set: {proudFlesh: true}},
        "你把他们出的题一道道心算出来。笑声停了，有人小声说：“怪物。”",
        "You work their test sums in your head, one after another. The laughter stops. Someone whispers: “Freak.”")),
      C("半夜偷偷试戴那只光学眼", "At midnight, secretly try on that optic", "mech_303", X({sanity: -3, set: {triedOptic: true}, taint: {slaanesh: 30}},
        "镜头贴上眼眶的一瞬，世界清楚得发疼。你摘下来，手在抖，想再戴一次。",
        "The instant the lens meets your eye-socket the world is painfully sharp. You take it off, hands shaking, wanting it again."))
    ]};

  N.mech_303 = {chapter: 3, scene: "barracks", speaker: KESH, time: {d: 2}, eventRoll: 0.3,
    alt: [ALT(F("origin_conscript"), "你被派给凯什-43的护教军分队当书记。她看了一眼你后颈的伤疤。\n“排异者，”她说，“我记得所有见过的东西。我记得你。”\n听起来不像是在夸自己。",
              "You're assigned as scribe to Kesh-43's Skitarii maniple. She glances at the scar on your neck.\n“Rejector,” she says. “I remember everything I've seen. I remember you.”\nIt doesn't sound like a boast."),
          ADD({all: [NF("reportedOssia"), NF("origin_conscript")]}, "“圣库搜查那次，”她补了一句，“你的脸我存过档。”", "“The Vault search,” she adds. “I archived your face.”"),
          ADD(F("keshMemory"), "你回头看她的那一眼，她也存了档。", "That last look you gave her: she archived it too.")],
    text: L("你被派给凯什-43的护教军分队当书记。她九成是机器，剩下一成归教条晶片管。\n“我记得所有见过的东西，”她说，“从今天起，也包括你。”\n听起来不像是在夸自己。",
            "You're assigned as scribe to Kesh-43's Skitarii maniple. She's nine-tenths machine; the rest belongs to her doctrina wafers.\n“I remember everything I've seen,” she says. “From today, that includes you.”\nIt doesn't sound like a boast."),
    codex: ["mech_skitarii"],
    choices: [
      C("“你记得自己的名字吗？”", "“Do you remember your name?”", "mech_304", X({sanity: -5, set: {keshTalk: true}},
        "她停了三秒，对护教军来说很久。“名字字段已覆写。保留一个音节：‘凯’。”",
        "She pauses three seconds, an age for a Skitarius. “Name field overwritten. One syllable retained: ‘Ke’.”")),
      C("专心记录分队数据", "Focus on logging the maniple's data", "mech_304", X({renown: 3, set: {keshTrust: true}},
        "报表一个数都没错。凯什把它转发给瓦伦贤者，附言：可用。",
        "Not one wrong digit. Kesh forwards the report to Vallen, annotated: usable.")),
      C("“我认识这种晶片。”", "“I know these wafers.”", "mech_304", O(Q({flag: "origin_conscript"}, true), X({renown: 5, set: {keshTalk: true}},
        "凯什敲了敲自己的插槽。“你比大多数排异者撑得久。”她停了停，“我记得。”",
        "Kesh taps her own socket. “You lasted longer than most rejectors.” A pause. “I remember.”")))
    ]};

  N.mech_304 = {chapter: 3, scene: "ruins", speaker: HOLLON, foe: "kastelan_robot", time: {d: 2},
    text: L("分队移防渣场，试炮。一台卡斯特兰机器人站在那里，高得像钟楼。\n数据铸匠赫隆往它胸口插指令晶片：“它只做晶片说的事。它不许思考。思考是罪。”\n机器人的头微微转向你，像在等你开口。",
            "The maniple moves to the slag fields for a gunnery trial. A Kastelan robot stands there, tall as a bell tower.\nDatasmith Hollon slots protocol wafers into its chest. “It does only what the wafer says. It may not think. Thinking is sin.”\nThe robot's head turns slightly toward you, as if waiting for you to speak."),
    codex: ["mech_kastelan"],
    choices: [
      C("用练熟的二进制校对指令", "Proofread the protocols in your drilled binary", null, O(Q({flag: "binary"}, true), R(0.65, "sanity", "mech_305", "mech_306",
        RR("那些通宵没白熬。指令无误，机器人举拳把靶子砸进地里。赫隆点头。", "The sleepless nights pay off. Protocols correct; the robot drives the target into the ground. Hollon nods.",
           "你还是漏了一个分号。机器人转身，朝错误的方向开了火。", "You still miss a semicolon. The robot turns and fires the wrong way.")))),
      C("替赫隆校对指令", "Proofread Hollon's protocols", null, O(Q({notFlag: "binary"}, true), R(0.5, "sanity", "mech_305", "mech_306",
        RR("指令无误。机器人举拳，把靶子砸进了地里。赫隆点头。", "Protocols correct. The robot raises a fist and drives the target into the ground. Hollon nods.",
           "你漏了一个分号。机器人转身，朝错误的方向开了火。", "You miss a semicolon. The robot turns and fires the wrong way.")))),
      C("对它的机魂念祷文", "Pray to its machine spirit", "mech_305", X({sanity: -3, renown: 3, set: {prayedKastelan: true}},
        "机器人听完，胸口的灯闪了两下。赫隆说这是故障。你不太确定。",
        "The robot listens; its chest light blinks twice. Hollon calls it a fault. You're not so sure.")),
      C("请求替它按下第一发的指令键", "Ask to key its first shot yourself", "mech_305", X({hp: -5, renown: 3, taint: {khorne: 30}},
        "炮声震得你跪在地上。你爬起来的第一个念头是：再来一次。",
        "The report drops you to your knees. Your first thought as you rise: again."))
    ]};

  N.mech_306 = {chapter: 3, scene: "ruins", speaker: HOLLON, foe: "kastelan_robot", time: {h: 1},
    text: L("炮弹落在观礼台边上。弹片飞过时，你听见赫隆在喊一个分号。\n你趴在渣堆里，耳朵嗡嗡作响，在流血。\n机器人停了火，安静地站着，像在为自己做错的事发呆。",
            "The shell lands beside the viewing stand. As shrapnel flies you hear Hollon shouting about a semicolon.\nYou lie in the slag, ears ringing, bleeding.\nThe robot ceases fire and stands quiet, as if puzzling over what it did wrong."),
    effects: {hp: -15, set: {kastelanMisfire: true}},
    choices: [
      C("爬起来，修正指令", "Get up and fix the protocol", "mech_307", X({renown: 3},
        "你改好了分号。机器人重新开火，这次命中。赫隆没说谢谢，只在它的档案里记了一笔：误射一次。",
        "You fix the semicolon. The robot fires again and hits. Hollon doesn't say thanks; he logs in its file: one misfire."))
    ]};

  N.mech_305 = {chapter: 3, scene: "ruins", speaker: KESH, time: {h: 2},
    text: L("试炮结束。凯什的分队列队向机器人致敬。\n“它比我们老，”她说，“它打过我们没打过的仗，可它不知道自己打过。”\n“这算幸运吗？”她问。没人回答。",
            "The trial ends. Kesh's maniple salutes the robot.\n“It is older than us,” she says. “It fought wars we never did, but it doesn't know it fought them.”\n“Is that fortunate?” she asks. Nobody answers."),
    choices: [
      C("“我觉得是。”", "“I think so.”", "mech_307", X({sanity: 3, set: {keshForget: true}},
        "凯什点头。“记录：书记倾向于不记得。”",
        "Kesh nods. “Logged: the scribe prefers not to remember.”")),
      C("“我觉得不是。”", "“I think not.”", "mech_307", X({sanity: -3, set: {keshTalk: true}},
        "凯什沉默片刻，把这句话存了档。“我也这么计算。”",
        "Kesh is silent a moment, then archives the remark. “I calculate the same.”"))
    ]};

  N.mech_307 = {chapter: 3, scene: "tech_vault", speaker: CAWL, time: {d: 20}, gather: L("缮写大厅", "Scriptorium"),
    jump: L("二十天的随队报表后，回到圣库", "Twenty days of field reports later, back in the Vault"),
    alt: [ADD(F("kastelanMisfire"), "你的报表里有一行：误射一次，责任人是你。", "One line of your report reads: one misfire, responsible party yourself.")],
    text: L("圣库的缮写大厅里，几十个书记伏案抄写。一份数据包到了，署名火星大贤者贝利撒留·考尔，索要星区所有STC残片的副本。\n瓦伦读完，触手卷起：“考尔‘重新发现’的东西，多得不像重新发现。”",
            "Back in the Vault's scriptorium, dozens of scribes bend over their copying. A data-packet arrives, signed by Archmagos Belisarius Cawl of Mars: copies of every STC fragment in the sector.\nVallen reads it, tendrils curling. “The things Cawl ‘rediscovers’ are too many to be rediscoveries.”"),
    codex: ["mech_cawl"],
    choices: [
      C("“那不就是发明吗？”", "“Isn't that just inventing?”", "mech_308", X({renown: -2, set: {askedNew: true}},
        "大厅里的笔尖全停了。贤者盯着你：“大贤者发明，叫启示。书记发明，叫异端。”",
        "Every stylus in the hall stops. The Magos stares. “When an Archmagos invents, it is revelation. When a scribe does, heresy.”")),
      C("加急发出副本", "Send the copies, priority", "mech_308", X({renown: 5, set: {sentCawl: true}},
        "三天后回执到了，只有一个字：“谢。”后面跟着十七页新的请求。",
        "Three days later the receipt arrives: one word, “Thanks,” followed by seventeen pages of new requests."))
    ]};

  N.mech_308 = {chapter: 3, scene: "manufactorum", speaker: VALLEN, time: {d: 2}, eventRoll: 0.35,
    text: L("立誓之夜。你跪在熔炉前，念自己写的誓词：肉体会疲倦，机器会坚持；知识属于神，你只是抄写员。\n瓦伦贤者在你额头点了一滴圣油。\n从今天起，你是书记神甫。",
            "The night of oaths. You kneel before the furnace and recite the vow you wrote: flesh tires, the machine endures; knowledge belongs to the god, you are only its scribe.\nMagos Vallen touches sacred oil to your brow.\nFrom today you are a lexmechanic."),
    effects: {set: {initiate: true}},
    choices: [
      C("全心全意地发誓", "Swear with your whole heart", "mech_309", X({renown: 8, sanity: -3, set: {devout: true}},
        "誓词说完，你觉得自己轻了一点。也许是灵魂，也许只是一部分怀疑。",
        "When the vow ends you feel lighter. Perhaps your soul. Perhaps just some doubt.")),
      C("发誓，但在心里留一句保留", "Swear, keeping one silent reservation", "mech_309", X({sanity: 5, set: {doubter: true}},
        "你在心里加了一句：“除非神错了。”圣油顺着眉毛流下来，很凉。",
        "Silently you add: unless the god is wrong. The oil runs down your brow, cold."))
    ]};

  N.mech_309 = {chapter: 3, scene: "tech_vault", speaker: VALLEN, time: {d: 2},
    alt: [ADD(F("askedNew"), "“问题太多的人，”他补了一句，“放远一点比较安全。”", "“Those with too many questions,” he adds, “are safer at a distance.”"),
          ADD(F("doubter"), "他看着你，像听见了你誓词后面那半句。", "He looks at you as if he heard the half-line behind your vow.")],
    text: L("探索舰队路过，缺书记神甫，瓦伦填上了你的名字。“我们出钱考察过忒萨零号，维克崔斯-9没回来。这次去G-7卫星。”\n他顺手划掉异端通缉名单的第一行：塞瑞丁。“旧案，三十年前判的。”",
            "An explorator fleet is passing, short of lexmechanics; Vallen enters your name. “Gravex paid for the Thessa Null dig. Magos Vektrix-9 has not returned. This time, Moonlet G-7.”\nIn passing he strikes the first line from a heretek wanted-list: Syrredin. “An old case. Judged thirty years ago.”"),
    codex: ["mech_explorators", "place_thessa_null"],
    choices: [
      C("“知识和我，哪个优先？”", "“Knowledge or me: which comes first?”", "mech_400", X({sanity: -3, set: {askedPriority: true}},
        "贤者想了想。“知识。但我会为另一个结果预留一个档案位。”",
        "The Magos considers. “Knowledge. But I will reserve a file slot for the other outcome.”")),
      C("领命", "Accept the posting", "mech_400", X({renown: 3},
        "你领到一个新编号、一件不合身的探索者斗篷，和一份遗嘱模板。",
        "You receive a new designation, an ill-fitting explorator's cloak, and a will template."))
    ]};

/* ============ Chapter 4 · Explorator ============ */
  N.mech_400 = {chapter: 4, scene: "ship_interior", speaker: KESH, time: {d: 3}, bridge: true,
    alt: [ADD(F("tobinSong"), "临走前你去第七熔炉跟T-0B1N告别。它哼着歌，手停了半秒。", "Before leaving you went to say goodbye to T-0B1N. It hummed; its hands paused half a second."),
          ADD(F("avoidedTobin"), "你绕开了第七熔炉。那首歌，你不想再听一遍。", "You took the long way round the Seventh Furnace. You didn't want to hear the song again."),
          ADD(F("askedPriority"), "你的档案里多了一个空档案位，标题空着。", "There's a new, empty slot in your file, its title blank.")],
    text: L("出发前夜，轨道码头。凯什的分队被借调给探索舰队做护卫——你是她的书记，所以你也去。\n护教军一个接一个走上舷梯，步伐整齐。\n凯什在舷梯口等你：“登舰时间零四零零。迟到者按逃兵记录。”",
            "The night before departure, at the orbital dock. Kesh's maniple is lent to the fleet as escort, and you're her scribe, so you go too.\nSkitarii file up the ramp in perfect step.\nKesh waits at the top. “Boarding at oh-four-hundred. Latecomers logged as deserters.”"),
    choices: [
      C("走上舷梯", "Walk up the ramp", "mech_401", X(null,
        "舱门在你身后合上。格拉维克斯的红天变成舷窗里的一个小点。",
        "The hatch seals behind you. Gravex's red sky shrinks to a dot in the viewport."))
    ]};

  N.mech_401 = {chapter: 4, scene: "ship_interior", speaker: CALANTIS, time: {d: 30}, gather: L("舰员食堂", "Crew mess"),
    jump: L("亚空间航行三十天", "Thirty days through the warp"),
    alt: [ADD(F("origin_conscript"), "邻桌的护教军认出了你后颈的疤，给你挪了个位子。", "The Skitarii at the next table spot the scar on your neck and make room for you.")],
    text: L("航行第三十天，舰员食堂里挤满护教军和船员。你第一次睡满了八小时。\n长桌那头，探索贤者卡兰提斯有四条腿、两个大脑，一个专门用来好奇。\n“G-7的墓穴比人类还老。我想知道它知道什么。”",
            "Day thirty of the voyage, in the crew mess. Skitarii, crew and servitors crowd the long tables; for once you slept eight hours.\nAt the far end sits Explorator Calantis: four legs, two brains, one reserved for curiosity.\n“The tomb on G-7 may be older than humanity. I want to know what it knows.”"),
    effects: {hp: 15},
    choices: [
      C("“它会愿意被知道吗？”", "“Will it want to be known?”", "mech_402", X({sanity: -3, set: {askedWill: true}},
        "卡兰提斯的两个大脑讨论了一会儿。“无关紧要。”她们一致决定。",
        "Calantis's two brains confer. “Irrelevant,” they agree.")),
      C("帮她整理探测数据", "Help her sort the survey data", "mech_402", X({renown: 3, set: {hotspot: true}},
        "你把三千份扫描按热度排好。最热的那一点，在金字塔正中央。",
        "You sort three thousand scans by heat. The hottest point sits dead centre in the pyramid."))
    ]};

  N.mech_402 = {chapter: 4, scene: "tomb_exterior", speaker: CALANTIS, time: {d: 2}, eventRoll: 0.3,
    text: L("G-7上空无一物，只有一座黑色金字塔，符文发着淡绿的光。\n护教军在四周扎营布防。卡兰提斯的伺服颅骨绕着塔尖飞，像一群好奇的苍蝇。\n“扫描铭文，”她说，“全部。”",
            "G-7 is empty but for a black pyramid, its glyphs glowing faintly green.\nSkitarii make camp and deploy around it. Calantis's servo-skulls circle the apex like curious flies.\n“Scan the inscriptions,” she says. “All of them.”"),
    codex: ["place_tomb_moon", "nec_necrons"],
    choices: [
      C("把铭文导入植入体，跟她进墓", "Load the glyphs, then follow her in", "mech_403", X({renown: 5, sanity: -5, set: {glyphs: true}, taint: {tzeentch: 25}},
        "符文流进你的脑子，冰得发甜。有几行你看懂了，你宁愿没看懂。",
        "The glyphs flow in, cold enough to taste sweet. A few lines you understand. You wish you didn't.")),
      C("跟护教军一起守外围", "Hold the perimeter with the Skitarii", "mech_403b", X({hp: -5, set: {perimeter: true}},
        "沙子冷得像金属屑。卡兰提斯带着一队人进了墓道，你留在外面。",
        "The sand is cold as metal filings. Calantis takes a squad into the tunnels; you stay outside."))
    ]};

  N.mech_403 = {chapter: 4, scene: "tomb_interior", speaker: CALANTIS, time: {h: 8},
    alt: [ADD(F("askedWill"), "你问过它愿不愿意被知道。切口在合拢，像在回答。", "You asked whether it wanted to be known. The cut closing looks like an answer.")],
    text: L("墓道里整整齐齐站着几千具金属骷髅，一动不动。\n卡兰提斯用熔切器切开一具，切口在她眼前慢慢合拢。\n“自我修复！”她的两个大脑同时尖叫，“带回去，全部带回去！”",
            "Thousands of metal skeletons stand in the tomb halls, utterly still.\nCalantis slices one open with a melta-cutter. The cut slowly closes before her eyes.\n“Self-repair!” both her brains shriek. “Take it back, take all of it!”"),
    codex: ["nec_living_metal"],
    choices: [
      C("“它们只是在睡觉。”", "“They're only sleeping.”", "mech_404", X({renown: 3, set: {warnedTomb: true}},
        "卡兰提斯把你的意见归档为：“胆怯，但可能正确。”凯什却悄悄让护教军列了阵。",
        "Calantis files your opinion under ‘cowardly, but possibly correct’. Kesh quietly has the Skitarii form up.")),
      C("帮她拆一具下来", "Help her dismantle one", "mech_404", X({renown: 5, hp: -5, set: {tookMetal: true}},
        "金属在你手里发热，好像不太愿意被拆。",
        "The metal warms in your hands, as if it doesn't much want to be taken apart."))
    ]};

  N.mech_403b = {chapter: 4, scene: "tomb_exterior", speaker: KESH, time: {h: 10},
    text: L("第二天夜里，金字塔上的符文突然一起亮了，像一只睁开的眼睛。\n墓道口涌出逃命的人，后面跟着整齐的脚步声。\n凯什举起卡宾枪：“外围单位，接应！”",
            "On the second night every glyph on the pyramid lights at once, like an eye opening.\nPeople pour from the tunnel mouth, running for their lives; behind them comes the sound of marching feet.\nKesh raises her carbine. “Perimeter units, cover them!”"),
    codex: ["nec_living_metal"],
    choices: [
      C("冲到墓道口拉人", "Run to the tunnel mouth and haul people out", "mech_405", X({hp: -12, renown: 3, set: {savedServitors: true}},
        "你拖出两个护教军、三个机仆。绿光擦过你的头顶，烫掉一缕头发。",
        "You drag out two Skitarii and three servitors. Green light grazes your scalp and burns away a lock of hair.")),
      C("守住运输艇的舱门", "Hold the lander's hatch", "mech_405", X({sanity: -3, renown: 2},
        "你按着舱门开关，数着跑上来的人。数到十七，就再没人上来了。",
        "Your hand on the hatch control, you count them aboard. At seventeen, nobody else comes."))
    ]};

  N.mech_404 = {chapter: 4, scene: "tomb_interior", speaker: KESH, foe: "necron_warrior", time: {h: 2},
    alt: [ADD(F("warnedTomb"), "护教军早已列好阵——就因为你那句“胆怯”的话。", "The Skitarii are already formed up, because of your ‘cowardly’ remark."),
          ADD(F("hotspot"), "你知道数据核心在哪：热图的正中央。", "You know where the data-core is: dead centre of the heat map.")],
    text: L("所有骷髅的眼睛同时亮了。\n它们一齐迈步，像阅兵的队伍。护教军开火，骷髅倒下，又站起来。\n“撤退协议！”凯什喊，“书记神甫，带上数据核心！”",
            "Every skeleton's eyes light at once.\nThey step forward together like a parade. The Skitarii open fire; skeletons fall, and stand again.\n“Withdrawal protocol!” Kesh shouts. “Lexmechanic, take the data-core!”"),
    codex: ["nec_canoptek"],
    choices: [
      C("抱起数据核心就跑", "Grab the data-core and run", null, O({effects: {set: {grabbedCore: true}}}, R(0.5, "hp", "mech_405", "mech_406",
        RR("你冲出墓道，数据核心在怀里烫得像一块炭。", "You burst from the tunnel, the core burning in your arms like a coal.",
           "绿光削过你的后背。你摔倒了，数据核心滚了出去。", "Green light shaves your back. You fall; the core rolls away.")))),
      C("掩护后面的机仆", "Cover the servitors behind you", "mech_405", X({hp: -10, renown: 3, set: {savedServitors: true}},
        "你把三个机仆推进运输车。它们不会感谢你，但它们记得路线。",
        "You shove three servitors into the transport. They can't thank you, but they remember the route.")),
      C("躲进冷却液池", "Hide in the coolant pool", "mech_405", X({hp: -5, sanity: -5, taint: {nurgle: 35}},
        "冷却液是温的，黏的，有点甜。你泡了一小时，爬出来时皮肤上长了一层膜。",
        "The coolant is warm, sticky, slightly sweet. You soak an hour; when you climb out a film has grown on your skin.")),
      C("念出铭文里的休眠码", "Speak the sleep-code from the glyphs", "mech_405", O(Q({flag: "glyphs"}, true), X({sanity: -8, set: {sleepCode: true}},
        "你念出那几行冰冷的符文。最近的一排骷髅停了半拍，够你们跑出墓道。",
        "You speak the cold glyph-lines. The nearest rank of skeletons stalls half a beat: long enough to run.")))
    ]};

  N.mech_406 = {chapter: 4, scene: "tomb_interior", speaker: null, foe: "canoptek_scarab", time: {h: 1},
    alt: [ADD(F("aug"), "它们先拆的是你新装的植入体外壳。", "The first thing they strip is the casing of your new implant."),
          ADD(F("fleshFirst"), "你身上没多少金属。它们很快就失望地散开了。", "There's little metal on you. They soon scatter, disappointed.")],
    text: L("一群金属甲虫爬上你的身体。它们不咬肉，只吃金属。\n皮带扣、工具、植入体的外壳，一样一样被拆走。\n它们拆得很仔细，像在给你做一次免费维修。",
            "A swarm of metal scarabs climbs your body. They don't bite flesh; they eat metal.\nBuckle, tools, the casings of your implants, taken one by one.\nThey work carefully, like a free maintenance service."),
    effects: {hp: -15, set: {coreLost: true}},
    choices: [
      C("爬向出口", "Crawl for the exit", "mech_405", X({sanity: -5},
        "你爬出来时轻了好几斤。数据核心留在了墓里。",
        "You crawl out several pounds lighter. The data-core stays in the tomb."))
    ]};

  N.mech_405 = {chapter: 4, scene: "tomb_exterior", speaker: CALANTIS, time: {h: 1},
    alt: [ADD(F("sleepCode"), "休眠码还在你舌头上发冷。墓道深处安静了一点。", "The sleep-code is still cold on your tongue. The tunnels have gone a little quieter."),
          ADD(F("askedPriority"), "你想起瓦伦预留的那个档案位。", "You remember the file slot Vallen reserved."),
          ADD(F("perimeter"), "卡兰提斯是最后一个跑出来的。", "Calantis is the last one out.")],
    text: L("运输艇的舱门正在关闭。卡兰提斯站在墓道口，没有上船。\n“还有一个墓室，”她说，“只看一眼。”\n她走回了黑暗里。舱门合上了。",
            "The lander's hatch is closing. Calantis stands at the tunnel mouth and doesn't board.\n“One more chamber,” she says. “Just one look.”\nShe walks back into the dark. The hatch seals."),
    choices: [
      C("“贤者！”", "“Magos!”", "mech_407", X({sanity: -5, set: {calledCalantis: true}},
        "她没回头。伺服颅骨跟了进去，像一群忠诚的狗。",
        "She doesn't turn. Her servo-skulls follow her in like loyal dogs.")),
      C("记下她最后的坐标", "Log her last coordinates", "mech_407", X({renown: 3, set: {calantisCoords: true, quest: true}},
        "坐标很精确。你知道它不会再变了。",
        "The coordinates are precise. You know they won't change again."))
    ]};

  N.mech_407 = {chapter: 4, scene: "ship_interior", speaker: null, time: {h: 6},
    alt: [ADD(F("calledCalantis"), "数据最前面夹着一行：“书记，我听见了。”", "At the very start of the data is one line: “Scribe, I heard you.”")],
    text: L("舰船逃离G-7。通讯频道里传来卡兰提斯的最后一段数据，断断续续：\n“补充记录：它们不是机器。它们曾经是——”\n然后是一长串零。",
            "The ship flees G-7. Calantis's last data comes over the channel, broken:\n“Addendum: they are not machines. They were once—”\nThen a long string of zeros."),
    effects: {sanity: -5},
    choices: [
      C("把遗言存进档案", "Archive her last words", "mech_408", X({renown: 5, set: {calantisFile: true, quest: true}},
        "你给文件加了个标签：未完成。所有好问题都该有这个标签。",
        "You tag the file: incomplete. Every good question should carry that tag.")),
      C("删掉损坏的文件", "Delete the corrupted file", "mech_408", X({sanity: 5, renown: -3},
        "文件消失了。那串零还在你脑子里响了很多天。",
        "The file is gone. The zeros ring in your head for days."))
    ]};

  N.mech_408 = {chapter: 4, scene: "ship_interior", speaker: KESH, time: {d: 30, warp: true}, eventRoll: 0.3,
    alt: [ADD(F("tookMetal"), "你亲手拆下来的那块，纹路长得最快。", "The piece you dismantled yourself grows its patterns fastest."),
          ADD(F("savedServitors"), "你救上船的机仆守在货舱门口，一动不动。", "The servitors you got aboard stand motionless at the hold door.")],
    text: L("回程的货舱里，带回来的死灵金属在自我修复，长出了细小的纹路。舰船的机魂不安地闪着灯。\n凯什拿枪对着它。“它在学习我们的船。”\n“扔出去，”她说，“或者你负责。”",
            "In the hold on the voyage home, the necron metal you brought back is repairing itself, growing fine new patterns. The ship's spirit flickers uneasily.\nKesh aims at it. “It's learning our ship.”\n“Jettison it,” she says. “Or it's your responsibility.”"),
    choices: [
      C("扔进虚空", "Jettison it", "mech_409", X({renown: -3, sanity: 5, set: {voidedMetal: true}},
        "金属在舱外翻滚。最后一刻，它朝舰船伸出了一根细丝。",
        "It tumbles outside. At the last moment it reaches a thread toward the ship.")),
      C("封进铅箱带回去", "Seal it in lead and bring it home", "mech_409", X({renown: 8, set: {crystal: true}, taint: {tzeentch: 15}},
        "箱子上贴了七道封条。每天夜里，你都能听见它在里面重新排列自己。",
        "Seven seals on the box. Every night you hear it rearranging itself inside."))
    ]};

  N.mech_409 = {chapter: 4, scene: "ship_interior", speaker: VALLEN, time: {d: 5},
    alt: [ADD(F("crystal"), "铅箱在你脚边，七道封条都还在。", "The lead box sits at your feet, all seven seals intact.")],
    text: L("舰船回到格拉维克斯轨道，舷窗外是浓烟。\n外围熔炉在燃烧，绿色的登陆舱歪歪扭扭地往下落，像用废铁焊的。\n瓦伦贤者的声音挤进数据圈：“兽人。它们在偷东西。偷一切。”",
            "The ship returns to Gravex orbit. Smoke fills the viewport.\nThe outer furnaces burn. Green drop-pods rain down, lopsided, welded from scrap.\nMagos Vallen's voice forces into the noosphere: “Orks. They are stealing things. Everything.”"),
    codex: ["xenos_ork"],
    choices: [
      C("登上运输艇", "Board the lander", "mech_501", X(null,
        "凯什把你按进座位，扣紧安全带。“降落。”",
        "Kesh pushes you into a seat and cinches the harness. “Planetfall.”"))
    ]};

  /* ============ Chapter 5 · The Green Tide ============ */
  N.mech_501 = {chapter: 5, scene: "burning_city", speaker: KESH, foe: "ork", time: {h: 3}, bridge: true,
    alt: [ADD(F("origin_conscript"), "那股味道你认得：渣场里的小东西，只是大了十倍。", "You know that smell: the little things from the slag fields, ten times bigger."),
          ADD({all: [F("grabbedCore"), NF("coreLost")]}, "数据核心还在你怀里。它得先进圣库。", "The data-core is still in your arms. It has to reach the Vault."),
          ADD(F("crystal"), "你把铅箱锁进运输艇的弹药柜，钥匙挂在脖子上。", "You lock the lead box in the lander's ammo locker and hang the key round your neck.")],
    text: L("运输艇在浓烟里落地。兽人从星区边缘飘来，像一场绿色的冰雹。\n它们不占领，不谈判：拆传送带，扛发电机，把香炉戴在头上当帽子。\n凯什跳下艇：“第三熔炉的防线，或者圣库。你去哪？”",
            "The lander touches down in the smoke. The orks drifted in from the sector's edge like green hail.\nThey don't occupy or negotiate: they rip out conveyors, carry off generators, wear priests' censers as hats.\nKesh jumps down. “The Third Furnace line, or the Vault. Lexmechanic, where?”"),
    codex: ["xenos_waaagh"],
    choices: [
      C("去护教军的防线", "Head for the Skitarii line", "mech_502", X({set: {wentLine: true}},
        "你跟着凯什的分队穿过燃烧的街道。",
        "You follow Kesh's maniple through the burning streets.")),
      C("去抢救圣库", "Go save the Vault", "mech_503", X({set: {wentVault: true}},
        "你一个人往圣库跑。身后，凯什的分队转向了第三熔炉。",
        "You run for the Vault alone. Behind you Kesh's maniple turns toward the Third Furnace."))
    ]};

  N.mech_502 = {chapter: 5, scene: "ruins", speaker: KESH, foe: "ork_nob", time: {h: 1},
    alt: [ADD(F("keshTrust"), "“你的报表从没错过，”凯什说，“这次也别错。”", "“Your reports have never been wrong,” Kesh says. “Don't start now.”")],
    text: L("凯什的分队守在第三熔炉前。对面冲来一个兽人头目，比卡斯特兰矮不了多少，挥着链锯斧。\n“书记神甫，”凯什说，“我需要火力校准，或者需要一个人。”\n她等你选。",
            "Kesh's maniple holds before the Third Furnace. An ork boss charges, not much shorter than a Kastelan, swinging a chain-axe.\n“Lexmechanic,” says Kesh, “I need fire calibration. Or I need a body.”\nShe waits for your choice."),
    choices: [
      C("拿起卡宾枪顶上去", "Take a carbine and step in", "mech_504", X({hp: -12, renown: 5, taint: {khorne: 30}},
        "你打空了一个弹匣。头目倒下前咧嘴冲你笑，像在说：好玩。你们一路追进了废铁场。",
        "You empty a magazine. Before the boss falls it grins at you, as if to say: fun. You chase the rest into the scrapyard.")),
      C("接入火炮，计算弹道", "Patch into the artillery, plot the shot", null, R(0.5, "renown", "mech_504", "mech_505",
        RR("第一发就命中。头目连同半堵墙一起不见了。凯什给你发了个二进制的赞。", "First shot hits. The boss vanishes with half a wall. Kesh sends you a binary thumbs-up.",
           "你算错了风速。炮弹落在自己阵地前，气浪把你掀进了兽人堆里。", "You misjudge the wind. The shell lands before your own line; the blast throws you among the orks."))),
      C("不接火控，心算弹道报给炮手", "Skip the fire-control; work the shot in your head", "mech_504", O(Q({flag: "origin_savant"}, true), X({renown: 5, sanity: -3},
        "风速、仰角、装药，你一口气报出来。炮弹落在头目脚下。炮手回头看你，像看一台没装外壳的计算机。",
        "Wind, elevation, charge: you call them in one breath. The shell lands at the boss's feet. The gunner looks back at you like a cogitator without a casing."))),
      C("“老规矩，阿尔法。”", "“The old drill, Alpha.”", "mech_504", O(Q({flag: "origin_conscript"}, true), X({hp: -5, renown: 8},
        "凯什的晶片和你后颈的旧伤同时一热。你们像同一台机器的两只手那样开火。",
        "Kesh's wafer and your old scar warm at once. You fire like two hands of one machine.")))
    ]};

  N.mech_503 = {chapter: 5, scene: "manufactorum", speaker: null, foe: "gretchin", time: {h: 1},
    alt: [ADD(F("sparedGrot"), "领头那只脖子上挂着半个齿轮——是渣场那只。它也认出了你。", "The leader wears half a cog round its neck: the one from the slag fields. It knows you too."),
          ADD(F("shotGrot"), "它们盯着你后颈的疤，往后缩了缩。", "They stare at the scar on your neck and shrink back.")],
    text: L("圣库门口，一个小绿皮抱着神甫的香炉往外跑，后面三个扛着一卷数据线。\n它们看见你，愣住了。\n领头的把香炉举起来，好像在问：换不换？",
            "At the Vault door a little greenskin is running off with a priest's censer; three more follow, lugging a coil of data-cable.\nThey see you and freeze.\nThe leader holds up the censer, as if asking: wanna trade?"),
    choices: [
      C("追上去夺回香炉", "Chase it down and take the censer", "mech_504", X({hp: -10, set: {censer: true}},
        "你抢回了香炉，也挨了一口。剩下的小绿皮拖着数据线钻进废铁场，你追了进去。",
        "You get the censer back, and a bite. The rest drag the cable into the scrapyard; you follow.")),
      C("用一个亮闪闪的齿轮换", "Trade it for a shiny cog", "mech_504", X({renown: 3, set: {grotDeal: true}},
        "成交。小绿皮把香炉还给你，挂上齿轮，招手让你跟它走：“老大的红铁！”",
        "Deal. The greenskin returns the censer, hangs the cog round its neck, and beckons you to follow. “Boss's red iron!”")),
      C("随它们去，悄悄跟着", "Let them go, and follow quietly", "mech_504", X({renown: -3, sanity: 3, set: {cableLost: true}},
        "它们跑了，边跑边唱，一路把数据线拖进了兽人的废铁场。",
        "They run off singing and drag the cable all the way into the ork scrapyard."))
    ]};

  N.mech_505 = {chapter: 5, scene: "ork_scrapyard", speaker: MEK, time: {h: 4},
    text: L("你醒来时被铁链拴在废铁堆旁。一个兽人机械佬在拆你的工具包，边拆边嘟囔。\n他发现你会用扳手，眼睛亮了：“小东西！你修！修好了，有肉吃！”\n他指了指一门歪歪扭扭的大炮。",
            "You wake chained to a scrap pile. An Ork Mek is taking your toolkit apart, muttering.\nHe sees you know how to hold a spanner and his eyes light up. “Little fing! You fix! Fix good, get meat!”\nHe points at a lopsided cannon."),
    choices: [
      C("故意修坏它", "Fix it badly, on purpose", null, R(0.5, "hp", "mech_504", "mech_end_looted",
        RR("大炮第一发就炸了膛。你趁乱挣开锁链，一头钻进废铁场深处。", "The cannon bursts on its first shot. In the chaos you slip your chains and dive deeper into the scrapyard.",
           "机械佬发现了你的小动作，反而大笑：“聪明小东西！留着！”", "The Mek spots your trick and roars with laughter. “Clever little fing! Keepin' you!”"))),
      C("等护教军来救", "Wait for the Skitarii", "mech_504", X({hp: -10, sanity: -5},
        "两天后护教军炸开了废铁场。你趁乱从铁链里挣出来，正撞上废铁场中央的东西。",
        "Two days later the Skitarii blast the scrapyard open. You wriggle free in the chaos and run straight into what stands at its centre.")),
      C("给他好好修", "Fix it properly for him", "mech_end_looted", X({sanity: -5},
        "你修得一丝不苟。大炮第一发就打穿了三堵墙。机械佬抱住你：“好小东西！”",
        "You fix it meticulously. Its first shot punches through three walls. The Mek hugs you. “Good little fing!”"))
    ]};

  N.mech_504 = {chapter: 5, scene: "ork_scrapyard", speaker: MEK, foe: "kastelan_robot", time: {h: 6},
    alt: [ADD(FROM(["mech_502"]), "你随凯什的分队反攻，一路追进了兽人的废铁场。", "You counter-attack with Kesh's maniple, all the way into the ork scrapyard."),
          ADD(FROM(["mech_503"]), "你跟着小绿皮钻过铁丝网，进了兽人的废铁场。", "Following the little greenskins, you slip through the wire into the ork scrapyard."),
          ADD(FROM(["mech_505"]), "锁链还挂在你一只脚踝上。", "A length of chain still hangs from one ankle."),
          ADD(F("grotDeal"), "挂着齿轮的小绿皮躲在你身后，替你指路。", "The cog-wearing little greenskin hides behind you, pointing the way."),
          ADD(F("cableLost"), "它身上缠着那卷数据线，还印着圣库的编号。", "It's wrapped in that coil of cable, still stamped with the Vault's number."),
          ADD(F("kastelanMisfire"), "左肩上还有赫隆的试炮编号——就是误射的那台。", "Hollon's trial number is still on its left shoulder: the one that misfired.")],
    text: L("废铁场中央站着一台卡斯特兰机器人，刷成了红色，头上焊着两只角。\n它在动。没有新晶片，没有祷文，它在动。\n“红的跑得快，”兽人机械佬骄傲地拍着它，“它信，所以它跑！”",
            "In the middle of the scrapyard stands a Kastelan robot, painted red, two horns welded to its head.\nIt's moving. No new wafers, no litanies. It's moving.\n“Red ones go fasta,” the Ork Mek says proudly, slapping it. “It believes, so it goes!”"),
    codex: ["ork_belief_tech"],
    choices: [
      C("侵入它的指令核心", "Hack its command core", null, R(0.5, "renown", "mech_506", "mech_507",
        RR("旧晶片还卡在插槽深处，兽人没拆，只是没用上。你改了一个字。机器人转身，把机械佬拍进了废铁堆。", "The old wafer is still jammed deep in its slot; the orks never pulled it, just never used it. You change one word. The robot turns and swats the Mek into the scrap.",
           "核心里全是兽人的涂鸦和一个很丑的笑脸。机器人一脚把你踢飞。", "The core is all ork graffiti and an ugly smiley face. The robot kicks you flying."))),
      C("引爆它的能源舱", "Detonate its power cell", "mech_506", X({hp: -10, renown: 3, set: {blewKastelan: true}},
        "爆炸把机器人和半个废铁场送上了天。可惜。它是一台好机器。",
        "The blast sends the robot and half the scrapyard skyward. A pity. It was a good machine.")),
      C("看机械佬怎么让它动起来", "Watch how the Mek makes it move", "mech_506", X({sanity: -10, renown: -3, set: {mekWatch: true}},
        "你看了很久，还是不懂。兽人什么原理都没用，只用了信心。这比任何异端都可怕。",
        "You watch a long time and still don't understand. The ork uses no principle at all, only conviction. Worse than any heresy."))
    ]};

  N.mech_507 = {chapter: 5, scene: "ork_scrapyard", speaker: null, foe: "kastelan_robot", time: {h: 1},
    text: L("你躺在废铁堆里，肋骨断了几根。红色的机器人朝你走来，每一步都踩碎一块金属。\n它胸口的灯在闪。\n闪了两下，和试炮那天一样。",
            "You lie in the scrap with several ribs broken. The red robot walks toward you, each step crushing metal.\nIts chest light is blinking.\nTwice, just like the day of the gunnery trial."),
    effects: {hp: -15},
    choices: [
      C("念试炮那天念过的祷文", "Recite the prayer from the trial", "mech_506", O(Q({flag: "prayedKastelan"}, true), X({sanity: 5, renown: 5, set: {kastelanWoke: true}},
        "机器人停住了。它站了很久，然后转身走向兽人，像想起了自己是谁。",
        "The robot stops. It stands a long while, then turns toward the orks, as if remembering who it is."))),
      C("爬开", "Crawl away", "mech_506", X({hp: -5},
        "你爬了很久。它没有追。也许它根本没在看你。",
        "You crawl a long way. It doesn't follow. Perhaps it was never looking at you."))
    ]};

  N.mech_506 = {chapter: 5, scene: "forge_floor", speaker: KESH, time: {d: 2},
    grudgeLine: {npc: "gries", text: L("格里斯监工提着账本站在尸堆旁：清点死人归他管。", "Overseer Gries stands among the dead with his ledger; counting the dead is his job.")},
    alt: [ADD(F("wentVault"), "你赶回圣库时，放残片的架子已经空了。", "By the time you reached the Vault, the fragment's shelf was empty."),
          ADD(F("wentLine"), "凯什说，你在防线上替她挡了一次。她记下了。", "Kesh says you covered her once on the line. She has logged it."),
          ADD(F("sentCawl"), "好在残片的副本，早已发往火星。", "At least a copy of the fragment went to Mars long ago."),
          ADD(F("kastelanWoke"), "红色的卡斯特兰跟着分队回来了，没人敢给它插晶片。", "The red Kastelan followed the maniple home. Nobody dares wafer it.")],
    text: L("兽人被打退了，带走了三座发电站、半个铸造厂。圣库里那块STC残片也不见了。\n凯什丢了一条腿，拄着一根管子站岗。\n“损失已记录，”她说，“悲伤未记录。没有那个字段。”",
            "The orks are driven off with three power plants and half a foundry. The STC fragment is gone from the Vault too.\nKesh has lost a leg. She stands guard propped on a pipe.\n“Losses logged,” she says. “Grief not logged. There is no field for it.”"),
    effects: {hp: 10},
    choices: [
      C("帮凯什修腿", "Repair Kesh's leg", "mech_508", X({renown: 5, hp: -5, set: {keshRepair: true}},
        "你用冲压机的连杆给她做了条新腿。不太合规，但她站得很稳。",
        "You make her a new leg from a press linkage. Not quite canonical, but she stands firm.")),
      C("去点算死去的杂役", "Go and count the dead menials", "mech_508", O({grudge: {npc: "gries", effects: {sanity: -6},
          note: L("格里斯拿着账本在场：他逼你把每个编号念两遍，错一个重来。", "Gries is there with his ledger: he makes you recite every number twice, and restart on any slip.")}},
        X({sanity: -5, renown: 3, set: {countedDead: true}},
        "三百四十一个。你把每个编号都念了一遍，一个不落。",
        "Three hundred and forty-one. You read every number aloud, not one skipped."))),
      C("去熔炉边找T-0B1N", "Look for T-0B1N by the furnace", "mech_508", O(Q({flag: "tobinSong"}, true), X({sanity: 8, set: {foundTobin: true}},
        "它还在搬钢锭，浑身是灰，喉咙里还在哼那四个音。你从没觉得一首歌这么好听。",
        "It's still hauling ingots, covered in ash, still humming the four notes. No song ever sounded better.")))
    ]};

  N.mech_508 = {chapter: 5, scene: "manufactorum", speaker: null, time: {d: 2}, gather: L("杂役食堂", "Menial refectory"),
    text: L("兽人退后第三天，杂役食堂里挤满了人，大家捧着糊糊议论冷却管道里一夜长出的蘑菇，红的绿的。\n“兽人的孢子，烧不干净，明年还会长出小绿皮。”\n管道里的蘑菇微微发热，摸上去像一只温顺的动物。",
            "Three days after the orks left, the menial refectory is packed. Over bowls of gruel everyone talks about the fungus that sprouted overnight in the coolant pipes, red and green.\n“Ork spores. Can't burn 'em all. Next year, little greenskins.”\nThe fungus is faintly warm, like a docile animal."),
    choices: [
      C("全部烧掉", "Burn it all", "mech_509", X({hp: -5, renown: 3, set: {burnedSpores: true}},
        "火焰喷射器烧了一整天。烟是甜的，你咳了一整夜。",
        "The flamer burns all day. The smoke is sweet; you cough all night.")),
      C("留一片，研究研究", "Keep one patch to study", "mech_509", X({sanity: 5, set: {sporePet: true}, taint: {nurgle: 35}},
        "你给它浇了点机油，它长得很好。你开始期待每天早上去看它。",
        "You give it a little machine oil. It thrives. You start looking forward to visiting it each morning."))
    ]};

  N.mech_509 = {chapter: 5, scene: "tech_vault", speaker: VALLEN, time: {d: 2},
    alt: [ADD(F("crystal"), "你的铅箱也被翻过：一道封条撕开了，金属还在。", "Your lead box was searched too: one seal torn, the metal still inside."),
          ADD(F("voidedMetal"), "“幸好你扔了那块金属，”他说，“他也会想要它。”", "“Good that you jettisoned that metal,” he says. “He would want it too.”"),
          ADD({all: [F("grabbedCore"), NF("coreLost")]}, "你带回的数据核心被拷过一遍，G-7的坐标不见了。", "The data-core you brought home has been copied; G-7's coordinates are gone.")],
    text: L("瓦伦贤者在圣库最底层等你。兽人来的那夜，有人试过这道封印，没打开，锁上留下一行废码，像霉斑一样扩散。\n“这个签名我认得，”他说，“三十年前我们判过他：塞瑞丁。残片是他拿的。”",
            "Magos Vallen waits on the Vault's lowest level. On the night of the raid someone tried the seal and failed, leaving a line of scrapcode spreading like mildew.\n“I know this signature,” says the Magos. “We judged him thirty years ago: Syrredin. He took the fragment, not the orks.”"),
    codex: ["mech_scrapcode"],
    choices: [
      C("追踪废码的来源", "Trace the scrapcode to its source", "mech_600", X({sanity: -5, renown: 3, set: {tracedCode: true}},
        "废码一路通向外围熔炉，忏悔劳役的地方。",
        "The scrapcode trails all the way to the outer furnaces, where the penitents labour.")),
      C("请贤者封锁圣库", "Ask the Magos to seal the Vault", "mech_601", X({renown: 5, set: {sealedVault: true}},
        "封锁令下达三分钟后，门外响起了敲门声。",
        "Three minutes after the seal order, someone knocks outside."))
    ]};

/* ============ Chapter 6 · The Schism ============ */
  N.mech_600 = {chapter: 6, scene: "forge_floor", speaker: null, time: {h: 6}, bridge: true,
    alt: [ADD(F("wronged_ossia"), "铲渣的犯人说：“她每天夜里念一个名字。”是你的。", "A penitent shovelling slag says: “Every night she says one name.” Yours."),
          ADD(F("tookBlame"), "台面一角刻着一行小字：鞭子十二下，记账。", "In one corner of the bench, small letters: twelve lashes, noted.")],
    text: L("废码一路通向外围熔炉，忏悔劳役的地方。犯了错的神甫们戴着脚镣在炉前铲渣，没人抬头看你。\n奥西娅的工位空着，台面上刻满公式，最后一行指向圣库。\n她比你先回去了。",
            "The scrapcode leads to the outer furnaces, where disgraced priests shovel slag in leg-irons. None of them looks up.\nOssia's bench is empty, its top carved with equations; the last line points back to the Vault.\nShe got there before you."),
    choices: [
      C("赶回圣库", "Hurry back to the Vault", "mech_601", X(null,
        "你一路跑回去。圣库最底层的灯亮着，有人在等你。",
        "You run all the way back. The light is on in the Vault's lowest level. Someone is waiting."))
    ]};

  N.mech_601 = {chapter: 6, scene: "tech_vault", speaker: OSSIA, time: {h: 1},
    alt: [ADD(F("sealedVault"), "门外是她从前敲抽屉的节奏：两轻，一重。", "The knock outside is the rhythm she used to tap on her drawer: two soft, one hard."),
          ADD(F("tracedCode"), "她坐在最底层的台阶上，像早就知道你会追来。", "She sits on the bottom step as if she knew you'd follow."),
          ADD(F("woreMonocle"), "她看见你眼眶里的单片镜，笑容僵了一下。", "She sees the monocle in your eye, and her smile stiffens.")],
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
      C("把单片镜还给她", "Give her back the monocle", "mech_602", O(Q({flag: "keptMonocle"}, true), X({sanity: 5, set: {forgiven_ossia: true, ossiaOwes: true}},
        "她接过单片镜，在袖子上擦了擦，没戴。“你没戴过它，”她说，“我看得出来。”",
        "She takes the monocle, wipes it on her sleeve, doesn't put it on. “You never wore it,” she says. “I can tell.”"))),
      C("呼叫凯什", "Call Kesh", "mech_603", X({renown: 5},
        "你向数据圈发出信号。奥西娅听见了，没有逃，只是叹了口气。",
        "You signal into the noosphere. Ossia hears it. She doesn't run. She only sighs."))
    ]};

  N.mech_602 = {chapter: 6, scene: "tech_vault", speaker: OSSIA, time: {h: 1},
    alt: [ADD(F("tookBlame"), "“鞭子那次我欠你，”她说，“所以钥匙给你，用不用随你。”", "“I owe you for the lashes,” she says. “So the key is yours. Use it or don't.”"),
          ADD(F("forgiven_ossia"), "“单片镜的事，算你还清了，”她说，“钥匙用不用随你。”", "“The monocle squares us,” she says. “Use the key or don't.”")],
    text: L("“火星分裂从来没结束，”奥西娅说，“一半的神甫选择了不再害怕知识。”\n“兽人是塞瑞丁用信标请来的攻城锤。他就要到了。你不敢问的，他都会回答。”\n她把一枚数据钥匙放在你手心。",
            "“The Schism of Mars never ended,” says Ossia. “Half the priesthood chose to stop fearing knowledge.”\n“The orks were Syrredin's battering ram; he called them with a beacon. He's almost here. What you dare not ask, he answers.”\nShe presses a data-key into your palm."),
    codex: ["chr_schism_of_mars"],
    choices: [
      C("握紧钥匙", "Close your hand on the key", "mech_604", X({corruption: 10, set: {ossiaKey: true}, taint: {tzeentch: 20}},
        "钥匙在掌心发热，像一颗小小的心脏。你没告诉任何人。",
        "The key warms in your palm like a tiny heart. You tell no one.")),
      C("把钥匙扔进焚档炉", "Throw the key into the archive incinerator", "mech_604", X({sanity: -5, renown: 5, set: {burnedKey: true}},
        "奥西娅看着它熔化，没阻止。“它会再长出来的，”她说，“知识都这样。”",
        "Ossia watches it melt and doesn't stop you. “It'll grow back,” she says. “Knowledge always does.”")),
      C("问她：他从哪里进来？", "Ask her: where will he come in?", "mech_604", O(Q({flag: "ossiaOwes"}, true), X({sanity: -3, set: {knowLanding: true}},
        "她犹豫了很久。“冷却管道。反应堆的冷却管道。”说完她就走了，钥匙留在桌上。",
        "She hesitates a long time. “The coolant ducts. The reactor's coolant ducts.” Then she leaves, the key on the desk."))),
      C("用卡兰提斯的遗言换一句实话", "Trade Calantis's last words for the truth", "mech_604", O(Q({flag: "calantisFile"}, true), X({sanity: -5, set: {knowLanding: true}, taint: {tzeentch: 10}},
        "她读完那串零，眼睛亮得吓人。“冷却管道，”她说，“他从反应堆的冷却管道进来。”",
        "She reads the string of zeros, eyes frighteningly bright. “The coolant ducts,” she says. “He comes in through the reactor's coolant ducts.”")))
    ]};

  N.mech_603 = {chapter: 6, scene: "barracks", speaker: KESH, time: {h: 2},
    text: L("凯什逮捕了奥西娅。奥西娅没反抗，被押走时一直在笑。\n“太晚了，”她说，“熔炉的机魂已经替他开了门。它也想知道答案。”\n凯什把这句话存档，标记为：威胁等级未知。",
            "Kesh arrests Ossia. Ossia doesn't resist and laughs all the way out.\n“Too late,” she says. “The forge's spirit has already opened the door for him. It wants the answers too.”\nKesh archives the remark, flagged: threat level unknown."),
    effects: {sanity: -5, set: {ossiaArrested: true}},
    choices: [
      C("去找瓦伦贤者", "Go to Magos Vallen", "mech_604", X(null,
        "你把奥西娅的话原样转给瓦伦。他的触手卷了一下，又松开。",
        "You pass Ossia's words to Vallen verbatim. His tendrils curl, then loosen."))
    ]};

  N.mech_604 = {chapter: 6, scene: "manufactorum", speaker: VALLEN, time: {d: 2},
    alt: [ADD(F("fleshFirst"), "“你的铭牌还空着，”他说，“该填了。”", "“Your name-plate is still blank,” he says. “Time to fill it.”"),
          ADD(F("proudFlesh"), "“听说你在宿舍里用血肉算赢过他们。”", "“I hear you out-calculated the dormitory with flesh alone.”"),
          ADD(F("knowLanding"), "你把冷却管道的事告诉了他。他记下了，没问来源。", "You tell him about the coolant ducts. He logs it and doesn't ask the source.")],
    text: L("瓦伦贤者把你叫到手术台前。不是转化线那张，是神甫们自己用的那张。\n“塞瑞丁要来了。恐惧会让你犯错，血肉会让你流血。”\n“你可以决定，”他说，“留下多少个自己。”",
            "Magos Vallen calls you to the surgery table. Not the one on the conversion line: the one the priests use themselves.\n“Syrredin is coming. Fear will make you err; flesh will make you bleed.”\n“You may decide,” he says, “how much of yourself to keep.”"),
    codex: ["mech_rite_pure_thought"],
    choices: [
      C("“留下心和手。”", "“Keep my heart and hands.”", "mech_605", X({renown: -5, sanity: 10, set: {fleshKept: true}},
        "贤者没反对，只在你的档案里把一个数值标成“低效”。你的手还是你的手。",
        "The Magos doesn't object; he just marks one value in your file ‘inefficient’. Your hands are still your hands.")),
      C("“换掉软弱的部分。”", "“Replace what's weak.”", "mech_605", O(X({hp: 15, sanity: -10, renown: 10, set: {augHalf: true}, taint: {slaanesh: 35}},
        "醒来时你胸腔里多了一台泵，比心脏更稳。你照了镜子，一遍，又一遍。",
        "You wake with a pump in your chest, steadier than a heart. You look in the mirror. Again. Again."),
        {resultAlt: [RA(F("upgraded"), "你早就申请过更好的型号。这一次，你把心也列进了清单。", "You've applied for better models before. This time you put your heart on the list."),
                     RA(F("triedOptic"), "你想起宿舍里那只光学眼。这次你不用偷了。", "You remember the optic in the dormitory. This time you needn't steal.")]})),
      C("“纯思仪式。全部。”", "“The Rite of Pure Thought. All of it.”", "mech_606", X({sanity: -5},
        "贤者的触手第一次完全静止。“你确定？”这是他第一次用问句。",
        "For the first time his tendrils go perfectly still. “Are you certain?” His first question ever."))
    ]};

  N.mech_606 = {chapter: 6, scene: "manufactorum", speaker: VALLEN, time: {h: 1},
    text: L("纯思仪式。手术锯悬在你头顶，比转化线上那把精致得多。\n“恐惧、悔恨、爱，”瓦伦贤者说，“切除之后，你将看清一切。”\n“但你不会再在乎看清了什么。”",
            "The Rite of Pure Thought. The saw hangs above you, far finer than the one on the conversion line.\n“Fear, regret, love,” says Magos Vallen. “Once excised, you will see everything clearly.”\n“But you will no longer care what you see.”"),
    choices: [
      C("“继续。”", "“Proceed.”", "mech_end_pure", O(Q({stat: "renown", min: 45}), X(null,
        "锯子转起来时，你想起那首四个音的歌。然后，想不起为什么要想起它。",
        "As the saw spins, you remember the four-note song. Then you can't remember why you remembered it."))),
      C("“我发过誓。继续。”", "“I swore an oath. Proceed.”", "mech_end_pure", O(Q([{flag: "devout"}, {stat: "renown", min: 40}, {stat: "renown", max: 44}], true), X(null,
        "你念着立誓之夜的誓词。锯子转起来，誓词念到一半，你忘了下一句。",
        "You recite your oath from the night of vows. The saw spins up; halfway through, you forget the next line."))),
      C("“你自己做过吗？”", "“Have you done it yourself?”", "mech_605", X({sanity: 5, set: {fleshKept: true}},
        "贤者沉默了很久。“做过一半。所以我还会犹豫，所以我知道你还没准备好。”他关掉了锯子。",
        "The Magos is silent a long time. “Half of it. That is why I still hesitate, and why I know you are not ready.” He switches off the saw.")),
      C("“停下！我要留着它们。”", "“Stop! I'm keeping them.”", "mech_605", X({sanity: -5, renown: -5, set: {fleshKept: true}},
        "贤者关掉了锯子。“记录：候选者选择了痛苦。有意思。”",
        "The Magos switches off the saw. “Logged: candidate chose pain. Interesting.”"))
    ]};

  N.mech_605 = {chapter: 6, scene: "forge_floor", speaker: null, time: {d: 2}, gather: L("熔炉配给站", "Forge commissary"),
    alt: [ADD(F("augHalf"), "胸腔里的泵稳稳地跳，比队里每个人的心跳都稳。", "The pump in your chest beats steadily, steadier than any heart in the line."),
          ADD(F("fleshKept"), "你的手还是你的手，端着口粮碗，有点抖。", "Your hands are still yours, holding the ration bowl, a little unsteady."),
          ADD(F("burnedSpores"), "有个杂役小声说：“烧蘑菇的那个。”", "A menial whispers: “That's the one who burned the fungus.”")],
    text: L("三天后，你去熔炉配给站领口粮。护教军向你点头，杂役给你让路，就像当年你给神甫让路。\n排队的人在议论轨道上的异象。灯一闪一闪，像在用二进制说话。\n你听懂了。它在说：害怕。",
            "Three days later you collect rations at the forge commissary. Skitarii nod to you; menials step aside, as you once did for priests.\nThe queue murmurs about lights seen in orbit. The lamps flicker as if speaking binary.\nYou understand. They're saying: afraid."),
    choices: [
      C("去冥想室为熔炉祈祷", "Go to the meditation cell to pray for the forge", "mech_607", X(null,
        "你把没吃完的口粮塞给身后的杂役，走进冥想室。",
        "You hand your unfinished ration to the menial behind you and go into the meditation cell."))
    ]};

  N.mech_607 = {chapter: 6, scene: "mars_vista", speaker: OMNI, time: {h: 6}, eventRoll: 0.3,
    alt: [ADD(F("askedSpirit"), "很久以前你问过机魂是不是真的。光环里有一行字：权限已足够。", "Long ago you asked if machine spirits are real. In the halo is one line: clearance sufficient."),
          ADD(F("motiveTouched"), "电祭司在你胸口留下的那道疤，在发热。", "The scar the electro-priest left on your chest is growing warm.")],
    text: L("你在维护冥想中看见一道金光，像一个巨大的齿轮光环，缓缓转动。\n是万机之神吗？还是你的植入体过热了？\n光环里有一个声音，说着你听不懂、却觉得应该懂的二进制。",
            "In maintenance meditation you see a golden light, like a vast gear-halo, slowly turning.\nIs it the Omnissiah? Or are your implants overheating?\nWithin the halo a voice speaks binary you can't understand, but feel you ought to."),
    codex: ["mech_omnissiah"],
    choices: [
      C("祈祷，不提问", "Pray, and ask nothing", "mech_608", X({sanity: 5, renown: 5, set: {quietFaith: true}, taint: {all: -15}},
        "你只是念着点火祷文。光环慢慢暗下去，留下一种干净的安静。",
        "You only recite the Litany of Ignition. The halo slowly dims, leaving a clean kind of quiet.")),
      C("问它：帝皇就是你吗？", "Ask it: are you the Emperor?", "mech_608", X({sanity: -10, set: {askedOmni: true}, taint: {tzeentch: 20}},
        "光环停了一下，然后变了颜色：从金色，变成一种你叫不出名字的蓝。",
        "The halo pauses, then changes colour: from gold to a blue you have no name for.")),
      C("问它：如果你错了呢？", "Ask it: what if you are wrong?", "mech_608", O(Q({flag: "doubter"}, true), X({sanity: -5, set: {askedOmni: true}, taint: {tzeentch: 10}},
        "光环没有回答。它只是转得慢了一点，像在认真计算。",
        "The halo doesn't answer. It only turns a little slower, as if calculating in earnest.")))
    ]};

  N.mech_608 = {chapter: 6, scene: "forge_floor", speaker: RUMM, time: {h: 4},
    text: L("废码在熔炉间蔓延。传送带倒着转，机仆停下来对着墙发呆。\n鲁姆抱着反应堆的控制台哭：“它害怕！它说它听见了别的声音！”\n格拉维克斯的心脏，一座等离子反应堆，在颤抖。",
            "Scrapcode spreads among the furnaces. Conveyors run backward; servitors stop and stare at walls.\nRumm clings to the reactor console, weeping. “It's afraid! It says it hears other voices!”\nGravex's heart, a plasma reactor, is trembling."),
    choices: [
      C("对反应堆唱祷文", "Sing a litany to the reactor", "mech_609", O(X({sanity: -5, taint: {all: -10}, set: {calmedReactor: true, keeper: true}},
        "你唱到嗓子出血。反应堆的颤抖慢慢平了，像一只被抚摸的巨兽。",
        "You sing until your throat bleeds. The trembling slowly stills, like a great beast being stroked."),
        {resultAlt: [RA(F("censer"), "你点起从小绿皮手里抢回的香炉，唱到嗓子出血。反应堆慢慢平静下来。", "You light the censer you wrested from the greenskins and sing till your throat bleeds. The reactor slowly calms."),
                     RA(F("soothed"), "你给自己的零件唱过，这次给一座反应堆。它的颤抖慢慢平了。", "You once sang to your own parts; now to a reactor. Slowly its trembling stills.")]})),
      C("切断它的数据接口", "Cut its data ports", "mech_609", X({hp: -10, renown: 3, set: {cutReactor: true}},
        "拔接口时电弧烧了你的手。反应堆安静了，安静得像在生闷气。",
        "The arc burns your hand as you pull the port. The reactor goes quiet. Sulkily quiet."))
    ]};

  N.mech_609 = {chapter: 6, scene: "manufactorum", speaker: SYRREDIN, time: {d: 2}, gather: L("杂役食堂", "Menial refectory"),
    text: L("杂役食堂正在分晚饭。灯全灭了，所有机器同时开口，几百个杂役捧碗僵住：\n“格拉维克斯，我是塞瑞丁。你们的神是一台坏掉的计算机。我的神会回答。”\n窗外，一艘黄铜与血肉焊成的舰船挂在轨道上。",
            "Supper is being served in the menial refectory. The lights die; every machine speaks at once, and hundreds of menials freeze over their bowls:\n“Gravex. I am Syrredin. Your god is a broken calculator. Mine answers.”\nOutside, a ship welded from brass and flesh hangs in orbit."),
    codex: ["mech_warsmith"],
    choices: [
      C("拿起武器", "Take up arms", "mech_700", X({renown: 3, set: {armed: true}},
        "你领到一支电弧步枪和两个备用能源匣。它的机魂很紧张，你也是。",
        "You draw a galvanic rifle and two spare power cells. Its spirit is nervous. So are you.")),
      C("捂住耳朵", "Cover your ears", "mech_700", X({sanity: -8, set: {heardVoice: true}},
        "声音直接从植入体里钻进来。捂耳朵没有用，它一直在你脑子里说话。",
        "The voice comes straight through your implants. Covering your ears does nothing; it keeps talking inside your head."))
    ]};

  /* ============ Chapter 7 · Iron and Daemons ============ */
  N.mech_700 = {chapter: 7, scene: "barracks", speaker: KESH, time: {h: 6}, bridge: true,
    alt: [ADD(F("motiveLater"), "一位电祭司朝你抬了抬手：“下次”到了。", "An electro-priest raises a hand to you: ‘next time’ has come."),
          ADD(F("knowLanding"), "你报上了冷却管道，凯什在图上多画了一个红圈。", "You report the coolant ducts; Kesh adds a red circle to the map."),
          ADD(F("heardVoice"), "塞瑞丁的声音还在你植入体里嗡嗡响。", "Syrredin's voice still hums in your implants.")],
    text: L("离登陆还有六小时，护教军集结点。凯什单腿撑着桌沿，在全息图上点了三处：防线、冷却隧道、圣库。\n电祭司们在角落里互相通电，像在热身。\n“三个口子，”凯什说，“书记神甫，你守一个。”",
            "Six hours to landfall, at the Skitarii muster. Braced one-legged on the table edge, Kesh marks three points on the hololith: the line, the coolant tunnels, the Vault.\nIn a corner the electro-priests shock one another, warming up.\n“Three gaps,” says Kesh. “Lexmechanic, you hold one.”"),
    choices: [
      C("检查武器，等", "Check your gear, and wait", "mech_701", X(null,
        "六个小时像六分钟。轨道上的黄铜舰船开始往下投东西。",
        "Six hours pass like six minutes. The brass ship in orbit begins dropping things."))
    ]};

  N.mech_701 = {chapter: 7, scene: "burning_city", speaker: KESH, foe: "dark_mechanicus", time: {h: 6},
    text: L("黑暗马戈斯的部队降落了：浑身管线的异端神甫、废码驱动的机仆，和叫不出名字的东西。\n凯什的分队在燃烧的街道上列阵。冷却隧道口挤满了等人带路的杂役。\n“选吧，”凯什说，“去死，或者去活。”",
            "The Dark Magos's forces land: heretek priests bristling with cables, scrapcode-driven servitors, things you cannot name.\nIn the burning streets Kesh's maniple forms a line. At the coolant tunnels, menials crowd, waiting for someone to lead.\n“Choose,” says Kesh. “A place to die, or to live.”"),
    choices: [
      C("留在防线上", "Hold the line", "mech_702", X({hp: -18, renown: 5, taint: {khorne: 30}},
        "开火，装弹，开火。你不再数打倒了多少。数字开始让你觉得无聊。",
        "Fire, reload, fire. You stop counting how many you've dropped. The numbers start to bore you.")),
      C("带杂役们撤进地下", "Lead the menials underground", "mech_701b", X({hp: -5, sanity: 5, set: {savedMenials: true}},
        "你领着杂役们钻进冷却隧道。他们没有名字，只有编号，可他们都活着。",
        "You lead the menials into the coolant tunnels. They have only numbers, no names. But they're alive.")),
      C("去圣库", "Go to the Vault", "mech_703", X(null,
        "你逆着人流往圣库跑。废码在墙上追着你写字。",
        "You run against the crowd toward the Vault. Scrapcode chases you along the walls, writing."))
    ]};

  N.mech_701b = {chapter: 7, scene: "manufactorum", speaker: null, time: {h: 1}, gather: L("冷却隧道", "Coolant tunnels"),
    text: L("冷却隧道里挤着三百个杂役。孩子在哭，老杂役在分最后一点口粮，有人在传火星分裂的布道。\n不知是谁，开始哼一首四个音的歌。\n隧道出口就在第七熔炉底下——反应堆的入口也在那里。",
            "Three hundred menials crowd the coolant tunnels. Children cry; old menials share the last rations; someone passes on a sermon about the Schism of Mars.\nSomebody starts humming a four-note song.\nThe tunnel exit lies under the Seventh Furnace. So does the way to the reactor."),
    choices: [
      C("教他们把那首歌唱对", "Teach them to sing it right", "mech_704", O(Q({flag: "tobinSong"}, true), X({sanity: 5, set: {menialSong: true}},
        "你唱一句，他们跟一句。三百个人，四个音，跑调跑得很认真。你独自往出口走。",
        "You sing a line; they sing it back. Three hundred people, four notes, earnestly off-key. You head for the exit alone."))),
      C("把出口指给他们，自己往上走", "Show them the exit, and go up alone", "mech_704", X({renown: 3},
        "你让最老的杂役守着隧道口，自己顺着梯子爬向第七熔炉。",
        "You leave the oldest menial guarding the tunnel mouth and climb the ladder toward the Seventh Furnace."))
    ]};

  N.mech_702 = {chapter: 7, scene: "ruins", speaker: null, foe: "daemon_engine", time: {h: 2},
    text: L("它从烟里走出来：黄铜的腿，钢铁的爪，炮管里有东西在呼吸。\n装甲上刻满了符文，那些符文在动，在笑。\n凯什开火了。炮弹打在它身上，像打在一块活着的肉上。",
            "It strides out of the smoke: brass legs, steel claws, something breathing inside the gun barrels.\nIts armour is carved with runes that move. That laugh.\nKesh fires. The shells strike it like striking living meat."),
    effects: {sanity: -12, hp: -10},
    codex: ["mech_daemon_engine"],
    choices: [
      C("跟凯什一起后撤", "Fall back with Kesh", "mech_704", X({hp: -10, set: {withKesh: true}},
        "它的爪子擦过你的肩膀。被碰过的地方，金属在生锈，皮肤在发烫。凯什拖着你往第七熔炉退。",
        "Its claw grazes your shoulder; where it touched, metal rusts and skin burns. Kesh drags you back toward the Seventh Furnace.")),
      C("盯着那些符文看", "Stare at the runes", "mech_704", O(X({sanity: -10, set: {runeName: true}, taint: {tzeentch: 20}},
        "符文在你眼里重新排列，拼出了一个名字。不是你的。是它的。",
        "The runes rearrange in your eyes and spell a name. Not yours. Its own."),
        {resultAlt: [RA(F("eyeAug"), "你的光学眼把符文放大了一百倍。它们拼出了一个名字——是它的。", "Your optic magnifies the runes a hundredfold. They spell a name: its own.")]}))
    ]};

  N.mech_703 = {chapter: 7, scene: "tech_vault", speaker: null, time: {h: 2},
    alt: [ADD(F("burnedKey"), "你烧掉过一把钥匙。这扇门好像知道。", "You once burned a key. This door seems to know.")],
    text: L("圣库最底层的门，上次没被打开，现在被废码重新锁上，门上写好了一行字：“请输入钥匙。”\n门后是格拉维克斯锁了一万年的东西：会思考的机器、禁用的公式、没人敢回答的问题。\n它在等你。",
            "The lowest door of the Vault, which held last time, is now locked anew in scrapcode, with a line written across it: “Please enter key.”\nBehind it lies all Gravex has locked away for ten thousand years: thinking machines, banned equations, questions nobody dared answer.\nIt is waiting for you."),
    choices: [
      C("用奥西娅的钥匙打开", "Open it with Ossia's key", "mech_704", O(Q({flag: "ossiaKey"}, true), X({renown: -5, corruption: 10, set: {openedArchive: true}, taint: {tzeentch: 30}},
        "门开了。你只读了一行，就懂了三件以前不懂的事，和一件再也忘不掉的事。",
        "The door opens. You read one line and understand three things you didn't before, and one you can never forget."))),
      C("用书记神甫的权限重新封印", "Reseal it with a lexmechanic's codes", "mech_704", O(Q({stat: "renown", min: 35}), X({hp: -5, renown: 8, set: {resealed: true}},
        "封印咬住你的植入体，抽走了一部分电流。门安静了。",
        "The seal bites your implants and drains some of your current. The door goes quiet."))),
      C("用身体挡住门缝，祈祷", "Block the gap with your body, and pray", "mech_704", O(Q({stat: "renown", max: 34}, true), X({hp: -10, sanity: -5, set: {resealed: true}},
        "门缝里的东西推了你一整夜。天亮前，它累了。你也是。",
        "Whatever is behind the gap pushes at you all night. Before dawn it tires. So do you."))),
      C("只看一眼", "Just one look", "mech_704", X({sanity: -10, set: {glimpsed: true}, taint: {tzeentch: 25}},
        "你从门缝里看了一眼。里面的东西也看了你一眼。",
        "You glance through the crack. What's inside glances back."))
    ]};

  N.mech_704 = {chapter: 7, scene: "forge_floor", speaker: TOBIN, time: {h: 3},
    grudgeLine: {npc: "tobin", text: L("废码掀开了手术刀盖住的一层：它想起了你，想起了你亏欠它的那一次。", "Scrapcode has peeled back what the surgeons laid over it: it remembers you, and what you owed it.")},
    alt: [ADD(FROM(["mech_702"]), "你和凯什且战且退到第七熔炉——反应堆的入口就在它下面。", "You and Kesh fight your way back to the Seventh Furnace; the reactor's entrance lies beneath it."),
          ADD(FROM(["mech_703"]), "你从圣库的维修井一路下到熔炉层，正好出在第七熔炉。", "You climb down the Vault's maintenance shaft and come out at the Seventh Furnace."),
          ADD(FROM(["mech_701b"]), "你从隧道出口爬上来，正对着第七熔炉。", "You climb out of the tunnel exit, right in front of the Seventh Furnace."),
          ADD(F("foundTobin"), "兽人走后你找过它。那时它还在哼正着的歌。", "You looked for it after the orks. Back then it still hummed the song the right way."),
          ADD(F("avoidedTobin"), "你躲了它这么久。现在躲不开了。", "You avoided it for so long. Not now.")],
    text: L("熔炉边，T-0B1N停下了。废码爬进了它的脑子，那首歌倒着唱，四个音全错了。\n它慢慢转向你，手里还握着一根烧红的钢锭。\n它从来没有看过你。现在它在看。",
            "By the furnace, T-0B1N has stopped. Scrapcode has crept into its head; the song runs backward, all four notes wrong.\nIt turns slowly toward you, a red-hot ingot still in its grip.\nIt has never looked at you. Now it does."),
    choices: [
      C("把那首歌正着唱给它听", "Sing it the song the right way round", "mech_705", O(Q({flag: "tobinSong"}, true), {grudge: {npc: "tobin", effects: {hp: -8},
          note: L("托宾想起了你对他做过的事，握着烧红的钢锭朝你走来。", "Tobin remembers what you did to him, and comes at you with the red-hot ingot.")}},
        X({sanity: 10, set: {tobinSaved: true, forgiven_tobin: true}},
        "第一个音，它停住了。第四个音，它放下钢锭，跟着你哼了起来。还是跑调。",
        "First note: it stops. Fourth: it sets down the ingot and hums along. Still off-key."))),
      C("替它擦掉脸上的废码", "Wipe the scrapcode from its face", "mech_705", O(Q({flag: "wipedFace"}, true), X({hp: -5, sanity: 5, set: {tobinSaved: true}},
        "你用袖子擦它的脸，像那年擦掉油污一样。废码像灰一样掉下来，它的手松开了钢锭。",
        "You wipe its face with your sleeve, as you once wiped off the oil. The scrapcode falls away like ash; its hand releases the ingot."))),
      C("关掉它", "Shut it down", "mech_705", O({grudge: {npc: "tobin", effects: {hp: -6},
          note: L("它想起了你，被按下开关前死死抓住了你的手腕。", "It remembers you, and grips your wrist hard before the switch goes down.")}},
        X({sanity: -8, set: {tobinOff: true}},
        "你按下它后颈的开关。它倒下时很轻，像一件终于脱下的外套。",
        "You press the switch at its neck. It falls lightly, like a coat finally taken off."))),
      C("让锈接管它", "Let the rust take it", "mech_705", O(X({sanity: -5, set: {tobinRust: true}, taint: {nurgle: 40}},
        "锈从它的关节里开出花来，橙色的，很暖。它又能动了，比以前更有耐心。",
        "Rust blooms from its joints, orange and warm. It moves again, more patient than before."),
        {resultAlt: [RA(F("sporePet"), "你想起管道里那片蘑菇。锈从它的关节里开出花来，橙红相间，很暖。它又能动了。", "You think of the fungus in the pipes. Rust blooms from its joints, orange and red, warm. It moves again.")]}))
    ]};

  N.mech_705 = {chapter: 7, scene: "manufactorum", speaker: VALLEN, foe: "dark_mechanicus", time: {h: 2},
    alt: [ADD(F("tobinSaved"), "T-0B1N跟在你身后，步伐整齐。", "T-0B1N follows behind you, perfectly in step."),
          ADD(F("tobinRust"), "长着锈花的T-0B1N跟在你身后，慢，但不停。", "Rust-blossomed T-0B1N follows you, slow but unstopping.")],
    text: L("瓦伦贤者挡在反应堆外闸前，六根触手断了五根。\n他把一枚权限芯片塞进你手里：“熔炉的心脏不认职衔，只认虔诚。”\n“维修通道还通。去。我来计算怎么让他们慢一点。”他的发声器在冒烟。",
            "Magos Vallen blocks the reactor's outer gate, five of his six mechadendrites severed.\nHe presses an override chip into your hand. “The forge's heart heeds no rank. Only devotion.”\n“The maintenance passage is still open. Go. I'll calculate a way to slow them.” His vox-grille is smoking."),
    choices: [
      C("收下芯片，走", "Take the chip and go", "mech_706", X({renown: 10, set: {vallenKey: true}},
        "你跑出很远才回头。贤者的最后一根触手正在把外闸焊死，从里面。",
        "You run a long way before looking back. His last tendril is welding the outer gate shut. From the inside.")),
      C("拖着他一起走", "Drag him with you", "mech_706", X({hp: -10, renown: 5, set: {vallenKey: true, draggedVallen: true}},
        "他太重了，大半是黄铜。走到一半，他把一条数据塞进你的植入体，关掉推进器，松开了你的手。",
        "He's too heavy, mostly brass. Halfway, he pushes a packet of data into your implant, shuts off his own motors and lets go of your hand."))
    ]};

  N.mech_706 = {chapter: 7, scene: "burning_city", speaker: KESH, time: {h: 3},
    alt: [ADD(F("keshRepair"), "她站着的那条腿，是你用冲压机连杆做的。", "The leg she stands on is the one you made from a press linkage."),
          ADD(F("withKesh"), "你们一路退到这里，她一直挡在你前面。", "All the way here she has kept herself between you and it."),
          ADD(F("keshForget"), "“协议，”她纠正自己，“不是我写的。是协议。”", "“Protocol,” she corrects herself. “Not mine. Protocol.”")],
    text: L("维修通道口，最后的防线。凯什只剩一条胳膊和一条腿。\n“最后一条教条，”她说，“我自己写的：保护书记神甫。”\n她的分队转身冲进烟里，步伐整齐，像同一个人。",
            "The mouth of the maintenance passage: the last line. Kesh has one arm and one leg left.\n“Final doctrina,” she says. “I wrote it myself: protect the lexmechanic.”\nHer maniple turns and charges into the smoke, perfectly in step, like one person."),
    choices: [
      C("和她一起冲", "Charge with her", "mech_707", O(X({hp: -20, renown: 5, set: {keshLast: true}},
        "冲到一半，凯什把你推了回来。她最后说的不是二进制，是一个你听不懂的音节。",
        "Halfway in, Kesh shoves you back. Her last word isn't binary. It's a syllable you don't understand."),
        {resultAlt: [RA(F("keshTalk"), "冲到一半，凯什把你推了回来。她最后说的不是二进制，是她名字剩下的那个音节：“凯。”", "Halfway in, Kesh shoves you back. Her last word isn't binary. It's the one syllable left of her name: ‘Ke.’")]})),
      C("跑向反应堆", "Run for the reactor", "mech_707", X({sanity: -5},
        "你没有回头。你知道她会这么计算：这是最优解。",
        "You don't look back. You know how she'd calculate it: optimal.")),
      C("走向马戈斯的旗帜", "Walk toward the Dark Magos's banner", "mech_end_heretek", O(Q([{flag: "heardOssia"}, {flag: "ossiaKey"}], true), X({corruption: 15},
        "你放下武器，握着奥西娅的钥匙，朝那面黄铜旗帜走去。没人拦你。他们好像早就在等你。",
        "You lower your weapon and, Ossia's key in hand, walk toward the brass banner. No one stops you. They seem to have been expecting you.")))
    ]};

  N.mech_707 = {chapter: 7, scene: "forge_floor", speaker: SYRREDIN, foe: "daemon_engine", time: {h: 1},
    alt: [ADD(F("askedNew"), "“你问过为什么不自己补。我也问过，三十年前。”", "“You asked why we don't complete it ourselves. So did I, thirty years ago.”"),
          ADD(F("glimpsed"), "“你看过禁库一眼。你看见它也在看你了吗？”", "“You looked into the archive. Did you see it looking back?”"),
          ADD(F("askedOmni"), "“你问过你的神。它没回答，是不是？”", "“You asked your god. It didn't answer, did it?”"),
          ADD(F("heardOssia"), "奥西娅站在他身边，替他翻译。她没看你。", "Ossia stands at his side, translating for him. She doesn't look at you."),
          ADD(F("ossiaArrested"), "植入体收到一条禁闭室发来的消息：别信他。——奥", "Your implant receives a message from a holding cell: don't trust him. —O."),
          ADD(F("keshLast"), "肩上还留着凯什推你那一下的力道。", "Your shoulder still feels the force of Kesh's shove."),
          ADD(F("crystal"), "“你的铅箱里有我想要的东西，”他说。", "“Your lead box holds something I want,” he says.")],
    text: L("反应堆大厅里，黑暗马戈斯塞瑞丁在等你。他从废码打开的冷却管道进来，身体是一座会走的工坊，身后蹲着那台恶魔引擎。\n“你抄过那块残片。缺的三成，我能补全。我什么都能补全。”\n“跟我走吧。”",
            "In the reactor hall Dark Magos Syrredin waits; he came in through coolant ducts the scrapcode opened. His body is a walking workshop; the daemon engine crouches behind him.\n“You copied that fragment. The missing third, I can complete. I can complete anything.”\n“Come with me.”"),
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
        "He offers a hand with one joint too many, like Ossia's. You take it."))),
      C("把铅箱交给他", "Hand him the lead box", "mech_end_heretek", O(Q({flag: "crystal"}, true), X({corruption: 15, taint: {tzeentch: 10}},
        "他撕开七道封条，金属在他掌心认主般地缠上来。“你看，”他说，“你一直在替我收集。”",
        "He tears the seven seals; the metal coils into his palm as if it knew him. “You see,” he says, “you've been collecting for me all along.”")))
    ]};

  /* ============ Chapter 8 · The Omnissiah ============ */
  N.mech_801 = {chapter: 8, scene: "forge_floor", speaker: null, foe: "daemon_engine", time: {h: 1},
    alt: [ADD(F("cutReactor"), "你切断过它的接口。控制台上的灯还在生你的气。", "You once cut its ports. The console lights are still sulking at you."),
          ADD(F("knowLanding"), "冷却管道已被凯什的人炸塌，他的援兵进不来了。", "Kesh's people have collapsed the coolant ducts; his reinforcements can't get in."),
          ADD(F("quietFaith"), "你没向光环提过问题。现在你也不问，只是去做。", "You asked the halo nothing. You ask nothing now; you act."),
          ADD(F("kastelanMisfire"), "赫隆倒在侧门边，塞给你一枚晶片：“别漏分号。”", "Hollon lies by the side door and presses a wafer on you. “Mind the semicolons.”")],
    text: L("恶魔引擎扑向反应堆。它的每一步都让地面生锈，每一声吼都让灯光变色。\n格拉维克斯的心脏就在它爪下。\n你有的，是一点权限、几句祷文，和一具还没完全变成机器的身体。",
            "The daemon engine lunges for the reactor. Every step rusts the floor; every roar changes the colour of the lights.\nGravex's heart lies beneath its claws.\nYou have a little clearance, a few prayers, and a body not yet entirely machine."),
    choices: [
      C("用瓦伦的芯片唤醒反应堆", "Wake the reactor with Vallen's chip", "mech_802", O(Q([{flag: "vallenKey"}, {stat: "renown", min: 30}]), X({renown: 5, set: {chipWoke: true}},
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
    alt: [ADD(F("chipWoke"), "瓦伦的芯片在控制台上烫得发红。", "Vallen's chip glows red-hot in the console."),
          ADD(F("tobinSaved"), "T-0B1N站在你身边，看着那根导管。", "T-0B1N stands beside you, looking at the conduit."),
          ADD(F("tobinRust"), "锈花斑斑的T-0B1N朝导管伸出了手。", "Rust-flowered T-0B1N reaches toward the conduit.")],
    text: L("反应堆苏醒了。等离子流涌出导管，可管道被恶魔引擎的爪子撕开了一半。\n必须有人握住导管，把光引到它身上。\n握住的人，大概剩不下多少。",
            "The reactor wakes. Plasma surges through the conduit, but the engine's claws have torn the pipe half open.\nSomeone must hold the conduit and aim the light at it.\nWhoever holds it will probably not have much left."),
    choices: [
      C("亲手握住导管", "Hold the conduit yourself", null, R(0.55, "hp", "mech_802a", "mech_804",
        RR("导管在你手里稳住了。光劈了出去。", "The conduit steadies in your grip. The light lashes out.",
           "导管在你手里扭动，像活的。光打偏了，引擎转向了你。", "The conduit writhes like something alive. The light goes wide; the engine turns on you."))),
      C("用机械触手握住导管", "Hold the conduit with your mechadendrite", "mech_805", O(Q({flag: "armAug"}, true), X({hp: -5, set: {tendrilLost: true}},
        "触手在等离子里熔成一截铜疙瘩，导管稳住了。光把恶魔引擎从中间劈开。",
        "The tendril melts to a lump of copper in the plasma, but the conduit holds. The light splits the engine down the middle."))),
      C("让T-0B1N去握", "Let T-0B1N hold it", "mech_805", O(Q({flag: "tobinSaved"}, true), X({sanity: -15, set: {tobinGave: true}},
        "它走过去握住导管，没有犹豫。光吞没它之前，它哼完了那首歌。正着唱的。",
        "It walks over and takes the conduit without hesitation. Before the light swallows it, it finishes the song. The right way round."))),
      C("让长着锈花的T-0B1N去握", "Let rust-flowered T-0B1N hold it", "mech_805", O(Q({flag: "tobinRust"}, true), X({sanity: -5, set: {rustGave: true}, taint: {nurgle: 15}},
        "它握住导管，锈花在等离子里噼啪作响，却没有熄灭。光劈开了引擎，它还站着。",
        "It grips the conduit; the rust-flowers crackle in the plasma but do not die. The light splits the engine, and it is still standing.")))
    ]};

  N.mech_802a = {chapter: 8, scene: "forge_floor", speaker: null, foe: "daemon_engine", time: {h: 1},
    text: L("等离子流把恶魔引擎从中间劈开。\n你闻到自己的肉在烧，然后什么也闻不到了。\n你松开导管时，那只手已经不在了。",
            "The plasma splits the daemon engine down the middle.\nYou smell your own flesh burning, then smell nothing at all.\nWhen you let go of the conduit, the hand is no longer there."),
    effects: {hp: -13, set: {handLost: true}},
    choices: [
      C("倒下", "Fall", "mech_805", X(null,
        "你倒在还在冒烟的黄铜残骸旁边。有人在喊你的编号。",
        "You fall beside the smoking brass wreck. Someone is shouting your number."))
    ]};

  N.mech_803 = {chapter: 8, scene: "forge_floor", speaker: KASTELAN, foe: "daemon_engine", time: {h: 1},
    alt: [ADD(F("kastelanWoke"), "第四台是红色的，头上还焊着角。它自己走来的。", "The fourth is red, horns still welded on. It came by itself."),
          ADD(F("mekWatch"), "你想起兽人机械佬：它信，所以它跑。你也信了一次。", "You remember the Ork Mek: it believes, so it goes. This once, you believe too."),
          ADD(F("blewKastelan"), "你炸掉过一台卡斯特兰。剩下这几台，你得对得起。", "You once blew up a Kastelan. You owe these ones.")],
    text: L("卡斯特兰机器人按住恶魔引擎。一台被撕碎，另一台顶上去。\n它们不害怕，因为不许害怕；它们不撤退，因为晶片里没写。\n你把最后一条指令插进第三台：“打它的心。”",
            "The Kastelans pin the engine. One is torn apart; another takes its place.\nThey don't fear, because fear is not permitted. They don't retreat, because the wafers don't say to.\nYou slot the last order into the third: “Strike its heart.”"),
    effects: {renown: 5},
    choices: [
      C("看着它出拳", "Watch it strike", "mech_805", X(null,
        "铁拳穿过黄铜。炮管里那个呼吸的东西尖叫了一声，然后安静了。",
        "The iron fist punches through brass. The breathing thing in the barrel shrieks once, then falls silent."))
    ]};

  N.mech_804 = {chapter: 8, scene: "forge_floor", speaker: null, foe: "daemon_engine", time: {h: 1},
    text: L("恶魔引擎的爪子把你按在地上。黄铜贴着你的脸，烫得发甜。\n炮管里那个呼吸的东西凑近你，用你母亲的声音念你的编号。\n你还有一只手能动。",
            "The engine's claws pin you to the floor. Brass against your cheek, hot enough to taste sweet.\nThe breathing thing in the gun barrel leans close and recites your number in your mother's voice.\nYou still have one hand free."),
    effects: {hp: -24, sanity: -5},
    choices: [
      C("把能源匣塞进它的炮管", "Jam a power cell down its barrel", "mech_805", O(Q({flag: "armed"}, true), X({hp: -6},
        "爆炸把你们俩都掀翻了。它的吼声变成尖叫，又变成金属冷却的嘀嗒声。",
        "The blast throws you both. Its roar becomes a scream, then the ticking of cooling metal."))),
      C("念出它的真名", "Speak its true name", "mech_805", O(Q({flag: "openedArchive"}, true), X({sanity: -15, corruption: 10},
        "你在禁库里读过这个名字。恶魔在钢铁里抽搐，松开了爪子。你嘴里一股铁锈味。",
        "You read this name in the forbidden archive. The daemon convulses in its steel and lets go. Your mouth tastes of rust."))),
      C("念出符文拼过的那个名字", "Speak the name its runes spelled", "mech_805", O(Q({flag: "runeName"}, true), X({sanity: -18},
        "你在防线上看过它拼出自己的名字。你念出来，它像被人叫醒的梦游者，猛地一僵。",
        "You watched its runes spell its own name on the line. You say it aloud; it jerks rigid like a sleepwalker woken."))),
      C("用身体顶住炮口", "Brace the muzzle with your body", "mech_805", X({hp: -10, sanity: 5, set: {bracedMuzzle: true}},
        "你用肩膀顶住炮口，它自己的炮弹在膛里炸开。你被掀出去很远，还活着。",
        "You shoulder the muzzle shut; its own shell bursts in the breech. You're thrown a long way, and still alive."))
    ]};

  N.mech_805 = {chapter: 8, scene: "forge_floor", speaker: null, time: {d: 1},
    alt: [ADD(F("handLost"), "你的右手没了，袖子空着，还在发烫。", "Your right hand is gone; the sleeve hangs empty, still hot."),
          ADD(F("tendrilLost"), "触手熔成了一截铜疙瘩，挂在你背上。", "Your tendril has melted to a copper lump hanging from your back."),
          ADD(F("tobinGave"), "导管边只剩一块编号牌：T-0B1N。", "By the conduit lies only a number-plate: T-0B1N."),
          ADD(F("rustGave"), "T-0B1N还站在导管边，锈花开得更旺了。", "T-0B1N still stands by the conduit, its rust-flowers brighter than ever."),
          ADD(F("savedMenials"), "隧道里的三百个杂役爬了出来，一个都没少。", "The three hundred menials climb out of the tunnels, not one missing."),
          ADD(F("countedDead"), "又要念编号了。这次你知道会有多长。", "The numbers will have to be read again. This time you know how long it takes."),
          ADD(F("bracedMuzzle"), "你的肩膀碎了，可你还站得起来。", "Your shoulder is shattered, but you can still stand."),
          ADD(F("draggedVallen"), "瓦伦塞进你植入体的那条数据，是一封推荐信。", "The data Vallen pushed into your implant is a letter of recommendation.")],
    text: L("恶魔引擎倒下了。轨道炮台终于开火，塞瑞丁的舰船拖着火尾逃出了星系。\n格拉维克斯还剩一半熔炉、三成杂役，和刚学会二进制不到一年的你。\n天亮了。天还是红的。",
            "The daemon engine falls. The orbital batteries finally open fire; Syrredin's ship flees the system trailing flame.\nGravex has half its furnaces, three-tenths of its menials, and you, not a year into binary.\nDawn comes. The sky is still red."),
    effects: {sanity: 5},
    choices: [
      C("穿上贤者的袍子，留着这颗心", "Take a Magos's robe, and keep your heart", "mech_end_magos", O(Q([{flag: "fleshKept"}, {stat: "renown", min: 35}]), X({renown: 10},
        "授袍那天，你没有换掉任何零件。神甫们窃窃私语，没人敢说出口。",
        "On the day of investiture you replace no parts. The priests whisper; none dare say it aloud."))),
      C("随探索舰队出发，去求知", "Sail with the explorators, on the Quest", "mech_end_explorator", O(Q([{stat: "renown", min: 30}, {flag: "quest"}]), X({renown: 5},
        "你把卡兰提斯留下的东西抄进新舰的星图。第一个目的地，就是G-7。",
        "You copy what Calantis left you into the new ship's charts. The first destination is G-7."),
        {resultAlt: [RA({notFlag: "calantisCoords"}, "你把她的遗言抄进新舰的档案，坐标要你自己去找。第一个目的地是G-7。", "You copy her last words into the new ship's archive; the coordinates you must find yourself. First destination: G-7.")]})),
      C("回第七熔炉去", "Go back to the Seventh Furnace", "mech_806", X(null,
        "你没去领赏。你沿着烧焦的传送带，一路走回了第七熔炉。",
        "You don't go for your reward. You follow the scorched conveyors all the way back to the Seventh Furnace.")),
      C("把恶魔引擎的核心带回去研究", "Take the engine's core home to study", "mech_end_purged", O(Q({flag: "askedNew"}, true), X({corruption: 5},
        "核心还是热的，在你怀里轻轻跳动。你告诉自己，只是看看它怎么运转。",
        "The core is still warm, pulsing gently in your arms. You tell yourself you only want to see how it works.")))
    ]};

  N.mech_806 = {chapter: 8, scene: "forge_floor", speaker: null, time: {d: 3},
    alt: [ADD(F("keeper"), "反应堆认出了你的脚步，墙上的灯亮了一下。", "The reactor knows your footsteps; a light on the wall blinks once."),
          ADD({anyFlag: ["tobinOff", "tobinGave"]}, "T-0B1N站过的地方空着。你停下来，哼了四个音。", "The place where T-0B1N stood is empty. You stop and hum four notes."),
          ADD(F("menialSong"), "隧道里学会那首歌的杂役，都回到了这里。", "The menials who learned the song in the tunnels have all come back here.")],
    text: L("三天后，你回到第七熔炉。配额板烧掉了一半，剩下那半上，你的旧编号还在，是绿的。\n反应堆在墙后低低地响。\n有人递给你一把扳手。",
            "Three days later you are back at the Seventh Furnace. Half the quota board has burned; on what's left, your old number is still there, and green.\nThe reactor murmurs behind the wall.\nSomeone hands you a spanner."),
    choices: [
      C("留下来，当它的看守神甫", "Stay, as its keeper", "mech_end_keeper", O(Q({flag: "keeper"}), X({sanity: 10},
        "你接过扳手，拧紧了第一颗螺栓。反应堆的灯又亮了一下。",
        "You take the spanner and tighten the first bolt. The reactor's light blinks again."))),
      C("回到配额板前，做个普通人", "Go back to the quota board, an ordinary worker", "mech_end_survivor", X({sanity: 5},
        "你把神甫的袍子叠好，放进柜子，换上了杂役的工装。",
        "You fold the priest's robe into a locker and put on menial's overalls."))
    ]};

  /* ============ Endings ============ */
  N.mech_end_magos = {chapter: 8, scene: "manufactorum", speaker: null, time: {y: 30},
    alt: [ADD(F("fleshFirst"), "袍子下没有黄铜。神甫们至今叫你“原装的贤者”。", "There's no brass beneath the robe. The priests still call you ‘the original Magos’."),
          ADD(F("handLost"), "你用一只黄铜手签下了第一道命令。另一只，还是肉的。", "You sign your first order with a brass hand. The other is still flesh."),
          ADD(F("draggedVallen"), "瓦伦的推荐信，挂在你办公室的墙上。", "Vallen's letter of recommendation hangs on your office wall.")],
    text: L("三十年后，你成了格拉维克斯的贤者。袍子下有黄铜，胸口里仍是一颗会疼的心。\n你改了转化线的规矩：会数数的、会唱歌的，先送来见你。\n你的档案里，名字一栏终于填上了。",
            "Thirty years later you are a Magos of Gravex. Brass beneath the robe; in your chest, a heart that still aches.\nYou change the rules of the conversion line: anyone who can count, or sing, is sent to you first.\nIn your file, the name field is finally filled in."),
    ending: {kind: "good", title: L("有心的贤者", "The Magos With a Heart"), cause: L("成为保留人心的贤者", "Became a Magos who kept a heart")}};

  N.mech_end_explorator = {chapter: 8, scene: "void", speaker: null, time: {y: 1, warp: true},
    alt: [ADD(F("calantisCoords"), "卡兰提斯的坐标旁，你画了一个问号。", "Beside Calantis's coordinates you draw a question mark."),
          ADD(F("sentCawl"), "火星来了一份请求：路过时，替考尔大贤者多看一眼。", "A request arrives from Mars: on your way, take a second look for Archmagos Cawl.")],
    text: L("新的探索舰起航了。第一个目的地是G-7，塞瑞丁逃走的方向就在它后面。\n星区之外，还有一万座沉睡的墓穴、一万块失落的残片、一万个没人回答的问题。\n求知之旅没有终点。这正是你喜欢它的地方。",
            "The new explorator ship sets sail. The first mark on its chart is G-7; the way Syrredin fled lies just beyond.\nBeyond the sector lie ten thousand sleeping tombs, ten thousand lost fragments, ten thousand unanswered questions.\nThe Quest has no end. That's what you love about it."),
    ending: {kind: "good", title: L("群星间的求知者", "Seeker Among the Stars"), cause: L("随探索舰队远行", "Sailed with the explorators")}};

  N.mech_end_keeper = {chapter: 8, scene: "forge_floor", speaker: null, time: {y: 2},
    alt: [ADD({anyFlag: ["tobinOff", "tobinGave"]}, "你每天在T-0B1N站过的地方停一下，哼四个音。", "Every day you pause where T-0B1N stood and hum four notes."),
          ADD(F("tobinRust"), "T-0B1N还在，锈花开满全身，哼歌哼得很慢。", "T-0B1N is still here, covered in rust-flowers, humming slowly."),
          ADD(F("tobinSaved"), "然后给T-0B1N擦脸。它还在哼歌，还是跑调。", "Then you wipe T-0B1N's face. It still hums, still off-key."),
          ADD(F("menialSong"), "第七熔炉的杂役上工时，都哼着那四个音。", "The Seventh Furnace's menials hum those four notes as they work.")],
    text: L("你没有升职，留在第七熔炉当它的看守神甫。\n每天早上，你给反应堆念祷文，给传送带上油。\n杂役们说，第七熔炉的机魂是全星球脾气最好的。",
            "You decline promotion and stay on as keeper of the Seventh Furnace.\nEach morning you pray to the reactor and oil the conveyors.\nThe menials say the Seventh Furnace has the kindest machine spirit on the planet."),
    ending: {kind: "good", title: L("第七熔炉的看守", "Keeper of the Seventh Furnace"), cause: L("留作熔炉的看守神甫", "Stayed as the furnace's keeper")}};

  N.mech_end_survivor = {chapter: 8, scene: "forge_floor", speaker: null, time: {y: 1},
    alt: [ADD(F("savedMenials"), "隧道里你救下的人，有一半在你这条线上。", "Half the people you saved in the tunnels work your line."),
          ADD(F("handLost"), "你用一只手干活，配额照样是绿的。", "You work one-handed, and your quota is still green.")],
    text: L("你没有升职，也没有出发。你回到配额板前，和活下来的杂役一起，把格拉维克斯重新造起来。\n你的数字每天都是绿的。\n夜里，有人在宿舍里哼一首四个音的歌。你跟着哼。",
            "No promotion, no voyage. You go back to the quota board and rebuild Gravex beside the menials who lived.\nYour number is green every day.\nAt night someone in the dormitory hums a four-note song. You hum along."),
    ending: {kind: "good", title: L("回到配额板前", "Back at the Quota Board"), cause: L("活下来，回去做工", "Survived and went back to work")}};

  N.mech_end_servitor = {chapter: 1, scene: "forge_floor", speaker: S("servitor", "无名机仆", "A Nameless Servitor"), time: {d: 3},
    text: L("你醒来时，已经不再需要醒来。\n你的编号牌上有一串数字。你推着矿车，步伐整齐。\n隔壁的机仆在哼一首四个音的歌。你不知道为什么，也跟着哼了起来。",
            "You wake no longer needing to wake.\nYour plate bears a string of digits. You push an ore cart, perfectly in step.\nThe servitor beside you hums a four-note song. Without knowing why, you hum along."),
    ending: {kind: "bad", title: L("一串数字", "A String of Digits"), cause: L("被改造成机仆", "Converted into a servitor")}};

  N.mech_end_pure = {chapter: 6, scene: "manufactorum", speaker: VALLEN, time: {d: 7},
    text: L("仪式很成功。你看清了一切：格拉维克斯的产能、黑暗马戈斯的弱点、自己剩余的寿命。\n你不害怕，不后悔，也不再记得那首歌。\n瓦伦贤者说你是他最好的作品。你同意。这是一个正确的数据。",
            "The Rite succeeds. You see everything clearly: Gravex's output, the Dark Magos's weaknesses, your own remaining lifespan.\nYou feel no fear, no regret, and no longer remember the song.\nMagos Vallen calls you his finest work. You agree. It is a correct datum."),
    ending: {kind: "bad", title: L("纯思", "Pure Thought"), cause: L("切除了一切感情", "Excised every feeling")}};

  N.mech_end_heretek = {chapter: 7, scene: "daemon_world", speaker: SYRREDIN, time: {y: 5, warp: true},
    alt: [ADD(FROM(["mech_706"]), "你走向旗帜的那天，凯什的分队还在烟里冲锋。", "The day you walked to the banner, Kesh's maniple was still charging into the smoke.")],
    text: L("塞瑞丁兑现了承诺：你问什么，他答什么。\n你学会了把恶魔写进机器，把机器写进血肉。格拉维克斯在身后燃烧，你忙着记笔记。\n很多年后，你给自己换了一只手，关节多一个。",
            "Syrredin keeps his promise: whatever you ask, he answers.\nYou learn to write daemons into machines and machines into flesh. Gravex burns behind you; you're busy taking notes.\nYears later you give yourself a new hand, with one joint too many."),
    ending: {kind: "bad", title: L("未缚者的学徒", "Apprentice of the Unbound"), cause: L("投身黑暗机械教", "Joined the Dark Mechanicum")}};

  N.mech_end_purged = {chapter: 8, scene: "tech_vault", speaker: S("magos", "铸造世界法庭", "The Forge Tribunal"), time: {d: 9},
    alt: [ADD(F("resealed"), "你重新封过禁库。法庭记下了，没有改判。", "You once resealed the forbidden archive. The tribunal notes it, and does not change the verdict.")],
    text: L("你把恶魔引擎的核心带回圣库，只想看看它是怎么运转的。\n法庭的判决只有一个二进制词：异端。\n他们没有把你改成机仆。他们怕那颗核心已经教会了你的大脑什么。",
            "You bring the engine's core back to the Vault. You only want to see how it works.\nThe tribunal's verdict is one binary word: heresy.\nThey don't make you a servitor. They fear what the core has already taught your brain."),
    ending: {kind: "bad", title: L("最后的好奇心", "The Last Curiosity"), cause: L("因技术异端被处决", "Executed for tech-heresy")}};

  N.mech_end_looted = {chapter: 5, scene: "ork_scrapyard", speaker: MEK, time: {y: 1},
    text: L("机械佬给你起了个名字：“小扳手”。你每天给兽人修枪，修得越好，它们越开心。\n后来你发现，枪修不修都能打响，只要它们相信。\n你开始怀疑学过的一切，也开始相信：红的跑得快。",
            "The Mek names you “Lil' Spanner”. Every day you fix ork guns; the better you fix them, the happier they are.\nLater you notice the guns fire whether fixed or not, as long as the orks believe.\nYou begin to doubt everything you learned. And to believe red ones go faster."),
    ending: {kind: "bad", title: L("小扳手", "Lil' Spanner"), cause: L("被兽人掳去修枪", "Kept by orks to fix their guns")}};

  /* ============ Claim endings (SPEC §19): reached via the claim events' goto ============ */
  N.mech_end_claim_tzeentch = {scene: "tech_vault", speaker: S("daemon_tzeentch", "多出来的一行", "The Extra Line"), time: {d: 9},
    text: L("你终于补全了一块STC残片。缺的那部分，是奸奇亲手填上的。\n设计完美，能造出任何东西，可每造一件，图纸就改变一处。\n你造了一辈子，从没造出过同一样东西。这正是他的计划。",
            "At last you complete an STC fragment. The missing part was filled in by Tzeentch's own hand.\nThe design is perfect and can build anything, but each time it builds, the blueprint changes.\nYou build all your life and never make the same thing twice. Which was his plan."),
    codex: ["god_tzeentch"],
    ending: {kind: "bad", title: L("补全的残片", "The Completed Fragment"), cause: L("被奸奇的答案收走", "Taken by Tzeentch's answers")}};

  N.mech_end_claim_nurgle = {scene: "forge_floor", speaker: S("sigil_nurgle", "慈祥的锈", "A Kindly Rust"), time: {d: 30},
    alt: [ADD(F("sporePet"), "锈花中间，冒出了一丛红绿相间的蘑菇。", "Among the rust-flowers sprouts a clump of red-and-green fungus.")],
    text: L("你不再给机器上油。锈是温柔的，它让一切慢下来，却从不让它们停下。\n第七熔炉开满了橙色的锈花，机仆们在花丛里哼歌，永远不会坏，也永远不会好。\n慈父说，这才是不朽。",
            "You stop oiling the machines. Rust is gentle: it slows everything and never lets it stop.\nThe Seventh Furnace blooms with orange rust; servitors hum among the flowers, never breaking, never mending.\nGrandfather says this is the true immortality."),
    codex: ["god_nurgle"],
    ending: {kind: "bad", title: L("锈花", "Rust Blossoms"), cause: L("随锈蚀被纳垢收走", "Taken by Nurgle with the rust")}};

  N.mech_end_claim_khorne = {scene: "burning_city", speaker: S("sigil_khorne", "试射的鼓点", "The Test-Fire Drum"), time: {d: 20},
    text: L("你先是把工具焊在了手上，后来把整条胳膊换成了链锯。\n格拉维克斯造的每一门炮你都想亲手试射，靶子从铁板变成了人。\n血神不在乎你的植入体是什么型号，只在乎它们还在开火。",
            "First you weld your tools to your hand; later you swap the whole arm for a chainblade.\nYou want to test-fire every gun Gravex makes; the targets change from steel plates to people.\nThe Blood God doesn't care what model your implants are. Only that they keep firing."),
    codex: ["god_khorne"],
    ending: {kind: "bad", title: L("试射", "Test-Fire"), cause: L("化作恐虐的战争机器", "Became Khorne's war machine")}};

  N.mech_end_claim_slaanesh = {scene: "manufactorum", speaker: S("sigil_slaanesh", "下一个型号", "The Next Model"), time: {y: 4},
    text: L("每一个植入体都很完美，直到你看见下一个型号。\n你换了眼睛、手、心、声音，直到镜子里再没有一块原装零件。\n你仍不满意。色孽最爱的，正是这种永远差一点的完美。",
            "Every implant is perfect, until you see the next model.\nYou replace eyes, hands, heart, voice, until the mirror holds not one original part.\nStill you're not satisfied. Slaanesh loves exactly this: perfection forever one step away."),
    codex: ["god_slaanesh"],
    ending: {kind: "bad", title: L("下一个型号", "The Next Model"), cause: L("被色孽的完美收走", "Taken by Slaanesh's perfection")}};

  /* ============ Death nodes (engine-triggered) ============ */
  N.mech_death_hp = {scene: "forge_floor", speaker: null,
    text: L("你倒下了。后来来收尸的是两个机仆，它们只评估你身上还有多少可回收零件。\n不多。植入体被拆下来，整整齐齐码进回收箱。\n剩下的部分，被归档为“耗材”。",
            "You fall. The ones who come for the body are two servitors; they only assess how many recoverable parts you hold.\nNot many. Your implants are removed and stacked neatly in the salvage bin.\nThe rest is filed as ‘consumables’."),
    ending: {kind: "death", title: L("耗材", "Consumables"), cause: L("倒下，被归为耗材", "Fell, filed as consumables")}};

  N.mech_death_sanity = {scene: "manufactorum", speaker: null,
    text: L("你开始只用二进制说话，后来只用二进制思考，最后只剩一串重复的数字。\n神甫们检查了你，宣布你的心智“已格式化”。\n转化线很欢迎你。这一次，你不用排队。",
            "You begin speaking only in binary, then thinking only in binary, until nothing is left but a repeating string of digits.\nThe priests examine you and declare your mind ‘formatted’.\nThe conversion line welcomes you. This time, no queue."),
    ending: {kind: "death", title: L("已格式化", "Formatted"), cause: L("心智崩溃，被格式化", "Mind wiped clean")}};

  N.mech_death_corruption = {scene: "daemon_world", speaker: null,
    text: L("你身体里的机器开始说另一种语言。它们不再听你的，也不再听万机之神的。\n你的植入体长出了牙齿，血变成了黄铜色。\n会有人把你造成一台很好的引擎。",
            "The machines inside you start speaking another language. They no longer obey you, nor the Omnissiah.\nYour implants grow teeth; your blood turns the colour of brass.\nSomeone will make you into a very fine engine."),
    ending: {kind: "death", title: L("黄铜之血", "Brass Blood"), cause: L("被恶魔机械吞噬", "Consumed by daemon-iron")}};

/* ============ Route events: 5 taint (SPEC §18, 1 cleanse) + 2 route events ============ */
  function E(text, effects, result) { return {text: text, effects: effects, result: result}; }
  WH.registerEvents([
    {id: "evt_t_mech_tzeentch", god: "tzeentch", factions: ["mechanicus"], minChapter: 2,
     where: {scenes: ["tech_vault", "ship_interior"]},
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
     where: {scenes: ["forge_floor", "manufactorum"], chapter: {min: 3, max: 6}},
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
     where: {scenes: ["manufactorum", "forge_floor", "barracks"], chapter: {min: 3, max: 6}},
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

    {id: "evt_t_mech_khorne", god: "khorne", factions: ["mechanicus"], minChapter: 3,
     where: {scenes: ["barracks", "ship_interior"]},
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
     where: {scenes: ["manufactorum", "mars_vista", "tech_vault", "barracks"], chapter: {min: 3, max: 6}},
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
     where: {scenes: ["manufactorum", "tech_vault", "ship_interior", "forge_floor"]},
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

    {id: "evt_mech_census", god: "other", factions: ["mechanicus"], minChapter: 3,
     where: {scenes: ["forge_floor", "manufactorum", "barracks"], chapter: {min: 3, max: 6}},
     scene: "forge_floor", speaker: S("hive_foreman", "普查官", "A Census-Taker"), foe: null,
     text: L("神教在做血肉普查。普查官扫描了你一遍，报出两个数：你的原装率，和你这个级别的平均值。\n两个数不一样。\n他在你的档案上画了一个小小的皱眉。",
             "The Cult is taking a flesh census. The census-taker scans you and reads out two figures: your percentage of original flesh, and the average for your grade.\nThey don't match.\nHe draws a tiny frown on your file."),
     codex: ["mech_magi"],
     choices: [
       E(L("申请降低百分比", "Apply to lower the percentage"), {renown: 3, hp: -5},
         L("下个月，你的百分比降了四点。普查官的皱眉被擦掉了。", "Next month your figure drops four points. The frown on your file is erased.")),
       E(L("问他平均值是多少", "Ask what the average is"), {sanity: -3},
         L("“平均值在逐年下降，”他说，“这是好事。”他说得很真诚。", "“The average falls every year,” he says. “That is good.” He sounds sincere.")),
       E(L("什么也不说", "Say nothing"), {sanity: 3},
         L("你摸了摸自己的手。不管那两个数是多少，今晚，它们都还是你的。", "You touch your own hands. Whatever the figures say, tonight they're still yours."))
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
    RU("rum_mech_aurex", 1, 3, L("墙上贴的装货单", "A manifest pinned to the wall"),
      L("装货单：激光枪两万支，目的地奥雷克斯二号。备注：“上一批还没付钱。”",
        "Manifest: twenty thousand lasguns, destination Aurex Secundus. Note: “Previous shipment still unpaid.”"),
      ["place_aurex"], W(["forge_floor", "manufactorum"], null, ["place_aurex"], ["激光枪", "配额", "奥雷克斯"], ["lasgun", "quota", "Aurex"])),
    RU("rum_mech_treaty", 2, 4, L("圣库门楣上的铭文", "An inscription over the Vault door"),
      L("门楣上刻着一行古老的条款：“火星不向泰拉下跪，泰拉不进火星的门。”下面有人用粉笔打了个问号。",
        "An old clause is carved over the door: “Mars kneels not to Terra; Terra enters not the gates of Mars.” Beneath, in chalk, someone has added a question mark."),
      ["chr_unification_wars"], W(["mars_vista", "tech_vault"], ["omen_mars"], ["mech_treaty_olympus", "place_mars"], ["条约", "火星"], ["Treaty", "Mars"])),
    RU("rum_mech_rift", 2, 6, L("食堂里的老神甫", "An old priest at the table"),
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
    RU("rum_mech_pariah", 4, 4, L("舰员食堂里的老护教军", "An old Skitarius in the mess"),
      L("“卡兰提斯贤者老念叨：有片星域，死灵的方尖碑让人连梦都不做了。她说想要一座。就一座。”",
        "“The Explorator keeps saying: there's a region where necron pylons stop people even dreaming. She wants one. Just one.”"),
      ["chr_pariah_nexus"], W(["tomb_interior", "tomb_exterior", "ship_interior"], ["necron_warrior", "canoptek_scarab", "explorator"], ["nec_necrons", "nec_living_metal"], ["骷髅", "金字塔"], ["skeleton", "pyramid"])),
    RU("rum_mech_armageddon", 5, 5, L("食堂里的老护教军", "An old Skitarius at mess"),
      L("“在阿玛吉顿，兽人用废铁焊出跟泰坦一样高的巨像，还让它走起来了。贤者们至今不愿提。”",
        "“On Armageddon the orks welded scrap into idols tall as Titans, and made them walk. The Magi still won't talk about it.”"),
      ["chr_second_armageddon"], W(["ork_scrapyard", "burning_city"], ["ork", "ork_mek", "ork_nob", "gretchin"], ["xenos_ork"], ["兽人", "绿皮"], ["ork", "greenskin"])),
    RU("rum_mech_schism", 6, 8, L("广播里的半截布道", "A half-erased sermon on the vox"),
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
