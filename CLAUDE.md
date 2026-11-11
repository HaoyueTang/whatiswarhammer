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
- Factions: v0.1 Imperium/Chaos/T'au, v0.2 + Aeldari (boss: Keeper of Secrets) & Necrons (boss: Nightbringer shard); each has 3 origins (§16).
- 3 factions v0.1: Imperium (boss: Abaddon's Black Crusade), Chaos (boss: Grey Knights + Inquisitor), T'au (boss: Swarmlord).
- Stats 0–100: hp, sanity, corruption, renown (faction-labelled). Death at hp 0 / sanity 0 / corruption 100. Origins set per-run hp/sanity caps (70–130) as trade-offs (§23).
- Death rates are NOT equalised across routes — lore decides (Howie: Imperium dying more is normal; a Guardsman's life is cheap). Balance only within a route (origins ±6 pts of route avg).
- Lore shown through NPC behaviour; node text ≤ 90 zh chars; codex entries ≤ 45 zh chars.
- IP: original prose; original pixel archetypes; no likeness of named canon characters (use `omen_*` images); no GW logos/icons. Fan-made, non-commercial; disclaimer in footer.
- Saves: localStorage, 3 slots + autosave + JSON export/import, schema-versioned.
- Audio: original procedural chiptune via WebAudio (`src/js/audio.js`), mood auto-picked per node; real CC0 files can override via `assets/audio/files.js`.
- Lore cards pop up on first codex unlock (skippable / can be turned off); codex names are linked in dialogue; ending lists chaos gods met.

## Commands
- Validate data + simulate runs: `node tools/dev/validate.js`
- Regenerate art: `python3 tools/art/build_all.py`
- Play: open `index.html` in a browser.
- Audition music/SFX: open `tools/dev/audio_test.html`.

## Status
- v0.2.3 released 2026-11-11 — + claim endings (0.2.1), rumours/Chronicle, Tzeentch egg, origin caps, progress preservation (0.2.2), skull difficulty (0.2.3).
- v0.2.0 released 2026-11-11 — 5 routes (Imperium, Chaos, T'au, Aeldari, Necrons) × 3 origins, consequence panel, codex v2 (race × type, search, NEW), hidden chaos-god taint, lore-card modes, Home button, faction-stat tips. v0.1.0 same day.
- Repo: https://github.com/HaoyueTang/whatiswarhammer — `dev` = full project (work here); `main` = public build (game files + `release/README.public.md` as README only). Release: commit on dev → `python3 release/build_public.py HEAD /tmp/pub` → copy over a `main` checkout (keep .git) → commit "release: public build from dev@<sha>" → push both. Before releasing: `node tools/dev/validate.js --write-difficulty` (regenerates data/difficulty.js) and bump WH.VERSION + CHANGELOG. Local copy F:\whatiswarhammer is synced from committed HEAD (`git archive` zip → `.sync/apply.py`, which never overwrites user files: assets/audio/files.js, *.local.*, saves/, user/, logs/, user audio).
- Playable artifact (claude.ai, private until shared): https://claude.ai/artifact/7942AX8AQExvMP1m2GHLFF (slug 31b6a4af-a17b-40de-ac8a-760f81d565f6) — republish runtime files (index.html, src/, data/, assets/) on each release; JSON export download is blocked inside artifacts.
- Quality gates: `node tools/dev/validate.js` (0 errors), `python3 tools/dev/smoke_test.py [--real]`, `node tools/dev/audio_check.js`.
- Known: music verified only by automated checks — needs a human listen (`tools/dev/audio_test.html`).

## Next ideas
- Orks, Genestealer Cult, Adeptus Mechanicus routes; achievements.
- Artifact link is publicly shared → republishing needs the user's explicit OK each time.
