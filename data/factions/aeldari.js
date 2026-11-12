/* data/factions/aeldari.js — Aeldari route (text-aeldari role). SPEC §3, §11–§18.
 * Player: a human of the Imperial agri-world Valda, which Farseer Taethra lets the Necrons harvest so that
 * six thousand Exodites on Ildaneth live. Spared as "a thread of fate", taken through the webway to
 * Craftworld Selunar as a mon-keigh guest; in the end used as bait for a Keeper of Secrets.
 * Term: mon-keigh = 猿人 (consistent). Start 113.M42.
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
      C("去打谷场上工", "Head to the threshing yard", "eld_102", {result: L("场边的麻袋堆成了山，每袋都印着“什一税·奥雷克斯二号”。没有船来运。", "Sacks are piled into hills at the yard's edge, each stamped ‘Tithe · Aurex Secundus’. No ship has come for them.")}),
      C("带妮尔去田边的老石阵", "Take Nell to the old stones at the field's edge", "eld_103")
    ]};

  N.eld_102 = {chapter: 1, scene: "manufactorum", speaker: MARTA, time: {h: 1},
    text: L("打谷机轰隆作响。玛尔塔监工在名册上画勾：“什一税照交，一粒不能少。”\n你问起运粮船，她压低声音：“星语塔一直没回话。总督说是小故障。”\n她自己也不信。",
            "The threshers roar. Overseer Marta ticks names on her slate. “The tithe goes up in full. Not one grain short.”\nYou ask about the grain ships. She lowers her voice. “The tower hasn't answered. The governor says it's a small fault.”\nShe doesn't believe it either."),
    choices: [
      C("低头干活", "Keep your head down and work", "eld_104",
        E({hp: -5, sanity: 5}, "你干到手掌起泡。麦秆的味道很熟悉，熟悉得让人安心。",
          "You work until your palms blister. The smell of cut stalks is familiar, and familiar is comforting.")),
      C("溜去星语塔看看", "Sneak off to the astropath tower", "eld_105",
        E({renown: 2}, "玛尔塔看见你走了，没喊。她只是把你的名字从今天的名册上划掉。",
          "Marta sees you go and says nothing. She just strikes your name from today's roll."))
    ]};

  N.eld_103 = {chapter: 1, scene: "ruins", speaker: null, time: {h: 1},
    text: L("老石阵立在麦田尽头，黑得发亮，像一排牙。没人记得是谁立的。\n妮尔从犁沟里捡起一块白石头，温的，滑得像骨头。\n山脊上站着一个披斗篷的高个子。你一眨眼，他就不见了。",
            "The old stones stand where the wheat ends, black and gleaming, like a row of teeth. No one remembers who raised them.\nNell picks a white stone out of a furrow. It's warm, smooth as bone.\nA tall cloaked figure stands on the ridge. You blink, and he's gone."),
    codex: ["place_valda_tomb"],
    choices: [
      C("把白石头收进口袋", "Pocket the white stone", "eld_104",
        E({renown: 3, set: {runeStone: true}}, "石头贴着你的腿，一直是温的。那天夜里，你梦见一条发光的路。",
          "The stone stays warm against your leg. That night you dream of a road made of light.")),
      C("追上山脊", "Run up the ridge after him", "eld_106",
        E({hp: -5}, "你在麦茬里摔了一跤，膝盖擦破了。山脊上的风里有一股陌生的甜香。",
          "You fall in the stubble and skin a knee. The wind on the ridge smells of something strange and sweet."))
    ]};

  N.eld_104 = {chapter: 1, scene: "cathedral", speaker: JORBAN, time: {h: 8},
    text: L("晚祷。乔班神父为丰收祝福，声音比往年小。\n“夜里地底下在嗡嗡响，”他对你耳语，“牲口都不叫了。我问过帝皇，他没回答。”\n话音刚落，圣像脚下的石板裂开一道缝，透出绿光。",
            "Evening prayers. Father Jorban blesses the harvest, quieter than in other years.\n“The ground hums at night,” he whispers. “The animals have gone silent. I asked the Emperor. He didn't answer.”\nAs he speaks, the flagstone beneath the saint's statue cracks. Green light seeps through."),
    codex: ["imp_emperor"],
    choices: [
      C("抱起妮尔回家", "Pick up Nell and go home", "eld_107"),
      C("去星语塔求救", "Run to the tower for help", "eld_105",
        E({sanity: -5}, "你穿过麦田，脚下的土地在轻轻震动，像有什么在下面翻身。",
          "As you cross the fields the ground trembles faintly, as if something below is turning over in its sleep."))
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
    text: L("斗篷人就坐在山脊背面，像在等你。他的脸太窄，耳朵太尖，眼睛里没有一点温度。\n“回家去，猿人。”他礼貌得过分，“今晚握紧你妹妹的手。”\n他的长枪比他还高。",
            "The cloaked one sits just past the ridge, as if waiting. His face is too narrow, his ears too sharp, his eyes without warmth.\n“Go home, mon-keigh.” He is excessively polite. “Tonight, hold your sister's hand.”\nHis long rifle is taller than he is."),
    codex: ["eld_rangers", "eld_monkeigh"],
    choices: [
      C("“你是谁？为什么这么说？”", "“Who are you? Why say that?”", "eld_107",
        RS("他想了很久，像在挑一个你听得懂的词。“记账的人。”然后他走进了风里。",
           "He thinks a long while, as if choosing a word you could understand. “One who keeps accounts.” Then he walks into the wind.")),
      C("抓住他的斗篷", "Grab his cloak", null, M(
        R(0.35, "hp", "eld_107", "eld_107",
          "你抓住了一角布。他低头看你的手，像看一只落在袖子上的虫。“黄昏，石阵。”他抽回了斗篷。",
          "You catch a corner of cloth. He looks at your hand like an insect on his sleeve. “Dusk. The stones.” He pulls free.",
          "你扑了个空，脸朝下栽进麦茬。抬起头时，山脊上只剩风。",
          "You grab at nothing and land face-first in the stubble. When you look up, only wind is on the ridge."),
        {effects: {hp: -5}}))
    ]};

  N.eld_108 = {chapter: 1, scene: "hive_spire", speaker: null, time: {h: 1},
    text: L("一阵杂音，然后是一声长长的蜂鸣。求救信号发出去了，只有一行，没有回音。\n也许一年后，某个遥远的星语者会在梦里听见它。\n窗外，老石阵的方向亮起了绿光。",
            "Static, then one long tone. The call goes out: a single line, no reply.\nPerhaps a year from now some distant astropath will hear it in a dream.\nOutside, green light kindles where the old stones stand."),
    effects: {renown: 5, set: {sentCall: true}},
    choices: [
      C("跑回家找妮尔", "Run home to Nell", "eld_107")
    ]};

  N.eld_107 = {chapter: 1, scene: "tomb_exterior", speaker: null, foe: "necron_warrior", time: {h: 6},
    text: L("午夜，老石阵亮了。绿光沿着犁沟流淌，麦田像被掀开的被子一样翻起。\n地底升起一座黑色金字塔。银色的骷髅一排排走出来，步伐整齐，不急不慢。\n它们不像入侵者。像房东回家。",
            "At midnight the old stones light up. Green fire runs along the furrows; the fields peel back like a blanket.\nA black pyramid rises from the earth. Silver skeletons file out in ranks, unhurried, perfectly in step.\nThey don't look like invaders. They look like landlords coming home."),
    codex: ["nec_necrons", "place_valda_tomb"],
    choices: [
      C("抓起妮尔就跑", "Grab Nell and run", "eld_201",
        E({hp: -5}, "你抱着妮尔冲出家门。身后，金属的脚踩碎麦穗，整齐得像钟。",
          "You burst out the door with Nell in your arms. Behind you, metal feet crush the wheat in time, like a clock.")),
      C("躲在窗后看它们做什么", "Watch them from behind the window", "eld_201",
        E({sanity: -8, renown: 3}, "一个骷髅停在邻居门口，抬手，一道绿光。房子还在，人没了。它像在清单上打了个勾，继续往前走。",
          "One skeleton stops at the neighbours' door and raises a hand: a green flash. The house remains. The people don't. It moves on, as if ticking a list."))
    ]};

  /* ============ Origin prologue · Pilgrim-prophet (eld_o_pilgrim_*) ============ */
  N.eld_o_pilgrim_1 = {chapter: 1, scene: "ship_interior", speaker: null,
    text: L("运粮驳船的货舱里，你缩在麦袋中间。十年来你一直做同一个梦：一个白袍女人，几颗石头绕着她的头转。\n你从一个星球走到另一个星球，讲这个梦。大多数人当你是疯子。\n下一站，瓦尔达。",
            "In a grain barge's hold you huddle among the sacks. For ten years you've dreamed the same dream: a white-robed woman, stones circling her head.\nYou walk from world to world telling it. Most people think you mad.\nNext stop: Valda."),
    codex: ["place_valda"],
    choices: [
      C("把梦讲给船员听", "Tell the crew your dream", "eld_o_pilgrim_2",
        E({renown: 3, sanity: -5}, "船员们笑了一路。只有一个老水手没笑，下船时塞给你一块干粮：“别在那颗星球上说太大声。”",
          "The crew laugh the whole way. One old deckhand doesn't. Disembarking, he slips you a ration bar. “Don't say it too loud down there.”")),
      C("闭眼，什么也不说", "Close your eyes and say nothing", "eld_o_pilgrim_2",
        E({sanity: 5}, "你一路睡到着陆。这次的梦里，那个女人第一次转过头来看你。",
          "You sleep all the way down. In this dream, for the first time, the woman turns her head to look at you."))
    ]};

  N.eld_o_pilgrim_2 = {chapter: 1, scene: "jungle", speaker: null, time: {d: 2},
    text: L("你在麦田边讲道，农人们绕开你走。只有一个小女孩停下来，给你端来一碗水。\n“我叫妮尔。”她盯着你，“我也梦见过石头会转。”\n她的父母不太情愿地让你睡进了谷仓。",
            "You preach at the edge of the wheat; the farmers walk around you. Only a little girl stops and brings you a bowl of water.\n“I'm Nell.” She stares at you. “I've dreamed of spinning stones too.”\nHer parents, not very willingly, let you sleep in their barn."),
    choices: [
      C("在谷仓住下，帮她家干活", "Stay in the barn and help with chores", "eld_o_pilgrim_4",
        E({hp: 5, sanity: 5}, "你学会了捆麦子。妮尔每晚都来听你讲梦，听到一半就睡着。",
          "You learn to bind sheaves. Every night Nell comes to hear your dream and falls asleep halfway.")),
      C("去田边的老石阵过夜", "Spend the night at the old stones", "eld_o_pilgrim_3", {result: L("你枕着包袱躺下。包袱里有在圣地阿尔德林求来的圣徽，它从没让你少做一个梦。", "You lie down with your bundle for a pillow. In it is a holy medal from the shrine world Aldrin. It has never spared you a single dream.")})
    ]};

  N.eld_o_pilgrim_3 = {chapter: 1, scene: "ruins", speaker: S("omen_farseer", "梦", "Dream"), time: {h: 9},
    text: L("你枕着黑色的石头睡着了。这一次梦太清楚：白袍女人站在一道光门前，符文绕着她旋转。\n她看着你，说了一个词。你听不懂，却知道意思——“还没到时候”。\n醒来时，你的鼻子在流血。",
            "You fall asleep against the black stones. This time the dream is too clear: the white-robed woman before a gate of light, runes circling her.\nShe looks at you and speaks one word. You don't know the language, but you know the meaning: not yet.\nYou wake with a nosebleed."),
    effects: {sanity: -5},
    codex: ["chaos_warp", "place_valda_tomb"],
    choices: [
      C("记住那个词", "Memorise the word", "eld_o_pilgrim_4",
        E({renown: 5, set: {heardWord: true}, taint: {tzeentch: 15}}, "你在泥地上写了一百遍，还是写不对。但它在你舌头底下，像一颗种子。",
          "You write it in the mud a hundred times and never get it right. But it sits under your tongue like a seed.")),
      C("擦掉血，回谷仓", "Wipe the blood away and go back", "eld_o_pilgrim_4")
    ]};

  N.eld_o_pilgrim_4 = {chapter: 1, scene: "cathedral", speaker: JORBAN, time: {d: 3},
    text: L("乔班神父把你堵在礼拜堂门口，盯着你鼻孔下的血痕。\n“会做准的梦，会流鼻血。”他压低声音，“孩子，黑船来的时候，会先找你这样的人。”\n他身后，圣像脚下的石板裂开一道缝，透出绿光。",
            "Father Jorban corners you at the chapel door, eyeing the blood under your nose.\n“Dreams that come true. Nosebleeds.” He lowers his voice. “Child, when the Black Ships come, they look for your kind first.”\nBehind him, the flagstone beneath the saint's statue cracks. Green light seeps through."),
    codex: ["imp_psyker", "imp_black_ships"],
    choices: [
      C("“我只是个朝圣者。”", "“I'm only a pilgrim.”", "eld_o_pilgrim_5",
        E({sanity: -5}, "他看了你很久，叹了口气：“那就当个安静的朝圣者。”你们都知道你在撒谎。",
          "He studies you a long time and sighs. “Then be a quiet pilgrim.” You both know you're lying.")),
      C("把梦全告诉他", "Tell him the whole dream", "eld_o_pilgrim_5",
        E({renown: 3, set: {jorbanKnows: true}}, "神父听完，没去报告。他只是在胸前画了个圣徽：“愿帝皇的光挡在你和你梦见的东西之间。”",
          "The priest hears you out and doesn't report you. He only makes the sign of the aquila. “May the Emperor's light stand between you and what you dream of.”"))
    ]};

  N.eld_o_pilgrim_5 = {chapter: 1, scene: "tomb_exterior", speaker: null, foe: "necron_warrior", time: {h: 7},
    text: L("午夜，老石阵亮了，和你梦里一模一样。黑色金字塔从麦田下升起，银色的骷髅排着队走出来。\n妮尔家的农舍被绿光扫过。你冲进去时，只剩妮尔缩在灶台后面，她的父母不见了。\n她朝你伸出手。",
            "At midnight the old stones light up, exactly as in your dream. A black pyramid rises from the wheat; silver skeletons file out in ranks.\nGreen light sweeps Nell's farmhouse. When you burst in, only Nell is left, curled behind the stove. Her parents are gone.\nShe reaches for you."),
    effects: {sanity: -8},
    codex: ["nec_necrons"],
    choices: [
      C("抱起她就跑", "Pick her up and run", "eld_201",
        RS("她很轻。你跑出门时，她在你耳边小声说：“你梦见过这个，对不对？”",
          "She weighs almost nothing. As you run, she whispers in your ear, “You dreamed this, didn't you?”"))
    ]};

  /* ============ Origin prologue · Defence trooper (eld_o_trooper_*) ============ */
  N.eld_o_trooper_1 = {chapter: 1, scene: "barracks", speaker: EDDA,
    text: L("瓦尔达星防卫军，第三连。你们这辈子最大的敌人是偷粮的老鼠。\n埃达把纸牌拍在弹药箱上：“星语塔三天没出声了。中尉说是小故障。”\n她压低声音，“小故障需要派两个人带枪去看？”",
            "Valda Planetary Defence, Third Company. The worst enemy you've ever faced is grain rats.\nEdda slaps her cards down on an ammo crate. “Tower's been silent three days. The lieutenant says it's a small fault.”\nShe lowers her voice. “A small fault that needs two armed troopers?”"),
    codex: ["place_valda", "imp_guard"],
    choices: [
      C("主动请缨去查看", "Volunteer to go check", "eld_o_trooper_2",
        E({renown: 3}, "中尉在名单上写下你的名字，表情像如释重负。",
          "The lieutenant writes down your name, looking relieved.")),
      C("先打完这把牌", "Finish the hand first", "eld_o_trooper_2",
        E({sanity: 5}, "你赢了埃达半周的口粮。然后中尉点了你们俩的名。",
          "You win half a week of Edda's rations. Then the lieutenant calls both your names."))
    ]};

  N.eld_o_trooper_2 = {chapter: 1, scene: "hive_spire", speaker: EDDA, time: {h: 5},
    text: L("星语者们围坐成圈，安详地睡着，叫不醒。主天线被切断了，切口平滑得像玻璃。\n埃达捡起一根细长的白羽毛：“这不是我们这儿的鸟。”\n她看你一眼，“也不是我们这儿的刀。”",
            "The astropaths sit in a circle, peacefully asleep. No one wakes them. The main array is severed, the cut smooth as glass.\nEdda picks up a long white feather. “No bird of ours.”\nShe looks at you. “No blade of ours either.”"),
    choices: [
      C("按条令，向上级报告", "Report up the chain, by the book", "eld_o_trooper_3",
        E({renown: 2}, "回电只有一句：“保持警戒，勿制造恐慌。”埃达把回执揉成一团。",
          "The reply is one line: “Stay alert. Do not cause panic.” Edda crumples the receipt.")),
      C("试着自己接通线路", "Try to fix the line yourself", null,
        R(0.4, null, "eld_o_trooper_3", "eld_o_trooper_3",
          "一声长长的蜂鸣，求救信号发了出去。没有回音，但至少，有人可能会听见。",
          "One long tone: the call goes out. No reply, but someone, somewhere, might hear it.",
          "线路在你手里炸出火花，彻底死了。埃达骂了一句，把你从烟里拖出来。",
          "The line sparks in your hands and dies for good. Edda swears and drags you out of the smoke."))
    ]};

  N.eld_o_trooper_3 = {chapter: 1, scene: "trench", speaker: null, time: {h: 9},
    text: L("夜间巡逻，老石阵附近。一声轻响，你的激光枪枪管断成两截，切口还冒着烟——你却毫发无伤。\n山脊上有个披斗篷的影子收起长枪，冲你微微点了点头。\n那是警告。他打中了他想打中的地方。",
            "Night patrol near the old stones. A soft crack: your lasgun barrel falls in two, the cut still smoking. You're untouched.\nOn the ridge a cloaked shape lowers a long rifle and nods to you, very slightly.\nA warning. He hit exactly what he meant to."),
    codex: ["eld_rangers"],
    choices: [
      C("拔出手枪还击", "Draw your sidearm and return fire", "eld_o_trooper_4",
        E({hp: -10, renown: 2, taint: {khorne: 15}}, "你打空了一个弹匣。第二声轻响，你的手枪也断了，虎口震裂。山脊上已经没人了。",
          "You empty a magazine. A second soft crack: your pistol breaks too, splitting the web of your hand. The ridge is empty.")),
      C("放下枪，举起手", "Lower your weapon, raise your hands", "eld_o_trooper_4",
        E({sanity: -5, renown: 3}, "影子停了一下，像有点意外，然后消失在麦田里。埃达说你疯了。你觉得自己刚刚活了下来。",
          "The shape pauses, as if mildly surprised, then melts into the wheat. Edda says you're mad. You feel you've just survived something."))
    ]};

  N.eld_o_trooper_4 = {chapter: 1, scene: "tomb_exterior", speaker: EDDA, foe: "necron_warrior", time: {h: 20},
    text: L("第二天午夜，老石阵亮了。黑色金字塔从麦田下升起，银色的骷髅排着队走出来。\n第三连开火了。骷髅倒下，又站起来，伤口像水银一样合拢。\n“撤！”中尉喊完这一声，就被绿光吞没了。",
            "Next midnight the old stones light up. A black pyramid rises from the wheat; silver skeletons file out in ranks.\nThird Company opens fire. The skeletons fall, then stand again, wounds closing like quicksilver.\n“Fall back!” the lieutenant shouts, and the green light takes him."),
    effects: {sanity: -8},
    codex: ["nec_necrons", "place_valda_tomb"],
    choices: [
      C("掩护埃达撤退", "Cover Edda's retreat", "eld_o_trooper_5",
        E({hp: -15, renown: 5}, "一道绿光擦过你的肩膀，整条胳膊瞬间麻了。埃达回头把你拽进了麦田。",
          "A green bolt grazes your shoulder and the whole arm goes numb. Edda turns back and hauls you into the wheat.")),
      C("扔下阵地就跑", "Abandon the line and run", "eld_o_trooper_5",
        E({sanity: -5, renown: -3}, "你跑得比任何人都快。身后的枪声一支支停了。",
          "You run faster than anyone. Behind you, the rifles fall silent one by one."))
    ]};

  N.eld_o_trooper_5 = {chapter: 1, scene: "burning_city", speaker: null, time: {h: 2},
    text: L("你们驻扎时借住的那户农家着了火。你冲进去，只找到了小女儿妮尔，缩在水缸后面。\n她认得你，你给她削过木头小兵。\n她没哭，只问：“你的枪呢？”",
            "The farmhouse where you were billeted is on fire. You charge in and find only the little daughter, Nell, curled behind the water barrel.\nShe knows you. You once whittled her a wooden soldier.\nShe doesn't cry. She only asks, “Where's your gun?”"),
    effects: {hp: -5},
    choices: [
      C("把她背起来", "Get her on your back", "eld_201",
        RS("她搂住你的脖子，搂得很紧。外面，绿光正一片片扫过农庄。",
          "She wraps her arms around your neck, tight. Outside, green light sweeps the farms one by one."))
    ]};

  /* ============ Chapter 2 · The Harvest ============ */
  N.eld_201 = {chapter: 2, scene: "burning_city", speaker: null, foe: "necron_lord", time: {h: 5}, eventRoll: 0.35,
    text: L("天亮时，瓦尔达在燃烧。没有抢劫，没有喊杀声，只有绿光一片片扫过农庄。\n山丘上站着一个挂满金饰的骷髅领主，像在检阅一块收回的地产。\n妮尔把脸埋在你脖子里：“帝皇什么时候来？”",
            "By dawn Valda is burning. No looting, no war cries—just green light sweeping farm after farm.\nOn a hill stands a skeletal lord hung with gold, surveying the land like reclaimed property.\nNell buries her face in your neck. “When is the Emperor coming?”"),
    codex: ["nec_necrons", "imp_imperium", "place_arcosa"],
    choices: [
      C("去着陆场找穿梭机", "Head for the landing field", "eld_202"),
      C("去老石阵碰碰运气", "Try your luck at the old stones", "eld_203",
        E({sanity: -5}, "你逆着逃难的人群往石阵走。有人骂你疯了，有人跟了几步，又折了回去。",
          "You walk against the fleeing crowd toward the stones. Someone calls you mad. A few follow a while, then turn back."))
    ]};

  N.eld_202 = {chapter: 2, scene: "ruins", speaker: MARTA, time: {h: 3},
    text: L("着陆场只剩一架破旧的货运穿梭机。玛尔塔监工拿着名册，嗓子已经哑了。\n“只能再塞一个孩子。”她看着妮尔，“没有船会来。星语塔从头到尾没发出去一个字。”\n引擎已经在转了。",
            "One battered cargo shuttle is all that's left. Overseer Marta holds her roll, voice gone hoarse.\n“Room for one more child.” She looks at Nell. “No ships are coming. The tower never sent a word.”\nThe engines are already turning."),
    choices: [
      C("把妮尔交给玛尔塔", "Hand Nell to Marta", "eld_204",
        E({sanity: 5, renown: 5, set: {nellLander: true}}, "妮尔抓着你的袖子不放，你一根一根掰开她的手指。舱门关上前，她喊的是你的名字。",
          "Nell won't let go of your sleeve. You prise her fingers loose one by one. As the hatch closes, she is shouting your name.")),
      C("不，她跟着我", "No. She stays with me.", "eld_204",
        E({sanity: -5, set: {nellKept: true}}, "玛尔塔没劝。她点点头，把名册上的一个名字划掉了。",
          "Marta doesn't argue. She nods, and crosses one name off her roll."))
    ]};

  N.eld_204 = {chapter: 2, scene: "burning_city", speaker: EDDA, foe: "necron_warrior", time: {h: 1},
    text: L("穿梭机歪歪扭扭地升空了。你不敢看它飞了多远。\n防卫军的埃达一把抓住你：“骷髅过来了！帮我守住路口，让最后一批人上山！”\n远处，一排银色的身影正穿过冒烟的麦田。",
            "The shuttle wobbles into the sky. You can't bear to watch how far it gets.\nEdda of the defence force grabs your arm. “Skeletons incoming! Hold the crossroads with me so the last ones reach the hills!”\nA line of silver figures is crossing the smoking wheat."),
    choices: [
      C("跟埃达守住路口", "Hold the crossroads with Edda", null,
        R(0.5, "hp", "eld_205", "eld_206",
          "你打中了一个。它倒下，站起，又倒下。你们拖住了它们一刻钟——够了。",
          "You hit one. It falls, rises, falls again. You hold them for a quarter hour. It's enough.",
          "一道绿光擦过你的肩膀，整条胳膊瞬间没了知觉。你栽进了水沟。",
          "A green bolt grazes your shoulder and the whole arm goes dead. You topple into a ditch.")),
      C("和埃达排成射击线，像操练时那样", "Form a firing line with Edda, like drill", null, M(ONLY("origin_trooper"),
        R(0.75, "hp", "eld_205", "eld_206",
          "“交替射击！”你们一个打一个装，像训练场上一样。骷髅的队形第一次乱了。",
          "“Alternate fire!” One shoots while one reloads, just like the range. For the first time the skeletons' ranks waver.",
          "操练里没有会自己站起来的靶子。一道绿光扫过，你栽进了水沟。",
          "Drill never had targets that stood back up. A green bolt sweeps you into a ditch."))),
      C("往石阵跑", "Run for the stones", "eld_203",
        E({renown: -3}, "你跑出很远才回头。埃达还守在那里，一个人。",
          "You run a long way before looking back. Edda is still holding the crossroads. Alone."))
    ]};

  N.eld_205 = {chapter: 2, scene: "burning_city", speaker: EDDA, foe: "necron_warrior", time: {h: 1},
    text: L("被你打倒的骷髅又站了起来，伤口像水银一样合拢。\n“它们会自己修好，”埃达喘着气，“我们只是在给它们添麻烦。”\n她把最后一块电池塞给你：“去石阵。听说那里……有别的东西。”",
            "The skeleton you shot down stands back up, its wound closing like quicksilver.\n“They mend themselves,” Edda pants. “We're just an inconvenience to them.”\nShe gives you her last power pack. “Go to the stones. I hear there's... something else there.”"),
    effects: {renown: 5},
    choices: [
      C("“一起走！”", "“Come with me!”", "eld_203",
        E({sanity: -5}, "她摇头，转身对着骷髅举枪。你跑出很远，还听得见她的枪声。然后听不见了。",
          "She shakes her head and turns her rifle on the skeletons. You hear her firing a long way off. Then you don't."))
    ]};

  N.eld_206 = {chapter: 2, scene: "ruins", speaker: null, foe: "canoptek_scarab", time: {h: 2},
    text: L("你醒在水沟里，肩膀麻得像别人的。\n一群甲虫似的小机器从你身上爬过，嗅了嗅，又走开了，好像你不值得拆。\n埃达不见了。路口只剩她的枪，枪管还是热的。",
            "You wake in a ditch, your shoulder numb as if it belonged to someone else.\nA swarm of beetle-like machines crawls over you, sniffs, and moves on, as if you aren't worth dismantling.\nEdda is gone. Only her rifle remains at the crossroads, barrel still warm."),
    effects: {hp: -25, sanity: -5},
    choices: [
      C("拖着身子去石阵", "Drag yourself to the stones", "eld_203")
    ]};

  N.eld_203 = {chapter: 2, scene: "ruins", speaker: TAETHRA, time: {h: 4},
    text: L("黄昏，石阵中间的空气裂开了，像水面被手指划开。\n几个戴高盔的瘦长身影走出光里，最后一位身披长袍，几颗符文石绕着她缓缓旋转。\n她看了你很久，像在读一本只有她看得懂的书。“就是这一根线。”",
            "At dusk the air between the stones splits like water parted by a finger.\nTall, slender figures in high helms step out of the light. The last wears long robes; rune-stones circle her slowly.\nShe studies you a long time, like a book only she can read. “This is the thread.”"),
    codex: ["eld_farseer", "eld_aeldari"],
    choices: [
      C("“你们是谁？”", "“Who are you?”", "eld_207"),
      C("“我梦见过你。”", "“I've dreamed of you.”", "eld_207", M(ONLY("origin_pilgrim"),
        E({renown: 8, sanity: -5}, "符文石同时停顿了一下。先知第一次露出了一点表情——不是惊讶，是确认。“我知道。我让你梦见的。”",
          "Every rune-stone falters at once. For the first time the Farseer shows a flicker of expression: not surprise, confirmation. “I know. I sent the dreams.”")))
    ]};

  N.eld_207 = {chapter: 2, scene: "ruins", speaker: TAETHRA, time: {h: 1},
    text: L("“我是塔艾丝拉，塞卢纳的先知。”她的声音很轻，每个字都像擦亮的银器。\n“这道门只为你开。网道很窄，未来更窄。”\n她身后，守护者们端着枪看你——像看一只误闯进屋的野兽。",
            "“I am Taethra, Farseer of Selunar.” Her voice is soft, every word like polished silver.\n“This gate opens for you alone. The webway is narrow; the future, narrower.”\nBehind her, Guardians hold their rifles and watch you as one might watch an animal that has wandered indoors."),
    codex: ["eld_monkeigh", "eld_guardian"],
    choices: [
      C("把妮尔推向那道光", "Push Nell toward the light", "eld_209", {require: {flag: "nellKept"}}),
      C("“救救这个星球！”", "“Save this world!”", "eld_208"),
      C("跟她走", "Go with her", "eld_301",
        E({renown: 5}, "你迈进光里。身后，瓦尔达的天空是绿的。你没有回头，回头也看不清。",
          "You step into the light. Behind you, Valda's sky is green. You don't look back. You couldn't see anything if you did."))
    ]};

  N.eld_208 = {chapter: 2, scene: "ruins", speaker: TAETHRA, time: {h: 1},
    text: L("“四千一百万猿人。”她说出这个数，像在报天气。\n“若我阻止这场收割，死灵会转向伊尔达涅斯，那里住着六千个我的族人。”\n“我没有权衡，”她纠正你，“我只是数过。”",
            "“Forty-one million mon-keigh.” She says the number like a weather report.\n“If I stop this harvest, the Necrons turn toward Ildaneth, where six thousand of my kin live.”\n“I did not weigh it,” she corrects you. “I only counted.”"),
    effects: {sanity: -8, set: {knowsPrice: true}},
    codex: ["place_ildaneth"],
    choices: [
      C("跟她走", "Go with her", "eld_301",
        E({renown: 5}, "你迈进光里，带着那两个数字。它们比你带走的任何东西都重。",
          "You step into the light carrying those two numbers. They weigh more than anything else you take.")),
      C("朝她脚边啐一口，然后跟上", "Spit at her feet, then follow", "eld_301",
        E({sanity: 5, renown: -3, taint: {khorne: 10}}, "守护者们同时举起了枪。先知抬手制止，看都没看地上一眼，转身走进光里。",
          "Every Guardian raises a rifle. The Farseer stays them with one hand, never glancing at the ground, and turns into the light.")),
      C("“那我留下，和他们一起。”", "“Then I stay with them.”", "eld_210")
    ]};

  N.eld_209 = {chapter: 2, scene: "ruins", speaker: JORBAN, time: {h: 1},
    text: L("光没有为妮尔打开。她伸手进去，光就是一堵墙。先知轻声说：“她的线不在这里。”\n乔班神父从麦田里跌跌撞撞地跑来，抱起妮尔：“去吧。我带她去旧矿井，那里深。”\n妮尔没有哭。她在看你。",
            "The light will not open for Nell. Where she reaches, it is a wall. The Farseer says softly, “Her thread is not here.”\nFather Jorban stumbles out of the wheat and lifts her. “Go. I'll take her to the old mines. They run deep.”\nNell doesn't cry. She's watching you."),
    effects: {sanity: -10},
    choices: [
      C("跟先知走", "Go with the Farseer", "eld_301",
        E({renown: 5}, "你走进光里。最后一眼，是神父抱着妮尔走进麦田，背影越来越小。",
          "You step into the light. Your last sight is the priest carrying Nell into the wheat, growing smaller.")),
      C("留下来陪妮尔", "Stay with Nell", "eld_210")
    ]};

  N.eld_210 = {chapter: 2, scene: "ruins", speaker: MIRETH, time: {h: 1},
    text: L("一个年轻的守护者摘下头盔，是个女孩，眼睛像冬天的湖。“先知看见了上千种未来，”她低声说，“你留下的那些里，没有一种好结局。”\n她向你伸出手。在她们之中，这大概很失礼。",
            "A young Guardian removes her helm: a girl, eyes like a winter lake. “The Farseer saw a thousand futures,” she says quietly. “In every one where you stay, it ends badly.”\nShe holds out her hand. Among her kind, that is probably very rude."),
    choices: [
      C("握住她的手", "Take her hand", "eld_301",
        E({sanity: 5, set: {mirethHand: true}}, "她的手很凉，很稳。先知瞥了你们一眼，什么也没说，转身走进光里。",
          "Her hand is cool and steady. The Farseer glances at you both, says nothing, and turns into the light.")),
      C("任守护者把你拖进去", "Let the Guardians drag you through", "eld_301",
        E({sanity: -8, hp: -5}, "两只细长有力的手架住你的胳膊。你一路都在喊，他们一路都很有礼貌。",
          "Two long, strong hands take your arms. You shout the whole way. They are polite the whole way.")),
      C("最后看一眼瓦尔达，再走", "Look at Valda one last time, then go", "eld_301",
        E({sanity: -8, renown: 3}, "绿光一片片扫过你长大的地方。你把它记住了，每一块田。然后你转身，走进光里。",
          "Green light sweeps the place you grew up, field by field. You memorise every one. Then you turn and step into the light.")),
      C("留在瓦尔达", "Stay on Valda", "eld_end_harvest")
    ]};

  N.eld_end_harvest = {chapter: 2, scene: "tomb_exterior", speaker: null, foe: "necron_warrior", time: {d: 2},
    text: L("光门合上了。你回到麦田，坐在家门槛上等。\n第二天，一个银色的骷髅停在你面前，抬起了手。你没有跑。\n很久以后，瓦尔达又长满了麦子，没人收割。墓穴重新睡着了，睡得很满足。",
            "The gate closes. You go back to the fields and sit on your own doorstep to wait.\nNext day a silver skeleton stops before you and raises a hand. You don't run.\nLong after, Valda is thick with wheat again, and no one harvests it. The tomb sleeps once more, content."),
    ending: {kind: "bad", title: L("最后一季", "The Last Harvest"), cause: L("与瓦尔达一同被收割", "Harvested with Valda")}};

  /* ============ Chapter 3 · The Webway ============ */
  N.eld_301 = {chapter: 3, scene: "webway", speaker: null, time: {d: 2, warp: true}, eventRoll: 0.42,
    text: L("网道里没有上下。光做的走廊向四面八方弯曲，脚步声落下去，很久才传回来。\n你数不清走了多久。也许一小时，也许三天。\n守护者们走得很快。没人回头看你有没有跟上。",
            "There is no up or down in the webway. Corridors of light curve every way; footsteps fall away and return much later.\nYou lose count of how long you walk. An hour, perhaps. Perhaps three days.\nThe Guardians walk fast. No one looks back to see if you're keeping up."),
    codex: ["place_webway"],
    choices: [
      C("紧跟着那个女孩", "Stay close to the girl", "eld_302"),
      C("伸手摸一摸光墙", "Touch the wall of light", "eld_302",
        E({sanity: -8, renown: 3, taint: {tzeentch: 20}}, "墙是暖的，像活物。墙后无数声音同时转向你，像满屋子人突然安静下来。",
          "The wall is warm, like something alive. Behind it, countless voices turn toward you at once, like a crowded room falling silent."))
    ]};

  N.eld_302 = {chapter: 3, scene: "webway", speaker: MIRETH, time: {h: 3},
    text: L("“我叫米瑞丝。”她瞥了眼先知的背影，声音更低了，“别碰墙，别离开路，别回应任何叫你名字的东西。”\n她胸前嵌着一颗乳白色的宝石，随着心跳微微发亮。\n远处某个地方，有东西在挠。",
            "“I'm Mireth.” She glances at the Farseer's back and lowers her voice. “Don't touch the walls. Don't leave the path. Don't answer anything that calls your name.”\nA milky gem is set on her breastplate, glowing faintly with her heartbeat.\nSomewhere far off, something is scratching."),
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
      C("离那道封印远一点", "Step away from the seal", "eld_304"),
      C("把耳朵贴上去听", "Press your ear to it", "eld_304",
        E({sanity: -8, corruption: 8, taint: {slaanesh: 25}}, "挠声停了。一个温柔的声音说：“你闻起来不一样。没有石头。真干净。”米瑞丝一把把你拽开。",
          "The scratching stops. A tender voice says, “You smell different. No stone. So clean.” Mireth yanks you away."))
    ]};

  N.eld_304 = {chapter: 3, scene: "webway", speaker: MIRETH, time: {h: 1},
    text: L("“灵魂石。”她说，“我死的时候，灵魂会逃进这块石头，而不是落进她嘴里。”\n“然后呢？”\n“然后石头回到方舟，回到墙里，和祖先在一起。”她顿了顿，“你们猿人死了，灵魂去哪？”\n你答不上来。",
            "“A spirit stone,” she says. “When I die, my soul flees into this instead of into Her mouth.”\n“And then?”\n“Then the stone goes home, into the walls, with our ancestors.” A pause. “Where do mon-keigh souls go when you die?”\nYou have no answer."),
    effects: {sanity: -5},
    codex: ["eld_spirit_stone"],
    choices: [
      C("“我们向帝皇祈祷。”", "“We pray to the Emperor.”", "eld_305",
        E({sanity: 5}, "米瑞丝礼貌地点头，像在听孩子讲妖怪故事。她没有笑，这已经很客气了。",
          "Mireth nods politely, as if hearing a child's story about monsters. She doesn't laugh. That is already very kind.")),
      C("“我不知道。”", "“I don't know.”", "eld_305",
        E({renown: 3}, "她沉默了一会儿：“那你比大多数猿人诚实。”这是你第一次听出她声音里的温度。",
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
      C("掏出那块白石头", "Take out the white stone", "eld_307", M(ONLY("runeStone"),
        E({renown: 5}, "石头在你掌心亮起来，像一盏小灯。没过多久，一个披斗篷的身影从光里走出来，叹了口气。",
          "The stone kindles in your palm like a small lamp. Soon a cloaked figure steps out of the light and sighs.")))
    ]};

  N.eld_309 = {chapter: 3, scene: "webway", speaker: VHESSRA, time: {h: 2},
    text: L("一个人从暗处走出来，和米瑞丝很像，却瘦得像一把刀，盔甲上挂满钩子。\n“一只走丢的猿人。”她笑得很甜，“网道真慷慨。科摩拉的市场正缺新鲜货。”\n她身后的影子里，还有好几双眼睛。",
            "Someone steps from the dark. She looks like Mireth, but lean as a blade, her armour hung with hooks.\n“A lost mon-keigh.” Her smile is sweet. “How generous the webway is. Commorragh's markets are short of fresh stock.”\nIn the shadows behind her, more eyes."),
    effects: {sanity: -5},
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
    choices: [
      C("跟着走进去", "Follow her through", "eld_401")
    ]};

  /* ============ Chapter 4 · The Craftworld ============ */
  N.eld_401 = {chapter: 4, scene: "craftworld", speaker: null, time: {d: 1},
    effects: {sanity: 5},
    text: L("塞卢纳方舟世界。你的房间按“猿人规格”准备：天花板矮一些，一碗水，一把椅子——他们显然查过资料，才知道椅子是什么。\n门口放着一本小册子，标题是《与客人相处须知》。",
            "Craftworld Selunar. Your room has been prepared “to mon-keigh specifications”: a lower ceiling, a bowl of water, one chair. They clearly had to look up what a chair was.\nA pamphlet waits by the door: On Conduct Around the Guest."),
    codex: ["place_selunar", "eld_craftworlds", "eld_monkeigh"],
    choices: [
      C("翻开小册子", "Open the pamphlet", "eld_402",
        E({sanity: -5, renown: 2}, "第一条：勿突然靠近。第二条：它会饿，按时喂食。第三条：它活不长，不必建立感情。",
          "Rule one: do not approach suddenly. Rule two: it hungers; feed it on schedule. Rule three: it will not live long; do not grow attached.")),
      C("出门走走", "Go for a walk", "eld_402")
    ]};

  N.eld_402 = {chapter: 4, scene: "craftworld", speaker: ELLARIS, time: {h: 3},
    text: L("走廊上，一位长者正对着墙上的裂缝唱歌。歌声落到哪里，裂缝就在哪里慢慢长拢，像伤口愈合。\n“灵骨，”他头也不回，“方舟的骨头。它听歌，不听锤子。”\n他停下来打量你：“你会唱歌吗，猿人？”",
            "In a corridor an elder sings to a crack in the wall. Wherever his voice falls, the crack slowly knits, like a healing wound.\n“Wraithbone,” he says without turning. “The craftworld's bones. It listens to song, not hammers.”\nHe stops and looks you over. “Can you sing, mon-keigh?”"),
    codex: ["eld_wraithbone", "eld_bonesinger"],
    choices: [
      C("哼一段瓦尔达的收割歌", "Hum a Valda harvest song", "eld_403",
        E({sanity: 10, set: {bonesong: true}}, "你哼得很难听。可墙壁轻轻颤了一下，像熟睡的人翻了个身。灵骨歌者第一次露出了惊讶。",
          "You hum badly. But the wall shivers faintly, like a sleeper turning over. For the first time the Bonesinger looks surprised.")),
      C("“这里为什么这么安静？”", "“Why is it so quiet here?”", "eld_404")
    ]};

  N.eld_403 = {chapter: 4, scene: "craftworld", speaker: ELLARIS, time: {h: 1},
    text: L("“墙认得悲伤，”艾拉瑞斯说，“你的歌里有很多。”\n他递给你一小片灵骨，形状像一粒麦子：“留着。它会记得你哼过的调子。”\n这是你来到方舟后，收到的第一件礼物。",
            "“The wall knows grief,” Ellaris says. “There is much in your song.”\nHe hands you a sliver of wraithbone shaped like a grain of wheat. “Keep it. It will remember the tune you hummed.”\nIt's the first gift you've received on the craftworld."),
    effects: {renown: 5},
    choices: [
      C("收下，道谢", "Accept it, and thank him", "eld_404")
    ]};

  N.eld_404 = {chapter: 4, scene: "craftworld", speaker: null, foe: "wraith_construct", time: {h: 4},
    text: L("方舟能住下一百万人，你走过的街区却全是空的。花园没人修剪，长椅上落满光尘。\n只有一个灵骨巨人在慢慢巡逻。它没有脸，胸口嵌着一颗发光的石头。\n米瑞丝说，里面住着一位死去的诗人。",
            "The craftworld could house a million, yet every district you cross is empty. Gardens untended, benches dusted with light.\nOnly one tall wraithbone giant patrols, slow-footed. It has no face; a glowing stone sits in its chest.\nMireth says a dead poet lives inside it."),
    codex: ["eld_wraith_construct", "eld_infinity_circuit"],
    choices: [
      C("把手放在墙上", "Lay your hand on the wall", "eld_405",
        E({sanity: -8, renown: 5}, "墙里有成千上万个声音在低声交谈，像一座图书馆。其中一个停下来，问你是谁。你没敢回答。",
          "Inside the wall thousands of voices murmur, like a library. One pauses to ask who you are. You don't dare answer.")),
      C("向巨人点头致意", "Nod to the giant", "eld_405",
        E({renown: 3}, "巨人停下来，转过那颗没有脸的头。过了很久，它也点了点头，慢得像在回忆该怎么做。",
          "The giant halts and turns its faceless head. After a long time it nods back, slowly, as if remembering how."))
    ]};

  N.eld_405 = {chapter: 4, scene: "craftworld", speaker: TAETHRA, time: {d: 2},
    text: L("先知在水晶穹顶召见你。四周站着许多晶莹的人形，都是看未来太久、化成了水晶的先知。\n“最伟大的先知艾德拉德也曾这样站着，”她说，“后来他醒了，去追随重生者。”\n“现在，说说你的梦。”",
            "The Farseer summons you to the Dome of Crystal Seers. All around stand gleaming figures: seers who gazed at the future so long they turned to crystal.\n“The greatest of us, Eldrad, once stood like this,” she says. “Then he woke, and went to follow the Reborn.”\n“Now. Tell me your dreams.”"),
    codex: ["place_crystal_dome", "eld_eldrad"],
    choices: [
      C("“瓦尔达还剩下什么？”", "“What's left of Valda?”", "eld_406",
        E({sanity: -8}, "“麦子，”她说，“和一座重新睡着的墓穴。死灵很守时。”她把一颗符文石翻了个面。",
          "“Wheat,” she says. “And a tomb, asleep again. The Necrons keep good time.” She turns over a rune-stone.")),
      C("“你为什么救我？”", "“Why did you save me?”", "eld_406",
        E({renown: 5}, "“我没有救你，”她纠正道，“我保留了你。很多种未来里，都有个猿人站在一扇门前。我还不知道是哪扇门。”",
          "“I did not save you,” she corrects. “I kept you. In many futures a mon-keigh stands before a door. I do not yet know which door.”")),
      C("把梦讲给她听", "Tell her your dreams", "eld_406",
        E({sanity: -5, renown: 3, set: {toldDreams: true}, taint: {tzeentch: 20}}, "你讲了那条发光的路，和一只很大、很香的手。先知的符文石同时停了一下。",
          "You tell her of the road of light, and of a vast, sweet-smelling hand. All her rune-stones falter at once.")),
      C("“这十年的梦，是你送来的。”", "“Ten years of dreams. You sent them.”", "eld_406", M(ONLY("origin_pilgrim"),
        E({renown: 10, sanity: -5, set: {toldDreams: true}, taint: {tzeentch: 20}}, "“线要先拉直，才能穿针。”她平静地说，“你每一次流鼻血，我都看见了。按你们的说法：我很抱歉。”",
          "“A thread must be drawn straight before it can be threaded,” she says calmly. “I saw every nosebleed. I am sorry, as your kind would say.”")))
    ]};

  N.eld_406 = {chapter: 4, scene: "craftworld", speaker: MIRETH, time: {d: 3},
    text: L("米瑞丝带你逛方舟。她说每个灵族一生都走“道途”：做诗人、战士、歌者……一次只走一条，走到尽头再换。\n“为什么？”\n“因为我们的心太大了。”她笑了一下，“不给它一条路，它就会跑去找她。”",
            "Mireth shows you around. Every Aeldari, she says, walks the Path: poet, warrior, singer... one at a time, to its end, then the next.\n“Why?”\n“Because our hearts are too large.” A small smile. “Give them no road, and they run to Her.”"),
    codex: ["eld_path"],
    choices: [
      C("“带我去看战士之道。”", "“Show me the Path of the Warrior.”", "eld_407"),
      C("“你以前走的是哪条？”", "“Which Path did you walk before?”", "eld_408")
    ]};

  N.eld_407 = {chapter: 4, scene: "craftworld", speaker: EXARCH, time: {h: 2},
    text: L("相位神殿里，战士们戴着面具静立。督军的盔甲上刻满前任的名字。\n“戴上战面，杀意就关进面具里，”他说，“摘下来，还能做回诗人。”\n“我不能。我被困在这条路上了。凯恩的手在我心里。”",
            "In the Aspect Shrine masked warriors stand in silence. The Exarch's armour is etched with the names of those who wore it before.\n“When we don the war-mask, we lock the killing inside it,” he says. “Take it off, and we can be poets again.”\n“Not I. I am trapped on this Path. Khaine's hand is in my heart.”"),
    codex: ["place_aspect_shrine", "eld_aspect_warriors", "eld_khaine"],
    choices: [
      C("“让我戴一戴战面。”", "“Let me wear the war-mask.”", "eld_410"),
      C("鞠躬，退出神殿", "Bow and leave the shrine", "eld_408",
        E({renown: 2}, "他回礼的角度精确到分毫，正好是对客人的标准。不多，也不少。",
          "He returns the bow at a precise angle, exactly what a guest is owed. No more, no less."))
    ]};

  N.eld_408 = {chapter: 4, scene: "craftworld", speaker: MIRETH, time: {h: 2},
    text: L("她带你去一座小花园，所有的花都是她当年在“梦者之道”上种的。\n“那时我只做一件事：做梦，把梦种出来。”她摸着一朵发光的花，“后来梦得太深，差点回不来。”\n“所以现在我拿枪。枪很简单。”",
            "She takes you to a small garden. Every flower here she grew on the Path of the Dreamer.\n“Back then I did one thing: dream, and plant the dreams.” She touches a glowing bloom. “Then I dreamed too deep and nearly didn't come back.”\n“So now I carry a rifle. Rifles are simple.”"),
    choices: [
      C("摘一朵花给她", "Pick a flower for her", "eld_409",
        E({sanity: 5, renown: 2, set: {mirethFlower: true}}, "她愣了一下，把花别在灵魂石旁边。“猿人送的花，”她说，“传出去，我会被笑一百年。”",
          "She blinks, then tucks the flower beside her spirit stone. “A flower from a mon-keigh,” she says. “If this gets out, I'll be laughed at for a century.”")),
      C("静静陪她坐一会儿", "Sit quietly with her", "eld_409",
        E({sanity: 10}, "花园里没有声音。你第一次觉得，方舟的安静不是空，而是在等。",
          "The garden is silent. For the first time the craftworld's quiet feels less like emptiness and more like waiting."))
    ]};

  N.eld_410 = {chapter: 4, scene: "craftworld", speaker: S("omen_khaine", "战面中的幻象", "Vision in the Mask"), time: {h: 1},
    text: L("督军把一张小面具放进你手里。戴上的瞬间，你看见一只燃烧的铁手，攥着一颗心。\n愤怒像潮水灌进来——为瓦尔达，为妮尔，为那两个数字。\n你想杀人。想得很清楚，很平静。",
            "The Exarch places a small mask in your hands. The instant you put it on, you see a burning iron hand clutching a heart.\nRage floods in—for Valda, for Nell, for those two numbers.\nYou want to kill. Clearly. Calmly."),
    effects: {sanity: -8},
    choices: [
      C("摘下面具", "Take off the mask", "eld_409",
        E({renown: 5}, "你把面具摘下来，手在发抖。督军点头：“摘下来了。比大多数头一回的孩子强。”",
          "You pull the mask off, hands shaking. The Exarch nods. “You took it off. Better than most children their first time.”")),
      C("再戴一会儿", "Keep it on a little longer", "eld_409",
        E({hp: -10, corruption: 10, renown: 3, taint: {khorne: 60}}, "督军不得不掰开你的手指才拿走面具。指甲在掌心掐出了血，你却觉得很好。",
          "The Exarch has to pry your fingers loose to take the mask. Your nails have drawn blood from your palms. You feel wonderful."))
    ]};

  N.eld_409 = {chapter: 4, scene: "craftworld", speaker: null, time: {h: 10}, eventRoll: 0.49,
    text: L("夜里，方舟的灯一层层暗下去。你梦见瓦尔达的麦田，妮尔在田埂上跑，越跑越远。\n醒来时，枕头是湿的。窗外，一个灵骨巨人静静站着，像在守夜。\n你分不清它是在保护你，还是在看着你。",
            "At night the craftworld's lights dim, tier by tier. You dream of Valda's fields, Nell running along a ridge, farther and farther.\nYou wake with a damp pillow. Outside, a wraithbone giant stands silent, as if keeping watch.\nYou can't tell whether it's guarding you or watching you."),
    choices: [
      C("起身去找米瑞丝", "Get up and find Mireth", "eld_411"),
      C("躺着，数墙里的声音", "Lie still and count the voices in the wall", "eld_411",
        E({sanity: -5, renown: 3, taint: {tzeentch: 25}}, "数到第三百个，有个声音很客气地叫出了你的名字。你不再数了。",
          "At three hundred, one voice says your name, very politely. You stop counting."))
    ]};

  N.eld_411 = {chapter: 4, scene: "craftworld", speaker: TAETHRA, time: {w: 6},
    text: L("你学会了吃他们的食物：味道很淡，像怕吵醒什么。你学会了走路时不发出声音。\n先知偶尔在走廊尽头看你一眼，像园丁看一株种错了地方的苗。\n有一天她开口了：“你学得比预期快。”",
            "You learn to eat their food: faintly flavoured, as if afraid to wake something. You learn to walk without a sound.\nNow and then the Farseer watches you from a corridor's end, like a gardener eyeing a seedling planted in the wrong bed.\nOne day she speaks. “You learn faster than foreseen.”"),
    choices: [
      C("“你预见过我？”", "“You foresaw me?”", "eld_501",
        E({renown: 3}, "“我预见过很多个你，”她说，“大多数学得很慢。”她走开了，符文石转得比平时快一点。",
          "“I foresaw many of you,” she says. “Most learned slowly.” She walks away, her rune-stones turning a little faster than usual.")),
      C("鞠一个精确的客人礼", "Give a precise guest's bow", "eld_501",
        E({sanity: 5, renown: 2}, "角度分毫不差。先知停了一拍，回了一个同样精确的礼。你们都没有笑。",
          "The angle is exact. The Farseer pauses a beat, then returns an equally exact bow. Neither of you smiles."))
    ]};

  /* ============ Chapter 5 · The Masque of the Fall ============ */
  N.eld_501 = {chapter: 5, scene: "craftworld", speaker: MIRETH, time: {y: 1}, eventRoll: 0.42,
    effects: {sanity: 5, hp: 5},
    text: L("一年过去了。灵族终于开始叫你的名字，只是后面仍要加上“猿人”，像加一个敬称。\n米瑞丝教会了你三百个词，你教会了她吹口哨。\n今天，丑角剧团来了。整座方舟都在说悄悄话。",
            "A year passes. The Aeldari finally use your name, though they still add “mon-keigh” after it, like an honorific.\nMireth has taught you three hundred words. You've taught her to whistle.\nToday the Harlequins have arrived. The whole craftworld is whispering."),
    choices: [
      C("去看演出", "Go to the performance", "eld_502"),
      C("拉上米瑞丝一起去看", "Drag Mireth along to watch", "eld_502",
        E({sanity: 5}, "米瑞丝说她看过一百遍了。她还是来了，坐在你旁边，提前攥紧了袖口。",
          "Mireth says she has seen it a hundred times. She comes anyway, sits beside you, and grips her sleeves before it starts."))
    ]};

  N.eld_502 = {chapter: 5, scene: "craftworld", speaker: DANCER, time: {h: 6},
    text: L("剧团演的是《陨落》。舞者扮成远古的灵族，在群星间宴饮、追逐，要更多，再要更多。\n音乐越来越快，越来越美，美得让你喘不过气。\n观众里没有一个人动。连呼吸都没有。",
            "The troupe performs The Fall. Dancers play the ancient Aeldari, feasting among the stars, chasing, wanting more, and more again.\nThe music grows faster, more beautiful, beautiful enough to stop your breath.\nNo one in the audience moves. No one even breathes."),
    codex: ["eld_harlequins", "eld_the_fall"],
    choices: [
      C("看到最后", "Watch to the end", "eld_503",
        E({sanity: -8, set: {sawMasque: true}, taint: {slaanesh: 10}}, "你移不开眼睛。你知道接下来会发生什么，就像知道一个梦的结局，却醒不过来。",
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
      C("沉默地坐着", "Sit in silence", "eld_505")
    ]};

  N.eld_504 = {chapter: 5, scene: "craftworld", speaker: MIRETH, time: {h: 1},
    text: L("观众的脸都很平静，可每个人都在流泪，一直流到下巴。\n米瑞丝在你耳边说：“这一夜，一个神诞生了。我们的帝国死在一声尖叫里。”\n“我们每年都看。免得忘了，为什么要活得这么小心。”",
            "Every face in the audience is calm, yet every one is weeping, tears running to the chin.\nMireth whispers: “On this night a god was born. Our empire died in a single scream.”\n“We watch it every year. So we never forget why we live so carefully.”"),
    codex: ["eld_the_fall"],
    choices: [
      C("握住她的手", "Take her hand", "eld_505",
        E({sanity: 5}, "她没有抽回去。台上的鼓声停了，她的手指在你掌心里轻轻发抖。",
          "She doesn't pull away. When the drums on stage fall silent, her fingers tremble in your palm.")),
      C("“那个神，就是她？”", "“That god—that's Her?”", "eld_505", M(
        E({sanity: -5}, "米瑞丝闭上眼，点了一下头。一整排观众同时转过头来，好像你说出了一个禁忌的名字。",
          "Mireth closes her eyes and nods once. A whole row turns to look at you, as if you'd spoken a forbidden name."),
        {codex: ["god_slaanesh"]}))
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
        E({sanity: -5, renown: 2}, "镜面里映出你的脸，很疲惫。“真无聊，”他说，“可惜你说对了。”",
          "His mask reflects your face, very tired. “How dull,” he says. “Pity you're right.”"))
    ]};

  N.eld_506 = {chapter: 5, scene: "craftworld", speaker: SYLVAEN, time: {d: 4},
    text: L("码头上，游侠们回来了。其中一个摘下兜帽——是瓦尔达山脊上那个人。\n“西尔凡。”他报出名字，又补了一句，“星语塔的天线，是我切断的。”\n他说这话时没有低头。他在等你。",
            "At the docks the Rangers return. One lowers his hood: the man from the ridge on Valda.\n“Sylvaen,” he says. Then: “The astropath tower's array. I was the one who cut it.”\nHe doesn't lower his eyes. He's waiting for you."),
    codex: ["eld_rangers"],
    choices: [
      C("一拳打过去", "Punch him", "eld_507",
        E({hp: -5, renown: 3, taint: {khorne: 35}}, "他没躲。你的指节撞在他颧骨上，疼的却是你。他擦擦嘴角：“这一拳，该挨。”",
          "He doesn't dodge. Your knuckles crack against his cheekbone, and it's you who hurts. He wipes his mouth. “That one was owed.”")),
      C("“那架穿梭机呢？”", "“What about the shuttle?”", "eld_509", ONLY("nellLander")),
      C("“你也是奉命行事。”", "“You were following orders too.”", "eld_508",
        E({sanity: -5, renown: 5, set: {forgave: true}}, "他看了你很久。“我有选择，”他说，“我选了。”然后他第一次向你鞠躬，比对客人深一点。",
          "He looks at you a long time. “I had a choice,” he says. “I made it.” Then, for the first time, he bows to you, a little deeper than to a guest.")),
      C("“你打断我枪管那晚，为什么不开第二枪？”", "“The night you shot my barrel. Why not a second shot?”", "eld_508", M(ONLY("origin_trooper"),
        E({renown: 5}, "“因为你放下了枪，”西尔凡说，“在一万种未来里，你都会放下。我想亲眼看看。”",
          "“Because you lowered your weapon,” Sylvaen says. “In ten thousand futures, you lower it. I wanted to see it with my own eyes.”")))
    ]};

  N.eld_507 = {chapter: 5, scene: "craftworld", speaker: SYLVAEN, time: {h: 1},
    text: L("你挥第二拳时，他接住了，很轻，像接住一片落叶。\n“游侠走的是放逐之路，”他说，“我们离开方舟，去外面看，去外面犯错。错得太多的，就回不来了。”\n“我大概快回不来了。”",
            "When you swing again he catches your fist, lightly, like catching a falling leaf.\n“Rangers walk the Path of the Outcast,” he says. “We leave the craftworld to see, and to err. Those who err too much never return.”\n“I think I am nearly there.”"),
    choices: [
      C("松开拳头", "Unclench your fist", "eld_508")
    ]};

  N.eld_509 = {chapter: 5, scene: "craftworld", speaker: SYLVAEN, time: {h: 1},
    text: L("“穿梭机到了轨道，”西尔凡说，“一艘自由商船收容了它。之后……我没去看。”\n“为什么？”\n“因为我不想知道。先知说这是软弱。”\n转身前他补了一句：“那孩子一直在喊你的名字。”",
            "“The shuttle reached orbit,” Sylvaen says. “A free trader took it aboard. After that... I did not look.”\n“Why not?”\n“Because I did not want to know. The Farseer calls that weakness.”\nTurning away, he adds: “The child kept calling your name.”"),
    effects: {sanity: 10, renown: 3},
    choices: [
      C("谢谢他", "Thank him", "eld_508")
    ]};

  N.eld_508 = {chapter: 5, scene: "craftworld", speaker: MIRETH, time: {d: 6},
    text: L("夜里，米瑞丝来你房间坐：“你们只活七八十年，怎么受得了？”\n“受不了，”你说，“所以我们什么都想快一点。”\n她想了想：“这听起来……很像她喜欢的那种灵魂。”说完，她自己先打了个寒战。",
            "At night Mireth comes to sit in your room. “You live seventy, eighty years. How do you bear it?”\n“We don't,” you say. “So we want everything quickly.”\nShe considers. “That sounds... like the kind of soul She likes.” She shivers at her own words."),
    choices: [
      C("给她讲妮尔的事", "Tell her about Nell", "eld_510",
        E({sanity: 10}, "你讲了很久，米瑞丝一句也没插。讲完，她说：“我会记住她的名字。我们记得很久。”",
          "You talk a long while; Mireth never interrupts. When you finish, she says, “I'll remember her name. We remember for a very long time.”")),
      C("问她怕不怕死", "Ask if she fears death", "eld_510",
        E({sanity: -5, renown: 3}, "“不怕死，”她摸着灵魂石，“怕的是死后。可我有这个。”她顿了顿，“你什么都没有。”",
          "“Not death,” she says, touching her spirit stone. “What comes after. But I have this.” A pause. “You have nothing.”"))
    ]};

  N.eld_510 = {chapter: 5, scene: "craftworld", speaker: TAETHRA, time: {d: 2},
    text: L("先知召见你，这次没有符文，也没有水晶。\n“我们要去伊尔达涅斯。你也去。”\n“为什么带我？”\n“因为你应该亲眼看看，”她说，“四千一百万换来了什么。”",
            "The Farseer summons you. This time, no runes, no crystal.\n“We go to Ildaneth. You will come.”\n“Why bring me?”\n“Because you should see with your own eyes,” she says, “what forty-one million purchased.”"),
    choices: [
      C("“好。”", "“Fine.”", "eld_601"),
      C("“我不想看。”", "“I don't want to see it.”", "eld_601",
        E({sanity: -5}, "“想不想，”她说，“从来不是未来关心的事。”第二天，你还是登上了船。",
          "“Want,” she says, “has never concerned the future.” Next day, you board the ship anyway."))
    ]};

  /* ============ Chapter 6 · The Maiden World ============ */
  N.eld_601 = {chapter: 6, scene: "maiden_world", speaker: null, time: {d: 9, warp: true}, eventRoll: 0.42,
    effects: {sanity: 10},
    text: L("伊尔达涅斯。天空干净得发蓝，森林一直长到海边。巨大的蜥兽在河边饮水，背上骑着灵族的孩子。\n这里没有方舟，没有城市。流亡者住在树下，种地，放牧。\n空气里有麦子的味道。你差点没站稳。",
            "Ildaneth. A sky scrubbed blue, forests running down to the sea. Huge reptiles drink at the river, Aeldari children on their backs.\nNo craftworld here, no cities. The Exodites live beneath the trees, farming, herding.\nThe air smells of wheat. You almost lose your footing."),
    codex: ["place_ildaneth", "eld_exodites"],
    choices: [
      C("走向麦田", "Walk toward the fields", "eld_602"),
      C("蹲下来，捻一捻土", "Kneel and rub the soil between your fingers", "eld_602", M(ONLY("origin_agri"),
        E({sanity: 10, renown: 3}, "黑土，松软，带着露水的凉。父亲说过，好土会咬手指。这片土咬得很轻。",
          "Dark soil, loose, cool with dew. Your father used to say good earth bites your fingers. This earth bites gently.")))
    ]};

  N.eld_602 = {chapter: 6, scene: "maiden_world", speaker: ELDER, time: {h: 3},
    text: L("流亡者长老拄着一根骨杖，比先知老，也比先知随和。\n“我们的祖先在陨落之前就离开了，”她说，“他们说帝国太舒服，舒服得危险。”\n“我们的死者不进石头，进这片土地。所以这里的树都会说话。”",
            "The Exodite elder leans on a bone staff, older than the Farseer and far easier.\n“Our ancestors left before the Fall,” she says. “They said the empire was too comfortable. Dangerously so.”\n“Our dead go not into stones but into this land. So every tree here can speak.”"),
    choices: [
      C("“你们知道瓦尔达吗？”", "“Do you know of Valda?”", "eld_603",
        E({sanity: -5}, "长老摇头。她是真的不知道。她甚至不知道自己欠了谁一条命。",
          "The elder shakes her head. She truly doesn't know. She doesn't even know whom she owes a life.")),
      C("跟着孩子们去果园", "Follow the children to the orchard", "eld_603")
    ]};

  N.eld_603 = {chapter: 6, scene: "maiden_world", speaker: null, time: {h: 2},
    text: L("一个流亡者孩子跑过来，往你手里塞了一个果子，然后躲到树后偷看你。\n果子很普通，有点酸。不是完美的味道，只是一个果子。\n这个孩子活着。四千一百万人，换了这六千个人。果子还是温的。",
            "An Exodite child runs up, presses a fruit into your hand, and hides behind a tree to peek at you.\nThe fruit is ordinary, a little sour. Not a perfect taste—just a fruit.\nThis child lives. Forty-one million for these six thousand. The fruit is still warm."),
    choices: [
      C("吃掉果子，冲孩子笑", "Eat it, and smile at the child", "eld_604",
        E({sanity: 10, renown: 3}, "孩子从树后走出来，学你咧嘴笑，牙缝里也夹着果皮。你笑着笑着，眼睛就湿了。",
          "The child steps out and copies your grin, peel stuck in her teeth too. You're smiling, and then your eyes are wet.")),
      C("放下果子，走开", "Put the fruit down and walk away", "eld_604",
        E({sanity: -8, renown: 5}, "你吃不下。孩子不明白，捡起果子，困惑地看着你的背影。",
          "You can't eat it. The child doesn't understand. She picks up the fruit and watches you go, puzzled."))
    ]};

  N.eld_604 = {chapter: 6, scene: "maiden_world", speaker: SEYL, time: {d: 1},
    text: L("第二天，一艘陌生的船降落，来人的盔甲上刻着骷髅与新芽。\n“我是赛尔，伊芙蕾恩的使者。我们侍奉恩灵，死者之神。”\n“最后一个灵族死去时，恩灵会醒来，吞掉渴求者。我们只想让它早点醒。”",
            "Next day a strange ship lands. The newcomer's armour bears skulls and new shoots.\n“I am Seyl, herald of Yvraine. We serve Ynnead, god of the dead, not yet fully awake.”\n“When the last Aeldari dies, Ynnead wakes and devours She Who Thirsts. We only wish to wake it sooner.”"),
    codex: ["eld_ynnari", "eld_yvraine", "eld_ynnead"],
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
        E({renown: 8, set: {loyal: true}}, "先知没有道谢。可当晚，你房里多了一把更舒服的椅子。",
          "The Farseer offers no thanks. But that night a more comfortable chair appears in your room."))
    ]};

  N.eld_606 = {chapter: 6, scene: "maiden_world", speaker: SEYL, time: {h: 1},
    text: L("“伊芙蕾恩死在黑暗之城的角斗场里，”赛尔说，“又带着恩灵的一部分站了起来。”\n“我们的亡魂不落进她嘴里，也不关进石头，而是化作恩灵的力量。”\n她递来一枚骨白小骷髅：“猿人也能戴。”",
            "“Yvraine died once,” Seyl says, “in the arenas of the Dark City. Then she rose, carrying a piece of Ynnead.”\n“When our people die, their souls no longer fall into Her mouth, nor need they be caged in stones. They become Ynnead's strength.”\nShe offers a small bone-white skull. “Even a mon-keigh may wear it.”"),
    choices: [
      C("戴上它", "Put it on", "eld_607",
        E({renown: 5, sanity: -5, set: {ynnari: true}}, "骷髅贴着胸口，凉得像井水。先知看见了，什么也没说。她的符文石却从此绕开了你。",
          "The skull rests cold as well-water against your chest. The Farseer sees and says nothing. Her rune-stones, though, now circle wide of you.")),
      C("礼貌地拒绝", "Politely decline", "eld_607",
        E({renown: 3}, "赛尔并不意外：“死者有耐心。等你想要的时候，它会在。”",
          "Seyl isn't surprised. “The dead are patient. When you want it, it will be there.”"))
    ]};

  N.eld_607 = {chapter: 6, scene: "maiden_world", speaker: S("omen_farseer", "幻象", "Vision"), time: {h: 1},
    text: L("你握住符文石，看见一个身影站在无数命运之线中间，像拨琴弦一样拨弄它们。\n“艾德拉德·乌斯兰，”塔艾丝拉说，“他拨动过整个银河，最后也被拨动了，跟着重生者走了。”\n“再粗的线，也会松。”",
            "The Farseer has you hold a rune-stone. You see a figure amid countless threads of fate, plucking them like harp strings.\n“Eldrad Ulthran,” says Taethra. “He played the whole galaxy. In the end he was played too, and followed the Reborn.”\n“Even the thickest thread can be pulled loose.”"),
    effects: {sanity: -5, renown: 5, taint: {tzeentch: 35}},
    codex: ["eld_eldrad"],
    choices: [
      C("放下符文石", "Set down the rune-stone", "eld_608")
    ]};

  N.eld_608 = {chapter: 6, scene: "maiden_world", speaker: VHESSRA, foe: "drukhari_raider", time: {h: 20},
    text: L("夜里，黑色快艇掠过森林。刀一样瘦的身影跳下来，钩子闪着光，专挑孩子。\n“黑暗灵族，”米瑞丝举枪，“我们的表亲。陨落后，他们靠吃别人的痛苦活着。”\n果园里，那个给你果子的孩子在哭。",
            "That night black skiffs skim the forest. Blade-thin figures leap down, hooks glinting in the moonlight. They go for the children.\n“Drukhari,” Mireth hisses, raising her rifle. “Our cousins. After the Fall they chose another way to live: feeding on others' pain.”\nIn the orchard, the child who gave you the fruit is crying."),
    effects: {sanity: -5, hp: -15},
    codex: ["eld_drukhari"],
    choices: [
      C("冲进果园", "Charge into the orchard", null,
        R(0.5, "hp", "eld_609", "eld_610",
          "你扑倒孩子，钩子从你头顶划过。米瑞丝的枪声在你身后连成一片。",
          "You tackle the child down; a hook whistles over your head. Behind you, Mireth's fire is one long roar.",
          "钩子勾住你的外套，把你拖倒在地。米瑞丝冲过来，挡在你和刀之间。",
          "A hook snags your coat and drags you down. Mireth rushes in between you and the blade.")),
      C("像防卫军那样，守住果园入口", "Hold the orchard gate, defence-force style", "eld_609", M(ONLY("origin_trooper"),
        E({hp: -10, renown: 5}, "你找了块石头当掩体，一枪一枪地打，像在瓦尔达的路口。这一次，你守住了。",
          "You take cover behind a stone and fire shot by shot, as at Valda's crossroads. This time, you hold."))),
      C("躲进树洞", "Hide in a hollow tree", "eld_610",
        E({sanity: -8, taint: {nurgle: 10}}, "你在黑暗里捂着嘴，听着外面的一切。你听见米瑞丝在喊你，没有回答。",
          "In the dark you cover your mouth and listen to everything outside. You hear Mireth calling you. You don't answer."))
    ]};

  N.eld_609 = {chapter: 6, scene: "maiden_world", speaker: MIRETH, foe: "drukhari_raider", time: {h: 1},
    text: L("孩子安全了。快艇在燃烧，掠夺者笑着撤退，像游戏散场。\n米瑞丝靠着树坐下，伤得很重。她把灵魂石按进你手心：“替我拿着。别让她……”\n石头在你掌心亮了一下，像一次心跳。然后稳稳地亮着。",
            "The child is safe. A skiff burns; the raiders withdraw laughing, as if a game has ended.\nMireth sits against a tree, badly hurt. She presses her spirit stone into your palm. “Hold this for me. Don't let Her...”\nThe stone flares once in your hand, like a heartbeat. Then it glows, steady."),
    effects: {renown: 10, sanity: -8, hp: -20, set: {carryStone: true, mirethDead: true}},
    choices: [
      C("握紧石头", "Close your hand around it", "eld_611")
    ]};

  N.eld_610 = {chapter: 6, scene: "maiden_world", speaker: null, time: {h: 2},
    text: L("天亮时，掠夺者走了，带走了十几个孩子。\n米瑞丝倒在果园边。她最后挡下的那把刀，本来是冲着你的。\n她胸前的灵魂石滚落在草丛里，还在发光，像在等一只手。",
            "By dawn the raiders are gone, and a dozen children with them.\nMireth lies at the orchard's edge. The last blade she stopped was meant for you.\nHer spirit stone has rolled into the grass, still glowing, as if waiting for a hand."),
    effects: {sanity: -10, hp: -20, set: {mirethDead: true}},
    choices: [
      C("捡起灵魂石", "Pick up the spirit stone", "eld_611",
        E({renown: 5, set: {carryStone: true}}, "石头很暖。你觉得它在你掌心里轻轻松了一口气。",
          "The stone is warm. It seems to breathe out, softly, in your palm.")),
      C("留给先知", "Leave it for the Farseer", "eld_611",
        E({sanity: 5}, "先知弯腰拾起石头，看了你一眼。那眼神你读不懂，但不像责备。",
          "The Farseer stoops for the stone and glances at you. You can't read the look, but it isn't reproach."))
    ]};

  N.eld_611 = {chapter: 6, scene: "maiden_world", speaker: TAETHRA, time: {d: 1},
    text: L("流亡者把死者埋进树根下，唱着你听不懂的歌。被掳走的孩子，没有坟。\n先知站在你身边，轻声算了一遍：“六千，减十四。”\n她说这个数时，第一次没有像在报天气。",
            "The Exodites bury their dead beneath the tree roots, singing a song you don't understand. The stolen children have no graves.\nThe Farseer stands beside you and counts under her breath. “Six thousand, less fourteen.”\nFor the first time, she doesn't say a number like a weather report."),
    effects: {sanity: -5},
    choices: [
      C("“值得吗？”", "“Was it worth it?”", "eld_701",
        E({renown: 3}, "她看着树根很久。“我不知道，”她说，“先知不该说这句话。我说了。”",
          "She looks at the roots a long time. “I do not know,” she says. “A Farseer should never say that. I have said it.”")),
      C("默默跟着唱", "Hum along in silence", "eld_701",
        E({sanity: 8}, "你不懂歌词，只跟着调子。一个流亡者孩子靠过来，握住了你的手指。",
          "You don't know the words; you follow the tune. An Exodite child leans against you and takes hold of your finger."))
    ]};

  /* ============ Chapter 7 · She Who Thirsts ============ */
  N.eld_701 = {chapter: 7, scene: "craftworld", speaker: ELLARIS, time: {d: 12},
    text: L("回到塞卢纳。米瑞丝的灵魂石本该放进无尽回路，和祖先在一起。\n可艾拉瑞斯脸色很差：“墙里的声音在变少。有东西在网道里，一口一口地吃。”\n“它找最新鲜的灵魂。比如，刚死去的。”",
            "Back on Selunar. Mireth's spirit stone should go into the Infinity Circuit, to be with her ancestors.\nBut Ellaris looks grey. “The voices in the walls are thinning. Something in the webway is eating, mouthful by mouthful.”\n“It seeks the freshest souls. The newly dead, for instance.”"),
    effects: {sanity: -5},
    codex: ["eld_infinity_circuit"],
    choices: [
      C("把米瑞丝的石头交给他", "Give him Mireth's stone", "eld_702", M(ONLY("carryStone"),
        E({sanity: 5, set: {carryStone: false}}, "艾拉瑞斯把石头贴在额头，唱了一句很短的歌。墙接过了它，像接过一个孩子。",
          "Ellaris presses the stone to his brow and sings one short phrase. The wall receives it, as if receiving a child."))),
      C("把石头留在身边", "Keep the stone with you", "eld_702", M(ONLY("carryStone"),
        E({renown: 5}, "“她让你拿着，”艾拉瑞斯低声说，“那就拿着。灵骨记得谁答应过什么。”",
          "“She asked you to hold it,” Ellaris murmurs. “Then hold it. Wraithbone remembers who promised what.”"))),
      C("“它在吃什么？”", "“What is it eating?”", "eld_702",
        E({sanity: -5}, "“我们的祖先，”艾拉瑞斯说，“还有我们的将来。”他把手按在墙上，墙在他手下发抖。",
          "“Our ancestors,” Ellaris says. “And our futures.” He lays a hand on the wall. It trembles beneath his palm."))
    ]};

  N.eld_702 = {chapter: 7, scene: "jungle", speaker: S("sigil_slaanesh", "完美的声音", "A Perfect Voice"), time: {h: 9}, eventRoll: 0.49,
    text: L("那晚你梦见瓦尔达。麦子金黄，没有墓穴，妮尔长大了，在门口喊你吃饭。\n一切都刚刚好，好得让人想哭。\n一个声音轻轻地说：“这是可以的。只要你把那扇门打开一点点。”",
            "That night you dream of Valda. The wheat is gold, there is no tomb, and Nell, grown, calls you in to supper from the door.\nEverything is exactly right, right enough to make you weep.\nA voice says softly, “This can be. If you'll open the door, just a little.”"),
    codex: ["eld_she_who_thirsts", "god_slaanesh"],
    choices: [
      C("走进家门", "Walk through the door", "eld_703",
        E({corruption: 20, sanity: 10, set: {tasted: true}, taint: {slaanesh: 45}}, "饭菜的香味完美无缺。你吃了一口，醒来时嘴里还有那个味道。之后的每一顿饭，都像嚼灰。",
          "The supper smells flawless. You take one bite and wake with the taste still in your mouth. Every meal afterward tastes of ash.")),
      C("咬破手背，逼自己醒来", "Bite your hand to wake yourself", "eld_703",
        E({hp: -5, sanity: -8, renown: 5}, "你在黑暗里醒来，手背上一圈牙印。窗外的灵骨巨人转过头，看了你很久。",
          "You wake in the dark with a ring of tooth-marks on your hand. Outside, the wraithbone giant turns its head and watches you a long while."))
    ]};

  N.eld_703 = {chapter: 7, scene: "craftworld", speaker: TAETHRA, time: {d: 1},
    text: L("水晶穹顶里，先知终于说出它的名字：无餍者，色孽的守密者，一个大魔。\n“它闻到你了。没有灵魂石的灵魂，又亮又干净。它会追你进网道。”\n“我会在你身后封门。这就是你被留下的原因。”",
            "In the crystal dome the Farseer finally names it: the Unsated, a Keeper of Secrets, a Greater Daemon of Slaanesh.\n“It has scented you,” she says. “A soul without a stone, bright and clean. It will follow you into the webway.”\n“I will seal the gate behind you. This is why you were kept.”"),
    effects: {sanity: -8},
    codex: ["eld_keeper_of_secrets", "eld_the_unsated"],
    choices: [
      C("“我去。”", "“I'll go.”", "eld_705",
        E({renown: 10, set: {bait: true}}, "先知微微低下头。那是你在方舟上见过的，最深的一次鞠躬。",
          "The Farseer inclines her head. It is the deepest bow you've seen on the craftworld.")),
      C("“再看一次未来。为我。”", "“Read the future again. For me.”", "eld_704", {require: {stat: "renown", min: 35}}),
      C("“不。我受够了你的算术。”", "“No. I'm done with your arithmetic.”", "eld_706",
        E({sanity: 5, renown: -5}, "你转身就走。没人拦你，连符文石都停止了转动。",
          "You turn and leave. No one stops you. Even the rune-stones stop turning."))
    ]};

  N.eld_704 = {chapter: 7, scene: "craftworld", speaker: S("omen_farseer", "塔艾丝拉的符文", "Taethra's Runes"), time: {h: 3},
    text: L("先知第一次为一个猿人重新抛出符文。石头在半空停住，排成一条你看不懂的路。\n“有一根线，”她的声音有些哑，“那里，你不是一个人在黑暗里。有人在笑，有人捧着死者。”\n“很细。但它在。”",
            "For the first time, the Farseer casts her runes again for a mon-keigh. The stones halt mid-air in a pattern you can't read.\n“There is a thread,” she says, a little hoarse. “In it, you are not alone in the dark. Someone laughs. Someone carries the dead.”\n“It is thin. But it is there.”"),
    effects: {renown: 5, sanity: -5, set: {betterThread: true, bait: true}},
    choices: [
      C("“那就走那根线。”", "“Then we walk that thread.”", "eld_705")
    ]};

  N.eld_706 = {chapter: 7, scene: "craftworld", speaker: SYLVAEN, time: {h: 6},
    text: L("码头上，西尔凡在等你，船的引擎已经热好了。\n“最近的猿人世界，三天航程，”他说，“我欠你的。”\n他顿了顿：“但先知看见的那些未来里，你回去的……没有一个是好的。”",
            "At the docks Sylvaen is waiting, his ship's engines already warm.\n“The nearest mon-keigh world is three days out,” he says. “I owe you this.”\nA pause. “But of the futures the Farseer saw where you go back... none were kind.”"),
    choices: [
      C("登船回家", "Board, and go home", "eld_end_burned",
        E({sanity: 10}, "船离开塞卢纳时，你没有回头。你想象着一个有人叫你真名的地方。",
          "As the ship leaves Selunar you don't look back. You imagine a place where people call you by your real name.")),
      C("再想一晚", "Sleep on it one more night", "eld_705",
        E({sanity: -5, set: {bait: true}}, "你在码头坐到天亮。西尔凡一直陪着，一句话也没说。天亮时，你自己走回了水晶穹顶。",
          "You sit on the dock till dawn. Sylvaen stays, silent the whole time. At first light you walk back to the crystal dome on your own.")),
      C("回去找先知", "Go back to the Farseer", "eld_705",
        E({renown: 5, set: {bait: true}}, "西尔凡关掉了引擎。“我猜到了，”他说，“我在网道口等你。”",
          "Sylvaen shuts off the engines. “I guessed,” he says. “I'll wait for you at the webway gate.”"))
    ]};

  N.eld_705 = {chapter: 7, scene: "craftworld", speaker: S("omen_khaine", "凯恩的化身", "Avatar of Khaine"), time: {d: 2}, eventRoll: 0.42,
    text: L("出发前夜，方舟深处传来心跳。一位年轻的灵族走进铁铸的密室，再没出来。\n然后铁门熔化，一个燃烧的巨人走出来，手淌熔铁。整座方舟鸦雀无声。\n“凯恩的化身醒了，”艾拉瑞斯说，“这是战争。”",
            "The night before you leave, a heartbeat sounds deep in the craftworld. A young Aeldari walks into an iron chamber and does not come out.\nThen the iron door melts. A burning giant strides out, molten metal running from its hands, and the craftworld falls silent.\n“The Avatar of Khaine wakes,” says Ellaris. “This is war.”"),
    effects: {sanity: -5},
    codex: ["eld_khaine"],
    choices: [
      C("看着那个燃烧的巨人", "Watch the burning giant", "eld_707",
        E({renown: 5, sanity: -5}, "它从你身边走过，热浪烤干了你的眼泪。它没看你。它只看得见战争。",
          "It passes you; the heat dries your tears. It doesn't see you. It can see only war.")),
      C("去找艾拉瑞斯", "Go to Ellaris", "eld_707",
        E({hp: 10, sanity: 5, set: {charm: true}, taint: {all: -10}}, "艾拉瑞斯为你唱出一枚护身符，形状像麦穗。“灵骨记得你的歌，”他说，“它会替你记住回家的路。”",
          "Ellaris sings you a charm shaped like an ear of wheat. “Wraithbone remembers your song,” he says. “It will remember the way home for you.”"))
    ]};

  N.eld_707 = {chapter: 7, scene: "webway", speaker: TAETHRA, time: {h: 4},
    text: L("网道口。守护者列队，相位战士戴上了战面，燃烧的化身站在最前面。\n先知最后一次看你：“走进去，一直走。它会来。我封门的时候，不要回头。”\n“如果我回头了呢？”\n“那就是另一根线了。”",
            "The webway gate. Guardians in ranks, Aspect Warriors masked for war, the burning Avatar at the front.\nThe Farseer looks at you one last time. “Walk in, and keep walking. It will come. When I seal the gate, do not look back.”\n“And if I do?”\n“Then that is another thread.”"),
    choices: [
      C("走进网道", "Walk into the webway", "eld_801")
    ]};

  N.eld_end_burned = {chapter: 7, scene: "burning_city", speaker: S("inquisitor", "审判官", "Inquisitor"), time: {d: 20},
    text: L("你回到人类世界，讲了一切：灵族、网道、先知、那两个数字。\n审判官听得很仔细，记着笔记。\n“与异形同处逾年，”她合上本子，“灵魂已不可信。”\n第二天广场上点起火堆，人们唱着赞美帝皇的歌。",
            "You return to human space and tell them everything: the Aeldari, the webway, the Farseer, the two numbers.\nThe Inquisitor listens carefully, even takes notes.\n“Over a year among xenos,” she says, closing her book. “The soul cannot be trusted.”\nNext day a pyre is lit in the square, and the crowd sings praise to the Emperor."),
    codex: ["imp_inquisition"],
    ending: {kind: "bad", title: L("归乡之火", "Homecoming Pyre"), cause: L("被当作异形同谋烧死", "Burned as a xenos collaborator")}};

  /* ============ Chapter 8 · The Last Dance ============ */
  N.eld_801 = {chapter: 8, scene: "webway", speaker: null, time: {h: 5, warp: true},
    text: L("你独自走着。光墙一层层暗下去，空气越来越甜，甜得发腻。\n远处有音乐，不是丑角的——太完美了，每个音都落在你最想听的地方。\n你的口袋里，有什么在发热。",
            "You walk alone. The walls of light dim layer by layer; the air grows sweet, cloyingly sweet.\nFar off there is music—not the Harlequins'. Too perfect: every note lands exactly where you most want it.\nIn your pocket, something grows warm."),
    choices: [
      C("握住米瑞丝的灵魂石", "Hold Mireth's spirit stone", "eld_802", M(ONLY("carryStone"),
        E({sanity: 10, taint: {slaanesh: -10}}, "石头里有一声很轻的叹息，像米瑞丝在你耳边说：别回应叫你名字的东西。",
          "A faint sigh within the stone, as if Mireth whispers: don't answer anything that calls your name."))),
      C("握住那枚灵骨麦穗", "Hold the wraithbone wheat-ear", "eld_802", M(ONLY("charm"),
        E({sanity: 5, hp: 5}, "灵骨在你掌心哼起了收割歌，跑调跑得和你一模一样。",
          "The wraithbone hums the harvest song in your palm, off-key exactly the way you sang it."))),
      C("继续往前走", "Keep walking", "eld_802")
    ]};

  N.eld_802 = {chapter: 8, scene: "webway", speaker: DAEMON, foe: "greater_daemon_slaanesh", time: {h: 1},
    text: L("它从光里走出来，高得要仰头才看全。四只手臂，一张美得让人心碎的脸。\n“终于，”无餍者用妮尔的声音说，“一个干净的灵魂。没有石头，没有锁。”\n“我不要你的命。我只想给你想要的一切。”",
            "It steps out of the light, so tall you must crane your neck. Four arms, and a face so beautiful it breaks your heart.\n“At last,” says the Unsated, in Nell's voice. “A clean soul. No stone, no lock.”\n“I don't want your life. I only want to give you everything you want.”"),
    effects: {sanity: -8, corruption: 5, hp: -10},
    codex: ["eld_keeper_of_secrets", "eld_the_unsated"],
    choices: [
      C("听它说下去", "Let it go on", "eld_803"),
      C("“不。”", "“No.”", null,
        R(0.6, "sanity", "eld_804", "eld_803",
          "你说得很清楚。它的笑容停了一瞬，像一幅画裂了道缝。",
          "You say it clearly. Its smile stalls for an instant, like a crack across a painting.",
          "你张开嘴，说出来的却是：“……说下去。”",
          "You open your mouth, and what comes out is: “...Go on.”")),
      C("对着它大笑", "Laugh in its face", "eld_805", M({require: {flag: "harlequinFavor"}},
        E({renown: 5}, "你笑了，笑得像个傻子。四周的光里，传来另一个笑声，回应着你。",
          "You laugh like a fool. From the surrounding light, another laugh answers yours.")))
    ]};

  N.eld_803 = {chapter: 8, scene: "jungle", speaker: DAEMON, foe: "greater_daemon_slaanesh", time: {h: 1},
    text: L("它让你看：瓦尔达的麦田完好无损，妮尔长大了在门口等你，四千一百万人都活着。\n“只要你点头，”它温柔地说，“你就永远在那里。完美的，永远的。”\n你的心跳得很快。你从没这么想要过一样东西。",
            "It shows you: Valda's fields untouched; Nell grown, waiting at the door; forty-one million alive.\n“Only nod,” it says tenderly, “and you'll be there forever. Perfect. Forever.”\nYour heart races. You have never wanted anything so much."),
    effects: {corruption: 15, taint: {slaanesh: 25}},
    choices: [
      C("点头", "Nod", "eld_end_thirst"),
      C("“先让我尝一口。”", "“Just let me taste it first.”", "eld_803",
        E({corruption: 15, sanity: 10, taint: {slaanesh: 25}}, "一口就好。味道完美得让你发抖。它微笑着，又把盘子推近了一点。",
          "Just one bite. It tastes so perfect you tremble. Smiling, it nudges the plate a little closer.")),
      C("把灵魂石按在心口", "Press the spirit stone to your heart", "eld_804", M(ONLY("carryStone"),
        E({corruption: -15, sanity: 5, taint: {slaanesh: -15}}, "石头烫得像火。你听见米瑞丝在里面喊你的真名。麦田碎了，像一面镜子。",
          "The stone burns like fire. You hear Mireth inside it calling your true name. The wheat field shatters like a mirror."))),
      C("想起妮尔真正的样子", "Remember Nell as she really was", "eld_804",
        E({sanity: -12, renown: 3}, "真正的妮尔牙缝里塞着麦壳，数船总数错。这个完美的妮尔不会数错。你后退了一步。",
          "The real Nell had chaff in her teeth and always miscounted the ships. This perfect Nell never would. You step back."))
    ]};

  N.eld_804 = {chapter: 8, scene: "webway", speaker: null, foe: "greater_daemon_slaanesh", time: {h: 1},
    text: L("身后的网道口亮起符文，一道接一道，像有人一页页合上一本书。先知在封门。\n大魔察觉了陷阱。它尖啸着扑过来，四只手同时伸向你。\n门只剩一道缝。你还在门里。",
            "Behind you runes ignite at the webway gate, one after another, like someone closing a book page by page. The Farseer is sealing it.\nThe daemon sees the trap. Shrieking, it lunges, all four hands reaching.\nThe gate is down to a sliver. You are still on the wrong side."),
    effects: {hp: -20},
    choices: [
      C("冲向那道缝", "Run for the gap", null,
        R(0.45, "hp", "eld_806", "eld_end_sealed",
          "你扑过门缝，后背一凉，一只手擦着你抓了个空。门在身后合上，轻轻“咔”的一声。",
          "You dive through the gap; something cold brushes your back as a hand closes on nothing. The gate shuts behind you with a soft click.",
          "那只手比你快。你被拽回去的瞬间，看见门缝合拢，先知的脸消失在另一边。",
          "The hand is faster. As you're dragged back, you see the gap close and the Farseer's face vanish on the other side.")),
      C("站住，相信那根线", "Stand still. Trust the thread.", "eld_806", M({require: {stat: "renown", min: 45}},
        E({renown: 5}, "你闭上眼。一根看不见的线勒住你的腰，猛地一拽——你飞过门缝，摔在先知脚边。",
          "You close your eyes. An unseen thread cinches your waist and yanks—you fly through the gap and land at the Farseer's feet."))),
      C("呼唤恩灵", "Call on Ynnead", "eld_807", ONLY("ynnari")),
      C("寻找那个笑声", "Listen for the laughter", "eld_805", ONLY("betterThread"))
    ]};

  N.eld_805 = {chapter: 8, scene: "webway", speaker: DANCER, foe: "greater_daemon_slaanesh", time: {h: 1},
    text: L("光墙裂开，一队丑角翻着跟头涌进来，衣服的颜色每一步都在变。\n他们围着大魔起舞，学它的动作，更美、更快，还冲它做鬼脸。\n大魔被激怒，追着他们撞进封印。镜面舞者伸手：“该跑了，观众。”",
            "The walls split and a whole troupe of Harlequins tumbles in, colours shifting with every step.\nThey dance around the daemon, mimicking every move, lovelier and faster, pulling faces at it.\nEnraged, it chases them headlong into the seal. The mirror-masked dancer offers you a hand. “Time to run, audience.”"),
    codex: ["eld_harlequins", "eld_laughing_god"],
    choices: [
      C("跟着剧团走", "Go with the troupe", "eld_end_masque",
        RS("你握住那只手。下一步，你已经在另一条走廊里，身后的尖啸像落幕的掌声。",
           "You take the hand. One step later you're in another corridor, the shriek behind you like curtain-call applause.")),
      C("回到先知那边", "Return to the Farseer", "eld_806")
    ]};

  N.eld_806 = {chapter: 8, scene: "craftworld", speaker: TAETHRA, time: {h: 6},
    text: L("封印合上了。网道深处，大魔的尖啸越来越远，最后变成一段听不清的歌。\n先知站在你面前，看了你很久。\n“线还在，”她说。然后她做了一件从没做过的事——问你：“你想去哪里？”",
            "The seal is closed. Deep in the webway the daemon's shriek recedes until it's only a song you can't make out.\nThe Farseer stands before you, looking at you a long time.\n“The thread holds,” she says. Then she does something she has never done. She asks: “Where do you wish to go?”"),
    effects: {sanity: 10, renown: 10},
    choices: [
      C("“伊尔达涅斯。去种地。”", "“Ildaneth. To farm.”", "eld_end_maiden"),
      C("“留在塞卢纳，跟艾拉瑞斯学唱歌。”", "“Here. Let Ellaris teach me to sing.”", "eld_end_guest"),
      C("“回家。回人类那边。”", "“Home. Back to humanity.”", "eld_end_burned",
        RS("先知沉默了很久，最后只说：“我会为你备船。”她没有看你的眼睛。",
           "The Farseer is silent a long time. At last she says only, “I will ready a ship.” She doesn't meet your eyes.")),
      C("“去找恩灵派。”", "“To the Ynnari.”", "eld_end_ynnari", ONLY("ynnari"))
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
    text: L("三年后，伊尔达涅斯河边多了一块麦田，是一个猿人种的。流亡者的孩子管它叫“会哭的人的田”。\n你教他们唱收割歌。他们唱得比你还难听。\n有时先知会来，站在田埂上，什么也不说，只看着麦子。",
            "Three years on, a wheat field grows by Ildaneth's river, planted by a mon-keigh. The Exodite children call it “the field of the one who cries.”\nYou teach them the harvest song. They sing it even worse than you.\nSometimes the Farseer visits, stands at the field's edge, says nothing, and watches the wheat."),
    ending: {kind: "good", title: L("处女世界的麦田", "Wheat on a Maiden World"), cause: L("在伊尔达涅斯种麦", "Farming on Ildaneth")}};

  N.eld_end_guest = {chapter: 8, scene: "craftworld", speaker: ELLARIS, time: {y: 5},
    text: L("五年后，塞卢纳空荡的街区里，有一面墙是一个猿人唱好的。裂缝合得歪歪扭扭，可它不再漏光了。\n艾拉瑞斯说，你永远成不了灵骨歌者。\n他说这话时，正在教你下一首歌。",
            "Five years on, in one of Selunar's empty districts, there is a wall a mon-keigh sang whole. The crack healed crooked, but it no longer leaks light.\nEllaris says you will never be a Bonesinger.\nHe says it while teaching you the next song."),
    ending: {kind: "good", title: L("会唱歌的客人", "The Guest Who Sings"), cause: L("留在方舟学唱灵骨", "Stayed to sing wraithbone")}};

  N.eld_end_ynnari = {chapter: 8, scene: "webway", speaker: S("omen_ynnead", "恩灵派", "The Ynnari"), time: {y: 1, warp: true},
    text: L("你跟着恩灵派走遍了网道。他们叫你“活着的那个”，因为你是队伍里唯一还会变老的人。\n伊芙蕾恩远远地看过你一眼，点了点头。\n你胸前的骷髅里，偶尔有一个声音在吹口哨。是你教的。",
            "You walk the webway with the Ynnari. They call you “the living one,” since you're the only one among them who still ages.\nYvraine glances at you once from afar, and nods.\nIn the skull on your chest, a voice sometimes whistles. You taught her that."),
    ending: {kind: "good", title: L("死者的同行人", "Companion of the Dead"), cause: L("随恩灵派同行", "Walks with the Ynnari")}};

  N.eld_end_masque = {chapter: 8, scene: "webway", speaker: DANCER, time: {y: 7, warp: true},
    text: L("丑角剧团多了一个观众，后来又多了一个角色：一个永远演不好的猿人。\n每次《陨落》演到结尾，都由你在黑暗里笑出第一声。\n有人说，欢笑之神本人来看过一场，笑得最响的就是他。",
            "The Harlequin troupe gains an audience member, then a role: a mon-keigh who never quite gets it right.\nEvery time The Fall reaches its end, you're the one who laughs first in the dark.\nThey say the Laughing God himself attended once, and laughed the loudest."),
    ending: {kind: "good", title: L("欢笑之神的观众", "The Laughing God's Audience"), cause: L("随丑角剧团远行", "Joined the Harlequins")}};

  N.eld_end_thirst = {chapter: 8, scene: "jungle", speaker: DAEMON, time: {y: 1, warp: true},
    text: L("你点了头。瓦尔达的麦田在你周围展开，完美无缺，妮尔在门口等你。\n你进门，坐下，吃饭。每一顿都一样完美。\n每一天都一样。你想停下，却想不起该怎么停。很远的地方，有什么正吃得很开心。",
            "You nod. Valda's fields unfold around you, flawless; Nell waits at the door.\nYou go in, sit down, eat. Every supper is just as perfect.\nEvery single day. You want to stop, but can't remember how. Far away, something is feasting happily."),
    ending: {kind: "bad", title: L("完美的晚餐", "The Perfect Supper"), cause: L("灵魂被色孽吞噬", "Soul devoured by Slaanesh")}};

  N.eld_end_sealed = {chapter: 8, scene: "webway", speaker: null, foe: "greater_daemon_slaanesh", time: {d: 1, warp: true},
    text: L("门合上了。另一边，先知垂下眼睛，在符文上划掉一根线。\n你和大魔一起被封在网道里。它不急，它有的是时间；你会慢慢变得不那么干净。\n方舟上没人为猿人唱歌，只有一片灵骨偶尔哼起跑调的收割歌。",
            "The gate closes. On the other side the Farseer lowers her eyes and strikes a thread from her runes.\nYou are sealed in the webway with the daemon. It's in no hurry; it has all the time there is, and you will grow less clean.\nOn the craftworld no one sings for a mon-keigh. Only a sliver of wraithbone sometimes hums an off-key harvest song."),
    ending: {kind: "bad", title: L("封印之内", "Behind the Seal"), cause: L("为先知的幻象献祭", "Sacrificed for a vision")}};

  /* ============ Claim endings (SPEC §19): a Chaos god's claim, accepted or forced. Reached via the claim events' goto. ============ */
  N.eld_end_claim_khorne = {scene: "webway", speaker: S("daemon_khorne", "铁与火的轰鸣", "Roar of Iron and Fire"), time: {d: 30, warp: true},
    text: L("你心里那张战面再也摘不下来了。灵族有道途约束杀意，你没有。\n守护者把你送出了网道。你一路杀进黑暗，没回过头。\n凯恩的怒火属于灵族。你的，被另一位神接住了。他不讲道途，只要头骨。",
            "The war-mask in your heart will not come off. The Aeldari have their Paths to cage the urge to kill. You have none.\nThe guardians see you out of the webway. You fight your way into the dark and never look back.\nKhaine's rage belongs to the Aeldari. Yours was caught by another god. He keeps no Paths. He wants skulls."),
    codex: ["god_khorne"],
    ending: {kind: "bad", title: L("摘不下的战面", "The Mask That Stays"), cause: L("被恐虐收走", "Claimed by Khorne")}};

  N.eld_end_claim_nurgle = {scene: "maiden_world", speaker: S("daemon_nurgle", "园丁", "The Gardener"), time: {y: 3},
    text: L("你的伤口不再愈合，却开出了花。灵骨歌者的歌，在你身边一首首走了调。\n灵族把你送到一颗无人的星球，留下一袋种子，走得远远的。\n你在那里种出一座园子。苍蝇来了，园丁也来了。他说你种得真好。",
            "Your wounds no longer heal; they bloom. Near you, the bonesingers' songs go out of tune one by one.\nThe Aeldari leave you on an empty world with a bag of seeds, and keep far away.\nThere you grow a garden. The flies come, and then the Gardener. He says you've done beautifully."),
    codex: ["god_nurgle"],
    ending: {kind: "bad", title: L("被流放的园丁", "The Exiled Gardener"), cause: L("成为纳垢的园丁", "Became Nurgle's gardener")}};

  N.eld_end_claim_tzeentch = {scene: "webway", speaker: S("daemon_tzeentch", "多出来的命运线", "The Extra Thread"), time: {d: 90, warp: true},
    text: L("你看见的命运线越来越多，比先知还多。你开始悄悄拨动其中几根。\n先知发现时，已有三条线因你而断。她第一次在你面前失了态。\n你笑了。拨线的从来不是你，是一个比所有先知都更爱计划的东西。",
            "You see more fate-threads every day, more than the seers. You begin quietly plucking a few.\nBy the time the Farseer notices, three threads have snapped because of you. For the first time she loses her composure before you.\nYou laugh. It was never you plucking them. It was something that loves plans more than any seer."),
    codex: ["god_tzeentch"],
    ending: {kind: "bad", title: L("拨线的手", "The Hand on the Threads"), cause: L("沦为奸奇的棋子", "Became Tzeentch's pawn")}};

  N.eld_end_claim_slaanesh = {scene: "craftworld", speaker: S("greater_daemon_slaanesh", "渴求者", "She Who Thirsts"),
    text: L("那个梦再也不醒了：瓦尔达的麦田，妮尔在门口喊你吃饭，一切都刚刚好。\n灵族发现你时，你坐着微笑，灵魂早已不在，没有灵魂石接住它。\n渴求者饿了一万年。一个猿人的灵魂，只是饭前的甜点。",
            "The dream never ends now: Valda's wheat, Nell calling you in to eat, everything just right.\nWhen the Aeldari find you, you are sitting still and smiling, your soul long gone. No spirit stone caught it.\nShe Who Thirsts has hungered for Aeldari souls for ten thousand years. A mon-keigh soul is a sweet before the meal."),
    codex: ["god_slaanesh"],
    ending: {kind: "bad", title: L("饭前的甜点", "A Sweet Before the Meal"), cause: L("灵魂被色孽吞噬", "Soul devoured by Slaanesh")}};

  /* ============ Death nodes (engine-triggered) ============ */
  N.eld_death_hp = {scene: "webway", speaker: null,
    text: L("你倒下了。灵族们停下脚步，低头看了你一会儿，很有礼貌。\n没有灵魂石接住你。你的灵魂升起来，又亮又干净，像一盏灯，被远处某个很饿的东西看见了。\n先知在符文上，轻轻划掉了一根线。",
            "You fall. The Aeldari pause and look down at you a moment, politely.\nNo spirit stone catches you. Your soul rises, bright and clean as a lamp, and something very hungry far away notices it.\nOn her runes, the Farseer gently strikes out a thread."),
    ending: {kind: "death", title: L("断线", "A Severed Thread"), cause: L("伤重而死，灵魂无依", "Died of wounds, soul unguarded")}};

  N.eld_death_sanity = {scene: "craftworld", speaker: null,
    text: L("你开始听见墙里所有的声音，一万个死去的灵族同时说话，你一个也挡不住。\n你给每个声音起了名字，日夜和他们聊天。\n灵族把你送进一间安静的房间，天花板很矮，按猿人规格。",
            "You begin to hear every voice in the walls, ten thousand dead Aeldari speaking at once, and you can shut out none of them.\nYou name each voice and talk with them day and night.\nThe Aeldari place you in a quiet room with a low ceiling, built to mon-keigh specifications."),
    ending: {kind: "death", title: L("墙里的客人", "Guest of the Walls"), cause: L("理智崩溃", "Mind shattered")}};

  N.eld_death_corruption = {scene: "daemon_world", speaker: S("sigil_slaanesh", "渴求者", "She Who Thirsts"),
    text: L("你想要的越来越多，多到身体装不下。\n你的皮肤开始发光，声音甜得像音乐。守护者们举起了枪，眼里没有恨，只有怜悯。\n在他们开枪之前，很远的地方，有什么东西先一步把你喝干了。",
            "You want more and more, more than a body can hold.\nYour skin begins to glow; your voice turns sweet as music. The Guardians raise their rifles, eyes holding no hatred, only pity.\nBefore they fire, something very far away drinks you dry."),
    ending: {kind: "death", title: L("被饮尽", "Drunk Dry"), cause: L("被色孽之欲吞没", "Consumed by Slaanesh's hunger")}};

  /* ============ Route-specific events (SPEC §12: 1–2 per route) ============ */
  function O(zh, en, effects, rzh, ren) { return {text: {zh: zh, en: en}, effects: effects, result: {zh: rzh, en: ren}}; }
  WH.registerEvents([
    {id: "evt_eld_mirror", god: "slaanesh", factions: ["aeldari"], minChapter: 4,
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
