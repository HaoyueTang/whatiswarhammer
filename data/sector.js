/* data/sector.js — 阿尔科萨星区 / the Arcosa Sector, and echo templates (text role: continuity). SPEC §27.
 *
 * 1. Codex place `place_arcosa` — the sector on the edge of the Great Rift that ties every route together.
 *    Every route world already has its own place entry (reused, not duplicated):
 *      place_aurex · place_dustfall · place_vessel · place_hesper (imperium)   place_carcharos · place_aldrin (chaos)
 *      place_dalnor (tau)   place_valda (aeldari)   place_thessa_null (necrons)
 * 2. WH.sector — plain lookup of the sector's worlds (name + codex id + routes). New routes may add their own world
 *    from their faction file: `WH.sector.worlds.<id> = {name:{zh,en}, codex:"place_…", routes:["orks"]}`
 *    (sector.js merges, so load order does not matter).
 * 3. WH.echoTemplates — framings for "echoes" (死讯): one overheard line about a past run that ended bad/death.
 *    {id, text:{zh,en}, claim?:true, factions:["*"] | [route ids]}
 *    Placeholders: {role} {world} {cause} {god}.
 *      role  = the past run's origin name (origin.name, else faction.role)
 *      world = origin.world || faction.world (home world)
 *      cause = ending.cause
 *      god   = WH.echoGods[claimedBy] (claim templates only; claim templates do not use {cause})
 *    Use a `claim:true` template when the echo has claimedBy, otherwise a non-claim one.
 *    `factions` works like rumours: ["*"] = any route (incl. future ones), else only on those routes.
 *    Grammar contract (so plain string replacement is enough, no case/article logic needed):
 *      zh — role/world/cause sit after a comma, dash or colon or inside quotes; no pronoun for the dead (那人).
 *      en — {role} and {cause} always start a fragment (after ". ", ": ", "? ", "“" or "..."), never after an
 *           article, so their capital first letter reads right; the dead are "them"/"it", never he/she.
 *    Filled lengths stay ≤ 50 zh chars / ≤ 35 en words with every current route's longest role/world/cause.
 */
(function () {
  var WH = window.WH;
  function L(zh, en) { return {zh: zh, en: en}; }

  /* ---------- codex ---------- */
  WH.registerCodex({
    place_arcosa: {cat: "place", faction: "any", race: "imperium", type: "place", scene: "void",
      name: L("阿尔科萨星区", "The Arcosa Sector"),
      text: L("大裂隙边缘的小星区：巢都、农业星、圣地、死寂之星，还有海湾对岸的钛族殖民地。",
              "A minor sector on the lip of the Great Rift: hive worlds, agri-worlds, a shrine world, a 'dead' world, and a T'au colony across the Gulf."),
      more: L("阿尔科萨在帝国账本上无足轻重：奥雷克斯产兵，赫斯珀和瓦尔达产粮，阿尔德林产朝圣者。大裂隙撕开后，星炬照不到这里，一句求救要念七天。这里死去的人，多半只活在别人的传闻里。",
              "On the Imperium's ledger Arcosa barely registers: Aurex makes soldiers, Hesper and Valda make grain, Aldrin makes pilgrims. Since the Great Rift opened, the Astronomican no longer reaches it, and one call for help takes seven days. Most who die here live on only in other people's rumours."),
      aliases: {zh: ["阿尔科萨星区", "阿尔科萨"], en: ["Arcosa Sector", "Arcosa"]}}
  });

  /* ---------- sector lookup ---------- */
  var S = WH.sector = WH.sector || {};
  S.id = "arcosa";
  S.codex = "place_arcosa";
  S.name = L("阿尔科萨星区", "The Arcosa Sector");
  S.years = "111–115.M42";
  S.worlds = S.worlds || {};
  var W = {
    aurex:       {name: L("奥雷克斯二号", "Aurex Secundus"), codex: "place_aurex",       routes: ["imperium"], kind: "hive world"},
    dustfall:    {name: L("尘落星", "Dustfall"),             codex: "place_dustfall",    routes: ["imperium"], kind: "ork war world"},
    vessel:      {name: L("维瑟尔", "Vessel"),               codex: "place_vessel",      routes: ["imperium"], kind: "garrison city"},
    hesper:      {name: L("赫斯珀", "Hesper"),               codex: "place_hesper",      routes: ["imperium"], kind: "agri-world (burned 112.M42)"},
    carcharos:   {name: L("卡尔卡罗斯", "Carcharos"),         codex: "place_carcharos",   routes: ["chaos"],    kind: "hive world (Hive Vorne)"},
    aldrin:      {name: L("阿尔德林", "Aldrin"),             codex: "place_aldrin",      routes: ["chaos"],    kind: "shrine world (destroyed)"},
    dalnor:      {name: L("达尔诺尔", "Dal'nor"),            codex: "place_dalnor",      routes: ["tau"],      kind: "T'au colony, once New Calder"},
    valda:       {name: L("瓦尔达", "Valda"),                codex: "place_valda",       routes: ["aeldari"],  kind: "agri-world (harvested 113.M42)"},
    thessa_null: {name: L("忒萨零号", "Thessa Null"),         codex: "place_thessa_null", routes: ["necrons"],  kind: "'dead' world / Akhemet tomb world"}
  };
  for (var k in W) if (!S.worlds[k]) S.worlds[k] = W[k];

  /* ---------- echoes (死讯) ---------- */
  WH.echoGods = WH.echoGods || {
    khorne: L("恐虐", "Khorne"), nurgle: L("纳垢", "Nurgle"),
    tzeentch: L("奸奇", "Tzeentch"), slaanesh: L("色孽", "Slaanesh")
  };

  var T = [
    /* ordinary deaths / bad ends */
    {id: "echo_vox", factions: ["*"],
     text: L("一段沃克斯杂音：“……{world}，{role}……{cause}……完毕。”",
             "A burst of vox static: “...{world}... {role}... {cause}... out.”")},
    {id: "echo_casualty_list", factions: ["*"],
     text: L("有人飞快地念着死者名单：“{world}，{role}，{cause}。下一个。”",
             "Someone reads a list of the dead, fast: “{world}. {role}. {cause}. Next.”")},
    {id: "echo_tavern", factions: ["*"],
     text: L("酒馆里有人说起：{world}有个{role}，{cause}。有人举杯：“敬倒霉蛋。”",
             "Bar talk: “That one from {world}? {role}. {cause}.” A glass goes up. “To bad luck.”")},
    {id: "echo_graffiti", factions: ["*"],
     text: L("墙上的炭笔字：{world}，{role}，{cause}。底下有人补了一句：别忘了。",
             "Charcoal on a wall: {world}. {role}. {cause}. Underneath, in another hand: DON'T FORGET.")},
    {id: "echo_sermon", factions: ["imperium", "tau", "aeldari", "necrons"],
     text: L("街角的传教士念着死者：“{world}的{role}，{cause}。帝皇都记得。”",
             "A street preacher recites the dead: “{world}. {role}. {cause}. The Emperor remembers.”")},
    {id: "echo_choir", factions: ["chaos"],
     text: L("诗班的人在烛前数着死者：“{world}的{role}，{cause}。四位看见了。”",
             "By the candles the Choir counts its dead: “{world}. {role}. {cause}. The Four saw it all.”")},
    {id: "echo_xenos", factions: ["tau", "aeldari", "necrons"],
     text: L("异形翻着人类档案：“{world}，{role}，{cause}。你们真擅长这个。”",
             "A xenos leafs through human records. “{world}. {role}. {cause}. Your kind has a talent for this.”")},
    {id: "echo_tau_stats", factions: ["tau"],
     text: L("水族周报：“人类，{world}，{role}。结局：{cause}。已归档。”",
             "The water caste's weekly figures: “Human. {world}. {role}. Outcome: {cause}. File closed.”")},
    {id: "echo_cryptek", factions: ["necrons"],
     text: L("技师的目录：“短命种，{world}，{role}。状态：{cause}。未收藏。”",
             "A cryptek's catalogue line: “Short-lived specimen. {world}. {role}. Status: {cause}. Not collected.”")},
    {id: "echo_seer", factions: ["aeldari"],
     text: L("先知拨开一颗符文石：“{world}的{role}，断了——{cause}。”她没叹气。",
             "A seer turns one rune-stone aside. “{world}. {role}. Thread cut. {cause}.” She does not sigh.")},

    /* claimed by a god (claimedBy set) — no {cause} */
    {id: "echo_claim_whisper", claim: true, factions: ["*"],
     text: L("有人说起{world}：“那个{role}？没死，是被{god}带走的。”说完就不肯再讲。",
             "Someone brings up {world}. “That one? {role}. Didn't die. {god} took them.” And won't say more.")},
    {id: "echo_claim_graffiti", claim: true, factions: ["*"],
     text: L("墙上潦草地写着：{world}，{role}——被{god}收走了。字迹的颜色不太对。",
             "Scrawled on a wall: {world}. {role}. Taken by {god}. The ink is the wrong colour.")},
    {id: "echo_claim_xenos", claim: true, factions: ["tau", "aeldari", "necrons"],
     text: L("异形冷冷地说：“{world}那个{role}？{god}把那人拿走了。你们的灵魂太吵。”",
             "The xenos is cold about it. “The one from {world}? {role}. {god} took it. Your souls are too loud.”")},
    {id: "echo_claim_choir", claim: true, factions: ["chaos"],
     text: L("诗班的人在烛前低语：{world}的{role}，被{god}选中了。语气里全是羡慕。",
             "The Choir whispers before the candles: {world}. {role}. Chosen by {god}. Pure envy in their voices.")}
  ];
  WH.echoTemplates = (WH.echoTemplates || []).concat(T);
})();
