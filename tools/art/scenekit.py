"""Procedural building blocks for 192x108 scenes and 96x96 omens.
All randomness goes through random.Random(seed) / pxlib.Noise(seed)."""
import math
import random
from pxlib import Canvas, Noise, bayer, hx, mix, clamp, shade

W, H = 192, 108


def C(c):
    return hx(c) if isinstance(c, str) else tuple(c)


SHARP = 2.6   # >1: flat colour bands with dithering only near band edges (less noise)


def ramp_pick(cols, t, x, y, sharp=None):
    """ordered-dither pick across a list of colours (t 0..1)."""
    n = len(cols) - 1
    if n <= 0:
        return C(cols[0])
    f = clamp(t) * n
    i = min(int(f), n - 1)
    fr = clamp((f - i - 0.5) * (sharp or SHARP) + 0.5)
    return C(cols[i + 1]) if fr > bayer(x, y) else C(cols[i])


def sky(c, cols, y0=0, y1=None, warp=None):
    """vertical dithered gradient; warp(x,y)->dt adds wobble."""
    y1 = c.h - 1 if y1 is None else y1
    for y in range(y0, c.h):          # fill below y1 with the last colour band too
        for x in range(c.w):
            t = min(1.0, (y - y0) / max(1, y1 - y0))
            if warp:
                t += warp(x, y)
            c.set(x, y, ramp_pick(cols, t, x, y))


def clouds(c, seed, cols, y0, y1, scale=0.05, thresh=0.5, sx=1.0, alpha_cols=None, oct=4, stretch=2.5):
    """noise clouds drawn over existing pixels. cols: dark->light."""
    n = Noise(seed)
    for y in range(y0, y1 + 1):
        for x in range(c.w):
            v = n.fbm(x * scale / stretch * sx, y * scale, oct)
            if v > thresh:
                t = (v - thresh) / (1 - thresh) * 1.8
                c.set(x, y, ramp_pick(cols, t, x, y))


def glow(c, cx, cy, r, cols, power=1.6, strength=1.0, ry=None):
    """radial dithered glow: cols from outer to core."""
    ry = ry or r
    for y in range(int(cy - ry), int(cy + ry) + 1):
        for x in range(int(cx - r), int(cx + r) + 1):
            if not (0 <= x < c.w and 0 <= y < c.h):
                continue
            d = math.sqrt(((x - cx) / r) ** 2 + ((y - cy) / ry) ** 2)
            if d >= 1:
                continue
            t = ((1 - d) ** power) * strength
            if t * len(cols) < bayer(x, y):
                continue
            idx = min(len(cols) - 1, int(t * len(cols)))
            frac = t * len(cols) - idx
            if idx > 0 and frac < bayer(x, y) * 0.999:
                idx -= 0
            c.set(x, y, C(cols[idx]))


def stars(c, seed, n, y0=0, y1=None, cols=("#8a8aa8", "#d8d8f0", "#ffffff"), mask=None):
    rnd = random.Random(seed)
    y1 = y1 if y1 is not None else c.h - 1
    for _ in range(n):
        x, y = rnd.randrange(c.w), rnd.randrange(y0, y1 + 1)
        if mask and not mask(x, y):
            continue
        col = C(rnd.choice(cols))
        c.set(x, y, col)
        if rnd.random() < 0.06:
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                c.set(x + dx, y + dy, mix(col, c.get(min(c.w - 1, max(0, x + dx)), min(c.h - 1, max(0, y + dy))), 0.5))


def planet(c, cx, cy, r, cols, light=(-0.6, -0.5), ring=None, seed=0, bands=0.0):
    """dithered sphere. cols: dark->light. ring: colour of a thin ring."""
    n = Noise(seed)
    lx, ly = light
    for y in range(int(cy - r), int(cy + r) + 1):
        for x in range(int(cx - r), int(cx + r) + 1):
            dx, dy = (x - cx) / r, (y - cy) / r
            d2 = dx * dx + dy * dy
            if d2 > 1:
                continue
            dz = math.sqrt(1 - d2)
            lum = clamp(-(dx * lx + dy * ly) * 0.8 + dz * 0.55 - 0.1)
            if bands:
                lum = clamp(lum + (n.fbm(x * 0.08, y * 0.35) - 0.5) * bands)
            c.set(x, y, ramp_pick(cols, lum, x, y))
    if ring:
        for a in range(0, 720):
            t = a / 720 * 2 * math.pi
            x = cx + math.cos(t) * r * 1.7
            y = cy + math.sin(t) * r * 0.35
            if math.sin(t) < 0 and (x - cx) ** 2 + (y - cy) ** 2 < r * r:
                continue
            c.set(round(x), round(y), C(ring))


def spire(c, x, base, w, h, col, rnd, win=None, wincol=("#ffcf6a",), tip=True, buttress=True, win_p=0.12):
    """gothic spire silhouette with lit windows."""
    col = C(col)
    top = base - h
    c.rect(x, top, x + w - 1, base, col)
    if tip:
        th = max(3, int(w * 1.4))
        cx = x + (w - 1) / 2
        c.poly([(x, top), (x + w - 1, top), (cx, top - th)], col)
        c.line([(cx, top - th), (cx, top - th - max(2, w // 2))], col)
    if buttress and w >= 5:
        for side in (-1, 1):
            bx = x - 2 if side < 0 else x + w + 1
            by = top + h // 3
            c.poly([(bx, base), (bx + (2 if side < 0 else -2), by), (bx + (2 if side < 0 else -2), base)], col)
    if win:
        for yy in range(top + 2, base - 1, 3):
            for xx in range(x + 1, x + w - 1, 2):
                if rnd.random() < win_p:
                    c.set(xx, yy, C(rnd.choice(wincol)))


def skyline(c, seed, base, col, n, hmin, hmax, wmin=3, wmax=9, x0=0, x1=None, win_p=0.1,
            wincol=("#ffcf6a", "#e89a3a"), tips=0.6):
    rnd = random.Random(seed)
    x1 = c.w if x1 is None else x1
    for _ in range(n):
        w = rnd.randint(wmin, wmax)
        x = rnd.randint(x0 - w, x1)
        h = rnd.randint(hmin, hmax)
        spire(c, x, base, w, h, col, rnd, win=True, wincol=wincol, tip=rnd.random() < tips, win_p=win_p)


def hband(c, y0, y1, cols, seed=0, rough=0.0):
    """horizontal dithered band (ground / floors)."""
    n = Noise(seed)
    for y in range(y0, y1 + 1):
        for x in range(c.w):
            t = (y - y0) / max(1, y1 - y0)
            if rough:
                t += (n.fbm(x * 0.08, y * 0.2) - 0.5) * rough
            c.set(x, y, ramp_pick(cols, t, x, y))


def vignette(c, col, strength=0.55, power=2.2):
    """corner darkening: mixes toward col in two dithered steps (no solid speckle)."""
    col = C(col)
    for y in range(c.h):
        for x in range(c.w):
            dx = (x - c.w / 2) / (c.w / 2)
            dy = (y - c.h / 2) / (c.h / 2)
            d = math.sqrt(dx * dx * 0.8 + dy * dy * 0.9)
            t = clamp((d - 0.7) / 0.5) ** power * strength
            if t <= 0:
                continue
            k = 0.5 if t < 0.5 else 0.75
            if clamp((t * 2 % 1.0 - 0.5) * 3 + 0.5) > bayer(x, y):
                k += 0.12
            c.set(x, y, mix(c.get(x, y), col, min(0.9, k * min(1, t * 2.2))))


def darken_rect(c, x0, y0, x1, y1, amount=0.25):
    for y in range(max(0, y0), min(c.h, y1 + 1)):
        for x in range(max(0, x0), min(c.w, x1 + 1)):
            if bayer(x, y) < amount:
                c.set(x, y, mix(c.get(x, y), (0, 0, 0), 0.35))


def calm_lower(c, y0, col, amount=0.35):
    """push the lower band (dialogue box area) toward a calm flat colour."""
    col = C(col)
    for y in range(y0, c.h):
        t = clamp((y - y0) / max(1, c.h - y0)) * amount + amount * 0.5
        for x in range(c.w):
            c.set(x, y, mix(c.get(x, y), col, t))


def ember(c, seed, n, region, cols=("#ffb040", "#ff6a2a", "#ffe08a")):
    rnd = random.Random(seed)
    x0, y0, x1, y1 = region
    for _ in range(n):
        x, y = rnd.randint(x0, x1), rnd.randint(y0, y1)
        c.set(x, y, C(rnd.choice(cols)))


def lightning(c, seed, x, y0, y1, col, jag=3, width=1):
    rnd = random.Random(seed)
    pts = [(x, y0)]
    yy = y0
    while yy < y1:
        yy += rnd.randint(2, 5)
        x += rnd.randint(-jag, jag)
        pts.append((x, min(yy, y1)))
    c.line(pts, col, width)
    return pts


def ship_gothic(c, x, y, L, col, lite, rnd=None, win="#ffcf6a", face=1):
    """blocky cathedral-ship silhouette facing right (face=1) or left (-1). length L."""
    hgt = max(3, L // 5)
    pts = [(0, 0), (L * 0.75, 0), (L, hgt * 0.5), (L * 0.75, hgt), (0, hgt)]
    pts = [(x + px * face, y + py) for (px, py) in pts]
    c.poly(pts, col)
    # dorsal towers
    for i in range(3):
        tx = x + face * int(L * (0.12 + i * 0.12))
        th = int(hgt * (1.2 - i * 0.3))
        c.rect(min(tx, tx + face * 2), y - th, max(tx, tx + face * 2), y, col)
    # top edge highlight
    for i in range(int(L * 0.75)):
        c.set(x + face * i, y, lite)
    if rnd:
        for i in range(int(L * 0.7)):
            if rnd.random() < 0.18:
                c.set(x + face * i, y + rnd.randint(1, max(1, hgt - 1)), win)
    # engines
    c.set(x - face, y + hgt // 2, "#9ad6ff")
    c.set(x - 2 * face, y + hgt // 2, "#4a8ad8")


def ship_sleek(c, x, y, L, col, lite, dark, glowc="#46d8c8", face=1):
    """smooth curved T'au-like hull."""
    hgt = max(3, L // 6)
    for i in range(L):
        t = i / L
        half = hgt * math.sin(math.pi * (0.15 + 0.85 * t)) * (1 - t * 0.55)
        for j in range(-int(half), int(half * 0.6) + 1):
            xx = x + face * i
            col_ = lite if j < -half * 0.4 else (col if j < half * 0.2 else dark)
            c.set(xx, y + j, col_)
    c.set(x - face, y, glowc)
    c.set(x - face * 2, y, glowc)


def ship_spiky(c, x, y, L, col, lite, rnd, face=1, glowc="#ff3a2a"):
    """jagged black-fleet silhouette."""
    hgt = max(3, L // 5)
    c.poly([(x, y), (x + face * L, y + hgt // 2), (x, y + hgt)], col)
    for i in range(0, L - 4, 3):
        sh = rnd.randint(2, hgt + 2)
        bx = x + face * i
        c.poly([(bx, y + 1), (bx + face * 2, y + 1), (bx + face, y - sh)], col)
    for i in range(int(L * 0.8)):
        if rnd.random() < 0.12:
            c.set(x + face * i, y + rnd.randint(1, hgt - 1), glowc)
    for i in range(L // 2):
        c.set(x + face * i, y + 1 + i * hgt // (2 * L), lite)


# ---------------------------------------------------------------- detailed ships (drawn on an alpha layer, outlined)
def _ship_layer(w, h):
    return Canvas(w, h, alpha=True)


def ship_cathedral(c, x, y, L, pal, face=1, seed=0):
    """Gothic battleship: ram prow, stepped decks, spires, lit windows, engine glow.
    pal = (outline, dark, mid, light, window, engine). (x, y) = stern top-left of the hull."""
    o, d, m, l, win, eng = [C(p) for p in pal]
    rnd = random.Random(seed)
    hh = max(4, L // 6)
    W, H = L + 4, hh * 3 + 6
    lay = _ship_layer(W, H)
    base = H - hh - 2                      # hull top
    # hull + ram prow
    lay.poly([(1, base), (int(L * 0.72), base), (L, base + hh // 2 + 1), (int(L * 0.72), base + hh), (3, base + hh)], m)
    # stepped decks rising toward the stern
    steps = [(0.06, 0.62, 0.35), (0.10, 0.45, 0.7), (0.14, 0.30, 1.05)]
    for (a, b, k) in steps:
        top = base - int(hh * k)
        lay.rect(int(L * a), top, int(L * b), base, m)
        lay.rect(int(L * a), top, int(L * b), top, l)
    # spires
    for i in range(3):
        sx = int(L * (0.16 + i * 0.05))
        top = base - int(hh * 1.05) - (4 - i)
        lay.poly([(sx - 1, top + 3), (sx + 1, top + 3), (sx, top - max(2, hh // 2) - 2 * (i == 1))], m)
    # shading: light along hull top, dark underside
    for xx in range(1, int(L * 0.72)):
        lay.set(xx, base, l)
        for yy in range(base + hh - max(1, hh // 3), base + hh + 1):
            if lay.opaque(xx, yy):
                lay.set(xx, yy, d)
    for xx in range(int(L * 0.72), L):
        yy = base + (xx - int(L * 0.72)) * (hh // 2 + 1) // max(1, L - int(L * 0.72))
        lay.set(xx, yy, l)
    # windows
    for xx in range(4, int(L * 0.68), 2):
        if rnd.random() < 0.5:
            lay.set(xx, base + 2 + (xx // 2) % max(1, hh // 2), win)
    for (a, b, k) in steps:
        top = base - int(hh * k)
        for xx in range(int(L * a) + 1, int(L * b), 3):
            if rnd.random() < 0.6:
                lay.set(xx, top + 2, win)
    lay.outline(o)
    img = lay.image()
    if face < 0:
        img = img.transpose(1 - 1)  # FLIP_LEFT_RIGHT == 0
    px = x if face > 0 else x - W
    c.paste(img, px, y - base)
    # engine glow at the stern
    ex = x - 2 if face > 0 else x + 1
    for k in range(max(1, hh // 3)):
        ey = y + 1 + k * 2
        glow(c, ex, ey, 3, [eng, (255, 255, 255)], strength=0.9)


def ship_lens(c, x, y, L, pal, face=1):
    """Sleek curved hull with a dorsal fin. pal = (outline, dark, mid, light, glow)."""
    o, d, m, l, g = [C(p) for p in pal]
    hh = max(3, L // 5)
    W, H = L + 4, hh * 3
    lay = _ship_layer(W, H)
    cy = H // 2
    for i in range(L):
        t = i / L
        top = hh * math.sin(math.pi * min(1, 0.1 + t)) * (0.55 + 0.45 * (1 - t))
        bot = hh * 0.55 * math.sin(math.pi * min(1, 0.05 + t * 0.95))
        for j in range(-int(top), int(bot) + 1):
            col = l if j <= -int(top) + 1 else (m if j < bot * 0.3 else d)
            lay.set(2 + i, cy + j, col)
    # dorsal fin
    fx = int(L * 0.25)
    lay.poly([(2 + fx, cy - hh // 2), (2 + fx + L // 4, cy - hh // 2), (2 + fx + 2, cy - hh - 2)], m)
    lay.line([(2 + fx + 2, cy - hh - 2), (2 + fx + L // 4, cy - hh // 2)], l)
    # seam line
    lay.line([(4, cy), (L - 2, cy)], d)
    lay.outline(o)
    img = lay.image()
    if face < 0:
        img = img.transpose(0)
    c.paste(img, x if face > 0 else x - W, y - cy)
    ex = x + 1 if face > 0 else x - 2
    glow(c, ex, y, 3, [g, (255, 255, 255)], strength=0.9)


def ship_thorn(c, x, y, L, pal, face=-1, seed=0):
    """Jagged black-fleet ship with spines and red ports. pal = (outline, body, lite, port)."""
    o, b, l, p = [C(q) for q in pal]
    rnd = random.Random(seed)
    hh = max(4, L // 5)
    W, H = L + 4, hh * 4
    lay = _ship_layer(W, H)
    cy = H // 2 + 2
    lay.poly([(2, cy - hh // 2), (int(L * 0.7), cy - hh // 2), (L + 1, cy + 1), (int(L * 0.7), cy + hh // 2), (2, cy + hh // 2)], b)
    for i in range(4, int(L * 0.8), 3):
        sh = rnd.randint(2, hh + 3)
        lay.poly([(i, cy - hh // 2), (i + 2, cy - hh // 2), (i - 1, cy - hh // 2 - sh)], b)
        if rnd.random() < 0.4:
            lay.poly([(i, cy + hh // 2), (i + 2, cy + hh // 2), (i - 1, cy + hh // 2 + sh // 2)], b)
    for i in range(3, int(L * 0.7)):
        lay.set(i, cy - hh // 2, l)
        if rnd.random() < 0.15:
            lay.set(i, cy + rnd.randint(-hh // 2 + 1, hh // 2 - 1), p)
    lay.outline(o)
    img = lay.image()
    if face < 0:
        img = img.transpose(0)
    c.paste(img, x if face > 0 else x - W, y - cy)
