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

def new_ctx(p, mobile=False, seed=7, tag="v02"):
    b = p.chromium.launch(executable_path=CHROME, headless="--headed" not in ARGS)
    if mobile:
        ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True, locale="zh-CN")
    else:
        ctx = b.new_context(viewport={"width": 1280, "height": 720}, locale="zh-CN")
    page = ctx.new_page()
    attach_console(page, tag)
    page.goto(BASE + QS + ("&" if QS else "?") + f"seed={seed}")
    page.wait_for_selector("#scr-title .title-main")
    page.evaluate("() => localStorage.clear()")
    page.reload(); page.wait_for_selector("#scr-title .title-main")
    return b, ctx, page

def goto_node(page, node, **extra):
    """reload the current game at `node` (engine-level), keeping origin/taint unless overridden"""
    page.evaluate("""([n, x]) => { const g = WH.UI.game; WH.UI.loadRecord(Object.assign(g.toRecord(), {nodeId: n, pendingEvent: null, pendingNext: null, eventChoice: null}, x)); }""", [node, extra])
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
          and st["stats"] == {"hp": 90, "sanity": 95, "corruption": 10, "renown": 5} and st["flags"].get("origin_scav") is True, str(st and st["nodeId"]))
    check("origin sprite used for the player portrait", page.evaluate("WH.UI.actorKeys.left") == "player_chaos")
    # --- consequence beat with result ---
    page.locator("#choices button", has_text="拿去换水").click(); page.wait_for_timeout(120)
    check("consequence panel opens after a choice with result", page.locator("#conseq").count() == 1 and page.locator("#choices").is_hidden())
    page.keyboard.press("1"); page.wait_for_timeout(80)
    check("number hotkey does not skip the beat", page.locator("#conseq").count() == 1)
    finish_text(page)
    check("panel shows pick + result + delta line", "拿去换水" in page.locator("#conseq .cq-pick").inner_text()
          and "锈色" in page.locator("#conseq .cq-text").inner_text() and "生命" in page.locator("#conseq .cq-deltas").inner_text())
    check("HUD shows post-choice stats during the beat", page.locator("#sv-hp").inner_text() == "95", page.locator("#sv-hp").inner_text())
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
    run_desktop(p)
    run_mobile(p)
    run_no_storage(p)
    if not REAL:
        run_v02(p)
    run_five(p)
    if REAL:
        run_new_routes(p)
    fails = [r for r in results if not r[1]]
    print(f"\nconsole/page errors: {len(errors)}")
    for e in errors: print("  " + e)
    print(f"\n{len(results) - len(fails)}/{len(results)} checks passed, {len(errors)} console errors · {time.time() - t0:.1f}s · screenshots in {OUT}")
    sys.exit(1 if fails or errors else 0)
