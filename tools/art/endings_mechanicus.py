"""SPEC §31 ending illustrations — Adeptus Mechanicus route (mech_*).  See endkit.py for the helper conventions."""
import math
import random
from PIL import Image
from reg import ending
from endkit import *


@ending("mech_death_hp")
def mech_death_hp(e):
    """DEATH.  Consumables: beside the furnace the menial lies where they fell; two servitors assess what is
    recoverable; on the right, a salvage bin where the implants are already stacked, neatly.  Backlit by the
    furnace mouth, black and ember-orange, heavy vignette."""
    c = e.c
    FL = 76
    # forge hall back wall: dark plates, a vast furnace mouth glowing at the left-centre
    n = e.noise("wall")
    for y in range(FL + 1):
        for x in range(192):
            t = clamp(0.22 + (n.fbm(x * 0.05, y * 0.08, 3) - 0.5) * 0.35 + (0.1 if (x // 24 + y // 18) % 2 else 0))
            c.set(x, y, ramp_pick(["#07050a", "#120a0c", "#1e1012", "#2e1a16"], t, x, y))
            if x % 24 == 0 or y % 18 == 0:
                c.set(x, y, "#05030a")
    # chimneys / pipes
    for px_ in (6, 40, 150, 176):
        c.rect(px_, 0, px_ + 3, FL, "#0c0709")
        c.rect(px_, 0, px_, FL, "#2a1612")
    c.rect(0, 14, 191, 17, "#0c0709")
    c.rect(0, 14, 191, 14, "#3a1e16")
    # the furnace mouth: arch, white-hot core, orange falloff
    FX, FY = 78, 46
    glow(c, FX, FY, 58, ["#1e1012", "#3a1810", "#7a2a12", "#c8501a", "#ff8a2a", "#ffd070"], power=1.3, strength=1.0, ry=40)
    for y in range(22, FL + 1):
        for x in range(54, 103):
            dx = (x - FX) / 24.0
            if abs(dx) <= 1.0 and (y >= 40 or (y - 40) / 18.0 + dx * dx > -0.0 and y >= 22 + 18 * (1 - math.sqrt(max(0, 1 - dx * dx)))):
                t = clamp(1.0 - abs(dx) * 0.55 - (FL - y) * 0.004)
                c.set(x, y, ramp_pick(["#a83a14", "#ff7a22", "#ffc050", "#fff0b0"], t, x, y))
    c.rect(54, FL - 2, 102, FL, "#ffe8a0")
    for (x0, x1) in ((52, 54), (102, 104)):                    # arch piers
        c.rect(x0, 22, x1, FL, "#0a0608")
    for yy in range(22, 40):
        for xx in range(50, 108):
            dx = (xx - FX) / 26.0
            if abs(dx) <= 1.05 and yy < 22 + 18 * (1 - math.sqrt(max(0.0, 1 - min(1.0, dx * dx)))) + 1 and yy > 18 + 18 * (1 - math.sqrt(max(0.0, 1 - min(1.0, dx * dx)))):
                c.set(xx, yy, "#0a0608")
    # sparks and heat shimmer
    particles(c, "ember", 70, (40, 20, 130, 100), seed=e.seed_for("sp"), cols=("#ffb040", "#ff6a2a", "#ffe08a"))
    # floor: black plates reflecting the glow, conveyor rails
    hband(c, FL + 1, 107, ["#2a1410", "#160a0a", "#0a0506", "#060304"], seed=e.seed_for("fl"), rough=0.2)
    for x in range(-60, 260, 16):
        c.line([(FX + (x - FX) * 0.35, FL + 1), (FX + (x - FX) * 1.9, 107)], "#0a0506")
    light_pool(c, FX, FL + 10, 70, 12, "#ff8a2a", t=0.5)
    light_pool(c, FX, FL + 5, 40, 6, "#ffd070", t=0.5)
    c.rect(0, FL + 14, 191, FL + 14, "#1e1012")
    # --- the servitors: hunched, hooded, backlit; one holds a slate (assessing), one a clamp
    def servitor(x, y, h, facing, slate):
        f = fig(h, "hunch", "#0a0608", robe=0.55, hood=True, facing=facing, lean=24)
        px0, py0 = put_figure(c, f, x, y, rim_col="#ff9a3a", toward=(1 if x < FX else 1, -1),
                              shadow=dict(toward_light=(-0.2, 1.0), length=0.35, squash=0.8, col="#030203", t=0.85))
        hx_, hy_ = f["head"]
        c.rect(px0 + int(hx_) + facing * 1, py0 + int(hy_), px0 + int(hx_) + facing * 2, py0 + int(hy_) + 1, "#4af0a0")   # sensor eye
        for k in range(3):                                                                                           # a mechadendrite
            c.line([(px0 + int(f["hands"][0][0]), py0 + int(f["hands"][0][1])),
                    (px0 + int(f["hands"][0][0]) + facing * (4 + k * 2), py0 + int(f["hands"][0][1]) + 2 + k)], "#0a0608")
        if slate:
            sx, sy = px0 + int(f["hands"][0][0]), py0 + int(f["hands"][0][1])
            c.rect(sx + facing * 2, sy - 4, sx + facing * 6, sy, "#0a0608")
            c.rect(sx + facing * 3, sy - 3, sx + facing * 5, sy - 1, "#4af0a0")
    servitor(52, 90, 30, 1, True)
    servitor(116, 88, 28, -1, False)
    # --- the fallen menial: a long dark shape on the plates between them, robe pale-grey where the glow catches
    lying = figure(36, "lying", "#4c4c5a", facing=1)
    img = lying["img"]
    img = rim(img, "#ffc070", (0, -1), min_run=2)
    img = rim(img, "#ff9a3a", (1, 0), min_run=2)
    lx, ly = place(c, img, 90, 95, anchor="bm")
    c.rect(lx - 1, ly + 1, lx + 2, ly + 4, "#b8a088")                    # a pale face / hand catching the glow
    c.set(lx - 5, ly + 5, "#4af0a0")                                      # the small augment, still blinking
    # --- the salvage bin, foreground right: a brass-edged crate with the implants stacked in tidy rows
    bx0, by0, bx1, by1 = 128, 82, 186, 106
    c.rect(bx0, by0, bx1, by1, "#1a0e0c")
    c.rect(bx0, by0, bx1, by0 + 1, "#7a4a22")
    c.rect(bx0, by0, bx0 + 1, by1, "#4a2a16")
    c.rect(bx1 - 1, by0, bx1, by1, "#0a0506")
    c.rect(bx0, by1 - 1, bx1, by1, "#0a0506")
    rb = e.rng("bin")
    parts = ["#9a6a3a", "#5a7a6a", "#7a5a3a", "#6a6a74", "#b08a4a"]
    for row in range(3):                                         # neat rows of parts: lenses, cogs, cable coils
        for k in range(8):
            x = bx0 + 4 + k * 7
            y = by0 + 4 + row * 7
            kind = (row + k) % 3
            if kind == 0:
                c.ellipse(x + 2, y + 2, 2, 2, rb.choice(parts))
                c.set(x + 2, y + 2, "#4af0a0")
            elif kind == 1:
                c.rect(x, y, x + 4, y + 3, rb.choice(parts))
                c.set(x + 1, y + 1, "#1a0e0c")
            else:
                c.line([(x, y + 3), (x + 4, y)], rb.choice(parts), 1)
                c.line([(x, y + 1), (x + 4, y + 2)], "#3a3a44")
    c.rect(bx0 - 1, by0 - 9, bx0 + 3, by0, "#2a1a14")           # a tag on a chain: filed, not mourned
    c.rect(bx0 - 2, by0 - 11, bx0 + 4, by0 - 8, "#8a8a7a")
    light_pool(c, 150, 100, 40, 8, "#ff8a2a", t=0.18)
    vignette_kind(c, "death", col="#020102", strength=0.85)
