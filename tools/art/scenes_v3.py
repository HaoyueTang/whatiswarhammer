"""v0.3 backdrops (SPEC §26), 192x108, opaque. Same rules as scenes.py: lower third calm for
the dialogue box, left/right middle low-contrast for the portraits."""
import math
import random
from reg import scene
from pxlib import Canvas, Noise, bayer, hx, mix, clamp
from scenekit import *
from scenes import corridor


def junk_heap(c, seed, x0, x1, base, hmax, cols, rough=0.6):
    """noisy scrap-heap silhouette, shaded light at the top-left; cols dark->light."""
    n = Noise(seed)
    for x in range(x0, x1 + 1):
        u = (x - x0) / max(1, x1 - x0)
        h = hmax * math.sin(math.pi * u) ** 0.8 * (0.7 + 0.6 * n.fbm(x * 0.08, 0.5, 3))
        top = int(base - h)
        for y in range(max(0, top), base + 1):
            t = clamp(0.75 - (y - top) / 18 - u * 0.3 + (n.fbm(x * 0.2, y * 0.2) - 0.5) * rough)
            c.set(x, y, ramp_pick(cols, t, x, y))


def plate_wall(c, x0, y0, x1, y1, cols, seed, rivet="#b8a080"):
    """rusty corrugated / bolted plates: vertical panels with seams and rivets."""
    rnd = random.Random(seed)
    x = x0
    while x <= x1:
        w = rnd.randint(6, 12)
        dy = rnd.randint(-2, 2)
        for xx in range(x, min(x1, x + w) + 1):
            for y in range(y0 + dy, y1 + 1):
                t = clamp(0.55 + (0.2 if (xx - x) < 2 else 0) - (y - y0) / (y1 - y0 + 1) * 0.4 + (rnd.random() - 0.5) * 0.25)
                c.set(xx, y, ramp_pick(cols, t, xx, y))
        c.rect(x, y0 + dy, x, y1, cols[0])
        for y in range(y0 + dy + 2, y1, 6):
            c.set(x + 2, y, rivet)
            c.set(x + w - 2, y, rivet)
        x += w + 1


def hazard_stripe(c, x0, y0, x1, y1, step=3):
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            c.set(x, y, "#d4b02a" if ((x + y) // step) % 2 else "#1e1a14")


def gear(c, cx, cy, r, col, teeth=12, hole=None, hole_col=None, tooth=3, hi=None, lo=None):
    """filled cog; hi/lo paint the top-left / bottom-right silhouette edges."""
    pts = set()
    for y in range(int(cy - r - tooth), int(cy + r + tooth) + 1):
        for x in range(int(cx - r - tooth), int(cx + r + tooth) + 1):
            d = math.hypot(x - cx, y - cy)
            a = (math.degrees(math.atan2(y - cy, x - cx)) + 360) % 360
            per = 360 / teeth
            if d <= r or (d <= r + tooth and (a % per) < per * 0.45):
                c.set(x, y, col)
                pts.add((x, y))
    for (x, y) in pts:
        if hi and ((x - 1, y) not in pts or (x, y - 1) not in pts):
            c.set(x, y, hi)
        elif lo and ((x + 1, y) not in pts or (x, y + 1) not in pts):
            c.set(x, y, lo)
    if hole:
        c.ellipse(cx, cy, hole, hole, hole_col)
    return pts


# ------------------------------------------------------------------ Orks
@scene("ork_scrapyard", "兽人废料场", "Ork Scrapyard")
def ork_scrapyard():
    c = Canvas(192, 108)
    sky(c, ["#2a140c", "#4a2410", "#7a3e16", "#a8622a", "#c8864a"], 0, 70)
    clouds(c, 9, ["#3a1e10", "#5a2e14", "#6a3a1a"], 0, 40, scale=0.05, thresh=0.52, stretch=4)
    glow(c, 150, 46, 30, ["#a8622a", "#d89a5a", "#f0c88a"], power=1.6, strength=0.8, ry=16)
    # smoke columns
    n = Noise(3)
    for (sx, w) in [(44, 7), (130, 5)]:
        for y in range(0, 60):
            for x in range(sx - w - 10, sx + w + 10):
                dx = x - (sx + math.sin(y * 0.12) * 4 + (60 - y) * 0.25)
                if abs(dx) < w + (60 - y) * 0.12 + (n.fbm(x * 0.1, y * 0.1) - 0.5) * 6:
                    c.set(x, y, ramp_pick(["#2a1a14", "#3a2a22", "#4a3a30"], n.fbm(x * 0.15, y * 0.1), x, y))
    # far heaps, near heaps
    junk_heap(c, 2, -10, 80, 72, 30, ["#2a160e", "#3a2014", "#4a2a18"], rough=0.3)
    junk_heap(c, 5, 60, 200, 72, 36, ["#2a160e", "#3a2014", "#4a2a18"], rough=0.3)
    rnd = random.Random(23)
    for _ in range(70):                                          # glints of scrap on the heaps
        x = rnd.randint(0, 191)
        y = rnd.randint(40, 72)
        if c.get(x, y)[0] < 80 and c.get(x, y - 2)[0] < 80:
            L = rnd.randint(1, 4)
            col = rnd.choice(["#7a4a22", "#8a5a2a", "#5a5048", "#a0602e"])
            if rnd.random() < 0.5:
                c.line([(x, y), (x + L, y - rnd.randint(0, 2))], col)
            else:
                c.set(x, y, col); c.set(x + 1, y, col); c.set(x, y + 1, "#1e100a")
    # crane with a hanging hook over the right heap
    c.rect(150, 26, 152, 74, "#1a0e08")
    for y in range(26, 74, 4):
        c.line([(150, y), (152, y + 4)], "#4a2a16")
    c.line([(151, 26), (112, 32)], "#1a0e08", 2)
    c.line([(151, 20), (112, 32)], "#2a160e")
    c.line([(151, 20), (151, 26)], "#1a0e08")
    c.line([(118, 31), (118, 48)], "#1a0e08")
    c.poly([(115, 48), (121, 48), (120, 53), (116, 52)], "#2a160e")
    hazard_stripe(c, 112, 31, 128, 32)
    # junk-built tower with a lookout platform and a crude banner
    c.rect(38, 30, 46, 74, "#1e100a")
    c.rect(34, 28, 50, 31, "#2a160e")
    for k in range(34, 51, 3):
        c.set(k, 27, "#1e100a")
    c.line([(48, 28), (48, 10)], "#1e100a")
    c.poly([(49, 10), (60, 12), (57, 15), (61, 19), (49, 18)], "#5a6a24")
    for k in range(3):
        c.set(52 + k * 2, 12 + k, "#d4b02a"); c.set(53 + k * 2, 12 + k, "#d4b02a")
    for y in (40, 52, 64):
        c.rect(39, y, 45, y + 1, "#4a2a16")
    c.rect(41, 44, 43, 46, "#8aff4a")
    glow(c, 42, 45, 7, ["#2a3a10", "#4a7a1a"], strength=0.5)
    # shacks of corrugated plate in the middle ground
    for (x0, x1, top) in [(60, 84, 60), (92, 110, 64)]:
        plate_wall(c, x0, top, x1, 76, ["#2a160e", "#5a2e16", "#8a4a22", "#b0703a"], seed=x0)
        c.poly([(x0 - 2, top), (x1 + 2, top - 4), (x1 + 2, top - 1), (x0 - 2, top + 2)], "#3a2014")
        c.rect(x0 + 6, top + 6, x0 + 10, top + 10, "#1a0e08")
        c.rect(x0 + 7, top + 7, x0 + 9, top + 9, "#e0a040")
    hazard_stripe(c, 60, 72, 84, 73)
    # ground: churned dirt with half-buried scrap, kept calm low down
    hband(c, 76, 107, ["#4a2a18", "#3a2014", "#2a160e"], seed=7, rough=0.4)
    rnd = random.Random(11)
    for _ in range(26):
        x, y = rnd.randint(0, 190), rnd.randint(78, 92)
        w = rnd.randint(2, 6)
        c.rect(x, y, x + w, y, rnd.choice(["#6a3a1a", "#8a5a2a", "#5a4a3a"]))
    for (x, y) in [(16, 80), (176, 82)]:                        # barrels
        c.rect(x, y - 8, x + 6, y, "#5a2a14")
        hazard_stripe(c, x, y - 6, x + 6, y - 5)
        c.rect(x, y - 8, x + 6, y - 8, "#8a4a22")
    ember(c, 4, 18, (20, 20, 180, 70), cols=("#ffb040", "#ff8a2a"))
    calm_lower(c, 80, "#2a160e", 0.3)
    vignette(c, "#120804", 0.5)
    return c.image()


@scene("ork_fort", "兽人堡垒", "Ork Fort")
def ork_fort():
    c = Canvas(192, 108)
    sky(c, ["#0e1408", "#1a240c", "#2e3a12", "#4a5018", "#6a6224"], 0, 72)
    clouds(c, 21, ["#1a200c", "#2a3010", "#3a4014"], 0, 36, scale=0.05, thresh=0.5, stretch=4)
    glow(c, 96, 58, 60, ["#4a5018", "#7a7a2a", "#a89a3a"], power=1.8, strength=0.6, ry=18)
    # rear smokestacks, smoke drifting right
    n = Noise(8)
    for (x, h) in [(70, 40), (122, 46)]:
        c.rect(x, 62 - h, x + 4, 62, "#140e08")
        c.rect(x - 1, 62 - h, x + 5, 62 - h + 1, "#3a2414")
        for y in range(0, 62 - h):
            for xx in range(x - 6, x + 30):
                dx = xx - (x + 2 + (62 - h - y) * 0.6)
                if abs(dx) < 2 + (62 - h - y) * 0.2 + (n.fbm(xx * 0.1, y * 0.15) - 0.5) * 5:
                    c.set(xx, y, ramp_pick(["#1a1a10", "#2a2a1a", "#3a3a24"], n.fbm(xx * 0.12, y * 0.1), xx, y))
    # the wall: bolted rusty plates, crenellated with spikes
    plate_wall(c, 0, 52, 191, 80, ["#1e100a", "#4a2614", "#7a4220", "#a0602e"], seed=4, rivet="#c8a070")
    for x in range(0, 192, 6):
        c.poly([(x, 52), (x + 4, 52), (x + 2, 44 - (x * 7) % 5)], "#2a1a10")
        c.set(x + 2, 45 - (x * 7) % 5, "#8a6a4a")
    # two watchtowers with platforms and crude banners
    for (tx, h, flag) in [(30, 44, "#2a2a2a"), (156, 50, "#2a2a2a")]:
        c.rect(tx, 80 - h, tx + 14, 80, "#24140c")
        plate_wall(c, tx + 1, 80 - h + 4, tx + 13, 80, ["#24140c", "#5a3018", "#8a4a24", "#a8683a"], seed=tx)
        c.rect(tx - 4, 80 - h, tx + 18, 80 - h + 3, "#1a0e08")
        for k in range(tx - 4, tx + 19, 4):
            c.poly([(k, 80 - h), (k + 2, 80 - h), (k + 1, 80 - h - 4)], "#1a0e08")
        c.line([(tx + 7, 80 - h), (tx + 7, 80 - h - 18)], "#1a0e08")
        for yy in range(80 - h - 18, 80 - h - 8, 2):            # black/white checked banner
            for xx in range(tx + 8, tx + 18, 2):
                c.rect(xx, yy, xx + 1, yy + 1, "#e8e0c8" if ((xx + yy) // 2) % 2 else "#1e1a18")
        c.rect(tx + 5, 80 - h + 8, tx + 9, 80 - h + 11, "#ffe08a")
        glow(c, tx + 7, 80 - h + 10, 8, ["#4a3a14", "#8a6a24"], strength=0.5)
    # the gate: a great toothed jaw of iron plates, half open, hazard-striped frame
    gx0, gx1, gy = 74, 118, 50
    c.rect(gx0 - 4, gy - 6, gx1 + 4, 82, "#1a0e08")
    hazard_stripe(c, gx0 - 3, gy - 5, gx1 + 3, gy - 2)
    c.rect(gx0, gy, gx1, 82, "#0c0604")
    glow(c, 96, 74, 18, ["#1a1408", "#4a3a14", "#a07a2a"], power=1.6, strength=0.8, ry=10)
    for x in range(gx0, gx1 - 2, 6):                            # upper teeth
        c.poly([(x, gy), (x + 6, gy), (x + 3, gy + 9)], "#6a4a2a")
        c.line([(x, gy), (x + 3, gy + 9)], "#a8885a")
    for x in range(gx0 + 3, gx1 - 2, 6):                        # lower teeth
        c.poly([(x, 82), (x + 6, 82), (x + 3, 74)], "#5a3a20")
    c.rect(gx0, 82, gx1, 84, "#2a1a10")
    # muddy road to the gate
    hband(c, 80, 107, ["#3a2a18", "#2a1e12", "#1e160c"], seed=5, rough=0.4)
    c.poly([(84, 84), (108, 84), (140, 107), (52, 107)], "#4a3620")
    for k in range(6):
        y = 86 + k * 4
        c.line([(96 - 10 - k * 6, y), (96 - 8 - k * 6, y)], "#2a1e12")
        c.line([(96 + 8 + k * 6, y), (96 + 10 + k * 6, y)], "#2a1e12")
    calm_lower(c, 84, "#1e160c", 0.3)
    vignette(c, "#060804", 0.55)
    return c.image()


# ------------------------------------------------------------------ Genestealer Cult
@scene("mine_shaft", "矿井", "Mine Shaft")
def mine_shaft():
    c = Canvas(192, 108)
    vx, vy = 96, 50
    corridor(c, vx, vy, 14, 10,
             wall=["#4a3a2a", "#3a2c20", "#2a1e16", "#1a120c"],
             floor=["#3a2c1e", "#2e2218", "#221810", "#140e0a"],
             ceil=["#2a2018", "#1e1610", "#140e0a", "#0c0806"],
             back=["#1a0e22", "#2a1436"], rib=["#5a3a1e", "#3a2412", "#2a1a0e"], rib_k=3.6, rib_w=0.16)
    glow(c, vx, vy, 22, ["#1e1028", "#3a1a4a", "#6a3a8a"], power=1.8, strength=0.8, ry=14)
    # rock texture on the walls
    n = Noise(14)
    for y in range(108):
        for x in range(192):
            dx, dy = abs(x - vx) / 14, abs(y - vy) / 10
            if max(dx, dy) > 1.3 and n.fbm(x * 0.15, y * 0.15) > 0.62 and bayer(x, y) < 0.5:
                c.set(x, y, mix(c.get(x, y), (10, 6, 4), 0.5))
    # rails converging to the vanishing point, sleepers
    for side in (-1, 1):
        c.line([(vx + side * 3, vy + 10), (vx + side * 40, 107)], "#8a8a8a")
        c.line([(vx + side * 4, vy + 10), (vx + side * 44, 107)], "#4a4a4a")
    for k in range(1, 9):
        f = (k / 8) ** 1.8
        y = int(vy + 10 + (107 - vy - 10) * f)
        w = int(4 + 42 * f)
        c.line([(vx - w, y), (vx + w, y)], "#3a2614", 1 + (k > 5))
    # caged lamps along the walls, warm pools of light
    for k, z in enumerate([0.25, 0.42, 0.7, 1.2]):
        for side in (-1, 1):
            x = int(vx + side * (14 + 60 * z))
            y = int(vy - 6 - 22 * z)
            if 0 <= x < 192:
                glow(c, x, y + 2, int(4 + 14 * z), ["#4a3018", "#8a5a24", "#ffc860"], power=1.8, strength=0.7)
                c.rect(x - 1, y, x + 1, y + 2, "#ffe8a0")
                c.set(x, y - 1, "#2a1a0e")
    # cable along the ceiling
    pts = [(0, 8), (40, 16), (80, 34), (96, 38)]
    c.line(pts, "#140c08", 2)
    # an ore cart on the left rail, mid-distance
    cx_, cy_ = 70, 78
    c.poly([(cx_ - 10, cy_ - 8), (cx_ + 10, cy_ - 8), (cx_ + 8, cy_), (cx_ - 8, cy_)], "#3a3a3e")
    c.rect(cx_ - 10, cy_ - 9, cx_ + 10, cy_ - 8, "#6a6a6e")
    for k in range(-8, 9, 4):
        c.set(cx_ + k, cy_ - 10, "#8a6a4a"); c.set(cx_ + k + 1, cy_ - 11, "#6a5a4a")
    for wx in (cx_ - 6, cx_ + 6):
        c.ellipse(wx, cy_ + 1, 2, 2, "#1a1a1e")
    # an odd violet scratch-mark on a support post (the cult was here)
    for (x, y) in [(150, 44), (151, 45), (152, 46), (154, 44), (153, 45), (152, 47), (152, 48), (150, 49), (154, 49)]:
        c.set(x, y, "#b86ae0")
    ember(c, 8, 30, (20, 10, 172, 70), cols=("#6a5a4a", "#8a7a6a"))
    calm_lower(c, 82, "#140e0a", 0.3)
    vignette(c, "#050304", 0.6)
    return c.image()


@scene("gsc_chapel", "地下礼拜堂", "Underground Chapel")
def gsc_chapel():
    c = Canvas(192, 108)
    sky(c, ["#0e0a12", "#1a1220", "#26182c", "#2e1e30"], 0, 107)
    n = Noise(23)
    # rough mined-out vault, braced with old timbers
    for y in range(108):
        for x in range(192):
            d = ((x - 96) / 88) ** 2 + ((y - 76) / 74) ** 2 + (n.fbm(x * 0.07, y * 0.07) - 0.5) * 0.45
            if d > 1:
                c.set(x, y, ramp_pick(["#0a080c", "#1a1418", "#2a2024", "#3a2c2a"], n.fbm(x * 0.1, y * 0.1) * 1.2 - 0.1, x, y))
    for x in (30, 162):
        c.rect(x - 2, 20, x + 2, 88, "#2a1a10")
        c.rect(x - 2, 20, x - 1, 88, "#5a3a20")
    c.rect(26, 20, 166, 23, "#2a1a10")
    c.rect(26, 20, 166, 20, "#5a3a20")
    # the painted icon on the back wall: halo, lozenge, four curved clawed arms (original)
    cx, cy = 96, 44
    glow(c, cx, cy, 34, ["#24142e", "#3a1a4a", "#5a2a6a"], strength=0.7)
    for a in range(0, 360, 2):
        t = math.radians(a)
        c.set(round(cx + math.cos(t) * 11), round(cy - 4 + math.sin(t) * 11), "#c8962a")
    c.poly([(cx, cy - 12), (cx + 3, cy), (cx, cy + 14), (cx - 3, cy)], "#e0b84a")
    c.line([(cx, cy - 9), (cx, cy + 11)], "#a07a24")
    for side in (-1, 1):
        for (sy, ey) in [(cy - 1, cy - 16), (cy + 4, cy + 18)]:
            p0, p1, p2 = (cx + side * 2, sy), (cx + side * 14, sy), (cx + side * 10, ey)
            pts = [((1 - f) ** 2 * p0[0] + 2 * (1 - f) * f * p1[0] + f * f * p2[0],
                    (1 - f) ** 2 * p0[1] + 2 * (1 - f) * f * p1[1] + f * f * p2[1]) for f in [i / 10 for i in range(11)]]
            c.line(pts, "#a07a24", 2)
            c.line(pts, "#e0b84a")
            hx_, hy_ = pts[-1]
            up = -1 if ey < sy else 1
            for dx in (-2, 0, 2):
                c.line([(hx_, hy_), (hx_ + dx, hy_ + up * 3)], "#fff0a0")
    c.set(cx, cy - 2, "#f4d8ff")
    glow(c, cx, cy - 2, 3, ["#c86aff", "#ffffff"], strength=0.8)
    # purple banners bearing the knot mark
    for bx in (54, 130):
        c.rect(bx, 24, bx + 12, 58, "#4a1e5a")
        c.rect(bx, 24, bx + 1, 58, "#6a2e7a")
        c.poly([(bx, 58), (bx + 12, 58), (bx + 6, 64)], "#4a1e5a")
        for (dx, dy) in [(3, 34), (9, 34), (4, 35), (8, 35), (6, 36), (4, 37), (8, 37), (3, 38), (9, 38)]:
            c.set(bx + dx, dy, "#e0b84a")
        c.rect(bx - 1, 24, bx + 13, 25, "#a07a24")
    # altar with candles and a stack of mining charges as offerings
    c.poly([(74, 66), (118, 66), (122, 80), (70, 80)], "#2a1a24")
    c.rect(72, 64, 120, 66, "#5a3a4a")
    c.rect(72, 64, 120, 64, "#8a6a7a")
    for x in range(78, 116, 5):
        h = 3 + (x * 5) % 4
        c.rect(x, 63 - h, x, 63, "#d8c8a0")
        c.set(x, 62 - h, "#ffd060")
        glow(c, x, 61 - h, 5, ["#2e1e30", "#6a3a3a"], strength=0.5)
    # strung mining lamps on a sagging cable
    pts = [(x, 12 + 10 * math.sin(math.pi * x / 191)) for x in range(0, 192, 4)]
    c.line(pts, "#0e0a0c")
    for k, x in enumerate(range(16, 192, 24)):
        y = int(12 + 10 * math.sin(math.pi * x / 191))
        c.rect(x - 1, y + 1, x + 1, y + 3, "#ffe08a")
        glow(c, x, y + 4, 9, ["#2a1e24", "#5a3e2e", "#a07a3a"], strength=0.6)
    # pews of rough planks
    for (y, w) in [(84, 60), (92, 72)]:
        for side in (-1, 1):
            x0 = 96 + side * 14
            x1 = x0 + side * w // 2
            c.rect(min(x0, x1), y, max(x0, x1), y + 2, "#2a1a10")
            c.rect(min(x0, x1), y, max(x0, x1), y, "#4a3018")
    hband(c, 96, 107, ["#1a1214", "#0e0a0c"], seed=5, rough=0.3)
    calm_lower(c, 84, "#0e0a10", 0.3)
    vignette(c, "#030204", 0.6)
    return c.image()


# ------------------------------------------------------------------ Adeptus Mechanicus
@scene("forge_floor", "锻造车间", "Forge Floor")
def forge_floor():
    c = Canvas(192, 108)
    sky(c, ["#140606", "#220a08", "#320e0a", "#3e140c"], 0, 107)
    # the great cog wall at the back, hub glowing
    cx, cy = 96, 38
    glow(c, cx, cy, 70, ["#2a0c08", "#4a1a0e", "#6a2a14"], power=1.4, strength=0.8, ry=46)
    gear(c, cx, cy, 34, "#3a1a0e", teeth=16, tooth=5, hi="#b88a3a", lo="#140806")
    gear(c, cx, cy, 30, "#5a2c16", teeth=16, tooth=0, hi="#8a5a24")
    gear(c, cx, cy, 22, "#2a120c", teeth=16, tooth=0, lo="#6a3a1a")
    for k in range(8):
        t = math.radians(k * 45 + 22.5)
        c.line([(cx + math.cos(t) * 8, cy + math.sin(t) * 8), (cx + math.cos(t) * 23, cy + math.sin(t) * 23)], "#5a3018", 3)
    glow(c, cx, cy, 11, ["#5a3a0a", "#c8962a", "#ffe08a", "#ffffff"], power=1.3, strength=1.0)
    gear(c, 40, 22, 14, "#2a120a", teeth=10, tooth=4, hole=5, hole_col="#140606", hi="#7a4a20")
    gear(c, 156, 26, 12, "#2a120a", teeth=9, tooth=4, hole=4, hole_col="#140606", hi="#7a4a20")
    # two massive pillars with brass bands framing the hall
    for (x0, x1) in [(14, 24), (168, 178)]:
        c.rect(x0, 0, x1, 82, "#1a0a08")
        c.rect(x0, 0, x0 + 1, 82, "#3a1a10")
        for y in (14, 40, 66):
            c.rect(x0 - 1, y, x1 + 1, y + 3, "#6a4a1e")
            c.rect(x0 - 1, y, x1 + 1, y, "#b88a3a")
    # cable bundles hanging in catenaries
    for (y0, sag, w, col) in [(2, 18, 3, "#0e0606"), (0, 26, 2, "#1a0c0a"), (6, 12, 2, "#140808")]:
        pts = [(x, y0 + sag * math.sin(math.pi * x / 191)) for x in range(0, 192, 4)]
        c.line(pts, col, w)
    # cogitator banks left and right: dark consoles with green screens
    for (x0, x1) in [(4, 52), (140, 188)]:
        c.rect(x0, 52, x1, 80, "#1e0e0a")
        c.rect(x0, 52, x1, 53, "#6a3a1a")
        for x in range(x0 + 3, x1 - 6, 9):
            c.rect(x, 57, x + 6, 63, "#0a1a0e")
            for y in range(58, 63, 2):
                for xx in range(x + 1, x + 6):
                    if (xx * 7 + y * 3 + x0) % 5 < 3:
                        c.set(xx, y, "#5aff7a")
            c.set(x + 1, 67, "#ff5a3a"); c.set(x + 3, 67, "#ffb040")
        c.rect(x0, 72, x1, 73, "#3a1a10")
    # forge floor: grating with red underglow, a channel of molten metal crossing
    hband(c, 80, 107, ["#2a0e0a", "#1e0a08", "#140606"], seed=6, rough=0.2)
    for y in range(82, 108, 4):
        for x in range(0, 192):
            if (x + y) % 6 == 0:
                c.set(x, y, "#4a1a10")
    for x in range(192):
        y = 86 + int(1.5 * math.sin(x * 0.08))
        c.set(x, y, "#ffb040" if bayer(x, y) < 0.6 else "#ffe08a")
        c.set(x, y + 1, "#c8501a")
    glow(c, 96, 87, 60, ["#2a0e0a", "#5a1e0e"], strength=0.4, ry=5)
    ember(c, 21, 24, (40, 20, 152, 78), cols=("#ffb040", "#ffe08a", "#c8501a"))
    calm_lower(c, 82, "#140606", 0.3)
    vignette(c, "#060202", 0.55)
    return c.image()


@scene("mars_vista", "火星远景", "Mars Vista")
def mars_vista():
    c = Canvas(192, 108)
    sky(c, ["#2a0e0a", "#4a1a10", "#7a2e16", "#a04a22", "#c06a34"], 0, 70)
    stars(c, 5, 30, 0, 22, cols=("#8a6a5a", "#c8a898"))
    # orbital ring arcs across the sky with station lights
    for (r, col) in [(260, "#c8a060"), (264, "#8a6a40")]:
        for x in range(192):
            y = 140 - math.sqrt(max(0, r * r - (x - 96) ** 2)) * 0.45
            if 0 <= y < 60:
                c.set(x, y, col if bayer(x, int(y)) < 0.8 else "#5a3a20")
    for x in range(8, 192, 22):
        y = 140 - math.sqrt(max(0, 260 * 260 - (x - 96) ** 2)) * 0.45
        if 0 <= y < 60:
            c.rect(x - 1, y - 1, x + 1, y, "#2a140c")
            c.set(x, y - 1, "#ffd8a0")
    planet(c, 160, 14, 6, ["#3a1e14", "#6a3a26", "#9a6a4a"], light=(-0.6, -0.4))
    glow(c, 40, 56, 40, ["#a04a22", "#c86a34", "#e8a060"], power=1.8, strength=0.7, ry=12)
    # distant shield volcano and mesas
    for x in range(192):
        h = 18 * math.exp(-((x - 48) / 30) ** 2) + 4 * math.exp(-((x - 150) / 12) ** 2)
        for y in range(int(66 - h), 70):
            c.set(x, y, ramp_pick(["#5a2414", "#6a2e18", "#7a3a1e"], clamp((y - 66 + h) / (h + 2)), x, y))
    # forge-city: stepped spires, smokestacks, lit windows, plumes
    rnd = random.Random(13)
    skyline(c, 7, 74, "#2a0e08", 28, 8, 28, 3, 9, x0=60, x1=192, win_p=0.12, wincol=("#ffb040", "#ff7a2a"), tips=0.4)
    for (x, h) in [(100, 44), (128, 52), (168, 40)]:
        c.rect(x, 74 - h, x + 4, 74, "#1e0a06")
        c.rect(x - 1, 74 - h, x + 5, 74 - h + 1, "#5a2a14")
        c.set(x + 2, 74 - h - 1, "#ff8a2a")
        n = Noise(x)
        for y in range(0, 74 - h):
            for xx in range(x - 10, x + 14):
                dx = xx - (x + 2 - (74 - h - y) * 0.4)
                if abs(dx) < 1.5 + (74 - h - y) * 0.18 + (n.fbm(xx * 0.1, y * 0.12) - 0.5) * 4:
                    c.set(xx, y, ramp_pick(["#3a1a14", "#5a2e22", "#6a3a2a"], n.fbm(xx * 0.1, y * 0.1), xx, y))
    glow(c, 130, 72, 40, ["#3a1408", "#7a3414"], strength=0.4, ry=6)
    # red dust plain, a few rocks, a dust haze line
    hband(c, 72, 107, ["#7a3a1e", "#6a2e18", "#4a1e10"], seed=9, rough=0.5)
    for _ in range(18):
        x, y = rnd.randint(0, 190), rnd.randint(76, 100)
        c.rect(x, y, x + rnd.randint(1, 3), y, "#3a160c")
        c.set(x, y - 1, "#9a4a2a")
    for x in range(192):
        if bayer(x, 73) < 0.5:
            c.set(x, 73, "#c07a4a")
    calm_lower(c, 82, "#4a1e10", 0.28)
    vignette(c, "#1a0604", 0.45)
    return c.image()


@scene("tech_vault", "科技宝库", "Archeotech Vault")
def tech_vault():
    c = Canvas(192, 108)
    sky(c, ["#05080a", "#0a1012", "#0e1618", "#121c1e"], 0, 107)
    # massive circular vault door set in a riveted bulkhead, its rim a cog
    cx, cy = 96, 46
    for y in range(108):
        for x in range(192):
            if (x // 16 + y // 12) % 2 == 0 and bayer(x, y) < 0.15:
                c.set(x, y, "#0e1416")
    for x in range(0, 192, 16):
        c.rect(x, 0, x, 84, "#080c0e")
    glow(c, cx, cy, 52, ["#0a1214", "#0e1e1e", "#14302c"], power=1.4, strength=0.8)
    gear(c, cx, cy, 34, "#1e2224", teeth=20, tooth=4)
    gear(c, cx, cy, 31, "#3a3a34", teeth=20, tooth=0)
    gear(c, cx, cy, 27, "#22262a", teeth=20, tooth=0)
    for a in range(0, 360, 2):                                   # brass rim + highlight
        t = math.radians(a)
        c.set(round(cx + math.cos(t) * 29), round(cy + math.sin(t) * 29), "#8a7040" if math.sin(t + 0.8) < 0 else "#4a3a20")
    # the door is cracked open: a vertical seam of green-white light
    for y in range(cy - 26, cy + 27):
        w = 1 + (1 if abs(y - cy) < 14 else 0)
        for x in range(cx - w, cx + w + 1):
            c.set(x, y, "#d8ffe8" if x == cx else "#5aff9a")
    glow(c, cx, cy, 16, ["#123a24", "#2a8a50", "#8affb0"], power=1.6, strength=0.7, ry=30)
    for k in range(6):                                            # locking bolts
        t = math.radians(k * 60)
        x, y = cx + math.cos(t) * 20, cy + math.sin(t) * 20
        c.rect(x - 2, y - 1, x + 2, y + 1, "#5a5a50")
        c.set(x - 1, y - 1, "#8a8a7a")
    # stasis alcoves on both walls, relics floating in green fields
    shapes = ["orb", "blade", "skullless_helm", "cube", "coil", "orb"]
    for side in (-1, 1):
        for k in range(3):
            x0 = 8 + k * 18 if side < 0 else 184 - k * 18 - 12
            y0 = 30 + k * 2
            c.rect(x0 - 1, y0 - 1, x0 + 13, y0 + 23, "#2a3030")
            for y in range(y0, y0 + 23):
                for x in range(x0, x0 + 13):
                    c.set(x, y, ramp_pick(["#0a1e14", "#14402a", "#1e6a40"], 0.3 + 0.5 * (y - y0) / 23, x, y))
            c.rect(x0, y0, x0 + 12, y0, "#8affb0")
            mx, my = x0 + 6, y0 + 11
            s = shapes[k + (side > 0) * 3]
            if s == "orb":
                c.ellipse(mx, my, 3, 3, "#0a2a18"); c.set(mx - 1, my - 1, "#d8ffe8")
            elif s == "blade":
                c.line([(mx - 3, my + 5), (mx + 3, my - 6)], "#0a2a18", 2)
            elif s == "cube":
                c.rect(mx - 3, my - 3, mx + 3, my + 3, "#0a2a18"); c.rect(mx - 3, my - 3, mx + 3, my - 3, "#4ac87a")
            elif s == "coil":
                for i in range(-5, 6, 2):
                    c.line([(mx - 3, my + i), (mx + 3, my + i + 1)], "#0a2a18")
            else:
                c.ellipse(mx, my, 4, 3, "#0a2a18"); c.rect(mx - 4, my, mx + 4, my + 3, "#0a2a18")
            c.rect(x0 - 2, y0 + 24, x0 + 14, y0 + 26, "#3a3e3a")
            c.set(x0 + 2, y0 + 25, "#ff5a3a")
    # warning lights and conduits
    for x in (60, 132):
        c.rect(x - 1, 8, x + 1, 10, "#ffb040")
        glow(c, x, 9, 6, ["#2a1a0a", "#7a4a14"], strength=0.6)
    for (y0, sag) in [(0, 10), (2, 16)]:
        pts = [(x, y0 + sag * math.sin(math.pi * x / 191)) for x in range(0, 192, 4)]
        c.line(pts, "#030505", 2)
    # floor: cold metal plates
    hband(c, 84, 107, ["#1a2022", "#121618", "#0a0e10"], seed=3, rough=0.2)
    for x in range(0, 192, 24):
        c.line([(x, 84), (x + (x - 96) // 3, 107)], "#0a0e10")
    c.rect(0, 84, 191, 84, "#3a4440")
    glow(c, cx, 86, 40, ["#0e1a16", "#1a3a2a"], strength=0.5, ry=4)
    calm_lower(c, 84, "#0a0e10", 0.3)
    vignette(c, "#020304", 0.6)
    return c.image()
