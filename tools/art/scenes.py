"""20 backdrops, 192x108, opaque. Lower third kept calm for the dialogue box;
left/right middle kept low-contrast for the portraits."""
import math
import random
from reg import scene
from pxlib import Canvas, Noise, bayer, hx, mix, clamp
from scenekit import *


def corridor(c, vx, vy, bw, bh, wall, floor, ceil, back, rib=None, rib_k=3.2, rib_w=0.10,
             fog=0.0, x0=0, x1=None):
    """one-point perspective corridor. palettes dark->light. returns depth fn."""
    x1 = c.w - 1 if x1 is None else x1
    for y in range(c.h):
        for x in range(x0, x1 + 1):
            dx, dy = x - vx, y - vy
            sx, sy = abs(dx) / bw, abs(dy) / bh
            s = max(sx, sy)
            if s <= 1:
                c.set(x, y, ramp_pick(back, 0.5 + (bayer(x, y) - 0.5) * 0.1, x, y))
                continue
            z = 1 / s
            if sx >= sy:
                pal, t = wall, 0.25 + 0.75 * (1 - z) ** 0.8
            elif dy > 0:
                pal, t = floor, 0.2 + 0.7 * (1 - z)
            else:
                pal, t = ceil, 0.15 + 0.6 * (1 - z)
            t = t * (1 - fog) + fog * 0.5
            if rib is not None:
                ph = (math.log(s) * rib_k) % 1.0
                if ph < rib_w:
                    pal, t = rib, 0.8 - z * 0.5
            c.set(x, y, ramp_pick(pal, t, x, y))


# ------------------------------------------------------------------ title
@scene("title", "标题：巢都远景", "Title: Hive Vista")
def title():
    c = Canvas(192, 108)
    sky(c, ["#120a1a", "#2a1026", "#5a1a26", "#8a2a1e", "#c2502a", "#e88a3a"], 0, 70)
    # torn sky: dark ragged cloud masses with a burning rift
    n = Noise(11)
    for y in range(0, 70):
        for x in range(192):
            v = n.fbm(x * 0.022, y * 0.06, 5)
            rift = abs((y - 22) - 10 * math.sin(x * 0.035) - 6 * (n.value(x * 0.05, 3) - 0.5))
            if rift < 2.6 - (v - 0.5) * 3:
                c.set(x, y, ramp_pick(["#ff6a2a", "#ffb060", "#fff0c0"], 1 - rift / 3, x, y))
            elif v > 0.52:
                c.set(x, y, ramp_pick(["#1a0c18", "#2e1424", "#4a1a26", "#6a2420"], (v - 0.52) * 2.2 + (y / 140), x, y))
    stars(c, 3, 40, 0, 18, cols=("#a88aa8", "#e8d0d8"), mask=lambda x, y: c.get(x, y)[0] < 40)
    # far skyline (hazy)
    skyline(c, 21, 76, "#5a2a34", 40, 10, 34, 3, 7, win_p=0.05, wincol=("#c87a4a",))
    # mid skyline
    skyline(c, 22, 82, "#2e1620", 34, 14, 44, 4, 10, win_p=0.10, wincol=("#ffcf6a", "#e89a3a"))
    # the great hive spire, centre
    rnd = random.Random(5)
    spire(c, 88, 86, 16, 62, "#1a0e16", rnd, win=True, win_p=0.18)
    spire(c, 82, 86, 6, 40, "#1a0e16", rnd, win=True, win_p=0.15)
    spire(c, 106, 86, 6, 46, "#1a0e16", rnd, win=True, win_p=0.15)
    c.set(96, 4, "#ff3a2a")
    # near silhouettes
    skyline(c, 23, 96, "#0e080e", 22, 8, 26, 5, 14, win_p=0.06, wincol=("#ff9a3a",))
    # smog / ground
    hband(c, 86, 107, ["#2a1420", "#160a12", "#0a060a"], seed=4, rough=0.4)
    clouds(c, 31, ["#3a1a24", "#5a2a2a"], 74, 90, scale=0.06, thresh=0.6)
    vignette(c, "#08040a", 0.6)
    return c.image()


# ------------------------------------------------------------------ hive interiors
@scene("hive_hab", "巢都居住区", "Hive Hab-Block")
def hive_hab():
    c = Canvas(192, 108)
    # smog shaft between two cliff-faces of stacked hab-cells
    sky(c, ["#2a2622", "#4a4234", "#7a6a4a", "#a88a5a"], 0, 70)
    clouds(c, 9, ["#3a342c", "#5a4e3c"], 0, 60, scale=0.05, thresh=0.55)
    rnd = random.Random(7)
    # distant stacks in the haze
    skyline(c, 3, 80, "#4a4236", 26, 20, 60, 6, 14, win_p=0.12, wincol=("#c8a050",), tips=0.0)

    def facade(x0, x1, col, lite, dark, cell_w, cell_h, seed):
        r = random.Random(seed)
        c.rect(x0, 0, x1, 107, col)
        for y in range(2, 100, cell_h):
            c.rect(x0, y, x1, y, dark)                       # floor slabs
            c.rect(x0, y + 1, x1, y + 1, lite)
            for x in range(x0 + 2, x1 - cell_w + 1, cell_w):
                k = r.random()
                wx, wy = x + 1, y + 3
                if k < 0.45:
                    c.rect(wx, wy, wx + cell_w - 4, wy + cell_h - 6, r.choice(["#e8b04a", "#ffd88a", "#c8803a"]))
                    c.rect(wx, wy + cell_h - 7, wx + cell_w - 4, wy + cell_h - 6, "#8a5a2a")
                elif k < 0.8:
                    c.rect(wx, wy, wx + cell_w - 4, wy + cell_h - 6, dark)
                if r.random() < 0.25:                           # laundry / cables across
                    c.line([(x, y + cell_h - 2), (x + cell_w, y + cell_h - 1)], dark)
    facade(0, 54, "#3a342e", "#5a5046", "#1e1a18", 9, 11, 1)
    facade(138, 191, "#3a342e", "#5a5046", "#1e1a18", 9, 11, 2)
    # walkways bridging the shaft
    for y, col in [(30, "#2a2420"), (58, "#241e1a")]:
        c.rect(54, y, 138, y + 2, col)
        c.line([(54, y - 4), (138, y - 4)], col)
        for x in range(56, 138, 6):
            c.line([(x, y - 4), (x, y)], col)
    # pipes down the facades
    for x in (50, 142):
        c.rect(x, 0, x + 2, 107, "#2a2622")
        c.rect(x, 0, x, 107, "#5a5046")
    # haze in the middle
    for y in range(0, 108):
        for x in range(54, 138):
            c.set(x, y, mix(c.get(x, y), hx("#8a7450"), 0.22 + 0.2 * (1 - y / 108)))
    hband(c, 84, 107, ["#2a2420", "#1a1614", "#100e0c"], seed=2, rough=0.3)
    calm_lower(c, 78, "#16130f", 0.35)
    vignette(c, "#060504", 0.5)
    return c.image()


@scene("hive_spire", "巢都尖塔", "Hive Spire Heights")
def hive_spire():
    c = Canvas(192, 108)
    sky(c, ["#1a2a4a", "#3a4a6a", "#7a6a7a", "#c88a6a", "#e8b080"], 0, 75)
    stars(c, 41, 30, 0, 20, cols=("#c8d0e8", "#ffffff"))
    planet(c, 150, 22, 9, ["#3a3a5a", "#7a7a9a", "#c8c8d8"], seed=2)
    # smog sea below
    hband(c, 70, 107, ["#8a6a5a", "#6a4e48", "#3e2e32", "#2a1e24"], seed=8, rough=0.5)
    clouds(c, 12, ["#7a5a50", "#a88070", "#c89a80"], 64, 100, scale=0.05, thresh=0.5)
    rnd = random.Random(9)
    # spire tops piercing the smog
    for (x, w, h, col) in [(10, 8, 50, "#4a4252"), (34, 5, 34, "#5a5060"), (150, 6, 40, "#4a4252"), (172, 9, 58, "#3a3442")]:
        spire(c, x, 92, w, h, col, rnd, win=True, wincol=("#ffd88a", "#ffffff"), win_p=0.2)
    # noble's balcony: a gilded rail along the lower third
    c.rect(0, 88, 191, 107, "#2a2026")
    c.rect(0, 86, 191, 87, "#c8a050")
    for x in range(2, 192, 8):
        c.rect(x, 88, x + 1, 96, "#8a6a30")
    c.rect(0, 96, 191, 96, "#c8a050")
    hband(c, 97, 107, ["#2a2026", "#1a141a"], seed=1)
    # sky-bridge
    c.line([(0, 52), (60, 48)], "#3a3442", 2)
    for x in range(4, 58, 6):
        c.set(x, 50 - x // 15, "#ffd88a")
    vignette(c, "#0e0a14", 0.4)
    return c.image()


@scene("underhive", "下巢", "Underhive")
def underhive():
    c = Canvas(192, 108)
    sky(c, ["#06080a", "#0e1414", "#16201c", "#1e2e24"], 0, 107)
    rnd = random.Random(13)
    # collapsed strata: dark layered slabs and dangling pipes
    for y, col in [(6, "#141818"), (14, "#1a1e1c")]:
        c.poly([(0, 0), (192, 0), (192, y + 4), (140, y), (90, y + 6), (40, y + 1), (0, y + 5)], col)
    for _ in range(14):
        x = rnd.randint(0, 191)
        c.line([(x, 0), (x + rnd.randint(-3, 3), rnd.randint(10, 34))], "#20262a")
    # ruined hab-stacks in fog
    skyline(c, 51, 78, "#1e2a26", 22, 14, 46, 6, 14, win_p=0.05, wincol=("#7aff6a", "#c8a040"), tips=0.1)
    skyline(c, 52, 86, "#121a16", 16, 10, 34, 8, 18, win_p=0.04, wincol=("#c8a040",), tips=0.0)
    # toxic glow from a sump pool
    glow(c, 96, 84, 60, ["#16261a", "#1e3a20", "#2a5a26", "#4a8a2a"], power=2.0, strength=0.8, ry=18)
    hband(c, 84, 107, ["#16201a", "#0e1410", "#080a08"], seed=6, rough=0.5)
    for x in range(60, 132):
        if bayer(x, 86) < 0.5:
            c.set(x, 86 + (x % 3 == 0), "#5aa83a")
    # drips + spores of light
    ember(c, 4, 40, (0, 20, 191, 80), cols=("#5aa83a", "#2a4a2a", "#8ad86a"))
    clouds(c, 14, ["#1a2620", "#24342a"], 40, 80, scale=0.06, thresh=0.6)
    calm_lower(c, 80, "#0c100c", 0.3)
    vignette(c, "#020402", 0.7)
    return c.image()


@scene("manufactorum", "工厂", "Manufactorum")
def manufactorum():
    c = Canvas(192, 108)
    sky(c, ["#1a0e0a", "#2e1610", "#4a2214", "#6a3418"], 0, 107)
    # furnace glow centre-back
    glow(c, 96, 60, 90, ["#4a2214", "#7a3414", "#b85a1e", "#f0a040", "#ffe8a0"], power=2.2, strength=0.95, ry=46)
    rnd = random.Random(17)
    # colossal machinery silhouettes: pistons, gears, chimneys
    dark = "#140a08"
    for (x, w, h) in [(0, 30, 90), (30, 12, 70), (150, 14, 80), (164, 28, 96)]:
        c.rect(x, 108 - h, x + w, 107, dark)
    for (cx, cy, r) in [(28, 30, 18), (166, 40, 16), (60, 12, 10)]:
        c.ellipse(cx, cy, r, r, dark)
        for a in range(0, 360, 30):
            t = math.radians(a)
            c.rect(cx + math.cos(t) * (r + 1) - 1, cy + math.sin(t) * (r + 1) - 1,
                   cx + math.cos(t) * (r + 1) + 1, cy + math.sin(t) * (r + 1) + 1, dark)
        c.ellipse(cx, cy, r // 3, r // 3, "#3a1a10")
    # chains hanging
    for x in (70, 76, 118, 124):
        for y in range(0, 50, 3):
            c.set(x, y, "#2a1a14"); c.set(x, y + 1, "#4a2a1a")
    # walkway + molten channel
    c.rect(0, 74, 191, 76, "#2a1610")
    for x in range(0, 192, 6):
        c.line([(x, 74), (x, 70)], "#2a1610")
    c.line([(0, 70), (191, 70)], "#2a1610")
    hband(c, 77, 107, ["#2a1610", "#1a0e0a", "#0e0806"], seed=3, rough=0.3)
    for x in range(192):
        y = 90 + int(2 * math.sin(x * 0.12))
        c.set(x, y, "#ff8a2a" if bayer(x, y) < 0.7 else "#ffd06a")
        c.set(x, y + 1, "#b8401a")
    # hanging crucible pouring a molten stream
    c.poly([(84, 30), (110, 30), (106, 46), (88, 46)], dark)
    c.rect(82, 28, 112, 30, "#3a1a10")
    c.line([(86, 28), (97, 4), (108, 28)], dark)
    c.line([(97, 0), (97, 4)], dark)
    for y in range(38, 90):
        w = 1 if y < 60 else 2
        for x in range(108 - w + 1, 110 + w):
            c.set(x + (y - 38) // 18, y, "#ffd06a" if (x + y) % 3 else "#ff8a2a")
    c.rect(104, 36, 110, 38, "#ff8a2a")
    glow(c, 112, 90, 14, ["#7a3414", "#f0a040", "#ffe8a0"], strength=0.9, ry=5)
    # furnace mouth grille on the far left machine
    for y in range(52, 70, 3):
        c.rect(6, y, 24, y + 1, "#ff8a2a" if y % 2 else "#e05a1a")
    ember(c, 5, 50, (40, 20, 150, 70))
    calm_lower(c, 80, "#120a08", 0.3)
    vignette(c, "#060302", 0.55)
    return c.image()


@scene("cathedral", "大教堂", "Cathedral")
def cathedral():
    c = Canvas(192, 108)
    corridor(c, 96, 50, 26, 30, ["#1a1614", "#2a2420", "#3e342a", "#5a4a38"],
             ["#1a1410", "#2e241a", "#4a3a26"], ["#100c0e", "#1a1418", "#2a2024"],
             ["#141012", "#1e181a"], rib=["#2a221e", "#4a3e32", "#6a5a44"], rib_k=2.0, rib_w=0.16)
    # great stained-glass rose window at the back
    cx, cy = 96, 38
    for y in range(cy - 16, cy + 17):
        for x in range(cx - 16, cx + 17):
            d = math.hypot(x - cx, y - cy)
            if d <= 16:
                a = (math.degrees(math.atan2(y - cy, x - cx)) + 360) % 45
                if d > 15 or a < 3 or abs(d - 8) < 0.7:
                    c.set(x, y, "#2a2018")
                else:
                    pal = ["#c83a2a", "#e8a03a", "#3a6ac8", "#ffe8a0"]
                    c.set(x, y, pal[int((a / 11 + d / 5)) % 4])
    c.rect(cx - 10, cy + 16, cx + 10, cy + 40, "#2a2018")
    for i, col in enumerate(["#3a6ac8", "#e8a03a", "#c83a2a", "#3a6ac8"]):
        c.rect(cx - 9 + i * 5, cy + 18, cx - 6 + i * 5, cy + 38, col)
        c.rect(cx - 9 + i * 5, cy + 18, cx - 6 + i * 5, cy + 19, "#ffe8a0")
    # light shafts from the window, dithered
    for y in range(40, 100):
        for x in range(192):
            spread = (y - 40) * 0.55 + 10
            if abs(x - 96 - (y - 40) * 0.25) < spread and bayer(x, y) < 0.16:
                c.set(x, y, mix(c.get(x, y), hx("#ffe0a0"), 0.5))
    # altar + candles
    c.rect(80, 74, 112, 80, "#3a2a1a")
    c.rect(80, 74, 112, 74, "#c8a050")
    rnd = random.Random(3)
    for x in list(range(60, 78, 3)) + list(range(115, 134, 3)):
        h = rnd.randint(3, 7)
        c.rect(x, 80 - h, x, 79, "#e8dcc0")
        c.set(x, 79 - h, "#ffd060")
        glow(c, x, 78 - h, 4, ["#4a3a22", "#a8803a"], strength=0.6)
    calm_lower(c, 82, "#140e0c", 0.3)
    vignette(c, "#060404", 0.55)
    return c.image()


@scene("barracks", "兵营", "Barracks")
def barracks():
    c = Canvas(192, 108)
    corridor(c, 96, 46, 30, 16, ["#1e2018", "#2e3024", "#42402e", "#55543a"],
             ["#1a1a14", "#2a2a1e", "#3a3a28"], ["#121410", "#1c1e18", "#262820"],
             ["#16180f", "#202218"], rib=["#2a2c20", "#3e4030"], rib_k=2.4, rib_w=0.08)
    # rows of bunks on both sides
    for s in [1.3, 1.7, 2.3, 3.2]:
        for side in (-1, 1):
            x = 96 + side * 30 * s
            w = 9 * s
            xl, xr = sorted([x, x - side * w])
            for lvl in (0, 1):
                y = 46 + 16 * s * (0.2 - lvl * 0.5)
                c.rect(xl, y, xr, y + max(1, s), "#5a5a40")
                c.rect(xl, y - max(1, s * 0.6), xr, y - 1, "#6a6a4e")
            c.rect(xl, 46 - 10 * s, xl + max(1, s * 0.6), 46 + 8 * s, "#2a2a20")
    # lockers on the back wall
    for i in range(6):
        x = 70 + i * 9
        c.rect(x, 36, x + 7, 58, "#3a3c30")
        c.rect(x + 1, 38, x + 6, 39, "#22241c")
        c.set(x + 5, 47, "#a8a888")
    # single hanging lamp
    c.line([(96, 0), (96, 14)], "#1a1a14")
    glow(c, 96, 18, 40, ["#2a2a1e", "#4a4630", "#8a7e4a", "#e8d890"], power=2.4, strength=0.85, ry=30)
    c.rect(93, 14, 99, 16, "#3a3a2a")
    # overhead steam pipes
    for (y, col) in [(3, "#2a2c20"), (7, "#34362a")]:
        c.rect(0, y, 191, y + 2, col)
        c.rect(0, y, 191, y, "#55543a")
        for x in range(10, 192, 34):
            c.rect(x, y - 1, x + 2, y + 3, "#1a1a14")
    # lasguns racked + helmets on top of the lockers
    for i in range(6):
        x = 70 + i * 9
        c.ellipse(x + 3, 34, 3, 2, "#4a5030")
        c.rect(x, 35, x + 6, 35, "#2a2c1e")
    for x in range(64, 128, 4):
        if 70 <= x <= 122:
            continue
    for x in (62, 66, 126, 130):
        c.line([(x, 38), (x + 2, 58)], "#2a1e14")
        c.line([(x + 1, 44), (x + 2, 54)], "#3a3a40")
    # propaganda posters (plain shapes, no insignia)
    for (px_, py_, col) in [(36, 30, "#a8902a"), (172, 46, "#8a2a24")]:
        c.rect(px_, py_, px_ + 9, py_ + 13, "#c8bc98")
        c.rect(px_ + 1, py_ + 1, px_ + 8, py_ + 6, col)
        c.poly([(px_ + 2, py_ + 6), (px_ + 4, py_ + 2), (px_ + 6, py_ + 6)], "#2a2418")
        for yy in (py_ + 8, py_ + 10):
            c.line([(px_ + 2, yy), (px_ + 7, yy)], "#5a5040")
    # second, dimmer lamp deeper in the room + window slit of daylight at the back
    glow(c, 96, 40, 12, ["#2a2a1e", "#5a5236"], strength=0.6)
    c.rect(84, 30, 108, 31, "#a8a070")
    for y in range(32, 46):
        for x in range(84, 109):
            if bayer(x, y) < 0.18 * (1 - (y - 32) / 14):
                c.set(x, y, "#8a845a")
    # plain regimental banner (no insignia: just stripes)
    c.rect(150, 12, 166, 36, "#5a1a1a")
    c.rect(150, 18, 166, 20, "#c8a050")
    c.poly([(150, 36), (158, 32), (166, 36), (166, 40), (158, 36), (150, 40)], "#5a1a1a")
    calm_lower(c, 78, "#12130e", 0.35)
    vignette(c, "#040404", 0.6)
    return c.image()


@scene("trench", "战壕", "Trench Line")
def trench():
    c = Canvas(192, 108)
    sky(c, ["#3a3a3e", "#55524c", "#7a6a56", "#a8805a"], 0, 46)
    clouds(c, 21, ["#2e2e32", "#3e3c3e", "#4e4a48"], 0, 40, scale=0.04, thresh=0.5)
    glow(c, 132, 12, 14, ["#6a5a46", "#c8a060", "#fff0b0"], power=2.0, strength=0.9)
    c.set(132, 12, "#ffffff")
    # smoke columns on the horizon
    for (x, w) in [(40, 5), (160, 6)]:
        n = Noise(x)
        for y in range(6, 46):
            for dx in range(-w - y // 8, w + y // 8):
                if n.value((x + dx) * 0.2, y * 0.15) > 0.5:
                    c.set(x + dx + int(4 * math.sin(y * 0.1)), y, "#2a2828" if bayer(x + dx, y) < 0.6 else "#3a3634")
    # one-point perspective: the trench runs away from the viewer
    vx, vy = 96, 46
    mud = ["#1a140e", "#2a2018", "#3e3022", "#56442e"]
    for y in range(40, 108):
        for x in range(192):
            dy = y - vy
            if dy < 0:
                continue
            half_floor = 4 + dy * 0.9          # duckboard floor half-width
            wall_top = vy - 6 - dy * 0.25      # parapet edge (screen y) for walls
            dx = abs(x - vx)
            if dx <= half_floor:
                t = 0.3 + 0.5 * dy / 62
                c.set(x, y, ramp_pick(["#2a2018", "#3e3022", "#4a3a28"], t, x, y))
                if int(dy ** 1.25) % 5 == 0:
                    c.set(x, y, "#5a4630")
            else:
                t = 0.15 + 0.6 * (dx - half_floor) / 96 + Noise(3).value(x * 0.2, y * 0.2) * 0.3
                c.set(x, y, ramp_pick(mud, t, x, y))
    # trench walls rise above the horizon at the edges
    for x in range(192):
        dx = abs(x - vx)
        top = int(vy - (dx - 20) * 0.35) if dx > 20 else vy
        for y in range(max(0, top), vy + 2):
            c.set(x, y, ramp_pick(mud, 0.25 + dx / 300 + Noise(4).value(x * 0.2, y * 0.2) * 0.3, x, y))
        # sandbag lip
        if dx > 20:
            for k in range(3):
                yy = top - k - 1
                if (x + k * 3) % 8 < 7:
                    c.set(x, yy, "#7a6a48" if k == 2 else "#5a4a34")
    # revetment planks + stakes
    rnd = random.Random(2)
    for side in (-1, 1):
        for i in range(8):
            dx = 26 + i * 10 + i * i
            x = vx + side * dx
            top = int(vy - (dx - 20) * 0.35)
            c.line([(x, top), (x, top + 18 + i * 3)], "#2a1e14", max(1, i // 3))
    # barbed wire over the parapet
    for x in range(192):
        dx = abs(x - vx)
        if dx > 24:
            top = int(vy - (dx - 20) * 0.35) - 5
            if (x // 3) % 2 == 0 and bayer(x, top) < 0.8:
                c.set(x, top + int(1.5 * math.sin(x * 0.9)), "#1a1614")
    calm_lower(c, 78, "#1e1812", 0.3)
    vignette(c, "#0a0806", 0.5)
    return c.image()


@scene("ship_interior", "舰船内部", "Voidship Interior")
def ship_interior():
    c = Canvas(192, 108)
    corridor(c, 96, 50, 20, 16, ["#1a1218", "#2a1c22", "#3e2a2a", "#56403a"],
             ["#141012", "#22181a", "#32262a"], ["#0e0a0e", "#1a1218", "#26181e"],
             ["#06060c", "#0a0a14"], rib=["#2e2026", "#4e3a36", "#7a6450"], rib_k=3.0, rib_w=0.14)
    # viewport at the end: stars + a planet edge
    for y in range(36, 65):
        for x in range(78, 115):
            if ((x - 96) / 18) ** 2 + ((y - 50) / 14) ** 2 < 1:
                c.set(x, y, "#05050c")
    stars(c, 5, 30, 36, 64, mask=lambda x, y: ((x - 96) / 17) ** 2 + ((y - 50) / 13) ** 2 < 1)
    for y in range(52, 65):
        for x in range(78, 115):
            if ((x - 96) / 17) ** 2 + ((y - 50) / 13) ** 2 < 1 and ((x - 120) / 30) ** 2 + ((y - 80) / 26) ** 2 < 1:
                c.set(x, y, ramp_pick(["#1a3a5a", "#3a6a8a", "#8ab8c8"], 1 - (y - 52) / 14, x, y))
    # red alert lamps along the ribs
    for (x, y) in [(40, 26), (152, 26), (60, 34), (132, 34), (72, 39), (120, 39)]:
        glow(c, x, y, 7, ["#3a1418", "#8a2020", "#ff4a3a"], strength=0.9)
    # cables along the walls
    for k in range(3):
        c.line([(0, 70 + k * 3), (78, 58 + k)], "#2a2024")
        c.line([(191, 70 + k * 3), (114, 58 + k)], "#2a2024")
    # sagging cables slung between the ribs
    for (x0, x1, y0, sag) in [(0, 70, 8, 8), (20, 90, 4, 6), (122, 192, 6, 9), (100, 170, 10, 5)]:
        pts = [(x, y0 + sag * math.sin(math.pi * (x - x0) / (x1 - x0))) for x in range(x0, x1 + 1, 2)]
        c.line(pts, "#140c10")
    # plain livery banners on both walls (stripes only, no insignia)
    for (bx, col) in [(14, "#7a1a1e"), (164, "#1e2a5a")]:
        c.rect(bx, 16, bx + 13, 44, col)
        c.rect(bx, 16, bx + 13, 17, "#c8a050")
        c.rect(bx + 5, 18, bx + 8, 40, "#c8a050")
        c.poly([(bx, 44), (bx + 6, 49), (bx + 13, 44)], col)
        c.line([(bx - 2, 15), (bx + 15, 15)], "#5a4a3a")
    # amber lumen strips along the deck edges, receding
    for k in range(9):
        s_ = 1.15 ** (k * 2) * 1.05
        y = int(50 + 16 * s_ * 0.98)
        for side in (-1, 1):
            x = int(96 + side * 20 * s_ * 0.98)
            if 0 <= x < 192 and y < 108:
                c.rect(x - 1, y, x + 1, y, "#ffb040")
                glow(c, x, y, 3 + k // 2, ["#3a2414", "#8a5a2a"], strength=0.5)
    # steam venting from a wall pipe
    n = Noise(4)
    for y in range(20, 64):
        for x in range(140, 176):
            v = n.fbm(x * 0.12, y * 0.1)
            if v > 0.55 + (64 - y) / 120 and abs(x - 150 - (64 - y) * 0.3) < (64 - y) * 0.4 + 2:
                c.set(x, y, mix(c.get(x, y), hx("#b8a8a8"), 0.5))
    c.rect(146, 62, 154, 66, "#3a2a2a")
    # distant crew silhouettes by the viewport
    for (x, h) in [(88, 7), (101, 6)]:
        c.rect(x, 64 - h, x + 1, 64, "#08060a")
        c.rect(x - 1, 64 - h + 2, x + 2, 64 - 2, "#08060a")
        c.set(x, 64 - h - 1, "#08060a"); c.set(x + 1, 64 - h - 1, "#08060a")
    calm_lower(c, 78, "#120c10", 0.3)
    vignette(c, "#040204", 0.55)
    return c.image()


# ------------------------------------------------------------------ exteriors / space
@scene("warp", "亚空间", "The Warp")
def warp():
    c = Canvas(192, 108)
    n = Noise(66)
    pal = ["#10041a", "#3a0a4a", "#8a1a7a", "#e03a9a", "#3ae0c8", "#c8ff3a", "#fff0ff"]
    cx, cy = 96, 48
    for y in range(108):
        for x in range(192):
            dx, dy = (x - cx) / 1.4, y - cy
            r = math.hypot(dx, dy) + 0.01
            a = math.atan2(dy, dx)
            swirl = a + r * 0.06 + n.fbm(x * 0.03, y * 0.04, 3) * 2.2
            v = (math.sin(swirl * 3) * 0.5 + 0.5) * 0.6 + n.fbm(x * 0.05 + 7, y * 0.05, 4) * 0.5
            v *= clamp(1.25 - r / 120)
            c.set(x, y, ramp_pick(pal, clamp(v * 1.05), x, y))
    # the eye at the heart of the storm (impossible geometry, no figure)
    glow(c, cx, cy, 16, ["#3ae0c8", "#fff0ff"], power=1.5, strength=0.9, ry=7)
    c.ellipse(cx, cy, 3, 6, "#10041a")
    c.set(cx - 1, cy - 2, "#c8ff3a")
    # drifting shards
    rnd = random.Random(6)
    for _ in range(18):
        x, y = rnd.randint(0, 191), rnd.randint(0, 70)
        s = rnd.randint(2, 5)
        c.poly([(x, y), (x + s, y + s // 2), (x + s // 2, y + s * 2)], rnd.choice(["#c8ff3a", "#3ae0c8", "#ff7ae0"]))
    calm_lower(c, 76, "#1a0624", 0.4)
    return c.image()


@scene("void", "虚空", "The Void")
def void():
    c = Canvas(192, 108)
    sky(c, ["#020208", "#06061a", "#0a0a24"], 0, 107)
    n = Noise(31)
    for y in range(108):
        for x in range(192):
            v = n.fbm(x * 0.02, y * 0.035, 5)
            band = math.exp(-((y - 30 - x * 0.25) / 22) ** 2)
            t = (v - 0.4) * 2.2 * band
            if t > 0.05:
                c.set(x, y, ramp_pick(["#0a0a24", "#1e1240", "#4a1a5a", "#8a3a6a", "#e88a8a"], t, x, y))
    stars(c, 32, 220)
    planet(c, 156, 86, 44, ["#06101a", "#12304a", "#2a6a8a", "#7ab8c8"], light=(-0.8, -0.4), seed=4, bands=0.4)
    planet(c, 40, 22, 6, ["#2a2020", "#6a5a4a", "#c8b090"], seed=1)
    # distant gothic fleet
    pal = ("#06060c", "#1a1c26", "#3a3e4e", "#8a90a8", "#ffcf6a", "#9ad6ff")
    for i, (x, y, L) in enumerate([(78, 46, 10), (14, 70, 12), (56, 64, 16), (20, 54, 30)]):
        ship_cathedral(c, x, y, L, pal, seed=i)
    calm_lower(c, 82, "#04040c", 0.2)
    return c.image()


@scene("ruins", "废墟", "Ruins")
def ruins():
    c = Canvas(192, 108)
    sky(c, ["#4a4a52", "#6a6660", "#8a8070", "#a89a80"], 0, 70)
    clouds(c, 41, ["#3a3a40", "#4e4c50", "#5e5a58"], 0, 50, scale=0.035, thresh=0.5)
    # smoke columns
    for (x, w) in [(50, 6), (150, 9)]:
        n = Noise(x)
        for y in range(0, 60):
            ww = w + (60 - y) // 8
            for dx in range(-ww, ww):
                if n.value((x + dx) * 0.18, y * 0.12) > 0.5:
                    c.set(x + dx + int(6 * math.sin(y * 0.07)), y, "#2a2828" if bayer(x + dx, y) < 0.5 else "#3a3634")
    # far broken skyline
    rnd = random.Random(42)
    for x in range(0, 192, 6):
        h = rnd.randint(8, 30)
        top = 74 - h
        c.rect(x, top, x + rnd.randint(3, 7), 74, "#4a4648")
        for k in range(rnd.randint(0, 3)):
            c.set(x + rnd.randint(0, 4), top - k, "#4a4648")
    # broken gothic arches (mid layer)
    dark = "#262224"
    for ax in (8, 120):
        c.rect(ax, 30, ax + 6, 86, dark)
        c.rect(ax + 40, 44, ax + 46, 86, dark)
        for t in range(0, 91, 2):
            a = math.radians(180 + t)
            x = ax + 23 + math.cos(a) * 20
            y = 34 + math.sin(a) * 18
            c.rect(x - 2, y - 1, x + 2, y + 2, dark)
        c.poly([(ax + 30, 18), (ax + 44, 26), (ax + 46, 44), (ax + 40, 44)], "#1a1618")   # broken stub
        for wy in range(40, 80, 10):
            c.rect(ax + 2, wy, ax + 4, wy + 4, "#4a3a30")
    # rubble ground
    hband(c, 80, 107, ["#3a3434", "#2a2628", "#1a1818"], seed=9, rough=0.7)
    for _ in range(40):
        x, y = rnd.randint(0, 191), rnd.randint(80, 92)
        c.rect(x, y, x + rnd.randint(1, 4), y + rnd.randint(1, 2), rnd.choice(["#4a4446", "#1e1a1c", "#5a5250"]))
    ember(c, 3, 25, (0, 0, 191, 70), cols=("#8a8078", "#6a625c"))
    calm_lower(c, 84, "#1e1a1a", 0.3)
    vignette(c, "#0e0c0c", 0.45)
    return c.image()


@scene("jungle", "丛林死亡世界", "Deathworld Jungle")
def jungle():
    c = Canvas(192, 108)
    sky(c, ["#0e2a26", "#1a4a3a", "#3a7a4a", "#8ab85a"], 0, 80)
    glow(c, 110, 30, 46, ["#3a7a4a", "#8ab85a", "#e8f0a0"], power=2.0, strength=0.8)
    rnd = random.Random(77)
    layers = [("#2a5a44", "#3e7a52", 5, 3, 6, 0.50), ("#1a3e30", "#2a5a3e", 4, 6, 10, 0.47),
              ("#0e2820", "#18402c", 3, 10, 16, 0.44)]
    for li, (col, lite, n, wmin, wmax, th) in enumerate(layers):
        for _ in range(n):
            x = rnd.randint(-10, 191)
            w = rnd.randint(wmin, wmax)
            lean = rnd.uniform(-0.15, 0.15)
            for y in range(0, 108):
                xx = int(x + lean * y)
                c.rect(xx, y, xx + w, y, col)
                c.set(xx, y, lite)
        nz = Noise(li * 10 + 3)
        for y in range(0, 108):
            for x in range(192):
                v = nz.fbm(x * 0.05, y * 0.07, 4)
                band = 0.0 if y < 26 + li * 4 else (y - 26 - li * 4) / 30.0
                if v > th + band and y < 70:
                    c.set(x, y, ramp_pick([col, lite], (v - th) * 4, x, y))
    # huge fronds in the corners
    for (bx, by, fl) in [(0, 76, 1), (191, 72, -1)]:
        for i in range(7):
            a = math.radians(-70 + i * 20)
            ex, ey = bx + fl * math.cos(a) * 50, by + math.sin(a) * 34
            for k in range(0, 40):
                t = k / 40
                px_, py_ = bx + (ex - bx) * t, by + (ey - by) * t + math.sin(t * 3.14) * -4
                c.rect(px_, py_ - 1, px_, py_ + 1 + int(3 * math.sin(t * 3.14)), "#0a1e16")
                c.set(px_, py_ - 1, "#2a6a3a")
    # vines and glowing purple blooms
    for _ in range(12):
        x = rnd.randint(0, 191)
        L = rnd.randint(10, 40)
        for y in range(0, L):
            c.set(x + int(2 * math.sin(y * 0.3)), y, "#1a4a2a")
        c.set(x, L, "#e05ae0"); c.set(x + 1, L, "#ff9aff"); c.set(x, L + 1, "#a03aa0")
    clouds(c, 8, ["#3a6a5a", "#5a8a6a"], 50, 84, scale=0.06, thresh=0.62)
    hband(c, 84, 107, ["#14281e", "#0c1a14", "#06100c"], seed=4, rough=0.5)
    calm_lower(c, 80, "#0a1a12", 0.3)
    vignette(c, "#020806", 0.5)
    return c.image()


@scene("cult_shrine", "邪教神龛", "Cult Shrine")
def cult_shrine():
    c = Canvas(192, 108)
    sky(c, ["#160a12", "#24101a", "#341424", "#3e1a26"], 0, 107)
    # rough cave arch
    n = Noise(5)
    for y in range(108):
        for x in range(192):
            d = ((x - 96) / 80) ** 2 + ((y - 70) / 70) ** 2 + (n.fbm(x * 0.08, y * 0.08) - 0.5) * 0.5
            if d > 1:
                c.set(x, y, ramp_pick(["#0e080e", "#22121a", "#3a1e26", "#4e2a2e"], n.fbm(x * 0.1, y * 0.1) * 1.2 - 0.1, x, y))
    # painted original sigil on the back wall: eight-armed spiral wheel (not the canon star)
    cx, cy = 96, 40
    glow(c, cx, cy, 34, ["#2a0c14", "#4a1220", "#6a1a24"], strength=0.6)
    for k in range(8):
        a = math.radians(k * 45)
        pts = []
        for i in range(10):
            r = 3 + i * 1.6
            t = a + i * 0.12
            pts.append((cx + math.cos(t) * r, cy + math.sin(t) * r * 0.9))
        c.line(pts, "#d02a2a")
    c.ellipse(cx, cy, 3, 3, "#d02a2a")
    c.ellipse(cx, cy, 1, 1, "#f0d070")
    # draped red cloth & altar
    c.poly([(70, 64), (122, 64), (126, 82), (66, 82)], "#3a0e14")
    c.rect(70, 62, 122, 64, "#6a1a20")
    for x in range(72, 122, 6):
        c.line([(x, 64), (x + 1, 82)], "#2a080e")
    # candles everywhere
    rnd = random.Random(66)
    for _ in range(26):
        x = rnd.choice([rnd.randint(20, 64), rnd.randint(128, 172), rnd.randint(70, 122)])
        base = 82 if 66 < x < 126 else rnd.randint(70, 86)
        if 66 < x < 126:
            base = 62
        h = rnd.randint(2, 7)
        c.rect(x, base - h, x, base, "#c8b89a")
        c.set(x, base - h - 1, "#ffd060")
        glow(c, x, base - h - 2, 6, ["#3a1a14", "#8a3a1a"], strength=0.5)
    # purple warp-light seeping from the floor crack
    for x in range(40, 152):
        y = 92 + int(2 * math.sin(x * 0.2))
        if bayer(x, y) < 0.7:
            c.set(x, y, "#b03ae0")
    glow(c, 96, 94, 50, ["#1a0a1e", "#3a1240"], strength=0.5, ry=8)
    calm_lower(c, 84, "#0e060a", 0.3)
    vignette(c, "#030103", 0.6)
    return c.image()


@scene("daemon_world", "恶魔世界", "Daemon World")
def daemon_world():
    c = Canvas(192, 108)
    n = Noise(99)
    pal = ["#1a0a2a", "#4a0a4a", "#8a1a5a", "#3ac8a0", "#e8ff6a"]
    for y in range(108):
        for x in range(192):
            v = n.fbm(x * 0.025 + math.sin(y * 0.05) * 0.8, y * 0.03, 4)
            c.set(x, y, ramp_pick(pal, clamp(v * 1.2 - y / 220), x, y))
    # a green sun with a black core and spiral rays
    for a in range(0, 360, 20):
        t = math.radians(a)
        pts = [(150 + math.cos(t + r * 0.03) * r, 22 + math.sin(t + r * 0.03) * r) for r in range(8, 34, 2)]
        c.line(pts, "#c8ff3a")
    glow(c, 150, 22, 14, ["#3ac8a0", "#c8ff3a", "#ffffff"], strength=1.0)
    c.ellipse(150, 22, 4, 4, "#0a0010")
    # floating inverted rock islands
    rnd = random.Random(4)
    for (x, y, w) in [(30, 30, 22), (90, 18, 14), (60, 50, 10), (176, 56, 12)]:
        c.poly([(x - w, y), (x + w, y), (x + w // 3, y + w), (x, y + w + 6)], "#1a0a14")
        c.line([(x - w, y), (x + w, y)], "#8a3a6a")
        for _ in range(3):
            tx = rnd.randint(x - w + 2, x + w - 2)
            c.poly([(tx - 2, y), (tx + 2, y), (tx, y - rnd.randint(4, 10))], "#1a0a14")
    # fleshy spire towers with eyes
    for (x, h) in [(14, 60), (44, 44), (168, 52)]:
        c.poly([(x - 7, 92), (x + 7, 92), (x + 2, 92 - h), (x - 3, 92 - h + 4)], "#3a0a2a")
        for k in range(3):
            ey = 92 - h + 10 + k * 14
            c.ellipse(x, ey, 2, 1, "#e8ff6a")
            c.set(x, ey, "#0a0010")
    hband(c, 88, 107, ["#2a0a24", "#1a0618", "#0e030e"], seed=7, rough=0.6)
    for x in range(192):
        y = 88 + int(3 * math.sin(x * 0.09))
        c.set(x, y, "#8a1a5a")
    calm_lower(c, 84, "#14041a", 0.3)
    return c.image()


@scene("tau_city", "钛帝国城市", "T'au City")
def tau_city():
    c = Canvas(192, 108)
    sky(c, ["#5a8ab8", "#8ab0c8", "#c8d4c8", "#e8d8b0"], 0, 72)
    clouds(c, 51, ["#b8c8d0", "#e0e4e0"], 4, 40, scale=0.03, thresh=0.58, stretch=4)
    planet(c, 40, 18, 7, ["#8a9ab8", "#c8d0e0", "#f0f0f8"], seed=3)
    # far towers: smooth tapering, rounded tops, teal lights
    def tower(x, base, w, h, body, lite, shade_c):
        for y in range(base - h, base + 1):
            t = (y - (base - h)) / h
            half = w * (0.55 + 0.45 * math.sin(min(1, t * 1.6) * math.pi / 2))
            for xx in range(int(x - half), int(x + half) + 1):
                u = (xx - (x - half)) / max(1, 2 * half)
                c.set(xx, y, lite if u < 0.3 else (body if u < 0.72 else shade_c))
        c.ellipse(x, base - h, w * 0.6, w * 0.4, lite)
    for (x, w, h) in [(20, 6, 40), (64, 5, 30), (150, 7, 48), (176, 5, 34), (112, 4, 26)]:
        tower(x, 80, w, h, "#b8b0a0", "#d8d4c8", "#8a8a8a")
    for (x, w, h) in [(40, 9, 52), (130, 10, 60)]:
        tower(x, 84, w, h, "#c8a46a", "#e8cc90", "#8a6a44")
        for k in range(4):
            c.rect(x - 4, 84 - h + 10 + k * 10, x + 4, 84 - h + 10 + k * 10, "#3ac8b8")
    # big domes
    for (x, r) in [(92, 22), (168, 14), (8, 12)]:
        for y in range(86 - r, 87):
            for xx in range(x - r, x + r + 1):
                if ((xx - x) / r) ** 2 + ((y - 86) / (r * 0.8)) ** 2 <= 1:
                    u = (xx - x + r) / (2 * r)
                    c.set(xx, y, ramp_pick(["#8a8a84", "#c8c4b4", "#f0ece0"], 1 - u + (86 - y) / (r * 3), xx, y))
        c.rect(x - r, 84, x + r, 86, "#3ac8b8")
    # skimmer in flight
    c.poly([(150, 50), (164, 48), (170, 50), (164, 52)], "#e8cc90")
    c.set(149, 50, "#3ac8b8"); c.set(148, 50, "#3ac8b8")
    # clean plaza
    hband(c, 86, 107, ["#d8ccb0", "#b8aa8a", "#8a7e66"], seed=2)
    for x in range(0, 192, 16):
        c.line([(x, 86), (x - 10, 107)], "#c8bca0")
    calm_lower(c, 88, "#a89a7e", 0.25)
    return c.image()


@scene("tau_outpost", "钛帝国前哨", "T'au Outpost")
def tau_outpost():
    c = Canvas(192, 108)
    sky(c, ["#2a2a4a", "#6a4a5a", "#c86a4a", "#e8a05a", "#f0c87a"], 0, 70)
    glow(c, 140, 66, 26, ["#e8a05a", "#ffd88a", "#fff4d0"], power=1.8, strength=0.9)
    clouds(c, 61, ["#8a4a4a", "#b8604a"], 10, 50, scale=0.03, thresh=0.6, stretch=5)
    # dunes
    n = Noise(3)
    for layer, (base, cols) in enumerate([(70, ["#8a5a3a", "#a8704a"]), (78, ["#6a4428", "#9a6a3a", "#c8905a"]),
                                         (88, ["#4a3020", "#7a5230", "#a87a4a"])]):
        for x in range(192):
            top = base + int(6 * math.sin(x * 0.03 + layer) + 4 * n.value(x * 0.05, layer))
            for y in range(top, 108):
                t = 1 - (y - top) / 20 + (0.3 if (x * 0.03 + layer) % 6.28 < 3 else 0)
                c.set(x, y, ramp_pick(cols, clamp(t), x, y))
    # domed bunkers + comm mast
    for (x, r) in [(40, 12), (64, 8)]:
        for y in range(80 - r, 81):
            for xx in range(x - r, x + r + 1):
                if ((xx - x) / r) ** 2 + ((y - 80) / (r * 0.75)) ** 2 <= 1:
                    u = (xx - x + r) / (2 * r)
                    c.set(xx, y, ramp_pick(["#5a5048", "#a89a7a", "#e8d8b0"], 1 - u, xx, y))
        c.rect(x - 3, 78, x + 3, 79, "#2a2a30")
        c.rect(x - 2, 78, x + 2, 78, "#3ac8b8")
    c.line([(88, 80), (88, 40)], "#3a3a44")
    c.line([(82, 46), (94, 46)], "#3a3a44")
    c.line([(84, 52), (92, 52)], "#3a3a44")
    c.set(88, 39, "#3ac8b8")
    # drones on patrol
    for (x, y) in [(110, 40), (124, 46)]:
        c.ellipse(x, y, 3, 1, "#c8a46a")
        c.set(x, y - 1, "#5a6a7a")
        c.set(x, y + 2, "#3ac8b8")
    calm_lower(c, 86, "#4a3020", 0.25)
    return c.image()


@scene("spore_sky", "孢子天空", "Spore-Choked Sky")
def spore_sky():
    c = Canvas(192, 108)
    sky(c, ["#140a1a", "#2a1030", "#4a1a4a", "#6a3a4a", "#8a6a3a"], 0, 80)
    n = Noise(17)
    for y in range(0, 80):
        for x in range(192):
            v = n.fbm(x * 0.03, y * 0.05, 5)
            if v > 0.48:
                c.set(x, y, ramp_pick(["#1a0a1e", "#3a1a3a", "#5a2a4a", "#7a5a4a"], (v - 0.48) * 2.4, x, y))
    # vast shadow suggested in the clouds (hive-ship mass, no detail)
    for y in range(0, 30):
        for x in range(40, 160):
            d = ((x - 100) / 60) ** 2 + ((y - 2) / 22) ** 2
            if d < 1 and bayer(x, y) < 0.55 * (1 - d) + 0.2:
                c.set(x, y, "#0e0612")
    # falling spores with burning trails
    rnd = random.Random(12)
    for _ in range(14):
        x, y = rnd.randint(10, 185), rnd.randint(18, 64)
        L = rnd.randint(6, 16)
        for i in range(L):
            c.set(x - i // 2, y - i, "#c87a4a" if i < 3 else ("#8a4a4a" if bayer(x, y - i) < 0.6 else "#5a2a3a"))
        c.ellipse(x, y, 1, 1, "#e0b060")
        c.set(x, y, "#fff0b0")
    # spore motes
    ember(c, 14, 80, (0, 0, 191, 90), cols=("#8a5a8a", "#a88a5a", "#5a3a5a"))
    # dying landscape: twisted spires & bio-towers
    skyline(c, 71, 86, "#1a0e18", 14, 8, 30, 3, 8, win_p=0.04, wincol=("#ff9a3a",))
    for x in (30, 150):
        c.poly([(x - 6, 92), (x + 6, 92), (x + 2, 50), (x - 1, 46)], "#2a1430")
        c.ellipse(x, 50, 4, 3, "#2a1430")
        c.set(x, 49, "#c84a8a")
    hband(c, 86, 107, ["#2a1426", "#1a0a18", "#0e060e"], seed=8, rough=0.5)
    calm_lower(c, 84, "#140a14", 0.3)
    vignette(c, "#06020a", 0.5)
    return c.image()


@scene("burning_city", "燃烧的城市", "Burning City")
def burning_city():
    c = Canvas(192, 108)
    sky(c, ["#1a0a0a", "#3a1010", "#7a2412", "#c84a1a", "#f0902a"], 0, 84)
    # black smoke
    n = Noise(23)
    for y in range(0, 70):
        for x in range(192):
            v = n.fbm(x * 0.03 + y * 0.01, y * 0.045, 5)
            if v > 0.45:
                c.set(x, y, ramp_pick(["#0a0606", "#1a0e0c", "#2e1a14", "#4a2414"], (v - 0.45) * 1.8 + y / 200, x, y))
    # burning skylines
    skyline(c, 81, 84, "#2a1010", 30, 12, 46, 4, 10, win_p=0.25, wincol=("#ffb040", "#ff6a2a", "#ffe08a"))
    skyline(c, 82, 94, "#120606", 18, 10, 34, 6, 14, win_p=0.18, wincol=("#ff8a2a", "#ffd06a"), tips=0.4)
    # fires along the base
    for x in range(192):
        h = int(6 + 5 * Noise(5).value(x * 0.15, 0) + 3 * math.sin(x * 0.4))
        for y in range(94 - h, 95):
            t = (y - (94 - h)) / max(1, h)
            c.set(x, y, ramp_pick(["#ffe08a", "#ffb040", "#e8501a", "#7a1a0a"], 1 - t if bayer(x, y) > 0.3 else 1 - t * 0.7, x, y))
    ember(c, 9, 90, (0, 20, 191, 92))
    hband(c, 95, 107, ["#2a0e08", "#160604"], seed=4, rough=0.5)
    calm_lower(c, 90, "#1a0806", 0.25)
    vignette(c, "#060202", 0.5)
    return c.image()


@scene("throne_light", "王座之光", "The Throne's Light")
def throne_light():
    c = Canvas(192, 108)
    sky(c, ["#2a1a0a", "#4a2e10", "#7a5a20"], 0, 107)
    # blinding golden light
    glow(c, 96, 44, 120, ["#5a3e14", "#8a6a24", "#c8a040", "#f0d070", "#fff4c0", "#ffffff"], power=1.4, strength=1.0, ry=80)
    # light rays
    for a in range(-80, 81, 9):
        t = math.radians(a - 90)
        for r in range(16, 140):
            x = 96 + math.cos(t) * r
            y = 44 + math.sin(t) * r * 0.8
            if bayer(int(x), int(y)) < 0.35:
                c.set(x, y, "#fff4c0")
    # colossal columns receding on both sides
    for i, (x, w) in enumerate([(4, 16), (28, 11), (46, 8), (60, 5)]):
        col = mix(hx("#1a1008"), hx("#5a3e14"), i / 4)
        for side in (x, 191 - x - w):
            c.rect(side, 0, side + w, 107, col)
            c.rect(side - 1, 12 + i * 6, side + w + 1, 14 + i * 6, col)
            c.rect(side + 1, 0, side + 1, 107, mix(col, hx("#f0d070"), 0.25))
    # vast throne silhouette (no figure), cables trailing
    th = "#1a1008"
    # tall pinnacled back
    c.poly([(80, 70), (80, 26), (86, 18), (86, 8), (89, 14), (92, 4), (96, 0), (100, 4), (103, 14), (106, 8),
            (106, 18), (112, 26), (112, 70)], th)
    for (x, h) in [(76, 34), (116, 34), (72, 44), (120, 44)]:
        c.poly([(x - 3, 70), (x + 3, 70), (x, 70 - h)], th)
    # armrests + seat block + steps
    c.rect(68, 58, 80, 74, th)
    c.rect(112, 58, 124, 74, th)
    c.rect(66, 56, 82, 58, th)
    c.rect(110, 56, 126, 58, th)
    c.rect(74, 66, 118, 80, th)
    for k in range(4):
        c.rect(62 - k * 6, 80 + k * 3, 130 + k * 6, 82 + k * 3, th)
        c.rect(62 - k * 6, 80 + k * 3, 130 + k * 6, 80 + k * 3, "#5a3e14")
    for k in range(6):
        c.line([(70, 90 - k * 3), (20 - k * 6, 107)], th)
        c.line([(122, 90 - k * 3), (172 + k * 6, 107)], th)
    hband(c, 92, 107, ["#5a3e14", "#2a1a0a", "#140c04"], seed=3)
    calm_lower(c, 92, "#2a1a0a", 0.2)
    return c.image()
