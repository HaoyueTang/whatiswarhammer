"""SPEC §31 ending illustrations — Genestealer Cult route (gsc_*).  See endkit.py for the helper conventions."""
import math
import random
from PIL import Image, ImageDraw, ImageFilter
from reg import ending
from endkit import *


@ending("gsc_end_claim_tzeentch")
def gsc_end_claim_tzeentch(e):
    """BAD / Tzeentch.  The Crack in the Shadow: a wall of Shadow as vast as the sky, and in it a doorway exactly the
    shape of the player, lit in Tzeentch's blue / pink.  The player stands before it, a smaller copy of the hole."""
    c = e.c
    FLOOR = 90
    # --- the Shadow: a wall of vertical dark streaks
    wn, wn2 = e.noise("wall"), e.noise("wall2")
    for y in range(108):
        for x in range(192):
            v = wn.fbm(x * 0.045, y * 0.012, 4) * 0.6 + wn2.fbm(x * 0.2, y * 0.01, 2) * 0.4
            t = clamp(v * 1.4 - 0.25)
            c.set(x, y, ramp_pick(["#07040f", "#0e0820", "#180c32", "#26134a"], t * 0.9, x, y))
    # --- the doorway, the player's own shape (a stand-pose silhouette, 80 px tall)
    f = figure(80, "stand", "#ffffff", thick=1.05)
    ap = mask_of(f["img"])
    ox, oy = 96 - ap.width // 2, FLOOR - ap.height
    big = Image.new("L", (192, 108), 0)
    big.paste(ap, (ox, oy))
    mp = big.load()
    halo1 = big.filter(ImageFilter.GaussianBlur(3.2)).load()
    halo2 = big.filter(ImageFilter.GaussianBlur(11)).load()
    for y in range(108):
        for x in range(192):
            if mp[x, y] < 128:
                g1, g2 = halo1[x, y] / 255.0, halo2[x, y] / 255.0
                if y < FLOOR + 1:
                    blend(c, x, y, "#e83aa8", g2 * 0.55, 3)
                    blend(c, x, y, "#2ab8ff", g1 * 0.8, 3)
    # swirling Tzeentch light inside
    sn = e.noise("swirl")
    for y in range(108):
        for x in range(192):
            if mp[x, y] >= 128:
                u = (y - oy) / float(ap.height)
                w = sn.fbm(x * 0.07 + y * 0.03, y * 0.07, 3)
                t = clamp(0.5 + 0.5 * math.sin((x - 96) * 0.17 + (y - 48) * 0.1 + w * 5.0) * 0.8 + (u - 0.5) * 0.5)
                c.set(x, y, ramp_pick(["#0a1e7a", "#1a5ad8", "#2ab8ff", "#9af6ff", "#ffffff", "#ffa0d8", "#e83aa8"], t * 0.95, x, y))
    # threads crossing the opening (the plan)
    ch = Image.new("L", (192, 108), 0)
    d = ImageDraw.Draw(ch)
    rr = e.rng("threads")
    for k in range(9):
        a = (rr.randint(ox, ox + ap.width), rr.randint(oy, oy + 24))
        b = (rr.randint(ox, ox + ap.width), rr.randint(oy + 46, FLOOR))
        d.line([a, b], fill=255, width=1)
    chp = ch.load()
    for y in range(108):
        for x in range(192):
            if chp[x, y] and mp[x, y] >= 128:
                c.set(x, y, "#ffffff" if (x + y) % 3 else "#ffa0d8")
    # bright edge of the opening
    for y in range(1, 107):
        for x in range(1, 191):
            if mp[x, y] >= 128 and (mp[x - 1, y] < 128 or mp[x, y - 1] < 128 or mp[x + 1, y] < 128):
                c.set(x, y, "#e8ffff")
    # cracks running out of the doorway into the Shadow
    edge = [(x, y) for y in range(2, FLOOR) for x in range(2, 190)
            if mp[x, y] >= 128 and (mp[x - 1, y] < 128 or mp[x + 1, y] < 128 or mp[x, y - 1] < 128)]
    rc = e.rng("cracks")
    for k in range(22):
        sx, sy = rc.choice(edge)
        dx, dy = sx - 96, sy - 52
        ln = math.hypot(dx, dy) or 1
        dx, dy = dx / ln, dy / ln
        x, y = float(sx), float(sy)
        steps = rc.randint(4, 10)
        for s_ in range(steps):
            nx = x + dx * 3.2 + rc.uniform(-2.0, 2.0)
            ny = y + dy * 3.2 + rc.uniform(-1.6, 1.6)
            col = mix(C("#9af6ff"), C("#26134a"), s_ / float(steps))
            if ny < FLOOR:
                c.line([(x, y), (nx, ny)], col)
            x, y = nx, ny
    # --- the floor: black glass, the doorway's light spilled and reflected
    for y in range(FLOOR + 1, 108):
        for x in range(192):
            c.set(x, y, ramp_pick(["#05030c", "#0a0618", "#120a28"], 0.3 + (y - FLOOR) / 40.0 * 0.4 + wn2.fbm(x * 0.1, y * 0.2, 2) * 0.3, x, y))
    c.rect(0, FLOOR, 191, FLOOR, "#3a1e5c")
    for y in range(FLOOR + 1, 108):                               # reflection: the doorway stretched downward and dimmed
        k = (y - FLOOR) / 17.0
        sy = int(FLOOR - 1 - k * 40)
        for x in range(192):
            if 0 <= sy < 108 and mp[x, sy] >= 128 and ((x + y) % 2 == 0 or k < 0.5):
                blend(c, x, y, "#2ab8ff", 0.7 * (1 - k), 3)
    light_pool(c, 96, FLOOR + 8, 40, 9, "#e83aa8", t=0.35)
    light_pool(c, 96, FLOOR + 6, 24, 6, "#9af6ff", t=0.45)
    # --- the one who walked up to it, from behind, in the shape of the hole
    me = player_fig("gsc", 30, "stand", facing=1)
    img = me["img"]
    img = tint(img, "#06040e", 0.9)
    img = rim(img, "#7af0ff", (-1, 0), min_run=2)
    img = rim(img, "#ff7ac8", (1, 0), min_run=2)
    img = rim(img, "#cffcff", (0, -1), min_run=2)
    cast_shadow(c, me["img"], 96 + 1, 100, origin=me["feet"], toward_light=(0, 1.0), length=0.0, squash=0.8, col="#02010a", t=0.8)
    place(c, img, 96, 100, anchor="bm")
    particles(c, "mote", 46, (30, 0, 162, 100), seed=e.seed_for("conf"), cols=("#7af0ff", "#ff7ac8", "#ffe060", "#ffffff"))
    vignette_kind(c, "bad", col="#05030c", strength=0.7)
