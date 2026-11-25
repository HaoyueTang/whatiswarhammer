# Work lines + perspective switches — brief for the 8 faction writers (2026-11-25)

Owner (Howie): the game feels childish; add large new **work lines** (工作线 — the player's actual job/role inside the faction, with real weight) and **perspective switches** (视角切换 — short scenes seen through someone else's eyes). One writer per faction file; edit ONLY your faction file. No git.

## What to add to your faction (`data/factions/<faction>.js`)
1. **One work line, 8–12 new nodes**, entered from an existing mid-route node (chapter 2 or 3) by ONE new choice (that node must stay ≤ 4 choices; pick a node with room), and rejoining the existing route at a later existing node (no dead ends, no new endings unless trivial). It should feel adult: duty vs. conscience, small cruelties of the system, a cost you carry. Concrete work: what your hands do, who gives orders, who pays.
   - At least **two choices with lasting consequences**: set a flag (prefix `wl_`, e.g. `wl_imp_signed_list`) that is **read later** by ≥ 2 existing or new nodes on the main route (alt `add` lines or `resultAlt`), so the world remembers.
   - Stats: use the file's existing effect style and magnitudes (hp/sanity/corruption/renown deltas similar to neighbouring nodes); at most 1–2 rolls, copied from existing roll shapes. Do not make the route much deadlier (the validator simulates runs; death-rate change ≤ ~3 points).
2. **Two perspective-switch nodes (`pov`) inside or next to your work line**: a node with a new field `pov: L("视角：<who>", "POV: <who>")` shows the same events through another person's eyes (the officer who gave your order, the enemy you face, the alien watching, a victim, a machine). Written in their voice or close third person; 1–2 choices max, normally a single "continue" choice (e.g. 「……」 / 「回到你自己」) that leads back to the player's line. No stat effects, no rolls, no flags on pov nodes. The UI shows a banner for `pov` nodes (the lead adds it).
3. Introduce every new character on first appearance (§37.9: name or description in narration, not just a name tag). Speakers: reuse the file's existing cast objects/sprites where possible; new speakers use the file's speaker shape and an existing sprite id.

## Hard limits (validator)
- node text / alt / result ≤ 90 zh chars (newlines excluded), ≤ 65 EN words; adds ≤ 45 zh; labels ≤ 24 zh / ≤ 14 EN words; ≤ 4 choices per node; ≤ 2 adds firing per node. zh + en on every string.
- Use the file's own helpers and node shape (read 3–4 existing nodes first and copy their style exactly: chapter, time fields, mood/scene/image keys).
- Dates: if neighbouring nodes carry `time`, give yours consistent small advances; never name a year that contradicts the route clock (run `node tools/dev/date_audit.js`).
- IP: original prose; lore shown through NPC behaviour; no GW logos; no likeness of named canon characters.

## Verify before handing back (from /home/claude/whatiswarhammer)
- `node tools/dev/route_graph.js --faction <id> --checks-only` → 0 ERROR
- `node tools/dev/intro_audit.js --route <id>` → 0 person gaps
- `node tools/dev/date_audit.js` → 0 anachronisms
- `node tools/dev/playthrough.js <id> --seed N` for a few seeds
- `node tools/dev/validate.js 2>&1 | grep -E "^ERROR|^PASS|^FAIL"` — 7 other writers edit other faction files in parallel; report only errors in YOUR file, fix them.

## Hand back (short)
Entry node + choice index, the new node ids in order, the `wl_` flags and where they are read, the two pov nodes, check outputs.
