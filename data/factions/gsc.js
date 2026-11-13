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
  /* SPEC §32.2 conditional text: ALT replaces the node text, ADD appends a line; RA = resultAlt entry */
  function ALT(cond, zh, en) { return {if: cond, text: {zh: zh, en: en}}; }
  function ADD(cond, zh, en) { return {if: cond, add: {zh: zh, en: en}}; }
  function RA(cond, zh, en) { return {if: cond, text: {zh: zh, en: en}}; }
  function F(x) { return {flag: x}; }
  function NF(x) { return {notFlag: x}; }
  function FN(ids) { return {fromNode: [].concat(ids)}; }
  function AF(list) { return {anyFlag: list}; }
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
      C("去最深的掌子面，那里给双倍工分", "Take the deep face. Double tally", "gsc_102b", X({hp: -5, renown: 2, set: {deepFace: true}, taint: {nurgle: 40}},
        "深处的空气又湿又甜，吸进去像喝了一口温水。提奥的班组去了浅巷道，最深处只剩你一个人。",
        "The deep air is damp and sweet, like a mouthful of warm water. Teo's crew takes the shallow gallery; at the bottom it's only you.")),
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

  N.gsc_102b = {chapter: 1, scene: "mine_shaft", speaker: null, time: {h: 6},
    text: L("最深的掌子面上只有你。头顶一声长长的呻吟，灯光一晃，整条巷道塌了下来。\n你被卡在两块石头中间，腿动不了，空气越来越甜。\n很远的地方，浅巷道那边，好像有人在喊你的名字。",
            "At the deepest face it is only you. A long groan overhead, a jolt of lamplight, and the whole gallery comes down.\nYou're pinned between two stones, legs stuck, the air growing sweeter.\nFar off, from the shallow gallery, someone seems to be calling your name."),
    choices: [
      C("用扳手敲水管求救", "Bang on the water pipe with your spanner", "gsc_103", X({hp: -6, set: {knocked: true}},
        "你敲了几百下，手掌磨出了血。终于，管子那头也传来三下回敲。",
        "You strike it hundreds of times until your palms bleed. At last, three knocks answer from the far end.")),
      C("关掉灯，省着空气等", "Kill the lamp and save your air", "gsc_103", X({sanity: -6, set: {waitedDark: true}},
        "黑暗里你数着自己的心跳。后来石头被搬开时，来的人一盏灯也没带。",
        "In the dark you count your heartbeats. When the stones are finally lifted, the people who come carry no lamps at all."))
    ]};

  N.gsc_103 = {chapter: 1, scene: "mine_shaft", speaker: JORY, time: {h: 9},
    alt: [ADD(F("savedTeo"), "提奥躺在你旁边的担架上，手还攥着你的手腕。", "Teo lies on the stretcher beside you, still gripping your wrist."),
          ADD(F("knocked"), "领头的是提奥：“听见管子响，我们从浅巷道一路挖过来的。”", "Teo leads them. “Heard the pipe. We dug across from the shallow gallery.”"),
          ADD(F("waitedDark"), "他们挖了一整夜，从头到尾没有一个人点灯。", "They dig all night, and not one of them lights a lamp.")],
    text: L("不知过了多久，石头被一块块搬开。\n是霍林家的表兄弟们，戴着兜帽，脸色苍白，抬起横梁像抬木板。\n其中一个朝你伸出手。那只手，比人的手长了一截。",
            "After who knows how long, the stones are lifted away one by one.\nThe Hollin cousins: hooded, pale, lifting beams like planks.\nOne reaches a hand down to you. The hand is a little too long."),
    effects: {hp: -5},
    choices: [
      C("握住那只手", "Take the hand", "gsc_105", X({renown: 5, set: {tookHand: true}},
        "那只手很稳，很暖。“别怕，”兜帽下的声音说，“我叫乔里。我们照顾自己人。”",
        "The hand is steady and warm. “Easy,” says the voice under the hood. “I'm Jory. We look after our own.”")),
      C("自己爬出来", "Climb out on your own", "gsc_105", X({hp: -5, sanity: 3, set: {climbedAlone: true}},
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
      C("对提奥一言不发，转身走开", "Say nothing to Teo and walk away", "gsc_104b", X({sanity: -5, set: {wronged_teo: true}},
        "提奥还在等你开口。你把他丢在塌方里，现在连一句话也不肯给。那一夜你睡不着，耳朵里全是落石声。",
        "Teo waits for you to speak. You left him in the rockfall, and now you won't give him a word. You don't sleep; your ears are full of falling stone."))
    ]};

  N.gsc_104b = {chapter: 1, scene: "mine_shaft", speaker: JORY, time: {d: 7},
    text: L("整整一个星期，提奥的班组没人跟你说话。下井没人帮你推矿车，收工没人等你。\n只有一个戴兜帽的表兄，有一天在升降口塞给你一壶水。\n“我叫乔里，”他说，“提奥会想通的。家里人都会。”",
            "For a whole week no one on Teo's crew speaks to you. Nobody helps with your cart; nobody waits at shift's end.\nOnly one hooded cousin, one day at the lift-head, pushes a water flask into your hands.\n“I'm Jory,” he says. “Teo will come round. Family always does.”"),
    effects: {hp: -5},
    choices: [
      C("接过水壶", "Take the flask", "gsc_105", X({sanity: 3},
        "水是凉的，壶是暖的，像一直揣在谁的怀里。",
        "The water is cold; the flask is warm, as if carried against someone's chest."))
    ]};

  N.gsc_105 = {chapter: 1, scene: "hive_hab", speaker: GANT, time: {d: 2}, codex: ["imp_imperium"],
    text: L("工棚墙上贴出新告示：什一税上调，口粮减半，医官下个月才来。几十个矿工挤在铺位间看。\n甘特工头敲着告示板：“嫌少？星区里想要这份工的人多得是。”\n有人咳嗽。没人说话。",
            "A new notice goes up on the barracks wall: tithe raised, rations halved, the medic not due till next month. Dozens of miners crowd between the bunks to read it.\nForeman Gant raps the board. “Not enough? Half the sector would take this job.”\nSomeone coughs. Nobody speaks."),
    choices: [
      C("一拳砸烂告示板", "Smash the notice board", "gsc_105a", X({hp: -8, renown: 5, set: {protested: true, smashedBoard: true}, taint: {khorne: 45}},
        "木板碎了，你的指节也破了。执法官把你按在地上。人群里，几个戴兜帽的人记住了你的脸。",
        "The board splinters, and so do your knuckles. Enforcers pin you down. In the crowd, a few hooded faces remember yours.")),
      C("替咳嗽的老工友说句话", "Speak up for the coughing old miner", "gsc_106", O(X({renown: 4, sanity: -3, set: {protested: true, ganttMarked: true}},
        "甘特把你的名字写进本子里。散工后，提奥拍了拍你的背：“你是个好人。家里人会喜欢你。”",
        "Gant writes your name in his book. After shift Teo claps your back. “You're a good one. The family will like you.”"),
        {resultAlt: [RA(F("wronged_teo"), "甘特把你的名字写进本子里。散工后，提奥远远看了你一眼，没过来，也没走开。",
                       "Gant writes your name in his book. After shift Teo looks at you from a distance. He doesn't come over, and he doesn't leave.")]})),
      C("低头，什么也不说", "Keep your head down", "gsc_106", X({sanity: -5, set: {headDown: true}},
        "你低着头回到铺位。那一晚的口粮，只有半块。",
        "You go back to your bunk with your head down. Supper is half a bar."))
    ]};

  N.gsc_105a = {chapter: 1, scene: "underhive", speaker: VASK, time: {h: 3},
    alt: [ALT(F("wronged_teo"), "执法分局的禁闭室。瓦斯克执法官隔着铁栏看你，像在记一张脸。\n“砸告示板，罚十天工分，”他说，“下回砸的就是你的手。”\n天亮放你出来。门口站着提奥，脸还是冷的，手里却拿着一块热面包。",
            "A cell in the enforcer precinct. Enforcer-Captain Vask studies you through the bars, as if filing a face.\n“Smashing notices. Ten days' tally,” he says. “Next time it's your hands.”\nAt dawn they let you out. Teo is at the door, face still cold, a warm roll in his hand all the same.")],
    text: L("执法分局的禁闭室。瓦斯克执法官隔着铁栏看你，像在记一张脸。\n“砸告示板，罚十天工分，”他说，“下回砸的就是你的手。”\n天亮放你出来。门口站着提奥，手里拿着一块热面包。",
            "A cell in the enforcer precinct. Enforcer-Captain Vask studies you through the bars, as if filing a face.\n“Smashing notices. Ten days' tally,” he says. “Next time it's your hands.”\nAt dawn they let you out. Teo is waiting at the door with a warm roll."),
    effects: {set: {vaskKnows: true}},
    choices: [
      C("跟着提奥走", "Walk off with Teo", "gsc_106", O(X({renown: 3},
        "提奥什么也没问，只把面包掰了一半给你。“霍林家的人在分局有朋友，”他说，“不然你得关三天。”",
        "Teo asks nothing, only breaks the roll in half for you. “The Hollins have friends at the precinct,” he says. “Else it'd be three days.”"),
        {resultAlt: [RA(F("wronged_teo"), "提奥把面包掰了一半塞给你，转身走在前面。“霍林家在分局有朋友，”他头也不回，“不然你得关三天。”",
                       "Teo shoves half the roll at you and walks on ahead. “The Hollins have friends at the precinct,” he says without turning. “Else it'd be three days.”")]}))
    ]};

  N.gsc_106 = {chapter: 1, scene: "hive_hab", speaker: TEO, time: {d: 2},
    alt: [ALT(F("wronged_teo"), "又过了几天，提奥在升降口拦住你，脸还是冷的。\n“大娘让我来的，”他把一块面包塞给你，“星期天去霍林家吃饭。她做饭，从来多做一份。”\n他转身就走。可面包是热的。",
            "A few days later Teo stops you at the lift-head, his face still cold.\n“Ma sent me.” He pushes a roll into your hands. “Supper at the Hollin house, Sunday. She always cooks for one more.”\nHe walks off. But the roll is warm."),
          ADD(F("headDown"), "“我看见你低头了，”他说，“低头的人，最该有人请吃饭。”", "“I saw you keep your head down,” he says. “People who do that most need a supper.”")],
    text: L("提奥塞给你一块热乎乎的面包。\n“星期天来霍林家吃饭吧。奥莎大娘做饭，从来都多做一份。”\n他笑起来眼角有很深的纹路，像个好人，也确实是个好人。",
            "Teo presses a warm roll into your hands.\n“Come to the Hollin house on Sunday. Ma Ossa always cooks for one more.”\nHe has deep creases at the eyes when he smiles. He looks like a good man. He is one."),
    choices: [
      C("“我去。”", "“I'll come.”", "gsc_107", X({renown: 3},
        "提奥点点头。“大娘会喜欢你的，”他说，“大家都会。”",
        "Teo nods. “Ma will like you,” he says. “Everyone will.”")),
      C("“我一个人惯了。”", "“I'm used to being alone.”", "gsc_107", X({sanity: -5, set: {lateGuest: true}},
        "你一个人过了那个星期天，嚼着冷口粮，听隔壁传来歌声。下个星期天，你还是去了。",
        "You spend that Sunday alone with cold rations, listening to singing through the wall. The next Sunday, you go."))
    ]};

  N.gsc_107 = {chapter: 1, scene: "hive_hab", speaker: OSSA, time: {d: 4}, gather: L("霍林家", "Hollin house"),
    alt: [ADD(F("lateGuest"), "“上星期给你留的位子，一直空着，”大娘说，又多盛了一勺。", "“Your place sat empty last week,” Ma says, and ladles you extra."),
          ADD(F("smashedBoard"), "她捏着你砸破的指节看了看：“手是用来干活的。”", "She turns your split knuckles in her fingers. “Hands are for work.”"),
          ADD(F("climbedAlone"), "“听说你不让人扶，”她笑，“在这儿可由不得你。”", "“I hear you won't be helped,” she laughs. “Not in this house.”")],
    text: L("霍林家又挤又暖，三代人，几十张脸，汤锅冒着热气。\n奥莎大娘给你包扎身上的伤，手法比医官还好。\n墙上挂着一幅帝皇像。画里的帝皇，有四只手臂。",
            "The Hollin house is crowded and warm: three generations, dozens of faces, a steaming pot.\nMa Ossa dresses your hurts, better than any medic.\nOn the wall hangs a picture of the Emperor. In it, the Emperor has four arms."),
    codex: ["gsc_four_armed", "place_hollin_house"],
    choices: [
      C("问那幅画的事", "Ask about the painting", "gsc_108", X({renown: 3, set: {askedIcon: true}},
        "“两只手不够抱住所有人，”大娘说，“真正的帝皇，手够用。”满屋子的人都笑着点头。",
        "“Two arms aren't enough to hold everyone,” Ma says. “The true Emperor has arms enough.” The whole room smiles and nods.")),
      C("埋头喝汤", "Just eat the soup", "gsc_108", X({hp: 10},
        "汤很浓，有肉。你已经记不起上一次吃肉是什么时候。大娘又给你添了一碗。",
        "The soup is thick, with meat in it. You can't remember the last time you ate meat. Ma refills your bowl.")),
      C("饭前向帝皇祷告", "Say grace to the Emperor", "gsc_108", X({renown: 3, sanity: 3, set: {prayedFirst: true}},
        "大家都跟着你低头祷告。只是他们念的帝皇，好像和你念的不太一样。",
        "Everyone bows their head with you. Only, the Emperor they name doesn't sound quite like yours."))
    ]};

  N.gsc_108 = {chapter: 1, scene: "hive_hab", speaker: JORY, time: {h: 4},
    alt: [ADD(F("tookHand"), "“塌方那天你握过我的手，”他说，“没几个人敢握。”", "“You took my hand in the cave-in,” he says. “Not many dare.”")],
    text: L("乔里表哥送你回工棚。路灯下，他的影子有三只手臂。\n他察觉你在看，也不躲：“生来就这样。帝皇的礼物。”\n“下星期再来，”他说，“我们照顾自己人。”",
            "Cousin Jory walks you back to the barracks. Under the streetlamp, his shadow has three arms.\nHe notices you looking and doesn't hide it. “Born this way. A gift of the Emperor.”\n“Come again next week,” he says. “We look after our own.”"),
    choices: [
      C("“我会来的。”", "“I'll be there.”", "gsc_201", X({renown: 5, set: {promisedJory: true}},
        "乔里用第三只手拍了拍你的肩。很轻，像怕把你碰坏。",
        "Jory pats your shoulder with his third hand. Very gently, as if afraid to break you.")),
      C("加快脚步，不回答", "Walk faster without answering", "gsc_201", X({sanity: -5, set: {shunnedJory: true}},
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

  N.gsc_o_warden_2 = {chapter: 1, scene: "mine_shaft", speaker: MARR, time: {d: 2}, gather: L("井口", "Pithead"),
    text: L("母亲带你下矿问话。井口围了一圈矿工，交班的人也从升降笼里出来看热闹，谁也不开口。\n一个苍白的小女孩站在人群后面看着你，眼睛在灯下有点发紫。\n有人轻轻把她拉走了。",
            "Your mother takes you down to ask questions. At the pithead the miners close ranks; the off-shift men climb out of the cage to watch. Nobody talks.\nA pale little girl watches you from behind them, her eyes faintly violet in the lamplight.\nSomeone gently draws her away."),
    choices: [
      C("朝那个女孩笑一笑", "Smile at the girl", "gsc_o_warden_3", X({renown: 4, set: {smiledWren: true}},
        "女孩也笑了。人群似乎松动了一点，有个老矿工给你们倒了杯水。",
        "The girl smiles back. The crowd seems to ease a little; an old miner pours you both water.")),
      C("记下所有人的脸", "Memorise every face", "gsc_o_warden_3", X({sanity: -3, renown: -3, set: {pattern: true}},
        "你记下了四十多张脸。有十几张，长得很像，像一家人。",
        "You memorise forty-odd faces. A dozen of them look alike. Like one family."))
    ]};

  N.gsc_o_warden_3 = {chapter: 1, scene: "hive_hab", speaker: OSSA, time: {d: 9}, jump: L("九天后，罢工", "Nine days later, the strike"),
    text: L("九天后，矿上罢工，母亲在冲突里被铁棍砸伤，血止不住。医官要下个月才来。\n是奥莎大娘救了她。老太太手很稳，一句话也没多问。\n“警长也是人，”她说，“人都要有人照顾。”",
            "Nine days later a strike turns ugly; an iron bar opens your mother's head and the bleeding won't stop. The medic isn't due till next month.\nMa Ossa saves her. The old woman's hands are steady, and she asks nothing.\n“A sergeant is people too,” she says. “People need looking after.”"),
    effects: {sanity: -6},
    codex: ["place_hollin_house"],
    choices: [
      C("握住大娘的手道谢", "Take Ma's hand and thank her", "gsc_o_warden_4", X({renown: 6, sanity: 3, set: {ossaInvite: true}},
        "她的手粗糙又温暖。“星期天来吃饭吧，”她说，“带上你母亲，等她好了。”",
        "Her hand is rough and warm. “Come to supper Sunday,” she says. “Bring your mother, once she's well.”")),
      C("问她怎么懂得这么多", "Ask how she knows so much", "gsc_o_warden_4", X({sanity: -3, set: {ossaWary: true}},
        "“活得久，见得多。”她笑着说。屋里所有人都跟着笑了，笑声齐得像排练过。",
        "“Live long, see plenty,” she laughs. Everyone in the room laughs with her, in unison, as if rehearsed."))
    ]};

  N.gsc_o_warden_4 = {chapter: 1, scene: "underhive", speaker: VASK, time: {d: 20}, jump: L("二十天后，母亲刚能下床", "Twenty days on, your mother barely up"),
    text: L("母亲刚能下床，瓦斯克执法官就把你叫进办公室。“你母亲欠霍林家一条命，正好。”\n“去九号矿井当矿工，去吃他们的饭，告诉我他们在干什么。”\n“别告诉你母亲。”",
            "Your mother is barely on her feet when Enforcer-Captain Vask calls you into his office. “Your mother owes the Hollins a life. Convenient.”\n“Go down Shaft Nine as a miner. Eat their food. Tell me what they're up to.”\n“Don't tell your mother.”"),
    effects: {sanity: -5},
    choices: [
      C("接下任务", "Take the assignment", "gsc_201", X({renown: -2, set: {vaskAgent: true}},
        "你换上矿工的工装，把执法局的证件锁进了柜子。",
        "You put on miner's overalls and lock your precinct papers in a drawer.")),
      C("接下任务，但告诉母亲", "Take it, but tell your mother", "gsc_201", X({sanity: 3, set: {vaskAgent: true, toldMarr: true}},
        "母亲沉默了很久。“吃他们的饭，”她最后说，“但别忘了自己是谁。”",
        "Your mother is silent a long time. “Eat their food,” she says at last. “But remember who you are.”"))
    ]};

  /* ---------- Origin prologue · Brood-born (fourth generation, passes as human) ---------- */
  N.gsc_o_kin_1 = {chapter: 1, scene: "gsc_chapel", speaker: MOTHER,
    text: L("你生在霍林家。母亲头巾下是带着骨棱的头皮，她是第三代。\n你生出来时，一点也不像她。家里人叫你“素脸的孩子”，说这是最大的福分。\n你十岁那年，主祭摸着你的头说：“你能走在他们中间。”",
            "You were born in the Hollin house. Under her headscarf your mother's scalp is smooth and ridged; she is third generation.\nYou came out looking nothing like her. The family calls you “the plain one” and says it is the greatest blessing.\nWhen you are ten, the Magus touches your head: “You will walk among them.”"),
    codex: ["place_kessin", "place_hollin_house", "gsc_generations"],
    choices: [
      C("在圣像前跪下", "Kneel before the icon", "gsc_o_kin_2", X({renown: 4, corruption: 2, set: {devout: true}},
        "四臂帝皇在烛光里看着你。你脑子里那阵温暖的嗡鸣，从小就在，今天格外响。",
        "The Four-Armed Emperor watches you by candlelight. The warm hum in your head, there since childhood, is loud today.")),
      C("帮母亲把头巾系好", "Help your mother tie her scarf", "gsc_o_kin_2", X({sanity: 4, set: {motherWarned: true}},
        "她握住你的手。“出门在外，”她轻声说，“别让人看见你回头找我。”",
        "She holds your hand. “Out there,” she says softly, “don't let them see you look back for me.”"))
    ]};

  N.gsc_o_kin_2 = {chapter: 1, scene: "manufactorum", speaker: null, time: {y: 6}, jump: L("六年后，你十六岁", "Six years later; you are sixteen"), gather: L("计数室", "Tally office"),
    text: L("六年后，你十六岁，在矿务署计数室当文书。十几个文书挤在一屋抄账，没人看得出你是什么。\n同事笑九号矿井是“怪胎窝”。你低头抄账，指节发白。\n脑子里的嗡鸣变尖了，像一大家子人一起皱眉。",
            "Six years on, at sixteen, you clerk in the ore tally office. A dozen clerks share one room of ledgers, and nobody can tell what you are.\nA colleague jokes that Shaft Nine is a “freak nest.” You keep copying figures, knuckles white.\nThe hum in your head sharpens, like a whole family frowning at once."),
    choices: [
      C("忍着，继续抄账", "Bear it. Keep copying", "gsc_o_kin_3", X({sanity: -5, renown: 2},
        "你忍到下班。回家时，母亲已经知道了，什么也没说，只给你热了汤。",
        "You hold out till the shift ends. At home your mother already knows. She says nothing, only warms your soup.")),
      C("看着他的眼睛，让他闭嘴", "Look him in the eye until he stops", "gsc_o_kin_3", X({corruption: 5, renown: 4, set: {kinExposed: true}, taint: {slaanesh: 30}},
        "你的眼神里有东西涌出去。同事愣住，忘了自己要说什么。那一瞬间的感觉，好得让你害怕。",
        "Something flows out through your gaze. He freezes and forgets what he was saying. The moment feels so good it frightens you."))
    ]};

  N.gsc_o_kin_3 = {chapter: 1, scene: "hive_hab", speaker: OSSA, time: {d: 6}, jump: L("那个星期天，回到家里", "That Sunday, back home"),
    alt: [ADD(F("kinExposed"), "“计数室那件事，嗡鸣里都有了，”她先说，“别再那样看人。”", "“The tally-office business is all through the hum,” she says first. “Don't look at people like that again.”")],
    text: L("星期天，高祖母奥莎把你叫到灶台边。她快一百岁了，手还很稳。\n她推给你一张出货单：“下周有一批采矿炸药，账上要少写二十箱。”\n“家里需要计数室里有自己人，”她说，“你是我们的眼睛。”",
            "On Sunday your great-great-grandmother Ossa calls you to the stove. She is nearly a hundred, and her hands are still steady.\nShe slides you a shipping docket. “Next week there's a load of mining charges. The books need to show twenty crates fewer.”\n“The family needs one of ours in the tally office,” she says. “You're our eyes.”"),
    choices: [
      C("改账", "Alter the books", "gsc_o_kin_4", X({renown: 6, set: {smuggler: true, kinLedger: true}},
        "数字很听话。二十箱炸药从帝国的账本上消失了，像从来没存在过。",
        "The figures obey. Twenty crates of explosive vanish from the Imperium's ledgers as if they never were.")),
      C("“炸药用来干什么？”", "“What are the charges for?”", "gsc_o_kin_4", X({sanity: -3, renown: -2, set: {askedDay: true}},
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
  N.gsc_201 = {chapter: 2, scene: "hive_hab", speaker: OSSA, time: {d: 14}, bridge: true, gather: L("饭桌", "Supper table"),
    alt: [ALT(F("origin_kin"), "家里把你调到九号矿井升降口记账：“井口需要自己人。”\n星期天，你第一次坐上霍林家饭桌的主桌。提奥表舅在哼歌，乔里表哥用第三只手分面包，大家都在骂甘特工头。\n大娘说：“来，搭把手。”",
            "The family moves you from the tally office to the Shaft Nine lift-head: “The pithead needs one of ours.”\nOn Sunday you sit at the head of the Hollin supper table for the first time. Uncle Teo hums; Cousin Jory hands round bread with his third arm; the whole room curses Foreman Gant.\nMa says: “Come on, lend a hand.”"),
          ADD(F("origin_warden"), "你穿着矿工的工装坐在长桌边。没人问你从哪儿来。", "You sit at the long table in miner's overalls. Nobody asks where you came from."),
          ADD(F("ossaInvite"), "大娘给你留了正式的座位，就在她旁边。", "Ma has kept you a proper seat, right beside her."),
          ADD(F("ossaWary"), "大娘给你盛汤，却不再看你的眼睛。", "Ma ladles your soup, but no longer meets your eyes."),
          ADD(F("promisedJory"), "乔里冲你点点头：说话算话的人。", "Jory nods at you: someone who keeps their word."),
          ADD(F("shunnedJory"), "是提奥上工棚把你拽来的：“汤都凉了两回了。”", "Teo had to haul you from the barracks. “Soup's gone cold twice.”"),
          ADD(F("protested"), "有人说起告示板那天的事，冲你举了举杯。", "Someone brings up the notice-board day and raises a cup to you.")],
    text: L("两周后的星期天，你坐上了霍林家的饭桌。三代人挤在长桌边，孩子在桌下钻。\n提奥爱哼歌，乔里表哥有三只手；大家都在骂甘特工头，他又扣了全矿的工分。\n大娘说：“来，搭把手。”",
            "Two weeks later, on Sunday, you have a place at the Hollin supper table. Three generations squeeze along it; children crawl underneath.\nTeo hums; Cousin Jory has three arms; everyone curses Foreman Gant, who has docked the whole shaft's tallies again.\nMa says: “Come on, lend a hand.”"),
    codex: ["gsc_cult"],
    choices: [
      C("帮大娘在厨房打下手", "Help Ma in the kitchen", "gsc_201a", X({sanity: 5, renown: 4},
        "你系上围裙，跟着大娘进了厨房。",
        "You tie on an apron and follow Ma into the kitchen.")),
      C("和表兄弟们玩牌", "Play cards with the cousins", "gsc_201b", X({renown: 4, taint: {tzeentch: 45}},
        "你赢了一手又一手，赢得蹊跷。牌面上的花色，你看一眼就知道下一张是什么。",
        "You win hand after hand, uncannily. One glance at a suit and you know the next card.")),
      C("坐在四臂像下发呆", "Sit beneath the four-armed icon", "gsc_202", X({corruption: 4, sanity: 3},
        "画里的四只手好像在动，一只一只，慢慢把你圈了起来。你从来没觉得这么安全。",
        "The painting's four hands seem to move, one by one, slowly gathering you in. You have never felt so safe."))
    ]};

  N.gsc_201a = {chapter: 2, scene: "hive_hab", speaker: OSSA, time: {h: 1},
    text: L("大娘教你一首切菜时唱的歌，歌词里有“天上的孩子”。\n几个婶子一边切块根一边说闲话：甘特把扣下的工分换了酒；上个月塌方死的人，他连抚恤都没报。\n“这种人，”大娘说，“会有人管的。”",
            "Ma teaches you a chopping song; the words mention “the children in the sky.”\nThe aunts gossip over the roots: Gant drinks the docked tallies; last month's cave-in dead, he never even filed for their families.\n“A man like that,” Ma says, “someone will see to him.”"),
    effects: {set: {heardGant: true}},
    choices: [
      C("“谁会管？”", "“Who will?”", "gsc_202", X({sanity: -2},
        "大娘笑了笑，没回答，又往锅里添了一勺盐。婶子们同时低下头，接着切。",
        "Ma smiles and doesn't answer, only adds a spoon of salt. The aunts all bow their heads at once and keep chopping."))
    ]};

  N.gsc_201b = {chapter: 2, scene: "hive_hab", speaker: JORY, time: {h: 1},
    text: L("乔里的班组围着一张小桌，用第三只手洗牌的是乔里自己。\n“手气好的人，下井也有人护着，”他把赢来的筹码推给你，“明天甘特要是再扣分，我们就在升降口坐下。”\n“你坐我们中间。”",
            "Jory's crew crowds a little table; Jory shuffles with his third hand.\n“Lucky folk get looked after down the shaft too,” he says, pushing your winnings over. “If Gant docks us again tomorrow, we sit down at the lift-head.”\n“You sit in the middle of us.”"),
    effects: {set: {joryCrew: true}},
    choices: [
      C("把筹码推回去", "Push the winnings back", "gsc_202", X({renown: 3},
        "乔里笑了：“家里人不赢家里人的钱。”他把筹码分给了桌下的孩子们。",
        "Jory laughs. “Family doesn't take family's money.” He hands the chips to the children under the table."))
    ]};

  N.gsc_202 = {chapter: 2, scene: "mine_shaft", speaker: VASK, foe: "enforcer", time: {d: 1},
    alt: [ADD(F("origin_kin"), "扣分的账，是你在升降口亲手记的。", "You wrote the docked tallies yourself, at the lift-head desk."),
          ADD(F("origin_warden"), "瓦斯克的目光扫过你，没有停。", "Vask's eyes pass over you and don't stop."),
          ADD(F("vaskKnows"), "瓦斯克看见你，眉毛一挑：砸告示板的那个。", "Vask spots you and raises an eyebrow: the notice-board one."),
          ADD(F("joryCrew"), "乔里的班组把你夹在中间坐下。", "Jory's crew sits you down in the middle of them.")],
    text: L("星期一，甘特又扣了一轮工分。提奥带着表兄弟们在升降口坐下罢工。\n瓦斯克执法官带着一队人赶到，电击棍噼啪作响。\n“三秒钟，”他说，“回去干活，或者躺着回去。”",
            "On Monday Gant docks another round of tallies, and Teo leads the cousins in sitting down at the lift-head in strike.\nEnforcer-Captain Vask arrives with a squad, shock-mauls crackling.\n“Three seconds,” he says. “Back to work, or carried back.”"),
    codex: ["imp_arbites"],
    choices: [
      C("和罢工的人坐在一起", "Sit with the strikers", null, O(Q({notFlag: "joryCrew"}, true), R(0.5, "hp", "gsc_204", "gsc_203",
        RR("执法官的棍子落在你旁边的人身上。你护住了头，也护住了提奥。", "The mauls fall on the men beside you. You shield your head, and Teo's.",
           "一记电击棍正中你的后背，你眼前一黑。", "A shock-maul catches you square in the back. Everything goes black.")))),
      C("坐在乔里的班组中间", "Sit in the middle of Jory's crew", null, O(Q({flag: "joryCrew"}, true), R(0.7, "hp", "gsc_204", "gsc_203",
        RR("棍子落下来时，乔里的第三只手替你挡了一下。你一点伤也没有。", "When the mauls come down, Jory's third arm takes the blow meant for you. You're unhurt.",
           "表兄弟们挡住了大半，可还是有一棍落在你背上。你眼前一黑。", "The cousins take most of it, but one blow still lands on your back. Everything goes black.")))),
      C("悄悄溜走", "Slip away quietly", "gsc_204", X({sanity: -5, renown: -3},
        "你躲在矿车后面，听着棍子落下的声音，一下，又一下。",
        "You hide behind an ore cart and listen to the mauls come down. Again. Again.")),
      C("向执法官指认带头的提奥", "Point out Teo as the ringleader to Vask", "gsc_203b", X({renown: -10, set: {informer: true, wronged_teo: true}},
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
        "Ma's eyes brighten. The low hum in the room seems to warm a little too.")),
      C("问是谁把你背回来的", "Ask who carried you home", "gsc_204", X({sanity: 2, set: {joryCarried: true}},
        "“乔里，”大娘说，“他背着你跑了两条街，背上还挨着棍子。”",
        "“Jory,” says Ma. “Ran two streets with you on his back, and took mauls on it the whole way.”"))
    ]};

  N.gsc_203b = {chapter: 2, scene: "hive_hab", speaker: TEO, time: {d: 1},
    text: L("第二天，提奥来找你。他的肩膀缠着绷带，手里端着一碗汤。\n“大娘让我送来的，”他把汤放在你面前，“家里人都知道了。”\n他看着你：“家里人什么都知道。”",
            "Next day Teo comes to find you, shoulder bandaged, a bowl of soup in his hands.\n“Ma sent it.” He sets it before you. “The family all know.”\nHe looks at you. “The family knows everything.”"),
    effects: {renown: -5, sanity: -4},
    choices: [
      C("接过汤，说不出话", "Take the soup. You can't speak", "gsc_204", X({hp: 5},
        "汤还是热的。提奥走了，没有回头。你喝完了，一口也没剩。",
        "The soup is still hot. Teo leaves without looking back. You finish every drop.")),
      C("把口粮券还给瓦斯克", "Return the ration chit to Vask", "gsc_204", X({renown: 3, sanity: 2, set: {returnedChit: true}},
        "你把券拍在执法官的桌上。瓦斯克看了你一眼：“良心值几个钱？”他还是收下了。",
        "You slap the chit on the enforcers' desk. Vask eyes you. “What's a conscience worth?” He takes it back anyway."))
    ]};

  N.gsc_204 = {chapter: 2, scene: "mine_shaft", speaker: null, time: {d: 2},
    alt: [ADD(F("heardGant"), "你想起厨房里婶子们的话：会有人管的。", "You remember the aunts in the kitchen: someone will see to him."),
          ADD(F("ganttMarked"), "账本底下压着他记名字的小本子，有一页写着你。", "Under the ledger lies his little book of names. One page is yours.")],
    text: L("两天后，甘特工头没来上班。\n他的办公室收拾得整整齐齐，账本合着，椅子推进桌下，像他只是出去喝口水。\n新来的工头姓霍林。工分，涨回来了。",
            "Two days later, Foreman Gant doesn't come to work.\nHis office is tidy: ledger closed, chair pushed in, as if he'd just stepped out for water.\nThe new foreman's name is Hollin. The tallies go back up."),
    choices: [
      C("去看看甘特的办公室", "Look around Gant's office", "gsc_205", X({sanity: -5, set: {sawOffice: true}},
        "桌下的地板上有一道细细的划痕，四条，并排，像有什么东西把他轻轻拖走了。",
        "On the floor under the desk: four thin scratches, side by side, as if something gently dragged him away.")),
      C("不问。工分涨了就好", "Don't ask. The tallies are up", "gsc_205", X({renown: 3, hp: 5, set: {lookedAway: true}, taint: {nurgle: 30}},
        "那个星期你第一次吃饱了饭。有些事不问，日子会好过很多。",
        "That week you eat your fill for the first time. Some things are easier left unasked."))
    ]};

  N.gsc_205 = {chapter: 2, scene: "underhive", speaker: VASK, time: {d: 1},
    alt: [ALT(F("origin_warden"), "第二天，瓦斯克当着外面的人把你叫进审讯室。门一关，他压低声音：\n“演给他们看的。甘特失踪那晚，霍林家说你在吃饭。”\n“是真的吗？说吧，我听着。”",
            "Next day Vask calls you into the interrogation room in front of everyone. Once the door shuts he lowers his voice.\n“That was for show. The night Gant vanished, the Hollins say you were at supper.”\n“True? Go on. I'm listening.”"),
          ADD(F("vaskKnows"), "“又是你，”他说，“砸告示板那个。”", "“You again,” he says. “The notice board.”"),
          ADD(F("returnedChit"), "桌角压着那张你还回来的口粮券。", "Under the corner of the desk sits the ration chit you returned.")],
    text: L("第二天，分局来人叫你。瓦斯克执法官在审讯室里等着：“甘特失踪那晚，你在哪儿？”\n“霍林家的人说，你那晚和他们一起吃饭。”\n他慢慢翻着档案：“我想听你说。”",
            "Next day the precinct sends for you. Enforcer-Captain Vask waits in the interrogation room. “The night Gant vanished. Where were you?”\n“The Hollins say you were at supper with them.”\nHe leafs slowly through a file. “I want to hear it from you.”"),
    choices: [
      C("“我和霍林家吃饭。”", "“I was at supper with the Hollins.”", "gsc_206", X({renown: 8, sanity: -3, set: {liedForFamily: true}},
        "你说得很顺，顺得连自己都信了。走出审讯室时，提奥在门口等你，什么也没问。",
        "It comes out smoothly, so smoothly you believe it yourself. Teo is waiting outside and asks nothing.")),
      C("说出你看见的划痕", "Tell him about the scratches", "gsc_205b", O(Q({flag: "sawOffice"}, true), X({renown: -10, set: {toldVask: true}},
        "瓦斯克的笔停了。“四条？”他把这页撕下来，折好，放进贴身口袋，抓起了外套。",
        "Vask's pen stops. “Four?” He tears the page out, folds it into an inside pocket, and reaches for his coat."))),
      C("压低声音：“又是星期天。”", "Lower your voice: “Sunday again.”", "gsc_206", O(Q({flag: "origin_warden"}, true), X({sanity: 3, set: {reported: true}},
        "瓦斯克在本子上写下“星期天”，画了两道线。“回去吃你的饭，”他说，“记住你在为谁吃。”",
        "Vask writes SUNDAY in his book and underlines it twice. “Go eat your supper,” he says. “Remember whose table you eat it for.”"))),
      C("一言不发", "Say nothing at all", "gsc_206", X({hp: -8, set: {cellNight: true}},
        "瓦斯克叹了口气，让人把你在禁闭室关了一夜。地上很冷，墙那边有人在哼霍林家的歌。",
        "Vask sighs and has you locked in a cell overnight. The floor is cold. Through the wall someone hums a Hollin song."))
    ]};

  N.gsc_205b = {chapter: 2, scene: "mine_shaft", speaker: VASK, time: {h: 5},
    text: L("瓦斯克连夜带你去了十三号矿井。封条还在，只是从里面被整整齐齐地剪开了。\n封口的碎石上，躺着一盏矿灯，灯罩上刻着“甘特”。\n瓦斯克用手帕把灯包起来：“这口井，三十年前就封了。”",
            "That night Vask takes you to Shaft Thirteen. The seals are still there, cut neatly from the inside.\nOn the rubble at the mouth lies a miner's lamp, GANT scratched on its hood.\nVask wraps it in a handkerchief. “This shaft was sealed thirty years ago.”"),
    effects: {sanity: -5},
    choices: [
      C("答应替他盯着霍林家", "Agree to watch the Hollins for him", "gsc_206", X({renown: -3, set: {vaskAgent: true}},
        "瓦斯克点点头。“别写字，别打电话。有事来分局，就说你丢了东西。”",
        "Vask nods. “Don't write anything. Don't vox. If you've news, come to the precinct and say you lost something.”")),
      C("“我什么也没看见。”", "“I didn't see anything.”", "gsc_206", X({renown: 3, sanity: -3},
        "瓦斯克看了你很久，把灯揣进了怀里。“那我就当你没来过。”",
        "Vask looks at you a long time and tucks the lamp into his coat. “Then you were never here.”"))
    ]};

  N.gsc_206 = {chapter: 2, scene: "gsc_chapel", speaker: MAGUS, time: {d: 4}, jump: L("审讯后的那个星期天", "The Sunday after the questioning"), gather: L("礼拜堂", "Chapel"),
    alt: [ALT(F("origin_kin"), "星期天，大娘让你站到礼拜堂前排。这间礼拜堂你从小就在里面唱，今天几百人在你身后一起呼吸。\n主祭的声音落进你脑子里，和小时候一样暖：\n“星之子就要来了。他们会从天上降下，把我们接走。”",
            "That Sunday Ma puts you in the front row of the chapel. You have sung in this little chapel under the grain store since childhood; today hundreds breathe as one behind you.\nMagus Ilarion's voice lands in your head, warm as when you were small:\n“The Star Children are coming. They will descend from the sky and lift us up.”"),
          ADD(F("askedIcon"), "主祭看见你，笑了：“问画的那个。”", "The Magus sees you and smiles. “The one who asked about the painting.”"),
          ADD(F("devout"), "你领唱第一句，几百个声音接了上来。", "You lead the first line, and hundreds of voices take it up.")],
    text: L("星期天，大娘带你下到粮仓底下的小礼拜堂。几百人挤在里面，没人说话，却像在一起呼吸。\n伊拉里昂主祭走上前，声音很轻，直接落进你脑子里：\n“星之子就要来了。他们会从天上降下，把我们接走。”",
            "That Sunday Ma takes you down to the little chapel beneath the grain store. Hundreds are packed inside. Nobody speaks, yet they seem to breathe as one.\nMagus Ilarion steps forward. His voice is soft, and lands directly inside your head:\n“The Star Children are coming. They will descend from the sky and lift us up.”"),
    codex: ["gsc_magus", "place_hollin_chapel", "gsc_star_children"],
    choices: [
      C("跟着大家一起唱", "Sing with everyone", "gsc_207", X({corruption: 5, renown: 6, taint: {slaanesh: 20}},
        "你的声音融进几百个声音里。你从没唱得这么好，也从没这么不像你自己。",
        "Your voice melts into hundreds. You have never sung so well, nor sounded so little like yourself.")),
      C("盯着主祭的眼睛", "Watch the Magus's eyes", "gsc_207", X({sanity: -6, set: {watchedMagus: true}},
        "他的瞳孔里有紫色的光，一闪，全场几百人同时闭上了眼。只有你没闭。",
        "Violet light in his pupils flickers, and hundreds close their eyes at once. Only you don't.")),
      C("唱到一半，悄悄离开", "Slip out halfway through", "gsc_207", X({renown: -4, sanity: 3, set: {leftEarly: true}},
        "你爬上楼梯，外面的空气又冷又脏。脑子里那阵嗡鸣，过了很久才停。",
        "You climb the stairs into cold, dirty air. The hum in your head takes a long time to fade."))
    ]};

  N.gsc_207 = {chapter: 2, scene: "hive_hab", speaker: WREN, time: {d: 4}, jump: L("礼拜后第四天，饭桌下", "Four days after the service, under the table"),
    alt: [ADD(F("smiledWren"), "“你是井口那个冲我笑的人！”她认出了你。", "“You're the one who smiled at me at the pithead!” She knows you."),
          ADD(F("leftEarly"), "“大人们说你会回来的，”她说，“你看，你回来了。”", "“The grown-ups said you'd come back,” she says. “See? You did.”")],
    text: L("礼拜后第四天，小雷恩在饭桌下拽你的袖子。她七岁，是乔里的女儿，头皮光光的，眼睛很大。\n她举着一块写字板：“大人说你识字。教我好不好？”\n她的手指比别的孩子多一节。",
            "Four days after the service, little Wren tugs your sleeve under the supper table. She is seven, Jory's daughter, scalp bare as an egg, eyes huge.\nShe holds up a slate. “They say you can read. Will you teach me?”\nHer fingers each have one joint too many."),
    choices: [
      C("教她写自己的名字", "Teach her to write her name", "gsc_208", X({sanity: 6, renown: 4, set: {taughtWren: true}},
        "她写了一遍又一遍，写满了一整块板。“雷恩，”她念，“雷恩是我！”",
        "She writes it over and over until the slate is full. “Wren,” she reads. “Wren is me!”")),
      C("“去问你爸爸。”", "“Go ask your father.”", "gsc_208", X({renown: -4},
        "她低着头走了。那天晚饭，桌上的人对你客气了一点，也冷了一点。",
        "She walks off with her head down. At supper the table is a little more polite to you, and a little cooler."))
    ]};

  N.gsc_208 = {chapter: 2, scene: "mine_shaft", speaker: TEO, time: {d: 10}, jump: L("十天后，排班表变了", "Ten days later, the rota changes"), eventRoll: 0.35,
    alt: [ALT(F("origin_kin"), "十天后，新工头让你管他的账。账上，霍林家的班永远是好班：浅巷道，好空气，工分照算。\n提奥笑着说：“家里人嘛。”矿上一半的班组长姓霍林了。\n只有老布兰不去霍林家。他带的班，永远在最深处。",
            "Ten days on, the new foreman hands you his ledgers. In them the Hollin crews always get the good shifts: shallow galleries, clean air, full tally.\nTeo grins. “Family, isn't it.” Half the shift-bosses are Hollins now.\nOnly Old Brann never goes to the Hollins. His crew always works the deepest face.")],
    text: L("十天后，排班表变了。新工头给你排的都是好班：浅巷道，好空气，工分照算。\n提奥笑着说：“家里人嘛。”矿上一半的班组长姓霍林了。\n只有老布兰不去霍林家。他带的班，永远在最深处。",
            "Ten days later the rota changes. The new foreman gives you only good shifts: shallow galleries, clean air, full tally.\nTeo grins. “Family, isn't it.” Half the shift-bosses are Hollins now.\nOnly Old Brann never goes to the Hollins. His crew always works the deepest face."),
    choices: [
      C("安心接受", "Accept it gladly", "gsc_209", X({renown: 4, hp: 5, set: {favoured: true}},
        "你胖了一点，咳嗽也好了。工棚里那些不去霍林家的人，开始不和你说话了。",
        "You put on a little weight; the cough clears. The men in the barracks who don't go to the Hollins stop speaking to you.")),
      C("跟老布兰的班下最深的掌子面", "Work the deep face with Old Brann's crew", "gsc_209", O(X({hp: -6, sanity: 3, set: {workedWithBrann: true}},
        "你不想欠谁的。老布兰一整班没说一句话，收工时递给你半块口粮。",
        "You don't want to owe anyone. Old Brann says nothing all shift, and at the end hands you half his ration."),
        {resultAlt: [RA(F("deepFace"), "你又回到了那片湿甜的空气里。老布兰看你咳嗽，递给你半块口粮：“你下来过。”",
                       "Back into that damp, sweet air. Brann watches you cough and hands you half his ration. “You've been down here before.”")]})),
      C("“霍林家怎么这么多人？”", "“How are there so many Hollins?”", "gsc_209", X({sanity: -4, set: {suspicious: true}},
        "提奥想了想。“大娘说，从她那一代算起，四代了。”他说得很骄傲。",
        "Teo thinks. “Ma says four generations, counting from hers.” He says it proudly."))
    ]};

  N.gsc_209 = {chapter: 2, scene: "cathedral", speaker: LUSK, time: {d: 5}, jump: L("又一个星期天，你去了小教堂", "Another Sunday; you go to the chapel"), gather: L("小教堂", "Mining chapel"),
    alt: [ALT(F("origin_kin"), "星期天你没去礼拜堂，去了矿区小教堂。卢斯克神父对着半空的长椅布道，几个老矿工和寡妇在打盹。\n散场后他拦住你：“孩子，有人在拜假帝皇。四只手的那种。”\n“你要是知道什么，帝皇听得见。”",
            "On Sunday you skip the family chapel and go to the mining chapel. Father Lusk preaches to half-empty pews; a few old miners and widows doze.\nAfterward he stops you. “Child, someone is worshipping a false Emperor. The four-armed kind.”\n“If you know anything, the Emperor is listening.”"),
          ADD(F("prayedFirst"), "“听说你在那家饭前也祷告，”他说，“他们念的是谁？”", "“I hear you say grace in that house,” he says. “Whose name do they say?”"),
          ADD(F("lookedAway"), "“甘特的事，你也不问？”他看着你。", "“And Gant? You don't ask either?” He watches you."),
          ADD(F("suspicious"), "他压低声音：“我往星区写了一封信，已经寄出去了。”", "He lowers his voice. “I've written to the sector. The letter's already gone.”")],
    text: L("星期天你没去霍林家，去了矿区小教堂。卢斯克神父对着半空的长椅布道，几个老矿工和寡妇在打盹。\n散场后他拦住你：“孩子，有人在拜假帝皇。四只手的那种。”\n“你要是知道什么，帝皇听得见。”",
            "On Sunday you skip the Hollins and go to the mining chapel. Father Lusk preaches to half-empty pews; a few old miners and widows doze.\nAfterward he stops you. “Child, someone is worshipping a false Emperor. The four-armed kind.”\n“If you know anything, the Emperor is listening.”"),
    codex: ["imp_ecclesiarchy"],
    choices: [
      C("向他忏悔你看见的一切", "Confess everything you've seen", "gsc_210", X({sanity: 6, renown: -8, set: {confessedLusk: true}, taint: {all: -15}},
        "神父听完，脸色发白，在你额头上画了一个圣徽。“走吧。别再去了。”他的手在抖。",
        "The priest goes pale and traces the sign on your brow. “Go. Don't go back there.” His hand is shaking.")),
      C("“霍林家只是好心人。”", "“The Hollins are just good people.”", "gsc_210", X({renown: 5, set: {defendedHollins: true}},
        "神父叹了口气。“好心人，”他重复了一遍，“好心人最难烧。”",
        "The priest sighs. “Good people,” he repeats. “Good people are the hardest to burn.”")),
      C("什么也不说，离开", "Say nothing and leave", "gsc_210", X({sanity: -3},
        "你走出教堂。门口的台阶上，坐着一个戴兜帽的小孩，正在数进出的人。",
        "You leave the chapel. On the steps sits a hooded child, counting who comes and goes."))
    ]};

  N.gsc_210 = {chapter: 2, scene: "gsc_chapel", speaker: MAGUS, time: {d: 7}, jump: L("一个星期后，主祭捎话", "A week later, the Magus sends word"),
    alt: [ALT(F("origin_kin"), "一个星期后，伊拉里昂主祭单独见你。他的手很凉，声音像一条温暖的河。\n“你生来就是家人。可你还从没见过老祖宗。”\n“下一个休息日，跟我们下十三号矿井。祂想见见你。”",
            "A week later Magus Ilarion sees you alone. His hands are cool; his voice is a warm river.\n“You were born family. But you have never met the Grandsire.”\n“Next rest-day, come down Shaft Thirteen with us. It wishes to meet you.”"),
          ADD(F("confessedLusk"), "“你去过小教堂，”他温和地说，“老祖宗想看看你的心。”", "“You went to the chapel,” he says gently. “The Grandsire wants to see your heart.”"),
          ADD(F("informer"), "“你在升降口指过提奥，”他说，“家人记得，也原谅。”", "“You pointed at Teo at the lift-head,” he says. “Family remembers. And forgives.”"),
          ADD(F("watchedMagus"), "“那天你没闭眼，”他说，“我喜欢睁着眼的孩子。”", "“You didn't close your eyes that day,” he says. “I like children who keep them open.”")],
    text: L("一个星期后，伊拉里昂主祭单独见你。他的手很凉，声音像一条温暖的河。\n“你已经是家人了，只差一步。”\n“下一个休息日，跟我们下十三号矿井。老祖宗想见见你。”",
            "A week later Magus Ilarion sees you alone. His hands are cool; his voice is a warm river.\n“You are already family, all but one step.”\n“Next rest-day, come down Shaft Thirteen with us. The Grandsire wishes to meet you.”"),
    choices: [
      C("“我去。”", "“I'll come.”", "gsc_300", X({renown: 5, corruption: 3},
        "主祭笑了。那一夜你梦见一只很大很老的手，轻轻放在你头顶。",
        "The Magus smiles. That night you dream of a vast, ancient hand resting lightly on your head.")),
      C("“让我想一想。”", "“Let me think about it.”", "gsc_211", X({renown: -3},
        "“当然，”主祭说，“家人会等。”他说“等”的样子，让你后背发凉。",
        "“Of course,” says the Magus. “Family waits.” The way he says “waits” chills your spine."))
    ]};

  N.gsc_211 = {chapter: 2, scene: "cathedral", speaker: null, time: {d: 3}, jump: L("你想了好几天", "You think it over for days"),
    text: L("你想了好几天。提奥每天收工都在升降口等你，什么也不问。\n第三天，矿区小教堂的门锁了。卢斯克神父不见了，圣坛上的蜡烛点到一半就灭了。\n街上没人提起他。连执法官也没来。",
            "You think for days. Every shift's end Teo waits at the lift-head, asking nothing.\nOn the third day the mining chapel is locked. Father Lusk is gone; the altar candles burned halfway, then snuffed.\nNobody on the street mentions him. Not even the enforcers come."),
    effects: {sanity: -6},
    choices: [
      C("去执法分局", "Go to the enforcer precinct", "gsc_212", X({sanity: -2},
        "你绕了三条街，确定没人跟着，才推开分局的门。",
        "You go three streets the long way round, sure no one follows, before you push open the precinct door.")),
      C("回霍林家", "Go back to the Hollins", "gsc_300", X({renown: 4, set: {hesitated: true}},
        "大娘给你开门，像什么都没发生。“饿了吧，”她说，“休息日快到了。”",
        "Ma opens the door as if nothing has happened. “Hungry?” she says. “Rest-day's nearly here.”"))
    ]};

  N.gsc_212 = {chapter: 2, scene: "underhive", speaker: VASK, time: {h: 2},
    alt: [ADD({all: [F("vaskAgent"), NF("reported")]}, "“你终于肯来了，”他说，“我等你的报告等了一个月。”", "“Finally,” he says. “I've waited a month for your report.”"),
          ADD(F("reported"), "他翻开本子，指着那两道线：“星期天。你说对了。”", "He opens his book to the double-underlined word. “Sunday. You were right.”")],
    text: L("瓦斯克没让你说完。“我知道。神父，工头，三十一个矿工。”\n他把一颗通讯珠放在桌上。“我手下至少有四个执法官，星期天去霍林家吃饭。”\n“我谁也信不过。除了你。”",
            "Vask doesn't let you finish. “I know. The priest, the foreman, thirty-one miners.”\nHe sets a vox-bead on the desk. “At least four of my own enforcers eat at the Hollins' on Sundays.”\n“I can't trust anyone. Except you.”"),
    choices: [
      C("戴上通讯珠，跟他们下井", "Wear the bead and go down with them", "gsc_300", X({sanity: -5, set: {wire: true}},
        "通讯珠藏在领口里，凉凉的。你觉得自己像揣着一颗会说话的心脏。",
        "The bead sits cold in your collar. It feels like carrying a heart that can talk.")),
      C("“你保护不了我。”", "“You can't protect me.”", "gsc_300", X({renown: 3, set: {refusedVask: true}},
        "瓦斯克没反驳。他只是把通讯珠收了回去，看起来比你还累。",
        "Vask doesn't argue. He just pockets the bead, looking more tired than you."))
    ]};


  /* ============ Chapter 3 · Down Below ============ */
  N.gsc_300 = {chapter: 3, scene: "hive_hab", speaker: TEO, time: {d: 2}, bridge: true,
    alt: [ALT(F("origin_kin"), "休息日清早，提奥来家里接你。路过矿区小教堂，门上贴着“神父外出”。卢斯克好几天没露面了，谁也不提。\n听说他走前，往星区寄出过一封信。\n提奥把矿灯递给你：“走吧，老祖宗在等。”",
            "Early on rest-day Teo comes to the house for you. On the mining chapel door hangs a notice: FATHER AWAY. Lusk hasn't been seen for days, and nobody mentions it.\nThey say he posted a letter off-world before he went.\nTeo hands you a lamp. “Come on. The Grandsire's waiting.”"),
          ADD(F("confessedLusk"), "教堂台阶上，一个戴兜帽的小孩冲你挥挥手。你忏悔那天，他也坐在这里。", "On the chapel steps a hooded child waves at you. The day you confessed, he was sitting right there."),
          ADD(F("defendedHollins"), "你替霍林家说过好话。神父还是走了。", "You spoke up for the Hollins. The priest is gone all the same."),
          ADD(F("hesitated"), "“你让家人等了一回，”提奥说，“没关系，家人会等。”", "“You kept the family waiting,” Teo says. “It's all right. Family waits.”"),
          ADD(F("wire"), "通讯珠藏在你领口里，凉凉的。", "The vox-bead lies cold inside your collar."),
          ADD(F("refusedVask"), "你经过分局门口。瓦斯克站在窗后，看着你走过去。", "You pass the precinct. Vask stands at the window and watches you go by.")],
    text: L("休息日清早，提奥来工棚接你。路过矿区小教堂，门上贴着“神父外出”。卢斯克好几天没露面了，谁也不提。\n听说他走前，往星区寄出过一封信。\n提奥把矿灯递给你：“走吧，老祖宗在等。”",
            "Early on rest-day Teo comes to the barracks for you. On the mining chapel door hangs a notice: FATHER AWAY. Lusk hasn't been seen for days, and nobody mentions it.\nThey say he posted a letter off-world before he went.\nTeo hands you a lamp. “Come on. The Grandsire's waiting.”"),
    choices: [
      C("跟提奥去十三号矿井", "Go with Teo to Shaft Thirteen", "gsc_301", X({renown: 2},
        "你们穿过半个矿区。路上遇见的人，都朝提奥点头，也朝你点头。",
        "You cross half the district. Everyone you pass nods to Teo, and then to you."))
    ]};

  N.gsc_301 = {chapter: 3, scene: "mine_shaft", speaker: TEO, time: {h: 2},
    alt: [ADD(F("toldVask"), "你认得这道剪开的封条。那天，甘特的灯就躺在这里。", "You know these cut seals. Gant's lamp lay right here."),
          ADD(F("origin_kin"), "这口井你从小就知道，却从没下到这么深。", "You have known of this shaft all your life, but never gone this deep.")],
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

  N.gsc_302 = {chapter: 3, scene: "cult_shrine", speaker: PRIMUS, time: {h: 3}, gather: L("操练场", "Drill ground"),
    alt: [ADD(F("wire"), "领口里的通讯珠沙沙响了一下。你按住了它。", "The bead in your collar crackles once. You press it still.")],
    text: L("巨大的洞窟成了操练场。几百个戴兜帽的人在练枪，扛着炸药和自动枪；歇着的人围着水桶说话。\n哈斯克首领走过来，头颅高耸，带着骨棱，眼神像一把量尺。\n“新的家人，”他说，“能扛多少？”",
            "A vast cavern serves as a drill ground. Hundreds of hooded figures drill with mining charges and autoguns; those resting chat round a water barrel.\nPrimus Hask strides over: a tall, ridged skull, eyes like a measuring rule.\n“New family,” he says. “How much can you carry?”"),
    codex: ["gsc_primus", "gsc_neophyte"],
    choices: [
      C("跟他们一起操练", "Join the drill", "gsc_303", X({hp: -6, renown: 6, set: {drilled: true}},
        "你扛着炸药跑了二十趟。首领在本子上写了一笔：“能用。”这是他最高的夸奖。",
        "You run twenty loads of charges. The Primus makes a note: “Useful.” His highest praise.")),
      C("“这些是用来做什么的？”", "“What is all this for?”", "gsc_303", X({sanity: -3},
        "“为了那一天，”首领说，“那一天，我们要让天空看见我们。”",
        "“For the Day,” says the Primus. “On that Day we make the sky see us.”")),
      C("站在一边，不说话", "Stand aside and keep quiet", "gsc_303", X({renown: -3, set: {unproven: true}},
        "首领看了你一眼，就像看一块还没决定用不用的矿石。",
        "The Primus glances at you the way one looks at ore not yet judged worth smelting."))
    ]};

  N.gsc_303 = {chapter: 3, scene: "cult_shrine", speaker: JORY, time: {h: 1},
    alt: [ALT(F("origin_kin"), "乔里领你掀开那道帘子。你认识他一辈子，却第一次见到他的母亲：四只手，额头隆起，说话很慢，是第一代。\n她身后还有更老的人，你看不清，只听见甲壳摩擦的声音。\n乔里伸出他的第三只手。",
            "Jory lifts the curtain for you. You have known him all your life, yet this is the first time you meet his mother: four arms, swollen brow, slow speech. First generation.\nBehind her are older ones still. You can't see them, only hear chitin rasp.\nJory holds out his third hand."),
          ADD(F("pattern"), "人群里有几张脸，你在失踪报告上见过。他们活着，在笑。", "Among the crowd are faces from your missing-persons files. Alive. Smiling."),
          ADD(F("cellNight"), "“分局那晚，隔墙哼歌的是我，”乔里说。", "“That night in the cells, it was me humming through the wall,” Jory says."),
          ADD(F("joryCarried"), "“罢工那天背你回去，你可真沉，”乔里说。", "“You were heavy, the day of the strike,” Jory says.")],
    text: L("乔里带你认识家人：他的母亲有四只手，额头隆起，说话很慢，是第一代。\n她身后的帘子里，还有更老的人，你看不清，只听见甲壳摩擦的声音。\n乔里伸出他的第三只手。",
            "Jory introduces family. His mother has four arms and a swollen brow and speaks slowly: first generation.\nBehind her curtain are older ones still. You can't see them, only hear chitin rasp.\nJory holds out his third hand."),
    codex: ["gsc_generations", "gsc_acolyte"],
    choices: [
      C("握住他的第三只手", "Shake his third hand", "gsc_304", X({renown: 6, sanity: 3, set: {joryBond: true}},
        "乔里笑得很开心。他母亲用四只手同时拍了拍你，像在拍一个新生的孙子。",
        "Jory beams. His mother pats you with all four hands at once, like a new grandchild.")),
      C("往后退了一步", "Take a step back", "gsc_304", X({sanity: -6, renown: -4, set: {flinched: true}},
        "帘子后面的声音停了。乔里慢慢收回手，笑容没变，眼神变了。",
        "The sounds behind the curtain stop. Jory slowly withdraws his hand. The smile stays. The eyes change."))
    ]};

  N.gsc_304 = {chapter: 3, scene: "cult_shrine", speaker: OSSA, time: {h: 1},
    text: L("最里面的洞室是育婴房，暖得像一个怀抱。\n摇篮里的孩子，有的长着骨棱，有的多一双手。\n奥莎大娘抱起最小的一个：粉红的脸，普普通通的人类婴儿。“第四代，叫内尔。”",
            "The innermost chamber is a nursery, warm as an embrace.\nIn the cradles some infants have ridged skulls, some an extra pair of arms.\nMa Ossa lifts the smallest: a pink, perfectly ordinary human baby. “Fourth generation. Her name's Nell.”"),
    choices: [
      C("接过内尔抱一抱", "Hold Nell", "gsc_305", X({sanity: 6, renown: 5, set: {heldNell: true}},
        "她抓住你的手指，抓得很紧。她的眼睛在灯下，是很淡的紫色。",
        "She grips your finger, hard. In the lamplight her eyes are the palest violet.")),
      C("“她看起来……和人一样。”", "“She looks... just human.”", "gsc_305", O(X({sanity: -4},
        "“对呀，”大娘骄傲地说，“她能走在他们中间。谁也认不出来。”",
        "“That's right,” Ma says proudly. “She'll walk among them. Nobody will ever know.”"),
        {resultAlt: [RA(F("origin_kin"), "“对呀，”大娘骄傲地说，“和你一样。你们都能走在他们中间。”",
                       "“That's right,” Ma says proudly. “Just like you. You can both walk among them.”")]}))
    ]};

  N.gsc_305 = {chapter: 3, scene: "cult_shrine", speaker: MAGUS, time: {h: 1},
    text: L("主祭领你走向最后一道岩缝。里面很暗，很暖，有一种很低的嗡鸣，像巨大的心跳。\n“别怕，”他说，“老祖宗只是想认识你。”\n你的腿在发抖。",
            "The Magus leads you to a final crack in the rock. Inside it is dark and warm, and a very low hum throbs like an enormous heartbeat.\n“Don't be afraid,” he says. “The Grandsire only wants to know you.”\nYour legs are shaking."),
    codex: ["gsc_broodmind", "place_deep_cavern"],
    choices: [
      C("走进去", "Step inside", "gsc_306", X({renown: 2},
        "岩缝比你想的要宽。每走一步，那阵心跳就更近一点。",
        "The crack is wider than you thought. Each step brings the heartbeat closer.")),
      C("转身就跑", "Turn and run", null, R(0.45, "sanity", "gsc_307", "gsc_306",
        RR("你跑回黑暗的巷道，一路没有人追。他们不需要追。", "You flee into the dark galleries. No one chases you. They don't need to.",
           "你跑了两步，嗡鸣涌进脑子里，你的腿自己转了回去。", "Two steps, and the hum floods your head. Your legs turn you back on their own.")))
    ]};

  N.gsc_306 = {chapter: 3, scene: "cult_shrine", speaker: GRANDSIRE, time: {h: 1},
    text: L("黑暗里，有什么巨大的东西动了一下。紫色的甲壳，四只手臂，一张很老很老的脸。\n你本该尖叫。可它看着你时，你所有的害怕都化了，像糖化在热汤里。\n它低下头，好像在端详一个久别的孩子。",
            "In the dark, something enormous shifts. Violet chitin, four arms, a very, very old face.\nYou should scream. But as it looks at you, all your fear dissolves like sugar in hot soup.\nIt bows its head, as if studying a child long lost."),
    effects: {sanity: -6, set: {linked: true}},
    codex: ["gsc_patriarch"],
    choices: [
      C("跪下", "Kneel", "gsc_308", X({corruption: 10, renown: 10, set: {knelt: true}},
        "你跪下的那一刻，脑子里的嗡鸣变成了几百个声音，几百个家人，一起说：欢迎回家。",
        "As you kneel, the hum becomes hundreds of voices, hundreds of kin, all saying: welcome home.")),
      C("直视它的眼睛", "Meet its eyes", "gsc_308", X({sanity: -10, set: {lookedEye: true}, taint: {tzeentch: 55}},
        "它的眼睛里有一片星空，正在慢慢靠近。在那片嗡鸣底下，还有别的什么，在很远的地方看了你一眼。",
        "In its eyes is a field of stars, slowly drawing closer. And beneath the hum, something else, very far off, glances at you.")),
      C("在心里默念帝皇之名", "Pray to the Throne in silence", "gsc_308", X({sanity: 4, hp: -6, set: {prayedThrone: true}},
        "你念得很用力，太阳穴生疼。帝皇离这里太远了，可你还是念完了。",
        "You pray so hard your temples ache. The Emperor is very far from here. You finish the prayer anyway.")),
      C("按下领口的通讯珠", "Press the vox-bead in your collar", "gsc_309", O(Q({flag: "wire"}, true), X({sanity: -5},
        "通讯珠发出一声轻微的嘶响。整个洞窟，几百个脑袋，同时转向了你。",
        "The bead gives a faint hiss. Across the whole cavern, hundreds of heads turn toward you at once.")))
    ]};

  N.gsc_307 = {chapter: 3, scene: "hive_hab", speaker: TEO, time: {d: 1},
    text: L("你爬回地面时，灯已经灭了。你把自己锁在屋里，一夜没睡。\n第二天早上，有人敲门。是提奥，端着一碗热汤。\n“没关系，”他说，“家里人什么都原谅。老祖宗会再等你一回。”",
            "Your lamp is dead by the time you reach the surface. You lock yourself in and don't sleep.\nNext morning, a knock. Teo, holding a hot bowl of soup.\n“It's all right,” he says. “Family forgives everything. The Grandsire will wait for you again.”"),
    effects: {sanity: -8, set: {fled: true}},
    choices: [
      C("接过那碗汤", "Take the soup", "gsc_310", X({hp: 5, renown: 3, set: {cameBack: true, secondChance: true}},
        "汤还是那个味道。你一边喝一边哭，提奥坐在床边，一直等你喝完。",
        "The soup tastes the same as ever. You cry as you drink. Teo sits on the bed and waits till you finish.")),
      C("关上门", "Shut the door", "gsc_310", X({renown: -6, sanity: -4, set: {shutTeo: true}},
        "他在门外站了很久。走的时候，把汤放在了地上。第二天，碗还温着。",
        "He stands outside a long time. When he goes, he leaves the soup on the floor. Next day the bowl is still warm."))
    ]};

  N.gsc_308 = {chapter: 3, scene: "cult_shrine", speaker: MAGUS, time: {h: 2},
    alt: [ADD(F("knelt"), "他扶你起来时，手在抖，是高兴的。", "When he helps you up his hands are trembling, with joy."),
          ADD(F("lookedEye"), "“你看了祂的眼睛，”他轻声说，“很少有人敢。”", "“You looked into its eyes,” he says softly. “Few dare.”"),
          ADD(F("prayedThrone"), "“你在心里念别的名字，”他说，“老祖宗听见了，不生气。”", "“You said another name in your heart,” he says. “The Grandsire heard. It isn't angry.”")],
    text: L("主祭扶你起来，眼里含着泪。“老祖宗喜欢你。”\n“被选中的人，会得到祂的赐福。从此你的血，就是家的血。”\n洞窟里几百双眼睛在等你回答。",
            "The Magus helps you up, tears in his eyes. “The Grandsire likes you.”\n“The chosen receive its blessing. From then on your blood is the family's blood.”\nHundreds of eyes in the cavern wait for your answer."),
    choices: [
      C("接受赐福", "Accept the blessing", "gsc_310", X({corruption: 15, renown: 10, set: {blessed: true, carrier: true}},
        "后来的事你记不清了。只记得很暖，然后醒来，脖子上多了一个很小的印记，再也不痛。",
        "You can't recall what came after. Only warmth; then waking with a tiny mark on your neck that never hurts again.")),
      C("“还没准备好。”", "“I'm not ready yet.”", "gsc_310", X({renown: -5, sanity: 3, set: {refusedKiss: true, secondChance: true}},
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
      C("站着，咬紧牙关", "Stay standing, jaw clenched", "gsc_310", X({sanity: -6, set: {fist: true}, taint: {khorne: 40}},
        "首领盯着你的拳头看了一会儿。“很好，”他说，“那一天，用得上。”",
        "The Primus studies your fists a moment. “Good,” he says. “That will be useful on the Day.”"))
    ]};

  N.gsc_310 = {chapter: 3, scene: "hive_hab", speaker: TEO, time: {d: 20}, jump: L("二十天后，井口食堂", "Twenty days later, the pithead canteen"),
    alt: [ALT({all: [NF("linked"), NF("origin_kin")]}, "二十天后，井口食堂。长桌，口粮，提奥坐在你对面，周围几十个人吃饭的节奏一模一样。\n你脑子里没有嗡鸣，只有他们一起唱歌时，胸口会轻轻一震。\n提奥说：“不急。家里人有的是耐心。”",
            "Twenty days later, the pithead canteen. Long tables, rations, Teo across from you; dozens around you eat in exactly the same rhythm.\nThere is no hum in your head. Only when they sing together does your chest give a faint shiver.\nTeo says: “No hurry. Family has all the patience in the world.”"),
          ALT(F("origin_kin"), "二十天后，井口食堂。长桌，口粮，提奥坐在你对面，周围几十个人吃饭的节奏一模一样。\n你生来就有的嗡鸣，从洞窟那天起近得像贴着耳朵，醒着睡着都在。\n提奥说：“这就是家。所有人都在你心里。”",
            "Twenty days later, the pithead canteen. Long tables, rations, Teo across from you; dozens around you eat in exactly the same rhythm.\nThe hum you were born with has sat right against your ear since the cavern, waking or sleeping.\nTeo says: “That's family. Everyone in your heart.”"),
          ADD(F("shutTeo"), "他是自己端着碗坐过来的。你关门那天的事，他一个字没提。", "He brought his bowl over himself. He says not a word about the shut door.")],
    text: L("二十天后，井口食堂。长桌，口粮，提奥坐在你对面，周围几十个人吃饭的节奏一模一样。\n那之后，你脑子里多了一阵很轻的嗡鸣。醒来时它在，下井时它在。\n提奥说：“这就是家。所有人都在你心里。”",
            "Twenty days later, the pithead canteen. Long tables, rations, Teo across from you; dozens around you eat in exactly the same rhythm.\nSince that night a soft hum lives in your head. There when you wake, there when you go down the shaft.\nTeo says: “That's family. Everyone in your heart.”"),
    choices: [
      C("“我从来没这么好过。”", "“I've never been better.”", "gsc_311", X({sanity: 8, corruption: 4, set: {content: true}},
        "这是真话。你吃得饱，睡得着，有人等你回家。",
        "It's true. You eat, you sleep, someone waits for you to come home.")),
      C("去深处的湿热里睡一觉", "Sleep in the warm damp of the deep face", "gsc_311", O(Q({taint: "nurgle", min: 25}, true), X({hp: 10, sanity: 3, taint: {nurgle: 65}},
        "你在最深的掌子面睡得像回到了娘胎。醒来时身上长了一层软软的绿，你一点也不想擦掉。",
        "You sleep at the deepest face as if back in the womb. You wake furred with soft green and don't want to wipe it off."))),
      C("找个安静的角落，想想你看见了什么", "Find a quiet corner and think about what you saw", "gsc_311", X({sanity: -6, set: {doubt: true}},
        "你坐了一整夜。那些甲壳、那些手，一样一样摆在你面前，摆得很清楚。",
        "You sit all night. The chitin, the hands, laid out before you one by one, very clearly."))
    ]};

  N.gsc_311 = {chapter: 3, scene: "underhive", speaker: VASK, foe: "enforcer", time: {d: 9}, jump: L("第九天，矿口出事", "The ninth day, trouble at the pithead"),
    alt: [ADD({flags: ["wire", "forgiven"]}, "瓦斯克手里拿着一卷录音：通讯珠被捏碎前的最后几秒。", "Vask holds a recording: the bead's last seconds before it was crushed."),
          ADD({all: [F("wire"), NF("forgiven")]}, "瓦斯克手里拿着一卷录音，是你领口那颗通讯珠录下的。", "Vask holds a recording, made by the bead in your collar."),
          ADD(F("toldVask"), "瓦斯克的口袋里，还揣着你说的那四道划痕。", "In Vask's pocket is still the page with your four scratches."),
          ADD(F("refusedVask"), "“你不肯帮我，”瓦斯克说，“我只好自己查。”", "“You wouldn't help,” Vask says. “So I looked for myself.”"),
          ADD(F("flinched"), "乔里隔着人群看了你一眼，没指望你。", "Across the crowd Jory glances at you, expecting nothing."),
          ADD({all: [F("origin_warden"), NF("toldMarr")]}, "母亲站在执法官后面，第一次看见你和霍林家站在一起。", "Your mother stands behind the enforcers, seeing you among the Hollins for the first time.")],
    text: L("第九天，矿口吵起来了：执法官押着乔里表哥，罪名是“变异”，第三只手被铐在背后。\n霍林家没人哭，没人闹。大娘只是看着你：\n“家里需要一个说话管用的人。”",
            "On the ninth day there's shouting at the pithead: enforcers have Cousin Jory, charged with mutation, his third arm cuffed behind his back.\nNo one in the Hollin house weeps or shouts. Ma only looks at you:\n“The family needs someone whose word counts.”"),
    choices: [
      C("去作证：那晚他和你在一起", "Testify he was with you that night", "gsc_312", O(X({renown: 8, sanity: -3, set: {alibi: true}},
        "瓦斯克听完你的证词，看了你很久，签了释放令。",
        "Vask hears you out, looks at you a long time, and signs the release."),
        {resultAlt: [RA(F("promisedJory"), "你答应过乔里会来，你来了。瓦斯克听完证词，看了你很久，签了释放令。",
                       "You told Jory you'd be there, and you are. Vask hears you out, looks at you a long time, and signs the release.")]})),
      C("请母亲把文件弄丢", "Ask your mother to lose the paperwork", "gsc_312", O(Q([{flag: "origin_warden"}, {flag: "toldMarr"}], true), X({renown: 10, sanity: -5, set: {marrHelped: true}},
        "母亲什么也没问。她欠霍林家一条命。",
        "Your mother asks nothing. She owes the Hollins a life."))),
      C("什么也不做", "Do nothing", "gsc_312", X({renown: -8, sanity: -4, set: {joryMaimed: true}},
        "你站在人群里，看着囚车开走。没有人怪你。没有人说话。",
        "You stand in the crowd and watch the van drive off. Nobody blames you. Nobody says anything."))
    ]};

  N.gsc_312 = {chapter: 3, scene: "hive_hab", speaker: JORY, time: {d: 7}, jump: L("一周后，乔里回家", "A week later, Jory comes home"), eventRoll: 0.35,
    alt: [ALT(F("joryMaimed"), "一周后，乔里被放了回来，少了一只手。\n他对你笑，还是那么温和。这比骂你更难受。\n霍林家照样摆了一桌。日子一天一天过去，你得在家里找一件自己的事做。",
            "A week later Jory is released, one arm fewer.\nHe smiles at you, as gentle as ever. That's worse than any curse.\nThe Hollins lay the table all the same. The days go by, and you need something of your own to do in the family."),
          ALT(F("marrHelped"), "第二天，乔里的档案不见了。一周后，他回了家。\n母亲没问一个字。她欠霍林家的那条命，还清了。\n日子一天一天过去，你得在家里找一件自己的事做。",
            "Next day Jory's file is gone. A week later, he's home.\nYour mother never asks a thing. The life she owed the Hollins is paid.\nThe days go by, and you need something of your own to do in the family."),
          ADD(F("alibi"), "乔里用第三只手拍你的背：“我欠你一回。”", "Jory claps your back with his third hand. “I owe you one.”")],
    text: L("一周后，乔里回家了。全家人都来抱你，汤锅冒着热气。\n他还是三只手，还是那样笑。\n日子一天一天过去，你得在家里找一件自己的事做。",
            "A week later Jory comes home. The whole family hugs you; the soup pot steams.\nHe still has three arms, still smiles the same.\nThe days go by, and you need something of your own to do in the family."),
    choices: [
      C("替家里管账，记清每一口人", "Keep the family's books, every mouth counted", "gsc_401", X({renown: 4, set: {yearsTally: true}},
        "账本一本接一本。每一个新生的孩子，都是你亲手登的记。",
        "Ledger after ledger. Every newborn child, you write in by hand.")),
      C("在井下带班，护着家里的孩子", "Run a crew below, and mind the young ones", "gsc_401", X({hp: -4, renown: 4, set: {yearsShaft: true}},
        "你带的班组，一半是表兄弟。塌方三次，你一个人也没丢。",
        "Half your crew are cousins. Three cave-ins, and you never lose a soul.")),
      C("继续给瓦斯克写报告", "Keep writing reports for Vask", "gsc_401", O(Q({flag: "vaskAgent"}, true), X({sanity: -4, set: {yearsReport: true}},
        "每个月一份。你写得越来越短，越来越像一首家里的歌。",
        "One a month. They grow shorter and shorter, more and more like a family song.")))
    ]};


  /* ============ Chapter 4 · Generations ============ */
  N.gsc_401 = {chapter: 4, scene: "hive_hab", speaker: null, time: {y: 12}, bridge: true,
    alt: [ADD(F("yearsTally"), "这些年你管着家里的账。每一个新生的孩子，都是你登的记。", "All these years you kept the family's books. Every newborn, you wrote in."),
          ADD(F("yearsShaft"), "这些年你在井下带班，手下一半是表兄弟。", "All these years you ran a crew below; half of them cousins."),
          ADD(F("yearsReport"), "这些年你每月给瓦斯克写一份报告，越写越短。", "All these years you wrote Vask a report each month, shorter every time."),
          ADD(F("joryMaimed"), "乔里少了一只手，还是天天来看你。", "Jory, one arm short, still drops by every day."),
          ADD(F("cameBack"), "自从接过提奥那碗汤，你每个星期天都回家吃饭。", "Since you took Teo's soup that morning, you've never missed a Sunday supper.")],
    text: L("十二年过去了，你眼角也有了细纹。霍林家又多了两百口人；不姓霍林、却星期天来吃饭的“兄弟”，有好几千。\n内尔十二岁，在街上跳绳，只是眼睛在灯下发紫。\n奥莎大娘快不行了。",
            "Twelve years pass; lines gather at the corners of your eyes. The Hollins have two hundred more mouths; the “brothers” who aren't Hollins but come to Sunday supper number in the thousands.\nNell is twelve, skipping rope in the street, only her eyes turn violet under lamps.\nMa Ossa is dying."),
    choices: [
      C("去陪大娘", "Go sit with Ma", "gsc_402", X({sanity: 2},
        "你推开她的房门。屋里很暗，很暖，一屋子人都给你让了座。",
        "You open her door. The room is dim and warm, and everyone in it makes room for you.")),
      C("带内尔去集市", "Take Nell to the market", "gsc_403", X({sanity: 3},
        "“大娘睡着呢，”内尔拽着你，“她说让我出去玩。”",
        "“Ma's asleep,” Nell says, tugging you. “She said I should go out and play.”"))
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

  N.gsc_403 = {chapter: 4, scene: "hive_hab", speaker: NELL, time: {h: 2}, eventRoll: 0.35,
    text: L("集市上，国教的游行队伍走过，举着双头鹰旗。内尔躲到你身后。\n一个小孩冲着同来的雷恩光秃秃的头皮喊：“变种！”\n雷恩只是把头巾拉紧。内尔攥着你的袖子：“他们为什么讨厌我们？”",
            "In the market an Ecclesiarchy procession passes under eagle banners. Nell hides behind you.\nA boy yells at the bare scalp of Wren, who came along: “Mutie!”\nWren only pulls her scarf tighter. Nell clutches your sleeve. “Why do they hate us?”"),
    choices: [
      C("揪住那个孩子的领子", "Grab the boy by the collar", "gsc_404", X({hp: -5, renown: 6, set: {brawl: true}, taint: {khorne: 45}},
        "那孩子吓哭了。他父亲冲过来，你们打成一团，直到执法官吹哨。内尔看你的眼神，亮得像看英雄。",
        "The boy bursts into tears. His father charges in and you brawl till the enforcers' whistles. Nell looks at you like a hero.")),
      C("“因为他们害怕。”", "“Because they're afraid.”", "gsc_404", X({sanity: 3, renown: 3, set: {toldNellFear: true}},
        "内尔想了想。“那等星之子来了，他们就不用怕了，对吧？”你没有回答。",
        "Nell considers. “Then when the Star Children come, they won't need to be afraid, right?” You don't answer.")),
      C("把内尔带走，不吭声", "Lead Nell away without a word", "gsc_404", O(X({sanity: -3},
        "内尔一路没说话。快到家时她才问：素脸的孩子，是不是也是变种。",
        "Nell is silent all the way. Near home she finally asks whether plain-faced children are mutants too."),
        {resultAlt: [RA(F("origin_kin"), "内尔一路没说话。快到家时她才问你：“我们俩，是不是也是变种？”",
                       "Nell is silent all the way. Near home she finally asks you, “Are we mutants too, you and me?”")]}))
    ]};

  N.gsc_404 = {chapter: 4, scene: "mine_shaft", speaker: MAGUS, time: {d: 3}, jump: L("三天后，葬礼在十三号矿井", "Three days later, the funeral in Shaft Thirteen"), gather: L("葬礼", "Funeral"),
    alt: [ADD(FN("gsc_403"), "那天你们从集市回来时，全屋的人同时停下了手。大娘走了。", "When you came back from the market that day, the whole house had stopped at once. Ma was gone."),
          ADD(F("askedOssa"), "主祭的悼词里说：“她问过自己选没选。她选了爱。”", "In the eulogy the Magus says: “She asked whether she chose. She chose love.”"),
          ADD(F("origin_kin"), "你母亲站在第三代的人群里，头巾系得很紧。", "Your mother stands among the third generation, her scarf tied tight.")],
    text: L("三天后，大娘的葬礼在十三号矿井最深处。几百个家人举着灯，从第一代到第四代，葬礼前后都在低声交换消息。\n主祭唱起挽歌，老祖宗的嗡鸣像一首摇篮曲，托着所有人。\n你从来没被这么多人爱过。",
            "Three days later Ma's funeral is held in the deepest level of Shaft Thirteen. Hundreds of kin hold lamps, first generation to fourth, murmuring news before and after.\nThe Magus sings the lament; the Grandsire's hum cradles everyone like a lullaby.\nYou have never been loved by so many."),
    choices: [
      C("跟着唱，唱到忘了自己", "Sing until you forget yourself", "gsc_405", X({corruption: 5, renown: 5, taint: {slaanesh: 50}},
        "你唱哑了嗓子，也不想停。散场时你只觉得空，空得想马上再来一次。",
        "You sing yourself hoarse and still don't want to stop. When it ends you feel hollow, aching for it to start again.")),
      C("数一数这里有多少代人", "Count how many generations are here", "gsc_405", X({sanity: -5, set: {countedGenerations: true}},
        "四代，六百一十二个人。第一代越来越少，第四代越来越多，一代比一代更像人。",
        "Four generations, six hundred and twelve souls. Fewer of the first each year, more of the fourth, each more human than the last.")),
      C("站在后面，默默送别", "Stand at the back and say goodbye quietly", "gsc_405", X({sanity: 4},
        "你想起第一次喝她的汤。那一碗是真的。不管别的是什么，那一碗是真的。",
        "You remember the first bowl of her soup. That was real. Whatever else is true, that bowl was real.")),
      C("跟主祭走向那道岩缝", "Follow the Magus to the crack in the rock", "gsc_404b", O(Q({flag: "secondChance"}, true), X({sanity: -3},
        "散场时，主祭朝你招了招手。“大娘走前说，你还欠老祖宗一次见面。”",
        "As the mourners leave, the Magus beckons. “Ma said before she went: you still owe the Grandsire a visit.”")))
    ]};

  N.gsc_404b = {chapter: 4, scene: "cult_shrine", speaker: GRANDSIRE, time: {h: 1},
    alt: [ADD(F("fled"), "你跑过一次。它记得你的背影。", "You ran from it once. It remembers your back."),
          ADD(F("refusedKiss"), "你说过还没准备好。它一直等到了现在。", "You said you weren't ready. It has waited until now.")],
    text: L("黑暗里，那个巨大的、很老的东西又一次低下头来。\n它很老了，甲壳上落满了灰，好像一直在这里等你。\n主祭在你身后轻声说：“这一回，别再让祂等了。”",
            "In the dark, the vast and ancient thing bows its head to you once more.\nIt is very old; dust lies on its chitin, as if it has waited here all along.\nBehind you the Magus murmurs: “This time, don't keep it waiting.”"),
    effects: {sanity: -5, set: {linked: true}},
    codex: ["gsc_patriarch"],
    choices: [
      C("接受赐福", "Accept the blessing", "gsc_405", X({corruption: 15, renown: 10, set: {blessed: true, carrier: true}},
        "很暖，然后什么也不记得了。醒来时，你脖子上多了一个很小的印记。",
        "Warmth, and then nothing at all. You wake with a tiny mark on your neck.")),
      C("“我还是不能。”", "“I still can't.”", "gsc_405", X({renown: -6, sanity: 3, set: {refusedTwice: true}},
        "它没有生气。它只是慢慢转过头，去听天上的什么声音。",
        "It isn't angry. It only turns its head slowly away, listening to something in the sky."))
    ]};

  N.gsc_405 = {chapter: 4, scene: "manufactorum", speaker: WREN, time: {d: 30}, jump: L("葬礼过了一个月", "A month after the funeral"),
    alt: [ADD(F("taughtWren"), "“你教过我写字，”雷恩说，“我信你的手。”", "“You taught me to write,” Wren says. “I trust your hands.”"),
          ADD(F("smuggler"), "“你当年改过二十箱的账，”她笑，“这回换你开车。”", "“You fixed the books on twenty crates once,” she grins. “This time you drive.”")],
    text: L("葬礼过了一个月，雷恩穿着防卫军制服来找你，头巾塞在军帽里。\n“防卫军里有我们四十个军官和士官。”她指着一辆卡车：“这些箱子得运进军械库。”\n今天检查站当班的是雷耶斯中尉，那个不收贿的。",
            "A month after the funeral, Wren comes to you in Planetary Defence Force uniform, scarf tucked under her cap.\n“Forty of our officers and sergeants in the PDF.” She points at a truck. “These crates have to get into the armoury.”\nToday's checkpoint is Lieutenant Reyes's. The one who takes no bribes."),
    codex: ["gsc_pdf"],
    choices: [
      C("开车过检查站", "Drive it through the checkpoint", null, O(Q({notFlag: "taughtWren"}, true), R(0.55, "renown", "gsc_408", "gsc_407",
        RR("雷耶斯中尉被叫去接电话，哨兵挥手放行，左手手套里好像不止五根手指。", "Reyes is called away to the vox; the sentry waves you on, his gloved left hand holding more than five fingers.",
           "雷耶斯中尉亲自掀开了油布。她看了你很久，然后叫来了执法官。", "Lieutenant Reyes lifts the tarp herself. She looks at you a long time, then calls the enforcers.")), {effects: {set: {smuggler: true}}})),
      C("开车，照雷恩教的路线走", "Drive it, by the route Wren taught you", null, O(Q({flag: "taughtWren"}, true), R(0.7, "renown", "gsc_408", "gsc_407",
        RR("雷恩算准了换岗的那一分钟。哨兵挥手放行，箱子进了军械库。", "Wren timed the shift change to the minute. The sentry waves you on; the crates reach the armoury.",
           "雷耶斯中尉提前回来了。她掀开油布，看了你很久，叫来了执法官。", "Lieutenant Reyes is back early. She lifts the tarp, looks at you a long time, and calls the enforcers.")), {effects: {set: {smuggler: true}}})),
      C("“我不干。”", "“I won't do it.”", "gsc_408", X({renown: -8, set: {refusedTruck: true}},
        "雷恩没生气，只是有点伤心。“没关系，”她说，“我找别人。”第二天，你的好班没了。",
        "Wren isn't angry, only a little hurt. “That's fine,” she says. “I'll find someone else.” Next day, your good shifts are gone."))
    ]};

  N.gsc_407 = {chapter: 4, scene: "underhive", speaker: VASK, time: {h: 6},
    alt: [ADD(F("brawl"), "“集市上打架的也是你，”他说，“我记着呢。”", "“The market brawl was you too,” he says. “I remember.”"),
          ADD(F("kinLedger"), "“又是二十箱，”他说，“十二年前账上少的那批，我也一直记着。”", "“Twenty crates again,” he says. “I've remembered the last twenty too.”"),
          ADD(F("yearsReport"), "“十二年的报告，”他把那摞纸摔在桌上，“一个字没提这个。”", "“Twelve years of reports,” he slams the stack down, “and not one word of this.”")],
    text: L("瓦斯克老了，却更硬了。他把你按在审讯椅上。\n“二十箱军用炸药。谁给你的？说出名字，你还能回家。”\n墙上的钟走得很慢。",
            "Vask is older now, and harder. He pins you to the interrogation chair.\n“Twenty crates of military explosive. Who gave them to you? Names, and you go home.”\nThe wall clock ticks slowly."),
    effects: {hp: -12},
    choices: [
      C("说出雷恩的名字", "Give him Wren's name", "gsc_407b", X({renown: -20, sanity: -8, set: {traitor: true, wronged_wren: true}},
        "你说出了雷恩的名字。瓦斯克放了你，抓人的却扑了空：嗡鸣早一步传开了。那一夜，几百个声音同时沉默。",
        "You say Wren's name. Vask lets you go, but the arrest team finds nothing: the hum spread it first. That night hundreds of voices fall silent at once.")),
      C("咬紧牙关，一个字也不说", "Clench your teeth. Not one word", "gsc_408", X({hp: -10, renown: 10, set: {heldOut: true}},
        "三天后，一个左手戴手套的看守打开了门：“家里人让我来接你。”第二天矿口贴出你的通缉令，当晚就被撕了。",
        "Three days later a guard unlocks the door, left hand gloved. “The family sent me for you.” Next day your wanted notice goes up at the pithead; by night someone has torn it down."))
    ]};

  N.gsc_407b = {chapter: 4, scene: "gsc_chapel", speaker: MAGUS, time: {h: 2},
    text: L("你没能回去。三个戴兜帽的人在分局门口等你，把你领进了礼拜堂。\n主祭没有骂你。他把手按在你额头上，像给发烧的孩子擦汗。\n“家里人都知道了，”他说，“我帮你把这件事忘掉。”",
            "You never make it home. Three hooded figures wait at the precinct door and walk you to the chapel.\nThe Magus doesn't scold. He lays a hand on your brow like someone wiping a feverish child's face.\n“The family all know,” he says. “Let me help you forget it.”"),
    effects: {corruption: 8, sanity: -8, set: {correctedOnce: true}},
    choices: [
      C("闭上眼睛", "Close your eyes", "gsc_408", X({renown: 6},
        "醒来时你躺在自己床上。你记得去了分局，记不得说了什么。只是一想起雷恩，胸口就发紧。",
        "You wake in your own bed. You remember the precinct, not what you said there. Only, when you think of Wren, your chest tightens."))
    ]};

  N.gsc_408 = {chapter: 4, scene: "hive_hab", speaker: BRANN, time: {d: 10}, jump: L("十天后，回到工棚", "Ten days later, back in the barracks"), gather: L("工棚", "Barracks"),
    alt: [ADD(F("workedWithBrann"), "“我只跟一起下过深处的人说，”他说。", "“I only tell those who've worked the deep with me,” he says."),
          ADD(F("favoured"), "他犹豫了很久。你吃霍林家的好班，他不太信你。", "He hesitates a long while. You've had the Hollins' good shifts; he doesn't quite trust you."),
          ADD(F("hesperQuestion"), "你想起母亲那年夜里哭的，就是这种事。", "You remember your mother weeping that night, over just this kind of thing."),
          ADD(F("correctedOnce"), "你额头还凉着。有件事你记不清了。", "Your brow is still cool. There's something you can't quite remember."),
          ADD(F("refusedTruck"), "推掉那车箱子以后，你就只剩深处的班了。他看见过你。", "Since you turned down the truck you've had only deep shifts. He's noticed.")],
    text: L("十天后，工棚里人挤人，几个老矿工在补衣服。老布兰在铺位间拦住你：\n“我表亲在赫斯珀种麦子。那儿也有一大家子，紫眼睛，笑得一模一样。”\n“今年春天天变紫了。上个月，帝国把整颗星烧了。”",
            "Ten days later the barracks are packed; a few old miners sit mending clothes. Old Brann stops you between the bunks and lowers his voice:\n“My cousin farmed wheat on Hesper. There was a big family there too. Violet eyes, all smiling the same.”\n“This spring the sky turned purple. Last month the Imperium burned the whole world.”"),
    codex: ["place_hesper"],
    choices: [
      C("“天变紫以后，发生了什么？”", "“What happened when the sky turned purple?”", "gsc_409", X({sanity: -5, set: {heardBrann: true}},
        "布兰把一块旧数据板塞给你。“我表亲最后寄来的。我不敢看第二遍。”",
        "Brann presses an old data-slate on you. “The last thing my cousin sent. I couldn't look twice.”")),
      C("把他的话告诉家里人", "Tell the family what he said", "gsc_409", X({renown: 6, sanity: -4, set: {soldBrann: true, wronged_brann: true}},
        "你把布兰的话告诉了大人们。他们谢谢你。三天后布兰回来了，笑得和所有人一模一样。",
        "You repeat Brann's words to the elders. They thank you. Three days later Brann is back, smiling exactly like everyone else.")),
      C("陪他去黑肺病房坐坐，那里暖和", "Sit with him in the warm black-lung ward", "gsc_409", O(Q({taint: "nurgle", min: 30}, true), X({hp: 5, sanity: 3, taint: {nurgle: 60}},
        "病房里又暖又潮，咳嗽声像摇篮曲。布兰说了什么，你没听进去。你睡得很香，醒来身上一股甜味。",
        "The ward is warm and damp; the coughing is a lullaby. Whatever Brann says, you don't hear it. You sleep soundly and wake smelling sweet."))),
      C("“老头子，少说两句。”", "“Keep it to yourself, old man.”", "gsc_409", X({sanity: 3, set: {brannSky: true}},
        "布兰点点头，好像早料到了。“那你就别抬头看天，”他说，“能不看就别看。”",
        "Brann nods as if he expected it. “Then don't look up,” he says. “Not if you can help it.”"))
    ]};

  N.gsc_409 = {chapter: 4, scene: "gsc_chapel", speaker: MAGUS, time: {d: 15}, jump: L("半个月后，礼拜堂", "A fortnight later, the chapel"), eventRoll: 0.4,
    alt: [ADD(F("askedDay"), "你想起高祖母那年说的：为了那一天。", "You remember what your great-great-grandmother said that year: for the Day.")],
    text: L("半个月后，主祭站在圣像前，声音里有压不住的狂喜。\n“老祖宗感觉到了：星之子已经在路上。他们听见了我们。”\n“从今夜起，我们要每晚歌唱，为他们指路。”",
            "A fortnight later the Magus stands before the icon, rapture breaking through his voice.\n“The Grandsire feels it: the Star Children are on their way. They have heard us.”\n“From tonight we sing every night, to light their path.”"),
    choices: [
      C("和大家一起欢呼", "Cheer with everyone", "gsc_501", X({renown: 5, corruption: 3},
        "几百人一起欢呼，屋顶的灰簌簌往下掉。内尔骑在雷恩肩上，笑得最响。",
        "Hundreds cheer at once; dust sifts from the ceiling. Nell rides on Wren's shoulders, laughing loudest.")),
      C("看着人群，想起布兰的话", "Watch the crowd and remember Brann", "gsc_501", X({sanity: -4, set: {doubtSong: true}},
        "所有人都在笑，笑得一模一样。你也在笑。你花了好一会儿才发现。",
        "Everyone is smiling, all the same smile. So are you. It takes you a while to notice.")),
      C("回去把数据板藏进矿灯电池仓", "Go hide the slate in your lamp's battery case", "gsc_501", O(Q({flag: "heardBrann"}, true), X({sanity: -3, set: {slateHidden: true}},
        "电池仓刚好塞得下。从那以后，你的灯总是有点暗。",
        "It just fits in the battery case. From then on, your lamp always burns a little dim."))),
      C("把数据板交给主祭", "Hand the slate to the Magus", "gsc_501", O(Q({flag: "heardBrann"}, true), X({renown: 8, corruption: 4, set: {gaveSlate: true}},
        "主祭接过数据板，没有看，只摸了摸你的头。“你做得对，”他说，“别让它吓着你。”",
        "The Magus takes the slate without looking at it and strokes your hair. “You did right,” he says. “Don't let it frighten you.”")))
    ]};


  /* ============ Chapter 5 · The Call ============ */
  N.gsc_501 = {chapter: 5, scene: "gsc_chapel", speaker: MAGUS, time: {y: 3}, bridge: true, gather: L("礼拜堂", "Chapel"),
    grudgeLine: {npc: "brann", text: L("歌声里多了一个老人，是布兰。他笑得和所有人一样，眼睛却一直盯着你。", "Among the singers is an old man: Brann. He smiles like everyone else, but his eyes never leave you.")},
    alt: [ADD(F("slateHidden"), "布兰的数据板，在你的矿灯电池仓里躺了三年，你一次也没敢打开。", "Brann's slate has lain in your lamp's battery case three years. You've never dared open it."),
          ADD(F("gaveSlate"), "主祭收下数据板以后，再没提过它。", "The Magus never mentioned the slate again after you gave it to him."),
          ADD(F("doubtSong"), "你还记得那天所有人一模一样的笑。", "You still remember that day: everyone smiling the same smile.")],
    text: L("三年过去了。每天夜里，粮仓底下的礼拜堂都挤满了人，几百个声音合成一个，从地底冲上天空。\n主祭站在中间，眼睛亮得像两盏紫灯。\n唱完以后，你的头总要疼到天亮。",
            "Three years pass. Every night the chapel under the grain store is packed, hundreds of voices become one and rush up from the deep into the sky.\nThe Magus stands at the centre, eyes lit like two violet lamps.\nAfterward your head aches until dawn."),
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

  N.gsc_502 = {chapter: 5, scene: "hive_spire", speaker: ASTRO, foe: null, time: {d: 20}, jump: L("二十天后，雷耶斯来矿上要人", "Twenty days on, Reyes comes for hands"),
    alt: [ADD(F("origin_warden"), "执法局把你借调了过去：是你母亲点的名。", "The precinct lent you out for it. Your mother put your name down.")],
    text: L("二十天后，雷耶斯中尉来矿上要人：星语塔的伺服梯坏了，得找几个有力气的抬人。\n塔顶，老星语者瞎眼流着血：“有影子……泰拉听不见了。”\n“它在吃光，”他说，“它在吃所有的声音。”",
            "Twenty days later Lieutenant Reyes comes to the mine for hands: the astropathic tower's servo-lift is broken and they need strong backs to carry someone.\nAt the top the old astropath's blind eyes bleed. “A shadow... Terra can't hear.”\n“It's eating the light,” he says. “Eating every voice.”"),
    codex: ["xenos_shadow_in_warp"],
    choices: [
      C("握住他的手，听他说完", "Hold his hand and hear him out", "gsc_503", X({sanity: -6, set: {astropath: true}, taint: {tzeentch: 50}},
        "他看见了很多东西：紫色的天，下雨一样落下的星星，还有一行很小的、闪着蓝光的字，不知是谁写的。",
        "He has seen so much: a purple sky, stars falling like rain, and one small line of blue-lit words, written by no one he knows.")),
      C("读他眼里那行蓝色的字", "Read the blue line in his eyes", "gsc_503", O(Q({taint: "tzeentch", min: 30}, true), X({sanity: -5, renown: 3, taint: {tzeentch: 65}},
        "那行字是写给你的，只给你：“影子总有缝。”老人笑了，好像终于把信送到了。",
        "The line is for you, only you: THE SHADOW ALWAYS HAS A CRACK. The old man smiles, as if a letter has finally been delivered."))),
      C("给他注射镇静剂", "Give him a sedative", "gsc_503", X({renown: 3, sanity: 3, set: {astroCalm: true}},
        "他慢慢睡着了，嘴里还在念：“影子……影子……”睡着前，他问了你的名字。",
        "He drifts off still murmuring, “Shadow... shadow...” Before he sleeps, he asks your name.")),
      C("退到门口", "Back away to the door", "gsc_503", X({sanity: -3},
        "你脑子里的嗡鸣忽然很高兴，像在说：对，就是这样。你一点也不高兴。",
        "The hum in your head is suddenly delighted, as if saying: yes, exactly so. You are not delighted at all."))
    ]};

  N.gsc_503 = {chapter: 5, scene: "hive_spire", speaker: REYES, time: {d: 10}, gather: L("候船厅", "Departure hall"),
    text: L("一个月没有船来了。星港候船厅里睡满滞留的人，公告屏一闪一闪。港里只剩“忍耐号”，去奥雷克斯二号的老矿船。\n雷耶斯中尉坐到你旁边：“外面出事了。”\n“你家里人，怎么一点也不慌？”",
            "A month, and not one ship. The starport departure hall is full of stranded people asleep on benches, the notice screen flickering. Only the Endurance is left, an old ore-hauler bound for Aurex Secundus.\nLieutenant Reyes sits beside you. “Something's wrong out there.”\n“Why aren't your people worried at all?”"),
    choices: [
      C("去找矿船船长打听舱位", "Ask the hauler captain about berths", "gsc_504", X({renown: -3, set: {knowsHauler: true}},
        "船长是个独眼老头。“我这船能装四十个人，不算矿石。”他眯起眼，“等谁？”",
        "The captain is a one-eyed old man. “She'll take forty people, not counting ore.” He squints. “Waiting for someone?”")),
      C("“我们信帝皇。”", "“We trust the Emperor.”", "gsc_504", X({renown: 4, set: {reyesWary: true}},
        "雷耶斯中尉看了你很久。“哪一个？”她问，然后在本子上记了你的名字。",
        "Reyes looks at you a long while. “Which one?” she asks, and writes your name in her notebook.")),
      C("告诉她：快走", "Tell her: get out", "gsc_504", X({sanity: 3, renown: -5, set: {warnedReyes: true}},
        "她没有问为什么。她只是把一张星港通行证塞进你手里。“你也是。”",
        "She doesn't ask why. She just presses a starport pass into your hand. “You too.”"))
    ]};

  N.gsc_504 = {chapter: 5, scene: "hive_hab", speaker: NELL, time: {d: 5}, jump: L("五天后的半夜", "Five days later, at midnight"), eventRoll: 0.35,
    alt: [ADD(F("toldNellFear"), "“你说过，他们讨厌我们是因为害怕，”她说，“那我现在也怕了。”", "“You said they hate us because they're afraid,” she says. “Now I'm afraid too.”")],
    text: L("五天后，内尔半夜来敲你的门，光着脚。她十五岁了。\n“我又梦见星之子了。他们好大，好饿。”\n“他们饿成那样，”她小声问，“也是爱吗？”",
            "Five days later Nell knocks on your door at midnight, barefoot. She is fifteen now.\n“I dreamed of the Star Children again. They're so big. So hungry.”\n“If they're that hungry,” she whispers, “is it still love?”"),
    choices: [
      C("“是爱。睡吧。”", "“It's love. Go to sleep.”", "gsc_505", X({corruption: 3, renown: 4},
        "她点点头，回去睡了。你一夜没合眼。",
        "She nods and goes back to bed. You don't sleep at all.")),
      C("“把你的梦全讲给我听。”", "“Tell me the whole dream.”", "gsc_505", X({sanity: -5, set: {nellDream: true}},
        "她讲了很久：天上的嘴，落下的牙，所有人都在笑，然后都不见了。她讲完就哭了。",
        "She talks a long time: mouths in the sky, falling teeth, everyone smiling, then everyone gone. When she finishes, she cries.")),
      C("抱抱她，什么也不说", "Hug her and say nothing", "gsc_505", X({sanity: 4, set: {huggedNell: true}},
        "她在你怀里慢慢不抖了。你闻到她头发上有矿灰和肥皂的味道，像任何一个孩子。",
        "Slowly she stops shaking in your arms. Her hair smells of ore dust and soap, like any child's."))
    ]};

  N.gsc_505 = {chapter: 5, scene: "underhive", speaker: null, time: {d: 2},
    alt: [ADD(F("nellDream"), "内尔说的那些嘴、那些牙，你一闭眼就看见。", "Nell's mouths and teeth are there the moment you close your eyes."),
          ADD(F("content"), "嗡鸣轻轻地提醒你：你说过，你从来没这么好过。", "The hum gently reminds you: you said you'd never been better."),
          ADD(F("doubt"), "你想起那一夜，在角落里把甲壳和手一样样想清楚。", "You think of that night in the corner, thinking the chitin and the hands through one by one."),
          ADD(F("soldBrann"), "布兰回来以后，再也没提过赫斯珀。是你让他闭的嘴。", "Since Brann came back he's never mentioned Hesper. You shut him up.")],
    text: L("你睡不着。布兰的话、星语者的话、内尔的梦，在你脑子里绕成一团。\n嗡鸣轻轻地劝你：别想了，回家吧。\n可你想知道，星之子到底是什么。",
            "You can't sleep. Brann's words, the astropath's, Nell's dream, all tangle in your head.\nThe hum gently coaxes: stop thinking. Come home.\nBut you want to know what the Star Children really are."),
    choices: [
      C("从矿灯里取出布兰的数据板", "Take Brann's slate out of your lamp", "gsc_506", O(Q({flag: "slateHidden"}, true), X({sanity: -3, set: {truthSlate: true}},
        "三年的灰从电池仓里抖出来。数据板还亮，电量只剩一格。",
        "Three years of dust shake out of the battery case. The slate still lights, one bar of charge left."))),
      C("回想星语者看见的东西", "Go back over what the astropath saw", "gsc_506", O(Q({flag: "astropath"}, true), X({sanity: -3, set: {truthAstro: true}},
        "紫色的天，下雨一样的星星。你把他的每个字都写了下来，拼成了一幅画。",
        "Purple sky, stars falling like rain. You write down his every word until they make a picture."))),
      C("去矿务署的旧档案室翻", "Dig through the tally-office archives", null, R(0.4, "sanity", "gsc_506", "gsc_510",
        RR("在一堆积灰的检疫报告底下，你找到了几张赫斯珀的照片。", "Beneath a heap of dusty quarantine reports, you find picts from Hesper.",
           "你翻了一整夜，什么也没找到。嗡鸣陪着你，你梦见紫光像一双双手，把家人接走。", "You search all night and find nothing. The hum lulls you; you dream of violet light like hands, lifting the family away."))),
      C("别想了，回家", "Stop thinking. Go home", "gsc_510", X({corruption: 6, renown: 3},
        "你做了一个很甜的梦：紫光从天上落下，把所有家人都抱起来。醒来时满脸是泪，笑着的。",
        "You dream sweetly: violet light falls and lifts every member of the family. You wake with tears on your face, smiling."))
    ]};

  N.gsc_506 = {chapter: 5, scene: "underhive", speaker: STARS, foe: "gaunt", time: {h: 2},
    alt: [ALT(F("truthSlate"), "布兰表亲录下的最后画面：赫斯珀，紫色的天，无数光点落下。\n一大家子人站在麦田里迎接，举着四只手的帝皇像。\n然后，下来的东西有太多的腿、太多的牙。它们没有停。家人们也没有逃。",
            "The last footage Brann's cousin sent: Hesper, a purple sky, countless lights descending.\nA whole family stands in the wheat to greet them, holding up the four-armed icon.\nThen what came down: too many legs, too many teeth. They did not stop. The family did not run."),
          ALT(F("truthAstro"), "你把星语者的话一句句拼起来：紫色的天，像雨一样落下的星星，一张比天还大的嘴。\n它不认识任何歌，不认识任何家。它只是饿。\n你忽然明白了，星之子是什么。",
            "You piece the astropath's words together: a purple sky, stars falling like rain, a mouth bigger than the sky.\nIt knows no song, no family. It is only hungry.\nSuddenly you understand what the Star Children are."),
          ADD(F("hesperQuestion"), "你母亲那年为之哭泣的，就是这样一个家。", "This is the kind of family your mother wept for, that year.")],
    text: L("检疫报告里夹着赫斯珀的最后几张照片：紫色的天，无数光点落下。\n一大家子人站在麦田里迎接，举着四只手的帝皇像。\n然后，下来的东西有太多的腿、太多的牙。它们没有停。家人们也没有逃。",
            "Tucked into the quarantine reports are Hesper's last picts: a purple sky, countless lights descending.\nA whole family stands in the wheat to greet them, holding up the four-armed icon.\nThen what came down: too many legs, too many teeth. They did not stop. The family did not run."),
    effects: {sanity: -15, set: {knowsTruth: true}},
    codex: ["xenos_tyranid", "gsc_star_children"],
    choices: [
      C("看那行蓝色的小字", "Read the small blue line", "gsc_510", O(Q({taint: "tzeentch", min: 40}, true), X({sanity: -6, renown: 4, taint: {tzeentch: 60}},
        "那行字不在画面上，在你眼睛里：“他们是饭。你不必是。”你笑了，笑得不像任何一个家人。",
        "The line isn't in the picture but in your eyes: THEY ARE THE MEAL. YOU NEED NOT BE. You smile, unlike any of the family."))),
      C("去告诉主祭", "Go tell the Magus", "gsc_508", X({renown: 2},
        "他会懂的，你想。他是最爱家人的人。",
        "He'll understand, you think. No one loves the family more.")),
      C("去告诉提奥", "Go tell Teo", "gsc_509", X({renown: 2},
        "你在升降口等到他收工。他看见你的脸，就放下了矿灯。",
        "You wait at the lift-head until his shift ends. One look at your face and he sets down his lamp.")),
      C("谁也不说", "Tell no one", "gsc_510", X({sanity: -5, set: {secretTruth: true}},
        "你把看见的东西锁在心里。那天晚饭，你笑得和所有人一模一样。",
        "You lock what you saw away inside. At supper you smile exactly like everyone else."))
    ]};

  N.gsc_508 = {chapter: 5, scene: "gsc_chapel", speaker: MAGUS, time: {h: 3},
    text: L("主祭听你说完，眼里涌出泪来。是喜悦的泪。\n“你看见了吗？他们被接走了，变成了星之子的一部分。还有比这更深的爱吗？”\n他把手按在你额头上：“别怕。我帮你看清楚。”",
            "The Magus hears you out, and tears spring to his eyes. Tears of joy.\n“Don't you see? They were taken up, made part of the Star Children. Is there any deeper love?”\nHe lays a hand on your brow. “Don't be afraid. I'll help you see clearly.”"),
    choices: [
      C("让他帮你“看清楚”", "Let him help you “see clearly”", "gsc_510", X({corruption: 10, sanity: 5, set: {knowsTruth: false, mended: true}},
        "他的手很凉。你脑子里有什么东西被轻轻抚平了。你看见的，是升天。一定是。",
        "His hand is cool. Something in your mind is smoothed flat. What you saw was an ascension. It must have been.")),
      C("咬紧牙关，守住你看见的", "Grit your teeth. Hold on to what you saw", null, R(0.45, "sanity", "gsc_510", "gsc_508a",
        RR("你把那幅画死死抓在脑子里。他的手指滑开了，看上去有点惊讶。", "You clutch that image in your mind. His fingers slide off. He looks a little surprised.",
           "嗡鸣涌进来，那幅画开始变得柔和、美丽……", "The hum floods in; the image starts to soften, grow beautiful...")))
    ]};

  N.gsc_508a = {chapter: 5, scene: "gsc_chapel", speaker: MAGUS, time: {h: 1},
    text: L("你咬破了舌头。等主祭松开手，你只留住了一半：\n天是紫的。它们很饿。\n别的，都化成了一片暖光。主祭擦掉你嘴角的血：“好孩子，睡一觉就好了。”",
            "You bite through your tongue. When the Magus lets go, you have kept only half of it:\nThe sky is violet. They are hungry.\nThe rest has melted into warm light. He wipes the blood from your lip. “Good child. Sleep, and it will pass.”"),
    effects: {sanity: -5, set: {halfTruth: true, knowsTruth: false}},
    choices: [
      C("把那两句话刻进心里", "Carve those two lines into your heart", "gsc_510", X({sanity: -2},
        "天是紫的。它们很饿。你一遍一遍地念，直到睡着。",
        "The sky is violet. They are hungry. You repeat it, over and over, until you sleep."))
    ]};

  N.gsc_509 = {chapter: 5, scene: "hive_hab", speaker: TEO, time: {h: 3}, eventRoll: 0.35,
    text: L("提奥听你说完，坐了很久。他老了，手背上的硬皮更厚了。\n“如果这是真的，”他说，“那我们这几十年……”\n他没说完。远处礼拜堂又开始唱了，他的嘴唇不自觉地跟着动。",
            "Teo hears you out and sits a long time. He's old now; the hard skin on his hands has thickened.\n“If this is true,” he says, “then all these decades...”\nHe doesn't finish. Far off, the chapel begins to sing, and his lips move along without meaning to."),
    effects: {sanity: -5},
    choices: [
      C("“帮我救孩子们。”", "“Help me save the children.”", "gsc_510", O(X({renown: 4, set: {teoKnows: true}},
        "提奥抹了把脸。“孩子们，”他重复，像抓住一根绳子，“对。先救孩子们。”",
        "Teo wipes his face. “The children,” he repeats, like grabbing a rope. “Yes. The children first.”"),
        G("teo", "提奥想起你当年对他做的事，迟迟才点头。", "Teo remembers what you once did to him, and is slow to nod.", 0, {sanity: -4}))),
      C("“忘了吧。”", "“Forget it.”", "gsc_510", X({sanity: -4, set: {teoForgot: true}},
        "他点点头，好像松了口气。第二天他照常唱歌，只是唱错了一句。",
        "He nods, almost relieved. Next day he sings as always, only he gets one line wrong."))
    ]};

  N.gsc_510 = {chapter: 5, scene: "cult_shrine", speaker: PRIMUS, time: {d: 6}, jump: L("第六天，首领召集", "The sixth day, the Primus's muster"), gather: L("集会", "Muster"),
    alt: [ADD(F("mended"), "你觉得一切都很美，连首领的疤也是。", "Everything seems beautiful to you, even the Primus's scars."),
          ADD(F("secretTruth"), "你知道的事在心里发烫。你笑得和所有人一样。", "What you know burns inside you. You smile like everyone else."),
          ADD(F("teoKnows"), "提奥站在你旁边，没有看你。", "Teo stands beside you and does not look at you."),
          ADD(F("unproven"), "首领看你的眼神，像看一块还没炼过的矿。", "The Primus looks at you like ore not yet smelted."),
          ADD(F("fist"), "“扛得住的那个，”首领看了看你的拳头。", "“The one who stood,” the Primus says, glancing at your fists."),
          ADD(F("heldOut"), "“分局三天，一个字没说，”首领点点头。", "“Three days in the precinct, not a word,” the Primus nods."),
          ADD(F("refusedTwice"), "“两次拒绝老祖宗的人，”首领说，“也有用处。”", "“Twice you refused the Grandsire,” says the Primus. “You have uses too.”")],
    text: L("第六天，哈斯克首领在洞窟里召集能扛枪的人。这场集会挤了几百人。他也老了，骨棱上全是疤。\n“第一道紫光出现的时候，就是那一天。执法局、星港、总督府、防卫军营地。”\n“每个人都有位置。”",
            "On the sixth day Primus Hask calls everyone who can carry a gun to a muster in the cavern. Hundreds pack it. He's old too, his ridges crossed with scars.\n“When the first violet light shows, that is the Day. Precinct, starport, governor's house, PDF barracks.”\n“Everyone has a place.”"),
    choices: [
      C("去执法局的爆破组", "Join the precinct demolition team", "gsc_600", O(Q({notFlag: "traitor"}, true), X({renown: 4, set: {teamPrecinct: true}},
        "首领把一卷引线拍在你手里。“你在那栋楼里被审过，记得每一道门。”",
        "The Primus slaps a coil of fuse into your hand. “You've been questioned in that building. You know every door.”"),
        {resultAlt: [RA(F("origin_warden"), "首领把一卷引线拍在你手里。“你在那栋楼里长大。”", "The Primus slaps a coil of fuse into your hand. “You grew up in that building.”")]})),
      C("去星港的夺港组", "Join the starport team", "gsc_600", O(Q({notFlag: "traitor"}, true), X({renown: 4, set: {teamPort: true}},
        "“星港，”首领点头，“守住矿船，谁也不准走。”",
        "“The starport,” the Primus nods. “Hold the hauler. Nobody leaves.”"),
        {resultAlt: [RA(F("drilled"), "“星港，”首领点头，“你当班长。守住矿船，谁也不准走。”", "“The starport,” the Primus nods. “You lead the squad. Hold the hauler. Nobody leaves.”")]})),
      C("“让我守着孩子们。”", "“Let me guard the children.”", "gsc_600", O(X({renown: -2, set: {teamChildren: true}},
        "首领盯了你一会儿。“孩子们不需要守，”他说，“不过，随你。”",
        "The Primus stares a moment. “The children don't need guarding,” he says. “But as you like.”"),
        {resultAlt: [RA(F("traitor"), "“报过雷恩名字的人，”首领说，“只配看孩子。有人会看着你。”", "“Someone who gave up Wren's name,” says the Primus, “minds children. And someone minds you.”")]}))
    ]};


  /* ============ Chapter 6 · The Inquisitor ============ */
  N.gsc_600 = {chapter: 6, scene: "hive_spire", speaker: null, foe: "guardsman", time: {d: 40}, bridge: true,
    alt: [ADD(F("reyesWary"), "雷耶斯中尉在舷梯下迎他，朝你的方向指了指。", "Lieutenant Reyes meets him at the ramp, and points your way."),
          ADD(F("warnedReyes"), "雷耶斯中尉在人群里看见你，轻轻摇了摇头。", "Lieutenant Reyes spots you in the crowd and gives a small shake of the head."),
          ADD(F("teamPort"), "你本来是来看夺港组的位置的。", "You'd come to look over the starport team's posts."),
          ADD(F("teamPrecinct"), "你兜里还揣着首领给的那卷引线。", "The Primus's coil of fuse is still in your pocket.")],
    text: L("四十天后，一艘黑船硬闯过影子，降在矿区星港。船身结着霜，听说半船人都疯了。\n它循着赫斯珀的教训来，也循着一封旧信：十五年前，卢斯克神父寄出的那封。\n下船的人叫索恩，审判官。",
            "Forty days later a black ship forces its way through the Shadow and lands at the district starport. Its hull is rimed with frost; they say half the crew went mad.\nIt came following Hesper's lesson, and an old letter: the one Father Lusk posted fifteen years ago.\nThe man who steps off is called Thorne. An Inquisitor."),
    codex: ["imp_inquisition"],
    choices: [
      C("挤在人群里看他下船", "Watch him step off from the crowd", "gsc_601", X({renown: 2},
        "他戴着手套，对人群微笑。你脑子里的嗡鸣，第一次缩成了一团。",
        "He wears gloves and smiles at the crowd. For the first time, the hum in your head curls up tight."))
    ]};

  N.gsc_601 = {chapter: 6, scene: "hive_hab", speaker: THORNE, time: {d: 1}, gather: L("验血队伍", "Blood-test queue"),
    alt: [ADD(F("reyesWary"), "审判官点了你的名字，让你排在第一个。", "The Inquisitor calls your name and puts you first in line."),
          ADD(F("kinExposed"), "检验员抬头看了你一眼，像见过这双眼睛。", "The tester glances up at you, as if he's seen those eyes before.")],
    text: L("第二天，每个路口都设了检查站：一根针，一滴血，一台会变色的仪器。整条街排成验血队伍，人们小声交换“谁被带走了”。\n“只是例行检查，”索恩审判官对人群微笑，“帝皇保佑纯洁的人。”",
            "Next day every junction has a checkpoint: a needle, a drop of blood, a machine that changes colour. The whole street is one blood-test queue; people whisper who's been taken.\n“Routine screening,” Inquisitor Thorne smiles at the crowd. “The Emperor protects the pure.”"),
    choices: [
      C("排队验血", "Queue for the blood test", "gsc_602", O(Q({notFlag: "carrier"}, true), X({hp: -2},
        "针扎进去，你盯着仪器的灯，一秒，两秒。",
        "The needle goes in. You stare at the machine's light. One second. Two."))),
      C("排队验血", "Queue for the blood test", "gsc_603", O(Q({flag: "carrier"}, true), X({hp: -5},
        "针扎进去，仪器的灯慢慢变成了紫色。两个风暴兵同时按住了你的肩膀。",
        "The needle goes in; the machine's light slowly turns violet. Two storm-troopers seize your shoulders at once."))),
      C("用你的眼神，让检验员看错", "Use your gaze to make the tester misread", "gsc_602", O(Q({flag: "origin_kin"}, true), X({corruption: 6, set: {foolTester: true}},
        "检验员眨了眨眼，在表格上打了个勾。他会头疼一个星期，却永远不知道为什么。",
        "The tester blinks and ticks the form. He'll have a headache for a week and never know why."))),
      C("从废弃巷道绕过去", "Go round through the abandoned galleries", "gsc_606", O(X({hp: -5, renown: 4},
        "巷道里挤满了逃出来的家人。乔里用三只手抱着三个孩子：“首领说，等不了了。”",
        "The galleries are crammed with fleeing kin. Jory carries three children in his three arms. “The Primus says we can't wait.”"),
        {resultAlt: [RA(F("joryMaimed"), "巷道里挤满了逃出来的家人。乔里用仅剩的两只手抱着两个孩子：“首领说，等不了了。”",
                       "The galleries are crammed with fleeing kin. Jory carries two children in his two remaining arms. “The Primus says we can't wait.”")]}))
    ]};

  N.gsc_602 = {chapter: 6, scene: "hive_hab", speaker: NELL, time: {h: 1},
    alt: [ALT(F("foolTester"), "检验员打了勾，挥手让你过去。你回过头。\n内尔排在你后面，第五个。她冲你笑了笑，脸色发白。\n她的眼神骗不了机器。第四代也是家人，仪器认得出来。",
            "The tester ticks the form and waves you through. You look back.\nNell is in the queue behind you, fifth in line. She smiles at you, pale.\nHer gaze can't fool a machine. Fourth generation is family too. The machine will know.")],
    text: L("你的血是红的，仪器亮起绿灯。你松了口气，回过头。\n内尔排在你后面，第五个。她冲你笑了笑，脸色发白。\n第四代也是家人。仪器认得出来。",
            "Your blood runs red; the machine shows green. You breathe out and look back.\nNell is in the queue behind you, fifth in line. She smiles at you, pale.\nFourth generation is family too. The machine will know."),
    choices: [
      C("趁乱换掉她的血样", "Swap her sample in the confusion", null, O(Q({notFlag: "heldNell"}, true), R(0.5, "renown", "gsc_605", "gsc_603",
        RR("你的手比你想的更稳。表兄弟们在后面同时咳嗽，正好挡住了视线。", "Your hands are steadier than you thought. Behind you, the cousins all cough at once, blocking the view.",
           "一只戴手套的手按住了你的手腕。“有意思，”审判官说。", "A gloved hand closes on your wrist. “Interesting,” says the Inquisitor.")))),
      C("换掉她的血样：你抱过她，认得她的手", "Swap her sample: you held her once, you know her hands", null, O(Q({flag: "heldNell"}, true), R(0.62, "renown", "gsc_605", "gsc_603",
        RR("内尔把手指递过来时，就像婴儿时抓住你一样。两支血样换了位置，谁也没看见。", "Nell passes her finger over the way she once gripped yours as a baby. The two samples change places unseen.",
           "一只戴手套的手按住了你的手腕。“有意思，”审判官说。", "A gloved hand closes on your wrist. “Interesting,” says the Inquisitor.")))),
      C("制造混乱，让她跑", "Cause a scene so she can run", "gsc_605", X({hp: -12, renown: 6, set: {causedScene: true}},
        "你掀翻了检验台。枪托砸在你背上，可内尔已经钻进了人群。表兄弟们把你拖进人堆，塞进了排水沟。",
        "You overturn the testing table. A rifle butt hits your back, but Nell has slipped into the crowd. The cousins drag you into the press and stuff you into a drain.")),
      C("转过头，不看", "Turn away. Don't look", "gsc_604", X({renown: -15, sanity: -10, set: {nellTaken: true, wronged_nell: true}},
        "你听见仪器响了一声，听见有人喊“内尔”。你没有回头。嗡鸣里有几百个声音在哭。",
        "You hear the machine chime, hear someone shout “Nell!” You don't turn. In the hum, hundreds of voices are weeping."))
    ]};

  N.gsc_603 = {chapter: 6, scene: "underhive", speaker: THORNE, time: {h: 6},
    alt: [ADD(FN("gsc_601"), "仪器的紫光，还在你眼前晃。", "The machine's violet light still swims before your eyes."),
          ADD(FN("gsc_602"), "他手里转着那支没换成的血样。", "He turns the sample you failed to swap between his fingers.")],
    text: L("审讯室没有窗。索恩审判官摘下手套，坐在你对面。\n“我对你没兴趣。我要的是那个‘老祖宗’。”\n“告诉我它在哪儿，你可以活下来。不告诉我，这颗星球都活不下来。”",
            "The interrogation cell has no window. Inquisitor Thorne removes his gloves and sits opposite.\n“You don't interest me. I want the ‘Grandsire.’”\n“Tell me where it is and you live. Don't, and this whole world doesn't.”"),
    choices: [
      C("答应他", "Agree", "gsc_607", X({renown: -10, set: {deal: true}},
        "他点点头，好像早就知道。你的嗡鸣里，有一个很老的声音，叹了一口气。",
        "He nods as though he knew. In your hum, one very old voice sighs.")),
      C("给他一个假地点", "Give him a false location", null, R(0.5, "sanity", "gsc_607", "gsc_603b",
        RR("他听完，戴回手套。“很好，”他说，“我们会再谈。”", "He hears you out and pulls his gloves back on. “Good,” he says. “We'll talk again.”",
           "他听完就笑了。“十三号矿井早就封了？”他起身，“那我们就去看看。”", "He laughs. “Shaft Thirteen, sealed long ago?” He stands. “Then let's go and look.”"))),
      C("“我没什么可说的。”", "“I have nothing to say.”", null, O(Q({notFlag: "joryBond"}, true), R(0.5, "renown", "gsc_603b", "gsc_end_purged",
        RR("你一个字也没说。夜里，墙外响起爆炸。", "You say not one word. That night, the wall blows in.",
           "审判官戴回手套。“可惜，”他说，在一张名单上划了一笔。", "The Inquisitor pulls his gloves back on. “A pity,” he says, and marks a line on a list.")))),
      C("“我没什么可说的。”乔里会来的", "“I have nothing to say.” Jory will come", null, O(Q({flag: "joryBond"}, true), R(0.65, "renown", "gsc_603b", "gsc_end_purged",
        RR("你一个字也没说。夜里，墙外响起爆炸。", "You say not one word. That night, the wall blows in.",
           "审判官戴回手套。“可惜，”他说，在一张名单上划了一笔。", "The Inquisitor pulls his gloves back on. “A pity,” he says, and marks a line on a list."))))
    ]};

  N.gsc_603b = {chapter: 6, scene: "underhive", speaker: JORY, time: {h: 8},
    alt: [ALT(F("joryMaimed"), "审判官带人下矿井搜去了。家人趁机炸开了分局的牢房。\n烟里，乔里用仅剩的两只手把你拖了出去。他没提那只手的事。\n“首领说，等不了了。”",
            "The Inquisitor has taken his men down the shafts to search. The family seizes the moment and blows open the precinct cells.\nThrough the smoke Jory drags you out with his two remaining arms. He says nothing about the third.\n“The Primus says we can't wait.”")],
    text: L("审判官带人下矿井搜去了。家人趁机炸开了分局的牢房。\n烟里，一只三只手的人把你从废墟里拖了出去。是乔里。\n“首领说，等不了了。”",
            "The Inquisitor has taken his men down the shafts to search. The family seizes the moment and blows open the precinct cells.\nThrough the smoke a three-armed figure drags you out of the rubble. Jory.\n“The Primus says we can't wait.”"),
    effects: {hp: -8},
    choices: [
      C("跟着他钻进巷道", "Follow him into the galleries", "gsc_606", X({renown: 4},
        "你们在黑暗里跑。身后，分局的楼塌了半边。",
        "You run in the dark. Behind you, half the precinct building comes down."))
    ]};

  N.gsc_604 = {chapter: 6, scene: "hive_hab", speaker: null, time: {h: 10},
    text: L("那天夜里，家人突袭了检查站。\n天亮前，内尔被抢了回来，手腕上还有手铐的勒痕。\n她从你门口走过，没有停。",
            "That night the family raids the checkpoint.\nBefore dawn Nell is brought back, the marks of the cuffs still on her wrists.\nShe walks past your door and doesn't stop."),
    effects: {sanity: -4},
    choices: [
      C("追出去叫她", "Run after her and call her name", "gsc_606", X({sanity: -2},
        "她没有回头。走廊尽头，表兄弟们护着她进了巷道。",
        "She doesn't look back. At the end of the corridor the cousins shepherd her into the galleries."))
    ]};

  N.gsc_605 = {chapter: 6, scene: "hive_hab", speaker: NELL, time: {h: 4},
    alt: [ADD(F("causedScene"), "你在排水沟里躲到天黑，才被表兄弟们领回来。", "You hid in the drain till dark before the cousins brought you home.")],
    text: L("那天晚上，霍林家挤满了人。家人一个接一个地来抱你，孩子们在角落里唱跳绳歌。\n内尔坐在你旁边，靠着你的肩膀：\n“我梦见你了。梦里星星下来的时候，你拉着我的手在跑。”",
            "That evening the Hollin house is packed. The family comes one by one to hold you; children sing skipping rhymes in the corner.\nNell sits beside you, her head on your shoulder.\n“I dreamed about you. When the stars came down, you were holding my hand and running.”"),
    effects: {renown: 10, sanity: 5, set: {savedNell: true}},
    choices: [
      C("“我会的。”", "“I will.”", "gsc_606", X({sanity: 2, set: {promisedNell: true}},
        "她笑了，像个普通的女孩。你在心里把这句话又说了一遍。",
        "She smiles like any ordinary girl. You say it again, silently, to yourself.")),
      C("答应她，心里想着那艘矿船", "Promise her, thinking of the hauler", "gsc_606", X({sanity: -2, set: {shipThought: true, promisedNell: true}},
        "“我会的。”你说。你在心里数：四十个座位，矿船，舷梯。",
        "“I will,” you say. Inside you count: forty berths, the hauler, the ramp."))
    ]};

  N.gsc_606 = {chapter: 6, scene: "cult_shrine", speaker: PRIMUS, time: {h: 12},
    alt: [ADD(F("forgiven"), "首领的目光在你脸上停了一下：原谅过一次的人。", "The Primus's gaze rests on you a moment: one already forgiven once."),
          ADD(F("nellTaken"), "内尔站在人群最前面，手腕上缠着布。", "Nell stands at the front, her wrists wrapped in cloth.")],
    text: L("哈斯克首领站在洞窟中央。“审判官逼我们出手。等不到紫光了。”\n“明天黎明，就是那一天。”\n几千个家人和兄弟同时握紧了武器。嗡鸣像一声战鼓。",
            "Primus Hask stands at the centre of the cavern. “The Inquisitor forces our hand. We can't wait for the violet light.”\n“Tomorrow at dawn, it's the Day.”\nThousands of kin and brothers grip their weapons at once. The hum is a war-drum."),
    codex: ["gsc_ascension"],
    choices: [
      C("站到家人中间", "Stand among the family", "gsc_701", X({renown: 5, corruption: 3},
        "有人把一支枪塞进你手里，有人拍了拍你的背。你是他们的一部分。这是真的。",
        "Someone puts a gun in your hands; someone pats your back. You are part of them. That is true.")),
      C("“星之子会吃掉我们所有人！”", "“The Star Children will eat us all!”", "gsc_608", Q({flag: "knowsTruth"}, true)),
      C("“天是紫的……它们很饿！”", "“The sky is violet... they are hungry!”", "gsc_608", O(Q({flag: "halfTruth"}, true), X({sanity: -3, set: {spokeHalf: true}},
        "你只记得这两句。你喊了出来，声音在洞窟里显得很小。",
        "Those two lines are all you have. You shout them, and in the cavern they sound very small."))),
      C("趁乱去找审判官", "Slip away to find the Inquisitor", "gsc_607", X({renown: -8, sanity: -5, set: {deal: true}},
        "你从通风井爬上去。嗡鸣在你身后，像一大家子人在喊你的名字。",
        "You climb out through a ventilation shaft. The hum follows, like a whole family calling your name."))
    ]};

  N.gsc_607 = {chapter: 6, scene: "barracks", speaker: THORNE, time: {h: 5},
    alt: [ALT({all: [FN("gsc_603"), NF("deal")]}, "审判官把你带进营房。“你给的地点是假的，”他说，“放你走一趟，是想看你往哪儿去。”\n“邪教一起事，老祖宗就会出巢。带我去真的地方。”\n“至于你的‘家人’，”他顿了顿，“我不承诺什么。”",
            "The Inquisitor takes you into the barracks. “The place you gave me was false,” he says. “I let you walk to see where you'd go.”\n“When the cult rises, the Grandsire leaves its lair. You'll take me to the real place.”\n“As for your ‘family,’” he pauses, “I promise nothing.”")],
    text: L("审判官在地图上画了个圈。“邪教一起事，老祖宗就会出巢。杀了它。”\n“它是他们的心。心一停，歌就散了，星语者也许能从影子的缝里喊出一声。”\n“至于你的‘家人’，我不承诺什么。”",
            "The Inquisitor circles a spot on the map. “When the cult rises, the Grandsire leaves its lair. Then we kill it.”\n“It is their heart. Stop it and their song breaks. The astropath might scream one word through a crack in the Shadow.”\n“As for your ‘family,’” he pauses, “I promise nothing.”"),
    codex: ["xenos_genestealer"],
    choices: [
      C("“我带你去。”", "“I'll take you there.”", "gsc_701", X({renown: -5, set: {thornePlan: true, teamPrecinct: true, noTerms: true}},
        "他递给你一把小手枪。“它的眼睛，”他说，“别看它的眼睛。”",
        "He hands you a small pistol. “Its eyes,” he says. “Don't look into its eyes.”")),
      C("“先答应我：放过孩子们。”", "“Promise me first: spare the children.”", "gsc_701", X({sanity: -3, set: {thornePlan: true, teamPrecinct: true, askedMercy: true}},
        "审判官沉默了很久。“验过血的，可以上船。”这已经是他能给的全部。",
        "The Inquisitor is silent a long time. “Those whose blood tests clean may board.” It's all he has to give."))
    ]};

  N.gsc_608 = {chapter: 6, scene: "cult_shrine", speaker: PRIMUS, time: {h: 1},
    alt: [ADD(F("countedGenerations"), "你说出了确切的数字：四代，六百一十二个人。", "You give the exact count: four generations, six hundred and twelve."),
          ADD(F("forgiven"), "首领开口前，先说了一句：“原谅只有一次。”", "Before anything else the Primus says: “Forgiveness comes once.”")],
    text: L("整个洞窟安静下来。提奥也在人群里，几千双眼睛看着你。\n你把你知道的说了出来：紫色的天，迎接的家人，没有停下的牙。\n哈斯克首领慢慢走到你面前。",
            "The whole cavern goes still. Teo is in the crowd too, among thousands of eyes on you.\nYou tell them what you know: the purple sky, the family welcoming, the teeth that did not stop.\nPrimus Hask walks slowly up to you."),
    choices: [
      C("迎着他的目光", "Meet his gaze", null, O(Q({notFlag: "spokeHalf"}, true), R(0.45, "renown", "gsc_609", "gsc_610",
        RR("首领没有说话。人群里，提奥走了出来，站到你身边。然后，又有几个人。", "The Primus says nothing. From the crowd Teo steps out and stands beside you. Then a few more.",
           "首领只说了一个字：“病。”几只手同时抓住了你。", "The Primus says one word: “Sick.” Several hands seize you at once.")),
        G("teo", "提奥没忘你对他做的事，站在人群里，迟迟没有动。", "Teo has not forgotten what you did to him. He stands in the crowd and does not move.", -0.15))),
      C("迎着他的目光，把那两句再说一遍", "Meet his gaze and say the two lines again", null, O(Q({flag: "spokeHalf"}, true), R(0.32, "renown", "gsc_609", "gsc_610",
        RR("首领没有说话。人群里，提奥走了出来，站到你身边：“我也梦见过。”", "The Primus says nothing. Teo steps out of the crowd to stand beside you. “I've dreamed it too.”",
           "首领只说了一个字：“病。”几只手同时抓住了你。", "The Primus says one word: “Sick.” Several hands seize you at once.")))),
      C("低下头：“我做了个噩梦。”", "Bow your head: “It was only a nightmare.”", "gsc_701", X({renown: -6, sanity: -6, set: {backedDown: true}},
        "首领看了你很久，转过身去。人群散开时，没有人碰你，也没有人看你。",
        "The Primus looks at you a long time, then turns away. As the crowd breaks up nobody touches you, and nobody looks at you."))
    ]};

  N.gsc_609 = {chapter: 6, scene: "cult_shrine", speaker: TEO, time: {h: 3},
    text: L("首领没有抓你，也没有信你。他只是转身走了。\n散会后，提奥和雷恩在黑暗里找到你。\n“我们不信星之子会吃我们，”雷恩说，“可万一呢？孩子们，得有人带走。”",
            "The Primus neither seizes you nor believes you. He simply turns away.\nAfterward, Teo and Wren find you in the dark.\n“We don't believe the Star Children would eat us,” Wren says. “But what if? Someone has to get the children out.”"),
    effects: {renown: 5},
    choices: [
      C("“矿船，‘忍耐号’。”", "“The hauler. The Endurance.”", "gsc_701", O(X({set: {arkPlan: true}},
        "雷恩点头：“星港是我们的人在守。我去安排。”提奥只是握紧了你的手。",
        "Wren nods. “Our people are holding the port. I'll arrange it.” Teo only grips your hand."),
        G("wren", "雷恩没忘是谁报了她的名字，答话时没有看你。", "Wren has not forgotten who gave up her name. She does not look at you as she answers.", 0, {sanity: -4}))),
      C("“我认识矿船的独眼船长。”", "“I know the hauler's one-eyed captain.”", "gsc_701", O(Q({flag: "knowsHauler"}, true), X({renown: 3, set: {arkPlan: true, haulerDeal: true}},
        "你连夜去找船长。他听完，把四十个座位的舱单推给你：“孩子不算矿石，我不收钱。”",
        "You go to the captain that night. He hears you out and pushes the forty-berth manifest across. “Children aren't ore. No charge.”")))
    ]};

  N.gsc_610 = {chapter: 6, scene: "cult_shrine", speaker: MAGUS, time: {h: 4},
    alt: [ADD(F("correctedOnce"), "他治过你一次。这一回，你认得那只手。", "He has healed you once before. This time you know that hand."),
          ADD(F("waxEars"), "你想起那一点蜡：你还守着一扇门。", "You remember the bit of wax: you are still guarding one door."),
          ADD(F("doubt"), "你想起那一夜，在角落里把看见的一样样摆清楚。", "You remember that night in the corner, laying out what you saw.")],
    text: L("他们把你带到主祭面前。主祭很温柔，像在给发烧的孩子擦汗。\n“你病了，”他说，“病会让人看见可怕的东西。我来治好你。”\n嗡鸣变得很响，响得像要把你从里面冲走。",
            "They bring you before the Magus. He is gentle, like someone wiping a feverish child's brow.\n“You're sick,” he says. “Sickness shows people terrible things. Let me heal you.”\nThe hum swells, loud enough to wash you out from the inside."),
    effects: {sanity: -15, corruption: 8},
    choices: [
      C("让他治", "Let him heal you", "gsc_end_corrected", X({corruption: 10},
        "他的手指按在你太阳穴上。你看见的那些可怕的东西，一样一样，变得很美。",
        "His fingers press your temples. The terrible things you saw become, one by one, beautiful.")),
      C("死死抓住那幅画面", "Cling to that image", null, O(Q({notFlag: "watchedMagus"}, true), R(0.4, "sanity", "gsc_701", "gsc_end_corrected",
        RR("主祭的手松开了。“明天，”他疲惫地说，“明天你会自己看见。”", "The Magus lets go. “Tomorrow,” he says, weary. “Tomorrow you'll see for yourself.”",
           "画面一点一点褪色。最后剩下的，只有一片温暖的紫。", "The image fades piece by piece. All that remains is a warm violet.")))),
      C("盯住他的眼睛，像礼拜那天一样", "Stare into his eyes, as at that first service", null, O(Q({flag: "watchedMagus"}, true), R(0.55, "sanity", "gsc_701", "gsc_end_corrected",
        RR("那天你就没闭眼。今天你也没有。主祭先移开了目光。", "You didn't close your eyes that day. You don't today. The Magus looks away first.",
           "画面一点一点褪色。最后剩下的，只有一片温暖的紫。", "The image fades piece by piece. All that remains is a warm violet."))))
    ]};


  /* ============ Chapter 7 · The Day of Ascension ============ */
  N.gsc_701 = {chapter: 7, scene: "burning_city", speaker: PRIMUS, foe: "gsc_neophyte", time: {h: 10}, bridge: true,
    alt: [ADD(F("thornePlan"), "索恩给的那把小手枪，揣在你怀里。他的人在等你的信号。", "Thorne's little pistol sits inside your coat. His men wait on your signal."),
          ADD(F("arkPlan"), "雷恩昨夜说：船，等孩子们。", "Last night Wren said: the ship will wait for the children."),
          ADD({any: [F("kinLedger"), {all: [F("smuggler"), NF("heldOut"), NF("traitor")]}]}, "炸开那些大门的，有你当年经手的那批炸药。", "Some of the charges blowing those gates passed through your hands, years ago."),
          ADD(FN("gsc_610"), "主祭的指印还留在你太阳穴上。", "The Magus's fingerprints still ache at your temples."),
          ADD(F("backedDown"), "你在洞窟里低过头。今天，家人从你身边跑过，没人看你。", "You bowed your head in the cavern. Today the kin run past you and nobody looks.")],
    text: L("黎明。整座矿城同时爆炸。\n防卫军的炮口调转了方向，执法局的大门从里面打开，矿井里涌出几千个家人和兄弟。\n几十年的耐心，在一个早上全部用完。",
            "Dawn. The whole mining city explodes at once.\nPDF guns swing round, the precinct gates open from inside, and thousands of kin and brothers pour from the shafts.\nDecades of patience, spent in a single morning."),
    effects: {sanity: -5},
    codex: ["gsc_ascension"],
    choices: [
      C("去执法局", "To the precinct", "gsc_702", Q({flag: "teamPrecinct"}, true)),
      C("去星港，守住矿船", "To the starport. Hold the hauler", "gsc_703", Q({flag: "teamPort"}, true)),
      C("往打得最凶的地方冲", "Charge where the fighting is thickest", "gsc_702", O(Q({taint: "khorne", min: 40}, true), X({hp: -10, renown: 5, taint: {khorne: 60}},
        "你不记得自己冲过了几条街。只记得每一步都踩在鼓点上，鼓声越来越响。",
        "You don't remember how many streets you charge through. Only that every step lands on a drumbeat, louder and louder."))),
      C("跑回霍林家，孩子们在那儿", "Run back to the Hollin house, to the children", "gsc_704", X({hp: -3},
        "你逆着枪声跑。街上的家人朝你挥手，好像你是去赴宴。",
        "You run against the gunfire. Kin in the street wave at you, as if you were off to a feast."))
    ]};

  N.gsc_702 = {chapter: 7, scene: "burning_city", speaker: VASK, time: {h: 1},
    alt: [ALT(F("vaskAgent"), "执法局烧着了。瓦斯克执法官靠在台阶上，腿上全是血，手里还握着枪。\n他认出了你，竟然笑了一下。\n“我只信过你一个，”他说，“我就知道。”",
            "The precinct is burning. Captain Vask slumps on the steps, legs soaked in blood, still gripping his gun.\nHe recognises you, and actually smiles.\n“You were the only one I trusted,” he says. “I knew it.”"),
          ALT(AF(["informer", "toldVask", "returnedChit"]), "执法局烧着了。瓦斯克执法官靠在台阶上，腿上全是血，手里还握着枪。\n他认出了你，竟然笑了一下。\n“你给过我真话，一次，”他说，“就一次。”",
            "The precinct is burning. Captain Vask slumps on the steps, legs soaked in blood, still gripping his gun.\nHe recognises you, and actually smiles.\n“You gave me the truth once,” he says. “Just the once.”"),
          ADD(F("refusedVask"), "“你说我保护不了你，”他喘着气，“你说对了。”", "“You said I couldn't protect you,” he wheezes. “You were right.”")],
    text: L("执法局烧着了。瓦斯克执法官靠在台阶上，腿上全是血，手里还握着枪。\n他认出了你，竟然笑了一下。\n“我就知道，”他说，“矿上没有一个干净的。”",
            "The precinct is burning. Captain Vask slumps on the steps, legs soaked in blood, still gripping his gun.\nHe recognises you, and actually smiles.\n“I knew it,” he says. “Not one clean soul in that mine.”"),
    choices: [
      C("把他拖出火场", "Drag him out of the fire", "gsc_705", X({hp: -10, renown: -5, set: {savedVask: true}},
        "他很重，一路骂你。到了安全的地方，他闭上眼：“谢谢。别以为这能抵账。”",
        "He's heavy and curses you all the way. Somewhere safe, he closes his eyes. “Thanks. Doesn't square anything.”")),
      C("点燃引线", "Light the fuse", "gsc_705", X({renown: 6, sanity: -8, taint: {khorne: 45}},
        "火花沿着引线跑过去。楼塌下来的时候，你听见自己在喊，喊得比爆炸还响。",
        "The spark races along the fuse. As the building falls you hear yourself screaming, louder than the blast.")),
      C("冲进去找母亲", "Run inside to find your mother", "gsc_705", O(Q({flag: "origin_warden"}, true), X({hp: -12, set: {savedMarr: true}},
        "你在档案室找到她，她正把失踪报告一份份往火里扔。“别让他们知道是谁写的，”她说。你拉着她跑了出来。",
        "You find her in the records room, feeding missing-persons reports to the fire. “Don't let them learn who wrote these,” she says. You drag her out."),
        {resultAlt: [RA(F("marrHelped"), "你在档案室找到她，她正往火里扔报告。“乔里那份，我早烧了，”她说。你拉着她跑了出来。",
                       "You find her in the records room, feeding reports to the fire. “Jory's I burned long ago,” she says. You drag her out.")]}))
    ]};

  N.gsc_703 = {chapter: 7, scene: "hive_spire", speaker: REYES, time: {h: 1},
    alt: [ADD(F("warnedReyes"), "她认出了你：“你让我快走。我没走。”", "She knows you. “You told me to get out. I didn't.”"),
          ADD(F("drilled"), "你是首领封的班长。家人们在等你下令。", "The Primus made you squad leader. The kin wait for your word."),
          ADD(NF("drilled"), "家人们在等首领副手下令。你站在一旁。", "The kin wait for the Primus's deputy to give the word. You stand to one side.")],
    text: L("星港的防卫军不肯投降。雷耶斯中尉守在“忍耐号”的舷梯下。\n“我不知道你们是什么，”她喊，“可这艘船上，有我手下的家属。”\n家人们举着枪，枪口都对着她。",
            "The starport's PDF won't surrender. Lieutenant Reyes holds the Endurance's ramp.\n“I don't know what you people are,” she shouts, “but my soldiers' families are on that ship.”\nThe kin raise their guns, all aimed at her."),
    choices: [
      C("“让她的人上船。船等孩子们。”", "“Let her people board. The ship waits for the children.”", "gsc_705", X({renown: -8, sanity: 5, set: {reyesEscaped: true}},
        "雷耶斯愣住，然后放下枪。“你的孩子，我的家属，”她说，“船不走，等齐了再走。”",
        "Reyes stares, then lowers her gun. “Your children, my soldiers' families,” she says. “The ship stays till they're all aboard.”")),
      C("拿下舷梯，留住矿船", "Take the ramp. Keep the hauler", "gsc_705", X({renown: 6, sanity: -6, set: {portHeld: true}},
        "枪声停的时候，雷耶斯被缴了械，坐在地上。矿船留下了。家人们欢呼着你的名字。",
        "When the shooting stops, Reyes sits disarmed on the deck. The hauler stays. The kin cheer your name."))
    ]};

  N.gsc_704 = {chapter: 7, scene: "hive_hab", speaker: NELL, time: {h: 1},
    grudgeLine: {npc: "nell", text: L("内尔手腕上还缠着布，是检查站那夜留下的。她不肯看你。", "Nell's wrists are still wrapped from the checkpoint night. She won't look at you.")},
    alt: [ADD(F("teoKnows"), "提奥也在，他把最小的孩子背在背上。", "Teo is here too, the smallest child on his back."),
          ADD(F("teamChildren"), "首领分给你的岗位，就是这里。", "This is the post the Primus gave you."),
          ADD(F("savedNell"), "内尔一看见你，就跑过来抓住了你的手。", "The moment Nell sees you she runs over and grabs your hand.")],
    text: L("霍林家空了，只剩内尔和十几个最小的孩子。\n“大人们说，在街上等，”内尔说，“等星之子来接我们。”\n孩子们穿着最好的衣服，排着队，像要去过节。",
            "The Hollin house is empty but for Nell and a dozen of the smallest children.\n“The grown-ups said wait in the street,” Nell says, “for the Star Children to come for us.”\nThe children wear their best clothes, lined up as if for a festival."),
    choices: [
      C("把孩子们带进地窖", "Take the children down to the cellar", "gsc_705", O(X({sanity: 3, renown: -3, set: {withNell: true, hidKids: true, withKids: true}},
        "孩子们不太愿意，一个个被你哄下了地窖。门关上的时候，外面传来了第一声欢呼。",
        "The children are reluctant; you coax them down one by one. As the cellar door shuts, the first cheer rises outside."),
        G("nell", "内尔记得检查站那天，不肯先走。耽搁间，碎砖砸中了你。", "Nell remembers the checkpoint and won't go first. In the delay, falling brick hits you.", 0, {hp: -6}))),
      C("牵着他们，去街上迎接", "Lead them out to welcome the Star Children", "gsc_705", X({renown: 5, corruption: 5, set: {wronged_nell: true}},
        "你把孩子们领进了等着天空的人群。内尔握着你的手，越握越紧。",
        "You lead the children into the crowd waiting on the sky. Nell holds your hand, tighter and tighter.")),
      C("“检查站那天，我转过了头。对不起。”", "“At the checkpoint, I turned away. I'm sorry.”", "gsc_705", O(Q({flag: "wronged_nell"}, true), X({sanity: 3, set: {forgiven_nell: true, withNell: true, hidKids: true, withKids: true}},
        "内尔没说话，伸手握住了你的手。“我知道，”她说，“嗡鸣里都有。”你们一起把孩子们带进了地窖。",
        "Nell says nothing, only takes your hand. “I know,” she says. “It was all in the hum.” Together you take the children down to the cellar.")))
    ]};

  N.gsc_705 = {chapter: 7, scene: "spore_sky", speaker: STARS, time: {h: 30},
    alt: [ADD({all: [F("origin_kin"), F("motherWarned")]}, "人群里，你母亲跪着，头巾系得很紧。她没有回头找你。", "In the crowd your mother kneels, scarf tied tight. She doesn't look back for you."),
          ADD(F("hidKids"), "地窖的门缝里，孩子们在问：外面是什么声音？", "Through the cellar door the children ask: what's that noise outside?")],
    text: L("第二天，天变紫了。\n孢子像雪一样落下，地平线上，无数光点正在降落。\n主祭站在礼拜堂的屋顶上，张开双臂，哭着笑着：“他们来了！他们来接我们了！”",
            "The next day, the sky turns violet.\nSpores fall like snow. On the horizon, countless lights are descending.\nOn the chapel roof the Magus spreads his arms, weeping and laughing. “They've come! They've come for us!”"),
    effects: {sanity: -7},
    codex: ["gsc_star_children"],
    choices: [
      C("跪下迎接", "Kneel to welcome them", "gsc_706", X({corruption: 10, renown: 5},
        "你跪在满城的家人中间。嗡鸣从来没这么响过，也从来没这么小过。",
        "You kneel among a whole city of kin. The hum has never been so loud, nor so small.")),
      C("像主祭那样张开双臂", "Spread your arms like the Magus", "gsc_706", O(Q({taint: "slaanesh", min: 40}, true), X({sanity: 5, corruption: 5, taint: {slaanesh: 60}},
        "孢子落在你脸上，像无数个吻。你从来没这么被需要过。这种感觉，你还要更多。",
        "Spores land on your face like countless kisses. You have never been so wanted. You want more of this feeling."))),
      C("往掩体跑", "Run for shelter", "gsc_706", O(X({sanity: -3, set: {inBunker: true}},
        "你逆着人流跑。每个人都在往空地上走，只有你在往下钻。",
        "You run against the crowd. Everyone else is walking out into the open. Only you are going down."),
        {resultAlt: [RA(F("brannSky"), "你想起布兰的话：别抬头看天。你低着头，逆着人流往下钻。",
                       "You remember Brann: don't look up. Head down, you burrow against the crowd.")]})),
      C("去找内尔", "Go find Nell", "gsc_706", O(Q({notFlag: "withNell"}, true), X({hp: -5, set: {withNell: true}},
        "你在人群里找到了她。她正抬头看着天，你一把抓住她的手：“别看。跟我走。”",
        "You find her in the crowd, staring up. You seize her hand. “Don't look. Come with me.”"),
        {resultAlt: [RA(FN("gsc_704"), "她一直在你身边，正抬头看着天。你把她的头按低：“别看。跟我走。”",
                       "She's been beside you all along, staring up. You push her head down. “Don't look. Come with me.”")]}))
    ]};

  N.gsc_706 = {chapter: 7, scene: "spore_sky", speaker: null, foe: "gaunt", time: {h: 2},
    text: L("第一批“星之子”落在欢迎的人群中间。\n它们有太多的腿，太多的牙。人们还在唱歌，伸出手去拥抱。\n歌声停下来，一个声音，接着一个声音。",
            "The first “Star Children” land among the welcoming crowd.\nToo many legs. Too many teeth. People are still singing, reaching out to embrace them.\nThe singing stops. One voice at a time."),
    effects: {sanity: -12},
    codex: ["xenos_tyranid"],
    choices: [
      C("跑", "Run", null, O(Q({notFlag: "inBunker"}, true), R(0.55, "hp", "gsc_707", "gsc_708",
        RR("你跑过倒塌的街道，身后的歌声越来越少。", "You run through collapsing streets. Behind you, fewer and fewer voices sing.",
           "什么东西撞倒了你。你在地上看见一只爪子，和一只戴着家族戒指的手。", "Something knocks you flat. On the ground you see a claw, and a hand wearing a family ring.")))),
      C("从掩体的后门钻出去", "Slip out through the shelter's back door", null, O(Q({flag: "inBunker"}, true), R(0.72, "hp", "gsc_707", "gsc_708",
        RR("掩体后面是一条排水渠。你沿着它跑，头顶的歌声越来越少。", "Behind the shelter runs a drainage cut. You follow it; above you, fewer and fewer voices sing.",
           "排水渠的出口被堵住了。你爬上来时，正撞在一只爪子底下。", "The drain's mouth is blocked. You climb out right under a claw.")))),
      C("把还在唱歌的人拽走", "Drag away the ones still singing", "gsc_707", X({hp: -15, renown: 6},
        "你拽走了三个人。他们拼命挣扎，想回去。第三个，你没拽住。",
        "You drag three away. They fight you, trying to go back. The third, you can't hold.")),
      C("站着，继续唱", "Stand and keep singing", "gsc_end_ascension", O(Q({stat: "corruption", min: 50}), X({corruption: 10},
        "你闭上眼睛，唱得很大声。也许这就是爱。也许他们只是太饿了。",
        "You close your eyes and sing out loud. Maybe this is love. Maybe they're only very hungry.")))
    ]};

  N.gsc_707 = {chapter: 7, scene: "ruins", speaker: MAGUS, time: {h: 3},
    alt: [ALT({all: [NF("linked"), NF("origin_kin")]}, "废墟里，你撞见了主祭。袍子破了，眼里的紫光一闪一闪地熄灭。\n“他们为什么不认识我们？”他问，“我们唱了那么多年……”\n满城的歌，一个声音也不剩了。取代它的，是无边无际的、饥饿的寂静。",
            "In the ruins you run into the Magus. His robes are torn; the violet light in his eyes gutters.\n“Why don't they know us?” he asks you. “We sang for so many years...”\nNot one voice of the city's song is left. In its place is a hungry silence without end."),
          ADD(FN("gsc_708"), "你身后，提奥的歌声停了。", "Behind you, Teo's singing has stopped.")],
    text: L("废墟里，你撞见了主祭。袍子破了，眼里的紫光一闪一闪地熄灭。\n“他们为什么不认识我们？”他问，“我们唱了那么多年……”\n你脑子里的嗡鸣不见了。取代它的，是无边无际的、饥饿的寂静。",
            "In the ruins you run into the Magus. His robes are torn; the violet light in his eyes gutters.\n“Why don't they know us?” he asks you. “We sang for so many years...”\nThe hum in your head is gone. In its place is a hungry silence without end."),
    codex: ["xenos_hive_mind"],
    choices: [
      C("“他们从来就不认识我们。”", "“They never knew us.”", "gsc_801", X({sanity: 5, renown: -3},
        "主祭像个孩子一样坐倒在地上。你走的时候，他还坐在那里，抬头看着天。",
        "The Magus sits down like a child. When you leave, he's still sitting there, looking up.")),
      C("一拳接一拳地打他", "Hit him, again and again", "gsc_801", O(Q({taint: "khorne", min: 30}, true), X({hp: -5, renown: -5, taint: {khorne: 65}},
        "你停不下来，也不想停。天上那么多东西你打不着，眼前这一个，你打得着。",
        "You can't stop and don't want to. You can't hit all those things in the sky. This one, you can."))),
      C("拉他一起走", "Pull him along with you", "gsc_707b", X({hp: -5, renown: 4},
        "他跟着你走了两条街，然后挣开你的手。",
        "He follows you two streets, then shakes free.")),
      C("一拳打在他脸上", "Punch him in the face", "gsc_801", X({sanity: 3, hp: -3, taint: {khorne: 45}},
        "他倒在瓦砾里，没有还手。你的指节在流血，心里却痛快得发烫。",
        "He drops into the rubble and doesn't fight back. Your knuckles bleed; your chest burns with satisfaction."))
    ]};

  N.gsc_707b = {chapter: 7, scene: "ruins", speaker: null, foe: "genestealer", time: {h: 1},
    text: L("主祭朝十三号矿井的方向走去。你跟到街口，就看见了：\n老祖宗的子嗣，纯种的、没有一点人样的家人，从井口涌出来，正对剩下的家人下手，一个也不放过。\n主祭张开双臂，走了进去。",
            "The Magus walks toward Shaft Thirteen. You follow as far as the corner, and see it:\nthe Grandsire's brood, the pure ones, family with nothing human left, pouring from the pithead and falling on the remaining kin. Not one is spared.\nThe Magus spreads his arms and walks in among them."),
    effects: {sanity: -5, set: {sawPurge: true}},
    choices: [
      C("转身就跑", "Turn and run", "gsc_801", X({hp: -4},
        "你跑了很久才敢停下。原来家里最老的，最先不要家人。",
        "You run a long way before you dare stop. So the eldest of the family was first to give the family up."))
    ]};

  N.gsc_708 = {chapter: 7, scene: "ruins", speaker: TEO, foe: "gaunt", time: {h: 1},
    alt: [ADD(F("teoForgot"), "他哼的，是你叫他忘掉的那首。", "What he hums is the song you told him to forget.")],
    text: L("提奥从烟里冲出来，把你从爪子底下拖开。他老了，跑不快了。\n“带上能带的人走，”他说，把一根撬棍横在身前，“我在这儿挡一会儿。”\n他朝你笑了一下，眼角是很深的纹路。",
            "Teo bursts out of the smoke and drags you from under the claws. He's old; he can't run fast anymore.\n“Take whoever you can and go,” he says, setting a crowbar across his chest. “I'll hold here a while.”\nHe smiles at you, with those deep creases at the eyes."),
    effects: {hp: -20, set: {teoDead: true}},
    choices: [
      C("跑，不要回头", "Run. Don't look back", "gsc_707", X({sanity: -10},
        "你没有回头。很久以后你还会梦见他的笑，比梦见那些牙更多。",
        "You don't look back. For years you'll dream of his smile more than of the teeth.")),
      C("喊他的名字", "Shout his name", "gsc_707", X({sanity: -6, renown: 4, set: {heardTeo: true}},
        "他没有回答。他一直都在唱的那首歌，他终于唱错了，故意的。",
        "He doesn't answer. The song he always sang, he finally sings wrong. On purpose."))
    ]};


  /* ============ Chapter 8 · The Star Children ============ */
  N.gsc_801 = {chapter: 8, scene: "spore_sky", speaker: null, foe: "tyranid_warrior", time: {h: 6}, bridge: true,
    alt: [ADD(F("sawPurge"), "你见过纯种怎么对家人下手。地底下爬上来的，不会认你。", "You have seen what the pure ones do to family. What climbs from below won't know you."),
          ADD(F("withKids"), "你身后跟着地窖里的孩子们，一个牵着一个。", "Behind you come the children from the cellar, each holding the next one's hand."),
          ADD({all: [F("withNell"), NF("withKids")]}, "内尔攥着你的手，一句话也不说。", "Nell grips your hand and says nothing at all."),
          ADD(F("counted"), "你数过的那些层号，还记得清清楚楚。", "The levels you counted that day, you still remember every one.")],
    text: L("第二天早上，矿城在燃烧。高大的虫族武士在街上走，身后的小虫像潮水一样跟着。\n没有人在唱了。\n远处，星港的灯还亮着；脚下，十三号矿井的深处，有什么东西正在往上爬。",
            "Next morning the mining city burns. Tall warrior-beasts stalk the streets, small creatures following like a tide.\nNo one is singing anymore.\nFar off, the starport's lights still burn. Underfoot, deep in Shaft Thirteen, something is climbing."),
    choices: [
      C("带审判官去找老祖宗", "Take the Inquisitor to the Grandsire", "gsc_802", O(Q({flag: "thornePlan"}, true), X({renown: 2},
        "你用索恩给的通讯器发了信号。半小时后，风暴兵在十三号矿井口等你。",
        "You signal on the vox Thorne gave you. Half an hour later his storm-troopers wait for you at Shaft Thirteen."))),
      C("去星港", "Head for the starport", "gsc_805", X({hp: -6},
        "你穿过三条着火的街。星港的灯越来越近。",
        "You cross three burning streets. The starport's lights draw closer.")),
      C("躲进九号矿井最深处", "Hide at the bottom of Shaft Nine", "gsc_809", X({sanity: -3},
        "你沿着十三号矿井的旧通道往九号的方向爬。那是你第一次下井的地方。",
        "You crawl through Shaft Thirteen's old tunnels toward Shaft Nine. It's where you first went down.")),
      C("回到老祖宗身边", "Go back down to the Grandsire", "gsc_810", O(Q({stat: "corruption", min: 45}), X({corruption: 5},
        "嗡鸣没了，可你的腿还记得路。越往下，越安静，越暖。",
        "The hum is gone, but your legs remember the way. The deeper you go, the quieter and warmer it gets.")))
    ]};

  N.gsc_802 = {chapter: 8, scene: "cult_shrine", speaker: GRANDSIRE, foe: "inquisitor", time: {h: 3},
    alt: [ADD(F("sawPurge"), "它身边一个家人也没有。它的子嗣都在上面，替天上的东西收拾桌子。", "No kin are left around it. Its brood are all above, clearing the table for what's in the sky.")],
    text: L("老祖宗在洞窟里等着，比你记得的更老，更累。它在听天上的声音。\n审判官的风暴兵在你身后散开，枪口亮着。\n老祖宗慢慢转过头，看着你。它好像一点也不意外。",
            "The Grandsire waits in its cavern, older and wearier than you remember. It is listening to the sky.\nThe Inquisitor's storm-troopers fan out behind you, muzzles glowing.\nThe Grandsire slowly turns its head to look at you. It does not seem surprised at all."),
    codex: ["gsc_patriarch"],
    choices: [
      C("“开火！”", "“Open fire!”", null, R(0.55, "hp", "gsc_803", "gsc_805",
        RR("枪声在洞窟里滚了很久。它没有躲。它倒下的样子，像一个终于能睡觉的老人。", "Gunfire rolls through the cavern. It doesn't dodge. It falls like an old one finally allowed to sleep.",
           "它动了，快得看不见。风暴兵接连倒下，它却没追你，只抬头去听天上的声音。你逃向星港。", "It moves faster than sight. Troopers fall. It doesn't chase you; it only lifts its head to the sky. You flee to the starport."))),
      C("挡在它前面", "Step in front of it", "gsc_810", X({renown: 10, sanity: -8},
        "审判官冷冷地看着你。“我就知道。”他下令后撤。老祖宗的手，轻轻落在你肩上。",
        "The Inquisitor regards you coldly. “I knew it.” He orders a withdrawal. The Grandsire's hand settles lightly on your shoulder."))
    ]};

  N.gsc_803 = {chapter: 8, scene: "cult_shrine", speaker: THORNE, time: {h: 1},
    alt: [ADD(F("astroCalm"), "“是那个打过镇静剂的老人，”审判官说，“他在喊你的名字。”", "“The old man you sedated,” says the Inquisitor. “He's calling your name.”")],
    text: L("老祖宗死了。整座城里，剩下的家人在同一刻踉跄了一下。\n你脑子里第一次真正安静了。只剩下你自己。\n审判官的通讯器响了：“星语塔……歌停了！星语者在喊，用他自己的命在喊！”",
            "The Grandsire is dead. Across the city every remaining kin stumbles at the same instant.\nFor the first time your head is truly quiet. Only you are left in it.\nThe Inquisitor's vox crackles. “Astropathic tower... the song's stopped! He's screaming, screaming with his life!”"),
    effects: {sanity: 10, set: {grandsireDead: true}},
    choices: [
      C("去星语塔，帮他把警告发完", "Go to the tower and help finish the warning", "gsc_end_shadow", X({hp: -10, renown: 5},
        "你爬了九百级台阶。老星语者握着你的手，把这颗星的名字一遍遍喊进影子的缝里。",
        "You climb nine hundred steps. The old astropath grips your hand and screams this world's name into the crack in the Shadow, again and again.")),
      C("跟审判官上他的穿梭机", "Board the Inquisitor's shuttle", "gsc_end_witness", X({sanity: -5},
        "审判官给你扣好安全带。“你看见的一切，”他说，“我都需要。”",
        "The Inquisitor buckles you in himself. “Everything you've seen,” he says. “I need all of it.”")),
      C("回去找孩子们", "Go back for the children", "gsc_805", X({hp: -5},
        "审判官没有拦你。“验过血的，可以上船，”他在你身后说，“我说话算数。”",
        "The Inquisitor doesn't stop you. “Clean blood may board,” he calls after you. “I keep my word.”"))
    ]};

  N.gsc_805 = {chapter: 8, scene: "hive_spire", speaker: PRIMUS, foe: "gaunt", time: {h: 4},
    grudgeLine: {npc: "wren", text: L("雷恩带着防卫军出身的几个人守着舷梯，看见你，什么也没说。", "Wren and a few ex-PDF kin hold the ramp. She sees you and says nothing.")},
    alt: [ADD(F("portHeld"), "“舷梯是你拿下的，”首领说，“现在守住它。”", "“You took this ramp,” the Primus says. “Now hold it.”"),
          ADD(F("reyesEscaped"), "雷耶斯中尉也在舷梯下，和首领背靠背。", "Lieutenant Reyes is at the ramp too, back to back with the Primus."),
          ADD(F("grandsireDead"), "首领知道老祖宗死了。他什么也没问你。", "The Primus knows the Grandsire is dead. He asks you nothing."),
          ADD(F("teoDead"), "首领问起提奥。你摇了摇头。", "The Primus asks after Teo. You shake your head.")],
    text: L("星港上，哈斯克首领带着最后几十个家人守着“忍耐号”。\n他的枪管打红了。他看着天，脸上第一次出现了不知道该怎么办的表情。\n“家人第一，”他说，“把孩子们弄上船。”",
            "At the starport Primus Hask and the last few dozen kin hold the Endurance.\nHis gun barrel glows red. He looks at the sky, and for the first time his face doesn't know what to do.\n“Family first,” he says. “Get the children aboard.”"),
    choices: [
      C("带你的孩子们登船", "Lead your children aboard", "gsc_806", O(Q({flag: "withKids"}, true), X({renown: 4},
        "孩子们一个牵着一个走上舷梯。首领数了一遍，点点头。",
        "The children climb the ramp hand in hand. The Primus counts them once and nods."),
        G("wren", "雷恩没忘是谁报了她的名字，把你排在队尾，等着挨流弹。", "Wren has not forgotten who gave up her name. She puts you last in line, under the stray fire.", 0, {hp: -6}))),
      C("“雷恩都安排好了。走！”", "“Wren arranged it. Go!”", "gsc_806", O(Q([{flag: "arkPlan"}, {notFlag: "withKids"}], true), X({renown: 5, set: {withKids: true}},
        "雷恩在舷梯口点名，一个都没少。她自己没有上船。",
        "Wren calls the roll at the ramp. Not one child missing. She does not board herself."),
        {resultAlt: [RA(F("haulerDeal"), "独眼船长按舱单点名，一个都没少。雷恩站在舷梯下，没有上船。", "The one-eyed captain calls the manifest. Not one child missing. Wren stays at the foot of the ramp.")]})),
      C("和首领一起守住舷梯", "Hold the ramp beside the Primus", "gsc_807", X({renown: 5, hp: -10},
        "首领看了你一眼，把一包采矿炸药递给你。“能用，”他说。还是那个最高的夸奖。",
        "The Primus glances at you and hands over a satchel of mining charges. “Useful,” he says. Still his highest praise.")),
      C("找一条路上船", "Find a way aboard", "gsc_805b", X({hp: -3},
        "你挤进舷梯下的人群。",
        "You push into the crowd at the foot of the ramp."))
    ]};

  N.gsc_805b = {chapter: 8, scene: "hive_spire", speaker: null, foe: "gaunt", time: {h: 1},
    alt: [ADD(F("savedVask"), "瓦斯克拄着枪守在舷梯边，看见你，侧身让开一条缝。", "Vask leans on his gun by the ramp; seeing you, he turns aside to make a gap."),
          ADD(F("shipThought"), "你数过这四十个座位，数了很多遍。", "You have counted these forty berths many times.")],
    text: L("舷梯下挤满了人：家人、兄弟、穿防卫军制服的、穿执法官制服的，全在往上挤。\n舱门口，首领的人只放孩子过去。\n天上的影子越来越大。你得找一条路上船。",
            "The foot of the ramp is a crush: kin, brothers, PDF uniforms, enforcer uniforms, all shoving upward.\nAt the hatch the Primus's people let only children through.\nThe shadow overhead grows. You have to find a way aboard."),
    choices: [
      C("首领把最后一批孩子交给你", "The Primus hands you the last children", "gsc_806", O(Q({stat: "renown", min: 20}, true), X({renown: 3, set: {withKids: true}},
        "“你，”首领指着你，“带他们上去。”十一个孩子抓住了你的衣角。",
        "“You,” the Primus points. “Take them up.” Eleven children grab the hem of your coat."))),
      C("“雷耶斯，你说过船等孩子们。”", "“Reyes, you said the ship waits for the children.”", "gsc_806", O(Q({flag: "reyesEscaped"}, true), X({renown: 4, set: {withKids: true}},
        "雷耶斯推开两个兵，把一串孩子交到你手里：“你带他们上去，我守着。”",
        "Reyes shoves two soldiers aside and passes you a chain of children. “You take them up. I'll hold.”"))),
      C("找独眼船长", "Find the one-eyed captain", null, O(Q({flag: "knowsHauler"}, true), R(0.6, "hp", "gsc_806", "gsc_end_devoured",
        RR("船长从货舱口探出头，冲你招手：“老主顾，这边！”", "The captain leans out of the cargo hatch and waves. “Old customer! This way!”",
           "你绕到货舱口时，那里已经没有船长了。天上的影子落了下来。", "When you reach the cargo hatch there's no captain left. The shadow from the sky drops down.")))),
      C("自己挤上船", "Shove your own way aboard", null, R(0.45, "hp", "gsc_806", "gsc_end_devoured",
        RR("你挤上了舷梯，胳膊肘撞开了好几个人。", "You force your way up the ramp, elbowing several people aside.",
           "舷梯前的人太多了。天上的影子落下来，挡住了所有的光。", "Too many people at the ramp. A shadow drops from the sky and blots out every light.")))
    ]};

  N.gsc_806 = {chapter: 8, scene: "ship_interior", speaker: NELL, time: {h: 1},
    alt: [ALT(NF("withKids"), "你挤进了矿船。舱里坐满了别人带来的孩子，还剩最后一个座位。\n内尔站在舷梯口，没有进来：“我听得见它们。我走到哪儿，它们就会跟到哪儿。”\n舷梯下，还有一个孩子在哭。",
            "You squeeze into the hauler. The hold is full of children others brought; one seat is left.\nNell stands at the ramp and doesn't come in. “I can hear them. Wherever I go, they'll follow.”\nAt the foot of the ramp, one more child is crying."),
          ADD(F("withNell"), "一路上她都攥着你的手。现在，她松开了。", "She held your hand the whole way. Now she lets go."),
          ADD({flags: ["promisedNell", "withNell"]}, "“你答应过拉着我的手跑，”她说，“你做到了。”", "“You promised to hold my hand and run,” she says. “You did.”"),
          ADD(F("heldNell"), "“你是第一个抱我的人，”她说。", "“You were the first one ever to hold me,” she says."),
          ADD(F("huggedNell"), "她身上还有矿灰和肥皂的味道。", "She still smells of ore dust and soap."),
          ADD(F("savedMarr"), "你母亲坐在舱尾，替孩子们系安全带。", "Your mother sits at the back of the hold, buckling children in.")],
    text: L("矿船里挤满了孩子，都是你带上来的。内尔站在舷梯口。\n“我听得见它们，”她说，“我走到哪儿，它们就会跟到哪儿。或者，我会在新的地方，生出新的家。”\n她没有进来。",
            "The hauler is packed with children, the ones you brought. Nell stands at the ramp.\n“I can hear them,” she says. “Wherever I go, they'll follow. Or I'll grow a new family somewhere new.”\nShe doesn't come in."),
    choices: [
      C("关上舱门", "Seal the hatch", "gsc_end_ark", O(Q([{flag: "withKids"}, {notFlag: "carrier"}], true), X({sanity: -4},
        "舱门合上的那一刻，内尔在外面朝你挥手，像任何一个送别的孩子。",
        "As the hatch closes, Nell waves from outside, like any child seeing someone off."))),
      C("关上舱门", "Seal the hatch", "gsc_end_seed", O(Q({flag: "carrier"}, true), X({sanity: -4},
        "舱门合上了。你脖子上的印记，或者你血里的什么东西，在黑暗里微微发热。",
        "The hatch closes. The mark on your neck, or something in your blood, grows faintly warm in the dark."))),
      C("把座位让给孩子，和内尔一起下船", "Give your seat to a child. Step off with Nell", "gsc_end_lastshift", O(X({renown: 5, sanity: 5},
        "你把舷梯下那个孩子抱上来，放在你的座位上。你牵着内尔走下舷梯。舱门在你们身后合上。",
        "You lift the crying child from the ramp into your seat, then lead Nell down. The hatch closes behind you."),
        G("nell", "你辜负过内尔，她不肯牵你的手，你在舷梯上摔了一跤。", "You failed Nell once. She won't take your hand, and you fall on the ramp.", 0, {hp: -6}))),
      C("坐着不动", "Stay in your seat", "gsc_end_passenger", O(Q([{notFlag: "withKids"}, {notFlag: "carrier"}], true), X({sanity: -4},
        "你系好安全带，闭上眼睛。舷梯下的哭声，被舱门切断了。",
        "You buckle in and close your eyes. The crying at the foot of the ramp is cut off by the hatch.")))
    ]};

  N.gsc_807 = {chapter: 8, scene: "spore_sky", speaker: PRIMUS, foe: "hive_tyrant", time: {h: 1},
    text: L("一头巨兽落在星港中央，比楼还高，四条手臂，每一条都是武器。\n它不看任何人。它只是在指挥，整片天空都听它的。\n哈斯克首领举起枪，第一次朝天上的东西开火。",
            "A monster lands in the middle of the starport, taller than buildings, four arms, each one a weapon.\nIt looks at no one. It only commands, and the whole sky obeys.\nPrimus Hask raises his gun and, for the first time, fires at something from the sky."),
    effects: {sanity: -6},
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

  N.gsc_809 = {chapter: 8, scene: "mine_shaft", speaker: null, time: {h: 8},
    text: L("你躲在九号矿井的最底层，靠着岩壁，数着头顶的震动。\n半天过去了，灯只剩一格电。\n岩壁那头传来刮擦声，很有耐心，一点一点，在往下挖。",
            "You hide at the very bottom of Shaft Nine, back to the rock, counting the tremors overhead.\nHalf a day passes. One bar left on the lamp.\nFrom beyond the wall comes scraping. Very patient. Bit by bit, digging down."),
    effects: {sanity: -6, hp: -5},
    choices: [
      C("关掉灯，等", "Turn off the lamp and wait", "gsc_end_buried", X({sanity: -3},
        "黑暗合拢了。刮擦声停了一下，又响了起来。",
        "The dark closes in. The scraping pauses, then starts again.")),
      C("顺着旧排水道摸向星港", "Follow the old drainage tunnel toward the port", "gsc_805", O(X({hp: -8, sanity: -4},
        "排水道很窄，你爬了大半天。出口就在星港底下，你听见了矿船引擎预热的声音。",
        "The drain is narrow; you crawl most of a day. It opens right under the starport, where the hauler's engines are warming."),
        {resultAlt: [RA(F("counted"), "你记得层号，摸黑也没走错一个岔口。出口就在星港底下，矿船的引擎在预热。",
                       "You remember the levels and don't take one wrong turn in the dark. The drain opens under the starport, where the hauler's engines are warming.")]})),
      C("往上爬", "Climb", "gsc_805", X({hp: -10},
        "你爬了几个钟头，十个指甲都劈了。地面上，矿船还在。",
        "You climb for hours and split every fingernail. On the surface, the hauler is still there."))
    ]};

  N.gsc_810 = {chapter: 8, scene: "cult_shrine", speaker: GRANDSIRE, time: {h: 2},
    alt: [ADD(F("sawPurge"), "你见过它的子嗣在上面做什么。可它碰你的时候，你还是不怕。", "You've seen what its brood are doing above. Yet when it touches you, you are still not afraid.")],
    text: L("老祖宗用一只很老的手碰了碰你的额头，像在说谢谢，又像在说再见。\n然后它站起来，朝地面走去。天上有东西在叫它回家。\n所有剩下的家人，都跟在它身后。",
            "The Grandsire touches your brow with one ancient hand, like thanks, or goodbye.\nThen it rises and walks toward the surface. Something in the sky is calling it home.\nEvery remaining kin follows behind it."),
    effects: {sanity: -5},
    choices: [
      C("跟着它走", "Follow it", "gsc_end_ascension", X({corruption: 5},
        "你走在家人中间。没有人说话。头顶的天，紫得发亮。",
        "You walk among the kin. Nobody speaks. The sky above glows violet.")),
      C("逆着人流，跑向星港", "Run against the crowd to the starport", "gsc_805", X({sanity: -8, hp: -5},
        "你从几百个家人中间挤过去。他们没有拦你，只是很遗憾地看着你，像看一个错过晚饭的孩子。",
        "You push through hundreds of kin. They don't stop you, only watch with regret, like at a child who'll miss supper."))
    ]};

  /* ============ Endings ============ */
  N.gsc_end_ark = {chapter: 8, scene: "void", speaker: null, time: {d: 60, warp: true},
    jump: L("跃迁去奥雷克斯二号，船上的日子数不清", "Warp passage to Aurex Secundus; nobody aboard can count the days"),
    alt: [ADD(F("askedMercy"), "审判官说话算数：个个都验过血。", "The Inquisitor kept his word: every one tested clean."),
          ADD(F("heardTeo"), "你教他们的，是提奥最后故意唱错的那一句。", "What you teach them is the line Teo sang wrong at the end, on purpose."),
          ADD(F("savedMarr"), "你母亲在舱尾给孩子们讲执法官的故事。", "At the back your mother tells the children enforcer stories.")],
    text: L("“忍耐号”飞向奥雷克斯二号，载着一船孩子，个个都是素脸。\n身后，凯辛三号变成了一颗紫色的星，然后什么也不剩。\n你教孩子们唱歌。不是那首。是一首新的。",
            "The Endurance flies for Aurex Secundus with a hold full of children, plain-faced every one.\nBehind you Kessin Tertius becomes a violet star, then nothing at all.\nYou teach the children a song. Not that one. A new one."),
    ending: {kind: "good", title: L("素脸的孩子们", "The Plain Children"), cause: L("带着孩子们逃离", "Escaped with the children")}};

  N.gsc_end_shadow = {chapter: 8, scene: "hive_spire", speaker: ASTRO, time: {d: 9},
    alt: [ADD(F("astroCalm"), "老星语者临死前握着你的手，叫对了你的名字。", "Before he died the old astropath held your hand and said your name right.")],
    text: L("影子还在，可歌停了，影子掀开了一道缝，正好够一句话。九天后，帝国海军的炮火照亮了紫天。\n凯辛三号没保住，可整个阿尔科萨星区都听见了它的名字。\n你坐在塔的废墟上，和你记得的每一张脸。",
            "The Shadow remains, but the song stopped, and for the space of one sentence it lifted. Nine days later Imperial Navy guns light the violet sky.\nKessin Tertius could not be saved, but the whole Arcosa Sector heard its name.\nYou sit in the tower's ruins with every face you remember."),
    codex: ["place_arcosa"],
    ending: {kind: "good", title: L("阴影散去", "The Shadow Lifts"), cause: L("杀死族长，喊出警告", "Killed the Patriarch, sent the warning")}};

  N.gsc_end_witness = {chapter: 8, scene: "ship_interior", speaker: THORNE, time: {y: 1},
    jump: L("审判官的船离开星系，一年的口供", "The Inquisitor's ship leaves the system; a year of testimony"),
    alt: [ADD(F("pattern"), "你把那三十一份失踪报告，一份一份背给了书记官。", "You recite all thirty-one missing-persons reports to the scribe, one by one."),
          ADD(F("noTerms"), "“你什么也没要，”审判官说，“所以我信你。”", "“You asked for nothing,” the Inquisitor says. “That's why I believe you.”"),
          ADD(F("savedVask"), "瓦斯克也在船上，替你核对每一个日期。", "Vask is aboard too, checking every date you give.")],
    text: L("审判官的船上，你讲了一年。四代人的名字，每一碗汤，每一首歌。\n异形审判庭的档案里多了一卷：“凯辛三号：一个家庭的完整记录”。\n审判官说，下一颗星球，会因为这一卷早一点被发现。",
            "Aboard the Inquisitor's ship you talk for a year. Four generations of names, every bowl of soup, every song.\nThe Ordo Xenos archive gains a volume: “Kessin Tertius: the complete record of one family.”\nThe Inquisitor says the next world will be found a little sooner because of it."),
    ending: {kind: "good", title: L("证人", "The Witness"), cause: L("成为审判庭的证人", "Became the Inquisition's witness")}};

  N.gsc_end_lastshift = {chapter: 8, scene: "spore_sky", speaker: null, foe: "hive_tyrant", time: {h: 2},
    alt: [ADD(FN("gsc_806"), "内尔站在你身边。她说，她终于不用再听它们了。", "Nell stands beside you. She says at last she doesn't have to listen to them."),
          ADD(FN("gsc_807"), "首领靠在你肩上，说：“最后一班。”", "The Primus leans on your shoulder. “Last shift,” he says.")],
    text: L("你和留下的人守着空荡荡的星港，一直守到天黑。\n矿船的尾焰变成一颗小星星，又变成什么都没有。\n你点点头。这辈子，这是你干过最值的一班。",
            "You and those who stayed hold the empty starport until nightfall.\nThe hauler's exhaust becomes a small star, then nothing.\nYou nod. It's the best shift you ever worked."),
    ending: {kind: "good", title: L("最后一班", "The Last Shift"), cause: L("断后，让孩子们走", "Held the line so the children could go")}};

  N.gsc_end_passenger = {chapter: 8, scene: "void", speaker: null, time: {d: 60, warp: true},
    jump: L("跃迁去奥雷克斯二号，船上的日子数不清", "Warp passage to Aurex Secundus; nobody aboard can count the days"),
    text: L("“忍耐号”飞向奥雷克斯二号。你坐在靠窗的位置，舷窗外，凯辛三号变成一颗紫色的星。\n舱门的缝里，还卡着一只小孩的鞋。\n你一路都没有回头。你活下来了。只是活下来了。",
            "The Endurance flies for Aurex Secundus. You have the window seat; outside, Kessin Tertius becomes a violet star.\nWedged in the hatch seam is one small child's shoe.\nYou never look back, the whole way. You lived. That's all you did."),
    ending: {kind: "bad", title: L("一个座位", "One Seat"), cause: L("占了孩子的座位活下来", "Lived by taking a child's seat")}};

  N.gsc_end_ascension = {chapter: 8, scene: "spore_sky", speaker: STARS, time: {h: 1},
    alt: [ADD(F("sawPurge"), "老祖宗的子嗣走在最前面，替它们开门。", "The Grandsire's brood walk at the front, opening the door for them.")],
    text: L("升天之日，你和家人们站在一起，仰着头。\n星之子降下来了，正如主祭说的那样，把你们全都接走，变成他们的一部分。\n一点也不剩。他们甚至不知道，你们曾经为他们唱过歌。",
            "On the Day of Ascension you stand with the family, faces upturned.\nThe Star Children descend, just as the Magus said, and take you all up, make you part of them.\nNothing is left over. They never even knew you once sang for them."),
    ending: {kind: "bad", title: L("升天", "Ascension"), cause: L("在歌声中被虫群吞噬", "Devoured mid-hymn by the swarm")}};

  N.gsc_end_corrected = {chapter: 6, scene: "gsc_chapel", speaker: MAGUS, time: {d: 3},
    text: L("主祭治好了你。你再也不害怕了，再也不怀疑了。\n你每天都笑，笑得和所有人一模一样，嗡鸣替你记着一切。\n升天之日来的时候，你是第一个跑去迎接的。",
            "The Magus heals you. You are never afraid again, never doubtful again.\nYou smile every day, exactly like everyone else; the hum remembers everything for you.\nWhen the Day of Ascension comes, you are the first to run out and greet it."),
    ending: {kind: "bad", title: L("被治好的人", "Healed"), cause: L("心智被主祭抹平", "Mind smoothed away by the Magus")}};

  N.gsc_end_seed = {chapter: 8, scene: "underhive", speaker: null, time: {y: 5},
    jump: L("五年后，另一颗星的下巢", "Five years on, the underhive of another world"),
    alt: [ADD(F("blessed"), "你脖子上那个小小的印记，一直没有消。", "The tiny mark on your neck never fades.")],
    text: L("“忍耐号”到了奥雷克斯二号。你在下巢找了份活，过得很安静。\n五年后，下巢有一户新的人家，星期天总多做一份饭，墙上挂着一幅四只手的帝皇像。\n孩子们都长着同一双淡紫色的眼睛。",
            "The Endurance reaches Aurex Secundus. You find work in the underhive and live quietly.\nFive years later a new underhive family always cooks one extra plate on Sundays, and a four-armed Emperor hangs on their wall.\nThe children all share the same pale violet eyes."),
    codex: ["place_aurex"],
    ending: {kind: "bad", title: L("种子", "The Seed"), cause: L("把家族带到了新的星球", "Carried the family to a new world")}};

  N.gsc_end_devoured = {chapter: 8, scene: "spore_sky", speaker: null, foe: "hive_tyrant", time: {h: 1},
    text: L("你没有跑掉。\n后来，整颗星球的一切活物都被收走：矿工、执法官、家人、孢子底下的苔藓。\n虫群离开时，凯辛三号只剩下光秃秃的石头，和一座还挂着四臂像的空房子。",
            "You don't get away.\nAfterward everything living on the world is gathered up: miners, enforcers, kin, the moss beneath the spores.\nWhen the swarm leaves, Kessin Tertius is bare stone, and one empty house with a four-armed icon on the wall."),
    ending: {kind: "bad", title: L("生物质", "Biomass"), cause: L("死在星港的舷梯前", "Died before the hauler's ramp")}};

  N.gsc_end_buried = {chapter: 8, scene: "mine_shaft", speaker: null, time: {d: 20},
    alt: [ADD(F("counted"), "你本可以走排水道的。你数过层数。", "You could have taken the drain. You had counted the levels.")],
    text: L("你一直待在矿井最深处。灯灭了，刮擦声停了，地面上的声音也停了。\n后来，什么声音都没有了。\n你在黑暗里待了很久。这颗星上，你是最后一个记得那些歌的人。",
            "You stay at the very bottom of the mine. The lamp dies; the scraping stops; the sounds above stop too.\nThen there is no sound at all.\nYou stay in the dark a long time. On this world, you are the last one who remembers the songs."),
    ending: {kind: "bad", title: L("最深一层", "The Deepest Level"), cause: L("困死在最深的矿井", "Entombed in the deepest shaft")}};

  N.gsc_end_purged = {chapter: 6, scene: "underhive", speaker: THORNE, time: {d: 1},
    text: L("审判庭的名单很长，你在第四百一十二行。\n罪名是“与异形勾结”。你想说，他们只是给了你一碗汤。\n审判官合上名单，第四百一十三行，是内尔。",
            "The Inquisition's list is long. You're on line four hundred and twelve.\nCharge: consorting with the xenos. You want to say they only gave you a bowl of soup.\nThe Inquisitor closes the list. Line four hundred and thirteen is Nell."),
    ending: {kind: "bad", title: L("净化名单", "On the List"), cause: L("被审判庭处决", "Executed by the Inquisition")}};

  /* ============ Claim endings (SPEC §19). The Shadow in the Warp muffles the gods; these are rare and strange.
   * They can fire in any chapter, so each one spans the time itself ("from then on ... until the sky turned violet"). ============ */
  N.gsc_end_claim_khorne = {scene: "ruins", speaker: S("sigil_khorne", "影子底下的鼓", "A Drum Beneath the Shadow"),
    text: L("从那天起，你开始打架：在矿口，在集市，在家里。后来天变紫了，你在废墟里杀了十天虫子。\n影子罩着这颗星，诸神听不见。可你的怒火漏了出去。\n影子退去那夜，一面鼓找到了你。它不在乎血是谁的。",
            "From that day you fight: at the pithead, in the market, at home. Then the sky turns violet, and you kill beasts in the ruins for ten days.\nThe Shadow covers this world and the gods can't hear. But your rage is too big, and leaks out beneath it.\nThe night the Shadow lifts, a drum finds you. It doesn't care whose blood it was."),
    codex: ["god_khorne"],
    ending: {kind: "bad", title: L("漏出影子的怒火", "Rage Beneath the Shadow"), cause: L("影子退去时被恐虐收走", "Taken by Khorne as the Shadow lifted")}};

  N.gsc_end_claim_nurgle = {scene: "mine_shaft", speaker: S("sigil_nurgle", "温暖的苔藓", "Warm Moss"),
    text: L("从那天起，你身上长出了别的东西，又暖又软，不是家族的，是另一种爱。\n后来虫群来了，把所有活物都收走。只有你，它们嗅了嗅，绕开了。\n连吞噬者都不要你。可慈祥的祖父要。他一向什么都要。",
            "From that day something else grows in you, warm and soft. Not the family's. A different kind of love.\nLater the swarm comes and gathers every living thing. You alone they sniff, and pass by.\nEven the Devourer doesn't want you. But a kindly Grandfather does. He always wants everything."),
    codex: ["god_nurgle"],
    ending: {kind: "bad", title: L("连虫群都不要", "Even the Swarm Passed By"), cause: L("被纳垢留作花园", "Kept by Nurgle for his garden")}};

  N.gsc_end_claim_tzeentch = {scene: "warp", speaker: S("daemon_tzeentch", "影子里的一道缝", "A Crack in the Shadow"), time: {d: 5, warp: true},
    jump: L("你从影子的缝里滑了出去", "You slip out through a crack in the Shadow"),
    text: L("影子那么大，大得像一面墙。可墙上有一道缝，正好是你的形状。\n有人很早就在等你了，比老祖宗来得更早，比星之子来得更早。\n“家族是个好计划，”那个声音说，“可我的计划，更长。”",
            "The Shadow is vast as a wall. But the wall has a crack in it, exactly your shape.\nSomeone has been waiting for you a long time: since before the Grandsire, before the Star Children.\n“The family was a good plan,” the voice says. “Mine is longer.”"),
    codex: ["god_tzeentch"],
    ending: {kind: "bad", title: L("影子里的缝", "The Crack in the Shadow"), cause: L("从影子的缝隙被奸奇带走", "Slipped through the Shadow to Tzeentch")}};

  N.gsc_end_claim_slaanesh = {scene: "gsc_chapel", speaker: S("sigil_slaanesh", "空礼拜堂里的回声", "An Echo in the Empty Chapel"),
    text: L("家族的爱太满了，你离不开。从那天起你一直在唱，家人都不在了，你还在空礼拜堂里唱给自己听。\n影子里她听不见你。你的渴望一遍遍回响，越来越甜。\n影子退去那天，她就在门口，等着听第一万遍。",
            "The family's love was so full you can't do without it. From that day you sing, and when the kin are gone you still sing in the empty chapel, to yourself.\nIn the Shadow she can't hear you, so your longing only echoes, sweeter each time.\nThe day the Shadow lifts, she's waiting at the door to hear it for the ten-thousandth time."),
    codex: ["god_slaanesh"],
    ending: {kind: "bad", title: L("一万遍", "Ten Thousand Times"), cause: L("在渴望中被色孽收走", "Taken by Slaanesh through longing")}};

  /* ============ Death nodes (engine-triggered, from any chapter; worded place-neutral, varied by alt) ============ */
  N.gsc_death_hp = {scene: "mine_shaft", speaker: null,
    alt: [ADD({fromChapter: {min: 7}}, "那天的天是紫的。来抬你的，是最后几个还记得你名字的人。", "The sky that day was violet. Those who carried you were the last who knew your name.")],
    text: L("你倒下的地方，灯滚出去很远，照着一面墙上的小画：四只手的人，落下的星星。\n过了一会儿，几个戴兜帽的人来了，把你抬走，像抬家人一样小心。\n他们照顾自己人。到最后也是。",
            "Where you fall, your lamp rolls far off and lights some little carvings on a wall: four-armed figures, falling stars.\nAfter a while hooded figures come and carry you away, careful as with family.\nThey look after their own. To the very end."),
    ending: {kind: "death", title: L("抬走", "Carried Home"), cause: L("伤重而死", "Died of wounds")}};

  N.gsc_death_sanity = {scene: "gsc_chapel", speaker: null,
    alt: [ALT({fromChapter: {max: 1}}, "你再也分不清哪个声音是自己的了。\n隔壁传来霍林家的歌，你跟着那个调子走了出去，再也没回来。\n第二天，霍林家多了一个总在微笑的人。没人记得这人原来叫什么。",
            "You can no longer tell which voice is yours.\nThrough the wall comes a Hollin song; you follow the tune out the door and never come back.\nNext day the Hollins have one more person who always smiles. Nobody remembers their old name."),
          ALT({fromChapter: {min: 7}}, "你再也分不清哪个声音是自己的了。\n城里已经没有人在唱了。可你脑子里那首歌还在，越来越响，你跟着它走进了紫色的雾里。\n再也没有人记得你原来叫什么。",
            "You can no longer tell which voice is yours.\nNo one in the city sings anymore. But the song in your head goes on, louder and louder, and you follow it into the violet haze.\nNo one is left who remembers your old name.")],
    text: L("你再也分不清哪个声音是自己的了。\n嗡鸣里有几百个声音，你挑了一个最温柔的，跟着它走，再也没回来。\n家里多了一个总在微笑的人。没人记得这人原来叫什么。",
            "You can no longer tell which voice is yours.\nThe hum holds hundreds. You pick the gentlest, follow it, and never come back.\nThe family gains one more person who always smiles. Nobody remembers their old name."),
    ending: {kind: "death", title: L("几百个声音之一", "One of Hundreds"), cause: L("自我溶进了族群意识", "Self dissolved into the Broodmind")}};

  N.gsc_death_corruption = {scene: "cult_shrine", speaker: null,
    text: L("家的血终于把你填满了。你的皮肤越来越硬，你的心越来越暖，你想不起“我”这个字。\n你听见一个很老、很老的声音，很满意。\n你是家的一部分了。只是一部分。",
            "The family's blood fills you at last. Your skin hardens, your heart warms, and you can't recall the word “I.”\nYou hear a very, very old voice, satisfied.\nYou are part of the family now. Only a part."),
    ending: {kind: "death", title: L("一部分", "Only a Part"), cause: L("被家族的血完全吞没", "Wholly consumed by the family's blood")}};


  /* ============ Route taint events (SPEC §18, §26: 5 incl. 1 cleanse) + route events ============ */
  WH.registerEvents([
    {id: "evt_t_gsc_khorne", god: "khorne", factions: ["gsc"], minChapter: 2, where: {chapter: {min: 2, max: 5}},
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

    {id: "evt_t_gsc_nurgle", god: "nurgle", factions: ["gsc"], minChapter: 2, where: {chapter: {min: 2, max: 5}},
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

    {id: "evt_t_gsc_tzeentch", god: "tzeentch", factions: ["gsc"], minChapter: 3, where: {chapter: {min: 3, max: 5}},
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

    {id: "evt_t_gsc_slaanesh", god: "slaanesh", factions: ["gsc"], minChapter: 4, where: {chapter: {min: 4, max: 4}},
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

    {id: "evt_t_gsc_cleanse", god: "other", cleanse: true, factions: ["gsc"], minChapter: 3, where: {chapter: {min: 3, max: 6}},
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

    {id: "evt_gsc_rockfall", god: "other", factions: ["gsc"], minChapter: 2, where: {chapter: {min: 2, max: 5}},
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

    {id: "evt_gsc_census", god: "other", factions: ["gsc"], minChapter: 4, where: {chapter: {min: 4, max: 5}},
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
    RU("rum_gsc_macragge", 3, 6, L("葬礼后老矿工的故事", "An old miner's funeral tale"),
      L("“我爷爷说，很久以前，一支虫子舰队扑向极限战士的星球。天上全是星星，往下掉。”",
        "“Grandad said a bug fleet once fell on the Ultramarines' world. The sky full of stars, all of them falling.”"),
      ["chr_macragge"], {codex: ["gsc_star_children"], keywords: {zh: ["星之子", "星星", "挽歌"], en: ["Star Children", "stars", "lament"]}}),
    RU("rum_gsc_vigilus", 3, 6, L("操练时的低语", "Whispered during drill"),
      L("“听说在一颗叫维吉卢斯的星上，家里人起事了，差一点就拿下了整颗星。”",
        "“They say on a world called Vigilus the family rose up and nearly took the whole planet.”"),
      ["chr_vigilus"], {scenes: ["cult_shrine"], sprites: ["gsc_primus"], keywords: {zh: ["那一天"], en: ["the Day"]}}),
    RU("rum_gsc_leviathan", 4, 7, L("候船厅的公告屏", "The departure-hall notice screen"),
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
       max: {hp: 100, sanity: 95}, stats: {hp: 100, sanity: 95, corruption: 5, renown: 20}, set: {origin_kin: true, carrier: true}}
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
