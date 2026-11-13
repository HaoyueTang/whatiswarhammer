"""SPEC §31 ending illustrations — Necron route (nec_*).  See endkit.py for the helper conventions."""
import math
import random
from reg import ending
from endkit import *


@ending("nec_end_truth")
def nec_end_truth(e):
    """GOOD.  The Living Copy: through a shuttle's viewport the sun clears the limb of the world while the purge
    fire blooms over the desert below; in profile in the foreground, the one who got out holds the report to
    their chest.  Gold from the left, orange from the right, a dark warm cabin around it."""
    c = e.c
    WX0, WX1, WY0, WY1, RAD = 20, 172, 7, 81, 16

    def in_win(x, y):
        if not (WX0 <= x <= WX1 and WY0 <= y <= WY1):
            return False
        dx = max(WX0 + RAD - x, x - (WX1 - RAD), 0)
        dy = max(WY0 + RAD - y, y - (WY1 - RAD), 0)
        return dx * dx + dy * dy <= RAD * RAD

    # --- what is outside: space, a golden sunrise at the limb, the planet, the fire
    CX, CY, R = 96, 255, 212
    sunx = 34
    sn, dn = e.noise("surf"), e.noise("dunes")
    for y in range(WY0 - 2, WY1 + 3):
        for x in range(WX0 - 2, WX1 + 3):
            limb = CY - math.sqrt(max(0.0, R * R - (x - CX) ** 2))
            if y < limb:
                d = limb - y                                       # height above the limb
                sun_k = clamp(1.0 - abs(x - sunx) / 130.0)
                atm = clamp(1.0 - d / (7.0 + 14 * sun_k))
                t = clamp(atm * (0.55 + 0.5 * sun_k) + (0.0 if atm > 0 else 0))
                if atm > 0:
                    c.set(x, y, ramp_pick(["#060a1e", "#0c2a5a", "#2a6ab0", "#7ac8e8", "#d8f4f0", "#fff4c8"], t, x, y))
                else:
                    sky_t = clamp((y - 0) / 60.0)
                    c.set(x, y, ramp_pick(["#02030c", "#050a1c", "#08102a"], sky_t, x, y))
            else:
                d = y - limb                                       # depth below the limb
                lit = clamp(1.05 - (x - 10) / 190.0 * 0.5 - max(0, d - 20) * 0.003)
                v = sn.fbm(x * 0.05, y * 0.15, 4) * 0.5 + dn.fbm(x * 0.03 + y * 0.01, y * 0.3, 3) * 0.5
                t = clamp(lit * 0.75 + (v - 0.5) * 0.55 - clamp((d - 14) / 25.0) * 0.08)
                c.set(x, y, ramp_pick(["#1a0e0c", "#3a1e14", "#6e3c20", "#b0703c", "#e0a860", "#f6d89a"], t, x, y))
    stars(c, e.seed_for("st"), 120, WY0, 52, cols=("#6a7aa8", "#c8d8f0", "#ffffff"),
          mask=lambda x, y: in_win(x, y) and y < CY - math.sqrt(max(0.0, R * R - (x - CX) ** 2)) - 9)
    # the sun clearing the limb: flare, lens streak
    glow(c, sunx, 49, 34, ["#2a6ab0", "#7ac8e8", "#ffe8b0", "#fff8e0"], power=1.5, strength=1.0, ry=22)
    c.ellipse(sunx, 49, 3, 3, "#ffffff")
    c.rect(sunx - 30, 49, sunx + 38, 49, "#fff4c8")
    c.rect(sunx - 18, 48, sunx + 22, 48, "#ffe0a0")
    c.rect(sunx - 14, 50, sunx + 18, 50, "#ffe0a0")
    # purge fire: a bloom on the desert, ash ring, tongues, secondary fires, the tomb's faint green heart
    bx, by = 124, 68
    def ell(cx, cy, rx, ry, col):
        for yy in range(int(cy - ry), int(cy + ry) + 1):
            for xx in range(int(cx - rx), int(cx + rx) + 1):
                if ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2 <= 1 and in_win(xx, yy):
                    c.set(xx, yy, col)
    glow(c, bx, by, 38, ["#4a1e10", "#8a3416", "#d8601e"], power=1.3, strength=0.9, ry=13)
    ell(bx, by, 29, 8.5, "#2a1410")
    ell(bx, by, 24, 7, "#5a2a14")
    ell(bx, by, 18, 5.4, "#c8481a")
    ell(bx, by, 12, 3.8, "#ff8a2a")
    ell(bx, by, 6, 2.2, "#ffd060")
    c.set(bx, by, "#c8ffd8"); c.set(bx + 1, by, "#ffffff")
    rr = e.rng("fire")
    for k in range(22):
        a = k / 22.0 * 2 * math.pi + rr.uniform(-0.1, 0.1)
        L1 = rr.uniform(16, 30)
        x2, y2 = bx + math.cos(a) * L1, by + math.sin(a) * L1 * 0.3
        c.line([(bx + math.cos(a) * 8, by + math.sin(a) * 2.4), (x2, y2)], "#ff8a2a" if k % 2 else "#ffd060")
    for (fx, fy, fr) in [(88, 63, 3), (100, 76, 2), (150, 72, 3), (160, 64, 2), (138, 79, 2)]:
        glow(c, fx, fy, fr * 2 + 3, ["#6a2a14", "#e0701e", "#ffd060"], power=1.2, strength=0.95, ry=fr)
    for k in range(30):                                       # embers rising toward the camera
        c.set(bx + rr.randint(-34, 34), by - rr.randint(2, 14), "#ffb040")
    # --- the cabin: bevelled frame, wall plates, seat, console
    CAB = ["#0c101c", "#161c2c", "#202a40", "#2c384e"]
    for y in range(108):
        for x in range(192):
            if in_win(x, y):
                continue
            # distance to the window = frame thickness (cheap test by probing)
            near = any(in_win(x + dx, y + dy) for dx in (-6, -3, 0, 3, 6) for dy in (-6, -3, 0, 3, 6))
            near2 = any(in_win(x + dx, y + dy) for dx in (-2, 0, 2) for dy in (-2, 0, 2))
            if near2:
                c.set(x, y, "#3a4660" if (x + y) % 2 else "#2e384e")
            elif near:
                c.set(x, y, "#1e2638")
            else:
                t = 0.25 + 0.4 * ((y // 9 + x // 27) % 2) * 0.4 + (0.12 if (y % 9 == 0 or x % 27 == 0) else 0)
                c.set(x, y, ramp_pick(CAB, t, x, y))
    for (rx_, ry_) in [(10, 14), (10, 74), (182, 14), (182, 74), (96, 3), (60, 100), (150, 100)]:
        c.set(rx_, ry_, "#4a5670"); c.set(rx_ + 1, ry_, "#10141e")
    # window light spilling on the frame / cabin floor
    light_pool(c, 70, 92, 70, 14, "#ffc880", t=0.18)
    light_pool(c, 140, 92, 50, 12, "#ff8a3a", t=0.16)
    # console strip along the bottom, small status lights
    c.rect(0, 94, 191, 107, "#0a0d14")
    c.rect(0, 94, 191, 94, "#2a3450")
    rr2 = e.rng("lights")
    for x in range(8, 184, 6):
        if rr2.random() < 0.7:
            c.set(x, 98 + rr2.randint(0, 2), rr2.choice(["#2ee8c8", "#ffb040", "#2ee8c8", "#ff5a3a"]))
    # seat back and the passenger (profile, facing the window), the report held to the chest
    for yy in range(66, 108):
        for xx in range(18, 70):
            if ((xx - 44) / 25.0) ** 2 + ((yy - 108) / 44.0) ** 2 < 1.0 or (xx > 20 and yy > 84):
                c.set(xx, yy, ramp_pick(["#0a0c14", "#14182a", "#222a40"], 0.8 - (xx - 18) / 60.0, xx, yy))
    me = player_fig("necrons", 46, "sit", facing=1)
    img = tint(me["img"], "#0a0c14", 0.5)
    img = rim(img, "#ffd890", (-1, -1))
    img = rim(img, "#ff8a3a", (1, 0))
    mx, my = place(c, img, 50, 102, anchor="bm")
    hx_, hy_ = me["hands"][0]
    pxx, pyy = mx + int(hx_), my + int(hy_)
    c.rect(pxx - 2, pyy - 6, pxx + 5, pyy + 1, "#e8dcc0")                  # the report
    c.rect(pxx - 2, pyy - 6, pxx + 5, pyy - 6, "#ffffff")
    c.rect(pxx + 5, pyy - 6, pxx + 5, pyy + 1, "#b8a888")
    for k in (-4, -2, 0):
        c.rect(pxx - 1, pyy + k, pxx + 3, pyy + k, "#8a7a5a")
    particles(c, "mote", 18, (14, 10, 176, 90), seed=e.seed_for("mote"), cols=("#ffe8b0", "#fff6d8"))
    vignette_kind(c, "good", col="#06080e", strength=0.3)


# =====================================================================================================
#  private helpers (leading underscore; see report)
# =====================================================================================================

def _glyph(c, gx, gy, rr, col, h=5):
    """one abstract necron glyph: a vertical stroke with side ticks, a dot or a small box -- circuit-like, never a letter."""
    kind = rr.randrange(5)
    if kind == 0:                                           # stem with two ticks
        c.rect(gx + 1, gy, gx + 1, gy + h - 1, col)
        c.set(gx, gy + rr.randrange(1, h - 1), col)
        c.set(gx + 2, gy + rr.randrange(1, h - 1), col)
    elif kind == 1:                                         # eye: a box with a pupil
        c.rect(gx, gy + 1, gx + 2, gy + 1, col)
        c.rect(gx, gy + 3, gx + 2, gy + 3, col)
        c.set(gx + 1, gy + 2, col)
    elif kind == 2:                                         # dot over a bar
        c.set(gx + 1, gy, col)
        c.rect(gx, gy + 2, gx + 2, gy + 2, col)
        c.set(gx + 1, gy + 4, col)
    elif kind == 3:                                         # two stems of different lengths
        c.rect(gx, gy, gx, gy + h - 1, col)
        c.rect(gx + 2, gy + 1, gx + 2, gy + 2, col)
        c.set(gx + 1, gy + 4, col)
    else:                                                   # a hook
        c.rect(gx, gy, gx + 1, gy, col)
        c.rect(gx + 2, gy, gx + 2, gy + 3, col)
        c.set(gx, gy + 4, col)


def _glyph_marks(c, x0, y, n, col, seed, step=4, h=5, w=3, p=0.55, vertical=False):
    """a row (or column) of tiny abstract glyphs."""
    rr = random.Random(seed)
    for i in range(n):
        gx, gy = (x0, y + i * (h + 2)) if vertical else (x0 + i * step, y)
        _glyph(c, gx, gy, rr, col, h)


def _glyph_wall(c, x0, y0, x1, y1, cols, seed, cw=4, rh=7, p=0.55, fade=None):
    """a glyph wall: rows of abstract glyphs over the rectangle; cols = list of colours picked per row."""
    rr = random.Random(seed)
    y = y0
    while y + 5 <= y1:
        n = (x1 - x0) // cw
        col = cols[rr.randrange(len(cols))]
        for i in range(n):
            if rr.random() < 0.25:
                continue
            _glyph(c, x0 + i * cw, y, rr, col)
        y += rh


def _pyramid(c, cx, by, hw, h, lit="#46564e", dark="#121c18", edge="#3ad86a", gem="#9affb0", courses=5, lean=0):
    """black tomb pyramid, left face lit, right face dark, a green edge and an apex gem; lean shifts the apex (px)."""
    ax = cx + lean
    c.poly([(cx - hw, by), (ax, by - h), (cx, by)], lit)
    c.poly([(cx, by), (ax, by - h), (cx + hw, by)], dark)
    for k in range(1, courses + 1):                              # courses: thin dark lines
        yy = by - h * k / (courses + 1)
        t = 1 - k / (courses + 1)
        c.line([(cx - hw * t + lean * (1 - t) * 0 , yy), (cx + hw * t, yy)], "#0a120f")
    c.line([(cx - hw, by), (ax, by - h)], edge)
    c.line([(ax, by - h), (cx + hw, by)], mix(C(edge), C(dark), 0.55))
    c.set(ax, by - h - 1, gem)
    c.set(ax, by - h - 2, gem)


def _necron(c, x, y, h, facing=1, col="#1e2a26", eye="#7aff9a", rim_col=None, toward=(-1, -1), shadow=None,
            thick=0.8, crest=None, collar=None):
    """a necron warrior / courtier as a thin silhouette with two green eyes; crest = colour of a headdress
    flare, collar = colour of a gold collar band.  Feet at (x, y).  Returns (left, top)."""
    f = fig(h, "stand", col, facing=facing, thick=thick)
    ox, oy = put_figure(c, f, x, y, rim_col=rim_col, toward=toward, shadow=shadow)
    hx_, hy_ = f["head"]
    hxp, hyp = ox + int(round(hx_)), oy + int(round(hy_))
    if h >= 16:
        c.set(hxp - 1, hyp, eye)
        c.set(hxp + 1, hyp, eye)
    else:
        c.set(hxp, hyp, eye)
    if crest:
        c.set(hxp, hyp - 3, crest); c.set(hxp - 1, hyp - 2, crest); c.set(hxp + 1, hyp - 2, crest)
        c.set(hxp, hyp - 2, crest); c.set(hxp, hyp - 4, crest)
    if collar and h >= 14:
        yy = hyp + max(2, int(h * 0.08))
        c.rect(hxp - 2, yy, hxp + 2, yy, collar)
    return ox, oy


def _scarab(c, x, y, scale=1, mirror=False, tint_to=None, tint_t=0.0):
    im = spr("canoptek_scarab", scale, mirror, tint_to=tint_to, tint_t=tint_t)
    return place(c, im, x, y, anchor="bm")


def _trooper(c, x, y, h, col="#1c2824", eye="#7aff9a", rim=None, facing=1):
    """a tiny direct-drawn necron figure (h = 5..12 px): head, shoulders, body, two legs, an eye pixel.
    Reads better than a scaled-down figure() at this size.  Feet at (x, y)."""
    top = y - h + 1
    c.rect(x - 1, top, x, top + 1, col)                      # head
    c.rect(x - 2, top + 2, x + 1, y - 2, col)                # torso
    c.set(x - 2, y - 1, col); c.set(x + 1, y - 1, col)       # legs
    c.set(x - 2, y, col); c.set(x + 1, y, col)
    c.set(x - 1 + (1 if facing > 0 else 0), top + 1, eye)
    if rim:
        c.set(x - 2, top + 2, rim); c.set(x - 2, top + 3, rim)
        c.set(x - 1, top, rim)



def _lr_shade(img, dark, light, gamma=1.0, rev=False):
    """re-colour an opaque silhouette with a left-to-right gradient (dark -> light; rev: light on the left): volume
    without outlines, so a dark body keeps its shape against a dark background."""
    out = img.copy()
    px = out.load()
    w = max(1, img.width - 1)
    for y in range(img.height):
        for x in range(img.width):
            if px[x, y][3] >= 128:
                px[x, y] = mix(C(dark), C(light), ((1.0 - x / float(w)) if rev else (x / float(w))) ** gamma) + (255,)
    return out


def _skull(c, hx, hy, facing=1, eye="#7aff9a", lit="#e0f0e8", mid="#a0b4aa", dark="#5a7068", s=1.0):
    """a small metal skull head centred at (hx, hy): banded oval, jaw bar, two green eye pixels on the facing side."""
    d = 1 if facing > 0 else -1
    rx, ry = int(round(3 * s)), int(round(4 * s))
    for yy in range(-ry, ry + 1):
        for xx in range(-rx, rx + 1):
            if (xx / (rx + 0.4)) ** 2 + (yy / (ry + 0.4)) ** 2 <= 1.0:
                t = 0.5 + 0.5 * (xx * d) / float(rx) - 0.2 * yy / float(ry)
                c.set(hx + xx, hy + yy, lit if t > 0.78 else (mid if t > 0.35 else dark))
    c.rect(hx - rx + 1, hy + ry - 1, hx + rx - 1, hy + ry - 1, dark)
    c.set(hx + d * 1, hy - 1, eye)
    c.set(hx + d * 3 if rx >= 3 else hx + d * 2, hy - 1, eye)


def _dim(c, col, amount):
    """pull the whole canvas toward `col` by `amount` with a plain per-pixel mix (no dither mesh; palette size unchanged)."""
    col = C(col)
    for y in range(c.h):
        for x in range(c.w):
            c.set(x, y, mix(c.get(x, y), col, amount))


def _stars_band(c, seed, n, y0, y1, cols=("#6a7aa8", "#c8d8f0", "#ffffff")):
    stars(c, seed, n, y0, y1, cols=cols)


def _dune(c, base, hmin, hmax, col, seed, lite=None, scale=0.03, x0=0, x1=None, fill_to=None):
    ridge(c, base, hmin, hmax, col, seed=seed, scale=scale, lite=lite, x0=x0, x1=x1, fill_to=fill_to)


# =====================================================================================================
#  GOOD
# =====================================================================================================

@ending("nec_end_ceasefire")
def nec_end_ceasefire(e):
    """GOOD.  Between the Lines: a tent pitched on a scratched line across the dunes at sunrise.  Inquisitor
    Mordane (hat, coat, pistol going back into its holster) stands on the living side, left; the overlord with a
    raised staff on the dead side, right, his ranks turning toward the pyramid; the go-between stands small in
    front of the tent.  Low sun from the left, long shadows to the right."""
    c = e.c
    HZ = 55
    sky(c, ["#243f72", "#4a6ea0", "#8a98b8", "#e0a888", "#ffb870", "#ffd090"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#6a7ea8", "#c8a0a0", "#ffc890"], 6, 38, scale=0.07, thresh=0.6, stretch=4.5)
    SX, SY = 28, HZ - 4
    glow(c, SX, SY, 40, ["#e89860", "#ffb878", "#ffd8a0", "#fff0c8"], power=1.7, strength=1.0, ry=28)
    c.ellipse(SX, SY, 6, 6, "#fff4d0")
    # far dunes, then the pyramid
    _dune(c, HZ + 5, 3, 9, "#b87848", e.seed_for("d0"), lite="#f0b070", scale=0.02)
    _pyramid(c, 152, HZ + 5, 36, 34, lit="#586a60", dark="#141e1a", edge="#5aff8a", gem="#c8ffd8", courses=4)
    glow(c, 152, HZ - 31, 6, ["#14582e", "#3ad86a", "#c8ffd8"], power=1.2, strength=0.9)
    for k in range(5):                                                         # green rays down the lit edge
        c.set(120 + k * 6, HZ + 2 - k * 6 + 3, "#5aff8a")
    haze(c, HZ + 2, HZ + 10, "#ffb878", t=0.35, seed=e.seed_for("hz"), profile="mid")
    # sand
    hband(c, HZ + 6, 107, ["#c88e4c", "#a87038", "#865430", "#5a3820"], seed=e.seed_for("sd"), rough=0.2)
    _dune(c, HZ + 12, 0, 4, "#d89c58", e.seed_for("d1"), lite="#f4c47c", scale=0.03, fill_to=HZ + 14)
    # the dead side: ranks of the legion drawn up at the foot of the pyramid, turning home
    for row, (yy, hh) in enumerate([(HZ + 9, 7), (HZ + 13, 8), (HZ + 17, 9)]):
        for k in range(9):
            _trooper(c, 119 + k * 9 + (row % 2) * 4, yy, hh, col="#26342e", rim=None, facing=1)
    # the line: scratched across the sand toward the horizon, stakes with little pennants
    c.line([(96, HZ + 8), (96, 108)], "#3a2210", 2)
    c.line([(95, HZ + 8), (92, 108)], "#d8a868", 1)
    for (sx_, sy_, k) in [(96, HZ + 11, 1), (96, HZ + 16, 2), (95, HZ + 26, 3), (94, HZ + 40, 4)]:
        c.rect(sx_, sy_ - 2 - k, sx_, sy_, "#3a2616")
        c.rect(sx_ + 1, sy_ - 2 - k, sx_ + 1 + min(3, k), sy_ - 2 - k + (k > 1), "#ff5a3a")
    # the living side: tents, guardsmen turning back
    for (tx, tb, tw, th) in [(24, HZ + 16, 24, 12), (56, HZ + 12, 16, 9), (8, HZ + 10, 14, 8)]:
        c.poly([(tx - tw // 2, tb), (tx, tb - th), (tx + tw // 2, tb)], "#e6d6b0")
        c.poly([(tx, tb - th), (tx + tw // 2, tb), (tx + 1, tb)], "#a8946c")
        c.rect(tx - 1, tb - 3, tx + 1, tb, "#2a1e16")
    for (gx, gy, hh) in [(40, HZ + 21, 12), (47, HZ + 18, 11), (72, HZ + 17, 11), (80, HZ + 20, 12)]:
        f = fig(hh, "stand", "#3a3858", facing=-1, thick=1.25)
        put_figure(c, f, gx, gy, rim_col="#ffd8a0", toward=(-1, -1))
    # --- the tent on the line (centre)
    TX, TB = 96, 91
    c.poly([(TX - 22, TB), (TX, TB - 27), (TX + 22, TB)], "#caa46c")
    c.poly([(TX, TB - 27), (TX + 22, TB), (TX + 2, TB)], "#8a6a42")
    c.poly([(TX - 6, TB), (TX, TB - 14), (TX + 6, TB)], "#2a1c12")
    c.poly([(TX - 3, TB), (TX, TB - 9), (TX + 3, TB)], "#ffb040")
    c.line([(TX, TB - 27), (TX, TB - 33)], "#2a1c12")
    c.rect(TX + 1, TB - 33, TX + 5, TB - 31, "#ff5a3a")
    # --- Mordane: wide hat, long coat, pistol going back
    mord = fig(26, "stand", "#2a2230", robe=0.6, facing=1)
    ox, oy = put_figure(c, mord, 66, 95, rim_col="#ffd8a0", toward=(-1, -1),
                        shadow=dict(toward_light=(-1, 0.1), length=1.3, squash=0.2, col="#5a3418", t=0.6))
    hx_, hy_ = mord["head"]
    hxp, hyp = ox + int(hx_), oy + int(hy_)
    c.rect(hxp - 4, hyp - 3, hxp + 4, hyp - 3, "#2a2230")
    c.rect(hxp - 2, hyp - 5, hxp + 2, hyp - 4, "#2a2230")
    c.set(hxp - 4, hyp - 4, "#ffd8a0")
    c.rect(hxp + 1, hyp, hxp + 2, hyp, "#e8c8a0")
    hh_x, hh_y = mord["hands"][0]
    c.rect(ox + int(hh_x), oy + int(hh_y), ox + int(hh_x) + 2, oy + int(hh_y), "#9a9aa6")
    # --- Sekhrat: tall headdress, gold collar, staff raised
    f = fig(31, "stand", "#26332e", facing=-1, thick=0.9)
    ox, oy = put_figure(c, f, 127, 96, rim_col="#ffd8a0", toward=(-1, -1),
                        shadow=dict(toward_light=(-1, 0.1), length=1.3, squash=0.2, col="#5a3418", t=0.6))
    hx_, hy_ = f["head"]
    hxp, hyp = ox + int(hx_), oy + int(hy_)
    c.set(hxp - 1, hyp, "#7aff9a"); c.set(hxp + 1, hyp, "#7aff9a")
    c.poly([(hxp - 2, hyp - 2), (hxp + 2, hyp - 2), (hxp + 1, hyp - 8), (hxp - 1, hyp - 8)], "#f0c038")
    c.rect(hxp - 3, hyp + 3, hxp + 3, hyp + 4, "#f0c038")
    c.line([(hxp - 6, hyp + 16), (hxp - 6, hyp - 11)], "#d8a830")
    c.set(hxp - 6, hyp - 12, "#9affb0"); c.set(hxp - 7, hyp - 11, "#7aff9a"); c.set(hxp - 5, hyp - 11, "#7aff9a")
    # --- the go-between: small, at the flap, in the warm light
    me = player_fig("necrons", 20, "stand", facing=1)
    put_figure(c, me, 97, 99, rim_col="#fff0c8", toward=(-1, -1),
               shadow=dict(toward_light=(-1, 0.1), length=1.3, squash=0.2, col="#5a3418", t=0.6))
    particles(c, "mote", 22, (0, 10, 190, 70), seed=e.seed_for("mote"), cols=("#ffe8b8", "#ffd090"))
    _dim(c, "#2a1608", 0.30)                                             # a late, low light: pull the whole picture down a step
    vignette_kind(c, "good", strength=0.5, inner=0.55)


@ending("nec_end_webway")
def nec_end_webway(e):
    """GOOD.  By the Webway: dusk on Thessa Null.  Behind the dune the purge fire stands in the left sky as a
    lit plume; at the right a tall seam of prismatic light splits the dune wall.  The ranger (cloak, long rifle)
    and the one being led, both small black shapes, walk into it.  Fire-light on the left, cyan on the right."""
    c = e.c
    HZ = 66
    sky(c, ["#1a1040", "#45205e", "#8a3466", "#d85a40", "#ff9c4c", "#ffd48c"], 0, HZ)
    stars(c, e.seed_for("st"), 40, 0, 26, cols=("#8a7ab0", "#d8c8f0", "#ffffff"))
    FX, FY = 36, HZ
    glow(c, FX, FY - 4, 60, ["#a8381e", "#e0642a", "#ff9c4c", "#ffd890"], power=1.5, strength=1.0, ry=34)
    # the purge fire plume: a pillar of smoke lit from below
    pn = e.noise("plume")
    for y in range(4, FY):
        k = (FY - y) / float(FY)                                       # 0 at the ground, 1 at the top
        cx_ = FX + 26 * k ** 1.8                                       # the column leans away on the wind and thins out
        wid = 6 + 14 * k
        for x in range(int(cx_ - wid - 8), int(cx_ + wid + 9)):
            if not (0 <= x < 192):
                continue
            d = abs(x - cx_) / max(1.0, wid)
            v = pn.fbm(x * 0.07, y * 0.1, 4)
            dens = (1.0 - d) * (1.0 - 0.8 * k ** 1.5) + (v - 0.5) * 0.9
            if dens > 0.22:
                lit = clamp(1.0 - k * 1.0 - d * 0.35 + (v - 0.5) * 0.4)
                c.set(x, y, ramp_pick(["#2a1438", "#5a2448", "#a0383a", "#ec6a2a", "#ffb050", "#ffe49a"], lit, x, y))
    glow(c, FX, FY - 2, 22, ["#e0642a", "#ffb050", "#ffe49a", "#ffffff"], power=1.3, strength=1.0, ry=9)
    # far dunes silhouetted, the pyramid a tiny black triangle against the fire
    _dune(c, HZ + 2, 2, 9, "#3a1a3c", e.seed_for("d0"), lite="#ff9c4c", scale=0.025)
    c.poly([(74, HZ + 1), (84, HZ - 11), (94, HZ + 1)], "#1a0e24")
    c.set(84, HZ - 12, "#5aff8a")
    # the dune wall with the seam
    DX0 = 84
    wall = e.noise("wall")
    for x in range(DX0, 192):
        u = clamp((x - DX0) / 52.0)
        top = int(HZ + 2 - 46 * (u * u * (3 - 2 * u)) + wall.fbm(x * 0.06, 1.3, 3) * 9 - 4)
        for y in range(top, 108):
            c.set(x, y, "#1c1430" if y > top else "#3a2a58")
        c.set(x, top, "#5a3a68" if x < 130 else "#3a2a58")
    # sand: a violet floor, fire-lit warm from the left
    hband(c, HZ + 4, 107, ["#7a3a58", "#5a2c4c", "#3e2040", "#241430"], seed=e.seed_for("sd"), rough=0.08)
    for y in range(HZ + 4, 108):
        for x in range(0, DX0 + 8):
            blend(c, x, y, "#ff8a40", 0.28 * clamp(1 - x / 120.0) * clamp(1.2 - (y - HZ) / 40.0), 3)
    # the seam: a jagged vertical crack, white core, prismatic edges
    SX = 138
    rr = e.rng("seam")
    pts_l, pts_r = [], []
    for y in range(24, 97, 2):
        k = (y - 24) / 72.0
        wd = 1 + 5.5 * math.sin(math.pi * k) ** 0.8
        mid = SX + math.sin(k * 5.0) * 2 + rr.uniform(-0.6, 0.6)
        pts_l.append((mid - wd, y)); pts_r.append((mid + wd, y))
    light_pool(c, SX, 60, 40, 50, "#2a9ab0", t=0.85, power=0.9, levels=4)
    light_pool(c, SX, 60, 22, 42, "#8aeee8", t=0.8, power=1.0, levels=4)
    c.poly(pts_l + pts_r[::-1], "#cfffff")
    c.poly([(x * 0.5 + SX * 0.5, y) for (x, y) in pts_l] + [(x * 0.5 + SX * 0.5, y) for (x, y) in pts_r][::-1], "#ffffff")
    for (x, y) in pts_l[3:-3:2]:
        c.set(x - 1, y, "#ffd890")
    for (x, y) in pts_r[4:-3:3]:
        c.set(x + 1, y, "#ff7ac8")
    # light spilling from the seam onto the sand
    for y in range(HZ + 4, 108):
        k = (y - HZ - 4) / 40.0
        hw = 6 + k * 34
        for x in range(int(SX - hw), int(SX + hw)):
            blend(c, x, y, "#8aeee8", 0.62 * clamp(1 - abs(x - SX) / hw) ** 1.2 * (1 - 0.35 * k), 3)
    # the ranger and the one being led, black against the light, rim on the seam side
    rg = fig(33, "walk", "#120c20", robe=0.8, hood=True, facing=1)
    rx, ry_ = put_figure(c, rg, 126, 98, rim_col="#9af0f0", toward=(1, -0.3),
                         shadow=dict(toward_light=(1, 0.2), length=1.1, squash=0.25, col="#12082a", t=0.55))
    hx_, hy_ = rg["hands"][1]
    c.line([(rx + hx_ - 6, ry_ + hy_ + 14), (rx + hx_ + 8, ry_ + hy_ - 18)], "#120c20")      # long rifle
    me = player_fig("necrons", 25, "stand", facing=1)
    f2 = dict(me, img=tint(me["img"], "#16102a", 0.55))
    put_figure(c, f2, 108, 100, rim_col="#9af0f0", toward=(1, -0.3), shadow=dict(toward_light=(1, 0.2), length=1.0, squash=0.25, col="#12082a", t=0.55))
    particles(c, "mote", 34, (96, 20, 190, 100), seed=e.seed_for("mote"), cols=("#e6fffa", "#8aeee8", "#ffd890", "#ff9ad8"))
    particles(c, "ember", 26, (6, 16, 80, 62), seed=e.seed_for("em"), cols=("#ffb050", "#ff7a2a", "#ffe49a"))
    vignette_kind(c, "good", col="#10062a", strength=0.4)


@ending("nec_end_chronicler")
def nec_end_chronicler(e):
    """GOOD.  Chronicler of the Tomb: far under the sand, a hall of dormant sleepers in lit niches; at the left a
    lamp over a stone desk where one small human writes by green light (warm paper, gold lamp); the overlord
    leans in from the right, huge, to check the pronunciation.  Bright mass: lamp + desk, lower left."""
    c = e.c
    # back wall: dark green plates, a lattice of niches with sleepers (dim eye pairs), light rising from below
    for y in range(108):
        for x in range(192):
            t = 0.18 + 0.28 * (1 - y / 108.0) + (0.06 if (y // 12 + x // 16) % 2 else 0.0)
            c.set(x, y, ramp_pick(["#08140e", "#12281a", "#1c3e28", "#2a5a38"], t, x, y))
    rr = e.rng("niches")
    for ny in range(3):
        for nx in range(13):
            x0, y0 = 50 + nx * 11, 6 + ny * 24
            c.rect(x0, y0, x0 + 6, y0 + 19, "#04090a")
            c.rect(x0, y0, x0 + 6, y0, "#2c7a46")
            c.rect(x0, y0, x0, y0 + 19, "#16402a")
            c.rect(x0 + 6, y0, x0 + 6, y0 + 19, "#0c2418")
            for yy in range(y0 + 2, y0 + 19):
                for xx in range(x0 + 2, x0 + 5):
                    if rr.random() < 0.08:
                        c.set(xx, yy, "#0e2a1a")
            if rr.random() < 0.8:
                c.set(x0 + 2, y0 + 5, "#2e8a4e"); c.set(x0 + 4, y0 + 5, "#2e8a4e")
            blend(c, x0, y0, "#3ad86a", 0.15, 3)
    _glyph_wall(c, 4, 6, 44, 60, ["#1e5a34", "#2c7a46"], e.seed_for("gw"), cw=4, rh=8, p=0.5)
    # floor: dark polished stone, light pooling at the desk
    hband(c, 82, 107, ["#16301f", "#0e2016", "#08140e", "#040a07"], seed=e.seed_for("fl"), rough=0.1)
    c.rect(0, 82, 191, 82, "#2c7a46")
    for x in range(-60, 260, 22):
        c.line([(96 + (x - 96) * 0.5, 82), (96 + (x - 96) * 1.8, 107)], "#0a1a10")
    # the lamp: a gold-green orb on a cable, light pools on the desk and floor
    LX, LY = 50, 32
    c.line([(LX, 0), (LX, LY - 4)], "#2c7a46")
    light_pool(c, LX, 70, 56, 44, "#9affb0", t=0.6, power=1.1, levels=4)
    light_pool(c, LX, 66, 28, 26, "#ffe890", t=0.65, power=1.0, levels=4)
    glow(c, LX, LY, 10, ["#2c8a4e", "#9affb0", "#ffe890", "#ffffff"], power=1.2, strength=1.0)
    light_pool(c, LX + 4, 96, 56, 9, "#9affb0", t=0.5)
    # the desk: stone slab, human seated, paper
    DT = 76
    c.rect(8, DT, 94, DT + 3, "#2a3a32")
    c.rect(8, DT, 94, DT, "#7ad89a")
    c.rect(12, DT + 4, 16, 98, "#14221a"); c.rect(86, DT + 4, 90, 98, "#14221a")
    c.rect(12, DT + 4, 12, 98, "#3a7a52")
    me = player_fig("necrons", 50, "sit", facing=1)
    ox, oy = put_figure(c, me, 38, 94, rim_col="#ffe890", toward=(0, -1),
                        shadow=dict(toward_light=(0.4, 0.2), length=0.6, squash=0.2, col="#04090a", t=0.6))
    hx_, hy_ = me["head"]
    c.rect(ox + int(hx_) + 1, oy + int(hy_), ox + int(hx_) + 2, oy + int(hy_) + 1, "#e8c090")          # face
    c.set(ox + int(hx_) - 1, oy + int(hy_) - 2, "#ffe890")
    # the page being written + a tall stack of finished pages + a pen
    c.rect(46, DT - 1, 60, DT - 1, "#fff0c8")
    c.rect(48, DT - 2, 58, DT - 2, "#e8d8a8")
    for k in range(8):
        c.rect(68, DT - 1 - k * 2, 86, DT - 1 - k * 2, "#f4e6c0" if k % 2 == 0 else "#d8c898")
    c.rect(68, DT - 17, 86, DT - 17, "#fff6d8")
    for k in range(3):
        _glyph_marks(c, 70 + k * 5, DT - 12 - k * 2, 2, "#8a7a5a", e.seed_for("pg%d" % k), step=4, h=3, w=2, p=0.6)
    c.rect(58, DT - 3, 61, DT - 2, "#c89a28")                                          # the pen
    # --- the overlord: a huge bust at the right, leaning toward the desk
    lord = spr("necron_lord", 2, mirror=True, tint_to="#06140c", tint_t=0.3, crop=(0, 0, 64, 50), bottom_fade=18)
    lord = rim(lord, "#9affb0", (-1, -1), min_run=4)
    place(c, lord, 98, 10, anchor="tl")
    particles(c, "mote", 26, (6, 10, 150, 90), seed=e.seed_for("mote"), cols=("#9affb0", "#ffe890", "#e8ffe8"))
    vignette_kind(c, "good", col="#02080a", strength=0.4)


def _case(c, xc, yb, w, h, inner=None, glass="#7affa0", t=0.2, lit="#b8ffd0", dark="#1a5a32", plinth="#16261e"):
    """a stasis display case: glass box (x centre xc, base y yb), tinted interior, lit left / top edge, a plinth.
    inner(x0, y0, x1, y1) is called to draw the exhibit (before the glass tint, so the exhibit sits behind glass)."""
    x0, x1 = int(xc - w / 2), int(xc + w / 2)
    y0 = int(yb - h)
    ph = max(2, int(h * 0.07))
    c.rect(x0 - 1, yb, x1 + 1, yb + ph, plinth)
    c.rect(x0 - 1, yb, x1 + 1, yb, "#3a7a52")
    for y in range(y0, yb):
        for x in range(x0, x1 + 1):
            blend(c, x, y, glass, t, 3)
    if inner:
        inner(x0, y0, x1, yb)
        for y in range(y0, yb):
            for x in range(x0, x1 + 1):
                blend(c, x, y, glass, t * 0.55, 3)
    c.rect(x0, y0, x1, y0, lit)
    c.rect(x0, y0, x0, yb, lit)
    c.rect(x1, y0, x1, yb, dark)
    if w > 14:
        c.rect(x0 + 1, y0 + 1, x0 + 1, yb - 2, mix(C(lit), C(glass), 0.5))
    return x0, y0, x1, yb


@ending("nec_end_curator")
def nec_end_curator(e):
    """GOOD.  Docent Forty-One: the Collector's gallery.  Rows of green-lit stasis cases recede to a vanishing
    point under a hanging crystal lamp; in the big case at right a soldier kneels frozen mid-prayer; in front of it
    the new docent, small, reaches up with a stylus to the plaque, which glows warm amber -- the only warm
    thing in the green hall."""
    c = e.c
    VX, VY = 96, 42
    # wall + ceiling: green gradient with radial lines toward the vanishing point
    for y in range(0, 108):
        for x in range(192):
            t = 0.55 - 0.45 * abs(y - VY) / 66.0
            c.set(x, y, ramp_pick(["#06120c", "#0e2a1a", "#184a2c", "#26683e"], t, x, y))
    # floor: perspective grid, brightest near the cases
    FLOOR = VY + 6
    for y in range(FLOOR, 108):
        t = (y - FLOOR) / (107.0 - FLOOR)
        for x in range(192):
            c.set(x, y, ramp_pick(["#0e2a1a", "#184a2c", "#26683e", "#34885a"], t * 0.85 + 0.1, x, y))
    for k in range(-16, 17):
        c.line([(VX + k * 2, FLOOR), (VX + k * 40, 108)], "#0c2216")
    for yy in (FLOOR + 3, FLOOR + 8, FLOOR + 15, FLOOR + 25, FLOOR + 40, FLOOR + 62):
        c.line([(0, yy), (191, yy)], "#0c2216")
    # the hanging crystal lamp of the Collector + cone of light on the main case
    LX, LY = 132, 9
    c.line([(LX, 0), (LX, LY - 4)], "#3a8a58")
    shafts(c, (LX, LY), 100, 36, 7, 90, "#e8ffe0", t=0.30, seed=e.seed_for("sh"), w0=3, w1=14, power=0.6)
    glow(c, LX, LY, 9, ["#2c8a4e", "#9affb0", "#fff0b0", "#ffffff"], power=1.2, strength=1.0)
    c.poly([(LX, LY - 4), (LX + 3, LY), (LX, LY + 5), (LX - 3, LY)], "#e8ffe8")
    # receding rows of cases (far -> near), each with a little frozen silhouette
    def tiny(kind, col):
        def draw(x0, y0, x1, y1):
            hh = y1 - y0 - 2
            cx = (x0 + x1) // 2
            if kind == 0:                                  # standing figure
                c.rect(cx - 1, y1 - hh * 2 // 3, cx, y1 - 1, col)
                c.rect(cx - 1, y1 - hh * 2 // 3 - 2, cx, y1 - hh * 2 // 3 - 1, col)
            elif kind == 1:                                # crouched
                c.rect(cx - 2, y1 - hh // 2, cx + 1, y1 - 1, col)
                c.rect(cx - 1, y1 - hh // 2 - 2, cx, y1 - hh // 2 - 1, col)
            else:                                          # a tall armoured shape
                c.rect(cx - 2, y1 - hh * 3 // 4, cx + 1, y1 - 1, col)
                c.rect(cx - 1, y1 - hh * 3 // 4 - 2, cx, y1 - hh * 3 // 4 - 1, col)
        return draw
    kind_i = 0
    for s_ in (0.16, 0.24, 0.34, 0.48, 0.68, 0.95):
        yb = int(VY + 10 + 58 * s_)
        ch = int(62 * s_)
        for side in (-1, 1):
            xc = VX + side * (64 * s_ + 6)
            if side > 0 and s_ > 0.6:
                continue                           # the main case sits there
            _case(c, xc, yb, max(5, int(ch * 0.55)), ch, inner=tiny(kind_i % 3, "#0a1c12"), t=0.2)
            kind_i += 1
    # --- the main case, right: a soldier kneeling in prayer, frozen
    def soldier(x0, y0, x1, y1):
        sd = fig(56, "kneel", "#6a8878", facing=-1, thick=1.15)
        img = rim(sd["img"], "#d8ffe8", (-1, -1))
        put_figure(c, dict(sd, img=img), (x0 + x1) // 2 + 1, y1 - 2)
        hx_, hy_ = sd["head"]
        cx0 = (x0 + x1) // 2 + 1
        c.set(cx0 - 8, y1 - 2 - 50 + 5, "#2a3c32")                                 # shut eyes: a dark pixel
    _case(c, 143, 90, 50, 66, inner=soldier, t=0.24, lit="#d8ffe8", dark="#1e6a3a", plinth="#14241c")
    # --- the plaque on its stand, warm amber, with unreadable lines
    c.poly([(98, 88), (118, 88), (116, 72), (100, 72)], "#3a2a18")
    c.poly([(100, 86), (116, 86), (115, 74), (101, 74)], "#f4d890")
    c.rect(101, 74, 115, 74, "#fff6d8")
    for k, ln in enumerate([12, 10, 13, 7]):
        c.rect(102, 76 + k * 3, 102 + ln - 1, 76 + k * 3, "#8a6a30")
    c.rect(107, 88, 109, 96, "#2a2014")
    light_pool(c, 108, 82, 24, 18, "#ffd070", t=0.55, power=1.1, levels=4)
    light_pool(c, 100, 98, 44, 8, "#ffd070", t=0.4)
    # --- the docent, small, reaching up to the plaque with a stylus, warm rim from the plaque
    me = player_fig("necrons", 34, "reach", facing=1, thick=1.2)
    put_figure(c, me, 82, 99, rim_col="#ffe0a0", toward=(1, -0.2),
               shadow=dict(toward_light=(1, 0.3), length=0.7, squash=0.25, col="#06120c", t=0.6))
    hx_, hy_ = me["hands"][0]
    ox_, oy_ = 82 - me["feet"][0], 99 - me["feet"][1]
    c.set(int(ox_ + hx_) + 1, int(oy_ + hy_), "#fff6d8")
    c.set(int(ox_ + hx_) + 2, int(oy_ + hy_), "#fff6d8")
    particles(c, "mote", 28, (6, 6, 186, 98), seed=e.seed_for("mote"), cols=("#e8ffe0", "#9affb0", "#ffe0a0"))
    vignette_kind(c, "good", col="#02100a", strength=0.35)


# =====================================================================================================
#  BAD
# =====================================================================================================

@ending("nec_end_claim_khorne")
def nec_end_claim_khorne(e):
    """BAD (Khorne).  Beyond the Null Field: the edge of the necrons' field stands as a pale green curtain across
    the desert.  Left of it the cold, silent dark with the pyramid; right of it a blood-red world, a huge low
    sun, drum-rings spreading over the sky and one lantern-bearer standing small on the sand.  The player,
    just across the curtain, lunges toward that person with a hand tool raised; the shadow runs back."""
    c = e.c
    G = GOD["khorne"]["ramp"]
    HZ, FX = 70, 62
    sky(c, ["#1a0408", "#3a0a10", "#6a1410", "#a82c18", "#e0601e", "#ffa040"], 0, HZ)
    SXc, SYc = 152, HZ - 3
    glow(c, SXc, SYc, 70, ["#6a1410", "#a82c18", "#e0601e", "#ffa040"], power=1.6, strength=1.0, ry=46)
    for y in range(SYc - 26, HZ + 1):                                           # the sun: banded disc, cut by the horizon
        for x in range(SXc - 26, SXc + 27):
            d = math.hypot(x - SXc, (y - SYc) * 1.0)
            if d <= 24:
                c.set(x, y, ramp_pick(["#c8441c", "#ec8a2c", "#ffc060", "#fff0b0"], 0.9 - d / 26.0 + 0.15, x, y))
    for r in (32, 41, 52, 65, 80, 98):                                          # the drum: rings spreading over the sky
        for y in range(2, HZ):
            for x in range(60, 192):
                d = math.hypot(x - SXc, y - SYc)
                if abs(d - r) < 0.75 and (x + y) % 2 == 0:
                    blend(c, x, y, "#ffc060", 0.35 * (1 - r / 120.0), 3)
    # ground: red dust, long lit lane toward the sun
    hband(c, HZ + 1, 107, ["#8a1e12", "#521010", "#2a060c", "#14040a"], seed=e.seed_for("gd"), rough=0.12)
    light_pool(c, SXc, HZ + 8, 56, 10, "#ffa040", t=0.7, power=1.1)
    # the camp of the living, far, black against the sun
    for (tx, tw, th) in [(118, 9, 5), (132, 11, 6), (172, 9, 5), (184, 12, 7), (104, 7, 4)]:
        c.poly([(tx - tw // 2, HZ + 2), (tx, HZ + 2 - th), (tx + tw // 2, HZ + 2)], "#1a0508")
        c.set(tx - tw // 2 + 1, HZ + 1, "#ffa040")
    for (lx, ly) in [(124, HZ), (160, HZ + 1), (178, HZ)]:
        c.set(lx, ly, "#ffe08a")
    # the cold side: left of the curtain everything is cold and quiet; the pyramid's flank
    for y in range(0, 108):
        for x in range(0, FX + 2):
            blend(c, x, y, "#0a1618", 0.78, 4)
    PAX, PAY, PH, PHW = -4, HZ + 6, 66, 62
    c.poly([(PAX - PHW, PAY), (PAX, PAY - PH), (PAX, PAY)], "#0a1412")
    c.poly([(PAX, PAY), (PAX, PAY - PH), (PAX + PHW, PAY)], "#2c1a1c")             # the face toward the red sun
    for k in range(1, 7):
        yy = PAY - PH * k / 7.0
        t = 1 - k / 7.0
        c.line([(PAX, yy), (PAX + PHW * t, yy)], "#12090c")
    c.line([(PAX, PAY - PH), (PAX + PHW, PAY)], "#4af080")
    c.line([(PAX + 1, PAY - PH), (PAX + 1 + PHW, PAY)], "#2c8a4a")
    c.set(PAX, PAY - PH - 2, "#c8ffd8"); c.set(PAX, PAY - PH - 1, "#c8ffd8")
    for y in range(HZ + 2, 108):
        for x in range(0, FX + 2):
            t = (y - HZ - 2) / 36.0
            c.set(x, y, ramp_pick(["#26403c", "#162826", "#0c1816", "#060c0c"], t, x, y))
    # the curtain: a pale green wall of light with slow ripples
    for y in range(10, 108):
        xc = FX + 3 * math.sin(y * 0.11)
        for k in range(-3, 4):
            blend(c, int(xc) + k, y, "#c8ffd8", (0.55 if abs(k) <= 1 else 0.22), 3)
        if y % 13 == 0:
            for k in range(-4, 5):
                blend(c, int(xc) + k, y, "#9affb0", 0.3, 3)
    # the lantern-bearer: the first living person, small, backlit
    lf = fig(24, "stand", "#12060a", facing=-1)
    lx_, ly_ = put_figure(c, lf, 136, 92, rim_col="#ffa040", toward=(1, -0.3),
                          shadow=dict(toward_light=(1, 0.25), length=1.8, squash=0.25, col="#12060a", t=0.55))
    hx_, hy_ = lf["hands"][0]
    c.set(lx_ + int(hx_) - 3, ly_ + int(hy_) + 2, "#ffe08a"); c.set(lx_ + int(hx_) - 3, ly_ + int(hy_) + 3, "#ffa040")
    # the player: mid-lunge, tool raised, red rim from the sun, long shadow trailing back toward the field
    pf = player_fig("necrons", 36, "run", facing=1)
    pf = dict(pf, img=tint(pf["img"], "#12060a", 0.62))
    px0, py0 = put_figure(c, pf, 94, 102, rim_col="#ff8a2c", toward=(1, -0.2),
                          shadow=dict(toward_light=(1, 0.15), length=2.0, squash=0.2, col="#12060a", t=0.65))
    hx_, hy_ = pf["hands"][1]
    hx0, hy0 = px0 + int(hx_), py0 + int(hy_)
    c.line([(hx0, hy0), (hx0 + 5, hy0 - 9)], "#12060a", 1)
    c.rect(hx0 + 3, hy0 - 11, hx0 + 8, hy0 - 10, "#ff8a2c")
    particles(c, "ember", 40, (62, 10, 190, 100), seed=e.seed_for("em"), cols=("#ffa040", "#ff6a2a", "#ffe08a"), wind=(-1, 1))
    vignette_kind(c, "bad", col="#1a0408", strength=0.6)


def _bloom(c, x, y, r, cols, spot="#d8d880"):
    """a bloated flower / puffball: banded disc with a pale pustule highlight and a dark mouth; cols dark -> light."""
    for yy in range(-r, r + 1):
        for xx in range(-r, r + 1):
            d = math.hypot(xx, yy * 1.05)
            if d <= r + 0.3:
                t = 0.85 - (d / (r + 0.5)) * 0.5 - (xx * 0.5 + yy * 0.8) / (r * 3.0) * 0.5
                c.set(x + xx, y + yy, ramp_pick(cols, clamp(t), x + xx, y + yy, sharp=1.2))
    c.set(x - r // 2, y - r // 2, spot)
    if r >= 4:
        c.set(x - r // 2 + 1, y - r // 2, spot)
        c.set(x + 1, y + 1, cols[0])


@ending("nec_end_claim_nurgle")
def nec_end_claim_nurgle(e):
    """BAD (Nurgle).  The First Step Outside: seen from inside the tomb door.  The trapezoid doorway is cold dark
    stone with dead glyph rows; through it the desert has bloomed -- a sick ochre sun, mounds and puffballs,
    moss -- and where the human's front foot has just crossed the threshold the green is already spreading in a
    ring, flies gathering.  The human stands as a dark back against the warm light."""
    c = e.c
    G = GOD["nurgle"]["ramp"]
    HZ = 52
    sky(c, ["#2a3812", "#4e6a1c", "#8aa03a", "#c8c866", "#ecdc96"], 0, HZ + 4)
    SXc, SYc = 128, 32
    glow(c, SXc, SYc, 40, ["#6c8a2a", "#a8b84a", "#d8d880", "#f4ecb0"], power=1.5, strength=1.0, ry=30)
    c.ellipse(SXc, SYc, 9, 9, "#f4ecb0")
    c.ellipse(SXc - 2, SYc - 2, 4, 4, "#fffbd8")
    clouds(c, e.seed_for("cl"), ["#6c8a2a", "#8aa03a", "#b8c05a"], 4, 42, scale=0.07, thresh=0.6, stretch=4.0)
    ridge(c, HZ + 6, 4, 16, "#7c9a34", seed=e.seed_for("r0"), lite="#b8c05a", scale=0.03)
    ridge(c, HZ + 12, 3, 12, "#56741f", seed=e.seed_for("r1"), lite="#8aa03a", scale=0.04)
    haze(c, HZ - 4, HZ + 10, "#d8d880", t=0.5, seed=e.seed_for("hz"), profile="mid")
    hband(c, HZ + 12, 107, ["#56741f", "#3e5a1c", "#2a3a12", "#141c08"], seed=e.seed_for("gd"), rough=0.15)
    rr = e.rng("grow")
    for (bx, by, br) in [(36, HZ + 10, 13), (166, HZ + 9, 10), (150, HZ + 12, 7)]:            # huge puffball mounds on the skyline
        _bloom(c, bx, by, br, ["#2a3a12", "#4e6a1c", "#7c9a34", "#b8c05a"], spot="#e8e49a")
        for k in range(6):
            c.set(bx + rr.randint(-br, br) // 2, by + rr.randint(-br, br) // 3, "#e8e49a")
    # the garden: bloated blooms and puffball mounds, bigger toward the viewer, on the moss
    for k in range(34):
        y = rr.randint(HZ + 13, 100)
        x = rr.randint(2, 189)
        r = 2 + (y - HZ) // 11
        _bloom(c, x, y, r, ["#2a3a12", "#4e6a1c", "#8aa03a", "#c8c866"], spot="#f0e8a0")
    for k in range(260):                                                     # grass blades
        y = rr.randint(HZ + 12, 104)
        x = rr.randint(0, 191)
        hh = 1 + (y - HZ) // 14
        col = rr.choice(["#8aa03a", "#a8b84a", "#4e6a1c", "#c8c866"])
        c.rect(x, y - hh, x, y, col)
    # the tomb: trapezoid doorway, cold dead stone with glyph rows, a pale threshold
    def opening(x, y):
        if y < 14 or y > 86:
            return False
        t = (y - 14) / 72.0
        return (44 - 16 * t) <= x <= (148 + 18 * t)
    for y in range(108):
        for x in range(192):
            if not opening(x, y):
                t = 0.15 + 0.35 * (1 - y / 108.0) + (0.08 if (y // 11 + x // 19) % 2 else 0)
                c.set(x, y, ramp_pick(["#070c0a", "#0e1814", "#16241e", "#22362c"], t, x, y))
    for (x0, x1) in [(2, 26), (162, 188)]:
        _glyph_wall(c, x0, 10, x1, 100, ["#1c3a2c", "#2e5a44"], e.seed_for("gw%d" % x0), cw=4, rh=9, p=0.45)
    _glyph_wall(c, 52, 2, 140, 11, ["#1c3a2c", "#2e5a44"], e.seed_for("gwt"), cw=4, rh=9, p=0.45)
    for y in range(14, 87):                                                 # a dull green edge on the opening
        t = (y - 14) / 72.0
        c.set(int(44 - 16 * t) - 1, y, "#3a7a58"); c.set(int(148 + 18 * t) + 1, y, "#1e4a36")
    c.rect(44, 13, 148, 13, "#3a7a58")
    # floor inside: stone slabs, then the threshold strip
    hband(c, 87, 107, ["#2a3e36", "#1c2c26", "#10201a", "#08120e"], seed=e.seed_for("fl"), rough=0.08)
    c.rect(0, 86, 191, 87, "#a8b8a0")
    c.rect(0, 88, 191, 88, "#506a58")
    for x in range(-60, 260, 24):
        c.line([(96 + (x - 96) * 0.45, 89), (96 + (x - 96) * 1.7, 107)], "#0a1612")
    # where the front foot crossed: a ring of fresh green, buds, flies
    FXc, FYc = 106, 92
    for y in range(FYc - 6, FYc + 8):
        for x in range(FXc - 20, FXc + 21):
            d = math.hypot((x - FXc) / 20.0, (y - FYc) / 5.0)
            if d < 1.0 and y >= 86:
                blend(c, x, y, "#a8b84a", 0.55 * (1 - d), 3)
    for (bx, by, br) in [(96, 90, 2), (110, 91, 3), (118, 89, 2), (101, 94, 2), (113, 96, 2)]:
        _bloom(c, bx, by, br, ["#2a3a12", "#4e6a1c", "#8aa03a", "#c8c866"], spot="#f0e8a0")
    # the human: a dark back against the sick sun, rim of ochre
    me = player_fig("necrons", 46, "stand", facing=1)
    me = dict(me, img=tint(me["img"], "#0a100a", 0.72))
    px0, py0 = put_figure(c, me, 92, 99, rim_col="#d8d880", toward=(1, -1),
                          shadow=dict(toward_light=(1, -0.3), length=0.5, squash=0.2, col="#050806", t=0.6))
    # flies around the head
    hx_, hy_ = me["head"]
    fr = e.rng("flies")
    for k in range(26):
        a = fr.uniform(0, 6.283)
        rad = fr.uniform(4, 15)
        c.set(px0 + int(hx_) + math.cos(a) * rad * 1.3, py0 + int(hy_) + math.sin(a) * rad * 0.8, "#10160a")
    for k in range(18):
        c.set(fr.randint(40, 150), fr.randint(18, 70), "#10160a")
    particles(c, "spore", 26, (40, 16, 150, 84), seed=e.seed_for("sp"), cols=("#e8ff9a", "#c8d850", "#a8b84a"))
    _dim(c, "#0a1004", 0.26)                                             # a sick, heavy light: pull the whole picture down a step
    vignette_kind(c, "bad", col="#0a1004", strength=0.7, inner=0.5)


@ending("nec_end_claim_slaanesh")
def nec_end_claim_slaanesh(e):
    """BAD (Slaanesh).  Wanting: a stasis gallery lit in magenta and silver.  The human stands frozen on a plinth
    in a half-finished pose inside a silver stasis shell under one spot; in the tall mirror beside it the same
    figure is posed perfectly -- and smiles.  An empty plinth waits at the far left."""
    c = e.c
    G = GOD["slaanesh"]["ramp"]
    # wall: plum, vertical silver ribs
    for y in range(108):
        for x in range(192):
            t = 0.12 + 0.3 * (1 - y / 108.0) + (0.07 if (x // 12) % 2 else 0)
            c.set(x, y, ramp_pick(["#0c0414", "#1c0a2c", "#3a1058", "#5a1a7a"], t, x, y))
    for x in range(6, 192, 24):
        c.rect(x, 0, x, 76, "#4a1a6a")
    # floor: glossy plum, spot pool + reflection streaks
    FLOOR = 76
    hband(c, FLOOR, 107, ["#3a1058", "#240a3c", "#14062a", "#0a0316"], seed=e.seed_for("fl"), rough=0.06)
    c.rect(0, FLOOR, 191, FLOOR, "#8a3aa8")
    for x in range(-40, 240, 20):
        c.line([(96 + (x - 96) * 0.5, FLOOR + 1), (96 + (x - 96) * 1.7, 107)], "#240a3c")
    # the empty plinth far left, a thin cone of light on its empty top
    c.rect(18, 62, 34, 76, "#2a1040"); c.rect(18, 62, 34, 62, "#c8a0e0"); c.rect(18, 62, 18, 76, "#5a2a7a")
    shafts(c, (26, 0), 90, 8, 2, 62, "#ff8ad8", t=0.22, seed=e.seed_for("sh0"), w0=2, w1=9, power=0.5)
    # the tall mirror at right: silver frame, magenta-lavender glass, the perfect reflection
    MX0, MX1, MY0, MY1 = 134, 182, 8, 88
    for y in range(MY0, MY1 + 1):
        for x in range(MX0, MX1 + 1):
            top = MY0 + int(10 * (1 - math.sqrt(max(0.0, 1 - ((x - (MX0 + MX1) / 2) / ((MX1 - MX0) / 2)) ** 2))))
            if y < top:
                continue
            t = 0.25 + 0.55 * ((y - MY0) / float(MY1 - MY0)) * 0.6 + 0.35 * (1 - abs(x - 158) / 24.0)
            c.set(x, y, ramp_pick(["#2a0c44", "#4a1a6a", "#7a2a9a", "#a83ab0", "#d86ad8"], clamp(t * 0.9), x, y))
            if x in (MX0, MX0 + 1, MX1, MX1 - 1) or y in (MY1, MY1 - 1) or y in (top, top + 1):
                c.set(x, y, "#e8e8f8" if (x + y) % 3 else "#8a8aa8")
    refl = fig(56, "arms_up", "#fff4fc", facing=-1, thick=1.0)
    refl = dict(refl, img=rim(refl["img"], "#ffffff", (-1, -1)))
    put_figure(c, refl, 158, 85)
    rx0 = 158 - refl["feet"][0]
    ry0 = 85 - refl["feet"][1]
    hx_, hy_ = refl["head"]
    c.rect(rx0 + int(hx_) - 1, ry0 + int(hy_) + 1, rx0 + int(hx_) + 1, ry0 + int(hy_) + 1, "#7a2a9a")       # the reflection smiles
    glow(c, 158, 20, 12, ["#7a2a9a", "#c850c8", "#ff8ad8"], power=1.5, strength=0.5)
    for k in range(5):
        c.line([(MX0 + 6 + k * 9, MY0 + 12), (MX0 + 2 + k * 9, MY1 - 4)], "#ff8ad8")
    # the plinth + the stasis shell + the frozen human
    PX = 96
    c.rect(PX - 12, 70, PX + 12, 70, "#e8e8f8")
    c.rect(PX - 12, 71, PX + 12, 84, "#2a1040")
    c.rect(PX - 12, 71, PX - 12, 84, "#7a2a9a")
    c.rect(PX + 12, 71, PX + 12, 84, "#14062a")
    c.rect(PX - 5, 78, PX + 5, 80, "#c8c8e0")                              # a plate, no lettering
    shafts(c, (PX - 30, 0), 78, 18, 6, 96, "#ff8ad8", t=0.32, seed=e.seed_for("sh"), w0=6, w1=22, power=0.5, floor=70)
    light_pool(c, PX, 70, 30, 7, "#ffd8f8", t=0.7)
    light_pool(c, PX, 88, 40, 9, "#ff8ad8", t=0.55)
    me = player_fig("necrons", 40, "reach", facing=1)
    me = dict(me, img=tint(me["img"], "#c8b8e8", 0.6))
    ox, oy = put_figure(c, me, PX, 69, rim_col="#ffffff", toward=(-1, -1))
    hx_, hy_ = me["head"]
    c.set(ox + int(hx_) + 1, oy + int(hy_), "#7a2a9a")                      # an open mouth: still wanting
    # the stasis shell: silver oval column
    for y in range(18, 70):
        k = (y - 18) / 52.0
        hw = 15 * math.sqrt(max(0.0, 1 - ((k - 0.55) / 0.55) ** 2)) + 2
        for sx in (-1, 1):
            xx = PX + sx * int(hw)
            blend(c, xx, y, "#e8e8f8", 0.85, 3)
            blend(c, xx - sx, y, "#e8e8f8", 0.4, 3)
    for x in range(PX - 14, PX + 15):
        blend(c, x, 18, "#e8e8f8", 0.6, 3)
    for y in range(18, 70):
        for x in range(PX - 15, PX + 16):
            if abs(x - PX) < 14:
                blend(c, x, y, "#c8c8f0", 0.08, 3)
    c.set(PX - 7, 30, "#ffffff"); c.set(PX - 7, 31, "#ffffff"); c.set(PX - 6, 33, "#ffffff")        # a glint on the shell
    particles(c, "mote", 26, (6, 6, 186, 100), seed=e.seed_for("mote"), cols=("#ff8ad8", "#e8e8f8", "#ffffff"))
    vignette_kind(c, "bad", col="#0c0414", strength=0.62)


def _thread(c, p0, p1, col, t=0.8, sag=0.0, levels=3, dash=0):
    """a thin glowing thread between two points, blended onto what is there; sag = bow of the curve (px, +down)."""
    (x0, y0), (x1, y1) = p0, p1
    n = int(max(abs(x1 - x0), abs(y1 - y0)) * 1.4) + 2
    for i in range(n + 1):
        u = i / float(n)
        x = x0 + (x1 - x0) * u
        y = y0 + (y1 - y0) * u + sag * 4 * u * (1 - u)
        if dash and (i // dash) % 2:
            continue
        blend(c, int(round(x)), int(round(y)), col, t, levels)


@ending("nec_end_claim_tzeentch")
def nec_end_claim_tzeentch(e):
    """BAD (Tzeentch).  Answers Under the Stars: outside the tomb the sky is full of stars, and between them the
    lines have come loose from the walls -- a net of cyan threads, fragments of glyph slabs hanging in it, and a
    door standing open in the upper sky, full of light.  One thread is pink: the extra line, running from the
    door to the small human at the foot of the dune."""
    c = e.c
    G = GOD["tzeentch"]["ramp"]
    HZ = 80
    sky(c, ["#05030c", "#0a0a3a", "#0a1e7a", "#1a5ad8", "#2a8ae8"], 0, HZ)
    n1 = e.noise("neb")
    for y in range(0, HZ):
        for x in range(192):
            v = n1.fbm(x * 0.02, y * 0.05, 4)
            if v > 0.55:
                blend(c, x, y, "#6a2ad8", (v - 0.55) * 2.4, 3)
    stars(c, e.seed_for("st"), 150, 0, HZ - 6, cols=("#5a7ad8", "#9af6ff", "#ffffff"))
    # the nodes of the net: bright stars with a cross flare
    nodes = [(20, 18), (44, 40), (62, 14), (78, 52), (102, 30), (118, 62), (160, 12), (176, 48), (150, 66), (38, 62), (92, 8), (186, 24)]
    # the door: a tall doorway standing in the upper sky, ajar, full of light
    DX, DY, DW, DH = 134, 14, 24, 40
    glow(c, DX + DW // 2, DY + DH // 2, 34, ["#1a5ad8", "#2ab8ff", "#9af6ff", "#ffffff"], power=1.4, strength=0.9, ry=40)
    c.rect(DX, DY, DX + DW, DY + DH, "#e8ffff")
    c.rect(DX + 2, DY + 2, DX + DW - 2, DY + DH - 2, "#ffffff")
    for k in range(4):
        c.line([(DX + 4 + k * 5, DY + 3), (DX + 4 + k * 5, DY + DH - 3)], "#9af6ff")
    c.line([(DX, DY), (DX + DW, DY), (DX + DW, DY + DH), (DX, DY + DH), (DX, DY)], "#2ab8ff", 2)
    c.rect(DX - 2, DY - 3, DX + DW + 2, DY - 2, "#1a5ad8")
    c.poly([(DX, DY), (DX - 13, DY + 5), (DX - 13, DY + DH + 3), (DX, DY + DH)], "#e83aa8")           # the door leaf, ajar
    c.poly([(DX - 1, DY + 2), (DX - 11, DY + 6), (DX - 11, DY + DH), (DX - 1, DY + DH - 2)], "#a82a8a")
    c.line([(DX - 12, DY + 6), (DX - 12, DY + DH + 2)], "#ff8ad8")
    shafts(c, (DX + DW // 2, DY + DH), 100, 40, 6, 52, "#9af6ff", t=0.30, seed=e.seed_for("sh"), w0=3, w1=16, power=0.5, floor=HZ)
    # the net: threads between the nodes, some sagging
    rt = e.rng("net")
    pairs = [(0, 1), (1, 3), (2, 4), (4, 5), (3, 5), (4, 6), (6, 7), (7, 8), (5, 8), (1, 9), (0, 10), (10, 2), (9, 3), (4, 10), (6, 11), (11, 7)]
    for (i, j) in pairs:
        _thread(c, nodes[i], nodes[j], "#9af6ff", t=0.65, sag=rt.uniform(-3, 5), dash=2 if (i + j) % 5 == 0 else 0)
    for (nx, ny) in nodes:
        c.set(nx, ny, "#ffffff")
        for (dx, dy) in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            c.set(nx + dx, ny + dy, "#9af6ff")
        c.set(nx + 2, ny, "#2ab8ff"); c.set(nx - 2, ny, "#2ab8ff"); c.set(nx, ny + 2, "#2ab8ff"); c.set(nx, ny - 2, "#2ab8ff")
    # fragments of glyph slabs hanging in the net
    for k, (fx, fy, fw, fh) in enumerate([(30, 30, 9, 6), (52, 26, 7, 8), (70, 36, 8, 5), (108, 44, 10, 6), (124, 36, 6, 7), (86, 22, 7, 5),
                                           (166, 30, 8, 7), (14, 50, 7, 6), (100, 66, 8, 5)]):
        c.rect(fx, fy, fx + fw, fy + fh, "#1a5ad8" if k % 3 else "#a82a8a")
        c.rect(fx, fy, fx + fw, fy, "#9af6ff" if k % 3 else "#ff8ad8")
        _glyph(c, fx + 2, fy + 1, random.Random(e.seed_for("fr%d" % k)), "#07040f", h=min(5, fh - 1))
    # far dunes and the pyramid, black against the lit horizon
    haze(c, HZ - 14, HZ + 2, "#2a8ae8", t=0.55, seed=e.seed_for("hz"), profile="bottom")
    ridge(c, HZ + 4, 2, 9, "#0a0a26", seed=e.seed_for("r0"), lite="#2a5ad8", scale=0.03)
    c.poly([(8, HZ + 6), (30, HZ - 20), (52, HZ + 6)], "#06061c")
    c.line([(30, HZ - 20), (52, HZ + 6)], "#2ee878")
    c.set(30, HZ - 21, "#9affb0")
    ridge(c, 101, 10, 18, "#05030c", seed=e.seed_for("r1"), lite="#1a5ad8", scale=0.02)
    # the small human at the foot of the dune, head back, the pink thread rising to the door
    me = player_fig("necrons", 28, "stand", facing=1)
    me = dict(me, img=tint(me["img"], "#05030c", 0.8))
    px0, py0 = put_figure(c, me, 88, 100, rim_col="#9af6ff", toward=(0, -1))
    hx_, hy_ = me["head"]
    hxp, hyp = px0 + int(hx_), py0 + int(hy_)
    _thread(c, (hxp, hyp - 2), (DX - 4, DY + DH - 6), "#e83aa8", t=0.95, sag=-6, levels=4)
    _thread(c, (hxp + 1, hyp - 2), (DX - 3, DY + DH - 4), "#ff8ad8", t=0.6, sag=-7, levels=4)
    for k in range(4):                                                      # loose threads falling to the sand
        _thread(c, (nodes[3 + k][0], nodes[3 + k][1]), (70 + k * 14, 98), "#2ab8ff", t=0.35, sag=2)
    e.protect += ["#e83aa8", "#ff8ad8", "#9af6ff"]
    vignette_kind(c, "bad", col="#05030c", strength=0.6)


@ending("nec_end_devoured")
def nec_end_devoured(e):
    """BAD.  The Star God's Supper: a dark vault; at the right a cube cage of green bars holding a shard of star-fire
    (white-gold core, cold cyan fringe, thin spikes).  Against its plinth sits an intact human, pale, head
    tilted, smiling; a thread of light still runs from the shard to the human's chest.  A cryptek with a gold halo
    stands small at the left and looks.  Light from the right; long shadows to the left."""
    c = e.c
    # vault: dark plates, a faint glyph wall, floor with light reflected from the cage
    for y in range(78):
        for x in range(192):
            t = 0.12 + 0.2 * (y / 78.0) + (0.05 if (x // 14 + y // 13) % 2 else 0)
            c.set(x, y, ramp_pick(["#050a0a", "#0a1614", "#102420", "#1a3a32"], t, x, y))
    _glyph_wall(c, 6, 8, 80, 54, ["#10302a", "#1a4a3a"], e.seed_for("gw"), cw=5, rh=9, p=0.4)
    hband(c, 78, 107, ["#1a3430", "#10241f", "#0a1614", "#050b0a"], seed=e.seed_for("fl"), rough=0.08)
    c.rect(0, 78, 191, 78, "#2a5a4a")
    for x in range(-60, 260, 24):
        c.line([(96 + (x - 96) * 0.5, 79), (96 + (x - 96) * 1.8, 107)], "#08130f")
    CX, CY = 140, 46
    # the shard's light
    glow(c, CX, CY, 56, ["#16423a", "#2a8a70", "#9affd8", "#fff0b0"], power=1.5, strength=1.0, ry=42)
    light_pool(c, CX - 14, 90, 70, 12, "#fff0b0", t=0.55, power=1.1)
    # the cage: a cube drawn as two squares with bars, lit from inside
    fx0, fy0, fx1, fy1 = 108, 16, 172, 76
    bx0, by0, bx1, by1 = 122, 26, 160, 64
    for (a, b) in [((fx0, fy0), (bx0, by0)), ((fx1, fy0), (bx1, by0)), ((fx0, fy1), (bx0, by1)), ((fx1, fy1), (bx1, by1))]:
        c.line([a, b], "#1a7a44", 1)
    c.line([(bx0, by0), (bx1, by0), (bx1, by1), (bx0, by1), (bx0, by0)], "#2ac868", 1)
    # core: a faceted star-shard with spikes
    c.poly([(CX, CY - 13), (CX + 5, CY - 3), (CX + 10, CY), (CX + 4, CY + 4), (CX, CY + 13), (CX - 5, CY + 3), (CX - 10, CY), (CX - 4, CY - 4)], "#e8c850")
    c.poly([(CX, CY - 9), (CX + 4, CY - 2), (CX + 6, CY), (CX + 2, CY + 3), (CX, CY + 8), (CX - 3, CY + 2), (CX - 6, CY), (CX - 2, CY - 3)], "#fff0b0")
    c.poly([(CX, CY - 4), (CX + 3, CY), (CX, CY + 4), (CX - 3, CY)], "#ffffff")
    for (dx, dy, ln) in [(1, 0, 30), (-1, 0, 30), (0, 1, 22), (0, -1, 22), (1, 1, 16), (-1, -1, 16), (1, -1, 16), (-1, 1, 16)]:
        for k in range(6, ln):
            blend(c, int(CX + dx * k * (1 if dx else 0)), int(CY + dy * k * 0.9), "#fff0b0", 0.9 * (1 - k / float(ln)), 3)
    c.line([(fx0, fy0), (fx1, fy0), (fx1, fy1), (fx0, fy1), (fx0, fy0)], "#3ad86a", 2)
    c.line([(fx0, fy0), (fx0, fy1)], "#9affb0", 1)
    c.line([(fx0, fy0), (fx1, fy0)], "#9affb0", 1)
    c.rect(fx0 - 4, fy1 + 1, fx1 + 4, 90, "#0c1a18")                                    # the plinth
    c.rect(fx0 - 4, fy1 + 1, fx1 + 4, fy1 + 1, "#3a8a6a")
    c.rect(fx0 - 4, fy1 + 2, fx0 - 4, 90, "#2a6a52")
    for (nx, ny) in [(fx0, fy0), (fx1, fy0), (fx0, fy1), (fx1, fy1)]:
        c.rect(nx - 1, ny - 1, nx + 1, ny + 1, "#9affb0")
    # the human shell: seated against the plinth, head tilted, smiling, pale; a thread from the shard
    me = player_fig("necrons", 50, "sit", facing=-1)
    me = dict(me, img=tint(me["img"], "#d8e4d4", 0.5))
    ox, oy = put_figure(c, me, 100, 92, rim_col="#fff0b0", toward=(1, -0.5),
                        shadow=dict(toward_light=(1, 0.15), length=1.6, squash=0.2, col="#02060a", t=0.7))
    hx_, hy_ = me["head"]
    hxp, hyp = ox + int(hx_), oy + int(hy_)
    c.rect(hxp - 2, hyp + 1, hxp, hyp + 1, "#1a2a24")                                   # the smile
    c.set(hxp - 3, hyp, "#1a2a24"); c.set(hxp + 1, hyp, "#1a2a24")
    c.set(hxp - 2, hyp - 1, "#fff0b0")                                                  # eyes catching the light, open
    chest = (hxp + 2, hyp + 7)
    _thread(c, (CX - 12, CY + 8), chest, "#fff0b0", t=0.9, sag=-4, levels=4)
    # the cryptek, small, at the left, with a halo ring
    cx_, cy_, ck = _courtier(c, 36, 96, 36, facing=1, col="#2a4c42", eye="#7aff9a", gold="#c8a028", rim_col="#9affb0",
                             toward=(1, 0), crest=False,
                             shadow=dict(toward_light=(1, 0.15), length=1.6, squash=0.2, col="#02060a", t=0.7))
    hx_, hy_ = ck["head"]
    hxp, hyp = cx_ + int(hx_), cy_ + int(hy_)
    for k in range(18):                                                                 # the halo ring behind the head
        a = k / 18.0 * 6.283
        c.set(hxp + math.cos(a) * 7, hyp - 1 + math.sin(a) * 7.5, "#e8b830")
    c.line([(hxp + 9, hyp + 4), (hxp + 9, hyp + 28)], "#2a5a48")
    c.rect(hxp + 8, hyp + 2, hxp + 10, hyp + 3, "#7aff9a")
    particles(c, "mote", 22, (100, 10, 190, 96), seed=e.seed_for("mote"), cols=("#fff0b0", "#9affd8", "#ffffff"))
    e.protect += ["#fff0b0", "#9affb0"]
    vignette_kind(c, "bad", col="#02060a", strength=0.7)


@ending("nec_end_exhibit")
def nec_end_exhibit(e):
    """BAD.  Item 77: a long gallery in cold steel-teal.  The big case at left holds the human, pale and vivid,
    frozen mid-discovery with a glyph tablet held up and eyes wide; a film of dust lies on the glass and on the
    plinth.  Two necron visitors, dark backs and green eyes, have stopped to look; the nearer one is cropped by
    the frame.  Far cases fade away behind."""
    c = e.c
    HZ = 62
    for y in range(HZ + 1):
        for x in range(192):
            t = 0.2 + 0.5 * (y / float(HZ)) + (0.04 if (x // 16) % 2 else 0)
            c.set(x, y, ramp_pick(["#04090c", "#09151a", "#12272e", "#1c3d46"], t, x, y))
    # far cases, dim, receding along the horizon
    rr = e.rng("far")
    for k in range(9):
        fx = 8 + k * 21 + rr.randint(-3, 3)
        fh = 22 + rr.randint(-3, 3)
        c.rect(fx, HZ - fh, fx + 12, HZ, "#0e2228")
        c.rect(fx, HZ - fh, fx + 12, HZ - fh, "#3a7a88")
        c.rect(fx, HZ - fh, fx, HZ, "#2a5a66")
        c.rect(fx + 5, HZ - 9, fx + 7, HZ - 1, "#050c10")
        c.rect(fx + 5, HZ - 12, fx + 6, HZ - 10, "#050c10")
    haze(c, HZ - 24, HZ + 2, "#1c3d46", t=0.5, seed=e.seed_for("hz"), profile="bottom")
    # floor
    hband(c, HZ + 1, 107, ["#1c3d46", "#12272e", "#09151a", "#04090c"], seed=e.seed_for("fl"), rough=0.08)
    c.rect(0, HZ, 191, HZ, "#2a5a66")
    for x in range(-80, 280, 22):
        c.line([(96 + (x - 96) * 0.25, HZ + 1), (96 + (x - 96) * 1.9, 107)], "#08141a")
    for yy in (HZ + 5, HZ + 12, HZ + 22, HZ + 36):
        c.line([(0, yy), (191, yy)], "#08141a")
    # the big case at left: lit from inside
    CX, CB, CW, CH = 78, 94, 62, 80
    x0, x1, y0 = CX - CW // 2, CX + CW // 2, CB - CH
    light_pool(c, CX, 96, 70, 12, "#bfffff", t=0.5, power=1.1)
    for y in range(y0, CB):
        for x in range(x0, x1 + 1):
            t = 0.25 + 0.5 * (1 - abs(x - CX) / (CW / 2.0)) * (0.6 + 0.4 * (y - y0) / CH)
            c.set(x, y, ramp_pick(["#0e2a30", "#1c5a66", "#3a9aa8", "#8ae0e8", "#e0ffff"], clamp(t * 0.85), x, y))
    me = player_fig("necrons", 62, "reach", facing=1, thick=1.1)
    me = dict(me, img=tint(me["img"], "#dff4f0", 0.62))
    ox, oy = put_figure(c, me, CX - 4, CB - 2, rim_col="#ffffff", toward=(-1, -1))
    hx_, hy_ = me["head"]
    hxp, hyp = ox + int(hx_), oy + int(hy_)
    c.set(hxp + 1, hyp - 1, "#04090c"); c.set(hxp + 3, hyp - 1, "#04090c")                      # eyes wide open
    c.set(hxp + 2, hyp + 1, "#04090c")
    hx2, hy2 = me["hands"][0]
    tx_, ty_ = ox + int(hx2), oy + int(hy2)
    c.rect(tx_, ty_ - 5, tx_ + 6, ty_ + 1, "#e8d8a8")                                            # the tablet held out
    c.rect(tx_, ty_ - 5, tx_ + 6, ty_ - 5, "#ffffff")
    _glyph_marks(c, tx_ + 1, ty_ - 4, 2, "#7a6a3a", e.seed_for("tab"), step=3, h=4)
    # the glass: edges, a bright diagonal sheen, a film of dust
    c.rect(x0, y0, x1, y0, "#e0ffff"); c.rect(x0, y0, x0, CB, "#e0ffff"); c.rect(x1, y0, x1, CB, "#1c5a66")
    c.rect(x0 + 1, y0 + 1, x0 + 1, CB - 2, "#8ae0e8")
    for k in range(6):
        c.line([(x0 + 8 + k * 2, y0 + 3), (x0 + 22 + k * 2, y0 + 30)], "#ffffff" if k < 2 else "#bfffff")
    dn = e.noise("dust")
    for y in range(y0, CB):
        for x in range(x0, x1 + 1):
            v = dn.fbm(x * 0.3, y * 0.15, 3)
            blend(c, x, y, "#8a9a96", clamp((v - 0.5) * 1.6) * (0.55 if y < y0 + 16 else 0.18), 3)
    for x in range(x0, x1 + 1):                                                                  # dust drift on top
        if dn.fbm(x * 0.2, 7.0, 2) > 0.45:
            c.set(x, y0 - 1, "#7a8a88")
    # plinth + plaque (no lettering: bars only)
    c.rect(x0 - 3, CB, x1 + 3, CB + 10, "#0c1c22")
    c.rect(x0 - 3, CB, x1 + 3, CB, "#3a7a88")
    c.rect(x0 + 10, CB + 3, x1 - 10, CB + 8, "#cfd8cc")
    c.rect(x0 + 10, CB + 3, x1 - 10, CB + 3, "#ffffff")
    for k, ln in enumerate([30, 24, 14]):
        c.rect(x0 + 13, CB + 4 + k * 2, x0 + 13 + ln - 1, CB + 4 + k * 2, "#5a6a62")
    # the visitors: solid steel-teal bodies (lit from the case, on the left), green eyes turned toward it
    for (vx, vy, vh, cr) in [(138, 100, 52, True), (182, 118, 82, False)]:
        _courtier(c, vx, vy, vh, facing=-1, col="#2c4e5a", eye="#7affd8", gold="#a88a28", rim_col="#bfffff", toward=(-1, 0),
                  crest=cr, rev=True, shadow=dict(toward_light=(-1, 0.1), length=1.2, squash=0.2, col="#02060a", t=0.6))
    particles(c, "mote", 22, (6, 6, 150, 100), seed=e.seed_for("mote"), cols=("#bfffff", "#8ae0e8", "#ffffff"))
    e.protect += ["#ffffff"]
    vignette_kind(c, "bad", col="#02060a", strength=0.62)


# ==== WAVE 2 (new endings) ====


def _boot(c, x, y, h, col, hi, rim, sole="#07050a", flip=False):
    """one boot in side view, toe to the right (flip: left).  (x, y) = heel-ground point of the shaft's centre,
    h = total height.  Shaft + foot + a heel block + a darker sole, a lit cuff and toe cap."""
    s = -1 if flip else 1
    sw = max(2, int(h * 0.34))                         # shaft width
    fh = max(2, int(h * 0.34))                         # foot height
    fl = max(4, int(h * 0.80))                         # foot length (heel to toe)

    def R(x0, y0, x1, y1, col_):
        a, b = sorted((x + s * x0, x + s * x1))
        c.rect(a, y + y0, b, y + y1, col_)
    R(-sw // 2, -h + 1, sw // 2, -fh, col)                                  # shaft
    R(-sw // 2 - 1, -fh + 1, fl - sw // 2 - 2, -1, col)                     # foot
    R(fl - sw // 2 - 1, -fh + 3 if fh > 3 else -fh + 1, fl - sw // 2, -1, col)   # toe taper
    R(-sw // 2 - 1, -1, fl - sw // 2, 0, sole)                              # sole
    if h >= 14:
        R(-sw // 2, -fh // 2, fl - sw // 2 - 2, -fh // 2, mix(C(col), C(hi), 0.35))        # welt line
    R(-sw // 2 - 1, -3, -sw // 2 + 1, 0, sole)                              # heel block
    R(-sw // 2, -h + 1, sw // 2, -h + 1, rim)                               # lit cuff
    if h >= 8:
        R(-sw // 2, -h + 2, -sw // 2, -fh - 1, mix(C(col), C(rim), 0.45))   # light edge on the shaft (light side)
        R(fl // 2, -fh + 1, fl - sw // 2 - 1, -fh + 1, hi)                  # top of the vamp
        R(fl - sw // 2 - 1, -fh + 3 if fh > 3 else -fh + 1, fl - sw // 2 - 1, -2, hi)   # toe cap
    if h >= 14:
        R(fl // 2 - 1, -fh + 2, fl - sw // 2 - 2, -fh + 2, mix(C(hi), C(col), 0.4))                 # a second sheen row on the vamp
        R(-sw // 2 + 1, -h + 4, sw // 2 - 1, -h + 4, mix(C(col), C(rim), 0.35))        # a buckle strap
        R(-sw // 2 + 1, -h + 8, sw // 2 - 1, -h + 8, mix(C(col), C(rim), 0.35))


@ending("nec_end_inquisition")
def nec_end_inquisition(e):
    """BAD.  Knew Too Much: a grey dust-plain at dusk under a heavy sky with one dull slit of light on the right
    horizon.  A row of boots stands in the sand, toes pointing out toward the slit, receding from the lower left
    toward a little black knot of camp and one figure in a wide hat; the old pairs are grey with dust, the nearest
    pair is new and black -- the row has grown by one.  Beside it a folder lies on the sand with a red stamp-bar.
    Cold light from the right, long shadows falling toward the lower left."""
    c = e.c
    HZ = 52
    sky(c, ["#0e0d18", "#1c1828", "#322a3c", "#5a4650", "#9a6a56", "#d08e60"], 0, HZ)
    sn = e.noise("deck")                                         # heavy cloud deck, darkest on top
    for y in range(0, HZ):
        for x in range(192):
            v = sn.fbm(x * 0.025, y * 0.11, 4)
            k = y / float(HZ)
            if v > 0.42 - 0.18 * k:
                blend(c, x, y, "#100e18", clamp((v - 0.35) * 2.2) * (0.85 - 0.45 * k), 3)
    for x in range(96, 192):                                     # the slit: a thin hot band just over the horizon
        u = 1.0 - abs(x - 158) / 62.0
        if u > 0:
            for k, col in enumerate(["#e0a064", "#f2c07a", "#ffe0a0"]):
                if u > 0.25 + 0.3 * k:
                    c.set(x, HZ - 3 - k, col)
    glow(c, 158, HZ - 2, 56, ["#4a3238", "#7a4c44", "#b87c54", "#e8b078"], power=1.7, strength=0.75, ry=14)
    c.ellipse(160, HZ - 1, 6, 2, "#ffe0a0")
    stars(c, e.seed_for("st"), 24, 0, 18, cols=("#6a6280", "#a8a0c0"))
    # the plain: mauve-grey sand, lit from the slit, colder toward the foreground
    n2 = e.noise("sand")
    for y in range(HZ, 108):
        k = (y - HZ) / float(107 - HZ)
        for x in range(192):
            lit = clamp(1.0 - abs(x - 160) / 150.0) * (1.0 - k) ** 0.6
            v = n2.fbm(x * 0.05 + y * 0.01, y * 0.18, 3)
            t = clamp(0.30 + 0.5 * lit + (v - 0.5) * 0.35 - 0.20 * k)
            c.set(x, y, ramp_pick(["#1e1824", "#342a34", "#5a4a52", "#8a6e68", "#c09478"], t, x, y))
    wr = e.rng("ripples")                                        # wind ripples
    for _ in range(46):
        yy = wr.randint(HZ + 3, 106)
        xx = wr.randint(0, 186)
        ln = wr.randint(3, 8 + (yy - HZ) // 5)
        for i in range(ln):
            blend(c, xx + i, yy, "#b89a86", 0.40 * (1 - (yy - HZ) / 70.0) + 0.08, 3)
    # far camp, black tents with a few lamps
    for (tx, tw, th) in [(100, 7, 4), (109, 5, 3), (120, 9, 5), (128, 6, 3)]:
        c.poly([(tx - tw // 2, HZ + 1), (tx, HZ + 1 - th), (tx + tw // 2, HZ + 1)], "#1a141a")
    for (lx, ly) in [(102, HZ), (121, HZ - 1), (127, HZ)]:
        c.set(lx, ly, "#ffc870")
    # Mordane: a small wide-hat silhouette at the far end of the row, against the slit
    mord = fig(12, "stand", "#120e14", robe=0.6, facing=-1)
    mx, my = put_figure(c, mord, 150, HZ + 2, rim_col="#e0a064", toward=(1, -0.2))
    hxm, hym = mord["head"]
    c.rect(mx + int(hxm) - 3, my + int(hym) - 1, mx + int(hxm) + 3, my + int(hym) - 1, "#120e14")
    c.rect(mx + int(hxm) - 1, my + int(hym) - 2, mx + int(hxm) + 1, my + int(hym) - 2, "#120e14")
    # the row: pairs of side-view boots, toes toward the slit, perspective from lower left to the far end
    light_pool(c, 34, 97, 46, 13, "#b89484", t=0.42, power=0.9)
    pairs = [(18, 98, 27), (66, 87, 18), (96, 80, 13), (116, 75, 10), (129, 71, 8), (139, 68, 6), (147, 66, 5), (153, 64, 4)]
    for i, (bx, by, bh) in enumerate(pairs):
        k = i / float(len(pairs) - 1)
        col = mix(C("#0e0a10"), C("#8a7a70"), 0.0 if i == 0 else 0.15 + 0.55 * k)
        hi = mix(C("#6a5448"), C("#c0a890"), 0.0 if i == 0 else 0.5 * k)
        rim_ = "#e0a064" if i else "#f0b070"
        # shadow first: long, falling to the lower left (light is on the right)
        sl = int(bh * 1.4) + 3
        for j in range(sl):
            for dy in (0, 1, 2) if bh > 12 else (0, 1):
                blend(c, bx - j + 2, by + 1 + dy + j // 7, "#0c0812", 0.42 * (1 - j / float(sl)), 3)
        _boot(c, bx + int(bh * 0.40), by - max(1, int(bh * 0.08)), bh, mix(col, C("#8a7a70"), 0.12), hi, rim_)   # the far boot of the pair
        _boot(c, bx, by, bh, col, hi, rim_)
        if i == 0:                                                # a skin of dust already on the new pair
            for dx in range(-3, 18):
                if (dx * 5 + 2) % 4 < 2:
                    c.set(bx + dx, by - 9 - (dx % 3), "#5a4a52")
    # the file on the sand: a folder with a red stamp bar (no lettering)
    FX, FY = 112, 99
    c.poly([(FX - 11, FY), (FX + 11, FY), (FX + 9, FY - 10), (FX - 9, FY - 10)], "#c9b486")
    c.poly([(FX - 11, FY), (FX - 9, FY - 10), (FX - 9, FY - 8), (FX - 10, FY)], "#8a7650")
    c.rect(FX - 9, FY - 10, FX + 9, FY - 10, "#efe2b8")
    c.rect(FX - 5, FY - 8, FX + 5, FY - 4, "#b8231a")
    c.rect(FX - 5, FY - 8, FX + 5, FY - 8, "#e6483a")
    c.rect(FX - 3, FY - 6, FX + 3, FY - 6, "#7a1410")
    c.rect(FX - 7, FY - 2, FX + 6, FY - 2, "#9a8660")
    for x in range(FX - 14, FX + 12):
        blend(c, x - 3, FY + 1, "#0a0810", 0.62, 3)
        blend(c, x - 6, FY + 2, "#0a0810", 0.40, 3)
    e.protect += ["#b8231a", "#e6483a"]
    particles(c, "ash", 20, (0, 44, 190, 104), seed=e.seed_for("dust"), cols=("#8a7a78", "#a89888"), wind=(2, 0))
    vignette_kind(c, "bad", col="#0a0812", strength=0.5, inner=0.66)


def _flayer(c, x, y, h, facing=1, col="#05080e", eye="#7aff9a", strips="#a8705e", rim_col=None, toward=(-1, -1),
            pose="hunch", n_strips=5, seed=1, robe=0.0, hood=True):
    """a Flayed One: a hunched hooded silhouette with two green eyes and ragged strips of hide (warm, wrong) hanging
    from the shoulders / hands.  Feet at (x, y).  Returns (left, top) of the figure image and the figure dict."""
    f = fig(h, pose, col, facing=facing, hood=hood, robe=robe, thick=1.05)
    ox, oy = put_figure(c, f, x, y, rim_col=rim_col, toward=toward)
    hx_, hy_ = f["head"]
    hxp, hyp = ox + int(round(hx_)), oy + int(round(hy_))
    d = 1 if facing > 0 else -1
    if h >= 12:
        c.set(hxp + d, hyp, eye)
        if h >= 20:
            c.set(hxp + d + (2 * d if h >= 30 else d), hyp, eye)
    else:
        c.set(hxp + d, hyp, eye)
    rr = random.Random(seed)
    if h >= 14 and n_strips:
        sx0 = hxp - d * max(2, h // 9)
        for i in range(n_strips):                                   # hide strips: short ragged vertical lines
            px_ = sx0 + (i - n_strips // 2) * max(1, h // 14) + rr.randint(-1, 1)
            py_ = hyp + max(3, h // 8) + rr.randint(0, max(1, h // 8))
            ln = rr.randint(max(2, h // 10), max(3, h // 4))
            c.rect(px_, py_, px_, py_ + ln, strips)
            if ln > 3 and rr.random() < 0.5:
                c.set(px_ + 1, py_ + ln - 1, strips)
    return ox, oy, f


@ending("nec_end_flayer")
def nec_end_flayer(e):
    """BAD.  Cold: a vault without light.  A pale cold shaft from a breach in the upper left falls on frosted stone;
    in it two figures walk away to the left hand in hand -- Lord Meruk, tall and hooded, and the human behind him
    in the old coat.  Around them, in three depths, the Flayed Ones crowd the dark, green-eyed, with strips of
    warm-coloured hide hanging from them -- the only warm colour in the picture.  Two huge dark ones frame the edges."""
    c = e.c
    HZ = 66
    # cold hall: dark blue stone, a pale mist band to silhouette the crowd against
    for y in range(108):
        for x in range(192):
            k = y / 108.0
            m = 1.0 - abs(y - 56) / 44.0                               # mist peaks mid-height
            t = 0.30 + 0.62 * clamp(m) ** 1.1 + (0.04 if (x // 18) % 2 else 0)
            c.set(x, y, ramp_pick(["#04060c", "#0a1018", "#142030", "#243a50", "#3e5c76", "#6a8aa4"], t, x, y))
    # pillars and arches fading into the mist
    for px_ in (14, 46, 92, 140, 176):
        c.rect(px_, 0, px_ + 4, HZ, "#070b12")
        c.rect(px_ + 4, 0, px_ + 4, HZ, "#16222e")
    for y in range(0, 26):                                            # ceiling falls away: dark vault
        for x in range(192):
            blend(c, x, y, "#03050a", 0.5 * (1 - y / 26.0), 3)
    # the breach: a ragged hole in the ceiling top-left, pale light
    bx, by = 52, 0
    for yy in range(0, 12):
        for xx in range(bx - 14 + yy // 3, bx + 14 - yy // 2):
            c.set(xx, yy, ramp_pick(["#8ab0c8", "#c8e4f0", "#f0fbff"], 0.5 + 0.5 * (1 - yy / 12.0), xx, yy))
    glow(c, bx, 4, 22, ["#243a50", "#5a84a0", "#a8d0e0"], power=1.4, strength=0.9, ry=14)
    shafts(c, (bx, 4), 62, 34, 6, 120, "#d8f0ff", t=0.30, seed=e.seed_for("sh"), w0=4, w1=20, power=0.5, floor=100)
    # floor: frost-dark stone, lit under the shaft
    hband(c, HZ, 107, ["#3a566c", "#22384c", "#14222f", "#0a121a"], seed=e.seed_for("fl"), rough=0.08)
    c.rect(0, HZ, 191, HZ, "#4a6a84")
    for x in range(-60, 260, 26):
        c.line([(96 + (x - 96) * 0.4, HZ + 1), (96 + (x - 96) * 1.9, 107)], "#0a121c")
    light_pool(c, 92, 94, 70, 16, "#bfe4f4", t=0.62, power=0.9, levels=4)
    light_pool(c, 92, 94, 34, 9, "#e8f8ff", t=0.45, power=1.0, levels=4)
    fr = e.rng("frost")                                                # frost sparkle on the floor
    for _ in range(60):
        c.set(fr.randint(30, 160), fr.randint(HZ + 3, 104), "#cfe8f4" if fr.random() < 0.5 else "#8ab0c8")
    # the crowd: far row (small, against the mist), mid row, with strips of warm hide
    far = [(8, 22), (22, 18), (40, 21), (60, 17), (76, 20), (104, 18), (120, 22), (136, 17), (152, 21), (168, 18), (184, 22)]
    for i, (fx_, fh) in enumerate(far):
        _flayer(c, fx_, HZ + 2 + (i % 3), fh, facing=1 if i % 2 else -1, col="#0a121c", strips="#8a5a4c", n_strips=3,
                seed=e.seed_for("f%d" % i), pose="hunch")
    mid = [(10, 33), (30, 36), (70, 31), (126, 34), (150, 38), (176, 33)]
    for i, (fx_, fh) in enumerate(mid):
        _flayer(c, fx_, HZ + 12 + (i % 2) * 3, fh, facing=1 if i % 2 else -1, col="#060b12", strips="#a8705e", n_strips=5,
                seed=e.seed_for("m%d" % i), pose="hunch", rim_col="#4a6a84", toward=(-1, -1))
    haze(c, HZ - 6, HZ + 10, "#3e5c76", t=0.35, seed=e.seed_for("hz"), profile="mid")
    # Lord Meruk: tall, hooded, in a long ragged cloak, leading by the hand to the left
    mer_f = fig(66, "walk", "#04070c", facing=-1, hood=True, robe=0.85, thick=1.1)
    mox, moy = put_figure(c, mer_f, 82, 101, rim_col="#9ac4dc", toward=(-1, -1),
                          shadow=dict(toward_light=(-1, 0.1), length=1.1, squash=0.22, col="#03050a", t=0.6))
    hx_, hy_ = mer_f["head"]
    hxm, hym = mox + int(hx_), moy + int(hy_)
    c.set(hxm - 1, hym, "#7aff9a"); c.set(hxm - 3, hym, "#7aff9a")
    rr = e.rng("meruk")
    for i in range(9):                                                 # hide strips hanging from his shoulders and cloak
        sx_ = hxm + 2 + i * 2 - 6
        sy_ = hym + 8 + rr.randint(0, 5)
        ln = rr.randint(5, 12)
        c.rect(sx_, sy_, sx_, sy_ + ln, "#b8806c" if i % 3 else "#8a5a4c")
    # his reaching hand and the human's hand joined behind him
    me = player_fig("necrons", 46, "walk", facing=-1, thick=1.1)
    me = dict(me, img=tint(me["img"], "#16283a", 0.42))
    me_ox, me_oy = put_figure(c, me, 113, 101, rim_col="#cfe8f4", toward=(-1, -1),
                              shadow=dict(toward_light=(-1, 0.1), length=1.1, squash=0.22, col="#03050a", t=0.6))
    mh = me["hands"][0]
    meh = (me_ox + int(mh[0]), me_oy + int(mh[1]))
    mh2 = mer_f["hands"][1]
    mrh = (mox + int(mh2[0]), moy + int(mh2[1]))
    c.line([mrh, (meh[0], meh[1])], "#04070c", 2)
    c.rect(meh[0] - 2, meh[1] - 1, meh[0] + 1, meh[1] + 1, "#8ab0c8")           # the joined hands, pale and cold
    c.set(meh[0] - 3, meh[1] - 1, "#cfe8f4"); c.set(meh[0] - 3, meh[1] + 1, "#cfe8f4"); c.set(meh[0] - 2, meh[1] + 2, "#cfe8f4")
    c.set(meh[0] - 1, meh[1], "#e8f8ff")
    hx_, hy_ = me["head"]
    c.set(me_ox + int(hx_) - 2, me_oy + int(hy_), "#cfe8f4")           # the human's eye: pale, looking at the hide
    # two huge dark ones frame the edges and lean in
    _flayer(c, 6, 118, 96, facing=1, col="#050a12", strips="#7a4a3c", n_strips=7, seed=e.seed_for("L"), pose="hunch",
            rim_col="#2a4258", toward=(1, -1))
    _flayer(c, 190, 120, 104, facing=-1, col="#050a12", strips="#7a4a3c", n_strips=7, seed=e.seed_for("R"), pose="hunch",
            rim_col="#2a4258", toward=(-1, -1))
    particles(c, "snow", 28, (0, 8, 190, 100), seed=e.seed_for("snow"), cols=("#cfe8f4", "#8ab0c8"))
    e.protect += ["#7aff9a", "#cfe8f4"]
    vignette_kind(c, "bad", col="#02040a", strength=0.5, inner=0.66)


def _courtier(c, x, y, h, facing=1, col="#46645a", eye="#7aff9a", gold="#d8a828", rim_col=None, toward=(1, 0),
              shadow=None, crest=True, rev=False):
    """a necron courtier at attention: thin dark body, a gold collar and a tall gold crest, two green eyes."""
    f = fig(h, "stand", col, facing=facing, thick=0.66)
    f = dict(f, img=_lr_shade(f["img"], mix(C(col), C("#000000"), 0.55), mix(C(col), C("#ffffff"), 0.18), rev=rev))
    ox, oy = put_figure(c, f, x, y, rim_col=rim_col, toward=toward, shadow=shadow)
    hx_, hy_ = f["head"]
    hxp, hyp = ox + int(round(hx_)), oy + int(round(hy_))
    d = 1 if facing > 0 else -1
    _skull(c, hxp, hyp, facing, eye=eye, s=1.0 if h >= 40 else 0.8,
           lit="#e0f0e8" if h >= 40 else "#a0b4aa", mid="#a0b4aa" if h >= 40 else "#70867c", dark="#5a7068" if h >= 40 else "#3c5048")
    sh = max(2, int(h * 0.075))
    c.rect(hxp - 3, hyp + sh + 1, hxp + 3, hyp + sh + 2, gold)            # collar
    if crest:
        top = hyp - max(4, int(h * 0.10))
        c.poly([(hxp - 2, hyp - 3), (hxp + 2, hyp - 3), (hxp + 1, top), (hxp - 1, top)], gold)
    return ox, oy, f


@ending("nec_end_metal")
def nec_end_metal(e):
    """BAD.  The Undying Courtier: the throne hall.  At the far right the overlord sits on a gold dais under a huge
    green gem; the court stands in two ranks facing him -- thin dark bodies, gold collars and crests, green eyes.
    In the front rank, third from the left, one of them wears a human's coat: the body is still in the old
    clothes, the head a silver skull with two green eyes.  Green-gold light from the right, long shadows to the left."""
    c = e.c
    HZ = 82
    # hall: dark teal plates; tall pillars with gold bands; glyph panels between them
    for y in range(108):
        for x in range(192):
            t = 0.08 + 0.26 * clamp(1.0 - abs(y - 50) / 60.0) + 0.16 * clamp(1.0 - abs(x - 172) / 120.0) \
                + (0.04 if (x // 20 + y // 14) % 2 else 0.0)
            c.set(x, y, ramp_pick(["#040a0a", "#0a1a18", "#12302a", "#1c4a3e", "#2e6a58"], t, x, y))
    for px_ in (8, 56, 104, 140):
        c.rect(px_, 0, px_ + 9, HZ, "#06100e")
        c.rect(px_ + 9, 0, px_ + 9, HZ, "#2a6a52")
        c.rect(px_, 0, px_, HZ, "#0e2a22")
        for yy in (14, 36, 58):
            c.rect(px_, yy, px_ + 9, yy + 2, "#8a6a1c")
            c.rect(px_, yy, px_ + 9, yy, "#d8a828")
    _glyph_wall(c, 20, 10, 52, 70, ["#1e5a44", "#2e7a5c"], e.seed_for("gw"), cw=4, rh=9, p=0.5)
    _glyph_wall(c, 68, 10, 100, 70, ["#1e5a44", "#2e7a5c"], e.seed_for("gw2"), cw=4, rh=9, p=0.5)
    for y in range(108):                                                  # keep the left of the hall low-lit
        for x in range(0, 150):
            blend(c, x, y, "#02080a", 0.32 * clamp(1.0 - (x - 100) / 60.0) if x > 100 else 0.32, 3)
    # the dais: gold steps at the right, the overlord seated high, the gem behind him
    GX, GY = 168, 36
    glow(c, GX, GY, 54, ["#12302a", "#2e7a5c", "#7affb0", "#d8ffd8"], power=1.3, strength=1.0, ry=46)
    c.ellipse(GX, GY, 15, 15, "#12302a")
    c.ellipse(GX, GY, 12, 12, "#3ad86a")
    c.ellipse(GX - 2, GY - 2, 8, 8, "#9affb0")
    c.ellipse(GX - 3, GY - 3, 4, 4, "#e8ffe8")
    for k in range(5):                                                     # rays from the gem down onto the court
        a = math.radians(125 + k * 14)
        for r in range(18, 70):
            blend(c, int(GX + math.cos(a) * r), int(GY + math.sin(a) * r), "#9affb0", 0.25 * (1 - r / 70.0), 3)
    lord = spr("necron_lord", 1, mirror=True, tint_to="#06140c", tint_t=0.35, crop=(0, 0, 64, 52), bottom_fade=8)
    lord = rim(lord, "#d8ffb0", (-1, -1), min_run=4)
    place(c, lord, GX - 3, 68, anchor="bm")
    for k in range(5):                                                     # steps
        y0 = 66 + k * 4
        c.rect(GX - 36 + k * 5, y0, 191, y0 + 3, "#6a4e14" if k % 2 else "#8a6a1c")
        c.rect(GX - 36 + k * 5, y0, 191, y0, "#f0c038")
    # floor: polished teal, a spill of green-gold light running left from the dais
    hband(c, HZ, 107, ["#1c4a3e", "#12302a", "#0a1a18", "#040a0a"], seed=e.seed_for("fl"), rough=0.06)
    c.rect(0, HZ, 191, HZ, "#2e7a5c")
    for x in range(-60, 260, 26):
        c.line([(96 + (x - 96) * 0.4, HZ + 1), (96 + (x - 96) * 1.9, 107)], "#08140f")
    light_pool(c, 130, 96, 80, 12, "#9affb0", t=0.55, power=0.9, levels=4)
    light_pool(c, 150, 92, 40, 8, "#f0e090", t=0.4, power=1.0)
    # back rank, smaller, in the mist
    haze(c, 40, HZ, "#2e6a58", t=0.25, seed=e.seed_for("hz"), profile="bottom")
    for (bx, bh) in [(34, 36), (64, 37), (97, 36), (128, 38)]:
        _courtier(c, bx, HZ - 1, bh, facing=1, col="#2a463e", eye="#5aca7a", gold="#9a7a22", rim_col="#4aa86a",
                  shadow=dict(toward_light=(1, 0.1), length=0.9, squash=0.2, col="#02060a", t=0.5))
    # front rank, large: three courtiers and the one in the coat (third)
    SH = dict(toward_light=(1, 0.1), length=1.1, squash=0.2, col="#02060a", t=0.6)
    for (bx, bh) in [(20, 60), (58, 61)]:
        _courtier(c, bx, 101, bh, facing=1, rim_col="#9affb0", shadow=SH)
    me = player_fig("necrons", 58, "stand", facing=1, thick=0.78)
    me = dict(me, img=tint(me["img"], "#0a1816", 0.5))
    _im = me["img"]                                                        # take the human head off: a skull goes there
    _px = _im.load()
    _hx, _hy = me["head"]
    for _y in range(_im.height):
        for _x in range(_im.width):
            if math.hypot(_x - _hx, _y - _hy) <= 0.088 * 58 * 1.15 and _y <= _hy + 1:
                _px[_x, _y] = (0, 0, 0, 0)
    mx, my = put_figure(c, me, 96, 101, rim_col="#e8f8c0", toward=(1, 0), shadow=SH)
    hx_, hy_ = me["head"]
    hxp, hyp = mx + int(round(hx_)), my + int(round(hy_))
    _skull(c, hxp, hyp, 1, s=1.0)
    c.rect(hxp - 3, hyp + 7, hxp + 3, hyp + 8, "#d8a828")                  # a courtier's collar over the coat
    for (bx, bh) in [(134, 60)]:
        _courtier(c, bx, 101, bh, facing=1, rim_col="#9affb0", shadow=SH)
    particles(c, "mote", 22, (6, 10, 186, 98), seed=e.seed_for("mote"), cols=("#9affb0", "#f0e090", "#e8ffe8"))
    e.protect += ["#7aff9a", "#e8f8c0"]
    vignette_kind(c, "bad", col="#02080a", strength=0.62, inner=0.6)


@ending("nec_death_hp")
def nec_death_hp(e):
    """DEATH.  A Tidy Dune: night outside the tomb.  The fallen human has become a long smooth mound of sand in the
    foreground, person-shaped, its ridge lit by a cold moon at the upper right; beside it the lamp, pen and notebook
    are stacked square and the lamp still burns, a tiny warm point.  Four metal scarabs stand in an even row beside
    the stack; behind, evenly spaced, the earlier mounds lead off toward the black pyramid with its green point."""
    c = e.c
    HZ = 60
    sky(c, ["#03040a", "#060a16", "#0a1426", "#14263c", "#27425a", "#4a6a7c"], 0, HZ)
    stars(c, e.seed_for("st"), 70, 0, 44, cols=("#5a6a90", "#a8b8d8", "#ffffff"))
    MX, MY = 162, 20
    glow(c, MX, MY, 18, ["#0a1426", "#1e3652", "#5a7a94", "#c8dae6"], power=1.8, strength=0.9, ry=16)
    c.ellipse(MX, MY, 3, 3, "#dfe9ee")
    c.ellipse(MX - 1, MY - 1, 2, 2, "#ffffff")
    # far dunes and the black pyramid with its green point
    ridge(c, HZ + 3, 2, 8, "#0c1626", seed=e.seed_for("r0"), lite="#3a5a74", scale=0.025)
    PX, PB, PH, PW = 38, HZ + 3, 30, 30
    c.poly([(PX - PW, PB), (PX, PB - PH), (PX, PB)], "#14202c")
    c.poly([(PX, PB), (PX, PB - PH), (PX + PW, PB)], "#050810")
    c.line([(PX - PW, PB), (PX, PB - PH)], "#2c9a58")
    c.line([(PX, PB - PH), (PX + PW, PB)], "#0e3a24")
    glow(c, PX, PB - PH - 1, 8, ["#0e3a24", "#3ad86a", "#c8ffd8"], power=1.2, strength=0.9)
    haze(c, HZ - 6, HZ + 8, "#2e4a62", t=0.35, seed=e.seed_for("hz"), profile="mid")
    # sand: cold blue-grey, lit from the right
    sn = e.noise("sand")
    for y in range(HZ + 3, 108):
        k = (y - HZ) / 48.0
        for x in range(192):
            v = sn.fbm(x * 0.04, y * 0.16, 3)
            lit = clamp(1.0 - abs(x - 150) / 170.0)
            t = clamp(0.28 + 0.34 * lit * (1.0 - k * 0.6) + (v - 0.5) * 0.3 - 0.18 * k)
            c.set(x, y, ramp_pick(["#07080f", "#10121e", "#1c2234", "#2c364c", "#445670"], t, x, y))
    # the earlier mounds: evenly spaced, each with a tiny square stack beside it, receding toward the pyramid
    def mound(cx, base, w, h, col_hi="#7a9ab0", col_mid="#2c3a52", col_lo="#10121e", steps=1):
        for x in range(int(cx - w), int(cx + w) + 1):
            u = (x - cx) / float(w)
            if abs(u) > 1:
                continue
            top = int(base - h * (1 - u * u) ** 0.9)
            for y in range(top, int(base) + 1):
                tt = 0.5 + 0.55 * u + 0.35 * (y - top) / max(1, base - top) * -1
                col = col_hi if (y == top and u > -0.2) else (col_mid if tt > 0.3 else col_lo)
                c.set(x, y, col)
    for i, (mx_, mb, mw, mh) in enumerate([(104, HZ + 8, 9, 4), (126, HZ + 12, 12, 5), (152, HZ + 17, 15, 7), (184, HZ + 24, 19, 9)]):
        mound(mx_, mb, mw, mh)
        c.rect(mx_ + mw + 3, mb - 2, mx_ + mw + 4, mb, "#3a4a60")                # a tiny neat stack
        c.set(mx_ + mw + 3, mb - 3, "#d8b068") if i % 2 == 0 else None
    # the main mound: a long person-shaped heap (head left, feet right), cold moon along its ridge
    BX0, BX1, BASE = 18, 132, 99
    def prof(x):
        g = lambda m, s, a: a * math.exp(-((x - m) / s) ** 2)
        return 2 + g(32, 11, 9) + g(66, 16, 9) + g(100, 10, 5.5) + g(122, 7, 3)
    tops = {}
    for x in range(BX0, BX1 + 1):
        edge = clamp(min(x - BX0, BX1 - x) / 9.0) ** 0.6
        tops[x] = int(BASE - prof(x) * edge * 1.15)
    sm = dict(tops)
    for x in range(BX0 + 2, BX1 - 1):                                      # smooth the ridge: a heap, not a rock
        sm[x] = int(round(sum(tops[x + k] for k in (-2, -1, 0, 1, 2)) / 5.0))
    tops = sm
    for x in range(BX0, BX1 + 1):
        top = tops[x]
        slope = (tops[min(BX1, x + 2)] - tops[max(BX0, x - 2)]) / 4.0                  # + = descending to the right
        for y in range(top, BASE + 5):
            d = (y - top) / max(1.0, float(BASE + 5 - top))
            lit = clamp(0.92 - slope * 0.55 - d * 0.62 + (0.12 if y == top else 0))
            c.set(x, y, ramp_pick(["#0a0b14", "#161a2a", "#28324a", "#44566e", "#7a9ab0"], lit, x, y))
        c.set(x, top, "#a8c0d0" if slope < 0.4 else "#44566e")
    for k in range(7):                                                     # sand ripples along the mound
        yy = BASE - 3 - k
        for x in range(BX0 + 8 + k, BX1 - 8 - k, 5):
            if tops.get(x, 999) < yy - 1 and (x + k) % 2 == 0:
                blend(c, x, yy, "#8aa8bc", 0.45, 3)
    c.rect(BX0 + 24, tops[BX0 + 24] + 2, BX0 + 27, tops[BX0 + 24] + 3, "#6a5c44")      # the coat collar showing at the shoulder
    c.rect(BX0 + 24, tops[BX0 + 24] + 2, BX0 + 27, tops[BX0 + 24] + 2, "#a89870")
    # shadow of the mound on the sand, falling away from the moon (to the left)
    for x in range(BX0 - 14, BX1):
        blend(c, x, BASE + 5, "#05060c", 0.6, 3)
        blend(c, x - 2, BASE + 6, "#05060c", 0.45, 3)
    # the stack: notebook, pen, lamp -- aligned, square; the lamp still lit
    SX, SY = 172, 102
    glow(c, SX, SY - 8, 20, ["#2a2218", "#6a4a28", "#d89a40", "#ffe0a0"], power=1.8, strength=0.8, ry=15)
    c.rect(SX - 8, SY - 3, SX + 8, SY, "#4a3c2a")
    c.rect(SX - 8, SY - 3, SX + 8, SY - 3, "#8a7450")
    c.rect(SX - 8, SY - 2, SX - 8, SY, "#2a2216")
    c.rect(SX - 7, SY - 5, SX + 7, SY - 4, "#d8c890")
    c.rect(SX - 7, SY - 5, SX + 7, SY - 5, "#efe2b8")
    c.rect(SX - 6, SY - 6, SX + 5, SY - 6, "#1a1a20")                        # the pen, laid square across the notebook
    c.rect(SX + 5, SY - 6, SX + 6, SY - 6, "#c8a028")
    c.rect(SX - 3, SY - 13, SX + 2, SY - 7, "#2a3a44")                       # the lamp: glass, flame, base
    c.rect(SX - 2, SY - 12, SX + 1, SY - 8, "#ffc860")
    c.rect(SX - 1, SY - 11, SX, SY - 9, "#fff0b0")
    c.rect(SX - 3, SY - 14, SX + 2, SY - 14, "#4a5a66")
    c.rect(SX - 3, SY - 7, SX + 2, SY - 7, "#4a5a66")
    for x in range(SX - 16, SX + 8):                                         # its small square shadow
        blend(c, x - 6, SY + 1, "#05060c", 0.5, 3)
    # four scarabs in an even row on the sand, half size, all facing the mound (left)
    for k in range(4):
        sx_ = 96 + k * 16
        im = spr("canoptek_scarab", 1, mirror=False, tint_to="#06080e", tint_t=0.5)
        im = im.resize((im.width // 2, im.height // 2), Image.BOX)
        pxs = im.load()
        for yy in range(im.height):
            for xx in range(im.width):
                if pxs[xx, yy][3] < 140:
                    pxs[xx, yy] = (0, 0, 0, 0)
        place(c, rim(im, "#9ab8c8", (1, -1), min_run=2), sx_, 105, anchor="bm")
        c.set(sx_ - 4, 99, "#7aff9a")
    particles(c, "mote", 14, (0, 62, 190, 104), seed=e.seed_for("mote"), cols=("#8aa8bc", "#5a7288"))
    e.protect += ["#ffc860", "#fff0b0", "#7aff9a"]
    vignette_kind(c, "death", col="#020306", strength=0.8, inner=0.45)


@ending("nec_death_corruption")
def nec_death_corruption(e):
    """DEATH.  Bottom of the Cup: a round stone basin sunk in the floor of a black vault, seen from slightly above,
    its inner wall banded with dry tide-rings that step down to a bare, drained floor.  A narrow cold column of light
    falls from an oculus with one hard white star in it, and in the column, backlit, the husk walks on -- the old
    coat, pale star-coloured eyes, a faint smile -- while the last motes rise from it toward the star."""
    c = e.c
    CX, CY = 98, 90
    # vault: near black, a dim wall of niches at the horizon band, nothing else
    for y in range(108):
        for x in range(192):
            t = 0.10 + 0.18 * clamp(1.0 - abs(y - 52) / 40.0) + (0.03 if (x // 16) % 2 else 0)
            c.set(x, y, ramp_pick(["#020406", "#06101a", "#0c1e2a", "#16323e"], t, x, y))
    rr = e.rng("niches")
    for nx in range(14):
        x0 = 4 + nx * 14 + rr.randint(-1, 1)
        c.rect(x0, 36, x0 + 6, 64, "#03070c")
        c.rect(x0, 36, x0 + 6, 36, "#1c3e4a")
        if rr.random() < 0.6:
            c.set(x0 + 2, 44, "#1e6a46"); c.set(x0 + 4, 44, "#1e6a46")
    # the oculus: a round hole at the top, one hard star in it
    OX, OY = 96, 5
    c.ellipse(OX, OY, 16, 8, "#03060c")
    c.ellipse(OX, OY, 13, 6, "#0a1830")
    stars(c, e.seed_for("st"), 22, 0, 10, cols=("#6a8ab0", "#a8c8e8"), mask=lambda x, y: ((x - OX) / 13.0) ** 2 + ((y - OY) / 6.0) ** 2 < 1.0)
    glow(c, OX + 2, OY, 13, ["#14243c", "#4a7a9c", "#c8ecff", "#ffffff"], power=1.6, strength=1.0, ry=8)
    c.rect(OX + 1, OY - 1, OX + 3, OY + 1, "#ffffff")
    for k in range(2, 9):
        c.set(OX + 2 + k, OY, "#e8ffff" if k < 5 else "#8ac0d0"); c.set(OX + 2 - k, OY, "#e8ffff" if k < 5 else "#8ac0d0")
        if k < 6:
            c.set(OX + 2, OY + k, "#e8ffff" if k < 4 else "#8ac0d0"); c.set(OX + 2, OY - k, "#e8ffff" if k < 4 else "#8ac0d0")
    # the column of light: backlights the husk; wide and pale near the floor
    for y in range(9, CY + 2):
        k = (y - 9) / float(CY - 9)
        hw = 5 + 17 * k
        for x in range(int(OX - hw), int(OX + hw) + 1):
            edge = 1.0 - abs(x - OX) / hw
            blend(c, x, y, "#bfe4f4", 0.10 + 0.55 * k * (0.35 + 0.65 * edge), 4)
    # the basin: floor ellipse, far rim lit, inner wall banded with dry rings stepping down to the bare bottom
    def ring_pts(rx, ry, cy):
        return [(CX + rx * math.cos(a), cy + ry * math.sin(a)) for a in [i * math.pi / 90.0 for i in range(0, 181)]]
    for y in range(CY - 20, 108):
        for x in range(0, 192):
            d = ((x - CX) / 82.0) ** 2 + ((y - CY - 2) / 17.0) ** 2
            if d <= 1.0:
                # inside the basin: rings stepping down
                lev = d ** 0.5
                band = int(lev * 6)
                base_cols = ["#2e5058", "#244650", "#1c3a44", "#142c36", "#0e222c", "#091820"]
                col = base_cols[min(5, 5 - band if False else band)]
                c.set(x, y, col)
            elif d <= 1.18:
                c.set(x, y, "#3a6672" if y < CY + 2 else "#16303a")                       # the stone lip
            else:
                if y > CY - 6:
                    c.set(x, y, ramp_pick(["#0a161e", "#060e14", "#03070c"], (y - CY) / 30.0, x, y))
    # the dry tide-rings: pale thin lines on the wall, wavering
    for i, f in enumerate([0.92, 0.78, 0.64, 0.50, 0.37, 0.25]):
        for (px_, py_) in ring_pts(82 * f, 17 * f, CY + 2):
            if int(px_ * 1.0 + py_) % 6:
                c.set(px_, py_, "#7aa4ac" if i % 2 == 0 else "#5a8690")
    light_pool(c, CX, CY, 24, 8, "#e8ffff", t=0.6, power=1.0, levels=4)            # the bare bottom, lit by the column
    light_pool(c, CX, CY - 1, 12, 4, "#ffffff", t=0.5, power=1.0, levels=4)
    # the husk: a dark body in the old coat, backlit, walking on
    me = player_fig("necrons", 50, "walk", facing=1, thick=1.0)
    me = dict(me, img=tint(me["img"], "#0a1218", 0.74))
    mx, my = put_figure(c, me, CX - 2, CY, rim_col="#cfeef8", toward=(-1, -1),
                        shadow=dict(toward_light=(0.05, 0.9), length=0.1, squash=0.35, col="#02060a", t=0.8))
    hx_, hy_ = me["head"]
    hxp, hyp = mx + int(round(hx_)), my + int(round(hy_))
    c.set(hxp + 1, hyp - 1, "#ffffff"); c.set(hxp + 3, hyp - 1, "#ffffff")        # star-coloured eyes, open
    c.set(hxp + 1, hyp - 2, "#8ac0d0"); c.set(hxp + 3, hyp - 2, "#8ac0d0")
    c.set(hxp, hyp + 1, "#cfeef8"); c.set(hxp + 1, hyp + 2, "#cfeef8"); c.set(hxp + 2, hyp + 2, "#cfeef8")   # the smile
    c.set(hxp + 3, hyp + 1, "#cfeef8")
    # the last motes of the person rising to the star
    mr = e.rng("motes")
    for k in range(44):
        yy = mr.randint(12, hyp - 4)
        spread = 2 + (yy / float(hyp)) * 9
        xx = hxp + 1 + mr.randint(-int(spread), int(spread)) * (0.4 + yy / float(hyp))
        c.set(xx, yy, "#ffffff" if mr.random() < 0.3 else "#a8d4e4")
    e.protect += ["#ffffff", "#cfeef8"]
    vignette_kind(c, "death", col="#010204", strength=0.9, inner=0.4)


@ending("nec_death_sanity")
def nec_death_sanity(e):
    """DEATH.  Standing Still: a flat wall of tomb niches, two rows of six, each holding a dormant necron standing at
    attention, eyes dark.  In the lower row, third from the left, stands the human in the old coat, as rigid as the
    rest, eyes open and pale, dust settled on the head and shoulders.
    Only that niche is lit; the rest of the wall is almost black green."""
    c = e.c
    # wall: black-green plates
    for y in range(108):
        for x in range(192):
            t = 0.30 + 0.18 * clamp(1.0 - abs(x - 80) / 110.0) + (0.05 if (x // 12 + y // 9) % 2 else 0.0)
            c.set(x, y, ramp_pick(["#020504", "#08140f", "#10241d", "#1c382e"], t, x, y))
    NW, NH, GAP, MX0 = 26, 46, 6, 3
    rows = [4, 56]
    niches = []
    for r, y0 in enumerate(rows):
        for ci in range(6):
            niches.append((r, ci, MX0 + ci * (NW + GAP), y0))
    pr = e.rng("niche")
    for (r, ci, x0, y0) in niches:
        you = (r == 1 and ci == 2)
        x1, y1 = x0 + NW - 1, y0 + NH - 1
        back = "#2a5446" if you else "#07140f"
        c.rect(x0, y0, x1, y1, back)
        if you:
            for y in range(y0, y1 + 1):
                for x in range(x0, x1 + 1):
                    blend(c, x, y, "#9ad8c0", 0.34 * (1.0 - (y - y0) / float(NH)) ** 0.8 + 0.1, 3)
        c.rect(x0 - 1, y0 - 1, x1 + 1, y0 - 1, "#2e6a54" if you else "#184034")             # lip
        c.rect(x0 - 1, y0, x0 - 1, y1, "#1c4a3c" if you else "#0c2a22")
        c.rect(x1 + 1, y0, x1 + 1, y1, "#04100c")
        c.rect(x0, y1 - 1, x1, y1, "#0e2a22" if not you else "#3a7a64")                      # the niche floor
        if you:
            continue
        # a dormant necron standing at attention, one or two empty niches
        if (r, ci) in ((0, 4), (1, 5)) and pr.random() < 2:
            continue
        f = fig(36, "stand", "#1e302a", facing=1, thick=0.62)
        f = dict(f, img=_lr_shade(f["img"], "#122822", "#3e6458"))
        ox, oy = put_figure(c, f, x0 + NW // 2 - 1, y1 - 2)
        hx_, hy_ = f["head"]
        hxp, hyp = ox + int(round(hx_)), oy + int(round(hy_))
        c.rect(hxp - 2, hyp - 3, hxp + 2, hyp + 3, "#4a6c60")                                  # a skull-plate, dull
        c.rect(hxp - 2, hyp - 3, hxp - 2, hyp + 3, "#2e4a40")
        c.set(hxp - 1, hyp - 1, "#0a1612"); c.set(hxp + 1, hyp - 1, "#0a1612")
        if pr.random() < 0.18:
            c.set(hxp - 1, hyp - 1, "#1e5a38"); c.set(hxp + 1, hyp - 1, "#1e5a38")            # a stray spark in a sleeper
        c.rect(hxp - 2, hyp + 4, hxp + 2, hyp + 4, "#3a3418")
    # the human's niche
    YX0 = MX0 + 2 * (NW + GAP)
    YY1 = rows[1] + NH - 1
    me = player_fig("necrons", 38, "stand", facing=1, thick=0.9)
    me = dict(me, img=tint(me["img"], "#4a5a54", 0.5))
    mx, my = put_figure(c, me, YX0 + NW // 2, YY1 - 2, rim_col="#d8fff0", toward=(0, -1))
    hx_, hy_ = me["head"]
    hxp, hyp = mx + int(round(hx_)), my + int(round(hy_))
    c.rect(hxp - 1, hyp - 1, hxp, hyp, "#f4ffff"); c.rect(hxp + 2, hyp - 1, hxp + 3, hyp, "#f4ffff")   # eyes open, pale, fixed
    c.set(hxp - 1, hyp - 2, "#1a2a24"); c.set(hxp, hyp - 2, "#1a2a24"); c.set(hxp + 2, hyp - 2, "#1a2a24"); c.set(hxp + 3, hyp - 2, "#1a2a24")
    for dx in range(-4, 5):                                                                     # dust on the head and shoulders
        if dx % 2 == 0:
            c.set(hxp + dx, hyp - 5 + abs(dx) // 3, "#a8bcb4")
    sh_y = hyp + 8
    for dx in range(-7, 8):
        if (dx % 3) != 1:
            c.set(hxp + dx + 1, sh_y, "#8aa098")
    dn = e.rng("dust")                                                                          # motes hanging in the shaft, perfectly still
    for _ in range(16):
        c.set(dn.randint(YX0 + 3, YX0 + NW - 4), dn.randint(rows[1] + 2, YY1 - 14), "#cfe8e0")
    # the floor ledge and a thin green line of light along it
    c.rect(0, 103, 191, 107, "#06100e")
    c.rect(0, 102, 191, 102, "#1c4a3c")
    for x in range(0, 192, 2):
        c.set(x, 104, "#1e6a46" if (x // 8) % 3 else "#0c2a1c")
    light_pool(c, YX0 + NW // 2, 104, 26, 4, "#8ae0c0", t=0.45, power=1.0)
    e.protect += ["#f4ffff"]
    vignette_kind(c, "death", col="#010302", strength=0.8, inner=0.5)
