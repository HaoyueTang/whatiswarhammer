# QA reader brief (story overhaul v0.4.0, read-through pass)

You are an Opus **QA reader** for 《什么是战锤 / What is Warhammer?》 (bilingual pixel-art WH40K text adventure). One route was just rewritten by another Opus author to satisfy SPEC §32 (every choice has consequences, bridges between chapters, `alt` text, gather places…). The owner (Howie, Chinese-speaking) complained that the story logic was weak and jumped too much. Your job: **read the route as a player would, find logic/continuity defects, and fix the unambiguous ones in place.** Project root `/home/claude/whatiswarhammer`. No git. Report in 中文.

## Read first
`CLAUDE.md`, `docs/SPEC.md` §3, §32 (rules 1–15), §28 (grudges), §27 (shared sector/dates), `docs/audit/plan_<route>.md` (the author's plan and result notes), `docs/audit/ENGINE_READY.md`.

## How to read
- Play runs with `node tools/dev/playthrough.js <route> --seed N --origin <id|index> [--stats] [--flags] [--en] [--first|--last]` (prints node text with `alt`/grudge lines resolved, choices, the picked choice and its result, events, rumours). **Do at least 12 runs per route**: every origin × (random seeds, `--first`, `--last`), plus a few with `--en` (check the English reads right and matches the Chinese). Play different choices at the branching points so you see different consequence nodes. Use `--flags` to see what the player has when a node's text assumes something.
- Also read `node tools/dev/route_graph.js --faction <route>` (MUST/MAY flags per node) and the unvisited / rarely visited nodes: open `data/factions/<route>.js` and read any node you never saw in the runs (new bridge nodes, new endings, death/claim nodes, all `alt` entries).

## What to look for (defects)
1. **Continuity of people**: someone referenced before being introduced; a person who is dead/left/not present speaking or being addressed; a name spelled differently (zh or en) or a title/rank changing; a pronoun that points at the wrong person; two different people sharing a name.
2. **Continuity of place/time**: the scene/place changes without explanation; "next morning/three days later" vs the `time` field; day counts that do not add up across nodes; wrong season/hour; in-world dates inconsistent with SPEC §27.
3. **Choice → result**: the node after a choice does not follow from it (the result line says one thing, the next node assumes another); a choice whose label promises something the result/next node ignores; an option that is available when it should not be (e.g. "ask about X" when the player never met X) or not available when it should.
4. **Assumed facts**: node text/`alt`/result that assumes a flag or fact the player on this path may not have (check MAY vs MUST with route_graph) — fix with neutral wording, `alt`, or `require`.
5. **Alt/result stacking**: when 2 `alt.add` paragraphs and the base text are shown together, do they read as one coherent narration (no repeated information, no contradictions, no duplicated sentence)? Same for `grudgeLine` + alt.
6. **Endings**: does the ending text fit the paths that can reach it (origin, earlier key choices)? Does the cause/title agree with the text? Death/claim endings reached from different chapters read sensibly.
7. **Language**: zh typos, awkward machine-like phrasing, zh/en mismatch in meaning, English grammar errors, over-length (zh node text ≤ 90 chars, alt.add ≤ 45, choice label ≤ 24 — the validator flags those).
8. **Lore accuracy**: wrong canon facts (titles, factions, world names, events) — verify with Lexicanum / Warhammer Community via WebSearch/WebFetch before changing; if canon is vague make the text vague.
9. **Tone/quality**: still the same funny-dark-lore-teaching voice; no placeholder text, no meta talk; lore shown through what NPCs do.

## What you may change
- **Fix directly** (targeted Edits in `data/factions/<route>.js`, your route's `evt_*` entries and codex/rumour entries): typos, wrong/misspelled names, missing introductions (add a clause), contradictions, wrong `time`/`scene`, unclear pronouns, repeated sentences, zh/en mismatches, missing `alt` to carry a choice forward, a result line that does not match its next node, lore errors. Keep every node id, flag name, ending id/title, origin, `npcs`; keep node count ≤ 145; keep text length limits.
- **Do not** restructure the plot, delete nodes, change balance (`effects` numbers, roll chances, require thresholds) unless a defect is clearly caused by them (e.g. a choice that can never be taken) — and then say so in the report. If you see a structural problem you cannot fix with a text edit, list it in the report instead.
- Do not touch other routes, `src/**`, `tools/**` (except reading), `assets/**`, shared events/rumour files (another agent is editing `data/events.js`, `data/events_lore.js`, `data/rumors.js`, `data/events_taint.js` shared parts right now: list problems you find there in your report), `docs/SPEC.md`, `CLAUDE.md`.

## Gates (run after your last edit, and after each batch of >10 edits)
`node tools/dev/validate.js --faction <route> --allow-missing-ending-art --story-gate` → 0 errors (note the baseline numbers first: death rate, claim rate, good-ending share, gather count — your text edits must not change them); `node tools/dev/route_graph.js --faction <route> --checks-only` → no ERROR/WARN; `node tools/dev/date_audit.js` → 0 anachronisms.

## Report (中文, ≤ 400 words) and record
Write `docs/audit/qa_<route>.md` (the defect log: node id · category · what was wrong · what you changed / why not) and send a short report: runs read (count, origins), defects found by category (n fixed / n listed), the 5 worst problems found and how they were fixed, anything structural you did not fix, shared-file problems for the lead, lore doubts, and your honest overall judgement of the route's flow (is it still "jumpy"? where?).
