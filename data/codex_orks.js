/* data/codex_orks.js — codex entries for the Ork route (text role: text-orks). SPEC §6 + §13 + §26 + §27.
 *   text ≤ 45 zh / 30 en · more ≤ 90 zh (required for learn ids) · race/type per SPEC §13.
 * Reuses shared ids from data/codex.js: xenos_ork, xenos_waaagh, xenos_ork_warboss, imp_imperium, imp_guard, imp_astartes,
 *   imp_commissar, chaos_gods, chaos_heretic_astartes, god_khorne… (not duplicated here).
 * Route world (SPEC §27): Iskaron 伊斯卡隆, ship-breaking world of the Arcosa Sector, overrun by a Waaagh! in 112.M42.
 * Named canon figures (Ghazghkull, Gork & Mork) only ever use omen_* sprites.
 */
(function () {
  function L(zh, en) { return {zh: zh, en: en}; }
  function A(zh, en) { return {zh: zh, en: en}; }
  /* E("race/type", cat, faction, sprite, name, text, more, aliases, scene) — same shape as data/codex.js */
  function E(rt, cat, faction, sprite, name, text, more, aliases, scene) {
    var r = rt.split("/");
    var e = {cat: cat, faction: faction, race: r[0], type: r[1], sprite: sprite, name: name, text: text};
    if (scene) e.scene = scene;
    if (more) e.more = more;
    if (aliases) e.aliases = aliases;
    return e;
  }
  function P(race, scene, sprite, name, text, more, aliases) {
    return E(race + "/place", "place", "orks", sprite, name, text, more, aliases, scene);
  }

  WH.registerCodex({
    /* ---------------- leaders ---------------- */
    ork_ghazghkull: E("orks/figure", "leader", "orks", "omen_waaagh", L("加兹库尔·萨拉卡", "Ghazghkull Thraka"),
      L("兽人的“先知”。头部重伤后装上金属头骨，从此声称戈克与莫克在他脑中说话。",
        "Da Prophet of the orks. After a terrible head wound his skull was rebuilt in metal, and since then he says Gork and Mork speak to him."),
      L("他曾是个普通的兽人小子，伤愈后却像变了一个人：能谋划，能统合各部落。他两度进攻阿玛吉顿，与政委雅瑞克纠缠半个多世纪。他走到哪里，最大的Waaagh!就跟到哪里。",
        "Once an ordinary boy, he rose from his wound changed: a planner, a uniter of klans. He invaded Armageddon twice and fought Commissar Yarrick for over half a century. Wherever he goes, the biggest Waaagh! follows."),
      A(["加兹库尔", "先知", "大先知"], ["Ghazghkull", "da Prophet", "Prophet"])),

    ork_gork_mork: E("orks/deity", "leader", "orks", "omen_gork_mork", L("戈克与莫克", "Gork and Mork"),
      L("兽人的两位神。一个凶但狡猾，一个狡猾但凶。哪个是哪个，兽人自己也吵个不停。",
        "The two ork gods. One is brutal but kunnin', the other kunnin' but brutal. Orks never stop arguing which is which."),
      L("兽人相信这两个巨大的绿色神明住在亚空间里，永远在打架，打得很开心。他们不要祭品，也不要祈祷，只要一场好仗。兽人打得越凶，神就越高兴。",
        "Orks believe these two vast green gods dwell in the warp, forever brawling and loving it. They want no offerings and no prayers, only a good fight. The harder orks fight, the happier the gods."),
      A(["戈克", "莫克", "两个大家伙"], ["Gork", "Mork"])),

    ork_meks: E("orks/unit", "leader", "orks", "ork_mek", L("机械佬", "Meks"),
      L("兽人的工匠。他们不识字、不画图，却天生知道怎么用废铁造出枪、车和巨型机器。",
        "Ork engineers. They can't read and draw no plans, yet are born knowing how to turn scrap into guns, buggies and giant machines."),
      L("造东西的知识刻在机械佬的血里，就像打架刻在每个兽人的血里。他们的作品看起来随时会散架，却往往比人类的机器更凶。最出色的叫大机械佬，连军阀都要让他们三分。",
        "Building is in a Mek's blood, as fighting is in every ork's. Their work looks ready to fall apart, yet often hits harder than human machines. The best, Big Meks, earn even a warboss's caution."),
      A(["机械佬", "大机械佬"], ["Mek", "Meks", "Big Mek"])),

    ork_weirdboyz: E("orks/unit", "leader", "orks", "ork_weirdboy", L("怪小子", "Weirdboyz"),
      L("兽人的灵能者。周围兽人越吵、越凶，他们脑中积聚的Waaagh!能量就越多。",
        "Ork psykers. The louder and angrier the orks around them, the more Waaagh! energy builds up in their heads."),
      L("怪小子无法不吸收身边的能量，只能把它吐出去：绿色闪电，或者更糟。看管他们的兽人拿着铜杆，随时准备把多余的能量引进地里。来不及时，怪小子的脑袋就会出事。",
        "A weirdboy can't help soaking up the energy and must vent it: green lightning, or worse. Minders carry copper poles to earth the surplus. When they're too slow, the weirdboy's head becomes the problem."),
      A(["怪小子"], ["Weirdboy", "Weirdboyz"])),

    /* ---------------- enemies ---------------- */
    ork_good_fight: E("orks/concept", "enemy", "orks", "ork", L("好仗", "A Good Fight"),
      L("在兽人眼里，敌人就是“所有人”。人类、灵族、混沌，甚至别的兽人，都是好对手。",
        "To orks, the enemy is everyone. Humans, Aeldari, Chaos, other orks: all of them make a good fight."),
      L("兽人打仗不为土地，不为信仰，只为打仗本身。它们最尊敬的，是打得最狠的敌人，比如星际战士。混沌的狂战士冲进兽人的战场，兽人只会欢呼：又来了一帮好对手。",
        "Orks don't fight for land or faith, only for the fight itself. They most respect the hardest foes, such as Space Marines. When Chaos berserkers charge into an ork war, the orks just cheer: more good opponents."),
      A(["好仗", "好架"], ["good fight"])),

    /* ---------------- final boss ---------------- */
    ork_grukka: E("orks/figure", "boss", "orks", "ork_boss", L("格鲁卡大老大", "Warboss Grukka"),
      L("占领伊斯卡隆的兽人军阀。他是这颗星球上最大的兽人，所以他说了算。",
        "The warboss who took Iskaron. He is the biggest ork on the planet, so what he says goes."),
      L("格鲁卡靠一颗砸进船坞的石头要塞起家，用拳头和头槌统治所有部落。先知的大Waaagh!来临时，伊斯卡隆的兽人只能有一个老大去见先知：要么是他，要么是打倒他的那个。",
        "Grukka arrived in a rock-fortress that slammed into the docks and rules every klan with fists and headbutts. When da Prophet's Waaagh! arrives, Iskaron can send only one boss to meet him: Grukka, or whoever knocks him down."),
      A(["格鲁卡", "格鲁卡大老大"], ["Grukka", "Warboss Grukka"])),

    ork_great_waaagh: E("orks/concept", "boss", "orks", "omen_waaagh", L("先知的大Waaagh!", "Da Prophet's Great Waaagh!"),
      L("加兹库尔率领的大征伐。它像绿色风暴一样扫过星区，沿途的兽人纷纷加入。",
        "The great war-migration led by Ghazghkull. It sweeps through a sector like a green storm, gathering every ork on its path."),
      L("每到一颗星球，当地的兽人就要选出一个老大，带着手下加入先知。选法只有一种：打。大Waaagh!越滚越大，帝国只能一个世界一个世界地去堵。",
        "On each world the local orks must choose one boss to bring his mobs to da Prophet. There is only one way to choose: fight. The Waaagh! grows as it rolls, and the Imperium can only try to block it one world at a time."),
      A(["大Waaagh!", "绿色风暴"], ["Great Waaagh!", "green storm"])),

    /* ---------------- kultur & lore ---------------- */
    ork_kultur: E("orks/concept", "lore", "orks", "ork_nob", L("兽人规矩", "Orky Kultur"),
      L("谁最大，谁说了算。兽人打赢架就会长大，所以老大永远是最大的那个。",
        "Biggest says wot's wot. Orks grow bigger by winning fights, so the boss is always the biggest."),
      L("兽人的纠纷只有一种解决办法：打。打赢的就是对的。这听起来野蛮，却让兽人社会出奇地稳定：没人会质疑一个能把你一头撞晕的老大。",
        "Every ork dispute is settled one way: fight. Whoever wins was right. It sounds savage, yet keeps ork society oddly stable: nobody questions a boss who can headbutt you senseless."),
      A(["谁最大谁说了算"], ["might makes right", "biggest says"])),

    ork_belief_tech: E("orks/concept", "lore", "orks", "ork_mek", L("红的跑得快", "Red Ones Go Fasta"),
      L("兽人的东西靠信念运转。大家都信红色的车更快，红色的车就真的更快。",
        "Ork things run on belief. Everyone believes red vehicles are faster, so red vehicles really are faster."),
      L("成千上万兽人的共同信念会化为真实的灵能力量。兽人的枪本该炸膛，却照样开火；破车本该散架，却照样狂奔。人类工程师研究过，结论通常是辞职。",
        "The shared belief of thousands of orks becomes real psychic force. Their guns should explode yet fire; their wrecks should fall apart yet race on. Human engineers have studied it. They usually resign."),
      A(["红的跑得快", "红的快"], ["red ones go fasta", "Red ones"])),

    ork_spores: E("orks/concept", "lore", "orks", "ork", L("孢子", "Spores"),
      L("兽人一生都在散播孢子，死后更多。孢子在地下长成兽人、地精、史奎格。",
        "Orks shed spores all their lives, and more in death. In the soil the spores grow into orks, grots and squigs."),
      L("这就是兽人无法根除的原因：一场仗打完，战场就成了苗圃。几年后，地下会钻出一批新兽人，生下来就知道怎么打架。帝国的办法是用火烧遍每一寸土地，但总有漏掉的。",
        "This is why orks can't be wiped out: every battlefield becomes a nursery. Years later a new crop climbs out of the soil, born knowing how to fight. The Imperium burns every inch of ground, but something is always missed."),
      A(["孢子", "蘑菇"], ["spores", "spore"])),

    ork_gretchin: E("orks/unit", "lore", "orks", "gretchin", L("地精仔", "Gretchin"),
      L("兽人里最小的一种，又叫“格罗”。被兽人踢来踢去，所以学会了偷、藏和逃。",
        "The smallest greenskins, also called grots. Kicked around by orks, they learn to steal, hide and run."),
      L("地精仔干兽人不屑干的活：扛弹药、开炮、当肉盾。它们比兽人聪明一点，胆子小很多，偶尔会密谋造反。密谋通常在一个兽人路过时结束。",
        "Grots do the jobs orks won't: haul ammo, crew guns, soak up bullets. A little smarter than orks and far less brave, they sometimes plot revolution. The plot usually ends when an ork walks past."),
      A(["地精仔", "地精", "格罗"], ["grot", "grots", "Gretchin"])),

    ork_squigs: E("orks/unit", "lore", "orks", "squig", L("史奎格", "Squigs"),
      L("长着腿和大嘴的真菌生物。兽人拿它们当食物、宠物、武器，甚至当头发。",
        "Fungal creatures that are mostly legs and mouth. Orks use them as food, pets, weapons, even hair."),
      L("史奎格和兽人一样从孢子里长出来，种类多得数不清：会咬人的、会爆炸的、能用来补牙的。最凶的史奎格猎犬由专人饲养，吃铁皮、吃靴子，偶尔吃饲养员。",
        "Squigs grow from the same spores as orks and come in endless kinds: biting ones, exploding ones, ones for filling teeth. The fiercest, squig hounds, eat tin, boots and the occasional keeper."),
      A(["史奎格", "史奎格猎犬"], ["squig", "squigs", "squig hound"])),

    ork_teef: E("orks/concept", "lore", "orks", "ork", L("牙币", "Teef"),
      L("兽人的钱就是牙齿。牙掉了会再长，所以人人都有，人人都想要更多。",
        "Ork money is teeth. Teeth grow back, so everyone has some, and everyone wants more."),
      L("兽人用牙齿买枪、买史奎格、买机械佬的手艺。没牙的可以去抢别人的牙，这也算一种劳动。黄月亮部落的牙长得最快，所以他们最有钱，也最爱炫耀。",
        "Orks buy guns, squigs and a Mek's skill with teeth. Those without teef can knock out someone else's, which counts as work. Bad Moon teef grow fastest, so they're the richest and the showiest."),
      A(["牙币", "牙齿"], ["teef", "toof"])),

    ork_klans: E("orks/organization", "lore", "orks", "ork_nob", L("兽人部落", "Ork Klans"),
      L("兽人分成许多部落，各有脾气：有的爱黑色和打架，有的爱红色和速度，有的爱金牙。",
        "Orks split into klans, each with its own temper: some love black and brawling, some red and speed, some gold teef."),
      L("哥夫部落穿黑，最爱肉搏；邪日部落爱红色，相信红的跑得快；黄月亮部落有钱；死头骷部落觉得蓝色带来好运；血斧部落爱学人类的花样；蛇咬部落守着老规矩。",
        "Goffs wear black and love close combat. Evil Sunz love red and speed. Bad Moons are rich. Deathskulls think blue is lucky. Blood Axes pick up human tricks. Snakebites keep the old ways."),
      A(["黄月亮", "死头骷", "哥夫", "邪日", "血斧", "蛇咬"], ["Bad Moon", "Bad Moons", "Deathskull", "Deathskulls", "Goffs", "Evil Sunz", "Blood Axes", "Snakebites"])),

    ork_painboyz: E("orks/unit", "lore", "orks", "ork", L("医生佬", "Painboyz"),
      L("兽人的外科医生。热爱手术，尤其是没必要的手术。缝错了零件也能长好。",
        "Ork surgeons. They love surgery, especially the unnecessary kind. Even a wrongly attached part usually takes."),
      L("兽人的身体顽强得离谱，砍下的脑袋接到新身体上都可能活。医生佬借此大胆实验：换手臂、装机械、加零件。病人很少抱怨，因为抱怨的会被再修一次。",
        "Ork bodies are absurdly tough; a head sewn onto a new body may live. Doks use this for bold experiments: new arms, bionics, extra bits. Patients rarely complain, because complainers get fixed again."),
      A(["医生佬"], ["Dok", "Painboy", "Painboyz"])),

    ork_nobz: E("orks/unit", "lore", "orks", "ork_nob", L("头目", "Nobz"),
      L("比普通兽人更大、更凶的头目。他们管着小子们，也都盯着老大的位置。",
        "Bigger, meaner orks who boss the boyz around, and all of them eye the warboss's spot."),
      null, A(["头目"], ["Nob", "Nobz"])),

    ork_freebooterz: E("orks/organization", "lore", "orks", "ork", L("自由海盗", "Freebooterz"),
      L("被部落赶出来的兽人，成了海盗和雇佣兵。谁给的牙多就替谁打，连人类都接待。",
        "Orks kicked out of their klans who turn pirate and mercenary. They fight for whoever pays most teef, humans included."),
      null, A(["自由海盗", "海盗船"], ["Freebooter", "Freebooterz", "pirate ship"])),

    ork_mega_armour: E("orks/unit", "lore", "orks", "ork_boss", L("兽人重型动力甲", "Ork Mega Armour"),
      L("机械佬用整块废铁拼成的动力甲，又重又响，能喷火，穿上的兽人会觉得自己天下无敌。",
        "Power armour a Mek bolts together from whole slabs of scrap: heavy, loud, flame-spitting. Its wearer feels invincible."),
      null, A(["大亮闪", "动力甲"], ["Big Shiny", "mega armour"])),

    ork_krork: E("orks/concept", "lore", "orks", "omen_gork_mork", L("克洛克", "The Krork"),
      L("传说兽人的祖先是远古造物主为天堂之战培育的战争种族。造物主早已消失，战争没停。",
        "Legend says the orks' ancestors were a war-race bred by ancient creators for the War in Heaven. The creators are long gone. The war never stopped."),
      L("帝国学者推测，古圣造出了这些绿皮战士，用来对抗死灵。古老的克洛克比今天的兽人更聪明、更可怕。他们的后代忘了一切，只记得一件事：打。",
        "Imperial scholars suspect the Old Ones made these green warriors to fight the Necrons. The ancient Krork were cleverer and far more terrible than today's orks. Their descendants forgot everything except one thing: fight."),
      A(["克洛克"], ["Krork"])),

    /* ---------------- places (SPEC §27: Arcosa Sector) ---------------- */
    place_iskaron: P("imperium", "ork_scrapyard", null, L("伊斯卡隆", "Iskaron"),
      L("阿尔科萨星区的拆船星，帝国的旧舰在这里被拆成零件。112.M42，Waaagh!从天而降。",
        "The Arcosa Sector's ship-breaking world, where old Imperial hulls are cut up for parts. In 112.M42 a Waaagh! fell from the sky."),
      L("伊斯卡隆的船坞绵延上千公里，到处是废船的骨架和成山的废铁。对人类来说，这是一座拆船厂；对兽人来说，这是全银河最好的玩具箱。兽人管它叫“大废铁场”。",
        "Its yards stretch for a thousand kilometres, all hull-skeletons and mountains of scrap. To humans it's a breaker's yard; to orks it's the best toybox in the galaxy. They call it Da Big Scrap."),
      A(["伊斯卡隆", "大废铁场"], ["Iskaron", "Da Big Scrap"])),

    place_valda_wreck: P("imperium", "ork_scrapyard", null, L("瓦尔达什一税船残骸", "Wreck of the Valda Tithe Ship"),
      L("一艘从瓦尔达农业星出发、本该开往奥雷克斯二号的什一税船，最后坠在伊斯卡隆。",
        "A tithe ship out of Valda, bound for Aurex Secundus, that came down on Iskaron instead."),
      null, A(["什一税船", "瓦尔达的船"], ["tithe ship", "Valda tithe ship"])),

    place_ork_fort: P("orks", "ork_fort", "ork_boss", L("格鲁卡的堡垒", "Grukka's Fort"),
      L("格鲁卡砸进船坞的石头要塞，四周用废船外壳围成高墙，墙上挂满战利品。",
        "The rock-fortress Grukka crashed into the docks, walled with hull plates and hung with trophies."),
      null, A(["堡垒"], ["fort"])),

    place_wazgob_shop: P("orks", "manufactorum", "ork_mek", L("瓦兹格布的作坊", "Wazgob's Workshop"),
      L("一座旧帝国工厂，如今塞满废铁、油桶和半成品。机器靠敲打运转，也靠信念。",
        "An old Imperial manufactorum stuffed with scrap, drums and half-built things. The machines run on hammering, and on belief."),
      null, A(["作坊", "旧工厂"], ["workshop", "manufactorum"])),

    place_fight_pit: P("orks", "ork_fort", "ork_nob", L("打架坑", "Da Fight Pit"),
      L("堡垒中央的大坑，兽人在这里解决一切纠纷。坑边永远摆着收赌注的桶。",
        "A great pit at the fort's heart where orks settle every dispute. Betting buckets always line the rim."),
      null, A(["打架坑"], ["fight pit", "the pit"]))
  });
})();
