/* data/universal.js — the universal birth route, v2: all 8 factions (SPEC §37, docs/audit/UNIVERSAL_V2_BRIEF.md) (text role).
 * One shared birth on Aurex Secundus (Arcosa Sector), three social classes (low / mid / up). Each class strand is a few "whom you meet /
 * what you learn" forks that set u_* flags, then a ROAD node (doors + roads) and SUB nodes that hold only doors (depth <= 2 from the ROAD).
 * A DOOR is a choice with effects.faction/origin (helper D): 20 doors -> 20 distinct origins, each reached from exactly one class (brief §2).
 * Doors that need a prologue flag are gated with ONLY(flag) = {require:{flag}, hideIfLocked:true} and always come after the ungated choices.
 * Stat-neutral: no stat/taint effects, no rolls, no endings, no codex, no time here. Undated: no year/date in any text (durations are fine;
 * the clock starts at the target faction's own startDate at the door, SPEC §37.11). Nodes that can precede the GSC door (u_b01-03, u_low_1,
 * u_low_1m, u_low_2, u_low_2d, u_low_3, u_low_ship) stay timeless: no Valda silence, green sky, Thessa Null dig, Black Crusade, Dustfall war.
 * Every speaker of a sub-door node is named in that node's own base text (SPEC §37.9; the intro audit is flag-blind).
 * Helpers as in the faction files. Node ids u_*, all chapter 1. Choice order (= data index) is fixed by brief §3.4 / §7.3; note that the engine's
 * g.choose(i) and the UI's data-i take the position in the VISIBLE list (hideIfLocked choices are omitted), g.choices()[k].index is the data index.
 * Text written (text role): each door is a DEPARTURE; the entry node of the chosen origin carries a `born_universal` alt that bridges place/time.
 */
(function () {
  function L(zh, en) { return {zh: zh, en: en}; }
  function S(sprite, zh, en) { return {sprite: sprite, name: {zh: zh, en: en}}; }
  function C(zh, en, next, extra) {
    var c = {text: {zh: zh, en: en}};
    if (next) c.next = next;
    if (extra) for (var k in extra) c[k] = extra[k];
    return c;
  }
  /* a choice that exists only when the prologue flag f is set (hidden otherwise); gated choices always come last in a node */
  function ONLY(f) { return {require: {flag: f}, hideIfLocked: true}; }
  /* an alt paragraph shown when the prologue flag f is set */
  function ADD(f, zh, en) { return {"if": {flag: f}, add: L(zh, en)}; }
  /* a door choice: switch to <faction>/<origin> and go to that origin's start node; gate = optional ONLY(flag), extra = optional resultAlt etc. */
  function D(zh, en, startNode, faction, origin, res, gate, extra) {
    var c = C(zh, en, startNode, {effects: {faction: faction, origin: origin, set: {u_door: faction + "/" + origin}}, result: res});
    if (gate) for (var k in gate) c[k] = gate[k];
    if (extra) for (var j in extra) c[j] = extra[j];
    return c;
  }

  var N = {};

  /* Cast. Names/spellings are those of the faction files (Grusk = imperium.js; the Escort Sergeant = aeldari.js; Professor Marrow = necrons.js);
   * the rest are untitled types, so no origin can contradict them. */
  var GRUSK   = S("hive_foreman", "格鲁斯克监工", "Overseer Grusk");
  var VOX     = S("servitor", "广播伺服", "Vox-servitor");
  var RECRUIT = S("guard_sergeant", "征兵中士", "Recruiting Sergeant");
  var VETERAN = S("guardsman", "断腿老兵", "One-legged Veteran");
  var SALVAGE = S("hive_foreman", "拾荒队长", "Salvage Boss");
  var DEACON  = S("preacher", "教会执事", "Church Deacon");
  var LEVY    = S("tech_priest", "征调神甫", "Levy-Priest");
  var MATE    = S("hive_foreman", "“忍耐号”的大副", "Mate of the Endurance");
  var ESCORT  = S("guardsman", "押船的军士", "Escort Sergeant");
  var MARROW  = S("dig_leader", "玛罗教授", "Professor Marrow");
  var CULT    = S("tech_priest", "神教收债人", "Cult Debt-Collector");

  /* ============ Birth · the day before Tithe Day, one siren for the whole city ============ */
  N.u_b01 = {chapter: 1, scene: "hive_hab", speaker: null,
    text: L("什一税日的前一天，黎明。警报从排污井一路响到尖塔顶，整座奥雷克斯二号睁开眼：尖塔的灯，工厂的烟，灰原上穹顶农庄的微光。",
            "The day before Tithe Day, dawn. The siren runs from the drain-shafts to the top of the spire, and all of Aurex Secundus opens its eyes: lamps in the spire, smoke over the factories, the faint glow of dome farms on the ash plains."),
    choices: [C("起身，听广播", "Get up and listen to the broadcast", "u_b02")]};

  N.u_b02 = {chapter: 1, scene: "hive_hab", speaker: VOX,
    text: L("广播伺服用同一个声调念总督府的谕令：“新兵团须在税日前补齐。下层出人，灰原补粮，尖塔清债。”\n门，一扇接一扇关上了。",
            "A vox-servitor reads the governor's decree in one flat tone. “The new regiment is to be filled before Tithe Day. The lower hive gives people, the ash plains give grain, the spire clears its debts.”\nDoors close, one after another."),
    choices: [C("把话听完", "Hear it to the end", "u_b03")]};

  N.u_b03 = {chapter: 1, scene: "hive_hab", speaker: null,
    text: L("你已到了能被点名的年纪。广播念完，家里没人再瞒你什么：总督府要的那一份，各层不同，各家心里有数。\n你家是……",
            "You are old enough to be counted. The broadcast is over, and nobody at home hides anything from you now: what the governor asks differs from level to level, and every family knows its share.\nYour family is..."),
    choices: [
      C("靠双手和脊背吃饭的人家", "A family that lives by hands and backs", "u_low_1", {effects: {set: {class_low: true}}}),
      C("夹在上下之间的人家", "A family caught in the middle", "u_mid_1", {effects: {set: {class_mid: true}}}),
      C("握着账本和印章的人家", "A family of ledgers and seals", "u_up_1", {effects: {set: {class_up: true}}})
    ]};

  /* ============ Low · Manufactorum Six and the hab-block: the draw is tomorrow ============
   * u_low_1 (roll call: overtime | carry the Levy-Priest's roll) → u_low_1m → u_low_2 (recruiting table: the veteran | the dockside bar)
   * → u_low_2v / u_low_2d → u_low_3 (ROAD: hive | army SUB | ship SUB [docks] | levy SUB [forge]). Flags: u_low_grusk u_low_forge u_low_vet u_low_docks. */
  N.u_low_1 = {chapter: 1, scene: "manufactorum", speaker: GRUSK,
    text: L("第六工厂的班前点名。格鲁斯克监工把明天的班表撕了重写：“名单念到谁，我就少一个人，配额照旧。今天，加班。”\n他身后，一个红袍的征调神甫在替铸造世界清点人手。没人抱怨。",
            "Pre-shift roll call at Manufactorum Six. Overseer Grusk tears up tomorrow's shift sheet and writes a new one. “Whoever the list names, I lose a hand and the quota stays the same. Overtime today.”\nBehind him a red-robed Levy-Priest counts hands for the forge world. Nobody complains."),
    choices: [
      C("低头加班，直到收工", "Keep your head down and work the overtime", "u_low_2", {effects: {set: {u_low_grusk: true}}}),
      C("替神甫把名册送到厂门口", "Carry the priest's roll to the factory gate", "u_low_1m", {effects: {set: {u_low_forge: true}}})
    ]};

  N.u_low_1m = {chapter: 1, scene: "manufactorum", speaker: LEVY,
    text: L("厂门口，征调神甫接过名册，捏了捏你的手腕，像在试一柄工具。“格拉维克斯的枪运来，人换回去。第六工厂欠第七熔炉一批人手，自愿者先走。到港分两队：熔炉工牌，或护教军的签筒。”",
            "At the factory gate the Levy-Priest takes the roll and squeezes your wrist, the way you test the grip of a tool. “Gravex's guns come here; hands go back. Manufactorum Six owes the Seventh Furnace a batch of hands, and volunteers sail first. On landing there are two lines: furnace tags, or the Skitarii lot-drum.”"),
    choices: [C("收工，回居住块", "Clock off and head back to the hab-block", "u_low_2")]};

  N.u_low_2 = {chapter: 1, scene: "hive_hab", speaker: RECRUIT,
    text: L("收工回到居住块，楼梯间摆起了征兵桌。中士拍着桌上的钱袋：“自愿的，自己挑团，赏钱当场发。等抽签的——总督府塞哪算哪。”\n桌前的凳子空着。",
            "Back at the hab-block, a recruiting table stands in the stairwell. The sergeant slaps a pay-pouch on it. “Volunteers pick their regiment, bounty paid on the spot. Wait for the draw, and the governor stuffs you wherever there's room.”\nThe stool in front of the table stays empty."),
    choices: [
      C("在桌边站到天黑", "Stand by the table till dusk", "u_low_2v", {effects: {set: {u_low_vet: true}}}),
      C("下楼，去码头酒馆", "Go down to the dockside bar", "u_low_2d", {effects: {set: {u_low_docks: true}}})
    ]};

  N.u_low_2v = {chapter: 1, scene: "hive_hab", speaker: VETERAN,
    text: L("断腿老兵坐在桌边，空裤管垂在烟里。“绿皮咬的，”他拍拍木头假腿，“没人赔。”\n他压低声音：“听句实话。奥雷克斯有个连要去伊斯卡隆守船坞。没赏钱，不打仗，就守一道门。”",
            "A one-legged veteran sits by the table, his empty trouser leg hanging in the smoke. “Greenskins did that,” he says, tapping the wooden stump. “Nobody paid me for it.”\nHe lowers his voice. “Take a tip. An Aurex company is going to guard the breaker docks on Iskaron. No bounty, no fighting. Just a gate.”"),
    choices: [C("天黑了，回家", "Night falls; go home", "u_low_3")]};

  N.u_low_2d = {chapter: 1, scene: "underhive", speaker: MATE,
    text: L("码头酒馆挨着货梯。凯辛矿船“忍耐号”的大副摊开名册，招九号井的人：“缺人，最深处给双倍工分，路费拿矿抵。”\n邻桌，补给船的事务长招舱工，去卡尔卡罗斯港和更远处，到港结清。没人多问。",
            "The dockside bar sits beside the cargo lifts. The mate of the Kessin ore ship Endurance has a roll open on the table, signing hands for Shaft Nine. “Short-handed. Double points at the deepest face. Passage paid off in ore.”\nAt the next table a supply-ship purser hires hold-hands for Carcharos Port and beyond, settled on arrival. Nobody asks questions."),
    choices: [C("喝完这杯，回家", "Finish your cup and go home", "u_low_3")]};

  /* ROAD of the low class */
  N.u_low_3 = {chapter: 1, scene: "hive_hab", speaker: null,
    text: L("夜里，一家人围着一盏灯。母亲把每个人的工牌擦了一遍，放回桌上，没人说话。\n灯油只够烧到天亮。明天，名单就要贴出来。",
            "Night, and the family sits round a single lamp. Mother wipes every work-tag clean and sets them back on the table. Nobody speaks.\nThere is oil for the lamp until dawn. Tomorrow the list goes up."),
    alt: [
      ADD("u_low_forge", "征调神甫说过，征调船后天开。", "The Levy-Priest said the levy ship sails the day after tomorrow."),
      ADD("u_low_docks", "“忍耐号”天亮前离港。", "The Endurance leaves the dock before dawn.")
    ],
    choices: [
      D("不签了，等明天的名单", "Sign nothing; wait for tomorrow's list", "imp_101", "imperium", "hive",
        L("你把工牌塞回领口。明天，名单就下来了。", "You tuck your work-tag back into your collar. Tomorrow the names come down."), null,
        {resultAlt: [{"if": {flag: "u_low_grusk"}, text: L("你把工牌塞回领口。加班的工时，格鲁斯克一笔笔记着。明天，名单就下来了。", "You tuck your work-tag back into your collar. Grusk logged every overtime hour, line by line. Tomorrow the names come down.")}]}),
      C("回楼梯间，征兵桌还没收", "Back to the stairwell; the table's still out", "u_low_door"),
      C("去码头，找“忍耐号”", "Go to the docks and find the Endurance", "u_low_ship", ONLY("u_low_docks")),
      C("去厂门口，找征调神甫", "Go to the factory gate and the Levy-Priest", "u_low_levy", ONLY("u_low_forge"))
    ]};

  /* SUB: the army (recruiting table) */
  N.u_low_door = {chapter: 1, scene: "hive_hab", speaker: VETERAN,
    text: L("天黑了，征兵桌还没收。断腿老兵吐出一口烟：“线列团经卡尔卡罗斯去尘落星打绿皮，赏钱厚，死得快。驻防团守海湾，赏钱薄，对面的白船只做买卖。”",
            "Dusk, and the recruiting table is still out. A one-legged veteran blows out smoke. “Line regiments go through Carcharos to Dustfall to fight greenskins: fat bounty, quick graves. Garrison regiments watch the Gulf: thin bounty, and the white ships across it only trade.”"),
    alt: [
      ADD("u_low_vet", "老兵还在原地，像是在等你。", "The veteran hasn't moved, as if he has been waiting for you."),
      ADD("u_low_docks", "你从码头回来，征兵桌还没收。", "You come back from the docks, and the table is still out.")
    ],
    choices: [
      D("签线列团，领厚赏钱", "Sign for the line regiment and take the fat bounty", "cha_o_deserter_1", "chaos", "deserter",
        L("赏钱沉甸甸的，够家里吃一年。老兵压低声音：“卡尔卡罗斯的污池，没人问你从哪来。”", "The bounty is heavy in your hand: a year of food for the family. The veteran drops his voice. “In the Sump on Carcharos, nobody asks where you're from.”")),
      D("签驻防团，去海湾边守着", "Sign for the garrison and go stand watch on the Gulf", "tau_o_pow_1", "tau", "pow",
        L("赏钱只有一半。中士盖了章：“海湾那边安静，安静得很。”", "The bounty is half as much. The sergeant stamps the slate. “Quiet out on the Gulf. Very quiet.”")),
      D("签船坞连队，去伊斯卡隆", "Sign for the dock company bound for Iskaron", "ork_o_guard_1", "orks", "guard",
        L("没有赏钱，只发一件旧大衣。老兵点头：“守门的活，总比挖坟强。”", "No bounty, only an old greatcoat. The veteran nods. “A gate job beats digging graves.”"), ONLY("u_low_vet"))
    ]};

  /* SUB: the ship (Kessin ore ship / supply ship) */
  N.u_low_ship = {chapter: 1, scene: "ship_interior", speaker: MATE,
    text: L("天亮前，“忍耐号”的货坡道。大副举着灯，在名册上一个个划勾：“九号井，最后几个位子。”\n两个泊位外，补给船也在装货。事务长倚着舱门，笑得很客气。",
            "Before dawn at the cargo ramp of the Endurance. The mate holds up a lamp and ticks names off his roll. “Shaft Nine. The last few berths.”\nTwo berths down, the supply ship is loading too. Its purser leans in the hatchway, smiling politely."),
    choices: [
      D("上“忍耐号”，去凯辛挖矿", "Board the Endurance and go dig on Kessin", "gsc_101", "gsc", "miner",
        L("大副在你手背盖了矿务章：“九号井缺人，最深处给双倍工分。”", "The mate stamps a mining-board mark on the back of your hand. “Shaft Nine is short-handed. Double points at the deepest face.”")),
      D("签舱工合同，跟补给船走", "Sign on as a hold-hand on the supply ship", "nec_o_convict_1", "necrons", "convict",
        L("事务长折好合同，笑得太客气：“到港结清。”", "The purser folds the contract away, smiling too politely. “Settled on arrival.”"))
    ]};

  /* SUB: the levy (forge world) */
  N.u_low_levy = {chapter: 1, scene: "manufactorum", speaker: LEVY,
    text: L("天亮前，厂门口。征调神甫立在计数台后，脚下用粉笔划了两条线：熔炉的队，签筒的队。\n“现在选，”他说，“到了格拉维克斯，没有时间让你选。”",
            "Before dawn at the factory gate. The Levy-Priest stands behind a counting lectern, two chalk lines on the floor at his feet: the furnace line, the lot-drum line.\n“Choose now,” he says. “On Gravex there is no time to choose.”"),
    choices: [
      D("站进熔炉的队", "Stand in the furnace line", "mech_101", "mechanicus", "menial",
        L("他扫过你的手腕：“劳力。编号，到港分配。”", "He scans your wrist. “Labour. Number assigned on arrival.”")),
      D("站进签筒的队", "Stand in the lot-drum line", "mech_o_conscript_1", "mechanicus", "conscript",
        L("他的镜头停了一瞬：“自愿抽签者，记录在案。”", "His lens pauses for a moment. “Volunteer for the draw. Recorded.”"))
    ]};

  /* ============ Mid · Dome Farm Seven on the ash plains: the grain depot, the salvage crew, the labour ship ============
   * u_mid_1 (steady the ladder | tape errand to the depot) → [u_mid_2v] → u_mid_2 (ash road | help load) → [u_mid_2s] → u_mid_door (ROAD: agri |
   * ash road SUB | depot SUB [valda]). Flags: u_mid_valda u_mid_scrap. */
  N.u_mid_1 = {chapter: 1, scene: "jungle", speaker: null,
    text: L("七号穹顶农庄。母亲把今年的麦袋数了三遍；父亲爬上梯子，拿胶带去粘玻璃顶的裂缝。\n广播里那句“灰原补粮”，谁也没提。",
            "Dome Farm Seven. Mother counts this year's grain sacks a third time; Father climbs a ladder to tape the crack in the glass roof.\nNobody mentions the line from the broadcast: “the ash plains give grain.”"),
    choices: [
      C("扶好梯子，再去灰烬路口", "Steady the ladder, then walk down to the ash road", "u_mid_2"),
      C("替父亲去粮站换胶带", "Go to the depot for Father's tape", "u_mid_2v", {effects: {set: {u_mid_valda: true}}})
    ]};

  N.u_mid_2v = {chapter: 1, scene: "ship_interior", speaker: ESCORT,
    text: L("粮站停机坪，去瓦尔达的补给船在装货。瓦尔达星防卫军押船的军士举着单子：“练过民兵的，签个名，管饭有饷。”\n季节工说，那边麦子铺到天边，田里立着黑石头。你背脊发凉：这片田，你梦了多年。",
            "On the depot pad a supply ship bound for Valda is taking on stores. The Valdan defence-force sergeant escorting it holds up an enlistment sheet. “Trained with the militia? Sign here. Meals and pay.”\nA seasonal hand says the wheat there runs to the horizon, with black stones in the fields. You go cold. You have dreamed that field for years."),
    choices: [C("揣好胶带，去灰烬路口", "Pocket the tape and walk on to the ash road", "u_mid_2")]};

  N.u_mid_2 = {chapter: 1, scene: "ruins", speaker: SALVAGE,
    text: L("灰烬路边停着两拨外人。拾荒队的头儿蹲在废铁堆上，给每个帮忙装车的孩子一块干肉，数得清清楚楚。\n稍远处，招工船的船长举着合同板：“三年约，先发一个月工钱。”大人们远远看着，谁也没动。",
            "Two groups of outsiders have set up beside the ash road. The salvage boss squats on a heap of scrap and hands every kid who helps load his wagon one strip of dried meat, counted out exactly.\nA little way off, a labour-ship captain holds up a contract slate. “Three-year term, first month paid up front.” The grown-ups watch from a distance. Nobody moves."),
    choices: [
      C("回农庄吃晚饭", "Head home for supper", "u_mid_door"),
      C("帮拾荒队装车", "Help the salvage crew load", "u_mid_2s", {effects: {set: {u_mid_scrap: true}}})
    ]};

  N.u_mid_2s = {chapter: 1, scene: "ruins", speaker: SALVAGE,
    text: L("你帮拾荒队长把废铁抬上车，他按条数给你干肉。“我在卡尔卡罗斯下巢卖货，在伊斯卡隆的船骨市场进货。拆船星上，机灵的孩子守个摊子，就饿不死。”\n他草草写了张条子，收件人是个老摊主。",
            "You help the Salvage Boss heave scrap onto the wagon. He pays out dried meat by the strip, not one more. “I sell in the Carcharos underhive and buy in the ship-bone market on Iskaron. On a breaker world a sharp kid with a stall doesn't starve.”\nHe scrawls a note to an old stallholder he knows."),
    choices: [C("揣着干肉和条子回家", "Head home with the meat and the note", "u_mid_door")]};

  /* ROAD of the mid class */
  N.u_mid_door = {chapter: 1, scene: "jungle", speaker: null,
    text: L("傍晚，灰原上起了风。母亲把最后一袋麦子扎紧：税官过几天到，拾荒队明早动身，招工船只等到天黑。\n父亲坐在门槛上，谁也没看。",
            "Evening; the wind rises over the ash plains. Mother ties up the last sack. The assessor comes in a few days, the salvage crew leaves at dawn, the labour ship waits only until dark.\nFather sits on the doorstep and looks at no one."),
    alt: [
      ADD("u_mid_valda", "粮站那条去瓦尔达的船，后天开。", "The ship to Valda at the depot lifts off the day after tomorrow."),
      ADD("u_mid_scrap", "队长给的条子，还在你兜里。", "The boss's note is still in your pocket.")
    ],
    choices: [
      D("留下，等税官上门", "Stay and wait for the assessor", "imp_o_agri_1", "imperium", "agri",
        L("父亲在你碗里多添了一勺，什么也没说。", "Father adds an extra spoonful to your bowl and says nothing.")),
      C("趁天没黑，再去灰烬路口", "Back to the ash road before dark", "u_mid_road"),
      C("去粮站，找瓦尔达的船", "Go to the depot and the Valda ship", "u_mid_valda", ONLY("u_mid_valda"))
    ]};

  /* SUB: the ash road (salvage crew / labour ship / Iskaron) */
  N.u_mid_road = {chapter: 1, scene: "ruins", speaker: SALVAGE,
    text: L("灰烬路上，暮色压了下来。拾荒队长把最后一辆车的绳子勒紧，天一亮就走。\n不远处，招工船的船长在收合同板：他的船只等到天黑。",
            "Dusk settles on the ash road. The Salvage Boss cinches the ropes on the last wagon; the crew leaves at first light.\nNot far off, the labour-ship captain is folding up his contract slate. His ship waits only until dark."),
    alt: [ADD("u_mid_scrap", "队长瞥了一眼你兜里露出的条子。", "The boss glances at the note sticking out of your pocket.")],
    choices: [
      D("跟拾荒队上灰烬路", "Join the salvage crew on the ash road", "cha_101", "chaos", "scavenger",
        L("队头把一块干肉拍进你手里：“卡尔卡罗斯的下巢，什么废铁都收。”", "The boss slaps a strip of dried meat into your hand. “Down in the Carcharos underhive they buy any scrap.”")),
      D("在招工船的合同上按手印", "Press your thumb to the labour ship's contract", "tau_101", "tau", "colonist",
        L("船长看也没看你的手：“港口卸货，管饭，月结。新卡尔德那边缺人。”", "The captain doesn't even look at your hand. “Dock work, meals included, paid monthly. New Calder is short of hands.”")),
      D("拿着队长的条子去伊斯卡隆", "Take the boss's note to Iskaron", "ork_101", "orks", "scrap",
        L("队长把你塞上一艘废铁货船：“到了船骨市场，找老摊主。”", "The boss shoves you onto a scrap freighter. “At the ship-bone market, ask for the old stallholder.”"), ONLY("u_mid_scrap"))
    ]};

  /* SUB: the depot pad (supply ship to Valda) */
  N.u_mid_valda = {chapter: 1, scene: "ship_interior", speaker: ESCORT,
    text: L("粮站的停机坪上，补给船的舱门还开着。押船的军士把征兵单递到你面前，笔就夹在单子上。\n几个回乡的季节工传着酒壶，没人劝你。船两天后起飞。",
            "On the depot pad the supply ship's hatch is still open. The escort sergeant holds the enlistment sheet out to you, a pen clipped to it.\nSome seasonal hands heading home pass a flask round, and nobody tries to persuade you. The ship lifts off in two days."),
    choices: [
      D("在军士的单子上签名", "Sign the sergeant's sheet", "eld_o_trooper_1", "aeldari", "trooper",
        L("军士把单子叠进胸袋：“落地那天，就发军服。”", "The sergeant folds the sheet into his breast pocket. “You get a uniform the day we land.”")),
      D("不签，买一个货舱角落", "Don't sign; buy a corner of the hold", "eld_o_pilgrim_1", "aeldari", "pilgrim",
        L("你把攒下的钱都交给船员。梦里那片田，就是这艘船的去处。", "You hand the crew everything you saved. The field from your dream is where this ship is going."))
    ]};

  /* ============ Up · House Serrin, spire level ninety: the debt is due ============
   * u_up_1 (finish the copy | the page with the most red) → [u_up_1c] → u_up_2 (visitors | the scholar downstairs) → [u_up_2m] → u_up_door (ROAD:
   * noble | dock SUB | Cult SUB [u_up_cult]). Flags: u_up_cult u_up_dig. The governor's tithe is the big red line; the Cult's arrears a second one. */
  N.u_up_1 = {chapter: 1, scene: "hive_spire", speaker: null,
    text: L("尖塔第九十层，赛伦家的账房。老管家抄着总督府的谕令，抄到“尖塔清债”四个字，笔停了很久。\n账本上的红字，比黑字多。",
            "Level ninety of the spire, the counting-room of House Serrin. The old steward copies out the governor's decree, and at the words “the spire clears its debts” his pen stops for a long time.\nThere is more red than black in the ledger."),
    choices: [
      C("接过笔，替他抄完", "Take the pen and finish the copy", "u_up_2"),
      C("翻到红字最多的那一页", "Turn to the page with the most red", "u_up_1c", {effects: {set: {u_up_cult: true}}})
    ]};

  N.u_up_1c = {chapter: 1, scene: "hive_spire", speaker: null,
    text: L("最粗的红线，是总督府的什一税。第二条欠着机械神教：尖塔的电，和账房那台旧计算机的租金。\n你摸了摸耳后的插口：十二岁那年装的，好省下一个书记的工钱。\n老管家低声说，神教的收债人今晚也来。",
            "The thickest red line is the governor's tithe. The second is owed to the Cult of the Machine: the spire's power, and the lease on the counting-room's old cogitator.\nYou touch the socket behind your ear. The house had it fitted when you were twelve, to save a clerk's wages.\nThe old steward murmurs that the Cult's debt-collector is coming tonight too."),
    choices: [C("合上账本，去前厅", "Close the ledger and go to the antechamber", "u_up_2")]};

  N.u_up_2 = {chapter: 1, scene: "hive_spire", speaker: DEACON,
    text: L("前厅来了两位客人。教会的执事称赞你案头的字：“卡尔卡罗斯的缮写室缺人。抄一份存档，原本烧掉。”披旧大衣的船长推来一叠没盖章的货单。\n老管家低声说：楼下有位学者，等了一下午，想借钱。",
            "Two visitors wait in the antechamber. A Church deacon praises the writing on your desk. “The scriptorium on Carcharos is short of copyists. One copy kept, the original burned.” A captain in a worn coat pushes a stack of unsealed manifests across.\nThe old steward murmurs that a scholar downstairs has waited all afternoon to ask the house for money."),
    choices: [
      C("送走客人，回账房", "See them out and go back to the counting-room", "u_up_door"),
      C("下楼，见那位等了一下午的学者", "Go down to the scholar who has waited all afternoon", "u_up_2m", {effects: {set: {u_up_dig: true}}})
    ]};

  N.u_up_2m = {chapter: 1, scene: "hive_spire", speaker: MARROW,
    text: L("楼下的学者起身，自称玛罗教授，要去星区边缘的忒萨零号挖东西，缺个金主。她扫一眼屋子，明白这家没钱，仍把价钱压了又压。\n翻过你的抄页，她说：“我付不起钱，只管饭。”她留下了开船的时间。",
            "The scholar downstairs rises and introduces herself as Professor Marrow. She is digging on Thessa Null at the sector's edge and needs a patron. One glance at the room tells her there is no money here, and she haggles anyway.\nShe leafs through your copied pages. “I can't pay you. I can feed you.” She leaves the sailing time."),
    choices: [C("送她出门，回账房", "See her out and go back to the counting-room", "u_up_door")]};

  /* ROAD of the up class */
  N.u_up_door = {chapter: 1, scene: "hive_spire", speaker: null,
    text: L("夜里，账房只剩你和那方印章。债期到了，家里能交出去的，只有你。\n桌上三样东西：父亲的邀酒帖，教会的荐信，船长的货单。",
            "Night, and the counting-room holds only you and the family seal. The debt is due, and the one thing the house can hand over is you.\nThree things lie on the desk: Father's card inviting you to a drink, the Church's letter of introduction, the captain's manifests."),
    alt: [
      ADD("u_up_cult", "还有第四样：神教收债人的名片，背面压着一个齿轮。", "And a fourth: the Cult debt-collector's card, a cog pressed into its back."),
      ADD("u_up_dig", "账本里夹着教授留下的开船时刻。", "The professor's sailing time is tucked inside the ledger.")
    ],
    choices: [
      D("去书房，陪父亲喝酒", "Go to the study and drink with Father", "imp_o_noble_1", "imperium", "noble",
        L("老管家替你拉开书房的门：“老爷等您一晚上了，次子少爷。”", "The old steward holds the study door open. “The master has waited all evening, young sir. The second-born.”")),
      C("天亮前，带上荐信和货单去码头", "Before dawn, take the letter and manifests to the dock", "u_up_go"),
      C("去前厅，见神教的收债人", "Go to the antechamber: the Cult's collector", "u_up_cult", ONLY("u_up_cult"))
    ]};

  /* SUB: the spire dock (Church packet ship / smugglers / the expedition ship) */
  N.u_up_go = {chapter: 1, scene: "hive_spire", speaker: null,
    text: L("天亮前，尖塔脚下的码头。教会的班船亮着灯，去卡尔卡罗斯；船长那艘没登记的船泊在暗处。\n你摸了摸大衣里的家族印章。",
            "Before dawn at the dock below the spire. The Church's packet ship is lit, bound for Carcharos; the captain's unregistered ship sits in the dark.\nYou touch the family seal inside your coat."),
    alt: [ADD("u_up_dig", "最远的泊位上，玛罗教授的考察船也亮着灯。", "On the farthest berth, Professor Marrow's expedition ship is lit too.")],
    choices: [
      D("登上教会的班船", "Board the Church packet ship", "cha_o_scribe_1", "chaos", "scribe",
        L("你随教会的班船离开奥雷克斯，去卡尔卡罗斯。赛伦家后来再没来过信。", "You leave Aurex on the Church's packet ship, bound for Carcharos. House Serrin never writes again.")),
      D("替船长盖下那一枚章", "Stamp the captain's manifests with the seal", "tau_o_trader_1", "tau", "trader",
        L("船长看着未干的印泥，笑了：“海湾那头，没人认得赛伦这个姓。”", "The captain watches the ink dry and grins. “Across the Gulf, nobody knows the name Serrin.”")),
      D("上玛罗教授的考察船", "Board Professor Marrow's expedition ship", "nec_101", "necrons", "archivist",
        L("教授把素描簿和一盏灯塞给你：“不发工钱，管饭。”", "The professor pushes a sketchbook and a lamp at you. “No wages. Meals.”"), ONLY("u_up_dig"))
    ]};

  /* SUB: the Cult's debt-collector (antechamber, night) */
  N.u_up_cult = {chapter: 1, scene: "hive_spire", speaker: CULT,
    text: L("前厅里，神教收债人把你从头读到脚，像在读一张存货单。“实物抵债，只抵神教的账。”\n他摊开两份合同：格拉维克斯的计数台，十年；或发掘队贤者的书记，前一任死于数据灼伤，合同可转让。",
            "In the antechamber the Cult's debt-collector reads you from head to foot like an inventory sheet. “Payment in kind. It clears the Cult's account only.”\nHe lays out two contracts: the counting floors of Gravex, ten years; or scribe to a magos on a dig, whose last scribe died of data-burn. The contract is transferable."),
    choices: [
      D("把欠款一笔笔背给他听", "Recite the whole debt back to him", "mech_o_savant_1", "mechanicus", "savant",
        L("他的镜头转向你：“可用。格拉维克斯的计数台，十年。”", "His lens turns on you. “Serviceable. The counting floors of Gravex, ten years.”")),
      D("把耳后的插口转给他看", "Turn the socket behind your ear to him", "nec_o_lexmech_1", "necrons", "lexmech",
        L("他用探针碰了碰插口：“兼容。合同还剩二十九年，可以转让。”", "He touches the socket with a probe. “Compatible. Twenty-nine years left on the contract, transferable.”"))
    ]};

  WH.registerUniversal({
    id: "arcosa",
    name: L("阿尔科萨：由选项决定势力", "Arcosa: your choices decide"),
    tagline: L("同一座城，同一个清晨，二十条去路", "One city, one morning, twenty roads out"),
    role: L("奥雷克斯的年轻人", "A young Aurexan"),
    world: L("奥雷克斯二号", "Aurex Secundus"),
    playerSprite: "player_imperium",
    color: "#b8a77a",
    startNode: "u_b01",
    birthNode: "u_b01",
    startDate: {year: 111, mill: 42},     // never shown: `undated` (SPEC §37.11) — the clock starts at the target faction's own startDate at the door
    undated: true,
    startStats: {hp: 100, sanity: 100, corruption: 0, renown: 10},
    renownLabel: L("名声", "Standing"),
    renownIcon: "icon_favor",
    chapters: {1: L("奥雷克斯的清晨", "Morning on Aurex")},
    nodes: N
  });
})();
