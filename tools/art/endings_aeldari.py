"""SPEC §31 ending illustrations — Aeldari route (eld_*).  See endkit.py for the helper conventions."""
import math
import random
from reg import ending
from endkit import *


@ending("eld_end_lost")
def eld_end_lost(e):
    """BAD.  Lost in the Webway: the only warm thing in a cold, endless road of gates; the one who waits sits
    small on the path, tally scratches beside them, while a troupe of dancers passes in the distance and one
    of them stops, looks, pulls a face, and moves on."""
    c = e.c
    VX, VY = 96, 44
    # void: ink + violet / teal nebula, stars
    for y in range(108):
        for x in range(192):
            c.set(x, y, "#05051a")
    n1, n2 = e.noise("neb1"), e.noise("neb2")
    for y in range(108):
        for x in range(192):
            v = n1.fbm(x * 0.022, y * 0.04, 4)
            w = n2.fbm(x * 0.03 + 9, y * 0.05, 3)
            t = clamp((v - 0.48) * 3.0)
            if t > 0:
                c.set(x, y, ramp_pick(["#05051a", "#0c0a2a", "#1a1040", "#2a1456"], t * 0.9, x, y))
            t2 = clamp((w - 0.56) * 3.0) * clamp(1 - abs(y - 40) / 40.0)
            if t2 > 0:
                c.set(x, y, ramp_pick(["#05051a", "#08213a", "#0e4a5a"], t2, x, y))
    stars(c, e.seed_for("st"), 90, 0, 107, cols=("#5a6a9a", "#9aaad8", "#e8f0ff"))
    # faint web strands radiating from the far gate
    rr = e.rng("web")
    for k in range(26):
        a = rr.uniform(-math.pi, math.pi)
        ln = rr.uniform(50, 140)
        c.line([(VX, VY), (VX + math.cos(a) * ln, VY + math.sin(a) * ln * 0.7)], "#0e1c3a")
    # the road (bright far, dark near) with seams toward the vanishing point
    def road_hw(y):
        return 3 + (y - VY) * 0.95
    for y in range(VY, 108):
        hw = road_hw(y)
        for x in range(int(VX - hw), int(VX + hw) + 1):
            t = clamp((y - VY) / 62.0)
            edge = abs(x - VX) / hw
            col = ramp_pick(["#e6fffa", "#9adad8", "#4a7a96", "#2a3a6a", "#171a40"], t ** 0.7 * 0.95 + edge * 0.12, x, y)
            c.set(x, y, col)
    for k in range(-9, 10):                                     # long seams
        c.line([(VX + k * 0.5, VY + 1), (VX + k * 12.0, 107)], "#1a2850")
    for zy in (50, 54, 59, 66, 76, 90, 108):                    # cross seams
        c.line([(VX - road_hw(zy), zy), (VX + road_hw(zy), zy)], "#1a2850")
    for side in (-1, 1):                                        # glowing rune strips along both edges
        for y in range(VY + 3, 108, 2):
            hw = road_hw(y) * 0.86
            if (y // 2) % 2 == 0:
                c.set(VX + side * hw, y, "#4af0e0")
                c.set(VX + side * hw + side, y, "#1a8a9a")
    # the far portal
    glow(c, VX, VY, 22, ["#0e4a5a", "#2a9ab0", "#8aeee8", "#f0ffff"], power=1.4, strength=1.0, ry=14)
    c.ellipse(VX, VY, 2, 3, "#ffffff")
    # gates: pointed bone arches, repeating toward the portal
    def gate(yb, thick):
        hw = road_hw(yb)
        ys = yb - 0.55 * hw
        R = 2 * hw
        arc = [(hw - R * math.cos(a), ys - R * math.sin(a)) for a in (i / 24.0 * math.pi / 3 for i in range(1, 25))]
        left = [(VX - hw, yb), (VX - hw, ys)] + [(VX + dx_, yy) for (dx_, yy) in arc]
        right = [(VX + hw, yb), (VX + hw, ys)] + [(VX - dx_, yy) for (dx_, yy) in arc]
        for pts, sd in ((left, 1), (right, -1)):
            c.line(pts, "#2a2a58", int(thick) + 2)
            c.line(pts, "#cfc8b4", int(thick))
            c.line([(p[0] + sd * (thick // 2 + 1), p[1]) for p in pts], "#4af0e0", 1)
            c.line([(p[0] - sd * (thick // 2), p[1]) for p in pts], "#8a8aa8", 1)
    for yb, th in [(48, 1), (51, 1), (55, 2), (61, 2), (70, 3), (84, 4), (104, 6)]:
        gate(yb, th)
    # ---- the troupe: dancers crossing the road, one has stopped and turned
    def harlequin(h, pose, x, y, facing, stop=False):
        f = fig(h, pose, "#14102a", facing=facing)
        img = f["img"]
        px = img.load()
        for yy in range(img.height):
            for xx in range(img.width):
                if px[xx, yy][3] >= 128:
                    split = (xx < img.width // 2) ^ (yy > img.height * 0.5)       # split-colour costume
                    px[xx, yy] = (C("#ff5aa0") if split else C("#14102a")) + (255,)
        f["img"] = img
        ox, oy = put_figure(c, f, x, y, rim_col="#9af0f0", toward=(0, -1))
        hx_, hy_ = f["head"]
        c.rect(ox + int(hx_) - 1, oy + int(hy_) - 1, ox + int(hx_), oy + int(hy_), "#f4f4ea")     # white mask
        if stop:
            c.set(ox + int(hx_) - (1 if facing > 0 else 0), oy + int(hy_) + 1, "#14102a")         # the grimace
            c.set(ox + int(hx_) - (0 if facing > 0 else 1), oy + int(hy_) + 1, "#14102a")
    for (x, h, pz) in [(150, 9, "run"), (137, 10, "arms_up"), (124, 10, "run"), (112, 11, "walk")]:
        harlequin(h, pz, x, 74 + (h - 9), -1)
    harlequin(13, "stand", 97, 78, 1, stop=True)
    # ---- the one who waits: small, warm, seated, with tally scratches
    pl = player_fig("aeldari", 28, "sit", facing=1)
    plx, ply = put_figure(c, pl, 64, 96, rim_col="#9af0f0", toward=(1, -1),
                          shadow=dict(toward_light=(1, 0.4), length=0.5, squash=0.25, col="#05051a", t=0.7))
    for g in range(6):                                          # tally strokes scratched into the floor
        gx, gy = 74 + (g % 3) * 11, 97 + (g // 3) * 6
        for k in range(4):
            c.line([(gx + k * 2, gy), (gx + k * 2, gy + 3)], "#5a8a9c")
        c.line([(gx - 1, gy + 3), (gx + 7, gy)], "#5a8a9c")
    particles(c, "mote", 26, (0, 20, 191, 100), seed=e.seed_for("mote"), cols=("#6af0e8", "#bafff8", "#ff8ac0"))
    vignette_kind(c, "bad", col="#05051a", strength=0.65)


# =====================================================================================================
#  shared Aeldari toolkit (module-private helpers, SPEC §31 art role)
# =====================================================================================================
import endkit as _ek
from PIL import Image as _Image, ImageDraw as _ImageDraw

BONE = ["#3a3a5a", "#7a7a98", "#b0aa98", "#e2dcc6", "#f8f2de"]          # wraithbone, dark -> light
TEAL = ["#0e4a5a", "#1a8a9a", "#2ec4b8", "#4af0e0", "#bafff8"]          # webway / spirit light
WARM = ["#7a4a2a", "#c08040", "#ffb860", "#ffd890", "#fff2c8"]          # sun / lamp light


def _ogive_pts(cx, yb, hw, ys, k=1.7, n=26):
    """pointed-arch outline: left leg (foot -> springing -> apex), and the mirrored right leg."""
    R = k * hw
    amax = math.acos((R - hw) / R)
    left = [(cx - hw, yb), (cx - hw, ys)]
    for i in range(1, n + 1):
        a = amax * i / n
        left.append((cx - hw + R - R * math.cos(a), ys - R * math.sin(a)))
    right = [(2 * cx - x, y) for (x, y) in left]
    return left, right


def _bone_line(c, pts, w=2, cols=BONE, lit=1):
    """one wraithbone strut: dark ink edge, bone body, bright edge on the light side, soft shade on the other."""
    c.line(pts, cols[0], w + 2)
    c.line(pts, cols[2], w)
    if w >= 2:
        c.line([(x + lit * (w // 2), y) for (x, y) in pts], cols[4], 1)
        c.line([(x - lit * (w // 2), y) for (x, y) in pts], cols[1], 1)
    else:
        c.line(pts, cols[3], 1)


def _ogive(c, cx, yb, hw, ys, w=2, cols=BONE, k=1.7, lit=1):
    left, right = _ogive_pts(cx, yb, hw, ys, k)
    _bone_line(c, left, w, cols, lit)
    _bone_line(c, right, w, cols, lit)
    return left[-1][1]


def _gem(c, x, y, col="#4af0e0", r=2, halo=0.5):
    """spirit stone: a lozenge with a white core and a small halo (protected from the quantiser)."""
    light_pool(c, x, y, r * 4 + 2, r * 4 + 2, col, t=halo, power=1.3)
    for dy in range(-r - 1, r + 2):
        for dx in range(-r - 1, r + 2):
            if abs(dx) + abs(dy) <= r + 1:
                c.set(x + dx, y + dy, col if abs(dx) + abs(dy) >= r else "#ffffff")


def _spark(c, x, y, col, arm=2):
    c.set(x, y, "#ffffff")
    for k in range(1, arm + 1):
        for (dx, dy) in ((k, 0), (-k, 0), (0, k), (0, -k)):
            blend(c, x + dx, y + dy, col, 0.9 - 0.25 * k, 3)


def _eldar(h, col="#1d3a52", facing=1, pose="stand", cloak=True, staff=False):
    """tall, slim Aeldari silhouette (crested helm, long cloak); same dict as endkit.figure().
    pose: stand | bow (head lowered, looking down) | stoop (folded forward) | reach | arms_up | sing | back."""
    ss = 6
    Wd, Hd = int(h * 1.6 * ss), int(h * 1.4 * ss)
    big = _Image.new("L", (Wd, Hd), 0)
    d = _ImageDraw.Draw(big)
    ox, oy = Wd * 0.5, Hd * 0.95
    u = h * ss
    P = dict(stand=dict(lean=0, hd=0, a=((-8, -4), (6, 4))), bow=dict(lean=14, hd=10, a=((-4, 8), (8, 20))),
             stoop=dict(lean=44, hd=20, a=((24, 44), (14, 52))),
             reach=dict(lean=6, hd=0, a=((88, 80), (30, 60))), arms_up=dict(lean=0, hd=0, a=((150, 165), (-150, -165))),
             sing=dict(lean=4, hd=-3, a=((70, 100), (60, 96))), back=dict(lean=0, hd=0, a=((-8, -4), (6, 4))))[pose]
    L = P["lean"]

    def T(p):
        return (ox + p[0] * u, oy - p[1] * u)

    def seg(a, b, w_):
        d.line([T(a), T(b)], fill=255, width=max(1, int(w_ * u)))
        r = w_ * u / 2
        for q in (T(a), T(b)):
            d.ellipse([q[0] - r, q[1] - r, q[0] + r, q[1] + r], fill=255)

    hip = (0.0, 0.47)
    for sx_ in (-0.03, 0.03):                                    # legs
        seg((hip[0] + sx_ * 0.6, hip[1]), (sx_ * 1.4, 0.015), 0.062)
    tp = endkit_fk(hip, [(0.30, 180 - L)])
    sh = tp[1]
    d.polygon([T((sh[0] - 0.075, sh[1])), T((sh[0] + 0.075, sh[1])), T((0.052, 0.47)), T((-0.052, 0.47))], fill=255)
    if cloak:                                                    # long cape swept behind (opposite the facing side)
        d.polygon([T((sh[0] - 0.05, sh[1] + 0.01)), T((sh[0] + 0.05, sh[1] + 0.01)), T((-0.10, 0.02)),
                   T((-0.24, 0.0)), T((-0.14, 0.40))], fill=255)
        d.polygon([T((-0.05, 0.50)), T((0.05, 0.50)), T((0.12, 0.05)), T((-0.12, 0.05))], fill=255)   # skirt
    nk = (sh[0] + 0.01, sh[1] + 0.05)
    hd = P["hd"]
    head = (nk[0] + 0.012 + hd * 0.004, nk[1] + 0.045 - hd * 0.004)
    q = T(head)
    r_ = 0.052 * u
    d.ellipse([q[0] - r_, q[1] - r_ * 1.1, q[0] + r_, q[1] + r_ * 1.1], fill=255)
    # swept crest (the long helm)
    crest = [T((head[0] + 0.02, head[1] + 0.03)), T((head[0] - 0.02, head[1] + 0.07)), T((head[0] - 0.14, head[1] + 0.08)),
             T((head[0] - 0.06, head[1] + 0.02)), T((head[0] - 0.09, head[1] - 0.02))]
    d.polygon(crest, fill=255)
    hands = []
    for i, (up, fo) in enumerate(P["a"]):
        a0 = (sh[0] + (0.06 if i == 0 else -0.06), sh[1] - 0.02)
        pts = endkit_fk(a0, [(0.17, up), (0.16, fo)])
        seg(pts[0], pts[1], 0.052)
        seg(pts[1], pts[2], 0.044)
        hands.append(pts[2])
    if staff:
        hnd = hands[0]
        seg((hnd[0], hnd[1] - 0.45), (hnd[0], hnd[1] + 0.32), 0.022)
    small = big.resize((Wd // ss, Hd // ss), _Image.BOX).point(lambda v: 255 if v >= 105 else 0)
    bb = small.getbbox() or (0, 0, 1, 1)
    small = small.crop(bb)
    out = _Image.new("RGBA", small.size, (0, 0, 0, 0))
    out.paste(_Image.new("RGBA", small.size, _ek.C(col) + (255,)), (0, 0), small)
    fx = lambda p: ((T(p)[0] / ss) - bb[0], (T(p)[1] / ss) - bb[1])      # noqa: E731
    res = dict(img=out, feet=fx((0.0, 0.0)), head=fx(head), top=fx((head[0], head[1] + 0.06)),
               hands=[fx(hands[0]), fx(hands[1])])
    if facing < 0:
        res["img"] = out.transpose(_Image.FLIP_LEFT_RIGHT)
        w_ = out.width
        for k in ("feet", "head", "top"):
            res[k] = (w_ - 1 - res[k][0], res[k][1])
        res["hands"] = [(w_ - 1 - q_[0], q_[1]) for q_ in res["hands"]]
    return res


def endkit_fk(p, segs):
    return _ek._fk(p, segs)


def _mote_curl(c, x0, y0, x1, y1, n, cols, seed, amp=4.0, turns=1.5):
    """a ribbon of glowing motes from (x0,y0) to (x1,y1) (a sung note, a thread of breath)."""
    rr = random.Random(seed)
    for i in range(n):
        t = i / max(1, n - 1)
        x = x0 + (x1 - x0) * t + math.sin(t * turns * math.pi * 2) * amp * (0.4 + t)
        y = y0 + (y1 - y0) * t + math.cos(t * turns * math.pi * 2) * amp * 0.5
        c.set(x + rr.uniform(-0.6, 0.6), y + rr.uniform(-0.6, 0.6), cols[(i + rr.randint(0, 1)) % len(cols)])


def _grain(c, x0, y0, x1, y1, seed, cols, n=18, seg=24):
    """long soft flowing lines on wraithbone surfaces (blended, never full-strength)."""
    rr = random.Random(seed)
    for _ in range(n):
        x = rr.uniform(x0, x1)
        y = rr.uniform(y0, y1)
        ph = rr.uniform(0, 6.28)
        L_ = rr.randint(10, seg)
        for k in range(L_):
            px = x + k * 1.0
            py = y + math.sin(ph + k * 0.18) * 3.0
            if x0 <= px <= x1 and y0 <= py <= y1:
                blend(c, int(px), int(py), cols, 0.55, 2)


# =====================================================================================================
#  GOOD
# =====================================================================================================

@ending("eld_end_guest")
def eld_end_guest(e):
    """GOOD.  The Guest Who Sings: a wall in an empty district of Selunar, a crooked seam of living bone where a
    mon-keigh sang the crack shut; the Bonesinger stands behind the small human, who still hums the next song.
    Light: warm evening dome-light from the right, the healed seam glows gold; bright mass right / upper right."""
    c = e.c
    sky(c, ["#161c4a", "#2c3478", "#6a5a94", "#d8987a", "#ffcf90"], 0, 70)
    glow(c, 160, 30, 60, ["#c8708a", "#f0a888", "#ffd8a0", "#fff2d0"], power=1.6, strength=0.95, ry=34)
    stars(c, e.seed_for("st"), 40, 0, 30, cols=("#6a78b8", "#b8c0f0", "#ffffff"))
    n = e.noise("cl")
    for y in range(10, 52):
        for x in range(192):
            v = n.fbm(x * 0.02, y * 0.06, 3)
            if v > 0.56:
                blend(c, x, y, "#e8b0a0", (v - 0.56) * 2.0, 3)
    # far craftworld spires, pale in the dome haze
    rr = e.rng("spires")
    for k in range(9):
        x = 8 + k * 21 + rr.randint(-4, 4)
        h = rr.randint(14, 30)
        base = 68
        col = "#5a5e94" if k % 2 else "#6a6a9c"
        c.poly([(x - 3, base), (x - 1, base - h * 0.5), (x, base - h), (x + 1, base - h * 0.5), (x + 3, base)], col)
        c.set(x, base - h - 1, "#ffe8d0")
    haze(c, 54, 74, "#f0a888", 0.5, seed=e.seed_for("hz"), profile="mid")
    # hall ribs of bone: one great arch at the left, a far one behind it
    _ogive(c, 30, 90, 30, 80, w=3, cols=BONE, k=1.5)
    _ogive(c, 78, 80, 17, 74, w=2, cols=["#2a2a4a", "#5a5a7a", "#8a86a0", "#b8b0b0", "#e8d8d0"], k=1.5)
    # floor: dark polished bone, warm pool under the wall
    hband(c, 76, 107, ["#8a6a6a", "#5a4a60", "#34304c", "#1c1a34"], seed=e.seed_for("fl"), rough=0.1)
    for x in range(-60, 260, 16):
        c.line([(96 + (x - 96) * 0.35, 76), (96 + (x - 96) * 1.7, 107)], "#2a2644")
    for y in (82, 90, 100):
        c.line([(0, y), (191, y)], "#2a2644")
    light_pool(c, 140, 88, 56, 12, "#ffcf90", t=0.55)
    # the wall: tall curved slab of wraithbone, right of centre, lit warm from the upper right
    wx0, wx1, wy0, wy1 = 108, 184, 12, 80
    for y in range(wy0, wy1 + 1):
        for x in range(wx0, wx1 + 1):
            tx = (x - wx0) / (wx1 - wx0)
            top_round = 18 * (1 - math.sqrt(max(0.0, 1 - ((x - (wx0 + wx1) / 2) / ((wx1 - wx0) / 2)) ** 2)))
            if y < wy0 + top_round:
                continue
            t = 0.30 + tx * 0.50 - (y - wy0) / (wy1 - wy0) * 0.22
            c.set(x, y, ramp_pick(["#4a4260", "#7a6a7a", "#b09484", "#e8c8a4", "#fff0cc"], t, x, y, sharp=5.5))
            if y < wy0 + top_round + 2:
                c.set(x, y, "#fff0cc" if t > 0.45 else "#b09484")
    _grain(c, wx0 + 1, wy0 + 20, wx1 - 1, wy1 - 2, e.seed_for("gr"), "#6a5a70", n=14, seg=30)
    c.rect(wx0, wy0 + 14, wx0 + 1, wy1, "#2a2644")
    c.rect(wx0 - 2, wy1 - 1, wx1 + 2, wy1 + 3, "#4a4260")
    c.rect(wx0 - 2, wy1 - 1, wx1 + 2, wy1 - 1, "#b09484")
    # the crack, healed crooked
    rr = e.rng("crack")
    pts = [(140, wy0 + 8)]
    for k in range(1, 9):
        pts.append((pts[-1][0] + rr.choice((-5, -3, 3, 4, -4, 5)), wy0 + 8 + k * 8.0))
    pts[-1] = (pts[-1][0], wy1 - 1)
    light_pool(c, 142, 46, 26, 34, "#ffd890", t=0.5)
    c.line(pts, "#a8643a", 4)
    c.line(pts, "#ffc070", 2)
    c.line([(x + 1, y) for (x, y) in pts], "#fff4d0", 1)
    for (x, y) in pts[1:-1:2]:
        _spark(c, int(x), int(y), "#ffd890", 2)
    for (a, b) in [((122, 38), (116, 50)), ((164, 30), (170, 40))]:       # still-dark hairlines
        c.line([a, ((a[0] + b[0]) // 2 + 2, (a[1] + b[1]) // 2), b], "#3a3048", 1)
    # ---- the two singers (backlit by the dome, rim-lit by the seam)
    bs = _eldar(46, "#183c52", facing=1, pose="sing")
    bx, by = put_figure(c, bs, 94, 96, rim_col="#ffc890", toward=(1, -0.4),
                        shadow=dict(toward_light=(0.8, 0.45), length=0.9, squash=0.22, col="#100e22", t=0.6))
    pl = player_fig("aeldari", 24, "reach", facing=1)
    px_, py_ = put_figure(c, pl, 116, 98, rim_col="#ffd890", toward=(1, -0.4),
                          shadow=dict(toward_light=(0.8, 0.45), length=0.9, squash=0.22, col="#100e22", t=0.6))
    hx_, hy_ = bs["head"]
    c.set(bx + int(hx_) + 2, by + int(hy_), "#4af0e0")
    hxp, hyp = pl["hands"][0]
    _mote_curl(c, px_ + int(hxp), py_ + int(hyp), 140, 62, 30, ["#4af0e0", "#bafff8", "#ffd890"], e.seed_for("song"), amp=5)
    _mote_curl(c, bx + int(bs["hands"][0][0]), by + int(bs["hands"][0][1]), 134, 54, 24, ["#ffd890", "#fff8e0"],
               e.seed_for("song2"), amp=4)
    particles(c, "mote", 26, (60, 8, 190, 70), seed=e.seed_for("mt"), cols=("#fff0c8", "#ffe2a0"))
    e.protect += ["#4af0e0", "#ffd890", "#fff4d0"]
    vignette_kind(c, "good", col="#1a1020", strength=0.8, inner=0.42, power=1.4)


def _wheat(c, y0, y1, x0, x1, seed, cols, dens=1.0, top_h=4.0, bot_h=12.0):
    """a field of stalks in perspective (rows from y0 far to y1 near); cols = [stem, stalk, head, bright head]."""
    rr = random.Random(seed)
    y = float(y0)
    while y <= y1:
        t = (y - y0) / max(1, y1 - y0)
        step = 1.6 + t * 2.4
        ht = top_h + (bot_h - top_h) * t
        x = x0 + rr.uniform(0, step)
        while x <= x1:
            hh = ht * rr.uniform(0.75, 1.15)
            lean = rr.choice((-1, 0, 0, 1)) * (0.5 + t)
            yi = int(y)
            c.line([(x, yi), (x + lean, yi - hh)], cols[1], 1)
            tx, ty = int(x + lean), int(yi - hh)
            c.set(tx, ty, cols[2])
            c.set(tx, ty - 1, cols[3] if rr.random() < 0.55 else cols[2])
            if t > 0.35:
                c.set(tx + 1, ty, cols[2])
            x += step * rr.uniform(0.7, 1.3) / dens
        y += 1.6 + t * 1.6


@ending("eld_end_maiden")
def eld_end_maiden(e):
    """GOOD.  Wheat on a Maiden World: a field by Ildaneth's river, gold in the low sun; a mon-keigh and three Exodite
    children sing the harvest badly (dark against the lit gold); at the field's edge the Farseer stands and says
    nothing.  Light: low sun left, glints on the river, rim light on every stalk; bright mass left / low."""
    c = e.c
    sky(c, ["#162c78", "#2c52a8", "#6a74b8", "#d08890", "#ffb878"], 0, 58)
    n = e.noise("cl")
    for y in range(6, 50):                                              # a few long clouds, lit from below-left
        for x in range(192):
            v = n.fbm(x * 0.016, y * 0.08, 4)
            if v > 0.57:
                tt = clamp((v - 0.57) * 3.0) * 0.8 + (1 - x / 192.0) * 0.2 + y / 120.0
                c.set(x, y, ramp_pick(["#3a4a98", "#8a78b0", "#e898a0", "#ffd0a0"], tt, x, y))
    glow(c, 36, 58, 50, ["#e8907c", "#ffb878", "#ffd898", "#fff4d0"], power=1.5, strength=0.95, ry=36)
    c.ellipse(36, 57, 7, 7, "#fff8e0")
    # far hills, the Exodite dome, a vine-grown bone arch
    ridge(c, 59, 4, 10, "#3a6a7a", seed=e.seed_for("h1"), scale=0.03)
    ridge(c, 62, 3, 8, "#26584a", seed=e.seed_for("h2"), scale=0.05)
    c.ellipse(86, 61, 10, 5, "#c8b090")
    c.rect(72, 61, 100, 64, "#26584a")
    c.ellipse(84, 59, 4, 3, "#f0dcc0")
    _ogive(c, 148, 66, 9, 56, w=2, cols=BONE, k=1.6, lit=-1)
    for (vx, vy) in [(140, 58), (141, 62), (156, 60), (155, 64)]:
        c.set(vx, vy, "#4a9a4a"); c.set(vx + (1 if vx < 148 else -1), vy + 1, "#4a9a4a")
    # the river: a silver ribbon winding across the middle
    for x in range(192):
        yc = 67 + 2.5 * math.sin(x * 0.045 + 1.0)
        w_ = 3.0 + 0.9 * math.sin(x * 0.03)
        for y in range(int(yc - w_), int(yc + w_) + 1):
            t = clamp(0.35 + 0.5 * (1 - x / 192.0) + (0.15 if abs(y - yc) < 1 else 0))
            c.set(x, y, ramp_pick(["#2a5a98", "#4a84c0", "#90b8e0", "#fff0d0"], t, x, y))
    # lit mid-field: gold, brighter toward the sun
    for y in range(71, 96):
        for x in range(192):
            tt = (y - 71) / 25.0 * 0.55 + (x / 192.0) * 0.55
            c.set(x, y, ramp_pick(["#f4c050", "#d09030", "#9a6020", "#5a3812"], tt, x, y, sharp=3.5))
    rr = e.rng("mid")
    for k in range(260):                                                # sparse stalk accents (not a texture wall)
        x, y = rr.randint(0, 191), rr.randint(71, 95)
        c.set(x, y, "#fff0a0" if rr.random() < 0.5 else "#a86a1c")
        c.set(x, y - 1, "#ffe488" if x < 120 else "#d89a30")
    # people on the field path, dark against the lit gold, rim-lit by the low sun
    fy = 93
    sh = dict(toward_light=(-0.9, 0.3), length=1.2, squash=0.2, col="#3a2208", t=0.5)
    for (x, h, cc) in [(84, 17, "#2a4a68"), (96, 19, "#6a3028"), (107, 15, "#3a5628")]:
        f = fig(h, "stand", cc, facing=-1)
        put_figure(c, f, x, fy + (19 - h) // 2, rim_col="#ffe098", toward=(-1, -0.3), shadow=sh)
    pl = player_fig("aeldari", 30, "arms_up", facing=1)
    ppx, ppy = put_figure(c, pl, 62, fy + 3, rim_col="#ffe098", toward=(-1, -0.3), shadow=sh)
    fs = _eldar(44, "#1c2050", facing=-1, pose="stand", staff=True)
    put_figure(c, fs, 168, 94, rim_col="#ffc890", toward=(-1, -0.2), shadow=sh)
    c.set(169, 94 - 34, "#4af0e0")
    # foreground: dark, backlit wheat with bright rim heads along its top
    for y in range(98, 108):
        for x in range(192):
            c.set(x, y, ramp_pick(["#6a4418", "#4a2c10", "#2a1a0a"], (y - 98) / 10.0, x, y))
    WH = ["#2a1a0a", "#5a3a14", "#ffd868", "#fff4b0"]
    _wheat(c, 99, 108, 0, 120, e.seed_for("w2"), WH, top_h=6, bot_h=9, dens=1.0)
    _wheat(c, 101, 108, 120, 191, e.seed_for("w3"), WH, top_h=5, bot_h=8, dens=0.9)
    _mote_curl(c, ppx + 18, ppy + 4, 110, 42, 26, ["#fff8e0", "#ffe2a0", "#bafff8"], e.seed_for("song"), amp=6, turns=1.2)
    particles(c, "mote", 36, (0, 24, 191, 86), seed=e.seed_for("mt"), cols=("#fff0c8", "#ffe2a0", "#ffffff"))
    for (bx, by) in [(120, 24), (128, 19), (136, 26)]:
        c.set(bx, by, "#1a2458"); c.set(bx + 1, by - 1, "#1a2458"); c.set(bx + 2, by, "#1a2458")
    e.protect += ["#4af0e0", "#fff4b0"]
    vignette_kind(c, "good", col="#24140c", strength=0.85, inner=0.38, power=1.3)


def _harlequin(c, x, y, h, pose, facing, cols=("#ff5aa0", "#14102a"), rim_col="#ffc8e8", toward=(-1, -1), mask="#f4f4ea"):
    """a dancer in split motley (two-tone, diagonal split), white mask; feet at (x, y)."""
    f = fig(h, pose, "#14102a", facing=facing)
    img = f["img"]
    px = img.load()
    for yy in range(img.height):
        for xx in range(img.width):
            if px[xx, yy][3] >= 128:
                split = (xx + yy // 2 < (img.width + img.height // 2) // 2 + 1) ^ (yy > img.height * 0.55)
                px[xx, yy] = (_ek.C(cols[0]) if split else _ek.C(cols[1])) + (255,)
    f["img"] = img
    ox, oy = put_figure(c, f, x, y, rim_col=rim_col, toward=toward)
    hx_, hy_ = f["head"]
    c.rect(ox + int(hx_) - 1, oy + int(hy_) - 1, ox + int(hx_), oy + int(hy_), mask)
    return ox, oy, f


def _ghost(c, f, x, y, col="#bafff8", edge="#4af0e0"):
    """draw a figure() as a half-seen ghost: checker-dither body + bright edge pixels."""
    img = f["img"]
    ax, ay = f["feet"]
    px0, py0 = int(round(x - ax)), int(round(y - ay))
    src = img.load()
    for j in range(img.height):
        for i in range(img.width):
            if src[i, j][3] < 128:
                continue
            border = any(not (0 <= i + dx < img.width and 0 <= j + dy < img.height) or src[i + dx, j + dy][3] < 128
                         for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
            if border:
                c.set(px0 + i, py0 + j, edge)
            elif (i + j) % 2 == 0:
                c.set(px0 + i, py0 + j, col)
    return px0, py0


def _bez(p0, p1, p2, t):
    a, b = 1 - t, t
    return (a * a * p0[0] + 2 * a * b * p1[0] + b * b * p2[0], a * a * p0[1] + 2 * a * b * p1[1] + b * b * p2[1])


def _ribbon(c, p0, p1, p2, w0, w1, colfn, edge=None, n=420):
    """a road ribbon along a quadratic bezier, width w0 -> w1; colfn(t, s) -> colour (s = -1..1 across)."""
    for i in range(n + 1):
        t = i / n
        x, y = _bez(p0, p1, p2, t)
        x2, y2 = _bez(p0, p1, p2, min(1.0, t + 0.01))
        dx, dy = x2 - x, y2 - y
        ln = math.hypot(dx, dy) or 1
        nx, ny = -dy / ln, dx / ln
        w = w0 + (w1 - w0) * t
        m = max(2, int(w * 2.2))
        for k in range(m + 1):
            s = -1 + 2 * k / m
            xx, yy = x + nx * s * w / 2, y + ny * s * w / 2 * 0.62
            col = colfn(t, s, int(xx), int(yy))
            if col is not None:
                c.set(int(round(xx)), int(round(yy)), col)
        if edge is not None:
            for s in (-1, 1):
                c.set(int(round(x + nx * s * w / 2)), int(round(y + ny * s * w / 2 * 0.62)), edge)


def _vesica(c, cx, cy, a, b, col):
    """pointed oval (two overlapping discs): half-width a, half-height b -- the Aeldari gate shape."""
    R = (a * a + b * b) / (2.0 * a)
    d = R - a
    for y in range(int(cy - b), int(cy + b) + 1):
        for x in range(int(cx - a), int(cx + a) + 1):
            if math.hypot(x - (cx - d), y - cy) <= R and math.hypot(x - (cx + d), y - cy) <= R:
                c.set(x, y, col)


@ending("eld_end_masque")
def eld_end_masque(e):
    """GOOD.  The Laughing God's Audience: a webway theatre in the dark; a harlequin troupe plays The Fall under a
    giant pale mask on a lit stage; the mon-keigh in the front row throws their head back and laughs first, and in
    a high box a tall shape in a pale mask is laughing too.  Light: stage glow from the upper left through
    dusty shafts; bright mass upper left / left."""
    c = e.c
    for y in range(108):
        for x in range(192):
            c.set(x, y, ramp_pick(["#0a0620", "#150c32", "#241448"], y / 108.0 + (x / 192.0) * 0.15, x, y))
    stars(c, e.seed_for("st"), 40, 0, 20, cols=("#5a4a9a", "#a898e0", "#ffffff"))
    # proscenium: a great wraithbone arch, the stage inside it burning magenta -> gold
    cx, base, hw, ys, kk = 72, 78, 44, 54, 1.1
    left, right = _ogive_pts(cx, base, hw, ys, k=kk)
    R = kk * hw
    apex = int(left[-1][1])
    for y in range(max(0, apex), base + 1):
        for x in range(cx - hw, cx + hw + 1):
            if y < ys and (math.hypot(x - (cx - hw + R), y - ys) > R or math.hypot(x - (cx + hw - R), y - ys) > R):
                continue
            t = 1.0 - math.hypot((x - cx) / 62.0, (y - 46) / 50.0)
            c.set(x, y, ramp_pick(["#4a1260", "#a82a82", "#ff6a7a", "#ffb860", "#fff0b0"], t, x, y))
    # the giant mask on the backdrop
    mcx, mcy = cx, 33
    for y in range(mcy - 19, mcy + 20):
        for x in range(mcx - 14, mcx + 15):
            if ((x - mcx) / 13.5) ** 2 + ((y - mcy) / 18.5) ** 2 <= 1:
                diag = (x - mcx) + (y - mcy) * 0.35 > 0
                c.set(x, y, "#241448" if diag else "#fff4e0")
    for sgn in (-1, 1):
        c.line([(mcx + sgn * 3, mcy - 7), (mcx + sgn * 9, mcy - 10)], "#ff3a8a" if sgn < 0 else "#ffc860", 2)
    c.line([(mcx - 8, mcy + 5), (mcx - 4, mcy + 10), (mcx + 4, mcy + 10), (mcx + 8, mcy + 5)], "#ff3a8a", 2)
    _bone_line(c, left, 3, BONE, lit=1)
    _bone_line(c, right, 3, BONE, lit=-1)
    # stage floor: dark lacquer with a few diamonds
    for y in range(66, 82):
        for x in range(cx - hw - 2, cx + hw + 3):
            tt = (y - 66) / 15.0
            c.set(x, y, ramp_pick(["#5a2a80", "#2a1458", "#140a34"], tt, x, y))
    for k in range(-4, 5):
        px_ = cx + k * 10
        py_ = 73
        c.poly([(px_, py_ - 3), (px_ + 4, py_), (px_, py_ + 3), (px_ - 4, py_)], "#ff5aa0" if k % 2 else "#2ec4b8")
    c.rect(cx - hw - 2, 66, cx + hw + 2, 66, "#fff4e0")
    # the troupe on the stage: ink + one bright half, big enough to read against the glow
    for (x, h, pz, fc, col) in [(40, 24, "run", 1, "#2ec4b8"), (56, 27, "arms_up", 1, "#2ec4b8"), (74, 25, "walk", -1, "#bafff8"),
                                (90, 27, "run", -1, "#2ec4b8"), (104, 24, "arms_up", -1, "#2ec4b8")]:
        _harlequin(c, x, 76 + (h - 24) // 3, h, pz, fc, cols=(col, "#14102a"), rim_col="#fff0b0", toward=(0, -1))
    shafts(c, (72, 52), 28, 46, 8, 120, "#ffb8d8", t=0.20, seed=e.seed_for("sh"), w0=6, w1=20, power=0.6, floor=107)
    # a high box at the upper right: a tall pale-masked shape, laughing
    c.rect(146, 16, 191, 18, "#4a2c80")
    c.rect(146, 18, 148, 44, "#3a2068")
    c.rect(146, 44, 191, 46, "#4a2c80")
    light_pool(c, 168, 34, 22, 14, "#ffb8d8", t=0.3)
    lg = _eldar(28, "#3a1a64", facing=-1, pose="arms_up")
    lx, ly = put_figure(c, lg, 170, 44, rim_col="#ff8ac0", toward=(-1, 0))
    c.rect(lx + int(lg["head"][0]) - 1, ly + int(lg["head"][1]) - 1, lx + int(lg["head"][0]), ly + int(lg["head"][1]), "#fff4e0")
    # the house: curved tiers of seat-backs, all empty
    for (ry, rcol, rhi) in [(84, "#32206a", "#5a3a98"), (91, "#241450", "#3a2478"), (99, "#160c38", "#241450"), (107, "#0a0620", "#160c38")]:
        for x in range(0, 192):
            yy = ry + int(((x - 72) / 90.0) ** 2 * 4)
            c.rect(x, yy, x, yy + 8, rcol)
            c.set(x, yy, rhi)
            if x % 7 in (0, 1):
                c.rect(x, yy, x, yy + 8, rhi)
    # the audience of one in the front row, seat-back hides the legs, head thrown back
    pl = player_fig("aeldari", 30, "arms_up", facing=-1)
    ppx, ppy = put_figure(c, pl, 152, 98, rim_col="#ffd8e8", toward=(-1, -0.3))
    hxp, hyp = pl["head"]
    for x in range(138, 168):
        yy = 96 + int(((x - 72) / 90.0) ** 2 * 4)
        for y in range(yy, 108):
            c.set(x, y, "#160c38")
        c.set(x, yy, "#3a2478")
    for (dx, dy) in [(-7, -6), (6, -7), (-3, -11), (8, -3), (0, -9)]:
        _spark(c, ppx + int(hxp) + dx, ppy + int(hyp) + dy, "#ffc8e8", 1)
    e.protect += ["#fff4e0", "#ffc860", "#ff3a8a", "#2ec4b8"]
    vignette_kind(c, "good", col="#0a0620", strength=0.45, inner=0.7)


@ending("eld_end_ynnari")
def eld_end_ynnari(e):
    """GOOD.  Companion of the Dead: a pale road rises through the webway toward a great gate of white light; the
    Ynnari, tall in black, bone and red, walk it in a long line; the one living mon-keigh walks among them with a
    half-seen friend at their side and whistles.  Light: the gate, upper right; the road is a diagonal."""
    c = e.c
    for y in range(108):
        for x in range(192):
            c.set(x, y, "#0a0c2c")
    n1, n2 = e.noise("neb1"), e.noise("neb2")
    for y in range(108):
        for x in range(192):
            v = n1.fbm(x * 0.02, y * 0.035, 4)
            w = n2.fbm(x * 0.028 + 7, y * 0.04, 3)
            t = clamp((v - 0.44) * 3.0)
            if t > 0:
                c.set(x, y, ramp_pick(["#0a0c2c", "#161a50", "#2e2272", "#5a3a92"], t * 0.9, x, y))
            t2 = clamp((w - 0.5) * 3.2) * clamp(1 - math.hypot(x - 150, y - 36) / 110.0)
            if t2 > 0:
                c.set(x, y, ramp_pick(["#161a50", "#0e5a7a", "#2ab0c0"], t2, x, y))
    stars(c, e.seed_for("st"), 110, 0, 107, cols=("#5a6a9a", "#9aaad8", "#e8f0ff"))
    # the great gate: a pointed oval of white-gold light in a bone frame
    gx, gy = 150, 34
    glow(c, gx, gy, 72, ["#0e4a6a", "#2a9ab0", "#8aeee8", "#f0ffff"], power=1.4, strength=1.0, ry=52)
    _vesica(c, gx, gy, 22, 32, "#2a2a58")
    _vesica(c, gx, gy, 20, 30, "#e2dcc6")
    _vesica(c, gx, gy, 17, 27, "#2a2a58")
    _vesica(c, gx, gy, 15, 25, "#f6ffff")
    _vesica(c, gx, gy, 10, 18, "#fff8e0")
    glow(c, gx, gy, 12, ["#fff0c8", "#ffffff"], power=0.8, strength=1.0, ry=19)
    # the road: a pale ribbon sweeping from the lower left up to the gate
    P0, P1, P2 = (-12, 104), (88, 96), (146, 56)

    def road_col(t, s, x, y):
        return ramp_pick(["#3a5088", "#6a96b8", "#b8ece0", "#fff4d8"], t * 0.85 + (1 - abs(s)) * 0.12 + 0.1, x, y)
    _ribbon(c, P0, P1, P2, 48, 9, road_col, edge="#4af0e0")
    for i in range(0, 60, 4):                                               # seams across the road
        t = i / 60.0
        x, y = _bez(P0, P1, P2, t)
        x2, y2 = _bez(P0, P1, P2, min(1, t + 0.01))
        ln = math.hypot(x2 - x, y2 - y) or 1
        nx, ny = -(y2 - y) / ln, (x2 - x) / ln
        w = 48 + (9 - 48) * t
        c.line([(x - nx * w / 2, y - ny * w / 2 * 0.62), (x + nx * w / 2, y + ny * w / 2 * 0.62)], "#4a6a9a", 1)
    haze(c, 60, 108, "#8aeee8", 0.18, seed=e.seed_for("hz"), profile="bottom")
    # the procession: Ynnari in black, bone and red (tall, slim), receding up the road
    spots = [(0.12, 0.35, 40), (0.30, -0.25, 34), (0.45, 0.3, 28), (0.58, -0.2, 24), (0.70, 0.25, 20), (0.80, -0.15, 16), (0.90, 0.1, 13)]
    for (t, s, h) in sorted(spots, reverse=True):
        x, y = _bez(P0, P1, P2, t)
        w = 48 + (9 - 48) * t
        x2, y2 = _bez(P0, P1, P2, t + 0.01)
        ln = math.hypot(x2 - x, y2 - y) or 1
        nx, ny = -(y2 - y) / ln, (x2 - x) / ln
        fx_, fy_ = x + nx * s * w / 2.6, y + ny * s * w / 2.6 * 0.62
        f = _eldar(h, "#161230", facing=1, pose="stand")
        ox, oy = put_figure(c, f, fx_, fy_, rim_col="#f0fff8", toward=(1, -0.5),
                            shadow=dict(toward_light=(0.9, 0.5), length=0.6, squash=0.2, col="#0a0a2a", t=0.5))
        if h >= 16:
            hx2, hy2 = f["head"]
            c.set(ox + int(hx2) + 1, oy + int(hy2) + int(h * 0.30), "#ff3a4a")
            c.set(ox + int(hx2) + 1, oy + int(hy2) + int(h * 0.30) + 1, "#ff9aa0")
    # the one who lives, and their friend (half-seen) at their side, whistling
    pl = player_fig("aeldari", 26, "walk", facing=1)
    plx, ply = put_figure(c, pl, 70, 96, rim_col="#f0fff8", toward=(1, -0.6),
                          shadow=dict(toward_light=(0.9, 0.5), length=0.6, squash=0.2, col="#0a0a2a", t=0.5))
    gh = fig(22, "walk", "#bafff8", facing=1)
    _ghost(c, gh, 88, 99)
    hxp, hyp = pl["head"]
    _mote_curl(c, plx + int(hxp) + 3, ply + int(hyp), 86, 76, 10, ["#ffffff", "#bafff8"], e.seed_for("wh"), amp=2, turns=1.0)
    particles(c, "mote", 44, (0, 30, 150, 104), seed=e.seed_for("mt"), cols=("#bafff8", "#ffffff", "#8aeee8"))
    e.protect += ["#ff3a4a", "#4af0e0", "#bafff8", "#fff8e0"]
    vignette_kind(c, "good", col="#05051a", strength=0.35, inner=0.7)


# =====================================================================================================
#  BAD
# =====================================================================================================

def _flames(c, cx, base, half_w, hmax, seed, cols=("#ffffe0", "#fff0b0", "#ffc060", "#ff7a2a", "#c83a1a", "#6a1410"), lift=0.0):
    """a bonfire: tongue-shaped mask over a base line, colour by height (cooler/darker at the edge and the tip)."""
    n = Noise(seed)
    for x in range(int(cx - half_w), int(cx + half_w) + 1):
        u = (x - cx) / float(half_w)
        prof = max(0.0, 1 - u * u) ** 1.1
        h = hmax * prof * (0.55 + 0.9 * n.fbm(x * 0.28, 1.3, 3))
        top = base - h
        for y in range(int(top), int(base) + 1):
            if y < 0:
                continue
            v = (y - top) / max(1.0, base - top)                      # 0 at the tip .. 1 at the base
            t = clamp(v * (0.55 + 0.45 * (1 - abs(u))) + lift)
            c.set(x, y, ramp_pick(list(cols[::-1]), 1 - t, x, y))


@ending("eld_end_burned")
def eld_end_burned(e):
    """BAD.  Homecoming Pyre: a night square under a cold cathedral front; the pyre burns right of centre with a
    small figure in a teal poncho bound to the stake, the crowd's backs and raised hands in the foreground, the
    Inquisitor reading from a book at the left.  One wrong detail: the only teal in a world of orange and slate.
    Light: the fire, right; cold slate everywhere else; smoke drifts left."""
    c = e.c
    sky(c, ["#080e20", "#14223e", "#2a3a58", "#4a5870", "#6a6a78"], 0, 80)
    n = e.noise("smoke")
    for y in range(0, 80):
        for x in range(192):
            v = n.fbm(x * 0.016 + y * 0.004, y * 0.05, 4)
            reach = clamp(1 - (math.hypot(x - 150 + (80 - y) * 0.7, y - 70) / 120.0))
            if v * reach > 0.30:
                c.set(x, y, ramp_pick(["#10182c", "#1c2438", "#34384a", "#58505a"], (v * reach - 0.30) * 3.0, x, y))
    stars(c, e.seed_for("st"), 22, 0, 24, cols=("#4a5a8a", "#8a9ac8"))
    # cathedral front: dark, tall, with narrow pointed windows lit from inside (the only warm cold light)
    rr = e.rng("cath")
    for (x0, w, h) in [(0, 22, 58), (18, 14, 70), (30, 30, 86), (58, 16, 66), (70, 18, 54)]:
        base = 84
        c.rect(x0, base - h, x0 + w, base, "#0e1428")
        c.rect(x0, base - h, x0 + w, base - h, "#2a3450")
        tipx = x0 + w // 2
        c.poly([(x0, base - h), (x0 + w, base - h), (tipx, base - h - w * 1.3)], "#0e1428")
        c.line([(x0, base - h), (tipx, base - h - w * 1.3), (x0 + w, base - h)], "#2a3450", 1)
        c.line([(tipx, base - h - w * 1.3), (tipx, base - h - w * 1.3 - 5)], "#0e1428", 1)
        for wy in range(base - h + 6, base - 8, 11):
            for wx in range(x0 + 3, x0 + w - 2, 6):
                if rr.random() < 0.7:
                    c.rect(wx, wy, wx + 1, wy + 4, "#b8683a" if rr.random() < 0.6 else "#6a4a4a")
                    c.set(wx, wy - 1, "#b8683a")
    # the square: slate cobbles catching the fire
    hband(c, 84, 107, ["#34384a", "#242a3e", "#161a2c", "#0a0c18"], seed=e.seed_for("fl"), rough=0.15)
    for x in range(-50, 250, 16):
        c.line([(96 + (x - 96) * 0.5, 84), (96 + (x - 96) * 1.8, 107)], "#12162a")
    light_pool(c, 128, 94, 70, 14, "#ff8a3a", t=0.6)
    # the pyre: a heap of faggots with a stake, a bound figure; fire in front of the legs only
    px0, base = 128, 92
    c.poly([(104, base + 1), (152, base + 1), (140, 78), (116, 78)], "#2a1410")
    for k in range(9):                                                       # log ends
        yy = 80 + k * 1.5
        c.line([(106 + k * 0.8 - 3, yy), (150 - k * 0.8 + 3, yy + 0.5)], "#4a2a1a", 1)
    c.rect(px0 - 1, 40, px0, 80, "#2a1410")                                  # the stake
    c.rect(px0 - 1, 40, px0 - 1, 80, "#5a3a2a")
    pl = player_fig("aeldari", 26, "arms_up", facing=-1)
    ppx, ppy = put_figure(c, pl, px0 + 1, 79, rim_col="#ffb060", toward=(0, 1))
    c.line([(px0 - 5, 54), (px0 + 4, 54)], "#c08040", 1)                      # rope at the wrists
    light_pool(c, px0, 60, 36, 40, "#ff8a3a", t=0.35)
    _flames(c, px0, 92, 24, 24, e.seed_for("fire"))
    _flames(c, px0 - 15, 92, 11, 17, e.seed_for("fire2"))
    _flames(c, px0 + 16, 92, 11, 18, e.seed_for("fire3"))
    particles(c, "ember", 80, (96, 20, 170, 92), seed=e.seed_for("emb"), wind=(-1, 1))
    # the Inquisitor on the cathedral steps, reading from a book (cold light, hat, long coat)
    c.rect(24, 85, 62, 88, "#242a3e")
    c.rect(24, 85, 62, 85, "#4a5470")
    inq = fig(36, "stand", "#3a4668", facing=1, robe=0.75)
    ix, iy = put_figure(c, inq, 30, 104, rim_col="#ffa060", toward=(1, -0.3),
                        shadow=dict(toward_light=(0.9, 0.3), length=0.8, squash=0.2, col="#080c18", t=0.55))
    hx_, hy_ = inq["head"]
    c.rect(ix + int(hx_) - 5, iy + int(hy_) - 3, ix + int(hx_) + 5, iy + int(hy_) - 3, "#12182c")           # hat brim
    c.rect(ix + int(hx_) - 2, iy + int(hy_) - 7, ix + int(hx_) + 2, iy + int(hy_) - 3, "#12182c")
    c.rect(ix + int(hx_) + 1, iy + int(hy_) - 1, ix + int(hx_) + 2, iy + int(hy_), "#e8dcc0")                # pale face
    c.rect(ix + int(hx_) + 4, iy + int(hy_) + 9, ix + int(hx_) + 9, iy + int(hy_) + 12, "#f0e4c8")           # the open book
    c.rect(ix + int(hx_) + 4, iy + int(hy_) + 9, ix + int(hx_) + 4, iy + int(hy_) + 12, "#b8683a")
    # the crowd: backs and raised hands, banners
    crowd(c, 60, 188, 94, 106, 34, 12, 22, "#0a0c18", seed=e.seed_for("cr"), rim_col=None,
          poses=("arms_up", "stand", "arms_up", "stand", "hunch"))
    rr = e.rng("ban")
    for bx in (30, 78, 168):
        c.line([(bx, 66), (bx, 98)], "#0a0c18", 1)
        c.poly([(bx, 66), (bx + 9, 68), (bx + 7, 74), (bx, 72)], "#8a1e1a")
        c.line([(bx, 66), (bx + 9, 68)], "#c8441c", 1)
    e.protect += ["#2ec4b8", "#ffb060", "#fff0b0"]
    vignette_kind(c, "bad", col="#05070f", strength=0.5)


@ending("eld_end_claim_khorne")
def eld_end_claim_khorne(e):
    """BAD / Khorne.  The Mask That Stays: the Guardians have shown the player out of the webway; the teal gate
    narrows behind at the left, two tall silhouettes watching; the player runs on, alone, into a red dusk toward a
    low red sun that has two dark slits like a mask, a long shadow stretched back to the gate.  Bright mass right / low."""
    c = e.c
    G = GOD["khorne"]
    sky(c, ["#10040a", "#2a060c", "#521010", "#8a1e12", "#c8441c", "#ec8a2c"], 0, 68)
    n = e.noise("cl")
    for y in range(0, 60):
        for x in range(192):
            v = n.fbm(x * 0.018, y * 0.07, 4)
            if v > 0.54:
                c.set(x, y, ramp_pick(["#1a0408", "#34080c", "#6a1410", "#a02a14"], (v - 0.54) * 2.6 + y / 160.0, x, y))
    glow(c, 148, 66, 74, ["#521010", "#8a1e12", "#c8441c", "#ec8a2c", "#ffc060"], power=1.3, strength=0.95, ry=44)
    # the sun: a big half-sunk disc with two dark slits (a mask), not a sigil
    sx, sy, sr = 148, 67, 24
    for y in range(sy - sr, 69):
        for x in range(sx - sr, sx + sr + 1):
            d = math.hypot(x - sx, y - sy)
            if d <= sr:
                c.set(x, y, ramp_pick(["#ff7a2a", "#ffa040", "#ffd080", "#fff0b0"], 1 - d / sr * 0.9, x, y))
    for sgn in (-1, 1):
        c.line([(sx + sgn * 5, sy - 9), (sx + sgn * 11, sy - 5)], "#7a1a10", 2)
    c.line([(sx - 6, sy - 1), (sx + 6, sy - 1)], "#7a1a10", 1)
    # far broken ridge, then the plain
    ridge(c, 69, 3, 9, "#2a0610", seed=e.seed_for("rg"), scale=0.06)
    hband(c, 69, 107, ["#8a1e12", "#521010", "#2a060c", "#10040a"], seed=e.seed_for("gd"), rough=0.3)
    light_pool(c, 148, 72, 70, 6, "#ffc060", t=0.7)                          # sun glare across the ground
    for k in range(60):                                                      # cracks + bone chips pointing to the sun
        rr_ = e.rng("c%d" % k)
        x, y = rr_.randint(0, 191), rr_.randint(72, 106)
        c.line([(x, y), (x + rr_.randint(-5, 5) + (148 - x) * 0.04, y + rr_.randint(-1, 1))], "#10040a", 1)
    for (x, y) in [(112, 78), (120, 86), (100, 92), (70, 96), (130, 98), (88, 82)]:     # skulls, tiny
        c.rect(x, y, x + 2, y + 1, "#c8b8a0"); c.set(x, y + 1, "#2a060c"); c.set(x + 2, y + 1, "#2a060c")
    # the webway gate at the left: a narrow teal slit in a bone arch, two tall watchers
    _ogive(c, 28, 86, 15, 56, w=3, cols=BONE, k=1.5, lit=1)
    left, right = _ogive_pts(28, 86, 12, 56, k=1.5)
    for y in range(40, 87):
        for x in range(14, 43):
            if math.hypot(x - 28, 0) < 0.1:
                pass
    # fill the opening with teal light (inside the inner arch)
    R = 1.5 * 12
    for y in range(int(left[-1][1]), 87):
        for x in range(16, 41):
            if y < 56 and (math.hypot(x - (28 - 12 + R), y - 56) > R or math.hypot(x - (28 + 12 - R), y - 56) > R):
                continue
            t = (y - left[-1][1]) / (87 - left[-1][1])
            c.set(x, y, ramp_pick(["#bafff8", "#4af0e0", "#1a8a9a", "#0e4a5a"], t * 0.9, x, y))
    for gxx in (23, 33):
        gf = _eldar(30, "#06141c", facing=1 if gxx < 28 else -1, pose="stand")
        put_figure(c, gf, gxx, 86, rim_col="#9af8f0", toward=(1 if gxx < 28 else -1, -0.2))
    light_pool(c, 28, 90, 26, 6, "#4af0e0", t=0.55)
    # the one who runs on: backlit, a mask on the face, a long shadow stretching back to the gate
    pl = player_fig("aeldari", 36, "run", facing=1)
    pl["img"] = tint(pl["img"], "#2a0610", 0.5)
    plx, ply = put_figure(c, pl, 100, 98, rim_col="#ffc060", toward=(1, -0.2),
                          shadow=dict(toward_light=(1.0, 0.25), length=1.7, squash=0.22, col="#10040a", t=0.8))
    hx_, hy_ = pl["head"]
    c.set(plx + int(hx_) + 1, ply + int(hy_), "#fff0d8")
    c.set(plx + int(hx_) + 1, ply + int(hy_) - 1, "#fff0d8")
    c.set(plx + int(hx_) + 2, ply + int(hy_) - 1, "#ff3a2a")
    particles(c, "ember", 60, (40, 20, 191, 100), seed=e.seed_for("emb"), cols=("#ffb040", "#ff6a2a", "#ffe08a"), wind=(-1, 1))
    haze(c, 62, 84, "#c8441c", 0.28, seed=e.seed_for("hz"), profile="mid")
    e.protect += ["#4af0e0", "#ff3a2a", "#fff0b0", "#bafff8"]
    vignette_kind(c, "bad", col="#10040a", strength=0.55)


def _bloom(c, x, y, r, rr, cols, stem="#2a3a12", stem_h=10, lean=0):
    """an over-large nodding flower on a bent stem (Nurgle's garden): petals ring, pustule dots, dark core."""
    top = (x + lean, y - stem_h)
    c.line([(x, y), (x + lean * 0.3, y - stem_h * 0.5), top], stem, 1)
    c.line([(x + 1, y), (x + 1 + lean * 0.3, y - stem_h * 0.5)], "#6c8a2a", 1)
    cx_, cy_ = int(top[0]), int(top[1])
    c.ellipse(cx_, cy_, r, max(1, int(r * 0.85)), cols[0])
    if r >= 3:
        c.ellipse(cx_, cy_, r - 1, max(1, int((r - 1) * 0.85)), cols[1])
    c.ellipse(cx_, cy_, max(1, r // 2), max(1, int(r * 0.4)), cols[2])
    for k in range(3 if r >= 3 else 1):
        ang = rr.uniform(0, 6.28)
        c.set(cx_ + math.cos(ang) * (r - 1), cy_ + math.sin(ang) * (r - 1) * 0.8, cols[3])


def _flies(c, rr, cx, cy, spread, n, body="#10160a", wing="#c8d8a0"):
    for _ in range(n):
        x = cx + rr.gauss(0, spread)
        y = cy + rr.gauss(0, spread * 0.7)
        c.set(x, y, body)
        c.set(x + rr.choice((-1, 1)), y - 1, wing)


@ending("eld_end_claim_nurgle")
def eld_end_claim_nurgle(e):
    """BAD / Nurgle.  The Exiled Gardener: the Aeldari have left (a teal spark leaving the sky); on an empty world the
    mon-keigh kneels in a garden of too-large blooms that grew from their wounds; the Gardener towers behind in the
    haze, pleased.  Flies.  Sick green and ochre; bright mass: the pale sun, upper left."""
    c = e.c
    G = GOD["nurgle"]
    sky(c, ["#080c04", "#141e0a", "#2c4214", "#52701e", "#80983a"], 0, 62)
    glow(c, 40, 42, 32, ["#52701e", "#8aa238", "#c0c870", "#f0f0b0"], power=1.6, strength=0.85, ry=24)
    c.ellipse(40, 40, 8, 8, "#f0f0b8")
    n = e.noise("smog")
    for y in range(0, 66):
        for x in range(192):
            v = n.fbm(x * 0.02, y * 0.06, 4)
            if v > 0.52:
                c.set(x, y, ramp_pick(["#141c0a", "#2a3a12", "#4a6220", "#7a9030"], (v - 0.52) * 2.8 + (1 - y / 70.0) * 0.15, x, y))
    # the Aeldari leaving: a tiny teal ship and its thin trail, upper right
    c.line([(176, 30), (150, 12)], "#4a8a8a", 1)
    c.set(177, 31, "#bafff8"); c.set(176, 30, "#4af0e0"); c.set(177, 30, "#4af0e0")
    ridge(c, 66, 3, 9, "#2e4416", seed=e.seed_for("rg"), scale=0.04)
    # the garden: dark earth in perspective beds, blooms growing bigger toward us
    for y in range(66, 108):
        for x in range(192):
            c.set(x, y, ramp_pick(["#34301a", "#242010", "#16140a", "#0c0a06"], (y - 66) / 42.0 * 0.9, x, y))
    VX = 130
    for k in range(-9, 10):
        c.line([(VX + k * 3, 66), (VX + k * 26, 107)], "#12100a", 2)
        c.line([(VX + k * 3 + 1, 66), (VX + k * 26 + 2, 107)], "#6a5a2a", 1)
    rr = e.rng("blooms")
    BL = [("#a8a030", "#d8c84a", "#e8e0a0", "#c87a7a"), ("#8a9a2a", "#b8c84a", "#e0e890", "#e8a0a8"), ("#c89a3a", "#e8c860", "#fff0b0", "#9a5a5a")]
    spots = []
    for k in range(-8, 9):
        for row in range(7):
            t = (row + 0.5) / 7.0
            y = 68 + (107 - 68) * t ** 1.5
            x = VX + (k + rr.uniform(-0.25, 0.25)) * (3 + 23 * t ** 1.5)
            if 4 <= x <= 188 and abs(x - 62) > 6 * (0.5 + t) or y < 88:
                spots.append((y, x, t))
    spots.sort()
    for (y, x, t) in spots:
        if y > 92 and x < 92:
            continue                                       # keep the kneeling figure's area clear
        _bloom(c, int(x), int(y), max(1, int(1 + 5.5 * t)), rr, rr.choice(BL), stem_h=3 + 12 * t, lean=rr.choice((-1, 1)) * (1 + t * 3))
    # the Gardener: big, hazy, behind and to the right, facing the player
    dm = spr("daemon_nurgle", 2, mirror=True, tint_to="#10180a", tint_t=0.6, bottom_fade=16)
    dm = rim(dm, "#a8b84a", toward=(-1, -1))
    place(c, dm, 168, 106, "bm")
    haze(c, 70, 104, "#6c8a2a", 0.22, seed=e.seed_for("hz"), profile="bottom", x0=110)
    # the gardener-who-was: kneeling, hands in the soil, tiny flowers growing from the shoulder
    pl = player_fig("aeldari", 32, "kneel", facing=1)
    plx, ply = put_figure(c, pl, 66, 100, rim_col="#d8d880", toward=(-1, -1),
                          shadow=dict(toward_light=(-0.8, 0.3), length=1.0, squash=0.22, col="#0a0c04", t=0.6))
    hx_, hy_ = pl["head"]
    for (dx, dy, col) in [(-3, 5, "#e8a0a8"), (1, 6, "#e8e0a0"), (-2, 8, "#e8a0a8"), (3, 12, "#e8e0a0")]:
        c.set(plx + int(hx_) + dx, ply + int(hy_) + dy, col)
    c.rect(36, 97, 43, 101, "#6a4a2a"); c.rect(36, 97, 43, 97, "#a88a4a"); c.rect(38, 95, 41, 96, "#6a4a2a")      # the bag of seeds
    for (sx_, sy_) in [(44, 101), (47, 102), (50, 100)]:
        c.set(sx_, sy_, "#e8c860")
    rr2 = e.rng("flies")
    _flies(c, rr2, 66, 70, 12, 22)
    _flies(c, rr2, 156, 50, 14, 24)
    particles(c, "spore", 40, (0, 20, 191, 100), seed=e.seed_for("sp"), cols=("#c8e070", "#e8ff9a", "#8ab040"))
    e.protect += ["#4af0e0", "#e8a0a8", "#e8ff9a"]
    vignette_kind(c, "bad", col="#050702", strength=0.85)


@ending("eld_end_claim_slaanesh")
def eld_end_claim_slaanesh(e):
    """BAD / Slaanesh.  A Sweet Before the Meal: a dark craftworld hall; one small figure sits before a vast silver
    mirror that glows magenta, smiling, dust-grey, years of fallen petals heaped about them; the spirit stone on
    their chest is dark; in the mirror something tall and elegant waits, and ghostly hands clap in the pillars.
    Light: the mirror, right of centre; magenta + silver."""
    c = e.c
    G = GOD["slaanesh"]
    for y in range(108):
        for x in range(192):
            c.set(x, y, ramp_pick(["#08030e", "#10061a", "#240a38"], y / 108.0 * 0.7 + (x / 192.0) * 0.2, x, y))
    # pillars of bone receding into the dark (left and far), only their lit edges show
    for (cx_, hw_, ys_, yb_, cols_) in [(26, 22, 74, 98, ["#10061a", "#3a2a5a", "#6a5a88", "#9a8ab0", "#c8b8d8"]),
                                         (160, 20, 72, 96, ["#10061a", "#3a2a5a", "#6a5a88", "#9a8ab0", "#c8b8d8"])]:
        _ogive(c, cx_, yb_, hw_, ys_, w=3, cols=cols_, k=1.4, lit=1 if cx_ < 100 else -1)
    # the mirror: a great silver oval, magenta light within, a tall figure waiting inside
    mx, my, a_, b_ = 108, 46, 27, 36
    glow(c, mx, my, 62, ["#3a1058", "#7a2a9a", "#c850c8", "#ff8ad8"], power=1.3, strength=0.9, ry=64)
    _vesica_or_oval = lambda col, aa, bb: c.ellipse(mx, my, aa, bb, col)        # noqa: E731
    _vesica_or_oval("#e8e8f8", a_ + 3, b_ + 3)
    _vesica_or_oval("#7a7a9a", a_ + 1, b_ + 1)
    for y in range(my - b_, my + b_ + 1):
        for x in range(mx - a_, mx + a_ + 1):
            d = math.hypot((x - mx) / float(a_), (y - my) / float(b_))
            if d <= 1:
                c.set(x, y, ramp_pick(["#ffb8e8", "#ff8ad8", "#c850c8", "#7a2a9a", "#3a1058"], d ** 1.2 * 0.95 + (x - mx) / 160.0, x, y))
    for k in range(7):                                                      # silver glints around the frame
        ang = k * 0.9 + 0.3
        _spark(c, int(mx + math.cos(ang) * (a_ + 3)), int(my + math.sin(ang) * (b_ + 3)), "#e8e8f8", 2)
    dg = spr("daemon_slaanesh", 1, mirror=True, silhouette=("#2a0a40", "#4a1a6a"))
    dg = rim(dg, "#ffb8e8", toward=(0, -1))
    place(c, dg, mx + 2, my + b_ - 3, "bm")
    # floor: black glass catching the mirror's glow
    for y in range(84, 108):
        for x in range(192):
            tt = (y - 84) / 24.0
            c.set(x, y, ramp_pick(["#3a1058", "#240a38", "#10061a", "#08030e"], tt, x, y))
    light_pool(c, 108, 92, 60, 12, "#ff8ad8", t=0.55)
    for k in range(-5, 6):                                                  # reflection streaks
        c.line([(108 + k * 4, 84), (108 + k * 7, 107)], "#c850c8", 1) if abs(k) % 2 == 0 else None
    # petals piled around the seat (years)
    rr = e.rng("pet")
    for _ in range(140):
        px_ = 52 + rr.gauss(0, 15)
        py_ = 100 + rr.gauss(0, 3.2)
        if 80 <= py_ <= 107:
            c.set(px_, py_, rr.choice(("#ff8ad8", "#c850c8", "#e8e8f8", "#ffb8e8")))
    # the one who sat down to listen: small, grey with dust, smiling, spirit stone dark
    pl = player_fig("aeldari", 46, "sit", facing=1)
    pl["img"] = tint(pl["img"], "#a898b8", 0.38)
    plx, ply = put_figure(c, pl, 58, 101, rim_col="#ff8ad8", toward=(1, -0.3),
                          shadow=dict(toward_light=(0.9, 0.3), length=1.0, squash=0.22, col="#08030e", t=0.7))
    _skin_head(c, pl, plx, ply, 46, facing=1, skin="#c8b8c8", hair="#4a3a58", shade="#8a7a98")
    hx_, hy_ = pl["head"]
    c.set(plx + int(hx_) + 3, ply + int(hy_) + 2, "#ffd8f0")                 # the smile
    c.set(plx + int(hx_) + 2, ply + int(hy_) + 3, "#ffd8f0")
    c.rect(plx + int(hx_) + 1, ply + int(hy_) + 10, plx + int(hx_) + 2, ply + int(hy_) + 11, "#10061a")   # empty stone socket
    # applause: robed figures between the pillars, hands together, rim-lit by the mirror
    for (gx, gy, gh) in [(14, 94, 32), (36, 89, 25), (143, 88, 24), (160, 96, 33), (180, 91, 27)]:
        gf = fig(gh, "arms_up", "#2c0c44", robe=0.75, facing=1 if gx < 108 else -1)
        put_figure(c, gf, gx, gy, rim_col="#ff8ad8", toward=(1 if gx < 108 else -1, -0.2))
    particles(c, "petal", 30, (0, 8, 191, 90), seed=e.seed_for("pt"), cols=("#ff8ad8", "#c850c8", "#e8e8f8"))
    e.protect += ["#ff8ad8", "#e8e8f8", "#ffd8f0"]
    vignette_kind(c, "bad", col="#05020a", strength=0.6)


@ending("eld_end_claim_tzeentch")
def eld_end_claim_tzeentch(e):
    """BAD / Tzeentch.  The Hand on the Threads: a web of glowing fate-threads fans down from a dark pointed gate with
    a slit iris at the top; the player stands with arms raised 'plucking', but every thread runs up past the wrists
    into the gate -- they are the puppet; three snapped threads curl in the dark, the Farseer staggers at the left.
    Light: threads and the iris, top centre; blue + pink-violet."""
    c = e.c
    G = GOD["tzeentch"]
    for y in range(108):
        for x in range(192):
            c.set(x, y, ramp_pick(["#05030c", "#0a0e3a", "#1a1a6a", "#3a1a7a"], (1 - y / 108.0) * 0.6 + abs(x - 96) / 400.0, x, y))
    n = e.noise("neb")
    for y in range(108):
        for x in range(192):
            v = n.fbm(x * 0.025, y * 0.04, 4)
            if v > 0.55:
                c.set(x, y, ramp_pick(["#0a0e3a", "#1a1a6a", "#5a2a9a", "#c0309a"], (v - 0.55) * 3.0, x, y))
    stars(c, e.seed_for("st"), 70, 0, 107, cols=("#5a6ab8", "#9aaae8", "#ffffff"))
    # the gate at the top: dark pointed oval, a slit iris looking down
    gx, gy = 96, 10
    glow(c, gx, gy, 60, ["#1a1a6a", "#2a5ad8", "#9af6ff", "#ffffff"], power=1.8, strength=0.9, ry=34)
    _vesica(c, gx, gy, 20, 18, "#07040f")
    _vesica(c, gx, gy, 18, 16, "#0a1e7a")
    _vesica(c, gx, gy, 12, 11, "#2ab8ff")
    _vesica(c, gx, gy, 6, 10, "#e83aa8")
    c.rect(gx - 1, gy - 9, gx, gy + 9, "#07040f")                            # the slit pupil
    c.set(gx, gy - 3, "#ffffff")
    # the web: threads from the gate to the world; many, taut, with beads
    rr = e.rng("web")
    pl_x, pl_y = 100, 76
    targets = [(rr.uniform(0, 191), rr.choice((70, 80, 90, 102, 107)) if rr.random() < 0.6 else rr.uniform(20, 107)) for _ in range(34)]
    tcols = ["#2a5ad8", "#2ab8ff", "#9af6ff", "#e83aa8", "#a85ad8"]
    for (tx, ty) in targets:
        col = rr.choice(tcols)
        mx_, my_ = (gx + tx) / 2 + rr.uniform(-8, 8), (gy + ty) / 2 + rr.uniform(-4, 6)
        prev = (gx + rr.uniform(-3, 3), gy + 6)
        for i in range(1, 41):
            t = i / 40.0
            q = _bez((gx, gy + 6), (mx_, my_), (tx, ty), t)
            blend(c, int(q[0]), int(q[1]), col, 0.8 - 0.4 * t, 3)
            if i % 9 == 0 and rr.random() < 0.6:
                c.set(int(q[0]), int(q[1]), "#ffffff")
    # three severed threads: ends curling, a spark where they snapped
    for (sx, sy, ex, ey) in [(30, 12, 22, 44), (160, 10, 170, 36), (60, 6, 48, 30)]:
        for i in range(0, 41):
            t = i / 40.0
            q = _bez((sx, sy), (sx + (ex - sx) * 0.2, sy + (ey - sy) * 0.8), (ex, ey), t)
            if t < 0.82:
                blend(c, int(q[0]), int(q[1]), "#e83aa8", 0.75, 3)
        _spark(c, ex, ey, "#ffd0f0", 2)
        c.line([(ex, ey), (ex + 3, ey + 3), (ex + 1, ey + 6), (ex + 4, ey + 8)], "#e83aa8", 1)
    # the floor: a round dais of bone in the void, rune-gems
    for y in range(86, 108):
        for x in range(192):
            d = math.hypot((x - 100) / 70.0, (y - 94) / 12.0)
            if d <= 1:
                c.set(x, y, ramp_pick(["#9a96c0", "#5a5a88", "#2a2a58", "#14143a"], d * 0.9 + (y - 86) / 60.0, x, y))
    light_pool(c, 100, 90, 40, 8, "#9af6ff", t=0.4)
    for k in range(8):
        a_ = k * 0.785
        _gem(c, int(100 + math.cos(a_) * 50), int(94 + math.sin(a_) * 8), "#e83aa8" if k % 2 else "#2ab8ff", r=1, halo=0.3)
    # the Farseer, off to the left, staggering back; her runes spilled
    fs = _eldar(36, "#3a3a9a", facing=1, pose="bow", staff=True)
    fx, fy = put_figure(c, fs, 38, 96, rim_col="#9af6ff", toward=(1, -0.5))
    for (rx_, ry_) in [(50, 100), (54, 98), (47, 102)]:
        _gem(c, rx_, ry_, "#9af6ff", r=1, halo=0.3)
    # the player: arms up, threads from both wrists and the head run straight up into the gate (the puppet)
    pl = player_fig("aeldari", 32, "arms_up", facing=1)
    plx, ply = put_figure(c, pl, pl_x, 98, rim_col="#9af6ff", toward=(0, -1),
                          shadow=dict(toward_light=(0, -1.0), length=0.5, squash=0.25, col="#05030c", t=0.5))
    anchors = [pl["hands"][0], pl["hands"][1], pl["head"]]
    for (ax, ay) in anchors:
        axx, ayy = plx + ax, ply + ay
        for i in range(0, 61):
            t = i / 60.0
            q = _bez((axx, ayy), ((axx + gx) / 2 + (6 if axx > gx else -6), (ayy + gy) / 2), (gx, gy + 8), t)
            c.set(int(q[0]), int(q[1]), "#ffffff" if i % 7 == 0 else "#9af6ff")
    # the smile
    hx_, hy_ = pl["head"]
    c.set(plx + int(hx_) + 1, ply + int(hy_) + 1, "#ffffff")
    particles(c, "mote", 30, (20, 20, 180, 100), seed=e.seed_for("mt"), cols=("#9af6ff", "#e83aa8", "#ffffff"))
    e.protect += ["#ffffff", "#e83aa8", "#9af6ff"]
    vignette_kind(c, "bad", col="#05030c", strength=0.55)


@ending("eld_end_drukhari")
def eld_end_drukhari(e):
    """BAD.  City Without Sun: Commorragh -- no sky, only black spires hanging and rising into a ceiling of dim
    lights; the player stands straight on the auction block in one cone of sick green light, a tiny warm spark
    cupped in their hands (the only warm thing: hope); the owner leans in from the right.
    Light: one green cone from the upper left; bright mass left of centre."""
    c = e.c
    for y in range(108):
        for x in range(192):
            c.set(x, y, ramp_pick(["#0a0618", "#160c2a", "#241440", "#3a2468"], 0.2 + (y / 108.0) * 0.55 + (x / 192.0) * 0.1, x, y))
    stars(c, e.seed_for("st"), 50, 0, 40, cols=("#3a2a5a", "#7a4aa0", "#a8ff7a"))
    rr = e.rng("spires")
    # three layers of black spires; far ones violet, near ones black; some hang from the 'ceiling'
    for (layer, col, tipc, n_, hmin, hmax, base) in [(0, "#4a3a80", "#8a7ac0", 14, 30, 62, 70), (1, "#2a1c52", "#5a4a98", 11, 40, 80, 82),
                                                     (2, "#0c0618", "#32204e", 7, 60, 100, 100)]:
        for k in range(n_):
            x = rr.randint(-6, 192)
            w = rr.randint(4, 9) + layer * 2
            h = rr.randint(hmin, hmax)
            c.poly([(x - w // 2, base), (x + w // 2, base), (x + 1, base - h)], col)
            c.line([(x, base - h), (x, base - h - 3 - layer * 2)], tipc, 1)
            c.line([(x + w // 2, base), (x + 1, base - h)], tipc, 1)
            for wy in range(base - h + 8, base - 4, 7):
                if rr.random() < 0.28:
                    c.set(x + rr.randint(-1, 1), wy, "#a8ff7a" if rr.random() < 0.6 else "#c850c8")
    for k in range(7):                                                       # hanging spires from the ceiling
        x = 10 + k * 28 + rr.randint(-6, 6)
        h = rr.randint(14, 30)
        c.poly([(x - 4, 0), (x + 4, 0), (x, h)], "#0a0618")
        c.line([(x, h), (x, h + 4)], "#3a2a5a", 1)
    # the plaza floor, black glass
    hband(c, 88, 107, ["#3a2a64", "#241846", "#120a28", "#08040e"], seed=e.seed_for("fl"), rough=0.15)
    glow(c, 96, 86, 100, ["#1a1030", "#2a2058", "#40307a"], power=1.2, strength=0.6, ry=22)
    # the lamp: a hanging green lantern and its cone
    lx, ly = 66, 22
    c.line([(lx, 0), (lx, ly - 3)], "#3a2a5a", 1)
    glow(c, lx, ly, 14, ["#2a5a2a", "#6aff4a", "#d8ffb0"], power=1.2, strength=1.0, ry=12)
    c.rect(lx - 2, ly - 2, lx + 2, ly + 2, "#d8ffb0")
    shafts(c, (lx, ly + 2), 90, 38, 7, 78, "#8aff5a", t=0.30, seed=e.seed_for("sh"), w0=2, w1=16, power=0.5, floor=102)
    # the block: a raised octagonal dais with steps
    c.poly([(40, 96), (98, 96), (92, 86), (46, 86)], "#3a2a5a")
    c.poly([(46, 86), (92, 86), (88, 82), (50, 82)], "#6a4aa0")
    c.rect(46, 86, 92, 86, "#a8ff7a")
    c.rect(40, 96, 98, 97, "#12081e")
    for xx in range(46, 94, 8):
        c.line([(xx - 3 + (xx - 69) * 0.12, 96), (xx, 86)], "#241440", 1)
    for (cx_, cy_) in [(44, 88), (94, 88)]:                                  # chains hanging from the dais corners
        for k in range(5):
            c.set(cx_ + (k % 2), cy_ + k * 2, "#8a8aa8")
    light_pool(c, 69, 84, 36, 8, "#a8ff7a", t=0.55)
    pl = player_fig("aeldari", 30, "stand", facing=1)
    plx, ply = put_figure(c, pl, 69, 83, rim_col="#d8ffb0", toward=(0, -1),
                          shadow=dict(toward_light=(0.2, -0.3), length=0.4, squash=0.25, col="#04020a", t=0.5))
    # hope: a tiny warm spark in cupped hands (the one warm colour in the city)
    hxy = pl["hands"][0]
    sx_, sy_ = plx + int(hxy[0]) + 1, ply + int(hxy[1]) - 1
    light_pool(c, sx_, sy_, 8, 8, "#ffc060", t=0.7, power=1.0)
    c.set(sx_, sy_, "#fff0b0"); c.set(sx_ + 1, sy_, "#ffc060"); c.set(sx_, sy_ - 1, "#ffc060")
    hx_, hy_ = pl["head"]
    c.set(plx + int(hx_) + 1, ply + int(hy_) + 1, "#fff0b0")               # the smile that won't leave
    # the crowd of buyers: spiked silhouettes in rows (backs and hoods), left and right of the dais
    rr2 = e.rng("buyers")
    for (x0, x1) in [(2, 34), (104, 126)]:
        crowd(c, x0, x1, 92, 104, 7, 16, 24, "#1c1032", seed=e.seed_for("cr%d" % x0), rim_col=None,
              poses=("stand", "stand", "hunch"), robe_p=0.7)
    for (x_, y_) in [(10, 80), (24, 79), (110, 80)]:
        c.set(x_, y_, "#a8ff7a")
    # the owner at the right: tall, spined, leaning in toward the block, one hand out
    glow(c, 140, 74, 26, ["#0c0618", "#241846", "#3a2c6c", "#5a4a98"], power=1.6, strength=0.8, ry=42)   # a violet back-light
    ow = _eldar(50, "#0a0514", facing=-1, pose="reach")
    owx, owy = put_figure(c, ow, 142, 108)
    ohx, ohy = ow["head"]
    c.rect(owx + int(ohx) - 2, owy + int(ohy) - 1, owx + int(ohx) - 1, owy + int(ohy) + 1, "#e8e0f0")     # a pale half-mask
    for k in range(3):                                                       # a crown of thorns and shoulder spines
        c.line([(owx + ohx - 2 + k * 2, owy + ohy - 3), (owx + ohx - 4 + k * 3, owy + ohy - 9 - k)], "#1c1030", 1)
        c.set(owx + ohx - 4 + k * 3, owy + ohy - 9 - k, "#a8ff7a")
    c.line([(owx + ohx + 3, owy + ohy + 6), (owx + ohx + 9, owy + ohy + 1)], "#1c1030", 1)
    c.set(owx + ohx - 2, owy + ohy, "#ff3aa8")
    c.set(owx + ohx - 4, owy + ohy, "#ff3aa8")
    particles(c, "ash", 30, (0, 10, 191, 100), seed=e.seed_for("as"), cols=("#3a2a5a", "#5a3a8a", "#8a6ac0"))
    e.protect += ["#a8ff7a", "#fff0b0", "#ffc060", "#ff3aa8"]
    vignette_kind(c, "bad", col="#04020a", strength=0.4)


@ending("eld_end_harvest")
def eld_end_harvest(e):
    """BAD.  The Last Harvest: a pale wheat field under a green-grey dusk at Valda; a silver skeleton warrior as tall as
    two men raises its weapon-hand before the small figure who stands still and does not run; the black tomb waits
    on the horizon, its apex a green star.  Light: green-white from the tomb and the warrior's eyes; cold.
    Bright mass: upper left horizon; warrior right."""
    c = e.c
    sky(c, ["#080e10", "#142020", "#2a3c38", "#5a7466", "#8aa090"], 0, 60)
    n = e.noise("cl")
    for y in range(0, 52):
        for x in range(192):
            v = n.fbm(x * 0.018, y * 0.07, 4)
            if v > 0.55:
                c.set(x, y, ramp_pick(["#142020", "#2a3c38", "#4a6458", "#8aa490"], (v - 0.55) * 2.6 + y / 120.0, x, y))
    # the tomb: a black pyramid with green seam-lights, far left, and its apex star
    px0, pyb = 52, 66
    c.poly([(px0 - 44, pyb), (px0 + 44, pyb), (px0, 14)], "#0a1214")
    c.line([(px0 - 44, pyb), (px0, 14)], "#3aff7a", 1)
    c.line([(px0, 14), (px0 + 44, pyb)], "#1a8a4a", 1)
    for k in range(1, 6):
        yy = 14 + k * 9
        hw_ = (yy - 14) * 0.81
        c.line([(px0 - hw_ + 4, yy), (px0 + hw_ - 4, yy)], "#142a24", 1)
    glow(c, px0, 14, 12, ["#1a5a3a", "#3aff7a", "#d8ffe0"], power=1.2, strength=1.0, ry=12)
    c.set(px0, 14, "#ffffff")
    shafts(c, (px0, 14), 90, 40, 4, 40, "#3aff7a", t=0.16, seed=e.seed_for("sh"), w0=1, w1=7, power=0.6, floor=64)
    ridge(c, 68, 2, 6, "#142420", seed=e.seed_for("rg"), scale=0.05)
    # the field: cold pale wheat in bands, getting taller and darker toward us
    for y in range(66, 108):
        for x in range(192):
            c.set(x, y, ramp_pick(["#5a6a4c", "#3a4630", "#222c20", "#121a12", "#080c08"], (y - 66) / 42.0, x, y, sharp=3.0))
    WHT = ["#080c08", "#3a4630", "#8a9a72", "#c0cc9c"]
    _wheat(c, 68, 88, 0, 191, e.seed_for("w1"), WHT, top_h=3.5, bot_h=8)
    # the warrior: a big silver skeleton at the right, hand raised toward the small figure
    nw = spr("necron_warrior", 2, tint_to="#10181a", tint_t=0.25, bottom_fade=0)
    nw = rim(nw, "#c8ffe0", toward=(-1, -0.6))
    place(c, nw, 146, 100, "bm")
    glow(c, 112, 58, 10, ["#1a5a3a", "#3aff7a", "#d8ffe0"], power=1.1, strength=0.8, ry=8)     # weapon flare at the raised hand
    c.set(112, 58, "#ffffff")
    # the small figure who does not run
    pl = player_fig("aeldari", 28, "stand", facing=1)
    plx, ply = put_figure(c, pl, 62, 96, rim_col="#c8ffe0", toward=(1, -0.3),
                          shadow=dict(toward_light=(0.8, 0.2), length=0.9, squash=0.2, col="#0c120c", t=0.6))
    # near wheat across the lower edge, thick and dark, hiding feet and the warrior's base
    for y in range(96, 108):
        for x in range(192):
            c.set(x, y, ramp_pick(["#2a3420", "#161c12", "#0a0e0a"], (y - 96) / 12.0, x, y))
    _wheat(c, 96, 108, 0, 191, e.seed_for("w2"), WHT, top_h=9, bot_h=14, dens=1.0)
    particles(c, "spore", 20, (60, 24, 190, 90), seed=e.seed_for("sp"), cols=("#3aff7a", "#a8ffc8", "#e8fff0"))
    e.protect += ["#3aff7a", "#ffffff", "#c8ffe0"]
    vignette_kind(c, "bad", col="#050a0a", strength=0.72)


@ending("eld_end_sealed")
def eld_end_sealed(e):
    """BAD.  Behind the Seal: inside the webway the great gate is almost shut; a bar of white-teal light through the
    last slit shows a tiny Farseer silhouette outside, head lowered, a thread snapped between her fingers; in front
    of the slit the small human stands facing it; from the dark at the right something vast and elegant leans in.
    Light: the slit (left), a wedge on the floor.  Bright mass left."""
    c = e.c
    for y in range(108):
        for x in range(192):
            c.set(x, y, ramp_pick(["#04050e", "#080a1e", "#10143a"], (y / 108.0) * 0.5 + (x / 192.0) * 0.15, x, y))
    stars(c, e.seed_for("st"), 40, 0, 60, cols=("#3a4a7a", "#6a7ab8"))
    # the gate wall: a pointed arch, two leaves almost closed
    cx, yb, hw, ys = 38, 88, 24, 48
    left, right = _ogive_pts(cx, yb, hw, ys, k=1.5)
    R = 1.5 * hw
    for y in range(int(left[-1][1]), yb + 1):
        for x in range(cx - hw, cx + hw + 1):
            if y < ys and (math.hypot(x - (cx - hw + R), y - ys) > R or math.hypot(x - (cx + hw - R), y - ys) > R):
                continue
            side = x < cx
            t = clamp((y - left[-1][1]) / (yb - left[-1][1]) * 0.5 + abs(x - cx) / 48.0 * 0.4)
            c.set(x, y, ramp_pick(["#b0acd0", "#7a7aa0", "#46466e", "#22224a"], t, x, y, sharp=4.0))
    for k in range(-2, 3):                                                   # leaf ribs
        if k:
            c.line([(cx + k * 8, ys + 4 + abs(k) * 6), (cx + k * 8, yb)], "#2a2a4e", 1)
    # the last slit: bright teal-white, with the Farseer tiny inside it
    for y in range(int(left[-1][1]) + 6, yb + 1):
        w_ = 3 if y < 64 else 3
        for x in range(cx - w_, cx + w_ + 1):
            tt = abs(x - cx) / float(w_ + 1)
            c.set(x, y, "#ffffff" if tt < 0.4 else ("#bafff8" if tt < 0.8 else "#4af0e0"))
    fs = _eldar(26, "#0a1a2a", facing=1, pose="bow", cloak=False)
    fx, fy = put_figure(c, fs, cx, 86)
    c.set(cx + 2, 70, "#ffffff")
    _bone_line(c, left, 3, BONE, lit=1)
    _bone_line(c, right, 3, BONE, lit=-1)
    # a thread struck from the runes: a thin glowing line, snapped, drifting out of the slit
    for i in range(0, 25):
        t = i / 24.0
        q = _bez((cx + 3, 68), (cx + 20, 60), (cx + 30, 76), t)
        blend(c, int(q[0]), int(q[1]), "#e8e8ff", 0.85 - 0.5 * t, 3)
    _spark(c, cx + 30, 76, "#bafff8", 2)
    # floor + the wedge of light spilling from the slit, narrowing into the dark
    for y in range(88, 108):
        for x in range(192):
            c.set(x, y, ramp_pick(["#1a2050", "#0e1230", "#070a1c", "#04050e"], (y - 88) / 20.0, x, y))
    for y in range(88, 108):
        for x in range(0, 192):
            u = (y - 88) / 19.0
            xl, xr = 34 - u * 24, 42 + u * 62
            if xl <= x <= xr:
                d = 1 - (x - xl) / (xr - xl)
                blend(c, x, y, "#8aeee8", 0.55 * d * (1 - u * 0.5), 3)
    # the small human, facing the slit, a long shadow thrown toward the dark
    pl = player_fig("aeldari", 22, "stand", facing=-1)
    plx, ply = put_figure(c, pl, 58, 98, rim_col="#bafff8", toward=(-1, -0.3),
                          shadow=dict(toward_light=(-0.9, 0.3), length=1.6, squash=0.25, col="#04050e", t=0.8))
    # the daemon: vast, elegant, dark violet, only its lit edge and eyes show; leaning in from the right
    dg = spr("greater_daemon_slaanesh", 1, mirror=True, silhouette=("#10061a", "#24103a"))
    dg = rim(dg, "#c850c8", toward=(-1, -0.4))
    place(c, dg, 150, 108, "bm")
    c.set(126, 40, "#ff8ad8"); c.set(128, 40, "#ff8ad8")
    light_pool(c, 127, 40, 8, 5, "#c850c8", t=0.5)
    particles(c, "mote", 16, (20, 20, 180, 100), seed=e.seed_for("mt"), cols=("#4af0e0", "#bafff8"))
    e.protect += ["#ffffff", "#4af0e0", "#ff8ad8"]
    vignette_kind(c, "bad", col="#030410", strength=0.6)


@ending("eld_end_thirst")
def eld_end_thirst(e):
    """BAD.  The Perfect Supper: a long table of identical, perfect place settings, every candle the same height,
    the window full of flawless gold wheat; Nell waits in the open door at the left, the player eats at the far
    end -- and on the wall behind them hangs the shadow of something tall that is feasting.  Sickly pink + gold.
    Light: the window (left), candles; bright mass left."""
    c = e.c
    # wall: plum with a perfect diamond pattern
    for y in range(0, 80):
        for x in range(192):
            c.set(x, y, ramp_pick(["#1a0828", "#2a1038", "#3e1a4c", "#5a2a68"], 0.2 + (y / 80.0) * 0.4 - x / 600.0, x, y, sharp=3.5))
    for y in range(4, 78, 6):
        for x in range(0, 192, 6):
            xx = x + (3 if (y // 6) % 2 else 0)
            c.poly([(xx, y - 2), (xx + 2, y), (xx, y + 2), (xx - 2, y)], "#6a3a74")
    # the window: a perfect gold field and pale pink sky
    wx0, wx1, wy0, wy1 = 40, 112, 10, 66
    for y in range(wy0, wy1 + 1):
        for x in range(wx0, wx1 + 1):
            if y < wy0 + 14 and ((x - (wx0 + wx1) / 2) / ((wx1 - wx0) / 2)) ** 2 + ((y - (wy0 + 14)) / 14.0) ** 2 > 1:
                continue
            t = (y - wy0) / float(wy1 - wy0)
            c.set(x, y, ramp_pick(["#d890b8", "#e0889c", "#e8b060", "#cc8c30", "#8a5a18"], t, x, y))
    for y in range(44, wy1 + 1):                                             # flawless rows of wheat
        for x in range(wx0, wx1 + 1):
            if (x + (y // 4) * 2) % 4 == 0:
                c.set(x, y, "#ffe488")
            elif y % 4 == 0:
                c.set(x, y, "#a86a18")
    glow(c, 90, 30, 22, ["#e8a0c0", "#f8d0e0", "#ffffff"], power=1.5, strength=0.7, ry=15)
    for (x0_, x1_, y0_, y1_) in [(wx0 - 2, wx1 + 2, wy1, wy1 + 2), (74, 78, wy0 + 6, wy1)]:           # sill + mullion
        c.rect(x0_, y0_, x1_, y1_, "#241034")
    c.rect(wx0 - 2, wy0 + 12, wx0 - 1, wy1, "#241034"); c.rect(wx1 + 1, wy0 + 12, wx1 + 2, wy1, "#241034")
    # the open door at the far left: warm light, Nell waiting
    c.rect(4, 14, 28, 80, "#0e0618")
    for y in range(18, 81):
        for x in range(7, 26):
            c.set(x, y, ramp_pick(["#d8b878", "#b88a48", "#7a5428"], (y - 18) / 62.0, x, y))
    nl = fig(24, "stand", "#2a1034", facing=1, robe=0.8)
    put_figure(c, nl, 16, 80, rim_col="#ffe8b0", toward=(-1, -0.2))
    # the shadow on the wall behind the diner: tall, horned, feasting; not the diner's own
    light_pool(c, 150, 40, 50, 42, "#e890b8", t=0.42, power=0.7)
    sh = spr("greater_daemon_slaanesh", 1, mirror=True, silhouette=("#1c0a2a", "#6a3a82"))
    sh = rim(sh, "#ffb8d8", toward=(-1, -0.3))
    place(c, sh, 150, 86, "bm")
    # the diner behind the table's far side, hunched over the plate, facing the plate
    pl = player_fig("aeldari", 64, "hunch", facing=-1)
    pdx, pdy = put_figure(c, pl, 150, 112, rim_col="#ffb040", toward=(-1, -0.2))
    _shade_fig(c, pl, pdx, pdy, "#12061a", 0.3)
    _skin_head(c, pl, pdx, pdy, 64, facing=-1)
    # the table: long, plum, a white cloth, identical settings -- all the same
    c.rect(0, 80, 191, 84, "#f0e0e8")
    c.rect(0, 84, 191, 92, "#5a2a5a")
    c.rect(0, 92, 191, 94, "#2a0e3a")
    c.rect(0, 80, 191, 80, "#ffffff")
    for k in range(9):
        x = 26 + k * 18
        c.ellipse(x, 82, 5, 1, "#ffffff")                                    # the plate
        c.ellipse(x, 82, 3, 1, "#e8b8d0")
        c.rect(x + 7, 76, x + 8, 81, "#fff0c8")                              # the candle, always the same height
        c.set(x + 7, 75, "#ffb040"); c.set(x + 8, 75, "#ffe088"); c.set(x + 7, 74, "#ffe088")
        light_pool(c, x + 7, 76, 9, 9, "#ffb040", t=0.35)
        c.rect(x - 8, 78, x - 7, 81, "#e8d8e8")                              # the cup
    for y in range(95, 108):                                                  # the floor under the table
        for x in range(192):
            c.set(x, y, ramp_pick(["#2a0e3a", "#1a0a28", "#0e0518"], (y - 95) / 13.0, x, y))
    for x in range(10, 192, 36):
        c.rect(x, 94, x + 2, 104, "#12061a")                                 # table legs, evenly spaced
    particles(c, "mote", 20, (30, 10, 190, 78), seed=e.seed_for("mt"), cols=("#ffe0f0", "#ffc8d8"))
    e.protect += ["#ffe088", "#ffb040", "#ffffff"]
    vignette_kind(c, "bad", col="#0e0414", strength=0.95, inner=0.22, power=1.3)


def _lying_player(c, x, y, face=1, coat="#8a6440", dark="#4a3424", band="#2ec4b8", skin="#e2bf88"):
    """the human lying on their back, seen from the side: head at (x - 20*face), feet toward +face; y = floor line."""
    f = face
    c.ellipse(x, y + 1, 24, 2, "#05060f")                                    # contact shadow
    c.rect(x + f * 5, y - 3, x + f * 21, y - 1, dark)                         # legs
    c.rect(x + f * 21, y - 4, x + f * 22, y - 1, "#1c1410")                   # boots
    c.rect(x + f * 5, y - 3, x + f * 21, y - 3, coat)
    for xx in range(-15, 6):                                                  # torso
        c.rect(x + f * xx, y - 6, x + f * xx, y - 1, coat if xx > -10 else band)
    c.line([(x - f * 15, y - 6), (x + f * 5, y - 6)], "#a8804e", 1)           # lit upper edge
    c.rect(x - f * 8, y - 3, x + f * 1, y - 2, dark)                           # an arm folded over the belly
    c.ellipse(x - f * 19, y - 4, 3, 3, skin)                                   # head
    c.rect(x - f * 22, y - 5, x - f * 21, y - 2, "#37281f")                    # hair
    c.set(x - f * 18, y - 4, "#37281f")


def _lit_by(c, f, ox, oy, lx, ly, col, reach, t=0.5):
    """warm a drawn figure (top-left ox, oy) by a point light at (lx, ly): blend toward col by distance."""
    img = f["img"]
    src = img.load()
    for j in range(img.height):
        for i in range(img.width):
            if src[i, j][3] < 128:
                continue
            d = math.hypot(ox + i - lx, oy + j - ly) / reach
            if d < 1:
                blend(c, ox + i, oy + j, col, t * (1 - d) ** 0.8, 3)


# =====================================================================================================
#  DEATH
# =====================================================================================================

@ending("eld_death_hp")
def eld_death_hp(e):
    """DEATH.  A Severed Thread: the webway floor at night; the human lies at the left; a ring of tall Aeldari
    stands with bowed heads (each with a spirit stone glowing at the chest -- the human has none); the soul has
    risen as a small warm lamp on a thread that frays and ends above it; far in the upper right something dim and
    magenta has turned toward the lamp.  Light: the lamp (upper left), spirit stones; bright mass upper left."""
    c = e.c
    HZ = 66
    for y in range(108):
        for x in range(192):
            if y < HZ:
                c.set(x, y, ramp_pick(["#03040c", "#070a1c", "#0c1230"], y / float(HZ) * 0.9 + x / 900.0, x, y))
            else:
                c.set(x, y, ramp_pick(["#101a40", "#0a1030", "#060820", "#03040c"], (y - HZ) / 42.0, x, y))
    stars(c, e.seed_for("st"), 46, 0, HZ - 4, cols=("#2a3a6a", "#4a5a9a", "#8a9ad0"))
    # the road's far light: a pale teal mist at the horizon so that the mourners read against it
    glow(c, 104, HZ - 4, 92, ["#0a1230", "#122a52", "#1e4a72", "#3a7a96"], power=1.05, strength=1.0, ry=34)
    dk = ["#06081a", "#101a3c", "#1c2a58", "#2c4078", "#42589a"]
    for hw, ys, w_ in [(46, 40, 2), (34, 46, 2), (24, 52, 1), (17, 56, 1)]:
        _ogive(c, 104, HZ + 2, hw, ys, w=w_, cols=dk, k=1.6, lit=1)
    for zy in (70, 76, 85, 97):
        c.line([(0, zy), (191, zy)], "#0c1438")
    for k in range(-8, 9):
        c.line([(104 + k * 4, HZ + 1), (104 + k * 30, 107)], "#0c1438")
    # the magenta thing, far upper right: a dim stain of light, a swept pair of horns, two pinpoint eyes
    glow(c, 164, 20, 30, ["#10061a", "#2a0e40", "#5a1a70", "#8a2a90"], power=1.5, strength=0.9, ry=20)
    for k in range(7):
        c.set(150 - k * 2, 12 - k, "#8a3aa2")
        c.set(178 + k * 2, 12 - k, "#8a3aa2")
    c.rect(159, 19, 161, 20, "#ff8ad8"); c.rect(167, 19, 169, 20, "#ff8ad8")
    c.rect(158, 19, 158, 20, "#c850c8"); c.rect(170, 19, 170, 20, "#c850c8")
    # the soul lamp and the thread
    LX, LY = 64, 36
    glow(c, LX, LY, 26, ["#1a1228", "#4a3a3a", "#b08850", "#ffd890", "#ffffe8"], power=1.3, strength=1.0, ry=24)
    c.ellipse(LX, LY, 2, 3, "#ffffff")
    for i in range(0, 41):                                                   # thread: body -> lamp
        t = i / 40.0
        x = LX + math.sin(t * 7.0) * 1.6 * t
        blend(c, int(round(x)), int(90 - t * 51), "#ffe8b0", 0.9 - 0.2 * t, 3)
    for i in range(0, 22):                                                   # above the lamp: frays and ends
        t = i / 21.0
        x = LX + math.sin(t * 5.0) * 2.0
        blend(c, int(round(x)), int(LY - 4 - t * 28), "#ffe8b0", 0.9 - 0.8 * t, 3)
    for (dx, dy) in [(1, -34), (3, -37), (-2, -36), (4, -41), (-3, -40)]:     # cut ends drifting apart
        blend(c, LX + dx, LY + dy, "#ffe8b0", 0.5, 3)
    for i in range(0, 60):                                                   # a faint violet line: the lamp has been seen
        t = i / 59.0
        q = _bez((LX + 6, LY - 6), (110, 6), (158, 18), t)
        if i % 2 == 0:
            blend(c, int(q[0]), int(q[1]), "#c850c8", 0.55 * (0.4 + 0.6 * t), 3)
    # the lamp's warm spill: the dark cloaks read against it; a pool of light under the body
    light_pool(c, 62, 58, 72, 40, "#b07a48", t=0.22, power=0.9)
    light_pool(c, 66, 94, 42, 9, "#ffd890", t=0.45, power=1.1)
    # the ring of mourners, tall and dark, heads bowed; spirit stone at each chest
    stand = [(118, 72, 34), (146, 78, 38), (172, 74, 36), (96, 80, 36), (30, 78, 34), (10, 86, 40), (176, 106, 58)]
    stand.sort(key=lambda s: s[1])
    for (x, y, h) in stand:
        f = _eldar(h, "#080c1e", facing=-1 if x > 70 else 1, pose="bow", cloak=True)
        ox, oy = put_figure(c, f, x, y)
        hx_, hy_ = f["head"]
        gx, gy = ox + int(hx_) + (2 if x > 70 else -2), oy + int(hy_) + int(h * 0.22)
        _gem(c, gx, gy, "#2ec4b8", r=1, halo=0.55)                            # their spirit stones
    # the one who has none
    _lying_player(c, 78, 98, face=1)
    particles(c, "mote", 22, (0, 0, 191, 100), seed=e.seed_for("mt"), cols=("#4a5a9a", "#ffd890", "#8a9ad0"))
    e.protect += ["#ffffff", "#ffd890", "#2ec4b8", "#ff8ad8"]
    vignette_kind(c, "death")


def _shade_fig(c, f, ox, oy, col, t):
    """flat (undithered) darken / tint of a drawn figure: two or three flat colours stay two or three colours."""
    img = f["img"]
    src = img.load()
    for j in range(img.height):
        for i in range(img.width):
            if src[i, j][3] >= 128 and 0 <= ox + i < c.w and 0 <= oy + j < c.h:
                c.set(ox + i, oy + j, mix(c.get(ox + i, oy + j), _ek.C(col), t))


def _skin_head(c, f, ox, oy, h, facing=1, skin="#e2bf88", hair="#37281f", shade=None):
    """repaint the head of a drawn player figure: skin, hair on the crown and back, one dark eye on the facing side."""
    hx_, hy_ = f["head"]
    cx, cy = ox + hx_, oy + hy_
    r = max(2.0, 0.088 * h * 1.05)
    for yy in range(int(cy - r - 1), int(cy + r + 2)):
        for xx in range(int(cx - r - 1), int(cx + r + 2)):
            d = ((xx - cx) / r) ** 2 + ((yy - cy) / r) ** 2
            if d <= 1.0:
                back = (xx - cx) * (-facing) > r * 0.15
                top = (yy - cy) < -r * 0.35
                col = hair if (back or top) else skin
                if shade is not None and (xx - cx) * (-facing) > 0:
                    col = shade if col == skin else col
                c.set(xx, yy, col)
    c.set(int(round(cx + facing * r * 0.45)), int(round(cy + r * 0.05)), "#37281f")


def _aimer(c, x, y, h, col="#0a0612", hi="#ff8ad8", lo="#8a3aa2", aim=0.06, hesitant=False):
    """a guardsman in side view facing right, rifle at the shoulder (aim = barrel angle in rad, + = up); feet at
    (x, y), h px tall.  hesitant: the barrel has sagged toward the ground.  The side that faces the light (right)
    gets a thin rim, the rifle's top edge a bright line."""
    u = h / 30.0
    hip, sh, hd = y - 11 * u, y - 20 * u, y - 24.5 * u
    c.line([(x - 2.2 * u, y), (x - 0.2 * u, hip)], col, max(2, int(2 * u)))                  # legs
    c.line([(x + 2.4 * u, y), (x + 0.8 * u, hip)], col, max(2, int(2 * u)))
    c.line([(x - 3.5 * u, hip + 1), (x + 3.5 * u, hip + 1)], col, 2)                           # greatcoat skirt
    for yy in range(int(sh), int(hip) + 2):                                                   # torso
        k = (yy - sh) / max(1.0, hip - sh)
        c.rect(int(x - (2.6 + 0.7 * k) * u), yy, int(x + (2.8 + 1.0 * k) * u), yy, col)
    c.ellipse(int(x + 0.8 * u), int(hd), max(2, int(2.6 * u)), max(2, int(2.8 * u)), col)       # helmet
    c.line([(x - 1.5 * u, hd - 2.4 * u), (x + 3.6 * u, hd - 2.0 * u)], lo, 1)
    a = -0.55 if hesitant else aim
    gx0, gy0 = x - 4.5 * u, sh + 2.0 * u
    L = 17 * u
    gx1, gy1 = gx0 + math.cos(a) * L, gy0 - math.sin(a) * L
    c.line([(gx0, gy0), (gx1, gy1)], col, 2)                                                   # the rifle
    c.line([(gx0 + 3 * u, gy0 - 1 - math.sin(a) * 3 * u), (gx1, gy1 - 1)], hi, 1)
    c.line([(x + 1.5 * u, sh + 1), (gx0 + 8 * u, gy0 - math.sin(a) * 8 * u)], col, 2)         # leading arm
    for yy in range(int(sh), int(hip) + 1):                                                   # rim on the lit side
        blend(c, int(x + (2.8 + 1.0 * ((yy - sh) / max(1.0, hip - sh))) * u), yy, lo, 0.9, 3)


def _wall_face(c, x, y, r, toward, col="#4af0e0", hi="#bafff8", edge="#bafff8", rings=2):
    """a half-seen spirit face set into a wall: a dithered oval head, a fading bust, dark eyes and an open mouth,
    and arcs of sound radiating toward `toward` = (tx, ty)."""
    for yy in range(int(y + r * 0.8), int(y + r * 3.0)):                      # the bust, fading downward
        k = (yy - (y + r * 0.8)) / (r * 2.2)
        hw_ = r * (0.9 + 0.9 * min(1, k * 1.6))
        for xx in range(int(x - hw_), int(x + hw_) + 1):
            if (xx + yy) % 2 == 0 and k < bayer(xx, yy) * 1.1 + 0.15:
                c.set(xx, yy, "#2a8a90")
    for yy in range(int(y - r * 1.15), int(y + r * 1.15) + 1):               # the head
        for xx in range(int(x - r * 0.85), int(x + r * 0.85) + 1):
            d = ((xx - x) / (r * 0.85)) ** 2 + ((yy - y) / (r * 1.1)) ** 2
            if d <= 1.0:
                if d > 0.62:
                    c.set(xx, yy, edge if xx <= x else hi)
                else:
                    c.set(xx, yy, col if (xx + yy) % 2 == 0 else "#8affee")
    if r >= 3:
        c.set(int(x - r * 0.35), int(y - r * 0.2), "#052028"); c.set(int(x + r * 0.35), int(y - r * 0.2), "#052028")
        c.rect(int(x) - 1, int(y + r * 0.45), int(x), int(y + r * 0.45) + (1 if r >= 4 else 0), "#052028")
    else:
        c.set(int(x), int(y + 1), "#052028")
    a0 = math.atan2(toward[1] - y, toward[0] - x)
    my = y + r * 0.5
    for k in range(1, rings + 1):
        rad = r * 1.1 + 2.5 * k
        for j in range(15):
            a = a0 - 0.75 + j * (1.5 / 14.0)
            blend(c, int(round(x + math.cos(a) * rad)), int(round(my + math.sin(a) * rad * 0.9)), "#4af0e0", 0.8 - 0.22 * k, 3)


@ending("eld_death_sanity")
def eld_death_sanity(e):
    """DEATH.  Guest of the Walls: a bone-walled room whose ceiling has been dropped to human height -- the
    pointed arches of the wall run up and are cut off by a flat slab.  The human sits hunched at the left,
    surrounded by small teal spirit-people embedded in the wall, each with a ripple of voice; at the right a tall
    Aeldari in the doorway has to stoop to look in, a wedge of pale light on the floor.
    Light: the door (right), the teal ghosts (left-middle); bright mass right."""
    c = e.c
    CY, FL = 18, 88                                     # ceiling underside, floor line
    n1 = e.noise("wall")
    for y in range(CY, FL):
        for x in range(192):
            v = n1.fbm(x * 0.05, y * 0.12, 3)
            c.set(x, y, ramp_pick(["#0e0e22", "#181834", "#22224a", "#2e2e58"], 0.25 + v * 0.55 - abs(x - 60) / 520.0, x, y))
    # the arches that used to be tall: they run into the slab
    dk = ["#0a0a1c", "#1a1a38", "#34345e", "#5a5a86", "#7a7aa4"]
    for cx in (20, 74, 128, 182):
        _ogive(c, cx, FL, 24, 42, w=2, cols=dk, k=1.7, lit=1)
    _grain(c, 0, CY + 2, 191, FL - 2, e.seed_for("gr"), "#4a4a78", n=26, seg=30)
    # the floor
    for y in range(FL, 108):
        for x in range(192):
            c.set(x, y, ramp_pick(["#26264a", "#14142e", "#0a0a1c", "#05050e"], (y - FL) / 20.0, x, y))
    c.line([(0, FL), (191, FL)], "#5a5a86")
    for zy in (93, 100):
        c.line([(0, zy), (191, zy)], "#10102a")
    # the door at the right: pale warm light
    DX0, DX1 = 150, 191
    for y in range(CY, FL):
        for x in range(DX0, DX1 + 1):
            c.set(x, y, ramp_pick(["#fff4d0", "#f0d890", "#c8a860"], (y - CY) / 70.0 + (x - DX0) / 120.0, x, y))
    c.rect(DX0 - 2, CY, DX0 - 1, FL, "#050510")
    light_pool(c, 150, 56, 58, 40, "#d8c090", t=0.34, power=1.2)
    # the ceiling slab, low and flat, with a hard lit underside
    c.rect(0, 0, 191, CY - 1, "#07071a")
    c.line([(0, CY), (191, CY)], "#8a8ab0")
    c.line([(0, CY - 1), (191, CY - 1)], "#2a2a50")
    for y in range(CY + 1, CY + 9):
        for x in range(192):
            blend(c, x, y, "#05050e", 0.7 * (1 - (y - CY) / 9.0), 3)
    for x in range(8, 192, 24):                                              # panel joints in the slab
        c.line([(x, 0), (x, CY - 2)], "#0f0f2a")
    # the wedge of light across the floor toward the sitter
    for y in range(FL + 1, 108):
        u = (y - FL) / 19.0
        for x in range(30, DX1 + 1):
            reach = 150 - (x - 30)
            fall = clamp(1.0 - (DX0 - x) / 135.0) if x < DX0 else 1.0
            lo, hi = 22 + (1 - u) * 6, 175
            if lo <= x <= hi:
                blend(c, x, y, "#ffe8b0", 0.40 * fall * (1.0 - 0.45 * u), 3)
    # voices in the walls: small teal faces set into the plaster, each singing / talking toward the sitter
    SX, SY = 64, 84
    spots = [(18, 70, 5), (34, 44, 3), (44, 66, 6), (56, 36, 2), (80, 58, 4), (96, 70, 6), (26, 32, 3),
             (108, 44, 3), (118, 62, 5), (10, 46, 3), (72, 30, 3), (128, 40, 2), (88, 38, 3), (130, 74, 4), (40, 24, 2)]
    for (gx, gy, gr) in sorted(spots, key=lambda s: s[2]):
        _wall_face(c, gx, gy, gr, (SX, SY), rings=2 if gr >= 4 else 1)
    # the sitter, hunched at the left of the middle, knees up, turned from the door
    pl = player_fig("aeldari", 62, "sit", facing=-1)
    px_, py_ = put_figure(c, pl, 70, 100, rim_col="#ffe8b0", toward=(1, -0.2),
                          shadow=dict(toward_light=(1.0, 0.25), length=1.4, squash=0.3, col="#05050e", t=0.75))
    _shade_fig(c, pl, px_, py_, "#05050e", 0.38)
    _skin_head(c, pl, px_, py_, 62, facing=-1, shade="#a88a60")
    glow(c, 60, 82, 22, ["#0a1a2a", "#1a4a5a", "#2a8a90"], power=2.0, strength=0.4, ry=16)
    # the one at the door must stoop to look in: tall, crested, folded over beneath the slab
    ds = _eldar(82, "#05050e", facing=-1, pose="stoop", cloak=True)
    dxo, dyo = put_figure(c, ds, 172, FL + 2)
    _gem(c, dxo + int(ds["head"][0]) - 2, dyo + int(ds["head"][1]) + 17, "#2ec4b8", r=1, halo=0.5)
    particles(c, "mote", 22, (0, CY + 2, 150, FL), seed=e.seed_for("mt"), cols=("#4af0e0", "#bafff8", "#2a8a90"))
    e.protect += ["#bafff8", "#4af0e0", "#2ec4b8", "#ffe8b0"]
    vignette_kind(c, "death")


@ending("eld_death_corruption")
def eld_death_corruption(e):
    """DEATH.  Drunk Dry: on a glassy plain under crystal shards, a firing line of guardsmen has levelled its guns
    at the human, and none of them fires.  The human stands with arms raised, the colour (pink, silver, teal, gold:
    colours a body should not hold) pouring out of the top of the body in a spiral that bends up and away off the
    top-right of the frame, to something very far off; what is left below is a grey husk.
    Light: the column (right), a cold pink rim on the line of soldiers; bright mass right, vertical."""
    c = e.c
    HZ = 72
    for y in range(HZ):
        for x in range(192):
            c.set(x, y, ramp_pick(["#05020c", "#0c0618", "#1a0a2c", "#3a1250"], (y / float(HZ)) ** 1.5 * 0.9 + x / 1500.0, x, y))
    stars(c, e.seed_for("st"), 40, 0, HZ - 14, cols=("#5a3a7a", "#9a6ac0", "#e8d8f8"))
    n1 = e.noise("aur")
    for y in range(0, HZ):
        for x in range(192):
            v = n1.fbm(x * 0.02, y * 0.05, 3)
            t = clamp((v - 0.52) * 2.4) * clamp(1 - y / 70.0) * 0.8
            if t > 0:
                blend(c, x, y, "#7a2a9a", t, 3)
    glow(c, 78, HZ - 2, 96, ["#0c0618", "#2a1046", "#5a2078", "#8a3aa2"], power=1.2, strength=0.95, ry=34)   # the lit mist behind the line
    # the glassy ground: dark violet, a lighter band at the horizon
    for y in range(HZ, 108):
        for x in range(192):
            c.set(x, y, ramp_pick(["#7a3a94", "#3a1858", "#14081e", "#08040e"], ((y - HZ) / 34.0) ** 0.8, x, y, sharp=3.0))
    # crystal shards on the horizon, leaning, lit on the side that faces the column
    rr = e.rng("shards")
    for k in range(15):
        bx = 6 + k * 13 + rr.randint(-4, 4)
        hgt = rr.randint(10, 34) if abs(bx - 130) > 20 else rr.randint(6, 16)
        lean = rr.uniform(-0.35, 0.35)
        wd = rr.randint(2, 4)
        tip = (bx + lean * hgt, HZ - hgt)
        c.poly([(bx - wd, HZ + 1), (bx + wd, HZ + 1), tip], "#0e0618")
        c.line([(bx + wd, HZ + 1), tip], "#8a3aa2" if bx < 130 else "#4a1a62", 1)
    # the column's path: a curve rising from the figure and leaving the frame at the upper right
    P0, P1, P2 = (129.0, 50.0), (116.0, 20.0), (178.0, -6.0)
    def width_at(t):
        return 13.0 * (1.0 - t) ** 0.9 + 1.2
    # beam: soft light along the path
    for i in range(0, 61):
        t = i / 60.0
        x, y = _bez(P0, P1, P2, t)
        w_ = width_at(t) * 1.7
        light_pool(c, x, y, w_ + 2, w_ * 0.9 + 2, "#ff8ad8", t=0.30 * (1 - 0.5 * t) * clamp(t * 6.0), power=1.1)
    # the colours pouring out: two intertwined helices of motes + a few big sparks
    cols = ["#e8e8f8", "#ff8ad8", "#c850c8", "#7a2a9a", "#4af0e0", "#ffd890", "#ff8ad8", "#e8e8f8"]
    for strand in range(3):
        for i in range(0, 130):
            t = i / 129.0
            x, y = _bez(P0, P1, P2, t)
            x2, y2 = _bez(P0, P1, P2, min(1.0, t + 0.01))
            dx_, dy_ = x2 - x, y2 - y
            ln = math.hypot(dx_, dy_) or 1
            nx, ny = -dy_ / ln, dx_ / ln
            ph = t * 17.0 + strand * 2.09
            off = math.sin(ph) * width_at(t) * 0.5
            px, py = x + nx * off, y + ny * off
            if 0 <= px < 192 and 0 <= py < 108:
                col = cols[(i // 3 + strand * 3) % len(cols)]
                c.set(int(round(px)), int(round(py)), col)
                if i % 5 == 0 and t < 0.6:
                    blend(c, int(px) + 1, int(py), col, 0.6, 3)
    rrm = e.rng("motes")
    for _ in range(46):
        t = rrm.random() ** 1.3
        x, y = _bez(P0, P1, P2, t)
        off = rrm.uniform(-1, 1) * width_at(t) * 0.8
        c.set(int(x + off), int(y), rrm.choice(cols))
    # the figure: arms raised, colour pouring out of the crown, the body below a drained grey
    pl = fig(46, "arms_up", "#8a8a98", facing=-1)
    img = pl["img"]
    pxs = img.load()
    for yy in range(img.height):
        k = yy / float(img.height)                      # 0 top .. 1 feet
        for xx in range(img.width):
            if pxs[xx, yy][3] >= 128:
                if k < 0.30:
                    col = ["#e8e8f8", "#ff8ad8", "#c850c8"][min(2, int((k / 0.30) * 3.0))] if (xx + yy) % 2 == 0 else "#c850c8"
                elif k < 0.56:
                    col = "#8a7a98" if (xx + yy) % 2 == 0 else "#c850c8"
                else:
                    col = "#7a7488" if k < 0.8 else "#585468"
                if k < 0.12 and (xx * 3 + yy * 5) % 7 < 3:           # the crown is already coming apart
                    pxs[xx, yy] = (0, 0, 0, 0)
                    continue
                pxs[xx, yy] = _ek.C(col) + (255,)
    pl["img"] = img
    FX, FY = 130, 94
    fox, foy = put_figure(c, pl, FX, FY, shadow=dict(toward_light=(0.0, -0.8), length=0.2, squash=0.35, col="#05030a", t=0.6))
    # a reflection of the column on the glassy floor
    for y in range(FY + 1, 108):
        u = (y - FY) / 14.0
        for x in range(FX - 14, FX + 15):
            blend(c, x, y, "#ff8ad8", 0.38 * (1 - u) * (1 - abs(x - FX) / 15.0), 3)
    # the firing line: guns levelled at the figure, and one has begun to sag
    for k, (x, y, h) in enumerate([(14, 88, 30), (32, 83, 26), (50, 91, 31), (68, 85, 27), (88, 93, 33), (104, 87, 29)]):
        c.ellipse(x + 4, y + 1, int(h * 0.3), 1, "#06030c")
        _aimer(c, x, y, h, aim=0.04 + 0.02 * (k % 3), hesitant=(k == 5))
    particles(c, "mote", 20, (0, 0, 191, 90), seed=e.seed_for("mt"), cols=("#c850c8", "#ff8ad8", "#e8e8f8", "#4af0e0"))
    e.protect += ["#e8e8f8", "#ff8ad8", "#4af0e0", "#ffd890", "#c850c8"]
    vignette_kind(c, "death")
