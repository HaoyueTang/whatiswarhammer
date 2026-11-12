/* data/factions/gsc.js — Genestealer Cult route (text role: text-gsc). SPEC §3, §11, §16–§19, §20b, §23, §26, §27.
 * Player: a human miner in Shaft Nine on Kessin Tertius (凯辛三号), a mining world of the Arcosa Sector, start 100.M42;
 * two time-skips (12 y, 3 y) put Hesper's fall (112.M42) in ch.4 and the Day of Ascension in 115.M42 (SPEC §27 window).
 * The Hollin family — the Cult of the Four-Armed Emperor — gives food, protection and belonging; each generation looks
 * less human. The "Star Children" they pray to are a Tyranid hive fleet; the Day of Ascension ends with the swarm
 * devouring everyone, cult included. Tone: warm family horror. The love is real.
 * Sector echoes (§27): ore goes to Aurex Secundus; Hesper (burned after its own cult) is the warning nobody heeded;
 * a rumour of Carcharos refugees.
 * Helpers: L(zh,en) · S(sprite,zh,en) speaker · C(zh,en,next,extra) choice · X(effects,zh,en) {effects,result} ·
 *          R(p,stat,success,fail,RR(...)) roll + rollResult · O(...) merge · Q(require, hide).
 * Hidden taint (SPEC §18) only in effects.taint, never mentioned in text. The Shadow in the Warp muffles the gods
 * (taintMod 0.6), so claims are rare and written as strange.
 * "The kiss" / hybrid lineage is only ever implied (family resemblance, eyes, a small mark) — never described.
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
  /* SPEC §28 grudge: G(npc, noteZh, noteEn[, p][, effects]) — only on later choices where that person is plainly present */
  function G(npc, zh, en, p, effects) {
    var g = {npc: npc, note: {zh: zh, en: en}};
    if (p) g.p = p;
    if (effects) g.effects = effects;
    return {grudge: g};
  }

  var TEO     = S("gsc_neophyte", "提奥", "Teo");
  var OSSA    = S("medicae", "奥莎大娘", "Ma Ossa");
  var JORY    = S("gsc_acolyte", "乔里表哥", "Cousin Jory");
  var WREN    = S("gsc_neophyte", "雷恩", "Wren");
  var NELL    = S("gsc_neophyte", "小内尔", "Little Nell");
  var MAGUS   = S("gsc_magus", "伊拉里昂主祭", "Magus Ilarion");
  var PRIMUS  = S("gsc_primus", "哈斯克首领", "Primus Hask");
  var GRANDSIRE = S("gsc_patriarch", "老祖宗", "The Grandsire");
  var ICON    = S("omen_four_armed", "四臂帝皇像", "The Four-Armed Icon");
  var STARS   = S("omen_star_children", "星之子", "The Star Children");
  var GANT    = S("hive_foreman", "甘特工头", "Foreman Gant");
  var BRANN   = S("hive_foreman", "老布兰", "Old Brann");
  var VASK    = S("enforcer", "瓦斯克执法官", "Enforcer-Captain Vask");
  var MARR    = S("enforcer", "玛尔警长", "Sergeant Marr");
  var REYES   = S("guard_sergeant", "雷耶斯中尉", "Lieutenant Reyes");
  var THORNE  = S("inquisitor", "索恩审判官", "Inquisitor Thorne");
  var LUSK    = S("preacher", "卢斯克神父", "Father Lusk");
  var ASTRO   = S("psyker", "星语者", "The Astropath");
  var MOTHER  = S("gsc_acolyte", "你的母亲", "Your Mother");

  var N = {};

  /* ============ Chapter 1 · Shaft Nine ============ */
  N.gsc_101 = {chapter: 1, scene: "mine_shaft", speaker: null,
    text: L("凯辛三号，九号矿井，地下两千米。\n一班十四个小时，挖出来的矿石装上升降机，再装上矿船，运去奥雷克斯二号的工厂。\n你没有家人。你的灯，是你唯一的朋友。",
            "Kessin Tertius. Shaft Nine, two thousand metres down.\nFourteen-hour shifts. The ore goes up the lift, onto the haulers, off to the manufactoria of Aurex Secundus.\nYou have no family. Your lamp is your only friend."),
    codex: ["place_kessin", "place_shaft_nine"],
    choices: [
      C("去最深的掌子面，那里给双倍工分", "Take the deep face. Double tally", "gsc_102", X({hp: -5, renown: 2, taint: {nurgle: 40}},
        "深处的空气又湿又甜，吸进去像喝了一口温水。你咳了一整班，工分确实翻了一倍。",
        "The deep air is damp and sweet, like a mouthful of warm water. You cough all shift. The tally does double.")),
      C("跟着提奥去浅一点的巷道", "Follow Teo to the shallower gallery", "gsc_102", X({sanity: 3},
        "提奥一路哼着歌，是一首你没听过的赞美诗，调子有点怪，却很好听。",
        "Teo hums all the way: a hymn you don't know. The tune is a little odd, and lovely."))
    ]};

  N.gsc_102 = {chapter: 1, scene: "mine_shaft", speaker: TEO, time: {h: 6},
    text: L("头顶的岩层发出一声长长的呻吟。\n“塌方！”提奥喊。灯光乱晃，碎石像雨一样落下。\n他的声音在你身后，越来越远。",
            "The rock overhead lets out a long groan.\n“Cave-in!” Teo shouts. Lamps swing wildly; gravel falls like rain.\nHis voice is behind you, and getting further away."),
    choices: [
      C("回头去拉提奥", "Turn back for Teo", "gsc_103", X({hp: -10, renown: 5, set: {savedTeo: true}},
        "你抓住他的手腕，一根梁砸在你肩上。黑暗合拢之前，你们俩还握在一起。",
        "You catch his wrist; a beam slams your shoulder. As the dark closes in, your hands are still locked.")),
      C("冲向升降机", "Run for the lift", null, R(0.55, "hp", "gsc_104", "gsc_103",
        RR("你扑进升降笼，闸门在身后落下。你没有回头。", "You dive into the cage; the gate drops behind you. You don't look back.",
           "一块石头砸中你的腿。你倒下了，离提奥只有几步。", "A rock takes your leg out. You fall, a few steps from Teo.")))
    ]};

  N.gsc_103 = {chapter: 1, scene: "mine_shaft", speaker: JORY, time: {h: 9},
    text: L("不知过了多久，石头被一块块搬开。\n是霍林家的表兄弟们，戴着兜帽，脸色苍白，抬起横梁像抬木板。\n其中一个朝你伸出手。那只手，比人的手长了一截。",
            "After who knows how long, the stones are lifted away one by one.\nThe Hollin cousins: hooded, pale, lifting beams like planks.\nOne reaches a hand down to you. The hand is a little too long."),
    effects: {hp: -5},
    choices: [
      C("握住那只手", "Take the hand", "gsc_105", X({renown: 5},
        "那只手很稳，很暖。“别怕，”兜帽下的声音说，“我们照顾自己人。”",
        "The hand is steady and warm. “Easy,” says the voice under the hood. “We look after our own.”")),
      C("自己爬出来", "Climb out on your own", "gsc_105", X({hp: -5, sanity: 3},
        "你拒绝了帮忙，膝盖磨破了皮。表兄弟们没生气，只是静静等你爬上来。",
        "You refuse the help and skin both knees. The cousins don't mind. They wait quietly until you're up."))
    ]};

  N.gsc_104 = {chapter: 1, scene: "mine_shaft", speaker: GANT, time: {h: 3},
    text: L("甘特工头在升降口记账。“擅离掌子面，扣三天工分。”\n半夜，霍林家的表兄弟们把提奥抬了上来，全身是灰，还活着。\n提奥看见你，第一句话是：“你没事就好。”",
            "Foreman Gant is at the lift with his ledger. “Left your face. Three days docked.”\nAt midnight the Hollin cousins carry Teo up: grey with dust, alive.\nThe first thing Teo says when he sees you is: “Good. You're all right.”"),
    effects: {renown: -3},
    choices: [
      C("向他道歉", "Apologise to him", "gsc_105", X({sanity: -3, renown: 5},
        "提奥摆摆手。“谁都会跑。家里人不记这种账。”你不知道他说的“家里人”是谁。",
        "Teo waves it off. “Anyone would run. Family doesn't keep that kind of ledger.” You don't know whose family he means.")),
      C("对提奥一言不发，转身走开", "Say nothing to Teo and walk away", "gsc_105", X({sanity: -5, set: {wronged_teo: true}},
        "提奥还在等你开口。你把他丢在塌方里，现在连一句话也不肯给。那一夜你睡不着，耳朵里全是落石声。",
        "Teo waits for you to speak. You left him in the rockfall, and now you won't give him a word. You don't sleep; your ears are full of falling stone."))
    ]};

  N.gsc_105 = {chapter: 1, scene: "hive_hab", speaker: GANT, time: {d: 2}, codex: ["imp_imperium"],
    text: L("工棚里贴出新告示：什一税上调，口粮减半，医官下个月才来。\n甘特工头敲着告示板：“嫌少？星区里想要这份工的人多得是。”\n有人咳嗽。没人说话。",
            "A new notice in the barracks: tithe raised, rations halved, the medic not due till next month.\nForeman Gant raps the board. “Not enough? Half the sector would take this job.”\nSomeone coughs. Nobody speaks."),
    choices: [
      C("一拳砸烂告示板", "Smash the notice board", "gsc_106", X({hp: -8, renown: 5, set: {protested: true}, taint: {khorne: 45}},
        "木板碎了，你的指节也破了。执法官把你按在地上。人群里，几个戴兜帽的人记住了你的脸。",
        "The board splinters, and so do your knuckles. Enforcers pin you down. In the crowd, a few hooded faces remember yours.")),
      C("替咳嗽的老工友说句话", "Speak up for the coughing old miner", "gsc_106", X({renown: 4, sanity: -3, set: {protested: true}},
        "甘特把你的名字写进本子里。散工后，提奥拍了拍你的背：“你是个好人。家里人会喜欢你。”",
        "Gant writes your name in his book. After shift Teo claps your back. “You're a good one. The family will like you.”")),
      C("低头，什么也不说", "Keep your head down", "gsc_106", X({sanity: -5},
        "你低着头回到铺位。那一晚的口粮，只有半块。",
        "You go back to your bunk with your head down. Supper is half a bar."))
    ]};

  N.gsc_106 = {chapter: 1, scene: "hive_hab", speaker: TEO, time: {d: 3},
    text: L("提奥塞给你一块热乎乎的面包。\n“星期天来霍林家吃饭吧。奥莎大娘做饭，从来都多做一份。”\n他笑起来眼角有很深的纹路，像个好人，也确实是个好人。",
            "Teo presses a warm roll into your hands.\n“Come to the Hollin house on Sunday. Ma Ossa always cooks for one more.”\nHe has deep creases at the eyes when he smiles. He looks like a good man. He is one."),
    choices: [
      C("“我去。”", "“I'll come.”", "gsc_107", X({renown: 3},
        "提奥高兴得像个孩子。“大娘会喜欢你的，”他说，“大家都会。”",
        "Teo is as pleased as a child. “Ma will love you,” he says. “Everyone will.”")),
      C("“我一个人惯了。”", "“I'm used to being alone.”", "gsc_107", X({sanity: -5},
        "你一个人过了那个星期天，嚼着冷口粮，听隔壁传来歌声。下个星期天，你还是去了。",
        "You spend that Sunday alone with cold rations, listening to singing through the wall. The next Sunday, you go."))
    ]};

  N.gsc_107 = {chapter: 1, scene: "hive_hab", speaker: OSSA, time: {d: 4},
    text: L("霍林家又挤又暖，三代人，几十张脸，汤锅冒着热气。\n奥莎大娘给你包扎手上的伤，手法比医官还好。\n墙上挂着一幅帝皇像。画里的帝皇，有四只手臂。",
            "The Hollin house is crowded and warm: three generations, dozens of faces, a steaming pot.\nMa Ossa dresses the cut on your hand, better than any medic.\nOn the wall hangs a picture of the Emperor. In it, the Emperor has four arms."),
    codex: ["gsc_four_armed", "place_hollin_house"],
    choices: [
      C("问那幅画的事", "Ask about the painting", "gsc_108", X({renown: 3, set: {askedIcon: true}},
        "“两只手不够抱住所有人，”大娘说，“真正的帝皇，手够用。”满屋子的人都笑着点头。",
        "“Two arms aren't enough to hold everyone,” Ma says. “The true Emperor has arms enough.” The whole room smiles and nods.")),
      C("埋头喝汤", "Just eat the soup", "gsc_108", X({hp: 10},
        "汤很浓，有肉。你已经记不起上一次吃肉是什么时候。大娘又给你添了一碗。",
        "The soup is thick, with meat in it. You can't remember the last time you ate meat. Ma refills your bowl.")),
      C("饭前向帝皇祷告", "Say grace to the Emperor", "gsc_108", X({renown: 3, sanity: 3},
        "大家都跟着你低头祷告。只是他们念的帝皇，好像和你念的不太一样。",
        "Everyone bows their head with you. Only, the Emperor they name doesn't sound quite like yours."))
    ]};

  N.gsc_108 = {chapter: 1, scene: "hive_hab", speaker: JORY, time: {h: 4},
    text: L("乔里表哥送你回工棚。路灯下，他的影子有三只手臂。\n他察觉你在看，也不躲：“生来就这样。帝皇的礼物。”\n“下星期再来，”他说，“我们照顾自己人。”",
            "Cousin Jory walks you back to the barracks. Under the streetlamp, his shadow has three arms.\nHe notices you looking and doesn't hide it. “Born this way. A gift of the Emperor.”\n“Come again next week,” he says. “We look after our own.”"),
    choices: [
      C("“我会来的。”", "“I'll be there.”", "gsc_201", X({renown: 5},
        "乔里用第三只手拍了拍你的肩。很轻，像怕把你碰坏。",
        "Jory pats your shoulder with his third hand. Very gently, as if afraid to break you.")),
      C("加快脚步，不回答", "Walk faster without answering", "gsc_201", X({sanity: -5},
        "他没跟上来。可第二天早上，你的铺位上放着一碗还温着的汤。",
        "He doesn't follow. But next morning a still-warm bowl of soup sits on your bunk."))
    ]};

  /* ---------- Origin prologue · The enforcer's child ---------- */
  N.gsc_o_warden_1 = {chapter: 1, scene: "underhive", speaker: MARR,
    text: L("你母亲是凯辛三号执法分局的玛尔警长。你在局里当文书，整理失踪报告。\n今年三十一份，全部来自九号矿井。\n“矿工会失踪，”母亲说，“可不会这么整齐。”",
            "Your mother is Sergeant Marr of the Kessin enforcer precinct. You clerk there, filing missing-persons reports.\nThirty-one this year, every one from Shaft Nine.\n“Miners go missing,” your mother says. “Not this neatly.”"),
    codex: ["place_kessin", "imp_arbites"],
    choices: [
      C("把报告按日期排开", "Lay the reports out by date", "gsc_o_warden_2", X({sanity: -3, set: {pattern: true}},
        "失踪总在星期天晚上。你把这个发现告诉母亲，她盯着看了很久，没说话。",
        "They always vanish on Sunday nights. You show your mother. She stares a long time and says nothing.")),
      C("照规矩归档", "File them by the book", "gsc_o_warden_2", X({renown: 2},
        "你把报告塞进柜子。柜子已经塞满了。",
        "You slide the reports into the cabinet. The cabinet is already full."))
    ]};

  N.gsc_o_warden_2 = {chapter: 1, scene: "mine_shaft", speaker: MARR, time: {d: 2},
    text: L("母亲带你下矿问话。矿工们围成一圈，谁也不开口。\n一个苍白的小女孩站在人群后面看着你，眼睛在灯下有点发紫。\n有人轻轻把她拉走了。",
            "Your mother takes you down the mine to ask questions. The miners close ranks; nobody talks.\nA pale little girl watches you from behind them, her eyes faintly violet in the lamplight.\nSomeone gently draws her away."),
    choices: [
      C("朝那个女孩笑一笑", "Smile at the girl", "gsc_o_warden_3", X({renown: 4},
        "女孩也笑了。人群似乎松动了一点，有个老矿工给你们倒了杯水。",
        "The girl smiles back. The crowd seems to ease a little; an old miner pours you both water.")),
      C("记下所有人的脸", "Memorise every face", "gsc_o_warden_3", X({sanity: -3, renown: -3, set: {pattern: true}},
        "你记下了四十多张脸。有十几张，长得很像，像一家人。",
        "You memorise forty-odd faces. A dozen of them look alike. Like one family."))
    ]};

  N.gsc_o_warden_3 = {chapter: 1, scene: "hive_hab", speaker: OSSA, time: {d: 9},
    text: L("矿工罢工，母亲在冲突里被铁棍砸伤，血止不住。医官要下个月才来。\n是奥莎大娘救了她。老太太手很稳，一句话也没多问。\n“警长也是人，”她说，“人都要有人照顾。”",
            "A strike turns ugly; an iron bar opens your mother's head and the bleeding won't stop. The medic isn't due till next month.\nMa Ossa saves her. The old woman's hands are steady, and she asks nothing.\n“A sergeant is people too,” she says. “People need looking after.”"),
    effects: {sanity: -6},
    codex: ["place_hollin_house"],
    choices: [
      C("握住大娘的手道谢", "Take Ma's hand and thank her", "gsc_o_warden_4", X({renown: 6, sanity: 3},
        "她的手粗糙又温暖。“星期天来吃饭吧，”她说，“带上你母亲，等她好了。”",
        "Her hand is rough and warm. “Come to supper Sunday,” she says. “Bring your mother, once she's well.”")),
      C("问她怎么懂得这么多", "Ask how she knows so much", "gsc_o_warden_4", X({sanity: -3},
        "“活得久，见得多。”她笑着说。屋里所有人都跟着笑了，笑声齐得像排练过。",
        "“Live long, see plenty,” she laughs. Everyone in the room laughs with her, in unison, as if rehearsed."))
    ]};

  N.gsc_o_warden_4 = {chapter: 1, scene: "underhive", speaker: VASK, time: {d: 20},
    text: L("瓦斯克执法官把你叫进办公室。“你母亲欠霍林家一条命，正好。”\n“去九号矿井当矿工，去吃他们的饭，告诉我他们在干什么。”\n“别告诉你母亲。”",
            "Enforcer-Captain Vask calls you into his office. “Your mother owes the Hollins a life. Convenient.”\n“Go down Shaft Nine as a miner. Eat their food. Tell me what they're up to.”\n“Don't tell your mother.”"),
    effects: {sanity: -5},
    choices: [
      C("接下任务", "Take the assignment", "gsc_201", X({renown: -2, set: {vaskAgent: true}},
        "你换上矿工的工装。第一个星期天，奥莎大娘给你多盛了一勺汤，没问你为什么来。",
        "You put on miner's overalls. The first Sunday, Ma Ossa gives you an extra ladle of soup and doesn't ask why you came.")),
      C("接下任务，但告诉母亲", "Take it, but tell your mother", "gsc_201", X({sanity: 3, set: {vaskAgent: true, toldMarr: true}},
        "母亲沉默了很久。“吃他们的饭，”她最后说，“但别忘了自己是谁。”",
        "Your mother is silent a long time. “Eat their food,” she says at last. “But remember who you are.”"))
    ]};

  /* ---------- Origin prologue · Brood-born (fourth generation, passes as human) ---------- */
  N.gsc_o_kin_1 = {chapter: 1, scene: "gsc_chapel", speaker: MOTHER,
    text: L("你生在霍林家。你母亲头巾下是光滑的、带着骨棱的头皮，她是第三代。\n你生出来时，一点也不像她。家里人叫你“素脸的孩子”，说这是最大的福分。\n主祭摸着你的头说：“你能走在他们中间。”",
            "You were born in the Hollin house. Under her headscarf your mother's scalp is smooth and ridged; she is third generation.\nYou came out looking nothing like her. The family calls you “the plain one” and says it is the greatest blessing.\nThe Magus touches your head: “You will walk among them.”"),
    codex: ["place_kessin", "place_hollin_house", "gsc_generations"],
    choices: [
      C("在圣像前跪下", "Kneel before the icon", "gsc_o_kin_2", X({renown: 4, corruption: 2},
        "四臂帝皇在烛光里看着你。你脑子里那阵温暖的嗡鸣，从小就在，今天格外响。",
        "The Four-Armed Emperor watches you by candlelight. The warm hum in your head, there since childhood, is loud today.")),
      C("帮母亲把头巾系好", "Help your mother tie her scarf", "gsc_o_kin_2", X({sanity: 4},
        "她握住你的手。“出门在外，”她轻声说，“别让人看见你回头找我。”",
        "She holds your hand. “Out there,” she says softly, “don't let them see you look back for me.”"))
    ]};

  N.gsc_o_kin_2 = {chapter: 1, scene: "manufactorum", speaker: null, time: {y: 1},
    text: L("你在矿务署的计数室当文书，没人看得出你是什么。\n同事笑九号矿井的人是“怪胎窝”。你低头抄账，指节发白。\n脑子里的嗡鸣变尖了，像一大家子人一起皱眉。",
            "You clerk in the ore-tally office. Nobody can tell what you are.\nA colleague jokes that Shaft Nine is a “freak nest.” You keep copying figures, knuckles white.\nThe hum in your head sharpens, like a whole family frowning at once."),
    choices: [
      C("忍着，继续抄账", "Bear it. Keep copying", "gsc_o_kin_3", X({sanity: -5, renown: 2},
        "你忍到下班。回家时，母亲已经知道了，什么也没说，只给你热了汤。",
        "You hold out till the shift ends. At home your mother already knows. She says nothing, only warms your soup.")),
      C("看着他的眼睛，让他闭嘴", "Look him in the eye until he stops", "gsc_o_kin_3", X({corruption: 5, renown: 4, taint: {slaanesh: 30}},
        "你的眼神里有东西涌出去。同事愣住，忘了自己要说什么。那一瞬间的感觉，好得让你害怕。",
        "Something flows out through your gaze. He freezes and forgets what he was saying. The moment feels so good it frightens you."))
    ]};

  N.gsc_o_kin_3 = {chapter: 1, scene: "hive_hab", speaker: OSSA, time: {d: 6},
    text: L("奥莎大娘是你曾祖母。她把一张出货单推给你。\n“下周有一批采矿炸药，账上要少写二十箱。”\n“家里需要计数室里有自己人，”她说，“你是我们的眼睛。”",
            "Ma Ossa is your great-grandmother. She slides a shipping docket across to you.\n“Next week there's a load of mining charges. The books need to show twenty crates fewer.”\n“The family needs one of ours in the tally office,” she says. “You're our eyes.”"),
    choices: [
      C("改账", "Alter the books", "gsc_o_kin_4", X({renown: 6, set: {smuggler: true}},
        "数字很听话。二十箱炸药从帝国的账本上消失了，像从来没存在过。",
        "The figures obey. Twenty crates of explosive vanish from the Imperium's ledgers as if they never were.")),
      C("“炸药用来干什么？”", "“What are the charges for?”", "gsc_o_kin_4", X({sanity: -3, renown: -2},
        "大娘摸摸你的脸。“为了那一天，孩子。等星之子来的那一天。”",
        "Ma strokes your cheek. “For the Day, child. The Day the Star Children come.”"))
    ]};

  N.gsc_o_kin_4 = {chapter: 1, scene: "hive_hab", speaker: MOTHER, time: {d: 3},
    text: L("夜里，母亲坐在窗边哭。她听说，星区另一头的某颗星上，一整个“家族”被帝国烧死了。\n“他们只是想活着，”她说，“想在一起。”\n窗外，执法官的探照灯扫过整条街。",
            "At night your mother sits weeping by the window. Word is that on some world across the sector, a whole “family” was burned by the Imperium.\n“They only wanted to live,” she says. “To be together.”\nOutside, an enforcer searchlight sweeps the street."),
    codex: ["place_arcosa"],
    choices: [
      C("抱住她", "Hold her", "gsc_201", X({sanity: 4, renown: 4},
        "她的骨棱硌着你的下巴。你们就这样坐到天亮，谁也没松手。",
        "Her ridged scalp presses against your chin. You sit like that till dawn. Neither lets go.")),
      C("“他们为什么被烧？”", "“Why were they burned?”", "gsc_201", X({sanity: -4, set: {hesperQuestion: true}},
        "母亲擦了擦眼睛。“因为帝国害怕家人。”这个答案，你总觉得少了一半。",
        "Your mother wipes her eyes. “Because the Imperium fears family.” The answer always feels half missing to you."))
    ]};

  /* ============ Chapter 2 · The Family ============ */
  N.gsc_201 = {chapter: 2, scene: "hive_hab", speaker: OSSA, time: {d: 14},
    text: L("星期天的霍林家永远是满的。谁家孩子病了，谁家断了口粮，第二天就有人送东西上门。\n在这颗星球上，帝国只会收税。霍林家会给你留一碗汤。\n大娘说：“来，搭把手。”",
            "On Sundays the Hollin house is always full. A child falls sick, a family's rations run out, and by morning someone is at the door with help.\nOn this world the Imperium only collects. The Hollins save you a bowl.\nMa says: “Come on, lend a hand.”"),
    codex: ["gsc_cult"],
    choices: [
      C("帮大娘在厨房打下手", "Help Ma in the kitchen", "gsc_202", X({sanity: 5, renown: 4},
        "你切了一下午的块根。大娘教你一首切菜时唱的歌，歌词里有“天上的孩子”。",
        "You chop roots all afternoon. Ma teaches you a chopping song. The words mention “the children in the sky.”")),
      C("和表兄弟们玩牌", "Play cards with the cousins", "gsc_202", X({renown: 4, taint: {tzeentch: 45}},
        "你赢了一手又一手，赢得蹊跷。牌面上的花色，你看一眼就知道下一张是什么。",
        "You win hand after hand, uncannily. One glance at a suit and you know the next card.")),
      C("坐在四臂像下发呆", "Sit beneath the four-armed icon", "gsc_202", X({corruption: 4, sanity: 3},
        "画里的四只手好像在动，一只一只，慢慢把你圈了起来。你从来没觉得这么安全。",
        "The painting's four hands seem to move, one by one, slowly gathering you in. You have never felt so safe."))
    ]};

  N.gsc_202 = {chapter: 2, scene: "mine_shaft", speaker: VASK, foe: "enforcer", time: {d: 5},
    text: L("甘特又扣了一轮工分，提奥带着表兄弟们在升降口坐下罢工。\n瓦斯克执法官带着一队人赶到，电击棍噼啪作响。\n“三秒钟，”他说，“回去干活，或者躺着回去。”",
            "Gant docks another round of tallies, and Teo leads the cousins in sitting down at the lift-head in strike.\nEnforcer-Captain Vask arrives with a squad, shock-mauls crackling.\n“Three seconds,” he says. “Back to work, or carried back.”"),
    codex: ["imp_arbites"],
    choices: [
      C("和罢工的人坐在一起", "Sit with the strikers", null, R(0.5, "hp", "gsc_204", "gsc_203",
        RR("执法官的棍子落在你旁边的人身上。你护住了头，也护住了提奥。", "The mauls fall on the men beside you. You shield your head, and Teo's.",
           "一记电击棍正中你的后背，你眼前一黑。", "A shock-maul catches you square in the back. Everything goes black."))),
      C("悄悄溜走", "Slip away quietly", "gsc_204", X({sanity: -5, renown: -3},
        "你躲在矿车后面，听着棍子落下的声音，一下，又一下。",
        "You hide behind an ore cart and listen to the mauls come down. Again. Again.")),
      C("向执法官指认带头的提奥", "Point out Teo as the ringleader to Vask", "gsc_204", X({renown: -10, set: {informer: true, wronged_teo: true}},
        "瓦斯克塞给你一张口粮券。电击棍落在提奥肩上，他没喊，只抬头看了你一眼。",
        "Vask slips you a ration chit. The maul comes down on Teo's shoulder. He doesn't cry out. He only looks up at you."))
    ]};

  N.gsc_203 = {chapter: 2, scene: "hive_hab", speaker: OSSA, time: {d: 1},
    text: L("你在霍林家醒来。背上缠满绷带，奥莎大娘在给你喂汤。\n“表兄弟们把你抬回来的，”她说，“还有另外六个。”\n“执法官打的是工人，”她给你掖好被子，“我们护的是家人。”",
            "You wake in the Hollin house, your back swathed in bandages. Ma Ossa is spooning soup into you.\n“The cousins carried you back,” she says. “Six others too.”\n“The enforcers beat workers,” she tucks you in. “We look after family.”"),
    effects: {hp: -15, renown: 5},
    choices: [
      C("“谢谢……家里人。”", "“Thank you... family.”", "gsc_204", X({renown: 4, sanity: 4},
        "大娘的眼睛亮了一下。屋里的嗡嗡声，好像也跟着暖了一点。",
        "Ma's eyes brighten. The low hum in the room seems to warm a little too."))
    ]};

  N.gsc_204 = {chapter: 2, scene: "mine_shaft", speaker: null, time: {d: 2},
    text: L("第二天早上，甘特工头没来上班。\n他的办公室收拾得整整齐齐，账本合着，椅子推进桌下，像他只是出去喝口水。\n新来的工头姓霍林。工分，涨回来了。",
            "Next morning, Foreman Gant doesn't come to work.\nHis office is tidy: ledger closed, chair pushed in, as if he'd just stepped out for water.\nThe new foreman's name is Hollin. The tallies go back up."),
    choices: [
      C("去看看甘特的办公室", "Look around Gant's office", "gsc_205", X({sanity: -5, set: {sawOffice: true}},
        "桌下的地板上有一道细细的划痕，四条，并排，像有什么东西把他轻轻拖走了。",
        "On the floor under the desk: four thin scratches, side by side, as if something gently dragged him away.")),
      C("不问。工分涨了就好", "Don't ask. The tallies are up", "gsc_205", X({renown: 3, hp: 5, taint: {nurgle: 30}},
        "那个星期你第一次吃饱了饭。有些事不问，日子会好过很多。",
        "That week you eat your fill for the first time. Some things are easier left unasked."))
    ]};

  N.gsc_205 = {chapter: 2, scene: "underhive", speaker: VASK, time: {d: 3},
    text: L("瓦斯克执法官在审讯室里等你。“甘特失踪那晚，你在哪儿？”\n“霍林家的人说，你那晚和他们一起吃饭。”\n他慢慢翻着档案：“我想听你说。”",
            "Enforcer-Captain Vask is waiting in the interrogation room. “The night Gant vanished. Where were you?”\n“The Hollins say you were at supper with them.”\nHe leafs slowly through a file. “I want to hear it from you.”"),
    choices: [
      C("“我和霍林家吃饭。”", "“I was at supper with the Hollins.”", "gsc_206", X({renown: 8, sanity: -3, set: {liedForFamily: true}},
        "你说得很顺，顺得连自己都信了。走出审讯室时，提奥在门口等你，什么也没问。",
        "It comes out smoothly, so smoothly you believe it yourself. Teo is waiting outside and asks nothing.")),
      C("说出你看见的划痕", "Tell him about the scratches", "gsc_206", O(Q({flag: "sawOffice"}, true), X({renown: -10, set: {toldVask: true}},
        "瓦斯克的笔停了。“四条？”他把这页撕下来，折好，放进了贴身口袋。",
        "Vask's pen stops. “Four?” He tears the page out, folds it, and tucks it into an inside pocket."))),
      C("“母亲让我向您问好。”", "“Mother sends her regards.”", "gsc_206", O(Q({flag: "origin_warden"}, true), X({sanity: 3, set: {liedForFamily: true}},
        "瓦斯克看了你很久。“回去吃你的饭，”他说，“记住你在为谁吃。”",
        "Vask looks at you a long time. “Go eat your supper,” he says. “Remember whose table you eat it for.”"))),
      C("一言不发", "Say nothing at all", "gsc_206", X({hp: -8},
        "瓦斯克叹了口气，让人把你在禁闭室关了一夜。地上很冷，墙那边有人在哼霍林家的歌。",
        "Vask sighs and has you locked in a cell overnight. The floor is cold. Through the wall someone hums a Hollin song."))
    ]};

  N.gsc_206 = {chapter: 2, scene: "gsc_chapel", speaker: MAGUS, time: {d: 6},
    text: L("粮仓地下有一座小礼拜堂。几百人挤在里面，没人说话，却像在一起呼吸。\n伊拉里昂主祭走上前，他的声音很轻，却直接落进你脑子里：\n“星之子就要来了。他们会从天上降下，把我们接走。”",
            "Beneath the grain store is a small chapel. Hundreds are packed inside. Nobody speaks, yet they seem to breathe as one.\nMagus Ilarion steps forward. His voice is soft, and lands directly inside your head:\n“The Star Children are coming. They will descend from the sky and lift us up.”"),
    codex: ["gsc_magus", "place_hollin_chapel", "gsc_star_children"],
    choices: [
      C("跟着大家一起唱", "Sing with everyone", "gsc_207", X({corruption: 5, renown: 6, taint: {slaanesh: 20}},
        "你的声音融进几百个声音里。你从没唱得这么好，也从没这么不像你自己。",
        "Your voice melts into hundreds. You have never sung so well, nor sounded so little like yourself.")),
      C("盯着主祭的眼睛", "Watch the Magus's eyes", "gsc_207", X({sanity: -6, set: {watchedMagus: true}},
        "他的瞳孔里有紫色的光，一闪，全场几百人同时闭上了眼。只有你没闭。",
        "Violet light in his pupils flickers, and hundreds close their eyes at once. Only you don't.")),
      C("唱到一半，悄悄离开", "Slip out halfway through", "gsc_207", X({renown: -4, sanity: 3},
        "你爬上楼梯，外面的空气又冷又脏。脑子里那阵嗡鸣，过了很久才停。",
        "You climb the stairs into cold, dirty air. The hum in your head takes a long time to fade."))
    ]};

  N.gsc_207 = {chapter: 2, scene: "hive_hab", speaker: WREN, time: {d: 4},
    text: L("小雷恩七岁，是乔里的女儿。头皮光光的，像个小鸡蛋，眼睛很大。\n她拿着一块写字板跑过来：“大人说你识字。教我好不好？”\n她的手指比别的孩子多一节。",
            "Little Wren is seven, Jory's daughter. Her scalp is bare as an egg; her eyes are huge.\nShe runs up with a slate. “They say you can read. Will you teach me?”\nHer fingers each have one joint too many."),
    choices: [
      C("教她写自己的名字", "Teach her to write her name", "gsc_208", X({sanity: 6, renown: 4, set: {taughtWren: true}},
        "她写了一遍又一遍，写满了一整块板。“雷恩，”她念，“雷恩是我！”",
        "She writes it over and over until the slate is full. “Wren,” she reads. “Wren is me!”")),
      C("“去问你爸爸。”", "“Go ask your father.”", "gsc_208", X({renown: -4},
        "她低着头走了。那天晚饭，桌上的人对你客气了一点，也冷了一点。",
        "She walks off with her head down. At supper the table is a little more polite to you, and a little cooler."))
    ]};

  N.gsc_208 = {chapter: 2, scene: "mine_shaft", speaker: TEO, time: {d: 10}, eventRoll: 0.35,
    text: L("新工头给你排的都是好班：浅巷道，好空气，工分照算。\n提奥笑着说：“家里人嘛。”\n矿上一半的班组长都姓霍林了，另一半，星期天也去霍林家吃饭。",
            "The new foreman gives you only good shifts: shallow galleries, clean air, full tally.\nTeo grins. “Family, isn't it.”\nHalf the shift-bosses in the mine are Hollins now. The other half eat at the Hollin house on Sundays."),
    choices: [
      C("安心接受", "Accept it gladly", "gsc_209", X({renown: 4, hp: 5},
        "你胖了一点，咳嗽也好了。工棚里那些不去霍林家的人，开始不和你说话了。",
        "You put on a little weight; the cough clears. The men in the barracks who don't go to the Hollins stop speaking to you.")),
      C("照样去最深的掌子面", "Work the deep face anyway", "gsc_209", X({hp: -6, sanity: 3},
        "你不想欠谁的。提奥没劝你，只是每天收工都在升降口等你。",
        "You don't want to owe anyone. Teo doesn't argue. He just waits at the lift-head every shift's end.")),
      C("“霍林家怎么这么多人？”", "“How are there so many Hollins?”", "gsc_209", X({sanity: -4, set: {suspicious: true}},
        "提奥想了想。“大娘说，从她那一代算起，四代了。”他说得很骄傲。",
        "Teo thinks. “Ma says four generations, counting from hers.” He says it proudly."))
    ]};

  N.gsc_209 = {chapter: 2, scene: "cathedral", speaker: LUSK, time: {d: 5},
    text: L("矿区小教堂里，卢斯克神父对着空了一半的长椅布道。\n散场后他拦住你：“孩子，有人在拜一个假帝皇。四只手的那种。”\n“你要是知道什么，帝皇听得见。”",
            "In the mining chapel Father Lusk preaches to half-empty pews.\nAfterward he stops you. “Child, someone is worshipping a false Emperor. The four-armed kind.”\n“If you know anything, the Emperor is listening.”"),
    codex: ["imp_ecclesiarchy"],
    choices: [
      C("向他忏悔你看见的一切", "Confess everything you've seen", "gsc_210", X({sanity: 6, renown: -8, set: {confessedLusk: true}, taint: {all: -15}},
        "神父听完，脸色发白，在你额头上画了一个圣徽。“走吧。别再去了。”他的手在抖。",
        "The priest goes pale and traces the sign on your brow. “Go. Don't go back there.” His hand is shaking.")),
      C("“霍林家只是好心人。”", "“The Hollins are just good people.”", "gsc_210", X({renown: 5},
        "神父叹了口气。“好心人，”他重复了一遍，“好心人最难烧。”",
        "The priest sighs. “Good people,” he repeats. “Good people are the hardest to burn.”")),
      C("什么也不说，离开", "Say nothing and leave", "gsc_210", X({sanity: -3},
        "你走出教堂。门口的台阶上，坐着一个戴兜帽的小孩，正在数进出的人。",
        "You leave the chapel. On the steps sits a hooded child, counting who comes and goes."))
    ]};

  N.gsc_210 = {chapter: 2, scene: "gsc_chapel", speaker: MAGUS, time: {d: 7},
    text: L("伊拉里昂主祭单独见你。他的手很凉，声音像一条温暖的河。\n“你已经是家人了，只差一步。”\n“下一个休息日，跟我们下到十三号矿井。老祖宗想见见你。”",
            "Magus Ilarion sees you alone. His hands are cool; his voice is a warm river.\n“You are already family, all but one step.”\n“Next rest-day, come down Shaft Thirteen with us. The Grandsire wishes to meet you.”"),
    choices: [
      C("“我去。”", "“I'll come.”", "gsc_301", X({renown: 5, corruption: 3},
        "主祭笑了。那一夜你梦见一只很大很老的手，轻轻放在你头顶。",
        "The Magus smiles. That night you dream of a vast, ancient hand resting lightly on your head.")),
      C("“让我想一想。”", "“Let me think about it.”", "gsc_211", X({renown: -3},
        "“当然，”主祭说，“家人会等。”他说“等”的样子，让你后背发凉。",
        "“Of course,” says the Magus. “Family waits.” The way he says “waits” chills your spine."))
    ]};

  N.gsc_211 = {chapter: 2, scene: "cathedral", speaker: null, time: {d: 6},
    text: L("一个星期后，卢斯克神父不见了。\n小教堂的门锁着，圣坛上的蜡烛整整齐齐，点到一半就灭了。\n街上没人提起他。连执法官也没来。",
            "A week later, Father Lusk is gone.\nThe chapel door is locked. The altar candles stand in neat rows, burned halfway, then snuffed.\nNobody on the street mentions him. Not even the enforcers come."),
    effects: {sanity: -6},
    choices: [
      C("去执法分局", "Go to the enforcer precinct", "gsc_212"),
      C("回霍林家", "Go back to the Hollins", "gsc_301", X({renown: 4},
        "大娘给你开门，像什么都没发生。“饿了吧，”她说，“明天就是休息日了。”",
        "Ma opens the door as if nothing has happened. “Hungry?” she says. “Tomorrow's rest-day.”"))
    ]};

  N.gsc_212 = {chapter: 2, scene: "underhive", speaker: VASK, time: {h: 2},
    text: L("瓦斯克没让你说完。“我知道。神父，工头，三十一个矿工。”\n他把一颗通讯珠放在桌上。“我管的执法官里，至少有四个星期天去霍林家吃饭。”\n“我谁也信不过。除了你。”",
            "Vask doesn't let you finish. “I know. The priest, the foreman, thirty-one miners.”\nHe sets a vox-bead on the desk. “At least four of my own enforcers eat at the Hollins' on Sundays.”\n“I can't trust anyone. Except you.”"),
    choices: [
      C("戴上通讯珠，跟他们下井", "Wear the bead and go down with them", "gsc_301", X({sanity: -5, set: {wire: true}},
        "通讯珠藏在领口里，凉凉的。你觉得自己像揣着一颗会说话的心脏。",
        "The bead sits cold in your collar. It feels like carrying a heart that can talk.")),
      C("“你保护不了我。”", "“You can't protect me.”", "gsc_301", X({renown: 3},
        "瓦斯克没反驳。他只是把通讯珠收了回去，看起来比你还累。",
        "Vask doesn't argue. He just pockets the bead, looking more tired than you."))
    ]};

  /* ============ Chapter 3 · Down Below ============ */
  N.gsc_301 = {chapter: 3, scene: "mine_shaft", speaker: TEO, time: {d: 2},
    text: L("十三号矿井三十年前就封了。封条还在，只是从里面被整整齐齐地剪开了。\n你们往下走了很久。岩壁上刻满了小画：四只手的人，从天上落下的星星。\n提奥握着你的手：“快到了。”",
            "Shaft Thirteen was sealed thirty years ago. The seals are still there, cut neatly from the inside.\nYou go down a long way. The walls are covered in little carvings: four-armed figures, stars falling from the sky.\nTeo holds your hand. “Nearly there.”"),
    choices: [
      C("数着走过的层数", "Count the levels as you go", "gsc_302", X({sanity: -4, set: {counted: true}},
        "第十九层以下，地图上就没有了。第二十六层，你听见了很多人的呼吸声。",
        "Below level nineteen there are no maps. At level twenty-six you hear many people breathing.")),
      C("握紧提奥的手", "Hold Teo's hand tight", "gsc_302", O(X({sanity: 5, renown: 3},
        "他的手心有一层薄薄的硬皮，像甲壳。你没有松开。",
        "His palm has a thin, hard skin, like shell. You don't let go."),
        G("teo", "你伤过提奥，他的手在你掌心里一动不动。", "You wronged Teo. His hand lies motionless in yours.", 0, {sanity: -4}))),
      C("“提奥，从前是我对不住你。”", "“Teo, I wronged you once. I'm sorry.”", "gsc_302", O(Q({flag: "wronged_teo"}, true), X({renown: 3, set: {forgiven_teo: true}},
        "提奥怔了怔，用掌心的硬皮蹭了蹭你的手背。“早就不记了，”他说，“走吧。”",
        "Teo blinks, then rubs the hard skin of his palm over the back of your hand. “Long forgotten,” he says. “Come on.”")))
    ]};

  N.gsc_302 = {chapter: 3, scene: "cult_shrine", speaker: PRIMUS, foe: "gsc_neophyte", time: {h: 3},
    text: L("一个巨大的洞窟，几百个戴兜帽的人在操练，手里是采矿炸药和自动枪。\n哈斯克首领走过来。他头颅高耸，带着骨棱，眼神像一把量尺。\n“新的家人，”他说，“能扛多少？”",
            "A vast cavern. Hundreds of hooded figures drill with mining charges and autoguns.\nPrimus Hask strides over: a tall, ridged skull, eyes like a measuring rule.\n“New family,” he says. “How much can you carry?”"),
    codex: ["gsc_primus", "gsc_neophyte"],
    choices: [
      C("跟他们一起操练", "Join the drill", "gsc_303", X({hp: -6, renown: 6, set: {drilled: true}},
        "你扛着炸药跑了二十趟。首领在本子上写了一笔：“能用。”这是他最高的夸奖。",
        "You run twenty loads of charges. The Primus makes a note: “Useful.” His highest praise.")),
      C("“这些是用来做什么的？”", "“What is all this for?”", "gsc_303", X({sanity: -3},
        "“为了那一天，”首领说，“那一天，我们要让天空看见我们。”",
        "“For the Day,” says the Primus. “On that Day we make the sky see us.”")),
      C("站在一边，不说话", "Stand aside and keep quiet", "gsc_303", X({renown: -3},
        "首领看了你一眼，就像看一块还没决定用不用的矿石。",
        "The Primus glances at you the way one looks at ore not yet judged worth smelting."))
    ]};

  N.gsc_303 = {chapter: 3, scene: "cult_shrine", speaker: JORY, time: {h: 1},
    text: L("乔里带你认识家人：他的母亲有四只手，额头隆起，说话很慢，是第一代。\n她身后的帘子里，还有更老的人，你看不清，只听见甲壳摩擦的声音。\n乔里伸出他的第三只手。",
            "Jory introduces family. His mother has four arms and a swollen brow and speaks slowly: first generation.\nBehind her curtain are older ones still. You can't see them, only hear chitin rasp.\nJory holds out his third hand."),
    codex: ["gsc_generations", "gsc_acolyte"],
    choices: [
      C("握住他的第三只手", "Shake his third hand", "gsc_304", X({renown: 6, sanity: 3},
        "乔里笑得很开心。他母亲用四只手同时拍了拍你，像在拍一个新生的孙子。",
        "Jory beams. His mother pats you with all four hands at once, like a new grandchild.")),
      C("往后退了一步", "Take a step back", "gsc_304", X({sanity: -6, renown: -4},
        "帘子后面的声音停了。乔里慢慢收回手，笑容没变，眼神变了。",
        "The sounds behind the curtain stop. Jory slowly withdraws his hand. The smile stays. The eyes change."))
    ]};

  N.gsc_304 = {chapter: 3, scene: "cult_shrine", speaker: OSSA, time: {h: 1}, eventRoll: 0.4,
    text: L("最里面的洞室是育婴房，暖得像一个怀抱。\n摇篮里的孩子，有的长着骨棱，有的多一双手。\n奥莎大娘抱起最小的一个：粉红的脸，普普通通的人类婴儿。“第四代，叫内尔。”",
            "The innermost chamber is a nursery, warm as an embrace.\nIn the cradles some infants have ridged skulls, some an extra pair of arms.\nMa Ossa lifts the smallest: a pink, perfectly ordinary human baby. “Fourth generation. Her name's Nell.”"),
    choices: [
      C("接过内尔抱一抱", "Hold Nell", "gsc_305", X({sanity: 6, renown: 5, set: {heldNell: true}},
        "她抓住你的手指，抓得很紧。她的眼睛在灯下，是很淡的紫色。",
        "She grips your finger, hard. In the lamplight her eyes are the palest violet.")),
      C("“她看起来……和人一样。”", "“She looks... just human.”", "gsc_305", X({sanity: -4},
        "“对呀，”大娘骄傲地说，“她能走在他们中间。谁也认不出来。”",
        "“That's right,” Ma says proudly. “She'll walk among them. Nobody will ever know.”"))
    ]};

  N.gsc_305 = {chapter: 3, scene: "cult_shrine", speaker: MAGUS, time: {h: 1},
    text: L("主祭领你走向最后一道岩缝。里面很暗，很暖，有一种很低的嗡鸣，像巨大的心跳。\n“别怕，”他说，“老祖宗只是想认识你。”\n你的腿在发抖。",
            "The Magus leads you to a final crack in the rock. Inside it is dark and warm, and a very low hum throbs like an enormous heartbeat.\n“Don't be afraid,” he says. “The Grandsire only wants to know you.”\nYour legs are shaking."),
    codex: ["gsc_broodmind", "place_deep_cavern"],
    choices: [
      C("走进去", "Step inside", "gsc_306"),
      C("转身就跑", "Turn and run", null, R(0.45, "sanity", "gsc_307", "gsc_306",
        RR("你跑回黑暗的巷道，一路没有人追。他们不需要追。", "You flee into the dark galleries. No one chases you. They don't need to.",
           "你跑了两步，嗡鸣涌进脑子里，你的腿自己转了回去。", "Two steps, and the hum floods your head. Your legs turn you back on their own.")))
    ]};

  N.gsc_306 = {chapter: 3, scene: "cult_shrine", speaker: GRANDSIRE, time: {h: 1},
    text: L("黑暗里，有什么巨大的东西动了一下。紫色的甲壳，四只手臂，一张很老很老的脸。\n你本该尖叫。可它看着你时，你所有的害怕都化了，像糖化在热汤里。\n它低下头，好像在端详一个久别的孩子。",
            "In the dark, something enormous shifts. Violet chitin, four arms, a very, very old face.\nYou should scream. But as it looks at you, all your fear dissolves like sugar in hot soup.\nIt bows its head, as if studying a child long lost."),
    effects: {sanity: -6},
    codex: ["gsc_patriarch"],
    choices: [
      C("跪下", "Kneel", "gsc_308", X({corruption: 10, renown: 10, set: {knelt: true}},
        "你跪下的那一刻，脑子里的嗡鸣变成了几百个声音，几百个家人，一起说：欢迎回家。",
        "As you kneel, the hum becomes hundreds of voices, hundreds of kin, all saying: welcome home.")),
      C("直视它的眼睛", "Meet its eyes", "gsc_308", X({sanity: -10, set: {lookedEye: true}, taint: {tzeentch: 55}},
        "它的眼睛里有一片星空，正在慢慢靠近。在那片嗡鸣底下，还有别的什么，在很远的地方看了你一眼。",
        "In its eyes is a field of stars, slowly drawing closer. And beneath the hum, something else, very far off, glances at you.")),
      C("在心里默念帝皇之名", "Pray to the Throne in silence", "gsc_308", X({sanity: 4, hp: -6},
        "你念得很用力，太阳穴生疼。帝皇离这里太远了，可你还是念完了。",
        "You pray so hard your temples ache. The Emperor is very far from here. You finish the prayer anyway.")),
      C("按下领口的通讯珠", "Press the vox-bead in your collar", "gsc_309", O(Q({flag: "wire"}, true), X({sanity: -5},
        "通讯珠发出一声轻微的嘶响。整个洞窟，几百个脑袋，同时转向了你。",
        "The bead gives a faint hiss. Across the whole cavern, hundreds of heads turn toward you at once.")))
    ]};

  N.gsc_307 = {chapter: 3, scene: "hive_hab", speaker: TEO, time: {d: 1},
    text: L("你爬回地面时，灯已经灭了。你把自己锁在铺位里，一夜没睡。\n第二天早上，有人敲门。是提奥，端着一碗热汤。\n“没关系，”他说，“家里人什么都原谅。回家吧。”",
            "Your lamp is dead by the time you reach the surface. You lock yourself in your bunk and don't sleep.\nNext morning, a knock. Teo, holding a hot bowl of soup.\n“It's all right,” he says. “Family forgives everything. Come home.”"),
    effects: {sanity: -8, set: {fled: true}},
    choices: [
      C("接过那碗汤", "Take the soup", "gsc_310", X({hp: 5, renown: 3},
        "汤还是那个味道。你一边喝一边哭，提奥坐在床边，一直等你喝完。",
        "The soup tastes the same as ever. You cry as you drink. Teo sits on the bed and waits till you finish.")),
      C("关上门", "Shut the door", "gsc_310", X({renown: -6, sanity: -4},
        "他在门外站了很久。走的时候，把汤放在了地上。第二天，碗还温着。",
        "He stands outside a long time. When he goes, he leaves the soup on the floor. Next day the bowl is still warm."))
    ]};

  N.gsc_308 = {chapter: 3, scene: "cult_shrine", speaker: MAGUS, time: {h: 2},
    text: L("主祭扶你起来，眼里含着泪。“老祖宗喜欢你。”\n“被选中的人，会得到祂的赐福。从此你的血，就是家的血。”\n洞窟里几百双眼睛在等你回答。",
            "The Magus helps you up, tears in his eyes. “The Grandsire likes you.”\n“The chosen receive its blessing. From then on your blood is the family's blood.”\nHundreds of eyes in the cavern wait for your answer."),
    choices: [
      C("接受赐福", "Accept the blessing", "gsc_310", X({corruption: 15, renown: 10, set: {blessed: true}},
        "后来的事你记不清了。只记得很暖，然后醒来，脖子上多了一个很小的印记，再也不痛。",
        "You can't recall what came after. Only warmth; then waking with a tiny mark on your neck that never hurts again.")),
      C("“还没准备好。”", "“I'm not ready yet.”", "gsc_310", X({renown: -5, sanity: 3},
        "主祭点点头，有些失望。“家人会等，”他又说了一遍，“家人一向会等。”",
        "The Magus nods, a little disappointed. “Family waits,” he says again. “Family always waits.”"))
    ]};

  N.gsc_309 = {chapter: 3, scene: "cult_shrine", speaker: PRIMUS, time: {h: 1},
    text: L("哈斯克首领从你领口里捏出通讯珠，在两指之间碾碎。\n他没有打你。整个洞窟都在等老祖宗的意思。\n嗡鸣很久之后才响起来，像一声叹息。首领说：“原谅。一次。”",
            "Primus Hask plucks the bead from your collar and crushes it between two fingers.\nHe doesn't strike you. The whole cavern waits on the Grandsire.\nThe hum comes at last, like a sigh. The Primus says: “Forgiven. Once.”"),
    effects: {hp: -10, renown: -10, set: {forgiven: true}},
    choices: [
      C("跪下谢恩", "Kneel in thanks", "gsc_310", X({renown: 6, corruption: 5},
        "你跪下的时候，心里竟然真的觉得感激。这件事，后来让你害怕了很多年。",
        "Kneeling, you truly feel grateful. That frightens you for years afterward.")),
      C("站着，咬紧牙关", "Stay standing, jaw clenched", "gsc_310", X({sanity: -6, taint: {khorne: 40}},
        "首领盯着你的拳头看了一会儿。“很好，”他说，“那一天，用得上。”",
        "The Primus studies your fists a moment. “Good,” he says. “That will be useful on the Day.”"))
    ]};

  N.gsc_310 = {chapter: 3, scene: "hive_hab", speaker: TEO, time: {d: 20},
    text: L("那之后，你脑子里多了一阵很轻的嗡鸣。\n早上醒来，它在。下井时，它在。你再也没有一个人过。\n提奥说：“这就是家。所有人都在你心里，你也在所有人心里。”",
            "Afterward, a soft hum lives in your head.\nIt's there when you wake. There when you go down the shaft. You are never alone again.\nTeo says: “That's family. Everyone in your heart, and you in everyone's.”"),
    choices: [
      C("“我从来没这么好过。”", "“I've never been better.”", "gsc_311", X({sanity: 8, corruption: 4},
        "这是真话。你吃得饱，睡得着，有人等你回家。嗡鸣替你记着所有人的名字。",
        "It's true. You eat, you sleep, someone waits for you. The hum remembers everyone's name for you.")),
      C("去深处的湿热里睡一觉", "Sleep in the warm damp of the deep face", "gsc_311", O(Q({taint: "nurgle", min: 25}, true), X({hp: 10, sanity: 3, taint: {nurgle: 65}},
        "你在最深的掌子面睡得像回到了娘胎。醒来时身上长了一层软软的绿，你一点也不想擦掉。",
        "You sleep at the deepest face as if back in the womb. You wake furred with soft green and don't want to wipe it off."))),
      C("找个安静的角落，试着让它停下", "Find a quiet corner and try to make it stop", "gsc_311", X({sanity: -6, set: {doubt: true}},
        "你坐了一整夜。嗡鸣没有停，只是变小了，像一个家人，体贴地压低了声音。",
        "You sit all night. The hum doesn't stop. It only grows quieter, like a relative tactfully lowering their voice."))
    ]};

  N.gsc_311 = {chapter: 3, scene: "underhive", speaker: VASK, foe: "enforcer", time: {d: 9}, eventRoll: 0.4,
    text: L("执法官抓走了乔里表哥，罪名是“变异”。他的第三只手被铐在背后。\n霍林家没人哭，没人闹。大娘只是看着你：\n“家里需要一个说话管用的人。”",
            "Enforcers have taken Cousin Jory. The charge: mutation. His third arm is cuffed behind his back.\nNo one in the Hollin house weeps or shouts. Ma only looks at you:\n“The family needs someone whose word counts.”"),
    choices: [
      C("去作证：那晚他和你在一起", "Testify he was with you that night", "gsc_401", X({renown: 8, sanity: -3, set: {alibi: true}},
        "瓦斯克听完你的证词，看了你很久，签了释放令。乔里回家那天，全家人都抱了你。",
        "Vask hears you out, looks at you a long time, and signs the release. The day Jory comes home, the whole family hugs you.")),
      C("请母亲把文件弄丢", "Ask your mother to lose the paperwork", "gsc_401", O(Q({flag: "origin_warden"}, true), X({renown: 10, sanity: -5, set: {marrHelped: true}},
        "母亲什么也没问。第二天，乔里的档案不见了。她欠霍林家一条命，现在还清了。",
        "Your mother asks nothing. Next day Jory's file is gone. She owed the Hollins a life. Now it's paid."))),
      C("什么也不做", "Do nothing", "gsc_401", X({renown: -8, sanity: -4},
        "乔里一周后被放了回来，少了一只手。他对你笑，还是那么温和。这比骂你更难受。",
        "Jory comes back a week later, one arm fewer. He smiles at you, as gentle as ever. That's worse than any curse."))
    ]};

  /* ============ Chapter 4 · Generations ============ */
  N.gsc_401 = {chapter: 4, scene: "hive_hab", speaker: null, time: {y: 12},
    text: L("十二年过去了。你两鬓有了白发，霍林家又多了两百口人。\n内尔十二岁，在街上跳绳，和帝国任何一个孩子都一样，只是眼睛在灯下发紫。\n奥莎大娘快不行了。",
            "Twelve years pass. Your temples have gone grey; the Hollin house has two hundred more mouths.\nNell is twelve, skipping rope in the street like any child in the Imperium, only her eyes turn violet under lamps.\nMa Ossa is dying."),
    choices: [
      C("去陪大娘", "Go sit with Ma", "gsc_402"),
      C("带内尔去集市", "Take Nell to the market", "gsc_403")
    ]};

  N.gsc_402 = {chapter: 4, scene: "hive_hab", speaker: OSSA, time: {h: 2},
    text: L("大娘躺在床上，瘦得只剩一把骨头，可她在笑。\n“我十六岁那年，老祖宗来了。在那以前，我一个亲人都没有，冷得要命。”\n“后来，我有了你们所有人。”",
            "Ma lies in bed, nothing but bones now, but smiling.\n“I was sixteen when the Grandsire came. Before that I had no kin at all. I was so cold.”\n“After that, I had all of you.”"),
    choices: [
      C("握着她的手，直到她睡着", "Hold her hand until she sleeps", "gsc_404", X({sanity: 5, renown: 6},
        "她睡着了，再也没醒。全家人同时停下手里的事，抬起头。嗡鸣里少了一个声音。",
        "She sleeps and does not wake. The whole family stops what they're doing at once and looks up. One voice is gone from the hum.")),
      C("“大娘，你是自己选的吗？”", "“Ma, did you choose this?”", "gsc_404", X({sanity: -8, set: {askedOssa: true}},
        "她想了很久。“没人选家人，孩子。”她闭上眼，“可我爱他们。这总是真的吧？”",
        "She thinks a long time. “Nobody chooses family, child.” She closes her eyes. “But I love them. That's still true, isn't it?”")),
      C("喝下她递来的那半碗药", "Drink the half-bowl she offers you", "gsc_404", X({hp: 8, taint: {nurgle: 50}},
        "药是温的，又苦又甜。“别浪费，”她说。那之后你很久没生过病，只是总觉得有点累，有点满足。",
        "It's warm, bitter and sweet. “Don't waste it,” she says. You don't fall ill for a long time after, only feel a little tired, a little content."))
    ]};

  N.gsc_403 = {chapter: 4, scene: "hive_hab", speaker: NELL, time: {h: 2},
    text: L("集市上，国教的游行队伍走过，举着双头鹰旗。内尔躲到你身后。\n一个小孩冲着雷恩光秃秃的头皮喊：“变种！”\n雷恩只是把头巾拉紧。内尔攥着你的袖子：“他们为什么讨厌我们？”",
            "In the market an Ecclesiarchy procession passes under eagle banners. Nell hides behind you.\nA boy yells at Wren's bare scalp: “Mutie!”\nWren only pulls her scarf tighter. Nell clutches your sleeve. “Why do they hate us?”"),
    choices: [
      C("揪住那个孩子的领子", "Grab the boy by the collar", "gsc_404", X({hp: -5, renown: 6, taint: {khorne: 45}},
        "那孩子吓哭了。他父亲冲过来，你们打成一团。回家时内尔看你的眼神，亮得像看英雄。",
        "The boy bursts into tears. His father charges in and you brawl. On the way home Nell looks at you like a hero.")),
      C("“因为他们害怕。”", "“Because they're afraid.”", "gsc_404", X({sanity: 3, renown: 3},
        "内尔想了想。“那等星之子来了，他们就不用怕了，对吧？”你没有回答。",
        "Nell considers. “Then when the Star Children come, they won't need to be afraid, right?” You don't answer.")),
      C("把内尔带走，不吭声", "Lead Nell away without a word", "gsc_404", X({sanity: -3},
        "内尔一路没说话。晚上她问大人们：素脸的孩子，是不是也是变种。",
        "Nell is silent all the way. That night she asks the grown-ups whether plain-faced children are mutants too."))
    ]};

  N.gsc_404 = {chapter: 4, scene: "mine_shaft", speaker: MAGUS, time: {d: 3},
    text: L("大娘的葬礼在十三号矿井最深处。几百个家人举着灯，从第一代到第四代。\n主祭唱起挽歌，老祖宗的嗡鸣像一首摇篮曲，托着所有人。\n你从来没被这么多人爱过。",
            "Ma's funeral is held in the deepest level of Shaft Thirteen. Hundreds of kin hold lamps, first generation to fourth.\nThe Magus sings the lament; the Grandsire's hum cradles everyone like a lullaby.\nYou have never been loved by so many."),
    choices: [
      C("跟着唱，唱到忘了自己", "Sing until you forget yourself", "gsc_405", X({corruption: 5, renown: 5, taint: {slaanesh: 50}},
        "你唱哑了嗓子，也不想停。散场时你只觉得空，空得想马上再来一次。",
        "You sing yourself hoarse and still don't want to stop. When it ends you feel hollow, aching for it to start again.")),
      C("数一数这里有多少代人", "Count how many generations are here", "gsc_405", X({sanity: -5, set: {countedGenerations: true}},
        "四代，六百多人。第一代越来越少，第四代越来越多，一代比一代更像人。",
        "Four generations, more than six hundred. Fewer of the first each year, more of the fourth, each more human than the last.")),
      C("站在后面，默默送别", "Stand at the back and say goodbye quietly", "gsc_405", X({sanity: 4},
        "你想起第一次喝她的汤。那一碗是真的。不管别的是什么，那一碗是真的。",
        "You remember the first bowl of her soup. That was real. Whatever else is true, that bowl was real."))
    ]};

  N.gsc_405 = {chapter: 4, scene: "manufactorum", speaker: WREN, time: {d: 30},
    text: L("雷恩穿着行星防卫军的制服来找你，头巾塞在军帽里。\n“防卫军里有我们四十个人。执法局、矿务署、总督府，到处都有。”\n她指着一辆卡车：“这些箱子，得运进军械库。”",
            "Wren comes to you in Planetary Defence Force uniform, her scarf tucked under her cap.\n“Forty of us in the PDF. And in the precinct, the tally office, the governor's house. Everywhere.”\nShe points at a truck. “These crates have to get into the armoury.”"),
    codex: ["gsc_pdf"],
    choices: [
      C("开车过检查站", "Drive it through the checkpoint", null, O(R(0.6, "renown", "gsc_408", "gsc_407",
        RR("哨兵挥手放行，左手手套里好像不止五根手指。箱子进了军械库，雷恩冲你眨眨眼。", "The sentry waves you on; his gloved left hand seems to hold more than five fingers. The crates reach the armoury. Wren winks.",
           "执法官掀开了油布。你看见他的眼睛先睁大，然后举起了枪。", "An enforcer lifts the tarp. His eyes widen first; then his gun comes up.")), {effects: {set: {smuggler: true}}})),
      C("“我不干。”", "“I won't do it.”", "gsc_408", X({renown: -8},
        "雷恩没生气，只是有点伤心。“没关系，”她说，“我找别人。”第二天，你的好班没了。",
        "Wren isn't angry, only a little hurt. “That's fine,” she says. “I'll find someone else.” Next day, your good shifts are gone."))
    ]};

  N.gsc_407 = {chapter: 4, scene: "underhive", speaker: VASK, time: {h: 6},
    text: L("瓦斯克老了，却更硬了。他把你按在审讯椅上。\n“二十箱军用炸药。谁给你的？说出名字，你还能回家。”\n墙上的钟走得很慢。",
            "Vask is older now, and harder. He pins you to the interrogation chair.\n“Twenty crates of military explosive. Who gave them to you? Names, and you go home.”\nThe wall clock ticks slowly."),
    effects: {hp: -12},
    choices: [
      C("说出雷恩的名字", "Give him Wren's name", "gsc_408", X({renown: -20, sanity: -8, set: {traitor: true, wronged_wren: true}},
        "你说出了雷恩的名字。瓦斯克放了你，抓人的却扑了空：嗡鸣早一步传开了。那一夜，几百个声音同时沉默。",
        "You say Wren's name. Vask lets you go, but the arrest team finds nothing: the hum spread it first. That night hundreds of voices fall silent at once.")),
      C("咬紧牙关，一个字也不说", "Clench your teeth. Not one word", "gsc_408", X({hp: -10, renown: 10},
        "三天后，一个看守打开了门，左手戴着手套。“家里人让我来接你。”",
        "Three days later a guard unlocks the door, left hand gloved. “The family sent me for you.”"))
    ]};

  N.gsc_408 = {chapter: 4, scene: "hive_hab", speaker: BRANN, time: {d: 10},
    text: L("老布兰在工棚里拦住你。他不去霍林家，也从不提霍林家。\n“我表亲在赫斯珀种麦子。那儿也有一大家子，紫眼睛，笑得一模一样。”\n“今年春天，天变紫了。上个月，帝国把整颗星烧了。”",
            "Old Brann stops you in the barracks. He doesn't go to the Hollins, and never mentions them.\n“My cousin farmed wheat on Hesper. There was a big family there too. Violet eyes, all smiling the same.”\n“This spring the sky turned purple. Last month, the Imperium burned the whole world.”"),
    codex: ["place_hesper"],
    choices: [
      C("“天变紫以后，发生了什么？”", "“What happened when the sky turned purple?”", "gsc_409", X({sanity: -5, set: {heardBrann: true}},
        "布兰把一块旧数据板塞给你。“我表亲最后寄来的。我不敢看第二遍。”",
        "Brann presses an old data-slate on you. “The last thing my cousin sent. I couldn't look twice.”")),
      C("把他的话告诉家里人", "Tell the family what he said", "gsc_409", X({renown: 6, sanity: -4, set: {soldBrann: true, wronged_brann: true}},
        "你把布兰的话告诉了大人们。他们谢谢你。一个星期后，布兰的铺位空了，被子叠得整整齐齐。",
        "You repeat Brann's words to the elders. They thank you. A week later his bunk is empty, the blanket folded neatly.")),
      C("陪他去黑肺病房坐坐，那里暖和", "Sit with him in the warm black-lung ward", "gsc_409", O(Q({taint: "nurgle", min: 30}, true), X({hp: 5, sanity: 3, taint: {nurgle: 60}},
        "病房里又暖又潮，咳嗽声像摇篮曲。布兰说了什么，你没听进去。你睡得很香，醒来身上一股甜味。",
        "The ward is warm and damp; the coughing is a lullaby. Whatever Brann says, you don't hear it. You sleep soundly and wake smelling sweet."))),
      C("“老头子，少说两句。”", "“Keep it to yourself, old man.”", "gsc_409", X({sanity: 3},
        "布兰点点头，好像早料到了。“那你就别抬头看天，”他说，“能不看就别看。”",
        "Brann nods as if he expected it. “Then don't look up,” he says. “Not if you can help it.”"))
    ]};

  N.gsc_409 = {chapter: 4, scene: "gsc_chapel", speaker: MAGUS, time: {d: 15}, eventRoll: 0.4,
    text: L("主祭站在圣像前，声音里有压不住的狂喜。\n“老祖宗感觉到了：星之子已经在路上。他们听见了我们。”\n“从今夜起，我们要每晚歌唱，为他们指路。”",
            "The Magus stands before the icon, rapture breaking through his voice.\n“The Grandsire feels it: the Star Children are on their way. They have heard us.”\n“From tonight we sing every night, to light their path.”"),
    choices: [
      C("和大家一起欢呼", "Cheer with everyone", "gsc_501", X({renown: 5, corruption: 3},
        "几百人一起欢呼，屋顶的灰簌簌往下掉。内尔骑在雷恩肩上，笑得最响。",
        "Hundreds cheer at once; dust sifts from the ceiling. Nell rides on Wren's shoulders, laughing loudest.")),
      C("看着人群，想起布兰的话", "Watch the crowd and remember Brann", "gsc_501", X({sanity: -4},
        "所有人都在笑，笑得一模一样。你也在笑。你花了好一会儿才发现。",
        "Everyone is smiling, all the same smile. So are you. It takes you a while to notice."))
    ]};

  /* ============ Chapter 5 · The Call ============ */
  N.gsc_501 = {chapter: 5, scene: "gsc_chapel", speaker: MAGUS, time: {y: 3},
    grudgeLine: {npc: "brann", text: L("歌声里多了一个老人，是布兰。他笑得和所有人一样，眼睛却一直盯着你。", "Among the singers is an old man: Brann. He smiles like everyone else, but his eyes never leave you.")},
    text: L("三年来，每天夜里，粮仓地下都在唱。几百个声音合成一个，从地底冲上天空。\n主祭站在中间，眼睛亮得像两盏紫灯。\n唱完以后，你的头总要疼到天亮。",
            "For three years, every night, the vault under the grain store sings. Hundreds of voices become one and rush up from the deep into the sky.\nThe Magus stands at the centre, eyes lit like two violet lamps.\nAfterward your head aches until dawn."),
    codex: ["gsc_broodmind"],
    choices: [
      C("放开嗓子，用心去唱", "Sing with your whole heart", "gsc_502", O(X({corruption: 8, renown: 5, taint: {slaanesh: 50}},
        "你唱到浑身发抖，觉得自己大得能装下整片天空。那一刻太美了，美得什么都不再重要。",
        "You sing till you shake, vast enough to hold the whole sky. The moment is so beautiful that nothing else matters."),
        G("brann", "你出卖过布兰。他就站在你身边，每个音都像在念你的名字。", "You gave Brann up. He stands beside you, and every note sounds like your name.", 0, {sanity: -4}))),
      C("跟着哼，心里想着别的事", "Hum along, thinking of other things", "gsc_502", O(X({sanity: -5},
        "你在心里背矿井的层号，一层一层。嗡鸣从层号之间的缝里钻进来。",
        "You recite shaft levels in your head, one by one. The hum seeps in between the numbers."),
        G("brann", "你出卖过布兰。他就站在你身边，每个音都像在念你的名字。", "You gave Brann up. He stands beside you, and every note sounds like your name.", 0, {sanity: -4}))),
      C("唱下去，再也不想停", "Sing on. Never stop", "gsc_502", O(Q({taint: "slaanesh", min: 30}, true), X({sanity: 4, corruption: 4, taint: {slaanesh: 65}},
        "天亮了，别人都散了，你还在唱。那种被几百颗心一起爱着的感觉，你一刻也舍不得放下。",
        "Dawn comes and the others leave, and you are still singing. To be loved by hundreds of hearts at once: you can't let go of it for a moment."))),
      C("用蜡塞住耳朵", "Stop your ears with wax", "gsc_502", X({sanity: 5, renown: -5, set: {waxEars: true}},
        "没用。歌声不走耳朵。可那一点点蜡，让你觉得自己还守着一扇门。",
        "Useless. The song doesn't come through the ears. But that little wax makes you feel you're still guarding one door."))
    ]};

  N.gsc_502 = {chapter: 5, scene: "hive_spire", speaker: ASTRO, foe: null, time: {d: 20},
    text: L("矿区星语塔的星语者疯了。雷耶斯中尉带你上塔，帮忙按住他。\n老人瞎眼流着血：“有影子……泰拉听不见了，什么都听不见了。”\n“它在吃光，”他说，“它在吃所有的声音。”",
            "The mining district's astropath has gone mad. Lieutenant Reyes takes you up the tower to help hold him down.\nThe old man's blind eyes are bleeding. “A shadow... Terra can't hear me. Nothing can.”\n“It's eating the light,” he says. “It's eating every voice.”"),
    codex: ["xenos_shadow_in_warp"],
    choices: [
      C("握住他的手，听他说完", "Hold his hand and hear him out", "gsc_503", X({sanity: -6, set: {astropath: true}, taint: {tzeentch: 50}},
        "他看见了很多东西：紫色的天，下雨一样落下的星星，还有一行很小的、闪着蓝光的字，不知是谁写的。",
        "He has seen so much: a purple sky, stars falling like rain, and one small line of blue-lit words, written by no one he knows.")),
      C("读他眼里那行蓝色的字", "Read the blue line in his eyes", "gsc_503", O(Q({taint: "tzeentch", min: 30}, true), X({sanity: -5, renown: 3, taint: {tzeentch: 65}},
        "那行字是写给你的，只给你：“影子总有缝。”老人笑了，好像终于把信送到了。",
        "The line is for you, only you: THE SHADOW ALWAYS HAS A CRACK. The old man smiles, as if a letter has finally been delivered."))),
      C("给他注射镇静剂", "Give him a sedative", "gsc_503", X({renown: 3, sanity: 3},
        "他慢慢睡着了，嘴里还在念：“影子……影子……”雷耶斯中尉看着窗外，脸色很难看。",
        "He drifts off still murmuring, “Shadow... shadow...” Lieutenant Reyes stares out the window, grim.")),
      C("退到门口", "Back away to the door", "gsc_503", X({sanity: -3},
        "你脑子里的嗡鸣忽然很高兴，像在说：对，就是这样。你一点也不高兴。",
        "The hum in your head is suddenly delighted, as if saying: yes, exactly so. You are not delighted at all."))
    ]};

  N.gsc_503 = {chapter: 5, scene: "hive_spire", speaker: REYES, time: {d: 30},
    text: L("一个月了，没有一艘船来。星港里只剩“忍耐号”，一艘去奥雷克斯二号的老矿船。\n雷耶斯中尉站在塔顶：“没有船，没有消息。外面出事了。”\n她看了你一眼：“你家里人，怎么一点也不慌？”",
            "A month, and not one ship has come. Only the Patient Mercy is left at port, an old ore-hauler bound for Aurex Secundus.\nLieutenant Reyes stands at the tower top. “No ships, no news. Something's wrong out there.”\nShe glances at you. “Why aren't your people worried at all?”"),
    choices: [
      C("去找矿船船长打听舱位", "Ask the hauler captain about berths", "gsc_504", X({renown: -3, set: {knowsHauler: true}},
        "船长是个独眼老头。“我这船能装四十个人，不算矿石。”他眯起眼，“等谁？”",
        "The captain is a one-eyed old man. “She'll take forty people, not counting ore.” He squints. “Waiting for someone?”")),
      C("“我们信帝皇。”", "“We trust the Emperor.”", "gsc_504", X({renown: 4},
        "雷耶斯中尉看了你很久。“哪一个？”她问，然后转身下了塔。",
        "Reyes looks at you a long while. “Which one?” she asks, and goes down the stairs.")),
      C("告诉她：快走", "Tell her: get out", "gsc_504", X({sanity: 3, renown: -5, set: {warnedReyes: true}},
        "她没有问为什么。她只是把一张星港通行证塞进你手里。“你也是。”",
        "She doesn't ask why. She just presses a starport pass into your hand. “You too.”"))
    ]};

  N.gsc_504 = {chapter: 5, scene: "hive_hab", speaker: NELL, time: {d: 5},
    text: L("内尔十五岁了。她半夜来敲你的门，光着脚。\n“我又梦见星之子了。他们好大，好饿。”\n“他们饿成那样，”她小声问，“也是爱吗？”",
            "Nell is fifteen. She knocks on your door at midnight, barefoot.\n“I dreamed of the Star Children again. They're so big. So hungry.”\n“If they're that hungry,” she whispers, “is it still love?”"),
    choices: [
      C("“是爱。睡吧。”", "“It's love. Go to sleep.”", "gsc_505", X({corruption: 3, renown: 4},
        "她点点头，回去睡了。你一夜没合眼。",
        "She nods and goes back to bed. You don't sleep at all.")),
      C("“把你的梦全讲给我听。”", "“Tell me the whole dream.”", "gsc_505", X({sanity: -5, set: {nellDream: true}},
        "她讲了很久：天上的嘴，落下的牙，所有人都在笑，然后都不见了。她讲完就哭了。",
        "She talks a long time: mouths in the sky, falling teeth, everyone smiling, then everyone gone. When she finishes, she cries.")),
      C("抱抱她，什么也不说", "Hug her and say nothing", "gsc_505", X({sanity: 4},
        "她在你怀里慢慢不抖了。你闻到她头发上有矿灰和肥皂的味道，像任何一个孩子。",
        "Slowly she stops shaking in your arms. Her hair smells of ore dust and soap, like any child's."))
    ]};

  N.gsc_505 = {chapter: 5, scene: "underhive", speaker: null, time: {d: 2},
    text: L("你睡不着。布兰的话、星语者的话、内尔的梦，在你脑子里绕成一团。\n嗡鸣轻轻地劝你：别想了，回家吧。\n可你想知道，星之子到底是什么。",
            "You can't sleep. Brann's words, the astropath's, Nell's dream, all tangle in your head.\nThe hum gently coaxes: stop thinking. Come home.\nBut you want to know what the Star Children really are."),
    choices: [
      C("打开布兰给你的数据板", "Open Brann's data-slate", "gsc_506", Q({flag: "heardBrann"}, true)),
      C("回想星语者看见的东西", "Go back over what the astropath saw", "gsc_506", O(Q({flag: "astropath"}, true), X({sanity: -3},
        "紫色的天，下雨一样的星星。你把他的每个字都写了下来，拼成了一幅画。",
        "Purple sky, stars falling like rain. You write down his every word until they make a picture."))),
      C("去矿务署的旧档案室翻", "Dig through the tally-office archives", null, R(0.4, "sanity", "gsc_506", "gsc_510",
        RR("在一堆积灰的报告底下，你找到了一张赫斯珀的照片。", "Beneath a heap of dusty reports, you find a pict from Hesper.",
           "你翻了一整夜，什么也没找到。嗡鸣陪着你，你梦见紫光像一双双手，把家人接走。", "You search all night and find nothing. The hum lulls you; you dream of violet light like hands, lifting the family away."))),
      C("别想了，回家", "Stop thinking. Go home", "gsc_510", X({corruption: 6, renown: 3},
        "你做了一个很甜的梦：紫光从天上落下，把所有家人都抱起来。醒来时满脸是泪，笑着的。",
        "You dream sweetly: violet light falls and lifts every member of the family. You wake with tears on your face, smiling."))
    ]};

  N.gsc_506 = {chapter: 5, scene: "underhive", speaker: STARS, foe: "gaunt", time: {h: 2},
    text: L("赫斯珀，最后的画面：紫色的天，无数光点落下。\n一大家子人站在麦田里迎接，举着四只手的帝皇像。\n然后，从天上下来的东西，有太多的腿、太多的牙。它们没有停。家人们也没有逃。",
            "Hesper, the last images: a purple sky, countless lights descending.\nA whole family stands in the wheat to greet them, holding up the four-armed icon.\nThen what came down: too many legs, too many teeth. They did not stop. The family did not run."),
    effects: {sanity: -15, set: {knowsTruth: true}},
    codex: ["xenos_tyranid", "gsc_star_children"],
    choices: [
      C("看照片底下那行蓝色的小字", "Read the small blue line beneath the pict", "gsc_510", O(Q({taint: "tzeentch", min: 40}, true), X({sanity: -6, renown: 4, taint: {tzeentch: 60}},
        "那行字不在照片上，在你眼睛里：“他们是饭。你不必是。”你笑了，笑得不像任何一个家人。",
        "The line isn't on the pict but in your eyes: THEY ARE THE MEAL. YOU NEED NOT BE. You smile, unlike any of the family."))),
      C("去告诉主祭", "Go tell the Magus", "gsc_508"),
      C("去告诉提奥", "Go tell Teo", "gsc_509"),
      C("谁也不说", "Tell no one", "gsc_510", X({sanity: -5, set: {secretTruth: true}},
        "你把数据板藏进矿灯的电池仓里。那天晚饭，你笑得和所有人一模一样。",
        "You hide the slate in your lamp's battery case. At supper you smile exactly like everyone else."))
    ]};

  N.gsc_508 = {chapter: 5, scene: "gsc_chapel", speaker: MAGUS, time: {h: 3},
    text: L("主祭看完了数据板，眼里涌出泪来。是喜悦的泪。\n“你看见了吗？他们被接走了，变成了星之子的一部分。还有比这更深的爱吗？”\n他把手按在你额头上：“别怕。我帮你看清楚。”",
            "The Magus finishes the slate, and tears spring to his eyes. Tears of joy.\n“Don't you see? They were taken up, made part of the Star Children. Is there any deeper love?”\nHe lays a hand on your brow. “Don't be afraid. I'll help you see clearly.”"),
    choices: [
      C("让他帮你“看清楚”", "Let him help you “see clearly”", "gsc_510", X({corruption: 10, sanity: 5, set: {knowsTruth: false, mended: true}},
        "他的手很凉。你脑子里有什么东西被轻轻抚平了。数据板上画的，是升天。一定是。",
        "His hand is cool. Something in your mind is smoothed flat. The slate showed an ascension. It must have.")),
      C("咬紧牙关，守住你看见的", "Grit your teeth. Hold on to what you saw", null, R(0.45, "sanity", "gsc_510", "gsc_510",
        RR("你把那幅画死死抓在脑子里。他的手指滑开了，看上去有点惊讶。", "You clutch that image in your mind. His fingers slide off. He looks a little surprised.",
           "嗡鸣涌进来，那幅画开始变得柔和、美丽……你咬破了舌头，只留住了一半。", "The hum floods in; the image softens, grows beautiful... You bite your tongue and keep half of it.")))
    ]};

  N.gsc_509 = {chapter: 5, scene: "hive_hab", speaker: TEO, time: {h: 3},
    text: L("提奥看完数据板，坐了很久。他老了，手背上的硬皮更厚了。\n“如果这是真的，”他说，“那我们这几十年……”\n他没说完。远处礼拜堂又开始唱了，他的嘴唇不自觉地跟着动。",
            "Teo finishes the slate and sits a long time. He's old now; the hard skin on his hands has thickened.\n“If this is true,” he says, “then all these decades...”\nHe doesn't finish. Far off, the chapel begins to sing, and his lips move along without meaning to."),
    effects: {sanity: -5},
    choices: [
      C("“帮我救孩子们。”", "“Help me save the children.”", "gsc_510", O(X({renown: 4, set: {teoKnows: true}},
        "提奥抹了把脸。“孩子们，”他重复，像抓住一根绳子，“对。先救孩子们。”",
        "Teo wipes his face. “The children,” he repeats, like grabbing a rope. “Yes. The children first.”"),
        G("teo", "提奥想起你当年对他做的事，迟迟才点头。", "Teo remembers what you once did to him, and is slow to nod.", 0, {sanity: -4}))),
      C("“忘了吧。”", "“Forget it.”", "gsc_510", X({sanity: -4},
        "他点点头，好像松了口气。第二天他照常唱歌，只是唱错了一句。",
        "He nods, almost relieved. Next day he sings as always, only he gets one line wrong."))
    ]};

  N.gsc_510 = {chapter: 5, scene: "cult_shrine", speaker: PRIMUS, time: {d: 6}, eventRoll: 0.4,
    text: L("哈斯克首领召集了所有能扛枪的人。他也老了，骨棱上全是疤。\n“第一道紫光出现的时候，就是那一天。”\n“执法局、星港、总督府、防卫军营地。每个人都有位置。”",
            "Primus Hask gathers everyone who can carry a gun. He's old too, his ridges crossed with scars.\n“When the first violet light shows, that is the Day.”\n“Precinct, starport, governor's house, PDF barracks. Everyone has a place.”"),
    choices: [
      C("去执法局的爆破组", "Join the precinct demolition team", "gsc_601", X({renown: 4, set: {teamPrecinct: true}},
        "首领把一卷引线拍在你手里。“你熟悉那栋楼。”",
        "The Primus slaps a coil of fuse into your hand. “You know that building.”")),
      C("去星港的夺港组", "Join the starport team", "gsc_601", X({renown: 4, set: {teamPort: true}},
        "“星港，”首领点头，“守住矿船，谁也不准走。”",
        "“The starport,” the Primus nods. “Hold the hauler. Nobody leaves.”")),
      C("“让我守着孩子们。”", "“Let me guard the children.”", "gsc_601", X({renown: -2, set: {teamChildren: true}},
        "首领盯了你一会儿。“孩子们不需要守，”他说，“不过，随你。”",
        "The Primus stares a moment. “The children don't need guarding,” he says. “But as you like.”"))
    ]};

  /* ============ Chapter 6 · The Inquisitor ============ */
  N.gsc_601 = {chapter: 6, scene: "hive_hab", speaker: THORNE, foe: "guardsman", time: {d: 40},
    text: L("一艘黑色的船降落了。索恩审判官带着风暴兵封锁了矿区。\n每个路口都设了检查站：一根针，一滴血，一台会变色的仪器。\n“只是例行检查，”审判官对人群微笑，“帝皇保佑纯洁的人。”",
            "A black ship lands. Inquisitor Thorne and his storm-troopers seal off the mining district.\nEvery junction has a checkpoint: a needle, a drop of blood, a machine that changes colour.\n“Routine screening,” the Inquisitor smiles at the crowd. “The Emperor protects the pure.”"),
    codex: ["imp_inquisition"],
    choices: [
      C("排队验血", "Queue for the blood test", "gsc_602", Q({notFlag: "blessed"}, true)),
      C("排队验血", "Queue for the blood test", "gsc_603", O(Q({flag: "blessed"}, true), X({hp: -5},
        "针扎进去，仪器的灯慢慢变成了紫色。两个风暴兵同时按住了你的肩膀。",
        "The needle goes in; the machine's light slowly turns violet. Two storm-troopers seize your shoulders at once."))),
      C("用你的眼神，让检验员看错", "Use your gaze to make the tester misread", "gsc_602", O(Q({flag: "origin_kin"}, true), X({corruption: 6},
        "检验员眨了眨眼，在表格上打了个勾。他会头疼一个星期，却永远不知道为什么。",
        "The tester blinks and ticks the form. He'll have a headache for a week and never know why."))),
      C("从废弃巷道绕过去", "Go round through the abandoned galleries", "gsc_606", X({hp: -5, renown: 4},
        "巷道里挤满了逃出来的家人。乔里用仅剩的两只手抱着两个孩子：“首领说，等不了了。”",
        "The galleries are crammed with fleeing kin. Jory holds two children in his remaining arms. “The Primus says we can't wait.”"))
    ]};

  N.gsc_602 = {chapter: 6, scene: "hive_hab", speaker: NELL, time: {h: 1},
    text: L("你的血是红的，仪器亮起绿灯。你松了口气，回过头。\n内尔排在你后面，第五个。她冲你笑了笑，脸色发白。\n第四代也是家人。仪器认得出来。",
            "Your blood runs red; the machine shows green. You breathe out and look back.\nNell is in the queue behind you, fifth in line. She smiles at you, pale.\nFourth generation is family too. The machine will know."),
    choices: [
      C("趁乱换掉她的血样", "Swap her sample in the confusion", null, R(0.5, "renown", "gsc_605", "gsc_603",
        RR("你的手比你想的更稳。表兄弟们在后面同时咳嗽，正好挡住了视线。", "Your hands are steadier than you thought. Behind you, the cousins all cough at once, blocking the view.",
           "一只戴手套的手按住了你的手腕。“有意思，”审判官说。", "A gloved hand closes on your wrist. “Interesting,” says the Inquisitor."))),
      C("制造混乱，让她跑", "Cause a scene so she can run", "gsc_605", X({hp: -12, renown: 6},
        "你掀翻了检验台。枪托砸在你背上，可内尔已经钻进了人群。",
        "You overturn the testing table. A rifle butt hits your back, but Nell has already slipped into the crowd.")),
      C("转过头，不看", "Turn away. Don't look", "gsc_606", X({renown: -15, sanity: -10, set: {nellTaken: true, wronged_nell: true}},
        "你听见仪器响了一声，听见有人喊“内尔”。你没有回头。嗡鸣里有几百个声音在哭。",
        "You hear the machine chime, hear someone shout “Nell!” You don't turn. In the hum, hundreds of voices are weeping."))
    ]};

  N.gsc_603 = {chapter: 6, scene: "underhive", speaker: THORNE, time: {h: 6},
    text: L("审讯室没有窗。索恩审判官摘下手套，坐在你对面。\n“我对你没兴趣。我要的是那个‘老祖宗’。”\n“告诉我它在哪儿，你可以活下来。不告诉我，这颗星球都活不下来。”",
            "The interrogation cell has no window. Inquisitor Thorne removes his gloves and sits opposite.\n“You don't interest me. I want the ‘Grandsire.’”\n“Tell me where it is and you live. Don't, and this whole world doesn't.”"),
    choices: [
      C("答应他", "Agree", "gsc_607", X({renown: -10, set: {deal: true}},
        "他点点头，好像早就知道。你的嗡鸣里，有一个很老的声音，叹了一口气。",
        "He nods as though he knew. In your hum, one very old voice sighs.")),
      C("给他一个假地点", "Give him a false location", null, R(0.5, "sanity", "gsc_607", "gsc_606",
        RR("他信了，至少看起来信了。“很好，”他说，“我们会再谈。”", "He believes you, or seems to. “Good,” he says. “We'll talk again.”",
           "他听完就笑了。“十三号矿井早就封了？”他起身，“那我们就去看看。”", "He laughs. “Shaft Thirteen, sealed long ago?” He stands. “Then let's go and look.”"))),
      C("“我没什么可说的。”", "“I have nothing to say.”", null, R(0.5, "hp", "gsc_606", "gsc_end_purged",
        RR("夜里，墙外响起爆炸。一只三只手的手臂把你从废墟里拖了出去。", "That night the wall blows in. A three-armed figure drags you out through the rubble.",
           "审判官戴回手套。“可惜，”他说，在一张名单上划了一笔。", "The Inquisitor pulls his gloves back on. “A pity,” he says, and marks a line on a list.")))
    ]};

  N.gsc_605 = {chapter: 6, scene: "hive_hab", speaker: NELL, time: {h: 4},
    text: L("那天晚上，霍林家的人一个接一个地来抱你。\n内尔坐在你旁边，靠着你的肩膀。\n“我梦见你了，”她说，“梦里星星下来的时候，你拉着我的手在跑。”",
            "That evening the Hollins come one by one to hold you.\nNell sits beside you, her head on your shoulder.\n“I dreamed about you,” she says. “In the dream, when the stars came down, you were holding my hand and running.”"),
    effects: {renown: 10, sanity: 5, set: {savedNell: true}},
    choices: [
      C("“我会的。”", "“I will.”", "gsc_606", X({set: {promisedNell: true}},
        "她笑了，像个普通的女孩。你在心里把这句话又说了一遍。",
        "She smiles like any ordinary girl. You say it again, silently, to yourself."))
    ]};

  N.gsc_606 = {chapter: 6, scene: "cult_shrine", speaker: PRIMUS, time: {d: 2},
    text: L("哈斯克首领站在洞窟中央。“审判官逼我们出手。等不到紫光了。”\n“明天黎明，就是那一天。”\n几千个家人同时握紧了武器。嗡鸣像一声战鼓。",
            "Primus Hask stands at the centre of the cavern. “The Inquisitor forces our hand. We can't wait for the violet light.”\n“Tomorrow at dawn, it's the Day.”\nThousands of kin grip their weapons at once. The hum is a war-drum."),
    codex: ["gsc_ascension"],
    choices: [
      C("站到家人中间", "Stand among the family", "gsc_701", X({renown: 5, corruption: 3},
        "有人把一支枪塞进你手里，有人拍了拍你的背。你是他们的一部分。这是真的。",
        "Someone puts a gun in your hands; someone pats your back. You are part of them. That is true.")),
      C("“星之子会吃掉我们所有人！”", "“The Star Children will eat us all!”", "gsc_608", Q({flag: "knowsTruth"}, true)),
      C("趁乱去找审判官", "Slip away to find the Inquisitor", "gsc_607", X({renown: -8, sanity: -5, set: {deal: true}},
        "你从通风井爬上去。嗡鸣在你身后，像一大家子人在喊你的名字。",
        "You climb out through a ventilation shaft. The hum follows, like a whole family calling your name."))
    ]};

  N.gsc_607 = {chapter: 6, scene: "barracks", speaker: THORNE, time: {h: 5},
    text: L("审判官在地图上画了一个圈。“邪教一起事，老祖宗就会出巢。到时候，杀了它。”\n“它是灯塔。灯塔一灭，星语者就能重新喊出声。”\n“至于你的‘家人’，”他顿了顿，“我不承诺什么。”",
            "The Inquisitor circles a spot on the map. “When the cult rises, the Grandsire leaves its lair. Then we kill it.”\n“It's a beacon. Kill the beacon and the astropaths can scream again.”\n“As for your ‘family,’” he pauses, “I promise nothing.”"),
    codex: ["xenos_genestealer"],
    choices: [
      C("“我带你去。”", "“I'll take you there.”", "gsc_701", X({renown: -5, set: {thornePlan: true, teamPrecinct: true}},
        "他递给你一把小手枪。“它的眼睛，”他说，“别看它的眼睛。”",
        "He hands you a small pistol. “Its eyes,” he says. “Don't look into its eyes.”")),
      C("“先答应我：放过孩子们。”", "“Promise me first: spare the children.”", "gsc_701", X({sanity: -3, set: {thornePlan: true, teamPrecinct: true, askedMercy: true}},
        "审判官沉默了很久。“验过血的，可以上船。”这已经是他能给的全部。",
        "The Inquisitor is silent a long time. “Those whose blood tests clean may board.” It's all he has to give."))
    ]};

  N.gsc_608 = {chapter: 6, scene: "cult_shrine", speaker: PRIMUS, time: {h: 1},
    text: L("整个洞窟安静下来。提奥也在人群里，几千双眼睛看着你。\n你把赫斯珀的画面说了出来：紫色的天，迎接的家人，没有停下的牙。\n哈斯克首领慢慢走到你面前。",
            "The whole cavern goes still. Teo is in the crowd too, among thousands of eyes on you.\nYou tell them about Hesper: the purple sky, the family welcoming, the teeth that did not stop.\nPrimus Hask walks slowly up to you."),
    choices: [
      C("迎着他的目光", "Meet his gaze", null, O(R(0.45, "renown", "gsc_609", "gsc_610",
        RR("首领没有说话。人群里，提奥走了出来，站到你身边。然后，又有几个人。", "The Primus says nothing. From the crowd Teo steps out and stands beside you. Then a few more.",
           "首领只说了一个字：“病。”几只手同时抓住了你。", "The Primus says one word: “Sick.” Several hands seize you at once.")),
        G("teo", "提奥没忘你对他做的事，站在人群里，迟迟没有动。", "Teo has not forgotten what you did to him. He stands in the crowd and does not move.", -0.15)))
    ]};

  N.gsc_609 = {chapter: 6, scene: "cult_shrine", speaker: TEO, time: {h: 3},
    text: L("首领没有抓你，也没有信你。他只是转身走了。\n散会后，提奥和雷恩在黑暗里找到你。\n“我们不信星之子会吃我们，”雷恩说，“可万一呢？孩子们，得有人带走。”",
            "The Primus neither seizes you nor believes you. He simply turns away.\nAfterward, Teo and Wren find you in the dark.\n“We don't believe the Star Children would eat us,” Wren says. “But what if? Someone has to get the children out.”"),
    effects: {renown: 5},
    choices: [
      C("“矿船，‘忍耐号’。”", "“The hauler. The Patient Mercy.”", "gsc_701", O(X({set: {arkPlan: true}},
        "雷恩点头：“星港是我们的人在守。我去安排。”提奥只是握紧了你的手。",
        "Wren nods. “Our people are holding the port. I'll arrange it.” Teo only grips your hand."),
        G("wren", "雷恩没忘是谁报了她的名字，答话时没有看你。", "Wren has not forgotten who gave up her name. She does not look at you as she answers.", 0, {sanity: -4})))
    ]};

  N.gsc_610 = {chapter: 6, scene: "cult_shrine", speaker: MAGUS, time: {h: 4},
    text: L("他们把你带到主祭面前。主祭很温柔，像在给发烧的孩子擦汗。\n“你病了，”他说，“病会让人看见可怕的东西。我来治好你。”\n嗡鸣变得很响，响得像要把你从里面冲走。",
            "They bring you before the Magus. He is gentle, like someone wiping a feverish child's brow.\n“You're sick,” he says. “Sickness shows people terrible things. Let me heal you.”\nThe hum swells, loud enough to wash you out from the inside."),
    effects: {sanity: -15, corruption: 8},
    choices: [
      C("让他治", "Let him heal you", "gsc_end_corrected", X({corruption: 10},
        "他的手指按在你太阳穴上。你看见的那些可怕的东西，一样一样，变得很美。",
        "His fingers press your temples. The terrible things you saw become, one by one, beautiful.")),
      C("死死抓住那幅画面", "Cling to that image", null, R(0.4, "sanity", "gsc_701", "gsc_end_corrected",
        RR("主祭的手松开了。“明天，”他疲惫地说，“明天你会自己看见。”", "The Magus lets go. “Tomorrow,” he says, weary. “Tomorrow you'll see for yourself.”",
           "画面一点一点褪色。最后剩下的，只有一片温暖的紫。", "The image fades piece by piece. All that remains is a warm violet.")))
    ]};

  /* ============ Chapter 7 · The Day of Ascension ============ */
  N.gsc_701 = {chapter: 7, scene: "burning_city", speaker: PRIMUS, foe: "gsc_neophyte", time: {h: 10},
    text: L("黎明。整座矿城同时爆炸。\n防卫军的炮口调转了方向，执法局的大门从里面打开，矿井里涌出成千上万的家人。\n几十年的耐心，在一个早上全部用完。",
            "Dawn. The whole mining city explodes at once.\nPDF guns swing round, the precinct gates open from inside, and tens of thousands of kin pour from the shafts.\nDecades of patience, spent in a single morning."),
    effects: {sanity: -5},
    codex: ["gsc_ascension"],
    choices: [
      C("去执法局", "To the precinct", "gsc_702", Q({flag: "teamPrecinct"}, true)),
      C("去星港，守住矿船", "To the starport. Hold the hauler", "gsc_703", Q({flag: "teamPort"}, true)),
      C("往打得最凶的地方冲", "Charge where the fighting is thickest", "gsc_702", O(Q({taint: "khorne", min: 40}, true), X({hp: -10, renown: 5, taint: {khorne: 60}},
        "你不记得自己冲过了几条街。只记得每一步都踩在鼓点上，鼓声越来越响。",
        "You don't remember how many streets you charge through. Only that every step lands on a drumbeat, louder and louder."))),
      C("跑回霍林家", "Run back to the Hollin house", "gsc_704")
    ]};

  N.gsc_702 = {chapter: 7, scene: "burning_city", speaker: VASK, time: {h: 1},
    text: L("执法局烧着了。瓦斯克执法官靠在台阶上，腿上全是血，手里还握着枪。\n他认出了你，竟然笑了一下。\n“我就知道，”他说，“我谁也信不过。”",
            "The precinct is burning. Captain Vask slumps on the steps, legs soaked in blood, still gripping his gun.\nHe recognises you, and actually smiles.\n“I knew it,” he says. “Couldn't trust anyone.”"),
    choices: [
      C("把他拖出火场", "Drag him out of the fire", "gsc_705", X({hp: -10, renown: -5, set: {savedVask: true}},
        "他很重，一路骂你。到了安全的地方，他闭上眼：“谢谢。别以为这能抵账。”",
        "He's heavy and curses you all the way. Somewhere safe, he closes his eyes. “Thanks. Doesn't square anything.”")),
      C("点燃引线", "Light the fuse", "gsc_705", X({renown: 6, sanity: -8, taint: {khorne: 45}},
        "火花沿着引线跑过去。楼塌下来的时候，你听见自己在喊，喊得比爆炸还响。",
        "The spark races along the fuse. As the building falls you hear yourself screaming, louder than the blast.")),
      C("冲进去找母亲", "Run inside to find your mother", "gsc_705", O(Q({flag: "origin_warden"}, true), X({hp: -12, set: {savedMarr: true}},
        "你在档案室找到她，她正把失踪报告一份份往火里扔。“别让他们知道是谁写的，”她说。",
        "You find her in the records room, feeding missing-persons reports to the fire. “Don't let them learn who wrote these,” she says.")))
    ]};

  N.gsc_703 = {chapter: 7, scene: "hive_spire", speaker: REYES, time: {h: 1},
    text: L("星港的防卫军不肯投降。雷耶斯中尉守在“忍耐号”的舷梯下。\n“我不知道你们是什么，”她喊，“可这艘船上，有我手下的家属。”\n家人们举着枪，在等你下令。",
            "The starport's PDF won't surrender. Lieutenant Reyes holds the Patient Mercy's ramp.\n“I don't know what you people are,” she shouts, “but my soldiers' families are on that ship.”\nThe kin raise their guns, waiting for your word."),
    choices: [
      C("让她的人上船离开", "Let her people board and go", "gsc_705", X({renown: -8, sanity: 5, set: {reyesEscaped: true}},
        "雷耶斯愣住，然后挥手让人上船。矿船升空时，她在舷窗后朝你敬了个礼。",
        "Reyes stares, then waves her people aboard. As the hauler lifts, she salutes you from a porthole.")),
      C("拿下舷梯，留住矿船", "Take the ramp. Keep the hauler", "gsc_705", X({renown: 6, sanity: -6, set: {portHeld: true}},
        "枪声停的时候，雷耶斯被缴了械，坐在地上。矿船留下了。家人们欢呼着你的名字。",
        "When the shooting stops, Reyes sits disarmed on the deck. The hauler stays. The kin cheer your name."))
    ]};

  N.gsc_704 = {chapter: 7, scene: "hive_hab", speaker: NELL, time: {h: 1},
    grudgeLine: {npc: "nell", text: L("内尔是前两天夜里被家人从检查站抢回来的。她不肯看你。", "The family snatched Nell back from the checkpoint two nights ago. She won't look at you.")},
    text: L("霍林家空了，只剩内尔和十几个最小的孩子。\n“大人们说，在街上等，”内尔说，“等星之子来接我们。”\n孩子们穿着最好的衣服，排着队，像要去过节。",
            "The Hollin house is empty but for Nell and a dozen of the smallest children.\n“The grown-ups said wait in the street,” Nell says, “for the Star Children to come for us.”\nThe children wear their best clothes, lined up as if for a festival."),
    choices: [
      C("把孩子们带进地窖", "Take the children down to the cellar", "gsc_705", O(X({sanity: 3, renown: -3, set: {withNell: true, hidKids: true}},
        "孩子们不太愿意，一个个被你哄下了地窖。门关上的时候，外面传来了第一声欢呼。",
        "The children are reluctant; you coax them down one by one. As the cellar door shuts, the first cheer rises outside."),
        G("nell", "内尔记得检查站那天，不肯先走。耽搁间，碎砖砸中了你。", "Nell remembers the checkpoint and won't go first. In the delay, falling brick hits you.", 0, {hp: -6}))),
      C("牵着他们，去街上迎接", "Lead them out to welcome the Star Children", "gsc_705", X({renown: 5, corruption: 5, set: {wronged_nell: true}},
        "你把孩子们领进了等着天空的人群。内尔握着你的手，越握越紧。",
        "You lead the children into the crowd waiting on the sky. Nell holds your hand, tighter and tighter.")),
      C("“检查站那天，我转过了头。对不起。”", "“At the checkpoint, I turned away. I'm sorry.”", "gsc_705", O(Q({flag: "wronged_nell"}, true), X({sanity: 3, set: {forgiven_nell: true, withNell: true, hidKids: true}},
        "内尔没说话，伸手握住了你的手。“我知道，”她说，“嗡鸣里都有。”你们一起把孩子们带进了地窖。",
        "Nell says nothing, only takes your hand. “I know,” she says. “It was all in the hum.” Together you take the children down to the cellar.")))
    ]};

  N.gsc_705 = {chapter: 7, scene: "spore_sky", speaker: STARS, time: {h: 30},
    text: L("第二天，天变紫了。\n孢子像雪一样落下，地平线上，无数光点正在降落。\n主祭站在礼拜堂的屋顶上，张开双臂，哭着笑着：“他们来了！他们来接我们了！”",
            "The next day, the sky turns violet.\nSpores fall like snow. On the horizon, countless lights are descending.\nOn the chapel roof the Magus spreads his arms, weeping and laughing. “They've come! They've come for us!”"),
    effects: {sanity: -8},
    codex: ["gsc_star_children"],
    choices: [
      C("跪下迎接", "Kneel to welcome them", "gsc_706", X({corruption: 10, renown: 5},
        "你跪在几万个家人中间。嗡鸣从来没这么响过，也从来没这么小过。",
        "You kneel among tens of thousands of kin. The hum has never been so loud, nor so small.")),
      C("像主祭那样张开双臂", "Spread your arms like the Magus", "gsc_706", O(Q({taint: "slaanesh", min: 40}, true), X({sanity: 5, corruption: 5, taint: {slaanesh: 60}},
        "孢子落在你脸上，像无数个吻。你从来没这么被需要过。这种感觉，你还要更多。",
        "Spores land on your face like countless kisses. You have never been so wanted. You want more of this feeling."))),
      C("往掩体跑", "Run for shelter", "gsc_706", X({sanity: -3},
        "你逆着人流跑。每个人都在往空地上走，只有你在往下钻。",
        "You run against the crowd. Everyone else is walking out into the open. Only you are going down.")),
      C("去找内尔", "Go find Nell", "gsc_706", O(Q({notFlag: "withNell"}, true), X({hp: -5, set: {withNell: true}},
        "你在人群里找到了她。她正抬头看着天，你一把抓住她的手：“别看。跟我走。”",
        "You find her in the crowd, staring up. You seize her hand. “Don't look. Come with me.”")))
    ]};

  N.gsc_706 = {chapter: 7, scene: "spore_sky", speaker: null, foe: "gaunt", time: {h: 2},
    text: L("第一批“星之子”落在欢迎的人群中间。\n它们有太多的腿，太多的牙。人们还在唱歌，伸出手去拥抱。\n歌声停下来，一个声音，接着一个声音。",
            "The first “Star Children” land among the welcoming crowd.\nToo many legs. Too many teeth. People are still singing, reaching out to embrace them.\nThe singing stops. One voice at a time."),
    effects: {sanity: -15},
    codex: ["xenos_tyranid"],
    choices: [
      C("跑", "Run", null, R(0.55, "hp", "gsc_707", "gsc_708",
        RR("你跑过倒塌的街道，身后的歌声越来越少。", "You run through collapsing streets. Behind you, fewer and fewer voices sing.",
           "什么东西撞倒了你。你在地上看见一只爪子，和一只戴着家族戒指的手。", "Something knocks you flat. On the ground you see a claw, and a hand wearing a family ring."))),
      C("把还在唱歌的人拽走", "Drag away the ones still singing", "gsc_707", X({hp: -15, renown: 6},
        "你拽走了三个人。他们拼命挣扎，想回去。第三个，你没拽住。",
        "You drag three away. They fight you, trying to go back. The third, you can't hold.")),
      C("站着，继续唱", "Stand and keep singing", "gsc_end_ascension", O(Q({stat: "corruption", min: 40}), X({corruption: 10},
        "你闭上眼睛，唱得很大声。也许这就是爱。也许他们只是太饿了。",
        "You close your eyes and sing out loud. Maybe this is love. Maybe they're only very hungry.")))
    ]};

  N.gsc_707 = {chapter: 7, scene: "ruins", speaker: MAGUS, time: {h: 3},
    text: L("废墟里，你撞见了主祭。袍子破了，眼里的紫光一闪一闪地熄灭。\n“他们为什么不认识我们？”他问，“我们唱了那么多年……”\n你脑子里的嗡鸣不见了。取代它的，是无边无际的、饥饿的寂静。",
            "In the ruins you run into the Magus. His robes are torn; the violet light in his eyes gutters.\n“Why don't they know us?” he asks you. “We sang for so many years...”\nThe hum in your head is gone. In its place is a hungry silence without end."),
    codex: ["xenos_hive_mind"],
    choices: [
      C("“他们从来就不认识我们。”", "“They never knew us.”", "gsc_801", X({sanity: 5, renown: -3},
        "主祭像个孩子一样坐倒在地上。你走的时候，他还坐在那里，抬头看着天。",
        "The Magus sits down like a child. When you leave, he's still sitting there, looking up.")),
      C("再打一拳，再一拳", "Hit him again. And again", "gsc_801", O(Q({taint: "khorne", min: 30}, true), X({hp: -5, renown: -5, taint: {khorne: 65}},
        "你停不下来，也不想停。天上那么多东西你打不着，眼前这一个，你打得着。",
        "You can't stop and don't want to. You can't hit all those things in the sky. This one, you can."))),
      C("拉他一起走", "Pull him along with you", "gsc_801", X({hp: -5, renown: 4},
        "他跟着你走了两条街，然后挣开你的手，转身朝光点最密的地方走去。",
        "He follows you two streets, then shakes free and walks toward where the lights are thickest.")),
      C("一拳打在他脸上", "Punch him in the face", "gsc_801", X({sanity: 3, hp: -3, taint: {khorne: 45}},
        "他倒在瓦砾里，没有还手。你的指节在流血，心里却痛快得发烫。",
        "He drops into the rubble and doesn't fight back. Your knuckles bleed; your chest burns with satisfaction."))
    ]};

  N.gsc_708 = {chapter: 7, scene: "ruins", speaker: TEO, foe: "gaunt", time: {h: 1},
    text: L("提奥从烟里冲出来，把你从爪子底下拖开。他老了，跑不快了。\n“带孩子们走，”他说，把一根撬棍横在身前，“我在这儿挡一会儿。”\n他朝你笑了一下，眼角是很深的纹路。",
            "Teo bursts out of the smoke and drags you from under the claws. He's old; he can't run fast anymore.\n“Get the children out,” he says, setting a crowbar across his chest. “I'll hold here a while.”\nHe smiles at you, with those deep creases at the eyes."),
    effects: {hp: -20, set: {teoDead: true}},
    choices: [
      C("跑，不要回头", "Run. Don't look back", "gsc_707", X({sanity: -10},
        "你没有回头。很久以后你还会梦见他的笑，比梦见那些牙更多。",
        "You don't look back. For years you'll dream of his smile more than of the teeth.")),
      C("喊他的名字", "Shout his name", "gsc_707", X({sanity: -6, renown: 4},
        "他没有回答。他一直都在唱的那首歌，他终于唱错了，故意的。",
        "He doesn't answer. The song he always sang, he finally sings wrong. On purpose."))
    ]};

  /* ============ Chapter 8 · The Star Children ============ */
  N.gsc_801 = {chapter: 8, scene: "spore_sky", speaker: null, foe: "tyranid_warrior", time: {h: 6}, eventRoll: 0.4,
    text: L("矿城在燃烧。高大的虫族武士在街上走，身后的小虫像潮水一样跟着。\n没有人在唱了。\n远处，星港的灯还亮着；脚下，十三号矿井的深处，有什么东西正在往上爬。",
            "The mining city burns. Tall warrior-beasts stalk the streets, small creatures following like a tide.\nNo one is singing anymore.\nFar off, the starport's lights still burn. Underfoot, deep in Shaft Thirteen, something is climbing."),
    choices: [
      C("带审判官去找老祖宗", "Take the Inquisitor to the Grandsire", "gsc_802", Q({flag: "thornePlan"}, true)),
      C("去星港", "Head for the starport", "gsc_805"),
      C("躲进最深的矿井", "Hide in the deepest shaft", "gsc_809"),
      C("回到老祖宗身边", "Go back down to the Grandsire", "gsc_810", O(Q({stat: "corruption", min: 35}), X({corruption: 5},
        "嗡鸣没了，可你的腿还记得路。越往下，越安静，越暖。",
        "The hum is gone, but your legs remember the way. The deeper you go, the quieter and warmer it gets.")))
    ]};

  N.gsc_802 = {chapter: 8, scene: "cult_shrine", speaker: GRANDSIRE, foe: "inquisitor", time: {h: 3},
    text: L("老祖宗在洞窟里等着，比你记得的更老，更累。它在听天上的声音。\n审判官的风暴兵在你身后散开，枪口亮着。\n老祖宗慢慢转过头，看着你。它好像一点也不意外。",
            "The Grandsire waits in its cavern, older and wearier than you remember. It is listening to the sky.\nThe Inquisitor's storm-troopers fan out behind you, muzzles glowing.\nThe Grandsire slowly turns its head to look at you. It does not seem surprised at all."),
    codex: ["gsc_patriarch"],
    choices: [
      C("“开火！”", "“Open fire!”", null, R(0.5, "hp", "gsc_803", "gsc_805",
        RR("枪声在洞窟里滚了很久。它没有躲。它倒下的样子，像一个终于能睡觉的老人。", "Gunfire rolls through the cavern. It doesn't dodge. It falls like an old one finally allowed to sleep.",
           "它动了，快得看不见。风暴兵接连倒下，它却没追你，只抬头去听天上的声音。你逃向星港。", "It moves faster than sight. Troopers fall. It doesn't chase you; it only lifts its head to the sky. You flee to the starport."))),
      C("挡在它前面", "Step in front of it", "gsc_810", X({renown: 10, sanity: -8},
        "审判官冷冷地看着你。“我就知道。”他下令后撤。老祖宗的手，轻轻落在你肩上。",
        "The Inquisitor regards you coldly. “I knew it.” He orders a withdrawal. The Grandsire's hand settles lightly on your shoulder."))
    ]};

  N.gsc_803 = {chapter: 8, scene: "cult_shrine", speaker: THORNE, time: {h: 1},
    text: L("老祖宗死了。整座城里，所有的家人在同一刻踉跄了一下。\n你脑子里第一次真正安静了。十几年来第一次，只有你自己。\n审判官的通讯器响了：“星语塔……星语者在喊！他喊出去了！”",
            "The Grandsire is dead. Across the city every one of the kin stumbles at the same instant.\nFor the first time your head is truly quiet. For the first time in fifteen years, it's only you.\nThe Inquisitor's vox crackles. “Astropathic tower... he's screaming! He got through!”"),
    effects: {sanity: 10, set: {grandsireDead: true}},
    choices: [
      C("去星语塔，帮他把警告发完", "Go to the tower and help finish the warning", "gsc_end_shadow", X({hp: -10, renown: 5},
        "你爬了九百级台阶。老星语者握着你的手，把这颗星的名字一遍遍喊进黑暗里。",
        "You climb nine hundred steps. The old astropath grips your hand and screams this world's name into the dark, again and again.")),
      C("跟审判官上他的穿梭机", "Board the Inquisitor's shuttle", "gsc_end_witness", X({sanity: -5},
        "审判官给你扣好安全带。“你看见的一切，”他说，“我都需要。”",
        "The Inquisitor buckles you in himself. “Everything you've seen,” he says. “I need all of it.”")),
      C("回去找孩子们", "Go back for the children", "gsc_805", X({hp: -5},
        "审判官没有拦你。“验过血的，可以上船，”他在你身后说，“我说话算数。”",
        "The Inquisitor doesn't stop you. “Clean blood may board,” he calls after you. “I keep my word.”"))
    ]};

  N.gsc_805 = {chapter: 8, scene: "hive_spire", speaker: PRIMUS, foe: "gaunt", time: {h: 4},
    grudgeLine: {npc: "wren", text: L("雷恩带着防卫军出身的几个人守着舷梯，看见你，什么也没说。", "Wren and a few ex-PDF kin hold the ramp. She sees you and says nothing.")},
    text: L("星港上，哈斯克首领带着最后几十个家人守着“忍耐号”。\n他的枪管打红了。他看着天，脸上第一次出现了不知道该怎么办的表情。\n“家人第一，”他说，“把孩子们弄上船。”",
            "At the starport Primus Hask and the last few dozen kin hold the Patient Mercy.\nHis gun barrel glows red. He looks at the sky, and for the first time his face doesn't know what to do.\n“Family first,” he says. “Get the children aboard.”"),
    choices: [
      C("带孩子们登船", "Lead the children aboard", "gsc_806", O(Q({stat: "renown", min: 25}), G("wren", "雷恩没忘是谁报了她的名字，把你排在队尾，等着挨流弹。", "Wren has not forgotten who gave up her name. She puts you last in line, under the stray fire.", 0, {hp: -6}))),
      C("“雷恩都安排好了。走！”", "“Wren arranged it. Go!”", "gsc_806", O(Q({flag: "arkPlan"}, true), X({renown: 5},
        "雷恩在舷梯口点名，一个都没少。她自己没有上船。",
        "Wren calls the roll at the ramp. Not one child missing. She does not board herself."))),
      C("和首领一起守住舷梯", "Hold the ramp beside the Primus", "gsc_807", X({renown: 5, hp: -10},
        "首领看了你一眼，把一包采矿炸药递给你。“能用，”他说。还是那个最高的夸奖。",
        "The Primus glances at you and hands over a satchel of mining charges. “Useful,” he says. Still his highest praise.")),
      C("自己挤上船", "Shove your own way aboard", null, R(0.45, "hp", "gsc_806", "gsc_end_devoured",
        RR("你挤上了舷梯，回头看见孩子们也在往上爬。", "You force your way up the ramp. Looking back, you see the children climbing too.",
           "舷梯前的人太多了。天上的影子落下来，挡住了所有的光。", "Too many people at the ramp. A shadow drops from the sky and blots out every light.")))
    ]};

  N.gsc_806 = {chapter: 8, scene: "ship_interior", speaker: NELL, time: {h: 1},
    text: L("矿船里挤满了孩子。内尔站在舷梯口，没有进来。\n“我听得见它们，”她说，“我走到哪儿，它们就会跟到哪儿。或者，我会在新的地方，生出新的家。”\n她松开了你的手。",
            "The hauler is packed with children. Nell stands at the ramp and doesn't come in.\n“I can hear them,” she says. “Wherever I go, they'll follow. Or I'll grow a new family somewhere new.”\nShe lets go of your hand."),
    choices: [
      C("关上舱门", "Seal the hatch", "gsc_end_ark", O(Q({notFlag: "blessed"}, true), X({sanity: -10},
        "舱门合上的那一刻，内尔在外面朝你挥手，像任何一个送别的孩子。",
        "As the hatch closes, Nell waves from outside, like any child seeing someone off."))),
      C("关上舱门", "Seal the hatch", "gsc_end_seed", O(Q({flag: "blessed"}, true), X({sanity: -10},
        "舱门合上了。你脖子上那个很小的印记，在黑暗里微微发热。",
        "The hatch closes. The tiny mark on your neck grows faintly warm in the dark."))),
      C("摸摸脖子上的印记，和她一起下船", "Touch the mark on your neck. Step off with her", "gsc_end_lastshift", O(Q({flag: "blessed"}, true), X({renown: 5, sanity: 5},
        "你也听得见它们。你牵着内尔走下舷梯，回头对孩子们笑了笑。舱门在你们身后合上。",
        "You can hear them too. You lead Nell down the ramp and smile back at the children. The hatch closes behind you."))),
      C("把她拽上船", "Drag her aboard", "gsc_end_seed", O(Q({stat: "renown", min: 40}), X({renown: 10},
        "最后她不再挣扎，靠在你肩上，轻声说：“你会后悔的。”你不在乎。",
        "In the end she stops struggling, leans on your shoulder, and whispers, “You'll regret this.” You don't care."),
        G("nell", "你辜负过内尔，她死死抓住舷梯，不肯被你拖走。", "You failed Nell once. She clings to the ramp and will not be dragged.", 0, {hp: -10})))
    ]};

  N.gsc_807 = {chapter: 8, scene: "spore_sky", speaker: PRIMUS, foe: "hive_tyrant", time: {h: 1},
    text: L("一头巨兽落在星港中央，比楼还高，四条手臂，每一条都是武器。\n它不看任何人。它只是在指挥，整片天空都听它的。\n哈斯克首领举起枪，第一次朝天上的东西开火。",
            "A monster lands in the middle of the starport, taller than buildings, four arms, each one a weapon.\nIt looks at no one. It only commands, and the whole sky obeys.\nPrimus Hask raises his gun and, for the first time, fires at something from the sky."),
    effects: {sanity: -10},
    codex: ["xenos_hive_tyrant"],
    choices: [
      C("引爆炸药", "Blow the charges", null, R(0.5, "hp", "gsc_end_lastshift", "gsc_end_devoured",
        RR("火光吞没了舷梯前的一切。巨兽踉跄后退，矿船的引擎吼了起来。", "Fire swallows everything before the ramp. The monster staggers back, and the hauler's engines roar.",
           "引线太短了，你的手太慢了。", "The fuse is too short. Your hands are too slow."))),
      C("冲向矿船", "Dash for the hauler", "gsc_806", X({hp: -15},
        "你从首领身边跑过。他没有回头，只是喊了一声：“走！”",
        "You run past the Primus. He doesn't turn, only shouts: “Go!”")),
      C("跪在它面前", "Kneel before it", "gsc_end_ascension", X({corruption: 15},
        "四只手的帝皇终于来了。祂看着你，就像看着一顿饭。",
        "The Four-Armed Emperor has come at last. It looks at you the way one looks at a meal."))
    ]};

  N.gsc_809 = {chapter: 8, scene: "mine_shaft", speaker: null, time: {d: 3},
    text: L("你躲在九号矿井的最底层，靠着岩壁，数着头顶的震动。\n三天了，灯快没电了。\n岩壁那头传来刮擦声，很有耐心，一点一点，在往下挖。",
            "You hide at the very bottom of Shaft Nine, back to the rock, counting the tremors overhead.\nThree days. The lamp is nearly dead.\nFrom beyond the wall comes scraping. Very patient. Bit by bit, digging down."),
    effects: {sanity: -10, hp: -5},
    choices: [
      C("关掉灯，等", "Turn off the lamp and wait", "gsc_end_buried"),
      C("顺着旧排水道摸向星港", "Follow the old drainage tunnel toward the port", "gsc_805", X({hp: -8, sanity: -4},
        "排水道很窄，你爬了一天一夜。出口就在星港底下，你听见了矿船引擎预热的声音。",
        "The drain is narrow; you crawl a day and a night. It opens right under the starport, where the hauler's engines are warming.")),
      C("往上爬", "Climb", "gsc_805", X({hp: -10},
        "你爬了一整天，十个指甲都劈了。地面上，矿船还在。",
        "You climb all day and split every fingernail. On the surface, the hauler is still there."))
    ]};

  N.gsc_810 = {chapter: 8, scene: "cult_shrine", speaker: GRANDSIRE, time: {h: 2},
    text: L("老祖宗用一只很老的手碰了碰你的额头，像在说谢谢，又像在说再见。\n然后它站起来，朝地面走去。天上有东西在叫它回家。\n所有剩下的家人，都跟在它身后。",
            "The Grandsire touches your brow with one ancient hand, like thanks, or goodbye.\nThen it rises and walks toward the surface. Something in the sky is calling it home.\nEvery remaining kin follows behind it."),
    effects: {sanity: -5},
    choices: [
      C("跟着它走", "Follow it", "gsc_end_ascension"),
      C("逆着人流，跑向星港", "Run against the crowd to the starport", "gsc_805", X({sanity: -8, hp: -5},
        "你从几百个家人中间挤过去。他们没有拦你，只是很遗憾地看着你，像看一个错过晚饭的孩子。",
        "You push through hundreds of kin. They don't stop you, only watch with regret, like at a child who'll miss supper."))
    ]};

  /* ============ Endings ============ */
  N.gsc_end_ark = {chapter: 8, scene: "void", speaker: null, time: {d: 60, warp: true},
    text: L("“忍耐号”飞向奥雷克斯二号，载着四十个孩子，个个都是素脸，个个都验过血。\n身后，凯辛三号变成了一颗紫色的星，然后什么也不剩。\n你教孩子们唱歌。不是那首。是一首新的。",
            "The Patient Mercy flies for Aurex Secundus with forty children aboard, plain-faced every one, every one's blood tested clean.\nBehind you Kessin Tertius becomes a violet star, then nothing at all.\nYou teach the children a song. Not that one. A new one."),
    ending: {kind: "good", title: L("素脸的孩子们", "The Plain Children"), cause: L("带着孩子们逃离", "Escaped with the children")}};

  N.gsc_end_shadow = {chapter: 8, scene: "hive_spire", speaker: ASTRO, time: {d: 9},
    text: L("警告传出去了。九天后，帝国海军的炮火照亮了紫色的天。\n凯辛三号没能保住，可整个阿尔科萨星区都听见了这颗星的名字。\n你坐在星语塔的废墟上，头脑安静。只有你自己，和你记得的每一张脸。",
            "The warning got through. Nine days later, Imperial Navy guns light the violet sky.\nKessin Tertius could not be saved, but the whole Arcosa Sector heard its name.\nYou sit in the astropathic tower's ruins, your mind quiet. Only you, and every face you remember."),
    codex: ["place_arcosa"],
    ending: {kind: "good", title: L("阴影散去", "The Shadow Lifts"), cause: L("熄灭灯塔，喊出警告", "Killed the beacon, sent the warning")}};

  N.gsc_end_witness = {chapter: 8, scene: "ship_interior", speaker: THORNE, time: {y: 1},
    text: L("审判官的船上，你讲了一年。四代人的名字，每一碗汤，每一首歌。\n异形审判庭的档案里多了一卷：“凯辛三号：一个家庭的完整记录”。\n审判官说，下一颗星球，会因为这一卷早一点被发现。",
            "Aboard the Inquisitor's ship you talk for a year. Four generations of names, every bowl of soup, every song.\nThe Ordo Xenos archive gains a volume: “Kessin Tertius: the complete record of one family.”\nThe Inquisitor says the next world will be found a little sooner because of it."),
    ending: {kind: "good", title: L("证人", "The Witness"), cause: L("成为审判庭的证人", "Became the Inquisition's witness")}};

  N.gsc_end_lastshift = {chapter: 8, scene: "spore_sky", speaker: PRIMUS, foe: "hive_tyrant", time: {h: 2},
    text: L("你和首领守着空荡荡的星港，一直守到天黑。\n矿船的尾焰变成一颗小星星，又变成什么都没有。\n首领说：“最后一班。”你点点头。这辈子，这是你干过最值的一班。",
            "You and the Primus hold the empty starport until nightfall.\nThe hauler's exhaust becomes a small star, then nothing.\nThe Primus says, “Last shift.” You nod. It's the best shift you ever worked."),
    ending: {kind: "good", title: L("最后一班", "The Last Shift"), cause: L("断后，让孩子们走", "Held the line so the children could go")}};

  N.gsc_end_ascension = {chapter: 8, scene: "spore_sky", speaker: STARS, time: {h: 1},
    text: L("升天之日，你和家人们站在一起，仰着头。\n星之子降下来了，正如主祭说的那样，把你们全都接走，变成他们的一部分。\n一点也不剩。他们甚至不知道，你们曾经为他们唱过歌。",
            "On the Day of Ascension you stand with the family, faces upturned.\nThe Star Children descend, just as the Magus said, and take you all up, make you part of them.\nNothing is left over. They never even knew you once sang for them."),
    ending: {kind: "bad", title: L("升天", "Ascension"), cause: L("在歌声中被虫群吞噬", "Devoured mid-hymn by the swarm")}};

  N.gsc_end_corrected = {chapter: 6, scene: "gsc_chapel", speaker: MAGUS, time: {d: 3},
    text: L("主祭治好了你。你再也不害怕了，再也不怀疑了。\n你每天都笑，笑得和所有人一模一样，嗡鸣替你记着一切。\n升天之日来的时候，你是第一个跑去迎接的。",
            "The Magus heals you. You are never afraid again, never doubtful again.\nYou smile every day, exactly like everyone else; the hum remembers everything for you.\nWhen the Day of Ascension comes, you are the first to run out and greet it."),
    ending: {kind: "bad", title: L("被治好的人", "Healed"), cause: L("心智被主祭抹平", "Mind smoothed away by the Magus")}};

  N.gsc_end_seed = {chapter: 8, scene: "underhive", speaker: null, time: {y: 30},
    text: L("“忍耐号”到了奥雷克斯二号。你在下巢找了份活，过得很安静。\n三十年后，下巢有一户人家，星期天总多做一份饭，墙上挂着一幅四只手的帝皇像。\n孩子们都长着同一双淡紫色的眼睛。",
            "The Patient Mercy reaches Aurex Secundus. You find work in the underhive and live quietly.\nThirty years later, an underhive family always cooks one extra plate on Sundays, and a four-armed Emperor hangs on their wall.\nThe children all share the same pale violet eyes."),
    codex: ["place_aurex"],
    ending: {kind: "bad", title: L("种子", "The Seed"), cause: L("把家族带到了新的星球", "Carried the family to a new world")}};

  N.gsc_end_devoured = {chapter: 8, scene: "spore_sky", speaker: null, foe: "hive_tyrant", time: {h: 1},
    text: L("你没有跑掉。\n后来，整颗星球的一切活物都被收走：矿工、执法官、家人、孢子底下的苔藓。\n虫群离开时，凯辛三号只剩下光秃秃的石头，和一座还挂着四臂像的空房子。",
            "You don't get away.\nAfterward everything living on the world is gathered up: miners, enforcers, kin, the moss beneath the spores.\nWhen the swarm leaves, Kessin Tertius is bare stone, and one empty house with a four-armed icon on the wall."),
    ending: {kind: "bad", title: L("生物质", "Biomass"), cause: L("在逃跑中被虫群吞噬", "Devoured while fleeing")}};

  N.gsc_end_buried = {chapter: 8, scene: "mine_shaft", speaker: null, time: {d: 20},
    text: L("你一直待在矿井最深处。灯灭了，刮擦声停了，地面上的声音也停了。\n后来，什么声音都没有了。\n你在黑暗里待了很久。这颗星上，你是最后一个记得那些歌的人。",
            "You stay at the very bottom of the mine. The lamp dies; the scraping stops; the sounds above stop too.\nThen there is no sound at all.\nYou stay in the dark a long time. On this world, you are the last one who remembers the songs."),
    ending: {kind: "bad", title: L("最深一层", "The Deepest Level"), cause: L("困死在最深的矿井", "Entombed in the deepest shaft")}};

  N.gsc_end_purged = {chapter: 6, scene: "underhive", speaker: THORNE, time: {d: 1},
    text: L("审判庭的名单很长，你在第四百一十二行。\n罪名是“与异形勾结”。你想说，他们只是给了你一碗汤。\n审判官合上名单，第四百一十三行，是内尔。",
            "The Inquisition's list is long. You're on line four hundred and twelve.\nCharge: consorting with the xenos. You want to say they only gave you a bowl of soup.\nThe Inquisitor closes the list. Line four hundred and thirteen is Nell."),
    ending: {kind: "bad", title: L("净化名单", "On the List"), cause: L("被审判庭处决", "Executed by the Inquisition")}};

  /* ============ Claim endings (SPEC §19). The Shadow in the Warp muffles the gods; these are rare and strange. ============ */
  N.gsc_end_claim_khorne = {scene: "spore_sky", speaker: S("sigil_khorne", "影子底下的鼓", "A Drum Beneath the Shadow"), time: {d: 10},
    text: L("影子罩着这颗星，诸神都听不见。可你的怒火太大，大到从影子底下漏了出去。\n你在废墟里杀虫子，杀了十天，没有停。\n影子退去那一夜，一面鼓终于找到了你。它不在乎血是谁的。",
            "The Shadow covers this world and the gods can't hear. But your rage is too big, and leaks out beneath it.\nYou kill the beasts in the ruins for ten days, without stopping.\nThe night the Shadow lifts, a drum finally finds you. It doesn't care whose blood it was."),
    codex: ["god_khorne"],
    ending: {kind: "bad", title: L("漏出影子的怒火", "Rage Beneath the Shadow"), cause: L("影子退去时被恐虐收走", "Taken by Khorne as the Shadow lifted")}};

  N.gsc_end_claim_nurgle = {scene: "mine_shaft", speaker: S("sigil_nurgle", "温暖的苔藓", "Warm Moss"), time: {d: 30},
    text: L("你身上长出了别的东西，又暖又软，不是家族的，是另一种爱。\n虫群来了，把所有活物都收走。只有你，它们嗅了嗅，绕开了。\n连吞噬者都不要你。可慈祥的祖父要。他一向什么都要。",
            "Something else grows in you, warm and soft. Not the family's. A different kind of love.\nThe swarm comes and gathers every living thing. You alone they sniff, and pass by.\nEven the Devourer doesn't want you. But a kindly Grandfather does. He always wants everything."),
    codex: ["god_nurgle"],
    ending: {kind: "bad", title: L("连虫群都不要", "Even the Swarm Passed By"), cause: L("被纳垢留作花园", "Kept by Nurgle for his garden")}};

  N.gsc_end_claim_tzeentch = {scene: "warp", speaker: S("daemon_tzeentch", "影子里的一道缝", "A Crack in the Shadow"), time: {d: 5, warp: true},
    text: L("影子那么大，大得像一面墙。可墙上有一道缝，正好是你的形状。\n有人很早就在等你了，比老祖宗来得更早，比星之子来得更早。\n“家族是个好计划，”那个声音说，“可我的计划，更长。”",
            "The Shadow is vast as a wall. But the wall has a crack in it, exactly your shape.\nSomeone has been waiting for you a long time: since before the Grandsire, before the Star Children.\n“The family was a good plan,” the voice says. “Mine is longer.”"),
    codex: ["god_tzeentch"],
    ending: {kind: "bad", title: L("影子里的缝", "The Crack in the Shadow"), cause: L("从影子的缝隙被奸奇带走", "Slipped through the Shadow to Tzeentch")}};

  N.gsc_end_claim_slaanesh = {scene: "gsc_chapel", speaker: S("sigil_slaanesh", "空礼拜堂里的回声", "An Echo in the Empty Chapel"), time: {y: 1},
    text: L("家族的爱太满了，满到你离不开。家人都不在了，你还在空礼拜堂里唱，唱给自己听。\n影子里，她听不见你。你的渴望只好一遍遍回响，越来越甜。\n影子退去那天，她就在门口，等着听第一万遍。",
            "The family's love was so full you can't do without it. The kin are gone, and still you sing in the empty chapel, to yourself.\nIn the Shadow she can't hear you, so your longing only echoes, sweeter each time.\nThe day the Shadow lifts, she's waiting at the door to hear it for the ten-thousandth time."),
    codex: ["god_slaanesh"],
    ending: {kind: "bad", title: L("一万遍", "Ten Thousand Times"), cause: L("在渴望中被色孽收走", "Taken by Slaanesh through longing")}};

  /* ============ Death nodes (engine-triggered) ============ */
  N.gsc_death_hp = {scene: "mine_shaft", speaker: null,
    text: L("你倒在矿井里。灯滚出去很远，照着岩壁上的小画：四只手的人，落下的星星。\n过了一会儿，几个戴兜帽的人来了，把你抬走，像抬家人一样小心。\n他们照顾自己人。到最后也是。",
            "You fall in the mine. Your lamp rolls far off, lighting the little carvings: four-armed figures, falling stars.\nAfter a while hooded figures come and carry you away, careful as with family.\nThey look after their own. To the very end."),
    ending: {kind: "death", title: L("抬走", "Carried Home"), cause: L("伤重死在矿井里", "Died of wounds in the mine")}};

  N.gsc_death_sanity = {scene: "gsc_chapel", speaker: null,
    text: L("你再也分不清哪个声音是自己的了。\n嗡鸣里有几百个声音，你挑了一个最温柔的，跟着它走，再也没回来。\n礼拜堂里多了一个总在微笑的人。没人记得他原来叫什么。",
            "You can no longer tell which voice is yours.\nThe hum holds hundreds. You pick the gentlest, follow it, and never come back.\nThe chapel gains one more person who always smiles. Nobody remembers their old name."),
    ending: {kind: "death", title: L("几百个声音之一", "One of Hundreds"), cause: L("自我溶进了族群意识", "Self dissolved into the Broodmind")}};

  N.gsc_death_corruption = {scene: "cult_shrine", speaker: null,
    text: L("家的血终于把你填满了。你的皮肤越来越硬，你的心越来越暖，你想不起“我”这个字。\n老祖宗低头看着你，很满意。\n你是家的一部分了。只是一部分。",
            "The family's blood fills you at last. Your skin hardens, your heart warms, and you can't recall the word “I.”\nThe Grandsire looks down at you, satisfied.\nYou are part of the family now. Only a part."),
    ending: {kind: "death", title: L("一部分", "Only a Part"), cause: L("被老祖宗的血完全吞没", "Wholly consumed by the Grandsire's blood")}};

  /* ============ Route taint events (SPEC §18, §26: 5 incl. 1 cleanse) + route events ============ */
  WH.registerEvents([
    {id: "evt_t_gsc_khorne", god: "khorne", factions: ["gsc"], minChapter: 2,
     scene: "mine_shaft", speaker: S("sigil_khorne", "积水坑边的赌局", "The Sump Ring"), foe: null,
     text: L("废弃的积水坑边围满了矿工，在赌拳。没有规矩，打到一方站不起来为止。\n有人把你推进圈子里。对面的人比你壮一倍，正冲你咧嘴笑。\n你的心跳，突然和人群的跺脚声一个节拍。",
             "Miners crowd the old sump, betting on bare-knuckle fights. No rules; it ends when someone can't stand.\nSomeone shoves you into the ring. Your opponent is twice your size, grinning.\nSuddenly your heartbeat keeps time with the crowd's stamping."),
     codex: ["god_khorne"],
     choices: [
       {text: L("打", "Fight"), effects: {hp: -8, renown: 5, taint: {khorne: 28}},
        result: L("你赢了。你记不清是怎么赢的，只记得对方倒下以后，你还想再打一场。", "You win. You can't remember how, only that after he went down you wanted another round.")},
       {text: L("推开人群走掉", "Shove through the crowd and leave"), effects: {sanity: -3},
        result: L("身后一片嘘声。走出很远，跺脚声还在你胸口里响。", "Jeers follow you. Long after, the stamping still sounds in your chest.")}
     ]},

    {id: "evt_t_gsc_nurgle", god: "nurgle", factions: ["gsc"], minChapter: 2,
     scene: "mine_shaft", speaker: S("sigil_nurgle", "咳嗽的老矿工", "The Coughing Old-Timer"), foe: null,
     text: L("黑肺病房里，一个老矿工咳得最凶，却笑得最开心。\n他递给你一罐温热的苔藓茶：“喝了它，咳嗽就不疼了。疼没了，咳嗽留着，也挺好。”\n茶面上浮着一层细细的绿。",
             "In the black-lung ward one old miner coughs the worst and smiles the most.\nHe offers you a warm jar of moss tea. “Drink. The cough stops hurting. Keep the cough, lose the hurt. Not bad.”\nA fine green film floats on top."),
     codex: ["god_nurgle"],
     choices: [
       {text: L("喝一口", "Take a sip"), effects: {hp: 12, taint: {nurgle: 28}},
        result: L("茶又暖又甜。你的咳嗽一点也不疼了，只是从此再也没停过。", "Warm and sweet. Your cough stops hurting at once. It never stops, though.")},
       {text: L("谢过他，不喝", "Thank him and decline"), effects: {hp: -5},
        result: L("你又咳了一整夜。第二天他的床空了，那罐茶还在床头，温温的。", "You cough all night. Next day his bed is empty; the jar sits on the shelf, still warm.")}
     ]},

    {id: "evt_t_gsc_tzeentch", god: "tzeentch", factions: ["gsc"], minChapter: 3,
     scene: "manufactorum", speaker: S("sigil_tzeentch", "会自己改的账", "The Self-Correcting Ledger"), foe: null,
     text: L("矿务署的账本上，有一栏数字每天夜里自己改。\n今天它写着：“明日，七号巷道塌方，十一人。”\n墨水是蓝色的。署里没有人用蓝墨水。",
             "In the tally office ledger, one column rewrites itself every night.\nToday it reads: TOMORROW, GALLERY SEVEN COLLAPSES. ELEVEN.\nThe ink is blue. Nobody in the office uses blue ink."),
     codex: ["god_tzeentch"],
     choices: [
       {text: L("照着它提醒班组长", "Warn the shift-boss as it says"), effects: {renown: 6, sanity: -4, taint: {tzeentch: 28}},
        result: L("七号巷道真的塌了，没有人在里面。大家都说你有福气。那栏数字第二天写的，是你的名字。", "Gallery Seven does collapse, empty. Everyone calls you lucky. Next day the column shows your name.")},
       {text: L("把那一页撕下来烧掉", "Tear out the page and burn it"), effects: {sanity: -3},
        result: L("纸烧成了蓝色的灰。七号巷道第二天没塌，第三天塌了。", "The page burns to blue ash. Gallery Seven doesn't fall the next day. It falls the day after.")}
     ]},

    {id: "evt_t_gsc_slaanesh", god: "slaanesh", factions: ["gsc"], minChapter: 4,
     scene: "hive_hab", speaker: S("sigil_slaanesh", "卖药膏的货郎", "The Ointment Pedlar"), foe: null,
     text: L("一个外星区来的货郎在卖一种药膏，抹上去，皮肤光滑得像瓷。\n好几个表亲偷偷买了，用来遮骨棱。\n货郎把镜子转向你：“您也来点？您本来就好看，抹了会更好看。好看得让人离不开。”",
             "A pedlar from off-world sells an ointment that leaves skin smooth as porcelain.\nSeveral cousins buy it in secret to hide their ridges.\nHe turns his mirror to you. “Some for you? You're handsome already. This makes you more. Unforgettable.”"),
     codex: ["god_slaanesh"],
     choices: [
       {text: L("买一罐，抹上", "Buy a jar and use it"), effects: {sanity: 6, renown: 3, taint: {slaanesh: 28}},
        result: L("镜子里的你美得不像真的。此后每次照镜子，你都想再抹一点，再多一点。", "The face in the mirror is too beautiful to be real. Every time after, you want a little more. Then more.")},
       {text: L("推开镜子", "Push the mirror away"), effects: {sanity: -3},
        result: L("货郎耸耸肩。一个表亲在旁边小声说：“你不懂，被人看着不害怕，是什么滋味。”", "The pedlar shrugs. A cousin murmurs, “You don't know what it's like to be looked at and not be afraid.”")}
     ]},

    {id: "evt_t_gsc_cleanse", god: "other", cleanse: true, factions: ["gsc"], minChapter: 3,
     scene: "gsc_chapel", speaker: S("omen_four_armed", "嗡鸣", "The Hum"), foe: null,
     text: L("深夜的礼拜堂里，嗡鸣变得很厚，像一床压下来的棉被。\n平时那些在梦里低语的、敲门的、不属于家人的声音，全被闷住了。\n只剩下家，和一种巨大的、饥饿的安静。",
             "In the chapel at night the hum grows thick, like a heavy quilt pressing down.\nAll the voices that usually whisper in dreams, that knock, that don't belong to the family, are smothered.\nOnly family remains, and a vast, hungry quiet."),
     codex: ["xenos_shadow_in_warp"],
     choices: [
       {text: L("躺进嗡鸣里，睡一觉", "Lie down in the hum and sleep"), effects: {corruption: 5, sanity: 4, taint: {all: -25}},
        result: L("你睡得像个婴儿。醒来时轻了很多，好像有什么不属于你的东西被吃掉了。连同一点属于你的。", "You sleep like a baby and wake much lighter, as if something not yours was eaten. Along with a little that was.")},
       {text: L("去卢斯克神父的旧教堂里祷告", "Pray in Father Lusk's old chapel instead"), effects: {sanity: 3, renown: -3, taint: {all: -12}},
        result: L("教堂里落满了灰。你对着空圣坛念完一段祷文，觉得自己干净了一点，也孤单了一点。", "Dust everywhere. You finish a prayer before the empty altar and feel a little cleaner, and a little lonelier.")}
     ]},

    {id: "evt_gsc_rockfall", god: "other", factions: ["gsc"], minChapter: 2,
     scene: "mine_shaft", speaker: S("gsc_neophyte", "兜帽下的表亲", "A Hooded Cousin"), foe: null,
     text: L("掌子面又落石了，砸断了你的灯。黑暗里，一只很长的手扶住你的胳膊。\n“别动，”兜帽下的人说，“我看得见。”\n他确实看得见。他在黑暗里，比在灯下走得还稳。",
             "Another rockfall at the face smashes your lamp. In the dark, a long hand steadies your arm.\n“Don't move,” says the hooded one. “I can see.”\nHe can. He walks steadier in the dark than under lamps."),
     codex: ["gsc_neophyte"],
     choices: [
       {text: L("让他领你出去", "Let him lead you out"), effects: {renown: 4, sanity: 3},
        result: L("你们走了很久。到了亮处，他已经不见了，你的口袋里多了一根新灯芯。", "You walk a long time. In the light he's gone; there's a new lamp-wick in your pocket.")},
       {text: L("自己摸黑走", "Feel your own way out"), effects: {hp: -6},
        result: L("你撞了七次头，爬了出来。身后黑暗里，好像有人一直跟着，替你挡开了一块落石。", "You crack your head seven times getting out. Someone seems to follow in the dark, knocking aside one falling stone.")}
     ]},

    {id: "evt_gsc_census", god: "other", factions: ["gsc"], minChapter: 4,
     scene: "hive_hab", speaker: S("servitor", "人口普查员", "The Census Clerk"), foe: null,
     text: L("总督府派人来普查人口。普查员带着一个伺服记录仪，挨家挨户数人头。\n轮到霍林家，他数了一遍，又数了一遍，额头冒汗。\n“这户……登记了九个人，”他说，“为什么有两百双鞋？”",
             "The governor's office sends a census. The clerk goes door to door with a servo-recorder, counting heads.\nAt the Hollin house he counts once, twice, sweating.\n“This household... nine are registered,” he says. “Why are there two hundred pairs of shoes?”"),
     codex: ["gsc_cult"],
     choices: [
       {text: L("“亲戚来过节。”", "“Relatives visiting for the holiday.”"), effects: {renown: 5},
        result: L("他想了想，在表格上写了“九”。他左手的手套，你后来才注意到。", "He considers, and writes “nine.” Only later do you notice the glove on his left hand.")},
       {text: L("“您数得没错。”", "“Your count's correct.”"), effects: {renown: -6, sanity: 3},
        result: L("他的笔停了。第二天，普查报告上霍林家那一页，被人整整齐齐地撕掉了。", "His pen stops. Next day the Hollin page has been torn neatly from the census report.")}
     ]}
  ]);

  /* ============ Route rumours (SPEC §20b) — every one has a relevant `when` ============ */
  function RU(id, minChapter, maxChapter, speaker, text, codex, when) {
    return {id: id, factions: ["gsc"], minChapter: minChapter, maxChapter: maxChapter, speaker: speaker, text: text, codex: codex, when: when};
  }
  WH.registerRumors([
    RU("rum_gsc_aurex_barge", 1, 3, L("矿船上的装卸工", "A hauler stevedore"),
      L("“奥雷克斯二号的工厂吃矿石像吃面包。这条线上的船员，一半是霍林家的表亲。”",
        "“Aurex Secundus eats our ore like bread. Half the crews on this run are Hollin cousins now.”"),
      ["place_aurex"], {scenes: ["mine_shaft"], keywords: {zh: ["奥雷克斯", "矿船"], en: ["Aurex", "hauler"]}}),
    RU("rum_gsc_thessa_drills", 4, 6, L("工棚里的闲话", "Barracks gossip"),
      L("“机械神教买走了五十台钻机，说是去忒萨零号挖东西。钻机没回来，人也没回来。”",
        "“The Mechanicus bought fifty of our drills for some dig on Thessa Null. Neither the drills nor the crews came back.”"),
      ["place_thessa_null"], {scenes: ["mine_shaft"], sprites: ["hive_foreman"], keywords: {zh: ["工分", "工头"], en: ["tally", "foreman"]}}),
    RU("rum_gsc_carcharos", 4, 6, L("下巢的难民", "An underhive refugee"),
      L("“卡尔卡罗斯的巢都出了怪事，我们逃了。霍林家收留了我们，管饭，不问。”",
        "“Something went wrong in Carcharos hive, so we ran. The Hollins took us in. Fed us. Asked nothing.”"),
      ["place_carcharos"], {scenes: ["underhive"], flags: ["liedForFamily"], keywords: {zh: ["收留", "照顾"], en: ["look after", "took"]}}),
    RU("rum_gsc_rift", 1, 3, L("执事的叹息", "A deacon's sigh"),
      L("“大裂隙撕开以后，星炬的光就淡了。帝皇还在看着我们吗？我不知道。”",
        "“Since the Great Rift opened, the Astronomican's light is faint. Is the Emperor still watching us? I don't know.”"),
      ["chr_great_rift_opens"], {scenes: ["cathedral"], sprites: ["preacher"], keywords: {zh: ["帝皇"], en: ["Emperor"]}}),
    RU("rum_gsc_rhyme", 2, 5, L("孩子们的跳绳歌", "A skipping rhyme"),
      L("“四只手，抱着你；紫眼睛，看着你；星星落，接走你……”唱到这里，孩子们一起拍手。",
        "“Four arms to hold you, violet eyes to watch you, stars come down to take you...” Here the children all clap."),
      ["gsc_four_armed"], {sprites: ["gsc_neophyte"], codex: ["gsc_four_armed"], keywords: {zh: ["孩子", "内尔"], en: ["child", "Nell"]}}),
    RU("rum_gsc_hesper", 4, 7, L("货运调度员", "A cargo dispatcher"),
      L("“赫斯珀的麦子再也不来了。上面只说‘检疫’。检疫要烧整颗星吗？”",
        "“No more Hesper grain, ever. Upstairs only says ‘quarantine.’ Since when does quarantine burn a whole world?”"),
      ["place_hesper"], {codex: ["place_hesper"], keywords: {zh: ["赫斯珀"], en: ["Hesper"]}}),
    RU("rum_gsc_macragge", 3, 6, L("老矿工的故事", "An old miner's tale"),
      L("“我爷爷说，很久以前，一支虫子舰队扑向极限战士的星球。天上全是星星，往下掉。”",
        "“Grandad said a bug fleet once fell on the Ultramarines' world. The sky full of stars, all of them falling.”"),
      ["chr_macragge"], {codex: ["gsc_star_children"], keywords: {zh: ["星之子", "星星"], en: ["Star Children", "stars"]}}),
    RU("rum_gsc_vigilus", 3, 6, L("操练时的低语", "Whispered during drill"),
      L("“听说在一颗叫维吉卢斯的星上，家里人起事了，差一点就拿下了整颗星。”",
        "“They say on a world called Vigilus the family rose up and nearly took the whole planet.”"),
      ["chr_vigilus"], {scenes: ["cult_shrine"], sprites: ["gsc_primus"], keywords: {zh: ["那一天"], en: ["the Day"]}}),
    RU("rum_gsc_leviathan", 4, 7, L("星语塔的公告", "A tower bulletin"),
      L("“警示：利维坦虫巢舰队分支活动。凡见天色发紫者，立即上报。”公告下面被人画了一朵花。",
        "“ADVISORY: Hive Fleet Leviathan splinter activity. Report any violet discolouration of the sky.” Someone has doodled a flower beneath."),
      ["chr_leviathan"], {scenes: ["hive_spire"], sprites: ["psyker", "guard_sergeant"], keywords: {zh: ["紫", "影子"], en: ["violet", "shadow"]}}),
    RU("rum_gsc_baal", 5, 8, L("防卫军士兵", "A PDF trooper"),
      L("“连天使的母星都差点被虫子吃了。我们？我们连天使都没有。”",
        "“Even the Angels' homeworld nearly got eaten by the bugs. Us? We don't even have angels.”"),
      ["chr_devastation_of_baal"], {sprites: ["guard_sergeant", "guardsman"], keywords: {zh: ["防卫军", "星港"], en: ["PDF", "starport"]}}),
    RU("rum_gsc_octarius", 6, 8, L("风暴兵的闲聊", "Storm-trooper chatter"),
      L("“有个审判官把一整支虫巢舰队引去吃兽人。你说，我们这位会不会也打这种算盘？”",
        "“An Inquisitor once steered a whole hive fleet into the orks. Think ours is doing sums like that?”"),
      ["chr_octarius"], {sprites: ["inquisitor"], keywords: {zh: ["审判官"], en: ["Inquisitor"]}})
  ]);

  /* SPEC §27: register the home world in the sector lookup (sector.js merges, load order does not matter) */
  WH.sector = WH.sector || {};
  WH.sector.worlds = WH.sector.worlds || {};
  WH.sector.worlds.kessin = {name: L("凯辛三号", "Kessin Tertius"), codex: "place_kessin", routes: ["gsc"], kind: "mining world (cult uprising 115.M42)"};

  WH.registerFaction({
    id: "gsc",
    name: L("基因窃取者教派", "Genestealer Cult"),
    tagline: L("家人给你一碗汤，和一片紫色的天", "Family gives you soup, and a violet sky"),
    role: L("九号矿井矿工", "Shaft Nine miner"),
    world: L("凯辛三号", "Kessin Tertius"),
    playerSprite: "player_gsc",
    color: "#9b59b6",
    startNode: "gsc_101",
    startDate: {year: 100, mill: 42},
    startStats: {hp: 110, sanity: 95, corruption: 0, renown: 5},
    renownLabel: L("血亲", "Kinship"),
    renownIcon: "icon_kinship",
    taintMod: {khorne: 0.6, nurgle: 0.6, tzeentch: 0.6, slaanesh: 0.6},   // SPEC §19/§26: the Shadow in the Warp muffles the gods
    renownHelp: L("血亲是霍林家对你的信任和爱。替家人撒谎、守秘、出力会让它上升；怀疑、告密、拒绝会让它下降。血亲够高，家人才会跟你走，最后的船上才有你说话的份。",
                  "Kinship is the Hollin family's trust and love for you. Lying for them, keeping their secrets and pulling your weight raise it; doubt, informing and refusal lower it. High Kinship means the family will follow your lead, and your word counts at the very end."),
    /* SPEC §28: people the route lets you wrong. Only present in later scenes where the text puts them there. */
    npcs: {
      teo:   {name: L("提奥", "Teo")},
      nell:  {name: L("内尔", "Nell"), aka: [L("小内尔", "Little Nell")]},
      wren:  {name: L("雷恩", "Wren"), aka: [L("小雷恩", "Little Wren")]},
      brann: {name: L("布兰", "Brann"), aka: [L("老布兰", "Old Brann")]}
    },
    deathNodes: {hp: "gsc_death_hp", sanity: "gsc_death_sanity", corruption: "gsc_death_corruption"},
    origins: [
      {id: "miner", name: L("九号矿井矿工", "Shaft Nine miner"),
       desc: L("在矿井里熬了十年，没有家人。背脊结实，心却累了。", "Ten years down the shaft, no family at all. A strong back, and a tired heart."),
       sprite: "player_gsc", startNode: "gsc_101",
       max: {hp: 110, sanity: 95}, stats: {hp: 110, sanity: 95, corruption: 0, renown: 5}, set: {origin_miner: true}},
      {id: "warden", name: L("执法官之子", "Enforcer's child"),
       desc: L("执法分局警长的孩子，奉命混进矿井。头脑清醒，可身子没下过井。", "A precinct sergeant's child, sent undercover into the mine. A clear head, but a body that has never worked a shaft."),
       sprite: "player_gsc", startNode: "gsc_o_warden_1",
       max: {hp: 95, sanity: 105}, stats: {hp: 95, sanity: 105, corruption: 0, renown: 10}, set: {origin_warden: true}},
      {id: "kin", name: L("素脸的孩子", "The plain one"),
       desc: L("第三代混血所生，看上去完全是人。家人视你如珍宝，嗡鸣从小就在你脑子里。", "Born to a third-generation mother, you look wholly human. The family treasures you; the hum has been in your head since birth."),
       sprite: "player_gsc", startNode: "gsc_o_kin_1",
       max: {hp: 100, sanity: 95}, stats: {hp: 100, sanity: 95, corruption: 5, renown: 20}, set: {origin_kin: true}}
    ],
    learn: {
      leaders: ["gsc_patriarch", "gsc_magus", "gsc_primus", "gsc_four_armed"],
      enemies: ["imp_imperium", "gsc_pdf", "imp_inquisition", "xenos_tyranid"],
      boss: ["gsc_star_children", "xenos_hive_mind"],
      lore: ["gsc_cult", "gsc_generations", "gsc_ascension", "gsc_broodmind"]
    },
    chapters: {
      1: L("九号矿井", "Shaft Nine"),
      2: L("一家人", "The Family"),
      3: L("深处", "Down Below"),
      4: L("一代又一代", "Generations"),
      5: L("呼唤", "The Call"),
      6: L("审判官", "The Inquisitor"),
      7: L("升天之日", "The Day of Ascension"),
      8: L("星之子", "The Star Children")
    },
    nodes: N
  });
})();
