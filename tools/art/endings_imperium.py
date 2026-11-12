"""SPEC §31 ending illustrations — Imperium route (imp_*).  See endkit.py for the helper conventions."""
import math
import random
from reg import ending
from endkit import *


def _plates(c, x0, y0, x1, y1, cols, seed, pw=22, ph=17, patch=None, patch_n=0):
    """bolted wall plates with seams; `patch` colours some plates as freshly welded repairs."""
    rnd = random.Random(seed)
    n = Noise(seed)
    patches = set()
    gx, gy = (x1 - x0) // pw + 2, (y1 - y0) // ph + 2
    while len(patches) < patch_n:
        patches.add((rnd.randrange(gx), rnd.randrange(gy)))
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            row = (y - y0) // ph
            col = (x - x0 + (row % 2) * (pw // 2)) // pw
            t = clamp(0.25 + (y - y0) / (y1 - y0 + 1) * 0.55 + (n.fbm(x * 0.07, y * 0.1) - 0.5) * 0.5)
            cc = cols
            if patch and (col, row) in patches:
                cc, t = patch, clamp(0.45 + (n.fbm(x * 0.2, y * 0.2) - 0.5) * 0.4)
            c.set(x, y, ramp_pick(cc, t, x, y))
            if (y - y0) % ph == 0 or (x - x0 + (row % 2) * (pw // 2)) % pw == 0:
                c.set(x, y, cc[0])


@ending("imp_end_hold")
def imp_end_hold(e):
    """GOOD.  The rebuilt stairwell at dawn: a recaff stall under a patched awning, a queue of neighbours, the
    preacher reading the names at a wall of candles.  Light: sunrise through the left window, warm on cool."""
    c = e.c
    WALL = ["#242a46", "#323a5c", "#465074", "#5c6890"]
    NEW = ["#3a3548", "#5a4c58", "#85705e", "#a88a6a"]          # freshly welded patches: warm
    _plates(c, 0, 0, 191, 80, WALL, e.seed, patch=NEW, patch_n=7)
    # ceiling beam + pipe
    c.rect(0, 0, 191, 5, "#0c0e18")
    c.rect(0, 6, 191, 6, "#2e3450")
    c.rect(0, 9, 191, 10, "#1a1e30")
    c.rect(0, 9, 191, 9, "#3c4466")

    # ---- window with the sunrise
    def in_win(x, y):
        if not (12 <= x <= 60 and y <= 68):
            return False
        if y >= 30:
            return True
        dx = (x - 36) / 24.0
        return y >= 8 + 22 * (1 - math.sqrt(max(0.0, 1 - dx * dx)))
    c.field(["#6a9acc", "#a8c0d8", "#f0d0b0", "#ffd890", "#ffb870"], lambda x, y: (y - 8) / 44.0 if in_win(x, y) else None,
            mask=in_win, x0=10, y0=6, x1=62, y1=70)
    sun_x, sun_y = 41, 48
    glow(c, sun_x, sun_y, 20, ["#ffd890", "#ffe8b0", "#fff6d8"], power=1.5, strength=0.9, ry=14)
    c.ellipse(sun_x, sun_y, 4, 4, "#fff6d8")
    for yy in range(44, 53):                                   # sun cut off by the far skyline
        pass
    # far hive towers in haze, nearer ones darker
    rnd = random.Random(e.seed)
    for (base, cols_, n_, hmin, hmax) in [(60, "#9a8aa0", 7, 8, 20), (66, "#4e5276", 6, 12, 30)]:
        for _ in range(n_):
            w = rnd.randint(4, 8)
            x = rnd.randint(12, 54)
            h = rnd.randint(hmin, hmax)
            for xx in range(x, x + w):
                for yy in range(base - h, base + 1):
                    if in_win(xx, yy):
                        c.set(xx, yy, cols_)
    for x in range(12, 61):                                    # ground haze at the window foot
        for y in range(58, 69):
            if in_win(x, y):
                blend(c, x, y, "#3a3a5a", 0.35 + (y - 58) * 0.03)
    # birds
    for (bx, by) in [(24, 24), (30, 20), (49, 28)]:
        c.set(bx, by, "#40406a"); c.set(bx + 1, by - 1, "#40406a"); c.set(bx + 2, by, "#40406a")
    # frame + mullions
    for y in range(6, 70):
        for x in range(8, 64):
            if not in_win(x, y) and in_win(x + 3, y) or in_win(x - 3, y) and not in_win(x, y) and x > 36:
                c.set(x, y, "#0e1020")
    c.rect(35, 8, 37, 68, "#0e1020")
    c.rect(12, 34, 60, 36, "#0e1020")
    c.rect(10, 68, 62, 71, "#4a5072")
    c.rect(10, 71, 62, 72, "#0e1020")
    shafts(c, (36, 40), 34, 22, 6, 175, "#ffd890", t=0.34, seed=e.seed_for("sh"), w0=4, w1=18, power=0.5, floor=98)

    # ---- floor
    hband(c, 80, 107, ["#4a4a66", "#34344e", "#222236"], seed=e.seed_for("fl"), rough=0.25)
    for x in range(-40, 240, 14):                              # grating lines in perspective
        c.line([(96 + (x - 96) * 0.4, 80), (96 + (x - 96) * 1.6, 107)], "#161628")
    for y in (86, 94, 104):
        c.line([(0, y), (191, y)], "#181830")
    light_pool(c, 92, 90, 66, 11, "#ffd890", t=0.5)
    c.rect(0, 80, 191, 80, "#0c0e18")

    # ---- memorial wall: niches with candles
    c.rect(163, 16, 189, 79, "#0e1020")
    c.rect(163, 16, 189, 16, "#3c4466")
    rnd = random.Random(e.seed_for("candles"))
    for gy in range(8):
        for gx in range(4):
            x, y = 167 + gx * 6, 21 + gy * 7
            c.rect(x, y, x + 3, y + 4, "#06070e")
            if rnd.random() < 0.78:
                c.set(x + 1, y + 1, "#fff0b0"); c.set(x + 2, y + 1, "#ffd36a")
                c.set(x + 1, y + 2, "#ff9a3a"); c.set(x + 2, y + 2, "#ff9a3a")
    light_pool(c, 176, 48, 20, 34, "#ff9a3a", t=0.14)

    # ---- stall: lit wall behind it, small awning, lamp, counter, urn, steam, keeper
    light_pool(c, 112, 58, 40, 26, "#ffd890", t=0.20)
    for px_ in (88, 139):                                      # poles
        c.rect(px_, 38, px_ + 1, 80, "#12121e")
    for x in range(110, 141):                                  # short sloped tarp over the keeper
        y_top = 36 + (x - 110) // 12
        for y in range(y_top, y_top + 6):
            stripe = ((x - 110) // 5) % 2
            c.set(x, y, "#b4623a" if stripe else "#e6d2a8")
            if y == y_top + 5:
                c.set(x, y, "#5a2e1e" if stripe else "#9a8a6a")
            elif y == y_top:
                c.set(x, y, "#e8864a" if stripe else "#fff0c8")
    c.line([(112, 6), (112, 43)], "#0c0e18")
    glow(c, 112, 47, 8, ["#7a5a30", "#d0983e", "#ffd890"], power=1.2, strength=0.95)
    c.rect(110, 42, 114, 43, "#3a2a1e")
    c.ellipse(112, 47, 2, 2, "#fff6d8")
    keeper = fig(26, "carry", "#2c5068", facing=-1)
    put_figure(c, keeper, 124, 74, rim_col="#ffd890", toward=(-1, -1))
    # urn
    for yy in range(58, 72):
        for xx in range(95, 104):
            t = (xx - 95) / 8.0
            c.set(xx, yy, ramp_pick(["#fff0b0", "#e0a850", "#a86a2a", "#5a3416"], t, xx, yy))
    c.rect(96, 56, 102, 57, "#7a4a1e"); c.rect(97, 54, 101, 55, "#e0a850"); c.rect(98, 53, 100, 53, "#fff0b0")
    c.rect(92, 63, 94, 65, "#5a3416"); c.rect(91, 63, 91, 63, "#e0a850")
    # counter
    c.rect(84, 72, 140, 73, "#f0c27a")
    c.rect(84, 74, 140, 82, "#3a2a22")
    c.rect(84, 74, 140, 74, "#8a6a42")
    for x in range(87, 138, 8):
        c.rect(x, 76, x + 4, 80, "#2a1c18")
        c.set(x + 1, 77, "#6a4a30")
    for (mx, my) in [(108, 71), (113, 71)]:                    # mugs on the counter
        c.rect(mx, my - 3, mx + 2, my, "#f0e4c4")
        c.set(mx + 3, my - 2, "#f0e4c4")
    # steam
    sn = e.noise("steam")
    for y in range(26, 54):
        for x in range(92, 110):
            w = 1.4 + (54 - y) * 0.10
            dx = x - (99 + math.sin(y * 0.3) * 2.2 - (54 - y) * 0.10)
            if abs(dx) < w and sn.fbm(x * 0.4, y * 0.3, 2) > 0.36:
                blend(c, x, y, "#fff6e0", 0.9 * (1 - (54 - y) / 30.0) + 0.1, 3)

    # ---- the preacher at the wall of names
    pr = fig(27, "carry", "#2a2036", robe=0.75, facing=1)
    px0, py0 = put_figure(c, pr, 152, 84, rim_col="#b08a60", toward=(1, -1))
    hx_, hy_ = pr["hands"][0]
    c.rect(px0 + int(hx_), py0 + int(hy_) - 4, px0 + int(hx_) + 4, py0 + int(hy_), "#e8d8b8")
    c.rect(px0 + int(hx_), py0 + int(hy_) - 4, px0 + int(hx_) + 4, py0 + int(hy_) - 4, "#fff6e0")

    # ---- the queue, getting bigger toward the viewer
    queue = [(80, 86, 22, "stand"), (66, 90, 24, "stand"), (53, 94, 25, "walk"), (36, 98, 27, "stand"),
             (19, 102, 28, "hunch")]
    for (x, y, h, pz) in queue:
        f = fig(h, pz, "#161a2e", facing=1)
        put_figure(c, f, x, y, rim_col="#8a6a4c", toward=(-1, -1),
                   shadow=dict(toward_light=(-1, 0.3), length=1.1, col="#080a16", t=0.55))
    child = fig(13, "stand", "#20243c", facing=1)                # a child with a cup, at the front of the line
    cx_, cy_ = put_figure(c, child, 93, 90, rim_col="#8a6a4c", toward=(-1, -1),
                          shadow=dict(toward_light=(-1, 0.3), length=1.0, col="#080a16", t=0.55))
    c.rect(cx_ + 5, cy_ + 6, cx_ + 6, cy_ + 8, "#e8d8b8")

    # ---- foreground: scaffold post, dust in the light, mood
    c.rect(186, 0, 189, 107, "#0a0c16")
    c.rect(186, 0, 186, 107, "#2e3450")
    for y in range(18, 100, 24):
        c.rect(178, y, 189, y + 1, "#14182a")
    particles(c, "mote", 40, (14, 20, 140, 90), seed=e.seed_for("mote"), cols=("#ffe8b0", "#fff6d8"))
    vignette_kind(c, "good", strength=0.2)


@ending("imp_death_hp")
def imp_death_hp(e):
    """DEATH.  Unmarked Grave: a field of identical stakes under a dying sky; in front, one rifle with a helmet
    on it, black against the last gap in the clouds, with a long shadow.  A tiny deacon with a lantern reads
    numbers far away."""
    c = e.c
    HZ = 58
    SX = 118                                                    # where the last light is
    sky(c, ["#0e1018", "#1a1e2a", "#2c303e", "#4e5260", "#8a8884", "#d8b888"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#10131c", "#1c202c", "#2e3240", "#4a4e5c"], 0, 54, scale=0.05, thresh=0.47, stretch=4.0)
    glow(c, SX + 6, HZ - 12, 72, ["#262a36", "#363a48", "#4e5260", "#6c6e74", "#8a8884", "#b8a888", "#d8b888", "#fff0c8"], power=1.6, strength=1.0, ry=38)
    c.rect(SX - 22, HZ - 5, SX + 24, HZ - 5, "#fff0c8")        # a slit of sun under the cloud deck
    c.rect(SX - 16, HZ - 6, SX + 18, HZ - 6, "#e8c890")
    # ruined skyline, two layers
    skyline(c, e.seed_for("sk1"), HZ + 1, "#5a5a64", 12, 4, 14, 3, 9, win_p=0.0, tips=0.2)
    skyline(c, e.seed_for("sk2"), HZ + 2, "#272934", 10, 5, 22, 4, 11, win_p=0.0, tips=0.5)
    for yy in range(HZ - 30, HZ + 3):                          # the broken arch of a gate, far left
        for xx in (22, 23, 24):
            c.set(xx, yy, "#1a1c26")
    c.rect(18, HZ - 32, 28, HZ - 30, "#1a1c26")
    c.rect(36, HZ - 14, 39, HZ + 3, "#1a1c26")
    haze(c, HZ - 8, HZ + 6, "#6a6e7c", t=0.5, seed=e.seed_for("hz"), profile="mid")
    light_pool(c, SX, HZ - 1, 50, 5, "#e8c890", t=0.6)
    # ground
    hband(c, HZ + 1, 107, ["#4a413a", "#352e2a", "#221e1c", "#14120f"], seed=e.seed_for("gr"), rough=0.35)
    light_pool(c, SX, HZ + 4, 62, 6, "#d8b888", t=0.45)
    # field of stakes in perspective
    f_, camh = 62.0, 1.7
    vpx = SX
    rr = e.rng("stakes")
    for zi, Z in enumerate([3.4, 4.2, 5.2, 6.5, 8.2, 10.5, 13.5, 18, 24, 33, 45, 60, 80]):
        y = HZ + camh * f_ / Z
        step = 2.3
        X = -80.0 + (zi % 2) * step / 2
        while X < 60:
            x = vpx + (X + rr.uniform(-0.25, 0.25)) * f_ / Z
            hpx = max(1, round(rr.uniform(0.8, 1.1) * f_ / Z))
            if -3 < x < 195:
                far = clamp((Z - 3) / 60.0)
                stake = mix((24, 20, 18), (76, 72, 76), far * 0.9)
                tag = mix((124, 126, 136), (104, 100, 100), far * 0.8)
                for k in range(hpx):
                    c.set(x, y - k, stake)
                if hpx >= 3:
                    c.set(x, y - hpx, tag)
                    if hpx >= 7:
                        c.set(x, y - hpx - 1, tag)
            X += step
    for (x, y, h) in [(14, 99, 24), (38, 91, 18), (70, 96, 21)]:     # big stakes in the near ground
        for k in range(h):
            c.set(x, y - k, "#120f0d"); c.set(x + 1, y - k, "#1c1816")
        c.rect(x - 1, y - h - 3, x + 2, y - h, "#5e6068")
        c.rect(x - 1, y - h - 3, x + 2, y - h - 3, "#8a8c94")
    # the deacon, far left, with a lantern and a list
    d_f = fig(12, "carry", "#07070c", robe=0.7, facing=1)
    dpx, dpy = put_figure(c, d_f, 52, 73, rim_col="#8a6a44", toward=(1, 0))
    lx, ly = dpx + int(d_f["hands"][0][0]) + 2, dpy + int(d_f["hands"][0][1]) + 1
    glow(c, lx, ly, 7, ["#3a2a1c", "#a8702a", "#ffd890"], power=1.3, strength=0.95)
    c.set(lx, ly, "#fff6d8"); c.set(lx, ly + 1, "#ffd890")
    light_pool(c, lx - 1, 76, 12, 3, "#ffd890", t=0.3)
    # hero: a rifle planted muzzle-down, a helmet on its butt, a number tag on the trigger guard
    m = Canvas(56, 70, alpha=True)
    cx = 26
    for yy in range(22, 64):                                   # barrel
        m.set(cx - 1, yy, "#4a4c54"); m.set(cx, yy, "#24262c"); m.set(cx + 1, yy, "#14151a"); m.set(cx + 2, yy, "#0a0b0e")
    # stock: wide butt tapering to the grip, then receiver + magazine
    for yy in range(14, 27):
        half = int(4 - (yy - 14) * 0.18)
        for xx in range(cx - half, cx + half + 2):
            t = (xx - (cx - half)) / (2 * half + 2.0)
            m.set(xx, yy, ramp_pick(["#7a5a3a", "#5a4028", "#3a2818", "#1e140c"], t, xx, yy))
    m.rect(cx - 5, 13, cx + 6, 14, "#2e2218")                  # butt plate
    m.rect(cx - 5, 13, cx - 5, 14, "#8a6a4a")
    m.rect(cx - 3, 27, cx + 5, 37, "#22201c")                  # receiver + magazine
    m.rect(cx - 3, 27, cx - 3, 37, "#4a4840")
    m.rect(cx + 5, 30, cx + 6, 39, "#14120e")
    m.rect(cx - 2, 25, cx + 3, 26, "#14120e")
    for yy in range(58, 64):
        m.set(cx - 1, yy, "#8a8c94")                                                     # bayonet edge
    for yy in range(1, 14):                                                              # helmet: dome + brim
        for xx in range(cx - 10, cx + 12):
            dx, dy = (xx - (cx + 1)) / 8.5, (yy - 11) / 9.0
            if (dx * dx + dy * dy < 1.0 and yy <= 11) or (11 <= yy <= 12 and abs(xx - (cx + 1)) <= 9) \
                    or (yy == 13 and 7 <= abs(xx - (cx + 1)) <= 9):
                t = clamp((xx - (cx - 9)) / 20.0 * 0.9 + max(0, (yy - 3)) * 0.03)
                m.set(xx, yy, ramp_pick(["#6a6c54", "#3e4232", "#262a1e", "#14160e"], t, xx, yy))
    m.rect(cx - 8, 12, cx + 10, 12, "#0a0c08")
    m.line([(cx + 9, 12), (cx + 10, 21)], "#14160e")                                    # chin strap
    for k in range(12):                                                                  # rag tied below the receiver
        m.rect(cx + 3 + k, 40 + (k * k) // 16, cx + 4 + k, 41 + (k * k) // 16 + (1 if k % 3 == 1 else 0),
               "#6a4838" if k % 2 else "#3a2420")
    m.line([(cx - 3, 34), (cx - 6, 40)], "#3a3a3a")                                       # number tag
    m.rect(cx - 9, 40, cx - 4, 46, "#c8c8c0")
    m.rect(cx - 9, 40, cx - 4, 40, "#f0f0e8")
    for k in (42, 44):
        m.rect(cx - 8, k, cx - 5, k, "#6a6a66")
    mi = m.image().rotate(9, resample=Image.NEAREST, expand=True, center=(cx, 64))
    mi = rim(mi, "#b09a70", (-1, -1))
    bx, by = 142, 99
    cast_shadow(c, mi, bx + 2, by, anchor="bm", toward_light=(-1, 0.6), length=1.3, squash=0.30, col="#04040a", t=0.85)
    place(c, mi, bx, by + 1, anchor="bm")
    for xx in range(128, 160):                                 # mound at its foot
        for yy in range(96, 103):
            dx = (xx - 144) / 15.0
            if (yy - 96) / 6.0 + dx * dx * 0.9 < 1.0:
                c.set(xx, yy, ramp_pick(["#4a413a", "#352e2a", "#221e1c"], 0.15 + (yy - 96) * 0.1 + dx * 0.25, xx, yy))
    particles(c, "ash", 70, (0, 0, 191, 100), seed=e.seed_for("ash"), cols=("#6a6a72", "#8c8c94", "#4a4a52"))
    vignette_kind(c, "death", strength=0.9)


def _helmet(c, x, y, s, base, lit, dark, rnd=None):
    """tiny helmet silhouette: a dome of width ~4s, flat brim; lit on the right (the light side)."""
    w = 2 * s + 1
    for j in range(s + 1):
        half = int(round(w / 2.0 * math.sqrt(max(0.0, 1 - ((s - j) / (s + 0.5)) ** 2)))) if j < s else w // 2 + 1
        for i in range(-half, half + 1):
            col = dark if i < -half + 1 else (lit if i >= half - 0 and j < s else base)
            if j == s:
                col = dark
            c.set(x + i, y + j - s, col)


@ending("imp_end_claim_khorne")
def imp_end_claim_khorne(e):
    """BAD / Khorne.  The Endless Charge: a ragged runner black against a blood-red sun, a hill of helmets at his
    back, smaller copies of him running on toward the horizon.  Red + brass, backlit, low horizon."""
    c = e.c
    HZ = 82
    sky(c, ["#2a060c", "#521010", "#8a1e12", "#c8441c", "#ec8a2c", "#ffc060"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#2a060c", "#40080e", "#5e1010"], 0, 52, scale=0.05, thresh=0.5, stretch=5.0)
    sx_, sy_ = 154, 60
    glow(c, sx_, sy_, 70, ["#521010", "#8a1e12", "#c8441c", "#ec8a2c", "#ffc060", "#fff0c0"], power=1.3, strength=1.0, ry=46)
    c.ellipse(sx_, sy_, 14, 14, "#ffdc90")
    c.ellipse(sx_, sy_, 11, 11, "#fff4c8")
    shafts(c, (sx_, sy_), 118, 80, 7, 80, "#ffc060", t=0.22, seed=e.seed_for("sh"), w0=3, w1=10, power=0.8)
    # far plain + heat haze
    hband(c, HZ, 107, ["#6a1810", "#4a0e0c", "#2a0708", "#160304"], seed=e.seed_for("gr"), rough=0.35)
    haze(c, HZ - 8, HZ + 6, "#ec8a2c", t=0.5, seed=e.seed_for("hz"), profile="mid", x0=60)
    light_pool(c, sx_, HZ + 5, 74, 6, "#ffc060", t=0.55)
    for x in range(0, 192, 4):                                  # cracked earth, lines toward the sun
        c.line([(sx_ + (x - sx_) * 0.2, HZ + 1), (sx_ + (x - sx_) * 2.4, 107)], "#2a0708")
    # the hill of helmets (behind the runner, lit from the right)
    HB = 86
    hn = e.noise("hill")
    for x in range(0, 124):
        u = x / 123.0
        k = math.sin(math.pi * u ** 0.8) ** 1.1                  # asymmetric slump, peak left of centre
        top = int(HB - 46 * k + (hn.fbm(x * 0.09, 3.1, 3) - 0.5) * 16 * (0.3 + k))
        for y in range(top, HB + 1):
            c.set(x, y, "#22080a")
    rr = e.rng("helm")
    for y in range(36, HB, 3):
        for x in range(-2, 126, 5):
            xx, yy = x + rr.randint(-1, 1) + (y // 3 % 2) * 2, y + rr.randint(0, 1)
            if 0 <= xx < 124 and c.get(xx, yy) == (0x22, 0x08, 0x0a):
                lit = rr.choice(["#f08a3a", "#d8602a", "#ffb050"])
                base = rr.choice(["#5a4444", "#4a3638", "#6a5048"])
                _helmet(c, xx, yy, 2, base, lit, "#1a0608")
    haze(c, 60, HB, "#8a1e12", t=0.4, seed=e.seed_for("hz2"), profile="bottom", x0=0, x1=123)
    # smaller copies, running on toward the sun
    for (x, y, h, t_) in [(164, 86, 11, 0.4), (176, 84, 8, 0.5), (185, 83, 6, 0.6)]:
        f = fig(h, "run", mix((20, 4, 6), (120, 40, 20), t_ * 0.4), facing=1)
        put_figure(c, f, x, y)
    # the runner: big, ragged, black against the sun
    f = fig(48, "run", "#10040a", facing=1)
    rx, ry = 128, 98
    px0, py0 = put_figure(c, f, rx, ry, shadow=dict(toward_light=(1, 1.0), length=0.8, squash=0.30, col="#14030a", t=0.85))
    hx_, hy_ = f["head"]
    neck = (px0 + int(hx_) - 3, py0 + int(hy_) + 5)
    rags = [(0, 0), (-4, 1), (-9, 3), (-14, 2), (-19, 5), (-24, 4), (-29, 8)]            # scarf / coat tails streaming back
    for k in range(len(rags) - 1):
        (a0, b0), (a1, b1) = rags[k], rags[k + 1]
        c.line([(neck[0] + a0, neck[1] + b0), (neck[0] + a1, neck[1] + b1)], "#10040a", 3)
    for k, (a0, b0) in enumerate(rags[2:]):
        c.set(neck[0] + a0, neck[1] + b0 + 3, "#10040a")
        c.set(neck[0] + a0 - 1, neck[1] + b0 - 2, "#10040a")
    ax, ay = px0 + int(f["hands"][0][0]), py0 + int(f["hands"][0][1])
    c.line([(ax, ay), (ax + 11, ay - 9)], "#10040a", 2)                                   # a blade, held low and forward
    c.line([(ax + 4, ay - 4), (ax + 11, ay - 9)], "#ffc060")
    # foreground: loose helmets in the dust, big and dark
    for (x, y, s, lit) in [(18, 100, 6, "#d8602a"), (52, 104, 4, "#d8602a"), (176, 103, 5, "#f08a3a"), (150, 105, 3, "#f08a3a")]:
        _helmet(c, x, y, s, "#3a2024", lit, "#120406")
    particles(c, "ember", 55, (0, 20, 191, 104), seed=e.seed_for("emb"), cols=("#ff9a3a", "#ff6a2a", "#ffd080"))
    vignette_kind(c, "bad", col="#0a0204", strength=0.6)
