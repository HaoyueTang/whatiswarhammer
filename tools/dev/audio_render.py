#!/usr/bin/env python3
"""audio_render.py — headless-Chrome test + offline render of every mood and SFX (audio role).

    python3 tools/dev/audio_render.py                  # live API test + render all chip moods/SFX, print stats
    options: --out /tmp/wh_audio_renders  --sr 22050  --chrome /usr/bin/google-chrome  --moods battle,boss  --no-live
             --styles chip|all|dark,organ   (music styles to render offline; default chip. The style x mood render gate with
                                             loudness / seam / repetition checks is `node tools/dev/audio_check.js`)

1. Live: opens tools/dev/audio_test.html (file://), asserts no AudioContext before a gesture, clicks to unlock,
   auditions every mood button and SFX button, checks hysteresis/mute/volume API, music styles (setStyle crossfade,
   every mood of every style plays, previewStyle timeline: calm phrase, tense phrase, self-stop, previous mood resumes,
   never overlaps the running mood), collects console errors.
2. Offline: renders each mood (of each requested style) through OfflineAudioContext with the real audio.js synth (music
   volume 1.0 = worst case), writes WAVs, and checks peak <= -1 dBFS, no clipping, RMS in range, no unintended silence,
   loop length, and that the loop restarts (start of loop 1 vs loop 2 correlate).
"""
import base64, json, os, sys, wave
import numpy as np
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ARGS = sys.argv[1:]
def opt(name, default):
    return ARGS[ARGS.index(name) + 1] if name in ARGS and ARGS.index(name) + 1 < len(ARGS) else default
OUT = opt("--out", "/tmp/wh_audio_renders")
SR = int(opt("--sr", "22050"))
CHROME = opt("--chrome", "/usr/bin/google-chrome")
ONLY = [m for m in opt("--moods", "").split(",") if m]
STYLES_ARG = opt("--styles", "chip")
os.makedirs(OUT, exist_ok=True)
URL = "file://" + os.path.join(ROOT, "tools", "dev", "audio_test.html")

fails, console_errors = [], []
def check(name, cond, detail=""):
    print(("  PASS " if cond else "  FAIL ") + name + (f"  — {detail}" if detail else ""))
    if not cond: fails.append(name)

def db(x): return 20 * np.log10(max(float(x), 1e-9))

def write_wav(path, data):
    pcm = (np.clip(data, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

JS_FETCH = """async ([kind, name, secs, sr, style]) => {
  const res = kind === 'mood' ? await WH.Audio._render(name, secs, sr, style) : {buffer: await WH.Audio._renderSfx(name, secs, sr)};
  const b = res.buffer, L = b.getChannelData(0), R = b.getChannelData(1), n = L.length;
  const out = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) { out[2*i] = L[i]; out[2*i+1] = R[i]; }
  const u8 = new Uint8Array(out.buffer); let s = '';
  for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  return {b64: btoa(s), loops: res.loops || [], info: res.info || null};
}"""

def fetch(page, kind, name, secs, style="chip"):
    r = page.evaluate(JS_FETCH, [kind, name, secs, SR, style])
    data = np.frombuffer(base64.b64decode(r["b64"]), dtype="<f4").reshape(-1, 2)
    return data, r["loops"], r["info"]

def spec_sim(x, y, n=4096):
    def spec(z):
        frames = len(z) // n
        f = z[: frames * n].reshape(frames, n) * np.hanning(n)
        return np.sqrt(np.mean(np.abs(np.fft.rfft(f, axis=1)) ** 2, axis=0))[: n // 4]   # up to SR/8 (~2.7 kHz)
    a, b = spec(x), spec(y)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-12))

def centroid(mono):
    """spectral centroid (Hz) of the whole render — a rough 'brightness' figure per mood"""
    n = 4096; frames = len(mono) // n
    if not frames: return 0.0
    f = mono[: frames * n].reshape(frames, n) * np.hanning(n)
    mag = np.mean(np.abs(np.fft.rfft(f, axis=1)), axis=0); hz = np.fft.rfftfreq(n, 1 / SR)
    return float(np.sum(hz * mag) / (np.sum(mag) + 1e-12))

def low_share(mono, cut=200):
    """share (%) of spectral magnitude below `cut` Hz — how bass/drum-heavy ('stompy') a mood is"""
    n = 4096; frames = len(mono) // n
    if not frames: return 0.0
    f = mono[: frames * n].reshape(frames, n) * np.hanning(n)
    mag = np.mean(np.abs(np.fft.rfft(f, axis=1)), axis=0); hz = np.fft.rfftfreq(n, 1 / SR)
    return float(100 * np.sum(mag[hz < cut]) / (np.sum(mag) + 1e-12))

def onset_rate(mono):
    """rough onsets per second (positive jumps of the 10 ms energy envelope) — a busy-ness figure"""
    e = window_rms(mono, int(SR * 0.01)); d = np.diff(np.log(e + 1e-6))
    return float(np.sum((d[1:] > 0.5) & (d[:-1] <= 0.5)) / (len(mono) / SR))

def window_rms(mono, win):
    n = len(mono) // win
    return np.sqrt(np.mean(mono[: n * win].reshape(n, win) ** 2, axis=1) + 1e-12)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=CHROME, args=["--autoplay-policy=no-user-gesture-required"])
    page = browser.new_page()
    page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: console_errors.append("pageerror: " + str(e)))
    page.goto(URL)
    page.wait_for_timeout(300)
    A = "WH.Audio"
    moods = page.evaluate(f"{A}.moods")
    sfxs = page.evaluate(f"{A}.sfxNames")

    if "--no-live" not in ARGS:
        print("Live API (headless Chrome, %s)" % URL)
        check("no AudioContext before a user gesture", page.evaluate(f"{A}._ctx() === null"))
        check("sfx() before unlock is silent (returns false)", page.evaluate(f"{A}.sfx('click') === false"))
        check("setMood() before unlock only records the wish", page.evaluate(f"{A}.setMood('title') === true && {A}.current() === null && {A}.wanted() === 'title'"))
        page.mouse.click(5, 5)
        page.wait_for_timeout(400)
        check("first click unlocks + starts the wished mood", page.evaluate(f"{A}._ctx().state === 'running' && {A}.current() === 'title'"),
              page.evaluate(f"{A}._ctx().state + ' / ' + {A}.current()"))
        for m in moods:
            page.click(f"button[data-mood='{m}']")
            page.wait_for_timeout(450)
            st = page.evaluate(f"(() => {{ const p = {A}._players()['{m}']; return {{cur: {A}.current(), active: !!(p && p.active), t: {A}._ctx().currentTime, next: p ? p.nextTime : 0}}; }})()")
            check(f"mood '{m}' plays (scheduler ahead of clock)", st["cur"] == m and st["active"] and st["next"] > st["t"], json.dumps(st))
        page.wait_for_timeout(1600)
        n_active = page.evaluate(f"Object.values({A}._players()).filter(p => p.active).length")
        check("old moods stop after their crossfade", n_active == 1, f"{n_active} active players")
        for s in sfxs:
            page.click(f"#sfx button:text-is('{s}')")
            page.wait_for_timeout(120)
        check("every SFX button ran", page.evaluate(f"{A}.sfxNames.every(s => typeof {A}._sfx[s] === 'function')"))
        page.wait_for_timeout(1200)
        ok = page.evaluate(f"(() => {{ let n = 0; for (let i = 0; i < 20; i++) if ({A}.sfx('type')) n++; return n; }})()")
        check("type sfx is rate-limited", ok == 1, f"{ok}/20 immediate calls played")
        # hysteresis
        page.evaluate(f"{A}.setMood('calm', {{force: true}})")
        r = page.evaluate(f"{A}.setMood('tense')")
        check("calm→tense within 8 s is deferred", r == "deferred" and page.evaluate(f"{A}.current()") == "calm", str(r))
        r = page.evaluate(f"{A}.setMood('battle')")
        check("battle bypasses hysteresis", r is True and page.evaluate(f"{A}.current()") == "battle")
        r = page.evaluate(f"{A}.setMood('battle')")
        check("same mood is a no-op", r is True and page.evaluate(f"Object.values({A}._players()).filter(p => p.active && p.stopAt == null).length") == 1)
        # volume / mute
        page.evaluate(f"{A}.setMusicVolume(0.2); {A}.setSfxVolume(0.9)")
        check("volume setters/getters", page.evaluate(f"{A}.getMusicVolume() === 0.2 && {A}.getSfxVolume() === 0.9"))
        page.evaluate(f"{A}.mute(true)")
        page.wait_for_timeout(250)
        check("mute suspends the context + persists", page.evaluate(f"{A}.isMuted() && {A}._ctx().state === 'suspended' && JSON.parse(localStorage.getItem('whatiswh.audio')).muted === true"))
        check("sfx while muted is skipped", page.evaluate(f"{A}.sfx('click') === false"))
        page.evaluate(f"{A}.mute(false)")
        page.wait_for_timeout(250)
        check("unmute resumes", page.evaluate(f"!{A}.isMuted() && {A}._ctx().state === 'running'"))
        # visibility (simulate hidden tab)
        page.evaluate("Object.defineProperty(document, 'hidden', {configurable: true, get: () => true}); document.dispatchEvent(new Event('visibilitychange'))")
        page.wait_for_timeout(200)
        check("hidden tab suspends audio", page.evaluate(f"{A}._ctx().state === 'suspended'"))
        page.evaluate("Object.defineProperty(document, 'hidden', {configurable: true, get: () => false}); document.dispatchEvent(new Event('visibilitychange'))")
        page.wait_for_timeout(200)
        check("visible tab resumes audio", page.evaluate(f"{A}._ctx().state === 'running'"))
        # ---- music styles (SPEC §29)
        styles = page.evaluate(f"{A}.getStyles().map(s => s.id)")
        check("getStyles(): chip first, >= 3 new styles", styles[0] == "chip" and len(styles) >= 4, json.dumps(styles))
        check("every style has zh/en name + description", page.evaluate(f"{A}.getStyles().every(s => s.name.zh && s.name.en && s.desc.zh && s.desc.en)"))
        check("WH.Audio.styles matches getStyles()", page.evaluate(f"JSON.stringify({A}.styles) === JSON.stringify({A}.getStyles())"))
        check("default style is chip", page.evaluate(f"{A}.getStyle() === 'chip'"))
        check("setStyle(unknown) -> chip", page.evaluate(f"{A}.setStyle('no-such-style') === 'chip' && {A}.getStyle() === 'chip'"))
        def players_on():   # players that are playing and not fading out
            return page.evaluate(f"Object.entries({A}._players()).filter(([k, p]) => p.active && p.stopAt == null).map(([k]) => k)")
        page.evaluate(f"{A}.setMood('calm', {{force: true}})")
        page.wait_for_timeout(700)
        for st in styles[1:]:
            page.evaluate(f"{A}.setStyle('chip'); {A}.setMood('calm', {{force: true}})")
            page.wait_for_timeout(1900)
            prev_key = players_on()
            page.evaluate(f"{A}.setStyle('{st}')")
            page.wait_for_timeout(350)
            now = players_on()
            check(f"setStyle('{st}') crossfades the running mood into the new style", now == [f"{st}:calm"] and page.evaluate(f"{A}.current() === 'calm' && {A}.getStyle() === '{st}'"), f"{prev_key} -> {now}")
            page.wait_for_timeout(1700)
            n_active = page.evaluate(f"Object.values({A}._players()).filter(p => p.active).length")
            check(f"setStyle('{st}'): old style's player is gone within 2 s", n_active == 1, f"{n_active} active players")
            bad = []
            for m in moods:
                page.evaluate(f"{A}.setMood('{m}', {{force: true}})")
                page.wait_for_timeout(250)
                ok = page.evaluate(f"(() => {{ const p = {A}._players()['{st}:{m}']; return !!(p && p.active && p.stopAt == null && p.nextTime > {A}._ctx().currentTime && p.S.trim > 0); }})()")
                if not ok or page.evaluate(f"{A}.current()") != m: bad.append(m)
            check(f"style '{st}': all {len(moods)} moods play", not bad, ("failed: " + ",".join(bad)) if bad else "")
        page.evaluate(f"{A}.setMood('calm', {{force: true}})")
        r = page.evaluate(f"{A}.setMood('tense')")
        check(f"hysteresis still applies in style '{styles[-1]}' (calm->tense deferred)", r == "deferred" and page.evaluate(f"{A}.current()") == "calm", str(r))
        r = page.evaluate(f"{A}.setMood('battle')")
        check("battle still bypasses hysteresis in a new style", r is True and page.evaluate(f"{A}.current()") == "battle")
        page.evaluate(f"{A}.setStyle('chip'); {A}.setMood('holy', {{force: true}})")
        page.wait_for_timeout(2300)
        check("setStyle('chip') returns to chip players only", players_on() == ["holy"], json.dumps(players_on()))
        # real files keep overriding every style: a mapped mood that fails to load falls back to the *current style's* synth
        page.evaluate(f"WH.audioFiles = {{tense: 'assets/audio/does_not_exist.ogg'}}; {A}.setStyle('{styles[1]}'); {A}.setMood('tense', {{force: true}})")
        page.wait_for_timeout(900)
        fb = [page.evaluate(f"{A}.current()"), ",".join(players_on())]
        check("missing file in a new style falls back to that style's synth", fb == ["tense", f"{styles[1]}:tense"], json.dumps(fb))
        page.evaluate(f"WH.audioFiles = {{}}; {A}.setStyle('chip')")
        # previewStyle: ~8 s, calm phrase then tense phrase, never overlaps the running mood, self-stopping, previous mood resumes
        for st in styles:
            page.evaluate(f"{A}.setStyle('chip'); {A}.setMood('holy', {{force: true}})")
            page.wait_for_timeout(2200)
            started = page.evaluate(f"{A}.previewStyle('{st}')")
            check(f"previewStyle('{st}') starts", started is True and page.evaluate(f"{A}.isPreviewing()"))
            page.wait_for_timeout(1000)
            keys = players_on()
            calm, tense = ("calm", "tense") if st == "chip" else (f"{st}:calm", f"{st}:tense")
            check(f"preview '{st}': calm phrase first, the running mood is silent (no overlap)", keys == [calm], json.dumps(keys))
            if st == styles[1]:
                r = page.evaluate(f"{A}.setMood('battle')")
                check("setMood during a preview is deferred (no overlap)", r == "deferred" and page.evaluate(f"{A}.current()") is None, str(r))
            page.wait_for_timeout(4200)
            keys = players_on()
            check(f"preview '{st}': then a tense phrase", keys == [tense], json.dumps(keys))
            page.wait_for_timeout(4400)
            want = "battle" if st == styles[1] else "holy"
            keys = players_on()
            check(f"preview '{st}' stops itself after ~8 s and the previous mood resumes", (not page.evaluate(f"{A}.isPreviewing()")) and page.evaluate(f"{A}.current()") == want and keys == [want] and page.evaluate(f"{A}.getStyle()") == "chip", f"{keys}")
        page.evaluate(f"{A}.setMood('holy', {{force: true}})")
        page.wait_for_timeout(900)
        page.evaluate(f"{A}.previewStyle('no-such-style')")
        page.wait_for_timeout(900)
        check("previewStyle(unknown) previews chip", players_on() == ["calm"], json.dumps(players_on()))
        page.evaluate(f"{A}.stop({{fade: 200}})")
        page.wait_for_timeout(1500)
        check("stop() cancels a preview and nothing resumes", page.evaluate(f"!{A}.isPreviewing() && {A}.current() === null") and players_on() == [], json.dumps(players_on()))
        page.evaluate(f"{A}.mute(true)")
        page.wait_for_timeout(200)
        check("previewStyle while muted does nothing (false)", page.evaluate(f"{A}.previewStyle('dark') === false && !{A}.isPreviewing()"))
        page.evaluate(f"{A}.mute(false)")
        page.wait_for_timeout(200)
        # ---- track selection (SPEC §29b)
        info = page.evaluate(f"{A}.getMoods()")
        groups = {g["group"] for g in info}
        check("getMoods(): one entry per mood, human zh/en names, unique names", sorted(g["id"] for g in info) == sorted(moods) and all(g["zh"] and g["en"] for g in info)
              and len({g["zh"] for g in info}) == len(info) and len({g["en"] for g in info}) == len(info), json.dumps([g["id"] for g in info]))
        check("getMoods(): groups calm/tense/fight/end/faction, all used", groups == {"calm", "tense", "fight", "end", "faction"}, json.dumps(sorted(groups)))
        check("default track is auto; unknown id -> auto", page.evaluate(f"{A}.getTrack() === 'auto' && {A}.setTrack('no-such-mood') === 'auto' && {A}.getTrack() === 'auto' && {A}.setTrack(42) === 'auto'"))
        page.evaluate(f"{A}.setStyle('chip'); {A}.setMood('calm', {{force: true}})")
        page.wait_for_timeout(1900)
        check("auto: setMood plays the story mood", players_on() == ["calm"] and page.evaluate(f"{A}.getPlayingMood() === 'calm'"), json.dumps(players_on()))
        page.evaluate(f"window.__pm = []; window.__off = {A}.onChange(m => window.__pm.push(m)); true")      # (a trailing function value would be CALLED by evaluate)
        check("setTrack('battle') returns the id", page.evaluate(f"{A}.setTrack('battle') === 'battle' && {A}.getTrack() === 'battle'"))
        page.wait_for_timeout(300)
        n_mid = page.evaluate(f"Object.values({A}._players()).filter(p => p.active).length")
        check("setTrack crossfades (old and new both sounding at 0.3 s)", n_mid == 2 and players_on() == ["battle"], f"{n_mid} active, {players_on()}")
        page.wait_for_timeout(1700)
        check("fixed track: only the track sounds after the ~1.5 s crossfade", players_on() == ["battle"] and page.evaluate(f"{A}.current() === 'battle' && {A}.getPlayingMood() === 'battle'")
              and page.evaluate(f"Object.values({A}._players()).filter(p => p.active).length") == 1)
        check("onChange fired with the new mood", page.evaluate("window.__pm.includes('battle')"), page.evaluate("JSON.stringify(window.__pm)"))
        r = [page.evaluate(f"{A}.setMood('calm', {{force: true}})"), page.evaluate(f"{A}.setMood('death')"), page.evaluate(f"{A}.setMood('warp', {{force: true}})")]
        page.wait_for_timeout(500)
        check("fixed track survives setMood() (calm / death / warp ignored, story mood only remembered)",
              r == ["fixed", "fixed", "fixed"] and page.evaluate(f"{A}.current() === 'battle' && {A}.wanted() === 'warp' && {A}.getTrack() === 'battle'") and players_on() == ["battle"], f"{r} {players_on()}")
        for st in styles[1:]:
            page.evaluate(f"{A}.setStyle('{st}')")
            page.wait_for_timeout(1900)
            check(f"fixed track follows a style change ({st}) and keeps the track", players_on() == [f"{st}:battle"] and page.evaluate(f"{A}.getTrack() === 'battle' && {A}.getPlayingMood() === 'battle'"), json.dumps(players_on()))
            page.evaluate(f"{A}.setTrack('boss')")
            page.wait_for_timeout(1900)
            r = page.evaluate(f"{A}.setMood('calm', {{force: true}})")
            page.wait_for_timeout(300)
            check(f"style '{st}': fixed track 'boss' plays and survives setMood()", players_on() == [f"{st}:boss"] and r == "fixed", f"{players_on()} {r}")
            page.evaluate(f"{A}.setTrack('battle')")
            page.wait_for_timeout(1900)
        page.evaluate(f"{A}.setStyle('chip')")
        page.wait_for_timeout(1900)
        bad = []
        for m in moods:
            page.evaluate(f"{A}.setTrack('{m}')")
            page.wait_for_timeout(350)
            ok = page.evaluate(f"(() => {{ const p = {A}._players()['{m}']; return !!(p && p.active && p.stopAt == null && p.nextTime > {A}._ctx().currentTime); }})()")
            if not ok or page.evaluate(f"{A}.current() !== '{m}' || {A}.getTrack() !== '{m}'"): bad.append(m)
        check(f"every one of the {len(moods)} moods can be the fixed track", not bad, ("failed: " + ",".join(bad)) if bad else "")
        page.evaluate(f"{A}.setTrack('tau'); {A}.setMood('calm', {{force: true}})")
        page.wait_for_timeout(2000)
        page.evaluate(f"{A}.setMood('death', {{force: true}})")
        page.wait_for_timeout(300)
        check("fixed track also holds through an ending/death mood", page.evaluate(f"{A}.current() === 'tau'") and players_on() == ["tau"], json.dumps(players_on()))
        page.evaluate(f"{A}.setMood('calm', {{force: true}})")
        t0 = page.evaluate(f"{A}._ctx().currentTime")
        page.evaluate(f"{A}.setTrack('auto')")
        check("setTrack('auto') returns 'auto' and the remembered story mood is wanted", page.evaluate(f"{A}.getTrack() === 'auto' && {A}.wanted() === 'calm'"))
        page.wait_for_timeout(300)
        n_mid = page.evaluate(f"Object.values({A}._players()).filter(p => p.active).length")
        check("auto crossfades back to the remembered story mood (old + new at 0.3 s)", n_mid == 2 and players_on() == ["calm"], f"{n_mid} active, {players_on()}")
        page.wait_for_timeout(1700)
        check("auto: only the story mood after ~1.5 s", players_on() == ["calm"] and page.evaluate(f"{A}.current() === 'calm' && {A}.getPlayingMood() === 'calm'")
              and page.evaluate(f"Object.values({A}._players()).filter(p => p.active).length") == 1)
        r = page.evaluate(f"{A}.setMood('tense')")
        check("auto mode: hysteresis applies again (calm->tense deferred right after the restore)", r == "deferred" and page.evaluate(f"{A}.current()") == "calm", str(r))
        r = page.evaluate(f"{A}.setMood('battle')")
        check("auto mode: battle switches immediately", r is True and page.evaluate(f"{A}.current()") == "battle")
        page.evaluate(f"{A}.setTrack('orks')")
        page.wait_for_timeout(1900)
        page.evaluate(f"{A}.setTrack('definitely-not-a-mood')")
        page.wait_for_timeout(300)
        check("setTrack(unknown) falls back to auto and restores the story mood", page.evaluate(f"{A}.getTrack() === 'auto' && {A}.current() === 'battle'") and players_on() == ["battle"], json.dumps(players_on()))
        page.evaluate("window.__off()")
        page.evaluate(f"window.__pm = []; window.__off = null")
        page.wait_for_timeout(1900)
        # previewMood: ~8 s of one mood, running music silent meanwhile, resumes after; works in every style; muted / unknown = no-op
        page.evaluate(f"{A}.setTrack('holy'); {A}.setStyle('chip')")
        page.wait_for_timeout(2200)
        for st in styles:
            page.evaluate(f"{A}.setStyle('{st}')")
            page.wait_for_timeout(1900)
            started = page.evaluate(f"{A}.previewMood('orks')")
            check(f"previewMood('orks') in style '{st}' starts", started is True and page.evaluate(f"{A}.isPreviewing()"))
            page.wait_for_timeout(1100)
            want = "orks" if st == "chip" else f"{st}:orks"
            check(f"previewMood in '{st}': the mood plays from the top, the fixed track is silent (no overlap)", players_on() == [want] and page.evaluate(f"{A}.getPlayingMood() === 'orks'"), json.dumps(players_on()))
            if st == styles[0]:
                r = page.evaluate(f"{A}.setTrack('boss')")
                check("setTrack during a mood preview is deferred (no overlap)", r == "boss" and players_on() == [want], f"{r} {players_on()}")
                page.evaluate(f"{A}.setTrack('holy')")
            page.wait_for_timeout(8300)
            resumed = "holy" if st == "chip" else f"{st}:holy"
            check(f"previewMood in '{st}' stops itself after ~8 s and the fixed track resumes", (not page.evaluate(f"{A}.isPreviewing()")) and page.evaluate(f"{A}.current() === 'holy'") and players_on() == [resumed], f"{players_on()}")
        page.evaluate(f"{A}.setStyle('chip')")
        page.wait_for_timeout(1900)
        r = [page.evaluate(f"{A}.previewMood('nope')"), page.evaluate(f"{A}.previewMood('auto')"), page.evaluate(f"{A}.previewMood()")]
        check("previewMood(unknown / auto / none) does nothing (false)", r == [False, False, False] and not page.evaluate(f"{A}.isPreviewing()") and players_on() == ["holy"], f"{r} {players_on()}")
        page.evaluate(f"{A}.mute(true)")
        page.wait_for_timeout(200)
        check("previewMood while muted does nothing (false)", page.evaluate(f"{A}.previewMood('battle') === false && !{A}.isPreviewing()"))
        page.evaluate(f"{A}.mute(false)")
        page.wait_for_timeout(200)
        page.evaluate(f"{A}.previewMood('boss')")
        page.wait_for_timeout(1500)
        page.evaluate(f"{A}.stop({{fade: 200}})")
        page.wait_for_timeout(1500)
        check("stop() cancels a mood preview and nothing resumes", page.evaluate(f"!{A}.isPreviewing() && {A}.current() === null && {A}.getPlayingMood() === null") and players_on() == [], json.dumps(players_on()))
        page.evaluate(f"{A}.setMood('calm', {{force: true}})")
        page.wait_for_timeout(500)
        check("setMood after stop() wakes a fixed track again", page.evaluate(f"{A}.current() === 'holy'") and players_on() == ["holy"], json.dumps(players_on()))
        page.evaluate(f"{A}.setTrack('auto'); {A}.setMood('title', {{force: true}})")
        page.wait_for_timeout(1900)
        # a fixed track chosen before the first gesture starts on unlock (fresh page, no AudioContext yet)
        p2 = browser.new_page()
        p2.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
        p2.goto(URL); p2.wait_for_timeout(300)
        r = p2.evaluate(f"[{A}.setTrack('boss'), {A}.setMood('calm'), {A}._ctx() === null, {A}.getPlayingMood()]")
        check("before unlock: setTrack/setMood only record the wish", r == ["boss", True, True, None], json.dumps(r))
        p2.mouse.click(5, 5)
        p2.wait_for_timeout(500)
        r = p2.evaluate(f"[{A}.current(), {A}.getTrack(), {A}.wanted(), {A}.getPlayingMood()]")
        check("first click starts the fixed track (not the story mood)", r == ["boss", "boss", "calm", "boss"], json.dumps(r))
        p2.close()
        # the settings-panel flow: setStyle before the context exists only records the choice (checked in audio_check.js); here: style survives mood changes
        page.evaluate(f"{A}.setStyle('chip'); {A}.setMood('title', {{force: true}})")
        page.wait_for_timeout(600)
        # v0.2 / v0.3 scene → mood wiring plays the new moods
        for scene, fac, want in [("craftworld", "aeldari", "aeldari"), ("tomb_interior", "necrons", "necron"),
                                 ("ork_scrapyard", "orks", "orks"), ("gsc_chapel", "gsc", "gsc"), ("forge_floor", "mechanicus", "mechanicus")]:
            got = page.evaluate(f"(() => {{ const m = {A}.moodFor({{scene: '{scene}'}}, {{stats: {{sanity: 90}}}}, '{fac}'); {A}.setMood(m, {{force: true}}); return m; }})()")
            page.wait_for_timeout(500)
            st = page.evaluate(f"(() => {{ const p = {A}._players()['{want}']; return !!(p && p.active) && {A}.current() === '{want}'; }})()")
            check(f"moodFor({scene}) → {want} plays", got == want and st, str(got))
        check("consequence/scan SFX play after unlock", page.evaluate(f"{A}.sfx('consequence') === true && {A}.sfx('scan') === true"))
        # real-file override falls back to synth on a missing file
        page.evaluate(f"WH.audioFiles = {{holy: 'assets/audio/does_not_exist.ogg'}}; {A}.setMood('holy', {{force: true}})")
        page.wait_for_timeout(800)
        fb = page.evaluate(f"[{A}.current(), !!{A}._players().holy, !!({A}._players().holy && {A}._players().holy.active)]")
        check("missing audio file falls back to synth", fb == ["holy", True, True], json.dumps(fb))
        page.evaluate(f"WH.audioFiles = {{}}; {A}.stop({{fade: 200}})")
        page.wait_for_timeout(500)
        check("stop() clears the mood", page.evaluate(f"{A}.current() === null"))
        errs = [e for e in console_errors if "does_not_exist" not in e and "ERR_FILE_NOT_FOUND" not in e]
        check("no console errors", not errs, "; ".join(errs[:5]))

    all_styles = page.evaluate(f"{A}.getStyles().map(s => s.id)")
    render_styles = all_styles if STYLES_ARG == "all" else [x for x in STYLES_ARG.split(",") if x in all_styles]
    print(f"\nOffline renders → {OUT}  (sr {SR} Hz, music volume 1.0, styles: {','.join(render_styles)})")
    print("  mood       key                        bpm  loop(s) exp/actual   peak dBFS  RMS dBFS  clip  longest quiet  loop-sim  centroid  <200Hz  onsets/s")
    jobs = [(st, m) for st in render_styles for m in moods if not ONLY or m in ONLY]
    for style, m in jobs:
        tag = m if style == "chip" else f"{style}.{m}"
        info = page.evaluate(f"{A}.songInfo('{m}', '{style}')")
        exp_loop = info["introSec"] + info["loopSec"]
        secs = exp_loop * (1.25 if info["wobble"] else 1) + 6
        data, loops, _ = fetch(page, "mood", m, secs, style)
        write_wav(os.path.join(OUT, f"music_{tag.replace('.', '_')}.wav"), data)
        mono = data.mean(axis=1)
        peak = np.abs(data).max(); clip = int((np.abs(data) >= 0.999).sum())
        first = loops[0] if loops else None
        body = mono[int(SR * 0.5): int(SR * (first or exp_loop))]
        rms = db(np.sqrt(np.mean(body ** 2)))
        w = window_rms(body, int(SR * 0.1))
        quiet, run = 0, 0
        for v in w:
            run = run + 1 if v < 10 ** (-55 / 20) else 0; quiet = max(quiet, run)
        quiet_s = quiet * 0.1
        corr = float("nan")
        if loops:
            # same notes at the loop restart? cosine similarity of averaged magnitude spectra (4 s) of the song top
            # vs the top of loop 2 — robust to noise drums, reverb tails, slow pad attacks and the warp tempo wobble
            a0 = int(SR * (info["introSec"] + 0.06)); a1 = int(SR * loops[0]); L = int(SR * 4)
            if a1 + L <= len(mono):
                corr = spec_sim(mono[a0:a0 + L], mono[a1:a1 + L])
        actual = (loops[0] - 0.06) if loops else None
        cen, low, ons = centroid(body), low_share(body), onset_rate(body)
        print(f"  {tag:10s} {info['key'][:24]:24s} {info['bpm']:4d}  {exp_loop:7.1f} / {('%.1f' % actual) if actual else '  -  ':>6s}   {db(peak):8.1f}  {rms:8.1f}  {clip:4d}  {quiet_s:9.1f} s   {corr:8.2f}  {cen:6.0f} Hz  {low:5.1f}%  {ons:6.1f}")
        check(f"{tag}: peak <= -1 dBFS", db(peak) <= -1.0)
        check(f"{tag}: no clipped samples", clip == 0)
        lo_rms = -40 if m in ("death", "bad") else -32
        check(f"{tag}: RMS in range ({lo_rms}..-8 dBFS)", lo_rms < rms < -8, f"{rms:.1f}")
        allowed_quiet = 8.0 if m in ("death", "bad") else 1.0
        check(f"{tag}: no unintended silence (> {allowed_quiet} s)", quiet_s <= allowed_quiet, f"{quiet_s:.1f} s")
        check(f"{tag}: loop wraps", bool(loops))
        if actual and not info["wobble"]:
            check(f"{tag}: loop length matches data", abs(actual - exp_loop) < 0.05, f"{actual:.2f} vs {exp_loop:.2f}")
        elif actual:
            check(f"{tag}: wobbling loop within ±{info['wobble'][0]:.0%} of nominal", abs(actual / exp_loop - 1) <= info["wobble"][0], f"{actual:.2f} vs {exp_loop:.2f}")
        if corr == corr:
            check(f"{tag}: loop restart matches the top (spectral sim > 0.95)", corr > 0.95, f"{corr:.2f}")

    print("\nSFX renders")
    print("  sfx           peak dBFS  length(s)")
    for s in sfxs:
        data, _, _ = fetch(page, "sfx", s, 4.0)
        write_wav(os.path.join(OUT, f"sfx_{s}.wav"), data)
        env = np.abs(data).max(axis=1)
        above = np.where(env > 10 ** (-50 / 20))[0]
        length = (above[-1] / SR) if len(above) else 0
        print(f"  {s:12s}  {db(env.max()):8.1f}  {length:8.2f}")
        check(f"sfx {s}: audible and peak < -1 dBFS", -40 < db(env.max()) < -1, f"{db(env.max()):.1f}")
        limit = {"hover": 0.15, "type": 0.15, "click": 0.3, "save": 1.5, "consequence": 1.5, "scan": 1.5}.get(s, 3.5)
        check(f"sfx {s}: short (< {limit} s)", length < limit, f"{length:.2f}s")
    errs = [e for e in console_errors if "does_not_exist" not in e and "ERR_FILE_NOT_FOUND" not in e]
    check("no console errors during renders", not errs, "; ".join(errs[:5]))
    browser.close()

print(f"\n{'FAIL' if fails else 'OK'} — {len(fails)} failed checks")
sys.exit(1 if fails else 0)
