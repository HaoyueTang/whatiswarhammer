/* sample_data.js — tiny test faction for engine/UI development. Owned by: web.
 * NOT loaded by the real game. Used by: index.html?sample=1, tools/dev/validate.js --sample, tools/dev/smoke_test.py.
 * Exercises: roll choices, require (flag / notFlag / stat min / max), hideIfLocked, hours/days/years/warp time,
 * eventRoll, codex unlocks, 2 good + 3 bad endings, 3 death nodes.
 */
WH.registerCodex({
  smp_commissar:  {cat: "leader", faction: "imperium", sprite: "commissar",
    name: {zh: "政委", en: "Commissar"}, text: {zh: "星界军的政治军官，有权当场处决懦夫。他的手枪比命令更快。", en: "Political officer of the Guard, empowered to execute cowards on the spot."},
    more: {zh: "政委多出自孤儿院式的学院，从小被教导：士气就是弹药。", en: "Most are raised in schola orphanages, taught from childhood that morale is ammunition."},
    aliases: {zh: ["政委"], en: ["commissar"]}},
  smp_emperor:    {cat: "leader", faction: "imperium", sprite: "omen_emperor",
    name: {zh: "帝皇", en: "The Emperor"}, text: {zh: "坐在黄金王座上一万年的人类之主。亿万人向他祈祷。", en: "Master of Mankind, enthroned for ten thousand years. Billions pray to him."}},
  smp_ork:        {cat: "enemy", faction: "xenos", sprite: "ork",
    name: {zh: "兽人", en: "Orks"}, text: {zh: "绿皮异形，为战斗而生。他们越相信，就越强大。", en: "Green-skinned xenos born for war. What they believe, becomes true."},
    aliases: {zh: ["绿皮"], en: ["greenskins", "greenskin"]}},
  smp_cultist:    {cat: "enemy", faction: "chaos", sprite: "cultist",
    name: {zh: "混沌邪教徒", en: "Chaos Cultist"}, text: {zh: "被许诺所诱的普通人。他们曾是你的邻居。", en: "Ordinary people seduced by promises. They used to be your neighbours."}},
  smp_abaddon:    {cat: "boss", faction: "chaos", sprite: "omen_black_crusade",
    name: {zh: "黑色远征", en: "The Black Crusade"}, text: {zh: "战帅阿巴顿的舰队遮蔽了星空。", en: "Warmaster Abaddon's fleets blot out the stars."}},
  smp_khorne:     {cat: "god", faction: "any", sprite: "sigil_khorne",
    name: {zh: "恐虐", en: "Khorne"}, text: {zh: "鲜血之神。他不在乎血从何处流出。", en: "The Blood God. He cares not from whence the blood flows."},
    more: {zh: "恐虐鄙视巫术，敬重勇武——哪怕是敌人的勇武。", en: "Khorne despises sorcery and honours courage, even an enemy's."}},
  smp_tzeentch:   {cat: "god", faction: "any", sprite: "sigil_tzeentch",
    name: {zh: "奸奇", en: "Tzeentch"}, text: {zh: "变化之神，计谋之主。每个答案都是新的问题。", en: "Changer of Ways. Every answer is another question."}},
  smp_warp:       {cat: "lore", faction: "any", sprite: "psyker",
    name: {zh: "亚空间", en: "The Warp"}, text: {zh: "情绪构成的海洋。星舰穿行其中，时间在此失真。", en: "A sea of emotion. Ships sail through it; time bends inside."}},
  smp_place_hive: {cat: "place", faction: "imperium", scene: "hive_hab",
    name: {zh: "第七巢都", en: "Hive Seven"}, text: {zh: "四十层以下终年不见日光。空气按配额供应。", en: "Below level forty there is no daylight. Air is rationed."},
    more: {zh: "每一层都有自己的帮派、神龛和税吏。", en: "Every level has its own gangs, shrines and tax collectors."}, aliases: {zh: ["第七巢都"], en: ["Hive Seven"]}},
  smp_place_warp: {cat: "place", faction: "any", scene: "warp",
    name: {zh: "亚空间航道", en: "Warp Lane"}, text: {zh: "星舰在情绪之海里航行，靠领航员的第三只眼。", en: "Ships sail a sea of emotion, guided by a Navigator's third eye."}},
  smp_hive:       {cat: "lore", faction: "imperium", sprite: "hive_foreman",
    name: {zh: "巢都", en: "Hive City"}, text: {zh: "数公里高的城市，容纳数十亿人。", en: "Cities kilometres tall, home to billions."}}
});

WH.registerEvents([
  {id: "smp_evt_khorne", god: "khorne", factions: ["*"], minChapter: 1,
   scene: "warp", speaker: {sprite: "daemon_khorne", name: {zh: "低吼的声音", en: "A Growling Voice"}}, foe: null,
   text: {zh: "你的手在发抖——不是因为恐惧。一个声音说：拿起刀。", en: "Your hands shake — not from fear. A voice says: pick up the blade."},
   codex: ["smp_khorne"],
   choices: [
     {text: {zh: "拿起刀", en: "Take the blade"}, effects: {corruption: 15, hp: 5}, result: {zh: "刀柄是温热的。你感觉很好。太好了。", en: "The hilt is warm. You feel good. Too good."}},
     {text: {zh: "默念帝皇之名", en: "Whisper the Emperor's name"}, effects: {sanity: -10, renown: 5}, result: {zh: "声音笑了，然后消失。", en: "The voice laughs, then fades."}}
   ]},
  {id: "smp_evt_tzeentch", god: "tzeentch", factions: ["sample"], minChapter: 2,
   scene: "warp", speaker: {sprite: "daemon_tzeentch", name: {zh: "变幻之影", en: "Shifting Shape"}}, foe: null,
   text: {zh: "你读到一份明天的报告。上面写着你的死亡。", en: "You read tomorrow's report. It describes your death."},
   codex: ["smp_tzeentch"],
   choices: [
     {text: {zh: "烧掉它", en: "Burn it"}, effects: {sanity: -15}, result: {zh: "灰烬拼成了另一个字。", en: "The ashes spell another word."}},
     {text: {zh: "读完它", en: "Read to the end"}, effects: {sanity: -25, corruption: 10}, result: {zh: "结局改变了。你也是。", en: "The ending changed. So did you."}},
     {text: {zh: "交给政委", en: "Hand it to the commissar"}, effects: {renown: 10}, result: {zh: "他看都没看就烧了它。", en: "He burns it without reading."}}
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
  deathNodes: {hp: "smp_death_hp", sanity: "smp_death_sanity", corruption: "smp_death_corruption"},
  learn: {leaders: ["smp_emperor", "smp_commissar"], enemies: ["smp_ork", "smp_cultist"], boss: ["smp_abaddon"]},
  chapters: {1: {zh: "巢都之底", en: "Bottom of the Hive"}, 2: {zh: "什一税", en: "The Tithe"}, 3: {zh: "亚空间", en: "The Warp"}, 4: {zh: "黑色远征", en: "Black Crusade"}},
  nodes: {
    smp_001: {chapter: 1, scene: "hive_hab", speaker: null,
      text: {zh: "第七巢都，第四十层。汽笛响了，又是十六小时的班。\n墙上的帝皇像在滴水。", en: "Hive Seven, level forty. The siren howls: another sixteen-hour shift.\nThe Emperor's portrait on the wall is dripping."},
      codex: ["smp_hive", "smp_place_hive"],
      choices: [
        {text: {zh: "去工厂上班", en: "Go to the manufactorum"}, next: "smp_002"},
        {text: {zh: "对帝皇像祈祷", en: "Pray to the portrait"}, next: "smp_002", effects: {renown: 5, set: {prayed: true}}},
        {text: {zh: "翘班去下巢", en: "Skip work, go downhive"}, next: "smp_003", effects: {corruption: 5}}
      ]},
    smp_002: {chapter: 1, scene: "manufactorum", speaker: {sprite: "hive_foreman", name: {zh: "工头格里克", en: "Foreman Grick"}},
      time: {h: 6},
      text: {zh: "“配额又涨了。完不成的人，名字会进什一税名单。”", en: "\"Quota's up again. Miss it, and your name goes on the tithe list.\""},
      choices: [
        {text: {zh: "拼命干活", en: "Work yourself raw"}, next: "smp_004", effects: {hp: -15}},
        {text: {zh: "偷工减料", en: "Cut corners"}, roll: {p: 0.5, stat: "sanity", success: "smp_004", fail: "smp_005"}},
        {text: {zh: "[祈祷过] 请求庇佑", en: "[Prayed] Ask for protection"}, next: "smp_004", require: {flag: "prayed"}, effects: {renown: 5}},
        {text: {zh: "[信仰≥40] 带领工友祷告", en: "[Faith≥40] Lead the workers in prayer"}, next: "smp_004", require: {stat: "renown", min: 40}}
      ]},
    smp_003: {chapter: 1, scene: "underhive", speaker: {sprite: "cultist", name: {zh: "戴兜帽的人", en: "Hooded Figure"}},
      time: {d: 2}, eventRoll: 0.5,
      text: {zh: "“你也听见了吧？墙里的歌声。”他递给你一枚刻着八芒的铁片。", en: "\"You hear it too, don't you? The singing in the walls.\" He offers you an iron token."},
      codex: ["smp_cultist"],
      choices: [
        {text: {zh: "收下铁片", en: "Take the token"}, next: "smp_005", effects: {corruption: 20, set: {token: true}}},
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
        {text: {zh: "[腐化≤30] 坦白铁片", en: "[Corruption≤30] Confess the token"}, next: "smp_006", require: [{flag: "token"}, {stat: "corruption", max: 30}], effects: {renown: 10, unset: ["token"]}}
      ]},
    smp_006: {chapter: 3, scene: "ship_interior", speaker: {sprite: "psyker", name: {zh: "被缚的灵能者", en: "Bound Psyker"}},
      time: {d: 30, warp: true}, eventRoll: 0.4,
      text: {zh: "运兵舰潜入亚空间。舷窗外的颜色没有名字。灵能者在笑。", en: "The troopship drops into the warp. The colours outside have no names. The psyker is laughing."},
      effects: {sanity: -15}, codex: ["smp_warp", "smp_place_warp"],
      choices: [
        {text: {zh: "盯着舷窗", en: "Stare out the viewport"}, next: "smp_007", effects: {sanity: -30, corruption: 10}},
        {text: {zh: "闭眼背诵祷文", en: "Close your eyes, recite the litany"}, next: "smp_007", effects: {renown: 5}},
        {text: {zh: "和灵能者说话", en: "Talk to the psyker"}, roll: {p: 0.35, stat: "renown", success: "smp_007", fail: "smp_death_sanity"}}
      ]},
    smp_007: {chapter: 4, scene: "trench", speaker: {sprite: "guardsman", name: {zh: "老兵维克", en: "Veteran Vik"}}, foe: "ork",
      time: {y: 2},
      text: {zh: "两年。你学会了在泥里睡觉。今夜，绿皮冲锋了。", en: "Two years. You learned to sleep in mud. Tonight, the greenskins charge."},
      effects: {hp: -35}, codex: ["smp_ork"],
      choices: [
        {text: {zh: "开火", en: "Open fire"}, roll: {p: 0.55, stat: "hp", success: "smp_008", fail: "smp_end_bad_trench"}},
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
