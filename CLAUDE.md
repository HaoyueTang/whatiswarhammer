# CLAUDE.md — Project memory

Read this first in every session on this project. Keep it short and current; history goes to `docs/DEVLOG.md`.

## What
- 什么是战锤 / What is Warhammer? — bilingual (中/EN) pixel-art text adventure teaching WH40K lore.
- Player = ordinary human; picks a faction; ~1 h per route; learns leaders, main enemies, final boss.
- Owner: Howie. Started 2026-11-11. Local folder: `F:\whatiswarhammer`.

## Contract
- Full design + data schema: `docs/SPEC.md` (single source of truth).
- Lessons learned from v0.1: `docs/LESSONS-v0.1.md`.
- Shared registry API: `src/js/registry.js` — don't change without updating SPEC.
- Runs from `file://` — plain `<script>` tags, no fetch, no build step, no CDN.

## Layout / ownership
- `data/**` story text, codex, events (text role)
- `assets/**`, `tools/art/**` pixel art + its python generators (art role)
- `index.html`, `src/**`, `tools/dev/**` engine, UI, saves, validator (web role)
- `src/js/audio.js`, `assets/audio/**`, `tools/dev/audio_test.html` music + SFX (audio role)

## Decisions
- Factions: v0.1 Imperium/Chaos/T'au, v0.2 + Aeldari (boss: Keeper of Secrets) & Necrons (boss: Nightbringer shard), v0.3 + Orks (Iskaron), Genestealer Cult (Kessin Tertius), Adeptus Mechanicus (Gravex); each has 3 origins (§16, §26). All 8 share the original Arcosa Sector (111–115.M42, §27): home worlds cross-reference, and a run can overhear a past-life death echo (≤1/run, 15%, can be turned off).
- 3 factions v0.1: Imperium (boss: Abaddon's Black Crusade), Chaos (boss: Grey Knights + Inquisitor), T'au (boss: Swarmlord).
- Stats 0–100: hp, sanity, corruption, renown (faction-labelled). Death at hp 0 / sanity 0 / corruption 100. Origins set per-run hp/sanity caps (70–130) as trade-offs (§23).
- Death rates are NOT equalised across routes — lore decides (Howie: Imperium dying more is normal; a Guardsman's life is cheap). Balance only within a route (origins ±6 pts of route avg).
- Lore shown through NPC behaviour; node text ≤ 90 zh chars; codex entries ≤ 45 zh chars.
- IP: original prose; original pixel archetypes; no likeness of named canon characters (use `omen_*` images); no GW logos/icons. Fan-made, non-commercial; disclaimer in footer.
- Saves: localStorage, 3 slots + autosave + JSON export/import, schema-versioned.
- Audio: original procedural chiptune via WebAudio (`src/js/audio.js`), mood auto-picked per node; real CC0 files can override via `assets/audio/files.js`.
- Grudges (§28): only when the person is really in the scene (name in zh+en text / speaker sprite / `grudgeLine`); never before the harm; route death rate may rise ≤3 pts; effects are harmful-only. Howie's rule: context must be coherent first.
- Lore cards pop up on first codex unlock (skippable / can be turned off); codex names are linked in dialogue; ending lists chaos gods met.

## Commands
- Validate data + simulate runs: `node tools/dev/validate.js`
- Regenerate art: `python3 tools/art/build_all.py`
- Play: open `index.html` in a browser.
- Text dates vs game clock: `node tools/dev/date_audit.js [--all]`.
- Audition music/SFX: open `tools/dev/audio_test.html`.

## Status
- v0.4.0 PREVIEW (2026-11-13, dev only — not yet on GitHub `main`): story overhaul of all 8 routes (§32: alt/resultAlt text, bridge/jump nodes, event `where`, no forced chapter steps; 131 endings), ending-art UI (§31) with only 47/131 pictures drawn (gsc 18, orks 13 done; the other 6 routes' art agents are scheduled for 23:00 Berlin — others fall back to the node scene, use `validate.js --allow-missing-ending-art` until done), track selection (§29b), rumours/echoes only at gather nodes (§20c), opening "do you know Warhammer?" dialog + `keywordLinks` setting (§33), cloud save mirror (§34). Gates for the preview: validate 0 errors (35 warn), smoke --real 407/407, audio_check OK. Smoke harness: tests wipe storage with `CLEAR` (sets loreAsked) — never use add_init_script that touches localStorage (it raced with page.reload()). Tools: `node tools/dev/playthrough.js <faction> [--seed N]`, `smoke_test.py --only-fam|--only-v040`. Final release still needs: remaining 84 ending pictures, strict `--check-endings`, README.public.md, `build_public.py`, push dev+main.
- v0.3.3 (2026-11-12) — music styles (§29: chip default + dark/organ/synth/piano, Settings → 配乐风格, ▶ preview; procedural, verified by measurement only — needs a human listen) + optional rewind (§30: Settings → 允许回到上一个选择, default off, ↶ button / hotkey Z, restores full engine state incl. RNG so no re-rolling; knowledge not rewound; run records carry `rewinds`; 5 clean-run achievements ignore rewound runs). Known: `deaths`/`runs` counters can be inflated by rewinding out of an ending.
- v0.3.2 (2026-11-12) — grudges (§28): hurting a named NPC sets `wronged_<id>`; later choices where that person is *present* (validator-enforced) get ⚠ + lower roll chance / extra cost; all 8 routes, +0.3–1.9 pts death. v0.3.1 — UI "种族" → "势力" (data key `race` unchanged); `tools/dev/date_audit.js` (text dates vs clock: all consistent).
- v0.3.0 released 2026-11-12 — + 3 routes (Orks, Genestealer Cult, Mechanicus; 8 total, 24 origins), 60 achievements (§25), Arcosa Sector echoes (§27), relevance-gated rumours (§20b), music/art for new routes. Gates: validate 0 errors; smoke --real 129/129; audio_check OK.
- v0.2.3 released 2026-11-11 — + claim endings (0.2.1), rumours/Chronicle, Tzeentch egg, origin caps, progress preservation (0.2.2), skull difficulty (0.2.3).
- v0.2.0 released 2026-11-11 — 5 routes (Imperium, Chaos, T'au, Aeldari, Necrons) × 3 origins, consequence panel, codex v2 (race × type, search, NEW), hidden chaos-god taint, lore-card modes, Home button, faction-stat tips. v0.1.0 same day.
- Repo: https://github.com/HaoyueTang/whatiswarhammer — `dev` = full project (work here); `main` = public build (game files + `release/README.public.md` as README only). Release: commit on dev → `python3 release/build_public.py HEAD /tmp/pub` → copy over a `main` checkout (keep .git) → commit "release: public build from dev@<sha>" → push both. Before releasing: `node tools/dev/validate.js --write-difficulty` (regenerates data/difficulty.js) and bump WH.VERSION + CHANGELOG. Local copy F:\whatiswarhammer is synced from committed HEAD (`git archive` zip → `.sync/apply.py`, which never overwrites user files: assets/audio/files.js, *.local.*, saves/, user/, logs/, user audio).
- Playable artifact (claude.ai, **PRIVATE since 2026-11-13** — owner-only, because the tool refuses `db` on public artifacts): https://claude.ai/artifact/7942AX8AQExvMP1m2GHLFF (slug 31b6a4af-a17b-40de-ac8a-760f81d565f6; **v0.4.0 preview + cloud save (§34) live since 2026-11-13**, version 1794587944-41aa, 233 files, declares `{db:{},user:{}}`, title still says "v0.1"; 47/131 ending pictures). Cloud save mirrors saves/codex/records/settings to `data/users/<id>/sv_*` for the owner (Settings → 云端存档 shows state; first run after the switch has nothing in the cloud yet, so progress made in the old public version stays only in that browser). Republish runtime files (index.html, src/, data/, assets/) on each release (stage in /home/claude/artifact_pub, `publish_files` patch of changed files; only declare/publish when read is not public); JSON export download is blocked inside artifacts. The old public link no longer works — if Howie wants a public demo again it must be a separate public artifact without db.
- Local sync: do NOT send/sync the bundle zip to Howie unless he asks (2026-11-12).
- Quality gates: `node tools/dev/validate.js` (0 errors), `python3 tools/dev/smoke_test.py [--real]`, `node tools/dev/audio_check.js`.
- Known: music verified only by automated checks — needs a human listen (`tools/dev/audio_test.html`).

## Next ideas
- More routes; optional non-human origins / xenos-POV routes (Howie chose UI rename 种族→势力 only, 2026-11-12); GitHub Pages; human listen to music.
- Artifact link is publicly shared → republishing needs the user's explicit OK each time (v0.3.0 republish OK'd by Howie on 2026-11-12: "继续以后更新到artifact").
