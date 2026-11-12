/* data/factions/orks.js — Ork route (text role: text-orks). SPEC §3, §11, §16–§20b, §23, §26, §27.
 * World: Iskaron 伊斯卡隆, a ship-breaking world of the Arcosa Sector, overrun by Warboss Grukka's Waaagh! in 112.M42.
 * Player: a human kept alive because Wazgob da Mek finds them useful. Ghazghkull appears only via omen_waaagh / rumours,
 * Gork & Mork only via omen_gork_mork. Final boss: the warboss duel in the fight pit as da Prophet's Great Waaagh! lands.
 * Sector cross-refs (§27): the Valda tithe ship that never reached Aurex (wreck on Iskaron), the Waaagh!'s next stop is
 * Aurex Secundus, a slave who fled Carcharos (rumour).
 * Ork voice: zh 兽人腔 — 俺 / 人仔 ('umie) / 小子们 (boyz) / 揍扁 (krump) / 突突 (dakka) / 打架！更多打架！ / 红的跑得快！;
 *            en classic orky spelling kept readable (dis, dat, fing, wot, 'umie, krump, fasta, 'ard).
 * Helpers: L(zh,en) · S(sprite,zh,en) speaker · C(zh,en,next,extra) choice · X(effects,zh,en) {effects,result} ·
 *          R(p,stat,success,fail,RR(...)) roll + rollResult · Q(require,hide) · O(...objs) merge.
 * Taint (SPEC §18) is hidden: never mentioned in text.
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

  var WAZ    = S("ork_mek", "机械佬瓦兹格布", "Wazgob da Mek");
  var SNAG   = S("gretchin", "地精仔斯纳吉特", "Snaggit");
  var ZOG    = S("ork_weirdboy", "怪小子佐格拉克", "Zograk da Weirdboy");
  var GRUK   = S("ork_boss", "格鲁卡大老大", "Warboss Grukka");
  var SKAR   = S("ork_nob", "斯卡巴德头目", "Nob Skarbad");
  var DOK    = S("ork", "巴兹戈布医生佬", "Dok Buzzgob");
  var REDGOB = S("ork", "红戈布船长", "Kaptin Redgob");
  var TRADER = S("ork", "黄月亮商人", "Bad Moon Trader");
  var HALE   = S("commissar", "黑尔政委", "Commissar Hale");
  var VOSS   = S("guard_sergeant", "沃斯中士", "Sergeant Voss");
  var EDNA   = S("preacher", "老埃德娜", "Old Edna");
  var MARINE = S("astartes", "疤脸老兵", "Scarred Veteran");
  var PDF    = S("guardsman", "防卫军士兵", "PDF Trooper");
  var CULT   = S("cultist", "披红布的人", "Man in Red Rags");
  var GODS   = S("omen_gork_mork", "云里的两个大家伙", "Two Big Shapes in the Clouds");
  var STORM  = S("omen_waaagh", "绿色风暴", "The Green Storm");

  var N = {};

  /* ============ Chapter 1 · Da Big Scrap ============ */
  N.ork_101 = {chapter: 1, scene: "ork_scrapyard", speaker: null,
    text: L("伊斯卡隆，阿尔科萨星区的拆船星。你在废船骨架之间倒卖铜线和阀门，日子不坏。\n那天，天空变绿了。一块块装着引擎的大石头砸进船坞。\n石头里传出笑声。",
            "Iskaron, ship-breaking world of the Arcosa Sector. You trade copper wire and valves among the bones of dead ships. Not a bad life.\nThen the sky turns green. Huge rocks with engines slam into the docks.\nThe rocks are laughing."),
    codex: ["place_iskaron", "place_arcosa", "xenos_ork"],
    choices: [
      C("钻进一艘废船的肚子里躲起来", "Hide in the belly of a wreck", "ork_102"),
      C("跑去防卫军的集结点", "Run for the PDF muster point", "ork_103"),
      C("先抱起最值钱的那箱货", "Grab your most valuable crate first", "ork_102", X({renown: 3, hp: -5},
        "一箱伺服马达，沉得要命。你抱着它跑，像抱着自己的命。",
        "A crate of servo-motors, heavy as sin. You run hugging it like your own life."))
    ]};

  N.ork_102 = {chapter: 1, scene: "ork_scrapyard", speaker: null, foe: "ork", time: {h: 1},
    text: L("你钻进的是那艘瓦尔达什一税船的残骸。它当年没飞到奥雷克斯二号，坠在了这儿。\n外面，一个绿皮大块头肚子挨了一枪，低头看看，大笑着接着冲。\n然后它闻到了你。",
            "You've crawled into the wreck of the Valda tithe ship, the one that never reached Aurex Secundus and came down here instead.\nOutside, a green brute takes a round in the gut, looks down, laughs, and keeps charging.\nThen it smells you."),
    codex: ["place_valda_wreck"],
    choices: [
      C("一动不动，装死", "Play dead", "ork_104", X({sanity: -5},
        "它用靴子把你翻过来，嗅了嗅，失望地嘟囔：“没打。”然后拎起了你的后领。",
        "It flips you over with a boot, sniffs, and grumbles, disappointed: “No fight.” Then it grabs your collar.")),
      C("抄起扳手砸它", "Hit it with a spanner", "ork_104", X({hp: -15, renown: 3, taint: {khorne: 10}},
        "扳手弹了回来。兽人摸摸脑门，咧嘴一笑：“小家伙有种！”一拳把你打晕了。",
        "The spanner bounces off. The ork rubs its forehead and grins. “Little 'un's got guts!” One punch, lights out.")),
      C("举起一个闪亮的阀门", "Hold up a shiny valve", "ork_104", X({renown: 3},
        "它盯着阀门，眼睛发直，伸手把阀门连同你一起抓走了。",
        "It stares at the valve, transfixed, and scoops up the valve and you together."))
    ]};

  N.ork_103 = {chapter: 1, scene: "trench", speaker: PDF, foe: "ork", time: {h: 1},
    text: L("防卫军沿着船坞挖了一道壕沟。军官喊：“守住！”然后兽人来了。\n它们不躲子弹，它们迎着子弹跑，一边跑一边吼：“Waaagh！”\n吼声大得让你的牙齿都在嗡嗡响。",
            "The PDF has dug a trench along the docks. An officer shouts “Hold!” Then the orks arrive.\nThey don't dodge bullets. They run into them, roaring: “WAAAGH!”\nThe roar is so loud your teeth buzz."),
    codex: ["xenos_waaagh"],
    choices: [
      C("捡起死人的激光枪开火", "Grab a dead man's lasgun and fire", null, R(0.5, "hp", "ork_104", "ork_105",
        RR("你打光了一整个电池。倒下三个兽人，站起来两个。最后一个笑着把你拎出了壕沟。",
           "You empty a whole power pack. Three orks fall; two get up. The last one laughs and lifts you out of the trench.",
           "一把砍刀拍在你肩上。用的是刀面，因为兽人觉得这样好玩。",
           "A cleaver slaps your shoulder, flat side first, because the ork thinks that's funnier."))),
      C("趴在壕沟底下", "Lie flat in the trench", "ork_104", X({sanity: -10},
        "兽人一个接一个从你头顶跳过去。有一个踩在你背上，停下来，嫌你太软。",
        "Orks leap over you one after another. One lands on your back, pauses, and finds you too soft."))
    ]};

  N.ork_105 = {chapter: 1, scene: "ruins", speaker: DOK, time: {h: 3},
    text: L("你醒来时，一个兽人正拿着锯子打量你的肩膀。它的围裙上全是油，还有别的什么。\n“医生佬瞅瞅……”它嘟囔，“人仔的零件太小，不好修。不修了。”\n它把你扔上了俘虏堆。",
            "You wake to an ork eyeing your shoulder, saw in hand. Its apron is stained with oil, and other things.\n“Dok takes a look…” it mutters. “'Umie bitz too small. Fiddly. Not worf it.”\nIt tosses you onto the prisoner pile."),
    effects: {hp: -15},
    codex: ["ork_painboyz"],
    choices: [
      C("爬起来", "Get up", "ork_104")
    ]};

  N.ork_104 = {chapter: 1, scene: "ork_fort", speaker: null, foe: "gretchin", time: {d: 1},
    text: L("俘虏被赶进一圈废铁围栏。看守是一群尖耳朵的小绿东西，扛着比自己还大的枪，互相踢屁股。\n每隔一会儿就有兽人进来挑人：能打的拉去打架坑，太瘦的拉去喂史奎格。",
            "The prisoners are herded into a ring of scrap fencing. The guards are pointy-eared little green things with guns bigger than themselves, kicking each other's backsides.\nEvery so often an ork comes in to pick: fighters to the pit, skinny ones to feed the squigs."),
    codex: ["ork_gretchin", "place_ork_fort"],
    choices: [
      C("挺起胸膛，装作能打", "Puff up your chest, look tough", "ork_107", X({hp: -10, taint: {khorne: 10}},
        "一个头目捏了捏你的胳膊，大笑：“软！”你被一脚踢进了史奎格圈。",
        "A nob squeezes your arm and roars with laughter. “SOFT!” One kick and you're in the squig pen.")),
      C("缩着脖子，显得没用", "Hunch down, look useless", "ork_107", X({sanity: -5},
        "你成功地显得很没用。于是你被分去了史奎格那边。",
        "You succeed in looking useless. So you're sorted toward the squigs.")),
      C("大声念出废料上的帝国标签", "Read the Imperial labels on the scrap aloud", "ork_106", X({renown: 5},
        "“……等离子导管，第三型，严禁敲击。”一个挂满扳手的兽人猛地转过头来。",
        "“…Plasma conduit, pattern three, do not strike.” An ork hung with spanners whips his head around."))
    ]};

  N.ork_107 = {chapter: 1, scene: "ork_fort", speaker: SNAG, foe: "squig", time: {h: 4},
    text: L("史奎格圈里全是球：长着腿和一张大嘴的球。它们吃铁皮、吃靴子、吃同类，什么都吃。\n一个地精仔隔着栅栏冲你笑：“新来的？别动。它们追会动的。”\n离你最近的那只开始流口水。",
            "The squig pen is full of balls: balls with legs and one enormous mouth. They eat tin, boots, each other, everything.\nA grot grins at you through the fence. “New? Don't move. Dey chase wot moves.”\nThe nearest one starts to drool."),
    codex: ["ork_squigs"],
    choices: [
      C("一动不动", "Stay perfectly still", null, R(0.5, "sanity", "ork_106", "ork_109",
        RR("史奎格嗅了你半天，只咬走了一只靴子。地精仔用长杆把你钩出栅栏：“机械佬要人。你。”",
           "The squig sniffs you a long time and takes only a boot. The grot hooks you out with a pole. “Mek wants someone. You.”",
           "你的膝盖在抖。史奎格看见了。",
           "Your knee trembles. The squig notices."))),
      C("把旁边的地精仔推进去", "Shove the grot beside you in", "ork_106", X({renown: 3, sanity: -5, taint: {khorne: 15}},
        "史奎格欢快地追着那个地精跑了。栅栏外的地精仔笑得很开心，眼睛却记住了你。",
        "The squig bounds off after that grot. The one at the fence laughs happily, but his eyes remember you.")),
      C("往史奎格嘴里塞一根铁管", "Ram an iron pipe into its mouth", "ork_106", X({hp: -5, renown: 2},
        "它咬断铁管，嚼得嘎嘣响，满意地走开了。栅栏外，一个挂满扳手的兽人点了点头。",
        "It bites the pipe in half, crunches happily and wanders off. Outside the fence, an ork hung with spanners nods."))
    ]};

  N.ork_109 = {chapter: 1, scene: "ork_fort", speaker: null, foe: "squig", time: {h: 1},
    text: L("史奎格追会动的东西。你的膝盖动了。\n地精仔用带钩的长杆把你拖出来，顺手摸走了你的打火机。\n“机械佬要人，”他说，“算你走运。”",
            "Squigs chase wot moves. Your knee moved.\nThe grot drags you out with a hooked pole and pockets your lighter while he's at it.\n“Mek wants someone,” he says. “Lucky you.”"),
    effects: {hp: -15},
    choices: [
      C("一瘸一拐地跟上", "Limp after him", "ork_106")
    ]};

  /* ---------- Origin prologue · Captured Guardsman ---------- */
  N.ork_o_guard_1 = {chapter: 1, scene: "trench", speaker: VOSS,
    text: L("你是星界军的列兵，驻守伊斯卡隆的船坞。沃斯中士嚼着烟草，看着天边那片绿。\n“兽人，”他说，“别想着赢。想着多拉几个垫背的。”\n第一块带引擎的石头落在三公里外。",
            "You're an Astra Militarum trooper posted to Iskaron's docks. Sergeant Voss chews tobacco and watches the green on the horizon.\n“Orks,” he says. “Don't think about winning. Think about taking a few with you.”\nThe first rock with engines lands three kilometres off."),
    codex: ["imp_guard", "place_iskaron"],
    choices: [
      C("把激光枪电池擦得锃亮", "Polish your lasgun power packs", "ork_o_guard_2", X({renown: 3, set: {packs: true}},
        "中士瞥了一眼：“好习惯。兽人最爱抢这玩意儿。”",
        "The sergeant glances over. “Good habit. Orks love stealing those.”")),
      C("给家里写最后一封信", "Write a last letter home", "ork_o_guard_2", X({sanity: 5},
        "你写了三行，划掉两行。剩下那句是：别等我吃饭。",
        "You write three lines and cross out two. The one left says: don't wait for me at supper."))
    ]};

  N.ork_o_guard_2 = {chapter: 1, scene: "trench", speaker: null, foe: "ork", time: {h: 6},
    text: L("冲锋来了。兽人跑得比你见过的任何东西都快，有的骑着冒黑烟的摩托，车身全刷成红色。\n你开枪，开枪，开枪。沃斯中士在吼什么，全被引擎声盖住了。",
            "The charge comes. Orks run faster than anything you've seen; some ride smoking bikes painted all red.\nYou fire, fire, fire. Sergeant Voss is shouting something, drowned out by engines."),
    codex: ["xenos_waaagh"],
    choices: [
      C("守住阵地，打到最后", "Hold the line to the end", "ork_o_guard_3", X({hp: -20, renown: 5, taint: {khorne: 10}},
        "你打倒了一个，又一个。然后一个兽人用整辆摩托砸中了你。",
        "You drop one, then another. Then an ork hits you with an entire bike.")),
      C("跟着中士后撤", "Fall back with the sergeant", "ork_o_guard_3", X({sanity: -5},
        "你们退了两百米。中士回头看了一眼阵地，从此没再说话。后来你们被冲散了。",
        "You fall back two hundred metres. The sergeant looks back once and says nothing more. Then the rush splits you apart."))
    ]};

  N.ork_o_guard_3 = {chapter: 1, scene: "ork_fort", speaker: SKAR, time: {d: 1},
    text: L("你醒来时躺在俘虏堆里。一个比门还宽的兽人头目踢了踢你。\n“这个打过。打得不赖，”他说，“打架坑留着。”\n人堆里有人小声说：进坑的人仔，没一个活过第二场。",
            "You wake on the prisoner pile. An ork nob wider than a door kicks you.\n“Dis one fought. Fought good,” he says. “Save it for da pit.”\nSomeone whispers: no 'umie in the pit ever lasted two bouts."),
    codex: ["place_ork_fort"],
    choices: [
      C("站起来，迎着他的目光", "Stand and meet his eyes", "ork_o_guard_4", X({renown: 5, hp: -5, taint: {khorne: 10}},
        "头目一巴掌把你扇回地上，笑得很开心：“对！就要这个！”",
        "The nob slaps you back down, delighted. “YES! Dat's da stuff!”")),
      C("低头不动", "Keep your head down", "ork_o_guard_4", X({sanity: -5},
        "头目失去了兴趣。你听见他在跟别人赌你能撑几分钟。",
        "The nob loses interest. You hear him betting how many minutes you'll last."))
    ]};

  N.ork_o_guard_4 = {chapter: 1, scene: "ork_fort", speaker: WAZ, time: {h: 5},
    text: L("开坑前，一个挂满扳手的兽人挤了过来，拎起你的电池包闻了闻。\n“这个人仔认得发光枪的电池，”他对头目说，“换给俺。俺给你一把会喷火的。”\n讨价还价持续了一拳。",
            "Before the pit opens, an ork hung with spanners shoulders through and sniffs your power pack.\n“Dis 'umie knows shiny-gun batteries,” he tells the nob. “Swap me. I'll give ya one dat burns.”\nThe haggling lasts one punch."),
    choices: [
      C("告诉他电池怎么充电", "Tell him how to recharge a pack", "ork_106", X({renown: 5},
        "你说得很快。他只听懂一半，可听懂的那一半让他非常满意。",
        "You talk fast. He understands half, and the half he understands pleases him enormously.")),
      C("一言不发", "Say nothing", "ork_106", X({sanity: -5},
        "他不在乎你说不说话，只在乎你有没有用。你被他扛上了肩膀。",
        "He doesn't care if you talk, only if you're useful. He slings you over his shoulder."))
    ]};

  /* ---------- Origin prologue · Hive-ganger ---------- */
  N.ork_o_ganger_1 = {chapter: 1, scene: "underhive", speaker: null,
    text: L("你是伊斯卡隆居住堆底层“锈牙帮”的人。绿天降临那晚，总督的卫兵全跑了。\n帮主说：上面的人在逃，上面的东西没人看。\n你们背起撬棍，往上爬。",
            "You run with the Rustfang gang at the bottom of Iskaron's hab-stacks. The night the sky turned green, the governor's guards all fled.\nThe boss says: the people up top are running; their stuff isn't.\nYou shoulder crowbars and climb."),
    codex: ["place_iskaron"],
    choices: [
      C("带头往上爬", "Lead the climb", "ork_o_ganger_2", X({hp: -5, renown: 3},
        "你爬得最快，也最先被碎玻璃划破手。帮主拍你的肩：“好样的。”",
        "You climb fastest, and are first to cut your hands on broken glass. The boss slaps your shoulder. “Good.”")),
      C("留在后面放风", "Hang back as lookout", "ork_o_ganger_2", X({sanity: 5},
        "你蹲在楼梯口，看着天上的绿光越来越亮，想着这辈子从没这么安静过。",
        "You crouch at the stairwell, watching the green light brighten, thinking you've never known such quiet."))
    ]};

  N.ork_o_ganger_2 = {chapter: 1, scene: "hive_spire", speaker: REDGOB, foe: "ork", time: {h: 5},
    text: L("总督塔里已经有人了：一伙兽人正在拆金框画、撬门把手，往一艘破船上搬。\n领头的戴着一顶插羽毛的帽子。看见你们，他没开枪。\n“人仔！”他说，“你们认得哪些值钱？”",
            "Someone beat you to the governor's tower: a band of orks prying off gilt frames and door handles, hauling them to a battered ship.\nTheir leader wears a feathered hat. Seeing you, he doesn't shoot.\n“'Umies!” he says. “You know wot's worf teef?”"),
    codex: ["ork_freebooterz"],
    choices: [
      C("认得，我带路", "Yes. Follow me", "ork_o_ganger_3", X({renown: 5, set: {freebooterFriend: true}},
        "船长咧嘴一笑，满嘴金牙。“聪明人仔！聪明的不用揍。”",
        "The kaptin grins, all gold teeth. “Smart 'umie! Smart ones don't need krumpin'.”")),
      C("拔腿就跑", "Run for it", "ork_o_ganger_3", X({hp: -15},
        "你跑了三层楼，小腿挨了一枪。羽毛帽亲自把你拎了回来，表示欣赏。",
        "You make three floors before a round clips your calf. Feather-hat fetches you back personally, impressed."))
    ]};

  N.ork_o_ganger_3 = {chapter: 1, scene: "hive_spire", speaker: REDGOB, time: {h: 6},
    text: L("红戈布船长是自由海盗：被自己部落踢出来的兽人，谁给的牙多就替谁打。\n你帮他们找到了总督的金库。他赏你一把牙，真正的兽人牙，沉甸甸的。\n“牙就是钱，”他说，“掉了还会长。”",
            "Kaptin Redgob is a Freebooter: an ork kicked out of his klan who fights for whoever pays most teef.\nYou lead them to the governor's vault. He rewards you with a fistful of teef, real ork teef, heavy.\n“Teef is money,” he says. “Falls out, grows back.”"),
    effects: {renown: 5},
    codex: ["ork_teef"],
    choices: [
      C("把牙塞满每个口袋", "Stuff teef in every pocket", "ork_o_ganger_4", X({renown: 5, taint: {slaanesh: 15}},
        "你走路时它们叮当作响，像在笑。你忍不住一遍遍去摸。",
        "They clink when you walk, like laughter. You can't stop touching them.")),
      C("要一把枪，不要牙", "Ask for a gun instead", "ork_o_ganger_4", X({set: {gotShoota: true}},
        "船长扔给你一把突突枪，比你的胳膊还长。“别冲着自己。”",
        "The kaptin tosses you a shoota longer than your arm. “Not at yerself.”"))
    ]};

  N.ork_o_ganger_4 = {chapter: 1, scene: "ork_scrapyard", speaker: REDGOB, time: {d: 3},
    text: L("三天后海盗船要起飞，船上没有人仔的位置。红戈布把你推给一个挂满扳手的机械佬，换了一把定做的突突枪。\n“别哭，”船长拍拍你的脸，“要是你零件还齐，俺回来买你。”",
            "Three days later the pirate ship lifts off, with no room for 'umies. Redgob shoves you at a Mek hung with spanners, in trade for a custom shoota.\n“Don't cry,” the kaptin pats your cheek. “Still got all yer bits, I'll buy ya back.”"),
    choices: [
      C("“说话算话！”", "“You'd better mean that!”", "ork_106", X({set: {freebooterFriend: true}},
        "船长大笑：“自由海盗从不算话。不过俺记性好。”",
        "The kaptin roars. “Freebooterz never mean nuffin'. But I got a good memory.”")),
      C("朝他啐一口", "Spit at him", "ork_106", X({renown: -3, sanity: 5},
        "他擦掉唾沫，笑得更开心了。“有种！”你心里好受了一点。",
        "He wipes it off and laughs even harder. “Guts!” You feel a little better."))
    ]};

  /* ---------- merge: the Mek ---------- */
  N.ork_106 = {chapter: 1, scene: "manufactorum", speaker: WAZ, time: {h: 2},
    text: L("挂满扳手的兽人把你拎进一座塞满废铁的旧工厂，往地上一扔。\n“俺是瓦兹格布，机械佬。你，人仔，认得人仔的字。”他敲敲一块帝国铭牌，“这个。念。”\n他脑子里知道怎么造枪，只是不识字。",
            "The ork hung with spanners hauls you into an old manufactorum stuffed with scrap and drops you.\n“I'm Wazgob. Mek. You, 'umie, read 'umie scribblin'.” He taps an Imperial plate. “Dis. Read.”\nHis head knows how to build guns. It just can't read."),
    codex: ["ork_meks", "place_wazgob_shop"],
    choices: [
      C("照实念", "Read it straight", "ork_108", X({renown: 5},
        "“……警告：反应堆过热时请勿……”瓦兹格布听完大笑，把铭牌拧下来当了锅盖。",
        "“…Warning: when the reactor overheats do not…” Wazgob laughs, twists the plate off and uses it as a pot lid.")),
      C("编一句吓唬他", "Make something up to scare him", "ork_108", X({renown: -3, sanity: 5, set: {wronged_wazgob: true}},
        "“上面说，碰它会爆炸。”瓦兹格布立刻碰了它。没炸。他盯着你看了很久，一扳手敲在你头上：“骗俺！”",
        "“It says touch it and it blows.” Wazgob touches it at once. Nothing. He stares at you a long while, then cracks a spanner on your head. “LIED to me!”")),
      C("问他能给你什么", "Ask what's in it for you", "ork_108", X({renown: 3, hp: -5},
        "他用扳手敲了你一下，不重。“给你？命。有用的话，再给颗牙。”",
        "He taps you with a spanner. Not hard. “For you? Livin'. Be useful, get a toof.”"))
    ]};

  N.ork_108 = {chapter: 1, scene: "manufactorum", speaker: SNAG, time: {h: 8},
    text: L("夜里，你被链子拴在工作台腿上。地精仔斯纳吉特蹲在台面上啃一根螺栓。\n“你运气好，机械佬的人仔活得久一点。上一个活了三个星期。”\n他想了想：“不，两个。”",
            "At night you're chained to a workbench leg. Snaggit the grot squats on top, gnawing a bolt.\n“You're lucky. Mek's 'umies last longer. Last one lasted three weeks.”\nHe thinks. “No. Two.”"),
    choices: [
      C("问上一个人仔怎么了", "Ask what happened to the last one", "ork_201", X({sanity: -5},
        "“他跟机械佬说，红的不会跑得快。”斯纳吉特耸耸肩，“后来他跑得很快。从炮管里。”",
        "“He told Mek red ones don't go fasta.” Snaggit shrugs. “Den he went real fast. Out of a cannon.”")),
      C("分给他一点口粮", "Share your rations with him", "ork_201", X({hp: -5, set: {snagFriend: true}},
        "斯纳吉特一把抢过去塞进嘴里，然后小声说：“明天别站在测试台前面。”",
        "Snaggit snatches it, stuffs it in, then whispers: “Tomorrow, don't stand in front of da test bench.”")),
      C("闭上眼睡觉", "Close your eyes and sleep", "ork_201", X({hp: 5},
        "你梦见船坞，梦见铜线的价钱。外面兽人在唱歌，或者在打架，听不出区别。",
        "You dream of the docks and the price of copper. Outside the orks are singing, or fighting. You can't tell which."))
    ]};

  /* ============ Chapter 2 · Da Mek's 'Umie ============ */
  N.ork_201 = {chapter: 2, scene: "manufactorum", speaker: WAZ, time: {d: 3},
    grudgeLine: {npc: "wazgob", text: L("瓦兹格布一边敲，一边斜着眼瞪你：“上回骗俺那句，俺记着呢。”", "Wazgob hammers on, glaring sideways at you. “Dat lie you told me. I remember.”")},
    text: L("瓦兹格布在造“大亮闪”：一副比房子还高的动力甲，给要当老大的那位穿。\n他不画图纸，他敲。敲不响就换个地方敲，敲响了就算修好。\n怪就怪在，它真的越敲越好。",
            "Wazgob is building Da Big Shiny: a suit of armour taller than a house, for whoever means to be boss.\nNo plans. He hits things. If it won't ring, he hits somewhere else. If it rings, it's fixed.\nThe strange part: it keeps getting better."),
    codex: ["ork_mega_armour"],
    choices: [
      C("递给他正确的扳手", "Hand him the right spanner", "ork_202", O({grudge: {npc: "wazgob", effects: {hp: -4}, note: L("瓦兹格布记着你骗过他，连递扳手都要先挨一下。", "Wazgob remembers your lie. Even handing him a spanner costs you a knock.")}}, X({renown: 3},
        "他看都没看就接了过去。“好人仔。”这是你头一回被兽人夸，感觉很怪。",
        "He takes it without looking. “Good 'umie.” Your first compliment from an ork. It feels strange."))),
      C("指出他接错了线", "Point out he's wired it wrong", "ork_203", X({renown: -2, taint: {tzeentch: 15}},
        "他瞪着你，又瞪着线。“错了？”他想了想，“那它咋能用？”",
        "He glares at you, then at the wires. “Wrong?” He thinks. “Den why's it work?”")),
      C("偷偷看他怎么敲", "Secretly study how he hits it", "ork_202", X({sanity: -5, taint: {tzeentch: 25}},
        "你看了一整天，得出结论：这不可能。你又看了一天，结论没变，机器照转。",
        "You watch all day and conclude: impossible. You watch another day. Same conclusion. The machine runs anyway."))
    ]};

  N.ork_202 = {chapter: 2, scene: "ork_scrapyard", speaker: WAZ, time: {h: 6},
    text: L("瓦兹格布把一辆破车刷成红色。“红的跑得快！”\n“油漆不会让车变快，”你说。\n他把车开上测试道。车快得发了疯，冒着火冲过终点，撞穿两堵墙。\n“看见没？红的！”",
            "Wazgob paints a wrecked buggy red. “Red ones go fasta!”\n“Paint doesn't make anything faster,” you say.\nHe sends it down the test track. It goes insanely fast, flaming past the finish and through two walls.\n“See? RED!”"),
    codex: ["ork_belief_tech"],
    choices: [
      C("掏出测速仪测一次", "Get out a speed gauge and measure", "ork_204", X({sanity: -5, renown: 3},
        "你测了三次。红车比同型号的灰车快百分之十一。你把测速仪扔进了熔炉。",
        "You measure three times. The red buggy is eleven percent faster than the identical grey one. You throw the gauge in the furnace.")),
      C("“对！红的快！”", "“Yeah! Red ones go fasta!”", "ork_204", X({renown: 5, sanity: -5},
        "瓦兹格布拍你的背，差点拍断。“这人仔，懂！”",
        "Wazgob slaps your back, nearly breaking it. “Dis 'umie GETS it!”"))
    ]};

  N.ork_203 = {chapter: 2, scene: "manufactorum", speaker: WAZ, time: {h: 2},
    text: L("你照帝国手册把线重接了一遍，整整齐齐。\n瓦兹格布按下开关。什么都没发生。\n他把线扯回原来的乱样子，再按。机器轰地转了起来。\n“人仔的办法，”他宽容地说，“兽人不信，所以不灵。”",
            "You rewire it by the Imperial manual, neat and tidy.\nWazgob flips the switch. Nothing.\nHe yanks the wires back into their old mess and flips it again. The machine roars to life.\n“'Umie way,” he says kindly. “Orks don't believe it, so it don't work.”"),
    effects: {sanity: -5},
    codex: ["ork_belief_tech"],
    choices: [
      C("“……好吧。”", "“…Right.”", "ork_204")
    ]};

  N.ork_204 = {chapter: 2, scene: "manufactorum", speaker: SNAG, time: {d: 2},
    grudgeLine: {npc: "wazgob", text: L("机械佬就睡在三步外，一只眼睁着，脚还压着罐盖。", "The Mek sleeps three paces away with one eye open and a foot on the jar lid.")},
    text: L("斯纳吉特把你拉到角落：“机械佬的牙罐子就在工作台底下。拿一点，他数不清。他只会数到‘好多’。”\n地精仔眼睛发亮。在兽人底下活着的东西，都学会了偷。",
            "Snaggit drags you into a corner. “Mek's teef jar is under da bench. Take a few, he can't count. Only counts up to ‘loads’.”\nThe grot's eyes gleam. Everything that lives under orks learns to steal."),
    codex: ["ork_teef"],
    choices: [
      C("跟他一起偷", "Steal with him", null, O({grudge: {npc: "wazgob", p: -0.15, note: L("瓦兹格布记着你骗过他，最近把牙罐子盯得更紧。", "Wazgob remembers your lie and has been watching his teef jar closer.")}}, R(0.55, null, "ork_205", "ork_206",
        RR("你们得手了。罐子里的牙少了一把，罐子看起来还是“好多”。",
           "You pull it off. A handful gone, and the jar still looks like ‘loads’.",
           "你的手刚伸进罐子，一只绿色的大手就按住了你的手。",
           "Your hand is barely in the jar when a big green hand closes over it.")))),
      C("告诉机械佬", "Tell the Mek", "ork_207", X({renown: 5, set: {snitchedSnag: true, wronged_snaggit: true}},
        "瓦兹格布一脚把斯纳吉特踢出了窗户。地精仔落地，爬起来，回头看了你一眼。",
        "Wazgob boots Snaggit out the window. The grot lands, picks himself up, and looks back at you.")),
      C("不掺和", "Stay out of it", "ork_207", X({hp: -5},
        "斯纳吉特耸耸肩，自己去了。第二天他的口袋鼓了，你的口粮少了一半。",
        "Snaggit shrugs and goes alone. Next day his pockets bulge and your rations are half gone."))
    ]};

  N.ork_205 = {chapter: 2, scene: "manufactorum", speaker: SNAG, time: {h: 3},
    text: L("斯纳吉特分给你三颗，自己留了七颗，说这叫“地精的算术”。\n那天晚上，瓦兹格布数了数罐子：“好多。”\n他满意地睡着了。",
            "Snaggit gives you three and keeps seven. He calls it ‘grot maths’.\nThat night Wazgob counts his jar. “Loads.”\nHe falls asleep content."),
    effects: {renown: 8, set: {stoleTeef: true, snagFriend: true}},
    choices: [
      C("把牙藏进鞋里", "Hide the teef in your boot", "ork_207")
    ]};

  N.ork_206 = {chapter: 2, scene: "manufactorum", speaker: WAZ, time: {h: 1},
    text: L("瓦兹格布从你手里拿回牙，没生气。他把你倒提起来晃，直到所有口袋都空了。\n“偷，好！”他说，“被抓，蠢！”\n为了公平，他也踢了斯纳吉特一脚。",
            "Wazgob takes back the teef without anger. He holds you upside down and shakes until every pocket is empty.\n“Stealin', good!” he says. “Gettin' caught, STUPID!”\nTo be fair, he kicks Snaggit too."),
    effects: {hp: -15, renown: -3},
    codex: ["ork_kultur"],
    choices: [
      C("揉着脑袋爬起来", "Get up rubbing your head", "ork_207")
    ]};

  N.ork_207 = {chapter: 2, scene: "manufactorum", speaker: null, foe: "squig", time: {d: 4}, eventRoll: 0.35,
    text: L("一只史奎格猎犬挣断了链子。它只有一张嘴，和一张嘴能装下的所有牙。\n兽人们没去抓它，反而围成一圈开始下注。\n它朝你冲了过来。",
            "A squig hound snaps its chain. It is one mouth, with every tooth a mouth can hold.\nThe orks don't catch it. They form a ring and start betting.\nIt's coming at you."),
    choices: [
      C("跳上工作台", "Jump onto the workbench", null, R(0.5, "hp", "ork_208", "ork_209",
        RR("你跳得够高。史奎格在下面绕圈，最后被套住了。押你输的兽人骂骂咧咧。",
           "You jump high enough. The squig circles below until it's lassoed. The orks who bet against you swear.",
           "你的脚滑了一下。",
           "Your foot slips."))),
      C("把晚饭扔给它", "Throw it your supper", "ork_208", X({hp: -5, renown: 2},
        "史奎格接住晚饭，嚼了两下，又看向你。不过这时它已经被套住了。",
        "The squig catches your supper, chews twice and looks at you again. By then it's been lassoed.")),
      C("拿扳手迎上去", "Meet it with a spanner", "ork_208", X({hp: -15, renown: 6, taint: {khorne: 15}},
        "一扳手敲在它鼻子上。它愣住了，兽人们疯了，赢钱的几个把你扛起来转圈。",
        "One spanner to the nose. It freezes; the orks go wild, and the winners hoist you up and spin you round."))
    ]};

  N.ork_209 = {chapter: 2, scene: "manufactorum", speaker: null, foe: "squig", time: {h: 1},
    text: L("你跳得不够高。\n史奎格咬住了你的靴子，和靴子里的东西。兽人们哄堂大笑，有人赢了很多牙。\n瓦兹格布最后用撬棍撬开了它的嘴，嘟囔：“别弄坏俺的人仔。”",
            "You don't jump high enough.\nThe squig gets your boot, and what's in it. The orks roar with laughter; someone wins a lot of teef.\nWazgob finally pries its jaws open with a crowbar, grumbling: “Don't break my 'umie.”"),
    effects: {hp: -20},
    choices: [
      C("一瘸一拐地回去干活", "Limp back to work", "ork_208")
    ]};

  N.ork_208 = {chapter: 2, scene: "manufactorum", speaker: SKAR, time: {d: 5},
    text: L("斯卡巴德头目来看大亮闪。他比别的兽人高一个头，因为他打赢的架比别人多一倍。\n“穿上它，俺就揍扁格鲁卡，当大老大。谁最大，谁说了算。”\n他低头看你：“人仔，这个，结实不？”",
            "Nob Skarbad comes to see Da Big Shiny. He's a head taller than the others because he's won twice as many fights.\n“I wear dis, I krump Grukka, I'm boss. Biggest says wot's wot.”\nHe looks down at you. “'Umie. Dis fing. Strong?”"),
    codex: ["ork_nobz", "ork_kultur"],
    choices: [
      C("“结实得很，头目”", "“Rock solid, boss”", "ork_210", X({renown: 3},
        "斯卡巴德满意地拍了拍盔甲。一块护板掉了下来。所有人都假装没看见。",
        "Skarbad pats the armour, satisfied. A plate falls off. Everyone pretends not to see.")),
      C("“还差一颗够劲的心脏”", "“It still needs a heart with kick”", "ork_210", X({renown: 5, set: {needsReactor: true}},
        "斯卡巴德转向瓦兹格布：“听见没？够劲的！”瓦兹格布看你的眼神多了点什么。",
        "Skarbad turns to Wazgob. “Hear dat? KICK!” Wazgob looks at you a little differently.")),
      C("“它会让您变得更大”", "“It'll make you even bigger”", "ork_210", X({renown: 5, taint: {slaanesh: 15}},
        "斯卡巴德愣住了，然后笑了很久。“更大。”他重复了一遍，像在尝这个词。",
        "Skarbad freezes, then laughs a long time. “Bigger.” He says it again, tasting it."))
    ]};

  N.ork_210 = {chapter: 2, scene: "ork_scrapyard", speaker: S("ork", "兽人小子", "Ork Boy"), time: {d: 2},
    text: L("小子们在试新枪。他们不瞄准，只是开枪，越多越好。\n“更多突突！”一个小子吼。瓦兹格布给每把枪又加了一根枪管。\n测试靶子是一块铁板，和站在铁板旁边扶着它的你。",
            "The boyz are testing new guns. They don't aim. They just shoot, the more the better.\n“MORE DAKKA!” one bellows. Wazgob adds another barrel to every gun.\nThe target is an iron plate, and you, holding it steady."),
    choices: [
      C("站着别动，相信他们打不准", "Stand still. Trust their aim is bad", "ork_301", X({hp: -10, renown: 5},
        "子弹打得到处都是，唯独没打中铁板。你被擦破几处皮，小子们为你的勇气欢呼。",
        "Bullets go everywhere except the plate. You get grazed a few times, and the boyz cheer your nerve.")),
      C("扔下铁板趴下", "Drop the plate and hit the dirt", "ork_301", X({sanity: -5},
        "你趴下的瞬间，铁板被打成了筛子。小子们对你的反应速度表示失望。",
        "The instant you drop, the plate becomes a sieve. The boyz are disappointed by your reflexes."))
    ]};

  /* ============ Chapter 3 · Teef ============ */
  N.ork_301 = {chapter: 3, scene: "ork_fort", speaker: WAZ, time: {d: 20},
    text: L("瓦兹格布第一次给你发工钱：一颗兽人牙，还带着点血。\n“牙币，兽人的钱。掉了还会长，所以谁都有，所以谁都想要更多。”\n堡垒的集市开张了，每个摊子都在吼。",
            "Wazgob pays your first wage: one ork tooth, still a bit bloody.\n“Teef. Ork money. Falls out, grows back. So everyone's got some, so everyone wants more.”\nThe fort's market is open, and every stall is shouting."),
    effects: {renown: 3, hp: 5},
    codex: ["ork_teef"],
    choices: [
      C("去黄月亮部落的摊子逛逛", "Browse the Bad Moon stall", "ork_302"),
      C("去打架坑下注", "Go bet at the fight pit", "ork_304"),
      C("把牙藏好，攒着", "Hide the toof. Save up", "ork_303", X({renown: 2},
        "你把牙缝进了衣角。走到半路，有人拦住了你。",
        "You sew the toof into your hem. Halfway back, someone blocks your way."))
    ]};

  N.ork_302 = {chapter: 3, scene: "ork_fort", speaker: TRADER, time: {h: 2},
    text: L("黄月亮部落的商人满嘴金牙。他们的牙长得比谁都快，所以最有钱。\n摊上有：一把突突枪，一罐“幸运蓝漆”，一只关在笼里的小史奎格。\n“人仔价，”他说，“加倍。”",
            "The Bad Moon trader has a mouthful of gold. Their teef grow fastest, so they're richest.\nOn sale: a shoota, a pot of ‘lucky blue’ paint, a little squig in a cage.\n“'Umie price,” he says. “Double.”"),
    codex: ["ork_klans"],
    choices: [
      C("买那把突突枪", "Buy the shoota", "ork_303", O(Q({stat: "renown", min: 15}), X({renown: -8, set: {gotShoota: true}},
        "枪很重，瞄不准，但很响。兽人说响的枪更准。你开始怀疑他们是对的。",
        "Heavy, inaccurate, LOUD. Orks say loud guns hit more. You begin to suspect they're right."))),
      C("买蓝漆抹在额头上", "Buy blue paint, daub your brow", "ork_303", X({renown: -4, set: {luckyBlue: true}},
        "死头骷部落相信蓝色带来好运。兽人看你的眼神变了：一个懂规矩的人仔。",
        "Deathskulls believe blue is lucky. The orks look at you differently: an 'umie who knows the rules.")),
      C("买下那只小史奎格", "Buy the little squig", "ork_303", X({renown: -4, hp: 5, set: {petSquig: true}},
        "它咬了你一口，然后就认了你。你叫它“抽屉”，因为它总想往里钻。",
        "It bites you once, then decides you're its. You name it Drawer, because it keeps trying to get into one.")),
      C("只看不买", "Just look", "ork_303")
    ]};

  N.ork_303 = {chapter: 3, scene: "ork_fort", speaker: DOK, time: {h: 4},
    text: L("巴兹戈布医生佬拦住了你。“人仔！胳膊伸出来。”\n他另一只手里拿着锯子，桶里泡着几条绿胳膊，有的还在动。\n“兽人的零件，换上更结实，”他热情地说，“免费！医生佬想试试。”",
            "Dok Buzzgob blocks your way. “'Umie! Arm out.”\nHis other hand holds a saw. In a bucket soak several green arms, some still twitching.\n“Ork bitz. Stronger,” he says warmly. “Free! Dok wants to try.”"),
    codex: ["ork_painboyz"],
    choices: [
      C("拔腿就跑", "Run", null, R(0.55, "hp", "ork_305", "ork_306",
        RR("你跑进了人堆。医生佬在后面喊：“下次！”",
           "You lose yourself in the crowd. The Dok calls after you: “Next time!”",
           "你没跑过一个拿着锯子、心情很好的兽人。",
           "You can't outrun an ork with a saw and a good mood."))),
      C("拿牙贿赂他", "Bribe him with teef", "ork_305", O(Q({stat: "renown", min: 8}), X({renown: -5},
        "医生佬咬了咬牙币，确认是真的，挥手放你走了。“下次！”",
        "The Dok bites the toof to check it's real and waves you off. “Next time!”"))),
      C("让他换", "Let him do it", "ork_306", X({sanity: -10},
        "你闭上眼。锯子声很快，缝线很慢。医生佬一直在哼歌。",
        "You shut your eyes. The sawing is quick; the stitching slow. The Dok hums the whole time."))
    ]};

  N.ork_306 = {chapter: 3, scene: "ork_fort", speaker: DOK, time: {d: 2},
    text: L("你醒来时，左手多了一根绿色的手指。它不太听你的，但很有劲。\n医生佬很得意：“没长好就再来！”\n你决定以后绕着他的帐篷走。",
            "You wake with an extra green finger on your left hand. It doesn't quite obey you, but it's strong.\nThe Dok is proud. “If it don't take, we go again!”\nYou resolve to give his tent a wide berth."),
    effects: {hp: -10, set: {orkBitz: true}},
    choices: [
      C("活动一下那根手指", "Flex the new finger", "ork_305", X({sanity: -5, taint: {nurgle: 15}},
        "它自己弯了一下，像在跟你打招呼。伤口闻起来有股蘑菇味。",
        "It bends on its own, as if waving hello. The wound smells faintly of mushrooms."))
    ]};

  N.ork_304 = {chapter: 3, scene: "ork_fort", speaker: null, foe: "ork_nob", time: {h: 3},
    text: L("打架坑里，两个兽人在吵：谁的突突枪更响。\n解决办法很简单：打一架。赢的就是对的。\n观众吼着下注，牙币像雨一样落进坑边的桶里。",
            "In the fight pit two orks are arguing whose shoota is louder.\nThe solution is simple: fight. The winner was right.\nThe crowd roars bets, teef raining into buckets at the rim."),
    codex: ["place_fight_pit", "ork_kultur"],
    choices: [
      C("押个子大的", "Bet on the big one", "ork_303", X({renown: 4},
        "大个子赢了。兽人从不押小的，所以赔率很低，但你赢了。",
        "The big one wins. Orks never back the small one, so the odds are poor. Still, you win.")),
      C("押个子小的", "Bet on the small one", null, R(0.3, null, "ork_307", "ork_303",
        RR("小个子一头撞翻了大个子。全场安静了一秒。",
           "The small one headbutts the big one flat. The whole pit goes silent for a second.",
           "小个子被一拳打出了坑。你的牙落进了别人的桶里。",
           "The small one is punched clean out of the pit. Your toof lands in someone else's bucket."))),
      C("自己跳下去", "Jump in yourself", "ork_303", X({hp: -25, renown: 10, taint: {khorne: 10}},
        "你被揍得很惨，可你站着出来了。兽人们觉得这又好笑又可敬。坑边的血让你心跳很响。",
        "You're beaten badly, but you walk out. The orks find it hilarious and admirable. The blood at the rim makes your heart pound."))
    ]};

  N.ork_307 = {chapter: 3, scene: "ork_fort", speaker: null, time: {h: 1},
    text: L("然后所有兽人都转过头，看着那个押了小个子的人仔。\n桶里的牙，一半归你了。\n这下全堡垒的兽人都认得你了。这不一定是好事。",
            "Then every ork turns to look at the 'umie who backed the small one.\nHalf the bucket is yours.\nNow every ork in the fort knows your face. That's not necessarily good."),
    effects: {renown: 12, sanity: 5},
    choices: [
      C("抱着桶溜走", "Slip away hugging the bucket", "ork_303")
    ]};

  N.ork_305 = {chapter: 3, scene: "ork_fort", speaker: GRUK, time: {d: 1}, eventRoll: 0.35,
    text: L("格鲁卡大老大来巡视了。他是这颗星球上最大的兽人，大到走路时地面都在让路。\n两个小子在他面前吵架。他没听，一个头槌，两个都躺下了。纠纷解决。\n他看见了你。“这是啥？”",
            "Warboss Grukka is making his rounds. He's the biggest ork on the planet, so big the ground makes way.\nTwo boyz are arguing before him. He doesn't listen. One headbutt, both down. Dispute settled.\nHe sees you. “Wot's DAT?”"),
    codex: ["xenos_ork_warboss", "ork_grukka"],
    choices: [
      C("“机械佬的人仔，大老大”", "“Da Mek's 'umie, boss”", "ork_308", X({renown: 3},
        "格鲁卡哼了一声：“瓦兹格布的玩具。”他提到这个名字时，口气不太好。",
        "Grukka snorts. “Wazgob's toy.” He doesn't say the name kindly.")),
      C("讲个笑话", "Tell a joke", null, R(0.45, "sanity", "ork_308", "ork_310",
        RR("你讲了个政委的笑话。格鲁卡笑得一拳打塌了一根柱子。",
           "You tell a commissar joke. Grukka laughs so hard he punches through a pillar.",
           "格鲁卡没笑。兽人不懂讽刺，只懂拳头。",
           "Grukka doesn't laugh. Orks don't do irony. Only fists."))),
      C("跪下", "Kneel", "ork_310", X({renown: -3},
        "兽人不懂下跪。格鲁卡以为你在找掉在地上的东西，帮你找了一会儿，没找到，有点生气。",
        "Orks don't kneel. Grukka thinks you've dropped something and helps look. Finding nothing, he gets annoyed."))
    ]};

  N.ork_310 = {chapter: 3, scene: "ork_fort", speaker: GRUK, foe: "gretchin", time: {h: 1},
    text: L("“人仔有用？证明！”格鲁卡把一个地精仔推到你面前，“打赢它。”\n地精仔比你还害怕，举着一把小刀，刀在抖。\n围观的兽人开始下注。",
            "“'Umie useful? PROVE it!” Grukka shoves a grot in front of you. “Beat it.”\nThe grot is more scared than you. It holds up a little knife. The knife shakes.\nThe watching orks start betting."),
    choices: [
      C("打", "Fight", "ork_308", X({hp: -10, renown: 3, taint: {khorne: 10}},
        "你们在泥里扭成一团。你赢了，大概。地精仔跑了，你的耳朵少了一小块。",
        "You roll together in the mud. You win, probably. The grot runs off; your ear is a little smaller.")),
      C("跟地精仔一起演一场", "Stage a fake fight with the grot", "ork_308", X({renown: 6, sanity: -5},
        "你们打得很响，打得很假。兽人看得很开心，因为兽人不在乎真假，只在乎响不响。",
        "You fight loud and fake. The orks love it: they don't care if it's real, only if it's loud.")),
      C("拒绝", "Refuse", "ork_308", X({hp: -20},
        "格鲁卡不喜欢“不”。他用一根手指把你弹进了泥坑。“软！”",
        "Grukka doesn't like ‘no’. He flicks you into the mud with one finger. “SOFT!”"))
    ]};

  N.ork_308 = {chapter: 3, scene: "manufactorum", speaker: WAZ, time: {d: 2},
    text: L("瓦兹格布听说了大老大的事，把你拉回作坊，第一次跟你说悄悄话。\n“格鲁卡喜欢俺的枪，不喜欢俺。等大亮闪好了，斯卡巴德当老大，俺当大机械佬。”\n兽人的悄悄话，整条街都听得见。",
            "Wazgob hears about the warboss and drags you back to the workshop. For the first time, he whispers.\n“Grukka likes my guns, not me. When Big Shiny's done, Skarbad's boss, I'm Big Mek.”\nAn ork whisper carries the whole street."),
    choices: [
      C("“我能帮什么？”", "“How can I help?”", "ork_311", X({renown: 3, set: {mekLoyal: true}},
        "瓦兹格布咧嘴一笑：“活着。别被吃了。”",
        "Wazgob grins. “Stay alive. Don't get eaten.”")),
      C("“格鲁卡会杀了你。”", "“Grukka will kill you.”", "ork_311", X({sanity: -5},
        "“当然！”瓦兹格布很高兴，“要么俺杀了他。都好！”",
        "“Course!” Wazgob is delighted. “Or I kill him. Both good!”"))
    ]};

  N.ork_311 = {chapter: 3, scene: "ork_fort", speaker: EDNA, time: {d: 3},
    text: L("奴隶圈里还关着几十个人类，替兽人拣弹壳、喂史奎格。领头的是老埃德娜，从前在船坞教堂扫地。\n“孩子，在机械佬那儿吃得饱吗？”她塞给你一小块面包，“帝皇看着呢。”",
            "Dozens of humans are still penned here, picking up shell casings and feeding squigs. Their leader is Old Edna, who once swept the dockyard chapel.\n“Eating enough at the Mek's, child?” She presses a crust into your hand. “The Emperor sees.”"),
    choices: [
      C("收下面包，跟她念一段祷文", "Take the bread and pray with her", "ork_401", X({sanity: 10, taint: {all: -15}},
        "你很久没念过祷文了。念到一半，你发现自己记得每一个字。",
        "You haven't prayed in a long time. Halfway through you find you remember every word.")),
      C("把面包还给她", "Give the bread back", "ork_401", X({sanity: 5, hp: -3},
        "“您更需要。”埃德娜看着你，眼睛湿了一下。“帝皇看见了。”",
        "“You need it more.” Edna looks at you, eyes wet for a moment. “The Emperor saw that.”")),
      C("“帝皇在哪儿？”", "“Where is the Emperor?”", "ork_401", X({sanity: -5, taint: {tzeentch: 20}},
        "埃德娜没有回答。她继续拣弹壳，嘴唇一直在动。",
        "Edna doesn't answer. She goes on picking up casings, lips moving all the while.")),
      C("一把抢走她手里的面包", "Snatch the bread out of her hand", "ork_401", X({hp: 8, set: {wronged_edna: true}},
        "面包很硬。老埃德娜没喊，只把空了的手慢慢缩回袖子里。周围的奴隶都看着你，没人说话。",
        "The bread is hard. Old Edna doesn't cry out; she draws her empty hand slowly into her sleeve. The slaves all watch you. Nobody speaks."))
    ]};

  /* ============ Chapter 4 · Da Green Tide ============ */
  N.ork_401 = {chapter: 4, scene: "ruins", speaker: null, time: {d: 90}, effects: {hp: 15, sanity: 5},
    text: L("三个月过去了。旧居住区的地下室长满了蘑菇，蘑菇底下又长出了别的东西。\n你亲眼看见一个兽人从土里爬出来，抖掉泥巴，捡起钢管，就去找架打了。\n它出生还不到一分钟。",
            "Three months pass. The old hab cellars fill with mushrooms, and under the mushrooms grow other things.\nYou watch an ork climb out of the earth, shake off the soil, pick up a pipe and go looking for a fight.\nIt is less than a minute old."),
    codex: ["ork_spores"],
    choices: [
      C("走近看看", "Take a closer look", "ork_402", X({sanity: -5, taint: {nurgle: 25}},
        "土里还埋着十几个，正在慢慢长。一个地精仔在给它们浇水，像在照料菜园。",
        "A dozen more lie buried, slowly growing. A grot is watering them like a vegetable patch.")),
      C("赶紧走开", "Walk away quickly", "ork_402", X({sanity: -3},
        "你走得很快。脚下的土软软的，好像有什么在翻身。",
        "You walk fast. The ground underfoot is soft, as if something is rolling over.")),
      C("用喷灯烧掉这片", "Burn the patch with a blowtorch", "ork_402", X({hp: -5, renown: -3, set: {burnedSpores: true}, taint: {nurgle: -10}},
        "火烧了一整夜。兽人以为是庆典，围着火唱歌。只有瓦兹格布若有所思地看着你。",
        "It burns all night. The orks think it's a party and sing round the fire. Only Wazgob watches you, thoughtful."))
    ]};

  N.ork_402 = {chapter: 4, scene: "ork_scrapyard", speaker: HALE, time: {d: 2},
    text: L("你在废料里翻出一台还能用的通讯器，里面传来一个冷硬的声音。\n“我是黑尔政委。伊斯卡隆没有沦陷，只是暂时被占。”\n“你在机械佬身边。我要你的眼睛，你的手，必要时，你的命。”",
            "In the scrap you find a working vox-unit. A cold, hard voice comes through.\n“This is Commissar Hale. Iskaron has not fallen. It is temporarily occupied.”\n“You're close to the Mek. I want your eyes, your hands, and if need be, your life.”"),
    codex: ["imp_commissar", "imp_imperium"],
    choices: [
      C("“我听您的，政委。”", "“I'm yours, Commissar.”", "ork_403", X({set: {resistance: true}},
        "“很好。”通讯器沉默了一会儿，“记住，帝皇在看着你。我也在。”",
        "“Good.” The vox goes quiet a moment. “Remember, the Emperor is watching you. So am I.”")),
      C("把通讯器交给瓦兹格布", "Hand the vox to Wazgob", "ork_406", X({renown: 8, set: {snitched: true}, taint: {khorne: 15}},
        "瓦兹格布听完，眼睛亮了。“打架！更多打架！”他立刻去喊小子们。",
        "Wazgob listens and his eyes light up. “A FIGHT! MORE FIGHTS!” He's off to fetch the boyz.")),
      C("关掉它，埋回废料堆", "Switch it off and bury it", "ork_405", X({sanity: -5},
        "你把它埋进铁屑里。那天夜里你一直听见它在响，其实它没响。",
        "You bury it in iron filings. All night you hear it crackle. It doesn't."))
    ]};

  N.ork_403 = {chapter: 4, scene: "manufactorum", speaker: null, time: {d: 3},
    text: L("政委要你给大亮闪的动力管线动手脚：不必炸掉，只要它在要紧时候熄火。\n你半夜溜到盔甲底下。斯纳吉特睡在它脚边，鼾声像漏气的轮胎。\n钳子在你手里很沉。",
            "The commissar wants Da Big Shiny's power lines tampered with. No bang. Just make it die when it matters.\nYou creep under the armour at midnight. Snaggit sleeps at its feet, snoring like a leaking tyre.\nThe pliers are heavy in your hand."),
    choices: [
      C("剪断一根，接成假线", "Cut a line, fake the join", null, O({effects: {set: {sabotaged: true}}}, R(0.5, "sanity", "ork_404", "ork_407",
        RR("你剪得很轻，接得很像。斯纳吉特翻了个身，接着打鼾。",
           "You cut softly and the fake join looks right. Snaggit rolls over, still snoring.",
           "钳子“咔”地响了一声。鼾声停了。",
           "The pliers go *snick*. The snoring stops.")))),
      C("只画下动力舱的位置", "Just map where the power core sits", "ork_404", X({set: {mapped: true}},
        "你把位置刻在一块铁皮背面。政委会满意的，大概。",
        "You scratch its position on the back of a tin plate. The commissar will be pleased. Probably.")),
      C("改主意，回去睡觉", "Change your mind. Go back to bed", "ork_405", X({sanity: -5, unset: ["resistance"]},
        "你把钳子放回原处。第二天，通讯器再也没响过。",
        "You put the pliers back. The vox never crackles again."))
    ]};

  N.ork_407 = {chapter: 4, scene: "manufactorum", speaker: SNAG, time: {h: 1},
    text: L("斯纳吉特睁开一只眼。\n他看看你手里的钳子，又看看被你剪断的线。\n“俺啥都没看见，”他慢慢地说，“不过俺的嘴，要三颗牙才能闭得更紧。”",
            "Snaggit opens one eye.\nHe looks at the pliers in your hand, then at the cut line.\n“I didn't see nuffin',” he says slowly. “But my mouth shuts tighter for free teef.”"),
    choices: [
      C("给他牙", "Pay him", "ork_404", O(Q({stat: "renown", min: 5}), {grudge: {npc: "snaggit", effects: {renown: -6}, note: L("斯纳吉特还记着你告过他的状，封口费要翻倍。", "Snaggit remembers you snitched on him. The hush price doubles.")}}, X({renown: -5, set: {forgiven_snaggit: true}},
        "斯纳吉特把牙一颗颗咬过，满意地翻了个身。“晚安，人仔。”",
        "Snaggit bites each toof in turn and rolls over, satisfied. “Night, 'umie.”"))),
      C("求他", "Beg him", "ork_404", O(Q({flag: "snagFriend"}, true), X({sanity: 5},
        "斯纳吉特叹了口气：“你给过俺吃的。”他闭上眼，“俺打呼噜很响，听不见剪东西。”",
        "Snaggit sighs. “You fed me once.” He shuts his eyes. “I snore loud. Can't hear no snippin'.”"))),
      C("威胁他", "Threaten him", "ork_404", X({hp: -10, set: {snagGrudge: true, wronged_snaggit: true}},
        "你们扭在一起，他咬你，你掐他。最后他跑了，留下一句：“地精会记仇的！”",
        "You grapple; he bites, you throttle. At last he flees, shouting: “Grots remember!”"))
    ]};

  N.ork_404 = {chapter: 4, scene: "ruins", speaker: VOSS, time: {d: 4},
    text: L("抵抗军藏在旧教堂的地窖里，二十来个人，三支枪。沃斯中士少了一只眼，可还是那么站着。\n“舰队会来的，政委这么说。在那之前，得让绿皮一直往错的地方打。”\n他塞给你一枚信号弹。",
            "The resistance hides in the old chapel crypt: twenty-odd people, three rifles. Sergeant Voss has lost an eye but still stands the same way.\n“The fleet's coming. The commissar says so. Till then, keep the greenskins hitting the wrong places.”\nHe presses a flare into your hand."),
    effects: {set: {flare: true}},
    choices: [
      C("“中士，是我。”", "“Sergeant. It's me.”", "ork_405", O(Q({flag: "origin_guard"}, true), X({sanity: 10, set: {vossTrust: true}},
        "沃斯盯着你看了很久，然后抱住了你，抱得很重。“我以为整个排都没了。”",
        "Voss stares a long time, then hugs you hard. “I thought the whole platoon was gone.”"))),
      C("交出你画的位置图", "Hand over your map", "ork_405", O(Q({flag: "mapped"}, true), X({set: {vossTrust: true}},
        "沃斯把铁皮摊在棺材盖上，看了很久。“这值一百条命。”他说的是绿皮的命。",
        "Voss lays the tin on a coffin lid and studies it. “That's worth a hundred lives.” Greenskin lives, he means."))),
      C("收好信号弹", "Pocket the flare", "ork_405", X({hp: -5},
        "“堡垒的门打开那天，打响它。”回去的路上，你差点被巡逻的小子撞见。",
        "“The day the fort's gate opens, fire it.” On the way back you nearly walk into a patrol."))
    ]};

  N.ork_405 = {chapter: 4, scene: "manufactorum", speaker: WAZ, time: {d: 5},
    text: L("瓦兹格布给了你一样东西：三个地精仔，归你管。\n“你是监工了。它们偷懒，你踢。它们偷东西，踢两下。”\n三个地精仔仰头看你。那眼神你很熟悉：几个月前，你就是这么看兽人的。",
            "Wazgob gives you something: three grots of your own.\n“You're boss of dese. Dey slack, you kick. Dey steal, kick twice.”\nThree grots look up at you. You know that look: it's how you looked at orks months ago."),
    effects: {renown: 5},
    choices: [
      C("踢一脚立威", "Kick one to set the tone", "ork_408", X({renown: 5, sanity: -5, taint: {khorne: 10}},
        "地精们立刻干活，干得很好。你的脚有点疼，心里也有点。",
        "The grots jump to work and work well. Your foot aches a little. So does something else.")),
      C("分给它们口粮", "Share your rations with them", "ork_408", X({hp: -5, sanity: 5, set: {grotCrew: true}},
        "地精们愣住了，然后把口粮藏起来，像藏一个秘密。从那以后，它们干活时总哼着歌。",
        "The grots freeze, then hide the food like a secret. From then on they hum while they work."))
    ]};

  N.ork_406 = {chapter: 4, scene: "ruins", speaker: SKAR, time: {h: 6},
    text: L("小子们在旧教堂的地窖里找到了抵抗军。仗打得很短：兽人比人多，也比人高兴。\n斯卡巴德把一面帝国旗帜披在肩上当披风。\n“好人仔！”他拍你的背，“下回有架打，先告诉俺！”",
            "The boyz find the resistance in the old chapel crypt. It's short: more orks than people, and the orks are having more fun.\nSkarbad wears an Imperial banner as a cape.\n“Good 'umie!” He slaps your back. “Next fight, tell me first!”"),
    effects: {sanity: -10, renown: 5, set: {betrayedResistance: true}},
    choices: [
      C("别过脸去", "Look away", "ork_405", X({sanity: -3},
        "你没看地窖里还剩什么。你只听见有个声音一直在念帝皇的名字，后来不念了。",
        "You don't look at what's left in the crypt. You only hear a voice reciting the Emperor's name, until it stops.")),
      C("跟着笑", "Laugh along", "ork_405", X({renown: 5, corruption: 5, taint: {khorne: 10}},
        "你笑出了声，小子们笑得更响。你不知道自己在笑什么。",
        "You laugh out loud; the boyz laugh louder. You don't know what you're laughing at."))
    ]};

  N.ork_408 = {chapter: 4, scene: "ork_scrapyard", speaker: WAZ, time: {d: 10}, eventRoll: 0.35,
    text: L("大亮闪缺一颗心脏：一台真正够劲的反应堆。\n瓦兹格布听说，那艘坠毁的瓦尔达什一税船底舱里，还有一台没碎的。\n“人仔，你认得人仔的船，”他说，“你带路。”",
            "Da Big Shiny needs a heart: a reactor with real kick.\nWazgob has heard the wrecked Valda tithe ship still holds one, unbroken, in its lower hold.\n“'Umie. You know 'umie ships,” he says. “You lead.”"),
    codex: ["place_valda_wreck"],
    choices: [
      C("带路，走最稳的通道", "Lead them by the safest passage", "ork_409", X({renown: 5, hp: -5},
        "拆了一整天。反应堆拖出来时还在发热，瓦兹格布抱着它，像抱一窝蛋。",
        "A whole day's work. The reactor comes out still warm; Wazgob hugs it like a clutch of eggs.")),
      C("“这船我卖过零件”", "“I've sold parts off this ship”", "ork_409", O(Q({flag: "origin_scrap"}, true), X({renown: 10},
        "你记得这艘船的每一根肋骨。三个小时，反应堆出舱，没死一个小子。",
        "You remember every rib of this ship. Three hours, reactor out, not one boy lost."))),
      C("故意带进辐射舱", "Lead them through the hot compartment", "ork_409", O(Q({flag: "resistance"}, true), X({hp: -15, set: {hotReactor: true}},
        "大家都吃了一肚子辐射。兽人毫不在意，你很在意。反应堆的读数从此不太对。",
        "Everyone soaks up rads. The orks don't care. You do. The reactor's readings are never quite right after.")))
    ]};

  N.ork_409 = {chapter: 4, scene: "manufactorum", speaker: WAZ, time: {d: 4},
    text: L("瓦兹格布把反应堆塞进大亮闪的胸口，接好线，退后三步，又退后三步。\n“人仔，按按钮。”\n“为什么是我？”\n“因为俺不想炸。”",
            "Wazgob crams the reactor into Da Big Shiny's chest, wires it up, steps back three paces, then three more.\n“'Umie. Press da button.”\n“Why me?”\n“'Cos I don't wanna blow up.”"),
    choices: [
      C("按下按钮", "Press it", "ork_501", X({hp: -10, renown: 5},
        "反应堆轰地活了。你被震飞三米，眉毛没了。瓦兹格布抱着盔甲跳舞。",
        "The reactor roars alive. You're thrown three metres and lose your eyebrows. Wazgob dances with the armour.")),
      C("让斯纳吉特去按", "Make Snaggit do it", "ork_501", X({renown: 3, sanity: -5, set: {wronged_snaggit: true}},
        "斯纳吉特按了，飞了，落地，爬起来骂了一整天。反应堆运转良好。",
        "Snaggit presses it, flies, lands, and swears all day. The reactor runs fine.")),
      C("按之前悄悄调低读数", "Quietly detune it first", "ork_501", O(Q({flag: "hotReactor"}, true), X({hp: -5, set: {shinyDead: true}},
        "反应堆活了，嗡嗡声低了半个调。只有你听得出来。",
        "It comes alive, humming half a tone low. Only you can hear it.")))
    ]};

  /* ============ Chapter 5 · Da Weirdboy ============ */
  N.ork_501 = {chapter: 5, scene: "ork_fort", speaker: ZOG, time: {d: 7},
    text: L("怪小子佐格拉克被两个兽人用铜杆牵着走进堡垒。他的脑袋冒着绿烟，眼睛里有闪电。\n周围越吵，他越难受；打得越凶，他头顶越亮。\n“太……吵……了，”他呻吟，“全是……Waaagh！”",
            "Zograk the Weirdboy is led into the fort by two orks with copper poles. His head smokes green; lightning crawls in his eyes.\nThe louder it gets, the worse he feels; the harder they fight, the brighter he glows.\n“Too… loud…” he moans. “All… WAAAGH!”"),
    codex: ["ork_weirdboyz", "xenos_waaagh"],
    choices: [
      C("递给他一块湿布", "Offer him a wet rag", "ork_502", X({sanity: -5, set: {zogFriend: true}, taint: {tzeentch: 20}},
        "他把布盖在头上，布“嘶”地一声干了。“好人仔，”他喃喃，“安静的人仔。”",
        "He drapes it on his head; it hisses dry. “Good 'umie,” he murmurs. “Quiet 'umie.”")),
      C("离他远点", "Keep your distance", "ork_502", X({sanity: 5},
        "牵铜杆的兽人告诉你：上一个离他太近的，脑袋现在挂在大门上。",
        "A pole-minder tells you the last one who stood too close is hanging on the gate. The head, anyway.")),
      C("问他看见了什么", "Ask what he sees", "ork_502", X({sanity: -5, taint: {tzeentch: 30}},
        "他转过头，眼里的闪电映出你看不懂的东西。“俺看见……两个大的。”",
        "He turns; the lightning in his eyes shows things you can't parse. “I see… two big 'uns.”"))
    ]};

  N.ork_502 = {chapter: 5, scene: "ork_fort", speaker: GODS, time: {h: 1},
    text: L("佐格拉克抓住你的手腕。一瞬间，你看见云里站着两个巨大的绿色影子，没有脸，只有拳头和笑声。\n一个很凶，但很狡猾。一个很狡猾，但很凶。\n兽人的神只想要一样东西：好仗。",
            "Zograk grabs your wrist. For an instant you see two vast green shapes in the clouds: no faces, only fists and laughter.\nOne is brutal, but kunnin'. One is kunnin', but brutal.\nThe ork gods want only one thing: a good fight."),
    effects: {sanity: -5},
    codex: ["ork_gork_mork"],
    choices: [
      C("“哪个是戈克，哪个是莫克？”", "“Which one's Gork? Which is Mork?”", "ork_503", X({renown: 3},
        "佐格拉克认真想了很久：“看你问谁。问错了会挨揍。”",
        "Zograk thinks hard. “Depends who ya ask. Ask wrong, get krumped.”")),
      C("闭上眼", "Shut your eyes", "ork_503", X({sanity: 5},
        "闭眼也没用，影子还在。但它们没注意你。对神来说，你太小，打不了架。",
        "Closing your eyes doesn't help; they're still there. But they don't notice you. Too small to fight."))
    ]};

  N.ork_503 = {chapter: 5, scene: "ork_fort", speaker: ZOG, time: {d: 1}, eventRoll: 0.35,
    text: L("佐格拉克说起了“先知”：一个脑袋被打穿的大兽人，医生佬给他换了块铁的，从此戈克和莫克就在他脑子里说话。\n“先知要来了，”怪小子眼睛冒光，“他的大Waaagh!要来了。”",
            "Zograk speaks of da Prophet: a great ork shot through the head, whose dok gave him a metal one. Since then Gork and Mork talk inside his skull.\n“Da Prophet's comin',” the Weirdboy says, eyes blazing. “His big Waaagh!'s comin'.”"),
    codex: ["ork_ghazghkull", "ork_great_waaagh"],
    choices: [
      C("“先知叫什么？”", "“What's the Prophet's name?”", "ork_504", X({sanity: -5},
        "“加兹库尔！”周围的兽人一起吼出这个名字，房顶的灰都震了下来。",
        "“GHAZGHKULL!” Every ork around roars the name. Dust shakes from the roof.")),
      C("把这些刻在铁皮上", "Scratch it all onto tin", "ork_504", X({renown: 3, taint: {tzeentch: 20}},
        "刻完你才发现，周围的铁皮上早就刻满了同一个名字，写法五花八门。",
        "Only when you finish do you notice the tin all around is already covered in the same name, spelled a hundred ways.")),
      C("问先知去过哪里", "Ask where the Prophet has been", "ork_504", X({sanity: -5},
        "“阿玛吉顿！打了两回！打得可爽了！”佐格拉克笑着说，“下一个，这儿。”",
        "“Armageddon! Twice! Best fightin' ever!” Zograk laughs. “Next, 'ere.”"))
    ]};

  N.ork_504 = {chapter: 5, scene: "ork_fort", speaker: null, foe: "ork_weirdboy", time: {d: 3},
    text: L("小子们打了一整夜架。佐格拉克的脑袋亮得像一颗绿太阳。\n牵铜杆的兽人跑了。他在膨胀，在尖叫，在往外漏闪电。\n你离他只有十步。",
            "The boyz have brawled all night. Zograk's head glows like a green sun.\nThe pole-minders have fled. He's swelling, shrieking, leaking lightning.\nYou're ten paces away."),
    choices: [
      C("趴下", "Hit the ground", null, R(0.5, "hp", "ork_506", "ork_505",
        RR("闪电从你头顶扫过，烧焦了一排兽人的头发。它们觉得很好玩。",
           "Lightning sweeps over you, singeing a row of orks. They think it's great.",
           "你趴得不够低。",
           "You don't get low enough."))),
      C("把铜杆插进他脚边的地里", "Drive a copper pole into the ground by him", "ork_506", X({renown: 8, hp: -10},
        "铜杆引走了一半闪电。另一半从你头顶飞过，把一个吵闹的兽人变成了一缕安静的烟。",
        "The pole earths half the lightning. The other half flies over you and turns a noisy ork into a quiet wisp of smoke.")),
      C("转身跑", "Turn and run", "ork_505", X({sanity: -5},
        "你跑得不够快。没人跑得够快。",
        "You don't run fast enough. Nobody does."))
    ]};

  N.ork_505 = {chapter: 5, scene: "ork_fort", speaker: null, time: {h: 2},
    text: L("绿光吞没了一切。恍惚间，你看见一片极古老的战场：绿皮的祖先在替早已消失的造物主打一场天上的仗。\n你醒来时头发全竖着，嘴里有铁锈味。\n佐格拉克躺在冒烟的坑里打鼾，很舒服的样子。",
            "Green light swallows everything. In a daze you see an ancient battlefield: the greenskins' ancestors fighting a war in the heavens for creators long vanished.\nYou wake with your hair on end, tasting rust.\nZograk snores in a smoking crater, looking comfortable."),
    effects: {hp: -15, sanity: -5, taint: {tzeentch: 20}},
    codex: ["ork_krork"],
    choices: [
      C("爬起来", "Get up", "ork_506")
    ]};

  N.ork_506 = {chapter: 5, scene: "ork_scrapyard", speaker: WAZ, time: {d: 6},
    text: L("瓦兹格布有了个点子：“人仔能不能也让东西变快？”\n他递给你一桶红漆、一辆破摩托。“刷。然后信。使劲信。”\n小子们围过来看热闹。",
            "Wazgob has an idea. “Can 'umies make fings go fasta too?”\nHe hands you a pot of red paint and a wrecked bike. “Paint. Den believe. Believe 'ARD.”\nThe boyz gather to watch."),
    choices: [
      C("刷，然后真心相信", "Paint it, and truly believe", "ork_507", X({sanity: -15, renown: 8, taint: {tzeentch: 25}},
        "你信了，真的信了。摩托快了一点点，也许是因为旁边五十个兽人也在信。你不敢细想。",
        "You believe. You really do. The bike is a touch faster, maybe because fifty orks beside you believe too. You daren't think about it.")),
      C("刷，但心里不信", "Paint it, but don't believe", "ork_507", X({renown: -3},
        "摩托跑得和灰的一样慢。瓦兹格布失望地拍拍你的头：“人仔不行。脑子太小。”",
        "The bike is as slow as a grey one. Wazgob pats your head, disappointed. “'Umies can't. Brains too small.”")),
      C("刷成蓝色", "Paint it blue", "ork_507", O(Q({flag: "luckyBlue"}, true), X({renown: 6, hp: 5},
        "摩托没变快，可它翻车时你毫发无伤。几个死头骷部落的小子鼓起了掌。",
        "The bike's no faster, but when it flips you walk away without a scratch. A few Deathskull boyz applaud.")))
    ]};

  N.ork_507 = {chapter: 5, scene: "ork_fort", speaker: ZOG, time: {d: 2},
    text: L("佐格拉克醒过来后，一直盯着你看。\n“人仔，”他突然问，“戈克还是莫克？”\n周围的兽人全安静了。看来这个问题很要紧。",
            "Since he woke, Zograk has been staring at you.\n“'Umie,” he says suddenly. “Gork or Mork?”\nEvery ork nearby goes silent. Apparently this matters."),
    choices: [
      C("“戈克！”", "“Gork!”", "ork_601", X({hp: -5, set: {gork: true}, taint: {khorne: 15}},
        "一半兽人欢呼，另一半揍了你一拳。佐格拉克满意地点头：“对。也不对。”",
        "Half the orks cheer; the other half punch you. Zograk nods, satisfied. “Right. And wrong.”")),
      C("“莫克！”", "“Mork!”", "ork_601", X({hp: -5, set: {mork: true}},
        "另一半兽人欢呼，这一半揍了你一拳。佐格拉克满意地点头：“对。也不对。”",
        "The other half cheer; this half punch you. Zograk nods, satisfied. “Right. And wrong.”")),
      C("“两个都是。”", "“Both.”", "ork_601", X({renown: 5},
        "兽人们愣住了，然后一齐大笑。佐格拉克说：“这人仔，脑子里有点绿。”",
        "The orks gape, then all laugh at once. Zograk says: “Dis 'umie's got a bit of green in 'is 'ead.”"))
    ]};

  /* ============ Chapter 6 · Uninvited Guests ============ */
  N.ork_601 = {chapter: 6, scene: "burning_city", speaker: null, foe: "heretic_astartes", time: {d: 30}, effects: {hp: 10},
    text: L("一个月后，天上裂开一道血红的口子。一艘缠满尖刺的战舰撞进了伊斯卡隆的大气层。\n下来的是穿红甲的巨人，盔甲上挂满头骨。他们是来收更多头骨的。\n兽人们看着他们，眼睛全亮了：“好架！”",
            "A month later the sky splits open, blood red. A warship wrapped in spikes plunges into Iskaron's air.\nOut come giants in red armour hung with skulls. They've come to collect more.\nThe orks watch them and every eye lights up. “GOOD FIGHT!”"),
    codex: ["chaos_heretic_astartes", "chaos_gods"],
    choices: [
      C("跟着兽人冲过去", "Charge with the orks", "ork_602", X({hp: -10, taint: {khorne: 10}},
        "你不知道自己为什么也在跑。周围全是吼声，你的吼声也在里面。",
        "You don't know why you're running too. The roaring is everywhere, and yours is in it.")),
      C("留在作坊帮机械佬", "Stay and help the Mek", "ork_603", X({renown: 3},
        "瓦兹格布在给小子们的枪加火力。“更多突突！给他们更多突突！”",
        "Wazgob is souping up the boyz's guns. “More dakka! Give 'em MORE DAKKA!”")),
      C("躲进地下室", "Hide in a cellar", "ork_603", X({sanity: -5},
        "地下室里挤满了地精仔。它们给你让了个位置，然后一起发抖。",
        "The cellar is packed with grots. They make room for you, then all shiver together."))
    ]};

  N.ork_602 = {chapter: 6, scene: "burning_city", speaker: null, foe: "heretic_astartes", time: {h: 3},
    text: L("红甲狂战士和兽人撞在一起，双方都在笑。\n你看懂了一件可怕的事：血神不在乎血是谁的。兽人在打，狂战士在打，他都高兴。\n一把斧头转向了你。",
            "Red berserkers and orks crash together. Both sides are laughing.\nYou grasp something terrible: the Blood God doesn't care whose blood it is. Orks fight, berserkers fight; he's pleased either way.\nAn axe turns your way."),
    codex: ["god_khorne", "ork_good_fight"],
    choices: [
      C("滚进弹坑", "Roll into a shell crater", null, R(0.5, "hp", "ork_603", "ork_605",
        RR("斧头砍进了你刚才站的地方。弹坑里很挤，有个地精仔，还有一只很生气的史奎格。",
           "The axe bites where you stood. The crater is crowded: a grot and a very angry squig.",
           "你没滚够远。",
           "You don't roll far enough."))),
      C("躲到一个头目身后", "Duck behind a nob", "ork_603", X({hp: -10, renown: 3},
        "头目替你挡了一斧，高兴地回了一拳。他根本没注意身后有你。",
        "The nob takes the axe for you and happily punches back. He never noticed you were there.")),
      C("捡起一把链锯斧", "Grab a fallen chainaxe", "ork_603", X({hp: -15, corruption: 10, taint: {khorne: 15}},
        "斧头比你重，可挥起来很顺手，太顺手了。打完以后，你很久没能松开手指。",
        "It's heavier than you, yet it swings so easily. Too easily. Afterwards your fingers won't let go for a long time."))
    ]};

  N.ork_603 = {chapter: 6, scene: "ork_scrapyard", speaker: CULT, time: {h: 6},
    text: L("一个披着红布的人类在废料堆里找到了你。他也是奴隶，曾经是。\n“兽人把我们当工具。血神不一样，他只要你拿起刀。谁的血都行，兽人的也行。”\n他递过来一把刻着记号的匕首。",
            "A human in red rags finds you among the scrap. A slave too, once.\n“Orks treat us as tools. The Blood God's different. He only asks that you pick up a blade. Any blood will do. Ork blood too.”\nHe holds out a dagger carved with a mark."),
    choices: [
      C("接过匕首", "Take the dagger", "ork_604", X({corruption: 10, renown: 3, set: {bloodDagger: true}, taint: {khorne: 20}},
        "匕首是温的。你把它藏进靴子。那夜你梦见一个铜色的王座，底下堆满了东西。",
        "The dagger is warm. You hide it in your boot. That night you dream of a brass throne with things piled at its foot.")),
      C("把他交给兽人", "Hand him to the orks", "ork_604", X({renown: 6, sanity: -5},
        "小子们很高兴：又一个能打的！他们把他扔进了打架坑。他打得很好，打了很久。",
        "The boyz are thrilled: another fighter! Into the pit he goes. He fights well, and for a long time.")),
      C("拒绝，走开", "Refuse and walk away", "ork_604", X({sanity: -5},
        "他在身后说：“你会回来的。每个人都会。”你没回头。",
        "Behind you he says: “You'll come back. Everyone does.” You don't look round."))
    ]};

  N.ork_605 = {chapter: 6, scene: "ruins", speaker: DOK, time: {h: 5},
    text: L("一斧头。你只记得这么多。\n醒来时，巴兹戈布医生佬正在你身上忙活，嘴里哼着歌。\n“好消息：人仔还活着。坏消息：零件不够。不过俺有兽人的！”",
            "One axe. That's all you remember.\nWhen you wake, Dok Buzzgob is busy on you, humming.\n“Good news: 'umie's alive. Bad news: not enough bitz. But I got ORK ones!”"),
    effects: {hp: -15},
    codex: ["ork_painboyz"],
    choices: [
      C("“别！”", "“Don't!”", "ork_603", X({hp: -5},
        "医生佬叹了口气，只用了线和订书钉。你活了，难看地活了。",
        "The Dok sighs and uses only thread and staples. You live. Ugly, but you live.")),
      C("“……用吧。”", "“…Do it.”", "ork_603", X({hp: 25, sanity: -5, set: {orkBitz: true}, taint: {nurgle: 20}},
        "醒来时，你身体里多了些绿色的东西。它们不疼，很有劲，偶尔会自己想打架。",
        "You wake with green things inside you. They don't hurt, they're strong, and sometimes they want a fight on their own.")),
      C("“再多换点。”", "“Give me more.”", "ork_603", O(Q({flag: "orkBitz"}, true), X({hp: 35, sanity: -15, set: {moreBitz: true}, taint: {nurgle: 20}},
        "医生佬欢呼起来。这回他换得更多。你照镜子时，已经不太确定镜子里是谁。",
        "The Dok whoops. This time he swaps more. In the mirror, you're no longer sure who's looking back.")))
    ]};

  N.ork_604 = {chapter: 6, scene: "burning_city", speaker: SKAR, time: {d: 2},
    text: L("仗打完了。红甲巨人的船被小子们拆光，零件已经摆上了三个机械佬的摊子。\n斯卡巴德扛着一个狂战士的头盔，当酒杯用。\n“那帮红的，打得好！”他意犹未尽，“希望他们再来！”",
            "The fight's over. The red giants' ship has been stripped by the boyz; its parts are already on three Meks' stalls.\nSkarbad drinks from a berserker's helmet.\n“Dem red 'uns fought GOOD!” he says, wistful. “Hope dey come back!”"),
    choices: [
      C("在战场上捡件战利品", "Pick up a trophy on the field", "ork_606", X({renown: 5, set: {chaosRelic: true}, taint: {khorne: 10}},
        "一个刻着记号的护符，在你手里嗡嗡作响，像一颗不属于你的心跳。",
        "A carved amulet that hums in your hand like a heartbeat that isn't yours.")),
      C("帮地精仔收拾尸体", "Help the grots clear the dead", "ork_606", X({sanity: -5, hp: 5},
        "地精们把死兽人拖进蘑菇地。“明年，”一个地精说，“这儿会长出好多小子。”",
        "The grots drag dead orks into the mushroom fields. “Next year,” one says, “loadsa boyz 'ere.”")),
      C("回作坊", "Back to the workshop", "ork_606")
    ]};

  N.ork_606 = {chapter: 6, scene: "manufactorum", speaker: WAZ, time: {d: 10}, eventRoll: 0.3,
    text: L("瓦兹格布把红甲战舰的零件全用上了。大亮闪现在浑身尖刺，能喷火，胸口装着瓦尔达的反应堆。\n“就差一样，”他说，“一个好名字。”\n他看着你，等你开口。",
            "Wazgob has used every part off the red warship. Da Big Shiny now bristles with spikes and flamers, the Valda reactor in its chest.\n“Just one fing missin',” he says. “A good name.”\nHe looks at you, waiting."),
    choices: [
      C("“大亮闪·终极版”", "“Big Shiny: Ultimate Edition”", "ork_607", X({renown: 3},
        "瓦兹格布念了三遍，不满意。“太短。”他自己又加了四个词。",
        "Wazgob says it three times, unhappy. “Too short.” He adds four more words himself.")),
      C("“格鲁卡的末日”", "“Grukka's Doom”", "ork_607", X({renown: 6, taint: {khorne: 15}},
        "他用红漆把这几个字刷在胸甲上，写反了。斯卡巴德说正好，格鲁卡看得懂。",
        "He paints it on the chestplate in red, backwards. Skarbad says perfect: Grukka reads backwards anyway.")),
      C("把嗡嗡响的护符装上去", "Mount the humming amulet on it", "ork_607", O(Q({flag: "chaosRelic"}, true), X({renown: 5, set: {relicArmour: true}, taint: {khorne: -25}},
        "护符一离手，你的心跳就静了下来。盔甲却开始嗡嗡响。瓦兹格布很喜欢这个声音。",
        "The moment the amulet leaves your hand your heartbeat settles. The armour starts humming. Wazgob loves the sound.")))
    ]};

  N.ork_607 = {chapter: 6, scene: "ork_scrapyard", speaker: SNAG, time: {d: 3},
    grudgeLine: {npc: "snaggit", text: L("斯纳吉特死盯着你，手里攥着一颗牙，像在数你欠的账。", "Snaggit glares at you, clutching a toof, as if counting up what you owe.")},
    text: L("斯纳吉特在开会。几十个地精仔挤在油桶后面，商量怎么推翻兽人。\n“俺们人多！”斯纳吉特说，“人仔也来，人仔聪明。”\n就在这时，一个兽人打着哈欠走了过来。",
            "Snaggit is holding a meeting. Dozens of grots crowd behind an oil drum, plotting to overthrow the orks.\n“We got numbers!” Snaggit says. “'Umie too. 'Umie's clever.”\nJust then an ork wanders past, yawning."),
    codex: ["ork_gretchin"],
    choices: [
      C("给它们出个主意", "Give them a plan", "ork_608", O({grudge: {npc: "snaggit", effects: {hp: -4}, note: L("斯纳吉特记着旧账，转头就把你的计划报给了路过的兽人。", "Snaggit remembers the old score and tells a passing ork your plan.")}}, X({renown: 3, set: {snagFriend: true}},
        "你的计划很周密。兽人走过来时，所有地精假装在擦靴子，包括擦你的靴子。",
        "Your plan is thorough. When the ork arrives, every grot pretends to polish boots, yours included."))),
      C("一起假装擦靴子", "Pretend to polish boots too", "ork_608", X({sanity: 5},
        "兽人看了看一圈擦靴子的地精和一个人仔，挠挠头，走了。会议改天再开。",
        "The ork eyes a ring of boot-polishing grots and one 'umie, scratches his head and leaves. Meeting postponed.")),
      C("教它们锈牙帮的规矩", "Teach them Rustfang gang rules", "ork_608", O(Q({flag: "origin_ganger"}, true), X({renown: 6, set: {grotCrew: true}},
        "放哨、分赃、跑路。斯纳吉特说，这是他这辈子听过最美的东西。",
        "Lookouts, fair shares, escape routes. Snaggit says it's the most beautiful thing he's ever heard.")))
    ]};


  N.ork_608 = {chapter: 6, scene: "ork_fort", speaker: EDNA, time: {d: 4},
    text: L("红甲巨人来过以后，奴隶圈少了一半人。老埃德娜病了，咳得直不起腰，还在拣弹壳。\n“孩子，”她说，“我要是走了，替我把这本祷文书给下一个人。”\n书很薄，边角全被翻烂了。",
            "Since the red giants came, the slave pen holds half as many. Old Edna is sick, coughing double, still picking up casings.\n“Child,” she says, “if I go, give this prayer book to the next one.”\nIt's thin, its corners worn soft."),
    choices: [
      C("把你的口粮给她", "Give her your rations", "ork_701", O({grudge: {npc: "edna", effects: {sanity: -4}, note: L("埃德娜还记得被你抢走的面包，推开了你的手。", "Edna remembers the bread you snatched and pushes your hand away.")}}, X({hp: -10, sanity: 5, taint: {all: -10}, set: {forgiven_edna: true}},
        "她吃得很慢，很仔细。那天夜里她没再咳。你饿着肚子，睡得很好。",
        "She eats slowly, carefully. That night she doesn't cough. You go hungry and sleep well."))),
      C("求医生佬看看她", "Beg the Dok to look at her", "ork_701", O(Q({stat: "renown", min: 20}), X({renown: -8, hp: -5},
        "医生佬收了牙，往她嘴里灌了一勺绿东西。她第二天能站起来了，只是总想打架。",
        "The Dok takes your teef and spoons something green into her. Next day she can stand. She keeps wanting to fight, though."))),
      C("收下书，说不出话", "Take the book, unable to speak", "ork_701", O({grudge: {npc: "edna", effects: {sanity: -4}, note: L("埃德娜不肯把书交给抢过她面包的人，你是从她手里拿走的。", "Edna won't hand the book to the one who stole her bread. You take it from her.")}}, X({sanity: -5},
        "你把书揣进怀里。第三天，奴隶圈的角落空了。",
        "You tuck the book inside your coat. On the third day, her corner of the pen is empty.")))
    ]};

  /* ============ Chapter 7 · Da 'Umies Strike Back ============ */
  N.ork_701 = {chapter: 7, scene: "ork_scrapyard", speaker: null, foe: "astartes", time: {d: 40}, eventRoll: 0.35, effects: {hp: 10},
    text: L("第四十天，天上落下了燃烧的钢铁种子。\n空降舱一个接一个砸进堡垒外的荒地。舱门炸开，走出来的人比兽人还高，盔甲蓝得发亮。\n星际战士来了。兽人欢呼得比谁都响。",
            "On the fortieth day, burning steel seeds fall from the sky.\nDrop pods slam into the wasteland outside the fort. Their doors blow open; out step men taller than orks, armour gleaming blue.\nThe Space Marines have come. The orks cheer loudest of all."),
    codex: ["imp_astartes", "ork_good_fight"],
    choices: [
      C("拿上信号弹，去找政委", "Take the flare and find the commissar", "ork_702", O(Q({flag: "resistance"}, true), X({sanity: -5},
        "你穿过混乱的营地。没有兽人拦你，它们都忙着往前冲。",
        "You cross the chaotic camp. No ork stops you; they're all busy charging."))),
      C("跟着瓦兹格布守作坊", "Hold the workshop with Wazgob", "ork_707", X({renown: 3, hp: -15},
        "瓦兹格布往每把枪里多塞了一倍火药。“最好的一天！”一把枪在你旁边炸了膛。",
        "Wazgob double-loads every gun. “Best day EVER!” One bursts right beside you.")),
      C("趁乱逃向城外的山", "Flee for the hills in the chaos", null, R(0.45, "hp", "ork_708", "ork_704",
        RR("你钻过铁丝网，跑过弹坑，一直跑到听不见吼声的地方。",
           "You squirm under wire, past craters, until the roaring fades behind you.",
           "你跑出两百米，一只大手揪住了你的后领。",
           "Two hundred metres, and a huge hand grabs your collar.")))
    ]};

  N.ork_702 = {chapter: 7, scene: "ork_fort", speaker: HALE, time: {h: 2},
    text: L("通讯器里，黑尔政委的声音压过了炮火。\n“星际战士要攻堡垒，门是铁的，太厚。从里面打开它，士兵。从里面。”\n大门的绞盘就在你面前，四个兽人守着它。",
            "Through the vox, Commissar Hale's voice cuts through the shellfire.\n“The Astartes are hitting the fort. The gate's iron and too thick. Open it from inside, soldier. From inside.”\nThe gate winch is right before you, guarded by four orks."),
    choices: [
      C("喊“那边打得更凶！”引开守卫", "Yell “Bigger fight over there!”", null, R(0.55, "renown", "ork_705", "ork_706",
        RR("四个兽人同时转头，同时跑了。兽人永远相信别处的架更好。",
           "All four orks turn and run at once. Orks always believe the fight elsewhere is better.",
           "三个跑了，一个留下来，因为他认得你，也认得你手里的信号弹。",
           "Three run. One stays: he knows your face, and the flare in your hand."))),
      C("让你的地精仔去转绞盘", "Send your grots to the winch", "ork_705", O(Q({flag: "grotCrew"}, true), X({renown: 3},
        "地精们哼着歌爬上绞盘，守卫以为是机械佬的命令。门开了，地精跑得比谁都快。",
        "The grots climb the winch humming; the guards assume it's the Mek's orders. The gate opens and the grots are first to flee."))),
      C("自己冲上去转", "Rush the winch yourself", "ork_705", X({hp: -30, taint: {khorne: 10}},
        "你被揍得很惨，可绞盘转动了。门开了一道缝，然后是一道光。",
        "You're beaten badly, but the winch turns. The gate opens a crack, then a blaze of light."))
    ]};

  N.ork_704 = {chapter: 7, scene: "ork_scrapyard", speaker: SKAR, time: {h: 1},
    text: L("斯卡巴德揪着你的后领，把你提到眼前。\n“跑？今天？”他大惑不解，“今天是最好的一天！人仔不懂。”\n他把你扔回作坊，顺手塞给你一把枪：“去打！打完再跑！”",
            "Skarbad lifts you by the collar to eye level.\n“Runnin'? TODAY?” He's baffled. “Today's da best day! 'Umies don't get it.”\nHe tosses you back to the workshop with a gun. “Go fight! Run after!”"),
    effects: {hp: -15},
    choices: [
      C("握紧那把枪", "Grip the gun", "ork_707")
    ]};

  N.ork_705 = {chapter: 7, scene: "ork_fort", speaker: MARINE, time: {h: 1},
    text: L("大门开了。蓝甲巨人涌进堡垒，像潮水冲进沙堡。\n其中一个停在你面前，头盔的目镜冷冷发光。\n“你是谁？”他的声音很平静，“你身上有异形的气味。”",
            "The gate opens. Blue giants pour into the fort like a tide into a sandcastle.\nOne stops before you, helmet lenses glowing cold.\n“Who are you?” His voice is calm. “You smell of xenos.”"),
    choices: [
      C("“政委派我来的。”", "“The commissar sent me.”", "ork_708", X({renown: 3},
        "他点了一下头，算是信了。然后走向枪声最密的地方，像去赴约。",
        "He nods once, which counts as belief, then walks toward the thickest gunfire like going to an appointment.")),
      C("指出大老大的位置", "Point out the warboss's lair", "ork_708", X({renown: 5, set: {toldWarboss: true}},
        "“东边最大的棚子。”他已经走了。身后，兽人和星际战士撞在一起，像两座山。",
        "“The biggest shed, east.” He's already gone. Behind you, orks and Marines collide like two mountains.")),
      C("把绿手指藏到背后", "Hide your green finger behind you", "ork_706", O(Q({flag: "orkBitz"}, true), X({sanity: -5},
        "可他已经看见了。目镜一闪，枪口抬了起来。",
        "But he's already seen. The lenses flicker; the muzzle rises.")))
    ]};

  N.ork_706 = {chapter: 7, scene: "trench", speaker: HALE, time: {d: 1},
    text: L("你被押到黑尔政委面前。他的大衣沾满泥，眼神比泥还冷。\n“你替绿皮修了几个月机器，”他说，“那些机器杀了我们的人。”\n他的手搭在枪套上。",
            "You're marched before Commissar Hale. His greatcoat is caked in mud; his eyes are colder than the mud.\n“You fixed the greenskins' machines for months,” he says. “Those machines killed our people.”\nHis hand rests on his holster."),
    choices: [
      C("“我一直在帮你们！”", "“I've been helping you all along!”", "ork_708", O(Q({flag: "vossTrust"}, true), X({sanity: 5},
        "沃斯中士从人群里走出来，站到你身边。政委看了他很久，把手从枪套上拿开了。",
        "Sergeant Voss steps from the crowd and stands beside you. The commissar studies him a long time, then lifts his hand from the holster."))),
      C("“我只是想活下去。”", "“I only wanted to live.”", "ork_end_collaborator", X({sanity: -10},
        "“我知道，”政委说，“每个人都这么说。”",
        "“I know,” says the commissar. “Everyone says that.”")),
      C("趁炮击扑进壕沟", "Dive into a trench under the shelling", null, R(0.4, "hp", "ork_707", "ork_end_collaborator",
        RR("一发炮弹落在附近，所有人都趴下了。你爬起来时，已经在兽人这边了。",
           "A shell lands close and everyone drops. When you rise, you're back on the ork side.",
           "你扑得不够远。两个卫兵按住了你。",
           "You don't dive far enough. Two guards pin you down.")))
    ]};

  N.ork_707 = {chapter: 7, scene: "ork_fort", speaker: WAZ, time: {d: 20},
    text: L("星际战士打下了半个堡垒，又被兽人抢了回来。然后再打下，再抢回。\n二十天后，他们撤到城外山上，等更多的人来。兽人也在等更多的兽人来。\n瓦兹格布满意地说：“这仗能打一百年。”",
            "The Marines take half the fort; the orks take it back. Again. And again.\nAfter twenty days they pull back to the hills to wait for more men. The orks are waiting for more orks too.\nWazgob says, satisfied: “Dis fight could go a hundred years.”"),
    choices: [
      C("“一百年太长了。”", "“A hundred years is too long.”", "ork_709", X({sanity: -5},
        "“对，”瓦兹格布同意，“太短了。”",
        "“Yeah,” Wazgob agrees. “Too short.”")),
      C("帮他修被打坏的大亮闪", "Help repair the battered Big Shiny", "ork_709", X({renown: 5, hp: -5},
        "你们修了二十天，敲坏了三把锤子。盔甲比以前更响了。",
        "Twenty days of repairs and three broken hammers. The armour is louder than ever."))
    ]};

  N.ork_708 = {chapter: 7, scene: "trench", speaker: MARINE, time: {d: 3},
    text: L("城外山上，星际战士的营地静得吓人。一位老兵摘下头盔，脸上的疤比你的年纪还长。\n“兽人要选新老大，选的时候会聚在一起。回去，做我们的眼睛。”\n“然后我们来接你。如果你还活着。”",
            "In the hills, the Marines' camp is frighteningly quiet. A veteran removes his helmet; his scars are older than you.\n“The orks will choose a new boss. When they do, they gather. Go back. Be our eyes.”\n“Then we come for you. If you live.”"),
    effects: {set: {beacon: true}},
    choices: [
      C("“我会回去。”", "“I'll go back.”", "ork_709", X({renown: 5},
        "他递给你一枚小小的信标。它很轻，可你觉得自己揣着一整个战团。",
        "He hands you a tiny beacon. It weighs nothing, yet you feel you're carrying a whole Chapter.")),
      C("“求你们现在就带我走。”", "“Please, take me now.”", "ork_709", X({sanity: -10},
        "“帝国不需要又一个难民，”他说，“需要一双眼睛。”他把信标塞进你手里。",
        "“The Imperium doesn't need another refugee,” he says. “It needs eyes.” He presses the beacon into your hand."))
    ]};

  N.ork_709 = {chapter: 7, scene: "ork_scrapyard", speaker: REDGOB, time: {d: 5},
    text: L("一艘涂得乱七八糟的海盗船降在废料场。红戈布船长跳下来，帽子上的羽毛又多了几根。\n“先知的大Waaagh!要来了，这儿要挤爆了。俺不喜欢挤，俺要走。”\n他打量你：“人仔，有多少牙？”",
            "A garishly painted pirate ship lands in the scrapyard. Kaptin Redgob hops down, more feathers in his hat than before.\n“Da Prophet's Waaagh!'s comin'. Gonna get crowded. I don't like crowded. I'm off.”\nHe looks you over. “'Umie. How many teef?”"),
    codex: ["ork_freebooterz"],
    choices: [
      C("掏出所有的牙", "Empty out all your teef", "ork_711", O(Q({stat: "renown", min: 55}), X({renown: -10, set: {berth: true}},
        "红戈布数了数，咬了几颗。“够了。大Waaagh!那天起飞，迟到不等。”",
        "Redgob counts and bites a few. “Enough. We lift off on Waaagh! day. Late, ya get left.”"))),
      C("“你说过回来买我。”", "“You said you'd buy me back.”", "ork_711", O(Q({flag: "freebooterFriend"}, true), X({set: {berth: true}},
        "红戈布大笑：“俺说过？”他想了想，“俺说过。好吧，自由海盗偶尔也算话。”",
        "Redgob roars. “Did I?” He thinks. “I did. Fine. Freebooterz keep their word. Sometimes.”"))),
      C("“我还有事要做。”", "“I've got things to do.”", "ork_711", X({renown: 3},
        "“人仔有事！”船长觉得这话好笑极了，一路笑着走开了。",
        "“'Umie's got fings to do!” The kaptin finds this hilarious and laughs all the way off."))
    ]};

  N.ork_711 = {chapter: 7, scene: "manufactorum", speaker: GRUK, time: {d: 3},
    text: L("格鲁卡大老大亲自来到作坊，绕着大亮闪走了一圈，敲了敲胸甲。\n“盔甲好，”他说，“穿它的不好。”\n他一拳把工作台砸成两半，然后看着你：“人仔。你的机械佬，想当大机械佬？”",
            "Warboss Grukka comes to the workshop in person. He circles Da Big Shiny and raps its chest.\n“Good armour,” he says. “Bad git inside it.”\nOne punch splits the workbench in two. He looks at you. “'Umie. Your Mek wants to be Big Mek?”"),
    codex: ["ork_mega_armour"],
    choices: [
      C("“他只想造好东西，大老大。”", "“He just builds good stuff, boss.”", "ork_710", X({renown: 3},
        "格鲁卡哼了一声。“好东西，”他重复，“俺喜欢好东西。”他走了，带走了半张工作台。",
        "Grukka grunts. “Good stuff,” he repeats. “I like good stuff.” He leaves, taking half the bench.")),
      C("“您最大，大老大。”", "“You're biggest, boss.”", "ork_710", X({renown: 5, sanity: -5},
        "“对。”格鲁卡很满意，拍了拍你的头。你的脖子响了一声。",
        "“Yeah.” Grukka is pleased and pats your head. Your neck cracks.")),
      C("一言不发", "Say nothing", "ork_710", X({hp: -10},
        "格鲁卡不喜欢沉默。他把你拎起来闻了闻，又扔下了。“软。”",
        "Grukka dislikes silence. He lifts you, sniffs, and drops you. “Soft.”"))
    ]};

  N.ork_710 = {chapter: 7, scene: "ork_fort", speaker: ZOG, time: {d: 14},
    text: L("先知的舰队越来越近，伊斯卡隆的兽人越来越吵。打架坑一天开二十场，锤子声整夜不停。\n佐格拉克的脑袋又在冒烟。\n“都感觉到了，”他说，“人仔也是。听，你的心在跟着吼。”",
            "Da Prophet's fleet draws closer, and Iskaron's orks grow louder. The pit runs twenty bouts a day; the hammers never stop.\nZograk's head is smoking again.\n“Everyone feels it,” he says. “'Umie too. Listen. Your 'eart's roarin' along.”"),
    choices: [
      C("承认你听见了", "Admit you hear it", "ork_801", X({sanity: -5, taint: {khorne: 10}},
        "咚，咚，咚。你分不清那是兽人的Waaagh!，还是别的什么在借它的声音。",
        "Thump. Thump. Thump. You can't tell if it's the orks' Waaagh!, or something else borrowing its voice.")),
      C("堵住耳朵", "Cover your ears", "ork_801", X({sanity: 5},
        "没用。可佐格拉克说，试过的人仔比较不容易炸。",
        "Useless. But Zograk says 'umies who try are less likely to explode."))
    ]};

  /* ============ Chapter 8 · Da Great Waaagh! ============ */
  N.ork_801 = {chapter: 8, scene: "ork_scrapyard", speaker: STORM, time: {d: 7},
    text: L("第七天，天空彻底绿了。绿色雷暴从地平线压过来，雷声里全是吼叫。\n轨道上，一支比月亮还大的舰队正在降落。每个兽人都仰着头，每个兽人都知道那是谁。\n先知来了。伊斯卡隆得出一个老大去见他。",
            "On the seventh day the sky turns wholly green. A green storm rolls in from the horizon, its thunder full of roaring.\nIn orbit a fleet bigger than a moon descends. Every ork looks up; every ork knows who it is.\nDa Prophet is here. Iskaron must send one boss to meet him."),
    effects: {sanity: -10},
    codex: ["ork_great_waaagh", "ork_ghazghkull"],
    choices: [
      C("去打架坑", "Go to the fight pit", "ork_802")
    ]};

  N.ork_802 = {chapter: 8, scene: "ork_fort", speaker: WAZ, time: {h: 6}, eventRoll: 0.3,
    text: L("斯卡巴德要在打架坑挑战格鲁卡，当着全星球的兽人。\n大亮闪立在坑边，冒着烟，嗡嗡作响。瓦兹格布把最后一把扳手塞给你。\n“人仔，最后一下，你来。”",
            "Skarbad will challenge Grukka in the fight pit, before every ork on the planet.\nDa Big Shiny stands at the rim, smoking and humming. Wazgob hands you the last spanner.\n“'Umie. Last bit. You do it.”"),
    codex: ["place_fight_pit"],
    choices: [
      C("刷上红漆：红的打得快！", "Paint it red: red ones hit fasta!", "ork_803", X({renown: 5, set: {shinyRed: true}},
        "全场兽人都看见了，全场兽人都信了。你觉得盔甲在你手底下变快了。",
        "Every ork in the crowd sees it, and every ork believes. You feel the armour quicken under your hands.")),
      C("按帝国标准拧紧每颗螺栓", "Torque every bolt to Imperial spec", "ork_803", X({renown: 3, taint: {tzeentch: 20}},
        "你拧得整整齐齐。瓦兹格布皱眉看了半天：“太整齐了。俺不信。”",
        "Neat as a manual. Wazgob frowns at it a long time. “Too neat. I don't believe it.”")),
      C("剪断那根假线", "Cut the fake join", "ork_803", O(Q({flag: "sabotaged"}, true), X({set: {shinyDead: true}},
        "你剪得很轻，没人看见。盔甲的嗡嗡声低了半个调。",
        "You snip it gently. Nobody sees. The armour's hum drops half a tone."))),
      C("把匕首焊在它拳头上", "Weld the dagger to its fist", "ork_803", O(Q({flag: "bloodDagger"}, true), X({corruption: 10, set: {shinyRed: true}, taint: {khorne: 15}},
        "匕首一碰铁就烧得通红。盔甲里传出一声鼓响，你听过这个声音。",
        "The dagger glows red the instant it touches iron. A drumbeat sounds inside the armour. You've heard it before.")))
    ]};

  N.ork_803 = {chapter: 8, scene: "ork_fort", speaker: null, foe: "ork_boss", time: {h: 1},
    text: L("格鲁卡跳进坑里，大地一震。斯卡巴德穿着大亮闪迎上去，每一步都喷着火。\n两个巨人撞在一起，像两艘船对撞。全场在吼，吼声和天上的雷连成一片。\n大亮闪的胸口开始冒黑烟。",
            "Grukka leaps into the pit and the ground shudders. Skarbad strides out in Da Big Shiny, flames at every step.\nThe two giants collide like ships ramming. The crowd roars, the roar merging with the thunder overhead.\nDa Big Shiny's chest starts pouring black smoke."),
    choices: [
      C("跳下去拍一巴掌反应堆", "Jump down and slap the reactor", null, R(0.5, "hp", "ork_804", "ork_805",
        RR("你一巴掌拍下去。反应堆咳了一声，活了。兽人的机器，就吃这一套。",
           "You smack it. The reactor coughs and catches. Ork machines respond to exactly this.",
           "反应堆把你烫了回来。黑烟更浓了。",
           "The reactor burns you back. The smoke thickens."))),
      C("带头大吼“Waaagh！”", "Lead the crowd: “WAAAGH!”", null, R(0.5, "renown", "ork_804", "ork_805",
        RR("全场跟着你吼。盔甲又亮了。兽人的信念，有时候需要一个人仔起头。",
           "The whole crowd roars with you. The armour blazes again. Ork belief sometimes needs an 'umie to start it.",
           "你的嗓子太小了，没人听见。",
           "Your voice is too small. Nobody hears."))),
      C("“红的！打得快！”", "“RED ONES! HIT FASTA!”", "ork_804", O(Q({flag: "shinyRed"}, true), X({renown: 5},
        "几千个兽人同时想起盔甲是红的。大亮闪的拳头快得看不见。",
        "Thousands of orks remember at once that the armour is red. Big Shiny's fist moves too fast to see."))),
      C("看着它熄火", "Watch it die", "ork_805", O(Q({flag: "shinyDead"}, true), X({sanity: -5},
        "嗡嗡声停了。就在那一刻，正是政委要的那一刻。",
        "The hum stops. At exactly the moment the commissar wanted.")))
    ]};

  N.ork_804 = {chapter: 8, scene: "ork_fort", speaker: SKAR, time: {h: 1},
    text: L("格鲁卡倒下了，没再起来。斯卡巴德从大亮闪里爬出来，踩在他身上大吼。\n全星球的兽人跟着他吼。他现在是大老大了，因为他现在最大。\n他转向瓦兹格布和你：“好盔甲！好人仔！”",
            "Grukka goes down and stays down. Skarbad climbs out of Da Big Shiny, stands on him and roars.\nEvery ork on the planet roars with him. He's Warboss now, because now he's biggest.\nHe turns to Wazgob and you. “Good armour! Good 'umie!”"),
    effects: {renown: 10, set: {shinyWon: true}},
    choices: [
      C("跟着吼", "Roar along", "ork_811", X({sanity: -5},
        "你吼得嗓子都破了。这是你这辈子最响的一声。",
        "You roar till your voice cracks. The loudest sound you've ever made.")),
      C("悄悄退到人群后面", "Slip back into the crowd", "ork_811")
    ]};

  N.ork_805 = {chapter: 8, scene: "ork_fort", speaker: GRUK, time: {h: 1}, effects: {hp: -15},
    text: L("大亮闪跪下了，胸口冒火。格鲁卡把斯卡巴德从盔甲里拽出来，扔出了坑外。\n然后他转过头，看着坑边的瓦兹格布。看着你。\n“这堆破烂，谁造的？”",
            "Da Big Shiny drops to its knees, chest ablaze. Grukka drags Skarbad out of the armour and flings him from the pit.\nThen he turns to look at Wazgob at the rim. At you.\n“'OO built dis junk?”"),
    choices: [
      C("指着瓦兹格布", "Point at Wazgob", "ork_809", X({renown: -10, sanity: -10, set: {blamedMek: true, wronged_wazgob: true}},
        "瓦兹格布看了你一眼，没生气，好像早就知道。格鲁卡把他拎了起来。",
        "Wazgob glances at you, not angry, as if he always knew. Grukka hoists him up.")),
      C("“我造的！”跳进坑里", "“I did!” Jump into the pit", "ork_810", X({taint: {khorne: 15}},
        "全场静了一秒，然后爆发出比雷还响的笑声：一个人仔，要跟大老大打。",
        "The pit falls silent for a second, then bursts into laughter louder than thunder: an 'umie wants to fight the boss.")),
      C("趁乱溜走", "Slip away in the uproar", null, R(0.5, "hp", "ork_811", "ork_809",
        RR("你钻过几百条腿，溜出了堡垒。没人注意一个人仔，大家都在看坑里。",
           "You worm between hundreds of legs and out of the fort. Nobody minds an 'umie; all eyes are on the pit.",
           "一个地精仔指着你尖叫。你被抬了回去。",
           "A grot points at you and shrieks. You're carried back.")))
    ]};

  N.ork_810 = {chapter: 8, scene: "ork_fort", speaker: GRUK, time: {h: 1},
    text: L("格鲁卡蹲下来，差不多和你一样高了。他咧开嘴，每颗牙都比你的小臂长。\n“人仔有种，”他说，“俺让你先打。”\n全星球的兽人都在看。天上，先知的雷暴也在看。",
            "Grukka crouches until he's nearly your height. He grins; each tooth is longer than your forearm.\n“'Umie got guts,” he says. “You 'it first.”\nEvery ork on the planet is watching. Overhead, da Prophet's storm watches too."),
    choices: [
      C("用扳手砸他的牙", "Smash his teeth with a spanner", null, R(0.35, "hp", "ork_812", "ork_813",
        RR("扳手砸在他嘴上，一颗牙飞了出去。", "The spanner cracks into his mouth. A tooth goes flying.",
           "扳手断了。格鲁卡叹了口气，像是有点失望。", "The spanner snaps. Grukka sighs, a little disappointed."))),
      C("引他踩进冒火的反应堆", "Lure him into the burning reactor", null, R(0.4, "renown", "ork_812", "ork_813",
        RR("格鲁卡一脚踩进火里，烧得跳了起来，跳得太高，磕掉了一颗牙。",
           "Grukka steps into the fire, leaps, leaps too high, and knocks out a tooth.",
           "格鲁卡跨过了火。他早就看见了。", "Grukka steps over the fire. He saw it coming."))),
      C("指着额头的蓝漆", "Point at the blue on your brow", "ork_812", O(Q({flag: "luckyBlue"}, true), X({renown: 5},
        "格鲁卡的拳头停在半空，盯着那道蓝色看了很久。兽人不打运气好的东西。",
        "Grukka's fist stops midair. He stares at the blue a long time. Orks don't punch luck.")))
    ]};

  N.ork_812 = {chapter: 8, scene: "ork_fort", speaker: GRUK, time: {h: 1},
    text: L("你没打赢。没人能打赢格鲁卡。可你还站着，地上还有他的一颗牙。\n格鲁卡捡起那颗牙看了看，大笑着扔给你。\n“人仔赢了一颗牙！”全场一起吼。从今天起，你有了一个兽人名字。",
            "You don't win. Nobody beats Grukka. But you're still standing, and one of his teef is on the ground.\nGrukka picks it up, looks it over, and tosses it to you, laughing.\n“'Umie won a TOOF!” the crowd roars. From today, you have an ork name."),
    effects: {renown: 15, set: {luckyUmie: true}},
    choices: [
      C("把牙挂在脖子上", "Hang the tooth round your neck", "ork_811")
    ]};

  N.ork_813 = {chapter: 8, scene: "ork_fort", speaker: null, foe: "ork_boss", time: {h: 1},
    text: L("格鲁卡只用了一下。\n你飞出打架坑，落在废铁堆上，听见身体里有几样东西换了位置。\n兽人们在笑。不是嘲笑，是那种看了一场好戏的笑。",
            "Grukka needs one blow.\nYou fly out of the pit and land on the scrap heap, hearing a few things inside you change places.\nThe orks are laughing. Not mocking: the laugh of people who saw a good show."),
    effects: {hp: -50},
    choices: [
      C("爬起来", "Get up", "ork_809")
    ]};

  N.ork_811 = {chapter: 8, scene: "ork_scrapyard", speaker: STORM, time: {h: 3},
    text: L("绿色雷暴裂开了。一个巨大的身影站在闪电里，比任何兽人都大，头顶闪着金属的光。\n你看不清他的脸，只听见几十万兽人同时安静了一秒，然后吼出同一个名字。\n先知看了伊斯卡隆一眼。",
            "Then the green storm overhead splits open. A vast figure stands in the lightning, bigger than any ork, metal gleaming on its skull.\nYou can't make out a face. You only hear hundreds of thousands of orks fall silent for one second, then roar a single name.\nDa Prophet has glanced at Iskaron."),
    effects: {sanity: -5},
    codex: ["ork_ghazghkull"],
    choices: [
      C("跟着吼那个名字", "Roar the name with them", "ork_806", X({renown: 3, taint: {khorne: 10}},
        "“加兹库尔！”你的声音淹没在吼声里。那一刻，你觉得自己也很大。",
        "“GHAZGHKULL!” Your voice drowns in the roar. For a moment, you feel big too.")),
      C("低下头", "Lower your head", "ork_806", X({sanity: 3},
        "你盯着自己的靴子。有些东西，人类最好不要看得太清楚。",
        "You stare at your boots. Some things humans had best not see too clearly."))
    ]};

  N.ork_806 = {chapter: 8, scene: "ork_scrapyard", speaker: WAZ, time: {h: 6},
    text: L("绿色雷暴落地了。成千上万的兽人涌向先知的舰队，伊斯卡隆的小子们也在其中。\n瓦兹格布在收拾工具：“先知要大机械佬，俺要去。你，人仔，来不来？”\n听说下一站是奥雷克斯二号。",
            "The green storm makes landfall. Thousands upon thousands of orks stream toward da Prophet's fleet, Iskaron's boyz among them.\nWazgob packs his tools. “Prophet wants Big Meks. I'm goin'. You, 'umie. Comin'?”\nNext stop, they say, is Aurex Secundus."),
    codex: ["place_aurex"],
    choices: [
      C("“我跟你走，大机械佬。”", "“I'm with you, Big Mek.”", "ork_end_big_umie", O(Q({stat: "renown", min: 70}), X({renown: 5},
        "瓦兹格布把一副护目镜扣在你脸上。“俺的人仔，”他说，“不卖。”",
        "Wazgob snaps a pair of goggles onto your face. “My 'umie,” he says. “Not for sale.”"))),
      C("跟着大军走", "Follow the horde", "ork_end_grot", X({sanity: -10},
        "你被人流卷着往前走。没人在乎你，你也不知道能去哪儿。",
        "The tide of bodies sweeps you along. Nobody cares about you, and you have nowhere else to go.")),
      C("溜去海盗船", "Slip off to the pirate ship", "ork_807", O(Q({flag: "berth"}, true), X({hp: -5},
        "你逆着人流往废料场跑，被撞倒了好几次。",
        "You run against the tide toward the scrapyard, knocked flat several times."))),
      C("按下信标", "Trigger the beacon", "ork_808", O(Q({flag: "beacon"}, true), X({sanity: -5},
        "信标亮起一个小小的红点。在这片绿色里，它显得那么孤单。",
        "The beacon shows one tiny red light. In all that green it looks so alone.")))
    ]};

  N.ork_809 = {chapter: 8, scene: "ork_fort", speaker: null, time: {d: 1},
    text: L("格鲁卡还是大老大。他带着伊斯卡隆所有的兽人去见先知了。\n作坊空了。瓦兹格布被拉去造别的东西，斯卡巴德被拉去当炮灰。\n你被留在一张很长的名单上：没用的东西。",
            "Grukka is still Warboss. He takes every ork on Iskaron to meet da Prophet.\nThe workshop is empty. Wazgob is dragged off to build other things; Skarbad to be cannon fodder.\nYou're left on a very long list: useless things."),
    choices: [
      C("溜去海盗船", "Slip off to the pirate ship", "ork_807", O(Q({flag: "berth"}, true), X({hp: -5},
        "海盗船还在废料场，舱门半开着，引擎已经在吼。",
        "The pirate ship is still in the scrapyard, hatch half open, engines already roaring."))),
      C("按下信标", "Trigger the beacon", "ork_808", O(Q({flag: "beacon"}, true), X({sanity: -5},
        "信标亮起一个小小的红点。你蹲在空荡荡的堡垒里，数着心跳等。",
        "The beacon shows one tiny red light. You crouch in the empty fort, counting heartbeats."))),
      C("去找医生佬", "Go find the Dok", "ork_end_dok", O(Q({flag: "orkBitz"}, true), X({sanity: -10},
        "巴兹戈布正在收拾桶。他看见你，眼睛亮了：“人仔！俺的人仔！”",
        "Buzzgob is packing his buckets. He sees you and his eyes light up. “'Umie! MY 'umie!”"))),
      C("跟上瓦兹格布", "Follow Wazgob", "ork_end_grot", X({sanity: -5},
        "瓦兹格布回头看了你一眼，没赶你走。这大概是兽人最温柔的样子。",
        "Wazgob looks back once and doesn't chase you off. Probably the gentlest thing an ork can do."))
    ]};

  N.ork_807 = {chapter: 8, scene: "ork_scrapyard", speaker: REDGOB, time: {h: 1},
    text: L("海盗船的舱门正在关，引擎喷出的火把废料烧得通红。\n红戈布站在舱口，帽子被风吹歪了：“人仔！快！不等！”\n舱门离地面有两米高。",
            "The pirate ship's hatch is closing; the engines' flames scorch the scrap red-hot.\nRedgob stands at the hatch, hat blown askew. “'Umie! MOVE! Not waitin'!”\nThe hatch is two metres off the ground."),
    choices: [
      C("助跑，跳！", "Run up and jump!", null, R(0.6, "hp", "ork_end_freebooter", "ork_end_grot",
        RR("一只绿色的大手抓住了你的手腕，把你拽了上去。",
           "A big green hand catches your wrist and hauls you aboard.",
           "你的指尖擦过舱门。船飞走了，地上只剩你和一个拿着鞭子的牧地精兽人。",
           "Your fingertips brush the hatch. The ship is gone, leaving you and an ork runtherd with a whip.")))
    ]};

  N.ork_808 = {chapter: 8, scene: "burning_city", speaker: MARINE, time: {h: 2},
    text: L("三分钟后，一艘炮艇贴着绿色雷暴俯冲下来，舱门大开。\n那位疤脸老兵伸出手：“你看到的，全部告诉我们。”\n身后，兽人们根本没注意。它们都在看天上的先知。",
            "Three minutes later a gunship dives beneath the green storm, hatch wide.\nThe scarred veteran reaches out. “Everything you saw. Tell us all of it.”\nBehind you the orks don't even notice. They're all watching da Prophet in the sky."),
    choices: [
      C("抓住他的手", "Take his hand", "ork_end_evacuated", X({sanity: 10},
        "他的手套又冷又硬，可握得很稳。你这才发现，自己已经很久没碰过人类的手了。",
        "His gauntlet is cold and hard, but steady. Only now do you realise how long it's been since you touched a human hand."))
    ]};

  /* ============ Endings ============ */
  N.ork_end_big_umie = {chapter: 8, scene: "ork_scrapyard", speaker: WAZ, time: {y: 2},
    text: L("两年后，大Waaagh!里流传着一个传说：人仔机械佬，认得人仔的字，修得好人仔的船。\n兽人叫你“牙人仔”。你有一罐牙，一副护目镜，和一个没人敢动的位置。\n有时你想起自己曾是人。偶尔。",
            "Two years on, da Prophet's Great Waaagh! tells a legend: an 'umie Mek who reads 'umie writing and fixes 'umie ships.\nThe orks call you Toof 'Umie. You have a jar of teef, a pair of goggles, and a place nobody dares touch.\nSometimes you remember you were human. Sometimes."),
    ending: {kind: "good", title: L("牙人仔", "Toof 'Umie"), cause: L("当了人仔机械佬", "Became the Waaagh!'s 'umie Mek")}};

  N.ork_end_freebooter = {chapter: 8, scene: "void", speaker: REDGOB, time: {d: 60, warp: true},
    text: L("海盗船冲出伊斯卡隆的绿天时，你回头看了一眼。整颗星球在燃烧，在吼叫。\n红戈布扔给你一顶插羽毛的帽子。“自由海盗，”他说，“没有老大，只有牙。”\n你把帽子戴上了。有点大，不过你会长的。",
            "As the pirate ship tears out of Iskaron's green sky, you look back once. The whole planet is burning and roaring.\nRedgob tosses you a feathered hat. “Freebooterz,” he says. “No boss. Just teef.”\nYou put it on. It's a bit big. You'll grow into it."),
    ending: {kind: "good", title: L("自由海盗", "Freebooter"), cause: L("随自由海盗远走星海", "Flew off with the Freebooterz")}};

  N.ork_end_evacuated = {chapter: 8, scene: "void", speaker: null, time: {d: 20, warp: true},
    text: L("炮艇载着你穿过雷暴。你把看到的一切告诉星际战士：机械佬、怪小子、先知的舰队。\n情报被发往奥雷克斯二号，大Waaagh!的下一站。\n那边的人能比伊斯卡隆多准备几天。也许就够了。",
            "The gunship carries you through the storm. You tell the Marines everything: the Mek, the Weirdboy, da Prophet's fleet.\nThe report goes to Aurex Secundus, the Great Waaagh!'s next stop.\nThey'll have a few more days to prepare than Iskaron did. Maybe that's enough."),
    codex: ["place_aurex"],
    ending: {kind: "good", title: L("几天的预警", "A Few Days' Warning"), cause: L("带着情报撤离", "Evacuated with the intel")}};

  N.ork_end_collaborator = {chapter: 7, scene: "trench", speaker: HALE, time: {d: 1},
    text: L("军事法庭只开了四分钟。罪名：通敌。证据：你还活着。\n黑尔政委亲自执行。枪声被兽人的吼声盖住了，没人听见。\n档案上写着：伊斯卡隆，平民一名，已处理。",
            "The court-martial takes four minutes. Charge: collaboration. Evidence: you're alive.\nCommissar Hale carries out the sentence himself. The orks' roaring drowns the shot; nobody hears.\nThe file reads: Iskaron, one civilian, processed."),
    ending: {kind: "bad", title: L("通敌者", "Collaborator"), cause: L("以通敌罪被政委处决", "Shot by a commissar as a collaborator")}};

  N.ork_end_grot = {chapter: 8, scene: "ork_scrapyard", speaker: SNAG, time: {y: 10},
    text: L("你跟着大Waaagh!走了十年，从一颗星球到另一颗。\n你给机械佬递扳手，给地精分口粮，给史奎格喂剩饭。没人记得你的名字，地精们管你叫“大地精”。\n你不再数日子了。兽人不数，你也不数。",
            "You follow the Great Waaagh! for ten years, world to world.\nYou hand Meks their spanners, share rations with grots, feed scraps to squigs. Nobody remembers your name; the grots call you Big Grot.\nYou stop counting days. Orks don't. Neither do you."),
    ending: {kind: "bad", title: L("大地精", "Big Grot"), cause: L("当了一辈子奴隶", "A lifetime slaving for the Waaagh!")}};

  N.ork_end_dok = {chapter: 8, scene: "ork_fort", speaker: DOK, time: {y: 1},
    text: L("巴兹戈布医生佬把你当成了毕生杰作。一条绿胳膊，两条绿腿，一颗不知道是谁的心。\n你比任何人类都强壮，打架时会忍不住吼。\n只是有时候，你想不起自己吼的是哪种语言。",
            "Dok Buzzgob makes you his life's masterpiece. One green arm, two green legs, a heart from who knows whom.\nYou're stronger than any human, and you can't help roaring when you fight.\nSometimes you can't remember which language you're roaring in."),
    ending: {kind: "bad", title: L("医生佬的杰作", "Da Dok's Masterpiece"), cause: L("被改造成兽人零件", "Rebuilt by the Dok, mostly ork")}};

  /* ============ Claim endings (SPEC §19). Reached via the claim events' goto map (ork_end_claim_<god>).
   * Khorne: Ork wars are his favourite feast — the likeliest claim. The other three rarely bother with a human
   * in ork-land, so their endings are quieter: Nurgle via the spore-beds, Tzeentch via belief-tech, Slaanesh via Flash Git vanity. */
  N.ork_end_claim_khorne = {scene: "burning_city", speaker: S("sigil_khorne", "远处的鼓", "A Distant Drum"), time: {y: 1},
    text: L("伊斯卡隆的仗没完没了：兽人打，人类打，红甲巨人也打。你打得越来越好，越来越停不下来。\n有一天你发现，你已经不在乎打的是谁了。\n血神很满意。这颗星球永远不缺头骨，现在也不缺你。",
            "Iskaron's war never ends: orks fight, humans fight, red giants fight. You get better at it, and less able to stop.\nOne day you realise you no longer care who you're fighting.\nThe Blood God is pleased. This world never lacks skulls, and now it doesn't lack you."),
    codex: ["god_khorne"],
    ending: {kind: "bad", title: L("永不停歇的仗", "The War That Never Stops"), cause: L("在战争里被恐虐收走", "Taken by Khorne in the endless war")}};

  N.ork_end_claim_nurgle = {scene: "ork_scrapyard", speaker: S("sigil_nurgle", "慈祥的声音", "A Fond Voice"), time: {d: 40},
    text: L("你在蘑菇地里躺下歇一会儿。孢子很暖，泥土很软。\n醒来时，你身上也长出了小小的蘑菇，带着一股甜腻的、放久了的味道。\n兽人以为你是一种新的史奎格。慈父知道你是谁的孩子。",
            "You lie down in the mushroom fields for a rest. The spores are warm; the soil is soft.\nWhen you wake, little mushrooms grow on you too, with a sweet, stale smell.\nThe orks think you're a new kind of squig. Grandfather knows whose child you are."),
    codex: ["god_nurgle"],
    ending: {kind: "bad", title: L("蘑菇地", "The Mushroom Field"), cause: L("孢子地里被纳垢收走", "Taken by Nurgle in the spore-beds")}};

  N.ork_end_claim_tzeentch = {scene: "manufactorum", speaker: S("sigil_tzeentch", "多出来的一行", "The Extra Line"), time: {d: 30},
    text: L("你终于弄懂了兽人的科技：信念让机器转动。\n可你想得太深，想到了更深处那个也靠信念活着的东西。它说：你相信的，我都能让它成真。\n你造的第一台机器完美无缺。它会变。它一直在变。",
            "At last you understand ork tech: belief turns the gears.\nBut you think too deep, down to something else that lives on belief. It says: whatever you believe, I can make real.\nThe first machine you build is flawless. It changes. It never stops changing."),
    codex: ["god_tzeentch"],
    ending: {kind: "bad", title: L("会变的机器", "The Changing Machine"), cause: L("因求知被奸奇收走", "Taken by Tzeentch through knowledge")}};

  N.ork_end_claim_slaanesh = {scene: "ork_fort", speaker: S("sigil_slaanesh", "甜得发苦的声音", "A Bittersweet Voice"), time: {y: 3},
    text: L("你开始擦亮一切：枪、牙、护目镜、自己的脸。\n兽人里最爱臭美的“亮仔”都夸你擦得好。可再亮也不够亮。\n你擦了很多年，直到镜子里的自己完美得不像人。她喜欢完美。",
            "You start polishing everything: guns, teef, goggles, your own face.\nEven the vainest Flash Gitz praise your shine. But it's never shiny enough.\nYou polish for years, until the face in the mirror is too perfect to be human. She loves perfect."),
    codex: ["god_slaanesh"],
    ending: {kind: "bad", title: L("永远不够亮", "Never Shiny Enough"), cause: L("沉迷完美被色孽收走", "Taken by Slaanesh through vanity")}};

  /* ============ Death nodes (engine-triggered) ============ */
  N.ork_death_hp = {scene: "ork_scrapyard", speaker: null,
    text: L("你倒在废铁堆里，和一千件别的废品躺在一起。\n地精仔来了，拿走你的靴子、你的扳手、你兜里那颗牙。\n明年这里会长出蘑菇，蘑菇底下会长出兽人。兽人不会知道你是谁。",
            "You fall on the scrap heap and lie among a thousand other pieces of junk.\nGrots come and take your boots, your spanner, the toof in your pocket.\nNext year mushrooms will grow here, and under them, orks. The orks won't know who you were."),
    ending: {kind: "death", title: L("废铁堆", "On the Scrap Heap"), cause: L("倒在废铁堆里", "Fell on the scrap heap")}};

  N.ork_death_sanity = {scene: "ork_fort", speaker: null,
    text: L("你开始在梦里吼“Waaagh！”，后来醒着也吼。\n你把自己刷成绿色，相信自己会变大、变强、变快。兽人们看着你，没笑，有点感动。\n你信得很用力。可惜，信念只对兽人管用。",
            "You start roaring “WAAAGH!” in your sleep, then awake.\nYou paint yourself green and believe you'll grow bigger, stronger, faster. The orks watch, not laughing. A little moved.\nYou believe so hard. Pity belief only works for orks."),
    ending: {kind: "death", title: L("绿色的梦", "Green Dreams"), cause: L("疯到以为自己是兽人", "Went mad believing you're an ork")}};

  N.ork_death_corruption = {scene: "burning_city", speaker: null,
    text: L("你身上的记号越来越多，越来越烫。\n某天早上，你的身体终于撑不住了，变成一团不停冒出新嘴巴的东西。\n兽人们兴奋地围过来：“好怪的家伙！揍它！”这是它们能给的最高赞美。",
            "The marks on you multiply and burn hotter.\nOne morning your body gives way and becomes a heap that keeps sprouting new mouths.\nThe orks crowd round, thrilled. “WEIRD 'UN! KRUMP IT!” It's the highest praise they have."),
    ending: {kind: "death", title: L("好怪的家伙", "Weird 'Un"), cause: L("腐化成了混沌怪物", "Twisted into chaos spawn")}};

  /* ============ Route taint events (SPEC §18/§26) + route events ============ */
  function E2(zh, en, effects, rzh, ren) { return {text: {zh: zh, en: en}, effects: effects, result: {zh: rzh, en: ren}}; }
  WH.registerEvents([
    {id: "evt_t_ork_tzeentch", god: "tzeentch", factions: ["orks"], minChapter: 2,
     scene: "manufactorum", speaker: S("sigil_tzeentch", "废料里的思考机", "A Cogitator in the Scrap"), foe: null,
     text: L("废料堆里有一台帝国思考机，屏幕还亮着。它在打印设计图，一张接一张，没有人输入过。\n每张图都比上一张更聪明一点，也更奇怪一点。",
             "In the scrap sits an Imperial cogitator, screen still lit. It's printing designs, one after another. Nobody typed anything.\nEach is a little cleverer than the last. And a little stranger."),
     codex: ["god_tzeentch"],
     choices: [
       E2("一张张读下去", "Read them one by one", {renown: 5, sanity: -3, taint: {tzeentch: 30}},
          "你读到深夜。最后一张图上画的是你自己，标着零件编号。",
          "You read deep into the night. The last design shows you, with part numbers."),
       E2("一锤砸了它", "Smash it with a hammer", {hp: -3},
          "屏幕碎了，打印机还响了三声才停。碎片划破了你的手。",
          "The screen shatters; the printer clatters three more times before stopping. A shard cuts your hand."),
       E2("交给瓦兹格布", "Give it to Wazgob", {renown: 3, taint: {tzeentch: 10}},
          "瓦兹格布看不懂图，但很喜欢那块会亮的屏幕，把它焊在了大亮闪的后背上。",
          "Wazgob can't read the designs but loves the glowing screen and welds it to Big Shiny's back.")
     ]},

    {id: "evt_t_ork_khorne", god: "khorne", factions: ["orks"], minChapter: 3,
     scene: "ork_fort", speaker: S("sigil_khorne", "坑边的鼓", "A Drum by the Pit"), foe: null,
     text: L("打架坑边，兽人用拳头擂着铁桶：咚，咚，咚。\n你发现自己的心跳跟上了节拍，拳头也攥紧了。坑里正缺一个对手。",
             "By the fight pit, orks pound oil drums with their fists: thump, thump, thump.\nYou notice your heartbeat has fallen into step, and your fists have clenched. The pit is short one opponent."),
     codex: ["god_khorne"],
     choices: [
       E2("跳进坑里", "Jump into the pit", {hp: -10, renown: 6, taint: {khorne: 30}},
          "你打了一场，又一场。出来时浑身是血，有些不是你的。鼓声送你回去，像在送一个老朋友。",
          "You fight one bout, then another. You climb out bloodied, not all of it yours. The drums see you off like an old friend."),
       E2("捂住耳朵走开", "Cover your ears and walk away", {sanity: -3},
          "鼓声跟了你三条街，才慢慢跟不上你的脚步。",
          "The drumming follows you three streets before it falls out of step.")
     ]},

    {id: "evt_t_ork_cleanse", god: "other", cleanse: true, factions: ["orks"], minChapter: 2,
     scene: "ork_fort", speaker: EDNA, foe: null,
     text: L("夜里，老埃德娜在奴隶圈里低声念祷文。几十个人类围着她，没有烛火，只有一块分成很多份的面包。\n兽人在远处唱歌。这里很安静。",
             "At night Old Edna murmurs prayers in the slave pen. Dozens of humans gather round: no candles, only one loaf split many ways.\nThe orks sing in the distance. Here it is quiet."),
     codex: ["imp_ecclesiarchy"],
     choices: [
       E2("跟着念", "Pray along", {sanity: 8, taint: {all: -20}},
          "你念得很轻。念完，脑子里那些不属于你的声音都安静了。",
          "You pray softly. When you finish, the voices that aren't yours have gone quiet."),
       E2("只拿面包", "Just take the bread", {hp: 5, taint: {all: -5}},
          "面包很硬，很好吃。埃德娜没说什么，只是多看了你一眼。",
          "The bread is hard, and good. Edna says nothing, only looks at you a moment longer."),
       E2("走开", "Walk away", {sanity: -2},
          "你回到作坊。机器在响，兽人在吼，你的脑子里也在吵。",
          "You go back to the workshop. Machines clank, orks roar, and your head is noisy too.")
     ]},

    {id: "evt_t_ork_slaanesh", god: "slaanesh", factions: ["orks"], minChapter: 3,
     scene: "ork_fort", speaker: S("ork", "亮仔", "Flash Git"), foe: null,
     text: L("一个“亮仔”拦住了你。他的枪镶满金牙，擦得能照出人影。\n“人仔，你手细，”他说，“把俺的枪擦到完美。要完美！不完美就揍。”",
             "A Flash Git blocks your way. His gun is studded with gold teef and polished bright as a mirror.\n“'Umie. Little 'ands,” he says. “Polish my gun. PERFECT. Not perfect, krump.”"),
     codex: ["ork_klans"],
     choices: [
       E2("擦到完美", "Polish it to perfection", {renown: 6, taint: {slaanesh: 30}},
          "你擦了一整天。枪亮得让你舍不得放手。你开始觉得别的东西都太脏了。",
          "You polish all day. It shines so bright you can't bear to put it down. Everything else starts to look filthy."),
       E2("随便擦两下", "Give it a quick wipe", {hp: -6},
          "亮仔看了一眼，揍了你一下，不重。“下回完美点。”",
          "The Flash Git glances at it and thumps you, not hard. “More perfect next time.”")
     ]},

    {id: "evt_t_ork_nurgle", god: "nurgle", factions: ["orks"], minChapter: 4,
     scene: "ork_scrapyard", speaker: S("gretchin", "种蘑菇的地精仔", "Mushroom-Farming Grot"), foe: null,
     text: L("一个胖乎乎的地精仔在蘑菇地里熬汤，汤冒着暖烘烘的泡。\n“蘑菇酒，”他笑眯眯地递给你一碗，“喝了不疼。啥都不疼。”",
             "A plump grot is brewing in the mushroom field; the pot bubbles warm and cosy.\n“Mushroom brew,” he beams, handing you a bowl. “Drink, no 'urtin'. Nuffin' 'urts.”"),
     codex: ["ork_spores"],
     choices: [
       E2("喝一碗", "Drink a bowl", {hp: 12, taint: {nurgle: 30}},
          "汤又稠又暖，伤口当晚就不疼了。第二天，你的嘴里一直有股放久了的甜味。",
          "Thick and warm; your wounds stop hurting that night. Next day a stale sweetness lingers in your mouth."),
       E2("倒掉", "Pour it out", {sanity: -3},
          "汤渗进泥里，那块地上第二天冒出一圈新蘑菇。地精仔很伤心。",
          "It soaks into the soil. Next day a ring of new mushrooms sprouts there. The grot is heartbroken.")
     ]},

    /* route events (no taint) */
    {id: "evt_ork_squig_race", god: "other", factions: ["orks"], minChapter: 2,
     scene: "ork_fort", speaker: S("squig", "史奎格赛跑", "Squig Race"), foe: null,
     text: L("堡垒里在办史奎格赛跑。规则只有一条：先跑到终点的赢，先把别人吃了的也算赢。\n小子们正在找骑手。他们看中了你，因为你轻。",
             "The fort is holding a squig race. One rule: first across the line wins, and so does whoever eats the others first.\nThe boyz need a jockey. They've picked you, because you're light."),
     codex: ["ork_squigs"],
     choices: [
       {text: L("骑上去", "Climb on"), effects: {hp: -8, renown: 8},
        result: L("你的史奎格吃掉了两个对手，然后试图吃你。你们以第一名冲过终点。", "Your squig eats two rivals, then tries to eat you. You cross the line first.")},
       {text: L("只下注", "Just bet"), effects: {renown: 3},
        result: L("你押的史奎格跑反了方向，但吃掉了终点线，裁判判它赢。", "Your squig runs the wrong way but eats the finish line. The judges award it the win.")},
       {text: L("烤一只吃", "Roast one and eat it"), effects: {hp: 8},
        result: L("比赛结束后，输了的史奎格都进了锅。你分到一块。味道像蘑菇，也像皮鞋。", "After the race, the losers go in the pot. You get a piece. It tastes like mushroom. And boot.")}
     ]},

    {id: "evt_ork_grot_heist", god: "other", factions: ["orks"], minChapter: 3,
     scene: "manufactorum", speaker: SNAG, foe: null,
     text: L("斯纳吉特神秘兮兮地拉你到角落，摊开一张画在油布上的地图：“大老大的牙库。俺们挖地道。”\n地图上画的地道，正好通到史奎格圈的正中间。",
             "Snaggit drags you into a corner and unrolls a map drawn on oilcloth. “Da boss's teef vault. We dig a tunnel.”\nThe tunnel on the map leads straight into the middle of the squig pen."),
     codex: ["ork_gretchin"],
     choices: [
       {text: L("指出地图画错了", "Point out the map's wrong"), effects: {renown: 4},
        result: L("斯纳吉特把地图倒过来看了看。“哦。”他重新画了一张，这回通向厕所。", "Snaggit turns the map upside down. “Oh.” He draws a new one. This time it leads to the latrine.")},
       {text: L("帮他挖", "Help him dig"), effects: {hp: -6, renown: 6},
        result: L("你们挖了三夜，挖进了史奎格圈。跑出来时少了一只鞋，多了五颗牙。", "Three nights of digging lands you in the squig pen. You escape one boot down and five teef up.")},
       {text: L("笑出声", "Laugh out loud"), effects: {sanity: 5},
        result: L("斯纳吉特很生气。可第二天，他又拿着一张新地图来找你了。", "Snaggit is furious. Next day he's back with a new map.")}
     ]}
  ]);

  /* ============ Route rumours (SPEC §20b) ============ */
  function RU(id, minCh, maxCh, speaker, text, codex, when) {
    return {id: id, factions: ["orks"], minChapter: minCh, maxChapter: maxCh, speaker: speaker, text: text, codex: codex, when: when};
  }
  if (WH.registerRumors) WH.registerRumors([
    RU("rum_ork_prophet_plate", 2, 8, L("喝醉的小子", "A drunk boy"),
      L("“先知的脑袋被打穿过，医生佬给换了块铁的。打那以后，戈克和莫克就住进去了。俺也想要块铁的。”",
        "“Da Prophet got shot frew da 'ead. Dok gave 'im a metal one. Gork an' Mork moved right in. I want a metal one too.”"),
      ["ork_ghazghkull"], {sprites: ["ork", "ork_nob"], keywords: {zh: ["先知", "医生佬"], en: ["Prophet", "Dok"]}}),
    RU("rum_ork_armageddon2", 3, 8, L("被俘的老兵", "A captive veteran"),
      L("“哈迪斯巢都那年，一个老政委守了几个月，绿皮最后跑了。你们这个先知，就是当年跑掉的那个。”",
        "“The year of Hades Hive, an old commissar held for months and the greenskins ran. Your Prophet? He's the one who ran.”"),
      ["chr_second_armageddon"], {sprites: ["commissar", "guard_sergeant", "preacher"], keywords: {zh: ["先知", "政委"], en: ["Prophet", "commissar"]}}),
    RU("rum_ork_armageddon3", 5, 8, L("怪小子的嘟囔", "Zograk, muttering"),
      L("“阿玛吉顿第二回……打了好久好久……先知玩腻了就走了。人仔们还在那儿打。真敬业。”",
        "“Armageddon, second go… long, long fight… Prophet got bored an' left. 'Umies still fightin' there. Dedicated.”"),
      ["chr_third_armageddon"], {sprites: ["ork_weirdboy"], keywords: {zh: ["阿玛吉顿"], en: ["Armageddon"]}}),
    RU("rum_ork_beast", 2, 6, L("机械佬的梦话", "Wazgob, talking in his sleep"),
      L("“总有一天，俺要给一颗月亮装上引擎，扔到人仔头上。以前有个大家伙干过。俺能干得更好。”",
        "“Someday I'll put engines on a moon an' drop it on da 'umies. Some big 'un did it once. I'll do it better.”"),
      ["chr_war_of_the_beast"], {sprites: ["ork_mek"], keywords: {zh: ["反应堆", "引擎"], en: ["reactor", "engine"]}}),
    RU("rum_ork_ullanor", 3, 7, L("被涂改的壁画", "A defaced mural"),
      L("旧教堂墙上画着帝皇在乌兰诺击溃兽人帝国。有人用红漆给每个兽人都加了一顶更大的帽子。",
        "The old chapel wall shows the Emperor breaking an ork empire at Ullanor. Someone has painted every ork a bigger hat in red."),
      ["chr_ullanor"], {scenes: ["ruins", "cathedral"], keywords: {zh: ["教堂"], en: ["chapel"]}}),
    RU("rum_ork_octarius", 6, 8, L("自由海盗的水手", "A Freebooter deckhand"),
      L("“奥克塔留斯！虫子吃小子，小子揍虫子，越打越多。全银河最好的仗，俺死前一定要去一趟。”",
        "“Octarius! Bugs eat boyz, boyz krump bugs, an' both keep growin'. Best fight in da galaxy. Gotta see it 'fore I die.”"),
      ["chr_octarius"], {codex: ["ork_freebooterz"], keywords: {zh: ["海盗", "红戈布"], en: ["pirate", "Redgob"]}}),
    RU("rum_ork_rift", 4, 8, L("怪小子", "Zograk"),
      L("“天裂开以后，Waaagh!变得好响好响。戈克和莫克好像也离得更近了。”",
        "“Since da sky cracked, da Waaagh!'s got loud. Real loud. Gork an' Mork feel closer too.”"),
      ["chr_great_rift_opens"], {sprites: ["ork_weirdboy", "omen_gork_mork"], keywords: {zh: ["闪电", "冒烟"], en: ["lightning", "smoking"]}}),
    RU("rum_ork_valda", 1, 4, L("奴隶圈里的人", "Someone in the slave pen"),
      L("“那艘瓦尔达的粮船本该开到奥雷克斯二号。帝国到现在还以为它在亚空间里迷了路。”",
        "“That Valda grain ship was meant for Aurex Secundus. The Imperium still thinks it got lost in the warp.”"),
      ["place_valda_wreck"], {codex: ["place_valda_wreck"], sprites: ["preacher"], keywords: {zh: ["瓦尔达", "什一税"], en: ["Valda", "tithe"]}}),
    RU("rum_ork_carcharos", 2, 5, L("新来的奴隶", "A new slave"),
      L("“我从卡尔卡罗斯逃出来，躲过了邪教，躲过了净化，结果跑到这儿给绿皮拣弹壳。帝皇真会开玩笑。”",
        "“I fled Carcharos: dodged the cults, dodged the purge, and ended up picking shell casings for greenskins. The Emperor has jokes.”"),
      ["place_carcharos"], {sprites: ["preacher"], keywords: {zh: ["奴隶", "俘虏"], en: ["slave", "prisoner"]}}),
    RU("rum_ork_klans", 2, 5, L("斯纳吉特", "Snaggit"),
      L("“黄月亮的牙长得快，所以有钱。死头骷觉得蓝的走运，邪日觉得红的快。都对。兽人信啥，啥就对。”",
        "“Bad Moon teef grow fast, so dey're rich. Deathskulls fink blue's lucky. Evil Sunz fink red's fasta. All true. Wot orks believe, is.”"),
      ["ork_klans"], {sprites: ["gretchin"], keywords: {zh: ["牙币", "红的"], en: ["teef", "red"]}}),
    RU("rum_ork_krork", 5, 8, L("怪小子的梦", "The Weirdboy's dream"),
      L("“很久以前，俺们很聪明。有人造了俺们，去打会动的金属骷髅。后来俺们忘了聪明，只记得打。挺好。”",
        "“Long ago, we was clever. Someone made us to fight walkin' metal skellies. Den we forgot clever. Kept fightin'. S'good.”"),
      ["ork_krork"], {sprites: ["ork_weirdboy"], keywords: {zh: ["戈克", "莫克"], en: ["Gork", "Mork"]}}),
    RU("rum_ork_aurex", 6, 8, L("截获的帝国通讯", "An intercepted Imperial vox"),
      L("“……奥雷克斯二号防务司令部，请确认伊斯卡隆方向的绿色信号……重复，那是一支舰队吗？……”",
        "“…Aurex Secundus defence command, confirm green signal from the Iskaron vector… repeat, is that a fleet?…”"),
      ["place_aurex"], {sprites: ["commissar", "astartes"], keywords: {zh: ["舰队", "星际战士"], en: ["fleet", "Marines"]}})
  ]);

  WH.registerFaction({
    id: "orks",
    name: L("兽人", "Orks"),
    tagline: L("在兽人的废铁场里，做个有用的人仔", "In an ork scrapyard, be a useful 'umie"),
    role: L("废品贩子", "Scrap-trader"),
    world: L("伊斯卡隆", "Iskaron"),
    npcs: {   // SPEC §28 grudges: people the route lets you wrong
      wazgob: {name: L("瓦兹格布", "Wazgob"), aka: [L("机械佬", "Mek")], sprite: "ork_mek"},
      snaggit: {name: L("斯纳吉特", "Snaggit"), sprite: "gretchin"},
      edna: {name: L("老埃德娜", "Old Edna"), aka: [L("埃德娜", "Edna")], sprite: "preacher"}
    },
    playerSprite: "player_orks",
    color: "#6aa84f",
    startNode: "ork_101",
    startDate: {year: 112, mill: 42},
    startStats: {hp: 105, sanity: 95, corruption: 0, renown: 10},
    renownLabel: L("牙币", "Teef"),
    renownIcon: "icon_teef",
    taintMod: {khorne: 1, nurgle: 0.6, tzeentch: 0.6, slaanesh: 0.6},   // SPEC §19/§26: Ork wars feed Khorne; the rest rarely bother
    renownHelp: L("牙币是兽人的钱，也是你在兽人眼里的分量。干活利索、打架不怂就涨；被抓、花钱、怂了就掉。牙币够多，能买通医生佬、换海盗船的铺位，机械佬也才当你是自己人。",
                  "Teef are ork money, and your weight in ork eyes. Working fast, fighting bold and striking deals raise them; getting caught, spending and cowering lower them. Enough teef buys off the Dok, a berth on a pirate ship, and at last the Mek's respect."),
    deathNodes: {hp: "ork_death_hp", sanity: "ork_death_sanity", corruption: "ork_death_corruption"},
    origins: [
      {id: "scrap", name: L("废品贩子", "Scrap-trader"),
       desc: L("拆船星上的零件小贩。腿脚结实，会讲价，可心里总绷着一根弦。", "A parts-hawker on the ship-breaking world. Sturdy legs and a haggler's tongue, but nerves always strung tight."),
       sprite: "player_orks", startNode: "ork_101",
       max: {hp: 105, sanity: 95}, stats: {hp: 105, sanity: 95, corruption: 0, renown: 10}, set: {origin_scrap: true}},
      {id: "guard", name: L("被俘的星界军", "Captured Guardsman"),
       desc: L("驻守船坞的星界军列兵。皮实耐揍，可战壕里的事让你夜里睡不着。", "A Guardsman posted to the docks. You can take a beating, but the trenches haunt your nights."),
       sprite: "guardsman", startNode: "ork_o_guard_1",
       max: {hp: 115, sanity: 95}, stats: {hp: 115, sanity: 95, corruption: 0, renown: 0}, set: {origin_guard: true}},
      {id: "ganger", name: L("巢都帮派分子", "Hab-stack ganger"),
       desc: L("跟着自由海盗抢过总督塔的帮派分子。兜里有牙，人脉够野，身子骨和神经都一般。", "A ganger who looted the governor's tower with Freebooterz. Pockets full of teef and wild contacts; body and nerves only so-so."),
       sprite: "player_orks", startNode: "ork_o_ganger_1",
       max: {hp: 95, sanity: 95}, stats: {hp: 95, sanity: 95, corruption: 0, renown: 20}, set: {origin_ganger: true}}
    ],
    learn: {
      leaders: ["ork_ghazghkull", "ork_gork_mork", "xenos_ork_warboss", "ork_meks", "ork_weirdboyz"],
      enemies: ["imp_imperium", "imp_astartes", "ork_good_fight", "chaos_gods"],
      boss: ["ork_grukka", "ork_great_waaagh"],
      lore: ["xenos_ork", "ork_kultur", "ork_belief_tech", "ork_spores", "ork_gretchin", "ork_squigs", "ork_teef", "ork_klans", "ork_krork"]
    },
    chapters: {
      1: L("大废铁场", "Da Big Scrap"),
      2: L("机械佬的人仔", "Da Mek's 'Umie"),
      3: L("牙币", "Teef"),
      4: L("绿潮", "Da Green Tide"),
      5: L("怪小子", "Da Weirdboy"),
      6: L("不速之客", "Uninvited Guests"),
      7: L("人仔反击", "Da 'Umies Strike Back"),
      8: L("大Waaagh!", "Da Great Waaagh!")
    },
    nodes: N
  });
})();
