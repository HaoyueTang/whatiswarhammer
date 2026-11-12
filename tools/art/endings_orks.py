"""SPEC §31 ending illustrations — Ork route (ork_*).  See endkit.py for the helper conventions."""
import math
import random
from reg import ending
from endkit import *


GROT = [                      # a gretchin, hand-pixelled: big ears, two glinting eyes
    "#.........#.",
    "##.......##.",
    ".###.##.###.",
    "..#######...",
    "..#######...",
    "...#####....",
    "....###.....",
    ".#.#####.#..",
    ".#.#####.#..",
    "##.#####.##.",
    "...##.##....",
    "...#...#....",
    "..##...##...",
]


def _grot(c, x, y, col, flip=False, rim_col=None, load=None):
    """draw a gretchin with its feet at (x, y).  load = colour of a bundle on its back."""
    im = Image.new("RGBA", (12, 13), (0, 0, 0, 0))
    px = im.load()
    for j, row in enumerate(GROT):
        for i, ch in enumerate(row):
            if ch == "#":
                px[i, j] = C(col) + (255,)
    px[3, 3] = C("#f4f070") + (255,)
    px[6, 3] = C("#f4f070") + (255,)
    if load:
        for (i, j) in [(8, 6), (9, 6), (8, 7), (9, 7), (10, 7), (9, 8), (10, 8)]:
            px[i, j] = C(load) + (255,)
    if flip:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    if rim_col:
        im = rim(im, rim_col, (-1, -1))
    cast_shadow(c, im, x, y, anchor="bm", toward_light=(-1, 0.5), length=1.0, squash=0.3, col="#2a2c10", t=0.55)
    place(c, im, x, y, anchor="bm")


@ending("ork_end_grot")
def ork_end_grot(e):
    """BAD.  Big Grot: a human hauling a sack of spanners among the grots, in the dust at the foot of the marching
    Waaagh!  The horde is black against a sick-yellow sun; the human is the same size as the grots, nobody
    remembers a name.  A faint green tint on the human's face."""
    c = e.c
    HZ = 70
    sky(c, ["#10160a", "#202c0e", "#3a4a16", "#627222", "#8a9830", "#b0b050"], 0, HZ)
    clouds(c, e.seed_for("cl"), ["#1c2408", "#2c3814", "#425220"], 0, 44, scale=0.05, thresh=0.5, stretch=4.5)
    sx_, sy_ = 62, 52
    glow(c, sx_, sy_, 50, ["#425220", "#6a7e28", "#a4b03c", "#d8d672", "#f6f0aa", "#fffbd8"], power=1.5, strength=1.0, ry=32)
    c.ellipse(sx_, sy_, 10, 10, "#fffbd8")
    shafts(c, (sx_, sy_), 90, 80, 8, 70, "#f2eb98", t=0.20, seed=e.seed_for("sh"), w0=3, w1=12, power=0.7)
    # horizon: scrap towers, chimneys, banner poles, in dust
    rr = e.rng("hor")
    ridge(c, HZ + 2, 2, 8, "#262c0e", seed=e.seed_for("rg"), fill_to=HZ + 12)
    for k in range(10):
        x = rr.randint(0, 191)
        h = rr.randint(10, 30)
        c.rect(x, HZ - h, x + rr.randint(1, 3), HZ + 2, "#1e240a")
        c.rect(x - 1, HZ - h, x + 4, HZ - h, "#1e240a")
    for (x, h) in [(20, 30), (118, 36), (166, 26)]:                  # banner poles with rags
        c.line([(x, HZ + 2), (x, HZ - h)], "#161a08")
        for j in range(7):
            c.rect(x + 1 + j, HZ - h + 1 + (j * j) // 6, x + 2 + j, HZ - h + 3 + (j * j) // 6, "#161a08")
    haze(c, HZ - 12, HZ + 10, "#7a8a30", t=0.4, seed=e.seed_for("hz"), profile="mid")
    # the horde: ork busts, dark against the haze, rising out of the dust (few, distinct, huge next to the grots)
    for (x, key, mir, y) in [(22, "ork", False, 88), (104, "ork_nob", False, 86), (158, "ork", True, 88)]:
        s_ = spr(key, tint_to="#0e1206", tint_t=0.6, mirror=mir, bottom_fade=20)
        s_ = rim(s_, "#d8d672", (-1, -1))
        place(c, s_, x, y, anchor="bm")
    haze(c, 70, 90, "#7a8630", t=0.45, seed=e.seed_for("hz2"), profile="bottom")
    # ground: churned dust road, tracks going away, dark in the foreground
    hband(c, 88, 107, ["#6a6a32", "#505024", "#363618", "#1e1e0e"], seed=e.seed_for("gr"), rough=0.4)
    for k in range(-5, 12):
        c.line([(sx_ + k * 3, 88), (sx_ + k * 26 - 30, 107)], "#34361a")
    light_pool(c, sx_ + 10, 94, 60, 8, "#cfcc58", t=0.28)
    # foreground group: the human, a sack of spanners, grots
    me = player_fig("orks", 30, "walk", facing=1, lean=14)
    mpx, mpy = put_figure(c, me, 78, 104, rim_col="#b8b060", toward=(-1, -1),
                          shadow=dict(toward_light=(-1, 0.5), length=1.2, squash=0.32, col="#3a3c14", t=0.6))
    bx, by = mpx + 1, mpy + 9
    for (dx_, dy_, r_) in [(0, 0, 6), (3, -3, 4), (-2, 3, 4)]:                 # the sack on the back
        c.ellipse(bx + dx_, by + dy_, r_, r_ - 1, "#4a3c20")
    c.ellipse(bx - 1, by - 2, 3, 2, "#7a6a3a")
    for k, (dx_, dy_) in enumerate([(-3, -8), (0, -9), (3, -8)]):               # spanners sticking out
        c.line([(bx + dx_, by + dy_ + 5), (bx + dx_ + k - 1, by + dy_)], "#2a2c18")
        c.rect(bx + dx_ + k - 2, by + dy_ - 2, bx + dx_ + k, by + dy_ - 1, "#2a2c18")
    hx_, hy_ = me["head"]
    c.rect(mpx + int(hx_) - 1, mpy + int(hy_) - 1, mpx + int(hx_) + 1, mpy + int(hy_) + 1, "#78a83a")   # a green tint, creeping
    for (gx, gy, fl, ld) in [(50, 98, False, "#5a4a2a"), (104, 101, True, None), (118, 96, True, "#4a5a1a"), (28, 104, False, None)]:
        _grot(c, gx, gy, "#161a0a", flip=fl, rim_col="#b8b060", load=ld)
    particles(c, "mote", 50, (0, 30, 191, 104), seed=e.seed_for("dust"), cols=("#f2eb98", "#c8c860", "#d8d672"))
    vignette_kind(c, "bad", col="#080a04", strength=0.85)
