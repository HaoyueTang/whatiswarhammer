/* data/factions/necrons.js — Necron route (text role: text-necrons). SPEC §3, §11, §12, §16–§18.
 * Player: a human on an Imperial dig on Thessa Null, a "dead world" that is really the Akhemet tomb world. Start 113.M42.
 * Survive by being interesting: overlord Sekhrat keeps you, the Collector (Trazyn — only ever via omen_collector)
 * takes you as a living specimen, and in the end a Nightbringer shard breaks its tesseract cage.
 * Helpers: L(zh,en) localized string · S(sprite,zh,en) speaker · C(zh,en,next,extra) choice ·
 *          X(effects,zh,en) {effects,result} · R(p,stat,success,fail, RR(szh,sen,fzh,fen)) roll + rollResult ·
 *          O(...objs) merge (e.g. require + X).
 * Taint (SPEC §18) is hidden: never mentioned in text.
 * Grudges (SPEC §28): G(npc,zh,en,p,effects) -> {grudge}; GL(npc,zh,en) -> grudgeLine. Three people can be wronged:
 *   Magos Vektrix-9 (lexmechanic origin: lies / leaks his data in ch.1 — he is still a cyborg magos in ch.7, nec_701 shows him alive),
 *   Overlord Sekhrat (bolting from his gift, nec_404), Inquisitor Mordane (giving the camp's weak posts away, nec_705).
 *   Humans of the dig (Marrow, Kaal, Oriel, Hollis) are NOT given grudges: centuries pass in stasis and the text never keeps them alive.
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
  function G(npc, zh, en, p, eff) { var g = {npc: npc, note: {zh: zh, en: en}}; if (p) g.p = p; if (eff) g.effects = eff; return {grudge: g}; }
  function GL(npc, zh, en) { return {npc: npc, text: {zh: zh, en: en}}; }

  var MARROW  = S("dig_leader", "玛罗教授", "Professor Marrow");
  var VEKTRIX = S("explorator", "维克崔斯-9贤者", "Magos Vektrix-9");
  var KAAL    = S("guard_sergeant", "卡尔中士", "Sergeant Kaal");
  var ORIEL   = S("medicae", "奥里尔医师", "Medicae Oriel");
  var SEKHRAT = S("necron_lord", "塞赫拉特霸主", "Overlord Sekhrat");
  var NEFER   = S("cryptek", "墓穴技师涅弗", "Nefer the Cryptek");
  var IMHET   = S("cryptek", "编目者伊姆赫特", "Imhet the Cataloguer");
  var COLLECTOR = S("omen_collector", "收藏家", "The Collector");
  var KING    = S("omen_silent_king", "寂静之王的指令", "The Silent King's Command");
  var STORM   = S("omen_stormlord", "绿色雷暴", "The Green Storm");
  var SHARD   = S("omen_ctan", "星神碎片", "The Shard");
  var MERUK   = S("flayed_one", "梅鲁克勋爵", "Lord Meruk");
  var MORDANE = S("inquisitor", "莫丹审判官", "Inquisitor Mordane");
  var RANGER  = S("aeldari_ranger", "灵族游侠", "Aeldari Ranger");
  var HOLLIS  = S("hive_foreman", "霍利斯老头", "Old Hollis");

  var N = {};

  /* ============ Chapter 1 · The Dead World ============ */
  N.nec_101 = {chapter: 1, scene: "dig_site", speaker: null,
    text: L("忒萨零号，帝国星图上标着“死寂”。没有风，没有苔藓，连细菌都没有。\n可沙丘排得整整齐齐，像有人每天来扫。\n你是考察队最年轻的档案员，带着一本素描簿和一盏灯。",
            "Thessa Null. Imperial charts call it dead. No wind, no moss, not even bacteria.\nYet the dunes lie in neat rows, as if someone sweeps them daily.\nYou are the dig's youngest archivist, with a sketchbook and a lamp."),
    codex: ["place_thessa_null", "imp_mechanicus"],
    choices: [
      C("去主帐篷向教授报到", "Report to the Professor's tent", "nec_102"),
      C("去看机仆刚挖出的东西", "See what the servitors dug up", "nec_103")
    ]};

  N.nec_102 = {chapter: 1, scene: "dig_site", speaker: MARROW, time: {h: 1},
    text: L("玛罗教授把一块黑石板推到你面前，符文泛着淡绿。\n“前帝国时代，也许比人类还早。”她眼睛发亮，“这一铲下去，我的名字会进学院大典。”\n她顿了顿：“你的名字会进脚注。”",
            "Professor Marrow slides a black slab toward you. Its glyphs glow faintly green.\n“Pre-Imperial. Maybe pre-human.” Her eyes shine. “This dig puts my name in the Scholastic Annals.”\nA pause. “Yours goes in a footnote.”"),
    choices: [
      C("申请负责翻译符文", "Volunteer to translate the glyphs", "nec_103", X({renown: 5, set: {translator: true}, taint: {tzeentch: 15}},
        "她把石板拍进你怀里。“三天。翻不出来就去筛沙子。”石板凉得像井水。",
        "She drops the slab into your arms. “Three days. Fail, and you sift sand.” It is cold as well water.")),
      C("去看看机仆挖出了什么", "Go see what the servitors found", "nec_103")
    ]};

  N.nec_103 = {chapter: 1, scene: "dig_site", speaker: VEKTRIX, time: {h: 1},
    text: L("机仆挖出一面光滑的黑墙。贤者用探针划了一道，划痕在你眼前慢慢合拢。\n“自我修复的金属！”他的发声器激动得走调，“万机之神在上，这是神圣的造物。”",
            "The servitors have bared a smooth black wall. The magos scores it with a probe; the scratch slowly closes before your eyes.\n“Self-repairing metal!” His vox-grille squeals. “Omnissiah preserve us. This is holy work.”"),
    codex: ["nec_living_metal"],
    choices: [
      C("再划一道试试", "Scratch it again", "nec_105", X({sanity: -5},
        "这次划痕合拢前，墙里传来一声轻轻的咔哒，像有人在里面翻了个身。",
        "This time, before the scratch heals, something inside clicks softly. Like someone turning over in bed.")),
      C("请他让你抄下墙上的纹路", "Ask to copy the wall's markings", "nec_105", X({renown: 3, set: {translator: true}, taint: {tzeentch: 10}},
        "贤者借你一支数据笔。纹路在灯下微微挪动，你抄得很慢，抄得很准。",
        "The magos lends you a data-quill. The patterns shift under your lamp. You copy slowly, and exactly."))
    ]};

  N.nec_105 = {chapter: 1, scene: "dig_site", speaker: KAAL, time: {h: 3},
    text: L("卡尔中士在擦枪，没抬头。“上一队？走得很急。”\n他朝沙丘努努嘴。那里摆着一排靴子，整整齐齐，鞋尖朝外。\n“靴子是谁摆的，”他说，“没人知道。”",
            "Sergeant Kaal is cleaning his rifle and doesn't look up. “The last team? Left in a hurry.”\nHe nods at a dune. A row of boots stands there, neat as a parade, toes pointing out.\n“Who lined them up,” he says, “nobody knows.”"),
    choices: [
      C("把这件事记进日志", "Write it in the log", "nec_104", X({sanity: -5, set: {kaalTrust: true}},
        "卡尔看你写完，把一盏备用灯塞给你。“晚上别离出口太远。”",
        "Kaal watches you write, then hands you a spare lamp. “Don't stray far from the exit at night.”")),
      C("笑一笑，当成玩笑", "Laugh it off", "nec_104", X({sanity: 5},
        "卡尔也笑了，笑得很短。那天夜里，靴子多了一双。",
        "Kaal laughs too, briefly. That night the row gains one more pair."))
    ]};

  N.nec_104 = {chapter: 1, scene: "tomb_exterior", speaker: null, time: {h: 10},
    text: L("夜里，沙下露出一座金字塔的塔尖，黑得吞掉了星光。\n地底传来嗡鸣，很低，像一个巨大的胸腔在呼吸。\n你的灯闪了一下，变成了绿色。",
            "At night a pyramid's tip breaks the sand, black enough to swallow starlight.\nA hum rises from below. Very low. Like breathing in an enormous chest.\nYour lamp flickers and turns green."),
    codex: ["place_thessa_tomb"],
    choices: [
      C("通宵临摹塔尖上的符文", "Sketch the spire glyphs all night", "nec_106", X({sanity: -5, renown: 5, set: {sketched: true}, taint: {tzeentch: 35}},
        "天亮时手指冻僵了。最后一行符文里，你认出了一个词：“勿扰”。",
        "By dawn your fingers are numb. In the last line you recognise one word: DO NOT DISTURB.")),
      C("回帐篷睡觉", "Go back and sleep", "nec_106", X({sanity: 5},
        "你梦见一条很长的走廊，两旁的人都站着睡觉。",
        "You dream of a long hallway where everyone sleeps standing up."))
    ]};

  N.nec_106 = {chapter: 1, scene: "dig_site", speaker: VEKTRIX, time: {d: 2},
    text: L("贤者要在塔尖的封印上钻孔。“里面是万机之神的遗产，”他说，“也许是一台神之机。”\n玛罗教授已经在调令上签了字。\n钻机开始预热，整片营地都在发抖。",
            "The magos means to drill the seal on the spire. “Inside lies the Omnissiah's legacy,” he says. “Perhaps a god-machine.”\nProfessor Marrow has already signed the order.\nThe drill warms up. The whole camp trembles."),
    codex: ["place_arcosa"],
    choices: [
      C("“这些符文是警告！”", "“These glyphs are a warning!”", "nec_107", O(Q({flag: "sketched"}), X({renown: 5, set: {warned: true}},
        "贤者把你的素描存档，标注“原始迷信，有趣”。卡尔中士却默默给枪上了膛。",
        "The magos files your sketch under “primitive superstition, interesting.” Sergeant Kaal quietly chambers a round."))),
      C("帮他们校准钻头", "Help calibrate the drill", "nec_107", X({renown: 3},
        "贤者夸你手稳。钻头咬进黑金属时，发出一声像叹气的响。",
        "The magos praises your steady hands. The bit bites black metal with a sound like a sigh.")),
      C("什么也不说", "Say nothing", "nec_107", X(null,
        "你低头记录。钻机外壳上烙着锻造世界的齿轮印——这次发掘的钱，本来就是他们出的。",
        "You keep your head down and take notes. The drill casing bears a forge world's cog-brand. This dig was their money from the start."))
    ]};

  N.nec_107 = {chapter: 1, scene: "tomb_exterior", speaker: null, time: {h: 5},
    text: L("封印破了。一股冷气涌出来，带着比帝国还老的灰。\n营地里所有金属同时嗡了一声：刀、枪、钻机、你的皮带扣。\n然后，地底有什么东西，礼貌地清了清嗓子。",
            "The seal breaks. Cold air rolls out, carrying dust older than the Imperium.\nEvery piece of metal in camp hums at once: knives, rifles, the drill, your belt buckle.\nThen, deep below, something politely clears its throat."),
    effects: {sanity: -5},
    choices: [
      C("后退", "Step back", "nec_201"),
      C("凑近去看", "Lean in for a look", "nec_201", X({sanity: -5, renown: 3, taint: {tzeentch: 40}},
        "黑暗深处亮起两点绿光，又是两点，一排又一排，一直亮到看不见的地方。",
        "Two green points light in the dark. Then two more. Row after row, as far as you can see."))
    ]};

  /* ---------- Origin prologue · Convict labourer ---------- */
  N.nec_o_convict_1 = {chapter: 1, scene: "dig_site", speaker: null,
    text: L("你脚镣上的编号是4471。卡尔卡罗斯的总督把一整船犯人卖给了考察队：挖满十年，刑期勾销。\n忒萨零号没有风。监工说这是好事，坑不会被沙子填回去。\n第一铲下去，沙子底下是金属。",
            "Your shackle number is 4471. The governor of Carcharos sold a whole hold of convicts to the dig: ten years' digging, sentence wiped.\nThessa Null has no wind. The overseer says that's good; the pits won't fill back in.\nYour first spadeful hits metal."),
    codex: ["place_thessa_null", "place_carcharos"],
    choices: [
      C("接着挖，别多问", "Keep digging, ask nothing", "nec_o_convict_2", X({hp: -5, renown: 3},
        "你挖到太阳落山，手掌磨出了血泡。监工在你的编号旁边画了个勾。",
        "You dig till sundown and your palms blister. The overseer ticks your number.")),
      C("叫看守过来看", "Call a guard over", "nec_o_convict_2")
    ]};

  N.nec_o_convict_2 = {chapter: 1, scene: "dig_site", speaker: KAAL, time: {h: 2},
    text: L("卡尔中士蹲下来，用枪托敲了敲那块黑金属。声音很闷，像敲在棺材上。\n“教授要这东西，你们挖，谁也别碰。”他看了你一眼，“碰了的，我就当没看见你。”",
            "Sergeant Kaal crouches and raps the black metal with his rifle butt. A dull sound, like knocking on a coffin.\n“The Professor wants this. You dig. Nobody touches.” He glances at you. “Anyone who does, I never saw.”"),
    codex: ["nec_living_metal"],
    choices: [
      C("把水分给咳嗽的老霍利斯", "Share your water with coughing Old Hollis", "nec_o_convict_3", X({sanity: 5, hp: -5, set: {kaalTrust: true}},
        "老头喝了一口，又塞回给你半壶。卡尔中士看见了，没出声，只是点了点头。",
        "The old man sips and presses half the flask back on you. Kaal sees it, says nothing, and nods.")),
      C("偷偷掰下一小片黑金属", "Pry off a sliver of the metal", "nec_o_convict_3", X({renown: 3, corruption: 3, set: {sliver: true}},
        "金属片在你手心里慢慢变暖，又慢慢变尖，像想长回原来的地方。",
        "The sliver warms slowly in your palm, then slowly sharpens, as if trying to grow back where it came from."))
    ]};

  N.nec_o_convict_3 = {chapter: 1, scene: "dig_site", speaker: HOLLIS, time: {d: 3},
    text: L("犯人们在赌沙丘上那排靴子。老霍利斯说靴子每晚多一双，他数过。\n“上一队的人没走，”他压低声音，“他们还在这儿，只是换了个站法。”\n大家都笑了，笑得太大声。",
            "The convicts bet on the row of boots on the dune. Old Hollis says it gains a pair every night; he's counted.\n“The last team never left,” he whispers. “They're still here. Just standing differently.”\nEveryone laughs, too loudly."),
    choices: [
      C("押它是看守的恶作剧", "Bet it's the guards' prank", "nec_o_convict_4", X({sanity: 5},
        "你押上一天的口粮。霍利斯收下了，眼神有点可怜你。",
        "You stake a day's rations. Hollis takes the bet, looking at you with something like pity.")),
      C("半夜去数靴子", "Count the boots at midnight", "nec_o_convict_4", X({sanity: -5, set: {sketched: true}},
        "四十一双。第四十二双是你自己的尺码。你把靴子边沙地上的花纹抄进了掌心。",
        "Forty-one pairs. The forty-second is your size. You copy the patterns in the sand beside it onto your palm."))
    ]};

  N.nec_o_convict_4 = {chapter: 1, scene: "tomb_exterior", speaker: null, time: {h: 10},
    text: L("犯人的围栏离塔尖最近。夜里，地底传来嗡鸣，你的脚镣跟着一起震。\n霍利斯坐起来，盯着沙地。“它们醒着，”他说，“一直醒着，只是懒得起床。”",
            "The convict pen sits closest to the spire. At night a hum rises from below and your shackle hums with it.\nHollis sits up, staring at the sand. “They're awake,” he says. “Always were. Just couldn't be bothered to get up.”"),
    codex: ["place_thessa_tomb"],
    choices: [
      C("用石头砸开脚镣的锁", "Smash the shackle lock with a rock", "nec_106", X({hp: -5, set: {unshackled: true}},
        "锁开了，你的脚踝也青了一大片。你把脚镣藏回原样，看着像还锁着。",
        "The lock gives, and so does the skin on your ankle. You arrange the shackle so it still looks locked.")),
      C("蒙头睡觉", "Pull the blanket over your head", "nec_106", X({sanity: 5},
        "你睡得很沉。梦里有人在点名，一个一个，念的都是编号。",
        "You sleep deeply. In your dream someone calls a roll, one by one, numbers only."))
    ]};

  /* ---------- Origin prologue · Indentured lexmechanic ---------- */
  N.nec_o_lexmech_1 = {chapter: 1, scene: "dig_site", speaker: VEKTRIX,
    text: L("你耳后插着一根数据线，另一头连在维克崔斯-9贤者的腰上。\n你是他的契约书记，把他的念头写成文件。三十年合同，还剩二十九年。\n“记录，”他说，“今天，我们发现一位神。”",
            "A data-cable runs from behind your ear to Magos Vektrix-9's belt.\nYou are his indentured lexmechanic, turning his thoughts into documents. A thirty-year contract; twenty-nine to go.\n“Record,” he says. “Today, we discover a god.”"),
    codex: ["place_thessa_null", "imp_mechanicus"],
    choices: [
      C("一字不差地记录", "Record it word for word", "nec_o_lexmech_2", X({renown: 3},
        "数据线微微发热。贤者满意地哼了一段二进制圣歌。",
        "The cable warms slightly. The magos hums a satisfied binary hymn.")),
      C("在页脚加一行“存疑”", "Add “unverified” in the margin", "nec_o_lexmech_2", X({sanity: 5, set: {doubter: true}},
        "贤者没发现。你觉得自己像在祭坛底下偷偷刻了个名字。",
        "The magos doesn't notice. You feel like you've carved your name under an altar."))
    ]};

  N.nec_o_lexmech_2 = {chapter: 1, scene: "dig_site", speaker: VEKTRIX, time: {h: 2},
    text: L("机仆挖出一面黑墙，划痕会自己合拢。贤者命令你把墙上的纹路导入你的植入体。\n“你的大脑是一台不错的缓存，”他说，“容量小，但便宜。”",
            "The servitors bare a black wall whose scratches heal themselves. The magos orders you to load its patterns into your implant.\n“Your brain is a fine cache,” he says. “Small, but cheap.”"),
    codex: ["nec_living_metal"],
    choices: [
      C("导入纹路", "Load the patterns", "nec_o_lexmech_3", X({sanity: -5, renown: 3, set: {translator: true}, taint: {tzeentch: 20}},
        "纹路流进你的脑子，冷得像薄荷。有几个符号，你突然懂了它们的意思。",
        "The patterns flow in, cold as mint. A few symbols suddenly make sense.")),
      C("假装导入，偷偷断开", "Fake the upload, unplug quietly", "nec_o_lexmech_3", X({renown: -2, set: {wronged_vektrix: true}},
        "你骗了贤者，悄悄拔下插头。他的镜头转了一圈，记下一个“传输异常”。",
        "You lie to the magos and quietly pull the plug. His lens rotates once and logs a “transmission fault.”"))
    ]};

  N.nec_o_lexmech_3 = {chapter: 1, scene: "dig_site", speaker: MARROW, time: {d: 2},
    text: L("玛罗教授堵住了你。“贤者的数据，先给我一份。”\n“这是机械神教的财产，”你说。\n“这是我的发现。”她把一张口粮券塞进你口袋，“你的合同里可没写不许交朋友。”",
            "Professor Marrow corners you. “A copy of the magos's data. Me first.”\n“It's Mechanicus property,” you say.\n“It's my discovery.” She slips a ration chit into your pocket. “Your contract doesn't forbid making friends.”"),
    choices: [
      C("把数据拷给她", "Copy her the data", "nec_o_lexmech_4", X({hp: 5, renown: -2, set: {marrowCopy: true, wronged_vektrix: true}},
        "你把贤者的数据拷给了教授。她拍拍你的脸，像拍一只听话的伺服颅骨。那天你多吃了一顿。",
        "You copy the magos's data to the Professor. She pats your cheek like an obedient servo-skull. You eat an extra meal that day.")),
      C("把口粮券还给她", "Hand back the chit", "nec_o_lexmech_4", X({renown: 3},
        "教授的笑僵了一下。“忠心，”她说，“多可惜。”",
        "Her smile stiffens. “Loyal,” she says. “What a waste.”"))
    ]};

  N.nec_o_lexmech_4 = {chapter: 1, scene: "tomb_exterior", speaker: null, time: {h: 10},
    text: L("夜里，塔尖露出了沙面。你的植入体收到一个信号，来自地底，很古老，很有礼貌。\n它在请求握手：\n“请出示身份。”",
            "At night the spire breaks the sand. Your implant picks up a signal from below: very old, very polite.\nIt is requesting a handshake:\n“Please identify yourself.”"),
    codex: ["place_thessa_tomb"],
    choices: [
      C("回传你的序列号", "Transmit your serial number", "nec_106", X({renown: 5, corruption: 5, set: {handshake: true}, taint: {tzeentch: 40}},
        "信号停了一秒，回了一个字：“已登记。”你耳后的接口烫了一整夜。",
        "The signal pauses, then replies with one word: REGISTERED. The socket behind your ear burns all night.")),
      C("拔掉数据线", "Pull out the cable", "nec_106", X({hp: -5, sanity: 5},
        "接口渗出一点血。信号消失了，可你总觉得它记下了你的样子。",
        "The socket bleeds a little. The signal is gone, but you feel it took note of your face."))
    ]};

  /* ============ Chapter 2 · The Waking ============ */
  N.nec_201 = {chapter: 2, scene: "dig_site", speaker: null, foe: "canoptek_scarab", time: {h: 3},
    text: L("午夜，沙子在咔哒作响。成千上万只金属甲虫从钻孔里涌出，吃掉钻机、发电机、通讯塔。\n它们不咬人，只吃金属。\n你的皮带扣开始发烫。",
            "Midnight. The sand is clicking. Thousands of metal scarabs pour from the bore-hole and eat the drill, the generators, the vox mast.\nThey don't bite people. Only metal.\nYour belt buckle starts to warm."),
    codex: ["nec_canoptek", "nec_necrons"],
    choices: [
      C("冲向着陆场", "Run for the landing pad", null, R(0.5, "hp", "nec_202", "nec_203",
        RR("你扯掉皮带，光着一只脚跑上了着陆坡。", "You rip off your belt and reach the landing ramp with one boot.",
           "甲虫潮漫过你的脚踝。你摔倒时，听见靴扣被嚼碎的声音。", "The scarab tide floods your ankles. As you fall you hear your boot buckles being chewed."))),
      C("钻进档案帐篷抢救笔记", "Dive into the archive tent for the notes", "nec_204"),
      C("去找卡尔中士", "Find Sergeant Kaal", "nec_205")
    ]};

  N.nec_202 = {chapter: 2, scene: "dig_site", speaker: MARROW, time: {h: 1},
    text: L("着陆场只剩一架穿梭机，舱门正在关闭。玛罗教授在舷窗后看着你，怀里抱着那块石板。\n她张了张嘴，可能是“对不起”，也可能是“让开”。\n穿梭机起飞了。",
            "One shuttle is left on the pad, its hatch closing. Professor Marrow watches you through the port, the slab clutched to her chest.\nHer lips move. Maybe “sorry.” Maybe “move.”\nThe shuttle lifts off."),
    effects: {sanity: -5, set: {marrowFled: true}},
    choices: [
      C("往回跑，去找其他人", "Run back for the others", "nec_205")
    ]};

  N.nec_203 = {chapter: 2, scene: "dig_site", speaker: null, foe: "canoptek_scarab", time: {h: 1},
    text: L("你在甲虫潮里爬。它们绕开你的手指，却把靴子、手表、眼镜框一一拆走。\n一只甲虫停在你鼻尖上，绿眼睛把你扫了一遍。\n它判定你没有用，走了。",
            "You crawl through the scarab tide. They step around your fingers but strip your boots, your watch, your spectacle frames.\nOne pauses on the tip of your nose, its green eye scanning you.\nIt decides you're useless, and leaves."),
    effects: {hp: -15},
    choices: [
      C("朝枪声爬过去", "Crawl toward the gunfire", "nec_205")
    ]};

  N.nec_204 = {chapter: 2, scene: "dig_site", speaker: null, foe: "canoptek_spyder", time: {h: 1},
    text: L("你抱着素描簿缩在档案箱后。一只蜘蛛形的巨大构造体探进帐篷，光束扫过你的笔记。\n它停住了，像在阅读。\n然后它把一页纸轻轻放回原处，退了出去。",
            "You hug your sketchbook behind the archive crates. A huge spider-shaped construct leans into the tent and sweeps its beam across your notes.\nIt pauses, as if reading.\nThen it gently puts a page back where it was, and withdraws."),
    effects: {renown: 5, set: {notes: true}},
    choices: [
      C("抱紧笔记，去找卡尔", "Clutch the notes and find Kaal", "nec_205")
    ]};

  N.nec_205 = {chapter: 2, scene: "dig_site", speaker: KAAL, foe: "necron_warrior", time: {h: 1}, eventRoll: 0.35,
    text: L("沙地里站起一排排金属骷髅，步伐一致，像在阅兵。\n激光打穿它们的胸口，它们倒下，又站起来，伤口像那面墙一样合拢。\n“它们不死！”卡尔吼道，“那就别让它们走过来！”",
            "Rows of metal skeletons rise from the sand in perfect step, like a parade.\nLasfire punches through their chests. They fall, then stand again, wounds closing like that wall.\n“They don't die!” Kaal roars. “Then don't let them reach us!”"),
    effects: {sanity: -5},
    codex: ["nec_warriors", "nec_reanimation"],
    choices: [
      C("捡起一支枪，站到他身边", "Grab a rifle and stand with him", "nec_206", X({hp: -15, renown: 3},
        "一道绿光擦过你的肩膀。外套袖子一层层化成了灰，下面的皮肤火辣辣地疼。",
        "A green beam grazes your shoulder. Your sleeve flakes away layer by layer into ash; the skin beneath burns.")),
      C("把受伤的奥里尔医师拖进壕沟", "Drag the wounded Medicae Oriel into a trench", "nec_207", X({hp: -5, set: {savedOriel: true}},
        "医师比看上去重。你们滚进壕沟时，头顶的空气被绿光削掉了一层。",
        "The medicae is heavier than he looks. As you tumble in, green light shaves the air overhead.")),
      C("举起双手", "Raise your hands", "nec_208", X({sanity: -5},
        "金属骷髅从你身边走过，没有开火。你说不清这算不算好事。",
        "The skeletons march past you without firing. You can't tell if that's good news."))
    ]};

  N.nec_206 = {chapter: 2, scene: "dig_site", speaker: KAAL, foe: "necron_warrior", time: {h: 1},
    text: L("你们打光了所有电池。三只骷髅按住卡尔，没杀他，把他拖走了，像拖一件行李。\n他扭头冲你喊：“学者！活下去，记下来！”\n然后一切都安静了。",
            "You run every power pack dry. Three skeletons pin Kaal. Not killed: dragged away like luggage.\nHe twists back and shouts: “Scholar! Live! Write it down!”\nThen everything goes quiet."),
    codex: ["nec_gauss"],
    choices: [
      C("放下枪", "Put the rifle down", "nec_208")
    ]};

  N.nec_207 = {chapter: 2, scene: "dig_site", speaker: ORIEL, time: {h: 1},
    text: L("奥里尔医师按着伤口，盯着壕沟外面。\n“你注意到没有？它们不追逃跑的人，只拆机器、收人，”他喃喃，“它们不是在打仗。\n是在收拾屋子。”",
            "Medicae Oriel presses his wound and stares over the trench lip.\n“Notice? They don't chase the runners. They dismantle machines and gather people,” he murmurs. “They're not fighting a war.\nThey're tidying the house.”"),
    choices: [
      C("等待", "Wait", "nec_208")
    ]};

  N.nec_208 = {chapter: 2, scene: "tomb_exterior", speaker: SEKHRAT, time: {h: 4},
    text: L("天亮时，幸存者排成一列。一个披电缆斗篷的高大金属身影沿队列检阅，身后的墓穴技师逐个测量。\n“害虫。害虫。害虫。”\n它停在你面前。",
            "At dawn the survivors are lined up. A tall metal figure in a cloak of woven cable walks the line; a cryptek behind it measures each of you.\n“Vermin. Vermin. Vermin.”\nIt stops in front of you."),
    codex: ["nec_crypteks"],
    choices: [
      C("用石板上的发音问候它", "Greet it in the slab's tongue", "nec_209", O(Q({flag: "translator"}), X({renown: 10},
        "你念完，整座金字塔安静了一秒。然后它笑了，如果那串齿轮声算笑的话。",
        "You finish. The whole pyramid falls silent for a second. Then it laughs, if that grinding of gears counts."))),
      C("举起素描簿", "Hold up your sketchbook", "nec_209", O(Q({flag: "notes"}, true), X({renown: 8},
        "技师接过本子，一页一页翻，翻得很慢，像在读一封情书。",
        "The cryptek takes the book and turns the pages slowly, like reading a love letter."))),
      C("鞠躬", "Bow", "nec_209", X({renown: 3},
        "你弯腰的角度大概不对。但它注意到了，这就够了。",
        "Your angle is probably wrong. But it noticed, and that's enough.")),
      C("一言不发，直视它", "Stare back in silence", "nec_210", X({renown: -5},
        "它的目光毫无变化。技师在你额头上点了一个绿色的记号。",
        "Its gaze doesn't change. The cryptek dabs a green mark on your forehead."))
    ]};

  N.nec_209 = {chapter: 2, scene: "tomb_exterior", speaker: SEKHRAT, time: {h: 1},
    text: L("“它把我名字里的三个音都发错了，”霸主对技师说，“但发得很自信。留着。”\n“我是塞赫拉特，阿赫梅特王朝的霸主。欢迎来我家。请原谅屋里的灰——我们小睡了一会儿。”",
            "“It mispronounced three sounds in my name,” the overlord tells the cryptek, “but with great confidence. Keep it.”\n“I am Sekhrat, Overlord of the Akhemet Dynasty. Welcome to my home. Forgive the dust. We napped a little.”"),
    effects: {set: {guest: true}},
    codex: ["nec_dynasties"],
    choices: [
      C("“小睡了多久？”", "“How long a nap?”", "nec_301"),
      C("“我的同伴们呢？”", "“Where are my companions?”", "nec_301", X({sanity: -5},
        "霸主挥了挥手。远处，幸存者被领进一扇门，门在他们身后无声地合上了。",
        "The overlord waves a hand. In the distance survivors are led through a door that closes silently behind them."))
    ]};

  N.nec_210 = {chapter: 2, scene: "tomb_interior", speaker: S("cryptek", "墓穴技师", "Cryptek"), foe: "canoptek_scarab", time: {d: 3},
    text: L("带记号的人被送进矿坑，替金字塔挖掉身上的沙。\n没有鞭子，没有监工，只有一只甲虫，每小时绕你脚边转一圈，测你还剩多少力气。\n第三天，它多停了一会儿。",
            "The marked are sent to the pits to dig sand off the pyramid.\nNo whips, no overseers. Just a scarab that circles your feet every hour, measuring how much strength you have left.\nOn the third day it lingers."),
    effects: {hp: -10},
    choices: [
      C("在沙上画出你认得的符文", "Draw the glyphs you know in the sand", "nec_209", X({renown: 8},
        "甲虫停住，把画面传了上去。一小时后，有人来接你，用的是轿子。",
        "The scarab freezes and relays the image upward. An hour later someone fetches you, in a litter.")),
      C("教大家省力的挖法", "Teach the others an easier dig", "nec_209", O(Q({flag: "origin_convict"}, true), X({renown: 8, sanity: 5},
        "矿坑的进度翻了一倍。技师来查原因，查到了你。“效率，”他说，“值得保留。”",
        "The pit's progress doubles. A cryptek investigates and finds you. “Efficiency,” it says. “Worth keeping.”"))),
      C("继续挖，保存体力", "Keep digging, save your strength", "nec_301", X({hp: -10, set: {pit: true}, taint: {nurgle: 65}},
        "你挖了很久很久。后来，一位披电缆斗篷的大人物路过矿坑，想要一个会说话的玩具。",
        "You dig for a long, long time. Then a great figure in a cable cloak passes the pits, wanting a toy that talks."))
    ]};

  /* ============ Chapter 3 · Etiquette ============ */
  N.nec_301 = {chapter: 3, scene: "tomb_interior", speaker: SEKHRAT, time: {d: 2},
    text: L("王座大厅里站满朝臣，大多数一动不动，只有眼睛亮着。\n霸主让你报出今天的日期。你说了。他沉默了很久。\n“六千万年，”他终于说，“我们睡过头了。”",
            "The throne hall is full of courtiers. Most never move; only their eyes glow.\nThe overlord asks you the date. You tell him. He is silent a long time.\n“Sixty million years,” he says at last. “We overslept.”"),
    codex: ["nec_great_sleep", "place_court_hall"],
    choices: [
      C("问他们从前是什么", "Ask what they were before", "nec_302"),
      C("夸大厅保存得真好", "Compliment how well the hall has kept", "nec_303", X({renown: 5},
        "霸主的眼光亮了一度。“终于有人注意到了。”他吩咐朝臣准备晚宴。",
        "The overlord's eyes brighten a shade. “At last, someone notices.” He orders a banquet.")),
      C("问朝臣们为什么不动", "Ask why the courtiers never move", "nec_304", X({sanity: -5},
        "霸主看了一眼他的朝臣，像看一排旧家具。",
        "The overlord glances at his courtiers the way one looks at old furniture."))
    ]};

  N.nec_302 = {chapter: 3, scene: "tomb_interior", speaker: SEKHRAT, time: {h: 2},
    text: L("“我们曾是死灵泰尔人。血肉之躯，短命，活在一颗暴躁的太阳下。\n别人活一万年，我们活不过一百年。”他用指尖敲着扶手，“你能想象那种嫉妒吗？\n哦，你能。你也只有一百年。”",
            "“We were the Necrontyr. Flesh. Short-lived, under a spiteful sun.\nOthers lived ten thousand years; we barely a hundred.” He taps the armrest. “Can you imagine that envy?\nOh. Of course you can. You've only a century too.”"),
    codex: ["nec_necrontyr"],
    choices: [
      C("“然后呢？”", "“And then?”", "nec_305")
    ]};

  N.nec_303 = {chapter: 3, scene: "tomb_interior", speaker: SEKHRAT, time: {h: 3},
    text: L("晚宴很隆重。银盘，烛台，十二道菜，全是空盘子。\n朝臣们举起空杯，动作分毫不差。霸主向你敬酒：“敬味道。我们都不记得它是什么了。”\n只有你是真饿。",
            "The banquet is magnificent. Silver, candelabra, twelve courses, every plate empty.\nThe courtiers raise empty cups in perfect unison. The overlord toasts you: “To taste. None of us remember what it was.”\nOnly you are actually hungry."),
    effects: {set: {banquet: true}},
    choices: [
      C("假装吃得很香", "Pretend to savour it", "nec_302", X({renown: 5, hp: -5, taint: {slaanesh: 35}},
        "你对着空盘子咀嚼、点头、赞叹。霸主看得入了迷。",
        "You chew at nothing, nod, sigh with pleasure. The overlord watches, enthralled.")),
      C("掏出口袋里的口粮吃", "Eat the ration bar in your pocket", "nec_302", X({hp: 10, renown: -3},
        "整个大厅的眼睛都转向你。你的咀嚼声响得像一场失礼的雷暴。",
        "Every eye in the hall turns to you. Your chewing is loud as a rude thunderstorm."))
    ]};

  N.nec_304 = {chapter: 3, scene: "tomb_interior", speaker: SEKHRAT, time: {h: 1},
    text: L("你走近一个朝臣。它的眼睛跟着你转，别的什么都没动。\n“大多数子民睡得太久，”霸主说，“醒来只剩下服从。”\n“你看，我们把灵魂当学费交了。课上完了，钱没退。”",
            "You approach a courtier. Its eyes follow you. Nothing else moves.\n“Most of my subjects slept too long,” the overlord says. “They woke with nothing but obedience.”\n“We paid our souls as tuition, you see. The lesson ended. No refund.”"),
    codex: ["place_stasis_crypts"],
    choices: [
      C("“你们从前是什么？”", "“What were you before?”", "nec_302")
    ]};

  N.nec_305 = {chapter: 3, scene: "tomb_interior", speaker: NEFER, time: {h: 4},
    text: L("墓穴技师涅弗给你上了这一课：\n“星神给了我们不朽的身体。作为交换，它们拿走我们的灵魂，当场吃掉。”\n他敲敲胸甲。“这叫生体转移。我们到现在还在对这笔账。”",
            "Nefer the cryptek gives you the lesson.\n“The star gods gave us undying bodies. In exchange they took our souls and ate them on the spot.”\nHe taps his chestplate. “Biotransference. We are still auditing that transaction.”"),
    codex: ["nec_biotransference", "nec_ctan", "nec_crypteks"],
    choices: [
      C("“你还记得活着的感觉吗？”", "“Do you remember being alive?”", "nec_306", X({sanity: -5, taint: {nurgle: 65}},
        "技师沉默了很久。他头上的指示灯闪了几下，像在找一份不存在的文件。",
        "The cryptek is silent a long time. Lights flicker on his head, like searching for a file that isn't there.")),
      C("“星神后来怎么了？”", "“What became of the star gods?”", "nec_307")
    ]};

  N.nec_306 = {chapter: 3, scene: "tomb_interior", speaker: NEFER, time: {h: 1},
    text: L("“我记得，我曾经记得盐的味道，”他说，“现在只记得那段记忆的编号。”\n他把一粒盐放在你掌心。“替我尝一下。描述得详细点。”\n你描述了。他把每个字都存了档。",
            "“I remember that I once remembered the taste of salt,” he says. “Now I only remember the memory's index number.”\nHe sets a grain of salt in your palm. “Taste it for me. In detail.”\nYou do. He archives every word."),
    effects: {renown: 5, set: {salt: true}},
    choices: [
      C("把手擦干净", "Wipe your hand", "nec_308")
    ]};

  N.nec_307 = {chapter: 3, scene: "tomb_interior", speaker: NEFER, time: {h: 1},
    text: L("“星神吃星星，也吃我们。我们替它们打了天堂之战，对手是古圣和古圣的孩子们。\n赢了之后，我们把神砸成碎片，关进笼子。”\n他压低声音：“这座墓里，就关着一片。”",
            "“The star gods ate stars, and us. For them we fought the War in Heaven, against the Old Ones and their children.\nAfter we won, we shattered our gods and caged the shards.”\nHe lowers his voice. “There is one in this tomb.”"),
    effects: {set: {heardWar: true}},
    codex: ["nec_war_in_heaven"],
    choices: [
      C("背后一凉", "Feel a chill down your spine", "nec_308", X({sanity: -5},
        "地板深处传来一阵震动，很轻，像什么东西在梦里翻了个身。",
        "A faint tremor rises from deep beneath the floor, like something turning over in its sleep.")),
      C("“带我去看看。”", "“Show me.”", "nec_308", X({corruption: 5, set: {askedShard: true}, taint: {tzeentch: 40}},
        "技师盯着你看了很久。“不。但你的好奇心，我会记一笔。”",
        "The cryptek studies you a long time. “No. But I will note your curiosity.”"))
    ]};

  N.nec_308 = {chapter: 3, scene: "tomb_interior", speaker: null, foe: "flayed_one", time: {h: 6}, eventRoll: 0.42,
    text: L("夜里你迷了路。走廊尽头蹲着一个死灵，身上挂着破布一样的东西，你不愿细看那是什么。\n它用爪子刮着墙，一遍又一遍。\n“好冷，”它说，“你看起来很暖和。”",
            "At night you get lost. At a corridor's end crouches a necron draped in rags of something you'd rather not examine.\nIt scrapes the wall with its claws, over and over.\n“So cold,” it says. “You look warm.”"),
    codex: ["nec_flayer_curse"],
    choices: [
      C("转身就跑", "Turn and run", null, R(0.55, "hp", "nec_311", "nec_309",
        RR("你一路跑回大厅，身后的刮擦声越来越远。", "You run all the way back to the hall; the scraping fades behind you.",
           "爪子钩住了你的外套。你挣脱了，外套没有。", "Claws hook your coat. You tear free. The coat doesn't."))),
      C("像对贵族那样向它行礼", "Bow to it as you would to a lord", "nec_310", X({sanity: -10, renown: 3},
        "你行礼的时候，刮墙声停了。整条走廊安静得像一座墓。它本来就是。",
        "As you bow, the scraping stops. The corridor goes silent as a tomb. Which it is.")),
      C("大声呼叫守卫", "Shout for the guards", "nec_311", X({renown: -3},
        "守卫来得很快。那东西退进阴影里，像被人撞见的乞丐。",
        "The guards come quickly. The thing retreats into shadow like a beggar caught in the act."))
    ]};

  N.nec_309 = {chapter: 3, scene: "tomb_interior", speaker: null, foe: "flayed_one", time: {h: 1},
    text: L("它的爪子比你快。\n守卫赶到时，它已经缩回阴影，把你外套的碎片贴在脸上蹭着，像在取暖。\n你背上的伤口很冷，冷得不像伤口。",
            "Its claws are faster than you.\nBy the time the guards arrive it has slunk back into shadow, rubbing a scrap of your coat against its face like a hand-warmer.\nThe wounds on your back are cold. Too cold for wounds."),
    effects: {hp: -20, sanity: -5},
    choices: [
      C("让守卫带你回去", "Let the guards take you back", "nec_311", X(null, "路上，两个技师在低声交谈：另一座墓也醒了，正在收割一颗人类叫“瓦尔达”的麦子星。", "On the way, two crypteks talk quietly: another tomb has woken too, and is harvesting a wheat world the humans call Valda."))
    ]};

  N.nec_310 = {chapter: 3, scene: "tomb_interior", speaker: MERUK, time: {h: 1},
    text: L("它愣住了，爪子停在半空。\n“梅鲁克，”它慢慢地说，“我曾是梅鲁克勋爵。我有一座花园。”\n然后它看着你的脸，眼神又空了。“你很暖和。”你后退，它没跟上来。",
            "It freezes, claws mid-air.\n“Meruk,” it says slowly. “I was Lord Meruk. I had a garden.”\nThen it looks at your face and its eyes empty again. “You are warm.” You back away. It doesn't follow."),
    effects: {set: {meruk: true}},
    choices: [
      C("回到大厅", "Return to the hall", "nec_311", X(null, "路上，两个技师在低声交谈：另一座墓也醒了，正在收割一颗人类叫“瓦尔达”的麦子星。", "On the way, two crypteks talk quietly: another tomb has woken too, and is harvesting a wheat world the humans call Valda."))
    ]};

  N.nec_311 = {chapter: 3, scene: "tomb_interior", speaker: KING, time: {d: 3},
    text: L("第三天，墓里所有的灯同时暗下来。一道古老的指令响彻每条走廊，朝臣齐刷刷跪下。\n“寂静之王回来了，”霸主跪得最慢，“他召集所有王朝。”\n他小声补充：“他走的时候可没跟我们商量。”",
            "On the third day every light in the tomb dims. An ancient command echoes down every corridor and the courtiers kneel as one.\n“The Silent King has returned,” says the overlord, kneeling slowest. “He summons every dynasty.”\nQuietly: “He didn't consult us when he left.”"),
    effects: {sanity: -5},
    codex: ["nec_silent_king"],
    choices: [
      C("跟着跪下", "Kneel with them", "nec_312", X({renown: 3},
        "你膝盖着地的声音，是整座大厅里唯一一声肉响。",
        "Your knees hit the floor: the only fleshy sound in the hall.")),
      C("问国王当初为什么离开", "Ask why the king left", "nec_312", X({renown: 2},
        "霸主想了想。“他做了一个决定，让我们变成这样。然后他羞愧地走了。”",
        "The overlord considers. “He made a choice that made us this. Then he left, ashamed.”"))
    ]};

  N.nec_312 = {chapter: 3, scene: "tomb_exterior", speaker: STORM, time: {d: 1},
    text: L("第二天，金字塔上空劈下一场绿色雷暴，雷光里浮出一道诏令：萨特克王朝之主、风暴领主伊莫特克，要求阿赫梅特臣服。\n“暴发户，”塞赫拉特冷冷地说，“他家的墓还没我家门廊老。”",
            "Next day a green storm breaks over the pyramid. In the lightning hangs a decree: Imotekh the Stormlord, master of the Sautekh Dynasty, demands Akhemet's fealty.\n“An upstart,” Sekhrat says coldly. “His tomb is younger than my porch.”"),
    codex: ["nec_imotekh"],
    choices: [
      C("建议他礼貌地拖延", "Suggest courteous delay", "nec_401", X({renown: 5, set: {advisedDelay: true}},
        "霸主赞许地点头，口述了一封四十页的回信，全是问候语。",
        "The overlord nods approvingly and dictates a forty-page reply, entirely greetings.")),
      C("建议他臣服", "Suggest he submits", "nec_401", X({renown: -3, sanity: 5},
        "霸主沉默片刻。“明智，也庸俗。”他还是派出了使者，带着一份不情不愿的礼物。",
        "A pause. “Wise. And vulgar.” He sends an envoy anyway, with a grudging gift.")),
      C("建议他开战", "Suggest war", "nec_401", X({renown: 3, hp: -10, taint: {khorne: 40}},
        "霸主大笑。当晚雷暴劈中金字塔一角，你被震下了台阶。",
        "The overlord laughs. That night lightning strikes a corner of the pyramid and throws you down the steps."))
    ]};

  /* ============ Chapter 4 · The Specimen ============ */
  N.nec_401 = {chapter: 4, scene: "tomb_interior", speaker: IMHET, time: {d: 40},
    text: L("一扇本不存在的门开了。进来的技师挂满标签似的绶带，捧着一个停滞立方，里面冻着一个大笑的兽人。\n“编目者伊姆赫特，代表收藏家。”他献上礼物，转向你，“另外，我们要那个带本子的人类。”",
            "A door that wasn't there opens. In walks a cryptek hung with sashes like labels, carrying a stasis cube with a laughing ork frozen inside.\n“Imhet the Cataloguer, for the Collector.” He presents the gift, then turns to you. “Also, we'd like the human with the notebook.”"),
    codex: ["nec_stasis"],
    choices: [
      C("“收藏家是谁？”", "“Who is the Collector?”", "nec_402"),
      C("躲到霸主身后", "Hide behind the overlord", "nec_403", X({renown: -2},
        "霸主没赶你走，只是往旁边挪了挪，好让客人看清楚你。",
        "The overlord doesn't shoo you away. He just shifts aside so the guest can see you better."))
    ]};

  N.nec_402 = {chapter: 4, scene: "tomb_interior", speaker: COLLECTOR, time: {h: 1},
    text: L("立方打开，投出一座画廊：无数凝固的瞬间，排到天边。\n一个愉快的声音说：“我收藏瞬间。你就是一个：原始人在读我祖先的涂鸦。多珍贵。”\n这是无尽者特拉赞。他没露面，他从不需要露面。",
            "The cube opens and projects a gallery: countless frozen moments stretching to the horizon.\nA cheerful voice: “I collect moments. You are one: a primitive reading my ancestors' graffiti. How precious.”\nTrazyn the Infinite. He doesn't appear. He never needs to."),
    codex: ["nec_trazyn"],
    choices: [
      C("“我不是摆件。”", "“I'm not an ornament.”", "nec_403", X({renown: 3},
        "声音笑了。“每件藏品都这么说。这正是它们可爱的地方。”",
        "The voice laughs. “Every piece says that. It's what makes them charming.”")),
      C("“画廊里有多少人？”", "“How many people are in it?”", "nec_403", X({sanity: -5},
        "“人？”声音想了想，“按件数算，还是按物种？”",
        "“People?” The voice considers. “By item, or by species?”"))
    ]};

  N.nec_403 = {chapter: 4, scene: "tomb_interior", speaker: SEKHRAT, time: {h: 1},
    text: L("两位贵族像马贩子一样讨价还价。\n“三只甲虫，一顶钛族大使的帽子。”\n“它会说我们的语言。”\n“四只甲虫，帽子，再加一个停滞立方，里面是一句没说完的道歉。”\n“成交。”",
            "The two nobles haggle like horse-traders.\n“Three scarabs and a T'au ambassador's hat.”\n“It speaks our tongue.”\n“Four scarabs, the hat, and a stasis cube holding an unfinished apology.”\n“Done.”"),
    effects: {renown: 3},
    choices: [
      C("“你们把我卖了？”", "“You sold me?”", "nec_404")
    ]};

  N.nec_404 = {chapter: 4, scene: "tomb_interior", speaker: SEKHRAT, time: {h: 2},
    text: L("“别当成出卖，”塞赫拉特说，“这是回礼。礼数要求我回赠，而你是我最好的东西。”\n他似乎真心觉得这是赞美。\n伊姆赫特已经掏出了卷尺。",
            "“Don't think of it as a sale,” says Sekhrat. “It's a return gift. Etiquette demands one, and you are the finest thing I own.”\nHe seems to mean it as a compliment.\nImhet has already produced a measuring tape."),
    choices: [
      C("优雅地接受", "Accept gracefully", "nec_405", X({renown: 5},
        "你行了一个霸主教过的礼。两位贵族同时发出满意的嗡鸣。",
        "You give the bow the overlord taught you. Both nobles hum with satisfaction.")),
      C("“带我走，但放了我的同伴。”", "“Take me, but free my companions.”", "nec_406", O(Q({stat: "renown", min: 30}), X({renown: -5, set: {freedColleagues: true}},
        "霸主想了想，挥挥手。“好。害虫多的是。”",
        "The overlord considers, then waves a hand. “Fine. Vermin are plentiful.”"))),
      C("趁交接时逃进墓道", "Bolt into the tomb corridors", null, O({effects: {set: {wronged_sekhrat: true}}}, R(0.4, "hp", "nec_407", "nec_408",
        RR("你钻进维修通道。霸主刚送出的回礼，当着使者的面跑了。门在身后合上。", "You squeeze into a duct. The overlord's return gift bolts in front of his guest. The door seals behind you.",
           "你才跑出十步，地板就伸出了手。塞赫拉特叹气，像看一件摔坏的礼物。", "Ten steps, and the floor grows hands. Sekhrat sighs, as at a gift dropped in transit."))))
    ]};

  N.nec_405 = {chapter: 4, scene: "tomb_interior", speaker: IMHET, time: {h: 1},
    text: L("伊姆赫特绕着你量了三圈，在一块金属签上刻字：\n“第七十七号藏品：原始学者，发现中。姿势：惊讶。”\n“请保持这个表情，”他说，“对，就这样。很好。”",
            "Imhet circles you three times and engraves a metal tag:\n“Item 77: Primitive Scholar, Mid-Discovery. Pose: astonished.”\n“Hold that expression,” he says. “Yes. Just so. Lovely.”"),
    choices: [
      C("保持表情", "Hold the expression", "nec_409")
    ]};

  N.nec_406 = {chapter: 4, scene: "dig_site", speaker: ORIEL, time: {h: 6},
    text: L("幸存者登上一艘被死灵拆剩一半的穿梭机。奥里尔医师最后一个上去，回头看你。\n“我会告诉他们的，”他说，“告诉所有人。”\n你突然有点担心，他真的会。",
            "Survivors board a shuttle the necrons only half ate. Medicae Oriel goes last and looks back.\n“I'll tell them,” he says. “I'll tell everyone.”\nSuddenly you worry that he really will."),
    choices: [
      C("挥手告别", "Wave goodbye", "nec_409")
    ]};

  N.nec_407 = {chapter: 4, scene: "tomb_interior", speaker: SHARD, time: {h: 3},
    text: L("通道尽头悬着一座笼子，由不断折叠的光编成。笼子里有一片暗金色的碎星，在缓慢地呼吸。\n它注意到了你。\n“小东西，”声音直接响在你骨头里，“你身上有恐惧的味道。我很想念它。”",
            "The duct ends at a floating cage woven from endlessly folding light. Inside, a shard of dark-gold star breathes slowly.\nIt notices you.\n“Little thing,” says a voice straight into your bones. “You smell of fear. I have missed it.”"),
    effects: {sanity: -10, corruption: 5, set: {sawShard: true}, taint: {tzeentch: 35}},
    codex: ["nec_tesseract", "place_tesseract_vault"],
    choices: [
      C("后退，直到撞上什么", "Back away until you hit something", "nec_409", X({hp: -5},
        "你撞上的是一只蜘蛛构造体。它很温柔地把你夹起来，送了回去。",
        "What you hit is a spyder construct. It picks you up very gently and carries you back.")),
      C("问它的名字", "Ask its name", "nec_409", X({corruption: 10, set: {shardName: true}, taint: {tzeentch: 70}},
        "它告诉了你。那个名字没有音节，只有一种感觉：所有活物死前的最后一秒。",
        "It tells you. The name has no syllables, only a feeling: the last second of every living thing."))
    ]};

  N.nec_408 = {chapter: 4, scene: "tomb_interior", speaker: null, foe: "canoptek_spyder", time: {h: 1},
    text: L("地板裂开，伸出几条金属腿，把你整个掀翻。\n一只蜘蛛构造体按住你，用扫描光仔细检查你有没有摔坏，像在验收一件快递。\n伊姆赫特走过来，在签上添了一行：“轻微磕碰。”",
            "The floor splits and metal legs flip you over.\nA spyder construct pins you and scans you carefully for damage, like a courier checking a parcel.\nImhet strolls over and adds a line to the tag: “Minor scuffing.”"),
    effects: {hp: -20},
    codex: ["nec_canoptek"],
    choices: [
      C("认命", "Give up", "nec_409")
    ]};

  N.nec_409 = {chapter: 4, scene: "stasis_gallery", speaker: IMHET, time: {d: 6},
    text: L("收藏家的画廊。你被摆进一个展位，背景是复原的发掘现场，连沙丘都排得整整齐齐。\n伊姆赫特调整你手里素描簿的角度。\n“停滞场不疼，”他说，“你什么都感觉不到。这才是重点。”",
            "The Collector's gallery. You are posed in a display against a rebuilt dig site, the dunes in neat rows.\nImhet adjusts the angle of the sketchbook in your hands.\n“Stasis doesn't hurt,” he says. “You'll feel nothing. That's rather the point.”"),
    codex: ["place_gallery", "nec_trazyn"],
    choices: [
      C("摆出最好的姿势", "Strike your best pose", "nec_501", X({renown: 5, taint: {all: -10}},
        "你挺直腰，睁大眼睛。光凝固了。最后一个念头是：我的头发乱不乱？",
        "You straighten, eyes wide. The light congeals. Your last thought: is my hair a mess?")),
      C("在心里默念自己的名字", "Silently repeat your own name", "nec_501", X({sanity: 10, taint: {all: -10}},
        "念到第三遍，光凝固了。名字停在舌尖上。",
        "On the third repetition the light congeals. Your name stays on the tip of your tongue.")),
      C("尖叫", "Scream", "nec_501", X({sanity: -5, renown: -3, taint: {all: -10}},
        "你的尖叫冻在半空，后来成了这个展位最受赞赏的细节。",
        "Your scream freezes mid-air. It later becomes the display's most admired detail."))
    ]};

  /* ============ Chapter 5 · The Gallery ============ */
  N.nec_501 = {chapter: 5, scene: "stasis_gallery", speaker: IMHET, time: {y: 380},
    text: L("你眨了眨眼。\n“三百八十年，”伊姆赫特说，“你保持得非常好，只是头发乱了点。”\n展位外，一排排凝固的瞬间延伸到天边：战争，婚礼，一场永远落不下来的雨。",
            "You blink.\n“Three hundred and eighty years,” says Imhet. “You held the pose admirably. The hair is a little untidy.”\nBeyond your display, rows of frozen moments stretch to the horizon: wars, weddings, a rain that never lands."),
    effects: {sanity: -5},
    codex: ["nec_stasis"],
    choices: [
      C("“为什么解冻我？”", "“Why thaw me?”", "nec_502"),
      C("先四处看看", "Look around first", "nec_503")
    ]};

  N.nec_502 = {chapter: 5, scene: "stasis_gallery", speaker: COLLECTOR, time: {h: 1},
    text: L("画廊的光暗了一度，那个愉快的声音来了。\n“我需要一位讲解员。会说话的展品，太罕见了。”\n“别想着逃。毁了我这具身体，我只会在另一具里醒来。我是无尽的，亲爱的。”",
            "The gallery dims a shade and the cheerful voice arrives.\n“I need a docent. A talking exhibit. So rare.”\n“Don't think of running. Destroy this body and I simply wake in another. I am infinite, my dear.”"),
    codex: ["nec_trazyn"],
    choices: [
      C("“讲解什么？”", "“Guide what?”", "nec_504")
    ]};

  N.nec_503 = {chapter: 5, scene: "stasis_gallery", speaker: null, foe: "aeldari_seer", time: {h: 1},
    text: L("最近的展位里，一位尖耳的异形先知举着符文石，对面是一个举起武器的死灵，两者之间的光被冻成了玻璃。\n铭牌写着：“古老的宿敌，第三次被打断的预言。”",
            "In the nearest display a pointed-eared alien seer raises rune-stones against a necron with weapon lifted; the light between them is frozen into glass.\nThe plaque reads: “Old Enemies. Third Interrupted Prophecy.”"),
    codex: ["nec_old_enemies", "eld_aeldari"],
    choices: [
      C("伸手碰一碰停滞场", "Touch the stasis field", "nec_504", X({hp: -10, sanity: -5},
        "指尖冻住了一秒。那一秒里，你听见先知在尖叫一个名字。是你的。",
        "Your fingertip freezes for one second. In that second you hear the seer scream a name. Yours.")),
      C("抄下铭牌", "Copy down the plaque", "nec_504", X({renown: 3},
        "你翻开素描簿，上一页的墨水还是湿的。三百八十年，墨水没干。",
        "You open your sketchbook. The ink on the last page is still wet. Three hundred and eighty years, and it hasn't dried."))
    ]};

  N.nec_504 = {chapter: 5, scene: "stasis_gallery", speaker: IMHET, foe: "aeldari_seer", time: {h: 2}, eventRoll: 0.35,
    text: L("第一位访客是一位远道而来的死灵贵族。伊姆赫特把你推到先知的展位前：“讲。”\n贵族的目光像一盏冷灯。\n你清了清嗓子。你已经三百八十年没说过话了。",
            "The first visitor is a necron noble from afar. Imhet pushes you before the seer's display. “Speak.”\nThe noble's gaze is a cold lamp.\nYou clear your throat. You haven't spoken in three hundred and eighty years."),
    choices: [
      C("讲天堂之战：灵族与死灵的旧仇", "Tell of the War in Heaven, the old feud", "nec_505", O(Q({flag: "heardWar"}), X({renown: 10},
        "贵族听得一动不动。讲完后，他把一枚古钱币放进你手里，当作小费。",
        "The noble listens without moving. At the end he presses an ancient coin into your hand as a tip."))),
      C("讲成一出悲剧", "Tell it as a tragedy", "nec_505", X({renown: 5},
        "讲到预言被打断时，贵族点点头。“对。我们总是打断他们。”",
        "When you reach the interrupted prophecy, the noble nods. “Yes. We always interrupt them.”")),
      C("讲成一个笑话", "Tell it as a joke", null, R(0.5, "renown", "nec_505", "nec_506",
        RR("贵族发出一阵齿轮般的笑声。伊姆赫特记下：讲解员会幽默。", "The noble emits a gear-grinding laugh. Imhet notes: docent has humour.",
           "没人笑。伊姆赫特记下：讲解员需要调整。", "Nobody laughs. Imhet notes: docent requires adjustment.")))
    ]};

  N.nec_506 = {chapter: 5, scene: "stasis_gallery", speaker: IMHET, time: {h: 1},
    text: L("伊姆赫特领你走过一排空展位。每个都有铭牌：“讲解员，第一任”“讲解员，第二任”……一直到第四十任。\n“他们都不太好笑，”他说，“你是第四十一任。加油。”",
            "Imhet leads you past a row of empty displays. Each has a plaque: “Docent, First.” “Docent, Second.” All the way to the fortieth.\n“None of them were very funny,” he says. “You're the forty-first. Do try.”"),
    effects: {sanity: -5},
    choices: [
      C("“我会更努力的。”", "“I'll try harder.”", "nec_505", X({renown: 3},
        "伊姆赫特满意地点头，在第四十一号展位的铭牌上，暂时没有刻字。",
        "Imhet nods, satisfied. The plaque on display forty-one stays blank, for now.")),
      C("盯着第四十一个展位", "Stare at the forty-first display", "nec_505", X({sanity: -5, taint: {nurgle: 65}},
        "第四十一个展位的铭牌已经刻好了。是你的名字，拼写完全正确。",
        "The plaque on the forty-first display is already engraved. Your name, spelled perfectly."))
    ]};

  N.nec_505 = {chapter: 5, scene: "stasis_gallery", speaker: IMHET, foe: "hive_tyrant", time: {d: 3},
    text: L("画廊最深处，一头巨大的虫族怪物被冻在扑击的半空，爪子离铭牌只有一指。\n铭牌写着：“寂静之王回来的理由。”\n“连我们都不愿与之分享银河的东西不多，”伊姆赫特说，“这是其中之一。”",
            "Deep in the gallery a colossal Tyranid is frozen mid-leap, its claw a finger's width from the plaque.\nThe plaque reads: “Why the Silent King Came Back.”\n“There are few things even we refuse to share the galaxy with,” says Imhet. “This is one.”"),
    codex: ["xenos_tyranid", "nec_silent_king"],
    choices: [
      C("“他看见了什么？”", "“What did he see?”", "nec_507"),
      C("“它还活着吗？”", "“Is it still alive?”", "nec_507", X({sanity: -5},
        "伊姆赫特没回答。你凑近时，那东西的一只眼睛在停滞场里慢慢转向了你。",
        "Imhet doesn't answer. As you lean in, one of its eyes, inside the stasis, slowly turns toward you."))
    ]};

  N.nec_507 = {chapter: 5, scene: "stasis_gallery", speaker: KING, time: {h: 1},
    text: L("伊姆赫特播放一段记录：银河之外的黑暗里，一张空荡荡的王座。\n“寂静之王萨雷克。是他和星神立约，也是他带我们背叛星神。然后他自我放逐。\n直到他在银河边缘，看见饥饿本身朝这里游来。”",
            "Imhet plays a recording: an empty throne in the darkness beyond the galaxy.\n“Szarekh, the Silent King. He made the pact with the star gods, and he led us to betray them. Then he exiled himself.\nUntil, at the galaxy's edge, he saw hunger itself swimming this way.”"),
    codex: ["nec_silent_king", "xenos_hive_mind"],
    choices: [
      C("继续往前走", "Walk on", "nec_508")
    ]};

  N.nec_508 = {chapter: 5, scene: "stasis_gallery", speaker: KAAL, time: {h: 1},
    text: L("一个展位里，一名星界军中士单膝跪地，嘴唇停在祷词中间。\n是卡尔中士。铭牌：“帝国士兵，祈祷中。附注：未获回应。”\n他的手指离扳机只差一毫米，三百八十年都没扣下去。",
            "In one display an Imperial Guard sergeant kneels, lips caught mid-prayer.\nIt's Sergeant Kaal. Plaque: “Imperial Soldier, Praying. Note: no answer received.”\nHis finger is a millimetre from the trigger. Three hundred and eighty years, and he hasn't pulled it."),
    codex: ["imp_imperium", "imp_guard"],
    choices: [
      C("向他保证你会回来", "Promise him you'll come back", "nec_509", X({sanity: 5, set: {promiseKaal: true}},
        "你把手贴在停滞场上，冷得像墓碑。你说了三遍，好让自己记住。",
        "You press your palm to the field, cold as a headstone. You say it three times so you'll remember.")),
      C("别过脸去", "Look away", "nec_509", X({sanity: -5, taint: {nurgle: 65}},
        "你走开了。身后，那一毫米一直跟着你。",
        "You walk on. Behind you, that millimetre follows."))
    ]};

  N.nec_509 = {chapter: 5, scene: "stasis_gallery", speaker: IMHET, time: {d: 2},
    text: L("参观结束。伊姆赫特宣布审核结果：“第四十一任讲解员：尚可。”\n“收藏家给你三个选项。”他竖起三根手指，“一，留任。二，回展位。三，另有用处。”\n“第三个，”他补充，“是新开的。”",
            "The tour is over. Imhet announces his review: “Docent Forty-One: acceptable.”\n“The Collector offers three options.” He raises three fingers. “One, stay on. Two, back to your display. Three, another use.”\n“The third,” he adds, “is new.”"),
    choices: [
      C("留任讲解员", "Stay on as docent", "nec_510", O(Q({stat: "renown", min: 40}), X({renown: 5, set: {docent: true}},
        "伊姆赫特递给你一根指示棒。棒头是一只被冻住的萤火虫。",
        "Imhet hands you a pointer. Its tip is a frozen firefly."))),
      C("“什么用处？”", "“What use?”", "nec_511"),
      C("回展位去——那里安全", "Back to the display. It's safe there.", "nec_end_exhibit", O(Q({stat: "sanity", max: 35}, true), X({sanity: 10},
        "你回到原位，摆好姿势。这一次，你没有等他说“很好”。",
        "You step back into place and strike the pose. This time you don't wait for him to say “lovely.”"))),
      C("偷走他腰间的停滞钥匙", "Steal the stasis key from his belt", null, R(0.4, null, "nec_512", "nec_513",
        RR("你的手指比你想的灵巧。钥匙滑进了袖子。", "Your fingers are nimbler than you thought. The key slides up your sleeve.",
           "你的手刚碰到钥匙，就被另一只手按住了。", "Your hand touches the key, and another hand closes over it.")))
    ]};

  N.nec_510 = {chapter: 5, scene: "stasis_gallery", speaker: COLLECTOR, time: {y: 9},
    text: L("你当了九年讲解员，学会了用死灵的方式微笑：不用脸，用语气。\n有一天，收藏家亲自来了，声音比平时急：\n“忒萨零号，你的老家。人类回去了，他们在撬我的星神。”",
            "You serve nine years as docent and learn to smile the necron way: not with your face, but with your tone.\nThen one day the Collector comes himself, voice quicker than usual.\n“Thessa Null. Your old home. The humans went back. They're prising at my star god.”"),
    effects: {renown: 5},
    choices: [
      C("“我能帮忙。”", "“I can help.”", "nec_601", X({renown: 3},
        "声音轻快起来。“太好了。我就喜欢主动的展品。”",
        "The voice brightens. “Splendid. I do love a proactive exhibit.”"))
    ]};

  N.nec_511 = {chapter: 5, scene: "stasis_gallery", speaker: COLLECTOR, time: {h: 1},
    text: L("“你的老家忒萨零号，”收藏家说，“人类回去了，正在撬那座星神的笼子。他们以为里面是一台神圣的机器。\n我需要一个既懂他们、又懂那座墓的人。\n当然，你可以拒绝。展位一直给你留着。”",
            "“Your old home, Thessa Null,” says the Collector. “The humans returned and are prising at the star god's cage. They think a holy machine waits inside.\nI need someone who knows them and that tomb.\nYou may refuse, of course. Your display is always kept for you.”"),
    choices: [
      C("“我去。”", "“I'll go.”", "nec_601", X({renown: 3},
        "伊姆赫特把你的铭牌摘下来，擦了擦，收进了口袋。“备用。”",
        "Imhet unscrews your plaque, polishes it, and pockets it. “Spare.”"))
    ]};

  N.nec_512 = {chapter: 5, scene: "stasis_gallery", speaker: null, time: {h: 2},
    text: L("钥匙到手了，一小块温热的金属，像一颗心。\n你没跑多远。画廊没有出口，只有更多的画廊。\n但伊姆赫特一直没发现。你把钥匙藏进了素描簿的书脊。",
            "You have the key: a small warm piece of metal, like a heart.\nYou don't get far. The gallery has no exits, only more gallery.\nBut Imhet never notices. You hide it in the spine of your sketchbook."),
    effects: {set: {stasisKey: true}},
    choices: [
      C("回去听第三个选项", "Go back for the third option", "nec_511")
    ]};

  N.nec_513 = {chapter: 5, scene: "stasis_gallery", speaker: IMHET, time: {h: 1},
    text: L("伊姆赫特的手指像钳子一样扣住你的手腕。\n“偷窃，”他说，“非常人类。我会把它写进你的展位说明。”\n他没有生气。这比生气更可怕。",
            "Imhet's fingers close on your wrist like pliers.\n“Theft,” he says. “Very human. I'll add it to your display notes.”\nHe isn't angry. That's worse."),
    effects: {hp: -10, renown: -5},
    choices: [
      C("听他讲第三个选项", "Hear the third option", "nec_511"),
      C("“让我回展位吧。”", "“Let me go back to my display.”", "nec_end_exhibit", O(Q({stat: "sanity", max: 50}, true), X({sanity: 5},
        "伊姆赫特扶你站回原位，替你理了理头发。这次他说了“很好”。",
        "Imhet guides you back into place and tidies your hair. This time he does say “lovely.”")))
    ]};

  /* ============ Chapter 6 · Old Enemies ============ */
  N.nec_601 = {chapter: 6, scene: "stasis_gallery", speaker: RANGER, foe: "aeldari_ranger", time: {d: 5},
    text: L("出发前夜，画廊警报大作。几个披斗篷的灵族游侠从一道光缝里钻出来，直奔先知的展位。\n领头的看见你，愣了一下。\n“猿人？”她低声说，“在死人的博物馆里？”",
            "The night before departure the gallery alarms blare. Cloaked Aeldari rangers slip through a seam of light, straight for the seer's display.\nTheir leader sees you and stops.\n“Mon-keigh?” she whispers. “In the museum of the dead?”"),
    codex: ["eld_aeldari", "eld_rangers", "eld_monkeigh"],
    choices: [
      C("帮她们解开先知的停滞场", "Help them free the seer", "nec_602", X({renown: -5, set: {aeldariFriend: true}},
        "你认得那种符文锁，几百年前你在墙上抄过。锁开了，先知倒进她们怀里。",
        "You know that rune-lock; you copied one off a wall centuries ago. It opens, and the seer falls into their arms.")),
      C("拉响警报", "Raise the alarm", "nec_603", X({renown: 10, sanity: -5},
        "警报声变了调。下一秒，游侠们停在半空，像被按了暂停。",
        "The alarm changes pitch. Next instant the rangers hang in mid-air, as if paused.")),
      C("躲到展台后面", "Hide behind a plinth", "nec_604")
    ]};

  N.nec_602 = {chapter: 6, scene: "stasis_gallery", speaker: RANGER, time: {h: 1},
    text: L("游侠抱着先知，看你的眼神很复杂。\n“六千万年前，我们的先祖和这些死人打过天堂之战。他们睡觉躲过了惩罚，醒来还记得每一笔账。”\n“跟我们走吗？网道里有路。”",
            "The ranger holds the seer and gives you a complicated look.\n“Sixty million years ago our forebears fought these dead things in the War in Heaven. They slept through their punishment and woke remembering every debt.”\n“Come with us? There are paths in the webway.”"),
    codex: ["nec_war_in_heaven"],
    choices: [
      C("“我还有一个承诺要兑现。”", "“I have a promise to keep.”", "nec_607", X({sanity: 5},
        "她点点头，像在看一个注定的结局。“那就别让它们把你也摆上架子。”",
        "She nods as if watching a foretold ending. “Then don't let them shelve you again.”")),
      C("“我不信任异形。”", "“I don't trust xenos.”", "nec_607", X({renown: 3},
        "她耸耸肩。“聪明的猿人。罕见。”光缝合上了，带走了她们和先知。",
        "She shrugs. “A clever mon-keigh. Rare.” The seam closes, taking them and the seer."))
    ]};

  N.nec_603 = {chapter: 6, scene: "stasis_gallery", speaker: IMHET, foe: "aeldari_ranger", time: {h: 1},
    text: L("伊姆赫特踱过来，绕着凝固的游侠转了一圈，满意得直哼哼。\n“送货上门的新展品。灵族，入侵中。姿势：愤怒。”\n他拍拍你的肩：“讲解员，加薪。”死灵不发薪水。",
            "Imhet strolls over and circles the frozen rangers, humming with delight.\n“New exhibits, home-delivered. Aeldari, Mid-Intrusion. Pose: furious.”\nHe pats your shoulder. “Docent, have a raise.” Necrons don't pay wages."),
    choices: [
      C("看着那个游侠的眼睛", "Look into the ranger's eyes", "nec_607", X({sanity: -5},
        "她的眼睛在停滞场里慢慢转向你。她会记住你很久。灵族活得很久。",
        "Inside the stasis her eyes slowly turn to you. She'll remember you a long time. Aeldari live a long time.")),
      C("转身走开", "Turn and leave", "nec_607")
    ]};

  N.nec_604 = {chapter: 6, scene: "stasis_gallery", speaker: null, time: {h: 1},
    text: L("你缩在展台后，看着游侠们解开先知，消失在光缝里，像从没来过。\n伊姆赫特第二天才发现展位空了。\n他在铭牌上改了一个字：“古老的宿敌，第四次被打断的预言。”",
            "From behind the plinth you watch the rangers free the seer and vanish into the seam as if they'd never been.\nImhet notices the empty display next day.\nHe changes one word on the plaque: “Old Enemies. Fourth Interrupted Prophecy.”"),
    effects: {sanity: -5},
    choices: [
      C("什么也不说", "Say nothing", "nec_607")
    ]};

  N.nec_607 = {chapter: 6, scene: "stasis_gallery", speaker: COLLECTOR, time: {d: 1},
    text: L("出发前，收藏家向你描述他的新展位：一片星神碎片，冻在饥饿的那一刻。\n“铭牌我都想好了：死亡，进食中。”\n他的声音快乐得像个孩子。你想起那个声音在你骨头里说话的感觉。",
            "Before departure, the Collector describes his new display: a star-god shard, frozen mid-hunger.\n“I've already written the plaque: Death, Feeding.”\nHe sounds as happy as a child. You remember that voice speaking inside your bones."),
    codex: ["nec_ctan"],
    choices: [
      C("“这不明智。”", "“That isn't wise.”", "nec_605", X({renown: 3},
        "“明智？”收藏家笑了，“明智的人什么都收藏不到。”",
        "“Wise?” The Collector laughs. “The wise never collect anything.”")),
      C("“您打算把它摆在哪儿？”", "“Where will you put it?”", "nec_605", X({sanity: -5},
        "“你的展位旁边，”他说，“你们俩会很合得来。”",
        "“Next to yours,” he says. “You two will get along famously.”"))
    ]};

  N.nec_605 = {chapter: 6, scene: "webway", speaker: IMHET, time: {d: 2},
    text: L("收藏家的船穿过一道巨石门，驶进一条不属于任何宇宙的隧道。\n伊姆赫特：“别数时间。数时间会惹恼这扇门。”\n你还是数了。隧道扭了一下，所有星光都倒着流。",
            "The Collector's vessel passes a dolmen gate into a tunnel that belongs to no universe.\nImhet: “Don't count the time. Counting annoys the gate.”\nYou count anyway. The tunnel twists, and all the starlight flows backward."),
    effects: {sanity: -5},
    codex: ["nec_dolmen_gate"],
    choices: [
      C("停止计数", "Stop counting", "nec_606", X({sanity: 5},
        "你闭上眼。隧道慢慢松开了，像一只放开猎物的手。",
        "You close your eyes. The tunnel slowly unclenches, like a hand releasing its prey.")),
      C("继续数下去", "Keep counting", "nec_606", X({sanity: -10, corruption: 5, set: {counted: true}, taint: {tzeentch: 80}},
        "你数到了一个不存在的数字。伊姆赫特叹了口气，像一台风扇。",
        "You count to a number that does not exist. Imhet sighs like a cooling fan."))
    ]};

  N.nec_606 = {chapter: 6, scene: "tomb_exterior", speaker: IMHET, time: {y: 700, warp: true}, eventRoll: 0.42,
    text: L("出口打开时，伊姆赫特看了看读数，沉默了一会儿。\n“我们迟到了。迟到多少，我不太想说。”\n忒萨零号的沙丘上，立着一座帝国要塞大教堂，钟楼比金字塔还高。",
            "When the exit opens, Imhet checks a readout and goes quiet a while.\n“We are late. By how much, I'd rather not say.”\nOn Thessa Null's dunes stands an Imperial fortress-cathedral, its bell tower taller than the pyramid."),
    codex: ["place_thessa_cathedral", "imp_imperium"],
    choices: [
      C("混进帝国营地", "Slip into the Imperial camp", "nec_701"),
      C("先回墓里见霸主", "Go to the overlord first", "nec_702")
    ]};

  /* ============ Chapter 7 · Return to the Tomb ============ */
  N.nec_701 = {chapter: 7, scene: "dig_site", speaker: VEKTRIX, time: {d: 1}, eventRoll: 0.35,
    grudgeLine: GL("vektrix", "他的镜头在你耳后停了一下，像在核对一个旧序列号。",
                   "His lens pauses behind your ear, as if checking an old serial number."),
    text: L("你穿着过时几百年的外套走进营地。没人拦你，你太像档案照片了。\n一个几乎全是机械的贤者转过来，镜头对焦。\n“考察队员，失踪于113.M42，”维克崔斯-9说，“你没有变老。有意思。”",
            "You walk into the camp in an expedition coat centuries out of fashion. No one stops you; you look too much like the archive picts.\nAn almost entirely mechanical magos turns, lenses focusing.\n“Expedition member, lost 113.M42,” says Vektrix-9. “You have not aged. Interesting.”"),
    codex: ["imp_mechanicus"],
    choices: [
      C("说实话", "Tell the truth", "nec_703", X({set: {toldTruth: true}},
        "贤者听完，什么也没说，只是发出一串短促的二进制。几分钟后，一位审判官到了。",
        "The magos hears you out, says nothing, and emits a short burst of binary. Minutes later an Inquisitor arrives.")),
      C("说你是那名队员的后代", "Claim to be that member's descendant", null, O(R(0.5, null, "nec_704", "nec_703",
        RR("贤者扫描了你的脸，点点头。“遗传得真好。”", "The magos scans your face and nods. “Remarkable heredity.”",
           "贤者扫描了你的脸，又扫描了一遍，然后叫来了审判官。", "The magos scans your face, then again, then sends for the Inquisitor.")),
        G("vektrix", "他的日志存着你的植入体序列号，还有那次“传输异常”。",
          "His logs still hold your implant's serial number and that old “transmission fault.”", -0.15))),
      C("“合同还剩二十九年，贤者。”", "“Twenty-nine years left on my contract, Magos.”", "nec_704", O(Q({flag: "origin_lexmech"}, true), X({renown: 3},
        "贤者的镜头转了三圈。“契约书记！欢迎归队。你的工资，我们稍后再算。”",
        "The magos's lens spins three times. “My lexmechanic! Welcome back. We'll discuss back pay later.”"),
        G("vektrix", "他要先审计你的植入体：一次传输异常，一份外泄的拷贝。",
          "He audits your implant first: one transmission fault, one leaked copy.", null, {sanity: -8})))
    ]};

  N.nec_702 = {chapter: 7, scene: "tomb_interior", speaker: SEKHRAT, time: {d: 1},
    grudgeLine: GL("sekhrat", "他顿了顿：“上回交接，礼物自己跑了。礼数，是有账的。”",
                   "He pauses. “At the last handover, the gift ran off by itself. Etiquette keeps accounts.”"),
    text: L("塞赫拉特还在王座上，身后多了一面萨特克王朝的绿色雷纹旗。\n“最后我还是向风暴领主臣服了，”他说，“他比我想的有礼貌。”\n他认出了你：“我的礼物！收藏家把你转送回来了？多庸俗。”",
            "Sekhrat is still on his throne, the Sautekh Dynasty's green lightning banner now behind it.\n“I submitted to the Stormlord in the end,” he says. “He was more courteous than expected.”\nHe recognises you. “My gift! The Collector re-gifted you? How vulgar.”"),
    codex: ["nec_imotekh", "nec_dynasties"],
    choices: [
      C("“我是来帮您的。”", "“I've come to help you.”", "nec_705", O(X({renown: 5},
        "霸主满意地嗡了一声。“礼物懂得感恩。罕见。”",
        "The overlord hums with satisfaction. “A grateful gift. Rare.”"),
        G("sekhrat", "霸主记得那件跑掉的礼物，你的话分量轻了。",
          "The overlord remembers the gift that ran; your words weigh less.", null, {renown: -4}))),
      C("“我是来救我的人的。”", "“I've come for my people.”", "nec_705", X({sanity: 5},
        "“你的人？”霸主想了想，“哦，地面上那些。他们比你吵。”",
        "“Your people?” The overlord considers. “Ah, the ones on the surface. Louder than you.”"))
    ]};

  N.nec_703 = {chapter: 7, scene: "dig_site", speaker: MORDANE, time: {h: 4},
    text: L("莫丹审判官听完你的故事，一次都没打断。\n“会走路的金属尸体。收藏人类的博物馆。关在笼子里的神。”她合上记录板，“你知道的每件事都是死罪。\n不过，先帮我把门打开。”",
            "Inquisitor Mordane hears your story without interrupting once.\n“Walking metal corpses. A museum that collects humans. A god in a cage.” She closes her slate. “Everything you know is a capital crime.\nBut first, help me open that door.”"),
    effects: {sanity: -5, set: {inqKnows: true}},
    codex: ["imp_inquisition"],
    choices: [
      C("“那扇门绝对不能开！”", "“That door must never open!”", "nec_708", X({renown: 3},
        "莫丹笑了。“每个人都这么说。所以每扇门后面都值得一看。”",
        "Mordane smiles. “Everyone says that. Which is why every door is worth a look.”")),
      C("“给我一点时间。”", "“Give me some time.”", "nec_708")
    ]};

  N.nec_704 = {chapter: 7, scene: "dig_site", speaker: VEKTRIX, time: {h: 2},
    text: L("贤者没再追问，直接把你带进钻探区，因为队员的后代也算档案的一部分。\n“我们钻了几百年，”他说，“今天，终于要见到神了。”\n他的声音里有一种你很熟悉的东西：教授当年的那种光。",
            "The magos asks nothing more and takes you straight to the drill zone; descendants count as archive material.\n“We have drilled for centuries,” he says. “Today, at last, we meet the god.”\nIn his voice is something familiar: the light the Professor had, long ago."),
    effects: {renown: 3, set: {disguised: true}},
    choices: [
      C("跟他走", "Follow him", "nec_708")
    ]};

  N.nec_705 = {chapter: 7, scene: "tomb_interior", speaker: SEKHRAT, time: {h: 3},
    text: L("“风暴领主有令：碎片不得逃脱，这颗星球上的人类一个不留，”塞赫拉特说，“明天黎明，我的军团醒来。”\n他歪着头看你：“有异议？说吧。礼数允许客人说一句不合时宜的话。”",
            "“The Stormlord commands: the shard must not escape, and no human on this world is to remain,” says Sekhrat. “At dawn my legions wake.”\nHe tilts his head. “You object? Speak. Etiquette permits a guest one untimely remark.”"),
    choices: [
      C("“让我去劝他们撤离。”", "“Let me persuade them to leave.”", "nec_707", O(Q({stat: "renown", min: 40}), X({set: {truce: true}},
        "霸主想了很久。“一个太阳日。之后，礼数就结束了。”",
        "The overlord thinks a long time. “One solar day. After that, etiquette ends.”"),
        G("sekhrat", "霸主要你先为当年逃走的事，行满一套赔礼。",
          "He first makes you perform the full apology rite for your old flight.", null, {sanity: -6}))),
      C("告诉他营地的防御弱点", "Tell him the camp's weak points", "nec_707", X({renown: 8, sanity: -10, set: {betrayed: true, wronged_mordane: true}, taint: {khorne: 40}},
        "你在沙盘上点了三处：莫丹审判官哨位最薄的三处。霸主满意地嗡了一声。你的手指在抖。",
        "You mark three spots on the sand-table: the thinnest posts in Inquisitor Mordane's line. The overlord hums contentedly. Your finger trembles.")),
      C("“碎片比人类危险得多。”", "“The shard is far more dangerous.”", "nec_707", X({renown: 3},
        "塞赫拉特沉默了。“对。”这是他第一次没纠正你的发音。",
        "Sekhrat goes silent. “Yes.” For the first time, he doesn't correct your pronunciation."))
    ]};

  N.nec_707 = {chapter: 7, scene: "dig_site", speaker: MORDANE, time: {h: 8},
    text: L("你带着霸主的话回到帝国营地。莫丹审判官听完，笑了。\n“一个金属贵族，给我们一天时间撤离？”\n她转向贤者：“那就今天开门。开完再走。”",
            "You return to the Imperial camp with the overlord's word. Inquisitor Mordane hears it out and laughs.\n“A metal aristocrat giving us a day to leave?”\nShe turns to the magos. “Then we open the door today. And leave after.”"),
    effects: {set: {inqKnows: true}},
    codex: ["imp_inquisition"],
    choices: [
      C("冲去档案库找证据", "Run to the archive for proof", "nec_708", X({hp: -5},
        "你在走廊里撞翻了两个执事，膝盖磕得生疼。",
        "You bowl over two deacons in the corridor and crack your knee.")),
      C("拉审判官去看那个笼子", "Drag the Inquisitor to see the cage", "nec_708", X({renown: 3, set: {mordaneSaw: true}},
        "莫丹看了笼子一眼，脸色没变，手却按在了枪上。“明天再开，”她说，“今晚我想读点东西。”",
        "Mordane glances at the cage. Her face doesn't change, but her hand finds her pistol. “Tomorrow,” she says. “Tonight I'll do some reading.”"))
    ]};

  N.nec_708 = {chapter: 7, scene: "cathedral", speaker: null, time: {h: 5}, eventRoll: 0.42,
    text: L("夜里你溜进要塞的档案库。玛罗教授的书摆在最显眼处：《忒萨零号：一座空墓》。\n书里没有活的金属，没有醒来的死者，只有她的名字。\n你的名字在脚注里，拼错了。",
            "At night you slip into the fortress archive. Professor Marrow's book sits in pride of place: Thessa Null: An Empty Tomb.\nNo living metal. No waking dead. Just her name.\nYours is in a footnote, misspelled."),
    codex: ["place_thessa_cathedral"],
    choices: [
      C("抄下被封存的真实勘测报告", "Copy the sealed true survey report", "nec_706", X({sanity: -5, set: {records: true}, taint: {tzeentch: 40}},
        "封条后是第一支勘测队的报告：他们看见了站着睡觉的人。页边写着“焚毁”，没人执行。",
        "Behind the seals: the first survey team's report. They saw people sleeping on their feet. BURN is written in the margin. Nobody did.")),
      C("改正脚注里你的名字", "Correct your name in the footnote", "nec_706", X({sanity: 10},
        "你用钢笔仔细改好。这是你几百年来做过最痛快的事。",
        "You fix it carefully in ink. The most satisfying thing you've done in centuries.")),
      C("撕了这本书", "Tear the book apart", "nec_706", X({hp: -5, renown: 3},
        "书页很硬，撕得手疼。一个执事在门口看着你，没出声，然后走开了。",
        "The pages are stiff; your hands ache. A deacon watches from the doorway, says nothing, and leaves."))
    ]};

  N.nec_706 = {chapter: 7, scene: "tomb_interior", speaker: SHARD, time: {h: 6},
    grudgeLine: GL("vektrix", "维克崔斯-9站在钻机旁，镜头不时转向你耳后的接口。",
                   "Vektrix-9 stands by the drill, his lens drifting now and then to the socket behind your ear."),
    text: L("钻探区尽头，就是那座光编的笼子。贤者的钻头已经咬穿了三层光。\n碎片在里面翻了个身。你感到它在微笑。\n“小学者，你开过我的门一次。再开一次吧。我会让你永远不怕死。”",
            "At the end of the drill zone hangs the cage of woven light. The magos's drill has chewed through three layers.\nThe shard turns over inside. You feel it smile.\n“Little scholar. You opened my door once. Open it again. I'll make you never fear death.”"),
    effects: {sanity: -10, corruption: 5},
    codex: ["nec_tesseract", "place_tesseract_vault", "nec_nightbringer"],
    choices: [
      C("“你就是死亡本身。”", "“You are death itself.”", "nec_801", X({renown: 3},
        "碎片笑了，笑得你牙齿发冷。“所以我才知道你们有多怕。”",
        "The shard laughs; your teeth go cold. “Which is how I know how afraid you all are.”")),
      C("听它说下去", "Listen to more", "nec_801", X({corruption: 20, hp: 10, set: {shardWhisper: true}},
        "它说话时，你的伤都不疼了。你忘了自己为什么害怕。这让你很害怕。",
        "While it speaks, your wounds stop hurting. You forget why you were afraid. That frightens you.")),
      C("黑进钻机的思考机", "Hack the drill's cogitator", "nec_801", O(Q({flag: "origin_lexmech"}, true), X({renown: 5, set: {drillStalled: true}},
        "你耳后的接口还认得这台机器。钻头卡住了一小时，够技师们准备好了。",
        "The socket behind your ear still knows this machine. The drill seizes for an hour: enough for the crypteks to get ready."),
        G("vektrix", "贤者早改了钻机的权限码，旧接口会反灼你。",
          "The magos changed the drill's access codes long ago; your old socket will burn you.", null, {hp: -8}))),
      C("要贤者停钻", "Demand the magos stop drilling", "nec_801", X({hp: -10},
        "贤者把你推开，力气大得不像老人。“信仰不需要你的同意。”",
        "The magos shoves you aside, far too strong for an old man. “Faith does not require your consent.”"))
    ]};

  /* ============ Chapter 8 · The Star God ============ */
  N.nec_801 = {chapter: 8, scene: "tomb_interior", speaker: null, foe: "omen_ctan", time: {h: 1},
    text: L("黎明，笼子最后一层光碎了。\n碎片站起来，没有形状，只有一道影子和一股镰刀似的寒意。它经过的地方，机仆一个接一个停下。连机器都学会了死。\n死灵军团跪下了。六千万年，他们还记得怕它。",
            "Dawn. The cage's last layer of light shatters.\nThe shard rises: no shape, just a shadow and a scythe-like chill. Where it passes, servitors stop one by one. Even machines learn to die.\nThe necron legions kneel. Sixty million years, and they still remember fearing it."),
    effects: {hp: -10, sanity: -10},
    codex: ["nec_nightbringer", "nec_ctan"],
    choices: [
      C("帮技师们重新封印", "Help the crypteks reseal it", "nec_802"),
      C("跑", "Run", null, R(0.5, "hp", "nec_803", "nec_804",
        RR("你跑得比自己的影子还快。真的——影子落在了后面。", "You outrun your own shadow. Literally: it falls behind.",
           "寒意追上了你。你回头的那一瞬，头发白了一半。", "The chill catches you. In the instant you look back, half your hair turns white."))),
      C("像越狱那样钻进通风管", "Slip into a vent, jailbreak-style", "nec_803", O(Q({flag: "origin_convict"}, true), X({hp: -5},
        "你干过这个。膝盖磨破了，可你比所有人都先爬到了地面。",
        "You've done this before. Skinned knees, but you reach the surface before anyone else."))),
      C("走到它面前", "Walk up to it", "nec_805", X({corruption: 10},
        "你每走一步，脚下的金属地板就老化一千年。它在等你。",
        "With each step the metal floor beneath you ages a thousand years. It is waiting for you."))
    ]};

  N.nec_802 = {chapter: 8, scene: "tomb_interior", speaker: NEFER, foe: "omen_ctan", time: {h: 1},
    text: L("涅弗和十几个技师在笼子残骸周围拉起光线，像在补一张巨大的网。\n“锁码必须用旧语言、用活人的声音念出来，”他喊，“星神听得出差别！”\n所有目光都转向了你。",
            "Nefer and a dozen crypteks string light around the broken cage like mending a vast net.\n“The lock-code must be spoken in the old tongue, in a living voice!” he shouts. “The star god hears the difference!”\nEvery gaze turns to you."),
    choices: [
      C("念出你在塔尖抄下的符文", "Recite the glyphs you copied from the spire", "nec_806", O(Q({flag: "sketched"}), X({renown: 10},
        "每个音节都像一枚钉子，钉进光网里。你从没念得这么准过。",
        "Each syllable is a nail driven into the net of light. You've never pronounced anything so well."))),
      C("技师们已经准备好了——念", "The crypteks are ready. Speak.", "nec_806", O(Q({flag: "drillStalled"}, true), X({renown: 5},
        "你争来的那一小时，此刻全都用上了。光网一层层收紧。",
        "The hour you stole is spent all at once. The net tightens, layer by layer."))),
      C("用停滞钥匙冻住它一秒", "Freeze it for a second with the stasis key", "nec_806", O(Q({flag: "stasisKey"}, true), X({renown: 5, taint: {all: -10}},
        "钥匙在你手里化成一团冷光。碎片停了一秒，一秒就够了。",
        "The key melts into cold light in your hand. The shard stops for one second. One second is enough."))),
      C("硬着头皮念", "Stumble through it anyway", null, R(0.45, "sanity", "nec_806", "nec_807",
        RR("你念错了两个音，但星神没听出来。", "You fluff two sounds, but the star god doesn't notice.",
           "你念到一半，舌头冻住了。", "Halfway through, your tongue freezes.")))
    ]};

  N.nec_803 = {chapter: 8, scene: "tomb_exterior", speaker: null, foe: "necron_warrior", time: {h: 1},
    text: L("你冲出墓道。地面上一片混乱：帝国士兵和死灵战士挤在同一条壕沟里，朝同一个方向开火——朝墓里。\n身后传来一声巨响。技师们没有你，也把它关回去了。\n天上，审判官的穿梭机正在降落。",
            "You burst from the tunnel. Chaos above: Imperial troops and necron warriors share a trench, firing the same way—into the tomb.\nBehind you, a great boom. The crypteks have caged it without you.\nOverhead, the Inquisitor's shuttle is landing."),
    choices: [
      C("迎上去", "Go to meet it", "nec_810")
    ]};

  N.nec_804 = {chapter: 8, scene: "tomb_interior", speaker: NEFER, foe: "omen_ctan", time: {h: 1},
    text: L("你倒在地上，觉得自己老了五十岁。\n涅弗把你拖回笼子旁边。“你还活着，所以还有用。”\n他把一卷发光的锁码塞进你手里：“念。”",
            "You collapse, feeling fifty years older.\nNefer drags you back to the cage. “You are alive, therefore useful.”\nHe presses a glowing scroll of lock-code into your hands. “Speak.”"),
    effects: {hp: -25},
    choices: [
      C("念", "Speak", null, R(0.5, "sanity", "nec_806", "nec_807",
        RR("你的声音在发抖，但每个音都对。", "Your voice shakes, but every sound is right.",
           "你念到一半，那道影子转向了你。", "Halfway through, the shadow turns toward you.")))
    ]};

  N.nec_805 = {chapter: 8, scene: "tomb_interior", speaker: SHARD, time: {h: 1},
    text: L("近看，它并不可怕。它像一个很老、很累、很饿的东西。\n“当我的使者，”它说，“替我在人类之间行走。你会比星星活得更久。”\n它伸出了一只影子做的手。",
            "Up close it isn't frightening. It looks like something very old, very tired, very hungry.\n“Be my herald,” it says. “Walk among humans for me. You'll outlive the stars.”\nIt extends a hand made of shadow."),
    choices: [
      C("握住那只手", "Take the hand", "nec_end_devoured", X({corruption: 35},
        "那只手很轻，很冷。它没有握住你。它在喝。",
        "The hand is light and cold. It doesn't grasp you. It drinks.")),
      C("“我只是个档案员。”", "“I'm just an archivist.”", "nec_802", X({sanity: -10},
        "碎片停住了，像被一个太无聊的答案噎住。技师们趁机抛出了光网。",
        "The shard stops, as if choking on an answer too boring to eat. The crypteks seize the moment and cast their net."))
    ]};

  N.nec_806 = {chapter: 8, scene: "tomb_interior", speaker: SEKHRAT, time: {h: 2},
    text: L("最后一个音节落下，光网收紧。碎片尖叫着缩回笼子，像一滴墨缩回墨水瓶。\n墓穴安静了。塞赫拉特走到你面前，第一次弯下了腰。\n“发音，”他说，“完美。”",
            "The last syllable falls and the net tightens. The shard shrieks back into its cage like ink into the bottle.\nThe tomb goes silent. Sekhrat comes before you and, for the first time, bows.\n“Pronunciation,” he says. “Flawless.”"),
    effects: {renown: 5, sanity: 5, set: {sealed: true}},
    choices: [
      C("“我想留下来，替您写史。”", "“I'd like to stay and write your history.”", "nec_end_chronicler", O(Q({stat: "renown", min: 35}), X({renown: 5},
        "霸主沉默片刻。“一个会死的史官。”他听起来很感动，“多么奢侈。”",
        "The overlord is silent a moment. “A chronicler who can die.” He sounds moved. “What luxury.”"))),
      C("回地面去", "Go back up", "nec_810")
    ]};

  N.nec_807 = {chapter: 8, scene: "tomb_interior", speaker: null, foe: "omen_ctan", time: {h: 1},
    text: L("你念错了一个音。碎片转向你，你看见了自己的死，一千种版本。\n涅弗扑上来，挡在你和影子之间。他的金属身体化成了灰，没留下一句话。\n光网合上了。你还活着，大概。",
            "You get one sound wrong. The shard turns to you, and you see your own death in a thousand versions.\nNefer throws himself between you and the shadow. His metal body crumbles to ash without a word.\nThe net closes. You're alive, probably."),
    effects: {hp: -20, sanity: -15, set: {neferDead: true}},
    choices: [
      C("爬回地面", "Crawl back to the surface", "nec_810")
    ]};

  N.nec_810 = {chapter: 8, scene: "tomb_exterior", speaker: null, foe: "necron_warrior", time: {h: 2},
    text: L("地面上，帝国士兵和死灵战士隔着一条壕沟对视。刚才他们还在朝同一个方向开火。\n没人知道接下来该打谁。\n一个死灵贵族向对面的军官行了个礼。军官犹豫了一下，回了礼。",
            "On the surface, Imperial soldiers and necron warriors stare at each other across a trench. Minutes ago they were firing the same way.\nNobody knows whom to shoot next.\nA necron noble bows to the officer opposite. The officer hesitates, then salutes back."),
    choices: [
      C("站到两边中间", "Stand between the two sides", "nec_808", X({renown: 5, hp: -5},
        "两边的枪口都对准了你。你发现，这是你这辈子最有价值的时刻。",
        "Both sides aim at you. You realise this is the most valuable moment of your life.")),
      C("找个弹坑躲着", "Find a crater to hide in", "nec_808", X({sanity: 5},
        "弹坑里已经躲着一个机仆。它挪了挪，给你让了个位置。",
        "A servitor is already hiding in the crater. It shuffles over to make room."))
    ]};

  N.nec_808 = {chapter: 8, scene: "dig_site", speaker: MORDANE, time: {h: 4},
    grudgeLine: GL("mordane", "她手里压着一张哨位图：死灵先扑向的三处，正是她最薄的三处。那点歉意，不是对你的。",
                   "Under her hand lies a picket map: the three posts the necrons hit first were her thinnest. The apology in her tone is not meant for you."),
    text: L("碎片的事结束了，至少暂时。莫丹审判官带着风暴兵堵住了墓道口。\n“这颗星球会被净化，”她说，“知道这颗星球的人，也一样。”\n她的枪口很稳，语气里甚至有一点歉意。",
            "The shard is dealt with, for now. Inquisitor Mordane and her storm-troopers block the tunnel mouth.\n“This world will be purged,” she says. “So will everyone who knows of it.”\nHer aim is steady. Her tone is almost apologetic."),
    codex: ["imp_inquisition", "imp_exterminatus"],
    choices: [
      C("带着报告冲向穿梭机", "Run for a shuttle with the report", null, O(Q({flag: "records"}), R(0.65, null, "nec_end_truth", "nec_809",
        RR("子弹擦着你的耳朵飞过。舱门在你身后合上。", "A round clips past your ear. The hatch seals behind you.",
           "一发子弹打穿了你的腿。你滚回墓道，墓门替你合上了。", "A round goes through your leg. You roll back into the tunnel; the tomb door seals for you.")),
        G("mordane", "她的枪手认得你：那三处哨位的死者，人人记得。",
          "Her riflemen know your face; every one remembers the dead at those three posts.", -0.15))),
      C("退回墓穴深处", "Retreat into the tomb", "nec_809", G("mordane", "她早叫人瞄着墓道口，专等背对枪口的人。",
        "Her riflemen already cover the tunnel mouth, waiting for anyone who turns his back.", null, {hp: -8})),
      C("放下一切，投降", "Drop everything and surrender", "nec_end_inquisition", X({sanity: 5},
        "你把素描簿放在沙地上。莫丹弯腰捡起来，翻了一页，叹了口气。",
        "You lay your sketchbook on the sand. Mordane picks it up, turns one page, and sighs."))
    ]};

  N.nec_809 = {chapter: 8, scene: "tomb_interior", speaker: SEKHRAT, time: {h: 1},
    text: L("墓门在你身后合上，把枪声关在外面。\n塞赫拉特、伊姆赫特，还有阴影里的某个东西，同时看着你。\n“礼数要求，”霸主说，“我们给客人一个选择。”",
            "The tomb door seals behind you, shutting out the gunfire.\nSekhrat, Imhet, and something in the shadows all look at you at once.\n“Etiquette requires,” says the overlord, “that we offer our guest a choice.”"),
    choices: [
      C("跟伊姆赫特回画廊", "Return to the gallery with Imhet", "nec_end_curator", O(Q({stat: "renown", min: 45}), X({renown: 5},
        "伊姆赫特从口袋里掏出你的旧铭牌，擦了擦。“我一直留着。备用。”",
        "Imhet produces your old plaque from his pocket and polishes it. “I kept it. Spare.”"))),
      C("接受一具不朽的身体", "Accept an undying body", "nec_end_metal", X({hp: 50, sanity: -20},
        "霸主拍了拍手。两个技师走上前，手里的工具亮得像手术灯。",
        "The overlord claps once. Two crypteks step forward, tools gleaming like surgical lamps.")),
      C("走向阴影里那个冷的东西", "Go to the cold thing in the shadows", "nec_end_flayer", O(Q({flag: "meruk"}, true), X({sanity: -20},
        "阴影里伸出一只爪子，小心翼翼，像在邀请你跳舞。",
        "A claw reaches from the shadows, careful, as if asking you to dance."))),
      C("请霸主让你在墓室里避一避", "Ask to shelter in the crypts", "nec_end_chronicler", O(Q({stat: "renown", min: 30}), X({sanity: 5},
        "霸主想了想。“客人躲进主人的地窖，有失体面。不过——你可以替我记账。”",
        "The overlord considers. “A guest hiding in the host's cellar is undignified. However, you may keep my records.”"),
        G("sekhrat", "逃过一次的礼物，霸主会派朝臣整夜“陪”着。",
          "A gift that once ran gets courtiers “keeping it company” all night.", null, {sanity: -6})))
    ]};

  /* ============ Endings ============ */
  N.nec_end_truth = {chapter: 8, scene: "void", speaker: null, time: {d: 30, warp: true},
    text: L("穿梭机冲出大气层时，下面的沙漠亮起了净化之火。\n你抱着那份报告，一页没少。帝国不会出版它，审判庭会追捕它。\n但真相现在有了一个活着的抄本：你。",
            "As the shuttle breaks atmosphere, purging fire blooms over the desert below.\nYou clutch the report, not one page lost. The Imperium will never publish it; the Inquisition will hunt it.\nBut the truth now has a living copy: you."),
    ending: {kind: "good", title: L("活着的抄本", "The Living Copy"), cause: L("带着真相逃离", "Escaped with the truth")}};

  N.nec_end_curator = {chapter: 8, scene: "stasis_gallery", speaker: COLLECTOR, time: {y: 1},
    text: L("画廊多了一位会说话的讲解员。\n你给每件藏品重写说明，替凝固的人记住名字。卡尔中士的铭牌改成了：“祈祷中。附注：有人听见了。”\n收藏家说，这是他见过最好的修改。",
            "The gallery gains a talking docent.\nYou rewrite every plaque, remembering names for the frozen. Sergeant Kaal's now reads: “Praying. Note: someone heard.”\nThe Collector calls it the finest edit he has ever seen."),
    ending: {kind: "good", title: L("第四十一任讲解员", "Docent Forty-One"), cause: L("成为收藏家的讲解员", "Became the Collector's docent")}};

  N.nec_end_chronicler = {chapter: 8, scene: "tomb_interior", speaker: SEKHRAT, time: {y: 2},
    text: L("墓穴重新沉入沙下。审判庭的净化之火只烧到一片空沙漠。\n地底深处，一个人类坐在冰冷的大厅里，借着绿光写一部历史，写给六千万年后醒来的人。\n霸主偶尔来检查发音。",
            "The tomb sinks back beneath the sand. The Inquisition's fire finds only empty desert.\nFar below, a human sits in a cold hall writing a history by green light, for whoever wakes in sixty million years.\nThe overlord drops by now and then to check the pronunciation."),
    ending: {kind: "good", title: L("墓中史官", "Chronicler of the Tomb"), cause: L("留作墓穴的史官", "Stayed as the tomb's chronicler")}};

  N.nec_end_inquisition = {chapter: 8, scene: "dig_site", speaker: MORDANE, time: {d: 1},
    text: L("审判庭的记录很简短：证人一名，所知过多，已处理。\n他们在你的档案上盖了红章，和第一支勘测队的放在一起。\n后来有人说，沙丘上那排靴子又多了一双，鞋尖朝外。",
            "The Inquisition's record is brief: one witness, knew too much, processed.\nThey stamp your file red and shelve it beside the first survey team's.\nLater someone says the row of boots on the dune has grown by one pair, toes pointing out."),
    ending: {kind: "bad", title: L("所知过多", "Knew Too Much"), cause: L("因所知过多被审判庭处决", "Executed for knowing too much")}};

  N.nec_end_metal = {chapter: 8, scene: "tomb_interior", speaker: null, time: {d: 3},
    text: L("技师们很仔细，几乎是温柔的。疼只疼了一会儿，然后什么都没有了。\n你有了一具永不腐朽的身体，站在朝臣的队列里，眼睛亮着。\n有时霸主会问你一个问题。你只记得回答“是”。",
            "The crypteks are careful, almost tender. The pain lasts a moment, then there is nothing.\nYou have a body that will never decay. You stand among the courtiers, eyes glowing.\nSometimes the overlord asks you a question. You only remember how to say yes."),
    ending: {kind: "bad", title: L("不朽的朝臣", "The Undying Courtier"), cause: L("生体转移，失去灵魂", "Soul lost to the metal")}};

  N.nec_end_flayer = {chapter: 8, scene: "tomb_interior", speaker: MERUK, time: {y: 1},
    text: L("梅鲁克勋爵牵起你的手，带你走进一个没有光的地方。那里很冷，挤满了想要变暖的东西。\n你开始理解他们。你开始觉得冷。\n你开始看别人的皮肤，觉得那看起来很暖和。",
            "Lord Meruk takes your hand and leads you somewhere without light. It is cold there, crowded with things that want to be warm.\nYou begin to understand them. You begin to feel cold.\nYou start looking at other people's skin. It looks so warm."),
    ending: {kind: "bad", title: L("冷", "Cold"), cause: L("坠入剥皮者的疯狂", "Lost to the Flayer madness")}};

  N.nec_end_devoured = {chapter: 8, scene: "tomb_interior", speaker: SHARD, time: {d: 3},
    text: L("碎片没有吃你的身体。它吃掉了你对死亡的恐惧，然后是恐惧底下的一切。\n几天后，技师们在笼子旁找到一具完好的人类躯壳，还在微笑。\n星神很满意。它很久没吃这么饱了。",
            "The shard doesn't eat your body. It eats your fear of death, then everything beneath the fear.\nDays later the crypteks find an intact human shell beside the cage, still smiling.\nThe star god is satisfied. It hasn't eaten this well in ages."),
    ending: {kind: "bad", title: L("星神的晚餐", "The Star God's Supper"), cause: L("被星神碎片吞噬", "Devoured by the star god")}};

  N.nec_end_exhibit = {chapter: 5, scene: "stasis_gallery", speaker: IMHET, time: {y: 3000},
    text: L("第七十七号藏品：原始学者，发现中。姿势：惊讶。\n几千年来，参观者都会在这个展位前停下。他们说那个人类的表情很生动，好像随时会眨眼。\n你一次都没有眨过。",
            "Item 77: Primitive Scholar, Mid-Discovery. Pose: astonished.\nFor thousands of years visitors pause at this display. They say the human's expression is so vivid, as if about to blink.\nYou never blink once."),
    ending: {kind: "bad", title: L("第七十七号藏品", "Item 77"), cause: L("永远凝固在停滞场里", "Frozen in stasis forever")}};

  /* ============ Claim endings (SPEC §19): a Chaos god's claim, accepted or forced. Reached via the claim events' goto. ============ */
  N.nec_end_claim_khorne = {scene: "tomb_exterior", speaker: S("sigil_khorne", "远处的鼓", "A Distant Drum"), time: {d: 3},
    text: L("墓里的怒气无处可去。死灵没有灵魂，不值得杀，它只在你胸口打转。\n直到某天，一扇门向外打开了。零场之外，鼓声一下子涌了进来。\n你扑向第一个活人时，血神接住了你，像接住一把等了很久的刀。",
            "In the tomb your rage has nowhere to go. The necrons have no souls, not worth killing, so it burns in circles in your chest.\nUntil one day a door opens outward. Beyond the null field, the drumming floods in.\nAs you lunge at the first living person, the Blood God catches you, like a blade he has waited a long time for."),
    codex: ["god_khorne"],
    ending: {kind: "bad", title: L("零场之外", "Beyond the Null Field"), cause: L("出墓即被恐虐收走", "Taken by Khorne outside the tomb")}};

  N.nec_end_claim_nurgle = {scene: "dig_site", speaker: S("sigil_nurgle", "慈祥的声音", "A Fond Voice"), time: {d: 7},
    text: L("零场像一层冰，压住了你身上那点温吞吞的东西。它不急，它在等。\n后来你被带出墓穴。脚踩上沙地的第一步，所有的病一起醒了，暖得像回家。\n慈父很有耐心。一座六千万年的墓，也关不住他的孩子。",
            "The tomb's null field lies on you like ice, pressing down the lukewarm thing inside you. It's in no hurry. It waits.\nLater you are brought out. At your first step on the sand, every sickness wakes at once, warm as coming home.\nGrandfather is patient. Not even a sixty-million-year tomb can keep his children from him."),
    codex: ["god_nurgle"],
    ending: {kind: "bad", title: L("出墓的第一步", "The First Step Outside"), cause: L("出墓即被纳垢收走", "Taken by Nurgle outside the tomb")}};

  N.nec_end_claim_tzeentch = {scene: "tomb_exterior", speaker: S("daemon_tzeentch", "多出来的一行", "The Extra Line"), time: {d: 2},
    text: L("墓墙上会变的字越来越多。在零场里，它们只能沉默。\n你爬出墓穴看见星空的那一刻，它们一齐开口：“你终于出来了。答案都备好了。”\n你想知道的，从此都知道了。只是每个答案都通向下一个计划。",
            "The shifting lines on the tomb wall multiply. Inside the null field they can only keep silent.\nThe moment you climb out and see the stars, they all speak at once: “At last. We've prepared every answer for you.”\nEverything you ever wanted to know, you now know. Only every answer leads to another plan."),
    codex: ["god_tzeentch"],
    ending: {kind: "bad", title: L("星空下的答案", "Answers Under the Stars"), cause: L("出墓即被奸奇收走", "Taken by Tzeentch outside the tomb")}};

  N.nec_end_claim_slaanesh = {scene: "stasis_gallery", speaker: S("sigil_slaanesh", "空着的展台", "The Empty Plinth"), time: {y: 500},
    text: L("你总想让那一刻再完美一点：姿势，表情，光线。\n零场挡住了她，挡不住你自己的渴望。技师把你冻进停滞场时，你还在调整姿势。\n铭牌上写着：“人类，渴望中。”你会这样想要下去，直到群星熄灭。",
            "You always want that moment a little more perfect: the pose, the expression, the light.\nThe null field keeps Her hand away, but not your own wanting. When a cryptek freezes you in stasis, you are still adjusting your pose.\nThe plaque reads: “Human, wanting.” You will go on wanting until the stars go out."),
    codex: ["god_slaanesh"],
    ending: {kind: "bad", title: L("渴望中", "Wanting"), cause: L("冻结在渴望之中", "Frozen mid-longing")}};

  /* ============ Death nodes (engine-triggered) ============ */
  N.nec_death_hp = {scene: "tomb_interior", speaker: null,
    text: L("你倒在冰冷的金属地板上。几只甲虫赶来，绕你转了一圈，判定你已经没有用了。\n它们收走你的灯、你的笔、你的眼镜框，码得整整齐齐。\n你成了又一座整齐的沙丘。",
            "You fall on the cold metal floor. A few scarabs arrive, circle you once, and decide you're no longer useful.\nThey collect your lamp, your pen, your spectacle frames, and stack them neatly.\nYou become one more tidy dune."),
    ending: {kind: "death", title: L("整齐的沙丘", "A Tidy Dune"), cause: L("倒在墓中，无人收殓", "Fell in the tomb, unburied")}};

  N.nec_death_sanity = {scene: "tomb_interior", speaker: null,
    text: L("你开始用死灵的方式说话：没有起伏，没有停顿。然后你开始用他们的方式沉默。\n朝臣们在队列里给你让出一个位置。\n你站进去，一动不动，眼睛睁着，等一道永远不会下达的命令。",
            "You start speaking the necron way: no rise, no pause. Then you start keeping silent their way.\nThe courtiers make room for you in the line.\nYou step in and stand perfectly still, eyes open, awaiting an order that will never come."),
    ending: {kind: "death", title: L("静立", "Standing Still"), cause: L("理智崩溃，化作沉默", "Mind fell silent")}};

  N.nec_death_corruption = {scene: "tomb_interior", speaker: null,
    text: L("有什么古老的东西一直在小口啜饮你。今天，它喝到了杯底。\n你身上属于“人”的部分，一点不剩。\n剩下的那具身体还在走，还在笑，替某颗饥饿的星星打量着别的活物。",
            "Something ancient has been sipping at you. Today it reaches the bottom of the cup.\nNothing human is left in you.\nThe body that remains still walks and smiles, sizing up other living things for some hungry star."),
    ending: {kind: "death", title: L("见底", "Bottom of the Cup"), cause: L("被古老之物吸干", "Drained by something ancient")}};

  /* ============ Route-specific events ============ */
  WH.registerEvents([
    {id: "evt_nec_scarab", god: "other", factions: ["necrons"], minChapter: 2,
     scene: "tomb_interior", speaker: S("canoptek_scarab", "一只甲虫", "A Scarab"), foe: null,
     text: L("一只甲虫开始跟着你。你停它也停，你走它也走。\n它好像把你登记成了一台需要维护的设备。\n它刚吃掉了你的一颗纽扣，看起来有点抱歉。",
             "A scarab starts following you. You stop, it stops. You walk, it walks.\nIt seems to have logged you as equipment requiring maintenance.\nIt just ate one of your buttons, and looks faintly sorry."),
     codex: ["nec_canoptek"],
     choices: [
       {text: L("给它起个名字", "Give it a name"), effects: {sanity: 5},
        result: L("你叫它“纽扣”。它不回应名字，但从此每天早上都在你脚边等着。", "You call it Button. It ignores the name but waits by your feet every morning.")},
       {text: L("把它拍开", "Swat it away"), effects: {hp: -5},
        result: L("它被拍飞，落地，翻身，回来，顺便把你的鞋带也吃了。", "It flies, lands, rights itself, comes back, and eats your shoelace for good measure.")},
       {text: L("喂它一枚硬币", "Feed it a coin"), effects: {renown: 3},
        result: L("它吃完硬币，把数据传了上去。上面有人注意到：这个人类懂得维护关系。", "It eats the coin and relays the data upward. Someone notes: this human maintains relationships.")}
     ]},

    {id: "evt_nec_echo", god: "other", factions: ["necrons"], minChapter: 4,
     scene: "tomb_interior", speaker: S("player_necrons", "另一个你", "Another You"), foe: null,
     text: L("走廊里迎面走来一个人，穿着你的外套，提着你的灯。是你，年轻一点，还什么都没见过。\n某个墓穴技师的时间实验漏了。\n那个你张开嘴，想问路。",
             "Someone walks toward you down the corridor in your coat, carrying your lamp. It's you: younger, having seen nothing yet.\nSome cryptek's time experiment has leaked.\nThe other you opens their mouth to ask the way."),
     codex: ["nec_crypteks"],
     choices: [
       {text: L("“快跑。”", "“Run.”"), effects: {sanity: -5},
        result: L("那个你跑了。你身上什么都没变。时间不接受修改。", "The other you runs. Nothing about you changes. Time does not accept edits.")},
       {text: L("“带好素描簿。”", "“Keep the sketchbook close.”"), effects: {renown: 5},
        result: L("那个你点点头，把本子抱紧。你突然想起，当年确实有人这么对你说过。", "The other you nods and hugs the book. You suddenly recall someone once telling you exactly that.")},
       {text: L("侧身让路", "Step aside"), effects: {sanity: 5},
        result: L("你们擦肩而过。那盏灯的温度，你已经很久没感觉到了。", "You pass each other. You haven't felt that lamp's warmth in a very long time.")}
     ]}
  ]);

  WH.registerFaction({
    id: "necrons",
    name: L("死灵", "Necrons"),
    tagline: L("在死人的墓里，做一件有趣的藏品", "In a tomb of the dead, be an interesting exhibit"),
    role: L("考察队档案员", "Expedition archivist"),
    world: L("忒萨零号", "Thessa Null"),   // SPEC §27 home world (the convict overrides: shipped from Carcharos)
    playerSprite: "player_necrons",
    color: "#4fd16b",
    startNode: "nec_101",
    startDate: {year: 113, mill: 42},
    startStats: {hp: 100, sanity: 100, corruption: 0, renown: 10},
    renownLabel: L("价值", "Worth"),
    renownIcon: "icon_worth",
    npcs: {   // SPEC §28 — people a run can wrong (flag wronged_<id>); grudges sit on later choices where they are really present
      mordane: {name: L("莫丹审判官", "Inquisitor Mordane"), aka: [L("莫丹", "Mordane"), L("审判官", "the Inquisitor")], sprite: "inquisitor"},
      vektrix: {name: L("维克崔斯-9贤者", "Magos Vektrix-9"), aka: [L("维克崔斯-9", "Vektrix-9"), L("贤者", "the magos")], sprite: "explorator"},
      sekhrat: {name: L("塞赫拉特霸主", "Overlord Sekhrat"), aka: [L("塞赫拉特", "Sekhrat"), L("霸主", "the overlord")], sprite: "necron_lord"}
    },
    taintMod: {khorne: 0.5, nurgle: 0.5, tzeentch: 0.5, slaanesh: 0.5},   // SPEC §19: multiplier on positive taint deltas (cleanses unscaled)
    renownHelp: L("价值是你在死灵眼中作为“藏品”的分量。读懂符文、守住礼数、讲好故事让它上升；失礼、无趣、逃跑会让它下降。价值够高，霸主和收藏家才肯听你开口，更好的结局才会敞开。",
                  "Worth is how much you matter to the necrons, as a specimen. Reading their glyphs, keeping their etiquette and telling a good story raise it; rudeness, dullness and escape attempts lower it. High Worth makes the overlord and the Collector listen, and opens better endings."),
    deathNodes: {hp: "nec_death_hp", sanity: "nec_death_sanity", corruption: "nec_death_corruption"},
    origins: [
      {id: "archivist", name: L("考察队档案员", "Expedition archivist"),
       desc: L("考察队最年轻的档案员，带着素描簿和灯。年轻，腿脚好，可人微言轻。", "The dig's youngest archivist, with sketchbook and lamp. Young and quick on your feet, but nobody listens to the junior."),
       sprite: "player_necrons", startNode: "nec_101",
       max: {hp: 105, sanity: 100}, stats: {hp: 105, sanity: 100, corruption: 0, renown: 5}, set: {origin_archivist: true}},
      {id: "convict", name: L("罪犯劳工", "Convict labourer"), world: L("卡尔卡罗斯", "Carcharos"),
       desc: L("用十年苦役抵刑期的犯人。皮糙肉厚，心早已麻木，没人在乎你。", "A convict sold to the dig for ten years' labour. Tough hide, numbed mind; nobody cares about you."),
       sprite: "player_necrons", startNode: "nec_o_convict_1",
       max: {hp: 120, sanity: 90}, stats: {hp: 120, sanity: 90, corruption: 0, renown: 0}, set: {origin_convict: true}},
      {id: "lexmech", name: L("契约书记", "Indentured lexmechanic"),
       desc: L("机械神教贤者的契约书记，耳后插着数据线。身子单薄，头脑冷静，主人看重你。", "A magos's indentured scribe, data-cable behind one ear. Frail but clear-headed, and valued by your master."),
       sprite: "player_necrons", startNode: "nec_o_lexmech_1",
       max: {hp: 90, sanity: 105}, stats: {hp: 90, sanity: 105, corruption: 0, renown: 15}, set: {origin_lexmech: true}}
    ],
    learn: {
      leaders: ["nec_silent_king", "nec_imotekh", "nec_trazyn"],
      enemies: ["nec_ctan", "eld_aeldari", "xenos_tyranid", "imp_imperium"],
      boss: ["nec_nightbringer", "nec_tesseract"],
      lore: ["nec_old_enemies", "nec_necrontyr", "nec_biotransference", "nec_great_sleep", "nec_dynasties", "nec_crypteks", "nec_flayer_curse"]
    },
    chapters: {
      1: L("死寂之星", "The Dead World"),
      2: L("苏醒", "The Waking"),
      3: L("礼数", "Etiquette"),
      4: L("藏品", "The Specimen"),
      5: L("长廊", "The Gallery"),
      6: L("旧敌", "Old Enemies"),
      7: L("回到墓穴", "Return to the Tomb"),
      8: L("星神", "The Star God")
    },
    nodes: N
  });
})();
