# assets/audio — optional music files

By default the game uses no audio files. `src/js/audio.js` composes and synthesizes all music (16 original 16-bit-style chiptune loops) and every sound effect live with the Web Audio API.

You can replace any mood with a real track. If a file is missing or fails to load, that mood falls back to the synth.

## How to add tracks

1. Put the files in this folder. Use `.ogg` (best looping) or `.mp3`. Keep each one under about 3 MB.
2. Map each mood to its file in `assets/audio/files.js`. Paths are relative to `index.html`:

   ```js
   WH.audioFiles = {
     title:  "assets/audio/title.ogg",
     battle: "assets/audio/battle.ogg"
   };
   ```
3. Reload `index.html`. Moods you leave out keep the synth.

You can audition every mood in `tools/dev/audio_test.html`.

## Moods (suggested filenames)

| mood | file | used for |
|---|---|---|
| `title` | `title.ogg` | title + faction select (gothic, mysterious, organ) |
| `calm` | `calm.ogg` | default story scenes (soothing) |
| `holy` | `holy.ogg` | `cathedral`, `throne_light` scenes (choir, cathedral) |
| `tense` | `tense.ogg` | `trench`, `burning_city`, `ruins`, `spore_sky`, or sanity < 30 (suspense) |
| `battle` | `battle.ogg` | any node with a `foe` (driving, minor key) |
| `boss` | `boss.ogg` | boss-class foes (incl. `greater_daemon_slaanesh`, `wraith_construct`, `necron_lord`, `canoptek_spyder`, `ork_nob`, `gsc_patriarch`, `gsc_primus`, `daemon_engine`, `kastelan_robot`, `dark_mechanicus`) and `omen_*` foes (heavier, faster) |
| `warp` | `warp.ogg` | `warp`, `daemon_world`, `cult_shrine` scenes and chaos events (eerie, unstable) |
| `tau` | `tau.ogg` | `tau_city`, `tau_outpost` scenes and the T'au route (clean, hopeful sci-fi) |
| `aeldari` | `aeldari.ogg` | `craftworld`, `webway`, `maiden_world` scenes and the Aeldari route (ethereal, harp-like arpeggios, slow, modal) |
| `necron` | `necron.ogg` | `tomb_exterior`, `tomb_interior`, `stasis_gallery`, `dig_site` scenes and the Necron route (cold, mechanical, low drones) |
| `orks` | `orks.ogg` | `ork_scrapyard`, `ork_fort` scenes and the Ork route (rowdy, stompy, brassy square leads, big toms, 130–150 bpm) |
| `gsc` | `gsc.ogg` | `mine_shaft`, `gsc_chapel` scenes and the Genestealer Cult route (a hymn gone wrong: organ, flattened intervals, insect clicks, 60–72 bpm) |
| `mechanicus` | `mechanicus.ogg` | `forge_floor`, `mars_vista`, `tech_vault` scenes and the Mechanicus route (binary chant, data ostinato, choir pad, anvil hits, 90–104 bpm) |
| `happy` | `happy.ogg` | good endings (victory, major key) |
| `death` | `death.ogg` | death endings (short sad phrase, then near silence) |
| `bad` | `bad.ogg` | bad endings (bleak) |

## Licence rules

- Use only **CC0 / public-domain** tracks, or tracks you made yourself. CC-BY is fine too if you credit the author in `README.md` and in the in-game footer.
- Do **not** use music ripped from Games Workshop games, films or other commercial games.
- Note each file's source and licence below.

| file | author | source URL | licence |
|---|---|---|---|
| _(none yet)_ | | | |

## Technical notes

- Files play through a looping `<audio>` element. Crossfades use `element.volume` because a `file://` page can't route media elements into Web Audio. Music volume and mute still apply.
- The loop point is the end of the file. For a seamless loop, trim the file so the end flows into the start.
- Browsers block sound until the first click or keypress. The game unlocks audio on the first gesture.
