"""Adeptus Mechanicus route cast (v0.3, SPEC §26). Original designs: deep red robes, brass,
cables, green lenses, plain cog motifs (no skull-cog). The menial, skitarius, magos, electro-priest
and kastelan face right (your side / speakers); the dark mechanicum and the daemon engine face left."""
import math
from reg import sprite
from pxlib import Sprite, hx, union, sub, inter, ramp
from parts import *

ROBE = ramp("#8a1e1e", light=0.18)          # deep forge red
ROBE_DK = ramp("#5e1414", light=0.16, dark=0.12)
MENIAL = ramp("#7a7872", light=0.12)         # grey menial robe
CABLE = ramp("#2a2a2e", light=0.14, dark=0.08, outline=0.12)
LENS = ramp("#5aff7a", light=0.22)
IVORY = ramp("#d8ceb0", light=0.08)
BLACKBR = ramp("#26222a", light=0.16, dark=0.08, outline=0.12)   # dark mechanicum black
DBRASS = ramp("#9a7230", light=0.20)
VIOLET = ramp("#c03aff", light=0.25)
FURNACE = ramp("#ff7a1e", light=0.26)
COPPERC = ramp("#b8642e", light=0.22)
ARC = hx("#bfe8ff")
ARC2 = hx("#5ab8ff")


def cog(s, cx, cy, r, rmp, teeth=8, hole=None, tooth=1.6, broken=()):
    """plain gear: ring + square-ish teeth (+ optional hub hole). broken: tooth indices left off."""
    m = s.E(cx, cy, r, r)
    for k in range(teeth):
        if k in broken:
            continue
        a = 2 * math.pi * k / teeth
        x, y = cx + math.cos(a) * (r + tooth * 0.6), cy + math.sin(a) * (r + tooth * 0.6)
        m = union(m, s.E(x, y, tooth * 0.8, tooth * 0.8))
    if hole:
        m = sub(m, s.E(cx, cy, hole, hole))
    s.add(rmp, m, mode="sphere", lt=0.34, st=0.68)
    return m


def lens_px(s, x, y, big=False):
    s.px(x, y, LENS[3] if not big else hx("#d8ffd8"))


# ------------------------------------------------------------------ player
@sprite("player_mechanicus", 48, "你（工役）", "You (Forge Menial)", "player")
def player_mechanicus(flip=False):
    s = Sprite(48)
    skin = SKIN["pale"]
    # hood thrown back behind the head
    s.add(MENIAL, s.P((13, 31), (15, 21), (19, 16), (22, 28)), mode="cyl", tex=(5, 0.05))
    arm(s, MENIAL, "L", width=7, tex=(2, 0.05))
    torso(s, MENIAL, half=15, tex=(3, 0.06))
    arm(s, MENIAL, "R", width=7, tex=(4, 0.05))
    # rope cincture, stencilled work-number tag, a data-slate clutched to the chest
    s.add(ramp("#9a8a64"), s.L([(10, 43), (38, 43)], 2), mode="flat", flat=2, sep="dark")
    s.add(ramp("#9a8a64"), s.L([(28, 43), (30, 47)], 1), mode="flat", flat=1, sep=False)
    s.add(GUNMETAL, s.P((28, 33), (37, 31), (39, 41), (30, 43)), mode="sphere", sep="line")
    s.add(CABLE, s.P((30, 34), (36, 33), (37, 39), (31, 40)), mode="flat", flat=2, sep=False)
    s.pxs([(31, 35), (32, 35), (33, 35), (31, 37), (32, 37), (34, 37)], LENS[3])
    s.add(skin, s.E(29, 42, 2, 2), mode="sphere")
    neck(s, skin)
    s.pxs([(21, 26), (21, 28), (22, 26), (22, 27), (23, 26), (23, 28)], hx("#3a3434"))   # barcode on the neck
    human_head(s, skin, mouth="line", mood="sad")
    hair(s, ramp("#4a4440", light=0.10), style="crop", tex=(9, 0.3))                             # shaved stubble
    # the small augment: brass socket at the temple, green diode, cable to the nape
    s.add(BRASS, s.E(20, 13, 1.6, 1.6), mode="sphere", sep="line")
    s.px(20, 13, LENS[3])
    s.add(CABLE, s.L([(19, 15), (18, 19), (19, 24)], 1), mode="flat", flat=2, sep=False)
    return s.render(flip)


# ------------------------------------------------------------------ skitarius
@sprite("skitarius", 48, "护教军", "Skitarius", "mechanicus")
def skitarius(flip=False):
    s = Sprite(48)
    plate = ramp("#8a8478", light=0.14)
    # hooded red cloak over grey plate
    arm(s, ROBE, "L", width=8, tex=(2, 0.04))
    torso(s, plate, half=14)
    s.add(ROBE, s.P((7, 47), (9, 34), (14, 29), (18, 30), (16, 47)), mode="cyl", tex=(3, 0.04))       # cloak fall
    s.add(ROBE, s.P((32, 47), (31, 30), (36, 29), (41, 34), (42, 47)), mode="cyl", tex=(4, 0.04))
    s.add(BRASS, s.P((19, 34), (29, 34), (28, 44), (20, 44)), mode="sphere", sep="line")              # breastplate
    cog(s, 24, 39, 2.5, DBRASS, teeth=6, hole=0.8)
    s.add(CABLE, s.L([(22, 27), (19, 33)], 1), mode="flat", flat=2, sep=False)
    s.add(CABLE, s.L([(28, 27), (30, 33)], 1), mode="flat", flat=2, sep=False)
    # hood
    hood = union(s.E(24, 16, 11, 11), s.P((13, 20), (35, 20), (36, 30), (12, 30)))
    s.add(ROBE, hood, mode="sphere", lt=0.3, st=0.62)
    s.add(ramp("#1e1a1e", light=0.08, dark=0.06, outline=0.08), s.E(26, 19, 7, 8), mode="flat", flat=1, sep=False)
    # mask: visor with twin green lenses, rebreather snout with side filters
    s.add(GUNMETAL, s.P((20, 15), (32, 14), (33, 26), (22, 27)), mode="sphere", sep="line")
    for (x, y) in [(25, 18), (30, 18)]:
        s.add(LENS, s.E(x, y, 1.5, 1.5), mode="glow", sep="line")
        s.px(x - 1 if x < 28 else x, y - 1, hx("#e0ffe0"))
    s.add(BRASS, s.P((25, 22), (32, 21), (34, 26), (26, 27)), mode="sphere", sep="line")
    s.pxs([(28, 23), (30, 23), (28, 25), (30, 25), (32, 24)], BRASS[0])
    s.add(GUNMETAL, s.R(20, 22, 23, 27), mode="cyl", sep="line")                                    # filter canister
    s.add(GUNMETAL, s.R(33, 22, 36, 26), mode="cyl", sep="line")
    s.pxs([(21, 23), (21, 25), (34, 23), (34, 25)], STEEL[3])
    # long rifle held across the body: dark stock, brass receiver, green power cell, thin barrel
    s.add(CABLE, s.L([(10, 47), (40, 33)], 3), mode="sphere")
    s.add(BRASS, s.P((20, 42), (30, 37), (32, 40), (22, 45)), mode="sphere", sep="line")
    s.add(LENS, s.R(24, 40, 26, 41), mode="glow", sep="line")
    s.add(STEEL, s.L([(39, 33), (47, 29)], 1), mode="flat", flat=3)
    s.add(GUNMETAL, s.L([(37, 36), (38, 39)], 1), mode="flat", flat=1)
    s.add(plate, s.E(35, 38, 2.5, 2.5), mode="sphere")
    s.add(plate, s.E(16, 45, 2.5, 2), mode="sphere")
    return s.render(flip)


# ------------------------------------------------------------------ magos (64)
@sprite("magos", 64, "贤者", "Magos", "mechanicus")
def magos(flip=False):
    s = Sprite(64)
    # mechadendrites fanning behind: each ends in a tool
    tips = [((16, 40), (4, 26), (6, 12)), ((22, 38), (16, 18), (20, 4)), ((44, 38), (54, 22), (60, 10)),
            ((46, 42), (58, 36), (62, 26))]
    for i, (a, b, c_) in enumerate(tips):
        s.add(CABLE, s.L([a, b, c_], 2), mode="cyl")
        for t in (0.35, 0.7):
            jx = round(a[0] + (b[0] - a[0]) * t * 2) if t < 0.5 else round(b[0] + (c_[0] - b[0]) * (t - 0.5) * 2)
            jy = round(a[1] + (b[1] - a[1]) * t * 2) if t < 0.5 else round(b[1] + (c_[1] - b[1]) * (t - 0.5) * 2)
            s.px(jx, jy, BRASS[3])
        x, y = c_
        if i == 0:      # lens
            s.add(BRASS, s.E(x, y, 3, 3), mode="sphere", sep="line")
            s.add(LENS, s.E(x, y, 1.5, 1.5), mode="glow", sep=False)
        elif i == 1:    # pincer
            s.add(STEEL, s.P((x - 3, y + 2), (x - 2, y - 3), (x, y + 1)), mode="cyl")
            s.add(STEEL, s.P((x + 3, y + 2), (x + 2, y - 3), (x, y + 1)), mode="cyl")
        elif i == 2:    # drill
            s.add(STEEL, s.P((x - 2, y + 3), (x + 2, y + 1), (x + 3, y - 4)), mode="cyl", tex=(4, 0.3))
        else:           # data-plug
            s.add(BRASS, s.R(x - 1, y - 2, x + 1, y + 2), mode="cyl")
            s.pxs([(x, y - 3), (x - 1, y - 3)], STEEL[3])
    # heavy robes, wide hood, brass mantle
    s.add(ROBE, s.P((6, 63), (10, 42), (20, 34), (44, 34), (54, 42), (58, 63)), mode="cyl", tex=(3, 0.04))
    s.add(ROBE, s.E(13, 44, 9, 7), mode="sphere", lt=0.34)
    s.add(BRASS, s.P((14, 40), (24, 36), (40, 36), (50, 40), (46, 46), (18, 46)), mode="sphere", sep="line")
    for x in range(18, 48, 4):
        s.px(x, 42, BRASS[0])
    s.add(ROBE_DK, s.P((24, 46), (40, 46), (42, 63), (22, 63)), mode="vert", sep="dark")
    cog(s, 32, 54, 5, BRASS, teeth=8, hole=1.5)
    s.add(LENS, s.E(32, 54, 1, 1), mode="glow", sep=False)
    s.add(CABLE, s.L([(26, 46), (24, 63)], 1), mode="flat", flat=2, sep=False)
    s.add(CABLE, s.L([(38, 46), (41, 63)], 1), mode="flat", flat=2, sep=False)
    hood = union(s.E(32, 20, 13, 14), s.P((18, 26), (46, 26), (48, 38), (16, 38)))
    s.add(ROBE, hood, mode="sphere", lt=0.3, st=0.62)
    s.add(ramp("#1a161a", light=0.08, dark=0.06, outline=0.08), s.E(34, 24, 8, 10), mode="flat", flat=1, sep=False)
    # face: brass plate with a cluster of lenses and a vox grille
    s.add(BRASS, s.P((28, 18), (40, 16), (41, 32), (31, 33)), mode="sphere", sep="line")
    for (x, y, r) in [(34, 21, 2), (39, 21, 1.5), (37, 25, 1)]:
        s.add(GUNMETAL, s.E(x, y, r + 1, r + 1), mode="sphere", sep="line")
        s.add(LENS, s.E(x, y, r, r), mode="glow", sep=False)
    s.px(33, 20, hx("#e0ffe0"))
    for y in (28, 30):
        s.pxs([(x, y) for x in range(33, 40, 2)], BRASS[0])
    # staff with a cog-ring head in the near hand
    s.add(GUNMETAL, s.L([(52, 63), (52, 6)], 2), mode="cyl")
    cog(s, 52, 6, 4, BRASS, teeth=8, hole=2)
    s.add(LENS, s.E(52, 6, 1, 1), mode="glow", sep=False)
    s.add(ROBE, s.P((44, 44), (52, 42), (56, 50), (48, 54)), mode="cyl")
    s.add(GUNMETAL, s.E(52, 46, 3, 3), mode="sphere")
    return s.render(flip)


# ------------------------------------------------------------------ electro-priest
@sprite("electro_priest", 48, "电祭司", "Electro-Priest", "mechanicus")
def electro_priest(flip=False):
    s = Sprite(48)
    skin = SKIN["grey"]
    tattoo = hx("#6ac8ff")
    # wrapped red robes, bare grey arms covered in glowing circuit-lines
    s.add(skin, s.P((6, 47), (8, 36), (14, 31), (16, 47)), mode="cyl")                # far arm
    torso(s, ROBE, half=13, tex=(3, 0.05))
    s.add(ROBE_DK, s.P((14, 34), (34, 44), (34, 47), (14, 38)), mode="vert", sep="dark")   # wrap
    s.add(COPPERC, s.E(24, 36, 3, 3), mode="sphere", sep="line")                        # chest coil
    s.add(COPPERC, sub(s.E(24, 36, 2, 2), s.E(24, 36, 1, 1)), mode="flat", flat=1, sep=False)
    s.px(24, 36, ARC)
    for y in (39, 42, 45):
        s.pxs([(9, y), (10, y + 1), (11, y)], tattoo)
    # cowl lowered around the shoulders; bald grey head with glowing circuit-tattoos,
    # a brass blindfold over the eyes and a grilled jaw-plate
    s.add(ROBE, s.P((11, 34), (14, 25), (20, 22), (30, 22), (35, 26), (37, 34), (24, 31)), mode="sphere", lt=0.3)
    neck(s, skin)
    human_head(s, skin, mouth="line", eyes_closed=True)
    s.add(BRASS, s.P((18, 14), (32, 14), (32, 18), (18, 18)), mode="vert", sep="line")
    s.pxs([(23, 16), (27, 16), (31, 16)], hx("#4a3018"))
    s.add(GUNMETAL, s.P((24, 20), (31, 20), (31, 25), (25, 25)), mode="sphere", sep="line")
    s.pxs([(26, 22), (28, 22), (30, 22), (27, 24), (29, 24)], GUNMETAL[0])
    for pts in ([(21, 9), (21, 12), (24, 12)], [(25, 9), (25, 11), (28, 11), (28, 13)], [(19, 20), (19, 23), (21, 24)]):
        s.add(ramp("#5ab8ff", light=0.3), s.L(pts, 1), mode="glow", sep=False)
    # near arm raised, both hands crackling with arcs
    s.add(skin, s.L([(34, 46), (38, 36), (40, 28)], 5), mode="cyl")
    for (x, y) in [(36, 42), (38, 37), (39, 32)]:
        s.pxs([(x, y), (x + 1, y)], tattoo)
    s.add(skin, s.E(40, 26, 3, 3), mode="sphere")
    s.add(skin, s.E(10, 47, 3, 2), mode="sphere")
    for pts in ([(40, 23), (38, 19), (41, 16), (39, 12)], [(42, 24), (45, 21), (44, 17), (47, 14)],
                [(37, 25), (34, 22), (35, 19)], [(43, 27), (46, 28), (47, 31)],
                [(10, 45), (6, 41), (8, 38), (4, 35)], [(12, 45), (14, 41)]):
        s.add(ramp("#5ab8ff", light=0.3), s.L(pts, 1), mode="glow", sep=False)
    s.pxs([(40, 23), (39, 21), (41, 16), (45, 21), (6, 41)], ARC)
    return s.render(flip)



# ------------------------------------------------------------------ kastelan robot (64)
@sprite("kastelan_robot", 64, "卡斯特兰机器人", "Kastelan Robot", "mechanicus")
def kastelan_robot(flip=False):
    s = Sprite(64)
    hull = ROBE
    # shoulder-mounted heavy gun behind the far shoulder
    s.add(GUNMETAL, s.P((2, 22), (14, 18), (16, 26), (4, 30)), mode="sphere")
    for y in (20, 24):
        s.add(CABLE, s.L([(0, y + 2), (4, y)], 2), mode="flat", flat=2)
    # massive barrel torso
    s.add(hull, s.P((8, 63), (8, 40), (16, 30), (48, 30), (56, 40), (56, 63)), mode="cyl", lt=0.24)
    s.add(IVORY, s.P((18, 36), (46, 36), (44, 56), (20, 56)), mode="sphere", sep="line")
    cog(s, 32, 46, 6, BRASS, teeth=10, hole=2.5)
    s.add(LENS, s.E(32, 46, 1.5, 1.5), mode="glow", sep=False)
    s.add(BRASS, s.R(10, 58, 54, 60), mode="vert", sep="dark")
    for x in range(12, 54, 6):
        s.px(x, 59, BRASS[3])
    # huge round pauldrons
    for (cx, r) in [(12, 12), (52, 12)]:
        s.add(hull, s.E(cx, 36, r, 10), mode="sphere", lt=0.36, sep="line")
        s.add(BRASS, inter(s.E(cx, 36, r, 10), s.R(0, 42, 63, 44)), mode="vert", sep="dark")
        s.pxs([(cx - 6, 32), (cx, 30), (cx + 6, 32)], BRASS[3])
    # small dome head sunk between the shoulders, single visor slit
    s.add(GUNMETAL, s.R(24, 22, 40, 30), mode="cyl")
    dome = union(s.E(32, 18, 9, 9), s.R(23, 18, 41, 24))
    s.add(IVORY, dome, mode="sphere", lt=0.42, st=0.72, sep="line")
    s.add(CABLE, s.P((26, 17), (41, 16), (41, 20), (27, 21)), mode="flat", flat=1, sep=False)
    s.add(LENS, s.R(30, 18, 40, 18), mode="glow", sep=False)
    s.px(38, 18, hx("#e0ffe0"))
    s.add(BRASS, s.R(31, 8, 33, 10), mode="cyl")
    s.pxs([(25, 23), (28, 23), (36, 23), (39, 23)], STEEL[3])
    # great power fist raised in front
    s.add(hull, s.L([(52, 46), (56, 54)], 6), mode="cyl")
    fist = s.P((46, 52), (62, 50), (63, 63), (48, 63))
    s.add(GUNMETAL, fist, mode="sphere", lt=0.34)
    for x in (50, 54, 58):
        s.add(STEEL, s.R(x, 52, x + 2, 56), mode="sphere", sep="line")
    s.add(HAZARD, s.R(48, 60, 62, 62), mode="flat", flat=2, sep="dark")
    s.pxs([(49, 61), (52, 61), (55, 61), (58, 61), (61, 61)], hx("#2a2420"))
    s.add(ramp("#bfe8ff", light=0.1), s.E(55, 49, 2, 1), mode="glow", sep=False)
    return s.render(flip)


# ------------------------------------------------------------------ dark mechanicum (64, foe)
@sprite("dark_mechanicus", 64, "黑暗机械教", "Dark Mechanicum Magos", "mechanicus", face="L")
def dark_mechanicus(flip=False):
    s = Sprite(64)
    # bladed mechadendrites, hooked
    for (a, b, c_) in [((18, 40), (6, 30), (4, 14)), ((22, 36), (16, 14), (24, 2)), ((44, 38), (58, 26), (60, 8))]:
        s.add(CABLE, s.L([a, b, c_], 2), mode="cyl")
        x, y = c_
        s.add(DBRASS, s.P((x - 2, y + 2), (x + 2, y + 1), (x + 4, y - 6), (x + 1, y - 3)), mode="cyl")
    # black robes, ragged hem; brass spikes along the mantle
    s.add(BLACKBR, s.P((6, 63), (10, 42), (20, 34), (44, 34), (54, 42), (58, 63), (52, 60), (46, 63), (40, 59),
                       (32, 63), (24, 59), (18, 63), (12, 60)), mode="cyl", tex=(3, 0.05))
    s.add(BLACKBR, s.E(13, 44, 9, 7), mode="sphere", lt=0.34)
    for (x, h) in [(12, 10), (18, 13), (24, 9), (40, 9), (46, 13), (52, 10)]:
        s.add(DBRASS, s.P((x - 2, 40), (x + 2, 40), (x + (1 if x > 32 else -1), 40 - h)), mode="cyl")
    s.add(DBRASS, s.P((14, 40), (24, 36), (40, 36), (50, 40), (46, 46), (18, 46)), mode="sphere", sep="line")
    # corrupted cog: broken teeth, spikes, a violet eye where the hub should be
    cog(s, 32, 54, 6, DBRASS, teeth=9, hole=2.5, broken=(2, 5))
    s.add(DBRASS, s.P((26, 46), (28, 48), (22, 44)), mode="cyl")
    s.add(VIOLET, s.E(32, 54, 2, 1.5), mode="glow", sep="line")
    s.px(32, 54, hx("#1a0a1e"))
    # hood with horn-like cable bundles
    s.add(CABLE, s.P((22, 14), (14, 4), (12, 10), (20, 20)), mode="cyl")
    s.add(CABLE, s.P((40, 12), (46, 2), (48, 8), (42, 18)), mode="cyl")
    hood = union(s.E(32, 20, 12, 13), s.P((19, 26), (45, 26), (47, 38), (17, 38)))
    s.add(BLACKBR, hood, mode="sphere", lt=0.3, st=0.62)
    s.add(ramp("#0e0a10", light=0.06, dark=0.04, outline=0.06), s.E(34, 24, 8, 10), mode="flat", flat=1, sep=False)
    # cracked iron mask; corrupted lenses (red + violet), dripping
    s.add(DBRASS, s.P((28, 18), (40, 16), (41, 32), (31, 33)), mode="sphere", sep="line")
    s.add(ramp("#ff2a2a", light=0.25), s.E(34, 21, 2, 2), mode="glow", sep="line")
    s.add(VIOLET, s.E(39, 22, 1.5, 1.5), mode="glow", sep="line")
    s.px(33, 20, hx("#ffd0d0"))
    s.pxs([(34, 24), (34, 25), (35, 27)], hx("#ff2a2a"))
    s.pxs([(30, 19), (31, 21), (30, 23), (32, 26)], BLACKBR[0])                         # crack
    for x in range(32, 40, 2):
        s.add(DBRASS, s.P((x, 29), (x + 1, 29), (x + 0.5, 33)), mode="flat", flat=3, sep=False)   # fanged grille
    # serrated axe-staff in the near hand
    s.add(CABLE, s.L([(52, 63), (52, 4)], 2), mode="cyl")
    blade = s.P((53, 4), (62, 6), (60, 10), (63, 14), (59, 18), (53, 18))
    s.add(DBRASS, blade, mode="sphere", lt=0.34, sep="line")
    s.add(ramp("#ff2a2a", light=0.25), s.E(52, 11, 1, 1), mode="glow", sep=False)
    s.add(BLACKBR, s.P((44, 44), (52, 42), (56, 50), (48, 54)), mode="cyl")
    s.add(GUNMETAL, s.E(52, 46, 3, 3), mode="sphere")
    return s.render(flip)


# ------------------------------------------------------------------ daemon engine (96, foe)
@sprite("daemon_engine", 96, "恶魔引擎", "Daemon Engine", "mechanicus", face="L")
def daemon_engine(flip=False):
    s = Sprite(96)
    iron = BLACKBR
    brass = DBRASS
    # smokestacks on the back with furnace-lit mouths, smoke rising
    for (x, h) in [(10, 40), (20, 50), (30, 36)]:
        s.add(iron, s.R(x - 3, 52 - h, x + 3, 56), mode="cyl", tex=(x, 0.06))
        s.add(brass, s.R(x - 4, 50 - h, x + 4, 52 - h), mode="cyl", sep="dark")
        s.add(FURNACE, s.R(x - 2, 50 - h, x + 2, 50 - h), mode="glow", sep=False)
        s.add(ramp("#4a4448", light=0.10), s.E(x - 2, 44 - h, 4, 3), mode="sphere", sep=False, outline=False)
    # hulking armoured back + shoulders
    s.add(iron, s.P((0, 95), (2, 56), (16, 44), (52, 40), (70, 48), (80, 64), (84, 95)), mode="cyl", lt=0.22, tex=(5, 0.04))
    for y in (60, 72, 84):
        s.add(brass, s.L([(4, y + 4), (40, y - 2), (70, y + 2)], 2), mode="flat", flat=2, sep="dark")
    for (x, y) in [(10, 62), (24, 58), (40, 56), (56, 60), (14, 76), (30, 72), (48, 72), (64, 76)]:
        s.px(x, y, brass[3])
    # dorsal spikes
    for (x, y, h) in [(18, 46, 12), (30, 43, 14), (42, 42, 12), (54, 43, 10)]:
        s.add(brass, s.P((x - 3, y + 2), (x + 3, y + 1), (x - 1, y - h)), mode="cyl")
    # furnace grille in the chest, burning
    s.add(iron, s.P((40, 64), (66, 60), (72, 80), (46, 86)), mode="sphere", sep="line")
    s.add(FURNACE, s.P((44, 67), (64, 64), (68, 78), (48, 82)), mode="glow", sep="line")
    for k in range(5):
        x = 47 + k * 4
        s.add(iron, s.L([(x, 66 - k // 2), (x + 3, 82 - k)], 1), mode="flat", flat=1, sep=False)
    s.pxs([(54, 72), (56, 74), (58, 72), (60, 75)], hx("#fff2b0"))
    # great horned head, heavy iron jaw hanging open on the furnace
    s.add(brass, s.P((50, 18), (40, 6), (34, 0), (42, 2), (54, 12), (58, 20)), mode="cyl")        # back horn
    s.add(brass, s.P((64, 16), (70, 4), (78, 0), (74, 8), (70, 20)), mode="cyl")                  # front horn
    skull = s.P((46, 24), (56, 14), (74, 14), (88, 22), (94, 34), (90, 40), (70, 42), (52, 40))
    s.add(iron, skull, mode="sphere", lt=0.38, st=0.7, sep="line")
    s.add(brass, s.P((56, 20), (86, 22), (88, 26), (58, 26)), mode="vert", sep="dark")             # brow plate
    for ex in (74, 84):
        s.add(ramp("#ff3a1a", light=0.3), s.R(ex, 28, ex + 4, 29), mode="glow", sep="line")
        s.px(ex + 1, 28, hx("#ffd8a0"))
    jaw = s.P((54, 50), (93, 48), (95, 54), (86, 62), (60, 60))
    mouth = s.P((60, 39), (93, 37), (93, 50), (62, 52))
    s.add(FURNACE, mouth, mode="glow", sep="line")
    s.add(ramp("#ffd06a", light=0.15), s.P((68, 42), (90, 41), (88, 47), (70, 48)), mode="glow", sep=False)
    s.add(iron, jaw, mode="sphere", lt=0.36, sep="line")
    for x in range(64, 93, 4):                                                                     # iron fangs
        s.add(brass, s.P((x, 40), (x + 2, 40), (x + 1, 45)), mode="cyl", sep=False)
        s.add(brass, s.P((x + 1, 51), (x + 3, 51), (x + 2, 46)), mode="cyl", sep=False)
    s.add(brass, s.R(58, 54, 88, 55), mode="flat", flat=1, sep="dark")
    # chain hanging from the jaw
    for k in range(6):
        y = 60 + k * 3
        s.add(STEEL, sub(s.E(80 - k, y, 1.5, 1.5), s.E(80 - k, y, 0.5, 0.5)), mode="flat", flat=2 if k % 2 else 1, sep=False)
    # clawed foreleg planted in front
    s.add(iron, s.P((70, 66), (84, 62), (90, 84), (78, 90)), mode="cyl", sep="line")
    s.add(brass, s.R(72, 76, 88, 79), mode="vert", sep="dark")
    for x in (76, 82, 88):
        s.add(brass, s.P((x - 3, 89), (x + 2, 88), (x + 4, 95), (x - 2, 95)), mode="cyl", sep="line")
    return s.render(flip)
