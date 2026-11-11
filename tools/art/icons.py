"""16x16 UI icons (transparent). Shapes + auto shading/outline, small details hand-placed."""
import math
from reg import ui
from pxlib import Sprite, hx, union, sub, inter, ramp


def _s():
    return Sprite(16)


@ui("icon_hp")
def icon_hp():
    s = _s()
    heart = union(s.E(4.5, 5.5, 3.5, 3.5), s.E(10.5, 5.5, 3.5, 3.5), s.P((1.2, 6.5), (13.8, 6.5), (7.5, 13.5)))
    s.add(ramp("#d8302a", light=0.16), heart, mode="sphere", lt=0.32, st=0.68)
    s.pxs([(3, 4), (4, 3), (3, 5)], hx("#ffb0a0"))
    return s.render(max_colors=8)


@ui("icon_sanity")
def icon_sanity():
    s = _s()
    eye = inter(s.E(7.5, 11.5, 8, 7), s.E(7.5, 3.5, 8, 7))
    s.add(ramp("#e8e4d8", light=0.06), eye, mode="sphere", lt=0.3, st=0.75)
    s.add(ramp("#3a8ad0", light=0.2), s.E(7.5, 7.5, 3, 3), mode="sphere", sep="line")
    s.pxs([(7, 7), (8, 7), (7, 8), (8, 8)], hx("#0e1424"))
    s.px(6, 6, hx("#ffffff"))
    for x in (2, 5, 10, 13):
        s.px(x, 2 + (1 if x in (5, 10) else 2), hx("#2a2a3a"))   # lashes
    return s.render(max_colors=8)


@ui("icon_corruption")
def icon_corruption():
    s = _s()
    body = union(s.E(7.5, 6, 5, 4.5), s.P((5, 8), (7, 8), (6, 14)), s.P((9, 8), (11, 8), (10, 12)),
                 s.P((3, 7), (5, 8), (3, 11)))
    s.add(ramp("#7a2a8a", light=0.2), body, mode="sphere", lt=0.32)
    for (a, b) in [((3, 3), (1, 0)), ((7, 2), (7, 0)), ((11, 3), (14, 1)), ((13, 6), (15, 6))]:
        s.add(ramp("#5a8a2a", light=0.2), s.L([a, b], 1), mode="flat", flat=2)
    s.pxs([(6, 4), (5, 5)], hx("#d89ae8"))
    s.px(6, 15, hx("#7a2a8a"))
    return s.render(max_colors=8)


@ui("icon_faith")
def icon_faith():
    s = _s()
    s.add(ramp("#e8dcb8", light=0.06), s.R(5, 8, 10, 14), mode="cyl", lt=0.3)
    s.add(ramp("#b8902a"), s.R(3, 14, 12, 15), mode="vert")
    s.add(ramp("#ffb030", light=0.18), union(s.E(7.5, 4.5, 2.5, 3), s.P((5.5, 4), (9.5, 4), (7.5, 0))), mode="glow")
    s.add(ramp("#fff0a0", light=0.05), s.E(7.5, 5, 1, 1.5), mode="glow", sep=False)
    s.pxs([(9, 9), (9, 10)], hx("#fff8e8"))
    s.pxs([(5, 8), (5, 9)], hx("#c8b890"))  # wax drip
    return s.render(max_colors=8)


@ui("icon_favor")
def icon_favor():
    s = _s()
    pts = []
    for k in range(12):
        a = math.radians(k * 30 - 90)
        r = 7.5 if k % 2 == 0 else 3.5
        pts.append((7.5 + math.cos(a) * r, 7.5 + math.sin(a) * r))
    s.add(ramp("#9a3ab8", light=0.2), s.P(*pts), mode="sphere", lt=0.32)
    s.add(ramp("#f0e8c8", light=0.05), s.E(7.5, 7.5, 2.5, 1.5), mode="flat", flat=3, sep="line")
    s.pxs([(7, 7), (8, 7), (7, 8), (8, 8)], hx("#e02a2a"))
    for (x, y) in [(7, 2), (12, 5), (3, 11)]:
        s.px(x, y, hx("#ffe060"))
    return s.render(max_colors=8)


@ui("icon_greatergood")
def icon_greatergood():
    s = _s()
    s.add(ramp("#c69a52", light=0.18), sub(s.E(7.5, 7.5, 7, 7), s.E(7.5, 7.5, 4.6, 4.6)), mode="sphere", lt=0.32)
    s.add(ramp("#3fb0a8", light=0.2), s.E(7.5, 7.5, 2.2, 2.2), mode="sphere", sep="line")
    for (x, y) in [(7, 1), (2, 10), (13, 10)]:
        s.px(x, y, hx("#f0f0e8"))
    s.px(7, 7, hx("#d8fff8"))
    return s.render(max_colors=8)


@ui("icon_clock")
def icon_clock():
    s = _s()
    s.add(ramp("#b08a3a", light=0.2), s.E(7.5, 7.5, 7, 7), mode="sphere", lt=0.3)
    s.add(ramp("#e8e0c8", light=0.05), s.E(7.5, 7.5, 5, 5), mode="flat", flat=2, sep="dark")
    s.pxs([(7, 4), (7, 5), (7, 6), (7, 7), (8, 7), (9, 8), (10, 9)], hx("#2a2018"))
    for (x, y) in [(7, 3), (12, 7), (7, 12), (3, 7)]:
        s.px(x, y, hx("#8a6a3a"))
    s.px(5, 4, hx("#ffffff"))
    return s.render(max_colors=8)


@ui("icon_codex")
def icon_codex():
    s = _s()
    s.add(ramp("#7a2a24"), s.P((0, 4), (7, 3), (8, 4), (15, 3), (15, 13), (8, 14), (7, 14), (0, 13)), mode="vert")
    s.add(ramp("#e8dcb8", light=0.06), s.P((1, 3), (7, 2), (7, 12), (1, 12)), mode="cyl", lt=0.2, st=0.9, sep="dark")
    s.add(ramp("#d8ccaa", light=0.06), s.P((8, 2), (14, 3), (14, 12), (8, 12)), mode="cyl", lt=0.05, st=0.7, sep="dark")
    for y in (5, 7, 9):
        s.pxs([(2, y), (3, y), (4, y), (5, y)], hx("#8a7a5a"))
        s.pxs([(10, y), (11, y), (12, y)], hx("#8a7a5a"))
    s.pxs([(11, 13), (11, 14), (11, 15)], hx("#c8302a"))   # ribbon
    return s.render(max_colors=8)


@ui("icon_save")
def icon_save():
    s = _s()
    s.add(ramp("#4a5a6a", light=0.18), s.P((1, 1), (12, 1), (14, 3), (14, 14), (1, 14)), mode="sphere", lt=0.3)
    s.add(ramp("#c8ccc8", light=0.08), s.R(4, 1, 10, 5), mode="sphere", sep="dark")
    s.add(ramp("#2a3038"), s.R(8, 2, 9, 4), mode="flat", flat=2, sep=False)
    s.add(ramp("#3fb0a8", light=0.2), s.R(3, 8, 12, 13), mode="flat", flat=2, sep="dark")
    s.pxs([(4, 9), (5, 9), (6, 9), (4, 11), (5, 11), (7, 11), (8, 11)], hx("#c8fff4"))
    return s.render(max_colors=8)


@ui("icon_lang")
def icon_lang():
    s = _s()
    s.add(ramp("#3a4a6a", light=0.16), s.R(0, 1, 15, 14), mode="sphere", lt=0.25, st=0.8)
    # 文 (light) and A (gold), hand pixelled
    wen = ["...#...", "#######", ".#...#.", "..#.#..", "...#...", "..#.#..", "##...##"]
    a = ["..#..", ".#.#.", "#...#", "#####", "#...#", "#...#"]
    s.stamp(1, 3, wen, {"#": hx("#f0ece0")})
    s.stamp(10, 5, a, {"#": hx("#ffd060")})
    return s.render(max_colors=8)
