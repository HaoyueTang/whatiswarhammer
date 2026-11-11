"""Ork route cast (v0.3, SPEC §26). Original designs: green skin, rust, yellow/black hazard,
crude bolted metal, comic-menacing grins. No named characters. On the Ork route the orks you
talk to (mek, weirdboy) and the gretchin face right (speaker slot); the nob and the squig face
left (foe slot). All authored facing right; face='L' mirrors before shading."""
from reg import sprite
from pxlib import Sprite, hx, union, sub, inter, ramp
from parts import *
from chars_xenos import ork_head

OVERALL = ramp("#4e5f72", light=0.16)       # mek's oily blue-grey coveralls
OIL = ramp("#2a2622", light=0.12, dark=0.08, outline=0.12)
COPPER = ramp("#b8642e", light=0.22)
WGLOW = ramp("#7aff4a", light=0.25)         # waaagh-energy green
SQUIG = ramp("#d8542a", light=0.18)
CHECK_W = hx("#e8e0c8")
CHECK_B = hx("#1e1a18")
TOOTH = hx("#f0e6c0")


def hazard_band(s, x0, y0, x1, y1, step=3):
    """diagonal yellow/black hazard stripes inside a rect."""
    s.add(HAZARD, s.R(x0, y0, x1, y1), mode="flat", flat=2, sep="dark")
    for x in range(x0 - (y1 - y0), x1 + 1, step * 2):
        for k in range(step):
            pts = [(x + k + (y1 - y), y) for y in range(y0, y1 + 1)]
            s.pxs([(px, py) for (px, py) in pts if x0 <= px <= x1], hx("#2a2420"))


def grin(s, sk, x0, x1, y, h=2, gold=None):
    """comic-menacing open grin: dark mouth, peg teeth on top, two tusks jutting up from the jaw."""
    mouth = hx("#2a0e10")
    for x in range(x0, x1 + 1):
        dh = h if x > x0 + 1 else h - 1
        for yy in range(y, y + dh + 1):
            s.px(x, yy, mouth)
        s.px(x, y + dh + 1, sk[0])
    s.px(x1 + 1, y - 1, sk[0]); s.px(x1 + 1, y, sk[0])                       # upturned corner
    for x in range(x0 + 1, x1, 2):
        s.px(x, y, TOOTH)
    for tx in (x0 + 2, x1 - 2):
        s.pxs([(tx, y + h), (tx, y + h - 1), (tx, y - 1)], TOOTH)
        s.px(tx + 1, y + h, hx("#c8b88a"))
    if gold:
        s.px(gold, y, GOLD[3])


def rivets(s, pts, c=None):
    s.pxs(pts, c or STEEL[3])


# ------------------------------------------------------------------ player
@sprite("player_orks", 48, "你（废品贩子）", "You (Scrap-Trader)", "player")
def player_orks(flip=False):
    s = Sprite(48)
    skin = SKIN["tan"]
    coat = ramp("#6e5a3e", light=0.16)
    # salvage sack over the far shoulder, a pipe and a cog sticking out
    s.add(ramp("#8a7a52"), s.E(9, 32, 7, 8), mode="sphere", tex=(6, 0.08))
    s.add(STEEL, s.L([(6, 25), (3, 18)], 2), mode="cyl")
    s.add(BRASS, s.E(13, 24, 3, 3), mode="sphere")
    s.px(13, 24, BRASS[0])
    arm(s, coat, "L", width=7, tex=(2, 0.06))
    torso(s, coat, half=15, tex=(3, 0.07))
    arm(s, coat, "R", width=7, tex=(4, 0.06))
    # patched coat, sack strap, tool loops
    s.add(ramp("#5a6a4a"), s.R(29, 38, 33, 42), mode="sphere", sep="dark")
    s.add(LEATHER, s.L([(12, 31), (32, 47)], 2), mode="flat", flat=2, sep="dark")
    s.add(STEEL, s.L([(16, 40), (18, 46)], 1), mode="flat", flat=3, sep=False)      # screwdriver
    s.pxs([(21, 39), (25, 42), (29, 45)], BRASS[3])
    neck(s, skin)
    # iron slave collar with a hazard-painted tag and a broken chain link
    s.add(GUNMETAL, s.R(20, 25, 28, 27), mode="cyl", sep="line")
    s.add(HAZARD, s.R(23, 28, 25, 30), mode="flat", flat=2, sep="line")
    s.px(24, 29, hx("#2a2420"))
    s.add(GUNMETAL, sub(s.E(27, 30, 2, 2), s.E(27, 30, 0.6, 0.6)), mode="flat", flat=1, sep=False)
    human_head(s, skin, mouth="line", mood="sad")
    # rag head-wrap
    s.add(ramp("#7a4a34"), s.G(18, 7, ["...########...", ".############.", "##############", "####......###.",
                                       "##..........#.", "#"]), mode="sphere", tex=(5, 0.1))
    s.add(ramp("#7a4a34"), s.P((17, 12), (13, 16), (14, 19), (19, 14)), mode="cyl")   # knot tail
    # salvage goggles worn over the eyes: mismatched lenses (round brass + red welder's glass)
    s.add(LEATHER, s.R(18, 15, 31, 16), mode="flat", flat=1, sep=False)
    s.add(BRASS, s.E(23, 16, 2, 2), mode="sphere", sep="line")
    s.add(GUNMETAL, s.R(28, 14, 31, 18), mode="sphere", sep="line")
    s.px(23, 16, hx("#a8e0c8")); s.px(22, 15, hx("#e8fff0"))
    s.pxs([(29, 15), (30, 15), (29, 16), (30, 16), (29, 17)], hx("#c83a2a"))
    s.px(29, 15, hx("#ff9a7a"))
    s.pxs([(21, 20), (30, 21)], skin[1])                                       # grime
    return s.render(flip)


# ------------------------------------------------------------------ mek
@sprite("ork_mek", 48, "兽人机械佬", "Ork Mek", "orks")
def ork_mek(flip=False):
    s = Sprite(48)
    sk = ORKSKIN
    # back-mounted generator: smoking exhaust pipe over the far shoulder
    s.add(GUNMETAL, s.R(4, 18, 8, 34), mode="cyl", tex=(3, 0.08))
    s.add(RUST, s.R(3, 16, 9, 18), mode="cyl")
    s.add(ramp("#6a6a6a", light=0.12), s.E(6, 10, 4, 3), mode="sphere", sep=False, outline=False)
    s.add(ramp("#8a8a88", light=0.10), s.E(9, 5, 3, 2), mode="sphere", sep=False, outline=False)
    # hunched shoulders in oily coveralls
    s.add(OVERALL, s.E(9, 36, 9, 8), mode="sphere", lt=0.35, tex=(2, 0.06))
    s.add(OVERALL, s.P((4, 47), (6, 34), (16, 27), (34, 27), (44, 34), (46, 47)), mode="cyl", tex=(4, 0.07))
    hazard_band(s, 14, 36, 34, 39)                                             # bib stripe
    s.add(OIL, s.R(10, 42, 40, 44), mode="vert", sep="dark")                   # tool belt
    s.add(BRASS, s.R(22, 42, 25, 44), mode="sphere")
    s.add(STEEL, s.L([(14, 41), (16, 47)], 1), mode="flat", flat=3, sep=False)
    s.add(COPPER, s.L([(18, 41), (19, 47)], 1), mode="flat", flat=2, sep=False)
    s.pxs([(7, 31), (12, 29), (30, 30), (38, 31)], STEEL[3])                   # bolts
    s.pxs([(26, 33), (27, 34), (29, 33), (11, 39)], OIL[2])                    # oil stains
    ork_head(s, sk, ox=-2, oy=-1)
    # forehead strap + big brass magnifier goggle over the near eye
    s.add(LEATHER, s.P((19, 12), (36, 12), (37, 14), (19, 14)), mode="flat", flat=1, sep=False)
    s.add(BRASS, s.E(34, 16, 3.5, 3.5), mode="sphere", sep="line")
    s.add(ramp("#9ad8e0", light=0.15), s.E(34, 16, 2, 2), mode="sphere", lt=0.45, sep="line")
    s.px(33, 15, hx("#ffffff"))
    s.px(35, 17, EYE_RED)
    grin(s, sk, 29, 40, 24, gold=34)
    # raised spanner in the near fist
    s.add(sk, s.E(41, 36, 4, 4), mode="sphere")
    s.add(STEEL, s.L([(41, 33), (44, 12)], 3), mode="cyl", tex=(8, 0.05))
    jaw = sub(s.E(45, 8, 4, 5), s.P((44, 0), (48, 0), (48, 8), (45, 6)))
    s.add(STEEL, jaw, mode="sphere", lt=0.36)
    s.pxs([(40, 34), (41, 34), (42, 34)], sk[0])
    # spark at the jaw
    s.pxs([(47, 2), (46, 1), (47, 0)], hx("#fff4a0"))
    return s.render(flip)


# ------------------------------------------------------------------ weirdboy
@sprite("ork_weirdboy", 48, "兽人怪小子", "Ork Weirdboy", "orks")
def ork_weirdboy(flip=False):
    s = Sprite(48)
    sk = ramp("#6a9a3a", light=0.18)
    rag = ramp("#6a4a6a", light=0.14)
    # crackling copper staff behind, topped by a bent prong-coil
    s.add(COPPER, s.L([(42, 47), (40, 8)], 2), mode="cyl")
    s.add(COPPER, s.L([(36, 8), (40, 4), (44, 8)], 1), mode="flat", flat=2)
    s.add(COPPER, s.L([(38, 6), (38, 2)], 1), mode="flat", flat=3)
    s.add(COPPER, s.L([(42, 6), (43, 1)], 1), mode="flat", flat=3)
    s.add(WGLOW, s.E(40, 5, 4, 4), mode="glow", sep=False, outline=False)
    s.pxs([(40, 5), (39, 4), (41, 6)], hx("#eaffd0"))
    # ragged shawl over hunched shoulders, bone fetishes on a cord
    s.add(sk, s.E(8, 35, 8, 8), mode="sphere", lt=0.35)
    s.add(rag, s.P((3, 47), (5, 34), (15, 27), (33, 27), (42, 34), (44, 47), (38, 44), (34, 47), (28, 43),
                   (22, 47), (16, 43), (10, 47)), mode="cyl", tex=(4, 0.1))
    for (x, y) in [(15, 36), (20, 38), (25, 39), (30, 38)]:
        s.add(BONE, s.R(x, y, x + 1, y + 2), mode="flat", flat=3, sep="dark")
    s.add(LEATHER, s.L([(13, 33), (20, 37), (26, 38), (33, 36)], 1), mode="flat", flat=1, sep=False)
    # copper skull-cap with rods (to vent the build-up), head thrown back a little
    ork_head(s, sk, ox=-2, oy=1)
    cap = s.P((18, 16), (21, 11), (29, 9), (36, 12), (37, 15), (19, 18))
    s.add(COPPER, cap, mode="sphere", lt=0.4, sep="line")
    for (x0, y0, x1, y1) in [(22, 11, 19, 3), (28, 9, 28, 1), (34, 11, 37, 4)]:
        s.add(COPPER, s.L([(x0, y0), (x1, y1)], 1), mode="flat", flat=2)
        s.px(x1, y1, hx("#eaffd0"))
    rivets(s, [(22, 14), (27, 13), (32, 13)], COPPER[3])
    # glowing eyes (no pupils), green arcs leaking from the head and the free hand
    for ex in (29, 34):
        s.pxs([(ex, 18), (ex + 1, 18)], hx("#c8ff9a"))
    grin(s, sk, 29, 40, 26, h=2)
    s.add(WGLOW, s.L([(17, 6), (14, 9), (16, 12), (12, 15)], 1), mode="glow", sep=False)
    s.add(WGLOW, s.L([(44, 18), (46, 22), (44, 25), (47, 28)], 1), mode="glow", sep=False)
    # near hand gripping the staff
    s.add(sk, s.E(41, 37, 3, 3), mode="sphere")
    s.pxs([(39, 36), (40, 37)], sk[0])
    return s.render(flip)


# ------------------------------------------------------------------ nob (64, foe)
@sprite("ork_nob", 64, "兽人头头", "Ork Nob", "orks", face="L")
def ork_nob(flip=False):
    s = Sprite(64)
    sk = ramp("#527a2c", light=0.18)
    slab = ramp("#7a6a58", light=0.16)
    # massive torso: bare green chest under a crude iron slab
    s.add(sk, s.P((4, 63), (6, 42), (18, 32), (46, 32), (58, 42), (60, 63)), mode="cyl", lt=0.24)
    s.add(sk, s.E(12, 44, 11, 10), mode="sphere", lt=0.35)                     # far shoulder
    s.add(slab, s.P((16, 63), (18, 44), (44, 42), (48, 63)), mode="sphere", tex=(4, 0.06), sep="line")
    s.add(RUST, s.P((18, 54), (46, 52), (47, 58), (17, 60)), mode="vert", sep="dark", tex=(7, 0.12))
    rivets(s, [(20, 46), (42, 45), (20, 52), (43, 50), (24, 61), (40, 61)])
    s.add(LEATHER, s.L([(10, 38), (48, 63)], 3), mode="flat", flat=2, sep="dark")       # ammo strap
    for k in range(0, 9):
        s.px(14 + k * 4, 41 + k * 2 + (k // 3), BRASS[3])
    # near shoulder: big checked pad (black/white checks, crude)
    pad = s.P((40, 34), (54, 30), (62, 38), (60, 48), (44, 48))
    s.add(slab, pad, mode="sphere", lt=0.36, sep="line")
    for y in range(34, 47, 3):
        for x in range(42, 61, 3):
            if ((x // 3) + (y // 3)) % 2 == 0:
                s.add(slab, s.R(x, y, x + 2, y + 2), mode="flat", flat=0, sep=False)
    s.add(slab, s.R(50, 26, 51, 32), mode="cyl")                               # spike
    s.add(slab, s.P((49, 28), (52, 28), (51, 22)), mode="cyl")
    # head: big, bare, topknot, scarred, gold-capped tusk, nose ring
    ork_head(s, sk, k=1.28, ox=-7, oy=0)
    s.add(ramp("#2a2018"), s.P((25, 12), (30, 9), (33, 4), (35, 10), (32, 14)), mode="sphere")   # topknot
    s.add(BRASS, s.R(29, 9, 33, 10), mode="flat", flat=3, sep="dark")
    s.pxs([(30, 14), (31, 15), (32, 16), (33, 18), (34, 19)], hx("#8a3a2a"))    # scar across the brow
    grin(s, sk, 31, 48, 31, h=3, gold=41)
    for ex in (33, 40):                                                         # angry glare
        s.pxs([(ex, 22), (ex + 1, 22)], EYE_RED)
        s.px(ex + 1, 22, hx("#ffb08a"))
        s.pxs([(ex - 1, 20), (ex, 20), (ex + 1, 21), (ex + 2, 21)], sk[0])
    s.add(BRASS, sub(s.E(49, 27, 2, 2), s.E(49, 27, 0.7, 0.7)), mode="flat", flat=3, sep=False)
    # huge cleaver raised in the near fist
    s.add(sk, s.E(56, 44, 5, 5), mode="sphere")
    s.add(LEATHER, s.L([(55, 40), (57, 28)], 3), mode="cyl")
    blade = s.P((48, 28), (63, 24), (63, 2), (56, 4), (50, 14))
    s.add(STEEL, blade, mode="sphere", lt=0.34, tex=(9, 0.10))
    s.add(RUST, s.P((49, 24), (63, 21), (63, 24), (48, 28)), mode="flat", flat=1, sep="dark")
    for (x, y) in [(56, 8), (59, 13), (61, 6)]:
        s.px(x, y, RUST[1])
    s.pxs([(62, 4), (62, 8), (62, 12), (62, 16)], hx("#f4f4f0"))
    s.pxs([(53, 43), (55, 42), (57, 41)], sk[0])
    return s.render(flip)


# ------------------------------------------------------------------ gretchin (32)
@sprite("gretchin", 32, "地精", "Gretchin", "orks")
def gretchin(flip=False):
    s = Sprite(32)
    sk = ramp("#8aa83a", light=0.16)
    vest = ramp("#7a5a3a", light=0.14)
    # skinny body in a too-big vest
    s.add(sk, s.R(6, 25, 9, 31), mode="cyl")
    s.add(vest, s.P((7, 31), (8, 24), (12, 21), (20, 21), (24, 24), (25, 31)), mode="cyl", tex=(3, 0.08))
    s.pxs([(15, 24), (15, 27), (15, 30)], BRASS[3])
    # long ears sweeping out
    s.add(sk, s.P((11, 11), (1, 6), (4, 11), (10, 14)), mode="cyl")
    s.add(sk, s.P((19, 9), (28, 2), (26, 8), (20, 12)), mode="cyl")
    # head: big long-nosed head, sly narrow eyes, needle-tooth grin
    head = union(s.E(15, 13, 6, 6), s.P((17, 13), (26, 14), (24, 17), (18, 18)))
    s.add(sk, head, mode="sphere", lt=0.38, st=0.7)
    s.pxs([(14, 10), (15, 10), (16, 10), (19, 10), (20, 10)], sk[0])        # brows pinched in
    s.pxs([(16, 11), (20, 11)], hx("#ff5a2a"))
    s.pxs([(15, 11), (19, 11)], hx("#ffe060"))
    s.pxs([(25, 14), (26, 14)], sk[1])
    for x in range(16, 23):
        s.px(x, 17, sk[0])
    s.pxs([(17, 16), (19, 16), (21, 16)], TOOTH)
    s.pxs([(14, 16), (15, 17)], sk[0])                                       # smirk corner
    # oversized blunderbuss-pistol held up near the face
    s.add(sk, s.E(23, 25, 2, 2), mode="sphere")
    s.add(GUNMETAL, s.P((20, 26), (27, 20), (30, 19), (31, 22), (28, 24), (23, 29)), mode="sphere")
    s.add(BRASS, s.E(30, 20, 1.5, 2), mode="sphere", sep="line")
    s.add(LEATHER, s.P((19, 27), (22, 25), (24, 30), (21, 31)), mode="sphere")
    return s.render(flip)


# ------------------------------------------------------------------ squig (32, foe)
@sprite("squig", 32, "史奎格", "Squig", "orks", face="L")
def squig(flip=False):
    s = Sprite(32)
    # stubby legs
    for x in (9, 17):
        s.add(SQUIG, s.P((x, 26), (x + 4, 26), (x + 5, 31), (x - 1, 31)), mode="cyl")
    # round ball body
    s.add(SQUIG, s.E(15, 16, 13, 11), mode="sphere", lt=0.36, st=0.7, tex=(5, 0.04))
    s.pxs([(6, 12), (8, 9), (11, 7), (5, 18), (9, 22)], SQUIG[1])              # warts
    # enormous mouth gash full of teeth
    mouth = s.P((12, 14), (29, 12), (30, 20), (26, 25), (14, 22))
    s.add(ramp("#5a0e1a"), mouth, mode="flat", flat=1, sep="line")
    s.add(ramp("#c84a6a"), s.P((16, 20), (24, 19), (27, 22), (17, 23)), mode="sphere", sep=False)   # tongue
    for x in range(13, 30, 2):
        top = 13 + (29 - x) // 9
        s.pxs([(x, top), (x, top + 1)], TOOTH)
        s.px(x + 1, top, hx("#c8b88a"))
    for x in range(15, 28, 3):
        bot = 23 - (x - 14) // 5
        s.pxs([(x, bot), (x, bot - 1)], TOOTH)
    # tiny mean eyes on top
    for (x, y) in [(14, 7), (20, 6)]:
        s.add(ramp("#f4e070", light=0.1), s.E(x, y, 1.6, 1.6), mode="sphere", sep="line")
        s.px(x + 1, y, hx("#1a1418"))
    s.pxs([(12, 5), (13, 5), (21, 4), (22, 4)], SQUIG[0])
    return s.render(flip)
