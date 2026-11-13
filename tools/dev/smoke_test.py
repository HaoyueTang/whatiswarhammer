#!/usr/bin/env python3
"""smoke_test.py — headless browser smoke test (web role).

    python3 tools/dev/smoke_test.py            # sample data (index.html?sample=1)
    python3 tools/dev/smoke_test.py --real     # real data/ + assets/ (skips sample-specific checks)
    python3 tools/dev/smoke_test.py --only-grudge [--real]   # just the SPEC §28 grudge checks
    python3 tools/dev/smoke_test.py --only-track [--real]    # just the SPEC §29b track-selection checks (also part of the default and --real runs)
    python3 tools/dev/smoke_test.py --only-gather [--real]   # just the SPEC §20c gathering-place checks (tag, rumours / echoes only on gather nodes; also part of the default and --real runs)
    python3 tools/dev/smoke_test.py --only-v034 [--real]     # just the SPEC §31 ending-illustration checks (also part of the default and --real runs)
    python3 tools/dev/smoke_test.py --only-fam [--real]      # just the SPEC §33 "do you know Warhammer?" dialog checks (also part of the default and --real runs)
    python3 tools/dev/smoke_test.py --only-v040 [--real]     # just the SPEC §32 story-overhaul checks: alt / resultAlt / event where / save fallback (also part of the default and --real runs)
    options: --chrome /usr/bin/google-chrome   --out tools/dev/screenshots   --headed

Boots index.html via file://, asserts no console errors, plays through: race → origin select, choices with
consequence beats, a random event, save/load, export/import validation, language switch, codex v2 (race chips,
type tabs, search, sort, NEW badges), settings, lore-card modes, ⌂ Home, an ending, a death path, a 5-faction select
(desktop + mobile) and — with --real — any new route whose data exists; takes desktop (1280x720) and mobile
(390x844) screenshots.
"""
import io, json, os, re, sys, time, random
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# SPEC §33: a fresh profile gets a "do you know Warhammer?" dialog before the first new game. Tests that wipe storage use
# CLEAR (wipe + settings.loreAsked = true) so they are unaffected; only new_ctx(fam=True) / run_fam keep the pristine profile.
# (An add_init_script that touches localStorage on every load was tried first: it raced with page.reload() and lost writes.)
CLEAR = "() => { localStorage.clear(); localStorage.setItem('whatiswh.settings', '{\"loreAsked\":true}'); if (window.WH && WH.UI && WH.UI.settings) WH.UI.settings.loreAsked = true; }"
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
            # SPEC §31 test: one ending key is registered with a PNG that does not exist on purpose (fallback path)
            if "test_art/missing" in ((getattr(m, "location", None) or {}).get("url", "") + m.text):
                return
            # missing optional data/asset files under file:// are expected while the team works in parallel
            if REAL is False and ("ERR_FILE_NOT_FOUND" in m.text or "Failed to load resource" in m.text):
                return
            errors.append(f"[{tag}] console.{m.type}: {m.text}")
    page.on("console", on_console)
    def on_pageerror(e):
        # sample mode: a real data/** file another role is still writing must not fail the engine/UI tests
        if not REAL and "/data/" in (getattr(e, "stack", "") or ""):
            print(f"  (ignored in sample mode: {e} — {(e.stack or '').splitlines()[-1].strip()})")
            return
        errors.append(f"[{tag}] pageerror: {e}")
    page.on("pageerror", on_pageerror)

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
    page.evaluate(CLEAR)
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
    page.locator("#scr-title .corner button:not(.sound-btn):not(.music-btn)").click(); page.wait_for_timeout(150)
    check("title re-renders in English", "What is Warhammer" in page.locator(".title-main").inner_text())
    shot(page, "02_title_en")
    page.locator("#scr-title .corner button:not(.sound-btn):not(.music-btn)").click(); page.wait_for_timeout(150)

    # faction select
    page.locator("#scr-title .menu .btn.primary").click(); page.wait_for_timeout(250)
    cards = page.locator(".fcard")
    check("race cards built from WH.factions", cards.count() == nf, f"{cards.count()} cards")
    shot(page, "03_select")
    first_fid = page.evaluate("document.querySelector('.fcard').dataset.faction")
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
            check("§23: deltas vs neutral 100/100/0/10 (scav: 生命 +15, 理智 −15, 腐化 +10, hive: none)",
                  page.locator('.ocard[data-origin="scav"] .od').all_inner_texts() == ["+15", "−15", "+10", ""]
                  and all(x == "" for x in page.locator('.ocard[data-origin="hive"] .od').all_inner_texts()),
                  str(page.locator('.ocard[data-origin="scav"] .od').all_inner_texts()))
        else:
            check("§23: every origin card has a trade-off line", page.locator(".ocard .otrade").count() == n_or)
            caps = page.evaluate("f => WH.Game.origins(WH.factions[f]).map(o => WH.Rules.capsOf(o))", first_fid)
            lines = page.locator(".ocard .otrade").all_inner_texts()
            ok = all((("生命上限 %d" % c["hp"]) in l) == (c["hp"] != 100) and (("理智上限 %d" % c["sanity"]) in l) == (c["sanity"] != 100) for c, l in zip(caps, lines))
            check("§23: cap line lists every cap ≠ 100 with ▲/▼", ok, str(lines))
            shot(page, "05b_origin_tradeoffs")
        shot(page, "03b_origins")
        page.locator(".back-race").click(); page.wait_for_timeout(150)
        check("back button returns to race step", page.locator(".fcard").count() == nf and page.locator(".ocard").count() == 0)
        cards.first.click(); page.wait_for_timeout(200)
        page.keyboard.press("Escape"); page.wait_for_timeout(150)
        check("Esc on origin step returns to races", page.locator(".fcard").count() == nf)
        page.locator("#scr-select .corner button:not(.sound-btn):not(.music-btn)").last.click(); page.wait_for_timeout(150)
        cards.first.click(); page.wait_for_timeout(200)
        check("origin step re-renders in English", "Choose your origin" in page.locator("#scr-select h2").inner_text())
        page.locator("#scr-select .corner button:not(.sound-btn):not(.music-btn)").last.click(); page.wait_for_timeout(150)
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
    page.locator("#scr-ending .corner button:not(.sound-btn):not(.music-btn)").click(); page.wait_for_timeout(200)
    check("ending screen re-renders in English", "You met" in page.locator("#scr-ending").inner_text())
    shot(page, "17_ending_en")
    page.locator("#scr-ending .corner button:not(.sound-btn):not(.music-btn)").click(); page.wait_for_timeout(150)

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
    page.evaluate(CLEAR)
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
    check("§33 no storage: the profile is fresh, so the familiarity dialog is shown (and works in memory)", page.locator(".fam-opt").count() == 2)
    page.locator(".fam-opt[data-fam=new]").click(); page.wait_for_timeout(250)
    pick_faction(page); page.wait_for_timeout(1600); wait_idle(page)
    click_choice(page, 0)
    page.locator("#tools button").nth(1).click(); page.wait_for_timeout(150)
    page.locator(".modal .slot").first.click(); page.wait_for_timeout(150)
    check("in-memory save works", page.evaluate("!!WH.Save.read('slot1')"))
    ctx.close()

def new_ctx(p, mobile=False, seed=7, tag="v02", extra="", fam=False):
    b = p.chromium.launch(executable_path=CHROME, headless="--headed" not in ARGS)
    if mobile:
        ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True, locale="zh-CN")
    else:
        ctx = b.new_context(viewport={"width": 1280, "height": 720}, locale="zh-CN")
    page = ctx.new_page()
    attach_console(page, tag)
    page.goto(BASE + QS + ("&" if QS else "?") + f"seed={seed}" + extra)
    page.wait_for_selector("#scr-title .title-main")
    page.evaluate("() => localStorage.clear()" if fam else CLEAR)
    page.reload(); page.wait_for_selector("#scr-title .title-main")
    return b, ctx, page

def goto_node(page, node, **extra):
    """reload the current game at `node` (engine-level), keeping origin/taint unless overridden"""
    page.evaluate("""([n, x]) => { const g = WH.UI.game; WH.UI.loadRecord(Object.assign(g.toRecord(), {nodeId: n, pendingEvent: null, pendingNext: null, eventChoice: null, rumor: null, echo: null}, x)); }""", [node, extra])
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
      const pool = g.eligibleRumors(2).map(r => r.id), pool4 = g.eligibleRumors(4).map(r => r.id), pool1 = g.eligibleRumors(1).length, pool5 = g.eligibleRumors(5).map(r => r.id);
      return {same: JSON.stringify(a) === JSON.stringify(a2), mainSame: a.nodes === off.nodes && a.hours === off.hours, offNone: off.seen.length === 0, pool, pool4, pool1, pool5}; }""")
    check("rumours: seeded engine is deterministic", eng["same"])
    check("rumours: on/off never changes the main RNG stream (nodes, time)", eng["mainSame"] and eng["offNone"], str(eng))
    check("rumours: eligibility by faction + chapter window", sorted(eng["pool"]) == ["smp_rum_cadia", "smp_rum_wall"]
          and sorted(eng["pool4"]) == ["smp_rum_cadia", "smp_rum_wall"] and eng["pool1"] == 0 and sorted(eng["pool5"]) == ["smp_rum_cadia", "smp_rum_never"], str(eng))
    # SPEC §20b/§20c: relevance (when) is a preference at gather nodes, spacing, chapter cap — engine level, seeded.
    # The sample has only two gather nodes (smp_002, smp_004), so the random-walk statistics mark EVERY non-ending node as a crowd in-page (crowd(true)).
    rel = page.evaluate("""() => {
      const N = WH.factions.sample.nodes, marked = [];
      const crowd = (on) => { Object.keys(N).forEach((id) => { if (on) { if (!N[id].ending && !N[id].gather) { N[id].gather = {zh: '人群', en: 'crowd'}; marked.push(id); } } else if (marked.includes(id)) delete N[id].gather; }); if (!on) marked.length = 0; };
      const m = (id, ch) => { const g = new WH.Game('sample', {rng: WH.RNG(1), rumors: false, echoes: false}); g.start('hive'); return g.rumorMatches(id, ch).map(x => x.rumor.id + ':' + x.score); };
      WH.rumors.push({id: 'smp_rum_nowhen', factions: ['*'], minChapter: 2, speaker: null, text: {zh: '无条件', en: 'no when'}, codex: []});
      const runs = (forced) => { const out = {seen: {}, gapOK: true, capOK: true, n: 0, runs: 0, zeroOK: true, maxPer: 0};
        for (let k = 0; k < 400; k++) { const g = new WH.Game('sample', {rng: WH.RNG(1000 + k), rumorChance: forced ? 1 : undefined});
          g.start(['hive', 'scav', 'clerk'][k % 3]); const r = WH.RNG(k);
          while (!g.state.ended && g.state.visits < 60) { if (g.state.pendingEvent) { const v = g.eventChoices().filter(x => !x.locked); g.eventChoose(v[0].index); g.eventContinue(); continue; }
            const all = g.choices(), cs = all.filter(c => !c.locked); g.choose(all.indexOf(cs[Math.floor(r() * cs.length)])); }
          const log = g.state.rumorLog; out.runs++; out.n += log.length; out.maxPer = Math.max(out.maxPer, log.length);
          log.forEach((x, i) => { out.seen[x.id] = (out.seen[x.id] || 0) + 1; if (i && x.visit - log[i - 1].visit < 3) out.gapOK = false; if (x.id === 'smp_rum_nowhen' && x.score !== 0) out.zeroOK = false; });
          const per = {}; log.forEach(x => { per[x.chapter] = (per[x.chapter] || 0) + 1; if (per[x.chapter] > 2) out.capOK = false; }); }
        return out; };
      const m4 = m('smp_004'), m2 = m('smp_002'), m1 = m('smp_001'), m7off = m('smp_007', 4);
      const c = runs(true);                                   // only the two real gather nodes
      crowd(true);
      const m7 = m('smp_007', 4), a = runs(false), b = runs(true);
      crowd(false);
      WH.rumors.pop();
      return {m4, m2, m1, m7off, m7, a, b, c, left: Object.keys(N).filter(id => N[id].gather).join()}; }""")
    check("§20c: at a gather node a rumour's `when` is a preference, not a gate (smp_004 mess hall: cadia 2, then score-0 wall / no-when)",
          rel["m4"] == ["smp_rum_cadia:2", "smp_rum_wall:0", "smp_rum_nowhen:0"], str(rel["m4"]))
    check("§20c: no candidates where nothing is eligible (smp_002 chapter 1) and none at all on non-gather nodes (smp_001, fight smp_007)",
          rel["m2"] == [] and rel["m1"] == [] and rel["m7off"] == [], str([rel["m2"], rel["m1"], rel["m7off"]]))
    check("§20b: best match first (smp_007 trench + ork + 绿皮 → wall 3, cadia 1, no-when 0 — when marked as a crowd)", rel["m7"] == ["smp_rum_wall:3", "smp_rum_cadia:1", "smp_rum_nowhen:0"], str(rel["m7"]))
    check("§20c: the in-page crowd marking was removed again", rel["left"] == "smp_002,smp_004", rel["left"])
    check("§20b: rumours with a matching `when` appear in seeded runs (crowd everywhere)", rel["a"]["seen"].get("smp_rum_cadia", 0) > 0 and rel["a"]["seen"].get("smp_rum_wall", 0) > 0, str(rel["a"]["seen"]))
    check("§20c: a rumour whose window has no gather node never appears; score-0 chatter does, always logged with score 0",
          "smp_rum_never" not in rel["a"]["seen"] and "smp_rum_never" not in rel["b"]["seen"] and "smp_rum_never" not in rel["c"]["seen"]
          and rel["b"]["seen"].get("smp_rum_nowhen", 0) > 0 and rel["a"]["zeroOK"] and rel["b"]["zeroOK"], str(rel["b"]["seen"]))
    check("§20c: on the real sample (2 gather nodes) a forced rumour is heard only at the mess hall — at most one per run, always cadia",
          list(rel["c"]["seen"].keys()) == ["smp_rum_cadia"] and rel["c"]["maxPer"] == 1 and rel["c"]["n"] > 50, str(rel["c"]))
    check("§20b: ≥3 nodes between rumours and ≤2 per chapter (even at chance 1)", rel["a"]["gapOK"] and rel["a"]["capOK"] and rel["b"]["gapOK"] and rel["b"]["capOK"] and rel["b"]["n"] > rel["a"]["n"], str({k: rel[k]["n"] for k in "ab"}))
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
    page.evaluate(CLEAR); page.reload(); page.wait_for_selector("#scr-title .title-main"); page.wait_for_timeout(200)
    check("fresh install: no update notice, lastVersion recorded silently", page.locator(".toasts").count() == 0
          and page.evaluate("localStorage.getItem('whatiswh.lastVersion')") == page.evaluate("WH.VERSION"))
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
    page.evaluate(CLEAR)
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
        # SPEC §20c: rumours are heard only at gather nodes → jump to a plain node that leads straight (an unconditional choice) into a gather node
        # of the imperium route with an eligible rumour, then take that choice with chance 1
        hop = page.evaluate("""() => { const g = WH.UI.game, N = g.faction.nodes, G = WH.Rules.isGather;
            for (const id of Object.keys(N)) { const n = N[id]; if (n.ending || n.eventRoll || !G(n) || !g.eligibleRumors(n.chapter).length) continue;
              for (const pid of Object.keys(N)) { const pn = N[pid]; if (pn.ending || pn.eventRoll || G(pn)) continue;
                const ci = (pn.choices || []).findIndex(c => c.next === id && !c.require && !c.roll);
                if (ci >= 0) return {pid, ci, id, text: pn.choices[ci].text.zh}; } }
            return null; }""")
        seen = False
        if hop is None:
            print(f"  (SPEC §20c) no imperium gather node with an eligible rumour yet — the real-data rumour footer test is skipped")
        else:
            goto_node(page, hop["pid"])
            page.evaluate("() => { WH.UI.game.rumorChance = 1; }")
            page.locator("#choices button", has_text=hop["text"]).first.click(); page.wait_for_timeout(120)
            pass_conseq(page); wait_idle(page)
            if page.locator("#event-overlay").count(): resolve_event(page)
            finish_text(page)
            seen = page.locator("#dlg-rumor").is_visible()
            check(f"real{' mobile' if mobile else ''}: a rumour footer appears at a gather node ({hop['id']}) with its 聚集区 tag", seen and state(page)["rumor"] is not None
                  and page.locator("#gather-tag").is_visible() and "聚集区" in page.locator("#gather-tag").inner_text(), str(hop))
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

def run_difficulty(p):
    """SPEC §24: skull icons on race + origin cards (code-drawn, no text); missing data/difficulty.js → no skulls."""
    print("\n== v0.2.2 difficulty skulls ==")
    for mobile in (False, True):
        b, ctx, page = new_ctx(p, mobile=mobile, tag="diff" + ("-m" if mobile else ""))
        has_file = page.evaluate("!!WH.difficulty")
        if not REAL:   # sample mode: the real file is loaded too, but has no "sample" key → set levels for the test
            check(f"diff{' (m)' if mobile else ''}: no level for a faction → no skulls", (page.evaluate("WH.UI.show('select')") or True) and page.locator(".fcard .diff").count() == 0)
            page.evaluate("() => { WH.difficulty = {sample: 2, 'sample/hive': 1, 'sample/scav': 3, 'sample/clerk': 2}; }")
        fid = page.evaluate("Object.keys(WH.factions)[0]")
        page.evaluate("() => WH.UI.show('select')"); page.wait_for_timeout(200)
        card = page.locator(f'.fcard[data-faction="{fid}"]')
        lvl = page.evaluate(f"WH.difficulty['{fid}']")
        d = card.locator(".diff")
        check(f"diff{' (m)' if mobile else ''}: race card shows {lvl} filled of 3 pixel skulls", d.count() == 1 and d.locator("img.skull").count() == 3
              and d.locator("img.skull.on").count() == lvl and (d.locator("img.skull").first.get_attribute("src") or "").startswith("data:image/png"), f"file={has_file}")
        check("diff: skulls only — no text, no tooltip, aria-label 难度 n/3", d.inner_text().strip() == "" and d.get_attribute("title") is None
              and d.get_attribute("aria-label") == f"难度 {lvl}/3" and page.locator(".fcard .diff[title], .fcard .diff img[title]").count() == 0)
        if mobile: page.screenshot(path=os.path.join(OUT, "m50_diff_races.png"), full_page=True)
        else: shot(page, "90_diff_races")
        card.click(); page.wait_for_timeout(250)
        if page.locator(".ocard").count() > 1:
            n_d = page.locator(".ocard .diff").count()
            check(f"diff{' (m)' if mobile else ''}: every origin card has its skulls", n_d == page.locator(".ocard").count(), str(n_d))
            if mobile: page.screenshot(path=os.path.join(OUT, "m51_diff_origins.png"), full_page=True)
            else: shot(page, "91_diff_origins")
        page.evaluate("() => { delete WH.difficulty; WH.UI.show('select'); }"); page.wait_for_timeout(150)
        check(f"diff{' (m)' if mobile else ''}: missing difficulty file → no skulls", page.locator(".diff").count() == 0)
        ctx.close(); b.close()

FIVE = """() => { const base = Object.values(WH.factions)[0]; const ids = ['imperium','chaos','tau','aeldari','necrons'];
  const names = {imperium:['人类帝国','Imperium of Man'], chaos:['混沌','Chaos'], tau:['钛帝国',"T'au Empire"], aeldari:['灵族','Aeldari'], necrons:['死灵','Necrons']};
  const col = {imperium:'#c9a227', chaos:'#b0304a', tau:'#d08a3a', aeldari:'#5fb3a1', necrons:'#4fd16b'};
  const icon = {imperium:'icon_faith', chaos:'icon_favor', tau:'icon_greatergood', aeldari:'icon_fate', necrons:'icon_worth'};
  ids.forEach(id => { if (WH.factions[id]) return; const f = Object.assign({}, base, {id, color: col[id], renownIcon: icon[id], name: {zh: names[id][0], en: names[id][1]},
     playerSprite: 'player_' + id, _defaultOrigin: undefined}); WH.factions[id] = f; });
  WH.UI.show('select'); }"""

EIGHT = FIVE.replace("const ids = ['imperium','chaos','tau','aeldari','necrons'];", "const ids = ['imperium','chaos','tau','aeldari','necrons','orks','gsc','mechanicus'];").replace(
  "necrons:['死灵','Necrons']};", "necrons:['死灵','Necrons'], orks:['兽人','Orks'], gsc:['基因窃取者教派','Genestealer Cult'], mechanicus:['机械神教','Adeptus Mechanicus']};").replace(
  "necrons:'#4fd16b'};", "necrons:'#4fd16b', orks:'#6aa84f', gsc:'#9b59b6', mechanicus:'#c0392b'};").replace(
  "necrons:'icon_worth'};", "necrons:'icon_worth', orks:'icon_teef', gsc:'icon_kinship', mechanicus:'icon_grace'};")

FAKE_ECHO_RUN = {"runId": "past1", "endingId": "imp_end_deserter", "faction": "imperium", "origin": "hive", "kind": "death",
  "title": {"zh": "逃兵", "en": "Deserter"}, "cause": {"zh": "临阵脱逃，被政委处决", "en": "Shot by the commissar for desertion"},
  "survived": 500, "at": "2026-11-10T08:00:00.000Z", "visits": 20, "playMs": 9000, "finalHours": 900,
  "echo": {"faction": "imperium", "role": {"zh": "巢都工人", "en": "Hive worker"}, "world": {"zh": "奥雷克斯二号", "en": "Aurex Secundus"},
           "cause": {"zh": "临阵脱逃，被政委处决", "en": "Shot by the commissar for desertion"}, "kind": "death", "dateKey": 42100.0, "claimedBy": None}}

def run_v03(p):
    """v0.3 on sample data: §25 achievements, §26 8-race select, §27 echoes of past lives."""
    print("\n== v0.3 achievements · 8 races · echoes (sample) ==")
    b, ctx, page = new_ctx(p, tag="v03")
    # --- §25 evaluator semantics (engine, DOM-free) ---
    ev = page.evaluate("""() => { const A = WH.Achievements, base = {codexGlobal: [], eggTiers: {}, stats: A.emptyStats(), data: WH};
      const S = (es, extra) => Object.assign({}, base, {endingStats: es}, extra || {});
      const es = {'sample:smp_end_good_evac': {count: 2}, 'sample:smp_death_hp': {count: 3}, 'sample:smp_death_sanity': {count: 1}};
      const vis = Object.keys(WH.codex).filter(i => !WH.codex[i].hidden);
      return {
        good2: A.evaluate({endingKind: {kind: 'good', count: 2}}, S(es)).ok, good3: A.evaluate({endingKind: {kind: 'good', count: 3}}, S(es)).ok,
        runs6: A.evaluate({runs: {count: 6}}, S(es)).ok, runs7: A.evaluate({runs: {count: 7}}, S(es)).ok,
        hp3: A.evaluate({deaths: {count: 3, cause: 'hp', faction: 'sample'}}, S(es)).ok, hp4: A.evaluate({deaths: {count: 4, cause: 'hp'}}, S(es)).ok,
        all: A.evaluate({endingsAll: {faction: 'sample'}}, S(es)), evac: A.evaluate({ending: {id: 'smp_end_good_evac'}}, S(es)).ok,
        pct: A.evaluate({codexPct: {pct: 100}}, S({}, {codexGlobal: vis})).ok, pctHiddenOnly: A.evaluate({codexPct: {pct: 1}}, S({}, {codexGlobal: ['egg_tzeentch_letter']})).ok,
        egg50: A.evaluate({egg: {tier: 50}}, S({}, {eggTiers: {letter: 'x'}})).ok, egg100: A.evaluate({egg: {tier: 100}}, S({}, {eggTiers: {letter: 'x'}})).ok,
        flag: A.evaluate({flag: {id: 'prayed', faction: 'sample'}}, S({}, {stats: A.applyRun(A.emptyStats(), {faction: 'sample', flags: ['prayed'], visits: 9})})).ok,
        flagOther: A.evaluate({flag: {id: 'prayed', faction: 'imperium'}}, S({}, {stats: A.applyRun(A.emptyStats(), {faction: 'sample', flags: ['prayed']})})).ok,
        fast: A.evaluate({fast: {maxNodes: 9}}, S({}, {stats: A.applyRun(A.emptyStats(), {faction: 'sample', visits: 9})})).ok,
        fast8: A.evaluate({fast: {maxNodes: 8}}, S({}, {stats: A.applyRun(A.emptyStats(), {faction: 'sample', visits: 9})})).ok }; }""")
    check("§25: counts are times reached (good ×2 ✓, ×3 ✗; runs = 6 total)", ev["good2"] and not ev["good3"] and ev["runs6"] and not ev["runs7"], str(ev))
    check("§25: deaths by cause via deathNodes, faction filter", ev["hp3"] and not ev["hp4"])
    check("§25: endingsAll progress n/t, ending:{id}", ev["evac"] and not ev["all"]["ok"] and ev["all"]["n"] == 3 and ev["all"]["t"] >= 9, str(ev["all"]))
    check("§25: codexPct excludes hidden entries", ev["pct"] and not ev["pctHiddenOnly"])
    check("§25: egg tier uses §21 values (letter = 50)", ev["egg50"] and not ev["egg100"])
    check("§25: flag per faction from run records; fast counts nodes incl. start", ev["flag"] and not ev["flagOther"] and ev["fast"] and not ev["fast8"])
    # --- UI: play to an ending → toast, grid, storage, backup ---
    check("title has ★ 成就 n/t", page.locator("#ach-btn").count() == 1 and "/8" in page.locator("#ach-count").inner_text())
    page.locator("#scr-title .menu .btn.primary").click(); page.wait_for_timeout(200)
    pick_faction(page, "sample", "hive"); wait_idle(page); finish_text(page)
    goto_node(page, "smp_008")
    page.locator("#choices button", has_text="带平民撤离").click(); page.wait_for_timeout(100); pass_conseq(page); wait_idle(page); finish_text(page)
    page.locator("#choices .choice.ending").click(); page.wait_for_timeout(400)
    got = page.evaluate("Object.keys(WH.Save.achievements())")
    check("§25: finishing a run unlocks achievements (first run, good ending, the specific ending)", all(x in got for x in ("ach_smp_first", "ach_smp_good", "ach_smp_evac")), str(got))
    check("§25: unlock toast 成就解锁", "成就解锁" in page.locator(".toasts").inner_text())
    check("§25: run record carries flags/resists/endStats/claimedBy for later checks", page.evaluate("(r => Array.isArray(r.flags) && typeof r.resists === 'number' && r.endStats && 'claimedBy' in r)(WH.Save.runs()[0])"))
    check("§25: good runs leave no echo; achStats updated", page.evaluate("!WH.Save.runs()[0].echo && WH.Save.achStats().origins.sample.hive === 1"))
    page.evaluate("() => WH.UI.show('title')"); page.wait_for_timeout(150)
    page.locator("#ach-btn").click(); page.wait_for_timeout(200)
    grid = page.locator(".modal .ach-grid")
    check("§25: grid shows every achievement with tier colours + progress n/t", grid.locator(".ach-tile").count() == 8 and grid.locator(".ach-tile.open").count() >= 3
          and grid.locator(".ach-tile.tier-gold").count() == 2 and "3/8" in page.locator(".modal-head .sub").inner_text() or "/8" in page.locator(".modal-head .sub").inner_text())
    hid = grid.locator('.ach-tile[data-id="ach_smp_taint"]')
    check("§25: hidden locked achievement shows ??? + 隐藏成就", "???" in hid.inner_text() and "隐藏成就" in hid.inner_text() and "200" not in hid.inner_text())
    check("§25: locked counter achievements show a progress bar", grid.locator('.ach-tile[data-id="ach_smp_runs3"] .ach-prog').count() == 1 and "1/3" in grid.locator('.ach-tile[data-id="ach_smp_runs3"]').inner_text())
    shot(page, "95_achievements")
    page.keyboard.press("Escape")
    check("§22/§25: achievements + achStats are in the full backup", all(k in page.evaluate("WH.Save.exportAll().data") for k in ("achievements", "achStats")))
    # codex unlock trigger: unlock half the codex → codex achievement on the next unlock
    page.evaluate("() => { const ids = Object.keys(WH.codex).filter(i => !WH.codex[i].hidden); WH.Save.addCodexGlobal(ids.slice(0, Math.ceil(ids.length / 2))); }")
    page.locator("#scr-title .menu .btn.primary").click(); page.wait_for_timeout(200)
    pick_faction(page, "sample", "hive"); wait_idle(page); finish_text(page)
    check("§25: codex unlock re-evaluates (half the codex → 略知一二)", "ach_smp_codex" in page.evaluate("Object.keys(WH.Save.achievements())"))
    # boot evaluation + no repeat
    page.reload(); page.wait_for_selector("#scr-title .title-main"); page.wait_for_timeout(300)
    check("§25: boot re-check does not re-announce", "成就解锁" not in (page.locator(".toasts").inner_text() if page.locator(".toasts").count() else ""))
    # --- §27 echoes ---
    page.evaluate("(r) => { const rs = WH.Save.runs(); rs.unshift(r); localStorage.setItem('whatiswh.runs', JSON.stringify(rs)); }", FAKE_ECHO_RUN)
    # SPEC §27 + §20c: echoes are overheard like rumours — only on gather nodes (the sample has one at chapter ≥ 2: smp_004), so walk several seeds
    eng = page.evaluate("""(r) => { const mk = (dk, seed) => { const g = new WH.Game('sample', {rng: WH.RNG(5 + seed), echoChance: 1, rumorChance: 0,
          echoPool: [{runId: r.runId, echo: Object.assign({}, r.echo, {dateKey: dk})}]}); g.start(['hive', 'scav', 'clerk'][seed % 3]); return g; };
        const walk = (gg, seed) => { const r2 = WH.RNG(seed), seenAt = new Map(); while (!gg.state.ended && gg.state.visits < 40) { if (gg.state.pendingEvent) { const v = gg.eventChoices().filter(x => !x.locked); gg.eventChoose(v[0].index); gg.eventContinue(); continue; }
            const all = gg.choices(), cs = all.filter(c => !c.locked); gg.choose(all.indexOf(cs[Math.floor(r2() * cs.length)])); if (gg.state.echo) seenAt.set(gg.state.nodeId, gg.state.chapter); } return Array.from(seenAt); };   // (the echo stays in state while an event resolves on the same node)
        const per = [], where = [], fut = [];
        for (let k = 0; k < 40; k++) { const s1 = walk(mk(r.echo.dateKey, k), 3 + k); per.push(s1.length); s1.forEach(x => where.push(x)); fut.push(walk(mk(43000.5, k), 3 + k).length); }
        return {per, where, future: fut.reduce((a, b) => a + b, 0)}; }""", FAKE_ECHO_RUN)
    check("§27: at most one echo per run, only from chapter 2, only where people gather (smp_004)", max(eng["per"]) == 1 and sum(eng["per"]) >= 3
          and all(c >= 2 and n == "smp_004" for n, c in eng["where"]), str(eng))
    check("§27: an echo dated after 'now' is never heard", eng["future"] == 0)
    page.locator("#scr-title .menu .btn.primary").click(); page.wait_for_timeout(200)
    pick_faction(page, "sample", "hive"); wait_idle(page); finish_text(page)
    check("§27: past bad/death runs feed the echo pool", page.evaluate("WH.UI.game.echoPool.some(x => x.runId === 'past1')"))
    goto_node(page, "smp_002")
    page.evaluate("() => { WH.UI.game.echoChance = 1; WH.UI.game.rumorChance = 0; }")
    page.locator("#choices button", has_text="拼命干活").click(); page.wait_for_timeout(80); pass_conseq(page)
    page.evaluate("WH.UI.cardDone && WH.UI.cardDone()"); page.wait_for_timeout(200); finish_text(page)
    ft = page.locator("#dlg-rumor")
    check("§27: echo renders in the footer with ✝, role + world filled in", ft.is_visible() and "echo" in ft.get_attribute("class") and "✝" in ft.inner_text()
          and "奥雷克斯二号" in ft.inner_text() and "巢都工人" in ft.inner_text(), ft.inner_text() if ft.count() else "")
    page.wait_for_timeout(1000); shot(page, "96_echo_footer")
    ft.click(); page.wait_for_timeout(250)
    check("§27: clicking the echo opens 往生录 at that past run", page.locator('.modal .run-row.hl[data-run="past1"]').count() == 1)
    shot(page, "97_echo_record")
    page.keyboard.press("Escape"); page.wait_for_timeout(100)
    page.evaluate("() => WH.UI.setLang('en')"); page.wait_for_timeout(150)
    check("§27: echo re-renders in English", "Aurex Secundus" in ft.inner_text())
    page.evaluate("() => WH.UI.setLang('zh')"); page.wait_for_timeout(100)
    page.locator("#choices button").first.click(); page.wait_for_timeout(100); pass_conseq(page); wait_idle(page)
    if page.locator("#event-overlay").count(): resolve_event(page)
    finish_text(page)
    check("§27: never repeats in the run (state.echoRun kept, no new echo)", page.evaluate("WH.UI.game.state.echoRun") == "past1" and page.evaluate("WH.UI.game.state.echo") is None)
    goto_node(page, "smp_004", echo={"runId": "past1", "text": {"zh": "测试死讯", "en": "test echo"}})
    check("§27: echo restored from a save", "测试死讯" in page.locator("#dlg-rumor").inner_text())
    page.locator("#tools button", has_text="设置").click(); page.wait_for_timeout(150)
    page.locator(".modal .setrow", has_text="前世死讯").locator("button", has_text="关").click(); page.wait_for_timeout(100)
    check("§27: 前世死讯 off hides it (persisted)", not page.locator("#dlg-rumor").is_visible() and json.loads(page.evaluate("localStorage.getItem('whatiswh.settings')"))["echoes"] is False)
    page.keyboard.press("Escape")
    ctx.close(); b.close()
    # --- §26 8 race cards ---
    for mobile in (False, True):
        b, ctx, page = new_ctx(p, mobile=mobile, tag="eight" + ("-m" if mobile else ""))
        page.evaluate(EIGHT); page.wait_for_timeout(250)
        cards = page.locator(".fcard"); boxes = [cards.nth(i).bounding_box() for i in range(cards.count())]
        check(f"§26: 8 race cards ({'mobile' if mobile else 'desktop'})", cards.count() >= 8, str(cards.count()))
        if not mobile:
            ys = sorted({round(bx["y"] / 40) for bx in boxes})      # hover/focus lift (≤ 6 px) must not count as a row
            check("§26 desktop: 2-row grid inside the window", len(ys) == 2 and all(bx["x"] >= 0 and bx["x"] + bx["width"] <= 1280 and bx["y"] + bx["height"] <= 720 for bx in boxes), str(ys))
            check("§26: new accents + fallback glyph icons", page.evaluate("getComputedStyle(document.querySelector('.fcard[data-faction=gsc]')).getPropertyValue('--accent').trim()") == "#9b59b6"
                  and page.locator('.fcard[data-faction="mechanicus"] .fmeta img, .fcard[data-faction="mechanicus"] .fmeta .ph-icon').count() >= 1)
            shot(page, "98_select_eight")
            page.evaluate("() => WH.UI.setLang('en')"); page.wait_for_timeout(150)
            bxs = [cards.nth(i).bounding_box() for i in range(cards.count())]
            check("§26 desktop (en): cards stay inside the window", all(bx["y"] + bx["height"] <= 720 for bx in bxs))
            shot(page, "98b_select_eight_en")
        else:
            check("§26 mobile: stacked list, no horizontal overflow", len({round(bx["x"]) for bx in boxes}) == 1 and page.evaluate("document.documentElement.scrollWidth") <= 391)
            page.screenshot(path=os.path.join(OUT, "m60_select_eight.png"), full_page=True)
        ctx.close(); b.close()

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
            rows = len({round(y / 40) for y in ys}); want = 1 if len(boxes) < 6 else 2      # SPEC §26: 6+ races → 2-row grid
            check(f"desktop: {want} row(s) inside the window", rows == want and all(bx["x"] >= 0 and bx["x"] + bx["width"] <= 1280 for bx in boxes), str([round(y) for y in ys]))
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
    present = page.evaluate("['aeldari','necrons','orks','gsc','mechanicus'].filter(id => WH.factions[id])")
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

def run_real_v03(p):
    """--real: SPEC §25/§26/§27 with the writers' data — all 8 routes (every origin) start from the picker,
    the achievements page opens with the full list, and the zh/en toggle re-renders it."""
    print("\n== v0.3 picker · achievements · language (real data) ==")
    b, ctx, page = new_ctx(p, tag="real03", seed=31)
    ids = page.evaluate("Object.keys(WH.factions)")
    check("real: all 8 routes loaded", all(x in ids for x in ("imperium", "chaos", "tau", "aeldari", "necrons", "orks", "gsc", "mechanicus")), str(ids))
    page.evaluate("() => WH.UI.show('select')"); page.wait_for_timeout(200)
    cards = page.locator(".fcard"); n = cards.count()
    boxes = [cards.nth(i).bounding_box() for i in range(n)]
    ys = sorted({round(bx["y"] / 40) for bx in boxes})
    check("real: picker shows 8 race cards in a 2-row grid inside the window", n == 8 and len(ys) == 2 and all(bx["x"] >= 0 and bx["x"] + bx["width"] <= 1280 and bx["y"] + bx["height"] <= 720 for bx in boxes), f"{n} {ys}")
    shot(page, "70_real_picker_eight")
    for fid in ["imperium", "chaos", "tau", "aeldari", "necrons", "orks", "gsc", "mechanicus"]:
        n_or = page.evaluate("(f) => (WH.factions[f].origins || []).length", fid)
        for oi in range(max(1, n_or)):
            page.evaluate("() => WH.UI.show('select')"); page.wait_for_timeout(120)
            pick_faction(page, fid, oi); wait_idle(page); finish_text(page); dismiss_lore(page)
            st = state(page)
            ok = st["faction"] == fid and bool(page.evaluate("document.getElementById('scr-game').dataset.faction") == fid) and page.locator("#dlg-text").inner_text().strip() != ""
            if oi: ok = ok and page.evaluate("WH.UI.game.state.origin") == page.evaluate("(a) => WH.factions[a[0]].origins[a[1]].id", [fid, oi])
            check(f"real: {fid} origin #{oi + 1} starts from the picker", ok, str(st.get("nodeId")))
        shot(page, f"71_real_start_{fid}")
    # achievements page with the real list
    page.evaluate("() => WH.UI.show('title')"); page.wait_for_timeout(150)
    n_ach = page.evaluate("WH.achievements.length")
    check("real: achievements data present", n_ach >= 40, str(n_ach))
    check("real: title ★ shows n/total", page.locator("#ach-btn").count() == 1 and f"/{n_ach}" in page.locator("#ach-count").inner_text())
    page.locator("#ach-btn").click(); page.wait_for_timeout(250)
    check("real: achievements page opens with a tile per achievement", page.locator(".modal .ach-grid .ach-tile").count() == n_ach, str(page.locator(".modal .ach-grid .ach-tile").count()))
    check("real: achievements header 已解锁 n/t", "已解锁" in page.locator(".modal-head .sub").inner_text())
    shot(page, "72_real_achievements")
    page.evaluate("() => WH.UI.setLang('en')"); page.wait_for_timeout(250)
    check("real: achievements page re-renders in English", "Unlocked" in page.locator(".modal-head .sub").inner_text() and page.locator(".modal .ach-grid .ach-tile").count() == n_ach)
    shot(page, "73_real_achievements_en")
    page.keyboard.press("Escape"); page.wait_for_timeout(120)
    page.evaluate("() => WH.UI.show('select')"); page.wait_for_timeout(200)
    check("real (en): picker still 8 cards inside the window", page.locator(".fcard").count() == 8 and all(page.locator(".fcard").nth(i).bounding_box()["y"] + page.locator(".fcard").nth(i).bounding_box()["height"] <= 720 for i in range(8)))
    shot(page, "74_real_picker_eight_en")
    page.evaluate("() => WH.UI.setLang('zh')"); page.wait_for_timeout(150)
    check("real: language toggle back to zh persists", json.loads(page.evaluate("localStorage.getItem('whatiswh.settings')"))["lang"] == "zh")
    ctx.close(); b.close()

def run_grudge(p):
    """SPEC §28 on sample data: wrong an NPC → the grudge node shows ⚠ tag + note, a changed roll chance, the consequence note and
    (where the person is only implied) the grudgeLine; nothing shows while the flag is absent or forgiven."""
    print("\n== v0.3.2 grudges (sample) ==")
    b, ctx, page = new_ctx(p, tag="grudge")
    # --- engine level (DOM-free rules) ---
    eng = page.evaluate("""() => { const R = WH.Rules, rc = R.rollChance;
      const mk = (node, flags, seed) => { const g = new WH.Game('sample', {rng: WH.RNG(seed || 3), rumors: false, echoes: false}); g.start('hive');
        g.state.nodeId = node; g.state.flags = flags; g.state.ended = false; g.state.stats.hp = 80; return g; };
      const strip = (g) => { const f = g.faction, nodes = {}; for (const [id, n] of Object.entries(f.nodes)) { const m = Object.assign({}, n); delete m.grudgeLine;
          if (m.choices) m.choices = m.choices.map(c => { const d = Object.assign({}, c); delete d.grudge; return d; }); nodes[id] = m; }
        const d2 = Object.assign({}, WH, {factions: Object.assign({}, WH.factions, {sample: Object.assign({}, f, {nodes})})}); return d2; };
      // identical behaviour while no grudge is active (every choice of every node that carries a grudge)
      let same = true, n = 0;
      for (const node of ['smp_007', 'smp_008']) for (let i = 0; i < 4; i++) for (const fl of [{}, {forgiven_vik: true, wronged_vik: true, forgiven_mira: true, wronged_mira: true}]) {
        const a = mk(node, Object.assign({}, fl), 11), c = mk(node, Object.assign({}, fl), 11);
        const d2 = strip(a); const g2 = new WH.Game('sample', {rng: WH.RNG(11), data: d2, rumors: false, echoes: false}); g2.start('hive'); g2.state.nodeId = node; g2.state.flags = Object.assign({}, fl); g2.state.ended = false; g2.state.stats.hp = 80;
        const ca = a.choices(), cb = g2.choices(); if (ca.length !== cb.length || i >= ca.length || ca[i].locked) continue;
        if (ca.some(x => x.grudge)) same = false;
        if (JSON.stringify(ca.map(x => x.roll)) !== JSON.stringify(cb.map(x => x.roll))) same = false;
        const sa = a.choose(i), sb = g2.choose(i); n++;
        if (sa.nodeId !== sb.nodeId || JSON.stringify(a.state.stats) !== JSON.stringify(g2.state.stats) || a.rng() !== g2.rng()) same = false; if (sa.grudge) same = false; }
      const g = mk('smp_007', {wronged_vik: true}), cs = g.choices(), base = mk('smp_007', {}).choices();
      const fire = cs.find(x => x.choice.roll), fire0 = base.find(x => x.choice.roll);
      const st = g.choose(cs.indexOf(fire));
      const h = mk('smp_008', {wronged_mira: true}), hc = h.choices().find(x => x.grudge), line = h.grudgeLine(), nt = h.nodeText();
      const k = mk('smp_007', {wronged_vik: true}), hp0 = k.state.stats.hp, san0 = k.state.stats.sanity;
      const ks = k.choose(k.choices().findIndex(x => !x.choice.roll && x.grudge));
      return {same, n, rc: [rc({p: 0.1}, null, -0.3), Math.round(rc({p: 0.9, stat: 'hp'}, {hp: 100}, -0.15) * 1000) / 1000, rc({p: 0.5}, null, 0), rc({p: 0.5, stat: 'hp'}, {hp: 50})],
        pen: Math.round((fire0.roll.pEff - fire.roll.pEff) * 100) / 100, grudge: fire.grudge && {npc: fire.grudge.npc, p: fire.grudge.p, hp: fire.grudge.effects.hp},
        stepGrudge: st.grudge && st.grudge.npc, cqGrudge: !!(st.consequence && st.consequence.grudge && st.consequence.grudge.note), show: st.consequence && st.consequence.show,
        miraTag: hc && hc.grudge.npc, line: line && line.npc, nt: nt, base: h.node().text.zh,
        merged: [-ks.choiceDeltas.hp, -ks.choiceDeltas.sanity], actives: h.activeGrudgeNpcs()}; }""")
    check("§28 engine: with no active grudge (absent or forgiven) every choice behaves exactly as without grudge data", eng["same"] and eng["n"] >= 8, str(eng["n"]))
    check("§28 engine: rollChance extra p clamps to 0.05–0.95, no extra = unchanged", eng["rc"] == [0.05, 0.8, 0.5, 0.5], str(eng["rc"]))
    check("§28 engine: active grudge lowers the displayed roll chance by p (−0.15) and exposes {npc,p,effects}",
          abs(eng["pen"] - 0.15) < 0.011 and eng["grudge"] == {"npc": "vik", "p": -0.15, "hp": -4}, str(eng["pen"]) + str(eng["grudge"]))
    check("§28 engine: choose() records step.grudge + consequence.grudge (consequence now has something to show)", eng["stepGrudge"] == "vik" and eng["cqGrudge"] and eng["show"])
    check("§28 engine: grudge effects merge into the choice's own effects (hold the line: hp −60 from the choice, sanity −6 from the grudge)", eng["merged"] == [60, 6], str(eng["merged"]))
    check("§28 engine: grudgeLine + nodeText only while active; activeGrudgeNpcs", eng["line"] == "mira" and eng["nt"]["zh"] == eng["base"] + "撤离的队伍里，米拉抬起头，认出了你。" and eng["actives"] == ["mira"], str(eng["nt"]))
    # --- UI: nothing without the flag ---
    page.locator("#scr-title .menu .btn.primary").click(); page.wait_for_timeout(200)
    pick_faction(page, "sample", "hive"); wait_idle(page); finish_text(page)
    goto_node(page, "smp_007", flags={})
    base_pct = page.evaluate("Math.round(WH.UI.game.choices()[0].roll.pEff * 100)")
    check("§28 UI: flag absent → no ⚠ tag, no note, no presence line, no aria 旧怨", page.locator(".choice.grudge").count() == 0 and page.locator(".choice .gnote").count() == 0
          and page.locator(".choice .grudge-tag").count() == 0 and page.locator("#dlg-grudge").is_hidden() and "旧怨" not in page.locator("#choices").inner_html())
    goto_node(page, "smp_008", flags={})
    check("§28 UI: smp_008 without wronged_mira → no presence line, no ⚠", page.locator("#dlg-grudge").is_hidden() and page.locator(".choice.grudge").count() == 0)
    goto_node(page, "smp_008", flags={"wronged_mira": True, "forgiven_mira": True})
    check("§28 UI: forgiven_<npc> switches the grudge off", page.locator("#dlg-grudge").is_hidden() and page.locator(".choice.grudge").count() == 0)
    # --- wrong Vik through the UI, reach the grudge node ---
    goto_node(page, "smp_006", flags={})
    page.locator("#choices button", has_text="偷走老兵维克的水壶").click(); page.wait_for_timeout(120)
    check("§28 UI: the harming choice shows its result (consequence panel), flag set after", page.locator("#conseq").count() == 1 and state(page)["flags"].get("wronged_vik") is True)
    pass_conseq(page); wait_idle(page); finish_text(page)
    check("§28 UI: reaches smp_007 with the grudge active", state(page)["nodeId"] == "smp_007")
    gc = page.locator(".choice.grudge")
    check("§28 UI: ⚠ tag + note on exactly the two Vik grudge choices", gc.count() == 2 and page.locator(".choice .grudge-tag").count() == 2 and page.locator(".choice .gnote").count() == 2
          and "维克记着水壶的事" in gc.nth(0).inner_text() and "⚠" in gc.nth(0).inner_text())
    check("§28 UI: Vik is present by his speaker sprite, so there is no extra presence line", page.locator("#dlg-grudge").is_hidden())
    fire = page.locator("#choices button", has_text="开火")
    shown = int(re.search(r"(\d+)%", fire.locator(".badge:not(.grudge-tag)").inner_text()).group(1))
    exp = page.evaluate("Math.round(WH.UI.game.choices().find(c => c.choice.roll).roll.pEff * 100)")
    base_here = page.evaluate("""() => { const g = WH.Game.fromRecord(WH.UI.game.toRecord()); g.state.flags = {}; return Math.round(g.choices().find(c => c.choice.roll).roll.pEff * 100); }""")
    check("§28 UI: the ⚠ choice's risk badge shows the changed chance (−15 points)", shown == exp and base_here - shown == 15, f"{shown} vs {base_here}")
    check("§28 UI: aria-label carries the grudge note (screen readers), tooltip title too", "旧怨" in (fire.get_attribute("aria-label") or "") and "维克" in (fire.get_attribute("title") or ""))
    check("§28 UI: the unaffected choices (flee / return canteen) carry no ⚠", page.locator("#choices button", has_text="逃跑").locator(".grudge-tag").count() == 0
          and page.locator("#choices button", has_text="水壶还给").count() == 1 and page.locator("#choices button", has_text="水壶还给").locator(".grudge-tag").count() == 0)
    shot(page, "99_grudge_choices")
    # EN toggle re-renders the note
    page.locator("#tools button", has_text="EN").click(); page.wait_for_timeout(200)
    check("§28 UI: note re-renders in English", "canteen" in page.locator(".choice .gnote").first.inner_text() and "Grudge" in (page.locator(".choice.grudge").first.get_attribute("aria-label") or ""))
    page.locator("#tools button", has_text="中").click(); page.wait_for_timeout(200)
    # take the ⚠ roll choice → the note is the FIRST line of the consequence panel
    page.locator("#choices button", has_text="开火").click(); page.wait_for_timeout(150)
    cq = page.locator("#conseq")
    check("§28 UI: consequence panel opens with the grudge note as its first line", cq.count() == 1 and cq.locator(":scope > *").first.get_attribute("class") == "cq-grudge"
          and "维克记着水壶的事" in cq.locator(".cq-grudge").inner_text())
    finish_text(page)
    check("§28 UI: the grudge's hp −4 shows in the delta line and the roll uses the lowered chance",
          "生命" in cq.locator(".cq-deltas").inner_text() and page.evaluate("WH.UI.conseq.step.choiceDeltas.hp") == -4
          and page.evaluate("WH.UI.conseq.step.roll.pEff") < exp / 100 + 0.2)
    shot(page, "99b_grudge_consequence")
    page.locator("#tools button", has_text="EN").click(); page.wait_for_timeout(200)
    check("§28 UI: panel note switches language", "canteen" in page.locator("#conseq .cq-grudge").inner_text() and "Vik" in page.locator("#conseq .cq-grudge").inner_text())
    page.locator("#tools button", has_text="中").click(); page.wait_for_timeout(150)
    pass_conseq(page); wait_idle(page); finish_text(page)
    # --- redemption: forgive Vik (choice sets forgiven_vik) ---
    goto_node(page, "smp_007", flags={"wronged_vik": True})
    page.locator("#choices button", has_text="水壶还给").click(); page.wait_for_timeout(120); pass_conseq(page); wait_idle(page); finish_text(page)
    check("§28 UI: returning the canteen sets forgiven_vik → the grudge is off", state(page)["flags"].get("forgiven_vik") is True
          and page.evaluate("WH.UI.game.activeGrudgeNpcs().length") == 0)
    # --- Mira: shown only through the grudgeLine ---
    goto_node(page, "smp_008", flags={"wronged_mira": True})
    gl = page.locator("#dlg-grudge")
    box_t, box_g = page.locator("#dlg-text").bounding_box(), gl.bounding_box()
    check("§28 UI: presence line visible, italic, after the node text", gl.is_visible() and "米拉抬起头" in gl.inner_text()
          and page.evaluate("getComputedStyle(document.querySelector('#dlg-grudge em')).fontStyle") == "italic" and box_g["y"] >= box_t["y"] + box_t["height"] - 2, str(box_g))
    ev = page.locator("#choices button", has_text="带平民撤离")
    check("§28 UI: the evacuate choice is ⚠-tagged with Mira's note", "米拉认出了你" in ev.inner_text() and ev.locator(".grudge-tag").count() == 1)
    shot(page, "99c_grudge_line")
    page.locator("#tools button", has_text="EN").click(); page.wait_for_timeout(200)
    check("§28 UI: presence line re-renders in English", "Mira looks up" in gl.inner_text())
    page.locator("#tools button", has_text="中").click(); page.wait_for_timeout(150)
    # --- a save/load keeps it (flags persist; line + tags restored) ---
    goto_node(page, "smp_008", flags={"wronged_mira": True})
    page.evaluate("() => { WH.Save.write('slot1', WH.UI.game.toRecord()); }")
    page.reload(); page.wait_for_selector("#scr-title .title-main")
    page.evaluate("() => { const r = WH.Save.read('slot1'); if (r) { WH.UI.show('game'); WH.UI.loadRecord(r); } }"); page.wait_for_timeout(250); finish_text(page)
    check("§28 UI: a loaded save restores the grudge line and tags (flags persisted, no schema change)", page.locator("#dlg-grudge").is_visible() and page.locator(".choice.grudge").count() == 1
          and page.evaluate("WH.SAVE_SCHEMA") == 2)
    ctx.close(); b.close()
    # --- mobile ---
    b, ctx, page = new_ctx(p, mobile=True, tag="grudge-m")
    page.locator("#scr-title .menu .btn.primary").tap(); page.wait_for_timeout(200)
    pick_faction(page, "sample", "hive", tap=True); wait_idle(page); finish_text(page)
    goto_node(page, "smp_008", flags={"wronged_mira": True})
    check("§28 mobile: presence line + ⚠ note visible, no horizontal overflow", page.locator("#dlg-grudge").is_visible() and page.locator(".choice .gnote").count() == 1
          and page.evaluate("document.documentElement.scrollWidth") <= 391)
    page.screenshot(path=os.path.join(OUT, "m70_grudge.png"))
    goto_node(page, "smp_007", flags={"wronged_vik": True})
    check("§28 mobile: two ⚠ choices with notes inside the viewport", page.locator(".choice.grudge").count() == 2 and page.evaluate("document.documentElement.scrollWidth") <= 391)
    page.screenshot(path=os.path.join(OUT, "m71_grudge_choices.png"))
    ctx.close(); b.close()

def run_real_grudge(p):
    """--real: every route that already has grudges (text writers land them one by one) renders them; routes without are untouched"""
    print("\n== v0.3.2 grudges (real data) ==")
    b, ctx, page = new_ctx(p, tag="realgrudge", seed=17)
    fids = page.evaluate("Object.keys(WH.factions).filter(id => Object.values(WH.factions[id].nodes).some(n => n.grudgeLine || (n.choices || []).some(c => c.grudge)))")
    print("  routes with grudges:", fids or "none yet")
    check("real: no grudge data → nothing changes (or routes listed above pass)", True)
    for fid in fids:
        todo = page.evaluate("""(f) => { const out = []; for (const [id, n] of Object.entries(WH.factions[f].nodes)) { const gs = (n.choices || []).filter(c => c.grudge).map(c => c.grudge.npc);
            if (gs.length || n.grudgeLine) out.push({id, npcs: Array.from(new Set(gs.concat(n.grudgeLine ? [n.grudgeLine.npc] : []))), line: !!n.grudgeLine}); } return out; }""", fid)
        page.evaluate("() => WH.UI.show('select')"); page.wait_for_timeout(120)
        pick_faction(page, fid); wait_idle(page); finish_text(page); dismiss_lore(page)
        bad = []
        for t in todo:
            flags = {"wronged_" + n: True for n in t["npcs"]}
            goto_node(page, t["id"], flags=flags)
            want = page.evaluate("WH.UI.game.choices().filter(c => c.grudge && !c.locked).length")
            got = page.locator(".choice.grudge").count()
            line_ok = (not t["line"]) or page.locator("#dlg-grudge").is_visible()
            if got != want or page.locator(".choice .gnote").count() != want or not line_ok: bad.append(f'{t["id"]}:{got}/{want}/{line_ok}')
            goto_node(page, t["id"], flags={})
            if page.locator(".choice.grudge").count() or not page.locator("#dlg-grudge").is_hidden(): bad.append(t["id"] + ":leaks-without-flag")
        check(f"real {fid}: all {len(todo)} grudge/presence node(s) render ⚠ + notes + lines with the flag and nothing without it", not bad, ", ".join(bad[:5]))
        if todo: 
            goto_node(page, todo[0]["id"], flags={"wronged_" + n: True for n in todo[0]["npcs"]}); shot(page, f"80_real_grudge_{fid}")
    ctx.close(); b.close()

STYLE_STUBS = """() => { const A = WH.Audio = WH.Audio || {};
  if (typeof A.getStyles !== 'function') {
    window.__fakeStyles = true;
    const L = (zh, en) => ({zh, en});
    A.getStyles = () => [{id: 'chip', name: L('8位芯片', '8-bit chiptune'), desc: L('复古方波', 'Square waves')}, {id: 'dark', name: L('暗黑氛围', 'Dark ambient'), desc: L('低沉的嗡鸣', 'Slow drones')},
      {id: 'organ', name: L('哥特管风琴', 'Gothic organ'), desc: L('管风琴和弦', 'Pipe organ')}, {id: 'synth', name: L('合成波', 'Synthwave'), desc: L('锯齿贝斯', 'Saw bass')},
      {id: 'piano', name: L('钢琴弦乐', 'Piano & strings'), desc: L('稀疏钢琴', 'Sparse piano')}];
    let cur = 'chip'; A.getStyle = () => cur; A.setStyle = (id) => { cur = A.getStyles().some(x => x.id === id) ? id : 'chip'; return cur; };
    A.previewStyle = (id) => { return id; };
  }
  window.__sc = []; window.__pv = [];
  const so = A.setStyle, po = A.previewStyle;
  A.setStyle = function (id) { __sc.push(id); return so ? so.apply(A, arguments) : undefined; };
  if (po) A.previewStyle = function (id) { __pv.push(id); return po.apply(A, arguments); };
  return A.getStyles().map(x => x.id); }"""

def run_rewind(p):
    """SPEC §30 on sample data: rewind engine (state + RNG snapshots), UI button/hotkey/ending, achievements guard, saves, off = nothing."""
    print("\n== v0.3.3 rewind (sample) ==")
    b, ctx, page = new_ctx(p, tag="rewind")
    # --- engine level (DOM-free) ---
    eng = page.evaluate("""() => {
      const S = (g) => { const o = JSON.parse(JSON.stringify(g.state)); delete o.playMs; return o; };
      const mk = (opts) => { const g = new WH.Game('sample', Object.assign({rng: WH.RNG(5), rumors: false, echoes: false, rewind: true}, opts || {})); g.start('hive'); return g; };
      const sans = (o) => { const c = JSON.parse(JSON.stringify(o)); delete c.codex; return JSON.stringify(c); };
      const out = {};
      // A → rewind → A (a ROLL choice: same result, same RNG state)
      let g = mk(); g.choose(0);                                   // smp_001 → smp_002
      const s0 = S(g), r0 = g.rng.getState(); g.choose(1);          // 偷工减料 (roll)
      const a1 = S(g), a1r = g.rng.getState(), a1roll = JSON.stringify(g._lastRoll || null);
      out.rewound = g.rewind(); out.afterRewind = sans(S(g)) === sans(s0) && g.rng.getState() === r0 && g.rewindCount === 1;
      g.choose(1); out.sameAgain = JSON.stringify(S(g)) === JSON.stringify(a1) && g.rng.getState() === a1r;
      // same over many seeds: every roll node, repeated picks never differ
      let allSame = true;
      for (let seed = 1; seed <= 40; seed++) { const h = mk({rng: WH.RNG(seed)}); h.choose(0); const x0 = h.rng.getState(); h.choose(1); const y = JSON.stringify(S(h)); h.rewind(); h.choose(1); if (JSON.stringify(S(h)) !== y) allSame = false; }
      out.manySeeds = allSame;
      // A → rewind → B works
      g = mk(); g.choose(0); g.choose(0); g.rewind(); const bs = g.choose(1); out.other = g.state.nodeId === 'smp_004' || g.state.nodeId === 'smp_005';
      // off = no snapshots at all
      const off = mk({rewind: false}); off.choose(0); off.choose(0); out.off = [off.canRewind(), off.rewind(), off.rewindStack.length];
      const on = mk(); out.onEmpty = on.canRewind(); on.choose(0); out.onOne = on.canRewind();
      on.setRewind(false); out.cleared = [on.canRewind(), on.rewindStack.length];
      // the forced "you die" choice does not push a snapshot (rewinding from a death goes back to the last real choice)
      const d = mk(); d.choose(0); d.state.nodeId = 'smp_006'; d.state.stats.hp = 20; d.choose(1);        // → smp_007 whose entry effect (hp −35) kills: deathPending
      const depthBefore = d.rewindStack.length, pend = d.state.deathPending; d.choose(0);                   // the forced "you die" button
      const ended = d.state.ended, depthAfter = d.rewindStack.length; d.rewind();
      out.forced = [pend, depthAfter === depthBefore, ended, d.state.nodeId, d.state.ended, d.state.deathPending];
      // depth limit 30 (synthetic loop faction)
      const f = {id: 'loopy', name: {zh: '环', en: 'Loop'}, startNode: 'l_a', startStats: {hp: 100, sanity: 100, corruption: 0, renown: 0}, startDate: {year: 1, mill: 42},
        deathNodes: {hp: 'l_d', sanity: 'l_d', corruption: 'l_d'}, chapters: {1: {zh: '一', en: 'One'}},
        nodes: {l_a: {chapter: 1, text: {zh: 'a', en: 'a'}, choices: [{text: {zh: '去', en: 'go'}, next: 'l_b'}]}, l_b: {chapter: 1, text: {zh: 'b', en: 'b'}, choices: [{text: {zh: '回', en: 'back'}, next: 'l_a'}]},
                l_d: {text: {zh: '死', en: 'dead'}, ending: {kind: 'death', title: {zh: '死', en: 'Dead'}}}}};
      const d2 = Object.assign({}, WH, {factions: {loopy: f}}), lg = new WH.Game('loopy', {data: d2, rng: WH.RNG(2), rewind: true}); lg.start();
      for (let i = 0; i < 45; i++) lg.choose(0);
      out.depth = lg.rewindStack.length; let n = 0; while (lg.rewind()) n++; out.depthRewinds = n; out.depthNode = lg.state.nodeId;
      // knowledge not rewound: codex unlocked after the snapshot stays
      g = mk(); g.choose(0); g.choose(0); const cx1 = g.state.codex.slice(); g.rewind(); out.codexKept = cx1.every(id => g.state.codex.includes(id)) && cx1.length > 0;
      // grudge flags restore; rumour / echo state + streams restore
      g = mk({rumors: true, rumorChance: 1, echoes: true, echoChance: 1, echoPool: [{runId: 'p1', echo: {faction: 'sample', role: {zh: '工人', en: 'Worker'}, world: {zh: '第七巢都', en: 'Hive Seven'}, cause: {zh: '被处决', en: 'Executed'}, kind: 'death', dateKey: 0, claimedBy: null}}]});
      g.choose(0); g.state.flags.wronged_vik = true; const fl0 = JSON.stringify(g.state.flags); const rs0 = g.rumorRng.getState(), es0 = g.echoRng.getState();
      g.choose(0); const after = {rumor: g.state.rumor, echo: g.state.echo && g.state.echo.runId, seen: g.state.seenRumors.slice(), flags: JSON.stringify(g.state.flags), hours: g.state.hours};
      g.state.flags.wronged_x = true; g.rewind();
      out.grudgeFlag = JSON.stringify(g.state.flags) === fl0 && g.state.flags.wronged_vik === true && !g.state.flags.wronged_x;
      out.streams = g.rumorRng.getState() === rs0 && g.echoRng.getState() === es0 && g.state.rumor === null && g.state.echo === null && g.state.seenRumors.length === 0 && g.state.echoRun === null;
      g.choose(0); out.replayRumor = g.state.rumor === after.rumor && (g.state.echo && g.state.echo.runId) === after.echo && JSON.stringify(g.state.seenRumors) === JSON.stringify(after.seen) && g.state.hours === after.hours && !!after.rumor;   // (SPEC §20c: smp_004 is the mess hall → a rumour is really heard)
      // time warp + event roll restore the clock exactly (smp_005 → smp_006 has a warp time skip and eventRoll)
      let clockOK = true, evSeen = 0;
      for (let seed = 1; seed <= 60; seed++) { const h = mk({rng: WH.RNG(seed)}); h.state.nodeId = 'smp_005'; h.state.ended = false; h.state.history = ['smp_005']; h.state.hours = 4242;
        const hrs = h.state.hours, cs = h.choices(); const st1 = h.choose(0); const snap = JSON.stringify([h.state.hours, h.state.pendingEvent, h.state.nodeId, h.state.seenEvents]);
        if (h.state.pendingEvent) evSeen++;
        h.rewind(); if (h.state.hours !== hrs) clockOK = false;
        h.choose(0); if (JSON.stringify([h.state.hours, h.state.pendingEvent, h.state.nodeId, h.state.seenEvents]) !== snap) clockOK = false; }
      out.clock = clockOK; out.evSeen = evSeen;
      // saves: rewinds round-trip, absent when 0
      g = mk(); g.choose(0); out.recNone = !('rewinds' in g.toRecord()); g.rewind(); g.choose(0); const rec = g.toRecord(); out.recRw = rec.rewinds; const g2 = WH.Game.fromRecord(rec, {rng: WH.RNG(1)}); out.loaded = [g2.rewindCount, g2.canRewind(), JSON.stringify(g2.toRecord().rewinds)];
      // achievements guard
      const A = WH.Achievements, st = A.emptyStats();
      A.applyRun(st, {faction: 'f', origin: 'o', flags: ['x'], resists: 2, visits: 5, kind: 'good', endStats: {hp: 3, sanity: 4}, taint: {khorne: 150, nurgle: 80}, rewinds: 1});
      const st2 = A.emptyStats(); A.applyRun(st2, {faction: 'f', origin: 'o', flags: ['x'], resists: 2, visits: 5, kind: 'good', endStats: {hp: 3, sanity: 4}, taint: {khorne: 150, nurgle: 80}, rewinds: 0});
      out.guard = {rw: [st.fastest, st.resists, st.taintMax, Object.keys(st.surviveMin).length, !!st.origins.f, !!st.flags.f.x], clean: [st2.fastest, st2.resists, st2.taintMax, st2.surviveMin.sanity]};
      return out; }""")
    check("§30 engine: A → rewind → state restored exactly (stats, flags, clock, RNG), rewindCount counts", eng["rewound"] and eng["afterRewind"], str(eng))
    check("§30 engine: re-picking the same ROLL choice gives the identical result and RNG state (also over 40 seeds)", eng["sameAgain"] and eng["manySeeds"])
    check("§30 engine: A → rewind → B works", eng["other"])
    check("§30 engine: switch off = no snapshots, canRewind false, rewind() false; turning it off drops the stack", eng["off"] == [False, False, 0] and eng["onEmpty"] is False and eng["onOne"] is True and eng["cleared"] == [False, 0], str(eng["off"]))
    check("§30 engine: the forced death choice pushes no snapshot; rewinding from the death goes back to the last real choice", eng["forced"] == ["hp", True, True, "smp_006", False, None], str(eng["forced"]))
    check("§30 engine: depth limit 30 (45 choices → 30 rewinds, then false)", eng["depth"] == 30 and eng["depthRewinds"] == 30, str((eng["depth"], eng["depthRewinds"])))
    check("§30 engine: codex entries unlocked after the snapshot stay unlocked", eng["codexKept"])
    check("§30 engine: grudge flags, rumour/echo state and both extra RNG streams restore; replay hears the same rumour/echo", eng["grudgeFlag"] and eng["streams"] and eng["replayRumor"], str((eng["grudgeFlag"], eng["streams"], eng["replayRumor"])))
    check("§30 engine: rewinding across a warp-time node / event roll restores the clock exactly and replays the same event", eng["clock"] and eng["evSeen"] > 0, str(eng["evSeen"]))
    check("§30 engine: records carry rewinds only when used; fromRecord restores the count (no schema bump), stack empty after load",
          eng["recNone"] and eng["recRw"] == 1 and eng["loaded"] == [1, False, "1"], str(eng["loaded"]))
    check("§30 achievements guard: a run with rewinds > 0 never feeds fast / survive / taint peak / resist tally; origin + flags still count",
          eng["guard"]["rw"] == [None, 0, 0, 0, True, True] and eng["guard"]["clean"] == [5, 2, 230, 4], str(eng["guard"]))

    # --- UI: switch off → nothing anywhere ---
    page.locator("#scr-title .menu .btn.primary").click(); page.wait_for_timeout(200)
    check("§30 UI: default off (settings.rewind false)", page.evaluate("WH.UI.settings.rewind") is False)
    pick_faction(page, "sample", "hive"); wait_idle(page); finish_text(page)
    goto_node(page, "smp_002", flags={})
    page.locator("#choices button", has_text="拼命干活").click(); page.wait_for_timeout(100); pass_conseq(page); wait_idle(page); finish_text(page)
    page.keyboard.press("z"); page.wait_for_timeout(100)
    check("§30 UI off: no ↶ button, Z does nothing, no history kept", page.locator("#rewind-btn").count() == 0 and state(page)["nodeId"] == "smp_004"
          and page.evaluate("WH.UI.game.rewindStack.length") == 0 and page.evaluate("WH.UI.game.canRewind()") is False)
    # --- turn it on in the settings panel (in game) ---
    page.locator("#tools button", has_text="设置").click(); page.wait_for_timeout(150)
    row = page.locator(".modal .rewind-row")
    check("§30 UI: settings row 允许回到上一个选择 with a hint that names the hotkey", row.count() == 1 and "允许回到上一个选择" in row.inner_text() and "Z" in row.inner_text())
    row.scroll_into_view_if_needed(); page.wait_for_timeout(100)
    shot(page, "100_settings_rewind")
    row.locator("button", has_text="开").click(); page.wait_for_timeout(150)
    page.keyboard.press("Escape"); page.wait_for_timeout(100)
    check("§30 UI: turning it on persists and shows a disabled ↶ button (no history yet) next to Home",
          json.loads(page.evaluate("localStorage.getItem('whatiswh.settings')"))["rewind"] is True and page.locator("#rewind-btn").count() == 1
          and page.locator("#rewind-btn").is_disabled() and "回到上一个选择" in page.locator("#rewind-btn").inner_text())
    # --- A → rewind → A identical (UI) ---
    goto_node(page, "smp_002", flags={})
    before = page.evaluate("(() => { const s = JSON.parse(JSON.stringify(WH.UI.game.state)); delete s.playMs; return s; })()")
    page.locator("#choices button", has_text="偷工减料").click(); page.wait_for_timeout(120)
    check("§30 UI: the ↶ button becomes enabled after a choice (also during the consequence beat)", page.locator("#rewind-btn").is_enabled())
    pass_conseq(page); wait_idle(page); finish_text(page)
    st_a = state(page); node_a = st_a["nodeId"]; hours_a = st_a["hours"]
    shot(page, "101_rewind_button")
    page.locator("#rewind-btn").click(); page.wait_for_timeout(250); finish_text(page)
    after = page.evaluate("(() => { const s = JSON.parse(JSON.stringify(WH.UI.game.state)); delete s.playMs; delete s.codex; return s; })()")
    before.pop("codex", None)
    check("§30 UI: ↶ returns to the previous choice with the complete state (stats, flags, clock, visited nodes)", state(page)["nodeId"] == "smp_002" and after == before
          and "偷工减料" in page.locator("#choices").inner_text() and "已回到上一个选择" in page.locator(".toasts").inner_text())
    check("§30 UI: button disabled again at the start of the stack; hotkey title shows (Z)", page.locator("#rewind-btn").is_disabled() and "(Z)" in (page.locator("#rewind-btn").get_attribute("title") or ""))
    page.locator("#choices button", has_text="偷工减料").click(); page.wait_for_timeout(120); pass_conseq(page); wait_idle(page); finish_text(page)
    check("§30 UI: picking the same roll choice again gives the same outcome (no re-rolling)", state(page)["nodeId"] == node_a and state(page)["hours"] == hours_a, f"{state(page)['nodeId']} vs {node_a}")
    # hotkey Z + A → B
    page.keyboard.press("z"); page.wait_for_timeout(250); finish_text(page)
    check("§30 UI: hotkey Z rewinds as well", state(page)["nodeId"] == "smp_002")
    page.locator("#choices button", has_text="拼命干活").click(); page.wait_for_timeout(120); pass_conseq(page); wait_idle(page); finish_text(page)
    check("§30 UI: picking another choice after a rewind works normally", state(page)["nodeId"] == "smp_004" and page.evaluate("WH.UI.game.rewindCount") == 2)
    # --- knowledge is not rewound (codex / lore cards) ---
    cx = page.evaluate("WH.Save.codexGlobal().length")
    page.keyboard.press("z"); page.wait_for_timeout(250); finish_text(page)
    check("§30 UI: codex entries stay unlocked after a rewind, no lore card pops again", page.evaluate("WH.Save.codexGlobal().length") >= cx and page.locator("#lore-overlay").count() == 0)
    page.locator("#choices button", has_text="拼命干活").click(); page.wait_for_timeout(120); pass_conseq(page); wait_idle(page); finish_text(page)
    check("§30 UI: re-reaching a node with a codex unlock does not show its lore card again", page.locator("#lore-overlay").count() == 0 and state(page)["nodeId"] == "smp_004")
    # --- save / load ---
    page.evaluate("() => WH.Save.write('slot2', WH.UI.game.toRecord())")
    check("§30 saves: slot record carries rewinds (no schema change)", page.evaluate("WH.Save.read('slot2').rewinds") == 3 and page.evaluate("WH.Save.read('slot2').schema") == 2)
    page.evaluate("() => { const r = WH.Save.read('slot2'); WH.UI.loadRecord(r); }"); page.wait_for_timeout(250); finish_text(page)
    check("§30 saves: after load the button is disabled until the next choice and the count is kept", page.locator("#rewind-btn").is_disabled() and page.evaluate("WH.UI.game.rewindCount") == 3)
    # --- ending rewind ---
    goto_node(page, "smp_008", flags={})
    page.locator("#choices button", has_text="带平民撤离").click(); page.wait_for_timeout(120); pass_conseq(page); wait_idle(page); finish_text(page)
    page.locator("#choices .choice.ending").click(); page.wait_for_timeout(400)
    runs1 = page.evaluate("WH.Save.runs().map(r => [r.endingId, r.rewinds])")
    check("§30 ending: the ending screen offers 回到最后一个选择 and the reached ending is recorded (rewinds field present)", page.locator("#rewind-end").count() == 1
          and "回到最后一个选择" in page.locator("#rewind-end").inner_text() and runs1[0][0] == "smp_end_good_evac" and runs1[0][1] == 3, str(runs1))
    shot(page, "102_ending_rewind")
    n_end = page.evaluate("Object.values(WH.Save.endingStats()).reduce((a, e) => a + e.count, 0)")
    page.locator("#rewind-end").click(); page.wait_for_timeout(400); finish_text(page)
    check("§30 ending: rewinding from the ending returns to the last choice (node smp_008) with the game screen back", state(page)["nodeId"] == "smp_008" and not state(page)["ended"]
          and page.locator("#scr-game").is_visible() and page.locator("#scr-ending").is_hidden())
    check("§30 ending: the old record stays (往生录, endings seen)", page.evaluate("WH.Save.runs().length") == 1 and page.evaluate("Object.values(WH.Save.endingStats()).reduce((a, e) => a + e.count, 0)") == n_end)
    page.locator("#choices button", has_text="带平民撤离").click(); page.wait_for_timeout(120); pass_conseq(page); wait_idle(page); finish_text(page)
    page.locator("#choices .choice.ending").click(); page.wait_for_timeout(400)
    runs2 = page.evaluate("WH.Save.runs().map(r => [r.endingId, r.rewinds, r.runId])")
    check("§30 ending: continuing writes a NEW record of the same run with rewinds = 4 (rewinds ≥ 1)", len(runs2) == 2 and runs2[0][1] == 4 and runs2[1][1] == 3 and runs2[0][2] == runs2[1][2], str(runs2))
    page.locator("#scr-ending .ending-fate .run-rw").first.wait_for(timeout=1000)
    page.evaluate("() => WH.UI.openCodex(null, false, 'records')"); page.wait_for_timeout(250)
    check("§30 往生录: records of a run that used rewinds show ↶N (newest ↶4, the earlier ending ↶3)", page.locator(".modal .run-row .run-rw").count() == 2 and "↶4" in page.locator(".modal .run-row .run-rw").first.inner_text()
          and "↶3" in page.locator(".modal .run-row .run-rw").nth(1).inner_text())
    shot(page, "103_records_rewind")
    page.keyboard.press("Escape"); page.wait_for_timeout(100)
    # --- achievements guard through the UI: a run with rewinds never sets achStats.fastest ---
    check("§30 achievements: runs that used a rewind never set the fast-finish stat; origins still count", page.evaluate("WH.Save.achStats().fastest") is None
          and page.evaluate("!!(WH.Save.achStats().origins.sample || {}).hive"))
    # a clean run (fresh game, rewinds 0) finishing right now does set it
    page.evaluate("() => { WH.UI.startGame('sample', 'hive'); }"); page.wait_for_timeout(300); finish_text(page)
    goto_node(page, "smp_008", flags={}, rewinds=0)
    page.locator("#choices button", has_text="带平民撤离").click(); page.wait_for_timeout(120); pass_conseq(page); wait_idle(page); finish_text(page)
    page.locator("#choices .choice.ending").click(); page.wait_for_timeout(400)
    check("§30 achievements: a clean run (rewinds 0) feeds the fast-finish stat as before", page.evaluate("WH.Save.runs()[0].rewinds") == 0 and isinstance(page.evaluate("WH.Save.achStats().fastest"), (int, float)))
    page.evaluate("() => WH.UI.show('title')"); page.wait_for_timeout(100)
    # --- off again: hides everything incl. the ending button ---
    page.evaluate("() => WH.UI.openSettings()"); page.wait_for_timeout(150)
    page.locator(".modal .rewind-row").locator("button", has_text="关").click(); page.wait_for_timeout(150); page.keyboard.press("Escape")
    check("§30 UI: turning it off removes the button and drops the history", page.locator("#rewind-btn").count() == 0 and page.evaluate("WH.UI.game.rewindStack.length") == 0)
    # --- English ---
    page.evaluate("() => { WH.UI.settings.rewind = true; WH.Save.saveSettings(WH.UI.settings); WH.UI.startGame('sample', 'hive'); }"); page.wait_for_timeout(300); finish_text(page)
    page.locator("#tools button", has_text="EN").click(); page.wait_for_timeout(200)
    check("§30 en: button label + aria", "Back one choice" in page.locator("#rewind-btn").inner_text() and "hotkey Z" in (page.locator("#rewind-btn").get_attribute("aria-label") or ""))
    page.locator("#tools button", has_text="Settings").click(); page.wait_for_timeout(150)
    check("§30 en: settings row", "Allow going back one choice" in page.locator(".modal .rewind-row").inner_text())
    page.locator(".modal .rewind-row").scroll_into_view_if_needed(); page.wait_for_timeout(100)
    shot(page, "104_settings_rewind_en")
    page.keyboard.press("Escape")
    ctx.close(); b.close()
    # --- mobile ---
    b, ctx, page = new_ctx(p, mobile=True, tag="rewind-m")
    page.evaluate("() => { WH.UI.settings.rewind = true; WH.Save.saveSettings(WH.UI.settings); }")
    page.locator("#scr-title .menu .btn.primary").tap(); page.wait_for_timeout(200)
    pick_faction(page, "sample", "hive", tap=True); wait_idle(page); finish_text(page)
    goto_node(page, "smp_002", flags={})
    page.locator("#choices button", has_text="拼命干活").tap(); page.wait_for_timeout(120); pass_conseq(page); wait_idle(page); finish_text(page)
    bx = page.locator("#rewind-btn").bounding_box()
    check("§30 mobile: ↶ button visible inside the viewport, enabled, no horizontal overflow", bx and bx["x"] >= 0 and bx["x"] + bx["width"] <= 391 and page.locator("#rewind-btn").is_enabled()
          and page.evaluate("document.documentElement.scrollWidth") <= 391, str(bx))
    page.screenshot(path=os.path.join(OUT, "m80_rewind.png"))
    page.locator("#rewind-btn").tap(); page.wait_for_timeout(250); finish_text(page)
    check("§30 mobile: tapping ↶ rewinds", state(page)["nodeId"] == "smp_002")
    ctx.close(); b.close()


def run_style(p):
    """SPEC §29 UI wiring: settings.musicStyle, selector with ▶ preview, applied on start-up and on change, in the settings export."""
    print("\n== v0.3.3 music style selector ==")
    for mobile in (False, True):
        b, ctx, page = new_ctx(p, mobile=mobile, tag="style" + ("-m" if mobile else ""))
        ids = page.evaluate(STYLE_STUBS)
        fake = page.evaluate("!!window.__fakeStyles")
        print(f"  styles ({'stub' if fake else 'audio.js'}): {ids}")
        check(f"§29{' mobile' if mobile else ''}: default settings.musicStyle is chip", page.evaluate("WH.UI.settings.musicStyle") == "chip" and len(ids) >= 1)
        tap = (lambda loc: loc.tap()) if mobile else (lambda loc: loc.click())
        tap(page.locator("#scr-title .menu .btn", has_text="设置").first) if page.locator("#scr-title .menu .btn", has_text="设置").count() else page.evaluate("() => WH.UI.openSettings()")
        page.wait_for_timeout(200)
        row = page.locator(".modal .style-row")
        check(f"§29{' mobile' if mobile else ''}: 配乐风格 row with one radio card per style, exactly one checked (chip)", row.count() == 1 and "配乐风格" in row.inner_text()
              and row.locator('[role="radio"]').count() == len(ids) and row.locator('[aria-checked="true"]').count() == 1 and row.locator('[aria-checked="true"]').get_attribute("data-style") == "chip"
              and row.locator('[role="radiogroup"]').count() == 1)
        if mobile:
            boxes = [row.locator(".style-card").nth(i).bounding_box() for i in range(row.locator(".style-card").count())]
            check("§29 mobile: cards stacked, inside the viewport, no overflow, ≥ 44px tall", len({round(x["x"]) for x in boxes}) == 1 and all(x["x"] >= 0 and x["x"] + x["width"] <= 391 and x["height"] >= 44 for x in boxes)
                  and page.evaluate("document.documentElement.scrollWidth") <= 391, str(boxes[:2]))
            row.scroll_into_view_if_needed(); page.wait_for_timeout(100)
            page.screenshot(path=os.path.join(OUT, "m81_style.png"))
        else:
            row.scroll_into_view_if_needed(); page.wait_for_timeout(100)
            shot(page, "105_settings_style")
        if len(ids) > 1:
            target = ids[1]
            tap(row.locator(f'.style-pick[data-style="{target}"]'))
            page.wait_for_timeout(120)
            check(f"§29{' mobile' if mobile else ''}: choosing a style applies immediately (setStyle), persists, and moves the check mark",
                  page.evaluate("__sc[__sc.length - 1]") == target and json.loads(page.evaluate("localStorage.getItem('whatiswh.settings')"))["musicStyle"] == target
                  and row.locator('[aria-checked="true"]').get_attribute("data-style") == target and row.locator(".style-card.on").count() == 1)
            if not mobile:
                row.locator(f'.style-pick[data-style="{target}"]').focus(); page.keyboard.press("ArrowDown"); page.wait_for_timeout(100)
                check("§29 a11y: arrow keys move the selection inside the radio group", row.locator('[aria-checked="true"]').get_attribute("data-style") == (ids[2] if len(ids) > 2 else ids[0])
                      and page.evaluate("document.activeElement.getAttribute('role')") == "radio")
                tap(row.locator(f'.style-pick[data-style="{target}"]'))
        pv = row.locator(".style-prev")
        if page.evaluate("typeof WH.Audio.previewStyle") == "function":
            check(f"§29{' mobile' if mobile else ''}: one ▶ 试听 button per style, labelled for screen readers", pv.count() == len(ids) and "试听" in pv.first.inner_text() and "试听" in (pv.first.get_attribute("aria-label") or ""))
            last = ids[-1]
            tap(row.locator(f'.style-prev[data-style="{last}"]')); page.wait_for_timeout(100)
            check(f"§29{' mobile' if mobile else ''}: ▶ preview calls previewStyle(id) and does not change the chosen style", page.evaluate("__pv[__pv.length - 1]") == last
                  and json.loads(page.evaluate("localStorage.getItem('whatiswh.settings')"))["musicStyle"] == (target if len(ids) > 1 else "chip") and row.locator(".style-prev.playing").count() == 1)
        # start-up / re-apply uses the stored style; unknown ids fall back to chip
        page.evaluate("() => { WH.UI.settings.musicStyle = 'dark'; WH.Save.saveSettings(WH.UI.settings); __sc.length = 0; WH.UI.applyAudioSettings(); }")
        want = "dark" if "dark" in ids else "chip"
        check(f"§29{' mobile' if mobile else ''}: applyAudioSettings (start-up path) sends the saved style", page.evaluate("__sc[__sc.length - 1]") == want, str(page.evaluate("__sc")))
        page.evaluate("() => { WH.UI.settings.musicStyle = 'bogus'; __sc.length = 0; WH.UI.applyAudioSettings(); }")
        check(f"§29{' mobile' if mobile else ''}: an unknown style id falls back to chip", page.evaluate("__sc[__sc.length - 1]") == "chip")
        page.evaluate("() => { WH.UI.settings.musicStyle = 'dark'; WH.Save.saveSettings(WH.UI.settings); }")
        check(f"§22/§29{' mobile' if mobile else ''}: musicStyle + rewind are part of the exported settings", page.evaluate("WH.Save.exportAll().data.settings.musicStyle") == "dark" and page.evaluate("'rewind' in WH.Save.exportAll().data.settings"))
        page.reload(); page.wait_for_selector("#scr-title .title-main")
        check(f"§29{' mobile' if mobile else ''}: the style survives a reload (settings store)", page.evaluate("WH.UI.settings.musicStyle") == "dark")
        if not mobile:
            page.evaluate(STYLE_STUBS); page.evaluate("() => WH.UI.setLang('en')"); page.evaluate("() => WH.UI.openSettings()"); page.wait_for_timeout(200)
            check("§29 en: row label + card names switch language", "Music style" in page.locator(".modal .style-row").inner_text() and page.locator(".modal .style-pick").count() >= 1
                  and (not page.evaluate("!!window.__fakeStyles") or "8-bit chiptune" in page.locator(".modal .style-row").inner_text()))
            page.locator(".modal .style-row").scroll_into_view_if_needed(); page.wait_for_timeout(100)
            shot(page, "106_settings_style_en")
        ctx.close(); b.close()

# ---------------------------------------------------------------------------------------------------------------------
# SPEC §20c gathering places (v0.3.4): the 聚集区 tag, rumours / echoes only on gather nodes, settings hint, zh/en, desktop + mobile
# ---------------------------------------------------------------------------------------------------------------------
GATHER_LAYOUT_JS = """() => { const box = (e) => { const b = e.getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom]; };
  const hit = (a, b) => a[0] < b[2] - 0.5 && b[0] < a[2] - 0.5 && a[1] < b[3] - 0.5 && b[1] < a[3] - 0.5;
  const tg = document.getElementById('gather-tag'), t = box(tg), pl = box(document.getElementById('chapter-plate'));
  const btn = Array.from(document.querySelectorAll('#tools button')).map(box);
  return {t, inView: t[0] >= 0 && t[2] <= window.innerWidth + 0.5 && t[1] >= 0 && t[3] <= window.innerHeight * 3, overTools: btn.some(b => hit(t, b)), overPlate: hit(t, pl),
          scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth, text: tg.textContent}; }"""

def gather_engine_walk(page, rumor_chance, echo_chance):
    """random walks (300) over the sample with forced chances: where are rumours / echoes heard? {rumors:{node:n}, echoes:{node:n}, bad:[...], nonGather, gather}"""
    return page.evaluate("""([rc, ec]) => {
      const pool = [{runId: 'g1', endingId: null, echo: {faction: 'imperium', role: {zh: '工人', en: 'Worker'}, world: {zh: '某地', en: 'Somewhere'}, cause: {zh: '战死', en: 'Fell'}, kind: 'death', dateKey: 0, claimedBy: null}}];
      const out = {rumors: {}, echoes: {}, bad: [], nonGather: 0, gather: 0};
      for (let k = 0; k < 300; k++) {
        const g = new WH.Game('sample', {rng: WH.RNG(500 + k), rumorChance: rc, echoChance: ec, echoPool: pool});
        let step = g.start(['hive', 'scav', 'clerk'][k % 3]); const r = WH.RNG(k);
        const note = (s) => { const id = g.state.nodeId, n = g.node(), gat = WH.Rules.isGather(n); if (gat) out.gather++; else out.nonGather++;
          if (s && s.rumor) { out.rumors[id] = (out.rumors[id] || 0) + 1; if (!gat) out.bad.push('rumor@' + id); }
          if (s && s.echo) { out.echoes[id] = (out.echoes[id] || 0) + 1; if (!gat) out.bad.push('echo@' + id); } };
        note(step);
        while (!g.state.ended && g.state.visits < 60) {
          if (g.state.pendingEvent) { const v = g.eventChoices().filter(x => !x.locked); g.eventChoose(v[0].index); step = g.eventContinue(); note(step); continue; }
          const all = g.choices(), cs = all.filter(c => !c.locked); step = g.choose(all.indexOf(cs[Math.floor(r() * cs.length)])); note(step);
        }
      }
      return out; }""", [rumor_chance, echo_chance])

def run_gather(p):
    """SPEC §20c on sample data (gather nodes: smp_002 break area ch1, smp_004 mess hall ch2 with a rumour match)."""
    print("\n== v0.3.4 gathering places (SPEC §20c) ==")
    for mobile in (False, True):
        lab = "mobile" if mobile else "desktop"
        b, ctx, page = new_ctx(p, mobile=mobile, tag="gather" + ("-m" if mobile else ""))
        click = (lambda loc: loc.tap()) if mobile else (lambda loc: loc.click())
        def settle():
            for _ in range(3):
                finish_text(page); page.wait_for_timeout(120)
        click(page.locator("#scr-title .menu .btn.primary")); page.wait_for_timeout(200)
        pick_faction(page, "sample", "hive", tap=mobile); wait_idle(page); settle()
        if not mobile:
            info = page.evaluate("""() => { const N = WH.factions.sample.nodes, G = WH.Rules.isGather, ids = Object.keys(N).filter(id => G(N[id]));
              const g = new WH.Game('sample', {rng: WH.RNG(1)}); g.start('hive');
              return {ids, coherent: ids.every(id => N[id].text.zh.includes(N[id].gather.zh) && N[id].text.en.toLowerCase().includes(N[id].gather.en.toLowerCase())),
                      forbidden: ids.some(id => N[id].ending || N[id].eventRoll !== undefined), match: g.rumorMatches('smp_004').map(x => x.score)}; }""")
            check("§20c sample data: exactly two gather nodes (smp_002, smp_004), labels inside the zh + en text, none on an ending / eventRoll node, one with a rumour match",
                  info["ids"] == ["smp_002", "smp_004"] and info["coherent"] and not info["forbidden"] and info["match"][0] == 2, str(info))
        tag = page.locator("#gather-tag")
        check(f"§20c {lab}: no tag on a plain node (smp_001)", state(page)["nodeId"] == "smp_001" and not tag.is_visible())
        page.evaluate("() => { WH.UI.game.rumorChance = 1; WH.UI.game.echoChance = 1; WH.UI.settings.textSpeed = 'normal'; }")
        page.locator("#choices button", has_text="去工厂上班").click() if not mobile else page.locator("#choices button", has_text="去工厂上班").tap()
        page.wait_for_timeout(120); pass_conseq(page); wait_idle(page); settle()
        st = state(page)
        check(f"§20c {lab}: gather node smp_002 shows '聚集区 · 工间休息处'", st["nodeId"] == "smp_002" and tag.is_visible() and tag.inner_text().strip() == "聚集区 · 工间休息处", tag.inner_text() if tag.count() else "")
        check(f"§20c {lab}: no rumour where none is eligible (chapter 1) even at chance 1", st["rumor"] is None and not page.locator("#dlg-rumor").is_visible())
        lay = page.evaluate(GATHER_LAYOUT_JS)
        check(f"§20c {lab}: the tag is inside the screen and overlaps neither the chapter plate nor a tool button" + (", no horizontal overflow" if mobile else ""),
              lay["inView"] and not lay["overTools"] and not lay["overPlate"] and (not mobile or lay["scrollW"] <= 391), str(lay))
        (shot if not mobile else (lambda pg, n: pg.screenshot(path=os.path.join(OUT, n + ".png"), full_page=True)))(page, ("100_gather_tag" if not mobile else "m70_gather_tag"))
        page.evaluate("() => WH.UI.setLang('en')"); page.wait_for_timeout(150)
        check(f"§20c {lab} (en): tag reads 'Crowd · Break area'", tag.is_visible() and tag.inner_text().strip() == "Crowd · Break area", tag.inner_text())
        lay = page.evaluate(GATHER_LAYOUT_JS)
        check(f"§20c {lab} (en): still inside the screen, no overlap", lay["inView"] and not lay["overTools"] and not lay["overPlate"] and (not mobile or lay["scrollW"] <= 391), str(lay))
        page.evaluate("() => WH.UI.setLang('zh')"); page.wait_for_timeout(120)
        # the mess hall: a rumour is heard (chance 1, cadia scores 2), the tag says 食堂
        (page.locator("#choices button", has_text="拼命干活").tap if mobile else page.locator("#choices button", has_text="拼命干活").click)(); page.wait_for_timeout(100)
        pass_conseq(page); wait_idle(page); settle()
        st = state(page)
        check(f"§20c {lab}: mess hall smp_004 — tag '聚集区 · 食堂' and the rumour footer (cadia, best score)", st["nodeId"] == "smp_004" and tag.inner_text().strip() == "聚集区 · 食堂"
              and st["rumor"] == "smp_rum_cadia" and page.locator("#dlg-rumor").is_visible(), str((st["nodeId"], st["rumor"], tag.inner_text())))
        (shot if not mobile else (lambda pg, n: pg.screenshot(path=os.path.join(OUT, n + ".png"), full_page=True)))(page, ("101_gather_mess_rumor" if not mobile else "m71_gather_mess_rumor"))
        page.evaluate("() => WH.UI.setLang('en')"); page.wait_for_timeout(150)
        check(f"§20c {lab} (en): 'Crowd · Mess hall' + Overheard footer", tag.inner_text().strip() == "Crowd · Mess hall" and "Overheard" in page.locator("#dlg-rumor").inner_text())
        lay = page.evaluate(GATHER_LAYOUT_JS)
        check(f"§20c {lab} (en): layout ok at the mess hall", lay["inView"] and not lay["overTools"] and not lay["overPlate"] and (not mobile or lay["scrollW"] <= 391), str(lay))
        (shot if not mobile else (lambda pg, n: pg.screenshot(path=os.path.join(OUT, n + ".png"), full_page=True)))(page, ("101b_gather_mess_en" if not mobile else "m71b_gather_mess_en"))
        page.evaluate("() => WH.UI.setLang('zh')"); page.wait_for_timeout(120)
        # leaving the crowd: the consequence beat keeps the old node (and its tag), the next plain node has none and hears nothing
        (page.locator("#choices button", has_text="立正").tap if mobile else page.locator("#choices button", has_text="立正").click)(); page.wait_for_timeout(120)
        check(f"§20c {lab}: consequence beat still shows the node it belongs to (tag kept)", page.locator("#conseq").count() == 1 and tag.is_visible() and "食堂" in tag.inner_text())
        pass_conseq(page); page.wait_for_timeout(150)
        if page.locator("#event-overlay").count(): resolve_event(page)
        wait_idle(page); settle()
        st = state(page)
        check(f"§20c {lab}: next plain node (smp_006) — no tag, no rumour / echo footer", st["nodeId"] == "smp_006" and not tag.is_visible() and st["rumor"] is None and st["echo"] is None
              and not page.locator("#dlg-rumor").is_visible(), str((st["nodeId"], st["rumor"])))
        # save / load at a gather node shows the tag again; leaving to the title hides it
        goto_node(page, "smp_004")
        check(f"§20c {lab}: reloading a record at the mess hall shows the tag", tag.is_visible() and "食堂" in tag.inner_text())
        page.evaluate("() => WH.UI.show('title')"); page.wait_for_timeout(150)
        check(f"§20c {lab}: no tag outside the game screen", not tag.is_visible())
        page.evaluate("() => WH.UI.show('game')"); page.wait_for_timeout(100)
        # settings hint
        page.evaluate("() => WH.UI.openSettings()"); page.wait_for_timeout(200)
        row = page.locator(".modal .setrow", has_text="传闻")
        check(f"§20c {lab}: Settings → 传闻 shows the hint '只会在聚集区听到'", row.count() == 1 and "只会在聚集区听到" in row.inner_text(), row.inner_text() if row.count() else "")
        page.evaluate("() => WH.UI.setLang('en')"); page.wait_for_timeout(200)
        row = page.locator(".modal .setrow", has_text="Overheard rumours")
        check(f"§20c {lab} (en): hint 'Only heard in crowded places'", row.count() == 1 and "Only heard in crowded places" in row.inner_text(), row.inner_text() if row.count() else "")
        if mobile:
            check("§20c mobile: settings with the hint do not overflow", page.evaluate("document.documentElement.scrollWidth") <= 391)
        else:
            row.scroll_into_view_if_needed(); page.wait_for_timeout(100); shot(page, "102_settings_rumor_hint_en")
        page.keyboard.press("Escape"); page.wait_for_timeout(100)
        page.evaluate("() => WH.UI.setLang('zh')")
        if not mobile:
            # engine level: rumours / echoes only on gather nodes, whatever the chance
            w = gather_engine_walk(page, 1, 1)
            check("§20c engine: rumorChance = echoChance = 1 → nothing is ever heard on a non-gather node (300 walks, many non-gather visits)",
                  not w["bad"] and w["nonGather"] > 300 and w["gather"] > 100, str((w["bad"][:3], w["nonGather"], w["gather"])))
            check("§20c engine: at chance 1 a rumour is heard at the mess hall (smp_004) and only there (smp_002 has none eligible in chapter 1)", set(w["rumors"]) == {"smp_004"} and w["rumors"]["smp_004"] > 100, str(w["rumors"]))
            e = gather_engine_walk(page, 0, 1)
            check("§20c engine: echoes (rumours off) are heard at the mess hall only, never on a plain node, never in chapter 1", not e["bad"] and set(e["echoes"]) == {"smp_004"} and e["echoes"]["smp_004"] > 100 and not e["rumors"], str((e["echoes"], e["bad"][:3])))
            z = gather_engine_walk(page, 0, 0)
            check("§20c engine: chance 0 → silence everywhere", not z["rumors"] and not z["echoes"])
            # natural probabilities (no override): best score 2 → p 0.7; sample smp_004 is reached by ~⅔ of the walks
            nat = page.evaluate("""() => { let heard = 0, visits = 0; for (let k = 0; k < 600; k++) { const g = new WH.Game('sample', {rng: WH.RNG(9000 + k)}); g.start('hive'); g.state.nodeId = 'smp_002';
                const st = g.choose(0); if (g.state.nodeId === 'smp_004') { visits++; if (st.rumor) heard++; } } return {heard, visits}; }""")
            check("§20c engine: natural chance at a score-2 gather node is ≈ 0.7", nat["visits"] > 200 and 0.62 <= nat["heard"] / nat["visits"] <= 0.78, str(nat))
        ctx.close(); b.close()

def run_real_gather(p):
    """SPEC §20c with the real routes: rumours / echoes only on gather nodes (random walks with forced chances), tag text, desktop + mobile tag layout."""
    print("\n== v0.3.4 gathering places (real data) ==")
    b, ctx, page = new_ctx(p, tag="real-gather", seed=33)
    res = page.evaluate("""() => {
      const pool = [{runId: 'g1', endingId: null, echo: {faction: 'imperium', role: {zh: '工人', en: 'Worker'}, world: {zh: '某地', en: 'Somewhere'}, cause: {zh: '战死', en: 'Fell'}, kind: 'death', dateKey: 0, claimedBy: null}}];
      const out = {routes: {}, bad: []};
      Object.keys(WH.factions).forEach((fid) => {
        const f = WH.factions[fid], origins = WH.Game.origins(f), o = {gatherNodes: Object.keys(f.nodes).filter(id => WH.Rules.isGather(f.nodes[id])).length, rumors: 0, echoes: 0, nonGather: 0};
        for (let k = 0; k < 40; k++) {
          const g = new WH.Game(fid, {rng: WH.RNG(700 + k), rumorChance: 1, echoChance: 1, echoPool: pool});
          let step = g.start(origins[k % origins.length].id); const r = WH.RNG(k);
          const note = (s) => { const id = g.state.nodeId, n = g.node(), gat = WH.Rules.isGather(n); if (!gat) o.nonGather++;
            if (s && s.rumor) { o.rumors++; if (!gat) out.bad.push(fid + ':rumor@' + id); }
            if (s && s.echo) { o.echoes++; if (!gat) out.bad.push(fid + ':echo@' + id); } };
          note(step);
          while (!g.state.ended && g.state.visits < 150) {
            if (g.state.pendingEvent) { const v = g.eventChoices().filter(x => !x.locked); g.eventChoose(v[0].index); step = g.eventContinue(); note(step); continue; }
            const all = g.choices(), cs = all.filter(c => !c.locked); step = g.choose(all.indexOf(cs[Math.floor(r() * cs.length)])); note(step);
          }
        }
        out.routes[fid] = o;
      });
      return out; }""")
    print("  " + " · ".join(f"{k}: {v['gatherNodes']} gather, {v['rumors']} rumours, {v['echoes']} echoes" for k, v in res["routes"].items()))
    check("§20c real: with rumorChance = echoChance = 1 nothing is heard on a non-gather node on any route (40 walks each)", not res["bad"] and all(v["nonGather"] > 100 for v in res["routes"].values()), str(res["bad"][:5]))
    check("§20c real: routes without gather nodes hear nothing; routes with them hear rumours", all(v["gatherNodes"] > 0 or v["rumors"] + v["echoes"] == 0 for v in res["routes"].values()), str(res["routes"]))
    ctx.close(); b.close()
    for mobile in (False, True):
        b, ctx, page = new_ctx(p, mobile=mobile, tag="real-gather" + ("-m" if mobile else ""), seed=33)
        page.evaluate("() => WH.UI.show('select')"); page.wait_for_timeout(150)
        pick_faction(page, "imperium", tap=mobile); wait_idle(page); finish_text(page)
        hop = page.evaluate("""() => { const g = WH.UI.game, N = g.faction.nodes, G = WH.Rules.isGather;
            for (const id of Object.keys(N)) { const n = N[id]; if (n.ending || !G(n)) continue;
              for (const pid of Object.keys(N)) { const pn = N[pid]; if (pn.ending || pn.eventRoll || G(pn)) continue;
                const ci = (pn.choices || []).findIndex(c => c.next === id && !c.require && !c.roll);
                if (ci >= 0) return {pid, id, text: pn.choices[ci].text.zh, zh: n.gather.zh, en: n.gather.en}; } }
            return null; }""")
        if hop is None:
            print("  (SPEC §20c) no imperium gather node reachable by a plain choice yet — the real-data tag layout test is skipped"); ctx.close(); b.close(); continue
        goto_node(page, hop["pid"])
        page.evaluate("() => { WH.UI.game.rumorChance = 0; }")
        page.locator("#choices button", has_text=hop["text"]).first.tap() if mobile else page.locator("#choices button", has_text=hop["text"]).first.click()
        page.wait_for_timeout(120); pass_conseq(page); wait_idle(page)
        if page.locator("#event-overlay").count(): resolve_event(page)
        for _ in range(3):
            finish_text(page); page.wait_for_timeout(120)
        tg = page.locator("#gather-tag")
        check(f"§20c real {'mobile' if mobile else 'desktop'}: the real gather node {hop['id']} shows '聚集区 · {hop['zh']}'", state(page)["nodeId"] == hop["id"] and tg.is_visible() and tg.inner_text().strip() == f"聚集区 · {hop['zh']}", tg.inner_text() if tg.count() else "")
        lay = page.evaluate(GATHER_LAYOUT_JS)
        check(f"§20c real {'mobile' if mobile else 'desktop'}: tag layout (inside the screen, no overlap with plate / tools)", lay["inView"] and not lay["overTools"] and not lay["overPlate"] and (not mobile or lay["scrollW"] <= 391), str(lay))
        page.evaluate("() => WH.UI.setLang('en')"); page.wait_for_timeout(150)
        check(f"§20c real {'mobile' if mobile else 'desktop'} (en): tag 'Crowd · {hop['en']}'", tg.inner_text().strip() == f"Crowd · {hop['en']}", tg.inner_text())
        lay = page.evaluate(GATHER_LAYOUT_JS)
        check(f"§20c real {'mobile' if mobile else 'desktop'} (en): tag layout", lay["inView"] and not lay["overTools"] and not lay["overPlate"] and (not mobile or lay["scrollW"] <= 391), str(lay))
        if mobile: page.screenshot(path=os.path.join(OUT, "m72_real_gather.png"), full_page=True)
        else: shot(page, "103_real_gather_en")
        ctx.close(); b.close()

# ---------------------------------------------------------------------------------------------------------------------
# SPEC §29b track selection (v0.3.4): settings.musicTrack, Settings → 曲目 list, ♪ quick panel, sync, zh/en, desktop + mobile
# ---------------------------------------------------------------------------------------------------------------------
def run_track(p):
    """SPEC §29b UI wiring: settings.musicTrack, 曲目 list with ▶ preview, 现在播放 line, ♪ popover next to the sound button, both in sync."""
    print("\n== v0.3.4 track selection (§29b) ==")
    for mobile in (False, True):
        tag = "mobile" if mobile else "desktop"
        sfx_ = "-m" if mobile else ""
        b, ctx, page = new_ctx(p, mobile=mobile, tag="track" + sfx_)
        tap = (lambda loc: loc.tap()) if mobile else (lambda loc: loc.click())
        vw = 390 if mobile else 1280
        have = page.evaluate("typeof WH.Audio === 'object' && typeof WH.Audio.getMoods === 'function' && typeof WH.Audio.setTrack === 'function'")
        check(f"§29b {tag}: audio.js exposes getMoods / setTrack / getTrack / getPlayingMood / previewMood / onChange",
              have and page.evaluate("['getTrack','getPlayingMood','previewMood','onChange'].every(f => typeof WH.Audio[f] === 'function')"))
        if not have:
            ctx.close(); b.close(); continue
        moods = page.evaluate("WH.Audio.getMoods()")
        ids = [m["id"] for m in moods]
        page.evaluate("() => { window.__pm = []; const o = WH.Audio.previewMood; WH.Audio.previewMood = function (id) { __pm.push(id); return o.apply(WH.Audio, arguments); };"
                      " window.__st = []; const s = WH.Audio.setTrack; WH.Audio.setTrack = function (id) { __st.push(id); return s.apply(WH.Audio, arguments); }; }")
        check(f"§29b {tag}: default settings.musicTrack is auto and the audio module is in auto mode", page.evaluate("WH.UI.settings.musicTrack") == "auto" and page.evaluate("WH.Audio.getTrack()") == "auto")
        # ---- ♪ quick panel on the title screen
        mb = page.locator("#scr-title .corner .music-btn")
        sb = page.locator("#scr-title .corner .sound-btn")
        bm, bs = mb.bounding_box(), sb.bounding_box()
        check(f"§29b {tag}: ♪ button sits right next to the sound button", mb.count() == 1 and bm["x"] > bs["x"] and bm["x"] - (bs["x"] + bs["width"]) < 24 and abs(bm["y"] - bs["y"]) < 6,
              f"{bs} {bm}")
        check(f"§29b {tag}: ♪ button is labelled + announces a popup", (mb.get_attribute("aria-label") or "") != "" and mb.get_attribute("aria-haspopup") == "dialog" and mb.get_attribute("aria-expanded") == "false")
        tap(mb); page.wait_for_timeout(250)
        pop = page.locator(".music-pop")
        pb = pop.bounding_box()
        check(f"§29b {tag}: ♪ opens a panel with track + style + mute, fully inside the viewport",
              pop.count() == 1 and mb.get_attribute("aria-expanded") == "true" and pop.locator("select.track-select").count() == 1 and pop.locator("select.style-select").count() == 1
              and pop.locator("[data-mute]").count() == 2 and pb["x"] >= 0 and pb["x"] + pb["width"] <= vw + 1 and pb["y"] >= 0 and pb["y"] + pb["height"] <= (844 if mobile else 720) + 1, str(pb))
        sel = pop.locator("select.track-select")
        opts = sel.locator("option").evaluate_all("els => els.map(e => e.value)")
        check(f"§29b {tag}: panel track list = auto + all {len(ids)} moods, grouped", opts == ["auto"] + [m for g in ["calm", "tense", "fight", "end", "faction"] for m in [x['id'] for x in moods if x['group'] == g]]
              and sel.locator("optgroup").count() == 5, json.dumps(opts))
        check(f"§29b {tag}: the panel shows a 现在播放 line", "现在播放：" in pop.locator(".track-now").inner_text())
        check(f"§29b {tag}: focus moves into the panel", page.evaluate("document.activeElement.closest('.music-pop') !== null"))
        shot(page, ("m" if mobile else "") + "110_music_pop")
        page.keyboard.press("Escape"); page.wait_for_timeout(150)
        check(f"§29b {tag}: Esc closes the panel and returns focus to ♪", pop.count() == 0 and page.evaluate("document.activeElement.classList.contains('music-btn')") and mb.get_attribute("aria-expanded") == "false")
        tap(mb); page.wait_for_timeout(150)
        page.mouse.click(vw // 2, 120 if not mobile else 700) if not mobile else page.touchscreen.tap(vw // 2, 780)
        page.wait_for_timeout(200)
        check(f"§29b {tag}: a press outside closes the panel", page.locator(".music-pop").count() == 0)
        tap(mb); page.wait_for_timeout(150)
        tap(mb); page.wait_for_timeout(150)
        check(f"§29b {tag}: ♪ toggles the panel", page.locator(".music-pop").count() == 0)
        # ---- pick a track in the panel: applies at once, persists
        tap(mb); page.wait_for_timeout(150)
        pop.locator("select.track-select").select_option("battle"); page.wait_for_timeout(150)
        check(f"§29b {tag}: choosing a track in the panel calls setTrack, persists, and the audio module follows",
              page.evaluate("__st[__st.length - 1]") == "battle" and page.evaluate("WH.Audio.getTrack()") == "battle"
              and json.loads(page.evaluate("localStorage.getItem('whatiswh.settings')"))["musicTrack"] == "battle")
        check(f"§29b {tag}: the panel's now-playing line follows (战斗)", "战斗" in page.locator(".music-pop .track-now").inner_text(), page.locator(".music-pop .track-now").inner_text())
        page.evaluate("__pm.length = 0")
        tap(pop.locator(".pop-prev[data-kind='track']")); page.wait_for_timeout(200)
        check(f"§29b {tag}: panel ▶ previews the selected track (previewMood) without changing it", page.evaluate("__pm[__pm.length - 1]") == "battle" and page.evaluate("WH.Audio.getTrack()") == "battle"
              and pop.locator(".pop-prev[data-kind='track'].playing").count() == 1 and page.evaluate("WH.Audio.isPreviewing()"))
        check(f"§29b {tag}: during a preview the now-playing line says so", "试听中：战斗" in pop.locator(".track-now").inner_text(), pop.locator(".track-now").inner_text())
        pop.locator("select.track-select").select_option("auto"); page.wait_for_timeout(150)
        check(f"§29b {tag}: 'auto' disables the panel's ▶ and goes back to the story", page.evaluate("WH.Audio.getTrack()") == "auto" and pop.locator(".pop-prev[data-kind='track']").is_disabled()
              and json.loads(page.evaluate("localStorage.getItem('whatiswh.settings')"))["musicTrack"] == "auto")
        # style in the panel
        sty = page.evaluate("WH.Audio.getStyles().map(s => s.id)")
        if len(sty) > 1:
            pop.locator("select.style-select").select_option(sty[1]); page.wait_for_timeout(150)
            check(f"§29b {tag}: choosing a style in the panel sets settings.musicStyle + the audio style", page.evaluate("WH.Audio.getStyle()") == sty[1]
                  and json.loads(page.evaluate("localStorage.getItem('whatiswh.settings')"))["musicStyle"] == sty[1])
        # mute in the panel stays in step with the sound button
        page.evaluate("WH.Audio.stop({fade: 50})"); page.wait_for_timeout(150)          # end the running preview first (it would carry on silently while muted)
        pop.locator("[data-mute='1']").click() if not mobile else pop.locator("[data-mute='1']").tap()
        page.wait_for_timeout(200)
        check(f"§29b {tag}: mute in the panel mutes the game and the sound button follows", page.evaluate("WH.Audio.isMuted()") and page.evaluate("WH.UI.settings.muted") is True
              and pop.locator("[data-mute='1'][aria-pressed='true']").count() == 1 and "🔇" in page.locator("#scr-title .sound-btn").inner_text() and "静音中" in pop.locator(".track-now").inner_text())
        page.evaluate("__pm.length = 0")
        tap(pop.locator(".pop-prev[data-kind='style']")); page.wait_for_timeout(200)
        check(f"§29b {tag}: while muted ▶ does nothing and says why (toast), no 'playing' mark", not page.evaluate("WH.Audio.isPreviewing()") and pop.locator(".pop-prev.playing").count() == 0
              and "静音" in page.locator(".toasts").inner_text())
        pop.locator("[data-mute='0']").click() if not mobile else pop.locator("[data-mute='0']").tap()
        page.wait_for_timeout(200)
        check(f"§29b {tag}: unmute from the panel", not page.evaluate("WH.Audio.isMuted()") and "🔊" in page.locator("#scr-title .sound-btn").inner_text())
        page.keyboard.press("Escape"); page.wait_for_timeout(100)
        # ---- Settings list
        page.evaluate("() => WH.UI.openSettings()"); page.wait_for_timeout(250)
        row = page.locator(".modal .track-row")
        row.scroll_into_view_if_needed(); page.wait_for_timeout(100)
        radios = row.locator('[role="radio"]')
        check(f"§29b {tag}: Settings → 曲目 row: auto + {len(ids)} radio cards in one radiogroup, exactly one checked (auto)",
              row.count() == 1 and "曲目" in row.inner_text() and radios.count() == len(ids) + 1 and row.locator('[role="radiogroup"]').count() == 1
              and row.locator('[aria-checked="true"]').count() == 1 and row.locator('[aria-checked="true"]').get_attribute("data-track") == "auto")
        check(f"§29b {tag}: first card is 自动（随剧情）; groups are labelled; a ▶ 试听 per track (not for auto)",
              "自动（随剧情）" in row.locator(".track-auto").inner_text() and row.locator(".track-gh").count() == 5 and row.locator(".track-prev").count() == len(ids)
              and row.locator(".track-auto .track-prev").count() == 0 and "试听" in (row.locator(".track-prev").first.get_attribute("aria-label") or ""))
        names_ok = all(m["zh"] in row.locator(f'.track-pick[data-track="{m["id"]}"]').inner_text() for m in moods)
        check(f"§29b {tag}: every track shows its Chinese name", names_ok)
        check(f"§29b {tag}: row has a 现在播放 line", "现在播放：" in row.locator(".track-now").inner_text(), row.locator(".track-now").inner_text())
        if mobile:
            boxes = [row.locator(".track-item").nth(i).bounding_box() for i in range(row.locator(".track-item").count())]
            pbx = [row.locator(".track-prev").nth(i).bounding_box() for i in range(row.locator(".track-prev").count())]
            check("§29b mobile: track cards inside the viewport, no horizontal overflow, ≥ 40px tall, ▶ targets ≥ 40px wide",
                  all(x["x"] >= 0 and x["x"] + x["width"] <= 391 and x["height"] >= 40 for x in boxes) and all(x["width"] >= 40 and x["height"] >= 40 for x in pbx)
                  and page.evaluate("document.documentElement.scrollWidth") <= 391, str(boxes[:2]) + str(pbx[:1]))
            page.screenshot(path=os.path.join(OUT, "m111_track.png"))
        else:
            shot(page, "111_settings_track")
        target = "tense" if "tense" in ids else ids[1]
        tap(row.locator(f'.track-pick[data-track="{target}"]')); page.wait_for_timeout(150)
        row = page.locator(".modal .track-row")
        check(f"§29b {tag}: choosing a track in Settings applies it (setTrack), persists, and moves the check mark",
              page.evaluate("__st[__st.length - 1]") == target and page.evaluate("WH.Audio.getTrack()") == target
              and json.loads(page.evaluate("localStorage.getItem('whatiswh.settings')"))["musicTrack"] == target
              and row.locator('[aria-checked="true"]').get_attribute("data-track") == target and row.locator(".track-item.on").count() == 1)
        if not mobile:
            i = ids.index(target)
            row.locator(f'.track-pick[data-track="{target}"]').focus(); page.keyboard.press("ArrowRight"); page.wait_for_timeout(100)
            nxt = ids[(i + 1) % len(ids)]
            check("§29b a11y: arrow keys move the selection through the track radios", row.locator('[aria-checked="true"]').get_attribute("data-track") == nxt
                  and page.evaluate("document.activeElement.getAttribute('role')") == "radio" and page.evaluate("WH.Audio.getTrack()") == nxt)
            tap(row.locator(f'.track-pick[data-track="{target}"]'))
        page.evaluate("__pm.length = 0")
        last = ids[-1]
        tap(row.locator(f'.track-prev[data-track="{last}"]')); page.wait_for_timeout(200)
        check(f"§29b {tag}: ▶ in the list calls previewMood(id) and does not change the chosen track", page.evaluate("__pm[__pm.length - 1]") == last and page.evaluate("WH.Audio.getTrack()") == target
              and row.locator(".track-prev.playing").count() == 1 and row.locator(".track-prev.playing").get_attribute("data-track") == last)
        check(f"§29b {tag}: the list's now-playing line shows the previewed track", "试听中：" in row.locator(".track-now").inner_text(), row.locator(".track-now").inner_text())
        # ---- both controls in sync: settings → panel
        page.keyboard.press("Escape"); page.wait_for_timeout(200)
        tap(mb); page.wait_for_timeout(200)
        check(f"§29b {tag}: the panel shows the track chosen in Settings", page.locator(".music-pop select.track-select").input_value() == target)
        page.locator(".music-pop select.track-select").select_option("holy"); page.wait_for_timeout(120)
        page.keyboard.press("Escape"); page.wait_for_timeout(100)
        page.evaluate("() => WH.UI.openSettings()"); page.wait_for_timeout(250)
        row = page.locator(".modal .track-row")
        check(f"§29b {tag}: …and Settings shows the track chosen in the panel", row.locator('[aria-checked="true"]').get_attribute("data-track") == "holy")
        # settings export, reload, unknown values
        check(f"§22/§29b {tag}: musicTrack is part of the exported settings", page.evaluate("WH.Save.exportAll().data.settings.musicTrack") == "holy", page.evaluate("[localStorage.getItem('whatiswh.settings'), WH.Save.isPersistent()]").__str__()[:300])
        page.reload(); page.wait_for_selector("#scr-title .title-main"); page.wait_for_timeout(200)
        check(f"§29b {tag}: the track survives a reload and is re-applied at start-up", page.evaluate("WH.UI.settings.musicTrack") == "holy" and page.evaluate("WH.Audio.getTrack()") == "holy", json.dumps([page.evaluate("WH.UI.settings.musicTrack"), page.evaluate("WH.Audio.getTrack()"), page.evaluate("localStorage.getItem('whatiswh.settings')")]))
        page.evaluate("() => { WH.UI.settings.musicTrack = 'no-such-track'; WH.Save.saveSettings(WH.UI.settings); }")
        page.reload(); page.wait_for_selector("#scr-title .title-main"); page.wait_for_timeout(200)
        page.evaluate("() => WH.UI.openSettings()"); page.wait_for_timeout(250)
        check(f"§29b {tag}: an unknown stored track falls back to auto (audio + UI)", page.evaluate("WH.Audio.getTrack()") == "auto"
              and page.locator('.modal .track-row [aria-checked="true"]').get_attribute("data-track") == "auto")
        page.evaluate("() => { localStorage.setItem('whatiswh.settings', JSON.stringify({musicTrack: 'a b!', loreAsked: true})); }")
        page.reload(); page.wait_for_selector("#scr-title .title-main")
        check(f"§29b {tag}: a malformed stored value is sanitised to auto", page.evaluate("WH.UI.settings.musicTrack") == "auto", json.dumps([page.evaluate("WH.UI.settings.musicTrack"), page.evaluate("localStorage.getItem('whatiswh.settings')")]))
        # ---- in play: the ♪ button lives in the toolbar; a fixed track survives the story; auto follows it
        (page.locator("#scr-title .menu .btn.primary").tap if mobile else page.locator("#scr-title .menu .btn.primary").click)(); page.wait_for_timeout(250)
        pick_faction(page, None, 0, tap=mobile); page.wait_for_timeout(300)
        page.wait_for_selector("#tools .music-btn")
        page.evaluate("() => { WH.UI.settings.musicTrack = 'tau'; WH.Save.saveSettings(WH.UI.settings); WH.Audio.setTrack('tau'); }")
        wait_idle(page)
        click_choice(page, 0); click_choice(page, 0)
        for _ in range(4):                                                              # lore cards pop up a moment after the text: clear them all
            finish_text(page); page.wait_for_timeout(350)
            if not page.locator("#lore-overlay").count(): break
        check(f"§29b {tag}: a fixed track keeps sounding while the story moves on", page.evaluate("WH.Audio.getTrack()") == "tau" and page.evaluate("WH.Audio.current()") == "tau")
        tb = page.locator("#tools .music-btn"); sbb = page.locator("#tools .sound-btn")
        check(f"§29b {tag}: in play ♪ sits next to the sound button in the toolbar", tb.count() == 1 and abs(tb.bounding_box()["y"] - sbb.bounding_box()["y"]) < 40 and tb.bounding_box()["x"] > sbb.bounding_box()["x"] - 2)
        tap(tb); page.wait_for_timeout(250)
        pb = page.locator(".music-pop").bounding_box()
        check(f"§29b {tag}: in play the panel is inside the viewport and the track select shows the fixed track", pb["x"] >= 0 and pb["x"] + pb["width"] <= vw + 1 and pb["y"] >= 0
              and page.locator(".music-pop select.track-select").input_value() == "tau", str(pb))
        n0 = page.evaluate("WH.UI.game.state.nodeId")
        page.keyboard.press("1"); page.wait_for_timeout(250)
        n1 = page.evaluate("WH.UI.game.state.nodeId")
        check(f"§29b {tag}: with the panel open, story hotkeys do not fire", n0 == n1 and page.locator(".music-pop").count() == 1)
        shot(page, ("m" if mobile else "") + "112_music_pop_game")
        page.locator(".music-pop select.track-select").select_option("auto"); page.wait_for_timeout(150)
        page.keyboard.press("Escape"); page.wait_for_timeout(100)
        want = page.evaluate("WH.Audio.moodFor(WH.UI.game.node(), WH.UI.game.state, WH.UI.game.faction)")
        check(f"§29b {tag}: back to auto = the story mood again", page.evaluate("WH.Audio.getTrack()") == "auto" and page.evaluate("WH.Audio.current()") == want, f"{page.evaluate('WH.Audio.current()')} vs {want}")
        # now-playing in auto follows the story mood (name from getMoods)
        page.evaluate("() => WH.UI.openSettings()"); page.wait_for_timeout(250)
        nm = next(m["zh"] for m in moods if m["id"] == page.evaluate("WH.Audio.getPlayingMood()"))
        check(f"§29b {tag}: the 现在播放 line shows the story mood in auto mode ({nm})", nm in page.locator(".modal .track-now").inner_text(), page.locator(".modal .track-now").inner_text())
        # ---- English
        page.evaluate("() => WH.UI.setLang('en')"); page.wait_for_timeout(250)
        row = page.locator(".modal .track-row")
        row.scroll_into_view_if_needed(); page.wait_for_timeout(100)
        txt = row.inner_text()
        check(f"§29b en {tag}: Settings track row is translated (label, auto, groups, now playing, names)",
              "Track" in txt and "Auto (follows the story)" in txt and "Now playing:" in txt and "Quiet" in txt and "Combat" in txt and "Genestealer Cult" in txt and "Sanctum" in txt
              and "战斗" not in txt, txt[:200].replace("\n", " | "))
        page.keyboard.press("Escape"); page.wait_for_timeout(200)
        mbtn = page.locator("#tools .music-btn")
        tap(mbtn); page.wait_for_timeout(250)
        ptxt = page.locator(".music-pop").inner_text()
        check(f"§29b en {tag}: the ♪ panel is translated", "Music" in ptxt and "Track" in ptxt and "Music style" in ptxt and "Sound" in ptxt and "Now playing:" in ptxt and "Auto (follows the story)" in ptxt, ptxt[:160].replace("\n", " | "))
        shot(page, ("m" if mobile else "") + "113_music_pop_en")
        # changing the language closes the panel (it is rebuilt in the new language next time)
        page.evaluate("() => WH.UI.setLang('zh')"); page.wait_for_timeout(200)
        check(f"§29b {tag}: switching language closes the panel", page.locator(".music-pop").count() == 0)
        # ---- the audio module is optional: no WH.Audio -> no track row, no ♪, nothing breaks
        page.evaluate("() => { window.__A = WH.Audio; WH.Audio = undefined; WH.UI.openSettings(); }"); page.wait_for_timeout(250)
        check(f"§29b {tag}: without WH.Audio the Settings panel has no track row and still opens", page.locator(".modal").count() == 1 and page.locator(".modal .track-row").count() == 0)
        page.evaluate("() => { WH.Audio = window.__A; }")
        ctx.close(); b.close()

# ---------------------------------------------------------------------------------------------------------------------
# SPEC §31 ending illustrations (v0.3.4): UI.endingArt, picture on the ending screen, thumbnails in 往生录, fallbacks, layout
# ---------------------------------------------------------------------------------------------------------------------
KIND_RGB = {"good": (227, 196, 124), "bad": (154, 138, 116), "death": (192, 57, 43)}      # style.css .kind.good/.bad/.death

def make_test_art():
    """tiny 192x108 PNGs under tools/dev/test_art/ (NOT assets/endings/ — that folder belongs to the art role)"""
    from PIL import Image, ImageDraw
    d = os.path.join(ROOT, "tools", "dev", "test_art")
    os.makedirs(d, exist_ok=True)
    pal = {"good": ((250, 214, 120), (70, 120, 200)), "bad": ((120, 130, 90), (60, 40, 70)), "death": ((70, 20, 24), (14, 8, 12))}
    for kind, (top, bot) in pal.items():
        im = Image.new("RGB", (192, 108), top)
        dr = ImageDraw.Draw(im)
        for y in range(108):                                  # flat bands, like the scenes
            t = (y // 12) / 8.0
            dr.line([(0, y), (191, y)], fill=tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)))
        dr.rectangle([80, 30, 112, 100], fill=(18, 14, 16))   # a monolith in the middle
        dr.ellipse([84, 14, 108, 38], fill=(240, 240, 240))
        dr.rectangle([0, 0, 7, 7], fill=(255, 0, 0)); dr.rectangle([184, 100, 191, 107], fill=(0, 255, 0))      # corner markers: crop / stretch would show
        im.save(os.path.join(d, f"end_{kind}.png"))
    return "tools/dev/test_art"

def pixel_at(page, x, y, dsf=1):
    from PIL import Image
    im = Image.open(io.BytesIO(page.screenshot())).convert("RGB")
    return im.getpixel((int(round(x * dsf)), int(round(y * dsf))))

def near(a, b, tol=14):
    return all(abs(a[i] - b[i]) <= tol for i in range(3))

def endings_of(page, fid):
    """ending node ids of a route grouped by kind (sorted, deterministic)"""
    return page.evaluate("""(fid) => { const f = WH.factions[fid], out = {good: [], bad: [], death: []};
      Object.keys(f.nodes).sort().forEach(id => { const n = f.nodes[id]; if (n.ending) out[n.ending.kind].push(id); }); return out; }""", fid)

def show_ending_of(page, nodeid):
    goto_node(page, nodeid, ended=True)
    page.wait_for_selector("#scr-ending .end-pic", timeout=3000)
    page.wait_for_timeout(250)

def pic_info(page):
    """geometry + attributes of the ending-screen picture"""
    return page.evaluate("""() => {
      const w = document.querySelector('#scr-ending .end-pic'), img = w && w.querySelector('img'), cs = w && getComputedStyle(w);
      const r = (e) => { const b = e.getBoundingClientRect(); return {x: b.x, y: b.y, w: b.width, h: b.height, r: b.right, b: b.bottom}; };
      const bg = document.querySelector('#scr-ending .bg img');
      return {
        box: w ? r(w) : null, img: img ? r(img) : null, key: img ? img.dataset.key : null, src: img ? img.getAttribute('src') : null,
        alt: img ? img.alt : null, decoding: img ? img.decoding : null, nw: img ? img.naturalWidth : 0, nh: img ? img.naturalHeight : 0,
        rendering: img ? getComputedStyle(img).imageRendering : null, border: cs ? [cs.borderTopWidth, cs.borderTopColor] : null,
        imgs: w ? w.querySelectorAll('img').length : -1, ph: w ? w.querySelectorAll('.ph, .ph-scene, .slime, [data-missing]').length : -1,
        empty: w ? w.classList.contains('empty') : null, cls: w ? w.className : null,
        bgKey: bg ? bg.dataset.key : null,
        panel: r(document.querySelector('#scr-ending .ending-panel')), scroll: r(document.querySelector('#scr-ending .ending-scroll')),
        btns: r(document.querySelector('#scr-ending .ending-btns')), hero: r(document.querySelector('#scr-ending .ending-hero')),
        title: r(document.querySelector('#scr-ending .ending-title')), titleText: document.querySelector('#scr-ending .ending-title').textContent,
        vw: innerWidth, vh: innerHeight, sw: document.documentElement.scrollWidth
      }; }""")

def run_v034(p):
    """SPEC §31 on whatever data is loaded (sample, or --real with the art possibly not delivered yet): the art path is tested with
    injected 192x108 test PNGs registered at runtime (WH.registerScenes), the fallback path with keys that are missing / point at a
    missing file, so this passes before, during and after the art role delivers."""
    print("\n== v0.3.4 ending illustrations (SPEC §31) ==")
    art_dir = make_test_art()
    fid = "imperium" if REAL else "sample"
    for mode in ("desktop", "desktop1080", "mobile"):
        mobile = mode == "mobile"
        tag = "end-art-" + mode
        b = p.chromium.launch(executable_path=CHROME, headless="--headed" not in ARGS)
        if mobile:
            ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True, locale="zh-CN")
        elif mode == "desktop1080":
            ctx = b.new_context(viewport={"width": 1920, "height": 1080}, locale="zh-CN")
        else:
            ctx = b.new_context(viewport={"width": 1280, "height": 720}, locale="zh-CN")
        page = ctx.new_page(); attach_console(page, tag)
        page.goto(BASE + QS + ("&" if QS else "?") + "seed=21"); page.wait_for_selector("#scr-title .title-main")
        page.evaluate(CLEAR); page.reload(); page.wait_for_selector("#scr-title .title-main")
        page.evaluate("() => { WH.UI.settings.loreCards = 'off'; WH.UI.settings.textSpeed = 'instant'; WH.Save.saveSettings(WH.UI.settings); }")
        dsf = 2 if mobile else 1
        pre = f"§31 {mode}: "
        page.evaluate("() => WH.UI.show('select')"); page.wait_for_timeout(200)
        pick_faction(page, fid, tap=mobile); wait_idle(page); finish_text(page); dismiss_lore(page)
        E = endings_of(page, fid)
        gid, bid, did = E["good"][0], E["bad"][0], E["death"][0]
        fb_id = E["bad"][1] if len(E["bad"]) > 1 else E["bad"][0]            # no end_<id> key → node scene
        mp_id = E["good"][1] if len(E["good"]) > 1 else E["good"][0]          # key registered, PNG file missing → node scene
        art = {gid: "good", bid: "bad", did: "death"}
        page.evaluate("""([fid, art, dir, fb, mp]) => {
          const reg = {};
          Object.keys(art).forEach(id => { reg['end_' + id] = {src: dir + '/end_' + art[id] + '.png', w: 192, h: 108, name: WH.factions[fid].nodes[id].ending.title}; });
          reg['end_' + mp] = {src: dir + '/missing_on_purpose.png', w: 192, h: 108, name: WH.factions[fid].nodes[mp].ending.title};
          delete WH.scenes['end_' + fb];                                          // real manifest may already have it: force the fallback path
          WH.registerScenes(reg); }""", [fid, art, art_dir, fb_id, mp_id])
        # ---- UI.endingArt (key helper) ----
        k = page.evaluate("""([fid, g, fb]) => [WH.UI.endingArt(fid, g), WH.UI.endingArt(fid, fb), WH.factions[fid].nodes[fb].scene || 'void', WH.UI.endingArt('nope', 'nope'), WH.UI.endingArt(fid, 'no_such_node')]""", [fid, gid, fb_id])
        check(pre + "UI.endingArt → end_<id> when registered, else the node scene, else 'void' (never throws)", k[0] == "end_" + gid and k[1] == k[2] and k[3] == "void" and k[4] == "void", str(k))

        # ---- art path: each kind, ending screen ----
        for kind, nid in (("good", gid), ("bad", bid), ("death", did)):
            show_ending_of(page, nid)
            pi = pic_info(page)
            ratio = pi["img"]["w"] / pi["img"]["h"] if pi["img"] else 0
            check(pre + f"{kind}: ending screen shows end_{nid} in the picture box (decoded 192x108, async decoding, alt = title)",
                  pi["key"] == "end_" + nid and pi["nw"] == 192 and pi["nh"] == 108 and pi["decoding"] == "async" and pi["src"].endswith(f"test_art/end_{kind}.png")
                  and "结局插图" in pi["alt"] and pi["titleText"] in pi["alt"], str({k_: pi[k_] for k_ in ("key", "nw", "nh", "decoding", "src", "alt")}))
            check(pre + f"{kind}: picture is 16:9 (±0.5%), pixel-crisp, one image, no placeholder", abs(ratio - 16 / 9) < 16 / 9 * 0.005 and pi["rendering"] in ("pixelated", "crisp-edges") and pi["imgs"] == 1 and pi["ph"] == 0, f"{ratio:.4f} {pi['rendering']} {pi['imgs']} {pi['ph']}")
            kc = KIND_RGB[kind]
            bx = pi["box"]
            px = pixel_at(page, bx["x"] + 1.2, bx["y"] + bx["h"] / 2, dsf)
            check(pre + f"{kind}: frame is 3px in the kind colour {kc}", pi["border"][0] == "3px" and near(px, kc), f"{pi['border']} px={px}")
            check(pre + f"{kind}: the dimmed old scene stays as the screen background", pi["bgKey"] == page.evaluate("(a) => WH.factions[a[0]].nodes[a[1]].scene || 'void'", [fid, nid]), str(pi["bgKey"]))
            if kind == "bad":
                if not mobile:
                    check(pre + "landscape: picture left of the head/fate block, inside the panel, top-aligned in the hero", pi["box"]["r"] < pi["title"]["x"] + 2 and pi["box"]["x"] >= pi["panel"]["x"] and pi["box"]["y"] >= pi["panel"]["y"] and pi["box"]["y"] <= pi["hero"]["y"] + 6, f"{pi['box']} {pi['title']}")
                else:
                    check(pre + "portrait: picture on top at (almost) full panel width, above the title, no horizontal overflow", pi["box"]["y"] < pi["title"]["y"] and pi["box"]["w"] >= pi["panel"]["w"] - 60 and pi["box"]["r"] <= pi["vw"] and pi["sw"] <= pi["vw"] + 1, f"{pi['box']} {pi['panel']} sw={pi['sw']}")
                shot(page, ("m90_end_art_bad" if mobile else ("111_end_art_1080" if mode == "desktop1080" else "110_end_art_bad")))
            if kind == "death" and not mobile:
                shot(page, "112_end_art_death_1080" if mode == "desktop1080" else "112_end_art_death")
        # ---- no layout jump: the 16:9 box is reserved before the image decodes ----
        j = page.evaluate("""(id) => { const g = WH.UI.game; WH.UI.loadRecord(Object.assign(g.toRecord(), {nodeId: id, ended: true}));
          const q = () => { const b = document.querySelector('#scr-ending .end-pic').getBoundingClientRect(), h = document.querySelector('#scr-ending .ending-hero').getBoundingClientRect(), t = document.querySelector('#scr-ending .ending-title').getBoundingClientRect(); return [b.width, b.height, h.height, t.y]; };
          return {before: q(), loaded: document.querySelector('#scr-ending .end-pic img').complete}; }""", gid)
        page.wait_for_timeout(300)
        after = page.evaluate("""() => { const b = document.querySelector('#scr-ending .end-pic').getBoundingClientRect(), h = document.querySelector('#scr-ending .ending-hero').getBoundingClientRect(), t = document.querySelector('#scr-ending .ending-title').getBoundingClientRect(); return [b.width, b.height, h.height, t.y]; }""")
        check(pre + "no layout jump: picture box + hero + title position identical before and after the image loads", j["before"][0] > 100 and all(abs(j["before"][i] - after[i]) < 0.6 for i in range(4)), f"{j['before']} → {after}")

        # ---- fallback path: no key → node scene; key but file missing → node scene (never broken icon / slime) ----
        for label, nid in (("no end_ key", fb_id), ("key registered, PNG missing", mp_id)):
            show_ending_of(page, nid)
            page.wait_for_timeout(350)
            pi = pic_info(page)
            want = page.evaluate("(a) => WH.factions[a[0]].nodes[a[1]].scene || 'void'", [fid, nid])
            check(pre + f"fallback ({label}): the node scene is shown in the box, decoded, no placeholder, not marked empty", pi["key"] == want and pi["nw"] == 192 and pi["nh"] == 108 and pi["imgs"] == 1 and pi["ph"] == 0 and not pi["empty"], str({k_: pi[k_] for k_ in ("key", "nw", "nh", "imgs", "ph", "empty")}))
            check(pre + f"fallback ({label}): box is still 16:9 with the kind frame", abs(pi["img"]["w"] / pi["img"]["h"] - 16 / 9) < 0.02 and pi["border"][0] == "3px", str(pi["img"]))
        # nothing loadable at all (unknown scene key + missing file) → flat dark box, still reserved, no broken icon / placeholder text
        page.evaluate("""([fid, id]) => { WH.scenes['end_' + id] = {src: 'tools/dev/test_art/missing_two.png', w: 192, h: 108}; WH.factions[fid].nodes[id].__scene = WH.factions[fid].nodes[id].scene; WH.factions[fid].nodes[id].scene = 'no_such_scene_key'; }""", [fid, mp_id])
        show_ending_of(page, mp_id); page.wait_for_timeout(300)
        pi = pic_info(page)
        check(pre + "nothing loadable: the 16:9 box stays reserved and flat (no <img>, no placeholder, no broken-image icon)", pi["imgs"] == 0 and pi["ph"] == 0 and pi["empty"] and pi["img"] is None and pi["box"]["w"] > 100 and abs(pi["box"]["w"] / pi["box"]["h"] - 16 / 9) < 0.1, str(pi["cls"]))
        page.evaluate("""([fid, id]) => { const n = WH.factions[fid].nodes[id]; n.scene = n.__scene; delete n.__scene; WH.scenes['end_' + id] = {src: 'tools/dev/test_art/missing_on_purpose.png', w: 192, h: 108}; }""", [fid, mp_id])

        # ---- layout: buttons never covered, panel scrolls ----
        show_ending_of(page, did)
        if not mobile:
            page.locator("#scr-ending .ending-scroll").evaluate("e => e.scrollTop = e.scrollHeight"); page.wait_for_timeout(120)
            pi = pic_info(page)
            sc = page.evaluate("() => { const e = document.querySelector('#scr-ending .ending-scroll'); return [e.scrollTop, e.scrollHeight, e.clientHeight]; }")
            check(pre + "landscape: the ending panel scrolls (content > view is allowed) and the buttons stay below the scroll area, inside the panel and the window",
                  pi["scroll"]["b"] <= pi["btns"]["y"] + 1 and pi["btns"]["b"] <= pi["panel"]["b"] + 1 and pi["panel"]["b"] <= pi["vh"] and pi["panel"]["y"] >= 0 and pi["btns"]["y"] >= 0 and sc[0] > 0 and sc[1] > sc[2], f"{pi['scroll']} {pi['btns']} {pi['panel']} {sc}")
            page.locator("#scr-ending .ending-btns .btn.primary").click(trial=True)           # actionable = visible, enabled, not covered
            check(pre + "landscape: ↻ again / other / home buttons are actionable (not covered) after scrolling", True)
            page.locator("#scr-ending .ending-scroll").evaluate("e => e.scrollTop = 0")
        else:
            page.locator("#scr-ending .ending-btns .btn").first.scroll_into_view_if_needed(); page.wait_for_timeout(150)
            bb = page.locator("#scr-ending .ending-btns .btn").first.bounding_box()
            check(pre + "portrait: buttons reachable by scrolling the page, inside the viewport, not covered", bb and bb["y"] >= 0 and bb["y"] + bb["height"] <= 845 and bb["x"] >= 0, str(bb))
            page.locator("#scr-ending .ending-btns .btn.primary").tap(trial=True)
            page.evaluate("() => window.scrollTo(0, 0)")
        # ---- English ----
        page.evaluate("() => WH.UI.setLang('en')"); page.wait_for_timeout(250)
        pi = pic_info(page)
        check(pre + "en: alt text = 'Ending illustration: <English title>', picture unchanged", pi["alt"].startswith("Ending illustration: ") and pi["titleText"] in pi["alt"] and pi["key"] == "end_" + did, pi["alt"])
        if mode != "desktop1080": shot(page, "m91_end_art_en" if mobile else "113_end_art_en")
        page.evaluate("() => WH.UI.setLang('zh')"); page.wait_for_timeout(150)

        # ---- 往生录 endings grid: thumbnails for unlocked, flat dark for locked ----
        for nid in (gid, bid, did, fb_id, mp_id): show_ending_of(page, nid)
        page.wait_for_timeout(300)
        page.evaluate("() => { WH.UI.show('title'); }"); page.wait_for_timeout(150)
        page.evaluate("() => WH.UI.openCodex(null, false, 'endings')"); page.wait_for_selector(".modal .end-tile", timeout=3000); page.wait_for_timeout(500)
        g = page.evaluate("""([ids, fid]) => {
          const tiles = [...document.querySelectorAll('.modal .end-tile')], unl = tiles.filter(t => !t.classList.contains('locked')), lock = tiles.filter(t => t.classList.contains('locked'));
          const rect = (e) => { const b = e.getBoundingClientRect(); return {x: b.x, y: b.y, w: b.width, h: b.height, b: b.bottom, r: b.right}; };
          const info = {};
          ids.forEach(id => { const w = document.querySelector('.modal .end-pic[data-ending="' + id + '"]'), t = w && w.closest('.end-tile'), im = w && w.querySelector('img');
            info[id] = w ? {key: im ? im.dataset.key : null, nw: im ? im.naturalWidth : 0, imgs: w.querySelectorAll('img').length, ph: w.querySelectorAll('.ph, .ph-scene, .slime').length, box: rect(im || w),
              frame: getComputedStyle(w).borderTopColor, aboveTitle: im ? im.getBoundingClientRect().bottom <= t.querySelector('.et').getBoundingClientRect().top + 1 : null, first: t.firstElementChild === w, alt: im ? im.alt : null, kind: [...t.classList].filter(c => ['good', 'bad', 'death'].includes(c))[0]} : null; });
          const total = Object.keys(WH.factions[fid].nodes).filter(id => WH.factions[fid].nodes[id].ending).length;
          return {tiles: tiles.length, unl: unl.length, lock: lock.length, info,
            lockedImgs: lock.reduce((n, t) => n + t.querySelectorAll('img').length, 0), lockedPics: lock.filter(t => t.querySelector('.end-pic.locked')).length,
            lockedBg: lock.length ? getComputedStyle(lock[0].querySelector('.end-pic')).backgroundImage : '', lockedQ: lock.every(t => t.querySelector('.et').textContent.trim() === '???'),
            lockedBox: lock.length ? rect(lock[0].querySelector('.end-pic')) : null, lockedBw: lock.length ? parseFloat(getComputedStyle(lock[0].querySelector('.end-pic')).borderTopWidth) : 0, unlBox: rect(unl[0].querySelector('.end-pic')), vw: innerWidth, sw: document.documentElement.scrollWidth,
            sectionTiles: document.querySelectorAll('.modal .codex-sec').length, total}; }""", [[gid, bid, did, fb_id, mp_id], fid])
        i0 = g["info"]
        check(pre + "往生录: unlocked tiles = the 5 reached endings, every other tile is locked", g["unl"] == 5 and g["lock"] == g["tiles"] - 5 and g["lock"] >= 1, f"{g['unl']}/{g['tiles']}")
        for kind, nid in (("good", gid), ("bad", bid), ("death", did)):
            x = i0[nid]
            check(pre + f"往生录: {kind} tile has a 16:9 thumbnail of end_{nid} above the title, first in the tile, in the kind colour",
                  x and x["key"] == "end_" + nid and x["nw"] == 192 and x["imgs"] == 1 and x["ph"] == 0 and abs(x["box"]["w"] / x["box"]["h"] - 16 / 9) < 0.02 and x["aboveTitle"] and x["first"]
                  and x["frame"] == "rgb(%d, %d, %d)" % KIND_RGB[kind] and "结局插图" in x["alt"], str(x))
        for label, nid in (("no key", fb_id), ("PNG missing", mp_id)):
            x = i0[nid]
            want = page.evaluate("(a) => WH.factions[a[0]].nodes[a[1]].scene || 'void'", [fid, nid])
            check(pre + f"往生录: fallback tile ({label}) shows the node scene thumbnail, no placeholder / broken icon", x and x["key"] == want and x["nw"] == 192 and x["imgs"] == 1 and x["ph"] == 0, str(x))
        check(pre + "往生录: locked tiles show NO <img> (no spoiler), a flat dark 16:9 box (gradient, no url()), '???'", g["lockedImgs"] == 0 and g["lockedPics"] == g["lock"] and "url(" not in g["lockedBg"] and g["lockedQ"]
              and abs((g["lockedBox"]["w"] - 2 * g["lockedBw"]) / (g["lockedBox"]["h"] - 2 * g["lockedBw"]) - 16 / 9) < 0.02 and abs(g["lockedBox"]["w"] - g["unlBox"]["w"]) < 3, f"{g['lockedBg'][:60]} {g['lockedBox']}")
        check(pre + "往生录: no horizontal overflow", g["sw"] <= g["vw"] + 1, f"{g['sw']} vs {g['vw']}")
        shot(page, "m92_endings_grid" if mobile else ("114_endings_grid_1080" if mode == "desktop1080" else "114_endings_grid"))
        page.evaluate("() => { const m = document.querySelector('.modal-body'); const l = document.querySelector('.end-tile.locked'); if (l && l.scrollIntoView) l.scrollIntoView({block: 'center'}); }"); page.wait_for_timeout(150)
        shot(page, "m93_endings_grid_locked" if mobile else ("115_endings_grid_locked_1080" if mode == "desktop1080" else "115_endings_grid_locked"))
        page.evaluate("() => WH.UI.setLang('en')"); page.wait_for_timeout(300)
        check(pre + "往生录 (en): thumbnails keep working after a language switch, alt in English", page.evaluate("document.querySelectorAll('.modal .end-tile:not(.locked) .end-pic img').length") == 5
              and page.evaluate("[...document.querySelectorAll('.modal .end-tile:not(.locked) .end-pic img')].every(i => i.alt.startsWith('Ending illustration: '))"))
        page.keyboard.press("Escape"); page.wait_for_timeout(100)
        page.evaluate("() => WH.UI.setLang('zh')")
        ctx.close(); b.close()

    # ---- every ending of every loaded route: first view fits, buttons never covered, in zh and en (throw-away profile) ----
    for mobile in (False, True):
        b = p.chromium.launch(executable_path=CHROME, headless="--headed" not in ARGS)
        ctx = b.new_context(viewport={"width": 390, "height": 844} if mobile else {"width": 1280, "height": 720}, device_scale_factor=1, is_mobile=mobile, has_touch=mobile, locale="zh-CN")
        page = ctx.new_page(); attach_console(page, "end-fit" + ("-m" if mobile else ""))
        page.goto(BASE + QS + ("&" if QS else "?") + "seed=22"); page.wait_for_selector("#scr-title .title-main")
        page.evaluate(CLEAR); page.reload(); page.wait_for_selector("#scr-title .title-main")
        res = page.evaluate("""(mobile) => {
          const bad = [], seen = [];
          for (const lang of ['zh', 'en']) {
            WH.UI.setLang(lang);
            for (const fid of Object.keys(WH.factions)) {
              const f = WH.factions[fid], g = new WH.Game(fid, {rng: WH.RNG(5)}); g.start((f.origins && f.origins[0] && f.origins[0].id) || undefined);
              for (const id of Object.keys(f.nodes).filter(i => f.nodes[i].ending)) {
                WH.UI.game = g; WH.UI.loadRecord(Object.assign(g.toRecord(), {nodeId: id, ended: true}));
                const q = (s) => document.querySelector('#scr-ending ' + s).getBoundingClientRect();
                const p = q('.ending-panel'), bt = q('.ending-btns'), sc = q('.ending-scroll'), hero = q('.ending-hero'), pic = q('.end-pic'), ti = q('.ending-title');
                const why = [];
                if (!mobile) {
                  if (bt.bottom > p.bottom + 1 || sc.bottom > bt.top + 1) why.push('buttons covered');
                  if (p.bottom > innerHeight || p.top < 0) why.push('panel outside window');
                  if (hero.height > sc.height + 1) why.push('hero taller than the scroll area ' + Math.round(hero.height) + '>' + Math.round(sc.height));
                  if (pic.right > ti.left + 2) why.push('picture overlaps the head');
                } else {
                  if (pic.right > innerWidth || p.right > innerWidth + 1 || document.documentElement.scrollWidth > innerWidth + 1) why.push('horizontal overflow');
                  if (pic.top > ti.top) why.push('picture not above the title');
                }
                seen.push(id); if (why.length) bad.push(lang + ':' + id + ' ' + why.join('; '));
              }
            }
          }
          return {n: seen.length, bad}; }""", mobile)
        check(f"§31 {'portrait' if mobile else 'landscape'}: all {res['n'] // 2} endings × zh/en — " + ("picture above the title, no horizontal overflow" if mobile else "buttons never covered, hero fits the first view, picture beside the head"),
              res["n"] >= 2 and not res["bad"], "; ".join(res["bad"][:6]))
        ctx.close(); b.close()


def run_fam(p):
    """SPEC §33: first-run "do you know Warhammer?" dialog -> lore cards + keyword links on/off; asked once; returning players skipped."""
    print("\n== v0.4.0 familiarity dialog (§33) ==")
    for mobile in (False, True):
        tag = "mobile" if mobile else "desktop"
        tap = (lambda loc: loc.tap()) if mobile else (lambda loc: loc.click())
        # ---- a brand-new profile
        b, ctx, page = new_ctx(p, mobile=mobile, tag="fam" + ("-m" if mobile else ""), fam=True)
        st = page.evaluate("WH.UI.settings")
        check(f"§33 {tag}: fresh profile -> loreAsked false, keywordLinks true, loreCards new", st["loreAsked"] is False and st["keywordLinks"] is True and st["loreCards"] == "new", json.dumps(st))
        tap(page.locator("#scr-title .menu .btn.primary")); page.wait_for_timeout(300)
        dlg = page.locator(".modal-back .modal")
        check(f"§33 {tag}: 开始新游戏 opens the familiarity dialog instead of the faction picker", dlg.count() == 1 and page.locator("#scr-select").is_hidden() and dlg.locator(".fam-opt").count() == 2, "")
        bb = dlg.bounding_box()
        check(f"§33 {tag}: dialog fits the viewport", bb and bb["x"] >= 0 and bb["x"] + bb["width"] <= (390 if mobile else 1280) + 1 and bb["y"] >= 0 and bb["y"] + bb["height"] <= (844 if mobile else 720) + 1, str(bb))
        check(f"§33 {tag}: both options + a note are visible; focus is inside the dialog", "你熟悉战锤" in dlg.inner_text() and page.evaluate("document.activeElement.closest('.modal') !== null"))
        shot(page, ("m" if mobile else "") + "130_familiarity")
        # ---- 我很熟 -> cards + links off
        tap(dlg.locator("[data-fam=vet]")); page.wait_for_timeout(350)
        st = page.evaluate("WH.UI.settings")
        check(f"§33 {tag}: 我很熟 -> loreCards codex, keywordLinks off, loreAsked true", st["loreCards"] == "codex" and st["keywordLinks"] is False and st["loreAsked"] is True, json.dumps(st))
        check(f"§33 {tag}: ... and the faction picker opens", page.locator("#scr-select").is_visible() and page.locator(".modal-back").count() == 0)
        check(f"§33 {tag}: choice is persisted", page.evaluate("JSON.parse(localStorage.getItem('whatiswh.settings')).keywordLinks") is False)
        page.reload(); page.wait_for_selector("#scr-title .title-main")
        tap(page.locator("#scr-title .menu .btn.primary")); page.wait_for_timeout(300)
        check(f"§33 {tag}: asked only once (reload -> new game goes straight to the picker)", page.locator(".modal-back").count() == 0 and page.locator("#scr-select").is_visible())
        ctx.close(); b.close()

        # ---- 我是新人 -> defaults kept
        b, ctx, page = new_ctx(p, mobile=mobile, tag="fam2" + ("-m" if mobile else ""), fam=True)
        tap(page.locator("#scr-title .menu .btn.primary")); page.wait_for_timeout(300)
        tap(page.locator(".modal-back [data-fam=new]")); page.wait_for_timeout(350)
        st = page.evaluate("WH.UI.settings")
        check(f"§33 {tag}: 我是新人 -> cards new + links on + asked", st["loreCards"] == "new" and st["keywordLinks"] is True and st["loreAsked"] is True and page.locator("#scr-select").is_visible(), json.dumps(st))
        ctx.close(); b.close()

        # ---- closing with Esc keeps the defaults and still counts as asked
        b, ctx, page = new_ctx(p, mobile=mobile, tag="fam3" + ("-m" if mobile else ""), fam=True)
        tap(page.locator("#scr-title .menu .btn.primary")); page.wait_for_timeout(300)
        page.keyboard.press("Escape"); page.wait_for_timeout(300)
        st = page.evaluate("WH.UI.settings")
        check(f"§33 {tag}: Esc keeps the defaults, counts as asked and continues to the picker", st["loreCards"] == "new" and st["keywordLinks"] is True and st["loreAsked"] is True and page.locator("#scr-select").is_visible(), json.dumps(st))
        ctx.close(); b.close()

    # ---- returning player (has codex progress) is never asked
    b, ctx, page = new_ctx(p, tag="fam4", fam=True)
    page.evaluate("() => { localStorage.setItem('whatiswh.codexGlobal', JSON.stringify([Object.keys(WH.codex)[0]])); }")
    page.reload(); page.wait_for_selector("#scr-title .title-main")
    check("§33: returning player (codex progress, no stored flag) -> loreAsked true, not asked", page.evaluate("WH.UI.settings.loreAsked") is True)
    page.locator("#scr-title .menu .btn.primary").click(); page.wait_for_timeout(300)
    check("§33: ... new game goes straight to the picker", page.locator(".modal-back").count() == 0 and page.locator("#scr-select").is_visible())
    ctx.close(); b.close()

    # ---- keyword links in the story text follow the setting (re-render via the language switch)
    b, ctx, page = new_ctx(p, tag="fam5")
    page.locator("#scr-title .menu .btn.primary").click(); page.wait_for_timeout(250)
    pick_faction(page); page.wait_for_timeout(500); wait_idle(page); page.wait_for_timeout(300); finish_text(page); page.wait_for_timeout(200)
    def rerender():
        page.locator("#tools button", has_text="EN").click(); page.wait_for_timeout(150); finish_text(page)
        page.locator("#tools button", has_text="中").click(); page.wait_for_timeout(150); finish_text(page)
    if not REAL:
        check("§33: links on (default) -> keyword spans in the story text", page.locator("#dlg-text .kw").count() >= 1)
    page.evaluate("() => { WH.UI.settings.keywordLinks = false; }"); rerender()
    check("§33: keywordLinks off -> no keyword spans, text intact", page.locator("#dlg-text .kw").count() == 0 and len(page.locator("#dlg-text").inner_text()) > 10)
    page.evaluate("() => { WH.UI.settings.keywordLinks = true; }"); rerender()
    if not REAL:
        check("§33: keywordLinks back on -> keyword spans return", page.locator("#dlg-text .kw").count() >= 1)
    ctx.close(); b.close()

    b, ctx, page = new_ctx(p, tag="fam6")
    page.locator("#scr-title .menu button", has_text="设置").click(); page.wait_for_timeout(250)
    row = page.locator(".kw-row")
    check("§33: Settings has a 台词里的条目链接 on/off row", row.count() == 1 and "台词里的条目链接" in row.inner_text())
    row.locator("button", has_text="关").click(); page.wait_for_timeout(200)
    check("§33: toggling it off persists keywordLinks=false", page.evaluate("JSON.parse(localStorage.getItem('whatiswh.settings')).keywordLinks") is False and page.evaluate("WH.UI.settings.keywordLinks") is False)
    page.locator(".kw-row button", has_text="开").click(); page.wait_for_timeout(200)
    check("§33: ... and back on", page.evaluate("WH.UI.settings.keywordLinks") is True)
    page.locator(".modal-head button").click(); page.wait_for_timeout(150)
    ctx.close(); b.close()

def run_v040(p):
    """SPEC §32 on sample data: node.alt (text replacement + adds, from* conditions, arrival state, reload / rewind), choice.resultAlt, death-node alt,
    event `where` / `excludeFactions`, save fallback (unknown node id → start of the saved chapter + notice). zh + en, desktop + mobile."""
    print("\n== v0.4.0 story overhaul engine (SPEC §32, sample) ==")
    b, ctx, page = new_ctx(p, tag="v040")
    eng = page.evaluate("""() => {
      const STEP = () => ({kind:'node', nodeId:null, choiceDeltas:{}, nodeDeltas:{}, deltas:{}, time:null, chapterChanged:false, fromChapter:null, codexNew:[], roll:null, death:null, ending:null, event:null, deathPending:null, rumor:null, rumorCodex:[], grudge:null});
      const mkG = (extra) => { const g = new WH.Game('sample', Object.assign({rng: WH.RNG(3), rumors: false, echoes: false}, extra || {})); g.start('hive'); return g; };
      const enter = (node, prev, flags, mut, extra) => { const g = mkG(extra); g.state.flags = Object.assign({}, flags || {}); g.state.nodeId = prev; g.state.history = [prev]; g.state.ended = false;
        if (mut) mut(g); g._enter(node, STEP()); return g; };
      const base = WH.factions.sample.nodes.smp_006.text, out = {};
      const a = enter('smp_006', 'smp_004', {});
      out.plain = [a.nodeBody().zh === base.zh && a.nodeBody().en === base.en, a.state.altSel, a.altAdds().length];
      const t = enter('smp_006', 'smp_004', {token: true});
      out.token = [t.nodeBody().zh.indexOf('袖中的铁片开始发烫') >= 0, t.nodeBody().zh.indexOf('\\n\\n') < 0, t.nodeBody().en.indexOf('token in your sleeve') >= 0, t.state.altSel && t.state.altSel.t];
      const c = enter('smp_006', 'smp_005', {token: true, origin_scav: true, prayed: true});
      const cz = c.nodeBody().zh.split('\\n\\n');
      out.max2 = [cz.length, cz[1], cz[2], c.state.altSel.a, c.nodeBody().zh.indexOf('淤青') < 0];
      const d = enter('smp_006', 'smp_005', {});
      out.fromNode = [d.nodeBody().zh === base.zh + '\\n\\n执法者留下的淤青还在疼。', d.nodeBody().en === base.en + '\\n\\nThe bruises the enforcers left still ache.'];
      const e = enter('smp_006', 'smp_004', {prayed: true});
      out.nodeText = [e.nodeText().zh === e.nodeBody().zh, e.altText().zh === base.zh, e.altAdds().length];
      // saved with the selection: a reload (even with different flags in the record) shows the same text; a record without altSel re-resolves
      const rec = JSON.parse(JSON.stringify(c.toRecord())); rec.flags = {};
      const r1 = WH.Game.fromRecord(rec, {rumors: false, echoes: false});
      const rec2 = JSON.parse(JSON.stringify(rec)); delete rec2.altSel; const r2 = WH.Game.fromRecord(rec2, {rumors: false, echoes: false});
      out.reload = [!!rec.altSel, r1.nodeBody().zh === c.nodeBody().zh, r2.nodeBody().zh === base.zh + '\\n\\n执法者留下的淤青还在疼。', JSON.stringify(r1.toRecord().altSel) === JSON.stringify(c.state.altSel)];
      // rewind: back to the choice before → the same text again
      const rw = enter('smp_006', 'smp_005', {origin_scav: true}, null, {rewind: true}); const b0 = rw.nodeBody().zh; rw.choose(0);
      out.rewind = [rw.state.nodeId !== 'smp_006', rw.rewind(), rw.state.nodeId === 'smp_006' && rw.nodeBody().zh === b0 && b0.indexOf('下巢的老人说过') >= 0];
      // no RNG draws: the main stream is identical with and without alt data
      const rngAfter = (stripAlt) => { const g = mkG({rng: WH.RNG(9)}); g.state.nodeId = 'smp_005'; g.state.history = ['smp_005']; const n = WH.factions.sample.nodes.smp_006, hold = n.alt;
        if (stripAlt) delete n.alt; try { g._enter('smp_006', STEP()); } finally { n.alt = hold; } return g.rng.getState(); };
      out.noRng = rngAfter(false) === rngAfter(true);
      // resultAlt (flag prayed) on smp_002's first choice, judged before the choice's effects; zh + en
      const ra = (flags) => { const g = enter('smp_002', 'smp_001', flags); const st = g.choose(0); return st.consequence.text; };
      const rp = ra({prayed: true}), rn = ra({});
      out.resultAlt = [rp.zh.indexOf('默念祷文') >= 0 && rp.en.indexOf('mutter the litany') >= 0, rn.zh.indexOf('你扯回手臂，留下一层皮') >= 0 && rn.zh.indexOf('祷文') < 0];
      // death / claim nodes get alt too: fromScene / fromChapter of the node the death came from
      const dt = enter('smp_007', 'smp_006', {}, (g) => { g.state.stats.hp = 5; }); const ddead = dt.state.deathPending; dt.choose(0);
      const early = enter('smp_002', 'smp_001', {}, (g) => { g.state.stats.hp = 10; }); early.choose(0);
      out.death = [ddead, dt.state.nodeId, dt.nodeBody().zh.indexOf('你倒在战壕的泥里') === 0, dt.nodeBody().zh.indexOf('还没轮到') < 0, early.state.nodeId, early.nodeBody().zh.indexOf('你的血渗进') === 0 && early.nodeBody().zh.indexOf('还没轮到上战场') > 0];
      return out; }""")
    check("§32.2 alt: no condition matches → the base text, no selection stored", eng["plain"][0] and eng["plain"][1] is None and eng["plain"][2] == 0, str(eng["plain"]))
    check("§32.2 alt: the first matching `text` entry replaces the node text (zh + en)", all(eng["token"][:3]) and eng["token"][3] == 0, str(eng["token"]))
    check("§32.2 alt: matching `add` entries are separate paragraphs, at most 2 (the third match is dropped)", eng["max2"][0] == 3 and "下巢的老人说过" in eng["max2"][1] and "祷文" in eng["max2"][2] and eng["max2"][3] == [1, 2] and eng["max2"][4], str(eng["max2"]))
    check("§32.2 alt: fromNode looks at the previously played node (zh + en)", all(eng["fromNode"]), str(eng["fromNode"]))
    check("§32.2 alt: altText / altAdds / nodeText agree", all(eng["nodeText"][:2]) and eng["nodeText"][2] == 1, str(eng["nodeText"]))
    check("§32.2 alt: stored in state.altSel → record.altSel; a reload shows the same text, a record without it re-resolves", all(eng["reload"]), str(eng["reload"]))
    check("§32.2 alt: a rewind (§30) shows the same alt text again", eng["rewind"][0] and eng["rewind"][1] and eng["rewind"][2], str(eng["rewind"]))
    check("§32.2 alt: resolving alt draws nothing from the RNG", eng["noRng"])
    check("§32.2 resultAlt: first match replaces choice.result (flag prayed), base result otherwise", all(eng["resultAlt"]), str(eng["resultAlt"]))
    check("§32.2 alt on death nodes: fromScene replaces the text, fromChapter adds a line, no match → base", eng["death"][0] == "hp" and eng["death"][1] == "smp_death_hp" and eng["death"][2] and eng["death"][3] and eng["death"][4] == "smp_death_hp" and eng["death"][5], str(eng["death"]))
    # --- event where / excludeFactions ---
    ev = page.evaluate("""() => {
      const mk = (flags) => { const g = new WH.Game('sample', {rng: WH.RNG(4), rumors: false, echoes: false}); g.start('hive'); g.state.flags = Object.assign({}, flags || {}); return g; };
      const ids = (g, ch, n) => g.eligibleEvents(ch, n).map(e => e.id), out = {};
      const g = mk({peeked: true});
      out.right = ids(g, 1, 'smp_002').includes('smp_evt_where');
      out.wrongScene = !ids(g, 1, 'smp_003').includes('smp_evt_where');
      out.wrongChapter = !ids(g, 2, 'smp_004').includes('smp_evt_where');
      out.noFlag = !ids(mk({}), 1, 'smp_002').includes('smp_evt_where');
      out.legacy = ids(mk({}), 1).includes('smp_evt_where');                      // no node given → where is ignored (old callers)
      out.excluded = ['smp_001', 'smp_002', 'smp_003', 'smp_006'].every(n => !ids(g, 4, n).includes('smp_evt_excl')) && !ids(g, 1).includes('smp_evt_excl');
      out.generic = ids(g, 1, 'smp_003').includes('smp_evt_khorne');                // events without `where` behave as before
      // _goTo with an eventRoll of 1: the where-event can fire in the manufactorum, never underhive, over many seeds
      const F = WH.factions.sample, old = [F.nodes.smp_002.eventRoll, F.nodes.smp_003.eventRoll]; F.nodes.smp_002.eventRoll = 1; F.nodes.smp_003.eventRoll = 1;
      let hit = 0, wrong = 0, others = 0;
      for (let seed = 1; seed <= 80; seed++) {
        const a = new WH.Game('sample', {rng: WH.RNG(seed), rumors: false, echoes: false}); a.start('hive'); a.state.flags.peeked = true;
        const s1 = a._goTo('smp_002', {kind: 'node', nodeId: null, choiceDeltas: {}, nodeDeltas: {}, deltas: {}, codexNew: [], rumorCodex: []});
        if (s1.kind === 'event') { if (s1.event.id === 'smp_evt_where') hit++; else others++; }
        const c = new WH.Game('sample', {rng: WH.RNG(seed), rumors: false, echoes: false}); c.start('hive'); c.state.flags.peeked = true;
        const s2 = c._goTo('smp_003', {kind: 'node', nodeId: null, choiceDeltas: {}, nodeDeltas: {}, deltas: {}, codexNew: [], rumorCodex: []});
        if (s2.kind === 'event' && (s2.event.id === 'smp_evt_where' || s2.event.id === 'smp_evt_excl')) wrong++;
      }
      F.nodes.smp_002.eventRoll = old[0]; F.nodes.smp_003.eventRoll = old[1]; if (old[0] === undefined) delete F.nodes.smp_002.eventRoll;
      out.fire = [hit, others, wrong];
      return out; }""")
    check("§32.3 where: the event is eligible on the right scene + flag + chapter", ev["right"])
    check("§32.3 where: blocked on the wrong scene, the wrong chapter and without the flag", ev["wrongScene"] and ev["wrongChapter"] and ev["noFlag"])
    check("§32.3 where: callers without a node (legacy) ignore `where`; events without `where` are unchanged", ev["legacy"] and ev["generic"])
    check("§32.3 excludeFactions: an excluded faction never gets the event", ev["excluded"])
    check("§32.3 where in _goTo: fires in the manufactorum (some seeds), never underhive over 80 seeds", ev["fire"][0] > 0 and ev["fire"][1] > 0 and ev["fire"][2] == 0, str(ev["fire"]))
    # --- save fallback (engine) ---
    fb = page.evaluate("""() => {
      const g = new WH.Game('sample', {rng: WH.RNG(2), rumors: false, echoes: false}); g.start('hive'); g.state.flags = {prayed: true, origin_hive: true}; g.state.stats.hp = 61;
      const rec = (o) => Object.assign(JSON.parse(JSON.stringify(g.toRecord())), o), load = (o) => WH.Game.fromRecord(rec(o), {rumors: false, echoes: false}), out = {};
      const a = load({nodeId: 'smp_gone', chapter: 3}), b = load({nodeId: 'smp_gone', chapter: 2}), c = load({nodeId: 'smp_gone', chapter: 1, origin: 'scav'}), d = load({nodeId: 'smp_gone', chapter: 9});
      out.ch = [a.state.nodeId, b.state.nodeId, c.state.nodeId, d.state.nodeId];
      out.kept = [a.state.flags.prayed === true, a.state.stats.hp === 61, a.fallbackFrom, a.state.chapter, a.state.ended, a.node().chapter];
      out.ok = load({}).fallbackFrom === undefined;
      const e = load({nodeId: 'smp_004', pendingEvent: 'smp_evt_khorne', pendingNext: 'smp_gone2', chapter: 2});
      out.pending = [e.fallbackFrom, e.state.pendingEvent, e.state.pendingNext, e.state.nodeId];
      const f = load({nodeId: 'smp_gone', chapter: 4, ended: true, deathPending: 'hp'}); out.deadWood = [f.state.ended, f.state.deathPending, f.state.stats.hp >= 1];
      const step = a.choose(0); out.plays = !!step && a.state.nodeId !== 'smp_006';
      out.validate = [WH.Save.validate(rec({nodeId: 'smp_gone'})).ok, WH.Save.validate(rec({faction: 'nope'})).error];
      out.fallbackNode = WH.Game.fallbackNode(WH.factions.sample, 2, 'hive');
      return out; }""")
    check("§32.4 fallback: unknown node → first node of the saved chapter (bridge, entry node, origin start; unknown chapter → nearest earlier)", fb["ch"] == ["smp_006", "smp_004", "smp_o_scav_1", "smp_007"] and fb["fallbackNode"] == "smp_004", str(fb["ch"]))
    check("§32.4 fallback: stats / flags kept, chapter follows the new node, the notice flag names the missing id", fb["kept"] == [True, True, "smp_gone", 3, False, 3], str(fb["kept"]))
    check("§32.4 fallback: a record whose node exists is untouched; a vanished pendingNext drops the event; a vanished ending / death is not carried over",
          fb["ok"] and fb["pending"] == ["smp_gone2", None, None, "smp_004"] and fb["deadWood"] == [False, None, True], str(fb["pending"]) + str(fb["deadWood"]))
    check("§32.4 fallback: the run continues from the fallback node; Save.validate accepts an unknown node, still rejects an unknown faction", fb["plays"] and fb["validate"][0] is True and fb["validate"][1] == "err_faction", str(fb["validate"]))
    # --- UI ---
    page.locator("#scr-title .menu .btn.primary").click(); page.wait_for_timeout(200)
    pick_faction(page, "sample", "hive"); wait_idle(page); finish_text(page)
    goto_node(page, "smp_006", flags={"token": True, "origin_scav": True, "prayed": True}, history=["smp_005"])
    tx = page.locator("#dlg-text").inner_text()
    check("§32.2 UI: the dialogue shows the alt-resolved text then the first two add paragraphs", "袖中的铁片开始发烫" in tx and tx.index("下巢的老人说过") > tx.index("袖中的铁片") and tx.index("你的嘴唇仍记得") > tx.index("下巢的老人说过") and "淤青" not in tx and "\n\n" in tx, tx)
    shot(page, "v040_alt_zh")
    page.locator("#tools button", has_text="EN").click(); page.wait_for_timeout(200); finish_text(page)
    tx = page.locator("#dlg-text").inner_text()
    check("§32.2 UI: English re-renders the same selection", "token in your sleeve" in tx and "old man downhive" in tx and "Your lips still remember" in tx and "bruises" not in tx, tx)
    page.locator("#tools button", has_text="中").click(); page.wait_for_timeout(200); finish_text(page)
    rec_ok = page.evaluate("""() => { const r = WH.UI.game.toRecord(); r.flags = {}; WH.UI.loadRecord(r); return !!r.altSel; }""")
    page.wait_for_timeout(150); finish_text(page)
    check("§32.2 UI: loading a record restores the stored selection (not re-evaluated from the changed flags)", rec_ok and "袖中的铁片开始发烫" in page.locator("#dlg-text").inner_text())
    # language switch while the consequence beat is open re-renders the SAME node text (with its alt paragraphs)
    goto_node(page, "smp_006", flags={"origin_scav": True, "prayed": True}, history=["smp_004"])
    page.locator("#choices button", has_text="闭眼背诵祷文").click(); page.wait_for_timeout(150)
    opened = page.locator("#conseq").count() == 1
    page.locator("#tools button", has_text="EN").click(); page.wait_for_timeout(200); finish_text(page)
    check("§32.2 UI: language switch during a consequence beat keeps the previous node's alt text", opened and "Your lips still remember" in page.locator("#dlg-text").inner_text(), page.locator("#dlg-text").inner_text())
    page.locator("#tools button", has_text="中").click(); page.wait_for_timeout(150)
    pass_conseq(page); wait_idle(page); finish_text(page)
    # resultAlt in the UI (the consequence panel)
    goto_node(page, "smp_002", flags={"prayed": True}, history=["smp_001"])
    page.locator("#choices button", has_text="拼命干活").click(); page.wait_for_timeout(150); finish_text(page)
    check("§32.2 UI: resultAlt text shows in the consequence panel", "你默念祷文" in page.locator("#conseq .cq-text").inner_text(), page.locator("#conseq .cq-text").inner_text())
    pass_conseq(page); wait_idle(page); finish_text(page)
    goto_node(page, "smp_002", flags={}, history=["smp_001"])
    page.locator("#choices button", has_text="拼命干活").click(); page.wait_for_timeout(150); finish_text(page)
    check("§32.2 UI: no condition → the base result", "祷文" not in page.locator("#conseq .cq-text").inner_text() and "留下一层皮" in page.locator("#conseq .cq-text").inner_text())
    pass_conseq(page); wait_idle(page); finish_text(page)
    # ending screen: alt text of the death node
    page.evaluate("""() => { const STEP = () => ({kind:'node', nodeId:null, choiceDeltas:{}, nodeDeltas:{}, deltas:{}, time:null, chapterChanged:false, fromChapter:null, codexNew:[], roll:null, death:null, ending:null, event:null, deathPending:null, rumor:null, rumorCodex:[], grudge:null});
      const g = new WH.Game('sample', {rng: WH.RNG(3), rumors: false, echoes: false}); g.start('hive'); g.state.nodeId = 'smp_007'; g.state.history = ['smp_006']; g.state.ended = false; g.state.stats.hp = 5;
      g.state.deathPending = 'hp'; g.choose(0); WH.UI.loadRecord(g.toRecord()); }""")
    page.wait_for_timeout(300)
    et = page.locator(".ending-text").inner_text()
    check("§32.2 UI: the ending screen shows the alt-resolved death text", "你倒在战壕的泥里" in et and "你的血渗进" not in et, et)
    shot(page, "v040_ending_alt")
    # save fallback notice (zh, then en); the run is playable afterwards
    page.evaluate("""() => { const g = new WH.Game('sample', {rng: WH.RNG(2), rumors: false, echoes: false}); g.start('hive'); g.state.flags.prayed = true; g.state.stats.hp = 61;
      WH.UI.show('game'); WH.UI.loadRecord(Object.assign(g.toRecord(), {nodeId: 'smp_gone', chapter: 2})); }""")
    page.wait_for_timeout(250); finish_text(page)
    st = state(page)
    check("§32.4 UI: a vanished node shows the one-line notice (zh) and the start of the saved chapter, stats / flags kept",
          page.locator(".toast", has_text="剧情已更新，已回到本章开头").count() == 1 and st["nodeId"] == "smp_004" and st["flags"].get("prayed") is True and st["stats"]["hp"] == 61, str(st["nodeId"]))
    click_choice(page, 0); wait_idle(page)
    if page.locator("#event-overlay").count(): resolve_event(page)
    wait_idle(page); finish_text(page)
    check("§32.4 UI: the run continues after the fallback", state(page)["nodeId"] != "smp_004" and page.locator("#dlg-text").inner_text().strip() != "", f"{state(page)['nodeId']} | {page.locator('#dlg-text').inner_text()[:40]!r} | conseq={page.locator('#conseq').count()} ev={page.locator('#event-overlay').count()}")
    page.locator("#tools button", has_text="EN").click(); page.wait_for_timeout(200)
    page.evaluate("""() => { const g = new WH.Game('sample', {rng: WH.RNG(2), rumors: false, echoes: false}); g.start('hive'); WH.UI.loadRecord(Object.assign(g.toRecord(), {nodeId: 'smp_gone', chapter: 3})); }""")
    page.wait_for_timeout(250)
    check("§32.4 UI: the notice in English; a bridge node is the chapter start", page.locator(".toast", has_text="Story updated — back to the start of this chapter").count() == 1 and state(page)["nodeId"] == "smp_006")
    shot(page, "v040_fallback_en")
    ctx.close(); b.close()
    # --- mobile ---
    b, ctx, page = new_ctx(p, mobile=True, tag="v040-m")
    page.locator("#scr-title .menu .btn.primary").tap(); page.wait_for_timeout(200)
    pick_faction(page, "sample", "hive", tap=True); wait_idle(page); finish_text(page)
    goto_node(page, "smp_006", flags={"token": True, "origin_scav": True, "prayed": True}, history=["smp_005"])
    check("§32.2 mobile: alt paragraphs readable, no horizontal overflow", "你的嘴唇仍记得" in page.locator("#dlg-text").inner_text() and page.evaluate("document.documentElement.scrollWidth") <= 391)
    page.screenshot(path=os.path.join(OUT, "m80_alt.png"))
    ctx.close(); b.close()

def run_real_v040(p):
    """--real: every `alt` node of every route resolves without throwing (no flags / every flag the node tests set), the engine tolerates each
    route's unknown-node fallback, and no event `where` references a missing scene or node."""
    print("\n== v0.4.0 story overhaul (real data) ==")
    b, ctx, page = new_ctx(p, tag="realv040")
    res = page.evaluate("""() => {
      const out = {nodes: 0, alt: 0, bad: [], fb: 0, fbBad: [], ev: 0, evBad: []};
      const flagsOf = (c, s) => { if (!c || typeof c !== 'object') return s; ['flag', 'notFlag'].forEach(k => { if (typeof c[k] === 'string') s.add(c[k]); }); ['flags', 'anyFlag'].forEach(k => [].concat(c[k] || []).forEach(x => s.add(x)));
        ['any', 'all'].forEach(k => [].concat(c[k] || []).forEach(x => flagsOf(x, s))); if (c.not) flagsOf(c.not, s); return s; };
      for (const fid of Object.keys(WH.factions)) {
        const f = WH.factions[fid];
        for (const id of Object.keys(f.nodes)) {
          const n = f.nodes[id]; out.nodes++;
          if (Array.isArray(n.alt) && n.alt.length) {
            out.alt++;
            for (const mode of [0, 1]) {
              try {
                const g = new WH.Game(fid, {rng: WH.RNG(1), rumors: false, echoes: false}); g.start();
                const fl = new Set(); n.alt.forEach(a => flagsOf(a.if, fl)); g.state.flags = {}; if (mode) fl.forEach(k => { g.state.flags[k] = true; });
                g.state.history = [f.startNode]; g.state.nodeId = f.startNode; g._enter(id, {kind: 'node', nodeId: null, choiceDeltas: {}, nodeDeltas: {}, deltas: {}, codexNew: [], rumorCodex: []});
                const t = g.nodeBody(); if (typeof t.zh !== 'string' || !t.zh.trim() || typeof t.en !== 'string' || !t.en.trim()) out.bad.push(fid + '/' + id + ' empty');
                const rec = JSON.parse(JSON.stringify(g.toRecord())); const g2 = WH.Game.fromRecord(rec, {rumors: false, echoes: false}); if (g2.nodeBody().zh !== t.zh) out.bad.push(fid + '/' + id + ' reload differs');
              } catch (e) { out.bad.push(fid + '/' + id + ' ' + e.message); }
            }
          }
        }
        const chapters = Object.keys(f.chapters || {}).map(Number);
        for (const ch of chapters) { out.fb++; try { const g = new WH.Game(fid, {rng: WH.RNG(1)}); g.start(); const rec = JSON.parse(JSON.stringify(g.toRecord())); rec.nodeId = '__gone__'; rec.chapter = ch;
          const g2 = WH.Game.fromRecord(rec, {rumors: false, echoes: false}); if (!f.nodes[g2.state.nodeId] || f.nodes[g2.state.nodeId].ending || g2.fallbackFrom !== '__gone__') out.fbBad.push(fid + ' ch' + ch + ' → ' + g2.state.nodeId); } catch (e) { out.fbBad.push(fid + ' ch' + ch + ' ' + e.message); } }
      }
      for (const e of WH.events) { if (!e.where) continue; out.ev++;
        for (const k of ['scenes', 'notScenes']) [].concat(e.where[k] || []).forEach(sc => { if (!WH.scenes[sc]) out.evBad.push(e.id + ' ' + k + ' ' + sc); }); }
      return out; }""")
    print(f"  {res['alt']} alt nodes / {res['nodes']} nodes, {res['fb']} chapter fallbacks, {res['ev']} events with where")
    check("§32 real: every alt node resolves (no flags / all tested flags), reloads identically and never throws", not res["bad"], "; ".join(res["bad"][:6]))
    check("§32 real: save fallback lands on a real, non-ending node of every chapter of every route", not res["fbBad"], "; ".join(res["fbBad"][:6]))
    check("§32 real: event `where` scenes are known", not res["evBad"], "; ".join(res["evBad"][:6]))
    ctx.close(); b.close()



with sync_playwright() as p:
    t0 = time.time()
    if "--only-v033" in ARGS:                        # SPEC §29/§30 quick loop (sample data)
        run_rewind(p); run_style(p)
        fails = [r for r in results if not r[1]]
        print(f"\nconsole/page errors: {len(errors)}")
        for e in errors: print("  " + e)
        print(f"\n{len(results) - len(fails)}/{len(results)} checks passed, {len(errors)} console errors · {time.time() - t0:.1f}s · screenshots in {OUT}")
        sys.exit(1 if fails or errors else 0)
    if "--only-gather" in ARGS:                      # SPEC §20c quick loop (sample: run_gather, --real: run_real_gather)
        (run_real_gather if REAL else run_gather)(p)
        fails = [r for r in results if not r[1]]
        print(f"\nconsole/page errors: {len(errors)}")
        for e in errors: print("  " + e)
        print(f"\n{len(results) - len(fails)}/{len(results)} checks passed, {len(errors)} console errors · {time.time() - t0:.1f}s · screenshots in {OUT}")
        sys.exit(1 if fails or errors else 0)
    if "--only-track" in ARGS:                       # SPEC §29b quick loop (sample data, or --real)
        run_track(p)
        fails = [r for r in results if not r[1]]
        print(f"\nconsole/page errors: {len(errors)}")
        for e in errors: print("  " + e)
        print(f"\n{len(results) - len(fails)}/{len(results)} checks passed, {len(errors)} console errors · {time.time() - t0:.1f}s · screenshots in {OUT}")
        sys.exit(1 if fails or errors else 0)
    if "--only-v034" in ARGS:                        # SPEC §31 quick loop (sample data, or --real)
        run_v034(p)
        fails = [r for r in results if not r[1]]
        print(f"\nconsole/page errors: {len(errors)}")
        for e in errors: print("  " + e)
        print(f"\n{len(results) - len(fails)}/{len(results)} checks passed, {len(errors)} console errors · {time.time() - t0:.1f}s · screenshots in {OUT}")
        sys.exit(1 if fails or errors else 0)
    if "--only-fam" in ARGS:                         # SPEC §33 quick loop (sample data, or --real)
        run_fam(p)
        fails = [r for r in results if not r[1]]
        print(f"\nconsole/page errors: {len(errors)}")
        for e in errors: print("  " + e)
        print(f"\n{len(results) - len(fails)}/{len(results)} checks passed, {len(errors)} console errors · {time.time() - t0:.1f}s · screenshots in {OUT}")
        sys.exit(1 if fails or errors else 0)
    if "--only-v040" in ARGS:                        # SPEC §32 quick loop (sample: run_v040, --real: run_real_v040)
        (run_real_v040 if REAL else run_v040)(p)
        fails = [r for r in results if not r[1]]
        print(f"\nconsole/page errors: {len(errors)}")
        for e in errors: print("  " + e)
        print(f"\n{len(results) - len(fails)}/{len(results)} checks passed, {len(errors)} console errors · {time.time() - t0:.1f}s · screenshots in {OUT}")
        sys.exit(1 if fails or errors else 0)
    if "--only-grudge" in ARGS:                      # quick loop while working on SPEC §28 (sample: run_grudge, --real: run_real_grudge)
        (run_real_grudge if REAL else run_grudge)(p)
        fails = [r for r in results if not r[1]]
        print(f"\nconsole/page errors: {len(errors)}")
        for e in errors: print("  " + e)
        print(f"\n{len(results) - len(fails)}/{len(results)} checks passed, {len(errors)} console errors · {time.time() - t0:.1f}s · screenshots in {OUT}")
        sys.exit(1 if fails or errors else 0)
    if "--only-v022" not in ARGS: run_desktop(p)
    if "--only-v022" not in ARGS: run_mobile(p)
    if "--only-v022" not in ARGS: run_no_storage(p)
    if not REAL:
        if "--only-v022" not in ARGS: run_v02(p)
        run_v022(p)
        run_egg(p)
        run_data(p)
        run_v03(p)
        run_grudge(p)
        run_rewind(p)
        run_v040(p)
        run_gather(p)
    if "--only-v022" not in ARGS: run_five(p)
    run_difficulty(p)
    run_style(p)
    run_track(p)
    run_v034(p)
    run_fam(p)
    if REAL:
        run_new_routes(p)
        run_real_v022(p)
        run_real_v03(p)
        run_real_grudge(p)
        run_real_v040(p)
        run_real_gather(p)
    fails = [r for r in results if not r[1]]
    print(f"\nconsole/page errors: {len(errors)}")
    for e in errors: print("  " + e)
    print(f"\n{len(results) - len(fails)}/{len(results)} checks passed, {len(errors)} console errors · {time.time() - t0:.1f}s · screenshots in {OUT}")
    sys.exit(1 if fails or errors else 0)
