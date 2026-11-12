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
- v0.3.2 (2026-11-12) — grudges (§28): hurting a named NPC sets `wronged_<id>`; later choices where that person is *present* (validator-enforced) get ⚠ + lower roll chance / extra cost; all 8 routes, +0.3–1.9 pts death. v0.3.1 — UI "种族" → "势力" (data key `race` unchanged); `tools/dev/date_audit.js` (text dates vs clock: all consistent).
- v0.3.0 released 2026-11-12 — + 3 routes (Orks, Genestealer Cult, Mechanicus; 8 total, 24 origins), 60 achievements (§25), Arcosa Sector echoes (§27), relevance-gated rumours (§20b), music/art for new routes. Gates: validate 0 errors; smoke --real 129/129; audio_check OK.
- v0.2.3 released 2026-11-11 — + claim endings (0.2.1), rumours/Chronicle, Tzeentch egg, origin caps, progress preservation (0.2.2), skull difficulty (0.2.3).
- v0.2.0 released 2026-11-11 — 5 routes (Imperium, Chaos, T'au, Aeldari, Necrons) × 3 origins, consequence panel, codex v2 (race × type, search, NEW), hidden chaos-god taint, lore-card modes, Home button, faction-stat tips. v0.1.0 same day.
- Repo: https://github.com/HaoyueTang/whatiswarhammer — `dev` = full project (work here); `main` = public build (game files + `release/README.public.md` as README only). Release: commit on dev → `python3 release/build_public.py HEAD /tmp/pub` → copy over a `main` checkout (keep .git) → commit "release: public build from dev@<sha>" → push both. Before releasing: `node tools/dev/validate.js --write-difficulty` (regenerates data/difficulty.js) and bump WH.VERSION + CHANGELOG. Local copy F:\whatiswarhammer is synced from committed HEAD (`git archive` zip → `.sync/apply.py`, which never overwrites user files: assets/audio/files.js, *.local.*, saves/, user/, logs/, user audio).
- Playable artifact (claude.ai, private until shared): https://claude.ai/artifact/7942AX8AQExvMP1m2GHLFF (slug 31b6a4af-a17b-40de-ac8a-760f81d565f6; v0.3.0 live since 2026-11-12, version 1794470553-f20e, title still says "v0.1") — republish runtime files (index.html, src/, data/, assets/) on each release; JSON export download is blocked inside artifacts.
- Quality gates: `node tools/dev/validate.js` (0 errors), `python3 tools/dev/smoke_test.py [--real]`, `node tools/dev/audio_check.js`.
- Known: music verified only by automated checks — needs a human listen (`tools/dev/audio_test.html`).

## Next ideas
- More routes; optional non-human origins / xenos-POV routes (Howie chose UI rename 种族→势力 only, 2026-11-12); GitHub Pages; human listen to music.
- Artifact link is publicly shared → republishing needs the user's explicit OK each time (v0.3.0 republish OK'd by Howie on 2026-11-12: "继续以后更新到artifact").
