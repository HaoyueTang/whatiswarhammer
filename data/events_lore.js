/* data/events_lore.js — lore events around named campaigns (text-lore role). SPEC §5 + §20.
 * god "other" / "undivided"; small effects; unlock 战史 (chr_*) entries from data/chronicle.js.
 * Speakers and scenes use only SPEC §7 / §14 keys. Original prose; facts per docs/DEVLOG.md sources.
 */
(function () {
  function L(zh, en) { return {zh: zh, en: en}; }
  function S(sprite, zh, en) { return {sprite: sprite, name: {zh: zh, en: en}}; }
  function O(zh, en, effects, rzh, ren, codex) {
    var c = {text: {zh: zh, en: en}, effects: effects, result: {zh: rzh, en: ren}};
    if (codex) c.codex = codex;
    return c;
  }

  WH.registerEvents([
    /* Second / Third War for Armageddon — an Imperial cook with his grandfather's tattoo */
    {id: "evt_lore_armageddon", god: "other", factions: ["imperium"], minChapter: 2,
     where: {nodes: ["imp_208", "imp_400", "imp_501", "imp_611"]},   // troopship mess; never in battle or next to Brin's soup (imp_402/403/707)
     scene: "barracks", speaker: S("guardsman", "纹身的炊事兵", "The Tattooed Cook"), foe: null,
     text: L("炊事兵往你碗里多舀了一勺。他小臂上纹着一座冒烟的巢都，底下一行字：哈迪斯。\n“照我爷爷的纹的。”他说，“想听阿玛吉顿吗？那颗星球上的仗，从我爷爷的爷爷那辈一直打到现在。”",
             "The cook ladles an extra scoop into your bowl. On his forearm: a smoking hive spire, and beneath it one word, Hades.\n“Copied from my grandad's,” he says. “Want to hear about Armageddon? They've been fighting there since my grandad's grandad.”"),
     codex: ["chr_second_armageddon"],
     choices: [
       O("听他讲", "Listen", {sanity: 5},
         "他讲一个独臂老政委，在哈迪斯的废墟里守了好几个月，兽人军阀亲自来挖，也没把他挖出来。你听得忘了吃饭。",
         "He tells of a one-armed old commissar who held the ruins of Hades for months; the ork warlord came to dig him out himself and failed. You forget to eat."),
       O("问第三次战争", "Ask about the third war", {sanity: -5, renown: 3},
         "“还没完呢。”他把勺子插回锅里，“那个大兽人自己走了，去找更大的仗。剩下的兽人还在，我们的人也在。”",
         "“Still not over.” He jams the ladle back in the pot. “The big ork just left to find a bigger fight. His boys are still there. So are ours.”",
         ["chr_third_armageddon"]),
       O("说你不想听打仗的事", "Say you'd rather not hear war stories", {hp: 5},
         "他耸耸肩，又给你添了半勺。“也对。吃饱了，比知道什么都强。”",
         "He shrugs and adds another half-scoop. “Fair enough. A full belly beats knowing things.”")
     ]},

    /* The Fall of Cadia — a refugee who won't talk about the Gate */
    {id: "evt_lore_cadia", god: "other", factions: ["imperium", "chaos"], minChapter: 3,
     where: {scenes: ["ruins", "underhive"]},   // the text sets it in ruins: a lull, not a battle or a warp jump
     scene: "ruins", speaker: S("guard_sergeant", "不肯开口的卡迪亚人", "A Cadian Who Won't Talk"), foe: null,
     text: L("一个眼睛泛紫的老兵蹲在废墟里，擦着一块黑色石片。石片上的划痕在慢慢自己合拢。\n有人说他是卡迪亚人。你一提“那扇门”，他就停下手，盯着你，像在等你把话收回去。",
             "A violet-eyed veteran crouches in the ruins, polishing a shard of black stone. The scratches on it are slowly closing by themselves.\nThey say he's Cadian. When you mention ‘the Gate’, his hands stop. He stares at you as if waiting for you to take it back."),
     codex: ["place_cadia"],
     choices: [
       O("不再追问，坐在他旁边", "Drop it and sit beside him", {sanity: 5},
         "你们一句话也没说。过了很久，他把石片塞进你手里：“它们撑了一万年。我们也是。”",
         "Neither of you speaks. After a long while he presses the shard into your hand. “They held for ten thousand years. So did we.”",
         ["chr_thirteenth_crusade"]),
       O("问他卡迪亚的事", "Ask him about Cadia", {sanity: -5, renown: 5},
         "“十三次。”他终于开口，“他来了十三次。前十二次，我们都守住了。”之后他再没说一个字。",
         "“Thirteen times,” he says at last. “He came thirteen times. The first twelve, we held.” He says nothing more.",
         ["chr_thirteenth_crusade", "chr_first_black_crusade"]),
       O("伸手要那块石片", "Reach for the shard", {hp: -5},
         "他把石片攥进拳头，另一只手已经扣住你的喉咙。“这是卡迪亚，”他说，“你不配。”然后他松开手，走了。",
         "He closes his fist on the shard; his other hand is already at your throat. “This is Cadia,” he says. “Not for you.” Then he lets go and walks away.")
     ]},

    /* The Damocles Gulf Crusade — an old water-caste envoy */
    {id: "evt_lore_damocles", god: "other", factions: ["tau"], minChapter: 2,
     where: {nodes: ["tau_312", "tau_601"]},   // SPEC §32.3: on the Dal'nor quay in a quiet time
     scene: "tau_city", speaker: S("tau_water_caste", "年迈的水族使节", "An Aged Water-Caste Envoy"), foe: null,
     text: L("老水族在码头边喂鱼，听说你是人类，笑了。\n“你们的帝国第一次来，是带着舰队来的。在达尔伊斯，我们的先辈花了好几个月才让他们停下。”他撒下最后一把饵，“后来，是我们先伸出的手。”",
             "An aged water-caste envoy is feeding fish at the quay. Hearing you're human, he smiles.\n“The first time your Imperium came, it came with a fleet. On Dal'yth our forebears needed months to stop it.” He scatters the last of the bait. “Afterwards, we were the ones who offered a hand.”"),
     codex: ["chr_damocles_crusade"],
     choices: [
       O("“那是很久以前了。”", "“That was long ago.”", {renown: 5},
         "“对你们是很久。对我们，是好几代人。”他点点头，“所以我们记得更清楚。”",
         "“Long for you. For us, many generations.” He nods. “So we remember it better.”"),
       O("问他人类为什么撤走", "Ask why the humans withdrew", {sanity: 5},
         "“因为饥饿从银河外来了，你们的舰队得回去喂它。”他看着水面，“敌人的敌人未必是朋友，有时只是时机。”",
         "“Because a hunger came from beyond the galaxy, and your fleets had to go home and feed it.” He watches the water. “An enemy's enemy is not always a friend. Sometimes it is only timing.”",
         ["chr_macragge"]),
       O("陪他看鱼", "Watch the fish with him", {},
         "鱼群抢食，水花一片。他没再说话，走的时候拍了拍你的肩。",
         "The fish churn the water over the bait. He says nothing more, but pats your shoulder as he leaves.")
     ]},

    /* The Fall of the Aeldari — an ancient soul in a wraith construct */
    {id: "evt_lore_fall", god: "other", factions: ["aeldari"], minChapter: 4,
     where: {scenes: ["craftworld"], chapter: {min: 4, max: 7}},
     scene: "craftworld", speaker: S("wraith_construct", "灵骨中的古魂", "An Old Soul in Wraithbone"), foe: null,
     text: L("一具灵骨巨人在走廊尽头停下，朝你低下头。它的声音像从很深的井底传来：\n“猿人。你身上有麦子的味道。陨落那天，我们的田野也是这个味道。然后，群星开始尖叫。”",
             "A wraithbone giant halts at the end of the corridor and bows its head to you. Its voice comes as if from the bottom of a deep well:\n“Mon-keigh. You smell of wheat. Our fields smelled so, the day of the Fall. Then the stars began to scream.”"),
     codex: ["eld_the_fall"],
     choices: [
       O("问它陨落那天", "Ask about the day of the Fall", {sanity: -10, renown: 5},
         "它让你看了一瞬：无尽的宴会，越来越响的笑声，然后无数张嘴同时张开。你跪地干呕。“现在你知道了。”",
         "It shows you for an instant: an endless feast, laughter swelling, then countless mouths opening at once. You retch on your knees. “Now you know,” it says.",
         ["chr_eye_born"]),
       O("低头回礼", "Bow in return", {sanity: 5, taint: {slaanesh: -5}},
         "它沉默片刻，转身离去。你身上的麦香淡了，那股若有若无的甜腻也跟着淡了。",
         "It is silent a moment, then turns away. The smell of wheat fades from you, and with it a faint, cloying sweetness.")
     ]},

    /* The War in Heaven — a cryptek bored by "recent" history */
    {id: "evt_lore_war_in_heaven", god: "other", factions: ["necrons"], minChapter: 3,
     where: {scenes: ["tomb_interior", "stasis_gallery"], chapter: {min: 3, max: 5}},   // SPEC §32.3: crypteks labelling cubes, tomb or gallery
     scene: "tomb_interior", speaker: S("cryptek", "无聊的技师", "A Bored Cryptek"), foe: null,
     text: L("一位技师正在给一排停滞立方贴标签。见你经过，它叫住你：“有机体。你们人类管多久以前叫‘古代史’？”\n你说了个数字。它的眼光闪了两下，像在笑：“可爱。天堂之战都只算近代史。”",
             "A cryptek is labelling a row of stasis cubes. As you pass, it calls out: “Organic. How long ago does your kind call ‘ancient history’?”\nYou name a number. Its eye-lights flicker twice, like laughter. “Adorable. The War in Heaven counts as recent.”"),
     codex: ["nec_war_in_heaven"],
     choices: [
       O("“那天堂之战是怎么回事？”", "“So what was the War in Heaven?”", {sanity: -5, renown: 5},
         "它讲了三小时古圣、星神与背叛，最后说：“我们打碎了自己的神，睡了一觉。你们的历史只是我们的一个梦。”",
         "It talks for three hours: Old Ones, star gods, betrayal upon betrayal. At last: “We shattered our own gods, then took a nap. Your entire history is one of our dreams.”",
         ["nec_great_sleep"]),
       O("问它为什么叫你“有机体”", "Ask why it calls you ‘organic’", {sanity: 5},
         "“因为你们会腐烂。”它想了想，“我们也曾经会。那是我最不怀念的东西。”",
         "“Because you rot.” It considers. “So did we, once. It is the thing I miss least.”"),
       O("帮它贴标签", "Help with the labels", {renown: 5},
         "你贴歪了一张。它没说话，撕下来重新贴好，然后把一张新标签贴在你身上：“近代，人类，状态良好。”",
         "You stick one on crooked. It says nothing, peels it off, re-applies it, then sticks a fresh label on you: “Recent. Human. Good condition.”")
     ]},

    /* The Silent King returns — a necron overlord, rattled */
    {id: "evt_lore_silent_king", god: "other", factions: ["necrons"], minChapter: 3,
     where: {nodes: ["nec_401"]},   // SPEC §32.3: weeks after the King's summons (nec_311), back in the tomb
     scene: "tomb_interior", speaker: S("necron_lord", "焦躁的霸主", "A Restless Overlord"), foe: null,
     text: L("一位霸主在王座前来回踱步，金属脚步声响个不停。\n“王回来了。”他对你说——大概因为你是唯一不会传话的东西，“六千万年不闻不问，现在要我们排队听令。你们人类怎么对付突然回家的祖宗？”",
             "An overlord paces before his throne, metal feet ringing without pause.\n“The King has returned,” he tells you, presumably because you're the only thing here that won't repeat it. “Sixty million years of silence, and now we queue for orders. How do humans deal with an ancestor who suddenly comes home?”"),
     codex: ["chr_silent_king_returns"],
     choices: [
       O("“当面低头，背后另作打算。”", "“Bow to his face, plan behind his back.”", {renown: 5},
         "他停下脚步，眼光闪了闪。“有机体也懂宫廷。”你的建议被记进了某个看不见的档案。",
         "He stops; his eye-lights flicker. “So organics understand courts.” Your advice is filed in some invisible archive."),
       O("“他回来，是因为外面有更可怕的东西。”", "“He came back because something worse is out there.”", {sanity: -5, renown: 3},
         "霸主沉默了很久。“虫群，”他说，“王在星系之间见过它们。所以他回来了。”他不再踱步。",
         "The overlord is silent a long time. “The swarm,” he says. “The King saw it between the galaxies. That is why he came back.” He stops pacing.",
         ["chr_leviathan"]),
       O("一言不发", "Say nothing", {sanity: 3},
         "他把你当成一件会点头的家具，又踱了一个小时。你记住了一句：“寂静之王回来时，从不寂静。”",
         "He treats you as furniture that nods, and paces for another hour. One line sticks: “The Silent King never returns silently.”")
     ]},

    /* The Siege of Terra — a vision, for every route where the warp can still reach you */
    {id: "evt_lore_terra_vision", god: "other", factions: ["imperium", "chaos", "tau", "aeldari"], minChapter: 4,
     where: {notScenes: ["webway"]},
     scene: "throne_light", speaker: S("omen_emperor", "金色的幻象", "A Golden Vision"), foe: null,
     text: L("一瞬间，你站在一座燃烧的宫殿城墙上。炮火把天空烧成红色，城下的叛军多得像海。\n远处一艘巨舰的舰桥里，一道金光正与一道黑影交锋。你知道这是一万年前。你不知道自己为什么看得见。",
             "For an instant you stand on the walls of a burning palace. Gunfire turns the sky red; the traitor host below is an ocean.\nOn the bridge of a vast ship far off, a golden light clashes with a black shadow. You know this was ten thousand years ago. You don't know why you can see it."),
     codex: ["chr_siege_of_terra"],
     choices: [
       O("看到最后", "Watch to the end", {sanity: -10, renown: 5},
         "金光赢了，却熄灭了一半。你醒来时眼睛刺痛，像直视过太阳。",
         "The gold wins, and half of it goes out. You wake with stinging eyes, as if you had stared at the sun.",
         ["chaos_horus_heresy"]),
       O("闭上眼睛", "Close your eyes", {sanity: 5},
         "炮声远去。你只记得城墙的温度，和一个念头：很久以前，有人替你守过一次门。",
         "The guns fade. You remember only the heat of the wall, and one thought: long ago, someone held the gate for you.")
     ]},

    /* The Isstvan betrayals — a Black Legion veteran and his scraped pauldron */
    {id: "evt_lore_isstvan", god: "undivided", factions: ["chaos"], minChapter: 5,
     scene: "ship_interior", speaker: S("heretic_astartes", "擦拭肩甲的老兵", "A Veteran Polishing His Pauldron"), foe: null,
     text: L("一名黑色军团老兵坐在弹药箱上，用油布擦一块旧肩甲。上面的徽记被刮掉了，刮痕底下还看得出原来的颜色。\n“伊斯特万五号，”他头也不抬，“听说过吗？”",
             "A Black Legion veteran sits on an ammunition crate, polishing an old pauldron with an oily rag. Its emblem has been scraped away; the old colour still shows beneath the scratches.\n“Isstvan Five,” he says without looking up. “Heard of it?”"),
     codex: ["chr_isstvan"],
     choices: [
       O("“听说过。你们在那儿背叛了兄弟。”", "“I have. You betrayed your brothers there.”", {hp: -5, renown: 5},
         "他终于抬起头，看了你很久。“是他们先选错了边。”说完又低头去擦，擦得更用力了。",
         "He finally looks up and studies you for a long time. “They chose the wrong side first.” Then he goes back to polishing, harder."),
       O("“讲给我听。”", "“Tell me.”", {sanity: -5, renown: 3, taint: {khorne: 5}},
         "他讲着陆场，讲第二波援军转过来的枪口，讲那天的天色。讲到最后他在笑。你发现自己也在笑。",
         "He tells of the drop site, the second wave's guns turning, the colour of the sky that day. By the end he's laughing. So, you notice, are you.",
         ["chaos_horus_heresy"]),
       O("悄悄走开", "Slip away", {sanity: 5},
         "走出很远，你还能听见油布擦过陶钢的声音，一下，一下，像在擦一样怎么也擦不掉的东西。",
         "Far down the corridor you can still hear the rag on ceramite, stroke after stroke, as if scrubbing at something that will never come off.")
     ]},

    /* The Badab War — a Red Corsair recruiting over an open channel */
    {id: "evt_lore_badab", god: "other", factions: ["imperium", "chaos", "tau"], minChapter: 4,
     where: {notScenes: ["warp", "daemon_world"]},   // a vox channel: not mid-jump, not inside the Eye
     scene: "void", speaker: S("heretic_astartes", "红甲海盗", "A Red-Armoured Corsair"), foe: null,
     text: L("一段通讯突然切进你附近的频道。一个嗓音懒洋洋地说：\n“这里是漩涡风暴来的朋友。我们头儿当年也给帝国交过税——基因、人命，什么都交。后来他不交了。要一起吗？我们不问出身。”",
             "A transmission cuts into a nearby channel. A lazy voice:\n“Friends from the Maelstrom here. Our boss paid the Imperium's tithe once. Gene-seed, lives, everything. Then he stopped paying. Want in? We don't ask where you're from.”"),
     codex: ["chr_badab_war"],
     choices: [
       O("关掉频道", "Switch it off", {renown: 5},
         "静电声里，你最后听见他笑：“巴达布那会儿，他们也是这么说的。”",
         "Through the static you hear him laugh one last time: “That's what they said at Badab, too.”"),
       O("多听几句", "Listen a little longer", {sanity: -5, corruption: 3, taint: {tzeentch: 5}},
         "他讲巴达布暴君，讲星际战士打了十年星际战士。你听得入了神，直到频道里只剩呼吸声——你自己的。",
         "He talks of the Tyrant of Badab, of Space Marines fighting Space Marines for ten years. You listen, rapt, until only breathing is left on the channel. Your own."),
       O("记下频率，报告上级", "Note the frequency and report it", {renown: 3, sanity: 3},
         "你把频率交了上去。几天后，那片星域多了一支巡逻队。没人告诉你结果，也没人谢你。",
         "You hand the frequency up the chain. Days later, a patrol appears in that stretch of space. No one tells you what happened. No one thanks you.")
     ]}
  ]);
})();
