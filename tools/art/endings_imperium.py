"""SPEC §31 ending illustrations — Imperium route (imp_*).  See endkit.py for the helper conventions."""
import math
import random
from reg import ending
from endkit import *
from scenekit import ship_cathedral, ship_gothic, lightning


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


# =====================================================================================================
#  Remaining Imperium endings (art role, SPEC §31).  Underscore helpers are local to this module.
# =====================================================================================================

def _poly_pts(c, pts, col):
    c.poly([(int(x), int(y)) for x, y in pts], col)


def _wedge_line(c, p0, p1, w0, w1, col):
    """thick tapering line from p0 (width w0) to p1 (width w1)."""
    ax, ay = p0
    bx, by = p1
    dx, dy = bx - ax, by - ay
    ln = math.hypot(dx, dy) or 1.0
    nx, ny = -dy / ln, dx / ln
    c.poly([(ax + nx * w0 / 2, ay + ny * w0 / 2), (bx + nx * w1 / 2, by + ny * w1 / 2),
            (bx - nx * w1 / 2, by - ny * w1 / 2), (ax - nx * w0 / 2, ay - ny * w0 / 2)], col)


def _rift(c, seed, pts, core="#1a0610", edge="#a02a2a", hot="#ff7a3a", wmax=5.0):
    """the Great Rift as a ragged wound across the sky: dark core, red lips, a few hot sparks.  pts = polyline."""
    rnd = random.Random(seed)
    path = []
    for i in range(len(pts) - 1):
        (x0, y0), (x1, y1) = pts[i], pts[i + 1]
        n = max(2, int(math.hypot(x1 - x0, y1 - y0)))
        for k in range(n):
            t = k / n
            path.append((x0 + (x1 - x0) * t, y0 + (y1 - y0) * t))
    L = len(path)
    wob = Noise(seed)
    cen = [(x + (wob.fbm(i * 0.07, 1.3, 3) - 0.5) * 7, y + (wob.fbm(i * 0.07, 7.7, 3) - 0.5) * 7) for i, (x, y) in enumerate(path)]
    wid = [wmax * math.sin(math.pi * (i + 0.5) / L) ** 0.6 * (0.55 + 0.9 * wob.fbm(i * 0.18, 4.4, 2)) for i in range(L)]
    for rad_k, col, tt in ((1.0, edge, None), (1.55, edge, 0.5)):          # lips and a soft bleed
        for i in range(0, L):
            x, y = cen[i]
            w = wid[i] * rad_k + (0.8 if tt else 0)
            for yy in range(int(y - w) - 1, int(y + w) + 2):
                for xx in range(int(x - w) - 1, int(x + w) + 2):
                    d = math.hypot(xx - x, (yy - y) * 1.25)
                    if d <= w:
                        if tt is None:
                            c.set(xx, yy, col if rnd.random() < 0.9 else hot)
                        else:
                            blend(c, xx, yy, col, tt, 3)
    for i in range(0, L):
        x, y = cen[i]
        w = wid[i] * 0.55
        for yy in range(int(y - w) - 1, int(y + w) + 2):
            for xx in range(int(x - w) - 1, int(x + w) + 2):
                if math.hypot(xx - x, (yy - y) * 1.25) <= w:
                    c.set(xx, yy, core)
    for _ in range(12):
        x, y = rnd.choice(cen)
        c.set(int(x) + rnd.randint(-4, 4), int(y) + rnd.randint(-5, 5), hot)


@ending("imp_end_crusade")
def imp_end_crusade(e):
    """GOOD.  The crusade fleet departs: a blue-and-gold cathedral-ship hangs over the landing apron, a gangway climbs
    into its belly with troops filing up; at the foot the player, black against the dawn, turns for one last look at
    the sky - the rift still a wound across it.  Bright mass: low left horizon + the gilded ship on the upper right."""
    c = e.c
    HZ = 82
    sky(c, ["#08123a", "#14286a", "#2c4a8e", "#5a6aa0", "#a07a9a", "#e49a78", "#ffc88a"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#5a4a84", "#a06a8c", "#e08a78", "#ffc088"], 58, HZ, scale=0.06, thresh=0.52, stretch=5.0)
    glow(c, 10, HZ - 2, 84, ["#4a4a88", "#8a6a98", "#d88a78", "#ffb078", "#ffd8a0", "#fff2d0"], power=1.4, strength=1.0, ry=46)
    c.ellipse(12, HZ - 1, 6, 6, "#fff6d8")
    c.rect(0, HZ - 1, 30, HZ, "#fff0c0")
    # the rift, a wound across the upper-left sky
    _rift(c, e.seed_for("rift"), [(-6, 12), (20, 20), (46, 14), (66, 30), (84, 46)], wmax=5.0)
    # far fleet: tiny hulls on the horizon haze
    pal = ("#0a1030", "#1c2c64", "#3a5aa0", "#f0c868", "#ffe090", "#9ad6ff")
    ship_cathedral(c, 78, 66, 20, pal, face=1, seed=e.seed_for("s2"))
    ship_cathedral(c, 54, 52, 14, pal, face=1, seed=e.seed_for("s3"))
    # ground
    hband(c, HZ, 107, ["#7a5e72", "#4e4260", "#2e2c48", "#1c1c30", "#10101e"], seed=e.seed_for("gr"), rough=0.3)
    haze(c, HZ - 6, HZ + 7, "#ffc088", t=0.5, seed=e.seed_for("hz"), profile="mid", x1=130)
    light_pool(c, 34, HZ + 7, 60, 6, "#ffc088", t=0.55)
    for x in range(-80, 280, 24):                              # apron joints in perspective toward the sun
        c.line([(12 + (x - 12) * 0.12, HZ + 1), (12 + (x - 12) * 2.0, 107)], "#1c1c30")
    # ---- the ship: big, side-on, stern left, lit by the dawn from the left
    pal_big = ("#0a1030", "#16245a", "#2e4a96", "#f0c868", "#ffe090", "#9ad6ff")
    ship_cathedral(c, 80, 56, 118, pal_big, face=1, seed=e.seed_for("big"))
    # boarding hatch in the hull flank: a gilded doorway full of warm light
    bx0, bx1, by0, by1 = 124, 146, 61, 73
    c.rect(bx0 - 2, by0 - 2, bx1 + 2, by1, "#f0c040")
    c.rect(bx0 - 1, by0 - 1, bx1 + 1, by1, "#5a3c18")
    for y in range(by0, by1 + 1):
        for x in range(bx0, bx1 + 1):
            c.set(x, y, ramp_pick(["#ffb84a", "#ffd890", "#fff0c8"], 0.75 - (y - by0) / 14.0 * 0.5 + (x - bx0) * 0.004, x, y))
    glow(c, 135, by1 + 3, 22, ["#6a4a2a", "#c89040", "#ffe0a0"], power=1.8, strength=0.7, ry=9)
    # gangway: rails climbing from the apron into the bay, troops on it
    gx0, gy0, gx1, gy1 = 82, 101, 130, 74
    c.poly([(gx0, gy0), (gx0 + 7, gy0), (gx1 + 6, gy1), (gx1 - 1, gy1)], "#1c2040")
    c.line([(gx0, gy0), (gx1 - 1, gy1)], "#f0c040")
    c.line([(gx0 + 7, gy0), (gx1 + 6, gy1)], "#6a4a20")
    for k in range(10):                                        # a file of silhouettes, smaller as they climb
        t_ = 0.06 + k * 0.092
        px_ = gx0 + 4 + (gx1 - gx0) * t_
        py_ = gy0 + (gy1 - gy0) * t_
        f = fig(int(19 - 6 * t_), "walk", mix((10, 14, 38), (50, 44, 64), t_ * 0.4), facing=1)
        put_figure(c, f, px_, py_, rim_col="#ffd090", toward=(-1, -1))
    # ---- foreground: the player at the foot of the gangway, black against the dawn glow, turned back to the sky
    pf = player_fig("imperium", 38, "stand", facing=-1)
    pf["img"] = tint(pf["img"], "#0a0c24", 0.5)
    pxx, pyy = 46, 104
    put_figure(c, pf, pxx, pyy, rim_col="#ffd890", toward=(-1, -1),
               shadow=dict(toward_light=(-1, 0.4), length=1.5, squash=0.3, col="#0c0c20", t=0.7))
    for (x, y, w_) in [(5, 102, 7), (160, 103, 8), (176, 106, 5)]:          # cases left on the apron
        c.rect(x, y - w_, x + w_, y, "#1a1a2e")
        c.rect(x, y - w_, x + w_, y - w_, "#6a5a70")
        c.rect(x, y - w_, x, y, "#6a5a70")
    particles(c, "mote", 22, (0, 40, 120, 100), seed=e.seed_for("mote"), cols=("#ffe8b0", "#fff6d8"))
    vignette_kind(c, "good", strength=0.25)


def _spiral_peel(c, x, y, n, col, hi, seed):
    """a hanging curl of fruit peel: n px long, corkscrewing."""
    for k in range(n):
        xx = x + int(round(math.sin(k * 0.9) * (1.5 + k * 0.08)))
        c.set(xx, y + k, col)
        if k % 3 == 0:
            c.set(xx + 1, y + k, hi)


@ending("imp_end_inquisition")
def imp_end_inquisition(e):
    """GOOD.  The shuttle: the Inquisitor across a small table under a brass lamp, a spiral of peel hanging from the half
    an orange she holds out; the player, in profile, reaches for it.  A porthole shows home dwindling.  Bright mass:
    the lamp-lit hands at centre-left and the porthole upper right; warm cream cabin, cool blue-white window."""
    c = e.c
    WALL = ["#3e363e", "#5e5058", "#84706c", "#a8907c", "#c4aa88"]
    _plates(c, 0, 0, 191, 80, WALL, e.seed, pw=46, ph=40, patch=["#4a4048", "#6a5a58", "#8a7a70"], patch_n=2)
    for x in range(0, 192, 46):                               # bulkhead rivets along the seams
        for y in range(4, 80, 8):
            c.set(x + 3, y, "#d8c8a8")
            c.set(x + 3, y + 1, "#4a3a3a")
    c.rect(0, 0, 191, 4, "#2a2226")                          # ceiling beam + a conduit
    c.rect(0, 5, 191, 5, "#7e6e68")
    c.rect(0, 62, 191, 64, "#4a3c3c")                        # dado rail
    c.rect(0, 62, 191, 62, "#b09a80")
    # ---- porthole, upper right: deep blue with the planet's lit limb
    PX, PY, PR = 146, 34, 27
    inside = lambda x, y: (x - PX) ** 2 + (y - PY) ** 2 <= PR * PR
    c.field(["#040824", "#0a1850", "#143a86"], lambda x, y: ((y - (PY - PR)) / (2.0 * PR)) if inside(x, y) else None,
            mask=inside, x0=PX - PR, y0=PY - PR, x1=PX + PR, y1=PY + PR)
    stars(c, e.seed_for("st"), 40, PY - PR, PY + PR, mask=inside)
    for y in range(PY - PR, PY + PR + 1):                    # the planet: a huge bright limb low and left
        for x in range(PX - PR, PX + PR + 1):
            if inside(x, y):
                d = math.hypot(x - (PX - 30), y - (PY + 72))
                if d < 62:
                    c.set(x, y, ramp_pick(["#c8f0ff", "#5aa8e0", "#2a6a9a", "#2a5a52", "#3a3a32"], (d / 62.0) ** 1.4, x, y))
                elif d < 66:
                    blend(c, x, y, "#9af6ff", 0.7 - (d - 62) * 0.15, 3)
    glow(c, PX - 22, PY + 14, 12, ["#2a6a9a", "#9af6ff", "#ffffff"], power=1.5, strength=0.9)
    for a in range(0, 900):                                  # brass bezel + bolts
        t = a / 900 * 2 * math.pi
        c.set(PX + math.cos(t) * (PR + 2), PY + math.sin(t) * (PR + 2), "#8a6a38")
        c.set(PX + math.cos(t) * (PR + 3), PY + math.sin(t) * (PR + 3), "#3a2c20")
    for k in range(12):
        t = k / 12 * 2 * math.pi
        c.set(PX + math.cos(t) * (PR + 2), PY + math.sin(t) * (PR + 2), "#f0d890")
    # ---- floor: warm deck, lamp pool
    hband(c, 80, 107, ["#4e4038", "#382e2e", "#241e22", "#161216"], seed=e.seed_for("fl"), rough=0.25)
    for x in range(-40, 240, 12):
        c.line([(96 + (x - 96) * 0.5, 80), (96 + (x - 96) * 1.7, 107)], "#1e181c")
    c.rect(0, 80, 191, 80, "#1e181c")
    light_pool(c, 84, 92, 60, 10, "#ffd890", t=0.45)
    # ---- hanging lamp
    LX = 78
    light_pool(c, LX, 40, 52, 38, "#ffe0a0", t=0.5)
    c.line([(LX, 5), (LX, 18)], "#2a2226")
    for k in range(7):
        c.rect(LX - 3 - k, 18 + k, LX + 3 + k, 18 + k, ramp_pick(["#5a3c1c", "#c8943a", "#f0d890"], 0.2 + k * 0.1, k, k))
    c.rect(LX - 9, 25, LX + 9, 25, "#fff0b8")
    c.rect(LX - 7, 26, LX + 7, 26, "#ffe8a0")
    # ---- the inquisitor, behind the table: long coat, wide-brimmed hat, turned toward the player
    insp = fig(64, "stand", "#2c2230", robe=0.92, facing=-1)
    ix, iy = put_figure(c, insp, 104, 88, rim_col="#c8a878", toward=(-1, -1))
    hx_, hy_ = int(ix + insp["head"][0]), int(iy + insp["head"][1])
    c.rect(hx_ - 4, hy_ - 4, hx_ + 4, hy_ + 3, "#e8b890")        # face (in shadow under the brim)
    c.rect(hx_ - 4, hy_ - 4, hx_ + 4, hy_ - 3, "#a8705a")
    c.rect(hx_ - 3, hy_ - 1, hx_ - 2, hy_ - 1, "#2a1a1a")         # eye
    c.rect(hx_ + 1, hy_ - 1, hx_ + 2, hy_ - 1, "#2a1a1a")
    c.rect(hx_ - 5, hy_ - 5, hx_ + 5, hy_ - 5, "#1a1218")         # brim and crown
    c.rect(hx_ - 11, hy_ - 6, hx_ + 11, hy_ - 5, "#241a24")
    c.rect(hx_ - 11, hy_ - 6, hx_ - 6, hy_ - 6, "#8a6a58")
    c.rect(hx_ - 5, hy_ - 12, hx_ + 5, hy_ - 7, "#241a24")
    c.rect(hx_ - 5, hy_ - 8, hx_ + 5, hy_ - 8, "#7a2a2a")
    c.rect(hx_ - 5, hy_ - 12, hx_ - 4, hy_ - 7, "#8a6a58")
    c.rect(hx_ - 2, hy_ + 4, hx_ + 2, hy_ + 7, "#d8d0c0")          # collar
    # ---- table
    c.rect(54, 77, 132, 79, "#d0a85a")
    c.rect(54, 77, 132, 77, "#fff0b8")
    c.rect(54, 80, 132, 90, "#3e3030")
    c.rect(54, 80, 132, 80, "#8a6a42")
    for x in range(58, 128, 11):
        c.rect(x, 83, x + 6, 88, "#2a2022")
        c.set(x + 1, 84, "#6a4a38")
    c.rect(106, 75, 109, 76, "#ffd24a")                          # the coin on the table
    c.set(106, 75, "#fff6c8")
    e.protect += ["#fff6c8"]
    # ---- the outstretched hands: her half orange with a dangling peel, the player's open palm below it
    ax, ay = 70, 60
    c.poly([(94, 47), (96, 55), (ax + 4, ay + 1), (ax + 4, ay - 4)], "#2c2230")      # her sleeve, from the shoulder
    c.line([(94, 46), (ax + 4, ay - 5)], "#c8a878")
    c.rect(ax + 3, ay - 4, ax + 5, ay, "#e8e0d0")                                    # cuff
    c.rect(ax, ay - 3, ax + 3, ay - 1, "#e8b890")                 # her hand
    c.ellipse(ax - 1, ay - 5, 5, 4, "#ff8a1a")                    # the half orange, flat side down
    c.rect(ax - 7, ay - 4, ax + 5, ay - 3, "#d45a10")
    c.rect(ax - 6, ay - 5, ax + 4, ay - 5, "#ffd070")
    c.rect(ax - 5, ay - 8, ax + 2, ay - 8, "#ffb04a")
    c.rect(ax - 3, ay - 7, ax - 1, ay - 6, "#fff0b0")
    c.rect(ax - 7, ay - 3, ax + 5, ay - 3, "#8a3a0a")
    _spiral_peel(c, ax - 6, ay - 2, 15, "#ff9a2a", "#ffd070", 0)
    # ---- the player, in profile, reaching; blue coat with the brass shoulder band
    pf = player_fig("imperium", 62, "reach", facing=1)
    pxx, pyy = 28, 107
    px0_, py0_ = put_figure(c, pf, pxx, pyy, rim_col="#fff0c0", toward=(1, -1),
                            shadow=dict(toward_light=(1, 0.2), length=0.9, squash=0.25, col="#1a1216", t=0.5))
    fhx, fhy = int(px0_ + pf["head"][0]), int(py0_ + pf["head"][1])
    c.rect(fhx + 2, fhy - 1, fhx + 4, fhy + 2, "#e8b890")        # face in profile
    c.set(fhx + 3, fhy, "#2a1a1a")
    particles(c, "mote", 30, (30, 8, 150, 76), seed=e.seed_for("mote"), cols=("#ffe8b0", "#fff6d8"))
    vignette_kind(c, "good", strength=0.3)


def _streaks(c, seed, n, origin, spread, lmin, lmax, head, tail, region=None):
    """meteor / drop-pod streaks radiating from `origin` (a far point): head bright, tail fading toward the origin."""
    rnd = random.Random(seed)
    ox, oy = origin
    for _ in range(n):
        hx_ = rnd.uniform(0, 191)
        hy_ = rnd.uniform(region[1] if region else 0, region[3] if region else 100)
        dx, dy = hx_ - ox, hy_ - oy
        ln = math.hypot(dx, dy) or 1.0
        dx, dy = dx / ln, dy / ln
        L = rnd.uniform(lmin, lmax)
        for k in range(int(L)):
            t = k / L
            x, y = int(hx_ - dx * k), int(hy_ - dy * k)
            col = mix(C(head), C(tail), t)
            if t < 0.35 or rnd.random() < 0.8:
                blend(c, x, y, "#%02x%02x%02x" % tuple(int(v) for v in col), 1.0 - t * 0.85, 3)
        c.set(int(hx_), int(hy_), head)


@ending("imp_end_brood")
def imp_end_brood(e):
    """BAD.  'Family': dusk wheat under a violet sky that is raining stars; the player, from behind, arms wide to
    welcome them; a loose arc of clean-clothed 'family' does the same - and the tall figure beside him has four arms.
    Sick violet over wheat-ochre; the bright mass is the star-fall radiating from the upper right."""
    c = e.c
    HZ = 62
    sky(c, ["#070216", "#100528", "#220e44", "#3a1858", "#5a2468", "#7e3a74", "#a85a80"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#180a34", "#2e1458", "#4a2470"], 6, 50, scale=0.045, thresh=0.52, stretch=4.0)
    glow(c, 152, -8, 66, ["#2a1250", "#4a1e62", "#7e3a84", "#b45aa0", "#e890c8", "#ffd0f0"], power=1.9, strength=0.8, ry=50)
    _streaks(c, e.seed_for("rain"), 44, (150, -80), 0, 8, 30, "#fff0ff", "#a050c8", region=(0, 8, 191, 70))
    # far blue-violet hills on the horizon
    ridge(c, HZ + 1, 3, 9, "#3a1a56", seed=e.seed_for("hill"), scale=0.03)
    haze(c, HZ - 6, HZ + 5, "#c07090", t=0.4, seed=e.seed_for("hz"), profile="mid")
    # ---- the wheat: strokes of golden ochre, bigger toward us, violet haze on the far rows
    hband(c, HZ + 1, 107, ["#3a2036", "#4e2e32", "#684822", "#4e3616", "#30200c"], seed=e.seed_for("wh"), rough=0.2)
    rr = e.rng("wheat")
    y = HZ + 2.0
    while y < 108:
        d = (y - HZ) / 46.0
        step = 1.8 + d * 3.2
        ln = 2 + d * 8
        x = rr.uniform(-2, 2)
        while x < 194:
            xx = int(x + rr.uniform(-1, 1))
            col = mix((140, 98, 38), (84, 46, 74), clamp(1 - d * 1.3) * 0.8)
            col2 = mix((206, 164, 80), (130, 80, 112), clamp(1 - d * 1.3) * 0.8)
            for k in range(int(ln)):
                c.set(xx, int(y) - k, "#%02x%02x%02x" % tuple(int(v) for v in (col if k < ln - 1 else col2)))
            x += step
        y += 1.3 + d * 1.8
    haze(c, HZ + 1, HZ + 20, "#a04a94", t=0.35, seed=e.seed_for("hz2"), profile="top")
    light_pool(c, 150, HZ + 12, 80, 10, "#c05aa0", t=0.25)
    # ---- the family: clean cream clothes, arms wide, a loose arc across the field; four-armed ones hide among them
    rim_c = "#ff9ad8"
    rows = [(98, 70, 8, 0), (128, 70, 8, 0), (160, 68, 7, 0), (30, 71, 9, 0), (12, 69, 8, 0), (178, 73, 10, 0),
            (46, 76, 13, 0), (150, 78, 14, 0), (80, 77, 14, 0), (170, 86, 20, 0), (20, 84, 22, 0), (62, 90, 26, 0), (126, 88, 24, 0)]
    for (x, yy, h, _) in rows:
        t_ = clamp((yy - 66) / 26.0)
        col = mix((90, 66, 110), (206, 186, 184), 0.3 + 0.7 * t_)
        f = fig(h, "arms_up", col, facing=1)
        put_figure(c, f, x, yy, rim_col=rim_c, toward=(1, -1))
    # a few with a second pair of arms
    for (x, yy, h) in [(126, 88, 24), (62, 90, 26), (150, 78, 14)]:
        t_ = clamp((yy - 66) / 26.0)
        col = "#%02x%02x%02x" % tuple(int(v) for v in mix((90, 66, 110), (206, 186, 184), 0.3 + 0.7 * t_))
        sy = yy - int(h * 0.78)
        c.line([(x, sy), (x - h // 3, sy - h // 6)], col)
        c.line([(x, sy), (x + h // 3, sy - h // 8)], col)
        c.line([(x, sy + 2), (x - h // 4, sy + 6)], col)
        c.line([(x, sy + 2), (x + h // 4, sy + 6)], col)
    # the tall one beside the player: hunched, four arms up, dark against the sky glow
    tall = fig(52, "arms_up", "#22103a", facing=1)
    tx, ty = put_figure(c, tall, 118, 102, rim_col="#ff9ad8", toward=(1, -1),
                        shadow=dict(toward_light=(1, -0.2), length=0.8, squash=0.25, col="#2a1a38", t=0.5))
    shy = ty + 14
    cx = 118
    c.line([(cx, shy), (cx - 15, shy - 2)], "#22103a", 2)
    c.line([(cx - 15, shy - 2), (cx - 21, shy - 12)], "#22103a", 2)
    c.line([(cx, shy), (cx + 15, shy - 3)], "#22103a", 2)
    c.line([(cx + 15, shy - 3), (cx + 21, shy - 14)], "#22103a", 2)
    for ax in (cx - 21, cx + 21, cx - 14, cx + 14):                       # claws
        c.set(ax, shy - 15, "#ff9ad8")
    hhx, hhy = tx + int(tall["head"][0]), ty + int(tall["head"][1])
    c.rect(hhx - 2, hhy - 1, hhx + 2, hhy, "#ff4ad8")                        # two bright eyes
    c.rect(hhx - 5, hhy - 6, hhx + 5, hhy - 5, "#22103a")                    # swept-back crest
    c.line([(hhx - 3, hhy - 5), (hhx - 9, hhy - 10)], "#22103a", 2)
    # ---- the player, from behind, arms wide, in the foreground
    pf = player_fig("imperium", 50, "arms_up", facing=1)
    put_figure(c, pf, 66, 106, rim_col="#ff9ad8", toward=(1, -1),
               shadow=dict(toward_light=(1, -0.2), length=0.8, squash=0.25, col="#2a1a38", t=0.5))
    # foreground wheat heads, big and dark
    rr2 = e.rng("fg")
    for _ in range(70):
        x = rr2.randint(0, 191)
        y0 = rr2.randint(98, 107)
        hgt = rr2.randint(5, 12)
        for k in range(hgt):
            c.set(x, y0 - k, "#2a1a14")
        c.set(x + 1, y0 - hgt, "#7a5a20")
        c.set(x - 1, y0 - hgt + 1, "#7a5a20")
    particles(c, "spore", 26, (0, 20, 191, 100), seed=e.seed_for("sp"), cols=("#ff9ad8", "#fff0ff", "#c8a0ff"))
    vignette_kind(c, "bad", col="#070216", strength=0.8)


def _proj(vp, hw, S, X, Y):
    """one-point perspective: X in half-widths of the doorway, Y in px (down +) at scale 1, S = nearness (1 = doorway)."""
    return (vp[0] + X * hw * S, vp[1] + Y * S)


def _bloom(c, x, y, r, petal, heart, stem=None, stem_len=0):
    """a tiny flower: petals around a heart, optional stem going down."""
    if stem:
        for k in range(stem_len):
            c.set(x, y + 1 + k, stem)
    for (dx, dy) in ((-1, 0), (1, 0), (0, -1), (0, 1)):
        for k in range(1, r + 1):
            c.set(x + dx * k, y + dy * k, petal)
    c.set(x, y, heart)


@ending("imp_end_claim_nurgle")
def imp_end_claim_nurgle(e):
    """BAD / Nurgle.  The Garden Camp: the long field-hospital tent seen down its aisle; every cot has a smiling sleeper
    with blooms growing from the blanket, vines in the roof, flies in the light; at the far door the commissar's black
    silhouette has stopped to look.  Green-ochre (GOD['nurgle']); the player, a dark watering-can figure, frames the left."""
    c = e.c
    G = GOD["nurgle"]["ramp"]
    VP, HWD, HT, HB = (100, 50), 16, 10, 16                 # vanishing point, doorway half-width, up, down
    n1 = e.noise("canvas")
    # ---- tunnel faces (ray-cast a box): canvas walls and roof, earth floor, doorway light
    for y in range(c.h):
        for x in range(c.w):
            dx, dy = x - VP[0], y - VP[1]
            rx = abs(dx) / HWD
            ry = (-dy / HT) if dy < 0 else dy / HB
            m = max(rx, ry)
            if m < 1.0:
                continue                                       # the doorway, painted later
            S = m
            near = clamp((S - 1) / 5.5)
            if ry > rx and dy > 0:                             # floor
                t = 0.62 - near * 0.5 + (n1.fbm(x * 0.08, y * 0.2) - 0.5) * 0.3
                c.set(x, y, ramp_pick(["#080602", "#120e06", "#221a0c", "#382c14", "#5a4a1e"], t, x, y, 1.6))
            else:                                              # canvas
                roof = ry > rx
                t = 0.78 - near * 0.62 + (n1.fbm(x * 0.06, y * 0.06) - 0.5) * 0.35 + (0.06 if roof else 0)
                col = ramp_pick(["#060804", "#10160a", "#1e2a0e", "#344416", "#566a26", "#8a9a3a"], t - 0.06, x, y)
                # seams between canvas panels, spaced in depth
                if abs((math.log(S) * 5.2) % 1.0 - 0.5) > 0.46:
                    col = ramp_pick(["#0c1006", "#1a220c", "#2c3a14"], t * 0.7, x, y)
                c.set(x, y, col)
    # tent ribs: dark frames at increasing nearness, lit on the inside edge
    for S in (1.5, 2.05, 2.8, 3.8, 5.2, 7.2):
        x0, x1 = int(VP[0] - HWD * S), int(VP[0] + HWD * S)
        y0, y1 = int(VP[1] - HT * S), int(VP[1] + HB * S)
        th = 1 + int(S * 0.35)
        c.rect(x0, y0, x1, y0 + th - 1, "#08090a")
        c.rect(x0, y0, x0 + th - 1, y1, "#08090a")
        c.rect(x1 - th + 1, y0, x1, y1, "#08090a")
        c.rect(x0 + th, y0 + th, x1 - th, y0 + th, "#6a7a2a")
        c.rect(x0 + th, y0 + th, x0 + th, y1, "#4a5a20")
    # ---- the doorway: green-gold daylight, a flowering tree beyond, the commissar
    dx0, dx1, dy0, dy1 = VP[0] - HWD, VP[0] + HWD, VP[1] - HT, VP[1] + HB
    for y in range(dy0, dy1 + 1):
        for x in range(dx0, dx1 + 1):
            c.set(x, y, ramp_pick(["#f0f0a0", "#d8e070", "#a8c850", "#7aa838"], (y - dy0) / 26.0 * 0.8 + abs(x - VP[0]) * 0.01, x, y))
    for (tx, ty, r) in [(VP[0] - 3, dy0 + 7, 9), (VP[0] + 8, dy0 + 9, 7), (VP[0] - 10, dy0 + 11, 6)]:      # blossom crowns outside
        c.ellipse(tx, ty, r, int(r * 0.8), "#86a83a")
        for k in range(r * 3):
            c.set(tx + (k * 7) % (2 * r) - r, ty + (k * 5) % (r * 2 - 2) - r + 1, "#f0e8a0" if k % 3 else "#e8a8c0")
    c.rect(dx0, dy1 - 3, dx1, dy1, "#5a8a2a")
    glow(c, VP[0], VP[1] + 2, 44, ["#4a5a20", "#7a8a34", "#b0b650", "#e0e890", "#f8f8c8"], power=1.5, strength=0.6, ry=36)
    shafts(c, (VP[0], VP[1] + 4), 90, 160, 12, 70, "#f0f0a0", t=0.18, seed=e.seed_for("sh"), w0=3, w1=14, power=0.8, floor=104)
    com = fig(19, "stand", "#080a06", facing=1)
    cx, cy = put_figure(c, com, VP[0], dy1 - 1)
    chx, chy = cx + int(com["head"][0]), cy + int(com["head"][1])
    c.rect(chx - 3, chy - 4, chx + 3, chy - 3, "#080a06")                        # peaked cap + its brim
    c.rect(chx - 2, chy - 6, chx + 2, chy - 5, "#080a06")
    c.set(chx, chy - 4, "#d8c050")                                              # a single brass badge
    # ---- cots, set across the aisle with their heads to the wall: sheet, dark frame, a sleeper and the bloom on the chest
    BLOOM = [("#f0e060", "#fff6b0"), ("#e8a0b8", "#fff0f0"), ("#c8e870", "#f8ffd0"), ("#f0a860", "#fff0b0")]
    rr = e.rng("cots")
    cots = []
    for side in (-1, 1):
        for (d1, d2) in [(0.80, 0.68), (0.60, 0.48), (0.42, 0.31), (0.25, 0.17)]:
            if side == 1 and d1 < 0.3:
                continue                                          # the near right stays clear
            cots.append((1.0 / d2, side, 1.0 / d1))
    for (sn, side, sf) in sorted(cots, key=lambda t: t[0]):          # far to near
        Yb = HB - 7.0
        def P(X, Y, S):
            return _proj(VP, HWD, S, side * X, Y)
        # frame / near face
        c.poly([P(.32, Yb, sn), P(1.0, Yb, sn), P(1.0, HB, sn), P(.32, HB, sn)], "#241808")
        c.line([P(.32, Yb, sn), P(.32, HB, sn)], "#4a3418")
        # top: the sheet
        c.poly([P(.32, Yb, sf), P(1.0, Yb, sf), P(1.0, Yb, sn), P(.32, Yb, sn)], "#a4aa84")
        c.line([P(.32, Yb, sn), P(1.0, Yb, sn)], "#e4e8b8")
        sm = 0.5 * (sf + sn)
        # the sleeper: a lump under the sheet from the pillow to the feet
        c.poly([P(.40, Yb - 3.0, sf + (sn - sf) * .2), P(.88, Yb - 3.6, sf + (sn - sf) * .2),
                P(.88, Yb - 3.6, sn - (sn - sf) * .15), P(.40, Yb - 3.0, sn - (sn - sf) * .15)], "#c8cea0")
        c.line([P(.40, Yb - 3.0, sn - (sn - sf) * .15), P(.88, Yb - 3.6, sn - (sn - sf) * .15)], "#7a8460")
        hxp, hyp = P(.80, Yb - 4.6, 0.5 * (sf + sn))
        r = max(1, int(sm * 0.85))
        c.ellipse(hxp, hyp, r, r, "#e0d0a8")
        c.rect(hxp - r, hyp - r, hxp + r, hyp - r + 1, "#a89870")
        c.set(hxp - r // 2, hyp, "#2a2a12")
        c.set(hxp + r // 2, hyp, "#2a2a12")
        if r >= 2:
            c.line([(hxp - r // 2, hyp + r // 2 + 1), (hxp + r // 2, hyp + r // 2 + 1)], "#8a4a3a")            # the smile
        # blooms rising from the chest
        for k in range(4 + int(sm * 1.2)):
            bx, by = P(rr.uniform(.42, .78), Yb - 3.4, sf + (sn - sf) * rr.uniform(.2, .85))
            col, heart = rr.choice(BLOOM)
            _bloom(c, int(bx), int(by - 2 - sm * 0.8), 1 if sm < 2 else 2, col, heart, stem="#4a7a24", stem_len=2 + int(sm * 0.9))
    # vines and hanging blooms from the roof
    rv = e.rng("vines")
    for _ in range(26):
        S = rv.uniform(1.3, 6.0)
        X = rv.uniform(-0.9, 0.9)
        x, y0 = _proj(VP, HWD, S, X, -HT)
        ln = int(rv.uniform(4, 16) * (0.4 + S * 0.15))
        x = int(x)
        for k in range(ln):
            c.set(x + (1 if k % 5 == 3 else 0), int(y0) + k, "#3e5a1c" if k % 2 else "#6c8a2a")
        col, heart = rv.choice(BLOOM)
        _bloom(c, x, int(y0) + ln, 1 if S < 3 else 2, col, heart)
    # flies in the light: dark specks with a pale halo
    rf = e.rng("flies")
    for _ in range(46):
        fx, fy = int(rf.gauss(VP[0], 30)), int(rf.gauss(VP[1] + 6, 16))
        c.set(fx, fy, "#0a0c06")
        if rf.random() < 0.5:
            c.set(fx + 1, fy - 1, "#d8e090")
    # ---- foreground left: the gardener, a dark silhouette with a watering can and a trowel
    pf = player_fig("imperium", 58, "carry", facing=1)
    pf["img"] = tint(pf["img"], "#0a0c06", 0.62)
    px0, py0 = put_figure(c, pf, 30, 108, rim_col="#7a9a2a", toward=(1, 0),
                          shadow=dict(toward_light=(1, 0.3), length=0.6, squash=0.2, col="#050603", t=0.7))
    hx_, hy_ = pf["hands"][0]
    kx, ky = px0 + int(hx_) + 1, py0 + int(hy_) + 1
    c.rect(kx, ky - 3, kx + 6, ky + 3, "#2a3a1a")                  # can body
    c.rect(kx, ky - 3, kx + 6, ky - 3, "#c8d850")
    c.line([(kx + 6, ky - 1), (kx + 12, ky - 5)], "#2a3a1a", 1)    # spout
    c.set(kx + 12, ky - 5, "#c8d850")
    for k in range(3):                                             # water drops
        c.set(kx + 12 + k, ky - 3 + k * 2, "#b8e0e0")
    fhx, fhy = px0 + int(pf["head"][0]), py0 + int(pf["head"][1])
    c.set(fhx + 4, fhy, "#c8c890")                                 # a face in profile, smiling
    c.set(fhx + 4, fhy + 1, "#c8c890")
    c.set(fhx + 3, fhy + 2, "#8a8a5a")
    # foreground weeds / blooms along the bottom edge
    for x in range(0, 192, 6):
        y = 104 + (x * 7) % 5
        for k in range(3 + (x * 3) % 5):
            c.set(x, y - k, "#1a2a0c")
        if (x // 6) % 3 == 0:
            col, heart = BLOOM[(x // 6) % 4]
            _bloom(c, x, y - 4 - (x * 3) % 5, 1, col, heart)
    e.protect += ["#fff6b0", "#d8e090"]
    vignette_kind(c, "bad", col="#050603", strength=0.75)


def _hollow(c, f, x, y, edge, inner, inner_t=0.55, anchor="feet"):
    """draw a figure() as an outline only: its interior keeps (and slightly dims) whatever is behind it - a hollow man.
    (x, y) = feet position; edge = outline colour; inner = colour the interior is dimmed toward."""
    img = f["img"]
    ax, ay = f["feet"] if anchor == "feet" else f["head"]
    px, py = int(round(x - ax)), int(round(y - ay))
    a = img.load()

    def solid(i, j):
        return 0 <= i < img.width and 0 <= j < img.height and a[i, j][3] >= 128
    for j in range(img.height):
        for i in range(img.width):
            if not solid(i, j):
                continue
            edge_px = not (solid(i - 1, j) and solid(i + 1, j) and solid(i, j - 1) and solid(i, j + 1))
            if edge_px:
                c.set(px + i, py + j, edge)
            else:
                blend(c, px + i, py + j, inner, inner_t, 3)
    return (px, py)


@ending("imp_end_claim_slaanesh")
def imp_end_claim_slaanesh(e):
    """BAD / Slaanesh.  After the Applause: from behind a roaring crowd, a lone medalled figure on a dais under a shaft
    of silver light from the rose window - drawn as an outline only, a hollow man who casts no shadow.  Petals fall.
    Magenta + silver (GOD['slaanesh']); the bright mass is the rose window upper left and the lit dais on the right."""
    c = e.c
    G = GOD["slaanesh"]["ramp"]
    HZ = 64
    sky(c, ["#07030e", "#10061a", "#240a38", "#3a1058", "#5a1c78", "#7a2a9a"], 0, HZ)
    # nave: far wall with the rose window upper left
    RX, RY, RR = 52, 28, 24
    glow(c, RX, RY, 62, ["#1a0a2c", "#3a1058", "#7a2a9a", "#b848b8", "#ff8ad8", "#fff0fa"], power=1.6, strength=0.85, ry=50)
    for y in range(RY - RR - 2, RY + RR + 3):
        for x in range(RX - RR - 2, RX + RR + 3):
            d = math.hypot(x - RX, y - RY)
            if d <= RR:
                ang = math.atan2(y - RY, x - RX)
                spoke = abs(((ang * 6 / math.pi) % 1.0) - 0.5)
                ring = (d % 8.0) / 8.0
                if spoke > 0.45 or d < 3 or abs(ring - 0.5) > 0.44:
                    c.set(x, y, "#14081e")                       # tracery
                else:
                    k = int(ang * 6 / math.pi + 20) % 4
                    c.set(x, y, ramp_pick([["#ff8ad8", "#ffe0f6"], ["#c850c8", "#ff8ad8"], ["#e8e8f8", "#ffffff"], ["#7a2a9a", "#c850c8"]][k],
                                          1 - d / RR * 0.9, x, y))
            elif d <= RR + 2:
                c.set(x, y, "#14081e")
    # pointed arches / columns receding
    for (cx, w, top, col) in [(10, 12, 12, "#0a0412"), (120, 5, 22, "#1a0a2c"), (146, 6, 18, "#14081e"), (176, 14, 8, "#0a0412")]:
        c.rect(cx - w // 2, top, cx + w // 2, HZ + 4, col)
        c.rect(cx - w // 2, top, cx - w // 2, HZ + 4, "#5a2a78")
        for k in range(w):
            c.set(cx - w // 2 + k, top - (k if k < w // 2 else w - k) // 1, col)
    # floor of polished stone catching the window
    hband(c, HZ + 1, 107, ["#6a3a88", "#4a2468", "#2a0e40", "#10061a"], seed=e.seed_for("fl"), rough=0.2)
    light_pool(c, RX + 40, HZ + 14, 80, 9, "#ff8ad8", t=0.45)
    # shaft of silver light from the rose window to the dais
    shafts(c, (RX + 12, RY + 6), 28, 18, 7, 100, "#f4eaff", t=0.3, seed=e.seed_for("sh"), w0=5, w1=20, power=0.6)
    # dais: three low steps, lit
    DX = 136
    for k, (x0, x1) in enumerate([(92, 182), (100, 174), (110, 164)]):
        y = HZ + 2 + k * 3
        c.rect(x0, y, x1, y + 2, ramp_pick(["#c8b0d8", "#9a78b8", "#6a4a8a"], 0.15 + k * 0.3, k, k))
        c.rect(x0, y, x1, y, "#f4eaff")
    c.rect(110, HZ - 1, 164, HZ + 1, "#e8d8f4")
    light_pool(c, DX, HZ + 1, 44, 7, "#fff0fa", t=0.6)
    # the hollow man: medals on the chest, no shadow
    hf = player_fig("imperium", 52, "stand", facing=-1)
    hpx, hpy = _hollow(c, hf, DX, HZ, "#e8e8f8", "#240a38", 0.5)
    mx, my = hpx + int(hf["head"][0]) - 4, hpy + int(hf["head"][1]) + 12
    for k in range(4):
        c.set(mx + k * 2, my + (k % 2), "#fff0a0" if k % 2 else "#ff8ad8")
    e.protect += ["#fff0a0"]
    # ---- the crowd, from behind: three rows of raised arms, rim-lit magenta from the window
    rows = [(88, 17, 22, 0, 0), (97, 22, 20, 0, 0), (107, 30, 15, 0, 0)]
    for (yy, h, n, hmin, _) in rows:
        rr = e.rng("row%d" % yy)
        xs = sorted(rr.uniform(-4, 195) for _ in range(n))
        for x in xs:
            hh = int(h * rr.uniform(0.85, 1.1))
            f = fig(hh, "arms_up", "#0e0618" if yy > 100 else "#14081e", facing=1)
            put_figure(c, f, x, yy + rr.randint(-1, 1), rim_col="#8a2a9a" if yy < 100 else "#a83ab0", toward=(-1, -1))
    # petals / glitter falling through the light
    particles(c, "petal", 54, (0, 4, 191, 98), seed=e.seed_for("pet"), cols=("#ff8ad8", "#ffc0ec", "#e8e8f8", "#c850c8"))
    particles(c, "star", 26, (60, 20, 180, 80), seed=e.seed_for("gl"), cols=("#ffffff", "#f4eaff"))
    vignette_kind(c, "bad", col="#07030e", strength=0.6)


def _pawn(c, x, y, s, body, trim, hi):
    """a little game piece standing at (x, y) (its base), s = size 1..4."""
    r = max(1, int(1 + s * 0.9))
    c.rect(x - r - 1, y - 1, x + r + 1, y, trim)                       # base
    c.rect(x - r, y - 1 - int(s * 2.2), x + r, y - 2, body)            # body
    c.rect(x - r, y - 1 - int(s * 2.2), x - r, y - 2, hi)
    hr = max(1, int(s * 0.9))
    c.ellipse(x, y - 2 - int(s * 2.2) - hr, hr, hr, body)
    c.set(x - hr + 1, y - 2 - int(s * 2.2) - hr, hi)
    c.rect(x - r, y - 1 - int(s * 1.2), x + r, y - 1 - int(s * 1.2), trim)         # collar / band


@ending("imp_end_claim_tzeentch")
def imp_end_claim_tzeentch(e):
    """BAD / Tzeentch.  A Clever Move: a war map on the table, one bold line drawn across it that a column of toy soldiers
    follows - each on a bright thread rising out of the frame - to a crescent of dark pieces waiting at its end.  The pen
    is held by an arm reaching out of a tall mirror: the figure in the glass drew it.  Blue / pink-violet (GOD['tzeentch'])."""
    c = e.c
    G = GOD["tzeentch"]["ramp"]
    sky(c, ["#04020a", "#080822", "#0c0c38", "#10104a"], 0, 70)
    for x in range(0, 192, 24):                                       # study wall: dark panelling
        c.rect(x, 0, x, 70, "#0c0c34")
    # ---- the table: perspective trapezoid, the map on it
    TOP, BOT = 64, 107
    def tx(x, y):        # perspective helper: screen x for a map coordinate row
        return x
    ten = e.noise("paper")
    for y in range(TOP, BOT + 1):
        k = (y - TOP) / float(BOT - TOP)
        xl, xr = int(14 - k * 40), int(178 + k * 40)
        for x in range(max(0, xl), min(192, xr + 1)):
            t = 0.55 - k * 0.25 + (ten.fbm(x * 0.08, y * 0.16) - 0.5) * 0.35
            c.set(x, y, ramp_pick(["#08102c", "#101e48", "#1c3a72", "#3a5ca0"], t, x, y))
    # map grid: rows with perspective spacing and columns converging
    for k in range(9):
        y = int(TOP + (BOT - TOP) * (k / 8.0) ** 1.35)
        c.line([(int(14 - (y - TOP) / (BOT - TOP) * 40), y), (int(178 + (y - TOP) / (BOT - TOP) * 40), y)], "#1e4490")
    for k in range(-1, 12):
        x_far = 14 + k * 16.5
        x_near = (x_far - 96) * 1.55 + 96
        c.line([(x_far, TOP), (x_near, BOT)], "#1e4490")
    c.rect(0, TOP - 1, 191, TOP - 1, "#5a7ac8")                        # far table edge catches the light
    c.rect(0, TOP, 191, TOP, "#2e4a90")
    # contour scribbles (a battlefield: hills, a river)
    rv = e.rng("map")
    for _ in range(9):
        cx, cy = rv.randint(30, 170), rv.randint(TOP + 4, BOT - 4)
        rw = rv.randint(5, 12)
        k = (cy - TOP) / float(BOT - TOP)
        c.line([(cx - rw, cy), (cx - rw // 2, cy - 2), (cx + rw // 2, cy - 2), (cx + rw, cy)], "#3a64b0")
    light_pool(c, 60, 86, 52, 14, "#2ab8ff", t=0.22)             # blue light spilling from the glass onto the table
    # ---- the line: bold magenta, tapering with distance, glowing; the plan the regiment will follow
    PL = [(46, 100), (62, 92), (88, 90), (110, 80), (132, 78), (152, 72)]
    for i in range(len(PL) - 1):
        (x0, y0), (x1, y1) = PL[i], PL[i + 1]
        w0, w1 = 1 + (y0 - TOP) / 18.0, 1 + (y1 - TOP) / 18.0
        _wedge_line(c, (x0, y0), (x1, y1), w1 + 2, w0 + 2, "#8a1a78")
        _wedge_line(c, (x0, y0), (x1, y1), w1, w0, "#e83aa8")
        _wedge_line(c, (x0, y0 - 1), (x1, y1 - 1), max(1, w1 - 2), max(1, w0 - 2), "#ffa8e0")
    # ---- threads: every piece hangs from one, all converging up and out of the frame
    pieces = [(76, 91, 3.2), (90, 90, 3.0), (102, 85, 2.6), (116, 80, 2.3), (128, 79, 2.0), (140, 76, 1.7)]
    for (px_, py_, s_) in pieces:
        top = py_ - 3 - int(s_ * 2.2) - 2 * int(s_ * 0.9)
        tx_, ty_ = 118 + (px_ - 100) * 0.25, -6
        n = 90
        for k in range(n):
            t = k / float(n)
            x, y = int(px_ + (tx_ - px_) * t), int(top + (ty_ - top) * t)
            blend(c, x, y, "#9af6ff", 0.85 - t * 0.5, 3)
    # the player is the first piece: bigger, coat blue with the brass band
    _pawn(c, 62, 94, 4.6, "#3a6ac8", "#d8b060", "#9ac0ff")
    top = 94 - 3 - int(4.6 * 2.2) - 2 * int(4.6 * 0.9)
    for k in range(92):
        t = k / 92.0
        blend(c, int(62 + (118 - 62 - 0) * t * 0.9 + 0), int(top + (-6 - top) * t), "#ffffff", 0.9 - t * 0.5, 3)
    for (px_, py_, s_) in pieces:
        _pawn(c, px_, py_, s_, "#2a5ad8", "#d8b060", "#9ac0ff")
    # ---- the ambush: a crescent of dark spiked pieces with red eyes at the line's end
    glow(c, 164, 74, 20, ["#2a0a22", "#5a1030", "#9a1a3a"], power=1.5, strength=0.6, ry=13)
    for k, (ax, ay) in enumerate([(156, 65), (162, 67), (166, 71), (167, 76), (164, 81), (158, 84), (170, 68)]):
        sc = 1.5 + (ay - TOP) / 18.0
        hgt = int(sc * 3.2)
        c.poly([(ax - 2, ay), (ax + 2, ay), (ax, ay - hgt)], "#0a0618")
        c.set(ax - 1, ay - hgt // 2, "#ff3a4a")
        c.set(ax + 1, ay - hgt // 2, "#ff3a4a")
    # ---- the mirror: a tall arched glass, silver frame, the figure inside drawing with the pen
    MX, MY0, MY1, MW = 46, 6, 72, 34
    def in_glass(x, y, pad=0):
        r = MW + pad
        if y < MY0 + MW:
            return (x - MX) ** 2 + (y - (MY0 + MW)) ** 2 <= r * r
        return abs(x - MX) <= r and y <= MY1 + pad
    for y in range(0, 80):
        for x in range(0, 100):
            if in_glass(x, y, 4) and not in_glass(x, y, 0):
                ft = clamp(((x - MX) * -0.5 + (y - 40) * -0.5) / 40.0 + 0.5)
                c.set(x, y, ramp_pick(["#141e58", "#3a4a98", "#8a9ad8", "#d8e0f8"], ft * 0.8, x, y))
            elif in_glass(x, y):
                t = clamp(0.30 + (y - 30) * 0.004 + (x - MX) * -0.006)
                c.set(x, y, ramp_pick(["#0a2a8a", "#1a5ad8", "#2ab8ff", "#9af6ff"], t + 0.12, x, y))
    for (gx, gy) in [(MX, MY0 - 4), (MX - 26, MY0 + 12), (MX + 26, MY0 + 12), (MX - 36, 50), (MX + 36, 50)]:       # pink gems in the frame
        c.rect(gx - 1, gy - 1, gx + 1, gy + 1, "#e83aa8")
        c.set(gx - 1, gy - 1, "#ffc8f0")
    # the figure in the glass: dark blue bust against the bright glass, pink grin, bright eyes
    ff = figure(60, "stand", "#0a1e7a", facing=1)
    fpx, fpy = place(c, ff["img"], MX - 2, 74, anchor="bm")
    for y in range(c.h):                                              # clip the bust to the glass again
        pass
    hx_, hy_ = fpx + int(ff["head"][0]), fpy + int(ff["head"][1])
    c.rect(hx_ - 3, hy_ - 1, hx_ - 2, hy_, "#ff8ad8")                  # eyes
    c.rect(hx_ + 1, hy_ - 1, hx_ + 2, hy_, "#ff8ad8")
    c.line([(hx_ - 3, hy_ + 3), (hx_ - 1, hy_ + 4), (hx_ + 1, hy_ + 4), (hx_ + 3, hy_ + 3)], "#e83aa8")        # grin
    # its arm reaches out of the glass to the pen at the start of the line
    sx0, sy0 = hx_ + 9, hy_ + 13
    arm = [(sx0, sy0), (sx0 + 2, sy0 + 18), (46, 73), (42, 88), (40, 96)]
    c.line(arm[:3], "#0a1e7a", 4)
    c.line([(46, 73), (42, 88), (40, 96)], "#5ab8f0", 4)                # the arm is glass-bright once it is out of the mirror
    c.line([(47, 73), (43, 88), (41, 95)], "#cfeaff", 1)
    c.line([(43, 73), (39, 88)], "#2a6ad8", 1)
    c.rect(37, 95, 43, 99, "#cfeaff")                                  # the hand
    c.line([(42, 98), (46, 101)], "#ffffff", 1)                          # the pen, tip on the line's start
    c.set(46, 101, "#ffc8f0")
    glow(c, 45, 101, 5, ["#8a1a78", "#e83aa8", "#ffc8f0"], power=1.4, strength=0.8)
    particles(c, "mote", 30, (0, 0, 191, 100), seed=e.seed_for("mo"), cols=("#9af6ff", "#ff8ad8", "#ffffff"))
    e.protect += ["#ffa8e0", "#ffc8f0", "#ff3a4a"]
    vignette_kind(c, "bad", col="#05030c", strength=0.55)


def _sandbags(c, x0, y0, x1, y1, seed, cols, bw=11, bh=6):
    """rows of sandbags, staggered; cols = dark..light"""
    rnd = random.Random(seed)
    row = 0
    y = y0
    while y < y1:
        off = (row % 2) * (bw // 2)
        x = x0 - off
        while x < x1:
            w = bw + rnd.randint(-1, 2)
            t = rnd.uniform(0.25, 0.7)
            body = ramp_pick(cols, t, x, y, 1.0)
            c.rect(x + 1, y + 1, x + w - 1, y + bh - 1, body)
            c.rect(x + 1, y, x + w - 2, y, cols[min(len(cols) - 1, 2)])           # lit top edge
            c.rect(x, y + 1, x, y + bh - 1, cols[0])                               # seams
            c.rect(x + 1, y + bh, x + w - 1, y + bh, cols[0])
            x += w
        y += bh
        row += 1


@ending("imp_end_commissar")
def imp_end_commissar(e):
    """BAD.  The Commissar's Bullet: dawn in the trench; the commissar, back to us in his long coat and peaked cap,
    pistol still level, a thread of smoke going up; at his feet a body under a grey greatcoat, two boots showing; the
    squad on the parapet keep their faces to no-man's-land; a deacon far off already holds the list.  Cold grey-blue."""
    c = e.c
    HZ = 46
    sky(c, ["#161c28", "#26303e", "#44546a", "#7a8aa0", "#b0bccb", "#d8dee4"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#2a3444", "#4a586c", "#7a8898"], 0, 36, scale=0.05, thresh=0.52, stretch=5.0)
    glow(c, 118, HZ + 2, 80, ["#3a4658", "#5e6e84", "#92a2b4", "#c8d2dc", "#eef2f4"], power=1.5, strength=0.9, ry=30)
    # far plain: wire, stakes, a ruined tower in mist
    ridge(c, HZ + 4, 1, 4, "#3a4452", seed=e.seed_for("rd"), scale=0.04)
    for x in range(8, 192, 17):
        c.rect(x, HZ - 6, x, HZ + 3, "#262e3a")
        c.rect(x - 1, HZ - 7, x + 1, HZ - 7, "#262e3a")
    c.line([(4, HZ - 3), (191, HZ - 4)], "#2e3846")
    c.line([(4, HZ), (191, HZ - 1)], "#2e3846")
    haze(c, HZ - 12, HZ + 8, "#c8d2dc", t=0.55, seed=e.seed_for("hz"), profile="mid")
    # ---- parapet of sandbags across the picture
    SB = ["#1e1c1a", "#3a3630", "#5e584c", "#8a8472"]
    c.rect(0, HZ + 5, 191, 107, "#201e1c")
    _sandbags(c, 0, HZ + 5, 192, HZ + 30, e.seed_for("sb"), SB)
    haze(c, HZ + 4, HZ + 24, "#7a8aa0", t=0.35, seed=e.seed_for("hz2"), profile="top")
    # trench floor: wet mud and duckboards in perspective
    hband(c, HZ + 31, 107, ["#403c38", "#2e2b28", "#1c1a18", "#100f0e"], seed=e.seed_for("fl"), rough=0.3)
    for k in range(9):
        y = int(HZ + 33 + (k / 8.0) ** 1.5 * 56)
        c.rect(0, y, 191, y, "#12110f")
        c.rect(0, y + 1, 191, y + 1, "#5a5448" if k % 2 == 0 else "#46423a")
    c.rect(0, HZ + 31, 191, HZ + 31, "#0c0b0a")
    light_pool(c, 130, 80, 70, 10, "#b0bccb", t=0.25)
    # ---- the squad on the parapet: helmets and shoulders, backs to us
    for (x, y, h) in [(98, HZ + 22, 22), (118, HZ + 21, 21), (142, HZ + 23, 24), (164, HZ + 22, 22)]:
        f = fig(h, "hunch", "#12141a", facing=1)
        put_figure(c, f, x, y, rim_col="#9aa6b6", toward=(0, -1))
        hx_, hy_ = x - int(f["feet"][0]) + int(f["head"][0]), y - int(f["feet"][1]) + int(f["head"][1])
        _helmet(c, hx_, hy_ - 1, 3, "#1a1c22", "#7a8696", "#0c0e12")
    # ---- the deacon, small, far right, the list hanging to the floor
    dfig = fig(30, "carry", "#0a0b10", robe=0.8, facing=-1)
    dx_, dy_ = put_figure(c, dfig, 181, 90, rim_col="#9aa6b6", toward=(-1, -1))
    c.rect(dx_ + 2, dy_ + 14, dx_ + 6, dy_ + 28, "#d8d8cc")
    c.rect(dx_ + 2, dy_ + 14, dx_ + 2, dy_ + 28, "#fffff0")
    for k in range(5):
        c.rect(dx_ + 3, dy_ + 17 + k * 2, dx_ + 5, dy_ + 17 + k * 2, "#6a6a62")
    # ---- the body under the greatcoat, boots toward us
    bx, by = 124, 99
    c.poly([(bx, by), (bx + 10, by - 6), (bx + 50, by - 11), (bx + 52, by - 5), (bx + 12, by + 2)], "#3e444c")
    c.poly([(bx + 10, by - 6), (bx + 50, by - 11), (bx + 51, by - 9), (bx + 11, by - 4)], "#7a8694")          # lit fold along the top
    for k in range(5):                                                                                       # folds
        c.line([(bx + 14 + k * 8, by - 3 - k * 1), (bx + 18 + k * 8, by - 7 - k * 1)], "#2a2e34")
    c.rect(bx - 3, by - 1, bx + 3, by + 3, "#0a0a0c")                                                         # boots
    c.rect(bx + 4, by - 3, bx + 9, by + 1, "#0a0a0c")
    c.rect(bx - 3, by + 3, bx + 3, by + 3, "#5a5a5a")
    c.rect(bx + 4, by + 1, bx + 9, by + 1, "#5a5a5a")
    c.rect(bx - 3, by - 1, bx - 3, by + 2, "#6a7a8a")
    # a dropped rifle along the near edge
    c.line([(88, 104), (160, 97)], "#14120f", 2)
    c.line([(88, 103), (160, 96)], "#5a5448")
    # ---- the commissar: long coat, peaked cap, arm out, pistol level, a thread of smoke
    cf = fig(62, "reach", "#0a0c12", robe=0.9, facing=1)
    cx_, cy_ = put_figure(c, cf, 56, 106, rim_col="#c8d2dc", toward=(1, -1),
                          shadow=dict(toward_light=(0.5, 1.0), length=0.9, squash=0.4, col="#05060a", t=0.7))
    hx_, hy_ = cx_ + int(cf["head"][0]), cy_ + int(cf["head"][1])
    c.rect(hx_ - 4, hy_ - 7, hx_ + 4, hy_ - 4, "#0a0c12")                     # cap
    c.rect(hx_ - 5, hy_ - 4, hx_ + 6, hy_ - 4, "#0a0c12")
    c.rect(hx_ - 4, hy_ - 7, hx_ + 4, hy_ - 7, "#7a8696")
    c.set(hx_ + 1, hy_ - 5, "#c8a850")                                          # a single brass badge
    c.rect(hx_ - 5, hy_ - 3, hx_ + 5, hy_ + 1, "#0a0c12")
    ph = cf["hands"][0]
    gx, gy = cx_ + int(ph[0]), cy_ + int(ph[1])
    c.rect(gx, gy - 2, gx + 8, gy, "#0a0c12")                                  # pistol
    c.rect(gx + 6, gy - 3, gx + 9, gy - 3, "#7a8696")
    c.set(gx + 9, gy - 2, "#c8d2dc")
    for k in range(18):                                                         # smoke
        sx = gx + 9 + int(math.sin(k * 0.55) * 2.2 + k * 0.15)
        blend(c, sx, gy - 3 - k, "#dfe6ea", 0.85 - k * 0.04, 3)
        blend(c, sx + 1, gy - 3 - k, "#dfe6ea", 0.5 - k * 0.025, 3)
    # frost / ash drifting
    particles(c, "ash", 36, (0, 0, 191, 100), seed=e.seed_for("ash"), cols=("#9aa6b6", "#c8d2dc", "#6a7686"))
    vignette_kind(c, "bad", col="#05060a", strength=0.7)
