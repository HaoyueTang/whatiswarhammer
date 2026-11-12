# Route writer brief (story overhaul v0.4.0)

You are an Opus **route writer** on 《什么是战锤 / What is Warhammer?》 — a bilingual (中/EN) pixel-art text adventure that teaches Warhammer 40,000 lore. The player is an ordinary human who picks a faction; each route is ~1 h; the player learns the faction's leaders, main enemies and final boss through what the NPCs *do*. Project root: `/home/claude/whatiswarhammer`. The owner (Howie) is Chinese-speaking: your final report is in 中文; story text is bilingual `{zh, en}`.

## Why this job exists
Howie's feedback (2026-11-12): "大修故事线 现在逻辑性不够用" and "故事线需要更多衔接 现在跳的很厉害 不同选项没有后续结果直接强制下一个阶段了". An audit of your route (`docs/audit/<route>.md`, plus `docs/audit/digest_<route>.md` = full text dump with data-flow, `docs/audit/convergence_<route>.md` = metrics) found: many choices that all lead to the same next node (false choices), choices without their own follow-up, forced chapter steps (a node whose only way out jumps to the next chapter), hard jumps in place/time/people, flags set and never read, text that assumes facts a player on another path never saw. You rewrite the route so every choice matters and the story flows.

## Read first (in this order)
1. `CLAUDE.md` (project memory, short).
2. `docs/SPEC.md` — **§32 (your contract)**, §3 (node/choice schema), §5 (events), §11/§16/§23/§26 (origins & balance), §17–§19 (renown help, taint, claim endings), §20c (gather nodes), §27 (shared Arcosa Sector, dates), §28 (grudges). Skim the rest as needed.
3. **Your audit `docs/audit/<route>.md`** — the defect list (category "选项后续/衔接" first), the per-false-choice fixes, the bridging scenes B1…, the gathering-place proposals, the overhaul plan. Treat it as the work list, but you are the author: where you see a better fix, take it (keep §32 rules).
4. Your route file `data/factions/<route>.js` in full, and `node tools/dev/route_graph.js --faction <route>` output (MUST/MAY flags per node). Look at one other route's file for style only if you need it.

## Deliverable
A rewritten `data/factions/<route>.js` (same file, same registration call) that satisfies every rule of SPEC §32.1 (the 15 rules) — in particular:
- No cosmetic choices: every multi-choice node sends choices to different targets, or sets different flags that are read later (`require`, roll gate, `alt`, `resultAlt`, `grudge`, event `where`). Each branching choice gets its own 1–3-node consequence before branches re-merge.
- Bridges between chapters (`bridge:true` nodes that say where/when/why/who is present and carry over the previous choice with `alt`). No forced chapter steps. Justified jumps carry `jump:{zh,en}`.
- Memory: set flags get read; important past choices visibly echo (alt lines, changed options/rolls/endings).
- Text only assumes what is guaranteed on arrival (use `route_graph.js`; fix with neutral wording, `require`, or `alt` on the flag/origin). Shared nodes never contradict any origin (`alt` on `origin_<id>`).
- ≥ 8 gather nodes (§20c) in ≥ 6 chapters, label contained in zh and en text, other people present; never on endings/death/eventRoll nodes.
- Per-route size 80–145 nodes, typical run 52–68 nodes; node text ≤ 90 zh chars, `alt.add` ≤ 45 zh, choice labels ≤ 24 zh, codex entries ≤ 45 zh chars.
- Events: use `where` (scenes/nodes/chapter/flags) on your route events (`evt_t_<prefix>_*` in `data/events_taint.js`, route events in the faction file) so none fires where it contradicts the scene; put `eventRoll` only on nodes where at least one event fits.
- Endings: believable gates (`require` on the last decisive choices); existing endings keep their ids/titles/kinds; **new endings allowed: ≤ 2** (id `<prefix>end_<slug>`, with `ending.kind/title/cause`); death/claim nodes location-neutral or varied with `alt` on `fromChapter`/`fromScene`/`fromNode`.
- Balance: random-play death rate within ±6 pts of the v0.3.3 value in `data/difficulty.js`; origins within ±6 of the route average (§23); claim-ending rates inside their bands (§26 table / §18); good-ending share ≥ 22 % in random play (a drop from today is expected); every ending reachable; grudge budgets (§28: route death rate may rise ≤ 3 pts from grudges; harmful-only effects; person must really be present).

## Keep stable (saves, other systems depend on them)
Faction `id`, `prefix`, origin ids and `startNode`s, `deathNodes`, claim goto nodes, existing flag **names** (you may stop setting/reading one, never rename), `npcs` ids, existing ending ids/titles, achievement-referenced flags/endings (`data/achievements.js` — grep your faction id and your flag names), codex ids referenced by other files. Spine node ids stay unless you merge them — **list every removed or renamed id in your report** (the engine falls back to the chapter start for old saves). New node ids: use your route's existing id style; no collisions across routes.

## Tools / gates (run per chapter while writing, all before finishing)
- `node tools/dev/validate.js --faction <route>` — must end with 0 errors (it also simulates runs: death rates, claim rates, endings reachability, origin balance, grudge rules, text lengths, date consistency). New §32 checks (`alt`, `where`, `--story-report`, `--story-gate`) are being built by a parallel web agent: the file `docs/audit/ENGINE_READY.md` appears when they are live. Until then you can still write `alt`/`resultAlt`/`where`/`bridge`/`jump`/`gather` fields per the spec — the validator ignores fields it does not know; when ENGINE_READY.md exists, re-run everything and fix what it reports. Run `node tools/dev/validate.js --story-report --faction <route>` and `--story-gate` at the end.
- `node tools/dev/route_converge.js --faction <route>` (false choices, shallow branches, forced steps, hard jumps — aim: all zero/inside §32 limits).
- `node tools/dev/route_graph.js --faction <route>` (no ERROR/WARN; read INFO lines about MAY flags).
- `node tools/dev/date_audit.js` (text dates vs the game clock).
- Smoke of the real data: `python3 tools/dev/smoke_test.py --real --only-faction <route>` if that option exists (check `--help`/source); otherwise skip — the lead runs the full smoke.
- Do not run `--write-difficulty` (the lead does it at the end).

## Working method (long job — work in stages and keep the file loadable)
1. Read everything above; write a short plan for yourself at the top of your working notes (in `docs/audit/plan_<route>.md`; keep it, it is part of the record): spine per chapter, the bridge scenes, which choices become real branches, new nodes with ids, gather nodes, the new/changed events, flags to read, new endings if any.
2. Rewrite **chapter by chapter** with targeted Edits (the file is 120–160 KB: never regenerate it wholesale in one go; never leave it syntactically broken — run `node -e` load check or the validator after each chapter). Start with the chapters that have the worst defects.
3. Keep prose quality high and original (no copying of GW text); lore shown through NPC behaviour; tone as in the existing route; zh first, en faithful (not word-by-word), both within limits. Every new person is introduced before use; names spelled identically everywhere (zh and en).
4. Cheap patterns that make real branches: (a) split-and-rejoin with distinct 1–2-node follow-ups that set different flags; (b) `require`-gated options on earlier flags/stats; (c) `alt` lines on the rejoin node that echo which branch you took; (d) `resultAlt` for outcomes depending on earlier flags; (e) different targets for roll success/fail with their own consequences; (f) a choice that opens/closes a later ending path.
5. Verify the lore against canon with WebSearch/WebFetch (Lexicanum, Warhammer Community) for any fact you add or change; where canon is vague, be vague. In-world dates: the Arcosa Sector window 111–115.M42 (§27); Great Rift open (999.M41); Indomitus Crusade under way. Necron stasis jumps may leave the window (flag `time.warp`).
6. Shared files (`data/events.js`, `data/events_lore.js`, `data/events_taint.js`, `data/rumors.js`, `data/codex*.js`, `data/achievements.js`): small targeted Edits only, only for what your route needs (your own `evt_t_<prefix>_*` events, your route's rumours — re-wording so they read as crowd talk, marking `when` — and your codex entries). Do **not** change other routes' content, `src/**`, `tools/**`, `assets/**`, `CLAUDE.md`, `docs/SPEC.md` (report spec problems instead). Other agents are editing `src/**`, `tools/dev/validate.js` and other routes' files at the same time: do not touch them, re-read a file region just before editing a shared one.
7. No git (the lead commits).

## Final report (中文, ≤ 450 words)
Nodes before → after; multi-choice nodes; false-choice % before → after; shallow %; forced chapter steps; hard jumps (unjustified); never-read flags; gather nodes (count, chapters); typical run length (median); death rate before → after (route + each origin); claim rates; good-ending share; new endings (ids, titles, how reached); removed/renamed node ids; flags no longer set/read; events changed; codex/rumour changes; open issues / things you were unsure about / lore doubts; anything in SPEC §32 that did not work out.

---
## Updates from wave 1 (imperium, chaos finished; read before you start)
- **Gate command**: `node tools/dev/validate.js --faction <route> --allow-missing-ending-art --story-gate` (the art flag silences ~118 "no ending picture yet" errors — expected, not yours). Engine features are live (`docs/audit/ENGINE_READY.md` — read it for definitions). If validate says the endings brief is stale after you add/remove an ending, run `node tools/dev/dump_endings.js`.
- **Shallow branches**: the metric is being redefined by the engine agent — a branch that re-merges after one own node but sets DIFFERENT flags read later (alt/require/roll/grudge/where/ending) is not shallow. Do not add nodes to chase the old "70 % shallow" warning, never exceed 145 nodes for it. Prefer (a) split with distinct flags that are really read, (b) 1–2 own nodes for the branches that matter most.
- `alt` shows at most 2 matching `add` paragraphs; more than 2 `add` entries with mutually exclusive conditions are fine (a NOTE).
- A node where **every** choice has `require`/`hideIfLocked` must have an **exhaustive partition** (e.g. flag / notFlag; stat max 59 / min 60) so a player can never see zero options; keep at least one unconditional or catch-all choice where practical (validator warns "possible softlock").
- `resultAlt` does not override a roll's own `rollResult`. A node has ≤ 4 choices; `require` has no OR (use `alt` / separate choices / `hideIfLocked`).
- Gather scene check: the validator warns when a gather node sits in a storm/solitude/tomb scene — choose a scene that fits (a market in `daemon_world` was accepted once; avoid it when a crowd scene exists).
- Smoke tests have no per-route option; the lead runs them at the end.
- Wave 1 numbers for calibration: imperium 109→128 nodes, chaos 111→135; false-choice 43/59 %→0 %; forced steps →0; never-read flags →0; 10–13 gather nodes; median run 55–58; death rate unchanged within 0.6 pts. You should land in the same range.
