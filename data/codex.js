/* data/codex.js — codex entries (text role). SPEC §6 + lead extension:
 *   text  ≤ 45 zh / 30 en (one fact + one flavour line)
 *   more  ≤ 90 zh / 60 en (optional fuller card; required for the four gods, chaos_gods/chaos_warp and every learn id)
 *   aliases {zh:[], en:[]} (optional) other names used in story text, for underlining mentions.
 */
(function () {
  function L(zh, en) { return {zh: zh, en: en}; }
  /* rt = "race/type" (SPEC §13 codex taxonomy v2): race ∈ imperium|chaos|tau|aeldari|necrons|orks|tyranids|other,
   * type ∈ figure|deity|organization|unit|place|concept. Old cat/faction kept for compatibility. */
  function E(rt, cat, faction, sprite, name, text, more, aliases, scene) {
    var r = rt.split("/");
    var e = {cat: cat, faction: faction, race: r[0], type: r[1], sprite: sprite, name: name, text: text};
    if (scene) e.scene = scene;
    if (more) e.more = more;
    if (aliases) e.aliases = aliases;
    return e;
  }
  function A(zh, en) { return {zh: zh, en: en}; }

  WH.registerCodex({
    /* ---------------- Imperium ---------------- */
    imp_emperor: E("imperium/deity", "leader", "imperium", "omen_emperor", L("帝皇", "The Emperor"),
      L("人类帝国的神皇，在黄金王座上靠维生装置存续了一万年。亿万人向他祈祷，他从不回答。",
        "God-Emperor of Mankind, kept alive on the Golden Throne for ten thousand years. Trillions pray to him. He never answers."),
      L("一万年前他统一人类，发动大远征；荷鲁斯之乱中重伤，从此被安置在泰拉的黄金王座上。他的灵能点亮星炬，为跃迁航行指路。帝国奉他为神，尽管他生前否认自己是神。",
        "Ten thousand years ago he united humanity and launched the Great Crusade. Mortally wounded in the Horus Heresy, he was interred in the Golden Throne on Terra. His psychic might lights the Astronomican that guides warp travel. The Imperium worships him as a god, though in life he denied being one."),
      A(["人类帝皇", "神皇", "黄金王座", "金色的王座"], ["Emperor", "God-Emperor", "Golden Throne"])),

    imp_guilliman: E("imperium/figure", "leader", "imperium", "omen_primarch", L("罗保特·基里曼", "Roboute Guilliman"),
      L("极限战士的原体、帝皇之子，沉睡万年后复苏。如今以帝国摄政之名领导无畏远征。",
        "Primarch of the Ultramarines and a son of the Emperor, revived after ten millennia. Now Lord Commander, leading the Indomitus Crusade."),
      L("荷鲁斯之乱后，他重建帝国，写下规范星际战士的《阿斯塔特圣典》。被叛变的兄弟重伤后，他在停滞力场中沉睡一万年。大裂隙撕开银河之际他复苏，成为帝国摄政，发动无畏远征夺回失地。",
        "After the Heresy he rebuilt the Imperium and wrote the Codex Astartes. Struck down by a traitor brother, he lay in stasis for ten thousand years. Revived as the Great Rift opened, he became Lord Commander and launched the Indomitus Crusade to reclaim lost worlds."),
      A(["基里曼", "帝皇之子", "原体"], ["Guilliman", "Lord Commander", "Primarch"])),

    imp_indomitus: E("imperium/concept", "lore", "imperium", "omen_primarch", L("无畏远征", "Indomitus Crusade"),
      L("基里曼发动的大远征，带着新一代原铸星际战士，夺回大裂隙后失联的世界。",
        "Guilliman's vast crusade, bringing new Primaris Space Marines to reclaim worlds cut off by the Great Rift."),
      null, A(["无畏远征", "远征舰队", "蓝金色的舰队"], ["Indomitus", "crusade fleet"])),

    imp_inquisition: E("imperium/organization", "leader", "imperium", "inquisitor", L("审判庭", "The Inquisition"),
      L("帝国最隐秘的权力。审判官只对帝皇负责，可以处决总督、调动舰队、焚毁星球。",
        "The Imperium's most secret power. Inquisitors answer only to the Emperor and may execute governors, command fleets, burn worlds."),
      L("审判庭分为数个审判部：恶魔审判庭猎杀恶魔，异形审判庭监视异形，异端审判庭清查异端与腐化。审判官手段各异，有人仁慈，有人冷酷，但都相信：为了人类存续，任何代价都可以付出。",
        "It is divided into Ordos: the Ordo Malleus hunts daemons, the Ordo Xenos watches aliens, the Ordo Hereticus roots out heresy. Inquisitors range from merciful to merciless, but all believe no price is too high for humanity's survival."),
      A(["审判官", "审判庭"], ["Inquisitor", "Inquisition"])),

    imp_ordo_malleus: E("imperium/organization", "boss", "imperium", "inquisitor", L("恶魔审判庭", "Ordo Malleus"),
      L("审判庭中专门猎杀恶魔的分支，有权调遣灰骑士、下达灭绝令。",
        "The Inquisition's daemon-hunters, empowered to summon the Grey Knights and order Exterminatus."),
      L("恶魔审判庭的存在本身就是机密：普通臣民甚至不该知道恶魔存在。清剿恶魔入侵之后，他们常把目击者也一并“处理”。对斯特兰德这样的审判官来说，毁灭一整颗星球，可以是一笔划算的交易。",
        "Its very existence is classified; ordinary citizens are not meant to know daemons exist. After a daemonic incursion, witnesses are often 'processed' too. To an Inquisitor like Strand, destroying a whole world can be a sound bargain."),
      A(["恶魔审判庭"], ["Ordo Malleus"])),

    imp_commissar: E("imperium/unit", "leader", "imperium", "commissar", L("政委", "Commissar"),
      L("星界军中的政治军官，负责士气与纪律，有权当场处决任何怯战者。",
        "Political officers of the Astra Militarum, keepers of morale and discipline, authorised to execute cowards on the spot."),
      L("政委多是在帝国学院长大的战争孤儿。他们与士兵同在前线，是最严厉的执刑者，也常常是最后一个倒下的人。士兵们恨他们，却离不开他们。",
        "Commissars are mostly war orphans raised in the Schola Progenium. They fight on the front line beside the troops—the harshest executioners, and often the last to fall. Soldiers hate them, and cannot do without them."),
      A(["政委"], ["Commissar"])),

    imp_ecclesiarchy: E("imperium/organization", "lore", "imperium", "preacher", L("国教", "The Ecclesiarchy"),
      L("帝国的国教，宣扬对神皇的崇拜。神父与执事遍布每一颗世界，也遍布每一支军队。",
        "The Imperial church, preaching worship of the God-Emperor. Its priests and deacons serve on every world and in every army."),
      null, A(["执事", "牧师"], ["deacon", "priest"])),

    imp_mechanicus: E("imperium/organization", "lore", "imperium", "tech_priest", L("机械神教", "Adeptus Mechanicus"),
      L("火星的技术祭司，崇拜万机之神，相信每台机器都有机魂，而机魂会生气。",
        "The tech-priests of Mars. They worship the Omnissiah and believe every machine has a spirit—one that can get angry."),
      null, A(["机械神教", "神甫", "机魂", "万机之神"], ["Mechanicus", "Tech-Priest", "machine spirit", "Omnissiah"])),

    imp_servitor: E("imperium/unit", "lore", "imperium", "servitor", L("机仆", "Servitor"),
      L("被抹去心智、改造成机械的人类，多来自罪犯与欠债者。有的还会哼歌。",
        "Humans mind-wiped and rebuilt into machines, mostly criminals and debtors. Some still hum."),
      null, A(["机仆"], ["servitor"])),

    imp_guard: E("imperium/organization", "enemy", "imperium", "guardsman", L("星界军", "Astra Militarum"),
      L("帝国的人类军队，数以亿计的普通士兵，用数量、信仰和激光枪守住防线。",
        "The Imperium's human army: billions of ordinary soldiers holding the line with numbers, faith and lasguns."),
      L("星界军按什一税从每颗世界征兵，组成以母星命名的团。他们没有星际战士的盔甲和体魄，新兵在前线的预期寿命短得可怕，却是帝国真正的脊梁。帝国最常用的战术：再派一个团。",
        "The Astra Militarum raises regiments through the planetary tithe, each named for its homeworld. Lacking a Space Marine's armour or body, a fresh recruit's life expectancy is grimly short, yet they are the Imperium's true backbone. Favourite tactic: send another regiment."),
      A(["星界军", "帝国卫队", "卫队"], ["Astra Militarum", "Imperial Guard", "Guardsman", "Guardsmen"])),

    imp_lasgun: E("imperium/concept", "lore", "imperium", "guardsman", L("激光枪", "Lasgun"),
      L("星界军的制式步枪：可靠、耐用、威力平平。士兵们管它叫“手电筒”。",
        "Standard Guard rifle: reliable, rugged, underpowered. Troopers call it the 'flashlight.'"),
      null, A(["激光枪", "激光"], ["lasgun", "lasfire"])),

    imp_tithe: E("imperium/concept", "lore", "imperium", "hive_foreman", L("什一税", "The Tithe"),
      L("每颗帝国世界都要缴纳的税：粮食、矿石、士兵，甚至灵能者。",
        "What every Imperial world owes: food, ore, soldiers—even psykers."),
      null, A(["什一税"], ["Tithe"])),

    imp_hive: E("imperium/concept", "lore", "imperium", "hive_foreman", L("巢都", "Hive City"),
      L("高达数公里的城市巨塔，住着几十亿人。上巢奢华，下巢是垃圾与帮派的深渊。",
        "Kilometres-tall city-spires housing billions. The spire is lavish; the underhive is a pit of refuse and gangs."),
      null, A(["巢都", "上巢", "中巢", "下巢"], ["hive", "spire", "underhive"])),

    imp_astartes: E("imperium/unit", "enemy", "imperium", "astartes", L("星际战士", "Space Marines"),
      L("经基因改造的超人战士，身高两米多，身披动力甲。一个战团通常只有约一千人。",
        "Gene-engineered superhuman warriors, over two metres tall in power armour. A Chapter numbers about a thousand."),
      L("星际战士由原体的基因种子培育而成，每一位都抵得上一支军队。他们按战团组织，各有颜色与传统。在普通人眼里，他们是天使——也是从不为凡人停下脚步的巨人。",
        "Grown from their Primarch's gene-seed, each Space Marine is worth an army. They are organised into Chapters, each with its own colours and traditions. To ordinary people they are angels—and giants who never stop for mortals."),
      A(["星际战士", "阿斯塔特", "蓝甲巨人"], ["Space Marine", "Space Marines", "Astartes", "Adeptus Astartes"])),

    imp_psyker: E("imperium/unit", "lore", "imperium", "psyker", L("灵能者", "Psyker"),
      L("能驾驭亚空间力量的人类。没有许可的灵能者，会被黑船收走。",
        "Humans who can channel the warp. Unsanctioned ones are taken by the Black Ships."),
      null, A(["灵能者", "巫者", "巫婆"], ["psyker", "witch"])),

    imp_black_ships: E("imperium/concept", "lore", "imperium", "psyker", L("黑船", "Black Ships"),
      L("审判庭的船，在各个世界搜罗灵能者送往泰拉。大多数人再也没回来。",
        "Inquisition vessels that gather psykers for Terra. Most never come back."),
      null, A(["黑船"], ["Black Ship"])),

    imp_navigator: E("imperium/unit", "lore", "imperium", "psyker", L("领航员", "Navigator"),
      L("额生第三只眼的变异贵族，只有他们能引导船只穿越亚空间。",
        "Mutant nobles with a third eye—the only ones who can steer a ship through the warp."),
      null, A(["领航员"], ["Navigator"])),

    imp_arbites: E("imperium/unit", "lore", "imperium", "enforcer", L("执法官", "Enforcers"),
      L("维护帝国法律的执法者。在下巢，法律通常和火焰喷射器一起到达。",
        "Upholders of Imperial law. In the underhive, the law usually arrives with a flamer."),
      null, A(["执法官"], ["enforcer", "Enforcer"])),

    imp_great_rift: E("other/place", "place", "any", "sigil_undivided", L("大裂隙", "The Great Rift"),
      L("横贯银河的亚空间裂口，把帝国一分为二，许多世界从此看不见帝皇的星炬。",
        "A warp-wound across the galaxy, splitting the Imperium in two. Many worlds lost the Emperor's guiding light."),
      L("大裂隙又称“伤痕”，是第十三次黑色远征后撕开的亚空间风暴带，从恐惧之眼一直延伸到银河另一端。它的北侧被称作“暗面帝国”，许多世界从此再也收不到帝皇星炬的光，只能独自面对黑暗。",
        "Also called the Cicatrix Maledictum, the Great Rift is a band of warp storms torn open after the Thirteenth Black Crusade, stretching from the Eye of Terror across the galaxy. North of it lies the Imperium Nihilus, where many worlds lost the Astronomican's light and face the dark alone."),
      A(["大裂隙", "裂隙", "紫色的伤口", "伤痕"], ["Great Rift", "rift", "Cicatrix Maledictum"]), "warp"),

    imp_grey_knights: E("imperium/organization", "boss", "imperium", "grey_knight", L("灰骑士", "Grey Knights"),
      L("最神秘的星际战士战团。人人都是灵能者，人人都是恶魔猎手。",
        "The most secret Space Marine Chapter. Every brother a psyker; every one a daemon-hunter."),
      L("灰骑士驻扎在土星的卫星泰坦，听命于恶魔审判庭。他们的灵魂纯净到恶魔无法腐化，武器上刻着的祷文能让恶魔彻底消散。他们出现过的地方，很少留下目击者。",
        "Based on Saturn's moon Titan and answering to the Ordo Malleus, their souls are too pure for daemons to corrupt, and the prayers etched on their weapons can unmake daemons entirely. Where they have been, witnesses are rare."),
      A(["灰骑士"], ["Grey Knight", "Grey Knights"])),

    imp_exterminatus: E("imperium/concept", "lore", "imperium", "omen_purge", L("灭绝令", "Exterminatus"),
      L("帝国的终极手段：从轨道上抹去一颗星球的全部生命。",
        "The Imperium's final sanction: erasing all life on a world from orbit."),
      null, A(["灭绝令"], ["Exterminatus"])),

    imp_imperium: E("imperium/organization", "enemy", "imperium", "guardsman", L("人类帝国", "Imperium of Man"),
      L("统治银河百万世界的人类国度：庞大、迟缓、狂热，视一切异形为必须清除的威胁。",
        "Humanity's empire of a million worlds: vast, slow, fanatical, treating every alien as a threat to purge."),
      L("帝国由泰拉统治，靠恐惧、信仰与官僚运转。在它眼里，投靠异形的人类比异形更可恨：从钛帝国手中收复的世界，往往要先经历清洗，才谈得上宽恕。",
        "Ruled from Terra, it runs on fear, faith and bureaucracy. In its eyes, humans who side with aliens are worse than aliens: worlds reclaimed from the T'au are often purged before anyone speaks of forgiveness."),
      A(["人类帝国", "帝国"], ["Imperium", "Imperial"])),

    /* ---------------- Chaos ---------------- */
    chaos_gods: E("chaos/deity", "god", "chaos", "sigil_undivided", L("混沌四神", "The Chaos Gods"),
      L("亚空间里由凡人情感凝聚而成的四位神：恐虐、纳垢、奸奇、色孽。",
        "Four gods born of mortal emotion in the warp: Khorne, Nurgle, Tzeentch and Slaanesh."),
      L("愤怒、绝境中的求生、对改变的渴望、无止境的欲求——银河里每一份情感都在喂养它们。四神彼此为敌，却在一件事上意见一致：帝皇必须倒下。同时侍奉四神、不专奉其一者，称为“混沌无分”。",
        "Rage, the will to endure, the hunger for change, endless desire: every emotion in the galaxy feeds them. The gods are rivals, but agree on one thing—the Emperor must fall. Those who serve all four together follow Chaos Undivided."),
      A(["混沌", "四神", "四位", "诸神", "八芒星"], ["Chaos", "the Four", "the gods"])),

    chaos_warp: E("other/concept", "lore", "any", "sigil_undivided", L("亚空间", "The Warp"),
      L("与现实并行的灵能之海。船只借它跨越星海，恶魔在其中栖息。",
        "A psychic sea alongside reality. Ships cross the stars through it; daemons live in it."),
      L("亚空间由思想与情感构成，没有固定的时间：跃迁一周，外面也许已过去一年。航行要靠领航员和帝皇的星炬；没有盖勒力场的保护，船员会被里面的东西吞噬。",
        "Made of thought and emotion, the warp keeps no fixed time: a week's jump might be a year outside. Travel relies on Navigators and the Emperor's Astronomican; without a Gellar field, whatever lives inside devours the crew."),
      A(["亚空间", "跃迁"], ["warp", "warp jump"])),

    god_khorne: E("chaos/deity", "god", "chaos", "sigil_khorne", L("恐虐", "Khorne"),
      L("血神，掌管愤怒、杀戮与武勇。他不在乎血是谁的，只在乎它在流。",
        "The Blood God: rage, slaughter and martial pride. He doesn't care whose blood flows, only that it does."),
      L("恐虐坐在颅骨堆成的王座上，那王座永远在长高。他鄙视巫术与懦弱，敬重任何敢于战斗的对手，哪怕是自己的信徒。他的恶魔手持烧红的剑，把杀戮当作祈祷。",
        "Khorne sits upon a throne of skulls that never stops growing. He despises sorcery and cowardice, and respects anyone who fights—even his own followers. His daemons wield burning blades and treat killing as prayer."),
      A(["恐虐", "血神"], ["Khorne", "Blood God"])),

    god_nurgle: E("chaos/deity", "god", "chaos", "sigil_nurgle", L("纳垢", "Nurgle"),
      L("瘟疫与腐朽之神，信徒叫他“老爷爷”。他爱一切生灵，所以把疾病当礼物送给它们。",
        "God of plague and decay, called 'Grandfather' by his faithful. He loves all living things, and gives them disease as gifts."),
      L("纳垢诞生于凡人面对死亡与腐朽时的绝望，以及绝望中咬牙活下去的韧性。他的花园里万物腐烂又重生；信徒感觉不到痛苦，只剩下温吞吞的满足。他的恶魔哼着歌，清点着世间的疾病。",
        "Nurgle is born of mortal despair at death and decay—and the stubborn will to live on anyway. In his garden all things rot and are reborn; his faithful feel no pain, only a warm contentment. His daemons hum as they tally the world's diseases."),
      A(["纳垢", "老爷爷", "慈父"], ["Nurgle", "Grandfather"])),

    god_tzeentch: E("chaos/deity", "god", "chaos", "sigil_tzeentch", L("奸奇", "Tzeentch"),
      L("改变之主，掌管希望、阴谋与巫术。他的每个计划里，都藏着另一个计划。",
        "The Changer of Ways: hope, scheming and sorcery. Every plan of his hides another plan."),
      L("奸奇以凡人对改变、对更好明天的渴望为食。他是诸神中最强的巫术之神，喜欢拨弄命运，乐见一切计划——包括他自己的——出人意料。他的恶魔不断变形，笑个不停。",
        "Tzeentch feeds on the mortal craving for change and a better tomorrow. Greatest sorcerer among the gods, he loves to twist fate and delights when any plan, even his own, goes unexpectedly. His daemons shift shape and never stop laughing."),
      A(["奸奇", "改变之主"], ["Tzeentch", "Changer of Ways"])),

    god_slaanesh: E("chaos/deity", "god", "chaos", "sigil_slaanesh", L("色孽", "Slaanesh"),
      L("欢愉之主，掌管欲望、虚荣与完美。它让你永远想要更多。",
        "The Prince of Pleasure: desire, vanity and perfection. It makes you always want more."),
      L("色孽是四神中最年轻的，诞生于一个沉溺享乐的古老异形文明，它的降生几乎毁灭了那个种族。它的诱惑总是从“你值得更好的”开始，以“再来一次”结束。它的恶魔美丽、迅捷而致命。",
        "Youngest of the four, Slaanesh was born from the excesses of an ancient alien civilisation, and its birth all but destroyed that race. Its temptations begin with 'you deserve better' and end with 'just once more.' Its daemons are beautiful, swift and deadly."),
      A(["色孽", "欢愉之主"], ["Slaanesh"])),

    chaos_abaddon: E("chaos/figure", "leader", "chaos", "omen_black_crusade", L("掠夺者阿巴顿", "Abaddon the Despoiler"),
      L("黑色军团之主，混沌战帅。他已对帝国发动过十三次黑色远征。",
        "Master of the Black Legion and Warmaster of Chaos, leader of thirteen Black Crusades against the Imperium."),
      L("他曾是叛变战帅荷鲁斯最信任的部下。荷鲁斯死后，他把盔甲涂成黑色，誓要完成主君未竟之事：推翻帝皇。第十三次黑色远征中，他攻陷卡迪亚，撕开了大裂隙。他从不完全臣服于任何一位神。",
        "Once the most trusted son of the traitor Warmaster Horus. After Horus fell, he painted his armour black and swore to finish what his master began: overthrow the Emperor. His Thirteenth Black Crusade broke Cadia and tore open the Great Rift. He bows fully to no single god."),
      A(["阿巴顿", "战帅", "黑色的战帅"], ["Abaddon", "Warmaster", "the Despoiler"])),

    chaos_black_legion: E("chaos/organization", "lore", "chaos", "heretic_astartes", L("黑色军团", "Black Legion"),
      L("阿巴顿麾下的叛变星际战士军团，前身是荷鲁斯亲领的荷鲁斯之子。",
        "Abaddon's traitor Space Marine Legion, once Horus's own Sons of Horus."),
      null, A(["黑色军团"], ["Black Legion"])),

    chaos_black_crusade: E("chaos/concept", "boss", "chaos", "omen_black_crusade", L("黑色远征", "Black Crusade"),
      L("阿巴顿对帝国发动的大入侵，混沌大军从恐惧之眼倾巢而出。",
        "Abaddon's great invasions of the Imperium, with Chaos hosts pouring from the Eye of Terror."),
      L("一万年里，阿巴顿发动了十三次黑色远征。每一次看似失败，却都在为下一次铺路。第十三次远征终于攻陷要塞世界卡迪亚，大裂隙随之出现，银河从此被一道伤口撕成两半。",
        "Over ten thousand years Abaddon has launched thirteen Black Crusades. Each seemed to fail, yet each laid groundwork for the next. The Thirteenth finally broke the fortress world Cadia, and the Great Rift opened, splitting the galaxy with a wound."),
      A(["黑色远征", "黑色舰队", "远征舰队"], ["Black Crusade", "black fleet"])),

    chaos_heretic_astartes: E("chaos/unit", "enemy", "chaos", "heretic_astartes", L("叛变星际战士", "Heretic Astartes"),
      L("背叛帝皇、投向混沌的星际战士。不少人从一万年前的荷鲁斯之乱一直打到今天。",
        "Space Marines who betrayed the Emperor for Chaos. Many have fought ever since the Horus Heresy, ten thousand years ago."),
      null, A(["叛变星际战士", "混沌星际战士", "黑甲巨人"], ["traitor Space Marine", "Heretic Astartes"])),

    chaos_horus_heresy: E("imperium/concept", "lore", "any", "omen_emperor", L("荷鲁斯之乱", "The Horus Heresy"),
      L("一万年前，帝皇最宠爱的儿子荷鲁斯率半数军团叛变，人类帝国几乎覆灭。",
        "Ten thousand years ago the Emperor's favourite son, Horus, led half the Legions in revolt. The Imperium nearly died."),
      null, A(["荷鲁斯之乱", "荷鲁斯"], ["Horus Heresy", "Horus"])),

    chaos_cult: E("chaos/organization", "lore", "chaos", "cultist", L("混沌邪教", "Chaos Cults"),
      L("潜伏在帝国世界里的信徒团体。它们通常从施舍和关怀开始。",
        "Secret congregations on Imperial worlds. They usually begin with charity and kindness."),
      null, A(["邪教", "诗班"], ["cult", "the Choir"])),

    chaos_mutant: E("chaos/unit", "lore", "chaos", "mutant", L("变种人", "Mutants"),
      L("被亚空间扭曲的人类，在帝国受尽鄙视与追捕，许多人因此被逼进邪教。",
        "Humans twisted by the warp. Despised and hunted, many are driven into the cults."),
      null, A(["变种人"], ["mutant"])),

    chaos_sorcerer: E("chaos/unit", "lore", "chaos", "chaos_sorcerer", L("混沌术士", "Chaos Sorcerer"),
      L("用灵魂换取巫术的叛徒，多侍奉奸奇。他们知道得太多，还想知道更多。",
        "Traitors who traded their souls for sorcery, often in Tzeentch's service. They know too much and want more."),
      null, A(["术士"], ["sorcerer"])),

    chaos_daemon_khorne: E("chaos/unit", "enemy", "chaos", "daemon_khorne", L("放血鬼", "Bloodletter"),
      L("恐虐的步兵恶魔，红皮长角，手持烧红的地狱之刃。",
        "Khorne's foot-soldier daemons: red-skinned, horned, wielding burning hellblades."),
      null, A(["放血鬼", "红色的东西"], ["Bloodletter", "red thing"])),

    chaos_daemon_nurgle: E("chaos/unit", "enemy", "chaos", "daemon_nurgle", L("瘟疫使者", "Plaguebearer"),
      L("纳垢的独眼恶魔，永远在清点世间的疾病。还有些胖乎乎的小东西，只会哼歌。",
        "Nurgle's one-eyed daemons, forever counting the world's diseases. The chubby little ones just hum."),
      null, A(["瘟疫使者", "纳垢灵"], ["Plaguebearer", "Nurgling"])),

    chaos_daemon_tzeentch: E("chaos/unit", "enemy", "chaos", "daemon_tzeentch", L("惧妖", "Horror"),
      L("奸奇的恶魔。粉色的会笑着分裂成蓝色的，蓝色的只会抱怨。",
        "Tzeentch's daemons. Pink ones laugh and split into blue ones. The blue ones complain."),
      null, A(["惧妖"], ["Horror", "Pink Horror", "Blue Horror"])),

    chaos_daemon_slaanesh: E("chaos/unit", "enemy", "chaos", "daemon_slaanesh", L("欲魔", "Daemonette"),
      L("色孽的恶魔，美丽而迅捷，钳状的手比刀更快。",
        "Slaanesh's daemons: beautiful and swift, their claws faster than any blade."),
      null, A(["欲魔"], ["Daemonette"])),

    chaos_daemon_prince: E("chaos/unit", "lore", "chaos", "daemon_prince", L("恶魔王子", "Daemon Prince"),
      L("被诸神眷顾到极致的凡人，会飞升为不朽的恶魔。更多人在半路变成了混沌卵。",
        "Mortals favoured so highly they ascend into immortal daemonhood. Many more become spawn on the way."),
      null, A(["恶魔王子"], ["Daemon Prince"])),

    chaos_spawn: E("chaos/unit", "lore", "chaos", "mutant", L("混沌卵", "Chaos Spawn"),
      L("承受不住诸神恩赐的凡人，扭曲成没有心智的血肉怪物。",
        "Mortals who could not bear the gods' gifts, twisted into mindless masses of flesh."),
      null, A(["混沌卵"], ["Chaos Spawn"])),

    chaos_eye_of_terror: E("chaos/place", "place", "chaos", "omen_black_crusade", L("恐惧之眼", "Eye of Terror"),
      L("现实与亚空间交融的星域，遍布恶魔世界，是叛变军团的老巢。",
        "A region where reality and warp bleed together, crowded with daemon worlds: home of the traitor Legions."),
      L("恐惧之眼诞生于一个古老异形文明的堕落，即色孽诞生之时。荷鲁斯之乱后，叛变军团逃进这里，在恶魔世界上度过了一万年。对他们来说，这里的时间几乎静止；对帝国来说，这里是一切噩梦的源头。",
        "The Eye was born from the fall of an ancient alien civilisation—the moment Slaanesh came into being. After the Horus Heresy the traitor Legions fled here and spent ten thousand years on its daemon worlds. For them, time barely passes; for the Imperium, it is where every nightmare comes from."),
      A(["恐惧之眼"], ["Eye of Terror"]), "daemon_world"),

    /* ---------------- Xenos ---------------- */
    xenos_ork: E("orks/organization", "enemy", "xenos", "ork", L("兽人", "Orks"),
      L("好战的绿皮异形，打仗是为了开心。聚得越多，它们的破烂科技就越好用。",
        "Warlike green-skinned aliens who fight for fun. The more gather, the better their junk-tech works."),
      L("兽人靠真菌孢子繁殖，连死后都在撒播孢子，因此几乎无法根除。它们相信什么，什么就会成真：涂成红色的车跑得更快，因为大家都这么信。谁最大，谁就是老大。",
        "Orks reproduce through fungal spores, shed even in death, so they are almost impossible to eradicate. What they believe comes true: red vehicles really are faster, because everyone thinks so. Whoever is biggest is boss."),
      A(["兽人", "绿皮"], ["Ork", "Orks", "greenskin"])),

    xenos_waaagh: E("orks/concept", "lore", "xenos", "ork_boss", L("Waaagh!", "Waaagh!"),
      L("兽人的大征伐，也是它们的战吼。成千上万兽人的集体信念会化为真实的灵能力量。",
        "An ork war-migration and its battle cry. The shared belief of thousands becomes real psychic power."),
      null, A(["哇——！", "Waaagh"], ["WAAAGH", "Waaagh"])),

    xenos_ork_warboss: E("orks/unit", "enemy", "xenos", "ork_boss", L("兽人军阀", "Ork Warboss"),
      L("最大最凶的兽人。兽人以体型论地位，军阀就是长得最大的那个。",
        "The biggest, meanest ork around. Among orks, rank is size, and the warboss grew largest."),
      null, A(["兽人军阀", "军阀"], ["Ork Warboss", "warboss"])),

    xenos_tyranid: E("tyranids/organization", "enemy", "xenos", "gaunt", L("泰伦虫族", "Tyranids"),
      L("来自银河之外的吞噬者。虫巢舰队降临之处，一颗星球的全部生物质都会被吃光。",
        "Devourers from beyond the galaxy. Where a Hive Fleet descends, every scrap of a world's biomass is eaten."),
      L("泰伦虫族不谈判，不留俘虏，也不在乎你信什么。它们吃掉一切活物，把星球化为孢子与酸液，再用吸收的基因培育新的怪物。每吃一次败仗，它们就学习一次，进化出专门克制对手的后代。",
        "Tyranids don't negotiate, take prisoners or care what you believe. They devour all life, reduce worlds to spores and acid, and breed new monsters from what they absorb. Every defeat teaches them, and they evolve offspring built to counter their foe."),
      A(["泰伦", "虫族", "虫巢舰队", "虫潮", "虫群"], ["Tyranid", "Tyranids", "hive fleet", "swarm"])),

    xenos_hive_mind: E("tyranids/figure", "boss", "xenos", "omen_hivemind", L("虫巢意志", "The Hive Mind"),
      L("统御所有泰伦虫族的集体意识：庞大，饥饿，冷漠。",
        "The collective consciousness behind every Tyranid: vast, hungry, indifferent."),
      L("单只虫子几乎没有自我，靠“突触生物”接收虫巢意志的指令。斩断突触节点，附近的虫群就会陷入混乱。它在亚空间投下的阴影，会让附近的灵能者失聪、发疯。",
        "Individual creatures have almost no self; they receive the Hive Mind's will through synapse creatures. Sever a synapse node and the nearby swarm descends into chaos. Its shadow in the warp deafens and maddens psykers nearby."),
      A(["虫巢意志"], ["Hive Mind"])),

    xenos_genestealer: E("tyranids/unit", "enemy", "xenos", "genestealer", L("基因窃取者", "Genestealer"),
      L("泰伦虫族的先锋。它的“亲吻”会感染宿主，繁衍出崇拜虫群的混血邪教。",
        "The Tyranid vanguard. Its 'kiss' infects hosts, who breed hybrid cults that worship the coming swarm."),
      null, A(["基因窃取者"], ["Genestealer"])),

    xenos_hive_tyrant: E("tyranids/unit", "enemy", "xenos", "hive_tyrant", L("虫巢暴君", "Hive Tyrant"),
      L("泰伦虫群的指挥官，巨大而狡猾，是虫巢意志最强的突触。",
        "Swarm commanders: huge and cunning, the Hive Mind's mightiest synapse."),
      null, A(["虫巢暴君"], ["Hive Tyrant"])),

    xenos_swarmlord: E("tyranids/figure", "boss", "xenos", "hive_tyrant", L("虫群主宰", "The Swarmlord"),
      L("最古老、最狡猾的虫巢暴君，四臂四刃。每次被杀，都会带着记忆重生。",
        "The oldest, most cunning Hive Tyrant, four blades in four arms. Each time it is slain, it is reborn with its memories."),
      L("虫群主宰是虫巢意志在战场上的统帅，只为最重要的战争现身。它会研究敌人的战术，再精准地一一破解。杀死它意义不大：只要需要，虫巢意志会再造一个它。",
        "The Swarmlord is the Hive Mind's general made flesh, appearing only for the wars that matter. It studies an enemy's tactics and dismantles them one by one. Killing it achieves little: when needed, the Hive Mind simply grows it again."),
      A(["虫群主宰"], ["Swarmlord"])),

    xenos_tyranid_warrior: E("tyranids/unit", "enemy", "xenos", "tyranid_warrior", L("泰伦武士", "Tyranid Warrior"),
      L("人形的突触生物，指挥周围的小型虫子。杀了它，虫群就乱了。",
        "Man-shaped synapse creatures directing smaller beasts. Kill one and the swarm unravels."),
      null, A(["泰伦武士"], ["Tyranid Warrior"])),

    xenos_shadow_in_warp: E("tyranids/concept", "lore", "xenos", "omen_hivemind", L("亚空间阴影", "Shadow in the Warp"),
      L("虫巢舰队在亚空间投下的灵能静默，切断星语通讯，让灵能者发疯。",
        "The psychic silence a Hive Fleet casts on the warp. It cuts astropathic contact and drives psykers mad."),
      null, A(["影子", "阴影"], ["shadow"])),

    /* ---------------- T'au ---------------- */
    tau_empire: E("tau/organization", "lore", "tau", "omen_tau_fleet", L("钛帝国", "T'au Empire"),
      L("银河东缘一个年轻而迅速扩张的异形帝国，科技先进，信奉大义。",
        "A young, fast-growing alien empire on the galaxy's eastern fringe: advanced, and devoted to the Greater Good."),
      null, A(["钛帝国", "钛人", "钛族"], ["T'au", "T'au Empire", "Tau"])),

    tau_greater_good: E("tau/concept", "leader", "tau", "tau_ethereal", L("大义", "The Greater Good"),
      L("钛帝国的核心信条：个体为整体服务，每个种族各尽所能。",
        "The T'au creed: the individual serves the whole, and every race contributes what it does best."),
      L("大义让钛帝国团结得惊人，也吸纳了许多异形与人类。但谁贡献什么，由以太族决定；异议被称为“暂时的误会”，需要“澄清”。在大义之下，人人都有位置，只是位置不一定由自己选。",
        "The Greater Good binds the empire with astonishing unity and has drawn in many aliens and humans. But who contributes what is decided by the Ethereals, and dissent is a 'temporary misunderstanding' to be 'clarified.' Everyone has a place—not always one they chose."),
      A(["大义"], ["Greater Good"])),

    tau_ethereal: E("tau/organization", "leader", "tau", "tau_ethereal", L("以太族", "Ethereals"),
      L("钛族的统治种姓。无需下令，单凭在场，就能让其他钛族镇定与服从。",
        "The ruling caste of the T'au. Their mere presence calms and commands the others."),
      L("以太族创立了大义，也是它的化身。其他种姓几乎无条件地服从他们；有传言说这份服从不全是信仰，而是某种生理上的影响。一位以太族倒下，周围的钛族战士可能当场崩溃，也可能为复仇而疯狂。",
        "The Ethereals founded the Greater Good and embody it. The other castes obey them almost unconditionally; rumour says this loyalty is not purely faith but something biological. When an Ethereal falls, nearby warriors may collapse in despair—or fight on in fury."),
      A(["以太族", "长者"], ["Ethereal", "Aun'el"])),

    tau_castes: E("tau/organization", "lore", "tau", "tau_warrior", L("种姓", "The Castes"),
      L("钛族分五个种姓：火族、土族、气族、水族，以及凌驾其上的以太族。",
        "T'au society has five castes: Fire, Earth, Air, Water, and the Ethereals above them all."),
      null, A(["种姓"], ["caste"])),

    tau_fire_caste: E("tau/organization", "lore", "tau", "tau_warrior", L("火族", "Fire Caste"),
      L("钛族的战士种姓，精于远程火力与纪律，不喜欢近身搏斗。",
        "The warrior caste: masters of ranged fire and discipline, averse to close combat."),
      null, A(["火族", "火族战士"], ["fire caste", "fire warrior"])),

    tau_water_caste: E("tau/organization", "lore", "tau", "tau_water_caste", L("水族", "Water Caste"),
      L("钛族的外交与商贸种姓，最擅长说服。他们的微笑，比枪更难对付。",
        "The diplomats and traders. Masters of persuasion, their smiles are harder to fight than guns."),
      null, A(["水族"], ["water caste", "water-caste"])),

    tau_earth_caste: E("tau/organization", "lore", "tau", "tau_drone", L("土族", "Earth Caste"),
      L("钛族的工程师与科学家，造战斗服、造无人机，也造净水器。",
        "Engineers and scientists. They build battlesuits, drones—and water purifiers."),
      null, A(["土族"], ["earth caste", "earth-caste"])),

    tau_shadowsun: E("tau/figure", "leader", "tau", "omen_tau_fleet", L("影日指挥官", "Commander Shadowsun"),
      L("钛帝国最出色的指挥官之一，以耐心的伏击战“考尤”闻名。",
        "One of the T'au's finest commanders, famed for patient Kauyon ambush warfare."),
      L("影日擅长隐形与诱敌：她可以等上好几天，直到敌人自己走进死地。她忠于以太族，是大义最锋利的刀，也曾被派去对付叛离的远见。",
        "Shadowsun is a mistress of stealth and lures, content to wait days until the enemy walks into the killing ground. Loyal to the Ethereals, she is the Greater Good's sharpest blade—and has been sent against the renegade Farsight."),
      A(["影日"], ["Shadowsun"])),

    tau_farsight: E("tau/figure", "leader", "tau", "omen_farsight", L("远见指挥官", "Commander Farsight"),
      L("传奇钛族指挥官，在远征中脱离以太族，于达摩克利斯海湾之外自立飞地。",
        "A legendary T'au commander who broke from the Ethereals on campaign and founded enclaves beyond the Damocles Gulf."),
      L("远见擅长“蒙卡”式突击。一次远征后，他不再回应以太族的召唤，在海湾外的旧帝国世界建立了飞地。他佩着一把来自古代遗迹的剑；有人说他发现了以太族隐瞒的真相，也有人说那把剑改变了他。",
        "Farsight excels at decisive Mont'ka strikes. After one campaign he stopped answering the Ethereals' call and founded the Farsight Enclaves on old Imperial worlds beyond the Gulf. He bears a sword from ancient ruins; some say he learned truths the Ethereals hide, others that the blade changed him."),
      A(["远见"], ["Farsight"])),

    tau_farsight_enclaves: E("tau/place", "place", "tau", "omen_farsight", L("远见飞地", "Farsight Enclaves"),
      L("远见建立的独立钛族领地：仍信奉大义，却不受以太族统治。",
        "Farsight's independent T'au domain: still devoted to the Greater Good, but free of Ethereal rule."),
      L("远见飞地位于达摩克利斯湾之外，原本是帝国的旧殖民地。这里没有以太族，钛族、人类与其他种族一起生活和作战，意见不合就当面吵。钛帝国至今不承认它，影日也曾奉命前来。",
        "The Enclaves lie beyond the Damocles Gulf on old Imperial colony worlds. There are no Ethereals; T'au, humans and other races live and fight together, and argue openly when they disagree. The T'au Empire still does not recognise them, and Shadowsun has been sent against them."),
      A(["海湾的另一边", "飞地"], ["Enclaves", "far side of the Gulf"]), "tau_outpost"),

    tau_battlesuit: E("tau/unit", "lore", "tau", "tau_battlesuit", L("战斗服", "Battlesuit"),
      L("土族打造的机动装甲，配有喷射器，能从天而降，精准一击。",
        "Earth-caste powered armour with jet packs, built to drop from the sky and strike precisely."),
      null, A(["战斗服"], ["battlesuit"])),

    tau_drone: E("tau/unit", "lore", "tau", "tau_drone", L("无人机", "Drones"),
      L("钛族的小型智能机器，负责掩护、标记与侦察。有时会替主人挡枪。",
        "Small intelligent machines that shield, mark targets and scout. Sometimes they take the shot for you."),
      null, A(["无人机"], ["drone"])),

    tau_gue_vesa: E("tau/unit", "lore", "tau", "gue_vesa", L("古维萨", "Gue'vesa"),
      L("为钛帝国作战的人类辅助军，钛语意为“人类帮手”。",
        "Human auxiliaries who fight for the T'au. The name means roughly 'human helpers.'"),
      null, A(["古维萨", "人类辅助军"], ["gue'vesa"])),

    tau_kroot: E("tau/unit", "lore", "tau", "kroot", L("克鲁特", "Kroot"),
      L("钛帝国的鸟喙异形盟友，擅长近战与丛林战。它们吃掉敌人，以吸收对方的特性。",
        "Beaked alien allies of the T'au, deadly in melee and jungle. They eat their foes to absorb their traits."),
      null, A(["克鲁特"], ["Kroot"])),

    tau_kauyon: E("tau/concept", "lore", "tau", "tau_battlesuit", L("考尤与蒙卡", "Kauyon & Mont'ka"),
      L("钛族的两种战争之道：考尤是耐心伏击的猎人，蒙卡是一击致命的杀招。",
        "Two T'au ways of war: Kauyon, the patient hunter's ambush; Mont'ka, the single killing blow."),
      null, A(["考尤", "蒙卡"], ["Kauyon", "Mont'ka"]))
  });
})();

/* ---------------- Places (cat "place", SPEC §6 extension: scene = thumbnail) ---------------- */
(function () {
  function L(zh, en) { return {zh: zh, en: en}; }
  /* race = who controls / represents the place (else "other"); type is always "place" (SPEC §13). */
  function P(race, faction, scene, name, text, more, aliases) {
    return {cat: "place", faction: faction, race: race, type: "place", scene: scene, name: name, text: text, more: more, aliases: aliases};
  }
  function A(zh, en) { return {zh: zh, en: en}; }

  WH.registerCodex({
    /* shared */
    place_terra: P("imperium", "any", "throne_light", L("泰拉", "Terra"),
      L("人类的母星，帝国的首都。帝皇的黄金王座就在泰拉的皇宫深处。",
        "Humanity's birthworld and the Imperium's capital. The Emperor's Golden Throne lies deep within its Palace."),
      L("泰拉曾叫地球。如今它几乎被城市、要塞与官署完全覆盖，皇宫庞大得像一片大陆。每天都有灵能者被送往这里，喂养帝皇的星炬。大多数帝国臣民一生都不会见到它，却每天都向它的方向祈祷。",
        "Terra was once called Earth. Today it is almost entirely covered by cities, fortresses and bureaux, and the Palace sprawls like a continent. Psykers are shipped here daily to feed the Astronomican. Most citizens will never see it, yet pray toward it every day."),
      A(["泰拉", "地球"], ["Terra", "Holy Terra"])),

    place_cadia: P("imperium", "any", "burning_city", L("卡迪亚", "Cadia"),
      L("曾经扼守恐惧之眼出口的要塞世界，在第十三次黑色远征中陷落。",
        "The fortress world that once guarded the exit of the Eye of Terror. It fell in the Thirteenth Black Crusade."),
      L("一万年来，卡迪亚的人生下来就会用枪，挡住了一次又一次从恐惧之眼涌出的大军。它的陷落让帝国失去了最坚固的门闩，也为大裂隙的出现敲响了丧钟。卡迪亚人说：卡迪亚屹立。可它没有。",
        "For ten thousand years Cadians were born holding guns, throwing back host after host from the Eye of Terror. Its fall cost the Imperium its strongest gate and heralded the Great Rift. Cadians used to say Cadia stands. It did not."),
      A(["卡迪亚"], ["Cadia"])),

    place_daemon_world: P("chaos", "chaos", "daemon_world", L("恶魔世界", "Daemon Worlds"),
      L("被恶魔王子统治的星球，现实已被亚空间浸透。地面会呼吸，天空会看你。",
        "Planets ruled by Daemon Princes, soaked through with the warp. The ground breathes; the sky watches you."),
      L("在恐惧之眼这样的亚空间风暴中，物理法则只是建议。一颗恶魔世界的模样，取决于统治它的恶魔王子想要什么：也许是永远在打仗的铜色荒原，也许是一座永不散场的宴会厅。",
        "In warp storms like the Eye of Terror, physics is only a suggestion. A daemon world takes whatever shape its Daemon Prince desires: an endless brass battlefield, perhaps, or a banquet hall where the feast never ends."),
      A(["恶魔世界"], ["daemon world"])),

    /* Imperium */
    place_aurex: P("imperium", "imperium", "hive_spire", L("奥雷克斯二号", "Aurex Secundus"),
      L("你的家乡：一颗黄天的巢都世界，靠工厂和什一税维持在帝国的账本上。",
        "Your home: a yellow-skied hive world, kept on the Imperium's ledger by its factories and its tithe."),
      L("奥雷克斯的天空被工厂废气染成黄色，大多数居民一辈子没见过真正的太阳。它不是什么重要的世界，产弹壳、产工人、产士兵。也正因为不重要，黑色远征降临时，帝国花了七天才赶到。",
        "Aurex's sky is stained yellow by manufactorum smog; most inhabitants never see the true sun. It is not an important world: it makes shell casings, workers and soldiers. Precisely because it matters so little, the Imperium took seven days to answer the Black Crusade."),
      A(["奥雷克斯", "故乡"], ["Aurex", "home"])),

    place_tower_three: P("imperium", "imperium", "hive_hab", L("三号塔居住区", "Tower Three Habs"),
      L("你长大的居住块。楼梯间卖掺水的咖啡，墙上的帝皇画像只剩一双眼睛。",
        "The hab-block where you grew up. The stairwell sells watered recaff; the Emperor's portrait is down to its eyes."),
      L("三号塔是第六工厂的工人宿舍，一间屋住六个人，轮流睡觉。它塌过一次，就在米娜做梦的第二天。黑色远征时，它又塌了一次。这一次，没有人提前做梦。",
        "Tower Three houses Manufactorum Six's workers, six to a room, sleeping in shifts. It collapsed once, the day after Mina dreamed it. During the Black Crusade it fell again. That time, nobody dreamed it first."),
      A(["三号塔", "居住块", "楼梯间"], ["Tower Three", "hab-block", "stairwell"])),

    place_manufactorum_six: P("imperium", "imperium", "manufactorum", L("第六工厂", "Manufactorum Six"),
      L("你上工的地方，一班十六个小时。黑色远征时，工人们用铆钉枪守住了它。",
        "Where you worked sixteen-hour shifts. During the Black Crusade, its workers held it with rivet guns."),
      L("第六工厂生产激光枪电池和弹壳，机器比工人值钱。格鲁斯克监工记得每个人的迟到次数，也记得每个人的名字。最后他带着工人守住了它，用的是平时敲铆钉的枪。",
        "Manufactorum Six makes lasgun power packs and shell casings; the machines are worth more than the workers. Overseer Grusk remembered every late arrival, and every name. In the end he held it with his workers, using the guns they drove rivets with."),
      A(["第六工厂"], ["Manufactorum Six"])),

    place_imp_troopship: P("imperium", "imperium", "ship_interior", L("运兵舰", "The Troopship"),
      L("把新兵从一个战场运到下一个战场的铁罐头。舷窗在跃迁时会被封死。",
        "An iron can carrying recruits from one war to the next. Its viewports are shuttered for every warp jump."),
      L("帝国运兵舰常常一次装载数万名士兵，在亚空间里航行数周到数月。跃迁期间舷窗必须封死，船员靠盖勒力场和祈祷活下来。出舱时死了几个人、日历跳了几个月，都算“正常航行”。",
        "An Imperial troopship may carry tens of thousands of soldiers through weeks or months of warp travel. Viewports are sealed during jumps; the crew survives on the Gellar field and prayer. A few dead and a calendar that skips months still counts as a normal voyage."),
      A(["运兵舰", "运兵车"], ["troopship", "transport"])),

    place_dustfall: P("imperium", "imperium", "trench", L("尘落星", "Dustfall"),
      L("被兽人盯上的灰尘世界，你的第一个战场。战壕里的水永远没过脚踝。",
        "A dusty world the orks wanted, and your first battlefield. The trench water is always ankle-deep."),
      L("尘落星没有值得争夺的东西，除了它挡在兽人前进的路上。帝国在这里挖了几百公里的战壕。每打退一次兽人，第二年地里就会长出新的一批。",
        "Dustfall has nothing worth fighting for, except that it lies in the orks' path. The Imperium dug hundreds of kilometres of trenches here. Every ork attack thrown back sows the next one, sprouting from the soil a year later."),
      A(["尘落星"], ["Dustfall"])),

    place_vessel: P("imperium", "imperium", "ruins", L("雨城维瑟尔", "Vessel"),
      L("一座永远在下雨的驻防城市，市民和善得过分。后来，它的上城区被“净化”了。",
        "A garrison city of endless rain whose citizens were far too kind. Later, its upper districts were 'purged.'"),
      L("维瑟尔是帝国的驻防城市，常年阴雨。混沌邪教在这里从送汤开始，一碗一碗地赢得人心。审判庭来过之后，上城区被封锁，雨水第一次没能浇灭火。",
        "Vessel is an Imperial garrison city, wet all year round. The cult there began by giving out soup, winning hearts one bowl at a time. After the Inquisition came, the upper districts were sealed, and for once the rain couldn't put the fire out."),
      A(["维瑟尔", "雨城"], ["Vessel"])),

    place_hesper: P("imperium", "imperium", "jungle", L("赫斯珀农业星", "Hesper"),
      L("一望无际的麦田，人人笑得一模一样。虫巢舰队来了以后，帝国亲手烧了它。",
        "Endless wheat, and everyone smiling the same smile. After the hive fleet came, the Imperium burned it itself."),
      L("赫斯珀是帝国的粮仓之一，供应好几个星区。基因窃取者邪教在这里潜伏了几代人，把村民变成了等待“救主”的家族。虫巢舰队降临后，舰队宁可烧掉它，也不让虫子吃到。",
        "Hesper fed several sectors. A genestealer cult hid there for generations, turning villagers into families awaiting their 'saviours.' When the hive fleet arrived, the Imperium burned the world rather than let the swarm eat it."),
      A(["赫斯珀"], ["Hesper"])),

    place_astropath_tower: P("imperium", "imperium", "hive_spire", L("星语塔", "Astropathic Tower"),
      L("巢都顶端的灵能通讯塔。星语者在这里把求救声送往群星，一句话可以念上七天。",
        "The psychic relay atop the hive. Astropaths send pleas for help to the stars here, one phrase for seven days."),
      L("星语者是经过灵魂绑定的灵能者，用心灵在星系之间传递讯息。大裂隙出现后，许多讯息再也送不出去。奥雷克斯的星语者念了七天，最终收到了回应。",
        "Astropaths are soul-bound psykers who send messages between the stars with their minds. Since the Great Rift opened, many messages never arrive. Aurex's astropaths chanted for seven days before an answer finally came."),
      A(["星语塔"], ["astropathic tower"])),

    /* Chaos */
    place_carcharos: P("imperium", "chaos", "hive_spire", L("卡尔卡罗斯", "Carcharos"),
      L("你出生的巢都世界。上巢住着贵族，下巢住着垃圾，中间住着交税的人。",
        "The hive world of your birth. Nobles live up top, refuse lives at the bottom, taxpayers in between."),
      L("卡尔卡罗斯的沃恩巢都高达数公里，阶层按楼层划分：越往上空气越干净，越往下人越不值钱。诗班的起义让中巢燃烧了六天，直到星际战士从天而降。后来，黑色舰队来了。",
        "Hive Vorne on Carcharos rises kilometres high, its classes divided by floor: the higher you live, the cleaner the air; the lower, the cheaper the life. The Choir's uprising burned the mid-hive for six days, until Space Marines fell from the sky. Then the black fleet came."),
      A(["卡尔卡罗斯", "沃恩巢都"], ["Carcharos", "Hive Vorne"])),

    place_sump: P("imperium", "chaos", "underhive", L("污池", "The Sump"),
      L("沃恩巢都最底层，上面扔下来的一切都在这里堆积、发酵、被捡走。",
        "The very bottom of Hive Vorne, where everything thrown down piles up, festers, and gets picked over."),
      L("污池是巢都的地基，也是它的下水道。这里没有登记，没有配额，没有太阳。执法官每年下来“清理”一次，变种人、邪教和孩子都在清理名单上。",
        "The Sump is the hive's foundation and its sewer. No registration, no quotas, no sun. Once a year the enforcers come down to 'clean up,' and mutants, cultists and children are all on the list."),
      A(["污池", "垃圾瀑布"], ["the Sump", "garbage falls"])),

    place_choir_chapel: P("chaos", "chaos", "cult_shrine", L("诗班礼拜堂", "The Choir's Chapel"),
      L("中巢一座废弃的礼拜堂，诗班在这里发汤、洗脚、讲道，然后收取代价。",
        "An abandoned mid-hive chapel where the Choir hands out soup, washes feet, preaches—and then collects."),
      L("这座礼拜堂原本供奉帝皇，后来被遗弃。维勒姆神父把它变成了诗班的家：有热汤，有洗脚水，有人记得你的名字。直到有一天，面包开始要价。",
        "The chapel once served the Emperor before it was abandoned. Father Vellum made it the Choir's home: hot soup, a basin for your feet, someone who remembers your name. Until the day the bread started to cost something."),
      A(["礼拜堂"], ["chapel"])),

    place_black_warship: P("chaos", "chaos", "ship_interior", L("黑色战舰底舱", "Black Warship's Lower Decks"),
      L("黑色军团战舰的奴隶舱。每天一桶食物，舷窗从不封闭。",
        "The slave decks of a Black Legion warship. One bucket of food a day; the viewports are never shuttered."),
      L("黑色军团的战舰大多来自一万年前的大远征，经过无数次改造与腐化。底舱塞满了从各个世界掳来的奴隶和信徒，强者吃饱，弱者消失。这就是黑色军团的规矩，也是混沌的规矩。",
        "Most Black Legion warships date back to the Great Crusade, rebuilt and corrupted countless times. Their lower decks are packed with slaves and believers taken from many worlds; the strong eat, the weak vanish. That is the Black Legion's rule—and Chaos's."),
      A(["底舱"], ["lower decks"])),

    place_bazaar_eye: P("chaos", "chaos", "daemon_world", L("恐惧之眼的集市", "Bazaar of the Eye"),
      L("什么都能卖的集市：盔甲、名字、昨天、明天。最常见的货币是记忆。",
        "A market where anything is for sale: armour, names, yesterdays, tomorrows. The usual currency is memory."),
      L("在恐惧之眼里，灵魂、记忆和时间都可以拿来交易。商人们往往是恶魔或被诸神改造过的凡人，从不压价，也从不吃亏。买家总以为自己赚到了。",
        "In the Eye of Terror, souls, memories and time are all trade goods. The merchants are usually daemons or god-touched mortals; they never haggle and never lose. Buyers always think they got a bargain."),
      A(["集市"], ["market"])),

    place_trial_grounds: P("chaos", "chaos", "daemon_world", L("四扇试炼之门", "The Four Doors of Trial"),
      L("红铜、腐木、水晶、丝绸。每扇门后，都有一位神在等着看你是什么做的。",
        "Brass, rotten wood, crystal, silk. Behind each door, a god waits to see what you're made of."),
      L("想成为混沌勇士，就要让某位神注意到你。每一扇门后的试炼都考验一种本性：杀戮、忍受、改变、渴望。通过的人得到印记，失败的人往往成为别人的印记。",
        "To become a champion of Chaos, a god must notice you. Each door's trial tests one nature: killing, enduring, changing, wanting. Those who pass receive a mark. Those who fail often become someone else's."),
      A(["试炼之门", "铜门", "丝绸门"], ["door of trial", "brass door", "silken door"])),

    place_aldrin: P("imperium", "chaos", "cathedral", L("阿尔德林", "Aldrin"),
      L("遍地教堂的帝国圣地世界，供奉着一块圣人骨。它最后在灭绝令中化成了白光。",
        "An Imperial shrine world of cathedrals, keeper of a saint's bone. It ended as a flash of white under Exterminatus."),
      L("阿尔德林是帝国朝圣者的目的地，满街是神龛与赞美诗。黑色军团来这里不是为了占领，而是为了让信徒看着自己的圣物被烧掉。最终，恶魔审判庭下令把整颗星球连同所有人一起抹去。",
        "Aldrin drew pilgrims from across the sector, its streets full of shrines and hymns. The Black Legion came not to conquer but to make the faithful watch their relic burn. In the end the Ordo Malleus ordered the whole world erased, everyone on it included."),
      A(["阿尔德林"], ["Aldrin"])),

    /* T'au */
    place_dalnor: P("tau", "tau", "tau_city", L("达尔诺尔（新卡尔德）", "Dal'nor (New Calder)"),
      L("你的家乡，前帝国殖民地。帝国的船不再来后，它在大义的旗下有了新名字。",
        "Your home, a former Imperial colony. When the Imperial ships stopped coming, it took a new name under the Greater Good."),
      L("大裂隙切断了新卡尔德与帝国的联系。六年无人问津之后，钛帝国的白色舰队到来，总督签字加入了大义。人类在这里有了净水、准时的工钱，也有了永远排在第三批的位置。",
        "The Great Rift cut New Calder off from the Imperium. After six years of silence the T'au white fleet arrived and the governor signed on to the Greater Good. Humans here gained clean water and punctual wages—and a permanent place in the third wave."),
      A(["达尔诺尔", "新卡尔德"], ["Dal'nor", "New Calder"])),

    place_human_quarter: P("tau", "tau", "hive_hab", L("人类街区", "The Human Quarter"),
      L("达尔诺尔的人类聚居区。旧教堂关了门，净水器旁的无人机记下每个打水的人。",
        "Dal'nor's human district. The old chapel is shut; a drone by the water purifier logs everyone who drinks."),
      L("帝国统治时，这里是殖民地最穷的街区。钛帝国来了以后，它有了净水和准时的工钱，也有了无处不在的无人机。雷娜姨的旧教堂一直没拆，只是没人敢进去祷告。",
        "Under the Imperium this was the colony's poorest district. The T'au brought clean water, punctual wages and drones everywhere. Aunt Rena's old chapel was never torn down; people just stopped daring to pray in it."),
      A(["人类街区", "旧教堂"], ["human quarter", "old chapel"])),

    place_dalnor_port: P("tau", "tau", "tau_city", L("达尔诺尔港", "Port Dal'nor"),
      L("你卸货的码头，也是撤离的大门。门关上时，外面全是人类。",
        "The docks where you hauled cargo, and the evacuation gate. When it closed, everyone outside was human."),
      L("达尔诺尔港是殖民地与钛帝国之间的生命线，货物、士兵和撤离船都从这里进出。撤离那天，能量屏把人群分成了两边：门里的人和门外的人。",
        "Port Dal'nor is the colony's lifeline to the T'au Empire; cargo, soldiers and evacuation ships all pass through. On evacuation day, an energy screen split the crowd in two: those inside the gate, and those outside."),
      A(["港口", "码头"], ["port", "docks"])),

    place_frontier_outpost: P("tau", "tau", "tau_outpost", L("边境前哨", "Frontier Outpost"),
      L("火族的训练营与前线据点，钛族、人类和克鲁特在这里同吃同住，但不同桌。",
        "Fire-caste training camp and frontline base. T'au, humans and Kroot live side by side here, but eat at separate tables."),
      L("钛族前哨通常由土族预制建造，一夜之间就能搭起来。火族在这里训练古维萨，克鲁特在丛林边扎营。人类学会了耐心伏击，也学会了自己的名字总被念错。",
        "T'au outposts are earth-caste prefabs that can go up overnight. The fire caste trains gue'vesa here; the Kroot camp at the jungle's edge. Humans learn patient ambush—and that their names will always be mispronounced."),
      A(["前哨", "前哨站"], ["outpost"])),

    place_tau_transport: P("tau", "tau", "ship_interior", L("钛族运兵船", "T'au Transport"),
      L("钛族的船只在亚空间浅层“潜水”航行。钛人毫无感觉，人类会做噩梦。",
        "T'au ships travel by shallow 'dives' into the warp. The T'au feel nothing; the humans have nightmares."),
      L("钛族与亚空间的联系很弱，几乎不受恶魔侵扰，所以只能用“浅潜”的方式在亚空间边缘短距离跳跃，比帝国慢，但安全。对船上的人类来说，就没那么安全了。",
        "The T'au have only a faint presence in the warp and are largely ignored by daemons, so their ships make short 'shallow dives' at its edge—slower than Imperial travel, but safer. Less safe for the humans aboard."),
      A(["运兵船"], ["troopship"])),

    place_tau_homeworld: P("tau", "tau", "tau_city", L("钛星", "T'au (Homeworld)"),
      L("钛族的母星与最古老的星域，以太族的权力中心。大义从这里出发。",
        "The T'au homeworld and oldest sept, seat of Ethereal power. The Greater Good set out from here."),
      L("不到一万年前，钛族还是一个在母星上互相征战的原始种族。以太族出现后，各种姓停止内战，在大义之下团结起来，以惊人的速度进入群星。在帝国看来，钛族年轻得几乎不值一提。",
        "Less than ten thousand years ago the T'au were a primitive species warring on their homeworld. When the Ethereals appeared, the castes ended their wars, united under the Greater Good, and reached the stars astonishingly fast. To the Imperium, they are almost too young to matter."),
      A(["钛星"], ["T'au homeworld"])),

    place_damocles_gulf: P("other", "tau", "void", L("达摩克利斯湾", "Damocles Gulf"),
      L("横在钛帝国与人类帝国之间的星域。两边隔着它打了好几场远征。",
        "The expanse of stars between the T'au Empire and the Imperium. Several crusades have been fought across it."),
      L("达摩克利斯湾是钛帝国与人类帝国交锋的前线，亚空间航行不稳。帝国曾跨过它发动达摩克利斯远征；后来，远见指挥官越过海湾，再也没有回来。对钛族来说，“海湾的另一边”既是自由，也是背叛。",
        "The Damocles Gulf is the front between the T'au and the Imperium, a region where warp travel is unreliable. The Imperium crossed it in the Damocles Crusade; later, Commander Farsight crossed the other way and never returned. To the T'au, 'the far side of the Gulf' means freedom—and betrayal."),
      A(["达摩克利斯湾", "海湾"], ["Damocles Gulf", "the Gulf"]))
  });

})();
