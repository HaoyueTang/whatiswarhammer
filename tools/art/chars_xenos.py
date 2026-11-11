"""Xenos: Orks and Tyranids (foes -> face left; authored facing right then mirrored)."""
from reg import sprite
from pxlib import Sprite, hx, union, sub, inter, ramp
from parts import *

FLESH = ramp("#8a3a8a", light=0.18)     # tyranid purple-magenta flesh
CARA = ramp("#d8caa0", light=0.10)      # bone carapace
CARA_DK = ramp("#5a2a5e", light=0.18)   # dark chitin


def ork_head(s, sk, k=1.0, ox=0, oy=0, metal_jaw=False):
    def p(*pts):
        return s.P(*[(round(x * k + ox), round(y * k + oy)) for (x, y) in pts])
    # ear swept back
    s.add(sk, p((21, 17), (9, 12), (12, 16), (19, 22)), mode="cyl")
    head = union(p((18, 18), (21, 11), (29, 9), (36, 12), (39, 18), (39, 20), (20, 22)),
                 p((20, 20), (40, 19), (43, 24), (41, 31), (26, 32), (20, 27)))
    s.add(sk, head, mode="sphere", lt=0.36, st=0.7)
    if metal_jaw:
        s.add(STEEL, p((24, 24), (43, 23), (44, 30), (41, 33), (26, 33)), mode="sphere", sep="line")
        for x in (29, 33, 37, 41):
            s.px(round(x * k + ox), round(27 * k + oy), GUNMETAL[0])
    # heavy brow and small red eyes
    brow = [(x, 16) for x in range(25, 39)]
    s.pxs([(round(x * k + ox), round(y * k + oy)) for (x, y) in brow], sk[0])
    s.pxs([(round(x * k + ox), round(y * k + oy)) for (x, y) in brow], sk[0])
    for ex in (31, 36):
        s.px(round(ex * k + ox), round(17 * k + oy), EYE_RED)
        s.px(round((ex + 1) * k + ox), round(17 * k + oy), hx("#ffb08a"))
    # nose bump
    s.px(round(40 * k + ox), round(20 * k + oy), sk[1])
    # mouth & tusks (underbite)
    y = round(25 * k + oy)
    for x in range(round(29 * k + ox), round(43 * k + ox)):
        s.px(x, y, sk[0])
    for tx in (31, 39):
        s.pxs([(round(tx * k + ox), y - 1), (round(tx * k + ox), y - 2), (round(tx * k + ox) + 1, y - 1)], BONE[3])
    for tx in (34, 36):
        s.px(round(tx * k + ox), y - 1, BONE[2])
    return head


@sprite("ork", 48, "兽人", "Ork", "xenos", face="L")
def ork(flip=False):
    s = Sprite(48)
    sk = ORKSKIN
    # massive hunched shoulders
    s.add(sk, s.E(8, 34, 9, 8), mode="sphere", lt=0.35)
    s.add(RUST, s.P((4, 47), (6, 34), (16, 27), (34, 27), (44, 34), (46, 47)), mode="cyl", tex=(4, 0.08))
    s.add(LEATHER, s.R(10, 40, 40, 42), mode="vert", sep="dark")
    s.add(HAZARD, s.P((3, 34), (10, 26), (17, 28), (14, 38), (5, 40)), mode="sphere")
    for i in range(4):
        s.add(ramp("#2a2420"), s.L([(5 + i * 3, 39), (9 + i * 3, 28)], 1), mode="flat", flat=2, sep=False)
    ork_head(s, sk, ox=-2, oy=-1)
    s.pxs([(26, 11), (27, 12), (28, 13)], hx("#3a5a20"))   # scar
    # choppa raised in the near fist
    s.add(sk, s.E(40, 40, 4, 4), mode="sphere")
    s.add(LEATHER, s.L([(40, 38), (42, 26)], 2), mode="cyl")
    blade = s.P((38, 26), (47, 22), (47, 8), (41, 11), (39, 18))
    s.add(STEEL, blade, mode="sphere", tex=(9, 0.12))
    s.pxs([(46, 10), (46, 14), (46, 18)], hx("#f0f0f0"))
    return s.render(flip)


@sprite("ork_boss", 64, "兽人头目", "Ork Boss", "xenos", face="L")
def ork_boss(flip=False):
    s = Sprite(64)
    sk = ORKDARK
    plate = ramp("#6a5a4a", light=0.16)
    # banner pole behind
    s.add(LEATHER, s.L([(8, 63), (8, 2)], 2), mode="cyl")
    s.add(HAZARD, s.P((10, 2), (22, 4), (20, 12), (10, 14)), mode="sphere", tex=(2, 0.1))
    s.add(ramp("#2a2420"), s.P((12, 6), (18, 6), (15, 11)), mode="flat", flat=2, sep=False)
    # armour slab torso
    s.add(plate, s.P((2, 63), (4, 40), (16, 32), (46, 32), (58, 40), (60, 63)), mode="cyl", tex=(4, 0.06))
    s.add(plate, s.E(10, 40, 11, 9), mode="sphere", lt=0.35, tex=(5, 0.05))
    for x in range(4, 18, 4):
        s.add(HAZARD, s.L([(x, 47), (x + 4, 36)], 2), mode="flat", flat=2, sep="dark")
    s.add(RUST, s.R(14, 46, 48, 63), mode="sphere", sep="dark", tex=(8, 0.1))
    for (x, y) in [(18, 50), (44, 50), (18, 60), (44, 60)]:
        s.px(x, y, STEEL[3])
    ork_head(s, sk, k=1.25, ox=-6, oy=2, metal_jaw=True)
    # horned iron helm
    helm = s.P((19, 18), (22, 10), (34, 7), (44, 11), (46, 19), (20, 21))
    s.add(plate, helm, mode="sphere", lt=0.4, sep="line")
    s.add(BONE, s.P((22, 12), (14, 6), (12, 0), (18, 4), (26, 10)), mode="cyl")
    s.add(BONE, s.P((40, 10), (46, 3), (52, 0), (48, 6), (44, 13)), mode="cyl")
    for x in range(22, 45, 4):
        s.px(x, 19, STEEL[3])
    # power claw
    s.add(GUNMETAL, s.P((46, 40), (60, 36), (63, 48), (50, 52)), mode="sphere")
    for (a, b) in [((52, 52), (54, 62)), ((57, 50), (60, 61)), ((61, 47), (63, 57))]:
        s.add(STEEL, s.L([a, b], 2), mode="cyl")
    s.add(HAZARD, s.R(50, 39, 58, 42), mode="cyl", sep="dark")
    s.pxs([(55, 44), (56, 44)], EYE_RED)
    return s.render(flip)


@sprite("gaunt", 48, "虫族蠕虫", "Gaunt", "xenos", face="L")
def gaunt(flip=False):
    """small, eyeless, hunched; carries a living bio-gun."""
    s = Sprite(48)
    sac = ramp("#a8c84a", light=0.2)
    # narrow hunched body with ridged back plates
    s.add(FLESH, s.P((10, 47), (12, 38), (18, 32), (28, 32), (34, 38), (34, 47)), mode="cyl")
    for (y, w) in [(35, 6), (40, 7), (45, 7)]:
        s.add(CARA, s.P((16 - w, y + 2), (16, y - 2), (16 + w, y + 1), (16 + w - 2, y + 3), (16 - w + 2, y + 4)), mode="sphere", sep="line")
    s.add(FLESH, s.P((22, 22), (29, 21), (32, 34), (24, 35)), mode="cyl")   # neck
    # smooth eyeless skull-dome sweeping back, long jaw
    head = s.P((12, 14), (20, 10), (30, 10), (38, 14), (42, 19), (36, 22), (24, 23), (16, 19))
    s.add(CARA, head, mode="sphere", lt=0.42, st=0.72, sep="line")
    s.pxs([(31, 14), (34, 15), (36, 16)], CARA[1])            # sensory pits, no eyes
    s.add(FLESH, s.P((28, 19), (42, 19), (40, 25), (30, 25)), mode="sphere", sep="dark")
    s.add(ramp("#2a0a2a"), s.L([(31, 22), (41, 21)], 1), mode="flat", flat=1, sep=False)
    for x in (32, 35, 38):
        s.px(x, 20, CARA[3]); s.px(x + 1, 24, CARA[2])
    # the bio-gun: fleshy barrel, bone ridges, glowing ammo sac, dark maw
    gun = s.P((12, 46), (34, 39), (44, 37), (47, 42), (38, 46), (16, 47))
    s.add(FLESH, gun, mode="sphere", lt=0.35)
    for x in (22, 28, 34, 40):
        y = 42 - (x - 22) // 4
        s.add(CARA, s.P((x, y), (x + 2, y - 1), (x + 1, y - 4)), mode="cyl", sep="dark")
    s.add(sac, s.E(20, 44, 4, 3), mode="sphere", sep="line")
    s.px(19, 43, hx("#efffb0"))
    s.add(ramp("#2a0a2a"), s.E(46, 39.5, 1.5, 2), mode="flat", flat=1)
    s.add(CARA, s.L([(30, 36), (33, 40)], 2), mode="cyl")      # clawed grip
    return s.render(flip)


@sprite("genestealer", 48, "基因窃取者", "Genestealer", "xenos", face="L")
def genestealer(flip=False):
    s = Sprite(48)
    blue = ramp("#3a3a8a", light=0.2)
    # rear claws raised high
    s.add(FLESH, s.L([(10, 40), (6, 28), (10, 18)], 3), mode="cyl")
    s.add(CARA, s.P((9, 18), (12, 4), (14, 16)), mode="cyl")
    s.add(CARA, s.P((7, 19), (4, 8), (10, 17)), mode="cyl")
    s.add(blue, s.P((4, 47), (6, 34), (14, 26), (32, 26), (40, 34), (42, 47)), mode="cyl")
    for y in (33, 38, 43):
        s.add(blue, s.R(14, y, 32, y + 2), mode="sphere", sep="dark")
    # bulbous swept-back head
    head = union(s.E(24, 14, 9, 9), s.P((14, 8), (6, 2), (8, 10), (18, 20)), s.P((26, 16), (40, 18), (38, 26), (26, 26)))
    s.add(blue, head, mode="sphere", lt=0.38, st=0.7)
    for x in range(14, 30, 4):
        s.px(x, 9, blue[1]); s.px(x + 1, 10, blue[1])
    s.add(ramp("#2a0a2a"), s.P((28, 20), (40, 19), (38, 25), (30, 25)), mode="flat", flat=1, sep=False)
    for x in range(29, 40, 2):
        s.px(x, 20, WHITE_PX); s.px(x + 1, 24, BONE[2])
    s.add(FLESH, s.L([(36, 22), (42, 24), (45, 22)], 1), mode="flat", flat=3, sep=False)   # tongue
    s.pxs([(30, 15), (31, 15), (34, 15)], hx("#ffd040"))
    s.pxs([(29, 14), (30, 14), (31, 14), (32, 14), (34, 14), (35, 14)], blue[0])
    # front talons
    s.add(blue, s.L([(36, 36), (42, 32)], 3), mode="cyl")
    for (a, b) in [((41, 31), (47, 22)), ((42, 33), (47, 30)), ((40, 30), (43, 20))]:
        s.add(CARA, s.L([a, b], 1), mode="flat", flat=3)
    return s.render(flip)


@sprite("tyranid_warrior", 64, "泰伦武士", "Tyranid Warrior", "xenos", face="L")
def tyranid_warrior(flip=False):
    """big crested warrior-beast: tall back-swept crest, burning eyes, raised bone blades."""
    s = Sprite(64)
    talon = ramp("#b8a47a", light=0.14)
    # two scything bone blades raised high
    for side in (-1, 1):
        s.add(FLESH, s.L([(32 + side * 18, 44), (32 + side * 25, 28), (32 + side * 21, 16)], 4), mode="cyl")
        blade = s.P((32 + side * 20, 18), (32 + side * 24, 8), (32 + side * 18, 0), (32 + side * 10, 2),
                    (32 + side * 16, 6), (32 + side * 18, 18))
        s.add(talon, blade, mode="cyl", lt=0.35, sep="line")
    # body
    s.add(FLESH, s.P((8, 63), (10, 44), (20, 34), (44, 34), (54, 44), (56, 63)), mode="cyl")
    s.add(CARA, s.P((18, 40), (32, 46), (46, 40), (44, 52), (32, 58), (20, 52)), mode="sphere", sep="line")
    for y in (48, 54):
        s.add(CARA_DK, s.L([(22, y), (32, y + 4), (42, y)], 1), mode="flat", flat=1, sep=False)
    for cx in (12, 52):
        s.add(CARA, s.E(cx, 44, 8, 6), mode="sphere", sep="line")
    # tall back-swept crest: stacked bone ridges
    for i, (tx, ty) in enumerate([(4, 10), (8, 4), (14, 0), (21, 2)]):
        s.add(talon if i % 2 else CARA, s.P((24, 30 - i), (tx, ty), (28 + i, 22 - i)), mode="cyl", sep="dark")
    # narrow wedge head with mandibles and burning eyes
    head = s.P((24, 24), (30, 18), (40, 19), (48, 24), (46, 30), (36, 34), (26, 32))
    s.add(CARA, head, mode="sphere", lt=0.4, st=0.72, sep="line")
    s.add(CARA_DK, s.P((33, 22), (47, 23), (46, 26), (34, 26)), mode="flat", flat=1, sep=False)
    for ex in (37, 43):
        s.add(ramp("#ff7a2a", light=0.3), s.R(ex, 23, ex + 2, 24), mode="glow", sep="line")
    s.add(FLESH, s.P((36, 29), (46, 28), (44, 34), (37, 34)), mode="sphere", sep="dark")
    s.add(talon, s.P((44, 28), (50, 30), (46, 35)), mode="cyl")          # mandible hook
    s.add(talon, s.P((38, 33), (44, 35), (39, 37)), mode="cyl")
    # lower arms with a bio-rifle
    s.add(FLESH, s.P((26, 58), (52, 48), (58, 52), (30, 63)), mode="sphere")
    s.add(CARA, s.P((34, 56), (50, 50), (52, 53), (36, 59)), mode="sphere", sep="dark")
    s.add(ramp("#2a0a2a"), s.E(58, 51, 2, 2), mode="flat", flat=1)
    return s.render(flip)


@sprite("hive_tyrant", 96, "虫巢暴君", "Hive Tyrant", "xenos", face="L")
def hive_tyrant(flip=False):
    s = Sprite(96)
    wing = ramp("#4a2050", light=0.2)
    talon = ramp("#b8a47a", light=0.14)
    flesh = ramp("#9a3a8a", light=0.18)
    # membranous wings
    s.add(wing, s.P((36, 50), (16, 20), (0, 12), (6, 30), (0, 44), (10, 52), (6, 66), (30, 66)), mode="sphere", lt=0.2)
    s.add(wing, s.P((62, 50), (82, 18), (95, 12), (90, 30), (95, 44), (86, 52), (90, 66), (66, 66)), mode="sphere", lt=0.2)
    for pts in ([(36, 50), (16, 20), (0, 12)], [(34, 54), (4, 30)], [(32, 58), (8, 52)],
                [(62, 50), (82, 18), (95, 12)], [(64, 54), (92, 30)], [(66, 58), (88, 52)]):
        s.add(CARA_DK, s.L(pts, 2), mode="flat", flat=1, sep=False)
    # great scything talons, curved, raised behind
    for side in (-1, 1):
        bx = 48 + side * 30
        s.add(flesh, s.L([(48 + side * 26, 72), (48 + side * 36, 52), (48 + side * 30, 36)], 6), mode="cyl")
        blade = s.P((48 + side * 28, 38), (48 + side * 32, 22), (48 + side * 26, 8), (48 + side * 16, 0),
                    (48 + side * 22, 8), (48 + side * 26, 22), (48 + side * 24, 38))
        s.add(talon, blade, mode="cyl", lt=0.35, sep="line")
    # body
    s.add(flesh, s.P((14, 95), (18, 66), (32, 54), (64, 54), (78, 66), (82, 95)), mode="cyl")
    for y in range(80, 95, 4):
        s.add(CARA_DK, s.L([(20, y), (76, y)], 1), mode="flat", flat=1, sep=False)
    s.add(CARA, s.P((28, 60), (48, 68), (68, 60), (66, 76), (48, 84), (30, 76)), mode="sphere", sep="line")
    s.add(CARA_DK, s.L([(32, 70), (48, 77), (64, 70)], 1), mode="flat", flat=1, sep=False)
    for cx in (20, 76):
        s.add(CARA, s.E(cx, 66, 12, 9), mode="sphere", sep="line")
        for dx in (-6, 0, 6):
            s.add(CARA, s.P((cx + dx - 2, 60), (cx + dx + 2, 60), (cx + dx - 1, 50)), mode="cyl")
    # crowned head: carapace crest fan behind, purple face plate
    for (a, b, c) in [((36, 34), (22, 14), (42, 30)), ((42, 30), (36, 6), (48, 28)), ((50, 28), (54, 2), (56, 28)),
                      ((58, 30), (68, 8), (62, 34)), ((62, 34), (78, 20), (66, 38))]:
        s.add(talon, s.P(a, b, c), mode="cyl")
    head = s.P((34, 36), (42, 28), (56, 28), (66, 34), (72, 42), (64, 54), (42, 54), (34, 48))
    s.add(CARA, head, mode="sphere", lt=0.4, st=0.7, sep="line")
    s.add(flesh, s.P((46, 44), (72, 42), (66, 54), (46, 54)), mode="sphere", sep="line")
    for x in range(48, 70, 2):
        s.px(x, 45, CARA[3]); s.px(x, 53, CARA[2])
    s.add(ramp("#2a0a2a"), s.L([(48, 49), (69, 47)], 2), mode="flat", flat=1, sep=False)
    s.add(CARA_DK, s.P((50, 35), (70, 36), (70, 40), (52, 40)), mode="flat", flat=1, sep=False)
    for ex in (56, 64):
        s.add(ramp("#ffd040", light=0.2), s.R(ex, 37, ex + 2, 38), mode="glow", sep="line")
    # lower arms with a living cannon
    s.add(flesh, s.P((40, 90), (78, 74), (86, 80), (44, 95)), mode="sphere")
    s.add(CARA, s.P((50, 88), (76, 76), (80, 80), (54, 91)), mode="sphere", sep="dark")
    s.add(ramp("#2a0a2a"), s.E(86, 78, 3, 3), mode="flat", flat=1)
    s.add(ramp("#9aff6a", light=0.2), s.E(86, 78, 1, 1), mode="glow", sep=False)
    return s.render(flip)
