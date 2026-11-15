# BIRTH_BRIEF — shared birth point, text role (v0.5.0)

Read first: `CLAUDE.md`, `docs/SPEC.md` §35 (this task), §16/§23 (origins), §32.1–32.2 (rules, `alt`), `docs/audit/WRITER_BRIEF.md` (voice/style), `docs/audit/<route>.md` (your route's audit), `docs/LESSONS-v0.1.md`.
Owner (Howie) rules that apply: **context must be coherent first**; lore shown through NPC behaviour; original prose; no likeness of named canon characters; bilingual zh+en (zh is the master text; en must say the same); node text ≤ 90 zh chars (en scaled), choice labels ≤ 24 zh, `alt.add` ≤ 45 zh, `alt.text` ≤ 90 zh.

## What you do (only in `data/factions/<route>.js`)
1. **Read the route's three origin openings** (the three `startNode`s and the 3–6 prologue nodes each owns, until they merge into the spine) and the faction object (`origins`, `startDate`, `npcs`, `scene` keys used).
2. **Design one shared birth scene** of **3–6 nodes** `<prefix>_b01 … <prefix>_bNN` (b01 = `birthNode`) that the three classes really share — a muster, a census, a landing, a festival, an inspection, a disaster, a purge… — with the three lives reached by **fork choices** (SPEC §35.1). The player should feel *"my choices made me this person"*, not *"I picked a card"*. Different reasons (duty / debt / hunger / faith / ambition / fear) lead to different lives; labels are actions, not job titles. Keep chapter 1, no rolls, no stat deltas, no flags except in the fork choices, no events, no endings.
3. **Make the physical story work.** The three openings happen in different places (e.g. a hab-block, a dome farm, a spire house). The birth scene must either happen somewhere all three can plausibly be (a transit hub, a market, a muster square, a ship) or be a world-level event seen from where you stand; each fork choice's `result` line and the origin's first node (through the `alt`) must explain the move. Use only `scene` keys / `speaker` sprites that already exist in the route or manifest (validator checks).
4. **Add `birthNode: "<prefix>_b01"`** to the faction object, next to `startNode`.
5. **Add an `alt` to each of the three origin start nodes** (24 in total across the project; 3 per route) with condition `{flag:"born_shared"}`: usually one `{if:{flag:"born_shared"}, text:{zh,en}}` that replaces the opening so it reads right *after* the shared birth (no re-introduction of the setting the player already saw, same hour/place, one or two lines carrying the last birth choice), or `add` lines when only a tie-in is needed. The base text of the start node must stay valid for the old origin-card path. If a start node already has `alt` entries, keep them and put yours **first**; max 8 entries; at most 2 `add` lines show.
6. Do not change ids, origins, stats, other nodes' text (except when an existing line would now be wrong *only after* a birth you wrote — then fix with `alt`), flag names, endings, or any other file. Do not rename anything. Do not git-commit.

## Fork choice shape (copy exactly)
```js
C("<≤24 zh>", "<en>", "<origin startNode>", {effects: {origin: "<originId>", set: {born_shared: true, origin_<originId>: true}}, result: L("<≤90 zh>", "<en>")})
```
Several fork choices may lead to the same origin; every origin must get ≥ 1. A fork choice can sit on the last birth node or earlier. Non-fork birth choices lead to another birth node and carry no stat/flag effects. No cosmetic choices (§32.1 rule 1): since no flags exist before the fork, make pre-fork choices matter by *branching the graph* — e.g. b01 offers two paths to two different second nodes, and each of those offers a fork with a different subset of origins (every origin reachable from ≥ 1 path). A node with a single "continue" choice is fine.

## Self-checks (run them; fix until clean)
- `node tools/dev/validate.js --faction <route>` → **0 errors** (`grep -i "birth\|§35"` shows your checks; other routes may be mid-edit by other writers — ignore their lines).
- `node tools/dev/playthrough.js <route> --birth --seed 1` … `--seed 6` (add `--en`) → read the birth + the three origin openings in both languages as a player. Look at the three origins with `--seed` variations until each appears.
- `node tools/dev/route_graph.js --faction <route>`: no ERROR; text on origin starts uses only facts guaranteed on arrival (`born_shared` is MAY, never MUST).
- `node tools/dev/date_audit.js`: 0 anachronisms (route dates: see `startDate`; §27 Arcosa Sector world cross-references stay).
- Length limits (the validator checks them); zh/en agree; names spelled the same everywhere.

## Report back (≤ 15 lines)
Birth scene idea in one line; node ids and the fork structure (which choices → which origin); the 3 start nodes you gave `alt`; any existing line you fixed; validator result for the route; anything you could not make coherent.
