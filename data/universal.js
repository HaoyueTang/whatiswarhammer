/* data/universal.js — the universal birth route (SPEC §37, prototype: Imperium / Chaos / T'au) (text role).
 * One shared birth in the Arcosa Sector, three social classes (low / mid / up); each class ends in a "door" node whose 3 choices
 * decide the FACTION (and origin) the run continues in. Stat-neutral: no stat/taint effects, no rolls, no endings, no codex here.
 * Helpers as in the faction files. Node ids u_*, all chapter 1.
 * STRUCTURE FINAL, TEXT = STUB (to be rewritten by the text role; keep ids, choices, effects and `next` exactly as they are).
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

  /* ============ Birth · Aurex Secundus, one morning for everyone ============ */
  N.u_b01 = {chapter: 1, scene: "hive_hab", speaker: null,
    text: L("【占位】奥雷克斯二号，蜂巢城的清晨。警报一响，所有人都醒了。",
            "[stub] Aurex Secundus, a hive city at dawn. The siren sounds and everyone wakes."),
    choices: [C("起身，看看窗外", "Get up and look outside", "u_b02")]};

  N.u_b02 = {chapter: 1, scene: "hive_hab", speaker: null,
    text: L("【占位】你家住在这座城的某一层。你知道自己是谁的孩子。",
            "[stub] Your family lives on one level of this city. You know whose child you are."),
    choices: [C("继续", "Continue", "u_b03")]};

  N.u_b03 = {chapter: 1, scene: "hive_hab", speaker: null,
    text: L("【占位】十六岁。今天要定下你往后的日子。你家是……",
            "[stub] Sixteen. Today decides the rest of your days. Your family is…"),
    choices: [
      C("靠双手和脊背吃饭的人家", "A family that lives by hands and backs", "u_low_1", {effects: {set: {class_low: true}}}),
      C("夹在上下之间的人家", "A family caught in the middle", "u_mid_1", {effects: {set: {class_mid: true}}}),
      C("握着账本和印章的人家", "A family of ledgers and seals", "u_up_1", {effects: {set: {class_up: true}}})
    ]};

  /* ============ Low: hands and backs ============ */
  N.u_low_1 = {chapter: 1, scene: "hive_hab", speaker: null,
    text: L("【占位】下层的一天：轮班、配给、没有尽头的噪音。今晚有人给你指了三条路。",
            "[stub] A day in the lower hive: shifts, rations, endless noise. Tonight someone points out three roads."),
    choices: [C("继续", "Continue", "u_low_door")]};

  N.u_low_door = {chapter: 1, scene: "underhive", speaker: null,
    text: L("【占位】三扇门。选一扇。", "[stub] Three doors. Pick one."),
    choices: [
      D("去应征星界军", "Enlist in the Guard", "imp_101", "imperium", "hive", L("【占位】你在征兵处按了手印。", "[stub] You press your thumb to the recruiter's slate.")),
      D("逃进巢城底层，加入逃兵", "Flee into the underhive with the deserters", "cha_o_deserter_1", "chaos", "deserter", L("【占位】你钻进了排水井。", "[stub] You drop into the drain shaft.")),
      D("跟着白船走", "Follow the white ships", "tau_o_pow_1", "tau", "pow", L("【占位】战俘营的门开了。", "[stub] The gate of the camp opens."))
    ]};

  /* ============ Mid: in between ============ */
  N.u_mid_1 = {chapter: 1, scene: "hive_hab", speaker: null,
    text: L("【占位】中层的一天：不富，也不至于饿死。今晚有人给你指了三条路。",
            "[stub] A day in the middle hive: not rich, not starving. Tonight someone points out three roads."),
    choices: [C("继续", "Continue", "u_mid_door")]};

  N.u_mid_door = {chapter: 1, scene: "hive_hab", speaker: null,
    text: L("【占位】三扇门。选一扇。", "[stub] Three doors. Pick one."),
    choices: [
      D("留在灰烬平原种地，等征粮官", "Stay on the ash plains and farm", "imp_o_agri_1", "imperium", "agri", L("【占位】你回到了田里。", "[stub] You go back to the fields.")),
      D("去废墟里捡东西活命", "Scavenge the ruins to live", "cha_101", "chaos", "scavenger", L("【占位】你背起了口袋。", "[stub] You shoulder the sack.")),
      D("去殖民地做工", "Take work in the colony", "tau_101", "tau", "colonist", L("【占位】你登上了船。", "[stub] You board the ship."))
    ]};

  /* ============ Up: letters and money ============ */
  N.u_up_1 = {chapter: 1, scene: "hive_spire", speaker: null,
    text: L("【占位】尖塔里的一天：账目、礼节、没人说破的事。今晚有人给你指了三条路。",
            "[stub] A day in the spire: ledgers, manners, things nobody says. Tonight someone points out three roads."),
    choices: [C("继续", "Continue", "u_up_door")]};

  N.u_up_door = {chapter: 1, scene: "hive_spire", speaker: null,
    text: L("【占位】三扇门。选一扇。", "[stub] Three doors. Pick one."),
    choices: [
      D("接受家族安排，做个军官", "Take your family's commission", "imp_o_noble_1", "imperium", "noble", L("【占位】你收下了委任状。", "[stub] You take the commission.")),
      D("抄走账本，投奔暗处的人", "Copy the ledgers and go to those in the dark", "cha_o_scribe_1", "chaos", "scribe", L("【占位】你把账本塞进了外套。", "[stub] You slip the ledger into your coat.")),
      D("带着货单去找白船上的人", "Take the manifests to the people of the white ships", "tau_o_trader_1", "tau", "trader", L("【占位】你递出了货单。", "[stub] You hand over the manifests."))
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
    startDate: {year: 111, mill: 42},
    startStats: {hp: 100, sanity: 100, corruption: 0, renown: 10},
    renownLabel: L("名声", "Standing"),
    renownIcon: "icon_favor",
    chapters: {1: L("奥雷克斯的清晨", "Morning on Aurex")},
    nodes: N
  });
})();
