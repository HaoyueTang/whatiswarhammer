#!/usr/bin/env python3
"""smoke_test.py — headless browser smoke test (web role).

    python3 tools/dev/smoke_test.py            # sample data (index.html?sample=1)
    python3 tools/dev/smoke_test.py --real     # real data/ + assets/ (skips sample-specific checks)
    options: --chrome /usr/bin/google-chrome   --out tools/dev/screenshots   --headed

Boots index.html via file://, asserts no console errors, plays through: faction select, choices,
a random event, save/load, export/import validation, language switch, codex, settings, an ending,
and a death path; takes desktop (1280x720) and mobile (390x844) screenshots.
"""
import json, os, sys, time, random
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ARGS = sys.argv[1:]
REAL = "--real" in ARGS
def opt(name, default):
    return ARGS[ARGS.index(name) + 1] if name in ARGS and ARGS.index(name) + 1 < len(ARGS) else default
CHROME = opt("--chrome", "/usr/bin/google-chrome")
OUT = os.path.abspath(opt("--out", os.path.join(ROOT, "tools", "dev", "screenshots" + ("_real" if REAL else ""))))
os.makedirs(OUT, exist_ok=True)
BASE = "file://" + os.path.join(ROOT, "index.html")
QS = "" if REAL else "?sample=1"

results, errors = [], []
def check(name, cond, detail=""):
    results.append((name, bool(cond), detail))
    print(("  PASS " if cond else "  FAIL ") + name + (f"  — {detail}" if detail and not cond else ""))

def attach_console(page, tag):
    def on_console(m):
        if m.type in ("error",):
            # missing optional data/asset files under file:// are expected while the team works in parallel
            if REAL is False and ("ERR_FILE_NOT_FOUND" in m.text or "Failed to load resource" in m.text):
                return
            errors.append(f"[{tag}] console.{m.type}: {m.text}")
    page.on("console", on_console)
    page.on("pageerror", lambda e: errors.append(f"[{tag}] pageerror: {e}"))

def shot(page, name):
    p = os.path.join(OUT, name + ".png")
    page.screenshot(path=p)
    return p

def state(page):
    return page.evaluate("() => WH.UI.game ? JSON.parse(JSON.stringify(WH.UI.game.state)) : null")

def finish_text(page, keep_lore=False):
    page.evaluate("() => { WH.UI.cardDone && WH.UI.cardDone(); if (WH.UI.typer.active) WH.UI.typer.finish(); if (WH.UI.evTyper && WH.UI.evTyper.active) WH.UI.evTyper.finish(); }")
    page.wait_for_timeout(120)
    if not keep_lore:
        page.evaluate("() => { WH.UI.closeLore && WH.UI.closeLore(); }")

def dismiss_lore(page):
    page.evaluate("() => { WH.UI.closeLore && WH.UI.closeLore(); }")

def wait_idle(page, ms=200):
    page.wait_for_timeout(ms)
    page.wait_for_function("() => !WH.UI.busy && !WH.UI.cardDone", timeout=8000)

def click_choice(page, idx=None, rng=None):
    """click an enabled choice in the main dialogue (random if idx None). Returns label."""
    finish_text(page)
    btns = page.locator("#choices button:not([disabled])")
    n = btns.count()
    if n == 0:
        return None
    i = idx if idx is not None and idx < n else (rng.randrange(n) if rng else 0)
    label = btns.nth(i).inner_text()
    btns.nth(i).click()
    wait_idle(page)
    return label

def resolve_event(page, pick=0):
    page.wait_for_selector("#event-overlay", timeout=3000)
    finish_text(page)
    page.locator("#event-overlay .choices button").nth(pick).click()
    page.wait_for_timeout(150)
    dismiss_lore(page)
    page.locator("#event-overlay .choice.ending").click()
    wait_idle(page)

def play_until_end(page, rng, max_steps=200, prefer=None):
    for _ in range(max_steps):
        st = state(page)
        if page.locator("#event-overlay").count():
            resolve_event(page, rng.randrange(page.locator("#event-overlay .choices button").count() or 1))
            continue
        if st["ended"]:
            return st
        if click_choice(page, prefer, rng) is None:
            return st
    return state(page)

def run_desktop(p):
    print("\n== desktop 1280x720 ==")
    ctx = p.chromium.launch(executable_path=CHROME, headless="--headed" not in ARGS).new_context(
        viewport={"width": 1280, "height": 720}, locale="zh-CN", accept_downloads=True)
    page = ctx.new_page()
    attach_console(page, "desktop")
    page.goto(BASE + QS + ("&" if QS else "?") + "seed=7")
    page.wait_for_selector("#scr-title .title-main")
    page.evaluate("() => localStorage.clear()")
    page.reload(); page.wait_for_selector("#scr-title .title-main")
    check("boots from file:// with title screen", page.locator("#scr-title .title-main").is_visible())
    # record WH.Audio calls (wraps the real audio.js if present, else a stub) to verify the UI's audio hooks
    page.evaluate("""() => { window.__au = []; const A = WH.Audio || {};
      ['unlock','setMood','moodFor','sfx','setMusicVolume','setSfxVolume','mute'].forEach(k => { const o = A[k];
        A[k] = function () { __au.push(k + ':' + Array.from(arguments).map(x => typeof x === 'object' ? 'obj' : String(x)).join(','));
                             return o ? o.apply(A, arguments) : (k === 'moodFor' ? 'calm' : undefined); }; });
      WH.Audio = A; }""")
    check("default language zh (zh-CN locale)", page.evaluate("WH.lang") == "zh")
    shot(page, "01_title_zh")
    nf = page.evaluate("Object.keys(WH.factions).length")
    check("factions registered", nf > 0, f"{nf}")

    # language toggle on title
    page.locator("#scr-title .corner button:not(.sound-btn)").click(); page.wait_for_timeout(150)
    check("title re-renders in English", "What is Warhammer" in page.locator(".title-main").inner_text())
    shot(page, "02_title_en")
    page.locator("#scr-title .corner button:not(.sound-btn)").click(); page.wait_for_timeout(150)

    # faction select
    page.locator("#scr-title .menu .btn.primary").click(); page.wait_for_timeout(250)
    cards = page.locator(".fcard")
    check("faction cards built from WH.factions", cards.count() == nf, f"{cards.count()} cards")
    shot(page, "03_select")
    cards.first.click()
    page.wait_for_timeout(500)
    check("chapter title card shown", page.locator(".chapter-card").count() == 1)
    shot(page, "04_chapter_card")
    wait_idle(page)
    page.wait_for_timeout(300)
    shot(page, "05_game_typing")
    if not REAL:
        finish_text(page, keep_lore=True); page.wait_for_timeout(400)
        check("lore card pops after typewriter for a first-time codex unlock", page.locator("#lore-overlay .lore-card").is_visible())
        shot(page, "05b_lore_card")
        check("lore cards queue with counter", "1/2" in page.locator("#lore-overlay .lore-count").inner_text())
        page.keyboard.press("Enter"); page.wait_for_timeout(200)
        check("second card is a place with scene banner", page.locator("#lore-overlay .lore-banner").count() == 1)
        shot(page, "05b2_lore_place")
        page.keyboard.press("Enter"); page.wait_for_timeout(150)
        check("Enter dismisses lore card", page.locator("#lore-overlay").count() == 0)
        kw = page.locator("#dlg-text .kw")
        check("keyword link on unlocked codex name", kw.count() >= 1, page.locator("#dlg-text").inner_text())
        kw.first.hover(); page.wait_for_timeout(150)
        shot(page, "05c_keyword_tooltip")
        kw.first.click(); page.wait_for_timeout(200)
        check("keyword click opens lore card", page.locator("#lore-overlay").count() == 1)
        page.keyboard.press("Escape"); page.wait_for_timeout(100)
    finish_text(page)
    st = state(page)
    check("game started at startNode", st and st["nodeId"] == page.evaluate("WH.UI.game.faction.startNode"))
    check("hud date formatted", ".M4" in page.locator("#date").inner_text(), page.locator("#date").inner_text())
    shot(page, "06_game_node1")

    # language switch re-renders current node instantly
    zh_text = page.locator("#dlg-text").inner_text()
    page.locator("#tools button", has_text="EN").click(); page.wait_for_timeout(200)
    en_text = page.locator("#dlg-text").inner_text()
    check("language switch re-renders node text", zh_text != en_text and len(en_text) > 5)
    check("language persisted in settings", json.loads(page.evaluate("localStorage.getItem('whatiswh.settings')"))["lang"] == "en")
    shot(page, "07_game_en")
    page.locator("#tools button", has_text="中").click(); page.wait_for_timeout(200)

    # keyboard: hotkey 1
    before = state(page)["visits"]
    page.keyboard.press("1"); wait_idle(page)
    finish_text(page)
    check("number hotkey chooses", state(page)["visits"] > before or page.locator("#event-overlay").count() > 0)

    if not REAL:
        # deterministic sample walk: smp_002 has locked + roll choices
        page.evaluate("""() => { const g = WH.UI.game; const r = WH.Game.fromRecord(Object.assign(g.toRecord(), {nodeId:'smp_002', flags:{}}), {rng: WH.RNG(1)}); WH.UI.loadRecord(r.toRecord()); }""")
        wait_idle(page); finish_text(page)
        check("locked choice greyed with lock", page.locator("#choices .choice.locked").count() >= 1)
        check("roll choice shows risky %", page.locator("#choices .badge").count() >= 1, page.locator("#choices").inner_text())
        shot(page, "08_locked_and_risky")

        # force an event (sample smp_003 has eventRoll .5) via engine-level hook
        page.evaluate("""() => { const g = WH.UI.game; g.state.seenEvents = []; const step = g._goTo('smp_005', {kind:'node', nodeId:null, choiceDeltas:{}, nodeDeltas:{}, deltas:{}, time:null, chapterChanged:false, codexNew:[], roll:null, death:null, ending:null, event:null});
                         if (step.kind !== 'event') { const e = WH.events[0]; g.state.pendingEvent = e.id; g.state.pendingNext = 'smp_005'; g.state.seenEvents.push(e.id); step.kind='event'; step.event = e; }
                         WH.UI.loadRecord(g.toRecord()); }""")
        page.wait_for_selector("#event-overlay", timeout=3000)
        page.wait_for_timeout(500)
        shot(page, "09_event")
        finish_text(page)
        check("event overlay has 2-3 choices", 2 <= page.locator("#event-overlay .choices button").count() <= 3)
        page.locator("#event-overlay .choices button").first.click(); page.wait_for_timeout(250)
        check("lore card for god codex pops over event result", page.locator("#lore-overlay").count() == 1)
        shot(page, "10a_event_lore_card")
        dismiss_lore(page)
        check("event shows result + continue", page.locator("#event-overlay .event-result").is_visible() and page.locator("#event-overlay .choice.ending").count() == 1)
        shot(page, "10_event_result")
        page.locator("#event-overlay .choice.ending").click(); wait_idle(page)
        check("event continue resumes pending node", state(page)["nodeId"] == "smp_005" and not page.locator("#event-overlay").count())

    # save to slot 1
    finish_text(page)
    snap = state(page)
    page.locator("#tools button", has_text="存档").click(); page.wait_for_timeout(200)
    shot(page, "11_save_modal_empty")
    page.locator(".modal .slot").first.click(); page.wait_for_timeout(250)
    check("slot 1 written", page.evaluate("!!localStorage.getItem('whatiswh.slot1')"))
    shot(page, "12_save_modal_filled")
    page.keyboard.press("Escape"); page.wait_for_timeout(100)
    check("Esc closes modal", page.locator(".modal").count() == 0)

    # advance, then load slot 1 back
    click_choice(page, 0)
    if page.locator("#event-overlay").count(): resolve_event(page)
    page.locator("#tools button", has_text="读档").click(); page.wait_for_timeout(200)
    page.locator(".modal .slot").first.click(); page.wait_for_timeout(300)
    st2 = state(page)
    check("load restores node/stats/hours", st2["nodeId"] == snap["nodeId"] and st2["stats"] == snap["stats"] and st2["hours"] == snap["hours"],
          f"{snap['nodeId']} vs {st2['nodeId']}")

    # export -> import round trip, and invalid import rejected gracefully
    page.locator("#tools button", has_text="存档").click(); page.wait_for_timeout(200)
    with page.expect_download() as dl:
        page.locator(".modal-foot button", has_text="导出").click()
    path = dl.value.path()
    exported = json.load(open(path, encoding="utf-8"))
    check("export JSON has schema/faction/nodeId", exported.get("schema") == 1 and exported.get("nodeId") == snap["nodeId"])
    bad = os.path.join(OUT, "_bad_import.json")
    json.dump({"schema": 1, "faction": "nope", "nodeId": "x", "stats": {}}, open(bad, "w"))
    page.set_input_files("#import-file", bad); page.wait_for_timeout(300)
    check("invalid import rejected with toast", "导入失败" in page.locator(".toasts").inner_text())
    good = os.path.join(OUT, "_good_import.json")
    json.dump(exported, open(good, "w"))
    page.set_input_files("#import-file", good); page.wait_for_timeout(300)
    check("valid import loads game", state(page)["nodeId"] == snap["nodeId"] and page.locator(".modal").count() == 0)
    os.remove(bad); os.remove(good)

    # codex + settings
    page.locator("#tools button", has_text="图鉴").click(); page.wait_for_timeout(200)
    check("codex lists entries incl. locked ???", page.locator(".modal .centry").count() > 0 and page.locator(".modal .centry.locked").count() > 0)
    shot(page, "13_codex")
    check("codex has 4 views", page.locator(".modal .views button").count() == 4)
    page.locator(".modal .views button", has_text="地点").click(); page.wait_for_timeout(200)
    check("places grid with thumbnails", page.locator(".modal .place-tile").count() >= (0 if REAL else 2))
    shot(page, "13b_places")
    if page.locator(".modal .place-tile:not(.locked)").count():
        page.locator(".modal .place-tile:not(.locked)").first.click(); page.wait_for_timeout(200)
        check("place detail opens", page.locator(".modal .place-detail .place-big").count() == 1)
        shot(page, "13c_place_detail")
    page.keyboard.press("Escape")
    page.locator("#tools button", has_text="设置").click(); page.wait_for_timeout(200)
    page.locator(".modal .seg button", has_text="瞬间").click(); page.wait_for_timeout(150)
    page.locator(".modal .seg button", has_text="仅图鉴").click(); page.wait_for_timeout(100)
    check("lore-card setting saved", json.loads(page.evaluate("localStorage.getItem('whatiswh.settings')"))["loreCards"] == "codex")
    page.locator(".modal .seg button", has_text="自动弹出").click(); page.wait_for_timeout(100)
    check("settings text speed saved", json.loads(page.evaluate("localStorage.getItem('whatiswh.settings')"))["textSpeed"] == "instant")
    page.locator("#vol-music").fill("30"); page.locator("#vol-music").dispatch_event("change"); page.wait_for_timeout(100)
    check("music volume slider saved + setMusicVolume", json.loads(page.evaluate("localStorage.getItem('whatiswh.settings')"))["musicVol"] == 30 and "setMusicVolume:0.3" in page.evaluate("window.__au"))
    shot(page, "14_settings")
    page.keyboard.press("Escape")

    # play to an ending
    rng = random.Random(11)
    st = play_until_end(page, rng)
    check("reached an ending", st and st["ended"], st and st["nodeId"])
    finish_text(page)
    shot(page, "15_ending_node")
    if not REAL:
        check("ending node lists watching gods", "注视过你的有" in page.locator("#dlg-text").inner_text())
    page.locator("#choices .choice.ending").click(); page.wait_for_timeout(300)
    check("ending screen shows kind badge + checklist", page.locator("#scr-ending .kind").is_visible() and page.locator("#scr-ending .met .centry").count() > 0)
    check("autosave cleared after ending", not page.evaluate("!!localStorage.getItem('whatiswh.auto')"))
    check("ending shows 4 chaos-god slots", page.locator("#scr-ending .gods .god-card").count() == 4)
    if not REAL:
        check("met god shown unlocked", page.locator("#scr-ending .gods .god-card:not(.locked)").count() >= 1)
    shot(page, "16_ending_screen")
    page.locator("#scr-ending .ending-scroll").evaluate("e => e.scrollTop = e.scrollHeight"); page.wait_for_timeout(100)
    shot(page, "16b_ending_gods")
    page.locator("#scr-ending .corner button:not(.sound-btn)").click(); page.wait_for_timeout(200)
    check("ending screen re-renders in English", "You met" in page.locator("#scr-ending").inner_text())
    shot(page, "17_ending_en")
    page.locator("#scr-ending .corner button:not(.sound-btn)").click(); page.wait_for_timeout(150)

    # death path
    if not REAL:
        page.locator("#scr-ending .ending-btns .btn.primary").click(); page.wait_for_timeout(300)
        wait_idle(page)
        page.evaluate("""() => { const g = WH.UI.game; g.state.stats.sanity = 12; g.state.stats.corruption = 75; WH.UI.loadRecord(Object.assign(g.toRecord(), {nodeId:'smp_006'})); }""")
        wait_idle(page); finish_text(page); page.wait_for_timeout(2400)
        shot(page, "18_low_sanity_corruption_fx")
        check("low sanity + corruption FX classes", page.evaluate("document.getElementById('scr-game').classList.contains('insane') && document.getElementById('scr-game').classList.contains('corrupt')"))
        page.locator("#choices button", has_text="盯着舷窗").click(); wait_idle(page); finish_text(page)
        st = state(page)
        check("stat death jumps to deathNodes.sanity", st["nodeId"] == "smp_death_sanity" and st["ended"], st["nodeId"])
        page.locator("#choices .choice.ending").click(); page.wait_for_timeout(300)
        check("death ending badge", "死亡" in page.locator("#scr-ending .kind").inner_text())
        shot(page, "19_death_ending")
        # hp death through node effects -> forced continue choice
        page.locator("#scr-ending .ending-btns .btn.primary").click(); page.wait_for_timeout(300); wait_idle(page)
        page.evaluate("""() => { const g = WH.UI.game; g.state.stats.hp = 20; WH.UI.loadRecord(Object.assign(g.toRecord(), {nodeId:'smp_006', flags:{}})); }""")
        wait_idle(page); finish_text(page)
        page.locator("#choices button", has_text="闭眼").click(); page.wait_for_timeout(400); wait_idle(page); finish_text(page)
        page.wait_for_timeout(500)
        shot(page, "20_forced_death_choice")
        check("node-effect death shows forced continue", page.locator("#choices .choice.forced").count() == 1)
        page.locator("#choices .choice.forced").click(); wait_idle(page); finish_text(page)
        check("forced continue reaches deathNodes.hp", state(page)["nodeId"] == "smp_death_hp")

    # audio hooks
    calls = page.evaluate("window.__au")
    has = lambda pre: any(c.startswith(pre) for c in calls)
    check("audio: unlock on first gesture", has("unlock"))
    check("audio: title/game moods", has("setMood:title") and has("moodFor:obj") and has("setMood:calm"))
    check("audio: click/start/select/type sfx", all(has("sfx:" + x) for x in ("click", "start", "select", "type")))
    check("audio: save/codex sfx", has("sfx:save") and has("sfx:codex"))
    if not REAL:
        check("audio: event sfx + warp mood", has("sfx:event") and has("setMood:warp"))
        check("audio: damage + death ending", has("sfx:damage") and has("setMood:death") and has("sfx:death"))
    page.evaluate("() => WH.UI.show('title')"); page.wait_for_timeout(150)
    page.locator("#scr-title .sound-btn").click(); page.wait_for_timeout(100)
    check("mute toggle persisted + WH.Audio.mute(true)", json.loads(page.evaluate("localStorage.getItem('whatiswh.settings')"))["muted"] is True and "mute:true" in page.evaluate("window.__au"))
    page.locator("#scr-title .sound-btn").click(); page.wait_for_timeout(100)

    # run records: ending fate row, records + endings views, dedupe, clear
    page.evaluate("() => WH.UI.game.state.ended || null")
    if page.evaluate("WH.UI.screen") != "ending":
        page.evaluate("() => WH.UI.game.state.ended && WH.UI.showEnding()")
    page.wait_for_timeout(200)
    check("ending shows survival time", page.locator("#scr-ending .ending-fate").is_visible() and "存活" in page.locator("#scr-ending .ending-fate").inner_text())
    if not REAL:
        check("death ending shows cause", page.locator("#scr-ending .ending-fate .cause").count() == 1)
    shot(page, "21_ending_fate")
    n_runs = page.evaluate("WH.Save.runs().length")
    check("finished runs recorded", n_runs >= (3 if not REAL else 1), f"{n_runs}")
    page.evaluate("() => { WH.UI.lastRun = null; WH.UI.show('title'); WH.UI.showEnding(); }"); page.wait_for_timeout(200)
    check("re-showing the same ending doesn't double count", page.evaluate("WH.Save.runs().length") == n_runs)
    page.evaluate("() => WH.UI.show('title')"); page.wait_for_timeout(200)
    page.locator("#scr-title .menu button", has_text="图鉴").click(); page.wait_for_timeout(200)
    page.locator(".modal .views button", has_text="结局").click(); page.wait_for_timeout(200)
    check("endings view: reached tiles with counts", page.locator(".modal .end-tile:not(.locked)").count() >= 1)
    shot(page, "22_codex_endings")
    page.locator(".modal .views button", has_text="生涯").click(); page.wait_for_timeout(200)
    check("records view lists runs + summary", page.locator(".modal .run-row").count() == n_runs and page.locator(".modal .rec-sum").count() == 1)
    shot(page, "23_codex_records")
    page.locator(".modal-foot button", has_text="清空记录").click(); page.wait_for_timeout(150)
    page.locator(".modal-foot .btn.primary").click(); page.wait_for_timeout(200)
    check("clear records via in-UI confirm", page.evaluate("WH.Save.runs().length") == 0 and page.locator(".modal .run-row").count() == 0)
    check("ending collection survives clearing", len(page.evaluate("Object.keys(WH.Save.endingStats())")) >= 1)
    page.keyboard.press("Escape")

    # continue button on title uses latest save
    page.evaluate("() => WH.UI.show('title')"); page.wait_for_timeout(200)
    check("continue enabled when a save exists", page.locator("#scr-title .menu button").nth(1).is_enabled())
    ctx.close()

def run_mobile(p):
    print("\n== mobile 390x844 ==")
    ctx = p.chromium.launch(executable_path=CHROME, headless=True).new_context(
        viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True, locale="zh-CN")
    page = ctx.new_page()
    attach_console(page, "mobile")
    page.goto(BASE + QS + ("&" if QS else "?") + "seed=5")
    page.wait_for_selector("#scr-title .title-main")
    page.evaluate("() => localStorage.clear()")
    check("portrait layout active", page.evaluate("document.body.classList.contains('portrait')"))
    shot(page, "m01_title")
    page.locator("#scr-title .menu .btn.primary").tap(); page.wait_for_timeout(250)
    shot(page, "m02_select")
    page.locator(".fcard").first.tap(); page.wait_for_timeout(300)
    wait_idle(page); finish_text(page); page.wait_for_timeout(300)
    shot(page, "m03_game")
    dh = page.evaluate("document.getElementById('dialogue').offsetHeight")
    check("mobile dialogue fits content", dh < 520, f"{dh}px")
    w = page.evaluate("document.documentElement.scrollWidth")
    check("no horizontal overflow on phone", w <= 391, f"scrollWidth {w}")
    rng = random.Random(3)
    for _ in range(3):
        click_choice(page, None, rng)
        if page.locator("#event-overlay").count():
            page.wait_for_timeout(300); finish_text(page)
            shot(page, "m04_event")
            resolve_event(page)
    finish_text(page); page.wait_for_timeout(300)
    shot(page, "m05_game_later")
    page.locator("#tools button", has_text="图鉴").tap(); page.wait_for_timeout(200)
    shot(page, "m06_codex")
    page.keyboard.press("Escape")
    st = play_until_end(page, rng)
    if st and st["ended"]:
        page.locator("#choices .choice.ending").tap(); page.wait_for_timeout(300)
        shot(page, "m07_ending")
        page.evaluate("() => WH.UI.openCodex(null, false, 'records')"); page.wait_for_timeout(200)
        shot(page, "m08_records")
        page.keyboard.press("Escape")
        check("mobile ending screen", page.locator("#scr-ending .kind").is_visible())
    ctx.close()

def run_no_storage(p):
    print("\n== storage disabled + reduced motion ==")
    ctx = p.chromium.launch(executable_path=CHROME, headless=True).new_context(viewport={"width": 1280, "height": 720}, reduced_motion="reduce")
    ctx.add_init_script("Object.defineProperty(window, 'localStorage', {get(){ throw new Error('blocked'); }});")
    page = ctx.new_page()
    attach_console(page, "nostorage")
    page.goto(BASE + QS)
    page.wait_for_selector("#scr-title .title-main")
    check("boots without localStorage (memory fallback)", page.evaluate("WH.Save.isPersistent()") is False)
    check("reduced motion turns FX off", page.evaluate("document.getElementById('stage').classList.contains('fx-off')"))
    page.locator("#scr-title .menu .btn.primary").click(); page.wait_for_timeout(200)
    page.locator(".fcard").first.click(); page.wait_for_timeout(1600); wait_idle(page)
    click_choice(page, 0)
    page.locator("#tools button").nth(1).click(); page.wait_for_timeout(150)
    page.locator(".modal .slot").first.click(); page.wait_for_timeout(150)
    check("in-memory save works", page.evaluate("!!WH.Save.read('slot1')"))
    ctx.close()

with sync_playwright() as p:
    t0 = time.time()
    run_desktop(p)
    run_mobile(p)
    run_no_storage(p)
    fails = [r for r in results if not r[1]]
    print(f"\nconsole/page errors: {len(errors)}")
    for e in errors: print("  " + e)
    print(f"\n{len(results) - len(fails)}/{len(results)} checks passed, {len(errors)} console errors · {time.time() - t0:.1f}s · screenshots in {OUT}")
    sys.exit(1 if fails or errors else 0)
