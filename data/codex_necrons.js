/* data/codex_necrons.js — codex entries for the Necron route (text role: text-necrons). SPEC §6 + §13.
 *   text ≤ 45 zh / 30 en · more ≤ 90 zh (required for learn ids) · race/type per SPEC §13.
 * Shared general entries owned here: nec_necrons (the race), nec_ctan (the C'tan).
 * Reuses shared ids from data/codex.js: xenos_tyranid, xenos_hive_mind, imp_imperium, imp_inquisition, imp_mechanicus,
 * imp_guard, imp_exterminatus, and eld_aeldari / eld_rangers / eld_monkeigh from codex_aeldari.js.
 * nec_old_enemies is only the Necron-side view of the feud (not a second general Aeldari entry).
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
    return E("place", "necrons", race, "place", sprite, name, text, more, aliases, scene);
  }

  WH.registerCodex({
    /* ---------------- shared general entries ---------------- */
    nec_necrons: E("lore", "any", "necrons", "organization", "necron_warrior", L("死灵", "The Necrons"),
      L("以活体金属铸成的古老种族，在墓穴世界里沉睡了六千万年，如今正在醒来。",
        "An ancient race in bodies of living metal, asleep in tomb worlds for sixty million years. Now they are waking."),
      L("死灵曾是血肉之躯，为了不朽把灵魂卖给了星神。贵族保留了人格与傲慢，大多数平民只剩服从。在他们看来，银河本来就是他们的，现在只是收回来。",
        "Once flesh, they sold their souls to the star gods for immortality. Their nobles kept their minds and their arrogance; most commoners kept only obedience. As they see it, the galaxy was always theirs. They are merely taking it back."),
      A(["死灵", "死灵族"], ["Necrons", "necrons", "necron"])),

    nec_ctan: E("enemy", "any", "other", "deity", "omen_ctan", L("星神", "The C'tan"),
      L("以恒星为食的古老神祇。死灵泰尔人给了它们身体，它们吃掉了死灵泰尔人的灵魂。",
        "Ancient beings that fed on stars. The Necrontyr gave them bodies; they ate the Necrontyr's souls."),
      L("星神原是漂浮在星海中的能量。死灵泰尔人用活体金属为它们铸造躯体，奉为神明。天堂之战后，死灵反噬，把星神击碎成无数碎片，关进超立方迷宫。",
        "Once drifting energy among the stars, they were given living-metal bodies and worshipped as gods. After the War in Heaven the necrons turned on them, shattered them into shards, and locked them in tesseract labyrinths."),
      A(["星神", "太空死神", "C'tan"], ["C'tan", "star gods", "star god"])),

    /* ---------------- leaders ---------------- */
    nec_silent_king: E("leader", "necrons", "necrons", "figure", "omen_silent_king", L("寂静之王 萨雷克", "Szarekh, the Silent King"),
      L("死灵最后的至高君主。是他带全族接受生体转移，也是他带头背叛了星神。",
        "The last supreme ruler of the necrons. He led his people into biotransference, then led their betrayal of the star gods."),
      L("战后，萨雷克自觉罪孽深重，解除了臣民的服从指令，独自流放到银河之外。直到他看见泰伦虫族的舰队从虚空涌来，才回到银河，召集所有王朝。",
        "After the war, consumed by guilt, Szarekh released his subjects from obedience and exiled himself beyond the galaxy. Only when he saw the Tyranid fleets pouring in from the void did he return, summoning every dynasty."),
      A(["寂静之王", "萨雷克"], ["Silent King", "Szarekh"])),

    nec_imotekh: E("leader", "necrons", "necrons", "figure", "omen_stormlord", L("风暴领主 伊莫特克", "Imotekh the Stormlord"),
      L("萨特克王朝的法老，最有野心的死灵统治者之一，能召来绿色的雷暴。",
        "Phaeron of the Sautekh Dynasty, among the most ambitious necron rulers. He calls down storms of green lightning."),
      L("伊莫特克醒来时，王朝已四分五裂。他凭武力与谋略重新统一了它，又吞并了一个又一个墓穴世界。他把战争当成一盘棋，也确实很少下输。",
        "Waking to find his dynasty shattered, Imotekh reunited it by force and cunning, then absorbed tomb world after tomb world. He treats war as a board game, and rarely loses."),
      A(["风暴领主", "伊莫特克"], ["Stormlord", "Imotekh"])),

    nec_trazyn: E("leader", "necrons", "necrons", "figure", "omen_collector", L("无尽者 特拉赞", "Trazyn the Infinite"),
      L("执迷收藏的死灵霸主，把银河历史的瞬间冻进停滞场，陈列在他的画廊里。",
        "A necron overlord obsessed with collecting, freezing moments of galactic history in stasis and displaying them in his galleries."),
      L("他的画廊里有圣人、异形、整支军队。他几乎杀不死：本体被毁时，意识会跳进附近另一具死灵身体。他乐呵呵的，非常有礼貌，也非常不讲理。",
        "His galleries hold saints, aliens and whole armies. He is nearly unkillable: destroy him and his mind leaps into another nearby necron body. He is cheerful, very polite, and utterly unreasonable."),
      A(["收藏家", "特拉赞", "无尽者"], ["Collector", "Trazyn"])),

    /* ---------------- enemies / boss ---------------- */
    nec_old_enemies: E("enemy", "necrons", "necrons", "concept", "aeldari_seer", L("古老的宿敌：灵族", "Old Enemies: the Aeldari"),
      L("死灵眼中的灵族：古圣的孩子，天堂之战的对手。双方都记得那场仗，也都没打算原谅。",
        "The Aeldari as necrons see them: children of the Old Ones, foes of the War in Heaven. Both sides remember. Neither forgives."),
      L("古圣培育灵族等年轻种族作为兵器，对抗死灵与星神。死灵赢了战争，却选择沉睡；灵族则一直盯着那些墓穴。凡是死灵醒来的地方，总有灵族先知设法让它们再睡回去。",
        "The Old Ones bred young races such as the Aeldari as weapons against the necrons and their gods. The necrons won, then slept; the Aeldari kept watch on the tombs. Wherever necrons wake, farseers try to put them back to sleep."),
      A(["古老的宿敌", "宿敌"], ["Old Enemies"])),

    nec_nightbringer: E("boss", "necrons", "other", "deity", "omen_ctan", L("夜幕使者碎片", "Shard of the Nightbringer"),
      L("死亡星神的一块碎片。凡是活物都怕死，据说那份恐惧最初就是它教的。",
        "A shard of the C'tan of death. Every living thing fears death; some say this god first taught them how."),
      L("夜幕使者是最强大的星神之一，以生命的精华为食。即使被击碎，每一片碎片仍能让一支军队枯萎。死灵对它的恐惧，深到连灵魂被吃掉都没能抹去。",
        "The Nightbringer, one of the mightiest C'tan, feeds on the essence of life. Even shattered, each shard can wither an army. The necrons' fear of it ran deeper than the loss of their souls could erase."),
      A(["夜幕使者", "星神碎片", "碎片"], ["Nightbringer", "shard"])),

    nec_tesseract: E("boss", "necrons", "necrons", "concept", "omen_ctan", L("超立方迷宫", "Tesseract Labyrinth"),
      L("关押星神碎片的牢笼，用折叠的空间编成，从里面看是一座无穷无尽的迷宫。",
        "A prison for star-god shards, woven from folded space. From inside, it is an endless maze."),
      L("死灵击碎星神后，把碎片封进超立方迷宫，分散藏在各个墓穴，有的甚至被当作武器带上战场。看守者都清楚：笼子再牢，里面的东西也只是在等。",
        "After shattering the star gods, the necrons sealed the shards in tesseract labyrinths hidden among the tombs; some are even carried to war as weapons. Every keeper knows: however strong the cage, the thing inside is only waiting."),
      A(["超立方迷宫", "超立方", "光编的笼子"], ["tesseract", "cage of woven light"])),

    /* ---------------- lore ---------------- */
    nec_necrontyr: E("lore", "necrons", "necrons", "concept", "necron_lord", L("死灵泰尔人", "The Necrontyr"),
      L("死灵的前身：住在暴烈恒星下的短命种族，活不过百年，嫉妒一切长寿者。",
        "The necrons' ancestors: a short-lived people under a violent sun, rarely past a hundred years, envious of all who lived longer."),
      L("辐射让他们多病而短寿。他们向长生的古圣求取永生之秘，遭到拒绝，从此心生仇恨，发动战争，并找到了愿意帮忙的星神。",
        "Radiation left them sickly and brief. They begged the long-lived Old Ones for the secret of eternal life, were refused, turned to hatred and war, and found star gods willing to help."),
      A(["死灵泰尔"], ["Necrontyr"])),

    nec_biotransference: E("lore", "necrons", "necrons", "concept", "necron_warrior", L("生体转移", "Biotransference"),
      L("死灵泰尔人把意识移入活体金属躯体，换来不朽。代价是灵魂，被星神当场吃掉。",
        "The Necrontyr moved their minds into living-metal bodies for immortality. The price was their souls, which the star gods ate."),
      L("寂静之王下令全族接受转移。熔炉日夜燃烧，一个种族走进去，出来的是不会老、不会病、也不再真正有感受的东西。贵族保留了自我，平民大多没有。",
        "The Silent King ordered the whole race through. Furnaces burned day and night; a people walked in, and out came things that would never age, sicken, or truly feel again. Nobles kept themselves. Most commoners did not."),
      A(["生体转移"], ["biotransference", "Biotransference"])),

    nec_great_sleep: E("lore", "necrons", "necrons", "concept", "necron_warrior", L("大沉眠", "The Great Sleep"),
      L("天堂之战后，死灵躲进墓穴世界沉睡了六千万年，等银河换一批主人。",
        "After the War in Heaven the necrons hid in tomb worlds and slept for sixty million years, waiting for the galaxy to change hands."),
      L("他们原计划在古圣的后代衰落后醒来。可漫长的沉睡损坏了许多墓穴：许多死灵醒来时已经疯了、忘了一切，或者根本没醒。",
        "They meant to wake once the Old Ones' heirs had faded. But the long sleep damaged many tombs: many necrons woke mad, or remembering nothing, or not at all."),
      A(["大沉眠", "睡过头"], ["Great Sleep", "overslept"]), "tomb_interior"),

    nec_dynasties: E("lore", "necrons", "necrons", "organization", "necron_lord", L("王朝", "The Dynasties"),
      L("死灵社会分成一个个王朝，由法老和霸主统治，彼此结盟、竞争，极讲礼数。",
        "Necron society is split into dynasties ruled by phaerons and overlords, who ally, compete, and insist on etiquette."),
      L("大沉眠之后，许多王朝失联、衰落或被吞并。贵族们仍死守古老的头衔与礼仪，为六千万年前的冒犯记仇，把宫廷规矩看得比生死还重。",
        "After the Great Sleep many dynasties were lost, diminished or absorbed. Nobles cling to ancient titles and courtesies, nurse grudges sixty million years old, and value protocol above life and death."),
      A(["萨特克王朝", "阿赫梅特王朝", "王朝", "霸主"], ["dynasty", "Dynasty", "Sautekh", "Akhemet", "overlord"])),

    nec_crypteks: E("lore", "necrons", "necrons", "organization", "cryptek", L("墓穴技师", "Crypteks"),
      L("死灵的科学家兼巫师，掌握操纵时间、光、空间和灵魂残渣的技术。",
        "Necron scientist-sorcerers who wield technologies of time, light, space and what remains of the soul."),
      L("技师自成行会，受雇于各个王朝，却不完全效忠任何人。墓穴、停滞场和关押星神的牢笼都是他们设计的，他们也最清楚这些东西会从哪里坏掉。",
        "Crypteks form their own guilds, hired by dynasties but wholly loyal to none. They designed the tombs, the stasis fields and the star gods' cages, and know best where each will fail."),
      A(["墓穴技师", "技师"], ["cryptek", "crypteks", "Cryptek"])),

    nec_flayer_curse: E("lore", "necrons", "necrons", "concept", "flayed_one", L("剥皮者诅咒", "The Flayer Curse"),
      L("一种侵蚀死灵心智的疯病。患者渴望血肉，把从活物身上取下的东西披在身上取暖。",
        "A madness that eats necron minds. The afflicted crave flesh and drape themselves in what they take, trying to feel warm."),
      L("据说这是一位被击碎的星神留下的诅咒，它生前最爱血肉的滋味。剥皮者被同族厌弃，徘徊在墓穴边缘，或藏进一个只有它们知道的冰冷角落。",
        "It is said to be the curse of a shattered star god that loved the taste of flesh. Flayed Ones are shunned by their own, lurking at the tomb's edges or in a cold place only they know."),
      A(["剥皮者", "梅鲁克"], ["Flayed One", "Flayed Ones", "flayer"])),

    nec_war_in_heaven: E("lore", "necrons", "necrons", "concept", "omen_ctan", L("天堂之战", "The War in Heaven"),
      L("六千万年前，死灵与星神对抗古圣及其子嗣的大战，打碎了半个银河。",
        "Sixty million years ago, the necrons and the star gods warred against the Old Ones and their children. Half the galaxy broke."),
      L("古圣培育了许多年轻种族作为兵器，灵族的先祖便是其中之一。死灵赢了，却也精疲力竭，于是选择沉睡。灵族从未忘记这场战争。",
        "The Old Ones bred young races as weapons, the Aeldari's forebears among them. The necrons won, exhausted, and chose to sleep. The Aeldari never forgot."),
      A(["天堂之战", "古圣"], ["War in Heaven", "Old Ones"])),

    nec_living_metal: E("lore", "necrons", "necrons", "concept", "canoptek_scarab", L("活体金属", "Living Metal"),
      L("死灵的躯体与建筑所用的金属，会自我修复：划痕会合拢，断肢会重新接上。",
        "The metal of necron bodies and buildings. It mends itself: scratches close, severed limbs rejoin."),
      L("这种金属叫“死灵质”，最初来自星神的传授。机械神教对它垂涎三尺，却始终无法复制。",
        "Called necrodermis, it was first taught to them by the star gods. The Adeptus Mechanicus covets it desperately and has never managed to copy it."),
      A(["活体金属", "自我修复的金属", "死灵质"], ["living metal", "self-repairing metal", "necrodermis"])),

    nec_canoptek: E("lore", "necrons", "necrons", "unit", "canoptek_scarab", L("墓穴甲虫与蜘蛛", "Canoptek Scarabs & Spyders"),
      L("墓穴的维修工。死灵沉睡时，它们打扫、修补，并拆掉闯入者带来的一切金属。",
        "The tomb's maintenance crew. While the necrons sleep, they sweep, repair, and dismantle every scrap of metal intruders bring."),
      L("甲虫成群行动，啃食金属补充原料；蜘蛛体型庞大，指挥甲虫、修复受损的死灵。它们没有恶意，只有职责——这让它们更可怕。",
        "Scarabs swarm and devour metal for raw material; the huge spyders direct them and mend damaged necrons. They have no malice, only duties, which is worse."),
      A(["圣甲虫", "甲虫", "蜘蛛构造体"], ["scarabs", "scarab", "spyder construct", "spyder"])),

    nec_warriors: E("lore", "necrons", "necrons", "unit", "necron_warrior", L("死灵战士", "Necron Warriors"),
      L("死灵军队的主力。曾经是平民，如今只是服从命令的金属骷髅。",
        "The backbone of necron armies. Once ordinary citizens, now metal skeletons that only obey."),
      L("生体转移抹去了大多数平民的意识。他们成排前进，步伐一致，不怕伤亡，因为对他们来说，伤亡只是暂时的。",
        "Biotransference erased most commoners' minds. They advance in perfect ranks and fear no losses, because for them, losses are temporary."),
      A(["金属骷髅", "死灵战士"], ["metal skeletons", "necron legions", "warriors"])),

    nec_reanimation: E("lore", "necrons", "necrons", "concept", "necron_warrior", L("复苏协议", "Reanimation Protocols"),
      L("被击倒的死灵会自我修复、重新站起；修不好的，会被传送回墓穴。",
        "Felled necrons repair themselves and stand back up. Those too broken are teleported home to the tomb."),
      L("所以和死灵作战，最可怕的不是它们开火，而是它们倒下以后。真正打赢一场仗，往往得把整座墓穴一起毁掉。",
        "So the worst part of fighting necrons isn't when they shoot. It's after they fall. Truly winning often means destroying the whole tomb."),
      A(["复苏协议"], ["reanimation"])),

    nec_gauss: E("lore", "necrons", "necrons", "concept", "necron_warrior", L("高斯武器", "Gauss Weapons"),
      L("死灵的标准武器。绿色光束一层一层剥离目标的原子，护甲还是皮肉，都一样。",
        "Standard necron armament. A green beam strips its target apart layer by layer, atom by atom. Armour or flesh, no difference."),
      null, A(["高斯", "绿光"], ["gauss", "green beam", "green light"])),

    nec_stasis: E("lore", "necrons", "necrons", "concept", "omen_collector", L("停滞场", "Stasis Fields"),
      L("冻结时间的力场。被关在里面的东西，一万年后取出来还是新鲜的。",
        "Fields that freeze time. Whatever is sealed inside comes out fresh ten thousand years later."),
      L("死灵靠停滞场熬过了大沉眠，收藏家则用它保存“瞬间”。被冻住的人感觉不到时间，只是眨一下眼，世界就换了。",
        "Stasis carried the necrons through the Great Sleep; the Collector uses it to preserve 'moments'. The frozen feel no time. They blink, and the world has changed."),
      A(["停滞场", "停滞立方", "停滞"], ["stasis", "stasis field", "stasis cube"])),

    nec_dolmen_gate: E("lore", "necrons", "necrons", "concept", "cryptek", L("巨石门", "Dolmen Gates"),
      L("死灵强行撬开网道的门户。走进去很快，出来是什么时候，就不好说了。",
        "Necron portals that force open the webway. Going in is quick. When you come out is another matter."),
      L("网道是古圣留下的隧道网络，灵族视为家园。死灵用巨石门硬闯进去，粗暴而有效。时间在里面并不可靠。",
        "The webway is a tunnel network left by the Old Ones, which the Aeldari call home. Necrons force their way in with dolmen gates: crude, effective. Time inside is unreliable."),
      A(["巨石门"], ["dolmen gate"]), "webway"),

    /* ---------------- places ---------------- */
    place_thessa_null: P("imperium", "dig_site", null, L("忒萨零号", "Thessa Null"),
      L("帝国星图上标着“死寂”的荒漠世界。沙丘整齐得像有人每天打扫——确实有。",
        "A desert world marked 'dead' on Imperial charts. Its dunes are neat, as if swept daily. They are."),
      L("帝国考察队在113.M42来此发掘。此后几百年，忒萨零号在帝国档案里换过好几个名字，每一个后面都写着“禁止前往”。",
        "An Imperial dig came here in 113.M42. Over the following centuries Thessa Null changed names in the archives several times. Each one was marked 'forbidden'."),
      A(["忒萨零号"], ["Thessa Null"])),

    place_thessa_tomb: P("necrons", "tomb_exterior", null, L("阿赫梅特墓穴世界", "The Akhemet Tomb World"),
      L("忒萨零号的真名。沙下埋着一座金字塔城市，和一个沉睡了六千万年的王朝。",
        "Thessa Null's true name. Beneath the sand lies a pyramid city and a dynasty asleep for sixty million years."),
      L("墓穴世界是死灵沉睡的星球：表面一片死寂，地底是完好的城市、军团和熔炉。帝国在银河各处发现过“死去的世界”，其中有多少只是在睡觉，没人知道。",
        "Tomb worlds are where the necrons sleep: dead on the surface, intact cities, legions and forges below. The Imperium has found 'dead worlds' across the galaxy. How many are merely asleep, nobody knows."),
      A(["墓穴世界", "金字塔"], ["tomb world", "pyramid"])),

    place_court_hall: P("necrons", "tomb_interior", null, L("静止朝堂", "The Unmoving Court"),
      L("塞赫拉特霸主的王座大厅。朝臣站满两侧，大多数从不动弹，只有眼睛亮着。",
        "Overlord Sekhrat's throne hall. Courtiers line both sides; most never move. Only their eyes glow."),
      null, A(["王座大厅"], ["throne hall"])),

    place_stasis_crypts: P("necrons", "tomb_interior", null, L("沉眠墓室", "The Stasis Crypts"),
      L("一排排竖立的墓龛，死灵在里面站着沉睡。有的醒了，有的永远不会。",
        "Row upon row of upright alcoves where necrons sleep standing. Some have woken. Some never will."),
      null, A(["墓室"], ["crypts"])),

    place_tesseract_vault: P("necrons", "tomb_interior", "omen_ctan", L("超立方囚室", "The Tesseract Vault"),
      L("墓穴最深处，一座光编成的笼子悬在半空。里面的碎片在缓慢地呼吸。",
        "In the tomb's depths a cage of woven light hangs in mid-air. The shard inside breathes slowly."),
      null, A(["囚室"], ["vault"])),

    place_gallery: P("necrons", "stasis_gallery", "omen_collector", L("收藏家的画廊", "The Collector's Gallery"),
      L("无数凝固的瞬间排到天边：战争、婚礼、一场永远落不下来的雨。没有出口，只有更多的画廊。",
        "Countless frozen moments stretching to the horizon: wars, weddings, a rain that never lands. No exits. Only more gallery."),
      L("特拉赞的收藏遍布多个世界。每件藏品都有铭牌和姿势说明，有些还会被解冻，用来讲解别的藏品。",
        "Trazyn's collections span many worlds. Every item has a plaque and pose notes; some are thawed now and then to explain the others."),
      A(["画廊"], ["gallery"])),

    place_thessa_cathedral: P("imperium", "cathedral", null, L("忒萨要塞大教堂", "Fortress-Cathedral of Thessa"),
      L("帝国在发掘现场上建起的要塞大教堂，钟楼比金字塔还高。档案库里藏着不该存在的报告。",
        "A fortress-cathedral the Imperium raised over the dig, its bell tower taller than the pyramid. Its archive holds reports that shouldn't exist."),
      null, A(["要塞大教堂", "档案库"], ["fortress-cathedral", "archive"]))
  });
})();
