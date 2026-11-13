/* data/codex_mechanicus.js — codex entries for the Adeptus Mechanicus route (text role: text-mechanicus). SPEC §6, §13, §26, §27.
 *   text ≤ 45 zh / 30 en · more ≤ 90 zh (given for every learn id) · race/type per SPEC §13.
 * Reuses shared ids, never redefines them: imp_mechanicus, imp_servitor, imp_imperium, imp_guard, place_aurex (codex.js),
 * nec_necrons / nec_living_metal / nec_canoptek / place_thessa_null (codex_necrons.js), xenos_ork / xenos_waaagh, god_*.
 * One chronicle entry (chr_schism_of_mars, SPEC §20 shape) lives here because only this route unlocks it.
 * Load after data/codex_necrons.js (and before events/factions).
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
  function P(race, scene, sprite, name, text, more, aliases) {
    return E("place", "imperium", race, "place", sprite, name, text, more, aliases, scene);
  }

  WH.registerCodex({
    /* ---------------- leaders ---------------- */
    mech_omnissiah: E("leader", "imperium", "imperium", "deity", "omen_omnissiah", L("万机之神", "The Omnissiah"),
      L("机械神教崇拜的神：一切知识与机器的源头。神甫们相信，帝皇就是它在人间的化身。",
        "The god of the Cult Mechanicus, source of all knowledge and every machine. Most tech-priests hold that the Emperor is its avatar."),
      L("机械神教相信宇宙中有一位机械之神，每一台机器都有它赐予的机魂，知识本身就是祈祷。帝皇被奉为它的化身万机之神，这是火星与泰拉结盟的根基。也有人私下怀疑：神和化身，未必是同一位。",
        "The Cult holds that a Machine God moves through the universe, granting every machine its spirit; knowledge itself is prayer. The Emperor is revered as its avatar, the Omnissiah, the root of the alliance between Mars and Terra. Some whisper that god and avatar need not be the same."),
      A(["欧姆尼赛亚", "机械之神", "机械神"], ["Omnissiah", "Machine God"])),

    mech_fabricator_general: E("leader", "imperium", "imperium", "figure", "omen_mars", L("火星铸造将军", "The Fabricator-General of Mars"),
      L("火星的最高统治者，机械神教之首，同时在泰拉的高领主议会里占着一席。",
        "Ruler of Mars and head of the Adeptus Mechanicus, who also holds a seat among the High Lords of Terra."),
      L("铸造将军统辖火星和成千上万的铸造世界，泰坦、战舰、激光枪，大都出自他的治下。火星供给泰拉工业，泰拉不干涉火星的信仰。大裂隙撕开银河后，火星与许多铸造世界的联系时断时续。",
        "The Fabricator-General governs Mars and countless forge worlds; Titans, warships and lasguns alike come from his domain. Mars feeds Terra's war; Terra leaves Mars its faith. Since the Great Rift tore the galaxy, the link between Mars and many forge worlds flickers."),
      A(["铸造将军", "火星的统治者"], ["Fabricator-General", "Fabricator General"])),

    mech_cawl: E("leader", "imperium", "imperium", "figure", "omen_cawl", L("贝利撒留·考尔", "Belisarius Cawl"),
      L("活了一万多年的大贤者，原铸星际战士的缔造者。有人叫他天才，有人叫他异端。",
        "An Archmagos over ten thousand years old, creator of the Primaris Space Marines. Some call him genius; some, heretic."),
      L("考尔受基里曼之托，用一万年秘密打造出原铸星际战士。他声称一切都源于“重新发现”的古老知识，可他的工坊里，新东西似乎多得有点可疑。传说他还藏着几个自己的备份。",
        "At Guilliman's behest Cawl spent ten thousand years secretly creating the Primaris Space Marines. He insists it was all ancient knowledge rediscovered, yet his workshop holds suspiciously many new things. Rumour says he keeps spare copies of himself."),
      A(["考尔", "大贤者考尔"], ["Cawl", "Archmagos Cawl"])),

    mech_magi: E("leader", "imperium", "imperium", "organization", "magos", L("贤者与技术神甫", "Magi and Tech-Priests"),
      L("机械神教的祭司阶层。地位越高，身上剩下的血肉越少，说话越像在念参数。",
        "The priesthood of the Cult Mechanicus. The higher the rank, the less flesh remains and the more their speech sounds like a parameter list."),
      L("从书记神甫、铸工神甫到贤者、大贤者，晋升靠的是知识和对万机之神的虔诚。每升一级，就换掉一部分“软弱的肉体”。他们用二进制祈祷，用圣油和焚香安抚机器，也把人当作零件来计算。",
        "From lexmechanic and enginseer to Magos and Archmagos, advancement comes through knowledge and devotion. Each step trades away more 'weak flesh'. They pray in binary, soothe machines with unguents and incense, and calculate people as components."),
      A(["贤者", "技术神甫", "神甫", "书记神甫", "铸工神甫"], ["Magos", "Magi", "tech-priest", "lexmechanic", "enginseer"])),

    mech_skitarii: E("leader", "imperium", "imperium", "unit", "skitarius", L("护教军", "Skitarii"),
      L("机械神教的改造士兵，由铸造世界自己组建。一块教条晶片，就能改写他们的勇气。",
        "The Mechanicus's cyborg soldiers, raised by each forge world. A single doctrina wafer can rewrite their courage."),
      L("护教军多半从小被改造（格拉维克斯缺员时，也从杂役里抽签）。身体大半是机械，靠贤者远程下达的教条指令作战。辐射卡宾枪、电弧步枪是他们的标配。他们会记住自己的编号，很少记得自己的名字。",
        "Mostly augmented from youth (when Gravex runs short, menials are drafted by lot), largely machine, the Skitarii fight by doctrina imperatives broadcast from their Magi. Radium carbines and galvanic rifles are their standard. They remember their designations; seldom their names."),
      A(["护教军", "护教军士兵", "阿尔法"], ["Skitarii", "Skitarius", "Alpha"])),

    /* ---------------- lore ---------------- */
    mech_machine_spirit: E("lore", "imperium", "imperium", "concept", "tech_priest", L("机魂", "Machine Spirit"),
      L("每台机器里都住着一个灵。它满意时机器运转，它被冒犯时，机器就会罢工。",
        "Every machine houses a spirit. Pleased, it runs. Offended, it stops."),
      L("神甫们用焚香、圣油、祷文和正确的敲击顺序安抚机魂。这听起来像迷信，可在一个没人真正懂原理的帝国里，按仪式维护的机器确实更少出错。至于机魂是否真的存在，没有一个神甫敢说“不”。",
        "Tech-priests soothe machine spirits with incense, unguents, litanies and the correct sequence of taps. It sounds like superstition, yet in an Imperium where no one truly understands the principles, ritually maintained machines do fail less. Whether the spirits are real, no tech-priest dares say no."),
      A(["机魂", "机器之灵"], ["machine spirit", "machine-spirit"])),

    mech_stc: E("lore", "imperium", "imperium", "concept", "omen_omnissiah", L("标准模板构造（STC）", "Standard Template Construct (STC)"),
      L("黑暗科技时代留下的万能设计库。帝国的一切造物，几乎都抄自它的残片。",
        "A universal design library from the Dark Age of Technology. Nearly everything the Imperium builds is copied from its fragments."),
      L("在人类最辉煌的年代，STC系统让任何殖民地都能造出所需的一切。纷争时代后它们散落失传，留下的只是残片。找到一块完整的STC，是每个神甫毕生的梦，也可能是一场引来半个银河争夺的灾难。",
        "In humanity's golden age, STC systems let any colony build whatever it needed. After the Age of Strife they were scattered and lost; only fragments remain. Finding a complete STC is every tech-priest's dream, and a disaster that could draw half the galaxy to fight over it."),
      A(["STC", "标准模板", "STC残片"], ["STC", "Standard Template", "STC fragment"])),

    mech_tech_heresy: E("lore", "imperium", "imperium", "concept", "dark_mechanicus", L("技术异端", "Tech-Heresy"),
      L("擅自创新、篡改圣设计、造会思考的机器，都是对万机之神的冒犯。",
        "Unsanctioned invention, altering a holy design, building a machine that thinks: all are offences against the Omnissiah."),
      L("神教认为一切知识早已存在，人只能“重新发现”，不能发明。最可怕的禁忌是人工智能，传说黑暗科技时代的铁人曾反叛并几乎毁灭人类。被判技术异端的神甫，轻则被拆成机仆，重则连名字一起抹去。",
        "The Cult holds that all knowledge already exists; one may rediscover, never invent. The gravest taboo is artificial intelligence: legend says the Men of Iron of the Dark Age rose and nearly ended humanity. A tech-heretic may be rebuilt as a servitor, or erased down to the name."),
      A(["技术异端", "异端技术", "会思考的机器", "铁人"], ["tech-heresy", "tech-heretic", "thinking machine", "Men of Iron"])),

    mech_treaty_olympus: E("lore", "imperium", "imperium", "concept", "omen_mars", L("奥林匹斯条约", "The Treaty of Olympus"),
      L("帝皇与火星立下的盟约：火星给帝国工业，帝国给火星自治。",
        "The pact between the Emperor and Mars: Mars gives the Imperium industry, the Imperium gives Mars autonomy."),
      L("统一泰拉后，帝皇来到火星，被神甫们认作万机之神降临。双方订约：火星供应大远征所需的武器，保有自己的法律与信仰。一万年来条约还在，但机械神教始终是帝国里一个半独立的国度。",
        "After uniting Terra the Emperor came to Mars, and the tech-priests hailed him as the Omnissiah made manifest. The pact: Mars armed the Great Crusade and kept its own laws and faith. Ten thousand years on it still holds, and the Mechanicus remains a half-independent realm within the Imperium."),
      A(["条约", "火星盟约"], ["Treaty of Olympus", "the Treaty"])),

    mech_quest_knowledge: E("lore", "imperium", "imperium", "concept", "explorator", L("求知之旅", "The Quest for Knowledge"),
      L("神教的终极使命：找回散落的一切知识，直到能理解万机之神本身。",
        "The Cult's highest calling: recover all scattered knowledge, until the Machine God itself can be understood."),
      L("为了求知，探索舰队深入未知星域，闯进异形墓穴，翻遍死去的世界。神甫们相信每一块残片都让人类离神更近一步。至于代价，常常是整支舰队，偶尔是整个星球。",
        "For the Quest, explorator fleets plunge into unknown space, break into alien tombs and sift dead worlds. Every fragment, the priests believe, brings humanity a step closer to the god. The price is often a whole fleet, now and then a whole world."),
      A(["求知", "知识探求"], ["Quest for Knowledge", "the Quest"])),

    mech_menials: E("lore", "imperium", "imperium", "concept", "player_mechanicus", L("杂役与转化线", "Menials and the Conversion Line"),
      L("铸造世界最底层的人类劳力。完不成配额，就会被送去改造成机仆。",
        "The forge world's lowest human labour. Miss your quota, and you are sent to be made into a servitor."),
      L("杂役没有植入体，没有编号以外的名字，在熔炉边干到倒下为止。对神甫来说，他们和机仆只差一道手术：一个还会抱怨，一个已经不会了。从杂役爬进神教，几乎和从熔炉里爬出来一样难。",
        "Menials have no implants and no name beyond a number; they work the furnaces until they drop. To a tech-priest, menial and servitor differ by one surgery: one still complains, the other no longer can. Climbing from menial into the Cult is nearly as hard as climbing out of the furnace."),
      A(["杂役", "转化线", "配额"], ["menial", "conversion line", "quota"])),

    mech_rite_pure_thought: E("lore", "imperium", "imperium", "concept", "magos", L("纯思仪式", "The Rite of Pure Thought"),
      L("切除大脑中掌管情感的部分，让思考不再受恐惧与爱打扰。",
        "Excising the parts of the brain that govern feeling, so that fear and love no longer disturb thought."),
      null,
      A(["纯思仪式", "纯思"], ["Rite of Pure Thought", "Pure Thought"])),

    mech_electro_priests: E("lore", "imperium", "imperium", "unit", "electro_priest", L("电祭司", "Electro-Priests"),
      L("把身体当作导线的狂信者。他们相信电流就是神的原动力，碰一下就知道了。",
        "Zealots who use their bodies as conductors. They believe current is the god's Motive Force. One touch convinces you."),
      null, A(["电祭司", "原动力"], ["Electro-Priest", "Motive Force"])),

    mech_kastelan: E("lore", "imperium", "imperium", "unit", "kastelan_robot", L("卡斯特兰机器人", "Kastelan Robot"),
      L("古老的战斗机器人，只能执行数据铸匠插入的指令晶片，绝不允许自己思考。",
        "Ancient battle robots that run only the protocol wafers a datasmith inserts. They are never allowed to think for themselves."),
      null, A(["卡斯特兰", "机器人"], ["Kastelan", "robot"])),

    mech_explorators: E("lore", "imperium", "imperium", "organization", "explorator", L("探索舰队", "Explorator Fleets"),
      L("驶向帝国边界之外的神甫舰队，专找失落的科技，也专找麻烦。",
        "Fleets of tech-priests sailing beyond the Imperium's borders, hunting lost technology. And trouble."),
      null, A(["探索贤者", "探索舰", "探索舰队"], ["explorator", "Explorator"])),

    mech_noosphere: E("lore", "imperium", "imperium", "concept", "tech_priest", L("数据圈", "The Noosphere"),
      L("神甫们植入体之间无形的数据网络。在里面，祈祷和文件是同一种东西。",
        "The invisible data-web between tech-priests' implants. In it, a prayer and a file are the same thing."),
      null, A(["数据圈", "二进制"], ["noosphere", "binary", "binharic"])),

    /* ---------------- enemies ---------------- */
    mech_dark_mechanicum: E("enemy", "chaos", "chaos", "organization", "dark_mechanicus", L("黑暗机械教", "The Dark Mechanicum"),
      L("背叛的技术神甫。他们向混沌求取知识，把恶魔封进机器里。",
        "Traitor tech-priests who seek knowledge from Chaos and bind daemons into machines."),
      L("荷鲁斯之乱时，半个火星追随叛军，史称火星分裂。他们的后继者在恐惧之眼里建起铸造世界，不受任何禁忌约束：会思考的机器、血肉与黄铜的融合、装着恶魔的引擎。奸奇最爱他们的好奇心。",
        "In the Horus Heresy half of Mars followed the traitors: the Schism of Mars. Their heirs build forge worlds in the Eye of Terror, bound by no taboo: thinking machines, flesh fused with brass, engines with daemons inside. Tzeentch loves their curiosity best."),
      A(["黑暗机械教", "黑暗机械神教", "异端神甫"], ["Dark Mechanicum", "Hereteks", "heretek"])),

    mech_scrapcode: E("enemy", "chaos", "chaos", "concept", "dark_mechanicus", L("废码", "Scrapcode"),
      L("混沌污染的数据病毒。它不破坏机器，只是让机器开始想别的事。",
        "A Chaos-tainted data plague. It doesn't break machines; it makes them start thinking about other things."),
      null, A(["废码", "数据瘟疫"], ["scrapcode", "data plague"])),

    /* ---------------- boss ---------------- */
    mech_daemon_engine: E("boss", "chaos", "chaos", "unit", "daemon_engine", L("恶魔引擎", "Daemon Engine"),
      L("被封进黄铜与钢铁里的恶魔。它会饿，会怒，会笑，唯独不会停。",
        "A daemon bound into brass and steel. It hungers, rages and laughs. It never stops."),
      L("异端神甫和混沌的铸魔匠召来恶魔，锁进炮管、履带和铁爪，造出活的战争机器。恶魔憎恨牢笼，便摧毁笼外的一切。对万机之神的信徒来说，这是最彻底的亵渎：机魂被换成了恶魔。",
        "Hereteks and Chaos warpsmiths summon daemons and lock them in gun barrels, treads and iron claws, making living war machines. The daemon hates its cage, so it destroys everything outside it. To the Omnissiah's faithful it is the ultimate blasphemy: a machine spirit replaced by a daemon."),
      A(["恶魔引擎", "铸魔"], ["daemon engine", "Daemon Engine"])),

    mech_warsmith: E("boss", "chaos", "chaos", "figure", "dark_mechanicus", L("黑暗马戈斯塞瑞丁", "Dark Magos Syrredin"),
      L("黑暗机械教的马戈斯，自称“未缚者”。他要的不是格拉维克斯，是它的熔炉。",
        "A Dark Mechanicum magos who calls himself the Unbound. He doesn't want Gravex. He wants its furnaces."),
      L("塞瑞丁曾是某个铸造世界的贤者，因为想“多知道一点”被判为异端。他逃进大裂隙，在那里找到了愿意回答一切问题的东西。他把恶魔引擎当作祈祷文来写，把被俘的铸造世界改造成生产恶魔的工厂。",
        "Syrredin was once a Magos of some forge world, condemned for wanting to know a little more. He fled into the Great Rift and found something there that would answer every question. He writes daemon engines like prayers and turns captured forge worlds into factories for daemons."),
      A(["塞瑞丁", "黑暗马戈斯", "未缚者"], ["Syrredin", "Dark Magos", "the Unbound"])),

    /* ---------------- places ---------------- */
    place_gravex: P("imperium", "forge_floor", "omen_omnissiah", L("格拉维克斯铸造世界", "Forge World Gravex"),
      L("阿尔科萨星区唯一的铸造世界。天空是红色的，雨里有铁。你的家。",
        "The Arcosa Sector's only forge world. The sky is red and the rain tastes of iron. Your home."),
      L("整颗星球的地表都铺满了熔炉和制造厂，百万杂役为它添火。它给奥雷克斯二号的团造激光枪，也资助过忒萨零号的考察队。大裂隙之后，火星的声音时有时无，格拉维克斯只能自己祈祷。",
        "Furnaces and manufactorums pave the whole surface; a million menials feed them. It makes lasguns for Aurex Secundus's regiments and once sponsored the dig on Thessa Null. Since the Great Rift, the voice of Mars comes and goes, and Gravex must pray on its own."),
      A(["格拉维克斯", "铸造世界"], ["Gravex", "forge world"])),

    place_gravex_vault: P("imperium", "tech_vault", null, L("第七圣库", "The Seventh Vault"),
      L("格拉维克斯的知识宝库，一半是档案，一半是不许打开的门。",
        "Gravex's repository of knowledge: half archive, half doors that must never be opened."),
      null, A(["圣库", "第七圣库"], ["the Vault", "Seventh Vault"])),

    place_mars: P("imperium", "mars_vista", "omen_mars", L("火星", "Mars"),
      L("红色星球，机械神教的圣地。整颗行星都是一座工厂。",
        "The Red Planet, holy world of the Mechanicus. The whole planet is one factory."),
      L("火星是帝国最古老的铸造世界，表面被熔炉、圣库和泰坦军团的营地覆盖。每个神甫都梦想去朝圣一次。大多数人一辈子只在数据圈里听过它的声音。",
        "Mars is the Imperium's oldest forge world, its surface paved with furnaces, vaults and Titan Legion fortresses. Every tech-priest dreams of a pilgrimage. Most only ever hear its voice through the noosphere."),
      A(["火星", "红色星球"], ["Mars", "Red Planet"])),

    place_tomb_moon: P("necrons", "tomb_exterior", null, L("G-7号卫星", "Moonlet G-7"),
      L("阿尔科萨星区边缘，一颗气态巨星的无名卫星。探索舰队在上面找到了一座黑色金字塔。",
        "A nameless moon of a gas giant at the Arcosa Sector's edge. The explorators found a black pyramid on it."),
      null, A(["G-7", "墓穴卫星"], ["G-7", "tomb moon"])),

    /* ---------------- chronicle (SPEC §20 shape) ---------------- */
    chr_schism_of_mars: {cat: "lore", faction: "any", race: "chaos", type: "concept", tags: ["chronicle"],
      sprite: "dark_mechanicus", date: L("M31初，荷鲁斯之乱早期", "early M31, early in the Heresy"), sortKey: 31005.5,
      name: L("火星分裂", "The Schism of Mars"),
      text: L("荷鲁斯叛乱之初，火星的铸造将军倒向叛军，红色星球陷入内战。",
        "As Horus rebelled, the Fabricator-General of Mars sided with him, and the Red Planet fell into civil war."),
      more: L("铸造将军凯尔博-哈尔打开了封存禁忌知识的圣库，被污染的数据像瘟疫一样在火星蔓延。忠于帝皇的神甫被围攻，叛变的一方后来成了黑暗机械教。火星从此对“好奇心”格外警惕。",
        "Fabricator-General Kelbor-Hal opened a vault of sealed, forbidden knowledge, and its corrupted data spread across Mars like a plague. Loyalist priests were besieged; the traitors became the Dark Mechanicum. Ever since, Mars has been wary of curiosity."),
      aliases: A(["凯尔博-哈尔"], ["Kelbor-Hal", "Schism"])}
  });
})();
