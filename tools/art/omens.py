"""Omens (96x96): stand-ins for named canon figures — light, fleets, sky, objects. Never a face or figure."""
import math
import random
from reg import sprite
from pxlib import Canvas, Noise, bayer, hx, mix, clamp
from scenekit import *

S = 96


def frame(c, col="#140c08", lite=None):
    """1px frame + clipped corners so omens read as framed visions."""
    col = C(col)
    for i in range(S):
        for (x, y) in ((i, 0), (i, S - 1), (0, i), (S - 1, i)):
            c.set(x, y, col)
    if lite:
        for i in range(1, S - 1):
            c.set(i, 1, mix(c.get(i, 1), C(lite), 0.5))
    for (x, y) in [(0, 0), (1, 0), (0, 1), (S - 1, 0), (S - 2, 0), (S - 1, 1), (0, S - 1), (1, S - 1), (0, S - 2),
                   (S - 1, S - 1), (S - 2, S - 1), (S - 1, S - 2)]:
        c.set(x, y, None)
    for (x, y) in [(1, 1), (S - 2, 1), (1, S - 2), (S - 2, S - 2)]:
        c.set(x, y, col)


@sprite("omen_emperor", 96, "帝皇（异象）", "The Emperor (omen)", "omen")
def omen_emperor(flip=False):
    c = Canvas(S, S)
    sky(c, ["#2a1a0a", "#4a2e10", "#6a4a18"], 0, 95)
    glow(c, 48, 36, 70, ["#5a3e14", "#8a6a24", "#c8a040", "#f0d070", "#fff4c0", "#ffffff"], power=1.3, strength=1.05, ry=60)
    for a in range(0, 360, 10):
        t = math.radians(a)
        for r in range(14, 80):
            x, y = 48 + math.cos(t) * r, 36 + math.sin(t) * r
            if bayer(int(x), int(y)) < (0.5 if a % 20 == 0 else 0.25):
                c.set(x, y, "#fff8d8")
    th = "#1a1008"
    c.poly([(36, 70), (36, 30), (40, 24), (40, 16), (43, 20), (45, 12), (48, 6), (51, 12), (53, 20), (56, 16),
            (56, 24), (60, 30), (60, 70)], th)
    for (x, h) in [(33, 28), (63, 28), (30, 36), (66, 36)]:
        c.poly([(x - 2, 70), (x + 2, 70), (x, 70 - h)], th)
    c.rect(26, 58, 36, 74, th); c.rect(60, 58, 70, 74, th)
    c.rect(24, 56, 38, 58, th); c.rect(58, 56, 72, 58, th)
    c.rect(32, 66, 64, 78, th)
    for k in range(5):
        c.rect(22 - k * 5, 78 + k * 3, 74 + k * 5, 80 + k * 3, th)
        c.rect(22 - k * 5, 78 + k * 3, 74 + k * 5, 78 + k * 3, "#8a6a24")
    # the glow pours through the throne (no figure — only light)
    glow(c, 48, 44, 9, ["#f0d070", "#fff4c0", "#ffffff"], power=1.2, strength=1.0, ry=16)
    frame(c, "#140c04")
    return c.image()


@sprite("omen_primarch", 96, "原体（异象）", "The Primarch (omen)", "omen")
def omen_primarch(flip=False):
    c = Canvas(S, S)
    sky(c, ["#0a1028", "#1a2a5a", "#3a5a8a", "#c8a060", "#ffe0a0"], 0, 80)
    stars(c, 7, 40, 0, 30, cols=("#a8b8e8", "#ffffff"))
    # planet limb with dawn
    for y in range(70, 96):
        for x in range(96):
            d = math.hypot(x - 48, y - 220)
            if d < 152:
                c.set(x, y, ramp_pick(["#0a1428", "#1a3a5a", "#3a6a8a"], (152 - d) / 30 * 0.3 + (96 - y) / 60, x, y))
            elif d < 154:
                c.set(x, y, "#fff0c0")
    glow(c, 70, 70, 30, ["#c8a060", "#ffe0a0", "#ffffff"], power=1.8, strength=1.0, ry=10)
    # fleet of blue-gold cathedral ships in formation, heading right
    pal = ("#0a1430", "#1e3468", "#2e5aa8", "#e8c060", "#ffe8a0", "#9ad6ff")
    for i, (x, y, L) in enumerate([(66, 20, 18), (60, 66, 16), (6, 64, 26), (8, 22, 30), (22, 44, 62)]):
        ship_cathedral(c, x, y, L, pal, seed=i)
    frame(c, "#0a0a1a")
    return c.image()


@sprite("omen_black_crusade", 96, "黑色远征（异象）", "Black Crusade (omen)", "omen")
def omen_black_crusade(flip=False):
    c = Canvas(S, S)
    sky(c, ["#0a0408", "#14060e", "#1e0810"], 0, 95)
    stars(c, 9, 50, cols=("#8a6a7a", "#d8b8c8"))
    # the red rift tearing the sky
    n = Noise(5)
    for y in range(0, 60):
        for x in range(96):
            ax = 30 + y * 0.6 + 6 * math.sin(y * 0.15)
            d = abs(x - ax) - (12 - abs(y - 26) * 0.4) - (n.fbm(x * 0.1, y * 0.1) - 0.5) * 8
            if d < 0:
                c.set(x, y, ramp_pick(["#5a0a1a", "#a01a2a", "#e0402a", "#ffb060"], clamp(-d / 10), x, y))
            elif d < 4:
                c.set(x, y, ramp_pick(["#1e0810", "#3a0a18"], 1 - d / 4, x, y))
    # burning planet below
    planet(c, 48, 118, 58, ["#0a0404", "#1e0a08", "#3a120a"], light=(-0.2, -0.9), seed=6)
    for i in range(140):
        rnd = random.Random(i)
        x = rnd.randint(0, 95)
        y0 = 118 - int(math.sqrt(max(0, 58 ** 2 - (x - 48) ** 2)))
        y = y0 + rnd.randint(1, 30)
        if y < 96 and (x - 48) ** 2 + (y - 118) ** 2 < 57 ** 2:
            c.set(x, y, rnd.choice(["#ff6a2a", "#ffb040", "#c8301a"]))
    for x in range(96):
        y = 118 - int(math.sqrt(max(0, 58 ** 2 - (x - 48) ** 2)))
        if 0 <= y < 96:
            c.set(x, y, "#ff8a3a"); c.set(x, y - 1, "#8a1a1a")
    # black fleet bearing down (left-facing, spiky)
    pal = ("#3a0a10", "#08050a", "#5a3a3e", "#ff3a2a")
    for i, (x, y, L) in enumerate([(70, 16, 16), (40, 58, 14), (94, 64, 22), (94, 38, 46)]):
        ship_thorn(c, x, y, L, pal, face=-1, seed=i)
    frame(c, "#0a0204")
    return c.image()


@sprite("omen_hivemind", 96, "虫巢意志（异象）", "The Hive Mind (omen)", "omen")
def omen_hivemind(flip=False):
    c = Canvas(S, S)
    sky(c, ["#0a0410", "#1e0a24", "#3a1240", "#5a2a4a"], 0, 95)
    n = Noise(21)
    for y in range(96):
        for x in range(96):
            v = n.fbm(x * 0.04, y * 0.05, 5)
            if v > 0.46:
                c.set(x, y, ramp_pick(["#160a1a", "#2e1236", "#4a1e4a", "#6a3a5a"], (v - 0.46) * 2.6, x, y))
    # vast shadow in the clouds: a living ship with trailing tendrils
    for y in range(4, 70):
        for x in range(96):
            d = ((x - 52) / 46) ** 2 + ((y - 26) / 18) ** 2 + (n.fbm(x * 0.08, y * 0.08) - 0.5) * 0.5
            if d < 1:
                c.set(x, y, ramp_pick(["#08040a", "#120814"], d, x, y))
    for k in range(9):
        x0 = 14 + k * 9
        pts = [(x0 + 3 * math.sin(i * 0.3 + k), 36 + i * 1.8) for i in range(10 + (k * 7) % 12)]
        c.line(pts, "#0e0610", 2 if k % 3 == 0 else 1)
    # faint bio-luminescent lights along its belly
    for k in range(10):
        x = 16 + k * 7
        c.set(x, 38 + (k % 3), "#c84a9a")
    glow(c, 52, 30, 10, ["#2a0a2a", "#5a1a4a"], strength=0.6)
    # spores falling
    rnd = random.Random(8)
    for _ in range(16):
        x, y = rnd.randint(4, 92), rnd.randint(46, 86)
        for i in range(rnd.randint(3, 8)):
            c.set(x - i // 2, y - i, "#7a3a5a" if i else "#e0a0c0")
    hband(c, 86, 95, ["#1a0a18", "#0a040a"], seed=3, rough=0.6)
    frame(c, "#08020a")
    return c.image()


@sprite("omen_purge", 96, "灭绝令（异象）", "The Purge (omen)", "omen")
def omen_purge(flip=False):
    c = Canvas(S, S)
    sky(c, ["#06080e", "#10162a", "#1a2440"], 0, 60)
    stars(c, 2, 40, 0, 40, cols=("#8a9ab8", "#e8f0ff"))
    # a silent ship in orbit
    rnd = random.Random(2)
    ship_gothic(c, 26, 8, 44, "#2a2e3a", "#a8b4c8", rnd, win="#c8e0ff")
    # world below: hive-city grid seen from above, darkened
    for y in range(58, 96):
        for x in range(96):
            t = (y - 58) / 38
            c.set(x, y, ramp_pick(["#1a1e28", "#262a34", "#30343e"], t, x, y))
    for y in range(60, 96, 5):
        for x in range(0, 96):
            if bayer(x, y) < 0.6:
                c.set(x, y, "#121620")
    for _ in range(40):
        x, y = rnd.randint(0, 95), rnd.randint(60, 95)
        c.set(x, y, "#ffcf6a")
    # silver lightning lances
    for i, (x, seed) in enumerate([(30, 1), (50, 2), (68, 3)]):
        y0 = 14 + i
        pts = lightning(c, seed, x, y0, 78, "#e8f0ff", jag=2, width=1)
        for (px_, py_) in pts:
            glow(c, px_, py_, 4, ["#4a6a9a", "#a8c8ff"], strength=0.6)
        c.line(pts, "#ffffff")
        glow(c, pts[-1][0], 80, 12, ["#4a6a9a", "#a8c8ff", "#ffffff"], power=1.6, strength=1.0, ry=6)
    frame(c, "#04060a")
    return c.image()


@sprite("omen_tau_fleet", 96, "钛帝国舰队（异象）", "T'au Fleet (omen)", "omen")
def omen_tau_fleet(flip=False):
    c = Canvas(S, S)
    sky(c, ["#2a3a6a", "#5a6a9a", "#c8a0a0", "#f0c890"], 0, 58)
    glow(c, 48, 58, 24, ["#f0c890", "#fff0d0"], power=1.6, strength=0.9, ry=8)
    # calm sea with reflections
    for y in range(58, 96):
        for x in range(96):
            t = (y - 58) / 38
            col = ramp_pick(["#c8a080", "#6a7a9a", "#3a4a6a", "#1e2a44"], t, x, y)
            c.set(x, y, col)
        if y % 3 == 0:
            for x in range(96):
                if (x + y * 7) % 11 < 6:
                    c.set(x, y, mix(c.get(x, y), hx("#f0d8b0"), 0.35 * (1 - (y - 58) / 38)))
    c.rect(0, 58, 95, 58, "#f0e0c0")
    # sleek ochre ships
    pal = ("#3a2a1a", "#8a6434", "#c69a52", "#f0d8a0", "#46d8c8")
    for (x, y, L) in [(60, 16, 22), (8, 14, 16), (70, 44, 14), (12, 34, 54)]:
        ship_lens(c, x, y, L, pal)
        for i in range(L):
            yy = 116 - y
            if 58 < yy < 96 and bayer(x + i, yy) < 0.35:
                c.set(x + i, yy, "#a88050")
    frame(c, "#141a2a")
    return c.image()


@sprite("omen_farsight", 96, "远见（异象）", "Farsight (omen)", "omen")
def omen_farsight(flip=False):
    c = Canvas(S, S)
    sky(c, ["#3a0a0a", "#7a1a12", "#b83a1a", "#e8702a"], 0, 70)
    glow(c, 56, 34, 30, ["#c83a1a", "#ff6a2a", "#ffb060"], power=1.4, strength=1.0)
    c.ellipse(56, 34, 13, 13, "#ff8a3a")
    c.ellipse(56, 34, 11, 11, "#ffb060")
    for y in range(36, 48, 3):
        c.line([(43, y), (69, y)], "#e8702a")   # heat bands across the sun
    # wind-blown dust
    clouds(c, 4, ["#8a2a1a", "#a8401e"], 40, 70, scale=0.06, thresh=0.6, stretch=6)
    # rock outcrop
    rock = ["#1a0806", "#2e120a", "#4a1e10", "#6a3018"]
    pts = [(10, 96), (20, 74), (34, 66), (48, 62), (62, 66), (76, 72), (88, 96)]
    c.poly(pts, rock[1])
    n = Noise(7)
    for y in range(60, 96):
        for x in range(96):
            if c.get(x, y) == C(rock[1]):
                v = n.fbm(x * 0.12, y * 0.12) + (48 - x) / 140 - (y - 62) / 100
                c.set(x, y, ramp_pick(rock, clamp(v), x, y))
    hband(c, 88, 95, ["#2a0e08", "#140604"], seed=2)
    # the lone sword, red-ochre blade plunged into the rock (no figure)
    blade_dark, blade, blade_lite = "#5a1a0e", "#b8582a", "#f0a060"
    c.poly([(46, 64), (50, 64), (50, 24), (48, 18), (46, 24)], blade)
    c.line([(46, 24), (46, 64)], blade_lite)
    c.line([(50, 24), (50, 64)], blade_dark)
    c.line([(48, 20), (48, 62)], blade_lite)
    c.rect(40, 22, 56, 24, "#2a1a14")     # crossguard
    c.rect(40, 22, 56, 22, "#8a6a4a")
    c.rect(47, 12, 49, 21, "#3a2418")     # grip
    c.ellipse(48, 10, 2, 2, "#c69a52")
    c.set(47, 9, "#ffe0a0")
    for (x, y) in [(44, 64), (52, 64), (43, 65), (53, 65)]:
        c.set(x, y, "#1a0806")
    frame(c, "#140404")
    return c.image()


# ------------------------------------------------------------------ v0.2 omens (SPEC §14)
def _wisp(c, seed, x, y0, y1, cols, amp=3.0, freq=0.18):
    """sinuous rising light trail (bottom y0 -> top y1), dithered fade toward the top."""
    rnd = random.Random(seed)
    ph = rnd.uniform(0, 6.28)
    for y in range(y0, y1, -1):
        t = (y0 - y) / max(1, y0 - y1)
        xx = x + math.sin(y * freq + ph) * amp * (0.4 + t)
        if bayer(int(xx), y) < 0.95 - t * 0.5:
            c.set(xx, y, ramp_pick(cols, 1 - t * 0.8, int(xx), y))
        if bayer(int(xx) + 1, y) < 0.5 - t * 0.4:
            c.set(xx + 1, y, cols[max(0, len(cols) - 3)])


@sprite("omen_farseer", 96, "先知（异象）", "The Farseer (omen)", "omen")
def omen_farseer(flip=False):
    c = Canvas(S, S)
    sky(c, ["#06081a", "#0e1430", "#18204a", "#22305a"], 0, 95)
    stars(c, 31, 70, cols=("#5a6a9a", "#a8c0e8", "#ffffff"))
    # threads of fate: faint branching lines spreading from the light
    rnd = random.Random(4)
    for k in range(9):
        a = math.radians(-160 + k * 40 + rnd.uniform(-8, 8))
        x, y = 48.0, 46.0
        for i in range(60):
            a += rnd.uniform(-0.08, 0.08)
            x += math.cos(a); y += math.sin(a) * 0.8
            if 0 <= x < 96 and 0 <= y < 96 and bayer(int(x), int(y)) < 0.5:
                c.set(x, y, "#3a5a8a" if i > 30 else "#5a8ab8")
    glow(c, 48, 46, 30, ["#14204a", "#22406a", "#3a7aa8", "#8ad8f0", "#e8ffff", "#ffffff"], power=1.5, strength=1.05)
    # rune stones on a tilted orbit; far ones dim and small, near ones large
    def stone(x, y, r, near):
        body = ["#4a4a3a", "#9a9078", "#d8ccaa", "#f4ecd4"] if near else ["#2a2a2e", "#5a5a5a", "#8a8678"]
        for yy in range(int(y - r - 1), int(y + r + 2)):
            for xx in range(int(x - r), int(x + r + 1)):
                d = ((xx - x) / r) ** 2 + ((yy - y) / (r * 1.25)) ** 2
                if d <= 1:
                    lum = clamp(0.95 - ((xx - x + r) / (2 * r)) * 0.6 - ((yy - y) / (2.5 * r)) * 0.5)
                    c.set(xx, yy, ramp_pick(body, lum, xx, yy))
                elif d <= 1.45:
                    c.set(xx, yy, "#10121e")
        g = "#8ff0f0" if near else "#3a8a9a"
        pts = [(0, -1), (0, 0), (0, 1), (-1, -1), (1, 0)] if r > 2.5 else [(0, 0), (0, -1)]
        for (dx, dy) in pts:
            c.set(x + dx, y + dy, g)
    n = 9
    order = []
    for k in range(n):
        a = k / n * 2 * math.pi + 0.3
        x = 48 + math.cos(a) * 36
        y = 46 + math.sin(a) * 13 - math.cos(a) * 6
        near = math.sin(a) > 0
        order.append((near, y, x, a))
    for i in range(720):
        a = i / 720 * 2 * math.pi
        x = 48 + math.cos(a) * 36
        y = 46 + math.sin(a) * 13 - math.cos(a) * 6
        if bayer(int(x), int(y)) < (0.55 if math.sin(a) > 0 else 0.25):
            c.set(x, y, "#5ab8d8" if math.sin(a) > 0 else "#2a4a7a")
    for near, y, x, a in sorted(order):
        stone(x, y, 3.2 + math.sin(a) * 1.3, near)
    frame(c, "#04060e")
    return c.image()


@sprite("omen_ynnead", 96, "恩灵（异象）", "Ynnead (omen)", "omen")
def omen_ynnead(flip=False):
    c = Canvas(S, S)
    sky(c, ["#04060a", "#0a1018", "#121c24", "#1a2a2e"], 0, 70)
    glow(c, 48, 22, 26, ["#1a2a30", "#3a5a5a", "#8ab8b0", "#d8f0e8", "#ffffff"], power=1.4, strength=1.0)
    # pale soul-lights rising from the fallen
    pal = ["#2a4a48", "#6a9a90", "#b8e8d8", "#f0fff8"]
    for i, x in enumerate([10, 18, 27, 36, 44, 52, 60, 69, 78, 86]):
        _wisp(c, i, x, 82, 24 + abs(48 - x) // 3, pal, amp=2.5 + (i % 3))
    # dark battlefield: broken helms and spent spirit-stones (silhouettes only)
    hband(c, 76, 95, ["#141a20", "#0c1014", "#06080a"], seed=5, rough=0.6)
    rnd = random.Random(12)
    for i, x in enumerate([10, 18, 27, 36, 44, 52, 60, 69, 78, 86]):
        y = 80 + rnd.randint(-2, 3)
        kind = i % 3
        if kind == 0:     # fallen smooth helm with a long crest
            c.ellipse(x, y, 3, 4, "#1e2a2e")
            c.ellipse(x, y, 2, 3, "#0a0e12")
            c.line([(x - 1, y - 4), (x - 6, y - 6)], "#1e2a2e")
            c.set(x + 1, y - 1, "#8ab8b0")
        elif kind == 1:   # broken blade
            c.line([(x - 4, y + 2), (x + 3, y - 5)], "#0e1418")
            c.set(x + 3, y - 5, "#5a7a7a")
        else:             # spirit stone, dimmed
            c.ellipse(x, y, 2, 2, "#2a0a12")
            c.set(x, y, "#c84a5a")
            c.set(x - 1, y - 1, "#ffd0d8")
        glow(c, x, y - 1, 5, ["#1a2a2a", "#3a6a64"], strength=0.6)
    frame(c, "#020406")
    return c.image()


@sprite("omen_khaine", 96, "凯恩（异象）", "Khaine (omen)", "omen")
def omen_khaine(flip=False):
    c = Canvas(S, S)
    # riveted iron chamber
    sky(c, ["#0e0808", "#1a0e0c", "#24120e"], 0, 95)
    for x in range(0, 96, 16):
        c.rect(x, 0, x, 95, "#080404")
        c.rect(x + 1, 0, x + 1, 95, "#3a2018")
        for y in range(6, 96, 12):
            c.set(x + 4, y, "#4a2a1e"); c.set(x + 12, y, "#4a2a1e")
    for y in (30, 62):
        c.rect(0, y, 95, y + 1, "#080404")
        c.rect(0, y + 2, 95, y + 2, "#3a2018")
    glow(c, 48, 50, 48, ["#1e0c0a", "#3a1410", "#5a1e12", "#7a2a14"], power=1.2, strength=0.9)
    # floor and the iron cage-brazier
    hband(c, 78, 95, ["#1a0a08", "#0e0606"], seed=2, rough=0.4)
    c.poly([(30, 80), (66, 80), (60, 88), (36, 88)], "#140a08")
    c.rect(28, 76, 68, 80, "#2a1410")
    c.rect(28, 76, 68, 76, "#6a3a24")
    # flames
    n = Noise(9)
    for y in range(18, 78):
        for x in range(24, 72):
            w = (78 - y) / 60
            d = abs(x - 48) / (24 * (1 - w * 0.8) + 1) + (n.fbm(x * 0.15, y * 0.12 + 3) - 0.5) * 0.9
            if d < 1 and y > 20:
                t = clamp(1 - d) * (1 - w * 0.7) * 0.75
                c.set(x, y, ramp_pick(["#4a0e08", "#8a2410", "#c84a18", "#ff8a2a"], t, x, y))
    # the burning heart: two lobes + point, molten, veined
    def inheart(x, y):
        dx, yy = x - 48, y - 44
        lob = min(((dx + 8) / 10) ** 2 + (yy / 9) ** 2, ((dx - 8) / 10) ** 2 + (yy / 9) ** 2)
        return lob <= 1 or ((y > 44) and abs(dx) < (72 - y) * 0.75 and y <= 72)
    for y in range(32, 76):
        for x in range(26, 70):
            if inheart(x, y):
                edge = not (inheart(x - 1, y) and inheart(x + 1, y) and inheart(x, y - 1) and inheart(x, y + 1))
                if edge:
                    c.set(x, y, "#1a0402")
                    continue
                lum = clamp(1.05 - (x - 30) / 42 - (y - 36) / 70)
                c.set(x, y, ramp_pick(["#5a0a06", "#a01c10", "#e0481a", "#ffb04a", "#fff0b0"], lum, x, y))
    for pts in ([(42, 40), (45, 50), (42, 60)], [(55, 41), (52, 52), (55, 62)], [(48, 50), (48, 66)], [(38, 44), (36, 50)]):
        c.line(pts, "#4a0a06")
    for (x0, x1, top) in [(50, 54, 28), (56, 59, 31)]:      # severed vessels on top
        c.rect(x0 - 1, top - 1, x1 + 1, 37, "#1a0402")
        c.rect(x0, top, x1, 37, "#a01c10")
        c.rect(x0, top, x0, 37, "#e0481a")
        c.rect(x0, top, x1, top, "#5a0a06")
    glow(c, 38, 40, 5, ["#ffd890", "#ffffff"], strength=0.9)
    # cage bars in front
    for x in (24, 32, 64, 72):
        c.line([(x, 76), (x + (48 - x) // 5, 22)], "#120806")
        c.set(x, 75, "#6a3a24")
    c.line([(29, 22), (67, 22)], "#120806")
    c.line([(29, 21), (67, 21)], "#4a2418")
    ember(c, 8, 40, (10, 4, 86, 40), cols=("#ffb040", "#ff6a2a", "#ffe08a"))
    frame(c, "#060202")
    return c.image()


@sprite("omen_silent_king", 96, "寂静之王（异象）", "The Silent King (omen)", "omen")
def omen_silent_king(flip=False):
    c = Canvas(S, S)
    sky(c, ["#020304", "#04070a", "#080d10", "#0a1214"], 0, 95)
    stars(c, 17, 24, 0, 40, cols=("#2a3a3a", "#5a7a78"))
    glow(c, 48, 36, 46, ["#05090a", "#0c1a1a", "#14302c", "#1e4a40", "#2a6a58"], power=1.2, strength=0.95, ry=44)
    body, edge, rim = "#05070a", "#3a5a58", "#6af0b0"
    # vast stepped throne back, angular, seen from below
    c.poly([(26, 70), (26, 26), (32, 14), (38, 10), (44, 4), (52, 4), (58, 10), (64, 14), (70, 26), (70, 70)], body)
    c.poly([(36, 66), (36, 30), (42, 22), (54, 22), (60, 30), (60, 66)], "#060809")       # empty seat recess
    for (a, b) in [((26, 26), (32, 14)), ((32, 14), (38, 10)), ((38, 10), (44, 4)), ((44, 4), (52, 4)),
                   ((52, 4), (58, 10)), ((58, 10), (64, 14)), ((64, 14), (70, 26))]:
        c.line([a, b], edge)
    c.line([(26, 26), (26, 70)], edge)
    c.line([(70, 26), (70, 70)], "#1e3030")
    # armrests
    for side in (-1, 1):
        x0 = 48 + side * 22
        c.poly([(x0 - 8, 58), (x0 + 8, 58), (x0 + 8, 72), (x0 - 8, 72)], body)
        c.line([(x0 - 8, 58), (x0 + 8, 58)], edge)
    # faint cold conduit lines (no figure, only the empty seat)
    for (x, y0, y1) in [(30, 30, 66), (66, 30, 66), (48, 8, 20)]:
        for y in range(y0, y1):
            if bayer(x, y) < 0.5:
                c.set(x, y, rim)
    c.line([(42, 22), (54, 22)], "#2a6a50")
    c.ellipse(48, 13, 2, 2, "#1e4a3a")
    c.set(48, 13, rim)
    # stair of wide dark steps
    for k in range(6):
        y = 72 + k * 4
        c.rect(18 - k * 5, y, 78 + k * 5, y + 3, ["#0a0e10", "#080b0c"][k % 2])
        c.rect(18 - k * 5, y, 78 + k * 5, y, "#1a2628")
    # cold dust motes
    rnd = random.Random(3)
    for _ in range(18):
        c.set(rnd.randint(4, 91), rnd.randint(4, 70), rnd.choice(["#2a4a44", "#3a6a5a"]))
    frame(c, "#010202")
    return c.image()


@sprite("omen_ctan", 96, "太空死神（异象）", "The C'tan (omen)", "omen")
def omen_ctan(flip=False):
    c = Canvas(S, S)
    sky(c, ["#020204", "#06040a", "#0a0610"], 0, 95)
    stars(c, 23, 60, cols=("#4a4a5a", "#8a8aa8", "#e8e0c0"))
    glow(c, 48, 48, 40, ["#0a0806", "#1e1408", "#3a2608", "#5a3a0a"], power=1.3, strength=0.9)
    # lattice prison: two nested wire cubes (tesseract) in necron green
    def cube(cx, cy, r, d, col):
        f = [(cx - r, cy - r), (cx + r, cy - r), (cx + r, cy + r), (cx - r, cy + r)]
        b = [(x + d, y - d) for (x, y) in f]
        for q in (f, b):
            c.line(q + [q[0]], col)
        for p, q in zip(f, b):
            c.line([p, q], col)
        return f, b
    of, ob = cube(42, 54, 26, 10, "#2a8a4a")
    inf, inb = cube(45, 51, 12, 5, "#4fd16b")
    for p, q in zip(of, inf):
        c.line([p, q], "#1e5a32")
    for p, q in zip(ob, inb):
        c.line([p, q], "#1e5a32")
    # the star-shard: jagged dark-gold crystal, burning core
    cx, cy = 47, 50
    pts = []
    rnd = random.Random(6)
    for k in range(14):
        a = k / 14 * 2 * math.pi
        r = (13 if k % 2 == 0 else 5) + rnd.uniform(-2, 2)
        pts.append((cx + math.cos(a) * r, cy + math.sin(a) * r))
    c.poly(pts, "#5a3a0a")
    for y in range(cy - 14, cy + 15):
        for x in range(cx - 14, cx + 15):
            if c.get(x, y) == C("#5a3a0a"):
                lum = clamp(1 - math.hypot(x - cx, y - cy) / 13 + (cx - x) * 0.02)
                c.set(x, y, ramp_pick(["#2a1806", "#6a4410", "#b8862a", "#ffd870", "#fff8e0"], lum, x, y))
    # cracks of light leaking and arcs striking the lattice
    for i, (tx, ty) in enumerate([(16, 28), (78, 30), (70, 80), (22, 78)]):
        pts = [(cx, cy)]
        x, y = cx, cy
        for k in range(1, 7):
            x = cx + (tx - cx) * k / 6 + rnd.randint(-3, 3)
            y = cy + (ty - cy) * k / 6 + rnd.randint(-3, 3)
            pts.append((x, y))
        c.line(pts, "#c8a040" if i % 2 else "#8affa0")
    frame(c, "#020102")
    return c.image()


@sprite("omen_stormlord", 96, "风暴领主（异象）", "The Stormlord (omen)", "omen")
def omen_stormlord(flip=False):
    c = Canvas(S, S)
    sky(c, ["#020604", "#06140c", "#0e2416", "#16301c"], 0, 70)
    clouds(c, 14, ["#0a1a10", "#14301c", "#1e4026"], 0, 40, scale=0.05, thresh=0.45)
    # city skyline under the storm
    skyline(c, 41, 78, "#0e1a14", 22, 10, 30, 3, 8, win_p=0.10, wincol=("#c8a050",))
    skyline(c, 42, 86, "#060c08", 18, 12, 40, 4, 10, win_p=0.12, wincol=("#ffcf6a", "#e89a3a"))
    # green lightning lances
    for i, (x, seed, y1) in enumerate([(22, 3, 70), (50, 8, 62), (74, 5, 74), (38, 11, 40)]):
        pts = lightning(c, seed, x, 4, y1, "#4fd16b", jag=3, width=1)
        for (px_, py_) in pts[::2]:
            glow(c, px_, py_, 4, ["#1a4a2a", "#3a9a54"], strength=0.55)
        c.line(pts, "#c8ffd0")
        if y1 > 60:
            glow(c, pts[-1][0], y1, 10, ["#2a7a40", "#8affa0", "#ffffff"], power=1.6, strength=1.0, ry=5)
    hband(c, 86, 95, ["#060a08", "#020403"], seed=8)
    frame(c, "#020403")
    return c.image()


@sprite("omen_collector", 96, "收藏家（异象）", "The Collector (omen)", "omen")
def omen_collector(flip=False):
    c = Canvas(S, S)
    sky(c, ["#040606", "#080c0c", "#0e1412"], 0, 95)
    vx, vy = 48, 42
    # gallery hall in one-point perspective: floor lines, ceiling ribs
    for y in range(vy, 96):
        t = (y - vy) / (95 - vy)
        for x in range(96):
            c.set(x, y, ramp_pick(["#0a0e0c", "#141c18", "#1e2a24"], t, x, y))
    for k in range(-6, 7):
        c.line([(vx, vy), (vx + k * 18, 95)], "#0a100c")
    for k in range(-5, 6):
        c.line([(vx, vy), (vx + k * 18, 0)], "#0c1210")
    # stasis alcoves receding on both sides, each a green field with a frozen scene
    scenes = ["soldier", "tree", "beast", "tank", "soldier", "spire"]
    for side in (-1, 1):
        for k, z in enumerate([1.25, 0.78, 0.50, 0.32, 0.2]):
            w, h = int(18 * z), int(30 * z)
            x0 = int(vx + side * (5 + 28 * z)) - (w if side < 0 else 0)
            y1 = int(vy + 26 * z)
            y0 = y1 - h
            c.rect(x0 - 1, y0 - 1, x0 + w + 1, y1 + 2, "#1a2420")
            for y in range(y0, y1 + 1):
                for x in range(x0, x0 + w + 1):
                    c.set(x, y, ramp_pick(["#0e2a18", "#1a5a30", "#2a8a46"], 0.3 + 0.5 * (y - y0) / max(1, h), x, y))
            s = scenes[(k + (side > 0) * 2) % len(scenes)]
            mx, base = x0 + w // 2, y1 - 1
            sil = "#062010"
            if s == "soldier":
                c.rect(mx - 1, base - int(14 * z), mx + 1, base, sil)
                c.ellipse(mx, base - int(16 * z), max(1, int(2 * z)), max(1, int(2 * z)), sil)
                c.line([(mx + 1, base - int(10 * z)), (mx + int(6 * z), base - int(14 * z))], sil)
            elif s == "tree":
                c.line([(mx, base), (mx, base - int(12 * z))], sil)
                c.ellipse(mx, base - int(16 * z), max(1, int(6 * z)), max(1, int(5 * z)), sil)
            elif s == "beast":
                c.ellipse(mx, base - int(5 * z), max(1, int(7 * z)), max(1, int(4 * z)), sil)
                c.poly([(mx + int(5 * z), base - int(6 * z)), (mx + int(9 * z), base - int(12 * z)),
                        (mx + int(8 * z), base - int(4 * z))], sil)
            elif s == "tank":
                c.rect(mx - int(8 * z), base - int(6 * z), mx + int(8 * z), base, sil)
                c.rect(mx - int(3 * z), base - int(10 * z), mx + int(4 * z), base - int(6 * z), sil)
                c.line([(mx + int(4 * z), base - int(8 * z)), (mx + int(10 * z), base - int(9 * z))], sil)
            else:
                c.poly([(mx - int(4 * z), base), (mx + int(4 * z), base), (mx, base - int(22 * z))], sil)
            for x in range(x0, x0 + w + 1):
                c.set(x, y0, "#8affa0")
            c.rect(x0 - 2, y1 + 2, x0 + w + 2, y1 + 3, "#2a3430")
    # the far centrepiece
    glow(c, vx, vy + 20, 30, ["#0e1a14", "#123a22"], strength=0.6, ry=10)
    glow(c, vx, vy - 4, 10, ["#0e2a18", "#2a8a46", "#8affa0"], strength=0.8, ry=8)
    c.rect(vx - 3, vy - 8, vx + 3, vy, "#1a5a30")
    c.rect(vx - 1, vy - 6, vx + 1, vy, "#062010")
    frame(c, "#020303")
    return c.image()
