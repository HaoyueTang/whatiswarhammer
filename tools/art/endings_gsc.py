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


# ====================================================================== helpers (module-private)

def _panels(c, x0, y0, x1, y1, cols, seed, pw=24, ph=18, seam=None, tmin=0.2, tmax=0.8, vert=True, rivets=None):
    """bolted wall plates with seams, noise-modulated; cols dark -> light.  Light falls off with y if vert."""
    n = Noise(seed)
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            row = (y - y0) // ph
            col_ = (x - x0 + (row % 2) * (pw // 2)) // pw
            base = tmin + (tmax - tmin) * ((y - y0) / float(max(1, y1 - y0)) if vert else 0.5)
            t = clamp(base + (n.fbm(x * 0.06 + col_ * 3.1, y * 0.09 + row * 1.7) - 0.5) * 0.55)
            c.set(x, y, ramp_pick(cols, t, x, y))
            if seam and ((y - y0) % ph == 0 or (x - x0 + (row % 2) * (pw // 2)) % pw == 0):
                c.set(x, y, seam)
            if rivets and (y - y0) % ph == 2 and (x - x0 + (row % 2) * (pw // 2)) % pw in (2, pw - 3):
                c.set(x, y, rivets)


def _eyes(c, f, ox, oy, col="#c9a8ff", dx=1, dy=0, gap=2):
    """two pale eye pixels on a figure whose top-left is (ox, oy); f = the figure dict (uses f['head'])."""
    hx_, hy_ = f["head"]
    x, y = int(round(ox + hx_)) + dx, int(round(oy + hy_)) + dy
    c.set(x, y, col)
    c.set(x + gap, y, col)


def _icon4(c, cx, cy, s, col, glowc=None):
    """The four-armed icon as an ABSTRACT mark only: a spine with two pairs of limbs, no head, no detail.
    s = half height in px.  Used tiny, on walls."""
    col = C(col)
    c.line([(cx, cy - s), (cx, cy + s)], col)
    for sgn in (-1, 1):
        c.line([(cx, cy - s * 0.35), (cx + sgn * s * 0.9, cy - s * 0.95)], col)       # upper pair, raised
        c.line([(cx, cy - s * 0.1), (cx + sgn * s * 1.0, cy + s * 0.1)], col)         # lower pair, out
    if glowc:
        for ddx, ddy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            blend(c, int(cx) + ddx, int(cy) + ddy, glowc, 0.4, 2)


def _kid(c, x, y, skin, hair, cloth, tilt=0, h=14, plain=True):
    """small front-facing child, hand-pixelled: round head, two dark eye pixels (plain face), blanketed body.
    (x, y) = bottom-centre; the body is cut flat at y (hide it behind a bench)."""
    hw = 3
    top = y - h
    c.rect(x - hw + 1, top, x + hw - 1, top + 5, skin)               # head
    c.rect(x - hw, top + 1, x + hw, top + 4, skin)
    c.rect(x - hw, top, x + hw, top + 1, hair)                       # hair cap
    c.set(x - hw, top + 2, hair)
    c.set(x + hw, top + 2, hair)
    c.set(x - 1, top + 3, "#2a1a14")                                 # eyes only
    c.set(x + 1, top + 3, "#2a1a14")
    c.rect(x - hw - 1 + tilt, top + 6, x + hw + 1 + tilt, y, cloth)  # body
    c.rect(x - hw - 1 + tilt, top + 6, x - hw - 1 + tilt, y, mix(C(cloth), (0, 0, 0), 0.3))


def _stream(c, p0, p1, col, n=14, seed=1, spread=2.0, t=0.9):
    """a line of motes between two points (exhaust trail, thread of light)."""
    rnd = random.Random(seed)
    for k in range(n):
        u = k / float(max(1, n - 1))
        x = p0[0] + (p1[0] - p0[0]) * u + rnd.uniform(-spread, spread) * u
        y = p0[1] + (p1[1] - p0[1]) * u + rnd.uniform(-spread, spread) * u
        blend(c, int(x), int(y), col, t * (1 - u * 0.7), 3)


# ====================================================================== GOOD

@ending("gsc_end_ark")
def gsc_end_ark(e):
    """GOOD.  The Endurance's hold: warm lamplight, two rows of blanketed children, every face plain, and the player
    sitting among them.  A round viewport at the upper right; in it, small and violet, the star that was Kessin
    Tertius.  Bright mass: the lamp strip left-top and the porthole right."""
    c = e.c
    WALL = ["#3a281c", "#5a3c26", "#7e5634", "#a47444", "#c89a58"]
    _panels(c, 0, 0, 191, 80, WALL, e.seed, pw=26, ph=20, seam="#2a1c12", tmin=0.25, tmax=0.58, rivets="#e0b878")
    # ceiling beam + lamp strips
    c.rect(0, 0, 191, 7, "#241810")
    c.rect(0, 8, 191, 8, "#7a5a3a")
    for lx in (18, 74, 130):
        c.rect(lx, 2, lx + 28, 5, "#fff0c0")
        c.rect(lx + 1, 5, lx + 27, 6, "#ffd890")
        light_pool(c, lx + 14, 14, 30, 22, "#ffd890", t=0.40)
    # --- the viewport
    PX, PY, PR = 148, 44, 24
    for y in range(PY - PR - 4, PY + PR + 5):
        for x in range(PX - PR - 4, PX + PR + 5):
            d = math.hypot(x - PX, y - PY)
            if d <= PR:
                t = clamp((y - (PY - PR)) / (2.0 * PR) * 0.8 + 0.1)
                c.set(x, y, ramp_pick(["#0c0a2e", "#16124a", "#24206a", "#3a2c88"], t, x, y))
            elif d <= PR + 3:
                c.set(x, y, "#e4b868" if (x - PX + y - PY) < 4 else "#8a6030")
            elif d <= PR + 4:
                c.set(x, y, "#2a1a10")
    rs = e.rng("stars")
    for k in range(16):
        a, r = rs.uniform(0, 6.283), rs.uniform(0, PR - 2)
        c.set(PX + math.cos(a) * r, PY + math.sin(a) * r, rs.choice(["#6a6ab0", "#aaaadc"]))
    # the violet star (Kessin Tertius), small, low-left of the window
    sx_, sy_ = PX - 8, PY + 6
    for y in range(sy_ - 13, sy_ + 14):
        for x in range(sx_ - 13, sx_ + 14):
            if math.hypot(x - PX, y - PY) <= PR - 1:
                d = math.hypot(x - sx_, y - sy_) / 13.0
                if d < 1:
                    blend(c, x, y, "#b080ff", (1 - d) ** 1.4 * 1.0, 4)
    c.rect(sx_ - 1, sy_ - 1, sx_ + 1, sy_ + 1, "#d8b8ff"); c.set(sx_, sy_, "#ffffff")
    for (dx, dy) in ((-3, 0), (3, 0), (0, -3), (0, 3), (-2, 0), (2, 0), (0, -2), (0, 2)):
        c.set(sx_ + dx, sy_ + dy, "#c8a0ff")
    e.protect += ["#f0e0ff", "#a070ff"]
    # window light spilling onto the wall
    light_pool(c, PX - 6, PY + 10, 40, 34, "#8a78ff", t=0.18)
    # --- floor
    hband(c, 81, 107, ["#5a3c26", "#46301e", "#2e2016"], seed=e.seed_for("fl"), rough=0.2)
    c.rect(0, 80, 191, 81, "#1c120c")
    for x in range(-60, 260, 22):
        c.line([(96 + (x - 96) * 0.5, 82), (96 + (x - 96) * 1.7, 107)], "#241810")
    light_pool(c, 80, 96, 70, 12, "#ffd890", t=0.3)
    # --- benches + children: back row, front row
    rk = e.rng("kids")
    SK = ["#f0d4b0", "#e4c09a", "#d4a880", "#f4dcc0"]
    HR = ["#2a1a14", "#4a2e1a", "#6a4a24", "#1c1410"]
    CL = ["#a8443a", "#3a6a7a", "#c89a3a", "#6a5a9a", "#5a8a5a", "#b86a8a"]
    def row(y, xs, h):
        for x in xs:
            _kid(c, x, y, rk.choice(SK), rk.choice(HR), rk.choice(CL), tilt=rk.choice((-1, 0, 0, 1)), h=h + rk.choice((-1, 0, 1)))
    row(68, list(range(10, 100, 9)), 14)
    c.rect(0, 68, 106, 71, "#5a3a20"); c.rect(0, 68, 106, 68, "#a47444")
    c.rect(0, 72, 106, 74, "#2e1c10")
    # the player stands behind the front bench, so only the bust shows: sitting among them
    me = player_fig("gsc", 50, "stand", facing=1)
    img = rim(me["img"], "#ffd890", (-1, -1))
    img = img.crop((0, 0, img.width, 38))          # a bust above the bench: sitting among them
    ppx, ppy = place(c, img, 112, 90, anchor="bm")
    _eyes(c, me, ppx, ppy, col="#2a1a14", dx=1, dy=0)
    row(86, list(range(16, 108, 10)) + [176], 17)
    c.rect(0, 86, 186, 90, "#46301e"); c.rect(0, 86, 186, 86, "#c89a58")
    c.rect(0, 91, 186, 93, "#241810")
    # a small one asleep against the player's side
    _kid(c, 127, 86, "#f0d4b0", "#4a2e1a", "#3a6a7a", tilt=2, h=15)
    # warm motes: the new song
    particles(c, "mote", 26, (14, 12, 130, 66), seed=e.seed_for("song"), cols=("#ffe2a0", "#fff0c8", "#ffc870"))
    vignette_kind(c, "good")


@ending("gsc_end_lastshift")
def gsc_end_lastshift(e):
    """GOOD.  Dusk over the emptied starport.  Those who stayed stand small on the landing pad, seen from behind, backlit
    by a low amber sun on the right; high up on the left the hauler's exhaust has become one small star.  Far spore-towers
    on the horizon say the swarm is coming; nobody on the pad turns to look.  Bright mass: low right horizon + top-left star."""
    c = e.c
    HZ = 62
    sky(c, ["#241644", "#4a2a6a", "#8a3e76", "#c8605a", "#f0a050", "#ffd080", "#fff0b0"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#4a2a6a", "#6a3a78", "#a85070"], 4, 44, scale=0.06, thresh=0.52, stretch=5.0)
    sx_ = 150
    glow(c, sx_, HZ, 64, ["#c8605a", "#e88a4e", "#ffb860", "#ffd890", "#fff0c0"], power=1.4, strength=1.0, ry=34)
    c.ellipse(sx_, HZ, 12, 12, "#fff6d8")
    # distant skyline of the starport: gantry cranes, tank farm, chimney; and spore-towers (the swarm) on the far right
    rr = e.rng("hor")
    c.rect(0, HZ, 191, HZ + 3, "#3a2250")
    for k in range(16):
        x = rr.randint(0, 120)
        h = rr.randint(5, 16)
        c.rect(x, HZ - h, x + rr.randint(2, 5), HZ + 1, "#38224e")
    c.rect(10, HZ - 22, 12, HZ + 1, "#2a1840"); c.rect(10, HZ - 22, 30, HZ - 21, "#2a1840"); c.rect(29, HZ - 21, 30, HZ - 12, "#2a1840")
    for (x, h) in ((172, 30), (181, 22), (164, 15)):                      # biomass spikes on the far horizon: the swarm
        c.poly([(x - 3, HZ + 1), (x + 3, HZ + 1), (x + 1, HZ - h + 3), (x, HZ - h)], "#4a2a58")
        c.poly([(x - 5, HZ + 1), (x - 2, HZ + 1), (x - 4, HZ - h // 3)], "#4a2a58")
    for k in range(7):                                                    # drifting spores high up, far right
        c.set(rr.randint(120, 190), rr.randint(4, 30), "#3a1e50")
    # --- the star on the left: the hauler's exhaust, and its trail
    stx, sty = 40, 20
    _stream(c, (14, 58), (stx, sty + 2), "#ffe8b0", n=18, seed=e.seed_for("tr"), spread=1.6, t=0.9)
    glow(c, stx, sty, 7, ["#8a3e76", "#d07a8a", "#ffd0a0", "#ffffff"], power=1.1, strength=1.0)
    c.rect(stx, sty - 3, stx, sty + 3, "#fff6d8"); c.rect(stx - 3, sty, stx + 3, sty, "#fff6d8")
    e.protect += ["#fff6d8"]
    # --- the landing pad: perspective floor, chevrons, long shadows toward the viewer
    hband(c, HZ + 4, 107, ["#7a4a6a", "#5a3a5e", "#3a2848", "#241838"], seed=e.seed_for("fl"), rough=0.2)
    for x in range(-140, 340, 28):
        c.line([(96 + (x - 96) * 0.12, HZ + 4), (96 + (x - 96) * 1.7, 107)], "#2a1c3c")
    for y, k in ((70, 0.20), (78, 0.35), (90, 0.7)):
        c.rect(0, y, 191, y, "#2a1c3c")
    # the sun's reflection on the wet pad
    for y in range(HZ + 4, 100):
        w = int(8 + (y - HZ) * 0.9)
        for x in range(sx_ - w, sx_ + w):
            if (x + y) % 2 == 0:
                blend(c, x, y, "#ffc070", 0.55 * (1 - (y - HZ) / 44.0), 3)
    # painted hazard line across the pad
    for x in range(0, 192):
        yy = 86 + int((x - 96) * 0.0)
        if (x // 5) % 2 == 0:
            c.set(x, 100, "#b08a3a"); c.set(x, 101, "#b08a3a")
    # --- the ones who stayed (from behind; facing the star, toward the left)
    rg = e.rng("grp")
    spots = [(94, 78, 22), (104, 82, 24), (84, 80, 22), (116, 80, 22), (76, 84, 25), (126, 85, 25), (58, 88, 27)]
    for (x, y, h) in spots:
        f = fig(h, rg.choice(["stand", "stand", "hunch", "carry"]), rg.choice(["#1e1230", "#241438", "#1a1028"]), facing=-1)
        put_figure(c, f, x, y, shadow=dict(toward_light=(1.0, 0.45), length=0.9, squash=0.28, col="#2a1840", t=0.5))
    me = player_fig("gsc", 31, "stand", facing=-1)
    fx_, fy_ = put_figure(c, me, 66, 92, rim_col="#fff0a0", toward=(1, -1),
                          shadow=dict(toward_light=(1.0, 0.45), length=0.9, squash=0.28, col="#2a1840", t=0.55))
    vignette_kind(c, "good")


@ending("gsc_end_shadow")
def gsc_end_shadow(e):
    """GOOD.  The Shadow has a tear in it: a wedge of gold light cuts diagonally through the violet sky and shafts fall on
    the ruined hive; the Navy's lances stitch the horizon.  The player sits on a broken tower ledge at lower left, with
    a row of pale shapes beside them: every face remembered.  Bright mass: top-right diagonal."""
    c = e.c
    HZ = 72
    wn = e.noise("wall")
    # violet Shadow, vertical-streaked
    for y in range(HZ + 1):
        for x in range(192):
            v = wn.fbm(x * 0.03, y * 0.05, 4)
            c.set(x, y, ramp_pick(["#1c1034", "#2c1a50", "#46286e", "#684090"], clamp(v * 1.3 - 0.1 + (HZ - y) * -0.002), x, y))
    # the tear: a band from the top right toward the horizon centre, edge ragged with noise
    tn = e.noise("tear")

    def dist_to_tear(x, y):
        # line from (200,-10) to (84,HZ); signed distance
        ax, ay, bx, by = 214.0, -14.0, 80.0, float(HZ)
        dx, dy = bx - ax, by - ay
        ln = math.hypot(dx, dy)
        return ((x - ax) * dy - (y - ay) * dx) / ln, ((x - ax) * dx + (y - ay) * dy) / ln
    for y in range(HZ + 1):
        for x in range(192):
            d, u = dist_to_tear(x, y)
            half = 7 + 24 * max(0.0, 1 - u / 150.0) ** 1.2 + (tn.fbm(x * 0.12, y * 0.12, 3) - 0.5) * 12
            if abs(d) < half:
                t = clamp(1 - abs(d) / half)
                c.set(x, y, ramp_pick(["#a06088", "#e8a070", "#ffd890", "#fff0c0", "#ffffff"], t * 0.95 + 0.05, x, y))
            elif abs(d) < half + 7:
                blend(c, x, y, "#e8a070", 0.35 * (1 - (abs(d) - half) / 7.0), 3)
    # Navy lances: thin bright strokes from the tear down to the horizon, each ending in a flare
    rl = e.rng("lances")
    for (x0, y0, x1) in ((120, 10, 104), (140, 22, 118), (100, 28, 90), (160, 6, 134)):
        c.line([(x0, y0), (x1, HZ - 4)], "#fff6d8")
        glow(c, x1, HZ - 3, 5, ["#e8a070", "#ffd890", "#ffffff"], power=1.0, strength=1.0)
    # ruined hive on the horizon, gilded edges
    rr = e.rng("hive")
    c.rect(0, HZ, 191, 107, "#140a24")
    for k in range(26):
        x = rr.randint(0, 190)
        w = rr.randint(4, 12)
        h = rr.randint(6, 26)
        c.rect(x, HZ - h, x + w, HZ + 4, "#1a0e2c")
        c.rect(x + w, HZ - h, x + w, HZ + 4, "#6a4a58") if x > 80 else c.rect(x, HZ - h, x, HZ + 4, "#2a1a3c")
    glow(c, 112, HZ, 70, ["#46286e", "#8a5078", "#d08a70", "#ffd890"], power=1.8, strength=0.7, ry=26)
    shafts(c, (150, 18), 116, 26, 4, 80, "#ffd890", t=0.22, seed=e.seed_for("sh"), w0=2, w1=8, power=0.7, floor=HZ + 6)
    # ground and foreground rubble, broken tower ledge at left
    hband(c, HZ + 5, 107, ["#2a1c38", "#1c1228", "#100a1c"], seed=e.seed_for("gr"), rough=0.25)
    light_pool(c, 120, HZ + 10, 70, 8, "#ffc070", t=0.35)
    ridge(c, 100, 2, 6, "#0e0818", seed=e.seed_for("rb"), x0=60, x1=191, fill_to=107)
    # tower stump: big block with torn top at the lower left
    for x in range(0, 96):
        top = 70 + int(abs(math.sin(x * 0.23) * 3) + (x // 14) + max(0, x - 66) * 1.1)
        c.rect(x, top, x, 107, "#0c0616")
        c.set(x, top, "#8a6a60" if x > 40 else "#4a3a58")
    for yy in range(76, 107, 5):                                         # brick courses on the broken tower
        for xx in range(0, 96):
            if yy > 70 + int(abs(math.sin(xx * 0.23) * 3) + (xx // 14) + max(0, xx - 66) * 1.1) + 1:
                blend(c, xx, yy, "#6a4a58", 0.5, 3)
    light_pool(c, 96, 100, 110, 9, "#ffc070", t=0.30)
    rb2 = e.rng("rub")
    for k in range(12):                                                  # foreground rubble, warm on the top edge
        x = rb2.randint(70, 190)
        w, h = rb2.randint(5, 14), rb2.randint(3, 8)
        c.poly([(x, 107), (x + 1, 107 - h), (x + w // 2, 107 - h - 2), (x + w, 107 - h + 1), (x + w + 1, 107)], "#0a0614")
        c.line([(x + 1, 107 - h), (x + w // 2, 107 - h - 2), (x + w, 107 - h + 1)], "#8a5a58")
    # those who are remembered: pale shapes sitting along the ledge; the player at the end
    for k, x in enumerate((26, 40, 52, 63)):
        f = figure(26 + (k % 2) * 2, "sit", "#8a6a98", facing=1)
        ledge = 70 + int(abs(math.sin(x * 0.23) * 3) + (x // 14))
        img = tint(f["img"], "#46286e", 0.35)
        px_, py_ = place(c, img, x, ledge + 1, anchor="bm")
        for yy in range(img.height):
            for xx in range(img.width):
                if (xx + yy) % 2 and img.load()[xx, yy][3] >= 128:
                    blend(c, px_ + xx, py_ + yy, "#2a1c3c", 0.4, 2)
        hx_, hy_ = f["head"]
        c.set(px_ + hx_ + 2, py_ + hy_, "#ffe8b0")
    me = player_fig("gsc", 32, "sit", facing=1)
    img = rim(me["img"], "#ffd890", (1, -1))
    place(c, img, 12, 72, anchor="bm")
    particles(c, "ember", 24, (60, 10, 190, 70), seed=e.seed_for("em"), cols=("#ffd890", "#ffb060", "#ffffff"), wind=(1, 1))
    vignette_kind(c, "good")


@ending("gsc_end_witness")
def gsc_end_witness(e):
    """GOOD.  A cabin aboard the Inquisitor's ship, a year into the telling.  Left: the player, bust above a long table, a
    bowl of soup steaming before them; right: the Inquisitor in a wide hat, writing.  Behind the Inquisitor a wall of
    archive volumes, one new pale one sticking out of the row.  Bright mass: brass lamp, centre-left."""
    c = e.c
    WALL = ["#241e2a", "#3a3040", "#584658", "#7a5e62"]
    _panels(c, 0, 0, 191, 76, WALL, e.seed, pw=30, ph=24, seam="#161018", tmin=0.35, tmax=0.7, rivets="#c8a060")
    # porthole at the top left: stars
    for y in range(6, 40):
        for x in range(10, 48):
            d = math.hypot(x - 29, y - 22)
            if d <= 14:
                c.set(x, y, ramp_pick(["#0a0a24", "#161440", "#26225a"], (y - 8) / 28.0, x, y))
            elif d <= 17:
                c.set(x, y, "#d8aa5a" if (x + y) < 51 else "#7a5830")
    rs = e.rng("st")
    for k in range(14):
        a, r = rs.uniform(0, 6.28), rs.uniform(0, 13)
        c.set(29 + math.cos(a) * r, 22 + math.sin(a) * r, rs.choice(["#8a8ad0", "#e0e0ff"]))
    # the archive: a shelf wall on the right, rows of spines
    c.rect(86, 8, 191, 70, "#120c14")
    rb = e.rng("books")
    BK = ["#7a2a30", "#3a5a4a", "#8a6a34", "#4a3a6a", "#a84a38", "#5a4630", "#2e4a5e", "#b8903c"]
    for r_ in range(5):
        y1 = 22 + r_ * 12
        x = 88
        while x < 188:
            w = rb.randint(2, 4)
            h = rb.randint(7, 10)
            col = rb.choice(BK)
            c.rect(x, y1 - h, x + w - 1, y1 - 1, col)
            c.rect(x, y1 - h, x, y1 - 1, mix(C(col), (255, 235, 190), 0.25))
            x += w + (1 if rb.random() < 0.15 else 0)
        c.rect(86, y1, 191, y1 + 1, "#4a3a28")
        c.rect(86, y1, 191, y1, "#8a6a40")
    # one new volume, pale gold, standing proud of its row
    c.rect(150, 22 + 12 * 1 - 12, 154, 22 + 12 * 1 - 1, "#fff0c0")
    c.rect(150, 22 + 12 * 1 - 13, 154, 22 + 12 * 1 - 12, "#ffe090")
    light_pool(c, 152, 20, 14, 12, "#ffe8a0", t=0.45)
    e.protect += ["#fff0c0"]
    # lamp light across the table and the shelves
    light_pool(c, 70, 66, 60, 40, "#ffd890", t=0.30)
    # --- the table
    c.rect(0, 74, 191, 80, "#6a4630")
    c.rect(0, 74, 191, 75, "#c89a58")
    c.rect(0, 81, 191, 107, "#241a20")
    c.rect(0, 81, 191, 82, "#12090e")
    for x in range(6, 192, 24):
        c.rect(x, 86, x + 14, 104, "#2e2228")
        c.rect(x, 86, x + 14, 86, "#4a3a3a")
    light_pool(c, 80, 78, 70, 5, "#ffd890", t=0.45)
    # --- the two of them, bust-cut behind the table
    me = player_fig("gsc", 52, "reach", facing=1)
    img = rim(me["img"], "#ffd890", (1, -1))
    img = img.crop((0, 0, img.width, 40))
    ppx, ppy = place(c, img, 34, 76, anchor="bm")
    _eyes(c, me, ppx, ppy, col="#2a1a14")
    insp = figure(54, "hunch", "#1c1a26", facing=-1, thick=1.1)
    img2 = rim(insp["img"], "#e8b070", (-1, -1))
    img2 = img2.crop((0, 0, img2.width, 40))
    qx, qy = place(c, img2, 124, 76, anchor="bm")
    # the wide hat: brim + crown
    hx2, hy2 = insp["head"]
    cx_, cy_ = qx + int(hx2), qy + int(hy2)
    c.rect(cx_ - 9, cy_ - 5, cx_ + 9, cy_ - 4, "#12111a")
    c.rect(cx_ - 5, cy_ - 10, cx_ + 5, cy_ - 5, "#12111a")
    c.rect(cx_ - 5, cy_ - 6, cx_ + 5, cy_ - 6, "#6a3a3a")
    c.set(cx_ - 9, cy_ - 5, "#c89a58"); c.set(cx_ - 8, cy_ - 5, "#8a6a40")
    # --- on the table: the lamp, a lean stack of papers, the bowl of soup with steam, the pen
    c.rect(64, 70, 70, 73, "#3a2418"); c.rect(66, 62, 68, 70, "#8a6a40")        # lamp stem
    glow(c, 67, 58, 9, ["#a8702a", "#e8a850", "#ffe08a", "#fff6d8"], power=1.1, strength=1.0)
    c.rect(64, 64, 70, 64, "#c89a58")
    for k in range(5):
        c.rect(84 + k, 66 - k * 2 + 8, 104 + k, 70 - k * 2 + 8 - 1, "#e8d8b0" if k % 2 else "#d4c298")
    c.rect(82, 69, 104, 73, "#d4c298")
    c.rect(52, 69, 64, 73, "#d0b890"); c.rect(53, 68, 63, 68, "#fff0c8")          # the bowl, on the player's side
    c.rect(53, 73, 63, 73, "#8a6a48")
    for k in range(7):
        blend(c, 56 + (k % 2), 65 - k, "#fff0d8", 0.7, 3)
        blend(c, 60 - (k % 2), 64 - k, "#fff0d8", 0.5, 3)
    c.line([(110, 72), (124, 69)], "#e8e0c8")
    vignette_kind(c, "good")


# ====================================================================== BAD

def _mushroom(c, x, y, h, cap, stem, lit=None):
    """tiny mushroom: stem + dome cap, feet at (x, y)."""
    c.rect(x, y - h, x, y, stem)
    r = max(2, h // 2 + 1)
    for j in range(-r // 2 - 1, 1):
        w = int(r * math.sqrt(max(0.0, 1 - (j / float(r // 2 + 1)) ** 2)))
        c.rect(x - w, y - h + j, x + w, y - h + j, cap)
    if lit:
        c.set(x - 1, y - h - 1, lit)


@ending("gsc_end_ascension")
def gsc_end_ascension(e):
    """BAD.  The Day of Ascension from the ground: the family in rows, faces upturned, small and black at the foot of the
    picture, and over them a vast pale underbelly with rows of lights descending in columns, far too regular, each with a
    tail of cold light.  Sick lilac/cyan.  Bright mass: the sky overhead."""
    c = e.c
    sky(c, ["#160c2c", "#26164a", "#432c78", "#6e52a0", "#9a82c4"], 0, 78)
    bn = e.noise("belly")
    for y in range(0, 40):
        for x in range(192):
            fx = (x - 96) / 130.0
            edge = 26 + 16 * fx * fx + (bn.fbm(x * 0.05, 3.0, 3) - 0.5) * 12
            if y < edge:
                rib = math.sin(x * 0.35 + bn.fbm(x * 0.04, y * 0.08, 2) * 6.0)
                t = clamp(0.22 + (bn.fbm(x * 0.07, y * 0.12, 4) - 0.5) * 0.6 + rib * 0.10 + (1 - y / edge) * 0.3)
                c.set(x, y, ramp_pick(["#2e2056", "#4a3a7e", "#7a68b0", "#b0a0d8"], t, x, y))
            elif y < edge + 2:
                c.set(x, y, "#241848")
    # the lights: regular columns, falling; tail of cold light above each head
    rt = e.rng("lights")
    cols_ = 24
    for k in range(cols_):
        x = 6 + k * 8 + rt.randint(-1, 1)
        for row in range(2):
            y = rt.randint(30, 66) if row == 0 else rt.randint(44, 72)
            xx = x + row * 4
            ln = rt.randint(10, 20)
            for j in range(ln):
                blend(c, xx, y - j, "#c8d8ff", 0.85 * (1 - j / float(ln)), 3)
            glow(c, xx, y, 3, ["#6a5ab0", "#b8c8f8", "#ffffff"], power=1.0, strength=1.0)
            c.set(xx, y, "#ffffff")
    e.protect += ["#ffffff"]
    hband(c, 76, 107, ["#4a3a70", "#32265a", "#1a1236"], seed=e.seed_for("gr"), rough=0.2)
    light_pool(c, 96, 80, 110, 12, "#b8a8f0", t=0.40)
    crowd(c, 4, 188, 80, 104, 62, 12, 24, "#0c0618", seed=e.seed_for("cr"), rim_col="#9a88d8", toward=(0, -1),
          poses=("stand", "stand", "stand", "arms_up"))
    me = player_fig("gsc", 30, "stand", facing=1)
    put_figure(c, me, 76, 106, rim_col="#fff0a0", toward=(0, -1))
    vignette_kind(c, "bad", col="#0a0618", strength=0.75)


@ending("gsc_end_buried")
def gsc_end_buried(e):
    """BAD.  The deepest level, looking straight up the shaft: rings of rotten timber close in toward one thin crescent of
    cold light that rock has almost shut.  The player's back at the bottom, a dead lamp with its last ember beside them, and
    two clusters of faint violet scratches on the rock (the songs).  Bright mass: the crescent at top-centre."""
    c = e.c
    CX, CY = 96, 22
    wn = e.noise("rock")
    for y in range(108):
        for x in range(192):
            dx, dy = (x - CX) / 1.7, (y - CY)
            d = math.hypot(dx, dy)
            ring = math.sin(d * 0.5) * 0.5 + 0.5
            v = wn.fbm(x * 0.09, y * 0.09, 4)
            t = clamp(0.86 - d / 100.0 + (v - 0.5) * 0.45)
            if ring > 0.8:                                    # a timber ring: darker, regular
                t = t * 0.62
            c.set(x, y, ramp_pick(["#0a080c", "#1a1216", "#2c2022", "#46342c", "#6a5440"], t, x, y))
    # the crescent of light, nearly closed by a slump of rock
    for y in range(CY - 12, CY + 13):
        for x in range(CX - 20, CX + 21):
            dx, dy = (x - CX) / 1.7, (y - CY)
            d = math.hypot(dx, dy)
            if d < 10.5:
                inside_rock = math.hypot((x - CX - 6) / 1.7, y - CY - 2) < 9.5
                c.set(x, y, "#1a1220" if inside_rock else ramp_pick(["#8ab0c8", "#c8e4f0", "#ffffff"], 1 - d / 11.0, x, y))
    glow(c, CX - 7, CY - 1, 26, ["#2a2230", "#4a4660", "#7a86a0"], power=2.0, strength=0.6, ry=16)
    e.protect += ["#ffffff", "#c8e4f0"]
    # scratched songs: tally-like clusters left and right of the player
    rs = e.rng("scr")
    for (x0, y0) in ((30, 62), (36, 74), (150, 58), (158, 70)):
        for j in range(5):
            xs = x0 + j * 3 + rs.randint(0, 1)
            c.line([(xs, y0), (xs + rs.randint(-1, 1), y0 + rs.randint(4, 6))], "#8a5ad8")
        c.line([(x0 - 1, y0 + 2), (x0 + 15, y0 + 3)], "#8a5ad8")
    # rubble at the bottom, the dead lamp, the player
    ridge(c, 108, 8, 16, "#0c080a", seed=e.seed_for("rb"), fill_to=107, lite="#4a3a30")
    c.rect(122, 92, 126, 96, "#1c1410"); c.rect(121, 91, 127, 91, "#3a2c22")
    c.set(124, 94, "#ff7a2a"); blend(c, 123, 94, "#ff7a2a", 0.6, 3); blend(c, 125, 94, "#ff7a2a", 0.6, 3)
    light_pool(c, 124, 95, 14, 5, "#ff7a2a", t=0.4)
    e.protect += ["#ff7a2a"]
    light_pool(c, 96, 68, 48, 40, "#6a86a8", t=0.22)
    me = player_fig("gsc", 44, "stand", facing=1)
    img = tint(me["img"], "#0a0608", 0.92)
    img = rim(img, "#8aa8c8", (0, -1), min_run=3)
    place(c, img, 96, 104, anchor="bm")
    vignette_kind(c, "bad", col="#050304", strength=0.6)


@ending("gsc_end_claim_khorne")
def gsc_end_claim_khorne(e):
    """BAD / Khorne.  A pithead cap turned into a drum: a huge studded drumskin lit red from beneath, rings spreading across
    the dust; the player at its centre with a pick-handle raised, bodies of every kind lying round the rim.  Low red sun
    and broken hive towers behind.  Bright mass: low centre (the drum), not the sun."""
    c = e.c
    R = GOD["khorne"]["ramp"]
    HZ = 52
    sky(c, ["#14060c", "#2a0c1a", "#521018", "#8a1e12", "#c8441c", "#ec8a2c"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#2a0c1a", "#521018", "#8a1e12"], 2, 34, scale=0.06, thresh=0.52, stretch=5.0)
    # a low red sun half sunk behind the towers
    glow(c, 96, HZ, 70, ["#521018", "#8a1e12", "#c8441c", "#ec8a2c", "#ffc060"], power=1.3, strength=1.0, ry=40)
    c.ellipse(96, HZ - 2, 13, 13, "#ffc060")
    c.ellipse(96, HZ - 2, 9, 9, "#ffe0a0")
    rr = e.rng("tow")
    c.rect(0, HZ, 191, 107, "#1a0810")
    for k in range(20):
        x = rr.randint(0, 190)
        w = rr.randint(3, 9)
        h = rr.randint(6, 24)
        if 62 < x < 128:
            h = rr.randint(4, 9)
        c.poly([(x, HZ + 2), (x, HZ - h), (x + w // 2, HZ - h - rr.randint(0, 4)), (x + w, HZ - h + rr.randint(0, 5)), (x + w, HZ + 2)], "#1a0810")
    hband(c, HZ + 2, 107, ["#3a1418", "#2a0e12", "#180810"], seed=e.seed_for("gr"), rough=0.3)
    # ripples spreading across the dust
    for k, rx in enumerate((84, 104, 126)):
        ry = rx * 0.2
        for a in range(0, 360, 2):
            x = 96 + math.cos(math.radians(a)) * rx
            y = 86 + math.sin(math.radians(a)) * ry
            if y > HZ + 6:
                blend(c, int(x), int(y), "#c8441c", 0.55 - k * 0.12, 3)
    # the drum
    DX, DY, RX, RY = 96, 82, 62, 15
    for y in range(DY - RY - 8, DY + RY + 14):
        for x in range(DX - RX - 3, DX + RX + 4):
            d = math.sqrt(((x - DX) / float(RX)) ** 2 + ((y - DY) / float(RY)) ** 2)
            if d <= 1.0:
                ring = (d * 7.0) % 1.0
                t = clamp(1.0 - d * 0.9)
                col = ramp_pick(R, t * 0.95, x, y)
                if ring < 0.14:
                    col = mix(col, C("#2a060c"), 0.55)
                c.set(x, y, col)
            elif d <= 1.07:
                c.set(x, y, "#e8b060" if y < DY else "#8a5a2a")            # brass hoop
            elif y > DY and d <= 1.07 + (0.28 * (1 - abs(x - DX) / RX) if abs(x - DX) < RX else 0):
                c.set(x, y, "#3a0e12" if (x // 3) % 2 else "#521418")      # the drum's side
    for k in range(18):                                                    # studs / pegs on the hoop
        a = math.radians(k * 20 + 5)
        c.set(DX + math.cos(a) * RX * 1.04, DY + math.sin(a) * RY * 1.04, "#fff0b0")
    light_pool(c, DX, DY, 70, 18, "#ec8a2c", t=0.30)
    # the bodies round the rim (all kinds): lying silhouettes + the pile of xenos
    rb = e.rng("bod")
    for k in range(9):
        a = rb.uniform(0, 6.283)
        x = DX + math.cos(a) * (RX + 12 + rb.randint(0, 22))
        y = DY + 6 + abs(math.sin(a)) * (RY + 10 + rb.randint(0, 6))
        f = fig(rb.randint(12, 16), "lying", rb.choice(["#12060a", "#1c0a10", "#2a1018"]), facing=rb.choice((1, -1)))
        put_figure(c, f, x, min(104, y))
    shafts(c, (DX, DY - 4), -90, 40, 5, 44, "#ec8a2c", t=0.28, seed=e.seed_for("sh"), w0=4, w1=14, power=0.8)
    # the player on the skin, pick raised
    me = player_fig("gsc", 42, "arms_up", facing=1)
    img = tint(me["img"], "#0c0206", 0.92)
    img = rim(img, "#ffc060", (0, 1), min_run=2)
    cast_shadow(c, me["img"], DX + 2, DY + 3, origin=me["feet"], toward_light=(0, 1.0), length=0.0, squash=0.5, col="#2a060c", t=0.6)
    place(c, img, DX, DY + 3, anchor="bm")
    particles(c, "ember", 40, (20, 20, 172, 90), seed=e.seed_for("em"), cols=("#ffc060", "#ec8a2c", "#c8441c"), wind=(1, 1))
    vignette_kind(c, "bad", col="#10040a", strength=0.6)


@ending("gsc_end_claim_nurgle")
def gsc_end_claim_nurgle(e):
    """BAD / Nurgle.  Looking up out of a mined-out chamber through a ragged opening: the swarm drifts across the sickly
    sky and does not come down.  In the green shaft-light on a mound of warm moss the player sits, mushrooms growing from
    the shoulders, flies in the air.  Bright mass: the opening upper right; the player lit lower left."""
    c = e.c
    R = GOD["nurgle"]["ramp"]
    wn = e.noise("cave")
    OX, OY, ORX, ORY = 128, 16, 52, 26
    for y in range(108):
        for x in range(192):
            v = wn.fbm(x * 0.05, y * 0.07, 4)
            t = clamp(0.38 + (v - 0.5) * 0.9 - (y / 108.0) * 0.12)
            c.set(x, y, ramp_pick(["#080c04", "#10160a", "#222e12", "#3e5a1c"], t, x, y))
    # the opening and the sickly sky through it
    on = e.noise("open")
    for y in range(0, 52):
        for x in range(70, 192):
            d = math.sqrt(((x - OX) / float(ORX)) ** 2 + ((y - OY) / float(ORY)) ** 2) + (on.fbm(x * 0.1, y * 0.1, 3) - 0.5) * 0.35
            if d < 1.0:
                c.set(x, y, ramp_pick(["#6c8a2a", "#a8b84a", "#d8d880", "#f0e8a8"], clamp(0.2 + (1 - d) * 0.6 + (y / 60.0) * -0.1), x, y))
            elif d < 1.12:
                c.set(x, y, "#10160a")
    # the swarm passing: long dark bodies with trailing tendrils, none descending
    rs = e.rng("swarm")
    for (x, y, rx, ry) in ((100, 14, 12, 4), (126, 24, 18, 5), (156, 10, 9, 3), (140, 36, 7, 2), (170, 28, 13, 3)):
        c.ellipse(x, y, rx, ry, "#0c1206")
        for t_ in range(5):
            tx = x + rx - rs.randint(0, rx * 2)
            c.line([(tx, y + ry), (tx + rs.randint(-3, 3), y + ry + rs.randint(4, 9))], "#0c1206")
    # shaft-light falling onto the mound
    shafts(c, (118, 36), 112, 30, 4, 80, "#d8d880", t=0.30, seed=e.seed_for("sh"), w0=6, w1=18, power=0.6)
    # the mound of moss and the garden
    MX, MY = 62, 94
    for y in range(MY - 20, 108):
        for x in range(0, 150):
            d = math.sqrt(((x - MX) / 64.0) ** 2 + ((y - MY) / 18.0) ** 2)
            if d < 1.0 and y <= 107:
                v = on.fbm(x * 0.2, y * 0.25, 3)
                t = clamp(0.35 + (1 - d) * 0.6 + (v - 0.5) * 0.55 - (y - MY + 20) * 0.004)
                c.set(x, y, ramp_pick(R[1:], t, x, y))
    light_pool(c, 70, 76, 48, 22, "#d8d880", t=0.28)
    # the player, standing under the shaft-light, moss on the shoulders and mushrooms sprouting from them
    me = player_fig("gsc", 56, "stand", facing=1)
    img = tint(me["img"], "#10160a", 0.7)
    img = rim(img, "#d8d880", (1, -1), min_run=3)
    px_, py_ = place(c, img, 70, 102, anchor="bm")
    for yy in range(img.height):
        for xx in range(img.width):
            if img.load()[xx, yy][3] >= 128 and yy < img.height * 0.62 and on.fbm((px_ + xx) * 0.25, (py_ + yy) * 0.25, 2) > (0.46 + yy * 0.004):
                c.set(px_ + xx, py_ + yy, rs.choice(["#6c8a2a", "#a8b84a", "#3e5a1c", "#6c8a2a"]))
    hx_, hy_ = me["head"]
    c.set(px_ + hx_ + 2, py_ + hy_, "#f0e8a8")
    for (dx, dy, hh, cap) in ((-2, 10, 7, "#d8d880"), (7, 14, 5, "#c8d850"), (11, 24, 6, "#e8c878"), (-4, 26, 4, "#d8d880"), (3, -1, 4, "#f0e8a8")):
        _mushroom(c, px_ + hx_ + dx, py_ + dy, hh, cap, "#a8b84a", lit="#f0e8a8")
    for k in range(14):                                                    # the garden: flowers and caps
        x = rs.randint(8, 124)
        y = rs.randint(MY - 10, 104)
        if ((x - MX) / 64.0) ** 2 + ((y - MY) / 18.0) ** 2 < 0.9:
            if k % 3:
                _mushroom(c, x, y, rs.randint(3, 6), rs.choice(["#d8d880", "#c8d850", "#e8c878"]), "#a8b84a")
            else:
                c.set(x, y, "#f0e8a8"); c.set(x, y + 1, "#6c8a2a")
    # flies
    for k in range(18):
        x, y = rs.randint(30, 110), rs.randint(54, 92)
        c.set(x, y, "#10160a")
        blend(c, x + 1, y - 1, "#d8d880", 0.6, 3)
    vignette_kind(c, "bad", col="#080c04", strength=0.5)


@ending("gsc_end_claim_slaanesh")
def gsc_end_claim_slaanesh(e):
    """BAD / Slaanesh.  The empty chapel in one-point perspective with its vanishing point far right: rows of empty pews, and at
    the end a tall mirror-bright doorway of magenta and silver where She waits.  The player, large at lower left, face raised,
    sings; the song leaves as arcs that come back from the door sweeter.  Bright mass: the doorway, right of centre, low."""
    c = e.c
    G = GOD["slaanesh"]["ramp"]
    VX, VY = 128, 50                          # vanishing point
    BX0, BY0, BX1, BY1 = 108, 28, 150, 72     # the far wall
    # walls: big trapezoids around the far wall
    for y in range(108):
        for x in range(192):
            # left wall / right wall / ceiling / floor by position relative to the far-wall rectangle
            if x < BX0 and BY0 + (y - BY0) * 0 >= 0:
                pass
    wn = e.noise("stone")
    for y in range(108):
        for x in range(192):
            v = wn.fbm(x * 0.07, y * 0.1, 3)
            # distance to the vanishing point governs how lit the wall is
            d = math.hypot(x - VX, y - VY) / 120.0
            t = clamp(0.7 - d * 0.55 + (v - 0.5) * 0.35)
            c.set(x, y, ramp_pick(G[:4], t * 0.95, x, y))
    # far wall (lit by the doorway) and ceiling ribs
    c.rect(BX0, BY0, BX1, BY1, "#3a1058")
    for k in range(5):                                                    # ceiling ribs converge on the vanishing point
        x0 = 20 + k * 32
        c.line([(x0, 0), (VX + (x0 - VX) * 0.34, BY0)], "#10061a")
    for k in range(4):
        x0 = -20 + k * 22
        c.line([(x0, 108), (VX + (x0 - VX) * 0.34, BY1)], "#10061a")
    for (y0, y1) in ((0, BY0), (BY1, 108)):
        pass
    # floor: polished, with reflected light
    for y in range(BY1, 108):
        for x in range(192):
            u = (y - BY1) / float(108 - BY1)
            v = wn.fbm(x * 0.15, y * 0.4, 2)
            c.set(x, y, ramp_pick(["#10061a", "#1c0a2e", "#2e1048", "#4a1a6a"], clamp(0.25 + (1 - u) * 0.3 + (v - 0.5) * 0.3), x, y))
    # banners hanging on the left wall, dim
    for (bx, by, bw, bh) in ((20, 6, 9, 34), (48, 12, 7, 26), (74, 16, 5, 18)):
        c.rect(bx, by, bx + bw, by + bh, "#2a0e44")
        c.poly([(bx, by + bh), (bx + bw, by + bh), (bx + bw // 2, by + bh + 4)], "#2a0e44")
        c.rect(bx + 1, by + 2, bx + 1, by + bh - 3, "#5a2a7a")
    # the empty pews: low benches in perspective, both sides
    for side in (-1, 1):
        for k in range(5):
            z = 0.18 + k * 0.17                                    # 0 near .. 1 far
            sc = 1.0 - z
            y_floor = BY1 + (108 - BY1) * sc * 1.05
            xa = VX + side * (30 + 150 * sc)
            xb = VX + side * (12 + 60 * sc)
            hgt = 3 + 14 * sc
            xs = sorted((xa, xb))
            c.rect(xs[0], y_floor - hgt, xs[1], y_floor, "#0a0412")
            c.rect(xs[0], y_floor - hgt, xs[1], y_floor - hgt, "#6a3a8a")
    # the doorway: tall arch, mirror-bright
    DXc, DW = 129, 9
    for y in range(BY0 + 2, BY1 + 1):
        for x in range(DXc - DW, DXc + DW + 1):
            arch = y >= BY0 + 8 or abs(x - DXc) <= DW * math.sqrt(max(0.0, 1 - ((BY0 + 8 - y) / 8.0) ** 2))
            if arch:
                t = clamp(1 - abs(x - DXc) / float(DW + 1) * 0.8 - (y - BY0) / 80.0)
                c.set(x, y, ramp_pick(["#c850c8", "#ff8ad8", "#e8e8f8", "#ffffff"], t, x, y))
    glow(c, DXc, BY1 - 14, 46, ["#3a1058", "#7a2a9a", "#c850c8", "#ff8ad8"], power=2.2, strength=0.55, ry=40)
    # (the doorway is re-lit on top of the glow)
    for y in range(BY0 + 2, BY1 + 1):
        for x in range(DXc - DW, DXc + DW + 1):
            arch = y >= BY0 + 8 or abs(x - DXc) <= DW * math.sqrt(max(0.0, 1 - ((BY0 + 8 - y) / 8.0) ** 2))
            if arch:
                t = clamp(1 - abs(x - DXc) / float(DW + 1) * 0.8 - (y - BY0) / 80.0)
                c.set(x, y, ramp_pick(["#c850c8", "#ff8ad8", "#e8e8f8", "#ffffff"], t, x, y))
    for y in range(BY0 + 1, BY1 + 1):                                       # a thin dark frame with a silver edge
        for x in (DXc - DW - 2, DXc + DW + 2):
            c.set(x, y, "#10061a")
        c.set(DXc - DW - 1, y, "#8a6aa8"); c.set(DXc + DW + 1, y, "#8a6aa8")
    e.protect += ["#ffffff", "#ff8ad8"]
    # reflection of the door on the floor, a long stretched streak toward the viewer
    for y in range(BY1 + 1, 108):
        k = (y - BY1) / float(108 - BY1)
        w = int(DW * (1 + k * 3.0))
        for x in range(DXc - w, DXc + w):
            if (x + y) % 2 == 0 or k < 0.4:
                blend(c, x, y, "#ff8ad8", 0.7 * (1 - k * 0.8), 3)
    # the sound: arcs leaving the player's mouth toward the door, thinning
    mx, my = 40, 56
    for k in range(6):
        r = 8 + k * 9
        for a in range(-40, 41, 2):
            x = mx + math.cos(math.radians(a)) * r
            y = my + math.sin(math.radians(a)) * r * 0.7
            blend(c, int(x), int(y), "#ff8ad8", 0.85 - k * 0.12, 3)
    # the player: big, at lower left, side-on, head back
    me = player_fig("gsc", 66, "stand", facing=1)
    img = tint(me["img"], "#10061a", 0.85)
    img = rim(img, "#ff8ad8", (1, -0.3), min_run=2)
    img = rim(img, "#e8e8f8", (1, -1), min_run=3)
    place(c, img, 34, 118, anchor="bm")
    # applause: sparkles around the doorway
    particles(c, "mote", 22, (96, 16, 168, 80), seed=e.seed_for("app"), cols=("#e8e8f8", "#ff8ad8", "#ffffff"))
    vignette_kind(c, "bad", col="#08030e", strength=0.55)


def _smiler(c, cx, yb, w, robe, skin="#cabfb8", band=None):
    """front-facing, perfectly composed figure: round head w px wide, two eye pixels, the same three-pixel smile, shoulders to y=yb."""
    h = w + 1
    top = yb - w * 3 - 1
    for j in range(h):
        dx = (j - (h - 1) / 2.0) / (h / 2.0)
        half = int(round((w / 2.0) * math.sqrt(max(0.0, 1 - dx * dx))))
        c.rect(cx - half, top + j, cx + half, top + j, skin)
    ey = top + h // 2 - 1
    c.set(cx - w // 4 - 1, ey, "#2a2030"); c.set(cx + w // 4 + 1, ey, "#2a2030")
    sy = top + h // 2 + 2
    c.set(cx - w // 4 - 1, sy, "#8a5a6a"); c.set(cx + w // 4 + 1, sy, "#8a5a6a")
    c.rect(cx - w // 4, sy + 1, cx + w // 4, sy + 1, "#8a5a6a")
    sh = top + h + 1
    c.rect(cx - w, sh, cx + w, yb, robe)
    c.rect(cx - w + 1, sh - 1, cx + w - 1, sh - 1, robe)
    c.rect(cx - w, sh, cx - w, yb, mix(C(robe), (0, 0, 0), 0.25))
    if band:
        c.rect(cx - w + 1, sh + 1, cx + w - 1, sh + 1, band)


@ending("gsc_end_corrected")
def gsc_end_corrected(e):
    """BAD.  The chapel choir-loft: tiers of figures, every one with the same round pale face and the same three-pixel smile,
    in the same pale robe.  The only trace of one individual is a thin gold band on one shoulder (front row).  A tall window
    behind them shows pale lights beginning to come down; a hooded Magus, dark, at the left edge, his hand open.  Flat,
    washed-out lilac light.  Bright mass: the pale wall and window, centre-top."""
    c = e.c
    wn = e.noise("wall")
    for y in range(108):
        for x in range(192):
            t = clamp(0.58 - abs(x - 96) / 260.0 + (wn.fbm(x * 0.05, y * 0.08, 3) - 0.5) * 0.25 - y * 0.0018)
            c.set(x, y, ramp_pick(["#14102a", "#1e1a3a", "#2e2850", "#463e6c"], t, x, y))
    # the tall arched window behind, with the first lights coming down
    WX, WY0 = 96, 4
    for y in range(WY0, 62):
        for x in range(WX - 16, WX + 17):
            arch = y >= WY0 + 16 or abs(x - WX) <= 16 * math.sqrt(max(0.0, 1 - ((WY0 + 16 - y) / 16.0) ** 2))
            if arch:
                c.set(x, y, ramp_pick(["#120e2a", "#221a48", "#3a2e6a", "#5a4a8c"], (y - WY0) / 70.0, x, y))
            elif abs(x - WX) <= 18 and y >= WY0 + 14:
                c.set(x, y, "#2a2038")
    rl = e.rng("lights")
    for k in range(11):
        x, y = WX - 13 + k * 2.6 + rl.randint(-1, 1), rl.randint(10, 50)
        for j in range(5):
            blend(c, int(x), y - j, "#c8d8ff", 0.8 * (1 - j / 5.0), 3)
        c.set(int(x), y, "#ffffff")
    c.rect(WX, WY0 + 2, WX, 60, "#2a2038")                                  # mullions
    c.rect(WX - 15, 34, WX + 15, 34, "#2a2038")
    e.protect += ["#ffffff"]
    light_pool(c, WX, 40, 50, 36, "#c8d8ff", t=0.10)
    # three tiers of identical smilers
    ROBE = "#8c84aa"
    for (yb, w, step, off) in ((52, 3, 9, 4), (70, 4, 12, 0), (94, 6, 17, 7)):
        # tier ledge
        c.rect(0, yb + 1, 191, yb + 2, "#0e0a1c")
        c.rect(0, yb + 1, 191, yb + 1, "#4a4068")
        x = off
        while x < 192:
            band = None
            _smiler(c, x, yb, w, ROBE, band=band)
            x += step
    # the one with the thin gold band (front row), the only remnant of an individual
    _smiler(c, 7 + 17 * 4, 94, 6, ROBE, band="#d8a82a")
    e.protect += ["#d8a82a"]
    # the Magus at the left edge: hooded, dark, one open hand
    mg = figure(64, "reach", "#1a1030", facing=1, hood=True, robe=0.9, thick=1.15)
    img = rim(mg["img"], "#8a7eb8", (1, -1), min_run=3)
    mgx, mgy = place(c, img, 12, 112, anchor="bm")
    c.set(mgx + int(mg["head"][0]) + 2, mgy + int(mg["head"][1]), "#e0d0ff")
    c.set(mgx + int(mg["head"][0]) + 4, mgy + int(mg["head"][1]), "#e0d0ff")
    e.protect += ["#e0d0ff"]
    # the hum: faint rings over the room
    for k in range(4):
        r = 30 + k * 16
        for a in range(0, 360, 3):
            x = 96 + math.cos(math.radians(a)) * r * 1.6
            y = 8 + math.sin(math.radians(a)) * r * 0.5
            if 0 <= y < 62:
                blend(c, int(x), int(y), "#c8d8ff", 0.3, 2)
    vignette_kind(c, "bad", col="#0a0818", strength=0.6)


@ending("gsc_end_devoured")
def gsc_end_devoured(e):
    """BAD.  After the swarm: a stripped world.  Bare scoured stone to a low horizon where the last of the dark fleet is
    leaving, a pale column of dust still rising; at the left the empty hauler ramp with a dropped lamp at its foot (the marker
    of where the player fell); at right one small intact house, door open, a pale abstract four-armed mark on its wall.
    Cold grey-green light.  Bright mass: the horizon band, left."""
    c = e.c
    HZ = 66
    sky(c, ["#10161a", "#1c262c", "#2e3c40", "#46564e", "#6e7e60", "#98a478"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#1c262c", "#2e3c40", "#46564e"], 0, 46, scale=0.06, thresh=0.5, stretch=5.0)
    # the fleet, leaving: dark spindles climbing away up-left, smaller and fainter with distance, each trailing a tail
    rf = e.rng("fleet")
    for k in range(11):
        t = k / 10.0
        x = 150 - t * 120 + rf.randint(-4, 4)
        y = 46 - t * 34 + rf.randint(-3, 3)
        L_ = int(14 - t * 9) + 2
        ang = math.radians(-22)
        ca, sa = math.cos(ang), math.sin(ang)
        pts = [(-L_, 0), (-L_ * 0.3, -L_ * 0.28), (L_ * 0.5, -L_ * 0.18), (L_, 0), (L_ * 0.5, L_ * 0.18), (-L_ * 0.3, L_ * 0.28)]
        c.poly([(x + px * ca - py * sa, y + px * sa + py * ca) for (px, py) in pts], "#0a0e10")
        c.line([(x - L_ * ca, y - L_ * sa), (x - L_ * ca * 1.9, y - L_ * sa * 1.9 + 4)], "#0a0e10")
    # the column of dust still going up
    for y in range(0, HZ):
        w = 3 + int((HZ - y) * 0.06)
        for x in range(30 - w, 30 + w):
            blend(c, x, y, "#98a478", 0.4 * (y / float(HZ)) + 0.1, 3)
    c.rect(0, HZ, 191, HZ, "#1c2428")
    # stripped ground: scoured slabs with cracks, nothing living
    wn = e.noise("rock")
    for y in range(HZ + 1, 108):
        for x in range(192):
            k = (y - HZ) / float(108 - HZ)
            v = wn.fbm(x * 0.05, y * 0.16 / (0.3 + k), 4)
            c.set(x, y, ramp_pick(["#0e1418", "#1a2224", "#2c383a", "#44504e", "#5e6c64"], clamp(0.32 + (v - 0.5) * 0.7 + (1 - k) * 0.22), x, y))
    rcrk = e.rng("crk")
    for k in range(20):
        x, y = rcrk.randint(0, 191), rcrk.randint(HZ + 6, 106)
        for j in range(rcrk.randint(5, 14)):
            c.set(x, y, "#10161a")
            x += rcrk.choice((-1, 0, 1, 1)); y += rcrk.choice((0, 1))
    haze(c, HZ - 6, HZ + 10, "#98a478", t=0.4, seed=e.seed_for("hz"), profile="mid")
    # the hauler ramp at left: a slanted plate, the dropped lamp at its foot
    c.poly([(8, 100), (60, 78), (64, 82), (14, 106)], "#3a4448")
    c.poly([(8, 100), (60, 78), (60, 80), (10, 102)], "#8a9a90")
    c.rect(6, 100, 14, 106, "#1c2428")
    lamp_x, lamp_y = 72, 99
    c.rect(lamp_x, lamp_y, lamp_x + 5, lamp_y + 3, "#d8a82a")
    c.rect(lamp_x + 5, lamp_y + 1, lamp_x + 7, lamp_y + 2, "#fff0a0")
    c.rect(lamp_x, lamp_y, lamp_x + 5, lamp_y, "#fff0a0")
    light_pool(c, lamp_x + 8, lamp_y + 2, 12, 4, "#fff0a0", t=0.35)
    e.protect += ["#fff0a0", "#d8a82a"]
    # the one house that is still there, right of centre, door open, pale mark on the wall
    HX, HY = 132, 90
    c.rect(HX, HY - 14, HX + 26, HY, "#56625a")
    c.rect(HX, HY - 14, HX + 26, HY - 14, "#8a9a80")
    c.poly([(HX - 2, HY - 14), (HX + 28, HY - 14), (HX + 22, HY - 20), (HX + 4, HY - 20)], "#4a5658")
    c.rect(HX + 3, HY - 10, HX + 9, HY, "#10161a")                          # door, open, dark
    c.rect(HX + 18, HY - 9, HX + 22, HY - 5, "#10161a")                      # window
    _icon4(c, HX + 15, HY - 9, 3, "#e8e8d0")
    cast_shadow(c, Image.new("RGBA", (27, 18), (0, 0, 0, 255)), HX + 14, HY, toward_light=(-1, 0.1), length=0.9, squash=0.1, col="#10161a", t=0.5)
    # bare scraps in the foreground
    ridge(c, 108, 2, 5, "#10161a", seed=e.seed_for("fg"), fill_to=107)
    vignette_kind(c, "bad", col="#0a0e10", strength=0.55)


SHOE = [                      # a small child's shoe, side view, toe to the left; d = dark inside, l = lace, o = sole
    "......dd..",
    ".....#dd#.",
    "....#####.",
    "..l.######",
    ".l########",
    "##########",
    "oooooooooo",
]


def _shoe(c, x, y, scale=1, upper="#c8503a", sole="#e8e0d0"):
    """a lone child's shoe, top-left at (x, y)."""
    legend = {"#": C(upper), "o": C(sole), "d": C("#2a1210"), "l": C("#fff0d0")}
    for j, row in enumerate(SHOE):
        for i, ch in enumerate(row):
            if ch == ".":
                continue
            for sx in range(scale):
                for sy in range(scale):
                    c.set(x + i * scale + sx, y + j * scale + sy, legend[ch])
    for i in range(1, 9):                                            # a lighter top edge on the upper
        c.set(x + i * scale, y + 4 * scale, mix(C(upper), (255, 255, 255), 0.3)) if SHOE[4][i] == "#" else None


@ending("gsc_end_passenger")
def gsc_end_passenger(e):
    """BAD.  Inside the Endurance, cold strip light.  Left: the hatch with a seam, and wedged in the seam one small child's
    shoe, lit.  Centre-right: the window seat; the player's bust in profile, turned away from the hatch toward the porthole,
    where Kessin Tertius is one small violet star.  Bright mass: the porthole + ceiling strip, upper centre."""
    c = e.c
    WALL = ["#0c121a", "#18222e", "#2a3a4a", "#445a6c"]
    _panels(c, 0, 0, 191, 107, WALL, e.seed, pw=34, ph=26, seam="#080c12", tmin=0.3, tmax=0.5, rivets="#6a8296")
    # ceiling strip light, harsh
    c.rect(0, 0, 191, 6, "#0a1016")
    c.rect(30, 2, 170, 4, "#e8f4ff")
    c.rect(30, 5, 170, 5, "#9ab8cc")
    light_pool(c, 100, 10, 90, 26, "#cfe6f8", t=0.22)
    # --- the hatch on the left: slab door with a seam, hazard edge, a wheel
    for y in range(12, 104):
        for x in range(8, 66):
            t = clamp(0.42 + (e.noise("hatch").fbm(x * 0.07, y * 0.09, 3) - 0.5) * 0.4 - (y - 12) * 0.002)
            c.set(x, y, ramp_pick(["#10161e", "#202c38", "#34475a", "#566e84"], t, x, y))
    c.rect(8, 12, 65, 12, "#080c12"); c.rect(8, 103, 65, 103, "#080c12")
    c.rect(8, 12, 8, 103, "#080c12"); c.rect(65, 12, 65, 103, "#080c12")
    for y in range(12, 104):                                           # the seam: a dark gap down the middle
        c.set(36, y, "#03060a"); c.set(37, y, "#0a1016")
    for k in range(0, 40, 6):                                          # hazard stripes at the door edge
        c.line([(9, 14 + k), (15, 20 + k)], "#d8a82a")
        c.line([(58, 14 + k), (64, 20 + k)], "#d8a82a")
    c.ellipse(46, 56, 5, 5, "#0a1016"); c.ellipse(46, 56, 3, 3, "#6a8296"); c.set(46, 56, "#0a1016")
    # the shoe, caught in the seam low on the door, lit by a little floor light
    e.protect += ["#c8503a", "#e8e0d0", "#fff0d0"]
    # --- the porthole: centre-right, high; the star is Kessin Tertius
    PX, PY, PR = 108, 40, 19
    for y in range(PY - PR - 4, PY + PR + 5):
        for x in range(PX - PR - 4, PX + PR + 5):
            d = math.hypot(x - PX, y - PY)
            if d <= PR:
                c.set(x, y, ramp_pick(["#06061c", "#0e0c34", "#1a1650"], (y - (PY - PR)) / (2.0 * PR), x, y))
            elif d <= PR + 3:
                c.set(x, y, "#9ab0c0" if (x - PX + y - PY) < 4 else "#3a4a58")
            elif d <= PR + 4:
                c.set(x, y, "#080c12")
    rs = e.rng("st")
    for k in range(14):
        a, r = rs.uniform(0, 6.28), rs.uniform(0, PR - 2)
        c.set(PX + math.cos(a) * r, PY + math.sin(a) * r, rs.choice(["#5a5aa0", "#a8a8d8"]))
    sx_, sy_ = PX - 5, PY + 4
    for y in range(sy_ - 10, sy_ + 11):
        for x in range(sx_ - 10, sx_ + 11):
            if math.hypot(x - PX, y - PY) <= PR - 1:
                d = math.hypot(x - sx_, y - sy_) / 10.0
                if d < 1:
                    blend(c, x, y, "#b080ff", (1 - d) ** 1.5, 4)
    c.rect(sx_ - 1, sy_ - 1, sx_ + 1, sy_ + 1, "#d8b8ff"); c.set(sx_, sy_, "#ffffff")
    e.protect += ["#ffffff", "#b080ff"]
    light_pool(c, PX - 6, PY + 16, 34, 30, "#8a78ff", t=0.14)
    # --- floor
    hband(c, 100, 107, ["#18222e", "#0e1620", "#06080e"], seed=e.seed_for("fl"), rough=0.2)
    c.rect(0, 100, 191, 100, "#080c12")
    # the shoe, caught in the seam at the foot of the door, double size and lit: the first thing the eye finds
    light_pool(c, 34, 94, 24, 16, "#fff0d0", t=0.55)
    _shoe(c, 24, 92, scale=2)
    # --- the seat and the player: back of the seat, then the bust in profile facing the porthole (away from the hatch)
    c.rect(122, 62, 188, 107, "#1c2a44"); c.rect(122, 62, 188, 63, "#3a5078")
    for k in range(4):
        c.rect(124, 66 + k * 10, 186, 66 + k * 10, "#141e34")
    me = player_fig("gsc", 78, "stand", facing=-1)
    img = tint(me["img"], "#0a0e18", 0.82)
    img = rim(img, "#8a78ff", (-1, -0.4), min_run=3)
    img = rim(img, "#cfe6f8", (0, -1), min_run=3)
    img = img.crop((0, 0, img.width, 40))
    place(c, img, 150, 108, anchor="bm")
    vignette_kind(c, "bad", col="#04070c", strength=0.6)


@ending("gsc_end_purged")
def gsc_end_purged(e):
    """BAD.  A cell in the underhive.  One cold cone of light from the top left; in it the player kneels, head bowed, a long
    shadow behind.  At the right, in the dark, the Inquisitor in a wide hat and long coat holds a list that falls in a pale
    strip to the floor, rows of tiny marks, two rows near the end picked out: one red, the next with a small gold dot.
    Cell bars in the left foreground close the frame.  Bright mass: the cone and the list, left of centre / right."""
    c = e.c
    wn = e.noise("wall")
    for y in range(108):
        for x in range(192):
            t = clamp(0.35 + (wn.fbm(x * 0.06, y * 0.05, 4) - 0.5) * 0.7 - y * 0.0015)
            c.set(x, y, ramp_pick(["#06090e", "#0e161e", "#1a2832", "#2c4252"], t, x, y))
    # rust streaks and pipes on the back wall
    c.rect(0, 14, 191, 17, "#0a1218"); c.rect(0, 14, 191, 14, "#3a5262")
    for x in range(10, 192, 34):
        c.rect(x, 17, x + 2, 78, "#0c141a"); c.rect(x, 17, x, 78, "#2a3e4c")
    # floor
    hband(c, 80, 107, ["#2a3e4c", "#16222c", "#0a1016"], seed=e.seed_for("fl"), rough=0.3)
    c.rect(0, 80, 191, 80, "#06090e")
    # the cold cone from the top left, over the prisoner
    ox_, oy_ = 52, 0
    for y in range(0, 100):
        k = y / 100.0
        w = 6 + k * 34
        for x in range(int(ox_ + 12 * k - w), int(ox_ + 12 * k + w)):
            d = abs(x - (ox_ + 12 * k)) / w
            blend(c, x, y, "#cfe6f0", 0.45 * (1 - d * d) * (0.55 + 0.45 * k), 3)
    light_pool(c, 64, 94, 38, 9, "#cfe6f0", t=0.6)
    # the prisoner: kneeling, head down, big enough to read
    me = player_fig("gsc", 44, "kneel", facing=1)
    img = rim(me["img"], "#fff0a0", (-0.4, -1), min_run=2)
    cast_shadow(c, me["img"], 64, 96, origin=me["feet"], toward_light=(-0.8, 0.5), length=1.1, squash=0.3, col="#02040a", t=0.7)
    place(c, img, 64, 97, anchor="bm")
    # the Inquisitor, dark at the right: long coat, wide hat, the list
    insp = figure(70, "stand", "#080c12", facing=-1, robe=0.8, thick=1.15)
    img2 = rim(insp["img"], "#6a8296", (-1, -0.3), min_run=3)
    qx, qy = place(c, img2, 140, 100, anchor="bm")
    hx2, hy2 = insp["head"]
    cx_, cy_ = qx + int(hx2), qy + int(hy2)
    c.rect(cx_ - 10, cy_ - 5, cx_ + 10, cy_ - 4, "#05070c")
    c.rect(cx_ - 6, cy_ - 11, cx_ + 6, cy_ - 5, "#05070c")
    c.rect(cx_ - 10, cy_ - 5, cx_ - 6, cy_ - 5, "#3a5262")
    # the list: a pale strip from his hand to the floor, then curling along it
    lx = 120
    hy_ = qy + int(insp["hands"][0][1])
    for y in range(hy_, 100):
        for x in range(lx, lx + 9):
            c.set(x, y, "#d4dccc" if x < lx + 8 else "#8a9a98")
    for y in range(hy_ + 2, 100, 2):                                  # rows of tiny entries
        rr = random.Random(y * 7 + 3)
        for k in range(rr.randint(2, 3)):
            xs = lx + 1 + rr.randint(0, 4)
            c.rect(xs, y, xs + rr.randint(1, 3), y, "#4a5a58")
    # the two lines near the bottom: red mark, then a gold dot (Nell)
    ry_ = 90
    c.rect(lx + 1, ry_, lx + 7, ry_, "#c8302a")
    c.rect(lx + 1, ry_ + 2, lx + 5, ry_ + 2, "#4a5a58")
    c.rect(lx + 1, ry_ + 4, lx + 1, ry_ + 4, "#d8a82a")
    c.rect(lx + 3, ry_ + 4, lx + 6, ry_ + 4, "#4a5a58")
    e.protect += ["#c8302a", "#d8a82a"]
    c.poly([(lx, 100), (lx + 8, 100), (lx + 20, 104), (lx + 8, 106)], "#d4dccc")      # the foot of the list curls on the floor
    # cell bars in front, left foreground, closing the frame
    for bx in (6, 26, 46):
        c.rect(bx, 0, bx + 2, 107, "#04060a")
        c.rect(bx, 0, bx, 107, "#22323e")
    c.rect(0, 30, 52, 32, "#04060a"); c.rect(0, 30, 52, 30, "#22323e")
    vignette_kind(c, "bad", col="#04060a", strength=0.7)


@ending("gsc_end_seed")
def gsc_end_seed(e):
    """BAD.  Aurex Secundus, five years on, seen from the street at night.  One lit tenement window: a family at supper, one
    extra place laid and steaming at an empty chair, a small gold mark on the wall (abstract), and every one of the children has
    the same pale violet eyes.  The player is a small dark figure in the street.  Bright mass: the window, right of centre."""
    c = e.c
    wn = e.noise("facade")
    for y in range(108):
        for x in range(192):
            t = clamp(0.38 + (wn.fbm(x * 0.05, y * 0.04, 4) - 0.5) * 0.6 - y * 0.001)
            c.set(x, y, ramp_pick(["#0a0e1c", "#141a30", "#222a48", "#363e62"], t, x, y))
    # stacked tenement windows (dark), pipes, a sign bracket
    for gy in range(3):
        for gx in range(7):
            x, y = 4 + gx * 28, 6 + gy * 22
            if (x + 8 > 90 and x < 160 and y + 14 > 30 and y < 76):
                continue
            c.rect(x, y, x + 13, y + 12, "#06080e")
            c.rect(x, y + 12, x + 13, y + 13, "#46507a")
            if (gx * 3 + gy * 5) % 11 == 0:
                c.rect(x + 2, y + 2, x + 11, y + 10, "#2a2a58")
    for x in (82, 168):
        c.rect(x, 0, x + 2, 84, "#10142a"); c.rect(x, 0, x, 84, "#3a4470")
    # street
    hband(c, 84, 107, ["#2a3050", "#161c34", "#0a0e1c"], seed=e.seed_for("st"), rough=0.2)
    c.rect(0, 84, 191, 85, "#06080e")
    # --- the lit window
    WX0, WY0, WX1, WY1 = 96, 28, 156, 74
    for y in range(WY0, WY1 + 1):
        for x in range(WX0, WX1 + 1):
            t = clamp(0.35 + (1 - (y - WY0) / float(WY1 - WY0)) * 0.3 + (1 - abs(x - 126) / 40.0) * 0.25)
            c.set(x, y, ramp_pick(["#6a4026", "#a8703a", "#e0a050", "#ffd890"], t, x, y))
    c.rect(WX0 - 3, WY0 - 3, WX1 + 3, WY0 - 1, "#06080e"); c.rect(WX0 - 3, WY1 + 1, WX1 + 3, WY1 + 4, "#06080e")
    c.rect(WX0 - 3, WY0 - 3, WX0 - 1, WY1 + 4, "#06080e"); c.rect(WX1 + 1, WY0 - 3, WX1 + 3, WY1 + 4, "#06080e")
    c.rect(WX0 - 4, WY1 + 4, WX1 + 4, WY1 + 6, "#46507a")
    # the gold mark on the back wall: abstract, small
    _icon4(c, 126, 40, 5, "#fff0a0", glowc="#fff0a0")
    c.rect(118, 33, 134, 33, "#8a5a2a")
    # supper table and the people (backlit silhouettes, eyes pale violet)
    c.rect(WX0, 62, WX1, 66, "#3a2216"); c.rect(WX0, 62, WX1, 62, "#c89a58")
    c.rect(WX0, 67, WX1, WY1, "#1a100c")
    rp = e.rng("fam")
    seats = [(106, 21, "#1a1018"), (116, 15, "#1a1018"), (136, 12, "#1a1018"), (146, 17, "#1a1018")]
    for (x, h, col) in seats:
        w = 4 if h < 18 else 5
        c.ellipse(x, 62 - h + 3, w - 1, w, col)                       # head
        c.rect(x - w - 1, 62 - h + 8, x + w + 1, 62, col)             # shoulders
        c.set(x - 2, 62 - h + 3, "#c9a8ff"); c.set(x + 1, 62 - h + 3, "#c9a8ff")   # pale violet eyes
    e.protect += ["#c9a8ff"]
    # the empty chair with a place laid, steaming
    c.rect(126, 56, 129, 66, "#1a100c")                              # chair back, empty
    c.rect(124, 60, 134, 61, "#f0e0c0"); c.rect(125, 59, 133, 59, "#fff6e0")      # the plate
    for k in range(6):
        blend(c, 128 + (k % 2), 56 - k, "#fff6e0", 0.7, 3)
    for px_ in (110, 120, 140, 150):
        c.rect(px_, 60, px_ + 3, 61, "#f0e0c0")                       # plates
    # the glow spilling into the street
    for y in range(WY1 + 7, 107):
        k = (y - WY1) / 30.0
        for x in range(int(WX0 - 20 * k), int(WX1 + 6 + 20 * k)):
            blend(c, x, y, "#ffc070", 0.28 * (1 - k * 0.8), 3)
    # the player, small, dark, in the street; looking up at it
    me = player_fig("gsc", 24, "stand", facing=1)
    img = tint(me["img"], "#06080e", 0.8)
    img = rim(img, "#ffc070", (1, -0.3), min_run=2)
    cast_shadow(c, me["img"], 40, 100, origin=me["feet"], toward_light=(1.0, 0.3), length=1.2, squash=0.25, col="#04060a", t=0.6)
    place(c, img, 40, 100, anchor="bm")
    vignette_kind(c, "bad", col="#04060c", strength=0.55)


# ====================================================================== DEATH

def _dissolve_top(img, rows):
    """dissolve the top `rows` rows of an RGBA figure into dither (the person coming apart upward)."""
    flipped = img.transpose(Image.FLIP_TOP_BOTTOM)
    flipped = fade_bottom(flipped, rows)
    return flipped.transpose(Image.FLIP_TOP_BOTTOM)


@ending("gsc_death_hp")
def gsc_death_hp(e):
    """DEATH.  The mine gallery at floor level.  Foreground left: the player's lamp, fallen on its side, throws amber light
    up a wall of small scratched carvings (stick figures with many arms, falling stars).  Far down the tunnel, small and black
    against a violet glow, hooded figures are already carrying someone away between them, carefully.  Bright mass: the far
    glow, centre right; the lamp, lower left."""
    c = e.c
    VX, VY = 132, 52
    wn = e.noise("rock")
    # tunnel: dark walls graded toward the far glow
    for y in range(108):
        for x in range(192):
            d = math.hypot((x - VX) / 1.6, y - VY)
            t = clamp(0.66 - d / 120.0 + (wn.fbm(x * 0.08, y * 0.1, 4) - 0.5) * 0.4)
            c.set(x, y, ramp_pick(["#040306", "#0e0a0e", "#1c1416", "#34261e", "#5a4230"], t, x, y))
    # the far glow and the end of the tunnel
    glow(c, VX, VY, 34, ["#1a0e2a", "#3a2060", "#7a50c0", "#c8a0ff", "#f4e8ff"], power=1.3, strength=1.0, ry=30)
    # timber frames receding
    for k in range(7):
        z = 0.12 + k * 0.13
        sc = (1 - z)
        hw, hh = 12 + 130 * sc * 0.9, 8 + 70 * sc * 0.9
        x0, x1, y0, y1 = VX - hw, VX + hw, VY - hh, VY + hh * 0.8
        col = "#0a0608"
        c.line([(x0, y1), (x0, y0), (x1, y0), (x1, y1)], col, width=max(1, int(3 * sc) + 1))
    # floor and rails
    for y in range(VY + 6, 108):
        for x in range(192):
            k = (y - VY) / float(108 - VY)
            blend(c, x, y, "#0a0608", 0.35 * k, 3)
    c.line([(VX - 4, VY + 6), (60, 108)], "#6a5a50"); c.line([(VX + 4, VY + 6), (190, 108)], "#6a5a50")
    # carvings on the left wall: lit by the lamp
    for (cx_, cy_, kind) in ((14, 40, "fig"), (30, 34, "star"), (46, 44, "fig"), (24, 58, "star"), (40, 62, "fig"), (10, 70, "star")):
        if kind == "fig":
            _icon4(c, cx_, cy_, 5, "#c8a060")
        else:
            c.line([(cx_, cy_), (cx_ + 5, cy_ + 5)], "#e8d090"); c.set(cx_ - 1, cy_ - 1, "#fff0c0"); c.line([(cx_ + 1, cy_ - 1), (cx_ + 7, cy_ + 3)], "#7a6a48")
    light_pool(c, 28, 52, 34, 30, "#ffb060", t=0.38)
    # the lamp, fallen: body, lens, a beam up the wall
    c.rect(20, 95, 34, 100, "#d8a82a"); c.rect(20, 95, 34, 95, "#fff0a0")
    c.rect(34, 96, 40, 99, "#fff0a0"); c.rect(36, 97, 38, 98, "#ffffff")
    c.rect(18, 97, 20, 99, "#6a5a30")
    shafts(c, (40, 97), -50, 24, 3, 62, "#ffd890", t=0.35, seed=e.seed_for("sh"), w0=3, w1=14, power=0.7)
    light_pool(c, 36, 101, 28, 6, "#ffb060", t=0.5)
    e.protect += ["#ffffff", "#fff0a0"]
    # far away: two hooded carriers and the one they carry between them (all black against the glow)
    car1 = figure(34, "stand", "#04030a", facing=1, hood=True, robe=0.9)
    car2 = figure(34, "stand", "#04030a", facing=-1, hood=True, robe=0.9)
    put_figure(c, car1, VX - 20, VY + 28)
    put_figure(c, car2, VX + 20, VY + 28)
    body = figure(30, "lying", "#06040c")
    place(c, body["img"], VX, VY + 10, anchor="bm")
    vignette_kind(c, "death")


@ending("gsc_death_corruption")
def gsc_death_corruption(e):
    """DEATH.  A procession, seen from behind, walking down a black hall toward a violet light: every figure the same, hunched,
    with an extra pair of arms.  The nearest one, lower left, is the player: the same shape now, a few plates of hard violet
    along the spine, a last thread of gold at the shoulder.  Their helmet lies on the floor behind them, lamp out.
    Bright mass: the far light, upper right; the floor streak toward it."""
    c = e.c
    LX, LY = 150, 40
    for y in range(108):
        for x in range(192):
            d = math.hypot(x - LX, (y - LY) * 1.3)
            blend_t = clamp(1 - d / 150.0)
            c.set(x, y, ramp_pick(["#030208", "#0a0614", "#160c2a", "#2a1650"], blend_t * 0.9, x, y))
    # the light: a ring and a core, no detail, the "old voice"
    glow(c, LX, LY, 38, ["#2a1650", "#5a30a0", "#9a6ae0", "#d8c0ff", "#ffffff"], power=1.7, strength=1.0, ry=34)
    for r_, col in ((15, "#e8d8ff"), (21, "#9a6ae0")):
        for a in range(0, 360, 2):
            blend(c, int(LX + math.cos(math.radians(a)) * r_), int(LY + math.sin(math.radians(a)) * r_ * 0.9), col, 0.55, 3)
    haze(c, 30, 70, "#6a3ab8", t=0.55, seed=e.seed_for("hz"), profile="mid", scale=0.02)
    e.protect += ["#ffffff"]
    # floor: black glass with the light's long reflection toward the viewer
    for y in range(58, 108):
        for x in range(192):
            k = (y - 58) / 50.0
            c.set(x, y, ramp_pick(["#06040e", "#0e0820", "#1a1038"], clamp(0.3 + (1 - k) * 0.3), x, y))
            w = 8 + k * 46
            if abs(x - (LX - k * 40)) < w:
                blend(c, x, y, "#9a6ae0", 0.45 * (1 - k * 0.75) * (1 - abs(x - (LX - k * 40)) / w), 3)
    c.rect(0, 58, 191, 58, "#2a1650")
    # the procession: along a diagonal toward the light, shrinking
    rp = e.rng("proc")
    for k in range(8):
        t = k / 7.0
        h = int(58 - t * 40)
        x = int(52 + t * 82)
        y = int(104 - t * 40)
        f = figure(h, "hunch", "#030208", facing=1, thick=1.05)
        img = f["img"]
        sh_x, sh_y = f["head"][0], f["head"][1] + 0.15 * h
        img = img.copy()
        # the extra pair: two limbs from the shoulders, forward and down (same colour)
        ex = ImageDraw.Draw(img)
        a0 = (sh_x, sh_y)
        for (dx, dy) in ((0.22, 0.34), (0.30, 0.18)):
            ex.line([a0, (a0[0] + dx * h, a0[1] + dy * h)], fill=(3, 2, 8, 255), width=max(1, int(h * 0.07)))
        img = rim(img, "#9a6ae0", (1, -0.2), min_run=2)
        if k == 0:                                           # the player: plates of hard violet and a thread of gold
            px = img.load()
            for yy in range(int(f["head"][1] + 0.1 * h), int(f["head"][1] + 0.5 * h), 3):
                for xx in range(img.width):
                    if px[xx, yy][3] >= 128 and xx < img.width * 0.5:
                        px[xx, yy] = (90, 56, 150, 255)
            hy_ = int(f["head"][1] + 0.075 * h + 1)
            for xx in range(img.width):
                if px[xx, hy_][3] >= 128:
                    px[xx, hy_] = (150, 120, 40, 255)
        cast_shadow(c, f["img"], x + 4, y, origin=f["feet"], toward_light=(1.0, 0.3), length=0.8, squash=0.22, col="#02010a", t=0.6)
        place(c, img, x, y, anchor="bm")
    # the helmet left behind, lamp dark
    c.ellipse(24, 102, 6, 4, "#8a6c1c"); c.rect(18, 102, 30, 105, "#8a6c1c")
    c.rect(18, 102, 30, 102, "#d8a82a"); c.rect(14, 103, 17, 104, "#3a2a10")
    light_pool(c, 24, 102, 14, 4, "#9a6ae0", t=0.3)
    vignette_kind(c, "death")


@ending("gsc_death_sanity")
def gsc_death_sanity(e):
    """DEATH.  A great dark hall with tiers of pale, identical, soft-glowing faces rising on both sides of a central aisle, a
    hundred voices.  At the far end of the aisle one face is a little warmer than the rest: the gentlest.  The player
    walks up the aisle toward it, from behind, and is coming apart upward into motes that drift into the crowd.
    Bright mass: the warm face, upper centre; the pale rows on both sides."""
    c = e.c
    for y in range(108):
        for x in range(192):
            d = math.hypot(x - 96, (y - 24) * 1.2) / 140.0
            c.set(x, y, ramp_pick(["#030208", "#080614", "#120c26", "#1e1440"], clamp(0.9 - d) * 0.8, x, y))
    # floor of the aisle: faint lines converging
    for x in range(-60, 260, 24):
        c.line([(96 + (x - 96) * 0.1, 30), (96 + (x - 96) * 1.1, 107)], "#120c26")
    rf = e.rng("faces")
    rows = [(18, 3, 4), (27, 3, 4), (36, 4, 5), (46, 4, 5), (57, 5, 6), (69, 6, 7), (82, 7, 8), (97, 8, 9)]
    for (y, fw, fh) in rows:
        gap = fw * 2 + 2
        aisle = 6 + (y - 18) * 0.35                                   # the aisle widens toward the viewer
        x = 2 + rf.randint(0, 3)
        while x < 192:
            if abs(x - 96) > aisle:
                xx = x + rf.randint(-1, 1)
                yy = y + rf.randint(-1, 1)
                glow(c, xx, yy, fw + 3, ["#2a1c50", "#4a3a8a", "#6a5aa8"], power=1.0, strength=0.55)
                c.ellipse(xx, yy, fw // 2, fh // 2, "#b8a8e0")
                c.set(xx - fw // 4, yy - 1, "#1a1030"); c.set(xx + fw // 4, yy - 1, "#1a1030")
            x += gap
    # the gentlest voice: warm, a little larger, softly lit, at the end of the aisle
    glow(c, 96, 22, 16, ["#4a2e30", "#a86a44", "#e8b070", "#fff0c8"], power=1.3, strength=1.0)
    c.ellipse(96, 22, 3, 4, "#fff0d0")
    c.set(95, 21, "#6a4030"); c.set(97, 21, "#6a4030"); c.rect(95, 24, 97, 24, "#b87050")
    e.protect += ["#fff0d0"]
    # the player: walking up the aisle, coming apart from the top
    me = player_fig("gsc", 56, "walk", facing=1)
    img = tint(me["img"], "#06040e", 0.72)
    img = rim(img, "#e8b070", (0, -1), min_run=2)
    img = _dissolve_top(img, 26)
    px_, py_ = place(c, img, 92, 106, anchor="bm")
    rm = e.rng("motes")
    for k in range(46):                                            # the rest of them, drifting up and out into the crowd
        t = rm.random()
        x = px_ + img.width // 2 + rm.uniform(-4, 4) + t * rm.uniform(-26, 26)
        y = py_ + 4 - t * rm.uniform(10, 64)
        blend(c, int(x), int(y), rm.choice(["#e8b070", "#b8a8e0", "#fff0c8"]), 0.8 - t * 0.4, 3)
    vignette_kind(c, "death")
