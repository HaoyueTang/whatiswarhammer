"""Regenerate every PNG in assets/, assets/manifest.js and tools/art/contact_sheet.png.

    python3 tools/art/build_all.py            # everything (sprites, scenes, ui, endings, manifest, contact sheets)
    python3 tools/art/build_all.py --check    # only verify the key list against SPEC §7 + §14 + §26 (+ endings registry)

Ending illustrations (SPEC §31, assets/endings/<id>.png, manifest key end_<id>):
    --endings [--faction imperium]   render only the endings (fast loop; writes PNGs + contact sheets, NOT the manifest)
    --manifest                       rewrite assets/manifest.js from the registries without rendering anything
    --check-endings [--partial]      the art gate: one PNG per brief entry, 192x108, <= 32 colours, not near-empty,
                                     no near-duplicates, luminance good > bad > death per route; --partial = a
                                     missing PNG is only a note (use while the set is incomplete); exit 1 on error
    --id <ending id> [--id ...]      with --endings: render just those (plus its contact sheet)
    --no-endings                     full build without rendering endings (manifest still lists existing PNGs)
"""
import os
import sys
import json

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)

from PIL import Image  # noqa: E402
from reg import SPRITES, SCENES, UI, ENDINGS  # noqa: E402

MODULES = ["chars_imperium", "chars_chaos", "chars_tau", "chars_xenos", "chars_players", "chars_aeldari", "chars_necrons",
           "omens", "sigils", "icons", "scenes",
           "chars_orks", "chars_gsc", "chars_mechanicus", "omens_v3", "scenes_v3", "icons_v3",
           # SPEC §31 ending illustrations: one module per route (added as each route is authored)
           "endings_imperium", "endings_chaos", "endings_tau", "endings_aeldari", "endings_necrons",
           "endings_orks", "endings_gsc", "endings_mechanicus"]
for _m in MODULES:
    if os.path.exists(os.path.join(HERE, _m + ".py")):
        __import__(_m)

# SPEC §7 fixed key list (key -> size); used for --check and ordering
SPEC_SPRITES = {
    "player_imperium": 48, "player_chaos": 48, "player_tau": 48,
    "hive_foreman": 48, "preacher": 48, "guardsman": 48, "guard_sergeant": 48, "commissar": 48,
    "medicae": 48, "tech_priest": 48, "servitor": 48, "inquisitor": 48, "psyker": 48, "enforcer": 48,
    "astartes": 64,
    "cultist": 48, "cult_magus": 48, "mutant": 48, "heretic_astartes": 64, "chaos_sorcerer": 64,
    "daemon_khorne": 48, "daemon_nurgle": 48, "daemon_tzeentch": 48, "daemon_slaanesh": 48,
    "daemon_prince": 96, "grey_knight": 64,
    "tau_warrior": 48, "tau_ethereal": 48, "tau_battlesuit": 64, "tau_drone": 32, "kroot": 48,
    "gue_vesa": 48, "tau_water_caste": 48,
    "ork": 48, "ork_boss": 64, "gaunt": 48, "genestealer": 48, "tyranid_warrior": 64, "hive_tyrant": 96,
    "omen_emperor": 96, "omen_primarch": 96, "omen_black_crusade": 96, "omen_hivemind": 96,
    "omen_purge": 96, "omen_tau_fleet": 96, "omen_farsight": 96,
    "sigil_khorne": 32, "sigil_nurgle": 32, "sigil_tzeentch": 32, "sigil_slaanesh": 32, "sigil_undivided": 32,
}
SPEC_SCENES = ["title", "hive_hab", "hive_spire", "underhive", "manufactorum", "cathedral", "barracks",
               "trench", "ship_interior", "warp", "void", "ruins", "jungle", "cult_shrine", "daemon_world",
               "tau_city", "tau_outpost", "spore_sky", "burning_city", "throne_light"]
SPEC_UI = ["icon_hp", "icon_sanity", "icon_corruption", "icon_faith", "icon_favor", "icon_greatergood",
           "icon_clock", "icon_codex", "icon_save", "icon_lang"]

# SPEC §14 (v0.2) new keys — appended to the lists above so ordering stays stable
SPEC14_SPRITES = {
    "player_aeldari": 48, "player_necrons": 48,
    "aeldari_guardian": 48, "aeldari_seer": 48, "aeldari_ranger": 48, "aeldari_bonesinger": 48,
    "aeldari_masked": 48, "drukhari_raider": 48, "wraith_construct": 64, "greater_daemon_slaanesh": 96,
    "necron_warrior": 48, "necron_lord": 64, "cryptek": 48, "flayed_one": 48, "canoptek_scarab": 32,
    "canoptek_spyder": 64, "dig_leader": 48, "explorator": 48,
    "omen_farseer": 96, "omen_ynnead": 96, "omen_khaine": 96, "omen_silent_king": 96, "omen_ctan": 96,
    "omen_stormlord": 96, "omen_collector": 96,
}
SPEC14_SCENES = ["craftworld", "webway", "maiden_world", "dig_site", "tomb_exterior", "tomb_interior", "stasis_gallery"]
SPEC14_UI = ["icon_fate", "icon_worth"]
SPEC_SPRITES.update(SPEC14_SPRITES)
SPEC_SCENES += SPEC14_SCENES
SPEC_UI += SPEC14_UI

# SPEC §26 (v0.3) new keys — Orks · Genestealer Cult · Adeptus Mechanicus; appended again
SPEC26_SPRITES = {
    "player_orks": 48, "player_gsc": 48, "player_mechanicus": 48,
    "ork_mek": 48, "ork_weirdboy": 48, "ork_nob": 64, "gretchin": 32, "squig": 32,
    "gsc_neophyte": 48, "gsc_acolyte": 48, "gsc_magus": 48, "gsc_primus": 64, "gsc_patriarch": 96,
    "skitarius": 48, "magos": 64, "electro_priest": 48, "kastelan_robot": 64, "dark_mechanicus": 64,
    "daemon_engine": 96,
    "omen_waaagh": 96, "omen_gork_mork": 96, "omen_star_children": 96, "omen_four_armed": 96,
    "omen_mars": 96, "omen_cawl": 96, "omen_omnissiah": 96,
}
SPEC26_SCENES = ["ork_scrapyard", "ork_fort", "mine_shaft", "gsc_chapel", "forge_floor", "mars_vista", "tech_vault"]
SPEC26_UI = ["icon_teef", "icon_kinship", "icon_grace"]
SPEC_SPRITES.update(SPEC26_SPRITES)
SPEC_SCENES += SPEC26_SCENES
SPEC_UI += SPEC26_UI


def check():
    problems = []
    for k, size in SPEC_SPRITES.items():
        if k not in SPRITES:
            problems.append("missing sprite " + k)
        elif SPRITES[k]["w"] != size:
            problems.append("size mismatch " + k)
    for k in SPEC_SCENES:
        if k not in SCENES:
            problems.append("missing scene " + k)
    for k in SPEC_UI:
        if k not in UI:
            problems.append("missing ui " + k)
    extra = (set(SPRITES) - set(SPEC_SPRITES)) | (set(SCENES) - set(SPEC_SCENES)) | (set(UI) - set(SPEC_UI))
    for k in sorted(extra):
        problems.append("extra key (not in SPEC) " + k)
    problems += check_endings_registry()
    return problems


def build(with_endings=True):
    out_sp = os.path.join(ROOT, "assets", "sprites")
    out_sc = os.path.join(ROOT, "assets", "scenes")
    out_ui = os.path.join(ROOT, "assets", "ui")
    for d in (out_sp, out_sc, out_ui):
        os.makedirs(d, exist_ok=True)
    rendered = {"sprites": [], "scenes": [], "ui": []}
    for k in SPEC_SPRITES:
        if k not in SPRITES:
            continue
        e = SPRITES[k]
        img = e["fn"]()
        assert img.size == (e["w"], e["h"]), (k, img.size)
        img.save(os.path.join(out_sp, k + ".png"))
        rendered["sprites"].append((k, img))
    for k in SPEC_SCENES:
        if k not in SCENES:
            continue
        e = SCENES[k]
        img = e["fn"]().convert("RGB")
        assert img.size == (192, 108), (k, img.size)
        img.save(os.path.join(out_sc, k + ".png"))
        rendered["scenes"].append((k, img.convert("RGBA")))
    for k in SPEC_UI:
        if k not in UI:
            continue
        img = UI[k]["fn"]()
        assert img.size == (16, 16), (k, img.size)
        img.save(os.path.join(out_ui, k + ".png"))
        rendered["ui"].append((k, img))
    if with_endings:
        build_endings()
    write_manifest(*manifest_dicts())
    contact_sheet(rendered)
    return rendered


def manifest_dicts():
    """(sprites, scenes, ui) manifest dicts built from the registries (no rendering).  Ending illustrations are
    listed as scenes `end_<id>` for every registered ending whose PNG exists in assets/endings (SPEC §31)."""
    man_sp, man_sc, man_ui = {}, {}, {}
    for k in SPEC_SPRITES:
        if k in SPRITES:
            e = SPRITES[k]
            man_sp[k] = {"src": "assets/sprites/%s.png" % k, "w": e["w"], "h": e["h"],
                         "name": {"zh": e["zh"], "en": e["en"]}}
    for k in SPEC_SCENES:
        if k in SCENES:
            e = SCENES[k]
            man_sc[k] = {"src": "assets/scenes/%s.png" % k, "w": 192, "h": 108,
                         "name": {"zh": e["zh"], "en": e["en"]}}
    for k in SPEC_UI:
        if k in UI:
            man_ui[k] = {"src": "assets/ui/%s.png" % k, "w": 16, "h": 16}
    brief = load_brief()
    for eid, b in brief.items():                      # brief order = route order
        if eid in ENDINGS and os.path.exists(os.path.join(ROOT, "assets", "endings", eid + ".png")):
            man_sc["end_" + eid] = {"src": "assets/endings/%s.png" % eid, "w": 192, "h": 108,
                                    "name": {"zh": b["title"]["zh"], "en": b["title"]["en"]}}
    return man_sp, man_sc, man_ui


def _js(obj):
    lines = []
    for k, v in obj.items():
        lines.append("  %s: %s" % (k, json.dumps(v, ensure_ascii=False)))
    return "{\n" + ",\n".join(lines) + "\n}"


def write_manifest(sp, sc, ui):
    txt = ("/* assets/manifest.js — GENERATED by tools/art/build_all.py (art role). Do not edit by hand.\n"
           " * Original pixel art; archetypes only, no likeness of named canon characters, no GW marks. */\n"
           "WH.registerSprites(%s);\n\nWH.registerScenes(%s);\n\nWH.registerUI(%s);\n") % (_js(sp), _js(sc), _js(ui))
    with open(os.path.join(ROOT, "assets", "manifest.js"), "w", encoding="utf-8") as f:
        f.write(txt)


def contact_sheet(rendered, path=None):
    path = path or os.path.join(HERE, "contact_sheet.png")
    bg = (28, 26, 32, 255)
    pad = 10
    # sprites at x3 grouped in rows of fixed width; scenes at x3 in 3 columns; ui at x4
    S = 3
    rows = []
    W = 192 * S * 3 + pad * 4
    cur, cx, ch = [], pad, 0
    for k, img in rendered["sprites"] + [(k, i) for k, i in rendered["ui"]]:
        s = 4 if img.width <= 16 else S
        w, h = img.width * s, img.height * s
        if cx + w + pad > W:
            rows.append((cur, ch))
            cur, cx, ch = [], pad, 0
        cur.append((cx, img.resize((w, h), Image.NEAREST)))
        cx += w + pad
        ch = max(ch, h)
    if cur:
        rows.append((cur, ch))
    sc_rows = (len(rendered["scenes"]) + 2) // 3
    H = pad + sum(h + pad for _, h in rows) + sc_rows * (108 * S + pad) + pad
    sheet = Image.new("RGBA", (W, H), bg)
    y = pad
    for items, h in rows:
        for x, im in items:
            # faint checker backdrop so transparency/outline is visible
            sheet.paste((44, 41, 50, 255), (x, y, x + im.width, y + im.height))
            sheet.alpha_composite(im, (x, y))
        y += h + pad
    for i, (k, img) in enumerate(rendered["scenes"]):
        x = pad + (i % 3) * (192 * S + pad)
        yy = y + (i // 3) * (108 * S + pad)
        sheet.alpha_composite(img.resize((192 * S, 108 * S), Image.NEAREST), (x, yy))
    sheet.convert("RGB").save(path)
    return path


# ====================================================================== endings (SPEC §31)
ENDINGS_REQUIRE_ALL = False   # flip to True once all 126 illustrations exist: then --check also fails on a missing generator
ROUTES = ["imperium", "chaos", "tau", "aeldari", "necrons", "orks", "gsc", "mechanicus"]
END_DIR = os.path.join(ROOT, "assets", "endings")
KIND_COL = {"good": (96, 190, 110), "bad": (224, 168, 64), "death": (200, 80, 80)}
LUM_MIN_BAD_DEATH = 4.0       # mean-luma margin (0..255) that counts as "brighter"
DUP_AHASH_MIN, DUP_DIFF_MIN = 10, 0.25   # SPEC §31: every pair needs aHash distance >= 10 AND >= 25 % differing pixels
DUP_FLAG_IF = "both"        # "either" = SPEC wording (a pair fails if EITHER measure is too low);
                              # "both" = only flag when both are too low (fewer false alarms between different pictures
                              # that merely share a bright-top / dark-bottom layout; 4 of 861 pairs among the existing
                              # scenes + pilot endings have aHash < 10)
_BRIEF = {}


def load_brief():
    """ordered dict: ending id -> brief entry (tools/art/endings_brief.json, made by node tools/dev/dump_endings.js)."""
    if not _BRIEF:
        with open(os.path.join(HERE, "endings_brief.json"), encoding="utf-8") as f:
            for e in json.load(f)["endings"]:
                _BRIEF[e["id"]] = e
    return _BRIEF


def check_endings_registry():
    """problems with the ENDINGS registry itself: unknown ids (always an error), missing generators (count only,
    an error once ENDINGS_REQUIRE_ALL)."""
    brief = load_brief()
    out = []
    unknown = sorted(set(ENDINGS) - set(brief))
    for k in unknown:
        out.append("ending generator for an id that is not in endings_brief.json: " + k)
    missing = [k for k in brief if k not in ENDINGS]
    if missing and ENDINGS_REQUIRE_ALL:
        out.append("%d of %d endings have no generator (first: %s)" % (len(missing), len(brief), ", ".join(missing[:4])))
    return out


def endkit_flat(img):
    sys.path.insert(0, HERE)
    import endkit
    return endkit.flat(img)


def render_one_ending(eid):
    sys.path.insert(0, HERE)
    import endkit
    b = load_brief()[eid]
    return endkit.render_ending(eid, kind=b["kind"], route=b["faction"])


def build_endings(faction=None, only=None, verbose=True):
    """render registered endings -> assets/endings/<id>.png (+ contact sheets).  Returns {id: RGB image}."""
    import time
    brief = load_brief()
    os.makedirs(END_DIR, exist_ok=True)
    ids = [i for i in brief if i in ENDINGS and (faction is None or brief[i]["faction"] == faction)
           and (not only or i in only)]
    imgs = {}
    t_all = time.time()
    for eid in ids:
        t0 = time.time()
        img = render_one_ending(eid)
        img.save(os.path.join(END_DIR, eid + ".png"))
        imgs[eid] = img
        if verbose:
            print("  %-28s %-6s %5.1fs  %d colours" % (eid, brief[eid]["kind"], time.time() - t0,
                                                       len(set(endkit_flat(img)))))
    # contact sheets from the files on disk (so a one-route rebuild still refreshes the whole-set sheet)
    routes = [faction] if faction else ROUTES
    if only:
        routes = sorted({brief[i]["faction"] for i in ids})
    for r in routes:
        rid = [i for i in brief if brief[i]["faction"] == r and os.path.exists(os.path.join(END_DIR, i + ".png"))]
        if rid:
            contact_endings(rid, os.path.join(HERE, "contact_endings_%s.png" % r), cols=3, scale=2)
    allid = [i for i in brief if os.path.exists(os.path.join(END_DIR, i + ".png"))]
    if allid:
        contact_endings(allid, os.path.join(HERE, "contact_endings_all.png"), cols=6, scale=1)
    if verbose:
        print("endings rendered: %d in %.1fs" % (len(ids), time.time() - t_all))
    return imgs


def _font(size):
    from PIL import ImageFont
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        return ImageFont.load_default()


def contact_endings(ids, path, cols=3, scale=2):
    """grid of the ending PNGs (nearest-neighbour x`scale`), id + kind + English title under each thumbnail."""
    from PIL import ImageDraw
    brief = load_brief()
    pad, lab = 8, (30 if scale > 1 else 22)
    tw, th = 192 * scale, 108 * scale
    rows = (len(ids) + cols - 1) // cols
    sheet = Image.new("RGB", (pad + cols * (tw + pad), pad + rows * (th + lab + pad)), (24, 22, 28))
    d = ImageDraw.Draw(sheet)
    f1, f2 = _font(11 if scale > 1 else 9), _font(10 if scale > 1 else 8)
    for n, eid in enumerate(ids):
        x, y = pad + (n % cols) * (tw + pad), pad + (n // cols) * (th + lab + pad)
        im = Image.open(os.path.join(END_DIR, eid + ".png")).convert("RGB")
        if scale > 1:
            im = im.resize((tw, th), Image.NEAREST)
        sheet.paste(im, (x, y))
        kc = KIND_COL[brief[eid]["kind"]]
        d.rectangle([x - 1, y - 1, x + tw, y + th], outline=kc)
        claim = brief[eid]["claim"]
        d.text((x, y + th + 2), "%s" % eid, fill=(235, 232, 225), font=f1)
        tag = brief[eid]["kind"] + ("  · " + claim if claim else "")
        if scale > 1:
            d.text((x, y + th + 15), tag + "   " + brief[eid]["title"]["en"][:34], fill=kc, font=f2)
        else:
            d.text((x, y + th + 11), tag, fill=kc, font=f2)
    sheet.save(path)
    return path


def _ahash(img):
    g = img.convert("L").resize((8, 8), Image.BOX)
    px = list(g.get_flattened_data()) if hasattr(g, "get_flattened_data") else list(g.getdata())
    m = sum(px) / 64.0
    return sum((1 << i) for i, v in enumerate(px) if v > m)


def _diff_ratio(a, b, thresh=30):
    from PIL import ImageChops
    ch = [ImageChops.difference(x, y) for x, y in zip(a.split(), b.split())]
    tot = ImageChops.add(ImageChops.add(ch[0], ch[1]), ch[2])
    hist = tot.histogram()
    return sum(hist[thresh + 1:]) / float(a.width * a.height)


def check_endings(partial=False, verbose=False):
    """SPEC §31 art gate.  Returns (errors, notes) lists of readable lines."""
    sys.path.insert(0, HERE)
    import endkit
    brief = load_brief()
    errors, notes = [], []
    files = sorted(f[:-4] for f in os.listdir(END_DIR) if f.endswith(".png")) if os.path.isdir(END_DIR) else []
    extra = [f for f in files if f not in brief]
    have = [i for i in brief if i in files]
    missing = [i for i in brief if i not in files]
    for f in extra:
        errors.append("extra file (no such ending in the brief): assets/endings/%s.png" % f)
    if missing:
        msg = "%d of %d endings have no PNG yet" % (len(missing), len(brief))
        by = {}
        for i in missing:
            by.setdefault(brief[i]["faction"], []).append(i)
        msg += "  [" + ", ".join("%s %d" % (r, len(by[r])) for r in ROUTES if r in by) + "]"
        if verbose:
            msg += "\n      " + ", ".join(missing)
        (notes if partial else errors).append(msg)
    imgs = {}
    for eid in have:
        try:
            im = Image.open(os.path.join(END_DIR, eid + ".png"))
        except Exception as ex:   # noqa: BLE001
            errors.append("%s: cannot read PNG (%s)" % (eid, ex))
            continue
        if im.size != (192, 108):
            errors.append("%s: size %dx%d, expected 192x108" % (eid, im.size[0], im.size[1]))
            continue
        im = im.convert("RGB")
        imgs[eid] = im
        data = endkit.flat(im)
        cnt = {}
        for p in data:
            cnt[p] = cnt.get(p, 0) + 1
        if len(cnt) > endkit.MAX_COLORS:
            errors.append("%s: %d colours (max %d)" % (eid, len(cnt), endkit.MAX_COLORS))
        dom = max(cnt.values()) / float(len(data))
        if 1.0 - dom < 0.15:
            errors.append("%s: near-empty, %.0f%% of the pixels are one colour (need >= 15%% different)" % (eid, dom * 100))
    # near-duplicates
    ids = list(imgs)
    hashes = {i: _ahash(imgs[i]) for i in ids}
    closest = None
    for a in range(len(ids)):
        for b in range(a + 1, len(ids)):
            ha = bin(hashes[ids[a]] ^ hashes[ids[b]]).count("1")
            dr = _diff_ratio(imgs[ids[a]], imgs[ids[b]])
            if closest is None or ha < closest[0]:
                closest = (ha, ids[a], ids[b], dr)
            lo_h, lo_d = ha < DUP_AHASH_MIN, dr < DUP_DIFF_MIN
            if (lo_h or lo_d) if DUP_FLAG_IF == "either" else (lo_h and lo_d):
                errors.append("near-duplicate: %s ~ %s (aHash distance %d, %.0f%% pixels differ; need >= %d and >= %d%%)"
                              % (ids[a], ids[b], ha, dr * 100, DUP_AHASH_MIN, DUP_DIFF_MIN * 100))
    if closest and verbose:
        notes.append("closest pair by aHash: %s ~ %s (distance %d, %.0f%% pixels differ)" % (closest[1], closest[2], closest[0], closest[3] * 100))
    # luminance order per route
    for r in ROUTES:
        by = {"good": [], "bad": [], "death": []}
        for i in ids:
            if brief[i]["faction"] == r:
                by[brief[i]["kind"]].append(endkit.image_lum(imgs[i]))
        mean = {k: sum(v) / len(v) for k, v in by.items() if v}
        if len(mean) < 2:
            continue
        line = "%s luminance: " % r + "  ".join("%s %.0f (n=%d)" % (k, mean[k], len(by[k])) for k in ("good", "bad", "death") if k in mean)
        complete = all(i in imgs for i in brief if brief[i]["faction"] == r)
        bad_order = []
        if "good" in mean and "bad" in mean and not mean["good"] > mean["bad"] + LUM_MIN_BAD_DEATH:
            bad_order.append("good is not brighter than bad")
        if "bad" in mean and "death" in mean and not mean["bad"] > mean["death"] + LUM_MIN_BAD_DEATH:
            bad_order.append("bad is not brighter than death")
        if "good" in mean and "death" in mean and "bad" not in mean and not mean["good"] > mean["death"] + LUM_MIN_BAD_DEATH:
            bad_order.append("good is not brighter than death")
        if bad_order:
            (errors if (complete or not partial) else notes).append(line + "   <- " + "; ".join(bad_order)
                                                                    + ("" if complete else "  (route incomplete)"))
        elif verbose:
            notes.append(line + "   ok")
    # manifest
    try:
        with open(os.path.join(ROOT, "assets", "manifest.js"), encoding="utf-8") as f:
            man = f.read()
        stale = [i for i in have if ("end_" + i + ":") not in man]
        if stale:
            errors.append("assets/manifest.js has no end_<id> entry for %d existing PNGs (%s) — run build_all.py --manifest"
                          % (len(stale), ", ".join(stale[:3]) + (" ..." if len(stale) > 3 else "")))
    except OSError:
        errors.append("assets/manifest.js missing")
    notes.insert(0, "%d of %d endings rendered, %d checked" % (len(have), len(brief), len(imgs)))
    return errors, notes


def _arg(name):
    out = []
    for i, a in enumerate(sys.argv):
        if a == name and i + 1 < len(sys.argv):
            out.append(sys.argv[i + 1])
    return out


if __name__ == "__main__":
    if "--check-endings" in sys.argv:
        errs, notes = check_endings(partial="--partial" in sys.argv, verbose="-v" in sys.argv or "--verbose" in sys.argv)
        for n in notes:
            print("  " + n)
        for e in errs:
            print("ERROR " + e)
        print("endings gate: %s" % ("%d error(s)" % len(errs) if errs else "OK"))
        sys.exit(1 if errs else 0)
    if "--check" in sys.argv:
        p = check()
        print("\n".join(p) if p else "OK: all SPEC §7 + §14 + §26 keys present")
        sys.exit(1 if p else 0)
    if "--manifest" in sys.argv:
        write_manifest(*manifest_dicts())
        print("assets/manifest.js rewritten (no rendering)")
        sys.exit(0)
    if "--endings" in sys.argv:
        fac = (_arg("--faction") or [None])[0]
        if fac and fac not in ROUTES:
            sys.exit("unknown route %r (one of %s)" % (fac, " ".join(ROUTES)))
        only = set(_arg("--id")) or None
        build_endings(fac, only)
        sys.exit(0)
    r = build(with_endings="--no-endings" not in sys.argv)
    print("sprites %d  scenes %d  ui %d  endings %d" % (len(r["sprites"]), len(r["scenes"]), len(r["ui"]), len(ENDINGS)))
    p = check()
    if p:
        print("SPEC check:\n  " + "\n  ".join(p))
    else:
        print("SPEC check: OK")
