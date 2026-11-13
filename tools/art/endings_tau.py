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
from scenekit import ship_sleek

TEAL = "#46d8c8"
TEAL_L = "#b8fff0"
SKIN = "#7f95ac"
SKIN_D = "#5f7490"
CREAM = ["#7a6a4e", "#b0a07c", "#d8ccaa", "#f0e8cc"]
OCHRE = ["#4a3220", "#7a5a30", "#b08a48", "#dcb870", "#f2dc9c"]


def _dim(c, t, col="#0a0a14", y0=0, y1=107, x0=0, x1=191):
    """uniform grade: mix every pixel toward `col` by t.  A constant mix maps each existing colour to exactly one new
    colour, so the palette does not grow (unlike blend()).  Used to pull a picture into its mood band."""
    col = C(col)
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            c.set(x, y, mix(c.get(x, y), col, t))


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
    sky(c, ["#080f28", "#101e44", "#223a68", "#6a4a72", "#c07058", "#f0a068"], 0, HZ)
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
    hband(c, HZ + 6, 107, ["#8a5a70", "#5e4668", "#3a3658", "#1c2038"], seed=e.seed_for("pl"), rough=0.12)
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
    vignette_kind(c, "good", strength=0.5, inner=0.7)
    _dim(c, 0.16, "#140c1c")
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
    vignette_kind(c, "good", strength=0.46, inner=0.72)
    _dim(c, 0.10, "#06141c")


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
    vignette_kind(c, "good", strength=0.5, inner=0.7)
    _dim(c, 0.10, "#140c1c")
    particles(c, "mote", 40, (30, 14, 186, 100), seed=e.seed_for("mote"), cols=("#ffe8b0", "#fff6d8"))
    # people (after the vignette so they stay clean)
    nb = fig(34, "stand", "#7a6a8c", facing=1)
    nb["img"] = _lit(nb["img"], "#ffd890", "#14101c", side=1, a=0.4, b=0.55)
    _put(c, nb, 108, 84, shadow=dict(toward_light=(1, 0.5), length=1.0, squash=0.3, col="#14101c", t=0.7))
    kn = fig(32, "kneel", "#7a6a8c", facing=-1)                       # a neighbour kneeling, laying floor planks
    kn["img"] = _lit(kn["img"], "#ffd890", "#14101c", side=1, a=0.4, b=0.55)
    _put(c, kn, 142, 101, shadow=dict(toward_light=(1, 0.5), length=1.0, squash=0.3, col="#14101c", t=0.7))
    for k, (x0_, x1_) in enumerate([(150, 186), (152, 190), (148, 182)]):      # planks laid flat in rows
        yy = 95 + k * 4
        c.rect(x0_, yy, x1_, yy + 2, "#c08a58")
        c.rect(x0_, yy, x1_, yy, "#f0c898")
        c.rect(x0_ + 12, yy, x0_ + 12, yy + 2, "#7a5438")
        c.rect(x0_ + 25, yy, x0_ + 25, yy + 2, "#7a5438")
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
    vignette_kind(c, "bad", col="#050802", strength=0.86, inner=0.5)
    _dim(c, 0.14, "#050802")
    # in front (our side): two medical drones, and a T'au medic with his back to us
    for (x, y) in [(150, 30), (78, 26)]:
        _drone(c, x, y, 2, lens="#d8f0a0", glow_t=0.3)
        for k in range(0, 40, 2):
            blend(c, x - 2 + k // 3, y + 10 + k, "#d8f0a0", 0.4 * (1 - k / 44.0), 3)
    md = _tau(54, "stand", -1, cloth="#5a6c7a", robe=0.7)
    md["img"] = _lit(md["img"], "#f0f0c8", "#2a3014", side=-1, a=0.3, b=0.55)
    _put(c, md, 22, 108)


# ================================================================== BAD (rest of the claims + the five plain ones)

def _hollow(c, f, x, y, rim_col, inner_a, inner_b, seed=1, star="#ffd8f4", shadow=None):
    """a figure drawn as an empty shell: a 1px bright rim and a dark, star-flecked void inside.  Feet at (x, y)."""
    img = f["img"]
    ax, ay = f["feet"]
    px0, py0 = int(round(x - ax)), int(round(y - ay))
    a = img.getchannel("A").load()
    rr = random.Random(seed)

    def solid(i, j):
        return 0 <= i < img.width and 0 <= j < img.height and a[i, j] >= 128
    for j in range(img.height):
        for i in range(img.width):
            if not solid(i, j):
                continue
            edge = not (solid(i - 1, j) and solid(i + 1, j) and solid(i, j - 1) and solid(i, j + 1))
            if edge:
                c.set(px0 + i, py0 + j, rim_col)
            else:
                blend(c, px0 + i, py0 + j, inner_b, 0.66, 3)       # see-through: the glow behind shows, dimmed
                if rr.random() < 0.05:
                    c.set(px0 + i, py0 + j, star)
    return px0, py0


@ending("tau_end_claim_slaanesh")
def tau_end_claim_slaanesh(e):
    """BAD / Slaanesh.  The Party That Never Ends: a night plaza in the human quarter, stage lights crossing in a
    magenta-silver haze, a three-tier sugar tower and speaker stacks on the stage edge, strings of bulbs overhead,
    and a crowd seen from behind, hands up, clapping.  On the mirror-black stage floor the player stands alone, an
    empty shell with a rim of pink light and a void inside, his reflection hollow too.
    Bright mass: upper-left spot beams meeting on the stage right of centre; crowd dark along the bottom."""
    c = e.c
    S = GOD["slaanesh"]["ramp"]
    HZ = 56
    sky(c, [S[0], "#1a0a2a", "#2e1046", "#5a2078"], 0, HZ)
    stars(c, e.seed_for("st"), 40, 0, 30, cols=("#8a6aa8", "#e8d8f8", "#ffffff"))
    # the quarter behind the stage: tall T'au pillars in violet, a few pink bands
    for (x, w, h, k) in [(10, 5, 44, 0), (34, 4, 30, 1), (150, 4, 34, 1), (176, 6, 50, 0)]:
        _tower(c, x, HZ + 3, w, h, [S[0], S[1], S[2], S[3]], bands=3, band_col=S[4])
    haze(c, HZ - 20, HZ + 4, S[3], t=0.36, seed=e.seed_for("hz"), profile="mid")
    # a plain, huge ring behind the stage (a T'au ring turned into a halo), silver-pink
    RX, RY = 126, 34
    for r_, col in [(24, "#8a3aa8"), (22, "#e8e0f4"), (20, S[3]), (19, S[2])]:
        _ring(c, RX, RY, r_, col, 1)
    glow(c, RX, RY, 30, [S[1], S[2], S[3], S[4]], power=1.7, strength=0.7, ry=26)
    # stage: mirror-black floor receding from the front edge at y=72 to the back wall at y=57
    for y in range(HZ + 1, 74):
        t = (y - HZ - 1) / 16.0
        for x in range(30, 192):
            c.set(x, y, ramp_pick(["#0a0412", "#1a0a28", "#3a1a50", "#5a2a70"], 0.3 + 0.2 * (1 - t) + 0.28 * (math.sin(x * 0.7 + y * 0.9) * 0.5 + 0.5) * (1 - t), x, y))
    c.rect(30, 74, 191, 77, "#2a1040")
    c.rect(30, 74, 191, 74, S[3])
    c.rect(30, 77, 191, 77, "#10061a")
    for x in range(32, 192, 6):
        c.set(x, 76, S[4])
    # light the wall / floor from above-left
    shafts(c, (30, -4), 52, 52, 7, 100, "#ffd8f8", t=0.22, seed=e.seed_for("sh1"), w0=2, w1=10, power=0.7)
    shafts(c, (188, -4), 126, 34, 4, 90, S[4], t=0.18, seed=e.seed_for("sh2"), w0=2, w1=9, power=0.7)
    light_pool(c, 118, 69, 36, 4, S[4], t=0.4)
    # strings of bulbs across the top
    for (y0, amp) in [(5, 3), (13, 4)]:
        pts = []
        for x in range(0, 192, 2):
            yy = y0 + amp * math.sin(x * 0.06 + y0) + 0.5 * amp
            pts.append((x, yy))
        c.line(pts, "#10061a")
        for k in range(0, len(pts), 4):
            xx, yy = int(pts[k][0]), int(pts[k][1])
            c.set(xx, yy + 1, "#fff0f8" if k % 8 == 0 else S[4])
            blend(c, xx + 1, yy + 1, S[4], 0.5, 2)
            blend(c, xx - 1, yy + 1, S[4], 0.5, 2)
            blend(c, xx, yy + 2, S[3], 0.5, 2)
    # the sugar tower (left of the stage edge): three tiers, pink and cream, a candle on top
    tx, ty = 52, 72
    for k, (w_, h_, col, hi) in enumerate([(13, 7, "#d86ab8", "#ffb0e0"), (9, 6, "#f0d8e8", "#ffffff"), (6, 5, "#ff8ad8", "#ffd0f0")]):
        yb = ty - sum(hh for (_, hh, _, _) in [(13, 7, 0, 0), (9, 6, 0, 0), (6, 5, 0, 0)][:k])
        c.rect(tx - w_, yb - h_, tx + w_, yb, col)
        c.rect(tx - w_, yb - h_, tx + w_, yb - h_, hi)
        c.rect(tx + w_ - 2, yb - h_ + 1, tx + w_, yb, "#7a2a9a")
        for xx in range(tx - w_ + 1, tx + w_, 3):
            c.set(xx, yb - h_ + 2, "#fff0f8")
    c.rect(tx, ty - 22, tx, ty - 19, "#f0e8f8")
    c.set(tx, ty - 23, "#ffe8a0")
    glow(c, tx, ty - 23, 5, ["#7a2a6a", "#ff8ad8", "#fff8d0"], power=1.2, strength=1.0)
    # speaker stacks: dark boxes with a silver ring cone
    for sx_ in (36, 184):
        c.rect(sx_ - 6, 52, sx_ + 6, 74, "#14081e")
        c.rect(sx_ - 6, 52, sx_ - 6, 74, "#5a3a78")
        for sy_ in (59, 68):
            _ring(c, sx_, sy_, 3, "#c8b8d8", 1)
            c.set(sx_, sy_, S[4])
    # the player on the stage, an empty shell, with his hollow reflection in the floor
    me = player_fig("tau", 44, "stand", facing=-1)
    FX, FY = 128, 66
    ax, ay = me["feet"]
    img_ = me["img"]
    al = img_.getchannel("A").load()
    for j in range(img_.height):                                      # reflection: the same shell, mirrored, fading
        for i in range(img_.width):
            if al[i, j] < 128:
                continue
            yy = FY + 2 + (img_.height - 1 - j) * 1
            if yy > 73:
                continue
            edge = not (0 <= i - 1 and al[i - 1, j] >= 128 and i + 1 < img_.width and al[i + 1, j] >= 128)
            if edge:
                blend(c, int(FX - ax) + i, yy, "#ffd8f4", 0.7 - 0.05 * (yy - FY), 3)
    _hollow(c, me, FX, FY, "#ffd8f4", "#2a0e3c", "#12061c", seed=e.seed_for("v"))
    # bridge the neck gap of the shell with two rim pixels
    hxx, hyy = int(FX - ax + me["head"][0]), int(FY - ay + me["head"][1])
    for dy in range(4, 9):
        c.set(hxx - 1, hyy + dy, "#ffd8f4")
    e.protect += ["#ffd8f4", "#fff8ff"]
    # the crowd: backs to us, hands up, clapping; three loose rows, heads kept below the stage lip
    rc = e.rng("crowd")
    for (yb, hh, step) in [(90, 17, 15), (100, 22, 19), (112, 28, 23)]:
        xx = -2 + rc.randint(0, 6)
        while xx < 196:
            pose = rc.choice(["arms_up", "stand", "arms_up", "carry", "arms_up"])
            h_ = hh + rc.randint(-2, 2)
            f = fig(h_, pose, "#0e0418", facing=rc.choice((1, -1)))
            f["img"] = rim(f["img"], S[3], (0, -1), min_run=3)
            _put(c, f, xx, yb + rc.randint(-1, 2))
            xx += step + rc.randint(-3, 3)
    particles(c, "petal", 26, (0, 20, 191, 100), seed=e.seed_for("conf"), cols=("#ff8ad8", "#e8e8f8", "#c850c8"))
    vignette_kind(c, "bad", col="#08030e", strength=0.62)


def _door(c, cx, base, w, h, cols, frame="#9af6ff"):
    """an arched doorway (flat, no mark): cols = light colours dark -> bright, brighter toward the threshold."""
    top = base - h
    rr_ = w / 2.0
    for y in range(int(top - rr_), int(base) + 1):
        for x in range(int(cx - rr_) - 1, int(cx + rr_) + 2):
            dx = (x - cx) / rr_
            if y < top + rr_:
                inside = (dx * dx + ((y - (top + rr_)) / rr_) ** 2) <= 1.0
            else:
                inside = abs(dx) <= 1.0
            if inside:
                t = (y - (top - rr_)) / float(base - top + rr_)
                c.set(x, y, ramp_pick(cols, clamp(0.15 + 0.85 * t ** 1.3), x, y))
    for y in range(int(top - rr_), int(base) + 1):                    # 1 px frame
        for x in range(int(cx - rr_) - 2, int(cx + rr_) + 3):
            def ins(xx, yy):
                dx = (xx - cx) / (rr_ + 0.5)
                if yy < top + rr_:
                    return (dx * dx + ((yy - (top + rr_)) / (rr_ + 0.5)) ** 2) <= 1.0
                return abs(dx) <= 1.0 and yy <= base
            if ins(x, y) and not (ins(x - 1, y) and ins(x + 1, y) and ins(x, y - 1) and ins(x, y + 1)):
                c.set(x, y, frame)


def _page(c, x, y, ang, w=5, h=7, col="#e8f4ff", edge="#9af6ff", lines="#6a8ac8"):
    """a tilted sheet of paper with two faint ruled lines (not letters)."""
    ca, sa = math.cos(ang), math.sin(ang)

    def P_(u, v):
        return (x + u * ca - v * sa, y + u * sa + v * ca)
    c.poly([P_(-w / 2.0, -h / 2.0), P_(w / 2.0, -h / 2.0), P_(w / 2.0, h / 2.0), P_(-w / 2.0, h / 2.0)], col)
    c.line([P_(-w / 2.0, -h / 2.0), P_(w / 2.0, -h / 2.0)], edge)
    for v in (-1, 1):
        c.line([P_(-w / 2.0 + 1, v), P_(w / 2.0 - 1, v)], lines)


@ending("tau_end_claim_tzeentch")
def tau_end_claim_tzeentch(e):
    """BAD / Tzeentch.  Triple Agent: a dark hall of schemes.  Three arched doors in a row on the far wall, each with
    someone waiting in it: a T'au envoy (teal light), a crimson battlesuit (red), an Imperial officer (gold).  From
    the player, small on a holo-map floor, three thin threads run to the doors; two more run straight up from his
    raised hands into the dark and meet in a pinprick of white at the top edge, so he is on a string too.  Pages
    he wrote spiral in the air around him.  Bright mass: the band of the three doors at left / centre / right."""
    c = e.c
    T = GOD["tzeentch"]["ramp"]
    HZ = 72
    sky(c, ["#05030c", "#080a24", "#0a1650", "#12308c"], 0, HZ)
    n = e.noise("fl")
    for y in range(0, HZ):                                           # drifting tiles of colour in the dark
        for x in range(192):
            v = n.fbm(x * 0.05, y * 0.09, 3)
            if v > 0.6:
                blend(c, x, y, T[2], (v - 0.6) * 1.1, 3)
    stars(c, e.seed_for("st"), 50, 0, 60, cols=("#2a5ad8", "#9af6ff", "#ffffff"))
    # the far wall: dark slabs, with a pale cornice line
    c.rect(0, 24, 191, HZ, "#0a0c28")
    for x in range(0, 192, 12):
        c.rect(x, 24, x, HZ, "#10143a")
    c.rect(0, 24, 191, 24, "#2a5ad8")
    c.rect(0, HZ, 191, HZ, "#2ab8ff")
    # three doors and who waits in them
    DOORS = [(30, ["#10202a", "#1a5a62", "#46d8c8", "#b8fff0"], "tau"),
             (88, ["#2a0608", "#7a1010", "#c03020", "#ffa060"], "suit"),
             (160, ["#2a1a06", "#7a5a10", "#d8a040", "#fff0b0"], "imp")]
    for (dx_, cols, who) in DOORS:
        _door(c, dx_, HZ, 24, 38, cols, frame="#cfeaff")
        glow(c, dx_, HZ - 4, 22, [cols[0], cols[1], cols[2]], power=2.0, strength=0.55, ry=14)
        light_pool(c, dx_, HZ + 6, 26, 5, cols[3], t=0.5)
        if who == "tau":
            f = _tau(34, "stand", 1, cloth="#06121a", skin="#0a1e28", robe=0.8)
        elif who == "suit":
            im = _suit(col=("#06020a", "#10040a", "#1c0608", "#2a0a0c"), lens=cols[3], facing=1)
            im = im.resize((im.width * 3 // 5, im.height * 3 // 5), Image.NEAREST)
            f = dict(img=im, feet=(im.width // 2, im.height - 1))
        else:
            f = fig(32, "stand", "#120c04", facing=-1, robe=0.8)
            im = f["img"]
            hx_, hy_ = f["head"]
            px_ = im.load()
            for xx in range(int(hx_ - 4), int(hx_ + 5)):                # peaked cap + shoulder bars
                if 0 <= xx < im.width:
                    px_[xx, max(0, int(hy_ - 4))] = (18, 12, 4, 255)
                    px_[xx, max(0, int(hy_ - 3))] = (18, 12, 4, 255)
        im = f["img"]
        if who != "suit":
            f["img"] = tint(im, "#05030c", 0.8)
        f["img"] = rim(f["img"], cols[3], (0, -1), min_run=2)
        _put(c, f, dx_, HZ - 1)
    # the floor: a holo war-map in perspective, cyan lines, a few lit hexes
    for y in range(HZ + 1, 108):
        t = (y - HZ) / 36.0
        for x in range(192):
            c.set(x, y, ramp_pick(["#05030c", "#080e30", "#0c1a58", "#143a96"], 0.15 + 0.4 * (1 - t) + 0.1 * math.sin(x * 0.2), x, y))
    VX = 96
    for x in range(-260, 460, 24):
        c.line([(VX + (x - VX) * 0.12, HZ + 1), (VX + (x - VX) * 1.9, 107)], "#1a5ad8")
    for y in (75, 79, 85, 93, 103):
        c.line([(0, y), (191, y)], "#12308c")
    rh = e.rng("hex")
    for _ in range(14):
        x, y = rh.randint(10, 180), rh.randint(HZ + 3, 106)
        wdt = 3 + (y - HZ) // 8
        c.rect(x, y, x + wdt, y + max(1, wdt // 3), rh.choice(["#2ab8ff", "#e83aa8", "#9af6ff"]))
    # the player: arms raised, small, centre-left of the floor
    me = player_fig("tau", 46, "arms_up", facing=1)
    me["img"] = tint(me["img"], "#101a60", 0.74)
    me["img"] = rim(me["img"], "#9af6ff", (-1, -1), min_run=2)
    PX_, PY_ = 122, 107
    mx, my = _put(c, me, PX_, PY_)
    hand0 = (mx + me["hands"][0][0], my + me["hands"][0][1])
    hand1 = (mx + me["hands"][1][0], my + me["hands"][1][1])
    head = (mx + me["head"][0], my + me["head"][1])
    chest = (mx + me["head"][0], my + me["head"][1] + 9)
    # strings up from the raised hands to a pinprick at the top edge
    APEX = (124, 0)
    for hnd in (hand0, hand1):
        c.line([hnd, APEX], "#e83aa8")
    glow(c, APEX[0], 2, 6, ["#2a1060", "#e83aa8", "#ffffff"], power=1.3, strength=1.0)
    # three threads from his chest to the three doorways (thin, pink and cyan)
    for (dx_, col) in [(30, "#9af6ff"), (88, "#ff8ad8"), (160, "#9af6ff")]:
        c.line([chest, (dx_, HZ - 12)], col)
        blend(c, int((chest[0] + dx_) / 2), int((chest[1] + HZ - 12) / 2), "#ffffff", 0.9, 1)
    # pages in the air, spiralling around him (the plans he wrote down)
    rp = e.rng("pages")
    for k in range(15):
        a = k * 0.62
        rad = 14 + k * 3.4
        px_ = PX_ + math.cos(a) * rad * 1.5
        py_ = 62 + (k * 2.6) + math.sin(a) * rad * 0.28
        if py_ > 102:
            continue
        _page(c, px_, py_, a * 0.9 + rp.random(), 5 + (k % 2), 7 - (k % 2), col="#e8f4ff" if k % 3 else "#ffd8f4")
    e.protect += ["#e8f4ff", "#e83aa8", "#9af6ff", "#ffd8f4"]
    particles(c, "mote", 30, (0, 6, 191, 100), seed=e.seed_for("m"), cols=("#2ab8ff", "#9af6ff", "#e83aa8"))
    vignette_kind(c, "bad", col="#05030c", strength=0.6)


def _commissar_fig(h, facing=1, coat="#10141c"):
    """a long-coated officer: robe silhouette, peaked cap, broad shoulders.  No insignia."""
    f = fig(h, "stand", coat, facing=facing, robe=0.92, thick=1.15)
    img = f["img"]
    px = img.load()
    hx_, hy_ = f["head"]
    cap = C("#0a0c12") + (255,)
    r = max(2, int(0.1 * h))
    for yy in (int(hy_ - r - 1), int(hy_ - r)):                       # the flat cap, a little wider than the head
        for xx in range(int(hx_ - r - 2), int(hx_ + r + 3)):
            if 0 <= xx < img.width and 0 <= yy < img.height:
                px[xx, yy] = cap
    for xx in range(int(hx_ - r), int(hx_ + r + 1)):                  # peak toward facing
        yy = int(hy_ - r + 1)
        if 0 <= xx < img.width and 0 <= yy < img.height:
            px[xx, yy] = cap
    return f


@ending("tau_end_collaborator")
def tau_end_collaborator(e):
    """BAD.  Collaborators: a ruined courtyard in New Calder at cold dawn.  A breach in the wall at right lets a pale gold
    light in; in it the player and Rena kneel, small and backlit.  In front of the breach a short line of guardsmen
    stands side-on with their rifles at the shoulder, aimed at the two.  At the left, large and dark, the commissar
    with his back half to us holds a sheet of paper at arm's length, reading the sentence; in his other hand a pendant
    on its chain glints.  A loudspeaker horn on a pole above the breach.  Bright mass: the breach, lower right."""
    c = e.c
    HZ = 70
    sky(c, ["#141c34", "#22304e", "#3c4c70", "#8a8c88", "#d8c898"], 0, 68)
    clouds(c, e.seed_for("cl"), ["#101830", "#1c2a48", "#34446a"], 0, 34, scale=0.05, thresh=0.5, stretch=4.0)
    SX, SY = 150, 60
    glow(c, SX, SY, 38, ["#5a6478", "#b0a888", "#f0dca0", "#fff6d0"], power=1.5, strength=1.0, ry=26)
    # distant broken towers through the breach
    skyline(c, e.seed_for("sk"), 70, "#5a6480", 9, 6, 22, 3, 7, x0=116, x1=186, win_p=0.0, tips=0.2)
    haze(c, 44, 72, "#e8dca8", t=0.5, seed=e.seed_for("hz"), profile="bottom", x0=110)
    # the wall: cold grey, ragged top, broken open between x=118..178
    wn = e.noise("wall")
    for x in range(192):
        if 118 <= x <= 178:
            top = 74 - int(4 * math.sin((x - 118) * 0.2))              # low rubble in the gap
        else:
            near = min(abs(x - 118), abs(x - 178))
            top = int(40 + 9 * (wn.fbm(x * 0.09, 2.0, 2) - 0.5) * 2 + (0 if x < 118 else 4) + max(0, 14 - near) * 0.5 * (1 if x > 90 and x < 205 else 0))
        for y in range(max(0, top), HZ + 4):
            t = clamp(0.25 + (y - top) / 60.0 * 0.35 + (wn.fbm(x * 0.1, y * 0.14, 3) - 0.5) * 0.3 + (0.15 if x < 60 else 0))
            if ((y // 4) % 2 == 0 and x % 9 == 0) or ((y // 4) % 2 == 1 and x % 9 == 4):
                t *= 0.7
            c.set(x, y, ramp_pick(["#0c101c", "#1a2236", "#2e3a56", "#4e5c78"], t, x, y))
        if not (118 <= x <= 178):
            c.set(x, max(0, top), "#6a7890")
    # floor: cracked paving, lit near the breach
    hband(c, HZ + 4, 107, ["#6a665a", "#464a54", "#262c3a", "#0e121c"], seed=e.seed_for("fl"), rough=0.2)
    for x in range(-100, 320, 18):
        c.line([(150 + (x - 150) * 0.2, HZ + 4), (150 + (x - 150) * 2.0, 107)], "#2a303c")
    light_pool(c, 150, 88, 54, 10, "#f8e8b0", t=0.5)
    shafts(c, (SX, SY), 118, 50, 8, 56, "#fff0c0", t=0.22, seed=e.seed_for("sh"), w0=3, w1=12, power=0.6, floor=100)
    # rubble in the foreground
    rr = e.rng("rub")
    for _ in range(22):
        x, y = rr.randint(0, 191), rr.randint(94, 107)
        w_ = rr.randint(3, 8)
        c.rect(x, y, x + w_, y + 1, rr.choice(["#2a303c", "#4a5060", "#6a7084"]))
        c.rect(x, y, x + w_, y, "#8a90a0")
    # the loudspeaker horn, on a pole above the breach
    c.line([(156, 6), (156, 54)], "#1a2030")
    c.line([(150, 12), (164, 8)], "#1a2030", 2)
    c.poly([(160, 4), (172, 0), (172, 14), (160, 10)], "#1a2030")
    c.line([(160, 4), (172, 0)], "#7a889c")
    c.rect(160, 5, 161, 9, "#c8c8c0")
    c.ellipse(172, 7, 2, 7, "#3a4660")
    c.line([(172, 1), (172, 13)], "#9aa4b4")
    # the guardsmen: side-on, rifles at the shoulder aimed right at the kneeling two
    for k, x in enumerate([60, 74, 88, 102, 116]):
        g = fig(31, "reach", "#0c1018", facing=1)
        g["img"] = rim(g["img"], "#f0dca0", (1, -0.5), min_run=2)
        gx, gy = _put(c, g, x, 92 + (k % 2), shadow=dict(toward_light=(1, 0.4), length=0.9, squash=0.25, col="#101420", t=0.6))
        hx_, hy_ = g["hands"][0]
        c.line([(gx + hx_ - 7, gy + hy_ + 1), (gx + hx_ + 10, gy + hy_ - 1)], "#0a0c12", 1)
    # the two, kneeling in the gap, backlit
    for (x, y, h_, pz) in [(146, 92, 26, "kneel"), (160, 94, 24, "kneel")]:
        f = fig(h_, pz, "#0a0c12", facing=-1)
        f["img"] = rim(f["img"], "#fff0c0", (1, -1), min_run=2)
        _put(c, f, x, y)
    c.set(147, 79, "#b89c6c")                                         # the player's coat band, a pixel of colour
    c.set(148, 79, "#e8e8f0")
    # the commissar, left foreground: large, back half to us, paper held out, pendant on its chain
    cm = _commissar_fig(78, facing=1)
    cm["img"] = _lit(cm["img"], "#8a94a8", "#04060a", side=1, a=0.3, b=0.7, tl=0.45, td=0.4)
    cm["img"] = rim(cm["img"], "#c8c0a0", (1, -0.2), min_run=2)
    cx_, cy_ = _put(c, cm, 30, 112, shadow=dict(toward_light=(1, 0.3), length=0.9, squash=0.25, col="#080a10", t=0.6))
    hnd = cm["hands"][0]
    ax_, ay_ = int(cx_ + hnd[0]), int(cy_ + hnd[1])
    c.line([(cx_ + int(cm["head"][0]) + 3, cy_ + int(cm["head"][1]) + 9), (ax_ + 11, ay_ - 20)], "#0a0c12", 2)
    c.rect(ax_ + 10, ay_ - 30, ax_ + 18, ay_ - 20, "#f4f0dc")        # the sheet
    c.rect(ax_ + 10, ay_ - 30, ax_ + 18, ay_ - 30, "#ffffff")
    c.rect(ax_ + 17, ay_ - 30, ax_ + 18, ay_ - 20, "#a8a490")
    for yy in (ay_ - 27, ay_ - 24):
        c.rect(ax_ + 12, yy, ax_ + 16, yy, "#8a8470")
    px2, py2 = ax_ + 6, ay_ + 4                                      # pendant dangling from the other hand
    c.line([(px2, py2 - 6), (px2, py2)], "#c8a050")
    c.rect(px2 - 1, py2, px2 + 1, py2 + 2, "#ffd878")
    e.protect += ["#ffd878", "#c8a050"]
    particles(c, "ash", 36, (0, 10, 191, 100), seed=e.seed_for("ash"), cols=("#9a9488", "#c8c4b0", "#5a5e6c"))
    vignette_kind(c, "bad", col="#04060c", strength=0.72)


def _bug(h, col, facing=-1, ss=6, claws=2):
    """a hunched, long-armed swarm creature as a flat silhouette: swept crest, arched back, two scything arms raised
    toward the front, a thin tail.  Faces left by default (xenos face left).  Returns (img, feet)."""
    Wd, Hd = int(h * 1.5 * ss), int(h * 1.25 * ss)
    big = Image.new("L", (Wd, Hd), 0)
    d = ImageDraw.Draw(big)
    u = h * ss

    def T(x, y):
        return (Wd * 0.5 + x * u, Hd * 0.96 - y * u)

    def ln(pts, w):
        d.line([T(*p) for p in pts], fill=255, width=max(1, int(w * u)))
        for p in (pts[0], pts[-1]):
            q = T(*p)
            r = w * u / 2
            d.ellipse([q[0] - r, q[1] - r, q[0] + r, q[1] + r], fill=255)
    d.polygon([T(0.26, 0.34), T(0.04, 0.30), T(-0.17, 0.60), T(-0.03, 0.72), T(0.16, 0.56)], fill=255)   # arched body
    ln([(0.22, 0.38), (0.46, 0.22), (0.62, 0.08)], 0.04)                                                 # tail
    ln([(0.15, 0.36), (0.22, 0.17), (0.13, 0.0)], 0.06)                                                  # legs
    ln([(0.04, 0.34), (-0.05, 0.15), (-0.17, 0.0)], 0.06)
    q = T(-0.25, 0.72)
    r = 0.075 * u
    d.ellipse([q[0] - r * 1.25, q[1] - r, q[0] + r * 1.25, q[1] + r], fill=255)                          # head, a long snout
    d.polygon([T(-0.2, 0.8), T(0.12, 1.0), T(0.02, 0.78)], fill=255)                                     # crest swept back
    ln([(-0.13, 0.62), (-0.34, 0.80), (-0.30, 1.0)], 0.045)                                              # raised arms
    if claws > 1:
        ln([(-0.07, 0.66), (-0.22, 0.90), (-0.12, 1.07)], 0.045)
    small = big.resize((Wd // ss, Hd // ss), Image.BOX).point(lambda v: 255 if v >= 100 else 0)
    bb = small.getbbox() or (0, 0, 1, 1)
    small = small.crop(bb)
    out = Image.new("RGBA", small.size, (0, 0, 0, 0))
    out.paste(Image.new("RGBA", small.size, C(col) + (255,)), (0, 0), small)
    feet = ((T(0.0, 0.0)[0] / ss) - bb[0], (T(0.0, 0.0)[1] / ss) - bb[1])
    if facing > 0:
        out = out.transpose(Image.FLIP_LEFT_RIGHT)
        feet = (out.width - 1 - feet[0], feet[1])
    return out, feet


def _bust_row(c, key, xs, base, scale, dark, light=None, fade=14, mirror=False, seed=1, jitter=2, crop=None):
    """a row of sprite busts as flat silhouettes, bottoms dissolved into whatever fog is painted over them next.
    `scale` may be fractional (nearest-neighbour resize); `base` = bottom y."""
    rr = random.Random(seed)
    im0 = spr(key, 1, mirror=mirror, silhouette=(dark, light) if light else dark, crop=crop)
    w_, h_ = max(4, int(im0.width * scale)), max(4, int(im0.height * scale))
    im = im0.resize((w_, h_), Image.NEAREST)
    if fade:
        im = fade_bottom(im, max(2, int(fade * scale)))
    for x in xs:
        place(c, im, x + rr.randint(-jitter, jitter), base + rr.randint(-jitter, jitter), anchor="bm")
    return im


@ending("tau_end_devoured")
def tau_end_devoured(e):
    """BAD.  Devoured: dusk in the spore fog.  The player, small and dark at the lower left, walks right into the mist
    with the drone fragment held out in front of him: a point of teal light and two thin rings (the two beeps).  The
    fog is a bright violet band; against it rise rows of dark bone-crested heads, a few hundred, far ones small and
    pale, near ones large, all turned toward the little light, pairs of yellow eyes in the gaps.  Orange spores fall
    in slants.  Bright mass: the fog band at mid height, centre-right; the teal pinprick at the lower left."""
    c = e.c
    HZ = 70
    sky(c, ["#0c0614", "#1e1030", "#3a2250", "#6a4478", "#a07a98"], 0, 72)
    clouds(c, e.seed_for("cl"), ["#140a22", "#2a1840", "#4a3060"], 0, 36, scale=0.045, thresh=0.5, stretch=3.5)
    # ground: dark wet moss, a track running to the horde
    hband(c, HZ, 107, ["#5a3a5c", "#32203e", "#1a0e24", "#0a0614"], seed=e.seed_for("gr"), rough=0.2)
    # far silhouettes of spore-trees at the edges
    for (x, h_, w_) in [(4, 52, 6), (20, 40, 4), (176, 56, 7), (160, 38, 4)]:
        c.rect(x, HZ - h_, x + w_, HZ + 2, "#120a1c")
        for k in range(4):
            c.line([(x + w_ // 2, HZ - h_ + k * 6), (x + w_ // 2 + (k % 2 * 2 - 1) * 9, HZ - h_ - 4 + k * 6)], "#120a1c", 2)
    # the horde: heads rising out of a bright fog, far rows small and pale, near rows large and dark
    glow(c, 124, 60, 100, ["#3a2250", "#6a4478", "#a47aa0", "#d8aec4", "#f6dcdc"], power=1.5, strength=1.0, ry=34)
    rrow = e.rng("rows")

    def rank(n, x0, x1, base0, base1, h0, h1, col, hz_col, hz_t, seed):
        rr_ = e.rng(seed)
        items = [(rr_.uniform(base0, base1), rr_.uniform(x0, x1)) for _ in range(n)]
        for (yy, xx) in sorted(items):
            hh = int(h0 + (h1 - h0) * (yy - base0) / max(1.0, base1 - base0) + rr_.randint(-1, 1))
            img, ft = _bug(hh, col, -1)
            place(c, img, int(xx - ft[0]), int(yy - ft[1]), anchor="tl")
        haze(c, int(base0) - 10, int(base1) + 4, hz_col, t=hz_t, seed=e.seed_for("h" + seed), profile="bottom", scale=0.02)
    rank(40, 50, 190, 56, 62, 13, 15, "#7a5a94", "#e8c4d4", 0.42, "k0")
    rank(26, 46, 190, 66, 74, 21, 24, "#4a3270", "#d8aec8", 0.4, "k1")
    rank(9, 62, 190, 80, 90, 31, 36, "#241446", "#a47aa4", 0.34, "k2")
    rank(2, 132, 192, 108, 112, 54, 58, "#0e0618", "#6a4a80", 0.0, "k3")
    # eyes in the gaps
    re_ = e.rng("eyes")
    for _ in range(46):
        x, y = re_.randint(56, 186), re_.randint(46, 96)
        if c.get(x, y)[0] < 120 and c.get(x + 3, y)[0] < 120:
            c.set(x, y, "#e8d850")
            c.set(x + 3, y, "#e8d850")
    # orange spores falling in slants
    rs = e.rng("spores")
    for _ in range(46):
        x, y = rs.randint(0, 191), rs.randint(0, 100)
        c.set(x, y, "#ffb840")
        c.set(x - 1, y - 2, "#c8782c")
        c.set(x - 2, y - 4, "#6a3c2c")
    # the player, small, dark, from behind, walking into it; the fragment ahead of him throws teal light
    me = player_fig("tau", 44, "walk", facing=1)
    me["img"] = tint(me["img"], "#0c0614", 0.9)
    mx, my = 30, 106
    f_x, f_y = mx + 20, 80                                           # the fragment, held out at chest height
    light_pool(c, f_x - 2, 104, 36, 4, "#46d8c8", t=0.5)
    me["img"] = rim(me["img"], "#9af6ff", (1, -0.2), min_run=2)
    _put(c, me, mx, my, shadow=dict(toward_light=(1, 0.5), length=0.9, squash=0.25, col="#06030c", t=0.7))
    c.line([(mx + 8, 79), (f_x - 1, f_y)], "#0c0614", 2)
    glow(c, f_x, f_y, 7, ["#1a5a62", "#46d8c8", "#e8ffff"], power=1.3, strength=1.0)
    c.set(f_x, f_y, "#ffffff")
    for r_ in (9, 15):                                               # two pulses, drawn as short arcs
        for a in range(-70, 71, 14):
            ca = math.radians(a)
            c.set(f_x + math.cos(ca) * r_, f_y + math.sin(ca) * r_, "#9af6ff")
    e.protect += ["#9af6ff", "#e8ffff", "#ffffff", "#e8d850"]
    vignette_kind(c, "bad", col="#06030c", strength=0.68)


@ending("tau_end_gate")
def tau_end_gate(e):
    """BAD.  Temporarily Postponed: the port gate at night.  A tall arched gate of pale hull plates, its field sealed
    cyan-white, stands right of centre between two pylons topped with amber lamps (the 'postponed' light).  A dark,
    unlit ship hangs in the sky above it.  Kel'ra, big and dark in the left foreground, holds her rifle level, a
    flash at the muzzle and one thin teal line running to the player, who has dropped to one knee short of the gate.
    A scatter of pale-blue cards on the paving; small silhouettes of the queue wait in the lanes.
    Bright mass: the gate field, right of centre; cold, closing-in."""
    c = e.c
    HZ = 70
    sky(c, ["#04060e", "#08142a", "#102a48", "#1c4a68", "#3a7a88"], 0, HZ)
    stars(c, e.seed_for("st"), 40, 0, 34, cols=("#6a8aa8", "#c8e0f0", "#ffffff"))
    clouds(c, e.seed_for("cl"), ["#06101e", "#0c1c34", "#1a3858"], 4, 40, scale=0.05, thresh=0.55, stretch=4.0)
    # a dark ship hanging over the gate: unlit hull, a few amber running lights
    ship_sleek(c, 180, 20, 100, "#1c3252", "#5a82a8", "#0a1626", glowc="#1c3252", face=-1)
    for (x, y) in [(108, 26), (122, 28), (136, 29), (150, 29)]:
        c.set(x, y, "#ffb040")
    for x in range(100, 170, 3):
        c.set(x, 26 + (x - 100) // 14, "#2a5a78")
    # far port: low buildings with a few lit windows
    skyline(c, e.seed_for("sk"), HZ + 2, "#0e2236", 14, 6, 20, 4, 10, x0=0, x1=191, win_p=0.08, wincol=("#46d8c8", "#9af6ff"), tips=0.1)
    # the gate: thick hull-plate arch, sealed field inside
    GX, GB = 134, HZ + 1
    _door(c, GX, GB, 62, 52, ["#1c2c3c", "#4a6078", "#8aa0b4", "#d8e4ec"], frame="#e8f2f8")
    _door(c, GX, GB, 50, 46, ["#0c3a48", "#1a7a88", "#46d8c8", "#d0fff4"], frame="#9af6ff")
    for y in range(GB - 62, GB):                                       # field scanlines + hex shimmer
        for x in range(GX - 26, GX + 27):
            if y % 3 == 0 and abs(x - GX) < 24:
                blend(c, x, y, "#ffffff", 0.18, 2)
            elif ((x // 4) + (y // 3) * 2) % 6 == 0 and (x + y) % 2 == 0:
                blend(c, x, y, "#e8ffff", 0.25, 2)
    glow(c, GX, GB - 10, 56, ["#0c3a48", "#1a7a88", "#46d8c8"], power=2.4, strength=0.5, ry=36)
    # pylons with amber lamps (the postponed signal)
    for (x, h_) in [(82, 54), (186, 58)]:
        _tower(c, x, HZ + 4, 6, h_, ["#1c2c3c", "#4a6078", "#8aa0b4", "#c8d4e0"], bands=2, band_col="#46d8c8")
        for dy in (0, 4):
            c.rect(x - 2, HZ + 4 - h_ - 6 + dy, x + 2, HZ + 4 - h_ - 4 + dy, "#ffb040")
        glow(c, x, HZ + 4 - h_ - 4, 9, ["#5a3a10", "#e8902c", "#ffd078"], power=1.3, strength=0.8)
    # the paving: pale, lit by the field, queue lanes converging on the gate
    hband(c, HZ + 4, 107, ["#5a8088", "#38586a", "#1e3446", "#0a1420"], seed=e.seed_for("pv"), rough=0.15)
    for x in range(-180, 380, 22):
        c.line([(GX + (x - GX) * 0.22, HZ + 4), (GX + (x - GX) * 2.0, 107)], "#1c3040")
    for y in (80, 90, 103):
        c.line([(0, y), (191, y)], "#1c3040")
    light_pool(c, GX, HZ + 14, 66, 13, "#b8fff0", t=0.45)
    # the queue: small dark figures standing in the lanes either side of the lit gap
    rq = e.rng("queue")
    for k in range(18):
        side = -1 if k % 2 == 0 else 1
        x = GX + side * rq.randint(24, 62) + rq.randint(-4, 4) + (k // 6) * side * 6
        x = max(6, min(185, x)) if abs(x - 30) > 28 else x + 30
        y = rq.randint(HZ + 7, HZ + 18)
        f = fig(10 + (y - HZ) // 3, rq.choice(["stand", "stand", "hunch"]), "#0a1624", facing=-side)
        _put(c, f, x, y)
    # the cards: pale blue rectangles scattered at the player's feet
    rcd = e.rng("cards")
    for k in range(9):
        x, y = 100 + rcd.randint(0, 38), 96 + rcd.randint(0, 9)
        ww = rcd.randint(3, 5)
        c.rect(x, y, x + ww, y + 1, "#c8e4ff")
        c.rect(x, y, x + ww, y, "#ffffff")
    # the player, dropped to one knee short of the gate, backlit
    me = player_fig("tau", 38, "kneel", facing=1)
    me["img"] = tint(me["img"], "#08121e", 0.82)
    me["img"] = rim(me["img"], "#d8fff4", (1, -0.3), min_run=2)
    PX_, PY_ = 116, 98
    px0, py0 = _put(c, me, PX_, PY_, shadow=dict(toward_light=(1, 0.8), length=0.7, squash=0.5, col="#04101a", t=0.7))
    # the shot: a thin teal line from her muzzle to him, and a flash
    MZ = (62, 62)
    c.line([MZ, (PX_ + 2, PY_ - 16)], "#9af6ff")
    for k in range(3, 38, 6):
        blend(c, MZ[0] + int((PX_ + 2 - MZ[0]) * k / 38.0), MZ[1] + int((PY_ - 16 - MZ[1]) * k / 38.0), "#ffffff", 0.9, 1)
    glow(c, MZ[0], MZ[1], 8, ["#1a5a62", "#46d8c8", "#e8ffff"], power=1.2, strength=1.0)
    c.set(MZ[0], MZ[1], "#ffffff")
    e.protect += ["#ffffff", "#9af6ff", "#ffb040", "#c8e4ff", "#d8fff4"]
    # Kel'ra: the large dark figure, facing right, rifle level, eyes shut (not drawn)
    kel = _fire(76, "reach", 1, armour="#2a2018", suit="#0a121c", rifle=True)
    kel["img"] = rim(kel["img"], "#7ae8d8", (1, -0.2), min_run=2)
    kx, ky = _put(c, kel, 30, 118, shadow=dict(toward_light=(1, 0.4), length=0.8, squash=0.3, col="#04080e", t=0.6))
    hxk, hyk = kx + int(kel["head"][0]), ky + int(kel["head"][1])
    c.rect(hxk, hyk - 1, hxk + 7, hyk - 1, "#0a0806")                  # the visor, shut dark
    c.rect(hxk + 2, hyk, hxk + 7, hyk, "#0a0806")
    particles(c, "ash", 20, (0, 10, 191, 100), seed=e.seed_for("ash"), cols=("#4a5a68", "#6a7a88"))
    vignette_kind(c, "bad", col="#04060c", strength=0.74)
    _dim(c, 0.1, "#04060c")


@ending("tau_end_reeducation")
def tau_end_reeducation(e):
    """BAD.  A Friendly Dialogue: a clinical room of the water caste, two years on.  A big pale portrait of the player
    stands in the right half, washed out from no sun, wearing a smile as exact as a ruler (a row of even teeth); a long
    clean table in front, two cups, one still full.  At the left a tall window onto the dock street at dusk, warm and
    rough: three of his old workmates in work clothes walk past with their backs turned, a crane behind them.
    Nobody looks in.  Bright mass: the window (left, warm) against the pale bust (right, cold)."""
    c = e.c
    # the room: pale teal panels, dim, a plain ring on the wall
    for y in range(108):
        for x in range(192):
            t = 0.25 + 0.3 * (1 - y / 108.0) + 0.1 * math.sin(x * 0.04)
            c.set(x, y, ramp_pick(["#08141a", "#122630", "#244a56", "#4a7882"], t, x, y))
    for x in range(0, 192, 24):
        c.rect(x, 0, x, 88, "#10242c")
        c.rect(x + 1, 0, x + 1, 88, "#34606c")
    c.rect(0, 88, 191, 90, "#0c1a22")
    for (r_, col) in [(14, "#8ac8c8"), (12, "#d8f0f0"), (10, "#46d8c8"), (9, "#2a7a82")]:
        _ring(c, 160, 28, r_, col, 1)
    # the window onto the docks: warm dusk, a crane, a pavement
    WX0, WY0, WX1, WY1 = 8, 8, 78, 82
    for y in range(WY0, WY1 + 1):
        for x in range(WX0, WX1 + 1):
            t = (y - WY0) / float(WY1 - WY0)
            c.set(x, y, ramp_pick(["#2a2050", "#5a3a68", "#c06a60", "#f0a060", "#ffd890"], 0.15 + 0.8 * t ** 1.2, x, y))
    glow(c, 34, 62, 36, ["#a04a50", "#e08a58", "#ffc078", "#fff0b8"], power=1.6, strength=0.9, ry=24)
    skyline(c, e.seed_for("dk"), 70, "#3a2a48", 7, 6, 16, 3, 8, x0=WX0, x1=WX1, win_p=0.0, tips=0.0)
    c.line([(60, 70), (60, 24)], "#1c1430", 2)                       # a loading crane
    c.line([(60, 26), (30, 26)], "#1c1430", 2)
    c.line([(60, 26), (74, 34)], "#1c1430")
    c.line([(32, 27), (32, 44)], "#1c1430")
    c.rect(29, 44, 35, 48, "#1c1430")
    c.rect(WX0, 72, WX1, WY1, "#4a3050")                              # the quay
    c.rect(WX0, 72, WX1, 72, "#c08068")
    for k, (x, hh) in enumerate([(54, 24), (40, 26), (24, 25)]):      # three dock workers, backs turned, walking left
        f = fig(hh, "walk", "#1a1226", facing=-1, pack=(k == 1))
        f["img"] = rim(f["img"], "#ffc078", (1, -0.2), min_run=2)
        _put(c, f, x, 80)
    light_pool(c, 44, 76, 34, 4, "#ffd890", t=0.4)
    # the window frame (cream), sill, and its warm light spilling toward the right
    for (x0, y0, x1, y1) in [(WX0 - 3, WY0 - 3, WX1 + 3, WY0 - 1), (WX0 - 3, WY1 + 1, WX1 + 3, WY1 + 4),
                             (WX0 - 3, WY0 - 3, WX0 - 1, WY1 + 4), (WX1 + 1, WY0 - 3, WX1 + 3, WY1 + 4),
                             (43, WY0, 44, WY1)]:
        c.rect(x0, y0, x1, y1, "#d8ccaa")
    c.rect(WX0 - 3, WY1 + 4, WX1 + 3, WY1 + 4, "#7a6a4e")
    for y in range(WY0, WY1 + 1):                                      # the window is warm but not bright: the room is cold
        for x in range(WX0, WX1 + 1):
            blend(c, x, y, "#1a1030", 0.3, 3)
    # the portrait: the player at 2x, pale and warm on the window side
    pb = spr("player_tau", 2, tint_to="#c0d4e0", tint_t=0.4)
    pb = _lit(pb, "#ffd8a0", "#3a5a68", side=-1, a=0.28, b=0.6, tl=0.3, td=0.35)
    BX, BB = 126, 112
    bx, by = place(c, pb, BX, BB, anchor="bm")
    for y in range(by + 60, 100):                                      # shoulders recede into the room's shade
        for x in range(bx, bx + 96):
            blend(c, x, y, "#0a1c24", 0.45, 3)
    # the smile: even white teeth between two dark lines, drawn exactly
    sx0, sy0 = bx + 49, by + 40
    for dx in range(0, 15):
        curve = int(round(3 * (1 - ((dx - 7) / 7.0) ** 2)))        # ends high, middle low: a smile
        c.set(sx0 + dx, sy0 + curve, "#4a2a28")
        if 1 < dx < 13:
            c.set(sx0 + dx, sy0 + curve + 1, "#f8f8f8")
            c.set(sx0 + dx, sy0 + curve + 2, "#e8e8e8" if dx % 2 else "#f8f8f8")
        c.set(sx0 + dx, sy0 + curve + 3, "#4a2a28")
    e.protect += ["#f8f8f8"]
    # the table: long, clean, cold; a ring-line along its edge; two cups
    c.rect(0, 92, 191, 107, "#8aa8ac")
    c.rect(0, 92, 191, 93, "#d8ecec")
    c.rect(0, 94, 191, 107, "#5a8088")
    c.rect(0, 100, 191, 107, "#34565e")
    c.rect(0, 96, 191, 96, "#46d8c8")
    for (x, full) in [(62, True), (196 - 40, False)]:
        c.rect(x, 86, x + 6, 91, "#f0fafa")
        c.rect(x, 86, x + 6, 86, "#ffffff")
        c.rect(x + 5, 86, x + 6, 91, "#a8c0c4")
        c.rect(x + 1, 87, x + 5, 87, "#7a4a2a" if full else "#d8e8e8")
        c.set(x + 7, 88, "#f0fafa")
        c.set(x + 7, 89, "#f0fafa")
    light_pool(c, 60, 94, 34, 3, "#ffd890", t=0.35)
    particles(c, "mote", 14, (0, 10, 191, 90), seed=e.seed_for("mote"), cols=("#ffd890", "#ffffff"))
    vignette_kind(c, "bad", col="#04101a", strength=0.9, inner=0.42)
    _dim(c, 0.22, "#04101a")


@ending("tau_end_thirdwave")
def tau_end_thirdwave(e):
    """BAD.  The Third Wave: the waiting hall of a T'au border refugee station.  A low ceiling with strip lights, a pale
    wall, and a wall board at upper right: a row of three plain discs, the first two greyed out (gone), the third a
    patient amber.  Refugees sit on the floor in rows, humans and a few Kroot, every one holding a pale-blue card;
    earth-caste crates stacked at the left; in front, right, the player sits holding his own card up to the light.
    Nothing is happening.  Bright mass: board and ceiling strips at the top right; the floor below is dim."""
    c = e.c
    # wall: pale, cold, panel seams; a dark low ceiling lid with light strips
    for y in range(108):
        for x in range(192):
            t = 0.2 + 0.4 * (1 - abs(y - 40) / 70.0) + 0.05 * math.sin(x * 0.07)
            c.set(x, y, ramp_pick(["#0a121c", "#162636", "#2c4458", "#587a90", "#8aaabc"], t, x, y))
    for x in range(0, 192, 32):
        c.rect(x, 12, x, 70, "#0e1a26")
        c.rect(x + 1, 12, x + 1, 70, "#587a90")
    c.rect(0, 0, 191, 11, "#060a12")
    c.rect(0, 11, 191, 12, "#2c4458")
    for x0 in (10, 70, 130):                                            # strip lights in the ceiling
        c.rect(x0, 5, x0 + 40, 7, "#e8f6ff")
        c.rect(x0, 5, x0 + 40, 5, "#ffffff")
        glow(c, x0 + 20, 8, 34, ["#0e1c2c", "#2c5a78", "#78b8d8"], power=2.0, strength=0.6, ry=14)
        shafts(c, (x0 + 20, 8), 90, 70, 4, 74, "#b8e4ff", t=0.12, seed=e.seed_for("s%d" % x0), w0=10, w1=24, power=0.6)
    # the board: dark panel, three plain discs: two greyed, the third amber
    BX0, BY0, BX1, BY1 = 112, 16, 178, 46
    c.rect(BX0 - 2, BY0 - 2, BX1 + 2, BY1 + 2, "#9ab4c4")
    c.rect(BX0, BY0, BX1, BY1, "#06121c")
    for x in range(BX0, BX1 + 1):
        for y in range(BY0, BY1 + 1):
            if (x + y) % 5 == 0 and y % 2 == 0:
                blend(c, x, y, "#1a5a72", 0.5, 2)
    for k, x in enumerate((128, 146, 164)):
        if k < 2:
            c.ellipse(x, 31, 7, 7, "#2a4452")
            c.ellipse(x, 31, 5, 5, "#12222e")
            c.line([(x - 3, 31), (x - 1, 34), (x + 3, 28)], "#4a6a7a")      # a tick, no letter
        else:
            glow(c, x, 31, 16, ["#2a1806", "#8a4a10", "#e8902c"], power=1.5, strength=0.8)
            c.ellipse(x, 31, 7, 7, "#ffb040")
            c.ellipse(x, 31, 5, 5, "#ffe098")
            c.ellipse(x, 31, 2, 2, "#fff6d8")
    c.rect(BX0 + 2, BY1 - 3, BX1 - 2, BY1 - 3, "#2a5a72")
    e.protect += ["#ffb040", "#ffe098", "#fff6d8"]
    # floor
    hband(c, 70, 107, ["#5a7488", "#34485a", "#1c2a38", "#0a121c"], seed=e.seed_for("fl"), rough=0.2)
    for y in (76, 84, 95, 106):
        c.line([(0, y), (191, y)], "#16222e")
    for x0 in (30, 90, 150):
        light_pool(c, x0, 80, 36, 8, "#b8e4ff", t=0.26)
    # earth-caste crates at the left, a ring stripe on each
    for (x, y, w, h_) in [(6, 106, 26, 20), (30, 106, 20, 14), (14, 86, 22, 14)]:
        _crate(c, x, y - h_, w, h_, body="#506478", lite="#8aa4b8", dark="#2a3848", band="#46d8c8")
    vignette_kind(c, "bad", col="#04080e", strength=0.7)
    # the rows of people, sitting on the floor, each with a pale-blue card
    rp = e.rng("people")
    cols = ["#8a7a68", "#6a8aa0", "#a09080", "#7a8a9a", "#9a7a7a", "#7a9a8a"]

    def person(x, y, h_, pose, facing, col):
        f = fig(h_, pose, col, facing=facing)
        f["img"] = rim(f["img"], "#d8f0ff", (0, -1), min_run=2)
        px0, py0 = _put(c, f, x, y, shadow=dict(toward_light=(0, 0.2), length=0.0, squash=0.3, col="#06101a", t=0.5))
        hx_, hy_ = f["hands"][0]
        cx_, cy_ = int(px0 + hx_), int(py0 + hy_)
        c.rect(cx_, cy_ - 1, cx_ + 2, cy_, "#c8e4ff")
        return f
    for k in range(8):
        person(56 + k * 17 + rp.randint(-2, 2), 82 + rp.randint(-1, 1), 27, "sit", -1 if k % 3 else 1, rp.choice(cols))
    for (x, sc) in [(72, 0.5), (140, 0.5)]:                               # Kroot among them, quilled silhouettes
        kk = spr("kroot", 1, silhouette=("#1c2a1e", "#3a4a38"))
        kk = kk.resize((int(kk.width * sc), int(kk.height * sc)), Image.NEAREST)
        kk = fade_bottom(kk, 5)
        place(c, kk, x, 80, anchor="bm")
    for k in range(4):
        person(70 + k * 31 + rp.randint(-3, 3), 99 + rp.randint(-1, 1), 38, "sit", -1 if k != 2 else 1, rp.choice(cols))
    # the player at the right, sitting, holding the card up to the light
    me = player_fig("tau", 54, "sit", facing=-1)
    me["img"] = tint(me["img"], "#0a121c", 0.18)
    me["img"] = rim(me["img"], "#ffffff", (0, -1), min_run=2)
    mx, my = _put(c, me, 168, 107, shadow=dict(toward_light=(0, 0.2), length=0.0, squash=0.3, col="#06101a", t=0.5))
    hx_, hy_ = me["hands"][0]
    cx_, cy_ = int(mx + hx_), int(my + hy_)
    c.rect(cx_ - 4, cy_ - 10, cx_ + 3, cy_ - 1, "#c8e4ff")
    c.rect(cx_ - 4, cy_ - 10, cx_ + 3, cy_ - 10, "#ffffff")
    c.rect(cx_ + 2, cy_ - 10, cx_ + 3, cy_ - 1, "#8ab0d0")
    for yy in (cy_ - 8, cy_ - 6, cy_ - 4):
        c.rect(cx_ - 3, yy, cx_ + 1, yy, "#6a94b8")
    glow(c, cx_, cy_ - 5, 10, ["#2c4458", "#78b8d8", "#c8e4ff"], power=1.6, strength=0.6)
    e.protect += ["#c8e4ff", "#b8d8f8", "#ffffff"]
    particles(c, "ash", 16, (0, 14, 191, 100), seed=e.seed_for("dust"), cols=("#8ab0c8", "#b8d8f0"))
    _dim(c, 0.16, "#04080e")


# ================================================================== DEATH

@ending("tau_death_hp")
def tau_death_hp(e):
    """DEATH.  Acceptable Losses: dusk on the desert flats outside the outpost.  Rows of identical little stakes, each
    with one dim teal cap, run away to the horizon (the column of the report); at the front left one of them is
    different: three stones and a folded tan coat with a pale band.  A Kroot sits beside it, back to the last light,
    quills against the sky, facing it.  Far right at the horizon the outpost dome and a tiny teal panel with one pale
    figure.  Dark, heavy vignette.  Bright mass: the sunset slit low at the right."""
    c = e.c
    HZ = 70
    sky(c, ["#040308", "#0a060e", "#140c16", "#24121a", "#3a1a1e"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#0a060c", "#1c1020", "#3a1c28"], 8, 56, scale=0.05, thresh=0.52, stretch=5.0)
    SX, SY = 168, 69
    glow(c, SX, SY, 84, ["#24121a", "#4a2024", "#8a4228", "#c8703a", "#ffb060", "#fff0c0"], power=1.5, strength=1.0, ry=34)
    c.rect(SX - 8, SY - 1, SX + 8, SY, "#fff0c0")
    # the outpost on the horizon: a dome, a pole, a teal panel and one pale figure beside it
    c.ellipse(138, HZ + 1, 12, 7, "#1c0e14")
    c.rect(124, HZ, 150, HZ + 2, "#1c0e14")
    c.rect(130, HZ - 2, 143, HZ - 2, "#46d8c8")
    c.line([(156, HZ), (156, HZ - 16)], "#1c0e14")
    c.set(156, HZ - 17, "#46d8c8")
    c.rect(106, HZ - 3, 110, HZ, "#0e2a30")                         # the holo-panel
    c.rect(106, HZ - 3, 110, HZ - 3, "#46d8c8")
    c.rect(113, HZ - 7, 113, HZ, "#c8d8e0")                          # one figure, pale, upright
    c.set(113, HZ - 8, "#c8d8e0")
    e.protect += ["#46d8c8"]
    # flats: dark ochre ground, a low dune crest nearer us hiding the Kroot's lower body
    hband(c, HZ + 1, 107, ["#7a4a34", "#4a2a28", "#2a161c", "#0e060a"], seed=e.seed_for("gr"), rough=0.25)
    light_pool(c, 160, HZ + 5, 70, 5, "#ffb060", t=0.5)
    # rows of identical stakes, in perspective, each with one dim teal cap
    for (y, hh, step, x0) in [(76, 3, 7, 3), (81, 4, 10, 8), (88, 6, 14, 2), (97, 9, 21, 10)]:
        x = x0
        while x < 188:
            if not (y == 97 and 28 <= x <= 52):                      # clear around the cairn
                c.rect(x, y - hh, x, y, "#12080c")
                c.set(x, y - hh, "#2a7a78" if y < 90 else "#46d8c8")
                c.set(x + 1, y - hh + 1, "#9a5a3a") if y > 85 else None
            x += step
    # the one that is different: three stones, a folded coat with a pale band, rim-lit from the right
    CX, CB = 54, 100
    for (dx, dy, rx, ry, col) in [(-6, 0, 8, 4, "#3a2630"), (7, 1, 7, 4, "#442e36"), (0, -5, 6, 4, "#4e363e")]:
        c.ellipse(CX + dx, CB + dy, rx, ry, col)
        c.rect(CX + dx + rx - 2, CB + dy - 2, CX + dx + rx - 1, CB + dy, "#b06a40")
    c.poly([(CX - 9, CB - 8), (CX + 10, CB - 10), (CX + 11, CB - 3), (CX - 8, CB - 1)], "#8a7650")       # the coat
    c.rect(CX - 9, CB - 8, CX + 10, CB - 9, "#d8bc88")
    c.rect(CX - 6, CB - 6, CX + 9, CB - 4, "#dcdce4")                                                     # the pale band
    c.rect(CX + 10, CB - 10, CX + 11, CB - 3, "#b08a5a")
    e.protect += ["#dcdce4", "#d8bc88"]
    light_pool(c, CX + 6, CB - 4, 22, 9, "#ffb060", t=0.38)
    # the Kroot: a dark seated silhouette facing the cairn; beak and swept quills against the afterglow
    kf = fig(40, "sit", "#0c0508", facing=-1)
    kimg = kf["img"].copy()
    kd = ImageDraw.Draw(kimg)
    khx, khy = kf["head"]
    dk = (12, 5, 8, 255)
    kd.rectangle([khx - 9, khy - 1, khx - 2, khy], fill=dk)                     # long beak toward the cairn
    for (dx_, dy_) in [(13, -2), (14, -5), (13, -8), (11, -11), (8, -13), (4, -14)]:   # quills fanned back and up
        kd.line([(khx + 1, khy - 2), (khx + dx_, khy + dy_)], fill=dk, width=1)
    kd.line([(khx - 6, khy + 12), (khx - 20, khy + 18)], fill=dk, width=1)       # a long gun across his knees
    kf["img"] = rim(kimg, "#ff9a58", (1, -0.4), min_run=2)
    _put(c, kf, 104, 104, shadow=dict(toward_light=(1, 0.4), length=1.4, squash=0.3, col="#060306", t=0.6))
    # a low crest in front of him
    for x in range(70, 160):
        top = int(105 + 2 * math.sin(x * 0.07) - (x - 70) * 0.03)
        for y in range(top, 108):
            c.set(x, y, "#0a0408")
        c.set(x, top, "#6a3a2e") if x % 2 == 0 else None
    particles(c, "ash", 20, (0, 20, 191, 100), seed=e.seed_for("ash"), cols=("#6a4a40", "#8a6a58", "#3a2a30"))
    vignette_kind(c, "death", col="#020104", strength=0.9)


@ending("tau_death_corruption")
def tau_death_corruption(e):
    """DEATH.  A God Who Listens: a night plain beside the outpost.  A T'au sensor drone hangs at the upper left and throws a
    wide teal scan cone onto the ground; in the cone's pale ellipse the player stands quite ordinary, head a little
    tilted as if listening.  The shadow he casts to the right is wrong: twice too long, with six arms and a pair of
    branching horns, a shape that is not his.  The drone's lens has gone amber.  Dark, heavy vignette.
    Bright mass: the cone at upper left and the lit ellipse on the ground at the left of centre."""
    c = e.c
    HZ = 64
    sky(c, ["#020308", "#040a14", "#08162a", "#0e2a3c"], 0, HZ)
    stars(c, e.seed_for("st"), 50, 0, 50, cols=("#3a5a78", "#8ab0c8", "#e8f4ff"))
    # far outpost silhouettes, low
    skyline(c, e.seed_for("sk"), HZ + 1, "#06101a", 9, 4, 14, 3, 8, x0=60, x1=191, win_p=0.12, wincol=("#2a7a78", "#46d8c8"), tips=0.1)
    c.line([(176, HZ), (176, HZ - 20)], "#06101a")
    c.set(176, HZ - 21, "#46d8c8")
    # the plain
    hband(c, HZ + 1, 107, ["#0e2a36", "#0a1c28", "#06101a", "#020608"], seed=e.seed_for("gr"), rough=0.2)
    # the scan cone: from the drone down to the lit ellipse
    DX, DY = 34, 14
    EX, EY, ERX, ERY = 72, 92, 30, 9
    for y in range(DY, EY + ERY + 1):
        t = (y - DY) / float(EY - DY)
        cx_ = DX + (EX - DX) * t
        half = 2 + (ERX * 0.95) * t
        for x in range(int(cx_ - half), int(cx_ + half) + 1):
            if 0 <= x < 192 and 0 <= y < 108:
                edge = 1.0 - abs(x - cx_) / half
                blend(c, x, y, "#46d8c8", (0.10 + 0.22 * t) * (0.5 + 0.5 * edge), 3)
    WRX, WRY, WCX = 88, 14, 104                                       # a wide, dim scatter of the same light on the flats
    for y in range(EY - WRY, EY + WRY + 1):
        for x in range(WCX - WRX, WCX + WRX + 1):
            d = ((x - WCX) / float(WRX)) ** 2 + ((y - EY) / float(WRY)) ** 2
            if d < 1:
                blend(c, x, y, "#46d8c8", 0.30 * (1 - d) ** 0.7, 3)
    for y in range(EY - ERY, EY + ERY + 1):                           # the bright pool under the cone
        for x in range(EX - ERX, EX + ERX + 1):
            d = ((x - EX) / float(ERX)) ** 2 + ((y - EY) / float(ERY)) ** 2
            if d < 1:
                blend(c, x, y, "#9af6ff", 0.42 * (1 - d) ** 0.6 + 0.12, 3)
    for k in range(0, 20, 4):                                          # scan rings across the pool
        for a_ in range(0, 360, 12):
            ca = math.radians(a_)
            rr_ = ERX * (0.3 + 0.03 * k)
            blend(c, int(EX + math.cos(ca) * rr_), int(EY + math.sin(ca) * rr_ * ERY / ERX), "#e8ffff", 0.55, 2)
    # the wrong shadow first (so he stands on it): 6 arms and horns, twice his length, falling to the right
    FX, FY = 72, 94
    vx, vy = 0.95, 0.12
    Ls = 78
    HX, HY = FX + Ls * vx, FY + Ls * vy
    sh = Image.new("L", (192, 108), 0)
    sd = ImageDraw.Draw(sh)
    sd.polygon([(FX, FY - 3), (FX + Ls * 0.62 * vx, FY + Ls * 0.62 * vy - 5), (HX - 6, HY - 3), (HX - 6, HY + 3), (FX + Ls * 0.62 * vx, FY + Ls * 0.62 * vy + 5), (FX, FY + 3)], fill=255)
    sd.ellipse([HX - 7, HY - 4, HX + 3, HY + 4], fill=255)
    for k, f_ in enumerate([0.50, 0.58, 0.66]):                       # three pairs of arms, long, bent
        bx, by = FX + Ls * f_ * vx, FY + Ls * f_ * vy
        for sgn in (-1, 1):
            sd.line([(bx, by + sgn * 3), (bx + 8 + k * 2, by + sgn * (14 + k * 3)), (bx + 18 + k * 3, by + sgn * (19 + k * 3))], fill=255, width=1)
    for sgn in (-1, 1):                                               # branching horns
        sd.line([(HX, HY + sgn * 3), (HX + 8, HY + sgn * 10), (HX + 16, HY + sgn * 12)], fill=255, width=1)
        sd.line([(HX + 8, HY + sgn * 10), (HX + 12, HY + sgn * 18)], fill=255, width=1)
        sd.line([(HX + 12, HY + sgn * 11), (HX + 20, HY + sgn * 17)], fill=255, width=1)
    for y in range(108):
        for x in range(192):
            if sh.getpixel((x, y)):
                blend(c, x, y, "#02060a", 0.92, 4)
    # a wrongness at the edges of the shadow: a thin violet rim where the lit ground meets it
    for y in range(1, 107):
        for x in range(1, 191):
            if sh.getpixel((x, y)) == 0 and (sh.getpixel((x - 1, y)) or sh.getpixel((x, y - 1))) and c.get(x, y)[1] > 40:
                c.set(x, y, "#7a2aa8" if (x + y) % 2 == 0 else "#a850d8")
    e.protect += ["#a850d8", "#7a2aa8"]
    # the player, ordinary, head tilted, his own small shadow gone
    me = player_fig("tau", 44, "stand", facing=1)
    me["img"] = tint(me["img"], "#08141c", 0.74)
    me["img"] = rim(me["img"], "#e8ffff", (-1, -1), min_run=2)
    mx, my = _put(c, me, FX, FY)
    # the drone: big, near, its lens gone amber
    _drone(c, DX, DY, 3, lens="#ffa030", glow_t=0.0, body="#8a8a90", under=False)
    glow(c, DX, DY + 5, 10, ["#4a2808", "#e8902c", "#ffe098"], power=1.3, strength=0.8)
    e.protect += ["#ffa030", "#ffe098"]
    particles(c, "mote", 18, (0, 6, 150, 100), seed=e.seed_for("mote"), cols=("#46d8c8", "#9af6ff"))
    vignette_kind(c, "death", col="#020406", strength=0.92)


def _eye(c, x, y, w, col="#e0d8f8", iris="#6a5ad0", dk="#0c0818"):
    """an almond eye: lid line above and below, round iris, dark pupil; w = half width."""
    for dx in range(-w, w + 1):
        k = int(round((w * 0.55) * (1 - (dx / float(w)) ** 2)))
        for dy in range(-k, k + 1):
            c.set(x + dx, y + dy, col)
        c.set(x + dx, y - k - 1, dk)
        c.set(x + dx, y + k + 1, dk)
    r = max(1, int(w * 0.42))
    c.ellipse(x, y, r, r, iris)
    if r >= 2:
        c.ellipse(x, y, max(1, r // 2), max(1, r // 2), dk)
    else:
        c.set(x, y, dk)


def _arch(c, x, y, w, h, col="#d8d0f0", dk="#0c0818"):
    """a tiny arched door, frame light, inside dark (x, y = bottom centre)."""
    for yy in range(y - h, y + 1):
        for xx in range(x - w, x + w + 1):
            if yy < y - h + w:
                inside = ((xx - x) ** 2 + (yy - (y - h + w)) ** 2) <= (w + 0.4) ** 2
            else:
                inside = True
            if inside:
                c.set(xx, yy, col)
    for yy in range(y - h + 2, y + 1):
        for xx in range(x - w + 2, x + w - 1):
            if yy < y - h + w:
                inside = ((xx - x) ** 2 + (yy - (y - h + w)) ** 2) <= (w - 1.2) ** 2
            else:
                inside = True
            if inside:
                c.set(xx, yy, dk)


@ending("tau_death_sanity")
def tau_death_sanity(e):
    """DEATH.  The Shadow: a barracks at night.  A round window at the upper left lets in a cold moon and a slanted band of
    pale light onto the floor; a low bunk at the lower right with someone lying under a blanket, eyes open (two pale
    pixels).  Out of the pillow, rising and widening toward the dark ceiling, pour pieces that are not his: tiny arched
    doors, almond eyes, wavering lines of an out-of-tune song, small notes; the higher, the larger.  Dark, heavy
    vignette.  Bright mass: window upper left and the stream of fragments rising at the right."""
    c = e.c
    sky(c, ["#04060c", "#080e18", "#101a2a", "#16243a"], 0, 84)
    for x in range(0, 192, 28):                                         # wall panel seams, faint
        c.rect(x, 0, x, 84, "#0a1220")
        c.rect(x + 1, 0, x + 1, 84, "#1c2c44")
    c.rect(0, 84, 191, 107, "#050810")
    hband(c, 84, 107, ["#16243a", "#0c1626", "#060a14", "#020408"], seed=e.seed_for("fl"), rough=0.1)
    c.rect(0, 83, 191, 83, "#2a3c58")
    # the porthole: ring, night, a cold moon
    WX, WY, WR = 34, 28, 17
    c.ellipse(WX, WY, WR + 3, WR + 3, "#586a84")
    c.ellipse(WX, WY, WR + 1, WR + 1, "#2a3a50")
    c.ellipse(WX, WY, WR, WR, "#050a16")
    for y in range(WY - WR, WY + WR + 1):
        for x in range(WX - WR, WX + WR + 1):
            if (x - WX) ** 2 + (y - WY) ** 2 <= WR * WR:
                t = (y - (WY - WR)) / (2.0 * WR)
                c.set(x, y, ramp_pick(["#040814", "#0a1a3a", "#1c3a6a"], t, x, y))
    stars(c, e.seed_for("ws"), 160, WY - WR + 2, WY + WR - 2, cols=("#8ab0d8", "#e8f4ff"), mask=lambda x, y: (x - WX) ** 2 + (y - WY) ** 2 < (WR - 2) ** 2)
    planet(c, WX + 4, WY - 4, 7, ["#3a4a68", "#7a8aa8", "#c8d4e8", "#f4f8ff"], light=(-0.6, -0.5), seed=3)
    c.rect(WX - WR, WY, WX + WR, WY, "#2a3a50")
    c.rect(WX, WY - WR, WX, WY + WR, "#2a3a50")
    # the light it throws: a slanted pale band across the wall and floor toward the bed
    shafts(c, (WX + 8, WY + 6), 38, 30, 4, 110, "#b8d0f0", t=0.2, seed=e.seed_for("sh"), w0=8, w1=22, power=0.6)
    light_pool(c, 70, 95, 36, 5, "#b8d0f0", t=0.4)
    # the bunk: a low frame at the lower right, mattress, pillow
    BX0, BX1, BY = 58, 166, 80
    c.rect(BX0, BY, BX1, BY + 4, "#202c40")
    c.rect(BX0, BY, BX1, BY, "#6a7a98")
    c.rect(BX0 + 3, BY + 5, BX0 + 5, 98, "#18222e")
    c.rect(BX1 - 5, BY + 5, BX1 - 3, 98, "#18222e")
    c.rect(BX0 + 3, BY + 5, BX0 + 3, 98, "#4a5a78")
    c.rect(BX1 - 5, BY + 5, BX1 - 5, 98, "#4a5a78")
    c.rect(BX0, BY + 6, BX1, BY + 7, "#101828")
    # the sleeper: a long low mound under a blanket, feet at the left, head on a pillow at the right, face up
    c.rect(BX0, BY - 1, BX1, BY + 2, "#34445e")
    blanket = [(BX0 + 4, BY - 1), (BX0 + 6, BY - 5), (BX0 + 14, BY - 8), (BX0 + 40, BY - 9), (BX0 + 62, BY - 11), (BX0 + 76, BY - 12),
               (BX0 + 82, BY - 9), (BX0 + 84, BY - 1)]
    c.poly(blanket, "#1c2c48")
    c.line(blanket[:-1], "#7a94c0")
    c.rect(BX0 + 24, BY - 6, BX0 + 70, BY - 2, "#14223a")                 # a fold in the blanket
    hx_, hy_ = BX0 + 94, BY - 9
    c.ellipse(hx_, BY - 3, 13, 4, "#6a7ea4")                                # pillow
    c.rect(hx_ - 12, BY - 6, hx_ + 12, BY - 6, "#9ab0d8")
    c.ellipse(hx_, hy_, 7, 6, "#080e1c")                                    # the head
    c.line([(hx_ - 6, hy_ - 2), (hx_ - 3, hy_ - 5), (hx_ + 3, hy_ - 6)], "#9ab4e0")
    c.set(hx_ - 1, hy_ - 2, "#e8f4ff")                                     # two pale pixels: eyes open
    c.set(hx_ + 3, hy_ - 2, "#e8f4ff")
    e.protect += ["#e8f4ff"]
    # the stream of pieces that are not his, rising from the pillow and widening toward the ceiling
    rf = e.rng("frag")
    pale = ["#e0d8f8", "#c8bce8", "#a898d8"]
    for k in range(40):
        t = k / 39.0
        px_ = hx_ - 2 - 62 * t ** 1.15 + math.sin(t * 9) * (4 + 18 * t) + rf.randint(-3, 3)
        py_ = hy_ - 8 - 80 * t ** 0.85 + rf.randint(-2, 2)
        size = 2.0 + 7.0 * t
        kind = (k + k // 5) % 4
        col = pale[k % 3] if t > 0.15 else "#c8bce8"
        if kind == 0:
            _arch(c, int(px_), int(py_), max(1, int(size * 0.7)), max(3, int(size * 1.7)), col=col)
        elif kind == 1:
            _eye(c, int(px_), int(py_), max(2, int(size * 1.1)), col="#e0d8f8", iris="#7a5ae0")
        elif kind == 2:
            for dx in range(-int(size * 1.6), int(size * 1.6) + 1):             # an out-of-tune wavering line
                c.set(px_ + dx, py_ + math.sin(dx * 0.9 + k) * (1 + size * 0.3), col)
                c.set(px_ + dx, py_ + 3 + math.sin(dx * 0.9 + k + 2) * (1 + size * 0.3), "#6a5a98")
        else:
            r_ = max(1, int(size * 0.5))
            c.ellipse(int(px_), int(py_), r_, max(1, r_ - 0), col)
            c.line([(px_ + r_, py_), (px_ + r_, py_ - int(size * 2) - 2)], col)
            c.line([(px_ + r_, py_ - int(size * 2) - 2), (px_ + r_ + 3, py_ - int(size * 2))], col)
    light_pool(c, hx_ - 14, hy_ - 30, 26, 34, "#6a5ab0", t=0.22)
    particles(c, "mote", 22, (40, 4, 190, 90), seed=e.seed_for("mote"), cols=("#a898d8", "#e0d8f8"))
    vignette_kind(c, "death", col="#020306", strength=0.9)
