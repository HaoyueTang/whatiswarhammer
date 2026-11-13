"""SPEC §31 ending illustrations — Chaos route (cha_*).  See endkit.py for the helper conventions.

Private helpers (leading underscore): _flagship, _skull, _skull_heap, _nurgling, _flower, _mirror_panel, _bez,
_daemon_prince, _mushroom, _lying, _rubble, _knight, _flames, _inq, _candle, _drape, _ghost, _sitter, _pictogram, _blob2,
_dither_rect.  Gods use GOD[...]["ramp"] so the colour language matches the other routes."""
import math
import random
from PIL import Image, ImageDraw, ImageFilter
from reg import ending
from endkit import *


# ---------------------------------------------------------------------------------------------- shared helpers

def _skull(c, x, y, s, base="#d8d0b8", dark="#1a1410", lit=None):
    """tiny skull, s = width (3..9) centred at x, top at y.  eye holes dark, jaw a row narrower, lit side right."""
    h = max(3, int(s * 0.9))
    for j in range(h):
        half = s / 2.0 * (math.sqrt(max(0.0, 1 - ((h * 0.5 - j) / (h * 0.62)) ** 2)) if j < h * 0.7 else 0.62)
        for i in range(-int(half), int(half) + 1):
            c.set(x + i, y + j, base)
    if s >= 5:
        ey = y + max(1, int(h * 0.38))
        c.set(x - s // 4 - 0, ey, dark)
        c.set(x + s // 4 + 0, ey, dark)
        if s >= 7:
            c.set(x - s // 4, ey + 1, dark)
            c.set(x + s // 4, ey + 1, dark)
        c.set(x, y + h - 1, dark)
    if lit:
        for j in range(1, h - 1):
            c.set(x + int(s / 2.0 * 0.8), y + j, lit)


def _flagship(c, x, y, L, face=1, hull="#0a0816", lite="#6a78b8", win="#ffcf6a", seed=1):
    """big angular black flagship silhouette (cathedral-prow) pointing right (face=1); windows in rows; engine glow aft."""
    rnd = random.Random(seed)
    hgt = int(L * 0.26)
    # main hull: long wedge with a stepped prow
    pts = [(0, hgt * 0.35), (L * 0.18, hgt * 0.2), (L * 0.62, hgt * 0.15), (L * 0.84, hgt * 0.42), (L, hgt * 0.62),
           (L * 0.82, hgt * 0.86), (L * 0.55, hgt), (L * 0.15, hgt * 0.92), (0, hgt * 0.8)]
    c.poly([(x + px * face, y + py) for px, py in pts], hull)
    # dorsal spires (a cathedral on its back)
    for i, (fx, hh, ww) in enumerate([(0.10, 0.34, 3), (0.22, 0.5, 4), (0.34, 0.28, 3), (0.46, 0.4, 3), (0.58, 0.22, 3)]):
        bx = x + face * int(L * fx)
        c.poly([(bx, y + hgt * 0.22), (bx + face * ww, y + hgt * 0.22), (bx + face * ww * 0.5, y - hgt * hh)], hull)
    # a thin lit edge along the top of the hull and spires
    for i in range(int(L * 0.62)):
        c.set(x + face * (i + int(L * 0.18)), y + int(hgt * 0.17), lite)
    # window rows
    for row in range(3):
        yy = y + int(hgt * (0.45 + 0.14 * row))
        for i in range(int(L * 0.08), int(L * 0.8), 3):
            if rnd.random() < 0.5:
                c.set(x + face * i, yy, win)
    # engine blocks aft, dim red glow
    for k in range(3):
        c.rect(x - face * 2 + (0 if face > 0 else -1), y + int(hgt * (0.38 + 0.15 * k)), x + (0 if face > 0 else -1), y + int(hgt * (0.38 + 0.15 * k)) + 1, "#ff6a3a")
    return hgt


def _dither_rect(c, x0, y0, x1, y1, col, t, levels=3):
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            blend(c, x, y, col, t, levels)


# ---------------------------------------------------------------------------------------------- GOOD


@ending("cha_end_champion")
def cha_end_champion(e):
    """GOOD.  The Last Lander: the player in the open rear ramp of the last departing lander, an axe dragged behind;
    outside the dying world has become a white star; far ahead the black fleet's flagship waits, its windows lit.
    Bright cool nova upper left, a dark bay frame, the player black against the glare."""
    c = e.c
    # --- void behind everything: deep violet-blue to a bright cold glare around the nova
    sky(c, ["#0a0620", "#1a1250", "#2c2a8a", "#4a5ac0", "#8ab0f0", "#d8ecff"], 0, 98)
    NX, NY = 52, 36
    glow(c, NX, NY, 110, ["#1a1250", "#2c2a8a", "#4a5ac0", "#7a96e0", "#b0ccff", "#e8f4ff", "#ffffff"], power=1.15, strength=1.0, ry=84)
    clouds(c, e.seed_for("neb"), ["#2c2a8a", "#4a3ab0", "#7a5ad0"], 0, 70, scale=0.04, thresh=0.52, stretch=3.0)
    stars(c, e.seed_for("st"), 90, 0, 96, mask=lambda x, y: ((x - NX) ** 2 + ((y - NY) * 1.3) ** 2) > 46 ** 2)
    c.ellipse(NX, NY, 8, 8, "#ffffff")
    shafts(c, (NX, NY), 20, 120, 10, 190, "#ffffff", t=0.26, seed=e.seed_for("sh"), w0=2, w1=11, power=0.6)
    for (ang, ln) in [(0, 26), (90, 16), (180, 26), (270, 16)]:               # cross flare
        a = math.radians(ang)
        c.line([(NX, NY), (NX + math.cos(a) * ln, NY + math.sin(a) * ln)], "#ffffff")
    # --- the flagship, right, far: black with a lit spine and rows of amber windows
    glow(c, 150, 56, 70, ["#2c2a8a", "#4a5ac0", "#7a96e0", "#a8c4f8"], power=1.2, strength=0.9, ry=22)
    _flagship(c, 100, 46, 92, hull="#05040e", lite="#cfe0ff", seed=e.seed)
    # the prow tower: one lit bridge window with a tiny figure turned toward the lander (the single glance)
    c.rect(161, 28, 168, 51, "#05040e")
    c.poly([(161, 28), (168, 28), (164.5, 22)], "#05040e")
    c.rect(163, 33, 166, 36, "#ffcf6a")
    c.rect(164, 34, 165, 36, "#2a1a10")
    c.set(164, 33, "#fff0b0")
    haze(c, 56, 74, "#6a7ad0", t=0.25, seed=e.seed_for("hz"), profile="bottom", x0=70)
    # the planet that was Aldrin: a thin broken ring of light around the nova
    for a in range(0, 360, 4):
        r = 14 + (a % 3)
        c.set(NX + math.cos(math.radians(a)) * r, NY + math.sin(math.radians(a)) * r * 0.9, "#e8f4ff")
    # --- bay frame: black walls with ribs; the floor is the ramp, lit cold from the glare
    c.poly([(0, 0), (18, 0), (30, 108), (0, 108)], "#06050e")                 # left bulkhead
    c.poly([(192, 0), (184, 0), (181, 44), (192, 44)], "#06050e")             # right edge
    c.rect(0, 0, 191, 7, "#06050e")                                            # roof
    for k in range(8):
        c.line([(2 + k * 4, 8), (20 + k * 0.6, 106)], "#0e0c1c")
    c.line([(18, 7), (30, 108)], "#2a3470")
    c.rect(0, 7, 191, 7, "#202858")
    for x in range(0, 192, 8):                                                 # roof hazard stripes, dim
        c.rect(x, 4, x + 3, 5, "#4a3a1a")
    # ramp: perspective floor, slanted down-right
    for y in range(74, 108):
        for x in range(0, 192):
            t = (y - 74) / 34.0
            edge = 30 + (y - 74) * 0.5
            if x < edge:
                continue
            base = ramp_pick(["#6a7ab8", "#3a4678", "#1c2248", "#0c0e24"], 0.1 + t * 0.85 + (x - NX) * 0.0016, x, y)
            c.set(x, y, base)
    for k in range(-4, 16):                                                    # plate seams
        c.line([(NX + k * 14, 74), (NX + k * 44 - 60, 107)], "#12163a")
    for y in (80, 88, 98):
        c.rect(30 + (y - 74) // 2, y, 191, y, "#12163a")
    c.rect(0, 73, 191, 73, "#cfe0ff")
    light_pool(c, 70, 80, 60, 8, "#e8f4ff", t=0.55)
    # --- the champion: back three-quarter, axe over the shoulder dragging a long haft behind
    me = player_fig("chaos", 50, "walk", facing=1, lean=10)
    me["img"] = tint(me["img"], "#0a0818", 0.82)
    mx, my = 84, 100
    px0, py0 = put_figure(c, me, mx, my, rim_col="#cfe0ff", toward=(-1, -1),
                          shadow=dict(toward_light=(-0.8, -0.2), length=0.9, squash=0.35, col="#05040c", t=0.8))
    hx_, hy_ = px0 + int(me["hands"][0][0]), py0 + int(me["hands"][0][1])
    # the axe: haft dragging behind to the left, bit of the head catching the nova
    c.line([(hx_, hy_), (hx_ - 26, hy_ + 18)], "#0a0912", 2)
    c.line([(hx_ - 1, hy_ - 1), (hx_ - 26, hy_ + 17)], "#5a6aa8")
    hd = (hx_ - 26, hy_ + 18)
    c.poly([(hd[0] - 2, hd[1] - 7), (hd[0] + 3, hd[1] - 1), (hd[0] - 2, hd[1] + 6), (hd[0] - 7, hd[1] - 1)], "#0a0912")
    c.line([(hd[0] - 2, hd[1] - 7), (hd[0] - 7, hd[1] - 1), (hd[0] - 2, hd[1] + 6)], "#e8f4ff")
    # a brass pauldron glint on the shoulder
    shx, shy = px0 + int(me["head"][0]) - 2, py0 + int(me["head"][1]) + 9
    c.rect(shx - 1, shy, shx + 2, shy + 2, "#ffcf6a")
    e.protect += ["#ffcf6a", "#e8f4ff"]
    particles(c, "mote", 26, (20, 10, 190, 100), seed=e.seed_for("mt"), cols=("#cfe0ff", "#ffffff"))
    vignette_kind(c, "good", col="#04030c", strength=0.35)


def _skull_heap(c, x0, x1, base, peak, seed, col="#1a0608", lit="#ffb050", bone="#9a8068", dens=1.0, cx=None, sk=(3, 5)):
    """mound of skulls: dark body from base up to `peak` (a bump centred on cx), skulls pressed onto it in rows."""
    rnd = random.Random(seed)
    cx = (x0 + x1) // 2 if cx is None else cx
    n = Noise(seed)
    tops = {}
    for x in range(x0, x1 + 1):
        u = (x - cx) / max(1.0, (x1 - x0) / 2.0)
        k = max(0.0, 1 - u * u) ** 0.8
        top = int(base - peak * k + (n.fbm(x * 0.11, 2.2, 3) - 0.5) * peak * 0.22 * (0.3 + k))
        tops[x] = top
        for y in range(top, base + 1):
            c.set(x, y, col)
    rowh = max(3, sk[0] - 1)
    for y in range(min(tops.values()), base, rowh):
        for x in range(x0, x1 + 1, sk[1] - 1):
            xx, yy = x + rnd.randint(-1, 1) + (y // rowh % 2) * (sk[1] // 2), y + rnd.randint(0, 1)
            if xx in tops and tops[xx] <= yy - 1 and rnd.random() < dens:
                s = rnd.randint(*sk)
                _skull(c, xx, yy, s, base=rnd.choice([bone, "#7a6652", "#6a5a4a"]), dark=col, lit=lit if rnd.random() < 0.7 else None)
    return tops


@ending("cha_end_claim_khorne_chosen")
def cha_end_claim_khorne_chosen(e):
    """GOOD / Khorne.  The Road of a Thousand Worlds: a brass-armoured champion roaring on a hill of skulls, axe held
    overhead in both hands; behind and above him a chain of burning worlds shrinks toward a low gold-red sun.
    Brass rim light from the left, warm sky mass at the top, dark foreground low right."""
    c = e.c
    R = GOD["khorne"]["ramp"]
    HZ = 74
    sky(c, ["#3a0a10", "#721410", "#b8321a", "#e8702a", "#ffa84a", "#ffdc88"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#521010", "#7a1a12", "#a02a16"], 0, 44, scale=0.05, thresh=0.52, stretch=4.5)
    SX, SY = 30, 66
    glow(c, SX, SY, 74, ["#721410", "#b8321a", "#e8702a", "#ffa84a", "#ffdc88", "#fff4cc"], power=1.25, strength=1.0, ry=44)
    c.ellipse(SX, SY, 8, 7, "#fff4cc")
    shafts(c, (SX, SY), 330, 80, 7, 110, "#ffdc88", t=0.2, seed=e.seed_for("sh"), w0=3, w1=11, power=0.7)
    # the chain of worlds: big near ones high right, shrinking toward the sun
    glow(c, 140, 34, 54, ["#b8321a", "#e8702a", "#ffa84a", "#ffdc88"], power=1.2, strength=0.8, ry=34)
    for k, (x, y, r) in enumerate([(104, 19, 13), (78, 31, 9), (60, 41, 6), (46, 49, 4), (36, 55, 3)]):
        planet(c, x, y, r, ["#14060a", "#3a0c10", "#7a1a12", "#c0401a", "#f08a3a"], light=(-0.9, 0.35), seed=e.seed_for("pl%d" % k))
        c.line([(x - r * 0.4, y - r * 0.3), (x + r * 0.2, y + r * 0.5)], "#14060a")
        for a in range(200, 330, 5):
            c.set(x + math.cos(math.radians(a)) * (r + 1), y + math.sin(math.radians(a)) * (r + 1), "#ffdc88")
    # horizon: far plain, a thin dark line of the host charging toward the sun
    hband(c, HZ, 107, ["#8a2410", "#5a1410", "#34080c", "#1a0406"], seed=e.seed_for("gr"), rough=0.3)
    haze(c, HZ - 6, HZ + 8, "#ffa84a", t=0.55, seed=e.seed_for("hz"), profile="mid", x1=130)
    light_pool(c, SX, HZ + 3, 70, 5, "#ffdc88", t=0.5)
    rr = e.rng("host")
    for i in range(46):
        x = 70 + i * 2.6 + rr.randint(-1, 1)
        y = HZ + 2 + (i % 3) * 2
        hgt = 4 + (i % 4 == 0)
        c.rect(x, y - hgt, x, y, "#2a0608")
        c.set(x, y - hgt - 1, "#ffdc88") if i % 5 == 0 else None
    # the hill of skulls, lower right, and the champion on top
    tops = _skull_heap(c, 84, 191, 108, 40, e.seed_for("heap"), col="#1c0608", lit="#ffb050", bone="#8a6a54", cx=146, sk=(5, 8), dens=0.6)
    haze(c, 68, 108, "#8a1e12", t=0.30, seed=e.seed_for("hz2"), profile="top", x0=84)
    me = fig(42, "arms_up", "#1e0e08", facing=-1, thick=1.5)
    mx, my = 146, tops[146] + 5
    px0, py0 = put_figure(c, me, mx, my, rim_col="#ffc060", toward=(-1, -1))
    # horned helm, shoulder brass, a crest
    hx_, hy_ = px0 + int(me["head"][0]), py0 + int(me["head"][1])
    c.line([(hx_ - 2, hy_ - 3), (hx_ - 7, hy_ - 5), (hx_ - 9, hy_ - 10)], "#1e0e08", 2)
    c.line([(hx_ + 2, hy_ - 3), (hx_ + 7, hy_ - 5), (hx_ + 9, hy_ - 10)], "#1e0e08", 2)
    c.set(hx_ - 9, hy_ - 10, "#ffc060"); c.set(hx_ + 9, hy_ - 10, "#ffc060")
    c.set(hx_ - 2, hy_, "#ff8a2a"); c.set(hx_ - 3, hy_, "#ff8a2a")        # glowing eyes in the dark helm
    for (dx, dy) in [(-7, 5), (7, 5)]:                                              # brass pauldrons
        c.rect(hx_ + dx - 3, hy_ + dy, hx_ + dx + 2, hy_ + dy + 3, "#8a5a1a")
        c.rect(hx_ + dx - 3, hy_ + dy, hx_ + dx - 2, hy_ + dy + 3, "#ffc060")
        c.rect(hx_ + dx - 3, hy_ + dy, hx_ + dx + 2, hy_ + dy, "#ffdc88")
    # the axe held overhead: haft between both hands, a broad head above, names as notches down the cutting edge
    h0 = (px0 + int(me["hands"][0][0]), py0 + int(me["hands"][0][1]))
    h1 = (px0 + int(me["hands"][1][0]), py0 + int(me["hands"][1][1]))
    top = ((h0[0] + h1[0]) // 2 - 4, min(h0[1], h1[1]) - 12)
    c.line([(h0[0] + 6, h0[1] + 12), (top[0] - 2, top[1] - 2)], "#1e0e08", 2)
    c.poly([(top[0] - 17, top[1] - 8), (top[0] + 1, top[1] - 2), (top[0] + 1, top[1] + 6), (top[0] - 16, top[1] + 9), (top[0] - 10, top[1] + 1)], "#14060a")
    c.line([(top[0] - 17, top[1] - 8), (top[0] - 10, top[1] + 1), (top[0] - 16, top[1] + 9)], "#ffe8a0", 1)
    for k in range(-4, 7, 2):                                                       # names: tiny lit notches on the blade
        c.set(top[0] - 5 + (k // 2), top[1] + k, "#ff8a2a")
    glow(c, top[0] - 7, top[1] + 1, 7, ["#8a1e12", "#e8702a", "#ffdc88"], power=1.5, strength=0.55)
    e.protect += ["#ffdc88", "#ff8a2a"]
    # foreground: a few big skulls and a dropped banner pole
    _skull(c, 176, 98, 9, base="#8a7058", dark="#1c0608", lit="#ffb050")
    _skull(c, 98, 100, 7, base="#6a5a4a", dark="#1c0608", lit="#ffb050")
    particles(c, "ember", 60, (0, 0, 191, 100), seed=e.seed_for("emb"), cols=("#ff9a3a", "#ffd080", "#ffdc88"))
    vignette_kind(c, "good", col="#1a0406", strength=0.38)


def _nurgling(c, x, y, s, body="#a8b84a", dark="#222e12", lit="#e8ea98", flip=False, eye="#f0d050", horn=True):
    """a nurgling (feet at x,y): pot-bellied blob, big head, wide grin with a few teeth, one horn.  s = height px (6..14)."""
    sx = -1 if flip else 1
    bw, bh = max(3, int(s * 0.46)), max(3, int(s * 0.5))
    c.ellipse(x, y - bh, bw, bh - 0, dark)
    c.ellipse(x - sx * 0, y - bh, bw - 1, bh - 1, body)
    hr = max(2, int(s * 0.34))
    hy = y - int(s * 0.88)
    c.ellipse(x + sx, hy, hr + 1, hr, dark)
    c.ellipse(x + sx, hy, hr, hr - 1, body)
    c.set(x + sx - hr + 1, hy - 1, lit)
    c.rect(x + sx - 1, hy - 1, x + sx, hy - 1, eye)                      # eye(s)
    c.rect(x + sx - hr + 1, hy + 1, x + sx + hr - 2, hy + 1, dark)       # the grin
    if hr >= 3:
        for k in range(-hr + 2, hr - 1, 2):
            c.set(x + sx + k, hy + 1, "#f4f0c0")
    if horn:
        c.line([(x + sx + hr - 2, hy - hr + 1), (x + sx + hr, hy - hr - 2)], lit)
    c.rect(x - bw + 1, y, x - 1, y, dark)                                 # feet
    c.rect(x + 1, y, x + bw - 1, y, dark)


def _flower(c, x, y, r, petal, centre="#8a5a1a", stem=None, stem_len=0, stem_col="#3e5a1c"):
    """small bloom: ring of petals around a centre; optional stem going down."""
    if stem_len:
        c.line([(x, y + r), (x + 1, y + stem_len)], stem_col)
    for k in range(8):
        a = k * math.pi / 4
        c.set(x + math.cos(a) * r, y + math.sin(a) * r, petal)
        if r >= 3:
            c.set(x + math.cos(a) * (r - 1), y + math.sin(a) * (r - 1), petal)
    c.rect(x - 1, y - 1, x + (1 if r >= 2 else 0), y + (1 if r >= 2 else 0), centre)


@ending("cha_end_claim_nurgle_chosen")
def cha_end_claim_nurgle_chosen(e):
    """GOOD / Nurgle.  The Gardener: late golden-green afternoon in Grandfather's garden; the player, in a cream apron,
    kneels tending a great pink bloom; seven flowers grow out of his own rot; three grinning nurglings bring more.
    Sun upper right, long shadows to the left, beds converging toward a crooked gate."""
    c = e.c
    G = GOD["nurgle"]["ramp"]
    HZ = 58
    sky(c, ["#141c0a", "#26340f", "#44601a", "#6c8a2a", "#a0aa42"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#34481a", "#4a6a1c", "#6c8a2a"], 0, 40, scale=0.05, thresh=0.5, stretch=4.0)
    SX, SY = 150, 26
    glow(c, SX, SY, 46, ["#587a22", "#8aa23a", "#c0c458", "#e4e490", "#fffbd8"], power=1.3, strength=1.0, ry=34)
    c.ellipse(SX, SY, 7, 7, "#fffbd8")
    shafts(c, (SX, SY), 150, 70, 7, 110, "#f0eeb0", t=0.22, seed=e.seed_for("sh"), w0=3, w1=12, power=0.7)
    # far: fat trees heavy with fruit, a leaning wall with a crooked gate
    ridge(c, HZ + 1, 3, 8, "#5a7a24", seed=e.seed_for("rg"), lite="#a8b84a", fill_to=HZ + 4)
    rr = e.rng("trees")
    for (tx, tw, th) in [(10, 18, 22), (40, 14, 16), (118, 16, 18), (172, 20, 24), (146, 12, 14)]:
        c.rect(tx - 1, HZ - th // 2, tx + 1, HZ + 3, "#2a3a12")
        for k in range(5):
            ex, ey = tx + rr.randint(-tw // 3, tw // 3), HZ - th + rr.randint(0, th // 2)
            c.ellipse(ex, ey, tw // 3 + 2, tw // 4 + 2, "#3e5a1c")
        c.ellipse(tx - 2, HZ - th - 1, tw // 3, tw // 5, "#6c8a2a")
        c.ellipse(tx + 3, HZ - th + 2, tw // 4, tw // 6, "#a8b84a")
        for k in range(4):                                                   # fruit: sickly orange, drooping
            c.set(tx + rr.randint(-tw // 2, tw // 2), HZ - th // 2 + rr.randint(-4, 4), "#e8a040")
    GX = 84
    c.rect(GX - 14, HZ - 9, GX - 11, HZ + 3, "#4a5a30"); c.rect(GX + 11, HZ - 11, GX + 14, HZ + 3, "#4a5a30")
    c.line([(GX - 12, HZ - 9), (GX - 1, HZ - 14), (GX + 12, HZ - 11)], "#222e12", 2)       # a sagging arch
    for k in range(-9, 10, 3):
        c.line([(GX + k, HZ - 11 + abs(k) // 3), (GX + k - 1, HZ + 3)], "#14200a")
    c.line([(GX - 30, HZ - 4), (GX - 14, HZ - 5)], "#3a4a22", 2); c.line([(GX + 14, HZ - 5), (GX + 40, HZ - 3)], "#3a4a22", 2)
    haze(c, HZ - 10, HZ + 6, "#a8b84a", t=0.4, seed=e.seed_for("hz"), profile="mid")
    # ground: grass to soil; long beds converging on the gate
    hband(c, HZ + 4, 107, ["#587a22", "#44601a", "#2a3a12", "#1a240c", "#0e1406"], seed=e.seed_for("gr"), rough=0.3)
    for k in range(-7, 8):
        x_far, x_near = GX + k * 5, GX + k * 40
        c.line([(x_far, HZ + 4), (x_near, 107)], "#101808")
    rf = e.rng("flowers")
    petals = ["#f0a0b0", "#f6d070", "#f4f0e0", "#e88a8a"]
    for row in range(1, 14):
        y = HZ + 4 + int((row / 14.0) ** 1.6 * 44)
        sc = (y - HZ) / 48.0
        for k in range(-6, 7):
            if rf.random() < 0.28:
                x = GX + k * (5 + sc * 36) + rf.randint(-2, 2)
                r = 1 + int(sc * 2.2)
                if 0 <= x < 192:
                    _flower(c, int(x), y - 1, r, rf.choice(petals), centre="#7a5a1e")
    light_pool(c, SX - 10, 84, 70, 10, "#d8d880", t=0.30)
    # long shadows leftwards on the ground are drawn with the figures; now the great bloom
    BX, BY = 100, 76
    c.line([(BX, BY + 8), (BX + 1, 100)], "#2a4a14", 2)
    c.line([(BX + 1, 92), (BX + 8, 88)], "#2a4a14"); c.ellipse(BX + 9, 87, 3, 1, "#52701e")
    for k in range(14):                                                  # petals: two rings, pink to cream, lit on the right
        a = k * 2 * math.pi / 14
        for (rr_, col) in [(10, "#e88a9a"), (7, "#f6b0bc")]:
            px_, py_ = BX + math.cos(a) * rr_, BY + math.sin(a) * rr_ * 0.9
            c.ellipse(int(px_), int(py_), 3, 3, col if math.cos(a) < 0.3 else "#fff0d0")
    c.ellipse(BX, BY, 5, 5, "#e0b030")
    c.ellipse(BX + 1, BY - 1, 2, 2, "#fff0a0")
    glow(c, BX, BY, 18, ["#e88a9a", "#f6b0bc", "#fff0d0"], power=2.2, strength=0.45)
    e.protect += ["#e88a9a", "#f6b0bc", "#fff0d0", "#e0b030"]
    # the gardener, kneeling, facing the bloom; apron; seven flowers growing out of him
    me = player_fig("chaos", 62, "kneel", facing=1, lean=14)
    mx, my = 50, 104
    mimg = tint(me["img"], "#4a3c2a", 0.35)
    me["img"] = mimg
    px0, py0 = put_figure(c, me, mx, my, rim_col="#fff6c8", toward=(1, -1),
                          shadow=dict(toward_light=(1, 0.5), length=1.3, squash=0.3, col="#14200a", t=0.6))
    hx_, hy_ = px0 + int(me["head"][0]), py0 + int(me["head"][1])
    c.poly([(hx_ + 2, hy_ + 11), (hx_ + 7, hy_ + 11), (hx_ + 10, hy_ + 27), (hx_ + 1, hy_ + 27)], "#e8e0b0")               # the apron
    c.line([(hx_ + 2, hy_ + 11), (hx_ + 7, hy_ + 11)], "#fffbe0")
    c.line([(hx_ + 7, hy_ + 12), (hx_ + 10, hy_ + 27)], "#b8b078")
    c.rect(hx_ + 1, hy_ + 19, hx_ + 9, hy_ + 19, "#b8b078")
    c.line([(hx_ - 1, hy_ + 8), (hx_ + 4, hy_ + 11)], "#b8b078")
    gh = [(hx_ - 1, hy_ - 9, 3, "#f6d070"), (hx_ - 9, hy_ + 2, 3, "#f0a0b0"), (hx_ - 13, hy_ + 13, 3, "#f4f0e0"),
          (hx_ + 6, hy_ + 3, 2, "#e88a8a"), (hx_ - 6, hy_ + 22, 3, "#f6d070"), (hx_ - 15, hy_ + 24, 2, "#f0a0b0"),
          (hx_ + 4, hy_ - 12, 2, "#f4f0e0")]
    for (fx, fy, fr, fc) in gh:
        c.line([(fx, fy + fr), (fx + 2, fy + fr + 5)], "#52701e")
        _flower(c, fx, fy, fr, fc)
    # a trowel in his hand, and a small tin watering can
    hx2, hy2 = px0 + int(me["hands"][0][0]), py0 + int(me["hands"][0][1])
    c.rect(hx2, hy2, hx2 + 3, hy2 + 1, "#8a8a7a")
    c.rect(hx2 + 4, hy2 - 1, hx2 + 5, hy2 + 2, "#5a3a1a")
    c.rect(6, 94, 15, 102, "#8a8a78"); c.rect(6, 94, 15, 94, "#d0d0b8"); c.line([(15, 97), (22, 92)], "#8a8a78")
    # nurglings, three, grinning, bringing flowers
    for (nx, ny, ns, fl) in [(130, 90, 12, True), (150, 99, 12, True), (122, 104, 10, False)]:
        _nurgling(c, nx, ny, ns, flip=fl)
    c.line([(122, 83), (122, 88)], "#52701e"); _flower(c, 122, 81, 2, "#f0a0b0")      # one offers a flower to the gardener
    # flies: a lazy cloud, mostly over the bloom and the gardener
    rf = e.rng("flies")
    for _ in range(26):
        fx, fy = int(rf.gauss(78, 24)), int(rf.gauss(80, 12))
        if 2 <= fx < 190 and 10 < fy < 100:
            c.set(fx, fy, "#10160a")
    particles(c, "spore", 36, (0, 0, 191, 100), seed=e.seed_for("sp"), cols=("#f6f2c0", "#e8e890", "#ffffff"))
    vignette_kind(c, "good", col="#0c1206", strength=0.5)


def _mirror_panel(c, x0, y0, x1, y1, ramp, seed, arch=True, frame="#14081e", edge="#e8e8f8"):
    """tall arched mirror: vertical ramp + two diagonal silver glints + a thin bright frame."""
    n = Noise(seed)
    w = x1 - x0
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if arch:
                dx = (x - (x0 + x1) / 2.0) / (w / 2.0)
                if y < y0 + w / 2.0 and (dx * dx) * (w / 2.0) ** 2 + (y - (y0 + w / 2.0)) ** 2 > (w / 2.0) ** 2:
                    continue
            t = (y - y0) / float(max(1, y1 - y0))
            t = clamp(0.15 + t * 0.7 + (n.fbm(x * 0.08, y * 0.05, 2) - 0.5) * 0.3)
            d = ((x - x0) * 0.7 + (y - y0) * 0.5) % 24
            if d < 2.2:
                t = min(1.0, t + 0.28)
            elif 12 < d < 13.4:
                t = min(1.0, t + 0.18)
            c.set(x, y, ramp_pick(ramp, t, x, y))
    for y in range(y0, y1 + 1):
        for x in (x0 - 1, x1 + 1):
            c.set(x, y, frame)
        c.set(x0, y, edge) if y % 2 == 0 else None
    c.rect(x0 - 1, y1 + 1, x1 + 1, y1 + 2, frame)


@ending("cha_end_claim_slaanesh_chosen")
def cha_end_claim_slaanesh_chosen(e):
    """GOOD / Slaanesh.  The Perfect Host: a hall of tall mirrors; the player stands arms wide on a dais before the
    brightest mirror, a taller silver copy standing just behind; in the dark side mirrors the same copy repeats;
    a crowd of silhouettes applauds at the edges.  Light from the upper left, magenta + silver."""
    c = e.c
    FL = 78
    sky(c, ["#10061a", "#2a0c40", "#4a1670"], 0, FL)
    DARK = ["#10061a", "#240a38", "#4a1670", "#7a2a9a", "#b048c0", "#e070d8"]
    BRIGHT = ["#4a1670", "#9a3ab8", "#e070d8", "#ff9ae0", "#fbd8f6", "#ffffff"]
    panels = [(4, 30, DARK), (38, 30, DARK), (74, 40, BRIGHT), (120, 30, DARK), (156, 30, DARK)]
    for k, (x, w, ramp_) in enumerate(panels):
        _mirror_panel(c, x, 8, x + w, FL - 1, ramp_, e.seed_for("m%d" % k))
    # copies: silver, taller than the host should be, a different posture in every dark mirror
    poses = {0: "arms_up", 1: "stand", 3: "arms_up", 4: "reach"}
    for k, (x, w, ramp_) in enumerate(panels):
        if k == 2:
            continue
        f = fig(48, poses[k], "#b070cc", facing=1 if k % 2 else -1)
        img = rim(f["img"], "#f0d0f8", (-1, -1))
        place(c, img, x + w // 2, FL - 3, anchor="bm")
    mx0, mw = panels[2][0], panels[2][1]
    # the big mirror: the copy is taller and lighter, one step behind and to the right of the host
    DX = mx0 + mw // 2 - 3
    cp = fig(54, "arms_up", "#f0c8f4", facing=1, thick=1.0)
    place(c, rim(cp["img"], "#ffffff", (-1, -1)), DX + 7, FL - 1, anchor="bm")
    # chandeliers: strings of silver crystals from the top edge
    cr = e.rng("crys")
    for cx in (22, 112, 150, 186):
        ln = cr.randint(8, 16)
        c.line([(cx, 0), (cx, ln)], "#8a7ab0")
        for k in range(7):
            yy = ln + k * 2
            ww = max(0, 6 - abs(k - 3) * 2)
            for xx in range(cx - ww, cx + ww + 1):
                if (xx + yy) % 2 == 0:
                    c.set(xx, yy, "#f0f0fc")
        glow(c, cx, ln + 6, 10, ["#7a2a9a", "#c850c8", "#ff8ad8", "#f0f0fc"], power=1.5, strength=0.6)
    # floor: polished black violet, with a pool of light
    hband(c, FL, 107, ["#9a3ab8", "#4a1670", "#240a38", "#10061a"], seed=e.seed_for("fl"), rough=0.12)
    for x in range(-80, 280, 20):
        c.line([(DX + (x - DX) * 0.5, FL), (DX + (x - DX) * 2.0, 107)], "#2a0c40")
    light_pool(c, DX, FL + 10, 54, 9, "#ffb0f0", t=0.6)
    light_pool(c, DX, FL + 8, 30, 6, "#ffffff", t=0.55)
    for k in range(3):                                                    # three dais steps
        c.rect(DX - 20 - k * 6, FL + 10 + k * 3, DX + 20 + k * 6, FL + 12 + k * 3, ["#e070d8", "#9a3ab8", "#5a1a80"][k])
        c.rect(DX - 20 - k * 6, FL + 10 + k * 3, DX + 20 + k * 6, FL + 10 + k * 3, "#ffffff" if k == 0 else "#ff9ae0")
    host = player_fig("chaos", 58, "arms_up", facing=1)
    host["img"] = tint(host["img"], "#0a0412", 0.92)
    px0, py0 = put_figure(c, host, DX, FL + 11, rim_col="#ffffff", toward=(-1, -1))
    hx_, hy_ = px0 + int(host["head"][0]), py0 + int(host["head"][1])
    c.set(hx_ + 2, hy_ + 2, "#ff8ad8")
    e.protect += ["#ffffff", "#ff8ad8"]
    # the audience: only at the edges, dark rows, arms up, rim-lit from the mirrors
    crowd(c, 2, 52, 96, 106, 9, 24, 34, "#10061a", seed=e.seed_for("crowdL"), rim_col="#e070d8", toward=(0, -1),
          poses=("arms_up", "arms_up", "stand"))
    crowd(c, 128, 190, 96, 106, 11, 24, 34, "#10061a", seed=e.seed_for("crowdR"), rim_col="#e070d8", toward=(0, -1),
          poses=("arms_up", "arms_up", "stand"))
    particles(c, "petal", 44, (0, 0, 191, 100), seed=e.seed_for("pt"), cols=("#ff8ad8", "#f0f0fc", "#e070d8"))
    vignette_kind(c, "good", col="#10061a", strength=0.4)


def _bez(p0, p1, p2, p3, t):
    u = 1 - t
    return (u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
            u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1])


@ending("cha_end_claim_tzeentch_chosen")
def cha_end_claim_tzeentch_chosen(e):
    """GOOD / Tzeentch.  The Scribe: a feathered, many-eyed figure at a lectern; from the page a ribbon of futures
    unrolls across the whole warp sky, panel after panel, most of them already struck through in pink.  Blue / cyan,
    a white-hot rift top right, the scribe dark bottom left."""
    c = e.c
    sky(c, ["#07062a", "#0a1a7a", "#1a46b8", "#2a78e0", "#4ab0f8"], 0, 100)
    clouds(c, e.seed_for("cl"), ["#07062a", "#0a1a7a", "#1a46b8"], 0, 100, scale=0.045, thresh=0.5, stretch=2.2)
    RX, RY = 166, 24
    glow(c, RX, RY, 52, ["#1a46b8", "#2a8ae8", "#6ad0ff", "#c8f6ff", "#ffffff"], power=1.2, strength=1.0, ry=36)
    glow(c, RX, RY, 24, ["#e83aa8", "#ff8ad8", "#ffffff"], power=1.6, strength=0.55, ry=16)
    c.ellipse(RX, RY, 5, 3, "#ffffff")
    stars(c, e.seed_for("st"), 40, 0, 90, cols=("#9af6ff", "#ffffff"))
    # floating floor slab + shards
    c.poly([(0, 98), (120, 98), (112, 108), (0, 108)], "#07062a")
    c.line([(0, 98), (120, 98)], "#9af6ff")
    c.poly([(0, 99), (118, 99), (112, 104), (0, 104)], "#0a1a7a")
    for (sx_, sy_, sz) in [(134, 76, 4), (150, 90, 3), (22, 40, 3), (176, 62, 3), (120, 52, 2), (140, 100, 5)]:
        c.poly([(sx_, sy_ - sz), (sx_ + sz, sy_), (sx_, sy_ + sz), (sx_ - sz, sy_)], "#0a1a7a")
        c.line([(sx_, sy_ - sz), (sx_ + sz, sy_)], "#9af6ff")
    # the ribbon of futures: wide, S-curved from the lectern across the sky
    P = [(82, 66), (58, 16), (118, 34), (196, 4)]
    N = 56
    pts = [_bez(*P, i / float(N)) for i in range(N + 1)]
    marks = []
    for i in range(N):
        t = i / float(N)
        w = 17 - 9 * t
        (x0, y0), (x1, y1) = pts[i], pts[i + 1]
        dx, dy = x1 - x0, y1 - y0
        ln = math.hypot(dx, dy) or 1
        nx, ny = -dy / ln * w / 2, dx / ln * w / 2
        panel = i // 5
        edge = (i % 5 == 0)
        band = [(x0 + nx, y0 + ny), (x1 + nx + dx * 0.2, y1 + ny + dy * 0.2), (x1 - nx + dx * 0.2, y1 - ny + dy * 0.2), (x0 - nx, y0 - ny)]
        c.poly(band, "#1a46b8" if edge else ("#f4fdff" if panel % 2 == 0 else "#c0e8fb"))
        if i % 5 == 2:                                  # a tiny pictogram: a figure, a door, a flame...
            marks.append(("pic", (x0 + x1) / 2, (y0 + y1) / 2, panel))
        if panel % 4 != 3 and i % 5 == 0:               # struck through: a bold pink slash across the whole panel
            a_ = (x0 + nx * 1.1, y0 + ny * 1.1)
            b_ = (x0 - nx * 1.1 + dx * 4.6, y0 - ny * 1.1 + dy * 4.6)
            marks.append(("cut", a_, b_))
    for m in marks:
        if m[0] == "pic":
            _, mx_, my_, panel = m
            c.rect(mx_ - 1, my_ - 1, mx_, my_ + 1, "#0a1a7a")
            if panel % 3 == 0:
                c.set(mx_ + 2, my_, "#e83aa8")
        else:
            c.line([m[1], m[2]], "#e83aa8", 2)
    e.protect += ["#e83aa8"]
    # the lectern, the open page glowing
    c.poly([(60, 66), (90, 60), (92, 64), (62, 71)], "#07062a")
    c.line([(60, 66), (90, 60)], "#9af6ff")
    c.rect(71, 70, 80, 98, "#07062a"); c.rect(71, 70, 71, 98, "#2a78e0")
    glow(c, 80, 62, 12, ["#2a8ae8", "#9af6ff", "#ffffff"], power=1.6, strength=0.7)
    # the scribe: standing at the lectern, arm out, feathers down his back, eyes opening on the coat
    me = player_fig("chaos", 56, "reach", facing=1)
    me["img"] = tint(me["img"], "#05030c", 0.88)
    px0, py0 = put_figure(c, me, 44, 98, rim_col="#9af6ff", toward=(1, -1))
    hx_, hy_ = px0 + int(me["head"][0]), py0 + int(me["head"][1])
    hd0 = (px0 + int(me["hands"][0][0]), py0 + int(me["hands"][0][1]))
    rq = e.rng("feath")
    for k in range(10):                                     # feathers: down the back
        fx = hx_ - 4 + rq.randint(-1, 1)
        fy = hy_ + 6 + k * 3
        c.line([(fx, fy), (fx - 6, fy - 3)], ["#2ab8ff", "#9af6ff", "#e83aa8"][k % 3], 1)
        c.set(fx - 6, fy - 3, "#ffffff")
    for k in range(5):                                      # and along the writing arm
        fx = hd0[0] - 16 + k * 3
        fy = hd0[1] - 2 - (k % 2)
        c.line([(fx, fy), (fx + 1, fy - 5)], ["#9af6ff", "#e83aa8", "#ffffff"][k % 3])
    for (ex, ey) in [(hx_ - 6, hy_ + 10), (hx_ - 8, hy_ + 19), (hx_ + 2, hy_ + 16), (hx_ + 3, hy_ + 26)]:                  # eyes
        c.rect(ex - 1, ey, ex + 1, ey + 1, "#ffffff"); c.set(ex, ey, "#e83aa8")
    c.line([(hd0[0], hd0[1]), (hd0[0] + 8, hd0[1] - 3)], "#e8ffff")            # the quill, touching the page
    c.line([(hd0[0] + 8, hd0[1] - 3), (hd0[0] + 14, hd0[1] - 11), (hd0[0] + 10, hd0[1] - 1)], "#e8ffff")
    particles(c, "mote", 40, (0, 0, 191, 98), seed=e.seed_for("mt"), cols=("#9af6ff", "#ffffff", "#e83aa8"))
    vignette_kind(c, "good", col="#05030c", strength=0.4)


def _bat_wing(c, sx, sy, pts, col, edge):
    """one bat wing: shoulder (sx, sy), then wrist / finger tips / scallops given as a polygon outline; edge = lit top line."""
    c.poly([(sx, sy)] + pts, col)
    c.line([(sx, sy)] + pts[:3], edge)


def _daemon_prince(c, cx, hy, s, col="#12061e", edge="#ffb0f0", edge2="#9af6ff"):
    """large winged Daemon Prince, half-length silhouette: horned helm at (cx, hy), spiked pauldrons, wings spread.
    s = scale (1.0 ~ 70 px of wing half-span).  Lit from behind/above (edge colours on the upper edges)."""
    def P(x, y):
        return (cx + x * s, hy + y * s)
    for side in (-1, 1):                                                   # wings: wrist up, three fingers, scalloped membrane
        pts = [P(side * 30, -26), P(side * 66, -22), P(side * 78, 2), P(side * 60, 6), P(side * 66, 22), P(side * 46, 20),
               P(side * 48, 38), P(side * 30, 30), P(side * 20, 46)]
        c.poly([P(side * 10, 6)] + pts, col)
        c.line([P(side * 10, 6), P(side * 30, -26), P(side * 66, -22)], edge, 1)
        c.line([P(side * 66, -22), P(side * 78, 2)], edge2, 1)
        for tip in (P(side * 78, 2), P(side * 66, 22), P(side * 48, 38)):                      # finger bones, a touch lighter
            c.line([P(side * 30, -26), tip], "#2a1040", 1)
    # torso and pauldrons
    c.poly([P(-17, 0), P(17, 0), P(14, 34), P(-14, 34)], "#2e1450")
    c.poly([P(-9, 3), P(9, 3), P(7, 20), P(-7, 20)], "#4a2478")
    c.line([P(-9, 3), P(9, 3)], edge)
    for side in (-1, 1):
        c.ellipse(int(P(side * 19, 3)[0]), int(P(side * 19, 3)[1]), int(7 * s), int(5 * s), "#2e1450")
        c.line([P(side * 25, 1), P(side * 19, -2)], edge)
        for k in range(3):                                                  # spikes
            bx, by = P(side * (14 + k * 5), -1)
            c.poly([(bx - 1, by), (bx + 1, by), (bx, by - 6 * s)], col)
    # head + horns + eyes
    hx0, hy0 = P(0, -9)
    c.ellipse(int(hx0), int(hy0), int(7 * s), int(8 * s), col)
    for side in (-1, 1):
        c.line([P(side * 5, -14), P(side * 13, -17), P(side * 15, -27)], col, 2)
        c.set(P(side * 15, -27)[0], P(side * 15, -27)[1], edge)
    c.set(hx0 - 3 * s, hy0 - 1, "#ffe060"); c.set(hx0 + 3 * s, hy0 - 1, "#ffe060")
    c.line([(hx0 - 4 * s, hy0 - 4), (hx0 + 4 * s, hy0 - 4)], "#2a1040")
    for k in range(4):                                                       # iron rim along the shoulders
        bx, by = P(-15 + k * 10, 1)
        c.set(bx, by, edge)


@ending("cha_end_prince")
def cha_end_prince(e):
    """GOOD.  Small Idol, Large Sky: in the warp-lit sky of the Eye a winged Daemon Prince, years sliding off his iron
    like rain; far below, under a hive's garbage waterfall, a child holds up a warm little statuette with the same
    outline.  Diagonal: big cold prince right of centre, tiny amber light bottom left."""
    c = e.c
    scene_bg(e, "warp", dim=0.18, dim_col="#10061a")
    glow(c, 124, 34, 52, ["#5a1a80", "#c850c8", "#ffb0f0", "#fff0fc"], power=1.5, strength=0.8, ry=34)
    _daemon_prince(c, 124, 30, 0.7)
    # the pauldron and wing edge catch the glow; rain sliding off the iron
    particles(c, "rain", 34, (76, 4, 180, 62), seed=e.seed_for("rain"), cols=("#9af6ff", "#e8ffff", "#c8f6ff"), wind=(1, 1))
    haze(c, 56, 72, "#e070d8", t=0.45, seed=e.seed_for("hz"), profile="bottom", x0=60)
    # the hive ledge below: scrap and rubble in warm dark, lit by the sky
    n = e.noise("scrap")
    for x in range(192):
        top = int(84 - 7 * n.fbm(x * 0.05, 1.3, 3) + (8 if x < 22 else 0) + (x // 60))
        for y in range(top, 108):
            t = clamp(0.1 + (y - top) / 36.0 + (n.fbm(x * 0.2, y * 0.2, 2) - 0.5) * 0.25)
            c.set(x, y, ramp_pick(["#6a3a70", "#3a1e4a", "#1e0e2c", "#0c0618"], t, x, y))
        c.set(x, top, "#e070d8")
    c.rect(0, 40, 14, 110, "#0c0618"); c.rect(0, 40, 0, 110, "#4a2a6a"); c.rect(14, 40, 14, 100, "#7a2a9a")   # a hive wall, far left
    for yy in range(48, 98, 7):
        c.rect(3, yy, 6, yy + 1, "#e8a040") if (yy // 7) % 3 == 0 else None
    # the garbage waterfall: litter pouring from a broken outfall, mist at its foot
    wn = e.noise("wf")
    for x in range(24, 62):
        for y in range(52, 100):
            v = wn.fbm(x * 0.7, y * 0.07, 2)
            if v > 0.45:
                t = clamp((v - 0.45) * 3 + (x - 24) * 0.004)
                c.set(x, y, ramp_pick(["#7a5a80", "#a890b0", "#d8c8e0", "#fff0fc"], t, x, y))
            elif v > 0.36:
                blend(c, x, y, "#e070d8", 0.35, 2)
    c.rect(20, 50, 66, 53, "#0c0618"); c.rect(20, 50, 66, 50, "#9a3ab8")
    haze(c, 88, 102, "#ff9ae0", t=0.55, seed=e.seed_for("mist"), profile="mid", x0=16, x1=72)
    # the child kneels in the light before the fall, holding the idol up
    kid = fig(26, "kneel", "#08040e", facing=1, lean=0)
    kx, ky = put_figure(c, kid, 42, 99, rim_col="#ffd890", toward=(1, -1))
    hd = (kx + int(kid["hands"][0][0]), ky + int(kid["hands"][0][1]))
    hh = (kx + int(kid["head"][0]), ky + int(kid["head"][1]))
    c.line([hd, (hd[0] + 4, hd[1] - 8)], "#08040e", 1)
    c.set(hh[0] + 2, hh[1] + 1, "#ffd890")                                     # a gap-toothed grin
    ix, iy = hd[0] + 5, hd[1] - 10
    glow(c, ix, iy, 8, ["#7a4a1a", "#e8a040", "#ffd890"], power=1.6, strength=0.7)
    # the idol: a tiny winged figure, warm
    for (dx, dy, col) in [(0, 0, "#fff6d8"), (-1, 1, "#ffd890"), (1, 1, "#ffd890"), (-2, 0, "#e8a040"), (2, 0, "#e8a040"),
                          (-3, -1, "#e8a040"), (3, -1, "#e8a040"), (0, 2, "#ffd890"), (0, 3, "#e8a040")]:
        c.set(ix + dx, iy + dy, col)
    light_pool(c, ix - 2, 100, 26, 5, "#ffd890", t=0.55)
    e.protect += ["#fff6d8", "#ffd890"]
    c.rect(100, 98, 105, 101, "#3a2a44"); c.rect(100, 98, 105, 98, "#9a8aa0")                    # a rusted can
    vignette_kind(c, "good", col="#07040e", strength=0.4)


@ending("cha_end_vanish")
def cha_end_vanish(e):
    """GOOD.  The Wrong Note: a lower-hive water-purification station two years on, a round tank window glowing clean
    blue, a worker at the counter (a faint brand glint on one wrist), a short queue of neighbours with pails; overhead,
    four great coloured gazes (red, green, blue, pink) sweep across the hive roof and pass over the roof without
    stopping.  Warm + clean-blue light low left, the searching beams high right."""
    c = e.c
    HZ = 80
    sky(c, ["#10202c", "#22384a", "#3e5c70", "#6a8ea0", "#9ab8c0"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#22384a", "#3e5c70"], 0, 40, scale=0.05, thresh=0.5, stretch=4.0)
    # far hive towers: two layers in smog, a few lit windows
    skyline(c, e.seed_for("sk1"), HZ, "#4a6878", 14, 12, 38, 4, 12, win_p=0.08, wincol=("#ffe8a0", "#9af6ff"), tips=0.5)
    haze(c, 40, HZ, "#9ab8c0", t=0.45, seed=e.seed_for("hz"), profile="bottom")
    skyline(c, e.seed_for("sk2"), HZ + 4, "#22384a", 9, 24, 56, 6, 16, x0=96, win_p=0.1, wincol=("#ffe8a0", "#9af6ff"), tips=0.6)
    # the four gazes: wide soft beams from the top right, sweeping over the roofs
    for (ang, col, tt) in [(156, "#ec3a2a", 0.5), (164, "#9ac838", 0.46), (172, "#2ab8ff", 0.5), (180, "#ff8ad8", 0.46)]:
        shafts(c, (196, -8), ang, 0, 1, 260, col, t=tt, seed=e.seed_for("beam%d" % ang), w0=3, w1=11, power=0.2)
    e.protect += ["#ec3a2a", "#9ac838", "#2ab8ff", "#ff8ad8"]
    # ground: wet plating, reflections
    hband(c, HZ, 107, ["#4a6878", "#2a4252", "#162a36", "#0c1a24"], seed=e.seed_for("gr"), rough=0.2)
    c.rect(0, HZ, 191, HZ, "#0c1a24")
    # the station: low squat building, left, with pipes
    c.rect(8, 50, 92, HZ, "#0e1a22")
    c.rect(8, 50, 92, 50, "#5a8296")
    c.rect(8, 56, 92, 57, "#16262e")
    for x in range(12, 90, 12):
        c.rect(x, 52, x + 1, 56, "#2a4252")
    for x in range(14, 90, 6):                                                    # a ribbon of small lit windows under the cornice
        c.rect(x, 53, x + 2, 54, "#ffe8a0" if (x // 6) % 3 else "#9af6ff")
    c.rect(18, 36, 24, 50, "#0e1a22"); c.rect(18, 36, 18, 50, "#4a6878")        # stack
    c.rect(64, 30, 72, 50, "#0e1a22"); c.rect(64, 30, 64, 50, "#4a6878")
    c.line([(24, 50), (64, 43)], "#0e1a22", 2)                                 # pipe between
    # the round tank window: clean blue water, bubbles, bright
    TX, TY, TR = 36, 66, 15
    light_pool(c, TX, TY, 34, 28, "#4ab0e0", t=0.5)
    for y in range(TY - TR, TY + TR + 1):
        for x in range(TX - TR, TX + TR + 1):
            d = math.hypot(x - TX, y - TY)
            if d <= TR:
                t = clamp(0.1 + (TY + TR - y) / (2.0 * TR) * 0.2 + (1 - d / TR) * 0.7)
                c.set(x, y, ramp_pick(["#0a3a5a", "#1a6a9a", "#4ab0e0", "#a8e8ff", "#e8ffff"], t, x, y))
            elif d <= TR + 2:
                c.set(x, y, "#16262e" if d > TR + 1 else "#7ab0c4")
    for (bx, by) in [(30, 70), (33, 62), (40, 74), (43, 58), (36, 52)]:
        c.set(bx, by, "#ffffff")
    # the counter window: warm lamp, the worker's silhouette with one wrist glowing faintly red
    c.rect(62, 62, 86, 76, "#ffcf6a")
    c.rect(62, 62, 86, 62, "#fff0b0")
    for x in range(63, 86):
        for y in range(63, 76):
            blend(c, x, y, "#e89a3a", 0.35 + (y - 62) * 0.02, 3)
    c.rect(61, 61, 87, 61, "#0e1a22"); c.rect(61, 61, 61, 77, "#0e1a22"); c.rect(87, 61, 87, 77, "#0e1a22"); c.rect(61, 77, 87, 77, "#0e1a22")
    c.rect(74, 61, 74, 77, "#0e1a22")
    me = fig(24, "carry", "#2a1c14", facing=-1)
    mx0, my0 = put_figure(c, me, 68, 77, rim_col="#ffe8a0", toward=(1, -1))
    h0 = (mx0 + int(me["hands"][0][0]), my0 + int(me["hands"][0][1]))
    c.set(h0[0], h0[1], "#ff5a3a")
    c.set(h0[0] + 1, h0[1], "#ff8a3a")
    e.protect += ["#ff5a3a", "#ff8a3a"]
    c.rect(62, 76, 86, 78, "#3a2a22"); c.rect(62, 76, 86, 76, "#c8a060")        # counter
    c.rect(8, 76, 92, 82, "#0e1a22")
    light_pool(c, 50, HZ + 8, 56, 8, "#a8e8ff", t=0.45)
    light_pool(c, 74, HZ + 8, 20, 6, "#ffcf6a", t=0.5)
    # the queue: three neighbours with pails, right of the station, long shadows to the right
    for (x, y, h, pz) in [(106, 92, 25, "stand"), (122, 96, 27, "carry"), (140, 100, 29, "stand")]:
        f = fig(h, pz, "#0a1218", facing=-1)
        fx, fy = put_figure(c, f, x, y, rim_col="#a8e8ff", toward=(-1, -1),
                            shadow=dict(toward_light=(-1, 0.2), length=1.0, squash=0.3, col="#060c12", t=0.7))
        hd = (fx + int(f["hands"][0][0]), fy + int(f["hands"][0][1]))
        c.rect(hd[0] - 1, hd[1] + 1, hd[0] + 2, hd[1] + 4, "#8a7a68")
    particles(c, "mote", 16, (20, 20, 180, 90), seed=e.seed_for("mt"), cols=("#e8ffff", "#ffffff"))
    particles(c, "rain", 12, (0, 0, 191, 100), seed=e.seed_for("rain"), cols=("#7a9aa8", "#9ab8c0"), wind=(0, 1))
    vignette_kind(c, "good", col="#06101a", strength=0.4)


@ending("cha_end_claim_khorne")
def cha_end_claim_khorne(e):
    """BAD / Khorne.  The Leash: down a road of skulls the far Skull Throne glows red on the horizon; a hunched,
    nameless hound-man runs toward it, a taut brass chain from his collar to the throne.  Skull heaps close in on the
    right, light from the far left, black / red."""
    c = e.c
    R = GOD["khorne"]["ramp"]
    HZ = 62
    VX = 46
    sky(c, ["#10040a", "#2a060c", "#521010", "#8a1e12", "#c8441c"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#10040a", "#2a060c", "#40080e"], 0, 50, scale=0.05, thresh=0.5, stretch=4.5)
    glow(c, VX, HZ - 4, 70, ["#2a060c", "#521010", "#8a1e12", "#c8441c", "#ec8a2c", "#ffc060"], power=1.3, strength=1.0, ry=48)
    shafts(c, (VX, HZ - 14), 0, 60, 6, 100, "#ffc060", t=0.2, seed=e.seed_for("sh"), w0=2, w1=9, power=0.8)
    # the far Skull Throne: stepped heap of skulls, a tall silhouetted seat on top
    for k, (hw, y0) in enumerate([(22, HZ - 2), (15, HZ - 7), (9, HZ - 12)]):
        c.rect(VX - hw, y0 - 5, VX + hw, y0, "#14040a")
        for sx in range(VX - hw + 2, VX + hw - 1, 4):
            c.set(sx, y0 - 3 + (sx // 4 % 2), "#c8a070"); c.set(sx + 1, y0 - 3 + (sx // 4 % 2), "#7a5a40")
    c.poly([(VX - 6, HZ - 12), (VX + 6, HZ - 12), (VX + 5, HZ - 30), (VX + 2, HZ - 34), (VX - 2, HZ - 34), (VX - 5, HZ - 30)], "#14040a")
    c.line([(VX - 5, HZ - 30), (VX - 2, HZ - 34), (VX + 2, HZ - 34), (VX + 5, HZ - 30)], "#ffc060")
    glow(c, VX, HZ - 22, 8, ["#8a1e12", "#ec8a2c", "#ffc060"], power=2.0, strength=0.5)
    # ground: blood-dark plain, road converging on the throne
    hband(c, HZ, 107, ["#8a1e12", "#521010", "#2a060c", "#10040a"], seed=e.seed_for("gr"), rough=0.3)
    haze(c, HZ - 6, HZ + 8, "#ec8a2c", t=0.5, seed=e.seed_for("hz"), profile="mid", x1=130)
    light_pool(c, VX, HZ + 5, 70, 5, "#ffc060", t=0.5)
    light_pool(c, 74, HZ + 18, 80, 22, "#c8441c", t=0.8)
    light_pool(c, 70, HZ + 14, 44, 12, "#ec8a2c", t=0.6)
    for k in range(-9, 10):
        c.line([(VX + k * 0.6, HZ + 1), (VX + k * 16, 107)], "#2a060c")
    # skull heaps lining the road: small and far on the left, big and close on the right
    _skull_heap(c, 0, 40, HZ + 14, 12, e.seed_for("hL"), col="#10040a", lit="#ec8a2c", bone="#8a6a54", cx=14, sk=(3, 5), dens=0.7)
    _skull_heap(c, 60, 96, HZ + 6, 5, e.seed_for("hM"), col="#14040a", lit="#ec8a2c", bone="#8a6a54", cx=80, sk=(3, 4), dens=0.8)
    tops = _skull_heap(c, 124, 191, 108, 58, e.seed_for("hR"), col="#10040a", lit="#ec8a2c", bone="#a07a60", cx=190, sk=(5, 8), dens=0.7)
    haze(c, 40, 108, "#521010", t=0.25, seed=e.seed_for("hz2"), profile="top", x0=124)
    # the hound: low, hunched run toward the throne, collar and a taut chain
    f = fig(50, "run", "#12040a", facing=-1, lean=52, thick=1.25)
    fx, fy = 104, 101
    px0, py0 = put_figure(c, f, fx, fy, rim_col="#c8441c", toward=(-1, -1),
                          shadow=dict(toward_light=(-1, 0.3), length=1.1, squash=0.3, col="#080204", t=0.8))
    hx_, hy_ = px0 + int(f["head"][0]), py0 + int(f["head"][1])
    nk = (hx_ - 2, hy_ + 3)
    c.rect(nk[0] - 2, nk[1], nk[0] + 2, nk[1] + 1, "#ffc060")                             # the collar
    pts = []
    for i in range(0, 41):                                                                 # taut chain: a shallow arc to the throne
        t = i / 40.0
        x = nk[0] + (VX + 6 - nk[0]) * t
        y = nk[1] + (HZ - 4 - nk[1]) * t + math.sin(t * math.pi) * 4
        pts.append((x, y))
    c.line(pts, "#08020a", 2)
    for i, (x, y) in enumerate(pts):
        c.set(x, y - 1, "#c8902a" if i % 2 else "#ffc060")
    e.protect += ["#e8a040", "#ffc060"]
    # big foreground skulls and ash
    _skull(c, 16, 98, 9, base="#8a6a54", dark="#10040a", lit="#ec8a2c")
    _skull(c, 44, 103, 6, base="#6a5444", dark="#10040a", lit="#ec8a2c")
    particles(c, "ash", 40, (0, 0, 191, 100), seed=e.seed_for("ash"), cols=("#6a2a22", "#8a3a2a", "#4a1a14"))
    particles(c, "ember", 34, (0, 20, 191, 100), seed=e.seed_for("emb"), cols=("#ff9a3a", "#ff6a2a", "#ffd080"))
    vignette_kind(c, "bad", col="#0a0204", strength=0.5)


def _mushroom(c, x, y, r, cap="#d8d880", lit="#f6f2c0", stem="#a8b84a", dark="#222e12"):
    """mushroom growing upward from (x, y): stalk, then a flat-bottomed dome cap of radius r, lit on the right."""
    sl = max(2, int(r * 1.4))
    for k in range(sl):
        c.set(x, y - k, stem)
    widths = [r, r, max(1, r - 1), max(1, r - 2)] if r >= 3 else [r, max(1, r - 1)]
    cy = y - sl
    for j, w in enumerate(widths):
        for i in range(-w, w + 1):
            c.set(x + i, cy - j, lit if (i == w and j > 0) else cap)
    c.rect(x - r, cy + 1, x + r, cy + 1, dark)


def _lying(L, col, facing=1):
    """a person lying on their side, head left (facing=1) -- RGBA image about L px long.  Returns (img, head_xy, top_profile)
    where top_profile[x] = first opaque y in column x (for putting things on the back)."""
    W_, H_ = int(L * 1.15), int(L * 0.34)
    big = Image.new("L", (W_ * 6, H_ * 6), 0)
    d = ImageDraw.Draw(big)
    oy = H_ * 0.45

    def seg(a, b, w):
        d.line([(a[0] * L * 6 + 6 * 6, (a[1] * L + oy) * 6), (b[0] * L * 6 + 6 * 6, (b[1] * L + oy) * 6)], fill=255, width=max(1, int(w * L * 6)))
        for q in (a, b):
            r = w * L * 6 / 2
            cx_, cy_ = q[0] * L * 6 + 6 * 6, (q[1] * L + oy) * 6
            d.ellipse([cx_ - r, cy_ - r, cx_ + r, cy_ + r], fill=255)
    seg((0.0, 0.0), (0.001, 0.0), 0.15)                       # head
    seg((0.10, 0.015), (0.45, 0.02), 0.17)                    # torso
    seg((0.45, 0.02), (0.70, 0.05), 0.10); seg((0.70, 0.05), (0.96, -0.03), 0.08)      # near leg
    seg((0.45, 0.05), (0.72, 0.09), 0.09); seg((0.72, 0.09), (0.98, 0.06), 0.07)       # far leg
    seg((0.16, 0.05), (-0.12, 0.10), 0.07)                    # the arm reaching past the head
    small = big.resize((W_, H_), Image.BOX).point(lambda v: 255 if v >= 110 else 0)
    img = Image.new("RGBA", small.size, (0, 0, 0, 0))
    img.paste(Image.new("RGBA", small.size, C(col) + (255,)), (0, 0), small)
    mp = small.load()
    top = {}
    for x in range(W_):
        for y in range(H_):
            if mp[x, y]:
                top[x] = y
                break
    if facing < 0:
        img = img.transpose(Image.FLIP_LEFT_RIGHT)
        top = {W_ - 1 - x: y for x, y in top.items()}
    return img, top


@ending("cha_end_claim_nurgle")
def cha_end_claim_nurgle(e):
    """BAD / Nurgle.  The Warm Stove: night in the sump; the player lies in the shallows, mushrooms standing from his
    fingers and ribs, glowing sick ochre like a stove; three neighbours sit close, hands out to the warmth; flies,
    steam, an oily mirror under him.  Dark above, the glow low and centred, green-ochre."""
    c = e.c
    R = GOD["nurgle"]["ramp"]
    FL = 66
    n = e.noise("wall")
    for y in range(FL + 1):
        for x in range(192):
            t = clamp(0.1 + y / 120.0 + (n.fbm(x * 0.05, y * 0.06, 3) - 0.5) * 0.35)
            c.set(x, y, ramp_pick(["#05080a", "#0c120a", "#161e10", "#222e18"], t, x, y))
    # pipes: verticals with drips, a horizontal run, a lamp that has long since died
    rp = e.rng("pipes")
    for (px_, w) in [(10, 5), (36, 3), (64, 4), (140, 5), (168, 3), (184, 4)]:
        c.rect(px_, 0, px_ + w, FL, "#0a0e08"); c.rect(px_, 0, px_, FL, "#2e3c20")
        for yy in range(6, FL, 11):
            c.rect(px_ - 1, yy, px_ + w + 1, yy + 1, "#10160c")
    c.rect(0, 14, 191, 17, "#0a0e08"); c.rect(0, 14, 191, 14, "#34442a")
    for k in range(9):
        dx_ = rp.randint(4, 188)
        c.set(dx_, 18 + rp.randint(0, 30), "#8a9a40")
    # the shallows: black oily water, with the glow's reflection
    hband(c, FL, 107, ["#2a3a1c", "#161e10", "#0c120a", "#05080a"], seed=e.seed_for("wt"), rough=0.2)
    c.rect(0, FL, 191, FL, "#34442a")
    # the stove: glow from the body, laid down BEFORE the figures
    BX, BY = 96, 86
    light_pool(c, BX, BY - 2, 84, 30, "#7a9a2e", t=0.85, power=1.1)
    light_pool(c, BX, BY - 2, 50, 18, "#c8d060", t=0.8, power=1.0)
    light_pool(c, BX, BY - 4, 26, 9, "#f6f2c0", t=0.75, power=1.0)
    for y in range(FL + 1, 107):                                         # ripple streaks under the glow
        for x in range(BX - 50, BX + 51):
            if (x * 3 + y * 7) % 11 == 0 and abs(x - BX) < 50 - (y - FL) * 0.4:
                blend(c, x, y, "#d8d880", 0.45 - (y - FL) * 0.008, 3)
    # the player, lying on his side in the shallows
    body, top = _lying(70, "#10160a")
    bx0, by0 = BX - 38, BY - 4
    body = rim(body, "#d8d880", (0, -1), min_run=2)
    cast_shadow(c, body, bx0 + 20, by0 + body.height - 2, anchor="tl", origin=(20, body.height - 1), toward_light=(0, 1.0), length=0.0, squash=0.8, col="#05080a", t=0.4)
    place(c, body, bx0, by0, anchor="tl")
    bm = body.load()
    for j in range(body.height):                                    # the stove glows through him: warm the whole body a step
        for i in range(body.width):
            if bm[i, j][3] >= 128:
                blend(c, bx0 + i, by0 + j, "#a8b84a", 0.42 - j * 0.008, 3)
    hy0 = by0 + int(body.height * 0.45)
    c.set(bx0 + 7, hy0 - 1, "#f6f2c0"); c.rect(bx0 + 5, hy0 + 3, bx0 + 8, hy0 + 3, "#f6f2c0"); c.set(bx0 + 9, hy0 + 2, "#f6f2c0")   # a contented smile
    c.rect(bx0 + 24, by0 + 4, bx0 + 30, by0 + 5, "#a03a2a")                                                                          # his coat band, going olive
    # mushrooms standing out of fingers, shoulder and ribs
    rm = e.rng("mush")
    for (dx, r) in [(2, 2), (12, 3), (20, 2), (28, 3), (36, 4), (45, 3), (52, 2), (60, 2), (-4, 2)]:
        if (dx + 8) in top:
            _mushroom(c, bx0 + dx + 8, by0 + top[dx + 8] + 1, r, cap=rm.choice(["#d8d880", "#e8d070", "#c8d060"]), lit="#f6f2c0")
    e.protect += ["#f6f2c0"]
    # steam, rising in a slow S-curve
    sn = e.noise("steam")
    for y in range(8, 78):
        for x in range(60, 140):
            wv = BX + math.sin(y * 0.16) * 7 + (78 - y) * 0.1 - 6
            w = 2 + (78 - y) * 0.07
            if abs(x - wv) < w and sn.fbm(x * 0.35, y * 0.2, 2) > 0.38:
                blend(c, x, y, "#c8d060", 0.22 + (78 - y) / 140.0 * 0.0, 3)
    # three neighbours warming their hands, backlit
    for (x, y, h, face) in [(46, 90, 30, 1), (148, 86, 28, -1), (112, 75, 20, -1)]:
        f = fig(h, "sit", "#07090a", facing=face, lean=6)
        fx, fy = put_figure(c, f, x, y, rim_col="#d8d880", toward=(1 if face == 1 else -1, -0.2))
        hd = (fx + int(f["hands"][0][0]), fy + int(f["hands"][0][1]))
        c.rect(hd[0] - 1, hd[1] - 1, hd[0] + 1, hd[1], "#a8b84a")
    # flies and spores
    rf = e.rng("flies")
    for _ in range(40):
        fx, fy = int(rf.gauss(BX, 34)), int(rf.gauss(BY - 14, 14))
        if 2 <= fx < 190 and 20 < fy < 104:
            c.set(fx, fy, "#05080a")
    particles(c, "spore", 34, (30, 20, 170, 100), seed=e.seed_for("sp"), cols=("#d8d880", "#c8d850", "#a8b84a"))
    vignette_kind(c, "bad", col="#04060a", strength=0.55)


# ================================================================================================ wave 2: the missing ten
# (bad: purged, light, pyre, sacrifice, claim_slaanesh, claim_tzeentch, feast;  death: hp, sanity, corruption)

def _rubble(c, y0, seed, col="#06090c", lite=None, x0=0, x1=191, amp=7, fill_to=107):
    """ragged heap of rubble silhouette along y0 (top edge wobbles +-amp), filled to the bottom, optional lit top edge."""
    n = Noise(seed)
    rr = random.Random(seed)
    for x in range(x0, x1 + 1):
        top = int(y0 - amp * n.fbm(x * 0.06, 1.1, 3) + rr.randint(-1, 1))
        for y in range(top, fill_to + 1):
            c.set(x, y, col)
        if lite:
            c.set(x, top, lite)


def _knight(c, x, y, H, col="#0a121a", mid="#1a2c38", hi="#3e5e70", edge="#9ac8d8", visor="#7ae8ff", face=-1):
    """a towering armoured warrior silhouette (feet at x,y, height H) holding a long halberd up-and-forward (dx > 0 =
    toward the facing side): bulky pauldrons, big helm with a lit visor slit, rim light on the facing side.
    face=-1 faces left.  Returns the halberd blade centre (x, y)."""
    s = face
    k = H / 80.0

    def X(dx):
        return int(round(x + s * dx))

    def R(a, b, y0, y1, cc):
        ya, yb = int(round(y - y0 * k)), int(round(y - y1 * k))
        c.rect(min(X(a), X(b)), min(ya, yb), max(X(a), X(b)), max(ya, yb), cc)
    # legs: greaves with knee plates, a gap between
    R(-11, -1, 0, 33, col); R(2, 12, 0, 33, col)
    R(-11, -8, 4, 31, mid); R(2, 5, 4, 31, mid)
    R(-11, -1, 22, 25, mid); R(2, 12, 22, 25, mid)
    R(-12, 0, 0, 3, mid); R(1, 13, 0, 3, mid)                                   # boots
    # tasset skirt + belt
    R(-12, 12, 31, 40, col); R(-12, 12, 38, 39, hi)
    # backpack stacks behind the shoulders
    R(-14, -8, 62, 72, col); R(8, 14, 62, 72, col)
    # torso: dark, with a mid plate on the facing side
    c.poly([(X(-16), y - 63 * k), (X(16), y - 63 * k), (X(13), y - 38 * k), (X(-13), y - 38 * k)], col)
    c.poly([(X(2), y - 61 * k), (X(14), y - 61 * k), (X(11), y - 41 * k), (X(2), y - 41 * k)], mid)
    # pauldrons: wide domes, lit on top
    for sx in (-20, 20):
        c.ellipse(X(sx), int(y - 60 * k), int(10 * k), int(8 * k), col)
    c.ellipse(X(20), int(y - 62 * k), int(8 * k), int(4 * k), mid)
    c.line([(X(12), y - 68 * k), (X(20), y - 70 * k), (X(28), y - 64 * k)], hi)
    # helm
    c.ellipse(X(1), int(y - 72 * k), int(7 * k), int(8 * k), col)
    R(-1, 6, 73, 73, visor)
    c.line([(X(7), y - 74 * k), (X(4), y - 79 * k), (X(-2), y - 79 * k)], hi)
    # the halberd, hand on the shaft, forward arm up
    base = (X(-8), y - 2)
    tip = (X(42 * k), y - 88 * k)
    c.line([base, tip], col, 2)
    hand = (base[0] + (tip[0] - base[0]) * 0.55, base[1] + (tip[1] - base[1]) * 0.55)
    c.line([(X(15), y - 56 * k), (X(25), y - 50 * k), hand], col, 4)
    c.line([(X(15), y - 56 * k), (X(25), y - 50 * k)], mid, 1)
    tx, ty = tip
    c.poly([(tx, ty + 6), (tx + s * 11, ty - 1), (tx + s * 5, ty - 15), (tx - s * 3, ty - 8)], "#d8f4ff")
    c.line([(tx, ty + 6), (tx + s * 11, ty - 1), (tx + s * 5, ty - 15)], "#ffffff")
    # rim light: facing side of torso, leg and helm
    for yy in range(int(y - 63 * k), int(y - 38 * k)):
        c.set(X(16) - s * int(0 + (63 * k - (y - yy)) * 0.12), yy, edge)
    for yy in range(int(y - 33 * k), int(y)):
        c.set(X(12), yy, edge)
    c.line([(X(8), y - 74 * k), (X(8), y - 70 * k)], edge)
    return (tx + s * 3, ty - 3)


@ending("cha_end_purged")
def cha_end_purged(e):
    """BAD.  The Light Falls Without a Sound: a ruined hive street under a bruised cold sky; a Grey Knight towers at the
    right (huge, back-lit, halberd blade blazing over the player); the player kneels small at the left in the blade's
    white light, hands behind the head; far up in the left sky three thin lance beams are coming down -- the world's
    own six hours.  Steel-blue / ash, one thread of red."""
    c = e.c
    HZ = 72
    sky(c, ["#06090e", "#0e1a24", "#1e323e", "#38525e", "#648290", "#86a2ac"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#0e1a22", "#1e323e", "#3a5662"], 0, 56, scale=0.045, thresh=0.52, stretch=4.0)
    # the world's end: lance beams slanting down through the cloud on the far left, a bruise of red where they land
    glow(c, 26, HZ - 2, 34, ["#2a424e", "#6a3a40", "#c0504a", "#ff9a7a", "#ffe8d8"], power=1.5, strength=0.8, ry=14)
    for k, (x0, x1_) in enumerate([(2, 14), (16, 30), (32, 44)]):
        c.line([(x0 - 12, 0), (x1_, HZ - 3)], "#ffe8d8")
        c.line([(x0 - 11, 0), (x1_ + 1, HZ - 3)], "#c0504a")
        glow(c, x1_, HZ - 3, 5, ["#c0504a", "#ff9a7a", "#ffffff"], power=1.5, strength=0.7)
    e.protect += ["#ffe8d8", "#ff9a7a"]
    skyline(c, e.seed_for("sk1"), HZ, "#2a424e", 14, 8, 26, 4, 11, x0=52, win_p=0.0, tips=0.3)
    haze(c, 40, HZ, "#86a2ac", t=0.35, seed=e.seed_for("hz"), profile="bottom")
    skyline(c, e.seed_for("sk2"), HZ + 2, "#101c24", 8, 14, 38, 5, 14, x0=56, win_p=0.04, wincol=("#9ac8d8",), tips=0.4)
    hband(c, HZ, 107, ["#3e5c6a", "#22383f", "#101c22", "#080e12"], seed=e.seed_for("gr"), rough=0.2)
    c.rect(0, HZ, 191, HZ, "#0a1218")
    haze(c, 84, 108, "#22383f", t=0.4, seed=e.seed_for("hz2"), profile="bottom")
    # the knight: a pale wet-street glare behind his legs so the dark greaves read
    KX, KY = 128, 106
    light_pool(c, KX - 6, 92, 62, 12, "#a8c4cc", t=0.75)
    light_pool(c, KX - 6, 92, 34, 7, "#d8f0ff", t=0.5)
    bx, by = _knight(c, KX, KY, 86, face=-1)
    glow(c, bx, by, 20, ["#2a5a78", "#6aa8c8", "#c0e8f8", "#ffffff"], power=1.4, strength=0.85, ry=20)
    shafts(c, (bx, by + 4), 100, 34, 7, 110, "#d8f0ff", t=0.4, seed=e.seed_for("sh"), w0=2, w1=12, power=0.5)
    e.protect += ["#d8f4ff", "#ffffff"]
    # the lit patch where the player kneels
    PX = bx - 2
    light_pool(c, PX, 96, 40, 8, "#d8f0ff", t=0.7)
    light_pool(c, PX, 96, 20, 5, "#ffffff", t=0.6)
    me = player_fig("chaos", 36, "kneel", facing=1, lean=14)
    me["img"] = tint(me["img"], "#0e1a24", 0.4)
    px0, py0 = put_figure(c, me, PX, 98, rim_col="#e8f8ff", toward=(1, -1),
                          shadow=dict(toward_light=(1, 0.5), length=1.2, squash=0.25, col="#05080a", t=0.8))
    hd = (px0 + int(me["head"][0]), py0 + int(me["head"][1]))
    c.set(hd[0] - 2, hd[1] - 4, "#e8f8ff"); c.set(hd[0] - 3, hd[1] - 3, "#e8f8ff")       # hands laced behind the head
    # rubble foreground, a dropped lasgun, a trooper's little lamp lying lit on the ground
    _rubble(c, 104, e.seed_for("rb"), col="#060a0e", lite="#2e4852", x0=0, x1=191, amp=4)
    c.rect(12, 102, 30, 102, "#0a1218"); c.rect(12, 101, 24, 101, "#4a6a78")
    c.rect(166, 102, 169, 103, "#d8f0ff"); c.set(167, 102, "#ffffff")
    particles(c, "ash", 26, (0, 0, 191, 100), seed=e.seed_for("ash"), cols=("#7a9aa8", "#a8c0c8", "#5a7a88"))
    vignette_kind(c, "bad", col="#04080c", strength=0.62)


def _flames(c, cx, base, h, w, seed, cols=("#8a1e12", "#c8441c", "#ec8a2c", "#ffc060", "#fff0b0"), n=13):
    """a bonfire / pyre fire: overlapping teardrop tongues of random height, outer dark orange to a pale core.
    h = tallest tongue, w = base half-width."""
    rr = random.Random(seed)
    tongues = []
    for k in range(n):
        dx = rr.uniform(-w, w)
        edge = abs(dx) / float(w)
        th = h * rr.choice([0.35, 0.5, 0.65, 0.8, 1.0]) * (1 - edge * 0.55)
        tongues.append((dx, max(8, th), rr.uniform(0.7, 1.2), rr.uniform(-3, 3)))
    for layer, col in enumerate(cols):
        sh = 1.0 - layer * 0.19
        for (dx, th, wd, lean) in tongues:
            hw = max(1.5, (w * 0.34 * wd) * sh)
            tx = cx + dx + lean * sh
            pts = [(cx + dx - hw, base), (cx + dx - hw * 0.8, base - th * 0.4 * sh), (tx - 1, base - th * 0.82 * sh),
                   (tx, base - th * sh), (tx + 1, base - th * 0.78 * sh), (cx + dx + hw * 0.8, base - th * 0.4 * sh), (cx + dx + hw, base)]
            c.poly(pts, col)


@ending("cha_end_pyre")
def cha_end_pyre(e):
    """BAD.  The Stake in the Square: dusk, a mandatory-attendance crowd in a hive square; the pyre burns far left, the
    Inquisitor -- tall, dark, back-lit by it, wide-brimmed hat and long coat -- stands foreground centre with her back
    to the fire, watching the crowd: her long shadow lies across their feet.  One small figure in the crowd has turned
    away.  Orange vs a sliver of cold blue (her blade); smoke column; bright mass left, dark mass centre."""
    c = e.c
    HZ = 60
    sky(c, ["#0a0608", "#1e0e12", "#401a16", "#6e2c1a", "#a2501e"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#140a0c", "#2a1214", "#4a1c16"], 0, 46, scale=0.05, thresh=0.5, stretch=3.5)
    FX, FY = 28, 82
    glow(c, FX, FY - 20, 100, ["#2a1214", "#5a2418", "#a2501e", "#e0802a", "#ffc060"], power=1.3, strength=0.9, ry=66)
    # the square's facades, dark, a few lit windows, a bell tower
    skyline(c, e.seed_for("sk1"), HZ + 4, "#2a1214", 11, 20, 46, 8, 20, x0=64, win_p=0.1, wincol=("#e8a040", "#ffc060"), tips=0.3)
    c.rect(150, 14, 158, HZ + 4, "#22100e"); c.poly([(149, 14), (159, 14), (154, 4)], "#22100e")
    c.rect(152, 22, 156, 30, "#0a0406"); c.set(154, 26, "#e8a040")
    haze(c, 36, HZ + 6, "#a2501e", t=0.5, seed=e.seed_for("hz"), profile="bottom")
    # the square: paving lit by the fire right across to the crowd, perspective lines toward the fire
    hband(c, HZ + 4, 107, ["#9a4a22", "#6a3018", "#3a1a12", "#160a0a"], seed=e.seed_for("gr"), rough=0.2)
    for k in range(-8, 12):
        c.line([(FX + k * 4, HZ + 5), (FX + k * 30 - 40, 107)], "#2a1210")
    for yy in (72, 80, 90, 101):
        c.rect(0, yy, 191, yy, "#2a1210")
    light_pool(c, FX + 60, 84, 150, 22, "#e0802a", t=0.62)
    light_pool(c, FX + 24, 84, 70, 12, "#ffc060", t=0.5)
    # the pyre: post, a stack of wood, fire wrapping the lower half, smoke rising from the top
    sn = e.noise("smoke")
    for y in range(0, FY - 44):
        for x in range(FX - 24, FX + 40):
            wv = FX + 6 + math.sin(y * 0.09) * 5 + (FY - 44 - y) * 0.16
            w_ = 4 + (FY - 44 - y) * 0.11
            if abs(x - wv) < w_ and sn.fbm(x * 0.2, y * 0.12, 3) > 0.42:
                blend(c, x, y, "#120808", 0.55, 3)
    c.rect(FX - 1, FY - 66, FX + 1, FY, "#120808")             # a plain post
    _flames(c, FX, FY, 62, 16, e.seed_for("fl"))
    c.rect(FX - 2, FY - 22, FX + 2, FY - 6, "#120808")          # the bound bundle at the post, half in flame
    for k, (a, b) in enumerate([(-18, 5), (-10, 8), (-2, 6), (6, 9), (13, 5)]):   # the wood: a ragged dark heap at the foot
        c.ellipse(FX + a, FY + 1, 6, b - 2, "#120808")
    c.rect(FX - 22, FY + 3, FX + 22, FY + 4, "#120808")
    glow(c, FX, FY - 30, 16, ["#e0802a", "#ffc060", "#fff0b0"], power=2.0, strength=0.35)
    e.protect += ["#fff0b0", "#ffc060"]
    particles(c, "ember", 44, (4, 0, 110, 90), seed=e.seed_for("emb"), cols=("#ff9a3a", "#ffd080", "#ffe8a0"), wind=(-1, -2))
    # the crowd: mostly facing the fire (left); small rim only on the nearest; one turned away
    rows = [(118, 76, 21, "stand", -1), (132, 79, 22, "hunch", -1), (146, 76, 20, "stand", -1), (158, 80, 23, "stand", -1),
            (170, 77, 21, "hunch", -1), (182, 80, 23, "stand", -1), (150, 90, 29, "stand", -1),
            (168, 93, 31, "stand", -1), (186, 92, 30, "hunch", -1), (126, 91, 28, "stand", -1)]
    for (x, y, h, pz, face) in rows:
        f = fig(h, pz, "#1e0c0c", facing=face)
        put_figure(c, f, x, y, rim_col="#ffa040" if h > 29 else None, toward=(-1, -0.2),
                   shadow=dict(toward_light=(-1, 0.25), length=1.2, squash=0.3, col="#0a0406", t=0.7))
    ta = fig(27, "stand", "#3a241a", facing=1)
    tx0, ty0 = put_figure(c, ta, 140, 99, rim_col="#ffc060", toward=(-1, -0.2),
                          shadow=dict(toward_light=(-1, 0.25), length=1.2, squash=0.3, col="#0a0406", t=0.7))
    c.set(tx0 + int(ta["head"][0]) + 1, ty0 + int(ta["head"][1]), "#ffc060")
    # the Inquisitor: back to the fire, tall, wide-brimmed hat, long coat; shadow across the square
    iq = fig(64, "stand", "#0c0608", robe=0.85, thick=1.05, facing=1)
    ipx, ipy = put_figure(c, iq, 86, 100, rim_col="#ffa040", toward=(-1, -0.2),
                          shadow=dict(toward_light=(-1, 0.14), length=1.0, squash=0.12, col="#0a0406", t=0.8))
    hx_, hy_ = ipx + int(iq["head"][0]), ipy + int(iq["head"][1])
    c.rect(hx_ - 9, hy_ - 4, hx_ + 8, hy_ - 4, "#0c0608"); c.rect(hx_ - 7, hy_ - 5, hx_ + 6, hy_ - 4, "#0c0608")   # the brim
    c.rect(hx_ - 4, hy_ - 9, hx_ + 4, hy_ - 5, "#0c0608")                                                              # the crown
    c.line([(hx_ - 9, hy_ - 4), (hx_ - 5, hy_ - 5), (hx_ - 4, hy_ - 9)], "#ffa040")
    c.set(hx_ + 1, hy_ - 6, "#6a1810")                                                                                    # a red band
    hd0 = (ipx + int(iq["hands"][0][0]), ipy + int(iq["hands"][0][1]))
    c.line([hd0, (hd0[0] + 8, hd0[1] + 12)], "#6ab0e0")                                                                  # blade, point down, a sliver
    c.set(hd0[0] + 8, hd0[1] + 12, "#e0f4ff"); c.set(hd0[0], hd0[1], "#d8c8a8"); c.set(hd0[0] + 1, hd0[1], "#d8c8a8")  # the glove
    e.protect += ["#e0f4ff", "#6ab0e0"]
    particles(c, "ash", 36, (0, 0, 191, 100), seed=e.seed_for("ash"), cols=("#4a2a22", "#6a3a2a", "#3a1e1a"))
    vignette_kind(c, "bad", col="#060204", strength=0.55)


def _inq(c, x, y, h, face=1, col="#0c0608", rim_col=None, toward=(-1, -0.2), shadow=None, thick=1.0):
    """Inquisitor-type silhouette: long coat, wide-brimmed hat with a red band.  (x, y) = feet.  Returns (head_xy, hand_xy)."""
    f = fig(h, "stand", col, robe=0.85, thick=thick, facing=face)
    px0, py0 = put_figure(c, f, x, y, rim_col=rim_col, toward=toward, shadow=shadow)
    hx_, hy_ = px0 + int(f["head"][0]), py0 + int(f["head"][1])
    u = max(1, int(h / 32))
    c.rect(hx_ - 4 * u - 1, hy_ - 3 * u, hx_ + 4 * u, hy_ - 3 * u, col)
    c.rect(hx_ - 3 * u, hy_ - 4 * u, hx_ + 3 * u, hy_ - 3 * u, col)
    c.rect(hx_ - 2 * u, hy_ - 6 * u, hx_ + 2 * u, hy_ - 4 * u, col)
    c.set(hx_ + face, hy_ - 4 * u, "#6a1810")
    if rim_col is not None:
        c.line([(hx_ - 4 * u - 1 if toward[0] < 0 else hx_ + 4 * u, hy_ - 3 * u), (hx_ - 2 * u if toward[0] < 0 else hx_ + 2 * u, hy_ - 6 * u)], rim_col)
    return (hx_, hy_), (px0 + int(f["hands"][0][0]), py0 + int(f["hands"][0][1]))


@ending("cha_end_light")
def cha_end_light(e):
    """BAD.  A Prayer Too Late: side view down a nave; the right 60% is one blown-out bleached-gold blaze, flame-edged
    (not warm: white at the heart); tongues of it already lick the floor around the kneeler.  The player kneels in the
    middle in profile, arms raised, a black cut-out against the glare, shadow thrown back toward us.  Far left,
    foreground, the Inquisitor stands dark with her back to us, a small pale report-page in hand, writing.
    Cold dark nave on the left vs gold on the right."""
    c = e.c
    VX, VY = 168, 56
    n = e.noise("wall")
    for y in range(0, 108):
        for x in range(192):
            t = clamp(0.0 + ((x / 192.0) ** 2.0) * 0.62 + (n.fbm(x * 0.06, y * 0.05, 3) - 0.5) * 0.14)
            c.set(x, y, ramp_pick(["#060810", "#0e1424", "#1c2640", "#34446a", "#6a7a9a"], t, x, y))
    glow(c, VX, VY, 80, ["#1c2640", "#5a4a30", "#c8982c", "#ffd868", "#fff4c0", "#ffffff"], power=1.05, strength=1.0, ry=66)
    c.ellipse(VX + 6, VY, 16, 32, "#ffffff")
    glow(c, VX + 6, VY, 30, ["#ffd868", "#fff4c0", "#ffffff"], power=0.9, strength=0.9, ry=48)
    # arches in the far wall, dark ribs
    for k, ax in enumerate([88, 112, 134, 152]):
        c.line([(ax, 0), (ax - 2, 108)], "#1c2640") if False else None
    # floor: reflective dark plates, a bright reflection streak under the blaze
    for y in range(VY + 6, 108):
        for x in range(192):
            t = clamp(0.05 + ((x / 192.0) ** 2.0) * 0.55 - (y - VY - 6) * 0.003)
            c.set(x, y, ramp_pick(["#0a0e1c", "#141a2c", "#26324c", "#44547a", "#9a8a58"], t, x, y))
    c.rect(0, VY + 6, 191, VY + 6, "#34446a")
    for k in range(-6, 14):
        c.line([(VX, VY + 7), (VX + (k - 4) * 60, 108)], "#141a2c")
    for dy in (14, 24, 38):
        c.rect(0, VY + 6 + dy, 191, VY + 6 + dy, "#141a2c")
    light_pool(c, 140, VY + 28, 70, 18, "#ffe080", t=0.6)
    light_pool(c, 130, VY + 24, 50, 10, "#ffffff", t=0.6)
    # a few slim pillars left and right, black cut-outs; the kneeler's backdrop between them stays open glare
    for (px_, w, top) in [(52, 8, 6), (74, 6, 12), (156, 4, 24), (172, 3, 28)]:
        c.rect(px_, top, px_ + w, 108, "#05060c")
        c.rect(px_ - 2, top - 1, px_ + w + 2, top + 1, "#05060c")
        for yy in range(top, 108):                                   # the lit edge on the blaze side
            if yy % 3:
                c.set(px_ + w + 1, yy, "#d8a83a")
    # flame tongues licking across the floor around the kneeler
    for (fx, fy, fh, fw) in [(144, VY + 32, 22, 8), (128, VY + 38, 16, 6), (150, VY + 44, 24, 9), (100, VY + 40, 9, 4), (92, VY + 44, 6, 3)]:
        _flames(c, fx, fy, fh, fw, e.seed_for("f%d" % fx), cols=("#c8641c", "#ec9a2c", "#ffd868", "#fff4c0"), n=5)
    e.protect += ["#fff4c0", "#ffd868"]
    # the kneeler, in profile, arms raised in prayer; shadow thrown back to the left toward the viewer
    me = player_fig("chaos", 46, "kneel", facing=1, lean=6)
    me["img"] = tint(me["img"], "#05060c", 0.88)
    px0, py0 = put_figure(c, me, 108, 92, rim_col="#fff4c0", toward=(1, -0.3),
                          shadow=dict(toward_light=(1, 0.2), length=2.2, squash=0.22, col="#04050a", t=0.9))
    hd = (px0 + int(me["head"][0]), py0 + int(me["head"][1]))
    c.line([(hd[0] + 1, hd[1] + 7), (hd[0] + 7, hd[1] + 1), (hd[0] + 11, hd[1] - 8)], "#05060c", 2)   # arms raised
    c.set(hd[0] + 11, hd[1] - 9, "#05060c"); c.set(hd[0] + 12, hd[1] - 9, "#05060c")
    # the Inquisitor, far left foreground, back to us, writing in a small page
    (ihx, ihy), ihand = _inq(c, 28, 104, 62, face=1, col="#05060c", rim_col="#d8a83a", toward=(1, -0.2),
                             shadow=dict(toward_light=(1, 0.1), length=0.9, squash=0.1, col="#04050a", t=0.8), thick=1.1)
    c.rect(ihand[0] + 3, ihand[1] - 3, ihand[0] + 8, ihand[1] + 2, "#e8e0c8")           # the report page
    c.rect(ihand[0] + 3, ihand[1] - 3, ihand[0] + 8, ihand[1] - 3, "#ffffff")
    particles(c, "ember", 40, (80, 6, 191, 100), seed=e.seed_for("emb"), cols=("#ffd868", "#fff4c0", "#ec9a2c"), wind=(-1, -1))
    vignette_kind(c, "bad", col="#04050a", strength=0.7)


def _candle(c, x, y, h, lit=False, wax="#d8cfa8", dark="#6a6048"):
    """candle stub standing on y (bottom), h tall; lit = tiny flame; wax drip down one side."""
    c.rect(x - 1, y - h, x + 1, y, wax)
    c.rect(x + 1, y - h, x + 1, y, dark)
    c.set(x - 1, y - h + 1, "#f0e8c8")
    if h > 3:
        c.set(x + 2, y - h + 2, wax)
        c.set(x + 2, y - h + 3, wax)
    if lit:
        c.set(x, y - h - 1, "#fff0b0"); c.set(x, y - h - 2, "#ffc060"); c.set(x, y - h - 3, "#e8802a")


@ending("cha_end_sacrifice")
def cha_end_sacrifice(e):
    """BAD.  The Doors Hold: the morning after; a low shrine hall.  Left, huge shut double doors with four thin coloured
    lights (red, green, blue, pink) leaking from the seam and the sill, fanning in stripes across the floor; the altar at
    their foot with seven candle stubs burned down, two still lit.  Right, small and warm under a hanging lantern: a
    table with one steaming bowl of soup before an empty chair with the player's coat over its back; Tikka sits opposite,
    head bowed.  Cold wrong light on the left, tender warm light bottom right."""
    c = e.c
    FL = 80
    # hall: stone wall, ceiling beams closing in at the top
    n = e.noise("wall")
    for y in range(0, FL + 1):
        for x in range(192):
            t = clamp(0.06 + y / 220.0 + (n.fbm(x * 0.05, y * 0.07, 3) - 0.5) * 0.3)
            c.set(x, y, ramp_pick(["#0a080e", "#14101a", "#221c28", "#342c3a"], t, x, y))
    for yy in range(8, FL, 9):                                    # stone courses
        c.rect(0, yy, 191, yy, "#0c0a10")
    c.rect(0, 0, 191, 7, "#080609")
    for bx in (0, 56, 120, 180):
        c.rect(bx, 0, bx + 7, 14, "#0c0810"); c.rect(bx, 14, bx + 7, 14, "#2a2230")
    # the doors: two leaves, iron straps, a bar, a pointed arch of stone round them
    DX0, DX1, DT, DB = 14, 96, 8, FL
    MX = (DX0 + DX1) // 2
    HW = (DX1 - DX0) // 2
    c.rect(DX0 - 5, DT + 22, DX1 + 5, DB, "#4a4258"); c.ellipse(MX, DT + 22, HW + 5, 20, "#4a4258")      # stone surround, round arch
    c.rect(DX0 - 5, DT + 22, DX0 - 3, DB, "#6a627a"); c.rect(DX1 + 3, DT + 22, DX1 + 5, DB, "#2e2838")
    c.rect(DX0, DT + 22, DX1, DB, "#3a2a20"); c.ellipse(MX, DT + 22, HW, 18, "#3a2a20")
    for x in range(DX0, DX1 + 1):
        if (x // 5) % 2 == 0:
            for y in range(DT + 4, DB):
                if c.get(x, y) == C("#3a2a20") or abs(c.get(x, y)[0] - 58) < 3:
                    c.set(x, y, "#2e2018")
        elif (x // 5) % 4 == 1:
            for y in range(DT + 6, DB):
                if abs(c.get(x, y)[0] - 58) < 3:
                    c.set(x, y, "#4a3628")
    for yy in (24, 46, 66):
        c.rect(DX0, yy, DX1, yy + 2, "#08060a"); c.rect(DX0, yy, DX1, yy, "#4a4258")
        for x in range(DX0 + 4, DX1, 9):
            c.set(x, yy + 1, "#6a627a")
    c.rect(DX0 + 6, 35, DX1 - 6, 38, "#0a080c"); c.rect(DX0 + 6, 35, DX1 - 6, 35, "#5a5268")   # the bar
    # the four lights: a hot vertical seam, soft halos, light along the sill
    seam = [("#ec3a2a", "#ff8a6a", -3), ("#b8e83a", "#e8ff90", -1), ("#2ab8ff", "#a8ecff", 1), ("#ff6ad0", "#ffc0ee", 3)]
    for (col, core, off) in seam:
        light_pool(c, MX + off, 44, 8, 36, col, t=0.55, power=1.2)
    for (col, core, off) in seam:
        for y in range(DT + 4, DB):
            c.set(MX + off, y, core if y % 5 else col)
    for (col, core, off) in seam:                                     # light fanning on the floor
        pass
    e.protect += ["#ff8a6a", "#d8f080", "#a8ecff", "#ffc0ee"]
    # floor: dark flags, perspective seams
    hband(c, FL, 107, ["#322a3a", "#1c1622", "#100c14", "#08060a"], seed=e.seed_for("fl"), rough=0.15)
    c.rect(0, FL, 191, FL, "#4a4258")
    for k in range(-6, 14):
        c.line([(MX + k * 3, FL + 1), (MX + k * 26 - 60, 107)], "#0c0810")
    for dy in (8, 19, 34):
        c.rect(0, FL + dy, 191, FL + dy, "#0c0810")
    for (col, core, off) in seam:                                      # the four stripes on the floor, widening toward us
        for y in range(FL + 1, 104):
            u = (y - FL) / 24.0
            cx_ = MX + off * 2.5 + off * u * 7
            w = 1.5 + u * 3.2
            for x in range(int(cx_ - w), int(cx_ + w) + 1):
                blend(c, x, y, col, 0.62 * (1 - u * 0.5), 3)
    # the altar at the door's foot: stone block, seven candle stubs, two still burning
    c.rect(26, FL - 12, 84, FL + 4, "#0c0a10"); c.rect(26, FL - 12, 84, FL - 12, "#5a5268"); c.rect(26, FL - 11, 84, FL - 10, "#2e2838")
    c.rect(22, FL + 4, 88, FL + 7, "#0c0a10"); c.rect(22, FL + 4, 88, FL + 4, "#3a3444")
    wx = [30, 38, 46, 55, 64, 72, 80]
    for k, x in enumerate(wx):
        _candle(c, x, FL - 13, [3, 6, 2, 5, 3, 7, 2][k], lit=k in (3, 5))
        c.rect(x - 2, FL - 13, x + 2, FL - 13, "#d8cfa8") if k in (1, 5) else None
    glow(c, 55, FL - 22, 10, ["#4a3010", "#c8802a", "#ffd890"], power=1.8, strength=0.45)
    glow(c, 72, FL - 24, 10, ["#4a3010", "#c8802a", "#ffd890"], power=1.8, strength=0.45)
    e.protect += ["#fff0b0", "#ffc060"]
    # right half: warm pool from a hanging lantern
    LX, LY = 140, 54
    glow(c, LX, LY + 10, 36, ["#1c1420", "#4a3020", "#a8682a", "#e8a850", "#ffdc88"], power=1.7, strength=0.8, ry=34)
    c.line([(LX, 0), (LX, LY - 5)], "#0a080c")
    c.rect(LX - 3, LY - 5, LX + 3, LY - 4, "#1a1218"); c.rect(LX - 3, LY + 3, LX + 3, LY + 4, "#1a1218")
    c.rect(LX - 2, LY - 3, LX + 2, LY + 2, "#fff0b0")
    light_pool(c, LX, 92, 60, 14, "#ffc060", t=0.5)
    light_pool(c, LX, 90, 34, 8, "#ffdc88", t=0.45)
    # the table, in profile, and its bowl of soup with steam
    TY = 90
    c.rect(106, TY, 176, TY + 2, "#5a3a22"); c.rect(106, TY, 176, TY, "#c08a50")
    c.rect(110, TY + 3, 112, 106, "#2a1a10"); c.rect(170, TY + 3, 172, 106, "#2a1a10")
    bx = 140
    c.poly([(bx - 7, TY - 6), (bx + 7, TY - 6), (bx + 5, TY - 1), (bx - 5, TY - 1)], "#a89870")
    c.rect(bx - 7, TY - 7, bx + 7, TY - 6, "#f0e4c0")
    c.rect(bx - 6, TY - 8, bx + 6, TY - 7, "#d8802a")                         # the soup, a warm surface
    c.rect(bx - 4, TY - 8, bx + 1, TY - 8, "#ffc060")
    c.rect(bx + 8, TY - 1, bx + 12, TY - 1, "#c8c0a8")                        # spoon
    sn = e.noise("steam")
    for y in range(TY - 30, TY - 6):                                           # steam rising
        for x in range(bx - 8, bx + 12):
            wv = bx + math.sin(y * 0.3) * 2.5
            if abs(x - wv) < 2.5 + (TY - 6 - y) * 0.08 and sn.fbm(x * 0.4, y * 0.3, 2) > 0.4:
                blend(c, x, y, "#fff0d0", 0.42 - (TY - 6 - y) * 0.012, 3)
    # the empty chair (left of the table) with the player's coat over its back
    CX = 100
    c.rect(CX - 4, 62, CX - 2, 104, "#2a1a10"); c.rect(CX - 4, 62, CX - 4, 104, "#6a4a30")
    c.rect(CX - 4, 88, CX + 8, 90, "#3a2418"); c.rect(CX - 4, 88, CX + 8, 88, "#8a6038")
    c.rect(CX + 6, 90, CX + 8, 104, "#2a1a10")
    for yy in (66, 72, 78):
        c.rect(CX - 4, yy, CX - 2, yy + 1, "#4a3020")
    c.poly([(CX - 6, 64), (CX + 3, 64), (CX + 5, 90), (CX - 3, 92), (CX - 7, 80)], "#5a4a3a")       # coat
    c.poly([(CX - 6, 64), (CX + 3, 64), (CX + 3, 69), (CX - 6, 69)], "#6a5a46")
    c.line([(CX - 6, 74), (CX + 4, 74)], "#a03a2a", 2)                                                # the red band
    c.line([(CX + 3, 66), (CX + 5, 88)], "#3a2c20")
    # Tikka opposite: seated on a stool, head bowed, hood, facing the empty place
    tk = fig(36, "sit", "#1c1210", facing=-1, lean=22, hood=True)
    tx0, ty0 = put_figure(c, tk, 160, 96, rim_col="#ffc060", toward=(-1, -0.6))
    c.rect(150, 92, 168, 93, "#2a1a10")
    c.rect(152, 94, 153, 106, "#2a1a10"); c.rect(166, 94, 167, 106, "#2a1a10")
    hd = (tx0 + int(tk["hands"][0][0]), ty0 + int(tk["hands"][0][1]))
    c.set(hd[0], hd[1], "#d8b080"); c.set(hd[0] - 1, hd[1], "#d8b080")
    particles(c, "mote", 20, (96, 30, 190, 100), seed=e.seed_for("mt"), cols=("#ffdc88", "#fff0c8"))
    vignette_kind(c, "bad", col="#06040a", strength=0.55)


def _ghost(c, img, x, y, edge, fill, t=0.3):
    """draw a figure image as a hollow shell: a 1 px bright edge, the inside only faintly tinted (the background shows
    through).  (x, y) = top-left."""
    src = img.load()
    for j in range(img.height):
        for i in range(img.width):
            if src[i, j][3] < 128:
                continue
            nb = [(i + 1, j), (i - 1, j), (i, j + 1), (i, j - 1)]
            on_edge = any(not (0 <= a < img.width and 0 <= b < img.height) or src[a, b][3] < 128 for a, b in nb)
            if on_edge:
                c.set(x + i, y + j, edge)
            else:
                blend(c, x + i, y + j, fill, t, 3)


def _sitter(s, col, face=1, lean=0.04, reach=0.36):
    """a person seated at a table, in profile: RGBA image, s = px per world unit (seated height ~1.3 units).
    Returns (img, (feet_x, feet_y), (head_x, head_y)); facing right unless face=-1."""
    ss = 4
    Wd, Hd = int(s * 1.9) * ss, int(s * 1.6) * ss
    from PIL import ImageDraw
    big = Image.new("L", (Wd, Hd), 0)
    d = ImageDraw.Draw(big)
    ox, oy = Wd * 0.3, Hd * 0.95

    def T(x, y):
        return (ox + x * s * ss, oy - y * s * ss)

    def seg(a, b, w):
        d.line([T(*a), T(*b)], fill=255, width=max(1, int(w * s * ss)))
        r = w * s * ss / 2
        for q in (T(*a), T(*b)):
            d.ellipse([q[0] - r, q[1] - r, q[0] + r, q[1] + r], fill=255)
    seg((0, 0.52), (0.52, 0.52), 0.17)               # thigh
    seg((0.52, 0.52), (0.54, 0.02), 0.14)            # shin
    seg((0.54, 0.03), (0.68, 0.03), 0.09)            # foot
    seg((0.0, 0.55), (lean, 1.05), 0.34)             # torso
    seg((lean, 1.08), (lean + 0.01, 1.14), 0.12)     # neck
    hx, hy = T(lean + 0.05, 1.27)
    r = 0.125 * s * ss
    d.ellipse([hx - r, hy - r, hx + r, hy + r], fill=255)
    seg((lean, 1.0), (lean + reach * 0.55, 0.9), 0.1)      # upper arm
    seg((lean + reach * 0.55, 0.9), (lean + reach, 0.84), 0.085)
    small = big.resize((Wd // ss, Hd // ss), Image.BOX).point(lambda v: 255 if v >= 110 else 0)
    bb = small.getbbox() or (0, 0, 1, 1)
    small = small.crop(bb)
    out = Image.new("RGBA", small.size, (0, 0, 0, 0))
    out.paste(Image.new("RGBA", small.size, C(col) + (255,)), (0, 0), small)
    feet = (ox / ss - bb[0] + 0.54 * s, oy / ss - bb[1])
    head = (hx / ss - bb[0], hy / ss - bb[1])
    if face < 0:
        out = out.transpose(Image.FLIP_LEFT_RIGHT)
        feet = (out.width - 1 - feet[0], feet[1])
        head = (out.width - 1 - head[0], head[1])
    return out, feet, head


@ending("cha_end_claim_slaanesh")
def cha_end_claim_slaanesh(e):
    """BAD.  The Taste of Nothing: a banquet hall in true one-point perspective; the table runs from the right foreground
    to a far silver-magenta glare at the vanishing point.  Guests sit along both sides as pale lilac cut-outs.  Near the
    viewer the colour has drained out of everything: the plates and food in front of the player are grey, and the player
    (left foreground, profile, seated beside the table) is a hollow shell, his one colour a red coat-band.  Far down the
    table plates and chandeliers are still lush pink and gold.  Diagonal composition, bright mass at the vanishing point."""
    c = e.c
    VX, VY, F = 132, 50, 120.0
    CAMY = 1.4

    def pj(X, Y, Z):
        k = F / Z
        return (VX + X * k, VY + (CAMY - Y) * k, k)
    # hall shell: ceiling, walls, floor as gradients toward the glare
    for y in range(0, 108):
        for x in range(192):
            d = math.hypot((x - VX) / 190.0, (y - VY) / 64.0)
            if y < VY:
                t = clamp(0.06 + (1 - d) * 0.5)
                c.set(x, y, ramp_pick(["#08040e", "#14081e", "#2a1440", "#5a3478", "#a870b8"], t, x, y))
            else:
                t = clamp(0.06 + (1 - d) * 0.5)
                c.set(x, y, ramp_pick(["#08040e", "#14081e", "#2a1440", "#5a3478", "#b890c8"], t, x, y))
    glow(c, VX, VY, 50, ["#2a1440", "#7a2a9a", "#c850c8", "#ff8ad8", "#fbe8fa", "#ffffff"], power=1.2, strength=1.0, ry=42)
    c.ellipse(VX, VY, 5, 9, "#ffffff")
    # pillars along both walls: tall dark slabs with a lit inner edge
    for Z in (4.2, 6.0, 8.5, 12.0, 17.0, 24.0, 34.0):
        for side in (-1, 1):
            x0, ytop, k = pj(side * 5.2, 6.0, Z)
            x1, ybot, _ = pj(side * 5.2, 0.0, Z)
            w = max(1, int(0.55 * k))
            xa, xb = (int(x0 - w), int(x0)) if side > 0 else (int(x0), int(x0 + w))
            c.rect(xa, int(max(-4, ytop)), xb, int(ybot), "#0e0618" if Z > 7 else "#08040e")
            c.rect(xb if side < 0 else xa, int(max(0, ytop)), xb if side < 0 else xa, int(ybot), "#9a6ab8" if Z > 7 else "#6a3a88")
    # floor lines: tiles toward the glare
    for X in range(-12, 13, 2):
        c.line([pj(X, 0, 40)[:2], pj(X, 0, 2.6)[:2]], "#1c0c2c")
    for Z in (3, 4, 5.5, 8, 12, 18, 28):
        y = pj(0, 0, Z)[1]
        c.rect(0, int(y), 191, int(y), "#1c0c2c")
    # chandeliers: strings of crystal from the vault, lit, getting smaller toward the glare
    for Z in (5.0, 8.0, 12.5, 19.0, 30.0):
        x, y, k = pj(0.0, 4.6, Z)
        yt = pj(0.0, 8.0, Z)[1]
        c.line([(x, max(0, yt)), (x, y)], "#8a7ab0")
        for q in range(-2, 3):
            c.line([(x, y), (x + q * 0.55 * k, y + 0.6 * k)], "#cfc4e8")
            c.set(x + q * 0.55 * k, y + 0.6 * k, "#ffffff")
        glow(c, x, y + 0.2 * k, max(4, int(1.8 * k)), ["#5a1a80", "#c850c8", "#ff8ad8", "#fff0fc"], power=1.7, strength=0.55)
    # the table: cloth surface from Z=2.2 to the glare, grey near / lush far
    TY, HW = 0.78, 1.0
    z_near = 2.3
    for Z10 in range(int(z_near * 10), 600, 1):
        Z = Z10 / 10.0
        xl, y, k = pj(-HW, TY, Z)
        xr, _, _ = pj(HW, TY, Z)
        y = int(y)
        far = clamp((Z - 3.5) / 14.0)
        for x in range(int(xl), int(xr) + 1):
            if 0 <= x < 192 and 0 <= y < 108:
                u = (x - xl) / max(1.0, xr - xl)
                t = clamp(0.35 + 0.12 * math.sin(u * 7.0) + (0.3 if Z > 20 else 0.1))
                if far < 0.35:
                    cc = ramp_pick(["#4a4458", "#7a7490", "#a8a2b8", "#d0cadc"], t, x, y)
                else:
                    cc = ramp_pick(["#6a3a80", "#c850c8", "#ff8ad8", "#fbe8fa"], t, x, y)
                c.set(x, int(y), cc)
    # cloth hanging over the near end and the long sides
    xl, yl, kl = pj(-HW, TY, z_near)
    xr, yr, kr = pj(HW, TY, z_near)
    c.poly([(xl, yl), (xr, yr), (xr, yr + 0.34 * kr), (xl, yl + 0.34 * kl)], "#3a344a")
    for xx in range(int(xl), int(xr) + 1, 3):                                          # cloth folds
        c.line([(xx, yl), (xx, yl + 0.34 * kl)], "#4e4862" if (xx // 3) % 2 else "#2a2438")
    c.line([(xl, yl + 0.34 * kl), (xr, yr + 0.34 * kr)], "#14081e")
    c.line([(xl, yl), (xr, yr)], "#f0e8f8")
    c.line([pj(-HW, TY, 2.3)[:2], pj(-HW, TY, 60)[:2]], "#fbe8fa")
    # items on the table: far to near; colour drains as Z falls
    rr = e.rng("items")
    for Z in [60 / (1.0 + n_ * 0.22) for n_ in range(0, 28)]:
        if Z < 2.8:
            continue
        for X in (-0.55, 0.0, 0.55):
            x, y, k = pj(X + rr.uniform(-0.1, 0.1), TY, Z)
            r = max(1, int(0.30 * k))
            lush = Z > 9.5
            body, hi, dk = (rr.choice([("#ff8ad8", "#fff0fc", "#7a2a9a"), ("#f0b840", "#fff0b0", "#8a5a1a"), ("#c850c8", "#ff8ad8", "#4a1670")])
                            if lush else ("#9a94a8", "#d8d4e0", "#3a3448"))
            c.ellipse(int(x), int(y), r + 1, max(1, r // 2 + 1), dk)
            c.ellipse(int(x), int(y) - 1, r, max(1, r // 2), body)
            if r >= 2:
                c.set(int(x) - r // 2, int(y) - 1 - r // 3, hi)
            if lush and r >= 2 and rr.random() < 0.5:                   # a goblet
                c.line([(x + r + 1, y - 1), (x + r + 1, y - 0.5 * k * 0.3 - 1)], "#fbe8fa")
    e.protect += ["#fff0fc", "#ffffff", "#ffc0ee"]
    # guests: pale lilac cut-outs along both sides, faceless
    for Z in sorted([4.6, 6.5, 8.8, 12.0, 16.5, 23.0, 32.0], reverse=True):
        for (X, face) in ((-1.75, 1), (1.75, -1)):
            x, y, k = pj(X, 0.0, Z)
            img, feet, head = _sitter(k, "#a090c0" if Z > 10 else "#c8b8e4", face=face)
            ph = place(c, rim(img, "#fbe8fa", (1, -0.6) if X < 0 else (-1, -0.6)), x, y, anchor="bm")
    # the player, left foreground, beside the table, a hollow shell
    x, y, k = pj(-1.7, 0.0, 3.2)
    img, feet, head = _sitter(k, "#d8c8e8", face=1, lean=0.08, reach=0.5)
    px0, py0 = int(x - feet[0]), int(y - feet[1])
    # a chair-back behind him and his own shadow pool
    light_pool(c, x + 4, y, 26, 4, "#08040e", t=0.7)
    seat = int(y - 0.44 * k)
    c.rect(px0 - 3, seat - int(1.0 * k), px0, int(y), "#1c0c2c"); c.rect(px0 - 3, seat - int(1.0 * k), px0 - 3, int(y), "#7a4a98")   # chair back
    c.rect(px0 - 3, seat, px0 + int(0.66 * k), seat + 2, "#1c0c2c"); c.rect(px0 - 3, seat, px0 + int(0.66 * k), seat, "#9a6ab8")   # seat
    c.rect(px0 + int(0.62 * k), seat, px0 + int(0.66 * k), int(y), "#1c0c2c")
    _ghost(c, img, px0, py0, "#fbe8fa", "#e8e0f4", t=0.2)
    c.rect(px0 + int(head[0]) - 5, py0 + int(head[1]) + 6, px0 + int(head[0]) - 1, py0 + int(head[1]) + 8, "#d8402a")   # the one colour left
    # his plate: grey, full; he does not reach for it
    pxp, pyp, kp = pj(-0.45, TY, 2.9)
    c.ellipse(int(pxp), int(pyp), 11, 3, "#2a2438"); c.ellipse(int(pxp), int(pyp) - 1, 10, 3, "#9a94a8"); c.ellipse(int(pxp), int(pyp) - 2, 6, 2, "#d0ccdc")
    particles(c, "petal", 26, (0, 0, 191, 100), seed=e.seed_for("pt"), cols=("#ff8ad8", "#c8c4d4", "#e070d8"))
    vignette_kind(c, "bad", col="#08040e", strength=0.68)


def _drape(c, x0, x1, y0, y1, ramp, seed, fold=5):
    """hanging velvet: vertical folds, each a light-to-dark band, hem scalloped at y1."""
    rr = random.Random(seed)
    for x in range(x0, x1 + 1):
        ph = (x - x0) / float(fold)
        base = 0.5 + 0.5 * math.sin(ph * math.pi * 0.9 + math.sin(ph * 0.7) * 1.5)
        for y in range(y0, y1 + 1):
            t = clamp(base * 0.75 + 0.05 + (y - y0) / float(max(1, y1 - y0)) * -0.1)
            c.set(x, y, ramp_pick(ramp, t, x, y))
    for x in range(x0, x1 + 1):
        hem = y1 - int(2 + 2 * math.sin((x - x0) * 0.5 + rr.random()))
        c.set(x, hem, ramp[0])


@ending("cha_end_feast")
def cha_end_feast(e):
    """BAD.  The Endless Feast: frontal view across a banquet table.  The player sits behind it left of centre with a
    perfect, fixed grin, plate piled high; around him candelabras whose wax has run into huge stalagmites (time).  Right,
    a tall arched window full of star trails and a faint sun-arc: a thousand years outside, cold blue light on the
    table.  Left, heavy plum drapery has swallowed the wall; only the upper half of the forgotten door shows, webbed.
    Dusty plum and tarnished gold; warm candles vs cold sky."""
    c = e.c
    WALL = 74
    # panelled wall
    n = e.noise("wall")
    for y in range(0, WALL + 1):
        for x in range(192):
            t = clamp(0.12 + y / 190.0 + (n.fbm(x * 0.05, y * 0.06, 3) - 0.5) * 0.25)
            c.set(x, y, ramp_pick(["#0c0614", "#1a0e28", "#2e1a40", "#4a2a58"], t, x, y))
    for px_ in range(8, 192, 22):                                   # gilt pilasters
        c.rect(px_, 0, px_ + 2, WALL, "#14081e"); c.rect(px_, 0, px_, WALL, "#8a6a3a")
    c.rect(0, 5, 191, 6, "#14081e"); c.rect(0, 5, 191, 5, "#8a6a3a")
    light_pool(c, 76, 38, 56, 44, "#a8682a", t=0.55)              # candlelight halo behind the host
    light_pool(c, 76, 44, 26, 26, "#ffc060", t=0.35)
    # the window: tall round-headed, star trails around a pole low below it; a faint sun arc
    WX0, WX1, WB = 120, 180, 66
    cxw = (WX0 + WX1) // 2
    HWd = (WX1 - WX0) // 2
    WC = 6 + HWd                                                  # arch centre
    for y in range(6, WB + 1):
        for x in range(WX0, WX1 + 1):
            if y < WC and ((x - cxw) ** 2 + (y - WC) ** 2) > HWd ** 2:
                continue
            t = clamp(0.05 + (y - 6) / 90.0)
            c.set(x, y, ramp_pick(["#04061a", "#0a1240", "#142468", "#26408a"], t, x, y))
    PX, PY = 150, 98
    rs = e.rng("trails")
    for _ in range(22):
        r = rs.uniform(22, 72)
        a0 = rs.uniform(205, 300)
        ln = rs.uniform(35, 62)
        col = rs.choice(["#cfe0ff", "#ffffff", "#9ab8ff"])
        for q in range(int(ln)):
            a = math.radians(a0 + q)
            xx, yy = int(PX + math.cos(a) * r), int(PY + math.sin(a) * r)
            if WX0 + 1 < xx < WX1 - 1 and 6 < yy < WB and (yy >= WC or ((xx - cxw) ** 2 + (yy - WC) ** 2) <= (HWd - 1) ** 2):
                blend(c, xx, yy, col, 0.35 + 0.65 * (q / ln), 3)
    for q in range(0, 110):                                          # a faint broad sun-arc
        a = math.radians(214 + q)
        xx, yy = int(PX + math.cos(a) * 56), int(PY + math.sin(a) * 56)
        for dy in range(-1, 2):
            if WX0 + 1 < xx < WX1 - 1 and 6 < yy + dy < WB and (yy + dy >= WC or ((xx - cxw) ** 2 + (yy + dy - WC) ** 2) <= (HWd - 1) ** 2):
                blend(c, xx, yy + dy, "#e8a860", 0.55, 3)
    for y in range(6, WB + 3):                                       # frame, following the arch
        for x in range(WX0 - 3, WX1 + 4):
            if y < WC:
                d = math.hypot(x - cxw, y - WC)
                if HWd < d <= HWd + 1.6:
                    c.set(x, y, "#8a6a3a")
                elif HWd + 1.6 < d <= HWd + 3.2:
                    c.set(x, y, "#14081e")
            else:
                if x in (WX0 - 1, WX1 + 1):
                    c.set(x, y, "#8a6a3a")
                elif x in (WX0 - 2, WX0 - 3, WX1 + 2, WX1 + 3):
                    c.set(x, y, "#14081e")
    c.rect(WX0 - 3, WB + 1, WX1 + 3, WB + 3, "#14081e"); c.rect(WX0 - 3, WB + 1, WX1 + 3, WB + 1, "#8a6a3a")
    c.rect(cxw, 6, cxw, WB, "#14081e")
    # the forgotten door: its upper half only, small, webbed; the drapery has swallowed the rest of the wall
    DXa, DXb = 22, 42
    _drape(c, 0, 54, 0, WALL, ["#1a0620", "#3a0e48", "#6a1e70", "#9a3a98"], e.seed_for("dr"), fold=6)
    for y in range(24, 49):
        for x in range(DXa, DXb + 1):
            if y < 34 and ((x - (DXa + DXb) / 2.0) ** 2 + (y - 34) ** 2) > ((DXb - DXa) / 2.0) ** 2:
                continue
            c.set(x, y, "#2a1a14" if (x // 4) % 2 else "#201410")
    c.rect(DXa - 1, 34, DXa - 1, 49, "#8a6a3a"); c.rect(DXb + 1, 34, DXb + 1, 49, "#4a3a2a")
    c.rect(DXb - 4, 40, DXb - 3, 41, "#c8a050")                                          # a handle nobody turns
    for (a, b, c2, d_) in [(DXa, 26, DXa + 11, 40), (DXa, 40, DXa + 12, 26), (DXb, 32, DXa + 6, 47), (DXa + 2, 30, DXb - 2, 44)]:
        c.line([(a, b), (c2, d_)], "#c8c0d8")                                             # cobwebs
    # table: top plane, then the cloth falling to the floor
    me = player_fig("chaos", 76, "stand", facing=1)
    me["img"] = tint(me["img"], "#2a1a22", 0.25)
    px0, py0 = put_figure(c, me, 74, WALL + 32, rim_col="#ffc060", toward=(-1, -0.4))
    hx_, hy_ = px0 + int(me["head"][0]), py0 + int(me["head"][1])
    for y in range(WALL, 108):
        for x in range(192):
            t = clamp(0.5 - (y - WALL) / 70.0 + (0.25 if y < WALL + 5 else 0))
            c.set(x, y, ramp_pick(["#0c0614", "#1a0e28", "#3a2448", "#6a4a78", "#a89ab8"], t, x, y))
    c.rect(0, WALL, 191, WALL + 1, "#c8b8d8"); c.rect(0, WALL + 2, 191, WALL + 2, "#7a6a90")
    for x in range(0, 192, 4):                                      # cloth folds
        c.line([(x, WALL + 3), (x + int(math.sin(x * 0.4) * 2), 108)], "#1c1030" if (x // 4) % 2 else "#2e2040")
    light_pool(c, 150, WALL + 6, 50, 5, "#6a8ad8", t=0.5)
    light_pool(c, 76, WALL + 1, 60, 6, "#ffc060", t=0.45)
    for dx in (-3, 3):                                               # the grin: one wide line with corners up
        c.set(hx_ + dx + 1, hy_ + 2, "#fbe8d8")
    c.rect(hx_ - 2, hy_ + 3, hx_ + 4, hy_ + 3, "#fbe8d8")
    c.set(hx_ - 1, hy_ - 1, "#fbe8d8"); c.set(hx_ + 3, hy_ - 1, "#fbe8d8")
    e.protect += ["#fbe8d8"]
    # things on the table: plates with tall heaps in front of him, goblets
    for (x, h, w) in [(62, 9, 10), (88, 7, 8)]:
        c.ellipse(x, WALL + 1, w, 3, "#e8e0f0")
        c.ellipse(x, WALL, w - 1, 2, "#c8b8d8")
        c.poly([(x - w + 2, WALL), (x, WALL - h), (x + w - 2, WALL)], "#b8862a")
        c.poly([(x - 2, WALL - h + 2), (x, WALL - h - 3), (x + 2, WALL - h + 2)], "#ff8ad8")
        for q in range(4):
            c.set(x - w // 2 + q * 3, WALL - 2 - q % 3, "#ffe090")
    for (x, h) in [(104, 12), (42, 10)]:
        c.rect(x, WALL - h, x + 1, WALL - 3, "#c8b8d8"); c.rect(x - 2, WALL - h - 3, x + 3, WALL - h, "#e070d8")
        c.rect(x - 2, WALL - h - 3, x + 3, WALL - h - 3, "#fbe8fa")
    # candelabras: the wax run down into great stalagmites
    for (cx_, hgt) in [(22, 24), (124, 20), (176, 26)]:
        light_pool(c, cx_, WALL - hgt - 2, 16, 16, "#ffc060", t=0.5)
        c.rect(cx_ - 1, WALL - hgt, cx_ + 1, WALL, "#8a6a3a")
        c.poly([(cx_ - 9, WALL), (cx_ - 5, WALL - 7), (cx_ + 5, WALL - 7), (cx_ + 9, WALL)], "#d8cfa8")          # the wax pile
        c.line([(cx_ - 5, WALL - 7), (cx_ - 7, WALL - 2)], "#f0e8c8"); c.line([(cx_ + 2, WALL - 7), (cx_ + 4, WALL - 1)], "#a89870")
        for q in (-6, -3, 0, 3, 6):
            yy = WALL - hgt - (2 if q in (-6, 6) else 0)
            c.rect(cx_ + q, yy, cx_ + q, yy + 4, "#d8cfa8")
            c.set(cx_ + q, yy - 1, "#fff0b0"); c.set(cx_ + q, yy - 2, "#ffc060")
        c.line([(cx_ - 6, WALL - hgt + 4), (cx_ + 6, WALL - hgt + 4)], "#8a6a3a")
        c.line([(cx_ + 5, WALL - hgt + 5), (cx_ + 7, WALL - 8)], "#e8e0c8")                                      # drips
    e.protect += ["#fff0b0", "#ffc060"]
    particles(c, "mote", 34, (0, 0, 191, 100), seed=e.seed_for("mt"), cols=("#ffd890", "#c8b8d8", "#9ab8ff"))
    vignette_kind(c, "bad", col="#08040e", strength=0.6)


def _pictogram(c, kind, x, y, ink="#1a2a8a", acc="#e83aa8"):
    """tiny 7x7 icon centred on x,y for a script panel (no lettering): door / key / crown / flame / eye / star / tower."""
    if kind == "door":
        c.rect(x - 2, y - 3, x + 2, y + 3, ink); c.rect(x - 1, y - 2, x + 1, y + 3, "#d8e8f8"); c.set(x + 1, y + 1, acc)
    elif kind == "key":
        c.ellipse(x - 2, y, 2, 2, ink); c.rect(x, y, x + 4, y, ink); c.set(x + 3, y + 1, ink); c.set(x + 4, y + 1, ink)
    elif kind == "crown":
        c.rect(x - 3, y + 1, x + 3, y + 2, ink); c.set(x - 3, y, ink); c.set(x, y - 1, ink); c.set(x + 3, y, ink); c.set(x, y + 0, ink)
    elif kind == "flame":
        c.poly([(x - 2, y + 3), (x, y - 3), (x + 2, y + 3)], ink); c.set(x, y + 1, acc)
    elif kind == "eye":
        c.line([(x - 4, y), (x, y - 2), (x + 4, y), (x, y + 2), (x - 4, y)], ink); c.set(x, y, acc)
    elif kind == "star":
        for dx, dy in [(-2, -2), (2, -2), (-2, 2), (2, 2), (0, 0), (-1, -1), (1, -1), (-1, 1), (1, 1)]:
            c.set(x + dx, y + dy, ink)
    elif kind == "tower":
        c.rect(x - 2, y - 3, x + 2, y + 3, ink); c.rect(x - 3, y - 4, x + 3, y - 3, ink); c.set(x, y, "#d8e8f8")


@ending("cha_end_claim_tzeentch")
def cha_end_claim_tzeentch(e):
    """BAD.  The Last Page: a monumental script hangs from the dark, its panels all pictograms, a pink thread of
    'plan' snaking down through them; the bottom panel, bright and pink-ruled, shows one figure raising a blade behind
    another.  The player stands small at the left, reading it, a bundle of taut pink strings running from his head,
    hands and shoulders up out of frame.  Scraps of crossed-out pages litter the floor.  Cold blue, pink; page at right,
    figure dark at left."""
    c = e.c
    sky(c, ["#05030c", "#070a3a", "#0c1a6a", "#1a3a98"], 0, 100)
    clouds(c, e.seed_for("cl"), ["#05030c", "#070a3a", "#0c1a6a"], 0, 100, scale=0.045, thresh=0.5, stretch=2.4)
    stars(c, e.seed_for("st"), 30, 0, 90, cols=("#9af6ff", "#ffffff"))
    # floor: dark glassy plane that mirrors the page glow
    FL = 94
    hband(c, FL, 107, ["#1a46b0", "#0c1a6a", "#070a3a", "#05030c"], seed=e.seed_for("fl"), rough=0.1)
    c.rect(0, FL, 191, FL, "#9af6ff")
    # the page
    PX0, PX1, PT, PB = 100, 164, 0, 88
    glow(c, (PX0 + PX1) // 2, 48, 60, ["#0a1260", "#1a3aa8", "#4ab0f8", "#9af6ff"], power=1.6, strength=0.45, ry=54)
    c.rect(PX0 - 5, 0, PX1 + 5, 2, "#05030c"); c.rect(PX0 - 5, 2, PX1 + 5, 2, "#9af6ff")                 # the rod
    for tx in (PX0 - 4, PX1 + 4):
        c.line([(tx, 2), (tx, 9)], "#e83aa8"); c.set(tx, 10, "#e83aa8")
    for y in range(3, PB + 1):
        for x in range(PX0, PX1 + 1):
            u = (x - PX0) / float(PX1 - PX0)
            t = clamp(0.62 + 0.25 * math.sin(u * math.pi) - (y / PB) * 0.1)
            c.set(x, y, ramp_pick(["#3a5a98", "#6a8ac8", "#a8c4ec", "#d8e8fa"], t, x, y))
    # the curl at the bottom: a rolled edge
    c.rect(PX0 - 2, PB, PX1 + 2, PB + 5, "#a8c4ec"); c.rect(PX0 - 2, PB, PX1 + 2, PB, "#f4fbff"); c.rect(PX0 - 2, PB + 3, PX1 + 2, PB + 5, "#6a8ac8")
    c.rect(PX0 - 3, PB, PX0 - 3, PB + 5, "#4a6aa8"); c.rect(PX1 + 3, PB, PX1 + 3, PB + 5, "#4a6aa8")
    # panels: 2 columns x 5 rows of pictograms, then the big last panel
    icons = ["door", "key", "crown", "flame", "eye", "star", "tower", "door", "key", "flame"]
    cells = []
    for r in range(5):
        for col in range(2):
            x0 = PX0 + 4 + col * 30
            y0 = 8 + r * 13
            cells.append((x0, y0))
    for k, (x0, y0) in enumerate(cells):
        c.rect(x0, y0, x0 + 26, y0 + 10, "#1a2a8a"); c.rect(x0 + 1, y0 + 1, x0 + 25, y0 + 9, "#c8dcf4")
        _pictogram(c, icons[k], x0 + 13, y0 + 5)
        c.rect(x0 + 22, y0 + 2, x0 + 23, y0 + 3, "#e83aa8")                                              # 'done' dot
    # the thread of the plan: a pink snake through the panels, ending at the last panel
    pts = []
    for r in range(5):
        a, b = (cells[r * 2][0] + 13, cells[r * 2 + 1][0] + 13)
        y = cells[r * 2][1] + 5
        pts += [(a, y), (b, y)] if r % 2 == 0 else [(b, y), (a, y)]
    pts.append((pts[-1][0], 76))
    c.line(pts, "#e83aa8")
    # the last panel: bright, ruled in pink; one figure raising a blade behind another
    LX0, LY0, LX1, LY1 = PX0 + 4, 71, PX1 - 4, 86
    c.rect(LX0 - 1, LY0 - 1, LX1 + 1, LY1 + 1, "#e83aa8")
    c.rect(LX0, LY0, LX1, LY1, "#0a1260")
    glow(c, (LX0 + LX1) // 2, LY0 + 6, 18, ["#0a1260", "#1a5ad8", "#9af6ff"], power=1.4, strength=0.6, ry=8)
    mx = (LX0 + LX1) // 2
    c.ellipse(mx - 8, LY0 + 4, 2, 2, "#05030c"); c.rect(mx - 11, LY0 + 6, mx - 5, LY1, "#05030c")             # the one behind, dark, tall
    c.line([(mx - 5, LY0 + 8), (mx - 1, LY0 + 5)], "#05030c", 2)                                         # the reaching arm
    c.line([(mx - 1, LY0 + 4), (mx + 2, LY0 + 9)], "#9af6ff"); c.set(mx + 2, LY0 + 9, "#ffffff"); c.set(mx - 1, LY0 + 3, "#ffffff")   # the blade, pointing at his back
    c.ellipse(mx + 5, LY0 + 6, 2, 2, "#ff8ad8"); c.rect(mx + 2, LY0 + 8, mx + 8, LY1, "#ff8ad8")             # the one in front, pink, turned away
    e.protect += ["#ffffff", "#ff8ad8"]
    # reflection of the page on the floor
    for y in range(FL + 1, 108):
        for x in range(PX0 + 3, PX1 - 2):
            if (x + y) % 2 == 0 and (y - FL) < 10:
                blend(c, x, y, "#d8e8fa", 0.45 - (y - FL) * 0.04, 3)
    light_pool(c, 132, 100, 60, 7, "#9af6ff", t=0.45)
    # crossed-out scraps on the floor
    rs = e.rng("scraps")
    for k in range(9):
        sx = rs.randint(70, 188) if k > 2 else rs.randint(70, 100)
        sy = rs.randint(FL + 4, 104)
        c.rect(sx, sy, sx + 5, sy + 3, "#cfe0f4"); c.line([(sx, sy + 3), (sx + 5, sy)], "#e83aa8")
    # the player at left: small, reading; strings from head, hands and shoulders up out of frame
    me = player_fig("chaos", 48, "stand", facing=1)
    me["img"] = tint(me["img"], "#05030c", 0.7)
    px0, py0 = put_figure(c, me, 52, 98, rim_col="#9af6ff", toward=(1, -0.5),
                          shadow=dict(toward_light=(1, 0.3), length=1.4, squash=0.2, col="#03020a", t=0.8))
    hx_, hy_ = px0 + int(me["head"][0]), py0 + int(me["head"][1])
    h0 = (px0 + int(me["hands"][0][0]), py0 + int(me["hands"][0][1]))
    h1 = (px0 + int(me["hands"][1][0]), py0 + int(me["hands"][1][1]))
    top_x = 46
    for k, (sx_, sy_) in enumerate([(hx_, hy_ - 7), (hx_ - 3, hy_ + 7), (hx_ + 5, hy_ + 7), h0, h1, (px0 + int(me["feet"][0]), py0 + int(me["feet"][1]) - 12)]):
        c.line([(sx_, sy_), (top_x + (k - 2) * 7, -2)], "#ff6ac8" if k % 2 == 0 else "#e83aa8")
    c.set(hx_ + 1, hy_ - 1, "#9af6ff")
    particles(c, "mote", 30, (0, 0, 191, 100), seed=e.seed_for("mt"), cols=("#9af6ff", "#ffffff", "#e83aa8"))
    vignette_kind(c, "bad", col="#05030c", strength=0.65)


@ending("cha_death_hp")
def cha_death_hp(e):
    """DEATH.  The Sump's Rule: a low underhive passage at night.  A barrel fire at the far right lights a rust-orange wall;
    between it and the viewer three scavengers go through the dead player's things -- one holds up a pair of shoes at the
    feet, one prises a weapon from the hand, one is already walking off with a bundle.  The body lies in the shallows,
    bare-footed, his coat band the only colour.  High in the smog, upper left, four dim coloured lights drift away.
    Black, rust, a little fire."""
    c = e.c
    FL = 58
    n = e.noise("wall")
    for y in range(FL + 1):
        for x in range(192):
            t = clamp(0.03 + y / 200.0 + ((x / 192.0) ** 1.6) * 0.5 + (n.fbm(x * 0.05, y * 0.07, 3) - 0.5) * 0.25)
            c.set(x, y, ramp_pick(["#040306", "#100c0e", "#2a1c16", "#5a3a26", "#8a5a30"], t, x, y))
    glow(c, 172, 56, 96, ["#100c0e", "#3a2014", "#8a4a1c", "#d8802a", "#ffc060"], power=1.5, strength=0.65, ry=56)
    # pipes, a dead lamp, drips
    for (px_, w) in [(8, 5), (40, 3), (72, 4), (118, 3), (150, 4)]:
        c.rect(px_, 0, px_ + w, FL, "#07060a"); c.rect(px_ + w, 0, px_ + w, FL, "#8a5a38")
        for yy in range(8, FL, 13):
            c.rect(px_ - 1, yy, px_ + w + 1, yy + 1, "#0c0a0e")
    c.rect(0, 20, 191, 23, "#07060a"); c.rect(0, 20, 191, 20, "#6a4430")
    for k in range(4):
        c.set(22 + k * 41, 24 + (k * 7) % 11, "#7a7ab0")
    # the four lights drifting away: tiny, dim, each with a short fading trail up-left
    for k, (col, tr) in enumerate([("#ec3a2a", "#6a1a14"), ("#9ac838", "#34480e"), ("#2ab8ff", "#12406a"), ("#ff6ad0", "#6a2a58")]):
        lx, ly = 22 + k * 12, 12 - (k % 2) * 4
        for q in range(1, 9):
            blend(c, lx + q * 2, ly + q, tr, 0.9 - q * 0.1, 3)
        c.set(lx, ly, col); c.set(lx + 1, ly, col)
    e.protect += ["#ec3a2a", "#9ac838", "#2ab8ff", "#ff6ad0"]
    # the floor: black wet plating, rust where the fire catches it
    hband(c, FL, 107, ["#6a4430", "#3a2418", "#1a120e", "#07060a"], seed=e.seed_for("fl"), rough=0.2)
    c.rect(0, FL, 191, FL, "#8a5a38")
    FX, FY = 172, 84
    light_pool(c, FX - 26, 88, 120, 24, "#e0802a", t=0.62)
    light_pool(c, FX - 8, 84, 54, 12, "#ffc060", t=0.5)
    light_pool(c, 64, 94, 56, 8, "#c8782a", t=0.4)
    for y in range(FL + 1, 107):                                      # ripple streaks, fire reflected
        for x in range(FX - 90, FX + 14):
            if (x * 5 + y * 3) % 13 == 0 and x < 190:
                blend(c, x, y, "#e0802a", 0.5 - (y - FL) * 0.007, 3)
    # the barrel fire
    c.rect(FX - 9, FY - 24, FX + 9, FY, "#0c0808"); c.rect(FX - 9, FY - 24, FX - 9, FY, "#8a5a38")
    c.rect(FX - 10, FY - 16, FX + 10, FY - 15, "#1a1210"); c.rect(FX - 10, FY - 7, FX + 10, FY - 6, "#1a1210")
    _flames(c, FX, FY - 23, 26, 7, e.seed_for("fl"), n=7)
    e.protect += ["#fff0b0", "#ffc060"]
    # the body, lying on its side, head left; a long shadow thrown away from the fire
    body, top = _lying(84, "#5a4636", facing=1)
    bx0, by0 = 12, 76
    cast_shadow(c, body, bx0 + 4, by0 + body.height - 1, anchor="tl", origin=(4, body.height - 2), toward_light=(1, 0.5), length=0.4, squash=0.6, col="#05040a", t=0.8)
    place(c, rim(body, "#ffc060", (1, -0.6), min_run=2), bx0, by0, anchor="tl")
    c.rect(bx0 + body.width - 3, by0 + 8, bx0 + body.width - 1, by0 + 9, "#e8d8b8")          # bare feet
    c.rect(bx0 + body.width - 3, by0 + 4, bx0 + body.width - 1, by0 + 4, "#e8d8b8")
    c.rect(bx0 + 22, by0 + 2, bx0 + 27, by0 + 3, "#a03a2a")                                    # the coat band, the one colour
    # the scavengers, back-lit by the fire
    f1 = fig(40, "kneel", "#0a0708", facing=-1, lean=14)          # at the feet, holding the shoes up
    x1, y1 = put_figure(c, f1, 122, 102, rim_col="#ffc060", toward=(1, -0.3),
                        shadow=dict(toward_light=(1, 0.3), length=1.1, squash=0.25, col="#05040a", t=0.8))
    h1 = (x1 + int(f1["hands"][0][0]), y1 + int(f1["hands"][0][1]))
    c.line([h1, (h1[0] - 3, h1[1] - 8)], "#0a0708", 2)
    c.rect(h1[0] - 8, h1[1] - 13, h1[0] - 2, h1[1] - 9, "#241a16"); c.rect(h1[0] - 8, h1[1] - 9, h1[0] - 2, h1[1] - 9, "#e8d8b8")
    c.rect(h1[0] - 11, h1[1] - 11, h1[0] - 9, h1[1] - 8, "#241a16")
    f2 = fig(36, "kneel", "#0a0708", facing=1, lean=18)           # by the hand, working a weapon loose
    x2, y2 = put_figure(c, f2, 62, 106, rim_col="#ffc060", toward=(1, -0.3),
                        shadow=dict(toward_light=(1, 0.3), length=1.1, squash=0.25, col="#05040a", t=0.8))
    h2 = (x2 + int(f2["hands"][0][0]), y2 + int(f2["hands"][0][1]))
    c.line([(h2[0], h2[1]), (h2[0] + 20, h2[1] + 7)], "#14100e", 2); c.line([(h2[0] + 1, h2[1] - 1), (h2[0] + 20, h2[1] + 6)], "#b8946a")
    f3 = fig(42, "walk", "#0a0708", facing=1)                      # walking off toward the fire, a bundle on the shoulder
    x3, y3 = put_figure(c, f3, 146, 100, rim_col="#ffc060", toward=(1, -0.3),
                        shadow=dict(toward_light=(1, 0.3), length=1.1, squash=0.25, col="#05040a", t=0.8))
    bxx, byy = x3 + int(f3["head"][0]) - 4, y3 + int(f3["head"][1]) + 3
    c.ellipse(bxx, byy, 6, 5, "#241a16"); c.line([(bxx - 5, byy - 4), (bxx + 4, byy - 5)], "#ffc060")
    c.rect(0, 102, 20, 108, "#050408"); c.rect(0, 102, 20, 102, "#4a3224")
    c.rect(168, 104, 191, 108, "#050408")
    particles(c, "ash", 30, (0, 0, 191, 100), seed=e.seed_for("ash"), cols=("#6a5646", "#8a7058", "#3a2c22"))
    particles(c, "ember", 20, (120, 30, 191, 84), seed=e.seed_for("emb"), cols=("#ff9a3a", "#ffd080"), wind=(1, -2))
    vignette_kind(c, "death", col="#020204", strength=0.8)


@ending("cha_death_sanity")
def cha_death_sanity(e):
    """DEATH.  Chorus of Four: a black void and a glassy black floor.  The player stands centre-left with arms flung up, face
    split into four tiny colour cells (laughing, weeping, raging, craving); four cones of coloured light leave the head
    diagonally -- red up-left, green down-left, blue up-right, pink down-right -- each ending in a pool of its colour on
    the floor.  Nothing else.  Heavy vignette."""
    c = e.c
    HZ = 62
    sky(c, ["#020106", "#05030c", "#0a0616"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#020106", "#0a0616", "#14082a"], 0, HZ, scale=0.05, thresh=0.55, stretch=2.0)
    stars(c, e.seed_for("st"), 22, 0, HZ - 4, cols=("#4a4a70", "#8a8ab0"))
    # the head position
    HX, HY = 92, 34
    # the four cones (narrow at the head, widening outward), each in its god's colour
    cones = [(215, "#ec3a2a"), (150, "#9ac838"), (325, "#2ab8ff"), (30, "#ff6ad0")]
    for (ang, col) in cones:
        shafts(c, (HX, HY), ang, 12, 3, 104, col, t=0.75, seed=e.seed_for("cone%d" % ang), w0=1.5, w1=16, power=0.45)
    glow(c, HX, HY, 30, ["#2a1038", "#8a5aa8", "#e8e0f8", "#ffffff"], power=1.5, strength=0.9)
    # glassy floor with four coloured pools where the cones land
    for y in range(HZ, 108):
        for x in range(192):
            t = clamp(0.2 + (y - HZ) * 0.004)
            c.set(x, y, ramp_pick(["#020106", "#08051a", "#140e2a", "#221840"], t, x, y))
    c.rect(0, HZ, 191, HZ, "#2a2040")
    for (px_, py_, col) in [(20, 52, "#ec3a2a"), (18, 94, "#9ac838"), (168, 40, "#2ab8ff"), (172, 92, "#ff6ad0")]:
        pass
    pools = [(32, 70, "#ec3a2a"), (30, 98, "#9ac838"), (160, 70, "#2ab8ff"), (158, 98, "#ff6ad0")]
    for (px_, py_, col) in pools:
        light_pool(c, px_, py_, 44, 9, col, t=0.8)
        light_pool(c, px_, py_, 22, 4, col, t=0.7)
    # the four colour shadows of the single figure fan out across the floor
    # the figure: arms up, backlit by nothing but its own cones
    me = player_fig("chaos", 54, "arms_up", facing=1)
    me["img"] = tint(me["img"], "#08040e", 0.78)
    px0, py0 = put_figure(c, me, HX, 94)
    hx_, hy_ = px0 + int(me["head"][0]), py0 + int(me["head"][1])
    # coloured rim: each side lit by the cone that reaches it
    src = me["img"].load()
    for j in range(me["img"].height):
        for i in range(me["img"].width):
            if src[i, j][3] < 128:
                continue
            left_open = i == 0 or src[i - 1, j][3] < 128
            right_open = i + 1 >= me["img"].width or src[i + 1, j][3] < 128
            top_open = j == 0 or src[i, j - 1][3] < 128
            if left_open:
                c.set(px0 + i, py0 + j, "#ec3a2a" if j < me["img"].height * 0.45 else "#9ac838")
            elif right_open:
                c.set(px0 + i, py0 + j, "#2ab8ff" if j < me["img"].height * 0.45 else "#ff6ad0")
            elif top_open:
                c.set(px0 + i, py0 + j, "#e8e0f8")
    # the face: four cells in four colours -- a laugh, a tear, a snarl, a pout
    hx0, hy0 = hx_ - 1, hy_ - 1
    c.set(hx0, hy0, "#ec3a2a"); c.set(hx0 + 1, hy0, "#9ac838"); c.set(hx0, hy0 + 1, "#2ab8ff"); c.set(hx0 + 1, hy0 + 1, "#ff6ad0")
    c.set(hx0 - 1, hy0 + 2, "#ec3a2a"); c.set(hx0 + 2, hy0 + 2, "#ff6ad0")           # mouth corners pulling four ways
    c.set(hx0 - 1, hy0 + 3, "#9ac838"); c.set(hx0 + 2, hy0 + 3, "#2ab8ff")
    e.protect += ["#ec3a2a", "#9ac838", "#2ab8ff", "#ff6ad0", "#e8e0f8", "#ffffff"]
    particles(c, "mote", 24, (0, 0, 191, 100), seed=e.seed_for("mt"), cols=("#ec3a2a", "#9ac838", "#2ab8ff", "#ff6ad0"))
    vignette_kind(c, "death", col="#020106", strength=0.72)


def _blob2(c, x, y, rx, ry, col, rim, rim_off=(-1, -1)):
    """dark blob with a lit upper-left edge (draw rim ellipse first, dark one offset)"""
    c.ellipse(int(x + rim_off[0]), int(y + rim_off[1]), int(rx + 1), int(ry + 1), rim)
    c.ellipse(int(x), int(y), int(rx), int(ry), col)


@ending("cha_death_corruption")
def cha_death_corruption(e):
    """DEATH.  Chaos Spawn: a dark chamber, a sick violet-green glare behind.  A heaving ring of flesh -- a creature that
    chases its own tail -- fills the middle: lumps, tentacles, torn wing stumps, small toothy mouths, dozens of eyes in
    the four gods' colours.  At its head, where jaws close on the tail, one pale human eye looks down toward a folded
    coat with a red band lying on the floor at the right (the marker left behind).  Backlit silhouette."""
    c = e.c
    HZ = 70
    sky(c, ["#05030a", "#12081c", "#2a1040", "#4a2a5a"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#05030a", "#12081c", "#2a1040"], 0, 70, scale=0.05, thresh=0.5, stretch=2.4)
    CX, CY = 94, 54
    glow(c, CX, CY, 78, ["#12081c", "#3a1a58", "#6a5a9a", "#9ab870", "#d8e890"], power=1.3, strength=0.95, ry=58)
    glow(c, CX, CY, 34, ["#6a5a9a", "#a8c880", "#e8f4b0"], power=1.4, strength=0.6, ry=28)
    # floor: dark plates with cracks that glow
    hband(c, HZ, 107, ["#4a3a6a", "#2a1c40", "#12081c", "#05030a"], seed=e.seed_for("fl"), rough=0.2)
    c.rect(0, HZ, 191, HZ, "#6a5a9a")
    light_pool(c, CX, HZ + 14, 70, 14, "#9ab870", t=0.4)
    rc = e.rng("cracks")
    for k in range(4):
        x0 = rc.randint(10, 180)
        pts = [(x0, HZ + 3)]
        for q in range(5):
            pts.append((pts[-1][0] + rc.randint(-8, 8), pts[-1][1] + rc.randint(4, 9)))
        c.line(pts, "#6a8a50")
    # --- the body: a ring, almost closed, thickness varying; rim pass first, dark pass second
    DARK, RIM = "#08040e", "#a8c880"
    ring = []
    N = 70
    for k in range(N + 1):
        t = k / float(N)
        a = math.radians(-120 + 330 * t)
        rx_, ry_ = 29 + 3 * math.sin(t * 9.0), 21 + 2 * math.sin(t * 7.0)
        w = 4.5 + 5.5 * math.sin(math.pi * min(1.0, t * 1.05)) + (2.5 if 0.1 < t < 0.2 else 0)
        ring.append((CX + math.cos(a) * rx_, CY + 4 + math.sin(a) * ry_, w))
    for (x, y, w) in ring:
        c.ellipse(int(x - 1), int(y - 1), int(w + 1), int(w * 0.9 + 1), RIM)
    for (x, y, w) in ring:
        c.ellipse(int(x), int(y), int(w), int(w * 0.9), DARK)
    # lumps and bulges
    rl = e.rng("lumps")
    for k in range(16):
        x, y, w = ring[rl.randint(2, N - 2)]
        a = math.atan2(y - (CY + 4), x - CX)
        r2 = rl.randint(3, 7)
        lx, ly = x + math.cos(a) * (w * 0.9), y + math.sin(a) * (w * 0.8)
        _blob2(c, lx, ly, r2, r2 * 0.85, DARK, RIM)
    # tentacles: tapering curves leaving the ring outward, curling
    rt = e.rng("tent")
    for k in range(11):
        x, y, w = ring[rt.randint(0, N)]
        a = math.atan2(y - (CY + 4), x - CX) + rt.uniform(-0.4, 0.4)
        L = rt.randint(14, 30)
        curl = rt.choice([-1, 1]) * rt.uniform(0.04, 0.1)
        pts = []
        px_, py_ = x, y
        for q in range(L):
            pts.append((px_, py_, max(0.6, (w * 0.45) * (1 - q / float(L)))))
            a += curl
            px_ += math.cos(a); py_ += math.sin(a)
        for (xx, yy, ww) in pts:
            c.ellipse(int(xx - 1), int(yy - 1), int(ww + 1), int(ww + 1), RIM) if ww > 1.2 else c.set(int(xx - 1), int(yy - 1), RIM)
        for (xx, yy, ww) in pts:
            c.ellipse(int(xx), int(yy), int(ww), int(ww), DARK) if ww > 1.2 else c.set(int(xx), int(yy), DARK)
        c.set(int(pts[-1][0]), int(pts[-1][1]), "#e8f4b0")
    # torn wing stumps from the top of the ring
    for side in (-1, 1):
        wx, wy = CX + side * 14, CY - 20
        c.poly([(wx, wy), (wx + side * 18, wy - 14), (wx + side * 26, wy - 4), (wx + side * 22, wy + 4), (wx + side * 14, wy - 2), (wx + side * 10, wy + 6)], DARK)
        c.line([(wx, wy), (wx + side * 18, wy - 14), (wx + side * 26, wy - 4)], RIM)
    # eyes in the four god colours, big and small; mouths with a few teeth
    re_ = e.rng("eyes")
    GC = ["#ec3a2a", "#9ac838", "#2ab8ff", "#ff6ad0"]
    for k in range(26):
        x, y, w = ring[re_.randint(3, N - 6)]
        ex, ey = int(x + re_.randint(-2, 2)), int(y + re_.randint(-2, 2))
        col = GC[k % 4]
        if k < 11:
            c.rect(ex - 1, ey - 1, ex + 1, ey + 1, col); c.set(ex, ey, "#ffffff")
        else:
            c.set(ex, ey, col)
            if k % 3 == 0:
                c.set(ex + 1, ey, col)
    for k in range(5):
        x, y, w = ring[re_.randint(8, N - 10)]
        mx, my = int(x), int(y + 2)
        c.rect(mx - 2, my, mx + 2, my + 1, "#2a0a14")
        c.set(mx - 1, my, "#f0e8d0"); c.set(mx + 1, my, "#f0e8d0"); c.set(mx, my + 1, "#f0e8d0")
    e.protect += ["#ec3a2a", "#9ac838", "#2ab8ff", "#ff6ad0", "#e8f4b0", "#f0e8d0", "#ffffff"]
    # the head: where the jaws close on the tail -- one pale human eye
    hxx, hyy, hw = ring[int(N * 0.05)]
    c.ellipse(int(hxx), int(hyy), 5, 5, "#e8e0d0"); c.ellipse(int(hxx) + 1, int(hyy) + 1, 2, 2, "#1a1020"); c.set(int(hxx) + 1, int(hyy), "#ffffff")
    c.line([(int(hxx) - 5, int(hyy) - 3), (int(hxx) + 4, int(hyy) - 6)], DARK)
    # the coat on the floor, folded; the red band -- the marker left behind
    c.poly([(138, 90), (168, 88), (174, 100), (140, 103)], "#2a1e16")
    c.poly([(138, 90), (168, 88), (170, 93), (139, 95)], "#7a6450")
    c.line([(144, 97), (171, 94)], "#c8442a", 2)
    c.line([(138, 90), (168, 88)], "#c8e890")
    c.rect(152, 99, 153, 100, "#e0c070")
    light_pool(c, 156, 96, 30, 7, "#c8e890", t=0.4)
    particles(c, "spore", 34, (0, 0, 191, 100), seed=e.seed_for("sp"), cols=("#c8e890", "#9a7ac8", "#ff6ad0"))
    vignette_kind(c, "death", col="#020106", strength=0.72)
