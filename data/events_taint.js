/* data/events_taint.js — hidden Chaos-god taint events (text role · text-taint). SPEC §5, §18.
 * Route-flavoured temptations + cleansings, 4 claim events (fire when a god's hidden taint hits 100),
 * and a few shared ("*") taint events. Taint is never shown: the prose only hints at it.
 * Polluting choices always pay something (hp, sanity, renown, knowledge); cleansing ones cost a little.
 * Cleansing events carry cleanse:true and god "other" (they are weighted by total taint, SPEC §18).
 */
(function () {
  function L(zh, en) { return {zh: zh, en: en}; }
  function S(sprite, zh, en) { return sprite ? {sprite: sprite, name: {zh: zh, en: en}} : {name: {zh: zh, en: en}}; }
  function O(zh, en, effects, rzh, ren) { return {text: {zh: zh, en: en}, effects: effects, result: {zh: rzh, en: ren}}; }
  /* SPEC §19 claim choices. CLAIM_GOTO[god][route] = where accepting a claim leads (the route's claim ending;
   * Chaos goes to a short pre-ending node first). A = accept, B = resist (first claim only), F = forced (second claim). */
  var CLAIM_GOTO = {};
  ["khorne", "nurgle", "tzeentch", "slaanesh"].forEach(function (g) {
    CLAIM_GOTO[g] = {imperium: "imp_end_claim_" + g, chaos: "cha_claim_" + g, tau: "tau_end_claim_" + g,
                     aeldari: "eld_end_claim_" + g, necrons: "nec_end_claim_" + g};
  });
  function A(c, g) { c.require = {notFlag: "resisted_" + g}; c.hideIfLocked = true; c.goto = CLAIM_GOTO[g]; return c; }
  function B(c, g) { c.require = {notFlag: "resisted_" + g}; c.hideIfLocked = true; return c; }
  function F(c, g) { c.require = {flag: "resisted_" + g}; c.hideIfLocked = true; c.goto = CLAIM_GOTO[g]; return c; }

  WH.registerEvents([
    /* ================= Imperium ================= */
    {id: "evt_t_imp_tzeentch", god: "tzeentch", factions: ["imperium"], minChapter: 2,
     scene: "ship_interior", speaker: S("guardsman", "输光的老兵", "A Veteran Down on His Luck"), foe: null,
     text: L("运兵舰在亚空间里颠簸。一个老兵输光了口粮，把一副帝皇塔罗牌塞进你手里：“拿走。它们老是说对，我受不了了。”\n你翻开第一张。牌面上画的，是你明天才会见到的人。",
             "The troopship shudders through the warp. A veteran who has gambled away his rations presses an Emperor's Tarot deck into your hands. “Take it. They keep being right. I can't stand it.”\nYou turn the first card. It shows someone you won't meet until tomorrow."),
     codex: ["god_tzeentch"],
     choices: [
       O("再翻一张", "Turn another", {renown: 5, sanity: -3, taint: {tzeentch: 30}},
         "第二张画的是你的手，握着一样你还没见过的东西。牌面的颜色每看一次都不太一样。",
         "The second card shows your hand, holding something you haven't seen yet. The colours are a little different every time you look."),
       O("把牌扔进焚化口", "Throw the deck into the incinerator", {sanity: -3},
         "牌在火里卷了起来，没有一张烧黑，全都变成了蓝色。",
         "The cards curl in the flames. Not one turns black. Every one of them turns blue."),
       O("交给随军牧师", "Hand it to the regimental priest", {renown: 2, taint: {tzeentch: -5}},
         "牧师用圣布把牌包好，什么也没问。那天夜里，你的梦很普通。",
         "The priest wraps the deck in a sanctified cloth and asks nothing. That night your dreams are ordinary.")
     ]},

    {id: "evt_t_imp_khorne", god: "khorne", factions: ["imperium"], minChapter: 3,
     scene: "trench", speaker: S("sigil_khorne", "远处的鼓", "A Distant Drum"), foe: null,
     text: L("兽人的冲锋退了一阵。你低头数刺刀上的缺口：十一个。可你只记得砍过三次。\n远处有面鼓在敲，和你的心跳一个节拍。中士在喊你回掩体。",
             "The ork charge falls back for a moment. You count the nicks on your bayonet: eleven. You only remember striking three times.\nSomewhere a drum is beating in time with your heart. The sergeant is shouting for you to get back in cover."),
     codex: ["god_khorne"],
     choices: [
       O("翻出战壕，追上去", "Climb out and give chase", {renown: 6, hp: -6, taint: {khorne: 30}},
         "你回来时浑身是泥，刺刀上又多了几道缺口。中士没骂你，只是再也不让你站在他旁边。",
         "You come back caked in mud, with more nicks in the blade. The sergeant doesn't shout. He just never stands next to you again."),
       O("回掩体，按口令射击", "Back to cover. Fire on command", {sanity: -3},
         "鼓声渐渐跟不上你的心跳了。缺口还是十一个，你决定再也不数了。",
         "Slowly the drum loses step with your heart. Still eleven nicks. You decide never to count them again.")
     ]},

    {id: "evt_t_imp_cleanse", god: "other", cleanse: true, factions: ["imperium"], minChapter: 3,
     scene: "barracks", speaker: S("preacher", "随军牧师", "Regimental Priest"), foe: null,
     text: L("随军牧师在弹药箱上点了一支蜡烛，听人忏悔。队伍排得很长。\n轮到你时，他没有抬头：“说吧，孩子。帝皇都听得见，我只是替他记着。”",
             "The regimental priest has lit a candle on an ammo crate and is hearing confessions. The queue is long.\nWhen your turn comes he doesn't look up. “Speak, child. The Emperor hears it all. I only keep the ledger for Him.”"),
     codex: ["imp_ecclesiarchy"],
     choices: [
       O("把这些日子的怪事都说出来", "Tell him every strange thing lately", {sanity: 8, renown: -2, taint: {all: -20}},
         "你说得磕磕巴巴。他听完，用圣油在你额头上按了一下。那一夜，梦里没有任何声音。",
         "You stumble through it. When you finish, he presses holy oil to your brow. That night, no voices come to your dreams."),
       O("只说几件无关紧要的小罪", "Confess a few harmless little sins", {sanity: 3, taint: {all: -5}},
         "他照例为你祝福。蜡烛的火苗朝你这边歪了一下，又直了。",
         "He blesses you as usual. The candle flame leans toward you for a moment, then straightens."),
       O("队伍太长，回去睡觉", "The queue's too long. Go to sleep", {sanity: -2},
         "你回到铺位上。不知为什么，今晚的营房格外吵，吵得像有人在你耳边说话。",
         "You go back to your bunk. For some reason the barracks are loud tonight, loud like someone talking in your ear.")
     ]},

    {id: "evt_t_imp_nurgle", god: "nurgle", factions: ["imperium"], minChapter: 4,
     scene: "ruins", speaker: S("guardsman", "笑眯眯的伤员", "A Cheerful Patient"), foe: null,
     text: L("雨下了九天。野战医院的药早就用完了，只有角落那张床上的伤员一天比一天精神，脸色红润，身上有股烂苹果的甜味。\n他朝你招手：“兄弟，你的伤口该换药了。我这儿有。”",
             "It has rained for nine days. The field hospital ran out of medicine long ago, yet the patient in the corner bed grows rosier every day, smelling sweetly of rotten apples.\nHe waves you over. “Brother, that wound needs a fresh dressing. I've got some.”"),
     codex: ["god_nurgle"],
     choices: [
       O("接过他的药膏", "Take his salve", {hp: 15, taint: {nurgle: 30}},
         "药膏是温的，伤口当晚就不疼了。第二天那张床空了，床单上落着几只不肯飞走的苍蝇。",
         "The salve is warm, and the wound stops hurting that night. Next day the bed is empty. A few flies sit on the sheet and will not leave."),
       O("去找医师", "Go and find the medicae", {hp: -5, sanity: 2},
         "医师用最后一点酒精给你清洗伤口，疼得你咬破了嘴唇。他回头看了那张床一眼，脸色变了。",
         "The medicae cleans the wound with the last of the alcohol; you bite your lip through. He glances at the corner bed, and his face changes.")
     ]},

    {id: "evt_t_imp_slaanesh", god: "slaanesh", factions: ["imperium"], minChapter: 6,
     scene: "ship_interior", speaker: S("guard_sergeant", "军需官", "The Quartermaster"), foe: null,
     text: L("远征舰队要选一名新兵在授旗仪式上举旗。你被选中了。\n军需官递给你一面小镜子和一盒香膏：“要完美。全舰队都在看。”\n镜子里的你，比记忆中好看。",
             "The crusade fleet needs a recruit to bear the standard at the colours ceremony. You've been chosen.\nThe quartermaster hands you a small mirror and a tin of scented balm. “Perfect, mind. The whole fleet is watching.”\nIn the mirror you look better than you remember."),
     codex: ["imp_indomitus"],
     choices: [
       O("对着镜子练一整夜", "Practise before the mirror all night", {renown: 8, sanity: 3, taint: {slaanesh: 30}},
         "仪式上你一步都没错。从那以后，你会在每一块反光的舱壁前停下，看一眼，再看一眼。",
         "At the ceremony you don't miss a step. Ever after, you stop at every polished bulkhead to look, and look again."),
       O("抹掉香膏，照常出列", "Wipe off the balm and fall in as usual", {renown: 3},
         "你举旗的手有点抖，一个军官皱了皱眉。可那面镜子，你再也没想起过。",
         "The standard trembles a little in your hands, and an officer frowns. But you never think of that mirror again.")
     ]},

    /* ================= Chaos ================= */
    {id: "evt_t_cha_cleanse", god: "other", cleanse: true, factions: ["chaos"], minChapter: 2,
     scene: "underhive", speaker: S("cultist", "缺牙的老太太", "A Gap-Toothed Old Woman"), foe: null,
     text: L("漏雨的棚子底下，一个缺牙的老太太在分一罐糊糊。你不认识她，可她盛给你的那一勺最满。\n“我听见你说梦话，”她说，“声音不像你。吃吧，吃饱了就像了。”",
             "Under the leaking lean-to, a gap-toothed old woman is sharing out a tin of mash. You don't know her, but the spoonful she gives you is the fullest.\n“I heard you talking in your sleep,” she says. “Didn't sound like you. Eat. Full belly, you'll sound like you again.”"),
     codex: [],
     choices: [
       O("坐下来跟她一起吃", "Sit down and eat with her", {hp: 5, sanity: 6, taint: {all: -15}},
         "糊糊没什么味道，但热乎乎的。她讲起年轻时的污池，你们笑了好几回。那一夜，你睡得像个普通人。",
         "The mash tastes of nothing, but it's hot. She talks about the Sump when she was young, and you both laugh more than once. That night you sleep like an ordinary person."),
       O("把你那份也让给他", "Give him your share too", {hp: -3, sanity: 5, taint: {all: -12}},
         "她不肯要，两人推来推去，最后一人一半。那些总在你耳边说话的声音，今晚都没来。",
         "She won't take it. You push it back and forth and end up splitting it. The voices that keep talking in your ear don't come tonight.")
     ]},

    {id: "evt_t_cha_khorne", god: "khorne", factions: ["chaos"], minChapter: 3,
     scene: "burning_city", speaker: S("cultist", "黄铜项圈的信徒", "Brass-Collared Zealot"), foe: null,
     text: L("起义第二夜。一个陌生的信徒塞给你一把黄铜柄的斧子，柄上缠的布已经发硬。\n“它记得每一只握过它的手，”他说，“它会教你。”\n斧子比看上去轻，轻得像在催你。",
             "The second night of the uprising. A zealot you don't know thrusts a brass-hafted axe at you, its grip-wrap stiff with age.\n“It remembers every hand that's held it,” he says. “It will teach you.”\nThe axe is lighter than it looks. Light enough to feel impatient."),
     codex: ["god_khorne"],
     choices: [
       O("握紧斧子，冲在最前面", "Grip the axe and charge at the front", {renown: 8, hp: -6, taint: {khorne: 30}},
         "那一夜你不记得自己喊了些什么。天亮时，大家都换了个名字叫你。",
         "You don't remember what you shouted that night. By dawn, everyone is calling you by a different name."),
       O("把斧子插进墙缝里", "Wedge the axe into a crack in the wall", {sanity: -3},
         "你走出很远，还能听见它在墙里轻轻震动，像有人一下一下敲着你的名字。",
         "Long after you've walked away you can hear it humming in the wall, like someone tapping out your name.")
     ]},

    {id: "evt_t_cha_tzeentch", god: "tzeentch", factions: ["chaos"], minChapter: 4,
     scene: "cult_shrine", speaker: S("sigil_tzeentch", "没有书名的书", "The Untitled Book"), foe: null,
     text: L("教团藏书室里有本没写书名的书。你翻开，第一页写着你今天早上做过的事，一字不差。\n最后一页还空着。墨迹正一点一点渗出来。",
             "In the cult's book-room sits a volume with no title. You open it. The first page describes what you did this morning, word for word.\nThe last page is still blank. Ink is seeping into it, little by little."),
     codex: ["god_tzeentch"],
     choices: [
       O("等它写完最后一页", "Wait for the last page to finish", {renown: 6, sanity: -4, taint: {tzeentch: 30}},
         "字出来了，是你下周会说的一句话。等你真说出口，你分不清是自己想说，还是在照着念。",
         "The words appear: something you'll say next week. When you finally say it, you can't tell if you meant it or were reading aloud."),
       O("撕掉最后一页", "Tear out the last page", {hp: -3, taint: {tzeentch: 8}},
         "纸边划破了你的手指。第二天书又是完整的，多出来的一页上写着：“谢谢你帮我翻页。”",
         "The paper slices your finger. Next day the book is whole again, with one extra page: “Thank you for turning that for me.”"),
       O("合上书，放回原处", "Close it and put it back", {sanity: -2},
         "你把书塞回最高一层。之后好几天，你总觉得背后有人在小声念你的名字。",
         "You push it onto the top shelf. For days after, you feel someone behind you softly reading out your name.")
     ]},

    {id: "evt_t_cha_slaanesh", god: "slaanesh", factions: ["chaos"], minChapter: 5,
     scene: "ship_interior", speaker: S("cultist", "底舱的歌者", "The Singer Below Decks"), foe: null,
     text: L("黑色战舰的底舱里，有人在唱诗班的老调子，唱得比诗班里任何人都好一万倍。\n你跟着哼了一句。那人停下来看你：“你也能唱成这样。只要你一直练，不吃，不睡。”",
             "Below decks on the black warship, someone is singing an old Choir hymn, ten thousand times better than anyone in the Choir ever did.\nYou hum along. The singer stops and looks at you. “You could sing like this too. Just keep practising. Don't eat. Don't sleep.”"),
     codex: ["god_slaanesh"],
     choices: [
       O("跟着他一直练下去", "Practise with him, on and on", {renown: 6, sanity: 5, hp: -6, taint: {slaanesh: 30}},
         "第三天，你唱出了那个音，完美的音。从那以后，别的声音都像噪音，包括你自己说话。",
         "On the third day you hit the note. The perfect note. Ever since, every other sound is noise, your own speaking voice included."),
       O("捂住耳朵走开", "Cover your ears and walk away", {sanity: -4},
         "那个调子跟了你一整天。临睡前你发现自己还在哼，赶紧咬住了嘴唇。",
         "The tune follows you all day. At bedtime you catch yourself still humming it, and bite your lip shut.")
     ]},

    {id: "evt_t_cha_nurgle", god: "nurgle", factions: ["chaos"], minChapter: 6,
     scene: "daemon_world", speaker: S("daemon_nurgle", "种瓜的老人", "The Melon Grower"), foe: null,
     text: L("恶魔世界上有一片瓜田，瓜藤爬满了生锈的铠甲。种瓜的胖老人递给你一块瓜，瓤是灰绿色的。\n“你太累了，”他说，“在这儿歇歇吧。没人会催你。永远没有。”",
             "On the daemon world there is a melon patch, its vines climbing over rusted armour. The fat old grower hands you a slice. The flesh is grey-green.\n“You're so tired,” he says. “Rest here a while. No one will hurry you. Not ever.”"),
     codex: ["god_nurgle"],
     choices: [
       O("坐下，吃那块瓜", "Sit down and eat the melon", {hp: 12, sanity: 8, taint: {nurgle: 30}},
         "瓜甜得发腻。你醒来时已经过了很久，衣服上开满了细小的白花。你一点也不着急。",
         "It's cloyingly sweet. When you wake, a long time has passed and tiny white flowers bloom all over your clothes. You're in no hurry at all."),
       O("谢过他，继续赶路", "Thank him and keep walking", {hp: -4, sanity: -3},
         "他笑着挥手，一点也不生气：“你会回来的。大家最后都会回来的。”",
         "He waves you off with a smile, not offended in the least. “You'll be back. Everyone comes back in the end.”")
     ]},

    /* ================= T'au ================= */
    {id: "evt_t_tau_tzeentch", god: "tzeentch", factions: ["tau"], minChapter: 2,
     scene: "tau_city", speaker: S("sigil_tzeentch", "挪动的字", "Shifting Letters"), foe: null,
     text: L("水族使节发给你一本人类语版的《大义》入门手册。\n读到第三页，字开始挪动位置，拼成一句新话：“改变，才是唯一的大义。”\n再看时，又变回去了。",
             "A water caste envoy gives you a Greater Good primer, printed in human script.\nOn page three the letters start to shift, spelling a new sentence: “Change is the only Greater Good.”\nYou look again. It has changed back."),
     codex: ["tau_greater_good"],
     choices: [
       O("再读一遍那一页", "Read that page again", {renown: 5, sanity: -3, taint: {tzeentch: 30}},
         "字又动了，这次告诉你明天巡逻会遇上什么。它说对了。从此你每晚都要读一遍。",
         "The letters move again, telling you what tomorrow's patrol will meet. They're right. From then on you read it every night."),
       O("拿着手册去问使节", "Take the primer to the envoy", {renown: 2, taint: {tzeentch: -5}},
         "使节又惊又喜：“你想听我讲解？”他讲了两个小时。那些字一个都没再动过。",
         "The envoy is surprised and delighted. “You want it explained?” He talks for two hours. Not one letter moves again.")
     ]},

    {id: "evt_t_tau_khorne", god: "khorne", factions: ["tau"], minChapter: 3,
     scene: "jungle", speaker: S("kroot", "克鲁特鼓手", "Kroot Drummer"), foe: null,
     text: L("打退兽人之后，克鲁特们围着篝火敲战鼓。领头的鼓手把一根骨头鼓槌递给你：“人类，你打得像克鲁特。来，敲。”\n鼓声一起，你的手就停不下来了。",
             "After the orks are driven off, the kroot gather round the fire to beat their war drums. The lead drummer hands you a bone drumstick. “Human. You fight like kroot. Come. Beat.”\nOnce the drumming starts, your hands won't stop."),
     codex: ["tau_kroot"],
     choices: [
       O("敲到天亮", "Drum until dawn", {renown: 5, hp: 8, taint: {khorne: 30}},
         "掌心敲出了水泡，却一点也不疼。第二天出击，你第一个冲了出去。火族战友看你的眼神有点担心。",
         "Your palms blister, yet nothing hurts. On the next sortie you're first out. Your fire caste comrades watch you with something like worry."),
       O("敲三下就还给他", "Three beats, then hand it back", {sanity: 3},
         "鼓手咕噜了一声，大概是在笑。鼓声在你身后响了一夜，你没有回头。",
         "The drummer makes a clicking sound that might be laughter. The drums beat behind you all night. You don't look back.")
     ]},

    {id: "evt_t_tau_cleanse", god: "other", cleanse: true, factions: ["tau"], minChapter: 4,
     scene: "tau_outpost", speaker: S("tau_ethereal", "以太族长者", "An Ethereal Elder"), foe: null,
     text: L("一位以太族长者在晨光里静坐，身边的火族战士一动不动。\n他示意你坐下：“你的呼吸太乱了，像是有别人在替你喘气。跟着我。为了大义，一呼，一吸。”",
             "An Ethereal elder sits still in the dawn light, his fire warriors motionless around him.\nHe motions you to sit. “Your breathing is ragged, as if someone else breathes for you. Follow me. For the Greater Good: in, and out.”"),
     codex: ["tau_ethereal"],
     choices: [
       O("跟着他一起冥想", "Meditate with him", {sanity: 8, renown: 3, taint: {all: -20}},
         "不知过了多久，你只听得见自己的心跳。一下，又一下，全都是你自己的。",
         "After a time you can't measure, you hear only your own heartbeat. One beat, then another, all of them yours."),
       O("坐一会儿就走", "Sit a moment, then leave", {sanity: 3, taint: {all: -5}},
         "你坐得腿都麻了。站起来时，脑子里的杂音少了一点点。",
         "Your legs go numb. When you stand, the noise in your head is a little quieter.")
     ]},

    {id: "evt_t_tau_slaanesh", god: "slaanesh", factions: ["tau"], minChapter: 5,
     scene: "tau_outpost", speaker: S("tau_drone", "计分屏", "Score Display"), foe: null,
     text: L("土族的射击模拟舱给每一枪打分。你拿了九十九分，全营最高。\n深夜你又溜进去，想打一次满分。舱里的灯是淡紫色的，以前不是。\n屏幕上写着：“再来一次。你差一点就完美了。”",
             "The earth caste's firing simulator scores every shot. You scored ninety-nine, best in the cadre.\nLate at night you sneak back in for a perfect hundred. The cabin lights are pale violet. They never used to be.\nThe screen reads: “Again. You were so nearly perfect.”"),
     codex: ["god_slaanesh"],
     choices: [
       O("再来一次", "Again", {renown: 8, sanity: -4, hp: -4, taint: {slaanesh: 30}},
         "你打到天亮，终于拿了满分。那一刻的快感只持续了一秒，然后你又想要下一次。",
         "You shoot until dawn and finally score a hundred. The thrill lasts one second. Then you want the next one."),
       O("拔掉电源", "Pull the power cable", {sanity: -2},
         "灯灭了。黑暗里计分屏又亮了一会儿，显示着一个不可能的分数：一百零一。",
         "The lights die. In the dark the screen glows a moment longer, showing an impossible score: one hundred and one.")
     ]},

    {id: "evt_t_tau_nurgle", god: "nurgle", factions: ["tau"], minChapter: 6,
     scene: "hive_hab", speaker: S("gue_vesa", "汤铺老板娘", "The Soup-Shop Keeper"), foe: null,
     text: L("人类街区闹起了咳嗽病，医疗无人机封了三条巷子。\n只有巷尾的汤铺照常开着。喝过汤的人都不咳了，只是脸红得发亮，总在笑。\n老板娘给你舀了一碗：“趁热。”",
             "A coughing sickness spreads through the human quarter; medical drones seal off three alleys.\nOnly the soup shop at the end of the lane stays open. Those who drink there stop coughing. They just glow pink, and smile all the time.\nThe keeper ladles you a bowl. “While it's hot.”"),
     codex: ["god_nurgle"],
     choices: [
       O("喝下去", "Drink it", {hp: 12, sanity: 4, taint: {nurgle: 30}},
         "汤一直暖到骨头里。那天起你再没咳过，只是身边总有一只苍蝇，怎么赶也赶不走。",
         "The warmth reaches your bones. You never cough again. There's just always one fly near you, and it won't be shooed away."),
       O("去检疫站排队", "Queue at the drone quarantine post", {hp: -6, renown: 3},
         "针头冰凉，你排了四个小时。无人机在你手背上贴了个绿色标签：“健康。为了大义。”",
         "The needle is cold and the queue takes four hours. A drone sticks a green tag on your hand: “Healthy. For the Greater Good.”")
     ]},

    /* ================= Aeldari ================= */
    {id: "evt_t_eld_tzeentch", god: "tzeentch", factions: ["aeldari"], minChapter: 2,
     scene: "webway", speaker: S("sigil_tzeentch", "掉落的符文石", "A Dropped Rune"), foe: null,
     text: L("穿过网道时，你捡到一块掉在地上的符文石。它在手心发热，表面浮出一条条细线，是你的命运线，比灵族说的还多几条。\n石头低语：“先知只给你看一条。我给你看全部。”",
             "Crossing the webway, you pick up a fallen rune-stone. It warms in your palm and fine threads surface on it: your fate-lines, more than the Aeldari ever told you.\nThe stone whispers: “The seers show you one. I'll show you them all.”"),
     codex: ["place_webway"],
     choices: [
       O("凝视那些命运线", "Gaze into the fate-lines", {renown: 6, sanity: -6, taint: {tzeentch: 30}},
         "你看见了明天、明年，十个不同的你。有几条线在你看的时候拐了弯，像在躲你。",
         "You see tomorrow, next year, ten different yous. A few threads bend as you watch, as if avoiding you."),
       O("把它交给先知", "Give it to the farseer", {renown: 3, taint: {tzeentch: -5}},
         "先知看了很久，把它扔进了网道的一道裂缝：“这不是我们的石头。”",
         "The farseer studies it a long while, then drops it into a crack in the webway. “That is not one of ours.”")
     ]},

    {id: "evt_t_eld_slaanesh", god: "slaanesh", factions: ["aeldari"], minChapter: 3,
     scene: "craftworld", speaker: S("sigil_slaanesh", "穹顶下的声音", "A Voice Beneath the Dome"), foe: null,
     text: L("灵族乐师在穹顶下排练。旋律美得让你忘了呼吸，也忘了家人是怎么死的。\n有个声音在你耳边说：“他们有道途约束，不敢一直听下去。你们猿人没有。你敢。”",
             "Aeldari musicians rehearse beneath the dome. The melody is so beautiful you forget to breathe, forget how your family died.\nA voice at your ear: “They have their Paths to hold them back. They dare not keep listening. You mon-keigh have none. You dare.”"),
     codex: ["eld_path"],
     choices: [
       O("留下来一直听", "Stay and keep listening", {sanity: 10, taint: {slaanesh: 30}},
         "你听了三天三夜。乐师们发现你还在，吓得停了手。之后整整一周，你都在哼那段旋律。",
         "You listen for three days and nights. When the musicians notice you still there, they stop, frightened. For a week you hum that melody."),
       O("离开穹顶", "Leave the dome", {sanity: -5, renown: 3},
         "你走出很远才敢回头。灵骨歌者站在门口，朝你轻轻点了下头，像是松了口气。",
         "Only far away do you dare look back. A bonesinger stands at the door and nods to you, as if relieved.")
     ]},

    {id: "evt_t_eld_cleanse", god: "other", cleanse: true, factions: ["aeldari"], minChapter: 4,
     scene: "craftworld", speaker: S("aeldari_bonesinger", "灵骨歌者", "Bonesinger"), foe: null,
     text: L("灵骨歌者低声唱着，把一块小小的灵魂石放进你掌心。它是凉的，像井水。\n“她在找我们所有人，”她说，“你们猿人的灵魂太亮了，像黑夜里的灯笼。这个能替你遮一遮。”",
             "The bonesinger sings softly and sets a small spirit stone in your palm. It is cool, like well water.\n“She hunts for all of us,” she says. “Your mon-keigh souls burn so bright, lanterns in the dark. This will shade you a little.”"),
     codex: ["eld_spirit_stone"],
     choices: [
       O("把灵魂石贴身戴好", "Wear the stone against your skin", {sanity: 6, taint: {all: -15, slaanesh: -10}},
         "那一夜，你第一次没有梦见黑暗里那双找你的眼睛。灵魂石微微发烫，像在替你挡着什么。",
         "That night, for the first time, you don't dream of the eyes searching for you in the dark. The stone grows warm, as if holding something off."),
       O("道谢，但不收", "Thank her, but decline", {sanity: -2, renown: 2},
         "她没有勉强，只说：“那就别在夜里唱歌。”",
         "She doesn't insist. She only says, “Then don't sing at night.”")
     ]},

    {id: "evt_t_eld_khorne", god: "khorne", factions: ["aeldari"], minChapter: 5,
     scene: "craftworld", speaker: S("sigil_khorne", "空着的面具", "The Empty Mask"), foe: null,
     text: L("相位神殿里，灵族战士戴上面具，就变成了另一个人。\n墙上挂着一副空面具，没有主人。你碰了它一下，耳朵里就灌满铁与火的轰鸣，有人在低吼：“戴上。杀戮不需要道途。”",
             "In the aspect shrine, Aeldari warriors don their masks and become someone else.\nAn empty mask hangs on the wall, ownerless. You touch it, and your ears fill with the roar of iron and fire. Something growls: “Put it on. Slaughter needs no Path.”"),
     codex: ["eld_aspect_warriors"],
     choices: [
       O("把面具戴上", "Put the mask on", {hp: 10, renown: 5, taint: {khorne: 30}},
         "面具里热得像铁匠炉。摘下来时，你脸上留了一道红印，好几天都没褪。你也不想让它褪。",
         "Inside it's hot as a forge. When you take it off, a red mark stays on your face for days. You don't want it to fade."),
       O("把面具挂回去", "Hang the mask back up", {sanity: -3},
         "轰鸣声退了。门口的守卫看见你空着手出来，第一次向你行了个礼。",
         "The roar recedes. The guard at the door sees you leave empty-handed, and for the first time salutes you.")
     ]},

    {id: "evt_t_eld_nurgle", god: "nurgle", factions: ["aeldari"], minChapter: 6,
     scene: "maiden_world", speaker: S("sigil_nurgle", "井底的哭声", "Weeping in the Well"), foe: null,
     text: L("处女世界的果园里有一口老井。井底有个女人在哭，哭声温柔得让人心碎。\n她说她的眼泪能治好一切伤痛，只要你带走一捧。井沿上爬满了肥厚的、开着花的藤。",
             "In an orchard on the maiden world there is an old well. A woman weeps at its bottom, so gently it breaks your heart.\nHer tears can heal any hurt, she says, if you will carry some away. Fat, flowering vines smother the well's rim."),
     codex: ["god_nurgle"],
     choices: [
       O("接一捧她的眼泪", "Catch a handful of her tears", {hp: 15, taint: {nurgle: 30}},
         "眼泪治好了你所有的旧伤。井沿的藤顺着你的手腕绕了一圈，留下一道暖暖的绿痕。",
         "The tears heal every old wound you have. A vine curls once around your wrist, leaving a warm green mark."),
       O("去找游侠", "Go and find a ranger", {sanity: -3, renown: 3},
         "游侠的脸色很难看。她用石头封了井口：“那是被囚禁的女神。看守她的，是个园丁。”",
         "The ranger's face darkens. She seals the well with stones. “That is a captive goddess. Her keeper is a gardener.”")
     ]},

    /* ================= Necrons ================= */
    {id: "evt_t_nec_tzeentch", god: "tzeentch", factions: ["necrons"], minChapter: 2,
     scene: "tomb_interior", speaker: S("sigil_tzeentch", "多出来的一行", "The Extra Line"), foe: null,
     text: L("墓墙上的象形文字你已经抄了好几天。今天你发现有一行看得懂了，是用你的母语写的：\n“往下走。答案就在下面一层。”\n昨天，这一行还不存在。",
             "You've spent days copying the glyphs on the tomb wall. Today one line is readable. It's written in your own language:\n“Go down. The answer is one level below.”\nYesterday, that line didn't exist."),
     codex: ["god_tzeentch"],
     choices: [
       O("照着它往下走", "Go down where it says", {renown: 6, sanity: -4, taint: {tzeentch: 30}},
         "下一层真有东西：一块会发光的碎片。技师们看你的眼神多了几分兴趣。只有你知道，那行字今晚又换了一句。",
         "One level down there is something: a glowing shard. The crypteks regard you with new interest. Only you know the line changed again tonight."),
       O("烧掉这一页笔记", "Burn that page of notes", {sanity: -3},
         "火光里，那些符号在纸上扭动，像在挣扎。烧完后，你指尖沾的一点蓝墨怎么也洗不掉。",
         "In the flames the symbols writhe on the page as if struggling. Afterward a smudge of blue ink stays on your fingertip. It won't wash off.")
     ]},

    {id: "evt_t_nec_nurgle", god: "nurgle", factions: ["necrons"], minChapter: 3,
     scene: "tomb_interior", speaker: S("sigil_nurgle", "快活的厨子", "The Jolly Cook"), foe: null,
     text: L("和你关在一起的挖掘队员一个接一个发了烧。\n只有老厨子越来越胖，越来越快活。他用捡来的金属罐煮着什么，冒着甜丝丝的热气：“来一碗吧，学者。喝了就不怕冷了。”",
             "One by one, the diggers held captive with you fall to fever.\nOnly the old cook grows fatter and jollier. Something simmers in a scavenged metal can, sending up sweet steam. “Have a bowl, scholar. You'll never feel the cold again.”"),
     codex: ["god_nurgle"],
     choices: [
       O("喝一碗", "Have a bowl", {hp: 12, sanity: 5, taint: {nurgle: 30}},
         "汤暖洋洋地滑进胃里。第二天所有人都在咳，只有你和厨子在笑，你也说不清在笑什么。",
         "The stew slides down warm and soothing. Next day everyone else is coughing. Only you and the cook are smiling, though you couldn't say why."),
       O("只吃自己剩的干粮", "Eat only your own last rations", {hp: -6},
         "干粮硬得硌牙，你又冷又饿。第三天，厨子的角落空了，只剩那只罐子，和一群绕着它转的苍蝇。",
         "The hardtack is like stone; you're cold and hungry. On the third day the cook's corner is empty, but for the can and the flies circling it.")
     ]},

    {id: "evt_t_nec_cleanse", god: "other", cleanse: true, factions: ["necrons"], minChapter: 3,
     scene: "tomb_interior", speaker: S("canoptek_scarab", "黑色石柱", "The Black Pylon"), foe: null,
     text: L("墓穴深处立着一根黑色石柱。一靠近它，脑子里所有的声音都停了：低语、敲门声、梦里那些说个不停的东西。\n只剩一种冰冷的、绝对的安静。像死，又像被谁擦干净了。",
             "Deep in the tomb stands a black pylon. Near it, every voice in your head falls silent: the whispers, the knocking, the things that chatter in your dreams.\nOnly a cold, absolute quiet remains. Like death. Or like being wiped clean."),
     codex: ["chaos_warp"],
     choices: [
       O("在石柱旁坐一会儿", "Sit by the pylon a while", {sanity: 5, hp: -4, taint: {all: -25}},
         "你坐到手脚冰凉。离开时整个人轻了许多，好像有什么东西被留在了石柱上。",
         "You sit until your hands and feet are numb with cold. You leave much lighter, as if something stayed behind on the pylon."),
       O("伸手摸一下石柱", "Reach out and touch it", {renown: 4, sanity: -4, taint: {all: -10}},
         "石柱上亮起一道绿光，从头到脚扫过你。远处，某个沉睡的东西把你记了下来。",
         "A green line of light flares and sweeps you head to foot. Somewhere far off, a sleeping thing makes a note of you.")
     ]},

    {id: "evt_t_nec_khorne", god: "khorne", factions: ["necrons"], minChapter: 4,
     scene: "tomb_exterior", speaker: S("sigil_khorne", "还在转的链锯剑", "A Chainsword Still Running"), foe: null,
     text: L("墓穴外的沙地上躺着一队帝国卫兵，死灵战士刚从这里走过。你从沙里捡起一把链锯剑。\n它还在转，自己在转。握柄烫手，里面有个声音在低吼：“这些铁壳子没有灵魂，不值得杀。去找值得的。”",
             "A squad of Imperial guards lies on the sand outside the tomb; necron warriors have just passed this way. You pull a chainsword from the sand.\nIt's still running, on its own. The grip is hot, and something inside growls: “Those tin husks have no souls. Not worth killing. Go find some that are.”"),
     codex: ["god_khorne"],
     choices: [
       O("握紧它", "Grip it tight", {hp: 8, renown: 5, taint: {khorne: 30}},
         "你从没用过武器，可这把剑知道怎么用。那晚你和同伴吵了一架，差点动手，事后想不起为什么。",
         "You've never used a weapon, but the sword knows how. That night you nearly come to blows with a fellow prisoner, and later can't remember why."),
       O("关掉它，扔回地上", "Switch it off and drop it", {sanity: -3},
         "链锯停了。周围静得可怕，只剩远处的金属脚步声，一下一下，不急不慢。",
         "The chain stops. The quiet is terrible, broken only by distant metal footsteps, one after another, unhurried.")
     ]},

    {id: "evt_t_nec_slaanesh", god: "slaanesh", factions: ["necrons"], minChapter: 5,
     scene: "stasis_gallery", speaker: S("sigil_slaanesh", "空着的展台", "The Empty Plinth"), foe: null,
     text: L("收藏馆里，每个静滞力场都封着一个完美的瞬间：一场胜利，一次拥抱，一朵永不凋谢的花。\n有个展台空着，铭牌上已经刻好了你的名字。你忽然很想知道，自己一生中最好看的那一刻是什么样子。",
             "In the gallery, each stasis field holds a perfect moment: a victory, an embrace, a flower that will never wilt.\nOne plinth is empty. Your name is already engraved on it. Suddenly you long to see the finest moment of your life."),
     codex: ["god_slaanesh"],
     choices: [
       O("走近展台看看", "Step up to the plinth", {sanity: 6, renown: 4, taint: {slaanesh: 30}},
         "力场映出你最好的样子：年轻，自信，被所有人注视。你看了很久。离开后，你开始讨厌镜子里现在的自己。",
         "The field shows you at your finest: young, sure, every eye upon you. You stare a long time. Afterward you start to hate your face in mirrors."),
       O("转身离开收藏馆", "Turn and leave the gallery", {sanity: -3},
         "你走出很远。身后，铭牌上你的名字慢慢淡了下去。某位收藏家会失望的，但不是今天。",
         "You walk a long way. Behind you, your name fades slowly from the plaque. Some collector will be disappointed, but not today.")
     ]},

    /* ================= Shared taint events ================= */
    {id: "evt_t_any_dice", god: "undivided", factions: ["*"], minChapter: 2,
     scene: "warp", speaker: S("sigil_undivided", "梦里的小贩", "The Dream Peddler"), foe: null,
     text: L("你梦见一个没有脸的小贩，摊上只卖一样东西：一颗四面的骰子，每一面颜色都不同。\n“不要钱，”他说，“掷一次就好。哪一面朝上，就送你哪一样。”",
             "You dream of a faceless peddler whose stall sells one thing only: a four-sided die, each face a different colour.\n“No charge,” he says. “Just roll it once. Whichever face lands up, that's your gift.”"),
     codex: ["chaos_gods"],
     choices: [
       O("许愿“让我变强”，掷出去", "Wish “make me strong” and roll", {hp: 10, taint: {khorne: 25}},
         "骰子停在红色那面。醒来时你浑身是劲，枕头上却有股铁锈味。",
         "The die lands red. You wake brimming with strength, but your pillow smells of rust."),
       O("许愿“让我知道答案”，掷出去", "Wish “let me know the answers” and roll", {renown: 5, taint: {tzeentch: 25}},
         "骰子停在蓝色那面，又自己翻了个身。醒来后，你总能猜中别人的下一句话，这让你有点不安。",
         "The die lands blue, then turns over by itself. Since waking you can always guess what people will say next. It unsettles you."),
       O("不掷，把骰子还给他", "Don't roll. Hand it back", {sanity: -4},
         "小贩耸耸肩，收起骰子：“别的摊子可没我这么客气。”",
         "The peddler shrugs and pockets the die. “The other stalls won't be this polite.”")
     ]},

    {id: "evt_t_any_feast", god: "undivided", factions: ["*"], minChapter: 4,
     scene: "daemon_world", speaker: S("sigil_undivided", "两张空椅子", "Two Empty Chairs"), foe: null,
     text: L("你梦见一场宴会，长桌边有两张空椅子在等你。\n一张在最热闹的那头，人人光彩照人，笑声不断。一张在最安静的角落，一位胖胖的老人正给大家分热汤。\n两边都在朝你招手。",
             "You dream of a banquet. Two empty chairs wait for you at the long table.\nOne at the lively end, where everyone glitters and the laughter never stops. One in the quiet corner, where a stout old man ladles out hot soup.\nBoth ends beckon."),
     codex: ["chaos_gods"],
     choices: [
       O("坐到热闹的那一头", "Sit at the lively end", {sanity: 8, renown: 3, taint: {slaanesh: 25}},
         "每个人都夸你，夸得恰到好处。醒来以后，现实里的人说话都显得粗糙刺耳。",
         "Everyone praises you, exactly as much as you'd like. After you wake, real voices all sound coarse and grating."),
       O("坐到老人身边", "Sit beside the old man", {hp: 10, taint: {nurgle: 25}},
         "汤很稠，很暖。醒来时病痛轻了许多，嘴里却残留着一股甜腻的、放久了的味道。",
         "The soup is thick and warm. You wake with your aches much eased, and a sweet, stale taste lingering in your mouth."),
       O("哪边都不坐", "Sit at neither", {sanity: -4},
         "你站在两张椅子中间，直到宴会散场。所有人都走了，你饿着肚子醒来。",
         "You stand between the chairs until the banquet ends. Everyone leaves. You wake up hungry.")
     ]},

    {id: "evt_t_any_note", god: "other", cleanse: true, factions: ["*"], minChapter: 3,
     scene: "void", speaker: S(null, "一张旧字条", "An Old Note"), foe: null,
     text: L("你在衣服内衬里摸到一张折得很小的纸。是很久以前家里人偷偷塞进去的，你一直没发现。\n字歪歪扭扭：“记得吃饭。记得你是谁。”",
             "Sewn into the lining of your clothes you find a tightly folded scrap of paper. Someone at home slipped it in long ago; you never noticed.\nThe handwriting is clumsy: “Remember to eat. Remember who you are.”"),
     codex: [],
     choices: [
       O("小声读出来", "Read it aloud, quietly", {sanity: 8, taint: {all: -15}},
         "你念了一遍，又念了一遍。那些天天在你脑子里说话的东西，好像都被这几个字挤了出去。",
         "You read it once, then again. Whatever has been talking in your head these days seems crowded out by those few words."),
       O("把它收好，贴着心口", "Tuck it away over your heart", {sanity: 4, hp: 3, taint: {all: -10}},
         "纸很轻，可贴着心口暖暖的。那一夜你梦见了家，是真正的家，不是别人编给你的那个。",
         "The paper weighs nothing, but it's warm against your chest. That night you dream of home. The real one, not one someone made up for you.")
     ]},

    /* ================= Claim events (trigger:"claim") — SPEC §18/§19 =================
     * Fire when a god's hidden taint reaches 100 (at most twice per run).
     * First time: accept → goto that route's claim ending; resist → heavy cost, taint −40, resisted_<god>.
     * Second time (resisted_<god> set): only the forced choice is shown, and it also goes to the claim ending.
     * Chaos route goes to a short pre-ending node (cha_claim_<god>) that can branch to a "chosen" ending. */
    {id: "evt_claim_khorne", god: "khorne", trigger: "claim", factions: ["*"], minChapter: 1,
     scene: "daemon_world", speaker: S("sigil_khorne", "点名的声音", "The Roll Call"), foe: null,
     text: L("某天早上醒来，你手背上多了一个铜锈色的记号，摸上去是热的。\n你听见的每一声心跳都成了鼓点。远处有个声音，不是在命令，而是在点名：\n“你的名字，已经刻在王座底下了。”",
             "One morning you wake to find a verdigris mark on the back of your hand, warm to the touch.\nEvery heartbeat you hear is a drumbeat now. Far off, a voice is not giving orders. It is calling the roll:\n“Your name is carved beneath the throne.”"),
     codex: ["god_khorne"],
     choices: [
       A(O("应下这一声点名", "Answer the roll call", {set: {claimed_khorne: true}},
         "你应了。从那一刻起你不再怕疼，也忘了害怕是什么感觉。鼓声替你决定了接下来的一切。",
         "You answer. From that moment you fear no pain, and forget what fear felt like. The drum decides everything after."), "khorne"),
       B(O("咬紧牙关，一声不吭", "Clench your jaw. Say nothing", {corruption: 15, sanity: -25, hp: -10, taint: {khorne: -40}, set: {claimed_khorne: true, resisted_khorne: true}},
         "点名声停了，记号却没褪。它不急。它会等你下一次握紧拳头。",
         "The roll call falls silent, but the mark stays. It's in no hurry. It will wait for the next time you clench your fist."), "khorne"),
       F(O("鼓声太响了。应吧", "The drum is too loud. Answer", {set: {claimed_khorne: true}},
         "你张开嘴，喊出来的不是你的名字，是他的。",
         "You open your mouth. The name you shout is not yours. It is His."), "khorne")
     ]},

    {id: "evt_claim_nurgle", god: "nurgle", trigger: "claim", factions: ["*"], minChapter: 1,
     scene: "daemon_world", speaker: S("sigil_nurgle", "慈祥的声音", "A Fond Voice"), foe: null,
     text: L("你已经很久不觉得冷了。伤口不再愈合，也不再疼，只是安安静静地待在那里。\n今天早上，那几只苍蝇终于落在你肩上，不走了。一个慈祥的声音说：\n“欢迎回家，孩子。花园里给你留了位置。”",
             "You haven't felt cold in a long time. Your wounds no longer heal, nor hurt; they simply stay, quietly.\nThis morning the flies finally settle on your shoulder and stay. A fond voice says:\n“Welcome home, child. There's a place for you in the garden.”"),
     codex: ["god_nurgle"],
     choices: [
       A(O("“谢谢您，祖父。”", "“Thank you, Grandfather.”", {set: {claimed_nurgle: true}},
         "你再也不怕死了，因为你已经分不太清活着和不活着有什么区别。肩上的苍蝇在为你哼歌。",
         "You no longer fear death; you can't quite tell what separates living from not. The flies on your shoulder hum for you."), "nurgle"),
       B(O("把苍蝇一只一只赶走", "Brush the flies away, one by one", {corruption: 15, sanity: -20, hp: -15, taint: {nurgle: -40}, set: {claimed_nurgle: true, resisted_nurgle: true}},
         "赶走一只，又来一只。你赶了一整夜，天亮时它们终于散了。可你知道，园丁很有耐心。",
         "Brush one away and another comes. You keep at it all night; by dawn they've scattered. But you know the gardener is patient."), "nurgle"),
       F(O("太累了，赶不动了", "Too tired to brush them away", {set: {claimed_nurgle: true}},
         "你垂下手。苍蝇们落回你肩上，像一群终于回家的孩子。",
         "Your hand drops. The flies settle back on your shoulder like children finally home."), "nurgle")
     ]},

    {id: "evt_claim_tzeentch", god: "tzeentch", trigger: "claim", factions: ["*"], minChapter: 1,
     scene: "warp", speaker: S("sigil_tzeentch", "镜子里的人", "The One in the Mirror"), foe: null,
     text: L("你照镜子时，镜子里的人先开了口。\n他说出了你接下来要说的每一句话，一字不差。然后他微笑：\n“别担心。从现在起，所有的选择，我都替你想好了。”",
             "You look in a mirror, and the one inside speaks first.\nHe says every word you were about to say, exactly. Then he smiles:\n“Don't worry. From now on, every choice has already been thought through for you.”"),
     codex: ["god_tzeentch"],
     choices: [
       A(O("让他继续说下去", "Let him keep talking", {set: {claimed_tzeentch: true}},
         "他说得很好，比你自己想的还好。从那以后，你常常想不起哪些话是你自己说的。",
         "He speaks well, better than you'd have managed. From then on, you often can't recall which words were yours."), "tzeentch"),
       B(O("说一句他没料到的话", "Say something he didn't foresee", {corruption: 15, sanity: -25, hp: -10, taint: {tzeentch: -40}, set: {claimed_tzeentch: true, resisted_tzeentch: true}},
         "你说了一句连自己都没想到的话。他愣了一下，然后大笑：“妙极了。这也在计划之中。”",
         "You say something even you didn't expect. He blinks, then laughs aloud. “Marvellous. That was part of the plan too.”"), "tzeentch"),
       F(O("这一句，他也料到了", "He foresaw this one too", {set: {claimed_tzeentch: true}},
         "你刚张开嘴，他已经替你说完了后半句。从此每一句都是。",
         "You open your mouth, and he has already finished the sentence for you. Every sentence, from now on."), "tzeentch")
     ]},

    {id: "evt_claim_slaanesh", god: "slaanesh", trigger: "claim", factions: ["*"], minChapter: 1,
     scene: "throne_light", speaker: S("sigil_slaanesh", "甜得发苦的声音", "A Bittersweet Voice"), foe: null,
     text: L("一个平常的早晨，世界褪了色：饭菜没有味道，音乐没有起伏，连疼都平淡得很。\n只有一个声音甜得发苦：\n“你已经尝过最好的了，别的都配不上你。来吧。”",
             "One ordinary morning the world has lost its colour: food has no taste, music no rise and fall, even pain feels dull.\nOnly one voice remains, sweet enough to ache:\n“You've tasted the finest already. Nothing else is worthy of you. Come.”"),
     codex: ["god_slaanesh"],
     choices: [
       A(O("朝那个声音走过去", "Walk toward the voice", {set: {claimed_slaanesh: true}},
         "你的每个动作都变得优雅，每句话都让人着迷。而你自己，再也尝不到满足的滋味。",
         "Your every gesture turns graceful, your every word enthralling. And you yourself never again know what it is to be satisfied."), "slaanesh"),
       B(O("去做一件最无聊的活", "Go and do the dullest chore you can", {corruption: 15, sanity: -20, hp: -10, taint: {slaanesh: -40}, set: {claimed_slaanesh: true, resisted_slaanesh: true}},
         "你擦了一整天地板，一遍又一遍，无聊得想哭。到了晚上，那个声音终于小了一点。",
         "You scrub floors all day, over and over, bored to tears. By evening the voice is, at last, a little quieter."), "slaanesh"),
       F(O("就尝最后一口", "Just one last taste", {set: {claimed_slaanesh: true}},
         "最后一口之后，还有最后一口。你再也没有停下。",
         "After the last taste there is one more last taste. You never stop again."), "slaanesh")
     ]}

  ]);
})();
