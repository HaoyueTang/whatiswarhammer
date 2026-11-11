"""Registries filled by the generator modules via decorators; read by build_all."""
SPRITES = {}   # key -> dict(fn, w, h, zh, en, group)
SCENES = {}    # key -> dict(fn, zh, en)
UI = {}        # key -> dict(fn)

_order = []


def sprite(key, size, zh, en, group="misc", face="R"):
    """face='L' renders the (right-facing) authored sprite mirrored, light kept top-left."""
    def deco(fn):
        call = (lambda: fn(flip=True)) if face == "L" else fn
        SPRITES[key] = dict(fn=call, w=size, h=size, zh=zh, en=en, group=group, face=face)
        return fn
    return deco


def scene(key, zh, en):
    def deco(fn):
        SCENES[key] = dict(fn=fn, zh=zh, en=en)
        return fn
    return deco


def ui(key):
    def deco(fn):
        UI[key] = dict(fn=fn)
        return fn
    return deco
