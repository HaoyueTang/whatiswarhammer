"""pxlib — tiny pixel-art toolkit used by every generator in tools/art.

Concepts
--------
* Colours are (r, g, b) tuples; ``hx("#aabbcc")`` parses hex.
* ``ramp(base)`` builds a 4-tone hue-shifted ramp  [outline, shadow, mid, light]
  (shadows drift toward blue/purple, lights toward yellow — classic 16-bit).
* Masks are Pillow "L" images (0 / 255).  Helpers: E (ellipse), R (rect),
  P (polygon), L (thick polyline), G (hand-drawn grid), plus union/sub/inter.
* ``Sprite`` = stack of shaded regions + hand-painted detail pixels.  Render:
  per-region directional shading (light from the top-left), 1px separation
  lines where a region overlaps another, auto outline in a dark shade of the
  local hue, optional horizontal flip (done *before* shading so the light stays
  top-left), and a final palette reduction to <= N colours.
* Scenes use ``Canvas`` + ordered (Bayer) dithering + value noise.

Everything is deterministic: random helpers take explicit seeds.
"""
import colorsys
import math
import random
from PIL import Image, ImageDraw

# ---------------------------------------------------------------- colours

def hx(s):
    s = s.lstrip("#")
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def clamp(v, a=0.0, b=1.0):
    return a if v < a else b if v > b else v


def _hue_toward(h, target, amt):
    """shift hue h (0..1) toward target (0..1) by amt (0..1 of a turn, max)."""
    d = ((target - h + 0.5) % 1.0) - 0.5
    step = max(-amt, min(amt, d))
    return (h + step) % 1.0


def shade(c, dv=0.0, ds=0.0, hue_to=None, hue_amt=0.0):
    r, g, b = [v / 255 for v in c]
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    if hue_to is not None and s > 0.04:
        h = _hue_toward(h, hue_to, hue_amt)
    s = clamp(s + ds)
    v = clamp(v + dv)
    r, g, b = colorsys.hsv_to_rgb(h, s, v)
    return (round(r * 255), round(g * 255), round(b * 255))


def mix(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def ramp(base, light=0.16, dark=0.20, outline=0.42, hs=0.035):
    """[outline, shadow, mid, light] from a mid-tone. Hue shifted."""
    c = hx(base) if isinstance(base, str) else base
    BLUE, YEL = 0.66, 0.14
    return [
        shade(c, -outline, +0.12, BLUE, hs * 2.2),
        shade(c, -dark, +0.08, BLUE, hs),
        c,
        shade(c, +light, -0.10, YEL, hs),
    ]


def ramp_explicit(*hexes):
    return [hx(h) for h in hexes]


def cdist(a, b):
    rm = (a[0] + b[0]) / 2
    dr, dg, db = a[0] - b[0], a[1] - b[1], a[2] - b[2]
    return math.sqrt((2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db)

# ---------------------------------------------------------------- masks

def blank(w, h):
    return Image.new("L", (w, h), 0)


def E(w, h, cx, cy, rx, ry):
    m = blank(w, h)
    ImageDraw.Draw(m).ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=255)
    return m


def R(w, h, x0, y0, x1, y1):
    m = blank(w, h)
    ImageDraw.Draw(m).rectangle([min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1)], fill=255)
    return m


def P(w, h, pts):
    m = blank(w, h)
    ImageDraw.Draw(m).polygon([tuple(p) for p in pts], fill=255)
    return m


def L(w, h, pts, width=1):
    m = blank(w, h)
    d = ImageDraw.Draw(m)
    d.line([tuple(p) for p in pts], fill=255, width=width)
    if width > 2:
        r = width / 2 - 0.5
        for (x, y) in pts:
            d.ellipse([x - r, y - r, x + r, y + r], fill=255)
    return m


def G(w, h, x, y, rows, on="#"):
    """mask from a hand-drawn grid (list of strings); chars in `on` are set."""
    m = blank(w, h)
    px = m.load()
    for j, row in enumerate(rows):
        for i, ch in enumerate(row):
            if ch in on and 0 <= x + i < w and 0 <= y + j < h:
                px[x + i, y + j] = 255
    return m


def union(*ms):
    out = ms[0].copy()
    for m in ms[1:]:
        out.paste(255, mask=m)
    return out


def sub(a, *bs):
    out = a.copy()
    for b in bs:
        out.paste(0, mask=b)
    return out


def inter(a, b):
    out = blank(*a.size)
    out.paste(a, mask=b)
    return out


def mflip(m):
    return m.transpose(Image.FLIP_LEFT_RIGHT)

# ---------------------------------------------------------------- sprite

MAX_COLORS = 12


class Region:
    __slots__ = ("ramp", "mask", "mode", "lt", "st", "sep", "tex", "flat", "z", "outline", "pix")

    def __init__(self, rmp, mask, mode, lt, st, sep, tex, flat, z, outline):
        self.ramp, self.mask, self.mode = rmp, mask, mode
        self.lt, self.st, self.sep, self.tex, self.flat = lt, st, sep, tex, flat
        self.z, self.outline = z, outline


class Sprite:
    """Compose shaded regions; author facing RIGHT, pass flip=True to face left."""

    def __init__(self, w, h=None):
        self.w, self.h = w, h or w
        self.regions = []
        self.details = []   # (x, y, colour or None=erase)

    # -- mask shortcuts bound to this size
    def E(self, cx, cy, rx, ry): return E(self.w, self.h, cx, cy, rx, ry)
    def R(self, x0, y0, x1, y1): return R(self.w, self.h, x0, y0, x1, y1)
    def P(self, *pts): return P(self.w, self.h, pts)
    def L(self, pts, width=1): return L(self.w, self.h, pts, width)
    def G(self, x, y, rows, on="#"): return G(self.w, self.h, x, y, rows, on)

    def add(self, rmp, mask, mode="sphere", lt=0.30, st=0.62, sep=True, tex=None,
            flat=None, outline=True):
        """mode: sphere | cyl | flat | vert | glow.  flat=index forces one tone.
        tex=(seed, density) sprinkles shadow pixels (fur, rust, grime).
        sep: draw a 1px shadow line on regions this one overlaps."""
        self.regions.append(Region(rmp, mask, mode, lt, st, sep, tex, flat, len(self.regions), outline))
        return mask

    def px(self, x, y, c):
        self.details.append((x, y, hx(c) if isinstance(c, str) else c, len(self.regions) - 1))

    def pxs(self, pts, c):
        for (x, y) in pts:
            self.px(x, y, c)

    def stamp(self, x, y, rows, legend):
        """paint a hand-authored grid; legend maps char -> colour ('.' / ' ' skipped,
        '_' erases to transparent)."""
        for j, row in enumerate(rows):
            for i, ch in enumerate(row):
                if ch in legend:
                    c = legend[ch]
                    self.details.append((x + i, y + j, hx(c) if isinstance(c, str) else c, len(self.regions) - 1))
                elif ch == "_":
                    self.details.append((x + i, y + j, None, len(self.regions) - 1))

    # -- render
    def render(self, flip=False, max_colors=MAX_COLORS, outline=True):
        w, h = self.w, self.h
        top = [[-1] * w for _ in range(h)]
        masks = []
        for r in self.regions:
            m = mflip(r.mask) if flip else r.mask
            mp = m.load()
            masks.append(mp)
            for y in range(h):
                row = top[y]
                for x in range(w):
                    if mp[x, y]:
                        row[x] = r.z
        tone = [[2] * w for _ in range(h)]
        # spans per region, computed lazily
        for r, mp in zip(self.regions, masks):
            rnd = random.Random(r.tex[0]) if r.tex else None
            # row spans / column spans of full mask
            rows = {}
            cols = {}
            for y in range(h):
                xs = [x for x in range(w) if mp[x, y]]
                if xs:
                    rows[y] = (xs[0], xs[-1])
            for x in range(w):
                ys = [y for y in range(h) if mp[x, y]]
                if ys:
                    cols[x] = (ys[0], ys[-1])
            if not rows:
                continue
            ymin, ymax = min(rows), max(rows)
            xmin = min(v[0] for v in rows.values())
            xmax = max(v[1] for v in rows.values())

            def inside(x, y):
                return 0 <= x < w and 0 <= y < h and mp[x, y]

            for y in range(h):
                for x in range(w):
                    if top[y][x] != r.z:
                        continue
                    if r.flat is not None:
                        t = r.flat
                    else:
                        xl, xr = rows[y]
                        yt, yb = cols[x]
                        u = (x - xl + 0.5) / (xr - xl + 1)
                        v = (y - yt + 0.5) / (yb - yt + 1)
                        if r.mode == "cyl":
                            s = u
                        elif r.mode == "vert":
                            s = v
                        elif r.mode == "glow":
                            s = 0.0
                        else:   # sphere
                            s = 0.62 * u + 0.38 * v
                        t = 3 if s < r.lt else (1 if s > r.st else 2)
                        # crisp rims
                        if r.mode != "glow":
                            if not inside(x + 1, y) or not inside(x, y + 1):
                                t = min(t, 1) if r.mode != "vert" or not inside(x, y + 1) else t
                            elif (not inside(x, y - 1) or not inside(x - 1, y)) and t == 2:
                                t = 3
                        if rnd and t > 1 and rnd.random() < r.tex[1]:
                            t -= 1
                    tone[y][x] = t
        img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        out = img.load()
        for y in range(h):
            for x in range(w):
                z = top[y][x]
                if z < 0:
                    continue
                r = self.regions[z]
                t = tone[y][x]
                # separation line where a later region overlaps this one
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h:
                        nz = top[ny][nx]
                        if nz > z and self.regions[nz].sep:
                            sepv = self.regions[nz].sep
                            t = 0 if sepv == "line" else min(t, 1)
                            break
                out[x, y] = r.ramp[t] + (255,)
        detail_owner = {}
        for (x, y, c, dz) in self.details:
            if flip:
                x = w - 1 - x
            if 0 <= x < w and 0 <= y < h and top[y][x] <= dz:
                if c is None:
                    out[x, y] = (0, 0, 0, 0)
                    top[y][x] = -1
                else:
                    out[x, y] = c + (255,)
                    detail_owner[(x, y)] = c
        if outline:
            add = {}
            for y in range(h):
                for x in range(w):
                    if out[x, y][3]:
                        continue
                    for dx, dy in ((0, 1), (1, 0), (-1, 0), (0, -1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < w and 0 <= ny < h and out[nx, ny][3]:
                            z = top[ny][nx]
                            if z >= 0:
                                if not self.regions[z].outline:
                                    continue
                                c = self.regions[z].ramp[0]
                            elif (nx, ny) in detail_owner:
                                c = shade(detail_owner[(nx, ny)], -0.45, 0.1, 0.66, 0.06)
                            else:
                                continue
                            add[(x, y)] = c
                            break
            for (x, y), c in add.items():
                out[x, y] = c + (255,)
        if max_colors:
            img = reduce_colors(img, max_colors)
        return img


def reduce_colors(img, n):
    """Greedy merge of the closest colour pair until <= n opaque colours remain."""
    px = img.load()
    w, h = img.size
    counts = {}
    for y in range(h):
        for x in range(w):
            p = px[x, y]
            if p[3]:
                counts[p[:3]] = counts.get(p[:3], 0) + 1
    remap = {}
    cols = dict(counts)
    while len(cols) > n:
        keys = list(cols)
        best = None
        for i in range(len(keys)):
            for j in range(i + 1, len(keys)):
                d = cdist(keys[i], keys[j]) * (min(cols[keys[i]], cols[keys[j]]) ** 0.25)
                if best is None or d < best[0]:
                    best = (d, keys[i], keys[j])
        _, a, b = best
        keep, drop = (a, b) if cols[a] >= cols[b] else (b, a)
        cols[keep] += cols.pop(drop)
        for k, v in list(remap.items()):
            if v == drop:
                remap[k] = keep
        remap[drop] = keep
    if remap:
        for y in range(h):
            for x in range(w):
                p = px[x, y]
                if p[3] and p[:3] in remap:
                    px[x, y] = remap[p[:3]] + (255,)
    return img


def count_colors(img):
    return len({p[:3] for p in img.getdata() if len(p) < 4 or p[3]})

# ---------------------------------------------------------------- canvas / scenes

BAYER4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]


def bayer(x, y):
    return (BAYER4[y & 3][x & 3] + 0.5) / 16.0


class Noise:
    """Deterministic 2D value noise with fbm."""

    def __init__(self, seed):
        rnd = random.Random(seed)
        self.p = [rnd.random() for _ in range(512)]
        self.perm = list(range(256))
        rnd.shuffle(self.perm)
        self.perm += self.perm

    def _v(self, ix, iy):
        return self.p[self.perm[(self.perm[ix & 255] + iy) & 255]]

    def value(self, x, y):
        ix, iy = math.floor(x), math.floor(y)
        fx, fy = x - ix, y - iy
        sx, sy = fx * fx * (3 - 2 * fx), fy * fy * (3 - 2 * fy)
        a = self._v(ix, iy); b = self._v(ix + 1, iy)
        c = self._v(ix, iy + 1); d = self._v(ix + 1, iy + 1)
        return (a + (b - a) * sx) + ((c + (d - c) * sx) - (a + (b - a) * sx)) * sy

    def fbm(self, x, y, oct=4):
        t, amp, f, norm = 0.0, 1.0, 1.0, 0.0
        for _ in range(oct):
            t += amp * self.value(x * f, y * f)
            norm += amp
            amp *= 0.5
            f *= 2.0
        return t / norm


class Canvas:
    """Opaque (or transparent) RGB canvas with dithering helpers."""

    def __init__(self, w, h, bg=(0, 0, 0), alpha=False):
        self.w, self.h = w, h
        self.alpha = alpha
        self.img = Image.new("RGBA", (w, h), (0, 0, 0, 0) if alpha else tuple(bg) + (255,))
        self.px = self.img.load()

    def set(self, x, y, c):
        x, y = int(x), int(y)
        if 0 <= x < self.w and 0 <= y < self.h:
            if c is None:
                self.px[x, y] = (0, 0, 0, 0)
            else:
                self.px[x, y] = (hx(c) if isinstance(c, str) else tuple(c[:3])) + (255,)

    def get(self, x, y):
        return self.px[int(x), int(y)][:3]

    def opaque(self, x, y):
        return 0 <= x < self.w and 0 <= y < self.h and self.px[x, y][3] > 0

    def ditherpick(self, cols, t, x, y):
        """t in 0..1 across a list of colours, ordered dither between neighbours."""
        n = len(cols) - 1
        f = clamp(t) * n
        i = min(int(f), n - 1) if n > 0 else 0
        frac = f - i
        if n == 0:
            return cols[0]
        return cols[i + 1] if frac > bayer(x, y) else cols[i]

    def vgrad(self, cols, y0=0, y1=None, x0=0, x1=None, fn=None):
        y1 = self.h - 1 if y1 is None else y1
        x1 = self.w - 1 if x1 is None else x1
        cols = [hx(c) if isinstance(c, str) else c for c in cols]
        for y in range(y0, y1 + 1):
            t = (y - y0) / max(1, (y1 - y0))
            for x in range(x0, x1 + 1):
                tt = fn(x, y, t) if fn else t
                self.set(x, y, self.ditherpick(cols, tt, x, y))

    def field(self, cols, fn, mask=None, x0=0, y0=0, x1=None, y1=None):
        """paint every pixel with ditherpick(cols, fn(x,y)); fn returns None to skip."""
        x1 = self.w - 1 if x1 is None else x1
        y1 = self.h - 1 if y1 is None else y1
        cols = [hx(c) if isinstance(c, str) else c for c in cols]
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                if mask is not None and not mask(x, y):
                    continue
                t = fn(x, y)
                if t is None:
                    continue
                self.set(x, y, self.ditherpick(cols, t, x, y))

    def fill_mask(self, m, c, ox=0, oy=0):
        mp = m.load()
        mw, mh = m.size
        for y in range(mh):
            for x in range(mw):
                if mp[x, y]:
                    self.set(x + ox, y + oy, c)

    def rect(self, x0, y0, x1, y1, c):
        for y in range(int(y0), int(y1) + 1):
            for x in range(int(x0), int(x1) + 1):
                self.set(x, y, c)

    def draw(self):
        return ImageDraw.Draw(self.img)

    def poly(self, pts, c):
        c = hx(c) if isinstance(c, str) else c
        ImageDraw.Draw(self.img).polygon([tuple(p) for p in pts], fill=tuple(c) + (255,))

    def line(self, pts, c, width=1):
        c = hx(c) if isinstance(c, str) else c
        ImageDraw.Draw(self.img).line([tuple(p) for p in pts], fill=tuple(c) + (255,), width=width)

    def ellipse(self, cx, cy, rx, ry, c):
        c = hx(c) if isinstance(c, str) else c
        ImageDraw.Draw(self.img).ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=tuple(c) + (255,))

    def blend_px(self, x, y, c, t):
        if 0 <= x < self.w and 0 <= y < self.h:
            c = hx(c) if isinstance(c, str) else c
            self.set(x, y, mix(self.get(x, y), c, t))

    def paste(self, img, x, y):
        self.img.alpha_composite(img, (int(x), int(y)))

    def outline(self, c, only_transparent=True):
        """1px outline around opaque pixels (for alpha canvases)."""
        c = hx(c) if isinstance(c, str) else c
        add = []
        for y in range(self.h):
            for x in range(self.w):
                if self.px[x, y][3]:
                    continue
                for dx, dy in ((0, 1), (1, 0), (-1, 0), (0, -1)):
                    if self.opaque(x + dx, y + dy):
                        add.append((x, y))
                        break
        for (x, y) in add:
            self.set(x, y, c)

    def image(self):
        return self.img


def stamp_img(rows, legend, w=None, h=None):
    """Build an RGBA image straight from a grid (used for 16x16 UI icons)."""
    h = h or len(rows)
    w = w or max(len(r) for r in rows)
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px = img.load()
    for j, row in enumerate(rows):
        for i, ch in enumerate(row):
            if ch in legend and legend[ch] is not None:
                c = legend[ch]
                c = hx(c) if isinstance(c, str) else c
                px[i, j] = tuple(c) + (255,)
    return img
