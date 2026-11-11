"""Chaos-god sigils (32x32). ORIGINAL geometric emblems that only evoke each power —
deliberately not the published symbols (no skull-rune, no eight-arrow star)."""
import math
from reg import sprite
from pxlib import Sprite, hx, union, sub, inter, ramp, P as Pm

BRASS = ramp("#c08a3a", light=0.20)
RED = ramp("#b8241e", light=0.16)
GREEN = ramp("#7a9a3a", light=0.14)
RUSTG = ramp("#6a5a2a")
BLUE = ramp("#3a6ae0", light=0.22)
PINK = ramp("#e05ab0", light=0.16)
LILAC = ramp("#b08ae0", light=0.12)
MAUVE = ramp("#7a3a9a", light=0.18)
BONE = ramp("#d8cca8", light=0.08)


def ring(s, cx, cy, r0, r1):
    return sub(s.E(cx, cy, r1, r1), s.E(cx, cy, r0, r0))


@sprite("sigil_khorne", 32, "恐虐印记", "Sigil of the Blood God", "sigil")
def sigil_khorne(flip=False):
    """angular brass crown-blade over a red split diamond."""
    s = Sprite(32)
    s.add(BRASS, s.P((3, 6), (28, 6), (25, 11), (6, 11)), mode="vert", lt=0.4)            # top bar
    for x in (6, 15, 24):
        s.add(BRASS, s.P((x - 2, 6), (x + 2, 6), (x, 1)), mode="cyl")                       # three teeth
    s.add(RED, s.P((15, 10), (26, 18), (15, 30), (5, 18)), mode="sphere", lt=0.32)          # diamond
    s.add(BRASS, s.P((14, 12), (17, 12), (17, 28), (15, 30), (14, 28)), mode="cyl", sep="line")   # blade
    s.add(BRASS, s.P((9, 17), (22, 17), (21, 19), (10, 19)), mode="vert", sep="line")      # hilt bar
    return s.render(flip, max_colors=12)


@sprite("sigil_nurgle", 32, "纳垢印记", "Sigil of the Plague Father", "sigil")
def sigil_nurgle(flip=False):
    """three swollen overlapping rings + orbiting flies."""
    s = Sprite(32)
    for (cx, cy) in [(11, 13), (20, 13), (15.5, 21)]:
        s.add(GREEN, ring(s, cx, cy, 3.5, 7), mode="sphere", lt=0.35, tex=(int(cx), 0.06))
    s.add(RUSTG, s.E(15.5, 16, 2.5, 2.5), mode="sphere")
    for (x, y) in [(3, 4), (27, 5), (2, 27), (28, 26), (15, 1), (8, 30), (24, 30)]:
        s.px(x, y, hx("#24260e")); s.px(x + 1, y - 1, hx("#9aa080"))
    return s.render(flip, max_colors=12)


@sprite("sigil_tzeentch", 32, "奸奇印记", "Sigil of the Changer", "sigil")
def sigil_tzeentch(flip=False):
    """a two-coloured shifting spiral with an open eye at its heart."""
    s = Sprite(32)
    for k, rmp in ((0, BLUE), (1, PINK)):
        pts = []
        for i in range(60):
            t = i / 60 * 2.6 * math.pi + k * math.pi
            r = 2.5 + i * 0.22
            pts.append((15.5 + math.cos(t) * r, 15.5 + math.sin(t) * r))
        s.add(rmp, s.L(pts, 3), mode="sphere", lt=0.35)
    s.add(ramp("#f0f0ff", light=0.05), s.E(15.5, 15.5, 3.5, 2), mode="flat", flat=3, sep="line")
    s.pxs([(15, 15), (16, 15), (15, 16), (16, 16)], hx("#1a0a3a"))
    s.px(14, 14, hx("#ffffff"))
    return s.render(flip, max_colors=12)


@sprite("sigil_slaanesh", 32, "色孽印记", "Sigil of the Prince of Excess", "sigil")
def sigil_slaanesh(flip=False):
    """an elegant looping ribbon curling around a teardrop gem."""
    s = Sprite(32)
    pts = []
    for i in range(80):
        t = i / 80 * 2 * math.pi
        x = 15.5 + math.sin(t) * 11
        y = 15.5 + math.sin(2 * t) * 6 - math.cos(t) * 2
        pts.append((x, y))
    s.add(LILAC, s.L(pts + [pts[0]], 3), mode="sphere", lt=0.32)
    s.add(MAUVE, s.L([(15.5, 4), (12, 9), (15.5, 2)], 2), mode="cyl")
    s.add(PINK, union(s.E(15.5, 22, 4, 4), s.P((12, 21), (19, 21), (15.5, 13))), mode="sphere", lt=0.35, sep="line")
    s.px(14, 20, hx("#ffe8f8"))
    return s.render(flip, max_colors=12)


@sprite("sigil_undivided", 32, "混沌全能印记", "Sigil of Chaos Undivided", "sigil")
def sigil_undivided(flip=False):
    """a radial wheel of four paired colours, spokes ending in blunt studs (not arrowheads)."""
    s = Sprite(32)
    cols = [RED, GREEN, BLUE, LILAC]
    for k in range(8):
        a = math.radians(k * 45 + 22.5)
        x1, y1 = 15.5 + math.cos(a) * 12, 15.5 + math.sin(a) * 12
        rmp = cols[k % 4]
        s.add(BONE, s.L([(15.5 + math.cos(a) * 5, 15.5 + math.sin(a) * 5), (x1, y1)], 3), mode="cyl", sep=False)
        s.add(rmp, s.E(x1, y1, 2.2, 2.2), mode="sphere", lt=0.4)
    s.add(BONE, ring(s, 15.5, 15.5, 3.5, 6.5), mode="sphere", lt=0.35, sep="line")
    s.add(ramp("#2a1a2a"), s.E(15.5, 15.5, 3, 3), mode="flat", flat=1, sep=False)
    s.px(15, 15, hx("#ff4a3a")); s.px(16, 16, hx("#ffd06a"))
    return s.render(flip, max_colors=12)
