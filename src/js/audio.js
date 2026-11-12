/* audio.js — procedural 16-bit chiptune music + synthesized SFX. Owned by: audio role.
 *
 * Public API (WH.Audio) — see docs/DEVLOG.md "audio" entry for where to call what:
 *   unlock()                      call inside the first user gesture (creates/resumes the AudioContext)
 *   setMood(mood, {fade:ms, force:bool})   crossfade to a mood; same mood = no-op; calm-type moods obey an 8 s hysteresis
 *   stop({fade:ms})               fade the music out
 *   sfx(name)                     one-shot synthesized sound effect (see SFX_NAMES)
 *   setMusicVolume(0..1) / setSfxVolume(0..1) / getMusicVolume() / getSfxVolume()
 *   mute(bool) / isMuted()        mute is remembered in localStorage "whatiswh.audio"
 *   moodFor(node, state, faction) -> mood string (rules in moodFor below)
 *   current()                     mood currently playing (or null); wanted() = last requested mood
 *   moods, sfxNames, songInfo(mood)
 *   styles / getStyles() / getStyle() / setStyle(id) / previewStyle(id) — music styles (SPEC §29): chip (default), dark, organ, synth, piano
 * Optional real audio files: define WH.audioFiles = {battle:"assets/audio/battle.ogg", …} (assets/audio/files.js);
 * a mood with a file plays it through an <audio> element (looped, crossfaded); on load error it falls back to the synth.
 * Everything is original music written for this game. Runs from file:// (no fetch, no deps).
 */
(function (root) {
  "use strict";
  var WH = root.WH = root.WH || {};
  var LS_KEY = "whatiswh.audio";

  /* =====================================================================================
   * 1. MUSIC DATA
   * Song: {key, bpm, meter (16th-steps per bar), ch:{channel:instrument}, drums:{v, pats}, sections, order, intro?,
   *   dly? [beats, feedback] per-song echo (default [0.75, 0.32]), wobble? [depth, periodS], rnd? random detune cents}
   * Instrument: w wave ("p12"|"p25"|"p50" pulse duty, "tri", "sine", "saw"; array = cycle per note = duty variation)
   *   v volume, env [attack, decay, sustain, release] (s), vib [rateHz, depthCents, delayS], lp lowpass Hz,
   *   echo / rev send 0..1, uni detuned 2nd osc (cents), stack [semitones] extra oscs, pan -1..1, gate 0..1, tr semitones
   * Section: chords "Dm | Bb | Gm:8 A:8" (default length = 1 bar), channels as
   *   literal notes "D5:8 F5:4 E5:4 | …" (each "|" bar must sum to meter; ".:n" rest, "~:n" tie, default length 4) or
   *   chord pattern {p:"0-1-2-1-", o:octave, r:stepsPerChar}: digits = chord tones upward from the root (0 root, 1 3rd,
   *   2 5th, 3 7th or octave …), R = bass (slash note), O = bass+12, c = whole chord (voice-led), - hold, . rest.
   *   drums: one pattern name per bar (tiled), "-" = none. from:"A" inherits a section; tr:{ch:semis}; inst:{ch:{w}}; vol
   * Drum pattern: {k kick, s snare, h hat, H open hat, t tom, T big floor tom, c crash, m metal, w whoosh, z glitch scan,
 *   a anvil clang (inharmonic), i insect chitter}: strings of meter chars,
   *   X accent, x normal, o ghost, . rest.
   * ===================================================================================== */
  var SONGS = {
    /* Title — "Cathedral of Ash". D minor, 76 bpm. Organ lead (octave stack), bII (Eb) colour, slow bells on repeat. */
    title: {
      key: "D minor", bpm: 76, meter: 16,
      ch: {
        lead: {w: "p50", v: 0.10, env: [0.04, 0.3, 0.75, 0.5], vib: [5, 16, 0.3], stack: [12], echo: 0.25, rev: 0.45},
        pad:  {w: "p25", v: 0.045, env: [0.4, 0.6, 0.85, 0.9], lp: 1600, uni: 7, rev: 0.5, gate: 1},
        bass: {w: "tri", v: 0.30, env: [0.02, 0.2, 0.9, 0.4], rev: 0.2},
        arp:  {w: "sine", v: 0.07, env: [0.003, 0.5, 0, 0.6], stack: [12], echo: 0.35, rev: 0.5, pan: 0.3}
      },
      drums: {v: 0.55, pats: {T: {t: "X..............."}, T2: {t: "x.......x.......", c: "o..............."}}},
      sections: {
        A: {chords: "Dm | Bb | C | A | Dm | Gm | Eb | A",
            lead: "D5:8 F5:4 E5:4 | D5:4 C5:4 Bb4:8 | C5:6 E5:2 G5:4 F5:4 | E5:8 C#5:4 A4:4 | D5:8 A5:8 | Bb5:6 A5:2 G5:8 | G5:4 F5:4 Eb5:8 | D5:4 C#5:4 E5:8",
            pad: {p: "c---------------", o: 3}, bass: {p: "R-------O-------", o: 2}},
        B: {chords: "Gm | Dm | Bb | F | Gm | Dm/F | Eb | A7",
            lead: "G4:4 Bb4:4 D5:6 C5:2 | D5:4 F5:4 A5:6 G5:2 | F5:4 D5:4 Bb4:8 | C5:4 F5:4 A5:8 | Bb5:4 A5:4 G5:4 D5:4 | F5:6 E5:2 D5:8 | Eb5:4 G5:4 Bb5:4 G5:4 | A5:8 G5:4 E5:4",
            pad: {p: "c---------------", o: 3}, bass: {p: "R-------O-------", o: 2}, drums: "- - - T - - - T2"},
        A2: {from: "A", arp: {p: "0-2-4-2-3-2-1-2-", o: 5}, drums: "T - - - T - - -"}
      },
      order: ["A", "B", "A2", "B"]
    },

    /* Calm — "Hab-Block Lullaby". F major, 84 bpm. Soft pulse lead, 12.5% arpeggio, triangle bass, light shaker on repeat. */
    calm: {
      key: "F major", bpm: 84, meter: 16,
      ch: {
        lead: {w: "p25", v: 0.11, env: [0.02, 0.25, 0.6, 0.4], vib: [5.5, 12, 0.25], echo: 0.3, rev: 0.3},
        arp:  {w: "p12", v: 0.05, env: [0.005, 0.18, 0.25, 0.2], echo: 0.3, rev: 0.25, pan: -0.3},
        pad:  {w: "tri", v: 0.06, env: [0.5, 0.5, 0.8, 1.0], rev: 0.4, gate: 1, pan: 0.2},
        bass: {w: "tri", v: 0.28, env: [0.01, 0.3, 0.6, 0.25]}
      },
      drums: {v: 0.35, pats: {S: {h: "..o...o...o...o."}, S2: {h: "..o...o...o.o.o.", k: "o..............."}}},
      sections: {
        A: {chords: "F | C/E | Dm | Bb | F | Am | Bb | C",
            lead: "A4:6 C5:2 F5:8 | E5:4 D5:4 C5:8 | D5:6 E5:2 F5:4 A5:4 | G5:8 F5:4 D5:4 | C5:6 F5:2 A5:8 | G5:4 E5:4 C5:8 | D5:4 F5:4 Bb5:4 A5:4 | G5:12 .:4",
            arp: {p: "0-1-2-1-3-1-2-1-", o: 3}, bass: {p: "R-------2-----R-", o: 2}},
        B: {chords: "Bb | F/A | Gm | Dm | Bb | F | Gm7 | C7",
            lead: "F5:4 D5:4 Bb4:8 | C5:4 F5:4 A5:8 | Bb5:6 A5:2 G5:4 D5:4 | F5:8 E5:4 D5:4 | D5:4 F5:4 G5:4 F5:4 | A5:6 G5:2 F5:4 C5:4 | D5:4 F5:4 Bb5:4 A5:4 | G5:8 E5:4 C5:4",
            arp: {p: "0-2-1-2-3-2-1-2-", o: 3}, bass: {p: "R-------2-----R-", o: 2}},
        A2: {from: "A", pad: {p: "c---------------", o: 3}, drums: "S"},
        B2: {from: "B", pad: {p: "c---------------", o: 3}, drums: "S S S S S S S S2", inst: {lead: {w: "p12"}}}
      },
      order: ["A", "B", "A2", "B2"]
    },

    /* Holy — "Votive Light". G major with a mixolydian bVII (F), 66 bpm. Detuned pulse "choir", sine bells, long reverb. */
    holy: {
      key: "G major / mixolydian", bpm: 66, meter: 16,
      ch: {
        lead:  {w: "p50", v: 0.09, env: [0.25, 0.4, 0.85, 0.8], vib: [4.5, 14, 0.4], lp: 2200, uni: 9, rev: 0.6, echo: 0.15},
        choir: {w: "p25", v: 0.04, env: [0.7, 0.8, 0.9, 1.4], lp: 1400, uni: 12, vib: [4, 10, 0], rev: 0.7, gate: 1},
        bell:  {w: "sine", v: 0.08, env: [0.002, 0.9, 0, 1.2], stack: [12], rev: 0.6, echo: 0.3, pan: 0.35},
        bass:  {w: "tri", v: 0.24, env: [0.3, 0.5, 0.9, 0.8], rev: 0.3, gate: 1}
      },
      sections: {
        A: {chords: "G | D/F# | Em | C | G/B | Am | C | D",
            lead: "D5:8 B4:8 | A4:12 D5:4 | E5:8 G5:4 F#5:4 | E5:12 .:4 | D5:8 G5:8 | E5:8 C5:4 A4:4 | G4:4 C5:4 E5:8 | F#5:16",
            choir: {p: "c---------------", o: 3}, bass: {p: "R---------------", o: 2}},
        B: {chords: "Em | C | G | D | Em | Am | F | D",
            lead: "B4:8 E5:8 | G5:8 E5:8 | D5:12 B4:4 | A4:16 | G4:4 B4:4 E5:8 | C5:8 E5:4 A5:4 | A5:8 F5:4 C5:4 | D5:8 F#5:8",
            choir: {p: "c---------------", o: 3}, bass: {p: "R---------------", o: 2}, bell: {p: "4-------2-------", o: 5}},
        A2: {from: "A", bell: {p: "4---------------", o: 5}}
      },
      order: ["A", "B", "A2", "B"]
    },

    /* Tense — "Something in the Vents". C minor, 92 bpm. Heartbeat bass, clock-tick hats, sparse 12.5% stabs, Db (bII). */
    tense: {
      key: "C minor", bpm: 92, meter: 16,
      ch: {
        lead: {w: "p12", v: 0.12, env: [0.005, 0.15, 0.35, 0.3], vib: [6, 10, 0.2], echo: 0.4, rev: 0.35, pan: 0.2},
        ost:  {w: "p25", v: 0.07, env: [0.004, 0.08, 0.2, 0.08], lp: 1100, pan: -0.25},
        pad:  {w: "p50", v: 0.055, env: [1.0, 0.5, 0.9, 1.5], lp: 600, uni: 10, rev: 0.4, gate: 1},
        bass: {w: "tri", v: 0.45, env: [0.004, 0.12, 0, 0.1]}
      },
      drums: {v: 0.55, pats: {K: {h: "o...o...o...o..."}, K2: {h: "o...o...o...o.o.", t: "............x..."}}},
      sections: {
        A: {chords: "Cm | Cm | Ab | G | Cm | Cm | Db | G",
            lead: ".:8 G5:2 Ab5:2 G5:4 | .:16 | .:8 C5:2 Db5:2 C5:4 | .:4 B4:4 D5:4 F5:4 | .:8 G5:2 Ab5:2 G5:4 | .:8 Eb5:2 D5:2 C5:4 | .:4 Ab4:4 Db5:4 F5:4 | F5:4 D5:4 B4:8",
            pad: {p: "c---------------", o: 3}, bass: {p: "R..R............", o: 2}, drums: "K"},
        B: {chords: "Fm | Db | Cm | Ab | Fm | Db | G | G7",
            lead: "Ab5:2 .:2 Ab5:2 .:2 G5:2 .:6 | F5:2 .:2 F5:2 .:2 Eb5:2 .:6 | Eb5:2 .:2 Eb5:2 .:2 D5:2 .:6 | C5:8 .:8 | Ab5:2 .:2 Ab5:2 .:2 C6:2 .:6 | Db6:4 C6:4 Ab5:8 | B5:4 .:12 | F5:4 D5:4 B4:4 G4:4",
            pad: {p: "c---------------", o: 3}, bass: {p: "R..R.......R....", o: 2}, drums: "K K K K K K K K2"},
        A2: {from: "A", ost: {p: "0..0..0.0..0..2.", o: 3}},
        B2: {from: "B", ost: {p: "0..0..0.0..0..2.", o: 3}, drums: "K2"}
      },
      order: ["A", "B", "A2", "B2"]
    },

    /* Battle — "Hold the Line". E minor, 150 bpm. Driving rock beat, 16th 12.5% arpeggio, octave pulse bass, B major dominant. */
    battle: {
      key: "E minor", bpm: 150, meter: 16,
      ch: {
        lead: {w: "p25", v: 0.12, env: [0.005, 0.12, 0.7, 0.08], vib: [6, 14, 0.18], echo: 0.18, rev: 0.15},
        arp:  {w: "p12", v: 0.04, env: [0.002, 0.06, 0.3, 0.04], echo: 0.1, pan: -0.3},
        bass: {w: "p50", v: 0.12, env: [0.003, 0.08, 0.7, 0.05], lp: 750}
      },
      drums: {v: 0.6, pats: {
        P1:  {k: "X.....x.X.x.....", s: "....X.......X...", h: "x.x.x.x.x.x.x.x."},
        P1C: {k: "X.....x.X.x.....", s: "....X.......X...", h: "..x.x.x.x.x.x.x.", c: "X..............."},
        P2:  {k: "X.....x.X.x...x.", s: "....X.......X...", h: "xoxoxoxoxoxoxoxo"},
        F1:  {k: "X.....x.X.......", s: "....X...X.XoXXXX", h: "x.x.x.x........."}
      }},
      sections: {
        A: {chords: "Em | Em | C | D | Em | Em | C | B",
            lead: "E5:6 B4:2 E5:4 G5:4 | F#5:6 E5:2 D5:4 B4:4 | C5:6 E5:2 G5:6 A5:2 | F#5:8 D5:8 | E5:6 B4:2 E5:4 G5:4 | B5:6 A5:2 G5:4 F#5:4 | E5:4 G5:4 C6:4 B5:4 | B5:6 A5:2 F#5:4 D#5:4",
            arp: {p: "0121", o: 4}, bass: {p: "R-R-O-R-R-R-O-R-", o: 2}, drums: "P1C P1 P1 P1 P1 P1 P1 F1"},
        B: {chords: "C | D | G | Em | C | D | B | B",
            lead: "G5:8 E5:4 G5:4 | A5:8 F#5:4 D5:4 | B5:6 A5:2 G5:4 D5:4 | E5:8 G5:4 B5:4 | C6:6 B5:2 A5:4 G5:4 | F#5:6 G5:2 A5:4 D5:4 | D#5:4 F#5:4 B5:4 A5:4 | F#5:8 D#5:4 B4:4",
            arp: {p: "0212", o: 4}, bass: {p: "R-R-R-R-R-R-R-R-", o: 2}, drums: "P1C P1 P1 P1 P1 P1 P1 F1"},
        A2: {from: "A", arp: {p: "0121", o: 5}, drums: "P1C P2 P2 P2 P2 P2 P2 F1", inst: {lead: {w: "p50"}}},
        B2: {from: "B", drums: "P1C P2 P2 P2 P2 P2 P2 F1", inst: {lead: {w: ["p12", "p25"]}}}
      },
      order: ["A", "B", "A2", "B2"]
    },

    /* Boss — "Black Crusade". D harmonic minor, 172 bpm. Double-kick, 16th chug bass, brass stabs, Eb (bII) and C#. */
    boss: {
      key: "D harmonic minor", bpm: 172, meter: 16,
      ch: {
        lead: {w: "p50", v: 0.11, env: [0.004, 0.1, 0.75, 0.06], vib: [6.5, 18, 0.15], echo: 0.15, rev: 0.15},
        stab: {w: "p12", v: 0.045, env: [0.003, 0.1, 0.4, 0.06], lp: 3200, pan: 0.25},
        arp:  {w: "p12", v: 0.035, env: [0.002, 0.05, 0.3, 0.03], pan: -0.3},
        bass: {w: "p25", v: 0.11, env: [0.002, 0.06, 0.6, 0.03], lp: 800}
      },
      drums: {v: 0.62, pats: {
        D1:  {k: "X.x.X.x.X.x.X.x.", s: "....X.......X...", h: "x.x.x.x.x.x.x.x.", m: "..............x."},
        D1C: {k: "X.x.X.x.X.x.X.x.", s: "....X.......X...", h: "..x.x.x.x.x.x.x.", c: "X..............."},
        DF:  {k: "X...X...X...X...", s: "X.X.X.X.XxXxXXXX"},
        H1:  {k: "X.......X.x.....", s: "........X.......", h: "x.x.x.x.x.x.x.x.", m: "......x.......x."},
        H1C: {k: "X.......X.x.....", s: "........X.......", h: "..x.x.x.x.x.x.x.", c: "X..............."}
      }},
      sections: {
        A: {chords: "Dm | Dm | Bb | A | Dm | Dm | Eb | A",
            lead: "D5:4 A5:4 F5:4 D5:4 | E5:2 F5:2 E5:4 D5:4 C#5:4 | D5:4 F5:4 Bb5:6 A5:2 | A5:8 G5:2 F5:2 E5:4 | D6:4 A5:4 F5:4 D5:4 | F5:2 G5:2 A5:4 Bb5:4 C#6:4 | Eb6:4 Bb5:4 G5:4 Eb5:4 | E5:4 F5:4 E5:4 C#5:4",
            stab: {p: "c-....c-....c-..", o: 4}, bass: {p: "R-RRR-RRR-RRO-RO", o: 2}, drums: "D1C D1 D1 D1 D1 D1 D1 DF"},
        B: {chords: "Bb | C | Dm | Dm | Bb | C | A | A",
            lead: "F5:12 D5:4 | E5:12 G5:4 | A5:8 F5:4 D5:4 | A5:16 | Bb5:12 F5:4 | G5:8 E5:4 C5:4 | C#6:8 A5:4 E5:4 | A5:4 G5:4 F5:4 E5:4",
            stab: {p: "c---------------", o: 4}, bass: {p: "R-R-R-R-R-R-R-R-", o: 2}, drums: "H1C H1 H1 H1 H1 H1 H1 DF"},
        A2: {from: "A", arp: {p: "0123", o: 5}, inst: {lead: {w: "p25"}}}
      },
      order: ["A", "B", "A2", "B"]
    },

    /* Warp — "Tide of Souls". Augmented / whole-tone colours around C, ~78 bpm with wobbling tempo, detuned everything. */
    warp: {
      key: "C (augmented / whole-tone)", bpm: 78, meter: 16, wobble: [0.16, 9.5], rnd: 16,
      ch: {
        lead:  {w: "sine", v: 0.13, env: [0.15, 0.4, 0.8, 0.9], vib: [3.2, 38, 0], uni: 22, echo: 0.45, rev: 0.6},
        pad:   {w: "p25", v: 0.04, env: [1.2, 0.8, 0.85, 1.6], lp: 900, uni: 28, vib: [0.4, 30, 0], rev: 0.6, gate: 1},
        glint: {w: "p12", v: 0.04, env: [0.002, 0.2, 0, 0.3], echo: 0.55, rev: 0.5, pan: 0.4},
        bass:  {w: "tri", v: 0.26, env: [0.5, 0.5, 0.9, 1.0], vib: [0.3, 25, 0], gate: 1}
      },
      drums: {v: 0.5, pats: {W: {w: "x..............."}}},
      sections: {
        A: {chords: "Cm | Dbmaj7 | Caug | F#m | Cm | Ebaug | Bdim7 | G7",
            lead: "G5:8 F#5:8 | F5:12 .:4 | E5:4 G#5:4 C6:8 | A5:8 C#6:4 .:4 | Eb5:8 D5:8 | G5:4 B5:8 .:4 | D6:4 B5:4 Ab5:4 F5:4 | F5:4 D5:4 B4:8",
            pad: {p: "c---------------", o: 3}, bass: {p: "R---------------", o: 2}, drums: "W - - - W - - -"},
        B: {chords: "Ab | Am | F#m | Fm | Ab | Am | Bdim7 | Caug",
            lead: "C6:4 B5:4 Bb5:4 A5:4 | A5:8 E5:8 | F#5:4 A5:4 C#6:8 | C6:8 Ab5:4 F5:4 | Eb5:4 E5:4 F5:4 F#5:4 | G5:8 A5:8 | B5:4 D6:4 F6:4 Ab6:4 | E6:8 C6:8",
            pad: {p: "c---------------", o: 3}, bass: {p: "R-------R---R---", o: 2}, glint: {p: "0..2..1..3..2...", o: 5}, drums: "- - W - - - W -"},
        A2: {from: "A", tr: {lead: -12}, glint: {p: "0..2..1..3..2...", o: 5}}
      },
      order: ["A", "B", "A2", "B"]
    },

    /* T'au — "For the Greater Good". D Lydian (E/D, G#), 112 bpm. Clean sparkling arpeggios, light electronic beat. */
    tau: {
      key: "D Lydian", bpm: 112, meter: 16,
      ch: {
        lead: {w: "p25", v: 0.11, env: [0.01, 0.2, 0.65, 0.2], vib: [5.5, 10, 0.3], echo: 0.3, rev: 0.25},
        arp:  {w: "p12", v: 0.045, env: [0.002, 0.09, 0.2, 0.08], echo: 0.4, rev: 0.2, pan: -0.3},
        pad:  {w: "sine", v: 0.05, env: [0.4, 0.5, 0.8, 0.8], uni: 6, stack: [12], rev: 0.4, gate: 1, pan: 0.2},
        bass: {w: "tri", v: 0.30, env: [0.005, 0.2, 0.7, 0.1]}
      },
      drums: {v: 0.42, pats: {
        E1: {k: "x.......x.x.....", s: "....o.......x...", h: "..x...x...x...x."},
        E2: {k: "x.......x.x...x.", s: "....x.......x...", h: "..x.o.x...x.o.x."}
      }},
      sections: {
        A: {chords: "D | E/D | Bm | G | D | E/D | Gmaj7 | A",
            lead: "A4:4 D5:4 F#5:4 A5:4 | G#5:12 E5:4 | F#5:6 D5:2 B4:8 | D5:4 E5:4 F#5:4 G5:4 | A5:8 F#5:4 A5:4 | B5:6 G#5:2 E5:8 | F#5:4 G5:4 B5:4 D6:4 | C#6:8 B5:4 A5:4",
            arp: {p: "01232123", o: 4}, bass: {p: "R-----R---R-O-R-", o: 2}, drums: "E1"},
        B: {chords: "Bm | G | D | A | Bm | G | Em7 | Asus4:8 A:8",
            lead: "B5:8 A5:4 F#5:4 | G5:8 D5:8 | F#5:6 E5:2 D5:4 A4:4 | C#5:8 E5:8 | D5:4 F#5:4 B5:8 | D6:6 C#6:2 B5:8 | G5:4 B5:4 D6:4 E6:4 | D6:8 C#6:8",
            arp: {p: "02132413", o: 4}, bass: {p: "R-----R---R-O-R-", o: 2}, drums: "E1 E1 E1 E1 E1 E1 E1 E2"},
        A2: {from: "A", pad: {p: "c---------------", o: 3}, drums: "E2"},
        B2: {from: "B", pad: {p: "c---------------", o: 3}, drums: "E2"}
      },
      order: ["A", "B", "A2", "B2"]
    },

    /* Aeldari — "Thread of Fate". D dorian (B natural = the bright raised 6th: Dm–G), 70 bpm. Harp-like triangle
     * arpeggios (instant attack, long decay, octave shimmer) through a long dotted-quarter echo, a glassy sine lead with
     * slow vibrato, open-fifth bass, airy reverb, only a breath of percussion. */
    aeldari: {
      key: "D dorian", bpm: 70, meter: 16, dly: [1.5, 0.42],
      ch: {
        lead:  {w: "sine", v: 0.13, env: [0.05, 0.5, 0.7, 0.9], vib: [4.2, 14, 0.35], stack: [12], echo: 0.4, rev: 0.55},
        harp:  {w: "tri", v: 0.085, env: [0.002, 0.7, 0, 0.9], stack: [12], echo: 0.5, rev: 0.45, pan: -0.3},
        glass: {w: "p12", v: 0.03, env: [0.002, 0.4, 0, 0.6], lp: 4000, echo: 0.6, rev: 0.5, pan: 0.4},
        pad:   {w: "sine", v: 0.055, env: [0.9, 0.6, 0.85, 1.5], uni: 7, rev: 0.6, gate: 1, pan: 0.15},
        bass:  {w: "tri", v: 0.24, env: [0.3, 0.5, 0.85, 1.0], rev: 0.25, gate: 1}
      },
      drums: {v: 0.32, pats: {W: {w: "x..............."}, S: {H: "........o......."}, S2: {H: "....o.......o...", t: "o..............."}}},
      sections: {
        A: {chords: "Dm | G | Fmaj7 | C | Dm | G | Em | Asus4",
            lead: "A4:8 D5:4 F5:4 | G5:6 F5:2 D5:4 B4:4 | A5:6 G5:2 E5:8 | G5:4 E5:4 C5:8 | D5:4 F5:4 A5:8 | B5:6 A5:2 G5:4 D5:4 | E5:8 G5:4 B5:4 | A5:8 E5:8",
            harp: {p: "0-2-3-4-5-4-3-2-", o: 3}, pad: {p: "c---------------", o: 3}, bass: {p: "R-------2-------", o: 2},
            drums: "W - - - - - - -"},
        B: {chords: "F | G | Am | Em | F | G | Dm | Dm",
            lead: "C6:8 A5:8 | B5:6 A5:2 G5:8 | A5:4 C6:4 E6:8 | E6:6 D6:2 B5:8 | A5:4 F5:4 C5:4 F5:4 | D5:4 G5:4 B5:6 A5:2 | A5:8 F5:4 E5:4 | D5:16",
            harp: {p: "5-4-3-2-1-0-1-2-", o: 3}, pad: {p: "c---------------", o: 3}, bass: {p: "R-------2-------", o: 2},
            drums: "- - - S - - - S"},
        A2: {from: "A", glass: {p: "5.......3.......", o: 5}, drums: "S", inst: {lead: {w: "tri"}}},
        B2: {from: "B", glass: {p: "..4...3...2...1.", o: 5}, drums: "S S S S S S S S2", inst: {lead: {w: "tri"}}}
      },
      order: ["A", "B", "A2", "B2"]
    },

    /* Necron — "The Sleepers Wake". A minor with locrian/phrygian colour (Bb = bII, Eb = b5), 88 bpm. Low-passed detuned
     * saw drone on pedal tones, a 12.5% pulse ostinato, a stiff sparse lead, metallic ticks and glitchy "scan" sweeps (z). */
    necron: {
      key: "A minor / locrian colour", bpm: 88, meter: 16, dly: [0.5, 0.28],
      ch: {
        lead:  {w: "p12", v: 0.10, env: [0.003, 0.25, 0.5, 0.3], lp: 3200, echo: 0.35, rev: 0.3, pan: 0.15},
        pulse: {w: "p12", v: 0.06, env: [0.002, 0.07, 0.15, 0.05], lp: 1400, pan: -0.25},
        glyph: {w: "sine", v: 0.05, env: [0.002, 0.25, 0, 0.3], echo: 0.5, rev: 0.4, pan: 0.4},
        drone: {w: "saw", v: 0.07, env: [1.2, 0.5, 0.9, 1.5], lp: 320, uni: 8, rev: 0.2, gate: 1},
        bass:  {w: "tri", v: 0.30, env: [0.01, 0.3, 0.6, 0.3]}
      },
      drums: {v: 0.5, pats: {
        N1: {k: "x.......x.......", m: "..............o."},
        N2: {k: "x.......x..x....", m: "....o.......x...", h: "..o...o...o...o."},
        NZ: {k: "x.......x.......", m: "....o...........", z: "........x......."}
      }},
      sections: {
        A: {chords: "Am | Bb/A | Am | Gm/A | Fmaj7 | Bb | Dm | E5",
            lead: ".:8 E5:4 C5:4 | F5:8 D5:4 Bb4:4 | A4:12 .:4 | .:8 G4:4 Bb4:4 | C5:8 E5:4 F5:4 | D5:4 Eb5:4 D5:8 | F5:6 E5:2 D5:8 | E5:4 .:4 B4:4 .:4",
            drone: {p: "R---------------", o: 2}, pulse: {p: "R..R..R.R..R..R.", o: 3}, drums: "N1 N1 N1 NZ"},
        B: {chords: "Dm | Eb/D | Dm | Eb/D | Bb | Am | Gm | E5",
            lead: "D5:2 .:2 D5:2 .:2 A5:4 F5:4 | G5:4 .:4 Eb5:4 .:4 | F5:4 .:4 A4:8 | Bb4:4 .:4 G4:4 .:4 | D5:8 F5:4 D5:4 | E5:8 C5:4 A4:4 | Bb4:4 D5:4 G5:4 F5:4 | E5:8 B4:8",
            drone: {p: "R---------------", o: 2}, pulse: {p: "R.R.O.R.R.R.O.R.", o: 2}, bass: {p: "R-------R--R----", o: 2},
            drums: "N2 N2 N2 NZ"},
        A2: {from: "A", glyph: {p: "3...........1...", o: 5}, drums: "N2 N2 N2 NZ", inst: {lead: {w: "p25"}}},
        B2: {from: "B", glyph: {p: "..3.....2.....1.", o: 5}, drums: "N2 NZ N2 NZ", inst: {lead: {w: ["p12", "p25"]}}}
      },
      order: ["A", "B", "A2", "B2"]
    },

    /* Orks — "Scrap-Heap Stomp". G minor with blues colour (Db = the b5 chord, a Gm/F#/F line-cliché), 140 bpm. Brassy 50 %
     * square lead doubled an octave down, offbeat horn stabs on the claps, a "grot" kazoo (12.5 % pulse, wide fast vibrato)
     * heckling in the repeats, stomp-stomp-clap drums, big floor toms (T) and scrap-metal clanks. Comic but menacing. */
    orks: {
      key: "G minor / blues b5", bpm: 140, meter: 16, dly: [0.5, 0.22],
      ch: {
        lead: {w: "p50", v: 0.10, env: [0.015, 0.12, 0.75, 0.08], vib: [6, 16, 0.18], stack: [-12], lp: 2600, echo: 0.12, rev: 0.12},
        horn: {w: "p25", v: 0.05, env: [0.008, 0.1, 0.55, 0.06], lp: 2200, uni: 6, pan: 0.3},
        grot: {w: "p12", v: 0.035, env: [0.003, 0.08, 0.5, 0.05], vib: [11, 45, 0], echo: 0.2, pan: -0.35},
        bass: {w: "p50", v: 0.12, env: [0.003, 0.09, 0.7, 0.05], lp: 620}
      },
      drums: {v: 0.62, pats: {
        O1:  {k: "X.X.....X.X.....", s: "....X.......X...", h: "..x...x...x...x.", m: "......o.......o."},
        O1C: {k: "X.X.....X.X.....", s: "....X.......X...", h: "..x...x...x...x.", c: "X..............."},
        OT:  {k: "X.......X.......", T: "....X.X.X.X.XxXx", s: "..............X."},
        O2:  {k: "X......xX.......", T: "....X.......X.x.", s: "........X.......", h: "x.x.x.x.x.x.x.x."},
        O2C: {k: "X......xX.......", T: "....X.......X.x.", s: "........X.......", c: "X..............."}
      }},
      sections: {
        A: {chords: "Gm | Gm/F# | Gm/F | C/E | Eb | Db | D | D7",
            lead: "G4:2 G4:2 .:2 Bb4:2 D5:4 G5:4 | D5:4 .:2 D5:2 Bb4:4 G4:4 | G5:6 F5:2 D5:4 Bb4:4 | E5:4 C5:2 E5:2 G5:4 E5:4 | Eb5:2 Eb5:2 .:2 G5:2 Bb5:4 G5:4 | Ab5:2 Ab5:2 .:2 F5:2 Db5:4 F5:4 | A5:4 F#5:4 D5:4 A4:4 | C5:2 D5:2 .:2 C5:2 A4:4 F#4:4",
            horn: {p: "....c.......c...", o: 4}, bass: {p: "R-R---O-R-R---O-", o: 2}, drums: "O1C O1 O1 O1 O1 O1 O1 OT"},
        B: {chords: "Cm | Bb | Ab | G | Cm | Bb | Db:8 C:8 | D",
            lead: "C5:6 Eb5:2 G5:8 | F5:4 D5:4 Bb4:8 | Eb5:6 C5:2 Ab4:8 | B4:4 D5:4 G5:8 | G5:2 G5:2 .:2 G5:2 Eb5:4 C5:4 | F5:2 F5:2 .:2 F5:2 D5:4 Bb4:4 | Ab5:4 F5:4 G5:4 E5:4 | D6:6 C6:2 A5:4 F#5:4",
            horn: {p: "c-------c-.c-...", o: 4}, bass: {p: "R-------R--R--O-", o: 2}, drums: "O2C O2 O2 O2 O2 O2 O2 OT"},
        A2: {from: "A", grot: {p: "..0.2...1.0.2...", o: 4}, inst: {lead: {w: ["p50", "p25"]}}},
        B2: {from: "B", grot: {p: "0-.0-.2-....1.0.", o: 4}, drums: "O2C O2 O2 O2 O2 O2 OT OT"}
      },
      order: ["A", "B", "A2", "B2"]
    },

    /* Genestealer Cult — "Hymn Under the Mine". An F major hymn that keeps going wrong: iv minor (Bbm), bII (Gb) instead of
     * V before the "amen", bVI (Db); 66 bpm. Slow organ chords, a flute-organ hymn voice, a funeral toll whose octave is
     * flattened a semitone (stack 11), insect-like chitter clicks (i). On the repeat the hymn voice gains a quiet tritone
     * shadow beneath it (organum at the "wrong" interval) and the organ turns thin and nasal. */
    gsc: {
      key: "F major hymn, flattened", bpm: 66, meter: 16,
      ch: {
        lead:  {w: "p50", v: 0.085, env: [0.08, 0.4, 0.8, 0.6], vib: [4.5, 10, 0.4], lp: 2000, stack: [12], rev: 0.5, echo: 0.15},
        lead2: {w: "p50", v: 0.085, env: [0.1, 0.4, 0.8, 0.7], vib: [3.8, 18, 0.3], lp: 1900, uni: 5, stack: [-6], rev: 0.55, echo: 0.2},
        organ: {w: "p25", v: 0.045, env: [0.25, 0.5, 0.9, 0.8], lp: 1500, stack: [12], rev: 0.55, gate: 1},
        toll:  {w: "sine", v: 0.06, env: [0.002, 1.4, 0, 1.6], stack: [11], rev: 0.6, echo: 0.25, pan: 0.3},
        bass:  {w: "tri", v: 0.24, env: [0.2, 0.5, 0.9, 0.8], rev: 0.2, gate: 1}
      },
      drums: {v: 0.6, pats: {
        C1: {i: "........o......."},
        C2: {i: "..o.....o...o.o.", t: "o..............."},
        C3: {i: "o.o.x...o..ox.o.", t: "o.......o......."}
      }},
      sections: {
        A: {chords: "F | Bb | Dm | C | F | Bbm | Gb | F",
            lead: "A4:4 C5:4 F5:4 E5:4 | D5:8 Bb4:8 | A4:4 D5:4 F5:4 E5:4 | E5:4 G5:4 C5:8 | F5:4 A5:4 C6:6 Bb5:2 | Db6:8 Bb5:4 F5:4 | Gb5:6 F5:2 Db5:8 | C5:4 A4:4 F4:8",
            organ: {p: "c---------------", o: 3}, bass: {p: "R---------------", o: 2}, drums: "- - - C1 - - - C1"},
        B: {chords: "Bbm | F | Db | Ab | Bbm | F/A | Gb | C7",
            lead: "F5:4 Db5:4 Bb4:8 | C5:4 A4:4 C5:4 F5:4 | Ab5:8 F5:4 Db5:4 | Eb5:8 C5:8 | Db5:4 F5:4 Bb5:8 | A5:4 C6:4 A5:4 F5:4 | Bb5:4 Gb5:4 Db5:8 | G5:4 E5:4 C5:4 Bb4:4",
            toll: "F5:16 | .:16 | Db5:16 | .:16 | Bb4:16 | .:16 | Gb5:16 | .:16",
            organ: {p: "c---------------", o: 3}, bass: {p: "R-------R-------", o: 2}, drums: "C1 - C2 - C1 - C2 -"},
        A2: {from: "A", lead: null,
            lead2: "A4:4 C5:4 F5:4 E5:4 | D5:8 Bb4:8 | A4:4 D5:4 F5:4 E5:4 | E5:4 G5:4 C5:8 | F5:4 A5:4 C6:6 Bb5:2 | Db6:8 Bb5:4 F5:4 | Gb5:6 F5:2 Db5:8 | C5:4 A4:4 F4:8",
            toll: "F4:16 | .:16 | .:16 | .:16 | F4:16 | .:16 | Gb4:16 | .:16", drums: "C2 C1 C2 C3", inst: {organ: {w: "p12"}}},
        B2: {from: "B", lead: null,
            lead2: "F5:4 Db5:4 Bb4:8 | C5:4 A4:4 C5:4 F5:4 | Ab5:8 F5:4 Db5:4 | Eb5:8 C5:8 | Db5:4 F5:4 Bb5:8 | A5:4 C6:4 A5:4 F5:4 | Bb5:4 Gb5:4 Db5:8 | G5:4 E5:4 C5:4 Bb4:4",
            drums: "C2 C3 C2 C3 C2 C3 C3 C3", inst: {organ: {w: "p12"}}}
      },
      order: ["A", "B", "A2", "B2"]
    },

    /* Adeptus Mechanicus — "Canticle of the Cogitator". F# minor (aeolian) with a C# major turn, 100 bpm. A choir-like
     * detuned pulse chant sung in parallel fifths (stack 7, organum) on a reciting tone in even syllables, a 12.5 % "data"
     * ostinato whose root/octave pattern spells a binary word (a new word in each section), a slow choir pad, machine
     * kick, metal ticks, forge-anvil clangs (a) and a glitch scan (z) in the repeats. */
    mechanicus: {
      key: "F# aeolian, organum 5ths", bpm: 100, meter: 16, dly: [0.75, 0.25],
      ch: {
        chant: {w: "p50", v: 0.075, env: [0.03, 0.2, 0.8, 0.2], vib: [5, 8, 0.3], lp: 1500, uni: 8, stack: [7], rev: 0.35, echo: 0.12},
        data:  {w: "p12", v: 0.05, env: [0.002, 0.05, 0.2, 0.03], lp: 2600, pan: -0.3},
        choir: {w: "p25", v: 0.045, env: [0.6, 0.6, 0.85, 1.0], lp: 1100, uni: 12, vib: [4, 9, 0], rev: 0.55, gate: 1, pan: 0.2},
        bass:  {w: "tri", v: 0.28, env: [0.005, 0.2, 0.7, 0.1]}
      },
      drums: {v: 0.5, pats: {
        M0: {k: "x.......x.......", m: "..o...o...o...o."},
        M1: {k: "x.......x.......", m: "o.o.o.o.o.o.o.o.", a: "....X.......X..."},
        M2: {k: "x.......x.x.....", m: "ooxo.oxoo.xoo.xo", a: "....X.......X..x"},
        MZ: {k: "x.......x.......", m: "o.o.o.o.........", a: "....X...........", z: "........x......."},
        MF: {k: "x...x...x...x...", a: "X..x..X..x..X.XX"}
      }},
      sections: {
        A: {chords: "F#m | F#m | D | E | F#m | Bm | D | C#",
            chant: "C#5:2 C#5:2 C#5:4 C#5:2 C#5:2 A4:4 | C#5:2 C#5:2 C#5:2 E5:2 C#5:4 A4:4 | A4:2 A4:2 A4:2 B4:2 A4:4 F#4:4 | B4:4 B4:2 C#5:2 B4:4 G#4:4 | F#5:2 F#5:2 F#5:2 E5:2 F#5:4 C#5:4 | D5:2 D5:2 D5:2 E5:2 D5:4 B4:4 | A4:2 A4:2 A4:2 B4:2 A4:4 F#4:4 | G#4:4 C#5:4 G#4:8",
            data: {p: "R.RO.RO.RRO.R.OR", o: 3}, choir: {p: "c---------------", o: 3}, bass: {p: "R-------R-----R-", o: 2},
            drums: "M0 M0 M0 M0 M1 M1 M1 MF"},
        B: {chords: "Bm | Bm | G | G | D | E | F#m | C#",
            chant: "F#5:8 D5:8 | B4:4 D5:4 F#5:8 | G5:8 D5:8 | D5:6 E5:2 D5:4 B4:4 | A5:8 F#5:8 | G#5:8 E5:4 B4:4 | A5:4 C#6:4 A5:4 F#5:4 | G#5:8 E#5:4 C#5:4",
            data: {p: "ROR.ROO.R.ORRO.O", o: 3}, choir: {p: "c---------------", o: 3}, bass: {p: "R-.R-.R-R-.R-.R-", o: 2},
            drums: "M1 M1 M1 M1 M1 M1 M1 MF"},
        A2: {from: "A", data: {p: "RORRO.ORR.OROROO", o: 3}, drums: "M2 M2 M2 MZ M2 M2 M2 MF", inst: {chant: {w: "p25"}}},
        B2: {from: "B", data: {p: "OROR.RRO.OROO.RO", o: 3}, drums: "M2 M2 M2 MZ M2 M2 MZ MF", inst: {chant: {w: ["p25", "p50"]}}}
      },
      order: ["A", "B", "A2", "B2"]
    },

    /* Happy — "Dawn After the Siege". C major, 132 bpm. Bouncy oom-pah bass, offbeat stabs, dotted-rhythm B section. */
    happy: {
      key: "C major", bpm: 132, meter: 16,
      ch: {
        lead: {w: "p50", v: 0.10, env: [0.005, 0.12, 0.7, 0.1], vib: [6, 12, 0.2], echo: 0.2, rev: 0.2},
        stab: {w: "p12", v: 0.045, env: [0.002, 0.08, 0.3, 0.05], pan: 0.25},
        arp:  {w: "p25", v: 0.03, env: [0.002, 0.06, 0.2, 0.04], echo: 0.2, pan: -0.3},
        bass: {w: "tri", v: 0.30, env: [0.004, 0.1, 0.6, 0.06]}
      },
      drums: {v: 0.48, pats: {
        H1:  {k: "x.......x.......", s: "....x.......x...", h: "x.x.x.x.x.x.x.x."},
        H1C: {k: "x.......x.......", s: "....x.......x...", h: "..x.x.x.x.x.x.x.", c: "x..............."},
        HF:  {k: "x.......x.......", s: "....x...x.x.xxxx", h: "x.x.x.x........."}
      }},
      sections: {
        A: {chords: "C | Am | F | G | C | Am | Dm7:8 G7:8 | C",
            lead: "G4:2 C5:2 E5:2 G5:6 E5:4 | A5:6 G5:2 E5:4 C5:4 | F5:4 A5:4 C6:6 A5:2 | G5:6 F5:2 D5:4 B4:4 | C5:4 E5:4 G5:4 C6:4 | B5:4 A5:4 E5:4 A5:4 | F5:4 A5:4 G5:4 B5:4 | C6:8 .:2 G5:2 C6:4",
            stab: {p: "..c...c...c...c.", o: 4}, bass: {p: "R-O-2-O-R-O-2-O-", o: 2}, drums: "H1C H1 H1 H1 H1 H1 H1 HF"},
        B: {chords: "F | G | Em | Am | Dm | G | C | G7",
            lead: "A5:3 G5:1 F5:4 C5:4 F5:4 | B5:3 A5:1 G5:4 D5:4 G5:4 | E5:3 D5:1 E5:4 G5:4 B5:4 | C6:8 A5:8 | D6:3 C6:1 A5:4 F5:4 D5:4 | B5:3 A5:1 G5:4 D5:4 B4:4 | C5:4 E5:4 G5:4 C6:4 | B5:4 G5:4 D5:4 F5:4",
            stab: {p: "..c...c...c...c.", o: 4}, bass: {p: "R-O-2-O-R-O-2-O-", o: 2}, drums: "H1C H1 H1 H1 H1 H1 H1 HF"},
        A2: {from: "A", arp: {p: "0121", o: 5}}
      },
      order: ["A", "B", "A2", "B"]
    },

    /* Death — "Last Rites". A minor, 60 bpm. A 4-bar lament (played once), then a near-silent pad loop with distant bells. */
    death: {
      key: "A minor", bpm: 60, meter: 16,
      ch: {
        lead: {w: "p50", v: 0.11, env: [0.08, 0.4, 0.7, 0.9], vib: [4.5, 16, 0.35], lp: 2400, echo: 0.35, rev: 0.55},
        pad:  {w: "p25", v: 0.04, env: [0.8, 0.6, 0.85, 1.6], lp: 900, uni: 9, rev: 0.6, gate: 1},
        bell: {w: "sine", v: 0.06, env: [0.002, 1.2, 0, 1.6], stack: [12], rev: 0.6, echo: 0.3, pan: 0.3},
        bass: {w: "tri", v: 0.24, env: [0.4, 0.5, 0.9, 1.2], gate: 1}
      },
      drums: {v: 0.4, pats: {W: {w: "x..............."}}},
      intro: ["I"],
      sections: {
        I: {chords: "Am | F | E | Am",
            lead: "E5:8 C5:4 B4:4 | A4:6 C5:2 F5:8 | E5:4 D5:4 B4:4 G#4:4 | A4:16",
            pad: {p: "c---------------", o: 3}, bass: {p: "R---------------", o: 2}},
        L: {chords: "Am:32 Fmaj7:32 Dm:32 Esus4:16 E:16", vol: 0.75,
            bell: "E5:16 | .:16 | C5:16 | .:16 | D5:16 | .:16 | B4:16 | .:16",
            pad: {p: "c---------------", o: 3}, bass: {p: "R---------------", o: 2}, drums: "- - - W - - - -"}
      },
      order: ["L"]
    },

    /* Bad ending — "Ash and Static". B phrygian (C = bII), 58 bpm. Low sighing lead, drone, wind, then near silence. */
    bad: {
      key: "B phrygian", bpm: 58, meter: 16,
      ch: {
        lead: {w: "p50", v: 0.11, env: [0.1, 0.5, 0.65, 1.0], vib: [4, 14, 0.5], lp: 1800, echo: 0.4, rev: 0.6},
        pad:  {w: "p25", v: 0.045, env: [1.5, 1.0, 0.85, 2.0], lp: 700, uni: 14, rev: 0.6, gate: 1},
        bell: {w: "sine", v: 0.05, env: [0.002, 1.2, 0, 1.6], stack: [12], rev: 0.6, echo: 0.3, pan: -0.3},
        bass: {w: "tri", v: 0.26, env: [0.6, 0.5, 0.9, 1.5], gate: 1}
      },
      drums: {v: 0.5, pats: {W: {w: "x..............."}, T: {t: "o..............."}}},
      sections: {
        A: {chords: "Bm | C | Bm | Am | Bm | C | G | F#m",
            lead: "B4:12 A4:4 | G4:8 E4:8 | F#4:12 .:4 | A4:8 C5:4 B4:4 | D5:8 B4:8 | E5:8 C5:4 G4:4 | B4:4 A4:4 G4:8 | F#4:16",
            pad: {p: "c---------------", o: 3}, bass: {p: "R---------------", o: 2}, drums: "T - - - T - - -"},
        B: {chords: "Bm:64 C:32 Bm:32", vol: 0.8,
            lead: ".:16 | F#4:8 G4:8 | F#4:16 | .:16 | .:16 | G4:8 E4:8 | F#4:16 | ~:16",
            bell: "B5:16 | .:16 | .:16 | .:16 | C6:16 | .:16 | .:16 | .:16",
            pad: {p: "c---------------", o: 3}, bass: {p: "R---------------", o: 2}, drums: "W - - - W - - -"}
      },
      order: ["A", "B"]
    }
  };

  var MOODS = Object.keys(SONGS);
  var SFX_NAMES = ["click", "hover", "select", "start", "type", "damage", "heal", "sanity", "corrupt",
                   "event", "warp", "codex", "save", "death", "ending_good", "consequence", "scan"];
  var URGENT = {battle: 1, boss: 1, warp: 1, death: 1, bad: 1, happy: 1, title: 1};   // switch immediately (no hysteresis); warp = chaos events
  var HYSTERESIS_MS = 8000;
  var DEFAULT_FADE = {battle: 600, boss: 600, death: 400, bad: 1200, happy: 800};

  /* =====================================================================================
   * 2. PARSING / COMPILING (pure — no AudioContext; reused by tools/dev/audio_check.js)
   * ===================================================================================== */
  var PC = {C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11};
  var QUAL = {"": [0, 4, 7], m: [0, 3, 7], dim: [0, 3, 6], aug: [0, 4, 8], sus2: [0, 2, 7], sus4: [0, 5, 7],
              "7": [0, 4, 7, 10], m7: [0, 3, 7, 10], maj7: [0, 4, 7, 11], dim7: [0, 3, 6, 9], m7b5: [0, 3, 6, 10],
              "6": [0, 4, 7, 9], m6: [0, 3, 7, 9], "5": [0, 7],
              add9: [0, 4, 7, 14], madd9: [0, 3, 7, 14], maj9: [0, 4, 7, 11, 14], m9: [0, 3, 7, 10, 14]};   // 9ths: styles only
  var RESERVED = {chords: 1, drums: 1, from: 1, tr: 1, inst: 1, vol: 1};
  var DRUM_KEYS = {k: 1, s: 1, h: 1, H: 1, t: 1, T: 1, c: 1, m: 1, w: 1, z: 1, a: 1, i: 1, b: 1, g: 1, p: 1};
  var VEL = {X: 1, x: 0.75, o: 0.4};

  function pcOf(s) {
    var m = /^([A-G])([#b]?)$/.exec(s);
    if (!m) return NaN;
    return (PC[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) + 12) % 12;
  }
  function noteMidi(s) {
    var m = /^([A-G])([#b]?)(\d)$/.exec(s);
    if (!m) return NaN;
    return 12 * (+m[3] + 1) + PC[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  }
  function parseChord(tok, meter) {
    var m = /^([A-G][#b]?)(m7b5|maj7|maj9|madd9|add9|dim7|sus2|sus4|dim|aug|m7|m6|m9|m|7|6|5)?(?:\/([A-G][#b]?))?(?::(\d+))?$/.exec(tok);
    if (!m) return null;
    var q = m[2] || "";
    return {pc: pcOf(m[1]), iv: QUAL[q], q: q, name: m[1] + q + (m[3] ? "/" + m[3] : ""),
            bass: m[3] ? pcOf(m[3]) : null, d: m[4] ? +m[4] : meter};
  }
  function parseChords(str, meter, errs, where) {
    var out = [], s = 0;
    (str || "").split(/[\s|]+/).forEach(function (tok) {
      if (!tok) return;
      var c = parseChord(tok, meter);
      if (!c) { errs.push(where + ": bad chord '" + tok + "'"); return; }
      c.s = s; s += c.d; out.push(c);
    });
    return {list: out, len: s};
  }
  function parseLiteral(str, meter, errs, where) {
    var notes = [], s = 0, last = null, bars = str.split("|");
    bars.forEach(function (bar, bi) {
      var bs = 0;
      bar.trim().split(/\s+/).forEach(function (tok) {
        if (!tok) return;
        var m = /^([^:]+)(?::(\d+))?$/.exec(tok), name = m ? m[1] : tok, d = m && m[2] ? +m[2] : 4;
        if (!m || d <= 0) { errs.push(where + ": bad token '" + tok + "'"); return; }
        if (name === ".") last = null;
        else if (name === "~") { if (last) last.d += d; }
        else {
          var mi = noteMidi(name);
          if (isNaN(mi)) { errs.push(where + ": bad note '" + name + "'"); }
          else { last = {s: s, d: d, m: mi}; notes.push(last); }
        }
        s += d; bs += d;
      });
      if (bs !== meter) errs.push(where + ": bar " + (bi + 1) + " has " + bs + " steps (expected " + meter + ")");
    });
    return {notes: notes, len: s, bars: bars.length};
  }
  function voicing(ch, o) {          // chord tones folded into [F(o), F(o+1)) -> smooth voice-leading pads
    var base = 12 * (o + 1) + 5, seen = {}, out = [];
    ch.iv.forEach(function (x) {
      var pc = (ch.pc + x) % 12;
      if (seen[pc]) return; seen[pc] = 1;
      out.push(base + ((pc - 5 + 12) % 12));
    });
    return out.sort(function (a, b) { return a - b; }).slice(0, 5);
  }
  function expandPattern(chords, spec, errs, where) {
    var out = [], p = spec.p || "", r = spec.r || 1, o = spec.o == null ? 4 : spec.o;
    if (!p.length) { errs.push(where + ": empty pattern"); return out; }
    chords.forEach(function (ch) {
      var root = 12 * (o + 1) + ch.pc, bassM = 12 * (o + 1) + (ch.bass != null ? ch.bass : ch.pc), last = null, n = ch.iv.length;
      for (var s = 0, i = 0; s < ch.d; s += r, i++) {
        var c = p.charAt(i % p.length), at = ch.s + s, dur = Math.min(r, ch.d - s), m;
        if (c === "-") { if (last) last.d += dur; continue; }
        if (c === ".") { last = null; continue; }
        if (c === "R") m = bassM;
        else if (c === "O") m = bassM + 12;
        else if (c === "c") m = voicing(ch, o);
        else if (/[0-9]/.test(c)) { var k = +c; m = root + ch.iv[k % n] + 12 * Math.floor(k / n); }
        else { errs.push(where + ": bad pattern char '" + c + "'"); continue; }
        last = {s: at, d: dur, m: m}; out.push(last);
      }
    });
    return out;
  }
  function resolveSection(S, name, errs, depth) {
    var sec = S.sections[name];
    if (!sec) { errs.push("missing section '" + name + "'"); return null; }
    if (!sec.from) return sec;
    if ((depth || 0) > 4) { errs.push("section inheritance too deep at '" + name + "'"); return sec; }
    var base = resolveSection(S, sec.from, errs, (depth || 0) + 1) || {}, out = {}, k;
    for (k in base) out[k] = base[k];
    for (k in sec) if (k !== "from") out[k] = sec[k];
    out.tr = merge(base.tr, sec.tr); out.inst = merge(base.inst, sec.inst);
    return out;
  }
  function merge(a, b) { var o = {}, k; for (k in a || {}) o[k] = a[k]; for (k in b || {}) o[k] = b[k]; return o; }

  var compiled = {};
  function compileSong(id, style) {
    var key = style && style !== "chip" ? style + ":" + id : id;
    if (compiled[key]) return compiled[key];
    var S = songOf(id, style), errs = [], meter = S.meter || 16, secIdx = {}, sections = [];
    var names = (S.intro || []).concat(S.order);
    Object.keys(S.sections).forEach(function (n) { if (names.indexOf(n) < 0) names.push(n); });
    names.forEach(function (name) {
      if (secIdx[name] != null) return;
      var where = key + "." + name, sec = resolveSection(S, name, errs);
      if (!sec) return;
      var cp = parseChords(sec.chords, meter, errs, where), len = cp.len, bars = len / meter;
      if (!len) errs.push(where + ": no chords");
      if (len % meter) errs.push(where + ": chord track is " + len + " steps, not a whole number of bars");
      var ev = new Array(len), stat = {strong: 0, chordTone: 0, notes: 0, lo: 999, hi: 0};
      var add = function (s, e) { if (s < len) (ev[s] || (ev[s] = [])).push(e); };
      var vol = sec.vol == null ? 1 : sec.vol;
      for (var key in sec) {
        if (RESERVED[key] || sec[key] == null) continue;
        var spec = sec[key], inst = S.ch[key], w2 = where + "." + key;
        if (!inst) { errs.push(w2 + ": no instrument '" + key + "' in song.ch"); continue; }
        var notes, literal = typeof spec === "string" || Array.isArray(spec);   // array = ready-made notes [{s, d, m}] (styles)
        if (typeof spec === "string") {
          var lit = parseLiteral(spec, meter, errs, w2);
          if (lit.len !== len) errs.push(w2 + ": " + lit.len + " steps but chords span " + len);
          notes = lit.notes;
        } else if (literal) notes = spec;
        else notes = expandPattern(cp.list, spec, errs, w2);
        var tr = (inst.tr || 0) + ((sec.tr || {})[key] || 0), ov = (sec.inst || {})[key];
        notes.forEach(function (nt) {
          var m = Array.isArray(nt.m) ? nt.m.map(function (x) { return x + tr; }) : nt.m + tr;
          add(nt.s, {c: key, m: m, d: nt.d, w: ov && ov.w, v: vol});
          if (literal) {                           // melody statistics for the checker
            stat.notes++; stat.lo = Math.min(stat.lo, m); stat.hi = Math.max(stat.hi, m);
            if (nt.s % 4 === 0) {
              var chd = chordAt(cp.list, nt.s);
              if (chd) { stat.strong++; if (chordPcs(chd).indexOf(((m % 12) + 12) % 12) >= 0) stat.chordTone++; }
            }
          }
        });
      }
      if (sec.drums) {
        var pats = (S.drums || {}).pats || {}, list = sec.drums.split(/\s+/).filter(Boolean);
        for (var b = 0; b < bars; b++) {
          var pn = list[b % list.length];
          if (pn === "-") continue;
          var pat = pats[pn];
          if (!pat) { errs.push(where + ": unknown drum pattern '" + pn + "'"); continue; }
          for (var dk in pat) {
            if (!DRUM_KEYS[dk]) { errs.push(where + ": drum pattern " + pn + " has unknown instrument '" + dk + "'"); continue; }
            var str = pat[dk];
            if (str.length !== meter) errs.push(key + ".drums." + pn + "." + dk + ": length " + str.length + " (expected " + meter + ")");
            for (var i = 0; i < str.length && i < meter; i++) {
              var ch = str.charAt(i);
              if (ch === ".") continue;
              if (!VEL[ch]) { errs.push(key + ".drums." + pn + "." + dk + ": bad char '" + ch + "'"); continue; }
              add(b * meter + i, {k: dk, v: VEL[ch] * vol});
            }
          }
        }
      }
      secIdx[name] = sections.length;
      sections.push({name: name, len: len, bars: bars, ev: ev, stat: stat});
    });
    var seq = [];
    (S.intro || []).concat(S.order).forEach(function (n) { if (secIdx[n] != null) seq.push(secIdx[n]); });
    var stepSec = 60 / S.bpm / 4;
    var introSteps = 0, loopSteps = 0, introN = (S.intro || []).length;
    seq.forEach(function (si, i) { if (i < introN) introSteps += sections[si].len; else loopSteps += sections[si].len; });
    var c = compiled[key] = {id: id, style: style || "chip", bpm: S.bpm, key: S.key, meter: meter, stepSec: stepSec, sections: sections, seq: seq,
      loopFrom: introN, introSec: introSteps * stepSec, loopSec: loopSteps * stepSec,
      loopBars: loopSteps / meter, introBars: introSteps / meter, errors: errs};
    if (errs.length && root.console) console.warn("[audio] " + key + ": " + errs.length + " data errors", errs);
    return c;
  }
  function chordAt(list, s) { for (var i = 0; i < list.length; i++) if (s >= list[i].s && s < list[i].s + list[i].d) return list[i]; return null; }
  function chordPcs(ch) { return ch.iv.map(function (x) { return (ch.pc + x) % 12; }); }

  /* =====================================================================================
   * 2b. MUSIC STYLES (SPEC §29). `chip` = SONGS above. The other styles re-arrange the same 16 mood themes (same keys and
   * progressions, so every mood keeps its identity and the per-node mood pick is untouched) with a different instrument set,
   * tempo, harmonic rhythm / colour and drum language. buildStyleSong() turns a chip song into a song object in the very same
   * format (compiled and played by the same code), section by section:  STYLES[id].sec(ctx) -> {chords, <channel>: notes|pattern, drums}.
   * ctx: {cls, idx (-1 = intro, 0..3 = A B A2 B2: the arrangement builds up), cp (chord list), len, root, minor, lead (source melody
   * notes), rnd}.   cls: cm calm · sc sacred/solemn · tn tense/uneasy · dr drive (combat) · jy bright · en ending.
   * ===================================================================================== */
  var STYLE_LIST = [
    {id: "chip", name: {zh: "8位芯片", en: "8-bit chiptune"},
     desc: {zh: "复古游戏机的方波与噪声（默认）。", en: "Square waves and noise, straight from an old console (default)."}},
    {id: "dark", name: {zh: "暗黑氛围", en: "Dark ambient"},
     desc: {zh: "缓慢失谐的长音与垫底，稀疏的金属声与钟声；只有战斗时才有低频脉冲。", en: "Slow detuned drones and pads, sparse metal and bells; sub-bass pulses only in combat."}},
    {id: "organ", name: {zh: "哥特管风琴", en: "Gothic organ"},
     desc: {zh: "管风琴和弦、人声般的长音与缓慢琶音；战斗时有定音鼓。", en: "Pipe-organ chords, choir-like pads and slow arpeggios; timpani in combat."}},
    {id: "synth", name: {zh: "合成波", en: "Synthwave"},
     desc: {zh: "锯齿波贝斯与琶音、门控长音；战斗时四四拍重鼓。", en: "Saw bass arpeggios and gated pads; four-on-the-floor drums in combat."}},
    {id: "piano", name: {zh: "钢琴弦乐", en: "Piano & strings"},
     desc: {zh: "稀疏的钢琴动机配缓慢弦乐铺底；战斗时弦乐急促推进。", en: "Sparse piano motifs over slow string pads; driving string ostinatos in combat."}}
  ];
  var HOLD = new Array(64).join("-"), PCN = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  function pat(p, o, r) { return {p: p, o: o, r: r || 1}; }                    // chord pattern spec
  function hold(m, len) { return [{s: 0, d: len, m: m}]; }                  // one note for the whole section
  function hashStr(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }
  function chordStr(list, qf) {                                             // chord list -> chord string; qf(chord) may change the quality
    return list.map(function (c) { return PCN[c.pc] + (qf ? qf(c) : c.q) + (c.bass != null ? "/" + PCN[c.bass] : "") + ":" + c.d; }).join(" ");
  }
  function merge2(list) {                                                   // halve the harmonic rhythm: a pair of equal chords' slots -> the first chord
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var c = list[i], n = list[i + 1];
      if (n && n.d === c.d && c.s % (2 * c.d) === 0 && c.d <= 16) { out.push({pc: c.pc, q: c.q, bass: c.bass, d: c.d * 2, s: c.s}); i++; }
      else out.push(c);
    }
    return out;
  }
  function thin(notes, o, rnd, len) {                                       // melody -> fewer / longer notes: keep notes on a grid (+ some others), optional hold
    var out = [];
    notes.forEach(function (n) { if (n.s % (o.grid || 16) === 0 || (o.keep && rnd() < o.keep)) out.push({s: n.s, d: o.d || n.d, m: n.m + (o.sh || 0)}); });
    if (o.hold) out.forEach(function (n, i) { n.d = Math.max(2, Math.min(o.cap || 32, (i + 1 < out.length ? out[i + 1].s : len) - n.s)); });
    return out;
  }
  function pick(a, t) { return a[Math.min(t, a.length - 1)]; }
  function cellOr(c, p, o, r) { return c.cell ? pat(c.cell.p, o, c.cell.r) : pat(p, o, r); }   // the mood's own ostinato cell (from its chip arrangement) keeps each mood's rhythmic identity

  var STYLES = {
    /* ---------- dark ambient: pedal drone + slowly shifting clusters, ghostly one-note-a-bar melody, bells, gongs, sub boom in combat ---------- */
    dark: {
      lift: ["glass", "choir"], dly: [1.5, 0.5], trim: {title: 6.1, calm: 0.4, holy: 5.9, tense: -4.4, battle: -1.2, boss: -2.2, warp: 2.8, tau: 1.7, aeldari: 2.3, necron: -1.6, orks: 0.3, gsc: 5.7, mechanicus: 0.8, happy: 0.8, death: 3.8, bad: 5.0},
      moods: {title: "sc 56", calm: "cm 60", holy: "sc 50", tense: "tn 66", battle: "dr 104", boss: "dr 112", warp: "tn 58 w", tau: "cm 72",
              aeldari: "cm 54", necron: "tn 64", orks: "dr 100", gsc: "sc 52", mechanicus: "tn 72", happy: "jy 66", death: "en 46", bad: "en 44"},
      ch: {
        drone: {w: "saw", v: 0.15, env: [3, 1, 1, 3.5], lp: 240, uni: 13, vib: [0.13, 16, 0], rev: 0.3, gate: 1},
        fifth: {w: "saw", v: 0.09, env: [4, 1, 1, 4], lp: 380, uni: 17, vib: [0.09, 20, 0], rev: 0.4, gate: 1, pan: 0.2},
        pad:   {w: "p25", v: 0.075, env: [2.4, 1, 0.9, 3.2], lp: 850, uni: 22, vib: [0.3, 24, 0], rev: 0.6, gate: 1, pan: -0.2},
        pad2:  {w: "p25", v: 0.075, env: [0.5, 0.6, 0.9, 0.8], lp: 850, uni: 22, vib: [0.3, 24, 0], rev: 0.5, gate: 1, pan: -0.2},       // combat: chords change every bar, so a short tail
        choir: {w: "saw", v: 0.19, env: [1.6, 1, 0.85, 2.6], fmt: [[520, 7, 1], [1040, 8, 0.55], [2500, 6, 0.2]], uni: 8, vib: [4.4, 14, 0.6], rev: 0.7, gate: 1},
        glass: {w: "sine", v: 0.10, env: [0.5, 1, 0.7, 2.2], vib: [3.8, 14, 0.8], stack: [12], echo: 0.45, rev: 0.65},
        bell:  {w: "sine", v: 0.09, env: [0.002, 3, 0, 1.8], stack: [17.5], echo: 0.4, rev: 0.7, pan: 0.3},
        grind: {w: "saw", v: 0.10, env: [0.004, 0.12, 0.5, 0.1], lp: 600, fe: [9, 2.2, 0.14], rev: 0.1}
      },
      drums: {v: 0.55, pats: {
        W: {w: "x..............."}, G: {g: "x...............", w: "x..............."}, M: {m: "..........o....."}, N: {m: "....o...........", a: "..............o."},
        S: {b: "x..............."}, C1: {b: "x...x...x...x...", m: "..o...o...o...o."}, C2: {b: "x...x...x...x...", T: "..x.......x.....", m: "..o...o...o...o.", a: "............o..."},
        C3: {b: "x.x.x.x.x.x.x.x.", T: "....X.......X...", m: "o.o.o.o.o.o.o.o."}, CF: {b: "x...x...x...x...", T: "..x.x.xxxxXxXXXX", c: "x..............."}}},
      sec: function (c) {
        var o = {}, t = Math.max(c.idx, 0), cls = c.cls, L = c.len, rn = c.rnd, B = 36 + c.root, sus = {"": "sus2", "6": "sus2", maj7: "sus2", add9: "sus2", "7": "sus4"};
        o.chords = chordStr(cls === "dr" ? c.cp : merge2(c.cp), function (x) { return cls === "jy" || cls === "dr" ? x.q : sus[x.q] || x.q; });
        o.drone = hold(B, L);
        if (cls !== "cm" || t > 0) o.fifth = hold(B + (cls === "tn" ? (t > 1 ? 6 : 1) : 7) + 12, L);
        if (cls !== "cm" || t > 0) o[cls === "dr" ? "pad2" : "pad"] = pat("c" + HOLD, 3);
        if (cls === "sc" || cls === "en") o.choir = thin(c.lead, {grid: t > 0 || c.idx < 0 ? 16 : 32, hold: 1, cap: 32, sh: -12}, rn, L);
        else if (cls === "tn") { if (t > 0) o.glass = thin(c.lead, {grid: 16, keep: 0.1, hold: 1, cap: 16}, rn, L); }
        else if (cls === "dr") { if (t > 0) o.choir = thin(c.lead, {grid: 8, hold: 1, cap: 16, sh: -12}, rn, L); }
        else if (t > 0) o.glass = thin(c.lead, {grid: cls === "jy" ? 8 : 16, hold: 1, cap: 24}, rn, L);
        if (cls === "dr" ? t > 1 : (t >= 2 || cls === "jy" || t === 0 || cls === "en")) o.bell = thin(c.lead, {grid: 99, keep: cls === "dr" ? 0.08 : cls === "jy" ? 0.4 : t === 0 ? 0.12 : 0.25, sh: 12, d: 8}, rn, L);
        if (cls === "dr") {
          o.grind = pat(pick(["R---------------", "R---R---R---R---", "R-R-R-R-R-R-R-R-", "R-RRR-RRR-RRR-RR"], t), 2);
          o.drums = pick(["S C1 C1 C1 C1 C1 C1 CF", "C1 C1 C1 C1 C2 C2 C2 CF", "C2 C2 C2 C2 C3 C3 C3 CF", "C3 C3 C3 C3 C3 C3 C3 CF"], t);
        } else if (cls === "tn") o.drums = pick(["W - - - - - - -", "W - M - - - N -", "G - M - N - M -", "W - N M - N - M"], t);
        else o.drums = pick(["W - - - - - - -", "W - - - M - - -", "G - - - M - - W", "W - M - - - G -"], t);
        return o;
      }
    },

    /* ---------- gothic organ: block chords on a pedal, reed melody (parallel fifths in the solemn moods), slow flute arpeggios, timpani ---------- */
    organ: {
      lift: ["lead", "lead5", "flute"], dly: [0.75, 0.3], trim: {title: 0.2, calm: -3.5, holy: -1.0, tense: -8.3, battle: -3.6, boss: -4.5, warp: -0.3, tau: -1.6, aeldari: -1.1, necron: -5.4, orks: -2.2, gsc: -1.0, mechanicus: -2.5, happy: -2.0, death: -3.2, bad: -1.7},
      moods: {title: "sc 66", calm: "cm 72", holy: "sc 58", tense: "tn 78", battle: "dr 126", boss: "dr 138", warp: "tn 66 w", tau: "cm 88",
              aeldari: "cm 62", necron: "tn 76", orks: "dr 118", gsc: "sc 58", mechanicus: "tn 84", happy: "jy 96", death: "en 52", bad: "en 50"},
      ch: {
        full:  {w: "organ", v: 0.07, env: [0.06, 0.2, 0.95, 0.35], lp: 3200, rev: 0.5, gate: 1},
        ped:   {w: "organ", v: 0.22, env: [0.04, 0.2, 0.95, 0.4], lp: 420, stack: [12], rev: 0.25, gate: 1},
        lead:  {w: "reed", v: 0.085, env: [0.05, 0.2, 0.8, 0.35], lp: 2600, vib: [5, 10, 0.4], rev: 0.5, echo: 0.15},
        lead5: {w: "reed", v: 0.07, env: [0.06, 0.2, 0.8, 0.4], lp: 2300, vib: [4.8, 10, 0.4], stack: [7, 12], rev: 0.55, echo: 0.15},
        flute: {w: "flute", v: 0.08, env: [0.01, 0.4, 0.1, 0.4], echo: 0.3, rev: 0.5, pan: -0.25},
        choir: {w: "saw", v: 0.12, env: [0.7, 0.7, 0.9, 1.3], fmt: [[700, 6, 1], [1100, 7, 0.6], [2800, 6, 0.25]], uni: 9, vib: [4.5, 12, 0], rev: 0.65, gate: 1, pan: 0.15},
        toc:   {w: "organ", v: 0.055, env: [0.003, 0.07, 0.45, 0.05], lp: 3400, pan: -0.2},
        stab:  {w: "organ", v: 0.06, env: [0.004, 0.1, 0.5, 0.12], lp: 3000, rev: 0.3}
      },
      drums: {v: 0.6, pats: {
        G: {g: "x...............", c: "x..............."}, T1: {T: "x.......x......."}, T2: {T: "x...x...x...x..."}, T3: {T: "X...x...X.x.x...", g: "X..............."},
        TR: {T: "xoxoxoxoxoxoxoxo"}, TF: {T: "X.x.x.xxxxXxXXXX", c: "x..............."}, Z: {w: "x..............."}}},
      sec: function (c) {
        var o = {}, t = Math.max(c.idx, 0), cls = c.cls, L = c.len, rn = c.rnd, odd = t % 2 === 1, cl = c.cp.slice(), lastc = cl[cl.length - 1];
        if ((cls === "tn" || cls === "dr") && odd && lastc.d === 16 && (lastc.q === "" || lastc.q === "7"))      // Toccata colour: the last bar goes through a diminished seventh
          cl[cl.length - 1] = {pc: (lastc.pc + 4) % 12, q: "dim7", bass: null, d: 16, s: lastc.s};
        o.chords = chordStr(cl);
        o.full = pat("c" + HOLD, 3);
        o.ped = (t === 2 && cls !== "dr") ? hold(24 + c.root + 12, L) : pat("R" + HOLD, 2);                    // A2: a tonic pedal under the moving chords
        if (cls === "cm" || cls === "jy") {
          if (t > 0 || c.idx < 0) o.lead = thin(c.lead, {grid: cls === "jy" ? 2 : 8, hold: 1, cap: 16}, rn, L);
          if (t > 0) o.flute = cellOr(c, pick(["0-2-4-2-", "0-2-4-2-", "0242024202420242", "0-2-4-5-"], t), 4, cls === "jy" ? 1 : 2);
          if (t > 1) o.choir = pat("c" + HOLD, 4);
          o.drums = pick(["G - - - - - - -", "G - - - - - - -", "G - - - - - - T1", "G - T1 - T1 - T1 -"], t);
          if (cls === "jy") o.drums = pick(["G - - - T1 - - -", "G - T1 - T1 - T1 -", "G T1 T1 T1 T1 T1 T1 T1", "G T2 T2 T2 T2 T2 T2 T3"], t);
        } else if (cls === "sc" || cls === "en") {
          if (t > 0 || c.idx < 0) o.lead5 = thin(c.lead, {grid: 4, hold: 1, cap: 24}, rn, L);
          o.choir = pat("c" + HOLD, 4);
          if (t > 0) o.flute = cellOr(c, t > 2 ? "0242" : "0-2-4-2-", 4, 2);
          o.drums = pick(["Z - - - - - - -", "G - - - - - - -", "G - - - T1 - - -", "Z - - T1 - - T1 -"], t);
        } else if (cls === "tn") {
          o.lead = thin(c.lead, {grid: 8, keep: 0.2, hold: 1, cap: 12}, rn, L);
          o.toc = t > 0 ? cellOr(c, pick(["0.0.0.0.0.0.0.0.", "0.1.0.1.0.2.0.1.", "0.0.1.0.0.1.2.1.", "0123210123210123"], t), 4) : pat("0.0.0.0.0.0.0.0.", 4);
          o.drums = pick(["Z - - - - - - -", "T1 - - - T1 - - -", "G - T1 - T1 - T1 -", "T1 T1 T2 T1 T2 T1 T3 T1"], t);
        } else {                                                                                                // dr: toccata arpeggios + timpani march
          o.lead = thin(c.lead, {grid: 2, hold: 1, cap: 8}, rn, L);
          o.toc = cellOr(c, pick(["0123", "0121", "0123210123210123", "0123"], t), 4);
          o.stab = pat("c-..c-..c-..c-..", 3);
          o.ped = pat(pick(["R-------R-------", "R-R-R-R-R-R-R-R-", "R-R-O-R-R-R-O-R-", "R-RRR-RRR-RRR-RR"], t), 2);
          o.drums = pick(["G T2 T2 T2 T2 T2 T2 TF", "T2 T2 T2 T2 T2 T2 T2 TF", "G T3 T3 T3 T3 T3 T3 TF", "T3 T3 T3 T3 T3 T3 T3 TF"], t);
        }
        return o;
      }
    },

    /* ---------- synthwave: saw bass, plucky arpeggios, gated pads, saw leads with a dotted echo, four-on-the-floor in combat ---------- */
    synth: {
      lift: ["lead"], dly: [0.75, 0.38], trim: {title: -0.1, calm: -4.6, holy: -1.4, tense: -1.2, battle: 1.7, boss: 1.0, warp: 6.3, tau: 4.1, aeldari: -1.6, necron: 1.9, orks: 3.1, gsc: -1.5, mechanicus: 3.0, happy: 3.5, death: -3.4, bad: -1.8},
      moods: {title: "sc 100", calm: "cm 92", holy: "sc 84", tense: "tn 108", battle: "dr 142", boss: "dr 154", warp: "tn 96 w", tau: "jy 116",
              aeldari: "cm 90", necron: "tn 104", orks: "dr 132", gsc: "sc 86", mechanicus: "dr 118", happy: "jy 124", death: "en 66", bad: "en 62"},
      ch: {
        bass: {w: "saw", v: 0.2, env: [0.004, 0.12, 0.6, 0.06], fe: [14, 5, 0.15], gate: 0.8},
        sub:  {w: "sine", v: 0.26, env: [0.02, 0.2, 0.9, 0.2], gate: 1},
        arp:  {w: "p25", v: 0.06, env: [0.002, 0.1, 0.15, 0.08], lp: 3800, echo: 0.4, rev: 0.2, pan: -0.25},
        pad:  {w: "saw", v: 0.05, env: [0.02, 0.15, 0.55, 0.1], lp: 1700, uni: 14, rev: 0.3, pan: 0.2},
        wash: {w: "saw", v: 0.045, env: [0.9, 0.6, 0.85, 1.2], lp: 1300, uni: 16, rev: 0.5, gate: 1},
        lead: {w: "saw", v: 0.08, env: [0.01, 0.2, 0.7, 0.2], lp: 3600, uni: 12, vib: [5.5, 11, 0.25], echo: 0.35, rev: 0.25},
        shim: {w: "tri", v: 0.07, env: [0.005, 0.3, 0.3, 0.5], stack: [12, 19], uni: 8, vib: [6, 14, 0.2], echo: 0.45, rev: 0.5, pan: 0.15}
      },
      drums: {v: 0.55, pats: {
        L: {k: "x.......x.......", h: "..x...x...x...x."}, F: {k: "x...x...x...x...", p: "....x.......x...", h: "..x...x...x...x."},
        F2: {k: "x...x...x...x...", p: "....x.......x...", h: "..xoxox.x.xoxox.", H: "..............o."}, K: {k: "x...............", h: "..o...o...o...o."},
        FF: {k: "x...x...x...x...", p: "....x...x.x.xxxx", T: "............x.x.", c: "x..............."}, C: {c: "x..............."}, H: {h: "..o...o...o...o."}}},
      sec: function (c) {
        var o = {}, t = Math.max(c.idx, 0), cls = c.cls, L = c.len, rn = c.rnd, X7 = {"": "maj7", m: "m7"};
        o.chords = chordStr(c.cp, function (x) { return cls === "dr" ? x.q : X7[x.q] || x.q; });
        if (cls === "cm") {
          o.sub = pat("R" + HOLD, 2);                                                                              // slow bass, shimmering arps, pad wash, a lazy kick
          o.bass = t > 0 ? pat("R-R-O-R-R-R-O-R-", 2) : null;
          o.arp = t > 0 ? cellOr(c, pick(["0.1.2.1.", "0-1-2-1-", "0123210123210123", "0.1.2.3.2.1.0.1."], t), 4, t === 1 ? 2 : 1) : null;
          o.wash = pat("c" + HOLD, 3);
          o.lead = thin(c.lead, {grid: 2, hold: 0}, rn, L);
          if (t === 0) o.lead = null;
          o.drums = pick(["K - - - - - - -", "L L L L L L L L", "L L L L L L L F", "L L L L L L L F2"], t);
        } else if (cls === "sc") {
          o.sub = pat("R" + HOLD, 2); o.wash = pat("c" + HOLD, 3);
          o.arp = t > 0 ? cellOr(c, pick(["0.1.2.1.", "0.1.2.1.", "0-2-4-2-", "0-1-2-3-"], t), 4, 2) : null;
          o.lead = t > 0 || c.idx < 0 ? thin(c.lead, {grid: 4, hold: 1, cap: 16}, rn, L) : null;
          o.drums = pick(["K - - - - - - -", "K - - - K - - -", "L - L - L - L -", "L L L L L L L L"], t);
        } else if (cls === "tn") {
          o.bass = pat(pick(["R.R.R.R.R.R.R.R.", "R.RR.RR.R.RR.RR.", "R.RR.RR.R.RR.RR.", "RRRR.RRRRRRR.RRR"], t), 2);
          o.arp = t > 0 ? cellOr(c, pick(["0.1.2.1.", "0.1.2.1.", "0120121201201210", "0.2.1.2.0.2.1.2."], t), 4, t === 1 ? 2 : 1) : null;
          o.pad = t > 1 ? pat("c.c.c.c.c.c.c.c.", 3) : null; o.wash = pat("c" + HOLD, 3);
          o.lead = t > 0 ? thin(c.lead, {grid: 8, keep: 0.2, hold: 1, cap: 8}, rn, L) : null;
          o.drums = pick(["K - - - - - - -", "K K K K K K K K", "L L L L L L L L", "L L L L L L L F"], t);
        } else if (cls === "dr") {
          o.bass = pat(pick(["R-R-R-R-R-R-R-R-", "R.RRR.RRR.RRR.RR", "RRRRRRRRRRRRRRRR", "R-RRR-RRO-RRR-RR"], t), 2);
          o.arp = cellOr(c, pick(["0.1.2.1.", "0123", "0123210123210123", "0123"], t), 4);
          o.pad = pat(pick(["c-..c-..c-..c-..", "c--c--c-c--c--c-", "c-c-c-c-c-c-c-c-", "c--c--c-c--c--c-"], t), 3);
          o.lead = t > 0 ? thin(c.lead, {grid: 2, hold: 0}, rn, L) : null;
          o.drums = pick(["C F F F F F F FF", "F F F F F F F FF", "C F2 F2 F2 F2 F2 F2 FF", "F2 F2 F2 F2 F2 F2 F2 FF"], t);
        } else if (cls === "jy") {
          o.bass = pat(pick(["R-O-R-O-R-O-R-O-", "R-O-R-O-R-O-R-O-", "R-O-2-O-R-O-2-O-", "R-O-2-O-R-O-2-O-"], t), 2);
          o.arp = cellOr(c, pick(["0.1.2.1.", "0123", "0123210123210123", "0123"], t), 4, t === 0 ? 2 : 1);
          o.pad = pat(pick(["c-c-c-c-c-c-c-c-", "c--c--c-c--c--c-", "c-c-c-c-c-c-c-c-", "c--c--c-c--c--c-"], t), 3);
          o.lead = t > 0 || c.idx < 0 ? thin(c.lead, {grid: 2, hold: 0}, rn, L) : null;
          if (t > 1) o.shim = thin(c.lead, {grid: 8, hold: 1, cap: 12, sh: 12}, rn, L);
          o.drums = pick(["F F F F F F F F", "F F F F F F F FF", "C F2 F2 F2 F2 F2 F2 FF", "F2 F2 F2 F2 F2 F2 F2 FF"], t);
        } else {                                                                                                // en
          o.sub = pat("R" + HOLD, 2); o.wash = pat("c" + HOLD, 3);
          o.arp = t > 0 ? pat("0-2-4-2-", 4, 2) : null;
          o.lead = thin(c.lead, {grid: 8, hold: 1, cap: 24}, rn, L);
          if (t > 2) o.shim = thin(c.lead, {grid: 8, hold: 1, cap: 16, sh: 12}, rn, L);
          o.drums = pick(["- - - - - - - -", "K - - - - - - -", "K - - - K - - -", "K - - K - - K -"], t);
        }
        for (var k in o) if (o[k] == null) delete o[k];
        return o;
      }
    },

    /* ---------- piano & strings: sparse piano motifs with a broken-chord left hand, slow string pads; battle = driving string ostinato ---------- */
    piano: {
      lift: ["piano", "vln"], dly: [0.75, 0.3], trim: {title: 4.8, calm: 3.8, holy: 3.7, tense: -3.5, battle: -1.3, boss: -2.2, warp: 3.5, tau: 2.6, aeldari: 6.5, necron: -1.2, orks: 0.4, gsc: 3.7, mechanicus: 1.6, happy: 2.1, death: 2.2, bad: 3.6},
      moods: {title: "sc 60", calm: "cm 66", holy: "sc 54", tense: "tn 80", battle: "dr 132", boss: "dr 148", warp: "tn 64 w", tau: "jy 96",
              aeldari: "cm 62", necron: "tn 76", orks: "dr 120", gsc: "sc 56", mechanicus: "tn 92", happy: "jy 108", death: "en 52", bad: "en 50"},
      ch: {
        piano: {w: "pno", v: 0.19, env: [0.003, 1.2, 0, 0.7], fe: [14, 3, 0.4], echo: 0.15, rev: 0.4, pan: -0.1},
        lh:    {w: "pno", v: 0.2, env: [0.004, 1.6, 0, 0.9], fe: [9, 2.5, 0.5], rev: 0.35, pan: 0.1},
        oct:   {w: "pno", v: 0.1, env: [0.003, 0.9, 0, 0.6], fe: [14, 3, 0.4], stack: [-12], rev: 0.35},
        str:   {w: "saw", v: 0.075, env: [0.9, 0.6, 0.85, 1.3], lp: 1600, uni: 13, vib: [5.3, 9, 0.7], rev: 0.55, gate: 1, pan: 0.2},
        vln:   {w: "saw", v: 0.09, env: [0.15, 0.3, 0.75, 0.6], lp: 2400, uni: 9, vib: [5.5, 16, 0.4], rev: 0.5, pan: -0.15},
        cello: {w: "saw", v: 0.19, env: [0.1, 0.3, 0.8, 0.4], lp: 700, vib: [5, 10, 0.3], rev: 0.3, gate: 1},
        ost:   {w: "saw", v: 0.07, env: [0.004, 0.07, 0.4, 0.04], lp: 2300, uni: 6, pan: -0.2},
        stab:  {w: "saw", v: 0.05, env: [0.005, 0.12, 0.45, 0.1], lp: 2000, uni: 10, rev: 0.25, pan: 0.2}
      },
      drums: {v: 0.6, pats: {
        W: {w: "x..............."}, C: {c: "x..............."}, T1: {T: "x.......x......."}, T2: {T: "x...x...x...x..."}, T3: {T: "X...x...X.x.x...", c: "x..............."},
        TF: {T: "X.x.x.xxxxXxXXXX", c: "x..............."}, S: {T: "x..............."}}},
      sec: function (c) {
        var o = {}, t = Math.max(c.idx, 0), cls = c.cls, L = c.len, rn = c.rnd, X9 = {"": "add9", m: "madd9"};
        o.chords = chordStr(c.cp, function (x) { return cls === "dr" ? x.q : X9[x.q] || x.q; });
        if (cls === "cm" || cls === "jy") {
          o.lh = cellOr(c, pick(["02420242", "02420242", "0242024202420242", "02420242"], t), 3, 2);
          o.piano = (t > 0 || c.idx < 0) ? thin(c.lead, {grid: cls === "jy" ? 4 : 8, keep: cls === "jy" ? 0.6 : 0.2}, rn, L) : null;
          o.str = t > 0 ? pat("c" + HOLD, 3) : null;
          if (t > 1) o.vln = thin(c.lead, {grid: 8, hold: 1, cap: 16, sh: 12}, rn, L);
          o.drums = pick(["W - - - - - - -", "- - - - - - - -", "- - - - - - - -", "C - - - - - - -"], t);
          if (cls === "jy" && t > 1) o.drums = "T1 - T1 - T1 - T1 -";
        } else if (cls === "sc" || cls === "en") {
          o.lh = cellOr(c, pick(["0-2-4-2-", "0-2-4-2-", "02420242", "02420242"], t), 3, 2);
          o.piano = thin(c.lead, {grid: 8, keep: 0.15}, rn, L);
          o.str = pat("c" + HOLD, 3); o.cello = pat("R" + HOLD, 2);
          if (t > 0) o.vln = thin(c.lead, {grid: 16, hold: 1, cap: 32, sh: 12}, rn, L);
          o.drums = pick(["W - - - - - - -", "- - - - - - - -", "S - - - - - - -", "W - - - - - - -"], t);
        } else if (cls === "tn") {
          o.lh = pat(pick(["0.....2.......0.", "0...2...0...2...", "0.2.0.2.0.2.0.2.", "0.2.4.2.0.2.4.2."], t), 3);
          o.piano = thin(c.lead, {grid: 8, keep: 0.25}, rn, L);
          o.str = pat("c" + HOLD, 3); o.cello = pat("R" + HOLD, 2);
          if (t > 1) o.ost = cellOr(c, pick(["", "", "0.0.0.0.0.0.0.0.", "0.0.0.0.0.0.0.2."], t), 4);
          o.drums = pick(["W - - - - - - -", "S - - - - - - -", "S - - - S - - -", "S - - S - - S -"], t);
        } else {                                                                                                // dr: driving string ostinato, octave piano, timpani
          o.ost = pat(pick(["R-R-R-R-R-R-R-R-", "RRRRRRRRRRRRRRRR", "R.RRR.RRR.RRR.RR", "RORORORORORORORO"], t), 3);
          o.cello = pat(pick(["R---R---R---R---", "R-R-R-R-R-R-R-R-", "R-R-R-R-R-R-R-R-", "R-RRR-RRR-RRR-RR"], t), 2);
          o.stab = pat("c---------------", 3);
          o.oct = thin(c.lead, {grid: 2, hold: 0}, rn, L);
          if (t > 1) o.vln = thin(c.lead, {grid: 4, hold: 1, cap: 8, sh: 12}, rn, L);
          o.drums = pick(["C T2 T2 T2 T2 T2 T2 TF", "T2 T2 T2 T2 T2 T2 T2 TF", "C T3 T3 T3 T3 T3 T3 TF", "T3 T3 T3 T3 T3 T3 T3 TF"], t);
        }
        for (var k in o) if (o[k] == null || o[k] === "") delete o[k];
        if (o.ost && !o.ost.p) delete o.ost;
        return o;
      }
    }
  };
  var STYLE_IDS = STYLE_LIST.map(function (s) { return s.id; });
  STYLE_LIST.forEach(function (s) { if (STYLES[s.id]) STYLES[s.id].name = s.name.en; });

  var styleSongs = {};
  function songOf(id, style) {
    if (!style || style === "chip") return SONGS[id];
    var k = style + ":" + id;
    return styleSongs[k] || (styleSongs[k] = buildStyleSong(style, id));
  }
  function buildStyleSong(style, mood) {
    var ST = STYLES[style], src = SONGS[mood], mv = ST.moods[mood].split(" "), errs = [], cls = mv[0];
    var rs0 = resolveSection(src, src.order[0], errs), cp0 = parseChords(rs0.chords, 16, errs, mood).list[0];
    var root = cp0.pc, minor = cp0.iv[1] === 3, loopBars = 0, plan = [];
    (src.intro || []).forEach(function (n) { plan.push({name: n, from: n, idx: -1}); });
    src.order.forEach(function (n, i) { loopBars += parseChords(resolveSection(src, n, errs).chords, 16, errs, mood).len / 16; });
    var short = loopBars < 16;                          // a loop of < 16 bars (death) is played twice, the second time with every layer
    src.order.forEach(function (n, i) { plan.push({name: n + "." + i, from: n, idx: short ? i + 1 : i}); });   // own name per position: the chip order may repeat a section (A B A2 B)
    if (short) src.order.forEach(function (n, i) { plan.push({name: n + "." + (i + src.order.length), from: n, idx: i + 3}); });
    var secs = {}, used = {}, intro = [], order = [];
    plan.forEach(function (it, pi) {
      var rs = resolveSection(src, it.from, errs), cp = parseChords(rs.chords, 16, errs, mood), lead = [];
      var ls = rs.lead || rs.chant || rs.lead2 || rs.bell, cell = null;
      if (typeof ls === "string") lead = parseLiteral(ls, 16, [], "").notes;
      ["arp", "harp", "ost", "pulse", "data", "glint"].some(function (k) { var v = rs[k]; if (v && typeof v === "object" && v.p) { cell = {p: v.p, r: v.r || 1}; return true; } });
      var sec = ST.sec({cls: cls, mood: mood, idx: it.idx, cp: cp.list, len: cp.len, root: root, minor: minor, lead: lead, cell: cell, rnd: rng(hashStr(style + mood) + pi * 977)});
      if (it.idx >= 2) {                                // A2 / B2 (and the second pass of a short loop): the melody answers an octave higher
        sec.tr = {};
        ST.lift.forEach(function (k) {
          if (Array.isArray(sec[k])) sec[k] = sec[k].map(function (n) { return {s: n.s, d: n.d, m: n.m + (n.m < 84 ? 12 : 0)}; });   // not above ~C7
          else if (sec[k]) sec.tr[k] = 12;
        });
      }
      secs[it.name] = sec;
      for (var k in sec) if (!RESERVED[k]) used[k] = 1;
      (it.idx < 0 ? intro : order).push(it.name);
    });
    var ch = {};
    for (var k in used) ch[k] = ST.ch[k];
    var db = Math.pow(10, (ST.trim[mood] || 0) / 20);
    var song = {key: ST.name + " · " + src.key, bpm: +mv[1], meter: 16, ch: ch, drums: ST.drums, sections: secs, order: order, intro: intro, dly: ST.dly, trim: db};
    if (mv[2] === "w" && src.wobble) { song.wobble = src.wobble; song.rnd = src.rnd; }
    return song;
  }

  /* =====================================================================================
   * 3. SYNTH ENGINE (works on a live AudioContext or an OfflineAudioContext)
   * ===================================================================================== */
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function volCurve(v) { return Math.pow(Math.max(0, Math.min(1, v)), 1.5); }

  function Engine(ctx, opts) {
    opts = opts || {};
    var E = this;
    E.ctx = ctx; E.rand = rng(opts.seed || 1234);
    E.waves = {};
    [["p12", 0.125], ["p25", 0.25], ["p50", 0.5]].forEach(function (d) {
      var n = 48, re = new Float32Array(n), im = new Float32Array(n);
      for (var k = 1; k < n; k++) re[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * d[1]);
      E.waves[d[0]] = ctx.createPeriodicWave(re, im);
    });
    [["organ", [1, 0.55, 0.38, 0.3, 0.12, 0.2, 0, 0.12]],               // pipe organ: 8' + 4' + 2 2/3' + 2' + mixture partials
     ["reed", [1, 0.5, 0.75, 0.3, 0.5, 0.2, 0.3, 0.12, 0.18, 0.08]],     // reed stop: strong odd partials
     ["flute", [1, 0.2, 0.07, 0.02]],                                      // soft flute
     ["pno", [1, 0.62, 0.38, 0.22, 0.13, 0.08, 0.05, 0.03]]               // hammer-struck string (the per-note filter does the decay)
    ].forEach(function (d) {
      var re = new Float32Array(d[1].length + 1), im = new Float32Array(d[1].length + 1);
      d[1].forEach(function (a, k) { im[k + 1] = a; });
      E.waves[d[0]] = ctx.createPeriodicWave(re, im);
    });
    var sr = ctx.sampleRate, nb = ctx.createBuffer(1, sr, sr), nd = nb.getChannelData(0);
    for (var i = 0; i < nd.length; i++) nd[i] = E.rand() * 2 - 1;
    E.noise = nb;
    var mb = ctx.createBuffer(1, sr, sr), md = mb.getChannelData(0), per = [];   // short-period "metallic" noise (NES mode-1 style)
    for (i = 0; i < 93; i++) per.push(E.rand() < 0.5 ? -1 : 1);
    for (i = 0; i < md.length; i++) md[i] = per[Math.floor(i / 3) % 93];
    E.metal = mb;
    // master chain
    E.master = ctx.createGain(); E.master.gain.value = opts.muted ? 0 : 1;
    E.comp = ctx.createDynamicsCompressor();
    E.comp.threshold.value = -10; E.comp.knee.value = 6; E.comp.ratio.value = 10; E.comp.attack.value = 0.003; E.comp.release.value = 0.2;
    E.out = ctx.createGain(); E.out.gain.value = 0.9;
    E.master.connect(E.comp); E.comp.connect(E.out); E.out.connect(ctx.destination);
    E.musicBus = ctx.createGain(); E.musicBus.connect(E.master);
    E.musicWet = ctx.createGain();
    E.sfxBus = ctx.createGain(); E.sfxBus.connect(E.master);
    E.sfxIn = ctx.createGain(); E.sfxIn.connect(E.sfxBus);
    // shared reverb (generated impulse response)
    E.conv = ctx.createConvolver();
    var len = Math.floor(sr * 2.4), ir = ctx.createBuffer(2, len, sr);
    for (var c = 0; c < 2; c++) {
      var d = ir.getChannelData(c), lp = 0;
      for (i = 0; i < len; i++) { lp += 0.35 * ((E.rand() * 2 - 1) - lp); d[i] = lp * Math.pow(1 - i / len, 2.6) * (i < sr * 0.012 ? i / (sr * 0.012) : 1); }
    }
    E.conv.buffer = ir;
    E.revOut = ctx.createGain(); E.revOut.gain.value = 0.55;
    E.musicWet.connect(E.conv); E.conv.connect(E.revOut); E.revOut.connect(E.master);
    E.sfxRev = ctx.createGain(); E.sfxRev.connect(E.conv);      // opt-in per sound (o.rev); gain follows sfx volume
    // sfx echo
    E.sfxEcho = ctx.createGain(); E.sfxEcho.gain.value = 0.3;
    E.sfxDelay = ctx.createDelay(1); E.sfxDelay.delayTime.value = 0.16;
    E.sfxFb = ctx.createGain(); E.sfxFb.gain.value = 0.3;
    E.sfxEcho.connect(E.sfxDelay); E.sfxDelay.connect(E.sfxFb); E.sfxFb.connect(E.sfxDelay); E.sfxDelay.connect(E.sfxBus);
    // distortion curve for "corrupt"
    var curve = new Float32Array(1024);
    for (i = 0; i < 1024; i++) { var x = i / 511.5 - 1; curve[i] = Math.tanh(x * 4); }
    E.curve = curve;
    E.pools = {music: [], drum: [], sfx: []}; E.drops = {};            // drops: notes refused by the polyphony caps (checked by audio_check)
    E.caps = {music: 40, drum: 14, sfx: 24};
    E.setMusic(opts.music == null ? 0.5 : opts.music, 0);
    E.setSfx(opts.sfx == null ? 0.7 : opts.sfx, 0);
  }
  Engine.prototype.ramp = function (param, v, sec) {
    var t = this.ctx.currentTime;
    param.cancelScheduledValues(t); param.setValueAtTime(param.value, t);
    if (sec > 0) param.linearRampToValueAtTime(v, t + sec); else param.setValueAtTime(v, t);
  };
  Engine.prototype.setMusic = function (v, sec) { var g = volCurve(v) * 0.9; this.ramp(this.musicBus.gain, g, sec == null ? 0.05 : sec); this.ramp(this.musicWet.gain, g, sec == null ? 0.05 : sec); };
  Engine.prototype.setSfx = function (v, sec) { var s = sec == null ? 0.05 : sec; this.ramp(this.sfxBus.gain, volCurve(v), s); this.ramp(this.sfxRev.gain, volCurve(v) * 0.4, s); };
  Engine.prototype.voiceOk = function (pool, t, end) {      // polyphony cap by scheduled time span
    var P = this.pools[pool], n = 0;
    for (var i = P.length - 1; i >= 0; i--) if (P[i] <= t) P.splice(i, 1); else n++;
    if (n >= this.caps[pool]) { this.drops[pool] = (this.drops[pool] || 0) + 1; return false; }
    P.push(end); return true;
  };
  Engine.prototype.osc = function (w) {
    var o = this.ctx.createOscillator();
    if (this.waves[w]) o.setPeriodicWave(this.waves[w]);
    else o.type = w === "tri" ? "triangle" : w === "saw" ? "sawtooth" : w === "sq" ? "square" : "sine";
    return o;
  };
  Engine.prototype.noiseSrc = function (buf) {
    var s = this.ctx.createBufferSource();
    s.buffer = buf || this.noise; s.loop = true;
    return s;
  };
  Engine.prototype.panner = function (pan) {
    if (!pan || !this.ctx.createStereoPanner) return null;
    var p = this.ctx.createStereoPanner(); p.pan.value = pan; return p;
  };

  /* ---------- Player: one per mood, cached; nodes reused across plays ---------- */
  function Player(E, id, style) {
    var P = this, ctx = E.ctx, S = songOf(id, style);
    P.E = E; P.id = id; P.style = style || "chip"; P.S = S; P.song = compileSong(id, style); P.active = false; P.stopAt = null;
    P.trim = S.trim || 1;                                  // per-song loudness trim (styles are calibrated against chip)
    P.out = ctx.createGain(); P.out.gain.value = 0; P.out.connect(E.musicBus);
    P.wet = ctx.createGain(); P.wet.gain.value = 0; P.wet.connect(E.musicWet);
    var beat = 60 / S.bpm, dl = S.dly || [0.75, 0.32];
    P.dly = ctx.createDelay(2); P.dly.delayTime.value = Math.min(1.9, beat * dl[0]);
    P.dlyLp = ctx.createBiquadFilter(); P.dlyLp.type = "lowpass"; P.dlyLp.frequency.value = 2600;
    P.dlyFb = ctx.createGain(); P.dlyFb.gain.value = Math.min(0.6, dl[1]);
    P.dly.connect(P.dlyLp); P.dlyLp.connect(P.dlyFb); P.dlyFb.connect(P.dly); P.dlyLp.connect(P.out);
    P.ch = {};
    Object.keys(S.ch).forEach(function (k) {
      var I = S.ch[k], c = {I: I, n: 0};
      c.inp = ctx.createGain(); c.inp.gain.value = I.v;
      var tail = c.inp;
      if (I.lp) { c.lp = ctx.createBiquadFilter(); c.lp.type = "lowpass"; c.lp.frequency.value = I.lp; c.lp.Q.value = 0.5; tail.connect(c.lp); tail = c.lp; }
      if (I.fmt) {                                         // formant bank (vowel-like "choir"): parallel band-passes [Hz, Q, gain]
        var mx = ctx.createGain();
        I.fmt.forEach(function (F) {
          var bp = ctx.createBiquadFilter(), fg = ctx.createGain(); bp.type = "bandpass"; bp.frequency.value = F[0]; bp.Q.value = F[1]; fg.gain.value = F[2];
          tail.connect(bp); bp.connect(fg); fg.connect(mx);
        });
        tail = mx;
      }
      var pn = E.panner(I.pan); if (pn) { tail.connect(pn); tail = pn; }
      tail.connect(P.out);
      if (I.echo) { c.echo = ctx.createGain(); c.echo.gain.value = I.echo; tail.connect(c.echo); c.echo.connect(P.dly); }
      if (I.rev) { c.rev = ctx.createGain(); c.rev.gain.value = I.rev; tail.connect(c.rev); c.rev.connect(P.wet); }
      if (I.vib) { c.lfoAmt = ctx.createGain(); c.lfoAmt.gain.value = I.vib[1]; }
      P.ch[k] = c;
    });
    var D = S.drums || {};
    P.drum = ctx.createGain(); P.drum.gain.value = D.v == null ? 0.5 : D.v; P.drum.connect(P.out);
    P.drumRev = ctx.createGain(); P.drumRev.gain.value = 0.12; P.drum.connect(P.drumRev); P.drumRev.connect(P.wet);
    var filt = function (type, f, q) { var b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q || 0.7; b.connect(P.drum); return b; };
    P.f = {s: filt("bandpass", 1900, 0.8), h: filt("highpass", 7500), c: filt("highpass", 3500), m: filt("bandpass", 3000, 1.5)};
    P.rand = rng(id.length * 7919 + 17);
  }
  Player.prototype.start = function (t, fade, seqIdx) {
    var P = this, E = P.E;
    P.seqIdx = seqIdx || 0; P.step = 0; P.nextTime = t + 0.06; P.t0 = P.nextTime; P.stopAt = null; P.active = true; P.loops = []; P.marks = [];
    Object.keys(P.ch).forEach(function (k) {
      var c = P.ch[k];
      if (c.lfoAmt && !c.lfo) { c.lfo = E.ctx.createOscillator(); c.lfo.frequency.value = c.I.vib[0]; c.lfo.connect(c.lfoAmt); c.lfo.start(t); }
    });
    P.fadeTo(1, fade, t);
  };
  Player.prototype.fadeTo = function (v, fade, t) {
    var tv = v * this.trim;
    [this.out.gain, this.wet.gain].forEach(function (g) {
      g.cancelScheduledValues(t); g.setValueAtTime(g.value, t);
      g.linearRampToValueAtTime(tv, t + Math.max(0.01, fade));
    });
  };
  Player.prototype.stop = function (t, fade) { if (!this.active) return; this.stopAt = t + Math.max(0.01, fade); this.fadeTo(0, fade, t); };
  Player.prototype.halt = function () {
    var P = this; P.active = false; P.stopAt = null;
    Object.keys(P.ch).forEach(function (k) { var c = P.ch[k]; if (c.lfo) { try { c.lfo.stop(); c.lfo.disconnect(); } catch (e) {} c.lfo = null; } });
  };
  Player.prototype.tempo = function (t) {           // seconds per 16th step (warp mood wobbles)
    var w = this.S.wobble, sd = this.song.stepSec;
    return w ? sd * (1 + w[0] * Math.sin(2 * Math.PI * (t - this.t0) / w[1])) : sd;
  };
  Player.prototype.pump = function (until) {
    var P = this, song = P.song, live = !P.E.offline;
    if (!P.active) return;
    if (live && P.nextTime < P.E.ctx.currentTime - 0.05) P.nextTime = P.E.ctx.currentTime + 0.02;   // resync after a stall
    while (P.nextTime < until && (P.stopAt == null || P.nextTime < P.stopAt)) {
      var sec = song.sections[song.seq[P.seqIdx]], sd = P.tempo(P.nextTime), evs = sec.ev[P.step];
      if (evs) for (var i = 0; i < evs.length; i++) {
        var e = evs[i];
        if (e.k) P.drumHit(e.k, P.nextTime, e.v);
        else if (Array.isArray(e.m)) for (var j = 0; j < e.m.length; j++) P.note(e.c, e.m[j], P.nextTime, e.d * sd, e.w, e.v * 0.8);
        else P.note(e.c, e.m, P.nextTime, e.d * sd, e.w, e.v);
      }
      P.nextTime += sd;
      if (++P.step >= sec.len) {
        P.step = 0; P.marks.push(P.nextTime);          // section boundary times (offline checks compare the loop seam with them)
        if (++P.seqIdx >= song.seq.length) { P.seqIdx = song.loopFrom; P.loops.push(P.nextTime); }
      }
    }
  };
  Player.prototype.note = function (key, midi, t, dur, wOverride, vel) {
    var P = this, E = P.E, ctx = E.ctx, c = P.ch[key];
    if (!c) return;
    var I = c.I, env = I.env || [0.01, 0.1, 0.7, 0.1], gate = I.gate == null ? 0.9 : I.gate;
    var len = Math.max(0.03, dur * gate), a = Math.min(env[0], len * 0.6), r = env[3], end = t + len + r * 1.5 + 0.02;
    if (!E.voiceOk("music", t, end)) return;
    var wv = wOverride || I.w;
    if (Array.isArray(wv)) wv = wv[c.n % wv.length];
    c.n++;
    var g = ctx.createGain(), peak = vel == null ? 1 : vel;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.setTargetAtTime(peak * env[2], t + a, Math.max(0.005, env[1] / 3));
    g.gain.setTargetAtTime(0, t + len, Math.max(0.005, r / 4));
    var f = mtof(midi), oscs = [], rnd = P.S.rnd ? (P.rand() * 2 - 1) * P.S.rnd : 0, nf = null;
    if (I.fe) {                                            // per-note low-pass sweep, cutoff = multiple of the pitch: [start x, end x, time constant s]
      nf = ctx.createBiquadFilter(); nf.type = "lowpass"; nf.Q.value = I.fq || 0.8;
      nf.frequency.setValueAtTime(Math.min(ctx.sampleRate * 0.45, f * I.fe[0]), t); nf.frequency.setTargetAtTime(Math.max(120, f * I.fe[1]), t, I.fe[2]);
      g.connect(nf); nf.connect(c.inp);
    } else g.connect(c.inp);
    var mk = function (freq, det, gain) {
      var o = E.osc(wv); o.frequency.value = freq; o.detune.value = det + rnd;
      if (gain !== 1) { var gg = ctx.createGain(); gg.gain.value = gain; o.connect(gg); gg.connect(g); oscs.push(gg); } else o.connect(g);
      oscs.push(o); return o;
    };
    var main = [mk(f, 0, I.uni ? 0.6 : 1)];
    if (I.uni) main.push(mk(f, I.uni, 0.6));
    (I.stack || []).forEach(function (st) { main.push(mk(f * Math.pow(2, st / 12), 0, 0.35)); });
    var vg = null;
    if (c.lfoAmt && c.lfo) {
      vg = ctx.createGain(); vg.gain.setValueAtTime(0, t);
      vg.gain.linearRampToValueAtTime(0, t + I.vib[2]); vg.gain.linearRampToValueAtTime(1, t + I.vib[2] + 0.25);
      c.lfoAmt.connect(vg);
      main.forEach(function (o) { vg.connect(o.detune); });
    }
    main.forEach(function (o) { o.start(t); o.stop(end); });
    main[0].onended = function () {
      try { g.disconnect(); if (nf) nf.disconnect(); oscs.forEach(function (n) { n.disconnect(); }); if (vg) { c.lfoAmt.disconnect(vg); vg.disconnect(); } } catch (e) {}
    };
  };
  Player.prototype.drumHit = function (k, t, vel) {
    var P = this, E = P.E, ctx = E.ctx;
    var end = t + (k === "c" ? 1.5 : k === "w" ? 2.6 : k === "z" ? 0.6 : k === "a" ? 0.8 : k === "T" ? 0.6 : k === "g" ? 3.8 : k === "b" ? 0.7 : 0.4);
    if (!E.voiceOk("drum", t, end)) return;
    var g = ctx.createGain(), src, o, extra = null;
    var env = function (peak, decay) { g.gain.setValueAtTime(peak, t); g.gain.exponentialRampToValueAtTime(0.0008, t + decay); };
    if (k === "k" || k === "t" || k === "T") {
      o = ctx.createOscillator(); o.type = "sine";
      var big = k === "T";               // T: big floor tom — lower, longer, with a skin "thwack"
      var f0 = k === "k" ? 150 : big ? 118 : 140, f1 = k === "k" ? 42 : big ? 50 : 72, dec = k === "k" ? 0.28 : big ? 0.55 : 0.38;
      o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dec * 0.4);
      env(vel * (k === "k" ? 0.95 : big ? 0.85 : 0.6), dec); o.connect(g); g.connect(P.drum); o.start(t); o.stop(t + dec + 0.02); src = o;
      if (k === "k" || big) {
        var ck = E.noiseSrc(), cg = ctx.createGain(), cd = big ? 0.045 : 0.012;
        cg.gain.setValueAtTime(vel * (big ? 0.35 : 0.25), t); cg.gain.exponentialRampToValueAtTime(0.001, t + cd);
        ck.connect(cg); cg.connect(big ? P.f.s : P.f.h); ck.start(t, P.rand()); ck.stop(t + cd + 0.01);
      }
    } else if (k === "a") {             // anvil / forge clang: inharmonic free-bar partials + a metallic transient
      var base = 430 * (0.98 + P.rand() * 0.04), parts = [];
      g.gain.value = vel * 0.1;
      [[1, 1, 0.7], [2.76, 0.55, 0.4], [5.4, 0.35, 0.22], [8.93, 0.2, 0.12]].forEach(function (pr, j) {
        var po = ctx.createOscillator(), pg = ctx.createGain(); po.type = "sine"; po.frequency.value = base * pr[0];
        pg.gain.setValueAtTime(pr[1], t); pg.gain.exponentialRampToValueAtTime(0.001, t + pr[2]);
        po.connect(pg); pg.connect(g); po.start(t); po.stop(t + pr[2] + 0.02); parts.push(pg);
        if (j === 0) src = po; else parts.push(po);
      });
      g.connect(P.drum);
      var an = E.noiseSrc(E.metal), ag = ctx.createGain();
      ag.gain.setValueAtTime(vel * 0.3, t); ag.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      an.connect(ag); ag.connect(P.f.m); an.start(t, P.rand()); an.stop(t + 0.04);
      parts.push(an, ag); extra = parts;
    } else if (k === "b") {             // sub-bass boom (dark style combat): slow sine drop, no click
      o = ctx.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(64, t); o.frequency.exponentialRampToValueAtTime(37, t + 0.3);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vel * 0.9, t + 0.012); g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      o.connect(g); g.connect(P.drum); o.start(t); o.stop(t + 0.65); src = o;
    } else if (k === "g") {             // gong / tam-tam: low inharmonic partials, slow shimmer
      var gp = [], gb = 92 * (0.97 + P.rand() * 0.06);
      g.gain.value = vel * 0.2; g.connect(P.drum); g.connect(P.wet);
      [[1, 1, 3.6], [1.52, 0.7, 3.1], [2.31, 0.5, 2.6], [2.96, 0.35, 2.2], [4.13, 0.2, 1.6]].forEach(function (pr, j) {
        var po = ctx.createOscillator(), pg = ctx.createGain(); po.type = "sine"; po.frequency.value = gb * pr[0];
        pg.gain.setValueAtTime(0.0001, t); pg.gain.linearRampToValueAtTime(pr[1], t + (j ? 0.05 : 0.02)); pg.gain.exponentialRampToValueAtTime(0.001, t + pr[2]);
        po.connect(pg); pg.connect(g); po.start(t); po.stop(t + pr[2] + 0.05); if (j === 0) src = po; else gp.push(po); gp.push(pg);
      });
      extra = gp;
    } else if (k === "p") {             // clap: three quick band-passed noise bursts + a short tail
      src = E.noiseSrc(); var cb = ctx.createBiquadFilter(); cb.type = "bandpass"; cb.frequency.value = 1500; cb.Q.value = 1.1;
      g.gain.setValueAtTime(0.0001, t);
      [0, 0.011, 0.023].forEach(function (dt, j) { g.gain.setValueAtTime(vel * (j < 2 ? 0.55 : 0.8), t + dt); g.gain.exponentialRampToValueAtTime(0.02, t + dt + 0.009); });
      g.gain.setValueAtTime(vel * 0.45, t + 0.032); g.gain.exponentialRampToValueAtTime(0.0008, t + 0.2);
      src.connect(cb); cb.connect(g); g.connect(P.drum); src.start(t, P.rand()); src.stop(t + 0.22); extra = cb;
    } else if (k === "i") {             // insect chitter: 3–5 tiny band-passed clicks at irregular spacing
      src = E.noiseSrc(); var bpi = ctx.createBiquadFilter(); bpi.type = "bandpass"; bpi.Q.value = 4; bpi.frequency.value = 4200 + P.rand() * 2000;
      var nc = 3 + Math.floor(P.rand() * 3), tc = t, lvl = vel * 0.9;
      g.gain.setValueAtTime(0.0001, t);
      for (var ci = 0; ci < nc; ci++) {
        g.gain.setValueAtTime(lvl, tc); g.gain.exponentialRampToValueAtTime(0.0001, tc + 0.005);
        tc += 0.012 + P.rand() * 0.016; lvl *= 0.8;
      }
      src.connect(bpi); bpi.connect(g); g.connect(P.drum); src.start(t, P.rand()); src.stop(tc + 0.02); extra = bpi;
    } else if (k === "s") {
      src = E.noiseSrc(); env(vel * 0.7, 0.17); src.connect(g); g.connect(P.f.s); src.start(t, P.rand()); src.stop(t + 0.2);
      o = ctx.createOscillator(); o.type = "triangle"; o.frequency.setValueAtTime(200, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.06);
      var tg = ctx.createGain(); tg.gain.setValueAtTime(vel * 0.4, t); tg.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      o.connect(tg); tg.connect(P.drum); o.start(t); o.stop(t + 0.1);
    } else if (k === "h" || k === "H") {
      src = E.noiseSrc(); env(vel * 0.3, k === "h" ? 0.04 : 0.22); src.connect(g); g.connect(P.f.h); src.start(t, P.rand()); src.stop(t + 0.25);
    } else if (k === "c") {
      src = E.noiseSrc(); env(vel * 0.32, 1.4); src.connect(g); g.connect(P.f.c); src.start(t, P.rand()); src.stop(t + 1.45);
    } else if (k === "m") {
      src = E.noiseSrc(E.metal); env(vel * 0.3, 0.09); src.connect(g); g.connect(P.f.m); src.start(t, P.rand()); src.stop(t + 0.1);
    } else if (k === "w") {             // wind / whoosh swell
      src = E.noiseSrc(); var bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 2.5;
      bp.frequency.setValueAtTime(300, t); bp.frequency.exponentialRampToValueAtTime(1800, t + 1.2); bp.frequency.exponentialRampToValueAtTime(250, t + 2.5);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vel * 0.35, t + 1.1); g.gain.exponentialRampToValueAtTime(0.0005, t + 2.5);
      src.connect(bp); bp.connect(g); g.connect(P.drum); src.start(t, P.rand()); src.stop(t + 2.55);
    } else if (k === "z") {             // glitch "scan": stepped (sample-and-hold) 12.5% pulse sweep up then down, with dropouts
      o = E.osc("p12"); var nz = 14, dz = 0.5, lv = vel * 0.13;
      g.gain.setValueAtTime(0, t);
      for (var q = 0; q < nz; q++) {
        var tq = t + q * dz / nz, ph = q < nz / 2 ? q / (nz / 2) : (nz - q) / (nz / 2);
        o.frequency.setValueAtTime(320 * Math.pow(7, ph) * (0.9 + P.rand() * 0.2), tq);
        g.gain.setValueAtTime(P.rand() < 0.22 ? lv * 0.1 : lv * (1 - 0.4 * q / nz), tq);
      }
      g.gain.exponentialRampToValueAtTime(0.0008, t + dz + 0.04);
      var zl = ctx.createBiquadFilter(); zl.type = "lowpass"; zl.frequency.value = 3800;
      o.connect(g); g.connect(zl); zl.connect(P.drum); zl.connect(P.wet); o.start(t); o.stop(t + dz + 0.06); src = o; extra = zl;
    }
    if (src) src.onended = function () {
      try { g.disconnect(); src.disconnect(); if (extra) [].concat(extra).forEach(function (n) { n.disconnect(); }); } catch (e) {}
    };
  };

  /* =====================================================================================
   * 4. SFX (synthesized, short)
   * ===================================================================================== */
  function tone(E, t, freq, dur, o) {
    o = o || {};
    var ctx = E.ctx, a = o.a == null ? 0.002 : o.a, r = o.r == null ? 0.04 : o.r, end = t + dur + r + 0.02;
    if (!E.voiceOk("sfx", t, end)) return null;
    var osc = E.osc(o.w || "p25"), g = ctx.createGain(), v = o.v == null ? 0.15 : o.v;
    osc.frequency.setValueAtTime(freq, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + (o.glide || dur));
    if (o.det) osc.detune.value = o.det;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + a);
    if (o.hold == null || o.hold) g.gain.setValueAtTime(v, t + Math.max(a, dur));
    g.gain.exponentialRampToValueAtTime(0.0005, t + dur + r);
    osc.connect(g);
    var tailNode = g;
    if (o.lp) { var f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = o.lp; g.connect(f); tailNode = f; }
    tailNode.connect(o.dest || E.sfxIn);
    if (o.echo) tailNode.connect(E.sfxEcho);
    if (o.rev) tailNode.connect(E.sfxRev);
    var lfo = null;
    if (o.vib) { lfo = ctx.createOscillator(); lfo.frequency.value = o.vib[0]; var lg = ctx.createGain(); lg.gain.value = o.vib[1]; lfo.connect(lg); lg.connect(osc.detune); lfo.start(t); lfo.stop(end); }
    osc.start(t); osc.stop(end);
    osc.onended = function () { try { g.disconnect(); osc.disconnect(); if (lfo) lfo.disconnect(); } catch (e) {} };
    return osc;
  }
  function noise(E, t, dur, o) {
    o = o || {};
    var ctx = E.ctx, a = o.a == null ? 0.002 : o.a, end = t + dur + 0.03;
    if (!E.voiceOk("sfx", t, end)) return null;
    var src = E.noiseSrc(o.metal ? E.metal : null), f = ctx.createBiquadFilter(), g = ctx.createGain(), v = o.v == null ? 0.2 : o.v;
    f.type = o.type || "bandpass"; f.Q.value = o.q || 0.8;
    f.frequency.setValueAtTime(o.f || 2000, t);
    if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + (o.mid ? dur * 0.45 : dur));
    if (o.f3) f.frequency.exponentialRampToValueAtTime(o.f3, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + Math.max(0.001, a));
    g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
    src.connect(f); f.connect(g); g.connect(o.dest || E.sfxIn);
    if (o.echo) g.connect(E.sfxEcho);
    if (o.rev) g.connect(E.sfxRev);
    src.start(t, E.rand()); src.stop(end);
    src.onended = function () { try { g.disconnect(); f.disconnect(); src.disconnect(); } catch (e) {} };
    return src;
  }
  var N = function (s) { return mtof(noteMidi(s)); };
  var SFX = {
    click: function (E, t) {
      tone(E, t, N("G6"), 0.022, {w: "p25", v: 0.24, to: N("E6"), r: 0.025});
      tone(E, t + 0.014, N("C7"), 0.02, {w: "p12", v: 0.1, r: 0.03});
      noise(E, t, 0.014, {type: "highpass", f: 6000, v: 0.12});
    },
    hover: function (E, t) { tone(E, t, N("E7"), 0.01, {w: "sine", v: 0.035, r: 0.02}); },
    select: function (E, t) {
      ["C5", "E5", "G5", "C6"].forEach(function (n, i) {
        tone(E, t + i * 0.055, N(n), i === 3 ? 0.16 : 0.05, {w: "p25", v: 0.11, r: i === 3 ? 0.15 : 0.03, echo: i === 3, rev: i === 3, vib: i === 3 ? [7, 15] : null});
      });
    },
    start: function (E, t) {
      var lead = ["G4", "C5", "E5", "G5"], harm = ["E4", "G4", "C5", "E5"];
      lead.forEach(function (n, i) { tone(E, t + i * 0.07, N(n), 0.06, {w: "p50", v: 0.1, r: 0.03}); tone(E, t + i * 0.07, N(harm[i]), 0.06, {w: "p25", v: 0.05, r: 0.03}); });
      var t2 = t + 0.28;
      tone(E, t2, N("C6"), 0.42, {w: "p50", v: 0.11, r: 0.3, vib: [6, 14], echo: true, rev: true});
      tone(E, t2, N("G5"), 0.42, {w: "p25", v: 0.055, r: 0.3});
      tone(E, t2, N("C3"), 0.4, {w: "tri", v: 0.3, r: 0.25});
      noise(E, t2, 0.9, {type: "highpass", f: 4000, v: 0.07});
    },
    type: function (E, t) {
      tone(E, t, 1800 + E.rand() * 500, 0.008, {w: "p12", v: 0.028, r: 0.012});
      noise(E, t, 0.008, {type: "highpass", f: 5000, v: 0.02});
    },
    damage: function (E, t) {
      noise(E, t, 0.28, {type: "lowpass", f: 3200, f2: 180, v: 0.35, q: 0.5});
      tone(E, t, 240, 0.2, {w: "p50", v: 0.12, to: 55, r: 0.05, hold: false});
      tone(E, t, 110, 0.25, {w: "sine", v: 0.35, to: 38, r: 0.08, hold: false});
    },
    heal: function (E, t) {
      ["E5", "G#5", "B5", "E6"].forEach(function (n, i) {
        tone(E, t + i * 0.065, N(n), 0.12, {w: "tri", v: 0.12, r: 0.3, rev: true});
        tone(E, t + i * 0.065 + 0.02, N(n) * 2, 0.08, {w: "p12", v: 0.025, r: 0.2, echo: true, rev: true});
      });
    },
    sanity: function (E, t) {
      tone(E, t, 880, 0.75, {w: "sine", v: 0.07, to: 415, a: 0.08, r: 0.3, vib: [7, 70], echo: true, rev: true});
      tone(E, t, 880 * 1.059, 0.75, {w: "sine", v: 0.06, to: 440, a: 0.1, r: 0.3, vib: [5.3, 90]});
      noise(E, t, 0.9, {type: "bandpass", f: 1400, f2: 500, q: 9, v: 0.06, a: 0.2});
    },
    corrupt: function (E, t) {
      var ctx = E.ctx, end = t + 1.4;
      if (!E.voiceOk("sfx", t, end)) return;
      var sh = ctx.createWaveShaper(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
      sh.curve = E.curve; lp.type = "lowpass"; lp.Q.value = 3;
      lp.frequency.setValueAtTime(180, t); lp.frequency.exponentialRampToValueAtTime(1600, t + 0.55); lp.frequency.exponentialRampToValueAtTime(200, t + 1.3);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.5); g.gain.exponentialRampToValueAtTime(0.0005, t + 1.35);
      var os = [55, 58.3, 82.4].map(function (f) { var o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(f, t); o.frequency.linearRampToValueAtTime(f * 0.94, t + 1.3); o.connect(sh); o.start(t); o.stop(end); return o; });
      sh.connect(lp); lp.connect(g); g.connect(E.sfxIn); g.connect(E.sfxRev);
      os[0].onended = function () { try { os.forEach(function (o) { o.disconnect(); }); sh.disconnect(); lp.disconnect(); g.disconnect(); } catch (e) {} };
    },
    event: function (E, t) {
      ["C4", "F#4", "Db5", "G5"].forEach(function (n) { tone(E, t, N(n), 0.45, {w: "p25", v: 0.06, to: N(n) * 0.94, glide: 0.6, r: 0.35}); });
      tone(E, t, 70, 0.35, {w: "sine", v: 0.35, to: 40, r: 0.1, hold: false, rev: true});
      noise(E, t, 1.3, {type: "highpass", f: 2500, v: 0.16, rev: true});
      tone(E, t + 0.5, N("C6"), 0.3, {w: "p12", v: 0.04, to: N("B5"), r: 0.3, echo: true, rev: true, vib: [9, 40]});
    },
    warp: function (E, t) {
      noise(E, t, 1.0, {type: "bandpass", f: 200, f2: 4000, f3: 300, mid: true, q: 4, v: 0.3, a: 0.25, rev: true});
      tone(E, t, 1200, 0.6, {w: "sine", v: 0.06, to: 80, r: 0.2, hold: false});
      for (var i = 0; i < 6; i++) tone(E, t + 0.08 + i * (0.05 + E.rand() * 0.05), 300 + E.rand() * 2700, 0.02, {w: "p12", v: 0.045, r: 0.01});
    },
    codex: function (E, t) {
      tone(E, t, N("B5"), 0.05, {w: "sine", v: 0.13, r: 0.45, hold: false, echo: true, rev: true});
      tone(E, t, N("B6"), 0.05, {w: "tri", v: 0.04, r: 0.3, hold: false});
      tone(E, t + 0.09, N("E6"), 0.06, {w: "sine", v: 0.14, r: 0.6, hold: false, echo: true, rev: true});
      tone(E, t + 0.09, N("E7"), 0.06, {w: "tri", v: 0.035, r: 0.4, hold: false});
    },
    save: function (E, t) {
      tone(E, t, N("E5"), 0.05, {w: "p12", v: 0.14, r: 0.03});
      tone(E, t + 0.07, N("B5"), 0.1, {w: "p12", v: 0.14, r: 0.12, echo: true, rev: true});
    },
    death: function (E, t) {
      tone(E, t, 110, 0.8, {w: "sine", v: 0.42, to: 30, r: 0.3, hold: false});
      noise(E, t, 1.1, {type: "lowpass", f: 900, f2: 120, v: 0.18});
      ["D4", "F4", "Ab4"].forEach(function (n) { tone(E, t + 0.05, N(n), 1.1, {w: "p50", v: 0.055, to: N(n) * 0.944, glide: 1.2, a: 0.03, r: 0.7, lp: 1600, rev: true}); });
      tone(E, t + 0.05, N("D3"), 1.1, {w: "tri", v: 0.2, to: N("C#3"), glide: 1.2, r: 0.7});
    },
    ending_good: function (E, t) {
      var lead = ["C5", "E5", "G5"], harm = ["G4", "C5", "E5"];
      lead.forEach(function (n, i) { tone(E, t + i * 0.09, N(n), 0.08, {w: "p50", v: 0.1, r: 0.03}); tone(E, t + i * 0.09, N(harm[i]), 0.08, {w: "p25", v: 0.05, r: 0.03}); });
      var t2 = t + 0.27;
      tone(E, t2, N("C6"), 0.6, {w: "p50", v: 0.11, r: 0.4, vib: [6, 14], echo: true, rev: true});
      tone(E, t2, N("E5"), 0.6, {w: "p25", v: 0.05, r: 0.4});
      tone(E, t2, N("G5"), 0.6, {w: "p25", v: 0.045, r: 0.4});
      tone(E, t, N("C3"), 0.25, {w: "tri", v: 0.28, r: 0.05});
      tone(E, t2, N("G2"), 0.12, {w: "tri", v: 0.28, r: 0.05});
      tone(E, t2 + 0.15, N("C3"), 0.45, {w: "tri", v: 0.28, r: 0.3});
      noise(E, t2, 1.2, {type: "highpass", f: 4000, v: 0.08});
    },
    consequence: function (E, t) {      // soft page-turn (rising filtered noise brush) + a quiet two-note chime
      noise(E, t, 0.16, {type: "bandpass", f: 700, f2: 3200, q: 1.2, v: 0.07, a: 0.06});
      noise(E, t + 0.1, 0.09, {type: "highpass", f: 4500, v: 0.035, a: 0.01});
      tone(E, t + 0.13, N("A5"), 0.04, {w: "sine", v: 0.075, r: 0.5, hold: false, rev: true});
      tone(E, t + 0.13, N("A6"), 0.03, {w: "tri", v: 0.015, r: 0.3, hold: false});
      tone(E, t + 0.21, N("E6"), 0.04, {w: "sine", v: 0.06, r: 0.6, hold: false, echo: true, rev: true});
    },
    scan: function (E, t) {             // necron scan: stepped 12.5% pulse sweep up/down, metallic grit, low servo hum
      var ctx = E.ctx, n = 16, d = 0.6, end = t + d + 0.08;
      if (!E.voiceOk("sfx", t, end)) return;
      var o = E.osc("p12"), g = ctx.createGain(), lp = ctx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = 4200;
      g.gain.setValueAtTime(0, t);
      for (var i = 0; i < n; i++) {
        var ti = t + i * d / n, ph = i < n / 2 ? i / (n / 2) : (n - i) / (n / 2);
        o.frequency.setValueAtTime(300 * Math.pow(8, ph) * (0.92 + E.rand() * 0.16), ti);
        g.gain.setValueAtTime(E.rand() < 0.2 ? 0.01 : 0.085, ti);
      }
      g.gain.exponentialRampToValueAtTime(0.0005, t + d + 0.05);
      o.connect(g); g.connect(lp); lp.connect(E.sfxIn); lp.connect(E.sfxEcho);
      o.start(t); o.stop(end);
      o.onended = function () { try { o.disconnect(); g.disconnect(); lp.disconnect(); } catch (e) {} };
      noise(E, t, 0.05, {metal: true, type: "bandpass", f: 3000, q: 1.5, v: 0.1});
      noise(E, t + d * 0.5, 0.05, {metal: true, type: "bandpass", f: 4200, q: 1.5, v: 0.07});
      tone(E, t, 55, d, {w: "p12", v: 0.07, to: 49, lp: 400, a: 0.04, r: 0.12});
    }
  };

  /* =====================================================================================
   * 5. LIVE CONTROLLER (WH.Audio)
   * ===================================================================================== */
  var ctx = null, E = null, unlocked = false, players = {}, curMood = null, curKind = null, wantMood = null;
  var curStyle = "chip", curPKey = null, preview = null;       // music style (SPEC §29); players are cached per style + mood (chip keeps the plain mood name)
  function pkey(style, mood) { return style === "chip" ? mood : style + ":" + mood; }
  function playerFor(style, mood) { var k = pkey(style, mood); return players[k] || (players[k] = new Player(E, mood, style)); }
  function knownStyle(id) { return STYLE_IDS.indexOf(id) >= 0 ? id : "chip"; }
  var lastSwitch = -1e9, pendingTimer = null, timer = null, lastType = 0, lastHover = 0;
  var musicVol = 0.5, sfxVol = 0.7, muted = false, failed = {}, files = {}, fileTimer = null;
  try { var saved = JSON.parse(root.localStorage.getItem(LS_KEY) || "{}"); muted = !!saved.muted; } catch (e) {}
  function persist() { try { root.localStorage.setItem(LS_KEY, JSON.stringify({muted: muted})); } catch (e) {} }
  function nowMs() { return (root.performance && performance.now) ? performance.now() : Date.now(); }
  function hidden() { return typeof document !== "undefined" && document.hidden; }

  function tick() {
    timer = null;
    if (!ctx) return;
    var any = false, t = ctx.currentTime;
    for (var k in players) {
      var p = players[k];
      if (!p.active) continue;
      if (p.stopAt != null && t > p.stopAt + 0.1) { p.halt(); continue; }
      any = true;
      if (!muted && ctx.state === "running") p.pump(t + 0.15);
    }
    if (any) timer = setTimeout(tick, 25);
  }
  function kick() { if (!timer) timer = setTimeout(tick, 0); }

  function fileUrl(mood) {
    var map = WH.audioFiles;
    if (!map || !map[mood] || failed[mood]) return null;
    return (WH.audioBase || "") + map[mood];
  }
  function fileVolumeTick() {
    var live = false;
    for (var k in files) {
      var f = files[k];
      var step = 0.05 / Math.max(0.05, f.fade);
      f.level += Math.max(-step, Math.min(step, f.target - f.level));
      try { f.el.volume = Math.max(0, Math.min(1, f.level * volCurve(musicVol) * (muted || hidden() ? 0 : 1))); } catch (e) {}
      if (f.target === 0 && f.level <= 0.001) { try { f.el.pause(); } catch (e) {} delete files[k]; continue; }
      live = true;
    }
    if (!live) { clearInterval(fileTimer); fileTimer = null; }
  }
  function startFile(mood, url, fadeSec) {
    if (typeof Audio === "undefined") return false;
    var f = files[mood];
    if (!f) {
      var el = new Audio();
      el.loop = true; el.preload = "auto"; el.volume = 0;
      f = files[mood] = {el: el, level: 0, target: 1, fade: fadeSec};
      var fallback = function () {
        if (failed[mood]) return;
        failed[mood] = true;
        try { el.pause(); } catch (e) {}
        delete files[mood];
        if (curMood === mood && curKind === "file") { curKind = null; curMood = null; apply(mood, 300); }
      };
      el.addEventListener("error", fallback);
      el.src = url;
      try { var pr = el.play(); if (pr && pr.catch) pr.catch(fallback); } catch (e) { fallback(); }
    } else { f.target = 1; f.fade = fadeSec; try { f.el.play(); } catch (e) {} }
    if (!fileTimer) fileTimer = setInterval(fileVolumeTick, 50);
    return true;
  }
  function stopCurrent(fadeSec) {
    if (!curMood) return;
    if (curKind === "file" && files[curMood]) { files[curMood].target = 0; files[curMood].fade = fadeSec; }
    else if (curPKey && players[curPKey]) players[curPKey].stop(ctx.currentTime, fadeSec);
  }
  function apply(mood, fadeMs) {
    if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = null; }
    if (!E) return;
    var fadeSec = (fadeMs == null ? (DEFAULT_FADE[mood] || 1500) : fadeMs) / 1000;
    if (mood === curMood) return;
    stopCurrent(fadeSec);
    curMood = mood; lastSwitch = nowMs();
    if (!mood) { curKind = null; return; }
    var url = fileUrl(mood);
    if (url && startFile(mood, url, fadeSec)) { curKind = "file"; return; }
    curKind = "synth"; curPKey = pkey(curStyle, mood);
    startPlayer(playerFor(curStyle, mood), fadeSec);
  }
  function startPlayer(p, fadeSec, seqIdx) {
    if (p.active && p.stopAt != null) p.halt();          // was fading out: restart from the top
    if (!p.active) p.start(ctx.currentTime, fadeSec, seqIdx);
    kick();
  }

  /* ---------- music styles (SPEC §29): setStyle crossfades the running mood; previewStyle plays a short sample ---------- */
  function setStyle(id) {
    id = knownStyle(id);
    if (id === curStyle) return id;
    curStyle = id;                                       // the module does not persist this; the UI keeps settings.musicStyle
    if (E && unlocked && !preview && curMood && curKind === "synth") {
      stopCurrent(1.5);                                  // old style fades out while the new one fades in (same mood, from the top)
      curPKey = pkey(id, curMood);
      startPlayer(playerFor(id, curMood), 1.5);
    }
    return id;
  }
  function endPreview(resume) {
    if (!preview) return;
    preview.timers.forEach(clearTimeout);
    preview.players.forEach(function (p) { if (p.active) p.stop(ctx.currentTime, 0.3); });
    preview = null;
    if (resume && wantMood && !curMood && unlocked) apply(wantMood, 700);
  }
  function previewStyle(id) {
    id = knownStyle(id);
    if (!unlock() || muted) return false;
    var had = !!preview;
    endPreview(false);
    if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = null; }
    if (curMood) { stopCurrent(had ? 0.05 : 0.3); curMood = null; curKind = null; curPKey = null; }
    var pv = preview = {timers: [], players: []};
    var phrase = function (mood, secs, fade) {           // one phrase = the fullest section (A2) of that style's mood
      var p = playerFor(id, mood);
      if (p.active) p.halt();
      p.start(ctx.currentTime, 0.12, 2); pv.players.push(p);
      pv.timers.push(setTimeout(function () { if (preview === pv) p.stop(ctx.currentTime, fade); }, secs * 1000));
    };
    pv.timers.push(setTimeout(function () { if (preview === pv) phrase("calm", 3.9, 0.5); }, 350));
    pv.timers.push(setTimeout(function () { if (preview === pv) phrase("tense", 3.8, 0.5); }, 4150));
    pv.timers.push(setTimeout(function () { if (preview === pv) endPreview(true); }, 8700));   // ~8 s of sample, then the old style / mood resume
    return true;
  }

  function setMood(mood, opts) {
    opts = opts || {};
    if (!mood || !SONGS[mood]) return false;
    wantMood = mood;
    if (!unlocked) return true;                          // will start on unlock()
    if (preview) return "deferred";                      // the style preview never overlaps the running mood; wantMood resumes after it
    if (mood === curMood) { if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = null; } return true; }
    var since = nowMs() - lastSwitch;
    if (!opts.force && !URGENT[mood] && curMood && since < HYSTERESIS_MS) {
      if (pendingTimer) clearTimeout(pendingTimer);
      pendingTimer = setTimeout(function () { pendingTimer = null; if (wantMood && wantMood !== curMood) apply(wantMood, opts.fade); }, HYSTERESIS_MS - since);
      return "deferred";
    }
    apply(mood, opts.fade);
    return true;
  }

  function unlock() {
    if (!ctx) {
      var AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return false;
      try { ctx = new AC({latencyHint: "interactive"}); } catch (e) { try { ctx = new AC(); } catch (e2) { return false; } }
      E = new Engine(ctx, {music: musicVol, sfx: sfxVol, muted: muted, seed: (Date.now() & 0xffff) + 1});
      E.offline = false;
      if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVisibility);
    }
    unlocked = true;
    if (!muted && !hidden() && ctx.state !== "running") { try { ctx.resume(); } catch (e) {} }
    if (wantMood && !curMood && !preview) apply(wantMood, 800);
    return true;
  }
  function onVisibility() {
    if (!ctx) return;
    if (hidden()) { try { ctx.suspend(); } catch (e) {} for (var k in files) try { files[k].el.pause(); } catch (e) {} }
    else if (!muted) {
      try { ctx.resume(); } catch (e) {}
      for (var j in files) if (files[j].target > 0) try { files[j].el.play(); } catch (e) {}
      kick();
    }
  }
  function mute(b) {
    muted = !!b; persist();
    if (!E) return muted;
    E.ramp(E.master.gain, muted ? 0 : 1, 0.06);
    if (muted) setTimeout(function () { if (muted && ctx.state === "running") try { ctx.suspend(); } catch (e) {} }, 90);
    else if (!hidden()) { try { ctx.resume(); } catch (e) {} kick(); }
    return muted;
  }
  function sfx(name, opts) {
    if (!E || muted || !unlocked || !SFX[name]) return false;
    if (ctx.state !== "running") { if (hidden()) return false; try { ctx.resume(); } catch (e) {} }
    var n = nowMs();
    if (name === "type") { if (n - lastType < 40) return false; lastType = n; }
    if (name === "hover") { if (n - lastHover < 45) return false; lastHover = n; }
    try { SFX[name](E, ctx.currentTime + 0.005, opts || {}); } catch (e) { return false; }
    return true;
  }

  /* ---------- mood rules ---------- */
  var BOSS_FOES = {hive_tyrant: 1, daemon_prince: 1, grey_knight: 1, tyranid_warrior: 1, ork_boss: 1, heretic_astartes: 1, chaos_sorcerer: 1,
                   greater_daemon_slaanesh: 1, wraith_construct: 1, necron_lord: 1, canoptek_spyder: 1, omen_ctan: 1,
                   ork_nob: 1, gsc_patriarch: 1, gsc_primus: 1, daemon_engine: 1, kastelan_robot: 1, dark_mechanicus: 1};
  var WARP_SCENES = {warp: 1, daemon_world: 1, cult_shrine: 1};
  var HOLY_SCENES = {cathedral: 1, throne_light: 1};
  var TAU_SCENES = {tau_city: 1, tau_outpost: 1};
  var AELDARI_SCENES = {craftworld: 1, webway: 1, maiden_world: 1};
  var NECRON_SCENES = {tomb_exterior: 1, tomb_interior: 1, stasis_gallery: 1, dig_site: 1};
  var ROUTE_SCENES = {ork_scrapyard: "orks", ork_fort: "orks", mine_shaft: "gsc", gsc_chapel: "gsc",            // v0.3
                      forge_floor: "mechanicus", mars_vista: "mechanicus", tech_vault: "mechanicus"};
  var TENSE_SCENES = {trench: 1, burning_city: 1, ruins: 1, spore_sky: 1};
  var FACTION_MOOD = {tau: "tau", aeldari: "aeldari", necrons: "necron", necron: "necron",   // route default instead of calm
                      orks: "orks", gsc: "gsc", mechanicus: "mechanicus"};
  function moodFor(node, state, faction) {
    if (!node) return "calm";
    if (node.music && SONGS[node.music]) return node.music;
    var e = node.ending;
    if (e && e.kind) return e.kind === "death" ? "death" : e.kind === "bad" ? "bad" : "happy";
    if (node.foe) return (BOSS_FOES[node.foe] || /^omen_/.test(node.foe)) ? "boss" : "battle";
    var sc = node.scene;
    if (WARP_SCENES[sc]) return "warp";
    if (HOLY_SCENES[sc]) return "holy";
    if (TAU_SCENES[sc]) return "tau";
    if (AELDARI_SCENES[sc]) return "aeldari";
    if (NECRON_SCENES[sc]) return "necron";
    if (ROUTE_SCENES.hasOwnProperty(sc)) return ROUTE_SCENES[sc];
    var san = state && state.stats ? state.stats.sanity : null;
    if (TENSE_SCENES[sc] || (typeof san === "number" && san < 30)) return "tense";
    var fid = typeof faction === "string" ? faction : (faction && faction.id) || (state && state.faction);
    return FACTION_MOOD[fid] || "calm";
  }

  /* ---------- offline rendering (tests: tools/dev/audio_render.py) ---------- */
  function OAC() { return root.OfflineAudioContext || root.webkitOfflineAudioContext; }
  function renderMood(mood, seconds, sampleRate, style) {
    var sr = sampleRate || 22050, C = OAC(), oc = new C(2, Math.ceil(sr * seconds), sr);
    var e = new Engine(oc, {music: 1, sfx: 1, seed: 99}); e.offline = true;
    var p = new Player(e, mood, style); p.start(0, 0.01); p.pump(seconds);
    return oc.startRendering().then(function (buf) { return {buffer: buf, loops: p.loops.slice(), marks: p.marks.slice(), info: songInfo(mood, style), drops: e.drops}; });
  }
  function renderSfx(name, seconds, sampleRate) {
    var sr = sampleRate || 22050, C = OAC(), oc = new C(2, Math.ceil(sr * (seconds || 2.5)), sr);
    var e = new Engine(oc, {music: 1, sfx: 1, seed: 7}); e.offline = true;
    SFX[name](e, 0.01, {});
    return oc.startRendering();
  }
  function songInfo(mood, style) {
    var c = compileSong(mood, style);
    return {mood: mood, style: c.style, key: c.key, bpm: c.bpm, loopBars: c.loopBars, introBars: c.introBars, loopSec: c.loopSec, introSec: c.introSec,
            wobble: songOf(mood, style).wobble || null, errors: c.errors.slice()};
  }

  WH.Audio = {
    unlock: unlock,
    setMood: setMood,
    stop: function (opts) { wantMood = null; endPreview(false); if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = null; } if (E) { stopCurrent(((opts && opts.fade) || 1000) / 1000); curMood = null; curKind = null; } },
    sfx: sfx,
    setMusicVolume: function (v) { musicVol = Math.max(0, Math.min(1, +v || 0)); if (E) E.setMusic(musicVol); return musicVol; },
    setSfxVolume: function (v) { sfxVol = Math.max(0, Math.min(1, +v || 0)); if (E) E.setSfx(sfxVol); return sfxVol; },
    getMusicVolume: function () { return musicVol; },
    getSfxVolume: function () { return sfxVol; },
    mute: mute,
    isMuted: function () { return muted; },
    isUnlocked: function () { return unlocked; },
    moodFor: moodFor,
    current: function () { return curMood; },
    wanted: function () { return wantMood; },
    moods: MOODS.slice(),
    sfxNames: SFX_NAMES.slice(),
    songInfo: songInfo,
    styles: STYLE_LIST,
    getStyles: function () { return STYLE_LIST.map(function (s) { return {id: s.id, name: {zh: s.name.zh, en: s.name.en}, desc: {zh: s.desc.zh, en: s.desc.en}}; }); },
    getStyle: function () { return curStyle; },
    setStyle: setStyle,
    previewStyle: previewStyle,
    isPreviewing: function () { return !!preview; },
    // internals for tools/dev (not for game code)
    _songs: SONGS, _styleSong: songOf, _sfx: SFX, _compile: compileSong, _render: renderMood, _renderSfx: renderSfx,
    _ctx: function () { return ctx; }, _players: function () { return players; }
  };
})(typeof window !== "undefined" ? window : globalThis);
