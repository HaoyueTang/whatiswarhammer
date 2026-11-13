"""SPEC §31 ending illustrations — T'au route (tau_*).  See endkit.py for the helper conventions.

T'au visual language used here: clean curved hulls, blue / cream / ochre, teal lens-light, drones.
No logo of the Greater Good is drawn (only plain rings / discs / stripes).  Helpers local to this module
start with an underscore: _tau (a T'au person), _fire (a fire-caste warrior), _drone, _tower, _dome, _ring,
_sapling, _crate, _hand_card.
"""
import math
import random
from PIL import Image, ImageDraw, ImageFilter
from reg import ending
from endkit import *

TEAL = "#46d8c8"
TEAL_L = "#b8fff0"
SKIN = "#7f95ac"
SKIN_D = "#5f7490"
CREAM = ["#7a6a4e", "#b0a07c", "#d8ccaa", "#f0e8cc"]
OCHRE = ["#4a3220", "#7a5a30", "#b08a48", "#dcb870", "#f2dc9c"]


# ------------------------------------------------------------------ people

def _shadow(c, img, x, y, toward_light=(-1.0, 0.0), length=1.0, squash=0.30, col="#000000", t=0.55, origin=None,
            anchor="bm", levels=3):
    """cast_shadow with the height sign fixed (endkit.cast_shadow measures a pixel's height above the ground as
    (h - ay) - j, which is inverted: shadows fall up / the wrong way).  Same arguments; (x, y) = ground contact of
    `origin` (a pixel of img, e.g. figure()['feet']) or of the anchor point.  toward_light = (dx, dz): dx<0 light on the
    left (shadow to the right), dz>0 light behind the subject (shadow toward the viewer)."""
    ax = {"l": 0, "m": img.width // 2, "r": img.width}[anchor[1]]
    ay = {"t": 0, "m": img.height // 2, "b": img.height}[anchor[0]]
    if origin is not None:
        ax, ay = int(origin[0]), int(origin[1]) + 1
    kx = -toward_light[0] * length
    ky = toward_light[1] * squash
    m = Image.new("L", (W * 2, H * 2), 0)
    d = ImageDraw.Draw(m)
    a = img.getchannel("A").load()
    for j in range(img.height):
        hh = ay - j                                   # pixels above the ground line
        if hh < 0:
            continue
        for i in range(img.width):
            if a[i, j] < 128:
                continue
            u = i - ax
            q = [(u + hh * kx, hh * ky), (u + 1 + hh * kx, hh * ky),
                 (u + 1 + (hh - 1) * kx, (hh - 1) * ky), (u + (hh - 1) * kx, (hh - 1) * ky)]
            d.polygon([(x + W // 2 + px_, y + H // 2 + py_) for (px_, py_) in q], fill=255)
    blend_mask(c, m, col, t, -W // 2, -H // 2, levels)


def _put(c, f, x, y, shadow=None, rim_col=None, toward=(-1, -1)):
    """put_figure with the corrected shadow (shadow = dict of _shadow kwargs); feet at (x, y)."""
    img = f["img"]
    ax, ay = f["feet"]
    px, py = int(round(x - ax)), int(round(y - ay))
    if shadow:
        _shadow(c, img, px + ax, py + ay, origin=(ax, ay), **shadow)
    if rim_col is not None:
        img = rim(img, rim_col, toward)
    place(c, img, px, py, anchor="tl")
    return (px, py)


def _tau(h, pose="stand", facing=1, cloth="#e4dcc8", skin=SKIN, robe=0.0, **kw):
    """a T'au civilian / envoy: tall slim figure, grey-blue head.  Returns the figure() dict (img modified)."""
    f = fig(h, pose, cloth, facing=facing, robe=robe, **kw)
    img = f["img"]
    px = img.load()
    hx_, hy_ = f["head"]
    r = max(1.7, 0.098 * h)
    for y in range(int(hy_ - r - 1), int(hy_ + r * 1.2 + 2)):
        for x in range(int(hx_ - r - 1), int(hx_ + r + 2)):
            if 0 <= x < img.width and 0 <= y < img.height and px[x, y][3]:
                if ((x - hx_) / r) ** 2 + ((y - hy_) / (r * 1.1)) ** 2 <= 1.0:
                    px[x, y] = C(skin) + (255,)
    # a single bright pixel for the eye on the side the figure faces
    ex = int(round(hx_ + facing * r * 0.45))
    ey = int(round(hy_ - r * 0.1))
    if 0 <= ex < img.width and 0 <= ey < img.height and h >= 20:
        px[ex, ey] = C("#1c2a3a") + (255,)
    return f


def _lit(img, lit, dark, side=-1, a=0.30, b=0.62, tl=0.45, td=0.5):
    """round off a flat figure with two flat bands: the edge facing the light (side=-1 left, +1 right) mixes toward
    `lit`, the far edge toward `dark`.  Keeps the silhouette; no dithering (reads cleanly at small sizes)."""
    out = img.copy()
    px = out.load()
    bb = out.getbbox() or (0, 0, out.width, out.height)
    x0, x1 = bb[0], bb[2]
    wd = float(max(1, x1 - x0))
    for y in range(out.height):
        for x in range(out.width):
            r, g, bl, al = px[x, y]
            if not al:
                continue
            u = (x - x0 + 0.5) / wd
            if side > 0:
                u = 1 - u
            if u < a:
                px[x, y] = mix((r, g, bl), C(lit), tl) + (255,)
            elif u > b:
                px[x, y] = mix((r, g, bl), C(dark), td) + (255,)
    return out


def _fire(h, pose="stand", facing=1, armour="#c8a058", suit="#3c4452", rifle=True):
    """fire-caste warrior: ochre helmet and chest plate over a dark bodysuit, teal visor, pulse rifle."""
    f = fig(h, pose, suit, facing=facing)
    img = f["img"]
    px = img.load()
    hx_, hy_ = f["head"]
    r = max(1.9, 0.105 * h)
    for y in range(int(hy_ - r - 2), int(hy_ + r * 1.4 + 2)):
        for x in range(int(hx_ - r - 2), int(hx_ + r + 3)):
            if 0 <= x < img.width and 0 <= y < img.height and px[x, y][3]:
                if ((x - hx_) / r) ** 2 + ((y - hy_) / (r * 1.1)) ** 2 <= 1.0:
                    px[x, y] = C(armour) + (255,)
    vx = int(round(hx_ + facing * r * 0.55))
    vy = int(round(hy_ - r * 0.15))
    for dx in (0, facing):
        if 0 <= vx + dx < img.width:
            px[vx + dx, vy] = C(TEAL) + (255,)
    # chest plate: a band across the upper torso
    sh = int(hy_ + r * 1.9)
    for y in range(sh, sh + max(2, int(h * 0.12))):
        for x in range(img.width):
            if 0 <= y < img.height and px[x, y][3] and abs(x - hx_) <= h * 0.11:
                px[x, y] = C(armour) + (255,)
    if rifle:
        hand = f["hands"][0]
        x0, y0 = hand
        x1, y1 = x0 + facing * h * 0.34, y0 - h * 0.05
        big = img.copy()
        d = ImageDraw.Draw(big)
        d.line([(x0 - facing * h * 0.08, y0 + h * 0.03), (x1, y1)], fill=C("#262c36") + (255,), width=1)
        f["img"] = big
        f["muzzle"] = (x1, y1)
    return f


def _suit(col=("#3a0a10", "#8a1a1a", "#c03020", "#e87040"), lens="#ffcf60", facing=-1, body_only=True):
    """a crimson battlesuit, waist up (56x46 RGBA): domed head with one lens, wide shoulder pads, a long gun arm.
    Drawn facing left by default (facing=-1).  Hand-drawn silhouette, no canon-character likeness."""
    cv = Canvas(56, 48, alpha=True)
    dk, bd, lt, hi = col
    cv.rect(35, 2, 39, 20, "#2a2024")                              # jet pack behind
    cv.rect(36, 2, 36, 20, "#5a4a50")
    cv.poly([(15, 16), (41, 16), (38, 47), (18, 47)], bd)          # torso
    cv.poly([(16, 17), (24, 17), (23, 46), (19, 46)], lt)
    cv.poly([(34, 17), (41, 17), (38, 47), (35, 47)], dk)
    cv.rect(22, 25, 33, 27, dk)                                    # chest vent
    cv.rect(22, 25, 33, 25, "#d8a898")
    cv.ellipse(14, 17, 6, 5, bd)                                   # shoulder pads
    cv.ellipse(13, 16, 4, 3, lt)
    cv.ellipse(42, 17, 5, 5, dk)
    cv.ellipse(41, 16, 3, 3, bd)
    cv.rect(24, 12, 31, 16, "#3a2a2e")                             # neck
    cv.ellipse(27, 9, 6, 5, bd)                                    # head dome
    cv.ellipse(26, 8, 4, 3, lt)
    cv.rect(21, 9, 26, 10, lens)                                   # one wide lens
    cv.set(20, 9, hi)
    cv.line([(31, 5), (33, 0)], "#4a3a3e")                         # antenna
    cv.set(33, 0, lens)
    cv.poly([(9, 21), (14, 21), (11, 40), (6, 40)], bd)            # near arm, hanging forward
    cv.poly([(7, 24), (11, 24), (9, 40), (6, 40)], lt)
    cv.rect(3, 30, 9, 38, "#2a2428")                               # the gun: a block at the hand, a long barrel down
    cv.rect(3, 30, 4, 38, "#6a5a62")
    cv.rect(5, 38, 7, 46, "#1a1618")
    cv.rect(5, 38, 5, 46, "#5a4a52")
    cv.rect(44, 21, 49, 40, dk)                                    # far arm
    cv.rect(44, 21, 45, 40, bd)
    img = cv.image()
    if facing > 0:
        img = img.transpose(Image.FLIP_LEFT_RIGHT)
    return img


def _drone(c, x, y, s=1, lens=TEAL, glow_t=0.35, body="#d8ccaa", under=True):
    """small T'au drone: a saucer with a dome, one lens and an antenna; teal light pooled under it."""
    rx, ry = 3 * s + 1, s + 1
    if under:
        light_pool(c, x, y + 2 * s + 3, rx * 2, 2 * s + 2, lens, t=glow_t)
    c.ellipse(x, y, rx, ry, "#7a6a4e")
    c.ellipse(x, y - 1, rx - 1, max(1, ry - 1), body)
    c.rect(x - rx + 1, y - ry, x + 1, y - ry, "#f4ecd0")
    c.rect(x - 1, y + ry - 1, x + 1, y + ry - 1, lens)
    c.set(x + rx - 2, y, lens)
    c.rect(x - s, y - ry - 1, x + s, y - ry - 1, "#c8bc98")
    c.line([(x - s - 1, y - ry - 1), (x - s - 2, y - ry - 3 - s)], "#8a7a5a")
    c.set(x - s - 2, y - ry - 3 - s, lens)


def _tower(c, x, base, w, h, ramp, bands=0, band_col=TEAL, cap=True, taper=0.45):
    """a smooth T'au pillar: slim waist, rounded cap, three flat tones (lit left / mid / shade right)."""
    lite, body, shade_ = ramp[2], ramp[1], ramp[0]
    for y in range(base - h, base + 1):
        t = (y - (base - h)) / float(h)
        half = w * (1 - taper + taper * math.sin(min(1.0, t * 1.5) * math.pi / 2))
        for xx in range(int(x - half), int(x + half) + 1):
            u = (xx - (x - half)) / max(1.0, 2 * half)
            c.set(xx, y, lite if u < 0.3 else (body if u < 0.72 else shade_))
    if cap:
        c.ellipse(x, base - h, w * 0.65, w * 0.42, ramp[2])
        c.ellipse(x + 1, base - h, w * 0.45, w * 0.3, ramp[3] if len(ramp) > 3 else ramp[2])
    for k in range(bands):
        yy = base - h + int(h * (0.22 + 0.17 * k))
        t = (yy - (base - h)) / float(h)
        half = w * (1 - taper + taper * math.sin(min(1.0, t * 1.5) * math.pi / 2))
        c.rect(x - half, yy, x + half, yy, band_col)


def _dome(c, cx, base, r, ramp, ry=None, rim_col=None):
    ry = ry or r * 0.8
    for y in range(int(base - ry), int(base) + 1):
        for x in range(int(cx - r), int(cx + r) + 1):
            if ((x - cx) / r) ** 2 + ((y - base) / ry) ** 2 <= 1.0:
                u = (x - cx + r) / (2.0 * r)
                v = (base - y) / ry
                c.set(x, y, ramp_pick(ramp, 1 - u * 0.8 - 0.0 + v * 0.35, x, y))
    if rim_col:
        c.rect(cx - r, base - 1, cx + r, base, rim_col)


def _ring(c, cx, cy, r, col, w=1):
    """a plain ring (no mark inside)."""
    d = c.draw()
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=C(col) + (255,), width=w)


def _sapling(c, x, base, h, canopy=("#2c6a50", "#3c9a6a", "#78c88a"), trunk="#5a4630"):
    """young street tree of a new colony: thin trunk, round canopy, lit top-left."""
    c.rect(x, base - h // 2, x, base, trunk)
    r = max(3, h // 3)
    cy = base - h // 2 - r + 1
    for y in range(cy - r, cy + r + 1):
        for xx in range(x - r, x + r + 1):
            dx, dy = (xx - x) / float(r), (y - cy) / float(r)
            if dx * dx + dy * dy <= 1.0:
                t = clamp(0.5 - dx * 0.35 - dy * 0.35)
                c.set(xx, y, ramp_pick(list(canopy), t, xx, y))


def _crate(c, x, y, w, h, body="#7a8aa0", lite="#a8b8c8", dark="#4a5870", band=None):
    """a squarish cargo crate with a lit top edge and dark right side."""
    c.rect(x, y, x + w, y + h, body)
    c.rect(x, y, x + w, y, lite)
    c.rect(x + w, y, x + w, y + h, dark)
    c.rect(x, y + h, x + w, y + h, dark)
    if band:
        c.rect(x + 1, y + h // 2, x + w - 1, y + h // 2, band)


# ================================================================== GOOD

@ending("tau_end_citizen")
def tau_end_citizen(e):
    """GOOD.  A new colony's plaza at golden hour: the envoy pins a medal on the player, the quarter's children
    stand in two perfectly even rows (the one gentle wrong note), drones overhead, young trees in planters.
    Light: low sun at the far left behind the towers; bright mass = left horizon, figures lower right."""
    c = e.c
    HZ = 64
    sky(c, ["#0c1838", "#162a56", "#2c4a80", "#7a5a80", "#d88060", "#ffb878"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#243a6c", "#6a5080", "#c07088", "#ffb080"], 6, 46, scale=0.04, thresh=0.56, stretch=5.0)
    SX, SY = 26, 61
    glow(c, SX, SY, 52, ["#34548c", "#a8707e", "#f0a070", "#ffd088", "#fff4d0"], power=1.5, strength=1.0, ry=32)
    c.ellipse(SX, SY, 6, 6, "#fff8dc")
    # far towers in haze
    for (x, w, h) in [(80, 4, 30), (104, 5, 40)]:
        _tower(c, x, HZ + 2, w, h, ["#2e3460", "#464c7a", "#6c6490"])
    # the tower under construction: ochre, lit on the left, scaffold arm, teal bands
    _tower(c, 56, HZ + 4, 8, 52, ["#4a2c34", "#8a5848", "#d08a60", "#ffc088"], bands=4)
    c.line([(56, HZ + 4 - 52), (56, HZ - 60)], "#1c1830")
    c.line([(44, HZ - 54), (80, HZ - 56)], "#1c1830")
    c.rect(79, HZ - 56, 81, HZ - 54, TEAL)
    haze(c, HZ - 14, HZ + 4, "#e89070", t=0.42, seed=e.seed_for("hz"), profile="mid", x1=120)
    # low hall with a teal band + domes, lit from the left
    _dome(c, 122, HZ + 6, 22, ["#242448", "#505078", "#c08a8a"], rim_col=TEAL)
    _dome(c, 164, HZ + 6, 12, ["#242448", "#505078", "#c08a8a"], rim_col=TEAL)
    # plaza
    hband(c, HZ + 6, 107, ["#b07078", "#7a5878", "#4a4468", "#262a48"], seed=e.seed_for("pl"), rough=0.12)
    for x in range(-60, 260, 18):
        c.line([(SX + (x - SX) * 0.25, HZ + 6), (SX + (x - SX) * 1.7, 107)], "#2e3050")
    for y in (72, 80, 91, 104):
        c.line([(0, y), (191, y)], "#2e3050")
    light_pool(c, 44, HZ + 10, 76, 6, "#ffc080", t=0.55)
    # planters with young trees, receding along the left
    for (x, b, h) in [(16, 100, 30), (42, 84, 22), (62, 76, 16), (76, 71, 12)]:
        _sapling(c, x, b, h, canopy=("#10342f", "#1c5a48", "#6aa86a"))
        c.rect(x - 3, b, x + 3, b + 2, "#4a4468")
    # the children: two exact rows, small, facing the ceremony (right)
    for row, (yb, hh) in enumerate([(88, 13), (95, 15)]):
        for k in range(7):
            f = fig(hh, "stand", "#5a5880", facing=1)
            f["img"] = _lit(f["img"], "#ffc088", "#222640", side=-1)
            px0, py0 = _put(c, f, 88 + k * 7 + row * 2, yb)
            c.rect(px0 + int(f["head"][0]) - 1, py0 + int(f["head"][1]) - 1, px0 + int(f["head"][0]), py0 + int(f["head"][1]), "#c89878")
    for (x, y) in [(100, 56), (124, 50), (146, 42)]:
        _drone(c, x, y, 1)
    particles(c, "mote", 24, (40, 20, 190, 96), seed=e.seed_for("mote"), cols=("#ffe8b8", "#ffffff"))
    vignette_kind(c, "good", strength=0.34)
    # the ceremony, front right: the player (a head shorter) and the envoy
    env = _tau(54, "stand", -1, cloth="#bcb4c4", robe=0.78)
    env["img"] = _lit(env["img"], "#fff0c8", "#3a3858", side=-1, a=0.4, b=0.5)
    ex, ey = _put(c, env, 162, 104, shadow=dict(toward_light=(-1, 0.55), length=0.9, squash=0.3, col="#14122c", t=0.7))
    # a teal sash down the envoy's chest
    for k in range(20):
        c.set(ex + 4 + k // 4, ey + 14 + k, TEAL)
    me = player_fig("tau", 40, "stand", facing=1)
    me["img"] = _lit(me["img"], "#ffd8a0", "#2a2840", side=-1, a=0.45, b=0.55)
    mx, my = _put(c, me, 143, 104, shadow=dict(toward_light=(-1, 0.55), length=0.9, squash=0.3, col="#14122c", t=0.7))
    chest = (mx + int(me["head"][0]) + 1, my + int(me["head"][1]) + 9)
    c.rect(chest[0], chest[1], chest[0] + 1, chest[1] + 1, "#ffd860")
    for (dx, dy) in [(-1, 0), (2, 0), (0, -1), (0, 2)]:
        c.set(chest[0] + dx, chest[1] + dy, "#fff6c0")
    e.protect += ["#ffd860", "#fff6c0"]
    sh_ = (ex + 5, ey + 16)                                         # the envoy's sleeve reaching across to the medal
    c.line([sh_, (chest[0] + 3, chest[1] + 1)], "#bcb4c4", 2)
    c.rect(chest[0] + 2, chest[1], chest[0] + 3, chest[1] + 1, SKIN)


@ending("tau_end_enclaves")
def tau_end_enclaves(e):
    """GOOD.  The Gulf, mid-morning after rain: the sun breaks through at the upper right and lays a gold road across
    the water to a crimson battlesuit standing waist-deep in the shallows, waiting.  In the foreground Kel'ra and the
    player on the rocks, she looking back over her shoulder at the smoky skyline of Dal'nor.  Bright mass: top right
    and the glitter road; the figures are small and dark at the lower left."""
    c = e.c
    HZ = 54
    SX, SY = 150, 16
    sky(c, ["#0e2a3e", "#1c4a62", "#3a7a88", "#8ab8a0", "#e8d49a"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#0c2234", "#16384c", "#2a5a6a", "#5a8a8a"], 0, 40, scale=0.045, thresh=0.5, stretch=4.0)
    glow(c, SX, SY + 8, 48, ["#1c4a5c", "#3a7a80", "#a8a078", "#e8b878", "#ffd890", "#fff2c8"], power=1.5, strength=1.0, ry=32)
    c.ellipse(SX, SY + 4, 7, 7, "#fff8e0")
    shafts(c, (SX, SY + 4), 112, 54, 9, 74, "#ffe8b0", t=0.28, seed=e.seed_for("sh"), w0=3, w1=13, power=0.7, floor=HZ + 2)
    # far shore (right): low blue headland with a few warm lights
    ridge(c, HZ + 1, 3, 9, "#1e4a54", seed=e.seed_for("far"), x0=96, fill_to=HZ + 3)
    for (x, y) in [(138, HZ - 2), (141, HZ - 3), (150, HZ - 2), (165, HZ - 3), (170, HZ - 2)]:
        c.set(x, y, "#ffd070")
    haze(c, HZ - 8, HZ + 2, "#c8d8b0", t=0.4, seed=e.seed_for("hz"), profile="mid", x0=90)
    # the Gulf
    sea = ["#06141e", "#0c2a3a", "#16495a", "#2c7a84", "#7ab8a8"]
    for y in range(HZ + 1, 108):
        for x in range(192):
            t = 1 - (y - HZ) / (107.0 - HZ)
            sx = (x - SX) / (14.0 + (y - HZ) * 0.95)
            road = max(0.0, 1 - abs(sx)) ** 1.5
            wob = math.sin(y * 1.7 + x * 0.12 + e.noise("w").fbm(x * 0.05, y * 0.4, 2) * 6) * 0.5 + 0.5
            tt = t * 0.5 + road * (0.4 + 0.35 * wob)
            c.set(x, y, ramp_pick(sea + ["#e8e0b0"], clamp(tt) * 0.95, x, y))
    rw = e.rng("waves")
    for _ in range(70):
        x, y = rw.randint(60, 191), rw.randint(HZ + 3, 100)
        ln = rw.randint(2, 4 + (y - HZ) // 10)
        c.rect(x, y, x + ln, y, "#7ab8b0" if abs(x - SX) > 20 else "#f4ecc0")
    # Dal'nor on the left headland: a hazy town, a few lit windows, smoke leaning away
    for x in range(0, 78):
        top = int(HZ + 3 - 5 * math.sin(min(1.0, x / 60.0) * math.pi * 0.5) + (x // 7 % 3))
        for y in range(top, HZ + 6):
            c.set(x, y, "#284452")
    skyline(c, e.seed_for("dal"), HZ + 4, "#2e4e5c", 11, 4, 13, 2, 6, x0=0, x1=70, win_p=0.1, wincol=("#ffb060", "#ffd890"), tips=0.25)
    for k in range(20):
        c.set(30 + int(k * 0.5) + int(math.sin(k * 0.6) * 1.5), HZ - 6 - k, "#4a6a74" if k % 2 else "#5a7a82")
    haze(c, HZ - 6, HZ + 8, "#8ab0a0", t=0.38, seed=e.seed_for("hz2"), profile="mid", x1=80)
    # the crimson battlesuit waiting in the shallows (mirrored to face the shore), lower body hidden in spray
    su = _suit()
    su = rim(su, "#ffc080", (1, -1))
    bx, by = 118, 82
    place(c, su, bx, by, anchor="bm")
    light_pool(c, bx, by - 1, 22, 3, "#d8f0e0", t=0.7)               # spray at its waist
    for dx in range(-20, 22, 3):                                     # ripples around it
        c.rect(bx + dx, by + 1 + (dx % 2), bx + dx + 2, by + 1 + (dx % 2), "#d8f0e0")
    for k in range(28):                                              # its reflection, smeared down the water
        yy = by + 3 + k
        for dx in range(-9, 9):
            if (k + dx) % 3 == 0 and 0 <= yy < 108:
                blend(c, bx + dx, yy, "#c03020", 0.55 * (1 - k / 28.0), 3)
    # foreground rock shelf, lower left
    rn = e.noise("rock")
    for x in range(0, 118):
        top = int(92 - (x * 0.06) + (rn.fbm(x * 0.08, 1.3, 3) - 0.5) * 9 + (6 if x > 90 else 0) * (x - 90) / 28.0)
        for y in range(max(0, top), 108):
            t = clamp(0.25 + (y - top) / 30.0 * 0.5 + (rn.fbm(x * 0.2, y * 0.2, 2) - 0.5) * 0.4)
            c.set(x, y, ramp_pick(["#4a5a58", "#2e3e40", "#1a282c", "#0c161c"], t, x, y))
        c.set(x, top, "#8ab0a0")
    light_pool(c, 88, 93, 28, 3, "#f4e8b0", t=0.4)
    # Kel'ra (ochre armour, rifle slung) looking back toward Dal'nor, and the player facing the Gulf
    kel = _fire(42, "stand", -1, rifle=False)
    kel["img"] = _lit(kel["img"], "#ffe0a0", "#0c161c", side=1, a=0.4, b=0.55)
    kx, ky = _put(c, kel, 40, 101, shadow=dict(toward_light=(1, 0.5), length=1.0, squash=0.3, col="#04080c", t=0.7))
    me = player_fig("tau", 36, "stand", facing=1, pack=True)
    me["img"] = _lit(me["img"], "#ffe0a0", "#0c161c", side=1, a=0.4, b=0.55)
    mx, my = _put(c, me, 70, 104, shadow=dict(toward_light=(1, 0.5), length=1.0, squash=0.3, col="#04080c", t=0.7))
    particles(c, "mote", 22, (0, 10, 191, 90), seed=e.seed_for("mote"), cols=("#fff6d8", "#ffe8b0"))
    vignette_kind(c, "good", strength=0.32)


@ending("tau_end_watch")
def tau_end_watch(e):
    """GOOD.  Dal'nor's roofless chapel at golden hour, two years on: the arches stand open to the sky, warm light
    comes down from the upper right across the rebuilt floor to the old pulpit, where a spread-winged bronze bird and
    a plain ring hang side by side.  A few people rebuild: the player on the left carries a plank, a neighbour sits
    on a crate, a drone lifts a beam.  Bright mass: top-right sky + the light pooled at the pulpit (left of centre)."""
    c = e.c
    HZ = 68
    sky(c, ["#0a1230", "#182650", "#3e4274", "#a06870", "#e89868"], 0, 60)
    clouds(c, e.seed_for("cl"), ["#1c2a54", "#5a4670", "#b87470", "#f0a878"], 2, 38, scale=0.05, thresh=0.52, stretch=4.0)
    SX, SY = 176, 12
    glow(c, SX, SY, 46, ["#3a5888", "#a08098", "#e8a878", "#ffd090", "#fff4d0"], power=1.4, strength=1.0, ry=34)
    c.ellipse(SX, SY, 6, 6, "#fff6d8")
    # back wall of the apse with an empty pointed window (right of the pulpit)
    wn = e.noise("wall")
    WCX = 128
    def win(x, y):
        if not (WCX - 14 <= x <= WCX + 14 and 28 <= y <= 58):
            return False
        if y >= 42:
            return True
        dx = (x - WCX) / 14.0
        return y >= 28 + 14 * (1 - math.sqrt(max(0.0, 1 - dx * dx)))
    for x in range(42, 164):
        top = int(24 + 5 * math.sin(x * 0.11) + (wn.fbm(x * 0.12, 4.2, 2) - 0.5) * 9)
        for y in range(top, HZ + 2):
            if win(x, y):
                continue
            t = clamp(0.3 + (x - 42) / 122.0 * 0.28 + (y - top) / 48.0 * 0.1 + (wn.fbm(x * 0.09, y * 0.13, 3) - 0.5) * 0.3)
            if (y // 5 + (x // 9) * 2) % 5 == 0 and (x % 9 == 0 or y % 5 == 0):
                t *= 0.6
            c.set(x, y, ramp_pick(["#2c2034", "#503e4a", "#82645a", "#b88a6c", "#e8b888"], t, x, y))
        c.set(x, top, "#e8b888")
    for y in range(26, 60):                                         # window reveal
        for x in range(WCX - 18, WCX + 19):
            if not win(x, y) and (win(x + 2, y) or win(x - 2, y) or win(x, y - 2)):
                c.set(x, y, "#2c2034")
    c.rect(WCX - 16, 59, WCX + 16, 60, "#a07a68")
    # right wall remnant, broken, lit
    for x in range(160, 192):
        top = int(20 + (x - 160) * 0.4 + (wn.fbm(x * 0.15, 8.0, 2) - 0.5) * 8)
        for y in range(top, HZ + 8):
            t = clamp(0.45 + (y - top) / 60.0 * 0.1 + (wn.fbm(x * 0.1, y * 0.12, 3) - 0.5) * 0.5)
            c.set(x, y, ramp_pick(["#3e2e3c", "#6a5058", "#a07868", "#d8a880", "#fff0c0"], t, x, y))
    # left: two broken arch ribs receding, dark against the sky, lit on the sun side
    for (cx, base, top, run) in [(14, 108, 6, 30), (36, 88, 18, 20)]:
        wdt = 6 if cx < 30 else 4
        c.rect(cx - wdt, top + 8, cx + wdt, base, "#1c1424")
        c.rect(cx + wdt - 1, top + 8, cx + wdt, base, "#9a7260")
        pts = [(cx + wdt * 0.2 + run * (1 - math.cos(a * math.pi / 2)) * 0.9, top + 8 - math.sin(a * math.pi / 2) * 8) for a in [i / 8.0 for i in range(0, 8)]]
        c.line(pts, "#1c1424", wdt)
        c.line([(px_ + 1, py_ - 1) for (px_, py_) in pts], "#b88a6c", 1)
    # floor: rebuilt planks on stone, in perspective
    hband(c, HZ + 1, 107, ["#7a5848", "#4e3a48", "#30263a", "#161020"], seed=e.seed_for("fl"), rough=0.2)
    for x in range(-120, 320, 16):
        c.line([(96 + (x - 96) * 0.2, HZ + 1), (96 + (x - 96) * 2.0, 107)], "#2a2034")
    for y in (74, 82, 93, 105):
        c.line([(0, y), (191, y)], "#2a2034")
    shafts(c, (SX - 4, SY + 6), 124, 46, 8, 122, "#ffd890", t=0.14, seed=e.seed_for("sh"), w0=3, w1=15, power=0.55)
    light_pool(c, 84, HZ + 9, 56, 8, "#ffd890", t=0.5)
    # the pulpit: platform, lectern; the bird and the ring hang on the wall behind it
    c.rect(54, HZ - 3, 98, HZ + 2, "#6a5048")
    c.rect(54, HZ - 3, 98, HZ - 3, "#e8b888")
    c.rect(60, HZ - 10, 92, HZ - 4, "#7a5a50")
    c.rect(60, HZ - 10, 92, HZ - 10, "#f0c898")
    c.rect(88, HZ - 10, 92, HZ - 4, "#3e2e3c")
    c.rect(64, HZ - 24, 88, HZ - 11, "#4e3a46")
    c.rect(64, HZ - 24, 88, HZ - 24, "#f0c898")
    c.rect(64, HZ - 24, 66, HZ - 11, "#8a6858")
    c.rect(84, HZ - 24, 88, HZ - 11, "#241a2c")
    c.rect(58, 29, 98, 43, "#241a2c")                                  # a dark plaque so the bird and the ring read
    c.rect(58, 29, 98, 29, "#6a5058")
    BIRD = ["#...........#", "##....#....##", ".###..#..###.", "..####.####..", "...#######...", ".....###.....", "......#......"]
    bx0, by0 = 62, 33
    for j, row in enumerate(BIRD):                                   # a spread-winged bird (not a sigil), hung high
        for i, ch in enumerate(row):
            if ch == "#":
                c.set(bx0 + i, by0 + j, "#ffd878" if j < 4 and i < 7 else "#d8a040")
    c.set(bx0 + 6, by0 - 1, "#ffe098")
    _ring(c, 88, 36, 6, "#e8f0e8", 2)                                # the T'au ring: a plain ring, no mark
    _ring(c, 88, 36, 4, "#46d8c8", 1)
    light_pool(c, 78, 36, 30, 10, "#ffd890", t=0.3)
    c.rect(57, HZ - 8, 59, HZ - 4, "#c8a050")                         # a small lamp on the platform step
    glow(c, 58, HZ - 10, 6, ["#7a4a28", "#e8a850", "#fff0b8"], power=1.2, strength=1.0)
    # the lifted beam: a drone holds the far end
    c.line([(120, 14), (156, 6)], "#8a6a4c", 3)
    c.line([(120, 13), (156, 5)], "#d8a870", 1)
    _drone(c, 156, 12, 1)
    vignette_kind(c, "good", strength=0.4)
    particles(c, "mote", 40, (30, 14, 186, 100), seed=e.seed_for("mote"), cols=("#ffe8b0", "#fff6d8"))
    # people (after the vignette so they stay clean)
    nb = fig(34, "stand", "#7a6a8c", facing=1)
    nb["img"] = _lit(nb["img"], "#ffd890", "#14101c", side=1, a=0.4, b=0.55)
    _put(c, nb, 108, 84, shadow=dict(toward_light=(1, 0.5), length=1.0, squash=0.3, col="#14101c", t=0.7))
    kn = fig(32, "kneel", "#7a6a8c", facing=-1)                       # a neighbour kneeling, laying floor planks
    kn["img"] = _lit(kn["img"], "#ffd890", "#14101c", side=1, a=0.4, b=0.55)
    _put(c, kn, 142, 101, shadow=dict(toward_light=(1, 0.5), length=1.0, squash=0.3, col="#14101c", t=0.7))
    for k in range(4):
        c.rect(152 + k * 8, 94 + k * 2, 162 + k * 8, 96 + k * 2, "#c08a58")
        c.rect(152 + k * 8, 94 + k * 2, 162 + k * 8, 94 + k * 2, "#f0c898")
    me = player_fig("tau", 46, "carry", facing=1)
    me["img"] = _lit(me["img"], "#ffd890", "#1c1424", side=1, a=0.4, b=0.55)
    mx, my = _put(c, me, 40, 104, shadow=dict(toward_light=(1, 0.5), length=1.1, squash=0.3, col="#14101c", t=0.7))
    hx_, hy_ = me["hands"][0]
    c.line([(mx + hx_ - 6, my + hy_ + 8), (mx + hx_ + 14, my + hy_ - 14)], "#2a1e30", 3)
    c.line([(mx + hx_ - 6, my + hy_ + 7), (mx + hx_ + 14, my + hy_ - 15)], "#f0c898", 1)


@ending("tau_end_claim_khorne")
def tau_end_claim_khorne(e):
    """BAD / Khorne.  Efficiency Anomaly: the perimeter line of a T'au jungle outpost at blood-red dusk.  The cyan
    fence has a gap; beyond it the player, small and backlit, walks the track toward the low red sun under the
    canopy, his long shadow coming back to the line.  Three fire warriors stand behind the fence with their backs to
    us and do not follow; a drone's red lens marks him.  Bright mass: sun at the left; figures at the lower right."""
    c = e.c
    R = GOD["khorne"]["ramp"]
    HZ = 66
    sky(c, [R[0], R[1], R[2], R[3], R[4], R[5]], 0, HZ)
    SX, SY = 44, 58
    glow(c, SX, SY, 62, [R[1], R[2], R[3], R[4], R[5], "#fff0c0"], power=1.25, strength=1.0, ry=38)
    c.ellipse(SX, SY, 9, 9, "#ffdc90")
    c.ellipse(SX, SY, 6, 6, "#fff4c8")
    shafts(c, (SX, SY), 20, 60, 6, 120, "#ffc060", t=0.2, seed=e.seed_for("sh"), w0=3, w1=11, power=0.7)
    rr = e.rng("trunks")
    for k in range(34):                                              # far trunks in red haze
        x = rr.randint(0, 191)
        c.rect(x, 16, x + rr.randint(0, 2), HZ, mix(C(R[1]), C(R[3]), 0.35 + rr.random() * 0.2))
    haze(c, 30, HZ, R[3], t=0.4, seed=e.seed_for("hz"), profile="bottom")
    n = e.noise("can")
    for x in range(192):                                             # canopy: a heavy lid with hanging lobes
        bottom = int(12 + 22 * n.fbm(x * 0.045, 1.0, 3) + (x > 150) * 6)
        for y in range(0, bottom):
            c.set(x, y, ramp_pick([R[0], "#10040a", R[0]], 0.35 + n.fbm(x * 0.2, y * 0.2, 2) * 0.5, x, y))
        c.set(x, bottom, R[2]) if x % 3 == 0 else None
    for k in range(9):                                               # hanging vines
        vx = rr.randint(6, 185)
        ln = rr.randint(10, 26)
        c.line([(vx, 18), (vx + rr.randint(-3, 3), 18 + ln)], "#10040a")
    for (x, w) in [(2, 9), (22, 6), (180, 10), (164, 5)]:           # near trunks framing the glade
        c.rect(x, 0, x + w, HZ + 8, "#10040a")
        c.rect(x + w - 1, 0, x + w, HZ + 8, R[2])
    # ground: red dust, a track running from the right foreground to the sun
    hband(c, HZ, 107, [R[3], R[2], R[1], R[0], "#10040a"], seed=e.seed_for("gr"), rough=0.3)
    for k in range(6):
        c.line([(SX + k * 3 - 6, HZ + 1), (SX + 70 + k * 36, 107)], R[1])
    light_pool(c, SX + 20, HZ + 6, 70, 6, "#ffc060", t=0.5)
    for x in list(range(10, 52, 6)) + list(range(92, 130, 6)):       # black fronds along the clearing's edge
        c.line([(x, HZ + 4), (x + rr.randint(-3, 3), HZ - rr.randint(3, 7))], "#10040a")
    # the fence: posts with teal cap lights, a thin energy line, and a gap where he crossed
    for (x, ok) in [(190, 1), (168, 1), (146, 1), (124, 1), (102, 1), (82, 0)]:
        c.rect(x, 82, x + 1, 96, "#10040a")
        c.rect(x, 82, x, 96, R[2])
        c.set(x, 81, TEAL)
        c.set(x + 1, 81, TEAL)
        if ok and x > 102:
            for yy in (86, 92):
                c.line([(x, yy), (x - 22, yy)], "#2ab8a8")
    c.rect(82, 90, 83, 96, "#10040a")                                # the last post, bent
    e.protect += ["#2ab8a8"]
    # the player: backlit, walking away toward the sun, long shadow back toward us
    me = player_fig("tau", 34, "walk", facing=-1)
    me["img"] = tint(me["img"], "#14040a", 0.82)
    me["img"] = rim(me["img"], "#ffc060", (-1, -1), min_run=2)
    mx, my = 70, 84
    _shadow(c, me["img"], mx + 1, my, origin=me["feet"], toward_light=(-0.55, 1.0), length=0.8, squash=0.55, col="#10040a", t=0.8)
    _put(c, me, mx, my)
    # the drone and its red lens, a thin scan line to the player
    _drone(c, 128, 58, 1, lens="#ff4a2a", glow_t=0.3, body="#a89a8c")
    c.line([(128, 60), (74, 72)], "#ff4a2a") if False else None
    for k in range(0, 54, 3):
        c.set(128 - k, 61 + int(k * 0.2), "#ff6a3a")
    e.protect += ["#ff4a2a"]
    # three fire warriors, backs to us, rim-lit red from the sun, not following
    for (x, y, h) in [(120, 106, 46), (148, 107, 50), (176, 106, 46)]:
        w_ = _fire(h, "stand", -1, armour="#6a4a34", suit="#1c0a10")
        w_["img"] = rim(w_["img"], "#ff9a3a", (-1, -1), min_run=2)
        _put(c, w_, x, y, shadow=dict(toward_light=(-0.6, 0.8), length=1.0, squash=0.5, col="#10040a", t=0.8))
    particles(c, "ember", 46, (0, 20, 191, 100), seed=e.seed_for("emb"), cols=("#ff9a3a", "#ff6a2a", "#ffd080"))
    vignette_kind(c, "bad", col="#0a0204", strength=0.62)


@ending("tau_end_claim_nurgle")
def tau_end_claim_nurgle(e):
    """BAD / Nurgle.  The Sealed Street: looking along a human-quarter street at a sickly yellow-green dusk, from the
    T'au side of a cyan energy screen that spans it wall to wall.  Beyond the screen a crowd of smiling people, the
    player at its front with a steaming pot; flowers and moss grow out of the cobbles and up the screen's pylons;
    flies drift.  In front: a T'au medic with his back to us and two medical drones.  Closing-in perspective."""
    c = e.c
    N = GOD["nurgle"]["ramp"]
    VX, VY = 128, 48
    xl_edge, xr_edge = VX - 26, VX + 26
    sky(c, [N[0], N[1], N[2], N[3], N[4]], 0, 60)
    glow(c, VX, VY + 4, 40, [N[1], N[2], N[3], "#a8b84a", "#d8d880"], power=1.4, strength=1.0, ry=28)
    clouds(c, e.seed_for("cl"), [N[1], N[2], N[3]], 0, 30, scale=0.05, thresh=0.52, stretch=4.0)
    wn = e.noise("wall")
    # the two walls of hab blocks, in perspective
    def wall_y(x, side):
        u = x / float(xl_edge) if side < 0 else (191 - x) / float(191 - xr_edge)
        return -12 + 44 * u, 112 - 46 * u, u
    for x in range(0, xl_edge + 1):
        top, bot, u = wall_y(x, -1)
        for y in range(max(0, int(top)), min(108, int(bot) + 1)):
            t = clamp(0.2 + u * 0.35 + (wn.fbm(x * 0.1, y * 0.07, 3) - 0.5) * 0.4)
            c.set(x, y, ramp_pick([N[0], N[1], "#344418", N[2]], t, x, y))
    for x in range(xr_edge, 192):
        top, bot, u = wall_y(x, 1)
        for y in range(max(0, int(top)), min(108, int(bot) + 1)):
            t = clamp(0.18 + u * 0.3 + (wn.fbm(x * 0.1, y * 0.07, 3) - 0.5) * 0.4)
            c.set(x, y, ramp_pick([N[0], N[1], "#2c3a14", "#3a4c1c"], t, x, y))
    rw = e.rng("win")
    for side in (-1, 1):                                              # windows: columns by depth, rows by height
        for k in range(0, 7):
            u0 = 1 - 1 / (1 + 0.55 * k)
            u1 = u0 + 0.38 * (1 - 1 / (1 + 0.55 * (k + 1)) - u0)
            if side < 0:
                xa, xb = u0 * xl_edge, u1 * xl_edge
                ta, tb, ba, bb = -12 + 44 * (xa / xl_edge), -12 + 44 * (xb / xl_edge), 112 - 46 * (xa / xl_edge), 112 - 46 * (xb / xl_edge)
            else:
                xa, xb = 191 - u0 * (191 - xr_edge), 191 - u1 * (191 - xr_edge)
                ua, ub = (191 - xa) / (191 - xr_edge), (191 - xb) / (191 - xr_edge)
                ta, tb, ba, bb = -12 + 44 * ua, -12 + 44 * ub, 112 - 46 * ua, 112 - 46 * ub
            for r in range(5):
                f0, f1 = 0.12 + r * 0.16, 0.12 + r * 0.16 + 0.07
                ya0, ya1 = ta + (ba - ta) * f0, ta + (ba - ta) * f1
                yb0, yb1 = tb + (bb - tb) * f0, tb + (bb - tb) * f1
                lit = rw.random() < 0.55
                col = rw.choice(["#e8c850", "#c8a838", "#a8c040"]) if lit else "#0c1206"
                c.poly([(xa, ya0), (xb, yb0), (xb, yb1), (xa, ya1)], col)
    # the street: damp paving, perspective seams, moss
    hband(c, 66, 107, ["#5a6a2c", "#3e4c1e", "#28340f", "#121a08"], seed=e.seed_for("st"), rough=0.2)
    for x in range(-120, 360, 20):
        c.line([(VX + (x - VX) * 0.18, 64), (VX + (x - VX) * 1.8, 107)], "#1a2410")
    light_pool(c, VX, 66, 50, 6, "#d8d880", t=0.5)
    # the crowd beyond the screen, all smiling and waving; the player at the front with a steaming pot
    rc = e.rng("crowd")
    people = []
    for k in range(15):
        people.append((rc.randint(80, 90), rc.randint(66, 168)))
    people.sort()
    for (yy, xx) in people:
        hh = 20 + (yy - 80)
        pose = rc.choice(["stand", "arms_up", "stand", "carry", "arms_up"])
        f = fig(hh, pose, "#0e1406", facing=rc.choice((1, -1)))
        f["img"] = rim(f["img"], "#c8d070", (-1, -1), min_run=3)
        _put(c, f, xx, yy)
        px0, py0 = int(xx - f["feet"][0]), int(yy - f["feet"][1])
        hx0, hy0 = f["head"]
        c.set(px0 + int(hx0), py0 + int(hy0), "#c8d868")                  # a smile-bright pale face
    me = player_fig("tau", 42, "carry", facing=1)
    me["img"] = tint(me["img"], "#3a4a14", 0.55)
    me["img"] = _lit(me["img"], "#d8e080", "#0a0e04", side=-1, a=0.3, b=0.6, tl=0.3)
    mx, my = _put(c, me, 112, 92)
    hx_, hy_ = me["hands"][0]
    potx, poty = int(mx + hx_), int(my + hy_)
    c.rect(potx - 1, poty - 1, potx + 5, poty + 3, "#d8d0a0")           # the soup pot
    c.rect(potx - 1, poty - 1, potx + 5, poty - 1, "#fff8d0")
    c.rect(potx - 2, poty, potx - 2, poty + 1, "#8a8060")
    sn = e.noise("steam")
    for k in range(16):                                                # steam
        for dx in (-1, 0, 1):
            if sn.fbm((potx + dx) * 0.4, (poty - k) * 0.3, 2) > 0.42:
                blend(c, potx + 2 + dx + int(math.sin(k * 0.6) * 1.5), poty - 2 - k, "#f4f4d0", 0.8 * (1 - k / 18.0), 3)
    # flowers and fungus growing out of the cobbles
    rf = e.rng("flowers")
    for _ in range(46):
        x, y = rf.randint(0, 191), rf.randint(70, 106)
        if rf.random() < 0.5:
            c.set(x, y, rf.choice(["#e8e070", "#f0f0c0", "#c8d850"]))
            c.set(x, y + 1, N[2])
        else:
            c.rect(x, y, x + 1, y, "#b8c85a")
            c.set(x, y - 1, "#6c8a2a")
    # flies
    rfl = e.rng("flies")
    for _ in range(60):
        x, y = rfl.randint(60, 170), rfl.randint(40, 90)
        c.set(x, y, "#0a0e04")
        if rfl.random() < 0.4:
            c.set(x + 1, y - 1, "#3a4a1a")
    # the energy screen: a pale cyan sheet wall to wall with a bright frame, hex shimmer, moss creeping on the pylons
    SX0, SX1 = 46, 175
    for y in range(8, 94):
        edge = max(0.0, 1 - min(y - 8, 93 - y) / 10.0)
        for x in range(SX0, SX1 + 1):
            if y % 3 == 0:
                blend(c, x, y, "#46d8c8", 0.2 + 0.25 * edge, 3)
            elif ((x // 5) + (y // 3) * 2) % 7 == 0 and (x + y) % 2 == 0:
                blend(c, x, y, "#9af6ff", 0.25, 2)
    c.rect(SX0, 8, SX1, 8, "#9af6ff")
    c.rect(SX0, 93, SX1, 93, "#9af6ff")
    for px_ in (SX0 - 3, SX1 - 1):
        c.rect(px_, 6, px_ + 4, 96, "#cfc4a0")
        c.rect(px_, 6, px_ + 1, 96, "#f0e8c8")
        c.rect(px_ + 3, 6, px_ + 4, 96, "#7a6e50")
        c.rect(px_, 4, px_ + 4, 7, TEAL)
        for yy in range(70, 96, 3):                                    # moss climbing the pylon
            c.set(px_ + (yy % 5), yy, "#6c8a2a")
            c.set(px_ + 1 + (yy % 3), yy + 1, "#a8b84a")
    e.protect += ["#9af6ff"]
    vignette_kind(c, "bad", col="#060a02", strength=0.7)
    # in front (our side): two medical drones, and a T'au medic with his back to us
    for (x, y) in [(150, 30), (78, 26)]:
        _drone(c, x, y, 2, lens="#d8f0a0", glow_t=0.3)
        for k in range(0, 40, 2):
            blend(c, x - 2 + k // 3, y + 10 + k, "#d8f0a0", 0.4 * (1 - k / 44.0), 3)
    md = _tau(54, "stand", -1, cloth="#5a6c7a", robe=0.7)
    md["img"] = _lit(md["img"], "#f0f0c8", "#2a3014", side=-1, a=0.3, b=0.55)
    _put(c, md, 22, 108)
