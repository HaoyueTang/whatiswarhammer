"""Imperium cast (48px busts facing right; astartes 64px)."""
from reg import sprite
from pxlib import Sprite, hx, union, sub, ramp
from parts import *


def lasgun(s, x0=10, y0=46, x1=40, y1=31):
    """diagonal rifle, stock low-left, muzzle up-right."""
    s.add(LEATHER, s.L([(x0, y0), (x0 + 8, y0 - 4)], 4), mode="sphere")           # stock
    s.add(GUNMETAL, s.L([(x0 + 7, y0 - 4), (x1 - 6, y1 + 3)], 3), mode="sphere")   # body
    s.add(LEATHER, s.L([(x0 + 14, y0 - 7), (x1 - 8, y1 + 4)], 2), mode="sphere")  # wood furniture
    s.add(GUNMETAL, s.L([(x1 - 7, y1 + 3), (x1 + 2, y1 - 1)], 1), mode="flat", flat=2)  # barrel
    s.add(GUNMETAL, s.P((x0 + 14, y0 - 6), (x0 + 17, y0 - 8), (x0 + 19, y0 - 4), (x0 + 16, y0 - 2)), mode="sphere")  # power pack


@sprite("guardsman", 48, "星界军士兵", "Guardsman", "imperium")
def guardsman(flip=False):
    s = Sprite(48)
    skin = SKIN["tan"]
    arm(s, KHAKI, "L")
    torso(s, KHAKI)
    arm(s, KHAKI, "R")
    neck(s, skin)
    # flak vest
    s.add(FLAK, s.P((13, 47), (13, 34), (18, 31), (30, 31), (35, 34), (35, 47)), mode="cyl", lt=0.2, st=0.7)
    s.add(FLAK, s.R(15, 39, 33, 41), mode="vert", sep="dark")       # vest band
    human_head(s, skin, mouth="line")
    # helmet
    helm = union(s.E(24, 13, 8, 6), s.R(15, 13, 33, 15))
    helm = sub(helm, s.R(0, 16, 47, 47))
    s.add(OLIVE, helm, mode="sphere", lt=0.36, st=0.66)
    s.add(OLIVE, s.R(15, 15, 33, 15), mode="flat", flat=1, sep=False)
    # chin strap
    s.pxs([(22, 20), (22, 21), (22, 22), (23, 23), (24, 24), (25, 24)], LEATHER[1])
    lasgun(s)
    # rank pip / dogtag
    s.pxs([(29, 33), (29, 34)], STEEL[3])
    return s.render(flip)


@sprite("guard_sergeant", 48, "星界军军士", "Guard Sergeant", "imperium")
def guard_sergeant(flip=False):
    s = Sprite(48)
    skin = SKIN["fair"]
    arm(s, OLIVE, "L")
    torso(s, OLIVE)
    arm(s, OLIVE, "R")
    neck(s, skin)
    s.add(FLAK, s.P((12, 47), (12, 34), (18, 31), (30, 31), (36, 34), (36, 47)), mode="cyl", lt=0.2, st=0.7)
    # shoulder plates
    s.add(FLAK, s.E(12, 33, 5, 4), mode="sphere")
    s.add(FLAK, s.E(36, 33, 5, 4), mode="sphere")
    # chevrons on the near pauldron
    s.pxs([(34, 32), (35, 33), (36, 32), (37, 31)], GOLD[3])
    s.pxs([(34, 34), (35, 35), (36, 34), (37, 33)], GOLD[2])
    human_head(s, skin, beard=ramp("#6a4a34"), mouth="frown", mood="angry", scar=True)
    # beret-ish soft cap, tilted
    cap = union(s.E(23, 10, 8, 4), s.P((15, 11), (31, 9), (32, 12), (16, 13)))
    s.add(DKGREY, cap, mode="sphere", lt=0.35)
    s.pxs([(26, 9), (27, 9), (26, 10)], GOLD[3])
    # chainsword over shoulder (hilt low, blade up-right)
    s.add(LEATHER, s.L([(28, 46), (31, 42)], 3))
    s.add(BRASS, s.R(29, 39, 35, 41), mode="sphere")
    blade = s.P((31, 39), (34, 39), (45, 17), (43, 16))
    s.add(STEEL, blade, mode="cyl")
    for i in range(0, 22, 3):
        s.px(44 - i // 2 + 1, 18 + i, hx("#d8dde2"))
        s.px(30 + i // 2 + 2, 38 - i, GUNMETAL[1]) if False else None
    s.add(BLOOD, s.L([(33, 38), (43, 18)], 1), mode="flat", flat=1, sep=False, outline=False)
    return s.render(flip)


@sprite("commissar", 48, "政委", "Commissar", "imperium")
def commissar(flip=False):
    s = Sprite(48)
    skin = SKIN["fair"]
    arm(s, BLACKCOAT, "L", width=7)
    torso(s, BLACKCOAT, half=16)
    arm(s, BLACKCOAT, "R", width=7)
    neck(s, skin)
    # high collar + lapels
    s.add(BLACKCOAT, s.P((18, 24), (21, 31), (24, 38), (16, 34)), mode="sphere")
    s.add(BLACKCOAT, s.P((30, 24), (27, 31), (24, 38), (32, 34)), mode="sphere")
    s.add(WHITE, s.P((22, 29), (26, 29), (24, 35)), mode="flat", flat=2)   # shirt
    s.add(CRIMSON, s.P((10, 41), (38, 36), (38, 40), (10, 45)), mode="vert", lt=0.3, st=0.7)  # sash
    # gold epaulettes & buttons
    s.add(GOLD, s.R(8, 31, 14, 33), mode="sphere")
    s.add(GOLD, s.R(34, 31, 40, 33), mode="sphere")
    for x in range(9, 15, 2):
        s.px(x, 34, GOLD[1]); s.px(x + 26, 34, GOLD[1])
    s.pxs([(27, 33), (27, 36)], GOLD[3])
    human_head(s, skin, mouth="frown", mood="angry", scar=True)
    # peaked cap: crown, band, visor
    crown = s.P((14, 8), (17, 3), (31, 2), (35, 6), (34, 10), (15, 11))
    s.add(BLACKCOAT, crown, mode="sphere", lt=0.4)
    s.add(CRIMSON, s.R(16, 9, 33, 11), mode="vert", sep="dark")
    s.add(BLACKCOAT, s.P((26, 12), (36, 11), (37, 13), (28, 14)), mode="flat", flat=1)   # visor
    # cap badge: original gold star-diamond
    s.pxs([(25, 4), (24, 5), (26, 5), (25, 6), (23, 5), (27, 5)], GOLD[3])
    s.px(25, 5, GOLD[1])
    # bolt pistol raised in the near hand
    s.add(SKIN["fair"], s.E(38, 39, 2, 2), mode="sphere")
    s.add(GUNMETAL, s.P((36, 37), (44, 33), (45, 35), (38, 39)), mode="sphere")
    s.add(GUNMETAL, s.R(37, 38, 39, 42), mode="sphere")
    s.px(44, 34, hx("#d8d0b0"))
    return s.render(flip)


@sprite("preacher", 48, "牧师", "Preacher", "imperium")
def preacher(flip=False):
    s = Sprite(48)
    skin = SKIN["fair"]
    robe = ramp("#6b5a48")
    arm(s, robe, "L", width=8)
    torso(s, robe, half=16, flare=2)
    arm(s, robe, "R", width=8)
    # hood
    hood = union(s.E(24, 18, 11, 12), s.P((13, 22), (35, 22), (37, 33), (11, 33)))
    s.add(robe, hood, mode="sphere", lt=0.3, st=0.6)
    s.add(robe, s.E(25, 19, 8, 9), mode="flat", flat=0, sep=False)    # hood opening shadow
    human_head(s, skin, x0=18, y0=10, mouth="open", mood="angry")
    # parchment purity seals hanging from the chest
    s.add(PARCH, s.P((14, 35), (19, 34), (19, 44), (14, 46)), mode="sphere")
    s.add(CRIMSON, s.E(16, 34, 2, 2), mode="sphere")
    for y in range(37, 44, 2):
        s.px(16, y, PARCH[0]); s.px(17, y, PARCH[0])
    # candle-gold rosary / chain
    for i, x in enumerate(range(20, 31)):
        s.px(x, 31 + abs(x - 25) // -2 + 3, GOLD[3] if i % 2 else GOLD[1])
    # raised lantern / censer in the near hand
    s.add(skin, s.E(38, 34, 2, 2))
    s.add(BRASS, s.L([(38, 32), (40, 22)], 1), mode="flat", flat=1)
    s.add(BRASS, s.P((37, 22), (43, 22), (44, 17), (40, 14), (36, 17)), mode="sphere")
    s.pxs([(39, 18), (40, 18), (40, 19), (41, 19)], hx("#ffe9a0"))
    s.pxs([(39, 19), (40, 17)], hx("#ffcb50"))
    return s.render(flip)


@sprite("hive_foreman", 48, "巢都工头", "Hive Foreman", "imperium")
def hive_foreman(flip=False):
    s = Sprite(48)
    skin = SKIN["tan"]
    overall = ramp("#7a5a3a")
    shirt = ramp("#5a5650")
    arm(s, shirt, "L", width=8, half=16)
    torso(s, shirt, half=17, flare=1)
    arm(s, shirt, "R", width=8, half=17)
    neck(s, skin, 20, 22, 28, 30)
    # overall bib + straps with hazard stripes
    s.add(overall, s.P((13, 47), (14, 37), (34, 37), (35, 47)), mode="cyl")
    s.add(HAZARD, s.P((15, 37), (17, 30), (20, 30), (19, 37)), mode="cyl", sep="dark")
    s.add(HAZARD, s.P((29, 37), (28, 30), (31, 30), (33, 37)), mode="cyl", sep="dark")
    for y in range(31, 37, 2):
        s.px(17 + (37 - y) // 4, y, hx("#2a2420")); s.px(30 + (y - 30) // 4, y, hx("#2a2420"))
    s.add(overall, s.R(20, 40, 28, 44), mode="sphere", sep="dark")   # pocket
    s.pxs([(21, 42), (22, 42), (23, 42)], STEEL[3])                   # pen / tool in pocket
    human_head(s, skin, mouth="open", mood="angry", beard=None)
    # thick moustache
    s.add(ramp("#3a2a20"), s.G(26, 19, ["######", "#....#"]), mode="flat", flat=2, sep=False)
    hair(s, ramp("#3a2a20"), style="crop")
    # goggles pushed up on the forehead
    s.add(LEATHER, s.R(18, 11, 31, 12), mode="flat", flat=1, sep=False)
    s.add(BRASS, s.E(25, 11, 2, 2), mode="sphere")
    s.add(BRASS, s.E(30, 11, 2, 2), mode="sphere")
    s.pxs([(25, 11), (30, 11)], hx("#9fd8d0"))
    # whistle on a chain + wrench in the near hand
    s.pxs([(24, 31), (25, 32), (26, 33)], STEEL[3])
    s.add(skin, s.E(39, 41, 2, 2))
    s.add(STEEL, s.L([(39, 41), (44, 26)], 2), mode="cyl")
    s.add(STEEL, s.P((42, 22), (47, 23), (46, 27), (44, 25), (43, 27), (41, 26)), mode="sphere")
    return s.render(flip)


@sprite("medicae", 48, "医疗官", "Medicae", "imperium")
def medicae(flip=False):
    s = Sprite(48)
    skin = SKIN["fair"]
    coat = ramp("#c8c4b4", light=0.10)
    arm(s, coat, "L", width=7)
    torso(s, coat, half=15)
    arm(s, coat, "R", width=7)
    neck(s, skin)
    s.add(ramp("#3f6a6a"), s.P((19, 31), (29, 31), (26, 47), (22, 47)), mode="cyl")   # teal scrubs
    s.add(coat, s.P((18, 29), (23, 47), (14, 47), (14, 34)), mode="cyl", sep="dark")  # lapel L
    s.add(coat, s.P((30, 29), (25, 47), (34, 47), (34, 34)), mode="cyl", sep="dark")  # lapel R
    # dried blood on the coat
    s.pxs([(31, 40), (32, 41), (31, 42), (30, 44), (32, 44)], hx("#7a2a26"))
    s.pxs([(15, 44), (16, 45)], hx("#7a2a26"))
    human_head(s, skin, mouth="line", mood="sad", brow=hx("#4a3426"))
    hair(s, ramp("#4a3426"), style="long")
    # face mask pulled down under the chin
    s.add(ramp("#9ab0a8"), s.P((21, 22), (31, 21), (31, 24), (22, 26)), mode="sphere", sep=False)
    # augmetic monocle lens on the near eye
    s.add(BRASS, s.E(24, 16, 2, 2), mode="sphere")
    s.pxs([(24, 16)], hx("#7aff9a")); s.px(23, 15, BRASS[3])
    # injector in the near hand
    s.add(skin, s.E(38, 38, 2, 2))
    s.add(STEEL, s.L([(37, 37), (44, 27)], 2), mode="cyl")
    s.add(ramp("#5ab07a"), s.L([(39, 34), (42, 30)], 2), mode="flat", flat=3, sep=False)
    s.px(45, 26, STEEL[3]); s.px(46, 25, WHITE_PX)
    return s.render(flip)


@sprite("tech_priest", 48, "机械神甫", "Tech-Priest", "imperium")
def tech_priest(flip=False):
    s = Sprite(48)
    robe = MARSRED
    # mechadendrites behind the shoulder
    s.add(GUNMETAL, s.L([(10, 34), (6, 24), (9, 14), (14, 10)], 2), mode="cyl")
    s.add(BRASS, s.E(14, 10, 2, 2), mode="sphere")
    s.px(15, 9, EYE_GREEN)
    s.add(GUNMETAL, s.L([(36, 33), (42, 26), (43, 18)], 2), mode="cyl")
    s.add(STEEL, s.P((41, 18), (45, 18), (46, 14), (43, 12), (40, 14)), mode="sphere")
    arm(s, robe, "L", width=8)
    torso(s, robe, half=16, flare=2, tex=(3, 0.04))
    arm(s, robe, "R", width=8)
    # hood with a dark void face
    hood = union(s.E(24, 17, 11, 12), s.P((12, 22), (36, 22), (38, 33), (10, 33)))
    s.add(robe, hood, mode="sphere", lt=0.3, st=0.6)
    face = s.E(26, 19, 7, 8)
    s.add(ramp("#1e1a1e", light=0.08, dark=0.06, outline=0.08), face, mode="flat", flat=1, sep=False)
    # metal mask + optic cluster
    s.add(GUNMETAL, s.P((22, 20), (32, 18), (33, 26), (24, 27)), mode="sphere")
    for (x, y) in [(27, 17), (30, 17), (29, 20)]:
        s.add(BRASS, s.E(x, y, 1, 1), mode="flat", flat=1)
    s.pxs([(27, 17), (30, 17), (29, 20)], EYE_GREEN)
    s.pxs([(26, 22), (28, 22), (30, 22), (26, 24), (28, 24), (30, 24)], hx("#1e1a1e"))   # vox grille
    # gear motif on the chest (plain cog, no skull)
    s.add(BRASS, s.E(24, 39, 4, 4), mode="sphere")
    s.pxs([(24, 34), (24, 44), (19, 39), (29, 39), (21, 36), (27, 36), (21, 42), (27, 42)], BRASS[2])
    s.add(MARSRED, s.E(24, 39, 1, 1), mode="flat", flat=0, sep=False)
    # cables
    s.add(ramp("#2a2a2a"), s.L([(31, 27), (35, 31), (34, 37)], 1), mode="flat", flat=2, sep=False)
    return s.render(flip)


@sprite("servitor", 48, "机仆", "Servitor", "imperium")
def servitor(flip=False):
    s = Sprite(48)
    skin = SKIN["grey"]
    # cables from the skull back
    s.add(ramp("#2a2a2a"), s.L([(19, 12), (12, 14), (8, 24), (9, 32)], 2), mode="cyl")
    s.add(ramp("#3a3030"), s.L([(20, 16), (14, 20), (13, 30)], 1), mode="flat", flat=2)
    arm(s, GUNMETAL, "L", width=7)
    torso(s, GUNMETAL, half=15)
    # a heavy drill instead of the near arm
    s.add(GUNMETAL, s.P((35, 31), (41, 33), (42, 41), (36, 41)), mode="cyl")
    s.add(BRASS, s.R(35, 41, 43, 44), mode="sphere")
    drill = s.P((36, 44), (42, 44), (39, 47))
    s.add(STEEL, union(drill, s.R(36, 44, 42, 47)), mode="cyl")
    s.pxs([(37, 45), (39, 46), (41, 45)], STEEL[0])
    neck(s, skin)
    s.add(ramp("#2a2a2a"), s.R(20, 26, 28, 30), mode="cyl")   # neck clamp
    human_head(s, skin, mouth="line", sclera=False)
    # skull plate + red optic replacing the near eye
    s.add(GUNMETAL, s.P((18, 13), (22, 8), (27, 8), (28, 13), (24, 15), (19, 16)), mode="sphere")
    s.pxs([(20, 12), (24, 10)], STEEL[3])
    s.add(GUNMETAL, s.E(24, 16, 2, 2), mode="sphere")
    s.px(24, 16, EYE_RED); s.px(25, 16, hx("#ff9a7a"))
    # jaw replaced by a vox grille
    s.add(STEEL, s.P((23, 19), (31, 19), (31, 22), (28, 25), (23, 24)), mode="sphere")
    s.pxs([(25, 21), (27, 21), (29, 21), (25, 23), (27, 23)], GUNMETAL[0])
    # barcode tattoo / stitches on the skull
    s.pxs([(29, 11), (29, 12), (30, 11), (30, 12)], skin[0])
    # chest plate rivets
    for x in (16, 20, 28, 32):
        s.px(x, 36, STEEL[3])
    s.add(ramp("#2a2a2a"), s.R(18, 38, 30, 41), mode="vert", sep="dark")
    return s.render(flip)


@sprite("inquisitor", 48, "审判官", "Inquisitor", "imperium")
def inquisitor(flip=False):
    s = Sprite(48)
    skin = SKIN["fair"]
    coat = ramp("#3a2a30", light=0.14, dark=0.12, outline=0.2)
    arm(s, coat, "L", width=8, half=16)
    torso(s, coat, half=17, flare=2)
    arm(s, coat, "R", width=8, half=17)
    neck(s, skin)
    # tall upturned collar
    s.add(coat, s.P((14, 30), (16, 18), (20, 24), (21, 32)), mode="cyl")
    s.add(CRIMSON, s.P((22, 30), (26, 30), (24, 40)), mode="flat", flat=1)   # red vest
    s.add(coat, s.P((34, 30), (32, 18), (29, 25), (27, 32)), mode="cyl")
    # buckles
    for y in (35, 39, 43):
        s.px(26, y, STEEL[3]); s.px(27, y, STEEL[2])
    human_head(s, skin, mouth="line", mood="angry", beard=ramp("#a8a8a8"), brow=hx("#a8a8a8"))
    # wide-brimmed hat with tall crown
    s.add(coat, s.P((19, 10), (20, 2), (31, 1), (32, 9)), mode="cyl", lt=0.25)
    s.add(CRIMSON, s.R(19, 7, 32, 8), mode="vert", sep="dark")
    s.add(coat, s.P((10, 11), (24, 9), (40, 10), (36, 13), (14, 13)), mode="sphere", lt=0.4)
    # pendant: original red gem in a steel ring (no inquisitorial symbol)
    s.add(STEEL, s.E(24, 43, 2, 2), mode="sphere")
    s.px(24, 43, EYE_RED)
    # power sword hilt over the shoulder, crackling blue
    s.add(BRASS, s.R(38, 33, 40, 38), mode="cyl")
    s.add(ramp("#6ab0e0", light=0.2), s.P((38, 32), (40, 32), (45, 14), (44, 13)), mode="cyl")
    s.pxs([(43, 18), (42, 22), (41, 27)], hx("#e8f6ff"))
    s.add(coat, s.R(36, 38, 41, 42), mode="sphere")   # gloved hand
    return s.render(flip)


@sprite("psyker", 48, "灵能者", "Psyker", "imperium")
def psyker(flip=False):
    s = Sprite(48)
    skin = SKIN["pale"]
    robe = ramp("#4a5a58")
    glow = ramp("#58a8ff", light=0.25)
    arm(s, robe, "L", width=8)
    torso(s, robe, half=15, flare=2, tex=(11, 0.05))
    arm(s, robe, "R", width=8)
    neck(s, skin)
    # suppression collar
    s.add(GUNMETAL, s.R(18, 25, 30, 29), mode="cyl")
    s.pxs([(20, 27), (23, 27), (26, 27), (29, 27)], hx("#58a8ff"))
    human_head(s, skin, mouth="open", eyes=hx("#bfe6ff"), mood="sad")
    # cable plugs in the bald skull
    s.add(GUNMETAL, s.R(20, 8, 22, 10), mode="flat", flat=2)
    s.add(GUNMETAL, s.R(25, 7, 27, 9), mode="flat", flat=2)
    s.add(ramp("#2a2a30"), s.L([(21, 8), (16, 4), (10, 6), (6, 14)], 1), mode="flat", flat=2)
    s.add(ramp("#2a2a30"), s.L([(26, 7), (24, 2), (18, 0)], 1), mode="flat", flat=2)
    # crackling warp-light in the raised hand
    s.add(skin, s.E(39, 32, 2, 3))
    s.add(glow, s.E(41, 25, 4, 4), mode="sphere", lt=0.6, st=0.9)
    s.pxs([(41, 25), (42, 24), (40, 26)], WHITE_PX)
    for (x, y) in [(36, 20), (37, 21), (45, 20), (46, 19), (44, 30), (45, 31), (38, 27), (35, 24)]:
        s.px(x, y, hx("#9ad6ff"))
    s.pxs([(33, 17), (34, 18), (35, 18), (36, 19)], hx("#58a8ff"))
    return s.render(flip)


@sprite("enforcer", 48, "执法官", "Enforcer", "imperium")
def enforcer(flip=False):
    s = Sprite(48)
    armour = BLACKARM
    arm(s, armour, "L", width=8, half=16)
    torso(s, armour, half=17, flare=1)
    s.add(armour, s.E(11, 33, 6, 4), mode="sphere")
    s.add(armour, s.E(37, 33, 6, 4), mode="sphere")
    s.add(armour, s.R(19, 24, 29, 31), mode="cyl")   # gorget
    # chest carapace plates
    s.add(armour, s.P((15, 33), (33, 33), (31, 42), (17, 42)), mode="sphere", lt=0.25)
    s.add(armour, s.R(17, 43, 31, 47), mode="vert", sep="dark")
    s.pxs([(23, 36), (24, 36), (25, 36), (24, 37)], STEEL[3])   # badge (plain shield shape)
    s.pxs([(23, 35), (25, 35)], STEEL[2])
    # helmet with full mirrored visor
    helm = union(s.E(24, 15, 9, 9), s.R(16, 15, 33, 24))
    s.add(armour, helm, mode="sphere", lt=0.35)
    visor = s.P((22, 13), (34, 13), (34, 20), (23, 20))
    s.add(ramp("#3a8a9a", light=0.3), visor, mode="sphere", lt=0.45)
    s.pxs([(25, 14), (26, 14), (27, 14), (25, 15)], hx("#c8f4f4"))
    s.add(armour, s.P((24, 21), (33, 21), (32, 25), (25, 26)), mode="sphere")   # rebreather jaw
    s.pxs([(27, 23), (29, 23), (31, 23)], armour[0])
    s.px(17, 18, hx("#ff4a3a"))   # helmet lamp
    # shock maul held up
    s.add(armour, s.E(39, 41, 3, 2))
    s.add(GUNMETAL, s.L([(39, 43), (43, 26)], 2), mode="cyl")
    s.add(STEEL, s.E(44, 23, 3, 4), mode="sphere")
    s.pxs([(41, 19), (47, 21), (46, 26), (42, 20)], hx("#9ad6ff"))
    return s.render(flip)


@sprite("astartes", 64, "星际战士", "Space Marine", "imperium")
def astartes(flip=False):
    s = Sprite(64)
    plate = ramp("#56657a", light=0.18)       # steel grey-blue (original livery)
    pl2 = ramp("#64748a", light=0.18)
    trim = BONE
    # backpack exhaust stacks
    for x in (14, 46):
        s.add(GUNMETAL, s.R(x, 10, x + 4, 24), mode="cyl")
        s.add(GUNMETAL, s.R(x - 1, 9, x + 5, 11), mode="cyl")
    s.add(plate, s.P((10, 30), (16, 18), (48, 18), (54, 30)), mode="cyl")   # backpack
    # torso
    s.add(plate, s.P((14, 63), (16, 38), (24, 32), (40, 32), (48, 38), (50, 63)), mode="cyl", lt=0.22, st=0.66)
    s.add(pl2, s.P((20, 38), (32, 46), (44, 38), (43, 50), (32, 55), (21, 50)), mode="sphere")
    s.add(trim, s.P((21, 40), (32, 47), (43, 40), (43, 43), (32, 50), (21, 43)), mode="vert", sep="dark")
    s.add(plate, s.R(22, 55, 42, 63), mode="vert", sep="dark")
    for y in (58, 61):
        for x in range(23, 42):
            s.px(x, y, plate[1])
    # huge pauldrons with a bone rim along the lower edge
    for cx in (12, 52):
        dome = s.E(cx, 38, 12, 11)
        dome = sub(dome, s.R(0, 46, 63, 63))
        s.add(pl2, dome, mode="sphere", lt=0.36, st=0.64)
        s.add(trim, inter_rim(s, cx), mode="vert", sep="dark")
    # helmet sunk between the shoulders
    helm = union(s.E(32, 25, 9, 9), s.R(23, 25, 41, 34))
    s.add(pl2, helm, mode="sphere", lt=0.42, st=0.7, sep="line")
    s.add(trim, s.P((30, 16), (33, 16), (33, 26), (30, 26)), mode="cyl", sep="dark")
    s.add(plate, s.P((27, 24), (42, 23), (42, 26), (28, 27)), mode="flat", flat=1, sep=False)
    s.add(ramp("#4ad06a", light=0.3), s.R(31, 26, 34, 28), mode="sphere", sep="line")
    s.add(ramp("#4ad06a", light=0.3), s.R(38, 26, 40, 28), mode="sphere", sep="line")
    s.px(31, 26, hx("#d8ffd8")); s.px(38, 26, hx("#d8ffd8"))
    snout = s.P((33, 30), (41, 29), (45, 32), (44, 36), (35, 36))
    s.add(pl2, snout, mode="sphere")
    for x in (38, 40, 42):
        s.px(x, 33, plate[0]); s.px(x, 34, plate[0])
    s.add(GUNMETAL, s.E(26, 31, 3, 3), mode="sphere")
    # bolter held across the body
    gun = ramp("#3e4048", light=0.16)
    s.add(gun, s.P((20, 55), (52, 44), (56, 52), (24, 62)), mode="sphere", lt=0.4)
    s.add(gun, s.P((30, 58), (36, 56), (38, 63), (32, 63)), mode="cyl")
    s.add(gun, s.P((48, 40), (54, 38), (55, 42), (49, 44)), mode="sphere")   # sight
    s.add(BRASS, s.R(55, 45, 61, 51), mode="sphere")
    s.add(gun, s.R(61, 47, 63, 49), mode="flat", flat=1)
    s.add(pl2, s.E(24, 57, 5, 5), mode="sphere")
    s.pxs([(40, 53), (44, 52), (48, 51)], BRASS[3])
    return s.render(flip)


def inter_rim(s, cx):
    from pxlib import inter
    return inter(s.E(cx, 38, 12, 11), s.R(0, 44, 63, 47))
