/* data/factions/chaos.js — Chaos route (text role).
 * Player: underhive scavenger in Hive Vorne on Carcharos, drawn into the "Choir" cult. Start 111.M42.
 * Helpers: L(zh,en) localized string; S(sprite,zh,en) speaker; C(zh,en,next,extra) choice; R(p,stat,ok,ko[,rr]) roll;
 * RR(L(),L()) rollResult. Choice consequence beats (SPEC §11) go in extra.result / R(...,RR(...)).
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
  function R(p, stat, success, fail, rr, extra) {
    var o = {roll: {p: p, stat: stat, success: success, fail: fail}};
    if (rr) o.rollResult = rr;
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  function RR(ok, ko) { return {success: ok, fail: ko}; }   // per-outcome consequence beats (SPEC §11)

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
      C("把雕像揣进自己怀里", "Tuck the statue into your own coat", "cha_102a", {effects: {corruption: 4, sanity: -5, set: {idol: true}}, result: L("雕像贴着你的胸口，暖得像第二颗心。蒂卡瘪着嘴，没说话。", "The statue sits against your chest, warm as a second heart. Tikka pouts, but says nothing.")}),
      C("让她拿去换吃的", "Let her trade it for food", "cha_104", {effects: {hp: 10}, result: L("蒂卡换回两块灰面饼，分了你一半。雕像被收走前，你发誓它冲你眨了眨眼。", "Tikka trades it for two grey ration cakes and gives you half. As the statue changes hands, you'd swear it winked.")})
    ]};

  N.cha_102a = {chapter: 1, scene: "underhive", speaker: null, time: {h: 10},
    text: L("那一夜蒂卡背对着你睡，赌气不说话。\n雕像在你怀里一直是温的。快天亮时，它说了一句话，声音很小，像隔着很多扇门：“往左躲。”\n你不知道它指的是什么。",
            "That night Tikka sleeps with her back to you, sulking.\nThe statue stays warm against you. Near dawn it speaks, very softly, as if through many doors: “Hide to the left.”\nYou have no idea what it means."),
    choices: [
      C("把它塞得更深一点", "Tuck it deeper into your coat", "cha_104", {effects: {sanity: -3}, result: L("它贴着你的肋骨，像在听你的心跳。你一直没再睡着。", "It settles against your ribs as if listening to your heart. You don't sleep again.")})
    ]};

  N.cha_103 = {chapter: 1, scene: "underhive", speaker: WHISTLE, time: {h: 2},
    text: L("水泵站里住着一个变种人，脖子两侧长着鳃，说话带哨音。大家叫他“哨子”。\n他在过滤水，一滴一滴。“喝吧，”他说，“别告诉执法官你见过我。”",
            "A mutant lives in the pump station. Gills flutter on his neck; he whistles when he talks. Everyone calls him Whistle.\nHe's filtering water, drop by drop. “Drink,” he says. “Don't tell the enforcers you saw me.”"),
    codex: ["chaos_mutant"],
    choices: [
      C("道谢，陪他聊会儿", "Thank him and stay a while", "cha_104", {effects: {sanity: 5, hp: 5, set: {whistleFriend: true, metWhistle: true}}, result: L("水有铁锈味，却是你喝过最干净的。哨子吹了支小调，说是他妈妈教的。", "The water tastes of rust, and it's the cleanest you've ever had. Whistle whistles a little tune his mother taught him.")}),
      C("趁他转身偷走水桶", "Steal his bucket when he turns", "cha_103a", {effects: {hp: 15, corruption: 3, set: {robbedWhistle: true, metWhistle: true, wronged_whistle: true}}, result: L("你抱着哨子的水桶狂奔，喝到呛咳。身后，哨音拉得又尖又长，像在哭。", "You bolt with Whistle's bucket and drink till you choke. Behind you his note rises, thin and long, like crying.")})
    ]};

  N.cha_103a = {chapter: 1, scene: "underhive", speaker: TIKKA, time: {h: 3},
    text: L("你把水桶拖回窝棚。蒂卡盯着桶沿上哨子的记号看了很久。\n“这是哨子的桶，”她说，“他会渴死的。”\n可她还是喝了，喝得很急。你们谁也没再提这件事。",
            "You drag the bucket back to the shack. Tikka stares a long time at Whistle's mark on its rim.\n“That's Whistle's bucket,” she says. “He'll die of thirst.”\nShe drinks anyway, fast. Neither of you mentions it again."),
    choices: [
      C("把桶藏到床板底下", "Hide the bucket under the bed-board", "cha_104", {effects: {sanity: -3}, result: L("夜里你总听见很远的地方有人在吹哨，吹一声，停很久。", "All night you hear someone far off whistling: one note, then a long silence.")})
    ]};

  N.cha_104 = {chapter: 1, scene: "underhive", speaker: KADE, time: {h: 4},
    text: L("哨声大作。执法官凯德带队扫荡污池，头盔灯扫过每一张脸。\n蒂卡从窝棚那头跑过来，拽住你的袖子。\n“变种人，异端，没登记的人口，”凯德说，“上巢嫌今年的污池太挤了。”",
            "Whistles shriek. Enforcer Kade sweeps the Sump, helmet lamps raking every face.\nTikka comes running from the shacks and grabs your sleeve.\n“Mutants, heretics, unregistered population,” Kade says. “The spire thinks the Sump's too crowded this year.”"),
    effects: {sanity: -5},
    codex: ["imp_arbites"],
    choices: [
      C("拉着蒂卡钻进管道", "Drag Tikka into the pipes", "cha_105", {result: L("管道又窄又臭。你们挤在黑暗里，听着外面火焰嘶嘶作响，蒂卡一直在咳。", "The pipe is narrow and foul. You huddle in the dark, listening to the flamers hiss, Tikka coughing into your shoulder.")}),
      C("照雕像说的，往左躲", "Do as the statue said: hide left", "cha_105", {require: {flag: "idol"}, hideIfLocked: true, effects: {sanity: -5, corruption: 3, taint: {tzeentch: 5}}, result: L("左边是一堵墙，墙下却有个你从没见过的洞。灯光从头顶扫过去，一次也没停。", "To the left is a wall, and at its foot a hole you've never seen. The lamps sweep overhead and never once stop.")}),
      C("替哨子引开执法官", "Draw the enforcers away from Whistle", "cha_106", {require: {flag: "whistleFriend"}, hideIfLocked: true}),
      C("指认哨子，换赏金", "Point out Whistle for the bounty", "cha_105", {require: {flag: "metWhistle"}, hideIfLocked: true, effects: {hp: 10, corruption: 4, sanity: -10, set: {betrayedWhistle: true, wronged_whistle: true}}, result: L("你伸手一指。凯德扔给你一张口粮券，看都没看你。远处，哨音断了。", "You point. Kade flicks you a ration chit without looking at you. Somewhere in the dark, a whistle cuts short.")})
    ]};

  N.cha_106 = {chapter: 1, scene: "underhive", speaker: KADE, time: {h: 1},
    text: L("你朝反方向扔出一块铁皮：“变种人往那边跑了！”\n凯德追了两步，停下，慢慢转过身。\n他用警棍敲了你三下，不紧不慢，像在敲门。“我记住你的脸了。”",
            "You hurl a scrap of sheet metal the other way. “The mutant went that way!”\nKade takes two steps, stops, and slowly turns.\nHe hits you three times with his baton, unhurried, like knocking on a door. “I'll remember your face.”"),
    effects: {hp: -15, set: {whistleOwes: true, kadeKnows: true}},
    choices: [
      C("爬回窝棚", "Crawl back to your shack", "cha_105", {result: L("蒂卡用湿布给你敷脸。远处传来一声很长的哨音：哨子逃掉了。", "Tikka presses a wet rag to your face. Far off, one long whistle: Whistle got away.")})
    ]};

  N.cha_105 = {chapter: 1, scene: "underhive", speaker: TIKKA, time: {d: 2},
    text: L("两天后，蒂卡咳出来的东西是绿色的。她拉着你穿过拾荒集市，摊主们压低声音在传：\n中巢有群穿灰袍的人在发面包，不问名字，不收钱。\n“我们去吧，”蒂卡说，“就这一次。”",
            "Two days later, what Tikka coughs up is green. She drags you through the scrap market, where the stallholders pass word in low voices:\nin the mid-hive, people in grey robes are handing out bread. No names, no coin.\n“Let's go,” Tikka says. “Just this once.”"),
    alt: [
      {if: {flag: "betrayedWhistle"}, add: L("集市上有人说，哨子被拖走时一声都没吹。", "Someone at the market says Whistle didn't make a sound when they dragged him off.")},
      {if: {flag: "idol"}, add: L("你怀里的雕像，在灰袍人三个字出现时烫了一下。", "At the words “grey robes,” the statue in your coat flares warm.")}
    ],
    choices: [
      C("走，去中巢", "All right. The mid-hive.", "cha_107", {result: L("路过中巢的告示墙：今年什一税多征一个团，送去尘落星打绿皮。蒂卡问尘落星在哪，没人知道。", "On the mid-hive notice wall: this year's tithe takes an extra regiment, shipped to Dustfall to fight greenskins. Tikka asks where Dustfall is. Nobody knows.")}),
      C("先去药房给她偷药", "Steal her medicine first", "cha_105a", {effects: {hp: -10, renown: 3, set: {stoleMedicine: true}}, result: L("药房的狗咬住了你的小腿。你还是够到了药柜。", "The dispensary's dog gets your calf. You still reach the cabinet.")})
    ]};

  N.cha_105a = {chapter: 1, scene: "underhive", speaker: null, time: {h: 3},
    text: L("你揣出一瓶药，标签上的字一个也看不懂。身后的狗叫声把半条街的灯都叫亮了。\n你一路跑到中巢的告示墙下才停。蒂卡接过药瓶，看了很久，没舍得打开。\n“留着，”她说，“等真不行了再喝。”",
            "You come away with a bottle whose label you can't read. The dog's barking lights up half the street behind you.\nYou don't stop until the mid-hive notice wall. Tikka turns the bottle over a long time and doesn't open it.\n“I'll keep it,” she says. “For when it gets really bad.”"),
    alt: [
      {if: {flag: "origin_deserter"}, text: L("执法站的药柜旁贴着一张通缉单，是你穿军装的脸。你揣出一瓶药，手法跟在团里偷补给时一样，心却跳得更快。\n蒂卡接过药瓶，没舍得打开。\n“留着，”她说，“等真不行了再喝。”",
        "Beside the enforcer post's medicine locker hangs a wanted sheet: your face, in uniform. You lift a bottle the way you once raided regimental stores, heart pounding harder.\nTikka takes it and doesn't open it.\n“I'll keep it,” she says. “For when it gets really bad.”")}
    ],
    choices: [
      C("去中巢找灰袍人", "Go find the grey-robes", "cha_107", {result: L("告示墙上贴着新的征兵令：多征一个团，送去尘落星打绿皮。", "A fresh levy on the notice wall: one more regiment, shipped to Dustfall to fight greenskins.")})
    ]};

  N.cha_107 = {chapter: 1, scene: "cult_shrine", speaker: VELLUM, time: {h: 6},
    gather: L("施粥堂", "Soup kitchen"),
    text: L("灰袍人把废弃的礼拜堂改成了施粥堂，几十个下巢人排着队。领头的老人叫维勒姆，记得每个人的名字，很快也记住了你的。\n他亲手给蒂卡盛了满满一碗：“上巢吃的是你们的汗。在这里，你们先吃。”",
            "The grey-robes have turned an abandoned chapel into a soup kitchen; dozens of underhivers queue. Their leader, an old man named Vellum, knows every name, and soon knows yours.\nHe ladles Tikka a brimming bowl himself. “The spire eats your sweat. Here, you eat first.”"),
    alt: [
      {if: {flag: "readBook"}, add: L("排队的人哼着一首歌。你跟着哼，一个音也没错。维勒姆抬眼看了你很久。", "The queue hums a tune. You hum along, every note right. Vellum looks at you for a long time.")},
      {if: {flag: "metIxaril"}, add: L("昨晚那个羽毛斗篷的人不在，只有一根蓝羽毛插在汤锅边上。", "The feather-cloaked man from last night is gone; a single blue feather sticks out of the soup pot.")}
    ],
    effects: {hp: 15},
    codex: ["chaos_cult", "place_choir_chapel"],
    choices: [
      C("狼吞虎咽", "Wolf it down", "cha_108", {effects: {hp: 10}, result: L("汤是热的，里面有真的肉。你没问是什么肉。", "The soup is hot, with real meat in it. You don't ask what kind.")}),
      C("先问他要什么回报", "Ask what he wants in return", "cha_107a", {effects: {sanity: 5, set: {askedPrice: true}}, result: L("维勒姆笑着摇头：“什么也不要。”他放下勺子，“来，给你看样东西。”", "Vellum smiles and shakes his head. “Nothing.” He sets down the ladle. “Come. I'll show you something.”")})
    ]};

  N.cha_107a = {chapter: 1, scene: "cult_shrine", speaker: VELLUM, time: {h: 1},
    text: L("礼拜堂后墙写满了名字，每个名字后面画着一个音符。墙顶画着一只睁开的眼睛。\n“每个吃过这里饭的人，都在这面墙上，”维勒姆说，“有一天他们会一起唱。有一位战帅，等这首歌等了一万年。”",
            "The chapel's back wall is covered in names, a musical note drawn after each. At the top, an open eye is painted.\n“Everyone who has eaten here is on this wall,” Vellum says. “One day they'll all sing together. There is a Warmaster who has waited ten thousand years for that song.”"),
    choices: [
      C("问那只眼睛是谁的", "Ask whose eye that is", "cha_108", {effects: {corruption: 3}, result: L("“一个替四位敲门的人，”维勒姆说，“他敲了一万年，门快开了。”他把你的名字写上了墙。", "“A man who knocks on the door for the Four,” Vellum says. “He's knocked for ten thousand years. It's nearly open.” He writes your name on the wall.")})
    ]};

  N.cha_108 = {chapter: 1, scene: "cult_shrine", speaker: VELLUM, time: {h: 5},
    text: L("那天夜里，维勒姆跪在地上，亲手给新来的人洗脚。轮到你时，他洗得很仔细，连脚趾缝里的泥都没放过。\n“在上巢眼里，你们是数字，”他说，“在这里，你们是家人。”\n你从没被人这样对待过。",
            "That night Vellum kneels and washes the newcomers' feet with his own hands. With yours he is meticulous, down to the grime between your toes.\n“To the spire, you're numbers,” he says. “Here, you're family.”\nNo one has ever treated you like this."),
    effects: {sanity: 10},
    choices: [
      C("让他洗", "Let him", "cha_201", {effects: {corruption: 3}, result: L("温水漫过脚背。你哭了，自己都没察觉。他假装没看见。", "Warm water over your feet. You're crying before you notice. He pretends not to see.")}),
      C("缩回脚，说不用了", "Pull your feet back, say no need", "cha_201", {effects: {renown: -2, set: {refusedWash: true}}, result: L("维勒姆没坚持，只是点点头。旁边几个人看你的眼神，冷了一点。", "Vellum doesn't insist; he only nods. A few of the others look at you a little colder.")})
    ]};

  /* ============ Origin prologues (SPEC §16) · merge at cha_107 ============ */
  /* --- 星界军逃兵 / Guard deserter (origin_deserter) --- */
  N.cha_o_deserter_1 = {chapter: 1, scene: "underhive", speaker: null,
    text: L("污池。三周前你还是星界军。激光枪卖了，军装烧了，只剩一双军靴舍不得扔。\n团里的政委一定还在找你。\n在这里，没人问你从哪来，只问你有什么能换。",
            "The Sump. Three weeks ago you were Astra Militarum. The lasgun's sold, the uniform's burned; only the boots remain, too good to throw away.\nThe regiment's commissar must still be looking.\nDown here nobody asks where you're from. Only what you've got to trade."),
    codex: ["imp_hive", "place_carcharos", "place_sump"],
    choices: [
      C("用军靴换吃的", "Trade the boots for food", "cha_o_deserter_2", {effects: {hp: 10, set: {soldBoots: true}}, result: L("一个拾荒者给了你三块灰面饼，当场就把靴子穿上了。你光着脚吃完了饼。", "A scavenger hands over three grey ration cakes and pulls the boots on then and there. You eat barefoot.")}),
      C("留着靴子，饿着", "Keep the boots and go hungry", "cha_o_deserter_2", {effects: {hp: -5, sanity: 5, set: {keptBoots: true}}, result: L("你系紧鞋带。饿是饿，但穿着它们，你还觉得自己是个人。", "You lace them tight. You're hungry, but in them you still feel like someone.")})
    ]};

  N.cha_o_deserter_2 = {chapter: 1, scene: "underhive", speaker: TIKKA, time: {d: 1},
    text: L("一个缺门牙的女孩蹲在你窝棚口，咳个不停。她叫蒂卡，把半块面饼掰给了你。\n“你走路像当兵的，”她说，“当兵的知道执法官什么时候来。”\n她咳出来的东西带着血丝。",
            "A gap-toothed girl crouches at the mouth of your shack, coughing. Her name is Tikka. She breaks you half a ration cake.\n“You walk like a soldier,” she says. “Soldiers know when the enforcers are coming.”\nWhat she coughs up is streaked with blood."),
    choices: [
      C("教她听巡逻的脚步", "Teach her to hear a patrol's step", "cha_o_deserter_3", {effects: {sanity: 5, set: {taughtTikka: true}}, result: L("你教她数靴子落地的节奏：齐步的是执法官，乱步的是拾荒者。她学得很快。", "You teach her to count boot-falls: in step means enforcers, out of step means scavengers. She learns fast.")}),
      C("收下面饼，别惹麻烦", "Take the cake and stay out of it", "cha_o_deserter_3", {effects: {hp: 5}, result: L("你吃了面饼，背对着她躺下。她咳了一整夜，你数了一整夜。", "You eat the cake and lie down with your back to her. She coughs all night. You count every one.")})
    ]};

  N.cha_o_deserter_3 = {chapter: 1, scene: "underhive", speaker: KADE, time: {d: 2},
    text: L("执法官凯德带队扫荡污池，手里举着一张通缉单，上面印着一张穿军装的脸。\n“逃兵。星界军出赏金，死活一个价。”\n头盔灯一张脸一张脸地扫过来。离你还有三个窝棚。",
            "Enforcer Kade sweeps the Sump holding up a wanted sheet, a face in uniform printed on it.\n“Deserter. The Guard pays a bounty, dead or alive, same price.”\nHis helmet lamp rakes face after face. Three shacks to go."),
    alt: [
      {if: {flag: "soldBoots"}, add: L("巷口躺着一具尸体，脚上穿着你那双军靴。执法官以为逮到了你，开了火。", "At the alley mouth lies a body wearing your army boots. The enforcers thought they'd found you, and fired.")}
    ],
    effects: {sanity: -5},
    codex: ["imp_arbites", "imp_guard"],
    choices: [
      C("拉着蒂卡钻进管道", "Drag Tikka into the pipes", "cha_o_deserter_4", {result: L("管道又窄又臭。灯光从缝隙扫过，停了停，又移开了。蒂卡捂着嘴没咳出声。", "The pipe is tight and foul. The lamp sweeps the gap, pauses, moves on. Tikka smothers her cough."),
        resultAlt: [{if: {flag: "taughtTikka"}, text: L("蒂卡先听见了齐步声，拽着你钻进管道。灯光扫过缝隙，什么也没照到。", "Tikka hears the marching step first and pulls you into the pipe. The lamp sweeps the gap and finds nothing.")}]}),
      C("把兵牌挂到一具尸体上", "Hang your dog tags on a corpse", null, R(0.5, "sanity", "cha_o_deserter_3a", "cha_o_deserter_5", RR(L("凯德翻过尸体，看了看兵牌，在通缉单上打了个叉。“省事了。”", "Kade turns the corpse over, reads the tags, and crosses out the wanted sheet. “Saves me the trouble.”"), L("凯德看看尸体，又抬头看看你。尸体烂了三天，兵牌却是新的。", "Kade looks at the corpse, then up at you. The body is three days rotten. The tags are brand new.")), {require: {notFlag: "soldBoots"}, hideIfLocked: true})),
      C("把兵牌挂到穿你靴子的人身上", "Hang your tags on the man in your boots", null, R(0.7, "sanity", "cha_o_deserter_3a", "cha_o_deserter_5", RR(L("军靴，兵牌，一张打烂的脸。凯德在通缉单上打了个叉。“省事了。”", "Army boots, dog tags, a ruined face. Kade crosses out the wanted sheet. “Saves me the trouble.”"), L("凯德蹲下看了看靴子，又看看你光着的脚。他笑了。", "Kade crouches to look at the boots, then at your bare feet. He smiles.")), {require: {flag: "soldBoots"}, hideIfLocked: true, effects: {sanity: -5}}))
    ]};

  N.cha_o_deserter_3a = {chapter: 1, scene: "underhive", speaker: null, time: {h: 2},
    text: L("执法官走远了。你在纸面上已经死了。\n从今天起，你没有名字，没有编号，没有团。政委的名单上划掉了一行。\n蒂卡从管道里钻出来，看着你空空的脖子：“你现在是谁？”",
            "The enforcers move on. On paper, you're dead.\nFrom today you have no name, no number, no regiment. A line is struck from the commissar's list.\nTikka crawls out of the pipe and looks at your bare neck. “So who are you now?”"),
    effects: {sanity: -5, set: {fakedDeath: true}},
    choices: [
      C("“谁也不是。”", "“Nobody.”", "cha_o_deserter_4", {result: L("蒂卡点点头，好像这是个很好的答案。在污池，这确实是。", "Tikka nods as if that's a fine answer. In the Sump, it is.")})
    ]};

  N.cha_o_deserter_5 = {chapter: 1, scene: "underhive", speaker: KADE, time: {h: 1},
    text: L("凯德没喊人，只用警棍敲了你三下，不紧不慢，像在敲门。\n“死的值一个价，活的值两个，”他说，“等你再养肥一点。”\n他把通缉单折好揣进口袋。“我记住你的脸了。”",
            "Kade doesn't call his men. He hits you three times with his baton, unhurried, like knocking on a door.\n“Dead's worth one price, alive's worth two,” he says. “Once you've fattened up a bit.”\nHe folds the sheet into his pocket. “I'll remember your face.”"),
    effects: {hp: -15, set: {kadeKnows: true}},
    choices: [
      C("爬回窝棚", "Crawl back to your shack", "cha_o_deserter_4", {result: L("蒂卡守着你，一直守到你能坐起来。", "Tikka sits with you until you can sit up.")})
    ]};

  N.cha_o_deserter_4 = {chapter: 1, scene: "underhive", speaker: TIKKA, time: {d: 2},
    text: L("两天后，蒂卡咳出来的东西是绿色的。拾荒集市上在传：中巢有群灰袍人在发面包，不问名字，也不问从哪来。\n“不问从哪来，”蒂卡看着你，“正适合你。”",
            "Two days later, what Tikka coughs up is green. Word at the scrap market: in the mid-hive, grey-robed people are handing out bread. No names asked, no questions about where you're from.\n“No questions,” Tikka says, looking at you. “Made for you.”"),
    choices: [
      C("走，去中巢", "All right. The mid-hive.", "cha_107", {result: L("告示墙上贴着新的征兵令：多征一个团，送去尘落星打绿皮。你把领子竖了起来。", "A fresh levy is pasted on the notice wall: one more regiment, shipped to Dustfall to fight greenskins. You turn your collar up.")}),
      C("用军队的法子先给她弄药", "Get her medicine the army way first", "cha_105a", {effects: {hp: -10, renown: 3, set: {stoleMedicine: true}}, result: L("你摸进执法站，手法跟在团里时一样。", "You slip into the enforcer post, the way you learned in the regiment.")})
    ]};

  /* --- 教会抄写员 / Ecclesiarchy scribe (origin_scribe) --- */
  N.cha_o_scribe_1 = {chapter: 1, scene: "cathedral", speaker: null,
    text: L("中巢圣沃恩大教堂的缮写室。你抄了十一年经文，指头上的墨渍早就洗不掉了。\n今天送来一本无名旧书，封皮是温的。执事吩咐：抄一份存档，原本烧掉。\n你从不读自己抄的东西。今天，你翻开了。",
            "The scriptorium of St Vorne's, the mid-hive cathedral. Eleven years copying scripture; the ink on your fingers will never wash out.\nToday a nameless old book arrives, its cover warm. The deacon's order: copy it for the archive, burn the original.\nYou never read what you copy. Today, you open it."),
    codex: ["imp_hive", "place_carcharos", "imp_ecclesiarchy"],
    choices: [
      C("一行一行读下去", "Read on, line by line", "cha_o_scribe_2", {effects: {corruption: 4, sanity: -5, taint: {tzeentch: 15}, set: {readBook: true}}, result: L("字句像温水，从眼睛流进喉咙。读到第三页，你发现自己在跟着念。", "The words flow like warm water from your eyes into your throat. By page three you're mouthing along.")}),
      C("只描字形，不读意思", "Copy the shapes, not the meaning", "cha_o_scribe_2", {effects: {sanity: 5}, result: L("你把每个字都当成图案来描。可抄到最后，那些图案排成了一首歌。", "You trace each word as a mere shape. But by the end, the shapes have arranged themselves into a song.")})
    ]};

  N.cha_o_scribe_2 = {chapter: 1, scene: "cathedral", speaker: null, time: {d: 2},
    text: L("书里写着一首歌，还写着四位“会倾听的”。原本当晚就烧了。\n可你抄了两份。第二份藏在你的床板底下，每晚都在发烫。\n第三天清早，缮写室门口站着两个执法官。",
            "The book holds a song, and four who “listen.” The original burns that night.\nBut you made two copies. The second hides under your bed-board and grows warm every night.\nOn the third morning, two enforcers stand at the scriptorium door."),
    choices: [
      C("揣上抄本，从排污口逃", "Take the copy and flee down the drain", "cha_o_scribe_3", {effects: {hp: -10, corruption: 3, set: {keptCopy: true}}, result: L("你掀开排污口滑了下去。抄本贴着胸口，烫得像一块炭。", "You lift the drain grate and slide down. The copy burns against your chest like a coal.")}),
      C("烧掉抄本，再逃", "Burn the copy, then flee", "cha_o_scribe_3", {effects: {hp: -10, sanity: 5}, result: L("纸页卷曲发黑。可那首歌已经在你脑子里了，一个音也没烧掉。", "The pages curl and blacken. But the song is already in your head, and not one note burns.")})
    ]};

  N.cha_o_scribe_3 = {chapter: 1, scene: "underhive", speaker: TIKKA, time: {d: 2},
    text: L("污池的空气让你干呕。执法官凯德拿着你的画像挨个窝棚问：“抄书的，手上有墨。”\n一个缺门牙的女孩把你拽进窝棚，往你手上抹了把煤灰。\n“现在没有了，”她说，“我叫蒂卡。”",
            "The Sump's air makes you retch. Enforcer Kade goes shack to shack with your likeness: “A scribe. Ink on the hands.”\nA gap-toothed girl yanks you into her shack and rubs soot over your fingers.\n“Now there isn't,” she says. “I'm Tikka.”"),
    alt: [
      {if: {flag: "keptCopy"}, add: L("怀里的抄本烫得厉害，你怕凯德隔着门板都能闻到焦味。", "The copy in your coat burns so hot you fear Kade can smell it through the door.")}
    ],
    codex: ["place_sump", "imp_arbites"],
    choices: [
      C("谢谢她", "Thank her", "cha_o_scribe_4", {effects: {sanity: 5, set: {taughtTikka: true}}, result: L("蒂卡咧嘴一笑，漏风。“谢谢没用。教我认字吧。”你答应了。", "Tikka grins through her missing teeth. “Thanks are useless. Teach me to read.” You agree.")}),
      C("从门缝里盯着凯德", "Watch Kade through the gap", "cha_o_scribe_4", {effects: {sanity: -5, set: {kadeKnows: true}}, result: L("灯光扫过门缝，停住了。你们隔着门板对视了一眼。他没进来，只是笑了笑。", "The lamp sweeps the gap and stops. Through it, your eyes meet. He doesn't come in. He only smiles.")})
    ]};

  N.cha_o_scribe_4 = {chapter: 1, scene: "underhive", speaker: TIKKA, time: {d: 14},
    text: L("你在蒂卡的窝棚住了半个月。她咳得越来越重，咳出的东西是绿色的。\n污池里在传：中巢有灰袍人发面包。\n有人哼着他们的调子路过。你手心一凉：是那本书里的歌。",
            "Half a month in Tikka's shack. Her cough worsens. What comes up is green.\nWord in the Sump: grey-robes in the mid-hive are handing out bread.\nSomeone passes humming their tune. Your palms go cold. It's the song from the book."),
    alt: [
      {if: {flag: "taughtTikka"}, add: L("她已经认得二十个字了，第一个学会写的是你的名字。", "She knows twenty letters now. The first word she learned to write was your name.")}
    ],
    choices: [
      C("带蒂卡去中巢", "Take Tikka to the mid-hive", "cha_107", {result: L("路过中巢的告示墙：今年什一税多征一个团，送去尘落星打绿皮。蒂卡问尘落星在哪，没人知道。", "On the mid-hive notice wall: this year's tithe takes an extra regiment, shipped to Dustfall to fight greenskins. Tikka asks where Dustfall is. Nobody knows.")}),
      C("先一个人跟着那首歌走", "Follow the song alone first", "cha_o_scribe_4a", {effects: {corruption: 3, renown: 5}, result: L("你不自觉地哼了出来，一个音都没错。前面的人回头看了你一眼，笑了。", "You hum it without meaning to, every note right. The one ahead turns and smiles at you.")})
    ]};

  N.cha_o_scribe_4a = {chapter: 1, scene: "cult_shrine", speaker: IXARIL, time: {h: 5},
    text: L("歌声领你到废弃的礼拜堂。门缝里，灰袍老人在和一个披羽毛斗篷的人说话，那人的影子多出三条胳膊。\n他转过头，像早知道你会来：“抄书的？我们正缺个识字的。”\n你逃了。次日，你带蒂卡回来。",
            "The song leads you to an abandoned chapel. Through the door, a grey-robed old man talks with a man in a feathered cloak.\nThe cloaked man's shadow has three more arms than he does. He turns as if he expected you. “A scribe? Good. We need someone who can read.”\nYou flee to the shack. Next day, you come back with Tikka."),
    effects: {sanity: -5, set: {metIxaril: true}},
    codex: ["chaos_sorcerer"],
    choices: [
      C("推开礼拜堂的门", "Push open the chapel door", "cha_107", {result: L("门没锁。里面飘出热汤的味道。", "The door isn't locked. The smell of hot soup drifts out.")})
    ]};

    /* ============ Chapter 2 · The Choir ============ */
  N.cha_201 = {chapter: 2, scene: "cult_shrine", speaker: VELLUM, time: {d: 14}, bridge: true,
    gather: L("布道会", "Sermon"),
    text: L("两周里你天天吃饱，没人打你，没人查编号。你睡在礼拜堂，跟着诗班学唱。\n夜里的布道会挤满了人。维勒姆说：“帝皇是金椅子上的一具尸体。真正听得见你们的，是另外四位。”\n烛火齐齐晃了一下。",
            "For two weeks you eat your fill. Nobody beats you or checks your number. You sleep in the chapel and learn the Choir's songs.\nThe night sermon is packed. Vellum says, “The Emperor is a corpse on a golden chair. The ones who truly hear you are four others.”\nEvery candle flickers."),
    alt: [
      {if: {flag: "refusedWash"}, add: L("你的铺位被挪到了门口，风最大的地方。没人说为什么。", "Your bedroll has been moved by the door, where the draught is worst. Nobody says why.")},
      {if: {flag: "askedPrice"}, add: L("名单墙上你的名字后面，已经画好了音符。", "On the name wall, a note has already been drawn after your name.")}
    ],
    effects: {corruption: 3, sanity: 5},
    codex: ["chaos_gods", "imp_emperor", "place_terra"],
    choices: [
      C("哪四位？", "Which four?", "cha_202"),
      C("这都是疯话", "This is madness", "cha_203", {effects: {sanity: 5}, result: L("维勒姆不恼，只是笑：“疯话也管饱。”那晚你没听完布道，照样吃得很饱。", "Vellum isn't offended. “Madness fills bellies too,” he smiles. You skip the rest of the sermon and still eat well.")})
    ]};

  N.cha_202 = {chapter: 2, scene: "cult_shrine", speaker: VELLUM, time: {h: 1},
    text: L("“一位爱你的愤怒，一位爱你病着还能笑，一位爱你改变，一位爱你想要。”维勒姆掰着手指，“他们从不挑剔。”\n“那帝皇爱什么？”\n“什么都不爱。他死了。”",
            "“One loves your anger. One loves you smiling through sickness. One loves you changing. One loves you wanting.” Vellum counts on his fingers. “They're never picky.”\n“And what does the Emperor love?”\n“Nothing. He's dead.”"),
    effects: {corruption: 3},
    choices: [
      C("记住这四个", "Remember the four", "cha_203", {result: L("你在心里默念了四遍。每念一遍，烛火就跳一下，像在点头。", "You repeat them silently, four times. Each time, the candles jump, as if nodding.")})
    ]};

  N.cha_203 = {chapter: 2, scene: "cult_shrine", speaker: TIKKA, time: {d: 5},
    text: L("蒂卡不咳了。她胖了些，脸色红润，脖子上起了几个小疙瘩，她说一点都不疼。\n“神父说是‘老爷爷’治好的我，”她高兴地说，“老爷爷爱所有人。”",
            "Tikka has stopped coughing. She's filled out, cheeks rosy, a few little boils on her neck she says don't hurt at all.\n“Father says Grandfather healed me,” she beams. “Grandfather loves everyone.”"),
    alt: [
      {if: {flag: "stoleMedicine"}, add: L("你偷来的那瓶药还在她枕头底下，没开封。“用不着了，”她说。", "The bottle you stole is still under her pillow, unopened. “Don't need it now,” she says.")}
    ],
    codex: ["god_nurgle"],
    choices: [
      C("摸摸她的头", "Ruffle her hair", "cha_204", {effects: {sanity: 5}, result: L("她咯咯笑着往你手心里蹭。一个疙瘩碰到你的手指，是温的。", "She giggles and leans into your hand. A boil brushes your fingers. It's warm.")}),
      C("盯着那些疙瘩", "Stare at the boils", "cha_204", {effects: {sanity: -5, set: {sawMarks: true}}, result: L("它们排成了三个圈，像某种印记。蒂卡拉起衣领：“别看啦，怪害羞的。”", "They form three rings, like a seal. Tikka tugs up her collar. “Stop staring, it's embarrassing.”")})
    ]};

  N.cha_204 = {chapter: 2, scene: "cult_shrine", speaker: VELLUM, time: {d: 10},
    text: L("入会之夜。每个新人都要献上一样东西。有人割破手掌，有人说出从没告诉过别人的秘密。\n门口站着两个不说话的诗班兄弟。蒂卡低着头。\n维勒姆耐心地等着你：“诸神不要贵重的，只要真的。”",
            "Initiation night. Each newcomer must offer something. Some cut their palms. Some speak a secret they've never told a soul.\nTwo silent Choir brothers stand at the door. Tikka keeps her eyes down.\nVellum waits for you, patient. “The gods don't want what's valuable. Only what's true.”"),
    alt: [
      {if: {flag: "askedPrice"}, add: L("“你问过代价，”维勒姆轻声说，“今天就是。”", "“You asked the price,” Vellum says softly. “This is it.”")}
    ],
    choices: [
      C("献上一滴血", "Offer a drop of blood", "cha_205", {effects: {hp: -5, corruption: 4, renown: 5, set: {bloodGift: true}, taint: {khorne: 10}}, result: L("血滴进碗里，没有散开，而是缓缓转了一圈。维勒姆满意地点头。", "The drop falls into the bowl and doesn't spread. It turns, slowly, one full circle. Vellum nods, satisfied.")}),
      C("说出一个秘密", "Speak a secret", "cha_205", {effects: {sanity: -10, corruption: 4, renown: 5, set: {secretGift: true}, taint: {tzeentch: 10}}, result: L("话一出口，你就忘了它是什么。只记得说完很轻松，轻松得可怕。", "The moment it leaves your mouth, you forget what it was. You only remember the relief. Frighteningly light.")}),
      C("献上那份发烫的抄本", "Offer the copy that burns", "cha_205", {require: {flag: "keptCopy"}, hideIfLocked: true, effects: {corruption: 4, renown: 8, set: {secretGift: true}, taint: {tzeentch: 15}}, result: L("维勒姆双手接过抄本，像接一个婴儿。“原本烧了？可惜。不过，这份更好：它是你写的。”", "Vellum takes the copy in both hands, like an infant. “The original burned? A pity. But this is better: you wrote it.”")}),
      C("什么都不献", "Offer nothing", "cha_206")
    ]};

  N.cha_206 = {chapter: 2, scene: "cult_shrine", speaker: VELLUM, time: {h: 1},
    text: L("维勒姆笑了，笑了很久。周围的人也跟着笑，节奏一模一样。\n“那么，”他温和地说，“你本身就是礼物。”\n门口那两个兄弟关上了礼拜堂的门。蒂卡低下了头。",
            "Vellum smiles, and keeps smiling a long time. The others smile with him, all in the same rhythm.\n“Then,” he says gently, “you are the gift.”\nThe two brothers at the door close it. Tikka stares at the floor."),
    effects: {sanity: -10},
    choices: [
      C("我献血！现在就献！", "Blood! I'll give blood, now!", "cha_205", {effects: {hp: -15, corruption: 4, set: {bloodGift: true}}, result: L("你抓起刀，划得太深了。维勒姆按住你的手：“够了，孩子，够了。”笑声停了。", "You grab the knife and cut too deep. Vellum stills your hand. “Enough, child. Enough.” The smiling stops.")}),
      C("撞开门逃跑", "Smash through the doors", null, R(0.5, "hp", "cha_207", "cha_end_sacrifice", RR(L("肩膀撞上门板，木头裂开一道缝，冷风灌了进来。", "Your shoulder hits the door. Wood cracks; cold air rushes in."), L("你撞了一次，两次，门板纹丝不动。好几双手温柔地搭上了你的肩。", "You hit it once, twice. It doesn't budge. Several hands settle gently on your shoulders.")), {require: {notFlag: "refusedWash"}, hideIfLocked: true})),
      C("撞开门逃跑", "Smash through the doors", null, R(0.4, "hp", "cha_207", "cha_end_sacrifice", RR(L("门口那人慢了半步。木头裂开一道缝，冷风灌了进来。", "The man at the door is half a step slow. Wood cracks; cold air rushes in."), L("那个从洗脚那夜起就盯着你的人，早就顶住了门。好几双手温柔地搭上了你的肩。", "The one who has watched you since the foot-washing is already braced against the door. Gentle hands settle on your shoulders.")), {require: {flag: "refusedWash"}, hideIfLocked: true}))
    ]};

  N.cha_end_sacrifice = {chapter: 2, scene: "cult_shrine", speaker: TIKKA, time: {d: 1},
    text: L("门很结实。\n后来，诗班的人提起你都很尊敬：第一个被献给四位的人，祭坛的烛火为你烧了一整夜。\n蒂卡每天都给你的空座位盛一碗汤。",
            "The doors hold.\nAfterward the Choir speaks of you with reverence: the first one given to the Four. The altar candles burned all night for you.\nEvery day, Tikka sets a bowl of soup at your empty place."),
    ending: {kind: "bad", title: L("祭品", "The Offering"), cause: L("被献祭给四神", "Sacrificed to the Four")}};

  N.cha_207 = {chapter: 2, scene: "underhive", speaker: TIKKA, time: {d: 1},
    text: L("你撞开门，一路逃回污池，身后没人追。门闩其实早就松了。\n第二天，蒂卡提着一篮面包来找你：“神父说你很勇敢，诸神喜欢倔的。门是他故意没闩牢的。他请你回去。”\n你饿了。",
            "You burst through and run all the way back to the Sump. No one follows. The bolt was loose all along.\nNext morning Tikka turns up with a basket of bread. “Father says you're brave. The gods like stubborn ones. He left that bolt loose on purpose. He wants you back.”\nYou're hungry."),
    effects: {renown: 5, set: {stubborn: true}},
    choices: [
      C("跟她回去", "Go back with her", "cha_205", {result: L("当晚，维勒姆亲手给你烙了印。“倔的，也要有记号。”", "That night Vellum brands you with his own hand. “Even the stubborn ones get a mark.”")})
    ]};

  N.cha_205 = {chapter: 2, scene: "cult_shrine", speaker: null, time: {d: 30}, eventRoll: 0.42, jump: L("入会后的一个月", "The month after initiation"),
    text: L("你手腕上有了烙印，八道细线从一点散开。不疼，只是偶尔发烫，像有人在远处想你。\n一个月里你总做同一个梦：一扇门，门后四个声音在争论谁先开门。",
            "There is a brand on your wrist now: eight thin lines from a single point. It doesn't hurt. Now and then it grows warm, as if someone far away is thinking of you.\nFor a month you dream the same dream: a door, and four voices behind it arguing over who opens it first."),
    alt: [
      {if: {flag: "stubborn"}, add: L("你是唯一一个没献东西就被烙上印的人。别人看你的眼神里有点怕。", "You're the only one branded without offering anything. The others look at you with something like fear.")}
    ],
    effects: {corruption: 3, renown: 5},
    codex: ["chaos_warp"],
    choices: [
      C("在梦里推开那扇门", "Push the door open in the dream", "cha_208", {effects: {corruption: 7, renown: 5, sanity: -5, taint: {all: 5}, set: {openedDoor: true}}, result: L("门开了一条缝。四个声音同时安静，又叫出你的名字。醒来时烙印烫得发亮。二十天后，维勒姆召集了所有人。", "The door opens a crack. The four voices hush, then speak your name at once. You wake with the brand glowing. Twenty days later, Vellum calls everyone together.")}),
      C("醒来，用冷水洗脸", "Wake up and splash cold water on your face", "cha_208", {effects: {sanity: 5, corruption: -5, set: {coldWater: true}}, result: L("冷水刺得你一哆嗦。烙印暗了下去。暂时。二十天后，维勒姆召集了所有人。", "The cold water makes you gasp. The mirror shows only you, and the brand dims. For now. Twenty days later, Vellum calls everyone together.")})
    ]};

  N.cha_208 = {chapter: 2, scene: "manufactorum", speaker: VELLUM, time: {d: 20}, jump: L("二十天后，起事的准备", "Twenty days on: preparing the rising"),
    text: L("礼拜堂装不下了，维勒姆把人带进废弃制造厂。他身边站着个羽毛斗篷的陌生人，影子多三条胳膊。\n“什一税之夜起事。”分派：炸水厂，开监狱，烧大教堂。\n“你呢，”他问，“你想要什么？”",
            "The chapel can't hold everyone now; Vellum leads them into a derelict manufactorum. Beside him stands a stranger in a feathered cloak whose shadow has three extra arms.\n“On Tithe Night, we rise.” He assigns: blow the water plant, open the prison, burn the cathedral.\n“And you,” he asks. “What do you want?”"),
    alt: [
      {if: {flag: "metIxaril"}, add: L("羽毛斗篷冲你眨了眨眼：“识字的，你来了。”", "The feathered cloak winks at you. “Ah, the one who can read.”")},
      {if: {flag: "origin_scribe"}, add: L("烧大教堂。你在那里的缮写室抄了十一年经。", "Burn the cathedral. You copied scripture in its scriptorium for eleven years.")}
    ],
    codex: ["chaos_sorcerer"],
    choices: [
      C("我要上巢付出代价", "I want the spire to pay", "cha_209", {effects: {renown: 5, set: {wantRevenge: true}, taint: {khorne: 5}}, result: L("维勒姆拍拍你的肩：“好。愤怒是最诚实的祷告。”角落里，有人开始磨刀。", "Vellum claps your shoulder. “Good. Anger is the most honest prayer.” In a corner, someone starts sharpening a blade.")}),
      C("我只想大家都吃饱", "I just want everyone fed", "cha_209", {effects: {sanity: 5, set: {wantBread: true}, taint: {nurgle: 5}}, result: L("维勒姆沉默了一会儿：“会的。”那一刻，你相信他是真心的。", "Vellum is quiet a moment. “They will be.” Right then, you believe he means it.")}),
      C("我想看看会发生什么", "I want to see what happens", "cha_209", {effects: {corruption: 4, set: {wantChange: true}, taint: {tzeentch: 5}}, result: L("羽毛斗篷的人笑出了声。维勒姆说：“诚实。有一位会很喜欢你。”", "The feathered stranger laughs aloud. Vellum says, “Honest. One of them will like you very much.”")})
    ]};

  N.cha_209 = {chapter: 2, scene: "cult_shrine", speaker: TIKKA, time: {d: 2},
    gather: L("领面包的队伍", "Bread line"),
    text: L("起事前三天，面包开始要价了。领面包的队伍里，每人得交一个名字：一个不肯唱歌的邻居。\n蒂卡已经交了三个。“他们会被‘请’去礼拜堂，”她说，“然后就会唱了。”\n前后的人都在偷看谁交了谁。",
            "Three days before the rising, the bread starts costing something. In the bread line, each person must hand in a name: a neighbour who won't sing.\nTikka has given three already. “They'll be invited to the chapel,” she says. “Then they'll sing.”\nEveryone in the line is watching who names whom."),
    effects: {sanity: -5},
    choices: [
      C("交一个名字", "Hand in a name", "cha_209a", {effects: {corruption: 4, renown: 5, sanity: -5, taint: {tzeentch: 5}, set: {namedNeighbor: true}}, result: L("你说出隔壁老鞋匠的名字。蒂卡认真记下。", "You give the old cobbler next door. Tikka writes it down carefully.")}),
      C("交上凯德的名字", "Hand in Kade's name", "cha_210", {require: {flag: "kadeKnows"}, hideIfLocked: true, effects: {renown: 8, set: {wronged_kade: true}}, result: L("维勒姆把这个名字念了两遍，笑出了声：“执法官？好孩子，太好了。”", "Vellum reads the name twice and laughs aloud. “An enforcer? Good child. Very good.”")}),
      C("编一个不存在的人", "Make up someone who doesn't exist", "cha_209b", {effects: {sanity: 5, set: {fakeName: true}}, result: L("你编了个名字：“老锈”。蒂卡认真记下。", "You invent one: “Old Rust.” Tikka writes it down carefully.")})
    ]};

  N.cha_209a = {chapter: 2, scene: "cult_shrine", speaker: null, time: {d: 1},
    text: L("第二天，老鞋匠不见了。第三天，礼拜堂里多了一个唱得很响的声音。\n是他。他的嗓子唱劈了还在唱，眼睛一直看着你。\n唱到一半，他朝你笑了一下，那不是他自己的笑。",
            "Next day the old cobbler is gone. The day after, the chapel has one more very loud voice.\nIt's him. His voice cracks and he keeps singing, eyes on you the whole time.\nHalfway through he smiles at you. It isn't his own smile."),
    effects: {sanity: -6},
    choices: [
      C("移开目光", "Look away", "cha_210", {result: L("你盯着自己的鞋。那双鞋是他补的。", "You stare at your shoes. He mended them.")})
    ]};

  N.cha_209b = {chapter: 2, scene: "underhive", speaker: TIKKA, time: {d: 1},
    text: L("诗班的人在污池里找了一整天，真找到了一个叫“老锈”的人：一个收破铜的瘸腿老头。\n第二天他被“请”进了礼拜堂。第三天，他唱得比谁都响。\n你编出来的名字，诸神收下了。",
            "The Choir combs the Sump all day and actually finds someone called Old Rust: a lame old man who collects scrap copper.\nNext day he's invited to the chapel. The day after, he sings louder than anyone.\nThe name you made up, the gods accepted."),
    effects: {sanity: -5, corruption: 3, taint: {tzeentch: 5}},
    choices: [
      C("你什么也说不出来", "You can't say a word", "cha_210", {result: L("蒂卡拍拍你：“你看，你也找对了人。”", "Tikka pats your arm. “See? You picked the right one too.”")})
    ]};
  /* ============ Chapter 3 · Uprising ============ */
  N.cha_210 = {chapter: 3, scene: "manufactorum", speaker: VELLUM, time: {d: 2}, bridge: true,
    text: L("什一税之夜前一晚，制造厂点着一排油灯。诗班的人排队领撬棍和燃烧瓶，羽毛斗篷在地上画粉笔圈，画了又擦。\n维勒姆一个个念分组：闸门，监狱，中巢行会长的宅子。\n蒂卡把一根撬棍塞进你手里。",
            "The night before Tithe Night, a row of oil lamps burns in the manufactorum. The Choir queues for crowbars and firebombs; the feathered stranger chalks circles on the floor and rubs them out.\nVellum reads the groups: the gate, the prison, the guild-master's house.\nTikka presses a crowbar into your hands."),
    alt: [
      {if: {flag: "wantRevenge"}, add: L("“你去闸门，”维勒姆说，“你想要上巢付账。”", "“You take the gate,” Vellum says. “You want the spire to pay.”")},
      {if: {flag: "wantBread"}, add: L("“你去监狱，”维勒姆说，“那里有一仓库的口粮。”", "“You take the prison,” Vellum says. “There's a storeroom of rations there.”")},
      {if: {flag: "wantChange"}, add: L("羽毛斗篷的人点了你：“宅子。你会看见想看的。”", "The feathered stranger picks you. “The house. You'll see what you want to see.”")},
      {if: {flag: "wronged_kade"}, add: L("有人说，凯德的哨所会第一个烧。", "Someone says Kade's post will be the first to burn.")},
      {if: {flag: "fakeName"}, add: L("老锈也领了一根撬棍，冲你点了点头。", "Old Rust takes a crowbar too, and nods at you.")}
    ],
    choices: [
      C("握紧撬棍", "Grip the crowbar", "cha_301", {result: L("铁是凉的。一整夜，没有人睡着。", "The iron is cold. All night, nobody sleeps.")})
    ]};

  N.cha_301 = {chapter: 3, scene: "burning_city", speaker: TIKKA, time: {h: 20},
    text: L("什一税之夜。水厂炸了，中巢的灯同时熄灭。黑暗里，几万人一起唱起诗班的歌。\n你从没见过这么多人笑着冲向火光。\n分组早就乱了。蒂卡喊：“走！去哪都行！”",
            "Tithe Night. The water plant blows and every light in the mid-hive dies. In the dark, tens of thousands sing the Choir's hymn together.\nYou've never seen so many people run toward fire, laughing.\nThe groups have already dissolved. Tikka shouts, “Come on! Anywhere!”"),
    effects: {corruption: 3},
    choices: [
      C("冲向上巢的闸门", "Charge the spire gates", "cha_302"),
      C("去监狱放人", "Break open the prison", "cha_303"),
      C("溜进中巢行会长的宅子", "Slip into the guild-master's house", "cha_304"),
      C("领人走大教堂的地下通道", "Lead them through the cathedral undercroft", "cha_305", {require: {flag: "origin_scribe"}, hideIfLocked: true, effects: {renown: 8, corruption: 3, set: {guidedCathedral: true}}, result: L("缮写室底下有条运纸的通道，你走过一万次。几十个人跟着你，悄无声息地进了大教堂。", "Under the scriptorium runs a paper-carriers' tunnel you've walked ten thousand times. Dozens follow you silently into the cathedral.")})
    ]};

  N.cha_302 = {chapter: 3, scene: "burning_city", speaker: S("commissar", "政委", "Commissar"), foe: "guardsman", time: {h: 2},
    text: L("闸门后，一排星界军早已列阵。枪口整齐划一，像一道栅栏。\n大檐帽的政委在队列后踱步，声音不高：“齐射。”\n前排倒下了。后排的人接着冲，还在唱。",
            "Behind the gate, a line of Astra Militarum stands ready, muzzles aligned like a fence.\nA commissar in a peaked cap paces behind them. He barely raises his voice. “Volley.”\nThe front rank falls. The ones behind keep charging, still singing."),
    effects: {sanity: -10},
    codex: ["imp_guard", "imp_commissar"],
    choices: [
      C("跟着冲上去", "Charge with them", null, R(0.45, "hp", "cha_305", "cha_306", RR(L("枪声像撕布。身边的人一排排倒下，你却毫发无伤。人潮退去时，把你冲向了大教堂。", "Gunfire like tearing cloth. Rows fall beside you, yet nothing touches you. When the tide breaks, it sweeps you toward the cathedral."), L("你冲到离闸门十步远的地方。然后，腿上一热。", "You get within ten paces of the gate. Then your leg goes hot.")))),
      C("拉住蒂卡，躲进侧巷", "Grab Tikka and duck into an alley", "cha_302a", {effects: {sanity: -5}, result: L("你拽着蒂卡扑进巷口。子弹在墙上啃出一排白点。", "You haul Tikka into the alley mouth. Rounds chew a line of white pocks along the wall.")}),
      C("喊出你旧团的口令", "Shout your old regiment's challenge", "cha_302a", {require: {flag: "origin_deserter"}, hideIfLocked: true, effects: {renown: 5, sanity: -5, set: {commissarKnows: true}}, result: L("前排的枪口晃了半秒。政委的目光钉在你脸上：他认出你了。你趁那半秒钻进了侧巷。", "The front rank's muzzles waver half a second. The commissar's eyes find you: he knows you. You use that half second to vanish down an alley."),
        resultAlt: [{if: {flag: "keptBoots"}, text: L("前排的枪口晃了半秒。政委盯着你脚上的军靴，又盯着你的脸：他认出你了。你钻进了侧巷。", "The front rank wavers. The commissar's eyes go to your Guard boots, then your face: he knows you. You vanish down an alley.")}]})
    ]};

  N.cha_302a = {chapter: 3, scene: "burning_city", speaker: TIKKA, time: {h: 1},
    text: L("巷子里，你捂住蒂卡的耳朵。齐射一阵接一阵，歌声一次比一次稀。\n巷子尽头就是大教堂广场。活下来的人都往那边流，像水往低处走。\n蒂卡在发抖，可她也在笑。",
            "In the alley you cover Tikka's ears. Volley after volley; each time, the singing is thinner.\nThe alley ends at the cathedral square. Everyone still alive is flowing that way, like water running downhill.\nTikka is shaking. She is also laughing."),
    alt: [
      {if: {flag: "commissarKnows"}, add: L("扩音器里，政委念出了一个编号：你从前的编号。", "Over the vox, the commissar reads out a number: your old service number.")}
    ],
    choices: [
      C("随人潮去大教堂", "Go with the crowd to the cathedral", "cha_305", {result: L("人潮把你们推上了大教堂的台阶。", "The crowd carries you up the cathedral steps.")})
    ]};

  N.cha_303 = {chapter: 3, scene: "barracks", speaker: WHISTLE, time: {h: 2},
    grudgeLine: {npc: "whistle", text: L("那个长音很快断了。他靠着牢墙，只是看着你的手。", "The long note soon breaks off. He leans against the cell wall, only watching your hands.")},
    text: L("监狱里关的全是“欠税的人”。你撬开一扇扇门，放出来的人没一个回家，全都走向火光。\n最后一间牢房里蹲着一个脖子长鳃的变种人，大家叫他哨子。他看见你，吹出一个很长的音。",
            "The prison holds people who “owed the tithe.” You pry open door after door. Not one of the freed goes home; all walk toward the fire.\nIn the last cell crouches a mutant with gills on his neck. People call him Whistle. He sees you and lets out one long note."),
    alt: [
      {if: {flag: "whistleOwes"}, add: L("那天他逃掉了。三天后，还是被抓了进来。", "He got away that day. Three days later, they caught him anyway.")},
      {if: {flag: "betrayedWhistle"}, add: L("他认得你。是你那天伸手指了他。", "He knows you. You're the one who pointed him out.")},
      {if: {flag: "robbedWhistle"}, add: L("他认得你。是你偷了他的水桶。", "He knows you. You're the one who stole his bucket.")}
    ],
    choices: [
      C("“对不起。”", "“I'm sorry.”", "cha_303a", {require: {flag: "wronged_whistle"}, hideIfLocked: true, effects: {sanity: -5, set: {whistleJoined: true, forgiven_whistle: true}}, result: L("哨子看了你很久，吹了个短音，伸手让你拉他起来。他什么都没说，这比骂你更难受。", "Whistle looks at you a long time. Then one short note, and he reaches for your hand. He says nothing. That's worse than cursing.")}),
      C("“走，跟我们走。”", "“Come on. Come with us.”", "cha_303a", {effects: {sanity: 5, set: {whistleJoined: true}}, grudge: {npc: "whistle", effects: {sanity: -6}, note: L("哨子记得你对他做过的事，沉默地跟着你。", "Whistle remembers what you did to him and follows in silence.")}, result: L("哨子的鳃一张一合。他跟上你，一路吹着诗班的调子，跑了两个音。", "Whistle's gills flutter. He follows, whistling the Choir's hymn, two notes off.")}),
      C("锁上门，离开", "Lock the door and leave", "cha_305", {effects: {corruption: 4, sanity: -10, set: {wronged_whistle: true, whistleLocked: true}}, result: L("锁舌咔哒一声。你锁住了哨子。走出很远，那个长音还在身后。放出来的人把你带向了大教堂。", "The lock clicks on Whistle. Far down the corridor the long note is still behind you. The freed crowd carries you toward the cathedral.")})
    ]};

  N.cha_303a = {chapter: 3, scene: "underhive", speaker: WHISTLE, time: {h: 2},
    text: L("哨子带着放出来的几十个人钻进排水道，那是只有变种人才知道的路。\n你们扛着监狱仓库里的口粮箱，一路走一路分。\n出口在大教堂广场的井盖底下。哨子推开井盖，吹了一声：到了。",
            "Whistle leads the dozens you freed into the drains, roads only mutants know.\nYou carry the prison's ration crates and hand them out as you go.\nThe exit is a manhole under the cathedral square. Whistle shoves the cover aside and whistles once: here."),
    alt: [
      {if: {flag: "wantBread"}, add: L("每个人都分到了一块。你想要的，今晚第一次成了真。", "Everyone gets a share. What you wanted came true tonight, for the first time.")}
    ],
    effects: {hp: 5},
    choices: [
      C("爬上广场", "Climb up into the square", "cha_305", {result: L("广场上全是人，全都朝大教堂里看。", "The square is packed, everyone staring into the cathedral.")})
    ]};

  N.cha_304 = {chapter: 3, scene: "hive_hab", speaker: S("daemon_slaanesh", "镜中的你", "You, in the Mirror"), time: {h: 2},
    text: L("中巢行会长逃上了上巢，宅子空了，香水味还没散。你在一面金框镜子前停下。\n镜子里的你干净、漂亮、自信，穿着丝绸，冲你眨了眨眼。\n“你本来就该是这样，”它说，“只要你想要。”",
            "The guild-master has fled up-spire; the house is empty, the perfume still lingering. You stop before a gilt mirror.\nThe you inside is clean, beautiful, confident, dressed in silk. Mirror-you winks.\n“This is who you were meant to be,” it says. “You need only want it.”"),
    codex: ["god_slaanesh"],
    choices: [
      C("伸手去摸镜子", "Reach out and touch the glass", "cha_304a", {effects: {corruption: 7, renown: 5, sanity: -5, taint: {slaanesh: 30}, set: {mirrorTouched: true}}, result: L("镜面软得像水。镜中的你握住你的指尖，轻轻一吻。你抽回手，指尖还留着香水味。", "The glass is soft as water. Mirror-you takes your fingertips and kisses them lightly. When you pull back, they smell of perfume.")}),
      C("砸碎镜子", "Smash the mirror", "cha_305", {effects: {sanity: -5, hp: -5, set: {smashedMirror: true}}, result: L("玻璃碎了一地，每块碎片里都有一个你在笑。你的手在流血。你包好手，往大教堂去。", "Glass everywhere; in every shard a you is smiling. Your hand bleeds. You bind it and head for the cathedral.")}),
      C("撬下金框拿去换钱", "Pry off the gold frame to sell", "cha_305", {effects: {hp: 5, renown: 2, set: {goldFrame: true}}, result: L("金框比看上去沉。镜子里的你翻了个白眼。你扛着它往大教堂去。", "The frame is heavier than it looks. Mirror-you rolls its eyes. You shoulder it and head for the cathedral.")})
    ]};

  N.cha_304a = {chapter: 3, scene: "burning_city", speaker: null, time: {h: 1},
    text: L("去大教堂的路上，每一扇黑掉的窗户里都有一个你，比你快一步地走着。\n火光里，它们穿着丝绸，你穿着破布。\n有一扇窗里的你停下来，回头冲你招手：快点。",
            "On the road to the cathedral, every darkened window holds a you, walking one step ahead.\nIn the firelight they wear silk. You wear rags.\nIn one window, the other you stops, turns, and beckons: hurry."),
    effects: {sanity: -5},
    choices: [
      C("跟上它", "Keep up with it", "cha_305", {result: L("你加快脚步。窗里的你满意地笑了。", "You walk faster. The you in the glass smiles, pleased.")})
    ]};

  N.cha_305 = {chapter: 3, scene: "cathedral", speaker: VELLUM, foe: "daemon_khorne", time: {h: 4},
    text: L("天亮前，维勒姆在大教堂里完成了仪式。地上的血圈先是发烫，然后开始吼叫。\n一个红色的东西爬了出来，拖着一把烧红的剑。它先杀的，是离它最近的信徒。\n蒂卡就站在血圈边上。",
            "Before dawn, Vellum completes the rite in the cathedral. The circle of blood on the floor grows hot, then begins to roar.\nA red thing climbs out, dragging a glowing blade. The first to die is the nearest believer.\nTikka is standing at the circle's edge."),
    alt: [
      {if: {flag: "guidedCathedral"}, add: L("维勒姆当众念了你的名字：“是这孩子领我们进来的。”", "Vellum speaks your name aloud: “This child led us in.”")},
      {if: {flag: "origin_scribe"}, add: L("头顶，缮写室烧着了。你抄过的经文像雪一样落下来。", "Overhead, the scriptorium is burning. The scripture you copied drifts down like snow.")}
    ],
    effects: {sanity: -10},
    codex: ["god_khorne", "chaos_daemon_khorne"],
    choices: [
      C("跪下", "Kneel", "cha_307", {effects: {corruption: 4, renown: 5, taint: {khorne: 5}, set: {kneltRed: true}}, result: L("你额头贴地。红色的东西从你身边走过，剑尖在你耳边擦出火星。它没有停。", "Forehead to the floor. The red thing walks past, its blade striking sparks beside your ear. It doesn't stop.")}),
      C("拖着蒂卡往外跑", "Drag Tikka out", "cha_305a", {effects: {hp: -10, sanity: 5, set: {savedTikka: true}}, result: L("热浪舔着你的后背。你把蒂卡推出大门，自己一头撞上门框，眼冒金星。", "Heat licks your back. You shove Tikka through the doors and slam into the frame, seeing stars.")}),
      C("冲它吼回去", "Roar right back at it", "cha_307", {effects: {renown: 10, hp: -15, taint: {khorne: 20}, set: {roaredKhorne: true}}, result: L("它一剑扫来，你飞出去撞上石柱。它歪着头看你，然后，像是笑了。", "One swing hurls you into a pillar. It tilts its head at you, and then, somehow, it grins.")})
    ]};

  N.cha_305a = {chapter: 3, scene: "burning_city", speaker: TIKKA, time: {h: 1},
    text: L("你们滚下台阶，趴在广场的灰里喘气。蒂卡的胳膊烫掉了一层皮，她却在笑。\n“你拖了我一回，”她说，“我记着。下回换我拖你。”\n身后的吼声停了。大教堂里，再也没有人唱歌。",
            "You tumble down the steps and lie gasping in the ash of the square. A layer of skin is gone from Tikka's arm, and she's laughing.\n“You dragged me out once,” she says. “I'll remember. Next time I drag you.”\nBehind you the roaring stops. Inside the cathedral, nobody sings any more."),
    choices: [
      C("扶她起来", "Help her up", "cha_307", {result: L("她靠着你站起来，比看上去重。天快亮了。", "She leans on you to stand, heavier than she looks. Dawn is close.")})
    ]};

  N.cha_306 = {chapter: 3, scene: "burning_city", speaker: KADE, time: {h: 8},
    grudgeLine: {npc: "kade", text: L("他的左袖烧焦了。“诗班点了我的名，”他说，“哨所也烧了。”", "His left sleeve is scorched. “The Choir named me,” he says. “Burned my post, too.”")},
    text: L("一道激光打穿了你的大腿。你倒在闸门前，被后面的人踩了过去。\n醒来时，你被铐在囚车里。对面坐着执法官凯德，在擦他的火焰喷射器。\n他看了看你手腕上的烙印。",
            "A las-bolt punches through your thigh. You fall at the gate and the crowd tramples over you.\nYou wake shackled in a prison wagon. Opposite sits Enforcer Kade, polishing his flamer.\nHe looks at the brand on your wrist."),
    alt: [
      {if: {all: [{flag: "kadeKnows"}, {notFlag: "fakedDeath"}]}, add: L("“又见面了，”他说。", "“We meet again,” he says.")},
      {if: {flag: "fakedDeath"}, add: L("他又看看你的脸，翻出一张打过叉的通缉单：“兵牌上那个死人。还活着。”", "He looks at your face, then pulls out a crossed-out wanted sheet. “The dead man from the tags. Still alive.”")}
    ],
    effects: {hp: -20},
    choices: [
      C("一言不发", "Say nothing", "cha_308", {grudge: {npc: "kade", effects: {hp: -6}, note: L("诗班点过凯德的名字；他猜得到是谁递的。", "The Choir named Kade. He can guess who passed it on.")}, result: L("凯德等了一会儿，耸耸肩，继续擦枪。囚车颠了一整夜。", "Kade waits, shrugs, and goes back to polishing. The wagon jolts on all night.")}),
      C("朝他吐口水", "Spit at him", "cha_308", {effects: {renown: 5, hp: -5, set: {spatKade: true}}, grudge: {npc: "kade", effects: {hp: -4}, note: L("你把他的名字递给了诗班；他下手更重。", "You handed his name to the Choir. He hits harder.")}, result: L("口水落在他的护目镜上。凯德慢慢擦掉，然后用枪托回了你一下。", "It lands on his visor. Kade wipes it off slowly, then answers with the butt of his flamer.")})
    ]};

  N.cha_308 = {chapter: 3, scene: "cathedral", speaker: STRAND, time: {h: 5},
    text: L("囚车停在一座白塔下。一个穿灰大衣的女人等着你，白手套，袖口一尘不染。\n“斯特兰德审判官。”凯德的声音里第一次有了害怕。\n“我只问一个问题，”她说，“谁教你们唱那首歌的？”",
            "The wagon stops beneath a white tower. A woman in a grey greatcoat waits: white gloves, spotless cuffs.\n“Inquisitor Strand,” Kade murmurs. For the first time, he sounds afraid.\n“One question,” she says. “Who taught you that song?”"),
    alt: [
      {if: {flag: "spatKade"}, add: L("她看了看你脸上新的伤：“有骨头。很好，骨头能撑得久一点。”", "She looks at the fresh bruise on your face. “Spine. Good. Spine lasts a little longer.”")}
    ],
    codex: ["imp_inquisition"],
    choices: [
      C("说出维勒姆的名字", "Give up Vellum's name", "cha_309", {effects: {sanity: -10, renown: -5, set: {namedVellum: true, wronged_vellum: true}}, result: L("斯特兰德把名字记进本子，像记一笔小账。“谢谢，”她说，“你可以休息了。”", "Strand writes the name in her notebook, like noting a small debt. “Thank you,” she says. “You may rest now.”")}),
      C("咬紧牙关", "Clench your jaw", null, R(0.5, "sanity", "cha_309", "cha_end_pyre", RR(L("她问了一整夜。天亮时，你咬碎了一颗牙，一个名字也没出口。", "She asks all night. By dawn you've cracked a tooth, and not one name has left your mouth."), L("第三夜，你开始说胡话。说出的不是维勒姆，是门后那四个名字。斯特兰德合上了本子。", "On the third night you begin to babble. Not Vellum's name: the four names behind the door. Strand closes her notebook."))))
    ]};

  N.cha_end_pyre = {chapter: 3, scene: "burning_city", speaker: STRAND, time: {d: 1},
    text: L("斯特兰德摘下一只手套，又仔细地戴回去。\n第二天，广场上立起了一根木桩。人们被要求观看。\n审判官全程没有看火，她在看人群里谁移开了眼睛。",
            "Strand removes one glove, then carefully puts it back on.\nThe next day a stake rises in the square. Attendance is mandatory.\nThe Inquisitor never watches the fire. She watches the crowd, noting who looks away."),
    ending: {kind: "bad", title: L("广场上的木桩", "The Stake in the Square"), cause: L("被审判庭处以火刑", "Burned by the Inquisition")}};

  N.cha_309 = {chapter: 3, scene: "burning_city", speaker: null, time: {h: 12},
    text: L("那天夜里，白塔着火了。不知是诗班来救人，还是审判官故意放你走。\n囚门开着。你一瘸一拐地走出去，没人拦你。你在烧着的街上找了一整天的诗班。\n你总觉得背后有一双白手套在记笔记。",
            "That night the white tower burns. Maybe the Choir came for you. Maybe the Inquisitor let you go on purpose.\nThe cell door is open. You limp out. Nobody stops you. You search the burning streets all day for the Choir.\nYou can't shake the feeling of a white glove taking notes behind you."),
    effects: {set: {strandWatching: true}},
    choices: [
      C("回到诗班", "Return to the Choir", "cha_307", {result: L("黄昏时，你看见了大教堂的台阶。", "At dusk, you see the cathedral steps.")})
    ]};

  N.cha_307 = {chapter: 3, scene: "burning_city", speaker: VELLUM, time: {h: 6},
    gather: L("大教堂台阶", "Cathedral steps"),
    grudgeLine: {npc: "vellum", text: L("维勒姆望了你一眼，笑了笑。从白塔活着出来的人，都说过名字。", "Vellum glances at you and smiles. Everyone who walks out of the white tower has said a name.")},
    text: L("天亮了。起义成了一半：中巢是你们的，上巢的闸门仍然紧闭。\n大教堂台阶上挤满了唱哑了的人，有人分水，有人传消息。维勒姆站在最高一级，望着天，像在等谁回信。",
            "Dawn. Half the uprising has worked: the mid-hive is yours, but the spire gates stay shut.\nThe cathedral steps are crowded with people who have sung themselves hoarse, passing water, passing news. Vellum stands on the top step, watching the sky as if awaiting a reply."),
    alt: [
      {if: {fromNode: ["cha_309"]}, text: L("第二天黄昏。中巢是诗班的，上巢的闸门仍然紧闭。\n大教堂台阶上挤满了唱哑了的人，有人分水，有人传消息。维勒姆站在最高一级，看见你从白塔方向走来。",
        "Dusk the next day. The mid-hive belongs to the Choir; the spire gates stay shut.\nThe cathedral steps are crowded with hoarse singers passing water and news. From the top step, Vellum watches you walk in from the direction of the white tower.")}
    ],
    choices: [
      C("问他在等谁", "Ask who he's waiting for", "cha_307a", {effects: {corruption: 3}, grudge: {npc: "vellum", effects: {sanity: -4}, note: L("维勒姆不责怪你，反而比责怪更重。", "Vellum doesn't blame you. That weighs more than blame.")}, result: L("“等回信，”维勒姆说，“来，我指给你看。”", "“A reply,” Vellum says. “Come. I'll show you.”")}),
      C("找个地方睡一觉", "Find somewhere to sleep", "cha_310", {effects: {hp: 10, sanity: 5}, grudge: {npc: "vellum", effects: {sanity: -5}, note: L("你说出过他的名字；梦里他一直在笑。", "You gave up his name. In your dreams he keeps smiling.")}, result: L("你在一辆烧空的车里睡着了。梦里没有门，也没有声音。之后的几天，城里一直在烧。", "You sleep in a burnt-out car. No door in your dreams, no voices. For days after, the city keeps burning.")})
    ]};

  N.cha_307a = {chapter: 3, scene: "burning_city", speaker: VELLUM, time: {h: 1},
    text: L("维勒姆带你爬上钟楼，指着天上那道紫色的伤痕。它在你出生前就横在那里了，大人说那是天的伤口。\n“战帅在那边，”他说，“一万年来他一直在敲门。我们烧，是为了让他看见我们。”",
            "Vellum leads you up the bell tower and points at the violet scar across the sky. It was there before you were born; grown-ups call it the sky's wound.\n“The Warmaster is on the other side,” he says. “For ten thousand years he's been knocking. We burn so that he sees us.”"),
    effects: {corruption: 3, set: {heardWarmaster: true}},
    codex: ["imp_great_rift", "chaos_abaddon"],
    choices: [
      C("望着那道伤痕", "Gaze at the scar", "cha_310", {result: L("烙印微微一烫。之后的几天，你常爬上来看它。", "Your brand warms faintly. In the days that follow, you often climb up to look at it.")})
    ]};

  N.cha_310 = {chapter: 3, scene: "burning_city", speaker: null, foe: "astartes", time: {d: 6}, eventRoll: 0.42,
    text: L("第六天，天上落下几颗燃烧的“流星”，裂开的舱门里走出蓝甲巨人。他们不问谁信什么，所过之处没有一个站着的人。\n他们身后，一个灰大衣的女人慢慢走着，记名字。\n诗班的歌声，第一次停了。",
            "On day six, burning “meteors” fall from the sky, and blue-armoured giants step from the pods. They ask no one what they believe; nothing stays standing in their wake.\nBehind them a woman in a grey greatcoat walks slowly, writing names in a notebook.\nFor the first time, the Choir falls silent."),
    alt: [
      {if: {flag: "strandWatching"}, add: L("是白塔里那个女人。她抬起头，正好看向你。", "It's the woman from the white tower. She looks up, straight at you.")}
    ],
    effects: {hp: -10, sanity: -10},
    codex: ["imp_astartes"],
    choices: [
      C("逃回污池最深处", "Flee to the deepest Sump", "cha_311", {result: L("你转身就跑。半路上，你在瓦砾里看见了维勒姆。他朝你伸出手，还在笑。", "You run. Halfway down you find Vellum in the rubble, reaching for you, still smiling.")}),
      C("留下来掩护撤退", "Stay and cover the retreat", "cha_310a", {effects: {renown: 10, hp: -15}, result: L("你朝最近的蓝甲巨人扔出燃烧瓶。气浪把你掀翻在地。", "You hurl a firebomb at the nearest blue giant. The blast throws you down.")})
    ]};

  N.cha_310a = {chapter: 3, scene: "burning_city", speaker: null, foe: "astartes", time: {h: 1},
    text: L("火灭了。那个巨人摘下烧裂的头盔，看了你一眼。\n是一张人的脸。疲惫，满是疤，比维勒姆年轻。他看你的样子，像看一场天气。\n他戴回头盔，走了。维勒姆倒在你脚边，半边身子烧焦了。",
            "The fire dies. The giant pulls off its cracked helm and glances at you.\nIt's a human face. Tired, scarred, younger than Vellum. He looks at you the way you'd look at weather.\nHe puts the helm back on and walks away. Vellum lies at your feet, half his body burned."),
    effects: {set: {sawMarineFace: true}},
    choices: [
      C("背起维勒姆", "Lift Vellum onto your back", "cha_311", {result: L("他轻得吓人。他在你耳边哼起了歌。", "He's frighteningly light. He starts humming in your ear.")})
    ]};

  N.cha_311 = {chapter: 3, scene: "underhive", speaker: VELLUM, time: {h: 10},
    grudgeLine: {npc: "vellum", text: L("他忽然不哼了，又轻声补了一句：“我不怪你说出我的名字。”", "He stops humming and adds, softly: “I don't blame you for giving my name.”")},
    text: L("你背着维勒姆往下爬。他很轻，轻得像一捆干柴，一路都在哼诗班的歌。\n身后的管道一根接一根被烧红。\n“别怕，”他在你耳边说，“诸神最喜欢的，就是这种时候。”",
            "You carry Vellum down on your back. He's light as a bundle of kindling, humming the Choir's hymn the whole way.\nBehind you, pipe after pipe glows red with flame.\n“Don't be afraid,” he whispers in your ear. “The gods love moments like this best.”"),
    effects: {hp: -5},
    choices: [
      C("继续往下爬", "Keep climbing down", "cha_312", {grudge: {npc: "vellum", effects: {sanity: -6}, note: L("维勒姆原谅了你，你的背却越来越沉。", "Vellum forgives you, and your back grows heavier.")}, result: L("他的哼唱越来越轻，你的背越来越沉。", "His humming grows fainter. Your back grows heavier.")}),
      C("把他放下，自己逃", "Set him down and save yourself", "cha_312", {effects: {hp: 10, sanity: -10, renown: -5, set: {leftVellum: true}}, result: L("你把维勒姆靠在管道边，独自往下爬。他没叫你，只是继续哼歌。", "You prop Vellum against a pipe and climb on alone. He doesn't call after you. He just keeps humming.")})
    ]};
  /* ============ Chapter 4 · The Four ============ */
  N.cha_312 = {chapter: 4, scene: "underhive", speaker: VELLUM, time: {d: 3}, bridge: true,
    text: L("你们往下爬了三天。身后，执法队用火把一层层封死管道；诗班剩下的人三三两两跟在后面。\n维勒姆在你背上断断续续地说：“回信会来的。有一位战帅在听。”\n污池最深处，比你记得的更暗。",
            "Three days of climbing down. Behind you, enforcers seal the pipes level by level with fire; the Choir's survivors trickle after you in twos and threes.\nOn your back, Vellum murmurs in pieces: “The reply will come. A Warmaster is listening.”\nThe deepest Sump is darker than you remember."),
    alt: [
      {if: {flag: "leftVellum"}, text: L("你独自往下爬了三天。身后，执法队用火把一层层封死管道；诗班剩下的人三三两两跟在后面。\n你一直听见维勒姆的哼唱，总在你身后同样远的地方，不近，也不远。\n污池最深处，比你记得的更暗。",
        "Three days climbing down alone. Behind you, enforcers seal the pipes with fire; the Choir's survivors trickle after you.\nAll the way you hear Vellum humming, always the same distance behind you. Never nearer. Never farther.\nThe deepest Sump is darker than you remember.")}
    ],
    effects: {sanity: 5},
    choices: [
      C("在最底下停下", "Stop at the very bottom", "cha_401", {result: L("这里连老鼠都没有。只有水声，和远处的火。", "Not even rats down here. Only dripping water, and fire far above.")})
    ]};

  N.cha_401 = {chapter: 4, scene: "underhive", speaker: VELLUM, time: {h: 6},
    text: L("维勒姆半边身子烧焦了，还在笑。\n“诸神都在看你，”他喘着气，“门后那四个声音，现在都在争你。选一个吧，孩子。或者……全都要。”\n他闭上了眼睛。四个方向，各有一样东西在等你。",
            "Half of Vellum is burned, and he is still smiling.\n“The gods are all watching you,” he wheezes. “Those four voices behind the door are fighting over you now. Choose one, child. Or... take them all.”\nHe closes his eyes. In four directions, something waits for you."),
    alt: [
      {if: {flag: "leftVellum"}, add: L("你把他留在了上面。可他比你先到了这里。你永远不知道他是怎么下来的。", "You left him up above. Yet he got here before you. You never learn how.")},
      {if: {flag: "openedDoor"}, add: L("那四个声音你认得。梦里，你替它们开过门。", "You know those four voices. In the dream, you opened the door for them.")},
      {if: {flag: "wantRevenge"}, add: L("血腥味那边最近，像在等你。", "The smell of blood is closest, as if waiting for you.")},
      {if: {flag: "wantBread"}, add: L("蒂卡的笑声那边最近，像在等你。", "Tikka's laughter is closest, as if waiting for you.")},
      {if: {flag: "wantChange"}, add: L("蓝光那边最近，像在等你。", "The blue light is closest, as if waiting for you.")}
    ],
    effects: {sanity: -5},
    codex: ["god_khorne", "god_nurgle", "god_tzeentch", "god_slaanesh"],
    choices: [
      C("顺着血腥味走", "Follow the smell of blood", "cha_402"),
      C("顺着蒂卡的笑声走", "Follow Tikka's laughter", "cha_403"),
      C("顺着闪烁的蓝光走", "Follow the flickering blue light", "cha_404"),
      C("顺着香水味走", "Follow the scent of perfume", "cha_405")
    ]};

  N.cha_402 = {chapter: 4, scene: "underhive", speaker: S("daemon_khorne", "红色的东西", "The Red Thing"), time: {h: 2},
    text: L("诗班的人说，大教堂血圈里爬出来的那个红色东西，跟着人潮下到了污池。现在它蹲在一堆头盔上，等你。\n它把烧红的剑插在你面前：“拿起来。为他杀。别问为什么。”",
            "The Choir says the red thing that crawled out of the cathedral's blood circle followed the crowds down into the Sump. Now it squats atop a heap of helmets, waiting for you.\nIt drives the glowing blade into the ground before you. “Pick it up. Kill for Him. Never ask why.”"),
    alt: [
      {if: {flag: "roaredKhorne"}, add: L("“你冲我吼过，”它的声音像铁砧，“我喜欢。”", "“You roared at me,” it says, voice like an anvil. “I liked that.”")},
      {if: {flag: "kneltRed"}, add: L("“你跪过，”它的声音像铁砧，“站起来。他不要跪着的。”", "“You knelt,” it says, voice like an anvil. “Stand up. He has no use for kneelers.”")},
      {if: {flag: "savedTikka"}, add: L("“你跑过一次，”它说，“这回别跑。”", "“You ran once,” it says. “Don't run this time.”")},
      {if: {flag: "bloodGift"}, add: L("它嗅了嗅你的手腕：入会那夜那滴血，它记得。", "It sniffs at your wrist. It remembers the drop of blood from initiation night.")}
    ],
    codex: ["god_khorne", "chaos_daemon_khorne"],
    choices: [
      C("握住剑柄", "Grip the hilt", "cha_406", {effects: {hp: 10, corruption: 10, renown: 10, taint: {khorne: 45}, set: {pK: true, devoted_khorne: true}}, result: L("剑柄烫穿你的掌心，你却握得更紧。心跳有了节拍：杀，杀，杀。你回到残众的藏身处，四天里谁也没说话。", "The hilt sears your palm and you grip harder. Your heartbeat finds a rhythm: kill, kill, kill. You return to the survivors' hideout; for four days nobody speaks.")}),
      C("转身离开", "Turn and walk away", "cha_406", {effects: {sanity: -5}, result: L("背后一声嗤笑，像铁砧落地。“下次，”它说，“你会跑回来的。”你回到残众的藏身处。", "Behind you, a snort like an anvil dropping. “Next time,” it says, “you'll come running.” You return to the survivors' hideout.")})
    ]};

  N.cha_403 = {chapter: 4, scene: "underhive", speaker: TIKKA, foe: "daemon_nurgle", time: {h: 2},
    text: L("蒂卡坐在一个温暖的泥塘边，身边围着一群哼歌的胖乎乎的小东西。她已经很胖了，笑得很满足。\n“老爷爷说，疼也是礼物，”她递来一个嗡嗡响的苹果，“吃了就再也不怕疼了。”",
            "Tikka sits by a warm, bubbling pool among chubby little things humming songs. She's grown very round, and smiles, content.\n“Grandfather says pain is a gift too,” she says, offering you an apple buzzing with flies. “Eat it, and you'll never fear hurting again.”"),
    alt: [
      {if: {flag: "sawMarks"}, add: L("她脖子上那三个圈，现在长满了全身。", "Those three rings on her neck now cover her whole body.")}
    ],
    codex: ["god_nurgle", "chaos_daemon_nurgle"],
    choices: [
      C("咬一口苹果", "Take a bite", "cha_406", {effects: {hp: 25, sanity: 10, corruption: 10, renown: 10, taint: {nurgle: 55}, set: {pN: true, devoted_nurgle: true}}, result: L("苹果又甜又软，带一点泥土味。你身上所有的伤，同时不疼了。小东西们为你鼓起了掌。", "The apple is sweet and soft, with a hint of soil. Every wound you have stops hurting at once. The little things applaud.")}),
      C("抱抱蒂卡，然后离开", "Hug Tikka, then leave", "cha_406", {effects: {sanity: -10, set: {leftTikka: true}}, result: L("她抱得很紧，身上又暖又潮。“你会回来的，”她说，“大家都会回来的。”她没有跟你走。", "She holds you tight, warm and damp. “You'll come back,” she says. “Everyone comes back.” She doesn't follow you.")}),
      C("把偷来的那瓶药喂给她", "Give her the medicine you stole", "cha_406", {require: {flag: "stoleMedicine"}, hideIfLocked: true, effects: {sanity: 5, renown: -5, taint: {nurgle: -20}}, result: L("她为了让你高兴，喝了。那一夜她又咳了，像个普通人那样咳。小东西们不唱了。", "She drinks it to please you. That night she coughs again, like an ordinary person. The little things stop singing.")})
    ]};

  N.cha_404 = {chapter: 4, scene: "underhive", speaker: IXARIL, foe: "daemon_tzeentch", time: {h: 2},
    text: L("维勒姆身边那个羽毛斗篷的人在等你，他的影子比他本人多三条胳膊。\n“伊克萨里尔，侍奉改变之主。”他说，“你接下来要说的每句话我都知道，但还是请说吧。我喜欢验证。”",
            "The feathered stranger from Vellum's side waits for you. His shadow has three more arms than he does.\n“Ixaril. I serve the Changer of Ways,” he says. “I know every word you're about to say. Please, say it anyway. I enjoy confirmation.”"),
    alt: [
      {if: {flag: "metIxaril"}, add: L("“识字的，”他说，“我在礼拜堂门口就等着今天了。”", "“The one who reads,” he says. “I've been waiting for today since the chapel door.”")},
      {if: {flag: "secretGift"}, add: L("“你献给诸神的那个秘密，”他压低声音，“我读过了。”", "“The secret you offered the gods,” he whispers. “I've read it.”")}
    ],
    codex: ["god_tzeentch", "chaos_daemon_tzeentch", "chaos_sorcerer"],
    choices: [
      C("教我看见未来", "Teach me to see the future", "cha_406", {effects: {sanity: -15, corruption: 7, renown: 10, taint: {tzeentch: 45}, set: {pT: true, devoted_tzeentch: true}}, result: L("他用一根羽毛点了点你的眼皮。你看见一千个明天，每一个都在冲你眨眼。", "He touches your eyelids with a feather. You see a thousand tomorrows, and every one of them winks at you.")}),
      C("那你猜我会怎么选？", "Then guess what I'll choose", "cha_406", {effects: {sanity: -5, set: {mockedIxaril: true}}, result: L("伊克萨里尔愣了半秒，然后大笑：“这个！我就知道你会问这个！”他的影子没笑。", "Ixaril freezes for half a second, then laughs. “This! I knew you'd ask exactly this!” His shadow doesn't laugh.")})
    ]};

  N.cha_405 = {chapter: 4, scene: "underhive", speaker: S("daemon_slaanesh", "镜中的你", "You, from the Mirror"), time: {h: 2},
    text: L("香味来自一间铺满丝绸的地窖。墙上有面金框镜子，镜子里的你先开了口，然后走了出来，比你更美，更从容。\n“你这辈子，从没被人好好看过一眼，”它轻声说，“让我看着你。永远。”",
            "The scent leads to a cellar draped in silk. On the wall hangs a gilt mirror; the you inside speaks first, then steps out, more beautiful and more at ease than you have ever been.\n“All your life, no one has ever truly looked at you,” it murmurs. “Let me look at you. Forever.”"),
    alt: [
      {if: {flag: "mirrorTouched"}, add: L("是行会长宅子里那一面。你的指尖到现在还有香水味。", "It's the one from the guild-master's house. Your fingertips still smell of its perfume.")},
      {if: {flag: "smashedMirror"}, add: L("它脸上有一道细细的裂痕，是你砸出来的。它不记仇，只是很伤心。", "There's a thin crack down its face, where you smashed it. It bears no grudge. It is only very sad.")}
    ],
    codex: ["god_slaanesh", "chaos_daemon_slaanesh"],
    choices: [
      C("让它看着你", "Let it look at you", "cha_406", {effects: {sanity: 10, corruption: 10, renown: 10, taint: {slaanesh: 55}, set: {pS: true, devoted_slaanesh: true}}, result: L("它的目光像温水，从头到脚把你洗了一遍。你第一次觉得，自己值得被看见。", "Its gaze moves over you like warm water. For the first time, you feel worth looking at.")}),
      C("用布盖上镜子", "Drape a cloth over the mirror", "cha_406", {effects: {sanity: -10, set: {veiledMirror: true}}, result: L("布下传来一声叹息，很轻，很失望。之后好几天，你一闭眼，它就在那儿等着。", "A sigh from under the cloth, soft and disappointed. For days after, whenever you close your eyes, it's waiting.")})
    ]};

  N.cha_406 = {chapter: 4, scene: "underhive", speaker: KADE, foe: "astartes", time: {d: 4}, eventRoll: 0.42,
    text: L("第四天，执法官和蓝甲巨人开始逐层清剿污池。火焰喷射器的嘶嘶声越来越近。\n凯德的声音在管道里回荡：“我记得那些烙印！一个一个，我都记得！”",
            "Day four. Enforcers and the blue giants begin purging the Sump level by level. The hiss of flamers draws closer.\nKade's voice echoes through the pipes: “I remember those brands! Every one of you!”"),
    alt: [
      {if: {flag: "wronged_kade"}, add: L("他左手少了两根指头，是诗班的“礼拜堂”留下的。", "He's missing two fingers on his left hand, a keepsake of the Choir's “chapel.”")}
    ],
    effects: {hp: -10},
    choices: [
      C("迎上去", "Go to meet him", null, R(0.35, "renown", "cha_407", "cha_410", RR(L("你从管道的阴影里冲出去，一撬棍砍断了他背上的燃料管。", "You burst from the pipe-shadows and sever the fuel line on his back with one swing."), L("你冲出去，正对上一只喷嘴。凯德比你快了半步。", "You charge straight into a nozzle. Kade is half a step quicker.")), {grudge: {npc: "kade", p: -0.10, note: L("诗班点过他的名，凯德这次不会犹豫。", "The Choir named him. Kade won't hesitate this time.")}})),
      C("沉进废水里躲着", "Sink into the waste-water and hide", "cha_408"),
      C("吹一声长哨", "Give one long whistle", "cha_409", {require: {flag: "whistleJoined"}, hideIfLocked: true}),
      C("吹一声长哨", "Give one long whistle", "cha_409", {require: [{flag: "whistleOwes"}, {notFlag: "whistleJoined"}, {notFlag: "whistleLocked"}], hideIfLocked: true})
    ]};

  N.cha_407 = {chapter: 4, scene: "underhive", speaker: KADE, time: {h: 1},
    text: L("燃料喷了凯德一身。他摔倒时，自己的引燃器擦出了火花。\n很快就结束了。他靠着管道坐下，摘下头盔，那张脸比你想象的年轻。\n“上巢……不会记得我，”他说，“也不会记得你。”",
            "Fuel drenches Kade. As he falls, his own igniter sparks.\nIt's quick. He slumps against a pipe and pulls off his helmet. His face is younger than you imagined.\n“The spire... won't remember me,” he says. “Or you.”"),
    effects: {renown: 10, corruption: 4, set: {kadeDead: true}},
    choices: [
      C("拿走他的头盔", "Take his helmet", "cha_411", {effects: {renown: 5, corruption: 4, taint: {khorne: 10}, set: {wearHelmet: true}}, result: L("头盔还带着他的体温。你戴上它。透过护目镜，污池看起来小多了。", "The helmet is still warm. You put it on. Through the visor, the Sump looks much smaller.")}),
      C("替他合上眼睛", "Close his eyes", "cha_411", {effects: {sanity: 5, set: {closedKadeEyes: true}}, result: L("你的指尖碰到他的眼皮，他已经不动了。你在他身边坐了一会儿。谁也不欠谁了。", "Your fingers brush his eyelids; he's already still. You sit beside him a while. Nobody owes anybody now.")})
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
    effects: {corruption: 7, hp: -5, taint: {nurgle: 15}},
    choices: [
      C("甩甩手上的水", "Shake the water off your hands", "cha_411")
    ]};

  N.cha_409 = {chapter: 4, scene: "underhive", speaker: WHISTLE, time: {h: 3},
    grudgeLine: {npc: "whistle", text: L("他挑的是最窄最臭的那条水道，一次也没回头等你。", "He picks the narrowest, foulest channel and never once looks back to wait.")},
    text: L("哨子从水里冒出头，回了你一声短哨：跟我来。\n他带你钻进只有变种人知道的水道。到了出口，他停下：“我不走了。这是我的家。”\n他把你推出去，转身游向了火光。",
            "Whistle surfaces and answers with one short note: follow me.\nHe leads you through channels only mutants know. At the exit he stops. “I'm staying. This is my home.”\nHe pushes you out, then turns and swims back toward the fire."),
    effects: {sanity: -5, hp: 10, set: {whistleGone: true}},
    choices: [
      C("别回头", "Don't look back", "cha_411", {grudge: {npc: "whistle", effects: {hp: -8}, note: L("你负过哨子；他领路，走的是最难的水道。", "You wronged Whistle. He leads you by the hardest channel.")}})
    ]};

  N.cha_411 = {chapter: 4, scene: "underhive", speaker: TIKKA, time: {d: 12},
    text: L("清剿结束了。诗班只剩下四十几个人，挤在污池最底下，等着有人告诉他们该做什么。\n他们都看着你。\n蒂卡把维勒姆的灰袍披在你肩上：“现在你是神父了。”",
            "The purge ends. Forty-odd Choir members remain, huddled at the bottom of the Sump, waiting for someone to tell them what to do.\nThey are all looking at you.\nTikka drapes Vellum's grey robe over your shoulders. “You're Father now.”"),
    alt: [
      {if: {anyFlag: ["leftVellum", "namedVellum"]}, text: L("清剿结束了。诗班只剩下四十几个人，挤在污池最底下。\n他们没有看你。有人知道你丢下过维勒姆，或者说出过他。\n蒂卡披上了维勒姆的灰袍，转头对你说：“你当我的右手。”",
        "The purge ends. Forty-odd Choir members remain, huddled at the bottom of the Sump.\nThey don't look at you. Some know you left Vellum behind, or gave up his name.\nTikka puts on Vellum's grey robe and turns to you. “You'll be my right hand.”")},
      {if: {flag: "namedNeighbor"}, add: L("老鞋匠也在里面，嗓子全哑了，一直看着你。", "The old cobbler is among them, voice gone, watching you the whole time.")},
      {if: {flag: "fakeName"}, add: L("老锈也活下来了。他教大家唱歌，比谁都虔诚。", "Old Rust survived too. He leads the singing, more devout than anyone.")}
    ],
    effects: {renown: 10, sanity: 5},
    choices: [
      C("带他们唱歌", "Lead them in song", "cha_412", {effects: {corruption: 4, renown: 5, set: {choirSang: true}}, result: L("你起了个头。四十几个沙哑的声音跟上来，在污池底下嗡嗡回响。很远的地方，有什么在听。", "You start the hymn. Forty hoarse voices follow, droning through the depths. Somewhere very far away, something is listening.")}),
      C("先分面包", "Share out the bread first", "cha_412", {effects: {hp: 10, sanity: 5, set: {choirLoyal: true}}, result: L("面包不多，每人只分到一小块。没人抢。蒂卡把她那块掰了一半给你。", "There isn't much; everyone gets a scrap. Nobody grabs. Tikka breaks hers in half and gives you one piece.")}),
      C("把金框卖了，换够所有人的面包", "Sell the gold frame: bread for everyone", "cha_412", {require: {flag: "goldFrame"}, hideIfLocked: true, effects: {hp: 15, sanity: 5, renown: 8, set: {choirLoyal: true}}, result: L("金框换回了三大袋面包。那天晚上，污池底下第一次每个人都吃饱了。他们看你的眼神变了。", "The frame buys three sacks of bread. That night, for the first time, everyone at the bottom of the Sump eats their fill. The way they look at you changes.")})
    ]};
  /* ============ Chapter 5 · The Warmaster's Call ============ */
  N.cha_412 = {chapter: 5, scene: "underhive", speaker: IXARIL, time: {d: 39}, bridge: true,
    gather: L("藏身处", "Hideout"),
    text: L("诗班残众在污池底的藏身处熬了三十九天。蓝甲巨人早走了，留下白塔和名单。\n四十几人挤着分面包、低声说话。第三十九夜，伊克萨里尔从管道里走出来：\n“你们的歌，战帅听见了。明晚，抬头看。”",
            "For thirty-nine days the Choir's remnant endures in a hideout at the bottom of the Sump. The blue giants left long ago, leaving only a white tower and a list.\nForty-odd people huddle, sharing bread, talking low. On the thirty-ninth night Ixaril steps out of a pipe.\n“The Warmaster heard your song. Tomorrow night, look up.”"),
    alt: [
      {if: {flag: "heardWarmaster"}, add: L("你想起钟楼上维勒姆指的那道伤痕。回信来了。", "You remember the scar Vellum pointed at from the bell tower. The reply has come.")},
      {if: {flag: "choirSang"}, add: L("这三十九夜，你们每夜都唱。伊克萨里尔说，正是这歌声引来了回信。", "You have sung every one of those nights. Ixaril says it was the singing that drew the reply.")},
      {if: {flag: "choirLoyal"}, add: L("有人把最后一块面包留给了你。", "Someone has saved the last piece of bread for you.")},
      {if: {flag: "wearHelmet"}, add: L("你一直戴着凯德的头盔。孩子们管你叫“执法官”。", "You've worn Kade's helmet the whole time. The children call you “Enforcer.”")},
      {if: {flag: "closedKadeEyes"}, add: L("凯德的尸体还靠在那根管道上。没人收，你也没再去看。", "Kade's body still leans against that pipe. Nobody has claimed it. You haven't gone back to look.")},
      {if: {all: [{flag: "wronged_kade"}, {notFlag: "kadeDead"}]}, add: L("传闻说，凯德被调去了上巢，再也没下来。", "Word is Kade was posted up-spire and never came down again.")},
      {if: {flag: "whistleGone"}, add: L("夜里，水道深处偶尔传来一声长哨。", "Some nights, a long whistle carries from deep in the channels.")}
    ],
    effects: {sanity: 5},
    choices: [
      C("等明天晚上", "Wait for tomorrow night", "cha_501", {result: L("那一天你们谁也没睡。蒂卡一直盯着管道口的那一小块天。", "Nobody sleeps that day. Tikka keeps staring at the scrap of sky above the pipe mouth.")})
    ]};

  N.cha_501 = {chapter: 5, scene: "burning_city", speaker: S("omen_black_crusade", "黑色舰队", "The Black Fleet"), time: {d: 1},
    text: L("次日夜里，那道挂了一百多年的紫色伤痕动了，在卡尔卡罗斯头顶张开口子。落下的战舰是黑的，船身画着睁开的眼。\n轨道站先灭了灯。所有屏幕亮起：“卡尔卡罗斯的诗班，你们的歌，战帅听见了。”",
            "The next night the violet scar that has hung there for over a century moves. It opens a mouth above Carcharos, and the warships falling from it are black, an open eye painted on each hull.\nThe orbital stations go dark first. Every screen lights up: “Choir of Carcharos, the Warmaster has heard your song.”"),
    alt: [
      {if: {flag: "heardWarmaster"}, add: L("维勒姆的战帅。他回信了。", "Vellum's Warmaster. He has answered.")}
    ],
    effects: {sanity: 5},
    codex: ["chaos_black_legion", "place_arcosa"],
    choices: [
      C("跪下欢呼", "Kneel and cheer", "cha_502", {effects: {corruption: 4, renown: 5}, result: L("你喊哑了嗓子。屏幕上那只眼睛，好像朝你这边转了一下。", "You cheer yourself hoarse. On the screens, the painted eye seems to turn your way.")}),
      C("先找地方躲起来", "Find cover first", "cha_501a", {effects: {hp: 5}, result: L("你缩到一截断墙后。一艘战舰落在两条街外，震得你牙根发酸。", "You duck behind a broken wall. A warship lands two streets away; the impact rattles your teeth.")})
    ]};

  N.cha_501a = {chapter: 5, scene: "ruins", speaker: null, time: {h: 1},
    text: L("从断墙缝里，你看见黑甲巨人把人群赶到一起。没跪下的，一枪一个。\n枪声停了你才出来，被人推进跪着的人群，成了最后一个。\n一只红色的目镜，在你身上停了一下。",
            "Through a crack in the wall you watch black-armoured giants herd the crowd together. Those who don't kneel are shot, one by one.\nYou come out only when the shooting stops, shoved into the kneeling crowd as the very last.\nA red eye-lens rests on you a moment."),
    effects: {renown: -3, set: {hidFromLegion: true}},
    choices: [
      C("跪下，低头", "Kneel. Head down.", "cha_502", {result: L("膝盖下面是还热的灰。", "The ash under your knees is still warm.")})
    ]};

  N.cha_502 = {chapter: 5, scene: "ruins", speaker: VORGATH, time: {h: 3},
    text: L("黑甲巨人落在废墟中央。他的盔甲很旧，伤痕比你的岁数还多。\n“沃加斯，黑色军团。”他扫视着跪着的人群，“战帅阿巴顿需要血肉、弹药和不怕死的人。你们是哪一种？”",
            "A black-armoured giant lands among the ruins. His armour is ancient, its scars outnumbering your years.\n“Vorgath. Black Legion.” He surveys the kneeling crowd. “Warmaster Abaddon needs flesh, ammunition, and people who don't fear death. Which are you?”"),
    alt: [
      {if: {flag: "hidFromLegion"}, add: L("他的目镜停在你身上：“还有你。刚才在躲什么？”", "His lenses settle on you. “And you. What were you hiding from?”")},
      {if: {flag: "wearHelmet"}, add: L("他看了看你夹在胳膊下的执法官头盔：“杀过狗？”", "He eyes the enforcer's helmet under your arm. “Killed a dog, have you?”")}
    ],
    codex: ["chaos_abaddon", "chaos_heretic_astartes"],
    choices: [
      C("我不怕死", "I don't fear death", "cha_503", {effects: {renown: 5, set: {fearless: true}}, result: L("沃加斯的头盔转向你，目镜红光一闪。周围跪着的人悄悄挪开了一步。", "Vorgath's helm turns toward you, eye-lenses flaring red. The kneeling people around you shuffle a step away.")}),
      C("我只是饿", "I'm just hungry", "cha_503", {effects: {sanity: 5, set: {honestHunger: true}}, result: L("人群里有人倒吸一口冷气。就在这时，你的肚子很响地叫了一声。", "Someone in the crowd gasps. Right on cue, your stomach growls, loudly.")})
    ]};

  N.cha_503 = {chapter: 5, scene: "ruins", speaker: VORGATH, time: {h: 1},
    text: L("沃加斯盯着你，忽然笑了，像碎石滚下山坡。\n“我曾经是他们那边的。”他敲敲胸甲上一块被刮掉的旧徽记，“一万年前，我们替帝皇征服了半个银河。后来才发现，他不配。”\n他扔给你一把沉重的手枪。",
            "Vorgath studies you, then laughs, like gravel tumbling downhill.\n“I was one of theirs once.” He taps a scraped-off emblem on his breastplate. “Ten thousand years ago we conquered half the galaxy for the Emperor. Then we learned he wasn't worth it.”\nHe tosses you a heavy pistol."),
    effects: {renown: 5, set: {pistol: true}},
    codex: ["chaos_horus_heresy"],
    choices: [
      C("问他战帅是什么样的人", "Ask what the Warmaster is like", "cha_504"),
      C("检查手枪", "Check the pistol", "cha_504b", {result: L("枪很沉，握把上刻着一个被划掉的名字。你数了数，还剩六发。", "The pistol is heavy, a scratched-out name on its grip. You count six rounds left.")})
    ]};

  N.cha_504 = {chapter: 5, scene: "ruins", speaker: VORGATH, time: {h: 1},
    text: L("“阿巴顿？他失败过十二次，”沃加斯说，“每一次，帝国都以为自己赢了。”\n他抬头看那道紫色的伤口：“第十三次，他把天撕开了。在你出生以前。”\n他说起战帅，不像崇拜，像在说一场没下完的雨。",
            "“Abaddon? He's failed twelve times,” Vorgath says. “Each time, the Imperium thought it had won.”\nHe looks up at the violet wound. “The thirteenth time, he tore the sky open. Before you were born.”\nIt isn't worship in his voice. More like talk of a rain that hasn't finished falling."),
    codex: ["chaos_black_crusade", "imp_great_rift", "place_cadia"],
    choices: [
      C("望着那道裂口", "Gaze at the rift", "cha_504b", {effects: {corruption: 3}, result: L("裂口深处有什么在动，像一只眼慢慢睁开。你腕上的烙印回应似的一烫。", "Something moves deep in the rift, like an eye slowly opening. The brand on your wrist flares warm in answer.")})
    ]};

  N.cha_504b = {chapter: 5, scene: "ruins", speaker: TIKKA, time: {h: 4},
    text: L("登陆艇停在广场上，舷梯放下来了。幸存者被一串串赶上去，诗班的残众也在里面。\n蒂卡挤到你身边，攥住你的袖子，跟小时候一样。\n你最后看了一眼卡尔卡罗斯。上巢还在烧，像一根插在天上的蜡烛。",
            "The landers sit in the square, ramps down. Survivors are driven up in strings, the Choir's remnant among them.\nTikka pushes in beside you and grips your sleeve, the way she always has.\nYou take a last look at Carcharos. The spire is still burning, a candle stuck into the sky."),
    alt: [
      {if: {flag: "leftTikka"}, text: L("登陆艇停在广场上。幸存者被一串串赶上舷梯，诗班残众也在里面。\n蒂卡不在队伍里。她站在一根管道口，身边围着哼歌的小东西，朝你挥挥手，没有过来。\n上巢还在烧，像一根插在天上的蜡烛。",
        "The landers sit in the square, ramps down. Survivors are driven up in strings, the Choir's remnant among them.\nTikka isn't in the line. You see her at a pipe mouth among her humming little things. She waves, and doesn't come.\nThe spire is still burning, a candle stuck into the sky.")}
    ],
    choices: [
      C("走上舷梯", "Walk up the ramp", "cha_505", {result: L("舷梯在你身后升起，像一张嘴闭上。", "The ramp rises behind you like a mouth closing.")})
    ]};

  N.cha_505 = {chapter: 5, scene: "ship_interior", speaker: S("guardsman", "独眼奴隶", "One-Eyed Thrall"), time: {d: 1},
    gather: L("底舱", "Lower hold"),
    text: L("你和几百个幸存者被塞进黑色战舰的底舱。有人祈祷，有人咬人，有人讲恐惧之眼的故事，讲着讲着就笑起来。\n一个独眼的老奴隶给你挪了块地方：“新来的？记住一条：别跟自己的影子说话。”",
            "You and hundreds of survivors are crammed into the black warship's lower hold. Some pray, some bite, some tell stories of the Eye of Terror and start laughing halfway through.\nA one-eyed old thrall makes room for you. “New? Remember one thing: don't talk to your own shadow.”"),
    codex: ["place_black_warship"],
    choices: [
      C("挨着他坐下，听他讲", "Sit by him and listen", "cha_508", {effects: {sanity: 5, set: {thrallFriend: true}}, result: L("他讲了一夜：哪些舱壁会咬人，哪个监工收贿，集市上什么不能买。你记住了一半。", "He talks all night: which bulkheads bite, which overseer takes bribes, what never to buy at the market. You remember half.")}),
      C("看看自己的影子", "Look at your shadow", "cha_508", {effects: {corruption: 4, sanity: -5}, result: L("你低下头。影子慢了半拍，才跟着你低头。独眼老人叹了口气，挪远了一点。", "You look down. Your shadow follows half a beat late. The one-eyed thrall sighs and shifts away.")})
    ]};

  N.cha_508 = {chapter: 5, scene: "ship_interior", speaker: VORGATH, time: {d: 3},
    text: L("底舱每天只送一桶食物。奴隶们为它打架，打赢的人吃饱，打输的人第二天就不见了。\n沃加斯靠着舱门看热闹，像看斗鸡。“这就是混沌，”他说，“没有配额，没有名单。只有想要，和拿到。”",
            "The lower hold gets one bucket of food a day. The slaves fight for it. Winners eat. Losers are gone the next morning.\nVorgath leans in the hatchway, watching like it's a cockfight. “This is Chaos,” he says. “No quotas, no lists. Only wanting, and taking.”"),
    choices: [
      C("去抢那桶食物", "Fight for the bucket", null, R(0.5, "hp", "cha_508a", "cha_506", RR(L("你挨了两拳，还了五拳。桶是你的了。", "You take two punches and give five. The bucket is yours."), L("一拳把你打翻在地，有人踩着你的手抢走了桶。你舔了舔指缝里的残渣。那天夜里，舱灯变成了紫色。", "A fist drops you. Someone treads on your hand and takes the bucket. You lick the scraps from your fingers. That night the hold lights turn violet.")), {effects: {hp: -5}})),
      C("把你的那份分给独眼老人", "Give your share to the one-eyed old man", "cha_506", {effects: {hp: -10, sanity: 10, renown: -5, set: {fedThrall: true}}, result: L("老人愣了很久才接过去。“傻孩子，在这条船上，善良活不过三天。”他吃得很慢。那天夜里，舱灯变成了紫色。", "The old man stares a long time before taking it. “Fool child. Kindness doesn't last three days on this ship.” He eats slowly. That night the lights turn violet.")}),
      C("夜里偷别人的", "Steal someone's at night", "cha_506", {effects: {hp: 10, corruption: 4}, result: L("你摸黑掰走半块干粮。第二天早上，那个人不见了。你没让自己去想他去了哪儿。", "In the dark you pinch half a ration. Next morning its owner is gone. You don't let yourself wonder where.")}),
      C("让诗班的人排好队一起分", "Have the Choir line up and share", "cha_506", {require: {flag: "choirLoyal"}, hideIfLocked: true, effects: {hp: 5, renown: 5}, result: L("四十几个诗班的人围成一圈，把桶护在中间。别的奴隶看了看，没敢上来。沃加斯哼了一声。", "Forty Choir members ring the bucket. The other slaves look, and don't dare. Vorgath grunts.")})
    ]};

  N.cha_508a = {chapter: 5, scene: "ship_interior", speaker: VORGATH, time: {h: 2},
    text: L("你蹲在桶边吃，手还在抖。一块肉干落在你面前。\n沃加斯不知什么时候走了过来：“你。打架像是真想要。”\n他没再说什么就走了。可从那天起，监工的鞭子绕开了你。",
            "You crouch by the bucket eating, hands still shaking. A strip of dried meat lands in front of you.\nVorgath has come over without you noticing. “You. You fight like you mean it.”\nHe walks off without another word. But from that day, the overseers' whips go around you."),
    alt: [
      {if: {flag: "honestHunger"}, add: L("“饿的人，”他走前补了一句，“打得最老实。”", "“The hungry ones,” he adds as he goes, “fight the most honestly.”")}
    ],
    effects: {hp: 10, renown: 3, set: {foughtHold: true}},
    choices: [
      C("把肉干揣起来", "Pocket the meat", "cha_506", {result: L("那天夜里，舱灯变成了紫色。独眼老人说：跃迁开始了，抓紧点。", "That night the hold lights turn violet. The one-eyed thrall says: the jump's starting. Hold on.")})
    ]};

  N.cha_506 = {chapter: 5, scene: "warp", speaker: null, time: {d: 60, warp: true}, eventRoll: 0.56, jump: L("亚空间跃迁：时间在这里不按常理走", "Warp transit: time runs wrong here"),
    text: L("跃迁开始了。舷窗没封，黑色军团不怕看。\n外面是颜色，是尖叫，是一座用眼睛砌成的城。你的影子站了起来，比你高一头，朝你鞠了一躬。\n舱壁上的计时器在倒着走。",
            "The jump begins. The viewports stay open; the Black Legion isn't afraid to look.\nOutside is colour, is screaming, is a city built of eyes. Your shadow stands up, a head taller than you, and bows.\nThe chronometer on the bulkhead runs backward."),
    effects: {sanity: -10},
    codex: ["chaos_warp"],
    choices: [
      C("向影子回礼", "Bow back to your shadow", "cha_507", {effects: {corruption: 7, renown: 5, taint: {tzeentch: 5}, set: {shadowBound: true}}, result: L("影子满意地直起身，回到你脚下。从此，它偶尔会比你先动。", "Satisfied, the shadow straightens and returns to your feet. From now on, it sometimes moves first.")}),
      C("闭上眼数心跳", "Shut your eyes and count heartbeats", "cha_507", {effects: {sanity: 5, corruption: -5}, result: L("一，二，三……数到四千七百下时，船身一震，舷窗外的尖叫停了。", "One, two, three... At four thousand seven hundred, the hull shudders and the screaming outside stops.")})
    ]};

  N.cha_507 = {chapter: 5, scene: "daemon_world", speaker: VORGATH, time: {d: 1, warp: true},
    text: L("这里没有太阳。天上挂着一只巨大的紫色眼睛，一直在看。\n地面是活的，会呼吸。沃加斯走下舷梯，深吸一口气，像终于回了家。\n“欢迎来到恐惧之眼，”他说，“在这里，你想要什么，就会变成什么。”",
            "There is no sun here. A vast violet eye hangs in the sky, always watching.\nThe ground is alive; it breathes. Vorgath walks down the ramp and inhales deeply, like a man home at last.\n“Welcome to the Eye of Terror,” he says. “Here, whatever you want is what you become.”"),
    codex: ["chaos_eye_of_terror", "place_daemon_world"],
    choices: [
      C("踏上会呼吸的土地", "Step onto the breathing ground", "cha_509", {result: L("地面在你脚下微微起伏，暖烘烘的，像踩在一头睡着的巨兽背上。", "The ground rises and falls beneath your boots, warm, like the back of some vast sleeping beast.")})
    ]};

  N.cha_509 = {chapter: 5, scene: "daemon_world", speaker: S("daemon_tzeentch", "集市商人", "Market Trader"), time: {d: 2},
    gather: L("集市", "bazaar"),
    text: L("码头边的集市挤满了叛徒、变种人和奴隶贩子，什么都能卖：盔甲、名字、昨天、明天。\n一个长着鸟嘴的商人拦住你：“好盔甲，只换你母亲的脸。你反正也快记不清了，对吧？”",
            "The bazaar by the docks teems with traitors, mutants and slavers, and everything is for sale: armour, names, yesterdays, tomorrows.\nA beaked trader blocks your path. “Fine armour. Costs only your mother's face. You barely remember it anyway, don't you?”"),
    codex: ["place_bazaar_eye"],
    choices: [
      C("成交", "Deal", "cha_601", {effects: {hp: 20, sanity: -15, corruption: 4, taint: {khorne: 5}, set: {soldMotherFace: true}}, result: L("鸟嘴在你额头上轻轻一啄。盔甲很合身。你努力回想母亲的样子，只想起一团模糊的暖光。", "The beak taps your brow once. The armour fits perfectly. You try to picture your mother and find only a warm blur.")}),
      C("用一年寿命换", "Pay with a year of your life", "cha_601", {effects: {hp: 10, renown: 5, set: {soldYear: true}}, result: L("商人从你腕上抽出一根灰线，缠上线团，递来一件旧皮甲。你忽然觉得有点累。", "The trader draws a grey thread from your wrist, spools it, and hands you an old leather jerkin. You feel suddenly tired.")}),
      C("让独眼老人替你讨价", "Let the one-eyed thrall haggle", "cha_601", {require: {flag: "thrallFriend"}, hideIfLocked: true, effects: {hp: 10, sanity: 5}, result: L("老人凑过去说了句什么。鸟嘴商人脸色一变，扔给你一件旧皮甲，什么都没要。", "The old man leans in and says something. The beaked trader's face changes; he tosses you an old jerkin and asks nothing.")}),
      C("走开", "Walk away", "cha_601", {effects: {sanity: 5}, result: L("商人在你身后喊：“明天还在这儿！或者昨天！”你没回头。", "The trader calls after you: “Here tomorrow! Or yesterday!” You don't look back.")})
    ]};

    /* ============ Chapter 6 · The Eye ============ */
  N.cha_601 = {chapter: 6, scene: "daemon_world", speaker: VORGATH, time: {y: 3, warp: true}, eventRoll: 0.49, bridge: true,
    text: L("在恐惧之眼里，时间是一种口味。你觉得过了三年，镜子说三十年，你的头发说三天。你学会了吃这里的东西。\n沃加斯把活下的奴隶带到试炼场：“战团要新勇士。每位神都有一扇门。过不去的，喂门。”",
            "In the Eye, time is a flavour. You feel three years have passed; the mirror says thirty; your hair says three days. You've learned to eat what grows here.\nVorgath herds the surviving slaves to the trial grounds. “The warband needs champions. Each god keeps a door. Whoever fails, feeds the door.”"),
    alt: [
      {if: {flag: "foughtHold"}, add: L("他朝你抬了抬下巴：“抢桶的那个。你先。”", "He jerks his chin at you. “The one who fought for the bucket. You first.”")},
      {if: {flag: "fearless"}, add: L("“不怕死的那个，”他说，“让我看看是不是真的。”", "“The one who doesn't fear death,” he says. “Let's see if it's true.”")},
      {if: {flag: "fedThrall"}, add: L("独眼老人没活过第一年。他把自己唯一的勺子留给了你。", "The one-eyed thrall didn't survive the first year. He left you his only spoon.")},
      {if: {notFlag: "leftTikka"}, add: L("蒂卡早就往腐木门那边去了，没回来，只托苍蝇给你捎话。", "Tikka went off toward the rotten door long ago and never came back. She sends you messages by fly.")}
    ],
    effects: {sanity: 10, hp: 15},
    codex: ["place_trial_grounds"],
    choices: [
      C("红铜之门", "The brass door", "cha_602"),
      C("腐木之门", "The rotten door", "cha_604"),
      C("水晶之门", "The crystal door", "cha_606"),
      C("丝绸之门", "The silken door", "cha_608")
    ]};

  N.cha_602 = {chapter: 6, scene: "daemon_world", speaker: S("sigil_khorne", "天上的声音", "Voice from Above"), foe: "daemon_khorne", time: {h: 1},
    text: L("铜门后是一座斗技场，看台上坐满没有头的观众，欢呼声却震耳欲聋。\n你的对手是另一个奴隶，一个跟你差不多大的男孩，手在抖。\n一个声音从天上砸下来：“铜座下只数头骨，不看脸。”",
            "Behind the brass door is an arena. The stands are packed with headless spectators, yet the cheering is deafening.\nYour opponent is another slave, a boy about your age. His hands are shaking.\nA voice crashes down: “The Brass Throne counts skulls. Not faces.”"),
    effects: {hp: -5},
    choices: [
      C("战斗", "Fight", "cha_603", {effects: {hp: -15, renown: 10, corruption: 7, sanity: -5, taint: {khorne: 30}}, result: L("男孩闭上了眼睛。你没有。", "The boy shuts his eyes. You don't.")}),
      C("把剑扔给男孩，赤手上", "Toss the boy your sword, fight barehanded", "cha_603", {require: {flag: "pK"}, effects: {hp: -20, renown: 15, corruption: 4, taint: {khorne: 15}}, result: L("男孩握着你的剑，抖得更厉害了。你笑着迎上去。看台上的欢呼翻了一倍。", "The boy grips your sword and shakes harder. You walk in smiling. The roar from the stands doubles.")}),
      C("拒绝战斗", "Refuse to fight", "cha_610", {effects: {renown: -10, sanity: 5, hp: -10}, result: L("你扔下剑。天上的声音沉默了。一只铜手把你扔出门外，像扔一袋垃圾。", "You drop the sword. The voice above falls silent. A brass hand flings you out the door like a sack of refuse.")})
    ]};

  N.cha_603 = {chapter: 6, scene: "daemon_world", speaker: null, foe: "daemon_khorne", time: {h: 1},
    text: L("结束时，看台上那些没有头的观众同时站了起来。\n你手腕上的烙印烧成了红铜色。一个声音在你的心跳里低吼：再来。再来。再来。\n你发现自己在笑，停不下来。",
            "When it's over, every headless spectator rises at once.\nThe brand on your wrist burns brass-red. A growl speaks inside your heartbeat: again. Again. Again.\nYou realise you're laughing, and can't stop."),
    effects: {sanity: -10, set: {markK: true, champion: true, devoted_khorne: true}, taint: {khorne: 10}},
    codex: ["chaos_daemon_prince"],
    choices: [
      C("走出斗技场", "Leave the arena", "cha_610")
    ]};

  N.cha_604 = {chapter: 6, scene: "daemon_world", speaker: S("daemon_nurgle", "园丁", "The Gardener"), time: {h: 1},
    text: L("腐木门后是一座花园，花在溃烂，苍蝇唱着摇篮曲。园丁是个大肚子恶魔，正在给一颗肿瘤浇水。\n“试炼很简单，”它和蔼地说，“染上园子里所有的病，然后告诉我，你感觉好极了。”",
            "Behind the rotten door lies a garden of weeping blossoms where flies hum lullabies. The gardener, a pot-bellied daemon, is watering a tumour.\n“The trial is simple,” it says kindly. “Catch every illness in the garden. Then tell me you feel wonderful.”"),
    choices: [
      C("深吸一口气", "Take a deep breath", "cha_605", {effects: {hp: -20, corruption: 7, renown: 10, taint: {nurgle: 30}}, result: L("空气又甜又稠，像灌了一口糖浆。你开始咳嗽，园丁慈爱地拍着你的背。", "The air is sweet and thick as syrup. You start coughing; the gardener pats your back, fondly.")}),
      C("我有老爷爷的祝福", "Grandfather already blessed me", "cha_605", {require: {flag: "pN"}, effects: {hp: 10, renown: 15, corruption: 4, taint: {nurgle: 15}}, result: L("园丁凑近闻了闻，高兴得肚子直颤：“自家孩子！”苍蝇们换了一首更欢快的歌。", "The gardener leans in, sniffs, and its belly wobbles with delight. “One of the family!” The flies switch to a merrier tune.")}),
      C("退出花园", "Back out of the garden", "cha_610", {effects: {renown: -10, sanity: -5}, result: L("你捂着嘴退出门外。园丁没拦，只是挥挥手：“下次吧，我们会再见的。”", "You back out with a hand over your mouth. The gardener only waves. “Another time. We'll meet again.”")})
    ]};

  N.cha_605 = {chapter: 6, scene: "daemon_world", speaker: S("daemon_nurgle", "园丁", "The Gardener"), time: {d: 7},
    text: L("你得了七种病，又好了七次。最后一次醒来，你感觉不到疼，也不觉得冷，只有一种温吞吞的满足。\n园丁拍拍你的头：“好孩子。老爷爷会照顾你的，永远。”\n你的烙印上长出了一圈小绿芽。",
            "You catch seven illnesses and recover seven times. The last time you wake, you feel no pain and no cold, only a warm, sluggish contentment.\nThe gardener pats your head. “Good child. Grandfather will look after you. Forever.”\nYour brand sprouts a ring of tiny green buds."),
    effects: {sanity: 10, set: {markN: true, champion: true, devoted_nurgle: true}, taint: {nurgle: 10}},
    codex: ["chaos_daemon_prince"],
    choices: [
      C("谢过园丁", "Thank the gardener", "cha_610")
    ]};

  N.cha_606 = {chapter: 6, scene: "daemon_world", speaker: IXARIL, foe: "daemon_tzeentch", time: {h: 1},
    text: L("水晶门后是一座无尽的图书馆。每本书写的都是你，每本的结局都不一样。\n伊克萨里尔坐在书堆上：“试炼是：挑一本，然后让它成真。”\n你注意到，有一本是空白的。",
            "Behind the crystal door is an endless library. Every book is about you, and every ending is different.\nIxaril sits atop a stack. “The trial: choose one, then make it true.”\nYou notice that one book is blank."),
    choices: [
      C("挑最辉煌的那本", "Pick the most glorious one", "cha_607", {effects: {sanity: -15, renown: 15, corruption: 7, taint: {tzeentch: 30}}, result: L("书很厚，每一页都是你的胜利。读到一半你才发现，结尾那几页被撕掉了。", "It's thick, every page a victory of yours. Halfway through, you notice the last few pages have been torn out.")}),
      C("拿起那本空白的", "Take the blank one", "cha_607", {effects: {sanity: -5, renown: 5, set: {blankBook: true}}, result: L("伊克萨里尔的笑容僵了半秒。你翻开第一页，上面慢慢浮出一行字：你翻开了第一页。你把它揣进怀里。", "Ixaril's smile stiffens. You open to the first page. Slowly, words surface: You open to the first page. You tuck it into your coat.")}),
      C("看穿伊克萨里尔的布局", "See through Ixaril's scheme", "cha_607", {require: {flag: "pT"}, effects: {renown: 15, sanity: -10, set: {sawPlan: true}, taint: {tzeentch: 15}}, result: L("你看见了：每本书的书脊里都藏着他的名字。他叹气，像被拆穿的魔术师：“好吧，算你一本。”", "You see it: his name hidden in the spine of every book. He sighs like an exposed conjurer. “Fine. One for you.”")}),
      C("认出书上的字迹", "Recognise the handwriting", "cha_607", {require: {flag: "origin_scribe"}, hideIfLocked: true, effects: {renown: 10, sanity: -10, taint: {tzeentch: 15}, set: {scribeLibrary: true}}, result: L("每一本都是你的笔迹。原来你抄过的，不止那一本。伊克萨里尔鼓掌：“老同事！”", "Every book is in your hand. That wasn't the only one you copied. Ixaril applauds. “An old colleague!”"),
        resultAlt: [{if: {flag: "readBook"}, text: L("每一本都是你的笔迹，每一本的第一页都是那首歌。你当年读下去的，原来是你自己。", "Every book is in your hand, and every first page is that song. What you read back then was yourself.")}]})
    ]};

  N.cha_607 = {chapter: 6, scene: "daemon_world", speaker: IXARIL, time: {h: 9, warp: true},
    text: L("你读完最后一页，书上的字全飞了起来，钻进你的眼睛。\n从此你偶尔能看见一秒后的事。代价是，你偶尔会忘掉一秒前的事。\n伊克萨里尔鼓掌：“精彩。正是我预料中的意外。”",
            "You finish the last page and every letter lifts off and burrows into your eyes.\nNow and then you see one second ahead. The price: now and then you forget the second before.\nIxaril applauds. “Marvellous. Precisely the surprise I foresaw.”"),
    effects: {set: {markT: true, champion: true, devoted_tzeentch: true}, taint: {tzeentch: 10}},
    codex: ["chaos_daemon_prince"],
    choices: [
      C("合上书", "Close the book", "cha_610")
    ]};

  N.cha_608 = {chapter: 6, scene: "daemon_world", speaker: S("daemon_slaanesh", "完美的主人", "The Flawless Host"), time: {h: 1},
    text: L("丝绸门后是一场永不结束的宴会。每道菜都比上一道更美味，每首曲子都让你想再听一遍。\n面容完美的主人举杯：“试炼是：离开这里。”\n门很近。你又看了一眼桌上的下一道菜。",
            "Behind the silken door is a feast that never ends. Each dish tastes better than the last; each song makes you want to hear it again.\nA host with a flawless face raises a glass. “The trial: leave.”\nThe door is close. You glance at the next dish."),
    alt: [
      {if: {flag: "veiledMirror"}, add: L("主人认出了你：“地窖里给我盖布的那个。”它的笑容里有一丝委屈。", "The host knows you. “The one who threw a cloth over me in the cellar.” Its smile holds a hint of hurt.")}
    ],
    choices: [
      C("再吃一道就走", "One more dish, then go", null, R(0.4, "sanity", "cha_609", "cha_end_feast", RR(L("这道菜美得让你想哭。你放下叉子，用尽全身力气站了起来。", "The dish is so good you could weep. You set down your fork and stand with everything you've got."), L("这道菜美得让你想哭。下一道已经端上来了，冒着热气。", "The dish is so good you could weep. The next one is already arriving, steaming.")))),
      C("立刻起身离开", "Stand up and leave at once", "cha_609", {effects: {sanity: -10, renown: 10}, result: L("离开桌子的每一步，都像从身上撕下一块。主人在你身后轻轻鼓掌。", "Every step from the table feels like tearing off a piece of yourself. Behind you, the host applauds softly.")}),
      C("我只想被看见", "I only want to be seen", "cha_609", {require: {flag: "pS"}, effects: {renown: 15, corruption: 7, sanity: 5, taint: {slaanesh: 25}}, result: L("所有客人同时放下刀叉，转头看你。你在他们的目光里站起来，轻飘飘地出了门。", "Every guest sets down their cutlery and turns to look at you. Bathed in their gaze, you rise and all but float out the door.")})
    ]};

  N.cha_end_feast = {chapter: 6, scene: "daemon_world", speaker: S("daemon_slaanesh", "完美的主人", "The Flawless Host"), time: {y: 1000},
    text: L("就一道。再一道。再一首。\n外面过去了一千年，宴会还在继续。你的盘子永远是满的，你的笑容永远是完美的。\n你再也想不起门在哪里。你也不想想起。",
            "Just one more dish. One more. One more song.\nOutside, a thousand years go by, and the feast goes on. Your plate is always full, your smile always perfect.\nYou can no longer remember where the door was. You don't want to."),
    ending: {kind: "bad", title: L("永恒的宴席", "The Endless Feast"), cause: L("永困色孽的宴席", "Trapped at Slaanesh's feast")}};

  N.cha_609 = {chapter: 6, scene: "daemon_world", speaker: null, time: {h: 2, warp: true},
    text: L("走出丝绸门时，你回头看了一眼。宴会上每个客人都长着你的脸，都在冲你举杯。\n你变得很美，美得连沃加斯都多看了一眼。\n但从此，什么味道都比不上那道你没吃的菜。",
            "Stepping out, you glance back. Every guest at the feast wears your face, and all of them raise a glass to you.\nYou've become beautiful, enough that even Vorgath looks twice.\nBut nothing will ever taste as good as the dish you left behind."),
    effects: {set: {markS: true, champion: true, devoted_slaanesh: true}, taint: {slaanesh: 15}},
    codex: ["chaos_daemon_prince"],
    choices: [
      C("不再回头", "Don't look back again", "cha_610")
    ]};

  N.cha_610 = {chapter: 6, scene: "daemon_world", speaker: VORGATH, time: {d: 2},
    text: L("沃加斯在门外等你，看了一眼你的手腕。\n“战帅要回现实宇宙了。目标是圣地世界阿尔德林，那里的大教堂供着一块圣人的骨头。”\n“我们要那块骨头？”\n“不。我们要他们看着它烧掉。”",
            "Vorgath waits outside, glancing at your wrist.\n“The Warmaster returns to realspace. Target: the shrine world Aldrin. Its cathedral keeps a saint's bone.”\n“We want the bone?”\n“No. We want them to watch it burn.”"),
    alt: [
      {if: {flag: "markK"}, add: L("他看见红铜色的烙印，咧了咧嘴：“血神的人。前排是你的。”", "He sees the brass-red brand and bares his teeth. “Blood God's. The front rank is yours.”")},
      {if: {flag: "markN"}, add: L("他看见烙印上的绿芽，退开半步：“离我的斧子远点。”", "He sees the green buds on your brand and steps back. “Keep away from my axe.”")},
      {if: {flag: "markT"}, add: L("他看见你的眼睛：“又一个看得见一秒后的。别跟巫师学坏。”", "He sees your eyes. “Another one who sees a second ahead. Don't learn the sorcerer's habits.”")},
      {if: {flag: "markS"}, add: L("他多看了你一眼，又嫌恶地移开目光。", "He looks at you a moment longer, then looks away in distaste.")},
      {if: {notFlag: "champion"}, add: L("“没有门要你，”他说，“那就去当前排的肉。”", "“No door wanted you,” he says. “Then you'll be meat in the front rank.”")}
    ],
    choices: [
      C("准备出发", "Make ready", "cha_611", {result: L("沃加斯咧嘴：“阿尔德林只是开胃菜。战帅主力要去一颗黄天的巢都，奥雷克斯。”五天后，你们被带上旗舰。", "Vorgath grins. “Aldrin's just the appetiser. The main host is bound for a yellow-skied hive called Aurex.” Five days later, you're taken aboard the flagship.")}),
      C("向诸神要更多的恩赐", "Ask the gods for more gifts", "cha_611", {effects: {corruption: 15, renown: 15, hp: 20, taint: {all: 5}, set: {mutated: true}}, result: L("你跪下，烙印像炉口一样张开。指甲变黑，瞳孔变成了竖的。沃加斯后退了半步。", "You kneel and the brand opens like a furnace mouth. Your nails blacken; your pupils turn to slits. Vorgath steps back half a pace.")})
    ]};

  N.cha_611 = {chapter: 6, scene: "ship_interior", speaker: S("omen_black_crusade", "战帅的影像", "The Warmaster's Image"), time: {d: 5}, jump: L("五天后，战帅的旗舰", "Five days later, the Warmaster's flagship"),
    gather: L("宣誓大厅", "Oath hall"),
    text: L("旗舰的宣誓大厅里，新勇士们排着长队，互相打量，低声议论着战帅。\n大厅尽头只有一道剪影，高大，沉默，一只手是巨大的利爪。\n他没说话。他不需要说话。轮到你了。",
            "In the flagship's oath hall, the new champions stand in a long queue, sizing each other up, murmuring about the Warmaster.\nAt the hall's end stands only a silhouette: tall, silent, one hand a monstrous talon.\nHe says nothing. He doesn't need to. It's your turn."),
    codex: ["chaos_abaddon"],
    choices: [
      C("向战帅宣誓", "Swear to the Warmaster", "cha_612", {effects: {renown: 10, set: {swornAbaddon: true}}, result: L("你念完誓词。剪影一动不动，但大厅里每一盏灯都暗了一瞬。", "You finish the oath. The silhouette doesn't move, but every lamp in the hall dims for an instant.")}),
      C("向你的神宣誓", "Swear to your god", "cha_612", {effects: {renown: 10, corruption: 7, taint: {all: 5}}, result: L("誓词是战帅的，念出的名字却是另一个。烙印烫得发白。剪影的利爪，似乎轻轻动了一下。", "The words are the Warmaster's; the name you speak is another. The brand burns white. The silhouette's talon twitches, perhaps.")}),
      C("嘴上宣誓，心里不算", "Swear with your lips, not your heart", "cha_612", {effects: {sanity: 5, set: {falseOath: true}}, result: L("誓词一字不差。走下台阶时，你听见身后有人轻轻笑了一声，分不清是谁。", "You speak every word perfectly. Walking down the steps, you hear a soft laugh behind you, and can't tell whose.")})
    ]};

  N.cha_612 = {chapter: 6, scene: "ship_interior", speaker: IXARIL, time: {d: 3},
    text: L("伊克萨里尔递给你一把匕首，刀刃里关着什么东西，隔着金属在轻轻敲门。\n“小恶魔，”他说，“不聪明，但很忠诚。你喂它，它就替你挡刀。战帅的军团里四位都有座位，它也有。”\n敲门声很有礼貌。",
            "Ixaril hands you a dagger. Something is shut inside the blade, tapping gently at the metal.\n“A minor daemon,” he says. “Not clever, but loyal. Feed it, and it takes blows meant for you. In the Warmaster's legion all Four have a seat; so does it.”\nThe tapping is very polite."),
    choices: [
      C("收下匕首", "Accept the dagger", "cha_613", {effects: {corruption: 10, hp: 20, set: {daemonBlade: true}, taint: {khorne: 10}}, result: L("匕首一入手，敲门声就停了，像小狗找到了主人。刀柄微微发热，舔了舔你的掌心。", "The moment it's in your hand the tapping stops, like a puppy finding its owner. The hilt warms and licks your palm."),
        resultAlt: [{if: {flag: "mockedIxaril"}, text: L("“你在污池让我笑过一回，”伊克萨里尔说，“这把算送你的。”匕首舔了舔你的掌心。", "“You made me laugh once, down in the Sump,” Ixaril says. “Consider it a gift.” The dagger licks your palm.")}]}),
      C("还给他", "Hand it back", "cha_613", {effects: {sanity: 5}, result: L("伊克萨里尔耸耸肩，把匕首收回袖子。“它会难过的，”他说，“它很少被拒绝。”", "Ixaril shrugs and tucks it back into his sleeve. “It'll sulk,” he says. “It isn't used to rejection.”")})
    ]};

  /* ============ Chapter 7 · The Raid ============ */
  N.cha_613 = {chapter: 7, scene: "ship_interior", speaker: VORGATH, time: {d: 30, warp: true}, bridge: true,
    text: L("亚空间里航行三十天。登陆舱里，沃加斯给战团讲最后一遍：\n“阿尔德林。圣地世界，大教堂里有圣骨，东墙后是军火库。战帅的主力去奥雷克斯，这颗星是我们的。”\n“落地以后，自己挑去哪儿。”",
            "Thirty days through the warp. In the drop-bay Vorgath briefs the warband one last time.\n“Aldrin. Shrine world. The saint's bone is in the cathedral; the armoury's behind the east wall. The Warmaster's host goes on to Aurex. This world is ours.”\n“Once you land, pick your own way.”"),
    alt: [
      {if: {flag: "swornAbaddon"}, add: L("“宣过誓的先下，”他把你推进第一艘登陆艇。", "“Sworn men go first,” he says, shoving you into the first lander.")},
      {if: {flag: "daemonBlade"}, add: L("匕首在路上要喂一次。它从你掌心喝了一小口，满足地不敲了。", "The dagger needs feeding once on the way. It sips from your palm and stops tapping, content.")},
      {if: {flag: "falseOath"}, add: L("伊克萨里尔隔着人群看你，笑了笑。", "Across the crowd, Ixaril looks at you and smiles.")}
    ],
    effects: {sanity: 5},
    choices: [
      C("系紧安全带", "Strap in", "cha_701", {result: L("登陆艇脱离母舰，像一块石头掉进火里。", "The lander drops from the ship like a stone into fire.")})
    ]};

  N.cha_701 = {chapter: 7, scene: "burning_city", speaker: null, time: {h: 6}, eventRoll: 0.42,
    text: L("阿尔德林，一颗遍地教堂的星球，连路灯都雕成了圣人。\n黑色军团的登陆艇像雨一样落下。城墙上，星界军的探照灯乱成一团。\n你跟着沃加斯冲进城，满街钟声，越敲越乱。",
            "Aldrin, a world of cathedrals; even the streetlamps are carved like saints.\nBlack Legion landers fall like rain. On the walls, the Astra Militarum's searchlights swing in panic.\nYou charge into the city behind Vorgath. Bells ring in every street, faster and faster, out of time."),
    codex: ["imp_guard", "place_aldrin"],
    choices: [
      C("冲向大教堂", "Charge the cathedral", "cha_702"),
      C("去抢军火库", "Raid the armoury", "cha_703")
    ]};

  N.cha_702 = {chapter: 7, scene: "cathedral", speaker: S("preacher", "老牧师", "Old Priest"), time: {h: 2},
    text: L("大教堂台阶上站着一个老牧师，手里的链锯剑比他还吵。他身后是几百个拿农具的信徒，唱着一首你早就听过的赞美诗。\n他们知道自己会死。没有一个人后退。",
            "On the cathedral steps stands an old priest with a chainsword louder than he is. Behind him, hundreds of faithful with farm tools sing a hymn you heard long ago.\nThey know they'll die. Not one of them steps back."),
    effects: {sanity: -10},
    codex: ["imp_ecclesiarchy"],
    choices: [
      C("冲上台阶", "Storm the steps", "cha_704", {effects: {hp: -15, renown: 10, corruption: 4, taint: {khorne: 5}}, result: L("链锯剑咬上你的肩甲，火星四溅。台阶上的歌声，一句一句地少了下去。", "The chainsword bites your shoulder guard in a spray of sparks. On the steps, the hymn loses a voice, then another.")}),
      C("跟着他们唱", "Sing along with them", "cha_702a", {effects: {sanity: 10, corruption: -10, renown: -10, taint: {all: -10}, set: {sangHymn: true}}, result: L("你一张嘴，词全回来了。老牧师看了你一眼，放低了链锯剑。你的烙印凉得像冰。", "You open your mouth and every word comes back. The old priest looks at you and lowers his chainsword. Your brand turns cold as ice.")}),
      C("念出他漏掉的那句经文", "Speak the verse he skipped", "cha_702a", {require: {flag: "origin_scribe"}, hideIfLocked: true, effects: {sanity: 10, corruption: -5, renown: -5, taint: {all: -10}, set: {sangHymn: true}}, result: L("这段经文你抄过一百遍。老牧师漏了一句，你替他念了出来。他愣住，放低了链锯剑。", "You copied this litany a hundred times. The old priest skips a line; you speak it for him. He stares, and lowers his chainsword."),
        resultAlt: [{if: {flag: "scribeLibrary"}, text: L("他手里的经书，是你的笔迹。你替他念出漏掉的那句。他愣住，放低了链锯剑。", "The hymnal in his hands is in your handwriting. You speak the line he skipped. He stares, and lowers his chainsword.")}]})
    ]};

  N.cha_702a = {chapter: 7, scene: "cathedral", speaker: S("preacher", "老牧师", "Old Priest"), time: {h: 1},
    text: L("老牧师侧身让开。信徒们分成两行，没有一个人碰你。\n“去吧，”他说，“我不知道你是谁。今晚，我也不想知道。”\n你穿过大教堂，走进后面一条安静的小巷。巷子里，有人在等你。",
            "The old priest steps aside. The faithful part into two rows; not one of them touches you.\n“Go,” he says. “I don't know who you are. Tonight, I don't want to.”\nYou cross the cathedral and step into a quiet alley behind it. Someone is waiting there."),
    choices: [
      C("走进小巷", "Walk into the alley", "cha_705", {result: L("身后的歌声还在继续。你走得很慢。", "Behind you the hymn goes on. You walk slowly.")})
    ]};

  N.cha_703 = {chapter: 7, scene: "ruins", speaker: S("guardsman", "年轻的星界军", "Young Guardsman"), time: {h: 2},
    text: L("军火库前，一个年轻的星界军被压在塌掉的掩体下，枪掉在一边。\n他看着你，眼里没有恨，只有累。“动手吧。我妈说异端都长着角，”他说，“你没有。”",
            "Outside the armoury, a young Guardsman lies pinned beneath a collapsed barricade, his rifle out of reach.\nHe looks at you. No hatred, only exhaustion. “Go on. Mum said heretics have horns,” he says. “You don't.”"),
    codex: ["imp_lasgun"],
    choices: [
      C("动手", "Do it", "cha_704", {effects: {corruption: 7, renown: 10, sanity: -10, taint: {khorne: 20}}, result: L("你动手了。他最后说的是“妈”。", "You do it. His last word is “Mum.”")}),
      C("把他从掩体下拖出来", "Drag him out from under the barricade", "cha_703a", {effects: {sanity: 5, renown: -5, set: {sparedGuard: true}}, result: L("他比看上去轻。你把他靠在墙边。", "He's lighter than he looks. You prop him against a wall.")}),
      C("拿走他的枪，走开", "Take his rifle and walk away", "cha_704", {effects: {renown: 3}, result: L("你捡起枪就走。身后，他在哭，也可能是在笑。", "You pick up the rifle and go. Behind you he's crying, or maybe laughing.")}),
      C("把旧团臂章塞给他", "Press your old regiment patch on him", "cha_703a", {require: {flag: "origin_deserter"}, hideIfLocked: true, effects: {sanity: 10, renown: -5, set: {sparedGuard: true}}, result: L("你把他拖出来，撕下藏在衣里的旧臂章：“跟你们团说，我死了。”", "You drag him free and tear out the patch hidden in your coat. “Tell your regiment I'm dead.”")})
    ]};

  N.cha_703a = {chapter: 7, scene: "ruins", speaker: S("guardsman", "黑尔下士", "Corporal Hale"), time: {h: 1},
    text: L("他喘匀了气：“黑尔，阿尔德林第九团。”\n“南塔有个撤离码头，只收神职和护送圣物的人。要是你哪天到了那儿，就说黑尔下士欠你一条命。”\n他一瘸一拐地跑了，跑出几步又回头：“你真的没有角。”",
            "He gets his breath back. “Hale. Aldrin Ninth.”\n“There's an evacuation dock at the south spire. Clergy and relic escorts only. If you ever get there, tell them Corporal Hale owes you his life.”\nHe limps off, then turns back after a few steps. “You really don't have horns.”"),
    choices: [
      C("记住那个码头", "Remember that dock", "cha_705", {result: L("你钻进一条小巷。巷子里很安静，太安静了。", "You duck into an alley. It's quiet. Too quiet.")})
    ]};

  N.cha_704 = {chapter: 7, scene: "burning_city", speaker: VORGATH, foe: "astartes", time: {h: 3},
    text: L("城市另一头亮起金色的火光，一支白金色盔甲的星际战士降落了。\n沃加斯舔了舔嘴唇：“老朋友。”他转向你，“拖住他们。活下来，你就是勇士。没活下来，你就是祭品。一样有用。”",
            "Golden fire blooms across the city: Space Marines in white and gold are landing.\nVorgath licks his lips. “Old friends.” He turns to you. “Hold them. Survive, you're a champion. Don't, you're an offering. Equally useful.”"),
    alt: [
      {if: {flag: "fearless"}, add: L("“你说过你不怕死，”他说，“证明给我看。”", "“You told me you don't fear death,” he says. “Prove it.”")},
      {if: {flag: "sawMarineFace"}, add: L("你想起卡尔卡罗斯那张头盔下的脸：累，满是疤，是人的脸。", "You remember the face under a helm on Carcharos: tired, scarred, human.")}
    ],
    effects: {hp: -10},
    codex: ["imp_astartes"],
    choices: [
      C("拖住他们", "Hold them", null, R(0.35, "renown", "cha_706", "cha_707", RR(L("你迎着金色的火光冲上去。之后的事，像被人剪掉了。", "You charge into the golden fire. What comes next is simply cut out."), L("一个白金色的巨人抬起枪，动作慢得近乎礼貌。", "A white-and-gold giant raises its bolter, slowly, almost politely.")))),
      C("用一秒后的眼睛找破绽", "Use your one-second sight to find an opening", "cha_706", {require: {flag: "markT"}, effects: {sanity: -5}, result: L("你看见一秒后的刀光，提前侧身。巨人的剑劈了个空。你却忘了自己刚才为什么在笑。", "You see the blade one second early and step aside. The giant's sword cleaves air. You forget why you were laughing a moment ago.")}),
      C("让影子先动", "Let your shadow move first", "cha_706", {require: [{flag: "shadowBound"}, {notFlag: "markT"}], hideIfLocked: true, effects: {sanity: -10, corruption: 4, taint: {tzeentch: 10}}, result: L("你的影子先扑了出去。巨人的剑劈进影子里，劈了个空。你从另一边钻了过去。", "Your shadow lunges first. The giant's sword cleaves into it and finds nothing. You slip past on the other side.")}),
      C("趁乱溜进小巷", "Slip into an alley in the chaos", "cha_705", {result: L("你贴着墙溜进一条小巷。身后，沃加斯骂了一句。", "You slide along the wall into an alley. Behind you, Vorgath curses.")})
    ]};

  N.cha_705 = {chapter: 7, scene: "ruins", speaker: STRAND, time: {h: 1},
    text: L("小巷里站着斯特兰德审判官，白手套，灰大衣。她的边缘像烛烟一样在抖：是投影。\n“我从卡尔卡罗斯就在看你，”她说，“说出沃加斯的登陆艇在哪，我给你一个干净的死法。”她是真诚的。",
            "In the alley stands Inquisitor Strand, white gloves, grey greatcoat. Closer, you see her edges trembling like candle smoke: a projection.\n“I've watched you since Carcharos,” she says. “Tell me where Vorgath's landers are and I'll grant you a clean death.”\nWhen she says “clean,” she means it."),
    alt: [
      {if: {flag: "strandWatching"}, add: L("“我放你出白塔，就是为了今天。”", "“I let you out of the white tower for today.”")},
      {if: {flag: "sangHymn"}, add: L("“你跟他们唱了。你还没完全属于他们。”", "“You sang with them. You're not entirely theirs yet.”")}
    ],
    codex: ["imp_inquisition", "imp_ordo_malleus"],
    choices: [
      C("告诉她", "Tell her", "cha_708", {effects: {sanity: 5, corruption: -5, renown: -10, set: {toldStrand: true, wronged_vorgath: true}}, result: L("你说出沃加斯的登陆艇在哪。斯特兰德点点头，你的手心上浮出一串烧出来的数字：“需要的时候，念出来。”", "You tell her where Vorgath's landers are. She nods, and numerals burn themselves into your palm. “Say these when you need to.”")}),
      C("拔枪", "Draw your pistol", null, R(0.35, "hp", "cha_708", "cha_707", RR(L("你开了枪。斯特兰德的身影晃了晃，像烟一样散了。", "You fire. Strand's shape wavers and disperses like smoke."), L("枪声招来了巷口白金色的盔甲。", "The shot draws white-and-gold armour to the alley mouth.")), {require: {flag: "pistol"}})),
      C("拔出那把会敲门的匕首", "Draw the knocking dagger", null, R(0.55, "hp", "cha_708", "cha_707", RR(L("匕首尖叫着刺穿投影。巷子尽头，有个真人闷哼了一声。", "The dagger shrieks through the projection. At the alley's end, a real person grunts."), L("匕首扑了个空。巷口亮起了白金色的盔甲。", "The dagger strikes nothing. White-and-gold armour fills the alley mouth.")), {require: {flag: "daemonBlade"}, hideIfLocked: true, effects: {taint: {khorne: 10}}})),
      C("转身就跑", "Turn and run", "cha_707", {effects: {hp: -5}, result: L("你撞翻一排木箱冲出小巷，正好一头扎进街上的交火里。", "You crash through a stack of crates out of the alley, straight into the crossfire in the street.")})
    ]};

  N.cha_706 = {chapter: 7, scene: "burning_city", speaker: VORGATH, foe: "astartes", time: {h: 2},
    text: L("你用身体卡住白金色巨人的剑，沃加斯的斧子从你肩上劈下去。\n巨人倒在你脚边，头盔滚出去很远。沃加斯把一块砸烂的肩甲挂在你背上。\n“勇士，”他说，“你没退。”这是他第一次不叫你“你”。",
            "You jam your body against a white-and-gold giant's sword, and Vorgath's axe comes down over your shoulder.\nThe giant falls at your feet, its helm rolling far away. Vorgath hangs a battered pauldron on your back.\n“Champion,” he says. “You didn't step back.” The first time he's called you anything but “you.”"),
    effects: {renown: 15, hp: -10, set: {champion: true, slewMarine: true}},
    choices: [
      C("扛起肩甲", "Shoulder the pauldron", "cha_708", {result: L("之后三天，你跟着沃加斯在城里搜那块圣骨。", "For three days after, you follow Vorgath through the city hunting the bone.")})
    ]};

  N.cha_707 = {chapter: 7, scene: "ruins", speaker: TIKKA, foe: "daemon_nurgle", time: {h: 4},
    text: L("爆弹在你身边炸开。你倒在瓦砾里，听着第一批登陆艇轰鸣着飞走。\n一双胖乎乎的手把你拖进下水道。是蒂卡，她跟着一船苍蝇也来了，大得像头牛，浑身嗡嗡作响。\n“老爷爷从不丢下任何人，”她说。",
            "A bolt-round bursts beside you. Lying in the rubble, you hear the first landers roar away.\nA pair of plump hands drags you into the sewers. Tikka: she came too, on a ship full of flies. She's as big as an ox now, and hums like a hive.\n“Grandfather never leaves anyone behind,” she says."),
    alt: [
      {if: {flag: "leftTikka"}, add: L("她从卡尔卡罗斯一路追来。“我说过你会回来的。”", "She followed you all the way from Carcharos. “I told you you'd come back.”")},
      {if: {flag: "savedTikka"}, add: L("“你拖过我一回，”她说，“这回换我拖你。”", "“You dragged me once,” she says. “Now it's my turn.”")},
      {if: {flag: "sawMarks"}, add: L("你一眼认出她身上的三个圈。", "You know those three rings on her at a glance.")}
    ],
    effects: {hp: -20, sanity: 5, corruption: 4},
    choices: [
      C("靠在她身上", "Lean against her", "cha_708", {effects: {hp: 10, corruption: 4, taint: {nurgle: 15}, set: {nurgleHealed: true}}, result: L("她很软，很暖，嗡嗡声像摇篮曲。你的伤口发痒，然后开始愈合。愈合得太快了。", "She's soft and warm; her humming is a lullaby. Your wounds itch, then start to close. Too fast.")}),
      C("挣扎着自己走", "Struggle on by yourself", "cha_708", {effects: {hp: -5}, result: L("你推开她的手，扶着墙一步一步挪。蒂卡跟在后面，不说话，也不走远。三天后，你找回了战团。", "You push her hands away and inch along the wall. Tikka follows, silent, never far. Three days later, you find the warband.")})
    ]};

  N.cha_708 = {chapter: 7, scene: "ruins", speaker: IXARIL, time: {d: 3}, eventRoll: 0.42, jump: L("三天后，阿尔德林烧成了灰", "Three days later, Aldrin is ash"),
    text: L("三天后，城市烧成了白灰。圣人的骨头没了，钟声也没了。\n伊克萨里尔的笑容突然消失，他盯着天空：“有东西要来了。我看不见它的未来。”\n这是你第一次见他害怕。",
            "Three days later the city is white ash. The saint's bone is gone, and so are the bells.\nIxaril's smile vanishes. He stares at the sky. “Something is coming. I cannot see its future.”\nIt's the first time you've seen him afraid."),
    alt: [
      {if: {flag: "sawPlan"}, add: L("你在图书馆看穿过他。所以这回，他对你说的是实话。", "You saw through him in the library. So this time, he tells you the truth.")},
      {if: {flag: "falseOath"}, add: L("“宣誓大厅里那声笑，”他低声说，“是我。我喜欢撒谎的人。”", "“That laugh in the oath hall,” he murmurs. “It was me. I like liars.”")}
    ],
    choices: [
      C("问他看见了什么", "Ask what he sees", "cha_709"),
      C("去找沃加斯", "Go find Vorgath", "cha_710")
    ]};

  N.cha_709 = {chapter: 7, scene: "throne_light", speaker: S("omen_emperor", "金色的王座", "The Golden Throne"), time: {h: 1, warp: true}, jump: L("幻象：伊克萨里尔让你看见的东西", "Vision: what Ixaril shows you"),
    text: L("伊克萨里尔抓住你的手腕。你看见了：一片金光，光的中心坐着一具干枯的尸体，眼睛睁着。\n它在看你。你从没被这样看过——不是愤怒，不是怜悯，是比恨更冷的东西。",
            "Ixaril seizes your wrist. You see it: a field of golden light, and at its heart a withered corpse upon a throne, eyes open.\nIt is looking at you. You've never been looked at like this. Not anger, not pity. Something colder than hate."),
    effects: {sanity: -15},
    codex: ["imp_emperor", "place_terra"],
    choices: [
      C("挣脱", "Tear yourself free", "cha_710", {result: L("你挣开他的手，跪在地上干呕。伊克萨里尔一句话也没说，转身走了。", "You wrench free and retch on your knees. Ixaril says nothing and walks away.")})
    ]};

  N.cha_710 = {chapter: 7, scene: "ruins", speaker: VORGATH, time: {h: 6},
    text: L("沃加斯在擦他的斧子。“审判庭的舰队到了。战帅的旗舰在星系边缘等最后一批登陆艇。我们断后。”\n他看了你一眼：“你现在溜走，找个下巢躲一辈子，没人会知道。”",
            "Vorgath is cleaning his axe. “The Inquisition's fleet has arrived. The Warmaster's flagship is waiting at the system's edge for the last landers. We're the rearguard.”\nHe glances at you. “You could slip away now. Find some underhive and hide for the rest of your life. No one would know.”"),
    choices: [
      C("我留下", "I'm staying", "cha_711", {effects: {renown: 10, set: {stayedRearguard: true}}, result: L("沃加斯哼了一声，把磨刀石扔给你。这大概是他表示敬意的方式。", "Vorgath grunts and tosses you the whetstone. That's probably his idea of respect.")}),
      C("溜走", "Slip away", "cha_711", {effects: {renown: -10, set: {fled: true, wronged_vorgath: true}}, result: L("你对沃加斯点点头，往后退。他没抬头：“聪明。”听不出是夸你还是骂你。", "You nod to Vorgath and back away. He doesn't look up. “Smart.” You can't tell if it's praise or insult.")}),
      C("向诸神祈求更多力量", "Pray to the gods for more power", "cha_711", {effects: {corruption: 15, renown: 15, hp: 15, taint: {all: 5}, set: {mutated: true}}, result: L("祈祷还没说完，回答就来了。指甲变黑，牙齿变尖。沃加斯挑了挑眉。", "Before you finish praying, the answer arrives. Your nails blacken, your teeth sharpen. Vorgath raises an eyebrow.")})
    ]};

  N.cha_711 = {chapter: 7, scene: "ruins", speaker: TIKKA, time: {h: 2},
    gather: L("病患营地", "Sick camp"),
    text: L("蒂卡在阿尔德林的废墟里搭了个病患营地，几十个病人躺着，低声说着这颗星球的事。她不跟船走了。\n“这里的人病得好苦，”她说，“老爷爷让我留下来照顾他们。”\n她记得你爱吃哪种面包。",
            "Tikka has set up a sick camp in Aldrin's ruins; dozens of patients lie murmuring about their dying world. She isn't leaving with the ships.\n“The people here are so sick and sad,” she says. “Grandfather wants me to stay and look after them.”\nShe remembers which bread you like."),
    alt: [
      {if: {flag: "soldMotherFace"}, add: L("她问你妈妈长什么样。你张了张嘴，答不上来。", "She asks what your mother looked like. You open your mouth, and can't answer.")},
      {if: {flag: "nurgleHealed"}, add: L("“你的伤是我治的，”她说，“留下来帮我吧。”", "“I healed you,” she says. “Stay and help me.”")}
    ],
    effects: {sanity: -5},
    choices: [
      C("抱抱她", "Hug her", "cha_801", {effects: {sanity: 5, corruption: 3, taint: {nurgle: 10}}, result: L("她身上有泥土、草药和腐烂的甜味。“记得吃饭，”她说，跟从前一样。", "She smells of soil, herbs and sweet rot. “Remember to eat,” she says, the way she always did.")}),
      C("劝她一起走", "Beg her to come", "cha_801", {effects: {sanity: -5}, result: L("她笑着摇头，把一块面包塞进你手里。还是你爱吃的那种。", "She smiles, shakes her head, and presses a bread roll into your hand. Your favourite kind.")}),
      C("求她带你找条出路", "Ask her to show you a way out", "cha_711a", {require: {flag: "savedTikka"}, hideIfLocked: true, effects: {sanity: 5}, result: L("蒂卡想了想，点头：“你拖过我一回。下水道我熟，跟紧了。”", "Tikka thinks, then nods. “You dragged me out once. I know the sewers. Stay close.”")}),
      C("求她带你找条出路", "Ask her to show you a way out", "cha_711a", {require: [{flag: "taughtTikka"}, {notFlag: "savedTikka"}], hideIfLocked: true, effects: {sanity: 5}, result: L("蒂卡想了想，点头：“下水道我熟。跟紧了。”", "Tikka thinks, then nods. “I know the sewers. Stay close.”")})
    ]};

  /* ============ Chapter 8 · Grey Light ============ */
  N.cha_711a = {chapter: 8, scene: "ruins", speaker: TIKKA, time: {h: 2}, bridge: true,
    text: L("两小时后，天上出现一圈银光，像一枚巨大的硬币。\n蒂卡领你在下水道里走，一直走到南塔撤离码头底下的一个井盖。她停住了：“我的病人还在等我。”\n她把你推了上去，像小时候推你钻管道那样。",
            "Two hours later a ring of silver light appears in the sky, like an enormous coin.\nTikka leads you through the sewers to a manhole beneath the south spire's evacuation dock. There she stops. “My patients are waiting.”\nShe pushes you up, the way she used to push you into the pipes."),
    effects: {set: {tikkaEscort: true}},
    choices: [
      C("爬上去", "Climb up", "cha_802", {result: L("井盖下面最后一眼，她在冲你挥手。", "Your last look down the hole: she's waving.")})
    ]};

  N.cha_801 = {chapter: 8, scene: "burning_city", speaker: S("omen_purge", "斯特兰德的声音", "Strand's Voice"), time: {h: 2}, bridge: true,
    text: L("两小时后，天上出现一圈银光，像一枚巨大的硬币。\n截获的帝国频道里，斯特兰德在对守军说话：“阿尔德林已不可挽回。灭绝令六小时后执行。神职与圣物护送者去南塔码头撤离。其余的交给灰骑士。”",
            "Two hours later a ring of silver light appears in the sky, like an enormous coin.\nOn an Imperial channel the warband has captured, Strand addresses the defenders. “Aldrin is beyond redemption. Exterminatus in six hours. Clergy and relic escorts evacuate from the south spire dock. The rest, leave to the Grey Knights.”"),
    alt: [
      {if: {flag: "fled"}, add: L("你已经离开了沃加斯。南塔码头，是你唯一想得到的地方。", "You've already left Vorgath. The south spire dock is the only place you can think of.")},
      {if: {flag: "sparedGuard"}, add: L("南塔码头。黑尔下士说过的那个。", "The south spire dock. The one Corporal Hale told you about.")}
    ],
    effects: {sanity: -10},
    codex: ["imp_exterminatus", "imp_grey_knights", "imp_ordo_malleus", "imp_inquisition"],
    choices: [
      C("扔掉武器，去南塔码头", "Ditch your weapon, head for the south dock", "cha_802", {effects: {renown: -5}, result: L("你把武器扔进一个弹坑，混进往南走的人流。", "You drop your weapon in a shell crater and join the stream of people heading south.")}),
      C("回到沃加斯身边", "Return to Vorgath's side", "cha_808"),
      C("独自躲进圣人墓穴", "Hide alone in the saint's crypt", "cha_806")
    ]};

  N.cha_802 = {chapter: 8, scene: "ruins", speaker: S("guardsman", "审判庭士兵", "Inquisition Trooper"), time: {h: 2},
    gather: L("撤离码头", "Evac dock"),
    text: L("你用泥巴盖住烙印，挤进南塔撤离码头的人群：朝圣者、神父、抱圣物箱的人。\n一个审判庭士兵正用一盏小灯照每个人的眼睛。人群里有人祈祷，有人交换消息。\n还有十个人，就轮到你了。",
            "You smear mud over the brand on your wrist and squeeze into the crowd at the south spire's evac dock: pilgrims, priests, people clutching reliquaries.\nAn Inquisition trooper shines a little lamp into each person's eyes. Around you, people whisper prayers and trade rumours.\nTen more people, then it's you."),
    alt: [
      {if: {all: [{flag: "commissarKnows"}, {notFlag: "fakedDeath"}]}, add: L("门边的名单上有一张旧团的通缉照，那张脸是你。", "The list by the gate carries a regimental wanted picture. The face is yours.")},
      {if: {flag: "fakedDeath"}, add: L("你在门边的名单上找到了自己的名字，后面写着：已死亡。", "On the list by the gate you find your own name. Beside it: deceased.")},
      {if: {flag: "mutated"}, add: L("你把变黑的指甲藏进袖子。它们藏不住多久。", "You hide your blackened nails in your sleeves. They won't stay hidden long.")}
    ],
    choices: [
      C("低头，平静呼吸", "Head down. Breathe slowly.", null, R(0.45, "sanity", "cha_end_vanish", "cha_end_purged", RR(L("小灯照进你的眼睛。一秒，两秒。士兵挥挥手：“下一个。”", "The lamp shines into your eyes. One second. Two. The trooper waves you on. “Next.”"), L("小灯照进你的眼睛。士兵的手停住了。你的瞳孔里，有什么在回望他。", "The lamp shines into your eyes. The trooper's hand freezes. Something in your pupils is looking back at him.")), {require: {notFlag: "mutated"}})),
      C("低头，把手藏好", "Head down. Hide your hands.", null, R(0.25, "sanity", "cha_end_vanish", "cha_end_purged", RR(L("小灯照进你竖着的瞳孔。士兵眨了眨眼，以为是灯坏了：“下一个。”", "The lamp shines into your slitted pupils. The trooper blinks, blames the lamp. “Next.”"), L("士兵抓住你的袖子一拉。黑色的指甲露了出来。", "The trooper tugs your sleeve. The black nails show.")), {require: {flag: "mutated"}, hideIfLocked: true})),
      C("说黑尔下士欠你一条命", "Say Corporal Hale owes you his life", "cha_end_vanish", {require: {flag: "sparedGuard"}, hideIfLocked: true, result: L("士兵愣住，回头喊了一声。黑尔一瘸一拐地挤过来，看了你一眼：“他是我的人。”你上了船。", "The trooper hesitates and calls back. Hale limps through the crowd and looks at you. “Mine.” You board.")}),
      C("报出斯特兰德给你的数字", "Speak the numerals Strand gave you", "cha_end_vanish", {require: {flag: "toldStrand"}, hideIfLocked: true, result: L("士兵听完，脸色一白，亲手把你推上了船，一个字也没多问。", "The trooper hears it, goes pale, and personally shoves you aboard without another word.")})
    ]};

  N.cha_808 = {chapter: 8, scene: "ruins", speaker: IXARIL, time: {h: 3},
    grudgeLine: {npc: "vorgath", text: L("沃加斯没抬头，把斧子换到了离你更远的那只手。", "Vorgath doesn't look up. He moves the axe to the hand farther from you.")},
    text: L("还剩三个小时。断后的人守在大教堂的废墟里。\n伊克萨里尔在地上画圈，画了又擦。沃加斯在磨斧子。\n早已停了的钟，突然自己响了一声。",
            "Three hours left. The rearguard holds the cathedral ruins.\nIxaril draws circles on the ground, then rubs them out. Vorgath sharpens his axe.\nA bell that stopped long ago rings once, all by itself."),
    alt: [
      {if: {flag: "stayedRearguard"}, add: L("沃加斯朝左边偏了偏头：你的位置。", "Vorgath tilts his head to his left: your place.")}
    ],
    effects: {sanity: -5},
    choices: [
      C("握紧武器", "Grip your weapon", "cha_809", {effects: {renown: 3}, grudge: {npc: "vorgath", effects: {sanity: -5}, note: L("你负过沃加斯；他的沉默比斧子更沉。", "You wronged Vorgath. His silence weighs more than his axe.")}, result: L("你握紧武器，手心全是汗。沃加斯瞥了你一眼，点了点头。", "You grip your weapon, palms slick. Vorgath glances over and nods once.")}),
      C("在烙印上默念神的名字", "Whisper your god's name over the brand", "cha_809", {effects: {corruption: 4, hp: 10, taint: {all: 5}, set: {prayedBrand: true}}, grudge: {npc: "vorgath", effects: {hp: -6}, note: L("你负过沃加斯；他的手始终没离开斧柄。", "You wronged Vorgath. His hand never leaves the axe haft.")}, result: L("烙印回应了。暖意顺着手臂爬上来，伤口不再流血。远处，那口钟又响了一声。", "The brand answers. Warmth crawls up your arm and your wounds stop bleeding. Far off, the bell rings once more.")}),
      C("向沃加斯认账", "Own up to Vorgath", "cha_809", {require: {flag: "wronged_vorgath"}, hideIfLocked: true, effects: {sanity: -3, renown: -3, set: {forgiven_vorgath: true}}, result: L("沃加斯没停手里的活。“我早知道。”他把磨石扔给你，“站我左边。”这大概是他表示原谅的方式。", "Vorgath doesn't stop sharpening. “I knew.” He tosses you the whetstone. “Stand on my left.” That's probably his way of forgiving.")})
    ]};

  N.cha_809 = {chapter: 8, scene: "ruins", speaker: STRAND, time: {h: 1},
    text: L("废墟的入口亮起银光。斯特兰德审判官走在光的前面，这回是她本人，白手套上一尘不染。\n她展开一张名单，划掉一个名字，又一个。\n“你，”她看着你，“卡尔卡罗斯广场上，我记下了你的脸。”",
            "Silver light kindles at the ruins' entrance. Inquisitor Strand walks before it, in person this time, white gloves spotless.\nShe unrolls a list and strikes out a name with her pen. Then another.\n“You,” she says, looking at you. “On Carcharos, I wrote down your face.”"),
    alt: [
      {if: {flag: "strandWatching"}, add: L("“我放你出白塔，是想看你会领我找到谁。”", "“I let you out of the white tower to see whom you'd lead me to.”")}
    ],
    effects: {sanity: -5},
    codex: ["imp_ordo_malleus"],
    choices: [
      C("“那你找到了。”", "“Well, you found us.”", "cha_803", {effects: {renown: 5}, result: L("斯特兰德微微一笑，划掉最后一个名字。她身后的光，开始往前走。", "Strand gives a small smile and strikes out the last name. Behind her, the light begins to walk forward.")}),
      C("举起手里的武器", "Raise your weapon", "cha_803", {effects: {hp: -5, renown: 3}, result: L("你的手刚抬起，一股无形的力量就把手腕压弯了。斯特兰德连眉毛都没动。", "Your arm barely rises before an unseen force bends your wrist back. Strand doesn't so much as raise an eyebrow.")}),
      C("趁她念名单，钻进墓穴", "While she reads, slip into the crypt", "cha_806", {effects: {renown: -5}, result: L("你从沃加斯身后溜下台阶。他没回头，只是骂了一句很古老的脏话。", "You slip down the steps behind Vorgath. He doesn't turn, only spits a very old curse.")})
    ]};

  N.cha_803 = {chapter: 8, scene: "ruins", speaker: VORGATH, foe: "grey_knight", time: {h: 1},
    grudgeLine: {npc: "vorgath", text: L("沃加斯没看你，与你隔开了一臂远。", "Vorgath doesn't look at you. He stands an arm's length farther off than before.")},
    text: L("他们从光里走出来。银色的盔甲，没有任何装饰，每一步都像在宣读判决。\n伊克萨里尔扔出一团蓝火，火在半空中熄灭，像从没存在过。\n“灰骑士，”沃加斯低声说。他第一次没有笑。",
            "They step out of the light. Silver armour without ornament, each footfall like a verdict being read.\nIxaril hurls blue fire. It goes out in mid-air as if it had never existed.\n“Grey Knights,” Vorgath says quietly. For the first time, he isn't smiling."),
    effects: {sanity: -10, hp: -10},
    codex: ["imp_grey_knights"],
    choices: [
      C("与沃加斯并肩作战", "Fight beside Vorgath", null, R(0.5, "hp", "cha_805", "cha_end_purged", RR(L("你和沃加斯背靠背，挡开一戟，又一戟。然后，身后传来金属撕裂的声音。", "Back to back with Vorgath, you turn aside one halberd, then another. Then, behind you, the sound of tearing metal."), L("你的每一击都落了空，像砍进一场雪。一道银光迎面而来。", "Every blow you swing finds nothing, like cutting into snow. A silver light comes straight at you.")), {grudge: {npc: "vorgath", p: -0.12, note: L("沃加斯信不过你，并肩时慢了半拍。", "Vorgath doesn't trust you and is half a beat slow to cover.")}})),
      C("献上一切，呼唤你的神", "Offer everything. Call your god.", "cha_807", {require: [{stat: "renown", min: 60}, {flag: "champion"}]}),
      C("退进圣人墓穴", "Fall back into the saint's crypt", "cha_806", {effects: {renown: -5}, result: L("你丢下沃加斯，钻进墓穴入口。身后，他骂了一句很古老的脏话。", "You leave Vorgath and duck into the crypt. Behind you, he spits a very old curse.")})
    ]};

  N.cha_805 = {chapter: 8, scene: "ruins", speaker: VORGATH, foe: "grey_knight", time: {h: 1},
    text: L("灰骑士的戟刺穿了沃加斯的胸甲。他跪下来，还在笑：“一万年……总算有个像样的对手。”\n他把斧子推进你手里：“登陆艇在东边。告诉战帅……算了。什么都别告诉他。”",
            "A Grey Knight's halberd punches through Vorgath's breastplate. He sinks to his knees, still laughing. “Ten thousand years... finally, a worthy opponent.”\nHe pushes his axe into your hands. “Lander's to the east. Tell the Warmaster... no. Tell him nothing.”"),
    alt: [
      {if: {flag: "falseOath"}, add: L("“你骗过战帅，”他咳着笑，“也骗过我。好。活着的骗子，比死了的勇士有用。”", "“You lied to the Warmaster,” he coughs, laughing. “And to me. Good. A live liar beats a dead champion.”")},
      {if: {flag: "toldStrand"}, add: L("东边的天上有一团火。那是登陆艇，你告诉过她它在哪。", "There's fire in the eastern sky. That's the lander. You told her where it was.")}
    ],
    effects: {sanity: -10},
    choices: [
      C("带着斧子冲向登陆艇", "Run for the lander with the axe", "cha_end_champion", {require: {notFlag: "toldStrand"}, result: L("斧子重得像一块墓碑。你拖着它狂奔，身后的笑声越来越远，然后停了。", "The axe is heavy as a gravestone. You drag it and run. The laughter behind you fades, then stops.")}),
      C("拖着斧子逃进墓穴", "Drag the axe into the crypt", "cha_806", {require: {flag: "toldStrand"}, hideIfLocked: true, effects: {sanity: -5}, result: L("登陆艇烧着了。你只剩一个地方可去。沃加斯的笑声在身后停了。", "The lander is burning. There's only one place left to go. Vorgath's laughter stops behind you.")}),
      C("留下来陪他", "Stay with him", "cha_end_purged", {result: L("你在他身边坐下。他没再说话，只是把头盔转向银光，像在等一场雨停。", "You sit beside him. He says nothing more, only turns his helm toward the silver light, like waiting out the rain.")})
    ]};

  N.cha_806 = {chapter: 8, scene: "cathedral", speaker: S("omen_emperor", "无脸的帝皇像", "Faceless Emperor Statue"), time: {h: 2},
    text: L("墓穴里很黑，只有一尊帝皇的小雕像，脸已经磨平了。\n你靠着它坐下，手腕上的烙印突然冷了。\n墙那边，灰骑士的脚步一下，一下，不快也不慢。他们不需要快。",
            "The crypt is dark save for a small statue of the Emperor, its face worn smooth.\nYou sit against it, and the brand on your wrist goes suddenly cold.\nBeyond the wall the Grey Knights' footsteps fall. One. Another. Neither fast nor slow. They don't need to be fast."),
    effects: {sanity: -5},
    choices: [
      C("向雕像祈祷", "Pray to the statue", "cha_end_light", {result: L("你不记得任何祷词。你只是跪着，嘴唇动着。", "You don't remember a single prayer. You only kneel, lips moving."),
        resultAlt: [{if: {flag: "sangHymn"}, text: L("你在大教堂台阶上唱过的那首赞美诗，词全回来了。", "The hymn you sang on the cathedral steps comes back, every word.")}, {if: {flag: "coldWater"}, text: L("你想起很久以前那盆冷水。你跪下，像那时一样清醒。", "You remember a basin of cold water, long ago. You kneel, as clear-headed as you were then.")}]}),
      C("挖开墓穴的后墙", "Dig through the back wall", null, R(0.4, "hp", "cha_802", "cha_end_purged", RR(L("指甲全翻了，墙后终于透进一股冷风。下水道。顺着它，能走到南塔码头。", "Every fingernail splits before cold air seeps through. A sewer. Follow it, and it reaches the south dock."), L("砖头一块块松动。墙后，一双银色的靴子在等你。", "Brick by brick, the wall gives. Behind it, a pair of silver boots is waiting.")))),
      C("在空白书上写一扇门", "Write a door into the blank book", "cha_802", {require: {flag: "blankBook"}, hideIfLocked: true, effects: {sanity: -10, taint: {tzeentch: 10}}, result: L("你写下“门”。墙上出现了一扇门，门后是南塔码头的人群。书上的下一行写着：你推开了门。", "You write “door.” A door appears in the wall; beyond it, the crowd at the south dock. The next line reads: You open the door.")}),
      C("砸碎雕像，呼唤你的神", "Smash the statue. Call your god.", "cha_807", {require: {stat: "renown", min: 60}, result: L("雕像碎了。你腕上的烙印重新烧起来，比任何时候都烫。", "The statue shatters. The brand on your wrist reignites, hotter than ever.")})
    ]};

  N.cha_807 = {chapter: 8, scene: "warp", speaker: S("daemon_prince", "你", "You"), time: {h: 1, warp: true}, jump: L("飞升：你离开了凡人的世界", "Ascension: you leave the mortal world"),
    text: L("你张开双臂。门后的四个声音同时停止了争吵。\n骨头在拉长，背上撕开了翅膀，你的影子终于站起来，和你合为一体。\n灰骑士的戟停在你面前一寸。你低头看着那名骑士。第一次，你比他高。",
            "You spread your arms. The four voices behind the door fall silent at once.\nYour bones lengthen. Wings tear open across your back. Your shadow finally stands and becomes one with you.\nA Grey Knight's halberd halts an inch away. You look down at the knight. For the first time, you are taller."),
    alt: [
      {if: {flag: "devoted_khorne"}, add: L("你的皮肤变成了红铜色。", "Your skin turns to brass.")},
      {if: {flag: "devoted_nurgle"}, add: L("你身上开满了绿色的花。", "Green flowers bloom all over you.")},
      {if: {flag: "devoted_tzeentch"}, add: L("你的翅膀是蓝色的火。", "Your wings are blue fire.")},
      {if: {flag: "devoted_slaanesh"}, add: L("你美得让那名骑士的戟晃了一下。", "You are so beautiful the knight's halberd wavers.")},
      {if: {flag: "prayedBrand"}, add: L("废墟里你默念的那个名字，此刻回答了你。", "The name you whispered in the ruins answers you now.")}
    ],
    effects: {corruption: 15, renown: 20},
    codex: ["chaos_daemon_prince"],
    choices: [
      C("飞向恐惧之眼", "Fly for the Eye of Terror", "cha_end_prince")
    ]};

  N.cha_end_prince = {chapter: 8, scene: "daemon_world", speaker: S("daemon_prince", "恶魔王子", "Daemon Prince"), time: {y: 100, warp: true}, jump: L("尾声：一百年后", "Epilogue: a hundred years on"),
    text: L("恐惧之眼里多了一位新的恶魔王子。凡人的岁月从你身上滑过，像雨滑过铁甲。\n很多年后，某个巢都的垃圾瀑布下，一个缺门牙的孩子捡到一尊温热的小雕像。\n雕像的脸，是你的。",
            "The Eye of Terror has a new Daemon Prince. Mortal years slide off you like rain off armour.\nMany years later, beneath the garbage falls of some hive, a gap-toothed child finds a warm little statue.\nIts face is yours."),
    alt: [
      {if: {flag: "idol"}, add: L("和你当年揣进怀里的那一尊，一模一样。", "Exactly like the one you once tucked into your coat.")}
    ],
    ending: {kind: "good", title: L("恶魔王子", "Daemon Prince"), cause: L("飞升为恶魔王子", "Ascended to daemonhood")}};

  N.cha_end_champion = {chapter: 8, scene: "void", speaker: S("omen_black_crusade", "黑色旗舰", "The Black Flagship"), time: {d: 9, warp: true}, jump: L("尾声：逃离阿尔德林", "Epilogue: away from Aldrin"),
    text: L("你拖着斧子爬上最后一艘起飞的登陆艇。身后，阿尔德林在灭绝令中变成一颗白色的星。\n星系边缘的旗舰上，战帅阿巴顿看了你一眼——就一眼——然后继续看他的星图。\n够了。对你这样的人来说，够了。",
            "You drag the axe aboard the last lander to lift off. Behind you, Aldrin becomes a white star under Exterminatus.\nOn the flagship at the system's edge, Warmaster Abaddon glances at you—just once—then returns to his star charts.\nIt's enough. For someone like you, it's enough."),
    alt: [
      {if: {flag: "slewMarine"}, add: L("你背上还挂着那块白金色的肩甲。", "The white-and-gold pauldron still hangs on your back.")},
      {if: {flag: "origin_scavenger"}, add: L("一只污池里的老鼠，被战帅看过一眼。", "A rat from the Sump, and the Warmaster looked at it once.")}
    ],
    ending: {kind: "good", title: L("黑色军团的勇士", "Champion of the Black Legion"), cause: L("成为黑色军团勇士", "Champion of the Black Legion")}};

  N.cha_end_vanish = {chapter: 8, scene: "underhive", speaker: null, time: {y: 2}, jump: L("尾声：两年后，另一颗巢都星球", "Epilogue: two years later, another hive world"),
    text: L("撤离船把你卸在另一颗巢都星球。两年后，你在下巢的净水站排班。\n手腕上的烙印偶尔还会发烫。每当那时，你就哼起诗班的歌，再故意唱错一个音。\n诸神找不到唱错的人。至少你希望如此。",
            "The evacuation ship drops you on another hive world. Two years later you work shifts at an underhive water station.\nThe brand on your wrist still warms now and then. When it does, you hum the Choir's hymn and sing one note wrong on purpose.\nThe gods can't find someone singing off-key. Or so you hope."),
    alt: [
      {if: {flag: "metWhistle"}, add: L("你过滤水，一滴一滴，像哨子从前那样。", "You filter water drop by drop, the way Whistle used to.")},
      {if: {flag: "tikkaEscort"}, add: L("有时你梦见一个井盖，井盖下有只手在挥。", "Some nights you dream of a manhole, and a hand waving up from below.")},
      {if: {flag: "soldYear"}, add: L("你看上去比同龄人老一岁。那一年，在恐惧之眼的集市里。", "You look a year older than you are. That year is in a bazaar in the Eye.")}
    ],
    ending: {kind: "good", title: L("唱错的音", "The Wrong Note"), cause: L("隐姓埋名，躲开诸神", "Hid from the gods")}};

  N.cha_end_purged = {chapter: 8, scene: "ruins", speaker: S("grey_knight", "灰骑士", "Grey Knight"), time: {h: 1},
    text: L("光落下时没有声音——士兵的小灯，或者骑士的戟，都一样。\n审判庭的档案里，你只有一行字：“阿尔德林，异端，已净化。”没有名字。\n六小时后，这行字所指的那颗星球，也不存在了。",
            "When the light falls there is no sound: a trooper's little lamp or a knight's halberd, it's all the same.\nIn the Inquisition's records you are one line: “Aldrin. Heretic. Purged.” No name.\nSix hours later, the world that line refers to no longer exists either."),
    ending: {kind: "bad", title: L("已净化", "Purged"), cause: L("被灰骑士净化", "Purged by the Grey Knights")}};

  N.cha_end_light = {chapter: 8, scene: "throne_light", speaker: S("omen_emperor", "金光", "Golden Light"), time: {h: 1},
    text: L("你祈祷了。笨拙地，不知道该说什么。\n光回应了你。不是宽恕，是火。\n斯特兰德后来在报告里写：“该异端死前在祈祷。备注：无关紧要。”",
            "You pray. Clumsily, not knowing what to say.\nThe light answers. Not with forgiveness. With fire.\nStrand later writes in her report: “Heretic was praying at time of death. Note: irrelevant.”"),
    alt: [
      {if: {flag: "sangHymn"}, add: L("她又补了一行：“该异端在阿尔德林曾放下武器。”然后划掉了。", "She adds a line: “Heretic laid down arms once on Aldrin.” Then strikes it out.")}
    ],
    ending: {kind: "bad", title: L("迟来的祷告", "A Prayer Too Late"), cause: L("死于帝皇之光", "Burned in the Emperor's light")}};

  /* ============ Claim endings (SPEC §19): a Chaos god's claim, accepted or forced. Reached via the claim events' goto from anywhere: location-neutral (vision scene). ============ */
  N.cha_claim_khorne = {scene: "warp", speaker: S("daemon_khorne", "铁砧般的声音", "A Voice Like an Anvil"),
    text: L("你手腕上的烙印烧成了红铜色，心跳变成了鼓点。周围的一切都褪成了红色。\n“你，”那个声音像铁砧，“跑够了。现在，冲。”\n另外三个声音，同时闭上了嘴。",
            "The brand on your wrist burns copper-red; your heartbeat has become a drum. Everything around you fades to red.\n“You,” says a voice like an anvil. “Enough running. Now, charge.”\nThe other three voices fall silent at once."),
    alt: [
      {if: {fromChapter: {max: 1}}, text: L("你的手腕上还没有烙印，可心跳已经变成了鼓点。周围的一切都褪成了红色。\n“你，”一个声音像铁砧，“跑够了。现在，冲。”",
        "There's no brand on your wrist yet, but your heartbeat has already become a drum. Everything fades to red.\n“You,” says a voice like an anvil. “Enough running. Now, charge.”")}
    ],
    codex: ["god_khorne"],
    choices: [
      C("以他的勇士之名回应", "Answer as His champion", "cha_end_claim_khorne_chosen", {require: {flag: "devoted_khorne"}, result: L("你举起烙印。鼓声停了一拍，像是认出了你。", "You raise the brand. The drum skips a beat, as if it knows you.")}),
      C("任由它带走你", "Let it take you", "cha_end_claim_khorne", {result: L("你松开手里的一切。鼓声把你卷了进去。", "You let go of everything you hold. The drum sweeps you in.")})
    ]};

  N.cha_end_claim_khorne = {scene: "burning_city", speaker: S("daemon_khorne", "嗜血者", "Bloodletter"), time: {y: 5}, jump: L("尾声：五年后", "Epilogue: five years on"),
    text: L("你成了血神的猎犬：没有名字，没有诗班，只有下一场仗。\n多年后，你走过的每个地方都有人用你的故事吓唬孩子：一个凡人从烂泥里爬出来，从此再没停下。\n头骨一颗颗堆向王座，永远堆不满。",
            "You become a hound of the Blood God: no name, no Choir, only the next battle.\nYears later, everywhere you passed, people frighten children with your story: a mortal who crawled out of the mud and never stopped.\nSkull after skull piles toward the throne. It is never enough."),
    codex: ["god_khorne"],
    ending: {kind: "bad", title: L("血神的猎犬", "Hound of the Blood God"), cause: L("沦为恐虐的猎犬", "Became a hound of Khorne")}};

  N.cha_end_claim_khorne_chosen = {scene: "daemon_world", speaker: S("daemon_prince", "血神的勇士", "Champion of the Blood God"), time: {y: 30, warp: true}, jump: L("尾声：三十年后", "Epilogue: thirty years on"),
    text: L("血神承认了你。你的盔甲换成黄铜，名字刻进斧刃，每一场仗都比上一场更大。\n你在一千个世界上冲锋，从不回头，也从不休息。\n恐虐从不赏赐安宁，只赏赐下一个对手。对你来说，这就够了。",
            "The Blood God acknowledges you. Your armour turns to brass, your name is etched into the axe-blade, every war bigger than the last.\nYou charge across a thousand worlds, never looking back, never resting.\nKhorne grants no peace, only the next foe. For you, that is enough."),
    codex: ["god_khorne"],
    ending: {kind: "good", title: L("血神的勇士", "Champion of the Blood God"), cause: L("成为恐虐的勇士", "Became Khorne's champion")}};

  N.cha_claim_nurgle = {scene: "warp", speaker: S("daemon_nurgle", "老爷爷的声音", "Grandfather's Voice"),
    text: L("苍蝇落满了你的肩膀，你一点也不觉得痒。\n“孩子，”那个声音又暖又稠，“你在外面跑得太累了。回家吧。花园里的活儿，总得有人干。”",
            "Flies settle all over your shoulders, and you don't itch at all.\n“Child,” says a voice warm and thick as broth, “you've run yourself ragged out there. Come home. The garden needs tending, and someone must do it.”"),
    codex: ["god_nurgle"],
    choices: [
      C("以他的园丁之名回应", "Answer as His gardener", "cha_end_claim_nurgle_chosen", {require: {flag: "devoted_nurgle"}, result: L("你伸出手。苍蝇们欢快地嗡了一声，像在鼓掌。", "You hold out your hand. The flies hum happily, as if applauding.")}),
      C("躺下，歇一歇", "Lie down and rest", "cha_end_claim_nurgle", {result: L("脚下的地又软又暖。你闭上眼睛，再也不想睁开。", "The ground underfoot is soft and warm. You close your eyes and never want to open them.")})
    ]};

  N.cha_end_claim_nurgle = {scene: "underhive", speaker: S("daemon_nurgle", "老爷爷的声音", "Grandfather's Voice"), time: {y: 3}, jump: L("尾声：三年后", "Epilogue: three years on"),
    text: L("你在最近的一摊烂泥里躺下，再也不想起来。苍蝇在你身上安了家，菌菇从指缝里长出来。\n路过的人都爱在你身边歇脚，说你身上暖洋洋的，像个炉子。\n慈父的花园里没有谁是多余的，也没有谁能离开。",
            "You lie down in the nearest patch of mud and never want to get up. Flies make a home of you; mushrooms sprout between your fingers.\nPassers-by like to rest beside you. You're warm, they say, like a stove.\nIn Grandfather's garden no one is unwanted, and no one ever leaves."),
    codex: ["god_nurgle"],
    ending: {kind: "bad", title: L("污池里的暖炉", "The Warm Stove in the Sump"), cause: L("沦为纳垢的苗床", "Became a seedbed for Nurgle")}};

  N.cha_end_claim_nurgle_chosen = {scene: "daemon_world", speaker: S("daemon_prince", "慈父的园丁", "Grandfather's Gardener"), time: {y: 30, warp: true}, jump: L("尾声：三十年后", "Epilogue: thirty years on"),
    text: L("老爷爷亲手给你系上了围裙。你成了花园的园丁，替他照看一种又一种新生的瘟疫。\n你身上烂了七处，处处都开着花。小东西们说你笑起来最好看。\n你从没这么快乐过，也永远不会再孤单。",
            "Grandfather ties an apron on you himself. You become a gardener, tending one newborn plague after another for him.\nYou are rotten in seven places, and every one of them is in bloom. The little ones say your smile is the loveliest.\nYou have never been so happy, and you will never be alone again."),
    codex: ["god_nurgle"],
    ending: {kind: "good", title: L("慈父的园丁", "Grandfather's Gardener"), cause: L("成为纳垢的宠儿", "Became Nurgle's beloved")}};

  N.cha_claim_tzeentch = {scene: "warp", speaker: S("daemon_tzeentch", "镜子里的人", "The One in the Mirror"),
    text: L("所有的镜子同时映出了你，每一个你都在做不同的事。\n“选一个吧，”镜子里的人笑着说，“反正每一个都是我替你写好的。”",
            "Every mirror shows you at once, each you doing something different.\n“Pick one,” says the one in the mirror, smiling. “I wrote them all for you anyway.”"),
    codex: ["god_tzeentch"],
    choices: [
      C("以他的书记之名回应", "Answer as His scribe", "cha_end_claim_tzeentch_chosen", {require: {flag: "devoted_tzeentch"}, result: L("你拿起笔。墨水是蓝色的，自己就开始写了。", "You pick up the pen. The ink is blue, and it starts writing on its own.")}),
      C("随便指一个", "Point at any one", "cha_end_claim_tzeentch", {result: L("你指了一个。镜子全碎了，每块碎片里都是同一个笑容。", "You point. Every mirror shatters, and each shard holds the same smile.")})
    ]};

  N.cha_end_claim_tzeentch = {scene: "warp", speaker: S("daemon_tzeentch", "镜子里的人", "The One in the Mirror"), time: {y: 2, warp: true}, jump: L("尾声：两年后", "Epilogue: two years on"),
    text: L("你开始照着脑子里的剧本过日子。每一步都很顺，顺得可疑。\n剧本最后一页写着：你死于一场你亲手策划的背叛。读到这一行时，已经来不及改了。\n万变之主的计划里，你只是一行注脚。",
            "You start living by a script in your head. Every step goes smoothly. Suspiciously smoothly.\nThe last page reads: you die in a betrayal you plotted yourself. By the time you read that line, it's too late to change it.\nIn the Changer of Ways' plan, you were a footnote."),
    codex: ["god_tzeentch"],
    ending: {kind: "bad", title: L("剧本的最后一页", "The Last Page"), cause: L("死于奸奇的计划", "Undone by Tzeentch's plan")}};

  N.cha_end_claim_tzeentch_chosen = {scene: "warp", speaker: S("daemon_prince", "命运的书记", "Scribe of Fate"), time: {y: 30, warp: true}, jump: L("尾声：三十年后", "Epilogue: thirty years on"),
    text: L("你成了改变之主的书记，替他写下一千个未来，再一个个划掉。\n你的身体每天都不一样：今天长羽毛，明天长眼睛。你喜欢这种不确定。\n你也知道，总有一天他会把你写死。那也在计划之中。",
            "You become the Changer's scribe, writing a thousand futures for him and crossing them out one by one.\nYour body is different every day: feathers today, eyes tomorrow. You like not knowing.\nYou know he'll write you out one day. That, too, is part of the plan."),
    alt: [
      {if: {flag: "origin_scribe"}, add: L("你又成了抄写员。只是这回，你抄的是还没发生的事。", "You're a scribe again. Only now, you copy what hasn't happened yet.")}
    ],
    codex: ["god_tzeentch"],
    ending: {kind: "good", title: L("命运的书记", "Scribe of Fate"), cause: L("成为奸奇的书记", "Became Tzeentch's scribe")}};

  N.cha_claim_slaanesh = {scene: "warp", speaker: S("daemon_slaanesh", "甜得发苦的声音", "A Bittersweet Voice"),
    text: L("香水味从四面八方漫过来，所有的声音都在夸你。\n“从来没人好好看过你一眼，”那个声音说，“现在，全宇宙都在看你。你还想要什么？”\n你想要更多。",
            "Perfume washes in from every side, and every voice is praising you.\n“No one ever truly looked at you,” the voice says. “Now the whole universe is watching. What more could you want?”\nMore. You want more."),
    codex: ["god_slaanesh"],
    choices: [
      C("以她的宠儿之名回应", "Answer as Her favourite", "cha_end_claim_slaanesh_chosen", {require: {flag: "devoted_slaanesh"}, result: L("你抬起下巴。所有的目光同时落在你身上，烫得像光。", "You lift your chin. Every gaze lands on you at once, hot as light.")}),
      C("再要一点", "Just a little more", "cha_end_claim_slaanesh", {result: L("你又要了一点，然后又一点，然后忘了自己原本想要什么。", "You take a little more, then more, then forget what you wanted in the first place.")})
    ]};

  N.cha_end_claim_slaanesh = {scene: "daemon_world", speaker: S("daemon_slaanesh", "甜得发苦的声音", "A Bittersweet Voice"), time: {y: 3, warp: true}, jump: L("尾声：三年后", "Epilogue: three years on"),
    text: L("你追逐每一种滋味：更甜的酒，更高的音，更多的目光。\n每尝一次，世界就淡一点。最后你坐在一场永不散场的宴席上，盘子总是满的，你却什么都尝不到。\n她给你一切，直到你什么都不是。",
            "You chase every taste: sweeter wine, higher notes, more eyes upon you.\nEach taste leaves the world a little paler. At last you sit at a banquet that never ends, plate always full, tasting nothing.\nShe gives you everything, until you are nothing."),
    codex: ["god_slaanesh"],
    ending: {kind: "bad", title: L("尝不出的滋味", "The Taste of Nothing"), cause: L("被色孽掏空", "Hollowed out by Slaanesh")}};

  N.cha_end_claim_slaanesh_chosen = {scene: "daemon_world", speaker: S("daemon_prince", "完美的主人", "The Perfect Host"), time: {y: 30, warp: true}, jump: L("尾声：三十年后", "Epilogue: thirty years on"),
    text: L("你成了宴会的主人。宾客为你而来，为你着迷，为你倾尽所有。\n你是完美的，每一面镜子都这么说。\n可你只想要下一个更完美的瞬间，永远想要。在她的国度里，这就叫恩宠。",
            "You become the host of the feast. Guests come for you, are enthralled by you, give you everything they have.\nYou are perfect; every mirror says so.\nYet all you want is the next, more perfect moment, forever. In Her realm, that is called favour."),
    codex: ["god_slaanesh"],
    ending: {kind: "good", title: L("完美的主人", "The Perfect Host"), cause: L("成为色孽的宠儿", "Became Slaanesh's favourite")}};

  /* ============ Death nodes (engine-triggered from anywhere: location-neutral, varied by alt on fromChapter) ============ */
  N.cha_death_hp = {scene: "underhive", speaker: null,
    text: L("下巢的规矩，到哪儿都一样：人死了，东西归活人。\n有人拿走了你的鞋，有人拿走了你手里的家伙。没人记得你的名字。\n四位神没有一个回头看。",
            "The underhive's rule holds everywhere: when someone dies, their things go to the living.\nSomeone takes your shoes. Someone takes whatever you were holding. Nobody remembers your name.\nNot one of the Four looks back."),
    alt: [
      {if: {fromChapter: {max: 4}}, add: L("蒂卡留下了你的一只鞋，说是留着念想。", "Tikka keeps one of your shoes. As a keepsake, she says.")},
      {if: {fromChapter: {min: 5}}, add: L("黑色军团连你的尸体都拿去用了。", "The Black Legion found a use even for your body.")}
    ],
    ending: {kind: "death", title: L("污池的规矩", "The Sump's Rule"), cause: L("伤重身亡，遗物被分", "Died of wounds, belongings shared")}};

  N.cha_death_sanity = {scene: "warp", speaker: S("sigil_tzeentch", "所有的声音", "Every Voice"),
    text: L("你脑子里那些声音不再争吵了，因为它们都进来了。\n你同时在笑、在哭、在愤怒、在渴望。你的嘴说着四种语言，没有一种是你的。\n诸神很满意。只是没有“你”了。",
            "The voices in your head stop arguing, because now they're all inside.\nYou laugh, weep, rage and crave all at once. Your mouth speaks four languages, none of them yours.\nThe gods are pleased. There's just no “you” left."),
    ending: {kind: "death", title: L("四声合唱", "Chorus of Four"), cause: L("心智被四神占据", "Mind taken by the Four")}};

  N.cha_death_corruption = {scene: "daemon_world", speaker: S("mutant", "混沌卵", "Chaos Spawn"),
    text: L("诸神一次给了你太多恩赐：触手、眼睛、翅膀、嘴巴，一样不少。\n你的身体装不下。\n后来，有人见过一只会追着自己尾巴咬的怪物。偶尔它会停下来，像在努力回想一个名字。",
            "The gods gave you too many gifts at once: tentacles, eyes, wings, mouths, everything.\nYour body couldn't hold them.\nLater, people saw a beast that chases its own tails. Sometimes it stops, as if trying to recall a name."),
    alt: [
      {if: {fromChapter: {max: 4}}, add: L("下巢的人用火把把它赶进了污池深处。", "The underhivers drove it into the depths of the Sump with torches.")},
      {if: {fromChapter: {min: 5}}, add: L("沃加斯的战团把它拴在了船上，当看门狗。", "Vorgath's warband chained it aboard ship as a watchdog.")}
    ],
    codex: ["chaos_spawn"],
    ending: {kind: "death", title: L("混沌卵", "Chaos Spawn"), cause: L("沦为混沌卵", "Became Chaos Spawn")}};

  WH.registerFaction({
    id: "chaos",
    name: L("混沌", "Chaos"),
    tagline: L("帝皇不看你，诸神会", "The Emperor never looked. The gods will."),
    role: L("下巢拾荒者", "Underhive scavenger"),
    world: L("卡尔卡罗斯", "Carcharos"),   // SPEC §27 home world (all three origins start in Hive Vorne)
    npcs: {   // SPEC §28 grudges: people the route lets you wrong
      whistle: {name: L("哨子", "Whistle")},
      vellum:  {name: L("维勒姆", "Vellum"), aka: [L("维勒姆神父", "Father Vellum")]},
      kade:    {name: L("凯德", "Kade"), aka: [L("执法官凯德", "Enforcer Kade")]},
      vorgath: {name: L("沃加斯", "Vorgath")}
    },
    playerSprite: "player_chaos",
    color: "#a3242b",
    startNode: "cha_101",
    startDate: {year: 111, mill: 42},
    startStats: {hp: 100, sanity: 100, corruption: 0, renown: 10},
    renownLabel: L("神恩", "Favor"),
    renownIcon: "icon_favor",
    taintMod: {khorne: 1.3, nurgle: 1.3, tzeentch: 1.3, slaanesh: 1.3},   // SPEC §19: multiplier on positive taint deltas (cleanses unscaled)
    renownHelp: L("神恩是诸神对你的注目。献祭、杀戮、敢于索取、不在门后的声音前退缩，会让它上升；心软、退缩、背弃同伴会让它下降。神恩够高，诸神才可能亲自回应你。",
                  "Favor is how closely the gods are watching you. Offerings, killing, daring to take, and standing firm before the voices behind the door raise it; mercy, retreat and abandoning your own lower it. Enough Favor, and the gods may answer you in person."),
    origins: [
      {id: "scavenger", name: L("下巢拾荒者", "Underhive scavenger"),
       desc: L("污池里长大的拾荒者。三天没吃饭，身子发虚；下巢的怪事早已见怪不怪。", "A Sump scavenger. Three days without food leave you weak, but nothing in the underhive frightens you any more."),
       sprite: "player_chaos", startNode: "cha_101",
       max: {hp: 95, sanity: 105}, stats: {hp: 95, sanity: 105, corruption: 0, renown: 10}, set: {origin_scavenger: true}},
      {id: "deserter", name: L("星界军逃兵", "Guard deserter"),
       desc: L("从团里逃出来的兵。身手还在，噩梦也在；政委和执法官都在找你。", "You ran from your regiment. The soldier's body remains, and so do the nightmares. The commissar and the enforcers are both looking."),
       sprite: "guardsman", startNode: "cha_o_deserter_1",
       max: {hp: 115, sanity: 90}, stats: {hp: 115, sanity: 90, corruption: 0, renown: 5}, set: {origin_deserter: true}},
      {id: "scribe", name: L("教会抄写员", "Ecclesiarchy scribe"),
       desc: L("在大教堂抄了十一年经文，手无缚鸡之力，心却定；直到抄到一本不该存在的书。", "Eleven years copying scripture: frail hands, a disciplined mind. Then you copied a book that should not exist."),
       sprite: "preacher", startNode: "cha_o_scribe_1",
       max: {hp: 85, sanity: 110}, stats: {hp: 85, sanity: 110, corruption: 0, renown: 15}, set: {origin_scribe: true}}
    ],
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
