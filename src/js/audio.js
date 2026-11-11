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
   * Song: {key, bpm, meter (16th-steps per bar), ch:{channel:instrument}, drums:{v, pats}, sections, order, intro?}
   * Instrument: w wave ("p12"|"p25"|"p50" pulse duty, "tri", "sine", "saw"; array = cycle per note = duty variation)
   *   v volume, env [attack, decay, sustain, release] (s), vib [rateHz, depthCents, delayS], lp lowpass Hz,
   *   echo / rev send 0..1, uni detuned 2nd osc (cents), stack [semitones] extra oscs, pan -1..1, gate 0..1, tr semitones
   * Section: chords "Dm | Bb | Gm:8 A:8" (default length = 1 bar), channels as
   *   literal notes "D5:8 F5:4 E5:4 | …" (each "|" bar must sum to meter; ".:n" rest, "~:n" tie, default length 4) or
   *   chord pattern {p:"0-1-2-1-", o:octave, r:stepsPerChar}: digits = chord tones upward from the root (0 root, 1 3rd,
   *   2 5th, 3 7th or octave …), R = bass (slash note), O = bass+12, c = whole chord (voice-led), - hold, . rest.
   *   drums: one pattern name per bar (tiled), "-" = none. from:"A" inherits a section; tr:{ch:semis}; inst:{ch:{w}}; vol
   * Drum pattern: {k kick, s snare, h hat, H open hat, t tom, c crash, m metal, w whoosh}: strings of meter chars,
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
                   "event", "warp", "codex", "save", "death", "ending_good"];
  var URGENT = {battle: 1, boss: 1, warp: 1, death: 1, bad: 1, happy: 1, title: 1};   // switch immediately (no hysteresis); warp = chaos events
  var HYSTERESIS_MS = 8000;
  var DEFAULT_FADE = {battle: 600, boss: 600, death: 400, bad: 1200, happy: 800};

  /* =====================================================================================
   * 2. PARSING / COMPILING (pure — no AudioContext; reused by tools/dev/audio_check.js)
   * ===================================================================================== */
  var PC = {C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11};
  var QUAL = {"": [0, 4, 7], m: [0, 3, 7], dim: [0, 3, 6], aug: [0, 4, 8], sus2: [0, 2, 7], sus4: [0, 5, 7],
              "7": [0, 4, 7, 10], m7: [0, 3, 7, 10], maj7: [0, 4, 7, 11], dim7: [0, 3, 6, 9], m7b5: [0, 3, 6, 10],
              "6": [0, 4, 7, 9], m6: [0, 3, 7, 9], "5": [0, 7]};
  var RESERVED = {chords: 1, drums: 1, from: 1, tr: 1, inst: 1, vol: 1};
  var DRUM_KEYS = {k: 1, s: 1, h: 1, H: 1, t: 1, c: 1, m: 1, w: 1};
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
    var m = /^([A-G][#b]?)(m7b5|maj7|dim7|sus2|sus4|dim|aug|m7|m6|m|7|6|5)?(?:\/([A-G][#b]?))?(?::(\d+))?$/.exec(tok);
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
    return out.sort(function (a, b) { return a - b; }).slice(0, 4);
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
  function compileSong(id) {
    if (compiled[id]) return compiled[id];
    var S = SONGS[id], errs = [], meter = S.meter || 16, secIdx = {}, sections = [];
    var names = (S.intro || []).concat(S.order);
    Object.keys(S.sections).forEach(function (n) { if (names.indexOf(n) < 0) names.push(n); });
    names.forEach(function (name) {
      if (secIdx[name] != null) return;
      var where = id + "." + name, sec = resolveSection(S, name, errs);
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
        var notes;
        if (typeof spec === "string") {
          var lit = parseLiteral(spec, meter, errs, w2);
          if (lit.len !== len) errs.push(w2 + ": " + lit.len + " steps but chords span " + len);
          notes = lit.notes;
        } else notes = expandPattern(cp.list, spec, errs, w2);
        var tr = (inst.tr || 0) + ((sec.tr || {})[key] || 0), ov = (sec.inst || {})[key];
        notes.forEach(function (nt) {
          var m = Array.isArray(nt.m) ? nt.m.map(function (x) { return x + tr; }) : nt.m + tr;
          add(nt.s, {c: key, m: m, d: nt.d, w: ov && ov.w, v: vol});
          if (typeof spec === "string") {          // melody statistics for the checker
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
            if (str.length !== meter) errs.push(id + ".drums." + pn + "." + dk + ": length " + str.length + " (expected " + meter + ")");
            for (var i = 0; i < str.length && i < meter; i++) {
              var ch = str.charAt(i);
              if (ch === ".") continue;
              if (!VEL[ch]) { errs.push(id + ".drums." + pn + "." + dk + ": bad char '" + ch + "'"); continue; }
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
    var c = compiled[id] = {id: id, bpm: S.bpm, key: S.key, meter: meter, stepSec: stepSec, sections: sections, seq: seq,
      loopFrom: introN, introSec: introSteps * stepSec, loopSec: loopSteps * stepSec,
      loopBars: loopSteps / meter, introBars: introSteps / meter, errors: errs};
    if (errs.length && root.console) console.warn("[audio] " + id + ": " + errs.length + " data errors", errs);
    return c;
  }
  function chordAt(list, s) { for (var i = 0; i < list.length; i++) if (s >= list[i].s && s < list[i].s + list[i].d) return list[i]; return null; }
  function chordPcs(ch) { return ch.iv.map(function (x) { return (ch.pc + x) % 12; }); }

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
    E.pools = {music: [], drum: [], sfx: []};
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
    if (n >= this.caps[pool]) return false;
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
  function Player(E, id) {
    var P = this, ctx = E.ctx, S = SONGS[id];
    P.E = E; P.id = id; P.S = S; P.song = compileSong(id); P.active = false; P.stopAt = null;
    P.out = ctx.createGain(); P.out.gain.value = 0; P.out.connect(E.musicBus);
    P.wet = ctx.createGain(); P.wet.gain.value = 0; P.wet.connect(E.musicWet);
    var beat = 60 / S.bpm;
    P.dly = ctx.createDelay(2); P.dly.delayTime.value = Math.min(1.5, beat * 0.75);
    P.dlyLp = ctx.createBiquadFilter(); P.dlyLp.type = "lowpass"; P.dlyLp.frequency.value = 2600;
    P.dlyFb = ctx.createGain(); P.dlyFb.gain.value = 0.32;
    P.dly.connect(P.dlyLp); P.dlyLp.connect(P.dlyFb); P.dlyFb.connect(P.dly); P.dlyLp.connect(P.out);
    P.ch = {};
    Object.keys(S.ch).forEach(function (k) {
      var I = S.ch[k], c = {I: I, n: 0};
      c.inp = ctx.createGain(); c.inp.gain.value = I.v;
      var tail = c.inp;
      if (I.lp) { c.lp = ctx.createBiquadFilter(); c.lp.type = "lowpass"; c.lp.frequency.value = I.lp; c.lp.Q.value = 0.5; tail.connect(c.lp); tail = c.lp; }
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
  Player.prototype.start = function (t, fade) {
    var P = this, E = P.E;
    P.seqIdx = 0; P.step = 0; P.nextTime = t + 0.06; P.t0 = P.nextTime; P.stopAt = null; P.active = true; P.loops = [];
    Object.keys(P.ch).forEach(function (k) {
      var c = P.ch[k];
      if (c.lfoAmt && !c.lfo) { c.lfo = E.ctx.createOscillator(); c.lfo.frequency.value = c.I.vib[0]; c.lfo.connect(c.lfoAmt); c.lfo.start(t); }
    });
    P.fadeTo(1, fade, t);
  };
  Player.prototype.fadeTo = function (v, fade, t) {
    [this.out.gain, this.wet.gain].forEach(function (g) {
      g.cancelScheduledValues(t); g.setValueAtTime(g.value, t);
      g.linearRampToValueAtTime(v, t + Math.max(0.01, fade));
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
        P.step = 0;
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
    g.connect(c.inp);
    var f = mtof(midi), oscs = [], rnd = P.S.rnd ? (P.rand() * 2 - 1) * P.S.rnd : 0;
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
      try { g.disconnect(); oscs.forEach(function (n) { n.disconnect(); }); if (vg) { c.lfoAmt.disconnect(vg); vg.disconnect(); } } catch (e) {}
    };
  };
  Player.prototype.drumHit = function (k, t, vel) {
    var P = this, E = P.E, ctx = E.ctx, end = t + (k === "c" ? 1.5 : k === "w" ? 2.6 : 0.4);
    if (!E.voiceOk("drum", t, end)) return;
    var g = ctx.createGain(), src, o;
    var env = function (peak, decay) { g.gain.setValueAtTime(peak, t); g.gain.exponentialRampToValueAtTime(0.0008, t + decay); };
    if (k === "k" || k === "t") {
      o = ctx.createOscillator(); o.type = "sine";
      var f0 = k === "k" ? 150 : 140, f1 = k === "k" ? 42 : 72, dec = k === "k" ? 0.28 : 0.38;
      o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dec * 0.4);
      env(vel * (k === "k" ? 0.95 : 0.6), dec); o.connect(g); g.connect(P.drum); o.start(t); o.stop(t + dec + 0.02); src = o;
      if (k === "k") { var ck = E.noiseSrc(), cg = ctx.createGain(); cg.gain.setValueAtTime(vel * 0.25, t); cg.gain.exponentialRampToValueAtTime(0.001, t + 0.012); ck.connect(cg); cg.connect(P.f.h); ck.start(t, P.rand()); ck.stop(t + 0.02); }
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
    }
    if (src) src.onended = function () { try { g.disconnect(); src.disconnect(); } catch (e) {} };
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
    }
  };

  /* =====================================================================================
   * 5. LIVE CONTROLLER (WH.Audio)
   * ===================================================================================== */
  var ctx = null, E = null, unlocked = false, players = {}, curMood = null, curKind = null, wantMood = null;
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
    else if (players[curMood]) players[curMood].stop(ctx.currentTime, fadeSec);
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
    curKind = "synth";
    var p = players[mood] || (players[mood] = new Player(E, mood));
    if (p.active && p.stopAt != null) p.halt();          // was fading out: restart from the top
    if (!p.active) p.start(ctx.currentTime, fadeSec);
    kick();
  }

  function setMood(mood, opts) {
    opts = opts || {};
    if (!mood || !SONGS[mood]) return false;
    wantMood = mood;
    if (!unlocked) return true;                          // will start on unlock()
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
    if (wantMood && !curMood) apply(wantMood, 800);
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
  var BOSS_FOES = {hive_tyrant: 1, daemon_prince: 1, grey_knight: 1, tyranid_warrior: 1, ork_boss: 1, heretic_astartes: 1, chaos_sorcerer: 1};
  var WARP_SCENES = {warp: 1, daemon_world: 1, cult_shrine: 1};
  var HOLY_SCENES = {cathedral: 1, throne_light: 1};
  var TAU_SCENES = {tau_city: 1, tau_outpost: 1};
  var TENSE_SCENES = {trench: 1, burning_city: 1, ruins: 1, spore_sky: 1};
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
    var san = state && state.stats ? state.stats.sanity : null;
    if (TENSE_SCENES[sc] || (typeof san === "number" && san < 30)) return "tense";
    var fid = typeof faction === "string" ? faction : (faction && faction.id) || (state && state.faction);
    return fid === "tau" ? "tau" : "calm";
  }

  /* ---------- offline rendering (tests: tools/dev/audio_render.py) ---------- */
  function OAC() { return root.OfflineAudioContext || root.webkitOfflineAudioContext; }
  function renderMood(mood, seconds, sampleRate) {
    var sr = sampleRate || 22050, C = OAC(), oc = new C(2, Math.ceil(sr * seconds), sr);
    var e = new Engine(oc, {music: 1, sfx: 1, seed: 99}); e.offline = true;
    var p = new Player(e, mood); p.start(0, 0.01); p.pump(seconds);
    return oc.startRendering().then(function (buf) { return {buffer: buf, loops: p.loops.slice(), info: songInfo(mood)}; });
  }
  function renderSfx(name, seconds, sampleRate) {
    var sr = sampleRate || 22050, C = OAC(), oc = new C(2, Math.ceil(sr * (seconds || 2.5)), sr);
    var e = new Engine(oc, {music: 1, sfx: 1, seed: 7}); e.offline = true;
    SFX[name](e, 0.01, {});
    return oc.startRendering();
  }
  function songInfo(mood) {
    var c = compileSong(mood);
    return {mood: mood, key: c.key, bpm: c.bpm, loopBars: c.loopBars, introBars: c.introBars, loopSec: c.loopSec, introSec: c.introSec,
            wobble: SONGS[mood].wobble || null, errors: c.errors.slice()};
  }

  WH.Audio = {
    unlock: unlock,
    setMood: setMood,
    stop: function (opts) { wantMood = null; if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = null; } if (E) { stopCurrent(((opts && opts.fade) || 1000) / 1000); curMood = null; curKind = null; } },
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
    // internals for tools/dev (not for game code)
    _songs: SONGS, _sfx: SFX, _compile: compileSong, _render: renderMood, _renderSfx: renderSfx,
    _ctx: function () { return ctx; }, _players: function () { return players; }
  };
})(typeof window !== "undefined" ? window : globalThis);
