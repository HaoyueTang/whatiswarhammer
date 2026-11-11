/* data/events.js — random warp / chaos-god events (text role). SPEC §5.
 * Fired before a node with eventRoll; once per run. Kept faction-neutral ("*") so the wording fits
 * a guardsman, a cultist and a gue'vesa alike.
 */
(function () {
  function L(zh, en) { return {zh: zh, en: en}; }
  function S(sprite, zh, en) { return {sprite: sprite, name: {zh: zh, en: en}}; }
  function O(zh, en, effects, rzh, ren) { return {text: {zh: zh, en: en}, effects: effects, result: {zh: rzh, en: ren}}; }

  WH.registerEvents([
    /* ---------- Khorne ---------- */
    {id: "evt_khorne_1", god: "khorne", factions: ["*"], minChapter: 2,
     scene: "daemon_world", speaker: S("daemon_khorne", "铜色的声音", "A Brass Voice"), foe: null,
     text: L("你梦见一座斗技场，看台上坐满了没有头的观众。\n一个声音像铁砧：“下一次，先出手。我会让你的手比他们的快。”\n醒来时，你的拳头攥得发白。",
             "You dream of an arena, its stands packed with headless spectators.\nA voice like an anvil: “Next time, strike first. I will make your hands faster than theirs.”\nYou wake with your fists clenched white."),
     codex: ["god_khorne"],
     choices: [
       O("“好。”", "“Yes.”", {hp: 15, corruption: 8, renown: 3, taint: {khorne: 15}},
         "你的伤口在发热，愈合得快得不正常。之后好几天，你走路都想撞上点什么。",
         "Your wounds run hot and heal unnaturally fast. For days afterward you walk around looking for something to collide with."),
       O("松开拳头", "Unclench your fists", {sanity: -5},
         "你一根一根掰开手指。掌心里有四道血印，是你自己的指甲。",
         "You prise your fingers open one by one. Four bloody crescents mark your palm: your own nails.")
     ]},

    {id: "evt_khorne_2", god: "khorne", factions: ["*"], minChapter: 3,
     scene: "barracks", speaker: S("sigil_khorne", "红雾", "Red Haze"), foe: null,
     text: L("一个同伴为了半块口粮推了你一把。很小的事。\n可你的视野边缘突然泛红，耳朵里有个声音在数数：一、二、三……\n它想知道你能不能数到八。",
             "A comrade shoves you over half a ration bar. A small thing.\nBut the edges of your vision suddenly redden, and something in your ear starts counting: one, two, three...\nIt wants to know whether you can count to eight."),
     codex: ["god_khorne"],
     choices: [
       O("还手", "Hit back", {corruption: 5, renown: 3, hp: -5, taint: {khorne: 10}},
         "数到八之前，他已经躺在地上了。周围的人看你的眼神变了。有人怕你，有人敬你。",
         "Before the count reaches eight, he's on the floor. The way people look at you changes. Some fear you. Some respect you."),
       O("把口粮扔给他", "Toss him the ration", {sanity: 5, hp: -5, taint: {khorne: -5}},
         "红雾慢慢退了。你饿了一晚上，但睡得很安稳。",
         "The red haze slowly recedes. You go hungry that night, but sleep soundly."),
       O("跟着数下去", "Keep counting along", {corruption: 10, sanity: -10, taint: {khorne: 15}},
         "你数到了八，然后是九、十……你不记得之后的事。别人告诉你，你一直在笑。",
         "You count to eight, then nine, ten... You don't remember what came after. They tell you that you were smiling the whole time.")
     ]},

    /* ---------- Nurgle ---------- */
    {id: "evt_nurgle_1", god: "nurgle", factions: ["*"], minChapter: 2,
     scene: "barracks", speaker: S("daemon_nurgle", "温和的老人", "A Kindly Old Voice"), foe: null,
     text: L("你发烧了。烧得最厉害的那晚，有个温和的老人坐在你床边，身上有烂苹果的甜味。\n“别跟它斗了，孩子，”他说，“让它留下来。你会发现，生病也没那么糟。”",
             "You fall ill. On the worst night of the fever, a kindly old man sits by your bed, smelling sweetly of rotten apples.\n“Stop fighting it, child,” he says. “Let it stay. You'll find being ill isn't so bad.”"),
     codex: ["god_nurgle"],
     choices: [
       O("让它留下来", "Let it stay", {hp: 10, sanity: 10, corruption: 8, taint: {nurgle: 15}},
         "烧退了，病却没走。你再也不觉得冷，也不觉得疼。脖子后面多了个小疙瘩，摸起来暖暖的。",
         "The fever breaks, but the sickness stays. You never feel cold or pain again. A small, warm lump appears on the back of your neck."),
       O("硬扛过去", "Fight it off", {hp: -10, sanity: -5},
         "你出了三身汗，醒来时虚得站不住。床边没有人，只有几只苍蝇。",
         "You sweat through three nights and wake too weak to stand. No one is by the bed, only a few flies.")
     ]},

    {id: "evt_nurgle_2", god: "nurgle", factions: ["*"], minChapter: 3,
     scene: "ruins", speaker: S("sigil_nurgle", "一朵花", "A Flower"), foe: null,
     text: L("你的靴子裂缝里长出了一朵小花，花瓣绿得发灰，几只苍蝇围着它哼歌。\n哼的是摇篮曲。你小时候听过。",
             "A little flower has sprouted from a crack in your boot. Its petals are a greyish green, and a few flies hum around it.\nThey're humming a lullaby. One you heard as a child."),
     codex: ["god_nurgle"],
     choices: [
       O("摘下来闻一闻", "Pick it and smell it", {sanity: 8, corruption: 5, taint: {nurgle: 10}},
         "很香，香得让你想起家。之后几天，你总觉得口袋里暖暖的。",
         "It smells wonderful, like home. For days afterward your pocket feels pleasantly warm."),
       O("一脚踩烂", "Crush it underfoot", {sanity: -3, renown: 2},
         "苍蝇停止了哼歌，飞走了。你的靴子从此有股甜味，洗不掉。",
         "The flies stop humming and leave. Your boot keeps a sweet smell that never washes out.")
     ]},

    /* ---------- Tzeentch ---------- */
    {id: "evt_tzeentch_1", god: "tzeentch", factions: ["*"], minChapter: 2,
     scene: "warp", speaker: S("daemon_tzeentch", "多出来的一页", "The Extra Page"), foe: null,
     text: L("你在口袋里摸到一张纸条，是你的笔迹，可你不记得写过。\n上面写着：“明天别走左边。”\n纸条背面还有一行小字：“除非你想知道走左边会怎样。”",
             "You find a note in your pocket, in your own handwriting, which you don't remember writing.\nIt says: “Don't go left tomorrow.”\nOn the back, smaller: “Unless you want to know what happens if you do.”"),
     codex: ["god_tzeentch"],
     choices: [
       O("照纸条做", "Do as the note says", {renown: 5, corruption: 5, taint: {tzeentch: 10}},
         "第二天，左边的走廊塌了。你没事。可你开始怀疑，是谁在替你做决定。",
         "Next day the left-hand corridor collapses. You're fine. But you begin to wonder who is making your decisions."),
       O("偏要走左边", "Go left on purpose", {hp: -10, sanity: 5, taint: {tzeentch: 5}},
         "左边什么都没发生。你松了口气，回头时发现右边的走廊塌了。纸条上的字变了：“猜对了。”",
         "Nothing happens on the left. Relieved, you look back—and the right-hand corridor has collapsed. The note now reads: “Good guess.”"),
       O("把纸条烧掉", "Burn the note", {sanity: -5},
         "纸烧完了，灰烬落在地上，排成了一个你看不懂的字。",
         "The note burns away. Its ashes settle into a letter you can't read.")
     ]},

    {id: "evt_tzeentch_2", god: "tzeentch", factions: ["*"], minChapter: 4,
     scene: "warp", speaker: S("sigil_tzeentch", "慢半拍的倒影", "The Lagging Reflection"), foe: null,
     text: L("你在水洼里看见自己的倒影，它比你慢了半拍。\n然后它没有跟着你眨眼，而是张开嘴，无声地说了一句话。\n你读懂了唇语：“我知道你下一步会做错什么。”",
             "In a puddle you see your reflection lagging half a beat behind.\nThen it doesn't blink when you do. It opens its mouth and silently says something.\nYou read its lips: “I know which next step you'll get wrong.”"),
     codex: ["god_tzeentch"],
     choices: [
       O("问它是哪一步", "Ask which step", {renown: 6, corruption: 6, sanity: -5, taint: {tzeentch: 12}},
         "它告诉了你。它说的是对的。你不知道该感激，还是该害怕。",
         "It tells you. It's right. You don't know whether to be grateful or afraid."),
       O("踩碎水洼", "Stamp through the puddle", {sanity: -3},
         "水花溅起，倒影碎了。等水面平静下来，那里有两个你。",
         "Water splashes; the reflection shatters. When the surface settles, there are two of you.")
     ]},

    /* ---------- Slaanesh ---------- */
    {id: "evt_slaanesh_1", god: "slaanesh", factions: ["*"], minChapter: 2,
     scene: "cult_shrine", speaker: S("daemon_slaanesh", "完美的一口", "The Perfect Bite"), foe: null,
     text: L("有人递给你一颗果子，你从没见过，也没问。\n那是你这辈子吃过最好吃的东西。好吃到之后的每一顿饭都像嚼灰。\n递果子的人笑着说：“还有。只要你想要。”",
             "Someone hands you a fruit you've never seen. You don't ask.\nIt's the best thing you've ever tasted. So good that every meal afterward tastes of ash.\nThe one who gave it smiles. “There's more. Whenever you want it.”"),
     codex: ["god_slaanesh"],
     choices: [
       O("“我还要。”", "“More.”", {sanity: 8, corruption: 10, taint: {slaanesh: 15}},
         "第二颗没有第一颗好吃，第三颗更差。可你停不下来，一直在找第一颗的味道。",
         "The second isn't as good as the first, the third worse still. But you can't stop. You keep chasing that first taste."),
       O("把剩下的扔掉", "Throw the rest away", {sanity: -8, renown: 3, taint: {slaanesh: -5}},
         "你连着几天吃不下东西。后来，粗糙的口粮慢慢又有了味道。",
         "For days you can't eat. Slowly, the coarse rations start to taste of something again.")
     ]},

    {id: "evt_slaanesh_2", god: "slaanesh", factions: ["*"], minChapter: 3,
     scene: "throne_light", speaker: S("sigil_slaanesh", "掌声", "Applause"), foe: null,
     text: L("你做好了一件小事，耳边响起了掌声。周围没有人。\n掌声很真诚，很热烈，你从没被人这样夸过。\n一个声音轻轻地说：“再来一次。做得再漂亮一点。”",
             "You do a small thing well, and applause rings in your ears. No one is near.\nIt's sincere and warm. No one has ever praised you like this.\nA voice whispers: “Again. Do it a little more beautifully.”"),
     codex: ["god_slaanesh"],
     choices: [
       O("再做一次给它看", "Do it again for it", {renown: 6, corruption: 6, sanity: 3, taint: {slaanesh: 12}},
         "掌声更响了。从那以后，你做什么都想做到完美，做不到就睡不着。",
         "The applause swells. From then on you need everything perfect, and cannot sleep when it isn't."),
       O("假装没听见", "Pretend you didn't hear", {sanity: -5},
         "掌声停了。接下来的寂静，比任何时候都冷。",
         "The applause stops. The silence after is colder than any you've known.")
     ]},

    /* ---------- Undivided ---------- */
    {id: "evt_undivided_1", god: "undivided", factions: ["*"], minChapter: 2,
     scene: "barracks", speaker: S("sigil_undivided", "八芒星", "Eight-Pointed Star"), foe: null,
     text: L("你的铺位底下被人刻了一颗八芒星。刻痕很新，木屑还是软的。\n你不知道是谁刻的。你只知道，看着它的时候，伤口不那么疼了。",
             "Someone has carved an eight-pointed star beneath your bunk. The cuts are fresh; the shavings still soft.\nYou don't know who did it. You only know that while you look at it, your wounds hurt less."),
     codex: ["chaos_gods"],
     choices: [
       O("用指尖描一遍", "Trace it with a fingertip", {hp: 10, corruption: 10, taint: {all: 5}},
         "星星在你指尖下微微发烫。那一晚，四个声音在你梦里客客气气地互相谦让。",
         "The star warms beneath your finger. That night, four voices in your dream politely defer to one another."),
       O("用刀刮掉", "Scrape it away with a knife", {sanity: -5, renown: 3},
         "你刮了一整夜。第二天早上，它出现在了你的枕头底下。",
         "You scrape all night. Next morning, it's under your pillow."),
       O("上报", "Report it", {renown: 5, sanity: -3},
         "上面派人烧了你的铺位，顺便盘问了你三个小时。",
         "Someone is sent to burn your bunk, and to question you for three hours while they're at it.")
     ]},

    {id: "evt_undivided_2", god: "undivided", factions: ["*"], minChapter: 4,
     scene: "warp", speaker: S("sigil_undivided", "敲门声", "The Knocking"), foe: null,
     text: L("夜里，有东西在敲你身边的墙。三下，停一停，再三下。\n很有礼貌。\n墙那边是实心的岩石。",
             "At night something knocks on the wall beside you. Three times, a pause, three more.\nVery polite.\nOn the other side of the wall is solid rock."),
     codex: ["chaos_warp"],
     choices: [
       O("敲回去", "Knock back", {corruption: 12, renown: 5, sanity: -5, taint: {all: 6}},
         "敲门声停了。然后，墙那边有个声音说：“谢谢。我们会再来的。”",
         "The knocking stops. Then a voice from inside the rock says: “Thank you. We'll be back.”"),
       O("捂住耳朵念祷词", "Cover your ears and recite a prayer", {sanity: -8},
         "敲了一整夜。天亮时停了。墙上多了一个小小的、圆圆的凹痕，正好是指节的形状。",
         "It knocks all night, stopping at dawn. In the wall is a small round dent, exactly the shape of a knuckle.")
     ]},

    /* ---------- Other ---------- */
    {id: "evt_other_1", god: "other", factions: ["*"], minChapter: 3,
     scene: "throne_light", speaker: S("omen_emperor", "遥远的金光", "Distant Gold"), foe: null,
     text: L("某个瞬间，所有的噪音都停了。你感到一道很远很远的光，从银河的另一头照过来，冷，但是稳。\n它没有看你。它只是在那里。一万年了，一直在那里。",
             "For one moment, all the noise stops. You sense a light from very, very far away, shining across the galaxy—cold, but steady.\nIt isn't looking at you. It's simply there. Ten thousand years, always there."),
     codex: ["imp_emperor"],
     choices: [
       O("对着光祷告", "Pray toward the light", {sanity: 10, corruption: -8, taint: {all: -10}},
         "什么奇迹都没发生。可那一晚，你睡了几个月来最安稳的一觉。",
         "No miracle happens. But that night you sleep more soundly than you have in months."),
       O("背过身去", "Turn your back on it", {corruption: 3, renown: 2},
         "光没有追过来。它从来不追任何人。",
         "The light doesn't follow you. It never follows anyone.")
     ]},

    {id: "evt_other_2", god: "other", factions: ["*"], minChapter: 4,
     scene: "spore_sky", speaker: S("omen_hivemind", "巨大的寂静", "A Vast Silence"), foe: null,
     text: L("亚空间突然安静了。所有的低语、所有的敲门声，全都消失了。\n这本该是好事。\n可你感觉到有什么东西把它们全吃掉了，现在正慢慢转过来，朝向你。",
             "The warp falls suddenly silent. Every whisper, every knock—gone.\nThat should be a relief.\nBut you sense that something has eaten them all, and is now slowly turning toward you."),
     codex: ["xenos_shadow_in_warp"],
     choices: [
       O("屏住呼吸，一动不动", "Hold your breath, stay still", {sanity: -5},
         "很久之后，那股注视移开了。它还没饿到注意你。还没有。",
         "After a long while, the attention moves on. It isn't hungry enough to notice you. Not yet."),
       O("大声唱歌", "Sing out loud", {sanity: -10, renown: 5},
         "你的声音在寂静里显得很小，但你唱完了整首歌。身边的人跟着唱了起来。",
         "Your voice sounds tiny in that silence, but you finish the whole song. The people around you start singing too.")
     ]}
  ]);
})();
