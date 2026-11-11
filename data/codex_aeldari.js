/* data/codex_aeldari.js — codex entries for the Aeldari route (text-aeldari role). SPEC §6 + §13.
 *   text ≤ 45 zh / 30 en · more ≤ 90 zh (required on learn ids) · race/type per SPEC §13.
 *   Shared ids reused from data/codex.js: god_slaanesh, chaos_warp, imp_imperium, imp_emperor …
 *   Necron general entries come from data/codex_necrons.js (nec_necrons) — not duplicated here.
 *   Term choice: mon-keigh = 猿人 (used consistently in story + codex).
 */
(function () {
  function L(zh, en) { return {zh: zh, en: en}; }
  function A(zh, en) { return {zh: zh, en: en}; }
  /* rt = "race/type" */
  function E(rt, cat, sprite, name, text, more, aliases) {
    var r = rt.split("/");
    var e = {cat: cat, faction: "aeldari", race: r[0], type: r[1], sprite: sprite, name: name, text: text};
    if (more) e.more = more;
    if (aliases) e.aliases = aliases;
    return e;
  }
  function P(race, scene, name, text, more, aliases) {
    var e = {cat: "place", faction: "aeldari", race: race, type: "place", scene: scene, name: name, text: text};
    if (more) e.more = more;
    if (aliases) e.aliases = aliases;
    return e;
  }

  WH.registerCodex({
    /* ---------------- the race ---------------- */
    eld_aeldari: E("aeldari/organization", "lore", "aeldari_guardian", L("灵族", "The Aeldari"),
      L("银河最古老的种族之一，寿命以千年计，情感强烈到足以孕育神明。如今人丁稀少，在废墟中苦撑。",
        "One of the galaxy's oldest races: lifespans of millennia, emotions strong enough to birth gods. Now few, holding on amid ruins."),
      L("灵族曾统治群星，灵能与技艺无人能及。他们的放纵孕育了色孽，帝国一夜崩塌。幸存者分成方舟灵族、流亡者、黑暗灵族与丑角，各用各的办法，躲避同一张嘴。",
        "The Aeldari once ruled the stars, unmatched in psychic gifts and craft. Their excess birthed Slaanesh, and their empire fell in a night. Survivors split into craftworlders, Exodites, Drukhari and Harlequins, each hiding from the same mouth in their own way."),
      A(["灵族", "艾达灵族"], ["Aeldari", "Eldar"])),

    eld_monkeigh: E("aeldari/concept", "enemy", "player_aeldari", L("猿人", "Mon-keigh"),
      L("灵族对人类的称呼，取自传说中一种蠢笨的野兽。他们说这个词时，总是彬彬有礼。",
        "The Aeldari word for humans, after a legendary dull-witted beast. They always say it with perfect courtesy."),
      L("在灵族眼里，人类短命、吵闹、繁殖太快，像一场烧遍银河的野火。先知会毫不犹豫地用百万人类换几个族人——在他们的算术里，这不叫残忍，叫比例。人类帝国则视灵族为狡诈的异形。",
        "To the Aeldari, humans are short-lived, loud and breed too fast, a wildfire across the galaxy. Farseers will trade millions of humans for a few of their own without hesitation. In their arithmetic that isn't cruelty; it's proportion. The Imperium, in turn, calls them treacherous xenos."),
      A(["猿人"], ["mon-keigh"])),

    /* ---------------- leaders / ways ---------------- */
    eld_farseer: E("aeldari/unit", "leader", "aeldari_seer", L("先知", "Farseers"),
      L("走到先知之道尽头的灵族。他们用符文窥看未来的枝杈，再轻轻推上一把。",
        "Aeldari who walked the Seer's Path to its end. They read the branches of the future in runes, then give them a gentle push."),
      L("先知是方舟世界真正的领袖。他们看见的不是一个未来，而是成千上万条命运之线，所作的决定往往冷酷得难以理解。看得太久的先知会渐渐化为水晶，最后站进水晶先知穹顶，永远沉默。",
        "Farseers are the true leaders of the craftworlds. They see not one future but thousands of threads, and their choices are often incomprehensibly cold. Those who gaze too long slowly turn to crystal, and at last stand forever silent in the Dome of Crystal Seers."),
      A(["先知", "符文石", "符文"], ["Farseer", "rune-stones", "runes"])),

    eld_eldrad: E("aeldari/figure", "leader", "omen_farseer", L("艾德拉德·乌斯兰", "Eldrad Ulthran"),
      L("乌斯维方舟最伟大的先知，曾试图以一己之力拨动整个银河的命运。",
        "Greatest Farseer of Craftworld Ulthwé, who once tried to steer the fate of the whole galaxy."),
      L("艾德拉德活了上万年，他的预言左右过无数战争，也牺牲过无数人类世界。他几乎化为水晶，又在一场豪赌中醒来。后来他与伊芙蕾恩结盟，加入恩灵派，期盼死神恩灵终结色孽。",
        "Eldrad has lived for some ten thousand years. His prophecies steered countless wars and sacrificed countless human worlds. Nearly turned to crystal, he woke again through a great gamble. He later allied with Yvraine and joined the Ynnari, hoping Ynnead will end Slaanesh."),
      A(["艾德拉德"], ["Eldrad"])),

    eld_yvraine: E("aeldari/figure", "leader", "omen_ynnead", L("伊芙蕾恩", "Yvraine"),
      L("死而复生的恩灵使者，借死神之力，把四散的灵族重新聚在一起。",
        "Emissary of Ynnead, who died and rose again, gathering the scattered Aeldari under the god of the dead."),
      L("她曾是科摩拉角斗场里的斗士，死在那里，又被尚未苏醒的恩灵唤回。她能召集死者的灵魂作战，引来方舟灵族、黑暗灵族乃至丑角追随。传统的先知们对她又敬又疑。",
        "Once a fighter in Commorragh's arenas, she died there and was called back by the not-yet-woken Ynnead. She can rally the souls of the dead to battle, drawing craftworlders, Drukhari and even Harlequins to her. Traditional Farseers regard her with awe and suspicion."),
      A(["伊芙蕾恩"], ["Yvraine"])),

    eld_ynnari: E("aeldari/organization", "lore", "omen_ynnead", L("恩灵派", "The Ynnari"),
      L("追随伊芙蕾恩的灵族，相信死神恩灵终将吞噬色孽。",
        "Aeldari who follow Yvraine, believing the death-god Ynnead will one day devour Slaanesh."),
      L("恩灵派也叫“重生者”，成员来自方舟、黑暗灵族与流亡者。他们以骷髅与新芽为记，把死亡当作武器而非终点。许多先知认为，他们在拿全族的灵魂下注。",
        "Also called the Reborn, the Ynnari come from craftworlds, Commorragh and the Exodites alike. Marked by skull and new shoot, they treat death as a weapon rather than an end. Many Farseers believe they are gambling with the souls of the whole race."),
      A(["恩灵派", "重生者"], ["Ynnari", "the Reborn"])),

    eld_ynnead: E("aeldari/deity", "god", "omen_ynnead", L("恩灵", "Ynnead"),
      L("灵族的死者之神，由亡魂汇聚而成，至今尚未完全苏醒。",
        "The Aeldari god of the dead, formed of departed souls and not yet fully awake."),
      L("传说当最后一个灵族死去，所有亡魂将汇成恩灵，一口吞下色孽。恩灵派不愿等到那一天，想让神提前醒来。灵族古神大多毁于色孽诞生之时，恩灵是他们仅剩的希望之一。",
        "Legend says that when the last Aeldari dies, every departed soul will merge into Ynnead and devour Slaanesh. The Ynnari will not wait; they want the god woken early. Most of the old Aeldari gods perished when Slaanesh was born. Ynnead is one of the few hopes left."),
      A(["恩灵", "死神"], ["Ynnead", "god of the dead"])),

    eld_path: E("aeldari/concept", "leader", "aeldari_guardian", L("道途", "The Path"),
      L("方舟灵族的活法：一生专心只走一条路，走到尽头，再换下一条。",
        "The craftworld way of life: devote yourself to one Path at a time, walk it to its end, then take the next."),
      L("灵族的心灵太强烈，放任就会坠向色孽。道途给每种激情划下边界：战士、歌者、诗人、先知、游侠……在一条路上走得太深而迷失的人，会被永远困在那里，比如相位督军，比如先知自己。",
        "Aeldari minds are too intense; left unchecked, they slide toward Slaanesh. The Path gives each passion a boundary: warrior, singer, poet, seer, ranger... Those who lose themselves on one Path are trapped there forever, like the Exarchs, and like the Farseers themselves."),
      A(["道途", "战士之道", "梦者之道", "放逐之路", "先知之道"], ["the Path", "Path of the Warrior", "Path of the Dreamer", "Path of the Outcast", "Seer's Path"])),

    eld_khaine: E("aeldari/deity", "god", "omen_khaine", L("凯恩", "Khaine"),
      L("灵族战神，“血手之神”。他在诸神之战中破碎，碎片沉睡在每座方舟的铁心里。",
        "The Bloody-Handed God of war. Shattered in the war of the gods, his shards sleep in each craftworld's iron heart."),
      L("色孽诞生时，凯恩是少数没被吞掉的神。他与色孽搏斗，碎成无数片。每座方舟都藏着一片，称为凯恩的化身；大战之前，会有一位“年轻国王”自愿走进铁室唤醒它，从此再不出来。",
        "When Slaanesh was born, Khaine was among the few gods not devoured. He fought and was shattered into countless shards. Each craftworld holds one, the Avatar of Khaine. Before great wars a 'Young King' walks into its iron chamber to wake it, and never walks out."),
      A(["凯恩", "凯恩的化身", "血手之神", "燃烧的巨人"], ["Khaine", "Avatar of Khaine", "Bloody-Handed God", "burning giant"])),

    /* ---------------- enemies / boss ---------------- */
    eld_she_who_thirsts: E("chaos/concept", "enemy", "sigil_slaanesh", L("渴求者", "She Who Thirsts"),
      L("灵族对色孽的称呼。每个灵族死后，灵魂都会被她吸走——除非有灵魂石接住。",
        "The Aeldari name for Slaanesh. Every Aeldari soul is drawn to her at death, unless a spirit stone catches it."),
      L("色孽生于灵族的放纵，所以对灵族的灵魂格外饥渴。对人类，色孽是诱惑；对灵族，她是一张随时张开的嘴。灵魂石、道途、无尽回路，乃至恩灵派的信仰，都是为了躲开这张嘴。",
        "Born of Aeldari excess, Slaanesh thirsts above all for Aeldari souls. To humans she is temptation; to the Aeldari, a mouth always open. Spirit stones, the Path, the Infinity Circuit, even the Ynnari faith: all exist to escape it."),
      A(["渴求者"], ["She Who Thirsts"])),

    eld_keeper_of_secrets: E("chaos/unit", "boss", "greater_daemon_slaanesh", L("守密者", "Keeper of Secrets"),
      L("色孽的大魔：四臂，美得令人心碎。它最爱的猎物是灵族的灵魂。",
        "Slaanesh's Greater Daemon: four-armed, heartbreakingly beautiful. Its favourite prey is the Aeldari soul."),
      L("守密者是色孽最宠爱的仆从，知道每个凡人心底最想要什么，并拿它做饵。它们能从网道的裂缝间钻过，追猎没有灵魂石庇护的亡魂。和它交谈本身就危险：它从不说谎，只是从不说全。",
        "Keepers of Secrets are Slaanesh's favoured servants. They know what every mortal most desires and use it as bait. They slip through cracks in the webway, hunting souls no stone protects. Merely talking to one is dangerous: it never lies, it only never tells all."),
      A(["守密者", "大魔", "色孽大魔"], ["Keeper of Secrets", "Greater Daemon"])),

    eld_the_unsated: E("chaos/figure", "boss", "greater_daemon_slaanesh", L("无餍者", "The Unsated"),
      L("在塞卢纳附近网道中狩猎的守密者，已吞下许多方舟亡魂。",
        "A Keeper of Secrets hunting the webway near Selunar, already gorged on many craftworld souls."),
      L("无餍者从不急于杀戮，它只想被渴望。它为每个猎物准备一个完美的世界，等对方自己走进去。先知塔艾丝拉在上千种未来里都看见了它，于是决定用一个没有灵魂石的猿人作饵。",
        "The Unsated is never in a hurry to kill; it only wants to be wanted. It prepares a perfect world for each prey and waits for them to walk in. Farseer Taethra saw it in a thousand futures, and chose a mon-keigh without a spirit stone as bait."),
      A(["无餍者"], ["the Unsated", "Unsated"])),

    /* ---------------- lore ---------------- */
    eld_the_fall: E("aeldari/concept", "lore", "sigil_slaanesh", L("大陨落", "The Fall"),
      L("灵族帝国的末日：亿万灵族的放纵孕育出色孽，她诞生时的一声尖啸撕碎了整个文明。",
        "The end of the Aeldari empire: the excesses of billions birthed Slaanesh, whose first scream tore their civilisation apart."),
      L("陨落之前，灵族无所不能，于是只剩追逐更强烈的感受。欲望在亚空间里越积越多，终于凝成一位新神。那一刻，大多数灵族的灵魂被吞噬，帝国的心脏塌陷成恐惧之眼。",
        "Before the Fall the Aeldari could do anything, so they chased ever stronger sensations. Desire pooled in the warp until it formed a new god. In that instant most Aeldari souls were devoured, and the heart of their empire collapsed into the Eye of Terror."),
      A(["大陨落", "陨落"], ["the Fall"])),

    eld_drukhari: E("aeldari/organization", "lore", "drukhari_raider", L("黑暗灵族", "Drukhari"),
      L("躲在网道之城科摩拉的灵族，靠吸食他人的痛苦，延缓自己的灵魂被色孽吸走。",
        "Aeldari who hide in Commorragh, a city in the webway. They stave off Slaanesh by feeding on others' suffering."),
      L("陨落之前，他们的祖先已躲进网道深处，侥幸逃过一劫。可色孽仍在一点点吸走他们的灵魂，唯一的补救是汲取别人的痛苦。他们乘快艇出击、掳走奴隶，笑着撤退。方舟灵族视他们为亲戚，也视为警告。",
        "Their ancestors had already hidden deep in the webway before the Fall and escaped it. Yet Slaanesh still drains their souls bit by bit, and the only remedy is others' pain. They strike from skiffs, take slaves, and withdraw laughing. Craftworlders see them as kin, and as a warning."),
      A(["黑暗灵族", "掠夺者"], ["Drukhari", "raiders"])),

    eld_harlequins: E("aeldari/organization", "lore", "aeldari_masked", L("丑角", "Harlequins"),
      L("侍奉欢笑之神的灵族剧团，穿行于网道，以舞蹈讲述历史，也以舞蹈杀戮。",
        "Troupes serving the Laughing God. They roam the webway, telling history through dance, and killing through it too."),
      L("丑角不属于任何方舟，却受所有灵族尊敬，连黑暗灵族也不例外。他们守护网道中的秘密书库，用面具与假面剧保存全族的记忆。最常演的剧目是《陨落》：所有角色都会倒下，只有一个逃走。",
        "Harlequins belong to no craftworld, yet every Aeldari respects them, even the Drukhari. They guard a secret library in the webway and keep the race's memory alive through masques. Their most performed piece is The Fall: every character falls, save one who escapes."),
      A(["丑角", "剧团", "丑角剧团", "舞者"], ["Harlequin", "Harlequins", "troupe"])),

    eld_laughing_god: E("aeldari/deity", "god", "aeldari_masked", L("欢笑之神", "The Laughing God"),
      L("塞格拉克，灵族诸神中少数逃过色孽的神。他躲在网道里，一边逃，一边笑。",
        "Cegorach, one of the few Aeldari gods to escape Slaanesh. He hides in the webway, laughing as he runs."),
      L("塞格拉克是骗子与舞者之神。陨落时，众神或被吞噬，或被撕碎，他却靠机智溜走了。传说他至今在网道深处与色孽玩一场永不结束的游戏。丑角相信，只要笑声还在，渴求者就没有赢。",
        "Cegorach is the god of tricksters and dancers. When the Fall came, the other gods were devoured or torn apart, but he slipped away by wit. Legend says he still plays an endless game with Slaanesh deep in the webway. Harlequins believe that while laughter lasts, She has not won."),
      A(["欢笑之神", "塞格拉克"], ["Laughing God", "Cegorach"])),

    eld_craftworlds: E("aeldari/organization", "lore", "aeldari_bonesinger", L("方舟世界", "Craftworlds"),
      L("陨落时逃离的巨型灵骨方舟，每座都像一颗漂泊的小行星，载着一整个灵族社会。",
        "Vast wraithbone arks that fled the Fall. Each is a drifting world carrying an entire Aeldari society."),
      L("每座方舟都有自己的性情：有的好战，有的神秘，有的几乎只剩亡魂。方舟灵族靠道途约束自己，靠先知决定去向，靠无尽回路里的祖先维持运转。",
        "Each craftworld has its own temper: some warlike, some secretive, some now home mostly to the dead. Craftworlders bind themselves with the Path, follow their Farseers' guidance, and run on the ancestors in the Infinity Circuit."),
      A(["方舟世界", "方舟"], ["craftworld", "Craftworld"])),

    eld_wraithbone: E("aeldari/concept", "lore", "aeldari_bonesinger", L("灵骨", "Wraithbone"),
      L("从亚空间中凝结、由歌声塑形的物质。方舟的每一根骨头，都是唱出来的。",
        "A substance condensed from the warp and shaped by song. Every bone of a craftworld was sung into being."),
      null, A(["灵骨"], ["wraithbone"])),

    eld_bonesinger: E("aeldari/unit", "lore", "aeldari_bonesinger", L("灵骨歌者", "Bonesingers"),
      L("用歌声让灵骨生长、愈合、变形的工匠，既是方舟的建筑师，也是它的医生。",
        "Artisans whose song makes wraithbone grow, heal and change shape: the craftworld's builders and its doctors."),
      null, A(["灵骨歌者"], ["Bonesinger"])),

    eld_spirit_stone: E("aeldari/concept", "lore", "aeldari_guardian", L("灵魂石", "Spirit Stones"),
      L("方舟灵族胸前的宝石。死亡时，灵魂逃进石中，躲开色孽。",
        "A gem every craftworld Aeldari wears. At death the soul flees into it, escaping Slaanesh."),
      L("灵魂石让方舟灵族死后不必坠入渴求者口中。石头会被带回方舟，安放进无尽回路，或嵌进幽魂构造体，让死者再次行走。弄丢灵魂石，是灵族最深的恐惧之一。",
        "Spirit stones spare craftworld Aeldari from falling into Her mouth at death. The stones are carried home and set into the Infinity Circuit, or into wraith constructs so the dead may walk again. Losing one's stone is among the deepest Aeldari fears."),
      A(["灵魂石"], ["spirit stone"])),

    eld_infinity_circuit: E("aeldari/concept", "lore", "wraith_construct", L("无尽回路", "Infinity Circuit"),
      L("流淌在方舟灵骨中的亡魂之网。祖先在墙里低语，也为方舟供能。",
        "A web of departed souls flowing through a craftworld's wraithbone. Ancestors murmur in the walls and power the ship."),
      null, A(["无尽回路", "墙里的声音"], ["Infinity Circuit"])),

    eld_wraith_construct: E("aeldari/unit", "lore", "wraith_construct", L("幽魂构造体", "Wraith Constructs"),
      L("嵌着灵魂石的灵骨巨人，由死去的灵族驾驭。危急之时，死者被请回来作战。",
        "Wraithbone giants set with spirit stones, driven by dead Aeldari. In dire need, the dead are asked to fight again."),
      null, A(["灵骨巨人", "幽魂构造体"], ["wraithbone giant", "wraith construct"])),

    eld_rangers: E("aeldari/unit", "lore", "aeldari_ranger", L("游侠", "Rangers"),
      L("走上放逐之路的灵族，离开方舟去看外面的银河。他们是先知的眼睛，也是最好的狙击手。",
        "Aeldari on the Path of the Outcast, who leave the craftworld to see the galaxy. Farseers' eyes, and peerless marksmen."),
      null, A(["游侠"], ["Ranger", "Rangers"])),

    eld_guardian: E("aeldari/unit", "lore", "aeldari_guardian", L("守护者", "Guardians"),
      L("方舟的民兵。无论走哪条道途，危难时每个灵族都要拿起枪守护家园。",
        "The craftworld militia. Whatever their Path, every Aeldari takes up arms when home is threatened."),
      null, A(["守护者"], ["Guardian", "Guardians"])),

    eld_aspect_warriors: E("aeldari/unit", "lore", "aeldari_guardian", L("相位战士", "Aspect Warriors"),
      L("走战士之道的灵族。戴上战面时，他们把杀意锁进面具里。",
        "Aeldari on the Path of the Warrior. When they don the war-mask, they lock the killing inside it."),
      L("每座相位神殿只修一种战法。迷失在战士之道上的人成为相位督军，再也摘不下战面，盔甲里住着历代前任的灵魂。",
        "Each Aspect Shrine teaches one way of war. Those lost on the Warrior's Path become Exarchs, never again removing the war-mask; their armour holds the souls of every Exarch before them."),
      A(["相位战士", "相位督军", "督军", "战面"], ["Aspect Warriors", "Exarch", "war-mask"])),

    eld_exodites: E("aeldari/organization", "lore", "aeldari_ranger", L("流亡者", "Exodites"),
      L("陨落前便离开帝国、去处女世界过简朴日子的灵族。骑巨兽，种田地，死后归于大地。",
        "Aeldari who left the empire before the Fall for simple lives on maiden worlds. They ride great beasts, farm, and return to the land in death."),
      null, A(["流亡者"], ["Exodite", "Exodites"])),

    /* ---------------- places ---------------- */
    place_valda: P("imperium", "jungle", L("瓦尔达农业星", "Valda (Agri-world)"),
      L("帝国农业星，四千一百万人口，为整个星区供粮。先知选中它作为代价。",
        "An Imperial agri-world of forty-one million, feeding the sub-sector. The Farseer chose it as the price."),
      L("瓦尔达的麦田下埋着一座死灵墓穴，人类在上面种了五百年地，从未察觉。墓穴苏醒那年，星语塔恰好失声，帝国直到很久以后才知道这颗星球没了。",
        "A Necron tomb lay beneath Valda's wheat; humans farmed above it for five centuries without knowing. The year it woke, the astropath tower happened to fall silent, and the Imperium learned of the world's loss only much later."),
      A(["瓦尔达"], ["Valda"])),

    place_valda_tomb: P("necrons", "tomb_exterior", L("麦田下的墓穴", "The Tomb Beneath the Wheat"),
      L("瓦尔达老石阵之下的死灵金字塔。它醒来，收割，然后满足地重新睡去。",
        "The Necron pyramid beneath Valda's old stones. It woke, harvested, and went back to sleep, content."),
      null, A(["老石阵", "石阵", "金字塔"], ["old stones", "pyramid"])),

    place_webway: P("aeldari", "webway", L("网道", "The Webway"),
      L("古圣建造的迷宫隧道，穿行于现实与亚空间之间。灵族靠它往来星海。",
        "A labyrinth built by the Old Ones, threading between reality and the warp. The Aeldari cross the stars through it."),
      L("网道比亚空间航行安全得多，但陨落之后已残破不堪：许多分支被封死，背后是恶魔、迷失者，或什么都没有。在网道里，时间和距离都不可信，迷路的人可能永远走不出去。",
        "The webway is far safer than warp travel, but since the Fall it lies broken: many branches are sealed, with daemons, the lost, or nothing at all behind them. Inside, neither time nor distance can be trusted, and the lost may never find a way out."),
      A(["网道"], ["webway"])),

    place_selunar: P("aeldari", "craftworld", L("塞卢纳方舟世界", "Craftworld Selunar"),
      L("一座日渐空寂的方舟世界，能住下百万人，如今只剩几千。",
        "A dwindling craftworld built for a million, now home to a few thousand."),
      null, A(["塞卢纳"], ["Selunar"])),

    place_crystal_dome: P("aeldari", "craftworld", L("水晶先知穹顶", "Dome of Crystal Seers"),
      L("方舟中心的寂静穹顶，站满化为水晶的先知，他们的灵魂仍在其中凝望。",
        "A silent dome at the craftworld's heart, filled with Farseers turned to crystal, their souls still gazing out."),
      null, A(["水晶穹顶", "水晶先知穹顶"], ["crystal dome", "Dome of Crystal Seers"])),

    place_aspect_shrine: P("aeldari", "craftworld", L("相位神殿", "Aspect Shrine"),
      L("相位战士修行的神殿，每座供奉一种战斗方式，由一位督军看守。",
        "Where Aspect Warriors train, each shrine devoted to one way of war and kept by an Exarch."),
      null, A(["相位神殿"], ["Aspect Shrine"])),

    place_ildaneth: P("aeldari", "maiden_world", L("伊尔达涅斯", "Ildaneth (Maiden World)"),
      L("流亡者居住的处女世界，六千灵族在这里放牧、耕作。瓦尔达为它而亡。",
        "An Exodite maiden world where six thousand Aeldari herd and farm. Valda died for it."),
      L("处女世界是灵族在陨落前改造好、准备将来定居的星球，如今多由流亡者看守。伊尔达涅斯的森林会说话——那是融进大地的祖先。这里的人对瓦尔达一无所知。",
        "Maiden worlds were terraformed by the Aeldari before the Fall for future settlement; Exodites tend most of them now. Ildaneth's forests speak, for the ancestors have merged into the land. No one here knows anything of Valda."),
      A(["伊尔达涅斯", "处女世界"], ["Ildaneth", "maiden world"])),

    place_commorragh: P("aeldari", "webway", L("科摩拉", "Commorragh"),
      L("藏在网道深处的黑暗之城，黑暗灵族的家，从未见过太阳。",
        "The Dark City hidden deep in the webway, home of the Drukhari, never touched by a sun."),
      null, A(["科摩拉", "黑暗之城"], ["Commorragh", "Dark City"]))
  });
})();
