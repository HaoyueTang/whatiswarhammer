"""SPEC §31 ending illustrations — Necron route (nec_*).  See endkit.py for the helper conventions."""
import math
import random
from reg import ending
from endkit import *


@ending("nec_end_truth")
def nec_end_truth(e):
    """GOOD.  The Living Copy: through a shuttle's viewport the sun clears the limb of the world while the purge
    fire blooms over the desert below; in profile in the foreground, the one who got out holds the report to
    their chest.  Gold from the left, orange from the right, a dark warm cabin around it."""
    c = e.c
    WX0, WX1, WY0, WY1, RAD = 20, 172, 7, 81, 16

    def in_win(x, y):
        if not (WX0 <= x <= WX1 and WY0 <= y <= WY1):
            return False
        dx = max(WX0 + RAD - x, x - (WX1 - RAD), 0)
        dy = max(WY0 + RAD - y, y - (WY1 - RAD), 0)
        return dx * dx + dy * dy <= RAD * RAD

    # --- what is outside: space, a golden sunrise at the limb, the planet, the fire
    CX, CY, R = 96, 255, 212
    sunx = 34
    sn, dn = e.noise("surf"), e.noise("dunes")
    for y in range(WY0 - 2, WY1 + 3):
        for x in range(WX0 - 2, WX1 + 3):
            limb = CY - math.sqrt(max(0.0, R * R - (x - CX) ** 2))
            if y < limb:
                d = limb - y                                       # height above the limb
                sun_k = clamp(1.0 - abs(x - sunx) / 130.0)
                atm = clamp(1.0 - d / (7.0 + 14 * sun_k))
                t = clamp(atm * (0.55 + 0.5 * sun_k) + (0.0 if atm > 0 else 0))
                if atm > 0:
                    c.set(x, y, ramp_pick(["#060a1e", "#0c2a5a", "#2a6ab0", "#7ac8e8", "#d8f4f0", "#fff4c8"], t, x, y))
                else:
                    sky_t = clamp((y - 0) / 60.0)
                    c.set(x, y, ramp_pick(["#02030c", "#050a1c", "#08102a"], sky_t, x, y))
            else:
                d = y - limb                                       # depth below the limb
                lit = clamp(1.05 - (x - 10) / 190.0 * 0.5 - max(0, d - 20) * 0.003)
                v = sn.fbm(x * 0.05, y * 0.15, 4) * 0.5 + dn.fbm(x * 0.03 + y * 0.01, y * 0.3, 3) * 0.5
                t = clamp(lit * 0.75 + (v - 0.5) * 0.55 - clamp((d - 14) / 25.0) * 0.08)
                c.set(x, y, ramp_pick(["#1a0e0c", "#3a1e14", "#6e3c20", "#b0703c", "#e0a860", "#f6d89a"], t, x, y))
    stars(c, e.seed_for("st"), 120, WY0, 52, cols=("#6a7aa8", "#c8d8f0", "#ffffff"),
          mask=lambda x, y: in_win(x, y) and y < CY - math.sqrt(max(0.0, R * R - (x - CX) ** 2)) - 9)
    # the sun clearing the limb: flare, lens streak
    glow(c, sunx, 49, 34, ["#2a6ab0", "#7ac8e8", "#ffe8b0", "#fff8e0"], power=1.5, strength=1.0, ry=22)
    c.ellipse(sunx, 49, 3, 3, "#ffffff")
    c.rect(sunx - 30, 49, sunx + 38, 49, "#fff4c8")
    c.rect(sunx - 18, 48, sunx + 22, 48, "#ffe0a0")
    c.rect(sunx - 14, 50, sunx + 18, 50, "#ffe0a0")
    # purge fire: a bloom on the desert, ash ring, tongues, secondary fires, the tomb's faint green heart
    bx, by = 124, 68
    def ell(cx, cy, rx, ry, col):
        for yy in range(int(cy - ry), int(cy + ry) + 1):
            for xx in range(int(cx - rx), int(cx + rx) + 1):
                if ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2 <= 1 and in_win(xx, yy):
                    c.set(xx, yy, col)
    glow(c, bx, by, 38, ["#4a1e10", "#8a3416", "#d8601e"], power=1.3, strength=0.9, ry=13)
    ell(bx, by, 29, 8.5, "#2a1410")
    ell(bx, by, 24, 7, "#5a2a14")
    ell(bx, by, 18, 5.4, "#c8481a")
    ell(bx, by, 12, 3.8, "#ff8a2a")
    ell(bx, by, 6, 2.2, "#ffd060")
    c.set(bx, by, "#c8ffd8"); c.set(bx + 1, by, "#ffffff")
    rr = e.rng("fire")
    for k in range(22):
        a = k / 22.0 * 2 * math.pi + rr.uniform(-0.1, 0.1)
        L1 = rr.uniform(16, 30)
        x2, y2 = bx + math.cos(a) * L1, by + math.sin(a) * L1 * 0.3
        c.line([(bx + math.cos(a) * 8, by + math.sin(a) * 2.4), (x2, y2)], "#ff8a2a" if k % 2 else "#ffd060")
    for (fx, fy, fr) in [(88, 63, 3), (100, 76, 2), (150, 72, 3), (160, 64, 2), (138, 79, 2)]:
        glow(c, fx, fy, fr * 2 + 3, ["#6a2a14", "#e0701e", "#ffd060"], power=1.2, strength=0.95, ry=fr)
    for k in range(30):                                       # embers rising toward the camera
        c.set(bx + rr.randint(-34, 34), by - rr.randint(2, 14), "#ffb040")
    # --- the cabin: bevelled frame, wall plates, seat, console
    CAB = ["#0c101c", "#161c2c", "#202a40", "#2c384e"]
    for y in range(108):
        for x in range(192):
            if in_win(x, y):
                continue
            # distance to the window = frame thickness (cheap test by probing)
            near = any(in_win(x + dx, y + dy) for dx in (-6, -3, 0, 3, 6) for dy in (-6, -3, 0, 3, 6))
            near2 = any(in_win(x + dx, y + dy) for dx in (-2, 0, 2) for dy in (-2, 0, 2))
            if near2:
                c.set(x, y, "#3a4660" if (x + y) % 2 else "#2e384e")
            elif near:
                c.set(x, y, "#1e2638")
            else:
                t = 0.25 + 0.4 * ((y // 9 + x // 27) % 2) * 0.4 + (0.12 if (y % 9 == 0 or x % 27 == 0) else 0)
                c.set(x, y, ramp_pick(CAB, t, x, y))
    for (rx_, ry_) in [(10, 14), (10, 74), (182, 14), (182, 74), (96, 3), (60, 100), (150, 100)]:
        c.set(rx_, ry_, "#4a5670"); c.set(rx_ + 1, ry_, "#10141e")
    # window light spilling on the frame / cabin floor
    light_pool(c, 70, 92, 70, 14, "#ffc880", t=0.18)
    light_pool(c, 140, 92, 50, 12, "#ff8a3a", t=0.16)
    # console strip along the bottom, small status lights
    c.rect(0, 94, 191, 107, "#0a0d14")
    c.rect(0, 94, 191, 94, "#2a3450")
    rr2 = e.rng("lights")
    for x in range(8, 184, 6):
        if rr2.random() < 0.7:
            c.set(x, 98 + rr2.randint(0, 2), rr2.choice(["#2ee8c8", "#ffb040", "#2ee8c8", "#ff5a3a"]))
    # seat back and the passenger (profile, facing the window), the report held to the chest
    for yy in range(66, 108):
        for xx in range(18, 70):
            if ((xx - 44) / 25.0) ** 2 + ((yy - 108) / 44.0) ** 2 < 1.0 or (xx > 20 and yy > 84):
                c.set(xx, yy, ramp_pick(["#0a0c14", "#14182a", "#222a40"], 0.8 - (xx - 18) / 60.0, xx, yy))
    me = player_fig("necrons", 46, "sit", facing=1)
    img = tint(me["img"], "#0a0c14", 0.5)
    img = rim(img, "#ffd890", (-1, -1))
    img = rim(img, "#ff8a3a", (1, 0))
    mx, my = place(c, img, 50, 102, anchor="bm")
    hx_, hy_ = me["hands"][0]
    pxx, pyy = mx + int(hx_), my + int(hy_)
    c.rect(pxx - 2, pyy - 6, pxx + 5, pyy + 1, "#e8dcc0")                  # the report
    c.rect(pxx - 2, pyy - 6, pxx + 5, pyy - 6, "#ffffff")
    c.rect(pxx + 5, pyy - 6, pxx + 5, pyy + 1, "#b8a888")
    for k in (-4, -2, 0):
        c.rect(pxx - 1, pyy + k, pxx + 3, pyy + k, "#8a7a5a")
    particles(c, "mote", 18, (14, 10, 176, 90), seed=e.seed_for("mote"), cols=("#ffe8b0", "#fff6d8"))
    vignette_kind(c, "good", col="#06080e", strength=0.3)
