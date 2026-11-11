/* data/easter_tzeentch.js — Tzeentch collection easter egg (SPEC §21). Text: lead. */
(function (WH) {
  var L = function (zh, en) { return {zh: zh, en: en}; };
  WH.easter = WH.easter || {};
  WH.easter.tzeentch = {
    sprite: "daemon_tzeentch", sigil: "sigil_tzeentch",
    tiers: [
      { at: 25, id: "whisper",
        text: L("有人在数你翻过的每一页。", "Someone is counting every page you turn.") },
      { at: 50, id: "letter",
        title: L("一封没有署名的信", "An Unsigned Letter"),
        text: L("你收集的每一条，都恰好是我想让你知道的。\n别停下。", "Every entry you collected is exactly what I wanted you to know.\nDon't stop.") },
      { at: 75, id: "flame",
        title: L("蓝色的火", "A Blue Flame"),
        text: L("九条路，八条是我铺的。\n剩下那条——你猜？", "Nine paths. I laid eight of them.\nThe ninth? Guess."),
        choices: [
          { text: L("把信撕了", "Tear up the letter"),
            result: L("纸片在半空重新拼好，字迹换了一种笔法。", "The scraps reassemble mid-air, in a different hand.") },
          { text: L("继续收集", "Keep collecting"),
            result: L("火苗点了点头。你确定它点了头。", "The flame nods. You are sure it nods.") }
        ] },
      { at: 99, id: "last",
        text: L("还差最后一条？\n最后一条，是我。", "One entry left?\nThe last entry is me.") },
      { at: 100, id: "planned",
        title: L("一切，皆如计划", "Just As Planned"),
        text: L("你终于打开了每一扇门。\n可你有没有想过，门是谁画在墙上的？\n\n——一切，皆如计划。",
                "You finally opened every door.\nBut did you ever wonder who painted them on the wall?\n\n— Just as planned.") }
    ]
  };
  WH.registerCodex({
    egg_tzeentch_letter: {
      cat: "lore", race: "chaos", type: "concept", faction: "any", sprite: "sigil_tzeentch", hidden: true,
      name: L("改变之主的回信", "A Reply from the Changer of Ways"),
      text: L("你以为是你在收集图鉴。", "You thought you were the one collecting."),
      more: L("每一个结局、每一处地点、每一条传闻，都被人提前放好了位置。唯一不在计划里的，是你会读到这一行——不，这也在计划里。",
              "Every ending, every place, every rumour was set out for you in advance. The only thing not in the plan was you reading this line — no, that was in the plan too."),
      aliases: {zh: ["奸奇彩蛋"], en: ["Tzeentch egg"]}
    }
  });
})(window.WH);
