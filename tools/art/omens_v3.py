"""v0.3 omens (96x96, SPEC §26): Orks, Genestealer Cult, Adeptus Mechanicus.
Framed 'vision' pictures like omens.py — light, sky, objects; never a face or a figure.
The four-armed icon and the gear halo are original emblems (no wyrm-form, no skull-cog)."""
import math
import random
from reg import sprite
from pxlib import Canvas, Noise, bayer, hx, mix, clamp
from scenekit import *
from omens import frame

S = 96


def scrap_horizon(c, seed, base, col, lite=None, hmin=4, hmax=14):
    """jagged heaps of scrap, a few crude towers, poles and a crane against the sky."""
    rnd = random.Random(seed)
    col = C(col)
    n = Noise(seed)
    for x in range(c.w):
        h = int(hmin + (hmax - hmin) * n.fbm(x * 0.06, 1.3, 3) + rnd.randint(0, 2))
        c.rect(x, base - h, x, c.h - 1, col)
    for _ in range(5):                                          # tilted plates / girders
        x = rnd.randint(4, c.w - 8)
        y = base - rnd.randint(hmin, hmax)
        c.poly([(x, y), (x + rnd.randint(4, 9), y - rnd.randint(2, 6)), (x + rnd.randint(5, 10), y + 2), (x + 1, y + 3)], col)
    for _ in range(3):                                          # crude towers with platforms
        x = rnd.randint(6, c.w - 10)
        h = rnd.randint(hmax + 4, hmax + 14)
        c.rect(x, base - h, x + 2, base, col)
        c.rect(x - 3, base - h, x + 5, base - h + 1, col)
        for k in range(-3, 6, 2):
            c.set(x + k, base - h - 1, col)
        c.line([(x + 1, base - h), (x + 4, base - h - 5)], col)
    if lite:
        for x in range(c.w):
            for y in range(c.h):
                if c.get(x, y) == col and y > 0 and c.get(x, y - 1) != col and bayer(x, y) < 0.5:
                    c.set(x, y, lite)
                    break


def crude_banner(c, x, base, h, pole, cloth, mark):
    c.line([(x, base), (x, base - h)], pole)
    c.poly([(x + 1, base - h), (x + 10, base - h + 1), (x + 8, base - h + 4), (x + 11, base - h + 8), (x + 1, base - h + 7)], cloth)
    for k in range(3):                                          # crude jagged slash, not any real glyph
        c.set(x + 3 + k * 2, base - h + 2 + k, mark)
        c.set(x + 4 + k * 2, base - h + 2 + k, mark)


# ------------------------------------------------------------------ Orks
@sprite("omen_waaagh", 96, "大机灵（异象）", "The Waaagh! (omen)", "omen")
def omen_waaagh(flip=False):
    c = Canvas(S, S)
    sky(c, ["#040a04", "#0a1a08", "#14300c", "#1e4410", "#2a5a14"], 0, 78)
    # the storm: a vast green vortex churning above the horizon
    n = Noise(31)
    cx, cy = 48, 26
    for y in range(0, 70):
        for x in range(S):
            dx, dy = (x - cx) / 46, (y - cy) / 26
            d = math.sqrt(dx * dx + dy * dy)
            a = math.atan2(dy, dx)
            v = n.fbm((a * 3 + d * 6) * 0.9, d * 4, 4)
            sw = 0.5 + 0.5 * math.sin(a * 2 + d * 9 + v * 4)
            t = clamp((1.1 - d) * 0.9 + (sw - 0.5) * 0.7)
            if t > 0.25:
                c.set(x, y, ramp_pick(["#0e2408", "#1e4a10", "#3a7a1a", "#6ac22a", "#b4ff5a"], t * 0.95, x, y))
    glow(c, cx, cy, 14, ["#4aa020", "#9aff4a", "#e8ffc0"], power=1.6, strength=0.9, ry=9)
    # lightning forks from the eye down to the scrap
    for (x0, seed, x1) in [(42, 3, 20), (52, 7, 70), (48, 11, 46)]:
        pts = [(cx, cy)]
        rnd = random.Random(seed)
        for k in range(1, 9):
            pts.append((cx + (x1 - cx) * k / 8 + rnd.randint(-3, 3), cy + (74 - cy) * k / 8))
        c.line(pts, "#6ac22a", 2)
        c.line(pts, "#eaffd0")
    # scrap horizon, a crude banner, rust light along the edges
    scrap_horizon(c, 5, 80, "#0a0c06", lite="#3a4a1a")
    crude_banner(c, 70, 72, 16, "#0a0c06", "#0a0c06", "#0a0c06")
    crude_banner(c, 14, 70, 12, "#0a0c06", "#0a0c06", "#0a0c06")
    for (x, y) in [(20, 74), (46, 75), (70, 74)]:
        glow(c, x, y, 7, ["#1a2a0a", "#4a8a1a", "#c8ff8a"], power=1.6, strength=0.8, ry=3)
    ember(c, 4, 26, (4, 50, 92, 90), cols=("#9aff4a", "#c8ff8a", "#4aa020"))
    frame(c, "#020401")
    return c.image()


@sprite("omen_gork_mork", 96, "戈克与莫克（异象）", "Gork & Mork (omen)", "omen")
def omen_gork_mork(flip=False):
    c = Canvas(S, S)
    # dark storm sky; the two colossi are the only bright things in it
    sky(c, ["#040604", "#080e08", "#0e160c", "#141e10"], 0, 90)
    clouds(c, 61, ["#0e160c", "#141e10", "#1a2614"], 0, 90, scale=0.05, thresh=0.5, stretch=3)
    n = Noise(12)
    # two colossal green storm-shapes: one blunt, square-crowned and broad (brutal), one lean,
    # crooked and hook-crested (cunning). Cloud-stuff only — no face, no limbs.
    def blob(x, y, parts, seed):
        f = 0.0
        for (cx, cy, rx, ry) in parts:
            d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
            f += math.exp(-d)
        f += (n.fbm(x * 0.11 + seed, y * 0.11, 3) - 0.5) * 0.35
        return f > 0.36 and y < 86
    GORK = [(24, 68, 24, 18), (10, 52, 11, 10), (38, 52, 11, 10), (25, 40, 10, 9), (25, 30, 9, 8)]
    MORK = [(73, 68, 17, 20), (62, 52, 8, 9), (84, 50, 8, 11), (71, 38, 6, 9), (68, 26, 4, 7), (63, 17, 3, 5),
            (58, 13, 2.5, 3)]
    gmask = [[blob(x, y, GORK, 0) for x in range(S)] for y in range(S)]
    mmask = [[blob(x, y, MORK, 40) and not gmask[y][x] for x in range(S)] for y in range(S)]
    def gork(x, y):
        return 0 <= x < S and 0 <= y < S and gmask[y][x]
    def mork(x, y):
        return 0 <= x < S and 0 <= y < S and mmask[y][x]
    for y in range(S):
        for x in range(S):
            g, m = gork(x, y), mork(x, y)
            if not (g or m):
                continue
            v = n.fbm(x * 0.09 + (40 if m else 0), y * 0.07, 4)
            ox = 25 if g else 72
            lum = clamp(0.62 - (x - ox) / 50 - (y - 10) / 150 + (v - 0.5) * 0.9)
            pal = ["#14300a", "#24520e", "#3a7a18", "#5aa824", "#9ad84a"] if g else \
                  ["#103010", "#1e5418", "#2e7e24", "#4aac34", "#8ae05a"]
            c.set(x, y, ramp_pick(pal, lum, x, y))
    for y in range(1, S - 1):            # bright rim on the upper/left edges
        for x in range(1, S - 1):
            if (gork(x, y) or mork(x, y)) and not (gork(x, y - 1) or mork(x, y - 1) or gork(x - 1, y) or mork(x - 1, y)):
                c.set(x, y, "#d8ff8a")
    # a lightning bolt leaping between them
    pts = lightning(c, 9, 48, 34, 60, "#e8ffb0", jag=4)
    c.line([(p[0] + 1, p[1]) for p in pts], "#4aa020")
    glow(c, pts[-1][0], pts[-1][1], 6, ["#6ac22a", "#e8ffb0"], strength=0.7)
    # low dark cloud deck and a tiny scrap horizon for scale
    clouds(c, 44, ["#080e08", "#0e160c", "#141e10"], 72, 90, scale=0.08, thresh=0.4, stretch=3)
    hband(c, 84, 95, ["#0e160c", "#060a06"], seed=2)
    scrap_horizon(c, 9, 92, "#020402", hmin=2, hmax=6)
    frame(c, "#020401")
    return c.image()


# ------------------------------------------------------------------ Genestealer Cult
@sprite("omen_star_children", 96, "星之子（异象）", "The Star Children (omen)", "omen")
def omen_star_children(flip=False):
    c = Canvas(S, S)
    sky(c, ["#0a0414", "#180a2a", "#2a1240", "#3e1a54", "#5a2a6a"], 0, 78)
    stars(c, 41, 50, 0, 50, cols=("#6a4a8a", "#b89ad8", "#ffffff"))
    # sickly aurora bands
    n = Noise(8)
    for y in range(6, 40):
        for x in range(S):
            v = n.fbm(x * 0.04, y * 0.18, 3)
            if 0.52 < v < 0.6 and bayer(x, y) < 0.5:
                c.set(x, y, mix(c.get(x, y), C("#c86aff"), 0.45))
    # descending lights: long violet trails, bright heads
    rnd = random.Random(19)
    for k in range(16):
        x = rnd.randint(6, 90)
        y = rnd.randint(8, 62)
        L = rnd.randint(6, 18)
        for i in range(L):
            yy = y - i
            if bayer(x, yy) < 1 - i / L:
                c.set(x - i // 6, yy, "#8a4ac8" if i > 2 else "#e0b0ff")
        c.set(x, y, "#ffffff")
        c.set(x, y + 1, "#f0d0ff")
    glow(c, 60, 30, 9, ["#5a2a8a", "#c86aff", "#ffffff"], power=1.6, strength=1.0)
    for i in range(30):
        if bayer(60, 30 - i) < 1 - i / 30:
            c.set(60 - i // 8, 30 - i, "#e0b0ff")
    # mining town below: headframe, sheds, lit windows; the crowd's lamps raised (just lights)
    base = 82
    hband(c, base, 95, ["#0a0610", "#05030a"], seed=3)
    for (x, w, h) in [(4, 18, 8), (24, 12, 12), (60, 14, 9), (78, 16, 6)]:
        c.rect(x, base - h, x + w, base, "#0c0814")
        c.poly([(x - 1, base - h), (x + w + 1, base - h), (x + w // 2, base - h - 4)], "#0c0814")
    hx0 = 44
    c.line([(hx0 - 8, base), (hx0, base - 30), (hx0 + 8, base)], "#0c0814", 2)
    for y in range(base - 26, base, 5):
        c.line([(hx0 - 6 + (base - y) // 5, y), (hx0 + 6 - (base - y) // 5, y)], "#0c0814")
    c.ellipse(hx0, base - 30, 3, 3, "#0c0814")
    c.set(hx0, base - 30, "#5a3a7a")
    for (x, y) in [(8, 78), (13, 77), (28, 74), (64, 77), (70, 78), (84, 79)]:
        c.set(x, y, "#ffcf6a")
    rnd = random.Random(5)
    for _ in range(26):
        x, y = rnd.randint(4, 91), rnd.randint(84, 92)
        c.set(x, y, rnd.choice(["#ffe08a", "#ffcf6a", "#c8a050"]))
    frame(c, "#040208")
    return c.image()


@sprite("omen_four_armed", 96, "四臂帝皇圣像（异象）", "The Four-Armed Icon (omen)", "omen")
def omen_four_armed(flip=False):
    c = Canvas(S, S)
    # damp plaster wall of an underground chapel
    n = Noise(27)
    for y in range(S):
        for x in range(S):
            c.set(x, y, ramp_pick(["#140c14", "#22161e", "#2e2026"], n.fbm(x * 0.07, y * 0.07) * 1.1 - 0.05, x, y))
    glow(c, 48, 44, 46, ["#22161e", "#3a2420", "#5a3a24"], power=1.3, strength=0.8)
    # arched wooden icon panel with a gold border
    def in_panel(x, y, m=0):
        if 18 + m <= x <= 77 - m and 26 <= y <= 84 - m:
            return True
        return (x - 47.5) ** 2 / (29.5 - m) ** 2 + (y - 26) ** 2 / (18 - m) ** 2 <= 1 and y < 26
    for y in range(4, 88):
        for x in range(14, 82):
            if in_panel(x, y):
                if not in_panel(x, y, 3):
                    lum = clamp(0.8 - (x - 18) / 80 - (y - 8) / 160)
                    c.set(x, y, ramp_pick(["#5a3a10", "#a07a24", "#e0b84a", "#fff0a0"], lum, x, y))
                else:
                    c.set(x, y, ramp_pick(["#1e0a2a", "#341444", "#4a1e5a"], clamp(0.75 - math.hypot(x - 48, y - 40) / 50), x, y))
    # the emblem: halo ring, an elongated lozenge, two arms raised and two lowered (bilateral)
    cx, cy = 48, 44
    for a in range(0, 360, 2):
        t = math.radians(a)
        for r in (15, 16):
            c.set(round(cx + math.cos(t) * r), round(cy - 8 + math.sin(t) * r), "#e0b84a" if r == 15 else "#a07a24")
    for k in range(0, 360, 30):
        t = math.radians(k)
        c.line([(cx + math.cos(t) * 18, cy - 8 + math.sin(t) * 18), (cx + math.cos(t) * 22, cy - 8 + math.sin(t) * 22)], "#a07a24")
    c.poly([(cx, cy - 18), (cx + 5, cy), (cx, cy + 22), (cx - 5, cy)], "#e0b84a")
    c.poly([(cx, cy - 14), (cx + 3, cy), (cx, cy + 18), (cx - 3, cy)], "#fff0a0")
    c.line([(cx, cy - 12), (cx, cy + 16)], "#a07a24")
    for side in (-1, 1):
        for (sy, ey) in [(cy - 2, cy - 24), (cy + 6, cy + 26)]:
            p0, p1, p2 = (cx + side * 3, sy), (cx + side * 20, sy), (cx + side * 15, ey)
            pts = []
            for i in range(17):
                f = i / 16
                pts.append(((1 - f) ** 2 * p0[0] + 2 * (1 - f) * f * p1[0] + f * f * p2[0],
                            (1 - f) ** 2 * p0[1] + 2 * (1 - f) * f * p1[1] + f * f * p2[1]))
            c.line(pts, "#5a3a10", 5)
            c.line(pts, "#c8962a", 3)
            c.line([(x - side * 0.6, y - 0.8) for (x, y) in pts], "#fff0a0")
            hx_, hy_ = pts[-1]
            up = -1 if ey < sy else 1
            for dx in (-3, 0, 3):                                                                # three claws
                c.line([(hx_, hy_), (hx_ + dx, hy_ + up * 4)], "#fff0a0")
    glow(c, cx, cy - 2, 4, ["#c86aff", "#ffffff"], strength=0.9)
    # age: cracks and flaked paint
    rnd = random.Random(4)
    for _ in range(7):
        x, y = rnd.randint(22, 72), rnd.randint(12, 80)
        pts = [(x, y)]
        for k in range(4):
            x += rnd.randint(-3, 3); y += rnd.randint(1, 4)
            pts.append((x, y))
        c.line(pts, "#140818")
    # candles on the ledge below
    c.rect(10, 86, 85, 88, "#2a1a14")
    c.rect(10, 86, 85, 86, "#5a3a24")
    for x in (16, 24, 31, 64, 71, 79):
        h = 4 + (x * 7) % 4
        c.rect(x, 86 - h, x + 1, 85, "#d8c8a0")
        c.set(x, 85 - h, "#ffd060"); c.set(x + 1, 85 - h, "#fff4c0")
        glow(c, x, 83 - h, 5, ["#3a2414", "#8a5a24"], strength=0.6)
    frame(c, "#060306")
    return c.image()


# ------------------------------------------------------------------ Adeptus Mechanicus
@sprite("omen_mars", 96, "火星（异象）", "Mars (omen)", "omen")
def omen_mars(flip=False):
    c = Canvas(S, S)
    sky(c, ["#020104", "#06030a", "#0a0610"], 0, 95)
    stars(c, 52, 80, cols=("#5a4a5a", "#a89aa8", "#ffffff"))
    glow(c, 92, 6, 24, ["#1a0a08", "#4a1a10", "#8a3a1a"], power=1.4, strength=0.7)
    # the red planet, dusty, lit from the top-right, night side scattered with forge lights
    cx, cy, r = 46, 54, 30
    planet(c, cx, cy, r, ["#1a0604", "#4a120a", "#8a2a14", "#c04a22", "#e8804a"], light=(0.6, -0.5), seed=6, bands=0.5)
    rnd = random.Random(8)
    for _ in range(80):
        a = rnd.uniform(0, 2 * math.pi)
        d = math.sqrt(rnd.random()) * (r - 2)
        x, y = cx + math.cos(a) * d, cy + math.sin(a) * d
        if (x - cx) * 0.6 - (y - cy) * 0.5 < -4:            # night side
            c.set(x, y, rnd.choice(["#ffb040", "#ff8a2a", "#ffe08a"]))
    # orbital ring of forge-stations (behind the planet on top, in front below)
    def ring(front):
        for a in range(0, 720):
            t = a / 720 * 2 * math.pi
            x = cx + math.cos(t) * r * 1.55
            y = cy + math.sin(t) * r * 0.32 - 4
            is_front = math.sin(t) > 0
            if is_front != front:
                continue
            if not front and (x - cx) ** 2 + (y - cy) ** 2 < r * r:
                continue
            c.set(round(x), round(y), "#8a6a3a" if bayer(round(x), round(y)) < 0.6 else "#c8a050")
        for k in range(14):
            t = k / 14 * 2 * math.pi + 0.2
            if (math.sin(t) > 0) != front:
                continue
            x = cx + math.cos(t) * r * 1.55
            y = cy + math.sin(t) * r * 0.32 - 4
            if not front and (x - cx) ** 2 + (y - cy) ** 2 < r * r:
                continue
            c.rect(x - 2, y - 2, x + 2, y + 1, "#2a1a14")
            c.rect(x - 2, y - 2, x + 2, y - 2, "#c8a050")
            c.set(x, y, "#ff8a2a")
            c.set(x + 1, y, "#ffe08a")
    ring(False)
    ring(True)
    # a small moon and a supply ship's trail
    planet(c, 80, 20, 4, ["#2a1a14", "#5a3a2a", "#8a6a4a"], light=(0.6, -0.5))
    c.line([(10, 18), (26, 12)], "#5a3a2a")
    c.set(26, 12, "#ffd8a0")
    frame(c, "#040102")
    return c.image()


@sprite("omen_cawl", 96, "考尔的工坊（异象）", "Cawl's Workshop (omen)", "omen")
def omen_cawl(flip=False):
    c = Canvas(S, S)
    sky(c, ["#06080a", "#0a0e10", "#101416", "#14181a"], 0, 95)
    # deep hall: racks of machines receding, brass shelves of relics
    for (x0, x1) in [(4, 26), (70, 92)]:
        for y in range(20, 88, 8):
            c.rect(x0, y, x1, y + 1, "#2a2418")
            c.rect(x0, y, x1, y, "#6a5a30")
            rnd = random.Random(y + x0)
            for x in range(x0 + 1, x1, 4):
                h = rnd.randint(2, 6)
                c.rect(x, y - h, x + 2, y - 1, rnd.choice(["#1a1e20", "#22282a", "#2a2418"]))
                if rnd.random() < 0.4:
                    c.set(x + 1, y - h, rnd.choice(["#5aff7a", "#ffb040", "#5ab8ff"]))
    # the vast half-built device: a ring of archeotech glowing green-white, scaffold around it
    cx, cy = 48, 46
    glow(c, cx, cy, 34, ["#0e1a14", "#123a22", "#1e6a3a", "#4ac87a"], power=1.6, strength=0.85)
    for a in range(0, 360, 1):
        t = math.radians(a)
        for rr in (17, 18, 19, 20):
            x, y = cx + math.cos(t) * rr, cy + math.sin(t) * rr * 0.9
            col = "#c8a050" if rr in (17, 20) else ("#6a5a30" if (a // 15) % 2 else "#8a7040")
            c.set(round(x), round(y), col)
    for k in range(12):
        t = math.radians(k * 30)
        c.rect(cx + math.cos(t) * 21 - 1, cy + math.sin(t) * 19 - 1, cx + math.cos(t) * 21 + 1, cy + math.sin(t) * 19 + 1, "#2a2418")
    glow(c, cx, cy, 12, ["#4ac87a", "#b8ffd0", "#ffffff"], power=1.4, strength=1.0, ry=11)
    for x in (24, 72):
        c.rect(x, 22, x + 1, 88, "#1a1a16")
    for y in (26, 68):
        c.rect(24, y, 73, y, "#1a1a16")
    # many-jointed manipulator arms reaching in from the edges (machines, not people)
    for pts in ([(0, 34), (12, 30), (22, 38), (30, 40)], [(95, 60), (84, 56), (74, 60), (66, 54)],
                [(30, 95), (32, 80), (38, 70), (42, 62)]):
        c.line(pts, "#0a0c0c", 3)
        c.line(pts, "#3a3a34")
        for p in pts[1:-1]:
            c.ellipse(p[0], p[1], 2, 2, "#6a5a30")
        c.set(pts[-1][0], pts[-1][1], "#ffffff")
        glow(c, pts[-1][0], pts[-1][1], 4, ["#ffd06a", "#ffffff"], strength=0.8)
    ember(c, 12, 20, (30, 30, 66, 66), cols=("#ffd06a", "#ffffff", "#8affb0"))
    # heavy cable shadows slung across the foreground
    for (y0, sag, w) in [(4, 20, 4), (0, 30, 3), (10, 14, 2)]:
        pts = [(x, y0 + sag * math.sin(math.pi * x / 95)) for x in range(-2, 98, 4)]
        c.line(pts, "#020303", w)
    for (x, top, bot) in [(10, 0, 50), (86, 0, 40)]:
        pts = [(x + 3 * math.sin(y * 0.15), y) for y in range(top, bot, 3)]
        c.line(pts, "#020303", 3)
    hband(c, 88, 95, ["#0a0c0c", "#040506"], seed=4)
    frame(c, "#010202")
    return c.image()


@sprite("omen_omnissiah", 96, "万机之神（异象）", "The Omnissiah (omen)", "omen")
def omen_omnissiah(flip=False):
    c = Canvas(S, S)
    sky(c, ["#0a0402", "#140806", "#200c08"], 0, 95)
    # falling columns of binary light (dots and dashes), dim red
    rnd = random.Random(2)
    for x in range(3, 94, 4):
        y = rnd.randint(-20, 30)
        while y < 96:
            L = rnd.choice([1, 1, 3])
            for k in range(L):
                if 0 <= y + k < 96:
                    c.set(x, y + k, "#5a1a10" if rnd.random() < 0.7 else "#8a2a14")
            y += L + rnd.randint(2, 4)
    cx, cy = 48, 46
    glow(c, cx, cy, 52, ["#2a0e06", "#5a2a0a", "#8a5a14", "#c8962a"], power=1.3, strength=0.9)
    # light rays
    for a in range(0, 360, 15):
        t = math.radians(a + 7)
        for r in range(26, 62):
            x, y = cx + math.cos(t) * r, cy + math.sin(t) * r
            if bayer(int(x), int(y)) < (0.55 - r / 140):
                c.set(x, y, "#ffe08a")
    # the great golden gear: rim, square teeth, spokes, radiant hub
    R, Ri = 26, 18
    for y in range(cy - R - 5, cy + R + 6):
        for x in range(cx - R - 5, cx + R + 6):
            dx, dy = x - cx, y - cy
            d = math.hypot(dx, dy)
            a = (math.degrees(math.atan2(dy, dx)) + 360) % 360
            tooth = (a % 30) < 14 and R < d <= R + 5
            if Ri <= d <= R:
                lum = clamp(0.85 - (dx + dy) / 70 + (0.15 if d < Ri + 2 else 0))
                c.set(x, y, ramp_pick(["#5a3a0a", "#a0701a", "#e0b040", "#fff0a0"], lum, x, y))
            elif tooth:
                edge = d > R + 4 or (a % 30) < 1.5 or (a % 30) > 12.5
                c.set(x, y, "#3a2406" if edge else ("#e0b040" if dx + dy < 0 else "#a0701a"))
    for k in range(6):
        t = math.radians(k * 60 + 30)
        c.line([(cx + math.cos(t) * 6, cy + math.sin(t) * 6), (cx + math.cos(t) * Ri, cy + math.sin(t) * Ri)], "#a0701a", 3)
        c.line([(cx + math.cos(t) * 6, cy + math.sin(t) * 6), (cx + math.cos(t) * Ri, cy + math.sin(t) * Ri)], "#e0b040")
    glow(c, cx, cy, 10, ["#e0b040", "#fff0a0", "#ffffff"], power=1.2, strength=1.0)
    c.ellipse(cx, cy, 3, 3, "#ffffff")
    # thin halo ring floating above the gear
    for a in range(0, 360):
        t = math.radians(a)
        x, y = cx + math.cos(t) * 38, cy - 2 + math.sin(t) * 38
        c.set(round(x), round(y), "#fff0a0" if bayer(round(x), round(y)) < 0.7 else "#c8962a")
    frame(c, "#060200")
    return c.image()
