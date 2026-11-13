"""SPEC §31 ending illustrations — Ork route (ork_*).  See endkit.py for the helper conventions.

Helpers local to this module (promotion candidates for endkit): _ork_img (procedural ork silhouette, 5 poses, own
choppa), _grot (hand-pixelled gretchin), _junk (scrap pieces), _scrap_heap, _mushroom, _squig_img."""
import math
import random
from PIL import ImageDraw
from reg import ending
from endkit import *


GROT = [                      # a gretchin, hand-pixelled: big ears, two glinting eyes
    "#.........#.",
    "##.......##.",
    ".###.##.###.",
    "..#######...",
    "..#######...",
    "...#####....",
    "....###.....",
    ".#.#####.#..",
    ".#.#####.#..",
    "##.#####.##.",
    "...##.##....",
    "...#...#....",
    "..##...##...",
]


def _grot(c, x, y, col, flip=False, rim_col=None, load=None):
    """draw a gretchin with its feet at (x, y).  load = colour of a bundle on its back."""
    im = Image.new("RGBA", (12, 13), (0, 0, 0, 0))
    px = im.load()
    for j, row in enumerate(GROT):
        for i, ch in enumerate(row):
            if ch == "#":
                px[i, j] = C(col) + (255,)
    px[3, 3] = C("#f4f070") + (255,)
    px[6, 3] = C("#f4f070") + (255,)
    if load:
        for (i, j) in [(8, 6), (9, 6), (8, 7), (9, 7), (10, 7), (9, 8), (10, 8)]:
            px[i, j] = C(load) + (255,)
    if flip:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    if rim_col:
        im = rim(im, rim_col, (-1, -1))
    cast_shadow(c, im, x, y, anchor="bm", toward_light=(-1, 0.5), length=1.0, squash=0.3, col="#2a2c10", t=0.55)
    place(c, im, x, y, anchor="bm")


_ORK_POSES = {
    #        torso lean(deg fwd), arm angles (upper, lower) from straight down (+ = forward/up), weapon on arm index or None, legs
    "stand":  dict(lean=14, arms=((8, 24), (-6, 4)), wpn=0, legs=((6, 2), (-8, -4))),
    "raise":  dict(lean=16, arms=((125, 160), (10, 20)), wpn=0, legs=((14, 2), (-14, -4))),
    "cheer":  dict(lean=6,  arms=((150, 172), (-150, -172)), wpn=0, legs=((8, 2), (-8, -3))),
    "charge": dict(lean=38, arms=((-70, -110), (60, 90)), wpn=0, legs=((50, 5), (-36, -80))),
    "slump":  dict(lean=44, arms=((16, 8), (6, 2)), wpn=None, legs=((6, 2), (-8, -4))),
}

def _ork_img(h, pose="stand", col="#101208", facing=1, weapon="#b8b8a0", ss=5):
    P = _ORK_POSES[pose]
    Wd, Hd = int(h*1.7*ss), int(h*1.25*ss)
    big = Image.new("L", (Wd, Hd), 0)
    d = ImageDraw.Draw(big)
    u = h*ss
    ox, oy = Wd*0.42, Hd*0.96
    T = lambda p: (ox+p[0]*u, oy-p[1]*u)
    def seg(a, b, w):
        d.line([T(a), T(b)], fill=255, width=max(1, int(w*u)))
        r = w*u/2
        for q in (T(a), T(b)):
            d.ellipse([q[0]-r, q[1]-r, q[0]+r, q[1]+r], fill=255)
    def fk(p, segs):
        pts=[p]
        for ln, ang in segs:
            x,y=pts[-1]; r=math.radians(ang)
            pts.append((x+ln*math.sin(r), y-ln*math.cos(r)))
        return pts
    hip=(0.0, 0.36)
    for i,(a,b) in enumerate(P["legs"]):
        h0=(hip[0]+(0.05 if i==0 else -0.05), hip[1])
        pts=fk(h0, [(0.19,a),(0.19,b)])
        seg(pts[0],pts[1],0.15); seg(pts[1],pts[2],0.13)
        fx,fy=pts[2]
        seg((fx,fy),(fx+0.07,fy),0.09)
    lean=P["lean"]
    tp=fk(hip,[(0.30,180-lean)])
    sh=tp[1]
    # torso: broad trapezoid hip -> shoulders, belly
    d.polygon([T((sh[0]-0.24,sh[1]-0.02)),T((sh[0]+0.24,sh[1]+0.02)),T((hip[0]+0.2,hip[1]-0.03)),T((hip[0]-0.2,hip[1]-0.03))],fill=255)
    # shoulders hump
    q=T((sh[0]-0.03,sh[1]-0.01)); r=0.19*u
    d.ellipse([q[0]-r,q[1]-r*0.6,q[0]+r,q[1]+r*0.6],fill=255)
    # head forward and low
    hd=(sh[0]+0.11, sh[1]+0.12)
    hr=0.095
    q=T(hd); d.ellipse([q[0]-hr*u,q[1]-hr*u,q[0]+hr*u,q[1]+hr*u],fill=255)
    # jaw / snout forward
    d.polygon([T((hd[0]-0.02,hd[1]-0.02)),T((hd[0]+0.13,hd[1]-0.03)),T((hd[0]+0.11,hd[1]-0.1)),T((hd[0]-0.04,hd[1]-0.09))],fill=255)
    # ear
    d.polygon([T((hd[0]-0.06,hd[1]+0.02)),T((hd[0]-0.16,hd[1]+0.07)),T((hd[0]-0.05,hd[1]-0.02))],fill=255)
    # tusks (upward)
    d.polygon([T((hd[0]+0.09,hd[1]-0.04)),T((hd[0]+0.12,hd[1]+0.05)),T((hd[0]+0.11,hd[1]-0.04))],fill=255)
    hands=[]
    for i,(a,b) in enumerate(P["arms"]):
        a0=(sh[0]+(0.12 if i==0 else -0.1), sh[1]-0.01)
        pts=fk(a0,[(0.23,a),(0.22,b)])
        seg(pts[0],pts[1],0.14); seg(pts[1],pts[2],0.12)
        q=T(pts[2]); r=0.075*u
        d.ellipse([q[0]-r,q[1]-r,q[0]+r,q[1]+r],fill=255)
        hands.append(pts[2])
    if P["wpn"] is not None:
        hx_, hy_ = hands[P["wpn"]]
        fo = P["arms"][P["wpn"]][1]
        ang = math.radians(fo)
        dx, dy = math.sin(ang), -math.cos(ang)
        px_, py_ = dy, -dx                            # perpendicular
        e1 = (hx_ + dx*0.20, hy_ + dy*0.20)
        seg((hx_, hy_), e1, 0.035)
        blade = [(e1[0]-dx*0.03 + px_*0.02, e1[1]-dy*0.03 + py_*0.02),
                 (e1[0]+dx*0.16 + px_*0.10, e1[1]+dy*0.16 + py_*0.10),
                 (e1[0]+dx*0.20 - px_*0.04, e1[1]+dy*0.20 - py_*0.04),
                 (e1[0]-dx*0.03 - px_*0.04, e1[1]-dy*0.03 - py_*0.04)]
        d.polygon([T(p) for p in blade], fill=255)
    small=big.resize((Wd//ss,Hd//ss),Image.BOX).point(lambda v:255 if v>=105 else 0)
    bb=small.getbbox() or (0,0,1,1)
    out=Image.new("RGBA",(Wd//ss,Hd//ss),(0,0,0,0))
    out.paste(Image.new("RGBA",out.size,C(col)+(255,)),(0,0),small)
    out=out.crop(bb)
    if facing<0: out=out.transpose(Image.FLIP_LEFT_RIGHT)
    return out



@ending("ork_end_grot")
def ork_end_grot(e):
    """BAD.  Big Grot (redrawn: the pilot had huge plain ork heads and was too bright for a bad ending).  Ten years on the
    road of the Great Waaagh!: a dust road runs to a dim sun in sick yellow haze; a river of black ork silhouettes
    with rag banners marches along it toward a looming walker on the horizon; in the foreground the human, the same
    size as the grots, trudges with a sack of spanners, back to us, and a huge ork passes at the right edge without
    a glance.  Nobody remembers the name."""
    c = e.c
    HZ = 62
    sky(c, ["#0c1008", "#1c2208", "#363a12", "#5a5a1c", "#8a7c2c", "#b49c40"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#141808", "#242c0c", "#3c4414"], 0, 44, scale=0.05, thresh=0.5, stretch=4.5)
    sx_, sy_ = 148, 38
    glow(c, sx_, sy_, 50, ["#363a12", "#5a5a1c", "#8a7c2c", "#c8b448", "#ecdc88"], power=1.5, strength=1.0, ry=32)
    c.ellipse(sx_, sy_, 7, 7, "#f6eca0")
    # the walker on the horizon: a boxy mountain with chimneys, in haze
    wk = [(104, HZ + 2), (108, HZ - 20), (116, HZ - 24), (122, HZ - 34), (140, HZ - 36), (146, HZ - 24), (162, HZ - 22), (166, HZ + 2)]
    c.poly(wk, "#1a1c0a")
    for (cx_, ch) in [(114, 14), (126, 18), (152, 12)]:
        c.rect(cx_, HZ - 34 - ch, cx_ + 2, HZ - 30, "#1a1c0a")
    c.rect(96, HZ - 14, 108, HZ - 12, "#1a1c0a")                            # its big gun
    haze(c, HZ - 30, HZ + 6, "#8a7c2c", t=0.5, seed=e.seed_for("hz"), profile="mid", x0=90)
    # ground and the road
    hband(c, HZ + 2, 107, ["#4a4418", "#363212", "#26240c", "#16160a", "#0a0c06"], seed=e.seed_for("gr"), rough=0.45)
    nz = e.noise("road")
    for y in range(HZ + 2, 108):
        k = (y - HZ) / (107.0 - HZ)
        xc = 148 - k * 112
        w = 5 + k * 62
        for x in range(int(xc - w), int(xc + w) + 1):
            u = abs(x - xc) / w
            t = clamp(0.95 - 0.35 * u * u - 0.1 * k + (nz.fbm(x * 0.12, y * 0.25, 2) - 0.5) * 0.3)
            c.set(x, y, ramp_pick(["#26240c", "#4a4418", "#7a6c2a", "#a89044"], t, x, y))
    # the river of the horde, small to large along the road, dark with a sun-rim
    rr = e.rng("horde")
    items = []
    for k in range(44):
        y = HZ + 4 + (k / 44.0) ** 0.9 * 22
        kk = (y - HZ) / (107.0 - HZ)
        xc = 148 - kk * 112
        w = 5 + kk * 62
        items.append((y, xc + rr.uniform(-w, w) * 0.9, 9 + int(kk * 30) + rr.randint(0, 2)))
    items.sort()
    for (y, x, h) in items:
        pz = rr.choice(["stand", "stand", "raise", "slump"])
        col = mix(C("#0c0e06"), C("#5a5020"), clamp(1.0 - (y - HZ) / 44.0) * 0.55)
        _put_ork(c, int(x), int(y), h, pz, col, facing=1, rim_col=None, toward=(1, -1))
    for (bx, by, bh) in [(86, 80, 26), (108, 74, 22), (128, 69, 16)]:       # rag banners
        c.line([(bx, by), (bx, by - bh)], "#0a0c06")
        for j in range(6):
            c.rect(bx + 1 + j, by - bh + (j * j) // 7, bx + 2 + j, by - bh + 2 + (j * j) // 7, "#0a0c06")
    # foreground: the human with a sack of spanners, back to us, and four grots the same size
    me = player_fig("orks", 34, "walk", facing=1, lean=16)
    me["img"] = tint(me["img"], "#0e0e06", 0.35)
    mpx, mpy = put_figure(c, me, 46, 104, rim_col="#c8b448", toward=(1, -1),
                          shadow=dict(toward_light=(1, 0.5), length=1.1, squash=0.3, col="#0a0a04", t=0.55))
    bx, by = mpx + 2, mpy + 9
    for (dx_, dy_, r_) in [(0, 0, 6), (3, -3, 4), (-2, 3, 4)]:
        c.ellipse(bx + dx_, by + dy_, r_, r_ - 1, "#6a5a2a")
    c.ellipse(bx - 1, by - 2, 3, 2, "#a89040")
    for k, (dx_, dy_) in enumerate([(-3, -8), (0, -9), (3, -8)]):
        c.line([(bx + dx_, by + dy_ + 5), (bx + dx_ + k - 1, by + dy_)], "#c8c8b0")
        c.rect(bx + dx_ + k - 2, by + dy_ - 2, bx + dx_ + k, by + dy_ - 1, "#c8c8b0")
    hx_, hy_ = me["head"]
    c.rect(mpx + int(hx_) - 1, mpy + int(hy_), mpx + int(hx_) + 1, mpy + int(hy_) + 1, "#78a83a")           # a green tint, creeping
    for (gx, gy, ld) in [(64, 99, "#4a3a1a"), (80, 104, None), (22, 100, "#3a4a14"), (96, 95, None)]:
        _grot(c, gx, gy, "#0a0a04", flip=False, rim_col="#c8b448", load=ld)
    # a huge ork passes at the right edge without a look, cropped, dark
    _put_ork(c, 176, 116, 78, "stand", "#080a04", facing=1, rim_col="#d8c458", toward=(0, -1))
    particles(c, "mote", 50, (0, 30, 191, 104), seed=e.seed_for("dust"), cols=("#c8b448", "#8a7c2c", "#ecdc88"))
    vignette_kind(c, "bad", col="#060804", strength=0.85)


# ------------------------------------------------------------------ shared helpers of this module

def _put_ork(c, x, y, h, pose, col, facing=1, rim_col=None, toward=(-1, -1), shadow=None, **kw):
    """ork silhouette with its feet at (x, y); optional rim light and cast shadow."""
    im = _ork_img(h, pose, col, facing=facing, **kw)
    if shadow:
        cast_shadow(c, im, x, y, anchor="bm", **shadow)
    if rim_col:
        im = rim(im, rim_col, toward)
    place(c, im, x, y, anchor="bm")
    return im


def _junk(c, x, y, kind, s, col, lite=None, hole=None):
    """one piece of scrap, centre (x, y), size s: wheel / barrel / plate / pipe / cog / hull.  `lite` = 1 px light
    edge on the upper left; `hole` = colour seen through a wheel / cog."""
    if kind == "wheel":
        c.ellipse(x, y, s, s, col)
        if hole is not None and s >= 3:
            c.ellipse(x, y, s - 2, s - 2, hole)
            c.line([(x - s + 2, y), (x + s - 2, y)], col)
            c.line([(x, y - s + 2), (x, y + s - 2)], col)
        if lite:
            c.line([(x - s, y), (x - s + 1, y - s // 2), (x, y - s)], lite)
    elif kind == "barrel":
        c.rect(x - s // 2, y - s, x + s // 2, y + s, col)
        if lite:
            c.rect(x - s // 2, y - s, x - s // 2, y + s, lite)
            c.rect(x - s // 2, y - s, x + s // 2, y - s, lite)
    elif kind == "plate":
        c.poly([(x - s, y - s // 2), (x + s, y - s), (x + s - 2, y + s // 2), (x - s + 1, y + s)], col)
        if lite:
            c.line([(x - s, y - s // 2), (x + s, y - s)], lite)
    elif kind == "pipe":
        c.line([(x - s, y + s // 3), (x + s, y - s // 3)], col, width=2 if s > 2 else 1)
        if lite:
            c.line([(x - s, y + s // 3 - 1), (x + s, y - s // 3 - 1)], lite)
    elif kind == "cog":
        c.ellipse(x, y, s, s, col)
        for k in range(8):
            a = k * math.pi / 4
            c.rect(x + math.cos(a) * (s + 1) - 1, y + math.sin(a) * (s + 1) - 1,
                   x + math.cos(a) * (s + 1), y + math.sin(a) * (s + 1), col)
        if hole is not None and s >= 3:
            c.ellipse(x, y, 1, 1, hole)
    elif kind == "hull":
        c.poly([(x - s, y + s // 2), (x - s // 2, y - s // 2), (x + s, y - s // 3), (x + s // 2, y + s // 2)], col)
        if lite:
            c.line([(x - s // 2, y - s // 2), (x + s, y - s // 3)], lite)


def _rot(img, deg):
    """rotate an RGBA sprite / figure image (nearest) by deg, counter-clockwise, canvas expanded."""
    return img.rotate(deg, resample=Image.NEAREST, expand=True)


def _heap_top(x, base, peaks, noise_amp, n, scale):
    """profile of a scrap heap: sum of gaussian bumps (x0, height, width) + noise."""
    h = 0.0
    for (x0, hh, ww) in peaks:
        h += hh * math.exp(-((x - x0) / ww) ** 2)
    return base - h - noise_amp * n.fbm(x * scale, 0.5, 3)


def _scrap_heap(c, seed, base, peaks, x0, x1, ramp, light_at, pieces=300, hole=None, noise_amp=8, scale=0.04,
                size_near=7, size_far=2, kinds=None, fill_to=None):
    """a heap: profile from gaussian bumps, filled with a lit ramp (dark -> light), `pieces` of scrap scattered on it
    (bigger lower in the picture), each lit by its distance to `light_at` = (x, y, radius), rim-lit top edge.
    ramp = 5+ colours dark -> light.  Returns {x: top y}."""
    rr = random.Random(seed)
    n = Noise(seed)
    fill_to = c.h - 1 if fill_to is None else fill_to
    tops = {x: int(_heap_top(x, base, peaks, noise_amp, n, scale)) for x in range(x0, x1 + 1)}
    lx, ly, lr = light_at

    def lit(x, y):
        return clamp(1.0 - math.hypot(x - lx, (y - ly) * 1.5) / lr)
    nn = len(ramp) - 1
    for x in range(x0, x1 + 1):
        for y in range(tops[x], fill_to + 1):
            t = lit(x, y) * 0.55 + (n.fbm(x * 0.09, y * 0.09, 2) - 0.5) * 0.25
            c.set(x, y, ramp_pick(ramp[:nn - 1], clamp(t), x, y))
    kinds = kinds or ["wheel", "barrel", "plate", "pipe", "cog", "hull", "plate", "pipe", "wheel"]
    pcs = []
    for _ in range(pieces):
        px = rr.randint(x0, x1)
        py = rr.randint(tops[px] - 1, fill_to)
        pcs.append((py, px))
    pcs.sort()
    for (py, px) in pcs:
        depth = clamp((py - tops[px]) / 60.0)
        s_ = int(size_far + (size_near - size_far) * clamp((py - 40) / 60.0) + rr.randint(-1, 1))
        s_ = max(2, s_)
        t = clamp(lit(px, py) + rr.uniform(-0.25, 0.2))
        i = int(t * (nn - 2) + 0.5)
        col = ramp[max(0, min(nn - 1, i))]
        edge = ramp[min(nn, i + 2)]
        _junk(c, px, py, rr.choice(kinds), s_, col, edge, hole=hole or ramp[0])
    for x in range(x0, x1 + 1):                 # rim of the profile, lit only where the light reaches
        t = lit(x, tops[x])
        if t > 0.12:
            c.set(x, tops[x], ramp[min(nn, 2 + int(t * 3))])
    return tops


def _lying(L, coat, band, skin="#c0a47c", trousers=None):
    """a person lying on their back seen from the side, L px long, head at the left: round head, coat with a shoulder
    band, a bent knee, a bare foot, one arm flung up past the head.  Returns RGBA (ground line = bottom row)."""
    s = L / 52.0
    trousers = trousers or mix(C(coat), C("#000000"), 0.35)
    im = Image.new("RGBA", (int(L * 1.08) + 4, int(L * 0.40) + 4), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    oy = im.height - 2
    k = lambda col: tuple(int(v) for v in C(col)) + (255,)  # noqa: E731
    P = lambda x, y: (x * s + 1, oy + y * s)  # noqa: E731

    def limb(pts, w, col):
        d.line([P(*p) for p in pts], fill=k(col), width=max(1, int(round(w * s))))
    limb([(31, -3), (52, -2)], 4, trousers)                              # far leg, straight, bare foot up
    d.rectangle([P(52, -5), P(54, -2)], fill=k(skin))
    limb([(31, -5), (40, -13), (49, -3)], 5, trousers)                    # near leg, knee up
    d.rectangle([P(49, -4), P(52, -1)], fill=k(skin))
    d.polygon([P(10, 0), P(10, -9), P(31, -8), P(33, 0)], fill=k(coat))   # torso
    d.rectangle([P(10, -9), P(13, 0)], fill=k(band))                    # shoulder band
    limb([(14, -3), (27, -1)], 3, mix(C(coat), C("#ffffff"), 0.12))       # near arm along the body
    limb([(14, -7), (6, -13), (1, -13)], 3, coat)                        # far arm flung up past the head
    d.ellipse([P(-0.5, -15.5), P(3.5, -11.5)], fill=k(skin))
    d.ellipse([P(0.5, -9.5), P(10, 0)], fill=k(skin))                      # head
    d.pieslice([P(0.5, -9.5), P(10, 0)], 180, 290, fill=k("#2a1c10"))     # hair
    return im


def _mushroom(c, x, y, h, cap, stem, lite=None, spots=None, tilt=0):
    """little toadstool, foot at (x, y), height h."""
    sw = max(1, h // 4)
    c.rect(x - sw // 2 + tilt // 2, y - h // 2, x + sw // 2 + tilt // 2, y, stem)
    rx = max(2, h // 2 + 1)
    ry = max(2, h // 3 + 1)
    cy = y - h // 2 - ry // 2 + 1
    c.ellipse(x + tilt, cy, rx, ry, cap)
    c.rect(x - rx + tilt, cy + ry // 2, x + rx + tilt, cy + ry // 2 + 1, stem)      # flat underside / gills
    if lite:
        c.rect(x - rx // 2 + tilt, cy - ry + 1, x + tilt, cy - ry + 1, lite)
        c.set(x - rx + 1 + tilt, cy - 1, lite)
    if spots:
        c.set(x + 1 + tilt, cy - 1, spots)
        if rx > 3:
            c.set(x - 2 + tilt, cy, spots)


def _squig_img(scale=1, mirror=False, tint_to=None, tint_t=0.5):
    return spr("squig", scale=scale, mirror=mirror, tint_to=tint_to, tint_t=tint_t)


# ------------------------------------------------------------------ DEATH

@ending("ork_death_hp")
def ork_death_hp(e):
    """DEATH.  On the scrap heap: dusk over a mountain of junk; the human (the route's coat, a yellow band) lies tossed on
    the lit slope among wheels and plates, grots already tugging the boots off and carrying away the spanner, a toadstool
    sprouting by the hand, and far up on the crest a lone ork walks off without looking back.  Low sun left."""
    c = e.c
    HZ = 56
    sky(c, ["#0a0705", "#1a1008", "#34200c", "#5e3a12", "#92561a", "#c27a24"], 0, HZ + 6)
    clouds(c, e.seed_for("cl"), ["#120b06", "#24160a", "#3c2610"], 0, 40, scale=0.05, thresh=0.52, stretch=4.0)
    sx_, sy_ = 34, 56
    glow(c, sx_, sy_, 58, ["#3a2210", "#6a3c14", "#a65c1c", "#d88a30", "#f6c460"], power=1.5, strength=1.0, ry=32)
    c.ellipse(sx_, sy_, 6, 6, "#f6d680")
    for (x, h) in [(122, 40), (168, 30)]:                      # smoke columns
        for k in range(h):
            blend(c, x + (k // 8) + (k % 2), HZ - k, "#1a1008", 0.75, 3)
    FAR = ["#1e1208", "#2e1c0c", "#46290f", "#68401a", "#8a5a22", "#c48a38"]
    _scrap_heap(c, e.seed_for("far"), 78, [(70, 14, 40), (160, 22, 46)], 0, 191, FAR, (sx_, sy_, 150), pieces=90,
                size_near=3, size_far=2, fill_to=107, noise_amp=6, scale=0.03)
    haze(c, HZ - 4, HZ + 26, "#a65c1c", t=0.40, seed=e.seed_for("hz"), profile="mid")
    NEAR = ["#080503", "#120b06", "#1e1209", "#33200e", "#5a3a16", "#b87a2a"]
    tops = _scrap_heap(c, e.seed_for("near"), 104, [(152, 58, 62), (20, 16, 36)], 0, 191, NEAR, (sx_ + 10, sy_ + 20, 150),
                       pieces=360, size_near=8, size_far=2, fill_to=107, noise_amp=9, scale=0.035)
    # a crane arm on the far crest
    c.line([(176, tops[176]), (176, tops[176] - 22)], "#0a0705")
    c.line([(176, tops[176] - 22), (160, tops[176] - 18)], "#0a0705")
    c.line([(160, tops[176] - 18), (160, tops[176] - 10)], "#0a0705")
    # lone ork on the crest, walking away
    ox_ = 150
    _put_ork(c, ox_, tops[ox_] + 3, 26, "stand", "#080604", facing=1, rim_col="#d88a30", toward=(-1, -1))
    # the human lying on the lit slope, rotated to follow it; a plate leans over the legs
    me = _lying(56, "#4a3a24", "#d8b040")
    me = rim(me, "#e0a850", (-1, -1))
    img = _rot(me, 12)
    place(c, img, 78, 98, anchor="bm")
    for (jx, jy, jk, js) in [(97, 93, "plate", 6), (104, 99, "wheel", 4), (60, 101, "barrel", 3)]:
        _junk(c, jx, jy, jk, js, "#140c06", "#9a6a28", hole="#2a1a0c")
    # one hand open on the slope, toadstools sprouting at the fingers
    for (mx_, my_, hh_) in [(41, 97, 6), (45, 99, 4), (37, 99, 3)]:
        _mushroom(c, mx_, my_, hh_, "#d0b060", "#8a7a48", lite="#f8ecb0", spots="#f8ecb0")
    # grots: one tugs at the boots, one hauls the spanner uphill, one drags the sack
    light_pool(c, 112, 99, 26, 8, "#d89a40", t=0.30)
    _grot(c, 110, 104, "#060402", flip=True, rim_col="#e8b050", load="#6a4a22")
    gx1 = 176
    _grot(c, gx1, tops[gx1] + 3, "#060402", flip=True, rim_col="#e8b050", load="#3a2410")
    gx2 = 14
    _grot(c, gx2, tops[gx2] + 3, "#060402", flip=False, rim_col="#e8b050")
    c.line([(gx2 + 9, tops[gx2] - 4), (gx2 + 2, tops[gx2] - 12)], "#c8c8b8")      # the spanner over its shoulder
    c.rect(gx2 - 1, tops[gx2] - 14, gx2 + 3, tops[gx2] - 12, "#e0e0d0")
    c.rect(115, 100, 116, 103, "#8a6a34")                            # boots dangling from the first grot's hand
    c.rect(113, 100, 114, 102, "#6a4a22")
    particles(c, "ember", 22, (0, 40, 191, 100), seed=e.seed_for("em"), cols=("#e89030", "#b8601c"))
    vignette_kind(c, "death", col="#050302", strength=0.9)


def _lit_by(c, img, ox, oy, light, radius, col, t=0.6, levels=3, power=1.3):
    """blend `col` over the opaque pixels of an already-placed sprite (top-left at ox, oy) by the distance to a point
    light (lx, ly): a silhouette lit by a fire / lamp on one flank, with no outline."""
    lx, ly = light
    a = img.getchannel("A").load()
    for j in range(img.height):
        for i in range(img.width):
            if a[i, j] >= 128:
                d = math.hypot(ox + i - lx, (oy + j - ly) * 1.3) / radius
                if d < 1:
                    blend(c, ox + i, oy + j, col, t * (1 - d) ** power, levels)


def _palisade(c, y_base, x0, x1, col, lite=None, seed=1, hmin=8, hmax=20, spacing=(3, 5), towers=()):
    """a spiked palisade of scrap posts: ragged heights, pointed tips, optional towers [(x, w, h)]."""
    rr = random.Random(seed)
    x = x0
    while x <= x1:
        w = rr.randint(*spacing)
        h = rr.randint(hmin, hmax)
        for xx in range(x, min(x1, x + w - 1) + 1):
            c.rect(xx, y_base - h, xx, y_base, col)
        c.set(x + w // 2, y_base - h - 1, col)
        if lite:
            c.set(x, y_base - h, lite)
        x += w
    for (tx, tw, th) in towers:
        c.rect(tx - tw // 2, y_base - th, tx + tw // 2, y_base, col)
        c.rect(tx - tw // 2 - 2, y_base - th - 1, tx + tw // 2 + 2, y_base - th + 1, col)
        if lite:
            c.rect(tx - tw // 2, y_base - th, tx - tw // 2, y_base, lite)


@ending("ork_death_sanity")
def ork_death_sanity(e):
    """DEATH.  Green Dreams: a night camp inside the fort.  The human, painted green from head to foot, stands on an oil
    drum with both arms raised, mouth open in a Waaagh!; the orks stand round in a dark ring and do not laugh.  Fire
    low on the left throws the light and a long shadow, a paint bucket and brush at the foot of the drum."""
    c = e.c
    HZ = 62
    sky(c, ["#03050a", "#070d0a", "#101c10", "#1c2c14", "#2e421a"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#070c08", "#0e160c", "#1a2a12"], 0, 40, scale=0.05, thresh=0.55, stretch=4.0)
    glow(c, 150, 36, 40, ["#0e180c", "#1a2c14", "#2c4418", "#46662a"], power=1.6, strength=0.8, ry=26)      # a sick moon behind the haze
    c.ellipse(150, 36, 4, 4, "#8aa84a")
    # palisade + towers across the back, black against the haze
    haze(c, HZ - 14, HZ + 4, "#3a5a22", t=0.5, seed=e.seed_for("hz"), profile="mid")
    haze(c, HZ - 2, HZ + 34, "#4a6e2a", t=0.55, seed=e.seed_for("hz2"), profile="mid", x0=96)       # moon haze behind the right half
    _palisade(c, HZ + 8, 0, 191, "#070c06", lite="#2e421a", seed=e.seed_for("pal"), hmin=10, hmax=24,
              towers=[(20, 10, 40), (176, 10, 34)])
    # ground
    hband(c, HZ + 8, 107, ["#2a3418", "#1c2410", "#10160a", "#080b05"], seed=e.seed_for("gr"), rough=0.3)
    # fire at the lower left: a pit of scrap with real flames
    fx, fy = 30, 99
    glow(c, fx, fy - 8, 76, ["#0e1208", "#221e0e", "#3e2a0e", "#6a3c12", "#8a4a14"], power=1.4, strength=0.9, ry=46)
    c.ellipse(fx, fy + 2, 17, 4, "#120a04")
    for (dx, dh, w_, col) in [(-8, 14, 5, "#b8441a"), (7, 17, 5, "#c8501c"), (0, 24, 8, "#d8661c"), (-3, 18, 5, "#f08a2a"),
                              (4, 13, 4, "#f08a2a"), (0, 15, 5, "#ffc050"), (-1, 9, 3, "#fff0a0")]:
        c.poly([(fx + dx - w_, fy), (fx + dx - w_ // 2, fy - dh // 2), (fx + dx + (dx > 0) * 2 - 1, fy - dh),
                (fx + dx + w_ // 2, fy - dh // 2), (fx + dx + w_, fy)], col)
    c.line([(fx - 16, fy + 2), (fx + 12, fy - 1)], "#3a220c", width=2)
    c.line([(fx - 12, fy - 1), (fx + 14, fy + 2)], "#2a1808", width=2)
    # the ring of orks: dark, quiet, backs and sides to the viewer, lit by the fire on their fire-side flank only
    ring = [(66, 92, 38, "stand", 1), (88, 84, 30, "stand", 1), (150, 84, 32, "stand", -1), (170, 96, 42, "stand", -1),
            (187, 86, 34, "slump", -1)]
    for (ox_, oy_, h_, pz, fc) in ring:
        im_ = _put_ork(c, ox_, oy_, h_, pz, "#0a0c0a", facing=fc,
                       shadow=dict(toward_light=(-1, 0.25), length=1.6, squash=0.3, col="#02030a", t=0.6))
        if ox_ < 120:
            _lit_by(c, im_, ox_ - im_.width // 2, oy_ - im_.height, (fx, fy - 8), 120, "#d8782a", t=0.75)
        else:                                                         # the right-hand ones are lit by the sick moon
            _lit_by(c, im_, ox_ - im_.width // 2, oy_ - im_.height, (150, 20), 105, "#7a9a40", t=0.8)
    # the drum
    dx_, dy_ = 118, 100
    c.rect(dx_ - 10, dy_ - 12, dx_ + 10, dy_, "#3a2a14")
    c.rect(dx_ - 10, dy_ - 12, dx_ - 9, dy_, "#c87a2a")
    c.rect(dx_ - 10, dy_ - 12, dx_ + 10, dy_ - 12, "#e0a050")
    for yy in (dy_ - 8, dy_ - 3):
        c.rect(dx_ - 10, yy, dx_ + 10, yy, "#1c1208")
    c.rect(dx_ + 4, dy_ - 11, dx_ + 10, dy_, "#241808")
    # the human on the drum, arms up, green from top to toe, mouth open (a 2 px hole in a solid head)
    me = figure(44, "arms_up", "#3c8a34", facing=1, thick=1.1)
    img = rim(me["img"], "#b4e868", (-1, 0))
    px_, py_ = place(c, img, dx_, dy_ - 12, anchor="bm")
    hx2, hy2 = me["head"]
    c.rect(px_ + int(hx2) - 1, py_ + int(hy2), px_ + int(hx2), py_ + int(hy2), "#0e1a0a")
    for yy in range(img.height):                                  # fire light on the fire-side half of the paint
        for xx in range(img.width // 2):
            if img.getpixel((xx, yy))[3] >= 128:
                blend(c, px_ + xx, py_ + yy, "#e8923a", 0.38, 3)
    for k in range(6):                                            # paint streaks: darker green drips on the chest / thighs
        c.set(px_ + img.width // 2 - 2 + k % 3, py_ + int(hy2) + 9 + k * 3, "#2a6a26")
    cast_shadow(c, me["img"], dx_, dy_ - 12, anchor="bm", toward_light=(-1, 0.1), length=1.9, squash=0.25, col="#02030a", t=0.5)
    # the bucket and brush
    c.rect(dx_ - 22, dy_ - 6, dx_ - 15, dy_, "#4a4a42")
    c.rect(dx_ - 22, dy_ - 6, dx_ - 15, dy_ - 6, "#9a9a88")
    c.rect(dx_ - 21, dy_ - 6, dx_ - 16, dy_ - 5, "#5ac84a")
    c.line([(dx_ - 17, dy_ - 6), (dx_ - 12, dy_ - 14)], "#8a6a3a")
    c.rect(dx_ - 12, dy_ - 16, dx_ - 11, dy_ - 14, "#5ac84a")
    particles(c, "ember", 40, (0, 50, 120, 100), seed=e.seed_for("em"), cols=("#ffb040", "#ff7a2a", "#ffe08a"), wind=(0, 1))
    vignette_kind(c, "death", col="#020403", strength=0.9)


def _maw_lump(c, cx, cy, rx, ry, seed, ramp, mouths=14, eyes=5, light=(-1, -1), tooth="#f0e8d0", maw="#1a0612", eye="#f2e46a"):
    """an amorphous heap of flesh with many small mouths and a few eyes (chaos spawn, abstract: no gore).
    ramp = dark -> light, 5 colours.  Shaded from `light` (dx, dy) toward the light."""
    rr = random.Random(seed)
    n = Noise(seed)
    blobs = [(cx, cy, rx, ry)]
    for _ in range(7):
        a = rr.uniform(0, 2 * math.pi)
        blobs.append((cx + math.cos(a) * rx * 0.6, cy + math.sin(a) * ry * 0.5 + ry * 0.1, rx * rr.uniform(0.35, 0.6),
                      ry * rr.uniform(0.4, 0.7)))
    inside = {}
    for (bx, by, brx, bry) in blobs:
        for y in range(int(by - bry) - 1, int(by + bry) + 2):
            for x in range(int(bx - brx) - 1, int(bx + brx) + 2):
                d = ((x - bx) / brx) ** 2 + ((y - by) / bry) ** 2
                if d <= 1.0:
                    # shading: normal-ish from the blob centre toward the light
                    nxv, nyv = (x - bx) / brx, (y - by) / bry
                    t = 0.5 + 0.5 * (nxv * light[0] + nyv * light[1]) / 1.4 - 0.25 * d + (n.fbm(x * 0.15, y * 0.15, 2) - 0.5) * 0.5
                    cur = inside.get((x, y))
                    if cur is None or t > cur - 0.05:
                        inside[(x, y)] = t
    for (x, y), t in inside.items():
        c.set(x, y, ramp_pick(ramp, clamp(t), x, y))
    for _ in range(mouths):
        (x, y) = rr.choice(list(inside))
        w_, h_ = rr.randint(2, 4), rr.randint(1, 2)
        c.rect(x - w_, y - h_, x + w_, y + h_, maw)
        for k in range(-w_ + 1, w_, 2):
            c.set(x + k, y - h_, tooth)
        if w_ >= 3:
            for k in range(-w_ + 2, w_, 2):
                c.set(x + k, y + h_, tooth)
    for _ in range(eyes):
        (x, y) = rr.choice(list(inside))
        c.rect(x, y, x + 1, y + 1, eye)
        c.set(x, y, "#fffbd0")
    return inside


@ending("ork_death_corruption")
def ork_death_corruption(e):
    """DEATH.  Weird 'Un: a ruined city at night, the whole horizon burning.  Where the human knelt there is a heap of
    mouths glowing sick magenta; a ring of orks leaps round it with raised choppas, delighted, black against the fire.
    All that is left of the person: a scrap of coat with a yellow band and a pair of boots at the lump's foot."""
    c = e.c
    HZ = 78
    sky(c, ["#06030a", "#10061a", "#240c24", "#58182a", "#a63c1c", "#e8801c", "#ffc864"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#0a040c", "#1a0a1a", "#32122a"], 0, 40, scale=0.05, thresh=0.5, stretch=4.0)
    glow(c, 150, HZ - 6, 90, ["#58182a", "#8a2a1c", "#c8501c", "#f09030", "#ffd070"], power=1.3, strength=0.85, ry=34)
    skyline(c, e.seed_for("sk"), HZ + 2, "#10060e", 26, 5, 20, wmin=4, wmax=11, x0=0, x1=191, win_p=0.0)
    rr = e.rng("fires")
    for k in range(16):                                                      # fires in the ruins
        fx_ = rr.randint(4, 188)
        fh = rr.randint(2, 6)
        c.rect(fx_, HZ - fh - 6, fx_ + 1, HZ - 4, "#ffb040")
        c.set(fx_, HZ - fh - 7, "#fff0a0")
    haze(c, HZ - 14, HZ + 4, "#d0601c", t=0.35, seed=e.seed_for("hz"), profile="mid")
    hband(c, HZ + 2, 107, ["#2c1626", "#1c0c1a", "#100610", "#07030a"], seed=e.seed_for("gr"), rough=0.35)
    # the lump, left of centre, glowing from within
    lx, ly = 58, 92
    light_pool(c, lx, ly + 6, 64, 14, "#c040a0", t=0.5)
    light_pool(c, lx + 8, ly + 9, 36, 7, "#a8d040", t=0.35)
    _maw_lump(c, lx, ly, 32, 18, e.seed_for("lump"), ["#2a0c26", "#5a1a52", "#9a2e86", "#d05cb4", "#f0a0d8"], mouths=18, eyes=6)
    # the ring: tall black silhouettes with raised weapons against the fire
    ring = [(108, 100, 56, "cheer", -1), (132, 90, 44, "raise", -1), (158, 102, 60, "cheer", -1), (184, 92, 48, "raise", -1),
            (14, 94, 50, "charge", 1), (92, 86, 36, "raise", -1)]
    for (ox_, oy_, h_, pz, fc) in ring:
        im_ = _put_ork(c, ox_, oy_, h_, pz, "#0a050c", facing=fc, rim_col="#ffb448", toward=(0, -1),
                       shadow=dict(toward_light=(1, 0.3), length=1.4, squash=0.28, col="#020104", t=0.6))
        _lit_by(c, im_, ox_ - im_.width // 2, oy_ - im_.height, (lx, ly), 70, "#d05cb4", t=0.5)
    # what is left of the person: a scrap of coat with a yellow band, and boots
    c.poly([(lx + 38, 101), (lx + 46, 99), (lx + 49, 104), (lx + 40, 106)], "#6a5630")
    c.rect(lx + 43, 99, lx + 44, 104, "#e8c050")
    c.rect(lx + 32, 103, lx + 36, 106, "#3a2412")
    c.rect(lx + 27, 105, lx + 31, 107, "#3a2412")
    c.rect(lx + 32, 103, lx + 36, 103, "#9a7a44")
    particles(c, "spore", 24, (20, 50, 110, 100), seed=e.seed_for("sp"), cols=("#e8a0d8", "#c8e060"))
    vignette_kind(c, "death", col="#030105", strength=0.85)


def _cap(c, x, y, rx, ry, ramp, light=(0.7, -0.7), gill="#10160a", spots=None, spot_col=None, seed=1, under=True):
    """a toadstool cap (dome) centred at (x, y) = the cap's rim line; rx wide, ry tall; shaded from `light`
    (dx, dy toward the light) with a dark gilled underside.  ramp = dark -> light."""
    rr = random.Random(seed)
    for yy in range(int(y - ry) - 1, int(y) + 1):
        for xx in range(int(x - rx), int(x + rx) + 1):
            nx_, ny_ = (xx - x) / rx, (yy - y) / ry
            if nx_ * nx_ + ny_ * ny_ <= 1.0 and yy <= y:
                t = 0.52 + 0.42 * (nx_ * light[0] + ny_ * light[1]) - 0.15 * (nx_ * nx_ + ny_ * ny_)
                c.set(xx, yy, ramp_pick(ramp, clamp(t), xx, yy))
    if under:
        uh = max(1, int(ry * 0.22))
        for yy in range(int(y), int(y) + uh + 1):
            k = (yy - y) / max(1, uh)
            w = rx * (1 - 0.5 * k * k)
            for xx in range(int(x - w), int(x + w) + 1):
                c.set(xx, yy, gill)
                if (xx + yy) % 3 == 0 and yy < y + uh:
                    c.set(xx, yy, ramp[1])
    if spots and spot_col:
        for _ in range(spots):
            ang = rr.uniform(math.pi, 2 * math.pi)
            rad = rr.uniform(0.2, 0.8)
            sx_, sy_ = x + math.cos(ang) * rx * rad, y + math.sin(ang) * ry * rad
            c.rect(sx_, sy_, sx_ + 1, sy_, spot_col)


def _stem(c, x, y0, y1, w, ramp, light_left=True):
    """a shaded stem from y0 (under the cap) down to y1; wider at the foot."""
    for yy in range(int(y0), int(y1) + 1):
        k = (yy - y0) / max(1, y1 - y0)
        ww = w * (0.8 + 0.5 * k * k)
        for xx in range(int(x - ww), int(x + ww) + 1):
            t = 0.5 + 0.5 * ((xx - x) / max(1, ww)) * (-1 if light_left else 1) * -1
            t = 1.0 - clamp(abs(xx - x) / max(1.0, ww)) * 0.9 if light_left is None else clamp(0.15 + 0.7 * (1 - (xx - x + ww) / (2 * ww)))
            c.set(xx, yy, ramp_pick(ramp, t, xx, yy))


@ending("ork_end_claim_nurgle")
def ork_end_claim_nurgle(e):
    """BAD / Nurgle.  The Mushroom Field: a low view across a spore bed at the foot of the fort.  Giant toadstools frame
    the picture, a window of ochre light top right; the human lies on the soft soil, small mushrooms sprouting from the
    chest, knee and shoulder, skin gone a sweet green; a squig sniffs at a boot, far off an ork looks over a stalk.
    Nurgle ramp (green-ochre), flies and spores."""
    c = e.c
    HZ = 62
    sky(c, ["#0a1004", "#18220a", "#2e3e14", "#4e6420", "#7e9434", "#b4b85a"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#16200a", "#26340e", "#3e5018"], 0, 46, scale=0.05, thresh=0.5, stretch=4.0)
    glow(c, 140, 32, 54, ["#3e5018", "#6a8228", "#a0b040", "#d0d070", "#f4f0b0"], power=1.6, strength=0.95, ry=30)
    shafts(c, (140, 26), 100, 60, 6, 78, "#d0d070", t=0.18, seed=e.seed_for("sh"), w0=3, w1=11, power=0.8)
    # far fort wall and towers, soft in the haze
    _palisade(c, HZ + 4, 20, 130, "#1e2a10", lite="#5a7222", seed=e.seed_for("pal"), hmin=8, hmax=16, towers=[(34, 8, 26)])
    haze(c, HZ - 16, HZ + 12, "#8a9c3a", t=0.45, seed=e.seed_for("hz"), profile="mid")
    # ground: soft soil, lit from the right
    hband(c, HZ + 4, 107, ["#3e4e1c", "#2c3a12", "#1e2a0c", "#121a08", "#080c04"], seed=e.seed_for("gr"), rough=0.5)
    light_pool(c, 128, 82, 70, 12, "#a0b040", t=0.32)
    # background toadstools, getting darker and bigger toward the frame
    CAPD = ["#060a03", "#101808", "#1e2c0e", "#34481a", "#587426"]
    CAPL = ["#14200a", "#26380f", "#44601c", "#6e8c30", "#a4b852"]
    STEM = ["#0e1406", "#1c260c", "#32421a", "#546a26", "#7e9234"]
    for (x, y, rx, ry, sw, ramp, sd) in [(116, 72, 9, 5, 2, CAPL, 2), (160, 76, 13, 7, 3, CAPL, 3), (58, 74, 10, 6, 2, CAPD, 4),
                                         (96, 70, 7, 4, 2, CAPD, 1)]:
        _stem(c, x, y, y + 22, sw, STEM)
        _cap(c, x, y, rx, ry, ramp, seed=sd, spots=3, spot_col="#a4b852")
    # framing giants: left and right, dark, with the light catching only the inner edges
    _stem(c, 12, 40, 107, 7, STEM)
    _cap(c, 14, 38, 40, 28, CAPD, light=(0.9, -0.5), seed=7, spots=6, spot_col="#3e5418")
    _stem(c, 184, 44, 107, 8, STEM)
    _cap(c, 182, 42, 36, 26, CAPD, light=(-0.7, -0.6), seed=8, spots=5, spot_col="#3e5418")
    # an ork looks over the stalk, tiny and dark
    _put_ork(c, 108, 84, 20, "stand", "#0e1406", facing=-1)
    # the human on the soft soil, green-skinned, big enough to read
    me = _lying(78, "#3e4026", "#d8b040", skin="#8aa458")
    me = rim(me, "#c8d070", (1, -1))
    place(c, me, 86, 102, anchor="bm")
    # mushrooms growing out of the body: chest, shoulder, knee (few, bigger, readable)
    SK = dict(cap="#d8d070", stem="#a0964c", lite="#fffbc0", spots="#fffbc0")
    for (mx_, my_, hh_) in [(66, 92, 10), (74, 93, 6), (102, 83, 8), (56, 96, 5)]:
        _mushroom(c, mx_, my_, hh_, **SK)
    # a squig sniffing at the boot
    sq = _squig_img(1, mirror=True, tint_to="#2e3c12", tint_t=0.72)
    place(c, sq, 140, 106, anchor="bm")
    # flies and spores
    particles(c, "spore", 60, (0, 30, 191, 104), seed=e.seed_for("sp"), cols=("#d8d880", "#a0b040", "#7e9434"))
    rr = e.rng("flies")
    for k in range(22):
        fx_, fy_ = rr.randint(40, 130), rr.randint(60, 98)
        c.set(fx_, fy_, "#060a02")
        if k % 3 == 0:
            c.set(fx_ + 1, fy_ - 1, "#060a02")
    vignette_kind(c, "bad", col="#050802", strength=0.8)


def _glint(c, x, y, col="#ffffff", r=2):
    """a four-point sparkle, r px arms."""
    c.set(x, y, col)
    for k in range(1, r + 1):
        for (dx, dy) in ((k, 0), (-k, 0), (0, k), (0, -k)):
            blend(c, x + dx, y + dy, col, 0.9 if k == 1 else 0.55, 2)


@ending("ork_end_claim_slaanesh")
def ork_end_claim_slaanesh(e):
    """BAD / Slaanesh.  Never Shiny Enough: a dim scrap hall; a tall mirror in a rusted frame floods the room with magenta
    and silver.  The human stands at its edge, back to us, rag in hand, a dark coat; in the glass the reflection is
    too tall, too slender, too perfect, and is looking out at us.  Polished guns, teeth and goggles on a bench with
    glints; two Flash Gitz applaud in the dark.  Slaanesh ramp: magenta / silver."""
    c = e.c
    S = GOD["slaanesh"]["ramp"]
    # the hall: rusted plates, dark violet-brown, lit from the right
    for y in range(108):
        for x in range(192):
            t = clamp(0.10 + 0.22 * (x / 192.0) + (e.noise("w").fbm(x * 0.05, y * 0.08, 3) - 0.5) * 0.3)
            c.set(x, y, ramp_pick(["#0c0610", "#1a0e1c", "#2a1a26", "#3c2630"], t, x, y))
    for x in range(0, 192, 24):                                          # wall seams
        c.rect(x, 0, x, 76, "#0a050c")
    for y in (18, 46, 74):
        c.rect(0, y, 191, y, "#0a050c")
    hband(c, 76, 107, ["#2a1830", "#1a0e22", "#100816", "#08040c"], seed=e.seed_for("fl"), rough=0.2)
    # the mirror: arched, rust frame, a gradient of silver and magenta, a halo of light
    mx0, mx1, my0, my1 = 100, 164, 6, 92
    glow(c, 132, 50, 96, ["#1a0a28", "#3a1058", "#7a2a9a", "#c850c8", "#ff8ad8"], power=1.4, strength=0.85, ry=64)

    def in_mirror(x, y):
        if not (mx0 + 4 <= x <= mx1 - 4 and my0 + 4 <= y <= my1 - 4):
            return False
        r = (mx1 - mx0) / 2 - 4
        if y < my0 + 4 + r:
            return ((x - 132) ** 2 + (y - (my0 + 4 + r)) ** 2) <= r * r
        return True
    c.rect(mx0, my0 + 30, mx1, my1, "#4a2a1c")
    for y in range(my0, my0 + 34):                                         # arch of the frame
        for x in range(mx0, mx1 + 1):
            if ((x - 132) ** 2 + (y - (my0 + 32)) ** 2) <= 32 * 32:
                c.set(x, y, "#4a2a1c")
    for y in range(my0, my1 + 1):
        for x in range(mx0, mx1 + 1):
            if in_mirror(x, y):
                t = clamp(0.35 + 0.55 * (1 - (y - my0) / (my1 - my0)) * (0.6 + 0.4 * math.sin((x - mx0) * 0.12)))
                c.set(x, y, ramp_pick(["#3a1058", "#7a2a9a", "#c850c8", "#ff8ad8", "#e8e8f8"], t, x, y))
    for y in range(my0, my1 + 1):                                          # rust frame: bolts, a lit edge
        for x in range(mx0, mx1 + 1):
            if not in_mirror(x, y) and c.get(x, y) == (0x4a, 0x2a, 0x1c):
                if (x + y) % 9 == 0:
                    c.set(x, y, "#a8683a")
    for k in range(7):
        c.set(mx0 + 1, my1 - 6 - k * 10, "#d8a060")
    # a diagonal sheen across the glass
    for y in range(my0 + 8, my1 - 8):
        for x in range(mx0 + 6, mx1 - 6):
            if in_mirror(x, y) and abs((x - mx0) - (y - my0) * 0.55 - 24) < 3:
                blend(c, x, y, "#ffffff", 0.45, 3)
    # the reflection: tall, slender, silver, facing out; shaded white -> lilac, magenta rim, a soft halo
    rx_ = 126
    refl = figure(72, "stand", "#e8e8f8", facing=-1, thick=0.78, lean=0, robe=0.55)
    light_pool(c, rx_ + 2, 54, 26, 42, "#ffffff", t=0.34)
    rimg = refl["img"]
    rpx, rpy = int(rx_ - rimg.width // 2), int(90 - rimg.height)
    ma = rimg.getchannel("A").load()
    for j in range(rimg.height):
        for i in range(rimg.width):
            if ma[i, j] >= 128:
                t = clamp(0.15 + 0.85 * (i / max(1, rimg.width - 1)) + 0.15 * (j / rimg.height))
                c.set(rpx + i, rpy + j, ramp_pick(["#ffffff", "#e8e8f8", "#c8b0e0", "#a070c8"], t * 0.9, rpx + i, rpy + j))
    for j in range(rimg.height):                                 # magenta rim on the lit (left) edge
        for i in range(rimg.width):
            if ma[i, j] >= 128 and (i == 0 or ma[i - 1, j] < 128):
                c.set(rpx + i, rpy + j, "#ff8ad8")
    fh = refl["head"]
    hx_, hy_ = rpx + int(fh[0]), rpy + int(fh[1])
    c.rect(hx_ - 1, hy_ - 1, hx_ + 1, hy_ + 1, "#ffffff")
    _glint(c, hx_ - 5, hy_ - 7, "#ffffff", 3)                       # a crown of light
    _glint(c, hx_ + 8, hy_ + 4, "#ffc8f0", 2)
    # the human, back to us, dark against the glow, rag raised to the glass
    me = player_fig("slaanesh" if False else "orks", 44, "reach", facing=1)
    me["img"] = tint(me["img"], "#0a0410", 0.8)
    mpx, mpy = put_figure(c, me, 82, 98, rim_col="#ff8ad8", toward=(1, -1),
                          shadow=dict(toward_light=(1, 0.2), length=1.2, squash=0.3, col="#05020a", t=0.6))
    hnd = me["hands"][0]
    c.rect(mpx + int(hnd[0]), mpy + int(hnd[1]) - 1, mpx + int(hnd[0]) + 3, mpy + int(hnd[1]) + 2, "#f0e8f8")        # the rag
    # pipes and polished trophies on chains overhead
    for (py_, col) in [(7, "#2a1a22"), (12, "#1a0e16")]:
        c.rect(0, py_, 99, py_ + 2, col)
        c.rect(0, py_, 99, py_, "#5a3a44")
    for (cx_, ln) in [(18, 22), (40, 14), (70, 26), (88, 10)]:
        c.line([(cx_, 14), (cx_, 14 + ln)], "#3a2a34")
        c.ellipse(cx_, 14 + ln + 2, 2, 2, "#e0d8e8")
        _glint(c, cx_ - 1, 14 + ln + 1, "#ffffff", 2)
    # a bench with the polished things, glinting
    c.rect(4, 82, 60, 85, "#1a0e12")
    c.rect(6, 85, 8, 101, "#120a0e")
    c.rect(56, 85, 58, 101, "#120a0e")
    c.rect(4, 82, 60, 82, "#c8a068")
    c.line([(8, 79), (36, 72)], "#e0e0e8", width=2)                       # a gun, polished
    c.rect(34, 70, 40, 76, "#b8b8c8")
    c.rect(7, 78, 10, 81, "#b8b8c8")
    for (gx, gy) in [(14, 79), (20, 79), (26, 79)]:                          # teeth in a row
        c.rect(gx, gy, gx + 2, gy + 2, "#f4f0e8")
    c.ellipse(46, 78, 4, 4, "#e0e0ee")                                       # goggles
    c.ellipse(55, 78, 4, 4, "#e0e0ee")
    c.ellipse(46, 78, 2, 2, "#7a2a9a")
    c.ellipse(55, 78, 2, 2, "#7a2a9a")
    for (gx, gy, rr_) in [(21, 70, 3), (38, 68, 3), (47, 72, 2), (10, 76, 2)]:
        _glint(c, gx, gy, "#ffffff", rr_)
    # two Flash Gitz clapping in the glow, right of the mirror: black, gold rimmed
    for (ox_, oy_, h_, fc) in [(178, 96, 44, -1), (190, 100, 36, -1)]:
        _put_ork(c, ox_, oy_, h_, "cheer", "#0a0510", facing=fc, rim_col="#e0b850", toward=(-1, -1))
    c.rect(171, 76, 172, 78, "#f4d870")                                     # gold teeth glint
    _glint(c, 182, 62, "#f4d870", 2)
    # a pool of the reflection on the floor
    light_pool(c, 132, 98, 40, 6, "#ff8ad8", t=0.45)
    particles(c, "mote", 40, (60, 10, 180, 100), seed=e.seed_for("mo"), cols=("#ffc8f0", "#e8e8f8", "#ff8ad8"))
    vignette_kind(c, "bad", col="#08030e", strength=0.7)


def _cog_mask(d, cx, cy, r, teeth, val, hub=0.35, spokes=6, hole=True):
    """draw a cogwheel on a PIL 'L' draw object: body disc, teeth, hub hole and spokes; val = grey value."""
    for k in range(teeth):
        a = 2 * math.pi * k / teeth
        tx, ty = cx + math.cos(a) * (r + 2), cy + math.sin(a) * (r + 2)
        d.polygon([(cx + math.cos(a - 0.14) * r, cy + math.sin(a - 0.14) * r), (tx - math.sin(a) * 1.5, ty + math.cos(a) * 1.5),
                   (tx + math.sin(a) * 1.5, ty - math.cos(a) * 1.5), (cx + math.cos(a + 0.14) * r, cy + math.sin(a + 0.14) * r)], fill=val)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=val)
    if hole:
        rr = r * (1 - 0.35)
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=0)
        for k in range(spokes):
            a = 2 * math.pi * k / spokes + 0.3
            d.line([(cx, cy), (cx + math.cos(a) * rr, cy + math.sin(a) * rr)], fill=val, width=2)
        d.ellipse([cx - r * hub, cy - r * hub, cx + r * hub, cy + r * hub], fill=val)


@ending("ork_end_claim_tzeentch")
def ork_end_claim_tzeentch(e):
    """BAD / Tzeentch.  The Changing Machine: a Mek's workshop; a machine of rusted ork scrap (cogs, tank, pipes, piston)
    is half-way through changing: its left side is rust and hazard stripes, its right side crisp blue crystal that is
    still rearranging, pink threads running from an open door of light behind it to pieces that drift off.  The human,
    small, back to us, reaches up toward it.  Tzeentch ramp (blue / pink-violet)."""
    from PIL import ImageDraw
    c = e.c
    T = GOD["tzeentch"]["ramp"]
    # workshop: dark rust-brown walls, blue spill from the door on the right
    for y in range(108):
        for x in range(192):
            t = clamp(0.12 + 0.30 * (x / 192.0) ** 1.4 + (e.noise("w").fbm(x * 0.05, y * 0.07, 3) - 0.5) * 0.25)
            c.set(x, y, ramp_pick(["#0a0608", "#180e12", "#241420", "#2a1a38"], t, x, y))
    for x in range(0, 192, 20):
        c.rect(x, 0, x, 70, "#0a0608")
    hband(c, 74, 107, ["#1a1230", "#10082a", "#0a0620", "#05030f"], seed=e.seed_for("fl"), rough=0.2)
    for x in range(-40, 230, 14):                                            # grating lines in perspective
        c.line([(96 + (x - 96) * 0.25, 74), (x, 107)], "#0a0618")
    # the door: an arch of white-blue light behind the machine, upper right
    dx0, dx1, dy0, dy1 = 118, 176, 4, 80

    def in_door(x, y):
        if not (dx0 <= x <= dx1 and dy0 <= y <= dy1):
            return False
        r = (dx1 - dx0) / 2
        if y < dy0 + r:
            return (x - (dx0 + r)) ** 2 + (y - (dy0 + r)) ** 2 <= r * r
        return True
    glow(c, 147, 44, 80, ["#07040f", "#0a1e7a", "#1a5ad8", "#2ab8ff"], power=1.6, strength=0.5, ry=64)
    for y in range(dy0, dy1 + 1):
        for x in range(dx0, dx1 + 1):
            if in_door(x, y):
                t = clamp(0.30 + 0.55 * (1 - (y - dy0) / (dy1 - dy0)) * (1 - abs(x - 147) / 40.0) + 0.06 * math.sin(x * 0.3))
                c.set(x, y, ramp_pick(["#0a1e7a", "#1a5ad8", "#2ab8ff", "#9af6ff", "#ffffff"], t, x, y))
    for y in range(dy0 - 2, dy1 + 1):                                        # dark jamb around the door
        for x in range(dx0 - 3, dx1 + 4):
            if not in_door(x, y) and (in_door(x + 3, y) or in_door(x - 3, y) or in_door(x, y + 3) and y < dy0 + 30 or in_door(x, y - 3) and y < dy0 + 30):
                c.set(x, y, "#0a0618")
    shafts(c, (147, 70), 100, 80, 7, 70, "#9af6ff", t=0.18, seed=e.seed_for("sh"), w0=3, w1=14, power=0.8, floor=105)
    # the machine on a grey layer
    mk = Image.new("L", (192, 108), 0)
    d = ImageDraw.Draw(mk)
    d.rectangle([44, 52, 76, 92], fill=150)                                  # tank
    d.rectangle([48, 46, 72, 52], fill=120)
    _cog_mask(d, 104, 62, 24, 14, 170, spokes=6)                             # big cog
    _cog_mask(d, 76, 82, 13, 10, 130, spokes=5)                              # small cog
    d.rectangle([122, 26, 131, 92], fill=140)                                # piston
    d.rectangle([118, 22, 135, 30], fill=180)
    d.rectangle([60, 22, 150, 27], fill=120)                                 # gantry
    d.line([(70, 27), (70, 40)], fill=120, width=2)
    d.polygon([(66, 40), (74, 40), (72, 46), (68, 46)], fill=150)
    d.line([(76, 70), (96, 80), (118, 78)], fill=110, width=3)               # pipes
    d.line([(60, 52), (60, 36), (90, 30)], fill=110, width=3)
    d.rectangle([86, 90, 140, 94], fill=100)                                 # base
    mp = mk.load()
    shape = {(x, y): mp[x, y] for y in range(108) for x in range(192) if mp[x, y] > 0}
    RUST = ["#120a08", "#2e1a12", "#5a3218", "#8a5222", "#c08a3a", "#e8c070"]
    for (x, y), v in shape.items():
        lv = v / 255.0 + (80 - x) * 0.003 - (y - 60) * 0.0025
        if (x + 1, y - 1) not in shape:
            lv += 0.22
        if (x - 1, y + 1) not in shape:
            lv -= 0.18
        lv += (e.noise("rust").fbm(x * 0.2, y * 0.2, 2) - 0.5) * 0.2
        # morph parameter: left = rust (0), right = crystal (1), a ragged diagonal boundary
        m = clamp((x - 78 + (y - 60) * 0.25) / 30.0)
        crystal = bayer(x, y) < m
        if crystal:
            tt = clamp(lv * 1.0 - 0.12)
            col = ramp_pick(["#05030c", "#0a1e7a", "#1a5ad8", "#2ab8ff", "#9af6ff"], tt, x, y)
            if (x + 2 * y) % 11 == 0 and m > 0.4:
                col = C("#e83aa8")                                           # a pink thread of change
        else:
            col = ramp_pick(RUST, clamp(lv), x, y)
            if (x // 4 + y // 4) % 2 == 0 and y > 80 and 44 < x < 76 and False:
                col = C("#c8a030")
        c.set(x, y, col)
    for k in range(5):                                                       # hazard stripes on the tank foot + rivets
        c.rect(46 + k * 6, 86, 49 + k * 6, 90, "#c8a030")
    for (rx_, ry_) in [(48, 56), (72, 56), (48, 70), (72, 70)]:
        c.set(rx_, ry_, "#e8c070")
    # threads and drifting pieces toward the upper left
    rr = e.rng("pieces")
    pieces = []
    for k in range(11):
        a = rr.uniform(math.pi * 1.0, math.pi * 1.6)
        dist = rr.uniform(26, 62)
        px_ = 100 + math.cos(a) * dist * 1.3
        py_ = 40 + math.sin(a) * dist * 0.75
        pieces.append((px_, py_))
    for (px_, py_) in pieces:
        c.line([(100, 52), (px_, py_)], "#e83aa8" if rr.random() < 0.4 else "#2ab8ff")
    for k, (px_, py_) in enumerate(pieces):
        if 0 <= px_ < 180 and 0 <= py_ < 100:
            s_ = rr.randint(2, 4)
            if k % 3 == 0:
                c.poly([(px_, py_ - s_), (px_ + s_, py_), (px_, py_ + s_), (px_ - s_, py_)], "#9af6ff")
                c.set(px_, py_, "#ffffff")
            elif k % 3 == 1:
                c.poly([(px_ - s_, py_ + s_), (px_, py_ - s_), (px_ + s_, py_ + s_)], "#2ab8ff")
                c.set(px_, py_, "#ffffff")
            else:
                c.rect(px_ - s_, py_ - 1, px_ + s_, py_ + 1, "#e83aa8")
                c.set(px_ - s_, py_ - 1, "#ffc8f0")
    # the human: back to us, dark, rim-lit by the door, reaching up
    me = player_fig("orks", 40, "reach", facing=1)
    me["img"] = tint(me["img"], "#0a0618", 0.8)
    put_figure(c, me, 34, 100, rim_col="#9af6ff", toward=(1, -1),
               shadow=dict(toward_light=(1, 0.25), length=1.3, squash=0.3, col="#02010a", t=0.6))
    light_pool(c, 147, 98, 40, 6, "#9af6ff", t=0.4)
    e.protect += ["#9af6ff", "#e83aa8"]
    particles(c, "mote", 40, (0, 0, 180, 100), seed=e.seed_for("mo"), cols=("#9af6ff", "#e83aa8", "#ffffff"))
    vignette_kind(c, "bad", col="#05030c", strength=0.7)


def _skull(c, x, y, col="#e8dcc0", eye="#2a060c", big=True):
    """a small skull: 4x4 (cranium, two eye pits, jaw) or 2x2 when big=False."""
    if not big:
        c.rect(x, y, x + 1, y + 1, col)
        return
    for (dx, dy) in [(1, 0), (2, 0), (0, 1), (1, 1), (2, 1), (3, 1), (1, 2), (2, 2), (1, 3), (2, 3)]:
        c.set(x + dx, y + dy, col)
    c.set(x + 1, y + 1, eye)
    c.set(x + 2, y + 1, eye)


@ending("ork_end_claim_khorne")
def ork_end_claim_khorne(e):
    """BAD / Khorne.  The War That Never Stops: a plain under a low red sun, orks and humans mixed in one endless melee
    along the horizon, banners of red rag; the human, huge in the foreground, running into it with a captured choppa,
    black against the sun.  Skulls underfoot.  Khorne ramp (red / ember)."""
    c = e.c
    K = GOD["khorne"]["ramp"]
    HZ = 66
    sky(c, ["#10040a", "#2a060c", "#521010", "#8a1e12", "#c8441c", "#ec8a2c", "#ffc060"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#1a0508", "#340a0c", "#521010"], 0, 46, scale=0.05, thresh=0.5, stretch=4.5)
    sx_, sy_ = 70, HZ - 2
    glow(c, sx_, sy_, 76, ["#521010", "#8a1e12", "#c8441c", "#ec8a2c", "#ffc060", "#fff0b0"], power=1.4, strength=1.0, ry=48)
    c.ellipse(sx_, sy_, 15, 15, "#fff0b0")
    c.ellipse(sx_, sy_, 11, 11, "#ffffe0")
    # dust and smoke along the horizon
    haze(c, HZ - 18, HZ + 6, "#c8441c", t=0.5, seed=e.seed_for("hz"), profile="mid")
    # far ridge and ground
    ridge(c, HZ + 4, 1, 4, "#3a0c0c", seed=e.seed_for("rg"), fill_to=HZ + 8)
    hband(c, HZ + 4, 107, ["#5a1a10", "#3e1010", "#2a0a0a", "#160506", "#0a0204"], seed=e.seed_for("gr"), rough=0.45)
    # banners of red rag on poles
    for (bx, bh) in [(118, 30), (150, 24), (30, 20)]:
        c.line([(bx, HZ + 6), (bx, HZ + 6 - bh)], "#120405")
        for j in range(8):
            c.rect(bx + 1 + j, HZ + 6 - bh + 1 + (j * j) // 8, bx + 2 + j, HZ + 6 - bh + 4 + (j * j) // 8, "#8a1e12")
    # the melee along the horizon: orks and humans in knots, small and dark, rim-lit by the sun on their left flank
    rr = e.rng("melee")
    rows = [(HZ + 8, 17, 14), (HZ + 13, 22, 12), (HZ + 19, 28, 10)]
    for (yy, hh, n_) in rows:
        for k in range(n_):
            xx = rr.randint(4, 188)
            if abs(xx - 70) < 20 and yy > HZ + 10:
                continue
            if rr.random() < 0.5:
                pz = rr.choice(["raise", "charge", "cheer"])
                im_ = _put_ork(c, xx, yy, hh + rr.randint(-2, 3), pz, "#10050a", facing=rr.choice((1, -1)))
            else:
                f_ = fig(hh + rr.randint(-4, 1), rr.choice(["run", "arms_up", "walk"]), "#10050a", facing=rr.choice((1, -1)))
                put_figure(c, f_, xx, yy, rim_col=None)
                im_ = f_["img"]
            if xx < 130:
                _lit_by(c, im_, xx - im_.width // 2, yy - im_.height, (sx_, sy_), 110, "#c8441c", t=0.6)
    # skulls scattered, bigger toward the viewer
    for k in range(34):
        sx2, sy2 = rr.randint(2, 188), rr.randint(HZ + 14, 104)
        _skull(c, sx2, sy2, col="#e0c8a0" if sy2 > 90 else "#a88868", big=sy2 > 84)
    # the human, huge, black against the sun, charging with a captured choppa
    me = player_fig("orks", 74, "run", facing=1)
    me["img"] = tint(me["img"], "#10050a", 0.88)
    mpx, mpy = put_figure(c, me, 82, 106, rim_col="#ffc060", toward=(-1, -1))
    hnd = me["hands"][0]
    hx0, hy0 = mpx + hnd[0], mpy + hnd[1]
    c.line([(hx0, hy0), (hx0 - 14, hy0 - 16)], "#10050a", width=2)                              # choppa haft
    c.poly([(hx0 - 14, hy0 - 16), (hx0 - 22, hy0 - 22), (hx0 - 20, hy0 - 10), (hx0 - 12, hy0 - 12)], "#10050a")
    c.line([(hx0 - 22, hy0 - 22), (hx0 - 20, hy0 - 10)], "#ffc060")                              # edge catches the sun
    particles(c, "ember", 50, (0, 20, 191, 104), seed=e.seed_for("em"), cols=("#ffc060", "#ec8a2c", "#c8441c"), wind=(1, 1))
    vignette_kind(c, "bad", col="#0a0204", strength=0.75)


@ending("ork_end_collaborator")
def ork_end_collaborator(e):
    """BAD.  Collaborator: the end of a trench, one-point perspective, cold blue-grey, closing in.  At the vanishing point
    a strip of sick green-yellow sky: the orks' fires, far off, where their roar comes from.  Mid-trench the commissar
    (long black coat, peaked cap) stands with his arm out; the muzzle flash, the only warm thing, lights the kneeling
    civilian in the coat of the route and throws their shadows on the sandbags.  No wound shown."""
    c = e.c
    VX, VY = 96, 50
    FL = 87                                              # floor half-width at the bottom = full width
    # sky wedge above the parapets
    sky(c, ["#0a0e18", "#161e30", "#2c3a4a", "#4a5a50", "#7a8a4a", "#a8b04a"], 0, VY + 2)
    clouds(c, e.seed_for("cl"), ["#0e1420", "#1a2436", "#2c3a4a"], 0, 30, scale=0.06, thresh=0.5, stretch=4.0)
    glow(c, VX, VY - 2, 40, ["#2c3a4a", "#4a5a40", "#7a8a30", "#a8b04a", "#d8d870"], power=1.4, strength=0.8, ry=12)
    # far ork silhouettes + banner poles at the end of the trench
    for (ox_, h_) in [(86, 9), (94, 12), (103, 8), (110, 11)]:
        _put_ork(c, ox_, VY + 2, h_, "raise", "#0a0e12", facing=1 if ox_ < 98 else -1)
    c.line([(98, VY + 2), (98, VY - 14)], "#0a0e12")
    # walls: parapet line, wall base, sandbag rows in perspective
    def wall_top(x):                                    # y of the parapet edge at pixel x (0..VX)
        k = 1 - abs(x - VX) / VX
        return 12 + (VY - 8 - 12) * k
    for y in range(0, 108):
        for x in range(192):
            k = abs(x - VX) / VX                       # 1 at the frame edge, 0 at the vanishing point
            if y >= wall_top(x) and y <= VY + (107 - VY) * 1.0 and (y <= VY + (107 - VY) * k or True):
                # the floor edge line: floor occupies |x-VX| < FL*(y-VY)/(107-VY)
                fw = (y - VY) / (107 - VY) * FL if y >= VY else -1
                if abs(x - VX) <= fw:
                    continue
                t = clamp(0.30 - 0.18 * (1 - k) + (e.noise("wl").fbm(x * 0.08, y * 0.08, 3) - 0.5) * 0.25)
                c.set(x, y, ramp_pick(["#06080e", "#0e1420", "#1a2230", "#2c3644"], t, x, y))
    BAG = ["#10141c", "#1c2430", "#2c3846", "#46586a"]
    for side in (-1, 1):
        for r in range(8):
            y0 = 8 + r * 14
            kk = 1.0
            n_ = 0
            while kk > 0.12:
                x = VX + side * VX * kk
                y = VY + (y0 - VY) * kk
                w_ = max(2, int(15 * kk))
                h_ = max(1, int(6 * kk))
                if 0 <= y < 108 and y > wall_top(x) - 3:
                    tone = BAG[min(3, int(kk * 3.2))]
                    c.ellipse(x - side * w_ // 2, y, w_ // 2 + 1, h_, tone)
                    c.line([(x - side * w_ + 0, y - h_), (x - side * 1, y - h_)], BAG[min(3, int(kk * 3.2) + 1)] if kk > 0.3 else tone)
                kk *= 0.80
                n_ += 1
    # parapet rim catching a little cold light
    for x in range(192):
        c.set(x, int(wall_top(x)), "#5a6a7a")
    # floor: duckboards in perspective, wet
    for y in range(VY + 1, 108):
        fw = (y - VY) / (107 - VY) * FL
        for x in range(int(VX - fw), int(VX + fw) + 1):
            k = (y - VY) / (107 - VY)
            row = int(math.log(max(k, 0.02)) / math.log(0.88))
            t = clamp(0.28 + 0.15 * k - 0.1 * ((x - VX) / max(1, fw)) ** 2 + (e.noise("fl").fbm(x * 0.1, y * 0.3, 2) - 0.5) * 0.2)
            if row % 2 == 0:
                t -= 0.08
            c.set(x, y, ramp_pick(["#0a0e14", "#141c28", "#222c3a", "#34445a"], t, x, y))
    for j in range(-6, 7):                                  # plank edges converging to the VP
        c.line([(VX + j * 3, VY + 1), (VX + j * 34, 107)], "#080c12")
    # the muzzle flash lights the scene; the two figures
    fx_, fy_ = 88, 64
    light_pool(c, fx_ + 4, fy_ + 10, 44, 24, "#ffe9a0", t=0.30)
    glow(c, fx_, fy_, 8, ["#6a5a30", "#c8a850", "#ffe9a0", "#ffffff"], power=1.6, strength=0.7)
    # the civilian, kneeling, head bowed, facing right (toward the commissar)
    me = player_fig("orks", 36, "kneel", facing=1)
    me["img"] = tint(me["img"], "#101420", 0.35)
    mpx, mpy = put_figure(c, me, 74, 92, rim_col="#ffe9a0", toward=(1, -0.3),
                          shadow=dict(toward_light=(1, 0.5), length=1.4, squash=0.35, col="#04060a", t=0.7))
    # the commissar, long coat and peaked cap, arm out to the left
    cm = figure(50, "reach", "#0a0d14", facing=-1, robe=0.75, thick=1.05)
    cpx, cpy = put_figure(c, cm, 118, 96, rim_col="#ffe9a0", toward=(-1, -0.2),
                          shadow=dict(toward_light=(-1, 0.5), length=1.4, squash=0.35, col="#04060a", t=0.7))
    hx_, hy_ = cm["head"]
    c.rect(cpx + int(hx_) - 4, cpy + int(hy_) - 6, cpx + int(hx_) + 3, cpy + int(hy_) - 4, "#0a0d14")       # cap
    c.rect(cpx + int(hx_) - 6, cpy + int(hy_) - 4, cpx + int(hx_) + 2, cpy + int(hy_) - 4, "#0a0d14")        # peak
    c.set(cpx + int(hx_) - 1, cpy + int(hy_) - 5, "#b8a050")
    hnd = cm["hands"][0]
    gx, gy = cpx + hnd[0], cpy + hnd[1]
    c.rect(int(gx) - 5, int(gy) - 1, int(gx), int(gy), "#0a0d14")                                             # the pistol
    fx_, fy_ = int(gx) - 8, int(gy) - 1
    # the flash: small white-yellow burst
    for (dx, dy, col) in [(0, 0, "#ffffff"), (-1, 0, "#fff0a0"), (1, 0, "#fff0a0"), (0, -1, "#fff0a0"), (0, 1, "#fff0a0"),
                          (-2, 0, "#ffc860"), (2, 0, "#ffc860"), (-3, 0, "#ffc860"), (0, -2, "#ffc860"), (0, 2, "#ffc860")]:
        c.set(fx_ + dx, fy_ + dy, col)
    e.protect += ["#ffffff", "#fff0a0"]
    # smoke wisp and cold breath of the trench: rain
    particles(c, "rain", 40, (0, 0, 191, 104), seed=e.seed_for("rn"), cols=("#4a5a70", "#6a7a90"), wind=(1, 1))
    vignette_kind(c, "bad", col="#04060c", strength=0.85)


def _patchwork(c, x, y_hip, lamp_col="#d8e070"):
    """a human sitting up on a slab, front-on, rebuilt: pale head and left arm, a big green right arm, green legs in
    ork boots, a stitched seam and a bolted plate on the chest, one yellow eye and a tusk.  Hips at (x, y_hip)."""
    SK = "#c0a47c"; SKD = "#8a7254"                                  # human skin
    GR = "#4a8a34"; GRD = "#2e5a22"; GRL = "#78b048"                    # ork skin
    # legs (green, thick), hanging over the edge
    for (lx, w_) in [(x - 9, 8), (x + 3, 8)]:
        c.rect(lx, y_hip, lx + w_, y_hip + 26, GR)
        c.rect(lx, y_hip, lx + 1, y_hip + 26, GRL)
        c.rect(lx + w_ - 1, y_hip, lx + w_, y_hip + 26, GRD)
        c.rect(lx - 1, y_hip + 26, lx + w_ + 3, y_hip + 31, "#2a2220")             # ork boot
        c.rect(lx - 1, y_hip + 26, lx + w_ + 3, y_hip + 26, "#6a5a4a")
        c.rect(lx + w_ - 1, y_hip + 29, lx + w_ + 3, y_hip + 31, "#8a8a80")       # steel toecap
        for k in range(3):                                                         # stitches around the shin
            c.rect(lx, y_hip + 12 + k * 3, lx + w_, y_hip + 12 + k * 3, GRD)
    c.rect(x - 9, y_hip + 11, x + 11, y_hip + 11, "#1a2a12")
    # torso: human, stitched, plate-patched
    c.poly([(x - 12, y_hip - 28), (x + 13, y_hip - 28), (x + 11, y_hip), (x - 11, y_hip)], SK)
    c.rect(x - 12, y_hip - 28, x - 12, y_hip, SKD)
    c.rect(x + 13, y_hip - 28, x + 13, y_hip, SKD)
    c.rect(x - 11, y_hip - 4, x + 11, y_hip, "#3a3028")                              # belt of scrap
    c.rect(x - 1, y_hip - 5, x + 3, y_hip - 1, "#c8a030")
    c.poly([(x + 1, y_hip - 24), (x + 11, y_hip - 24), (x + 10, y_hip - 12), (x + 1, y_hip - 13)], "#8a8a84")  # bolted plate
    for (px_, py_) in [(x + 2, y_hip - 23), (x + 9, y_hip - 23), (x + 2, y_hip - 14), (x + 9, y_hip - 14)]:
        c.set(px_, py_, "#d8d8d0")
    c.line([(x - 8, y_hip - 26), (x - 4, y_hip - 20), (x - 7, y_hip - 14), (x - 3, y_hip - 8)], "#3a2418")     # the seam
    for k in range(4):
        c.rect(x - 9 + (k % 2) * 4, y_hip - 24 + k * 5, x - 5 + (k % 2) * 4, y_hip - 24 + k * 5, "#3a2418")
    # arms: right (viewer's left) green and huge, hand flat on the slab; left (viewer's right) human, thin
    c.poly([(x - 12, y_hip - 28), (x - 22, y_hip - 22), (x - 25, y_hip - 4), (x - 15, y_hip - 4), (x - 12, y_hip - 16)], GR)
    c.rect(x - 26, y_hip - 5, x - 14, y_hip + 1, GR)
    c.rect(x - 26, y_hip - 5, x - 14, y_hip - 5, GRL)
    for k in range(3):
        c.rect(x - 26 + k * 4, y_hip + 1, x - 24 + k * 4, y_hip + 3, GRD)
    c.rect(x - 24, y_hip - 14, x - 15, y_hip - 14, GRD)
    c.poly([(x + 13, y_hip - 28), (x + 17, y_hip - 26), (x + 16, y_hip - 4), (x + 12, y_hip - 4)], SK)
    c.rect(x + 12, y_hip - 4, x + 17, y_hip, SKD)
    # head: human, pale, shaved, one yellow eye, one tusk
    c.ellipse(x + 1, y_hip - 36, 7, 8, SK)
    c.rect(x - 6, y_hip - 36, x - 6, y_hip - 34, SKD)
    c.rect(x - 4, y_hip - 43, x + 6, y_hip - 42, "#6a5a3a")                          # a rim of dark stubble on the crown
    c.rect(x - 3, y_hip - 37, x - 2, y_hip - 37, "#1a1208")
    c.rect(x + 3, y_hip - 37, x + 4, y_hip - 37, "#f2e04a")                          # the wrong eye
    c.rect(x - 2, y_hip - 31, x + 3, y_hip - 31, "#3a1a10")
    c.rect(x + 3, y_hip - 33, x + 3, y_hip - 31, "#f4ecd0")                          # a tusk where no tusk should be
    c.line([(x - 6, y_hip - 40), (x - 2, y_hip - 33)], "#3a2418")                    # stitch scar across the face


@ending("ork_end_dok")
def ork_end_dok(e):
    """BAD.  Da Dok's Masterpiece: an ork surgery under one hanging lamp, sick yellow-green light.  The human sits up on
    the slab: pale head and left arm, a huge green right arm, green legs in ork boots, a stitched seam, a bolted plate,
    one yellow eye and a tusk.  The Dok looms at the left edge, a dark bulk with a saw; tools and jars along the wall."""
    c = e.c
    # walls: rusted plates in dark olive, jars and tools on the back wall
    for y in range(108):
        for x in range(192):
            t = clamp(0.10 + 0.14 * (1 - abs(x - 110) / 110.0) + (e.noise("wl").fbm(x * 0.05, y * 0.09, 3) - 0.5) * 0.3)
            c.set(x, y, ramp_pick(["#06080a", "#0e140c", "#1a2412", "#2a3a1a"], t, x, y))
    for x in range(0, 192, 22):
        c.rect(x, 0, x, 70, "#05070a")
    for y in (24, 52):
        c.rect(0, y, 191, y, "#05070a")
    hband(c, 76, 107, ["#222e16", "#161e0e", "#0e140a", "#060806"], seed=e.seed_for("fl"), rough=0.25)
    # shelf of jars with green glow (left), rack of tools (right)
    c.rect(66, 30, 100, 31, "#3a3a2a")
    for k, jx in enumerate([70, 78, 86, 94]):
        c.rect(jx - 2, 20, jx + 2, 30, "#2a3a22")
        c.rect(jx - 1, 22, jx + 1, 28, ["#a8d050", "#c85a3a", "#a8d050", "#e0d090"][k])
        c.set(jx - 2, 21, "#d8e8a0")
    for (tx, kind) in [(150, 0), (158, 1), (166, 2), (174, 0), (182, 1)]:
        c.line([(tx, 14), (tx, 32 + kind * 4)], "#4a4a40")
        if kind == 0:
            c.rect(tx - 3, 32, tx + 3, 40, "#7a7a70")
            for q in range(4):
                c.set(tx - 3 + q * 2, 41, "#7a7a70")
        elif kind == 1:
            c.poly([(tx - 2, 36), (tx + 4, 36), (tx + 6, 46), (tx, 44)], "#6a6a60")
        else:
            c.line([(tx, 40), (tx - 4, 48)], "#7a7a70", width=2)
    # the slab + the lamp cone
    c.rect(66, 72, 176, 76, "#4a4e48")
    c.rect(66, 72, 176, 72, "#a8b09a")
    c.rect(72, 76, 76, 100, "#1a1c18")
    c.rect(166, 76, 170, 100, "#1a1c18")
    lamp_x = 116
    c.line([(lamp_x, 0), (lamp_x, 10)], "#10120e")
    c.poly([(lamp_x - 14, 22), (lamp_x + 14, 22), (lamp_x + 6, 10), (lamp_x - 6, 10)], "#1c2014")
    c.rect(lamp_x - 14, 22, lamp_x + 14, 22, "#e8f090")
    # cone of light: polygon from the lamp mouth to the slab, blended
    for y in range(22, 100):
        u = (y - 22) / 78.0
        half = 14 + 46 * u
        for x in range(int(lamp_x - half - 6), int(lamp_x + half + 6)):
            d = abs(x - lamp_x) / half
            if d < 1:
                blend(c, x, y, "#d8e070", 0.46 * (1 - d ** 2) * (0.5 + 0.5 * (1 - u)), 4)
    glow(c, lamp_x, 24, 16, ["#6a7a2a", "#c8d860", "#f4fa9c", "#ffffff"], power=1.5, strength=0.9)
    # the patient
    _patchwork(c, 120, 72)
    for (sx, sy, sw) in [(104, 78, 30), (150, 80, 14)]:                      # light spill on the slab top
        light_pool(c, sx + 14, 73, sw, 2, "#e8f090", t=0.5)
    cast_shadow(c, Image.new("RGBA", (24, 40), (0, 0, 0, 255)), 120, 72, anchor="bm", toward_light=(0.2, 0.9), length=0.1, squash=0.0,
                col="#040604", t=0.0)
    # the Dok looms at the left edge: a big dark bust, lamp light catching only the top of his head and shoulder
    dk = spr("ork", scale=2, tint_to="#06080a", tint_t=0.78, bottom_fade=0)
    dk = rim(dk, "#c8d860", (1, -1))
    place(c, dk, 36, 112, anchor="bm")
    c.rect(14, 44, 18, 46, "#f2e04a")                                         # a head-lamp or a gleam in the eye
    # saw in his hand, lowered
    c.rect(62, 79, 82, 82, "#8a8a84")
    for k in range(10):
        c.set(62 + k * 2, 83, "#8a8a84")
    c.rect(54, 78, 62, 84, "#3a2418")
    particles(c, "mote", 18, (60, 10, 190, 90), seed=e.seed_for("mo"), cols=("#e8f090", "#c8d860"))
    vignette_kind(c, "bad", col="#050804", strength=0.85)


# ------------------------------------------------------------------ GOOD

def _goggles(c, x, y, lens="#f6e27a", brass="#b8842c"):
    """pair of brass goggles pushed up on the forehead, x, y = centre between the lenses."""
    c.rect(x - 4, y, x + 4, y, brass)
    for dx in (-2, 2):
        c.ellipse(x + dx, y, 2, 2, brass)
        c.set(x + dx, y, lens)
        c.set(x + dx - 1, y - 1, "#ffffff")


@ending("ork_end_big_umie")
def ork_end_big_umie(e):
    """GOOD.  Toof 'Umie: a scrapyard workshop in warm afternoon light.  An imperial shuttle hull, half cannibalised and
    patched with hazard-yellow ork plate, with a welding arc at its flank; the human Mek works at it, goggles pushed up
    on the forehead; on the bench a jar of teeth and the Mek Wazgob looks on.  A ring of stones round the workspace:
    orks watch from beyond it and nobody steps in."""
    c = e.c
    HZ = 62
    sky(c, ["#2e2a1a", "#5a4424", "#8a6430", "#c08c40", "#e8b860"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#4a3a1e", "#6a4e28", "#8a6430"], 0, 40, scale=0.05, thresh=0.52, stretch=4.5)
    sx_, sy_ = 26, 40
    glow(c, sx_, sy_, 54, ["#8a6430", "#c08c40", "#e8b860", "#fce8b0"], power=1.5, strength=1.0, ry=34)
    c.ellipse(sx_, sy_, 6, 6, "#fffbe8")
    # far scrap towers and smoke, soft and warm
    rr = e.rng("far")
    for k in range(9):
        x = rr.randint(60, 191)
        h = rr.randint(10, 30)
        c.rect(x, HZ - h, x + rr.randint(2, 5), HZ + 2, "#5a4424")
        c.rect(x - 1, HZ - h, x + 4, HZ - h, "#5a4424")
    haze(c, HZ - 10, HZ + 8, "#c08c40", t=0.45, seed=e.seed_for("hz"), profile="mid")
    # ground: warm dust, darker toward the viewer
    hband(c, HZ + 2, 107, ["#7a5c2c", "#664a22", "#4e3818", "#382810", "#221808"], seed=e.seed_for("gr"), rough=0.4)
    # the shuttle hull: blue-grey, tilted, panels, patched with hazard plates
    hull = [(4, 74), (10, 50), (30, 38), (62, 34), (92, 42), (96, 66), (84, 78)]
    c.poly(hull, "#6a7a90")
    for y in range(34, 78):                                              # shading: lit from the upper left
        for x in range(4, 97):
            if c.get(x, y) == (0x6a, 0x7a, 0x90):
                t = clamp(0.62 - 0.0075 * (x - 4) + 0.006 * (y - 34) * -1 + (e.noise("h").fbm(x * 0.1, y * 0.1, 2) - 0.5) * 0.2)
                c.set(x, y, ramp_pick(["#3a4a62", "#4e6078", "#6a7a90", "#8e9eb4", "#b8c6d6"], t, x, y))
    for (x0, y0, x1, y1) in [(20, 42, 44, 66), (50, 40, 76, 58)]:        # panel seams
        c.rect(x0, y0, x1, y0, "#2c3a52")
        c.rect(x0, y1, x1, y1, "#2c3a52")
        c.rect(x0, y0, x0, y1, "#2c3a52")
        c.rect(x1, y0, x1, y1, "#2c3a52")
    c.rect(52, 62, 78, 74, "#d8b030")                                    # ork hazard patch
    for k in range(7):
        c.line([(52 + k * 4, 74), (58 + k * 4, 62)], "#1a1408")
    c.rect(52, 62, 78, 62, "#f6d868")
    c.rect(8, 62, 8, 74, "#a8683a")
    c.rect(8, 70, 16, 76, "#8a5a2a")                                     # rust patch plate
    c.rect(30, 30, 33, 38, "#4a5a72")                                    # a stubby antenna
    c.rect(24, 76, 90, 80, "#3a2a1c")                                    # trestles
    c.rect(24, 76, 90, 76, "#8a6a3a")
    c.rect(28, 80, 31, 92, "#2a1e12")
    c.rect(84, 80, 87, 92, "#2a1e12")
    # welding arc on the flank, white-hot, with sparks
    wx, wy = 66, 60
    glow(c, wx, wy, 14, ["#f2d48a", "#fff0a0", "#ffffff"], power=1.4, strength=1.0)
    for (dx, dy) in [(0, 0), (1, 0), (-1, 0), (0, 1), (0, -1), (2, 0), (-2, 0), (0, 2), (0, -2)]:
        c.set(wx + dx, wy + dy, "#ffffff")
    for k in range(18):
        a = rr.uniform(0, math.pi * 2)
        ln = rr.uniform(3, 11)
        c.set(wx + math.cos(a) * ln, wy + math.sin(a) * ln * 0.9 + k * 0.2, "#ffd060")
    # the ring of stones: a clear space round the workspace
    for k in range(40):
        a = k * math.pi * 2 / 40
        sx2, sy2 = 108 + math.cos(a) * 82, 96 + math.sin(a) * 9
        if 0 <= sx2 < 192 and sy2 > 84:
            c.rect(sx2, sy2, sx2 + 1, sy2 + 1, "#e8d49a" if k % 3 else "#6a4a24")
    # onlookers beyond the ring: orks and grots, warm dark silhouettes, nobody steps in
    for (ox_, oy_, h_, fc) in [(6, 86, 24, 1), (184, 86, 26, -1), (176, 76, 18, -1)]:
        _put_ork(c, ox_, oy_, h_, "stand", "#3a3a1c", facing=fc, rim_col="#f2d48a", toward=(-1, -1))
    _grot(c, 14, 100, "#2a2a14", flip=False, rim_col="#f2d48a")
    # the bench and its things
    c.rect(124, 82, 190, 86, "#6a4a2a")
    c.rect(124, 82, 190, 82, "#c89a58")
    c.rect(128, 86, 131, 104, "#3a2a18")
    c.rect(182, 86, 185, 104, "#3a2a18")
    # the Mek behind the bench
    mk = spr("ork_mek", scale=2, tint_to="#f2d48a", tint_t=0.12)
    place(c, mk, 166, 84, anchor="bm")
    # jar of teeth, glass bright, the teeth white
    c.rect(134, 72, 144, 82, "#c8e6e0")
    c.rect(134, 70, 144, 71, "#8a6a3a")
    c.rect(135, 73, 143, 81, "#a8c4bc")
    for (tx, ty) in [(136, 78), (138, 76), (140, 79), (142, 77), (137, 74), (141, 74), (139, 81), (143, 80)]:
        c.rect(tx, ty, tx + 1, ty + 1, "#fff8e8")
    c.rect(134, 72, 134, 82, "#ffffff")
    _glint(c, 145, 72, "#ffffff", 2)
    c.rect(150, 78, 158, 82, "#8a8a84")                                   # a spanner and a bolt box
    c.line([(160, 80), (172, 74)], "#b8b8b0", width=2)
    # the human Mek, goggles on the forehead, a spanner raised to the hull
    me = player_fig("orks", 54, "reach", facing=-1)
    mpx, mpy = put_figure(c, me, 112, 100, rim_col="#fff0b8", toward=(-1, -1),
                          shadow=dict(toward_light=(-1, 0.5), length=1.2, squash=0.3, col="#6a4a24", t=0.55))
    hx_, hy_ = me["head"]
    _goggles(c, mpx + int(hx_), mpy + int(hy_) - 4)
    hnd = me["hands"][0]
    c.line([(mpx + hnd[0], mpy + hnd[1]), (mpx + hnd[0] - 7, mpy + hnd[1] - 2)], "#c8c8c0", width=1)
    particles(c, "mote", 30, (0, 20, 191, 100), seed=e.seed_for("mo"), cols=("#fff0b8", "#fce8b0"))
    vignette_kind(c, "good", strength=0.50)


def _gunship(length=64):
    """a squat human gunship in side view, nose to the right (RGBA): fuselage, forward-swept wing, twin engine pods, a
    cockpit glint and a warm lit hatch.  Hull in dark blue-grey with a light top edge."""
    s = length / 64.0
    im = Image.new("RGBA", (int(length * 1.1) + 4, int(length * 0.55) + 4), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    P = lambda x, y: (x * s + 2, y * s + 2)  # noqa: E731
    hull, edge = (0x24, 0x2c, 0x3c, 255), (0x7a, 0x8c, 0xa8, 255)
    d.polygon([P(0, 20), P(10, 12), P(50, 10), P(64, 18), P(58, 26), P(8, 28)], fill=hull)           # fuselage
    d.polygon([P(24, 12), P(36, 0), P(44, 0), P(40, 12)], fill=hull)                                 # upper wing / fin
    d.polygon([P(20, 26), P(34, 36), P(44, 36), P(38, 26)], fill=hull)                               # lower wing
    d.rectangle([P(2, 16), P(14, 24)], fill=(0x1a, 0x20, 0x2c, 255))                                 # engine pod
    d.line([P(10, 12), P(50, 10), P(64, 18)], fill=edge)
    d.line([P(36, 0), P(44, 0)], fill=edge)
    d.polygon([P(52, 14), P(60, 17), P(54, 20)], fill=(0xff, 0xe0, 0x90, 255))                       # cockpit glint
    d.rectangle([P(30, 18), P(36, 24)], fill=(0xff, 0xc0, 0x60, 255))                                # warm hatch: someone inside
    return im


@ending("ork_end_evacuated")
def ork_end_evacuated(e):
    """GOOD.  A Few Days' Warning: the gunship breaks out of the top of the storm over Iskaron.  Below, a billowing dirty
    yellow-green cloud deck lit by fires, a black fleet of crude ork ships on the horizon; above, clear blue sky and a
    low gold sun.  The gunship climbs diagonally toward the sun with a long contrail, a warm hatch window glowing.  A
    small ringed planet (the next stop) hangs in the upper left."""
    c = e.c
    sky(c, ["#0a1636", "#142a5c", "#284e88", "#4e7aac", "#a89c70", "#e0a860"], 0, 70)
    clouds(c, e.seed_for("hi"), ["#284e88", "#3a64a0", "#5a84b4"], 0, 40, scale=0.04, thresh=0.58, stretch=5.0)
    sx_, sy_ = 164, 62
    glow(c, sx_, sy_, 48, ["#4e7aac", "#a89c70", "#e0a860", "#fff0b8", "#ffffff"], power=1.5, strength=1.0, ry=36)
    c.ellipse(sx_, sy_, 6, 6, "#fffbe8")
    planet(c, 30, 24, 10, ["#6a4a24", "#946a30", "#c89448", "#e8c070"], light=(0.6, -0.5), seed=e.seed_for("pl"))
    c.line([(14, 28), (46, 18)], "#e8d8a0")
    rr = e.rng("fleet")
    for k in range(10):                                                    # the black fleet: slim hulls, one orange dot each
        fx_, fy_ = 8 + k * 12 + rr.randint(-3, 3), 62 + rr.randint(-5, 3)
        c.poly([(fx_, fy_), (fx_ + 6, fy_ - 1), (fx_ + 7, fy_), (fx_ + 6, fy_ + 1)], "#0a0806")
        c.set(fx_ - 1, fy_, "#e8902a")
    # the storm deck: billowing, dark yellow-green with lit tops
    n = e.noise("deck")
    top = {}
    for x in range(192):
        top[x] = int(74 + 9 * n.fbm(x * 0.035, 0.3, 3) + 5 * math.sin(x * 0.11 + 1.0) * n.fbm(x * 0.09, 2.0, 2) - 5 * (x / 192.0))
    for x in range(192):
        for y in range(top[x], 108):
            dep = y - top[x]
            t = 0.42 - dep / 60.0 + (n.fbm(x * 0.05, y * 0.12, 4) - 0.5) * 1.1
            t += 0.22 * clamp(1 - dep / 5.0) * clamp(x / 192.0 + 0.3)
            c.set(x, y, ramp_pick(["#080a04", "#141a08", "#242c0c", "#3a4614", "#5e6e22", "#98a042", "#d8d078"], clamp(t), x, y))
    for (lx_, ly0, ly1) in [(34, 80, 100), (92, 84, 104), (150, 86, 104)]:          # lightning inside the deck
        lightning(c, e.seed_for("lg%d" % lx_), lx_, ly0, ly1, "#fff6c0", jag=3)
        glow(c, lx_, (ly0 + ly1) // 2, 14, ["#4a5a1c", "#98a042", "#e8e08a"], power=1.5, strength=0.55, ry=10)
    for k in range(10):                                                    # fires glowing inside the cloud
        fx_, fy_ = rr.randint(4, 170), rr.randint(88, 104)
        glow(c, fx_, fy_, 6, ["#2a2a0c", "#7a4a14", "#e8902a"], power=1.5, strength=0.9, ry=3)
    # the gunship climbing toward the sun, rim-lit, with a contrail down into the storm
    gs = _rot(rim(_gunship(66), "#fff0b8", (1, -1)), 20)
    gx_, gy_ = 118, 52
    for k in range(70):
        tx = gx_ - 26 - k * 1.5
        ty = gy_ + 20 + k * 0.56
        wd = max(0.0, 3.0 * (1 - k / 70.0))
        for dy in range(-int(wd), int(wd) + 1):
            blend(c, int(tx), int(ty) + dy, "#f4ecd0", 0.85 * (1 - k / 70.0), 3)
    place(c, gs, gx_, gy_, anchor="mm")
    glow(c, gx_ - 28, gy_ + 12, 7, ["#c86a2a", "#ffb040", "#ffe08a", "#ffffff"], power=1.4, strength=1.0)
    particles(c, "mote", 18, (0, 0, 191, 70), seed=e.seed_for("mo"), cols=("#ffffff", "#fff6d0"))
    vignette_kind(c, "good", strength=0.30)


@ending("ork_end_freebooter")
def ork_end_freebooter(e):
    """GOOD.  Freebooter: the stern deck of a pirate ship tearing out of Iskaron's green sky.  The whole planet, burning
    and roaring, fills the upper left; scrap rigging and a patched sail on the right; the human at the rail, turned to
    look back once, in a feathered hat much too big; Kaptin Redgob a broad black shape beside, hat-tossing arm out."""
    c = e.c
    # space with the stars, planet atmosphere glow
    for y in range(108):
        for x in range(192):
            c.set(x, y, "#060a1a")
    stars(c, e.seed_for("st"), 120, 0, 90, cols=("#6a7aa8", "#c8d4f0", "#ffffff"))
    glow(c, 50, 40, 84, ["#06141a", "#0e3a38", "#2a8a58", "#8ad08a", "#d8f0a0"], power=1.2, strength=1.0, ry=76)
    planet(c, 50, 40, 44, ["#1e3a14", "#3a6a1c", "#6a9a2c", "#a8c040", "#e0d870"], light=(0.6, -0.6), seed=e.seed_for("pl"), bands=0.25)
    # fires burning on the planet, and the long wound of one great Waaagh! glow
    rr = e.rng("fires")
    for k in range(60):
        a = rr.uniform(0, math.pi * 2)
        rad = rr.uniform(0, 40) ** 1.0
        fx_, fy_ = 50 + math.cos(a) * rad, 40 + math.sin(a) * rad
        if math.hypot(fx_ - 50, fy_ - 40) < 41 and (fx_ - 50) * 0.6 + (fy_ - 40) * -0.6 < 30:
            c.rect(fx_, fy_, fx_ + 1, fy_, "#ff8a2a")
            if k % 5 == 0:
                c.set(fx_, fy_ - 1, "#ffe08a")
    glow(c, 36, 54, 22, ["#7a2a0c", "#d8661c", "#ffb040", "#ffe08a"], power=1.5, strength=0.9, ry=14)
    for (ox_, oy_) in [(120, 20), (150, 30)]:
        c.rect(ox_, oy_, ox_ + 1, oy_, "#ffffff")
    # the pirate ship: foreground stern deck, planks lit green-orange from the planet
    hband(c, 82, 107, ["#7a5028", "#5e3c1c", "#44280e", "#2a1808", "#160c04"], seed=e.seed_for("dk"), rough=0.2)
    for x in range(-40, 240, 16):
        c.line([(96 + (x - 96) * 0.35, 82), (x, 107)], "#1e1206")
    for y in (86, 92, 99):
        c.rect(0, y, 191, y, "#1e1206")
    # rail, posts, rigging
    c.rect(0, 78, 191, 80, "#3a2412")
    c.rect(0, 78, 191, 78, "#a87a44")
    for x in range(6, 192, 22):
        c.rect(x, 74, x + 2, 88, "#2a1a0c")
        c.rect(x, 74, x, 88, "#8a6a3a")
    c.line([(184, 76), (152, 10)], "#1a1208")
    c.line([(120, 78), (152, 14)], "#1a1208")
    # mast and patched sail (right)
    c.rect(150, 2, 154, 80, "#2a1a0c")
    c.rect(150, 2, 150, 80, "#8a6a3a")
    c.rect(122, 12, 184, 14, "#2a1a0c")
    sail = [(126, 14), (182, 14), (180, 54), (160, 60), (140, 52), (128, 58)]
    c.poly(sail, "#8a7a4a")
    for (x0, y0, x1, y1, col) in [(130, 18, 150, 34, "#6a8a3a"), (154, 22, 176, 40, "#b86a2a"), (134, 38, 152, 52, "#4a5a2a"), (160, 42, 178, 52, "#a8984a")]:
        c.rect(x0, y0, x1, y1, col)
        c.rect(x0, y0, x1, y0, "#d8c890")
    for k in range(5):
        c.rect(126 + k * 12, 14, 127 + k * 12, 16 + k % 2, "#1a1208")
    for x in range(124, 182, 7):                                       # stitching between the patches
        c.set(x, 34, "#2a1a0c")
    light_pool(c, 60, 90, 60, 14, "#a8c040", t=0.28)
    # the human at the rail, turned back to look, feathered hat much too big
    me = player_fig("orks", 52, "stand", facing=-1)
    mpx, mpy = put_figure(c, me, 92, 100, rim_col="#c8e080", toward=(-1, -1),
                          shadow=dict(toward_light=(-1, 0.4), length=1.1, squash=0.3, col="#0a0804", t=0.6))
    hx_, hy_ = me["head"]
    hx_, hy_ = mpx + int(hx_), mpy + int(hy_)
    c.ellipse(hx_ + 1, hy_ - 5, 11, 2, "#5a2a1c")                         # brim
    c.poly([(hx_ - 6, hy_ - 6), (hx_ + 8, hy_ - 6), (hx_ + 6, hy_ - 14), (hx_ - 4, hy_ - 14)], "#7a3a24")
    c.rect(hx_ - 6, hy_ - 7, hx_ + 8, hy_ - 6, "#d8b040")               # hat band
    c.line([(hx_ + 6, hy_ - 13), (hx_ + 14, hy_ - 22), (hx_ + 20, hy_ - 20)], "#f4f0e0", width=2)        # plume
    c.line([(hx_ + 8, hy_ - 12), (hx_ + 16, hy_ - 18), (hx_ + 20, hy_ - 16)], "#e86a4a", width=1)
    c.rect(hx_ - 8, hy_ - 4, hx_ - 7, hy_ - 4, "#6a8a3a")                 # a green tint, creeping in? no: a glint of the face
    # Redgob: a broad dark ork next to him, arm out in the toss, lit from the planet side
    im_ = _put_ork(c, 134, 100, 62, "raise", "#12100a", facing=-1, rim_col="#c8e080", toward=(-1, -1),
                   shadow=dict(toward_light=(-1, 0.4), length=1.1, squash=0.3, col="#0a0804", t=0.6))
    particles(c, "mote", 20, (0, 0, 191, 100), seed=e.seed_for("mo"), cols=("#ffe08a", "#ff8a2a"))
    vignette_kind(c, "good", strength=0.3)
