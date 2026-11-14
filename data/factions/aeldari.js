/* data/factions/aeldari.js — Aeldari route (text-aeldari role). SPEC §3, §11–§18.
 * Player: a human of the Imperial agri-world Valda, which Farseer Taethra lets the Necrons harvest so that
 * six thousand Exodites on Ildaneth live. Spared as "a thread of fate", taken through the webway to
 * Craftworld Selunar as a mon-keigh guest; in the end used as bait for a Keeper of Secrets.
 * Term: mon-keigh = 猿人 (consistent). Start 113.M42.
 * v0.4.0 story overhaul (SPEC §32): bridges between chapters, alt/resultAlt echoes, gather nodes; plan in docs/audit/plan_aeldari.md.
 * The webway gate stands in the ring of WHITE stones on the ridge; the black "old stones" in the fields are the tomb.
 * Helpers: L(zh,en) text · S(sprite,zh,en) speaker · C(zh,en,next,extra) choice ·
 *          E(effects,rzh,ren) effects + result beat · RS(rzh,ren) result only ·
 *          R(p,stat,success,fail, szh,sen, fzh,fen) roll + rollResult · M(a,b) merge.
 * Hidden taint (SPEC §18) lives in effects.taint and is never mentioned in text.
 */
(function () {
  function L(zh, en) { return {zh: zh, en: en}; }
  function S(sprite, zh, en) { return {sprite: sprite, name: {zh: zh, en: en}}; }
  function M(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  function C(zh, en, next, extra) {
    var c = {text: {zh: zh, en: en}};
    if (next) c.next = next;
    if (extra) for (var k in extra) c[k] = extra[k];
    return c;
  }
  function E(eff, rzh, ren) { var o = {result: L(rzh, ren)}; if (eff) o.effects = eff; return o; }
  function RS(rzh, ren) { return {result: L(rzh, ren)}; }
  function R(p, stat, success, fail, szh, sen, fzh, fen) {
    return {roll: {p: p, stat: stat, success: success, fail: fail},
            rollResult: {success: L(szh, sen), fail: L(fzh, fen)}};
  }
  function ONLY(flag) { return {require: {flag: flag}, hideIfLocked: true}; }
  /* SPEC §32.2 alt / resultAlt helpers. Conditions are evaluated on the ARRIVAL state. */
  function A(cond, zh, en) { return {if: cond, add: {zh: zh, en: en}}; }        // extra paragraph (≤45 zh)
  function AT(cond, zh, en) { return {if: cond, text: {zh: zh, en: en}}; }      // replaces the main text (≤90 zh)
  function RA(cond, zh, en) { return {if: cond, text: {zh: zh, en: en}}; }      // resultAlt entry
  function F(f) { return {flag: f}; }
  function NF(f) { return {notFlag: f}; }
  function ANYF() { return {anyFlag: [].slice.call(arguments)}; }
  function FROM() { return {fromNode: [].slice.call(arguments)}; }
  function G(zh, en) { return {zh: zh, en: en}; }                               // gather label (SPEC §20c)
  function J(zh, en) { return {zh: zh, en: en}; }                               // justified jump (SPEC §32.1 rule 3)

  var TAETHRA = S("aeldari_seer", "塔艾丝拉先知", "Farseer Taethra");
  var SYLVAEN = S("aeldari_ranger", "游侠西尔凡", "Sylvaen the Ranger");
  var MIRETH  = S("aeldari_guardian", "守护者米瑞丝", "Guardian Mireth");
  var ELLARIS = S("aeldari_bonesinger", "灵骨歌者艾拉瑞斯", "Bonesinger Ellaris");
  var DANCER  = S("aeldari_masked", "镜面舞者", "The Mirror-Masked Dancer");
  var VHESSRA = S("drukhari_raider", "维丝拉", "Vhessra");
  var EXARCH  = S("aeldari_guardian", "相位督军", "The Exarch");
  var ELDER   = S("aeldari_ranger", "流亡者长老", "Exodite Elder");
  var SEYL    = S("aeldari_seer", "恩灵使者赛尔", "Seyl, Herald of Ynnead");
  var DAEMON  = S("greater_daemon_slaanesh", "无餍者", "The Unsated");
  var MARTA   = S("hive_foreman", "玛尔塔监工", "Overseer Marta");
  var JORBAN  = S("preacher", "乔班神父", "Father Jorban");
  var EDDA    = S("guardsman", "埃达", "Edda");

  var N = {};

  /* ============ Chapter 1 · Omens in the Wheat (origin: agri — the default opening) ============ */
  N.eld_101 = {chapter: 1, scene: "jungle", speaker: null,
    text: L("瓦尔达农业星，收割季。麦浪一直铺到天边，空气里全是谷壳。\n妹妹妮尔骑在你肩上数运粮船：“一、二……今年怎么一艘都没有？”\n天上确实空荡荡的。星语塔已经三天没亮灯了。",
            "Valda, an agri-world, harvest season. Wheat rolls to the horizon; the air is all chaff.\nYour little sister Nell rides your shoulders, counting grain ships. “One, two... why aren't there any this year?”\nThe sky is empty. The astropath tower hasn't lit up in three days."),
    codex: ["place_valda"],
    choices: [
      C("去打谷场上工", "Head to the threshing floor", "eld_102",
        RS("你把妮尔放下，让她跟着。她一路上还在数，数的是天上没有的船。", "You set Nell down and let her tag along. She keeps counting all the way: ships that aren't there.")),
      C("带妮尔去田边的老石阵", "Take Nell to the old stones at the field's edge", "eld_103",
        RS("妮尔喜欢那排黑石头。她说它们夜里会哼歌。", "Nell loves the row of black stones. She says they hum at night."))
    ]};

  N.eld_102 = {chapter: 1, scene: "manufactorum", speaker: MARTA, time: {h: 1},
    gather: G("打谷场", "threshing floor"),
    text: L("打谷场上挤满了人，几十个农工排在打谷机边，都在猜运粮船。玛尔塔监工在名册上画勾：“什一税照交。”\n你问起船，她压低声音：“塔三天没回话了。去年那艘什一税船，也没听说到了奥雷克斯。”",
            "The threshing floor is crowded: dozens of hands queue at the threshers, all guessing about the grain ships. Overseer Marta ticks her roll. “The tithe goes up in full.”\nYou ask about ships. She lowers her voice. “The tower's been silent three days. And nobody's heard that last year's tithe ship ever reached Aurex.”"),
    choices: [
      C("低头干活", "Keep your head down and work", "eld_104",
        E({hp: -5, sanity: 5}, "你干到手掌起泡，一直干到晚祷钟响。麦秆的味道很熟悉，熟悉得让人安心。",
          "You work until your palms blister, right up to the vespers bell. The smell of cut stalks is familiar, and familiar is comforting.")),
      C("溜去星语塔看看", "Sneak off to the astropath tower", "eld_105",
        E({renown: 2}, "玛尔塔看见你走了，没喊。她只是把你的名字从今天的名册上划掉。",
          "Marta sees you go and says nothing. She just strikes your name from today's roll."))
    ]};

  N.eld_103 = {chapter: 1, scene: "ruins", speaker: null, time: {h: 1},
    text: L("老石阵立在麦田尽头，黑得发亮，像一排牙。没人记得是谁立的。\n妮尔从犁沟里捡起一块白石头，温的，滑得像骨头。\n远处山脊上有一圈白石头，中间站着一个披斗篷的高个子。你一眨眼，他就不见了。",
            "The old stones stand where the wheat ends, black and gleaming, like a row of teeth. No one remembers who raised them.\nNell picks a white stone out of a furrow. It's warm, smooth as bone.\nOn the far ridge stands a ring of white stones, and in it a tall cloaked figure. You blink, and he's gone."),
    codex: ["place_valda_tomb"],
    choices: [
      C("把白石头收进口袋", "Pocket the white stone", "eld_104",
        E({renown: 3, set: {runeStone: true}}, "石头贴着你的腿，一直是温的。傍晚你去了礼拜堂，它还是温的。",
          "The stone stays warm against your leg. By evening, at the chapel, it's still warm.")),
      C("追上山脊", "Run up the ridge after him", "eld_106",
        E({hp: -5}, "你在麦茬里摔了一跤，膝盖擦破了。山脊上的风里有一股陌生的甜香。",
          "You fall in the stubble and skin a knee. The wind on the ridge smells of something strange and sweet."))
    ]};

  N.eld_104 = {chapter: 1, scene: "cathedral", speaker: JORBAN, time: {h: 7},
    text: L("礼拜堂里坐满了做晚祷的人。乔班神父为丰收祝福，声音比往年小，后排有人在嘀咕地底的嗡嗡声。\n“牲口都不叫了，”神父耳语，“我问过帝皇，他没回答。”\n圣像脚下的石板裂开一道缝，透出绿光。",
            "The chapel is full for evening prayers. Father Jorban blesses the harvest, quieter than other years; in the back pews people mutter about the humming underground.\n“The animals have gone silent,” he whispers to you. “I asked the Emperor. He didn't answer.”\nThe flagstone beneath the saint's statue cracks. Green light seeps through."),
    codex: ["imp_emperor"],
    choices: [
      C("抱起妮尔回家", "Pick up Nell and go home", "eld_107",
        RS("人群挤向门口。你把妮尔抱得很紧，一路没回头。", "The crowd surges for the door. You hold Nell tight and don't look back.")),
      C("去星语塔求救", "Run to the tower for help", "eld_105",
        E({sanity: -5}, "你把妮尔托给邻居，穿过麦田。脚下的土地在轻轻震动，像有什么在下面翻身。",
          "You leave Nell with a neighbour and cross the fields. The ground trembles faintly, as if something below is turning over in its sleep."))
    ]};

  N.eld_105 = {chapter: 1, scene: "hive_spire", speaker: null, time: {h: 2},
    text: L("星语塔的门开着。星语者们围坐成一圈，安静地睡着，怎么叫都叫不醒。\n主天线被切断了，切口平滑得像玻璃。\n控制台上落着一根细长的白羽毛，不属于这颗星球上任何一种鸟。",
            "The tower door stands open. The astropaths sit in their circle, peacefully asleep. No shouting wakes them.\nThe main array has been severed, the cut smooth as glass.\nOn the console lies a long white feather. No bird on this world grows one like it."),
    choices: [
      C("接通备用线路，发出求救", "Patch the backup line and call for help", null,
        R(0.45, null, "eld_108", "eld_107",
          "备用线路吱吱作响，指示灯亮了。", "The backup line crackles. A light comes on.",
          "火花在你指尖炸开。线路彻底死了，塔外的麦田开始发出绿光。", "Sparks burst at your fingertips. The line dies for good, and the fields outside begin to glow green.")),
      C("揣起羽毛，跑回家", "Take the feather and run home", "eld_107",
        E({sanity: -5}, "羽毛轻得像没有重量，你却觉得口袋在往下坠。",
          "The feather weighs nothing, yet your pocket feels heavy."))
    ]};

  N.eld_106 = {chapter: 1, scene: "jungle", speaker: SYLVAEN, time: {h: 1},
    text: L("斗篷人就坐在山脊背面的白石间，像在等你。他的脸太窄，耳朵太尖，眼睛里没有一点温度。\n“回家去，猿人。”他礼貌得过分，“今晚握紧你妹妹的手。”\n他的长枪比他还高。",
            "The cloaked one sits among the white stones just past the ridge, as if waiting. His face is too narrow, his ears too sharp, his eyes without warmth.\n“Go home, mon-keigh.” He is excessively polite. “Tonight, hold your sister's hand.”\nHis long rifle is taller than he is."),
    codex: ["eld_rangers", "eld_monkeigh"],
    choices: [
      C("“你是谁？为什么这么说？”", "“Who are you? Why say that?”", "eld_107",
        E({set: {sylvaenWord: true}}, "他想了很久，像在挑一个你听得懂的词。“记账的人。”然后他走进了风里。",
          "He thinks a long while, as if choosing a word you could understand. “One who keeps accounts.” Then he walks into the wind.")),
      C("抓住他的斗篷", "Grab his cloak", null, M(
        R(0.35, "hp", "eld_106b", "eld_107",
          "你抓住了一角布。他低头看你的手，像看一只落在袖子上的虫。",
          "You catch a corner of cloth. He looks at your hand like an insect on his sleeve.",
          "你扑了个空，脸朝下栽进麦茬。抬起头时，山脊上只剩风。",
          "You grab at nothing and land face-first in the stubble. When you look up, only wind is on the ridge."),
        {effects: {hp: -5}}))
    ]};

  N.eld_106b = {chapter: 1, scene: "jungle", speaker: SYLVAEN,
    text: L("他没有抽回斗篷，只是等你松手。\n“黄昏，山脊上的白石环。”他望向田埂上的妮尔，“带上她。只带她。”\n“为什么告诉我？”\n“因为账上记着，你会问。”他抽回斗篷，走进了风里。",
            "He doesn't pull the cloak away; he waits for you to let go.\n“Dusk. The ring of white stones on the ridge.” He looks toward Nell on the field path. “Bring her. Only her.”\n“Why tell me?”\n“Because the ledger says you would ask.” He frees the cloak and walks into the wind."),
    effects: {renown: 3, set: {duskStones: true}},
    choices: [
      C("回家，握紧妮尔的手", "Go home and hold Nell's hand", "eld_107",
        RS("一路上你都在想“黄昏”这个词。你不知道是哪一天的黄昏。", "All the way home you turn the word “dusk” over. You don't know which day's dusk he meant."))
    ]};

  N.eld_108 = {chapter: 1, scene: "hive_spire", speaker: null, time: {h: 1},
    text: L("一阵杂音，然后是一声长长的蜂鸣。求救信号发出去了，只有一行，没有回音。\n也许一年后，某个遥远的星语者会在梦里听见它。\n窗外，老石阵的方向亮起了绿光。",
            "Static, then one long tone. The call goes out: a single line, no reply.\nPerhaps a year from now some distant astropath will hear it in a dream.\nOutside, green light kindles where the old stones stand."),
    effects: {renown: 5, set: {sentCall: true}},
    choices: [
      C("跑回家找妮尔", "Run home to Nell", "eld_107")
    ]};

  N.eld_107 = {chapter: 1, scene: "tomb_exterior", speaker: null, foe: "necron_warrior", time: {h: 5},
    text: L("午夜，田边的老石阵亮了。绿光沿着犁沟流淌，地底升起一座黑色金字塔，银色的骷髅排着队走出来。\n父亲去守谷仓，母亲在镇上赶集，都没回来。\n远处山脊的白石间，一个披斗篷的人站着，在看。",
            "At midnight the old stones at the field's edge light up. Green fire runs along the furrows; a black pyramid rises from the earth and silver skeletons file out in ranks.\nFather went to guard the granary; Mother was at market in town. Neither has come back.\nOn the far ridge, among the white stones, a cloaked figure stands watching."),
    codex: ["nec_necrons", "place_valda_tomb"],
    choices: [
      C("抓起妮尔就跑", "Grab Nell and run", "eld_107r",
        E({hp: -5}, "你抱着妮尔冲出家门。身后，金属的脚踩碎麦穗，整齐得像钟。",
          "You burst out the door with Nell in your arms. Behind you, metal feet crush the wheat in time, like a clock.")),
      C("躲在窗后，看它们做什么", "Hide behind the window and watch", "eld_107w",
        RS("你吹灭了灯，把妮尔按在身边。窗外的绿光一明一暗，像在呼吸。", "You blow out the lamp and pull Nell close. Outside, the green light swells and fades like breathing."))
    ]};

  /* ============ Origin prologue · Pilgrim-prophet (eld_o_pilgrim_*) ============ */
  N.eld_o_pilgrim_1 = {chapter: 1, scene: "ship_interior", speaker: null,
    gather: G("货舱", "cargo hold"),
    text: L("补给船的货舱里挤着回乡的季节工和几个船员，一壶酒在人手间传。你缩在农具箱中间。\n十年来你一直做同一个梦：一个白袍女人，几颗石头绕着她的头转。大多数人当你是疯子。\n下一站，瓦尔达。",
            "In the supply ship's cargo hold, seasonal hands heading home and a few crew pass a flask around. You huddle among crates of farm tools.\nFor ten years you've dreamed one dream: a white-robed woman, stones circling her head. Most people think you mad.\nNext stop: Valda."),
    codex: ["place_valda"],
    choices: [
      C("把梦讲给船员听", "Tell the crew your dream", "eld_o_pilgrim_2",
        E({renown: 3, sanity: -5, set: {toldCrew: true}}, "船员们笑了一路。只有一个老水手没笑，下船时塞给你一块干粮：“别在那颗星球上说太大声。”",
          "The crew laugh the whole way. One old deckhand doesn't. Disembarking, he slips you a ration bar. “Don't say it too loud down there.”")),
      C("闭眼，什么也不说", "Close your eyes and say nothing", "eld_o_pilgrim_2",
        E({sanity: 5, set: {dreamTurned: true}}, "你一路睡到着陆。这次的梦里，那个女人第一次转过头来看你。",
          "You sleep all the way down. In this dream, for the first time, the woman turns her head to look at you."))
    ]};

  N.eld_o_pilgrim_2 = {chapter: 1, scene: "jungle", speaker: null, time: {d: 1},
    text: L("你在麦田边讲道，农人们绕开你走。只有一个小女孩停下来，给你端来一碗水。\n“我叫妮尔。”她盯着你，“我也梦见过石头会转。”\n她的父母不太情愿地让你睡进了谷仓。",
            "You preach at the edge of the wheat; the farmers walk around you. Only a little girl stops and brings you a bowl of water.\n“I'm Nell.” She stares at you. “I've dreamed of spinning stones too.”\nHer parents, not very willingly, let you sleep in their barn."),
    choices: [
      C("在谷仓住下，帮她家干活", "Stay in the barn and help with chores", "eld_o_pilgrim_4",
        E({hp: 5, sanity: 5}, "两天里你学会了捆麦子。妮尔每晚都来听你讲梦，听到一半就睡着。",
          "Over two days you learn to bind sheaves. Every night Nell comes to hear your dream and falls asleep halfway.")),
      C("去田边的老石阵过夜", "Spend the night at the old stones", "eld_o_pilgrim_3", {result: L("你枕着包袱躺下。包袱里有在圣地阿尔德林求来的圣徽，它从没让你少做一个梦。", "You lie down with your bundle for a pillow. In it is a holy medal from the shrine world Aldrin. It has never spared you a single dream.")})
    ]};

  N.eld_o_pilgrim_3 = {chapter: 1, scene: "ruins", speaker: S("omen_farseer", "梦", "Dream"), time: {h: 9},
    text: L("你枕着黑石头睡着了。梦太清楚：白袍女人站在一道光门前，门立在一圈白石中间。\n她看着你，说了一个词。你听不懂，却知道意思——“还没到时候”。\n醒来时你在流鼻血，山脊上有个斗篷人在看你。",
            "You fall asleep against the black stones. The dream is too clear: the white-robed woman before a gate of light, set in a ring of white stones.\nShe looks at you and speaks one word. You don't know the language, but you know the meaning: not yet.\nYou wake with a nosebleed. On the far ridge, a cloaked figure is watching you."),
    effects: {sanity: -5},
    codex: ["chaos_warp", "place_valda_tomb"],
    choices: [
      C("记住那个词", "Memorise the word", "eld_o_pilgrim_4",
        E({renown: 5, set: {heardWord: true}, taint: {tzeentch: 15}}, "你在泥地上写了一百遍，还是写不对。但它在你舌头底下，像一颗种子。",
          "You write it in the mud a hundred times and never get it right. But it sits under your tongue like a seed.")),
      C("擦掉血，回谷仓", "Wipe the blood away and go back", "eld_o_pilgrim_4",
        RS("你用袖子擦掉血。等你再抬头，山脊上已经没人了。", "You wipe the blood on your sleeve. When you look up again, the ridge is empty."))
    ]};

  N.eld_o_pilgrim_4 = {chapter: 1, scene: "cathedral", speaker: JORBAN, time: {d: 1},
    text: L("乔班神父把你堵在礼拜堂门口，盯着你鼻孔下的血痕。\n“会做准的梦，会流鼻血。”他压低声音，“孩子，黑船来的时候，会先找你这样的人。”\n他身后，圣像脚下的石板裂开一道缝，透出绿光。",
            "Father Jorban corners you at the chapel door, eyeing the blood under your nose.\n“Dreams that come true. Nosebleeds.” He lowers his voice. “Child, when the Black Ships come, they look for your kind first.”\nBehind him, the flagstone beneath the saint's statue cracks. Green light seeps through."),
    alt: [AT(FROM("eld_o_pilgrim_2"), "乔班神父把你堵在礼拜堂门口，盯着你鼻孔下的血痕：昨晚给妮尔讲梦，你又流了鼻血。\n“会做准的梦，会流鼻血。孩子，黑船来的时候，会先找你这样的人。”\n他身后，石板裂开一道缝，透出绿光。",
             "Father Jorban corners you at the chapel door, eyeing the blood under your nose. It bled again last night as you told Nell your dream.\n“Dreams that come true. Nosebleeds. Child, when the Black Ships come, they look for your kind first.”\nBehind him a flagstone cracks. Green light seeps through."),
          A(F("toldCrew"), "“补给船上的人说来了个讲梦的疯子，”他叹气，“消息传得比收成还快。”",
            "“The supply crew say a madman came down telling dreams,” he sighs. “News travels faster than harvests.”")],
    codex: ["imp_psyker", "imp_black_ships"],
    choices: [
      C("“我只是个朝圣者。”", "“I'm only a pilgrim.”", "eld_o_pilgrim_5",
        E({sanity: -5, set: {liedJorban: true}}, "他看了你很久，叹了口气：“那就当个安静的朝圣者。”你们都知道你在撒谎。",
          "He studies you a long time and sighs. “Then be a quiet pilgrim.” You both know you're lying.")),
      C("把梦全告诉他", "Tell him the whole dream", "eld_o_pilgrim_5",
        E({renown: 3, set: {jorbanKnows: true}}, "神父听完，没去报告。他只记下一句：“光门，白石头。”然后画了个圣徽：“愿帝皇的光挡在你和它之间。”",
          "The priest hears you out and doesn't report you. He notes one thing: “A gate of light, white stones.” Then the aquila: “May the Emperor's light stand between you and it.”"))
    ]};

  N.eld_o_pilgrim_5 = {chapter: 1, scene: "tomb_exterior", speaker: null, foe: "necron_warrior", time: {h: 7},
    text: L("午夜，老石阵亮了，和梦里一样。金字塔升起，银色骷髅排队走出。\n绿光扫过妮尔家的农舍。你冲进去时，只剩妮尔缩在灶台后，父母不见了。\n窗外山脊的白石间，有个斗篷人在看。妮尔朝你伸出手。",
            "At midnight the old stones light up, exactly as in your dream. A black pyramid rises from the wheat; silver skeletons file out in ranks.\nGreen light sweeps Nell's farmhouse. When you burst in, only Nell is left, curled behind the stove. Her parents are gone.\nThrough the window, among the white stones on the ridge, a cloaked figure watches. Nell reaches for you."),
    effects: {sanity: -8},
    codex: ["nec_necrons"],
    choices: [
      C("抱起她就跑", "Pick her up and run", "eld_107r",
        RS("她很轻。你跑出门时，她在你耳边小声说：“你梦见过这个，对不对？”",
          "She weighs almost nothing. As you run, she whispers in your ear, “You dreamed this, didn't you?”")),
      C("和她一起躲在灶台后面", "Hide behind the stove with her", "eld_107w",
        RS("你把她搂进怀里，捂住她的嘴。灶膛里还有余温。", "You pull her into your arms and cover her mouth. The stove is still warm."))
    ]};

  /* ============ Origin prologue · Defence trooper (eld_o_trooper_*) ============ */
  N.eld_o_trooper_1 = {chapter: 1, scene: "barracks", speaker: EDDA,
    gather: G("营房", "barracks"),
    text: L("营房里，第三连挤在弹药箱边打牌，邻铺的老兵在吹牛。你们这辈子最大的敌人是偷粮的老鼠。\n埃达把牌一拍：“星语塔三天没出声了。中尉说是小故障。”\n她压低声音，“小故障要派两个人带枪去看？”",
            "In the barracks Third Company crowds round an ammo crate playing cards; a veteran on the next bunk is boasting. The worst enemy any of you has faced is grain rats.\nEdda slaps down her cards. “Tower's been silent three days. Lieutenant says it's a small fault.”\nShe lowers her voice. “A small fault that needs two armed troopers?”"),
    codex: ["place_valda", "imp_guard"],
    choices: [
      C("主动请缨去查看", "Volunteer to go check", "eld_o_trooper_2",
        E({renown: 3, set: {volunteered: true}}, "中尉在名单上写下你的名字，表情像如释重负。",
          "The lieutenant writes down your name, looking relieved.")),
      C("先打完这把牌", "Finish the hand first", "eld_o_trooper_2",
        E({sanity: 5, set: {eddaDebt: true}}, "你赢了埃达半周的口粮。“记账，”她说。然后中尉点了你们俩的名。",
          "You win half a week of Edda's rations. “Put it on my tab,” she says. Then the lieutenant calls both your names."))
    ]};

  N.eld_o_trooper_2 = {chapter: 1, scene: "hive_spire", speaker: EDDA, time: {h: 5},
    text: L("星语者们围坐成圈，安详地睡着，叫不醒。主天线被切断了，切口平滑得像玻璃。\n埃达捡起一根细长的白羽毛：“这不是我们这儿的鸟。”\n她看你一眼，“也不是我们这儿的刀。”",
            "The astropaths sit in a circle, peacefully asleep. No one wakes them. The main array is severed, the cut smooth as glass.\nEdda picks up a long white feather. “No bird of ours.”\nShe looks at you. “No blade of ours either.”"),
    choices: [
      C("按条令，向上级报告", "Report up the chain, by the book", "eld_o_trooper_3",
        E({renown: 2, set: {reported: true}}, "你在报告上签了名。回电只有一句：“保持警戒，勿制造恐慌。”埃达把回执揉成一团。",
          "You sign the report. The reply is one line: “Stay alert. Do not cause panic.” Edda crumples the receipt.")),
      C("试着自己接通线路", "Try to fix the line yourself", null,
        R(0.4, null, "eld_o_trooper_2s", "eld_o_trooper_3",
          "你拆开面板，接上两根烧黑的线。指示灯闪了一下。",
          "You open the panel and twist two scorched wires together. A light flickers.",
          "线路在你手里炸出火花，彻底死了。埃达骂了一句，把你从烟里拖出来。",
          "The line sparks in your hands and dies for good. Edda swears and drags you out of the smoke."))
    ]};

  N.eld_o_trooper_2s = {chapter: 1, scene: "hive_spire", speaker: EDDA,
    text: L("一声长长的蜂鸣。求救信号发了出去，只有一行，没有回音。\n埃达盯着那盏亮起的小灯：“至少有人会知道。”\n“知道了又怎样？”\n她没回答，把白羽毛塞进了你的口袋：“证据。你收着。”",
            "One long tone. The call goes out: a single line, no reply.\nEdda stares at the little lit lamp. “At least someone will know.”\n“And then what?”\nShe doesn't answer. She tucks the white feather into your pocket. “Evidence. You keep it.”"),
    effects: {renown: 5, set: {sentCall: true}},
    choices: [
      C("回营交差", "Head back to report", "eld_o_trooper_3",
        RS("中尉没夸你，只让你今晚去石阵附近巡逻。", "The lieutenant doesn't praise you. He just puts you on tonight's patrol near the old stones."))
    ]};

  N.eld_o_trooper_3 = {chapter: 1, scene: "trench", speaker: null, time: {h: 9},
    text: L("夜间巡逻，老石阵附近。一声轻响，你的激光枪枪管断成两截，切口还冒着烟——你却毫发无伤。\n山脊的白石间，一个披斗篷的影子收起长枪，冲你微微点了点头。\n那是警告。他打中了他想打中的地方。",
            "Night patrol near the old stones. A soft crack: your lasgun barrel falls in two, the cut still smoking. You're untouched.\nAmong the white stones on the ridge, a cloaked shape lowers a long rifle and nods to you, very slightly.\nA warning. He hit exactly what he meant to."),
    codex: ["eld_rangers"],
    choices: [
      C("拔出手枪还击", "Draw your sidearm and return fire", "eld_o_trooper_4",
        E({hp: -10, renown: 2, set: {firedOnRanger: true}, taint: {khorne: 15}}, "你打空了一个弹匣。第二声轻响，你的手枪也断了，虎口震裂。山脊上已经没人了。",
          "You empty a magazine. A second soft crack: your pistol breaks too, splitting the web of your hand. The ridge is empty.")),
      C("放下枪，举起手", "Lower your weapon, raise your hands", "eld_o_trooper_4",
        E({sanity: -5, renown: 3, set: {surrendered: true}}, "影子停了一下，像有点意外，然后消失在麦田里。埃达说你疯了。你觉得自己刚刚活了下来。",
          "The shape pauses, as if mildly surprised, then melts into the wheat. Edda says you're mad. You feel you've just survived something."))
    ]};

  N.eld_o_trooper_4 = {chapter: 1, scene: "tomb_exterior", speaker: EDDA, foe: "necron_warrior", time: {h: 20},
    text: L("第二天午夜，老石阵亮了。黑色金字塔从麦田下升起，银色的骷髅排着队走出来。\n第三连开火了。骷髅倒下，又站起来，伤口像水银一样合拢。\n“撤！”中尉喊完这一声，就被绿光吞没了。",
            "Next midnight the old stones light up. A black pyramid rises from the wheat; silver skeletons file out in ranks.\nThird Company opens fire. The skeletons fall, then stand again, wounds closing like quicksilver.\n“Fall back!” the lieutenant shouts, and the green light takes him."),
    effects: {sanity: -5},
    codex: ["nec_necrons", "place_valda_tomb"],
    choices: [
      C("掩护埃达撤退", "Cover Edda's retreat", "eld_o_trooper_5",
        E({hp: -15, renown: 5}, "一道绿光擦过你的肩膀，整条胳膊瞬间麻了。埃达回头把你拽进了麦田。",
          "A green bolt grazes your shoulder and the whole arm goes numb. Edda turns back and hauls you into the wheat.")),
      C("扔下阵地就跑", "Abandon the line and run", "eld_o_trooper_5",
        E({sanity: -5, renown: -3, set: {wronged_edda: true}}, "你跑得比任何人都快。身后，埃达喊了你的名字，枪声一支支停了。",
          "You run faster than anyone. Behind you Edda shouts your name; the rifles fall silent one by one."))
    ]};

  N.eld_o_trooper_5 = {chapter: 1, scene: "burning_city", speaker: null, time: {h: 2},
    text: L("你们驻扎时借住的那户农家着了火。你冲进去，只找到了小女儿妮尔，缩在水缸后面。\n她认得你，你给她削过木头小兵。\n她没哭，只问：“你的枪呢？”",
            "The farmhouse where you were billeted is on fire. You charge in and find only the little daughter, Nell, curled behind the water barrel.\nShe knows you. You once whittled her a wooden soldier.\nShe doesn't cry. She only asks, “Where's your gun?”"),
    alt: [A(F("wronged_edda"), "你一路跑到这里，身后再没传来埃达的声音。", "You ran all the way here. No more of Edda's voice came from behind you."),
          A(NF("wronged_edda"), "埃达把你拖到水渠边，塞给你她的手枪，就回路口收拢剩下的人了。", "Edda dragged you to the ditch, pressed her pistol on you, and went back to gather the others at the crossroads.")],
    effects: {hp: -5},
    choices: [
      C("把她背起来就跑", "Get her on your back and run", "eld_107r",
        RS("她搂住你的脖子，搂得很紧。外面，绿光正一片片扫过农庄。",
          "She wraps her arms around your neck, tight. Outside, green light sweeps the farms one by one.")),
      C("背着她躲进地窖", "Take her down into the root cellar", "eld_107w",
        RS("你拉上地窖的木板门。头顶的火在噼啪作响，地窖里很凉。", "You pull the cellar boards shut. Overhead the fire crackles; down here it's cool."))
    ]};

  /* ============ Chapter 2 · The Harvest ============ */
  N.eld_107r = {chapter: 2, scene: "jungle", speaker: null, time: {h: 4}, bridge: true,
    text: L("后半夜，你抱着妮尔在麦田里跑，麦秆抽在脸上。身后，金属的脚步整齐得像钟。\n妮尔跑丢了一只鞋，一直在你耳边数：“一百零一、一百零二……”她说数着就不怕。\n天快亮时，你们滚进了一条灌溉渠。",
            "Deep in the night you run through the wheat with Nell, stalks whipping your face. Behind you, metal footsteps keep time like a clock.\nNell has lost a shoe. She counts in your ear the whole way, “A hundred and one, a hundred and two...” Counting, she says, keeps the fear off.\nNear dawn you tumble into an irrigation ditch."),
    alt: [A(F("origin_pilgrim"), "数到一千时，她小声问：“你梦里，我们跑出去了吗？”", "At a thousand she whispers, “In your dream, do we get away?”"),
          A(F("origin_trooper"), "她趴在你背上，摸着你肩上空空的枪背带。", "On your back, she pats the empty sling where your rifle used to hang.")],
    choices: [
      C("天亮了，爬出水渠看看", "It's light. Climb out and look.", "eld_201",
        RS("你先探出头。风里全是烧焦麦子的味道。", "You raise your head first. The wind smells of burnt wheat."))
    ]};

  N.eld_107w = {chapter: 2, scene: "ruins", speaker: null, time: {h: 5}, bridge: true,
    text: L("你捂着妮尔的嘴，看了一整夜。\n骷髅挨家挨户地走，在每扇门前停一下，抬手，一道绿光。房子还在，人没了。它们像在清单上打勾。\n天亮前它们走远了，你才敢带着妮尔出门。满村都是空房子。",
            "You keep a hand over Nell's mouth and watch all night.\nThe skeletons go house to house, pausing at each door: a raised hand, a green flash. The house remains. The people don't. They seem to be ticking a list.\nBefore dawn they move on, and only then do you dare lead Nell out. The village is all empty houses."),
    alt: [AT(F("origin_trooper"), "你从地窖木板的缝里看了一整夜。\n骷髅挨家挨户地走，在每扇门前停一下，抬手，一道绿光。人没了，它们像在清单上打勾。\n天亮前它们走远了，你才敢背着妮尔爬出来。",
             "You watch all night through a gap in the cellar boards.\nThe skeletons go house to house: a pause at each door, a raised hand, a green flash. The people are gone, as if ticked off a list.\nBefore dawn they move on, and only then do you climb out with Nell on your back.")],
    effects: {sanity: -5, renown: 3, set: {sawTally: true}},
    choices: [
      C("出村，往高处走", "Leave the village for higher ground", "eld_201",
        RS("妮尔一直盯着一扇开着的门。门里的桌上，晚饭还摆着。", "Nell keeps staring at one open door. Inside, supper is still on the table."))
    ]};

  N.eld_201 = {chapter: 2, scene: "burning_city", speaker: null, foe: "necron_lord", time: {h: 1},
    text: L("天亮时，瓦尔达在燃烧。没有抢劫，没有喊杀声，只有绿光一片片扫过农庄。\n山丘上站着一个挂满金饰的骷髅领主，像在检阅收回的地产。\n妮尔把脸埋在你脖子里：“帝皇什么时候来？”",
            "By dawn Valda is burning. No looting, no war cries—just green light sweeping farm after farm.\nOn a hill stands a skeletal lord hung with gold, surveying the land like reclaimed property.\nNell buries her face in your neck. “When is the Emperor coming?”"),
    codex: ["nec_necrons", "imp_imperium", "place_arcosa"],
    choices: [
      C("去镇外的着陆场找穿梭机", "Head for the landing field outside town", "eld_202",
        RS("逃难的人都往一个方向走。你跟上了人流。", "Everyone fleeing is walking the same way. You join the stream.")),
      C("躲进路下的涵洞，等天黑", "Hide in the culvert under the road till dark", "eld_201b",
        E({sanity: -5}, "你逆着人流钻进涵洞。有人骂你疯了，没人跟来。",
          "You slip into the culvert against the flow of people. Someone calls you mad. No one follows."))
    ]};

  N.eld_201b = {chapter: 2, scene: "ruins", speaker: null, time: {h: 10},
    text: L("你们在涵洞里躲了一整天。扫描的绿光一遍遍从洞口扫过，妮尔睡着了又惊醒。\n黄昏前，你想起山脊上那圈白石头：那个披斗篷的人站在那里，看了一整夜。",
            "You hide in the culvert all day. Scanning light sweeps the mouth again and again; Nell sleeps and jolts awake.\nBefore dusk you think of the ring of white stones on the ridge: the cloaked figure stood there, watching all night."),
    alt: [AT(F("duskStones"), "你们在路下的涵洞里躲了一整天。扫描的绿光一遍遍从洞口扫过，妮尔睡着了又惊醒。\n黄昏前，你想起斗篷人的话：黄昏，山脊上的白石环。带上她。只带她。",
             "You hide in the culvert all day. Scanning light sweeps the mouth again and again; Nell sleeps and jolts awake.\nBefore dusk you remember the cloaked one's words: dusk, the ring of white stones on the ridge. Bring her. Only her."),
          A(F("runeStone"), "口袋里的白石头在发热，热的那一面朝着山脊。", "The white stone in your pocket is warm, warmest on the side facing the ridge."),
          A(F("origin_pilgrim"), "你梦里那道光门，就立在一圈白石头中间。", "The gate of light in your dream stood in a ring of white stones.")],
    effects: {set: {nellKept: true}},
    choices: [
      C("背起妮尔，爬上山脊", "Carry Nell up the ridge", "eld_203",
        RS("坡很陡。妮尔在你背上睡着了，呼吸很轻。", "The slope is steep. Nell falls asleep on your back, breathing lightly."))
    ]};

  N.eld_202 = {chapter: 2, scene: "ruins", speaker: MARTA, time: {h: 5},
    gather: G("着陆场", "landing field"),
    text: L("着陆场上挤满了逃难的人，有人在喊名字，有人抱着包袱哭。只剩一架破旧的货运穿梭机。\n玛尔塔监工拿着名册，嗓子已经哑了：“只能再塞一个孩子。”\n她看着妮尔：“别指望别的船。”",
            "The landing field is packed with refugees: some shouting names, some weeping over bundles. One battered cargo shuttle is all that's left.\nOverseer Marta holds her roll, voice gone hoarse. “Room for one more child.”\nShe looks at Nell. “Don't count on another ship.”"),
    alt: [A(F("sentCall"), "有人说星语塔发出过求救。玛尔塔苦笑：“那就等着有人来给我们收尸。”", "Someone says a call got out from the tower. Marta laughs bitterly. “Then someone will come to count the bodies.”"),
          A(F("origin_pilgrim"), "她不认得你，只认得妮尔：“你是借住在她家的那个讲梦的？”", "She doesn't know you, only Nell. “You're the dream-preacher in their barn?”")],
    choices: [
      C("把妮尔交给玛尔塔", "Hand Nell to Marta", "eld_202l",
        E({sanity: 5, renown: 5, set: {nellLander: true}}, "你把妮尔递过去。她的手还攥着你的袖子。",
          "You hand Nell over. Her fist is still closed on your sleeve.")),
      C("不，她跟着我", "No. She stays with me.", "eld_204",
        E({sanity: -5, set: {nellKept: true}}, "玛尔塔没劝。她点点头，把名册上的一个名字划掉了。",
          "Marta doesn't argue. She nods, and crosses one name off her roll."))
    ]};

  N.eld_202l = {chapter: 2, scene: "ruins", speaker: null, time: {h: 1},
    text: L("妮尔抓着你的袖子不放，你一根一根掰开她的手指。\n舱门关上前，她喊的是你的名字。穿梭机歪歪扭扭地升空了，你不敢看它飞了多远。\n玛尔塔在名册上画了最后一个勾，把笔扔了。",
            "Nell won't let go of your sleeve. You prise her fingers loose one by one.\nAs the hatch closes, she is shouting your name. The shuttle wobbles into the sky; you can't bear to watch how far it gets.\nMarta ticks one last name on her roll and throws the stylus away."),
    choices: [
      C("回头往镇上走", "Turn back toward town", "eld_204",
        RS("手里空了。你不知道该拿这双手做什么。", "Your hands are empty. You don't know what to do with them."))
    ]};

  N.eld_204 = {chapter: 2, scene: "burning_city", speaker: EDDA, foe: "necron_warrior", time: {h: 1},
    grudgeLine: {npc: "edda", text: L("埃达抓着你的手臂，指节发白。上一回，你是第一个跑的。", "Edda's grip on your arm is white-knuckled. Last time, you were the first to run.")},
    text: L("镇外的路口，一个满脸黑灰的防卫军士兵一把抓住你：“骷髅过来了！帮我守住路口，让最后一批人上山！”\n她叫埃达。远处，一排银色的身影正穿过冒烟的麦田。",
            "At the crossroads outside town a soot-black defence trooper grabs your arm. “Skeletons incoming! Help me hold the crossroads so the last ones reach the hills!”\nHer name is Edda. A line of silver figures is crossing the smoking wheat."),
    alt: [AT(F("origin_trooper"), "镇外的路口，你又看见了埃达：满脸黑灰，身边只剩四五个逃难的人。\n“你也活着，”她说，“那就帮我守住路口，让最后一批人上山！”\n远处，一排银色的身影正穿过冒烟的麦田。",
             "At the crossroads outside town you find Edda again: soot-black, four or five refugees behind her.\n“You're alive too,” she says. “Then help me hold the crossroads so the last ones reach the hills!”\nA line of silver figures is crossing the smoking wheat."),
          A(F("nellKept"), "你把妮尔塞进路下的涵洞：“数到一千再出来。”她点点头，开始数。", "You push Nell into the culvert under the road. “Count to a thousand, then come out.” She nods and starts counting."),
          A(F("eddaDebt"), "“你赢的那半周口粮，”埃达说，“现在还。”", "“That half-week of rations you won,” Edda says. “Pay it back now.”")],
    choices: [
      C("跟埃达守住路口", "Hold the crossroads with Edda", null, M(
        R(0.5, "hp", "eld_205", "eld_206",
          "你打中了一个。它倒下，站起，又倒下。你们拖住了它们一刻钟——够了。",
          "You hit one. It falls, rises, falls again. You hold them for a quarter hour. It's enough.",
          "一道绿光擦过你的肩膀，整条胳膊瞬间没了知觉。你栽进了水沟。",
          "A green bolt grazes your shoulder and the whole arm goes dead. You topple into a ditch."),
        {grudge: {npc: "edda", p: -0.1, note: L("你扔下过阵地。埃达不敢把背交给你。", "You deserted the line. Edda won't turn her back to you.")}})),
      C("和埃达排成射击线，像操练时那样", "Form a firing line with Edda, like drill", null, M(M(ONLY("origin_trooper"),
        R(0.75, "hp", "eld_205", "eld_206",
          "“交替射击！”你们一个打一个装，像训练场上一样。骷髅的队形第一次乱了。",
          "“Alternate fire!” One shoots while one reloads, just like the range. For the first time the skeletons' ranks waver.",
          "操练里没有会自己站起来的靶子。一道绿光扫过，你栽进了水沟。",
          "Drill never had targets that stood back up. A green bolt sweeps you into a ditch.")),
        {grudge: {npc: "edda", p: -0.15, note: L("操练靠信任。她记得你是怎么跑的。", "Drill runs on trust. She remembers how you ran.")}})),
      C("“这回我不跑。”", "“I won't run this time.”", null, M(M(ONLY("wronged_edda"),
        R(0.5, "hp", "eld_205", "eld_206",
          "你站在她身边，一发不漏。埃达没夸你，只往旁边挪了半步，给你让出射击位。",
          "You stand beside her and waste no shot. Edda says nothing; she just shifts half a step to give you room to fire.",
          "你守得不够久。一道绿光扫过，你栽进水沟，听见埃达在喊你的名字——这回是叫你回来。",
          "You don't hold long enough. A green bolt sweeps you into a ditch, and you hear Edda shouting your name, this time to call you back.")),
        {effects: {sanity: -3, renown: 3, set: {forgiven_edda: true}}})),
      C("往山脊跑", "Run for the ridge", "eld_205w",
        E({renown: -3}, "你跑出很远才回头。埃达还守在那里，一个人。",
          "You run a long way before looking back. Edda is still holding the crossroads. Alone."))
    ]};

  N.eld_205 = {chapter: 2, scene: "burning_city", speaker: EDDA, foe: "necron_warrior", time: {h: 1},
    text: L("被你打倒的骷髅又站了起来，伤口像水银一样合拢。\n“它们会自己修好，”埃达喘着气，“我们只是给它们添麻烦。”\n她把最后一块电池塞给你：“去山脊上的白石环。侦察兵说那里有高个子的陌生人。”",
            "The skeleton you shot down stands back up, its wound closing like quicksilver.\n“They mend themselves,” Edda pants. “We're just an inconvenience to them.”\nShe gives you her last power pack. “Go to the white stones on the ridge. Scouts saw tall strangers up there.”"),
    effects: {renown: 5, set: {heldWithEdda: true}},
    choices: [
      C("“一起走！”", "“Come with me!”", "eld_205w", M(
        E({sanity: -5}, "她摇头，转身对着骷髅举枪：“总得有人在这儿。”",
          "She shakes her head and turns her rifle on the skeletons. “Someone has to be here.”"),
        {grudge: {npc: "edda", effects: {sanity: -4}, note: L("你扔下过阵地。她不信这句“一起走”。", "You deserted the line. She doesn't believe “come with me”.")}})),
      C("留下，再陪她守一会儿", "Stay and hold a while longer", "eld_206",
        E({renown: 3}, "你没走。第二轮绿光来的时候，你们俩都没来得及趴下。",
          "You don't leave. When the second wave of green light comes, neither of you gets down in time."))
    ]};

  N.eld_205w = {chapter: 2, scene: "burning_city", speaker: null, time: {h: 4},
    text: L("你横穿了大半片焦黑的麦田，躲开一道又一道扫过来的绿光。\n太阳落到山脊后面时，你爬上了坡。坡顶那圈白石头在暮色里发亮，和田边的黑石头正好相反。",
            "You cross the better part of the blackened fields, ducking sweep after sweep of green light.\nAs the sun drops behind the ridge you climb the slope. At the top the ring of white stones glows in the dusk, the very opposite of the black stones below."),
    alt: [AT(FROM("eld_205"), "身后，埃达的枪声响了很久，然后听不见了。\n你横穿了大半片焦黑的麦田，躲开一道又一道扫过来的绿光。太阳落到山脊后面时，你爬上了坡。坡顶那圈白石头在暮色里发亮。",
             "Behind you Edda's rifle fires for a long time, then falls silent.\nYou cross the better part of the blackened fields, ducking sweep after sweep of green light. As the sun drops behind the ridge you climb the slope. At the top, the ring of white stones glows in the dusk."),
          A(F("nellKept"), "你从涵洞里抱出妮尔时，她已经数到了九千多。", "When you lift Nell out of the culvert, she has counted past nine thousand."),
          A(FROM("eld_204"), "你没回头。你知道路口只剩埃达一个人。", "You don't look back. You know Edda is alone at the crossroads.")],
    choices: [
      C("走进石环", "Step into the ring", "eld_203",
        RS("石头是温的，像白天晒过。可今天没有太阳，只有烟。", "The stones are warm, as if sun-baked. But there was no sun today, only smoke."))
    ]};

  N.eld_206 = {chapter: 2, scene: "ruins", speaker: null, foe: "canoptek_scarab", time: {h: 5},
    text: L("你醒在水沟里，肩膀麻得像别人的，太阳已经偏西。\n一群甲虫似的小机器从你身上爬过，嗅了嗅，又走开了，好像你不值得拆。\n埃达不见了。路口只剩她的枪，枪管早就凉了。",
            "You wake in a ditch, your shoulder numb as if it belonged to someone else. The sun is low.\nA swarm of beetle-like machines crawls over you, sniffs, and moves on, as if you aren't worth dismantling.\nEdda is gone. Only her rifle lies at the crossroads, the barrel long cold."),
    alt: [A(F("nellKept"), "你爬到涵洞口。妮尔还在里面，已经数到一万两千。", "You crawl to the culvert. Nell is still inside. She has counted to twelve thousand.")],
    effects: {hp: -20, sanity: -5},
    choices: [
      C("拖着身子去山脊", "Drag yourself to the ridge", "eld_203",
        RS("你捡起埃达的枪当拐杖。黄昏前，你爬到了那圈白石头中间。", "You use Edda's rifle as a crutch. Before dusk you reach the ring of white stones."))
    ]};

  N.eld_203 = {chapter: 2, scene: "ruins", speaker: TAETHRA, time: {h: 2},
    text: L("黄昏，白石环中间的空气裂开了，像水面被手指划开。\n几个戴高盔的瘦长身影走出光里，最后一位身披长袍，几颗符文石绕着她缓缓旋转。\n她看了你很久，像在读一本只有她懂的书。“就是这一根线。”",
            "At dusk the air within the ring of white stones splits like water parted by a finger.\nTall, slender figures in high helms step out of the light. The last wears long robes; rune-stones circle her slowly.\nShe studies you a long time, like a book only she can read. “This is the thread.”"),
    codex: ["eld_farseer", "eld_aeldari"],
    choices: [
      C("“你们是谁？”", "“Who are you?”", "eld_207",
        RS("守护者们的枪口没有放下。先知抬了抬手，它们才放下。", "The Guardians' rifles don't lower until the Farseer lifts a hand.")),
      C("“我梦见过你。”", "“I've dreamed of you.”", "eld_203p", ONLY("origin_pilgrim"))
    ]};

  N.eld_203p = {chapter: 2, scene: "ruins", speaker: TAETHRA,
    text: L("符文石同时停顿了一下。先知伸出两根手指，止住了你又流下来的鼻血。\n“这十年，是我，”她说，“线要先拉直，才能穿针。”\n她的手指很凉。里面没有一点歉意。",
            "Every rune-stone falters at once. The Farseer reaches out two fingers and stops the nosebleed that has started again.\n“The ten years were mine,” she says. “A thread must be drawn straight before it can be threaded.”\nHer fingers are cold. There is no apology in them."),
    alt: [A(F("dreamTurned"), "梦里那个女人回头看你的样子，和现在一模一样。", "She looks at you exactly as the woman did when she turned in your dream.")],
    effects: {renown: 8, sanity: -5, set: {seerConfessed: true}},
    choices: [
      C("“为什么是我？”", "“Why me?”", "eld_207",
        RS("她没回答，只是转身。符文石又转了起来。", "She doesn't answer; she only turns. The rune-stones begin to circle again."))
    ]};

  N.eld_207 = {chapter: 2, scene: "ruins", speaker: TAETHRA, time: {h: 1},
    text: L("“我是塔艾丝拉，塞卢纳的先知。”她的声音很轻，每个字都像擦亮的银器。\n“这道门只为你开。网道很窄，未来更窄。”\n她身后，守护者们端着枪看你——像看一只误闯进屋的野兽。",
            "“I am Taethra, Farseer of Selunar.” Her voice is soft, every word like polished silver.\n“This gate opens for you alone. The webway is narrow; the future, narrower.”\nBehind her, Guardians hold their rifles and watch you as one might watch an animal that has wandered indoors."),
    alt: [A(F("nellLander"), "妮尔在那架穿梭机上。你不知道这算不算好事。", "Nell is on that shuttle. You don't know if that's good news."),
          A(F("nellKept"), "妮尔攥着你的衣角，盯着那道光。", "Nell clutches your coat, staring at the light.")],
    codex: ["eld_monkeigh", "eld_guardian"],
    choices: [
      C("把妮尔推向那道光", "Push Nell toward the light", "eld_209", {require: {flag: "nellKept"}, hideIfLocked: true}),
      C("“救救这个星球！”", "“Save this world!”", "eld_208"),
      C("跟她走", "Go with her", "eld_211", M({require: {notFlag: "nellKept"}, hideIfLocked: true},
        E({renown: 5}, "你迈向那道光。身后，瓦尔达的天空是绿的。", "You step toward the light. Behind you, Valda's sky is green."))),
      C("牵着妮尔，一起走进去", "Take Nell's hand and walk in together", "eld_209", ONLY("nellKept"))
    ]};

  N.eld_208 = {chapter: 2, scene: "ruins", speaker: TAETHRA, time: {h: 1},
    text: L("“四千一百万猿人。”她说这个数像在报天气。\n“醒的只是墓穴的哨兵，收割完就会退回地下。若舰队赶来，战火会吵醒整座墓穴，再顺着航迹找到伊尔达涅斯的六千族人。”\n“所以我们剪断了塔。”",
            "“Forty-one million mon-keigh.” She says it like a weather report.\n“Only the tomb's sentinels have woken; when the harvest is done they will sink back. If your fleets came, the war would wake the whole tomb, and it would follow their wake to Ildaneth, where six thousand of my kin live.”\n“So we cut your tower.”"),
    alt: [A(F("sawTally"), "你想起那些挨家打勾的骷髅。原来那真的只是收割。", "You remember the skeletons ticking off houses. So it really was only a harvest.")],
    effects: {sanity: -8, set: {knowsPrice: true}},
    codex: ["place_ildaneth"],
    choices: [
      C("跟她走", "Go with her", "eld_211", M({require: {notFlag: "nellKept"}, hideIfLocked: true},
        E({renown: 5}, "你迈向光里，带着那两个数字。它们比你带走的任何东西都重。",
          "You step toward the light carrying those two numbers. They weigh more than anything else you take."))),
      C("朝她脚边啐一口，然后跟上", "Spit at her feet, then follow", "eld_211", M({require: {notFlag: "nellKept"}, hideIfLocked: true},
        E({sanity: 5, renown: -3, set: {spatSeer: true}, taint: {khorne: 10}}, "守护者们同时举起了枪。先知抬手制止，看都没看地上一眼。",
          "Every Guardian raises a rifle. The Farseer stays them with one hand, never glancing at the ground."))),
      C("牵着妮尔走向光", "Lead Nell into the light", "eld_209", ONLY("nellKept")),
      C("“那我留下，和他们一起。”", "“Then I stay with them.”", "eld_210")
    ]};

  N.eld_209 = {chapter: 2, scene: "ruins", speaker: JORBAN, time: {h: 1},
    text: L("先知抬起一只手，像合上一页书。光在妮尔指尖前变成了一堵墙。“她的线不在这里。”\n乔班神父从坡下跌跌撞撞地跑上来，抱起妮尔：“去吧。我带她去旧矿井，那里深。”\n妮尔没有哭。她在看你。",
            "The Farseer raises one hand, like turning a page shut. At Nell's fingertips the light becomes a wall. “Her thread is not here.”\nFather Jorban stumbles up the slope and lifts her. “Go. I'll take her to the old mines. They run deep.”\nNell doesn't cry. She's watching you."),
    alt: [A(F("jorbanKnows"), "“你说过门在白石头中间，”神父喘着气，“我就找来了。”", "“You said the gate stood in white stones,” the priest pants. “So I came.”"),
          A(F("liedJorban"), "神父看了你一眼：“你说你只是个朝圣者。”", "The priest gives you a look. “You said you were only a pilgrim.”"),
          A(F("duskStones"), "石环外，那个让你“带上她”的斗篷人别过了脸。", "Outside the ring, the cloaked one who told you to bring her looks away."),
          AT(F("origin_trooper"), "先知抬起一只手，像合上一页书。光在妮尔指尖前变成了一堵墙。“她的线不在这里。”\n镇上的老神父乔班带着几个逃难的人，循着光爬上坡来，抱起妮尔：“去吧。我带她去旧矿井，那里深。”",
             "The Farseer raises a hand, like turning a page shut. At Nell's fingertips the light becomes a wall. “Her thread is not here.”\nFather Jorban, the town's old priest, climbs the slope with a few refugees who followed the light, and lifts her. “Go. I'll take her to the old mines. They run deep.”")],
    effects: {sanity: -8, set: {nellToJorban: true}},
    choices: [
      C("跟先知走", "Go with the Farseer", "eld_211",
        E({renown: 5}, "最后一眼，是神父抱着妮尔走下山坡，背影越来越小。",
          "Your last sight is the priest carrying Nell down the slope, growing smaller.")),
      C("留下来陪妮尔", "Stay with Nell", "eld_210")
    ]};

  N.eld_210 = {chapter: 2, scene: "ruins", speaker: MIRETH, time: {h: 1},
    text: L("一个年轻的守护者摘下头盔，是个女孩，眼睛像冬天的湖。“先知看见了上千种未来，”她低声说，“你留下的那些里，没有一种好结局。”\n她向你伸出手。在她们之中，这大概很失礼。",
            "A young Guardian removes her helm: a girl, eyes like a winter lake. “The Farseer saw a thousand futures,” she says quietly. “In every one where you stay, it ends badly.”\nShe holds out her hand. Among her kind, that is probably very rude."),
    alt: [A(FROM("eld_209"), "“包括那口矿井，”她补了一句，没有看妮尔。", "“The mine included,” she adds, not looking at Nell.")],
    choices: [
      C("握住她的手", "Take her hand", "eld_211",
        E({sanity: 5, set: {mirethHand: true}}, "她的手很凉，很稳。先知瞥了你们一眼，什么也没说。",
          "Her hand is cool and steady. The Farseer glances at you both and says nothing.")),
      C("最后看一眼瓦尔达，再走", "Look at Valda one last time, then go", "eld_211",
        E({sanity: -5, renown: 3, set: {lastLook: true}}, "绿光一片片扫过你长大的地方。你把它记住了，每一块田。",
          "Green light sweeps the land below, field by field. You memorise every one.")),
      C("留在瓦尔达", "Stay on Valda", "eld_210n",
        RS("年轻的守护者收回了手。她没再劝。", "The young Guardian lowers her hand. She doesn't ask again."))
    ]};

  N.eld_210n = {chapter: 2, scene: "ruins", speaker: null, time: {h: 2},
    text: L("你走下坡，走回燃烧的麦田。墓穴的扫描一遍比一遍细，像梳子梳头。\n走到坡底，你回头看：光门还亮着。那个年轻的守护者站在门口，没走。",
            "You walk down the slope, back into the burning wheat. The tomb's scans pass finer each time, like a comb through hair.\nAt the bottom you look back. The gate still glows. The young Guardian is standing in it. She hasn't gone."),
    alt: [A(F("nellToJorban"), "坡下，神父抱着妮尔正往旧矿井走。你还追得上。", "Below, the priest is carrying Nell toward the old mines. You could still catch them up."),
          A({all: [F("nellKept"), NF("nellToJorban")]}, "妮尔攥着你的手，没问你为什么。", "Nell holds your hand and doesn't ask why."),
          AT(F("nellLander"), "你走下坡，走回燃烧的麦田。妮尔在天上。至少，她在天上。\n走到坡底，你回头看：光门还亮着。那个守护者站在门口，没走。", "You walk down into the burning wheat. Nell is somewhere in the sky. At least she's in the sky.\nAt the bottom you look back. The gate still glows. The young Guardian is standing in it.")],
    choices: [
      C("留下来，等它们来", "Stay, and wait for them to come", "eld_end_harvest",
        RS("你转过身。身后的光暗了下去，这回是真的合上了。", "You turn away. Behind you the light dims, and this time the gate really closes.")),
      C("掉头跑回坡顶", "Turn and run back up the slope", "eld_211",
        E({sanity: -5}, "你跑得肺都要炸了。那个守护者没有伸手拉你，只是等着。", "You run until your lungs burn. The Guardian doesn't reach for you. She just waits."))
    ]};

  N.eld_end_harvest = {chapter: 2, scene: "tomb_exterior", speaker: null, foe: "necron_warrior", time: {d: 2},
    text: L("第二天，一个银色的骷髅停在你面前，抬起了手。你没有跑。\n很久以后，瓦尔达又长满了麦子，没人收割。\n先知说过，墓穴会重新睡着。她说对了——它睡得很满足。",
            "Next day a silver skeleton stops before you and raises a hand. You don't run.\nLong after, Valda is thick with wheat again, and no one harvests it.\nThe Farseer said the tomb would sleep again. She was right. It sleeps content."),
    ending: {kind: "bad", title: L("最后一季", "The Last Harvest"), cause: L("与瓦尔达一同被收割", "Harvested with Valda")}};

  N.eld_211 = {chapter: 2, scene: "ruins", speaker: MIRETH,
    text: L("光门在你面前嗡嗡作响。一个年轻的守护者摘下头盔，是个女孩，眼睛像冬天的湖。\n“米瑞丝，”她说，“先知让我看着你。进去以后，跟紧我。别碰墙。”",
            "The gate hums before you. A young Guardian takes off her helm: a girl, eyes like a winter lake.\n“Mireth,” she says. “The Farseer has told me to watch you. Once we're inside, stay close. Don't touch the walls.”"),
    alt: [AT(FROM("eld_210n"), "你跑回坡顶时，那个守护者还站在门口。“米瑞丝，”她说，“你迟到了。先知让我看着你。进去以后，跟紧我。别碰墙。”\n光门在你面前嗡嗡作响。",
             "When you reach the top again, the Guardian is still in the gate. “Mireth,” she says. “You're late. The Farseer told me to watch you. Once inside, stay close. Don't touch the walls.”\nThe gate hums before you."),
          AT(FROM("eld_210"), "那个守护者还站在你身边，头盔夹在臂弯里。\n“米瑞丝，”她说，“进去以后，跟紧我。先知让我看着你。别碰墙。”\n光门在你面前嗡嗡作响。",
             "The Guardian is still beside you, helm under her arm.\n“Mireth,” she says. “Once we're inside, stay close. The Farseer has told me to watch you. Don't touch the walls.”\nThe gate hums before you."),
          A(NF("knowsPrice"), "先知在门里回头：“四千一百万，换伊尔达涅斯的六千。你该知道你是从什么里面被拿出来的。”", "The Farseer turns in the gate. “Forty-one million, for six thousand on Ildaneth. You should know what you were taken out of.”"),
          A(F("nellToJorban"), "坡下，神父抱着妮尔的背影已经小得看不见了。", "Down the slope, the priest carrying Nell has shrunk out of sight."),
          A({all: [F("nellKept"), NF("nellToJorban")]}, "乔班神父带着逃难的人爬上坡来。你把妮尔交给他，他说去旧矿井，那里深。", "Father Jorban climbs the slope with a few refugees. You give Nell to him; he says the old mines run deep.")],
    choices: [
      C("跟着米瑞丝进去，一步不落", "Follow Mireth in, step for step", "eld_302",
        RS("你踩着她的脚印走进光里。瓦尔达在你身后合上了。", "You step into the light in her footprints. Valda closes behind you.")),
      C("自己走，跟在队伍最后", "Go in on your own, at the back", "eld_301",
        RS("你没去拉谁的手。光把你吞进去的时候，你回头看了一眼，什么也没看清。", "You take no one's hand. As the light swallows you, you look back once and see nothing clearly."))
    ]};

  /* ============ Chapter 3 · The Webway ============ */
  N.eld_301 = {chapter: 3, scene: "webway", speaker: null, time: {d: 1, warp: true}, eventRoll: 0.42, bridge: true,
    jump: J("穿过光门，进入网道", "Through the gate into the webway"),
    text: L("网道里没有上下。光做的走廊向四面八方弯曲，脚步声落下去，很久才传回来。\n你数不清走了多久，也许一小时，也许一天。守护者们走得很快，米瑞丝在队伍前头，偶尔回头找你。\n你走在最后。",
            "There is no up or down in the webway. Corridors of light curve every way; footsteps fall away and return much later.\nYou lose count of how long you walk: an hour, perhaps a day. The Guardians move fast. Mireth, near the front, looks back for you now and then.\nYou walk last."),
    codex: ["place_webway"],
    choices: [
      C("快走几步，追上米瑞丝", "Hurry and catch up with Mireth", "eld_302",
        RS("你小跑着挤过两个守护者。他们侧身让开，像让开一阵风。", "You jog past two Guardians. They step aside as if for a gust of wind.")),
      C("伸手摸一摸光墙", "Touch the wall of light", "eld_301t")
    ]};

  N.eld_301t = {chapter: 3, scene: "webway", speaker: null,
    text: L("墙是暖的，像活物。墙后无数声音同时转向你，像满屋子人突然安静下来。\n其中一个声音问：“你是谁的？”\n一只手从后面揪住你的领子。米瑞丝把你拽回来，脸色比墙还白。",
            "The wall is warm, like something alive. Behind it countless voices turn toward you at once, like a crowded room falling silent.\nOne of them asks, “Whose are you?”\nA hand seizes your collar from behind. Mireth hauls you back, her face whiter than the wall."),
    effects: {sanity: -6, renown: 3, set: {touchedWall: true}, taint: {tzeentch: 25}},
    choices: [
      C("“对不起。”", "“I'm sorry.”", "eld_302",
        RS("“别道歉，”她说，“别再碰就行。”她没松开你的领子。", "“Don't apologise,” she says. “Just don't touch it again.” She doesn't let go of your collar."))
    ]};

  N.eld_302 = {chapter: 3, scene: "webway", speaker: MIRETH, time: {h: 3}, bridge: true,
    jump: J("穿过光门，进入网道", "Through the gate into the webway"),
    text: L("“别碰墙，别离开路，别回应任何叫你名字的东西。”米瑞丝瞥了眼先知的背影，声音更低了。\n她胸前嵌着一颗乳白色的宝石，随着心跳微微发亮。\n远处某个地方，有东西在挠。",
            "“Don't touch the walls. Don't leave the path. Don't answer anything that calls your name.” Mireth glances at the Farseer's back and lowers her voice.\nA milky gem is set on her breastplate, glowing faintly with her heartbeat.\nSomewhere far off, something is scratching."),
    alt: [A(F("mirethHand"), "她一直没松开你的手，好像忘了。", "She still hasn't let go of your hand, as if she's forgotten."),
          A(FROM("eld_301t"), "她揉着手腕：“这是第二遍。不会有第三遍。”", "She rubs her wrist. “That's the second time I've said it. There won't be a third.”")],
    choices: [
      C("“什么在挠？”", "“What's scratching?”", "eld_303"),
      C("“你胸前的宝石是什么？”", "“What's the gem on your chest?”", "eld_304")
    ]};

  N.eld_303 = {chapter: 3, scene: "webway", speaker: MIRETH, time: {h: 1},
    text: L("她指向一道封死的岔路，封印上刻满符文，另一边的挠声很有耐心。\n“她。渴求者。你们叫她色孽。”米瑞丝摸了摸胸前的宝石，“我们每个人死后，灵魂都是她的食物——除非有地方可逃。”",
            "She points to a sealed branch, runes carved across the seal. The scratching on the other side is patient.\n“Her. She Who Thirsts. Your kind call her Slaanesh.” Mireth touches her gem. “When any of us dies, our soul is her food. Unless there's somewhere to run.”"),
    effects: {sanity: -5},
    codex: ["eld_she_who_thirsts", "god_slaanesh"],
    choices: [
      C("离那道封印远一点", "Step away from the seal", "eld_304",
        RS("你退了三步。挠声跟着你挪了三步的距离。", "You back away three steps. The scratching follows exactly three steps.")),
      C("把耳朵贴上去听", "Press your ear to it", "eld_303h")
    ]};

  N.eld_303h = {chapter: 3, scene: "webway", speaker: TAETHRA,
    text: L("挠声停了。一个温柔的声音说：“你闻起来不一样。没有石头。真干净。”\n米瑞丝一把把你拽开，去报告了。先知回过头，第一次正眼看你，像看一只有裂纹的碗。\n“它记住你了，”她说。",
            "The scratching stops. A tender voice says, “You smell different. No stone. So clean.”\nMireth yanks you away and goes to report. The Farseer turns and, for the first time, truly looks at you, like a bowl found to be cracked.\n“It has remembered you,” she says."),
    effects: {sanity: -8, corruption: 8, set: {heardHer: true}, taint: {slaanesh: 30}},
    choices: [
      C("跟上队伍", "Fall back into line", "eld_304",
        RS("一路上，你总觉得耳朵里还有点甜。", "For the rest of the way your ear feels faintly sweet."))
    ]};

  N.eld_304 = {chapter: 3, scene: "webway", speaker: MIRETH, time: {h: 1},
    text: L("“灵魂石。”她说，“我死的时候，灵魂会逃进这块石头，而不是落进她嘴里。”\n“然后呢？”\n“然后石头回到方舟，回到墙里，和祖先在一起。”她顿了顿，“你们猿人死了，灵魂去哪？”\n你答不上来。",
            "“A spirit stone,” she says. “When I die, my soul flees into this instead of into Her mouth.”\n“And then?”\n“Then the stone goes home, into the walls, with our ancestors.” A pause. “Where do mon-keigh souls go when you die?”\nYou have no answer."),
    effects: {sanity: -5},
    codex: ["eld_spirit_stone"],
    choices: [
      C("“我们向帝皇祈祷。”", "“We pray to the Emperor.”", "eld_305",
        E({sanity: 5, set: {prayedEmperor: true}}, "米瑞丝礼貌地点头，像在听孩子讲妖怪故事。她没有笑，这已经很客气了。",
          "Mireth nods politely, as if hearing a child's story about monsters. She doesn't laugh. That is already very kind.")),
      C("“我不知道。”", "“I don't know.”", "eld_305",
        E({renown: 3, set: {honestDontKnow: true}}, "她沉默了一会儿：“那你比大多数猿人诚实。”这是你第一次听出她声音里的温度。",
          "She is quiet a moment. “Then you're more honest than most mon-keigh.” It's the first warmth you've heard in her voice."))
    ]};

  N.eld_305 = {chapter: 3, scene: "webway", speaker: null, time: {h: 5},
    text: L("前方岔路口传来音乐，轻快、古怪，像有人在笑。\n一队戴面具的人从横穿的走廊上舞过去，衣服的颜色每走一步就换一次。\n守护者们停下来低头致意，连先知也是。那队人没有停。",
            "Music drifts from the crossroads ahead: quick, strange, like someone laughing.\nA troupe in masks dances across the intersecting corridor, costumes changing colour with every step.\nThe Guardians stop and bow their heads, even the Farseer. The troupe does not stop."),
    choices: [
      C("盯着那队舞者看", "Watch the dancers", "eld_306"),
      C("问米瑞丝他们是谁", "Ask Mireth who they are", "eld_307",
        M(E({renown: 2}, "“丑角。”米瑞丝低声说，“他们演我们的历史，也守着我们的秘密。别盯着看，他们会把你写进戏里。”",
          "“Harlequins,” Mireth whispers. “They perform our history and keep our secrets. Don't stare, or they'll write you into the play.”"), {codex: ["eld_harlequins"]})),
      C("低头，跟上守护者", "Bow, and keep up with the Guardians", "eld_307",
        E({renown: 2}, "你学着他们低下头。米瑞丝从眼角瞥了你一眼，嘴角动了动。",
          "You copy them and bow. Mireth glances at you sidelong; the corner of her mouth twitches."))
    ]};

  N.eld_306 = {chapter: 3, scene: "webway", speaker: DANCER, time: {h: 1},
    text: L("最后一个舞者停下来，转过一张没有五官的镜面面具。面具里映着你自己。\n他对你比划：一个小人从一只巨大的手掌下溜走，还回头做了个鬼脸。\n然后他一转身，舞进了另一条走廊。",
            "The last dancer stops and turns a featureless mirrored mask toward you. In it, you see yourself.\nHe mimes something for you: a tiny figure slipping out from under a vast grasping hand, turning back to pull a face.\nThen he spins away down another corridor."),
    codex: ["eld_harlequins"],
    choices: [
      C("追上去", "Follow him", "eld_308",
        E({set: {harlequinFavor: true}}, "跑了几步，音乐就没了。回头时，守护者们也不见了。走廊安静得像一口井。",
          "A few steps and the music is gone. When you turn, the Guardians are gone too. The corridor is silent as a well.")),
      C("学他做个鬼脸，再回队伍", "Pull the same face, then rejoin the group", "eld_307",
        E({renown: 3, set: {harlequinFavor: true}}, "你冲着空走廊做了个鬼脸。远处传来一声笑，像回礼。",
          "You pull a face at the empty corridor. Far off, a laugh answers, like a bow returned."))
    ]};

  N.eld_308 = {chapter: 3, scene: "webway", speaker: null, time: {h: 8, warp: true},
    text: L("你独自站在网道里。每条走廊看起来都一样，每条都在轻轻呼吸。\n左边远处有人在笑，很轻，很快。\n右边，一个温柔的声音在叫你的名字。它知道你的名字。",
            "You stand alone in the webway. Every corridor looks the same; every one breathes softly.\nFar to the left someone is laughing, light and quick.\nTo the right, a gentle voice is calling your name. It knows your name."),
    effects: {sanity: -8},
    choices: [
      C("朝笑声走", "Walk toward the laughter", null,
        R(0.65, "sanity", "eld_307", "eld_309",
          "笑声领着你拐了七个弯。最后一个弯后，米瑞丝正端着枪，一脸怒气地找你。",
          "The laughter leads you round seven bends. After the last, Mireth is there with her rifle raised, furious, searching for you.",
          "笑声忽远忽近，最后停了。你走进一条没有光的走廊，有人在那里等你。",
          "The laughter drifts near and far, then stops. You walk into an unlit corridor. Someone is waiting there.")),
      C("回应那个声音", "Answer the voice", "eld_309",
        E({corruption: 5, taint: {slaanesh: 25}}, "你应了一声。那声音很高兴。前面的走廊变暗、变窄，变得很香。",
          "You answer. The voice is delighted. The corridor ahead grows darker, narrower, sweeter-smelling.")),
      C("掏出那块白石头", "Take out the white stone", "eld_308s", ONLY("runeStone"))
    ]};

  N.eld_308s = {chapter: 3, scene: "webway", speaker: SYLVAEN, time: {h: 2},
    text: L("石头在你掌心亮起来，像一盏小灯。\n没过多久，一个披斗篷的身影从光里走出来，叹了口气。是山脊上那个人。\n“它本来就是网道的碎片，”他看着石头，“走吧，猿人。别回应那个声音。”",
            "The stone kindles in your palm like a small lamp.\nBefore long a cloaked figure steps out of the light and sighs. The man from the ridge.\n“It was a shard of the webway all along,” he says, eyeing the stone. “Come, mon-keigh. Don't answer that voice.”"),
    effects: {renown: 5, set: {sylvaenWebway: true}},
    choices: [
      C("跟着他走", "Follow him", "eld_307",
        RS("他一路没说话。只在拐角处停下来，等你跟上。", "He says nothing the whole way. He only stops at corners to let you catch up."))
    ]};

  N.eld_309 = {chapter: 3, scene: "webway", speaker: VHESSRA, time: {h: 2},
    text: L("一个人从暗处走出来，和米瑞丝很像，却瘦得像一把刀，盔甲上挂满钩子。\n“一只走丢的猿人。”她笑得很甜，“网道真慷慨。科摩拉的市场正缺新鲜货。”\n她身后的影子里，还有好几双眼睛。",
            "Someone steps from the dark. She looks like Mireth, but lean as a blade, her armour hung with hooks.\n“A lost mon-keigh.” Her smile is sweet. “How generous the webway is. Commorragh's markets are short of fresh stock.”\nIn the shadows behind her, more eyes."),
    effects: {sanity: -5, set: {metVhessra: true}},
    codex: ["eld_drukhari", "place_commorragh"],
    choices: [
      C("跟她讨价还价", "Bargain with her", null,
        R(0.5, "renown", "eld_307", "eld_end_drukhari",
          "你说你是先知的“线”，越说越大声。她犹豫的那一秒，守护者的枪声到了。",
          "You claim to be the Farseer's thread, louder and louder. In the second she hesitates, the Guardians' fire arrives.",
          "她听完，鼓了鼓掌：“好口才。到了科摩拉，讲给买家听吧。”",
          "She hears you out and claps. “Eloquent. Save it for the buyers in Commorragh.”")),
      C("转身就跑", "Turn and run", "eld_310",
        E({hp: -20}, "钩子擦过你的后背，你没回头。等你停下，四周只剩光，和你自己的喘气声。",
          "A hook rakes your back. You don't look back. When you stop there's only light, and your own breathing."))
    ]};

  N.eld_310 = {chapter: 3, scene: "webway", speaker: null, time: {d: 1, warp: true},
    text: L("你逃进了一条断头岔路。尽头是一面裂开的光墙，外面什么都没有，连黑暗都没有。\n你在这里坐了很久。时间不对劲：指甲长了，伤口却不结痂。\n没人来找你。也许，没人会来。",
            "You've fled into a dead-end branch. At its end is a cracked wall of light, and beyond it nothing, not even darkness.\nYou sit a long time. Time is wrong: your nails grow, but your wounds don't scab.\nNo one comes looking. Perhaps no one will."),
    effects: {sanity: -8},
    choices: [
      C("大声喊先知的名字", "Shout the Farseer's name", null,
        R(0.65, "renown", "eld_307", "eld_end_lost",
          "你喊到嗓子出血。终于，一颗符文石从光里滚出来，停在你脚边，像一根牵绳。",
          "You shout until your throat bleeds. At last a rune-stone rolls out of the light and stops at your feet, like a leash.",
          "你的声音被墙吸走了，一点回音都没有。",
          "The walls drink your voice. Not even an echo.")),
      C("对着空走廊大笑", "Laugh at the empty corridor", "eld_307", M({},
        E({sanity: 5, renown: 3}, "你笑得眼泪都出来了。一个镜面舞者从墙里翻出来，鞠了一躬，牵着你走了。",
          "You laugh until you cry. A mirror-masked dancer tumbles out of the wall, bows, and leads you away."))),
      C("坐下来，等", "Sit down and wait", "eld_end_lost")
    ]};

  N.eld_end_lost = {chapter: 3, scene: "webway", speaker: null, time: {y: 40, warp: true},
    text: L("你等了很久，久到忘了自己在等什么。\n偶尔有一队舞者从远处经过，在你面前停一停，做个鬼脸，又走了。\n网道很大。在它的某个角落，有一个不会变老的猿人，还在数脚步。",
            "You wait a long time, long enough to forget what you were waiting for.\nNow and then a troupe of dancers passes, pauses before you, pulls a face, and moves on.\nThe webway is vast. Somewhere in it, a mon-keigh who never grows old is still counting footsteps."),
    ending: {kind: "bad", title: L("迷失网道", "Lost in the Webway"), cause: L("被遗弃在网道之中", "Abandoned in the webway")}};

  N.eld_end_drukhari = {chapter: 3, scene: "webway", speaker: VHESSRA, time: {d: 3},
    text: L("科摩拉没有太阳。你学会了很多事：怎么笑得让主人满意，怎么在拍卖台上站得笔直。\n你的新主人说，猿人最有趣的地方，是会一直抱着希望。\n她说得对。你到现在还在希望。",
            "Commorragh has no sun. You learn many things: how to smile so your owner is pleased, how to stand straight on the auction block.\nYour new owner says the most amusing thing about mon-keigh is that they keep hoping.\nShe's right. You're hoping still."),
    ending: {kind: "bad", title: L("无日之城", "City Without Sun"), cause: L("被黑暗灵族掳往科摩拉", "Taken to Commorragh")}};

  N.eld_307 = {chapter: 3, scene: "webway", speaker: TAETHRA, time: {h: 6},
    text: L("先知在一道巨大的拱门前等着，符文石绕着她慢慢转。\n“线还在。”她说，没有看你，像在清点一件行李。\n拱门那头，是你从未想象过的光：一座城漂浮在虚空里，骨白色的尖塔像一片森林。",
            "The Farseer waits before a vast arch, her rune-stones turning slowly.\n“The thread holds,” she says without looking at you, as if checking luggage.\nBeyond the arch is a light you never imagined: a city adrift in the void, bone-white spires like a forest."),
    alt: [A(F("sylvaenWebway"), "游侠把你送到这里就走了。先知没看他：“游侠不该替我捡行李。”", "The Ranger leaves you here and goes. The Farseer doesn't look at him. “Rangers should not fetch my luggage.”"),
          A(FROM("eld_308", "eld_309", "eld_310"), "米瑞丝一言不发地检查你的伤，手比平时重。", "Mireth checks you for wounds without a word, rougher than usual.")],
    choices: [
      C("和米瑞丝并肩走进去", "Walk through beside Mireth", "eld_400",
        RS("拱门那边传来一阵低语，像风吹过一大片草。", "Beyond the arch a murmur rises, like wind across a great field of grass.")),
      C("在拱门下站一会儿，晚点再进", "Linger under the arch; go in later", "eld_401",
        RS("你在拱门下站到灯光调暗。米瑞丝陪你站着，一句话也没抱怨。", "You stand under the arch until the lights dim. Mireth waits with you and doesn't complain once."))
    ]};

  /* ============ Chapter 4 · The Craftworld ============ */
  var COUNCIL = S("aeldari_seer", "先知议会", "The Seer Council");

  N.eld_400 = {chapter: 4, scene: "craftworld", speaker: TAETHRA, time: {h: 2}, bridge: true,
    gather: G("港口", "harbour"),
    text: L("拱门那边是塞卢纳的港口。几十个灵族停下脚步，围着看先知带回来的猿人，低语像风吹过草地。\n先知当众开口：“米瑞丝，从今天起，你是客人的看护者。”\n人群里有人轻笑了一声。米瑞丝的耳朵红了。",
            "Beyond the arch lies Selunar's harbour. Dozens of Aeldari stop to stare at the mon-keigh the Farseer brought home; their murmur moves like wind through grass.\nThe Farseer speaks for all to hear. “Mireth. From today you are the guest's keeper.”\nSomeone in the crowd laughs softly. Mireth's ears go red."),
    alt: [A(F("harlequinFavor"), "一个孩子指着你的脸：“丑角给这个猿人画过记号。”", "A child points at your face. “The Harlequins have marked this mon-keigh.”")],
    codex: ["place_selunar", "eld_craftworlds"],
    choices: [
      C("跟着米瑞丝去住处", "Follow Mireth to your quarters", "eld_401",
        RS("人群给你们让出一条路，让得很宽，像怕碰到你。", "The crowd parts for you, very widely, as if afraid to brush against you."))
    ]};

  N.eld_401 = {chapter: 4, scene: "craftworld", speaker: null, time: {h: 1}, bridge: true,
    effects: {sanity: 5},
    text: L("塞卢纳方舟世界。你的房间按“猿人规格”准备：天花板矮一些，一碗水，一把椅子——他们显然查过资料，才知道椅子是什么。\n门口放着一本小册子：《与客人相处须知》。",
            "Craftworld Selunar. Your room has been prepared “to mon-keigh specifications”: a lower ceiling, a bowl of water, one chair. They clearly had to look up what a chair was.\nA pamphlet waits by the door: On Conduct Around the Guest."),
    alt: [A(FROM("eld_307"), "米瑞丝在门口站定：“先知让我当你的看护者。我就住隔壁。”", "Mireth plants herself at the door. “The Farseer has made me your keeper. I'm next door.”")],
    codex: ["place_selunar", "eld_craftworlds", "eld_monkeigh"],
    choices: [
      C("翻开小册子", "Open the pamphlet", "eld_401r"),
      C("出门走走", "Go for a walk", "eld_402",
        RS("米瑞丝跟在你身后三步远，不多也不少。", "Mireth follows three paces behind. No more, no less."))
    ]};

  N.eld_401r = {chapter: 4, scene: "craftworld", speaker: null,
    text: L("第一条：勿突然靠近。第二条：它会饿，按时喂食。第三条：它活不长，不必建立感情。\n第三条后面有个小小的落款。你认得那个符号——米瑞丝的头盔上也有。",
            "Rule one: do not approach suddenly. Rule two: it hungers; feed it on schedule. Rule three: it will not live long; do not grow attached.\nAfter rule three is a small signature. You know the mark. It's on Mireth's helm too."),
    effects: {sanity: -3, renown: 2, set: {readRules: true}},
    choices: [
      C("合上册子，出门走走", "Close it and go for a walk", "eld_402",
        RS("你把册子放回门口。米瑞丝看见它被翻过，什么也没说。", "You put the pamphlet back by the door. Mireth sees it has been opened and says nothing."))
    ]};

  N.eld_402 = {chapter: 4, scene: "craftworld", speaker: ELLARIS, time: {h: 3},
    text: L("走廊上，一位长者正对着墙上的裂缝唱歌。歌声落到哪里，裂缝就在哪里慢慢长拢，像伤口愈合。\n“灵骨，”他头也不回，“方舟的骨头。它听歌，不听锤子。”\n他停下来打量你：“你会唱歌吗，猿人？”",
            "In a corridor an elder sings to a crack in the wall. Wherever his voice falls, the crack slowly knits, like a healing wound.\n“Wraithbone,” he says without turning. “The craftworld's bones. It listens to song, not hammers.”\nHe stops and looks you over. “Can you sing, mon-keigh?”"),
    codex: ["eld_wraithbone", "eld_bonesinger"],
    choices: [
      C("哼一段瓦尔达的收割歌", "Hum a Valda harvest song", "eld_403",
        E({sanity: 10, set: {bonesong: true, canSing: true}}, "你哼得很难听。可墙壁轻轻颤了一下，像熟睡的人翻了个身。灵骨歌者第一次露出了惊讶。",
          "You hum badly. But the wall shivers faintly, like a sleeper turning over. For the first time the Bonesinger looks surprised.")),
      C("“这里为什么这么安静？”", "“Why is it so quiet here?”", "eld_404",
        RS("“因为我们越来越少，”他说，“而墙里的越来越多。”", "“Because there are fewer of us,” he says, “and more of us in the walls.”"))
    ]};

  N.eld_403 = {chapter: 4, scene: "craftworld", speaker: ELLARIS, time: {h: 1},
    text: L("“墙认得悲伤，”艾拉瑞斯说，“你的歌里有很多。”\n他递给你一小片灵骨，形状像一粒麦子：“留着。它会记得你哼过的调子。”\n这是你来到方舟后，收到的第一件礼物。",
            "“The wall knows grief,” Ellaris says. “There is much in your song.”\nHe hands you a sliver of wraithbone shaped like a grain of wheat. “Keep it. It will remember the tune you hummed.”\nIt's the first gift you've received on the craftworld."),
    effects: {renown: 5},
    choices: [
      C("收下，道谢", "Accept it, and thank him", "eld_404",
        RS("“下次唱完整一点，”他说，“墙会等。”", "“Sing the whole thing next time,” he says. “The wall will wait.”"))
    ]};

  N.eld_404 = {chapter: 4, scene: "craftworld", speaker: MIRETH, foe: "wraith_construct", time: {h: 4}, eventRoll: 0.4,
    text: L("米瑞丝陪你在方舟里走。这里能住一百万人，你走过的街区却全是空的。花园没人修剪，长椅上落满光尘。\n只有一个灵骨巨人在慢慢巡逻，胸口嵌着一颗发光的石头。\n“里面住着一位死去的诗人，”她说。",
            "Mireth walks the craftworld with you. It could house a million, yet every district you cross is empty. Gardens untended, benches dusted with light.\nOnly a wraithbone giant patrols, slow-footed, a glowing stone in its chest.\n“A dead poet lives inside it,” she says."),
    alt: [A(F("touchedWall"), "米瑞丝盯着你的手：“这里的墙，和网道的不一样。可还是别乱碰。”", "Mireth watches your hands. “These walls aren't the webway's. Still, don't touch them carelessly.”")],
    codex: ["eld_wraith_construct", "eld_infinity_circuit"],
    choices: [
      C("把手放在墙上", "Lay your hand on the wall", "eld_405",
        E({sanity: -8, renown: 5, set: {wallVoice: true}}, "墙里有成千上万个声音在低声交谈。其中一个停下来，问你是谁。你没敢回答。",
          "Inside the wall thousands of voices murmur. One pauses to ask who you are. You don't dare answer.")),
      C("向巨人点头致意", "Nod to the giant", "eld_405",
        E({renown: 3, set: {wraithNod: true}}, "巨人停下来，转过那颗没有脸的头。过了很久，它也点了点头，慢得像在回忆该怎么做。",
          "The giant halts and turns its faceless head. After a long time it nods back, slowly, as if remembering how."))
    ]};

  N.eld_405 = {chapter: 4, scene: "craftworld", speaker: TAETHRA, time: {d: 2},
    text: L("先知在水晶穹顶召见你。四周站着许多晶莹的人形，都是看未来太久、化成了水晶的先知。\n“最伟大的先知艾德拉德也曾这样站着，”她说，“后来他醒了，去追随重生者。”\n“你可以问我一件事。”",
            "The Farseer summons you to the Dome of Crystal Seers. All around stand gleaming figures: seers who gazed at the future so long they turned to crystal.\n“The greatest of us, Eldrad, once stood like this,” she says. “Then he woke, and went to follow the Reborn.”\n“Now. You may ask me one thing.”"),
    alt: [A(F("spatSeer"), "她看了一眼你的脚边，像在找那口唾沫。", "She glances at your feet, as if looking for that spit.")],
    codex: ["place_crystal_dome", "eld_eldrad"],
    choices: [
      C("“瓦尔达还剩下什么？”", "“What's left of Valda?”", "eld_405v"),
      C("“你为什么留着我？”", "“Why did you keep me?”", "eld_406",
        E({renown: 5, set: {askedWhy: true}}, "“我没有救你，我保留了你。很多种未来里，都有个猿人站在一扇门前。我还不知道是哪扇门。”",
          "“I did not save you. I kept you. In many futures a mon-keigh stands before a door. I do not yet know which door.”")),
      C("把你做过的梦讲给她听", "Tell her what you've dreamed", "eld_406", M(
        E({sanity: -5, renown: 3, set: {toldDreams: true}, taint: {tzeentch: 25}}, "你讲了网道里叫你名字的那些声音。先知的符文石同时停了一下。",
          "You tell her of the voices in the webway that called your name. All her rune-stones falter at once."),
        {resultAlt: [RA(F("heardHer"), "你讲了封印后那个甜甜的声音。符文石停了：“它说你干净。它说得对。”", "You tell her of the sweet voice beyond the seal. The stones halt. “It called you clean. It was right.”"),
                     RA(F("runeStone"), "你讲了白石头带来的那条发光的路。她点头：“那是网道。你梦见了我们的路。”", "You tell her of the road of light the white stone brought. She nods. “The webway. You dreamed our road.”")]})),
      C("“这十年的梦，是你送来的。”", "“Ten years of dreams. You sent them.”", "eld_406", M(ONLY("origin_pilgrim"),
        M(E({renown: 10, sanity: -5, set: {toldDreams: true}, taint: {tzeentch: 20}}, "“线要先拉直，才能穿针。你每一次流鼻血，我都看见了。按你们的说法：我很抱歉。”",
          "“A thread must be drawn straight. I saw every nosebleed. I am sorry, as your kind would say.”"),
          {resultAlt: [RA(F("seerConfessed"), "“我在山脊上说过了。”她顿了顿，“可你想听的是另一句：我很抱歉。按你们的说法。”", "“I told you on the ridge.” A pause. “But you wanted the other words. I am sorry, as your kind say.”")]})))
    ]};

  N.eld_405v = {chapter: 4, scene: "craftworld", speaker: S("omen_farseer", "塔艾丝拉的符文", "Taethra's Runes"),
    text: L("她把一颗符文石放进你掌心。你看见瓦尔达：麦子在长，没人收。黑色金字塔沉回了地下，像退潮。\n“哨兵睡了，”她说，“领主没醒。我数得对。”\n石头在你手心凉下去。",
            "She sets a rune-stone in your palm. You see Valda: wheat growing, no one to cut it. The black pyramid has sunk back into the earth like an ebbing tide.\n“The sentinels sleep,” she says. “The lords never woke. I counted true.”\nThe stone goes cold in your hand."),
    alt: [A(F("nellLander"), "天上有个小点在往外飞。符文没让你看清它飞到了哪里。", "A speck in the sky is flying outward. The runes won't let you see where it lands."),
          A(F("sawTally"), "“它们记了账，”你说。“我也记了，”她说。", "“They kept a list,” you say. “So did I,” she says.")],
    effects: {sanity: -8, set: {askedValda: true}},
    choices: [
      C("把石头还给她", "Give the stone back", "eld_406",
        RS("她接过石头，把它翻了个面，好像那一面就不算数了。", "She takes it and turns it over, as if that side no longer counts."))
    ]};

  N.eld_406 = {chapter: 4, scene: "craftworld", speaker: MIRETH, time: {d: 3},
    text: L("米瑞丝带你逛方舟。她说每个灵族一生都走“道途”：做诗人、战士、歌者……一次只走一条，走到尽头再换。\n“为什么？”\n“因为我们的心太大了。”她笑了一下，“不给它一条路，它就会跑去找她。”",
            "Mireth shows you around. Every Aeldari, she says, walks the Path: poet, warrior, singer... one at a time, to its end, then the next.\n“Why?”\n“Because our hearts are too large.” A small smile. “Give them no road, and they run to Her.”"),
    codex: ["eld_path"],
    choices: [
      C("“带我去看战士之道。”", "“Show me the Path of the Warrior.”", "eld_407"),
      C("“你以前走的是哪条？”", "“Which Path did you walk before?”", "eld_408")
    ]};

  N.eld_407 = {chapter: 4, scene: "craftworld", speaker: EXARCH, time: {h: 2}, eventRoll: 0.4,
    text: L("相位神殿里，战士们戴着面具静立。督军的盔甲上刻满前任的名字。\n“戴上战面，杀意就关进面具里，”他说，“摘下来，还能做回诗人。”\n“我不能。我被困在这条路上了。凯恩的手在我心里。”",
            "In the Aspect Shrine masked warriors stand in silence. The Exarch's armour is etched with the names of those who wore it before.\n“When we don the war-mask, we lock the killing inside it,” he says. “Take it off, and we can be poets again.”\n“Not I. I am trapped on this Path. Khaine's hand is in my heart.”"),
    codex: ["place_aspect_shrine", "eld_aspect_warriors", "eld_khaine"],
    choices: [
      C("“让我试一试面具。”", "“Let me try a mask.”", "eld_410"),
      C("鞠躬，退出神殿", "Bow and leave the shrine", "eld_408",
        E({renown: 2}, "他回礼的角度精确到分毫，正好是对客人的标准。不多，也不少。",
          "He returns the bow at a precise angle, exactly what a guest is owed. No more, no less."))
    ]};

  N.eld_410 = {chapter: 4, scene: "craftworld", speaker: S("omen_khaine", "面具中的幻象", "Vision in the Mask"), time: {h: 1},
    text: L("督军从墙上取下一张新人冥想用的旧面具：“只许戴一次。”\n戴上的瞬间，你看见一只燃烧的铁手攥着一颗心。愤怒像潮水灌进来——为瓦尔达，为妮尔，为那两个数字。\n你想杀人。想得很清楚，很平静。",
            "The Exarch takes down an old mask that novices meditate before. “Once only.”\nThe instant it's on, you see a burning iron hand clutching a heart. Rage floods in—for Valda, for Nell, for those two numbers.\nYou want to kill. Clearly. Calmly."),
    effects: {sanity: -8},
    choices: [
      C("摘下面具", "Take off the mask", "eld_409",
        E({renown: 5, set: {maskOff: true}}, "你把面具摘下来，手在发抖。督军点头：“摘下来了。比大多数头一回的孩子强。”",
          "You pull the mask off, hands shaking. The Exarch nods. “You took it off. Better than most children their first time.”")),
      C("再戴一会儿", "Keep it on a little longer", "eld_410k")
    ]};

  N.eld_410k = {chapter: 4, scene: "craftworld", speaker: EXARCH,
    text: L("督军不得不掰开你的手指才拿走面具。指甲在掌心掐出了血，你却觉得很好。\n“面具不挑主人，”他低声说，“可在你们猿人心里应答的，不一定是凯恩。”\n他把面具挂回墙上，挂得比原来高。",
            "The Exarch has to pry your fingers loose to take the mask. Your nails have drawn blood from your palms. You feel wonderful.\n“A mask does not choose its wearer,” he murmurs. “But what answers in a mon-keigh heart may not be Khaine.”\nHe hangs it back on the wall, higher than before."),
    effects: {hp: -10, corruption: 10, renown: 3, set: {woreMask: true}, taint: {khorne: 40}},
    choices: [
      C("把流血的手藏进袖子", "Hide your bleeding hands in your sleeves", "eld_409",
        RS("回去的路上，你一直在想那只铁手。想得很平静。", "All the way back you think of the iron hand. Calmly."))
    ]};

  N.eld_408 = {chapter: 4, scene: "craftworld", speaker: MIRETH, time: {h: 2},
    text: L("她带你去一座小花园，所有的花都是她当年在“梦者之道”上种的。\n“那时我只做一件事：做梦，把梦种出来。”她摸着一朵发光的花，“后来梦得太深，差点回不来。”\n“所以现在我拿枪。枪很简单。”",
            "She takes you to a small garden. Every flower here she grew on the Path of the Dreamer.\n“Back then I did one thing: dream, and plant the dreams.” She touches a glowing bloom. “Then I dreamed too deep and nearly didn't come back.”\n“So now I carry a rifle. Rifles are simple.”"),
    choices: [
      C("摘一朵花给她", "Pick a flower for her", "eld_409",
        E({sanity: 5, renown: 2, set: {mirethFlower: true}}, "她愣了一下，把花别在灵魂石旁边。“猿人送的花，”她说，“传出去，我会被笑一百年。”",
          "She blinks, then tucks the flower beside her spirit stone. “A flower from a mon-keigh,” she says. “If this gets out, I'll be laughed at for a century.”")),
      C("“你梦见了什么，让你回不来？”", "“What did you dream that kept you there?”", "eld_408d")
    ]};

  N.eld_408d = {chapter: 4, scene: "craftworld", speaker: MIRETH,
    text: L("“一场宴会，”她说，“永远不散。每道菜都比上一道好。我吃了很久，久到忘了自己是谁。”\n“是先知把我叫醒的。她说我需要一件简单的事，于是我拿起了枪。”\n“后来，她又给了我一件：你。”",
            "“A feast,” she says. “One that never ended. Each dish better than the last. I ate for so long I forgot who I was.”\n“The Farseer called me back. She said I needed something simple, so I took up a rifle.”\n“Later she gave me one more simple thing: you.”"),
    effects: {sanity: -3, renown: 3, set: {mirethDream: true}},
    choices: [
      C("“我不算简单。”", "“I'm not that simple.”", "eld_409",
        RS("“我发现了，”她说。这是你第一次听见她笑出声。", "“I've noticed,” she says. It's the first time you hear her laugh aloud."))
    ]};

  N.eld_409 = {chapter: 4, scene: "craftworld", speaker: null, time: {h: 10}, eventRoll: 0.45,
    text: L("夜里，方舟的灯一层层暗下去。你梦见瓦尔达的麦田，妮尔在田埂上跑，越跑越远。\n醒来时，枕头是湿的。墙里很安静，安静得像在听你哭。",
            "At night the craftworld's lights dim, tier by tier. You dream of Valda's fields, Nell running along a ridge, farther and farther.\nYou wake with a damp pillow. The walls are very quiet, quiet as if listening to you cry."),
    alt: [A(F("woreMask"), "掌心的伤口在跳。你梦里也握着拳。", "The cuts in your palms throb. You were clenching your fists even in sleep.")],
    choices: [
      C("起身去找米瑞丝", "Get up and find Mireth", "eld_409m"),
      C("躺着，数墙里的声音", "Lie still and count the voices in the wall", "eld_411",
        E({sanity: -5, renown: 3, set: {countedVoices: true}, taint: {tzeentch: 30}}, "数到第三百个，有个声音很客气地叫出了你的名字。你不再数了。",
          "At three hundred, one voice says your name, very politely. You stop counting."))
    ]};

  N.eld_409m = {chapter: 4, scene: "craftworld", speaker: MIRETH, time: {h: 1},
    text: L("米瑞丝坐在走廊尽头，看方舟外的星星。她没问你为什么醒着。\n你们一起看了很久。她忽然问：“那个孩子，叫什么名字？”\n你告诉她了。她念了两遍，发音很准。",
            "Mireth sits at the corridor's end, watching the stars beyond the craftworld. She doesn't ask why you're awake.\nYou watch together a long while. Suddenly she asks, “The child. What was her name?”\nYou tell her. She says it twice, pronouncing it perfectly."),
    effects: {sanity: 8, set: {mirethKnowsNell: true}},
    choices: [
      C("回去睡觉", "Go back to sleep", "eld_411",
        RS("这一次你没做梦。", "This time you don't dream."))
    ]};

  N.eld_411 = {chapter: 4, scene: "craftworld", speaker: TAETHRA, time: {w: 6},
    gather: G("膳厅", "refectory"),
    text: L("膳厅里坐满了灵族。你坐在角落学他们吃饭：味道很淡，像怕吵醒什么。几十张脸不时转过来，低声议论“那个猿人”。\n六周后，先知在膳厅门口叫住你：“先知议会要决定你的去留。明天。”",
            "The refectory is full of Aeldari. You sit in a corner learning to eat their food: faint-flavoured, as if afraid to wake something. Dozens of faces turn now and then, murmuring about “the mon-keigh”.\nSix weeks on, the Farseer stops you at the refectory door. “The Seer Council will decide whether you stay. Tomorrow.”"),
    choices: [
      C("“我能自己说话吗？”", "“Will I be allowed to speak?”", "eld_411c",
        RS("“你可以，”她说，“他们未必会听。”", "“You may,” she says. “They may not listen.”"))
    ]};

  N.eld_411c = {chapter: 4, scene: "craftworld", speaker: COUNCIL, time: {d: 1},
    text: L("水晶穹顶下，先知议会围坐成圈。一位年长的先知说：“猿人的灵魂太亮，会把她引来。把它送回猿人那边。”\n塔艾丝拉没有争辩，只说：“这个猿人是一根线。”\n所有人都转过来看你。",
            "Beneath the crystal dome the Seer Council sits in a ring. An elder seer says: “A mon-keigh soul burns too bright. It will draw Her. Send it back to its kind.”\nTaethra doesn't argue. She only says, “This mon-keigh is a thread.”\nEvery face turns to you."),
    codex: ["eld_farseer"],
    choices: [
      C("请艾拉瑞斯替你说话", "Ask Ellaris to speak for you", "eld_501", M(ONLY("bonesong"),
        E({renown: 5}, "艾拉瑞斯说：“墙听过它唱歌。墙没有拒绝。”议会沉默了很久，同意你留下。",
          "Ellaris says: “The wall has heard it sing. The wall did not refuse.” After a long silence the Council lets you stay."))),
      C("请督军替你说话", "Ask the Exarch to speak for you", "eld_501", M(ONLY("maskOff"),
        E({renown: 5}, "督军只说一句：“它戴过面具，又摘下来了。”议会里有人低下了头。你被允许留下。",
          "The Exarch says one thing: “It wore a mask, and took it off.” Some in the Council lower their eyes. You may stay."))),
      C("自己说", "Speak for yourself", null,
        R(0.5, "renown", "eld_501", "eld_501w",
          "你讲了瓦尔达，讲了妮尔，没有求他们。议会同意你留下。",
          "You speak of Valda and of Nell, and you don't beg. The Council lets you stay.",
          "你说得太快，太响。议会同意你留下，但要有人看着。",
          "You speak too fast and too loud. The Council lets you stay, under watch.")),
      C("一言不发，等先知决定", "Say nothing; let the Farseer decide", "eld_501w",
        RS("塔艾丝拉替你说了三个字：“留下来。”议会加了一句：“看着它。”", "Taethra speaks for you in two words: “It stays.” The Council adds: “Watched.”"))
    ]};

  /* ============ Chapter 5 · The Masque of the Fall ============ */
  N.eld_501w = {chapter: 5, scene: "craftworld", speaker: MIRETH, time: {y: 1}, bridge: true,
    jump: J("一年过去", "A year passes"),
    text: L("议会让你留下，但要看着。一年里，每晚都有一个灵骨巨人站在你门外。\n米瑞丝替你争了一年，终于让巨人退到了走廊尽头。她教会了你三百个词，你教会了她吹口哨。\n今天，丑角剧团来了。",
            "The Council let you stay, under watch. For a year a wraithbone giant stood outside your door every night.\nMireth argued for you all year, until the giant stepped back to the end of the corridor. She taught you three hundred words; you taught her to whistle.\nToday the Harlequins have come."),
    effects: {sanity: -3, set: {watched: true}},
    choices: [
      C("去看演出", "Go to the performance", "eld_502",
        RS("巨人跟着你走到剧场门口，停下了。它不看戏。", "The giant follows you to the theatre door and stops. It doesn't watch plays.")),
      C("先去找米瑞丝，她每年都躲着这场戏", "Find Mireth first; she skips it every year", "eld_501m")
    ]};

  N.eld_501 = {chapter: 5, scene: "craftworld", speaker: null, time: {y: 1}, bridge: true,
    jump: J("一年过去", "A year passes"),
    gather: G("剧场前廊", "theatre hall"),
    effects: {sanity: 5, hp: 5},
    text: L("一年过去了。灵族开始叫你的名字，后面仍要加上“猿人”，像加一个敬称。米瑞丝教会了你三百个词，你教会了她吹口哨。\n今天丑角剧团来了。剧场前廊里挤满了人，整座方舟都在说悄悄话。",
            "A year passes. The Aeldari start using your name, though they still add “mon-keigh” after it, like an honorific. Mireth has taught you three hundred words; you've taught her to whistle.\nToday the Harlequins have come. The theatre hall is packed, and the whole craftworld is whispering."),
    choices: [
      C("去看演出", "Go to the performance", "eld_502",
        RS("你挤进最后一排。身边的灵族往旁边挪了挪，很客气。", "You squeeze into the back row. The Aeldari beside you shift over, politely.")),
      C("先去找米瑞丝，她每年都躲着这场戏", "Find Mireth first; she skips it every year", "eld_501m")
    ]};

  N.eld_501m = {chapter: 5, scene: "craftworld", speaker: MIRETH, time: {h: 1},
    text: L("米瑞丝在她的花园里，背对着剧场的方向。“我看过一百遍了。”\n你坐在她旁边，吹起她学会的那段口哨。吹到第三遍，她叹了口气，站起来。\n“只这一次，”她说，“你得坐我旁边。”",
            "Mireth is in her garden, her back to the theatre. “I've seen it a hundred times.”\nYou sit beside her and whistle the tune she learned. On the third time through she sighs and stands.\n“Just this once,” she says. “You sit next to me.”"),
    effects: {sanity: 5, set: {mirethAtMasque: true}},
    choices: [
      C("和她一起去剧场", "Go to the theatre together", "eld_502",
        RS("开演前，她已经攥紧了袖口。", "Before it starts, she is already gripping her sleeves."))
    ]};

  N.eld_502 = {chapter: 5, scene: "craftworld", speaker: DANCER, time: {h: 6},
    text: L("剧团演的是《陨落》。舞者扮成远古的灵族，在群星间宴饮，要更多，再要更多。\n舞台深处，一个四臂的舞者越长越高，美得让人害怕。\n观众里没有一个人动。连呼吸都没有。",
            "The troupe performs The Fall. Dancers play the ancient Aeldari, feasting among the stars, wanting more, and more again.\nAt the back of the stage a four-armed dancer grows taller and taller, beautiful enough to frighten you.\nNo one in the audience moves. No one even breathes."),
    codex: ["eld_harlequins", "eld_the_fall"],
    choices: [
      C("看到最后", "Watch to the end", "eld_503",
        E({sanity: -8, set: {sawMasque: true}, taint: {slaanesh: 15}}, "你移不开眼睛。你知道接下来会发生什么，就像知道一个梦的结局，却醒不过来。",
          "You can't look away. You know what's coming the way you know a dream's ending, yet cannot wake.")),
      C("转头看观众", "Turn and watch the audience", "eld_504")
    ]};

  N.eld_503 = {chapter: 5, scene: "craftworld", speaker: DANCER, time: {h: 1},
    text: L("音乐在最高处断了。舞台中央裂开一个洞，一声尖啸，所有舞者同时倒下。\n只有一个丑角还站着。他踮着脚从倒下的人中间溜走，回头做了个鬼脸。\n剧场里，终于有人哭出了声。",
            "The music snaps at its height. A hole tears open at centre stage, a single shriek, and every dancer falls at once.\nOnly one Harlequin stands. He tiptoes away between the fallen, turns back, and pulls a face.\nIn the theatre, someone finally sobs aloud."),
    effects: {sanity: -5},
    codex: ["god_slaanesh", "eld_laughing_god"],
    choices: [
      C("跟着笑一声", "Laugh along, just once", "eld_505",
        E({renown: 5, set: {harlequinFavor: true}}, "你笑出了声。几百张冷漠的脸同时转向你。台上，那个丑角朝你深深鞠了一躬。",
          "You laugh aloud. Hundreds of cold faces turn toward you. On stage, the Harlequin bows to you, deeply.")),
      C("沉默地坐着", "Sit in silence", "eld_504",
        E({set: {mournedFall: true}}, "你低下头，和他们一样。灯亮起来之前，你一直没抬头。",
          "You bow your head as they do, and don't raise it until the lights come up."))
    ]};

  N.eld_504 = {chapter: 5, scene: "craftworld", speaker: null, time: {h: 1},
    text: L("观众的脸都很平静，可每个人都在流泪，一直流到下巴。\n邻座一个陌生的灵族低声说：“这一夜，一个神诞生了。我们的帝国死在一声尖叫里。”\n“我们每年都看。免得忘了，为什么要活得这么小心。”",
            "Every face in the audience is calm, yet every one is weeping, tears running to the chin.\nA stranger in the next seat murmurs: “On this night a god was born. Our empire died in a single scream.”\n“We watch it every year. So we never forget why we live so carefully.”"),
    alt: [AT(F("mirethAtMasque"), "观众的脸都很平静，可每个人都在流泪，一直流到下巴。\n米瑞丝在你耳边说：“这一夜，一个神诞生了。我们的帝国死在一声尖叫里。”\n“我们每年都看。免得忘了，为什么要活得这么小心。”",
             "Every face in the audience is calm, yet every one is weeping, tears running to the chin.\nMireth whispers: “On this night a god was born. Our empire died in a single scream.”\n“We watch it every year. So we never forget why we live so carefully.”")],
    codex: ["eld_the_fall"],
    choices: [
      C("握住身边那只手", "Take the hand beside you", "eld_505",
        E({sanity: 5, set: {heldHand: true}}, "那只手没有抽回去。台上的鼓声停了，手指在你掌心里轻轻发抖。",
          "The hand doesn't pull away. When the drums fall silent, its fingers tremble in your palm.")),
      C("“那个神，就是她？”", "“That god—that's Her?”", "eld_505", M(
        E({sanity: -5, set: {namedHer: true}}, "对方闭上眼，点了一下头。一整排观众同时转过头来，好像你说出了一个禁忌的名字。",
          "Eyes close; one nod. A whole row turns to look at you, as if you'd spoken a forbidden name."),
        {codex: ["god_slaanesh"]})),
      C("灯亮之前溜出去", "Slip out before the lights come up", "eld_506",
        E({sanity: -3}, "你在黑暗里摸到门口。身后，几百个人一起抽泣，像一阵风。",
          "You feel your way to the door in the dark. Behind you, hundreds weep together, like a wind."))
    ]};

  N.eld_505 = {chapter: 5, scene: "craftworld", speaker: DANCER, time: {h: 3},
    text: L("散场后，那个镜面舞者坐在你旁边的台阶上，好像他一直都在。\n“一个猿人观众。欢笑之神喜欢剧本之外的客人。”他歪了歪头，\n“那个神永远在饿。我们的神只是一直跑，一直笑。你猜谁会赢？”",
            "After the show the mirror-masked dancer sits beside you on the steps, as if he'd always been there.\n“A mon-keigh in our audience. The Laughing God loves an unscripted guest.” He tilts his head.\n“That god is forever hungry. Ours just keeps running, keeps laughing. Who do you think wins?”"),
    codex: ["eld_laughing_god"],
    choices: [
      C("“跑的那个。”", "“The one who runs.”", "eld_506",
        E({renown: 5, set: {harlequinFavor: true}}, "他鼓掌，掌声没有声音。“答对了。轮到你跑的时候，记得笑。”然后台阶上就没人了。",
          "He applauds without a sound. “Correct. When it's your turn to run, remember to laugh.” Then the steps are empty.")),
      C("“没有人会赢。”", "“Nobody wins.”", "eld_506",
        E({sanity: -5, renown: 2, set: {cynic: true}}, "镜面里映出你的脸，很疲惫。“真无聊，”他说，“可惜你说对了。”",
          "His mask reflects your face, very tired. “How dull,” he says. “Pity you're right.”"))
    ]};

  N.eld_506 = {chapter: 5, scene: "craftworld", speaker: SYLVAEN, time: {d: 4},
    gather: G("码头", "docks"),
    text: L("码头上挤满了迎接的人：游侠们回来了，有人在打听外面的消息。其中一个摘下兜帽——是瓦尔达山脊上那个人。\n“西尔凡。”他报出名字，“星语塔的天线，是我切断的。”\n他没有低头。他在等你。",
            "The docks are crowded with people meeting the Rangers home, asking for news from outside. One lowers his hood: the man from the ridge on Valda.\n“Sylvaen,” he says. “The astropath tower's array. I was the one who cut it.”\nHe doesn't lower his eyes. He's waiting for you."),
    alt: [A(F("sylvaenWebway"), "“又是你，”你说。“又是我，”他说。", "“You again,” you say. “Me again,” he says."),
          A(F("sylvaenWord"), "“记账的人。”你说。他点头：“那天我说的是实话。”", "“The one who keeps accounts,” you say. He nods. “I told you the truth that day.”")],
    codex: ["eld_rangers"],
    choices: [
      C("一拳打过去", "Punch him", "eld_507",
        E({hp: -5, renown: 3, set: {punchedSylvaen: true}, taint: {khorne: 30}}, "他没躲。你的指节撞在他颧骨上，疼的却是你。他擦擦嘴角：“这一拳，该挨。”",
          "He doesn't dodge. Your knuckles crack against his cheekbone, and it's you who hurts. He wipes his mouth. “That one was owed.”")),
      C("“妮尔呢？”", "“And Nell?”", "eld_509"),
      C("“你也是奉命行事。”", "“You were following orders too.”", "eld_508",
        E({sanity: -5, renown: 5, set: {forgave: true}}, "他看了你很久。“我有选择，”他说，“我选了。”然后他第一次向你鞠躬，比对客人深一点。",
          "He looks at you a long time. “I had a choice,” he says. “I made it.” Then, for the first time, he bows to you, a little deeper than to a guest.")),
      C("“那晚你打断我的枪管，为什么不开第二枪？”", "“The night you shot my barrel. Why not a second shot?”", "eld_508", M(ONLY("origin_trooper"),
        M(E({renown: 5}, "“因为你放下了枪，”西尔凡说，“我想亲眼看看。”",
          "“Because you lowered your weapon,” Sylvaen says. “I wanted to see it with my own eyes.”"),
          {resultAlt: [RA(F("surrendered"), "“因为你放下了枪，举起了手，”西尔凡说，“一万种未来里你都会这么做。我想亲眼看看。”", "“Because you lowered your weapon and raised your hands,” Sylvaen says. “In ten thousand futures you do. I wanted to see.”"),
                       RA(F("firedOnRanger"), "“你打空了一个弹匣，我数着，”他说，“一发都没靠近。所以不必。”", "“You emptied a magazine. I counted,” he says. “None came close. So there was no need.”"),
                       RA(F("volunteered"), "“因为你放下了枪。第一个来查塔的人也是你。我想看看你是哪种猿人。”", "“You lowered your weapon. And you were first to check the tower. I wanted to see what kind you were.”")]})))
    ]};

  N.eld_507 = {chapter: 5, scene: "craftworld", speaker: SYLVAEN, time: {h: 1},
    text: L("你挥第二拳时，他接住了，很轻，像接住一片落叶。\n“游侠走的是放逐之路，”他说，“我们离开方舟，去外面看，去外面犯错。错得太多的，就回不来了。”\n“我大概快回不来了。”",
            "When you swing again he catches your fist, lightly, like catching a falling leaf.\n“Rangers walk the Path of the Outcast,” he says. “We leave the craftworld to see, and to err. Those who err too much never return.”\n“I think I am nearly there.”"),
    choices: [
      C("松开拳头", "Unclench your fist", "eld_508",
        RS("他放开你的手。码头上的人假装什么都没看见。", "He lets go of your hand. Everyone on the docks pretends not to have seen."))
    ]};

  N.eld_509 = {chapter: 5, scene: "craftworld", speaker: SYLVAEN, time: {h: 1},
    text: L("“穿梭机到了轨道，”西尔凡说，“一艘自由商船收容了它。之后我没去看。”\n“为什么？”\n“我不想知道。先知说这是软弱。”\n他转身前补了一句：“起飞时我在山脊上。她一直在喊你的名字。”",
            "“The shuttle reached orbit,” Sylvaen says. “A free trader took it aboard. After that... I did not look.”\n“Why not?”\n“Because I did not want to know. The Farseer calls that weakness.”\nTurning away, he adds: “I was on the ridge at lift-off. Before the hatch closed, she was calling your name.”"),
    alt: [AT(F("nellKept"), "“旧矿井很深，”西尔凡说，“墓穴的扫描更细。我在山脊上看了三天，没看见他们出来。”\n“也没看见他们被带走？”\n“我走了。我不想知道。先知说这是软弱。”",
             "“The old mine runs deep,” Sylvaen says. “The tomb's scans run finer. I watched from the ridge three days. I never saw them come out.”\n“Nor taken?”\n“I left. I did not want to know. The Farseer calls that weakness.”")],
    effects: {sanity: 5, renown: 3},
    choices: [
      C("谢谢他告诉你", "Thank him for telling you", "eld_508",
        RS("他点点头，好像道谢比挨骂更难受。", "He nods, as if thanks were harder to take than blame."))
    ]};

  N.eld_508 = {chapter: 5, scene: "craftworld", speaker: MIRETH, time: {d: 6}, eventRoll: 0.4,
    text: L("夜里，米瑞丝来你房间坐：“你们只活七八十年，怎么受得了？”\n“受不了，”你说，“所以我们什么都想快一点。”\n她想了想：“这听起来……很像她喜欢的那种灵魂。”说完，她自己先打了个寒战。",
            "At night Mireth comes to sit in your room. “You live seventy, eighty years. How do you bear it?”\n“We don't,” you say. “So we want everything quickly.”\nShe considers. “That sounds... like the kind of soul She likes.” She shivers at her own words."),
    alt: [A(F("readRules"), "她看见门口那本册子：“第三条是我写的。我写错了。”", "She sees the pamphlet by the door. “Rule three was mine. I was wrong.”")],
    choices: [
      C("给她讲妮尔的事", "Tell her about Nell", "eld_510", M(
        E({sanity: 10, set: {mirethKnowsNell: true}}, "你讲了很久，米瑞丝一句也没插。讲完，她说：“我会记住她。我们记得很久。”",
          "You talk a long while; Mireth never interrupts. When you finish, she says, “I'll remember her. We remember for a very long time.”"),
        {resultAlt: [RA(F("mirethKnowsNell"), "你讲妮尔的事，她替你补上了名字。“我说过，我们记得很久。”", "You talk about Nell; she supplies the name for you. “I told you. We remember a long time.”")]})),
      C("问她怕不怕死", "Ask if she fears death", "eld_510",
        E({sanity: -5, renown: 3, set: {askedDeath: true}}, "“不怕死，”她摸着灵魂石，“怕的是死后。可我有这个。”她顿了顿，“你什么都没有。”",
          "“Not death,” she says, touching her spirit stone. “What comes after. But I have this.” A pause. “You have nothing.”"))
    ]};

  N.eld_510 = {chapter: 5, scene: "craftworld", speaker: TAETHRA, time: {d: 2},
    text: L("先知召见你，这次没有符文，也没有水晶。\n“我们去伊尔达涅斯。你也去，米瑞丝护送你。你该亲眼看看四千一百万换来了什么。”\n“你在那里看见了什么？”\n“一把刀，”她说，“没看见握刀的手。”",
            "The Farseer summons you. This time, no runes, no crystal.\n“We go to Ildaneth. You will come; Mireth will escort you. You should see with your own eyes what forty-one million purchased.”\n“What did you see there?”\n“A blade,” she says. “Not the hand that holds it.”"),
    alt: [A(F("askedValda"), "“你问过瓦尔达还剩下什么。答案的另一半在那里。”", "“You asked what is left of Valda. The other half of the answer is there.”")],
    choices: [
      C("“好。”", "“Fine.”", "eld_600",
        E({renown: 2}, "她点头，像在一本账上记了一笔。", "She nods, as if making an entry in a ledger.")),
      C("“我不想看。”", "“I don't want to see it.”", "eld_600d",
        E({sanity: -5}, "“想不想，”她说，“从来不是未来关心的事。”", "“Want,” she says, “has never concerned the future.”"))
    ]};

  /* ============ Chapter 6 · The Maiden World ============ */
  N.eld_600 = {chapter: 6, scene: "webway", speaker: SYLVAEN, time: {d: 3, warp: true}, bridge: true,
    jump: J("乘小船穿过网道支路", "By skiff along a webway branch"),
    text: L("一艘灵族小船穿过网道支路。西尔凡领航，米瑞丝和两名守护者坐在你对面，先知在船尾闭着眼。\n三天里谁都没多说话。米瑞丝一直在擦枪，擦了一遍又一遍。\n第三天，舱门外透进了真正的阳光。",
            "An Aeldari skiff runs a webway branch. Sylvaen pilots; Mireth and two Guardians sit across from you; the Farseer rests her eyes at the stern.\nIn three days no one says much. Mireth cleans her rifle over and over.\nOn the third day, real sunlight comes through the hatch."),
    choices: [
      C("第一个走出舱门", "Be the first out of the hatch", "eld_601",
        RS("西尔凡侧身让你先过：“猿人先下。这是规矩，刚定的。”", "Sylvaen stands aside. “Mon-keigh first. A rule. As of now.”"))
    ]};

  N.eld_600d = {chapter: 6, scene: "webway", speaker: MIRETH, time: {d: 3, warp: true}, bridge: true,
    jump: J("乘小船穿过网道支路", "By skiff along a webway branch"),
    text: L("你没去码头。第二天早上，两个守护者礼貌地站在你门口。\n米瑞丝在舷梯上等你：“先知说想不想不重要。我说，那就让我陪着。”\n三天的航程你一句话也没说。第三天，舱门外透进了真正的阳光。",
            "You don't go to the docks. Next morning two Guardians stand politely at your door, one on each side.\nMireth waits on the gangway. “The Farseer says wanting doesn't matter. I said, then I'll keep you company.”\nYou don't speak for three days of travel. On the third day, real sunlight comes through the hatch."),
    choices: [
      C("最后一个走出舱门", "Be the last out of the hatch", "eld_601",
        RS("米瑞丝等你。她没催。", "Mireth waits for you. She doesn't hurry you."))
    ]};

  N.eld_601 = {chapter: 6, scene: "maiden_world", speaker: null, time: {h: 1}, eventRoll: 0.42,
    effects: {sanity: 10},
    text: L("伊尔达涅斯。天空干净得发蓝，森林一直长到海边。巨大的蜥兽在河边饮水，背上骑着灵族的孩子。\n这里没有方舟，没有城市。流亡者住在树下，种地，放牧。\n空气里有麦子的味道。你差点没站稳。",
            "Ildaneth. A sky scrubbed blue, forests running down to the sea. Huge reptiles drink at the river, Aeldari children on their backs.\nNo craftworld here, no cities. The Exodites live beneath the trees, farming, herding.\nThe air smells of wheat. You almost lose your footing."),
    codex: ["place_ildaneth", "eld_exodites"],
    choices: [
      C("走向那棵最大的树", "Walk toward the largest tree", "eld_602",
        RS("树下有很多人。先知走在你前面，没有回头。", "There are many people beneath it. The Farseer walks ahead and doesn't look back.")),
      C("蹲下来，捻一捻土", "Kneel and rub the soil between your fingers", "eld_601a", ONLY("origin_agri"))
    ]};

  N.eld_601a = {chapter: 6, scene: "maiden_world", speaker: ELDER, time: {h: 1},
    text: L("黑土，松软，带着露水的凉。父亲说过，好土会咬手指。这片土咬得很轻。\n一个流亡者农夫停下来看你。他看了很久，忽然蹲下，也捻了一把，冲你笑了。\n他把一把种子倒进你手心，指了指河边的空地。",
            "Dark soil, loose, cool with dew. Your father used to say good earth bites your fingers. This earth bites gently.\nAn Exodite farmer stops to watch you. After a long while he crouches, rubs a pinch himself, and grins at you.\nHe pours a handful of seed into your palm and points at the empty ground by the river."),
    effects: {sanity: 10, renown: 3, set: {maidenOK: true}},
    choices: [
      C("把种子揣好，去大树下", "Pocket the seeds; go to the great tree", "eld_602",
        RS("种子在口袋里沙沙响，像一小片麦田。", "The seeds rustle in your pocket like a very small field."))
    ]};

  N.eld_602 = {chapter: 6, scene: "maiden_world", speaker: ELDER, time: {h: 3},
    gather: G("长老树下", "elders' tree"),
    text: L("流亡者们聚在长老树下议事，孩子们在人群边上跑。长老拄着骨杖，比先知老，也随和。\n“我们的祖先在陨落前就走了，”她说，“他们说帝国太舒服，舒服得危险。我们的死者不进石头，进这片土地。”",
            "The Exodites gather beneath the elders' tree to talk, children running at the edge of the crowd. The elder leans on a bone staff, older than the Farseer and far easier.\n“Our ancestors left before the Fall,” she says. “They said the empire was too comfortable. Dangerously so. Our dead go not into stones but into this land.”"),
    alt: [A(F("mournedFall"), "“听说剧场里有个猿人为陨落低过头，”她说，“是你？”", "“I hear a mon-keigh bowed its head for the Fall at the masque,” she says. “You?”")],
    choices: [
      C("“你们知道瓦尔达吗？”", "“Do you know of Valda?”", "eld_602v"),
      C("跟着孩子们去果园", "Follow the children to the orchard", "eld_603",
        RS("孩子们跑在前面，回头看你有没有跟上，像在逗一只大狗。", "The children run ahead and look back to see if you're following, as if teasing a big dog."))
    ]};

  N.eld_602v = {chapter: 6, scene: "maiden_world", speaker: ELDER, time: {h: 1},
    text: L("长老摇头。她不知道。你讲了瓦尔达：麦田、星语塔、四千一百万。\n树下安静了。她听完，当着全族的面，向你低下了头。\n“我们欠了一笔不知道的债，”她说，“这片土地会记得你。”",
            "The elder shakes her head. She doesn't know. You tell her of Valda: the wheat, the tower, forty-one million.\nBeneath the tree it goes quiet. When you finish, she bows her head to you before all her people.\n“We owe a debt we never knew of,” she says. “This land will remember you.”"),
    effects: {sanity: -5, renown: 5, set: {elderKnows: true, maidenOK: true}},
    choices: [
      C("去果园走走", "Walk to the orchard", "eld_603",
        RS("先知站在人群外，没有过来。她听见了。", "The Farseer stands outside the crowd and doesn't come closer. She heard."))
    ]};

  N.eld_603 = {chapter: 6, scene: "maiden_world", speaker: null, time: {h: 2},
    text: L("一个流亡者孩子跑过来，往你手里塞了一个果子，然后躲到树后偷看你。\n果子很普通，有点酸。不是完美的味道，只是一个果子。\n这个孩子活着。四千一百万人，换了这六千个人。果子还是温的。",
            "An Exodite child runs up, presses a fruit into your hand, and hides behind a tree to peek at you.\nThe fruit is ordinary, a little sour. Not a perfect taste—just a fruit.\nThis child lives. Forty-one million for these six thousand. The fruit is still warm."),
    choices: [
      C("吃掉果子，冲孩子笑", "Eat it, and smile at the child", "eld_604",
        E({sanity: 10, renown: 3, set: {ateFruit: true, maidenOK: true}}, "孩子从树后走出来，学你咧嘴笑，牙缝里也夹着果皮。你笑着笑着，眼睛就湿了。",
          "The child steps out and copies your grin, peel stuck in her teeth too. You're smiling, and then your eyes are wet.")),
      C("放下果子，走开", "Put the fruit down and walk away", "eld_604",
        E({sanity: -8, renown: 5}, "你吃不下。孩子不明白，捡起果子，困惑地看着你的背影。",
          "You can't eat it. The child doesn't understand. She picks up the fruit and watches you go, puzzled."))
    ]};

  N.eld_604 = {chapter: 6, scene: "maiden_world", speaker: SEYL, time: {d: 1},
    text: L("第二天，一艘陌生的船降落，来人的盔甲上刻着骷髅与新芽。\n“我是赛尔，伊芙蕾恩的使者。”她看向先知，“听说塞卢纳的先知为这片林子，喂掉了一整颗猿人星球。我来看看值不值。”",
            "Next day a strange ship lands. The newcomer's armour bears skulls and new shoots.\n“I am Seyl, herald of Yvraine.” She looks at the Farseer. “I hear Selunar's seer fed a whole mon-keigh world to keep this forest. I came to see whether it was worth it.”"),
    codex: ["eld_ynnari", "eld_yvraine"],
    choices: [
      C("“先知好像不太欢迎你。”", "“The Farseer doesn't seem to welcome you.”", "eld_605")
    ]};

  N.eld_605 = {chapter: 6, scene: "maiden_world", speaker: TAETHRA, time: {h: 1},
    text: L("“恩灵派，”先知的语气冷得结霜，“他们要把墙里的祖先叫醒，拿去当武器。”\n赛尔笑了：“而你们把祖先关在墙里，当电池用。”\n两人同时看向你，好像该由一个猿人来评理。",
            "“Ynnari,” the Farseer says, her tone frosting over. “They would wake our ancestors from the walls and wield them as weapons.”\nSeyl smiles. “While you keep your ancestors in the walls as batteries.”\nBoth turn to you, as if a mon-keigh should judge between them."),
    choices: [
      C("“讲讲你们的死神。”", "“Tell me about your god of death.”", "eld_606"),
      C("“艾德拉德是谁？”", "“Who is Eldrad?”", "eld_607"),
      C("“我站在塔艾丝拉这边。”", "“I stand with Taethra.”", "eld_608",
        E({renown: 8, set: {loyal: true}}, "先知没有道谢。可那天晚上，她让你坐在离她最近的火边。",
          "The Farseer offers no thanks. But that night she has you sit at the fire nearest hers."))
    ]};

  N.eld_606 = {chapter: 6, scene: "maiden_world", speaker: SEYL, time: {h: 1},
    text: L("“恩灵是死者之神，”赛尔说，“最后一个灵族死去时，它会完全醒来，吞掉渴求者。”\n“伊芙蕾恩死在黑暗之城的角斗场，又带着恩灵的一部分站了起来。”\n她递来一枚骨白小骷髅：“猿人也能戴。”",
            "“Ynnead is the god of the dead, not yet fully awake,” Seyl says. “When the last Aeldari dies, it wakes and devours She Who Thirsts.”\n“Yvraine died in the arenas of the Dark City, and rose again carrying a piece of Ynnead.”\nShe offers a small bone-white skull. “Even a mon-keigh may wear it.”"),
    codex: ["eld_ynnead"],
    choices: [
      C("戴上它", "Put it on", "eld_607",
        E({renown: 5, sanity: -5, set: {ynnari: true}}, "骷髅贴着胸口，凉得像井水。先知看见了，一把抓起了她的符文石。",
          "The skull rests cold as well-water against your chest. The Farseer sees, and snatches up her rune-stones.")),
      C("礼貌地拒绝", "Politely decline", "eld_608",
        E({renown: 3}, "赛尔并不意外：“死者有耐心。等你想要的时候，它会在。”",
          "Seyl isn't surprised. “The dead are patient. When you want it, it will be there.”"))
    ]};

  N.eld_607 = {chapter: 6, scene: "maiden_world", speaker: S("omen_farseer", "幻象", "Vision"), time: {h: 1},
    text: L("先知让你握住一颗符文石。你看见一个身影站在无数命运之线中间，像拨琴弦一样拨弄它们。\n“艾德拉德·乌斯兰，”她说，“为了一根线，他也让猿人的世界烧过。他拨动过银河，最后也被拨动了。”",
            "The Farseer has you hold a rune-stone. You see a figure amid countless threads of fate, plucking them like harp strings.\n“Eldrad Ulthran,” says Taethra. “For one thread, he too let mon-keigh worlds burn. He played the whole galaxy, and in the end he was played.”"),
    alt: [A(F("ynnari"), "“这就是你胸口那枚骷髅最后跟着的人，”她说。", "“This is whom the skull on your chest followed in the end,” she says.")],
    effects: {sanity: -3, renown: 5},
    codex: ["eld_eldrad"],
    choices: [
      C("继续看那只拨线的手", "Keep watching the hand on the threads", "eld_607w"),
      C("松手", "Let go", "eld_608",
        E({sanity: -3}, "石头从你掌心滚回她手里。你的手指还在发麻。", "The stone rolls from your palm back into hers. Your fingers still tingle."))
    ]};

  N.eld_607w = {chapter: 6, scene: "maiden_world", speaker: S("omen_farseer", "幻象", "Vision"),
    text: L("你没松手。线越来越多，其中一根是你的。有一只手在拨它——不是塔艾丝拉的，也不是艾德拉德的。\n那只手发现你在看，停了一下，好像在笑。\n先知把符文石从你手里抽走：“够了。”",
            "You don't let go. More threads, and one is yours. A hand is plucking it—not Taethra's, not Eldrad's.\nThe hand notices you watching, pauses, and seems to laugh.\nThe Farseer pulls the stone from your grip. “Enough.”"),
    effects: {sanity: -5, set: {watchedThreads: true}, taint: {tzeentch: 40}},
    choices: [
      C("“那是谁的手？”", "“Whose hand was that?”", "eld_608",
        RS("她没回答。那天夜里，她一直没睡。", "She doesn't answer. That night she doesn't sleep at all."))
    ]};

  N.eld_608 = {chapter: 6, scene: "maiden_world", speaker: VHESSRA, foe: "drukhari_raider", time: {h: 20},
    text: L("夜里，黑色快艇掠过森林。瘦得像刀的身影跳下来，钩子闪光，专挑孩子。领头的女人和米瑞丝很像。\n“黑暗灵族，”米瑞丝举枪，“我们的表亲。他们靠吃别人的痛苦活着。”\n果园里，孩子们在哭。",
            "That night black skiffs skim the forest. Blade-thin figures leap down, hooks glinting. They go for the children. Their leader looks very like Mireth.\n“Drukhari,” Mireth hisses, raising her rifle. “Our cousins. After the Fall they chose to feed on others' pain.”\nIn the orchard, children are crying."),
    alt: [A(F("metVhessra"), "是网道里那个满身钩子的女人。她也认出了你。", "It's the hook-hung woman from the webway. She recognises you too."),
          A(F("ateFruit"), "哭得最响的，是那个给你果子的孩子。", "Loudest of all is the child who gave you the fruit.")],
    effects: {sanity: -5, hp: -15},
    codex: ["eld_drukhari"],
    choices: [
      C("冲进果园", "Charge into the orchard", null,
        R(0.5, "hp", "eld_609", "eld_610",
          "你扑倒一个孩子，钩子从你头顶划过。米瑞丝的枪声在你身后连成一片。",
          "You tackle a child down; a hook whistles over your head. Behind you, Mireth's fire is one long roar.",
          "钩子勾住你的外套，把你拖倒在地。米瑞丝冲过来，挡在你和刀之间。",
          "A hook snags your coat and drags you down. Mireth rushes in between you and the blade.")),
      C("像防卫军那样，守住果园入口", "Hold the orchard gate, defence-force style", "eld_609", M(ONLY("origin_trooper"),
        M(E({hp: -10, renown: 5}, "你守住了入口，一枪一枪，像在瓦尔达的路口。可他们从果园另一侧来了。",
          "You hold the gate shot by shot, as at Valda's crossroads. But they come in from the orchard's far side."),
          {resultAlt: [RA(F("forgiven_edda"), "你守住了入口，像那天和埃达一样，这回没跑。可他们从另一侧来了。", "You hold the gate as you did with Edda, and you don't run. But they come in from the far side."),
                       RA(F("wronged_edda"), "你守住了入口。这回你没跑，埃达看不见了。可他们从另一侧来了。", "You hold the gate. This time you don't run; Edda isn't here to see. They come in from the far side.")]}))),
      C("躲进树洞", "Hide in a hollow tree", "eld_610h",
        E({sanity: -8, set: {wronged_mireth: true}}, "你钻进树洞，捂住嘴。外面，米瑞丝在喊你的名字。你没有回答。",
          "You crawl into the hollow and cover your mouth. Outside, Mireth is calling your name. You don't answer."))
    ]};

  N.eld_609 = {chapter: 6, scene: "maiden_world", speaker: VHESSRA, foe: "drukhari_raider", time: {h: 1},
    text: L("你抱起一个孩子往后撤。钩子落下时，米瑞丝挡在了你们身后。\n领头的女人抽回钩子，笑容停了一下：“姐姐，你还是这么慢。”\n快艇撤了。她回头说：“网道里那个大家伙在附近，我可不想被它闻见。”",
            "You scoop up a child and fall back. When the hook comes down, Mireth is behind you both.\nTheir leader pulls the hook free and looks at Mireth on the ground. Her smile falters. “Still so slow, sister.”\nThe skiffs pull out. She calls back: “The big one in the webway is close. I'd rather it didn't smell me.”"),
    effects: {renown: 10, sanity: -5, set: {savedChild: true, maidenOK: true}},
    codex: ["eld_drukhari"],
    choices: [
      C("把孩子放下，跑向米瑞丝", "Set the child down and run to Mireth", "eld_609m",
        RS("孩子抓着你的衣角，不肯放。你把她交给了长老。", "The child won't let go of your coat. You hand her to the elder."))
    ]};

  N.eld_609m = {chapter: 6, scene: "maiden_world", speaker: MIRETH, time: {h: 1},
    text: L("米瑞丝靠着树坐下，伤得很重。“她叫维丝拉，”她说，“很多年前，她选了另一条路。”\n她把灵魂石按进你手心：“替我拿着。别让她……”\n石头在你掌心亮了一下，像一次心跳。然后稳稳地亮着。",
            "Mireth sits against a tree, badly hurt. “Her name is Vhessra,” she says. “Many years ago she chose the other road.”\nShe presses her spirit stone into your palm. “Hold this for me. Don't let Her...”\nThe stone flares once in your hand, like a heartbeat. Then it glows, steady."),
    alt: [A(F("mirethFlower"), "那朵猿人送的花还别在石头旁边，已经蔫了。", "The mon-keigh's flower is still tucked beside the stone, wilted now."),
          A(F("mirethKnowsNell"), "“妮尔，”她说，“我答应过记住她。现在换你。”", "“Nell,” she says. “I promised to remember her. Now it's your turn.”")],
    effects: {sanity: -5, hp: -10, set: {carryStone: true, mirethDead: true}},
    choices: [
      C("握紧石头", "Close your hand around it", "eld_611",
        RS("石头很暖。你握了一整夜，没松开。", "The stone is warm. You hold it all night and don't let go."))
    ]};

  N.eld_610 = {chapter: 6, scene: "maiden_world", speaker: null, foe: "drukhari_raider", time: {h: 2},
    text: L("你倒在地上，看着米瑞丝挡在你身前。领头的女人笑着把刀送了进去。\n天亮时，掠夺者走了，带走了十几个孩子。米瑞丝倒在果园边。\n她胸前的灵魂石滚落在草丛里，还在发光，像在等一只手。",
            "From the ground you watch Mireth stand over you. The leader, smiling, puts the blade in.\nBy dawn the raiders are gone, and a dozen children with them. Mireth lies at the orchard's edge.\nHer spirit stone has rolled into the grass, still glowing, as if waiting for a hand."),
    alt: [A(F("metVhessra"), "那个女人是网道里的维丝拉。走之前，她叫米瑞丝“姐姐”。", "The woman was Vhessra from the webway. Before leaving, she called Mireth “sister”.")],
    effects: {sanity: -8, hp: -15, set: {mirethDead: true}},
    choices: [
      C("捡起灵魂石", "Pick up the spirit stone", "eld_611",
        E({renown: 5, set: {carryStone: true}}, "石头很暖。你觉得它在你掌心里轻轻松了一口气。",
          "The stone is warm. It seems to breathe out, softly, in your palm.")),
      C("留给先知", "Leave it for the Farseer", "eld_610s")
    ]};

  N.eld_610h = {chapter: 6, scene: "maiden_world", speaker: null, time: {h: 6},
    text: L("你在树洞里听了一整夜。米瑞丝在喊你的名字，一遍，又一遍，越来越远，最后停了。\n天亮时你爬出来。她倒在孩子们藏身的那棵树下，枪口还朝着外面。\n她的灵魂石滚在草丛里，还在发光。",
            "You listen all night from the hollow. Mireth calls your name, again and again, farther and farther, then stops.\nAt dawn you crawl out. She lies beneath the tree where the children hid, her rifle still facing outward.\nHer spirit stone lies in the grass, still glowing."),
    effects: {sanity: -5, set: {mirethDead: true}, taint: {nurgle: 15}},
    choices: [
      C("捡起灵魂石", "Pick up the spirit stone", "eld_611",
        E({renown: 3, set: {carryStone: true}}, "石头是暖的。你却觉得它在躲你的手。",
          "The stone is warm. Yet it seems to shy from your hand.")),
      C("不敢碰，留给先知", "You daren't touch it; leave it for the Farseer", "eld_610s")
    ]};

  N.eld_610s = {chapter: 6, scene: "maiden_world", speaker: TAETHRA,
    text: L("先知弯腰拾起石头，看了你一眼。那眼神你读不懂，但不像责备。\n“她会回到墙里，”她说，“回到她的花园旁边。”\n她把石头收进袖子。你的手空着。",
            "The Farseer stoops for the stone and glances at you. You can't read the look, but it isn't reproach.\n“She will go home to the walls,” she says. “Near her garden.”\nShe tucks the stone into her sleeve. Your hands are empty."),
    effects: {sanity: 5, set: {stoneToSeer: true}},
    choices: [
      C("跟她去葬礼", "Follow her to the funeral", "eld_611",
        RS("一路上，先知的袖子一直在微微发光。", "All the way, the Farseer's sleeve glows faintly."))
    ]};

  N.eld_611 = {chapter: 6, scene: "maiden_world", speaker: TAETHRA, time: {d: 1},
    gather: G("葬礼", "funeral"),
    text: L("全族流亡者都来参加葬礼，把死者埋进树根下，唱着你听不懂的歌。被掳走的孩子没有坟。\n先知轻声算了一遍：“六千，减十四。”第一次不像在报天气。\n“我看见了刀，”她说，“没看见是谁。”",
            "Every Exodite comes to the funeral. They bury the dead beneath the tree roots, singing a song you don't understand. The stolen children have no graves.\nThe Farseer, beside you, counts under her breath. “Six thousand, less fourteen.” For once it isn't a weather report.\n“I saw the blade,” she says. “Not whom.”"),
    alt: [A(F("savedChild"), "被你救下的那个孩子站在长老身边，没让她算进那个数里。", "The child you saved stands beside the elder, not counted in that number."),
          A(F("elderKnows"), "长老在树根边给你留了一个位置，在她的族人中间。", "The elder has kept you a place by the roots, among her people.")],
    choices: [
      C("“值得吗？”", "“Was it worth it?”", "eld_700",
        E({renown: 3, set: {askedWorth: true}}, "她看着树根很久。“我不知道，”她说，“先知不该说这句话。我说了。”",
          "She looks at the roots a long time. “I do not know,” she says. “A Farseer should never say that. I have said it.”")),
      C("默默跟着哼那支歌", "Hum the song along with them", "eld_700",
        E({sanity: 8, set: {sangDead: true, canSing: true}}, "你不懂歌词，只跟着调子。一个流亡者孩子靠过来，握住了你的手指。",
          "You don't know the words; you follow the tune. An Exodite child leans against you and takes hold of your finger.")),
      C("搭西尔凡的船回去", "Ride home on Sylvaen's ship", "eld_700r",
        RS("西尔凡没问为什么。他只是多解开了一根缆绳。", "Sylvaen doesn't ask why. He just casts off one more line."))
    ]};

  /* ============ Chapter 7 · She Who Thirsts ============ */
  N.eld_700 = {chapter: 7, scene: "webway", speaker: TAETHRA, time: {d: 3, warp: true}, bridge: true,
    jump: J("穿过网道回塞卢纳", "Back to Selunar through the webway"),
    text: L("回塞卢纳的船舱里，只有你和先知。三天里，她第一次主动开口。\n“墙里的声音在变少，”她说，“网道里有东西在吃，一口一口。从我们去伊尔达涅斯那天起，它吃得更快了。”",
            "In the cabin of the ship back to Selunar there is only you and the Farseer. In three days, for the first time, she speaks first.\n“The voices in the walls are thinning,” she says. “Something in the webway is eating, mouthful by mouthful. Since we went to Ildaneth, it eats faster.”"),
    alt: [A(F("carryStone"), "她看着你握紧的手：“你拿着她。它会闻到的。”", "She looks at your closed hand. “You carry her. It will smell that.”"),
          A(F("askedWorth"), "“你问我值不值得，”她说，“我还在数。”", "“You asked if it was worth it,” she says. “I am still counting.”")],
    choices: [
      C("下船，去追思厅", "Disembark; go to the hall of mourning", "eld_701",
        RS("港口很安静。没有人来看猿人了。", "The harbour is quiet. No one comes to look at the mon-keigh any more."))
    ]};

  N.eld_700r = {chapter: 7, scene: "webway", speaker: SYLVAEN, time: {d: 3, warp: true}, bridge: true,
    jump: J("穿过网道回塞卢纳", "Back to Selunar through the webway"),
    text: L("你搭了西尔凡的船。他一路没说话，直到网道的光变暗。\n“我切断那座塔的时候，”他说，“先知告诉我，那是唯一的线。”\n“现在我开始怀疑，她是不是也只看见了刀。”",
            "You ride on Sylvaen's ship. He says nothing until the webway's light dims.\n“When I cut that tower,” he says, “the Farseer told me it was the only thread.”\n“Now I begin to wonder whether she too saw only the blade.”"),
    alt: [A(F("forgave"), "“你说我也是奉命行事，”他说，“这句话我想了一年。”", "“You said I was following orders too,” he says. “I've thought about that for a year.”"),
          A(F("punchedSylvaen"), "他摸了摸颧骨，那里的淤青早就好了。", "He touches his cheekbone. The bruise healed long ago.")],
    effects: {set: {sylvaenFriend: true}},
    choices: [
      C("下船，去追思厅", "Disembark; go to the hall of mourning", "eld_701",
        RS("他在码头上站了很久，看着你走远。", "He stands on the dock a long time, watching you go."))
    ]};

  N.eld_701 = {chapter: 7, scene: "craftworld", speaker: ELLARIS, time: {h: 4},
    grudgeLine: {npc: "mireth", text: L("艾拉瑞斯没问米瑞丝是怎么死的，只看了你一眼，又移开了。", "Ellaris doesn't ask how Mireth died. He glances at you, then away.")},
    gather: G("追思厅", "hall of mourning"),
    text: L("追思厅里挤满了灵族，都是为墙里越来越少的声音来的。米瑞丝的死讯比你先到。\n艾拉瑞斯脸色很差：“网道里有东西在一口一口地吃。它找最新鲜的灵魂，比如刚死的。”\n“我们叫它无餍者。”",
            "The hall of mourning is crowded with Aeldari, come because the voices in the walls are thinning. News of Mireth's death arrived before you.\nEllaris looks grey. “Something in the webway is eating, mouthful by mouthful. It seeks the freshest souls. The newly dead.”\n“It has a name. We call it the Unsated.”"),
    alt: [A(F("wallVoice"), "“墙里问你是谁的那个声音，”他说，“已经不见了。”", "“The voice in the wall that asked who you were,” he says, “is gone.”"),
          A(F("stoneToSeer"), "先知把米瑞丝的石头交给了他。他没有放进墙里：“墙已经不安全了。”", "The Farseer has given him Mireth's stone. He hasn't set it in the wall. “The walls aren't safe now.”")],
    effects: {sanity: -5},
    codex: ["eld_infinity_circuit", "eld_the_unsated"],
    choices: [
      C("把米瑞丝的石头交给他", "Give him Mireth's stone", "eld_702", M(ONLY("carryStone"),
        E({sanity: 5, set: {carryStone: false}}, "艾拉瑞斯把石头贴在额头，唱了一句很短的歌。墙接过了它，像接过一个孩子。",
          "Ellaris presses the stone to his brow and sings one short phrase. The wall receives it, as if receiving a child."))),
      C("把石头留在身边", "Keep the stone with you", "eld_702", M(M(ONLY("carryStone"),
        E({renown: 5}, "“她让你拿着，”艾拉瑞斯低声说，“那就拿着。灵骨记得谁答应过什么。”",
          "“She asked you to hold it,” Ellaris murmurs. “Then hold it. Wraithbone remembers who promised what.”")),
        {grudge: {npc: "mireth", effects: {sanity: -4}, note: L("她最后听见的是你的沉默。石头一直是凉的。", "The last thing she heard was your silence. The stone stays cold.")}})),
      C("“它在吃什么？”", "“What is it eating?”", "eld_701e"),
      C("对石头说出树洞里的那一夜", "Tell the stone about the night in the tree", "eld_702", M({require: [{flag: "carryStone"}, {flag: "wronged_mireth"}], hideIfLocked: true},
        E({sanity: 4, set: {forgiven_mireth: true}}, "你对石头说出了那一夜：树洞，黑暗，她喊你的名字。石头很久没有动静。然后，它暖了一度。",
          "You tell the stone about that night: the hollow tree, the dark, her voice calling your name. It stays silent a long while. Then it warms by one degree.")))
    ]};

  N.eld_701e = {chapter: 7, scene: "craftworld", speaker: ELLARIS, time: {h: 2}, eventRoll: 0.4,
    text: L("艾拉瑞斯带你走到回路最深处的一面墙前。墙在发抖，像冬天里的人。\n“我们的祖先，”他说，“还有我们的将来。它从回路的边上一层层啃进来。”\n他把手按上去，唱了一句，墙才安静下来。",
            "Ellaris leads you to a wall deep in the circuit. It is shivering, like someone in winter.\n“Our ancestors,” he says. “And our futures. It gnaws in from the circuit's edge, layer by layer.”\nHe lays a hand on it and sings one phrase before it stills."),
    alt: [A(F("namedHer"), "“剧场里你叫过她的名字，”他说，“名字会招来东西。”", "“At the masque you named Her,” he says. “Names draw things.”")],
    effects: {sanity: -5, renown: 3},
    choices: [
      C("回房间", "Go back to your room", "eld_702",
        RS("那天夜里，你很早就睡了。你后悔睡得那么早。", "That night you go to sleep early. You will wish you hadn't."))
    ]};

  N.eld_702 = {chapter: 7, scene: "jungle", speaker: S("sigil_slaanesh", "完美的声音", "A Perfect Voice"), time: {h: 9},
    text: L("那晚你梦见瓦尔达。麦子金黄，没有墓穴，妮尔长大了，在门口喊你吃饭。\n一切都刚刚好，好得让人想哭。\n一个声音轻轻地说：“这是可以的。只要你把那扇门打开一点点。”",
            "That night you dream of Valda. The wheat is gold, there is no tomb, and Nell, grown, calls you in to supper from the door.\nEverything is exactly right, right enough to make you weep.\nA voice says softly, “This can be. If you'll open the door, just a little.”"),
    alt: [AT(F("origin_pilgrim"), "那晚你梦见瓦尔达。麦子金黄，没有墓穴，妮尔端着一碗清水站在谷仓门口，叫你进去吃饭。\n一切都刚刚好，好得让人想哭。\n一个声音轻轻地说：“这是可以的。只要你把那扇门打开一点点。”",
             "That night you dream of Valda. The wheat is gold, there is no tomb, and Nell stands at the barn door with a bowl of clear water, calling you in to eat.\nEverything is exactly right, right enough to make you weep.\nA voice says softly, “This can be. If you'll open the door, just a little.”"),
          AT(F("origin_trooper"), "那晚你梦见瓦尔达。麦子金黄，没有墓穴，妮尔举着你削的木头小兵，在农舍门口等你下岗回家。\n一切都刚刚好，好得让人想哭。\n一个声音轻轻地说：“这是可以的。只要你把那扇门打开一点点。”",
             "That night you dream of Valda. The wheat is gold, there is no tomb, and Nell waits at the farmhouse door with your wooden soldier, for you to come off duty.\nEverything is exactly right, right enough to make you weep.\nA voice says softly, “This can be. If you'll open the door, just a little.”")],
    codex: ["eld_she_who_thirsts", "god_slaanesh"],
    choices: [
      C("走进家门", "Walk through the door", "eld_702t"),
      C("咬破手背，逼自己醒来", "Bite your hand to wake yourself", "eld_703",
        E({hp: -5, sanity: -8, renown: 5, set: {bitHand: true}}, "你在黑暗里醒来，手背上一圈牙印。墙里的声音都屏住了呼吸。",
          "You wake in the dark with a ring of tooth-marks on your hand. The voices in the walls are holding their breath."))
    ]};

  N.eld_702t = {chapter: 7, scene: "jungle", speaker: S("sigil_slaanesh", "完美的声音", "A Perfect Voice"),
    text: L("饭菜的香味完美无缺。你坐下，吃了一口。\n醒来时，嘴里还有那个味道。之后的每一顿饭，都像嚼灰。\n枕头上有一股甜味，怎么洗都洗不掉。",
            "The supper smells flawless. You sit down and take one bite.\nYou wake with the taste still in your mouth. Every meal afterward tastes of ash.\nYour pillow smells sweet, and no washing gets it out."),
    alt: [A(F("mirethDream"), "米瑞丝说过，她梦里那场宴会永远不散。就是这个味道。", "Mireth said the feast in her dream never ended. This is how it tasted.")],
    effects: {corruption: 20, sanity: 10, set: {tasted: true}, taint: {slaanesh: 45}},
    choices: [
      C("去水晶穹顶找先知", "Go to the crystal dome to find the Farseer", "eld_703",
        RS("先知已经在等你了。她看了你一眼，就知道你吃过了。", "The Farseer is already waiting. One look, and she knows you've eaten."))
    ]};

  N.eld_703 = {chapter: 7, scene: "craftworld", speaker: TAETHRA, time: {d: 1},
    text: L("先知说出了全部：无餍者，色孽的大魔守密者。\n“它最想要新死的灵魂，比如米瑞丝，但它爱先玩。一个带着她、没有石头护身的猿人走进网道，它一定会追。”\n“我在你身后封门。所以你被留下。”",
            "In the crystal dome the Farseer tells you everything: the Unsated, a Keeper of Secrets, a Greater Daemon of Slaanesh.\n“It craves the newly dead, like Mireth. But it likes to play first. A mon-keigh carrying her, with no stone of its own, walking into the webway—it will follow.”\n“I seal the gate behind you. That is why you were kept.”"),
    alt: [A(NF("carryStone"), "她把一颗空心的诱魂石放进你掌心：“它会以为她在里面。”", "She sets a hollow lure-stone in your palm. “It will think she is inside.”"),
          A(ANYF("tasted", "heardHer"), "“它已经尝过你了，”她说，“它认得路。”", "“It has tasted you already,” she says. “It knows the way.”")],
    effects: {sanity: -5},
    codex: ["eld_keeper_of_secrets", "eld_the_unsated"],
    choices: [
      C("“我去。”", "“I'll go.”", "eld_705", M(
        E({renown: 10, set: {bait: true}}, "先知微微低下头。那是你在方舟上见过的，最深的一次鞠躬。",
          "The Farseer inclines her head. It is the deepest bow you've seen on the craftworld."),
        {resultAlt: [RA(F("askedWhy"), "“你问过我为什么留你，”她说，“现在你知道了。”然后她鞠了一躬，很深。", "“You asked why I kept you,” she says. “Now you know.” Then she bows, deeply.")]})),
      C("“再看一次未来。为我。”", "“Read the future again. For me.”", "eld_704", {require: {stat: "renown", min: 35}}),
      C("“不。我受够了你的算术。”", "“No. I'm done with your arithmetic.”", "eld_706",
        E({sanity: 5, renown: -5}, "你转身就走。没人拦你，连符文石都停止了转动。",
          "You turn and leave. No one stops you. Even the rune-stones stop turning."))
    ]};

  N.eld_704 = {chapter: 7, scene: "craftworld", speaker: S("omen_farseer", "塔艾丝拉的符文", "Taethra's Runes"), time: {h: 3},
    text: L("先知第一次为一个猿人重新抛出符文。石头在半空停住，排成一条你看不懂的路。\n“有一根线，”她的声音有些哑，“那里，你不是一个人在黑暗里。有人在笑，有人捧着死者。”\n“很细。但它在。”",
            "For the first time, the Farseer casts her runes again for a mon-keigh. The stones halt mid-air in a pattern you can't read.\n“There is a thread,” she says, a little hoarse. “In it, you are not alone in the dark. Someone laughs. Someone carries the dead.”\n“It is thin. But it is there.”"),
    alt: [A(F("toldDreams"), "“你讲过的梦里，也有这根线，”她说，“我那时没认出来。”", "“This thread was in the dreams you told me,” she says. “I did not recognise it then.”"),
          A(F("watchedThreads"), "有一根线在发抖，像刚被谁拨过。她皱眉，没说什么。", "One thread trembles as if just plucked. She frowns and says nothing.")],
    effects: {renown: 5, sanity: -5, set: {betterThread: true, bait: true}},
    choices: [
      C("“那就走那根线。”", "“Then we walk that thread.”", "eld_705",
        RS("符文石一颗颗落回她手里，像雨停了。", "The rune-stones drop back into her hand one by one, like rain stopping."))
    ]};

  N.eld_706 = {chapter: 7, scene: "craftworld", speaker: SYLVAEN, time: {h: 6},
    text: L("码头上，西尔凡在等你，船的引擎已经热好了。\n“最近的猿人世界，三天航程，”他说，“我欠你的。”\n他顿了顿：“但先知看见的那些未来里，你回去的……没有一个是好的。”",
            "At the docks Sylvaen is waiting, his ship's engines already warm.\n“The nearest mon-keigh world is three days out,” he says. “I owe you this.”\nA pause. “But of the futures the Farseer saw where you go back... none were kind.”"),
    alt: [A(F("sylvaenFriend"), "“我这一年都在想那座塔，”他说，“至少让我送你。”", "“I've thought about that tower all year,” he says. “At least let me take you.”")],
    choices: [
      C("登船回家", "Board, and go home", "eld_706b",
        E({sanity: 10}, "船离开塞卢纳时，你没有回头。你想象着一个有人叫你真名的地方。",
          "As the ship leaves Selunar you don't look back. You imagine a place where people call you by your real name.")),
      C("再想一晚", "Sleep on it one more night", "eld_705",
        E({sanity: -5, set: {bait: true}}, "你在码头坐到天亮。西尔凡一直陪着，一句话也没说。天亮时，你自己走回了水晶穹顶。",
          "You sit on the dock till dawn. Sylvaen stays, silent the whole time. At first light you walk back to the crystal dome on your own.")),
      C("回去找先知", "Go back to the Farseer", "eld_705",
        E({renown: 5, set: {bait: true, sylvaenGate: true}}, "西尔凡关掉了引擎。“我猜到了，”他说，“我在网道口等你。”",
          "Sylvaen shuts off the engines. “I guessed,” he says. “I'll wait for you at the webway gate.”"))
    ]};

  N.eld_706b = {chapter: 7, scene: "ship_interior", speaker: SYLVAEN, time: {d: 3},
    jump: J("三天航程，到人类边境世界", "Three days' flight to a human border world"),
    text: L("西尔凡把你放在一颗人类边境世界的港口外，没有下船。\n“线还在，”他说，“只是不在我们手里了。”\n隔离站，审讯排队，又是十几天。你讲了实话。审判官翻开卷宗时，你看见上面已经有你的名字。",
            "Sylvaen sets you down outside the port of a human border world, and doesn't disembark.\n“The thread holds,” he says. “Only not in our hands.”\nQuarantine, queues, interrogation: a dozen more days. You tell the truth. When the Inquisitor opens her file, your name is already in it."),
    alt: [A(F("sentCall"), "“瓦尔达发出过一条求救，”她说，“署名是你。”", "“Valda sent one call for help,” she says. “It bears your name.”"),
          A(F("reported"), "“还有瓦尔达防卫军的一份报告，签名也是你。”", "“And a Valda defence-force report, signed by you as well.”")],
    choices: [
      C("把一切都讲完", "Tell her everything", "eld_end_burned",
        RS("她听得很仔细，一句也没打断。", "She listens carefully and never interrupts."))
    ]};

  N.eld_705 = {chapter: 7, scene: "craftworld", speaker: S("omen_khaine", "凯恩的化身", "Avatar of Khaine"), time: {d: 2},
    gather: G("神殿外广场", "shrine plaza"),
    text: L("出发前夜，全方舟的人聚在神殿外广场上，没人说话。一位年轻的灵族走进铁铸的密室，再没出来。\n然后铁门熔化，一个燃烧的巨人走出来，手淌熔铁。\n“凯恩的化身醒了，”艾拉瑞斯说，“这是战争。”",
            "The night before you leave, the whole craftworld gathers in the shrine plaza outside Khaine's temple, silent. A young Aeldari walks into an iron chamber and does not come out.\nThen the iron door melts, and a burning giant strides out, molten metal running from its hands.\n“The Avatar of Khaine wakes,” says Ellaris. “This is war.”"),
    effects: {sanity: -5},
    codex: ["eld_khaine"],
    choices: [
      C("看着那个燃烧的巨人", "Watch the burning giant", "eld_707",
        E({renown: 5, sanity: -5, set: {sawAvatar: true}}, "它从你身边走过，热浪烤干了你的眼泪。它没看你。它只看得见战争。",
          "It passes you; the heat dries your tears. It doesn't see you. It can see only war.")),
      C("去找艾拉瑞斯", "Go to Ellaris", "eld_705c"),
      C("跟在燃烧的巨人身边走", "Walk at the burning giant's side", "eld_707", M(ONLY("woreMask"),
        E({hp: -8, renown: 5, set: {sawAvatar: true, followedAvatar: true}, taint: {khorne: 25}}, "热浪烤焦了你的眉毛。你掌心那道旧伤又开始跳，跳得和它的脚步一样。",
          "The heat singes your brows. The old cuts in your palms throb again, in step with its stride.")))
    ]};

  N.eld_705c = {chapter: 7, scene: "craftworld", speaker: ELLARIS, time: {h: 2},
    text: L("艾拉瑞斯把你拉到人群外，对着一小块灵骨唱了很久，唱出一枚麦穗形的护身符。\n“灵骨记得歌，”他说，“它会替你记住回家的路。”\n他把它塞进你手里，手指冰凉。",
            "Ellaris draws you out of the crowd and sings to a scrap of wraithbone for a long time, until it becomes a charm shaped like an ear of wheat.\n“Wraithbone remembers songs,” he says. “It will remember the way home for you.”\nHe presses it into your hand. His fingers are cold."),
    alt: [A(F("bonesong"), "他唱的，正是你那天哼的那段收割歌。", "What he sings is the very harvest song you hummed that day."),
          A(NF("bonesong"), "“你没给我唱过歌，”他说，“那我替你唱。”", "“You never sang for me,” he says. “So I'll sing for you.”")],
    effects: {hp: 10, sanity: 5, set: {charm: true, canSing: true}, taint: {all: -10}},
    choices: [
      C("把护身符挂在脖子上", "Hang the charm round your neck", "eld_707",
        RS("它轻轻地贴着你的锁骨，像一粒还没收的麦子。", "It rests lightly on your collarbone, like a grain not yet harvested."))
    ]};

  N.eld_707 = {chapter: 7, scene: "webway", speaker: TAETHRA, time: {h: 4},
    text: L("网道口。守护者列队，相位战士戴上了战面，燃烧的化身站在最前面。\n先知最后一次看你：“走进去，一直走。它会来。我封门的时候，不要回头。”\n“如果我回头了呢？”\n“那就是另一根线了。”",
            "The webway gate. Guardians in ranks, Aspect Warriors masked for war, the burning Avatar at the front.\nThe Farseer looks at you one last time. “Walk in, and keep walking. It will come. When I seal the gate, do not look back.”\n“And if I do?”\n“Then that is another thread.”"),
    alt: [A(ANYF("sylvaenGate", "sylvaenFriend"), "西尔凡站在门边，长枪靠在肩上：“我送你到第一个拐角。”", "Sylvaen stands by the gate, rifle on his shoulder. “I'll see you to the first bend.”"),
          A(F("maskOff"), "督军经过你身边，扣上自己的面具，向你点了点头。", "The Exarch passes you, settles his own mask, and nods to you.")],
    choices: [
      C("走进网道，不回头", "Walk into the webway; don't look back", "eld_801",
        RS("你迈进光里。身后的队列一点声音都没有。", "You step into the light. Behind you, the ranks make no sound at all.")),
      C("再问先知最后一句话", "Ask the Farseer one last thing", "eld_800")
    ]};

  N.eld_end_burned = {chapter: 7, scene: "burning_city", speaker: S("inquisitor", "审判官", "Inquisitor"), time: {d: 2},
    text: L("你回到人类那边，讲了一切：灵族、网道、先知、那两个数字。\n审判官记着笔记。“与异形同处逾年，”她合上本子，“灵魂已不可信。”\n第二天广场上点起火堆，人们唱着赞美帝皇的歌。",
            "Back among humans, you tell them everything: the Aeldari, the webway, the Farseer, the two numbers.\nThe Inquisitor takes notes. “Over a year among xenos,” she says, closing her book. “The soul cannot be trusted.”\nNext day a pyre is lit in the square, and the crowd sings praise to the Emperor."),
    alt: [A(F("heldWithEdda"), "证人名单上有一个叫埃达的幸存者，她说你守过路口。没人听。", "The witness list names a survivor called Edda. She says you held the crossroads. No one listens."),
          A(FROM("eld_806h"), "“异形的船，异形的护送，”审判官说，“这本身就是证据。”", "“A xenos ship, a xenos escort,” the Inquisitor says. “That alone is evidence.”")],
    codex: ["imp_inquisition"],
    ending: {kind: "bad", title: L("归乡之火", "Homecoming Pyre"), cause: L("被当作异形同谋烧死", "Burned as a xenos collaborator")}};

  /* ============ Chapter 8 · The Last Dance ============ */
  N.eld_800 = {chapter: 8, scene: "webway", speaker: TAETHRA, time: {h: 1}, bridge: true,
    text: L("光门前，你停下来，回头看先知。“如果我回不来——”\n“那我会记住你，”她说，“我们记得很久。”\n她第一次碰了碰你的额头，很轻，像试探一块新骨头的温度。",
            "At the gate you stop and look back at the Farseer. “If I don't come back—”\n“Then I will remember you,” she says. “We remember a long time.”\nShe reaches out and, for the first time, touches your brow, lightly, as if testing the warmth of new bone."),
    alt: [A(F("mirethKnowsNell"), "“就像米瑞丝记住了那个孩子的名字。”", "“As Mireth remembered the child's name.”")],
    effects: {renown: 5, sanity: 5, set: {saidGoodbye: true}},
    choices: [
      C("转身，走进网道", "Turn and walk into the webway", "eld_801",
        RS("你没有再回头。你答应过。", "You don't look back again. You promised."))
    ]};

  N.eld_801 = {chapter: 8, scene: "webway", speaker: null, time: {h: 4, warp: true}, bridge: true,
    jump: J("孤身走进网道深处", "Alone, deep into the webway"),
    grudgeLine: {npc: "mireth", text: L("你想起树洞里的那一夜：米瑞丝喊了你一整晚。", "You remember the night in the hollow tree: Mireth calling you, over and over.")},
    text: L("你独自走着。光墙一层层暗下去，空气越来越甜，甜得发腻。\n远处有音乐，不是丑角的——太完美了，每个音都落在你最想听的地方。",
            "You walk alone. The walls of light dim layer by layer; the air grows sweet, cloyingly sweet.\nFar off there is music—not the Harlequins'. Too perfect: every note lands exactly where you most want it."),
    alt: [A(F("carryStone"), "口袋里，米瑞丝的石头在发热。", "In your pocket, Mireth's stone is growing warm."),
          A(NF("carryStone"), "掌心里那颗空心的诱魂石，轻得像什么都没有。", "The hollow lure-stone in your palm weighs almost nothing."),
          A(F("wardStone"), "胸前那颗小护魂石发凉，替你挡开了一点甜味。", "The little ward-stone at your chest turns cool and holds off a little of the sweetness.")],
    choices: [
      C("握住米瑞丝的灵魂石", "Hold Mireth's spirit stone", "eld_801s", M(ONLY("carryStone"),
        {grudge: {npc: "mireth", effects: {sanity: -6}, note: L("你躲起来，听她喊你。石头只给了你沉默。", "You hid and let her call. The stone gives you only silence.")}})),
      C("握住那枚灵骨麦穗", "Hold the wraithbone wheat-ear", "eld_802", M(ONLY("charm"),
        E({sanity: 5, hp: 5}, "灵骨在你掌心哼起了收割歌，跑调跑得和你一模一样。",
          "The wraithbone hums the harvest song in your palm, off-key exactly the way you sang it."))),
      C("向帝皇祈祷", "Pray to the Emperor", "eld_802", M(ONLY("prayedEmperor"),
        E({sanity: 5, taint: {slaanesh: -10}}, "帝皇的光很远，远得像另一个银河。可你念完一遍，甜味淡了一点。",
          "The Emperor's light is far, far as another galaxy. But when you finish the prayer, the sweetness fades a little."))),
      C("继续往前走", "Keep walking", "eld_802")
    ]};

  N.eld_801s = {chapter: 8, scene: "webway", speaker: null,
    text: L("石头里有一声很轻的叹息，像米瑞丝在你耳边说：别碰墙，别离开路，别回应叫你名字的东西。\n你握紧它，往前走。甜味退开了一步。",
            "A faint sigh within the stone, as if Mireth whispers in your ear: don't touch the walls, don't leave the path, don't answer anything that calls your name.\nYou grip it and walk on. The sweetness steps back."),
    alt: [A(F("heldHand"), "握着它，像那天在剧场里握着一只发抖的手。", "Holding it is like holding a trembling hand in the theatre that night."),
          A(F("askedDeath"), "她说过，她不怕死，怕的是死后。现在，死后在你手里。", "She said she didn't fear death, only what came after. Now what came after is in your hand.")],
    effects: {sanity: 10, taint: {slaanesh: -10}},
    choices: [
      C("往前走", "Walk on", "eld_802")
    ]};

  N.eld_802 = {chapter: 8, scene: "webway", speaker: DAEMON, foe: "greater_daemon_slaanesh", time: {h: 1},
    text: L("它从光里走出来，高得要仰头才看全。四只手臂，一张美得让人心碎的脸——剧场里那个四臂的舞者，原来不是演的。\n“终于，”无餍者用妮尔的声音说，“我不要你的命。我只想给你想要的一切。”",
            "It steps out of the light, so tall you must crane your neck. Four arms, and a face so beautiful it breaks your heart: the four-armed dancer from the masque was no invention.\n“At last,” says the Unsated, in Nell's voice. “I don't want your life. I only want to give you everything you want.”"),
    alt: [A(F("carryStone"), "它盯着你的口袋：“把她给我。她闻起来像花园。”", "It eyes your pocket. “Give her to me. She smells like a garden.”"),
          A(ANYF("tasted", "heardHer"), "“我们见过的，”它温柔地说，“你尝过我的。”", "“We've met,” it says tenderly. “You've had a taste of me.”")],
    effects: {sanity: -8, corruption: 5, hp: -10},
    codex: ["eld_keeper_of_secrets", "eld_the_unsated"],
    choices: [
      C("听它说下去", "Let it go on", "eld_803"),
      C("“不。”", "“No.”", null,
        R(0.65, "sanity", "eld_804", "eld_803",
          "你说得很清楚。它的笑容停了一瞬，像一幅画裂了道缝。",
          "You say it clearly. Its smile stalls for an instant, like a crack across a painting.",
          "你张开嘴，说出来的却是：“……说下去。”",
          "You open your mouth, and what comes out is: “...Go on.”")),
      C("说出梦里的那个词", "Speak the word from your dream", null, M(ONLY("heardWord"),
        R(0.8, "sanity", "eld_804", "eld_803",
          "“还没到时候。”你说。那个词从舌头底下长出来，像一颗发芽的种子。它退了一步。",
          "“Not yet,” you say. The word grows from under your tongue like a sprouting seed. It steps back.",
          "那个词卡在喉咙里，怎么也说不对。它笑了：“说下去。”",
          "The word sticks in your throat and won't come out right. It smiles. “Go on.”"))),
      C("对着它大笑", "Laugh in its face", "eld_805", M({require: {flag: "harlequinFavor"}},
        E({renown: 5}, "你笑了，笑得像个傻子。四周的光里，传来另一个笑声，回应着你。",
          "You laugh like a fool. From the surrounding light, another laugh answers yours.")))
    ]};

  N.eld_803 = {chapter: 8, scene: "jungle", speaker: DAEMON, foe: "greater_daemon_slaanesh", time: {h: 1},
    grudgeLine: {npc: "mireth", text: L("你想起米瑞丝在果园里的喊声。你没有应过。", "You think of Mireth's voice in the orchard. You never answered it.")},
    text: L("它让你看：瓦尔达的麦田完好无损，妮尔长大了，在门口等你，四千一百万人都活着。\n“只要你点头，”它温柔地说，“你就永远在那里。完美的，永远的。”\n你从没这么想要过一样东西。",
            "It shows you: Valda's fields untouched; Nell grown, waiting at the door; forty-one million alive.\n“Only nod,” it says tenderly, “and you'll be there forever. Perfect. Forever.”\nYou have never wanted anything so much."),
    alt: [AT(F("bitHand"), "它让你看：瓦尔达的麦田完好无损，妮尔长大了，在门口等你，四千一百万人都活着。\n“只要你点头，”它温柔地说，“你就永远在那里。”\n手背上那圈牙印忽然疼了起来，像有人在提醒你什么。",
             "It shows you: Valda's fields untouched; Nell grown, waiting at the door; forty-one million alive.\n“Only nod,” it says tenderly, “and you'll be there forever.”\nThe ring of tooth-marks on your hand suddenly aches, as if someone is reminding you of something."),
          A(F("lastLook"), "你记得每一块田。眼前这片，多了一块。", "You remember every field. This view has one too many."),
          A(F("tasted"), "嘴里又泛起那个味道。", "That taste rises in your mouth again.")],
    effects: {corruption: 15, taint: {slaanesh: 25}},
    choices: [
      C("点头", "Nod", "eld_end_thirst"),
      C("“先让我尝一口。”", "“Just let me taste it first.”", "eld_803",
        E({corruption: 15, sanity: 10, taint: {slaanesh: 25}}, "一口就好。味道完美得让你发抖。它微笑着，又把盘子推近了一点。",
          "Just one bite. It tastes so perfect you tremble. Smiling, it nudges the plate a little closer.")),
      C("把灵魂石按在心口", "Press the spirit stone to your heart", "eld_804", M(M(ONLY("carryStone"),
        E({corruption: -15, sanity: 5, taint: {slaanesh: -15}}, "石头烫得像火。你听见米瑞丝在里面喊你的真名。麦田碎了，像一面镜子。",
          "The stone burns like fire. You hear Mireth inside it calling your true name. The wheat field shatters like a mirror.")),
        {grudge: {npc: "mireth", effects: {hp: -8, sanity: -4}, note: L("石头记得你躲起来的那一夜，烫得像在惩罚你。", "The stone remembers the night you hid, and burns like a punishment.")}})),
      C("想起妮尔真正的样子", "Remember Nell as she really was", "eld_804", M(
        E({sanity: -12, renown: 3}, "真正的妮尔牙缝里塞着麦壳，数船总数错。这个完美的妮尔不会数错。你后退了一步。",
          "The real Nell had chaff in her teeth and always miscounted the ships. This perfect Nell never would. You step back."),
        {resultAlt: [RA(F("origin_pilgrim"), "真正的妮尔端来的那碗水是浑的，她还洒了一半。这碗太清了。你后退了一步。", "The real Nell's bowl of water was muddy, and she spilled half. This one is too clear. You step back."),
                     RA(F("origin_trooper"), "真正的妮尔嫌你削的小兵腿太短。这个妮尔什么都不嫌。你后退了一步。", "The real Nell said your wooden soldier's legs were too short. This Nell complains of nothing. You step back.")]}))
    ]};

  N.eld_804 = {chapter: 8, scene: "webway", speaker: null, foe: "greater_daemon_slaanesh", time: {h: 1},
    text: L("身后的网道口亮起符文，一道接一道，像有人一页页合上一本书。先知在封门。\n大魔察觉了陷阱。它尖啸着扑过来，四只手同时伸向你。\n门只剩一道缝。你还在门里。",
            "Behind you runes ignite at the webway gate, one after another, like someone closing a book page by page. The Farseer is sealing it.\nThe daemon sees the trap. Shrieking, it lunges, all four hands reaching.\nThe gate is down to a sliver. You are still on the wrong side."),
    alt: [A(F("sawAvatar"), "门缝外，燃烧的化身挡住了追出来的小恶魔，熔铁溅在光墙上。", "Beyond the gap the burning Avatar holds back the lesser daemons; molten iron spatters the walls of light."),
          A(F("wraithNod"), "门缝边，那个你点过头的灵骨巨人伸出一只手，撑住了正在合拢的门。", "At the gap, the wraithbone giant you once nodded to puts out a hand and braces the closing gate.")],
    effects: {hp: -20},
    choices: [
      C("冲向那道缝", "Run for the gap", null,
        R(0.5, "hp", "eld_806", "eld_end_sealed",
          "你扑过门缝，后背一凉，一只手擦着你抓了个空。门在身后合上，轻轻“咔”的一声。",
          "You dive through the gap; something cold brushes your back as a hand closes on nothing. The gate shuts behind you with a soft click.",
          "那只手比你快。你被拽回去的瞬间，看见门缝合拢，先知的脸消失在另一边。",
          "The hand is faster. As you're dragged back, you see the gap close and the Farseer's face vanish on the other side.")),
      C("站住，相信那根线", "Stand still. Trust the thread.", "eld_806", M({require: {stat: "renown", min: 40}},
        E({renown: 5}, "你闭上眼。一根看不见的线勒住你的腰，猛地一拽——你飞过门缝，摔在先知脚边。",
          "You close your eyes. An unseen thread cinches your waist and yanks—you fly through the gap and land at the Farseer's feet."))),
      C("呼唤恩灵", "Call on Ynnead", "eld_807", ONLY("ynnari")),
      C("寻找那个笑声", "Listen for the laughter", "eld_805", {require: [{flag: "betterThread"}, {flag: "harlequinFavor"}], hideIfLocked: true})
    ]};

  N.eld_805 = {chapter: 8, scene: "webway", speaker: DANCER, foe: "greater_daemon_slaanesh", time: {h: 1},
    text: L("光墙裂开，一队丑角翻着跟头涌进来，衣服的颜色每一步都在变。\n他们围着大魔起舞，学它的动作，更美、更快，还冲它做鬼脸。\n大魔被激怒，追着他们撞进封印。镜面舞者伸手：“该跑了，观众。”",
            "The walls split and a whole troupe of Harlequins tumbles in, colours shifting with every step.\nThey dance around the daemon, mimicking every move, lovelier and faster, pulling faces at it.\nEnraged, it chases them headlong into the seal. The mirror-masked dancer offers you a hand. “Time to run, audience.”"),
    alt: [A(F("cynic"), "“你说过没人会赢，”他说，“那就别输得太难看。”", "“You said nobody wins,” he says. “Then don't lose too badly.”"),
          A(F("sawMasque"), "你看过那出戏的结尾。这一次，倒下的是它。", "You saw how the play ended. This time, it is the one that falls.")],
    codex: ["eld_harlequins", "eld_laughing_god"],
    choices: [
      C("跟着剧团走", "Go with the troupe", "eld_end_masque",
        RS("你握住那只手。下一步，你已经在另一条走廊里，身后的尖啸像落幕的掌声。",
           "You take the hand. One step later you're in another corridor, the shriek behind you like curtain-call applause.")),
      C("回到先知那边", "Return to the Farseer", "eld_806",
        RS("舞者耸耸肩，把你从门缝里推了回去：“观众总要回家。”", "The dancer shrugs and shoves you back through the gap. “Audiences do go home.”"))
    ]};

  N.eld_806 = {chapter: 8, scene: "craftworld", speaker: TAETHRA, time: {h: 6},
    text: L("封印合上了。网道深处，大魔的尖啸越来越远，最后变成一段听不清的歌。\n先知站在你面前，看了你很久。\n“线还在，”她说。然后她做了一件从没做过的事——问你：“你想去哪里？”",
            "The seal is closed. Deep in the webway the daemon's shriek recedes until it's only a song you can't make out.\nThe Farseer stands before you, looking at you a long time.\n“The thread holds,” she says. Then she does something she has never done. She asks: “Where do you wish to go?”"),
    alt: [A(F("loyal"), "“你在伊尔达涅斯站在我这边，”她说，“这次我站你这边。”", "“On Ildaneth you stood with me,” she says. “This time I stand with you.”"),
          A(F("honestDontKnow"), "“米瑞丝说，你不知道猿人死后去哪。那至少选一选活着去哪。”", "“Mireth told me you did not know where your souls go. Then at least choose where the living go.”")],
    effects: {sanity: 10, renown: 10},
    choices: [
      C("“伊尔达涅斯。去种地。”", "“Ildaneth. To farm.”", "eld_end_maiden", M({require: {flag: "maidenOK"}},
        RS("“长老会给你一块地，”先知说，“她欠你的。”", "“The elder will give you a field,” the Farseer says. “She owes you.”"))),
      C("“留在塞卢纳，跟艾拉瑞斯学唱歌。”", "“Here. Let Ellaris teach me to sing.”", "eld_end_guest", M({require: {flag: "canSing"}},
        RS("“墙会高兴的，”她说。你从没听她用过这个词。", "“The walls will be glad,” she says. You've never heard her use that word."))),
      C("“回家。回人类那边。”", "“Home. Back to humanity.”", "eld_806h"),
      C("“去找恩灵派。”", "“To the Ynnari.”", "eld_end_ynnari", M(ONLY("ynnari"),
        RS("先知看着你胸口的骷髅，很久才点头：“去吧。死者有耐心。”", "The Farseer looks at the skull on your chest a long while, then nods. “Go. The dead are patient.”")))
    ]};

  N.eld_806h = {chapter: 8, scene: "ship_interior", speaker: TAETHRA, time: {d: 15},
    jump: J("先知的船，驶向人类边境", "The Farseer's ship, to the human border"),
    text: L("先知亲自为你备了船，把你送到人类边境世界的外缘。\n临别时，她最后一次说：“线还在。只是不在我手里了。”\n她没有看你的眼睛。船门合上，你又是一个普通的人类了。",
            "The Farseer readies a ship herself and takes you to the edge of a human border world.\nAt parting she says it one last time: “The thread holds. Only not in my hand.”\nShe doesn't meet your eyes. The hatch closes, and you are an ordinary human again."),
    choices: [
      C("走下舷梯", "Walk down the ramp", "eld_end_burned",
        RS("港口的守卫看见那艘船，立刻举起了枪。", "The port guards see the ship and raise their guns at once."))
    ]};

  N.eld_807 = {chapter: 8, scene: "webway", speaker: S("omen_ynnead", "恩灵之光", "Light of Ynnead"), foe: "greater_daemon_slaanesh", time: {h: 1},
    text: L("胸前的小骷髅忽然变冷。苍白的光从网道地面升起，像死者一个个站起来。\n光里有个女人的轮廓，手持双刃——伊芙蕾恩的影子。亡魂们围住大魔，一寸寸把它推回黑暗。\n其中一道光，经过你时停了一下。",
            "The little skull on your chest turns cold. Pale light rises from the webway floor, like the dead standing up one by one.\nIn it, the outline of a woman with twin blades: Yvraine's shadow. The souls surround the daemon and push it, inch by inch, back into the dark.\nOne light pauses as it passes you."),
    effects: {sanity: 5},
    codex: ["eld_ynnead", "eld_yvraine"],
    choices: [
      C("跟着那道光走", "Follow that light", "eld_end_ynnari"),
      C("回到先知身边", "Return to the Farseer", "eld_806")
    ]};

  /* ============ Endings ============ */
  N.eld_end_maiden = {chapter: 8, scene: "maiden_world", speaker: null, time: {y: 3},
    jump: J("尾声：三年后", "Epilogue: three years on"),
    text: L("三年后，伊尔达涅斯河边多了一块麦田，是一个猿人种的。\n你教流亡者的孩子唱收割歌。他们唱得比你还难听。\n有时先知会来，站在田埂上，什么也不说，只看着麦子。",
            "Three years on, a wheat field grows by Ildaneth's river, planted by a mon-keigh.\nYou teach the Exodite children the harvest song. They sing it even worse than you.\nSometimes the Farseer visits, stands at the field's edge, says nothing, and watches the wheat."),
    alt: [A(F("ateFruit"), "孩子们管它叫“会哭的人的田”。是给你果子的那个孩子起的名。", "The children call it “the field of the one who cries”. The child with the fruit named it."),
          A(F("savedChild"), "被你从掠夺者手里救下的那个孩子，每年都来帮你收麦。", "The child you saved from the raiders comes every year to help you harvest.")],
    ending: {kind: "good", title: L("处女世界的麦田", "Wheat on a Maiden World"), cause: L("在伊尔达涅斯种麦", "Farming on Ildaneth")}};

  N.eld_end_guest = {chapter: 8, scene: "craftworld", speaker: ELLARIS, time: {y: 5},
    jump: J("尾声：五年后", "Epilogue: five years on"),
    text: L("五年后，塞卢纳空荡的街区里，有一面墙是一个猿人唱好的。裂缝合得歪歪扭扭，可它不再漏光了。\n艾拉瑞斯说，你永远成不了灵骨歌者。\n他说这话时，正在教你下一首歌。",
            "Five years on, in one of Selunar's empty districts, there is a wall a mon-keigh sang whole. The crack healed crooked, but it no longer leaks light.\nEllaris says you will never be a Bonesinger.\nHe says it while teaching you the next song."),
    alt: [A(F("sangDead"), "有时你也唱伊尔达涅斯葬礼上那支歌。墙听得很安静。", "Sometimes you sing the funeral song from Ildaneth. The walls listen very quietly.")],
    ending: {kind: "good", title: L("会唱歌的客人", "The Guest Who Sings"), cause: L("留在方舟学唱灵骨", "Stayed to sing wraithbone")}};

  N.eld_end_ynnari = {chapter: 8, scene: "webway", speaker: S("omen_ynnead", "恩灵派", "The Ynnari"), time: {y: 1, warp: true},
    jump: J("尾声：随恩灵派远行", "Epilogue: with the Ynnari"),
    text: L("你跟着恩灵派走遍了网道。他们叫你“活着的那个”：队伍里只有你活不过一千岁。\n伊芙蕾恩远远地看过你一眼，点了点头。\n你教过一个死去的朋友吹口哨。现在，你常常替她吹。",
             "You walk the webway with the Ynnari. They call you “the living one”: you're the only one among them who won't see a thousand years.\nYvraine glances at you once from afar, and nods.\nYou once taught a friend, now dead, to whistle. These days you often whistle for her."),
    ending: {kind: "good", title: L("死者的同行人", "Companion of the Dead"), cause: L("随恩灵派同行", "Walks with the Ynnari")}};

  N.eld_end_masque = {chapter: 8, scene: "webway", speaker: DANCER, time: {y: 7, warp: true},
    jump: J("尾声：随剧团远行", "Epilogue: with the troupe"),
    text: L("丑角剧团多了一个观众。他们从不让你上台，只让你在黑暗里笑第一声。\n每次《陨落》演到结尾，台下最先笑出来的，总是那个猿人。\n有人说，欢笑之神本人来看过一场，笑得最响的就是他。",
            "The Harlequin troupe gains an audience of one. They never let you on stage; they only let you laugh first in the dark.\nEvery time The Fall reaches its end, the first laugh from the seats is always the mon-keigh's.\nThey say the Laughing God himself attended once, and laughed the loudest."),
    ending: {kind: "good", title: L("欢笑之神的观众", "The Laughing God's Audience"), cause: L("随丑角剧团远行", "Joined the Harlequins")}};

  N.eld_end_thirst = {chapter: 8, scene: "jungle", speaker: DAEMON, time: {y: 1, warp: true},
    text: L("你点了头。瓦尔达的麦田在你周围展开，完美无缺，妮尔在门口等你。\n你进门，坐下，吃饭。每一顿都一样完美。\n每一天都一样。你想停下，却想不起该怎么停。很远的地方，有什么正吃得很开心。",
            "You nod. Valda's fields unfold around you, flawless; Nell waits at the door.\nYou go in, sit down, eat. Every supper is just as perfect.\nEvery single day. You want to stop, but can't remember how. Far away, something is feasting happily."),
    ending: {kind: "bad", title: L("完美的晚餐", "The Perfect Supper"), cause: L("被色孽慢慢饮尽", "Slowly drunk dry by Slaanesh")}};

  N.eld_end_sealed = {chapter: 8, scene: "webway", speaker: null, foe: "greater_daemon_slaanesh", time: {d: 1, warp: true},
    text: L("门合上了。另一边，先知垂下眼睛，在符文上划掉一根线。\n你和大魔一起被封在网道里。它不急，它有的是时间；你会慢慢变得不那么干净。",
            "The gate closes. On the other side the Farseer lowers her eyes and strikes a thread from her runes.\nYou are sealed in the webway with the daemon. It's in no hurry; it has all the time there is, and you will grow less clean."),
    alt: [AT(F("saidGoodbye"), "门合上了。另一边，先知垂下眼睛。她没有划掉那根线，只是把它收好，像收起一件旧衣。\n你和大魔一起被封在网道里。它不急，它有的是时间；你会慢慢变得不那么干净。",
             "The gate closes. On the other side the Farseer lowers her eyes. She doesn't strike the thread out; she folds it away like an old garment.\nYou are sealed in the webway with the daemon. It's in no hurry; it has all the time there is, and you will grow less clean."),
          A(F("canSing"), "方舟上，一片灵骨偶尔哼起跑调的收割歌。", "On the craftworld, a sliver of wraithbone sometimes hums an off-key harvest song."),
          A(NF("canSing"), "方舟上没人为猿人唱歌。墙里只多了一点安静。", "On the craftworld no one sings for a mon-keigh. The walls are only a little quieter.")],
    ending: {kind: "bad", title: L("封印之内", "Behind the Seal"), cause: L("为先知的幻象献祭", "Sacrificed for a vision")}};

  /* ============ Claim endings (SPEC §19): a Chaos god's claim, accepted or forced. Reached via the claim events' goto. ============ */
  N.eld_end_claim_khorne = {scene: "webway", speaker: S("daemon_khorne", "铁与火的轰鸣", "Roar of Iron and Fire"), time: {d: 30, warp: true},
    text: L("心里那团火一旦点着，就再也没熄过。灵族有道途约束杀意，你没有。\n守护者把你送出了网道。你一路杀进黑暗，没回过头。\n凯恩的怒火属于灵族。你的，被另一位神接住了。他不讲道途，只要头骨。",
            "Once the fire in you caught, it never went out. The Aeldari have their Paths to cage the urge to kill. You have none.\nThe Guardians see you out of the webway. You fight your way into the dark and never look back.\nKhaine's rage belongs to the Aeldari. Yours was caught by another god. He keeps no Paths. He wants skulls."),
    alt: [AT(F("woreMask"), "你心里那张面具再也摘不下来了。灵族有道途约束杀意，你没有。\n守护者把你送出了网道。你一路杀进黑暗，没回过头。\n凯恩的怒火属于灵族。你的，被另一位神接住了。他不讲道途，只要头骨。",
             "The mask in your heart will not come off. The Aeldari have their Paths to cage the urge to kill. You have none.\nThe Guardians see you out of the webway. You fight your way into the dark and never look back.\nKhaine's rage belongs to the Aeldari. Yours was caught by another god. He keeps no Paths. He wants skulls."),
          AT(F("punchedSylvaen"), "那一拳之后，你的手再也没真正松开过。灵族有道途约束杀意，你没有。\n守护者把你送出了网道。你一路杀进黑暗，没回过头。\n凯恩的怒火属于灵族。你的，被另一位神接住了。他不讲道途，只要头骨。",
             "Since that blow on the docks your hands have never truly unclenched. The Aeldari have their Paths to cage the urge to kill. You have none.\nThe Guardians see you out of the webway. You fight your way into the dark and never look back.\nKhaine's rage belongs to the Aeldari. Yours was caught by another god. He keeps no Paths. He wants skulls."),
          A(F("followedAvatar"), "你跟着燃烧的化身走过广场。那一刻起，你就没再回头。", "You walked beside the burning Avatar across the plaza. From then on, you never looked back.")],
    codex: ["god_khorne"],
    ending: {kind: "bad", title: L("摘不下的战面", "The Mask That Stays"), cause: L("被恐虐收走", "Claimed by Khorne")}};

  N.eld_end_claim_nurgle = {scene: "maiden_world", speaker: S("daemon_nurgle", "园丁", "The Gardener"), time: {y: 3},
    text: L("你的伤口不再愈合，却开出了花。灵骨歌者的歌，在你身边一首首走了调。\n灵族把你送到一颗无人的星球，留下一袋种子，走得远远的。\n你在那里种出一座园子。苍蝇来了，园丁也来了。他说你种得真好。",
            "Your wounds no longer heal; they bloom. Near you, the bonesingers' songs go out of tune one by one.\nThe Aeldari leave you on an empty world with a bag of seeds, and keep far away.\nThere you grow a garden. The flies come, and then the Gardener. He says you've done beautifully."),
    alt: [AT({fromChapter: {max: 3}}, "你的伤口不再愈合，却开出了花。走到哪里，哪里就长出肥厚的藤。\n后来谁都不肯靠近你。你找了一块没人要的地，种出一座园子。\n苍蝇来了，园丁也来了。他说你种得真好。",
             "Your wounds no longer heal; they bloom. Wherever you go, fat vines spring up.\nIn time no one will come near you. You find a patch of land no one wants and grow a garden.\nThe flies come, and then the Gardener. He says you've done beautifully.")],
    codex: ["god_nurgle"],
    ending: {kind: "bad", title: L("被流放的园丁", "The Exiled Gardener"), cause: L("成为纳垢的园丁", "Became Nurgle's gardener")}};

  N.eld_end_claim_tzeentch = {scene: "webway", speaker: S("daemon_tzeentch", "多出来的命运线", "The Extra Thread"), time: {d: 90, warp: true},
    text: L("你看见的命运线越来越多，比先知还多。你开始悄悄拨动其中几根。\n先知发现时，已有三条线因你而断。她第一次在你面前失了态。\n你笑了。拨线的从来不是你，是一个比所有先知都更爱计划的东西。",
            "You see more fate-threads every day, more than the seers. You begin quietly plucking a few.\nBy the time the Farseer notices, three threads have snapped because of you. For the first time she loses her composure before you.\nYou laugh. It was never you plucking them. It was something that loves plans more than any seer."),
    codex: ["god_tzeentch"],
    ending: {kind: "bad", title: L("拨线的手", "The Hand on the Threads"), cause: L("沦为奸奇的棋子", "Became Tzeentch's pawn")}};

  N.eld_end_claim_slaanesh = {scene: "craftworld", speaker: S("greater_daemon_slaanesh", "渴求者", "She Who Thirsts"),
    text: L("那段甜甜的音乐再也不停了。你坐下来听，听了一天，一个月，一年。\n后来有人发现你，你还坐着微笑，灵魂早已不在，没有灵魂石接住它。\n渴求者饿了一万年。一个猿人的灵魂，只是饭前的甜点。",
            "The sweet music never stops now. You sit and listen: a day, a month, a year.\nWhen someone finally finds you, you are still sitting and smiling, your soul long gone. No spirit stone caught it.\nShe Who Thirsts has hungered for ten thousand years. A mon-keigh soul is a sweet before the meal."),
    codex: ["god_slaanesh"],
    ending: {kind: "bad", title: L("饭前的甜点", "A Sweet Before the Meal"), cause: L("被色孽的乐声吞噬", "Devoured by Slaanesh's music")}};

  /* ============ Death nodes (engine-triggered; location-neutral, varied by alt fromChapter) ============ */
  N.eld_death_hp = {scene: "webway", speaker: null,
    text: L("你倒下了。灵族们停下脚步，低头看了你一会儿，很有礼貌。\n没有灵魂石接住你。你的灵魂升起来，又亮又干净，像一盏灯，被远处某个很饿的东西看见了。\n先知在符文上，轻轻划掉了一根线。",
            "You fall. The Aeldari pause and look down at you a moment, politely.\nNo spirit stone catches you. Your soul rises, bright and clean as a lamp, and something very hungry far away notices it.\nOn her runes, the Farseer gently strikes out a thread."),
    alt: [AT(FROM("eld_308", "eld_309", "eld_310", "eld_801", "eld_801s", "eld_802", "eld_803", "eld_804", "eld_805", "eld_807"), "你倒在网道里，身边一个人也没有。\n没有灵魂石接住你。你的灵魂升起来，又亮又干净，像一盏灯，被近处某个很饿的东西看见了。\n很远的地方，先知在符文上，轻轻划掉了一根线。",
             "You fall in the webway with no one beside you.\nNo spirit stone catches you. Your soul rises, bright and clean as a lamp, and something very hungry close by notices it.\nFar away, on her runes, the Farseer gently strikes out a thread."),
          AT({fromChapter: {max: 2}}, "你倒在瓦尔达的麦茬里，再也没站起来。\n没有灵魂石接住你。你的灵魂升起来，又亮又干净，像一盏灯，被远处某个很饿的东西看见了。\n山脊上，有个披斗篷的人在账上划掉了一笔。",
             "You fall in Valda's stubble and do not rise.\nNo spirit stone catches you. Your soul rises, bright and clean as a lamp, and something very hungry far away notices it.\nOn the ridge, a cloaked figure strikes a line from his ledger."),
          A({all: [F("mirethDead"), F("carryStone")]}, "米瑞丝托你拿着的东西，从你手里滚了出去。", "What Mireth asked you to hold rolls out of your hand."),
          A(F("bait"), "诱饵倒下了。网道深处，有什么东西失望地叹了口气。", "The bait has fallen. Deep in the webway, something sighs in disappointment.")],
    ending: {kind: "death", title: L("断线", "A Severed Thread"), cause: L("伤重而死，灵魂无依", "Died of wounds, soul unguarded")}};

  N.eld_death_sanity = {scene: "craftworld", speaker: null,
    text: L("你开始听见墙里所有的声音，一万个死去的灵族同时说话，你一个也挡不住。\n你给每个声音起了名字，日夜和他们聊天。\n灵族把你送进一间安静的房间，天花板很矮，按猿人规格。",
            "You begin to hear every voice in the walls, ten thousand dead Aeldari speaking at once, and you can shut out none of them.\nYou name each voice and talk with them day and night.\nThe Aeldari place you in a quiet room with a low ceiling, built to mon-keigh specifications."),
    alt: [AT(FROM("eld_801", "eld_801s", "eld_802", "eld_803", "eld_804", "eld_805", "eld_807"), "你开始听见网道里所有的声音：光墙后面的，甜味里的。你一个也挡不住。\n你给每个声音起了名字，日夜和他们聊天。\n后来，门在你身后合上了。没有人来接你，只有一个声音一直陪你聊。",
             "You begin to hear every voice in the webway: behind the walls of light, inside the sweetness. You can shut out none of them.\nYou name each voice and talk with them day and night.\nIn time the gate closes behind you. No one comes for you; only one voice keeps you company."),
          AT({fromChapter: {max: 3}}, "你开始听见所有的声音：风里的，麦子里的，光墙后面的。你一个也挡不住。\n你给每个声音起了名字，日夜和他们聊天。\n后来，有人把你带到一个很安静的地方，再也没来接你。",
             "You begin to hear every voice: in the wind, in the wheat, behind the walls of light. You can shut out none of them.\nYou name each voice and talk with them day and night.\nIn the end someone leads you somewhere very quiet, and never comes back for you."),
          A({all: [F("watched"), {not: FROM("eld_801", "eld_801s", "eld_802", "eld_803", "eld_804", "eld_805", "eld_807")}]}, "门外，那个灵骨巨人又站回了原来的位置。", "Outside the door, the wraithbone giant has taken up its old post again."),
          A(F("countedVoices"), "你数到了第一万个。第三百个，仍然在叫你的名字。", "You count to ten thousand. The three-hundredth still says your name.")],
    ending: {kind: "death", title: L("墙里的客人", "Guest of the Walls"), cause: L("理智崩溃", "Mind shattered")}};

  N.eld_death_corruption = {scene: "daemon_world", speaker: S("sigil_slaanesh", "渴求者", "She Who Thirsts"),
    text: L("你想要的越来越多，多到身体装不下。皮肤发光，长出不该有的颜色，声音甜得像音乐。\n看见你的人都举起了武器，眼里没有恨，只有怜悯。\n在他们开枪之前，很远的地方，有什么东西先一步把你喝干了。",
            "You want more and more, more than a body can hold. Your skin begins to glow in colours it should not have; your voice turns sweet as music.\nEveryone who sees you raises a weapon, with no hatred in their eyes, only pity.\nBefore they fire, something very far away drinks you dry."),
    ending: {kind: "death", title: L("被饮尽", "Drunk Dry"), cause: L("被色孽之欲吞没", "Consumed by Slaanesh's hunger")}};

  /* ============ Route-specific events (SPEC §12: 1–2 per route) ============ */
  function O(zh, en, effects, rzh, ren) { return {text: {zh: zh, en: en}, effects: effects, result: {zh: rzh, en: ren}}; }
  WH.registerEvents([
    {id: "evt_eld_mirror", god: "slaanesh", factions: ["aeldari"], minChapter: 4,
     where: {scenes: ["craftworld"], chapter: {min: 4, max: 7}},
     scene: "craftworld", speaker: S("sigil_slaanesh", "灵骨之镜", "Wraithbone Mirror"), foe: null,
     text: L("一面灵骨墙被打磨得像镜子。镜中的你更高、更美，没有伤疤，也没有悲伤。\n镜中人伸出手：“你本来可以是这样的。你值得。”\n墙里的祖先们，忽然都不说话了。",
             "A wraithbone wall has been polished like a mirror. The you inside is taller, lovelier, without scars, without grief.\nThe reflection holds out a hand. “You could have been this. You deserve it.”\nThe ancestors in the wall fall suddenly silent."),
     codex: ["eld_she_who_thirsts"],
     choices: [
       O("碰一碰镜中的手", "Touch the reflection's hand", {corruption: 10, sanity: 5, renown: 3, taint: {slaanesh: 30}},
         "镜面是暖的。之后好几天，你照什么都觉得自己不够好看。",
         "The surface is warm. For days afterward, every reflection you catch seems not quite beautiful enough."),
       O("转身走开", "Turn and walk away", {sanity: -5},
         "你背后传来一声很轻的叹息，失望得像一个被拒绝的恋人。",
         "Behind you comes a soft sigh, as disappointed as a spurned lover."),
       O("去叫灵骨歌者", "Fetch a Bonesinger", {sanity: -3, renown: 3, taint: {slaanesh: -10}},
         "歌者唱了一句，镜面就浑了，变回普通的骨白色。他说：“你做得对。别告诉别人你看见过它。”",
         "The singer sings one phrase and the mirror clouds back to plain bone-white. “You did right,” he says. “Tell no one you saw it.”")
     ]},

    {id: "evt_eld_laugh", god: "other", factions: ["aeldari"], minChapter: 3,
     where: {scenes: ["webway"]},
     scene: "webway", speaker: S("aeldari_masked", "路过的舞者", "A Passing Dancer"), foe: null,
     text: L("一个丑角翻着跟头经过，停下，为你演了一出无声的小戏：一个猿人对着一扇门鞠躬，门开了，猿人却转身跑了。\n他鞠了一躬，等你的反应。",
             "A Harlequin cartwheels past, stops, and performs a silent little play for you: a mon-keigh bows before a door; the door opens; the mon-keigh turns and runs.\nHe bows, and waits for your response."),
     codex: ["eld_harlequins"],
     choices: [
       O("鼓掌", "Applaud", {renown: 5, set: {harlequinFavor: true}},
         "他接住你的掌声，像接住一束花，塞进袖子里，翻着跟头走了。",
         "He catches your applause like a bouquet, tucks it into his sleeve, and cartwheels away."),
       O("问他这是什么意思", "Ask what it means", {sanity: -5, renown: 2},
         "他耸耸肩，指了指你，又指了指那扇不存在的门。然后他就不在了。",
         "He shrugs, points at you, then at the door that isn't there. Then he's gone.")
     ]}
  ]);

  WH.registerFaction({
    id: "aeldari",
    name: L("灵族", "Aeldari"),
    tagline: L("被先知留下的一根线", "A thread the Farseer kept"),
    role: L("农业星幸存者", "Agri-world survivor"),
    world: L("瓦尔达", "Valda"),   // SPEC §27 home world (the pilgrim has no home but Valda is where the thread catches)
    playerSprite: "player_aeldari",
    color: "#5fb3a1",
    startNode: "eld_101",
    startDate: {year: 113, mill: 42},
    startStats: {hp: 100, sanity: 100, corruption: 0, renown: 10},
    renownLabel: L("命运", "Fate"),
    renownIcon: "icon_fate",
    taintMod: {khorne: 0.9, nurgle: 0.9, tzeentch: 0.9, slaanesh: 1.3},   // SPEC §19: multiplier on positive taint deltas (cleanses unscaled)
    npcs: {   // SPEC §28 grudges: people this route lets you wrong (flag wronged_<id>); see eld_o_trooper_4 / eld_608
      edda: {name: L("埃达", "Edda"), sprite: "guardsman"},
      mireth: {name: L("米瑞丝", "Mireth"), sprite: "aeldari_guardian"}
    },
    renownHelp: L("命运：先知眼中你这根线有多粗。勇敢、诚实、出人意料的选择让它变粗，退缩与背弃让它变细。命运够高，你就能请先知重看未来、在网道里相信那根线，走向更好的结局。",
                  "Fate: how thick your thread looks to the Farseer. Brave, honest or unexpected choices thicken it; flinching and betrayal thin it. With enough Fate you can ask the Farseer to read the future again, trust the thread in the webway, and reach better endings."),
    origins: [
      {id: "agri", name: L("农业星农工", "Agri-world farmhand"),
       desc: L("瓦尔达麦田里长大，带着妹妹妮尔。没见过怪事，不经吓，命里的线却格外粗。",
               "Raised in Valda's wheat, minding little sister Nell. You've never seen anything strange and scare easily, but fate's thread runs thick in you."),
       sprite: "player_aeldari", startNode: "eld_101",
       max: {hp: 100, sanity: 90}, stats: {hp: 100, sanity: 90, corruption: 0, renown: 20}, set: {origin_agri: true}},
      {id: "pilgrim", name: L("做梦的朝圣者", "Dreaming pilgrim"),
       desc: L("十年来总梦见白袍女人和旋转的石头。身子单薄，心神坚定；你有一点灵能，自己不知道。",
               "Ten years of dreams: a white-robed woman, spinning stones. Frail body, steady mind. You're faintly psychic and don't know it."),
       sprite: "player_aeldari", startNode: "eld_o_pilgrim_1",
       max: {hp: 80, sanity: 110}, stats: {hp: 80, sanity: 110, corruption: 5, renown: 25}, set: {origin_pilgrim: true}},
      {id: "trooper", name: L("星防卫军士兵", "Defence trooper"),
       desc: L("瓦尔达星防卫军第三连。练得结实，可你这辈子最大的敌人，是偷粮的老鼠。",
               "Valda Planetary Defence, Third Company. Drilled and fit, but the worst enemy you've ever faced is grain rats."),
       sprite: "player_aeldari", startNode: "eld_o_trooper_1",
       max: {hp: 110, sanity: 95}, stats: {hp: 110, sanity: 95, corruption: 0, renown: 5}, set: {origin_trooper: true}}
    ],
    deathNodes: {hp: "eld_death_hp", sanity: "eld_death_sanity", corruption: "eld_death_corruption"},
    learn: {
      leaders: ["eld_farseer", "eld_eldrad", "eld_yvraine", "eld_ynnead", "eld_path", "eld_khaine"],
      enemies: ["god_slaanesh", "eld_she_who_thirsts", "nec_necrons", "imp_imperium"],
      boss: ["eld_keeper_of_secrets", "eld_the_unsated"]
    },
    chapters: {
      1: L("麦田的预兆", "Omens in the Wheat"),
      2: L("收割", "The Harvest"),
      3: L("网道", "The Webway"),
      4: L("方舟世界", "The Craftworld"),
      5: L("陨落之舞", "The Masque of the Fall"),
      6: L("处女世界", "The Maiden World"),
      7: L("渴求者", "She Who Thirsts"),
      8: L("最后的舞", "The Last Dance")
    },
    nodes: N
  });
})();
