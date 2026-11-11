"""Chaos cast. Humans face right; daemons / traitor giants face left (authored right, flipped)."""
from reg import sprite
from pxlib import Sprite, hx, union, sub, inter, ramp
from parts import *

RAGS = ramp("#5a3a32")
PURPLE = ramp("#4a2a5a", light=0.18)


def spiral_mark(s, x, y, c):
    """small original scratched 'spiral eye' mark used by cults."""
    s.pxs([(x + 1, y), (x + 2, y), (x + 3, y + 1), (x + 3, y + 2), (x + 2, y + 3), (x + 1, y + 3),
           (x, y + 2), (x + 1, y + 1)], c)


@sprite("cultist", 48, "邪教徒", "Cultist", "chaos")
def cultist(flip=False):
    s = Sprite(48)
    skin = SKIN["fair"]
    arm(s, RAGS, "L", width=8, tex=(4, 0.08))
    torso(s, RAGS, half=15, flare=2, tex=(5, 0.08))
    arm(s, RAGS, "R", width=8, tex=(6, 0.08))
    hood = union(s.E(24, 18, 11, 12), s.P((13, 22), (35, 22), (37, 33), (11, 33)))
    s.add(RAGS, hood, mode="sphere", lt=0.3, st=0.6, tex=(9, 0.06))
    s.add(RAGS, s.E(25, 19, 8, 9), mode="flat", flat=0, sep=False)
    human_head(s, skin, x0=18, y0=10, mouth="line", mood="angry", eyes=None)
    # rag mask over mouth & nose
    s.add(ramp("#7a6450"), s.P((20, 19), (33, 18), (33, 23), (28, 26), (22, 25)), mode="sphere", tex=(2, 0.1), sep=False)
    # hood edge back over the forehead
    s.add(RAGS, s.P((17, 13), (24, 8), (33, 10), (33, 13), (20, 15)), mode="sphere", sep=False)
    # painted mark on the chest
    spiral_mark(s, 18, 37, hx("#c0302a"))
    s.pxs([(22, 40), (23, 41)], hx("#c0302a"))
    # crude knife
    s.add(skin, s.E(37, 40, 2, 2))
    s.add(LEATHER, s.R(37, 36, 38, 39), mode="flat", flat=1)
    s.add(STEEL, s.P((37, 35), (39, 35), (41, 27), (39, 28)), mode="cyl")
    return s.render(flip)


@sprite("cult_magus", 48, "邪教祭司", "Cult Magus", "chaos")
def cult_magus(flip=False):
    s = Sprite(48)
    skin = SKIN["pale"]
    # staff behind
    s.add(ramp("#3a2a2a"), s.L([(41, 47), (41, 10)], 2), mode="cyl")
    s.add(BRASS, s.P((38, 10), (44, 10), (46, 4), (41, 1), (36, 4)), mode="sphere")
    s.add(ramp("#c040e0", light=0.25), s.E(41, 6, 2, 2), mode="glow", lt=1.0)
    s.px(41, 6, WHITE_PX)
    arm(s, PURPLE, "L", width=8)
    torso(s, PURPLE, half=16, flare=2)
    s.add(PURPLE, s.P((24, 30), (30, 47), (18, 47)), mode="flat", flat=1, sep=False)
    arm(s, PURPLE, "R", width=8)
    neck(s, skin)
    # flared high collar with bone trim
    s.add(PURPLE, s.P((12, 31), (13, 16), (19, 22), (20, 31)), mode="cyl")
    s.add(PURPLE, s.P((36, 31), (35, 16), (29, 22), (28, 31)), mode="cyl")
    s.add(BONE, s.L([(13, 16), (19, 23)], 1), mode="flat", flat=3, sep=False)
    s.add(BONE, s.L([(35, 16), (29, 23)], 1), mode="flat", flat=3, sep=False)
    human_head(s, skin, mouth="grin", eyes=hx("#e070ff"))
    # tattoo lines + glowing third eye
    s.pxs([(21, 12), (22, 13), (21, 14), (22, 15)], hx("#5a3a6a"))
    s.pxs([(27, 11), (28, 11), (29, 11)], PURPLE[0])
    s.px(28, 12, hx("#ff7aff")); s.px(27, 12, PURPLE[1]); s.px(29, 12, PURPLE[1])
    # gold chain with pendant
    for x in range(19, 30):
        s.px(x, 33 + (1 if 21 < x < 27 else 0), GOLD[3] if x % 2 else GOLD[1])
    s.add(GOLD, s.E(24, 37, 2, 2), mode="sphere")
    s.px(24, 37, hx("#c040e0"))
    s.add(skin, s.E(40, 36, 2, 2))
    return s.render(flip)


@sprite("mutant", 48, "变种人", "Mutant", "chaos")
def mutant(flip=False):
    s = Sprite(48)
    skin = SKIN["sick"]
    # hunched: swollen far shoulder, head pushed down and forward
    s.add(skin, s.E(12, 32, 10, 9), mode="sphere", lt=0.35)
    s.add(RAGS, s.P((6, 47), (8, 36), (16, 31), (32, 32), (40, 37), (42, 47)), mode="cyl", tex=(3, 0.1))
    s.add(skin, s.P((34, 34), (41, 36), (44, 47), (36, 47)), mode="cyl")
    s.add(skin, s.E(41, 45, 4, 3), mode="sphere")    # big knuckles
    s.pxs([(39, 47), (42, 47), (45, 46)], skin[0])
    human_head(s, skin, x0=21, y0=15, mouth="snarl", sclera=False)
    # extra eye on the swollen cheek and a tusk
    s.add(skin, s.E(26, 21, 2, 2), mode="sphere", sep="dark")
    s.px(26, 21, hx("#e8e070")); s.px(27, 21, EYE_DARK)
    s.add(BONE, s.P((32, 27), (34, 26), (35, 22)), mode="cyl")
    # lumpy growths
    for (x, y, r) in [(10, 27, 2), (16, 25, 2), (22, 14, 2)]:
        s.add(skin, s.E(x, y, r, r), mode="sphere", sep="dark")
    s.pxs([(9, 34), (14, 37), (11, 40)], hx("#8a5a3a"))
    s.pxs([(30, 15), (29, 14), (24, 15)], hx("#5a5a3a"))   # sparse hair
    # rag strap
    s.add(ramp("#4a3a2a"), s.L([(16, 31), (30, 46)], 2), mode="flat", flat=2, sep="dark")
    return s.render(flip)


@sprite("heretic_astartes", 64, "混沌星际战士", "Heretic Astartes", "chaos", face="L")
def heretic_astartes(flip=False):
    s = Sprite(64)
    plate = ramp("#7a1e20", light=0.16)
    pl2 = ramp("#8e2624", light=0.16)
    armour64(s, plate, pl2, BRASS, ramp("#ff4a2a", light=0.3), helmet="horned", chest="eye", spikes=True)
    # chains across the chest
    for i, x in enumerate(range(16, 48, 2)):
        s.px(x, 52 + (i % 2), STEEL[3] if i % 2 else STEEL[1])
    # chain-axe
    s.add(GUNMETAL, s.L([(24, 63), (52, 30)], 3), mode="cyl")
    s.add(STEEL, s.P((46, 28), (58, 22), (62, 30), (56, 40), (50, 36)), mode="sphere")
    for (x, y) in [(58, 24), (60, 27), (61, 31), (59, 35), (57, 38)]:
        s.px(x, y, hx("#e8e8e8"))
    s.add(BRASS, s.E(53, 33, 2, 2), mode="sphere")
    s.add(pl2, s.E(26, 59, 5, 4), mode="sphere")
    return s.render(flip)


@sprite("chaos_sorcerer", 64, "混沌术士", "Chaos Sorcerer", "chaos", face="L")
def chaos_sorcerer(flip=False):
    s = Sprite(64)
    plate = ramp("#2a4a6a", light=0.2)
    pl2 = ramp("#335a7e", light=0.2)
    cape = ramp("#5a2a6a")
    s.add(cape, s.P((4, 63), (8, 26), (56, 26), (60, 63)), mode="cyl", tex=(4, 0.03))
    # staff behind the shoulder
    s.add(ramp("#2a2230"), s.L([(56, 63), (56, 10)], 2), mode="cyl")
    # tall crown of gold spines + swept horns behind the helm
    for (tx, ty) in [(22, 6), (27, 2), (32, 0), (37, 2), (42, 6)]:
        s.add(GOLD, s.P((31, 20), (34, 20), (tx + 1, ty)), mode="cyl", sep="line")
    s.add(HORN, s.P((25, 20), (16, 14), (12, 4), (17, 9), (27, 16)), mode="cyl")
    s.add(HORN, s.P((39, 18), (47, 12), (52, 2), (50, 12), (41, 22)), mode="cyl")
    armour64(s, plate, pl2, GOLD, ramp("#ff7ae0", light=0.25), helmet="plain", chest="eye", stacks=False)
    # gold brow band with a glowing warp-gem, cowl edges
    s.add(GOLD, s.P((24, 20), (40, 19), (41, 22), (25, 23)), mode="vert", sep="line")
    s.add(ramp("#ff5ac8", light=0.3), s.E(33, 20, 1.5, 1.5), mode="glow", sep="line")
    s.px(32, 19, WHITE_PX)
    s.add(cape, s.P((20, 34), (22, 22), (24, 34)), mode="cyl")
    s.add(cape, s.P((44, 34), (42, 22), (40, 34)), mode="cyl")
    # staff head: a twisted ring with an eye-flame
    s.add(GOLD, sub(s.E(56, 9, 6, 6), s.E(56, 9, 3, 3)), mode="sphere")
    s.add(ramp("#ff5ac8", light=0.3), s.E(56, 9, 3, 3), mode="glow")
    s.px(56, 9, WHITE_PX); s.px(55, 8, hx("#ffd0f0"))
    for (x, y) in [(50, 2), (62, 4), (61, 16), (49, 14), (53, 0)]:
        s.px(x, y, hx("#7ad8ff"))
    s.add(pl2, s.E(56, 52, 4, 4), mode="sphere")
    s.add(GOLD, s.L([(56, 48), (56, 56)], 1), mode="flat", flat=3, sep=False)
    # pink warp-fire in the other hand
    s.add(ramp("#3fc0ff", light=0.3), s.P((20, 58), (26, 50), (24, 44), (30, 48), (30, 40), (34, 50), (32, 58)), mode="glow")
    s.pxs([(26, 54), (28, 52), (29, 50)], WHITE_PX)
    s.add(pl2, s.E(26, 60, 5, 4), mode="sphere")
    return s.render(flip)


@sprite("grey_knight", 64, "灰骑士", "Grey Knight", "chaos", face="L")
def grey_knight(flip=False):
    s = Sprite(64)
    plate = ramp("#8a929c", light=0.2)
    pl2 = ramp("#a2aab2", light=0.16)
    armour64(s, plate, pl2, ramp("#b8a050"), ramp("#58b8ff", light=0.3), helmet="std", chest="book")
    # parchment seals hanging off the pauldron
    s.add(PARCH, s.P((46, 46), (50, 46), (50, 58), (46, 60)), mode="sphere")
    s.add(CRIMSON, s.E(48, 46, 2, 2), mode="sphere")
    s.pxs([(47, 50), (48, 50), (47, 53), (48, 53), (47, 56)], PARCH[0])
    # halberd with blue psychic glow
    s.add(GUNMETAL, s.L([(30, 63), (56, 6)], 2), mode="cyl")
    blade = s.P((52, 2), (60, 0), (63, 10), (58, 18), (56, 12))
    s.add(ramp("#78c8ff", light=0.2), blade, mode="sphere", lt=0.5)
    s.pxs([(58, 3), (60, 6), (61, 9)], WHITE_PX)
    for (x, y) in [(50, 0), (63, 15), (52, 20), (47, 8)]:
        s.px(x, y, hx("#a8e0ff"))
    s.add(pl2, s.E(33, 57, 5, 4), mode="sphere")
    return s.render(flip)


# ---------------------------------------------------------------- daemons
KHORNE_SKIN = ramp("#b02a22", light=0.14)
HORN = ramp("#2a2226", light=0.18, dark=0.08, outline=0.12)


@sprite("daemon_khorne", 48, "恐虐血魔", "Bloodletter-type Daemon", "chaos", face="L")
def daemon_khorne(flip=False):
    s = Sprite(48)
    sk = KHORNE_SKIN
    # black blade raised behind
    s.add(HORN, s.P((36, 47), (39, 47), (46, 6), (44, 3), (42, 8)), mode="cyl")
    s.pxs([(44, 8), (43, 14), (42, 20), (41, 26)], hx("#ff5a2a"))
    # sinewy torso
    s.add(sk, s.P((8, 47), (10, 36), (16, 30), (32, 30), (38, 35), (40, 47)), mode="cyl", lt=0.25)
    s.add(sk, s.P((34, 32), (40, 34), (42, 42), (38, 44)), mode="cyl")
    s.add(sk, s.E(39, 43, 3, 3), mode="sphere")
    for y in (36, 39, 42):
        s.pxs([(18, y), (19, y), (20, y), (27, y), (28, y), (29, y)], sk[1])
    # brass collar
    s.add(BRASS, s.P((14, 30), (34, 30), (32, 34), (16, 34)), mode="cyl")
    for x in range(16, 33, 3):
        s.px(x, 31, BRASS[3])
    # long head with jutting jaw
    head = s.P((16, 16), (20, 9), (28, 8), (35, 12), (40, 19), (40, 23), (33, 27), (23, 28), (17, 23))
    s.add(sk, head, mode="sphere", lt=0.35, st=0.7)
    # horns sweeping back then forward
    s.add(HORN, s.P((18, 12), (12, 6), (11, 0), (15, 4), (22, 9)), mode="cyl")
    s.add(HORN, s.P((25, 9), (27, 2), (33, 0), (30, 4), (29, 9)), mode="cyl")
    # maw full of teeth
    s.add(ramp("#3a0a10"), s.P((26, 21), (40, 20), (40, 24), (30, 25)), mode="flat", flat=1, sep=False)
    for x in range(28, 40, 2):
        s.px(x, 21, BONE[3]); s.px(x + 1, 24, BONE[2])
    # burning eyes under a heavy brow
    s.pxs([(29, 15), (30, 15), (34, 15)], EYE_GLOW)
    s.pxs([(28, 14), (29, 14), (30, 14), (31, 14), (33, 14), (34, 14), (35, 14)], sk[0])
    return s.render(flip)


@sprite("daemon_nurgle", 48, "纳垢疫魔", "Plaguebearer-type Daemon", "chaos", face="L")
def daemon_nurgle(flip=False):
    s = Sprite(48)
    sk = ramp("#7f9a4a", light=0.14)
    # rusted blade
    s.add(RUST, s.P((38, 47), (41, 47), (45, 18), (42, 16)), mode="cyl", tex=(3, 0.2))
    body = union(s.E(23, 38, 17, 13), s.E(26, 22, 11, 11))
    s.add(sk, body, mode="sphere", lt=0.3, st=0.66, tex=(8, 0.05))
    # single horn
    s.add(BONE, s.P((24, 13), (28, 12), (25, 1), (22, 6)), mode="cyl")
    # cyclopean eye
    s.add(ramp("#d8d070"), s.E(29, 19, 4, 3), mode="sphere", sep="line")
    s.pxs([(30, 19), (31, 19), (30, 18)], hx("#2a1a0a"))
    s.px(28, 18, WHITE_PX)
    # drooping grin
    s.add(ramp("#3a2a12"), s.P((22, 26), (36, 24), (34, 29), (25, 30)), mode="flat", flat=1, sep=False)
    for x in (25, 28, 31, 34):
        s.px(x, 26, BONE[2])
    # sores and a dark split in the belly
    s.add(ramp("#4a3a1a"), s.P((18, 38), (28, 36), (26, 39), (19, 40)), mode="flat", flat=1, sep=False)
    for (x, y) in [(12, 34), (34, 40), (16, 44), (30, 46)]:
        s.add(ramp("#b0a050"), s.E(x, y, 1, 1), mode="flat", flat=3, sep="dark")
    # arm holding blade
    s.add(sk, s.E(39, 42, 3, 3), mode="sphere")
    # flies
    for (x, y) in [(6, 10), (9, 6), (40, 8), (44, 12), (12, 18), (4, 24), (46, 30), (36, 4)]:
        s.px(x, y, hx("#20200e")); s.px(x + 1, y - 1, hx("#7a7a6a"))
    return s.render(flip)


@sprite("daemon_tzeentch", 48, "奸奇惧妖", "Horror-type Daemon", "chaos", face="L")
def daemon_tzeentch(flip=False):
    s = Sprite(48)
    pink = ramp("#e05aa8", light=0.16)
    blue = ramp("#3a7ae0", light=0.22)
    # flame-shaped body with flickering tips
    body = s.P((8, 47), (10, 32), (6, 22), (14, 26), (13, 14), (20, 20), (22, 6), (28, 18), (34, 8),
               (36, 22), (42, 16), (40, 32), (42, 47))
    s.add(pink, body, mode="sphere", lt=0.32, st=0.66)
    s.add(blue, s.P((10, 47), (14, 36), (22, 40), (30, 34), (38, 40), (40, 47)), mode="vert", sep="dark")
    # wide grin and several eyes
    s.add(ramp("#3a0a3a"), s.P((18, 30), (38, 27), (34, 34), (22, 34)), mode="flat", flat=1, sep=False)
    for x in range(20, 36, 3):
        s.px(x, 30, WHITE_PX)
    for (x, y) in [(26, 22), (33, 21), (20, 24), (29, 15)]:
        s.add(ramp("#f8f0a0"), s.E(x, y, 1, 1), mode="flat", flat=3, sep="line")
        s.px(x + 1, y, hx("#1a0a2a"))
    # long arms with blue fire in the claw
    s.add(pink, s.L([(38, 34), (44, 38), (45, 28)], 3), mode="cyl")
    s.add(ramp("#40e0ff", light=0.25), s.P((41, 26), (44, 18), (46, 24), (47, 14), (47, 28)), mode="glow")
    s.pxs([(45, 22), (46, 25)], WHITE_PX)
    s.add(pink, s.L([(10, 34), (4, 40), (3, 46)], 3), mode="cyl")
    # sparks
    for (x, y) in [(4, 8), (40, 4), (44, 10), (2, 18), (16, 2)]:
        s.px(x, y, hx("#8ad8ff"))
    return s.render(flip)


@sprite("daemon_slaanesh", 48, "色孽魅魔", "Daemonette-type Daemon", "chaos", face="L")
def daemon_slaanesh(flip=False):
    s = Sprite(48)
    sk = ramp("#c4a8d8", light=0.10)
    hairc = ramp("#e8e4f0", light=0.05, dark=0.18)
    armour = ramp("#7a3a8a", light=0.18)
    # long pale hair flowing back
    s.add(hairc, s.P((20, 8), (12, 14), (4, 30), (6, 47), (16, 47), (18, 26)), mode="cyl", lt=0.3)
    # crab-claw arm raised
    s.add(armour, s.L([(36, 46), (40, 34), (41, 26)], 4), mode="cyl")
    claw = union(s.P((36, 26), (40, 14), (46, 10), (43, 18), (44, 26)), s.P((42, 26), (47, 20), (46, 28)))
    s.add(ramp("#e0a8f0", light=0.08), claw, mode="sphere")
    # slender body in a high lacquered carapace collar
    s.add(armour, s.P((12, 47), (14, 36), (18, 30), (30, 30), (34, 36), (36, 47)), mode="cyl")
    s.add(armour, s.P((16, 34), (20, 24), (24, 32), (28, 24), (32, 34), (24, 40)), mode="sphere", sep="dark")
    s.add(ramp("#e070c0"), s.E(24, 36, 2, 2), mode="sphere")
    neck(s, sk, 22, 22, 26, 28)
    # narrow, elegant head; black eyes, single curled horn
    human_head(s, sk, mouth="grin", sclera=False, eyes=hx("#1a0a20"), brow=sk[1])
    s.add(hairc, s.P((18, 14), (22, 7), (31, 7), (33, 12), (26, 11), (20, 18)), mode="sphere", sep=False)
    s.add(ramp("#3a2a3a", light=0.2), s.P((25, 9), (26, 3), (31, 0), (35, 2), (32, 3), (28, 6), (28, 9)), mode="cyl")
    return s.render(flip)


@sprite("daemon_prince", 96, "恶魔王子", "Daemon Prince", "chaos", face="L")
def daemon_prince(flip=False):
    s = Sprite(96)
    sk = ramp("#7a4a6a", light=0.16)
    wing = ramp("#5a1e2e", light=0.18, dark=0.12)
    strut = ramp("#2a1a22", light=0.2, dark=0.08, outline=0.1)
    armour = ramp("#3a3238", light=0.2, dark=0.1, outline=0.16)
    # bat wings: struts radiating from the shoulders, scalloped membrane between them
    for side in (-1, 1):
        ox = 48 + side * 12
        tips = [(48 + side * 44, 2), (48 + side * 47, 24), (48 + side * 46, 46), (48 + side * 36, 66)]
        pts = [(ox, 48)]
        prev = (ox, 30)
        for t in tips:
            mx, my = (prev[0] + t[0]) / 2 + side * 2, (prev[1] + t[1]) / 2 + 7
            pts += [prev, (mx, my)]
            prev = t
        pts += [tips[-1], (ox, 62)]
        s.add(wing, s.P(*pts), mode="sphere", lt=0.18, st=0.72)
        for t in tips:
            s.add(strut, s.L([(ox, 34), t], 2), mode="cyl", sep=False)
        s.add(strut, s.L([(ox, 46), (48 + side * 22, 14), (48 + side * 44, 2)], 3), mode="cyl", sep=False)
        s.add(BONE, s.P((48 + side * 44, 2), (48 + side * 48, 0), (48 + side * 46, 6)), mode="cyl")
    # massive torso
    s.add(sk, s.P((16, 95), (20, 66), (32, 54), (64, 54), (76, 66), (80, 95)), mode="cyl", lt=0.22)
    for y in (72, 78, 84):
        s.pxs([(x, y) for x in range(38, 46)] + [(x, y) for x in range(51, 59)], sk[1])
    s.add(sk, s.R(47, 66, 49, 92), mode="flat", flat=1, sep=False)
    s.add(armour, s.P((30, 86), (66, 86), (68, 95), (28, 95)), mode="vert")
    s.add(BRASS, s.R(28, 85, 68, 87), mode="vert", sep="dark")
    # pauldrons with brass rims and spikes
    for cx in (22, 74):
        for (dx, h) in ((-8, 12), (0, 16), (8, 12)):
            s.add(BRASS, s.P((cx + dx - 3, 58), (cx + dx + 3, 58), (cx + dx, 58 - h)), mode="cyl")
        s.add(armour, s.E(cx, 66, 15, 11), mode="sphere", lt=0.36)
        s.add(BRASS, sub(s.E(cx, 66, 15, 11), s.E(cx, 64, 14, 10)), mode="sphere", sep=False)
        s.add(ramp("#e04a2a", light=0.3), s.E(cx, 65, 2, 2), mode="glow", sep="line")
    s.add(armour, s.P((34, 50), (62, 50), (60, 60), (36, 60)), mode="cyl")
    # great curling horns (behind the head)
    s.add(HORN, s.P((38, 30), (28, 26), (18, 16), (16, 4), (22, 0), (22, 10), (30, 18), (42, 22)), mode="cyl")
    s.add(HORN, s.P((54, 22), (62, 12), (72, 6), (80, 0), (80, 8), (70, 16), (62, 28)), mode="cyl")
    # head: heavy brow, burning eyes, fanged jaw facing right
    head = s.P((34, 34), (40, 22), (54, 18), (64, 24), (68, 36), (64, 48), (52, 54), (40, 50))
    s.add(sk, head, mode="sphere", lt=0.36, st=0.7, sep="line")
    s.add(sk, s.P((44, 29), (68, 27), (68, 32), (46, 33)), mode="flat", flat=1, sep=False)
    for ex in (52, 61):
        s.add(ramp("#ffc040", light=0.25), s.R(ex, 32, ex + 3, 33), mode="glow", sep="line")
    s.add(ramp("#2a0a14"), s.P((48, 42), (68, 39), (64, 48), (50, 47)), mode="flat", flat=1, sep=False)
    for x in range(50, 66, 2):
        s.px(x, 42, BONE[3]); s.px(x + 1, 46, BONE[2])
    s.add(BONE, s.P((50, 42), (52, 42), (51, 38)), mode="cyl", sep=False)
    # clawed hand raised with warp-fire
    s.add(sk, s.L([(76, 74), (84, 64), (86, 54)], 6), mode="cyl")
    fire = s.P((78, 50), (82, 36), (86, 44), (88, 28), (92, 42), (94, 52), (88, 58), (80, 56))
    s.add(ramp("#c040ff", light=0.3), fire, mode="glow")
    s.add(ramp("#ff9aff", light=0.1), s.P((84, 52), (87, 40), (90, 50), (88, 55)), mode="glow", sep=False)
    for (x, y) in [(82, 52), (84, 54), (86, 55), (88, 54), (90, 52)]:
        s.px(x, y, sk[0])
    return s.render(flip)
