"""Aeldari route cast (v0.2, SPEC §14). Allies face right; Drukhari raider and the
greater daemon face left. Original designs: smooth elongated helms, wraithbone,
jade, deep blue, ruby spirit-stones. No canon heraldry or named characters."""
from reg import sprite
from pxlib import Sprite, hx, union, sub, inter, ramp
from parts import *

WBONE = ramp("#e4d8b6", light=0.07, dark=0.18)          # wraithbone ivory
JADE = ramp("#2f9a86", light=0.20)
DEEPB = ramp("#2c3f7c", light=0.18)
MESH = ramp("#273050", light=0.14, dark=0.12)            # dark undersuit
RUBY = ramp("#e23a4e", light=0.25)                       # spirit stone
RUNE = ramp("#8ff0f0", light=0.10)                       # psychic rune glow
GEMLIT = hx("#ffd0d8")
ELDSKIN = ramp("#e0c4a8", light=0.10)

# hand-pixelled Aeldari head, facing right: long narrow face, high brow, almond eyes,
# pointed chin. d/m/l skin tones, b brow, e eye, p pupil, r mouth.
ELDHEADT = [
    "....mmmmm....",
    "..mmlllllmm..",
    ".mllllllllllm",
    ".mllllllllllm",
    "mmllllllllllm",
    "mdmllbbbllbbm",
    "mddlleppllepm",
    "mdmlllllllllm",
    "mmdllllldlllm",
    ".mdlllllldllm",
    ".mmdllllllrm.",
    "..mmdlllllm..",
    "..ddmllllm...",
    "...ddmllm....",
    "....ddmm.....",
    ".....dd......",
]


def eld_head(s, skin, x0=19, y0=8, mouth="line", eyes_closed=False, eye=None):
    # pointed ear sweeping back (behind the head)
    s.add(skin, s.P((x0 + 3, y0 + 6), (x0 - 3, y0 + 1), (x0 + 1, y0 + 9), (x0 + 3, y0 + 10)), mode="cyl", sep="dark")
    m = s.G(x0, y0, ELDHEADT, on="dmlbepr")
    s.add(skin, m, mode="flat", flat=2)
    rows = [list(r) for r in ELDHEADT]
    if mouth == "open":
        rows[10][10] = "r"; rows[11][9] = "r"; rows[10][9] = "r"
    if eyes_closed:
        rows[6][5] = "r"; rows[6][6] = "r"; rows[6][7] = "l"; rows[6][10] = "r"; rows[6][11] = "r"
    legend = {"d": skin[1], "m": skin[2], "l": skin[3], "b": skin[0], "r": skin[0],
              "e": WHITE_PX, "p": eye or hx("#1e3a4a")}
    s.stamp(x0, y0, ["".join(r) for r in rows], legend)
    return m


# hand-pixelled smooth Aeldari helm (15x20, facing right): tall egg dome, two slanted
# almond lenses, face sweeping down to a narrow pointed chin. d/m/l armour tones,
# k lens rim, L lens, g lens glint.
ELDHELMT = [
    ".....mmmmm.....",
    "...mmlllllmm...",
    "..mllllllllm...",
    ".mllllllllllm..",
    ".mlllllllllllm.",
    "mmlllllllllllm.",
    "mmllllllllllllm",
    "mmlllkkkkllllkm",
    "mmlkLLLLLklkkLm",
    "mmmkLgLLLLkLgLm",
    "dmmmkkLLLklkLLm",
    "dmmmmllkkllllkm",
    "ddmmmllllllllm.",
    ".ddmmmllllldlm.",
    ".dddmmmllldllm.",
    "..dddmmmlldlm..",
    "...ddmmmkllm...",
    "....ddmmkmm....",
    ".....ddmmm.....",
    "......ddd......",
]


def eld_helm(s, armour, crest, lens, x0=18, y0=5, plume=None, crest_h=6, crest_back=0):
    """smooth elongated helm with a crest ridge; optional plume flowing back."""
    cx = x0 + 7
    if plume is not None:
        s.add(plume, s.L([(cx - 1, y0 + 1), (cx - 7, y0 + 1), (cx - 12, y0 + 6), (cx - 15, y0 + 15),
                          (cx - 16, y0 + 26)], 3), mode="cyl", tex=(11, 0.08))
        s.add(plume, s.L([(cx - 9, y0 + 4), (cx - 13, y0 + 13), (cx - 13, y0 + 22)], 2), mode="cyl", sep="dark")
    if crest is not None:
        s.add(crest, s.P((cx - 5, y0 + 4), (cx - 3, y0 - crest_h // 2), (cx - 3 - crest_back, y0 - crest_h),
                         (cx - 1 - crest_back, y0 - crest_h), (cx + 1, y0 - crest_h // 2 + 1), (cx + 2, y0 + 2)),
              mode="cyl", sep="dark")
    m = s.G(x0, y0, ELDHELMT, on="dmlkLg")
    s.add(armour, m, mode="flat", flat=2, sep="line")
    s.stamp(x0, y0, ELDHELMT, {"d": armour[1], "m": armour[2], "l": armour[3],
                              "k": lens[0], "L": lens[2], "g": GEMLIT})
    return m


def spirit_stone(s, x, y, r=2, gem=RUBY, setting=None):
    if setting is not None:
        s.add(setting, s.E(x, y, r + 1, r + 1), mode="sphere", sep="dark")
    s.add(gem, s.E(x, y, r, r), mode="sphere", lt=0.4, sep="line")
    s.px(x - (1 if r > 1 else 0), y - (1 if r > 1 else 0), GEMLIT)


def eld_body(s, plate, suit, half=13, flare=1):
    arm(s, suit, "L", width=6, half=half)
    torso(s, suit, half=half, flare=flare)
    arm(s, suit, "R", width=6, half=half)


@sprite("aeldari_guardian", 48, "灵族守护者", "Aeldari Guardian", "aeldari")
def aeldari_guardian(flip=False):
    s = Sprite(48)
    eld_body(s, JADE, MESH)
    # smooth chest plate + rounded pauldrons
    s.add(JADE, s.P((15, 47), (14, 35), (19, 31), (29, 31), (34, 35), (33, 47)), mode="cyl", lt=0.28)
    s.add(JADE, s.P((5, 37), (8, 31), (14, 29), (18, 33), (15, 41), (8, 42)), mode="sphere")
    s.add(JADE, s.P((43, 37), (40, 31), (34, 29), (30, 33), (33, 41), (40, 42)), mode="sphere")
    s.add(WBONE, s.P((6, 36), (9, 32), (14, 31)), mode="flat", flat=3, sep=False)
    s.add(WBONE, s.P((19, 37), (24, 34), (29, 37), (24, 43)), mode="sphere", sep="dark")
    spirit_stone(s, 24, 38, 2)
    s.add(MESH, s.R(21, 24, 28, 31), mode="cyl")
    eld_helm(s, JADE, WBONE, RUBY, plume=WBONE)
    # sleek carbine held across the body: dark body, ivory shell, disc magazine on top
    s.add(MESH, s.P((11, 46), (16, 41), (36, 33), (41, 33), (40, 36), (18, 45)), mode="cyl")
    s.add(WBONE, s.P((16, 41), (34, 33), (38, 33), (36, 35), (18, 43)), mode="cyl", sep="dark")
    s.add(JADE, s.E(27, 35, 4, 2), mode="sphere", sep="dark")
    s.px(27, 34, JADE[3])
    s.add(MESH, s.L([(40, 34), (46, 31)], 1), mode="flat", flat=2)
    s.px(46, 31, RUBY[3])
    s.add(MESH, s.E(18, 44, 2, 2), mode="sphere")           # gloved grip hand
    return s.render(flip)


@sprite("aeldari_seer", 48, "灵族先知", "Aeldari Seer", "aeldari")
def aeldari_seer(flip=False):
    s = Sprite(48)
    robe = DEEPB
    # witch-staff behind, leaf blade of wraithbone
    s.add(WBONE, s.L([(42, 47), (42, 8)], 2), mode="cyl")
    s.add(WBONE, s.P((40, 8), (42, 0), (45, 7), (43, 12)), mode="sphere")
    s.add(RUBY, s.E(42, 14, 1, 1), mode="glow")
    # cloak falling from the shoulders
    s.add(robe, s.P((8, 47), (11, 30), (20, 24), (30, 24), (37, 30), (40, 47)), mode="cyl", lt=0.24)
    arm(s, robe, "L", width=8)
    torso(s, ramp("#20305e", light=0.18), half=14, flare=2)
    arm(s, robe, "R", width=8)
    # ivory high collar with stones, jade sash
    s.add(WBONE, s.P((12, 34), (16, 27), (22, 31), (26, 31), (32, 27), (36, 34), (30, 37), (18, 37)), mode="sphere")
    s.add(JADE, s.P((21, 37), (27, 37), (26, 47), (22, 47)), mode="cyl", sep="dark")
    spirit_stone(s, 24, 34, 2)
    for x in (16, 32):
        s.px(x, 33, RUNE[3])
    eld_helm(s, WBONE, JADE, ramp("#3ac0e0", light=0.25), crest_h=5, crest_back=9)
    # floating rune-stones orbiting the left side
    for (x, y, k) in [(7, 11, 0), (4, 21, 1), (9, 27, 2), (13, 4, 3), (36, 5, 4)]:
        s.add(WBONE, s.P((x - 1, y - 2), (x + 1, y - 2), (x + 2, y), (x + 1, y + 2), (x - 1, y + 2), (x - 2, y)),
              mode="sphere", sep=False)
        s.px(x, y - 1 + (k % 2), RUNE[2])
        s.px(x - (k % 2), y, RUNE[3])
    for (x, y) in [(10, 15), (6, 25), (11, 8)]:
        s.px(x, y, RUNE[1])
    s.add(ELDSKIN, s.E(41, 38, 2, 2), mode="sphere")      # hand on the staff
    return s.render(flip)


@sprite("aeldari_ranger", 48, "灵族游侠", "Aeldari Ranger", "aeldari")
def aeldari_ranger(flip=False):
    s = Sprite(48)
    cloak = ramp("#5e6a48", light=0.18)
    cloak2 = ramp("#4a5640", light=0.16)
    # long rifle slung diagonally behind (barrel past the shoulder)
    s.add(WBONE, s.L([(4, 47), (40, 6)], 2), mode="cyl")
    s.add(MESH, s.L([(32, 14), (45, 1)], 1), mode="flat", flat=2)
    # chameleon cloak: mottled
    arm(s, cloak, "L", width=8, tex=(2, 0.12))
    torso(s, cloak, half=16, flare=3, tex=(4, 0.12))
    arm(s, cloak, "R", width=8, tex=(5, 0.12))
    for (x, y, r) in [(13, 42, 3), (30, 44, 3), (36, 37, 2), (20, 38, 2)]:
        s.add(cloak2, s.E(x, y, r, r - 1), mode="sphere", sep=False, tex=(x, 0.1))
    s.add(ramp("#6a5a3a"), s.E(25, 45, 2, 1), mode="sphere", sep=False)
    # hood thrown wide, a long narrow face inside
    hood = union(s.E(24, 15, 10, 11), s.P((14, 18), (34, 18), (39, 33), (9, 33)))
    s.add(cloak, hood, mode="sphere", lt=0.3, tex=(3, 0.12))
    s.add(ramp("#1e2418", light=0.1, dark=0.05, outline=0.05), s.P((19, 7), (30, 6), (34, 12), (34, 26), (20, 26)),
          mode="flat", flat=2, sep=False)
    neck(s, ELDSKIN, 22, 22, 27, 30)
    eld_head(s, ELDSKIN, x0=20, y0=8, eye=hx("#2a5a3a"))
    # scarf wrapped up to the nose; scope monocle over the near eye
    s.add(cloak2, s.P((21, 20), (32, 19), (31, 24), (29, 31), (20, 31)), mode="sphere", sep="dark", tex=(9, 0.1))
    s.add(MESH, s.E(30, 14, 2, 2), mode="sphere", sep="line")
    s.px(30, 14, RUBY[3]); s.px(29, 13, GEMLIT)
    s.add(MESH, s.L([(28, 13), (22, 12)], 1), mode="flat", flat=2, sep=False)
    s.add(WBONE, s.E(24, 33, 2, 2), mode="sphere")              # cloak pin
    s.px(24, 33, JADE[2])
    # hand on the rifle sling
    s.add(ELDSKIN, s.E(11, 40, 2, 2), mode="sphere")
    return s.render(flip)


@sprite("aeldari_bonesinger", 48, "灵族骨歌者", "Aeldari Bonesinger", "aeldari")
def aeldari_bonesinger(flip=False):
    s = Sprite(48)
    robe = ramp("#2a6a7a", light=0.18)
    hairc = ramp("#2a2a48", light=0.18)
    # long hair down the back
    s.add(hairc, s.P((20, 8), (14, 14), (12, 30), (15, 40), (20, 30), (21, 16)), mode="cyl")
    arm(s, robe, "L", width=8)
    torso(s, robe, half=15, flare=2)
    s.add(DEEPB, s.P((16, 47), (17, 38), (24, 43), (31, 38), (32, 47)), mode="vert", sep="dark")
    s.add(WBONE, s.P((12, 34), (18, 29), (30, 29), (36, 34), (24, 40)), mode="sphere", sep="dark")
    spirit_stone(s, 24, 34, 2)
    # raised hand shaping a curved wraithbone form
    s.add(robe, s.L([(36, 46), (40, 38), (40, 31)], 5), mode="cyl")
    s.add(ELDSKIN, s.E(40, 29, 2, 2), mode="sphere")
    shape = s.P((37, 25), (39, 15), (43, 9), (47, 6), (45, 13), (43, 21), (42, 25))
    s.add(WBONE, shape, mode="sphere", lt=0.4)
    s.add(WBONE, s.P((44, 17), (47, 15), (46, 20)), mode="sphere", sep=False)
    s.px(42, 14, RUNE[3])
    # song: glowing motes flowing from the mouth to the bone
    for (x, y) in [(33, 19), (34, 18), (35, 18), (36, 17), (35, 21), (37, 20), (38, 16), (39, 12), (41, 7), (45, 3), (36, 9)]:
        s.px(x, y, RUNE[2])
    s.pxs([(37, 18), (40, 10)], RUNE[3])
    neck(s, ELDSKIN, 22, 22, 27, 30)
    eld_head(s, ELDSKIN, mouth="open", eyes_closed=True)
    # circlet with a stone
    s.add(hairc, s.P((19, 9), (22, 6), (29, 6), (32, 9), (25, 8), (21, 13)), mode="sphere", sep=False)
    s.add(JADE, s.L([(19, 11), (25, 9), (31, 10)], 1), mode="flat", flat=3, sep=False)
    s.px(27, 9, RUBY[3])
    return s.render(flip)


@sprite("aeldari_masked", 48, "假面戏者", "Masked Troupe Performer", "aeldari")
def aeldari_masked(flip=False):
    s = Sprite(48)
    cowl = ramp("#5a1e3e", light=0.18)
    gold = ramp("#d8aa48", light=0.18)
    mirror = ramp("#b8c8d8", light=0.12, dark=0.22)
    # ribbons streaming behind (crimson / gold / teal)
    s.add(ramp("#b02a3a"), s.L([(16, 18), (8, 22), (4, 30), (8, 38), (3, 46)], 2), mode="cyl", sep=False)
    s.add(gold, s.L([(16, 22), (10, 28), (12, 36), (7, 44)], 1), mode="flat", flat=2, sep=False)
    s.add(JADE, s.L([(18, 14), (10, 12), (4, 16), (2, 24)], 1), mode="flat", flat=2, sep=False)
    # slim body in a fitted suit with a flared collar
    arm(s, MESH, "L", width=6, half=12)
    torso(s, ramp("#2a2238", light=0.16), half=12, flare=2)
    arm(s, MESH, "R", width=6, half=12)
    s.add(gold, s.L([(16, 36), (24, 42), (32, 36)], 1), mode="flat", flat=2, sep=False)
    s.add(cowl, s.P((10, 34), (15, 26), (24, 30), (33, 26), (38, 34), (30, 32), (24, 36), (18, 32)), mode="sphere", sep="dark")
    # raised hand with ribbon fan
    s.add(MESH, s.L([(35, 46), (40, 38), (41, 31)], 4), mode="cyl")
    s.add(ramp("#b02a3a"), s.P((41, 30), (46, 18), (47, 26)), mode="sphere", sep=False)
    s.add(gold, s.P((41, 30), (43, 16), (45, 18)), mode="sphere", sep=False)
    s.add(JADE, s.P((41, 30), (38, 18), (41, 17)), mode="sphere", sep=False)
    # tall cowl and the mirror mask (smooth, featureless oval with a reflection streak)
    s.add(cowl, union(s.E(24, 14, 10, 11), s.P((14, 16), (35, 16), (33, 28), (15, 28)),
                      s.P((20, 6), (16, 0), (25, 4))), mode="sphere", lt=0.3)
    mask = s.E(27, 15, 6, 8)
    s.add(mirror, mask, mode="sphere", lt=0.45, st=0.75, sep="line")
    s.pxs([(24, 10), (25, 11), (26, 12), (27, 14), (28, 15), (29, 17)], hx("#ffffff"))
    s.pxs([(30, 13), (31, 13)], mirror[0])     # thin eye slits
    s.pxs([(25, 13), (26, 13)], mirror[0])
    s.add(gold, s.E(24, 3, 1, 1), mode="sphere", sep=False)
    return s.render(flip)


@sprite("drukhari_raider", 48, "黑暗灵族掠袭者", "Drukhari Raider", "aeldari", face="L")
def drukhari_raider(flip=False):
    s = Sprite(48)
    arm_c = ramp("#45285a", light=0.20, dark=0.12, outline=0.22)
    blk = ramp("#211b2a", light=0.16, dark=0.08, outline=0.12)
    blade = ramp("#b8bcc8", light=0.15)
    eye = ramp("#e04aa0", light=0.25)
    venom = hx("#8aff5a")
    # back spines
    for (x, y, tx, ty) in [(11, 34, 2, 20), (15, 31, 8, 14), (33, 31, 38, 16)]:
        s.add(blk, s.P((x - 2, y), (x + 2, y), (tx, ty)), mode="cyl")
    arm(s, blk, "L", width=7)
    torso(s, arm_c, half=14)
    arm(s, blk, "R", width=7)
    # segmented barbed plates
    s.add(blk, s.P((15, 47), (14, 34), (19, 31), (29, 31), (34, 34), (33, 47)), mode="cyl", lt=0.25)
    for y in (35, 39, 43):
        s.add(arm_c, s.P((16, y), (24, y + 2), (32, y), (32, y + 2), (24, y + 4), (16, y + 2)), mode="sphere", sep="dark")
    for (x, y, d) in [(9, 31, -1), (39, 31, 1)]:
        s.add(arm_c, s.P((x - 5, y + 7), (x, y), (x + 5, y + 7)), mode="sphere")
        s.add(blade, s.P((x - 1, y + 1), (x + d * 5, y - 7), (x + 1, y + 1)), mode="cyl")
    s.add(blk, s.R(21, 24, 28, 31), mode="cyl")
    # swept blade-crest and spikes behind the helm
    s.add(blade, s.P((22, 7), (14, 1), (4, 0), (12, 4), (20, 10)), mode="cyl")
    s.add(blk, s.P((20, 9), (10, 8), (3, 12), (12, 11), (20, 13)), mode="cyl", sep="dark")
    eld_helm(s, arm_c, None, eye, x0=18, y0=5)
    # dark slit band across the lenses + cruel chin spike
    s.add(blk, s.P((32, 17), (36, 22), (31, 22)), mode="cyl", sep=False)
    s.pxs([(22, 13), (23, 13)], blk[1])
    # hooked blade held forward
    s.add(blk, s.E(38, 41, 2, 2), mode="sphere")
    s.add(blade, s.P((38, 40), (44, 28), (47, 16), (45, 26), (41, 38)), mode="cyl")
    s.add(blade, s.P((44, 28), (40, 25), (43, 30)), mode="cyl", sep=False)
    s.pxs([(46, 19), (45, 24), (43, 31)], venom)
    # hooked chain over the shoulder
    s.pxs([(16, 33), (18, 35), (20, 37), (22, 39)], blade[3])
    return s.render(flip)


@sprite("wraith_construct", 64, "灵骸构装体", "Wraith Construct", "aeldari")
def wraith_construct(flip=False):
    s = Sprite(64)
    bone = ramp("#e8dcb8", light=0.06, dark=0.20)
    joint = ramp("#33405e", light=0.16)
    soul = ramp("#ff5a6a", light=0.25)
    # long swept crest behind the head
    s.add(bone, s.P((32, 6), (24, 2), (12, 4), (2, 12), (14, 8), (26, 8), (32, 12)), mode="cyl")
    s.add(JADE, s.P((31, 9), (20, 10), (8, 18), (20, 14), (31, 14)), mode="cyl", sep="dark")
    # slender torso
    s.add(joint, s.P((22, 63), (24, 40), (40, 40), (42, 63)), mode="cyl")
    chest = s.P((18, 36), (24, 28), (40, 28), (46, 36), (44, 50), (38, 58), (26, 58), (20, 50))
    s.add(bone, chest, mode="sphere", lt=0.32, st=0.66)
    s.add(bone, s.P((24, 38), (32, 34), (40, 38), (38, 50), (32, 54), (26, 50)), mode="sphere", sep="dark")
    s.add(JADE, s.L([(32, 36), (32, 52)], 1), mode="flat", flat=2, sep=False)
    s.add(JADE, s.R(28, 58, 36, 63), mode="vert", sep="dark")
    # far shoulder + arm
    s.add(bone, s.E(14, 36, 9, 7), mode="sphere", lt=0.36)
    s.add(joint, s.L([(10, 42), (8, 56), (10, 63)], 4), mode="cyl")
    s.add(bone, s.L([(10, 44), (8, 54)], 5), mode="cyl", sep="dark")
    # long neck + tall faceless head, pointed chin
    s.add(joint, s.R(29, 20, 35, 30), mode="cyl")
    head = union(s.E(33, 13, 7, 11), s.P((26, 14), (41, 14), (40, 22), (35, 30), (28, 22)))
    s.add(bone, head, mode="sphere", lt=0.42, st=0.72, sep="line")
    s.add(bone, s.P((35, 15), (41, 14), (40, 22), (35, 29)), mode="sphere", sep="dark")
    s.pxs([(30, 19), (31, 21), (32, 23)], bone[1])
    # the single glowing soul-gem on the brow
    s.add(soul, s.E(36, 11, 2, 2), mode="glow", sep="line")
    s.pxs([(35, 10), (36, 10)], hx("#ffe0e0"))
    # near shoulder dome + forearm with a wraith-cannon
    s.add(bone, s.E(50, 36, 10, 8), mode="sphere", lt=0.36, sep="line")
    s.add(JADE, s.L([(42, 37), (58, 37)], 1), mode="flat", flat=2, sep=False)
    s.add(joint, s.L([(52, 42), (54, 50)], 4), mode="cyl")
    s.add(bone, s.P((44, 50), (58, 47), (63, 52), (46, 58)), mode="sphere", sep="line")
    s.add(joint, s.E(62, 50, 1, 2), mode="flat", flat=1)
    s.add(ramp("#8ff0f0", light=0.1), s.E(54, 52, 2, 1), mode="glow", sep=False)
    return s.render(flip)


@sprite("greater_daemon_slaanesh", 96, "色孽大魔", "Greater Daemon of Slaanesh", "aeldari", face="L")
def greater_daemon_slaanesh(flip=False):
    s = Sprite(96)
    sk = ramp("#b898d4", light=0.12, dark=0.20)
    hairc = ramp("#eeeaf6", light=0.03, dark=0.16)
    lac = ramp("#6a2a7a", light=0.20)          # lacquered armour
    gold = ramp("#d8aa48", light=0.18)
    horn = ramp("#3a2a44", light=0.22)
    claw = sk
    haze = ramp("#ff7ad8", light=0.2)
    eye = ramp("#1a0a24", light=0.1, dark=0.05, outline=0.05)
    # long sweeping ridged horns (behind the head)
    s.add(horn, s.P((40, 26), (32, 18), (24, 8), (20, 0), (26, 2), (32, 10), (46, 20)), mode="cyl", lt=0.35)
    s.add(horn, s.P((58, 18), (64, 8), (72, 2), (80, 0), (76, 6), (68, 12), (62, 24)), mode="cyl", lt=0.35)
    for (x, y) in [(28, 10), (31, 14), (66, 10), (70, 6)]:
        s.px(x, y, horn[1])
    # flowing hair down the back, both sides
    s.add(hairc, s.P((42, 18), (30, 28), (20, 58), (18, 95), (34, 95), (34, 56), (44, 34)), mode="cyl", lt=0.3)
    s.add(hairc, s.P((60, 22), (66, 34), (70, 52), (64, 56), (58, 40)), mode="cyl", lt=0.3)
    # robed lower body / long tabard
    s.add(lac, s.P((16, 95), (24, 64), (36, 56), (64, 56), (76, 64), (82, 95)), mode="cyl", lt=0.24)
    s.add(sk, s.P((38, 95), (42, 72), (56, 72), (60, 95)), mode="vert", sep="dark")
    s.add(gold, s.L([(42, 72), (56, 72)], 1), mode="flat", flat=2, sep=False)
    for y in (80, 88):
        s.add(gold, s.L([(41, y), (57, y)], 1), mode="flat", flat=1, sep=False)
    # pauldrons and a tall lacquered gorget
    for cx in (28, 70):
        s.add(lac, s.E(cx, 63, 11, 8), mode="sphere", lt=0.36)
        s.add(gold, sub(s.E(cx, 63, 11, 8), s.E(cx, 61, 10, 7)), mode="sphere", sep=False)
        s.add(haze, s.E(cx, 62, 1, 1), mode="glow", sep="line")
    s.add(lac, s.P((38, 60), (42, 42), (50, 50), (58, 42), (62, 60), (50, 66)), mode="sphere", sep="dark")
    s.add(gold, s.E(50, 59, 2, 2), mode="sphere", sep="dark")
    # far arm: slender, holding a long curved blade
    s.add(sk, s.L([(20, 68), (14, 78), (12, 86)], 5), mode="cyl")
    s.add(ramp("#c8d0e0", light=0.12), s.P((10, 88), (4, 58), (4, 30), (8, 50), (14, 84)), mode="cyl")
    s.add(gold, s.R(8, 86, 16, 88), mode="vert")
    # slender neck and serene elongated face (flat planes, lit front)
    s.add(sk, s.R(46, 36, 54, 48), mode="cyl")
    head = union(s.E(51, 26, 9, 12), s.P((42, 26), (62, 25), (60, 35), (54, 42), (47, 38)))
    s.add(sk, head, mode="flat", flat=2, sep="line")
    s.add(sk, s.P((49, 18), (58, 18), (62, 24), (61, 33), (55, 41), (50, 37), (48, 28)), mode="flat", flat=3, sep=False)
    s.add(sk, s.P((42, 30), (46, 36), (50, 39), (47, 39), (43, 35)), mode="flat", flat=1, sep=False)
    stamp = [
        ".kkk....kk.",
        "k.......k..",
        "...........",
        "kkkkk...kkk",
        "kpppk...kpk",
        ".kkk.....k.",
        "........d..",
        ".........d.",
        "........dd.",
        "..........r",
        "....rrrrrr.",
        "...........",
    ]
    s.stamp(50, 22, stamp, {"k": eye[2], "p": haze[3], "d": sk[1], "r": lac[1]})
    # swept crown of hair framing the brow + gold circlet
    s.add(hairc, s.P((40, 24), (44, 13), (54, 10), (64, 14), (62, 18), (52, 16), (45, 20), (43, 30)), mode="sphere", sep="dark")
    s.add(gold, s.L([(44, 18), (52, 15), (62, 17)], 1), mode="flat", flat=3, sep=False)
    s.add(haze, s.E(53, 15, 1, 1), mode="glow", sep=False)
    # near arm raised, ending in a great open pincer-claw
    s.add(sk, s.L([(74, 72), (82, 60), (84, 50)], 7), mode="cyl")
    s.add(lac, s.L([(78, 66), (83, 56)], 7), mode="cyl", sep="dark")
    s.add(gold, s.R(79, 50, 89, 52), mode="vert", sep="dark")
    upper = s.P((78, 50), (78, 36), (82, 22), (90, 12), (94, 14), (88, 26), (86, 40), (88, 50))
    lower = s.P((86, 50), (92, 42), (95, 30), (95, 44), (92, 52))
    s.add(claw, upper, mode="sphere", lt=0.38, sep="line")
    s.add(claw, lower, mode="sphere", lt=0.38, sep="line")
    s.pxs([(84, 30), (85, 34), (93, 38)], claw[1])
    # enthralling haze motes
    for (x, y) in [(70, 30), (74, 22), (66, 42), (88, 64), (8, 22), (16, 44), (84, 6), (36, 8)]:
        s.px(x, y, haze[3])
    return s.render(flip)
