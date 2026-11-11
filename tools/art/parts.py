"""Shared palettes and body parts for 48px half-body portraits (author facing RIGHT).

Frame of reference for the standard 48x48 bust:
  head  ~ x 18..31, y 10..24      neck y 23..29      shoulders y ~29..33
  torso down to the bottom edge (waist cut)
Bigger sprites scale these numbers by k (see `scale`).
"""
from pxlib import ramp, ramp_explicit, hx, union, sub, inter

# --------------------------------------------------------------- palettes
SKIN = {
    "fair": ramp("#d6a382"),
    "tan": ramp("#b9825d"),
    "dark": ramp("#7f5139"),
    "pale": ramp("#c8b3a0", light=0.12),
    "grey": ramp("#9a958e"),
    "sick": ramp("#a8a27a"),
}
# Imperium
KHAKI = ramp("#86804f")
OLIVE = ramp("#5f6a3e")
FLAK = ramp("#6d6b4d")
BRASS = ramp("#b38a3a", light=0.20)
GOLD = ramp("#d8aa48", light=0.18)
GREYG = ramp("#6c6f78")        # gothic grey
DKGREY = ramp("#45464e")
BLACKCOAT = ramp("#2f2b33", light=0.12, dark=0.10, outline=0.16)
CRIMSON = ramp("#9a2a2a")
RED = ramp("#b8332b")
WHITE = ramp("#d8d4c6", light=0.10)
PARCH = ramp("#cbb98a")
LEATHER = ramp("#6e4a2e")
STEEL = ramp("#8f959c", light=0.18)
GUNMETAL = ramp("#4f545b")
MARSRED = ramp("#8e2a22")
BLUE = ramp("#3c5a8e")
NAVY = ramp("#2f3a5a")
# Chaos
BLOOD = ramp("#8f1e22")
BRUISE = ramp("#5a3a6a")
SICKGREEN = ramp("#7a8a3a")
BONE = ramp("#cfc29a")
RUST = ramp("#8a4a2a")
DIRT = ramp("#5c4a3a")
BLACKARM = ramp("#34323a", light=0.14, dark=0.10, outline=0.18)
# T'au
OCHRE = ramp("#c69a52")
SAND = ramp("#d2bd8c")
SLATE = ramp("#5f6f80")
TAUSKIN = ramp("#7d8fa3")
TEAL = ramp("#3fa6a0", light=0.2)
CLEAN = ramp("#e4e2da", light=0.08)
# Xenos
ORKSKIN = ramp("#5f8a34")
ORKDARK = ramp("#4a6a2a")
HAZARD = ramp("#d4b02a")
CHITIN = ramp("#7a3a7e")
MAGENTA = ramp("#a8407e")
CARAPACE = ramp("#5a2a6a")
FLESHPINK = ramp("#c47a86")

EYE_DARK = hx("#1a1418")
EYE_RED = hx("#ff3b2a")
EYE_GLOW = hx("#ffe36a")
EYE_GREEN = hx("#a8ff5a")
WHITE_PX = hx("#f2efe4")

# --------------------------------------------------------------- human head
# hand-pixelled 3/4 head facing right. d/m/l = skin shadow/mid/light, b = brow,
# e = eye white, p = pupil, r = mouth line. Placed at (x0, y0) = (18, 9) by default.
HEADT = [
    "....mmmmmm....",
    "..mmllllllmm..",
    ".mllllllllllm.",
    ".mlllllllllllm",
    "mmlllllllllllm",
    "mmlllllllllllm",
    "mdmllbbbllbbbm",
    "mddlmepllmlpm.",
    "mdmlllddlllmmm",
    "mmdlllllllllmd",
    ".mmmllllllldd.",
    ".dmmmllllllm..",
    "..dmmllrrrrm..",
    "..ddmmmllllm..",
    "...ddmmmmmd...",
    ".....ddddd....",
]
MOUTHS = {
    "line": [],
    "frown": [(7, 12, "m"), (6, 13, "r"), (7, 12, "r"), (11, 12, "m"), (11, 13, "r")],
    "open": [(8, 13, "r"), (9, 13, "r"), (8, 12, "r"), (7, 12, "m")],
    "grin": [(6, 11, "r"), (7, 12, "r"), (11, 11, "r"), (8, 13, "d"), (9, 13, "d"), (10, 13, "d")],
    "snarl": [(7, 12, "r"), (8, 12, "e"), (9, 12, "e"), (10, 12, "r"), (11, 12, "r"), (8, 13, "r"), (9, 13, "r")],
}


def human_head(s, skin, x0=18, y0=9, eyes=None, mouth="line", beard=None, scar=False,
               mood="calm", brow=None, sclera=True, eyes_closed=False):
    """returns the head mask. eyes=None -> normal; a colour -> glowing eyes."""
    m = s.G(x0, y0, HEADT, on="dmlbeprh")
    s.add(skin, m, mode="flat", flat=2)
    brow_c = hx(brow) if isinstance(brow, str) else (brow or skin[0])
    legend = {"d": skin[1], "m": skin[2], "l": skin[3], "b": brow_c, "r": skin[0],
              "e": WHITE_PX if sclera else skin[3], "p": EYE_DARK}
    rows = [list(r) for r in HEADT]
    for (cx, cy, ch) in MOUTHS.get(mouth, []):
        rows[cy][cx] = ch
    if mood == "angry":
        rows[6][5] = "l"; rows[5][5] = "b"; rows[6][7] = "b"; rows[7][7] = "d"
        rows[6][10] = "b"; rows[5][12] = "b"; rows[6][12] = "m"
    elif mood == "sad":
        rows[6][7] = "l"; rows[5][7] = "b"; rows[6][10] = "l"; rows[5][10] = "b"
    if eyes_closed:
        rows[7][5] = "r"; rows[7][6] = "r"; rows[7][11] = "r"
    elif eyes is not None:
        legend["e"] = eyes; legend["p"] = eyes
        rows[7][4] = "d"
    s.stamp(x0, y0, ["".join(r) for r in rows], legend)
    if beard:
        bm = s.G(x0 + 1, y0 + 9, [
            "..#.......##",
            ".###.....###",
            ".####...####",
            "..##########",
            "...#########",
            ".....#####",
        ])
        s.add(beard, bm, mode="sphere", lt=0.25, st=0.7, tex=(7, 0.12), sep=False)
        s.pxs([(x0 + 7, y0 + 12), (x0 + 8, y0 + 12), (x0 + 9, y0 + 12), (x0 + 10, y0 + 12)], skin[0])
    if scar:
        s.pxs([(x0 + 10, y0 + 4), (x0 + 10, y0 + 5), (x0 + 11, y0 + 6), (x0 + 11, y0 + 8), (x0 + 12, y0 + 9)], hx("#9a4038"))
    return m


def hair(s, rmp, x0=18, y0=9, style="short", tex=None):
    """hair caps that sit on HEADT. styles: short, crop, long, bald(none), mohawk."""
    grids = {
        "short": ["...#######....", ".##########...", "############..", "####..#####...",
                  "###......##...", "##..........", "##"],
        "crop": ["....######....", "..#########...", ".##########...", ".###...", ".#"],
        "long": ["...########...", ".###########..", "#############.", "######..####..",
                 "####.......#..", "###", "###", "###", "###", "##", "##", "#"],
        "mohawk": ["..#######.....", ".#########....", "..#######.....", "...####"],
    }
    oy = -2 if style == "mohawk" else -1
    m = s.G(x0, y0 + oy, grids[style])
    s.add(rmp, m, mode="sphere", lt=0.3, st=0.66, tex=tex)
    return m


def neck(s, skin, x0=21, y0=22, x1=27, y1=30):
    return s.add(skin, s.R(x0, y0, x1, y1), mode="cyl", lt=0.2, st=0.5)


def torso(s, rmp, sy=30, half=15, cx=24, bottom=47, flare=1, tex=None, mode="cyl"):
    """shoulders + chest trapezoid."""
    pts = [(cx - half - flare, bottom), (cx - half, sy + 5), (cx - half + 2, sy + 2), (cx - half + 7, sy),
           (cx + half - 7, sy), (cx + half - 2, sy + 2), (cx + half, sy + 5), (cx + half + flare, bottom)]
    return s.add(rmp, s.P(*pts), mode=mode, lt=0.22, st=0.66, tex=tex)


def arm(s, rmp, side="R", sy=31, cx=24, half=15, bottom=47, width=6, tex=None):
    """an arm hanging at the side (sleeve)."""
    if side == "R":
        x = cx + half - 2
        pts = [(x - 1, sy), (x + width - 2, sy + 2), (x + width, bottom), (x + 1, bottom)]
    else:
        x = cx - half + 2
        pts = [(x + 1, sy), (x - width + 2, sy + 2), (x - width, bottom), (x - 1, bottom)]
    return s.add(rmp, s.P(*pts), mode="cyl", lt=0.3, st=0.6, tex=tex)


def scale_pts(pts, k, ox=0, oy=0):
    return [(round(x * k + ox), round(y * k + oy)) for (x, y) in pts]


# --------------------------------------------------------------- 64px power-armour bust
def armour64(s, plate, pl2, trim, lens, helmet="std", stacks=True, chest="chevron",
             spikes=False, trim_rim=True):
    """Shared giant-in-power-armour body (64x64, facing right). Weapons are added by the caller.
    helmet: std | horned | crest | hood | bare (caller draws the head)."""
    from pxlib import inter
    if stacks:
        for x in (14, 46):
            s.add(GUNMETAL, s.R(x, 10, x + 4, 24), mode="cyl")
            s.add(GUNMETAL, s.R(x - 1, 9, x + 5, 11), mode="cyl")
        if spikes:
            for x in (16, 48):
                s.add(BRASS, s.P((x - 1, 9), (x + 3, 9), (x + 1, 3)), mode="cyl")
    s.add(plate, s.P((10, 30), (16, 18), (48, 18), (54, 30)), mode="cyl")
    s.add(plate, s.P((14, 63), (16, 38), (24, 32), (40, 32), (48, 38), (50, 63)), mode="cyl", lt=0.22, st=0.66)
    s.add(pl2, s.P((20, 38), (32, 46), (44, 38), (43, 50), (32, 55), (21, 50)), mode="sphere")
    if chest == "chevron":
        s.add(trim, s.P((21, 40), (32, 47), (43, 40), (43, 43), (32, 50), (21, 43)), mode="vert", sep="dark")
    elif chest == "eye":       # original chaos motif: a slit eye in a ring
        s.add(trim, s.E(32, 46, 6, 5), mode="sphere", sep="dark")
        s.add(pl2, s.E(32, 46, 4, 3), mode="flat", flat=0, sep=False)
        s.add(ramp("#e04a2a", light=0.3), s.E(32, 46, 1, 2), mode="flat", flat=3, sep=False)
    elif chest == "book":      # tome + seal (grey-knight-ish purity, original)
        s.add(trim, s.R(27, 41, 37, 50), mode="sphere", sep="dark")
        s.add(CRIMSON, s.E(32, 51, 2, 2), mode="sphere")
    s.add(plate, s.R(22, 55, 42, 63), mode="vert", sep="dark")
    for y in (58, 61):
        for x in range(23, 42):
            s.px(x, y, plate[1])
    for cx in (12, 52):
        dome = sub(s.E(cx, 38, 12, 11), s.R(0, 46, 63, 63))
        s.add(pl2, dome, mode="sphere", lt=0.36, st=0.64)
        if trim_rim:
            s.add(trim, inter(s.E(cx, 38, 12, 11), s.R(0, 44, 63, 47)), mode="vert", sep="dark")
        if spikes:
            s.add(BRASS, s.P((cx - 5, 30), (cx - 1, 28), (cx - 4, 18)), mode="cyl")
            s.add(BRASS, s.P((cx + 1, 28), (cx + 5, 30), (cx + 5, 19)), mode="cyl")
    if helmet == "bare":
        return
    if helmet == "hood":
        s.add(plate, union(s.E(32, 24, 12, 12), s.R(20, 24, 44, 36)), mode="sphere", lt=0.35, sep="line")
        s.add(plate, s.E(34, 27, 8, 8), mode="flat", flat=0, sep=False)
    helm = union(s.E(32, 25, 9, 9), s.R(23, 25, 41, 34))
    if helmet in ("horned",):
        s.add(BONE, s.P((24, 21), (17, 16), (15, 6), (19, 12), (26, 18)), mode="cyl")
        s.add(BONE, s.P((38, 19), (44, 13), (47, 4), (46, 14), (40, 22)), mode="cyl")
    s.add(pl2, helm, mode="sphere", lt=0.42, st=0.7, sep="line")
    if helmet == "crest":
        s.add(trim, s.P((26, 17), (31, 9), (36, 9), (40, 17), (33, 15)), mode="sphere", sep="dark")
    elif helmet not in ("hood", "plain"):
        s.add(trim, s.R(30, 16, 33, 26), mode="cyl", sep="dark")
    s.add(plate, s.P((27, 24), (42, 23), (42, 26), (28, 27)), mode="flat", flat=1, sep=False)
    s.add(lens, s.R(31, 26, 34, 28), mode="sphere", sep="line")
    s.add(lens, s.R(38, 26, 40, 28), mode="sphere", sep="line")
    s.px(31, 26, lens[3]); s.px(38, 26, lens[3])
    s.add(pl2, s.P((33, 30), (41, 29), (45, 32), (44, 36), (35, 36)), mode="sphere")
    for x in (38, 40, 42):
        s.px(x, 33, plate[0]); s.px(x, 34, plate[0])
    s.add(GUNMETAL, s.E(26, 31, 3, 3), mode="sphere")


# --------------------------------------------------------------- T'au-like head (grey skin, no nose, forehead slit)
TAUHEADT = [
    "...mmmmmmm....",
    "..mllllllllm..",
    ".mlllllllllmm.",
    ".mllllllrlllm.",
    "mmllllllrlllm.",
    "mmlllllllllllm",
    "mdmllbbbllbbbm",
    "mddlmpplllppm.",
    "mdmllldllllmm.",
    "mmdllllllllmm.",
    ".mmmlllllllmm.",
    ".dmmmlllllldm.",
    "..dmmlllrrrm..",
    "..ddmmmlllmm..",
    "...ddmmmmmd...",
    ".....ddddd....",
]


def tau_head(s, skin, x0=18, y0=9, mouth="line"):
    m = s.G(x0, y0, TAUHEADT, on="dmlbeprh")
    s.add(skin, m, mode="flat", flat=2)
    legend = {"d": skin[1], "m": skin[2], "l": skin[3], "b": skin[1], "r": skin[0],
              "e": EYE_DARK, "p": hx("#14161e")}
    rows = [list(r) for r in TAUHEADT]
    if mouth == "smile":
        rows[11][7] = "r"; rows[12][11] = "m"; rows[11][11] = "r"
    s.stamp(x0, y0, ["".join(r) for r in rows], legend)
    return m
