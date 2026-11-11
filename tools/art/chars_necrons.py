"""Necron route cast (v0.2, SPEC §14) + the human expedition. Original designs:
gunmetal / silver living metal, green glow, skeletal faces. Generic archetypes only
(the lord is no named overlord). Talking characters (lord, cryptek) and humans face
right; warriors, flayed one and canoptek constructs face left."""
from reg import sprite
from pxlib import Sprite, hx, union, sub, inter, ramp
from parts import *

SILVER = ramp("#a8b0b8", light=0.14, dark=0.22)
NMETAL = ramp("#6a727c", light=0.18)
NDARK = ramp("#2c3036", light=0.14, dark=0.10, outline=0.16)
NGLOW = ramp("#4fd16b", light=0.30)
NGOLD = ramp("#c8a040", light=0.20)
GLOWHI = hx("#d8ffe0")

# hand-pixelled necron skull (14x15, facing right): rounded cranium, deep sockets with
# green eyes, nasal slot, barred jaw. d/m/l metal tones, k socket, e eye, g eye core, t tooth gap.
NECSKULLT = [
    "....mmmmmm....",
    "..mmllllllmm..",
    ".mllllllllllm.",
    ".mllllllllllm.",
    "mmllllllllllm.",
    "mdmlkkkkllkkkm",
    "mddkkgekllkgem",
    "mdmkkeekllkeem",
    "mmdlkkkllllkkm",
    ".mdlllllkkllm.",
    ".mmdllllkllm..",
    "..mdtltltltm..",
    "..ddtltltlm...",
    "...ddmmmmm....",
    ".....ddd......",
]


def nec_skull(s, metal=SILVER, x0=18, y0=8, glow=NGLOW, rows=None):
    rows = rows or NECSKULLT
    m = s.G(x0, y0, rows, on="dmlkegt")
    s.add(metal, m, mode="flat", flat=2, sep="line")
    s.stamp(x0, y0, rows, {"d": metal[1], "m": metal[2], "l": metal[3], "k": NDARK[1],
                           "e": glow[2], "g": GLOWHI, "t": NDARK[0]})
    return m


def gauss_rifle(s, x0=8, y0=46, x1=46, y1=26):
    """long angular rifle with a green glowing coil along the top and a blade at the muzzle."""
    s.add(NDARK, s.L([(x0, y0), (x1 - 6, y1 + 3)], 4), mode="sphere")
    s.add(NGLOW, s.L([(x0 + 8, y0 - 6), (x1 - 10, y1 + 2)], 1), mode="glow", sep=False)
    s.add(NMETAL, s.L([(x1 - 7, y1 + 3), (x1, y1)], 2), mode="cyl")
    s.add(SILVER, s.P((x1 - 4, y1 + 3), (x1 + 1, y1 + 3), (x1 - 2, y1 + 7)), mode="cyl")
    s.px(x1, y1, NGLOW[3])


@sprite("necron_warrior", 48, "死灵战士", "Necron Warrior", "necrons", face="L")
def necron_warrior(flip=False):
    s = Sprite(48)
    # back cowl plate behind the head
    s.add(NMETAL, s.P((14, 10), (24, 6), (22, 26), (14, 30)), mode="cyl")
    arm(s, NMETAL, "L", width=6, half=14)
    # skeletal torso: dark core, silver ribs, green glow between
    torso(s, NDARK, half=14)
    s.add(NGLOW, s.E(24, 40, 5, 4), mode="glow", sep=False)
    for y in (34, 37, 40, 43, 46):
        s.add(SILVER, s.P((14, y), (24, y + 1), (34, y), (34, y + 1), (24, y + 2), (14, y + 1)), mode="cyl", sep=False)
    s.add(SILVER, s.R(23, 32, 25, 47), mode="cyl", sep="dark")       # spine/sternum
    s.add(SILVER, s.P((10, 32), (18, 29), (30, 29), (38, 32), (34, 34), (14, 34)), mode="sphere")   # collar plate
    for cx in (9, 39):
        s.add(NMETAL, s.E(cx, 34, 5, 4), mode="sphere", lt=0.36)
    arm(s, NMETAL, "R", width=6, half=14)
    s.add(NDARK, s.R(22, 22, 27, 30), mode="cyl")
    for y in (24, 27):
        s.add(SILVER, s.R(22, y, 27, y), mode="flat", flat=2, sep=False)
    nec_skull(s)
    gauss_rifle(s)
    s.add(SILVER, s.E(14, 44, 2, 2), mode="sphere")             # bony hand
    return s.render(flip)


@sprite("necron_lord", 64, "死灵领主", "Necron Lord", "necrons")
def necron_lord(flip=False):
    s = Sprite(64)
    cloak = ramp("#1e2a26", light=0.16, dark=0.08, outline=0.12)
    # long cloak behind
    s.add(cloak, s.P((8, 63), (10, 34), (20, 22), (44, 22), (54, 34), (56, 63)), mode="cyl", lt=0.24)
    # staff behind the near shoulder: crescent blade + green orb
    s.add(NGOLD, s.L([(52, 63), (52, 6)], 2), mode="cyl")
    s.add(SILVER, s.P((46, 10), (48, 2), (54, 0), (60, 4), (56, 4), (52, 8), (50, 12)), mode="cyl")
    s.add(NGLOW, s.E(52, 10, 2, 2), mode="glow", sep="line")
    s.px(51, 9, GLOWHI)
    # torso + broad gold pectoral collar
    s.add(NMETAL, s.P((16, 63), (18, 40), (24, 34), (40, 34), (46, 40), (48, 63)), mode="cyl", lt=0.24)
    s.add(NGLOW, s.E(32, 52, 4, 4), mode="glow", sep=False)
    for y in (46, 50, 54, 58):
        s.add(SILVER, s.P((22, y), (32, y + 1), (42, y), (42, y + 1), (32, y + 2), (22, y + 1)), mode="cyl", sep=False)
    s.add(SILVER, s.R(31, 44, 33, 63), mode="cyl", sep="dark")
    collar = sub(s.E(32, 36, 17, 10), s.E(32, 30, 9, 6))
    s.add(NGOLD, inter(collar, s.R(0, 30, 63, 46)), mode="sphere", lt=0.36)
    for (x, y) in [(20, 38), (26, 42), (32, 43), (38, 42), (44, 38)]:
        s.px(x, y, NGLOW[2])
    for cx in (12, 52):
        s.add(SILVER, s.E(cx, 40, 9, 7), mode="sphere", lt=0.36, sep="line")
        s.add(NGOLD, inter(s.E(cx, 40, 9, 7), s.R(0, 44, 63, 46)), mode="vert", sep="dark")
    # headdress: tall stepped crown + lappets falling to the shoulders
    s.add(NGOLD, s.P((22, 18), (25, 8), (28, 2), (36, 2), (39, 8), (42, 18), (42, 34), (37, 34), (36, 18), (28, 18),
                     (27, 34), (22, 34)), mode="cyl", sep="dark")
    for y in (22, 26, 30):
        s.add(NDARK, s.R(22, y, 27, y), mode="flat", flat=1, sep=False)
        s.add(NDARK, s.R(37, y, 42, y), mode="flat", flat=1, sep=False)
    # neck + skull face (region-built at this size)
    s.add(NDARK, s.R(28, 26, 36, 36), mode="cyl")
    head = union(s.E(32, 17, 8, 9), s.P((25, 18), (40, 18), (38, 28), (33, 31), (28, 28)))
    s.add(SILVER, head, mode="sphere", lt=0.4, st=0.72, sep="line")
    s.add(NDARK, s.P((27, 15), (40, 14), (40, 18), (28, 19)), mode="flat", flat=1, sep=False)
    for ex in (30, 36):
        s.add(NGLOW, s.R(ex, 15, ex + 2, 17), mode="glow", sep=False)
        s.px(ex + 1, 16, GLOWHI)
    s.add(NDARK, s.R(34, 20, 35, 22), mode="flat", flat=1, sep=False)
    for x in (30, 32, 34, 36):
        s.add(NDARK, s.R(x, 25, x, 27), mode="flat", flat=0, sep=False)
    # crown front: brow band + green gem
    s.add(NGOLD, s.P((24, 11), (40, 9), (40, 12), (24, 13)), mode="vert", sep="dark")
    s.add(NGLOW, s.P((32, 4), (34, 7), (32, 10), (30, 7)), mode="glow", sep="line")
    s.px(31, 6, GLOWHI)
    # hand on the staff
    s.add(SILVER, s.E(52, 44, 3, 3), mode="sphere")
    return s.render(flip)


@sprite("cryptek", 48, "技术术士", "Cryptek", "necrons")
def cryptek(flip=False):
    s = Sprite(48)
    robe = ramp("#22302c", light=0.18, dark=0.10, outline=0.14)
    # ring halo behind the head (tech-collar)
    halo = sub(s.E(23, 14, 12, 12), s.E(23, 14, 10, 10))
    s.add(NGOLD, halo, mode="sphere", lt=0.36)
    for (x, y) in [(23, 2), (11, 14), (14, 5), (32, 5)]:
        s.px(x, y, NGLOW[3])
    # tech-staff: rod with a ring head holding a spark
    s.add(NMETAL, s.L([(42, 47), (42, 12)], 2), mode="cyl")
    s.add(SILVER, sub(s.E(42, 8, 5, 5), s.E(42, 8, 3, 3)), mode="sphere")
    s.add(NGLOW, s.E(42, 8, 1, 1), mode="glow", sep=False)
    # robed body with gold trim + glyph panel
    arm(s, robe, "L", width=8)
    torso(s, robe, half=16, flare=2)
    arm(s, robe, "R", width=8)
    s.add(NGOLD, s.P((20, 47), (21, 33), (27, 33), (28, 47)), mode="cyl", sep="dark")
    for y in (36, 39, 42, 45):
        s.px(24, y, NGLOW[2]); s.px(23, y + 1, NGLOW[1])
    s.add(SILVER, s.P((10, 34), (16, 29), (32, 29), (38, 34), (32, 36), (16, 36)), mode="sphere")
    s.add(NDARK, s.R(21, 22, 27, 30), mode="cyl")
    nec_skull(s)
    s.add(NGOLD, s.L([(20, 9), (31, 8)], 1), mode="flat", flat=2, sep=False)
    s.px(26, 8, NGLOW[3])
    # floating orb near the left hand
    s.add(SILVER, s.E(9, 42, 2, 2), mode="sphere")
    s.add(NGLOW, s.E(7, 33, 3, 3), mode="glow", sep="line")
    s.add(SILVER, sub(s.E(7, 33, 5, 2), s.E(7, 33, 4, 1)), mode="flat", flat=2, sep=False)
    s.px(6, 32, GLOWHI)
    s.add(SILVER, s.E(41, 40, 2, 2), mode="sphere")            # hand on the staff
    return s.render(flip)


@sprite("flayed_one", 48, "剥皮者", "Flayed One", "necrons", face="L")
def flayed_one(flip=False):
    s = Sprite(48)
    rag = ramp("#3a2a26", light=0.14, dark=0.10, outline=0.14)
    rag2 = ramp("#2a201e", light=0.12, dark=0.08, outline=0.1)
    metal = ramp("#7a7c78", light=0.18)
    # dark ragged tatters hanging behind like a torn cowl (silhouette only)
    s.add(rag2, s.P((8, 47), (6, 30), (12, 14), (20, 6), (30, 6), (36, 16), (40, 34), (38, 47), (34, 40), (30, 47),
                    (26, 38), (22, 47), (18, 40), (14, 47)), mode="cyl", tex=(4, 0.08))
    # hunched skeletal body, arms raised with long claws
    s.add(NDARK, s.P((12, 47), (14, 34), (20, 30), (30, 30), (36, 34), (36, 47)), mode="cyl")
    for y in (35, 38, 41, 44):
        s.add(metal, s.P((15, y), (24, y + 1), (33, y), (33, y + 1), (24, y + 2), (15, y + 1)), mode="cyl", sep=False)
    s.add(NGLOW, s.E(24, 40, 3, 2), mode="glow", sep=False)
    s.add(rag, s.P((10, 34), (16, 28), (24, 32), (32, 28), (38, 34), (34, 40), (30, 35), (26, 42), (22, 35), (18, 41),
                   (14, 36)), mode="sphere", tex=(6, 0.1))
    # claw arms
    for (base, mid, hand, tips) in [((12, 36), (6, 28), (8, 18), [(4, 10), (7, 8), (10, 9)]),
                                     ((36, 36), (42, 30), (40, 20), [(44, 12), (41, 10), (38, 11)])]:
        s.add(metal, s.L([base, mid, hand], 3), mode="cyl")
        for t in tips:
            s.add(SILVER, s.L([hand, t], 1), mode="flat", flat=3)
    # skull with a jagged grin, low and forward, tatter hood over the crown
    rows = list(NECSKULLT)
    rows[11] = "..mdtttttttm.."
    rows[12] = "..ddltltltm..."
    nec_skull(s, metal=metal, x0=18, y0=11, rows=rows)
    s.add(rag, s.P((16, 16), (20, 9), (28, 8), (33, 12), (30, 13), (24, 11), (19, 16), (18, 22)), mode="sphere",
          sep="dark", tex=(8, 0.1))
    return s.render(flip)


@sprite("canoptek_scarab", 32, "冥工圣甲虫", "Canoptek Scarab", "necrons", face="L")
def canoptek_scarab(flip=False):
    s = Sprite(32)
    # legs
    for (a, b, c) in [((10, 20), (5, 24), (3, 28)), ((16, 22), (13, 27), (12, 30)), ((22, 21), (25, 26), (26, 29)),
                      ((8, 17), (3, 17), (1, 21))]:
        s.add(NDARK, s.L([a, b, c], 1), mode="flat", flat=2)
    # carapace dome with a central seam and glowing vents
    shell = s.E(14, 15, 11, 7)
    s.add(SILVER, shell, mode="sphere", lt=0.36, st=0.66)
    s.add(NMETAL, s.L([(4, 15), (24, 15)], 1), mode="flat", flat=1, sep=False)
    for (x, y) in [(8, 12), (12, 11), (16, 11)]:
        s.add(NGLOW, s.R(x, y, x + 1, y), mode="glow", sep=False)
    # head with mandibles and a single green eye, facing right
    s.add(NMETAL, s.E(26, 17, 4, 4), mode="sphere", sep="line")
    s.add(SILVER, s.P((28, 19), (31, 21), (29, 22)), mode="cyl")
    s.add(SILVER, s.P((28, 15), (31, 13), (30, 16)), mode="cyl")
    s.add(NGLOW, s.E(27, 16, 1, 1), mode="glow", sep=False)
    s.px(27, 16, GLOWHI)
    return s.render(flip)


@sprite("canoptek_spyder", 64, "冥工蛛", "Canoptek Spyder", "necrons", face="L")
def canoptek_spyder(flip=False):
    s = Sprite(64)
    # far legs
    for (a, b, c) in [((20, 40), (8, 34), (2, 56)), ((26, 44), (16, 48), (12, 63)), ((34, 44), (34, 54), (30, 63))]:
        s.add(NDARK, s.L([a, b, c], 3), mode="cyl")
        s.add(NGLOW, s.E(b[0], b[1], 1, 1), mode="glow", sep=False)
    # bulbous rear body with glowing ribs
    s.add(NMETAL, s.E(20, 26, 16, 14), mode="sphere", lt=0.34, st=0.66)
    for k in range(3):
        s.add(NDARK, s.L([(10 + k * 7, 14 + k), (8 + k * 7, 38 - k)], 1), mode="flat", flat=1, sep=False)
        s.pxs([(9 + k * 7, 22), (9 + k * 7, 28)], NGLOW[2])
    # forward head-block with a big single eye and claw arms
    s.add(SILVER, s.P((30, 24), (44, 18), (56, 24), (58, 36), (46, 44), (32, 40)), mode="sphere", lt=0.38, sep="line")
    s.add(NDARK, s.P((44, 24), (56, 26), (56, 34), (46, 36)), mode="flat", flat=1, sep=False)
    s.add(NGLOW, s.E(50, 30, 4, 4), mode="glow", sep="line")
    s.add(NGLOW, s.E(50, 30, 2, 2), mode="flat", flat=3, sep=False)
    s.px(49, 29, GLOWHI)
    for (sh, el, tip) in [((50, 40), (58, 46), (62, 38)), ((40, 42), (46, 52), (52, 48))]:
        s.add(NMETAL, s.L([sh, el], 3), mode="cyl")
        s.add(SILVER, s.P((el[0] - 1, el[1] - 1), tip, (el[0] + 2, el[1] + 2)), mode="cyl")
    # near legs
    for (a, b, c) in [((30, 40), (26, 52), (22, 63)), ((42, 40), (50, 54), (56, 63))]:
        s.add(NMETAL, s.L([a, b, c], 3), mode="cyl")
        s.add(NGLOW, s.E(b[0], b[1], 1, 1), mode="glow", sep=False)
    return s.render(flip)


# ------------------------------------------------------------------ the human expedition
@sprite("dig_leader", 48, "发掘队长", "Expedition Leader", "necrons")
def dig_leader(flip=False):
    s = Sprite(48)
    skin = SKIN["fair"]
    coat = ramp("#6a5a3e", light=0.16)
    arm(s, coat, "L", width=8)
    torso(s, coat, half=16, flare=2)
    # greatcoat lapels + high collar, waistcoat and chain
    s.add(ramp("#4a3e2a"), s.P((17, 47), (19, 33), (24, 40), (29, 33), (31, 47)), mode="vert", sep="dark")
    s.add(coat, s.P((13, 34), (18, 27), (21, 32), (24, 41), (19, 36)), mode="sphere", sep="dark")
    s.add(coat, s.P((35, 34), (30, 27), (27, 32), (24, 41), (29, 36)), mode="sphere", sep="dark")
    s.pxs([(20, 42), (21, 43), (22, 43), (23, 42)], BRASS[3])
    for y in (41, 45):
        s.px(18, y, BRASS[2]); s.px(30, y, BRASS[2])
    neck(s, skin)
    human_head(s, skin, mouth="line", beard=ramp("#a8a49a", light=0.1))
    s.pxs([(24, 20), (25, 20), (26, 20), (27, 20), (28, 20), (29, 20), (30, 21)], ramp("#a8a49a")[3])   # moustache
    # pith helmet: dome + brim + band
    helm = union(s.E(25, 9, 9, 6), s.P((14, 11), (37, 10), (36, 13), (15, 13)))
    s.add(ramp("#d8cca0", light=0.08), helm, mode="sphere", lt=0.4, sep="line")
    s.add(ramp("#6a4a2a"), s.R(17, 10, 34, 10), mode="flat", flat=2, sep=False)
    # raised magnifier
    s.add(coat, s.L([(36, 46), (40, 36), (39, 30)], 5), mode="cyl")
    s.add(skin, s.E(39, 29, 2, 2), mode="sphere")
    s.add(BRASS, s.L([(39, 28), (41, 22)], 1), mode="flat", flat=2)
    s.add(BRASS, sub(s.E(42, 17, 5, 5), s.E(42, 17, 3, 3)), mode="sphere")
    s.add(ramp("#a8d8e8", light=0.12), s.E(42, 17, 3, 3), mode="sphere", lt=0.45, sep=False)
    s.px(41, 15, hx("#ffffff"))
    return s.render(flip)


@sprite("explorator", 48, "机械教探索者", "Explorator Magos", "necrons")
def explorator(flip=False):
    s = Sprite(48)
    skin = SKIN["pale"]
    robe = MARSRED
    # sensor dish + antenna array over the far shoulder (silhouette unlike the hooded tech-priest)
    s.add(GUNMETAL, s.L([(14, 30), (10, 16)], 2), mode="cyl")
    s.add(STEEL, s.P((2, 12), (8, 6), (16, 10), (12, 18), (4, 18)), mode="sphere", sep="line")
    s.add(GUNMETAL, s.E(9, 12, 2, 2), mode="sphere")
    s.px(9, 11, EYE_GREEN)
    s.add(GUNMETAL, s.L([(33, 29), (36, 4)], 1), mode="flat", flat=2)
    s.add(GUNMETAL, s.L([(35, 30), (40, 10)], 1), mode="flat", flat=2)
    s.pxs([(36, 4), (40, 10)], hx("#ff5a3a"))
    # wide stiff mantle over red robes; black-and-brass hazard trim
    arm(s, robe, "L", width=8)
    torso(s, robe, half=16, flare=2, tex=(3, 0.04))
    arm(s, robe, "R", width=8)
    s.add(robe, s.P((4, 38), (12, 28), (36, 28), (44, 38), (36, 40), (12, 40)), mode="sphere")
    s.add(BLACKCOAT, s.R(6, 38, 42, 40), mode="flat", flat=2, sep="dark")
    for x in range(7, 42, 4):
        s.px(x, 39, BRASS[3])
    # cowl lowered behind the head
    s.add(robe, s.P((14, 30), (16, 18), (22, 14), (24, 28)), mode="cyl", sep="dark")
    neck(s, GUNMETAL)
    human_head(s, skin, mouth="line", mood="calm")
    hair(s, ramp("#8a8a8a"), style="crop")
    # brass rebreather over the jaw + bionic eye
    s.add(BRASS, s.P((25, 18), (32, 18), (32, 23), (26, 24)), mode="sphere", sep="line")
    s.pxs([(27, 20), (29, 20), (31, 20), (27, 22), (29, 22)], BRASS[0])
    s.add(GUNMETAL, s.E(29, 15, 2, 2), mode="sphere", sep="line")
    s.px(29, 15, EYE_GREEN)
    # hand-held auspex scanner with a green screen and twin probes
    s.add(GUNMETAL, s.P((30, 40), (40, 36), (42, 44), (32, 47)), mode="sphere")
    s.add(ramp("#5aff7a", light=0.15), s.P((32, 41), (39, 38), (40, 42), (33, 45)), mode="flat", flat=2, sep=False)
    s.pxs([(34, 42), (35, 41), (36, 42), (37, 40), (38, 41)], hx("#d8ffd8"))
    s.add(STEEL, s.L([(40, 36), (45, 30)], 1), mode="flat", flat=3)
    s.add(STEEL, s.L([(42, 38), (47, 33)], 1), mode="flat", flat=3)
    return s.render(flip)
