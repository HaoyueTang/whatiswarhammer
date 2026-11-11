#!/usr/bin/env python3
"""Build the public release tree (branch `main`) from a committed ref on `dev`.

Public = only what players need: the game files + a gameplay-only README.
Developer material (CLAUDE.md, docs/, tools/, tests, release/) stays on `dev`.

Usage:
    python3 release/build_public.py [REF] [OUT_DIR]
      REF      git ref to export (default: HEAD) — only committed files are used
      OUT_DIR  output directory (default: /tmp/whatiswarhammer-public), wiped first
Then copy OUT_DIR over a checkout of `main` (keeping its .git) and commit.
"""
import io, os, shutil, subprocess, sys, tarfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF = sys.argv[1] if len(sys.argv) > 1 else "HEAD"
OUT = sys.argv[2] if len(sys.argv) > 2 else "/tmp/whatiswarhammer-public"

# Whitelist of public paths (prefix match). Anything else is left out.
INCLUDE = ("index.html", "src/", "data/", "assets/")
EXCLUDE = ("assets/audio/README.md",)          # dev notes inside public folders
PUBLIC_README = "release/README.public.md"

def main():
    sha = subprocess.check_output(["git", "-C", ROOT, "rev-parse", "--short", REF], text=True).strip()
    tar_bytes = subprocess.check_output(["git", "-C", ROOT, "archive", "--format=tar", REF])
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)
    n = 0
    with tarfile.open(fileobj=io.BytesIO(tar_bytes)) as tf:
        for m in tf.getmembers():
            if not m.isfile():
                continue
            if m.name == PUBLIC_README:
                dest = os.path.join(OUT, "README.md")
            elif m.name.startswith(INCLUDE) and m.name not in EXCLUDE:
                dest = os.path.join(OUT, m.name)
            else:
                continue
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            with open(dest, "wb") as f:
                f.write(tf.extractfile(m).read())
            n += 1
    with open(os.path.join(OUT, ".gitignore"), "w") as f:
        f.write("__pycache__/\n*.pyc\n")
    if not os.path.exists(os.path.join(OUT, "README.md")):
        sys.exit("error: %s missing at %s" % (PUBLIC_README, REF))
    print("public build of %s@%s: %d files -> %s" % (REF, sha, n, OUT))

if __name__ == "__main__":
    main()
