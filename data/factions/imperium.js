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

  N.imp_103 = {chapter: 1, scene: "hive_hab", speaker: PELL, time: {h: 1},
    text: L("佩尔在楼梯间卖再生咖啡，一杯掺三成水。“今天免费，”他咧嘴笑，“万一咱俩被抽中，就当我的遗产。”\n他妹妹米娜躲在他身后，指尖结着一层薄霜。",
            "Pell sells recaff in the stairwell, a third of it water. “Free today,” he grins. “If we both get picked, call it my inheritance.”\nHis little sister Mina hides behind him. Frost is creeping over her fingertips."),
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
      C("去找执事", "Go and find the deacon", "imp_106", {effects: {renown: 5, set: {reportedMina: true}}, result: L("你在走廊尽头拉住执事的袖子。说出米娜的名字时，你的声音比想象中平静。", "You catch the deacon's sleeve at the end of the hall. When you say Mina's name, your voice is calmer than you expected.")})
    ]};

  N.imp_106 = {chapter: 1, scene: "hive_hab", speaker: HALLOW, time: {h: 10},
    text: L("执事给了你一张口粮券，拍了拍你的头，像奖励一条好狗。\n当晚，一艘不亮灯的黑船悬在尖塔上空。从那以后，佩尔再也没跟你说过一句话。",
            "The deacon hands you a ration chit and pats your head like a good dog.\nThat night a ship with no lights hangs above the spire. Pell never speaks to you again."),
    effects: {sanity: -5},
    codex: ["imp_black_ships"],
    choices: [
      C("去广场听名单", "Go to the square for the list", "imp_104")
    ]};

  N.imp_104 = {chapter: 1, scene: "cathedral", speaker: HALLOW, time: {h: 3},
    text: L("广场挤满了人。哈洛执事念着名单，语气像在感恩祷告：“……佩尔·奥斯特。还有你。”\n他抬起头：“赞美帝皇，你们被选中了。”有人鼓掌，有人哭。",
            "The square is packed. Deacon Hallow reads the list like a prayer of thanks. “...Pell Ost. And you.”\nHe looks up. “Praise the Emperor, you have been chosen.” Someone applauds. Someone weeps."),
    codex: ["imp_ecclesiarchy"],
    choices: [
      C("接受命运", "Accept it", "imp_107", {effects: {renown: 3}, result: L("你走上台阶，执事在你额头点了一滴圣油。人群里有人喊你的名字，你没看清是谁。", "You climb the steps. The deacon dabs holy oil on your brow. Someone in the crowd shouts your name; you never see who.")}),
      C("趁乱钻进排污管", "Slip into a drain pipe in the crowd", null, R(0.4, "hp", "imp_108", "imp_109", L("你趁人群推搡掀开格栅，滑进黑暗。头顶的赞美诗越来越远。", "You lift a grate in the crush and slide into the dark. The hymns overhead grow faint."), L("你钻进了管道，身后却响起靴子声。他们早就在下面等着了。", "You make it into the pipe, but boots echo behind you. They were waiting down here all along.")))
    ]};

  N.imp_108 = {chapter: 1, scene: "underhive", speaker: null, time: {d: 3},
    text: L("你一路往下钻。下巢的空气是甜的，甜得发腥。\n第三天，你饿得啃完了靴带。一个独眼拾荒者递来一块肉：“别问是什么肉。”\n远处传来执法官的哨声。他们在清扫配额。",
            "You crawl down and down. Underhive air is sweet—sickly sweet.\nBy day three you've eaten your bootlaces. A one-eyed scavenger offers you meat. “Don't ask what it was.”\nEnforcer whistles in the distance. They're sweeping for the quota."),
    effects: {hp: -10, set: {deserter: true}},
    choices: [
      C("吃下去", "Eat it", "imp_109", {effects: {hp: 10, corruption: 3}, result: L("肉有股甜味，跟这里的空气一样甜。你没问，他也没说。", "The meat is sweet, like the air down here. You don't ask. He doesn't say.")}),
      C("摇头，继续躲", "Shake your head and keep hiding", "imp_109", {effects: {hp: -5}, result: L("你蜷进一截废管道，胃拧成了一团。哨声越来越近。", "You curl up in a dead pipe, stomach knotted. The whistles draw closer.")})
    ]};

  N.imp_109 = {chapter: 1, scene: "underhive", speaker: S("enforcer", "执法官", "Enforcer"), time: {h: 2},
    text: L("电棍在你肋下停了一秒。\n“逃兵？”执法官翻着记录板，“不对。配额还差一个，所以你是志愿者。”\n你的档案上多了一个红色印章。",
            "A shock maul rests against your ribs for one long second.\n“Deserter?” The enforcer checks his slate. “No. We're one short of quota. So you're a volunteer.”\nA red stamp appears on your file."),
    effects: {hp: -10, set: {marked: true}},
    codex: ["imp_arbites"],
    choices: [
      C("被押上运兵车", "Get shoved onto the transport", "imp_107", {result: L("车厢里挤满了被抽中的人。佩尔看见你，愣了一下，往旁边挪了挪。", "The transport is packed with the chosen. Pell sees you, blinks, and shifts over to make room.")})
    ]};

  N.imp_107 = {chapter: 1, scene: "ship_interior", speaker: null, time: {h: 14},
    text: L("运兵车升离巢都时，你第一次看见天空——黄色的，像一道旧伤。\n佩尔把额头贴在舷窗上，自言自语：“听说外面的星球有真正的雨。”\n没人告诉他，有些雨是酸的。",
            "As the transport lifts off the hive, you see the sky for the first time. It is yellow, like an old bruise.\nPell presses his forehead to the viewport. “They say other worlds have real rain.”\nNobody tells him some rain is acid."),
    codex: ["place_imp_troopship"],
    choices: [
      C("闭上眼睛", "Close your eyes", "imp_201", {effects: {sanity: 5}, result: L("你闭上眼听着引擎轰鸣，居然睡着了。梦里没有天空。", "You close your eyes to the engines' roar and somehow fall asleep. There's no sky in your dreams.")}),
      C("一直看着巢都变小", "Watch the hive shrink away", "imp_201", {effects: {renown: 2}, result: L("巢都缩成一根针，又缩成一个点。你在心里为那个点念了一句祷词。", "The hive shrinks to a needle, then a dot. You murmur a prayer for the dot.")})
    ]};

  /* ============ Chapter 2 · The Making of a Guardsman ============ */
  N.imp_201 = {chapter: 2, scene: "barracks", speaker: VOSK, time: {d: 2},
    text: L("沃斯克中士只有一只眼，但她能看见你枪管里的每一粒灰。\n“激光枪不是武器，是你的老婆、你的神龛、你的命。”她把枪塞给你，“擦亮。它比你值钱。”",
            "Sergeant Vosk has one eye, and it sees every speck of dust in your barrel.\n“A lasgun isn't a weapon. It's your spouse, your shrine, your life.” She shoves one into your hands. “Polish it. It's worth more than you.”"),
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
    text: L("训练第二十天。一个新兵扔下枪，哭着说想回家。\n德拉维克政委走了过去。你没看见发生了什么，只听见一声枪响。\n她走回来时，正不紧不慢地换着弹匣。",
            "Day twenty of training. A recruit drops his rifle and sobs that he wants to go home.\nCommissar Dravik walks over. You don't see what happens. You hear one shot.\nWhen she walks back, she is calmly changing the magazine."),
    effects: {sanity: -5, set: {sawExecution: true}},
    codex: ["imp_commissar"],
    choices: [
      C("立正，目视前方", "Stand at attention, eyes front", "imp_204", {effects: {renown: 3}, result: L("你盯着前方一块污渍，盯到它成了整个世界。政委从你身边经过，脚步没停。", "You fix on a stain ahead until it's the whole world. The commissar passes you without breaking stride.")}),
      C("去看看那个新兵", "Go and look at the recruit", "imp_204", {effects: {sanity: -5, renown: -2}, result: L("他很年轻，脸朝下，手里攥着一封没寄出去的信。中士揪着领子把你拽回了队列。", "He's young, face down, still clutching an unsent letter. The sergeant hauls you back into line by your collar.")})
    ]};

  N.imp_204 = {chapter: 2, scene: "ship_interior", speaker: QUELL, time: {d: 6},
    text: L("运兵舰机库里，一个机仆在搬弹药箱，嘴里反复哼着半句摇篮曲。\n“它以前是罪犯，”奎尔-7神甫说，“或者欠债的。区别不大。机魂需要双手。”",
            "In the troopship hangar, a servitor hauls ammo crates, humming half a lullaby over and over.\n“It was a criminal once,” says Tech-Priest Quell-7. “Or a debtor. The difference is small. The machine spirit needs hands.”"),
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
    text: L("“机器不会坏，只会生气。”奎尔-7往你的枪托上抹了一道圣油，念了三句二进制祷文。\n“现在它原谅你上次摔了它。”\n他看起来是认真的。",
            "“Machines do not break. They grow angry.” Quell-7 dabs sacred oil on your stock and recites three lines of binary prayer.\n“Now it forgives you for dropping it.”\nHe seems entirely serious."),
    effects: {renown: 3, set: {blessedGun: true}},
    choices: [
      C("谢谢神甫", "Thank the priest", "imp_208")
    ]};

  N.imp_208 = {chapter: 2, scene: "warp", speaker: null, time: {d: 30, warp: true}, eventRoll: 0.35,
    text: L("跃迁警报响了。舷窗全部封死。\n你仍然听见有东西在外面敲船壳，很有礼貌，像在问能不能进来。\n铺位上的老兵用被子蒙住头：“别回答。千万别回答。”",
            "The warp alarm sounds. Every viewport is shuttered.\nYou still hear something tapping on the hull. Politely. As if asking to be let in.\nAn old trooper pulls the blanket over his head. “Don't answer. Whatever you do, don't answer.”"),
    effects: {sanity: -5},
    codex: ["imp_navigator", "chaos_warp"],
    choices: [
      C("握紧祈祷书", "Clutch your prayer book", "imp_209", {effects: {sanity: 5, renown: 2}, result: L("你一页一页地念，念到嗓子发干。敲门声没停，但你不再听得见它。", "You read page after page until your throat is dry. The knocking never stops, but you stop hearing it.")}),
      C("把耳朵贴上船壳", "Press your ear to the hull", "imp_210", {effects: {sanity: -10, corruption: 5}, result: L("船壳冰得像墓碑。敲门声就在你耳朵另一边，一下，又一下，越来越近。", "The hull is cold as a gravestone. The tapping sits just past your ear. Once. Again. Closer.")})
    ]};

  N.imp_210 = {chapter: 2, scene: "warp", speaker: null, time: {h: 3, warp: true},
    text: L("敲门声停了。一个声音用你母亲的语调说：“你冷吗？”\n回过神时，佩尔正死死掐着你的胳膊。\n你的嘴唇在动。你不知道自己刚才答应了什么。",
            "The tapping stops. A voice, in your mother's tone, asks: “Are you cold?”\nWhen you come to, Pell is gripping your arm hard enough to bruise.\nYour lips are moving. You don't know what you just agreed to."),
    effects: {set: {warpWhisper: true}},
    choices: [
      C("什么都别说", "Say nothing to anyone", "imp_209", {result: L("佩尔看着你，你摇了摇头。他再也没问过。", "Pell looks at you. You shake your head. He never asks again.")})
    ]};

  N.imp_209 = {chapter: 2, scene: "ship_interior", speaker: VOSK, time: {d: 1},
    text: L("出亚空间时，日历跳了。有人说过了一个月，有人说过了半年。\n沃斯克只问一句：“死了几个？”\n“三个，长官。没人知道怎么死的。”\n“那就是正常航行。”",
            "When the ship drops out of the warp, the calendar jumps. Some say a month has passed, some say six.\nVosk asks one thing. “How many dead?”\n“Three, Sergeant. Nobody knows how.”\n“Then it was a normal voyage.”"),
    effects: {sanity: 5},
    choices: [
      C("准备登陆", "Prepare to land", "imp_301")
    ]};

  /* ============ Chapter 3 · The Green Tide ============ */
  N.imp_301 = {chapter: 3, scene: "trench", speaker: VOSK, time: {d: 4}, eventRoll: 0.3,
    text: L("尘落星。战壕里的水没过脚踝，远处传来引擎轰鸣和走调的歌声。\n“兽人在唱歌，”沃斯克说，“说明它们心情很好。”\n她把一颗手雷放进你手里，像给小孩一块糖。",
            "Dustfall. Trench water up to your ankles. Engines roar in the distance, along with off-key singing.\n“Orks singing,” Vosk says. “Means they're in a good mood.”\nShe drops a grenade into your palm like candy for a child."),
    codex: ["xenos_ork", "xenos_waaagh", "place_dustfall"],
    choices: [
      C("守在射击位上", "Take your firing step", "imp_302"),
      C("去补给点多领电池", "Run to the dump for extra power packs", "imp_302", {effects: {hp: -5, set: {extraAmmo: true}}, result: L("你在泥水里跑了个来回，摔了两跤，怀里多了四个电池。军需官骂你的话够写一本书。", "You slog there and back through the mud, falling twice, four extra power packs clutched to your chest. The quartermaster's curses could fill a book.")})
    ]};

  N.imp_302 = {chapter: 3, scene: "trench", speaker: null, foe: "ork", time: {h: 3},
    text: L("它们来了。绿色的潮水，扛着比你还大的枪，边冲边笑。\n你开火。激光枪像手电一样一闪一闪，那东西中了五枪还在跑。\n“打头！”有人喊，“那是它们唯一算得上器官的地方！”",
            "Here they come. A green tide hauling guns bigger than you, laughing as they charge.\nYou fire. Your lasgun blinks like a torch. The thing takes five hits and keeps running.\n“Aim for the head!” someone yells. “It's the only organ they've got!”"),
    effects: {hp: -10},
    choices: [
      C("瞄准头部", "Aim for the head", null, R(0.5, "hp", "imp_304", "imp_305", L("你屏住呼吸，等那颗绿脑袋冲进准星。扣扳机的那一下，手指一点没抖。", "You hold your breath until the green head fills your sights. Your trigger finger doesn't shake at all."), L("你的第一枪打掉了它一只耳朵。它笑得更开心了。", "Your first shot takes off an ear. It only laughs harder."))),
      C("扔出手雷，趴下", "Throw the grenade and drop", "imp_304", {effects: {hp: -10, renown: 2}, result: L("手雷炸开，泥浆和碎片泼了你一背。你抬起头，还有一个绿影在往前冲。", "The grenade bursts; mud and shrapnel rain across your back. When you look up, one green shape is still coming.")})
    ]};

  N.imp_304 = {chapter: 3, scene: "trench", speaker: PELL, foe: "ork", time: {h: 1},
    text: L("兽人倒在你一臂远的地方，倒下前还冲你竖了个大拇指。\n佩尔趴在你旁边，笑得发抖：“它在夸你！它在夸你！”\n你没笑。你的手停不下来。",
            "The ork drops an arm's length away—giving you a thumbs-up on the way down.\nPell lies beside you, shaking with laughter. “It complimented you! It complimented you!”\nYou don't laugh. Your hands won't stop shaking."),
    effects: {renown: 5, sanity: -5},
    choices: [
      C("重新装填", "Reload", "imp_306")
    ]};

  N.imp_305 = {chapter: 3, scene: "trench", speaker: VOSK, foe: "ork", time: {h: 1},
    text: L("一把砍刀从烟里劈下来。\n醒来时你躺在战壕底，沃斯克正往你肩膀上倒酒精。\n“帝皇今天不收你，”她说，“嫌你太吵。”",
            "A cleaver swings out of the smoke.\nWhen you wake, you're at the bottom of the trench and Vosk is pouring alcohol on your shoulder.\n“The Emperor doesn't want you today,” she says. “Says you're too loud.”"),
    effects: {hp: -20},
    choices: [
      C("咬牙爬起来", "Grit your teeth and get up", "imp_306")
    ]};

  N.imp_306 = {chapter: 3, scene: "trench", speaker: DRAVIK, foe: "ork_boss", time: {h: 2},
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
      C("继续跑", "Keep running", null, R(0.65, null, "imp_311", "imp_end_commissar", L("你翻过土坡，滚进一辆救护车的阴影里。身后又响了一枪，倒下的不是你。", "You vault a ridge and roll into an ambulance's shadow. Another shot cracks behind you. Someone else drops."), L("你跑得很快。你觉得已经够快了。", "You run fast. You think it's fast enough.")))
    ]};

  N.imp_end_commissar = {chapter: 3, scene: "trench", speaker: CHAP, time: {d: 1},
    text: L("你没听见第二声枪响。\n第二天的阵亡名单上，你的名字后面写着两个字：怯战。\n随军牧师念到这里没有停顿，语气仍然是感恩的。",
            "You never hear the second shot.\nOn the next day's casualty list, your name is followed by one word: cowardice.\nThe regimental priest reads it without pausing. He still sounds grateful."),
    ending: {kind: "bad", title: L("政委的子弹", "The Commissar's Bullet"), cause: L("临阵脱逃，被政委处决", "Shot for desertion")}};

  N.imp_307 = {chapter: 3, scene: "trench", speaker: DRAVIK, foe: "ork_boss", time: {h: 1},
    text: L("你把集束手雷塞进锅炉般的胸甲缝，然后扑倒。\n爆炸后，军阀的半个头盔落在你脚边。政委看了你一眼，在本子上记了一笔。\n这是第一次有人记住你。",
            "You jam a bundle of grenades into a gap in the boiler-plate armour and dive.\nAfter the blast, half the warboss's helmet lands at your feet. The commissar glances at you and writes something down.\nIt's the first time anyone has remembered you."),
    effects: {renown: 10, set: {hero: true}},
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
    text: L("你守着射击位，换了一个又一个电池。兽人退下去时，天已经黑了。\n佩尔坐在空电池堆里掰着手指：“七个。我数了，我打中了七个。”\n他只剩九根手指了。",
            "You hold your firing step, swapping pack after pack. When the orks fall back, it's dark.\nPell sits among the spent cells, counting on his fingers. “Seven. I counted. I hit seven.”\nHe has nine fingers left."),
    effects: {renown: 3, sanity: -5, hp: -5},
    choices: [
      C("帮他包扎", "Bandage his hand", "imp_311", {effects: {sanity: 5}, result: L("你撕下袖子给他缠手。他一直在数，数到七就从头再来。", "You tear off your sleeve to bind his hand. He keeps counting, starting over every time he reaches seven.")})
    ]};

  N.imp_311 = {chapter: 3, scene: "barracks", speaker: ARNO, time: {d: 9},
    text: L("野战医院。阿诺医师给你缝针，嘴里叼着一根没点着的烟。\n“兽人死了会撒孢子，”他说，“明年这里会长出更多兽人。我们不是在打仗，是在除草。”",
            "Field hospital. Medicae Arno stitches you up, an unlit lho-stick between his teeth.\n“Orks shed spores when they die,” he says. “Next year, more orks grow right here. We're not fighting a war. We're weeding.”"),
    effects: {hp: 25},
    choices: [
      C("好好睡一觉", "Get some real sleep", "imp_401", {effects: {sanity: 10}, result: L("你睡了整整十四个小时，没有做梦。醒来时，邻床已经换了三个人。", "You sleep fourteen hours straight, dreamless. When you wake, the next bed has had three different occupants.")}),
      C("多要点止痛药", "Ask for extra painkillers", "imp_401", {effects: {hp: 10, sanity: -5}, result: L("阿诺多给了你两支。疼痛退得很远，远到这副身体好像不是你的。", "Arno slips you two extra. The pain drifts so far away the body no longer feels like yours.")})
    ]};

  /* ============ Chapter 4 · Whispers in the Rain ============ */
  N.imp_401 = {chapter: 4, scene: "ruins", speaker: null, time: {y: 1}, eventRoll: 0.3,
    text: L("一年过去了。团里换了三拨新兵，你已经能闭着眼拆枪。\n部队驻防在雨城维瑟尔。城里人很和善，太和善了。送汤的布琳婆婆每天都来，从不收钱。",
            "A year passes. Three batches of recruits come and go. You can strip your lasgun blindfolded.\nThe regiment garrisons Vessel, a city of endless rain. The locals are kind. Too kind. Old Brin brings soup every day and never takes a coin."),
    effects: {sanity: 15, hp: 10},
    codex: ["place_vessel"],
    choices: [
      C("喝下那碗汤", "Drink the soup", "imp_402", {effects: {hp: 5, corruption: 5}, result: L("你接过碗。布琳在你身边坐下，看着你喝，像看着自己的孩子。", "You take the bowl. Brin sits beside you and watches you drink, like a mother watching her child.")}),
      C("趁她不注意倒掉", "Pour it out when she isn't looking", "imp_403")
    ]};

  N.imp_402 = {chapter: 4, scene: "hive_hab", speaker: BRIN, time: {h: 1},
    text: L("汤很好喝，带点铁锈味。布琳握着你的手：“孩子，你的帝皇在金椅子上坐了一万年，看过你一眼吗？”\n她笑了，“我们的神会看你。”",
            "The soup is good, with a hint of rust. Brin holds your hand. “Child, your Emperor has sat on a golden chair for ten thousand years. Has he ever looked at you once?”\nShe smiles. “Our gods will.”"),
    codex: ["chaos_cult"],
    choices: [
      C("她说得……有点道理", "She... has a point", "imp_404", {effects: {corruption: 10, set: {cultTouched: true}}, result: L("你没有抽回手。布琳笑得更深了：“今晚来地窖，带上你的问题。”", "You don't pull your hand away. Brin's smile deepens. “Come to the cellar tonight. Bring your questions.”")}),
      C("去报告政委", "Report this to the commissar", "imp_405", {result: L("你放下碗，径直去找政委。她听完，只点了一下头。", "You set down the bowl and go straight to the commissar. She hears you out and nods, once.")})
    ]};

  N.imp_403 = {chapter: 4, scene: "ruins", speaker: null, time: {h: 2},
    text: L("你把汤倒进排水沟。一只老鼠喝了几口，没死，反而长出了第三只眼睛，好奇地看着你。\n你决定今晚不睡了。",
            "You pour the soup into the gutter. A rat laps at it. It doesn't die. It grows a third eye and watches you, curious.\nYou decide not to sleep tonight."),
    effects: {sanity: -5},
    codex: ["chaos_mutant"],
    choices: [
      C("跟踪布琳", "Follow Brin", "imp_404"),
      C("去报告政委", "Report this to the commissar", "imp_405", {result: L("你找到政委，说了老鼠和那第三只眼。她没笑。", "You find the commissar and tell her about the rat and its third eye. She doesn't laugh.")})
    ]};

  N.imp_404 = {chapter: 4, scene: "cult_shrine", speaker: S("cult_magus", "镜面人", "The Mirrored Man"), time: {d: 2},
    text: L("你跟着布琳下了地窖。烛光里，几十个人念着一个你听不懂的名字，像一个人在说话。\n台上的人戴着镜面面具：“欢迎。你一直在听，对吗？在船上，那个敲门声。”",
            "You follow Brin down into a cellar. By candlelight dozens chant a name you can't parse, all in one voice.\nThe figure on the dais wears a mirrored mask. “Welcome. You've been listening, haven't you? On the ship. The knocking.”"),
    effects: {sanity: -5, corruption: 5},
    choices: [
      C("接过他递来的匕首", "Take the dagger he offers", "imp_407", {effects: {corruption: 10, set: {cultist: true}}, result: L("你伸出手。念诵声戛然而止，几十双眼睛同时转向你。", "You reach out. The chanting stops dead, and dozens of eyes turn to you at once.")}),
      C("假装入会，打探消息", "Pretend to join and gather intel", "imp_408", {result: L("你学着他们的样子低下头。镜面人看了你很久，面具里映着你自己的脸。", "You bow your head like the rest. The Mirrored Man studies you a long time; his mask shows you your own face.")}),
      C("转身冲出地窖", "Turn and bolt from the cellar", "imp_405", {effects: {sanity: -5}, result: L("你撞翻蜡烛冲上台阶，没人追。他们只是一起笑了一声。", "You knock over candles and bolt up the stairs. Nobody follows. They just laugh, once, all together.")})
    ]};

  N.imp_407 = {chapter: 4, scene: "cult_shrine", speaker: S("cult_magus", "镜面人", "The Mirrored Man"), time: {h: 3},
    text: L("匕首很轻，像本来就是你的。\n“明晚换岗时，有朋友从天上来，”镜面人说，“你只需要打开城门。”\n你的旧伤不疼了。一点都不疼了。",
            "The dagger is light, as if it was always yours.\n“Tomorrow at the change of watch, friends come from the sky,” says the Mirrored Man. “You need only open the gate.”\nYour old wounds stop aching. Not even a twinge."),
    effects: {hp: 20, corruption: 5},
    choices: [
      C("去开城门", "Go and open the gate", "imp_410", {result: L("换岗的钟声响了。你把匕首藏进袖子走向城门，雨水冲掉了你的脚印。", "The watch bell tolls. You tuck the dagger up your sleeve and walk to the gate. The rain washes away your footprints.")}),
      C("把匕首交给政委", "Hand the dagger to the commissar", "imp_405", {effects: {sanity: -5, set: {confessed: true}}, result: L("你把匕首放在政委桌上。它在木头上烫出了一道焦痕。", "You lay the dagger on the commissar's desk. It leaves a scorch mark in the wood.")})
    ]};

  N.imp_408 = {chapter: 4, scene: "cult_shrine", speaker: null, time: {d: 5},
    text: L("你学会了他们的手势和祷词。白天擦枪，夜里念那个名字。每念一次，你就忘掉一点母亲的脸。\n第五晚，有人在你耳边说：“审判庭想见你。别回头。”",
            "You learn their signs and prayers. By day you clean your rifle; by night you chant the name. Each time, a little more of your mother's face fades.\nOn the fifth night someone whispers: “The Inquisition wants a word. Don't turn around.”"),
    effects: {corruption: 10, sanity: -5, renown: 5},
    choices: [
      C("不回头，跟他走", "Don't turn. Follow.", "imp_412", {effects: {set: {spy: true, inqCoin: true}}, result: L("那人往你手心塞了一枚旧硬币：“天亮前带路。”等你终于回头，巷子里只剩下雨。", "The stranger presses an old coin into your palm. “Lead the way before dawn.” When you finally turn, there's only rain.")})
    ]};

  N.imp_405 = {chapter: 4, scene: "cathedral", speaker: HAAK, time: {h: 4},
    text: L("政委一言不发，把你带进大教堂的告解室。里面坐着的不是神父。\n“哈克审判官。”她手里转着一枚旧硬币，“说说那碗汤。慢慢说，我们有一整晚。”",
            "The commissar says nothing. She walks you to the cathedral confessional. The one waiting inside is no priest.\n“Inquisitor Haak.” She turns an old coin across her knuckles. “Tell me about the soup. Slowly. We have all night.”"),
    codex: ["imp_inquisition"],
    choices: [
      C("全说出来", "Tell her everything", "imp_412", {effects: {renown: 5, set: {toldInq: true}}, result: L("你说了汤、地窖、那个念不出的名字。哈克一直在转硬币，直到你说完才停。", "You tell her about the soup, the cellar, the name you can't pronounce. Haak spins her coin the whole time, stopping only when you finish.")}),
      C("隐瞒自己喝过的部分", "Leave out the part where you drank it", null, R(0.6, null, "imp_412", "imp_411", L("你讲得滴水不漏。哈克的硬币顿了一下，又接着转。", "Your story is airtight. Haak's coin pauses once, then spins on."), L("讲到一半，那股铁锈味又涌上了喉咙。哈克的硬币停住了。", "Halfway through, the rust taste rises in your throat again. Haak's coin stops spinning.")))
    ]};

  N.imp_410 = {chapter: 4, scene: "burning_city", speaker: HAAK, time: {h: 20},
    text: L("你的手刚碰到门闩，探照灯就亮了。哈克审判官坐在城墙上晃着腿。\n“谢谢，”她说，“我等这扇门打开等了三周。”\n士兵们举起了枪。佩尔也在里面。",
            "Your hand touches the gate bar and the floodlights snap on. Inquisitor Haak sits on the wall, swinging her legs.\n“Thank you,” she says. “I've waited three weeks for someone to open this door.”\nRifles rise. Pell is among them."),
    effects: {sanity: -5},
    codex: ["imp_inquisition"],
    choices: [
      C("跪下认罪", "Kneel and confess", "imp_411", {result: L("你扔下匕首，跪进泥水里。佩尔的枪口垂下一寸，又抬了起来。", "You drop the dagger and kneel in the mud. Pell's rifle dips an inch, then rises again.")}),
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
      C("求她再给一次机会", "Beg for one more chance", null, R(0.6, "renown", "imp_412", "imp_end_servitor", L("你把这辈子做过的好事全说了一遍。哈克叹了口气，挥手让神甫们退下。", "You list every good deed of your life. Haak sighs and waves the adepts back."), L("哈克耐心听完，看了看时间。神甫们已经在量你的头围了。", "Haak hears you out patiently, then checks the time. The adepts are already measuring your skull."))),
      C("供出镜面人的藏身处", "Give up the Mirrored Man's hideout", "imp_412", {effects: {sanity: -10, renown: -5, set: {informer: true}}, result: L("你说出了地窖的位置，还有布琳的名字。说完，你觉得自己轻了一点，也脏了一点。", "You give up the cellar, and Brin's name. Afterward you feel a little lighter, and a little filthier.")})
    ]};

  N.imp_end_servitor = {chapter: 4, scene: "ship_interior", speaker: S("servitor", "机仆", "Servitor"), time: {y: 3},
    text: L("很多年后，某艘运兵舰的机库里，一个机仆在搬弹药箱。\n它一直哼着半句摇篮曲，没人知道下一句。\n偶尔有新兵停下来看它，好像认出了什么。",
            "Years later, in a troopship hangar, a servitor hauls ammunition crates.\nIt hums half a lullaby, over and over. No one knows the next line.\nNow and then a new recruit stops and stares, as if recognising something."),
    ending: {kind: "bad", title: L("机魂需要双手", "The Machine Needs Hands"), cause: L("被改造成机仆", "Rebuilt as a servitor")}};

  N.imp_412 = {chapter: 4, scene: "cult_shrine", speaker: HAAK, foe: "cult_magus", time: {h: 6},
    text: L("黎明前，审判庭的人冲进地窖，你在前面带路。\n镜面人没逃，反而笑了：“你以为她是来救你们的？她会烧掉整座城，连雨一起。”\n哈克一枪打碎了那面镜子。",
            "Before dawn, Inquisition storm-troopers hit the cellar. You lead the way.\nThe Mirrored Man doesn't run. He laughs. “You think she's here to save you? She'll burn the whole city, rain and all.”\nHaak's shot shatters the mirror."),
    effects: {renown: 5, sanity: -5},
    codex: ["imp_inquisition"],
    choices: [
      C("搜查祭坛", "Search the altar", "imp_413"),
      C("去追逃散的信徒", "Chase the scattering faithful", "imp_415", {effects: {hp: -10, renown: 3}, result: L("你在雨里追了三条街，胳膊挨了一菜刀。抓到的那个人，嘴里还在念那个名字。", "You chase them three streets through the rain and take a kitchen knife across the arm. The one you catch is still chanting that name.")})
    ]};

  N.imp_413 = {chapter: 4, scene: "cult_shrine", speaker: HAAK, time: {h: 1},
    text: L("祭坛上刻着一颗八芒星，每道芒尖渗出不同的颜色：血红、腐绿、幻蓝、艳紫。\n你盯得太久，颜色开始盯着你。哈克捂住你的眼睛：“别数。数完了，你就是他们的了。”",
            "The altar bears an eight-pointed star, each ray bleeding a colour: blood red, rot green, shifting blue, lurid violet.\nYou stare too long. The colours stare back. Haak covers your eyes. “Don't count them. Finish counting and you're theirs.”"),
    effects: {sanity: -5, corruption: 3, set: {sawAltar: true}},
    codex: ["chaos_gods"],
    choices: [
      C("闭上眼，退后", "Close your eyes and step back", "imp_415", {result: L("你闭上眼往后退，差点绊倒。眼皮里，那些颜色还在一圈圈地转。", "You shut your eyes and step back, nearly stumbling. Behind your eyelids, the colours keep turning.")})
    ]};

  N.imp_415 = {chapter: 4, scene: "burning_city", speaker: HAAK, time: {d: 2},
    text: L("两天后，维瑟尔上城区被封锁了。哈克说“净化”，政委说“必要”，没人说“烧”。\n临走前，哈克把那枚旧硬币弹给你：“你眼神不错。哪天我需要一双眼睛，会来找你。”",
            "Two days later, Vessel's upper districts are sealed. Haak says “purged.” The commissar says “necessary.” Nobody says “burned.”\nBefore leaving, Haak flips you her old coin. “You've got good eyes. Some day I'll need a pair. I'll come find you.”"),
    effects: {sanity: -5},
    choices: [
      C("收好硬币", "Pocket the coin", "imp_501", {effects: {set: {inqCoin: true}}, result: L("硬币比看上去沉。你把它缝进了军服内衬。", "The coin is heavier than it looks. You sew it into the lining of your tunic.")}),
      C("把硬币扔进火里", "Toss the coin into the flames", "imp_501", {effects: {sanity: 5, set: {inqCoin: false}}, result: L("硬币在火里翻了个身，就不见了。你觉得自己少欠了某个人一点东西。", "The coin flips once in the flames and is gone. You feel you owe someone a little less.")})
    ]};

  /* ============ Chapter 5 · The Shadow ============ */
  N.imp_501 = {chapter: 5, scene: "warp", speaker: S("psyker", "领航员", "The Navigator"), time: {d: 50, warp: true}, eventRoll: 0.35,
    text: L("第二次跃迁。这一次亚空间很安静，静得不对劲。\n领航员从舱室里走出来，眼角淌着血，只说了一句：“有个影子挡住了光。很大，很饿。”\n然后他再也没开过口。",
            "The second jump. This time the warp is quiet. Wrongly quiet.\nThe Navigator steps out of his chamber, blood at the corners of his eyes, and says one thing: “A shadow is blocking the light. Huge. Hungry.”\nHe never speaks again."),
    effects: {sanity: -5},
    codex: ["xenos_shadow_in_warp"],
    choices: [
      C("抵达目的地", "Arrive", "imp_502")
    ]};

  N.imp_502 = {chapter: 5, scene: "jungle", speaker: VOSK, time: {d: 3},
    text: L("赫斯珀农业星。麦田一望无际，村庄完好，人却少得吓人。剩下的人很友善，身材矮壮，眼神整齐划一。\n“他们笑得一模一样，”沃斯克低声说，“我不喜欢一模一样的东西。”",
            "Hesper, an agri-world. Endless wheat. Villages intact, but far too few people. Those left are friendly and stocky, their eyes moving in unison.\n“They all smile the same,” Vosk mutters. “I don't like things that are the same.”"),
    codex: ["place_hesper"],
    choices: [
      C("去村里的礼拜堂看看", "Check the village chapel", "imp_503"),
      C("去谷仓搜索", "Search the granary", "imp_504")
    ]};

  N.imp_503 = {chapter: 5, scene: "cathedral", speaker: S("preacher", "年轻神父", "Young Priest"), time: {h: 2},
    text: L("礼拜堂的帝皇像被人改过：多了一对手臂，背后画着一颗坠落的星。\n年轻的神父额头有点过高。“救主要来了，”他温柔地说，“从星星上来。我们会被接回家。”",
            "The Emperor's statue in the chapel has been altered: an extra pair of arms, a falling star painted behind it.\nThe young priest's forehead is a little too high. “The saviours are coming,” he says gently. “From the stars. They'll take us home.”"),
    effects: {sanity: -5},
    choices: [
      C("接受他的祝福", "Accept his blessing", "imp_505", {result: L("你低下头。神父的手掌很软，指甲却很长。", "You bow your head. The priest's palm is soft. His nails are very long.")}),
      C("退出去报告", "Back out and report", "imp_506")
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
    text: L("神父把手放在你头顶。一阵暖意，后颈刺了一下，像被虫子咬。\n“现在你是家人了。”\n你有点困。周围的人都在冲你笑，一模一样的笑。",
            "The priest lays a hand on your head. Warmth floods you. Something pricks the back of your neck, like an insect bite.\n“Now you're family.”\nYou feel drowsy. Everyone around you is smiling at you. The very same smile."),
    effects: {sanity: -5, hp: -5, set: {kissed: true}},
    codex: ["xenos_genestealer"],
    choices: [
      C("就睡一会儿", "Just rest a moment", null, R(0.65, "sanity", "imp_506", "imp_end_brood", L("你梦见一颗星坠向麦田，尖叫着醒来，人已经在村子外面。你不记得自己是怎么跑出来的。", "You dream of a star falling on the wheat and wake screaming, already outside the village. You don't remember running."), L("你睡得很沉。梦里有人一遍遍摸着你的头发，叫你“家人”。", "You sleep deeply. In the dream, someone strokes your hair over and over, calling you “family.”"))),
      C("咬破舌头，撞门逃走", "Bite your tongue and break for the door", "imp_506", {effects: {hp: -10}, result: L("血腥味让你清醒过来。你撞开木门，一路跑到看见营地的灯。身后的人还在笑。", "The taste of blood snaps you awake. You smash through the door and run until you see camp lights. Behind you, they're still smiling.")})
    ]};

  N.imp_end_brood = {chapter: 5, scene: "jungle", speaker: null, foe: "genestealer", time: {y: 6},
    text: L("你在赫斯珀住了下来，成了家。孩子的皮肤带点紫色，手臂多了两条，你觉得他们完美无缺。\n某天夜里，天上出现了无数颗星星，越来越近。你带着全家出去迎接。",
            "You settle on Hesper and start a family. Your children's skin has a violet tinge, and they have a few extra arms. You think they're perfect.\nOne night countless stars appear in the sky, drawing closer. You take the whole family outside to welcome them."),
    ending: {kind: "bad", title: L("一家人", "Family"), cause: L("受基因窃取者感染", "Kissed by a genestealer")}};

  N.imp_507 = {chapter: 5, scene: "jungle", speaker: PELL, foe: "genestealer", time: {h: 1},
    text: L("你开了两枪，第三枪还没扣下，它已经扑到眼前。\n是佩尔把你拖了出来。你胸口多了三道口子，他胳膊少了一块肉。\n“这下扯平了，”他喘着气，“那杯咖啡的事。”",
            "You get two shots off. Before the third, it's in your face.\nPell drags you out. You've three new gashes across your chest; he's missing a chunk of his arm.\n“Now we're even,” he pants. “For the recaff.”"),
    effects: {hp: -25, set: {pellSavedYou: true}},
    choices: [
      C("撤回营地", "Fall back to camp", "imp_506")
    ]};

  N.imp_506 = {chapter: 5, scene: "barracks", speaker: VOSK, time: {h: 3},
    text: L("你把看见的告诉了沃斯克。她没笑你，立刻呼叫轨道。\n回电只有一行：“确认虫巢舰队触须，预计四十小时后抵达。坚守。”\n“坚守，”她重复，“他们总是这么说。”",
            "You tell Vosk what you saw. She doesn't laugh. She calls orbit at once.\nThe reply is one line: “Hive-fleet tendril confirmed. Arrival est. forty hours. Hold.”\n“Hold,” she repeats. “They always say that.”"),
    codex: ["xenos_tyranid"],
    choices: [
      C("挖战壕", "Start digging", "imp_509", {effects: {hp: -5}, result: L("你挖了一天一夜，铲柄磨掉了手上一层皮。战壕很深，深得像坟。", "You dig through a day and a night until the shovel strips skin from your palms. The trench is deep. Grave-deep.")}),
      C("去礼拜堂祈祷", "Pray in the chapel", "imp_509", {effects: {sanity: 5, renown: 2}, result: L("礼拜堂里只剩几支蜡烛。你点燃一支，祈祷到它烧完。", "Only a few candles remain in the chapel. You light one and pray until it burns out.")})
    ]};

  N.imp_509 = {chapter: 5, scene: "spore_sky", speaker: VOSK, foe: "gaunt", time: {h: 37},
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
      C("撤向着陆场", "Fall back to the landing field", "imp_516")
    ]};

  N.imp_513 = {chapter: 5, scene: "spore_sky", speaker: null, foe: "tyranid_warrior", time: {h: 1},
    text: L("爆弹打偏了。骨刃落下时，沃斯克把你推开了。\n你最后一次看见她，她在笑，就像她讲过的那个兽人。\n你捡起了她的眼罩。",
            "The shell goes wide. As the bone-blade falls, Vosk shoves you clear.\nThe last time you see her, she's laughing. Just like the ork she told you about.\nYou pick up her eyepatch."),
    effects: {sanity: -10, hp: -10, set: {voskDead: true}},
    choices: [
      C("带着眼罩撤退", "Retreat with the eyepatch", "imp_516")
    ]};

  N.imp_511 = {chapter: 5, scene: "spore_sky", speaker: S("guardsman", "惊慌的母亲", "Frantic Mother"), time: {h: 2},
    text: L("撤离点挤满平民，运输机只能再飞一趟。\n一个母亲把襁褓塞进你怀里：“带她走。”\n舱门正在关闭。只剩一个位置。",
            "The evac point is choked with civilians. The lander can lift once more.\nA mother shoves a bundle into your arms. “Take her.”\nThe hatch is closing. There's one seat left."),
    choices: [
      C("把婴儿送上去", "Hand the baby aboard", "imp_514", {effects: {renown: 5, set: {savedBaby: true}}, result: L("你把襁褓递进舱门，一只手接住了她。舱门在你鼻尖前合拢。", "You pass the bundle through the hatch; a hand takes her. The door seals an inch from your nose.")}),
      C("自己挤上去", "Squeeze aboard yourself", "imp_515", {effects: {renown: -10, sanity: -10, set: {fledHesper: true}}, result: L("你把襁褓塞回母亲怀里。她没骂你，只是看着你。", "You push the bundle back into the mother's arms. She doesn't curse you. She just looks at you.")})
    ]};

  N.imp_514 = {chapter: 5, scene: "spore_sky", speaker: null, foe: "gaunt", time: {h: 4},
    text: L("运输机带着婴儿起飞了。你在孢子雪里打光了最后一个电池，才被最后一架女武神拖上去。\n你没看见那位母亲上来。",
            "The lander lifts with the baby aboard. You fight in the spore-snow until your last power pack is spent, and the final Valkyrie drags you up.\nYou never see the mother come aboard."),
    effects: {hp: -15, sanity: 5},
    choices: [
      C("望着下面的麦田", "Look down at the wheat", "imp_516", {result: L("孢子雪下，麦田变成了紫色，一路紫到地平线。", "Under the spore-snow the wheat turns violet, all the way to the horizon.")})
    ]};

  N.imp_515 = {chapter: 5, scene: "ship_interior", speaker: DRAVIK, time: {h: 1},
    text: L("你挤了上去。舱门合上时，外面有人在喊一个名字，也许是那婴儿的。\n德拉维克政委坐在对面，一路都没看你。\n这比看你更可怕。",
            "You squeeze aboard. As the hatch seals, someone outside screams a name. Maybe the baby's.\nCommissar Dravik sits opposite you and never once looks your way.\nThat's worse than if she had."),
    choices: [
      C("盯着自己的靴子", "Stare at your boots", "imp_516", {result: L("你数着靴子上的泥点。数到第三百个，运输机才不再颠簸。", "You count the mud flecks on your boots. At three hundred, the lander finally stops shaking.")})
    ]};

  N.imp_516 = {chapter: 5, scene: "void", speaker: S("omen_purge", "舰队命令", "Fleet Order"), time: {d: 1},
    text: L("第二天，舰队对赫斯珀执行了灭绝令。你从舷窗看着那颗星球燃烧，像一根被摁灭的烟头。\n“虫子吃不到的，就不算输，”一个军官说。\n没人鼓掌，也没人反对。",
            "Next day, the fleet orders Exterminatus on Hesper. Through the viewport you watch the world burn like a stubbed-out lho-stick.\n“Whatever the bugs can't eat, we haven't lost,” an officer says.\nNobody applauds. Nobody objects."),
    effects: {sanity: -5},
    codex: ["imp_exterminatus"],
    choices: [
      C("转身离开舷窗", "Turn away from the viewport", "imp_601", {result: L("你转过身。那团光在你背后烧了很久，你一直没回头。", "You turn away. The glow burns at your back for a long time. You never look round.")})
    ]};

  /* ============ Chapter 6 · Indomitus ============ */
  N.imp_601 = {chapter: 6, scene: "ship_interior", speaker: S("omen_primarch", "舰内广播", "Shipwide Broadcast"), time: {y: 2},
    text: L("两年，三个团，两次改编。\n这天舰上所有屏幕同时亮起。光里站着一个巨人的剪影，声音平静：“帝国还活着。我们去把它找回来。”\n老兵们哭了。他们说那是基里曼，帝皇之子。",
            "Two years. Three regiments, two renumberings.\nToday every screen aboard lights up at once. A giant's silhouette stands in the light, voice calm: “The Imperium lives. We are going to bring it back.”\nVeterans weep. They say it's Guilliman, a son of the Emperor."),
    effects: {sanity: 20, renown: 5},
    codex: ["imp_guilliman", "imp_indomitus", "place_terra"],
    choices: [
      C("跟大家一起敬礼", "Salute with everyone else", "imp_602", {require: {notFlag: "fledHesper"}, hideIfLocked: true, result: L("全舰几万人同时抬手，甲板都在震。", "Tens of thousands raise their hands at once. The deck trembles.")}),
      C("跟大家一起敬礼", "Salute with everyone else", "imp_604", {require: {flag: "fledHesper"}, hideIfLocked: true, result: L("全舰几万人同时抬手，甲板都在震。", "Tens of thousands raise their hands at once. The deck trembles.")}),
      C("问老兵他是谁", "Ask a veteran who he is", "imp_603")
    ]};

  N.imp_603 = {chapter: 6, scene: "ship_interior", speaker: S("guardsman", "独臂老兵", "One-Armed Veteran"), time: {h: 1},
    text: L("“帝皇有二十个儿子，”老兵说，“一半背叛了他，剩下的死的死、丢的丢。这一个挨了一刀，睡了一万年。”\n他擦擦眼睛，“现在他醒了，还给咱们发新枪。这不是神迹是什么？”",
            "“The Emperor had twenty sons,” the veteran says. “Half betrayed him. The rest died or vanished. This one got stabbed and slept ten thousand years.”\nHe wipes his eyes. “Now he's up and handing out new guns. If that's not a miracle, what is?”"),
    codex: ["chaos_horus_heresy"],
    choices: [
      C("点点头", "Nod", "imp_602", {require: {notFlag: "fledHesper"}, hideIfLocked: true}),
      C("点点头", "Nod", "imp_604", {require: {flag: "fledHesper"}, hideIfLocked: true})
    ]};

  N.imp_602 = {chapter: 6, scene: "barracks", speaker: DRAVIK, time: {d: 10},
    text: L("德拉维克政委把一枚铜徽章别在你领口。\n“下士，”她说，“这意味着以后有人逃跑，由你开枪。”\n她的语气，像在通知今天的口粮是什么。",
            "Commissar Dravik pins a copper badge to your collar.\n“Corporal,” she says. “It means from now on, when someone runs, you take the shot.”\nShe says it the way she'd announce today's rations."),
    effects: {renown: 5, set: {corporal: true}},
    choices: [
      C("敬礼", "Salute", "imp_605", {result: L("你敬了礼。她回礼的动作分毫不差，像一台机器。", "You salute. Her return salute is precise to the millimetre, like a machine.")}),
      C("问她有没有后悔过", "Ask if she has ever regretted it", "imp_605", {effects: {sanity: -5, set: {askedDravik: true}}, result: L("她想了很久：“后悔需要时间。我的时间都拿去换弹匣了。”", "She takes a long time to answer. “Regret takes time. I spend mine changing magazines.”")})
    ]};

  N.imp_604 = {chapter: 6, scene: "barracks", speaker: DRAVIK, time: {d: 10},
    text: L("政委把你叫进办公室，桌上摊着赫斯珀撤离名单。\n“一个座位，”她说，“一个婴儿。”她没拔枪，只是推过来一支笔。\n“签字。下一仗，你去惩戒营第一排。”",
            "The commissar calls you into her office. The Hesper evacuation manifest lies open on her desk.\n“One seat,” she says. “One infant.” She doesn't draw. She slides a pen across.\n“Sign. Next battle, you're in the penal legion's front rank.”"),
    effects: {renown: -5, sanity: -5, set: {penal: true}},
    choices: [
      C("签字", "Sign", "imp_605", {result: L("笔很沉。你签下名字，她吹干墨迹，把纸收进抽屉。", "The pen is heavy. You sign. She blows the ink dry and files it away.")})
    ]};

  N.imp_605 = {chapter: 6, scene: "ship_interior", speaker: MINA, time: {d: 3},
    text: L("一队灵能者被铁链拴着经过走廊。其中一个女孩蒙着眼，指尖结着霜，却准确地转向了你。\n“你住在三号塔附近，”她说，“我梦见过你。你会回家，但家已经着火了。”",
            "A line of chained psykers shuffles down the corridor. One blindfolded girl, frost on her fingertips, turns straight toward you.\n“You lived near Tower Three,” she says. “I dreamed you. You'll go home. But home is on fire.”"),
    effects: {sanity: -5},
    codex: ["imp_psyker"],
    choices: [
      C("米娜？佩尔一直在找你", "Mina? Pell's been looking for you", "imp_607", {require: {flag: "sawMina"}, effects: {sanity: 5}, result: L("她的嘴角动了一下，像是想笑。“替我告诉他，我不冷。”", "Her mouth twitches, almost a smile. “Tell him I'm not cold.”")}),
      C("你看见了什么？", "What did you see?", "imp_607"),
      C("离我远点，巫婆", "Get away from me, witch", "imp_607", {effects: {renown: 2, sanity: -5}, result: L("押送的士兵笑了，用枪托推了她一把。她踉跄一下，还是朝你伸出了手。", "The escort laughs and shoves her with his rifle butt. She stumbles, but still reaches for you.")})
    ]};

  N.imp_607 = {chapter: 6, scene: "warp", speaker: S("omen_black_crusade", "幻象", "Vision"), time: {h: 1},
    text: L("她抓住你的手。一瞬间你看见：故乡的黄色天空裂开，一支黑色舰队从裂口落下，旗舰大得像一座倒悬的城市。\n舰桥上站着一个身穿黑甲的人，胸前有一只睁开的眼。",
            "She grips your hand. In an instant you see it: home's yellow sky splitting open, a black fleet falling through the wound, its flagship vast as an upside-down city.\nOn its bridge stands a figure in black armour, an open eye upon his chest."),
    effects: {sanity: -5, corruption: 3},
    choices: [
      C("挣开她的手", "Wrench your hand free", "imp_608", {result: L("你挣开了手，幻象却没走。之后四天，你一闭眼就看见那只眼睛。", "You pull free, but the vision stays. For four days, every time you close your eyes, you see that eye.")})
    ]};

  N.imp_608 = {chapter: 6, scene: "ship_interior", speaker: S("guard_sergeant", "舰长", "Ship's Captain"), time: {d: 4},
    text: L("四天后，星语者证实了幻象：黑色军团的远征舰队闯进了奥雷克斯星系。\n“阿巴顿，”舰长说出这个名字时，几个老兵下意识摸了摸胸前的护身符。\n舰队调头。你要回家了。",
            "Four days later the astropaths confirm the vision: a Black Legion crusade fleet has broken into the Aurex system.\n“Abaddon,” the captain says. At the name, several veterans touch the charms at their throats without thinking.\nThe fleet turns. You're going home."),
    codex: ["chaos_abaddon", "chaos_black_legion", "chaos_black_crusade", "place_cadia", "chaos_eye_of_terror"],
    choices: [
      C("去找佩尔喝一杯", "Find Pell for a drink", "imp_610"),
      C("去礼拜堂报上家人的名字", "Give your family's names at the chapel", "imp_611", {effects: {renown: 5, sanity: -5}, result: L("执事把名字一个一个写进祈祷簿。写到最后一个，墨水用完了。", "The deacon writes the names into the prayer book one by one. On the last one, the ink runs out.")})
    ]};

  N.imp_610 = {chapter: 6, scene: "barracks", speaker: PELL, time: {h: 3},
    text: L("佩尔弄来一瓶机油味的私酿。“我一直想回家，”他说，“但不是这样回去。”\n他掏出一张旧口粮券：“要是我先死，替我在楼梯间卖一天咖啡。免费的。”",
            "Pell has scrounged a bottle of hooch that tastes like engine oil. “I always wanted to go home,” he says. “Not like this.”\nHe pulls out an old ration chit. “If I die first, sell recaff in the stairwell for a day. Free.”"),
    effects: {sanity: 10, hp: -5, set: {pellPromise: true}},
    choices: [
      C("碰杯", "Clink glasses", "imp_611", {result: L("酒难喝得要命。你们一人喝了半瓶，谁也没提回家以后的事。", "The hooch is vile. You each drink half the bottle, and neither of you mentions what comes after home.")})
    ]};

  N.imp_611 = {chapter: 6, scene: "warp", speaker: null, time: {d: 20, warp: true}, eventRoll: 0.4,
    text: L("这次跃迁颠簸得厉害。亚空间里有东西追着舰队，像鲨鱼闻到了血。\n第三天，船尾整个舱段的人都疯了。他们反锁舱门，用同一个声音唱歌。\n舰长下令抽真空。",
            "This jump is rougher than any before. Something in the warp chases the fleet like a shark scenting blood.\nOn day three, an entire aft section goes mad. They lock themselves in and sing in one voice.\nThe captain orders it vented."),
    effects: {sanity: -5},
    choices: [
      C("堵住耳朵", "Cover your ears", "imp_701", {effects: {sanity: 5}, result: L("你塞上棉絮，捂住耳朵，再蒙上被子。歌声还是渗进来一点，然后停了。", "Cotton in your ears, hands over them, blanket over that. A little of the song still seeps through. Then it stops.")}),
      C("去听那首歌", "Go and listen to the song", "imp_701", {effects: {corruption: 15, sanity: -5, set: {heardSong: true}}, result: L("你贴在舱门上。歌很美，唱的是下水道、蜡烛和一扇会打开的门。然后空气抽空，歌停了。", "You press against the bulkhead. The song is beautiful: drains, candles, a door that will open. Then the air vents, and the song stops.")})
    ]};

  /* ============ Chapter 7 · The Black Crusade ============ */
  N.imp_701 = {chapter: 7, scene: "burning_city", speaker: HALLOW, time: {d: 1},
    text: L("奥雷克斯。黄色的天空裂成了紫色，巢都尖塔烧得像一根巨大的蜡烛。\n哈洛执事站在着陆场上，嗓子哑了，仍在念名单：“……格鲁斯克监工，带着工人用铆钉枪守住了第六工厂。赞美帝皇。”",
            "Aurex. The yellow sky has split violet; the hive spire burns like a giant candle.\nDeacon Hallow stands on the landing field, voice hoarse, still reading names. “...Overseer Grusk, who held Manufactorum Six with his workers and their rivet guns. Praise the Emperor.”"),
    effects: {sanity: -5},
    codex: ["place_manufactorum_six", "imp_great_rift", "place_aurex"],
    choices: [
      C("直接去前线报到", "Report straight to the front", "imp_703", {effects: {renown: 2}, result: L("你没回头看巢都，背起枪就走。哈洛在你身后补念了一句祝福。", "You don't look back at the hive. You shoulder your rifle and go. Hallow tacks a blessing on behind you.")}),
      C("问他三号塔怎么样了", "Ask him about Tower Three", "imp_703", {effects: {sanity: -5, hp: 5}, result: L("哈洛翻了很久名单，最后合上本子，塞给你半块干粮。", "Hallow leafs through his list for a long time, then closes it and hands you half a ration bar.")})
    ]};

  N.imp_703 = {chapter: 7, scene: "trench", speaker: null, foe: "heretic_astartes", time: {h: 9},
    text: L("第一次见到叛变星际战士，你才明白什么叫巨人。\n黑色动力甲，头盔上长角，一步跨过整条壕沟。激光打在它身上，像雨点打在铁皮屋顶。\n它低头看了你一眼，没停。你不值得。",
            "The first time you see a traitor Space Marine, you understand the word “giant.”\nBlack power armour, horned helm. It steps over the whole trench in one stride. Lasfire spatters off it like rain on a tin roof.\nIt glances down at you and walks on. You aren't worth it."),
    effects: {sanity: -5},
    codex: ["chaos_heretic_astartes"],
    choices: [
      C("朝它背包上的管线开火", "Shoot the conduit on its power pack", null, R(0.35, "renown", "imp_704", "imp_705", L("你瞄准那根泛着蓝光的管子，开了一枪。只有一枪，正中。", "You sight the conduit glowing blue and fire. One shot. Dead on."), L("激光打在管线旁的装甲上，只留下一个黑点。巨人停下了脚步。", "Your shot scorches the armour beside the conduit, leaving a black dot. The giant stops walking."))),
      C("缩在泥里，等它走远", "Press into the mud until it passes", "imp_707", {effects: {sanity: -10, hp: -10}, result: L("你把脸埋进泥里，听着它的脚步从头顶跨过。有人没趴下，你听见了。", "You bury your face in the mud as its footsteps pass overhead. Someone didn't get down. You hear it.")})
    ]};

  N.imp_704 = {chapter: 7, scene: "trench", speaker: S("astartes", "星际战士", "Space Marine"), foe: "heretic_astartes", time: {h: 1},
    text: L("那根管子炸出一串火花，巨人踉跄着转过身。\n一道蓝灰色的影子从天而降——一名忠诚的星际战士把它按进了泥里。\n他朝你点了点头。仅此而已，但你会记一辈子。",
            "The conduit spits sparks; the giant staggers and turns.\nThen a blue-grey shape drops from the sky. A loyal Space Marine drives the traitor into the mud.\nHe nods at you. That's all. You'll remember it for the rest of your life."),
    effects: {renown: 10},
    codex: ["imp_astartes"],
    choices: [
      C("回礼", "Return the nod", "imp_707", {result: L("你抬手回礼时，他已经扑向下一个目标。你的手在半空停了很久。", "By the time you raise your hand, he has already leapt toward the next target. Your hand stays up a long time.")})
    ]};

  N.imp_705 = {chapter: 7, scene: "ruins", speaker: null, foe: "heretic_astartes", time: {h: 1},
    text: L("它转过身，随手一挥。你飞出去十几米，撞在墙上。\n你躺在瓦砾里，看着它走远。它甚至没确认你死没死。\n这让你莫名地愤怒。",
            "It turns and swats you aside. You fly a dozen metres into a wall.\nLying in the rubble, you watch it walk on. It doesn't even check whether you're dead.\nFor some reason, that makes you furious."),
    effects: {hp: -25, renown: 3},
    choices: [
      C("爬起来", "Get up", "imp_707")
    ]};

  N.imp_707 = {chapter: 7, scene: "ruins", speaker: BRIN, time: {h: 8}, eventRoll: 0.3,
    text: L("夜里，废墟里响起一个熟悉的声音。是布琳——或者是披着布琳样子的东西。\n她捧着一碗冒热气的汤：“你的帝皇没来，孩子。来的是黑色的战帅。他会让活下来的人吃饱。”",
            "At night in the ruins, a familiar voice. Brin—or something wearing Brin.\nShe holds out a steaming bowl of soup. “Your Emperor didn't come, child. The black Warmaster did. He'll feed whoever survives.”"),
    effects: {sanity: -5, corruption: 5},
    codex: ["chaos_gods"],
    choices: [
      C("喝下那碗汤", "Drink the soup", "imp_708", {effects: {corruption: 20, hp: 30}, result: L("你接过碗。这一次，你没有问汤里放了什么。", "You take the bowl. This time you don't ask what's in it.")}),
      C("开枪", "Shoot", "imp_709", {effects: {sanity: -5}, result: L("激光穿过她的身体，打在后面的墙上。她没倒，只是叹了口气。", "The las-bolt passes through her and hits the wall behind. She doesn't fall. She only sighs.")}),
      C("念出阵亡者的名字", "Recite the names of the dead", "imp_709", {effects: {sanity: 10, renown: 3}, result: L("你从训练营里那个新兵念起。每念一个名字，她就淡一分。", "You begin with the recruit from training camp. With every name you say, she fades a little more.")})
    ]};

  N.imp_708 = {chapter: 7, scene: "ruins", speaker: BRIN, time: {h: 1},
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
      C("去指挥所", "Go to the command post", "imp_710")
    ]};

  N.imp_710 = {chapter: 7, scene: "barracks", speaker: DRAVIK, time: {h: 10},
    text: L("德拉维克把地图摊在弹药箱上。“轨道防御全灭，援军最快七天。我们守七天。”\n她看着你：“你在这儿长大。有什么建议？”\n这是她第一次问别人的意见。",
            "Dravik spreads the map across an ammo crate. “Orbital defences are gone. Relief is seven days out at best. We hold for seven days.”\nShe looks at you. “You grew up here. Suggestions?”\nIt's the first time she has asked anyone's opinion."),
    choices: [
      C("叛军会走第六工厂的下水道", "They'll come through the drains under Six", "imp_711", {require: {flag: "knowRoute"}, hideIfLocked: true, result: L("德拉维克盯着你看了三秒，然后在地图上第六工厂的位置画了个圈。", "Dravik studies you for three seconds, then circles Manufactorum Six on the map.")}),
      C("那首歌里……提到过下水道", "That song... it mentioned the drains", "imp_711", {require: {flag: "heardSong"}, hideIfLocked: true, effects: {sanity: -5}, result: L("你哼出那首歌的一句，自己先打了个寒颤。德拉维克没说话，在第六工厂画了个圈。", "You hum one line of the song and shiver first. Dravik says nothing, and circles Manufactorum Six.")}),
      C("守住大教堂和难民", "Hold the cathedral and the refugees", "imp_712"),
      C("炸掉通往上巢的大桥", "Blow the bridge to the upper hive", "imp_713", {result: L("德拉维克只问了一句：“炸药够吗？”工兵们连夜把桥墩塞满了。", "Dravik asks one question. “Enough charges?” The sappers pack the pylons all night.")})
    ]};

  N.imp_711 = {chapter: 7, scene: "underhive", speaker: DRAVIK, time: {h: 14},
    text: L("你们在下水道口等了一夜。黎明时，第一批邪教徒爬了出来，手里还捧着蜡烛。\n埋伏只用了几分钟。德拉维克没问你是怎么知道的。\n“有些问题，”她说，“最好别问。”",
            "You wait all night at the drain mouth. At dawn the first cultists climb out, still carrying candles.\nThe ambush takes minutes. Dravik doesn't ask how you knew.\n“Some questions,” she says, “are better left unasked.”"),
    effects: {renown: 10},
    choices: [
      C("回到防线", "Return to the line", "imp_714")
    ]};

  N.imp_712 = {chapter: 7, scene: "cathedral", speaker: HALLOW, time: {d: 1},
    text: L("大教堂挤满了难民。哈洛分发最后的圣水——其实就是过滤过的循环水。\n“信仰比水管用，”他说，“但水好歹能喝。”\n外面的炮声一夜没停。",
            "The cathedral is packed with refugees. Hallow hands out the last of the holy water—filtered recyc, really.\n“Faith works better than water,” he says. “But at least water's drinkable.”\nThe guns outside never stop all night."),
    effects: {renown: 5, hp: -10, sanity: 5},
    choices: [
      C("帮他分水", "Help him hand it out", "imp_714", {result: L("你把水一杯杯递出去。一个孩子喝完，把空杯还给你：“谢谢帝皇。”", "You pass the water out cup by cup. A child drinks, hands back the empty cup and says, “Thank the Emperor.”")})
    ]};

  N.imp_713 = {chapter: 7, scene: "burning_city", speaker: DRAVIK, time: {h: 6},
    text: L("桥塌了，叛军坦克被挡在下巢。一起被挡在下面的，还有三万个没撤上来的工人。\n德拉维克在报告上写：“战术必要。”\n她写字的手很稳。你的不稳。",
            "The bridge falls. The traitor tanks are stranded below. So are thirty thousand workers who didn't make it up in time.\nDravik writes in her report: “Tactically necessary.”\nHer hand is steady. Yours is not."),
    effects: {sanity: -5, renown: 5},
    choices: [
      C("别去想", "Don't think about it", "imp_714", {result: L("你努力不去想。可一闭上眼，你就听见桥下有人在敲铁板。", "You try not to think about it. But whenever you close your eyes, you hear someone below the bridge banging on metal.")})
    ]};

  N.imp_714 = {chapter: 7, scene: "burning_city", speaker: PELL, time: {d: 5}, eventRoll: 0.3,
    text: L("第五天。你已经不记得上次睡觉是什么时候。\n佩尔被流弹击中，倒在你怀里，把一张旧口粮券塞进你手心：“楼梯间……免费的……”\n远处，一个巨大的黑影降落在巢都尖顶。",
            "Day five. You can't remember the last time you slept.\nA stray round takes Pell. He falls into your arms and presses an old ration chit into your hand. “The stairwell... free...”\nIn the distance, a vast black shape lands atop the hive spire."),
    effects: {sanity: -5, set: {pellDead: true}},
    choices: [
      C("抱着他直到最后", "Hold him until it's over", "imp_801", {effects: {sanity: 5}, result: L("你抱着他，直到他的手变凉。那张口粮券被你攥出了汗。", "You hold him until his hand goes cold. The ration chit is damp in your fist.")}),
      C("放下他，回到阵地", "Lay him down and go back to the line", "imp_801", {effects: {renown: 5, sanity: -5}, result: L("你合上他的眼睛，把他放在沙袋后面。回到阵地，你的枪比以前更准了。", "You close his eyes and lay him behind the sandbags. Back on the line, your aim is better than ever.")})
    ]};

  /* ============ Chapter 8 · Last Rites ============ */
  N.imp_801 = {chapter: 8, scene: "hive_spire", speaker: S("omen_black_crusade", "阿巴顿的声音", "Abaddon's Voice"), time: {h: 6},
    text: L("巢都尖顶。你们小队守着星语塔的电梯，塔里的星语者还在向外求救。\n广播响了。一个低沉的声音，不急不慢：“你们的神是一具尸体。跪下的人可以活。”\n是阿巴顿。他甚至没提高音量。",
            "The hive spire. Your squad guards the lift to the astropathic tower, where the astropaths are still calling for help.\nThe vox crackles. A deep, unhurried voice: “Your god is a corpse. Those who kneel may live.”\nAbaddon. He doesn't even raise his voice."),
    effects: {sanity: -5, corruption: 5},
    codex: ["chaos_abaddon", "chaos_black_crusade", "place_astropath_tower"],
    choices: [
      C("砸掉广播", "Smash the vox-caster", "imp_802", {result: L("你用枪托砸了三下，广播才哑掉。他的最后一个字还在走廊里回荡。", "Three blows of your rifle butt silence the vox. His last word still echoes down the corridor.")}),
      C("唱圣歌盖过他", "Sing a hymn over him", "imp_802", {effects: {renown: 5, sanity: 5}, result: L("你起了个头，跑调了。然后小队里每个人都跟着唱，跑得一样厉害。", "You start the hymn off-key. Then the whole squad joins in, just as off-key.")}),
      C("在心里……数一数跪下的好处", "Quietly weigh the benefits of kneeling", "imp_802", {effects: {corruption: 20, hp: 15}, result: L("你没跪，只是算了算。伤口忽然不疼了，像有人替你记下了这笔账。", "You don't kneel. You only do the sums. Your wounds stop hurting, as if someone has noted the account.")})
    ]};

  N.imp_802 = {chapter: 8, scene: "hive_spire", speaker: DRAVIK, foe: "heretic_astartes", time: {h: 2},
    text: L("电梯门开了。走出来三个黑色军团的战士，个个比门框还高。\n德拉维克拔出链锯剑：“替我记住这一刻。总得有人记得。”",
            "The lift doors open. Out step three Black Legion warriors, each taller than the doorframe.\nDravik draws her chainsword. “Remember this moment for me. Someone has to.”"),
    effects: {sanity: -5, hp: -10},
    choices: [
      C("跟她一起冲", "Charge with her", null, R(0.4, "hp", "imp_804", "imp_805", L("你紧跟政委冲进去，边跑边开火，枪管烧得发红。", "You charge in on the commissar's heels, firing as you run, barrel glowing red."), L("冲到一半，一只铁拳朝你当头砸下。", "Halfway there, an iron fist comes down at your head."))),
      C("把手雷绑上电梯缆绳", "Strap your grenades to the lift cables", "imp_807", {require: {stat: "renown", min: 40}, result: L("你扑向电梯井，把手雷一颗颗绑上缆绳。德拉维克明白了，把三个巨人往轿厢里逼。", "You dive for the shaft and lash grenade after grenade to the cables. Dravik sees it and drives the giants back into the car.")}),
      C("在侧面掩护射击", "Give covering fire from the flank", "imp_805", {effects: {sanity: -5}, result: L("你从侧面开火，激光在黑甲上溅起火星。一个巨人转过身，朝你走来。", "You fire from the flank; las-bolts spark off black armour. One giant turns and comes for you.")})
    ]};

  N.imp_804 = {chapter: 8, scene: "hive_spire", speaker: DRAVIK, foe: "heretic_astartes", time: {h: 1},
    text: L("你不知道自己是怎么活下来的。只记得政委的剑在尖叫，你的枪烫得握不住，最后一个巨人倒下时砸碎了半面墙。\n德拉维克靠墙坐下，伤得很重，还在换弹匣。",
            "You don't know how you survived. You remember the commissar's sword screaming, your gun too hot to hold, the last giant falling and smashing half a wall.\nDravik slumps against the wall, badly hurt, still changing her magazine."),
    effects: {renown: 15, hp: -20},
    choices: [
      C("扶她起来", "Help her up", "imp_806", {result: L("她甩开你的手，自己站了起来。“去塔顶，”她说，“看看我们在替谁守。”", "She shakes off your hand and stands on her own. “Go up the tower,” she says. “See who we're holding for.”")})
    ]};

  N.imp_805 = {chapter: 8, scene: "hive_spire", speaker: null, foe: "heretic_astartes", time: {h: 1},
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
    text: L("你爬上星语塔顶。十几个星语者围坐成圈，嘴里念着同一句话，已经念了七天。\n其中一个忽然停下，空洞的眼眶转向你：“有回应了。不是星际战士。是……更大的东西。”\n她笑了，嘴角流着血。",
            "You climb to the top of the tower. A dozen astropaths sit in a circle chanting one phrase, as they have for seven days.\nOne suddenly stops and turns her empty sockets toward you. “An answer. Not the Space Marines. Something... bigger.”\nShe smiles, blood at the corner of her mouth."),
    effects: {sanity: 10},
    choices: [
      C("握住她的手", "Hold her hand", "imp_808", {effects: {sanity: 5}, result: L("她的手冷得像冰，却握得很紧。你们一起等着，谁也没说话。", "Her hand is ice-cold but grips tight. You wait together, saying nothing.")}),
      C("冲到窗边看天", "Rush to the window", "imp_808", {effects: {renown: 3}, result: L("窗外还是紫色的天。你盯着裂隙，一直盯到眼睛发疼。", "Outside, the sky is still violet. You stare at the rift until your eyes ache.")})
    ]};

  N.imp_808 = {chapter: 8, scene: "throne_light", speaker: S("omen_primarch", "无畏远征舰队", "Indomitus Fleet"), time: {h: 12},
    text: L("第七天黎明，天空的裂口里亮起一道金光。\n不是太阳。是一整支蓝金色的舰队，多得遮住了裂隙。广播里那个平静的声音响起：“奥雷克斯，我们来了。”\n黑色舰队开始撤退。",
            "Dawn, day seven. A golden light ignites in the rift across the sky.\nNot the sun. A whole fleet of blue and gold, enough to blot out the wound. That calm voice comes over the vox: “Aurex. We are here.”\nThe black fleet begins to withdraw."),
    effects: {sanity: 20, renown: 10},
    codex: ["imp_indomitus", "imp_guilliman"],
    choices: [
      C("掏出审判官的硬币", "Take out the Inquisitor's coin", "imp_end_inquisition", {require: {flag: "inqCoin"}, result: L("硬币在金光里发烫。半小时后，一架没有标记的穿梭机落在塔顶。", "The coin grows warm in the golden light. Half an hour later, an unmarked shuttle lands on the tower.")}),
      C("登上远征舰队", "Join the crusade fleet", "imp_end_crusade", {require: {stat: "renown", min: 50}, result: L("你在征兵站排了一整天队。登记官问你的名字，你想了一会儿才答上来。", "You queue all day at the muster point. When the clerk asks your name, it takes you a moment to remember.")}),
      C("留下，重建家园", "Stay and rebuild your home", "imp_end_hold", {result: L("你走下星语塔，搬起了第一块砖。", "You climb down from the tower and lift the first brick.")}),
      C("躲开那道光", "Shrink away from the light", "imp_end_purged", {require: {stat: "corruption", min: 60}, hideIfLocked: true, result: L("光照到你时，皮肤像被烫了一下。你躲进阴影，祈祷没人看见。", "Where the light touches you, your skin flinches as if scalded. You slip into shadow and pray nobody saw.")})
    ]};

  N.imp_end_hold = {chapter: 8, scene: "hive_hab", speaker: HALLOW, time: {y: 1},
    text: L("一年后，你站在重建的楼梯间里，卖掺三成水的再生咖啡。今天免费。\n哈洛念阵亡名单，念到佩尔时放慢了，像在道谢。\n帝皇从没看过你一眼。但你看见了他的人民。",
            "A year later you stand in the rebuilt stairwell selling recaff, a third of it water. Free today.\nHallow reads the names of the dead. At Pell's he slows down, like a thank-you.\nThe Emperor never looked your way. But you saw his people."),
    ending: {kind: "good", title: L("防线未破", "The Line Held"), cause: L("留守故乡，重建巢都", "Stayed home to rebuild")}};

  N.imp_end_crusade = {chapter: 8, scene: "void", speaker: S("omen_primarch", "远征舰队", "Crusade Fleet"), time: {d: 30},
    text: L("你登上了蓝金色的战舰。新军服，新番号，新的一万光年。\n启航时，你最后看了一眼故乡的天空。那道裂隙还在，像一道永远合不上的伤口。\n但至少，现在有人在缝它了。",
            "You board a blue-and-gold warship. New uniform, new regiment, ten thousand new light-years.\nAs the fleet departs you take a last look at home's sky. The rift is still there, a wound that will never close.\nBut at least someone is stitching it now."),
    codex: ["imp_great_rift"],
    ending: {kind: "good", title: L("无畏远征", "Indomitus"), cause: L("随远征舰队离去", "Left with the crusade fleet")}};

  N.imp_end_inquisition = {chapter: 8, scene: "ship_interior", speaker: HAAK, time: {d: 2},
    text: L("穿梭机里，哈克审判官在剥一个橘子。“你还留着它，”她瞥了眼硬币，“很好。”\n“从今天起你不存在了。你会去很多地方，看很多不该看的东西，然后决定谁活。”\n她递给你半个橘子。",
            "In the shuttle, Inquisitor Haak is peeling an orange. “You kept it,” she says, eyeing the coin. “Good.”\n“From today, you don't exist. You'll go many places, see many things you shouldn't, and decide who lives.”\nShe hands you half the orange."),
    ending: {kind: "good", title: L("审判庭之眼", "Eyes of the Inquisition"), cause: L("成为审判官的侍从", "Became an Inquisitor's acolyte")}};

  N.imp_end_purged = {chapter: 8, scene: "cathedral", speaker: S("inquisitor", "审判庭清查官", "Inquisitorial Auditor"), time: {d: 3},
    text: L("胜利之后，审判庭开始清查。他们只用一盏灯，照一照你的眼睛。\n灯光里，你的影子多了一只手。\n他们很有礼貌，甚至给了你一碗热汤。",
            "After the victory, the Inquisition begins its audit. They use a single lamp and shine it in your eyes.\nIn its light, your shadow has an extra hand.\nThey're very polite. They even bring you a bowl of hot soup."),
    ending: {kind: "bad", title: L("光下的影子", "Shadow in the Light"), cause: L("腐化败露，被审判庭清除", "Purged by the Inquisition")}};

  /* ============ Death nodes (engine-triggered) ============ */
  N.imp_death_hp = {scene: "ruins", speaker: null,
    text: L("你倒下的地方没有墓碑，只有一个编号。\n多年后，某位执事念到这个编号，语气依旧感恩。\n帝国从不缺人。它只缺时间。",
            "Where you fall there's no headstone, only a number.\nYears later, some deacon reads that number aloud, still sounding grateful.\nThe Imperium never runs short of people. Only of time."),
    ending: {kind: "death", title: L("无名之墓", "Unmarked Grave"), cause: L("战死，葬于无名墓", "Killed in action, unmarked grave")}};

  N.imp_death_sanity = {scene: "barracks", speaker: ARNO,
    text: L("你开始笑，停不下来。阿诺医师给你打了一针，又一针。\n后来你被送进一座安静的修道院。那里的人都穿着束缚衣，都在数墙上别人看不见的眼睛。",
            "You start laughing and can't stop. Medicae Arno gives you a shot, then another.\nLater you're sent to a quiet monastery where everyone wears restraints and counts eyes on the walls that no one else can see."),
    ending: {kind: "death", title: L("数眼睛的人", "Counting Eyes"), cause: L("理智崩溃", "Mind shattered")}};

  N.imp_death_corruption = {scene: "warp", speaker: S("sigil_undivided", "亚空间", "The Warp"),
    text: L("那个敲船壳的声音，终于等到了回答。\n你的皮肤在发光，你的影子在说话。政委的子弹来得很快，但还是晚了一步——从你身上爬出来的东西，已经开始笑了。",
            "The knocking on the hull finally gets its answer.\nYour skin glows. Your shadow speaks. The commissar's bullet comes fast, but a moment too late. The thing climbing out of you has already begun to laugh."),
    ending: {kind: "death", title: L("开门的回答", "The Answer at the Door"), cause: L("被亚空间之物附身", "Possessed by the warp")}};

  WH.registerFaction({
    id: "imperium",
    name: L("人类帝国", "Imperium of Man"),
    tagline: L("一万亿人之一，被帝皇选中", "One in a trillion, chosen by the Emperor"),
    role: L("巢都工人", "Hive worker"),
    playerSprite: "player_imperium",
    color: "#c9a227",
    startNode: "imp_101",
    startDate: {year: 111, mill: 42},
    startStats: {hp: 100, sanity: 100, corruption: 0, renown: 10},
    renownLabel: L("信仰", "Faith"),
    renownIcon: "icon_faith",
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
