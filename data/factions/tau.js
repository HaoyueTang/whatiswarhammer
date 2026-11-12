/* data/factions/tau.js — T'au route (text role).
 * Player: human colonist on New Calder (T'au name Dal'nor), a former Imperial world that joined the T'au Empire.
 * Becomes a Gue'vesa auxiliary. Start 111.M42.
 * Helpers: L(zh,en) localized string; S(sprite,zh,en) speaker; C(zh,en,next,extra) choice (extra may carry result:L(..));
 *          R(p,stat,ok,ko,okRes,koRes) roll — okRes/koRes are L(..) beats emitted as rollResult {success,fail} (SPEC §11).
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
  function R(p, stat, success, fail, okRes, koRes) {
    var o = {roll: {p: p, stat: stat, success: success, fail: fail}};
    if (okRes && koRes) o.rollResult = {success: okRes, fail: koRes};
    return o;
  }
  function M(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }   // merge (adds grudge / require to a roll choice)

  var VASH  = S("tau_water_caste", "瓦尚使节", "Envoy Vash'aun");
  var RENA  = S("preacher", "雷娜姨", "Aunt Rena");
  var JORY  = S("gue_vesa", "乔里", "Jory");
  var KELRA = S("tau_warrior", "凯尔拉", "Shas'ui Kel'ra");
  var GRRAK = S("kroot", "格拉克萨", "Grrak'tha");
  var D92   = S("tau_drone", "92号", "Drone 92");
  var ORIN  = S("tau_ethereal", "奥林长者", "Aun'el Orin");

  var N = {};

  /* ============ Chapter 1 · New Neighbours ============ */
  N.tau_101 = {chapter: 1, scene: "tau_city", speaker: null,
    text: L("新卡尔德，现在叫达尔诺尔。\n六年前，帝国的船不再来了。三年前，白色的船来了。总督签了字，广场上的帝皇像换成了一个光滑的圆环。\n你在港口卸货。钛人发工钱，从不迟到一天。",
            "New Calder. Dal'nor, now.\nSix years ago the Imperial ships stopped coming. Three years ago the white ships came. The governor signed, and the Emperor's statue in the square became a smooth ring.\nYou unload cargo at the port. The T'au pay wages, never a day late."),
    codex: ["tau_empire", "place_dalnor", "imp_great_rift"],
    choices: [
      C("去港口上工", "Head to the docks", "tau_102", {result: L("汽笛响了。今天码头不开工——所有人都被叫去听演讲。", "The whistle blows. No unloading today: everyone is called to hear a speech.")}),
      C("先去看看雷娜姨", "Visit Aunt Rena first", "tau_103", {result: L("人类街区的巷子还是老样子。雷娜姨家的门没锁，屋里有股蜡烛味。", "The human quarter's alleys haven't changed. Rena's door is unlocked; the room smells of candle wax.")})
    ]};

  N.tau_102 = {chapter: 1, scene: "tau_city", speaker: VASH, time: {h: 2}, gather: L("码头", "Docks"),
    text: L("码头上，几百个工人围着一块屏幕。水族使节瓦尚在演讲，笑容完美得像量过尺寸。\n“每个种族都为大义贡献最擅长的东西。人类的勤劳，我们非常珍视。”\n屏幕上，人类的工钱一栏比钛人短一截。",
            "On the docks, a few hundred workers crowd round a screen. The water-caste envoy Vash'aun is speaking, his smile perfect, as if measured.\n“Every race gives the Greater Good what it does best. Human diligence is something we treasure.”\nOn the screen, the human wage column is a little shorter than the T'au one."),
    codex: ["tau_water_caste", "tau_greater_good", "place_dalnor_port"],
    choices: [
      C("跟着鼓掌", "Applaud with the others", "tau_104", {effects: {renown: 5}, result: L("你拍着手。瓦尚的目光扫过人群，在你身上停了一瞬，满意地移开。", "You clap along. Vash'aun's gaze sweeps the crowd, rests on you a moment, and moves on, satisfied.")}),
      C("举手问工钱的事", "Raise your hand about the wages", "tau_105", {result: L("掌声停了。周围的工友同时往旁边让开半步，好像你身上有病。", "The applause stops. The workers around you all shift half a step away, as if you're contagious.")})
    ]};

  N.tau_103 = {chapter: 1, scene: "hive_hab", speaker: RENA, time: {h: 2},
    text: L("雷娜姨以前是殖民地教堂的执事。教堂关了，她还每天擦那张空讲台。\n她从围裙里掏出一枚双头鹰吊坠，又迅速塞回去。\n“乔里今天穿了钛人的衣服，”她说，“我儿子，穿得像个圆圈。”",
            "Aunt Rena used to be the colony chapel's deaconess. The chapel is closed; she still dusts the empty pulpit every day.\nShe pulls a two-headed eagle pendant from her apron, then quickly tucks it away.\n“Jory wore T'au clothes today,” she says. “My son, dressed like a circle.”"),
    codex: ["imp_imperium", "place_human_quarter"],
    choices: [
      C("帮她把吊坠藏好", "Help her hide the pendant well", "tau_103a", {effects: {sanity: 5, set: {knowAquila: true}}, result: L("你把吊坠缝进她围裙的夹层。针刚穿过最后一道，窗外传来轻轻的嗡声。", "You sew the pendant into a fold of her apron. As the needle makes its last pass, a soft hum comes from the window.")}),
      C("劝她扔掉它", "Tell her to get rid of it", "tau_104", {effects: {renown: 3, set: {renaDistrust: true}}, result: L("雷娜姨看了你很久，把吊坠攥得更紧了。“你也开始说圆圈话了。”", "Rena looks at you a long while and grips the pendant tighter. “Now you talk like a circle too.”")})
    ]};

  N.tau_103a = {chapter: 1, scene: "hive_hab", speaker: S("tau_drone", "巡逻无人机", "Patrol Drone"), foe: "tau_drone", time: {h: 1},
    text: L("一架巡逻无人机停在窗外，红光一寸一寸扫进屋里。\n你侧身挡在雷娜姨前面，冲它笑了笑，像在码头上冲监工笑那样。\n红光在你脸上停了很久，才移开。雷娜姨在你背后攥住了你的衣角。",
            "A patrol drone stops outside the window; its red light sweeps the room inch by inch.\nYou step in front of Aunt Rena and smile at it, the way you smile at a foreman on the docks.\nThe light rests on your face a long time before it moves on. Behind you, Rena grips your shirt."),
    effects: {sanity: -3, set: {logged: true}},
    choices: [
      C("等它飞走", "Wait for it to leave", "tau_104", {result: L("嗡声远了。雷娜姨拍拍你的手：“你是个好孩子。”你知道你的脸已经进了某张表格。", "The hum fades. Rena pats your hand. “You're a good child.” You know your face is in a table somewhere now.")})
    ]};

  N.tau_105 = {chapter: 1, scene: "tau_city", speaker: VASH, foe: "tau_drone", time: {h: 1},
    text: L("瓦尚的笑容一丝没变。“这是一个暂时的误会，”他说，“大义按贡献分配，而贡献是可以成长的。”\n一架无人机悄悄飘到你面前，红光扫过你的脸。\n“谢谢你的提问，”他说，“我们会记住它。”",
            "Vash'aun's smile does not shift a millimetre. “A temporary misunderstanding,” he says. “The Greater Good allots by contribution, and contribution can grow.”\nA drone drifts silently up to you. A red light sweeps your face.\n“Thank you for your question,” he says. “We will remember it.”"),
    effects: {sanity: -5, set: {flagged: true}},
    choices: [
      C("道歉，退回人群", "Apologise and step back", "tau_104", {effects: {renown: 2}, result: L("你低头道歉。无人机的红光熄灭了，瓦尚朝你点头，像在表扬一个学生。", "You bow your head and apologise. The drone's red light goes out. Vash'aun nods at you like a teacher praising a pupil.")}),
      C("坚持要一个答案", "Insist on an answer", "tau_106", {result: L("瓦尚只是微笑，转向下一个提问。无人机跟着你回了家，一直飘在窗外。", "Vash'aun only smiles and takes the next question. The drone follows you home and hovers outside your window.")})
    ]};

  N.tau_106 = {chapter: 1, scene: "tau_city", speaker: VASH, time: {h: 10},
    text: L("当晚，一张淡蓝色的卡片出现在你门缝里：“诚邀参加一次友好的对话。茶点由大义提供。”\n对话室很干净，椅子很舒服。瓦尚为你倒茶：“我们来澄清一下误会。”\n房间里没有窗户。",
            "That night a pale blue card appears under your door: “You are warmly invited to a friendly dialogue. Refreshments courtesy of the Greater Good.”\nThe dialogue room is spotless, the chair comfortable. Vash'aun pours your tea. “Let us clear up the misunderstanding.”\nThe room has no windows."),
    effects: {sanity: -5},
    choices: [
      C("说你完全想通了", "Say you understand completely now", "tau_104", {effects: {renown: 5, sanity: -5, set: {smiledForVash: true}, taint: {tzeentch: 15}}, result: L("这句话说出口时，比你想的容易。瓦尚给你续了茶，笑容更深了。", "The words come out easier than you expected. Vash'aun refills your cup, his smile deepening.")}),
      C("喝茶，不说话", "Drink the tea, say nothing", "tau_104", {effects: {renown: -3, set: {silentTea: true}}, result: L("茶是甜的。你喝完一杯又一杯，一个字也没说。三小时后，门开了。瓦尚在本子上写了一行。", "The tea is sweet. You drink cup after cup without a word. Three hours later the door opens. Vash'aun writes one line in his notes.")}),
      C("再问一次工钱", "Ask about the wages again", null, R(0.5, "sanity", "tau_104", "tau_end_reeducation", L("瓦尚沉默片刻，竟然记下了你的问题。“我们会研究。”门开了，你可以走了。", "Vash'aun pauses, then actually notes your question down. “We will study it.” The door opens. You may go."), L("瓦尚叹了口气，按下桌上的一个按钮。“看来，我们需要更多时间。”门锁咔哒一响。", "Vash'aun sighs and presses a button on the desk. “It seems we need more time.” The lock clicks.")))
    ]};

  N.tau_end_reeducation = {chapter: 1, scene: "tau_city", speaker: VASH, time: {y: 2},
    text: L("对话进行了很久。两年。\n你出来时晒不到太阳，脸色白了些，说话慢了些，见人就笑，笑得完美得像量过尺寸。\n码头上的老工友在街上认不出你。你也不太记得他们了。这是一个暂时的误会。",
            "The dialogue goes on a long time. Two years.\nYou come out pale from no sun, slower of speech. You smile at everyone, a smile so perfect it looks measured.\nYour old workmates from the docks pass you in the street without recognising you. You don't quite remember them either. A temporary misunderstanding."),
    ending: {kind: "bad", title: L("友好的对话", "A Friendly Dialogue"), cause: L("被水族“对话”改造", "Re-educated by the water caste")}};

  N.tau_104 = {chapter: 1, scene: "tau_city", speaker: ORIN, time: {d: 3}, jump: L("三天后，城中广场", "Three days later, the city square"),
    text: L("三天后，以太族长者奥林从钛星来视察。他走过时，火族战士全都单膝跪下，连无人机都降低了高度。\n他只说了几句话，广场就静得像水面。\n你也平静下来——是从周围那些脸上一张张传过来的。",
            "Three days later the Ethereal Aun'el Orin, come from the T'au homeworld itself, visits. As he passes, every fire warrior drops to one knee; even the drones fly lower.\nHe says a few words, and the square goes still as water.\nYou grow calm too: it spreads to you from the faces around you, one by one."),
    codex: ["tau_ethereal", "tau_castes", "place_tau_homeworld"],
    alt: [
      {if: {flag: "flagged"}, add: L("你看见瓦尚在长者身后，朝你轻轻点了点头。", "Behind the elder you see Vash'aun give you the slightest nod.")}
    ],
    choices: [
      C("跟着跪下", "Kneel with them", "tau_108", {effects: {renown: 5, sanity: 5, taint: {all: -5}, set: {knelt: true}}, result: L("你跪下去，膝盖碰到冰凉的石板。周围的平静像温水，漫过你的头顶。", "You kneel; the stone is cool under your knees. The calm around you rises over your head like warm water.")}),
      C("偷偷观察钛人士兵的表情", "Quietly study the soldiers' faces", "tau_108", {effects: {set: {noticedCalm: true, sawString: true}}, result: L("火族战士的脸同时松弛下来。太一致了，像同一根线同时被拉了一下。那根线，没有系在你身上。", "Every fire warrior's face relaxes the same way, as if one string were pulled through them all. That string isn't tied to you.")})
    ]};

  N.tau_108 = {chapter: 1, scene: "tau_city", speaker: null, time: {d: 6}, gather: L("净水站", "Water station"),
    text: L("人类街区新开了净水站，不收钱，长队里全是熟面孔。\n雷娜姨——以前教堂的执事——排在队里；她儿子乔里穿着钛人的衣服，帮老人提桶。\n一架无人机记下每个来打水的人。墙上贴着征兵海报。",
            "A new water station has opened in the human quarter: free, and the long queue is all familiar faces.\nAunt Rena, once the chapel's deaconess, waits in line; her son Jory, in T'au clothes, carries buckets for the old folk.\nA drone logs everyone who drinks. A recruiting poster hangs on the wall."),
    effects: {hp: 10, sanity: 5},
    codex: ["place_human_quarter", "tau_earth_caste"],
    alt: [
      {if: {flag: "renaDistrust"}, add: L("雷娜姨看见你，把围裙往怀里拢了拢。", "Rena sees you and pulls her apron closer.")},
      {if: {flag: "origin_pow"}, add: L("你借住在雷娜姨家，乔里朝你挥手。", "You lodge with Rena; Jory waves you over.")}
    ],
    choices: [
      C("喝一大口", "Take a long drink", "tau_107", {effects: {renown: 3, set: {logged: true}}, result: L("水凉得发甜。无人机“嘀”了一声，把你记进了某张表格。", "The water is cold and sweet. The drone chirps, and you go into a table somewhere.")}),
      C("朝无人机挥挥手", "Wave at the drone", "tau_107", {effects: {sanity: 3, set: {wavedDrone: true}}, result: L("无人机停顿了一下，冲你点了点机身。排队的孩子们笑成一片。", "The drone pauses, then dips its body at you in a nod. The children in the queue burst out laughing.")})
    ]};

  N.tau_107 = {chapter: 1, scene: "tau_city", speaker: JORY, time: {d: 10},
    text: L("十天后，征兵站前排起长队。人类辅助军，钛语叫“古维萨”：待遇好，口粮足，还发一副真正的护甲。\n乔里第一个签了名，兴奋得脸通红：“一起吧！我们也能成为大义的一部分！”",
            "Ten days later a long queue snakes from the recruiting post. Human auxiliaries—gue'vesa in T'au: good pay, full rations, real armour.\nJory signs first, flushed with excitement. “Come on! We can be part of the Greater Good too!”"),
    codex: ["tau_gue_vesa"],
    alt: [
      {if: {flag: "joryHero"}, add: L("“你说过的，”他冲你挤眼，“等他们自己走进去。”", "“You said it,” he winks. “Wait till they walk in themselves.”")},
      {if: {flag: "tradeCard"}, text: L("十天后，征兵站前排起长队。瓦尚的报名卡还压在你钱箱底下：许可只给入伍者本人。货摊，你已托给码头的老船工。\n乔里第一个签了名，兴奋得脸通红：“一起吧！我们也能成为大义的一部分！”", "Ten days later, a long queue at the recruiting post. Vash'aun's card is still under your cash box: the licence goes only to recruits. You've left the stall with the old boatman.\nJory signs first, flushed. “Come on! We can be part of the Greater Good too!”")},
      {if: {flag: "origin_trader"}, text: L("十天后，征兵站前排起长队。货摊你已托给码头的老船工；瓦尚说过，许可是“暂时的”，只给入伍者本人。\n乔里第一个签了名，兴奋得脸通红：“一起吧！我们也能成为大义的一部分！”", "Ten days later, a long queue at the recruiting post. You've left your stall with the old boatman; Vash'aun said the licence is ‘temporary’, and only for recruits.\nJory signs first, flushed. “Come on! We can be part of the Greater Good too!”")},
      {if: {flag: "origin_pow"}, add: L("又是一块要按手印的屏幕。这一次，没人逼你。", "Another screen to press your palm to. This time no one is making you.")}
    ],
    choices: [
      C("跟乔里一起报名", "Sign up with Jory", "tau_107b", {effects: {renown: 5}, result: L("你在屏幕上按下手印。乔里一把搂住你的肩，笑得像个孩子。", "You press your palm to the screen. Jory throws an arm around your shoulders, grinning like a boy.")}),
      C("答应雷娜姨看着他，报名", "Sign up to keep an eye on him for Rena", "tau_107b", {effects: {sanity: 5, set: {promisedRena: true}}, result: L("队伍后面，雷娜姨抓住你的手：“看着他。”你点头，在乔里后面签了名。", "Behind you in the queue, Rena grips your hand: “Watch over him.” You nod, and sign right after Jory.")}),
      C("先不签，再想想", "Not yet. Think it over", "tau_107a", {effects: {sanity: 3}, result: L("你从队伍里退出来。乔里愣了一下，冲你耸耸肩：“那我先走一步。”", "You step out of the queue. Jory blinks, then shrugs. “I'll go on ahead, then.”")})
    ]};

  N.tau_107a = {chapter: 1, scene: "hive_hab", speaker: RENA, time: {d: 7}, jump: L("一周后，人类街区", "A week later, the human quarter"),
    text: L("一周后。乔里随第一批去了丛林前哨。\n街区的配给少了一成，古维萨的家属却多领一份。雷娜姨塞给你半块面包，没问你为什么还不走。\n第二天，你又站到了征兵屏幕前。",
            "A week later. Jory has gone with the first batch to the jungle outpost.\nRations in the quarter are cut by a tenth; gue'vesa families draw an extra share. Aunt Rena slips you half a loaf and doesn't ask why you're still here.\nNext day you're back at the recruiting screen."),
    effects: {hp: -5, set: {lateSigner: true}, taint: {nurgle: 10}},
    choices: [
      C("按下手印", "Press your palm to it", "tau_107b", {effects: {renown: 2}, result: L("屏幕亮了一下。登记员说，下一班船三天后开。“你迟到了，”他说，“不过大义不记仇。”", "The screen flashes. The clerk says the next boat leaves in three days. “You're late,” he says. “But the Greater Good holds no grudges.”")})
    ]};

  /* ============ Origin prologues (SPEC §16) · merge at tau_104 ============ */
  /* --- 归顺的星界军俘虏 / Turned Guardsman (origin_pow) --- */
  N.tau_o_pow_1 = {chapter: 1, scene: "tau_outpost", speaker: VASH,
    text: L("大裂隙把你的驻防团困在了海湾这一边。你们在一颗无名卫星上守了十一天，然后投降了。\n战俘营没有铁丝网，只有一道蓝光。每天两顿热饭。\n水族使节瓦尚微笑着问每个人：“你愿意为什么而活？”",
            "The Great Rift stranded your garrison regiment on this side of the Gulf. You held a nameless moon for eleven days, then surrendered.\nThe prison camp has no wire, only a line of blue light. Two hot meals a day.\nThe water-caste envoy Vash'aun smiles and asks each of you: “What would you like to live for?”"),
    codex: ["tau_empire", "tau_water_caste", "place_damocles_gulf"],
    choices: [
      C("“为了吃饱。”", "“A full belly.”", "tau_o_pow_2", {effects: {hp: 5, renown: 3}, result: L("瓦尚记下你的回答，像记下一个可以接受的价格。“诚实。很好。”", "Vash'aun notes your answer like an acceptable price. “Honest. Good.”")}),
      C("“为了帝皇。”", "“The Emperor.”", "tau_o_pow_2", {effects: {sanity: 5, renown: -3, set: {powDefiant: true}}, result: L("瓦尚的笑容没变，在你名字旁画了个小记号。那天的晚饭，你的那份照样是热的。", "Vash'aun's smile doesn't change; he makes a small mark by your name. Your dinner that night is still hot.")})
    ]};

  N.tau_o_pow_2 = {chapter: 1, scene: "tau_outpost", speaker: S("guard_sergeant", "马洛中士", "Sergeant Marrow"), time: {d: 30}, gather: L("战俘营食堂", "Camp mess"),
    text: L("一个月后，战俘营食堂里的人分成了两拨：签了字的坐一边，马洛中士那拨坐另一边。\n中士每晚带剩下的人念祷词，声音一晚比一晚小。\n“你要是签了，”他说，“帝皇会记得。我也会。”",
            "A month on, the camp mess has split in two: those who signed sit on one side, Sergeant Marrow's lot on the other.\nEach night the sergeant leads the rest in prayer, a little quieter every night.\n“If you sign,” he says, “the Emperor will remember. So will I.”"),
    effects: {sanity: -5},
    codex: ["imp_guard", "tau_greater_good"],
    alt: [
      {if: {flag: "powDefiant"}, add: L("他听说了你那句“为了帝皇”，给你留了个座。", "He heard about your “The Emperor”, and kept you a seat.")}
    ],
    choices: [
      C("签字，选择大义", "Sign. Choose the Greater Good.", "tau_o_pow_3", {effects: {renown: 5, sanity: -5, set: {powSigned: true}}, result: L("你在屏幕上按下手印。马洛中士背过身去，祷词里少了一个声音。", "You press your palm to the screen. Sergeant Marrow turns his back; the prayer is one voice short.")}),
      C("再陪中士念一晚祷词", "Pray with the sergeant one last night", "tau_o_pow_2a", {effects: {sanity: 5, taint: {all: -5}}, result: L("你在中士身边坐下。签了字的那一桌安静了一瞬，又接着吃饭。", "You sit down beside the sergeant. The signed table falls quiet a moment, then goes back to eating.")})
    ]};

  N.tau_o_pow_2a = {chapter: 1, scene: "tau_outpost", speaker: S("guard_sergeant", "马洛中士", "Sergeant Marrow"), time: {h: 6},
    text: L("最后一晚，祷词只剩三个声音。念完，马洛中士把一串木念珠塞进你手里。\n“签吧，”他说，“活下去的人，才能替死人记得。”\n天亮时你按下了手印。他没有看。",
            "On the last night only three voices are left praying. When it's done, Sergeant Marrow presses a string of wooden beads into your hand.\n“Sign,” he says. “Only the living can remember for the dead.”\nAt dawn you press your palm to the screen. He doesn't watch."),
    effects: {set: {malosRosary: true, prayerToken: true}},
    choices: [
      C("把念珠收进口袋", "Pocket the beads", "tau_o_pow_3", {effects: {sanity: 3}, result: L("念珠磨得很光，带着中士手上的油。你把它和配给卡放在一起。", "The beads are worn smooth, oily from the sergeant's hands. You keep them with your ration card.")})
    ]};

  N.tau_o_pow_3 = {chapter: 1, scene: "hive_hab", speaker: RENA, time: {d: 10}, jump: L("十天后，运抵达尔诺尔", "Ten days later, shipped to Dal'nor"),
    text: L("签了字的人被装上运输船，十天后到了达尔诺尔。你借住在人类街区的雷娜姨家，她以前是教堂的执事。\n她看见你袖口的星界军线头，眼眶红了。\n她儿子乔里却只想听钛人是怎么赢的。",
            "Those who signed are shipped out and reach Dal'nor ten days later. You lodge with Aunt Rena in the human quarter; she was once the chapel's deaconess.\nShe sees the old Guard threads on your cuff and her eyes fill.\nHer son Jory only wants to hear how the T'au won."),
    codex: ["place_dalnor", "place_human_quarter", "imp_imperium"],
    choices: [
      C("跟雷娜姨讲帝国", "Tell Rena about the Imperium", "tau_104", {effects: {sanity: 5, set: {knowAquila: true}}, result: L("你讲大教堂和阅兵，不讲政委和战壕。雷娜姨从围裙里掏出一枚双头鹰吊坠，攥了很久。", "You tell of cathedrals and parades, not commissars and trenches. Rena draws an eagle pendant from her apron and holds it a long time.")}),
      C("跟乔里讲钛人怎么赢的", "Tell Jory how the T'au won", "tau_104", {effects: {renown: 3, set: {joryHero: true}}, result: L("“他们等，”你说，“等到你自己走进去。”乔里听得两眼发亮。厨房里，雷娜姨摔了一只碗。", "“They wait,” you say. “Until you walk in yourself.” Jory's eyes shine. In the kitchen, Rena drops a bowl.")})
    ]};

  /* --- 港口商人 / Port trader (origin_trader) --- */
  N.tau_o_trader_1 = {chapter: 1, scene: "tau_city", speaker: null, gather: L("港口集市", "Port market"),
    text: L("达尔诺尔的港口集市，摊贩挤成一排，两边的货都有人叫卖。第七泊位后面那个小货摊是你的。\n帝国的船不来以后，旧圣像、双头鹰吊坠成了稀罕货；钛人的电池在走私船上也一样。你两边都卖。",
            "Dal'nor's port market: stalls crammed in a row, hawkers crying both sides' goods. The little stall behind Berth Seven is yours.\nSince the Imperial ships stopped coming, old icons and eagle pendants have grown rare; so have T'au power cells, out on the smugglers' boats. You sell to both."),
    codex: ["tau_empire", "place_dalnor", "place_dalnor_port"],
    choices: [
      C("清点今天的货", "Count today's stock", "tau_o_trader_2", {effects: {set: {knowBatteries: true}}, result: L("柜台底下压着两箱激光枪电池，戳印是“奥雷克斯二号·第六工厂”。走私船换来的，两边都有人要。", "Under the counter sit two crates of lasgun power cells, stamped ‘Aurex Secundus · Manufactorum Six’. Smuggler goods. Both sides want them.")}),
      C("去码头打听走私船", "Ask after the smugglers' boat", "tau_o_trader_2", {effects: {renown: -3, set: {knowSmuggler: true}}, result: L("老船工朝海面努努嘴：“今晚，没灯的那艘。第七泊位底下有条水道。”他收下了你一包烟。", "The old boatman jerks his chin at the water. “Tonight. The one without lights. There's a channel under Berth Seven.” He pockets your smokes.")})
    ]};

  N.tau_o_trader_2 = {chapter: 1, scene: "tau_city", speaker: RENA, time: {h: 4},
    text: L("雷娜姨又来买蜡烛，一次只买一根，付的是钛人发的工钱。她以前是教堂的执事。\n她压低声音：“有没有……那种吊坠？”\n你柜台底下就有三枚。她儿子乔里在门口等，穿着钛人的衣服，假装没听见。",
            "Aunt Rena, once the chapel's deaconess, comes for candles again, one at a time, paid in T'au wages.\nShe lowers her voice. “Do you have... one of those pendants?”\nThere are three under your counter. Her son Jory waits at the door in T'au clothes, pretending not to hear."),
    codex: ["place_human_quarter", "imp_imperium"],
    choices: [
      C("白送她一枚", "Give her one for free", "tau_o_trader_3", {effects: {sanity: 5, renown: -2, set: {knowAquila: true}}, result: L("雷娜姨把吊坠缝进围裙夹层，拍了拍你的手。门口，乔里叹了口气。", "Rena sews the pendant into a fold of her apron and pats your hand. At the door, Jory sighs.")}),
      C("照价卖给她", "Sell it at full price", "tau_o_trader_3", {effects: {hp: 5, set: {soldRena: true}}, result: L("她把钱数了三遍，才把吊坠揣进怀里。今晚你能吃上肉了。", "She counts the coins three times before tucking the pendant away. Tonight you'll eat meat.")})
    ]};

  N.tau_o_trader_3 = {chapter: 1, scene: "tau_city", speaker: S("tau_drone", "海关无人机", "Customs Drone"), time: {d: 5},
    text: L("海关无人机在你的货摊上空悬停了三天。第四天，它把一份清单投在柜台上：十二枚吊坠，四十块电池，一件不差。\n最后一行写着：“贡献可以成长。请考虑另一种申报方式。”",
            "A customs drone hovers over your stall for three days. On the fourth it projects a list onto your counter: twelve pendants, forty power cells, every one accounted for.\nThe last line reads: “Contribution can grow. Please consider another form of declaration.”"),
    effects: {sanity: -5},
    codex: ["tau_drone", "tau_greater_good"],
    choices: [
      C("烧掉剩下的吊坠", "Burn the remaining pendants", "tau_o_trader_4", {effects: {renown: 5, sanity: -5}, result: L("吊坠在火盆里熔成一摊金水。无人机“嘀”了一声，飘走了。", "The pendants melt into a puddle of gold in the brazier. The drone chirps and drifts away.")}),
      C("把吊坠藏上走私船", "Hide them on the smugglers' boat", "tau_o_trader_4", {require: {flag: "knowSmuggler"}, effects: {renown: -5, set: {hidStock: true}}, result: L("你半夜把货搬上没灯的船。第二天无人机又来了，这回它什么也没投。", "At midnight you move the stock onto the unlit boat. Next day the drone returns. This time it projects nothing.")})
    ]};

  N.tau_o_trader_4 = {chapter: 1, scene: "tau_city", speaker: VASH, time: {d: 2},
    text: L("瓦尚亲自来到你的货摊，挑了一根蜡烛，付了双倍的钱。\n“你很懂两边的价格，”他微笑，“大义需要这样的人。古维萨辅助军的入伍者本人，享有优先贸易许可。”\n他放下一张淡蓝色的报名卡。",
            "Vash'aun visits your stall himself, chooses a candle, and pays double.\n“You understand both sides' prices,” he smiles. “The Greater Good needs such people. Gue'vesa recruits themselves enjoy priority trade licences.”\nHe sets down a pale blue enlistment card."),
    codex: ["tau_water_caste"],
    choices: [
      C("收下报名卡", "Take the card", "tau_104", {effects: {renown: 5, set: {tradeCard: true}}, result: L("卡片比看上去沉。瓦尚走后，你把它压在了钱箱底下。", "The card is heavier than it looks. Once Vash'aun leaves, you tuck it under the cash box.")}),
      C("问他许可管几年", "Ask how long the licence lasts", "tau_104", {effects: {sanity: 5, set: {askedTerms: true}}, result: L("“暂时的，”瓦尚说，“和一切一样。”你记住了他回答之前停顿的那半秒。", "“Temporary,” says Vash'aun. “Like everything.” You note the half-second pause before he answered.")})
    ]};

  /* ============ Chapter 2 · The Way of Fire ============ */
  N.tau_107b = {chapter: 2, scene: "tau_city", speaker: RENA, time: {d: 3}, bridge: true, gather: L("码头", "Docks"),
    text: L("三天后清晨，达尔诺尔港。新兵排队登上去丛林前哨的平底运输船，码头上挤满了送行的人。\n雷娜姨站在人群最前面，一直看着乔里，好像要把他的样子背下来。\n汽笛响了。",
            "Three days later, at dawn: Port Dal'nor. Recruits file onto flat-bottomed transports bound for the jungle outpost, and the docks are packed with people seeing them off.\nAunt Rena stands at the front of the crowd, watching Jory as if memorising him.\nThe whistle blows."),
    alt: [
      {if: {flag: "lateSigner"}, text: L("三天后清晨，达尔诺尔港，码头上挤满了送行的人。你是这一班里的迟到者——乔里一周前就走了。\n雷娜姨也来了，往你兜里塞了个煮蛋：“替我看看他。”\n汽笛响了。", "Three days later, at dawn: Port Dal'nor, the docks packed with people seeing recruits off. You're the late one on this boat; Jory left a week ago.\nAunt Rena came anyway and pushes a boiled egg into your pocket. “Look in on him for me.”\nThe whistle blows.")},
      {if: {flag: "promisedRena"}, add: L("她隔着人群冲你做了个口型：看着他。", "Across the crowd she mouths it at you: watch him.")},
      {if: {flag: "renaDistrust"}, add: L("她看了你一眼，又转回去看乔里。", "She glances at you once, then back at Jory.")}
    ],
    choices: [
      C("上船", "Board", "tau_201", {result: L("船顺着河口开进丛林。岸上的人越来越小，最后只剩一片挥动的手。", "The boat noses up the estuary into the jungle. The people on shore shrink to a field of waving hands.")})
    ]};

  N.tau_201 = {chapter: 2, scene: "tau_outpost", speaker: KELRA, time: {d: 1},
    text: L("丛林前哨。教官是火族的凯尔拉，比你矮半头，蓝灰皮肤，额头中间有一道竖纹。\n“你们的身体很弱，”她说，“这是事实，不是侮辱。所以我们远距离杀敌。”\n她递给你一支脉冲步枪，轻得不像武器。",
            "The jungle outpost. Your instructor is Kel'ra of the fire caste: half a head shorter than you, blue-grey skin, a vertical slit in the middle of her brow.\n“Your bodies are weak,” she says. “That is fact, not insult. So we kill from far away.”\nShe hands you a pulse rifle, too light to feel like a weapon."),
    codex: ["tau_fire_caste", "place_frontier_outpost"],
    alt: [
      {if: {flag: "lateSigner"}, add: L("“你晚了一周，”她说，“敌人不会等你想清楚。”", "“You are a week late,” she says. “The enemy will not wait for you to decide.”")}
    ],
    choices: [
      C("接过步枪", "Take the rifle", "tau_202", {effects: {renown: 3}, result: L("步枪轻得像玩具。你的第一枪打飞了，凯尔拉面无表情地记下分数。", "The rifle is light as a toy. Your first shot goes wide; Kel'ra records the score without expression.")}),
      C("问她为什么不练近身格斗", "Ask why you don't train close combat", "tau_203", {result: L("几个新兵偷笑。凯尔拉额头的竖纹微微收紧。", "A few recruits snicker. The slit on Kel'ra's brow tightens slightly.")})
    ]};

  N.tau_203 = {chapter: 2, scene: "tau_outpost", speaker: KELRA, time: {h: 1},
    text: L("“近身格斗，是计划失败的最后结果。”凯尔拉说，“我们不喜欢失败。”\n她朝营地另一头抬了抬下巴，那边有几个长着鸟喙的高大身影在磨刀。\n“近的部分，交给克鲁特。”",
            "“Close combat is the final result of a failed plan,” Kel'ra says. “We dislike failure.”\nShe nods toward the far side of camp, where tall beaked figures are sharpening blades.\n“The close part, we leave to the Kroot.”"),
    choices: [
      C("盯着那些鸟喙", "Stare at the beaks", "tau_202", {effects: {sanity: -3}, result: L("一个克鲁特抬起头，冲你张开了喙。你先移开了眼睛。", "One of the Kroot looks up and opens its beak at you. You look away first.")}),
      C("走过去打个招呼", "Walk over and say hello", "tau_202", {effects: {hp: -2, set: {metGrrakEarly: true}}, result: L("最高的那个克鲁特闻了闻你的手，用刀背敲了敲你的护甲。“软，”他说，“但不跑。好。”", "The tallest Kroot sniffs your hand and taps your armour with the flat of his blade. “Soft,” he says. “But doesn't run. Good.”")})
    ]};

  N.tau_202 = {chapter: 2, scene: "tau_outpost", speaker: D92, time: {d: 10}, eventRoll: 0.35,
    text: L("土族给每个小队配了一架无人机。你的那架编号92，跟着你飞，像一只有礼貌的铁皮鸟。\n你每次脱靶，它都会在你开枪前半秒轻轻“哔”一声。\n它比你先知道你会打偏。",
            "The earth caste issues every squad a drone. Yours is number 92. It follows you like a polite tin bird.\nEvery time you're about to miss, it gives a soft beep half a second before you fire.\nIt knows you'll miss before you do."),
    codex: ["tau_drone", "tau_earth_caste"],
    alt: [
      {if: {flag: "wavedDrone"}, add: L("你认出了它的划痕：就是净水站旁那架。它也认出了你。", "You know its scratches: the drone from the water station. It knows you too.")}
    ],
    choices: [
      C("给它起个名字", "Give it a name", "tau_204", {effects: {sanity: 5, set: {namedDrone: true}}, result: L("你想了一整晚，给它起了个名字。它毫无反应。第二天早上，它在你床头哔了两声。", "You spend a night choosing a name. It gives no sign. Next morning, it beeps twice by your bunk.")}),
      C("叫它闭嘴", "Tell it to shut up", "tau_204", {effects: {renown: 2, set: {droneSilent: true}}, result: L("它安静了，退到你身后三米。从此你脱靶之前，再也没人提醒你。", "It goes quiet and drops back three metres. From then on, nobody warns you before you miss.")})
    ]};

  N.tau_204 = {chapter: 2, scene: "tau_outpost", speaker: GRRAK, time: {d: 5},
    text: L("克鲁特的塑形者格拉克萨正在吃一只沙蜥，连骨头一起。\n“克鲁特吃什么，就变成什么，”他咂咂嘴，“吃了沙蜥，跑得快。吃了聪明的敌人，就聪明。”\n他打量你：“人类……不好吃。太犹豫。”",
            "The Kroot shaper Grrak'tha is eating a sand-lizard, bones and all.\n“Kroot become what Kroot eat,” he says, smacking his beak. “Eat lizard, run fast. Eat clever enemy, get clever.”\nHe looks you over. “Humans... not tasty. Too much hesitation.”"),
    codex: ["tau_kroot"],
    alt: [
      {if: {flag: "metGrrakEarly"}, add: L("“软的那个，”他认出了你，“不跑的那个。”", "“The soft one,” he says, recognising you. “The one who doesn't run.”")}
    ],
    choices: [
      C("接过他递来的一块肉", "Accept the piece he offers", "tau_205", {effects: {hp: 5, sanity: -5, set: {ateWithKroot: true, grrakBond: true}}, result: L("肉又韧又腥，还带着沙子。你咽下去时，格拉克萨满意地咔哒着喙：“现在，你记得沙蜥了。”", "The meat is tough, rank and gritty. As you swallow, Grrak'tha clicks his beak in approval. “Now you remember the lizard.”")}),
      C("礼貌地拒绝", "Politely decline", "tau_205", {result: L("格拉克萨耸耸肩，把那块也吞了。“犹豫，”他说，“看吧。”", "Grrak'tha shrugs and swallows that piece too. “Hesitation,” he says. “See?”")})
    ]};

  N.tau_205 = {chapter: 2, scene: "jungle", speaker: KELRA, time: {d: 20}, jump: L("训练第三周，丛林", "Week three of training, the jungle"),
    text: L("伏击训练。凯尔拉让你趴在泥里十四个小时，一动不动。\n“猎人要有耐心，”她说，“等猎物自己走进陷阱，这叫‘考尤’。然后一击致命，这叫‘蒙卡’。”\n第九个小时，一只虫子爬进了你的领口。",
            "Ambush drill. Kel'ra has you lie motionless in the mud for fourteen hours.\n“A hunter must be patient,” she says. “Wait for the prey to walk into the trap. That is Kauyon. Then, one killing blow. That is Mont'ka.”\nIn hour nine, a bug crawls down your collar."),
    codex: ["tau_kauyon"],
    choices: [
      C("一动不动", "Don't move", null, R(0.5, "sanity", "tau_206", "tau_207", L("虫子爬过你的脊背，又爬了出去。你数着心跳，一直数到第十四个小时。", "The bug crawls down your spine and out again. You count heartbeats until hour fourteen."), L("虫子停在你脖子上，咬了一口。你的手自己动了。", "The bug stops on your neck and bites. Your hand moves on its own."))),
      C("让92号帮你赶走它", "Let Drone 92 shoo it away", "tau_206", {require: {flag: "namedDrone"}, hideIfLocked: true, result: L("92号无声地降下来，用气流把虫子吹走，又悄悄升回原位。", "Drone 92 sinks without a sound, blows the bug away with its downdraft, and rises back into place.")})
    ]};

  N.tau_206 = {chapter: 2, scene: "jungle", speaker: KELRA, time: {h: 5},
    text: L("第十四个小时，凯尔拉从你身边的草丛里站起来——你根本不知道她一直在那儿。\n“合格，”她说，又补了一句，“对人类来说，很好。”\n她不知道这后半句有多伤人，或者她知道。",
            "Hour fourteen. Kel'ra rises from the grass right beside you. You never knew she was there.\n“Passed,” she says. Then, after a moment: “For a human, very good.”\nShe doesn't know how much that second part stings. Or she does."),
    effects: {renown: 8, taint: {slaanesh: 10}},
    choices: [
      C("站起来敬礼", "Stand and salute", "tau_208", {result: L("你的腿麻得发抖，敬礼歪了。凯尔拉还了你一个标准的礼。", "Your legs are numb and shaking; your salute comes out crooked. Kel'ra returns a perfect one.")})
    ]};

  N.tau_207 = {chapter: 2, scene: "jungle", speaker: KELRA, foe: "tau_drone", time: {h: 5},
    text: L("你一巴掌拍在脖子上。下一秒，一个训练标记弹打在你后背上。\n“你死了，”凯尔拉说，“明天再来。”\n92号在你头顶转了一圈，哔了一声，听起来像叹气。",
            "You slap your neck. A second later a training marker hits you square in the back.\n“You are dead,” Kel'ra says. “Again tomorrow.”\nDrone 92 circles above you and beeps once. It sounds like a sigh."),
    effects: {sanity: -5, hp: -5, set: {failedAmbush: true}},
    choices: [
      C("明天再来", "Again tomorrow", "tau_208", {effects: {renown: 3}, result: L("第二天你又趴进泥里。第三天，第四天。第五天，你终于没动。", "Next day you're back in the mud. And the next. On the fifth day, you finally don't move.")})
    ]};

  N.tau_208 = {chapter: 2, scene: "tau_city", speaker: JORY, time: {d: 30}, jump: L("两个月后，回城结业", "Two months on, graduation in the city"),
    text: L("两个月后，结业典礼在达尔诺尔城里举行。每个人都领到一个钛语名字。乔里的新名字意思是“锐利的溪流”，他念了一晚。\n你的名字被念错了两次。\n钛人穿合金甲，你们穿复合板。“更轻便，”瓦尚说。",
            "Two months in, graduation is held back in Dal'nor city. Everyone receives a T'au name. Jory's means “keen stream”; he repeats it all night.\nYours is mispronounced twice.\nThe T'au wear alloy; you get composite plate. “Lighter,” Vash'aun explains."),
    alt: [
      {if: {flag: "failedAmbush"}, add: L("伏击考核你补考了五次，名字排在名单最后一个。", "You took the ambush test five times; your name is last on the list.")}
    ],
    choices: [
      C("接受你的钛语名字", "Accept your T'au name", "tau_209", {effects: {renown: 5, taint: {slaanesh: 10}}, result: L("新名字在嘴里很陌生。乔里替你念了三遍，比你念得还准。", "Your new name feels foreign in your mouth. Jory says it for you three times, better than you can.")}),
      C("坚持用自己的名字", "Keep your own name", "tau_209", {effects: {sanity: 5, set: {keptName: true}}, result: L("登记官愣了一下，在名字栏里留了空。瓦尚微笑：“没关系，暂时的。”", "The registrar hesitates, then leaves the name field blank. Vash'aun smiles. “No matter. Temporarily.”")})
    ]};

  N.tau_209 = {chapter: 2, scene: "ship_interior", speaker: S("gue_vesa", "老哈斯克", "Old Hask"), time: {d: 6}, gather: L("运兵船舱", "Troop hold"), jump: L("结业第六天，运兵船", "Six days after graduation, troopship"),
    text: L("结业第六天，运兵船舱里挤满了古维萨，有人打牌有人睡觉。老哈斯克擦枪的手法和钛人教的不一样。\n“我以前是星界军，”他说，“整个团投降了。钛人给饭吃。帝国呢？会因为我们打输了枪毙我们。”",
            "Six days after graduation the troop hold is packed with gue'vesa playing cards and sleeping. Old Hask cleans his rifle, not the way the T'au teach.\n“I was Imperial Guard,” he says. “Whole regiment surrendered. The T'au fed us. The Imperium? Would've shot us for losing.”"),
    codex: ["imp_guard", "place_tau_transport"],
    alt: [
      {if: {flag: "powSigned"}, add: L("他瞟了眼你的袖口：“第一批签的？我也是。”", "He eyes your cuff. “Signed early? Me too.”")}
    ],
    choices: [
      C("问他后不后悔", "Ask if he regrets it", "tau_300", {effects: {sanity: -3}, result: L("老哈斯克擦枪的手停了停。“后悔？我还活着。”他低下头，再没说话。", "Old Hask's hands pause on the rifle. “Regret? I'm alive.” He goes back to cleaning and says nothing more.")}),
      C("学他的擦枪方法", "Learn his way of cleaning a rifle", "tau_300", {effects: {renown: 3, set: {haskTaught: true}}, result: L("他教得很慢，手指全是老茧。“帝国别的不行，”他说，“擦枪这件事，没人比得上。”", "He teaches slowly, fingers all calluses. “The Imperium's bad at most things,” he says. “Nobody beats it at cleaning a gun.”")}),
      C("报出你旧团的番号", "Name your old regiment", "tau_300", {require: {flag: "origin_pow"}, hideIfLocked: true, effects: {sanity: 5, renown: 3, set: {haskTaught: true}}, result: L("老哈斯克的手停了。“我们团就在你们隔壁。”他把擦枪布撕了一半给你，教你怎么让脉冲枪不过热。", "Old Hask's hands stop. “My lot were dug in next to yours.” He tears his rag in half for you and shows you how to keep a pulse rifle cool.")})
    ]};

  /* ============ Chapter 3 · Green Skins ============ */
  N.tau_300 = {chapter: 3, scene: "tau_outpost", speaker: KELRA, time: {d: 40}, bridge: true, eventRoll: 0.4,
    text: L("运兵船把你们送上了达尔诺尔的一颗边境卫星。前哨正对着尘落星的方向。\n四十天：巡逻、站岗、擦枪，和克鲁特隔着营火互相打量。凯尔拉每晚都在核对星空。\n“那边的星，”她说，“最近不太老实。”",
            "The troopship sets you down on one of Dal'nor's border moons. The outpost faces the direction of Dustfall.\nForty days: patrols, sentry duty, rifle cleaning, sizing up the Kroot across the fire. Every night Kel'ra checks the sky.\n“Those stars,” she says, “have been restless lately.”"),
    codex: ["place_frontier_outpost"],
    alt: [
      {if: {flag: "droneSilent"}, add: L("92号总跟在你身后三米，一声不吭。", "Drone 92 trails three metres behind you, silent.")},
      {if: {flag: "namedDrone"}, add: L("你站岗打盹时，92号会轻轻哔一声。", "When you doze on watch, 92 gives a soft beep.")}
    ],
    choices: [
      C("继续站岗", "Stand your watch", "tau_301", {result: L("第四十一天夜里，天空裂开一道火光，地面跟着抖了三下。", "On the forty-first night the sky splits with fire and the ground shudders three times.")})
    ]};

  N.tau_301 = {chapter: 3, scene: "tau_outpost", speaker: KELRA, time: {h: 8},
    text: L("天亮了。一块山那么大的石头从尘落星的方向坠下来，砸进了十公里外的丛林。\n石头里在敲东西，还在唱歌。\n“兽人，”凯尔拉说，“它们把小行星当船。不，它们觉得那就是船。”",
            "Dawn. A rock the size of a mountain came down from the direction of Dustfall and crashed into the jungle ten kilometres off.\nSomething inside it is hammering. And singing.\n“Orks,” Kel'ra says. “They use asteroids as ships. No—they believe asteroids are ships.”"),
    codex: ["xenos_ork", "place_dustfall"],
    choices: [
      C("守在防线上", "Hold the line", "tau_302", {result: L("你把电池排成一排，盯着丛林的边缘。歌声越来越近。", "You line up your power cells and watch the jungle's edge. The singing grows louder.")}),
      C("跟克鲁特去丛林", "Go into the jungle with the Kroot", "tau_303", {result: L("格拉克萨冲你点点头，带你钻进树冠。克鲁特爬树比你走路还安静。", "Grrak'tha nods and leads you up into the canopy. The Kroot climb more quietly than you walk.")})
    ]};

  N.tau_302 = {chapter: 3, scene: "tau_outpost", speaker: KELRA, foe: "ork", time: {h: 30},
    text: L("兽人冲出丛林时笑得像过节。脉冲步枪的射程是它们的三倍，它们反而更开心：终于有东西值得冲过去了。\n凯尔拉一动不动：“等。等。等——”",
            "The orks burst from the jungle laughing like it's a holiday. Pulse rifles outrange them three times over. That only cheers them up: at last, something worth charging.\nKel'ra doesn't move. “Wait. Wait. Wait—”"),
    effects: {sanity: -5},
    choices: [
      C("等她的命令", "Wait for her order", "tau_304", {effects: {renown: 5}, result: L("你的手指贴着扳机，汗流进眼睛。兽人近得能数清牙齿了。", "Your finger rests on the trigger; sweat runs into your eyes. The orks are close enough to count teeth.")}),
      C("忍不住先开火", "Fire early", "tau_305", {require: {notFlag: "droneSilent"}, hideIfLocked: true, effects: {renown: -5, taint: {khorne: 30}}, result: L("你的手指先动了。一道蓝光孤零零地划过战场。", "Your finger moves first. A single blue bolt streaks across the field, alone.")}),
      C("忍不住先开火", "Fire early", "tau_305b", {require: {flag: "droneSilent"}, hideIfLocked: true, effects: {renown: -5, taint: {khorne: 30}}, result: L("你的手指先动了。一道蓝光孤零零地划过战场。身后三米，92号一声没响。", "Your finger moves first. A single blue bolt streaks across the field. Three metres behind you, 92 makes no sound.")})
    ]};

  N.tau_303 = {chapter: 3, scene: "jungle", speaker: GRRAK, foe: "ork", time: {h: 28},
    text: L("克鲁特在树上蹲了一整天，一声不出。一队兽人从下面走过，扛着一门炮在吵架。\n格拉克萨的眼睛眯起来，羽冠一根根竖起。\n“现在，”他说，“吃饭时间。”",
            "The Kroot crouch in the trees all day without a sound. A band of orks passes below, squabbling over a cannon.\nGrrak'tha's eyes narrow. His quills rise one by one.\n“Now,” he says. “Dinner time.”"),
    alt: [
      {if: {flag: "ateWithKroot"}, add: L("你吃过他的肉。他让你蹲在他身后那根树枝上。", "You ate his meat. He puts you on the branch right behind his.")}
    ],
    choices: [
      C("跟着跳下去", "Jump down with them", null, M(R(0.45, "hp", "tau_306", "tau_307", L("你落在一只兽人背上，枪托砸了下去。四周全是羽毛、刀光和吼叫。", "You land on an ork's back and bring the stock down. All around: feathers, blades and roaring."), L("跳下去的瞬间你就知道不对——树枝太高了，地面太硬了。", "The moment you jump, you know: the branch is too high, the ground too hard.")), {require: {notFlag: "ateWithKroot"}, hideIfLocked: true, effects: {taint: {khorne: 20}}})),
      C("跟着格拉克萨跳下去", "Jump right behind Grrak'tha", null, M(R(0.65, "hp", "tau_306", "tau_307", L("格拉克萨先落地，替你清出一块空地。你落下去，枪托砸进一只兽人的后脑。", "Grrak'tha lands first and clears you a space. You drop in and drive your stock into an ork's skull."), L("他护得住一边，护不住两边。一只兽人从侧面撞上了你。", "He can cover one side, not both. An ork slams into you from the flank.")), {require: {flag: "ateWithKroot"}, hideIfLocked: true, effects: {taint: {khorne: 20}}})),
      C("留在树上掩护", "Stay up and give cover", "tau_306", {effects: {renown: 3}, result: L("你在树上一枪一枪点射。每倒下一个，下面就有个克鲁特冲你咔哒一声。", "You fire shot by shot from the branches. Each time one drops, a Kroot below clicks up at you.")})
    ]};

  N.tau_304 = {chapter: 3, scene: "tau_outpost", speaker: KELRA, foe: "ork", time: {h: 1},
    text: L("“开火。”\n一整排蓝光同时亮起。第一波兽人像被风吹倒的麦子。\n第二波踩着第一波冲上来，还在笑。凯尔拉皱了皱眉：“它们不懂什么时候该输。”",
            "“Fire.”\nAn entire line of blue light flashes at once. The first wave of orks drops like wheat in the wind.\nThe second wave charges over them, still laughing. Kel'ra frowns. “They do not understand when they have lost.”"),
    choices: [
      C("继续射击", "Keep firing", "tau_308", {effects: {taint: {khorne: 10}}, result: L("枪管烫得握不住，你就换一支。太阳落山前，兽人终于退回了丛林。", "When the barrel's too hot to hold, you swap rifles. By sunset the orks finally fall back into the jungle."),
        resultAlt: [{if: {flag: "haskTaught"}, text: L("别人的枪管烫得握不住，你的没有——哈斯克教的。太阳落山前，兽人退回了丛林。", "Other barrels glow too hot to hold; yours doesn't—Hask's trick. By sunset the orks fall back into the jungle.")}]})
    ]};

  N.tau_305 = {chapter: 3, scene: "tau_outpost", speaker: D92, foe: "ork", time: {h: 1},
    text: L("你的第一枪暴露了阵地。一发粗糙的火箭呼啸而来，92号挡在你面前。\n它掉在地上，冒着烟，还在“哔”。\n凯尔拉看了你一眼，什么也没说。那一眼比骂你还难受。",
            "Your first shot gives away the position. A crude rocket screams in, and Drone 92 throws itself in front of you.\nIt hits the ground smoking, still beeping.\nKel'ra gives you one look and says nothing. That look is worse than any scolding."),
    effects: {hp: -10, sanity: -5, set: {droneDamaged: true, kelraDisappointed: true}},
    choices: [
      C("抱起92号", "Pick up Drone 92", "tau_308", {effects: {sanity: 5}, result: L("92号在你怀里发烫，一下一下地哔着。土族技师说能修，但不会和原来完全一样了。", "Drone 92 is hot in your arms, beeping in slow pulses. The earth-caste tech says it can be fixed, but not quite as it was.")})
    ]};

  N.tau_305b = {chapter: 3, scene: "tau_outpost", speaker: KELRA, foe: "ork", time: {h: 1},
    text: L("你的第一枪暴露了阵地。一发粗糙的火箭呼啸而来。\n没有哔声，没有铁皮鸟挡在你前面——你叫它闭嘴的。\n爆炸把你掀进了战壕。凯尔拉看了你一眼，什么也没说。",
            "Your first shot gives away the position. A crude rocket screams in.\nNo beep, no tin bird throwing itself in front of you. You told it to shut up.\nThe blast flings you into the trench. Kel'ra gives you one look and says nothing."),
    effects: {hp: -18, sanity: -5, set: {kelraDisappointed: true}},
    choices: [
      C("爬回射击位", "Crawl back to your firing step", "tau_308", {result: L("你耳朵里全是血。92号飘过来，停在你头顶，还是一声不响。", "Your ears are full of blood. 92 drifts over and hangs above you, still silent.")})
    ]};

  N.tau_306 = {chapter: 3, scene: "jungle", speaker: GRRAK, time: {h: 2},
    text: L("战斗结束得很快，克鲁特开始“收拾”战场。你转过身去，没看。\n格拉克萨啐了一口：“兽人的味道，全是愤怒。太多愤怒，不健康。”\n他又补了一句：“但是你，打得不错。可以吃。”他好像是在夸你。",
            "It's over quickly. The Kroot begin “tidying” the field. You turn away and don't watch.\nGrrak'tha spits. “Ork tastes of anger. Too much anger. Not healthy.”\nThen he adds: “You fought well. Edible.” It seems to be a compliment."),
    effects: {renown: 5},
    codex: ["tau_kroot"],
    choices: [
      C("回到前哨", "Head back to the outpost", "tau_308", {result: L("回去的路上，克鲁特们边走边嚼。你一路没回头。", "On the way back the Kroot chew as they walk. You never look back.")})
    ]};

  N.tau_307 = {chapter: 3, scene: "jungle", speaker: GRRAK, foe: "ork", time: {h: 1},
    text: L("你落地时崴了脚。一只兽人拎着你的领子把你提起来，像在看一件新玩具。\n下一秒，它的脑袋不见了。格拉克萨站在它身后，舔了舔刀。\n“你欠克鲁特一顿饭。”",
            "You twist your ankle on landing. An ork lifts you by the collar like a new toy.\nNext moment, its head is gone. Grrak'tha stands behind it, licking his blade.\n“You owe Kroot one dinner.”"),
    effects: {hp: -20, set: {oweGrrak: true, grrakBond: true}},
    choices: [
      C("一瘸一拐地跟上", "Limp after him", "tau_308", {result: L("你的脚踝肿得像个果子。格拉克萨走得不快，好像故意在等你。", "Your ankle swells like a fruit. Grrak'tha walks slowly, as if waiting for you on purpose.")})
    ]};

  N.tau_308 = {chapter: 3, scene: "tau_outpost", speaker: KELRA, foe: "ork_boss", time: {h: 6},
    text: L("傍晚，兽人军阀坐着冒黑烟的步行机甲来了，全军跟着它吼：“哇——！”\n第一发炮弹落在左翼。你看见乔里倒下了。\n凯尔拉在频道里说：“战斗服准备蒙卡。需要一个人，把它引进射界。”",
            "At dusk the warboss arrives on a smoke-belching walker, his whole horde roaring after him: “WAAAGH!”\nThe first shell lands on the left flank. You see Jory go down.\nKel'ra on the comm: “Battlesuits, prepare for Mont'ka. I need one volunteer to draw it into the kill zone.”"),
    effects: {sanity: -5, hp: -5},
    codex: ["xenos_waaagh", "xenos_ork_warboss"],
    alt: [
      {if: {flag: "joryHero"}, add: L("他是学着你讲的故事，第一个冲出掩体的。", "He was the first out of cover, acting out the story you told him.")}
    ],
    choices: [
      C("自愿去当诱饵", "Volunteer as the lure", null, R(0.45, "hp", "tau_309", "tau_310", L("你跳出掩体，朝军阀挥枪大喊。它看见了你，咧开嘴，迈开了步子。", "You leap from cover, waving your rifle and yelling. The warboss sees you, grins, and starts to run."), L("你刚冲出去，一发炮弹就在前方炸开。你扑倒在地，抬头正对着弹坑边的乔里。", "You've barely broken cover when a shell bursts ahead. You hit the dirt, face to face with Jory at the crater's edge."))),
      C("去拖回乔里", "Go and drag Jory back", "tau_310", {effects: {sanity: 5}, result: L("你逆着人流跑向乔里。他倒在弹坑边，还在笑，好像没发现自己少了什么。", "You run against the tide toward Jory. He's down by a crater, still smiling, as if he hasn't noticed what's missing."),
        resultAlt: [{if: {flag: "promisedRena"}, text: L("你答应过雷娜姨。你逆着人流跑向乔里，他倒在弹坑边，还在笑。", "You promised Rena. You run against the tide toward Jory. He's down by a crater, still smiling.")}]})
    ]};

  N.tau_309 = {chapter: 3, scene: "tau_outpost", speaker: S("tau_battlesuit", "战斗服小队", "Battlesuit Team"), foe: "ork_boss", time: {h: 1},
    text: L("你在军阀面前跑了两百米，它追着你，笑得前仰后合。\n三台战斗服从天而降，一击，干净利落。凯尔拉在频道里只说了一个词：“蒙卡。”\n战后你才听说：乔里丢了左臂，是哈斯克把他拖回来的。",
            "You run two hundred metres ahead of the warboss. It chases you, howling with laughter.\nThree battlesuits drop from the sky. One blow, clean. Over the comm Kel'ra says a single word: “Mont'ka.”\nAfterwards you hear: Jory lost his left arm. Hask dragged him back."),
    effects: {renown: 10, taint: {slaanesh: 20}},
    codex: ["tau_battlesuit"],
    choices: [
      C("瘫坐在地上喘气", "Collapse and catch your breath", "tau_311", {result: L("你躺在泥里，听着心跳慢下来。远处，克鲁特已经开始“收拾”了。", "You lie in the mud and listen to your heart slow. In the distance, the Kroot have begun “tidying.”")})
    ]};

  N.tau_310 = {chapter: 3, scene: "tau_outpost", speaker: JORY, foe: "ork_boss", time: {h: 1},
    text: L("你拖着乔里躲到掩体后面。他的左臂没了，脸白得像纸，却还在念他的钛语名字。\n远处，三台战斗服从天而降，替你们完成了你们没完成的事。",
            "You drag Jory behind cover. His left arm is gone, his face white as paper, and he's still murmuring his T'au name.\nIn the distance, three battlesuits drop from the sky and finish what you couldn't."),
    effects: {hp: -10, sanity: -10, set: {coveredJory: true}},
    codex: ["tau_battlesuit"],
    choices: [
      C("按住他的伤口", "Press on his wound", "tau_311", {result: L("血从你指缝里往外冒。医疗无人机来得很快，快得像早就算好了。", "Blood wells between your fingers. The medical drone arrives fast, as if it had been calculated in advance.")})
    ]};

  N.tau_311 = {chapter: 3, scene: "tau_city", speaker: VASH, time: {d: 15}, gather: L("人类街区广场", "Quarter square"), jump: L("十五天后，回到达尔诺尔", "Fifteen days later, back on Dal'nor"),
    text: L("回到达尔诺尔的第十五天，人类街区广场上挤满了人。瓦尚宣读战报：“伤亡在可接受范围内。”\n乔里装了一条土族造的新手臂，很骄傲。雷娜姨看了一眼，转身走了。\n阵亡名单上只有人类和克鲁特。",
            "Fifteen days back on Dal'nor, the Quarter square is packed. Vash'aun reads the battle report: “Casualties within acceptable parameters.”\nJory shows off a new earth-caste arm, proud. Aunt Rena takes one look and walks away.\nThe list of dead holds only humans and Kroot."),
    effects: {hp: 20},
    alt: [
      {if: {flag: "coveredJory"}, add: L("乔里当着众人的面，用新手攥住你：“是你把我拖回来的。”", "In front of everyone, Jory grips you with his new hand. “You dragged me back.”")},
      {if: {notFlag: "coveredJory"}, add: L("乔里拍拍你：“全营都看见你那一跑了。”", "Jory claps your shoulder. “Whole cadre saw that run of yours.”")}
    ],
    choices: [
      C("什么也不说", "Say nothing", "tau_312", {effects: {renown: 3, set: {silentReport: true}, taint: {nurgle: 10}}, result: L("你什么也没说。瓦尚念完名单，朝沉默的你满意地点了点头。", "You say nothing. Vash'aun finishes the list and nods at your silence, pleased.")}),
      C("去陪雷娜姨坐一会儿", "Go sit with Aunt Rena", "tau_312", {effects: {sanity: 10, set: {satWithRena: true, rooted: true}}, result: L("雷娜姨给你泡了一杯苦茶。你们坐到天黑，谁也没提乔里的手。", "Rena makes you bitter tea. You sit until dark, and neither of you mentions Jory's arm.")})
    ]};

  /* ============ Chapter 4 · The Old Masters ============ */
  N.tau_312 = {chapter: 4, scene: "tau_city", speaker: null, time: {y: 1}, bridge: true, eventRoll: 0.4,
    text: L("一年过去了。人类的工钱涨了一点点，街上的无人机多了不止一点点。\n乔里用新手臂在码头搬货，一次扛两箱。雷娜姨又开始每天擦那张空讲台。\n一天清晨，所有频道同时没了声音。",
            "A year goes by. Human wages rise a little; the drones in the streets multiply a lot.\nJory hauls cargo on the docks with his new arm, two crates at a time. Aunt Rena is back to dusting the empty pulpit every day.\nOne morning, every channel falls silent at once."),
    alt: [
      {if: {flag: "droneDamaged"}, add: L("92号焊好了，机身多了道疤，飞起来有点偏。", "92 was welded back together; it has a scar now and flies a little crooked.")},
      {if: {flag: "coveredJory"}, add: L("乔里逢人就说，是你把他拖回来的。", "Jory tells anyone who'll listen that you dragged him back.")}
    ],
    choices: [
      C("拍拍收音机", "Thump the radio", "tau_401", {result: L("杂音之后，一个陌生的声音占满了每个频道。", "After the static, an unfamiliar voice fills every channel.")})
    ]};

  N.tau_401 = {chapter: 4, scene: "tau_city", speaker: S("commissar", "帝国广播", "Imperial Broadcast"),
    text: L("“这里是帝国远征舰队。新卡尔德的子民，帝皇没有忘记你们。”\n停顿。“所有与异形合作者，皆为叛徒。”\n天上出现了一排灰色的船。",
            "“This is the Imperial crusade fleet. People of New Calder, the Emperor has not forgotten you.”\nA pause. “All who collaborate with the xenos are traitors.”\nA row of grey ships appears in the sky."),
    effects: {sanity: -5},
    codex: ["imp_imperium", "imp_indomitus"],
    alt: [
      {if: {flag: "origin_pow"}, add: L("你等了好几年的船，终于来了。来抓你的。", "The ships you waited years for have come at last. For you.")}
    ],
    choices: [
      C("关掉广播", "Switch it off", "tau_402", {result: L("你按下开关。街上，每扇窗户里还在传出同一个声音。", "You switch it off. Out in the street, the same voice still pours from every window.")}),
      C("把它听完", "Listen to the end", "tau_402", {effects: {sanity: -5, set: {heardBroadcast: true}, taint: {tzeentch: 15}}, result: L("广播最后念了一串名字：新卡尔德的“叛徒”。你听到了总督，听到了你那条街。", "The broadcast ends with a list of names: New Calder's “traitors.” You hear the governor. You hear your street.")})
    ]};

  N.tau_402 = {chapter: 4, scene: "hive_hab", speaker: RENA, time: {h: 5},
    text: L("雷娜姨把双头鹰吊坠挂在胸前，眼睛亮得吓人。\n“他们来接我们了。”她拉住你，“今晚我要在钟楼上点一盏灯，告诉他们这里还有忠诚的人。你帮我。”",
            "Aunt Rena wears the eagle pendant openly now, her eyes frighteningly bright.\n“They've come for us.” She grips your arm. “Tonight I'll light a lamp in the bell tower, to tell them faithful people still live here. Help me.”"),
    alt: [
      {if: {flag: "renaDistrust"}, text: L("雷娜姨把双头鹰吊坠挂在胸前，眼睛亮得吓人。她本不想找你——你劝过她扔掉它。可她没有别人了。\n“他们来接我们了。今晚我要在钟楼上点一盏灯。你帮我。”", "Aunt Rena wears the eagle pendant openly now, eyes frighteningly bright. She didn't want to ask you; you told her to throw it away. But there is no one else.\n“They've come for us. Tonight I'll light a lamp in the bell tower. Help me.”")},
      {if: {flag: "soldRena"}, add: L("她手里攥着钱：“我付你钱，像上次那样。”", "She has coins in her fist. “I'll pay you, like last time.”")},
      {if: {anyFlag: ["knowAquila", "satWithRena"]}, add: L("她直接推开你的门，像来找自家人。", "She walks straight in, the way family does.")}
    ],
    choices: [
      C("帮她", "Help her", "tau_403", {effects: {renown: -10, set: {helpedRena: true, watched: true}}, result: L("你们趁夜摸上钟楼。雷娜姨的手在抖，划了三根火柴才点着灯芯。街角，有一点红光闪了一下。", "You climb the bell tower under cover of night. Rena's hands shake; it takes three matches to light the wick. On the corner, a red light blinks once.")}),
      C("劝她别做傻事", "Beg her not to do anything foolish", "tau_404", {result: L("“雷娜姨，他们不是来接我们的。”话一出口，你就后悔了。", "“Aunt Rena, they're not here to rescue us.” The moment it's out, you regret it.")}),
      C("“名单上有我们这条街。”", "“Our street is on their list.”", "tau_404", {require: {flag: "heardBroadcast"}, hideIfLocked: true, effects: {sanity: 3, set: {renaListened: true}}, result: L("你把广播里那串名字一个一个念给她听。念到第三个，她的手垂了下来。", "You recite the broadcast's names to her one by one. By the third, her hand drops.")}),
      C("去告诉水族", "Go tell the water caste", "tau_405", {effects: {renown: 10, sanity: -15, taint: {tzeentch: 30}, set: {reportedRena: true, wronged_rena: true, wronged_jory: true}}, result: L("你走向水族办公楼，一路没敢回头。你说出雷娜姨的名字和住址。乔里也住在那里。", "You walk to the water-caste office without looking back. You give them Aunt Rena's name and address. Jory lives there too.")})
    ]};

  N.tau_403 = {chapter: 4, scene: "ruins", speaker: S("commissar", "帝国政委", "Imperial Commissar"), time: {h: 8},
    text: L("灯亮了。半夜，一支帝国侦察小队摸到钟楼下，带队的是个政委。\n他看了看雷娜姨的吊坠，又看了看你脚上钛人发的靴子。\n“合作者，”他说。他看雷娜姨的眼神，和看你的一模一样。",
            "The lamp is lit. At midnight an Imperial scout squad creeps up to the bell tower, led by a commissar.\nHe looks at Rena's pendant, then at your T'au-issue boots.\n“Collaborators,” he says. He looks at Rena exactly the way he looks at you."),
    codex: ["imp_commissar"],
    alt: [
      {if: {flag: "origin_pow"}, add: L("他盯住你袖口的星界军线头：“还是个逃兵。”", "He fixes on the Guard threads at your cuff. “And a deserter.”")}
    ],
    choices: [
      C("“我们一直是帝皇的子民！”", "“We've always been the Emperor's people!”", null, R(0.3, "sanity", "tau_405b", "tau_end_collaborator", L("政委盯着你看了很久，直到远处一声爆炸打断了他。他带着小队跑回黑暗里，把你们丢在原地。", "The commissar stares at you a long time, until a distant blast interrupts him. He takes his squad back into the dark and leaves you there."), L("你说得很急，很真诚。政委一边听，一边慢慢摘下了手套。", "You speak fast and from the heart. The commissar listens, slowly pulling off his gloves."))),
      C("拉着雷娜姨逃跑", "Grab Rena and run", null, R(0.6, "hp", "tau_405b", "tau_end_collaborator", L("你拽着雷娜姨钻进小巷。激光在身后的墙上烧出一排黑洞，可你们跑掉了。", "You haul Rena into an alley. Las-fire burns a row of holes in the wall behind you, but you get away."), L("雷娜姨跑不动了。她拉住你，摇摇头。脚步声在你们身后停下。", "Rena can't run anymore. She holds your arm and shakes her head. Footsteps stop behind you."))),
      C("朝政委开枪", "Shoot the commissar", "tau_405b", {effects: {hp: -15, sanity: -10, set: {shotCommissar: true}, taint: {khorne: 30}}, result: L("脉冲光打中了他的胸口。他倒下前开了一枪，打穿了你的肩膀。雷娜姨尖叫起来。", "The pulse bolt takes him in the chest. He fires once as he falls, through your shoulder. Rena screams.")})
    ]};

  N.tau_end_collaborator = {chapter: 4, scene: "ruins", speaker: S("commissar", "帝国政委", "Imperial Commissar"), time: {h: 1},
    text: L("政委耐心地听完了你的话，点点头，像是在认可一份报告。\n然后他宣读了判决。很短。\n第二天，帝国广播多了一条：“新卡尔德，清除叛徒两名。”雷娜姨的吊坠被收走了，说圣物不宜流落。",
            "The commissar hears you out patiently, nodding as if approving a report.\nThen he reads the sentence. It's short.\nNext day the Imperial broadcast adds a line: “New Calder: two traitors removed.” Rena's pendant is confiscated. Holy relics, they say, mustn't go astray."),
    alt: [
      {if: {flag: "origin_pow"}, add: L("你的那份判决里，多了一条罪名：临阵投敌。", "Your sentence carries one extra charge: desertion to the enemy.")}
    ],
    ending: {kind: "bad", title: L("合作者", "Collaborators"), cause: L("被帝国以通敌罪处决", "Executed as a xenos collaborator")}};

  N.tau_404 = {chapter: 4, scene: "hive_hab", speaker: RENA, time: {h: 2},
    text: L("雷娜姨打了你一巴掌，然后哭了。\n“我知道，”她说，“我知道他们来了也会把我们都烧了。我只是……想有人还记得帝皇。”\n她把吊坠塞回围裙里，手一直在抖。",
            "Aunt Rena slaps you. Then she cries.\n“I know,” she says. “I know if they come, they'll burn us all. I just... want someone to still remember the Emperor.”\nShe tucks the pendant back into her apron. Her hands won't stop shaking."),
    effects: {sanity: -5},
    alt: [
      {if: {flag: "renaListened"}, text: L("雷娜姨听你念完，愣了很久。“名单上……有我们这条街？”\n她把吊坠摘下来，塞回围裙里，手一直在抖。\n“那就不点了，”她说，“帝皇会原谅我的。”", "Rena hears you out and stands frozen a long time. “Our street... is on the list?”\nShe takes the pendant off and tucks it back into her apron, hands shaking.\n“Then no lamp,” she says. “The Emperor will forgive me.”")}
    ],
    choices: [
      C("抱住她", "Hold her", "tau_405b", {effects: {sanity: 5}, result: L("她在你怀里哭了很久。窗外，灰色的船越来越近。", "She cries in your arms a long time. Outside, the grey ships draw closer.")})
    ]};

  N.tau_405 = {chapter: 4, scene: "tau_city", speaker: VASH, time: {h: 3},
    text: L("瓦尚听完，握住你的手，笑容完美：“谢谢你。你为大义做了一件困难而正确的事。”\n当晚，雷娜姨被“请”去参加一次友好的对话。\n乔里整整一年没再跟你说一句话。",
            "Vash'aun hears you out, takes your hand, and smiles perfectly. “Thank you. You have done a difficult and correct thing for the Greater Good.”\nThat night Aunt Rena is invited to a friendly dialogue.\nJory doesn't speak a word to you for a whole year."),
    choices: [
      C("回营地", "Go back to barracks", "tau_405b", {result: L("你走得很快，好像有人在后面追。其实没有。", "You walk fast, as if someone were after you. No one is.")})
    ]};

  N.tau_405b = {chapter: 4, scene: "tau_outpost", speaker: KELRA, time: {d: 3}, jump: L("三天后，城外营地", "Three days later, the camp outside the city"),
    text: L("三天后。轨道上的火光一夜没停，凯尔拉把所有古维萨召回城外营地。\n营房门口，每个人都要经过一架无人机的扫描。\n“帝国军明天登陆，”凯尔拉说，“你们会看见自己的同胞。准备好。”",
            "Three days later. The orbital fire never stops; Kel'ra recalls every gue'vesa to the camp outside the city.\nAt the barracks door each of you passes under a drone's scan.\n“The Imperials land tomorrow,” Kel'ra says. “You will see your own kind. Be ready.”"),
    alt: [
      {if: {all: [{flag: "helpedRena"}, {anyFlag: ["logged", "flagged"]}]}, text: L("三天后。轨道上的火光一夜没停，凯尔拉把所有古维萨召回城外营地。\n枕头下压着瓦尚的淡蓝卡片：“战后我们谈谈。”你的脸早就进了无人机的表格。\n“帝国军明天登陆，”凯尔拉说，“准备好。”", "Three days later. The orbital fire never stops; Kel'ra recalls every gue'vesa to the camp outside the city.\nUnder your pillow, a pale blue card in Vash'aun's hand: “Let us talk after the war.” Your face has long been in a drone's table.\n“The Imperials land tomorrow,” Kel'ra says. “Be ready.”")},
      {if: {flag: "reportedRena"}, text: L("三天后。轨道上的火光一夜没停，凯尔拉把所有古维萨召回城外营地。\n你的床铺被人挪到了最角落。没人跟你说话。\n“帝国军明天登陆，”凯尔拉说，“你们会看见自己的同胞。准备好。”", "Three days later. The orbital fire never stops; Kel'ra recalls every gue'vesa to the camp outside the city.\nSomeone has moved your bunk to the far corner. Nobody speaks to you.\n“The Imperials land tomorrow,” Kel'ra says. “You will see your own kind. Be ready.”")},
      {if: {flag: "helpedRena"}, add: L("扫描停在你脸上很久。钟楼那一夜，它全记下了。", "The scan lingers on your face. It logged everything from the bell tower.")},
      {if: {flag: "shotCommissar"}, add: L("你肩上的伤还在渗血。没人问是谁打的。", "Your shoulder is still seeping. Nobody asks who shot you.")}
    ],
    choices: [
      C("领枪", "Draw your rifle", "tau_406", {result: L("步枪还是那么轻。你检查了三遍电池。", "The rifle is as light as ever. You check its cells three times.")})
    ]};

  N.tau_406 = {chapter: 4, scene: "burning_city", speaker: KELRA, foe: "guardsman", time: {h: 14},
    text: L("帝国的登陆部队冲进了达尔诺尔。你透过瞄准镜看见他们：和你一样的脸，念着和你一样的祷词。\n凯尔拉在频道里说：“目标确认。开火。”",
            "Imperial landing forces storm Dal'nor. Through your scope you see them: faces like yours, mouthing the prayers you were taught.\nKel'ra on the comm: “Targets confirmed. Fire.”"),
    effects: {sanity: -10},
    codex: ["imp_guard"],
    alt: [
      {if: {flag: "origin_pow"}, text: L("帝国的登陆部队冲进了达尔诺尔。你透过瞄准镜看见他们：和你一样的脸，念着和你一样的祷词，扛着你扛了好多年的激光枪。\n凯尔拉在频道里说：“目标确认。开火。”", "Imperial landing forces storm Dal'nor. Through your scope: faces like yours, mouthing the prayers you were taught, carrying the lasguns you carried for years.\nKel'ra on the comm: “Targets confirmed. Fire.”")},
      {if: {flag: "knowBatteries"}, add: L("他们的电池上印着“奥雷克斯二号”。你卖过同一批。", "Their power cells say ‘Aurex Secundus’. You sold that batch.")},
      {if: {flag: "haskTaught"}, add: L("哈斯克趴在你旁边，枪口一动不动。", "Hask lies beside you, his muzzle perfectly still.")}
    ],
    choices: [
      C("开火", "Fire", "tau_407", {effects: {sanity: -5, renown: 5, taint: {khorne: 30}}, result: L("一个和你差不多大的士兵倒下了。你看见他胸前挂着一枚双头鹰。", "A soldier about your age goes down. You see a two-headed eagle hanging at his chest.")}),
      C("把枪口抬高一点", "Aim a little high", "tau_407", {effects: {renown: -5, set: {firedHigh: true}}, result: L("你的子弹全打在了他们头顶的墙上。92号把每一发都记了下来。", "Every shot you fire hits the wall above their heads. Drone 92 logs every one.")})
    ]};

  N.tau_407 = {chapter: 4, scene: "burning_city", speaker: KELRA, foe: "astartes", time: {h: 6},
    text: L("中午，蓝色的巨人到了。一台战斗服被他们徒手掀翻，驾驶员没能出来。\n凯尔拉的声音第一次变了调。然后奥林长者的声音插了进来，平静如水：“按计划撤退。让他们追。”",
            "At noon the blue giants arrive. They flip a battlesuit with their bare hands; its pilot doesn't get out.\nFor the first time, Kel'ra's voice cracks. Then Aun'el Orin's voice cuts in, calm as still water: “Withdraw as planned. Let them follow.”"),
    effects: {hp: -10},
    codex: ["imp_astartes"],
    choices: [
      C("按计划撤退", "Withdraw as planned", "tau_407b", {result: L("你们一条街一条街地后撤，故意留下脚印和空电池。帝国军跟了上来。", "You fall back street by street, leaving footprints and spent cells on purpose. The Imperials follow.")}),
      C("留下来打掩护", "Stay to cover the withdrawal", null, R(0.35, "hp", "tau_407b", "tau_409", L("你守住街角，一直打到最后一个钛人撤走，然后自己钻进了下水道。", "You hold the corner until the last T'au is clear, then slip into the drains yourself."), L("一个蓝色巨人转过头，看向你的位置。他举起了手里那把粗大的枪。", "One of the blue giants turns toward your position and raises his massive gun.")))
    ]};

  N.tau_409 = {chapter: 4, scene: "ruins", speaker: GRRAK, foe: "astartes", time: {h: 2},
    text: L("一发爆弹在你身边炸开。你飞出去，耳朵里只剩嗡嗡声。\n格拉克萨把你扛上肩，跑得比你见过的任何东西都快。\n“这顿饭，”他喘着说，“记在你账上。”",
            "A bolt-round bursts beside you. You go flying; your ears fill with a dull ring.\nGrrak'tha throws you over his shoulder and runs faster than anything you've ever seen.\n“This dinner,” he pants, “goes on your tab.”"),
    effects: {hp: -20, set: {oweGrrak: true, grrakBond: true}},
    choices: [
      C("昏过去", "Pass out", "tau_407b", {result: L("世界沉入黑暗，只剩羽毛的气味和克鲁特粗重的喘息。", "The world goes dark: only the smell of feathers and a Kroot's heavy breathing.")})
    ]};

  N.tau_407b = {chapter: 4, scene: "burning_city", speaker: KELRA, time: {d: 5}, jump: L("撤退的五天", "Five days of retreat"),
    text: L("撤退的五天。一条街一条街地后撤，古维萨总走在最后，故意让帝国军看见。\n每天的伤亡名单，又只有人类和克鲁特。\n凯尔拉第一次在频道里沉默了很久。",
            "Five days of retreat. Street by street you fall back, the gue'vesa always last, always where the Imperials can see them.\nEach day's casualty list again holds only humans and Kroot.\nFor the first time, Kel'ra goes silent on the comm for a long while."),
    alt: [
      {if: {fromNode: ["tau_409"]}, add: L("你在克鲁特营地醒来，格拉克萨在一旁磨刀。", "You wake in the Kroot camp; Grrak'tha is sharpening his blade beside you.")},
      {if: {flag: "firedHigh"}, add: L("92号记下你抬高枪口的那段，她删了。谁也没告诉。", "The log of you aiming high: she deleted it. She told no one.")}
    ],
    choices: [
      C("撑到第六天", "Hold out to the sixth day", "tau_408", {result: L("第六天早上，帝国军追进了城中心。凯尔拉在频道里只说了一句：“现在。”", "On the sixth morning the Imperials push into the city centre. Kel'ra says one word on the comm: “Now.”")})
    ]};

  N.tau_408 = {chapter: 4, scene: "tau_city", speaker: S("tau_battlesuit", "猎人干部团", "Hunter Cadre"), time: {h: 2},
    text: L("整片天空“亮”了——隐形的战斗服同时显形，白色的舰船从月亮背后滑出来。\n“影日指挥官的干部团，”凯尔拉低声说，“她的考尤学派。她们等了整整六天。”\n这才是考尤。",
            "The whole sky “switches on”: stealth suits appear everywhere at once, and white ships glide out from behind the moon.\n“A cadre of Commander Shadowsun's,” Kel'ra breathes. “Her school of Kauyon. They waited six whole days.”\nThis is Kauyon."),
    effects: {renown: 10, sanity: 10},
    codex: ["tau_shadowsun", "tau_kauyon"],
    choices: [
      C("欢呼", "Cheer", "tau_410", {effects: {renown: 3, taint: {slaanesh: 30}}, result: L("你和火族战士一起欢呼，嗓子喊哑了还不想停。凯尔拉回头看你，这一次，她也笑了。", "You cheer with the fire warriors until you're hoarse and still don't want to stop. Kel'ra looks back at you, and this time she smiles too.")}),
      C("看着被困的帝国士兵", "Watch the trapped Imperial soldiers", "tau_410", {effects: {sanity: -5, set: {pitiedImperials: true}}, result: L("他们困在广场中央，无处可逃。有人在祈祷，用的是你小时候学的那段祷词。", "They're trapped in the square with nowhere to run. Someone is praying, the same prayer you learned as a child.")})
    ]};

  N.tau_410 = {chapter: 4, scene: "ruins", speaker: S("guardsman", "被俘的星界军", "Captured Guardsman"), time: {d: 1}, gather: L("战俘登记处", "Registration line"),
    text: L("战俘登记处排着长队。一个年轻的星界军抓住你的袖子——你是这里唯一穿钛人护甲的人类。\n“告诉他们我愿意皈依，什么大义都行，”他小声说，“我只想回家。”\n瓦尚在不远处微笑着记录。",
            "A long queue at the prisoner registration line. A young Guardsman grabs your sleeve: you're the only human here in T'au armour.\n“Tell them I'll convert, any Greater Good they like,” he whispers. “I just want to go home.”\nNearby, Vash'aun smiles and takes notes."),
    alt: [
      {if: {flag: "keptName"}, add: L("他瞥见你名牌上的空白：“你还用自己的名字？”", "He sees the blank on your name tag. “You kept your own name?”")},
      {if: {flag: "origin_pow"}, add: L("他的团徽，你在战俘营里见过。", "You saw his regimental badge in the camp, once.")}
    ],
    choices: [
      C("替他求情", "Plead for him", "tau_410a", {effects: {renown: -5, sanity: 5, set: {beggedForPOW: true}}, result: L("瓦尚听完，礼貌地点头，在那人的名字旁画了个小记号。你不知道那是什么意思。", "Vash'aun listens, nods politely, and makes a small mark beside the man's name. You don't know what it means.")}),
      C("把瓦尚的话翻译给他", "Translate Vash'aun's words for him", "tau_411", {effects: {renown: 5, taint: {tzeentch: 10}}, result: L("你一字一句地翻译：“贡献，是可以成长的。”年轻人拼命点头，像抓住了一根绳子。", "You translate word by word: “Contribution can grow.” The young man nods hard, as if he's caught a rope."),
        resultAlt: [{if: {flag: "keptName"}, text: L("你翻译了。他看着你名牌上的空白，点头点得很慢：他信你，不信瓦尚。", "You translate. He looks at the blank on your tag and nods slowly: he trusts you, not Vash'aun.")}]}),
      C("夜里偷偷给他一壶水", "Slip him water at night", "tau_410a", {require: {flag: "pitiedImperials"}, hideIfLocked: true, effects: {sanity: 5, renown: -3, set: {gaveWater: true}}, result: L("他认出了你：广场上那个没欢呼的人。他喝得很急，呛住了也不停。", "He knows you: the one in the square who didn't cheer. He drinks fast and doesn't stop even when he chokes.")}),
      C("告诉他你是怎么熬过来的", "Tell him how you got through it", "tau_410a", {require: {flag: "origin_pow"}, hideIfLocked: true, effects: {sanity: 5, renown: 3, set: {coachedPOW: true}}, result: L("“先说‘为了吃饱’，”你低声说，“祷词留到晚上，念给自己听。”他用力点头。", "“Say ‘a full belly’ first,” you whisper. “Save the prayers for night, for yourself.” He nods hard.")})
    ]};

  N.tau_410a = {chapter: 4, scene: "ruins", speaker: null, time: {d: 12},
    text: L("接下来的两周里，你看着他的名字被划去。\n一天清晨，他和名单另一半的人被押上一艘货船，送往“劳动营”。\n他在舷梯上回头找你，没找到。",
            "Over the next two weeks you watch his name get crossed out.\nOne morning he and the other half of the list are marched onto a freighter bound for a ‘labour camp’.\nOn the ramp he looks back for you. He doesn't find you."),
    alt: [
      {if: {flag: "beggedForPOW"}, text: L("接下来的两周里，你看着他的名字被划去。\n一天清晨，他和名单另一半的人被押上一艘货船，送往“劳动营”。\n他在舷梯上回头找你，没找到。", "Over the next two weeks you watch his name get crossed out.\nOne morning he and the other half of the list are marched onto a freighter bound for a ‘labour camp’.\nOn the ramp he looks back for you. He doesn't find you.")},
      {if: {flag: "coachedPOW"}, text: L("两周后，他穿上了古维萨的制服。\n列队时他冲你眨眨眼，嘴唇无声地动了动：为了吃饱。\n名单的另一半，被押上了一艘货船。", "Two weeks later he's in a gue'vesa uniform.\nIn formation he winks at you, lips moving silently: a full belly.\nThe other half of the list is marched onto a freighter.")},
      {if: {flag: "gaveWater"}, text: L("两周后，他签了字。你再见到他时，他朝你点了点头，什么也没说。\n名单的另一半，被押上了一艘货船，送往“劳动营”。", "Two weeks later he signs. When you see him again he nods to you and says nothing.\nThe other half of the list is marched onto a freighter bound for a ‘labour camp’.")}
    ],
    choices: [
      C("去见瓦尚", "Go and see Vash'aun", "tau_411", {result: L("瓦尚的请柬又是淡蓝色的。这一次，上面写的是你的钛语名字。", "Vash'aun's invitation is pale blue again. This time it bears your T'au name.")})
    ]};

  N.tau_411 = {chapter: 4, scene: "tau_city", speaker: VASH, time: {d: 2},
    text: L("战俘中有一半穿上了古维萨的制服。另一半，没人提起。\n瓦尚请你喝茶：“愿意做人类与大义之间的联络官吗？他们信你——一张人类的脸。”\n他的笑容，今天格外完美。",
            "Half the prisoners now wear gue'vesa uniforms. The other half, nobody mentions.\nVash'aun invites you to tea. “Would you serve as liaison between the humans and the Greater Good? They trust you. A human face.”\nHis smile is especially perfect today."),
    alt: [
      {if: {anyFlag: ["helpedRena", "shotCommissar"]}, text: L("瓦尚请你喝茶，把钟楼那一夜的记录推到你面前。\n“我们都希望它只是一个误会，”他说，“愿意做人类与大义之间的联络官吗？”\n这不是一个问题。", "Vash'aun invites you to tea and slides the bell-tower log toward you.\n“We would all like it to be a misunderstanding,” he says. “Would you serve as liaison between the humans and the Greater Good?”\nIt is not a question.")},
      {if: {flag: "hidStock"}, text: L("瓦尚请你喝茶，先推过来一份海关清单：十二枚吊坠，藏在一艘没灯的船上。\n“愿意做人类与大义之间的联络官吗？”他微笑，“或者，你解释一下这批货？”", "Vash'aun invites you to tea and first slides over a customs list: twelve pendants, hidden on an unlit boat.\n“Would you serve as liaison between the humans and the Greater Good?” he smiles. “Or would you rather explain this cargo?”")},
      {if: {anyFlag: ["silentReport", "silentTea"]}, add: L("“你懂得沉默的价值，”他说，“人类很少懂。”", "“You understand the value of silence,” he says. “Few humans do.”")},
      {if: {flag: "firedHigh"}, add: L("他没提你抬高的枪口。你不确定他不知道。", "He doesn't mention your raised muzzle. You aren't sure he doesn't know.")}
    ],
    choices: [
      C("接受", "Accept", "tau_501", {effects: {renown: 10, set: {liaison: true}, taint: {tzeentch: 10}}, result: L("瓦尚给你别上一枚淡蓝色的徽章。从今天起，你开口说话，就代表人类。", "Vash'aun pins a pale blue badge on you. From today, when you speak, you speak for the humans.")}),
      C("推说自己只会打仗", "Say you're only good for fighting", "tau_501", {effects: {sanity: 5}, result: L("瓦尚的笑容一丝不变：“当然。大义尊重每个人的位置。”他收回了茶杯。", "Vash'aun's smile doesn't flicker. “Of course. The Greater Good respects everyone's place.” He takes back the teacup.")}),
      C("先谈谈联络官的报酬", "Negotiate the liaison's pay first", "tau_501", {require: {flag: "origin_trader"}, hideIfLocked: true, effects: {renown: 8, set: {liaison: true}}, result: L("瓦尚的笑容第一次顿了半秒。最后，人类那栏工钱长了一截。只长了你那一行。", "Vash'aun's smile pauses, for the first time, half a second. The human wage column grows a little. Only your line."),
        resultAlt: [{if: {flag: "askedTerms"}, text: L("“这次别说‘暂时的’，”你说。瓦尚顿了半秒，在合同上写了年限。只写了你那一行。", "“Not ‘temporary’ this time,” you say. Vash'aun pauses half a second, then writes a term into the contract. Only your line.")}]})
    ]};

  /* ============ Chapter 5 · Farsight ============ */
  N.tau_501 = {chapter: 5, scene: "tau_outpost", speaker: KELRA, time: {y: 1}, bridge: true, eventRoll: 0.35,
    text: L("又是一年，你们驻在城外的丛林前哨。凯尔拉变了：她开始在夜里看星图，看的总是同一个方向。\n“你听说过远见吗？”某天她突然问，“一位指挥官。他去了海湾的另一边，再也没回来。”",
            "Another year, garrisoned at the jungle outpost outside the city. Kel'ra has changed: at night she studies star charts, always the same direction.\n“Have you heard of Farsight?” she asks one day. “A commander. He went to the far side of the Gulf and never came back.”"),
    effects: {sanity: 15, hp: 10},
    codex: ["tau_farsight", "place_damocles_gulf"],
    alt: [
      {if: {flag: "kelraDisappointed"}, add: L("开口之前她看了你很久，像在决定能不能信你。", "Before she speaks she studies you a long time, as if deciding whether you can be trusted.")},
      {if: {flag: "firedHigh"}, add: L("“你那天把枪口抬高了，”她说，“我也想过。”", "“You aimed high that day,” she says. “I thought about it too.”")}
    ],
    choices: [
      C("问她远见是谁", "Ask who Farsight is", "tau_502", {effects: {taint: {tzeentch: 10}}, result: L("凯尔拉先看了一眼头顶的无人机，才把声音压得更低。", "Kel'ra glances at the drone overhead before lowering her voice further.")}),
      C("提醒她小心说话", "Warn her to watch her words", "tau_503", {result: L("你朝头顶的无人机抬了抬下巴。凯尔拉的话停在了半截。", "You tilt your chin at the drone overhead. Kel'ra stops mid-sentence.")})
    ]};

  N.tau_502 = {chapter: 5, scene: "tau_outpost", speaker: KELRA, time: {h: 1},
    text: L("“他们说，他发现了以太族不想让我们知道的事。说他的剑来自一个死去的世界。”\n她停顿了一下，“还说，他那边的人吵架。真正地吵，不需要先‘澄清误会’。”\n她笑了。那个笑容不完美。",
            "“They say he learned something the Ethereals didn't want us to know. That his sword comes from a dead world.”\nShe pauses. “And that his people argue. Really argue, without first clearing up a misunderstanding.”\nShe smiles. It isn't a perfect smile."),
    codex: ["tau_farsight_enclaves"],
    choices: [
      C("那听起来不错", "That sounds good", "tau_504", {effects: {set: {farsightCurious: true}, taint: {tzeentch: 25}}, result: L("凯尔拉没有回答，只是把星图往你那边推了推。第二天，全营奉命回城听奥林讲话。", "Kel'ra doesn't answer; she slides the star chart toward you. Next day the cadre is ordered back to the city to hear Orin speak.")}),
      C("那听起来很危险", "That sounds dangerous", "tau_504", {effects: {renown: 3}, result: L("“是的，”凯尔拉说，“很危险。”第二天，全营奉命回城听奥林讲话。", "“Yes,” Kel'ra says. “Very dangerous.” Next day the cadre is ordered back to the city to hear Orin speak.")})
    ]};

  N.tau_503 = {chapter: 5, scene: "tau_outpost", speaker: KELRA, time: {h: 1},
    text: L("凯尔拉看着你，过了很久才点头：“你说得对。”\n她把星图收起来。你知道她明晚还会拿出来。\n92号在你们之间悬停着，安静得像在偷听。",
            "Kel'ra looks at you for a long time before she nods. “You are right.”\nShe puts the star chart away. You know she'll take it out again tomorrow night.\nDrone 92 hovers between you, quiet as an eavesdropper."),
    choices: [
      C("回城参加集会", "Go back to the city for the assembly", "tau_504", {result: L("第二天，全营奉命回城，听奥林长者讲话。凯尔拉一路没说话。", "Next day the cadre is ordered back to the city to hear Aun'el Orin. Kel'ra says nothing the whole way.")})
    ]};

  N.tau_504 = {chapter: 5, scene: "tau_city", speaker: ORIN, time: {d: 3}, gather: L("广场", "Plaza"), jump: L("回城听讲话", "Back to the city for the speech"),
    text: L("城中心的广场上，钛人、人类和克鲁特分区站着，听奥林长者讲话。\n凯尔拉来时眉头紧锁，听着听着，眉头松开了。\n平静从钛人的脸上传到人类的脸上，像一条毯子。毯子底下，有什么被盖住了。",
            "In the central plaza, T'au, humans and Kroot stand in separate blocks to hear Aun'el Orin.\nKel'ra arrives frowning; as she listens, the frown dissolves.\nThe calm passes from T'au faces to human ones like a blanket. Underneath it, something is being covered up."),
    codex: ["tau_greater_good", "tau_ethereal"],
    alt: [
      {if: {flag: "noticedCalm"}, add: L("又是那根线。你看得见它，它没系在你身上。", "That string again. You can see it; it isn't tied to you.")},
      {if: {flag: "knelt"}, add: L("你的膝盖还记得上一次那块冰凉的石板。", "Your knees still remember that cold stone from last time.")}
    ],
    choices: [
      C("让那份平静流过你", "Let the calm flow through you", "tau_505", {effects: {sanity: 15, renown: 5, taint: {all: -5}}, result: L("你闭上眼。所有的问题都变得很远、很小。讲话结束时，命令下来：全营调往海湾边的前哨。", "You close your eyes; every question grows distant and small. When the speech ends, orders come down: the cadre ships out to a Gulf-edge outpost.")}),
      C("掐自己一下，保持清醒", "Pinch yourself, stay alert", "tau_505", {effects: {sanity: -5, set: {resistedCalm: true, sawString: true}}, result: L("指甲陷进掌心，周围的人都在微笑。讲话结束时，命令下来：全营调往海湾边的前哨。", "Your nails dig into your palm while everyone around you smiles. When the speech ends, orders come down: the cadre ships out to a Gulf-edge outpost.")})
    ]};

  N.tau_505 = {chapter: 5, scene: "warp", speaker: KELRA, time: {d: 12, warp: true}, jump: L("亚空间浅潜，十二天", "Shallow warp dive, twelve days"),
    text: L("钛人的船在亚空间浅层“潜水”，一次跳一小段，跳了十二天。\n钛人船员安然无恙。人类却开始做梦：一扇门、一只眼、一首走调的歌。\n“我们看不见你们看见的东西，”凯尔拉说，“我很抱歉。”",
            "T'au ships only “dive” into the shallows of the warp, a short hop at a time. Reaching the Gulf's edge takes twelve days.\nThe T'au crew are untroubled. The humans begin to dream: a door, an eye, an out-of-tune song.\n“We cannot see what you see,” Kel'ra says. “I am sorry.”"),
    effects: {sanity: -10},
    codex: ["chaos_warp", "place_tau_transport"],
    alt: [
      {if: {flag: "resistedCalm"}, add: L("你掌心的指甲印还没消。它让你记得自己是谁。", "The nail marks in your palm haven't faded. They remind you who you are.")}
    ],
    choices: [
      C("跟92号说话", "Talk to Drone 92", "tau_506", {require: {flag: "namedDrone"}, hideIfLocked: true, effects: {sanity: 10, set: {told92: true}}, result: L("你跟92号讲雷娜姨、讲码头、讲小时候。它隔一会儿哔一声，像在点头。", "You tell 92 about Aunt Rena, the docks, your childhood. Every so often it beeps, as if nodding.")}),
      C("盯着舷窗外", "Stare out of the viewport", "tau_506", {effects: {corruption: 8, sanity: -5, set: {sawEye: true}, taint: {tzeentch: 50}}, result: L("窗外的颜色没有名字。有一瞬间，你觉得外面有什么东西也在看你，而且认出了你。", "The colours outside have no names. For an instant you feel something out there looking back, and recognising you.")}),
      C("闭眼熬过去", "Shut your eyes and endure", "tau_506", {result: L("你闭着眼数呼吸。那首走调的歌在你脑子里唱了一路。", "You count your breaths, eyes shut. The out-of-tune song plays in your head the whole way.")})
    ]};

  N.tau_506 = {chapter: 5, scene: "cult_shrine", speaker: S("cultist", "西拉斯兄弟", "Brother Silas"), time: {d: 9},
    text: L("海湾边的新驻地，第九天。古维萨营房里有人偷偷聚会，领头的西拉斯给每个人分烟和糖，什么都不要。\n“钛人有他们的大义，”他说，“我们人类也该有个神，一个会听我们说话的神。”",
            "The new posting at the Gulf's edge, day nine. In the gue'vesa barracks people meet in secret. Their leader, Silas, hands out smokes and sugar and asks for nothing.\n“The T'au have their Greater Good,” he says. “We humans deserve a god too. One who listens to us.”"),
    effects: {set: {metSilas: true}},
    codex: ["chaos_cult"],
    alt: [
      {if: {flag: "sawEye"}, add: L("“你也看见那只眼了？”他笑了，“它也看见你了。”", "“You saw the eye too?” He smiles. “It saw you as well.”")}
    ],
    choices: [
      C("听他说完", "Hear him out", "tau_507", {effects: {corruption: 8, sanity: -5, taint: {slaanesh: 50}}, result: L("你留了下来。糖很甜，西拉斯的声音很温和，比瓦尚更像是在跟你说话。", "You stay. The sugar is sweet, and Silas's gentle voice sounds more like he's talking to you than Vash'aun ever did.")}),
      C("报告凯尔拉", "Report to Kel'ra", "tau_508", {effects: {renown: 5, set: {reportedSilas: true}}, result: L("凯尔拉听完，只说了一句“知道了”。第二天，营房里的聚会散了，西拉斯不见了。", "Kel'ra hears you out and says only, “Understood.” Next day the meetings stop, and Silas is gone.")})
    ]};

  N.tau_507 = {chapter: 5, scene: "cult_shrine", speaker: S("cultist", "西拉斯兄弟", "Brother Silas"), time: {h: 3},
    text: L("西拉斯在你手腕上画了一个符号，八道线从一个点散开。\n“你会更强，”他说，“不用等任何人批准你的贡献。”\n符号在发烫。你的伤疤全都不疼了。",
            "Silas draws a symbol on your wrist: eight lines radiating from one point.\n“You'll be stronger,” he says. “No one has to approve your contribution.”\nThe symbol grows warm. None of your scars hurt anymore."),
    choices: [
      C("让符号留下", "Let the mark stay", "tau_508", {effects: {corruption: 20, hp: 20, taint: {khorne: 50}, set: {cultMark: true}}, result: L("你放下袖子盖住符号。夜里，它在布料下轻轻地跳，像第二颗心脏。", "You pull your sleeve over the mark. At night it pulses softly under the cloth, like a second heart.")}),
      C("用刀刮掉它", "Scrape it off with a knife", "tau_508", {effects: {hp: -10, sanity: -5, taint: {all: -5}, set: {scrapedMark: true}}, result: L("你刮到见血，符号才淡下去。西拉斯没拦你，只是笑了笑：“它记住你了。”", "You scrape until it bleeds before the mark fades. Silas doesn't stop you. He only smiles. “It remembers you.”")})
    ]};

  N.tau_508 = {chapter: 5, scene: "tau_outpost", speaker: S("omen_farsight", "红色战斗服", "Crimson Battlesuit"), time: {d: 20}, jump: L("二十天后，海湾前哨", "Twenty days later, the Gulf outpost"),
    text: L("深夜，前哨外的丛林里站着一台涂成红色的战斗服——钛人从不用的颜色。\n你看见凯尔拉走出去和它说话。她回来时，发现你醒着。\n“他们愿意带愿意走的人去海湾那边。人类也可以。你跟我走吗？”",
            "Deep in the night, a battlesuit painted crimson—a colour the T'au never use—stands in the jungle outside the outpost.\nYou watch Kel'ra walk out to speak with it. When she returns, she finds you awake.\n“They'll take anyone willing to the far side of the Gulf. Humans too. Will you come?”"),
    codex: ["tau_farsight_enclaves"],
    alt: [
      {if: {flag: "farsightCurious"}, text: L("深夜，前哨外的丛林里站着一台涂成红色的战斗服——钛人从不用的颜色。\n凯尔拉出去和它说话，回来就直接找你：你说过那听起来不错。\n“他们愿意带人去海湾那边。人类也可以。你跟我走吗？”", "Deep in the night a crimson battlesuit, a colour the T'au never use, stands in the jungle outside the outpost.\nKel'ra goes out to it. When she returns she comes straight to you: you said it sounded good.\n“They'll take people across the Gulf. Humans too. Will you come?”")}
    ],
    choices: [
      C("答应她，等时机", "Agree, and wait for the moment", "tau_509a", {effects: {set: {farsightPact: true}, taint: {tzeentch: 25}}, result: L("凯尔拉握了一下你的手，很快松开。“别告诉任何人，”她说，“尤其是瓦尚。”", "Kel'ra squeezes your hand and lets go fast. “Tell no one,” she says. “Especially not Vash'aun.”")}),
      C("拒绝，但替她保密", "Refuse, but keep her secret", "tau_509", {effects: {sanity: -5}, result: L("凯尔拉点点头，不失望，也不生气。“谢谢你，”她说，“这比我预想的多。”", "Kel'ra nods, neither disappointed nor angry. “Thank you,” she says. “That is more than I expected.”")}),
      C("告发她", "Report her", "tau_509b", {effects: {renown: 15, sanity: -15, taint: {tzeentch: 40}, set: {betrayedKelra: true, wronged_kelra: true}}, result: L("你走进水族办公室时，凯尔拉正从走廊另一头经过。她看见了你，什么也没问。", "As you enter the water-caste office, Kel'ra passes at the far end of the corridor. She sees you and asks nothing.")})
    ]};

  N.tau_509a = {chapter: 5, scene: "tau_outpost", speaker: VASH, time: {d: 3},
    text: L("三天后，瓦尚来前哨视察。他请你单独喝茶，把一段录像推到你面前：凯尔拉走进丛林，迎向一个模糊的红色影子。\n“你认得这台战斗服吗？”他微笑，“我相信你不认得。”",
            "Three days later Vash'aun inspects the outpost. He invites you to tea alone and slides a recording toward you: Kel'ra walking into the jungle toward a blurred red shape.\n“Do you recognise this battlesuit?” he smiles. “I trust you do not.”"),
    choices: [
      C("面不改色地说不认得", "Say no, without a flicker", "tau_510", {effects: {sanity: -5, taint: {tzeentch: 30}}, result: L("“不认得。”你的声音很稳，稳得让你自己害怕。瓦尚收起录像，给你续了茶。", "“No.” Your voice is steady, so steady it frightens you. Vash'aun puts the recording away and refills your cup.")}),
      C("一言不发", "Say nothing at all", "tau_510", {effects: {renown: -10, set: {watched: true}}, result: L("你看着茶杯，一个字也没说。瓦尚点点头，在本子上写了很长的一行。", "You look into your cup and say nothing. Vash'aun nods and writes a long line in his notes.")})
    ]};

  N.tau_509 = {chapter: 5, scene: "tau_outpost", speaker: VASH, time: {d: 3},
    text: L("三天后，瓦尚来前哨视察，请你吃晚饭。饭菜很精致，他一直在笑。\n“最近有些人产生了一些……暂时的误会，”他给你倒水，“我相信你没有。”\n你不知道他知道多少。你只知道，他想让你知道他知道。",
            "Three days later Vash'aun inspects the outpost and invites you to dinner. The food is exquisite; he never stops smiling.\n“Lately some have developed certain... temporary misunderstandings,” he says, filling your glass. “I trust you have not.”\nYou don't know how much he knows. You only know he wants you to know that he knows."),
    effects: {renown: 2},
    alt: [
      {if: {flag: "smiledForVash"}, add: L("“你在对话室说过，你完全想通了。我一直记得。”", "“In the dialogue room you said you understood completely. I have always remembered.”")}
    ],
    choices: [
      C("微笑", "Smile", "tau_510", {effects: {renown: 3, set: {vashanTrusts: true}, taint: {slaanesh: 30}}, result: L("你笑了，笑得很完美，像量过尺寸。瓦尚满意地举起了杯子。", "You smile, a perfect smile, as if measured. Vash'aun raises his glass, satisfied.")}),
      C("沉默地吃完", "Finish the meal in silence", "tau_510", {effects: {sanity: -5}, result: L("你把每道菜都吃得干干净净，一句话也没说。瓦尚一直看着你，直到最后一口。", "You clear every plate without a word. Vash'aun watches you until the last bite.")})
    ]};

  N.tau_509b = {chapter: 5, scene: "tau_outpost", speaker: VASH, time: {h: 6},
    text: L("瓦尚握住你的手：“谢谢你。大义需要每一双眼睛。”\n第二天，凯尔拉被“请”去参加一次友好的对话。\n“她回来以后，”瓦尚说，“请替我们看着她。”",
            "Vash'aun takes your hand. “Thank you. The Greater Good needs every pair of eyes.”\nNext day Kel'ra is invited to a friendly dialogue.\n“When she returns,” Vash'aun says, “please watch her for us.”"),
    choices: [
      C("点头", "Nod", "tau_510b", {effects: {renown: 5, sanity: -5}, result: L("你点了头。瓦尚给你别上一枚小小的徽章，你不知道它代表什么。", "You nod. Vash'aun pins a small badge on you. You don't know what it stands for.")})
    ]};

  N.tau_510 = {chapter: 5, scene: "tau_outpost", speaker: KELRA, time: {d: 12},
    text: L("巡逻时，凯尔拉突然说：“影日和远见，是我们最好的两位指挥官。”\n“影日是耐心的刀，远见是急躁的火。以太族更喜欢刀。”\n她把枪背到身后，“刀听话。”",
            "On patrol, Kel'ra says out of nowhere: “Shadowsun and Farsight. Our two finest commanders.”\n“Shadowsun is a patient blade. Farsight is an impatient fire. The Ethereals prefer the blade.”\nShe slings her rifle. “Blades obey.”"),
    codex: ["tau_shadowsun", "tau_farsight"],
    alt: [
      {if: {flag: "farsightPact"}, add: L("她望着海湾的方向，低声说：“等时机。”", "She looks toward the Gulf and murmurs: “When the moment comes.”")},
      {if: {flag: "reportedSilas"}, add: L("营房里再没人偷偷聚会了。", "Nobody meets in secret in the barracks anymore.")}
    ],
    choices: [
      C("那你是哪一种？", "And which are you?", "tau_511", {effects: {set: {askedKelra: true}, taint: {tzeentch: 10}}, result: L("凯尔拉没有回答。走出很远之后，她才说：“我还在想。”", "Kel'ra doesn't answer. Much further down the trail she says, “I am still deciding.”")}),
      C("默默走路", "Walk on in silence", "tau_511", {effects: {sanity: 3}, result: L("你们并肩走着，只有脚步声和丛林的虫鸣。这样的沉默，不需要澄清。", "You walk side by side: only footsteps and jungle insects. This kind of silence needs no clearing up.")})
    ]};

  N.tau_510b = {chapter: 5, scene: "tau_outpost", speaker: KELRA, time: {d: 3},
    text: L("三天后，凯尔拉回来了。她瘦了，笑容完美得像量过尺寸。\n她照常领队巡逻，再也没叫过你的名字。\n“大义需要每一个战斗服驾驶员，”瓦尚说，“哪怕是有过误会的。”",
            "Three days later Kel'ra returns. She is thinner, and her smile is perfect, as if measured.\nShe leads patrols as before. She never says your name again.\n“The Greater Good needs every battlesuit pilot,” Vash'aun says. “Even those who once misunderstood.”"),
    effects: {sanity: -5},
    choices: [
      C("跟在她身后巡逻", "Follow her on patrol", "tau_511", {result: L("她走得很快，一次也没回头。你跟着她的脚印，踩进同样深的泥里。", "She walks fast and never looks back. You follow her footprints into mud just as deep.")})
    ]};

  /* ============ Chapter 6 · The Shadow ============ */
  N.tau_511 = {chapter: 6, scene: "ship_interior", speaker: null, time: {d: 12, warp: true}, bridge: true, eventRoll: 0.35, effects: {sanity: -5},
    text: L("远程传感器的警报把全营召回达尔诺尔。回程的十二天浅潜里，船上所有人类做了同一个梦：天上有一张很大很大的嘴。\n钛人船员睡得很好。他们看着你们醒来时的脸，不知道该说什么。",
            "A long-range sensor alarm recalls the cadre to Dal'nor. On the twelve-day shallow dive home, every human aboard dreams the same dream: a mouth in the sky, enormous.\nThe T'au crew sleep soundly. They look at your faces when you wake and don't know what to say."),
    alt: [
      {if: {flag: "farsightPact"}, add: L("凯尔拉一直站在舷窗边，望着海湾的方向。", "Kel'ra stands at the viewport the whole way, facing the Gulf.")},
      {if: {flag: "betrayedKelra"}, add: L("凯尔拉坐在离你最远的那排座位上。", "Kel'ra sits in the row furthest from you.")}
    ],
    choices: [
      C("下船", "Disembark", "tau_601", {result: L("达尔诺尔的天空还是蓝的。港口的屏幕上滚动着一行字：“请保持平静。”", "Dal'nor's sky is still blue. The port screens scroll one line: “Please remain calm.”")})
    ]};

  N.tau_601 = {chapter: 6, scene: "tau_city", speaker: null, time: {d: 20}, eventRoll: 0.35, jump: L("回到达尔诺尔的第二十天", "Day twenty back on Dal'nor"),
    text: L("回来的第二十天，城里所有的人类孩子都在做那个梦。钛人的孩子睡得很好。\n远程传感器发来一行冷冰冰的数据：“检测到大规模生物质，自赫斯珀方向接近。”\n傍晚，所有频道通知古维萨到简报厅集合。",
            "Twenty days after your return, every human child in the city has the same dream. The T'au children sleep soundly.\nLong-range sensors send one cold line: “Large-scale biomass detected. Bearing: from Hesper. Approaching.”\nAt dusk every channel orders the gue'vesa to the briefing hall."),
    effects: {sanity: -5},
    codex: ["xenos_shadow_in_warp", "xenos_tyranid", "xenos_hive_mind", "place_hesper", "place_arcosa"],
    choices: [
      C("去简报厅", "Go to the briefing hall", "tau_602", {result: L("简报厅门口，人类和钛人排成了两列。你站进了更长的那一列。", "At the briefing hall, humans and T'au queue in two lines. You join the longer one.")})
    ]};

  N.tau_602 = {chapter: 6, scene: "tau_city", speaker: VASH, time: {h: 2}, gather: L("简报厅", "Briefing hall"),
    text: L("简报厅里挤满了人。瓦尚公布撤离计划，语气像在念天气预报：钛族公民第一批，土族设备第二批，古维萨家属第三批。\n“大义从不浪费，”他微笑。\n人群里有人小声问：克鲁特呢？没人回答。",
            "The briefing hall is packed. Vash'aun announces the evacuation plan in the tone of a weather report: T'au citizens first, earth-caste equipment second, gue'vesa families third.\n“The Greater Good wastes nothing,” he smiles.\nSomeone in the crowd murmurs: what about the Kroot? No one answers."),
    alt: [
      {if: {flag: "liaison"}, add: L("作为联络官，你昨天就拿到了这张批次表。", "As liaison, you were handed this list yesterday.")},
      {if: {flag: "vashanTrusts"}, add: L("瓦尚经过你身边，低声说：“你可以排进第二批。”", "Passing you, Vash'aun murmurs: “You could go with the second wave.”")}
    ],
    choices: [
      C("去找格拉克萨", "Find Grrak'tha", "tau_604", {result: L("克鲁特的营地在城外，没人通知他们开会。你老远就听见了磨刀声。", "The Kroot camp lies outside the city; nobody told them about the briefing. You hear the whetstone from far off.")}),
      C("去找雷娜姨", "Find Aunt Rena", "tau_605", {result: L("雷娜姨不在家。你在旧教堂找到了她。", "Rena isn't home. You find her at the old chapel.")}),
      C("把批次表念给人类街区", "Read the wave list to the quarter", "tau_605", {require: {flag: "liaison"}, hideIfLocked: true, effects: {renown: -5, sanity: 5, set: {toldQuarter: true}}, result: L("你站在净水站的台阶上，把三个批次一个一个念出来。人群没有吵。他们只是开始收拾东西。最后你去了旧教堂。", "From the water-station steps you read out all three waves. The crowd doesn't riot. They just start packing. Then you go to the old chapel.")})
    ]};

  N.tau_604 = {chapter: 6, scene: "tau_outpost", speaker: GRRAK, time: {h: 3},
    text: L("格拉克萨在磨刀，磨得很慢。\n“克鲁特吃东西，是为了记住，”他说，“虫子吃东西，是为了忘掉。它们吃掉一个星球，连星球的名字都吃掉。”\n他抬起头：“克鲁特恨虫子。很多年了。”",
            "Grrak'tha sharpens his blade, slowly.\n“Kroot eat to remember,” he says. “Bugs eat to forget. They eat a world, and they eat its name too.”\nHe looks up. “Kroot hate bugs. Many, many years.”"),
    alt: [
      {if: {flag: "grrakBond"}, add: L("“你，”他咔哒一声，“记得吃饭的那个。坐。”", "“You,” he clicks. “The one who remembers dinner. Sit.”")}
    ],
    choices: [
      C("帮他磨刀", "Help him sharpen", "tau_606", {effects: {sanity: 5, set: {grrakFriend: true, grrakBond: true}}, result: L("你们磨了一整夜。天亮时，格拉克萨把一根自己的羽毛塞进你的口袋。", "You sharpen all night. At dawn Grrak'tha tucks one of his own quills into your pocket.")}),
      C("问克鲁特会不会被撤离", "Ask if the Kroot will be evacuated", "tau_606", {effects: {sanity: -5, taint: {nurgle: 30}}, result: L("格拉克萨咔哒笑了一声：“克鲁特不在名单上。克鲁特从来不在名单上。”你突然觉得很累。", "Grrak'tha gives a clicking laugh. “Kroot not on the list. Kroot never on the list.” Suddenly you feel very tired.")})
    ]};

  N.tau_605 = {chapter: 6, scene: "hive_hab", speaker: RENA, time: {h: 3},
    grudgeLine: {npc: "rena", text: L("她从对话室回来后瘦了一圈。她没问是谁说的，你也没说。", "She came back from the dialogue room thinner. She never asked who spoke, and you never said.")},
    text: L("雷娜姨坐在旧教堂的空讲台前，不肯走。\n“第三批？”她笑了，“孩子，第三批永远不会来的。我在帝国活了六十年，我懂排队。”\n她把双头鹰吊坠塞进你手心，合上你的手指。",
            "Aunt Rena sits before the old chapel's empty pulpit and won't leave.\n“Third wave?” She laughs. “Child, the third wave never comes. Sixty years in the Imperium; I know queues.”\nShe presses the eagle pendant into your palm and folds your fingers over it."),
    effects: {sanity: -5, set: {hasAquila: true, prayerToken: true, rooted: true}},
    choices: [
      C("收下吊坠，求她去难民营", "Keep it; beg her to go to the camp", "tau_606", {effects: {sanity: 5, set: {renaCamp: true}}, grudge: {npc: "rena", effects: {sanity: -6}, note: L("你告发过她。她递来的吊坠，沉得握不住。", "You informed on her. The pendant she hands you is hard to hold.")}, result: L("吊坠还带着她的体温。她叹了口气，站起来：“好吧。难民营也是排队，我会排。”", "The pendant is still warm from her. She sighs and stands. “All right. The camp's a queue too. I can queue.”")}),
      C("硬拉她走", "Try to drag her along", "tau_605a", {effects: {hp: -5, sanity: -5}, grudge: {npc: "rena", effects: {hp: -6}, note: L("你告发过她。她这次拼了命，不让你碰。", "You informed on her. This time she fights your hands off.")}, result: L("她比看上去有力气得多。她死死抓着讲台，指甲划破了你的手背。", "She's far stronger than she looks. She clings to the pulpit, and her nails score the back of your hand.")}),
      C("向她坦白那一夜的事", "Confess what you did that night", "tau_606", {require: {flag: "wronged_rena"}, hideIfLocked: true, effects: {sanity: 3, set: {forgiven_rena: true, renaCamp: true}}, result: L("雷娜姨沉默片刻：“我知道是你。脚步声，我认得。你肯来说，就够了。”她跟你走了。", "Rena is silent a while. “I knew it was you. I know your footsteps. That you came to say it is enough.” She comes with you.")})
    ]};

  N.tau_605a = {chapter: 6, scene: "hive_hab", speaker: RENA, time: {h: 1},
    text: L("你拉不动她。她挣开你，重新坐回讲台前，背挺得笔直。\n“去吧，”她说，“帝皇的房子，总得有人看着。”\n你走出教堂时，她开始念祷词。声音不大，一句也没错。",
            "You can't move her. She shakes you off and sits back down before the pulpit, spine straight.\n“Go,” she says. “The Emperor's house needs someone to mind it.”\nAs you leave the chapel she begins to pray. Not loudly. Not one word wrong."),
    effects: {sanity: -5, set: {renaStayed: true, turnBack: true}},
    choices: [
      C("关上教堂的门", "Close the chapel door", "tau_606", {effects: {taint: {nurgle: 30}}, result: L("门关上了。你在台阶上坐了很久，什么都不想做，什么都觉得没用。", "The door shuts. You sit on the steps a long time, wanting nothing, feeling that nothing matters.")})
    ]};

  N.tau_606 = {chapter: 6, scene: "jungle", speaker: null, foe: "genestealer", time: {d: 2},
    text: L("外围定居点的人逃进了城外的难民营，你的小队被派来守营，乔里也在。\n营里有一家人很怪：三个孩子的眼睛都是淡紫色，笑起来一模一样。\n半夜，你看见他们的影子在帐篷上，比人多了两条胳膊。",
            "People from the outlying settlements have fled to a refugee camp outside the city; your squad, Jory included, is sent to guard it.\nOne family there is strange: three children with pale violet eyes who all smile the same way.\nAt midnight their shadows on the tent wall each have two arms too many."),
    effects: {sanity: -5},
    codex: ["xenos_genestealer"],
    alt: [
      {if: {flag: "renaCamp"}, add: L("雷娜姨在营里帮人包扎。她的吊坠在你口袋里。", "Rena is in the camp, dressing wounds. Her pendant is in your pocket.")},
      {if: {flag: "coachedPOW"}, add: L("你教过的那个年轻人也在守营。他冲你点头。", "The young man you coached is on guard here too. He nods to you.")}
    ],
    choices: [
      C("开枪示警", "Fire a warning shot", null, R(0.5, "sanity", "tau_607", "tau_608", L("枪声撕开夜色。火族战士几秒内就醒了，脉冲步枪的灯一盏接一盏亮起。", "The shot tears the night open. Within seconds the fire warriors are up, pulse-rifle lights flicking on one by one."), L("你开了枪。帐篷布上多了一个洞，可那东西已经不在帐篷里了。", "You fire. A hole appears in the canvas, but the thing is no longer inside."))),
      C("悄悄去报告凯尔拉", "Quietly report to Kel'ra", "tau_607", {effects: {sanity: -5, taint: {nurgle: 10}}, result: L("你一步一步退出帐篷区，不敢跑。身后，那三个孩子一起笑出了声。", "You back out of the tents step by step, not daring to run. Behind you, the three children laugh in unison.")})
    ]};

  N.tau_607 = {chapter: 6, scene: "tau_city", speaker: KELRA, foe: "genestealer", time: {h: 2},
    text: L("火族包围了帐篷。里面的东西冲出来时，营地炸开了锅。\n“它们一直在叫什么东西过来，”凯尔拉擦着枪说，“现在它来了。”\n天亮后，钛人看人类的眼神变了。港口的大门关上了。",
            "The fire caste surrounds the tent. When the things inside burst out, the camp erupts.\n“They have been calling something here,” Kel'ra says, wiping her rifle. “Now it is coming.”\nBy dawn the way the T'au look at humans has changed. The port gates close."),
    effects: {renown: 5},
    codex: ["gsc_star_children"],
    choices: [
      C("去港口看看", "Go to the port", "tau_609", {result: L("通往港口的路上挤满了人，每个人都背着全部家当。", "The road to the port is jammed, everyone carrying all they own.")})
    ]};

  N.tau_608 = {chapter: 6, scene: "jungle", speaker: JORY, foe: "genestealer", time: {h: 1},
    text: L("那东西比枪声还快。你倒下时，看见一只金属手臂掐住了它的脖子。\n是乔里，他的义肢咔咔作响。“钛人的手，”他喘着说，“还挺好用。”\n你的胸口在流血。",
            "The thing is faster than your shot. As you fall, you see a metal arm clamp around its throat.\nJory, his prosthetic whirring. “T'au hand,” he gasps. “Comes in handy.”\nYour chest is bleeding."),
    effects: {hp: -25},
    choices: [
      C("让乔里扶你去港口", "Let Jory help you to the port", "tau_609", {result: L("乔里用钛人的手撑着你，一路说个不停，好像一停下你就会睡过去。", "Jory props you up with his T'au hand and talks the whole way, as if you'd fall asleep the moment he stopped.")})
    ]};

  N.tau_609 = {chapter: 6, scene: "tau_city", speaker: VASH, time: {h: 12}, gather: L("港口大门", "Port gate"),
    text: L("港口大门前挤满了背着家当的人。瓦尚站在门后，隔着能量屏讲话：\n“鉴于近期的安全事件，第三批撤离暂时推迟。这只是暂时的。”\n人群开始往前挤。你手里还拿着枪。",
            "The port gate is mobbed by people carrying everything they own. Vash'aun speaks from behind it, through the energy screen:\n“Due to recent security incidents, the third evacuation wave is temporarily postponed. This is only temporary.”\nThe crowd surges forward. You're still holding your rifle."),
    effects: {sanity: -5},
    codex: ["place_dalnor_port"],
    alt: [
      {if: {fromNode: ["tau_608"]}, add: L("你胸口的绷带还在渗血，乔里一直扶着你。", "The bandage on your chest is still seeping; Jory hasn't let go of you.")},
      {if: {flag: "toldQuarter"}, add: L("有人认出你：“是联络官！他早告诉过我们！”", "Someone recognises you. “The liaison! He told us straight!”")}
    ],
    choices: [
      C("回到防线去", "Return to the defence line", "tau_611", {effects: {renown: 5, taint: {nurgle: 20}}, result: L("你转身逆着人群走。身后的哭喊越来越远，你没有回头。", "You turn and push against the crowd. The cries behind you fade. You don't look back.")}),
      C("带着人群往大门冲", "Lead the crowd at the gates", "tau_610", {result: L("你举枪大喊一声。人群跟着你涌向能量屏，像决了堤的水。", "You raise your rifle and shout. The crowd surges after you toward the energy screen like a burst dam.")}),
      C("以联络官身份对人群讲话", "Address the crowd as liaison", null, M(R(0.5, "renown", "tau_611", "tau_610", L("你爬上货箱，一句一句地讲。人群慢慢停了下来，有人开始往难民营走。", "You climb a crate and speak, sentence by sentence. The crowd slows, stops; some turn back toward the camp."), L("你刚开口，后面的人就推了上来。人群把你卷着冲向能量屏。", "You've barely begun when the people behind shove forward. The crowd sweeps you toward the energy screen.")), {require: {flag: "liaison"}, hideIfLocked: true})),
      C("带人走第七泊位下的水道", "Lead them through the channel under Berth Seven", "tau_609a", {require: {flag: "knowSmuggler"}, hideIfLocked: true, effects: {renown: -5, set: {smuggledRefugees: true, rooted: true}}, result: L("你拍拍身边几个人的肩，往人群外挤。“跟我来，别出声。”", "You tap a few shoulders and squeeze out of the crowd. “Follow me. Not a sound.”")})
    ]};

  N.tau_609a = {chapter: 6, scene: "tau_city", speaker: null, time: {h: 3},
    text: L("第七泊位下的水道一片漆黑。没灯的船还在，船老大骂了一句，还是让几十个人挤了上去。\n半路，一架巡逻无人机的光扫过水面。所有人屏住了呼吸。\n光移开了。",
            "The channel under Berth Seven is pitch black. The unlit boat is still there; its captain swears, then lets a few dozen people crowd aboard.\nHalfway out, a patrol drone's light sweeps the water. Everyone holds their breath.\nThe light moves on."),
    effects: {sanity: 10},
    choices: [
      C("目送船消失，回防线", "Watch it vanish, then go back to the line", "tau_611", {result: L("船尾的水纹很快就平了。你一个人爬回岸上，衣服湿透，心里却很轻。", "The wake smooths out fast. You climb back ashore alone, soaked through, and oddly light.")})
    ]};

  N.tau_610 = {chapter: 6, scene: "tau_city", speaker: KELRA, time: {h: 1},
    grudgeLine: {npc: "kelra", text: L("她没忘走廊里的那一眼。这句请求，说得比命令还硬。", "She hasn't forgotten that glance in the corridor. The request lands harder than the order.")},
    text: L("一排火族战士举起了枪。站在最前面的是凯尔拉。\n她的枪口对着你，手很稳，眼睛不稳。\n“请你停下，”她说，“这是命令。也是请求。”",
            "A line of fire warriors raises their rifles. At the front stands Kel'ra.\nHer muzzle is on you. Her hands are steady. Her eyes are not.\n“Please stop,” she says. “That is an order. And a request.”"),
    alt: [
      {if: {flag: "askedKelra"}, add: L("“我想好了，”她低声说，“我是火。可今天，我必须当刀。”", "“I have decided,” she says softly. “I am fire. But today I must be the blade.”")}
    ],
    choices: [
      C("放下武器", "Lower your weapon", "tau_610a", {effects: {renown: -10, sanity: -5, set: {arrestedAtGate: true}}, result: L("你的枪落在地上。凯尔拉的肩膀松了下来。两个火族战士把你押走，动作很轻。", "Your rifle hits the ground. Kel'ra's shoulders drop. Two fire warriors lead you away, gently.")}),
      C("继续往前走", "Keep walking", null, M(R(0.4, "renown", "tau_611", "tau_end_gate", L("凯尔拉的枪口抖了一下，垂了下去。你在能量屏前站了很久。门没开，也没人开枪。", "Kel'ra's muzzle wavers and drops. You stand before the energy screen a long time. It doesn't open. No one fires either."), L("你又迈了一步。凯尔拉的嘴唇动了动，像是在说“对不起”。", "You take one more step. Kel'ra's lips move, as if saying “I'm sorry.”")), {grudge: {npc: "kelra", p: -0.1, note: L("你告发过她。这一次，她不会再心软。", "You informed on her. This time she won't waver.")}}))
    ]};

  N.tau_610a = {chapter: 6, scene: "tau_city", speaker: KELRA, time: {d: 1},
    text: L("禁闭室没有窗。第二天夜里，你听见有什么东西落在屋顶上，沙沙的，像细雨。\n门开了。凯尔拉站在门口，把步枪扔给你。\n“每一支枪都需要，”她说，“包括你的。”",
            "The lock-up has no window. On the second night you hear something landing on the roof, a soft rustle like fine rain.\nThe door opens. Kel'ra stands there and tosses you your rifle.\n“Every gun is needed,” she says. “Yours too.”"),
    effects: {sanity: -5},
    choices: [
      C("接住步枪", "Catch the rifle", "tau_611", {effects: {taint: {nurgle: 30}}, result: L("你接住了它。在禁闭室里坐了一天一夜，你的手已经忘了为什么要握紧。", "You catch it. After a day and a night in the cell, your hands have forgotten why they should grip.")})
    ]};

  N.tau_end_gate = {chapter: 6, scene: "tau_city", speaker: KELRA, time: {h: 1},
    text: L("凯尔拉闭上了眼睛，然后扣下了扳机。\n报告上写着：“安全事件，已处理。”\n一周后，第三批撤离如期“暂时推迟”。再也没有恢复。",
            "Kel'ra closes her eyes. Then she pulls the trigger.\nThe report reads: “Security incident. Resolved.”\nA week later the third wave remains “temporarily postponed.” It is never resumed."),
    ending: {kind: "bad", title: L("暂时推迟", "Temporarily Postponed"), cause: L("冲击港口，被射杀", "Shot storming the port gate")}};

  N.tau_611 = {chapter: 6, scene: "spore_sky", speaker: ORIN, time: {h: 20},
    text: L("天变成了紫色。孢子像雪一样落下。\n奥林长者没有登船。他站在城墙上，长袍在风里纹丝不动。\n“恐惧，”他说，“只是一种暂时的状态。”这一次，你希望他是对的。",
            "The sky turns violet. Spores fall like snow.\nAun'el Orin has not boarded a ship. He stands on the city wall, robes unmoving in the wind.\n“Fear,” he says, “is only a temporary state.” This time, you hope he's right."),
    effects: {sanity: 10},
    choices: [
      C("站到他身边", "Stand beside him", "tau_701", {effects: {renown: 5, set: {besideOrin: true}}, result: L("你爬上城墙，站到奥林身边。风里有股甜腥味，他的长袍依旧纹丝不动。", "You climb the wall and stand beside Orin. The wind smells sweet and rotten; his robes still don't stir.")}),
      C("检查你的电池", "Check your power cells", "tau_701", {effects: {hp: 5, set: {checkedCells: true}}, result: L("你把每块电池擦干净，排好，再数一遍。数字很小，手很稳。", "You wipe every cell clean, line them up, count them again. The number is small. Your hands are steady.")})
    ]};

  /* ============ Chapter 7 · The Devouring ============ */
  N.tau_701 = {chapter: 7, scene: "spore_sky", speaker: KELRA, foe: "gaunt", time: {h: 8}, bridge: true,
    text: L("当夜，城墙上。它们来了。不是一支军队，是一场雨——一场长着牙的雨。\n脉冲步枪的蓝光连成一片，打在虫潮上就像往海里扔石头。\n“不要数它们，”凯尔拉说，“数你的电池。”",
            "That night, on the city wall. They come. Not an army: a rain, a rain with teeth.\nPulse fire merges into one blue sheet, and against the swarm it's like throwing stones into the sea.\n“Don't count them,” Kel'ra says. “Count your power cells.”"),
    effects: {hp: -10, sanity: -5},
    alt: [
      {if: {flag: "checkedCells"}, add: L("你早就数好了。数字很小，手很稳。", "You counted them already. A small number. Steady hands.")},
      {if: {flag: "besideOrin"}, add: L("奥林长者就站在你身边，长袍一动不动。", "Aun'el Orin stands right beside you, robes motionless.")}
    ],
    choices: [
      C("守住射击线", "Hold the firing line", "tau_702", {result: L("换电池，开火，换电池，开火。直到虫潮里有什么东西，让所有小虫同时停下。", "Swap cell, fire, swap cell, fire. Until something in the swarm makes every small one stop at once.")}),
      C("跟格拉克萨去侧翼", "Flank with Grrak'tha", "tau_703", {require: {flag: "grrakBond"}, hideIfLocked: true, result: L("格拉克萨在城墙下点了你的名，冲你吼了一声，像在笑。你跟着克鲁特跳下城墙，冲进了长着牙的雨里。", "Below the wall Grrak'tha calls your name and roars, almost laughing. You follow the Kroot off the wall into the rain with teeth.")}),
      C("把一半电池分给凯尔拉", "Split your power cells with Kel'ra", "tau_702", {require: {flag: "wronged_kelra"}, hideIfLocked: true, effects: {renown: 2, set: {forgiven_kelra: true, rooted: true}}, result: L("凯尔拉看看你递来的电池，又看看你。“大义不原谅，”她说，“我也许可以。”她把一块电池推进枪里。", "Kel'ra looks at the cells you hold out, then at you. “The Greater Good does not forgive,” she says. “I might.” She slots one into her rifle.")})
    ]};

  N.tau_702 = {chapter: 7, scene: "spore_sky", speaker: KELRA, foe: "tyranid_warrior", time: {h: 3},
    text: L("虫潮中央站着一只更高大的东西。它一转头，周围几百只小虫同时转头。\n你从瞄准镜里看它，它也在看你——不，是有什么更大的东西，借着它的眼睛在看你。\n“那是节点，”凯尔拉说，“打断它。”",
            "In the swarm's heart stands something taller. When it turns its head, hundreds of small ones turn with it.\nYou watch it through your scope and it watches you. No—something far larger is watching you through its eyes.\n“That is a node,” Kel'ra says. “Sever it.”"),
    codex: ["xenos_tyranid_warrior"],
    choices: [
      C("屏住呼吸，开火", "Hold your breath and fire", null, M(R(0.45, "sanity", "tau_704", "tau_705", L("你屏住呼吸，世界缩成瞄准镜里的一个点。扣下扳机的那一刻，你就知道打中了。", "You hold your breath. The world shrinks to one point in the scope. The instant you squeeze, you know it's a hit."), L("你扣下扳机的瞬间，它往旁边让了一步，像早就知道你要开枪。", "As you squeeze, it steps aside, as if it knew you would fire.")), {effects: {taint: {khorne: 10}}})),
      C("让92号给你标记目标", "Have Drone 92 mark the target", "tau_704", {require: [{flag: "namedDrone"}, {notFlag: "droneDamaged"}], hideIfLocked: true, result: L("92号飞向前方，一道细细的光落在那东西的额头。你只需要扣扳机。", "Drone 92 darts forward and lays a thin beam on the creature's brow. All you have to do is pull the trigger.")})
    ]};

  N.tau_703 = {chapter: 7, scene: "jungle", speaker: GRRAK, foe: "gaunt", time: {h: 3},
    text: L("克鲁特从侧翼杀进虫群，像一把刀切进水里。格拉克萨冲在最前面。\n战斗结束时，他靠着树坐下，肚子上有个洞。\n“克鲁特不埋死人，”他说，“克鲁特记住死人。你……吃一口。记住我。”",
            "The Kroot cut into the swarm's flank like a knife into water. Grrak'tha leads them.\nWhen it ends, he sits against a tree with a hole in his belly.\n“Kroot don't bury the dead,” he says. “Kroot remember them. You... take one bite. Remember me.”"),
    effects: {hp: -10, set: {grrakDead: true}},
    alt: [
      {if: {flag: "grrakFriend"}, add: L("他看见你口袋里露出的那根羽毛，咔哒笑了一声。", "He sees his quill sticking out of your pocket and gives a clicking laugh.")},
      {if: {flag: "oweGrrak"}, add: L("“你欠克鲁特一顿饭，”他喘着说，“今天还。”", "“You owe Kroot a dinner,” he wheezes. “Today you pay.”")}
    ],
    choices: [
      C("答应他", "Promise him", "tau_706", {effects: {sanity: -10, renown: 5, set: {rememberGrrak: true, rooted: true}}, result: L("你照他说的做了。格拉克萨闭上眼，咔哒了一声，像一个满意的笑。", "You do as he asks. Grrak'tha closes his eyes and clicks once, like a satisfied laugh.")}),
      C("我做不到", "I can't", "tau_706", {effects: {sanity: -5, set: {krootLeft: true}}, result: L("格拉克萨看了你很久。“人类，”他叹气，“太犹豫。”他死后，克鲁特们沉默地离开了城墙。", "Grrak'tha looks at you a long time. “Humans,” he sighs. “Too much hesitation.” After he dies, the Kroot leave the wall in silence.")})
    ]};

  N.tau_704 = {chapter: 7, scene: "spore_sky", speaker: KELRA, foe: "gaunt", time: {h: 1},
    text: L("那东西倒下的瞬间，周围的小虫像突然忘了自己是谁，开始原地打转，互相撕咬。\n凯尔拉看了你一眼：“干得好。”\n她没加“对人类来说”。你注意到了。",
            "The moment it falls, the small ones seem to forget who they are. They spin in place and tear at each other.\nKel'ra glances at you. “Well done.”\nShe doesn't add “for a human.” You notice."),
    effects: {renown: 10, set: {killedNode: true}, taint: {slaanesh: 15}},
    choices: [
      C("换上新电池", "Slot in a fresh cell", "tau_706", {result: L("电池咔哒一声卡进去。你抬起头，天上有一个巨大的影子正在俯冲。", "The cell clicks home. When you look up, a vast shadow is diving out of the sky.")})
    ]};

  N.tau_705 = {chapter: 7, scene: "spore_sky", speaker: D92, foe: "tyranid_warrior", time: {h: 1},
    text: L("你打偏了。骨刃落下时，一个小小的影子挡在你面前，哔了一声。\n92号碎成了好几块。最大的那块还亮着灯，又哔了一声，然后灭了。\n你把它塞进了口袋。",
            "You miss. As the bone-blade falls, a small shape darts in front of you and beeps.\nDrone 92 breaks into several pieces. The largest still has a light on. It beeps once more, then goes dark.\nYou put it in your pocket."),
    effects: {hp: -15, sanity: -15, set: {droneLost: true, turnBack: true}},
    alt: [
      {if: {flag: "told92"}, add: L("它最后那两声哔，是你给它起的名字。", "Those last two beeps were the name you gave it.")},
      {if: {flag: "droneSilent"}, add: L("你叫它闭嘴以后，它就再没出过声。直到这一下。", "It hadn't made a sound since you told it to shut up. Until now.")}
    ],
    choices: [
      C("继续战斗", "Keep fighting", "tau_706", {result: L("口袋里那块碎片还是温的。你咬着牙，继续开枪。", "The fragment in your pocket is still warm. You grit your teeth and keep shooting.")})
    ]};

  N.tau_706 = {chapter: 7, scene: "tau_city", speaker: ORIN, foe: "hive_tyrant", time: {h: 5},
    text: L("一只长着翅膀的巨虫从天而降，城墙上的奥林长者倒下了。\n那一刻，你身边的火族战士全都呆住了，像被抽走了线的木偶。\n人类没有呆住。人类从没被那条线牵过。",
            "A winged monster plunges from the sky, and Aun'el Orin falls from the wall.\nAt that instant every fire warrior around you freezes, like puppets whose strings have been cut.\nThe humans don't freeze. Humans were never on those strings."),
    effects: {sanity: -8, hp: -5},
    codex: ["xenos_hive_tyrant"],
    alt: [
      {if: {fromNode: ["tau_703"]}, add: L("你把格拉克萨的一根羽毛塞进口袋，刚爬回城墙。", "You've just climbed back onto the wall with one of Grrak'tha's quills in your pocket.")},
      {if: {flag: "scrapedMark"}, add: L("手腕上刮掉的那块疤，突然跳了一下。", "The scar where you scraped off the mark gives a sudden throb.")}
    ],
    choices: [
      C("冲人类古维萨大喊", "Shout to the human gue'vesa", "tau_706a", {effects: {renown: 10, hp: -5}, result: L("你吼出每一个你记得的人类名字。墙上一张张人类的脸转了过来。", "You bellow every human name you can remember. Along the wall, human faces turn toward you.")}),
      C("拖着发呆的钛人撤退", "Drag the frozen T'au back", "tau_707", {effects: {renown: 8, hp: -10, set: {savedFireWarriors: true}}, result: L("你揪着两个火族战士的领子往后拖。他们很轻，轻得像空壳。半路上，其中一个眨了眨眼。", "You haul two fire warriors back by their collars. They're light as empty shells. Halfway, one of them blinks.")}),
      C("摇醒凯尔拉", "Shake Kel'ra awake", "tau_707", {require: {flag: "sawString"}, hideIfLocked: true, effects: {renown: 5, set: {wokeKelra: true}}, result: L("你见过那根线。你抓住凯尔拉的肩膀使劲摇，喊她的名字。她额头的竖纹一紧，醒了过来。", "You've seen that string before. You grab Kel'ra's shoulders and shake, shouting her name. The slit on her brow tightens; she comes back.")}),
      C("呼唤西拉斯的神", "Call on Silas's god", "tau_706b", {require: {flag: "cultMark"}, hideIfLocked: true, result: L("你念出那个名字。手腕上的符号烧了起来。", "You speak the name. The mark on your wrist catches fire.")})
    ]};

  N.tau_706a = {chapter: 7, scene: "tau_city", speaker: S("gue_vesa", "老哈斯克", "Old Hask"), foe: "gaunt", time: {h: 1},
    text: L("人类古维萨没被那根线牵着。哈斯克第一个应声，乔里第二个。\n人类的枪声撑住了城墙。整整一刻钟，只有人类在开火。\n直到凯尔拉晃了晃脑袋，重新举起了枪。",
            "The human gue'vesa were never on that string. Hask answers first; Jory second.\nHuman fire holds the wall. For a full quarter of an hour, only humans are shooting.\nUntil Kel'ra shakes her head and raises her rifle again."),
    effects: {sanity: 5, taint: {khorne: 10}},
    choices: [
      C("撑住", "Hold", "tau_707", {result: L("火族战士一个接一个醒过来。有人经过你身边时，低声说了句钛语。你听懂了：谢谢。", "The fire warriors come back one by one. One passing you murmurs a word in T'au. You understand it: thank you.")})
    ]};

  N.tau_706b = {chapter: 7, scene: "tau_city", speaker: S("sigil_undivided", "西拉斯的神", "Silas's God"), foe: "gaunt", time: {h: 1},
    text: L("有什么东西从你体内涌出来。你冲上城墙，一枪比一枪准。你在笑，笑得停不下来。\n虫潮退了。醒过来的火族战士看着你，往后退了一步。\n乔里也是。",
            "Something floods out of you. You charge the wall, every shot truer than the last. You're laughing, and you can't stop.\nThe swarm pulls back. The fire warriors, waking, look at you and step back.\nSo does Jory."),
    effects: {corruption: 25, hp: 25, renown: 5, taint: {khorne: 50}, set: {seenMarked: true}},
    choices: [
      C("放下袖子", "Pull your sleeve down", "tau_707", {result: L("符号还在布料下发烫。没人再提这件事，可营房里，你身边的铺位都空了。", "The mark still burns under the cloth. No one mentions it again, but the bunks beside yours empty out.")})
    ]};

  N.tau_707 = {chapter: 7, scene: "tau_city", speaker: JORY, time: {d: 4}, gather: L("城墙营地", "Wall camp"), effects: {sanity: 5, hp: 5},
    grudgeLine: {npc: "jory", text: L("他递果子时没抬头。雷娜姨的名字，你们谁也没提。", "He holds the fruit out without looking up. Neither of you says Rena's name.")},
    text: L("第四天，城墙营地。换防的古维萨围着一锅热汤。救援舰队来讯：五天后到。\n凯尔拉接过了一台阵亡驾驶员的战斗服。\n乔里坐在你旁边剥果子：“我们永远是第三批。可我还是想当他们的一部分。傻吗？”",
            "Day four, the wall camp. Gue'vesa off shift crowd round a pot of soup. The relief fleet signals: five days out.\nKel'ra has taken over a dead pilot's battlesuit.\nJory sits beside you peeling a fruit. “We'll always be the third wave. But I still want to be part of them. Is that stupid?”"),
    alt: [
      {if: {flag: "renaCamp"}, add: L("雷娜姨从难民营托人捎来了半块面包。", "Rena has sent half a loaf over from the refugee camp.")},
      {if: {flag: "renaStayed"}, add: L("雷娜姨还在旧教堂。乔里每晚都朝那边看。", "Rena is still in the old chapel. Every night Jory looks that way.")},
    ],
    choices: [
      C("“不傻。”", "“It's not stupid.”", "tau_708", {effects: {sanity: 10, set: {joryBond: true, rooted: true}}, grudge: {npc: "jory", effects: {sanity: -5}, note: L("你告发过他母亲。这句安慰，从你嘴里出来是空的。", "You informed on his mother. Comfort from you rings hollow.")}, result: L("乔里笑了，把剥好的果子分你一半。那是你这几天吃过最甜的东西。", "Jory grins and gives you half the peeled fruit. It's the sweetest thing you've eaten in days.")}),
      C("“我也不知道。”", "“I don't know either.”", "tau_708", {effects: {sanity: 5, renown: 3}, result: L("乔里点点头，好像这个答案也挺好。你们一起看着紫色的天，没再说话。", "Jory nods, as if that answer is fine too. You both watch the violet sky without another word.")}),
      C("“雷娜姨的事，是我干的。”", "“About your mother. That was me.”", "tau_708", {require: {flag: "wronged_jory"}, hideIfLocked: true, effects: {sanity: 4, set: {forgiven_jory: true, rooted: true}}, result: L("乔里的手停在果子上。“我知道，”他说，“妈回来那天就告诉我了。”他把果子掰开，分你一半，没抬头。", "Jory's hand stops on the fruit. “I know,” he says. “Mum told me the day she came home.” He splits it in two, pushes half toward you, and doesn't look up.")})
    ]};

  N.tau_708 = {chapter: 7, scene: "spore_sky", speaker: null, time: {d: 3}, jump: L("第七天夜里，营房", "Night seven, the barracks"),
    grudgeLine: {npc: "jory", text: L("乔里缩在营房角落，血滴在钛人的手背上。他看见你，把脸转开了。", "Jory crouches in a corner of the barracks, blood dripping onto his T'au hand. He sees you and turns his face away.")},
    text: L("第七天夜里，营房里，所有人类同时流了鼻血。\n不是因为受伤，是因为一种声音——一种低到听不见、却压在每个人脑子里的嗡鸣。\n钛人什么都没感觉到。他们看着你们，第一次显得不知所措。",
            "On the seventh night, in the barracks, every human bleeds from the nose at once.\nNot from wounds. From a sound, too low to hear, pressing down inside every skull.\nThe T'au feel nothing. They watch you, and for the first time they look lost."),
    effects: {sanity: -10},
    alt: [
      {if: {anyFlag: ["seenMarked", "arrestedAtGate"]}, add: L("营房里的人都离你远远的。只有乔里没挪地方。", "In the barracks everyone keeps away from you. Only Jory stays put.")}
    ],
    choices: [
      C("捂住耳朵", "Cover your ears", "tau_801", {effects: {sanity: 5, taint: {nurgle: 30}}, result: L("没有用。那声音不是从耳朵进来的。你蜷在床铺上，觉得一切都没有用。", "It doesn't help. The sound doesn't come through your ears. You curl up on your bunk, sure that nothing helps.")}),
      C("去照顾乔里", "Go look after Jory", "tau_801", {effects: {renown: 3, set: {caredJory: true, rooted: true}}, grudge: {npc: "jory", effects: {sanity: -4}, note: L("他记得雷娜姨的事。你的手，他推开了一次。", "He remembers what you did to his mother. He pushes your hand away once.")}, result: L("乔里的鼻血止不住。你用袖子替他擦，他用钛人的手替你擦。", "Jory's nosebleed won't stop. You wipe his with your sleeve; he wipes yours with his T'au hand.")})
    ]};

  /* ============ Chapter 8 · The Swarmlord ============ */
  N.tau_801 = {chapter: 8, scene: "spore_sky", speaker: S("omen_hivemind", "虫巢意志", "The Hive Mind"), foe: "hive_tyrant", time: {h: 8}, bridge: true,
    text: L("第八天清晨，城墙上，它来了。比其他虫子都高，四条手臂，四把骨刃。\n它不冲锋，站着看你们的阵型，看了很久，像在下棋。\n凯尔拉在频道里说：“虫群主宰。它会学。每个战术只能用一次。”",
            "Dawn of day eight, on the wall: it arrives. Taller than the rest, four arms, four bone-blades.\nIt doesn't charge. It studies your formation a long time, as if playing chess.\nKel'ra on the comm: “The Swarmlord. It learns. Each of our tactics works only once.”"),
    effects: {sanity: -12, hp: -5},
    codex: ["xenos_swarmlord"],
    alt: [
      {if: {flag: "killedNode"}, add: L("它的目光在你身上停了很久。你打断过它的节点。", "Its gaze rests on you a long time. You severed one of its nodes.")},
      {if: {flag: "wokeKelra"}, add: L("“这次别让我呆住，”凯尔拉说，叫的是你的名字。", "“Don't let me freeze this time,” Kel'ra says, and uses your name.")}
    ],
    choices: [
      C("握紧步枪", "Grip your rifle", "tau_802", {result: L("步枪还是那么轻。你第一次希望它重一点。", "The rifle is as light as ever. For the first time, you wish it were heavier.")})
    ]};

  N.tau_802 = {chapter: 8, scene: "tau_city", speaker: KELRA, foe: "hive_tyrant", time: {h: 6},
    grudgeLine: {npc: "kelra", text: L("她这回没报战术。你只能凭她战斗服的火光，猜她在哪。", "This time she calls no tactics. You can only guess where she is by the flare of her suit.")},
    text: L("凯尔拉在城中心布下了考尤陷阱。虫群主宰走到陷阱边缘，停住了。\n然后它从另一边绕了进来。它也在等。\n防线一点点崩塌，港口方向传来平民的哭喊。",
            "Kel'ra lays a Kauyon trap in the city centre. The Swarmlord walks to the edge of it and stops.\nThen it comes in from the other side. It has been waiting too.\nThe line crumbles, and from the port comes the crying of civilians."),
    effects: {hp: -10},
    choices: [
      C("掩护凯尔拉的战斗服", "Cover Kel'ra's battlesuit", null, M(R(0.4, "hp", "tau_803", "tau_804", L("你冲出掩体，把一整块电池打进它的侧脸。它转过头，看向了你。", "You break cover and empty a whole cell into the side of its head. It turns to look at you."), L("你的射击打在它的甲壳上，连一道痕都没留下。它甚至没有转头。", "Your shots strike its carapace without leaving a mark. It doesn't even turn its head.")), {grudge: {npc: "kelra", p: -0.08, note: L("你告发过她。她的战斗服不再等你的信号。", "You informed on her. Her battlesuit no longer waits for your signal.")}})),
      C("带平民去最后一艘船", "Lead civilians to the last ship", "tau_805", {result: L("你朝港口方向大喊，挥手让人往那边跑。乔里已经在舷梯口等你了。", "You shout toward the port and wave people on. Jory is already waiting at the ramp."),
        resultAlt: [{if: {flag: "caredJory"}, text: L("“港口！”乔里在你耳边喊，“最后一艘船！”是他先想到的。你们一起挥手，把人往那边赶。", "“The port!” Jory yells in your ear. “The last ship!” He thought of it first. Together you wave people that way.")}]}),
      C("握紧口袋里的信物", "Clutch the keepsake in your pocket", "tau_806", {require: {flag: "prayerToken"}, hideIfLocked: true, result: L("枪声和尖叫突然离你很远。你的手伸进口袋，摸到了那件小小的、冰凉的东西。", "The gunfire and screaming suddenly seem far away. Your hand finds the small, cold thing in your pocket.")}),
      C("向西拉斯的神献上一切", "Offer everything to Silas's god", "tau_803", {require: {flag: "cultMark"}, hideIfLocked: true, effects: {corruption: 30, hp: 40, sanity: -10, taint: {khorne: 50}}, result: L("你说出了那个名字。有什么东西从你体内涌出来，接管了你的手，替你瞄准。", "You speak the name. Something floods out through you, takes your hands, and aims for you.")})
    ]};

  N.tau_803 = {chapter: 8, scene: "tau_city", speaker: S("tau_battlesuit", "凯尔拉的战斗服", "Kel'ra's Battlesuit"), foe: "hive_tyrant", time: {h: 1},
    text: L("你的射击逼它侧身了半步。就这半步，凯尔拉的战斗服从天而降，一记蒙卡斩在它肩上。\n虫群主宰没有倒下。它后退了，盯着凯尔拉，像在背下她的样子。\n它会记住的。下一次，就不灵了。",
            "Your fire forces it half a step aside. In that half step, Kel'ra's battlesuit drops from the sky and lands a Mont'ka strike on its shoulder.\nThe Swarmlord doesn't fall. It withdraws, staring at Kel'ra as if memorising her.\nIt will remember. Next time, that won't work."),
    effects: {renown: 15},
    alt: [
      {if: {flag: "savedFireWarriors"}, add: L("你拖回来的那两个火族战士，就在你两侧开火。", "The two fire warriors you dragged back are firing on either side of you.")},
      {if: {flag: "askedKelra"}, add: L("“我选了火，”她在频道里说，“为了你们。”", "“I chose fire,” she says on the comm. “For all of you.”")}
    ],
    choices: [
      C("撑住，等舰队", "Hold on for the fleet", "tau_806b", {result: L("你靠着墙数电池。还剩三块。东方的天边开始发白。", "You lean on a wall and count cells. Three left. On the eastern horizon, the sky begins to pale.")})
    ]};

  N.tau_804 = {chapter: 8, scene: "tau_city", speaker: null, foe: "hive_tyrant", time: {h: 1},
    text: L("骨刃划过战斗服的驾驶舱。凯尔拉的频道里只剩下电流声。\n你被甩出去，摔在一堵墙下。你看着那东西从凯尔拉身边走过，没有停留。\n它已经学会了她。它不需要她了。",
            "A bone-blade slices across the battlesuit's cockpit. Kel'ra's channel goes to static.\nYou're thrown against a wall. You watch the thing walk past Kel'ra without pausing.\nIt has learned her. It doesn't need her anymore."),
    effects: {hp: -20, sanity: -15, set: {kelraDead: true}},
    choices: [
      C("爬向港口", "Crawl toward the port", "tau_806b", {result: L("你一寸一寸地爬。身后的城市在燃烧，前方的天边泛起了白光。", "You crawl inch by inch. Behind you the city burns; ahead, the horizon turns white.")})
    ]};

  N.tau_805 = {chapter: 8, scene: "tau_city", speaker: JORY, foe: "gaunt", time: {h: 3},
    grudgeLine: {npc: "jory", text: L("他笑得有点勉强，像是在练习原谅你。", "His grin is a little strained, like someone practising forgiving you.")},
    text: L("你和乔里守在舷梯口，把人一个一个推上船。人类，克鲁特，一个吓呆了的土族工程师。\n没有人检查他们是第几批。\n舱门关上时，乔里冲你笑：“看，我们是一批的。”",
            "You and Jory hold the ramp, shoving people aboard one by one. Humans, Kroot, a terrified earth-caste engineer.\nNobody checks which wave they belong to.\nAs the hatch closes, Jory grins at you. “See? We're all one wave.”"),
    effects: {renown: 10, hp: -10, sanity: 10},
    alt: [
      {if: {flag: "rememberGrrak"}, add: L("几个克鲁特守在你身边。它们把你当成格拉克萨的族人。", "A few Kroot guard you; they count you as Grrak'tha's kin.")},
      {if: {flag: "krootLeft"}, add: L("舷梯边没有一个克鲁特来帮忙。他们早就离开了城墙。", "No Kroot come to help at the ramp. They left the wall long ago.")}
    ],
    choices: [
      C("转身面对虫群", "Turn to face the swarm", "tau_806b", {grudge: {npc: "jory", effects: {hp: -6}, note: L("你告发过雷娜姨。乔里守在你背后，却不再全然信你。", "You informed on Rena. Jory guards your back, but no longer fully trusts you.")}, result: L("你和乔里背靠背站着，把最后的电池分成两份。虫潮涌上来时，天边亮了。", "You and Jory stand back to back and split the last cells. As the swarm surges in, the horizon lights up.")})
    ]};

  N.tau_806 = {chapter: 8, scene: "throne_light", speaker: S("omen_emperor", "遥远的金光", "Distant Gold"), time: {h: 1},
    text: L("你握着雷娜姨的吊坠，结结巴巴地念出一段小时候学的祷词。\n什么都没发生。没有奇迹，没有光。\n可你的手不抖了。在这个离帝皇最远的地方，你第一次明白雷娜姨为什么不肯扔掉它。",
            "Gripping Aunt Rena's pendant, you stumble through a prayer from childhood.\nNothing happens. No miracle, no light.\nBut your hands stop shaking. Here, as far from the Emperor as anyone can be, you finally understand why Rena never threw it away."),
    effects: {sanity: 20},
    codex: ["imp_emperor"],
    alt: [
      {if: {all: [{flag: "malosRosary"}, {notFlag: "hasAquila"}]}, text: L("你攥着马洛中士的念珠，一颗一颗地数，念出他教你的那段祷词。\n什么都没发生。没有奇迹，没有光。\n可你的手不抖了。活下去的人，才能替死人记得。", "You grip Sergeant Marrow's beads and count them one by one, saying the prayer he taught you.\nNothing happens. No miracle, no light.\nBut your hands stop shaking. Only the living can remember for the dead.")}
    ],
    choices: [
      C("把它挂在胸前", "Hang it on your chest", "tau_806b", {result: L("你把它挂在胸前，挂在钛人的护甲外面。没有人有空管你。", "You hang it on your chest, outside the T'au armour. Nobody has time to care.")})
    ]};

  N.tau_806b = {chapter: 8, scene: "spore_sky", speaker: S("omen_tau_fleet", "钛族救援舰队", "T'au Relief Fleet"), time: {h: 12},
    text: L("第九天黎明，白色舰队盖满天空。轨道炮像一场倒着下的雨，烧穿了虫群的脊背。\n虫群主宰看了一眼这座城，转身走进孢子雾里。它会回来的。\n中午，以太族议会宣布：达尔诺尔“不可持续”，全体撤离。",
            "Dawn of day nine: the white fleet fills the sky. Orbital fire falls like rain in reverse, burning through the swarm's spine.\nThe Swarmlord takes one last look at the city and walks into the spore fog. It will be back.\nAt noon the Ethereal council declares Dal'nor “unsustainable”. Full evacuation."),
    effects: {sanity: 10},
    codex: ["tau_empire"],
    alt: [
      {if: {flag: "kelraDead"}, add: L("凯尔拉的战斗服没有回来。", "Kel'ra's battlesuit does not come back.")},
      {if: {flag: "renaStayed"}, add: L("旧教堂的方向，还亮着一盏灯。", "Toward the old chapel, a single lamp is still lit.")}
    ],
    choices: [
      C("去港口", "Go to the port", "tau_807", {result: L("港口挤满了人。这一次，没有人念批次。", "The port is packed. This time, nobody reads out waves.")}),
      C("回头", "Turn back", "tau_end_devoured", {require: {flag: "turnBack"}, hideIfLocked: true, result: L("你逆着撤离的人流，走回了孢子雾里。", "Against the tide of evacuees, you walk back into the spore fog.")})
    ]};

  N.tau_807 = {chapter: 8, scene: "tau_city", speaker: VASH, time: {h: 4},
    text: L("港口上，最后一艘船在等。瓦尚站在舷梯边，手里拿着名单。\n“大义记得每一份贡献，”他说。他今天没有笑。\n舷梯下，人类、克鲁特和钛人挤在一起，谁也不知道自己是第几批。",
            "At the port the last ship waits. Vash'aun stands by the ramp, list in hand.\n“The Greater Good remembers every contribution,” he says. Today he does not smile.\nAt the foot of the ramp, humans, Kroot and T'au press together. No one knows which wave they are."),
    choices: [
      C("跟凯尔拉去海湾的另一边", "Go with Kel'ra across the Gulf", "tau_end_enclaves", {require: [{flag: "farsightPact"}, {notFlag: "kelraDead"}], result: L("凯尔拉什么也没说，只递给你一套没有任何徽记的护甲。人群里，没人注意到两个人走开了。", "Kel'ra says nothing, only hands you armour with no insignia. In the crowd, no one notices two people slip away.")}),
      C("接受大义的勋章", "Accept the Greater Good's honour", "tau_end_citizen", {require: [{stat: "renown", min: 40}, {notFlag: "cultMark"}, {notFlag: "watched"}], result: L("瓦尚在名单上你的名字旁画了一颗星。台下的人类在鼓掌，台上的钛人在微笑。", "Vash'aun draws a star beside your name. Below, the humans applaud; above, the T'au smile.")}),
      C("留在达尔诺尔的废墟上", "Stay in the ruins of Dal'nor", "tau_end_watch", {require: {flag: "rooted"}, result: L("最后一艘船起飞了。你没有上去。你在这里有放不下的人和事。", "The last ship lifts off. You aren't on it. There are people and things here you can't leave.")}),
      C("排进人群，上船", "Join the crowd and board", "tau_end_thirdwave", {result: L("你被人群推着上了舷梯。瓦尚在你的名字旁写了一个数字：3。", "The crowd carries you up the ramp. Beside your name, Vash'aun writes a number: 3.")})
    ]};

  N.tau_end_enclaves = {chapter: 8, scene: "tau_outpost", speaker: S("omen_farsight", "红色战斗服", "Crimson Battlesuit"), time: {d: 60, warp: true}, jump: L("越过海湾，六十天", "Across the Gulf, sixty days"),
    text: L("红色的战斗服在海湾边等着。凯尔拉回头看了一眼达尔诺尔，没有说再见。\n远见的飞地里，钛人、人类和克鲁特会为了一个决定吵上整整一夜。\n没人叫这“暂时的误会”。他们叫它“开会”。",
            "The crimson battlesuit waits at the edge of the Gulf. Kel'ra looks back at Dal'nor once and doesn't say goodbye.\nIn Farsight's Enclaves, T'au, humans and Kroot argue all night over a single decision.\nNobody calls it a temporary misunderstanding. They call it a meeting."),
    ending: {kind: "good", title: L("海湾的另一边", "Beyond the Gulf"), cause: L("投奔远见飞地", "Defected to the Farsight Enclaves")}};

  N.tau_end_citizen = {chapter: 8, scene: "tau_city", speaker: VASH, time: {y: 1}, jump: L("一年后，新的殖民地", "A year later, a new colony"),
    text: L("一年后，在新的殖民地，瓦尚亲手把勋章别在你胸前。你是第一个获此荣誉的古维萨。\n街区的孩子会在钛人的学校长大，学会说钛语，学会完美的微笑。\n你常常想，这是好事。你几乎每次都这么想。",
            "A year later, on a new colony, Vash'aun pins the medal on your chest himself. You're the first gue'vesa so honoured.\nThe quarter's children will grow up in T'au schools, speak T'au, and learn the perfect smile.\nYou often think this is a good thing. Almost every time."),
    alt: [
      {if: {flag: "keptName"}, add: L("勋章背面刻名字的地方，是空白的。", "Where the name should be engraved on the back, it is blank.")},
      {if: {flag: "liaison"}, add: L("你的联络官徽章，从淡蓝换成了金色。", "Your liaison badge goes from pale blue to gold.")}
    ],
    ending: {kind: "good", title: L("大义的公民", "Citizen of the Greater Good"), cause: L("受勋成为大义公民", "Honoured citizen of the Greater Good")}};

  N.tau_end_watch = {chapter: 8, scene: "ruins", speaker: null, time: {y: 2}, jump: L("两年后，废墟上", "Two years later, in the ruins"),
    text: L("你留了下来，和几个不肯走的人一起重建达尔诺尔。\n旧教堂的空讲台上，挂着一枚双头鹰，旁边是钛人的圆环。\n两年了，没人把哪一个摘下来。",
            "You stay to rebuild Dal'nor with the few who wouldn't leave.\nOn the old chapel's empty pulpit hangs an eagle, and beside it, a T'au ring.\nTwo years on, nobody has taken either one down."),
    alt: [
      {if: {anyFlag: ["joryBond", "forgiven_jory"]}, add: L("乔里也留下了，用钛人的手砌墙。", "Jory stayed too, laying bricks with his T'au hand.")},
      {if: {anyFlag: ["renaStayed", "renaCamp"]}, add: L("雷娜姨每天还去擦那张讲台。", "Aunt Rena still dusts that pulpit every day.")},
      {if: {flag: "grrakDead"}, text: L("你留了下来，和几个不肯走的人、几个记得格拉克萨的克鲁特一起，重建达尔诺尔。\n旧教堂的空讲台上，挂着一枚双头鹰，旁边是钛人的圆环。\n两年了，没人把哪一个摘下来。", "You stay to rebuild Dal'nor with the few who wouldn't leave, and a few Kroot who remember Grrak'tha.\nOn the old chapel's empty pulpit hangs an eagle, and beside it, a T'au ring.\nTwo years on, nobody has taken either one down.")}
    ],
    ending: {kind: "good", title: L("守望者", "The Watch"), cause: L("留守达尔诺尔", "Stayed to guard Dal'nor")}};

  N.tau_end_devoured = {chapter: 8, scene: "spore_sky", speaker: null, foe: "gaunt", time: {h: 2},
    text: L("口袋里，92号的碎片忽然亮了，哔了两声。你转身走回孢子雾里，去找它想让你找的东西。\n雾里有东西在动。成千上万。\n克鲁特吃东西是为了记住。虫子吃东西是为了忘掉。这一次，什么也不会被记住。",
            "In your pocket, Drone 92's fragment suddenly lights up and beeps twice. You turn back into the spore fog to find whatever it wants you to find.\nSomething moves in the fog. Thousands of somethings.\nKroot eat to remember. Bugs eat to forget. This time, nothing will be remembered."),
    alt: [
      {if: {all: [{flag: "renaStayed"}, {notFlag: "droneLost"}]}, text: L("你在旧教堂找到了雷娜姨。她坐在讲台前，灯还亮着。\n孢子雾里有东西在动。成千上万。\n她握住你的手，开始念祷词。你跟着念。这一次，什么也不会被记住。", "You find Aunt Rena in the old chapel, sitting before the pulpit, the lamp still lit.\nSomething moves in the spore fog. Thousands of somethings.\nShe takes your hand and begins to pray. You pray with her. This time, nothing will be remembered.")}
    ],
    ending: {kind: "bad", title: L("被吞噬", "Devoured"), cause: L("被虫群吞噬", "Devoured by the swarm")}};

  N.tau_end_thirdwave = {chapter: 8, scene: "ship_interior", speaker: null, time: {d: 20}, jump: L("撤离之后，二十天", "Twenty days after the evacuation"),
    text: L("你挤在最后一艘船的货舱里，和人类、克鲁特、几箱土族设备一起。\n二十天后，钛族边境的难民站给每个人发了一张淡蓝色的卡片，写着新的安置批次：第三批。\n你等着。大家都在等。",
            "You're crammed into the last ship's hold with humans, Kroot and crates of earth-caste equipment.\nTwenty days later a T'au border refugee station hands everyone a pale blue card with a new resettlement wave: third.\nYou wait. Everyone waits."),
    alt: [
      {if: {flag: "smuggledRefugees"}, add: L("队伍里，你认出了几张在水道里见过的脸。他们冲你笑。", "In the queue you spot faces from the channel boat. They smile at you.")}
    ],
    ending: {kind: "bad", title: L("第三批", "The Third Wave"), cause: L("沦为排在第三批的难民", "A refugee in the third wave")}};

  /* ============ Claim endings (SPEC §19): a Chaos god's claim, accepted or forced. Reached via the claim events' goto. ============ */
  N.tau_end_claim_khorne = {scene: "jungle", speaker: S("daemon_khorne", "远处的鼓", "A Distant Drum"), time: {d: 60},
    text: L("钛人没见过这种病：一个古维萨，越打越不疼，越打越停不下。\n无人机把你记作“效率异常”，火族不再和你一起出击。某天你独自走进丛林，去找下一场仗。\n大义需要理由，血神不需要。他只要头骨。",
            "The T'au have never seen this sickness: a gue'vesa who feels less pain with every fight, and cannot stop.\nDrones log you as an efficiency anomaly; the fire caste stop deploying with you. One day you walk into the jungle alone, looking for the next fight.\nThe Greater Good needs reasons. The Blood God needs only skulls."),
    codex: ["god_khorne"],
    ending: {kind: "bad", title: L("效率异常", "Efficiency Anomaly"), cause: L("被恐虐收走", "Claimed by Khorne")}};

  N.tau_end_claim_nurgle = {scene: "hive_hab", speaker: S("daemon_nurgle", "慈祥的声音", "A Fond Voice"), time: {d: 20},
    text: L("人类街区闹起了咳嗽病，从你开始。你一点也不难受，挨家挨户给邻居送汤。\n医疗无人机封了整条街。钛人隔着能量屏，困惑地看着一群笑眯眯的病人。\n慈父不懂大义，他只知道每个孩子都该有个家。",
            "A coughing sickness breaks out in the human quarter, and it starts with you. You feel fine, and go door to door bringing your neighbours soup.\nMedical drones seal the whole street. Behind the energy screen, the T'au stare in confusion at a crowd of smiling sick people.\nGrandfather knows nothing of the Greater Good. Only that every child deserves a home."),
    codex: ["god_nurgle"],
    ending: {kind: "bad", title: L("封锁的街道", "The Sealed Street"), cause: L("成为纳垢的信使", "Became Nurgle's carrier")}};

  N.tau_end_claim_tzeentch = {scene: "tau_city", speaker: S("daemon_tzeentch", "挪动的字", "Shifting Letters"), time: {y: 2},
    text: L("你在梦里看见钛人的作战计划，比以太族看得还远。\n你把它们一页页写下来，卖给水族，卖给海湾那边的人，也卖给帝国。每一方都以为你是自己人。\n直到三方同时发现了。那一天，也写在计划里。",
            "In dreams you see the T'au battle plans, further ahead than any Ethereal can.\nYou write them down page by page and sell them: to the water caste, to people across the Gulf, to the Imperium. Each side thinks you're theirs.\nUntil all three find out at once. That day was in the plan too."),
    codex: ["god_tzeentch"],
    ending: {kind: "bad", title: L("三面间谍", "Triple Agent"), cause: L("沦为奸奇的棋子", "Became Tzeentch's pawn")}};

  N.tau_end_claim_slaanesh = {scene: "tau_city", speaker: S("daemon_slaanesh", "甜得发苦的声音", "A Bittersweet Voice"), time: {y: 1},
    text: L("钛人的世界太节制了：定量的口粮，定量的称赞。你要的不止这些。\n你在人类街区办了一场不散的聚会：更甜的糖，更响的音乐，更多掌声。\n客人们都很满足，第二天又来。最后被掏空的，是你自己。",
            "The T'au world is too measured: rationed food, rationed praise. You want more than that.\nIn the human quarter you throw a party that never ends: sweeter sugar, louder music, more applause.\nEveryone leaves satisfied, and comes back the next day. The last one hollowed out is you."),
    codex: ["god_slaanesh"],
    ending: {kind: "bad", title: L("不散的聚会", "The Party That Never Ends"), cause: L("被色孽掏空", "Hollowed out by Slaanesh")}};

  /* ============ Death nodes (engine-triggered) ============ */
  N.tau_death_hp = {scene: "tau_outpost", speaker: VASH,
    text: L("瓦尚在报告上签了字。你的名字被归入一栏：“可接受的损失（人类）”。\n他的笑容一如既往。\n后来，有个克鲁特说他记得你。没人知道他是怎么记住的。",
            "Vash'aun signs the report. Your name goes into a column: “Acceptable losses (human).”\nHis smile is the same as ever.\nLater, a Kroot says he remembers you. No one asks how."),
    ending: {kind: "death", title: L("可接受的伤亡", "Acceptable Losses"), cause: L("列为可接受的伤亡", "Listed as acceptable losses")}};

  N.tau_death_sanity = {scene: "warp", speaker: null,
    text: L("你一直在做的那个梦，终于醒不过来了。\n门、眼睛、走调的歌，全都挤进你的脑子里，没有一样是你自己的。\n你不再害怕了。你什么都不再是了。",
            "The dream you kept having finally won't let you wake.\nThe door, the eye, the out-of-tune song all crowd into your head, and none of it is yours.\nYou are no longer afraid. You are no longer anything."),
    alt: [
      {if: {fromChapter: {min: 6}}, text: L("那张天上的嘴，终于不只是梦了。\n你的脑子里只剩下一种声音，低沉、饥饿、没有尽头，像一亿只虫子在同一时刻呼吸。\n你不再害怕了。你什么都不再是了。", "The mouth in the sky is no longer just a dream.\nOnly one sound remains in your head: low, hungry, endless, like a hundred million insects breathing at once.\nYou are no longer afraid. You are no longer anything.")}
    ],
    ending: {kind: "death", title: L("亚空间的阴影", "The Shadow"), cause: L("心智被梦魇吞没", "Mind drowned by the nightmare")}};

  N.tau_death_corruption = {scene: "warp", speaker: S("sigil_undivided", "会倾听的神", "A God Who Listens"),
    text: L("西拉斯没有说谎：那个神真的会听人类说话。\n它听得太仔细了，仔细到搬了进来。\n钛人的传感器把你登记为“未知生物信号”。他们说，从没见过这种东西。",
            "Silas didn't lie: that god really does listen to humans.\nIt listened so closely that it moved in.\nT'au sensors log you as “unknown biological signal.” They say they've never seen anything like it."),
    alt: [
      {if: {notFlag: "metSilas"}, text: L("你脑子里有个声音一直在说话，很温和，很耐心，比谁都更像在听你说话。\n它听得太仔细了，仔细到搬了进来。\n钛人的传感器把你登记为“未知生物信号”。", "A voice in your head has been talking all along: gentle, patient, more like it's listening to you than anyone ever was.\nIt listened so closely that it moved in.\nT'au sensors log you as “unknown biological signal.”")}
    ],
    ending: {kind: "death", title: L("会倾听的神", "A God Who Listens"), cause: L("被西拉斯的神占据", "Taken by Silas's god")}};


  WH.registerFaction({
    id: "tau",
    name: L("钛帝国", "T'au Empire"),
    tagline: L("为了大义——排在第三批", "For the Greater Good—third in line"),
    role: L("人类殖民者", "Human colonist"),
    world: L("达尔诺尔", "Dal'nor"),   // SPEC §27 home world (New Calder; the turned Guardsman is resettled here too)
    playerSprite: "player_tau",
    color: "#3fa7c9",
    startNode: "tau_101",
    startDate: {year: 111, mill: 42},
    startStats: {hp: 100, sanity: 100, corruption: 0, renown: 10},
    renownLabel: L("大义", "Greater Good"),
    renownIcon: "icon_greatergood",
    taintMod: {khorne: 0.7, nurgle: 0.7, tzeentch: 0.7, slaanesh: 0.7},   // SPEC §19: multiplier on positive taint deltas (cleanses unscaled)
    npcs: {   // SPEC §28 grudges: people this route lets you wrong (flag wronged_<id>); see tau_402 / tau_508
      rena: {name: L("雷娜姨", "Aunt Rena"), aka: [L("雷娜", "Rena")], sprite: "preacher"},
      jory: {name: L("乔里", "Jory"), sprite: "gue_vesa"},
      kelra: {name: L("凯尔拉", "Kel'ra"), sprite: "tau_warrior"}
    },
    renownHelp: L("大义值是钛帝国对你“贡献”的评估。服从、耐心、为大义做艰难的选择会让它上升；质疑、违令、偏袒旧帝国会让它下降。它够高，你才会被授予荣誉，也决定你排在第几批。",
                  "Greater Good is the T'au Empire's measure of your contribution. Obeying orders, patience, and hard choices made for the Greater Good raise it; questioning, disobedience and sympathy for the old Imperium lower it. Enough of it earns honours, and decides which wave you are in."),
    origins: [
      {id: "colonist", name: L("人类殖民者", "Human colonist"),
       desc: L("新卡尔德的码头工人，扛货练出好身板。钛人工钱从不迟到，大义你还没想明白。", "A New Calder dockhand, strong from hauling cargo. The T'au pay on time; the Greater Good you haven't worked out yet."),
       sprite: "player_tau", startNode: "tau_101",
       max: {hp: 105, sanity: 100}, stats: {hp: 105, sanity: 100, corruption: 0, renown: 5}, set: {origin_colonist: true}},
      {id: "pow", name: L("归顺的星界军俘虏", "Turned Guardsman"),
       desc: L("被俘后选了大义的帝国兵。体格还在，噩梦未散，两边都不太信你。", "An Imperial soldier who chose the Greater Good after capture. Still fit, still haunted, and trusted by neither side."),
       sprite: "guardsman", startNode: "tau_o_pow_1",
       max: {hp: 115, sanity: 95}, stats: {hp: 115, sanity: 95, corruption: 0, renown: 0}, set: {origin_pow: true}},
      {id: "trader", name: L("港口商人", "Port trader"),
       desc: L("在达尔诺尔港两头做买卖。脑子活、人脉广，就是没扛过枪。", "You trade both ways at Dal'nor port: quick wits, good contacts, and you've never carried a gun."),
       sprite: "player_tau", startNode: "tau_o_trader_1",
       max: {hp: 90, sanity: 105}, stats: {hp: 90, sanity: 105, corruption: 0, renown: 15}, set: {origin_trader: true}}
    ],
    deathNodes: {hp: "tau_death_hp", sanity: "tau_death_sanity", corruption: "tau_death_corruption"},
    learn: {
      leaders: ["tau_ethereal", "tau_greater_good", "tau_shadowsun", "tau_farsight"],
      enemies: ["imp_imperium", "xenos_ork", "xenos_tyranid"],
      boss: ["xenos_swarmlord", "xenos_hive_mind"]
    },
    chapters: {
      1: L("新邻居", "New Neighbours"),
      2: L("火之道", "The Way of Fire"),
      3: L("绿皮", "Green Skins"),
      4: L("旧主人", "The Old Masters"),
      5: L("远见", "Farsight"),
      6: L("阴影", "The Shadow"),
      7: L("吞噬", "The Devouring"),
      8: L("虫群主宰", "The Swarmlord")
    },
    nodes: N
  });
})();
