/* i18n.js — UI strings + localisation helpers. Owned by: web.
 * Story text lives in data/** as {zh,en} objects; WH.L(obj) picks the current language with fallback.
 */
(function (root) {
  var WH = root.WH = root.WH || {};

  var S = {
    zh: {
      title_main: "什么是战锤", title_sub: "WHAT IS WARHAMMER?",
      title_tag: "一个普通人，被卷入四万年的黑暗。",
      new_game: "新游戏", cont: "继续", load: "读档", settings: "设置", codex: "图鉴", save: "存档",
      lang_toggle: "EN", lang_name: "中文",
      codex_global: "图鉴收集 {n}/{t}",
      choose_faction: "选择你的命运", back: "返回", start: "开始",
      no_factions: "尚未载入任何阵营数据。", no_factions_hint: "开发者：可用 index.html?sample=1 载入测试数据。",
      load_errors: "部分数据文件缺失或出错：",
      hp: "生命", sanity: "理智", corruption: "腐化",
      date_fmt: "{y}.M{m} · 第{d}日 {h}", date_unknown: "???.M4? · 第??日 ??:??",
      chapter_n: "第{n}章", chapter_card: "第 {n} 章",
      narration: "旁白", you: "你",
      risky: "险", locked: "未解锁",
      req_flag: "需要特定经历", req_notflag: "已因先前的选择而关闭",
      req_min: "需要 {s} ≥ {v}", req_max: "需要 {s} ≤ {v}",
      death_hp: "【伤势过重】眼前一黑……", death_sanity: "【理智崩溃】低语淹没了你……", death_corruption: "【彻底腐化】血肉开始歌唱……",
      to_ending: "【终】", cont_btn: "继续", close: "关闭",
      roll_ok: "成功", roll_fail: "失败",
      time_h: "+{n} 小时", time_d: "+{n} 日", time_y: "+{n} 年", time_warp: "亚空间航行",
      event_tag: "亚空间异象",
      god_khorne: "恐虐", god_nurgle: "纳垢", god_tzeentch: "奸奇", god_slaanesh: "色孽", god_undivided: "混沌不分", god_other: "未知",
      codex_title: "图鉴", codex_progress: "已解锁 {n}/{t}", codex_locked: "???", codex_new: "图鉴更新：{x}",
      cat_all: "全部", cat_leader: "领袖", cat_enemy: "敌人", cat_boss: "首领", cat_god: "混沌诸神", cat_lore: "背景",
      save_title: "存档", load_title: "读档", slot: "存档 {n}", autosave: "自动存档", empty: "— 空 —",
      saved: "已保存到 {x}", loaded: "已读取 {x}", deleted: "已删除", del: "删除", confirm_overwrite: "覆盖这个存档？",
      saved_at: "保存于", play_time: "游戏时长",
      export_json: "导出存档", import_json: "导入存档",
      import_ok: "导入成功", import_bad: "导入失败：{x}", export_none: "当前没有进行中的游戏",
      err_json: "不是有效的 JSON", err_schema: "存档格式不正确", err_faction: "未知阵营 {x}", err_node: "未知节点 {x}", err_newer: "存档来自更新的版本",
      storage_off: "浏览器存储不可用：存档只保留在本次会话中。",
      settings_title: "设置", text_speed: "文字速度", speed_slow: "慢", speed_normal: "中", speed_fast: "快", speed_instant: "瞬间",
      effects: "画面特效", on: "开", off: "关", language: "语言",
      lc_leader: "领袖", lc_enemy: "敌人", lc_boss: "首领", lc_god: "邪神", lc_lore: "设定",
      lore_new: "新知识", lore_skip: "跳过全部", lore_auto_off: "不再自动弹出", lore_cards: "知识卡片", lore_auto: "自动弹出", lore_codex_only: "不弹出",
      lore_new_only: "仅新条目弹出", lore_all: "全部弹出", lore_known: "已收录", lore_known_off: "已收录的不再提示",
      known_hint: "已收录条目提示", hint_toast: "小提示", hint_silent: "静默",
      kw_links: "台词里的条目链接", kw_links_hint: "关掉后，台词里的专有名词不再带虚线（下一段文字起生效）。条目仍会收进图鉴。",
      fam_title: "开始之前", fam_q: "你熟悉战锤40K的设定吗？",
      fam_intro: "游戏会在剧情里弹出「知识卡片」，台词里的专有名词也能点开查看。如果你已经很了解战锤，可以把这些关掉——条目仍会静静收进图鉴。",
      fam_new: "我是新人 · 开启条目", fam_new_d: "遇到新名词弹出知识卡片，台词里的名词可点击查看",
      fam_vet: "我很熟 · 关闭条目", fam_vet_d: "不弹卡片，台词里不加条目链接，只在图鉴里默默收录",
      fam_note: "之后可在 设置 → 知识卡片 / 台词里的条目链接 里改。",
      gods_met_title: "你遇到的邪神", god_not_met: "本局未遇见", gods_watched: "这一路上，注视过你的有：{x}。",
      view_places: "地点", lc_place: "地点", cat_place: "地点", f_all: "全部", f_imperium: "帝国", f_chaos: "混沌", f_tau: "钛", f_any: "通用", f_xenos: "异形",
      view_entries: "条目", view_endings: "结局", view_records: "生涯", records_title: "往生录",
      cause: "死因", survived: "存活时长", first_surv: "首次", best_surv: "最长", times: "×{n}",
      runs_total: "总局数", deaths: "死亡", longest: "最长存活", common_cause: "最常见死因", last_n: "最近 {n} 局",
      clear_records: "清空记录", clear_confirm: "清空全部往生录？（结局收集与图鉴不受影响）", no_runs: "还没有走完的人生。",
      new_record: "新纪录！", unlocked_n: "已解锁 {n}/{t}", gods_short: "邪神", final_short: "终于",
      cause_hp: "伤重不治", cause_sanity: "理智崩溃", cause_corruption: "被混沌吞噬",
      dur_y: "{n}年", dur_d: "{n}天", dur_h: "{n}小时",
      music_vol: "音乐音量", sfx_vol: "音效音量", sound: "声音", mute: "静音", unmute: "取消静音",
      reduced_motion: "系统已开启“减少动态效果”，特效已减弱。",
      ending_good: "结局", ending_bad: "坏结局", ending_death: "死亡", end_art_alt: "结局插图：{x}",
      final_date: "终焉之日", nodes_visited: "经历节点", you_met: "你认识了",
      learn_leaders: "领袖", learn_enemies: "主要敌人", learn_boss: "最终首领",
      codex_completion: "图鉴完成度", again: "再来一次", other_faction: "选择其他阵营", to_title: "返回标题",
      menu: "菜单", quit_confirm: "返回标题？未保存的进度将丢失（自动存档仍在）。",
      missing_node: "剧情数据出错：{x}",
      story_updated: "剧情已更新，已回到本章开头",
      choose_race: "选择势力", choose_origin: "选择出身", origins_n: "{n} 种出身", pick: "选择", back_race: "势力", faction_stat: "阵营数值",
      tip: "提示", claim_tag: "烙印", taint_label: "污染",
      tv_none: "{g}从未留意你。", tv_glance: "{g}曾短暂地看过你一眼。", tv_watch: "{g}在注视你。", tv_brand: "你已被打上{g}的烙印。", tv_claimed: "{g}已经认领了你。", tv_owned: "你已归属于{g}。",
      tw_khorne: ["……血……", "再一次……", "颅骨……为了王座……"], tw_nurgle: ["……别怕，孩子……", "腐烂是温柔的……", "……一切都会再长出来……"],
      tw_tzeentch: ["……这一切都在计划中……", "改变……", "……你早就知道……"], tw_slaanesh: ["……更多……", "……多美啊……", "你值得更好的……"],
      home: "主页", home_aria: "返回主页（H）", home_confirm: "返回主页？进度已自动保存。",
      consequences: "过场提示", cq_you_chose: "你选择了", cq_fatal: "致命",
      rumor_tag: "传闻", rumors: "传闻", rumor_aria: "传闻：{x}",
      gather_tag: "聚集区 · {x}", rumor_hint: "只会在聚集区听到",
      cap_hp: "生命上限", cap_sanity: "理智上限", cap_even: "均衡：上限 100 / 100",
      rewind_set: "允许回到上一个选择", rewind_hint: "开启后：游戏中出现“↶ 回到上一个选择”按钮（快捷键 Z），结局页也可回到最后一个选择。已解锁的内容不会回退；用过回溯的一局不计入“单局挑战”类成就。",
      rewind_btn: "回到上一个选择", rewind_aria: "回到上一个选择（快捷键 Z）", rewind_end: "回到最后一个选择", rewound: "已回到上一个选择", rewinds_title: "回溯 {n} 次",
      music_style: "配乐风格", style_preview: "试听", style_preview_aria: "试听：{x}",
      music_track: "曲目", track_auto: "自动（随剧情）", track_auto_desc: "按剧情自动切换配乐", track_now: "现在播放：{x}", track_preview_now: "试听中：{x}", track_none: "—", track_muted: "（静音中）",
      track_g_calm: "安宁", track_g_tense: "不安", track_g_fight: "交战", track_g_end: "终局", track_g_faction: "势力",
      track_preview_aria: "试听曲目：{x}", preview_muted: "声音已静音：取消静音后才能试听。",
      music_quick: "音乐", music_quick_aria: "音乐：曲目、配乐风格、静音", pop_close_aria: "关闭音乐面板",
      diff_aria: "难度 {n}/3", grudge_aria: "旧怨：{x}", echo_tag: "前世死讯", echoes: "前世死讯", echo_aria: "前世死讯：{x}（打开往生录）",
      ach_title: "成就", ach_progress: "已解锁 {n}/{t}", ach_hidden: "隐藏成就", ach_unlocked: "成就解锁：{x}", ach_many: "解锁了 {n} 个成就", ach_none: "尚无成就数据。",
      upd_toast: "已更新到 v{v} · 存档与记录已保留", data: "数据", data_manage: "备份 / 迁移…", data_title: "数据 · 全部进度",
      data_intro: "进度保存在这个浏览器里，并且跟打开游戏的地址绑定（本地文件、GitHub Pages、Claude 页面各自独立）。用完整备份在它们之间搬家。",
      export_all: "导出全部进度", import_all: "导入全部进度", copy_clip: "复制到剪贴板", copied: "已复制到剪贴板", copy_fail: "无法访问剪贴板——请在下方文本框里全选复制",
      paste_box: "把备份 JSON 粘贴到这里…", import_paste: "导入粘贴内容", import_file: "从文件导入", data_frame: "当前页面可能禁止下载：请用“复制到剪贴板”，在别处用粘贴框导入。",
      import_all_ok: "已合并：新增 {r} 条生涯记录、{c} 个图鉴、{e} 个结局、{s} 个存档", import_skipped: "（{n} 个存档位保留了本地进度）",
      import_overwrite: "备份里有 {n} 个存档位与本机不同。覆盖本机的这些存档吗？（取消 = 只写入空存档位）", err_backup: "不是完整进度备份文件",
      data_keys: "本机共 {n} 项数据",
      tz_joke: "奸奇的玩笑", egg_letter: "一封封着蓝色火漆的信", egg_flame: "蓝色的火苗", egg_k: "改变之主",
      egg_progress: "收集进度 {p}%",
      view_chronicle: "战史", chr_known: "已知 {n}/{t}", chr_tease: "此时，有事发生……", chr_empty: "尚无战史条目。",
      chr_hint: "在传闻与见闻里听到的往事，会按年代记在这里。", chr_mill: "第{n}个千年", lt_chronicle: "战史", chr_ancient: "远古", chr_ancient_sub: "帝国纪年之前",
      race_all: "全部", race_imperium: "帝国", race_chaos: "混沌", race_tau: "钛", race_aeldari: "灵族", race_necrons: "死灵",
      race_orks: "兽人", race_tyranids: "泰伦", race_other: "其他",
      type_all: "全部", type_figure: "人物", type_deity: "神祇", type_organization: "组织", type_unit: "兵种", type_place: "地点", type_concept: "设定",
      cx_search: "搜索名称…", cx_sort: "排序", sort_disc: "发现顺序", sort_az: "A–Z", sort_race: "按势力", cx_new: "NEW", cx_no_match: "没有匹配的已解锁条目。",
      cx_race_progress: "{r} {n}/{t}",
      lt_figure: "人物", lt_deity: "神祇", lt_organization: "组织", lt_unit: "兵种", lt_place: "地点", lt_concept: "设定",
      start_stats: "初始状态",
      disclaimer: "非官方粉丝作品，非商业用途。Warhammer 40,000 是 Games Workshop 的商标。所有文字与像素美术均为原创。",
      whispers: ["……看着你……", "血……", "他在王座上尖叫", "你听见了吗", "改变……", "一切都会腐烂", "更多……更多……", "不要回头", "你的名字是什么？", "门开着"]
    },
    en: {
      title_main: "What is Warhammer?", title_sub: "什么是战锤",
      title_tag: "One ordinary life, swallowed by forty thousand years of darkness.",
      new_game: "New Game", cont: "Continue", load: "Load", settings: "Settings", codex: "Codex", save: "Save",
      lang_toggle: "中", lang_name: "English",
      codex_global: "Codex {n}/{t}",
      choose_faction: "Choose your fate", back: "Back", start: "Begin",
      no_factions: "No faction data loaded yet.", no_factions_hint: "Developers: open index.html?sample=1 for test data.",
      load_errors: "Some data files are missing or broken:",
      hp: "HP", sanity: "Sanity", corruption: "Corruption",
      date_fmt: "{y}.M{m} · Day {d} {h}", date_unknown: "???.M4? · Day ?? ??:??",
      chapter_n: "Chapter {n}", chapter_card: "CHAPTER {n}",
      narration: "Narration", you: "You",
      risky: "Risky", locked: "Locked",
      req_flag: "Requires a past choice", req_notflag: "Closed by an earlier choice",
      req_min: "Requires {s} ≥ {v}", req_max: "Requires {s} ≤ {v}",
      death_hp: "[Wounds] Everything goes dark…", death_sanity: "[Mind breaks] The whispers drown you…", death_corruption: "[Corrupted] Your flesh begins to sing…",
      to_ending: "[ The End ]", cont_btn: "Continue", close: "Close",
      roll_ok: "Success", roll_fail: "Failure",
      time_h: "+{n} h", time_d: "+{n} days", time_y: "+{n} years", time_warp: "Warp transit",
      event_tag: "Warp Omen",
      god_khorne: "Khorne", god_nurgle: "Nurgle", god_tzeentch: "Tzeentch", god_slaanesh: "Slaanesh", god_undivided: "Undivided", god_other: "Unknown",
      codex_title: "Codex", codex_progress: "Unlocked {n}/{t}", codex_locked: "???", codex_new: "Codex: {x}",
      cat_all: "All", cat_leader: "Leaders", cat_enemy: "Enemies", cat_boss: "Bosses", cat_god: "Chaos Gods", cat_lore: "Lore",
      save_title: "Save", load_title: "Load", slot: "Slot {n}", autosave: "Autosave", empty: "— empty —",
      saved: "Saved to {x}", loaded: "Loaded {x}", deleted: "Deleted", del: "Delete", confirm_overwrite: "Overwrite this save?",
      saved_at: "Saved", play_time: "Play time",
      export_json: "Export save", import_json: "Import save",
      import_ok: "Save imported", import_bad: "Import failed: {x}", export_none: "No game in progress",
      err_json: "not valid JSON", err_schema: "not a save file", err_faction: "unknown faction {x}", err_node: "unknown node {x}", err_newer: "save is from a newer version",
      storage_off: "Browser storage unavailable: saves last for this session only.",
      settings_title: "Settings", text_speed: "Text speed", speed_slow: "Slow", speed_normal: "Normal", speed_fast: "Fast", speed_instant: "Instant",
      effects: "Visual effects", on: "On", off: "Off", language: "Language",
      lc_leader: "Leader", lc_enemy: "Enemy", lc_boss: "Boss", lc_god: "Chaos God", lc_lore: "Lore",
      lore_new: "New knowledge", lore_skip: "Skip all", lore_auto_off: "Don't pop up", lore_cards: "Lore cards", lore_auto: "Pop up", lore_codex_only: "Off (codex only)",
      lore_new_only: "New entries only", lore_all: "Every unlock", lore_known: "Already in codex", lore_known_off: "Don't notify known entries",
      known_hint: "Known entries", hint_toast: "Small toast", hint_silent: "Silent",
      kw_links: "Codex links in dialogue", kw_links_hint: "Off: terms in the story text lose their dotted underline (applies from the next text). Entries are still added to the codex.",
      fam_title: "Before you start", fam_q: "How well do you know Warhammer 40,000?",
      fam_intro: "The story pops up “lore cards” and lets you tap terms in the dialogue. If you already know the setting well you can turn these off — entries are still quietly added to your codex.",
      fam_new: "I'm new · entries on", fam_new_d: "Lore cards for new terms; terms in the text are tappable",
      fam_vet: "I know the lore · entries off", fam_vet_d: "No cards, no links in the text; the codex still fills up quietly",
      fam_note: "You can change this later in Settings → Lore cards / Codex links in dialogue.",
      gods_met_title: "Chaos gods you met", god_not_met: "Not met this run", gods_watched: "Along the way, these watched you: {x}.",
      view_places: "Places", lc_place: "Place", cat_place: "Places", f_all: "All", f_imperium: "Imperium", f_chaos: "Chaos", f_tau: "T'au", f_any: "General", f_xenos: "Xenos",
      view_entries: "Entries", view_endings: "Endings", view_records: "Records", records_title: "Service Record",
      cause: "Cause", survived: "Survived", first_surv: "First", best_surv: "Longest", times: "×{n}",
      runs_total: "Runs", deaths: "Deaths", longest: "Longest survival", common_cause: "Most common cause", last_n: "last {n} runs",
      clear_records: "Clear records", clear_confirm: "Clear the whole service record? (Endings collection and codex are kept.)", no_runs: "No life has run its course yet.",
      new_record: "New record!", unlocked_n: "Unlocked {n}/{t}", gods_short: "Gods", final_short: "ended",
      cause_hp: "Succumbed to wounds", cause_sanity: "Mind shattered", cause_corruption: "Consumed by Chaos",
      dur_y: "{n} y", dur_d: "{n} d", dur_h: "{n} h",
      music_vol: "Music volume", sfx_vol: "SFX volume", sound: "Sound", mute: "Mute", unmute: "Unmute",
      reduced_motion: "Your system asks for reduced motion; effects are toned down.",
      ending_good: "Ending", ending_bad: "Bad Ending", ending_death: "Death", end_art_alt: "Ending illustration: {x}",
      final_date: "Final date", nodes_visited: "Moments lived", you_met: "You met",
      learn_leaders: "Leaders", learn_enemies: "Main enemies", learn_boss: "Final boss",
      codex_completion: "Codex completion", again: "Play again", other_faction: "Choose another faction", to_title: "Title screen",
      menu: "Menu", quit_confirm: "Return to title? Unsaved progress is lost (autosave remains).",
      missing_node: "Story data error: {x}",
      story_updated: "Story updated — back to the start of this chapter",
      choose_race: "Choose your faction", choose_origin: "Choose your origin", origins_n: "{n} origins", pick: "Choose", back_race: "Factions", faction_stat: "Faction stat",
      tip: "Tip", claim_tag: "Claimed", taint_label: "Taint",
      tv_none: "{g} never noticed you.", tv_glance: "{g} glanced your way.", tv_watch: "{g} is watching you.", tv_brand: "You bear the brand of {g}.", tv_claimed: "{g} has claimed you.", tv_owned: "You belong to {g} now.",
      tw_khorne: ["…blood…", "again…", "skulls… for the throne…"], tw_nurgle: ["…don't be afraid, child…", "rot is gentle…", "…all things grow back…"],
      tw_tzeentch: ["…all as planned…", "change…", "…you always knew…"], tw_slaanesh: ["…more…", "…how beautiful…", "you deserve better…"],
      home: "Home", home_aria: "Home — return to the title screen (H)", home_confirm: "Return to the title screen? Your progress has been autosaved.",
      consequences: "Consequence beats", cq_you_chose: "You chose", cq_fatal: "Fatal",
      rumor_tag: "Overheard", rumors: "Overheard rumours", rumor_aria: "Overheard: {x}",
      gather_tag: "Crowd · {x}", rumor_hint: "Only heard in crowded places",
      cap_hp: "Max HP", cap_sanity: "Max Sanity", cap_even: "Balanced: caps 100 / 100",
      rewind_set: "Allow going back one choice", rewind_hint: "When on: a “↶ Back one choice” button (hotkey Z) appears in play, and the ending screen can rewind to the last choice. Anything already unlocked stays unlocked; a run that used a rewind does not count for single-run challenge achievements.",
      rewind_btn: "Back one choice", rewind_aria: "Back one choice (hotkey Z)", rewind_end: "Rewind to the last choice", rewound: "Went back one choice", rewinds_title: "{n} rewind(s)",
      music_style: "Music style", style_preview: "Preview", style_preview_aria: "Preview: {x}",
      music_track: "Track", track_auto: "Auto (follows the story)", track_auto_desc: "The music changes with the story", track_now: "Now playing: {x}", track_preview_now: "Previewing: {x}", track_none: "—", track_muted: " (muted)",
      track_g_calm: "Quiet", track_g_tense: "Uneasy", track_g_fight: "Combat", track_g_end: "Endings", track_g_faction: "Factions",
      track_preview_aria: "Preview track: {x}", preview_muted: "Sound is muted: unmute to preview.",
      music_quick: "Music", music_quick_aria: "Music: track, style, mute", pop_close_aria: "Close the music panel",
      diff_aria: "Difficulty {n}/3", grudge_aria: "Grudge: {x}", echo_tag: "A past life", echoes: "Past-life echoes", echo_aria: "Echo of a past life: {x} (opens the Service Record)",
      ach_title: "Achievements", ach_progress: "Unlocked {n}/{t}", ach_hidden: "Hidden achievement", ach_unlocked: "Achievement unlocked: {x}", ach_many: "{n} achievements unlocked", ach_none: "No achievements loaded.",
      upd_toast: "Updated to v{v} · saves and records kept", data: "Data", data_manage: "Backup / move…", data_title: "Data · all progress",
      data_intro: "Progress lives in this browser and is tied to the address the game was opened from (local file, GitHub Pages and the Claude page are separate). Use a full backup to move it.",
      export_all: "Export all progress", import_all: "Import all progress", copy_clip: "Copy to clipboard", copied: "Copied to clipboard", copy_fail: "Clipboard unavailable — select the text below and copy it",
      paste_box: "Paste a backup JSON here…", import_paste: "Import pasted text", import_file: "Import from file", data_frame: "This page may block downloads: use Copy to clipboard, then the paste box elsewhere.",
      import_all_ok: "Merged: {r} run records, {c} codex entries, {e} endings, {s} saves added", import_skipped: " ({n} save slot(s) kept their local progress)",
      import_overwrite: "{n} save slot(s) in the backup differ from this browser. Overwrite them? (Cancel = only fill empty slots)", err_backup: "Not a full-progress backup file",
      data_keys: "{n} stored items in this browser",
      tz_joke: "Tzeentch's joke", egg_letter: "A letter sealed with blue wax", egg_flame: "A blue flame", egg_k: "The Changer of Ways",
      egg_progress: "Collection {p}%",
      view_chronicle: "Chronicle", chr_known: "Known {n}/{t}", chr_tease: "Something happened here…", chr_empty: "No chronicle entries yet.",
      chr_hint: "History you overhear on the way is recorded here, in order.", chr_mill: "{n}th millennium", lt_chronicle: "Chronicle", chr_ancient: "Ancient", chr_ancient_sub: "before Imperial reckoning",
      race_all: "All", race_imperium: "Imperium", race_chaos: "Chaos", race_tau: "T'au", race_aeldari: "Aeldari", race_necrons: "Necrons",
      race_orks: "Orks", race_tyranids: "Tyranids", race_other: "Other",
      type_all: "All", type_figure: "Figures", type_deity: "Deities", type_organization: "Organizations", type_unit: "Units", type_place: "Places", type_concept: "Concepts",
      cx_search: "Search names…", cx_sort: "Sort", sort_disc: "Discovered", sort_az: "A–Z", sort_race: "By faction", cx_new: "NEW", cx_no_match: "No unlocked entry matches.",
      cx_race_progress: "{r} {n}/{t}",
      lt_figure: "Figure", lt_deity: "Deity", lt_organization: "Organization", lt_unit: "Unit", lt_place: "Place", lt_concept: "Concept",
      start_stats: "Starting stats",
      disclaimer: "Unofficial non-commercial fan project. Warhammer 40,000 is a trademark of Games Workshop. All text and pixel art are original.",
      whispers: ["…watching you…", "blood…", "He screams on the Throne", "can you hear it", "change…", "all things rot", "more… more…", "don't look back", "what was your name?", "the door is open"]
    }
  };

  WH.I18N = S;
  WH.lang = WH.lang || "zh";

  WH.t = function (key, vars) {
    var s = (S[WH.lang] && S[WH.lang][key]);
    if (s === undefined) s = S.zh[key];
    if (s === undefined) s = key;
    if (vars && typeof s === "string") s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? vars[k] : m; });
    return s;
  };

  /* pick a {zh,en} object; plain strings pass through */
  WH.L = function (o) {
    if (o === undefined || o === null) return "";
    if (typeof o === "string") return o;
    return o[WH.lang] || o.zh || o.en || "";
  };

  WH.fmtDate = function (parts) {
    return WH.t("date_fmt", {y: parts.yearStr, m: parts.mill, d: parts.day, h: parts.hourStr});
  };

  WH.fmtPlay = function (ms) {
    var s = Math.floor((ms || 0) / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    var mm = ("0" + m).slice(-2), ss = ("0" + sec).slice(-2);
    return h ? h + ":" + mm + ":" + ss : mm + ":" + ss;
  };

  /* in-game duration: "3年 41天 6小时" / "3 y 41 d 6 h" (zero units omitted, hours kept if all zero) */
  WH.fmtDur = function (hours) {
    hours = Math.max(0, Math.round(hours || 0));
    var y = Math.floor(hours / 8760), d = Math.floor((hours % 8760) / 24), h = hours % 24, out = [];
    if (y) out.push(WH.t("dur_y", {n: y}));
    if (d) out.push(WH.t("dur_d", {n: d}));
    if (h || !out.length) out.push(WH.t("dur_h", {n: h}));
    return out.join(" ");
  };

  var ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  WH.chapterNum = function (n) {
    if (WH.lang === "zh") return "一二三四五六七八九十"[n - 1] || String(n);
    return ROMAN[n] || String(n);
  };
})(typeof window !== "undefined" ? window : globalThis);
