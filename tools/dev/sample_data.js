/* sample_data.js — tiny test faction for engine/UI development. Owned by: web.
 * NOT loaded by the real game. Used by: index.html?sample=1, tools/dev/validate.js --sample, tools/dev/smoke_test.py.
 * Exercises: roll choices, require (flag / notFlag / stat min / max), hideIfLocked, hours/days/years/warp time,
 * eventRoll, codex unlocks, 2 good + 3 bad endings, 3 death nodes.
 * v0.2: choice `result` + roll `rollResult` (SPEC §11) — some effect choices deliberately have NO result so the
 * auto-summary line is exercised; codex `race` / `type` (SPEC §13) — smp_hive deliberately has neither (UI fallback);
 * `origins` (SPEC §16): 3 origins, two with short prologues (smp_o_*) that merge into the spine, one origin-gated choice;
 * `renownHelp` (SPEC §17); hidden taint (SPEC §18): taint effects, a cleansing event, a Khorne claim event, a taint-gated choice.
 * v0.2.1 (SPEC §19): `taintMod` (tzeentch ×1.5, slaanesh ×0.5, khorne/nurgle ×1); the Khorne claim has accept (goto → claim
 * ending), resist (taint −40, resisted_khorne) and a forced second-time choice (require flag resisted_khorne, goto); smp_end_claim_khorne.
 * v0.2.2 (SPEC §23): origin caps — scav max hp 125 / sanity 85 (starts hp 115, below its cap on purpose), clerk max hp 85; budgets −5 / 0.
 * v0.2.2 (SPEC §20): 3 chronicle entries (tags ["chronicle"], date, sortKey; M31 + M41; no cat / sprite on purpose → seal on the
 * lore card) and 2 rumours (one route-only, one "*" with a chapter window) that unlock two of them; chr_sample_heresy stays locked.
 */
WH.registerCodex({
  smp_commissar:  {cat: "leader", faction: "imperium", race: "imperium", type: "unit", sprite: "commissar",
    name: {zh: "政委", en: "Commissar"}, text: {zh: "星界军的政治军官，有权当场处决懦夫。他的手枪比命令更快。", en: "Political officer of the Guard, empowered to execute cowards on the spot."},
    more: {zh: "政委多出自孤儿院式的学院，从小被教导：士气就是弹药。", en: "Most are raised in schola orphanages, taught from childhood that morale is ammunition."},
    aliases: {zh: ["政委"], en: ["commissar"]}},
  smp_emperor:    {cat: "leader", faction: "imperium", race: "imperium", type: "deity", sprite: "omen_emperor",
    name: {zh: "帝皇", en: "The Emperor"}, text: {zh: "坐在黄金王座上一万年的人类之主。亿万人向他祈祷。", en: "Master of Mankind, enthroned for ten thousand years. Billions pray to him."}},
  smp_ork:        {cat: "enemy", faction: "xenos", race: "orks", type: "unit", sprite: "ork",
    name: {zh: "兽人", en: "Orks"}, text: {zh: "绿皮异形，为战斗而生。他们越相信，就越强大。", en: "Green-skinned xenos born for war. What they believe, becomes true."},
    aliases: {zh: ["绿皮"], en: ["greenskins", "greenskin"]}},
  smp_cultist:    {cat: "enemy", faction: "chaos", race: "chaos", type: "unit", sprite: "cultist",
    name: {zh: "混沌邪教徒", en: "Chaos Cultist"}, text: {zh: "被许诺所诱的普通人。他们曾是你的邻居。", en: "Ordinary people seduced by promises. They used to be your neighbours."}},
  smp_abaddon:    {cat: "boss", faction: "chaos", race: "chaos", type: "concept", sprite: "omen_black_crusade",
    name: {zh: "黑色远征", en: "The Black Crusade"}, text: {zh: "战帅阿巴顿的舰队遮蔽了星空。", en: "Warmaster Abaddon's fleets blot out the stars."}},
  smp_khorne:     {cat: "god", faction: "any", race: "chaos", type: "deity", sprite: "sigil_khorne",
    name: {zh: "恐虐", en: "Khorne"}, text: {zh: "鲜血之神。他不在乎血从何处流出。", en: "The Blood God. He cares not from whence the blood flows."},
    more: {zh: "恐虐鄙视巫术，敬重勇武——哪怕是敌人的勇武。", en: "Khorne despises sorcery and honours courage, even an enemy's."}},
  smp_tzeentch:   {cat: "god", faction: "any", race: "chaos", type: "deity", sprite: "sigil_tzeentch",
    name: {zh: "奸奇", en: "Tzeentch"}, text: {zh: "变化之神，计谋之主。每个答案都是新的问题。", en: "Changer of Ways. Every answer is another question."}},
  smp_warp:       {cat: "lore", faction: "any", race: "other", type: "concept", sprite: "psyker",
    name: {zh: "亚空间", en: "The Warp"}, text: {zh: "情绪构成的海洋。星舰穿行其中，时间在此失真。", en: "A sea of emotion. Ships sail through it; time bends inside."}},
  smp_place_hive: {cat: "place", faction: "imperium", race: "imperium", type: "place", scene: "hive_hab",
    name: {zh: "第七巢都", en: "Hive Seven"}, text: {zh: "四十层以下终年不见日光。空气按配额供应。", en: "Below level forty there is no daylight. Air is rationed."},
    more: {zh: "每一层都有自己的帮派、神龛和税吏。", en: "Every level has its own gangs, shrines and tax collectors."}, aliases: {zh: ["第七巢都"], en: ["Hive Seven"]}},
  smp_place_warp: {cat: "place", faction: "any", race: "chaos", type: "place", scene: "warp",
    name: {zh: "亚空间航道", en: "Warp Lane"}, text: {zh: "星舰在情绪之海里航行，靠领航员的第三只眼。", en: "Ships sail a sea of emotion, guided by a Navigator's third eye."}},
  smp_hive:       {cat: "lore", faction: "imperium", sprite: "hive_foreman",
    name: {zh: "巢都", en: "Hive City"}, text: {zh: "数公里高的城市，容纳数十亿人。", en: "Cities kilometres tall, home to billions."}},
  smp_inquisition: {cat: "leader", faction: "imperium", race: "imperium", type: "organization", sprite: "inquisitor",
    name: {zh: "审判庭", en: "The Inquisition"}, text: {zh: "只对帝皇负责的秘密机构。", en: "A secret order answerable only to the Emperor."},
    aliases: {zh: ["审判官"], en: ["Inquisitor"]}},
  smp_genestealer: {cat: "enemy", faction: "xenos", race: "tyranids", type: "unit", sprite: "genestealer",
    name: {zh: "基因窃取者", en: "Genestealer"}, text: {zh: "虫巢的先锋，潜伏在巢都底层。", en: "Vanguard of the hive, lurking in the underhive."}}
});

/* SPEC §20 chronicle entries (normally data/chronicle.js) */
WH.registerCodex({
  chr_sample_heresy: {type: "concept", tags: ["chronicle"], race: "imperium", faction: "any", sortKey: 31014,
    date: {zh: "014.M31", en: "014.M31"}, name: {zh: "泰拉之围", en: "Siege of Terra"},
    text: {zh: "叛乱的战帅荷鲁斯兵临皇宫。帝皇亲自登上了荷鲁斯的旗舰。", en: "The rebel Warmaster Horus besieged the Palace. The Emperor himself boarded Horus's flagship."},
    more: {zh: "荷鲁斯死了。帝皇从此坐上黄金王座，再没起身。", en: "Horus died. The Emperor was set upon the Golden Throne, and never rose again."}},
  chr_sample_armageddon: {type: "concept", tags: ["chronicle"], race: "orks", faction: "any", sortKey: 41998,
    date: {zh: "998.M41", en: "998.M41"}, name: {zh: "第三次阿玛迦顿战争", en: "Third War for Armageddon"},
    text: {zh: "兽人大军阀加兹库尔再次扑向巢都世界阿玛迦顿。", en: "Ork Warlord Ghazghkull fell upon the hive world Armageddon once more."},
    more: {zh: "战争从未真正结束，只是变成了季节——干季，就是开战的季节。", en: "The war never really ended. It became a season: when the dry months come, so do the Orks."},
    aliases: {zh: ["阿玛迦顿"], en: ["Armageddon"]}},
  chr_sample_cadia: {type: "concept", tags: ["chronicle"], race: "imperium", faction: "any", sortKey: 41999,
    date: {zh: "999.M41", en: "999.M41"}, name: {zh: "卡迪亚陷落", en: "Fall of Cadia"},
    text: {zh: "阿巴顿的第十三次黑色远征终于攻破卡迪亚。星球本身碎裂了。", en: "Abaddon's Thirteenth Black Crusade finally broke Cadia. The planet itself shattered."},
    more: {zh: "卡迪亚人说，倒下的是星球，不是他们。", en: "Cadians say it was the planet that fell, not them."},
    aliases: {zh: ["卡迪亚"], en: ["Cadia"]}}
});

/* SPEC §21: the hidden easter-egg entry (normally in data/easter_tzeentch.js; sample mode clears WH.codex) */
WH.registerCodex({
  egg_tzeentch_letter: {cat: "lore", race: "chaos", type: "concept", faction: "any", sprite: "sigil_tzeentch", hidden: true,
    name: {zh: "改变之主的回信", en: "A Reply from the Changer of Ways"}, text: {zh: "你以为是你在收集图鉴。", en: "You thought you were the one collecting."}}
});

/* SPEC §20 rumours (normally data/rumors.js) */
WH.registerRumors([
  {id: "smp_rum_cadia", factions: ["sample"], minChapter: 2,
   speaker: {zh: "独臂老兵", en: "One-armed veteran"},
   text: {zh: "“卡迪亚没倒，”他把杯子扣在桌上，“是星球先碎的。人还站着。”", en: "\"Cadia didn't fall,\" he says, slamming his cup down. \"The planet broke first. We were still standing.\""},
   codex: ["chr_sample_cadia"]},
  {id: "smp_rum_wall", factions: ["*"], minChapter: 2, maxChapter: 3, speaker: null,
   text: {zh: "墙上的炭笔字：记住阿玛迦顿。绿皮总会回来。", en: "Charcoal on the wall: REMEMBER ARMAGEDDON. THE GREENSKINS ALWAYS COME BACK."},
   codex: ["chr_sample_armageddon"]}
]);

WH.registerEvents([
  {id: "smp_evt_khorne", god: "khorne", factions: ["*"], minChapter: 1,
   scene: "warp", speaker: {sprite: "daemon_khorne", name: {zh: "低吼的声音", en: "A Growling Voice"}}, foe: null,
   text: {zh: "你的手在发抖——不是因为恐惧。一个声音说：拿起刀。", en: "Your hands shake — not from fear. A voice says: pick up the blade."},
   codex: ["smp_khorne"],
   choices: [
     {text: {zh: "拿起刀", en: "Take the blade"}, effects: {corruption: 15, hp: 5, taint: {khorne: 30}}, result: {zh: "刀柄是温热的。你感觉很好。太好了。", en: "The hilt is warm. You feel good. Too good."}},
     {text: {zh: "默念帝皇之名", en: "Whisper the Emperor's name"}, effects: {sanity: -10, renown: 5}, result: {zh: "声音笑了，然后消失。", en: "The voice laughs, then fades."}}
   ]},
  {id: "smp_evt_tzeentch", god: "tzeentch", factions: ["sample"], minChapter: 2,
   scene: "warp", speaker: {sprite: "daemon_tzeentch", name: {zh: "变幻之影", en: "Shifting Shape"}}, foe: null,
   text: {zh: "你读到一份明天的报告。上面写着你的死亡。", en: "You read tomorrow's report. It describes your death."},
   codex: ["smp_tzeentch"],
   choices: [
     {text: {zh: "烧掉它", en: "Burn it"}, effects: {sanity: -15}, result: {zh: "灰烬拼成了另一个字。", en: "The ashes spell another word."}},
     {text: {zh: "读完它", en: "Read to the end"}, effects: {sanity: -25, corruption: 10, taint: {tzeentch: 25}}, result: {zh: "结局改变了。你也是。", en: "The ending changed. So did you."}},
     {text: {zh: "交给政委", en: "Hand it to the commissar"}, effects: {renown: 10}, result: {zh: "他看都没看就烧了它。", en: "He burns it without reading."}}
   ]},
  {id: "smp_evt_cleanse", god: "other", cleanse: true, factions: ["sample"], minChapter: 2,
   scene: "cathedral", speaker: {sprite: "preacher", name: {zh: "老牧师", en: "Old Preacher"}}, foe: null,
   text: {zh: "老牧师按住你的额头，念了一段你从没听过的祷文。", en: "The old preacher presses your brow and recites a litany you have never heard."},
   choices: [
     {text: {zh: "低头接受", en: "Bow and accept"}, effects: {sanity: 5, taint: {all: -20}}, result: {zh: "某种很重的东西，从你肩上滑落了。", en: "Something heavy slides off your shoulders."}},
     {text: {zh: "推开他", en: "Push him away"}, effects: {renown: -5}, result: {zh: "他叹了口气，没有再说什么。", en: "He sighs and says nothing more."}}
   ]},
  {id: "smp_claim_khorne", god: "khorne", trigger: "claim", factions: ["*"],
   scene: "daemon_world", speaker: {sprite: "daemon_khorne", name: {zh: "铜王座的回声", en: "Echo of the Brass Throne"}}, foe: null,
   text: {zh: "你数不清自己杀了多少人。有个声音替你数着，而且很满意。", en: "You have lost count of the dead. Something else has been counting, and it is pleased."},
   codex: ["smp_khorne"],
   choices: [
     {text: {zh: "接受烙印", en: "Accept the mark"}, require: {notFlag: "resisted_khorne"}, hideIfLocked: true,
      effects: {corruption: 25, sanity: -10, set: {claimed_khorne: true}}, goto: {sample: "smp_end_claim_khorne"},
      result: {zh: "你的手背上浮出一个烧红的记号。", en: "A red-hot mark rises on the back of your hand."}},
     {text: {zh: "咬破舌头，背诵祷文", en: "Bite your tongue and pray"}, require: {notFlag: "resisted_khorne"}, hideIfLocked: true,
      effects: {corruption: 15, hp: -15, taint: {khorne: -40}, set: {claimed_khorne: true, resisted_khorne: true}},
      result: {zh: "血的味道让祷文变了调。", en: "The taste of blood bends the litany out of tune."}},
     {text: {zh: "铜王座不再询问", en: "The Brass Throne asks no more"}, require: {flag: "resisted_khorne"}, hideIfLocked: true,
      effects: {corruption: 10}, goto: {sample: "smp_end_claim_khorne"},
      result: {zh: "这一次，你的舌头没有流血。是别人的血。", en: "This time the blood is not from your tongue. It is someone else's."}}
   ]}
]);

WH.registerFaction({
  id: "sample",
  name: {zh: "测试阵营", en: "Sample Faction"},
  tagline: {zh: "十四个节点的试炼", en: "A trial of fourteen nodes"},
  role: {zh: "巢都工人", en: "Hive worker"},
  playerSprite: "player_imperium",
  color: "#c9a227",
  startNode: "smp_001",
  startDate: {year: 111, mill: 42},
  startStats: {hp: 100, sanity: 100, corruption: 0, renown: 10},
  renownLabel: {zh: "信仰", en: "Faith"},
  renownIcon: "icon_faith",
  taintMod: {khorne: 1, nurgle: 1, tzeentch: 1.5, slaanesh: 0.5},
  renownHelp: {zh: "信仰代表你对帝皇的虔诚与名声。祈祷、服从、勇敢会提高它；怀疑和逃避会降低它。信仰够高时，能解锁领导众人的选项与更好的结局。",
               en: "Faith is your devotion and standing before the Emperor. Prayer, obedience and courage raise it; doubt and flight lower it. High Faith unlocks leadership choices and better endings."},
  deathNodes: {hp: "smp_death_hp", sanity: "smp_death_sanity", corruption: "smp_death_corruption"},
  learn: {leaders: ["smp_emperor", "smp_commissar"], enemies: ["smp_ork", "smp_cultist"], boss: ["smp_abaddon"]},
  origins: [
    {id: "hive", name: {zh: "巢都工人", en: "Hive worker"}, desc: {zh: "十六小时一班，配额永远在涨。", en: "Sixteen-hour shifts, and the quota always rises."},
     sprite: "player_imperium", startNode: "smp_001", stats: {hp: 100, sanity: 100, corruption: 0, renown: 10}, set: {origin_hive: true}},
    {id: "scav", name: {zh: "下巢拾荒者", en: "Underhive scavenger"}, desc: {zh: "你在废料堆里长大，听得懂墙里的声音。", en: "Raised in the scrap heaps, you understand the voices in the walls."},
     sprite: "player_chaos", startNode: "smp_o_scav_1", max: {hp: 125, sanity: 85}, stats: {hp: 115, corruption: 10, renown: 10}, set: {origin_scav: true}},
    {id: "clerk", name: {zh: "档案书记", en: "Archive clerk"}, desc: {zh: "你抄写别人的死亡名单，从没想过会抄到自己。", en: "You copy out other people's death lists. You never expected your own name."},
     sprite: "player_imperium", startNode: "smp_o_clerk_1", max: {hp: 85}, stats: {corruption: 0, renown: 25}, set: {origin_clerk: true}}
  ],
  chapters: {1: {zh: "巢都之底", en: "Bottom of the Hive"}, 2: {zh: "什一税", en: "The Tithe"}, 3: {zh: "亚空间", en: "The Warp"}, 4: {zh: "黑色远征", en: "Black Crusade"}},
  nodes: {
    smp_001: {chapter: 1, scene: "hive_hab", speaker: null,
      text: {zh: "第七巢都，第四十层。汽笛响了，又是十六小时的班。\n墙上的帝皇像在滴水。", en: "Hive Seven, level forty. The siren howls: another sixteen-hour shift.\nThe Emperor's portrait on the wall is dripping."},
      codex: ["smp_hive", "smp_place_hive"],
      choices: [
        {text: {zh: "去工厂上班", en: "Go to the manufactorum"}, next: "smp_002"},
        {text: {zh: "对帝皇像祈祷", en: "Pray to the portrait"}, next: "smp_002", effects: {renown: 5, set: {prayed: true}},
         result: {zh: "你跪在积水里。画像上的水滴落在你额头，像一个回答。", en: "You kneel in the puddle. A drop from the portrait lands on your brow, like an answer."}},
        {text: {zh: "翘班去下巢", en: "Skip work, go downhive"}, next: "smp_003", effects: {corruption: 5}}
      ]},
    smp_o_scav_1: {chapter: 1, scene: "underhive", speaker: null,
      text: {zh: "废料堆在下雨。你从一具伺服颅骨里撬出一枚还能用的线圈。", en: "It rains on the scrap heaps. You pry a working coil out of a servo-skull."},
      choices: [
        {text: {zh: "拿去换水", en: "Trade it for water"}, next: "smp_o_scav_2", effects: {hp: 5},
         result: {zh: "水是锈色的。你还是一口气喝完了。", en: "The water is rust-coloured. You drink it all anyway."}},
        {text: {zh: "留着它", en: "Keep it"}, next: "smp_o_scav_2", effects: {renown: 3}}
      ]},
    smp_o_scav_2: {chapter: 1, scene: "underhive", speaker: {sprite: "mutant", name: {zh: "老拾荒者", en: "Old Scavenger"}}, time: {h: 8},
      text: {zh: "“有人在下面唱歌，”老人说，“唱的是你的名字。”", en: "\"Someone sings down below,\" the old man says. \"They sing your name.\""},
      choices: [{text: {zh: "去看看", en: "Go and see"}, next: "smp_003"}]},
    smp_o_clerk_1: {chapter: 1, scene: "cathedral", speaker: null,
      text: {zh: "档案库里只有羽毛笔的声音。你抄完第四百个名字，揉了揉眼睛。", en: "Only quills scratch in the archive. You finish the four-hundredth name and rub your eyes."},
      choices: [
        {text: {zh: "继续抄写", en: "Keep copying"}, next: "smp_o_clerk_2", effects: {sanity: -5}},
        {text: {zh: "偷看下一页", en: "Peek at the next page"}, next: "smp_o_clerk_2", effects: {set: {peeked: true}},
         result: {zh: "下一页上，第一行是你的名字。", en: "On the next page, the first line is your name."}}
      ]},
    smp_o_clerk_2: {chapter: 1, scene: "cathedral", speaker: {sprite: "preacher", name: {zh: "档案长", en: "Archivist"}}, time: {h: 2},
      text: {zh: "“什一税名单不会出错，孩子。出错的只会是人。”", en: "\"The tithe list does not err, child. Only people do.\""},
      choices: [{text: {zh: "低头", en: "Bow your head"}, next: "smp_o_clerk_3"}]},
    smp_o_clerk_3: {chapter: 1, scene: "hive_hab", speaker: null, time: {d: 1},
      text: {zh: "第二天，你被调去工厂顶班。没人解释为什么。", en: "Next day you are sent to cover a factory shift. No one explains why."},
      choices: [{text: {zh: "去工厂", en: "Go to the factory"}, next: "smp_002"}]},
    smp_002: {chapter: 1, scene: "manufactorum", speaker: {sprite: "hive_foreman", name: {zh: "工头格里克", en: "Foreman Grick"}},
      time: {h: 6},
      text: {zh: "“配额又涨了。完不成的人，名字会进什一税名单。”", en: "\"Quota's up again. Miss it, and your name goes on the tithe list.\""},
      choices: [
        {text: {zh: "拼命干活", en: "Work yourself raw"}, next: "smp_004", effects: {hp: -15},
         result: {zh: "压床咬住了你的袖口。你扯回手臂，留下一层皮。", en: "The press catches your sleeve. You tear your arm free and leave skin behind."}},
        {text: {zh: "偷工减料", en: "Cut corners"}, roll: {p: 0.5, stat: "sanity", success: "smp_004", fail: "smp_005"},
         rollResult: {success: {zh: "检查员只看了一眼计数板，就走开了。", en: "The inspector glances at the tally board and walks on."},
                      fail: {zh: "检查员停在你的工位前，慢慢掏出记事板。", en: "The inspector stops at your station and slowly takes out a slate."}}},
        {text: {zh: "[祈祷过] 请求庇佑", en: "[Prayed] Ask for protection"}, next: "smp_004", require: {flag: "prayed"}, effects: {renown: 5}},
        {text: {zh: "[信仰≥40] 带领工友祷告", en: "[Faith≥40] Lead the workers in prayer"}, next: "smp_004", require: {stat: "renown", min: 40}}
      ]},
    smp_003: {chapter: 1, scene: "underhive", speaker: {sprite: "cultist", name: {zh: "戴兜帽的人", en: "Hooded Figure"}},
      time: {d: 2}, eventRoll: 0.5,
      text: {zh: "“你也听见了吧？墙里的歌声。”他递给你一枚刻着八芒的铁片。", en: "\"You hear it too, don't you? The singing in the walls.\" He offers you an iron token."},
      codex: ["smp_cultist"],
      choices: [
        {text: {zh: "收下铁片", en: "Take the token"}, next: "smp_005", effects: {corruption: 20, set: {token: true}},
         result: {zh: "铁片在掌心发烫。墙里的歌声，突然清楚了一点。", en: "The token is hot in your palm. The song in the walls grows a little clearer."}},
        {text: {zh: "转身就跑", en: "Run"}, next: "smp_005", effects: {sanity: -10}},
        {text: {zh: "[未祈祷] 跟他走", en: "[Never prayed] Follow him"}, next: "smp_end_bad_cult", require: {notFlag: "prayed"}, hideIfLocked: true}
      ]},
    smp_004: {chapter: 2, scene: "barracks", speaker: {sprite: "commissar", name: {zh: "卡斯政委", en: "Commissar Kast"}},
      time: {d: 9},
      text: {zh: "你的名字还是上了名单。卡斯政委看着新兵：“恐惧是允许的。逃跑不是。”", en: "Your name made the list anyway. Commissar Kast eyes the recruits: \"Fear is permitted. Running is not.\""},
      codex: ["smp_commissar"],
      choices: [
        {text: {zh: "立正", en: "Stand to attention"}, next: "smp_006", effects: {renown: 5}},
        {text: {zh: "问他会不会怕", en: "Ask if he is ever afraid"}, next: "smp_006", effects: {sanity: 5, renown: -5}}
      ]},
    smp_005: {chapter: 2, scene: "barracks", speaker: {sprite: "guard_sergeant", name: {zh: "军士", en: "Sergeant"}},
      time: {d: 12}, eventRoll: 0.6,
      text: {zh: "执法者在宿舍把你拖起来。什一税从不问你愿不愿意。", en: "Enforcers drag you out of your bunk. The tithe never asks."},
      effects: {hp: -10},
      choices: [
        {text: {zh: "认命", en: "Accept it"}, next: "smp_006"},
        {text: {zh: "[拾荒者] 钻进通风管", en: "[Scavenger] Slip into the vents"}, next: "smp_006", require: {flag: "origin_scav"}, hideIfLocked: true,
         effects: {renown: 5}, result: {zh: "你熟悉这种管道。执法者的手电光从你脚下扫过。", en: "You know these ducts. The enforcers' lamps sweep beneath your boots."}},
        {text: {zh: "[腐化≤30] 坦白铁片", en: "[Corruption≤30] Confess the token"}, next: "smp_006", require: [{flag: "token"}, {stat: "corruption", max: 30}], effects: {renown: 10, unset: ["token"]}}
      ]},
    smp_006: {chapter: 3, scene: "ship_interior", speaker: {sprite: "psyker", name: {zh: "被缚的灵能者", en: "Bound Psyker"}},
      time: {d: 30, warp: true}, eventRoll: 0.4,
      text: {zh: "运兵舰潜入亚空间。舷窗外的颜色没有名字。灵能者在笑。", en: "The troopship drops into the warp. The colours outside have no names. The psyker is laughing."},
      effects: {sanity: -15}, codex: ["smp_warp", "smp_place_warp"],
      choices: [
        {text: {zh: "盯着舷窗", en: "Stare out the viewport"}, next: "smp_007", effects: {sanity: -30, corruption: 10},
         result: {zh: "颜色回望着你。你忘了眨眼，也忘了为什么要眨眼。", en: "The colours look back. You forget to blink, then forget why anyone would."}},
        {text: {zh: "闭眼背诵祷文", en: "Close your eyes, recite the litany"}, next: "smp_007", effects: {renown: 5}},
        {text: {zh: "和灵能者说话", en: "Talk to the psyker"}, roll: {p: 0.35, stat: "renown", success: "smp_007", fail: "smp_death_sanity"}}
      ]},
    smp_007: {chapter: 4, scene: "trench", speaker: {sprite: "guardsman", name: {zh: "老兵维克", en: "Veteran Vik"}}, foe: "ork",
      time: {y: 2},
      text: {zh: "两年。你学会了在泥里睡觉。今夜，绿皮冲锋了。", en: "Two years. You learned to sleep in mud. Tonight, the greenskins charge."},
      effects: {hp: -35}, codex: ["smp_ork"],
      choices: [
        {text: {zh: "开火", en: "Open fire"}, roll: {p: 0.55, stat: "hp", success: "smp_008", fail: "smp_end_bad_trench"},
         rollResult: {success: {zh: "激光枪烫得握不住。冲在最前的绿皮倒进泥里。", en: "The lasgun grows too hot to hold. The lead greenskin drops into the mud."},
                      fail: {zh: "扳机咔哒一声。什么也没发生。", en: "The trigger clicks. Nothing happens."}}},
        {text: {zh: "固守", en: "Hold the line"}, next: "smp_008", effects: {hp: -60}},
        {text: {zh: "逃跑", en: "Flee"}, next: "smp_end_bad_coward"}
      ]},
    smp_008: {chapter: 4, scene: "burning_city", speaker: null, foe: "omen_black_crusade",
      time: {h: 30},
      text: {zh: "天空裂开。黑色的舰队压下来——黑色远征来了。", en: "The sky splits. A black fleet descends — the Black Crusade has come."},
      effects: {sanity: -10}, codex: ["smp_abaddon"],
      choices: [
        {text: {zh: "守住大教堂", en: "Defend the cathedral"}, next: "smp_end_good_saint", require: {stat: "renown", min: 25}},
        {text: {zh: "带平民撤离", en: "Evacuate the civilians"}, next: "smp_end_good_evac"},
        {text: {zh: "拾起染血的链锯剑", en: "Lift the bloodied chainsword"}, next: "smp_end_bad_trench", require: {taint: "khorne", min: 50}, hideIfLocked: true,
         effects: {taint: {khorne: 20}}, result: {zh: "剑在你手里活了过来。你笑了，却想不起为什么。", en: "The blade wakes in your hands. You laugh, and cannot remember why."}},
        {text: {zh: "向远征军投降", en: "Surrender to the crusade"}, next: "smp_death_corruption", effects: {corruption: 100}}
      ]},
    smp_end_good_saint: {chapter: 4, scene: "throne_light", speaker: null, codex: ["smp_emperor"],
      text: {zh: "援军抵达时，大教堂仍然屹立。有人说看见了金色的光。", en: "When relief arrives, the cathedral still stands. Some swear they saw golden light."},
      ending: {kind: "good", title: {zh: "金光之下", en: "Under the Golden Light"}}},
    smp_end_good_evac: {chapter: 4, scene: "void", speaker: null,
      text: {zh: "最后一艘穿梭机起飞了。你活了下来，还有三百个陌生人。", en: "The last shuttle lifts off. You survive, with three hundred strangers."},
      ending: {kind: "good", title: {zh: "三百人", en: "Three Hundred"}}},
    smp_end_bad_cult: {chapter: 1, scene: "cult_shrine", speaker: {sprite: "cult_magus", name: {zh: "教主", en: "The Magus"}},
      text: {zh: "歌声终于有了歌词。你再也没回到地面。", en: "The song finally has words. You never return to the surface."},
      ending: {kind: "bad", title: {zh: "墙中之歌", en: "Song in the Walls"}}},
    smp_end_bad_trench: {chapter: 4, scene: "trench", speaker: null, foe: "ork_boss",
      text: {zh: "你的枪卡壳了。战壕被淹没在绿色之中。", en: "Your lasgun jams. The trench drowns in green."},
      ending: {kind: "bad", title: {zh: "泥中之名", en: "A Name in the Mud"}}},
    smp_end_bad_coward: {chapter: 4, scene: "trench", speaker: {sprite: "commissar", name: {zh: "卡斯政委", en: "Commissar Kast"}},
      text: {zh: "你只跑了十步。政委的手枪很准。", en: "You make it ten steps. The commissar's aim is true."},
      ending: {kind: "bad", title: {zh: "十步", en: "Ten Steps"}, cause: {zh: "被政委处决", en: "Executed by the commissar"}}},
    smp_end_claim_khorne: {chapter: 4, scene: "daemon_world", speaker: {sprite: "daemon_khorne", name: {zh: "铜王座的回声", en: "Echo of the Brass Throne"}},
      text: {zh: "你不再数了。战场一个接一个，颅骨一颗接一颗。王座从不说够。", en: "You no longer count. Battlefield after battlefield, skull after skull. The Throne never says enough."},
      ending: {kind: "bad", title: {zh: "颅骨献给王座", en: "Skulls for the Throne"}, cause: {zh: "被恐虐认领", en: "Claimed by Khorne"}}},
    smp_death_hp: {scene: "ruins", speaker: null,
      text: {zh: "你的血渗进了这个星球的土里。这里的土早已喝饱了血。", en: "Your blood soaks into this world's soil. It has drunk its fill before."},
      ending: {kind: "death", title: {zh: "无名之死", en: "A Nameless Death"}}},
    smp_death_sanity: {scene: "warp", speaker: null,
      text: {zh: "你听懂了低语。然后你开始和它们一起低语。", en: "You understand the whispers. Then you begin to whisper with them."},
      ending: {kind: "death", title: {zh: "低语者", en: "The Whisperer"}}},
    smp_death_corruption: {scene: "daemon_world", speaker: null, foe: "daemon_prince",
      text: {zh: "你的骨头在歌唱。你已不再是人。", en: "Your bones are singing. You are no longer human."},
      ending: {kind: "death", title: {zh: "混沌之子", en: "Spawn of Chaos"}}}
  }
});
