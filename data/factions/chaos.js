/* data/factions/chaos.js — Chaos route (text role).
 * Player: underhive scavenger in Hive Vorne on Carcharos, drawn into the "Choir" cult. Start 111.M42.
 * Helpers: L(zh,en) localized string; S(sprite,zh,en) speaker; C(zh,en,next,extra) choice; R(p,stat,ok,ko) roll.
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
  function R(p, stat, success, fail) { return {roll: {p: p, stat: stat, success: success, fail: fail}}; }

  var TIKKA   = S("cultist", "蒂卡", "Tikka");
  var WHISTLE = S("mutant", "哨子", "Whistle");
  var KADE    = S("enforcer", "执法官凯德", "Enforcer Kade");
  var VELLUM  = S("cult_magus", "维勒姆神父", "Father Vellum");
  var IXARIL  = S("chaos_sorcerer", "伊克萨里尔", "Ixaril");
  var VORGATH = S("heretic_astartes", "沃加斯", "Vorgath");
  var STRAND  = S("inquisitor", "斯特兰德审判官", "Inquisitor Strand");

  var N = {};

  /* ============ Chapter 1 · The Sump ============ */
  N.cha_101 = {chapter: 1, scene: "underhive", speaker: null,
    text: L("污池。上巢扔下来的东西，掉到这里都成了宝贝：半截电线，一只鞋，一颗还会眨的义眼。\n你三天没吃东西了。蒂卡说，今天垃圾瀑布会下“好货”。",
            "The Sump. Anything the spire throws away is treasure down here: half a cable, one shoe, a bionic eye that still blinks.\nYou haven't eaten in three days. Tikka swears the garbage falls will drop “good stuff” today."),
    codex: ["imp_hive", "place_carcharos", "place_sump"],
    choices: [
      C("跟蒂卡去垃圾瀑布", "Go to the garbage falls with Tikka", "cha_102"),
      C("独自去旧水泵站", "Head to the old pump station alone", "cha_103")
    ]};

  N.cha_102 = {chapter: 1, scene: "underhive", speaker: TIKKA, time: {h: 2},
    text: L("垃圾轰隆隆地落下。蒂卡捞出一尊巴掌大的小雕像，摸上去是温的。\n“能换两天口粮！”她缺了门牙，笑起来漏风。\n雕像的脸好像在看你。",
            "The garbage falls thunder down. Tikka fishes out a palm-sized statuette. It's warm.\n“That's two days' rations!” She's missing her front teeth; her grin whistles.\nThe statue's face seems to be watching you."),
    choices: [
      C("把雕像揣进自己怀里", "Tuck the statue into your own coat", "cha_104", {effects: {corruption: 4, sanity: -5, set: {idol: true}}}),
      C("让她拿去换吃的", "Let her trade it for food", "cha_104", {effects: {hp: 10}})
    ]};

  N.cha_103 = {chapter: 1, scene: "underhive", speaker: WHISTLE, time: {h: 2},
    text: L("水泵站里住着一个变种人，脖子两侧长着鳃，说话带哨音。大家叫他“哨子”。\n他在过滤水，一滴一滴。“喝吧，”他说，“别告诉执法官你见过我。”",
            "A mutant lives in the pump station. Gills flutter on his neck; he whistles when he talks. Everyone calls him Whistle.\nHe's filtering water, drop by drop. “Drink,” he says. “Don't tell the enforcers you saw me.”"),
    codex: ["chaos_mutant"],
    choices: [
      C("道谢，陪他聊会儿", "Thank him and stay a while", "cha_104", {effects: {sanity: 5, hp: 5, set: {whistleFriend: true}}}),
      C("趁他转身偷走水桶", "Steal his bucket when he turns", "cha_104", {effects: {hp: 15, corruption: 3, set: {robbedWhistle: true}}})
    ]};

  N.cha_104 = {chapter: 1, scene: "underhive", speaker: KADE, time: {h: 4},
    text: L("哨声大作。执法官凯德带队扫荡污池，头盔灯扫过每一张脸。\n“变种人，异端，没登记的人口，”他说，“上巢嫌今年的污池太挤了。”\n他的火焰喷射器咔哒一响。",
            "Whistles shriek. Enforcer Kade sweeps the Sump, helmet lamps raking every face.\n“Mutants, heretics, unregistered population,” he says. “The spire thinks the Sump's too crowded this year.”\nHis flamer clicks."),
    effects: {sanity: -5},
    codex: ["imp_arbites"],
    choices: [
      C("拉着蒂卡钻进管道", "Drag Tikka into the pipes", "cha_105"),
      C("替哨子引开执法官", "Draw the enforcers away from Whistle", "cha_106", {require: {flag: "whistleFriend"}, hideIfLocked: true}),
      C("指认哨子，换赏金", "Point out Whistle for the bounty", "cha_105", {effects: {hp: 10, corruption: 4, sanity: -10, set: {betrayedWhistle: true}}})
    ]};

  N.cha_106 = {chapter: 1, scene: "underhive", speaker: KADE, time: {h: 1},
    text: L("你朝反方向扔出一块铁皮：“变种人往那边跑了！”\n凯德追了两步，停下，慢慢转过身。\n他用警棍敲了你三下，不紧不慢，像在敲门。“我记住你的脸了。”",
            "You hurl a scrap of sheet metal the other way. “The mutant went that way!”\nKade takes two steps, stops, and slowly turns.\nHe hits you three times with his baton, unhurried, like knocking on a door. “I'll remember your face.”"),
    effects: {hp: -15, set: {whistleOwes: true, kadeKnows: true}},
    choices: [
      C("爬回窝棚", "Crawl back to your shack", "cha_105")
    ]};

  N.cha_105 = {chapter: 1, scene: "underhive", speaker: TIKKA, time: {d: 2},
    text: L("两天后，蒂卡咳得越来越重，咳出来的东西是绿色的。\n污池里在传：中巢有群穿灰袍的人在发面包，不问名字，不收钱。\n“我们去吧，”蒂卡说，“就这一次。”",
            "Two days later Tikka's cough is worse. What comes up is green.\nWord in the Sump: in the mid-hive, people in grey robes are handing out bread. No names asked, no coin taken.\n“Let's go,” Tikka says. “Just this once.”"),
    choices: [
      C("走，去中巢", "All right. The mid-hive.", "cha_107"),
      C("先去药房给她偷药", "Steal her medicine first", "cha_107", {effects: {hp: -10, renown: 3, set: {stoleMedicine: true}}})
    ]};

  N.cha_107 = {chapter: 1, scene: "cult_shrine", speaker: VELLUM, time: {h: 6},
    text: L("灰袍人住在一座废弃的礼拜堂里。领头的老人叫维勒姆，他记得每个人的名字，很快也记住了你的。\n他亲手给蒂卡盛了满满一碗汤：“上巢吃的是你们的汗。在这里，你们先吃。”",
            "The grey-robes keep an abandoned chapel. Their leader, an old man named Vellum, knows every name, and soon knows yours.\nHe ladles Tikka a brimming bowl himself. “The spire eats your sweat. Here, you eat first.”"),
    effects: {hp: 15},
    codex: ["chaos_cult", "place_choir_chapel"],
    choices: [
      C("狼吞虎咽", "Wolf it down", "cha_108", {effects: {hp: 10}}),
      C("先问他要什么回报", "Ask what he wants in return", "cha_108", {effects: {sanity: 5, set: {askedPrice: true}}})
    ]};

  N.cha_108 = {chapter: 1, scene: "cult_shrine", speaker: VELLUM, time: {h: 5},
    text: L("那天夜里，维勒姆跪在地上，亲手给新来的人洗脚。轮到你时，他洗得很仔细，连脚趾缝里的泥都没放过。\n“在上巢眼里，你们是数字，”他说，“在这里，你们是家人。”\n你从没被人这样对待过。",
            "That night Vellum kneels and washes the newcomers' feet with his own hands. With yours he is meticulous, down to the grime between your toes.\n“To the spire, you're numbers,” he says. “Here, you're family.”\nNo one has ever treated you like this."),
    effects: {sanity: 10},
    choices: [
      C("让他洗", "Let him", "cha_201", {effects: {corruption: 3}}),
      C("缩回脚，说不用了", "Pull your feet back, say no need", "cha_201", {effects: {renown: -2}})
    ]};

  /* ============ Chapter 2 · The Choir ============ */
  N.cha_201 = {chapter: 2, scene: "cult_shrine", speaker: VELLUM, time: {d: 14},
    text: L("两周里你天天吃饱。没人打你，没人查你的编号。\n夜里维勒姆讲道：“帝皇是一具尸体，坐在金椅子上。真正听得见你们的，是另外四位。”\n他说“四位”时，烛火齐齐晃了一下。",
            "For two weeks you eat your fill. Nobody beats you. Nobody checks your number.\nAt night Vellum preaches. “The Emperor is a corpse on a golden chair. The ones who truly hear you are four others.”\nWhen he says “four,” every candle flickers at once."),
    effects: {corruption: 3, sanity: 5},
    codex: ["chaos_gods", "imp_emperor", "place_terra"],
    choices: [
      C("哪四位？", "Which four?", "cha_202"),
      C("这都是疯话", "This is madness", "cha_203", {effects: {sanity: 5}})
    ]};

  N.cha_202 = {chapter: 2, scene: "cult_shrine", speaker: VELLUM, time: {h: 1},
    text: L("“一位爱你的愤怒，一位爱你病着还能笑，一位爱你改变，一位爱你想要。”维勒姆掰着手指，“他们从不挑剔。”\n“那帝皇爱什么？”\n“什么都不爱。他死了。”",
            "“One loves your anger. One loves you smiling through sickness. One loves you changing. One loves you wanting.” Vellum counts on his fingers. “They're never picky.”\n“And what does the Emperor love?”\n“Nothing. He's dead.”"),
    effects: {corruption: 3},
    choices: [
      C("记住这四个", "Remember the four", "cha_203")
    ]};

  N.cha_203 = {chapter: 2, scene: "cult_shrine", speaker: TIKKA, time: {d: 5},
    text: L("蒂卡不咳了。她胖了些，脸色红润，脖子上起了几个小疙瘩，她说一点都不疼。\n“神父说是‘老爷爷’治好的我，”她高兴地说，“老爷爷爱所有人。”",
            "Tikka has stopped coughing. She's filled out, cheeks rosy, a few little boils on her neck she says don't hurt at all.\n“Father says Grandfather healed me,” she beams. “Grandfather loves everyone.”"),
    codex: ["god_nurgle"],
    choices: [
      C("摸摸她的头", "Ruffle her hair", "cha_204", {effects: {sanity: 5}}),
      C("盯着那些疙瘩", "Stare at the boils", "cha_204", {effects: {sanity: -5}})
    ]};

  N.cha_204 = {chapter: 2, scene: "cult_shrine", speaker: VELLUM, time: {d: 10},
    text: L("入会之夜。每个新人都要献上一样东西。有人割破手掌，有人说出从没告诉过别人的秘密。\n维勒姆耐心地等着你：“诸神不要贵重的，只要真的。”",
            "Initiation night. Each newcomer must offer something. Some cut their palms. Some speak a secret they've never told a soul.\nVellum waits for you, patient. “The gods don't want what's valuable. Only what's true.”"),
    choices: [
      C("献上一滴血", "Offer a drop of blood", "cha_205", {effects: {hp: -5, corruption: 4, renown: 5, set: {bloodGift: true}}}),
      C("说出一个秘密", "Speak a secret", "cha_205", {effects: {sanity: -10, corruption: 4, renown: 5, set: {secretGift: true}}}),
      C("什么都不献", "Offer nothing", "cha_206")
    ]};

  N.cha_206 = {chapter: 2, scene: "cult_shrine", speaker: VELLUM, time: {h: 1},
    text: L("维勒姆笑了，笑了很久。周围的人也跟着笑，节奏一模一样。\n“那么，”他温和地说，“你本身就是礼物。”\n有人关上了礼拜堂的门。蒂卡低下了头。",
            "Vellum smiles, and keeps smiling a long time. The others smile with him, all in the same rhythm.\n“Then,” he says gently, “you are the gift.”\nSomeone closes the chapel doors. Tikka stares at the floor."),
    effects: {sanity: -10},
    choices: [
      C("我献血！现在就献！", "Blood! I'll give blood, now!", "cha_205", {effects: {hp: -15, corruption: 4}}),
      C("撞开门逃跑", "Smash through the doors", null, R(0.5, "hp", "cha_207", "cha_end_sacrifice"))
    ]};

  N.cha_end_sacrifice = {chapter: 2, scene: "cult_shrine", speaker: TIKKA, time: {d: 1},
    text: L("门很结实。\n后来，诗班的人提起你都很尊敬：第一个被献给四位的人，祭坛的烛火为你烧了一整夜。\n蒂卡每天都给你的空座位盛一碗汤。",
            "The doors hold.\nAfterward the Choir speaks of you with reverence: the first one given to the Four. The altar candles burned all night for you.\nEvery day, Tikka sets a bowl of soup at your empty place."),
    ending: {kind: "bad", title: L("祭品", "The Offering"), cause: L("被献祭给四神", "Sacrificed to the Four")}};

  N.cha_207 = {chapter: 2, scene: "underhive", speaker: TIKKA, time: {d: 1},
    text: L("你撞开门，一路逃回污池，身后没人追。\n第二天，蒂卡提着一篮面包来找你：“神父说你很勇敢，诸神喜欢倔的。他请你回去。”\n你饿了。你回去了。",
            "You burst through and run all the way back to the Sump. No one follows.\nNext morning Tikka turns up with a basket of bread. “Father says you're brave. The gods like stubborn ones. He wants you back.”\nYou're hungry. You go back."),
    effects: {renown: 5, set: {stubborn: true}},
    choices: [
      C("跟她回去", "Go back with her", "cha_205")
    ]};

  N.cha_205 = {chapter: 2, scene: "cult_shrine", speaker: null, time: {d: 30}, eventRoll: 0.3,
    text: L("你手腕上多了个烙印，八道细线从一点散开。不疼，只是偶尔发烫，像有人在远处想你。\n一个月里你总做同一个梦：一扇门，门后四个声音在争论谁先开门。",
            "A brand appears on your wrist: eight thin lines from a single point. It doesn't hurt. Now and then it grows warm, as if someone far away is thinking of you.\nFor a month you dream the same dream: a door, and four voices behind it arguing over who opens it first."),
    effects: {corruption: 3, renown: 5},
    codex: ["chaos_warp"],
    choices: [
      C("在梦里推开那扇门", "Push the door open in the dream", "cha_208", {effects: {corruption: 7, renown: 5, sanity: -5}}),
      C("醒来，用冷水洗脸", "Wake up and splash cold water on your face", "cha_208", {effects: {sanity: 5, corruption: -5}})
    ]};

  N.cha_208 = {chapter: 2, scene: "manufactorum", speaker: VELLUM, time: {d: 20},
    text: L("维勒姆召集了所有人。“什一税之夜，上巢守卫要下来征兵。那时我们起事。”\n他分派任务：炸水厂，开监狱，烧大教堂。\n“你呢，”他问，“你想要什么？”",
            "Vellum gathers everyone. “On Tithe Night the spire guard comes down for conscripts. That's when we rise.”\nHe hands out tasks: blow the water plant, open the prisons, burn the cathedral.\n“And you,” he asks. “What do you want?”"),
    choices: [
      C("我要上巢付出代价", "I want the spire to pay", "cha_209", {effects: {renown: 5, set: {wantRevenge: true}}}),
      C("我只想大家都吃饱", "I just want everyone fed", "cha_209", {effects: {sanity: 5, set: {wantBread: true}}}),
      C("我想看看会发生什么", "I want to see what happens", "cha_209", {effects: {corruption: 4, set: {wantChange: true}}})
    ]};

  N.cha_209 = {chapter: 2, scene: "cult_shrine", speaker: TIKKA, time: {d: 3},
    text: L("起事前三天，面包开始要价了。每人得交一个名字：一个不肯唱歌的邻居。\n蒂卡已经交了三个。“他们会被‘请’去礼拜堂，”她说，“然后就会唱了。”\n她说得很轻松，像在说晚饭吃什么。",
            "Three days before the rising, the bread starts costing something. Everyone must hand in a name: a neighbour who won't sing.\nTikka has already given three. “They'll be invited to the chapel,” she says. “Then they'll sing.”\nShe says it lightly, like discussing dinner."),
    effects: {sanity: -5},
    choices: [
      C("交一个名字", "Hand in a name", "cha_301", {effects: {corruption: 4, renown: 5, sanity: -5}}),
      C("交上凯德的名字", "Hand in Kade's name", "cha_301", {require: {flag: "kadeKnows"}, hideIfLocked: true, effects: {renown: 8}}),
      C("编一个不存在的人", "Make up someone who doesn't exist", "cha_301", {effects: {sanity: 5, set: {fakeName: true}}})
    ]};

  /* ============ Chapter 3 · Uprising ============ */
  N.cha_301 = {chapter: 3, scene: "burning_city", speaker: TIKKA, time: {d: 9}, eventRoll: 0.3,
    text: L("什一税之夜。水厂炸了，中巢的灯同时熄灭。黑暗里，几万人一起唱起诗班的歌。\n你从没见过这么多人笑着冲向火光。\n蒂卡塞给你一根撬棍：“走！”",
            "Tithe Night. The water plant blows and every light in the mid-hive dies. In the dark, tens of thousands sing the Choir's hymn together.\nYou've never seen so many people run toward fire, laughing.\nTikka shoves a crowbar into your hands. “Come on!”"),
    effects: {corruption: 3},
    choices: [
      C("冲向上巢的闸门", "Charge the spire gates", "cha_302"),
      C("去监狱放人", "Break open the prison", "cha_303"),
      C("趁乱溜进贵族区", "Slip into the noble quarter", "cha_304")
    ]};

  N.cha_302 = {chapter: 3, scene: "burning_city", speaker: S("commissar", "政委", "Commissar"), foe: "guardsman", time: {h: 2},
    text: L("闸门后，一排星界军早已列阵。枪口整齐划一，像一道栅栏。\n大檐帽的政委在队列后踱步，声音不高：“齐射。”\n前排倒下了。后排的人接着冲，还在唱。",
            "Behind the gate, a line of Astra Militarum stands ready, muzzles aligned like a fence.\nA commissar in a peaked cap paces behind them. He barely raises his voice. “Volley.”\nThe front rank falls. The ones behind keep charging, still singing."),
    effects: {sanity: -10},
    codex: ["imp_guard", "imp_commissar"],
    choices: [
      C("跟着冲上去", "Charge with them", null, R(0.45, "hp", "cha_305", "cha_306")),
      C("拉住蒂卡，躲进侧巷", "Grab Tikka and duck into an alley", "cha_305", {effects: {sanity: -5}})
    ]};

  N.cha_303 = {chapter: 3, scene: "barracks", speaker: WHISTLE, time: {h: 2},
    text: L("监狱里关的全是“欠税的人”。你撬开一扇扇门，放出来的人没一个回家，全都走向火光。\n最后一间牢房里蹲着哨子。他看见你，鳃轻轻开合，吹出一个很长的音。",
            "The prison holds people who “owed the tithe.” You pry open door after door. Not one of the freed goes home; all walk toward the fire.\nIn the last cell crouches Whistle. He sees you. His gills flutter and let out one long note."),
    choices: [
      C("“对不起。”", "“I'm sorry.”", "cha_305", {require: {flag: "betrayedWhistle"}, hideIfLocked: true, effects: {sanity: -5, set: {whistleJoined: true}}}),
      C("“走，跟我们走。”", "“Come on. Come with us.”", "cha_305", {effects: {sanity: 5, set: {whistleJoined: true}}}),
      C("锁上门，离开", "Lock the door and leave", "cha_305", {effects: {corruption: 4, sanity: -10}})
    ]};

  N.cha_304 = {chapter: 3, scene: "hive_spire", speaker: S("daemon_slaanesh", "镜中的你", "You, in the Mirror"), time: {h: 2},
    text: L("贵族的宅子空了，香水味还没散。你在一面金框镜子前停下。\n镜子里的你干净、漂亮、自信，穿着丝绸，冲你眨了眨眼。\n“你本来就该是这样，”它说，“只要你想要。”",
            "The noble's mansion is empty, the perfume still lingering. You stop before a gilt mirror.\nThe you inside is clean, beautiful, confident, dressed in silk. Mirror-you winks.\n“This is who you were meant to be,” it says. “You need only want it.”"),
    codex: ["god_slaanesh"],
    choices: [
      C("伸手去摸镜子", "Reach out and touch the glass", "cha_305", {effects: {corruption: 7, renown: 5, sanity: -5, set: {mirrorTouched: true}}}),
      C("砸碎镜子", "Smash the mirror", "cha_305", {effects: {sanity: -5, hp: -5}}),
      C("撬下金框拿去换钱", "Pry off the gold frame to sell", "cha_305", {effects: {hp: 5, renown: 2}})
    ]};

  N.cha_305 = {chapter: 3, scene: "cathedral", speaker: VELLUM, foe: "daemon_khorne", time: {h: 4},
    text: L("天亮前，维勒姆在大教堂里完成了仪式。地上的血圈先是发烫，然后开始吼叫。\n一个红色的东西爬了出来，拖着一把烧红的剑。它先杀的，是离它最近的信徒。",
            "Before dawn, Vellum completes the rite in the cathedral. The circle of blood on the floor grows hot, then begins to roar.\nA red thing climbs out, dragging a glowing blade. The first to die is the nearest believer."),
    effects: {sanity: -10},
    codex: ["god_khorne", "chaos_daemon_khorne"],
    choices: [
      C("跪下", "Kneel", "cha_307", {effects: {corruption: 4, renown: 5}}),
      C("拖着蒂卡往外跑", "Drag Tikka out", "cha_307", {effects: {hp: -10, sanity: 5}}),
      C("冲它吼回去", "Roar right back at it", "cha_307", {effects: {renown: 10, hp: -15, set: {roaredKhorne: true}}})
    ]};

  N.cha_306 = {chapter: 3, scene: "burning_city", speaker: KADE, time: {h: 8},
    text: L("一道激光打穿了你的大腿。你倒在闸门前，被后面的人踩了过去。\n醒来时，你被铐在囚车里。凯德坐在对面，在擦他的火焰喷射器。\n“又见面了，”他说。",
            "A las-bolt punches through your thigh. You fall at the gate and the crowd tramples over you.\nYou wake shackled in a prison wagon. Kade sits opposite, polishing his flamer.\n“We meet again,” he says."),
    effects: {hp: -20},
    choices: [
      C("一言不发", "Say nothing", "cha_308"),
      C("朝他吐口水", "Spit at him", "cha_308", {effects: {renown: 5, hp: -5}})
    ]};

  N.cha_308 = {chapter: 3, scene: "cathedral", speaker: STRAND, time: {h: 5},
    text: L("囚车停在一座白塔下。一个穿灰大衣的女人等着你，白手套，袖口一尘不染。\n“斯特兰德审判官。”凯德的声音里第一次有了害怕。\n“我只问一个问题，”她说，“谁教你们唱那首歌的？”",
            "The wagon stops beneath a white tower. A woman in a grey greatcoat waits: white gloves, spotless cuffs.\n“Inquisitor Strand,” Kade murmurs. For the first time, he sounds afraid.\n“One question,” she says. “Who taught you that song?”"),
    codex: ["imp_inquisition"],
    choices: [
      C("说出维勒姆的名字", "Give up Vellum's name", "cha_309", {effects: {sanity: -10, renown: -5, set: {namedVellum: true}}}),
      C("咬紧牙关", "Clench your jaw", null, R(0.5, "hp", "cha_309", "cha_end_pyre"))
    ]};

  N.cha_end_pyre = {chapter: 3, scene: "burning_city", speaker: STRAND, time: {d: 1},
    text: L("斯特兰德摘下一只手套，又仔细地戴回去。\n第二天，广场上立起了一根木桩。人们被要求观看。\n审判官全程没有看火，她在看人群里谁移开了眼睛。",
            "Strand removes one glove, then carefully puts it back on.\nThe next day a stake rises in the square. Attendance is mandatory.\nThe Inquisitor never watches the fire. She watches the crowd, noting who looks away."),
    ending: {kind: "bad", title: L("广场上的木桩", "The Stake in the Square"), cause: L("被审判庭处以火刑", "Burned by the Inquisition")}};

  N.cha_309 = {chapter: 3, scene: "burning_city", speaker: null, time: {h: 12},
    text: L("那天夜里，白塔着火了。不知是诗班来救人，还是审判官故意放你走。\n囚门开着。你一瘸一拐地走出去，没人拦你。\n你总觉得背后有一双白手套在记笔记。",
            "That night the white tower burns. Maybe the Choir came for you. Maybe the Inquisitor let you go on purpose.\nThe cell door is open. You limp out. Nobody stops you.\nYou can't shake the feeling of a white glove taking notes behind you."),
    effects: {set: {strandWatching: true}},
    choices: [
      C("回到诗班", "Return to the Choir", "cha_307")
    ]};

  N.cha_307 = {chapter: 3, scene: "burning_city", speaker: VELLUM, time: {h: 6},
    text: L("天亮了。起义成了一半：中巢是你们的，上巢的闸门仍然紧闭。\n街上满是灰烬和唱哑了的人。维勒姆站在大教堂台阶上望着天，像在等谁回信。",
            "Dawn. Half the uprising has worked: the mid-hive is yours, but the spire gates stay shut.\nThe streets are full of ash and people who have sung their voices raw. Vellum stands on the cathedral steps, watching the sky as if awaiting a reply."),
    choices: [
      C("问他在等谁", "Ask who he's waiting for", "cha_310", {effects: {corruption: 3}}),
      C("找个地方睡一觉", "Find somewhere to sleep", "cha_310", {effects: {hp: 10, sanity: 5}})
    ]};

  N.cha_310 = {chapter: 3, scene: "burning_city", speaker: null, foe: "astartes", time: {d: 6},
    text: L("第六天，天上落下几颗燃烧的“流星”。裂开的舱门里走出几个蓝甲巨人。\n他们不喊话，不问谁信什么。他们只是向前走，所过之处没有一个站着的人。\n诗班的歌声，第一次停了。",
            "On day six, burning “meteors” fall from the sky. From the cracked pods step giants in blue armour.\nThey don't shout. They don't ask who believes what. They simply walk forward, and nothing stays standing in their wake.\nFor the first time, the Choir falls silent."),
    effects: {hp: -10, sanity: -10},
    codex: ["imp_astartes"],
    choices: [
      C("逃回污池最深处", "Flee to the deepest Sump", "cha_311"),
      C("留下来掩护撤退", "Stay and cover the retreat", "cha_311", {effects: {renown: 10, hp: -20}})
    ]};

  N.cha_311 = {chapter: 3, scene: "underhive", speaker: VELLUM, time: {h: 10},
    text: L("你背着维勒姆往下爬。他很轻，轻得像一捆干柴，一路都在哼诗班的歌。\n身后的管道一根接一根被烧红。\n“别怕，”他在你耳边说，“诸神最喜欢的，就是这种时候。”",
            "You carry Vellum down on your back. He's light as a bundle of kindling, humming the Choir's hymn the whole way.\nBehind you, pipe after pipe glows red with flame.\n“Don't be afraid,” he whispers in your ear. “The gods love moments like this best.”"),
    effects: {hp: -5},
    choices: [
      C("继续往下爬", "Keep climbing down", "cha_401"),
      C("把他放下，自己逃", "Set him down and save yourself", "cha_401", {effects: {hp: 10, sanity: -10, renown: -5}})
    ]};

  /* ============ Chapter 4 · The Four ============ */
  N.cha_401 = {chapter: 4, scene: "underhive", speaker: VELLUM, time: {d: 3},
    text: L("污池最深处。维勒姆半边身子烧焦了，还在笑。\n“诸神都在看你，”他喘着气，“门后那四个声音，现在都在争你。选一个吧，孩子。或者……全都要。”\n他闭上了眼睛。",
            "The deepest Sump. Half of Vellum is burned, and he is still smiling.\n“The gods are all watching you,” he wheezes. “Those four voices behind the door are fighting over you now. Choose one, child. Or... take them all.”\nHe closes his eyes."),
    effects: {sanity: -5, set: {vellumDead: true}},
    codex: ["god_khorne", "god_nurgle", "god_tzeentch", "god_slaanesh"],
    choices: [
      C("顺着血腥味走", "Follow the smell of blood", "cha_402"),
      C("顺着蒂卡的笑声走", "Follow Tikka's laughter", "cha_403"),
      C("顺着闪烁的蓝光走", "Follow the flickering blue light", "cha_404"),
      C("顺着香水味走", "Follow the scent of perfume", "cha_405")
    ]};

  N.cha_402 = {chapter: 4, scene: "underhive", speaker: S("daemon_khorne", "红色的东西", "The Red Thing"), time: {h: 2},
    text: L("大教堂里那个红色的东西蹲在一堆头盔上，在等你。\n“你，”它的声音像铁砧，“不跑。我喜欢不跑的。”\n它把烧红的剑插在你面前：“拿起来。为他杀。别问为什么。”",
            "The red thing from the cathedral squats atop a heap of helmets, waiting.\n“You,” it says, voice like an anvil. “Don't run. I like ones who don't run.”\nIt drives the glowing blade into the ground before you. “Pick it up. Kill for Him. Never ask why.”"),
    codex: ["god_khorne", "chaos_daemon_khorne"],
    choices: [
      C("握住剑柄", "Grip the hilt", "cha_406", {effects: {hp: 10, corruption: 10, renown: 10, set: {pK: true, patron: true}}}),
      C("转身离开", "Turn and walk away", "cha_406", {effects: {sanity: -5}})
    ]};

  N.cha_403 = {chapter: 4, scene: "underhive", speaker: TIKKA, foe: "daemon_nurgle", time: {h: 2},
    text: L("蒂卡坐在一个温暖的泥塘边，身边围着一群哼歌的胖乎乎的小东西。她已经很胖了，笑得很满足。\n“老爷爷说，疼也是礼物，”她递来一个嗡嗡响的苹果，“吃了就再也不怕疼了。”",
            "Tikka sits by a warm, bubbling pool among chubby little things humming songs. She's grown very round, and smiles, content.\n“Grandfather says pain is a gift too,” she says, offering you an apple buzzing with flies. “Eat it, and you'll never fear hurting again.”"),
    codex: ["god_nurgle", "chaos_daemon_nurgle"],
    choices: [
      C("咬一口苹果", "Take a bite", "cha_406", {effects: {hp: 25, sanity: 10, corruption: 10, renown: 10, set: {pN: true, patron: true}}}),
      C("抱抱蒂卡，然后离开", "Hug Tikka, then leave", "cha_406", {effects: {sanity: -10, set: {leftTikka: true}}})
    ]};

  N.cha_404 = {chapter: 4, scene: "underhive", speaker: IXARIL, foe: "daemon_tzeentch", time: {h: 2},
    text: L("一个披羽毛斗篷的人在等你，他的影子比他本人多三条胳膊。\n“伊克萨里尔，侍奉改变之主。”他说，“你接下来要说的每句话我都知道，但还是请说吧。我喜欢验证。”",
            "A man in a feathered cloak waits for you. His shadow has three more arms than he does.\n“Ixaril. I serve the Changer of Ways,” he says. “I know every word you're about to say. Please, say it anyway. I enjoy confirmation.”"),
    codex: ["god_tzeentch", "chaos_daemon_tzeentch", "chaos_sorcerer"],
    choices: [
      C("教我看见未来", "Teach me to see the future", "cha_406", {effects: {sanity: -15, corruption: 7, renown: 10, set: {pT: true, patron: true}}}),
      C("那你猜我会怎么选？", "Then guess what I'll choose", "cha_406", {effects: {sanity: -5, set: {mockedIxaril: true}}})
    ]};

  N.cha_405 = {chapter: 4, scene: "cult_shrine", speaker: S("daemon_slaanesh", "镜中的你", "You, from the Mirror"), time: {h: 2},
    text: L("香味来自一间铺满丝绸的地窖。镜子里的那个你走了出来，比你更美，更从容。\n“你在下巢活了这么多年，从没被人好好看过一眼，”它轻声说，“让我看着你。永远。”",
            "The scent leads to a cellar draped in silk. The you from the mirror steps out, more beautiful and more at ease than you have ever been.\n“All those years below and no one ever truly looked at you,” it murmurs. “Let me look at you. Forever.”"),
    codex: ["god_slaanesh", "chaos_daemon_slaanesh"],
    choices: [
      C("让它看着你", "Let it look at you", "cha_406", {effects: {sanity: 10, corruption: 10, renown: 10, set: {pS: true, patron: true}}}),
      C("用布盖上镜子", "Drape a cloth over the mirror", "cha_406", {effects: {sanity: -10}})
    ]};

  N.cha_406 = {chapter: 4, scene: "underhive", speaker: KADE, foe: "astartes", time: {d: 4}, eventRoll: 0.3,
    text: L("第四天，执法官和蓝甲巨人开始逐层清剿污池。火焰喷射器的嘶嘶声越来越近。\n凯德的声音在管道里回荡：“我记得你的脸！”",
            "Day four. Enforcers and the blue giants begin purging the Sump level by level. The hiss of flamers draws closer.\nKade's voice echoes through the pipes: “I remember your face!”"),
    effects: {hp: -10},
    choices: [
      C("迎上去", "Go to meet him", null, R(0.35, "renown", "cha_407", "cha_410")),
      C("沉进废水里躲着", "Sink into the waste-water and hide", "cha_408"),
      C("吹一声长哨", "Give one long whistle", "cha_409", {require: {flag: "whistleJoined"}, hideIfLocked: true}),
      C("吹一声长哨", "Give one long whistle", "cha_409", {require: [{flag: "whistleOwes"}, {notFlag: "whistleJoined"}], hideIfLocked: true})
    ]};

  N.cha_407 = {chapter: 4, scene: "underhive", speaker: KADE, time: {h: 1},
    text: L("凯德刚举起火焰喷射器，你已经到了他面前。\n很快就结束了。他靠着管道坐下，摘下头盔，那张脸比你想象的年轻。\n“上巢……不会记得我，”他说，“也不会记得你。”",
            "Kade raises the flamer, and you're already on him.\nIt's quick. He slumps against a pipe and pulls off his helmet. His face is younger than you imagined.\n“The spire... won't remember me,” he says. “Or you.”"),
    effects: {renown: 10, corruption: 4, set: {kadeDead: true}},
    choices: [
      C("拿走他的头盔", "Take his helmet", "cha_411", {effects: {renown: 5, corruption: 4}}),
      C("替他合上眼睛", "Close his eyes", "cha_411", {effects: {sanity: 5}})
    ]};

  N.cha_410 = {chapter: 4, scene: "underhive", speaker: KADE, time: {h: 6},
    text: L("火舌舔过你的肩膀。你滚进废水，憋住气，听着凯德的靴子在头顶停了很久。\n“我知道你在下面，”他说，“我会等。”\n等他走了，你发现半边脸再也感觉不到疼。",
            "Fire licks across your shoulder. You roll into the waste-water and hold your breath, listening to Kade's boots linger overhead.\n“I know you're down there,” he says. “I'll wait.”\nWhen he finally leaves, half your face can no longer feel pain."),
    effects: {hp: -25, corruption: 4},
    choices: [
      C("爬出去", "Crawl out", "cha_411")
    ]};

  N.cha_408 = {chapter: 4, scene: "underhive", speaker: null, time: {d: 1},
    text: L("你沉进废水，用一根管子呼吸。头顶的火光亮了又暗，暗了又亮。\n一天一夜。浮上来时，你的皮肤发绿，指缝间长出了蹼。\n你还活着。这在污池就叫好运。",
            "You sink into the waste-water and breathe through a pipe. Above, firelight flares and fades, flares and fades.\nA day and a night. When you surface, your skin is tinged green and webbing has grown between your fingers.\nYou're alive. In the Sump, that's called luck."),
    effects: {corruption: 7, hp: -5},
    choices: [
      C("甩甩手上的水", "Shake the water off your hands", "cha_411")
    ]};

  N.cha_409 = {chapter: 4, scene: "underhive", speaker: WHISTLE, time: {h: 3},
    text: L("哨子从水里冒出头，回了你一声短哨：跟我来。\n他带你钻进只有变种人知道的水道。到了出口，他停下：“我不走了。这是我的家。”\n他把你推出去，转身游向了火光。",
            "Whistle surfaces and answers with one short note: follow me.\nHe leads you through channels only mutants know. At the exit he stops. “I'm staying. This is my home.”\nHe pushes you out, then turns and swims back toward the fire."),
    effects: {sanity: -5, hp: 10, set: {whistleGone: true}},
    choices: [
      C("别回头", "Don't look back", "cha_411")
    ]};

  N.cha_411 = {chapter: 4, scene: "underhive", speaker: TIKKA, time: {d: 12},
    text: L("清剿结束了。诗班只剩下四十几个人，挤在污池最底下，等着有人告诉他们该做什么。\n他们都看着你。\n蒂卡把维勒姆的灰袍披在你肩上：“现在你是神父了。”",
            "The purge ends. Forty-odd Choir members remain, huddled at the bottom of the Sump, waiting for someone to tell them what to do.\nThey are all looking at you.\nTikka drapes Vellum's grey robe over your shoulders. “You're Father now.”"),
    effects: {renown: 10, sanity: 5},
    choices: [
      C("带他们唱歌", "Lead them in song", "cha_501", {effects: {corruption: 4, renown: 5}}),
      C("先分面包", "Share out the bread first", "cha_501", {effects: {hp: 10, sanity: 5}})
    ]};

  /* ============ Chapter 5 · The Warmaster's Call ============ */
  N.cha_501 = {chapter: 5, scene: "burning_city", speaker: S("omen_black_crusade", "黑色舰队", "The Black Fleet"), time: {d: 40},
    text: L("四十天后，天裂开了。\n不是比喻。一道紫色的伤口横过天际，落下来的战舰是黑色的，船身画着一只睁开的眼。\n所有屏幕同时亮起：“卡尔卡罗斯的子民，你们的神听见了。”",
            "Forty days later, the sky splits open.\nNot a metaphor. A violet wound crosses the heavens, and the ships falling through it are black, an open eye painted on each hull.\nEvery screen lights up at once. “People of Carcharos, your gods have heard you.”"),
    effects: {sanity: 5},
    codex: ["chaos_black_legion"],
    choices: [
      C("跪下欢呼", "Kneel and cheer", "cha_502", {effects: {corruption: 4, renown: 5}}),
      C("先找地方躲起来", "Find cover first", "cha_502", {effects: {hp: 5}})
    ]};

  N.cha_502 = {chapter: 5, scene: "ruins", speaker: VORGATH, time: {h: 3},
    text: L("黑甲巨人落在废墟中央。他的盔甲很旧，伤痕比你的岁数还多。\n“沃加斯，黑色军团。”他扫视着跪着的人群，“战帅阿巴顿需要血肉、弹药和不怕死的人。你们是哪一种？”",
            "A black-armoured giant lands among the ruins. His armour is ancient, its scars outnumbering your years.\n“Vorgath. Black Legion.” He surveys the kneeling crowd. “Warmaster Abaddon needs flesh, ammunition, and people who don't fear death. Which are you?”"),
    codex: ["chaos_abaddon", "chaos_heretic_astartes"],
    choices: [
      C("我不怕死", "I don't fear death", "cha_503", {effects: {renown: 5}}),
      C("我只是饿", "I'm just hungry", "cha_503", {effects: {sanity: 5, set: {honestHunger: true}}})
    ]};

  N.cha_503 = {chapter: 5, scene: "ruins", speaker: VORGATH, time: {h: 1},
    text: L("沃加斯盯着你，忽然笑了，像碎石滚下山坡。\n“我曾经是他们那边的。”他敲敲胸甲上一块被刮掉的旧徽记，“一万年前，我们替帝皇征服了半个银河。后来才发现，他不配。”\n他扔给你一把沉重的手枪。",
            "Vorgath studies you, then laughs, like gravel tumbling downhill.\n“I was one of theirs once.” He taps a scraped-off emblem on his breastplate. “Ten thousand years ago we conquered half the galaxy for the Emperor. Then we learned he wasn't worth it.”\nHe tosses you a heavy pistol."),
    effects: {renown: 5},
    codex: ["chaos_horus_heresy"],
    choices: [
      C("问他战帅是什么样的人", "Ask what the Warmaster is like", "cha_504"),
      C("检查手枪", "Check the pistol", "cha_505", {effects: {set: {pistol: true}}})
    ]};

  N.cha_504 = {chapter: 5, scene: "ruins", speaker: VORGATH, time: {h: 1},
    text: L("“阿巴顿？他失败过十二次，”沃加斯说，“每一次，帝国都以为自己赢了。”\n他抬头看那道紫色的伤口：“第十三次，他把天撕开了。”\n他说起战帅，不像崇拜，更像在说一场还没下完的雨。",
            "“Abaddon? He's failed twelve times,” Vorgath says. “Each time, the Imperium thought it had won.”\nHe looks up at the violet wound. “The thirteenth time, he tore the sky open.”\nIt isn't worship in his voice. More like talk of a rain that hasn't finished falling."),
    codex: ["chaos_black_crusade", "imp_great_rift", "place_cadia"],
    choices: [
      C("望着那道裂口", "Gaze at the rift", "cha_505", {effects: {corruption: 3}})
    ]};

  N.cha_505 = {chapter: 5, scene: "ship_interior", speaker: S("guardsman", "独眼奴隶", "One-Eyed Thrall"), time: {d: 5},
    text: L("你和几百个幸存者被塞进黑色战舰的底舱。有人祈祷，有人咬人，有人一直在笑。\n一个独眼的老奴隶给你挪了块地方：“第一次跃迁？抓紧点东西。还有，别跟自己的影子说话。”",
            "You and hundreds of survivors are crammed into the black warship's lower decks. Some pray. Some bite. One keeps laughing.\nA one-eyed old thrall makes room for you. “First jump? Hold on to something. And don't talk to your own shadow.”"),
    codex: ["place_black_warship"],
    choices: [
      C("抓紧舱壁", "Grip the bulkhead", "cha_508", {effects: {sanity: 5}}),
      C("看看自己的影子", "Look at your shadow", "cha_508", {effects: {corruption: 4, sanity: -5}})
    ]};

  N.cha_506 = {chapter: 5, scene: "warp", speaker: null, time: {d: 60, warp: true}, eventRoll: 0.4,
    text: L("跃迁开始了。舷窗没封，黑色军团不怕看。\n外面是颜色，是尖叫，是一座用眼睛砌成的城。你的影子站了起来，比你高一头，朝你鞠了一躬。\n你手腕上的日历在倒着走。",
            "The jump begins. The viewports stay open; the Black Legion isn't afraid to look.\nOutside is colour, is screaming, is a city built of eyes. Your shadow stands up, a head taller than you, and bows.\nThe calendar on your wrist runs backward."),
    effects: {sanity: -10},
    codex: ["chaos_warp"],
    choices: [
      C("向影子回礼", "Bow back to your shadow", "cha_507", {effects: {corruption: 7, renown: 5}}),
      C("闭上眼数心跳", "Shut your eyes and count heartbeats", "cha_507", {effects: {sanity: 5, corruption: -5}})
    ]};

  N.cha_507 = {chapter: 5, scene: "daemon_world", speaker: VORGATH, time: {d: 1, warp: true},
    text: L("这里没有太阳。天上挂着一只巨大的紫色眼睛，一直在看。\n地面是活的，会呼吸。沃加斯走下舷梯，深吸一口气，像终于回了家。\n“欢迎来到恐惧之眼，”他说，“在这里，你想要什么，就会变成什么。”",
            "There is no sun here. A vast violet eye hangs in the sky, always watching.\nThe ground is alive; it breathes. Vorgath walks down the ramp and inhales deeply, like a man home at last.\n“Welcome to the Eye of Terror,” he says. “Here, whatever you want is what you become.”"),
    codex: ["chaos_eye_of_terror", "place_daemon_world"],
    choices: [
      C("踏上会呼吸的土地", "Step onto the breathing ground", "cha_509")
    ]};

  N.cha_508 = {chapter: 5, scene: "ship_interior", speaker: VORGATH, time: {d: 3},
    text: L("底舱每天只送一桶食物。奴隶们为它打架，打赢的人吃饱，打输的人第二天就不见了。\n沃加斯靠着舱门看热闹，像看斗鸡。“这就是混沌，”他说，“没有配额，没有名单。只有想要，和拿到。”",
            "The lower decks get one bucket of food a day. The slaves fight for it. Winners eat. Losers are gone the next morning.\nVorgath leans in the hatchway, watching like it's a cockfight. “This is Chaos,” he says. “No quotas, no lists. Only wanting, and taking.”"),
    choices: [
      C("去抢那桶食物", "Fight for the bucket", null, R(0.5, "hp", "cha_506", "cha_506")),
      C("把你的那份分给独眼老人", "Give your share to the one-eyed old man", "cha_506", {effects: {hp: -10, sanity: 10, renown: -5}}),
      C("夜里偷别人的", "Steal someone's at night", "cha_506", {effects: {hp: 10, corruption: 4}})
    ]};

  N.cha_509 = {chapter: 5, scene: "daemon_world", speaker: S("daemon_tzeentch", "集市商人", "Market Trader"), time: {d: 2, warp: true},
    text: L("恐惧之眼的集市上，什么都能卖：盔甲、名字、昨天、明天。\n一个长着鸟嘴的商人拦住你：“好盔甲，只换你母亲的脸。你反正也快记不清了，对吧？”",
            "In the markets of the Eye, everything is for sale: armour, names, yesterdays, tomorrows.\nA beaked trader blocks your path. “Fine armour. Costs only your mother's face. You barely remember it anyway, don't you?”"),
    codex: ["place_bazaar_eye"],
    choices: [
      C("成交", "Deal", "cha_601", {effects: {hp: 20, sanity: -15, corruption: 4}}),
      C("用一年寿命换", "Pay with a year of your life", "cha_601", {effects: {hp: 10, renown: 5}}),
      C("走开", "Walk away", "cha_601", {effects: {sanity: 5}})
    ]};

  /* ============ Chapter 6 · The Eye ============ */
  N.cha_601 = {chapter: 6, scene: "daemon_world", speaker: VORGATH, time: {y: 3, warp: true}, eventRoll: 0.35,
    text: L("在恐惧之眼里，时间是一种口味。你觉得过了三年，镜子说三十年，你的头发说三天。\n沃加斯说战团要选新的勇士：“去吧。每位神都有一扇试炼之门。找那个愿意听你说话的。”",
            "In the Eye, time is a flavour. You feel three years have passed; the mirror says thirty; your hair says three days.\nVorgath says the warband needs a new champion. “Go. Each god keeps a door of trial. Find the one who listens to you.”"),
    effects: {sanity: 10, hp: 15},
    codex: ["place_trial_grounds"],
    choices: [
      C("红铜之门", "The brass door", "cha_602"),
      C("腐木之门", "The rotten door", "cha_604"),
      C("水晶之门", "The crystal door", "cha_606"),
      C("丝绸之门", "The silken door", "cha_608")
    ]};

  N.cha_602 = {chapter: 6, scene: "daemon_world", speaker: S("sigil_khorne", "天上的声音", "Voice from Above"), foe: "daemon_khorne", time: {h: 1},
    text: L("铜门后是一座斗技场，看台上坐满没有头的观众，欢呼声却震耳欲聋。\n你的对手是另一个奴隶，一个跟你差不多大的男孩，手在抖。\n一个声音从天上砸下来：“血就是血。他不在乎是谁的。”",
            "Behind the brass door is an arena. The stands are packed with headless spectators, yet the cheering is deafening.\nYour opponent is another slave, a boy about your age. His hands are shaking.\nA voice crashes down: “Blood is blood. He does not care whose.”"),
    effects: {hp: -5},
    choices: [
      C("战斗", "Fight", "cha_603", {effects: {hp: -15, renown: 10, corruption: 7, sanity: -5}}),
      C("把剑扔给男孩，赤手上", "Toss the boy your sword, fight barehanded", "cha_603", {require: {flag: "pK"}, effects: {hp: -20, renown: 15, corruption: 4}}),
      C("拒绝战斗", "Refuse to fight", "cha_610", {effects: {renown: -10, sanity: 5, hp: -10}})
    ]};

  N.cha_603 = {chapter: 6, scene: "daemon_world", speaker: null, foe: "daemon_khorne", time: {h: 1},
    text: L("结束时，看台上那些没有头的观众同时站了起来。\n你手腕上的烙印烧成了红铜色。一个声音在你的心跳里低吼：再来。再来。再来。\n你发现自己在笑，停不下来。",
            "When it's over, every headless spectator rises at once.\nThe brand on your wrist burns brass-red. A growl speaks inside your heartbeat: again. Again. Again.\nYou realise you're laughing, and can't stop."),
    effects: {sanity: -10, set: {markK: true, champion: true}},
    codex: ["chaos_daemon_prince"],
    choices: [
      C("走出斗技场", "Leave the arena", "cha_610")
    ]};

  N.cha_604 = {chapter: 6, scene: "daemon_world", speaker: S("daemon_nurgle", "园丁", "The Gardener"), time: {h: 1},
    text: L("腐木门后是一座花园，花在溃烂，苍蝇唱着摇篮曲。园丁是个大肚子恶魔，正在给一颗肿瘤浇水。\n“试炼很简单，”它和蔼地说，“染上园子里所有的病，然后告诉我，你感觉好极了。”",
            "Behind the rotten door lies a garden of weeping blossoms where flies hum lullabies. The gardener, a pot-bellied daemon, is watering a tumour.\n“The trial is simple,” it says kindly. “Catch every illness in the garden. Then tell me you feel wonderful.”"),
    choices: [
      C("深吸一口气", "Take a deep breath", "cha_605", {effects: {hp: -20, corruption: 7, renown: 10}}),
      C("我有老爷爷的祝福", "Grandfather already blessed me", "cha_605", {require: {flag: "pN"}, effects: {hp: 10, renown: 15, corruption: 4}}),
      C("退出花园", "Back out of the garden", "cha_610", {effects: {renown: -10, sanity: -5}})
    ]};

  N.cha_605 = {chapter: 6, scene: "daemon_world", speaker: S("daemon_nurgle", "园丁", "The Gardener"), time: {d: 7},
    text: L("你得了七种病，又好了七次。最后一次醒来，你感觉不到疼，也不觉得冷，只有一种温吞吞的满足。\n园丁拍拍你的头：“好孩子。老爷爷会照顾你的，永远。”\n你的烙印上长出了一圈小绿芽。",
            "You catch seven illnesses and recover seven times. The last time you wake, you feel no pain and no cold, only a warm, sluggish contentment.\nThe gardener pats your head. “Good child. Grandfather will look after you. Forever.”\nYour brand sprouts a ring of tiny green buds."),
    effects: {sanity: 10, set: {markN: true, champion: true}},
    codex: ["chaos_daemon_prince"],
    choices: [
      C("谢过园丁", "Thank the gardener", "cha_610")
    ]};

  N.cha_606 = {chapter: 6, scene: "daemon_world", speaker: IXARIL, foe: "daemon_tzeentch", time: {h: 1},
    text: L("水晶门后是一座无尽的图书馆。每本书写的都是你，每本的结局都不一样。\n伊克萨里尔坐在书堆上：“试炼是：挑一本，然后让它成真。”\n你注意到，有一本是空白的。",
            "Behind the crystal door is an endless library. Every book is about you, and every ending is different.\nIxaril sits atop a stack. “The trial: choose one, then make it true.”\nYou notice that one book is blank."),
    choices: [
      C("挑最辉煌的那本", "Pick the most glorious one", "cha_607", {effects: {sanity: -15, renown: 15, corruption: 7}}),
      C("拿起那本空白的", "Take the blank one", "cha_607", {effects: {sanity: -5, renown: 5, set: {blankBook: true}}}),
      C("看穿伊克萨里尔的布局", "See through Ixaril's scheme", "cha_607", {require: {flag: "pT"}, effects: {renown: 15, sanity: -10, set: {sawPlan: true}}})
    ]};

  N.cha_607 = {chapter: 6, scene: "daemon_world", speaker: IXARIL, time: {h: 9, warp: true},
    text: L("你读完最后一页，书上的字全飞了起来，钻进你的眼睛。\n从此你偶尔能看见一秒后的事。代价是，你偶尔会忘掉一秒前的事。\n伊克萨里尔鼓掌：“精彩。正是我预料中的意外。”",
            "You finish the last page and every letter lifts off and burrows into your eyes.\nNow and then you see one second ahead. The price: now and then you forget the second before.\nIxaril applauds. “Marvellous. Precisely the surprise I foresaw.”"),
    effects: {set: {markT: true, champion: true}},
    codex: ["chaos_daemon_prince"],
    choices: [
      C("合上书", "Close the book", "cha_610")
    ]};

  N.cha_608 = {chapter: 6, scene: "daemon_world", speaker: S("daemon_slaanesh", "完美的主人", "The Flawless Host"), time: {h: 1},
    text: L("丝绸门后是一场永不结束的宴会。每道菜都比上一道更美味，每首曲子都让你想再听一遍。\n面容完美的主人举杯：“试炼是：离开这里。”\n门很近。你又看了一眼桌上的下一道菜。",
            "Behind the silken door is a feast that never ends. Each dish tastes better than the last; each song makes you want to hear it again.\nA host with a flawless face raises a glass. “The trial: leave.”\nThe door is close. You glance at the next dish."),
    choices: [
      C("再吃一道就走", "One more dish, then go", null, R(0.4, "sanity", "cha_609", "cha_end_feast")),
      C("立刻起身离开", "Stand up and leave at once", "cha_609", {effects: {sanity: -10, renown: 10}}),
      C("我只想被看见", "I only want to be seen", "cha_609", {require: {flag: "pS"}, effects: {renown: 15, corruption: 7, sanity: 5}})
    ]};

  N.cha_end_feast = {chapter: 6, scene: "daemon_world", speaker: S("daemon_slaanesh", "完美的主人", "The Flawless Host"), time: {y: 1000},
    text: L("就一道。再一道。再一首。\n外面过去了一千年，宴会还在继续。你的盘子永远是满的，你的笑容永远是完美的。\n你再也想不起门在哪里。你也不想想起。",
            "Just one more dish. One more. One more song.\nOutside, a thousand years go by, and the feast goes on. Your plate is always full, your smile always perfect.\nYou can no longer remember where the door was. You don't want to."),
    ending: {kind: "bad", title: L("永恒的宴席", "The Endless Feast"), cause: L("永困色孽的宴席", "Trapped at Slaanesh's feast")}};

  N.cha_609 = {chapter: 6, scene: "daemon_world", speaker: null, time: {h: 2, warp: true},
    text: L("走出丝绸门时，你回头看了一眼。宴会上每个客人都长着你的脸，都在冲你举杯。\n你变得很美，美得连沃加斯都多看了一眼。\n但从此，什么味道都比不上那道你没吃的菜。",
            "Stepping out, you glance back. Every guest at the feast wears your face, and all of them raise a glass to you.\nYou've become beautiful, enough that even Vorgath looks twice.\nBut nothing will ever taste as good as the dish you left behind."),
    effects: {set: {markS: true, champion: true}},
    codex: ["chaos_daemon_prince"],
    choices: [
      C("不再回头", "Don't look back again", "cha_610")
    ]};

  N.cha_610 = {chapter: 6, scene: "daemon_world", speaker: VORGATH, time: {d: 2},
    text: L("沃加斯在门外等你，看了一眼你的手腕。\n“战帅要回现实宇宙了。目标是圣地世界阿尔德林，那里的大教堂供着一块圣人的骨头。”\n“我们要那块骨头？”\n“不。我们要他们看着它烧掉。”",
            "Vorgath waits outside, glancing at your wrist.\n“The Warmaster returns to realspace. Target: the shrine world Aldrin. Its cathedral keeps a saint's bone.”\n“We want the bone?”\n“No. We want them to watch it burn.”"),
    choices: [
      C("准备出发", "Make ready", "cha_611"),
      C("向诸神要更多的恩赐", "Ask the gods for more gifts", "cha_611", {effects: {corruption: 15, renown: 15, hp: 20}})
    ]};

  N.cha_611 = {chapter: 6, scene: "ship_interior", speaker: S("omen_black_crusade", "战帅的影像", "The Warmaster's Image"), time: {d: 5},
    text: L("出发前，新勇士们在旗舰的大厅里排队宣誓。大厅尽头只有一道剪影，高大，沉默，一只手是巨大的利爪。\n他没说话。他不需要说话。\n轮到你了。",
            "Before departure, the new champions queue to swear oaths in the flagship's great hall. At its end stands only a silhouette: tall, silent, one hand a monstrous talon.\nHe says nothing. He doesn't need to.\nIt's your turn."),
    codex: ["chaos_abaddon"],
    choices: [
      C("向战帅宣誓", "Swear to the Warmaster", "cha_612", {effects: {renown: 10, set: {swornAbaddon: true}}}),
      C("向你的神宣誓", "Swear to your god", "cha_612", {effects: {renown: 10, corruption: 7}}),
      C("嘴上宣誓，心里不算", "Swear with your lips, not your heart", "cha_612", {effects: {sanity: 5, set: {falseOath: true}}})
    ]};

  N.cha_612 = {chapter: 6, scene: "ship_interior", speaker: IXARIL, time: {d: 3, warp: true},
    text: L("伊克萨里尔递给你一把匕首，刀刃里关着什么东西，隔着金属在轻轻敲门。\n“一个小恶魔，”他说，“不太聪明，但很忠诚。你喂它，它就替你挡刀。”\n敲门声很有礼貌。",
            "Ixaril hands you a dagger. Something is shut inside the blade, tapping gently at the metal.\n“A minor daemon,” he says. “Not clever, but loyal. Feed it, and it will take blows meant for you.”\nThe tapping is very polite."),
    choices: [
      C("收下匕首", "Accept the dagger", "cha_701", {effects: {corruption: 10, hp: 20, set: {daemonBlade: true}}}),
      C("还给他", "Hand it back", "cha_701", {effects: {sanity: 5}})
    ]};

  /* ============ Chapter 7 · The Raid ============ */
  N.cha_701 = {chapter: 7, scene: "burning_city", speaker: null, time: {d: 30, warp: true}, eventRoll: 0.3,
    text: L("阿尔德林，一颗遍地教堂的星球，连路灯都雕成了圣人。\n黑色军团的登陆艇像雨一样落下。城墙上，星界军的探照灯乱成一团。\n你跟着沃加斯冲进城，满街钟声，越敲越乱。",
            "Aldrin, a world of cathedrals; even the streetlamps are carved like saints.\nBlack Legion landers fall like rain. On the walls, the Astra Militarum's searchlights swing in panic.\nYou charge into the city behind Vorgath. Bells ring in every street, faster and faster, out of time."),
    codex: ["imp_guard", "place_aldrin"],
    choices: [
      C("冲向大教堂", "Charge the cathedral", "cha_702"),
      C("去抢军火库", "Raid the armoury", "cha_703")
    ]};

  N.cha_702 = {chapter: 7, scene: "cathedral", speaker: S("preacher", "老牧师", "Old Priest"), time: {h: 2},
    text: L("大教堂台阶上站着一个老牧师，手里的链锯剑比他还吵。他身后是几百个拿农具的信徒，唱着你小时候听过的赞美诗。\n他们知道自己会死。没有一个人后退。",
            "On the cathedral steps stands an old priest with a chainsword louder than he is. Behind him, hundreds of faithful with farm tools sing a hymn you knew as a child.\nThey know they'll die. Not one of them steps back."),
    effects: {sanity: -10},
    codex: ["imp_ecclesiarchy"],
    choices: [
      C("冲上台阶", "Storm the steps", "cha_704", {effects: {hp: -15, renown: 10, corruption: 4}}),
      C("跟着他们唱", "Sing along with them", "cha_705", {effects: {sanity: 10, corruption: -10, renown: -10, set: {sangHymn: true}}})
    ]};

  N.cha_703 = {chapter: 7, scene: "ruins", speaker: S("guardsman", "年轻的星界军", "Young Guardsman"), time: {h: 2},
    text: L("军火库前，一个年轻的星界军被压在塌掉的掩体下，枪掉在一边。\n他看着你，眼里没有恨，只有累。“动手吧。我妈说异端都长着角，”他说，“你没有。”",
            "Outside the armoury, a young Guardsman lies pinned beneath a collapsed barricade, his rifle out of reach.\nHe looks at you. No hatred, only exhaustion. “Go on. Mum said heretics have horns,” he says. “You don't.”"),
    codex: ["imp_lasgun"],
    choices: [
      C("动手", "Do it", "cha_704", {effects: {corruption: 7, renown: 10, sanity: -10}}),
      C("把他从掩体下拖出来", "Drag him out from under the barricade", "cha_705", {effects: {sanity: 5, renown: -5, set: {sparedGuard: true}}}),
      C("拿走他的枪，走开", "Take his rifle and walk away", "cha_704", {effects: {renown: 3}})
    ]};

  N.cha_704 = {chapter: 7, scene: "burning_city", speaker: VORGATH, foe: "astartes", time: {h: 3},
    text: L("城市另一头亮起金色的火光，一支白金色盔甲的星际战士降落了。\n沃加斯舔了舔嘴唇：“老朋友。”他转向你，“拖住他们。活下来，你就是勇士。没活下来，你就是祭品。一样有用。”",
            "Golden fire blooms across the city: Space Marines in white and gold are landing.\nVorgath licks his lips. “Old friends.” He turns to you. “Hold them. Survive, you're a champion. Don't, you're an offering. Equally useful.”"),
    effects: {hp: -10},
    codex: ["imp_astartes"],
    choices: [
      C("拖住他们", "Hold them", null, R(0.35, "renown", "cha_706", "cha_707")),
      C("用一秒后的眼睛找破绽", "Use your one-second sight to find an opening", "cha_706", {require: {flag: "markT"}, effects: {sanity: -5}}),
      C("趁乱溜进小巷", "Slip into an alley in the chaos", "cha_705")
    ]};

  N.cha_705 = {chapter: 7, scene: "ruins", speaker: STRAND, time: {h: 1},
    text: L("一条安静的小巷。白手套，灰大衣。斯特兰德审判官，没带卫兵。\n“我看见你犹豫了，”她说，“你还没完全属于他们。说出沃加斯的登陆艇在哪，我给你一个干净的死法。”\n她说“干净”时是真诚的。",
            "A quiet alley. White gloves, grey greatcoat. Inquisitor Strand, alone.\n“I saw you hesitate,” she says. “So you're not entirely theirs. Tell me where Vorgath's landers are and I'll grant you a clean death.”\nWhen she says “clean,” she means it."),
    codex: ["imp_inquisition", "imp_ordo_malleus"],
    choices: [
      C("告诉她", "Tell her", "cha_708", {effects: {sanity: 5, corruption: -5, renown: -10, set: {toldStrand: true}}}),
      C("拔枪", "Draw your pistol", null, R(0.35, "hp", "cha_708", "cha_707")),
      C("转身就跑", "Turn and run", "cha_707", {effects: {hp: -5}})
    ]};

  N.cha_706 = {chapter: 7, scene: "burning_city", speaker: VORGATH, foe: "astartes", time: {h: 2},
    text: L("你不记得是怎么做到的。只记得一个白金色的巨人倒在你脚边，头盔滚出去很远。\n沃加斯走过来，把一块砸烂的星际战士肩甲挂在你背上。\n“勇士，”他说。这是他第一次不叫你“你”。",
            "You don't remember how. Only that a white-and-gold giant lies at your feet, its helm rolled far away.\nVorgath hangs a battered Space Marine pauldron on your back.\n“Champion,” he says. It's the first time he's called you anything but “you.”"),
    effects: {renown: 15, hp: -10, set: {champion: true, slewMarine: true}},
    choices: [
      C("扛起肩甲", "Shoulder the pauldron", "cha_708")
    ]};

  N.cha_707 = {chapter: 7, scene: "ruins", speaker: TIKKA, foe: "daemon_nurgle", time: {h: 4},
    text: L("爆弹在你身边炸开。你倒在瓦砾里，听着登陆艇轰鸣着飞走，没人回来接你。\n一双胖乎乎的手把你拖进下水道。是蒂卡，她现在大得像头牛，浑身嗡嗡作响。\n“老爷爷从不丢下任何人，”她说。",
            "A bolt-round bursts beside you. Lying in the rubble, you hear the landers roar away. Nobody comes back.\nA pair of plump hands drags you into the sewers. Tikka. She's as big as an ox now, and she hums like a hive.\n“Grandfather never leaves anyone behind,” she says."),
    effects: {hp: -20, sanity: 5, corruption: 4},
    choices: [
      C("靠在她身上", "Lean against her", "cha_708", {effects: {hp: 10, corruption: 4}}),
      C("挣扎着自己走", "Struggle on by yourself", "cha_708", {effects: {hp: -5}})
    ]};

  N.cha_708 = {chapter: 7, scene: "ruins", speaker: IXARIL, time: {d: 3}, eventRoll: 0.3,
    text: L("三天后，城市烧成了白灰。圣人的骨头没了，钟声也没了。\n伊克萨里尔的笑容突然消失，他盯着天空：“有东西要来了。我看不见它的未来。”\n这是你第一次见他害怕。",
            "Three days later the city is white ash. The saint's bone is gone, and so are the bells.\nIxaril's smile vanishes. He stares at the sky. “Something is coming. I cannot see its future.”\nIt's the first time you've seen him afraid."),
    choices: [
      C("问他看见了什么", "Ask what he sees", "cha_709"),
      C("去找沃加斯", "Go find Vorgath", "cha_710")
    ]};

  N.cha_709 = {chapter: 7, scene: "throne_light", speaker: S("omen_emperor", "金色的王座", "The Golden Throne"), time: {h: 1, warp: true},
    text: L("伊克萨里尔抓住你的手腕。你看见了：一片金光，光的中心坐着一具干枯的尸体，眼睛睁着。\n它在看你。你从没被这样看过——不是愤怒，不是怜悯，是比恨更冷的东西。",
            "Ixaril seizes your wrist. You see it: a field of golden light, and at its heart a withered corpse upon a throne, eyes open.\nIt is looking at you. You've never been looked at like this. Not anger, not pity. Something colder than hate."),
    effects: {sanity: -15},
    codex: ["imp_emperor", "place_terra"],
    choices: [
      C("挣脱", "Tear yourself free", "cha_710")
    ]};

  N.cha_710 = {chapter: 7, scene: "ship_interior", speaker: VORGATH, time: {h: 6},
    text: L("沃加斯在擦他的斧子。“审判庭的舰队到了，战帅已经走了。我们断后。”\n他看了你一眼：“你现在溜走，找个下巢躲一辈子，没人会知道。”",
            "Vorgath is cleaning his axe. “The Inquisition's fleet has arrived. The Warmaster's already gone. We're the rearguard.”\nHe glances at you. “You could slip away now. Find some underhive and hide for the rest of your life. No one would know.”"),
    choices: [
      C("我留下", "I'm staying", "cha_711", {effects: {renown: 10}}),
      C("溜走", "Slip away", "cha_711", {effects: {renown: -10, set: {fled: true}}}),
      C("向诸神祈求更多力量", "Pray to the gods for more power", "cha_711", {effects: {corruption: 15, renown: 15, hp: 15}})
    ]};

  N.cha_711 = {chapter: 7, scene: "ruins", speaker: TIKKA, foe: "daemon_nurgle", time: {h: 2},
    text: L("蒂卡不跟船走了。她坐在阿尔德林的废墟里，周围的小东西们在哼歌。\n“这里的人病得好苦，”她说，“老爷爷让我留下来照顾他们。”\n她已经认不出你小时候的样子了，可她记得你爱吃哪种面包。",
            "Tikka isn't leaving with the ships. She sits among Aldrin's ruins while the little things around her hum.\n“The people here are so sick and sad,” she says. “Grandfather wants me to stay and look after them.”\nShe can't remember what you looked like as a child. She remembers which bread you liked."),
    effects: {sanity: -5},
    choices: [
      C("抱抱她", "Hug her", "cha_801", {effects: {sanity: 5, corruption: 3}}),
      C("劝她一起走", "Beg her to come", "cha_801", {effects: {sanity: -5}})
    ]};

  /* ============ Chapter 8 · Grey Light ============ */
  N.cha_801 = {chapter: 8, scene: "burning_city", speaker: S("omen_purge", "斯特兰德的声音", "Strand's Voice"), time: {h: 4},
    text: L("天上出现一圈银光，像一枚巨大的硬币。\n斯特兰德的声音覆盖了全星球的频道：“阿尔德林已不可挽回。灭绝令六小时后执行。在此之前，灰骑士将清除一切。”\n六个小时。",
            "A ring of silver light appears in the sky, like an enormous coin.\nStrand's voice overrides every channel on the planet. “Aldrin is beyond redemption. Exterminatus in six hours. Until then, the Grey Knights will cleanse everything.”\nSix hours."),
    effects: {sanity: -10},
    codex: ["imp_exterminatus", "imp_grey_knights", "imp_ordo_malleus", "imp_inquisition"],
    choices: [
      C("扔掉武器，混进难民", "Ditch your weapon and join the refugees", "cha_802", {require: {flag: "fled"}}),
      C("回到沃加斯身边", "Return to Vorgath's side", "cha_808"),
      C("独自躲进圣人墓穴", "Hide alone in the saint's crypt", "cha_806")
    ]};

  N.cha_802 = {chapter: 8, scene: "ruins", speaker: S("guardsman", "审判庭士兵", "Inquisition Trooper"), time: {h: 2},
    text: L("你用泥巴盖住手腕上的烙印，混进了逃难的人群。\n人们挤向最后一艘撤离船。一个审判庭士兵正用一盏小灯照每个人的眼睛。\n还有十个人，就轮到你了。",
            "You smear mud over the brand on your wrist and melt into the crowd of refugees.\nThey press toward the last evacuation ship. An Inquisition trooper shines a little lamp into each person's eyes.\nTen more people, then it's you."),
    choices: [
      C("低头，平静呼吸", "Head down. Breathe slowly.", null, R(0.45, "sanity", "cha_end_vanish", "cha_end_purged")),
      C("报出斯特兰德给你的暗号", "Speak the code Strand gave you", "cha_end_vanish", {require: {flag: "toldStrand"}, hideIfLocked: true}),
      C("用一秒后的眼睛找空隙", "Use your one-second sight to find a gap", "cha_end_vanish", {require: {flag: "markT"}, hideIfLocked: true})
    ]};

  N.cha_808 = {chapter: 8, scene: "ruins", speaker: IXARIL, time: {h: 3},
    text: L("还剩三个小时。断后的人守在大教堂的废墟里。\n伊克萨里尔在地上画圈，画了又擦。沃加斯在磨斧子。\n早已停了的钟，突然自己响了一声。",
            "Three hours left. The rearguard holds the cathedral ruins.\nIxaril draws circles on the ground, then rubs them out. Vorgath sharpens his axe.\nA bell that stopped long ago rings once, all by itself."),
    effects: {sanity: -5},
    choices: [
      C("握紧武器", "Grip your weapon", "cha_809", {effects: {renown: 3}}),
      C("在烙印上默念神的名字", "Whisper your god's name over the brand", "cha_809", {effects: {corruption: 4, hp: 10}})
    ]};

  N.cha_809 = {chapter: 8, scene: "ruins", speaker: STRAND, time: {h: 1},
    text: L("废墟的入口亮起银光。斯特兰德审判官走在光的前面，白手套上一尘不染。\n她展开一张名单，划掉一个名字，又一个。\n“你，”她看着你，“我记得。在卡尔卡罗斯，我放你走，是想看你会领我找到谁。”",
            "Silver light kindles at the ruins' entrance. Inquisitor Strand walks before it, white gloves spotless.\nShe unrolls a list and strikes out a name with her pen. Then another.\n“You,” she says, looking at you. “I remember. On Carcharos I let you go to see whom you'd lead me to.”"),
    effects: {sanity: -5},
    codex: ["imp_ordo_malleus"],
    choices: [
      C("“那你找到了。”", "“Well, you found us.”", "cha_803", {effects: {renown: 5}}),
      C("举起手里的武器", "Raise your weapon", "cha_803", {effects: {hp: -5, renown: 3}})
    ]};

  N.cha_803 = {chapter: 8, scene: "ruins", speaker: VORGATH, foe: "grey_knight", time: {h: 1},
    text: L("他们从光里走出来。银色的盔甲，没有任何装饰，每一步都像在宣读判决。\n伊克萨里尔扔出一团蓝火，火在半空中熄灭，像从没存在过。\n“灰骑士，”沃加斯低声说。他第一次没有笑。",
            "They step out of the light. Silver armour without ornament, each footfall like a verdict being read.\nIxaril hurls blue fire. It goes out in mid-air as if it had never existed.\n“Grey Knights,” Vorgath says quietly. For the first time, he isn't smiling."),
    effects: {sanity: -10, hp: -10},
    codex: ["imp_grey_knights"],
    choices: [
      C("与沃加斯并肩作战", "Fight beside Vorgath", null, R(0.5, "hp", "cha_805", "cha_end_purged")),
      C("献上一切，呼唤你的神", "Offer everything. Call your god.", "cha_807", {require: [{stat: "renown", min: 60}, {flag: "champion"}]}),
      C("退进圣人墓穴", "Fall back into the saint's crypt", "cha_806", {effects: {renown: -5}})
    ]};

  N.cha_805 = {chapter: 8, scene: "ruins", speaker: VORGATH, foe: "grey_knight", time: {h: 1},
    text: L("灰骑士的戟刺穿了沃加斯的胸甲。他跪下来，还在笑：“一万年……总算有个像样的对手。”\n他把斧子推进你手里：“登陆艇在东边。告诉战帅……算了。什么都别告诉他。”",
            "A Grey Knight's halberd punches through Vorgath's breastplate. He sinks to his knees, still laughing. “Ten thousand years... finally, a worthy opponent.”\nHe pushes his axe into your hands. “Lander's to the east. Tell the Warmaster... no. Tell him nothing.”"),
    effects: {sanity: -10},
    choices: [
      C("带着斧子冲向登陆艇", "Run for the lander with the axe", "cha_end_champion"),
      C("留下来陪他", "Stay with him", "cha_end_purged")
    ]};

  N.cha_806 = {chapter: 8, scene: "cathedral", speaker: S("omen_emperor", "无脸的帝皇像", "Faceless Emperor Statue"), time: {h: 2},
    text: L("墓穴里很黑，只有一尊帝皇的小雕像，脸已经磨平了。\n你靠着它坐下，手腕上的烙印突然冷了。\n墙那边，灰骑士的脚步一下，一下，不快也不慢。他们不需要快。",
            "The crypt is dark save for a small statue of the Emperor, its face worn smooth.\nYou sit against it, and the brand on your wrist goes suddenly cold.\nBeyond the wall the Grey Knights' footsteps fall. One. Another. Neither fast nor slow. They don't need to be fast."),
    effects: {sanity: -5},
    choices: [
      C("向雕像祈祷", "Pray to the statue", "cha_end_light"),
      C("挖开墓穴的后墙", "Dig through the back wall", null, R(0.4, "hp", "cha_end_vanish", "cha_end_purged")),
      C("砸碎雕像，呼唤你的神", "Smash the statue. Call your god.", "cha_807", {require: {stat: "renown", min: 60}})
    ]};

  N.cha_807 = {chapter: 8, scene: "warp", speaker: S("daemon_prince", "你", "You"), time: {h: 1, warp: true},
    text: L("你张开双臂。门后的四个声音同时停止了争吵。\n骨头在拉长，背上撕开了翅膀，你的影子终于站起来，和你合为一体。\n灰骑士的戟停在你面前一寸。你低头看着那名骑士。第一次，你比他高。",
            "You spread your arms. The four voices behind the door fall silent at once.\nYour bones lengthen. Wings tear open across your back. Your shadow finally stands and becomes one with you.\nA Grey Knight's halberd halts an inch away. You look down at the knight. For the first time, you are taller."),
    effects: {corruption: 15, renown: 20},
    codex: ["chaos_daemon_prince"],
    choices: [
      C("飞向恐惧之眼", "Fly for the Eye of Terror", "cha_end_prince")
    ]};

  N.cha_end_prince = {chapter: 8, scene: "daemon_world", speaker: S("daemon_prince", "恶魔王子", "Daemon Prince"), time: {y: 100, warp: true},
    text: L("恐惧之眼里多了一位新的恶魔王子。凡人的岁月从你身上滑过，像雨滑过铁甲。\n很多年后，某个巢都的垃圾瀑布下，一个缺门牙的孩子捡到一尊温热的小雕像。\n雕像的脸，是你的。",
            "The Eye of Terror has a new Daemon Prince. Mortal years slide off you like rain off armour.\nMany years later, beneath the garbage falls of some hive, a gap-toothed child finds a warm little statue.\nIts face is yours."),
    ending: {kind: "good", title: L("恶魔王子", "Daemon Prince"), cause: L("飞升为恶魔王子", "Ascended to daemonhood")}};

  N.cha_end_champion = {chapter: 8, scene: "void", speaker: S("omen_black_crusade", "黑色旗舰", "The Black Flagship"), time: {d: 9, warp: true},
    text: L("你驾着登陆艇冲出火海。身后，阿尔德林在灭绝令中变成一颗白色的星。\n旗舰的舰桥上，战帅阿巴顿看了你一眼——就一眼——然后继续看他的星图。\n够了。对一个下巢老鼠来说，够了。",
            "You fly the lander out through the flames. Behind you, Aldrin becomes a white star under Exterminatus.\nOn the flagship's bridge, Warmaster Abaddon glances at you—just once—then returns to his star charts.\nIt's enough. For a rat from the Sump, it's enough."),
    ending: {kind: "good", title: L("黑色军团的勇士", "Champion of the Black Legion"), cause: L("成为黑色军团勇士", "Champion of the Black Legion")}};

  N.cha_end_vanish = {chapter: 8, scene: "underhive", speaker: null, time: {y: 2},
    text: L("你到了另一颗巢都星球，在下巢水泵站过滤水，一滴一滴。\n手腕上的烙印偶尔还会发烫。每当那时，你就哼起诗班的歌，再故意唱错一个音。\n诸神找不到唱错的人。至少你希望如此。",
            "You end up on another hive world, filtering water in an underhive pump station, drop by drop.\nThe brand on your wrist still warms now and then. When it does, you hum the Choir's hymn and sing one note wrong on purpose.\nThe gods can't find someone singing off-key. Or so you hope."),
    ending: {kind: "good", title: L("唱错的音", "The Wrong Note"), cause: L("隐姓埋名，躲开诸神", "Hid from the gods")}};

  N.cha_end_purged = {chapter: 8, scene: "ruins", speaker: S("grey_knight", "灰骑士", "Grey Knight"), time: {h: 1},
    text: L("银光落下时没有声音。\n审判庭的档案里，你只有一行字：“阿尔德林，异端，已净化。”没有名字。\n六小时后，这行字所指的那颗星球，也不存在了。",
            "When the silver light falls, there is no sound.\nIn the Inquisition's records you are one line: “Aldrin. Heretic. Purged.” No name.\nSix hours later, the world that line refers to no longer exists either."),
    ending: {kind: "bad", title: L("已净化", "Purged"), cause: L("被灰骑士净化", "Purged by the Grey Knights")}};

  N.cha_end_light = {chapter: 8, scene: "throne_light", speaker: S("omen_emperor", "金光", "Golden Light"), time: {h: 1},
    text: L("你祈祷了。像小时候那样，笨拙地，不知道该说什么。\n光回应了你。不是宽恕，是火。\n斯特兰德后来在报告里写：“该异端死前在祈祷。备注：无关紧要。”",
            "You pray. Clumsily, like when you were small, not knowing what to say.\nThe light answers. Not with forgiveness. With fire.\nStrand later writes in her report: “Heretic was praying at time of death. Note: irrelevant.”"),
    ending: {kind: "bad", title: L("迟来的祷告", "A Prayer Too Late"), cause: L("死于帝皇之光", "Burned in the Emperor's light")}};

  /* ============ Death nodes (engine-triggered) ============ */
  N.cha_death_hp = {scene: "underhive", speaker: TIKKA,
    text: L("污池的规矩：人死了，东西归活人。\n有人拿走了你的靴子，有人拿走了你的撬棍。蒂卡拿走了你手腕上的烙印——她说，留着念想。\n四位神没有一个回头看。",
            "The Sump's rule: when someone dies, their things go to the living.\nSomeone takes your boots. Someone takes your crowbar. Tikka takes the brand from your wrist, as a keepsake, she says.\nNot one of the Four looks back."),
    ending: {kind: "death", title: L("污池的规矩", "The Sump's Rule"), cause: L("伤重身亡，遗物被分", "Died of wounds, belongings shared")}};

  N.cha_death_sanity = {scene: "warp", speaker: S("sigil_tzeentch", "所有的声音", "Every Voice"),
    text: L("门后的四个声音不再争吵了，因为它们都进来了。\n你同时在笑、在哭、在愤怒、在渴望。你的嘴说着四种语言，没有一种是你的。\n诸神很满意。只是没有“你”了。",
            "The four voices behind the door stop arguing, because now they're all inside.\nYou laugh, weep, rage and crave all at once. Your mouth speaks four languages, none of them yours.\nThe gods are pleased. There's just no “you” left."),
    ending: {kind: "death", title: L("四声合唱", "Chorus of Four"), cause: L("心智被四神占据", "Mind taken by the Four")}};

  N.cha_death_corruption = {scene: "daemon_world", speaker: S("mutant", "混沌卵", "Chaos Spawn"),
    text: L("诸神一次给了你太多恩赐：触手、眼睛、翅膀、嘴巴，一样不少。\n你的身体装不下。\n后来，沃加斯的战团多了一只会追着自己尾巴咬的怪物。偶尔它会停下来，像在努力回想一个名字。",
            "The gods gave you too many gifts at once: tentacles, eyes, wings, mouths, everything.\nYour body couldn't hold them.\nNow Vorgath's warband keeps a beast that chases its own tails. Sometimes it stops, as if trying to recall a name."),
    codex: ["chaos_spawn"],
    ending: {kind: "death", title: L("混沌卵", "Chaos Spawn"), cause: L("沦为混沌卵", "Became Chaos Spawn")}};

  WH.registerFaction({
    id: "chaos",
    name: L("混沌", "Chaos"),
    tagline: L("帝皇不看你，诸神会", "The Emperor never looked. The gods will."),
    role: L("下巢拾荒者", "Underhive scavenger"),
    playerSprite: "player_chaos",
    color: "#a3242b",
    startNode: "cha_101",
    startDate: {year: 111, mill: 42},
    startStats: {hp: 100, sanity: 100, corruption: 0, renown: 10},
    renownLabel: L("神恩", "Favor"),
    renownIcon: "icon_favor",
    deathNodes: {hp: "cha_death_hp", sanity: "cha_death_sanity", corruption: "cha_death_corruption"},
    learn: {
      leaders: ["god_khorne", "god_nurgle", "god_tzeentch", "god_slaanesh", "chaos_abaddon"],
      enemies: ["imp_inquisition", "imp_guard", "imp_astartes"],
      boss: ["imp_grey_knights", "imp_ordo_malleus", "imp_emperor"]
    },
    chapters: {
      1: L("污池", "The Sump"),
      2: L("诗班", "The Choir"),
      3: L("起义", "Uprising"),
      4: L("四神", "The Four"),
      5: L("战帅的召唤", "The Warmaster's Call"),
      6: L("恐惧之眼", "The Eye"),
      7: L("劫掠", "The Raid"),
      8: L("灰色的光", "Grey Light")
    },
    nodes: N
  });
})();
