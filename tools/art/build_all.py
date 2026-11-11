"""Regenerate every PNG in assets/, assets/manifest.js and tools/art/contact_sheet.png.

    python3 tools/art/build_all.py            # everything
    python3 tools/art/build_all.py --check    # only verify the key list against SPEC §7 + §14
"""
import os
import sys
import json

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)

from PIL import Image  # noqa: E402
from reg import SPRITES, SCENES, UI  # noqa: E402

MODULES = ["chars_imperium", "chars_chaos", "chars_tau", "chars_xenos", "chars_players", "chars_aeldari", "chars_necrons",
           "omens", "sigils", "icons", "scenes"]
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
    return problems


def build():
    out_sp = os.path.join(ROOT, "assets", "sprites")
    out_sc = os.path.join(ROOT, "assets", "scenes")
    out_ui = os.path.join(ROOT, "assets", "ui")
    for d in (out_sp, out_sc, out_ui):
        os.makedirs(d, exist_ok=True)
    rendered = {"sprites": [], "scenes": [], "ui": []}
    man_sp, man_sc, man_ui = {}, {}, {}
    for k in SPEC_SPRITES:
        if k not in SPRITES:
            continue
        e = SPRITES[k]
        img = e["fn"]()
        assert img.size == (e["w"], e["h"]), (k, img.size)
        img.save(os.path.join(out_sp, k + ".png"))
        rendered["sprites"].append((k, img))
        man_sp[k] = {"src": "assets/sprites/%s.png" % k, "w": e["w"], "h": e["h"],
                     "name": {"zh": e["zh"], "en": e["en"]}}
    for k in SPEC_SCENES:
        if k not in SCENES:
            continue
        e = SCENES[k]
        img = e["fn"]().convert("RGB")
        assert img.size == (192, 108), (k, img.size)
        img.save(os.path.join(out_sc, k + ".png"))
        rendered["scenes"].append((k, img.convert("RGBA")))
        man_sc[k] = {"src": "assets/scenes/%s.png" % k, "w": 192, "h": 108,
                     "name": {"zh": e["zh"], "en": e["en"]}}
    for k in SPEC_UI:
        if k not in UI:
            continue
        img = UI[k]["fn"]()
        assert img.size == (16, 16), (k, img.size)
        img.save(os.path.join(out_ui, k + ".png"))
        rendered["ui"].append((k, img))
        man_ui[k] = {"src": "assets/ui/%s.png" % k, "w": 16, "h": 16}
    write_manifest(man_sp, man_sc, man_ui)
    contact_sheet(rendered)
    return rendered


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


if __name__ == "__main__":
    if "--check" in sys.argv:
        p = check()
        print("\n".join(p) if p else "OK: all SPEC §7 + §14 keys present")
        sys.exit(1 if p else 0)
    r = build()
    print("sprites %d  scenes %d  ui %d" % (len(r["sprites"]), len(r["scenes"]), len(r["ui"])))
    p = check()
    if p:
        print("SPEC check:\n  " + "\n  ".join(p))
    else:
        print("SPEC check: OK")
