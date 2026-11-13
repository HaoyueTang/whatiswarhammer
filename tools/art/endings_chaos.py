"""SPEC §31 ending illustrations — Chaos route (cha_*).  See endkit.py for the helper conventions.

Private helpers (leading underscore): _flagship, _skull, _skull_heap, _brass_axe, _nurgling, _candle, _mouth_smile,
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
    light_pool(c, 70, HZ + 22, 70, 14, "#c8441c", t=0.45)
    for k in range(-9, 10):
        c.line([(VX + k * 0.6, HZ + 1), (VX + k * 16, 107)], "#2a060c")
    # skull heaps lining the road: small and far on the left, big and close on the right
    _skull_heap(c, 0, 40, HZ + 14, 12, e.seed_for("hL"), col="#10040a", lit="#ec8a2c", bone="#8a6a54", cx=14, sk=(3, 5), dens=0.7)
    _skull_heap(c, 60, 96, HZ + 6, 5, e.seed_for("hM"), col="#14040a", lit="#ec8a2c", bone="#8a6a54", cx=80, sk=(3, 4), dens=0.8)
    tops = _skull_heap(c, 124, 191, 108, 58, e.seed_for("hR"), col="#10040a", lit="#ec8a2c", bone="#a07a60", cx=190, sk=(5, 8), dens=0.7)
    haze(c, 40, 108, "#521010", t=0.25, seed=e.seed_for("hz2"), profile="top", x0=124)
    # the hound: low, hunched run toward the throne, collar and a taut chain
    f = fig(46, "run", "#1a060c", facing=-1, lean=52)
    fx, fy = 98, 101
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
        if i % 3 == 0:
            c.set(x, y - 1, "#ffc060")
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
