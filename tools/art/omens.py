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
