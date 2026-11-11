#!/usr/bin/env python3
"""smoke_test.py — headless browser smoke test (web role).

    python3 tools/dev/smoke_test.py            # sample data (index.html?sample=1)
    python3 tools/dev/smoke_test.py --real     # real data/ + assets/ (skips sample-specific checks)
    options: --chrome /usr/bin/google-chrome   --out tools/dev/screenshots   --headed

Boots index.html via file://, asserts no console errors, plays through: race → origin select, choices with
consequence beats, a random event, save/load, export/import validation, language switch, codex v2 (race chips,
type tabs, search, sort, NEW badges), settings, lore-card modes, ⌂ Home, an ending, a death path, a 5-faction select
(desktop + mobile) and — with --real — any new route whose data exists; takes desktop (1280x720) and mobile
(390x844) screenshots.
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
    page.evaluate("""() => { const U = WH.UI; U.cardDone && U.cardDone(); if (U.typer.active) U.typer.finish();
      if (U.evTyper && U.evTyper.active) U.evTyper.finish();
      if (U.event && U.event.cq && U.event.cq.typer.active) U.event.cq.typer.finish();
      if (U.conseq && U.conseq.block && U.conseq.block.typer.active) U.conseq.block.typer.finish(); }""")
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
    page.wait_for_timeout(60)
    pass_conseq(page)
    wait_idle(page)
    return label

def pass_conseq(page):
    """if a consequence beat is open, finish its text and press Continue. Returns True if one was shown."""
    if not page.evaluate("!!WH.UI.conseq"):
        return False
    finish_text(page)
    page.locator("#conseq .cq-go").click()
    page.wait_for_timeout(60)
    return True

def pick_faction(page, fid=None, origin=0, tap=False):
    """race step → (origin step) → game. fid None = first card."""
    card = page.locator(f'.fcard[data-faction="{fid}"]') if fid else page.locator(".fcard").first
    (card.tap if tap else card.click)()
    page.wait_for_timeout(250)
    if page.locator(".ocard").count():
        oc = page.locator(".ocard").nth(origin) if isinstance(origin, int) else page.locator(f'.ocard[data-origin="{origin}"]')
        (oc.tap if tap else oc.click)()
        page.wait_for_timeout(250)

def resolve_event(page, pick=0):
    page.wait_for_selector("#event-overlay", timeout=3000)
    finish_text(page)
    btns = page.locator("#event-overlay .choices button:not([disabled])")
    btns.nth(min(pick, max(0, btns.count() - 1))).click()
    page.wait_for_timeout(100)
    finish_text(page)
    page.wait_for_timeout(60)
    dismiss_lore(page)
    page.locator("#event-overlay .choice.ending").click()
    wait_idle(page)

def play_until_end(page, rng, max_steps=200, prefer=None):
    for _ in range(max_steps):
        st = state(page)
        if page.locator("#event-overlay").count():
            resolve_event(page, rng.randrange(page.locator("#event-overlay .choices button:not([disabled])").count() or 1))
            continue
        if pass_conseq(page):
            wait_idle(page)
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
    check("race cards built from WH.factions", cards.count() == nf, f"{cards.count()} cards")
    shot(page, "03_select")
    n_or = page.evaluate("WH.Game.origins(WH.factions[document.querySelector('.fcard').dataset.faction]).length")
    if not REAL:
        check("sample faction declares 3 origins", n_or == 3, f"{n_or}")
    if n_or > 1:
        cards.first.click(); page.wait_for_timeout(250)
        check("origin step: one card per origin with 4 stat bars", page.locator(".ocard").count() == n_or and page.locator(".ocard").first.locator(".orow").count() == 4)
        check("origin cards show stat deltas vs default", page.locator(".ocard .od.up, .ocard .od.down").count() >= 1)
        if not REAL:
            tr = page.locator('.ocard[data-origin="scav"] .otrade').inner_text()
            check("§23: origin card shows the trade-off (生命上限 125 ▲ · 理智上限 85 ▼)", "生命上限 125 ▲" in tr and "理智上限 85 ▼" in tr, tr)
            check("§23: default origin card reads balanced", "均衡" in page.locator('.ocard[data-origin="hive"] .otrade').inner_text())
        else:
            check("§23: every origin card has a trade-off line", page.locator(".ocard .otrade").count() == n_or)
            shot(page, "05b_origin_tradeoffs")
        shot(page, "03b_origins")
        page.locator(".back-race").click(); page.wait_for_timeout(150)
        check("back button returns to race step", page.locator(".fcard").count() == nf and page.locator(".ocard").count() == 0)
        cards.first.click(); page.wait_for_timeout(200)
        page.keyboard.press("Escape"); page.wait_for_timeout(150)
        check("Esc on origin step returns to races", page.locator(".fcard").count() == nf)
        page.locator("#scr-select .corner button:not(.sound-btn)").last.click(); page.wait_for_timeout(150)
        cards.first.click(); page.wait_for_timeout(200)
        check("origin step re-renders in English", "Choose your origin" in page.locator("#scr-select h2").inner_text())
        page.locator("#scr-select .corner button:not(.sound-btn)").last.click(); page.wait_for_timeout(150)
        check("language switch keeps the origin step", page.locator(".ocard").count() == n_or)
        page.locator(".ocard").first.click()
    else:
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
        page.locator("#event-overlay .choices button").first.click(); page.wait_for_timeout(150)
        check("event result uses the consequence panel (pick + typewriter)", page.locator("#event-overlay .conseq .cq-pick").count() == 1)
        finish_text(page, keep_lore=True); page.wait_for_timeout(150)
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
    check("export JSON has schema 2 + faction/nodeId/origin/taint", exported.get("schema") == 2 and exported.get("nodeId") == snap["nodeId"]
          and "origin" in exported and set(exported.get("taint", {}).keys()) == {"khorne", "nurgle", "tzeentch", "slaanesh"})
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
    check("codex has 5 views (incl. 战史)", page.locator(".modal .views button").count() == 5)
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
    page.locator(".modal .seg button", has_text="不弹出").click(); page.wait_for_timeout(100)
    check("lore-card setting saved (3 modes)", json.loads(page.evaluate("localStorage.getItem('whatiswh.settings')"))["loreCards"] == "codex"
          and page.locator(".modal .seg button", has_text="全部弹出").count() == 1)
    page.locator(".modal .seg button", has_text="仅新条目弹出").click(); page.wait_for_timeout(100)
    check("known-entry hint toggle + consequence toggle present", page.locator(".modal .seg button", has_text="静默").count() == 1
          and page.locator(".modal .setrow", has_text="过场提示").count() == 1)
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
        page.evaluate("() => localStorage.removeItem('whatiswh.tipsSeen')")   # earlier random play may already have died once
        page.evaluate("""() => { const g = WH.UI.game; g.state.stats.sanity = 12; g.state.stats.corruption = 75; WH.UI.loadRecord(Object.assign(g.toRecord(), {nodeId:'smp_006'})); }""")
        wait_idle(page); finish_text(page); page.wait_for_timeout(2400)
        shot(page, "18_low_sanity_corruption_fx")
        check("low sanity + corruption FX classes", page.evaluate("document.getElementById('scr-game').classList.contains('insane') && document.getElementById('scr-game').classList.contains('corrupt')"))
        page.locator("#choices button", has_text="盯着舷窗").click(); page.wait_for_timeout(150); finish_text(page)
        check("choice death shows the consequence first (fatal line)", page.locator("#conseq .cq-death").count() == 1 and page.locator("#conseq .cq-text").inner_text().strip() != "")
        check("node text stays on the previous node during the beat", "舷窗" in page.locator("#dlg-text").inner_text())
        shot(page, "18b_fatal_consequence")
        page.keyboard.press("Enter"); wait_idle(page); finish_text(page)
        st = state(page)
        check("stat death jumps to deathNodes.sanity", st["nodeId"] == "smp_death_sanity" and st["ended"] and "低语" in page.locator("#dlg-text").inner_text(), st["nodeId"])
        page.locator("#choices .choice.ending").click(); page.wait_for_timeout(300)
        check("death ending badge", "死亡" in page.locator("#scr-ending .kind").inner_text())
        check("first death on a faction shows the faction-stat Tip card", page.locator("#scr-ending .tip-card").count() == 1 and "信仰" in page.locator("#scr-ending .tip-card").inner_text())
        check("tip persisted per faction", page.evaluate("WH.Save.tipSeen('sample')"))
        check("ending reveals hidden taint bars + verdicts", page.locator("#scr-ending .taint-rev").count() == 4 and page.locator("#scr-ending .tverdict").first.inner_text().strip() != "")
        shot(page, "19_death_ending")
        # hp death through node effects -> forced continue choice
        page.locator("#scr-ending .ending-btns .btn.primary").click(); page.wait_for_timeout(300); wait_idle(page)
        page.evaluate("""() => { const g = WH.UI.game; g.state.stats.hp = 20; WH.UI.loadRecord(Object.assign(g.toRecord(), {nodeId:'smp_006', flags:{}})); }""")
        wait_idle(page); finish_text(page)
        page.locator("#choices button", has_text="闭眼").click(); page.wait_for_timeout(200)
        check("effects without result → automatic summary line", page.locator("#conseq .cq-deltas.big").count() == 1
              and page.locator("#conseq .cq-text").is_hidden() and "信仰" in page.locator("#conseq .cq-deltas").inner_text())
        shot(page, "20a_auto_summary")
        pass_conseq(page); wait_idle(page); finish_text(page)
        page.wait_for_timeout(500)
        shot(page, "20_forced_death_choice")
        check("node-effect death shows forced continue", page.locator("#choices .choice.forced").count() == 1)
        page.locator("#choices .choice.forced").click(); wait_idle(page); finish_text(page)
        check("forced continue reaches deathNodes.hp", state(page)["nodeId"] == "smp_death_hp")
        page.locator("#choices .choice.ending").click(); page.wait_for_timeout(300)
        check("Tip card only on the first death per faction", page.locator("#scr-ending .tip-card").count() == 0)

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
    pick_faction(page, None, 0, tap=True)
    wait_idle(page); finish_text(page); page.wait_for_timeout(300)
    shot(page, "m03_game")
    check("mobile: ⌂ Home button visible", page.locator("#tools .home-btn").is_visible())
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
    pick_faction(page); page.wait_for_timeout(1600); wait_idle(page)
    click_choice(page, 0)
    page.locator("#tools button").nth(1).click(); page.wait_for_timeout(150)
    page.locator(".modal .slot").first.click(); page.wait_for_timeout(150)
    check("in-memory save works", page.evaluate("!!WH.Save.read('slot1')"))
    ctx.close()

def new_ctx(p, mobile=False, seed=7, tag="v02", extra=""):
    b = p.chromium.launch(executable_path=CHROME, headless="--headed" not in ARGS)
    if mobile:
        ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True, locale="zh-CN")
    else:
        ctx = b.new_context(viewport={"width": 1280, "height": 720}, locale="zh-CN")
    page = ctx.new_page()
    attach_console(page, tag)
    page.goto(BASE + QS + ("&" if QS else "?") + f"seed={seed}" + extra)
    page.wait_for_selector("#scr-title .title-main")
    page.evaluate("() => localStorage.clear()")
    page.reload(); page.wait_for_selector("#scr-title .title-main")
    return b, ctx, page

def goto_node(page, node, **extra):
    """reload the current game at `node` (engine-level), keeping origin/taint unless overridden"""
    page.evaluate("""([n, x]) => { const g = WH.UI.game; WH.UI.loadRecord(Object.assign(g.toRecord(), {nodeId: n, pendingEvent: null, pendingNext: null, eventChoice: null, rumor: null}, x)); }""", [node, extra])
    page.wait_for_timeout(120); finish_text(page)

def run_v02(p):
    """v0.2 features on sample data: origins, consequence beats, Home, codex v2 + NEW, lore modes, hidden taint, stat tip."""
    print("\n== v0.2 features (sample) ==")
    b, ctx, page = new_ctx(p, tag="v02")
    page.evaluate("() => { WH.UI.settings.loreCards = 'codex'; WH.Save.saveSettings(WH.UI.settings); }")
    page.locator("#scr-title .menu .btn.primary").click(); page.wait_for_timeout(200)
    pick_faction(page, "sample", "scav")
    wait_idle(page); finish_text(page)
    st = state(page)
    check("origin: scavenger starts at its prologue with its own stats + flag", st["nodeId"] == "smp_o_scav_1" and st["origin"] == "scav"
          and st["stats"] == {"hp": 115, "sanity": 85, "corruption": 10, "renown": 10} and st["flags"].get("origin_scav") is True, str(st and st["stats"]))
    check("§23: run caps from the origin (max hp 125 / sanity 85), HUD shows value/cap", st.get("max") == {"hp": 125, "sanity": 85}
          and page.locator("#sm-hp").inner_text() == "/125" and page.locator("#sm-sanity").inner_text() == "/85")
    check("origin sprite used for the player portrait", page.evaluate("WH.UI.actorKeys.left") == "player_chaos")
    # --- consequence beat with result ---
    page.locator("#choices button", has_text="拿去换水").click(); page.wait_for_timeout(120)
    check("consequence panel opens after a choice with result", page.locator("#conseq").count() == 1 and page.locator("#choices").is_hidden())
    page.keyboard.press("1"); page.wait_for_timeout(80)
    check("number hotkey does not skip the beat", page.locator("#conseq").count() == 1)
    finish_text(page)
    check("panel shows pick + result + delta line", "拿去换水" in page.locator("#conseq .cq-pick").inner_text()
          and "锈色" in page.locator("#conseq .cq-text").inner_text() and "生命" in page.locator("#conseq .cq-deltas").inner_text())
    check("HUD shows post-choice stats during the beat", page.locator("#sv-hp").inner_text() == "120", page.locator("#sv-hp").inner_text())
    check("§23: bar scales to the cap (120/125 = 96%)", abs(page.evaluate("parseFloat(document.querySelector('#sb-hp i').style.width)") - 96) < 0.5)
    check("§23: engine clamps hp to the run cap, not 100", page.evaluate("(() => { const g = WH.Game.fromRecord(WH.UI.game.toRecord()); g._applyEffects({hp: 50, sanity: 50}); return [g.state.stats.hp, g.state.stats.sanity]; })()") == [125, 85])
    check("time skip shown in the beat when the next node has time", page.locator("#conseq .cq-time").count() == 1)
    shot(page, "30_consequence")
    page.locator("#tools button", has_text="EN").click(); page.wait_for_timeout(200)
    check("language switch re-renders the beat + previous node", "rust" in page.locator("#conseq .cq-text").inner_text()
          and "scrap" in page.locator("#dlg-text").inner_text().lower())
    shot(page, "30b_consequence_en")
    page.locator("#tools button", has_text="中").click(); page.wait_for_timeout(200)
    page.keyboard.press("Enter"); wait_idle(page); finish_text(page)
    check("Enter continues to the next node", state(page)["nodeId"] == "smp_o_scav_2" and page.locator("#conseq").count() == 0)
    page.locator("#choices button").first.click(); page.wait_for_timeout(120)
    check("choice without effects/result → no beat", page.locator("#conseq").count() == 0)
    wait_idle(page); finish_text(page)
    # --- roll beat ---
    goto_node(page, "smp_002")
    page.locator("#choices button", has_text="偷工减料").click(); page.wait_for_timeout(120); finish_text(page)
    check("roll beat shows outcome % + rollResult text", page.locator("#conseq .cq-roll").count() == 1 and "%" in page.locator("#conseq .cq-roll").inner_text()
          and page.locator("#conseq .cq-text").inner_text().strip() != "")
    shot(page, "31_roll_consequence")
    page.locator("#dialogue").click(position={"x": 30, "y": 30}); wait_idle(page)
    check("click on the dialogue continues", page.locator("#conseq").count() == 0)
    if page.locator("#event-overlay").count(): resolve_event(page)
    check("engine: flags alone → nothing to show", page.evaluate("WH.Rules.consequenceOf({effects:{set:{x:true}}}, {choiceDeltas:{}}).show") is False)
    check("engine: taint never appears in visible deltas", page.evaluate(
        "(() => { const g = WH.UI.game; const d = g._applyEffects({taint:{nurgle:5}, hp:-1}, {}); return Object.keys(d).join(); })()") == "hp")
    # --- setting off ---
    page.evaluate("() => { WH.UI.settings.consequences = false; }")
    goto_node(page, "smp_002")
    page.locator("#choices button", has_text="拼命干活").click(); page.wait_for_timeout(120)
    check("过场提示 off → no beat, straight to the next node", page.locator("#conseq").count() == 0)
    wait_idle(page); finish_text(page)
    page.evaluate("() => { WH.UI.settings.consequences = true; }")
    if page.locator("#event-overlay").count(): resolve_event(page)
    # --- Home button ---
    finish_text(page)
    node_before = state(page)["nodeId"]
    check("Home button labelled ⌂ 主页 in the toolbar", page.locator("#tools .home-btn").inner_text().strip().endswith("主页"))
    page.locator("#tools .home-btn").click(); page.wait_for_timeout(200)
    check("Home autosaves before asking", page.evaluate("JSON.parse(localStorage.getItem('whatiswh.auto')||'{}').nodeId") == node_before)
    check("Home confirm text", "进度已自动保存" in page.locator(".modal .confirm-msg").inner_text())
    shot(page, "32_home_confirm")
    page.locator(".modal-foot .btn.primary").click(); page.wait_for_timeout(250)
    check("Home → title screen", page.evaluate("WH.UI.screen") == "title")
    page.locator("#scr-title .menu button").nth(1).click(); page.wait_for_timeout(300); finish_text(page)
    check("Continue resumes the autosaved node + origin", state(page)["nodeId"] == node_before and state(page)["origin"] == "scav")
    page.keyboard.press("h"); page.wait_for_timeout(150)
    check("H opens the Home confirm", page.locator(".modal .confirm-msg").count() == 1)
    page.keyboard.press("Escape"); page.wait_for_timeout(100)
    check("Esc cancels Home", page.evaluate("WH.UI.screen") == "game" and page.locator(".modal").count() == 0)
    page.locator("#tools button", has_text="设置").click(); page.wait_for_timeout(150)
    page.keyboard.press("h"); page.wait_for_timeout(100)
    check("H ignored while a modal is open", page.locator(".modal .confirm-msg").count() == 0)
    page.keyboard.press("Escape"); page.wait_for_timeout(100)
    # --- hidden taint: tells + gated choice + claim event ---
    page.evaluate("() => { WH.UI.game.state.taint.khorne = 60; }")
    goto_node(page, "smp_008")
    check("taint ≥50: vignette tell, no number in the HUD", page.evaluate("document.getElementById('scr-game').getAttribute('data-taint')") == "khorne"
          and "60" not in page.locator("#hud").inner_text())
    check("taint-gated hidden choice appears", page.locator("#choices button", has_text="链锯剑").count() == 1)
    # --- SPEC §19: taintMod, claim → accept (goto ending) / resist (continue) / second claim (forced) ---
    check("taintMod scales positive taint only (×1.5 / ×0.5, cleanse unscaled, Math.round)", page.evaluate(
        "(() => { const g = new WH.Game('sample'); g.start('hive'); g._applyTaint({tzeentch:10, slaanesh:10}); const a = [g.state.taint.tzeentch, g.state.taint.slaanesh];"
        " g._applyTaint({all:-4}); g._applyTaint({tzeentch:3}); return a.concat([g.state.taint.tzeentch, g.state.taint.slaanesh]).join(); })()") == "15,5,16,1")
    def claim_at(node, **extra):
        page.evaluate("() => { const s = WH.UI.game.state; s.stats.corruption = 0; s.stats.hp = 100; s.stats.sanity = 100; }")
        goto_node(page, node, **extra)
        page.evaluate("() => { WH.UI.game.state.taint.khorne = 100; }")
        page.locator("#choices button:not([disabled])").first.click(); page.wait_for_timeout(100); pass_conseq(page); page.wait_for_timeout(200)
        finish_text(page)
    def ev_labels():
        return page.evaluate("Array.from(document.querySelectorAll('#event-overlay .choices button')).map(b => b.innerText)")
    claim_at("smp_004", flags={}, claims={})
    check("taint 100 fires the god's claim event", page.locator("#event-overlay.claim").count() == 1 and "烙印" in page.locator("#event-overlay .event-tag").inner_text())
    labs = ev_labels()
    check("first claim: accept + resist shown, forced choice hidden (require filter)", len(labs) == 2 and not any("不再询问" in x for x in labs), str(labs))
    shot(page, "33_claim_event")
    resolve_event(page, 0)
    st = state(page)
    check("accept → goto the route's claim ending", st["nodeId"] == "smp_end_claim_khorne" and st["ended"], st["nodeId"])
    page.locator("#choices .choice.ending").click(); page.wait_for_timeout(300)
    check("claim ending: big sigil banner + verdict 你已归属于恐虐", page.locator("#scr-ending .claim-banner[data-god=khorne] .cb-sigil").count() == 1
          and "你已归属于恐虐" in page.locator("#scr-ending .claim-banner .cb-verdict").inner_text())
    check("claim ending: god card marked claimed with the same verdict", page.locator("#scr-ending .god-card.claimed.god-khorne").count() == 1
          and "你已归属于恐虐" in page.locator("#scr-ending .god-card.claimed .tverdict").inner_text())
    check("claim ending unlocks the god's codex entry", "smp_khorne" in state(page)["codex"])
    shot(page, "33b_claim_ending")
    page.evaluate("() => WH.UI.setLang('en')"); page.wait_for_timeout(150)
    check("claim verdict in English", "You belong to Khorne" in page.locator("#scr-ending .claim-banner .cb-verdict").inner_text())
    page.evaluate("() => WH.UI.setLang('zh')"); page.wait_for_timeout(150)
    # resist → continues; second claim → only the forced choice → claim ending
    claim_at("smp_004", flags={}, claims={}, ended=False)
    resolve_event(page, 1)
    st = state(page)
    check("resist → resumes the pending node, taint −40, flag resisted_khorne", st["nodeId"] == "smp_006" and not st["ended"]
          and st["taint"]["khorne"] == 60 and st["flags"].get("resisted_khorne") is True, f"{st['nodeId']} {st['taint']}")
    check("claim count stored (fires once so far)", st["claims"].get("khorne") == 1 and st["seenEvents"].count("smp_claim_khorne") == 1)
    claim_at("smp_004")
    labs = ev_labels()
    check("second claim fires and offers only the forced choice", page.locator("#event-overlay.claim").count() == 1 and len(labs) == 1 and "不再询问" in labs[0], str(labs))
    shot(page, "33c_claim_forced")
    resolve_event(page, 0)
    st = state(page)
    check("forced → claim ending; claims capped at 2", st["nodeId"] == "smp_end_claim_khorne" and st["claims"].get("khorne") == 2, str(st["claims"]))
    check("engine: no third claim", page.evaluate("(() => { const g = WH.Game.fromRecord(Object.assign(WH.UI.game.toRecord(), {nodeId:'smp_004', ended:false})); g.state.taint.khorne = 100; return g.claimDue(); })()") is None)
    page.locator("#choices .choice.ending").click(); page.wait_for_timeout(300)
    page.locator("#scr-ending .ending-btns .btn.primary").click(); page.wait_for_timeout(300); wait_idle(page); finish_text(page)
    # --- codex v2 ---
    nb = page.evaluate("WH.Save.codexUnseen().length")
    check("codex button shows NEW count", nb > 0 and page.locator("#tools .nbadge").inner_text() == str(nb), str(nb))
    page.locator("#tools button", has_text="图鉴").click(); page.wait_for_timeout(200)
    chips = page.locator(".modal .race-chips .rchip")
    check("race chips with counts + progress", chips.count() >= 4 and "/" in chips.nth(1).inner_text() and page.locator(".modal .rchip .rbar b").count() == chips.count())
    check("type tabs (present types only)", page.locator(".modal .type-tabs button").count() >= 4)
    check("NEW badges on entries unlocked since last open", page.locator(".modal .centry .new-badge").count() >= 1)
    check("entries carry a type · race badge", "·" in page.locator(".modal .centry:not(.locked) .rbadge").first.inner_text())
    shot(page, "34_codex_v2")
    page.locator('.modal .rchip[data-race="chaos"]').click(); page.wait_for_timeout(150)
    ids = page.evaluate("Array.from(document.querySelectorAll('.modal .cx-list .centry')).map(e => e.dataset.id)")
    races = page.evaluate("ids => ids.map(id => WH.codex[id].race || '?')", ids)
    check("race chip filters entries", len(ids) > 0 and all(r == "chaos" for r in races), str(races))
    page.locator('.modal .type-tabs button[data-type="deity"]').click(); page.wait_for_timeout(150)
    tys = page.evaluate("Array.from(document.querySelectorAll('.modal .cx-list .centry')).map(e => WH.codex[e.dataset.id].type)")
    check("type tab filters within the race", len(tys) > 0 and all(t_ == "deity" for t_ in tys), str(tys))
    shot(page, "34b_codex_chaos_deity")
    page.locator('.modal .rchip[data-race="all"]').click(); page.wait_for_timeout(100)
    page.locator('.modal .type-tabs button[data-type="all"]').click(); page.wait_for_timeout(100)
    page.locator("#cx-search").fill("khorne"); page.wait_for_timeout(150)
    ids = page.evaluate("Array.from(document.querySelectorAll('.modal .cx-list .centry')).map(e => e.dataset.id)")
    check("search matches en name of unlocked entries (and keeps focus)", ids == ["smp_khorne"] and page.evaluate("document.activeElement.id") == "cx-search", str(ids))
    page.locator("#cx-search").fill("政委"); page.wait_for_timeout(120)
    check("search matches zh names/aliases, unlocked only", page.evaluate("Array.from(document.querySelectorAll('.modal .cx-list .centry')).every(e => !e.classList.contains('locked'))"))
    page.locator("#cx-search").fill(""); page.wait_for_timeout(100)
    page.locator('.modal .cx-sort button[data-sort="race"]').click(); page.wait_for_timeout(150)
    check("sort by race groups into race sections", page.locator(".modal .race-sec").count() >= 2)
    page.locator('.modal .cx-sort button[data-sort="az"]').click(); page.wait_for_timeout(150)
    check("A–Z sort renders", page.locator(".modal .cx-list .centry").count() > 0)
    page.locator(".modal .views button", has_text="地点").click(); page.wait_for_timeout(150)
    check("places view uses the same race chips", page.locator(".modal .places-view .race-chips .rchip").count() >= 2)
    shot(page, "34c_places_chips")
    page.keyboard.press("Escape"); page.wait_for_timeout(100)
    page.locator("#tools button", has_text="图鉴").click(); page.wait_for_timeout(150)
    check("NEW badges cleared once the codex was opened", page.locator(".modal .new-badge").count() == 0 and page.locator("#tools .nbadge").is_hidden())
    page.keyboard.press("Escape"); page.wait_for_timeout(100)
    # --- lore-card modes for already-collected entries ---
    def fresh_run(origin="hive"):
        page.evaluate("() => { WH.UI.show('title'); const b = document.querySelector('.toasts'); if (b) b.innerHTML = ''; }"); page.wait_for_timeout(100)
        page.locator("#scr-title .menu .btn.primary").click(); page.wait_for_timeout(150)
        pick_faction(page, "sample", origin)
        page.wait_for_timeout(200); page.evaluate("WH.UI.cardDone && WH.UI.cardDone()"); page.wait_for_timeout(200)
        page.evaluate("() => { if (WH.UI.typer.active) WH.UI.typer.finish(); }"); page.wait_for_timeout(150)
    page.evaluate("() => { WH.Save.addCodexGlobal(['smp_hive','smp_place_hive']); Object.assign(WH.UI.settings, {loreCards:'new', knownHint:'toast'}); }")
    fresh_run()
    check("仅新条目弹出: known entries → no card, small toast", page.locator("#lore-overlay").count() == 0 and "图鉴更新" in page.locator(".toasts").inner_text())
    page.evaluate("() => { WH.UI.settings.loreCards = 'all'; }")
    fresh_run()
    check("全部弹出: known entry card marked 已收录", page.locator("#lore-overlay").count() == 1 and "已收录" in page.locator("#lore-overlay .lore-new").inner_text())
    shot(page, "35_lore_known")
    page.locator("#lore-known-off").check(); page.wait_for_timeout(80)
    sts = json.loads(page.evaluate("localStorage.getItem('whatiswh.settings')"))
    check("card checkbox 已收录的不再提示 → 静默 (persisted)", sts["knownHint"] == "silent" and sts["loreCards"] == "new")
    page.keyboard.press("Escape"); page.wait_for_timeout(100)
    fresh_run()
    check("静默: known entries → no card, no toast, still recorded", page.locator("#lore-overlay").count() == 0
          and page.locator(".toast").count() == 0 and "smp_hive" in state(page)["codex"])
    # --- ending + records show race · origin ---
    page.evaluate("() => { WH.UI.settings.knownHint = 'toast'; }")
    goto_node(page, "smp_008")
    page.locator("#choices button", has_text="带平民撤离").click(); wait_idle(page); finish_text(page)
    page.locator("#choices .choice.ending").click(); page.wait_for_timeout(300)
    check("ending shows race · origin", "测试阵营 · 巢都工人" in page.locator("#scr-ending .ending-fac").inner_text(), page.locator("#scr-ending .ending-fac").inner_text())
    check("good ending: no Tip card", page.locator("#scr-ending .tip-card").count() == 0)
    check("ending ⌂ 主页 button", "主页" in page.locator("#scr-ending .ending-btns .home-btn").inner_text())
    check("run record stores origin + taint", page.evaluate("(r => r.origin === 'hive' && !!r.taint)(WH.Save.runs()[0])"))
    page.evaluate("() => WH.UI.openCodex(null, false, 'records')"); page.wait_for_timeout(150)
    check("生涯 shows race · origin", "巢都工人" in page.locator(".modal .run-row").first.locator(".run-fac").inner_text())
    page.keyboard.press("Escape")
    # --- ⓘ faction-stat help in the HUD ---
    page.locator("#scr-ending .ending-btns .btn.primary").click(); page.wait_for_timeout(300); wait_idle(page); finish_text(page)
    check("ⓘ next to the faction stat", page.locator("#stat-info").count() == 1)
    page.locator("#stat-info").click(); page.wait_for_timeout(150)
    check("ⓘ opens the renownHelp text", "信仰" in page.locator(".modal .tip-body").inner_text())
    shot(page, "36_stat_help")
    page.keyboard.press("Escape")
    page.evaluate("() => WH.UI.show('select')"); page.wait_for_timeout(150)
    check("select screen back button reads ⌂ 主页", "主页" in page.locator("#scr-select .home-btn").inner_text())
    ctx.close(); b.close()

def run_v022(p):
    """SPEC §20 on sample data: rumour footer (seeded), its codex unlock, setting off, save/load, 战史 timeline (desktop + mobile)."""
    print("\n== v0.2.2 rumours + chronicle (sample) ==")
    b, ctx, page = new_ctx(p, tag="v022")
    page.locator("#scr-title .menu .btn.primary").click(); page.wait_for_timeout(200)
    pick_faction(page, "sample", "hive")
    wait_idle(page); finish_text(page)
    # engine-level: seeded + DOM-free, rumours never perturb the main RNG stream
    eng = page.evaluate("""() => {
      const play = (on) => { const g = new WH.Game('sample', {rng: WH.RNG(7), rumors: on}); g.start('hive'); const r = WH.RNG(99);
        while (!g.state.ended && g.state.visits < 40) { if (g.state.pendingEvent) { const v = g.eventChoices().filter(x => !x.locked); g.eventChoose(v[0].index); g.eventContinue(); continue; }
          const all = g.choices(), cs = all.filter(c => !c.locked); g.choose(all.indexOf(cs[Math.floor(r() * cs.length)])); }
        return {nodes: g.state.history.join(), hours: g.state.hours, seen: g.state.seenRumors.slice()}; };
      const a = play(true), a2 = play(true), off = play(false);
      const g = new WH.Game('sample', {rng: WH.RNG(3), rumorChance: 1}); g.start('hive'); g.state.chapter = 2;
      const pool = g.eligibleRumors(2).map(r => r.id), pool4 = g.eligibleRumors(4).map(r => r.id), pool1 = g.eligibleRumors(1).length;
      return {same: JSON.stringify(a) === JSON.stringify(a2), mainSame: a.nodes === off.nodes && a.hours === off.hours, offNone: off.seen.length === 0, pool, pool4, pool1}; }""")
    check("rumours: seeded engine is deterministic", eng["same"])
    check("rumours: on/off never changes the main RNG stream (nodes, time)", eng["mainSame"] and eng["offNone"], str(eng))
    check("rumours: eligibility by faction + chapter window", sorted(eng["pool"]) == ["smp_rum_cadia", "smp_rum_wall"] and eng["pool4"] == ["smp_rum_cadia"] and eng["pool1"] == 0, str(eng))
    # UI: force a rumour on the next node (chance 1) — smp_002 → smp_004 (chapter 2, no eventRoll)
    goto_node(page, "smp_002")
    page.evaluate("() => { WH.UI.game.rumorChance = 1; WH.UI.settings.textSpeed = 'normal'; }")
    page.locator("#choices button", has_text="拼命干活").click(); page.wait_for_timeout(80)
    pass_conseq(page); page.wait_for_timeout(100)
    page.evaluate("WH.UI.cardDone && WH.UI.cardDone()"); page.wait_for_timeout(250)
    st = state(page)
    check("rumour picked on entering a node without eventRoll", st["nodeId"] == "smp_004" and st["rumor"] in ("smp_rum_cadia", "smp_rum_wall") and st["seenRumors"] == [st["rumor"]], str(st and st.get("rumor")))
    check("rumour footer waits for the typewriter (space reserved, invisible)", page.evaluate("WH.UI.typer.active") is True
          and page.evaluate("(e => !e.hidden && !e.classList.contains('show') && getComputedStyle(e).visibility === 'hidden')(document.getElementById('dlg-rumor'))"))
    page.evaluate("() => { if (WH.UI.typer.active) WH.UI.typer.finish(); }"); page.wait_for_timeout(150)
    rm = page.locator("#dlg-rumor")
    check("rumour footer: 传闻 · speaker：text, italic, visible after the text", rm.is_visible() and "传闻" in rm.inner_text()
          and page.evaluate("getComputedStyle(document.getElementById('dlg-rumor')).fontStyle") == "italic", rm.inner_text() if rm.count() else "")
    chr_id = {"smp_rum_cadia": "chr_sample_cadia", "smp_rum_wall": "chr_sample_armageddon"}[st["rumor"]]
    st = state(page)
    check("rumour unlocks its codex id (run + global)", chr_id in st["codex"] and page.evaluate(f"WH.Save.codexGlobal().includes('{chr_id}')"))
    ids = page.evaluate("WH.UI.lore ? WH.UI.lore.ids : []")
    check("rumour codex goes through the normal lore-card queue (after node unlocks)", chr_id in ids, str(ids))
    for _ in range(ids.index(chr_id) if chr_id in ids else 0):
        page.locator("#lore-overlay .lore-btns .btn.primary").click(); page.wait_for_timeout(80)
    check("rumour's chronicle entry pops a lore card with date + millennium seal", page.locator("#lore-overlay .lore-date").count() == 1
          and page.locator("#lore-overlay .chr-seal").count() == 1 and "M41" in page.locator("#lore-overlay .chr-seal").inner_text())
    shot(page, "60_rumor_lore_card")
    dismiss_lore(page); page.wait_for_timeout(100)
    shot(page, "61_rumor_footer")
    page.evaluate("() => WH.UI.setLang('en')"); page.wait_for_timeout(150)
    check("rumour footer re-renders in English (Overheard)", "Overheard" in rm.inner_text() and rm.is_visible())
    shot(page, "61b_rumor_footer_en")
    page.evaluate("() => WH.UI.setLang('zh')"); page.wait_for_timeout(100)
    # save / load keeps it
    rec = page.evaluate("WH.UI.game.toRecord()")
    check("record stores seenRumors + rumor", rec.get("seenRumors") == st["seenRumors"] and rec.get("rumor") == st["rumor"])
    page.evaluate("r => WH.UI.loadRecord(r)", rec); page.wait_for_timeout(150); finish_text(page)
    check("load restores the footer", page.locator("#dlg-rumor").is_visible() and state(page)["rumor"] == st["rumor"])
    old = {k: v for k, v in rec.items() if k not in ("seenRumors", "rumor")}
    old["schema"] = 1
    check("older save without rumour fields still validates", page.evaluate("r => WH.Save.validate(r).ok", old))
    # consequence beat hides the footer
    page.evaluate("() => { WH.UI.game.rumorChance = 0; }")
    page.locator("#choices button", has_text="立正").click(); page.wait_for_timeout(120)
    check("no rumour during the consequence panel", page.locator("#conseq").count() == 1 and not page.locator("#dlg-rumor").is_visible())
    pass_conseq(page); page.wait_for_timeout(100)
    if page.locator("#event-overlay").count():
        check("footer hidden while an event is open", not page.locator("#dlg-rumor").is_visible())
        resolve_event(page)
    wait_idle(page); finish_text(page)
    check("chance 0 → no footer on the next node", not page.locator("#dlg-rumor").is_visible())
    # setting off hides it
    goto_node(page, "smp_004", rumor=st["rumor"])
    check("footer back on reload of the rumour node", page.locator("#dlg-rumor").is_visible())
    page.locator("#tools button", has_text="设置").click(); page.wait_for_timeout(150)
    row = page.locator(".modal .setrow", has_text="传闻")
    check("settings: 传闻 on/off row", row.count() == 1)
    row.locator("button", has_text="关").click(); page.wait_for_timeout(100)
    check("传闻 off: persisted, engine off, footer hidden", json.loads(page.evaluate("localStorage.getItem('whatiswh.settings')"))["rumors"] is False
          and page.evaluate("WH.UI.game.rumors") is False and not page.locator("#dlg-rumor").is_visible())
    page.keyboard.press("Escape"); page.wait_for_timeout(100)
    page.evaluate("() => { WH.UI.game.rumorChance = 1; }")
    goto_node(page, "smp_002")
    page.locator("#choices button", has_text="拼命干活").click(); page.wait_for_timeout(80); pass_conseq(page); wait_idle(page); finish_text(page)
    check("传闻 off: no rumour rolled even at chance 1", state(page)["rumor"] is None and not page.locator("#dlg-rumor").is_visible())
    page.evaluate("() => { WH.UI.settings.rumors = true; WH.UI.game.rumors = true; WH.Save.saveSettings(WH.UI.settings); }")
    # 战史 / Chronicle view
    page.evaluate("() => WH.UI.openCodex(null, false, 'chronicle')"); page.wait_for_timeout(200)
    tl = page.locator(".modal .timeline")
    check("战史 tab sits after 地点", page.locator(".modal .views button").nth(2).inner_text().strip() == "战史"
          and page.locator(".modal .views button").nth(2).get_attribute("aria-selected") == "true")
    check("timeline: 3 entries sorted by sortKey, M31 + M41 separators", tl.locator(".tl-item").count() == 3
          and [x.strip() for x in tl.locator(".tl-mill .tl-m").all_inner_texts()] == ["M31", "M41"]
          and page.evaluate("Array.from(document.querySelectorAll('.modal .tl-item')).map(e => e.dataset.id).join()") == "chr_sample_heresy,chr_sample_armageddon,chr_sample_cadia")
    lk = tl.locator(".tl-item.locked")
    check("locked entry shows ??? with its date (tease)", lk.count() >= 1 and "???" in lk.first.inner_text() and "014.M31" in lk.first.locator(".tl-date").inner_text())
    op = tl.locator(".tl-item:not(.locked)")
    check("unlocked entry shows name, type·race badge, text, more", op.count() >= 1 and op.first.locator(".tl-name").inner_text().strip() not in ("", "???")
          and "·" in op.first.locator(".rbadge").inner_text() and op.first.locator(".tl-text").count() == 1 and op.first.locator(".tl-more").count() == 1)
    check("all dates visible", tl.locator(".tl-date").count() == 3 and all(".M" in x for x in tl.locator(".tl-date").all_inner_texts()))
    check("progress 已知 n/t in the header", "已知" in page.locator(".modal-head .sub").inner_text() and "/3" in page.locator(".modal-head .sub").inner_text())
    shot(page, "62_chronicle")
    page.locator(".modal .race-chips .rchip[data-race=orks]").click(); page.wait_for_timeout(150)
    check("race chip filters the timeline", page.locator(".modal .tl-item").count() == 1 and page.locator(".modal .tl-item").first.get_attribute("data-id") == "chr_sample_armageddon")
    page.locator(".modal .race-chips .rchip[data-race=all]").click(); page.wait_for_timeout(150)
    page.locator(".modal .views button").nth(0).click(); page.wait_for_timeout(150)
    check("chronicle entries are not in the 条目 grid", page.evaluate("Array.from(document.querySelectorAll('.modal .centry')).every(e => !(e.dataset.id||'').startsWith('chr_'))"))
    page.evaluate("() => WH.UI.setLang('en')"); page.wait_for_timeout(100)
    page.evaluate("() => WH.UI.openCodex(null, true, 'chronicle')"); page.wait_for_timeout(150)
    check("Chronicle in English (Known n/t, 41st millennium)", "Known" in page.locator(".modal-head .sub").inner_text() and "41st millennium" in page.locator(".modal .timeline").inner_text())
    shot(page, "62b_chronicle_en")
    ctx.close(); b.close()
    # mobile
    b, ctx, page = new_ctx(p, mobile=True, tag="v022-m")
    page.evaluate("() => WH.Save.addCodexGlobal(['chr_sample_cadia'])")
    page.locator("#scr-title .menu .btn.primary").tap(); page.wait_for_timeout(200)
    pick_faction(page, "sample", "hive", tap=True); wait_idle(page); finish_text(page)
    goto_node(page, "smp_004", rumor="smp_rum_wall", seenRumors=["smp_rum_wall"])
    page.screenshot(path=os.path.join(OUT, "m20_rumor_footer.png"), full_page=True)
    check("mobile: rumour footer visible, no overflow", page.locator("#dlg-rumor").is_visible() and page.evaluate("document.documentElement.scrollWidth") <= 391)
    page.evaluate("() => WH.UI.openCodex(null, false, 'chronicle')"); page.wait_for_timeout(200)
    page.screenshot(path=os.path.join(OUT, "m21_chronicle.png"))
    bx = page.locator(".modal .tl-item").first.bounding_box()
    check("mobile: timeline fits the phone", bx and bx["x"] >= 0 and bx["x"] + bx["width"] <= 391)
    ctx.close(); b.close()

def run_egg(p):
    """SPEC §21 Tzeentch easter egg: hidden entries, progress formula, tiers forced via ?egg=N, persistence, joke."""
    print("\n== v0.2.2 Tzeentch easter egg ==")
    b, ctx, page = new_ctx(p, tag="egg")
    info = page.evaluate("""() => { const ids = Object.keys(WH.codex), vis = ids.filter(i => !WH.codex[i].hidden);
      const pr = WH.UI.eggProgress(); return {all: ids.length, vis: vis.length, ct: pr.ct, et: pr.et, p: pr.p, hasEgg: !!WH.codex.egg_tzeentch_letter}; }""")
    check("hidden entry loaded but excluded from the progress total", info["hasEgg"] and info["ct"] == info["vis"] == info["all"] - 1, str(info))
    check("title codex counter excludes hidden entries", f"/{info['vis']}" in page.locator(".title-meta").inner_text(), page.locator(".title-meta").inner_text())
    # formula: half the countable codex + 1 ending
    pr = page.evaluate("""() => { const ids = Object.keys(WH.codex).filter(i => !WH.codex[i].hidden); const half = ids.slice(0, Math.floor(ids.length / 2));
      WH.Save.addCodexGlobal(half.concat(['egg_tzeentch_letter'])); const f = Object.values(WH.factions)[0]; const end = Object.keys(f.nodes).find(n => f.nodes[n].ending);
      localStorage.setItem('whatiswh.endingStats', JSON.stringify({[f.id + ':' + end]: {count: 1}}));
      const pr = WH.UI.eggProgress(); return {pr, half: half.length, n: ids.length}; }""")
    exp = round(100 * (0.6 * pr["half"] / pr["n"] + 0.4 * 1 / pr["pr"]["et"]))
    check("P = round(100 × (0.6 × codex + 0.4 × endings)), hidden unlock not counted", pr["pr"]["p"] == exp and pr["pr"]["cu"] == pr["half"], f"{pr} exp {exp}")
    page.evaluate("() => WH.UI.openCodex()"); page.wait_for_timeout(150)
    check("hidden entry never listed (not even as ???)", page.locator(".modal [data-id=egg_tzeentch_letter]").count() == 0)
    page.keyboard.press("Escape")
    ctx.close(); b.close()
    # 25: whisper glitch
    b, ctx, page = new_ctx(p, tag="egg25", extra="&egg=25")
    page.wait_for_timeout(200)
    sub = page.locator("#scr-title .title-sub")
    check("egg 25: subtitle glitches into the whisper", "egg-glitch" in (sub.get_attribute("class") or "") and "数你翻过" in sub.inner_text())
    shot(page, "70_egg25_whisper")
    page.wait_for_timeout(3200)
    check("egg 25: reverts after 3 s, tier persisted", "egg-glitch" not in (sub.get_attribute("class") or "") and "WHAT IS" in sub.inner_text()
          and "whisper" in json.loads(page.evaluate("localStorage.getItem('whatiswh.eggTiers')") or "{}"))
    # natural progress ≥ 50 on the next title render: letter appears, whisper does not repeat
    page.evaluate("() => { WH.UI.eggForce = null; WH.Save.addCodexGlobal(Object.keys(WH.codex).filter(i => !WH.codex[i].hidden)); WH.UI.show('title'); }"); page.wait_for_timeout(200)
    check("natural P ≥ 50: letter appears, whisper fires only once", page.locator("#egg-letter").count() == 1 and "egg-glitch" not in (sub.get_attribute("class") or "")
          and page.evaluate("WH.UI.eggProgress().p") >= 50)
    ctx.close(); b.close()
    # 50: letter
    b, ctx, page = new_ctx(p, tag="egg50", extra="&egg=50")
    check("egg 50: sealed letter on the title screen", page.locator("#egg-letter.fresh").count() == 1)
    shot(page, "71_egg50_letter_icon")
    page.locator("#egg-letter").click(); page.wait_for_timeout(150)
    check("egg 50: letter card with title + text + sigil", "没有署名" in page.locator(".modal-head h3").inner_text() and "别停下" in page.locator(".modal .egg-text").inner_text()
          and page.locator(".modal .egg-sig img, .modal .egg-sig .ph").count() >= 1)
    shot(page, "72_egg50_letter")
    page.keyboard.press("Escape")
    ctx.close(); b.close()
    # 75: flame
    b, ctx, page = new_ctx(p, tag="egg75", extra="&egg=75")
    check("egg 75: blue flame beside the title (+ letter)", page.locator(".title-main #egg-flame").count() == 1 and page.locator("#egg-letter").count() == 1)
    page.locator("#egg-flame").click(); page.wait_for_timeout(150)
    check("egg 75: mini-scene with warp + daemon and 2 choices", page.locator(".modal .egg-mini .egg-stage").count() == 1 and page.locator(".modal .egg-choices button").count() == 2)
    shot(page, "73_egg75_flame")
    page.locator(".modal .egg-choices button").nth(1).click(); page.wait_for_timeout(100)
    check("egg 75: choice shows its result line (no gameplay effect)", "点了点头" in page.locator(".modal .egg-result").inner_text())
    page.keyboard.press("Escape")
    ctx.close(); b.close()
    # 99: last line in the codex header, one opening only
    b, ctx, page = new_ctx(p, tag="egg99", extra="&egg=99")
    page.evaluate("() => WH.UI.openCodex()"); page.wait_for_timeout(150)
    check("egg 99: codex header shows the last-entry line instead of the counter", "最后一条" in page.locator(".modal-head .sub").inner_text())
    shot(page, "74_egg99_codex")
    page.keyboard.press("Escape"); page.wait_for_timeout(80)
    page.evaluate("() => WH.UI.openCodex()"); page.wait_for_timeout(150)
    check("egg 99: only for one opening", "最后一条" not in page.locator(".modal-head .sub").inner_text() and "已解锁" in page.locator(".modal-head .sub").inner_text())
    page.keyboard.press("Escape")
    ctx.close(); b.close()
    # 100: planned
    for mobile in (False, True):
        b, ctx, page = new_ctx(p, mobile=mobile, tag="egg100" + ("-m" if mobile else ""), extra="&egg=100")
        page.wait_for_timeout(400)
        ep = page.locator("#egg-planned")
        check(f"egg 100{' (mobile)' if mobile else ''}: full-screen scene with daemon + glitch", ep.count() == 1 and ep.locator(".egg-full-actor").count() == 1 and "egg-full" in ep.get_attribute("class"))
        page.wait_for_timeout(500)
        shot(page, "m30_egg100" if mobile else "75_egg100_scene")
        page.keyboard.press("Enter"); page.wait_for_timeout(100)
        check("egg 100: text finished → continue", "如计划" in ep.locator(".egg-full-text").inner_text() and ep.locator(".egg-full-btns button").is_visible())
        page.keyboard.press("Enter"); page.wait_for_timeout(250)
        if mobile:
            page.evaluate("() => WH.UI.closeLore()"); page.wait_for_timeout(150)
            page.screenshot(path=os.path.join(OUT, "m31_egg_title.png"))
            check("mobile: title fits with egg decorations", page.evaluate("document.documentElement.scrollWidth") <= 391)
            ctx.close(); b.close(); continue
        check("egg 100: unlocks the hidden letter and shows its card", page.evaluate("WH.Save.codexGlobal().includes('egg_tzeentch_letter')")
              and "改变之主的回信" in page.locator("#lore-overlay .lore-name").inner_text())
        shot(page, "76_egg100_card")
        page.evaluate("() => WH.UI.closeLore()"); page.wait_for_timeout(150)
        check("egg 100: title shimmer from now on", "tz-shimmer" in page.locator("#scr-title .title-main").get_attribute("class"))
        shot(page, "77_egg_title_after")
        check("egg 100: NEW badge does not count the hidden entry", not page.evaluate("WH.Save.codexUnseen().includes('egg_tzeentch_letter')") or page.evaluate("(document.querySelector('#scr-title .nbadge')||{}).hidden !== false"))
        page.locator("#scr-title .menu button", has_text="设置").click(); page.wait_for_timeout(150)
        check("egg 100: Settings gains 奸奇的玩笑", page.locator(".modal .setrow.tz-row").count() == 1)
        page.keyboard.press("Escape"); page.wait_for_timeout(80)
        page.evaluate("() => WH.UI.openCodex()"); page.wait_for_timeout(150)
        page.evaluate("() => WH.UI.jokeTick && WH.UI.jokeTick()"); page.wait_for_timeout(100)
        j = page.locator(".codex-body [data-joke]")
        check("奸奇的玩笑: a locked ??? shows a shuffled name", j.count() == 1 and j.first.inner_text().strip() not in ("???", ""), j.first.inner_text() if j.count() else "none")
        shot(page, "78_egg_joke")
        page.wait_for_timeout(1000)
        check("…and reverts to ???", page.locator(".codex-body [data-joke]").count() == 0)
        page.keyboard.press("Escape"); page.wait_for_timeout(80)
        page.locator("#scr-title .menu button", has_text="设置").click(); page.wait_for_timeout(150)
        page.locator(".modal .setrow.tz-row button", has_text="关").click(); page.wait_for_timeout(80)
        page.keyboard.press("Escape"); page.wait_for_timeout(80)
        page.evaluate("() => WH.UI.openCodex()"); page.wait_for_timeout(2700)
        check("奸奇的玩笑 off: no shuffling", page.locator(".codex-body [data-joke]").count() == 0 and page.evaluate("WH.UI.jokeTimer") is None)
        page.keyboard.press("Escape")
        ctx.close(); b.close()

LEGACY = {
  "slot1": {"schema": 1, "gameVersion": "0.1.0", "savedAt": "2026-11-10T09:00:00.000Z", "faction": "sample", "nodeId": "smp_004", "chapter": 2,
            "stats": {"hp": 80, "sanity": 70, "corruption": 5, "renown": 12}, "flags": {"prayed": True}, "codex": ["smp_commissar"], "seenEvents": [],
            "hours": 500, "pendingEvent": None, "pendingNext": None, "history": ["smp_001", "smp_002", "smp_004"], "playMs": 60000, "lang": "zh",
            "customFutureField": {"x": 1}},
  "runs": [{"runId": "r1", "endingId": "smp_end_bad_cult", "faction": "sample", "kind": "bad", "title": {"zh": "墙里的歌", "en": "Song"},
            "cause": {"zh": "邪教", "en": "Cult"}, "survived": 100, "at": "2026-11-10T10:00:00.000Z", "visits": 5, "playMs": 1000, "finalHours": 200}],
  "runStats": {"runs": 1, "deaths": 0, "longest": 100, "causes": {"Cult": {"count": 1, "label": {"zh": "邪教", "en": "Cult"}}}},
  "endingStats": {"sample:smp_end_bad_cult": {"count": 1, "first": 100, "best": 100, "firstAt": "2026-11-10T10:00:00.000Z"}},
  "runsSeen": ["r1:smp_end_bad_cult"],
  "codexGlobal": ["smp_commissar", "smp_hive"],
  "settings": {"lang": "zh", "textSpeed": "fast", "loreCards": "auto", "effects": True},
}

def run_data(p):
    """SPEC §22: a v0.1-era localStorage survives the update untouched; full backup export → clear → import; merge without duplicates."""
    print("\n== v0.2.2 local data is never overwritten (SPEC §22) ==")
    b = p.chromium.launch(executable_path=CHROME, headless="--headed" not in ARGS)
    ctx = b.new_context(viewport={"width": 1280, "height": 720}, locale="zh-CN", accept_downloads=True)
    page = ctx.new_page(); attach_console(page, "data")
    page.goto(BASE + QS + ("&" if QS else "?") + "seed=7"); page.wait_for_selector("#scr-title .title-main")
    page.evaluate("""(L) => { localStorage.clear(); for (const k in L) localStorage.setItem('whatiswh.' + k, JSON.stringify(L[k])); }""", LEGACY)
    before = page.evaluate("() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('whatiswh.')).map(k => [k, localStorage.getItem(k)]))")
    page.reload(); page.wait_for_selector("#scr-title .title-main"); page.wait_for_timeout(300)
    ver = page.evaluate("WH.VERSION")
    check("update notice shown once: 已更新到 vX · 存档与记录已保留", f"已更新到 v{ver}" in page.locator(".toasts").inner_text() and "存档与记录已保留" in page.locator(".toasts").inner_text())
    shot(page, "80_update_toast")
    after = page.evaluate("() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('whatiswh.')).map(k => [k, localStorage.getItem(k)]))")
    check("no whatiswh.* key deleted or renamed", all(k in after for k in before), str([k for k in before if k not in after]))
    check("records / codex / endings untouched byte-for-byte", all(after[f"whatiswh.{k}"] == before[f"whatiswh.{k}"] for k in ("runs", "runStats", "endingStats", "runsSeen", "codexGlobal")))
    check("lastVersion recorded", after.get("whatiswh.lastVersion") == ver)
    s1 = json.loads(after["whatiswh.slot1"])
    check("schema-1 slot migrated in place, unknown field kept, pre-migration copy kept", s1["schema"] == 2 and s1.get("customFutureField") == {"x": 1}
          and any(k.startswith("whatiswh.bak.") and k.endswith(".slot1") and after[k] == before["whatiswh.slot1"] for k in after), str(s1.get("schema")))
    sts = page.evaluate("WH.UI.settings")
    check("old settings kept (text speed), v0.1 loreCards 'auto' read as 'new'", sts["textSpeed"] == "fast" and sts["loreCards"] == "new" and sts["rumors"] is True)
    check("title counts the old codex progress", "2/" in page.locator(".title-meta").inner_text())
    page.locator("#scr-title .menu button", has_text="继续").click(); page.wait_for_timeout(300); finish_text(page)
    st = state(page)
    check("old save loads (Continue) with its stats; caps default 100/100", st and st["nodeId"] == "smp_004" and st["stats"]["hp"] == 80 and st["max"] == {"hp": 100, "sanity": 100})
    check("unknown fields survive load → save", page.evaluate("WH.UI.game.toRecord().customFutureField && WH.UI.game.toRecord().customFutureField.x") == 1)
    page.evaluate("() => WH.UI.openCodex(null, false, 'records')"); page.wait_for_timeout(150)
    check("old run record shown in 生涯", page.locator(".modal .run-row").count() == 1)
    page.keyboard.press("Escape")
    page.reload(); page.wait_for_selector("#scr-title .title-main"); page.wait_for_timeout(300)
    check("second boot: no update notice", "已更新" not in (page.locator(".toasts").inner_text() if page.locator(".toasts").count() else ""))
    # full backup: export → clear → import restores
    keys = ["runs", "runStats", "endingStats", "codexGlobal", "slot1", "settings"]
    snap = page.evaluate("(ks) => Object.fromEntries(ks.map(k => [k, localStorage.getItem('whatiswh.' + k)]))", keys)
    page.locator("#scr-title .menu button", has_text="设置").click(); page.wait_for_timeout(150)
    page.locator("#data-btn").click(); page.wait_for_timeout(150)
    check("Settings → 数据 opens the backup panel", page.locator(".modal .data-view").count() == 1 and "导出全部进度" in page.locator(".modal .data-view").inner_text())
    shot(page, "81_data_panel")
    with page.expect_download() as dl:
        page.locator("#data-export").click()
    bk = json.loads(open(dl.value.path(), encoding="utf-8").read())
    check("导出全部进度 downloads every whatiswh.* key + version + time", bk.get("format") == "whatiswh-backup" and bk.get("gameVersion") == ver and bk.get("exportedAt")
          and all(k in bk["data"] for k in keys + ["lastVersion"]))
    page.locator("#data-copy").click(); page.wait_for_timeout(200)
    check("复制到剪贴板 fallback shows the JSON text", page.locator("#data-out").is_visible() and '"whatiswh-backup"' in page.locator("#data-out").input_value())
    text = page.locator("#data-out").input_value()
    page.keyboard.press("Escape"); page.wait_for_timeout(80); page.keyboard.press("Escape")
    page.evaluate("() => localStorage.clear()")
    page.reload(); page.wait_for_selector("#scr-title .title-main"); page.wait_for_timeout(200)
    check("cleared browser: nothing left", page.evaluate("WH.Save.runs().length") == 0 and page.evaluate("WH.Save.codexGlobal().length") == 0)
    page.evaluate("() => WH.UI.openData()"); page.wait_for_timeout(150)
    page.locator("#data-paste").fill(text)
    page.locator("#data-import-paste").click(); page.wait_for_timeout(300)
    rest = page.evaluate("(ks) => Object.fromEntries(ks.map(k => [k, localStorage.getItem('whatiswh.' + k)]))", keys)
    check("paste-box import restores runs, stats, endings, codex, save slot, settings", all(json.loads(rest[k] or "null") == json.loads(snap[k] or "null") for k in keys),
          str([k for k in keys if json.loads(rest[k] or "null") != json.loads(snap[k] or "null")]))
    check("import toast summarises the merge", "已合并" in page.locator(".toasts").inner_text())
    shot(page, "82_import_done")
    page.keyboard.press("Escape")
    # merge again: nothing duplicated
    page.evaluate("t => WH.Save.importAll(WH.Save.parseBackup(t).backup)", text)
    check("re-importing the same backup duplicates nothing", page.evaluate("WH.Save.runs().length") == 1 and page.evaluate("WH.Save.runStats().runs") == 1
          and page.evaluate("WH.Save.codexGlobal().length") == 2)
    # merge a backup with one more run + a different slot1
    sum_ = page.evaluate("""t => { const b = WH.Save.parseBackup(t).backup; b.data.runs = b.data.runs.concat([{runId: 'r2', endingId: 'smp_death_hp', faction: 'sample', kind: 'death',
        title: {zh: '无名之死', en: 'Death'}, cause: {zh: '伤', en: 'Wounds'}, survived: 300, at: '2026-11-11T10:00:00.000Z', visits: 7, playMs: 2000, finalHours: 400}]);
        b.data.codexGlobal = b.data.codexGlobal.concat(['smp_ork']); b.data.slot1 = Object.assign({}, b.data.slot1, {nodeId: 'smp_005'});
        const conf = WH.Save.backupConflicts(b); const s = WH.Save.importAll(b); return {conf, s, runs: WH.Save.runs().length, rs: WH.Save.runStats(),
        slot: JSON.parse(localStorage.getItem('whatiswh.slot1')).nodeId, cg: WH.Save.codexGlobal().length}; }""", text)
    check("merge: new run added once, totals updated, codex union", sum_["runs"] == 2 and sum_["rs"]["runs"] == 2 and sum_["rs"]["deaths"] == 1 and sum_["cg"] == 3, str(sum_))
    check("merge: occupied save slot not overwritten without confirmation", sum_["conf"] == ["slot1"] and sum_["slot"] == "smp_004" and sum_["s"]["skipped"] == ["slot1"])
    ctx.close(); b.close()

def run_real_v022(p):
    """--real: rumours + 战史 with the lore writer's data (desktop + mobile screenshots)"""
    print("\n== v0.2.2 rumours + chronicle (real data) ==")
    for mobile in (False, True):
        b, ctx, page = new_ctx(p, mobile=mobile, tag="real022" + ("-m" if mobile else ""), seed=21)
        n_r, n_c = page.evaluate("[WH.rumors.length, Object.keys(WH.codex).filter(i => (WH.codex[i].tags||[]).includes('chronicle')).length]")
        print(f"  rumours {n_r} · chronicle {n_c}")
        if not n_r or not n_c:
            check("real data: rumours + chronicle present", False, f"{n_r}/{n_c}"); ctx.close(); b.close(); continue
        page.evaluate("() => WH.UI.show('select')"); page.wait_for_timeout(150)
        pick_faction(page, "imperium", tap=mobile); wait_idle(page); finish_text(page)
        page.evaluate("() => { WH.UI.game.rumorChance = 1; }")
        rng = random.Random(4); seen = False
        for _ in range(12):
            if page.locator("#event-overlay").count(): resolve_event(page); continue
            if state(page)["ended"]: break
            click_choice(page, None, rng)
            if page.locator("#event-overlay").count(): resolve_event(page)
            finish_text(page)
            if page.locator("#dlg-rumor").is_visible(): seen = True; break
        check(f"real{' mobile' if mobile else ''}: a rumour footer appears on the imperium route", seen and state(page)["rumor"] is not None)
        if seen:
            if mobile: page.screenshot(path=os.path.join(OUT, "m40_real_rumor.png"), full_page=True)
            else: shot(page, "60_real_rumor")
        page.evaluate("() => WH.UI.openCodex(null, false, 'chronicle')"); page.wait_for_timeout(250)
        check(f"real{' mobile' if mobile else ''}: 战史 lists every chronicle entry with a date", page.locator(".modal .tl-item").count() == n_c
              and page.locator(".modal .tl-date").count() == n_c and page.locator(".modal .tl-item:not(.locked)").count() >= 1)
        if mobile: page.screenshot(path=os.path.join(OUT, "m41_real_chronicle.png"))
        else:
            shot(page, "61_real_chronicle")
            page.locator(".modal-body").evaluate("e => e.scrollTop = e.scrollHeight / 2"); page.wait_for_timeout(100)
            shot(page, "61b_real_chronicle_mid")
        check(f"real{' mobile' if mobile else ''}: hidden egg entry not counted", page.evaluate("WH.UI.eggProgress().ct") == page.evaluate("Object.keys(WH.codex).filter(i => !WH.codex[i].hidden).length"))
        ctx.close(); b.close()

FIVE = """() => { const base = Object.values(WH.factions)[0]; const ids = ['imperium','chaos','tau','aeldari','necrons'];
  const names = {imperium:['人类帝国','Imperium of Man'], chaos:['混沌','Chaos'], tau:['钛帝国',"T'au Empire"], aeldari:['灵族','Aeldari'], necrons:['死灵','Necrons']};
  const col = {imperium:'#c9a227', chaos:'#b0304a', tau:'#d08a3a', aeldari:'#5fb3a1', necrons:'#4fd16b'};
  const icon = {imperium:'icon_faith', chaos:'icon_favor', tau:'icon_greatergood', aeldari:'icon_fate', necrons:'icon_worth'};
  ids.forEach(id => { if (WH.factions[id]) return; const f = Object.assign({}, base, {id, color: col[id], renownIcon: icon[id], name: {zh: names[id][0], en: names[id][1]},
     playerSprite: 'player_' + id, _defaultOrigin: undefined}); WH.factions[id] = f; });
  WH.UI.show('select'); }"""

def run_five(p):
    """5 race cards: desktop row + mobile list (stub factions cloned from loaded data when fewer than 5 exist)."""
    print("\n== 5-faction select ==")
    for mobile in (False, True):
        b, ctx, page = new_ctx(p, mobile=mobile, tag="five" + ("-m" if mobile else ""))
        page.evaluate(FIVE); page.wait_for_timeout(250)
        cards = page.locator(".fcard")
        boxes = [cards.nth(i).bounding_box() for i in range(cards.count())]
        check(f"5 race cards ({'mobile' if mobile else 'desktop'})", cards.count() >= 5, str(cards.count()))
        if not mobile:
            ys = [bx["y"] for bx in boxes]
            check("desktop: one row inside the window", max(ys) - min(ys) < 12 and all(bx["x"] >= 0 and bx["x"] + bx["width"] <= 1280 for bx in boxes), str([round(y) for y in ys]))
            check("aeldari accent colour", page.evaluate("getComputedStyle(document.querySelector('.fcard[data-faction=aeldari]')).getPropertyValue('--accent').trim()") == "#5fb3a1")
            shot(page, "40_select_five")
            page.evaluate("() => WH.UI.setLang('en')"); page.wait_for_timeout(150)
            shot(page, "40b_select_five_en")
            bxs = [cards.nth(i).bounding_box() for i in range(cards.count())]
            check("desktop (en): cards stay inside the window", all(bx["y"] + bx["height"] <= 720 for bx in bxs))
            page.evaluate("() => WH.UI.setLang('zh')"); page.wait_for_timeout(100)
            page.locator('.fcard[data-faction="aeldari"]').click(); page.wait_for_timeout(250)
            if page.locator(".ocard").count(): page.locator(".ocard").first.click(); page.wait_for_timeout(300)
            page.evaluate("WH.UI.cardDone && WH.UI.cardDone()"); page.wait_for_timeout(200)
            check("aeldari theme + faction-stat icon (art or placeholder) in HUD", page.evaluate("document.getElementById('scr-game').dataset.faction") == "aeldari"
                  and page.locator("#stat-renown img, #stat-renown .ph-icon").count() >= 1)
            finish_text(page); dismiss_lore(page); shot(page, "41_aeldari_theme")
        else:
            check("mobile: vertical list, no horizontal overflow", len({round(bx["x"]) for bx in boxes}) == 1 and page.evaluate("document.documentElement.scrollWidth") <= 391)
            page.screenshot(path=os.path.join(OUT, "m10_select_five.png"), full_page=True)
            cards.first.tap(); page.wait_for_timeout(250)
            if page.locator(".ocard").count():
                page.screenshot(path=os.path.join(OUT, "m11_origins.png"), full_page=True)
                check("mobile: origin cards stack without overflow", page.evaluate("document.documentElement.scrollWidth") <= 391)
        ctx.close(); b.close()

def run_new_routes(p):
    """--real: play every new route whose data file exists"""
    print("\n== new routes (real data) ==")
    b, ctx, page = new_ctx(p, tag="routes", seed=11)
    present = page.evaluate("['aeldari','necrons'].filter(id => WH.factions[id])")
    print("  routes present:", present or "none yet")
    for fid in present:
        page.evaluate("() => WH.UI.show('select')"); page.wait_for_timeout(150)
        pick_faction(page, fid)
        wait_idle(page); finish_text(page)
        check(f"{fid}: starts", state(page)["faction"] == fid)
        check(f"{fid}: faction stat icon (art or placeholder)", page.locator("#stat-renown img, #stat-renown .ph-icon").count() >= 1)
        shot(page, f"50_{fid}_start")
        rng = random.Random(5)
        st = play_until_end(page, rng, max_steps=250)
        check(f"{fid}: reaches an ending", st and st["ended"], st and st["nodeId"])
        finish_text(page); page.locator("#choices .choice.ending").click(); page.wait_for_timeout(300)
        shot(page, f"51_{fid}_ending")
    ctx.close(); b.close()

with sync_playwright() as p:
    t0 = time.time()
    if "--only-v022" not in ARGS: run_desktop(p)
    if "--only-v022" not in ARGS: run_mobile(p)
    if "--only-v022" not in ARGS: run_no_storage(p)
    if not REAL:
        if "--only-v022" not in ARGS: run_v02(p)
        run_v022(p)
        run_egg(p)
        run_data(p)
    if "--only-v022" not in ARGS: run_five(p)
    if REAL:
        run_new_routes(p)
        run_real_v022(p)
    fails = [r for r in results if not r[1]]
    print(f"\nconsole/page errors: {len(errors)}")
    for e in errors: print("  " + e)
    print(f"\n{len(results) - len(fails)}/{len(results)} checks passed, {len(errors)} console errors · {time.time() - t0:.1f}s · screenshots in {OUT}")
    sys.exit(1 if fails or errors else 0)
