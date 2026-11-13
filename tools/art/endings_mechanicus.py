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


# ====================================================================== shared helpers (module-local)

def _gear(c, cx, cy, r, teeth, col, hole=0.0, hole_col=None, rot=0.0, tooth=0.2, hub=None):
    """abstract cog (a plain toothed disc, no marks): filled polygon, optional axle hole / hub."""
    pts = []
    n = teeth * 4
    for i in range(n):
        a = rot + 2 * math.pi * i / n
        rr = r if (i % 4) in (1, 2) else r * (1 - tooth)
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    c.poly(pts, col)
    if hole and hole_col is not None:
        c.ellipse(cx, cy, r * hole, r * hole, hole_col)
    if hub is not None:
        c.ellipse(cx, cy, max(1, r * 0.18), max(1, r * 0.18), hub)


def _cable(c, p0, p1, sag, col, hi=None):
    """hanging cable between two points (parabola), optional 1px highlight above it."""
    n = int(max(abs(p1[0] - p0[0]), abs(p1[1] - p0[1]))) + 2
    pts = []
    for i in range(n + 1):
        t = i / float(n)
        pts.append((p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t + sag * 4 * t * (1 - t)))
    c.line(pts, col)
    if hi is not None:
        for (x, y) in pts[::3]:
            c.set(x, y - 1, hi)
    return pts


def _notes(c, x, y, col, pattern=(3, 1, 2, -1)):
    """the four-note song: four tiny note heads with stems, stepping along a rising / falling line."""
    for i, dy in enumerate(pattern):
        nx, ny = x + i * 4, y + dy
        c.rect(nx, ny, nx + 1, ny + 1, col)
        c.rect(nx + 1, ny - 3, nx + 1, ny, col)


def _leds(c, x0, y0, cols, rows, sx, sy, on, off=None, seed=1, p_on=1.0, w=2, h=1, bright=None, p_bright=0.0):
    """grid of small indicator lamps.  p_on = share lit."""
    rr = random.Random(seed)
    for j in range(rows):
        for i in range(cols):
            x, y = x0 + i * sx, y0 + j * sy
            lit = rr.random() < p_on
            col = on if lit else off
            if lit and bright and rr.random() < p_bright:
                col = bright
            if col is not None:
                c.rect(x, y, x + w - 1, y + h - 1, col)


def _plates(c, x0, y0, x1, y1, cols, seed, pw=22, ph=17, seam=None, tfn=None, grain=0.45):
    """bolted wall plates with seams; tfn(x, y) -> 0..1 colour position (light falloff), default top-lit."""
    n = Noise(seed)
    for y in range(y0, y1 + 1):
        row = (y - y0) // ph
        for x in range(x0, x1 + 1):
            t = tfn(x, y) if tfn else 0.5
            t = clamp(t + (n.fbm(x * 0.07, y * 0.1) - 0.5) * grain + (0.04 if (((x - x0) // pw + row) % 2) else -0.02))
            c.set(x, y, ramp_pick(cols, t, x, y))
            if (y - y0) % ph == 0 or (x - x0 + (row % 2) * (pw // 2)) % pw == 0:
                c.set(x, y, seam or cols[0])


def _floor(c, y0, y1, vx, cols, seed, rough=0.25, rays=True, spread=1.7, rows=(), line="#0a0506"):
    """floor band with perspective grating lines converging to vx and horizontal seams at `rows`."""
    hband(c, y0, y1, cols, seed=seed, rough=rough)
    if rays:
        for x in range(-120, 320, 16):
            c.line([(vx + (x - vx) * 0.35, y0), (vx + (x - vx) * spread, y1)], line)
    for y in rows:
        c.line([(0, y), (191, y)], line)


def _hood_figure(c, x, y, h, col, rim_col, facing=1, toward=(-1, -1), eye=None, pose="hunch", robe=0.55, lean=None, shadow=None):
    kw = {}
    if lean is not None:
        kw["lean"] = lean
    f = fig(h, pose, col, robe=robe, hood=True, facing=facing, **kw)
    px0, py0 = put_figure(c, f, x, y, rim_col=rim_col, toward=toward, shadow=shadow)
    if eye:
        hx_, hy_ = f["head"]
        c.rect(px0 + int(hx_) + facing, py0 + int(hy_), px0 + int(hx_) + facing * 2, py0 + int(hy_) + 1, eye)
    return f, px0, py0


def _player(c, h, pose, x, y, facing=1, rim_col=None, toward=(-1, -1), shadow=None, legs="#34323c", skin="#d8b48c",
            hair="#2a1e1a", face=True, dim=None, **kw):
    """the route's player (grey coat, brass collar band) with dark trousers, a face patch and hair, so the same person
    reads in every ending.  Returns (figure dict, px0, py0)."""
    f = player_fig("mechanicus", h, pose, facing=facing, **kw)
    if dim:
        f["img"] = tint(f["img"], dim[0], dim[1])
    img = f["img"]
    px = img.load()
    hip_y = img.height - 1 - int(h * 0.5 * 0.9) if pose not in ("kneel", "sit", "lying") else img.height + 1
    for j in range(max(0, hip_y), img.height):
        for i in range(img.width):
            if px[i, j][3] >= 128:
                px[i, j] = C(legs) + (255,)
    hxx, hyy = f["head"]
    r = max(2, int(0.088 * h))
    for j in range(int(hyy) - r, int(hyy) + r + 1):
        for i in range(int(hxx) - r, int(hxx) + r + 1):
            if 0 <= i < img.width and 0 <= j < img.height and px[i, j][3] >= 128:
                if j <= hyy - r * 0.45:
                    px[i, j] = C(hair) + (255,)
                elif face and (i - hxx) * facing >= -r * 0.2:
                    px[i, j] = C(skin) + (255,)
    px0, py0 = put_figure(c, f, x, y, rim_col=rim_col, toward=toward, shadow=shadow)
    return f, px0, py0

# ====================================================================== GOOD

@ending("mech_end_survivor")
def mech_end_survivor(e):
    """GOOD.  Back at the Quota Board: dawn pours through the open side of a half-rebuilt hall; the player stands with
    the menials who lived under the board where every lamp is green; scaffolds, a crane and a girder being carried.
    Bright mass: top-left dawn; the green board on the right wall."""
    c = e.c
    HZ = 70
    # ---- dawn sky, sun low on the left, towers in haze
    sky(c, ["#2c2a4a", "#5a3e62", "#a85a64", "#e08a5a", "#ffc47a"], 0, 66)
    clouds(c, e.seed_for("cl"), ["#4a3458", "#8a4a60", "#c8705a"], 2, 36, scale=0.05, thresh=0.52, stretch=5.0)
    SX, SY = 30, 60
    glow(c, SX, SY, 50, ["#c8603e", "#e8844c", "#ffb468", "#ffd890", "#fff2c0"], power=1.4, strength=1.0, ry=34)
    c.ellipse(SX, SY, 6, 5, "#fffbe8")
    skyline(c, e.seed_for("t1"), HZ - 2, "#a8604e", 12, 8, 24, 3, 9, x0=0, x1=120, win_p=0.0, tips=0.2)
    skyline(c, e.seed_for("t2"), HZ, "#5c2e3a", 9, 10, 32, 4, 9, x0=0, x1=120, win_p=0.04, tips=0.5)
    haze(c, HZ - 20, HZ + 2, "#ff9a62", t=0.42, seed=e.seed_for("hz"), profile="mid")
    # ---- the intact hall: right wall, lit from the left
    PX = 112
    _plates(c, PX, 0, 191, HZ, ["#24140e", "#3e2418", "#5e3a28", "#8a5a38", "#b8844c"], e.seed_for("wall"), pw=22, ph=16,
            seam="#1a0e08", tfn=lambda x, y: 0.72 - (x - PX) / 80.0 * 0.40 - y / 150.0 * 0.12)
    c.rect(PX, 0, PX + 3, HZ, "#24140e")                                  # pillar
    c.rect(PX, 0, PX, HZ, "#e0a868")
    c.rect(PX + 1, 0, PX + 1, HZ, "#a8744a")
    # roof beam, broken off toward the dawn
    for x in range(52, 192):
        top = 0
        bot = 5 + (1 if x > 90 else 0)
        c.rect(x, top, x, bot, "#2a1a12")
        c.set(x, bot, "#8a5a38")
    for (x0, y0, x1, y1) in [(52, 0, 46, 11), (60, 0, 72, 14), (78, 5, 70, 20)]:  # torn truss ends
        c.line([(x0, y0), (x1, y1)], "#2a1a12", 2)
    # the board
    BX0, BY0, BX1, BY1 = 126, 10, 186, 58
    c.rect(BX0 - 2, BY0 - 2, BX1 + 2, BY1 + 2, "#e0b868")
    c.rect(BX0 - 1, BY0 - 1, BX1 + 1, BY1 + 1, "#7a5026")
    c.rect(BX0, BY0, BX1, BY1, "#16100c")
    _leds(c, BX0 + 4, BY0 + 5, 12, 7, 5, 6, "#5ee082", "#1c2a1e", seed=e.seed_for("led"), p_on=1.0, w=3, h=2,
          bright="#c8ffd0", p_bright=0.18)
    c.rect(BX0 + 3, BY0 + 2, BX1 - 3, BY0 + 2, "#e0b868")                 # header bar
    c.rect(BX0 + 3, BY1 - 5, BX0 + 21, BY1 - 3, "#c8ffd0")               # the player's own row, bright
    c.rect(BX0 + 24, BY1 - 5, BX1 - 3, BY1 - 3, "#5ee082")
    light_pool(c, 156, 34, 44, 34, "#7af0a0", t=0.16)
    e.protect += ["#c8ffd0", "#5ee082"]
    # ---- floor: sunlit plates running out to the dawn, rubble heaps in silhouette on the left
    _floor(c, HZ + 1, 107, 40, ["#c88a5c", "#8a5a3c", "#5a3828", "#2e1c16"], e.seed_for("fl"), rough=0.3, line="#4a2c20",
           rows=(80, 90, 102))
    ridge(c, HZ + 4, 2, 7, "#3a2220", seed=e.seed_for("rub"), x0=0, x1=108, fill_to=HZ + 6, lite="#e89a62")
    light_pool(c, 60, HZ + 12, 90, 11, "#ffc880", t=0.45)
    light_pool(c, 110, HZ + 20, 70, 14, "#ffb868", t=0.2)
    shafts(c, (SX, SY - 4), 30, 40, 7, 190, "#ffc888", t=0.22, seed=e.seed_for("sh"), w0=3, w1=16, power=0.55, floor=106)
    # ---- scaffold with menials welding
    for px_ in (10, 32, 56, 76):
        c.rect(px_, 24, px_ + 1, HZ + 6, "#3a2218")
        c.rect(px_, 24, px_, HZ + 6, "#f0b878")
    for py_ in (36, 54):
        c.rect(8, py_, 80, py_ + 1, "#3a2218")
        c.rect(8, py_, 80, py_, "#f0b878")
    for (x0, y0, x1, y1) in [(10, 36, 32, 54), (32, 36, 56, 54), (56, 54, 76, 36)]:
        c.line([(x0, y0), (x1, y1)], "#5a3826")
    for (x, y, h_, pz) in [(22, 36, 12, "stand"), (46, 54, 13, "stand"), (66, 54, 12, "carry")]:
        f = fig(h_, pz, "#3a2218", facing=1)
        put_figure(c, f, x, y, rim_col="#ffd8a0", toward=(-1, -1))
    for (sx_, sy_) in [(52, 53), (53, 52), (50, 54), (55, 54)]:           # weld sparks
        c.set(sx_, sy_, "#fff6d8")
    c.set(52, 54, "#a8e8ff")
    c.set(51, 53, "#ffffff"); c.set(53, 55, "#d8f0ff")
    # crane jib and a girder in the air
    c.line([(0, 10), (96, 24)], "#3a2218", 2)
    c.line([(0, 8), (96, 22)], "#f0b878")
    c.line([(90, 24), (88, 42)], "#3a2218")
    c.line([(96, 24), (96, 42)], "#3a2218")
    c.rect(84, 42, 108, 44, "#4a2c1e")
    c.rect(84, 42, 108, 42, "#f0b878")
    # ---- foreground group, back-lit by the dawn from the left
    shd = dict(toward_light=(-1, 0.35), length=1.25, squash=0.34, col="#6a3426", t=0.55)
    me, _, _ = _player(c, 40, "stand", 128, 101, facing=1, rim_col="#fff0c0", toward=(-1, -1), shadow=shd)
    for (ox, oy, f_h, col_, pz) in [(146, 100, 36, "#5a4638", "stand"), (163, 99, 33, "#7a5a40", "stand"), (178, 98, 30, "#463a32", "stand")]:
        f = fig(f_h, pz, col_, facing=1, robe=0.25)
        put_figure(c, f, ox, oy, rim_col="#ffe0a8", toward=(-1, -1), shadow=shd)
    for ox in (146, 163, 178):                                            # board-green on the tops of their heads
        pass
    # carriers in front, left: a girder on two pairs of shoulders
    a = fig(30, "carry", "#3a2218", facing=1)
    b = fig(27, "carry", "#4a2c20", facing=1)
    put_figure(c, a, 20, 97, rim_col="#ffd8a0", toward=(-1, -1), shadow=shd)
    put_figure(c, b, 60, 100, rim_col="#ffd8a0", toward=(-1, -1), shadow=shd)
    c.line([(14, 80), (66, 79)], "#2a180f", 3)
    c.line([(14, 78), (66, 77)], "#ffd8a0")
    # a stack of salvaged plates
    for k in range(4):
        c.rect(84, 101 - k * 3, 106 - k * 2, 103 - k * 3, "#6a4430")
        c.rect(84, 101 - k * 3, 106 - k * 2, 101 - k * 3, "#f0c088")
    particles(c, "mote", 55, (0, 14, 130, 100), seed=e.seed_for("mote"), cols=("#fff0c8", "#ffe0a0"))
    vignette_kind(c, "good", strength=0.5)


@ending("mech_end_keeper")
def mech_end_keeper(e):
    """GOOD.  Keeper of the Seventh Furnace: a calm morning in the forge hall; light falls from a round skylight at the
    top right; the reactor drum glows gently; the keeper oils a conveyor while menials eat their first meal beside it
    and a servitor wears a flower.  Bright mass: top-right skylight and the amber sight-glass."""
    c = e.c
    FL = 72
    _plates(c, 0, 0, 191, FL, ["#22150f", "#40261a", "#68402a", "#946040", "#c48c54"], e.seed_for("wall"), pw=24, ph=18,
            seam="#1a0e09", tfn=lambda x, y: 0.2 + (x / 191.0) * 0.36 + (1 - y / float(FL)) * 0.14)
    # ceiling girders
    c.rect(0, 0, 191, 4, "#160d09")
    c.rect(0, 5, 191, 5, "#6a4630")
    for x in range(20, 192, 46):
        c.rect(x, 0, x + 3, 10, "#160d09")
        c.rect(x, 5, x, 10, "#6a4630")
    # round skylight, top right
    SX, SY = 150, 7
    glow(c, SX, SY + 6, 52, ["#6a4630", "#9a6a3e", "#d09a56", "#f4cc84", "#fff0c0"], power=1.4, strength=1.0, ry=34)
    c.ellipse(SX, SY, 15, 8, "#2a1810")
    c.ellipse(SX, SY, 13, 6, "#fff4cc")
    c.ellipse(SX, SY + 1, 8, 4, "#ffffff")
    for k in range(-14, 15, 4):                                           # skylight frame bars
        c.line([(SX + k, SY - 7), (SX + k * 0.6, SY + 7)], "#2a1810")
    shafts(c, (SX - 6, SY + 3), 112, 26, 7, 120, "#ffe4a0", t=0.36, seed=e.seed_for("sh"), w0=3, w1=15, power=0.45, floor=104)
    # floor
    _floor(c, FL + 1, 107, 96, ["#8a5c3a", "#5e3c28", "#3c261a", "#24160f"], e.seed_for("fl"), rough=0.3, line="#2a1a12",
           rows=(80, 90, 102), spread=1.3)
    light_pool(c, 98, FL + 14, 70, 14, "#ffd890", t=0.5)
    light_pool(c, 96, FL + 6, 38, 5, "#fff0c0", t=0.4)
    c.rect(0, FL, 191, FL, "#1a0e09")
    # ---- the reactor drum, left centre; lit from the right
    RX0, RX1, RY0, RY1 = 18, 72, 20, FL
    for y in range(RY0, RY1 + 1):
        for x in range(RX0, RX1 + 1):
            u = (x - RX0) / float(RX1 - RX0)
            t = clamp(0.1 + u * 0.8 + (0.06 if (y // 3) % 2 else 0) - 0.2 * ((y - RY0) / 60.0))
            c.set(x, y, ramp_pick(["#26160f", "#4a2c1c", "#80522e", "#b8843e", "#e8b868", "#ffe0a0"], t, x, y))
    for by in (30, 44, 60):                                               # bolted bands
        c.rect(RX0 - 2, by, RX1 + 2, by + 3, "#1a0e09")
        c.rect(RX0 - 2, by, RX1 + 2, by, "#c89a50")
        for bx in range(RX0, RX1, 7):
            c.set(bx, by + 2, "#e8c070")
    # cap with a plain cog
    c.rect(RX0 + 4, RY0 - 6, RX1 - 4, RY0, "#4a2c1c")
    c.rect(RX0 + 4, RY0 - 6, RX1 - 4, RY0 - 6, "#e8b868")
    _gear(c, 45, RY0 - 9, 10, 8, "#2a1a10", hole=0.45, hole_col="#80522e", hub="#e8c070")
    # sight glass
    GX, GY = 48, 45
    c.ellipse(GX, GY, 11, 11, "#1a0e09")
    c.ellipse(GX, GY, 10, 10, "#c89a50")
    c.ellipse(GX, GY, 8, 8, "#2a1608")
    glow(c, GX, GY, 8, ["#8a5a1e", "#d0903a", "#ffc860", "#ffe8a8", "#ffffff"], power=1.0, strength=1.2)
    light_pool(c, GX, GY + 10, 34, 24, "#ffc860", t=0.2)
    # pipes
    for px_ in (10, 76, 82):
        c.rect(px_, 0, px_ + 3, FL, "#1c100b")
        c.rect(px_ + 2, 0, px_ + 3, FL, "#946040")
        c.rect(px_ + 3, 0, px_ + 3, FL, "#e0aa64")
    # steam from the cap vent, drifting left
    sn = e.noise("steam")
    for y in range(0, 20):
        for x in range(14, 60):
            dx = x - (44 - (20 - y) * 0.5 + math.sin(y * 0.4) * 2)
            if abs(dx) < 3 + (20 - y) * 0.45 and sn.fbm(x * 0.3, y * 0.25, 2) > 0.40:
                blend(c, x, y, "#fff0d0", 0.55 * (1 - (20 - y) / 26.0) + 0.15, 3)
    # ---- the conveyor in front
    BY = 84
    c.rect(66, BY, 191, BY + 6, "#1a0e09")
    c.rect(66, BY, 191, BY, "#e0aa64")
    c.rect(66, BY + 1, 191, BY + 1, "#8a5c3a")
    for x in range(70, 191, 8):
        c.ellipse(x, BY + 9, 2, 2, "#3a2418")
        c.set(x, BY + 8, "#c89a50")
    for x in (80, 130, 180):
        c.rect(x, BY + 7, x + 2, 106, "#1a0e09")
        c.set(x + 2, BY + 20, "#c89a50")
    rr = e.rng("ore")
    for x in (92, 108, 146, 160):
        h_ = rr.randint(3, 5)
        c.rect(x, BY - h_, x + 5, BY - 1, "#3a2418")
        c.rect(x, BY - h_, x + 5, BY - h_, "#c89a50")
        c.set(x + 1, BY - h_ + 1, "#e8c070")
    # ---- the keeper, oil can in hand, at the belt
    shd = dict(toward_light=(1, 0.3), length=1.0, squash=0.3, col="#2a160e", t=0.55)
    me, mpx, mpy = _player(c, 40, "reach", 124, BY - 1, facing=-1, rim_col="#ffe4a0", toward=(1, -1), shadow=shd, lean=14)
    hx_, hy_ = me["hands"][0]
    ox_, oy_ = mpx + int(hx_), mpy + int(hy_)
    c.rect(ox_ - 5, oy_ - 2, ox_ - 1, oy_ + 1, "#e8b868")                 # the oil can
    c.rect(ox_ - 5, oy_ - 2, ox_ - 1, oy_ - 2, "#fff0c0")
    c.line([(ox_ - 5, oy_ - 1), (ox_ - 10, oy_ + 4)], "#e8b868")
    for (dx_, dy_) in [(-10, 6), (-10, 9), (-9, 12)]:                      # drops falling onto the roller
        c.set(ox_ + dx_, oy_ + dy_, "#fff0c0")
    # ---- menials eating, sitting on crates, right
    for (x, y, h_, fc) in [(158, 76, 24, -1), (176, 77, 22, -1)]:
        c.rect(x - 8, y - 3, x + 8, y + 5, "#3a2418")
        c.rect(x - 8, y - 3, x + 8, y - 3, "#e0aa64")
        f = fig(h_ + 4, "sit", "#4a3022", facing=fc)
        px0, py0 = put_figure(c, f, x, y - 3, rim_col="#ffe4a0", toward=(1, -1), shadow=shd)
        mx, my = px0 + int(f["hands"][0][0]), py0 + int(f["hands"][0][1])
        c.rect(mx - 2, my - 3, mx, my, "#f4e8cc")
        glow(c, mx - 4, my - 7, 3, ["#e8c898", "#fff0d8"], power=1.0, strength=1.0)
    # ---- a servitor with a flower behind the ear, at the foot of the reactor
    sf = fig(36, "stand", "#6e6e78", robe=0.0, facing=1)
    spx, spy = put_figure(c, sf, 34, 98, rim_col="#ffe4a0", toward=(1, -1), shadow=shd)
    hx_, hy_ = sf["head"]
    c.rect(spx + int(hx_) - 2, spy + int(hy_) - 1, spx + int(hx_) + 1, spy + int(hy_) + 1, "#9a9aa4")
    c.set(spx + int(hx_) + 1, spy + int(hy_), "#4af0a0")
    c.rect(spx + int(hx_) - 4, spy + int(hy_) - 4, spx + int(hx_) - 2, spy + int(hy_) - 2, "#fff6d8")   # the flower
    c.set(spx + int(hx_) - 3, spy + int(hy_) - 3, "#ffc040")
    c.line([(spx + int(hx_) - 3, spy + int(hy_) - 1), (spx + int(hx_) - 3, spy + int(hy_) + 4)], "#5ea03a")
    particles(c, "mote", 42, (40, 10, 190, 100), seed=e.seed_for("mote"), cols=("#ffe8b0", "#fff6d8"))
    vignette_kind(c, "good", strength=0.5)


@ending("mech_end_magos")
def mech_end_magos(e):
    """GOOD.  The Magos With a Heart: thirty years on, the player in a red robe with little brass stands on the dais at the
    head of the conversion line, backlit by a vast amber round window, a warm light where the chest would be;
    the queue of menials below includes a child counting on raised fingers and one singing four notes; the old conversion
    rig hangs dark and idle at the left.  Bright mass: centre-right window, low reflection on the floor."""
    c = e.c
    FL = 80
    # maroon wall, brass-lit
    _plates(c, 0, 0, 191, FL, ["#3a1416", "#5e2422", "#8a3c2e", "#bc5c38", "#ee9a50"], e.seed_for("wall"), pw=26, ph=20,
            seam="#24100f", tfn=lambda x, y: 0.7 - abs(x - 134) / 191.0 * 0.55 + (1 - y / 80.0) * 0.1, grain=0.3)
    # the big round window, a plain cog ring around it
    WX, WY, WR = 134, 32, 27
    glow(c, WX, WY, 84, ["#8a3c2e", "#bc5c38", "#e08040", "#f8b058", "#ffd88a"], power=1.3, strength=1.0, ry=62)
    _gear(c, WX, WY, WR + 6, 16, "#1e0a0c", tooth=0.12)
    c.ellipse(WX, WY, WR + 1, WR + 1, "#c8923e")
    c.ellipse(WX, WY, WR - 1, WR - 1, "#2a1008")
    for y in range(WY - WR, WY + WR + 1):
        for x in range(WX - WR, WX + WR + 1):
            d = math.hypot(x - WX, y - WY)
            if d < WR - 2:
                c.set(x, y, ramp_pick(["#e07a30", "#f8a640", "#ffcf70", "#ffeeb0", "#ffffff"], 1.0 - d / float(WR) * 0.95, x, y))
    for k in range(8):                                                    # spokes
        a = k * math.pi / 8
        c.line([(WX - math.cos(a) * WR, WY - math.sin(a) * WR), (WX + math.cos(a) * WR, WY + math.sin(a) * WR)], "#6e3a1c")
    c.ellipse(WX, WY, 4, 4, "#8a4a22")
    shafts(c, (WX, WY + 10), 90, 60, 8, 90, "#ffd078", t=0.3, seed=e.seed_for("sh"), w0=4, w1=18, power=0.5, floor=106)
    # floor, polished red-black, the window reflected
    _floor(c, FL + 1, 107, WX, ["#a85a38", "#7a3a2a", "#4a1e1e", "#2a1012"], e.seed_for("fl"), rough=0.2, line="#1a080c",
           rows=(88, 98), spread=1.5)
    for y in range(FL + 1, 107):                                           # reflection column of the window
        k = (y - FL) / 26.0
        hw = int(WR * (1 - k * 0.5))
        for x in range(WX - hw, WX + hw + 1):
            blend(c, x, y, "#ffb858", 0.55 * (1 - k) if (x + y) % 2 == 0 else 0.3 * (1 - k), 3)
    c.rect(0, FL, 191, FL, "#1a080c")
    # the idle conversion rig, left: a dark gantry with hanging arms and hooks, lamps dead but one green
    for rx in (12, 44):
        c.rect(rx, 0, rx + 5, FL, "#1a080c")
        c.rect(rx + 5, 0, rx + 5, FL, "#c8743c")
    c.rect(0, 16, 62, 21, "#1a080c")
    c.rect(0, 16, 62, 16, "#c8743c")
    for ax in (20, 30, 52):
        c.line([(ax, 21), (ax + 2, 40)], "#1a080c", 2)
        c.line([(ax + 2, 40), (ax - 3, 52)], "#1a080c", 2)
        c.rect(ax - 5, 52, ax - 2, 54, "#1a080c")
        c.set(ax - 3, 52, "#c8743c")
    for hx_ in (24, 38, 47):
        c.line([(hx_, 21), (hx_, 36)], "#3a1416")
        c.set(hx_, 37, "#8a5a38")
    _leds(c, 4, 26, 6, 2, 8, 6, "#8a1e1a", "#2a0e12", seed=e.seed_for("rl"), p_on=0.0, w=2, h=1)
    c.rect(20, 28, 22, 29, "#5ee082")                                      # the one lamp that is green: the rig is off
    # ---- the dais and the Magos
    c.rect(106, FL - 2, 164, FL + 6, "#2a0e12")
    c.rect(106, FL - 2, 164, FL - 2, "#d89a4c")
    c.rect(106, FL + 6, 164, FL + 6, "#6e2a26")
    mg = fig(58, "stand", "#7a1e1e", robe=0.92, facing=-1, thick=1.05)
    mpx, mpy = put_figure(c, mg, 136, FL - 2, rim_col="#ffd078", toward=(1, -1), shadow=dict(toward_light=(0, 1), length=0.0, squash=0.5, col="#1a080c", t=0.5))
    hx_, hy_ = mg["head"]
    hxp, hyp = mpx + int(hx_), mpy + int(hy_)
    c.rect(hxp - 3, hyp - 3, hxp + 2, hyp + 3, "#d8b08c")                  # a human face, not a mask
    c.rect(hxp - 3, hyp - 3, hxp + 2, hyp - 2, "#2a1e1a")
    c.set(hxp - 2, hyp, "#2a1e1a")
    c.rect(hxp - 4, hyp + 4, hxp + 3, hyp + 5, "#d8a24c")                  # a little brass collar
    # the heart: warm light in the chest, lighting the robe around it
    cx_, cy_ = hxp + 1, hyp + 12
    glow(c, cx_, cy_, 11, ["#9a3a2a", "#d8603a", "#ffa850", "#ffe090", "#ffffff"], power=1.1, strength=1.1)
    c.set(cx_, cy_, "#ffffff")
    e.protect += ["#ffe090"]
    # a slate in the raised hand with one bright line
    sx0, sy0 = mpx + int(mg["hands"][0][0]), mpy + int(mg["hands"][0][1])
    c.rect(sx0 - 6, sy0 - 4, sx0 - 1, sy0 + 1, "#1e0a0c")
    c.rect(sx0 - 5, sy0 - 3, sx0 - 2, sy0 - 3, "#ffe090")
    c.rect(sx0 - 5, sy0 - 1, sx0 - 3, sy0 - 1, "#ffe090")
    # ---- the line of menials, getting bigger toward the viewer, all facing the Magos
    shd = dict(toward_light=(0.2, 1.0), length=0.2, squash=0.5, col="#1a080c", t=0.6)
    qs = [(26, 106, 50, "stand"), (56, 101, 44, "stand"), (84, 96, 38, "stand"), (106, 92, 32, "stand")]
    for (x, y, h_, pz) in qs:
        f = fig(h_, pz, "#2a1214", facing=1)
        put_figure(c, f, x, y, rim_col="#ffc070", toward=(1, -1), shadow=shd)
    ch = fig(22, "arms_up", "#2a1214", facing=1)                           # a child, counting aloud on raised fingers
    cpx, cpy = put_figure(c, ch, 124, 90, rim_col="#ffc070", toward=(1, -1), shadow=shd)
    for k in range(3):
        c.set(cpx + int(ch["hands"][0][0]) + k - 1, cpy + int(ch["hands"][0][1]) - 2, "#ffe090")
    # the singer: a note-line over the third menial's head
    _notes(c, 82, 52, "#ffe090")
    e.protect += ["#ffe090"]
    particles(c, "mote", 46, (30, 10, 191, 100), seed=e.seed_for("mote"), cols=("#ffe090", "#fff0c0"))
    vignette_kind(c, "good", strength=0.4)


@ending("mech_end_explorator")
def mech_end_explorator(e):
    """GOOD.  Seeker Among the Stars: an explorator ship under sail, red hull and a big plain flywheel, heading into a vast
    amber nebula toward the bright waypoint; the route is a dotted line on the sky, tombs and fragments float ahead as
    small dark shapes; a lit dome on the hull holds a tiny watcher.  Bright mass: top-right nebula, far from the ship."""
    c = e.c
    n, n2 = e.noise("neb"), e.noise("neb2")
    NX, NY = 156, 34
    ramp_n = ["#06040e", "#1a0c38", "#44206a", "#8a3a78", "#d0605a", "#f8a050", "#ffd890", "#fff4d0"]
    for y in range(108):
        for x in range(192):
            d = math.hypot((x - NX) / 130.0, (y - NY) / 80.0)
            v = n.fbm(x * 0.028, y * 0.05, 4)
            t = clamp((1.0 - d) * 1.12 + (v - 0.5) * 0.85 - 0.04)
            lane = n2.fbm(x * 0.05 + 3, y * 0.11, 3)
            if lane > 0.58 and d < 0.9:
                t *= 0.55                                              # dust lanes
            c.set(x, y, ramp_pick(ramp_n, t, x, y))
    stars(c, e.seed_for("st"), 90, 0, 107, cols=("#8a8aa8", "#d8d8f0", "#ffffff"))
    # the waypoint: a hard star with a cross of light
    glow(c, NX + 4, NY - 2, 16, ["#f8c070", "#ffe0a0", "#fff4d0", "#ffffff"], power=1.1, strength=1.2)
    for k in range(1, 30):
        t = 1 - k / 30.0
        for (dx, dy) in ((k, 0), (-k, 0)):
            blend(c, NX + 4 + dx, NY - 2, "#ffffff", 0.9 * t, 3)
        for (dx, dy) in ((0, k // 2), (0, -k // 2)):
            blend(c, NX + 4, NY - 2 + dy, "#ffffff", 0.8 * t, 3)
    c.set(NX + 4, NY - 2, "#ffffff")
    # tombs and fragments, far: small dark shards with a lit top edge
    rr = e.rng("shards")
    for (x, y, w, h) in [(120, 22, 5, 7), (134, 50, 4, 5), (176, 18, 6, 8), (182, 62, 4, 6), (108, 44, 3, 4), (166, 76, 5, 5), (146, 14, 3, 4)]:
        c.poly([(x, y + h), (x + w // 2, y), (x + w, y + h)], "#1a0c26")
        c.line([(x, y + h), (x + w // 2, y)], "#f0a860")
    # the route: dotted gold arc from the bow to the waypoint, ticks at the legs
    for i in range(0, 61):
        t = i / 60.0
        x = 128 + (NX - 128 + 4) * t
        y = 70 + (NY - 2 - 70) * t - math.sin(t * math.pi) * 14
        if i % 3 == 0:
            c.set(x, y, "#ffe0a0")
        if i % 15 == 0:
            c.rect(x - 1, y - 1, x + 1, y + 1, "#fff6d8")
    # ---- the ship: engines left, bow right; lit from the nebula at top right
    HULL, HI, SH = "#3e1620", "#e8904c", "#1c0810"
    c.poly([(26, 66), (104, 61), (130, 71), (104, 80), (26, 79)], HULL)
    c.poly([(40, 79), (108, 79), (122, 73), (60, 84)], SH)
    c.poly([(36, 61), (100, 57), (104, 61), (30, 64)], "#52202a")           # upper deck
    c.line([(26, 66), (104, 61), (130, 71)], HI)
    c.line([(36, 61), (100, 57), (104, 61)], "#f8b868")
    for (x0, x1, y0) in [(44, 58, 53), (64, 74, 50), (96, 106, 54)]:        # blocky superstructure
        c.rect(x0, y0, x1, 61, "#52202a")
        c.rect(x0, y0, x1, y0, "#f8b868")
        c.rect(x1, y0, x1, 61, "#1c0810")
    c.rect(69, 38, 70, 50, "#52202a")                                      # spire + antenna
    c.set(69, 37, "#fff0c0")
    c.line([(69, 44), (62, 41)], "#52202a")
    c.line([(70, 42), (77, 40)], "#52202a")
    # the flywheel: a big plain cog standing proud of the hull amidships
    _gear(c, 84, 66, 15, 14, "#2a0e16", hole=0.62, hole_col="#3e1620", rot=0.1, tooth=0.14, hub="#e8904c")
    for k in range(6):
        a = k * math.pi / 3 + 0.3
        c.line([(84, 66), (84 + math.cos(a) * 9, 66 + math.sin(a) * 9)], "#2a0e16")
    for y in range(52, 67):                                                # the cog's lit rim (toward the nebula)
        for x in range(70, 100):
            if 13.0 < math.hypot(x - 84, y - 66) < 15.3 and (x - 84) + (66 - y) > 4:
                c.set(x, y, "#f8b868")
    # window rows
    for x in range(34, 118, 4):
        c.set(x, 71, "#ffd070")
        if x % 8 == 2:
            c.set(x, 75, "#ffd070")
    # prow lamp
    c.set(128, 71, "#fff6d8")
    glow(c, 128, 71, 5, ["#c8602a", "#ffd070", "#ffffff"], power=1.0, strength=1.0)
    # engines + a long orange exhaust
    for (ey_, eh) in ((64, 3), (70, 3), (76, 3)):
        c.rect(22, ey_, 27, ey_ + eh, "#1c0810")
        c.rect(22, ey_, 22, ey_ + eh, "#8a3a2a")
    glow(c, 10, 71, 30, ["#3a1030", "#8a2a3a", "#e0603a", "#ffb060", "#fff0c0"], power=1.2, strength=1.1, ry=9)
    for k in range(3):
        c.rect(4, 65 + k * 6, 22, 66 + k * 6, "#ffd890")
    # the dome with a watcher
    c.ellipse(112, 59, 5, 4, "#1c0810")
    c.ellipse(112, 59, 4, 3, "#ffd078")
    wf = fig(6, "stand", "#2a1010", facing=1)
    place(c, wf["img"], 112, 61, anchor="bm")
    # foreground: a second, smaller ship far below left, and debris
    c.poly([(150, 94), (176, 91), (184, 94), (176, 97), (150, 97)], "#1a0a1c")
    c.line([(150, 94), (176, 91), (184, 94)], "#c8603a")
    for x in range(154, 178, 5):
        c.set(x, 95, "#ffb050")
    particles(c, "mote", 30, (0, 0, 191, 107), seed=e.seed_for("dust"), cols=("#ffe0a0", "#fff6d8"))
    vignette_kind(c, "good", strength=0.3)


# ====================================================================== BAD

def _flower(c, x, y, r, col_out, col_in, centre, rot=0.0, n=8, stem=None, stem_col="#1a2208"):
    """a rust blossom: n plain petals round a centre; optional stem down to `stem` (y)."""
    if stem is not None:
        c.line([(x, y), (x + 1, (y + stem) / 2), (x, stem)], stem_col)
    for i in range(n):
        a = rot + 2 * math.pi * i / n
        px_, py_ = x + math.cos(a) * r * 0.62, y + math.sin(a) * r * 0.62 * 0.8
        c.ellipse(px_, py_, max(1, r * 0.42), max(1, r * 0.34), col_out)
    for i in range(n):
        a = rot + math.pi / n + 2 * math.pi * i / n
        c.ellipse(x + math.cos(a) * r * 0.38, y + math.sin(a) * r * 0.38 * 0.8, max(1, r * 0.3), max(1, r * 0.24), col_in)
    c.ellipse(x, y, max(1, r * 0.26), max(1, r * 0.22), centre)


@ending("mech_end_claim_khorne")
def mech_end_claim_khorne(e):
    """BAD / Khorne.  Test-Fire: a firing range under a low red sun; the player, a cannon welded where the hand was,
    fires down a line of targets that starts as steel plates and ends as standing people, black against the sun.
    Bright mass: low right, the red sun; the muzzle flash on the left answers it."""
    c = e.c
    HZ = 62
    sky(c, ["#14030a", "#34060e", "#6e1410", "#b8321a", "#e8701e", "#ffb446"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#220509", "#460a10", "#7a1812"], 0, 46, scale=0.05, thresh=0.5, stretch=5.5)
    SX, SY = 150, 64
    glow(c, SX, SY, 78, ["#521010", "#8a1e12", "#c8441c", "#ec8a2c", "#ffc060", "#fff0b0"], power=1.25, strength=1.0, ry=46)
    disc(c, SX, SY, 22, ["#d8501c", "#f08a2c", "#ffc060", "#fff0b0"], light=(0.0, -0.2), seed=e.seed_for("sun"))
    shafts(c, (SX, SY), 270, 90, 9, 80, "#ffb040", t=0.20, seed=e.seed_for("sh"), w0=3, w1=14, power=0.7, floor=HZ)
    # far smoke stacks of the range
    for (x, h_) in [(18, 22), (44, 14), (96, 12)]:
        c.rect(x, HZ - h_, x + 3, HZ, "#2a060c")
        c.rect(x - 1, HZ - h_, x + 4, HZ - h_, "#521010")
    ridge(c, HZ + 2, 2, 6, "#3a0a0e", seed=e.seed_for("rg"), fill_to=HZ + 8, lite="#c8441c")
    # ground
    hband(c, HZ + 1, 107, ["#b8321a", "#7a1a12", "#44100e", "#1c060a"], seed=e.seed_for("gr"), rough=0.35)
    light_pool(c, SX, HZ + 6, 74, 8, "#ffc060", t=0.55)
    light_pool(c, SX - 10, HZ + 12, 56, 10, "#e8701e", t=0.35)
    for k in range(-6, 12):
        c.line([(SX + k * 3, HZ + 1), (SX + k * 30 - 40, 107)], "#34090c")
    # target line: two steel plates near, then people receding into the sun
    sh = dict(toward_light=(0.9, 1.0), length=1.6, squash=0.5, col="#1a050a", t=0.55)
    for (x, y, w_, h_) in [(62, 100, 20, 26), (88, 90, 14, 19)]:
        c.rect(x - 1, y - h_ - 8, x, y, "#14040a")                           # post
        c.rect(x - w_ // 2, y - h_ - 8, x + w_ // 2, y - 8, "#2a0c10")
        c.rect(x - w_ // 2, y - h_ - 8, x - w_ // 2, y - 8, "#7a1a12")
        c.rect(x + w_ // 2, y - h_ - 8, x + w_ // 2, y - 8, "#ec8a2c")
        c.rect(x - w_ // 2, y - h_ - 8, x + w_ // 2, y - h_ - 8, "#ec8a2c")
    c.ellipse(86, 72, 2, 2, "#ffc060")                                       # a hole punched through: sun in it
    c.ellipse(62, 76, 3, 3, "#ffc060")
    for (x, y, h_, pz, fc) in [(108, 86, 30, "stand", -1), (121, 81, 26, "arms_up", -1), (132, 78, 23, "stand", -1),
                               (141, 76, 21, "stand", -1), (149, 74, 19, "arms_up", -1), (156, 73, 17, "stand", -1),
                               (162, 72, 15, "stand", -1), (168, 71, 14, "arms_up", -1), (173, 70, 13, "stand", -1),
                               (178, 70, 12, "stand", -1), (183, 69, 11, "stand", -1)]:
        f = fig(h_, pz, "#10030a", facing=fc)
        put_figure(c, f, x, y, rim_col="#ffc060", toward=(1, -1), shadow=sh)
    # the player, big in the near ground, back-lit, cannon where the hand was
    me = player_fig("mechanicus", 66, "reach", facing=1, lean=10)
    img = tint(me["img"], "#12040a", 0.82)
    img = rim(img, "#ff9a3a", (1, -1), min_run=2)
    img = rim(img, "#ffc060", (0, -1), min_run=2)
    mpx, mpy = 24, 108 - img.height
    cast_shadow(c, me["img"], mpx + me["feet"][0], 104, origin=me["feet"], toward_light=(0.9, 1.0), length=1.4, squash=0.5, col="#1a050a", t=0.6)
    place(c, img, mpx, mpy, anchor="tl")
    hxx, hyy = mpx + int(me["hands"][0][0]), mpy + int(me["hands"][0][1])
    c.rect(hxx - 3, hyy - 2, hxx + 24, hyy + 1, "#10030a")                   # barrel
    c.rect(hxx + 6, hyy - 3, hxx + 12, hyy + 2, "#10030a")
    c.rect(hxx - 3, hyy - 3, hxx + 24, hyy - 3, "#ff9a3a")
    for k in range(0, 8, 2):                                                  # tools welded on: stubs along the forearm
        c.rect(hxx - 8 - k, hyy - 4 - (k % 4) // 2, hxx - 7 - k, hyy - 2, "#10030a")
    MX, MY = hxx + 27, hyy - 1
    glow(c, MX, MY, 9, ["#c8441c", "#ec8a2c", "#ffc060", "#fff0b0", "#ffffff"], power=0.9, strength=1.2)
    for (dx, dy) in [(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)]:
        for k in range(3, 9 if dx == 0 or dy == 0 else 6):
            blend(c, MX + dx * k, MY + dy * k, "#fff0b0", 0.9 - k * 0.09, 3)
    for k in range(0, 66, 4):                                                 # tracer along the line
        c.set(MX + 8 + k * 1.55, MY - k * 0.02 + 2 * math.sin(k), "#ffc060")
    particles(c, "ember", 70, (8, 20, 190, 105), seed=e.seed_for("em"), cols=("#ffb040", "#ff6a2a", "#ffe08a"))
    for (x, y) in [(34, 103), (40, 105), (46, 102), (54, 106)]:               # brass casings
        c.rect(x, y, x + 1, y, "#ffc060")
    vignette_kind(c, "bad", col="#100206", strength=0.55)


@ending("mech_end_claim_nurgle")
def mech_end_claim_nurgle(e):
    """BAD / Nurgle.  Rust Blossoms: the Seventh Furnace gone to garden; broken roof lets sick green-gold light in from the
    upper left; servitors hum among orange rust flowers; the dropped oil can has a flower growing out of its spout and
    flies hang in the air; the player sits slack on a crate, a bloom at the shoulder.  Bright mass: top-left, low-left."""
    c = e.c
    FL = 74
    R = GOD["nurgle"]["ramp"]
    n = e.noise("wall")
    for y in range(FL + 1):
        for x in range(192):
            t = clamp(0.32 + (n.fbm(x * 0.05, y * 0.07, 3) - 0.5) * 0.7 + (0.08 if (x // 24 + y // 18) % 2 else 0)
                      - abs(x - 40) / 191.0 * 0.15)
            c.set(x, y, ramp_pick(["#0a1006", "#1a2410", "#2e3c16", "#4a5a22", "#7a8a30"], t, x, y))
            if x % 24 == 0 or y % 18 == 0:
                c.set(x, y, "#0a1006")
    # the broken roof: a hole at the top left, sickly light
    for y in range(0, 36):
        for x in range(0, 78):
            d = math.hypot((x - 24) / 40.0, (y - 0) / 26.0)
            if d < 1.0 + (n.fbm(x * 0.2, y * 0.2, 2) - 0.5) * 0.5:
                c.set(x, y, ramp_pick(["#8a9a3a", "#c0cc5c", "#e8f08a", "#fffcc8"], 1 - d * 0.9, x, y))
    for (x0, y0, x1, y1) in [(0, 30, 28, 22), (28, 22, 44, 6), (60, 0, 54, 14), (14, 0, 20, 18)]:        # torn beams
        c.line([(x0, y0), (x1, y1)], "#0a1006", 2)
    shafts(c, (24, 12), 62, 46, 8, 120, "#e8f08a", t=0.3, seed=e.seed_for("sh"), w0=3, w1=15, power=0.5, floor=104)
    # the cold furnace mouth, right-centre: an arch fur-coated with moss and rust
    for y in range(26, FL + 1):
        for x in range(112, 168):
            dx = (x - 140) / 28.0
            if abs(dx) <= 1.0 and y >= 26 + 14 * (1 - math.sqrt(max(0.0, 1 - dx * dx))):
                c.set(x, y, ramp_pick(["#06080a", "#0c1208", "#1a2410"], 0.35 + (y - 26) / 100.0 + dx * 0.2, x, y))
    for (x0, x1) in ((108, 112), (168, 172)):
        c.rect(x0, 24, x1, FL, "#1a2410")
        c.rect(x0, 24, x0, FL, "#7a8a30")
    for k in range(70):                                                      # moss + vines over the arch
        rr = e.rng("m%d" % k)
        x = rr.randint(106, 174)
        y = rr.randint(22, 40)
        c.line([(x, y), (x + rr.randint(-2, 2), y + rr.randint(6, 20))], rr.choice(["#3e5a1c", "#6c8a2a", "#222e12"]))
    # floor: damp ochre
    hband(c, FL + 1, 107, ["#6c7a2a", "#4a5a22", "#2e3a16", "#161e0c"], seed=e.seed_for("fl"), rough=0.4)
    light_pool(c, 44, FL + 12, 64, 12, "#e8f08a", t=0.5)
    c.rect(0, FL, 191, FL, "#0a1006")
    # rust flowers in the mid ground: clusters
    rf = e.rng("fl")
    for _ in range(26):
        x, y = rf.randint(60, 190), rf.randint(FL + 4, 100)
        r = 2 + (y - FL) // 8
        _flower(c, x, y - r - 1, r, "#d8702a", "#e8a040", "#e8d060", rot=rf.random() * 3, stem=y, stem_col="#222e12")
    # servitors among the flowers, humming (two upright, one slumped)
    for (x, y, h_, pz, fc) in [(78, 88, 30, "stand", 1), (150, 82, 26, "stand", -1)]:
        f = fig(h_, pz, "#3a4630", robe=0.0, facing=fc)
        px0, py0 = put_figure(c, f, x, y, rim_col="#c0cc5c", toward=(-1, -1),
                              shadow=dict(toward_light=(-1, 0.4), length=1.0, squash=0.3, col="#0a1006", t=0.6))
        hxx, hyy = int(f["head"][0]), int(f["head"][1])
        c.set(px0 + hxx + fc, py0 + hyy, "#e8ff9a")
        _flower(c, px0 + hxx, py0 + hyy - 5, 3, "#d8702a", "#e8a040", "#e8d060", rot=0.3, n=6)
        _flower(c, px0 + int(f["hands"][0][0]), py0 + int(f["hands"][0][1]) + 1, 2, "#d8702a", "#e8a040", "#e8d060", n=6)
        _notes(c, x - 4, y - h_ - 8, "#e8f08a")
    # the player: seated slack on a crate, a bloom at the shoulder, eyes closed
    c.rect(112, 90, 140, 102, "#1a2410")
    c.rect(112, 90, 140, 90, "#6c8a2a")
    me, mpx, mpy = _player(c, 44, "sit", 126, 90, facing=1, rim_col="#c0cc5c", toward=(-1, -1),
                           shadow=dict(toward_light=(-1, 0.4), length=1.0, squash=0.3, col="#0a1006", t=0.6), lean=24)
    _flower(c, mpx + int(me["head"][0]) - 2, mpy + int(me["head"][1]) + 5, 4, "#d8702a", "#e8a040", "#e8d060", rot=0.5, n=7)
    # foreground: the dropped oil can, a flower growing from its spout, huge blooms at the frame edge
    c.rect(34, 98, 52, 104, "#4a3418")
    c.rect(34, 98, 52, 98, "#a87a3a")
    c.rect(34, 103, 52, 104, "#1a1206")
    c.line([(52, 100), (62, 97)], "#4a3418")
    c.line([(62, 97), (68, 88)], "#222e12")
    _flower(c, 69, 84, 7, "#d8702a", "#e8a040", "#e8d060", rot=0.2, n=8)
    for (x, y, r) in [(8, 96, 11), (20, 106, 8), (176, 100, 12), (186, 92, 9)]:
        _flower(c, x, y - r, r, "#c85a22", "#e88c38", "#f0d060", rot=r * 0.37, n=9, stem=108, stem_col="#10160a")
    # flies
    rfl = e.rng("flies")
    for _ in range(30):
        x, y = rfl.randint(14, 180), rfl.randint(30, 96)
        c.set(x, y, "#0a1006")
        if rfl.random() < 0.5:
            c.set(x + 1, y - 1, "#a8b84a")
    particles(c, "spore", 40, (0, 10, 191, 100), seed=e.seed_for("sp"), cols=("#e8ff9a", "#c8e070"))
    vignette_kind(c, "bad", col="#080c04", strength=0.75)


def _gear_outline(c, cx, cy, r, teeth, col, rot=0.0, tooth=0.18):
    pts = []
    n = teeth * 4
    for i in range(n):
        a = rot + 2 * math.pi * i / n
        rr = r if (i % 4) in (1, 2) else r * (1 - tooth)
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    pts.append(pts[0])
    c.line(pts, col)


@ending("mech_end_claim_slaanesh")
def mech_end_claim_slaanesh(e):
    """BAD / Slaanesh.  The Next Model: a spotlit stage; the player stands before a tall mirror holding a better self,
    and behind that one another, and another; a heap of old hands, eyes and hearts at their feet; a row of silhouettes
    below applauds.  Magenta / silver.  Bright mass: the mirror, right of centre."""
    c = e.c
    R = GOD["slaanesh"]["ramp"]
    sky(c, ["#08030e", "#14061e", "#240a34", "#3a1058"], 0, 90)
    n = e.noise("bg")
    for y in range(0, 92):                                              # faint stage drapes: vertical folds
        for x in range(192):
            if n.fbm(x * 0.12, y * 0.01, 2) > 0.58:
                blend(c, x, y, "#7a2a9a", 0.28, 3)
    # stage floor
    hband(c, 84, 107, ["#7a2a9a", "#4a1670", "#2e0e48", "#1a0828"], seed=e.seed_for("fl"), rough=0.2)
    c.rect(0, 84, 191, 84, "#ff8ad8")
    # the mirror
    MX0, MX1, MY0, MY1 = 94, 146, 6, 84
    glow(c, 120, 46, 70, ["#240a34", "#3a1058", "#7a2a9a", "#c850c8", "#ff8ad8"], power=1.5, strength=0.9, ry=52)

    def in_mirror(x, y):
        if not (MX0 <= x <= MX1 and y <= MY1):
            return False
        if y >= MY0 + 22:
            return True
        dx = (x - 120) / 26.0
        return y >= MY0 + 22 * (1 - math.sqrt(max(0.0, 1 - dx * dx)))
    for y in range(MY0 - 2, MY1 + 1):
        for x in range(MX0 - 2, MX1 + 3):
            if in_mirror(x, y):
                t = clamp(0.35 + (x - MX0) / 52.0 * 0.4 + (1 - y / 88.0) * 0.28 + 0.2 * math.sin((x + y) * 0.12))
                c.set(x, y, ramp_pick(["#3a1058", "#7a2a9a", "#c850c8", "#ff8ad8", "#e8e8f8"], t, x, y))
    # a perspective gallery inside: each reflection is a more perfect, thinner, taller one
    refl = [(111, 84, 58, "stand", 1.0, "#f4f4ff"), (122, 78, 50, "arms_up", 0.9, "#d8d0f0"), (131, 73, 42, "stand", 0.78, "#b8a0e0"),
            (138, 69, 35, "arms_up", 0.7, "#9a78d0"), (143, 66, 28, "stand", 0.6, "#7a58b0")]
    for (x, y, h_, pz, th, col) in refl:
        f = fig(h_, pz, col, facing=1, thick=th)
        px0, py0 = put_figure(c, f, x, y, rim_col="#ff8ad8", toward=(1, -1))
        for yy in range(py0, py0 + f["img"].height):                   # clip to the mirror
            for xx in range(px0 - 2, px0 + f["img"].width + 2):
                if not in_mirror(xx, yy) and c.get(xx, yy) == tuple(C(col)):
                    c.set(xx, yy, "#10061a")
    # frame
    for y in range(MY0 - 3, MY1 + 3):
        for x in range(MX0 - 4, MX1 + 5):
            if not in_mirror(x, y) and (in_mirror(x - 1, y) or in_mirror(x + 1, y) or in_mirror(x, y - 1) or in_mirror(x - 2, y)
                                        or in_mirror(x + 2, y) or in_mirror(x, y - 2)):
                c.set(x, y, "#e8e8f8" if (x + y) % 4 else "#ff8ad8")
    c.rect(MX0 - 6, MY1 + 1, MX1 + 6, MY1 + 3, "#08030e")
    c.rect(MX0 - 6, MY1 + 1, MX1 + 6, MY1 + 1, "#e8e8f8")
    # spotlight on the player
    shafts(c, (62, 0), 90, 18, 4, 100, "#e8e8f8", t=0.30, seed=e.seed_for("sp"), w0=5, w1=22, power=0.4, floor=104)
    light_pool(c, 62, 94, 34, 6, "#e8e8f8", t=0.5)
    light_pool(c, 120, 92, 44, 7, "#ff8ad8", t=0.5)
    # the heap of what was replaced, at the player's feet
    rr = e.rng("heap")
    for _ in range(34):
        x, y = rr.randint(28, 86), rr.randint(88, 96)
        kind = rr.randint(0, 2)
        if kind == 0:                                                   # an eye
            c.ellipse(x, y, 2, 2, "#f4f4ff")
            c.set(x, y, "#c850c8")
        elif kind == 1:                                                 # a hand: palm and three fingers
            c.rect(x, y, x + 2, y + 1, "#d8c8e8")
            c.rect(x + 3, y - 1, x + 4, y - 1, "#d8c8e8")
            c.rect(x + 3, y + 1, x + 4, y + 1, "#d8c8e8")
        else:                                                           # a heart
            c.rect(x, y, x + 2, y + 1, "#ff4a9a")
            c.set(x + 1, y + 2, "#ff4a9a")
    # the player, in front of the mirror, chrome where it has been replaced
    me, mpx, mpy = _player(c, 66, "stand", 62, 94, facing=1, rim_col="#ff8ad8", toward=(1, -1), dim=("#2a1040", 0.5),
                           legs="#1c0c2c", skin="#e8c8d8", hair="#10061a",
                           shadow=dict(toward_light=(0.8, 0.4), length=0.8, squash=0.4, col="#08030e", t=0.7))
    hxx, hyy = mpx + int(me["head"][0]), mpy + int(me["head"][1])
    c.rect(hxx + 1, hyy - 1, hxx + 3, hyy, "#e8e8f8")                   # a new lens for an eye
    c.set(hxx + 2, hyy - 1, "#ff8ad8")
    hx0, hy0 = mpx + int(me["hands"][0][0]), mpy + int(me["hands"][0][1])
    c.rect(hx0 - 1, hy0 - 1, hx0 + 2, hy0 + 2, "#e8e8f8")               # a chrome hand
    e.protect += ["#ff8ad8", "#e8e8f8"]
    # applause: a row of silhouettes along the bottom edge, hands up, rimmed by the mirror light
    ra = e.rng("aud")
    xs = list(range(6, 200, 17))
    for x in xs:
        x += ra.randint(-4, 4)
        f = fig(ra.randint(36, 42), "arms_up", "#06030c", facing=1 if x < 120 else -1)
        put_figure(c, f, x, 134, rim_col="#c850c8", toward=(1 if x < 120 else -1, -1))
    particles(c, "mote", 55, (0, 0, 191, 100), seed=e.seed_for("spk"), cols=("#e8e8f8", "#ff8ad8", "#ffffff"))
    vignette_kind(c, "bad", col="#08030e", strength=0.5)


@ending("mech_end_claim_tzeentch")
def mech_end_claim_tzeentch(e):
    """BAD / Tzeentch.  The Completed Fragment: in the tech vault the finished STC blueprint hangs above its tablet,
    redrawn each moment (ghost copies in cyan, violet, pink); one thick pink line is not the player's; a thread
    from it runs to the player's wrist.  On the bench: six finished things, no two alike.
    Bright mass: left of centre, the hologram."""
    c = e.c
    R = GOD["tzeentch"]["ramp"]
    # vault wall: dark blue plates with tall data niches
    n = e.noise("wall")
    for y in range(0, 80):
        for x in range(192):
            t = clamp(0.35 + (n.fbm(x * 0.06, y * 0.09, 3) - 0.5) * 0.4 + (0.07 if (x // 20 + y // 16) % 2 else 0) - abs(x - 84) / 191.0 * 0.15)
            c.set(x, y, ramp_pick(["#070a20", "#0b1236", "#13204a", "#1e3270"], t, x, y))
            if x % 20 == 0 or y % 16 == 0:
                c.set(x, y, "#04020a")
    rr = e.rng("niches")
    for x in range(8, 192, 20):
        for y in (6, 38):
            c.rect(x, y, x + 11, y + 21, "#03020a")
            for k in range(rr.randint(2, 5)):
                c.rect(x + 2, y + 3 + k * 4, x + 9, y + 4 + k * 4, rr.choice(["#0a1e7a", "#1a5ad8", "#0e2a8a"]))
    # the bench and the floor
    hband(c, 80, 107, ["#1a2e6a", "#0e1a46", "#08102c", "#04061a"], seed=e.seed_for("fl"), rough=0.2)
    c.rect(0, 80, 191, 80, "#2ab8ff")
    c.rect(0, 81, 191, 84, "#070a20")
    c.rect(0, 85, 191, 85, "#1a5ad8")
    for x in range(10, 192, 24):
        c.rect(x, 86, x + 2, 107, "#04050e")
    # the tablet and the beam
    TX, TY = 84, 80
    c.rect(TX - 14, TY - 3, TX + 14, TY, "#0a1e7a")
    c.rect(TX - 14, TY - 3, TX + 14, TY - 3, "#9af6ff")
    c.rect(TX - 10, TY - 2, TX + 10, TY - 2, "#ffffff")
    shafts(c, (TX, TY - 3), 270, 20, 5, 44, "#2ab8ff", t=0.5, seed=e.seed_for("bm"), w0=14, w1=3, power=0.3)
    # the blueprint: a plain cog engine as thin lines; cyan = now, pink / violet = the plan, redrawn
    def blueprint(dx, dy, col, rot, k, heavy=False):
        cx, cy = 84 + dx, 44 + dy
        _gear_outline(c, cx, cy, 24, 12, col, rot=rot)
        _gear_outline(c, cx, cy, 14, 8, col, rot=-rot * 1.3, tooth=0.14)
        for j in range(4):                                              # spokes
            a_ = rot + j * math.pi / 2 + 0.4
            c.line([(cx + math.cos(a_) * 4, cy + math.sin(a_) * 4), (cx + math.cos(a_) * 14, cy + math.sin(a_) * 14)], col)
        c.line([(cx - 24, cy), (cx - 38, cy + 6 - k)], col)             # piston arms
        c.line([(cx + 24, cy), (cx + 38, cy - 6 + k)], col)
        c.rect(cx - 42, cy + 5 - k, cx - 38, cy + 8 - k, col)
        c.line([(cx, cy + 24), (cx, TY - 4)], col)
        if heavy:
            c.ellipse(cx, cy, 4, 4, "#9af6ff")
            c.ellipse(cx, cy, 2, 2, "#05030c")
    glow(c, 84, 44, 40, ["#0a1e7a", "#1a5ad8", "#2ab8ff"], power=1.8, strength=0.3)
    blueprint(-9, 6, "#1a5ad8", 0.45, 3)
    blueprint(12, -3, "#e83aa8", 0.75, 4)
    blueprint(0, 0, "#9af6ff", 0.0, 2, heavy=True)
    for (ox_, oy_) in ((1, 0), (0, 1)):                                  # make the live copy heavier than the ghosts
        _gear_outline(c, 84 + ox_, 44 + oy_, 24, 12, "#9af6ff", rot=0.0)
    # the extra line: thick, pink, not part of the drawing, ending in a little lidded node
    c.line([(84, 44), (110, 24), (136, 26)], "#e83aa8", 2)
    c.ellipse(138, 26, 3, 2, "#ffffff")
    c.set(138, 26, "#e83aa8")
    e.protect += ["#e83aa8", "#9af6ff"]
    # finished things on the bench, none alike
    objs = [(14, "sphere"), (30, "cube"), (48, "spire"), (120, "ring"), (136, "cog"), (166, "shard")]
    for (x, kind) in objs:
        by = 79
        if kind == "sphere":
            c.ellipse(x, by - 7, 7, 7, "#13204a"); c.ellipse(x - 2, by - 9, 3, 3, "#2ab8ff")
        elif kind == "cube":
            c.rect(x - 6, by - 12, x + 6, by, "#13204a"); c.rect(x - 6, by - 12, x + 6, by - 12, "#2ab8ff"); c.rect(x + 6, by - 12, x + 6, by, "#0a1e7a")
        elif kind == "spire":
            c.poly([(x - 5, by), (x, by - 22), (x + 5, by)], "#13204a"); c.line([(x - 5, by), (x, by - 22)], "#9af6ff")
        elif kind == "ring":
            c.ellipse(x, by - 9, 9, 9, "#2ab8ff"); c.ellipse(x, by - 9, 6, 6, "#070a20")
        elif kind == "cog":
            _gear(c, x, by - 9, 9, 7, "#13204a", hole=0.4, hole_col="#070a20", hub="#2ab8ff")
        else:
            c.poly([(x - 6, by), (x - 2, by - 18), (x + 3, by - 8), (x + 8, by)], "#13204a"); c.line([(x - 2, by - 18), (x + 8, by)], "#e83aa8")
        top_ = {"sphere": by - 14, "cube": by - 12, "spire": by - 22, "ring": by - 18, "cog": by - 18, "shard": by - 18}[kind]
        for yy in range(0, top_):                                         # a string up to the top of the frame
            if yy % 2 == 0 or yy > top_ - 10:
                c.set(x, yy, "#7a3ad8")
    # the player, at the bench, a thread on the wrist
    me, mpx, mpy = _player(c, 46, "reach", 168, 100, facing=-1, rim_col="#9af6ff", toward=(-1, -1),
                           shadow=dict(toward_light=(-1, 0.6), length=0.7, squash=0.4, col="#02010a", t=0.7))
    hxx, hyy = mpx + int(me["hands"][0][0]), mpy + int(me["hands"][0][1])
    _cable(c, (138, 27), (hxx, hyy), 16, "#e83aa8")
    c.rect(hxx - 1, hyy - 1, hxx + 1, hyy + 1, "#e83aa8")
    light_pool(c, 84, 96, 60, 10, "#2ab8ff", t=0.35)
    particles(c, "mote", 40, (0, 0, 191, 100), seed=e.seed_for("mt"), cols=("#9af6ff", "#e83aa8", "#ffffff"))
    vignette_kind(c, "bad", col="#05030c", strength=0.45)


def _finger(c, base, ang, segs, curl, col, hi, joint, extra=None):
    """one brass finger: a chain of segments (each a 3 px wide line), a glowing joint dot between them.
    ang in degrees (0 = right, -90 = up), curl = degrees added per joint.  extra = index of a segment to double (the wrong joint)."""
    x, y = base
    a = ang
    for i, ln in enumerate(segs):
        x2, y2 = x + math.cos(math.radians(a)) * ln, y + math.sin(math.radians(a)) * ln
        c.line([(x, y), (x2, y2)], col, 3)
        c.line([(x - 1, y - 1), (x2 - 1, y2 - 1)], hi)
        if i < len(segs) - 1:
            c.rect(int(x2) - 1, int(y2) - 1, int(x2), int(y2), joint)
        x, y = x2, y2
        a += curl


@ending("mech_end_heretek")
def mech_end_heretek(e):
    """BAD.  Apprentice of the Unbound: through a great window Gravex burns orange; in front of it the player's new brass
    hand, raised, backlit, its forefinger with one joint too many (the wrong joint glows); right, a Dark Magos
    looms, dark against the fire.  Sick violet-green inside, the only warm light is the burning city.
    Bright mass: left, the window."""
    c = e.c
    # interior wall: sick violet with green seams
    n = e.noise("wall")
    for y in range(108):
        for x in range(192):
            t = clamp(0.28 + (n.fbm(x * 0.05, y * 0.07, 3) - 0.5) * 0.5 + (0.06 if (x // 22 + y // 17) % 2 else 0))
            c.set(x, y, ramp_pick(["#0a0612", "#160c24", "#24143a", "#38205a"], t, x, y))
            if x % 22 == 0 or y % 17 == 0:
                c.set(x, y, "#07040c")
    # the window: an arch, Gravex on fire beyond
    WX0, WX1, WY0, WY1 = 6, 96, 6, 72

    def in_win(x, y):
        if not (WX0 <= x <= WX1 and y <= WY1):
            return False
        if y >= WY0 + 24:
            return True
        dx = (x - 51) / 45.0
        return y >= WY0 + 24 * (1 - math.sqrt(max(0.0, 1 - dx * dx)))
    for y in range(WY0, WY1 + 1):
        for x in range(WX0, WX1 + 1):
            if in_win(x, y):
                t = (y - WY0) / float(WY1 - WY0)
                c.set(x, y, ramp_pick(["#2a0608", "#6a1410", "#b8321a", "#f07a24", "#ffc060", "#fff0b0"], 0.12 + t * 0.9, x, y))
    # clip-aware drawing of the burning city: draw to a temp canvas and copy inside the window
    tmp = Canvas(192, 108, bg=(0, 0, 0))
    for y in range(108):
        for x in range(192):
            tmp.set(x, y, c.get(x, y))
    clouds(tmp, e.seed_for("sm"), ["#1a0608", "#3a0a0c", "#6a1410"], 4, 40, scale=0.05, thresh=0.47, stretch=4.0)
    skyline(tmp, e.seed_for("t1"), 66, "#5a1410", 11, 12, 30, 3, 8, x0=WX0, x1=WX1, win_p=0.0, tips=0.5)
    skyline(tmp, e.seed_for("t2"), 70, "#1e0608", 9, 14, 40, 4, 10, x0=WX0, x1=WX1, win_p=0.3, wincol=("#ffb040", "#ff7a2a"), tips=0.6)
    glow(tmp, 48, 70, 40, ["#8a1e12", "#d8501c", "#ff9a3a", "#ffd070"], power=1.6, strength=0.7, ry=22)
    for y in range(WY0, WY1 + 1):
        for x in range(WX0, WX1 + 1):
            if in_win(x, y):
                c.set(x, y, tmp.get(x, y))
    particles(c, "ember", 60, (WX0 + 2, WY0 + 6, WX1 - 2, WY1), seed=e.seed_for("em"), cols=("#ffb040", "#ff6a2a", "#ffe08a"))
    # frame with a plain cog ring
    for y in range(WY0 - 4, WY1 + 5):
        for x in range(WX0 - 4, WX1 + 5):
            if not in_win(x, y) and any(in_win(x + dx, y + dy) for dx in (-3, 0, 3) for dy in (-3, 0, 3)):
                c.set(x, y, "#0a0612" if (x + y) % 5 else "#4a3a6a")
    c.rect(WX0 - 4, WY1 + 1, WX1 + 4, WY1 + 4, "#0a0612")
    c.rect(WX0 - 4, WY1 + 1, WX1 + 4, WY1 + 1, "#5a4a7a")
    glow(c, 51, 40, 90, ["#160c24", "#24143a"], power=1.0, strength=0.0)
    shafts(c, (51, 50), 90, 100, 7, 80, "#ff9a3a", t=0.22, seed=e.seed_for("sh"), w0=6, w1=22, power=0.5, floor=104)
    # floor / bench: dark, a violet-green glint of tools
    hband(c, 86, 107, ["#2a1a44", "#160c24", "#0a0612", "#050308"], seed=e.seed_for("fl"), rough=0.2)
    c.rect(0, 86, 191, 86, "#5a4a7a")
    light_pool(c, 52, 92, 60, 6, "#ff9a3a", t=0.45)
    # the Dark Magos, right: a tall hooded silhouette facing the fire, mechadendrites folded behind, sick-green eyes
    shd = dict(toward_light=(-1, 0.5), length=0.9, squash=0.3, col="#03020a", t=0.8)
    glow(c, 148, 48, 52, ["#1a0e2e", "#2e1a4e", "#4a2a72", "#6a3a96"], power=1.3, strength=0.85, ry=60)
    dm = fig(86, "stand", "#0a0612", robe=0.97, hood=True, facing=-1, thick=1.0)
    dpx, dpy = put_figure(c, dm, 146, 100, rim_col="#ff9a3a", toward=(-1, -1), shadow=shd)
    hxx, hyy = dpx + int(dm["head"][0]), dpy + int(dm["head"][1])
    for k in range(4):                                                         # mechadendrites, arcing over the shoulders
        sx_ = hxx + 4 + k * 2
        c.line([(sx_, hyy + 12), (sx_ + 10 + k * 5, hyy - 2 - k * 3), (sx_ + 8 + k * 9, hyy + 8 + k * 2)], "#8a6ac0" if k % 2 else "#0a0612", 1)
        c.set(sx_ + 8 + k * 9, hyy + 8 + k * 2, "#c8ff4a")
    c.line([(dpx + 6, dpy + 8), (dpx + 6, 104)], "#0a0612", 2)                  # a staff with a cold green head
    glow(c, dpx + 6, dpy + 6, 6, ["#1a3a08", "#6ac820", "#c8ff4a"], power=0.9, strength=1.0)
    c.rect(hxx - 3, hyy, hxx - 2, hyy, "#c8ff4a")
    c.rect(hxx - 1, hyy, hxx, hyy, "#c8ff4a")
    c.set(hxx - 2, hyy + 4, "#ff4ac8")
    # the new hand: raised, backlit, bold.  Arm from the lower left, palm, four fingers + thumb in separate segments
    BRASS, HI, DK = "#6a4a1a", "#e8c060", "#1c1006"
    c.line([(6, 110), (40, 88)], DK, 11)
    c.line([(6, 105), (40, 83)], BRASS, 3)
    c.line([(6, 104), (40, 82)], HI)
    c.poly([(40, 90), (42, 72), (66, 70), (70, 86), (58, 94)], BRASS)           # palm
    c.poly([(44, 88), (46, 76), (63, 74), (66, 84), (57, 90)], "#4a3012")
    c.line([(42, 72), (66, 70)], HI)
    c.line([(42, 72), (40, 90)], HI)
    for (bx, by) in [(48, 80), (54, 84), (60, 80)]:                             # palm bolts
        c.set(bx, by, HI)
    def finger(base, ang, segs, curl):
        x, y = base
        a_ = ang
        for i, ln in enumerate(segs):
            dx, dy = math.cos(math.radians(a_)), math.sin(math.radians(a_))
            x2, y2 = x + dx * ln, y + dy * ln
            c.line([(x + dx, y + dy), (x2 - dx, y2 - dy)], BRASS, 5)
            c.line([(x + dx - 2, y + dy), (x2 - dx - 2, y2 - dy)], HI)
            if i < len(segs) - 1:
                c.rect(int(x2) - 1, int(y2) - 1, int(x2), int(y2), "#46ff9a")
            x, y = x2, y2
            a_ += curl
    finger((45, 73), -112, (9, 8, 7), 6)                                         # little
    finger((52, 72), -100, (10, 9, 8), 5)                                        # ring
    finger((59, 71), -90, (11, 10, 9), 3)                                        # middle
    finger((66, 71), -78, (10, 8, 7, 7), 3)                                      # the forefinger: four segments, one too many
    c.rect(69, 44, 70, 45, "#ff4ac8")
    c.set(69, 43, "#ffffff")
    c.line([(41, 86), (33, 78), (30, 68)], BRASS, 5)                             # thumb
    c.line([(39, 86), (31, 77)], HI)
    c.rect(32, 75, 33, 76, "#46ff9a")
    e.protect += ["#46ff9a", "#ff4ac8", "#c8ff4a"]
    particles(c, "mote", 26, (0, 0, 191, 100), seed=e.seed_for("mt"), cols=("#c8ff4a", "#ff9a3a"))
    vignette_kind(c, "bad", col="#06030c", strength=0.55)


@ending("mech_end_looted")
def mech_end_looted(e):
    """BAD.  Lil' Spanner: inside an ork shed; a bare bulb over the bench; the player sits on an oil drum mending a huge crude gun
    while the Mek leans over it; a stripe of red paint across the gun, across the player's coat and cheek (the wrong detail:
    red goes faster); hulking silhouettes with yellow eyes crowd the dark behind.  Bright mass: top centre, the bulb."""
    c = e.c
    FL = 80
    n = e.noise("wall")
    rr = e.rng("wall")
    for y in range(FL + 1):
        for x in range(192):
            t = clamp(0.22 + (n.fbm(x * 0.04, y * 0.06, 3) - 0.5) * 0.7 + (0.05 if (x // 6) % 2 else 0) - abs(x - 100) / 191.0 * 0.14)
            c.set(x, y, ramp_pick(["#080a04", "#161a08", "#262c0e", "#3c4016", "#585a1e"], t, x, y))
    for k in range(7):                                                           # patch plates of different colour
        x0, y0 = rr.randint(0, 170), rr.randint(0, 50)
        w_, h_ = rr.randint(16, 34), rr.randint(10, 22)
        col = rr.choice([["#2a1408", "#46220c", "#6a3010"], ["#141a06", "#222c0c", "#34401400"[:7]], ["#2a280c", "#403a12", "#584c18"]])
        for y in range(y0, min(FL, y0 + h_)):
            for x in range(x0, x0 + w_):
                c.set(x, y, ramp_pick(col, 0.3 + n.fbm(x * 0.2, y * 0.2, 2) * 0.5 - abs(x - 100) / 400.0, x, y))
        c.rect(x0, y0, x0 + w_, y0, "#080a04")
        c.rect(x0, y0 + h_, x0 + w_, y0 + h_, "#080a04")
        for (bx, by) in [(x0 + 2, y0 + 2), (x0 + w_ - 2, y0 + 2), (x0 + 2, y0 + h_ - 2), (x0 + w_ - 2, y0 + h_ - 2)]:
            c.set(bx, by, "#a8a040")
    for (x0, y0) in [(150, 22), (8, 34)]:                                        # red speed stripes daubed on the wall
        c.line([(x0, y0), (x0 + 18, y0 - 6)], "#d83a1a", 3)
        c.line([(x0 + 4, y0 + 5), (x0 + 22, y0 - 1)], "#d83a1a", 2)
    # the bulb over the bench
    BX, BY = 100, 6
    c.line([(BX, 0), (BX, BY - 3)], "#080a04")
    glow(c, BX, BY + 8, 62, ["#262c0e", "#3c4016", "#7a7a2a", "#b8b048", "#eee080", "#fffbd0"], power=1.2, strength=1.0, ry=56)
    c.ellipse(BX, BY + 2, 3, 3, "#fffbd0")
    c.rect(BX - 2, BY - 3, BX + 2, BY - 1, "#080a04")
    shafts(c, (BX, BY + 4), 90, 56, 7, 90, "#eee080", t=0.26, seed=e.seed_for("sh"), w0=4, w1=20, power=0.5, floor=104)
    # the crowd behind: hulking silhouettes with yellow eyes, thin enough to read
    for (x, y, h_, pz, fc) in [(14, 84, 70, "stand", 1), (176, 82, 74, "stand", -1), (128, 66, 40, "hunch", -1), (66, 66, 38, "stand", 1)]:
        f = fig(h_, pz, "#0a0c06", facing=fc, thick=1.25)
        px0, py0 = put_figure(c, f, x, y, rim_col="#a8a040", toward=(1 if x < 100 else -1, -1))
        hxx, hyy = int(f["head"][0]), int(f["head"][1])
        c.rect(px0 + hxx + fc * 2, py0 + hyy - 1, px0 + hxx + fc * 3, py0 + hyy, "#fff070")
    # floor
    hband(c, FL + 1, 107, ["#58581e", "#38381a", "#20200c", "#0e0e06"], seed=e.seed_for("fl"), rough=0.4)
    light_pool(c, 100, FL + 12, 80, 12, "#d8d068", t=0.4)
    c.rect(0, FL, 191, FL, "#080a04")
    # the Mek behind the bench, bust at its own size, looking down at the gun
    mk = spr("ork_mek", scale=1, tint_to="#12140a", tint_t=0.12, mirror=False)
    mk = rim(mk, "#eee080", (-1, -1), min_run=3)
    mkx, mky = place(c, mk, 150, 90, anchor="bm")
    # the bench: planks, front panel dark
    BT = 86
    c.rect(40, BT, 186, BT + 3, "#2a2410")
    c.rect(40, BT, 186, BT, "#d0c860")
    c.rect(40, BT + 4, 186, 107, "#100e06")
    c.rect(44, BT + 4, 48, 107, "#080a04")
    c.rect(178, BT + 4, 182, 107, "#080a04")
    for x in range(52, 178, 22):
        c.rect(x, BT + 8, x + 14, BT + 12, "#1a1608")
        c.rect(x, BT + 8, x + 14, BT + 8, "#4a4220")
    # the gun on the bench: a huge crude shoota, barrel pointing left, ammo drum, tape; red band round the barrel
    GY = 71
    c.rect(66, GY, 130, GY + 9, "#1a1a0e")
    c.rect(66, GY, 130, GY, "#d0c860")
    c.rect(66, GY + 9, 130, GY + 9, "#080a04")
    c.rect(40, GY + 2, 68, GY + 6, "#26261a")
    c.rect(40, GY + 2, 68, GY + 2, "#d0c860")
    c.rect(34, GY, 41, GY + 8, "#14140a")                                        # muzzle brake
    c.rect(34, GY, 41, GY, "#d0c860")
    for k in range(5):
        c.rect(46 + k * 4, GY + 6, 47 + k * 4, GY + 10, "#8a7a3a")               # tape strips
    c.rect(52, GY, 58, GY + 8, "#d83a1a")                                        # the red band
    c.rect(52, GY, 58, GY, "#ff7a4a")
    c.ellipse(102, GY + 12, 9, 8, "#26261a")                                     # ammo drum
    c.ellipse(102, GY + 12, 6, 5, "#14140a")
    c.rect(130, GY - 4, 144, GY + 6, "#34341c")                                  # stock
    c.rect(130, GY - 4, 144, GY - 4, "#a8a040")
    c.line([(70, GY - 1), (70, GY - 7), (80, GY - 7)], "#26261a")                # a crooked sight
    for (x, y, w_, h_) in [(150, 80, 6, 4), (160, 81, 4, 3), (168, 79, 5, 5)]:  # loose parts
        c.rect(x, y, x + w_, y + h_, "#4a4a20")
        c.rect(x, y, x + w_, y, "#a8a040")
    c.rect(172, 72, 180, 85, "#14140a")                                          # red paint pot, brush across
    c.rect(172, 72, 180, 74, "#d83a1a")
    c.line([(176, 73), (186, 64)], "#7a5a2a")
    e.protect += ["#d83a1a", "#ff7a4a"]
    # the player: seated on an oil drum at the left of the bench, spanner in hand, red stripe on coat and cheek
    c.rect(8, 92, 32, 108, "#2a2210")
    c.rect(8, 92, 32, 92, "#a89030")
    c.rect(8, 99, 32, 99, "#1a1608")
    c.rect(8, 105, 32, 105, "#1a1608")
    me, mpx, mpy = _player(c, 54, "sit", 22, 92, facing=1, rim_col="#eee080", toward=(1, -1),
                           shadow=dict(toward_light=(0.3, 0.9), length=0.3, squash=0.5, col="#080a04", t=0.6),
                           lean=34, dim=("#3a3818", 0.22))
    hxx, hyy = mpx + int(me["head"][0]), mpy + int(me["head"][1])
    c.rect(hxx + 1, hyy + 1, hxx + 2, hyy + 2, "#d83a1a")                        # red on the cheek
    hx0, hy0 = mpx + int(me["hands"][0][0]), mpy + int(me["hands"][0][1])
    c.line([(hx0, hy0), (hx0 + 9, hy0 - 3)], "#b8b8a8", 2)                       # the spanner, reaching the barrel
    c.rect(hx0 + 9, hy0 - 6, hx0 + 13, hy0 - 2, "#b8b8a8")
    c.rect(hx0 + 11, hy0 - 5, hx0 + 12, hy0 - 3, "#12100a")
    for k in range(9):                                                           # red stripe over the coat
        c.set(mpx + int(me["head"][0]) - 3 + k // 2, mpy + int(me["head"][1]) + 7 + k, "#d83a1a")
    particles(c, "mote", 40, (0, 0, 191, 100), seed=e.seed_for("dust"), cols=("#e8e070", "#c8c860", "#f4ec8a"))
    vignette_kind(c, "bad", col="#060802", strength=0.7)
