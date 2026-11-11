"""T'au Empire cast (allies on the T'au route -> face right)."""
from reg import sprite
from pxlib import Sprite, hx, union, sub, inter, ramp
from parts import *

LENS = ramp("#46d8c8", light=0.25)
BODYSUIT = ramp("#3e4652")


def pulse_rifle(s, x0=8, y0=46, x1=46, y1=28):
    s.add(SLATE, s.L([(x0, y0), (x1 - 8, y1 + 4)], 4), mode="sphere")
    s.add(OCHRE, s.L([(x0 + 10, y0 - 5), (x1 - 12, y1 + 6)], 2), mode="cyl", sep="dark")
    s.add(SLATE, s.L([(x1 - 9, y1 + 4), (x1, y1)], 2), mode="cyl")
    s.add(LENS, s.R(x1 - 1, y1 - 1, x1 + 1, y1 + 1), mode="glow")


def tau_helmet(s, armour, cx=25, cy=16):
    """original rounded helm: forward-sloped faceplate, single wide visor, side sensor dome."""
    helm = union(s.E(cx, cy, 9, 9), s.P((cx - 8, cy), (cx + 10, cy + 2), (cx + 7, cy + 10), (cx - 6, cy + 10)))
    s.add(armour, helm, mode="sphere", lt=0.4, st=0.68, sep="line")
    s.add(BODYSUIT, s.P((cx - 2, cy - 1), (cx + 10, cy), (cx + 10, cy + 3), (cx - 1, cy + 3)), mode="flat", flat=1, sep=False)
    s.add(LENS, s.R(cx + 2, cy, cx + 9, cy + 2), mode="sphere", lt=0.45, sep=False)
    s.pxs([(cx + 3, cy), (cx + 4, cy)], hx("#e8fff8"))
    s.add(SLATE, s.E(cx - 5, cy + 2, 3, 3), mode="sphere", sep="dark")   # sensor dome
    s.px(cx - 6, cy + 1, LENS[3])
    s.add(SLATE, s.L([(cx - 5, cy - 1), (cx - 8, cy - 10)], 1), mode="flat", flat=2)   # antenna
    s.px(cx - 8, cy - 10, LENS[3])
    s.add(armour, s.P((cx + 1, cy + 5), (cx + 9, cy + 5), (cx + 7, cy + 10), (cx + 2, cy + 10)), mode="sphere", sep="dark")


@sprite("tau_warrior", 48, "钛火战士", "T'au Fire Warrior", "tau")
def tau_warrior(flip=False):
    s = Sprite(48)
    arm(s, BODYSUIT, "L", width=7)
    torso(s, BODYSUIT, half=15)
    arm(s, BODYSUIT, "R", width=7)
    # chest plate + shoulder plates
    s.add(OCHRE, s.P((15, 47), (14, 34), (19, 31), (29, 31), (34, 34), (33, 47)), mode="cyl", lt=0.25)
    s.add(OCHRE, s.P((5, 36), (10, 30), (17, 30), (16, 40), (7, 42)), mode="sphere")
    s.add(OCHRE, s.P((43, 36), (38, 30), (31, 30), (32, 40), (41, 42)), mode="sphere")
    s.add(SLATE, s.R(17, 40, 31, 41), mode="flat", flat=1, sep=False)
    s.add(BODYSUIT, s.R(20, 24, 29, 31), mode="cyl")
    tau_helmet(s, OCHRE)
    pulse_rifle(s)
    s.pxs([(10, 34), (12, 33)], CLEAN[2])
    return s.render(flip)


@sprite("tau_ethereal", 48, "以太族", "Ethereal", "tau")
def tau_ethereal(flip=False):
    s = Sprite(48)
    skin = TAUSKIN
    robe = CLEAN
    # honour stave behind
    s.add(SLATE, s.L([(41, 47), (41, 6)], 2), mode="cyl")
    s.add(OCHRE, s.P((38, 8), (41, 0), (44, 8), (41, 12)), mode="sphere")
    s.add(LENS, s.E(41, 7, 1, 1), mode="glow")
    # long topknot falling behind
    s.add(ramp("#2a2a34", light=0.18), s.P((17, 10), (12, 16), (10, 30), (13, 40), (16, 30), (19, 14)), mode="cyl")
    s.add(OCHRE, s.R(11, 22, 15, 24), mode="sphere")
    arm(s, robe, "L", width=8)
    torso(s, robe, half=16, flare=2)
    arm(s, robe, "R", width=8)
    # layered mantle, ochre trim, teal gem
    s.add(OCHRE, s.P((10, 34), (16, 29), (32, 29), (38, 34), (36, 38), (12, 38)), mode="cyl")
    s.add(robe, s.P((13, 36), (18, 31), (30, 31), (35, 36), (24, 41)), mode="sphere", sep="dark")
    s.add(LENS, s.E(24, 37, 2, 2), mode="sphere")
    s.add(SLATE, s.P((22, 41), (26, 41), (26, 47), (22, 47)), mode="cyl")
    neck(s, skin)
    tau_head(s, skin, mouth="smile")
    # forehead crest
    s.add(skin, s.P((22, 9), (26, 7), (32, 10), (30, 12), (24, 11)), mode="sphere", sep="dark")
    s.add(skin, s.E(40, 36, 2, 2))
    return s.render(flip)


@sprite("tau_battlesuit", 64, "钛战斗服", "T'au Battlesuit", "tau")
def tau_battlesuit(flip=False):
    s = Sprite(64)
    # jet pack
    s.add(SLATE, s.P((8, 22), (16, 14), (26, 16), (24, 34), (10, 34)), mode="sphere")
    s.add(SLATE, s.R(6, 30, 12, 40), mode="cyl")
    s.add(ramp("#ffb040"), s.R(7, 41, 11, 42), mode="glow")
    # torso: angular chest
    s.add(BODYSUIT, s.P((18, 63), (20, 44), (44, 44), (46, 63)), mode="cyl")
    chest = s.P((16, 30), (24, 22), (44, 22), (52, 30), (50, 48), (40, 54), (24, 54), (18, 48))
    s.add(OCHRE, chest, mode="sphere", lt=0.32, st=0.66)
    s.add(OCHRE, s.P((22, 34), (46, 34), (44, 46), (24, 46)), mode="sphere", sep="dark")
    s.add(SLATE, s.R(27, 37, 39, 39), mode="flat", flat=1, sep=False)
    s.pxs([(29, 42), (31, 42), (33, 42)], LENS[2])
    # missile pod on the far shoulder
    s.add(SLATE, s.P((10, 24), (22, 20), (24, 30), (12, 34)), mode="sphere")
    for (x, y) in [(14, 25), (18, 24), (15, 29), (19, 28)]:
        s.add(BODYSUIT, s.E(x, y, 1, 1), mode="flat", flat=0, sep=False)
    # head unit: sunk sensor block with lens cluster
    s.add(BODYSUIT, s.R(28, 16, 38, 23), mode="cyl")
    head = s.P((28, 12), (36, 9), (42, 12), (42, 20), (30, 21))
    s.add(OCHRE, head, mode="sphere", sep="line")
    s.add(LENS, s.R(36, 13, 41, 16), mode="sphere", sep="line")
    s.pxs([(37, 13), (38, 13)], hx("#e8fff8"))
    s.add(SLATE, s.L([(31, 12), (28, 2)], 1), mode="flat", flat=2)
    # near shoulder + gun arm
    s.add(OCHRE, s.P((44, 24), (54, 22), (60, 30), (56, 38), (46, 36)), mode="sphere", sep="line")
    s.add(BODYSUIT, s.P((48, 38), (56, 38), (58, 50), (50, 50)), mode="cyl")
    s.add(SLATE, s.P((46, 48), (62, 46), (63, 54), (48, 56)), mode="sphere")
    s.add(OCHRE, s.R(52, 47, 60, 49), mode="cyl", sep="dark")
    s.add(BODYSUIT, s.R(60, 50, 63, 53), mode="flat", flat=1)
    s.pxs([(62, 51), (62, 52)], LENS[3])
    s.pxs([(26, 26), (28, 25), (30, 25)], CLEAN[3])
    return s.render(flip)


@sprite("tau_drone", 32, "钛无人机", "T'au Drone", "tau")
def tau_drone(flip=False):
    s = Sprite(32)
    s.add(ramp("#46d8c8", light=0.2), s.E(16, 27, 6, 1), mode="glow")    # hover glow
    s.add(SLATE, s.L([(9, 18), (7, 25)], 2), mode="cyl")                 # carbine L
    s.add(SLATE, s.L([(23, 18), (25, 25)], 2), mode="cyl")
    disc = s.E(16, 15, 14, 6)
    s.add(OCHRE, disc, mode="sphere", lt=0.36, st=0.62)
    s.add(SLATE, s.R(2, 16, 29, 17), mode="flat", flat=1, sep=False)
    dome = sub(s.E(16, 12, 6, 5), s.R(0, 14, 31, 31))
    s.add(SLATE, dome, mode="sphere", sep="line")
    s.add(LENS, s.E(17, 11, 2, 1), mode="sphere")
    s.px(16, 10, hx("#e8fff8"))
    s.add(SLATE, s.L([(12, 8), (10, 2)], 1), mode="flat", flat=2)
    s.px(10, 2, LENS[3])
    s.pxs([(5, 15), (27, 15)], LENS[2])
    return s.render(flip)


@sprite("kroot", 48, "克鲁特", "Kroot", "tau")
def kroot(flip=False):
    s = Sprite(48)
    skin = ramp("#7a8a6a", light=0.14)
    quill = ramp("#a84a2a", light=0.2)
    # quill crest sweeping back
    for i, (x, y, l) in enumerate([(20, 10, 12), (19, 14, 13), (19, 18, 12), (20, 22, 10)]):
        s.add(quill, s.P((x + 2, y - 1), (x + 2, y + 2), (x - l, y + 4 + i), (x - l + 2, y + 1 + i)), mode="cyl")
    arm(s, skin, "L", width=6, half=13)
    s.add(skin, s.P((12, 47), (13, 34), (19, 30), (29, 30), (35, 34), (36, 47)), mode="cyl", tex=(5, 0.05))
    arm(s, skin, "R", width=6, half=13)
    # leather harness + bone fetishes
    s.add(LEATHER, s.L([(15, 31), (32, 47)], 2), mode="flat", flat=2, sep="dark")
    s.add(LEATHER, s.R(13, 41, 35, 43), mode="vert", sep="dark")
    s.pxs([(18, 44), (18, 45), (22, 44), (22, 45), (26, 44)], BONE[3])
    s.add(skin, s.P((21, 22), (28, 22), (28, 31), (22, 31)), mode="cyl")   # long neck
    # beaked head
    head = s.P((18, 14), (22, 9), (30, 9), (34, 13), (42, 18), (42, 20), (34, 22), (26, 24), (19, 20))
    s.add(skin, head, mode="sphere", lt=0.36, st=0.7)
    s.add(ramp("#3a3a2a"), s.L([(32, 19), (41, 19)], 1), mode="flat", flat=1, sep=False)   # beak line
    s.add(BONE, s.P((38, 18), (43, 18), (42, 21), (39, 20)), mode="sphere", sep=False)
    s.px(29, 14, hx("#f0d040")); s.px(30, 14, EYE_DARK)
    s.pxs([(28, 13), (29, 13), (30, 13), (31, 13)], skin[0])
    # long rifle with blades
    s.add(LEATHER, s.L([(8, 47), (44, 30)], 3), mode="sphere")
    s.add(STEEL, s.P((40, 31), (47, 26), (46, 30), (42, 33)), mode="cyl")
    s.add(STEEL, s.P((10, 46), (5, 47), (6, 42)), mode="cyl")
    return s.render(flip)


@sprite("gue_vesa", 48, "人类辅助军", "Gue'vesa Auxiliary", "tau")
def gue_vesa(flip=False):
    s = Sprite(48)
    skin = SKIN["tan"]
    sand = SAND
    arm(s, BODYSUIT, "L", width=7)
    torso(s, BODYSUIT, half=15)
    arm(s, BODYSUIT, "R", width=7)
    s.add(sand, s.P((15, 47), (14, 34), (19, 31), (29, 31), (34, 34), (33, 47)), mode="cyl", lt=0.25)
    s.add(sand, s.P((6, 36), (10, 30), (17, 30), (16, 40), (8, 41)), mode="sphere")
    s.add(sand, s.P((42, 36), (38, 30), (31, 30), (32, 40), (40, 41)), mode="sphere")
    s.add(TEAL, s.R(16, 37, 32, 38), mode="flat", flat=2, sep=False)
    neck(s, skin)
    human_head(s, skin, mouth="line", mood="sad", beard=ramp("#4a3a2a"))
    hair(s, ramp("#3a2a20"), style="crop")
    # helmet with visor lifted
    helm = sub(union(s.E(24, 11, 8, 5), s.R(16, 11, 32, 13)), s.R(0, 14, 47, 47))
    s.add(sand, helm, mode="sphere", lt=0.4, sep="line")
    s.add(TEAL, s.P((22, 7), (33, 8), (33, 10), (23, 10)), mode="sphere", sep="line")
    s.add(SLATE, s.E(17, 14, 2, 2), mode="sphere")      # ear comm
    s.px(17, 14, LENS[3])
    # carbine
    s.add(SLATE, s.L([(12, 46), (38, 34)], 3), mode="sphere")
    s.add(sand, s.L([(18, 44), (32, 37)], 1), mode="flat", flat=3, sep=False)
    s.add(SLATE, s.L([(37, 34), (44, 31)], 1), mode="flat", flat=2)
    return s.render(flip)


@sprite("tau_water_caste", 48, "钛水族", "Water Caste Envoy", "tau")
def tau_water_caste(flip=False):
    s = Sprite(48)
    skin = TAUSKIN
    robe = ramp("#3a7a8a", light=0.16)
    arm(s, robe, "L", width=8)
    torso(s, robe, half=16, flare=2)
    arm(s, robe, "R", width=8)
    # high rounded shoulder mantle, white sash
    s.add(CLEAN, s.P((9, 36), (14, 29), (34, 29), (39, 36), (35, 39), (13, 39)), mode="sphere")
    s.add(CLEAN, s.P((20, 39), (28, 39), (26, 47), (22, 47)), mode="cyl", sep="dark")
    s.add(OCHRE, s.E(24, 39, 2, 2), mode="sphere")
    neck(s, skin)
    tau_head(s, skin, mouth="smile")
    # tall two-lobed headdress
    hd = union(s.P((17, 12), (19, 2), (25, 0), (27, 6), (31, 2), (33, 10), (31, 13), (18, 14)))
    s.add(CLEAN, hd, mode="sphere", lt=0.4, sep="line")
    s.add(TEAL, s.R(18, 11, 32, 12), mode="flat", flat=2, sep=False)
    s.px(26, 6, LENS[3])
    # data-slate held to the chest
    s.add(skin, s.E(36, 41, 2, 2))
    s.add(SLATE, s.P((30, 34), (38, 33), (39, 43), (31, 44)), mode="sphere")
    s.add(LENS, s.R(32, 35, 37, 40), mode="flat", flat=2, sep=False)
    s.pxs([(33, 36), (35, 36), (33, 38), (34, 38), (36, 38)], hx("#c8fff4"))
    return s.render(flip)
