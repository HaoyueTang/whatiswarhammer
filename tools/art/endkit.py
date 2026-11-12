"""endkit — helpers for the 192x108 ending illustrations (SPEC §31).

An ending module (tools/art/endings_<route>.py) looks like::

    from reg import ending
    from endkit import *

    @ending("imp_death_hp")           # the ending id from endings_brief.json; one function per ending
    def imp_death_hp(e):              # e = End context: e.c canvas, e.kind, e.route, e.rnd / e.rng(n) / e.noise(n)
        c = e.c
        sky(c, [...dark -> light...], 0, 58)      # scenekit helpers (sky, clouds, glow, hband, skyline, ...) work on e.c
        ...focal motif...
        vignette_kind(c, e.kind)                  # mood by kind, last
        # return nothing: the builder takes e.c, quantises to <= 32 colours and saves

Look while authoring:  python3 tools/art/endpreview.py <id> [<id> ...] --scale 6   (writes /tmp/endpreview.png)
Fast route build:      python3 tools/art/build_all.py --endings --faction imperium   (PNGs + contact sheets)
Determinism: never use random.* / hash() directly; use e.rnd, e.rng("name") (independent stream), e.noise("name"),
e.seed_for("name") for scenekit helpers that take a seed.  Same id -> same pixels.

Helper map (all draw on a pxlib.Canvas; "toward" / "toward_light" always point TOWARD the light)
  context / palette  End, finish(), limit_palette(), PLAYER, GOD (colour language of the 4 gods), lum(), flat()
  sprites as props   spr(key, scale, mirror, tint_to, silhouette, crop, bottom_fade), place(c, img, x, y, anchor),
                     tint(), sil(), fade_bottom(), rim(), mask_of(), scene_bg(e, scene_key)
  people             figure(h, pose, col, robe, hood, pack, facing)   procedural silhouette, 6 poses + lying;
                     fig() = cached figure(); put_figure() draws it (feet at x,y) with optional rim + cast shadow;
                     player_fig(route, h, pose) = the route's player in its coat colours; crowd() = rows of figures
  light / shadow     cast_shadow(), shafts() (god rays), light_pool(), glow() (scenekit), vignette_kind(), blend()
  atmosphere         haze(), ridge(), particles(ember|ash|snow|rain|spore|mote|star|petal), disc()
Everything that darkens / lightens existing pixels goes through ``blend`` (ordered dither, <= 4 levels), so a picture
stays inside a small palette; ``finish`` still enforces <= 32 colours with a rare-colour-merging quantiser
(accents that must survive: e.protect += ["#9af6ff"]).

House rules (see SPEC §31): one focal motif per picture, depth in >= 3 layers (sky / mid / foreground), one deliberate
light direction, no text, no GW marks, no canon-character likeness, no gore.  Brightness by kind (mean luma 0..255, the
art gate compares route averages good > bad > death): good ~65-85, bad ~38-60, death ~20-42.
"""
import math
import os
import random
import zlib
from PIL import Image

from pxlib import Canvas, Noise, bayer, hx, mix, clamp, shade, cdist
from scenekit import (C, sky, clouds, glow, stars, planet, hband, ramp_pick, ember, lightning,
                      calm_lower, darken_rect, skyline, spire)

W, H = 192, 108
HERE = os.path.dirname(os.path.abspath(__file__))
SPRITE_DIR = os.path.join(os.path.dirname(os.path.dirname(HERE)), "assets", "sprites")
MAX_COLORS = 32



# ------------------------------------------------------------------ context

def seed_of(eid, salt=""):
    return zlib.crc32((eid + "|" + salt).encode("utf-8")) & 0x7FFFFFFF


class End:
    """Per-ending context handed to an @ending function."""

    def __init__(self, eid, kind="bad", route=""):
        self.id, self.kind, self.route = eid, kind, route
        self.seed = seed_of(eid)
        self.rnd = random.Random(self.seed)
        self.c = Canvas(W, H, bg=(0, 0, 0))
        self.protect = []          # colours the 32-colour quantiser must keep (small bright accents), e.g. e.protect += ["#9af6ff"]

    def rng(self, name=""):
        """independent deterministic stream (use one per feature so edits do not shift the others)."""
        return random.Random(seed_of(self.id, str(name)))

    def noise(self, k=0):
        return Noise(seed_of(self.id, "n%s" % k))

    def seed_for(self, name=""):
        return seed_of(self.id, str(name))


def flat(img):
    """list of pixels (Pillow 12.1+ deprecates getdata)."""
    return list(img.get_flattened_data()) if hasattr(img, "get_flattened_data") else list(img.getdata())


def lum(col):
    return 0.299 * col[0] + 0.587 * col[1] + 0.114 * col[2]


def image_lum(img):
    """mean luma 0..255 of an RGB(A) image."""
    px = flat(img.convert("RGB"))
    return sum(lum(p) for p in px) / max(1, len(px))


# ------------------------------------------------------------------ palette limit / finish

def count_colors(img):
    return len(set(flat(img.convert("RGB"))))


def limit_palette(img, n=MAX_COLORS, protect=()):
    """Merge the cheapest colour pairs until <= n remain (rare + similar colours go first).
    Pure Python, row-nearest-neighbour cache: ~0.1 s for 300 colours.  `protect` = colours never merged away."""
    img = img.convert("RGB")
    cnt = {}
    pix = flat(img)
    for p in pix:
        cnt[p] = cnt.get(p, 0) + 1
    if len(cnt) <= n:
        return img
    prot = {tuple(p) for p in protect}
    cols = list(cnt)
    alive = {c: True for c in cols}

    def cost(a, b):
        return cdist(a, b) * (min(cnt[a], cnt[b]) ** 0.35)

    def best_for(a):
        best = None
        for b in cols:
            if b is a or not alive[b] or b == a:
                continue
            if a in prot and b in prot:
                continue
            d = cost(a, b)
            if best is None or d < best[0]:
                best = (d, b)
        return best

    nn = {a: best_for(a) for a in cols}
    remap = {}
    live = len(cols)
    while live > n:
        # cheapest pair among cached row-minima
        a = min((c for c in cols if alive[c] and nn.get(c)), key=lambda c: nn[c][0])
        b = nn[a][1]
        keep, drop = (a, b) if (a in prot or (b not in prot and cnt[a] >= cnt[b])) else (b, a)
        if drop in prot:
            keep, drop = drop, keep
        cnt[keep] += cnt[drop]
        alive[drop] = False
        remap[drop] = keep
        live -= 1
        for k, v in list(remap.items()):
            if v == drop:
                remap[k] = keep
        nn[keep] = best_for(keep)
        for c in cols:
            if alive[c] and c != keep and nn.get(c) and nn[c][1] in (keep, drop):
                nn[c] = best_for(c)
    out = Image.new("RGB", img.size)
    out.putdata([remap.get(p, p) for p in pix])
    return out


def finish(e_or_canvas, max_colors=MAX_COLORS, protect=()):
    """Canvas/End -> RGB image, <= max_colors colours."""
    c = e_or_canvas.c if isinstance(e_or_canvas, End) else e_or_canvas
    img = c.image().convert("RGB")
    assert img.size == (W, H), img.size
    return limit_palette(img, max_colors, protect)


# ------------------------------------------------------------------ blending (palette friendly)

def blend(c, x, y, col, t, levels=3):
    """mix pixel toward col by t (0..1) in `levels` ordered-dither steps -> few new colours."""
    if not (0 <= x < c.w and 0 <= y < c.h) or t <= 0:
        return
    f = clamp(t) * levels
    k = int(f)
    if f - k > bayer(x, y):
        k += 1
    if k <= 0:
        return
    c.set(x, y, mix(c.get(x, y), C(col), min(1.0, k / levels)))


def blend_mask(c, mask, col, t, ox=0, oy=0, levels=3):
    """blend through a PIL 'L' mask (non-zero = on); mask value scales t."""
    mp = mask.load()
    for y in range(mask.height):
        for x in range(mask.width):
            v = mp[x, y]
            if v:
                blend(c, x + ox, y + oy, col, t * v / 255.0, levels)


# ------------------------------------------------------------------ sprites as props

_SPR_CACHE = {}


def load_sprite(key):
    if key not in _SPR_CACHE:
        _SPR_CACHE[key] = Image.open(os.path.join(SPRITE_DIR, key + ".png")).convert("RGBA")
    return _SPR_CACHE[key].copy()


def tint(img, col, t):
    """mix every opaque pixel toward col by t, alpha kept."""
    col = C(col)
    out = img.copy()
    px = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = px[x, y]
            if a:
                px[x, y] = mix((r, g, b), col, t) + (a,)
    return out


def sil(img, dark, light=None, split=0.5):
    """flatten to a silhouette: dark everywhere, `light` where the source luma > split*255 (keeps some
    interior structure). light=None -> pure one-colour mask."""
    dark = C(dark)
    light = C(light) if light is not None else dark
    out = img.copy()
    px = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = px[x, y]
            if a:
                px[x, y] = (light if lum((r, g, b)) > split * 255 else dark) + (a,)
    return out


def fade_bottom(img, rows, seed_xy=(0, 0)):
    """dissolve the last `rows` rows (ordered dither) so a bust rises out of haze / ground."""
    out = img.copy()
    px = out.load()
    for j in range(rows):
        y = out.height - 1 - j
        t = (rows - j) / rows         # 1 at the bottom
        for x in range(out.width):
            if px[x, y][3] and t > bayer(x + seed_xy[0], y + seed_xy[1]) * 1.1:
                px[x, y] = (0, 0, 0, 0)
    return out


def spr(key, scale=1, mirror=False, tint_to=None, tint_t=0.5, silhouette=None, crop=None, bottom_fade=0):
    """Load assets/sprites/<key>.png as a prop.  scale: integer x1/x2/x3 (nearest).  mirror: flip left-right.
    tint_to/tint_t: mix toward a colour.  silhouette=(dark[, light]): flatten (see sil).  crop=(x0,y0,x1,y1).
    bottom_fade: rows to dissolve at the bottom (busts have a flat cut-off edge)."""
    im = load_sprite(key)
    if crop:
        im = im.crop(crop)
    if mirror:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    if tint_to is not None:
        im = tint(im, tint_to, tint_t)
    if silhouette is not None:
        im = sil(im, *((silhouette,) if not isinstance(silhouette, (tuple, list)) or isinstance(silhouette[0], int)
                       else silhouette))
    if scale != 1:
        im = im.resize((im.width * scale, im.height * scale), Image.NEAREST)
    if bottom_fade:
        im = fade_bottom(im, bottom_fade)
    return im


def place(c, img, x, y, anchor="bm"):
    """alpha-blit img with (x, y) at an anchor: tl tm tr / ml mm mr / bl bm br (default bottom-middle)."""
    ax = {"l": 0, "m": img.width // 2, "r": img.width}[anchor[1]]
    ay = {"t": 0, "m": img.height // 2, "b": img.height}[anchor[0]]
    px, py = int(x - ax), int(y - ay)
    src = img.load()
    for j in range(img.height):
        for i in range(img.width):
            r, g, b, a = src[i, j]
            if a >= 128:
                c.set(px + i, py + j, (r, g, b))
    return (px, py)


def mask_of(img):
    """RGBA -> 'L' mask (255 where opaque)."""
    return img.getchannel("A").point(lambda v: 255 if v >= 128 else 0)


def rim(img, col, toward=(-1, -1), thick=1, min_run=3):
    """light edge on the side of a silhouette that faces the light (`toward` = direction to the light).  A pixel only
    becomes rim when the body behind it (away from the light) is at least `min_run` px thick, so thin limbs keep
    their dark core instead of turning into outlines."""
    col = C(col)
    out = img.copy()
    src = img.load()
    px = out.load()
    dx, dy = toward
    sx = (dx > 0) - (dx < 0)
    sy = (dy > 0) - (dy < 0)

    def solid(x, y):
        return 0 <= x < img.width and 0 <= y < img.height and src[x, y][3] >= 128

    for y in range(img.height):
        for x in range(img.width):
            if src[x, y][3] < 128:
                continue
            for (ox, oy) in ((sx, 0), (0, sy), (sx, sy)):
                if (ox, oy) == (0, 0):
                    continue
                if not solid(x + ox, y + oy) and all(solid(x - ox * k, y - oy * k) for k in range(1, min_run)):
                    px[x, y] = col + (255,)
                    break
    return out


# ------------------------------------------------------------------ procedural human figure

_POSES = {
    # hip = hip height (unit = figure height); lean = torso lean toward facing; legs/arms = (upper, lower) angle pairs
    # measured from straight down (+ = toward facing, 180 = up), near limb first; sx = hip / shoulder half spread
    "stand":   dict(hip=.52, lean=1,  legs=((5, 3), (-5, -3)),       arms=((-10, -6), (12, 8)),    sx=.05),
    "walk":    dict(hip=.51, lean=7,  legs=((26, 8), (-18, -40)),    arms=((-24, -12), (26, 46)),  sx=.0),
    "run":     dict(hip=.49, lean=22, legs=((72, 12), (-28, -105)),  arms=((62, 125), (-48, -75)), sx=.0),
    "kneel":   dict(hip=.27, lean=6,  legs=((88, 4), (8, -92)),      arms=((18, 40), (10, 34)),    sx=.0),
    "arms_up": dict(hip=.52, lean=0,  legs=((6, 3), (-6, -3)),       arms=((158, 170), (-158, -170)), sx=.05),
    "carry":   dict(hip=.52, lean=3,  legs=((8, 3), (-10, -5)),      arms=((30, 100), (40, 106)),  sx=.02),
    "hunch":   dict(hip=.50, lean=36, legs=((16, 4), (-12, -22)),    arms=((12, 20), (32, 42)),    sx=.0),
    "reach":   dict(hip=.52, lean=8,  legs=((10, 3), (-8, -6)),      arms=((92, 92), (80, 84)),    sx=.02),
    "sit":     dict(hip=.13, lean=14, legs=((84, 10), (70, 8)),      arms=((24, 70), (30, 80)),    sx=.0),
    "lying":   dict(hip=.52, lean=0,  legs=((8, 4), (-8, -4)),       arms=((-14, -8), (16, 10)),   sx=.05, rot=90),
}


def _fk(p, segs):
    pts = [p]
    for (ln, ang) in segs:
        x, y = pts[-1]
        r = math.radians(ang)
        pts.append((x + ln * math.sin(r), y - ln * math.cos(r)))
    return pts


def figure(h, pose="stand", col="#101018", robe=0.0, facing=1, hood=False, pack=False, thick=1.0,
           lean=None, ss=6):
    """Procedural human silhouette, flat colour `col`, `h` px tall (standing).  Returns dict:
        img      RGBA image (cropped to content, feet at the bottom for upright poses)
        feet     (x, y) of the lower foot in img coords      head  (x, y) head centre
        hands    [(x,y), (x,y)] near / far hand               top   (x, y) top of the head
    pose: stand walk run kneel arms_up carry hunch reach sit lying.   robe: 0..1 = fraction of the leg
    length hidden under a robe (0.9 = long robe).  facing: 1 right, -1 left.  hood: pointed hood, pack:
    backpack.  Silhouettes are drawn 6x then thresholded, so limbs stay 1-2 px at h=14..40."""
    P = dict(_POSES[pose])
    if lean is not None:
        P["lean"] = lean
    col = C(col)
    u = ss * h                       # units -> supersampled px
    Wd, Hd = int(h * 1.6 * ss), int(h * 1.35 * ss)
    big = Image.new("L", (Wd, Hd), 0)
    from PIL import ImageDraw
    d = ImageDraw.Draw(big)
    ox, oy = Wd * 0.5, Hd * 0.93     # origin (feet level at hip.. we use y-up in unit space)

    def T(p):
        return (ox + p[0] * u, oy - p[1] * u)

    def seg(a, b, w):
        d.line([T(a), T(b)], fill=255, width=max(1, int(w * u)))
        r = w * u / 2
        for q in (T(a), T(b)):
            d.ellipse([q[0] - r, q[1] - r, q[0] + r, q[1] + r], fill=255)

    armw = 0.078 * thick
    hip = (0.0, P["hip"])
    sx = P.get("sx", 0.0) * thick
    # legs: near, far
    feet = []
    for i, (th, sh) in enumerate(P["legs"]):
        h0 = (hip[0] + (sx if i == 0 else -sx), hip[1])
        pts = _fk(h0, [(P["hip"] * 0.5, th), (P["hip"] * 0.5, sh)])
        if robe < 0.95 or pose in ("lying",):
            seg(pts[0], pts[1], 0.12 * thick)
            seg(pts[1], pts[2], 0.10 * thick)
        feet.append(pts[2])
    # torso
    lean_r = P["lean"]
    tp = _fk(hip, [(0.30, 180 - lean_r), (0.06, 180 - lean_r - 4)])
    sh_c, neck = tp[1], tp[2]
    shw = (0.11 + 0.04 * (sx > 0.01)) * thick
    shoulder_l = (sh_c[0] - shw, sh_c[1])
    shoulder_r = (sh_c[0] + shw, sh_c[1])
    hipl = (hip[0] - 0.085 * thick, hip[1])
    hipr = (hip[0] + 0.085 * thick, hip[1])
    d.polygon([T(shoulder_l), T(shoulder_r), T(hipr), T(hipl)], fill=255)
    if robe > 0:
        ground = min(f[1] for f in feet) if pose not in ("sit",) else 0.0
        bot = hip[1] * (1 - robe) + ground * robe * 1.0
        w_bot = 0.17 * thick + 0.05 * (robe)
        d.polygon([T(shoulder_l), T(shoulder_r), T((hip[0] + w_bot, bot)), T((hip[0] - w_bot, bot))], fill=255)
    # head
    hr = 0.088 * thick
    head = (neck[0] + 0.012 * math.sin(math.radians(lean_r)) * 4, neck[1] + hr * 0.85)
    q = T(head)
    d.ellipse([q[0] - hr * u, q[1] - hr * u, q[0] + hr * u, q[1] + hr * u], fill=255)
    if hood:
        q = T((head[0] - 0.01, head[1] + hr * 0.25))
        rx_, ry_ = hr * 1.3 * u, hr * 1.5 * u
        d.ellipse([q[0] - rx_, q[1] - ry_, q[0] + rx_, q[1] + ry_], fill=255)
        d.polygon([T((head[0] - hr * 1.2, head[1] - hr * 0.6)), T((head[0] + hr * 1.2, head[1] - hr * 0.6)),
                   T((head[0] + hr * 0.9, head[1] - hr * 1.9)), T((head[0] - hr * 0.9, head[1] - hr * 1.9))], fill=255)
    # arms
    hands = []
    for i, (up, fo) in enumerate(P["arms"]):
        a0 = (sh_c[0] + (shw * 0.85 if i == 0 else -shw * 0.85) * (sx > 0.01), sh_c[1] - 0.02)
        pts = _fk(a0, [(0.19, up), (0.18, fo)])
        seg(pts[0], pts[1], armw * 1.15)
        seg(pts[1], pts[2], armw)
        hands.append(pts[2])
    if pack:
        d.rectangle([T((sh_c[0] - 0.19, sh_c[1] - 0.02))[0], T((sh_c[0], sh_c[1] - 0.02))[1],
                     T((sh_c[0] - 0.08, sh_c[1] - 0.26))[0], T((sh_c[0], sh_c[1] - 0.26))[1]], fill=255)
    rot = P.get("rot", 0)
    marks = {"feet": feet[0], "head": head, "hand0": hands[0], "hand1": hands[1], "top": (head[0], head[1] + hr)}
    if rot:
        big = big.rotate(rot, resample=Image.NEAREST, center=(ox, oy), expand=False)

        def R_(p):
            qx, qy = T(p)
            ang_ = math.radians(rot)
            dx, dy = qx - ox, qy - oy
            return (ox + dx * math.cos(ang_) + dy * math.sin(ang_), oy - dx * math.sin(ang_) + dy * math.cos(ang_))
        marks = {k: R_(v) for k, v in marks.items()}
        T_ = lambda p: p  # noqa: E731
    else:
        marks = {k: T(v) for k, v in marks.items()}
    # downsample: box average then threshold
    small = big.resize((Wd // ss, Hd // ss), Image.BOX).point(lambda v: 255 if v >= 110 else 0)
    bb = small.getbbox() or (0, 0, 1, 1)
    small = small.crop(bb)
    out = Image.new("RGBA", small.size, (0, 0, 0, 0))
    out.paste(Image.new("RGBA", small.size, col + (255,)), (0, 0), small)
    f = lambda p: ((p[0] / ss) - bb[0], (p[1] / ss) - bb[1])  # noqa: E731
    res = dict(img=out, feet=f(marks["feet"]), head=f(marks["head"]), top=f(marks["top"]),
               hands=[f(marks["hand0"]), f(marks["hand1"])])
    if facing < 0:
        res["img"] = out.transpose(Image.FLIP_LEFT_RIGHT)
        w_ = out.width
        for k in ("feet", "head", "top"):
            res[k] = (w_ - 1 - res[k][0], res[k][1])
        res["hands"] = [(w_ - 1 - hx_[0], hx_[1]) for hx_ in res["hands"]]
    return res


# ------------------------------------------------------------------ light and shadow

def cast_shadow(c, img, x, y, toward_light=(-1.0, 0.0), length=1.0, squash=0.30, col="#000000", t=0.55,
                anchor="bm", levels=3, origin=None):
    """Project a sprite / figure silhouette onto flat ground.  (x, y) = where the img's anchor (or `origin`, a pixel
    inside img) touches the ground.  toward_light = (dx, dz): dx<0 = light on the left, so the shadow falls to the
    right; dz>0 = light behind the subject, so the shadow comes toward the viewer (dz<0 away).
    length = horizontal shear per px of height; squash = ground foreshortening (shadow depth per px of height)."""
    from PIL import ImageDraw
    ax = {"l": 0, "m": img.width // 2, "r": img.width}[anchor[1]]
    ay = {"t": 0, "m": img.height // 2, "b": img.height}[anchor[0]]
    if origin is not None:                       # ground-contact pixel inside img (e.g. figure()["feet"])
        ax, ay = int(origin[0]), int(origin[1]) + 1
    kx = -toward_light[0] * length
    ky = toward_light[1] * squash
    m = Image.new("L", (W * 2, H * 2), 0)
    d = ImageDraw.Draw(m)
    a = img.getchannel("A").load()
    for j in range(img.height):
        hh = (img.height - ay) - j          # height above the ground line (px)
        for i in range(img.width):
            if a[i, j] < 128:
                continue
            u = i - ax
            p0 = (u + hh * kx, hh * ky)
            p1 = (u + 1 + hh * kx, hh * ky)
            p2 = (u + 1 + (hh - 1) * kx, (hh - 1) * ky)
            p3 = (u + (hh - 1) * kx, (hh - 1) * ky)
            d.polygon([(x + W // 2 + q[0], y + H // 2 + q[1] * 1.0) for q in (p0, p1, p2, p3)], fill=255)
    blend_mask(c, m, col, t, -W // 2, -H // 2, levels)


def shafts(c, origin, angle, spread, n, length, col, t=0.30, seed=1, w0=1.5, w1=9.0, power=0.8, levels=3,
           floor=None):
    """God-rays: n shafts fanning from `origin` around `angle` (degrees, 0 = right, 90 = down) +-spread/2.
    Each widens from w0 to w1 and fades along `length`.  floor = y below which nothing is drawn (None = all)."""
    rnd = random.Random(seed)
    ox, oy = origin
    for k in range(n):
        a = math.radians(angle + (rnd.random() - 0.5) * spread)
        dx, dy = math.cos(a), math.sin(a)
        px, py = -dy, dx
        ln = length * (0.7 + 0.5 * rnd.random())
        ww0, ww1 = w0 * (0.8 + 0.5 * rnd.random()), w1 * (0.6 + 0.8 * rnd.random())
        tt = t * (0.55 + 0.7 * rnd.random())
        xs = [ox, ox + dx * ln + px * ww1, ox + dx * ln - px * ww1]
        ys = [oy, oy + dy * ln + py * ww1, oy + dy * ln - py * ww1]
        for y in range(max(0, int(min(ys) - ww1)), min(c.h, int(max(ys) + ww1) + 1)):
            if floor is not None and y > floor:
                break
            for x in range(max(0, int(min(xs) - ww1)), min(c.w, int(max(xs) + ww1) + 1)):
                rx, ry = x - ox, y - oy
                s = (rx * dx + ry * dy) / ln
                if s < 0 or s > 1:
                    continue
                dperp = abs(rx * px + ry * py)
                half = (ww0 + (ww1 - ww0) * s) / 2
                if dperp > half:
                    continue
                edge = 1.0 - (dperp / half) ** 2
                blend(c, x, y, col, tt * ((1 - s) ** power) * (0.5 + 0.5 * edge), levels)


def light_pool(c, cx, cy, rx, ry, col, t=0.5, power=1.4, levels=3):
    """soft elliptical patch of light (or dark, pass a dark col) blended onto existing pixels."""
    for y in range(int(cy - ry), int(cy + ry) + 1):
        for x in range(int(cx - rx), int(cx + rx) + 1):
            d = math.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2)
            if d < 1:
                blend(c, x, y, col, t * (1 - d) ** power, levels)


def vignette_kind(c, kind, col=None, strength=None, inner=None, power=None):
    """mood vignette: good = light warm edge darkening, bad = cold closing-in, death = heavy tunnel."""
    base = {"good": ("#2a1a14", 0.32, 0.78, 2.0), "bad": ("#080a14", 0.62, 0.62, 1.8),
            "death": ("#020204", 0.95, 0.42, 1.5)}[kind]
    col, strength, inner, power = (col or base[0], strength if strength is not None else base[1],
                                   inner if inner is not None else base[2], power or base[3])
    for y in range(c.h):
        for x in range(c.w):
            dx, dy = (x - c.w / 2) / (c.w / 2), (y - c.h / 2) / (c.h / 2)
            d = math.sqrt(dx * dx * 0.85 + dy * dy * 1.0)
            t = clamp((d - inner) / (1.35 - inner)) ** power * strength
            if t > 0:
                blend(c, x, y, col, t, levels=4)


def disc(c, cx, cy, r, cols, light=(-0.5, -0.6), seed=0):
    """flat-banded dithered disc (sun / moon), cols dark -> light."""
    planet(c, cx, cy, r, cols, light=light, seed=seed)


# ------------------------------------------------------------------ atmosphere / terrain

def haze(c, y0, y1, col, t=0.5, seed=1, scale=0.035, profile="mid", levels=3, x0=0, x1=None):
    """horizontal fog band blended over what is already there.  profile: mid (peaks in the middle of the band),
    bottom (thick at y1), top (thick at y0).  noise-modulated, ordered-dithered."""
    n = Noise(seed)
    x1 = c.w - 1 if x1 is None else x1
    for y in range(max(0, int(y0)), min(c.h, int(y1) + 1)):
        u = (y - y0) / max(1, y1 - y0)
        prof = {"mid": math.sin(math.pi * u), "bottom": u, "top": 1 - u}[profile]
        for x in range(x0, x1 + 1):
            v = n.fbm(x * scale, y * scale * 2.2, 3)
            blend(c, x, y, col, t * prof * clamp(0.4 + v * 1.1), levels)


def ridge(c, base, hmin, hmax, col, seed=1, x0=0, x1=None, scale=0.045, lite=None, fill_to=None, octaves=3, jag=0):
    """silhouette ridge / heap line: top edge at base - (hmin..hmax); filled down to fill_to (default bottom).
    lite: colour of the 1px top edge (rim)."""
    n = Noise(seed)
    rnd = random.Random(seed)
    x1 = c.w - 1 if x1 is None else x1
    fill_to = c.h - 1 if fill_to is None else fill_to
    col = C(col)
    for x in range(x0, x1 + 1):
        h = hmin + (hmax - hmin) * n.fbm(x * scale, 0.7, octaves) + (rnd.randint(-jag, jag) if jag else 0)
        top = int(base - h)
        for y in range(max(0, top), fill_to + 1):
            c.set(x, y, col)
        if lite is not None:
            c.set(x, top, C(lite))


def particles(c, kind, n, region=(0, 0, W - 1, H - 1), seed=1, cols=None, wind=(1, 1), size=1):
    """kind: ember | ash | snow | rain | spore | mote | star | petal.  region = (x0, y0, x1, y1).
    wind = (dx, dy) direction of streaks / tails."""
    rnd = random.Random(seed)
    x0, y0, x1, y1 = region
    defaults = {"ember": ("#ffb040", "#ff6a2a", "#ffe08a"), "ash": ("#6a6460", "#8a8480", "#4a4644"),
                "snow": ("#dfe8f0", "#b8c8d8"), "rain": ("#7a8aa0", "#9aaac0"),
                "spore": ("#c8e070", "#e8ff9a", "#8ab040"), "mote": ("#ffe2a0", "#fff0c8"),
                "star": ("#8a8aa8", "#d8d8f0", "#ffffff"), "petal": ("#ffb0c8", "#ff8aa8")}
    cols = [C(q) for q in (cols or defaults[kind])]
    for _ in range(n):
        x, y = rnd.randint(x0, x1), rnd.randint(y0, y1)
        col = rnd.choice(cols)
        if kind == "rain":
            ln = rnd.randint(3, 6)
            for k in range(ln):
                blend(c, x + k * wind[0] // 1, y + k * wind[1] // 1 if wind[1] else y + k, col, 0.9 - k * 0.12, 3)
        elif kind == "ember":
            c.set(x, y, col)
            if rnd.random() < 0.3:
                c.set(x - wind[0], y - wind[1], mix(c.get(max(0, x - wind[0]), max(0, y - wind[1])), col, 0.5))
        elif kind == "spore":
            c.set(x, y, col)
            if size > 1 or rnd.random() < 0.25:
                for ddx, ddy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    blend(c, x + ddx, y + ddy, col, 0.5, 2)
        elif kind == "star":
            c.set(x, y, col)
        else:
            c.set(x, y, col)
            if size > 1:
                c.set(x + 1, y, col)


# ------------------------------------------------------------------ figures in numbers

_FIG_CACHE = {}


def fig(h, pose="stand", col="#101018", **kw):
    """cached figure() -> dict"""
    key = (h, pose, tuple(C(col)), tuple(sorted(kw.items())))
    if key not in _FIG_CACHE:
        _FIG_CACHE[key] = figure(h, pose, col, **kw)
    r = _FIG_CACHE[key]
    return dict(r, img=r["img"].copy())


def put_figure(c, f, x, y, rim_col=None, toward=(-1, -1), shadow=None, anchor="feet"):
    """draw a figure() result with its feet (or 'head') at (x, y); optional rim light (colour, on the side facing
    `toward`) and a ground shadow (dict of cast_shadow kwargs).  Returns the top-left of the drawn image."""
    img = f["img"]
    ax, ay = f["feet"] if anchor == "feet" else f["head"]
    px, py = int(round(x - ax)), int(round(y - ay))
    if shadow:
        fx, fy = f["feet"]
        cast_shadow(c, f["img"], px + fx, py + fy, origin=(fx, fy), **shadow)
    if rim_col is not None:
        img = rim(img, rim_col, toward)
    place(c, img, px, py, anchor="tl")
    return (px, py)


def crowd(c, x0, x1, y_back, y_front, n, hmin, hmax, col, seed=1, rim_col=None, toward=(-1, -1),
          poses=("stand", "stand", "walk", "hunch"), robe_p=0.0, fade_col=None, fade_t=0.0):
    """row(s) of silhouettes between depth lines y_back..y_front (feet y); size grows with y.
    fade_col/fade_t: mix the colour toward the haze colour for far ones."""
    rnd = random.Random(seed)
    items = []
    for _ in range(n):
        yy = rnd.uniform(y_back, y_front)
        k = (yy - y_back) / max(1, y_front - y_back)
        hh = int(hmin + (hmax - hmin) * k + rnd.uniform(-1.5, 1.5))
        items.append((yy, rnd.uniform(x0, x1), max(8, hh), rnd.choice(poses)))
    items.sort()
    for (yy, xx, hh, pz) in items:
        k = (yy - y_back) / max(1, y_front - y_back)
        cc = mix(C(col), C(fade_col), fade_t * (1 - k)) if fade_col is not None else C(col)
        f = fig(hh, pz, cc, robe=robe_p if rnd.random() < 0.4 else 0.0, facing=rnd.choice((1, -1)))
        put_figure(c, f, xx, yy, rim_col=rim_col if k > 0.2 else None, toward=toward)


# ------------------------------------------------------------------ builder entry

_BRIEF_CACHE = {}


def load_brief():
    if not _BRIEF_CACHE:
        import json
        with open(os.path.join(HERE, "endings_brief.json"), encoding="utf-8") as f:
            for e in json.load(f)["endings"]:
                _BRIEF_CACHE[e["id"]] = e
    return _BRIEF_CACHE


def render_ending(eid, kind=None, route=None):
    """run the @ending function registered for eid -> RGB image (<= 32 colours).  kind / route default to the brief."""
    from reg import ENDINGS
    b = load_brief().get(eid, {})
    e = End(eid, kind or b.get("kind", "bad"), route or b.get("faction", ""))
    ret = ENDINGS[eid]["fn"](e)
    if isinstance(ret, Canvas):
        e.c = ret
    elif isinstance(ret, Image.Image):
        e.c.img = ret.convert("RGBA")
        e.c.px = e.c.img.load()
    return finish(e, protect=[C(p) for p in e.protect])


# ------------------------------------------------------------------ the player, per route (matches assets/sprites/player_<route>.png)

PLAYER = {   # route: (main coat colour, accent, accent kind)
    "imperium": ("#44546e", "#c8a060", "band"), "chaos": ("#5a4a3a", "#a03a2a", "band"),
    "tau": ("#b89c6c", "#e8e8f0", "band"), "aeldari": ("#8a6440", "#2ec4b8", "poncho"),
    "necrons": ("#b0986a", "#d8c890", "band"), "orks": ("#7a6a48", "#d8b040", "band"),
    "gsc": ("#d8a82a", "#fff0a0", "band"), "mechanicus": ("#7a7a82", "#d8c070", "band"),
}


def player_fig(route, h, pose="stand", facing=1, **kw):
    """the route's player character as a coloured procedural figure (coat colour + a shoulder band / poncho in the
    accent colour so the same person reads across all endings of the route).  Same dict as figure()."""
    main, acc, kind = PLAYER[route]
    f = figure(h, pose, main, facing=facing, **kw)
    img = f["img"]
    px = img.load()
    hy = f["head"][1]
    y0, y1 = int(hy + 0.075 * h * 1.0), int(hy + 0.075 * h + max(1, 0.14 * h if kind == "poncho" else 0.07 * h))
    for y in range(max(0, y0), min(img.height, y1 + 1)):
        for x in range(img.width):
            if px[x, y][3] >= 128:
                px[x, y] = C(acc) + (255,)
    return f


# ------------------------------------------------------------------ shared palettes / backgrounds

GOD = {   # SPEC §31: each god's colour language, dark -> bright ramp + accent (use the SAME ramps across routes)
    "khorne":   dict(ramp=["#2a060c", "#521010", "#8a1e12", "#c8441c", "#ec8a2c", "#ffc060"], accent="#ffc060", dark="#10040a"),
    "nurgle":   dict(ramp=["#10160a", "#222e12", "#3e5a1c", "#6c8a2a", "#a8b84a", "#d8d880"], accent="#c8d850", dark="#080c04"),
    "tzeentch": dict(ramp=["#07040f", "#0a1e7a", "#1a5ad8", "#2ab8ff", "#9af6ff", "#ffffff"], accent="#e83aa8", dark="#05030c"),
    "slaanesh": dict(ramp=["#10061a", "#3a1058", "#7a2a9a", "#c850c8", "#ff8ad8", "#e8e8f8"], accent="#ff8ad8", dark="#08030e"),
}


def scene_bg(e, key, dim=0.0, dim_col="#000000"):
    """paint an existing scene (assets/scenes key, e.g. 'trench') onto e.c as a starting point.  Use it for the FAR
    background only and add your own focal motif + lighting on top; an ending must not look like a recoloured scene."""
    from reg import SCENES
    img = SCENES[key]["fn"]().convert("RGBA")
    e.c.img = img
    e.c.px = img.load()
    if dim:
        for y in range(e.c.h):
            for x in range(e.c.w):
                blend(e.c, x, y, dim_col, dim, 4)
