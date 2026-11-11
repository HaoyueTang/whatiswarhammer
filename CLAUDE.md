# CLAUDE.md — Project memory

Read this first in every session on this project. Keep it short and current; history goes to `docs/DEVLOG.md`.

## What
- 什么是战锤 / What is Warhammer? — bilingual (中/EN) pixel-art text adventure teaching WH40K lore.
- Player = ordinary human; picks a faction; ~1 h per route; learns leaders, main enemies, final boss.
- Owner: Howie. Started 2026-11-11. Local folder: `F:\whatiswarhammer`.

## Contract
- Full design + data schema: `docs/SPEC.md` (single source of truth).
- Shared registry API: `src/js/registry.js` — don't change without updating SPEC.
- Runs from `file://` — plain `<script>` tags, no fetch, no build step, no CDN.

## Layout / ownership
- `data/**` story text, codex, events (text role)
- `assets/**`, `tools/art/**` pixel art + its python generators (art role)
- `index.html`, `src/**`, `tools/dev/**` engine, UI, saves, validator (web role)
- `src/js/audio.js`, `assets/audio/**`, `tools/dev/audio_test.html` music + SFX (audio role)

## Decisions
- 3 factions v0.1: Imperium (boss: Abaddon's Black Crusade), Chaos (boss: Grey Knights + Inquisitor), T'au (boss: Swarmlord).
- Stats 0–100: hp, sanity, corruption, renown (faction-labelled). Death at hp 0 / sanity 0 / corruption 100.
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
- v0.1.0 released 2026-11-11 — all 3 routes playable end to end, codex (entries/places/endings/records), saves, music.
- Repo: https://github.com/HaoyueTang/whatiswarhammer (branch `main`). Local copy F:\whatiswarhammer is synced from the build workspace.
- Quality gates: `node tools/dev/validate.js` (0 errors), `python3 tools/dev/smoke_test.py [--real]`, `node tools/dev/audio_check.js`.
- Known: music verified only by automated checks — needs a human listen (`tools/dev/audio_test.html`).

## Next ideas
- More factions (Aeldari, Necrons, Adeptus Mechanicus), sound, achievements.
