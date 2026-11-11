"""Player avatars — ordinary humans, one per faction route (face right)."""
from reg import sprite
from pxlib import Sprite, hx, union, sub, ramp
from parts import *


@sprite("player_imperium", 48, "你（巢都工人）", "You (Hive Worker)", "player")
def player_imperium(flip=False):
    s = Sprite(48)
    skin = SKIN["fair"]
    suit = ramp("#5a6470")
    arm(s, suit, "L", width=7)
    torso(s, suit, half=15)
    arm(s, suit, "R", width=7)
    neck(s, skin)
    # zip + stencilled work number
    s.add(suit, s.R(23, 31, 24, 47), mode="flat", flat=1, sep=False)
    s.pxs([(28, 38), (29, 38), (30, 38), (30, 39), (29, 40), (30, 41), (28, 42), (29, 42), (30, 42)], hx("#c8c0a0"))
    s.pxs([(16, 37), (17, 37), (18, 37)], HAZARD[2])
    # rebreather hanging at the neck
    s.add(GUNMETAL, s.P((21, 26), (28, 26), (29, 31), (22, 31)), mode="sphere")
    s.pxs([(23, 28), (25, 28), (27, 28)], GUNMETAL[0])
    s.add(ramp("#3a3a3a"), s.L([(20, 27), (18, 31)], 1), mode="flat", flat=2, sep=False)
    human_head(s, skin, mouth="line", mood="sad")
    hair(s, ramp("#5a3a24"), style="short")
    s.pxs([(21, 19), (22, 20)], skin[1])   # soot on the jaw
    return s.render(flip)


@sprite("player_chaos", 48, "你（下巢拾荒者）", "You (Underhive Scavenger)", "player")
def player_chaos(flip=False):
    s = Sprite(48)
    skin = SKIN["dark"]
    jacket = ramp("#5a4a3a")
    patch = ramp("#6a5a3a")
    arm(s, jacket, "L", width=7, tex=(2, 0.06))
    torso(s, jacket, half=15, tex=(3, 0.06))
    arm(s, jacket, "R", width=7, tex=(4, 0.06))
    # patches + strap + scavenged trinkets
    s.add(patch, s.R(14, 38, 18, 42), mode="sphere", sep="dark")
    s.add(ramp("#4a5a6a"), s.R(31, 34, 34, 37), mode="sphere", sep="dark")
    s.add(LEATHER, s.L([(14, 31), (34, 47)], 2), mode="flat", flat=2, sep="dark")
    s.pxs([(20, 37), (24, 40), (28, 43)], STEEL[3])
    # hood thrown back + scarf
    s.add(jacket, s.P((12, 31), (14, 22), (20, 20), (19, 30)), mode="cyl", tex=(5, 0.06))
    s.add(ramp("#8a3a2a"), s.P((17, 24), (31, 23), (33, 29), (18, 31)), mode="sphere", tex=(6, 0.08))
    human_head(s, skin, mouth="line", mood="angry")
    hair(s, ramp("#2a201c"), style="short", tex=(3, 0.15))
    # goggles pushed up
    s.add(LEATHER, s.R(18, 10, 31, 11), mode="flat", flat=1, sep=False)
    s.add(BRASS, s.E(26, 10, 2, 2), mode="sphere")
    s.px(26, 10, hx("#a8e0a0"))
    s.pxs([(30, 19), (30, 20)], hx("#8a2a2a"))   # cut on the cheek
    return s.render(flip)


@sprite("player_tau", 48, "你（人类殖民者）", "You (Human Colonist)", "player")
def player_tau(flip=False):
    s = Sprite(48)
    skin = SKIN["tan"]
    tunic = ramp("#b49a6a")
    arm(s, tunic, "L", width=7)
    torso(s, tunic, half=15)
    arm(s, tunic, "R", width=7)
    neck(s, skin)
    s.add(SLATE, s.R(13, 42, 35, 44), mode="vert", sep="dark")   # belt
    s.add(TEAL, s.R(22, 42, 25, 44), mode="sphere")
    # light scarf
    s.add(ramp("#c8d8d0", light=0.08), s.P((18, 25), (31, 25), (32, 31), (25, 34), (17, 31)), mode="sphere")
    s.add(ramp("#c8d8d0", light=0.08), s.P((19, 31), (23, 31), (21, 40), (18, 39)), mode="cyl")
    human_head(s, skin, mouth="line")
    hair(s, ramp("#2a2018"), style="long")
    # T'au-made earpiece with teal lens
    s.add(SLATE, s.P((19, 15), (22, 15), (22, 19), (19, 19)), mode="sphere")
    s.add(SLATE, s.L([(21, 19), (26, 22)], 1), mode="flat", flat=2, sep=False)
    s.px(20, 16, TEAL[3]); s.px(27, 22, TEAL[2])
    return s.render(flip)


@sprite("player_aeldari", 48, "你（幸存的农夫）", "You (Agri-World Survivor)", "player")
def player_aeldari(flip=False):
    s = Sprite(48)
    skin = SKIN["tan"]
    work = ramp("#6a5a44")
    shawl = ramp("#2f9a86", light=0.2)
    trim = ramp("#e4d8b6", light=0.07, dark=0.18)
    arm(s, work, "L", width=7, tex=(2, 0.06))
    torso(s, work, half=15, tex=(3, 0.06))
    arm(s, work, "R", width=7, tex=(4, 0.06))
    neck(s, skin)
    # borrowed alien shawl: fine jade cloth with an ivory border, pinned by a red stone
    s.add(shawl, s.P((7, 38), (12, 30), (20, 26), (28, 26), (36, 30), (41, 38), (36, 42), (30, 36), (24, 44), (18, 36),
                     (12, 42)), mode="sphere")
    s.add(trim, s.L([(12, 41), (18, 35), (24, 43), (30, 35), (36, 41)], 1), mode="flat", flat=2, sep=False)
    s.add(ramp("#e23a4e", light=0.25), s.E(24, 31, 1, 1), mode="sphere", sep="line")
    s.px(23, 30, hx("#ffd0d8"))
    for x in (10, 15, 33, 38):
        s.px(x, 36, trim[3])
    human_head(s, skin, mouth="line", mood="sad")
    hair(s, ramp("#4a3020"), style="short", tex=(5, 0.12))
    s.pxs([(30, 15), (31, 16)], hx("#9a4038"))                     # graze on the brow
    s.pxs([(21, 19), (22, 21)], skin[1])                           # grime
    # bandaged forearm
    s.add(ramp("#d8d0bc", light=0.06), s.R(37, 42, 41, 45), mode="cyl", sep="dark")
    return s.render(flip)


@sprite("player_necrons", 48, "你（考古学者）", "You (Archaeologist)", "player")
def player_necrons(flip=False):
    s = Sprite(48)
    skin = SKIN["fair"]
    coat = ramp("#9a7e54", light=0.16)
    arm(s, coat, "L", width=7, tex=(2, 0.05))
    torso(s, coat, half=15, tex=(3, 0.05))
    arm(s, coat, "R", width=7, tex=(4, 0.05))
    # dust coat lapels, shirt, satchel strap
    s.add(ramp("#c8bca0", light=0.08), s.P((20, 47), (21, 32), (24, 38), (27, 32), (28, 47)), mode="vert", sep="dark")
    s.add(coat, s.P((15, 34), (19, 28), (21, 33), (24, 40), (19, 37)), mode="sphere", sep="dark")
    s.add(coat, s.P((33, 34), (29, 28), (27, 33), (24, 40), (29, 37)), mode="sphere", sep="dark")
    s.add(LEATHER, s.L([(32, 30), (14, 47)], 2), mode="flat", flat=2, sep="dark")
    # scarf
    s.add(ramp("#7a4a3a"), s.P((19, 26), (30, 25), (31, 30), (20, 31)), mode="sphere")
    neck(s, skin)
    human_head(s, skin, mouth="line")
    hair(s, ramp("#6a4a2a"), style="short")
    # goggles pushed up on the forehead
    s.add(LEATHER, s.R(18, 10, 31, 11), mode="flat", flat=1, sep=False)
    for gx in (23, 28):
        s.add(BRASS, s.E(gx, 10, 2, 2), mode="sphere")
        s.px(gx, 10, hx("#a8d0d8"))
    # oil lamp hanging at the chest, glowing
    s.add(ramp("#ffc860", light=0.2), s.E(36, 40, 6, 6), mode="glow", sep=False, outline=False)
    s.add(BRASS, s.R(34, 36, 38, 37), mode="vert")
    s.add(ramp("#ffd88a", light=0.15), s.R(34, 38, 38, 42), mode="glow", sep="line")
    s.add(BRASS, s.R(34, 43, 38, 44), mode="vert")
    s.add(BRASS, s.L([(36, 35), (36, 32)], 1), mode="flat", flat=2, sep=False)
    s.px(36, 40, hx("#fff4d0"))
    s.pxs([(20, 21), (29, 23)], skin[1])                           # dust
    return s.render(flip)
