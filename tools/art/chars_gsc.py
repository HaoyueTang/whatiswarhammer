"""Genestealer Cult cast (v0.3, SPEC §26). Original designs: miner gear, ochre work-suits,
purple/violet carapace hints, hybrid features escalating neophyte -> acolyte -> magus -> primus ->
patriarch. The cult mark is our own four-armed knot (`KNOT5`), not the published wyrm-form.
Everyone faces right (you are one of the cult; they are speakers)."""
from reg import sprite
from pxlib import Sprite, hx, union, sub, inter, ramp
from parts import *

HYB1 = ramp("#bfa6aa", light=0.12)          # neophyte: almost human, faint lilac pallor
HYB2 = ramp("#a587b0", light=0.14)          # acolyte / primus: violet-grey
PATRI = ramp("#8a4aa0", light=0.20)         # patriarch: deep purple
CHIT = ramp("#3e2a6a", light=0.20, dark=0.12)   # blue-violet carapace
OCHRE_SUIT = ramp("#b8902e", light=0.18)    # mining work-suit
SUIT_DK = ramp("#5e4a2a", light=0.14)
CULT_PURPLE = ramp("#5a2a6e", light=0.18)
SHADOW = ramp("#1e1626", light=0.10, dark=0.06, outline=0.10)
VGLOW = hx("#e8a0ff")
YGLOW = hx("#ffe36a")
LAMP = ramp("#ffe08a", light=0.12)

# original cult mark: a ring with four arms (two raised, two lowered), bilateral, 5x5
KNOT5 = ["#...#",
         ".#.#.",
         "..o..",
         ".#.#.",
         "#...#"]


def knot(s, x, y, c, core=None):
    s.stamp(x, y, KNOT5, {"#": c, "o": core or c})


def ridged_scalp(s, skin, x0=18, y0=9, size=1.0, ridges=3, vein=None):
    """bald, swollen cranium behind/above HEADT. Bony ridges are drawn as short raised ribs
    radiating back from the brow (groove + 1px highlight), with lumps on the silhouette."""
    import math
    rx, ry = 8 * size, 5.5 * size
    cx, cy = x0 + 5 - (size - 1) * 3, y0 + 2 - (size - 1) * 4
    m = s.E(cx, cy, rx, ry)
    s.add(skin, m, mode="sphere", lt=0.30, st=0.74)
    groove = hx(vein) if isinstance(vein, str) else (vein or skin[1])
    # ribs: from a point above the brow, fanning back over the dome
    ox, oy = x0 + 10, y0 + 3
    for k in range(ridges):
        a = math.radians(196 + k * (38 / max(1, ridges - 1) if ridges > 1 else 0))
        L = rx * 1.05
        for i in range(2, int(L)):
            x = round(ox + math.cos(a) * i)
            y = round(oy + math.sin(a) * i * (ry / rx) * 1.25)
            if (x - cx) ** 2 / rx ** 2 + (y - cy) ** 2 / ry ** 2 < 0.8:
                s.px(x, y, groove)
                s.px(x, y - 1, skin[3])
        # the lump where the rib meets the silhouette
        ex = round(ox + math.cos(a) * L)
        ey = round(oy + math.sin(a) * L * (ry / rx) * 1.25)
        if size >= 1:
            s.add(skin, s.E(ex, ey, 1.5, 1.5), mode="sphere", sep=False)
    return m


def bald_head(s, skin, x0=18, y0=9, eyes=None, mouth="line", mood="calm", size=1.0, ridges=3, sclera=True):
    ridged_scalp(s, skin, x0, y0, size, ridges)
    m = human_head(s, skin, x0=x0, y0=y0, eyes=eyes, mouth=mouth, mood=mood, sclera=sclera)
    # the brow line of the face grid continues into the first ridge
    s.pxs([(x0 + 2, y0 + 1), (x0 + 3, y0 + 1), (x0 + 1, y0 + 2)], skin[1])
    return m


# ------------------------------------------------------------------ player
@sprite("player_gsc", 48, "你（矿工）", "You (Miner)", "player")
def player_gsc(flip=False):
    s = Sprite(48)
    skin = SKIN["fair"]
    arm(s, OCHRE_SUIT, "L", width=7, tex=(2, 0.07))
    torso(s, OCHRE_SUIT, half=15, tex=(3, 0.07))
    arm(s, OCHRE_SUIT, "R", width=7, tex=(4, 0.07))
    # reflective chest stripes, harness straps, pick-handle over the shoulder
    s.add(GUNMETAL, s.L([(4, 47), (14, 26)], 2), mode="cyl")
    s.add(STEEL, s.P((10, 22), (18, 26), (20, 24), (12, 20)), mode="sphere")
    for y in (38, 39):
        s.add(ramp("#d8dcd8", light=0.06), s.R(10, y, 38, y), mode="flat", flat=2 if y == 38 else 1, sep=False)
    s.add(SUIT_DK, s.L([(17, 30), (17, 47)], 2), mode="flat", flat=2, sep="dark")
    s.add(SUIT_DK, s.L([(31, 30), (31, 47)], 2), mode="flat", flat=2, sep="dark")
    s.add(GUNMETAL, s.R(28, 41, 34, 46), mode="sphere", sep="line")                 # battery pack
    s.px(30, 43, hx("#7aff7a"))
    neck(s, skin)
    s.add(ramp("#6a6a6a"), s.P((19, 25), (30, 24), (31, 30), (20, 31)), mode="sphere")   # dust mask, lowered
    s.pxs([(22, 27), (24, 27), (26, 27), (28, 27)], GUNMETAL[0])
    human_head(s, skin, mouth="line", mood="sad")
    s.pxs([(20, 20), (22, 21), (29, 22), (21, 13)], skin[1])                              # coal dust
    # yellow hard-hat with a glowing lamp at the front
    helm = union(s.E(24, 9, 9, 6), s.P((14, 11), (36, 10), (36, 13), (15, 13)))
    s.add(HAZARD, sub(helm, s.R(0, 14, 47, 47)), mode="sphere", lt=0.4, sep="line")
    s.add(HAZARD, s.R(24, 3, 25, 9), mode="flat", flat=1, sep=False)                    # ridge
    s.add(GUNMETAL, s.R(31, 8, 35, 11), mode="sphere", sep="line")
    s.add(LAMP, s.R(34, 8, 35, 11), mode="glow", sep=False)
    s.px(35, 9, hx("#ffffff"))
    for x in range(37, 48):
        h = (x - 36) // 3
        for y in range(9 - h, 11 + h):
            if (x + y) % 2 == 0 or abs(y - 9.5) < 1:
                s.px(x, y, LAMP[3] if x < 42 else LAMP[2])
    return s.render(flip)


# ------------------------------------------------------------------ neophyte
@sprite("gsc_neophyte", 48, "新信徒", "Neophyte Hybrid", "gsc")
def gsc_neophyte(flip=False):
    s = Sprite(48)
    skin = HYB1
    # mining autogun slung across the body
    arm(s, OCHRE_SUIT, "L", width=7, tex=(2, 0.06))
    torso(s, OCHRE_SUIT, half=15, tex=(3, 0.06))
    arm(s, OCHRE_SUIT, "R", width=7, tex=(4, 0.06))
    s.add(CULT_PURPLE, s.P((17, 31), (24, 38), (31, 31), (31, 34), (24, 41), (17, 34)), mode="vert", sep="dark")   # purple yoke
    knot(s, 22, 41, hx("#e8c8ff"))
    s.add(SUIT_DK, s.R(10, 44, 38, 45), mode="vert", sep="dark")
    neck(s, skin)
    s.add(GUNMETAL, s.L([(12, 47), (36, 33)], 3), mode="sphere")
    s.add(GUNMETAL, s.L([(34, 34), (44, 28)], 1), mode="flat", flat=2)
    s.add(SUIT_DK, s.R(16, 42, 20, 47), mode="sphere")
    s.add(GUNMETAL, s.P((24, 40), (27, 38), (29, 44), (26, 45)), mode="sphere")        # magazine
    s.add(skin, s.E(34, 37, 2, 2), mode="sphere")
    bald_head(s, skin, mouth="line", size=0.8, ridges=2)
    s.pxs([(25, 15), (26, 15)], CULT_PURPLE[1])                                         # faint violet under the eyes
    s.pxs([(27, 16), (28, 16)], hx("#2a1430"))
    # goggles hanging at the neck
    s.add(LEATHER, s.R(20, 26, 28, 27), mode="flat", flat=1, sep=False)
    s.add(GUNMETAL, s.E(22, 27, 1.5, 1.5), mode="sphere", sep="line")
    s.add(GUNMETAL, s.E(27, 27, 1.5, 1.5), mode="sphere", sep="line")
    return s.render(flip)


# ------------------------------------------------------------------ acolyte (third arm)
@sprite("gsc_acolyte", 48, "侍僧混种", "Acolyte Hybrid", "gsc")
def gsc_acolyte(flip=False):
    s = Sprite(48)
    skin = HYB2
    vest = ramp("#4a3a2e", light=0.14)
    # the third arm: chitin-plated, clawed, rising over the far shoulder
    s.add(HYB2, s.L([(13, 34), (6, 26), (6, 16)], 6), mode="cyl")
    for (y0, y1) in [(28, 32), (20, 25)]:
        s.add(CHIT, s.P((3, y0), (10, y0 - 1), (11, y1), (3, y1 + 1)), mode="sphere", sep="line")
    s.add(CHIT, s.E(7, 14, 5, 4), mode="sphere", sep="line")
    for (a, b, c_) in [((3, 12), (1, 3), (5, 10)), ((6, 11), (8, 1), (9, 11)), ((10, 12), (16, 5), (12, 14))]:
        s.add(BONE, s.P(a, b, c_), mode="cyl")
    # bare violet arms, leather vest with rock-saw harness
    arm(s, skin, "L", width=7)
    torso(s, vest, half=15, tex=(3, 0.06))
    arm(s, skin, "R", width=7)
    s.add(CHIT, s.P((14, 30), (24, 34), (34, 30), (32, 36), (24, 38), (16, 36)), mode="sphere", sep="line")   # carapace collar
    s.add(OCHRE_SUIT, s.R(11, 43, 37, 45), mode="vert", sep="dark")
    knot(s, 22, 38, hx("#c89aff"))
    neck(s, skin)
    bald_head(s, skin, mouth="line", size=1.3, ridges=3, mood="angry", sclera=False)
    s.pxs([(28, 16), (29, 16), (22, 16), (23, 16)], hx("#2a0e30"))                     # dark, deep-set eyes
    s.pxs([(29, 16), (23, 16)], hx("#d8a0ff"))
    s.pxs([(25, 21), (26, 21), (27, 21), (28, 21), (29, 20)], hx("#2a0e10"))           # thin lipless mouth
    s.pxs([(26, 22), (28, 22)], BONE[3])
    # hand-held rock drill, the near hand clawed
    s.add(GUNMETAL, s.P((30, 40), (40, 34), (43, 39), (34, 46)), mode="sphere")
    s.add(HAZARD, s.R(32, 41, 35, 43), mode="flat", flat=2, sep="dark")
    drill = s.P((41, 33), (47, 30), (44, 38))
    s.add(STEEL, drill, mode="cyl", tex=(5, 0.25))
    s.add(skin, s.E(37, 44, 2, 2), mode="sphere")
    s.pxs([(39, 45), (40, 46)], BONE[3])
    return s.render(flip)


# ------------------------------------------------------------------ magus (hooded, glowing eyes)
@sprite("gsc_magus", 48, "教派术士", "Cult Magus (Hybrid)", "gsc")
def gsc_magus(flip=False):
    s = Sprite(48)
    robe = CULT_PURPLE
    trim = ramp("#c8a050", light=0.16)
    skin = HYB2
    # staff topped by the four-armed knot in brass, glowing core
    s.add(LEATHER, s.L([(42, 47), (42, 10)], 2), mode="cyl")
    s.add(trim, s.L([(37, 3), (42, 8), (47, 3)], 1), mode="flat", flat=2)
    s.add(trim, s.L([(37, 13), (42, 8), (47, 13)], 1), mode="flat", flat=2)
    s.add(trim, sub(s.E(42, 8, 2.5, 2.5), s.E(42, 8, 1, 1)), mode="sphere")
    s.add(ramp("#c86aff", light=0.25), s.E(42, 8, 1, 1), mode="glow", sep=False)
    # deep robes with high cowl over an enlarged cranium
    arm(s, robe, "L", width=8)
    torso(s, robe, half=16, flare=2, tex=(3, 0.04))
    arm(s, robe, "R", width=8)
    s.add(trim, s.L([(24, 30), (24, 47)], 2), mode="flat", flat=2, sep="dark")
    s.add(trim, s.E(24, 36, 3, 3), mode="sphere")
    knot(s, 22, 34, hx("#3a1a4a"), core=hx("#e8a0ff"))
    hood = union(s.E(24, 15, 13, 13), s.P((10, 22), (38, 22), (39, 33), (9, 33)))
    s.add(robe, hood, mode="sphere", lt=0.3, st=0.62)
    s.add(trim, sub(s.P((13, 33), (16, 20), (24, 6), (33, 20), (36, 33)), s.P((15, 33), (18, 20), (24, 9), (31, 20), (34, 33))),
          mode="flat", flat=2, sep="dark")
    face = s.P((17, 20), (24, 10), (32, 20), (33, 31), (18, 31))
    s.add(SHADOW, face, mode="flat", flat=1, sep=False)
    # pale lower face catching a little light, glowing eyes in the shadow
    s.add(skin, s.P((22, 24), (31, 23), (31, 29), (24, 30)), mode="sphere", sep=False)
    s.pxs([(25, 27), (26, 27), (27, 27), (28, 27)], skin[0])
    for ex in (22, 28):
        s.pxs([(ex, 19), (ex + 1, 19), (ex + 2, 19)], VGLOW)
        s.px(ex + 1, 19, hx("#ffffff"))
        s.px(ex + 1, 20, hx("#8a3aaa"))
    s.add(skin, s.E(41, 38, 2, 2), mode="sphere")
    return s.render(flip)


# ------------------------------------------------------------------ primus (64)
@sprite("gsc_primus", 64, "教派统领", "Cult Primus", "gsc")
def gsc_primus(flip=False):
    s = Sprite(64)
    skin = HYB2
    coat = ramp("#5a3a2a", light=0.16)
    sash = CULT_PURPLE
    bone = ramp("#e0d4b4", light=0.08, dark=0.22)
    # long coat, high collar
    s.add(coat, s.P((6, 63), (8, 44), (14, 38), (26, 34), (38, 34), (50, 38), (56, 44), (58, 63)), mode="cyl", tex=(3, 0.05))
    s.add(coat, s.E(12, 44, 9, 7), mode="sphere", lt=0.35)
    s.add(sash, s.P((14, 40), (50, 56), (50, 61), (14, 46)), mode="vert", sep="dark")
    s.add(LEATHER, s.L([(46, 38), (20, 63)], 3), mode="flat", flat=2, sep="dark")     # bandolier
    for k in range(6):
        s.add(BRASS, s.R(42 - k * 4, 42 + k * 4, 43 - k * 4, 44 + k * 4), mode="flat", flat=3, sep="dark")
    s.add(coat, s.P((18, 38), (20, 26), (26, 30), (26, 38)), mode="cyl", sep="dark")   # collar
    s.add(coat, s.P((44, 38), (44, 28), (40, 30), (38, 38)), mode="cyl", sep="dark")
    knot(s, 30, 52, hx("#d8b0ff"))
    s.add(skin, s.R(28, 30, 37, 38), mode="cyl", lt=0.2, st=0.5)
    # head: big ridged cranium, scars, a brass monocle-sight
    ridged_scalp(s, skin, x0=25, y0=12, size=1.55, ridges=3)
    s.add(skin, union(s.E(32, 20, 9, 10), s.P((24, 22), (42, 20), (41, 30), (34, 34), (27, 31))), mode="sphere", lt=0.38, st=0.72)
    s.add(skin, s.P((30, 15), (42, 15), (42, 18), (31, 18)), mode="flat", flat=1, sep=False)   # heavy brow
    s.pxs([(33, 19), (34, 19), (39, 19), (40, 19)], hx("#2a0e30"))
    s.px(34, 19, hx("#e8c040"))
    s.add(BRASS, sub(s.E(40, 19, 2.5, 2.5), s.E(40, 19, 1.2, 1.2)), mode="sphere", sep=False)
    s.px(40, 19, hx("#ff5a3a"))
    s.add(GUNMETAL, s.L([(38, 18), (28, 16)], 1), mode="flat", flat=1, sep=False)
    s.pxs([(41, 23), (40, 26), (38, 28)], skin[1])
    s.add(ramp("#2a0e10"), s.L([(35, 28), (41, 27)], 1), mode="flat", flat=2, sep=False)
    s.pxs([(36, 29), (38, 29)], BONE[3])
    s.pxs([(30, 8), (31, 10), (33, 12), (34, 14), (36, 21), (37, 23), (37, 25)], hx("#7a2e44"))   # scars
    # bonesword raised in the near hand: long pale blade with violet edge-glow
    s.add(skin, s.E(52, 46, 4, 4), mode="sphere")
    s.add(coat, s.P((44, 40), (54, 38), (58, 50), (50, 54)), mode="cyl")
    s.add(CHIT, s.L([(51, 44), (55, 34)], 3), mode="cyl")
    s.add(CHIT, s.P((49, 37), (59, 33), (59, 35), (50, 39)), mode="flat", flat=2, sep="dark")
    blade = s.P((53, 34), (57, 34), (63, 2), (60, 0), (58, 8))
    s.add(bone, blade, mode="cyl", lt=0.4, tex=(6, 0.04))
    s.add(ramp("#c86aff", light=0.25), s.L([(58, 33), (63, 4)], 1), mode="glow", sep=False)
    for y in (12, 20, 28):
        s.px(57 + (34 - y) // 8 - 1, y, bone[1])
    return s.render(flip)


# ------------------------------------------------------------------ patriarch (96)
@sprite("gsc_patriarch", 96, "教派始祖", "Patriarch", "gsc")
def gsc_patriarch(flip=False):
    s = Sprite(96)
    throne = SHADOW
    sk = PATRI
    # shadowed throne of hewn rock and cable behind everything
    s.add(throne, s.P((6, 95), (6, 34), (14, 16), (30, 6), (48, 2), (66, 6), (82, 16), (90, 34), (90, 95)),
          mode="sphere", lt=0.10, st=0.45)
    s.add(throne, sub(s.P((12, 95), (12, 36), (19, 20), (33, 11), (48, 8), (63, 11), (77, 20), (84, 36), (84, 95)),
                      s.P((15, 95), (15, 37), (21, 23), (34, 14), (48, 11), (62, 14), (75, 23), (81, 37), (81, 95))),
          mode="flat", flat=2, sep=False)
    for x in (10, 86):
        s.add(ramp("#2a2230"), s.L([(x, 40), (x + (2 if x < 48 else -2), 70), (x, 95)], 2), mode="flat", flat=1, sep=False)
    # upper talon-arms: long scything claws curling in over the head
    for side in (-1, 1):
        sh = (48 + side * 22, 60)
        el = (48 + side * 38, 44)
        wr = (48 + side * 36, 24)
        s.add(sk, s.L([sh, el, wr], 7), mode="cyl")
        s.add(CHIT, s.L([el, wr], 5), mode="cyl", sep="line")
        claw = s.P((48 + side * 39, 24), (48 + side * 33, 24), (48 + side * 30, 14), (48 + side * 22, 8),
                   (48 + side * 26, 6), (48 + side * 36, 10))
        s.add(BONE, claw, mode="cyl", lt=0.35, sep="line")
        s.add(BONE, s.P((48 + side * 36, 22), (48 + side * 42, 16), (48 + side * 40, 24)), mode="cyl")
    # bloated body, carapace plates along the shoulders and spine
    s.add(sk, s.P((14, 95), (18, 68), (30, 56), (66, 56), (78, 68), (82, 95)), mode="cyl", lt=0.22)
    for (cx, cy) in [(26, 62), (70, 62)]:
        s.add(CHIT, s.E(cx, cy, 13, 8), mode="sphere", lt=0.36, sep="line")
        s.add(CHIT, s.E(cx + (6 if cx < 48 else -6), cy + 6, 8, 5), mode="sphere", lt=0.36, sep="line")
    for y in (72, 78):
        s.add(sk, s.L([(34, y), (48, y + 3), (62, y)], 1), mode="flat", flat=1, sep=False)
    # the light dies away down the body: shadow-toned flesh below a ragged line
    dim = [(14, 95)] + [(x, 72 + (2 if (x // 5) % 2 else 0)) for x in range(14, 84, 4)] + [(83, 95)]
    s.add(sk, inter(s.P(*dim), s.P((14, 95), (18, 68), (30, 56), (66, 56), (78, 68), (82, 95))),
          mode="flat", flat=1, sep=False, outline=False)
    # lower hands: long-fingered, folded over a dim violet gem
    s.add(sk, s.E(48, 80, 13, 5), mode="vert", lt=0.3, st=0.5)
    for x in range(38, 60, 4):
        s.px(x, 80, sk[1]); s.px(x, 81, sk[1])
    s.add(ramp("#c86aff", light=0.25), s.E(48, 75, 3, 3), mode="glow", sep="line")
    s.px(47, 74, hx("#f4d8ff"))
    # immense swept-back cranium crowned with overlapping carapace plates
    s.add(sk, union(s.E(44, 26, 19, 17), s.E(36, 18, 14, 12)), mode="sphere", lt=0.26, st=0.66)
    for k, (cx, cy, rx, ry) in enumerate([(30, 14, 10, 6), (40, 11, 10, 6), (50, 12, 9, 5)]):
        plate = sub(s.E(cx, cy, rx, ry), s.E(cx + 3, cy + 4, rx, ry))
        s.add(CHIT, plate, mode="sphere", lt=0.4, sep="line")
    for (x, y) in [(36, 26), (40, 30), (34, 32), (46, 22)]:
        s.pxs([(x, y), (x + 1, y + 1), (x + 2, y + 1)], sk[1])
    # long heavy face turned a little toward the right: slit eyes, a fanged maw jutting forward
    face = s.P((44, 30), (62, 28), (70, 33), (76, 44), (70, 52), (56, 56), (46, 52), (42, 42))
    s.add(sk, face, mode="sphere", lt=0.32, st=0.68, sep="line")
    s.add(sk, s.P((46, 32), (70, 31), (71, 35), (47, 36)), mode="flat", flat=1, sep=False)        # brow shelf
    for (x0, x1, yl, yr) in [(50, 57, 38, 36), (61, 68, 36, 35)]:                                # slanted slit eyes
        s.add(ramp("#1a0a1e"), s.P((x0 - 1, yl + 1), (x1 + 1, yr - 1), (x1 + 1, yr + 1), (x0 - 1, yl + 2)), mode="flat", flat=1, sep=False)
        s.add(ramp("#ffe36a", light=0.2), s.L([(x0, yl), (x1, yr)], 1), mode="glow", sep=False)
    s.add(ramp("#1a0a1e"), s.P((52, 46), (76, 44), (72, 48), (54, 49)), mode="flat", flat=1, sep=False)
    for x in range(54, 75, 3):                                                                    # interlocking fangs
        yt = 46 - (x - 52) // 12
        s.pxs([(x, yt), (x, yt + 1)], BONE[3])
        s.pxs([(x + 1, yt + 3), (x + 1, yt + 2)], BONE[2])
    s.pxs([(64, 40), (66, 40), (70, 41)], sk[1])
    s.pxs([(48, 41), (49, 43), (50, 45)], sk[1])                                                  # cheek ridges
    # darkness pooling over the lower body: a ragged shadow edge, short dither band above it
    import random
    rnd = random.Random(7)
    edge = [(12, 95)] + [(x, 86 + rnd.randint(-2, 3)) for x in range(12, 86, 5)] + [(85, 95)]
    s.add(throne, s.P(*edge), mode="flat", flat=1, sep=False, outline=False)
    return s.render(flip)
