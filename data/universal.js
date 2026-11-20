/* data/universal.js — the universal birth route (SPEC §37, prototype: Imperium / Chaos / T'au) (text role).
 * One shared birth in the Arcosa Sector, three social classes (low / mid / up); each class ends in a "door" node whose 3 choices
 * decide the FACTION (and origin) the run continues in. Stat-neutral: no stat/taint effects, no rolls, no endings, no codex here.
 * Helpers as in the faction files. Node ids u_*, all chapter 1.
 * Text written (text role): the day before Tithe Day on Aurex Secundus; each class ends in a door that is a DEPARTURE, the entry node of the chosen origin carries a `born_universal` alt that bridges place/time.
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
  /* a door choice: switch to <faction>/<origin> and go to that origin's start node */
  function D(zh, en, startNode, faction, origin, res) {
    return C(zh, en, startNode, {effects: {faction: faction, origin: origin, set: {u_door: faction + "/" + origin}}, result: res});
  }

  var N = {};

  /* Cast. Names/spellings are those of the faction files (Grusk = imperium.js); everyone else is an untitled type, so no origin can contradict them. */
  var GRUSK   = S("hive_foreman", "格鲁斯克监工", "Overseer Grusk");
  var VOX     = S("servitor", "广播伺服", "Vox-servitor");
  var RECRUIT = S("guard_sergeant", "征兵中士", "Recruiting Sergeant");
  var VETERAN = S("guardsman", "断腿老兵", "One-legged Veteran");
  var SALVAGE = S("hive_foreman", "拾荒队长", "Salvage Boss");
  var DEACON  = S("preacher", "教会执事", "Church Deacon");

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

  /* ============ Low · Manufactorum Six and the hab-block: the draw is tomorrow ============ */
  N.u_low_1 = {chapter: 1, scene: "manufactorum", speaker: GRUSK,
    text: L("第六工厂的班前点名。格鲁斯克监工把明天的班表撕了，重写一张：“名单念到谁，我就少一个人，配额照旧。今天，加班。”\n没人抱怨。",
            "Pre-shift roll call at Manufactorum Six. Overseer Grusk tears up tomorrow's shift sheet and writes a new one. “Whoever the list names, I lose a hand and the quota stays the same. Overtime today.”\nNobody complains."),
    choices: [C("低头加班，直到收工", "Work the overtime until the whistle", "u_low_2")]};

  N.u_low_2 = {chapter: 1, scene: "hive_hab", speaker: RECRUIT,
    text: L("收工回到居住块，楼梯间摆起了征兵桌。中士拍着桌上的钱袋：“自愿的，自己挑团，赏钱当场发。等抽签的——总督府塞哪算哪。”\n桌前的凳子空着。",
            "Back at the hab-block, a recruiting table stands in the stairwell. The sergeant slaps a pay-pouch on it. “Volunteers pick their regiment, bounty paid on the spot. Wait for the draw, and the governor stuffs you wherever there's room.”\nThe stool in front of the table stays empty."),
    choices: [C("在桌边站到天黑", "Stand by the table till dusk", "u_low_door")]};

  N.u_low_door = {chapter: 1, scene: "hive_hab", speaker: VETERAN,
    text: L("天黑了，征兵桌还没收。断腿老兵吐出一口烟：“线列团经卡尔卡罗斯去尘落星打绿皮，赏钱厚，死得快。驻防团守海湾，赏钱薄，对面的白船只做买卖。”",
            "Dusk, and the recruiting table is still out. A one-legged veteran blows out smoke. “Line regiments go through Carcharos to Dustfall to fight greenskins: fat bounty, quick graves. Garrison regiments watch the Gulf: thin bounty, and the white ships across it only trade.”"),
    choices: [
      D("不签，回家等抽签", "Don't sign; go home and wait for the draw", "imp_101", "imperium", "hive",
        L("你把工牌塞回领口。明天，名单就下来了。", "You tuck your work-tag back into your collar. Tomorrow the names come down.")),
      D("签线列团，领厚赏钱", "Sign for the line regiment and take the fat bounty", "cha_o_deserter_1", "chaos", "deserter",
        L("赏钱沉甸甸的，够家里吃一年。老兵压低声音：“卡尔卡罗斯的污池，没人问你从哪来。”", "The bounty is heavy in your hand: a year of food for the family. The veteran drops his voice. “In the Sump on Carcharos, nobody asks where you're from.”")),
      D("签驻防团，去海湾边守着", "Sign for the garrison and go stand watch on the Gulf", "tau_o_pow_1", "tau", "pow",
        L("赏钱只有一半。中士盖了章：“海湾那边安静，安静得很。”", "The bounty is half as much. The sergeant stamps the slate. “Quiet out on the Gulf. Very quiet.”"))
    ]};

  /* ============ Mid · Dome Farm Seven on the ash plains: the assessor, the salvage crew, the labour ship ============ */
  N.u_mid_1 = {chapter: 1, scene: "jungle", speaker: null,
    text: L("七号穹顶农庄。母亲把今年的麦袋数了三遍；父亲爬上梯子，拿胶带去粘玻璃顶的裂缝。\n广播里那句“灰原补粮”，谁也没提。",
            "Dome Farm Seven. Mother counts this year's grain sacks a third time; Father climbs a ladder to tape the crack in the glass roof.\nNobody mentions the line from the broadcast: “the ash plains give grain.”"),
    choices: [C("扶好梯子，再去灰烬路口", "Steady the ladder, then walk down to the ash road", "u_mid_2")]};

  N.u_mid_2 = {chapter: 1, scene: "ruins", speaker: SALVAGE,
    text: L("灰烬路边停着两拨外人。拾荒队的头儿蹲在废铁堆上，给每个帮忙装车的孩子一块干肉，数得清清楚楚。\n稍远处，招工船的船长举着合同板：“三年约，先发一个月工钱。”大人们远远看着，谁也没动。",
            "Two groups of outsiders have set up beside the ash road. The salvage boss squats on a heap of scrap and hands every kid who helps load his wagon one strip of dried meat, counted out exactly.\nA little way off, a labour-ship captain holds up a contract slate. “Three-year term, first month paid up front.” The grown-ups watch from a distance. Nobody moves."),
    choices: [C("回农庄吃晚饭", "Head home for supper", "u_mid_door")]};

  N.u_mid_door = {chapter: 1, scene: "jungle", speaker: null,
    text: L("傍晚，灰原上起了风。母亲把最后一袋麦子扎紧：税官过几天到，拾荒队明早动身，招工船只等到天黑。\n父亲坐在门槛上，谁也没看。",
            "Evening; the wind rises over the ash plains. Mother ties up the last sack. The assessor comes in a few days, the salvage crew leaves at dawn, the labour ship waits only until dark.\nFather sits on the doorstep and looks at no one."),
    choices: [
      D("留下，等税官上门", "Stay and wait for the assessor", "imp_o_agri_1", "imperium", "agri",
        L("父亲在你碗里多添了一勺，什么也没说。", "Father adds an extra spoonful to your bowl and says nothing.")),
      D("跟拾荒队上灰烬路", "Join the salvage crew on the ash road", "cha_101", "chaos", "scavenger",
        L("队头把一块干肉拍进你手里：“卡尔卡罗斯的下巢，什么废铁都收。”", "The boss slaps a strip of dried meat into your hand. “Down in the Carcharos underhive they buy any scrap.”")),
      D("在招工船的合同上按手印", "Press your thumb to the labour ship's contract", "tau_101", "tau", "colonist",
        L("船长看也没看你的手：“港口卸货，管饭，月结。新卡尔德那边缺人。”", "The captain doesn't even look at your hand. “Dock work, meals included, paid monthly. New Calder is short of hands.”"))
    ]};

  /* ============ Up · House Serrin, spire level ninety: the debt is due ============ */
  N.u_up_1 = {chapter: 1, scene: "hive_spire", speaker: null,
    text: L("尖塔第九十层，赛伦家的账房。老管家抄着总督府的谕令，抄到“尖塔清债”四个字，笔停了很久。\n账本上的红字，比黑字多。",
            "Level ninety of the spire, the counting-room of House Serrin. The old steward copies out the governor's decree, and at the words “the spire clears its debts” his pen stops for a long time.\nThere is more red than black in the ledger."),
    choices: [C("接过笔，替他抄完", "Take the pen and finish the copy", "u_up_2")]};

  N.u_up_2 = {chapter: 1, scene: "hive_spire", speaker: DEACON,
    text: L("前厅里来了两位客人。教会的执事对着灯看你抄的那页：“好字。卡尔卡罗斯的缮写室缺人，规矩是抄一份存档，原本烧掉。”\n另一位披旧大衣的船长，把一叠没盖章的货单推到桌上。",
            "Two visitors wait in the antechamber. A Church deacon holds your page up to the lamp. “Good hand. The scriptorium on Carcharos is short of copyists. Its rule: one copy kept, the original burned.”\nThe other, a captain in a worn coat, pushes a stack of unsealed manifests across the table."),
    choices: [C("送走客人，回账房", "See them out and go back to the counting-room", "u_up_door")]};

  N.u_up_door = {chapter: 1, scene: "hive_spire", speaker: null,
    text: L("夜里，账房只剩你和那方印章。债期到了，家里能交出去的，只有你。\n桌上三样东西：父亲的邀酒帖，教会的荐信，船长的货单。",
            "Night, and the counting-room holds only you and the family seal. The debt is due, and the one thing the house can hand over is you.\nThree things lie on the desk: Father's card inviting you to a drink, the Church's letter of introduction, the captain's manifests."),
    choices: [
      D("去书房，陪父亲喝酒", "Go to the study and drink with Father", "imp_o_noble_1", "imperium", "noble",
        L("老管家替你拉开书房的门：“老爷等您一晚上了，次子少爷。”", "The old steward holds the study door open. “The master has waited all evening, young sir. The second-born.”")),
      D("收下教会的荐信", "Take the Church's letter of introduction", "cha_o_scribe_1", "chaos", "scribe",
        L("你随教会的班船离开奥雷克斯，去卡尔卡罗斯。赛伦家后来再没来过信。", "You leave Aurex on the Church's packet ship, bound for Carcharos. House Serrin never writes again.")),
      D("替船长盖下那一枚章", "Stamp the captain's manifests with the seal", "tau_o_trader_1", "tau", "trader",
        L("船长看着未干的印泥，笑了：“海湾那头，没人认得赛伦这个姓。”", "The captain watches the ink dry and grins. “Across the Gulf, nobody knows the name Serrin.”"))
    ]};

  WH.registerUniversal({
    id: "arcosa",
    name: L("阿尔科萨：由选项决定势力", "Arcosa: your choices decide"),
    tagline: L("同一座城，同一个清晨，三种活法", "One city, one morning, three ways to live"),
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
