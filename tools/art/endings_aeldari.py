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
