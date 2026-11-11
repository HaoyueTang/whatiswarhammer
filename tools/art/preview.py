"""Quick review helper: python3 tools/art/preview.py out.png key1 key2 ... [--scale 8]
Renders the given sprite/scene/ui keys side by side on a dark background."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image
import build_all  # noqa: registers everything
from reg import SPRITES, SCENES, UI


def render_key(k):
    if k in SPRITES:
        return SPRITES[k]["fn"]()
    if k in SCENES:
        return SCENES[k]["fn"]()
    return UI[k]["fn"]()


def main():
    args = sys.argv[1:]
    scale = 8
    if "--scale" in args:
        i = args.index("--scale")
        scale = int(args[i + 1])
        del args[i:i + 2]
    out, keys = args[0], args[1:]
    imgs = [render_key(k).resize((render_key(k).width * scale, render_key(k).height * scale), Image.NEAREST) for k in keys]
    W = sum(i.width for i in imgs) + 8 * (len(imgs) + 1)
    H = max(i.height for i in imgs) + 16
    sheet = Image.new("RGBA", (W, H), (34, 32, 40, 255))
    x = 8
    for im in imgs:
        sheet.alpha_composite(im, (x, 8))
        x += im.width + 8
    sheet.save(out)


if __name__ == "__main__":
    main()
