"""Fast look at ending illustrations while authoring (no PNG written to assets/, no manifest):

    python3 tools/art/endpreview.py imp_end_hold [more ids...] [--scale 5] [--out /tmp/prev.png]

Renders the ids side by side (or stacked when more than two) at the given nearest-neighbour scale and prints the
colour count and mean luma.  Imports the same modules as build_all, so edits to endings_*.py / endkit.py show at once."""
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image  # noqa: E402
import build_all  # noqa: E402,F401  (registers every generator)
import endkit  # noqa: E402
from reg import ENDINGS  # noqa: E402


def main():
    args = sys.argv[1:]
    scale, out = 5, "/tmp/endpreview.png"
    if "--scale" in args:
        i = args.index("--scale")
        scale = int(args[i + 1])
        del args[i:i + 2]
    if "--out" in args:
        i = args.index("--out")
        out = args[i + 1]
        del args[i:i + 2]
    ids = args or sorted(ENDINGS)
    imgs = []
    for eid in ids:
        t0 = time.time()
        im = endkit.render_ending(eid)
        print("%-28s %4.1fs  %2d colours  luma %5.1f" % (eid, time.time() - t0, endkit.count_colors(im), endkit.image_lum(im)))
        imgs.append(im.resize((192 * scale, 108 * scale), Image.NEAREST))
    cols = 1 if len(imgs) <= 2 else 2
    rows = (len(imgs) + cols - 1) // cols
    pad = 6
    sheet = Image.new("RGB", (cols * (192 * scale + pad) + pad, rows * (108 * scale + pad) + pad), (30, 28, 34))
    for n, im in enumerate(imgs):
        sheet.paste(im, (pad + (n % cols) * (192 * scale + pad), pad + (n // cols) * (108 * scale + pad)))
    sheet.save(out)
    print("wrote", out)


if __name__ == "__main__":
    main()
