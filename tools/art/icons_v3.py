"""v0.3 16x16 UI icons (SPEC §26): renown icons for the Ork, Genestealer Cult and Mechanicus routes."""
import math
from reg import ui
from pxlib import Sprite, hx, union, sub, inter, ramp


def _s():
    return Sprite(16)


@ui("icon_teef")
def icon_teef():
    """Orks: a single big fang (ork currency), ivory, curving to a point, darker root."""
    s = _s()
    fang = union(s.P((3, 4), (12, 4), (12, 6), (11, 9), (9.5, 12.5), (8, 15), (7, 12), (5, 8), (3.5, 6)),
                 s.P((3, 4), (4, 0.5), (6.5, 0.5), (7, 4)), s.P((8, 4), (9, 0.5), (11.5, 0.5), (12, 4)))
    s.add(ramp("#e8dcb0", light=0.08, dark=0.22), fang, mode="sphere", lt=0.34, st=0.66)
    s.add(ramp("#b89a6a", light=0.10), s.R(3, 4, 12, 4), mode="flat", flat=1, sep=False)          # gum line
    s.pxs([(5, 5), (6, 7), (7, 9)], hx("#fffbea"))
    s.pxs([(10, 6), (10, 8)], hx("#b8a678"))
    return s.render(max_colors=8)


@ui("icon_kinship")
def icon_kinship():
    """Genestealer Cult: an original four-armed knot — a ring with two arms raised and two
    lowered, each curling outward (bilateral, not a pinwheel)."""
    s = _s()
    arms = s.G(0, 0, [
        ".##..........##.",
        "#..#........#..#",
        "#...#......#...#",
        ".....#....#.....",
        "......#..#......",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "......#..#......",
        ".....#....#.....",
        "#...#......#...#",
        "#..#........#..#",
        ".##..........##.",
    ])
    s.add(ramp("#c89aff", light=0.12), arms, mode="flat", flat=2)
    ring = sub(s.E(7.5, 7.5, 4.6, 4.6), s.E(7.5, 7.5, 2.4, 2.4))
    s.add(ramp("#9b59b6", light=0.2), ring, mode="sphere", lt=0.32, st=0.68)
    s.add(ramp("#e0b84a", light=0.15), s.E(7.5, 7.5, 1.2, 1.2), mode="sphere", sep="line")
    s.px(7, 7, hx("#fff0c0"))
    return s.render(max_colors=8)


@ui("icon_grace")
def icon_grace():
    """Mechanicus: a brass gear with a golden halo floating above it, red hub."""
    s = _s()
    halo = sub(s.E(7.5, 2.6, 5.5, 2), s.E(7.5, 2.6, 4, 1))
    s.add(ramp("#ffe08a", light=0.12), halo, mode="glow")
    g = s.G(2, 5, ["....###....",
                    ".##.###.##.",
                    ".#########.",
                    "..#######..",
                    "####...####",
                    "####...####",
                    "####...####",
                    "..#######..",
                    ".#########.",
                    ".##.###.##.",
                    "....###...."])
    s.add(ramp("#b8862e", light=0.22), g, mode="sphere", lt=0.32, st=0.68)
    s.add(ramp("#c0392b", light=0.2), s.R(6, 9, 8, 11), mode="sphere", sep="line")
    s.px(6, 9, hx("#ff8a6a"))
    return s.render(max_colors=8)
