/* data/codex_gsc.js — codex entries for the Genestealer Cult route (text role: text-gsc). SPEC §6 + §13 + §26.
 *   text ≤ 45 zh / 30 en · more ≤ 90 zh (required for learn ids) · race/type per SPEC §13.
 *   Old `faction` field uses existing values (xenos for the cult, imperium for Imperial bodies and Kessin's places).
 * Reuses shared ids from data/codex.js: xenos_tyranid, xenos_hive_mind, xenos_genestealer, xenos_hive_tyrant,
 * xenos_shadow_in_warp, imp_imperium, imp_inquisition, imp_arbites, imp_ecclesiarchy, place_hesper, place_aurex,
 * place_carcharos; place_thessa_null (codex_necrons.js); place_arcosa (sector.js).
 */
(function () {
  function L(zh, en) { return {zh: zh, en: en}; }
  function A(zh, en) { return {zh: zh, en: en}; }
  /* E(cat, faction, race, type, sprite, name, text, more, aliases, scene) */
  function E(cat, faction, race, type, sprite, name, text, more, aliases, scene) {
    var e = {cat: cat, faction: faction, race: race, type: type, sprite: sprite, name: name, text: text};
    if (scene) e.scene = scene;
    if (more) e.more = more;
    if (aliases) e.aliases = aliases;
    return e;
  }
  function P(scene, sprite, name, text, more, aliases) {
    return E("place", "imperium", "imperium", "place", sprite, name, text, more, aliases, scene);
  }

  WH.registerCodex({
    /* ---------------- the cult ---------------- */
    gsc_cult: E("lore", "xenos", "tyranids", "organization", "gsc_neophyte", L("基因窃取者教派", "Genestealer Cult"),
      L("潜伏在帝国世界里的异形教派。它像一个大家庭：管饭，护短，一代比一代更不像人。",
        "An alien cult hidden inside Imperial worlds. It works like a big family: food, protection, and each generation less human."),
      L("一只基因窃取者潜入一颗星球，感染第一个宿主，几代之后就有了成百上千的混血后代。他们互助、结社、渗透矿工会和防卫军，真心相爱，也真心相信救赎会从天而降。他们不知道自己是谁的诱饵。",
        "One genestealer reaches a world and infects a first host; generations later there are hundreds of hybrid descendants. They help each other, organise, seep into unions and garrisons, love one another truly, and truly believe salvation will fall from the sky. They do not know whose bait they are."),
      A(["基因窃取者教派", "四臂帝皇教派", "教派"], ["Genestealer Cult", "Cult of the Four-Armed Emperor", "cult"])),

    gsc_four_armed: E("leader", "xenos", "tyranids", "deity", "omen_four_armed", L("四臂帝皇", "The Four-Armed Emperor"),
      L("教派崇拜的神：帝皇的“真容”，有四只手臂，足够抱住所有家人。",
        "The cult's god: the Emperor's “true face,” with four arms, enough to hold the whole family."),
      L("教派不说背叛了帝皇，只说找到了真正的帝皇。圣像里的四臂之神越来越像地底的老祖宗。信徒相信祂会派星之子降临，接走受苦的人。这份信仰让他们隐忍几十年，也让他们在最后一天仰起头。",
        "The cult does not say it betrayed the Emperor; it says it found the true one. The four-armed god in its icons looks more and more like the Grandsire below. Believers expect it to send the Star Children to lift the oppressed away. That faith keeps them patient for decades, and makes them look up on the last day."),
      A(["四臂帝皇", "四臂像", "四只手的帝皇", "真正的帝皇"], ["Four-Armed Emperor", "four-armed Emperor", "four-armed icon", "true Emperor"])),

    gsc_patriarch: E("leader", "xenos", "tyranids", "figure", "gsc_patriarch", L("族长（老祖宗）", "The Patriarch (the Grandsire)"),
      L("最初那只基因窃取者。它藏在最深处，活得比所有子孙都久，是整个教派的心脏。",
        "The first genestealer. It hides in the deepest dark, outlives all its descendants, and is the heart of the whole cult."),
      L("族长随年岁越长越大，用灵能把每个后代连在自己身上。家人爱它，像爱一位慈祥的祖辈。它本身就是一座灯塔，在亚空间里一遍遍呼唤，直到远方的虫巢舰队听见。舰队到来时，它也只是一顿饭。",
        "A Patriarch grows vast with age and binds every descendant to itself psychically. The family loves it like a kindly ancestor. Its very existence is a beacon, calling through the warp until a distant hive fleet hears. When the fleet comes, it too is only a meal."),
      A(["老祖宗", "族长"], ["Grandsire", "Patriarch"])),

    gsc_magus: E("leader", "xenos", "tyranids", "unit", "gsc_magus", L("主祭", "The Magus"),
      L("教派的灵能祭司与传道人，声音温柔，能直接说进人的脑子里。",
        "The cult's psychic priest and preacher. Gentle-voiced, he speaks straight into your mind."),
      L("主祭是混血后代里最像人的一类，常常顶着神父、工会领袖或官员的身份公开活动。他替族长说话，用歌声和灵能让信众同心同念，也能“治好”怀疑的人。最后一天，他往往是最真心欢迎星之子的那个。",
        "Magi are among the most human-looking of the hybrids, often living openly as preachers, union leaders or officials. They speak for the Patriarch, unite the faithful through song and psychic power, and can ‘heal’ doubters. On the last day they are often the most sincere in welcoming the Star Children."),
      A(["主祭"], ["Magus"])),

    gsc_primus: E("leader", "xenos", "tyranids", "unit", "gsc_primus", L("首领", "The Primus"),
      L("教派的军事统帅，骨棱高耸，冷静，负责为“那一天”训练和布置一切。",
        "The cult's war-leader: tall-ridged, cold, training and placing everything for the Day."),
      L("首领是为战争而生的混血儿，能把几代矿工、工人和士兵编成一支看不见的军队。他知道每箱炸药藏在哪，每个内应在哪个岗位。他不信奇迹，只信准备。可天上降下来的东西，他没准备。",
        "A Primus is a hybrid born for war, able to shape generations of miners, workers and soldiers into an invisible army. He knows where every crate of explosive lies and which post each insider holds. He trusts preparation, not miracles. For what falls from the sky, he never prepared."),
      A(["首领"], ["Primus"])),

    /* ---------------- lore ---------------- */
    gsc_generations: E("lore", "xenos", "tyranids", "concept", "gsc_acolyte", L("一代又一代", "The Generations"),
      L("混血后代分为四代：第一代最像怪物，第四代几乎和人一模一样。",
        "Hybrids come in four generations: the first most monstrous, the fourth almost indistinguishable from humans."),
      L("被感染的宿主生下第一代：多臂、甲壳、骨棱。此后第二代、第三代，一代比一代更像人。第四代看上去完全是人，常有灵能，而他们的后代里又会出现新的纯种基因窃取者。循环就这样闭合。",
        "An infected host bears the first generation: extra arms, chitin, ridged skulls. Through human partners come the second and third, each more human. The fourth look wholly human and are often psychic, and among their offspring new purestrain genestealers appear. So the circle closes."),
      A(["第一代", "第二代", "第三代", "第四代", "混血"], ["first generation", "second generation", "third generation", "fourth generation", "hybrid", "hybrids"])),

    gsc_neophyte: E("lore", "xenos", "tyranids", "unit", "gsc_neophyte", L("新信徒", "Neophyte Hybrids"),
      L("后几代的混血儿，几乎像人，在矿井、工厂和军营里过着普通人的日子。",
        "Later-generation hybrids, nearly human, living ordinary lives in mines, factories and barracks."),
      null, A(["新信徒", "表兄弟", "表亲"], ["neophyte", "cousins"])),

    gsc_acolyte: E("lore", "xenos", "tyranids", "unit", "gsc_acolyte", L("侍僧", "Acolyte Hybrids"),
      L("早几代的混血儿，多臂、有甲壳，平时藏在兜帽和地底下，是教派最可靠的力气。",
        "Early-generation hybrids with extra arms and chitin, hidden under hoods and underground: the cult's surest strength."),
      null, A(["侍僧"], ["acolyte"])),

    gsc_broodmind: E("lore", "xenos", "tyranids", "concept", "gsc_magus", L("族群意识", "The Broodmind"),
      L("把所有家人连在一起的灵能纽带。信徒说，从此再也不会孤单。",
        "The psychic bond linking every member of the family. Believers say you are never alone again."),
      L("族群意识以族长为中心，像一阵温暖的嗡鸣。它让教派同悲同喜，让秘密几十年不外泄，也让怀疑像发烧一样被“治好”。它只是虫巢意志的一小片回声。真正的声音到来时，嗡鸣会被一口吞没。",
        "Centred on the Patriarch, the Broodmind feels like a warm hum. It makes the cult grieve and rejoice as one, keeps secrets for decades, and ‘heals’ doubt like a fever. It is a small echo of something vaster, the Hive Mind. When the true voice arrives, the hum is swallowed whole."),
      A(["族群意识", "嗡鸣"], ["Broodmind", "the hum"])),

    gsc_ascension: E("lore", "xenos", "tyranids", "concept", "omen_star_children", L("升天之日", "The Day of Ascension"),
      L("教派等待了几代人的起义之日：炸药、内应、成千上万的家人同时起事。",
        "The uprising the cult waits generations for: explosives, insiders, tens of thousands rising at once."),
      L("那一天，防卫军调转炮口，执法局从里面打开大门，矿井里涌出几代人。教派常能赢下这一仗，夺下星球的“脑袋”。可起义真正的用处，是在虫巢舰队到来前削弱守军。升天之后，就轮到他们自己。",
        "On that Day the garrison turns its guns, the precinct opens from inside, and whole generations pour from the mines. The cult often wins and seizes the world's ‘head.’ But the rising's real purpose is to weaken the defenders before the hive fleet arrives. After the Ascension, the cult is next."),
      A(["升天之日", "那一天"], ["Day of Ascension", "the Day"])),

    gsc_star_children: E("boss", "xenos", "tyranids", "concept", "omen_star_children", L("星之子", "The Star Children"),
      L("教派祈祷的救主，会从天上降临。真相是：一支泰伦虫巢舰队。",
        "The saviours the cult prays to, who will descend from the sky. The truth: a Tyranid hive fleet."),
      L("族长的灵能呼唤像信标，把虫巢舰队引向这颗星球。信徒梦见紫色的天和落下的星星，以为那是拥抱。舰队降临时，虫群不认识任何人：守军、平民、跪着唱歌的家人，全成了生物质，族长也一样。",
        "The Patriarch's psychic call is a beacon drawing the hive fleet to the world. Believers dream of a violet sky and falling stars and think it an embrace. When the fleet descends the swarm knows no one: defenders, civilians, kneeling kin singing hymns. All become biomass, the Patriarch too."),
      A(["星之子"], ["Star Children"])),

    /* ---------------- Imperial ---------------- */
    gsc_pdf: E("enemy", "imperium", "imperium", "organization", "guard_sergeant", L("行星防卫军", "Planetary Defence Force"),
      L("每颗帝国世界自己的守军，装备差、训练少，是星球的第一道也常常是最后一道防线。",
        "Each Imperial world's own garrison: poorly armed, lightly trained, the first and often the last line of defence."),
      L("防卫军从本地征召，所以最容易被渗透。教派的儿女穿上军装，几十年后，一个团有一半人星期天去同一户人家吃饭。起义那天，炮口一齐转向。对教派来说，防卫军既是敌人，也是还没收回的家产。",
        "The PDF recruits locally, so it is the easiest to infiltrate from within. The cult's children put on uniforms, and decades later half a regiment eats at the same house on Sundays. On the Day the guns all swing round. To the cult, the PDF is both enemy and family property not yet reclaimed."),
      A(["行星防卫军", "防卫军"], ["Planetary Defence Force", "PDF"])),

    /* ---------------- places (Kessin Tertius) ---------------- */
    place_kessin: P("mine_shaft", "player_gsc", L("凯辛三号", "Kessin Tertius"),
      L("阿尔科萨星区的采矿星，矿石运往奥雷克斯二号。地面荒凉，人都住在地下。",
        "A mining world of the Arcosa Sector shipping ore to Aurex Secundus. The surface is barren; people live below."),
      L("凯辛三号在帝国账本上只是一行矿产数字。什一税年年上涨，医官一年来两次，执法官只管罢工。在这样一颗星上，谁给你一碗热汤，你就跟谁走。115.M42，它的天变成了紫色。",
        "On the Imperium's ledger Kessin Tertius is a line of ore figures. The tithe rises every year, the medic comes twice a year, the enforcers only handle strikes. On a world like this, you follow whoever gives you hot soup. In 115.M42 its sky turned violet."),
      A(["凯辛三号", "凯辛"], ["Kessin Tertius", "Kessin"])),

    place_shaft_nine: P("mine_shaft", "player_gsc", L("九号矿井", "Shaft Nine"),
      L("凯辛三号最深的矿井之一。一班十四个小时，空气又湿又甜。",
        "One of Kessin Tertius's deepest shafts. Fourteen-hour shifts; the air is damp and sweet."),
      null, A(["九号矿井"], ["Shaft Nine"])),

    place_hollin_house: P("hive_hab", "medicae", L("霍林家", "The Hollin House"),
      L("矿区里永远挤满人的那户人家。星期天总多做一份饭，墙上挂着四臂帝皇像。",
        "The always-crowded house in the mining district. One extra plate every Sunday; a four-armed Emperor on the wall."),
      null, A(["霍林家"], ["Hollin house", "the Hollins"])),

    place_hollin_chapel: P("gsc_chapel", "gsc_magus", L("粮仓下的礼拜堂", "The Chapel Under the Grain Store"),
      L("藏在粮仓地下的教派礼拜堂。几百人挤在一起，不说话，却像在一起呼吸。",
        "The cult's chapel hidden beneath the grain store. Hundreds pack in silently, breathing as one."),
      null, A(["礼拜堂"], ["chapel"])),

    place_deep_cavern: P("cult_shrine", "gsc_patriarch", L("十三号矿井深处", "The Depths of Shaft Thirteen"),
      L("封了三十年的废矿井。最底下是育婴房、操练场，和老祖宗的洞窟。",
        "A shaft sealed thirty years. At the bottom: the nursery, the drill-ground, and the Grandsire's cavern."),
      null, A(["十三号矿井"], ["Shaft Thirteen"]))
  });
})();
