# TODO

Open items and decisions waiting on Howie. Newest decisions at the top of each section.

## Decisions pending
- [ ] **Race vs. origin (种族)** — the player is always an ordinary human; the "种族" screen really picks the side you are drawn into. Options:
  1. Rename "选择种族" → "选择势力 / 阵营" (UI only).
  2. Rename + add lore-compatible non-human origins that merge into existing spines: Imperium Ogryn / Ratling (abhumans), Chaos mutant, T'au Kroot hunter. *(recommended)*
  3. True xenos perspective routes (play a Fire Warrior, an Aeldari Guardian, a Necron with residual memories) — each a full new route, since shared text assumes a human player.
- [ ] **Public artifact link** — publicly shared, so each republish needs Howie's explicit OK ("更新公开链接").
- [ ] **GitHub Pages** — enable in repo Settings → Pages (main, root) or ask Claude to try via API.

## Planned
- [ ] Route difficulty contrast (#23 follow-up, kept as-is for now — Howie 2026-11-11): optional later
  - Imperium harsher: raise front-line damage (trench, Black Crusade chapters) so random-play death ≈ 35–40%, careful play still survives.
  - Aeldari & T'au safer: random-play death ≈ 15–20% to sharpen the contrast between routes.
- [ ] v0.2.2 — difficulty icons on race and origin cards (SPEC §24). *(in progress)*
- [ ] v0.2.2 — lore clues for veterans (SPEC §20): rumours, lore events, 战史 / Chronicle timeline. *(in progress)*
- [ ] v0.2.2 — Tzeentch collection easter egg (SPEC §21). *(in progress)*
- [ ] v0.2.2 — updates never touch local progress; full backup export/import (SPEC §22). *(in progress)*
- [ ] Orks route; Genestealer Cult route; Adeptus Mechanicus.
- [ ] Achievements.
- [ ] Human listen-through of the music (`tools/dev/audio_test.html`); retune moods that grate.
- [ ] Art polish: craftworld towers, tomb_interior glow.

## Done
- [x] v0.2.1 — 20 claim endings, per-route taintMod, claim rates in target bands.
- [x] v0.2.0 — Aeldari & Necron routes, race → origin, consequences, codex v2, hidden taint, lore-card modes, Home button, stat tips.
- [x] v0.1.0 — 3 routes, codex, saves, music.
