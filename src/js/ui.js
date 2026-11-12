/* ui.js — DOM rendering, screens, modals, effects. Owned by: web.
 * Reads WH.factions / WH.codex / WH.events / WH.sprites / WH.scenes / WH.ui; drives WH.Game (engine.js); persists via WH.Save.
 */
(function () {
  "use strict";
  var WH = window.WH;
  var $ = function (id) { return document.getElementById(id); };
  var t = function (k, v) { return WH.t(k, v); };
  var L = function (o) { return WH.L(o); };

  /* ---------- audio bridge: WH.Audio is optional (src/js/audio.js, audio role); every call is guarded ---------- */
  function au(fn) {
    var A = WH.Audio;
    if (!A || typeof A[fn] !== "function") return undefined;
    try { return A[fn].apply(A, Array.prototype.slice.call(arguments, 1)); } catch (e) { return undefined; }
  }
  function sfx(name) { au("sfx", name); }
  function mood(m) { if (m) au("setMood", m); }
  function applyAudioSettings() {
    var s = UI.settings;
    au("setMusicVolume", (s.musicVol === undefined ? 60 : s.musicVol) / 100);
    au("setSfxVolume", (s.sfxVol === undefined ? 80 : s.sfxVol) / 100);
    au("mute", !!s.muted);
    au("setStyle", currentStyle());                                      // SPEC §29 (no-op until audio.js has styles)
  }
  /* ---------- music styles (SPEC §29): WH.Audio.getStyles()/setStyle()/previewStyle() are optional ---------- */
  var FALLBACK_STYLES = [{id: "chip", name: {zh: "8位芯片", en: "8-bit chiptune"},
    desc: {zh: "复古游戏机的方波与噪声。", en: "Square waves and noise, straight from an old console."}}];
  function styleList() {
    var A = WH.Audio, list = null;
    try { list = A ? (typeof A.getStyles === "function" ? A.getStyles() : A.styles) : null; } catch (e) { list = null; }
    if (!Array.isArray(list) || !list.length) return FALLBACK_STYLES;
    return list.filter(function (x) { return x && typeof x.id === "string" && x.id; });
  }
  function currentStyle() {
    var id = UI.settings && UI.settings.musicStyle;
    return styleList().some(function (x) { return x.id === id; }) ? id : "chip";
  }
  function canPreviewStyle() { return !!(WH.Audio && typeof WH.Audio.previewStyle === "function"); }
  function nodeMood() {
    var g = UI.game;
    if (!g) return "title";
    var n; try { n = g.node(); } catch (e) { return null; }
    var m = au("moodFor", n, g.state, g.faction);
    return m || null;
  }
  function screenMood() {
    if (UI.screen === "game") return UI.eventOpen ? "warp" : nodeMood();
    if (UI.screen === "ending" && UI.game) { var k = (UI.game.node().ending || {}).kind; return k === "death" ? "death" : k === "bad" ? "bad" : "happy"; }
    return "title";
  }
  function soundButton() {
    var muted = !!UI.settings.muted;
    return h("button", {class: "btn small px sound-btn", type: "button", "aria-pressed": String(muted),
      "aria-label": t("sound") + ": " + (muted ? t("unmute") : t("mute")), title: muted ? t("unmute") : t("mute"),
      onclick: toggleMute}, muted ? "🔇" : "🔊");
  }
  function toggleMute() {
    UI.settings.muted = !UI.settings.muted;
    WH.Save.saveSettings(UI.settings);
    au("mute", UI.settings.muted);
    Array.prototype.forEach.call(document.querySelectorAll(".sound-btn"), function (b) { b.parentNode.replaceChild(soundButton(), b); });
    var top = UI.modals[UI.modals.length - 1];
    if (top && top.reopen) top.reopen();
  }

  /* ---------- tiny DOM helper ---------- */
  function h(tag, props) {
    var el = document.createElement(tag);
    if (props) for (var k in props) {
      var v = props[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k === "vars") for (var n in v) el.style.setProperty(n, v[n]);
      else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { append(el, x); }); return; }
    el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

  /* ---------- art (with placeholders for missing images) ---------- */
  var DEF = {sprite: [48, 48], scene: [192, 108], ui: [16, 16]};
  var GLYPH = {icon_hp: "♥", icon_sanity: "◎", icon_corruption: "✸", icon_faith: "✦", icon_favor: "✶", icon_greatergood: "◉",
               icon_fate: "✧", icon_worth: "◈", icon_teef: "◆", icon_kinship: "❖", icon_grace: "⚙",
               icon_clock: "◷", icon_codex: "▤", icon_save: "▣", icon_lang: "文"};

  /* ---------- factions / codex taxonomy v2 (SPEC §12–13) ---------- */
  var FACTION_ORDER = ["imperium", "chaos", "tau", "aeldari", "necrons", "orks", "gsc", "mechanicus"];   // SPEC §26
  var FACTION_COLOR = {imperium: "#c9a227", chaos: "#b0304a", tau: "#d08a3a", aeldari: "#5fb3a1", necrons: "#4fd16b",
                       orks: "#6aa84f", gsc: "#9b59b6", mechanicus: "#c0392b"};
  function fcolor(f) { return (f && (f.color || FACTION_COLOR[f.id])) || "#c9a227"; }
  var RACES = ["imperium", "chaos", "tau", "aeldari", "necrons", "orks", "tyranids", "other"];
  var RACE_COLOR = {imperium: "#d4a62a", chaos: "#c4283c", tau: "#c98b3c", aeldari: "#5fb3a1", necrons: "#4fd16b",
                    orks: "#6fa335", tyranids: "#9a5fd0", other: "#8a8580"};
  var RACE_COLOR2 = {tau: "#4d8fcf"};                    // secondary tone (T'au: ochre + blue)
  var TYPES = ["figure", "deity", "organization", "unit", "concept"];   // + "place" (own view)
  var CAT_TYPE = {leader: "figure", boss: "figure", enemy: "unit", god: "deity", lore: "concept", place: "place"};
  /* race: explicit `race`, else derived from faction / id / sprite (data written before taxonomy v2) */
  function raceOf(c, id) {
    if (!c) return "other";
    if (RACES.indexOf(c.race) >= 0) return c.race;
    if (["imperium", "chaos", "tau", "aeldari", "necrons"].indexOf(c.faction) >= 0) return c.faction;
    var s = ((id || "") + " " + (c.sprite || "") + " " + (c.scene || "") + " " + ((c.name && c.name.en) || "")).toLowerCase();
    if (/\bork|waaagh|gork|mork|greenskin/.test(s)) return "orks";
    if (/tyranid|hive_?mind|hive_tyrant|genestealer|gaunt|swarm|lictor|spore/.test(s)) return "tyranids";
    if (/aeldari|eldar|craftworld|drukhari|webway|farseer|ynn/.test(s)) return "aeldari";
    if (/necron|c'?tan|tomb|cryptek|canoptek|silent_king/.test(s)) return "necrons";
    if (c.cat === "god" || /chaos|daemon|warp|heresy/.test(s)) return "chaos";
    if (/\bimp_|terra|cadia|imperial|astartes|emperor/.test(s)) return "imperium";
    return "other";
  }
  function typeOf(c) {
    if (!c) return "concept";
    if (TYPES.indexOf(c.type) >= 0 || c.type === "place") return c.type;
    return CAT_TYPE[c.cat] || "concept";
  }
  function raceColor(r) { return RACE_COLOR[r] || RACE_COLOR.other; }
  /* SPEC §20: chronicle entries (tags:["chronicle"]) live in the 战史 timeline, not the 条目 grid */
  function isChronicle(c) { return !!(c && Array.isArray(c.tags) && c.tags.indexOf("chronicle") >= 0); }
  /* SPEC §21: entries with hidden:true (the easter-egg letter) are never counted and never listed as ??? */
  function isHidden(c) { return !!(c && c.hidden); }
  function codexIds() { return Object.keys(WH.codex).filter(function (id) { return !isHidden(WH.codex[id]); }); }
  function chrKey(c) { var k = c && +c.sortKey; return isFinite(k) && c.sortKey !== null && c.sortKey !== "" ? k : Infinity; }
  /* millennium of an entry: floor(sortKey/1000), else the "M41" in its date, else null */
  function chrMill(c) {
    var k = chrKey(c);
    if (isFinite(k)) return k < 1000 ? 0 : Math.floor(k / 1000);       // sortKey < 1000 (e.g. War in Heaven, negative) → 远古 band (0)
    var m = /M\s*(\d{2})/.exec((c && c.date && (c.date.en || c.date.zh || c.date)) || "");
    return m ? +m[1] : null;
  }
  /* readable ink on a coloured chip */
  function inkOn(hex) { var c = rgb(hex); return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) > 140 ? "#120c08" : "#fff4e4"; }
  function badgeText(id) { var c = WH.codex[id]; return t("lt_" + typeOf(c)) + " · " + t("race_" + raceOf(c, id)); }
  function reg(kind) { return kind === "scene" ? WH.scenes : kind === "ui" ? WH.ui : WH.sprites; }
  /* Missing art → a cute pixel slime (hand-authored grid → canvas → data URL), tinted by the accent colour.
   * Key names are only shown as a caption in ?debug=1 mode. */
  var SLIME = [
    "......oooo......",
    "....oohhbboo....",
    "...ohhbbbbbbo...",
    "..ohhbbbbbbbbo..",
    "..obhbbbbbbbbo..",
    ".obbbbbbbbbbbbo.",
    ".obbwebbbbwebbo.",
    ".obbeebbbbeebbo.",
    ".obpbbbbbbbbpbo.",
    "obbbbbbmmbbbbbbo",
    "obsbbbbbbbbbbsbo",
    "obssssssssssssbo",
    ".oooooooooooooo."];
  var slimeCache = {};
  function rgb(hex) {
    var m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex || "");
    if (!m) return [201, 162, 39];
    var x = m[1].length === 3 ? m[1].replace(/(.)/g, "$1$1") : m[1];
    return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)];
  }
  function mix(a, b, k) {
    var p = rgb(a), q = rgb(b);
    return "rgb(" + [0, 1, 2].map(function (i) { return Math.round(p[i] + (q[i] - p[i]) * k); }).join(",") + ")";
  }
  function slimeURL(w, hh, color) {
    var id = w + "x" + hh + color;
    if (slimeCache[id]) return slimeCache[id];
    var gw = 16, gh = SLIME.length;
    var c = document.createElement("canvas");
    c.width = w; c.height = hh;
    var x = c.getContext("2d");
    if (!x) return "";
    var s = Math.max(1, Math.floor(Math.min(w / (gw * 1.4), hh / (gh * 1.6))));
    var ox = Math.floor((w - gw * s) / 2), oy = hh - gh * s - Math.max(1, Math.floor(hh / 24));
    var pal = {o: mix(color, "#000000", 0.72), b: mix(color, "#9ee06a", 0.15), s: mix(color, "#000000", 0.32), h: mix(color, "#ffffff", 0.6),
               e: "#1a1014", w: "#ffffff", p: mix(color, "#ff6f9a", 0.6), m: "#2a1418"};
    x.fillStyle = "rgba(0,0,0,.35)";                       // soft ground shadow
    x.fillRect(ox + s, oy + gh * s, (gw - 2) * s, Math.max(1, Math.floor(s / 2)));
    for (var r = 0; r < gh; r++) for (var q = 0; q < gw; q++) {
      var ch = SLIME[r][q];
      if (ch === ".") continue;
      x.fillStyle = pal[ch];
      x.fillRect(ox + q * s, oy + r * s, s, s);
    }
    return (slimeCache[id] = c.toDataURL());
  }
  /* SPEC §24: difficulty = 1–3 pixel skulls, drawn in code (faction-tinted; empty skulls for the rest). No text, no tooltip. */
  var SKULL = ["..ooooo..", ".oBBBBBo.", "oBBBBBBBo", "oBeeBeeBo", "oBeeBeeBo", "oBBBnBBBo", ".ooBBBoo.", "..oBoBo..", "...ooo..."];
  var skullCache = {};
  function skullURL(color, full) {
    var id = color + (full ? "1" : "0");
    if (skullCache[id]) return skullCache[id];
    var s = 2, c = document.createElement("canvas");
    c.width = SKULL[0].length * s; c.height = SKULL.length * s;
    var x = c.getContext("2d");
    if (!x) return "";
    var pal = full ? {o: mix(color, "#000000", 0.7), B: mix(color, "#f2e8d0", 0.72), e: "#160f0b", n: "#160f0b"}
                   : {o: "rgba(236,226,200,.30)", B: "rgba(236,226,200,.06)"};
    for (var r = 0; r < SKULL.length; r++) for (var q = 0; q < SKULL[r].length; q++) {
      var ch = SKULL[r][q];
      if (ch === "." || !pal[ch]) continue;
      x.fillStyle = pal[ch];
      x.fillRect(q * s, r * s, s, s);
    }
    return (skullCache[id] = c.toDataURL());
  }
  function diffOf(key) { var d = WH.difficulty, v = d && d[key]; return v === 1 || v === 2 || v === 3 ? v : null; }
  function diffSkulls(level, color) {
    if (!level) return null;
    var kids = [];
    for (var i = 1; i <= 3; i++) kids.push(h("img", {class: "skull" + (i <= level ? " on" : ""), src: skullURL(color || "#c9a227", i <= level), alt: "", "aria-hidden": "true", draggable: "false"}));
    return h("span", {class: "diff", role: "img", "data-level": level, "aria-label": t("diff_aria", {n: level})}, kids);
  }

  function placeholder(kind, key, w, hh, cls, color) {
    if (kind === "ui") return h("span", {class: "ph-icon icon " + (cls || ""), vars: {"--w": w, "--h": hh}, "aria-hidden": "true", title: key || ""}, GLYPH[key] || "■");
    if (kind === "scene") return h("div", {class: "ph ph-scene " + (cls || "")}, UI.debug ? h("span", null, "[ " + key + " ]") : null);
    var img = new Image();
    img.alt = "";
    img.draggable = false;
    img.className = "px-img sprite slime " + (cls || "");
    img.style.setProperty("--w", w);
    img.style.setProperty("--h", hh);
    img.src = slimeURL(w, hh, color || UI.accent || "#c9a227");
    img.dataset.missing = key || "";
    if (!UI.debug) return img;
    return h("span", {class: "slime-wrap"}, img, h("span", {class: "ph-cap"}, key || "?"));
  }
  function art(kind, key, cls, color) {
    var a = key ? reg(kind)[key] : null;
    var w = (a && a.w) || DEF[kind][0], hh = (a && a.h) || DEF[kind][1];
    if (!key) return null;
    if (!a || !a.src) return placeholder(kind, key, w, hh, cls, color);
    var img = new Image();
    img.alt = "";
    img.draggable = false;
    img.decoding = "async";
    img.className = "px-img " + (kind === "sprite" ? "sprite " : kind === "ui" ? "icon " : "") + (cls || "");
    img.style.setProperty("--w", w);
    img.style.setProperty("--h", hh);
    img.dataset.key = key;
    img.onerror = function () { if (img.parentNode) img.parentNode.replaceChild(placeholder(kind, key, w, hh, cls, color), img); };
    img.src = a.src;
    return img;
  }

  /* ---------- typewriter ---------- */
  var SPEED = {slow: 52, normal: 30, fast: 12, instant: 0};
  function Typer(el, live) { this.el = el; this.live = live; this.active = false; this.timer = null; }
  Typer.prototype.run = function (text, speed, onDone) {
    this.stop();
    var self = this;
    this.text = text || "";
    this.onDone = onDone || null;
    this.chars = Array.from(this.text);
    this.pos = 0;
    this.el.style.minHeight = "";
    this.el.textContent = this.text;              // reserve the final height so the layout doesn't grow while typing
    if (this.el.offsetHeight) this.el.style.minHeight = this.el.offsetHeight + "px";
    this.el.textContent = "";
    if (this.live) this.live.textContent = this.text;
    var base = SPEED[speed] !== undefined ? SPEED[speed] : 30;
    var delay = WH.lang === "en" ? base * 0.42 : base;
    if (!delay) return this.finish();
    this.active = true;
    var acc = 0, last = performance.now(), caret = h("span", {class: "caret"});
    this.timer = setInterval(function () {
      var now = performance.now();
      acc += (now - last) / delay; last = now;
      var n = Math.floor(acc);
      if (n > 0) {
        acc -= n;
        self.pos = Math.min(self.chars.length, self.pos + n);
        if (now - (self.lastTick || 0) > 55 && /\S/.test(self.chars[self.pos - 1] || "")) { self.lastTick = now; sfx("type"); }
        self.el.textContent = self.chars.slice(0, self.pos).join("");
        self.el.appendChild(caret);
      }
      if (self.pos >= self.chars.length) self.finish();
    }, 16);
  };
  Typer.prototype.finish = function () {
    clearInterval(this.timer); this.timer = null;
    if (this.linkify) linkify(this.el, this.text); else this.el.textContent = this.text;
    this.active = false;
    var cb = this.onDone; this.onDone = null;
    if (cb) cb();
  };
  Typer.prototype.stop = function () { clearInterval(this.timer); this.timer = null; this.active = false; this.onDone = null; };

  /* ---------- UI state ---------- */
  var UI = WH.UI = {
    settings: null, game: null, screen: "title", busy: false, typer: null, evTyper: null,
    fxOn: true, reduced: false, modals: [], eventOpen: false, cardDone: null, lastTick: 0,
    sceneKey: null, actorKeys: {left: null, right: null}, whisperTimer: null, seed: null,
    sel: {faction: null}, keepSel: false,
    loreQueue: [], loreKnown: {}, lore: null, conseq: null,
    cx: {race: "all", type: "all", q: "", sort: "disc", placeRace: "all"}, cxNew: {},
    accent: null, debug: /[?&]debug=1(&|$)/.test(location.search), eggForce: null, eggForcedShown: {}, jokeTimer: null
  };

  UI.applyAudioSettings = applyAudioSettings;

  UI.init = function () {
    try { UI.bootCheck = WH.Save.bootCheck(); } catch (e) { UI.bootCheck = null; console.warn("bootCheck", e); }   // SPEC §22: before anything writes
    UI.settings = WH.Save.loadSettings();
    WH.Save.codexSeen();                       // initialise the NEW-badge seen-set before anything unlocks
    WH.lang = UI.settings.lang;
    document.documentElement.lang = WH.lang === "zh" ? "zh-CN" : "en";
    try { UI.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { UI.reduced = false; }
    var m = /[?&]seed=(\d+)/.exec(location.search);
    if (m) UI.seed = parseInt(m[1], 10);
    var em = /[?&]egg=(\d+)/.exec(location.search);              // SPEC §21 debug: force a tier (25|50|75|99|100)
    if (em) UI.eggForce = Math.max(0, Math.min(100, parseInt(em[1], 10)));
    applyFxSetting();
    UI.typer = new Typer($("dlg-text"), $("dlg-live"));
    UI.typer.linkify = true;
    document.addEventListener("click", function (e) {
      var k = e.target.closest && e.target.closest(".kw");
      if (k) { e.stopPropagation(); sfx("click"); showLore([k.getAttribute("data-id")], 0, false); }
    });
    $("dialogue").addEventListener("click", function (e) {
      if (e.target.closest("button") || e.target.closest(".kw")) return;
      if (UI.conseq) { consequenceContinue(); return; }      // finishes the typewriter first, then continues
      if (UI.typer.active) UI.typer.finish();
    });
    window.addEventListener("resize", fit);
    document.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", function () { UI.lastTick = performance.now(); });
    UI.lastTick = performance.now();
    setInterval(tickPlay, 1000);
    applyAudioSettings();
    var unlock = function () {
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("keydown", unlock, true);
      au("unlock");
      applyAudioSettings();
      mood(screenMood());
    };
    document.addEventListener("pointerdown", unlock, true);
    document.addEventListener("keydown", unlock, true);
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("button");
      if (b && !b.disabled) sfx(b.getAttribute("data-sfx") || "click");
    }, true);
    var lastHover = null;
    document.addEventListener("mouseover", function (e) {
      var b = e.target.closest && e.target.closest("button");
      if (b !== lastHover) { lastHover = b; if (b && !b.disabled) sfx("hover"); }
    });
    renderFooter();
    buildTools();
    fit();
    show("title");
    if (!WH.Save.isPersistent()) toast(t("storage_off"));
    if (UI.bootCheck && UI.bootCheck.updated) toast(t("upd_toast", {v: UI.bootCheck.to}));   // SPEC §22: one-time notice, data kept
    try { checkAchievements(true); } catch (e) { console.warn("achievements", e); }            // SPEC §25: also on boot
  };

  function applyFxSetting() {
    UI.fxOn = !!UI.settings.effects && !UI.reduced;
    $("stage").classList.toggle("fx-off", !UI.fxOn);
  }

  function fit() {
    var portrait = window.innerWidth < window.innerHeight && window.innerWidth < 900;
    document.body.classList.toggle("portrait", portrait);
    var st = $("stage");
    if (portrait) { st.style.transform = ""; st.style.left = ""; st.style.top = ""; UI.scale = 1; }
    else {
      var host = $("stage-host"), W = host.clientWidth, H = host.clientHeight;
      var s = Math.max(0.2, Math.min(W / 960, H / 540));
      st.style.transform = "scale(" + s + ")";
      st.style.left = Math.round((W - 960 * s) / 2) + "px";
      st.style.top = Math.round((H - 540 * s) / 2) + "px";
      UI.scale = s;
    }
    updateDlgH();
  }
  function updateDlgH() {
    var d = $("dialogue");
    if (d && d.offsetHeight) $("scr-game").style.setProperty("--dlg-h", d.offsetHeight + "px");
  }

  function renderFooter() {
    $("footer").textContent = t("disclaimer") + (WH.SAMPLE ? "  ·  SAMPLE DATA (?sample=1)" : "");
  }

  function show(name) {
    ["title", "select", "game", "ending"].forEach(function (s) { $("scr-" + s).hidden = s !== name; });
    UI.screen = name;
    if (name !== "game") stopWhispers();
    if (name === "title") renderTitle();
    if (name === "select") { if (!UI.keepSel) UI.sel.faction = null; UI.keepSel = false; renderSelect(); }
    if (name === "title" || name === "select") mood("title");
    if (name === "game") requestAnimationFrame(updateDlgH);
    window.scrollTo(0, 0);
  }
  UI.show = show;

  function langButton() {
    return h("button", {class: "btn small px", type: "button", onclick: toggleLang, "aria-label": t("language") + ": " + t("lang_toggle")},
      art("ui", "icon_lang"), t("lang_toggle"));
  }

  /* ======================= TITLE ======================= */
  function codexStats() {
    var all = codexIds(), g = WH.Save.codexGlobal();
    var n = all.filter(function (id) { return g.indexOf(id) >= 0; }).length;
    return {n: n, t: all.length, pct: all.length ? Math.round(100 * n / all.length) : 0};
  }

  function renderTitle() {
    var s = clear($("scr-title"));
    var latest = WH.Save.latest();
    var cs = codexStats();
    var errs = (window.WH_LOAD_ERRORS || []);
    var newBtn = h("button", {class: "btn primary px", type: "button", "data-sfx": "start", onclick: function () { show("select"); }}, t("new_game"));
    s.appendChild(h("div", {class: "bg"}, art("scene", "title")));
    s.appendChild(h("div", {class: "corner"}, soundButton(), langButton()));
    s.appendChild(h("div", {class: "title-wrap"},
      h("div", {class: "title-kicker"}, WH.lang === "zh" ? "战锤40K 同人文字冒险" : "A Warhammer 40,000 fan text adventure"),
      h("h1", {class: "title-main", id: "t-main"}, t("title_main")),
      h("div", {class: "title-sub"}, t("title_sub")),
      h("p", {class: "title-tag"}, t("title_tag")),
      h("nav", {class: "menu", "aria-label": t("menu")},
        newBtn,
        h("button", {class: "btn px", type: "button", disabled: !latest, onclick: function () { if (latest) loadRecord(latest.rec); }}, t("cont")),
        h("button", {class: "btn px", type: "button", onclick: function () { openSaves("load"); }}, t("load")),
        h("button", {class: "btn px", type: "button", onclick: function () { openCodex(); }}, art("ui", "icon_codex"), t("codex"), newBadge()),
        (WH.achievements && WH.achievements.length) ? h("button", {class: "btn px ach-btn", type: "button", id: "ach-btn", onclick: function () { openAchievements(); }},
          "★ " + t("ach_title"), h("span", {class: "ach-count", id: "ach-count"})) : null,
        h("button", {class: "btn px", type: "button", onclick: openSettings}, t("settings"))),
      h("div", {class: "title-meta"},
        h("span", null, t("codex_global", {n: cs.n, t: cs.t})),
        h("span", {class: "meter", role: "progressbar", "aria-valuenow": cs.pct, "aria-valuemin": 0, "aria-valuemax": 100},
          h("i", {style: "width:" + cs.pct + "%"})),
        h("span", null, cs.pct + "%"))));
    s.appendChild(h("div", {class: "version"}, "v" + WH.VERSION + (WH.SAMPLE ? " · sample" : "")));
    if (errs.length) s.appendChild(h("div", {class: "notice", role: "status"}, t("load_errors") + " " +
      errs.map(function (e) { return e.file + (e.msg && e.msg !== "missing" ? " (" + e.msg + ")" : ""); }).join(", ")));
    updateCodexBadge();
    updateAchBadge();
    eggTitle(s);
    setTimeout(function () { if (UI.screen === "title" && !UI.modals.length && !$("egg-planned")) newBtn.focus({preventScroll: true}); }, 0);
  }

  /* ======================= SPEC §21: TZEENTCH COLLECTION EASTER EGG =======================
   * P = round(100 × (0.6 × codex unlocked/total + 0.4 × endings found/total)), global, hidden entries excluded.
   * Tiers (data/easter_tzeentch.js) fire once each (whatiswh.eggTiers) on the title screen / a fresh codex open.
   * ?egg=N forces P = N (and re-fires the tier at N once per page load). */
  function egg() { var e = WH.easter && WH.easter.tzeentch; return e && Array.isArray(e.tiers) ? e : null; }
  function eggTier(id) { var e = egg(); return e ? (e.tiers.filter(function (x) { return x.id === id; })[0] || null) : null; }
  function eggCodexId() { var e = egg(), id = (e && e.codex) || "egg_tzeentch_letter"; return WH.codex[id] ? id : null; }
  function eggProgress() {
    var g = {}, es = WH.Save.endingStats(), ends = [];
    WH.Save.codexGlobal().forEach(function (id) { g[id] = 1; });
    factionList().forEach(function (f) { Object.keys(f.nodes || {}).forEach(function (id) { if (f.nodes[id].ending) ends.push(f.id + ":" + id); }); });
    var ids = codexIds(), cu = ids.filter(function (id) { return g[id]; }).length, ef = ends.filter(function (k) { return es[k]; }).length;
    var ct = ids.length, et = ends.length, left = (ct - cu) + (et - ef);
    var p = (ct || et) ? Math.round(100 * (0.6 * (ct ? cu / ct : 1) + 0.4 * (et ? ef / et : 1))) : 0;
    if (left > 0 && p >= 100) p = 99;
    var r = {p: p, left: left, cu: cu, ct: ct, ef: ef, et: et, forced: false};
    if (UI.eggForce !== null) { r.p = UI.eggForce; r.forced = true; r.left = UI.eggForce >= 100 ? 0 : UI.eggForce === 99 ? 1 : Math.max(left, 2); }
    return r;
  }
  UI.eggProgress = eggProgress;
  function eggReached(id, pr) { var tr = eggTier(id); return !!tr && (id === "last" ? pr.left === 1 : pr.p >= tr.at); }
  /* reached and not yet triggered (or forced via ?egg= at exactly this tier, once per page load) */
  function eggFresh(id, pr) {
    if (!eggReached(id, pr)) return false;
    if (!WH.Save.eggTiers()[id]) return true;
    var tr = eggTier(id);
    return pr.forced && tr.at === UI.eggForce && !UI.eggForcedShown[id];
  }
  function eggFire(id) { WH.Save.markEggTier(id); UI.eggForcedShown[id] = 1; setTimeout(checkAchievements, 0); }
  function eggDone(id) { return !!WH.Save.eggTiers()[id]; }

  function eggTitle(s) {
    var e = egg();
    if (!e) return;
    var pr = eggProgress(), main = s.querySelector(".title-main"), sub = s.querySelector(".title-sub"), wrap = s.querySelector(".title-wrap");
    if (eggReached("letter", pr) || eggDone("letter")) {
      var fresh = eggFresh("letter", pr);
      if (fresh) eggFire("letter");
      s.appendChild(h("button", {class: "egg-letter px" + (fresh ? " fresh" : ""), type: "button", id: "egg-letter", "aria-label": t("egg_letter"), title: t("egg_letter"),
        onclick: function () { this.classList.remove("fresh"); eggLetterCard(); }}, h("span", {class: "env", "aria-hidden": "true"}), h("span", {class: "seal", "aria-hidden": "true"})));
    }
    if (eggReached("flame", pr) || eggDone("flame")) {
      if (eggFresh("flame", pr)) eggFire("flame");
      main.appendChild(h("button", {class: "egg-flame", type: "button", id: "egg-flame", "aria-label": t("egg_flame"), title: t("egg_flame"),
        onclick: function (ev) { ev.stopPropagation(); eggFlameScene(); }}, h("i"), h("i"), h("i")));
    }
    if (eggDone("planned") || (pr.forced && pr.p >= 100 && eggReached("planned", pr))) main.classList.add("tz-shimmer");
    if (eggFresh("planned", pr)) { eggFire("planned"); setTimeout(eggPlanned, 250); }
    else if (eggFresh("whisper", pr)) { eggFire("whisper"); eggWhisper(sub); }
    void wrap;
  }
  function eggWhisper(sub) {
    var tr = eggTier("whisper");
    if (!sub || !tr) return;
    sub.classList.add("egg-glitch");
    sub.textContent = L(tr.text);
    sub.setAttribute("data-text", L(tr.text));
    sfx("scan");
    setTimeout(function () { sub.classList.remove("egg-glitch"); sub.removeAttribute("data-text"); sub.textContent = t("title_sub"); }, 3000);
  }
  function eggLetterCard() {
    var tr = eggTier("letter"), e = egg();
    if (!tr) return;
    openModal({title: L(tr.title), narrow: true, body: h("div", {class: "egg-card"},
      h("div", {class: "egg-sig"}, art("sprite", e.sigil || "sigil_tzeentch", null, "#3b6fd1")),
      h("p", {class: "egg-text"}, L(tr.text)),
      h("p", {class: "egg-sign"}, "— " + t("egg_k")))});
  }
  function eggFlameScene() {
    var tr = eggTier("flame"), e = egg();
    if (!tr) return;
    var box = h("div", {class: "egg-choices"});
    (tr.choices || []).forEach(function (c) {
      box.appendChild(h("button", {class: "btn choice px", type: "button", onclick: function () {
        clear(box);
        box.appendChild(h("p", {class: "egg-result"}, L(c.result)));
        box.appendChild(h("button", {class: "btn px", type: "button", onclick: function () { closeTop(); }}, t("cont_btn")));
        box.querySelector("button").focus({preventScroll: true});
      }}, h("span", {class: "ct"}, L(c.text))));
    });
    openModal({title: L(tr.title), body: h("div", {class: "egg-mini"},
      h("div", {class: "egg-stage"}, art("scene", "warp"), h("div", {class: "egg-actor"}, art("sprite", e.sprite || "daemon_tzeentch", null, "#3b6fd1"))),
      h("p", {class: "egg-text"}, L(tr.text)), box), focus: ".egg-choices button"});
  }
  /* tier 100: full-screen scene → unlock the hidden letter + show its card; title shimmer + 奸奇的玩笑 from then on */
  function eggPlanned() {
    var tr = eggTier("planned"), e = egg();
    if (!tr || $("egg-planned")) return;
    var txt = h("div", {class: "egg-full-text", "aria-hidden": "true"}), live = h("div", {class: "sr-only", "aria-live": "polite"});
    var go = h("button", {class: "btn primary px", type: "button", hidden: true}, t("cont_btn") + " ▸");
    var ov = h("div", {class: "egg-full" + (UI.fxOn ? " glitchy" : ""), id: "egg-planned", role: "dialog", "aria-modal": "true", "aria-label": L(tr.title)},
      h("div", {class: "egg-full-bg"}, art("scene", "warp")),
      h("div", {class: "egg-full-actor"}, art("sprite", e.sprite || "daemon_tzeentch", null, "#3b6fd1")),
      h("div", {class: "egg-full-box px"}, h("h2", null, L(tr.title)), txt, live, h("div", {class: "egg-full-btns"}, go)));
    $("overlay-root").appendChild(ov);
    sfx("event");
    mood("warp");
    var ty = new Typer(txt, live);
    UI.eggTyper = ty;
    var done = function () { go.hidden = false; go.focus({preventScroll: true}); };
    ty.run(L(tr.text), UI.settings.textSpeed, done);
    ov.addEventListener("click", function (ev) { if (ev.target !== go && ty.active) ty.finish(); });
    go.addEventListener("click", function () {
      ov.remove(); UI.eggTyper = null;
      var id = eggCodexId();
      if (id) { WH.Save.addCodexGlobal([id]); WH.Save.markCodexSeen([id]); showLore([id], 0, false); }
      if (UI.screen === "title") { renderTitle(); mood("title"); }
    });
  }
  UI.eggPlanned = eggPlanned;
  /* 奸奇的玩笑: while a codex view is open, a random locked "???" briefly shows its real name shuffled */
  function shuffleStr(a) {
    a = Array.from(a);
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; }
    return a.join("");
  }
  function startJoke() {
    if (UI.jokeTimer || !eggDone("planned") || UI.settings.tzeentchJoke === false) return;
    var tick = function () {
      if (!document.querySelector(".codex-body") || UI.settings.tzeentchJoke === false) { clearInterval(UI.jokeTimer); UI.jokeTimer = null; return; }
      var els = document.querySelectorAll(".codex-body .centry.locked .nm, .codex-body .place-tile.locked .pn, .codex-body .tl-item.locked .tl-name, .codex-body .end-tile.locked .et");
      if (!els.length) return;
      var el = els[Math.floor(Math.random() * els.length)];
      if (el.getAttribute("data-joke")) return;
      var host = el.closest("[data-id]"), c = host && WH.codex[host.getAttribute("data-id")];
      var orig = el.textContent, nm = c ? L(c.name).replace(/\s+/g, "") : "";
      el.setAttribute("data-joke", "1");
      el.textContent = nm ? shuffleStr(nm) : shuffleStr("?¿⸮" + orig).slice(0, Math.max(3, orig.length));
      setTimeout(function () { el.textContent = orig; el.removeAttribute("data-joke"); }, 900);
    };
    UI.jokeTimer = setInterval(tick, 2400);
    UI.jokeTick = tick;
  }
  UI.startJoke = startJoke;

  /* ======================= FACTION SELECT ======================= */
  function factionList() {
    var order = FACTION_ORDER;
    return Object.keys(WH.factions).sort(function (a, b) {
      var ia = order.indexOf(a), ib = order.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    }).map(function (id) { return WH.factions[id]; });
  }

  function statChip(icon, v, title) { return h("span", {title: title}, art("ui", icon), String(v)); }

  /* Two steps (SPEC §16): 选择势力 (faction cards) → 选择出身 (origin cards of that faction) → game.
   * A faction without `origins` has one synthesized default origin → the origin step is skipped. */
  function renderSelect() {
    var f = UI.sel.faction && WH.factions[UI.sel.faction];
    if (f && WH.Game.origins(f).length > 1) renderOrigins(f);
    else { UI.sel.faction = null; renderRaces(); }
  }
  function pickRace(f) {
    var os = WH.Game.origins(f);
    if (os.length <= 1) { startGame(f.id, os[0] ? os[0].id : null); return; }
    UI.sel.faction = f.id;
    renderSelect();
  }
  function selectShell(title, sub, backFn) {
    var s = clear($("scr-select"));
    s.appendChild(h("div", {class: "bg"}, art("scene", "title")));
    s.appendChild(h("div", {class: "corner corner-left"},
      h("button", {class: "btn small px home-btn", type: "button", onclick: function () { show("title"); }}, "⌂ " + t("home")),
      backFn ? h("button", {class: "btn small px back-race", type: "button", onclick: backFn}, "◂ " + t("back_race")) : null));
    s.appendChild(h("div", {class: "corner"}, langButton()));
    var wrap = h("div", {class: "select-wrap"}, h("h2", null, title), sub ? h("div", {class: "select-sub"}, sub) : null);
    s.appendChild(wrap);
    return wrap;
  }

  function renderRaces() {
    var list = factionList();
    var wrap = selectShell(t("choose_race"), null, null);
    var big = list.length >= 6;                            // SPEC §26: 6+ races → compact cards in a grid (2 rows)
    var cards = h("div", {class: "cards race-cards" + (list.length >= 4 ? " many n" + list.length : "") + (big ? " grid" : ""), role: "list",
      vars: big ? {"--cols": Math.min(5, Math.ceil(list.length / 2))} : null});
    list.forEach(function (f) {
      var os = WH.Game.origins(f), dl = diffOf(f.id);
      cards.appendChild(h("button", {class: "fcard px", type: "button", role: "listitem", "data-faction": f.id, vars: {"--accent": fcolor(f)},
          "aria-label": L(f.name) + ". " + L(f.tagline) + (os.length > 1 ? " — " + t("origins_n", {n: os.length}) : "") + (dl ? " · " + t("diff_aria", {n: dl}) : ""),
          "data-sfx": "select", onclick: function () { pickRace(f); }},
        diffSkulls(dl, fcolor(f)),
        h("div", {class: "portrait"}, art("sprite", f.playerSprite, null, fcolor(f))),
        h("div", {class: "fname"}, L(f.name)),
        h("div", {class: "ftag"}, "“" + L(f.tagline) + "”"),
        h("div", {class: "fmeta"},
          h("span", {title: t("faction_stat")}, art("ui", f.renownIcon), L(f.renownLabel)),
          os.length > 1 ? h("span", {class: "oc"}, t("origins_n", {n: os.length})) : h("span", {class: "oc"}, L(os[0] && os[0].name))),
        h("div", {class: "go"}, "▶ " + (os.length > 1 ? t("pick") : t("start")))));
    });
    if (!list.length) cards.appendChild(h("div", {class: "empty-msg"}, h("p", null, t("no_factions")), h("p", null, h("small", null, t("no_factions_hint")))));
    wrap.appendChild(cards);
    var first = cards.querySelector("button");
    if (first) setTimeout(function () { if (!UI.modals.length) first.focus({preventScroll: true}); }, 0);
  }

  /* SPEC §23: an origin's starting values (hp/sanity default to its caps) */
  function originStart(o) {
    var caps = WH.Rules.capsOf(o), ss = (o && o.stats) || {}, out = {max: caps};
    WH.Rules.STATS.forEach(function (k) {
      var cap = caps[k] || 100, v = typeof ss[k] === "number" ? ss[k] : (caps[k] ? cap : 0);
      out[k] = Math.max(0, Math.min(cap, v));
    });
    return out;
  }
  function statPreview(f, o, base) {
    var rows = [["hp", "icon_hp", "var(--c-hp)"], ["sanity", "icon_sanity", "var(--c-sanity)"],
                ["corruption", "icon_corruption", "var(--c-corruption)"], ["renown", f.renownIcon, "var(--accent)"]];
    /* deltas vs the neutral baseline 100/100/0/10 (not vs the route's first origin, which may itself be a trade-off) */
    var me = originStart(o), b = {hp: 100, sanity: 100, corruption: 0, renown: 10};
    void base;
    var trade = ["hp", "sanity"].filter(function (k) { return me.max[k] !== 100; }).map(function (k) {
      var up = me.max[k] > 100;
      return h("span", {class: "tr " + (up ? "up" : "down")}, t("cap_" + k) + " " + me.max[k] + " " + (up ? "▲" : "▼"));
    });
    var kids = rows.map(function (r) {
      var k = r[0], v = me[k], cap = me.max[k] || 100;
      var d = b ? v - (b[k] || 0) : 0;
      var good = k === "corruption" ? d < 0 : d > 0;
      var scale = me.max[k] ? WH.Rules.CAP_MAX : 100;              // hp/sanity bars share a 0–130 scale (tick at 100)
      return h("div", {class: "orow" + (me.max[k] ? " capped" : ""), vars: {"--c": r[2]}},
        art("ui", r[1]),
        h("span", {class: "ol"}, k === "renown" ? L(f.renownLabel) : t(k)),
        h("span", {class: "obar", role: "progressbar", "aria-valuenow": v, "aria-valuemin": 0, "aria-valuemax": cap},
          h("i", {style: "width:" + Math.min(100, 100 * v / scale) + "%"})),
        h("b", {class: "ov"}, String(v)),
        h("span", {class: "od " + (d ? (good ? "up" : "down") : "")}, d ? signed(d) : ""));
    });
    var tradeRow = h("div", {class: "otrade"}, trade.length ? trade.reduce(function (a, x, i) { return a.concat(i ? [h("span", {class: "sep"}, " · "), x] : [x]); }, [])
                                                                : h("span", {class: "tr even"}, t("cap_even")));
    return h("div", {class: "ostats"}, kids.concat([tradeRow]));
  }

  function renderOrigins(f) {
    var os = WH.Game.origins(f);
    var wrap = selectShell(t("choose_origin"), L(f.name), function () { UI.sel.faction = null; renderSelect(); });
    $("scr-select").style.setProperty("--accent", fcolor(f));
    var cards = h("div", {class: "cards origin-cards n" + os.length, role: "list", vars: {"--accent": fcolor(f)}});
    os.forEach(function (o, i) {
      var dl = diffOf(f.id + "/" + o.id);
      cards.appendChild(h("button", {class: "ocard px", type: "button", role: "listitem", "data-origin": o.id, vars: {"--accent": fcolor(f)},
          "aria-label": L(o.name) + ". " + L(o.desc) + (dl ? " · " + t("diff_aria", {n: dl}) : ""), "data-sfx": "start", onclick: function () { startGame(f.id, o.id); }},
        diffSkulls(dl, fcolor(f)),
        h("div", {class: "portrait"}, art("sprite", o.sprite || f.playerSprite, null, fcolor(f))),
        h("div", {class: "oinfo"},
          h("div", {class: "oname"}, L(o.name)),
          o.desc ? h("div", {class: "odesc"}, L(o.desc)) : null,
          statPreview(f, o, i ? os[0] : null),
          h("div", {class: "go"}, "▶ " + t("start")))));
    });
    wrap.appendChild(cards);
    var first = cards.querySelector("button");
    if (first) setTimeout(function () { if (!UI.modals.length) first.focus({preventScroll: true}); }, 0);
  }

  /* ======================= GAME ======================= */
  function newRng() { return WH.RNG(UI.seed !== null ? UI.seed : undefined); }

  function startGame(fid, originId) {
    var g, step;
    try { var r = WH.newGame(fid, originId, gameOpts()); g = r.game; step = r.step; }
    catch (e) { toast(t("missing_node", {x: e.message})); console.error(e); return; }
    UI.game = g;
    enterGameScreen();
    playStep(step);
  }
  UI.startGame = startGame;

  function enterGameScreen() {
    var f = UI.game.faction;
    UI.accent = fcolor(f);
    $("stage").style.setProperty("--accent", UI.accent);
    $("scr-game").setAttribute("data-faction", f.id);          // per-faction theme tweaks in style.css
    closeConseq();
    UI.sceneKey = null; UI.actorKeys = {left: null, right: null};
    clear($("scene-img")); clear($("actor-left")); clear($("actor-right"));
    $("scr-game").classList.remove("insane", "corrupt", "glitching");
    closeEventOverlay();
    closeLore();
    UI.loreQueue = [];
    UI.rumorCodex = null;
    buildStats();
    buildTools();
    show("game");
    renderHud();
    UI.lastTick = performance.now();
  }

  function buildTools() {
    var tools = clear($("tools"));
    var b = function (icon, label, fn, aria) {
      return h("button", {class: "btn px", type: "button", onclick: fn, "aria-label": aria || label}, icon ? art("ui", icon) : null, label);
    };
    var cb = b("icon_codex", t("codex"), function () { openCodex(); });
    cb.appendChild(newBadge());
    tools.appendChild(cb);
    tools.appendChild(b("icon_save", t("save"), function () { openSaves("save"); }));
    tools.appendChild(b(null, t("load"), function () { openSaves("load"); }));
    tools.appendChild(b(null, t("settings"), openSettings));
    tools.appendChild(soundButton());
    tools.appendChild(b("icon_lang", t("lang_toggle"), toggleLang, t("language") + ": " + t("lang_toggle")));
    if (UI.settings.rewind === true) {                                   // SPEC §30: only while the switch is on
      var rw = b(null, "\u21B6 " + t("rewind_btn"), function () { rewindStep(); }, t("rewind_aria"));
      rw.id = "rewind-btn"; rw.classList.add("rewind-btn");
      rw.setAttribute("aria-keyshortcuts", "Z");
      rw.title = t("rewind_btn") + " (Z)";
      tools.appendChild(rw);
    }
    var home = b(null, "⌂ " + t("home"), goHome, t("home_aria"));
    home.classList.add("home-btn");
    home.setAttribute("aria-keyshortcuts", "H");
    home.title = t("home") + " (H)";
    tools.appendChild(home);
    updateCodexBadge();
    updateRewindBtn();
  }

  /* ---------- rewind (SPEC §30) ---------- */
  function updateRewindBtn() {
    var b = $("rewind-btn"), g = UI.game;
    if (!b) return;
    b.disabled = !(g && g.canRewind && g.canRewind());
  }
  /* back to just before the last choice (also from the ending screen). The reached ending stays recorded. */
  function rewindStep() {
    var g = UI.game;
    if (!g || UI.settings.rewind !== true || !g.canRewind || !g.canRewind()) return false;
    if (UI.busy || UI.modals.length || UI.cardDone || UI.lore) return false;
    if (UI.screen !== "game" && UI.screen !== "ending") return false;
    var fromEnding = UI.screen === "ending";
    if (g.state.ended) { WH.Save.addCodexGlobal(g.state.codex); recordRun(); }      // the player did see this ending: record it first
    if (!g.rewind()) return false;
    UI.lastRun = null; UI.rumorCodex = null; UI.rumorHeard = false;
    sfx("click");
    if (fromEnding) enterGameScreen();
    else { closeConseq(); closeEventOverlay(); }
    renderNode({instant: true});
    renderHud();
    applyStateFx();
    try { WH.Save.write("auto", g.toRecord({lang: WH.lang})); } catch (e) { /* reported by Save */ }
    toast("\u21B6 " + t("rewound"));
    return true;
  }
  UI.rewindStep = rewindStep;

  /* ⌂ Home: autosave first, then an in-UI confirm, then the title screen (Continue resumes the autosave) */
  function goHome() {
    var g = UI.game;
    if (UI.modals.length) return;
    if (g && !g.state.ended) {
      try { WH.Save.write("auto", g.toRecord({lang: WH.lang})); } catch (e) { /* storage errors are reported by Save */ }
    }
    confirmBox(t("home_confirm")).then(function (ok) {
      if (!ok) return;
      closeConseq(); closeEventOverlay(); closeLore();
      show("title");
    });
  }
  UI.goHome = goHome;

  function statLabel(k) {
    if (k === "renown") return L(UI.game.faction.renownLabel) || "Renown";
    return t(k);
  }

  function buildStats() {
    var f = UI.game.faction, box = clear($("stats"));
    [["hp", "icon_hp", "var(--c-hp)"], ["sanity", "icon_sanity", "var(--c-sanity)"],
     ["corruption", "icon_corruption", "var(--c-corruption)"], ["renown", f.renownIcon, "var(--accent)"]].forEach(function (d) {
      var info = d[0] === "renown" && f.renownHelp ? h("button", {class: "stat-info", type: "button", id: "stat-info",
        "aria-label": t("tip") + ": " + statLabel("renown"), title: t("tip"), onclick: function (e) { e.stopPropagation(); openRenownHelp(); }}, "ⓘ") : null;
      box.appendChild(h("div", {class: "stat", id: "stat-" + d[0], vars: {"--c": d[2]}, role: "group", "aria-label": statLabel(d[0])},
        art("ui", d[1]),
        h("div", {class: "col"},
          h("div", {class: "lab"}, h("span", null, statLabel(d[0]), info),
            h("span", {class: "val"}, h("b", {id: "sv-" + d[0]}, "0"), d[0] === "hp" || d[0] === "sanity" ? h("span", {class: "cap", id: "sm-" + d[0]}, "/100") : null)),
          h("div", {class: "bar", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, id: "sb-" + d[0]}, h("i", null)))));
    });
    clear($("clock-icon")).appendChild(art("ui", "icon_clock"));
  }

  /* SPEC §17: what the faction stat means */
  function renownHelpBody(f) {
    return h("div", {class: "tip-body", vars: {"--accent": fcolor(f)}},
      h("div", {class: "tip-head"}, h("span", {class: "tip-icon"}, art("ui", f.renownIcon)), h("b", null, L(f.renownLabel))),
      h("p", null, L(f.renownHelp)));
  }
  function openRenownHelp() {
    var g = UI.game;
    if (!g || !g.faction.renownHelp) return;
    openModal({title: t("tip") + " · " + L(g.faction.renownLabel), narrow: true, body: renownHelpBody(g.faction),
      reopen: function () { closeTop(true); openRenownHelp(); }});
  }
  UI.openRenownHelp = openRenownHelp;

  function renderHud(skipDate) {
    var g = UI.game;
    if (!g) return;
    updateRewindBtn();
    var view = UI.conseq && UI.conseq.view;          // during a consequence beat: stats before the next node's own effects
    var s = view ? view.stats : g.state.stats;
    WH.Rules.STATS.forEach(function (k) {
      var v = Math.round(s[k]);
      var bar = $("sb-" + k);
      if (!bar) return;
      var cap = g.cap ? g.cap(k) : 100;                      // SPEC §23: bars scale to the run's cap ("118/120")
      $("sv-" + k).textContent = v;
      if ($("sm-" + k)) $("sm-" + k).textContent = "/" + cap;
      bar.firstChild.style.width = Math.min(100, 100 * v / cap) + "%";
      bar.setAttribute("aria-valuenow", v);
      bar.setAttribute("aria-valuemax", cap);
      var danger = (k === "hp" || k === "sanity") ? v < 30 : (k === "corruption" ? v > 60 : false);
      $("stat-" + k).classList.toggle("low", danger);
    });
    if (!skipDate) $("date").textContent = WH.fmtDate(g.date());
    $("playtime").textContent = "⏱ " + WH.fmtPlay(g.state.playMs);
    var ch = view ? view.chapter : g.state.chapter, ct = g.faction.chapters && g.faction.chapters[ch];
    var plate = clear($("chapter-plate"));
    plate.appendChild(document.createTextNode(t("chapter_n", {n: WH.chapterNum(ch)})));
    if (ct) plate.appendChild(h("b", null, L(ct)));
  }

  function tickPlay() {
    var now = performance.now(), g = UI.game;
    if (g && UI.screen === "game" && !g.state.ended && !document.hidden) {
      g.state.playMs += Math.min(5000, now - UI.lastTick);
      $("playtime").textContent = "⏱ " + WH.fmtPlay(g.state.playMs);
    }
    UI.lastTick = now;
  }

  function setScene(key) {
    if (key === UI.sceneKey) return;
    UI.sceneKey = key;
    var box = $("scene-img");
    Array.prototype.forEach.call(box.children, function (c) {
      c.classList.add("leaving");
      setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 500);
    });
    var el = art("scene", key || "void");
    if (el) box.appendChild(el);
  }

  function setActor(side, key, dim) {
    var box = $("actor-" + side);
    box.classList.toggle("dim", !!dim);
    if (key === UI.actorKeys[side]) return;
    UI.actorKeys[side] = key;
    clear(box);
    if (key) {
      var a = art("sprite", key, "bob");
      box.appendChild(a);
      box.setAttribute("aria-label", (WH.sprites[key] && L(WH.sprites[key].name)) || key);
    }
    box.hidden = !key;
  }

  function nodeSpeakerName(node) {
    if (!node.speaker) return "";
    return L(node.speaker.name) || (WH.sprites[node.speaker.sprite] && L(WH.sprites[node.speaker.sprite].name)) || "";
  }

  /* render the current node; opts.instant = no typewriter (language switch / load);
   * opts.nodeId = re-render an earlier node's text only (language switch while a consequence beat is open) */
  function renderNode(opts) {
    opts = opts || {};
    var g = UI.game, node;
    try { node = opts.nodeId ? g.node(opts.nodeId) : g.node(); } catch (e) { toast(t("missing_node", {x: e.message})); return; }
    setScene(node.scene);
    setActor("left", node.speaker ? node.speaker.sprite : g.playerSprite(), !node.speaker);
    setActor("right", node.foe || null);
    var np = $("nameplate"), name = nodeSpeakerName(node);
    np.textContent = name;
    np.className = "nameplate" + (name ? "" : " narration");
    $("dlg-text").classList.toggle("narr", !node.speaker);
    if (opts.nodeId) { UI.typer.run(L(node.text), "instant"); renderRumor(null); renderGrudgeLine(null); return; }
    renderRumor(g.currentRumor ? g.currentRumor() : null, opts.instant);
    renderGrudgeLine(g.grudgeLine ? g.grudgeLine() : null, opts.instant);
    renderChoices(true);
    if (!UI.eventOpen) mood(au("moodFor", node, g.state, g.faction));
    var text = L(node.text);
    if (node.ending) {
      var gm = godsMet();
      if (gm.length) text += "\n\n" + t("gods_watched", {x: gm.map(godName).join(WH.lang === "zh" ? "、" : ", ")});
    }
    UI.typer.run(text, opts.instant ? "instant" : UI.settings.textSpeed, revealChoices);
    if (!opts.instant) taintWhisper();
    updateDlgH();
  }

  /* ---------- grudges (SPEC §28) ----------
   * node.grudgeLine (the wronged person is visibly there) → italic line right after the node text, only while the grudge is
   * active. Space reserved while the typewriter runs, faded in with the choices (revealGrudgeLine). Hidden in the consequence beat. */
  function renderGrudgeLine(gl, visible) {
    var el = $("dlg-grudge");
    if (!el) return;
    clear(el);
    el.classList.remove("show", "fade-in");
    if (!gl || !gl.text) { el.hidden = true; el.removeAttribute("data-npc"); return; }
    el.appendChild(h("em", null, L(gl.text)));
    el.setAttribute("data-npc", gl.npc);
    el.hidden = false;
    if (visible) el.classList.add("show");
  }
  function revealGrudgeLine() {
    var el = $("dlg-grudge");
    if (el && !el.hidden && !el.classList.contains("show")) {
      el.classList.add("show");
      if (UI.fxOn) el.classList.add("fade-in");
      updateDlgH();
    }
  }

  /* ---------- rumours (SPEC §20) ----------
   * Italic footer under the node text: "传闻 · <speaker>：<text>". Rendered with the node (space reserved, invisible),
   * revealed with a fade once the typewriter is done (revealRumor). Its codex unlocks (step.rumorCodex) are held in
   * UI.rumorCodex until then, so lore cards / toasts follow the normal settings but never cover the text being typed. */
  function renderRumor(r, visible) {
    var el = $("dlg-rumor");
    if (!el) return;
    clear(el);
    el.classList.remove("show", "fade-in");
    el.classList.remove("echo");
    el.removeAttribute("data-rumor"); el.removeAttribute("data-echo"); el.removeAttribute("role"); el.removeAttribute("tabindex");
    el.onclick = null; el.onkeydown = null;
    if (!r && UI.game && !UI.game.state.ended && UI.settings.echoes !== false && UI.game.currentEcho && UI.game.currentEcho()) { renderEcho(el, UI.game.currentEcho(), visible); return; }
    if (!r || UI.settings.rumors === false || !UI.game || UI.game.state.ended) { el.hidden = true; return; }
    var sp = L(r.speaker), zh = WH.lang === "zh";
    var head = t("rumor_tag") + (sp ? " · " + sp : "") + (zh ? "：" : ": ");
    var tx = h("span", {class: "rm-tx"});
    linkify(tx, L(r.text));
    el.appendChild(h("span", {class: "rm-head"}, h("span", {class: "rm-mark", "aria-hidden": "true"}, "”"), head));
    el.appendChild(tx);
    el.setAttribute("data-rumor", r.id);
    el.setAttribute("aria-label", t("rumor_aria", {x: (sp ? sp + (zh ? "：" : ": ") : "") + L(r.text)}));
    el.hidden = false;
    if (visible) el.classList.add("show");
  }
  /* SPEC §27: a past run's echo in the same footer style, with a ✝; click → that run in 往生录 */
  function renderEcho(el, e, visible) {
    var zh = WH.lang === "zh";
    el.classList.add("echo");
    el.appendChild(h("span", {class: "rm-head"}, h("span", {class: "rm-mark echo-mark", "aria-hidden": "true"}, "✝"), t("echo_tag") + (zh ? "：" : ": ")));
    el.appendChild(h("span", {class: "rm-tx"}, L(e.text)));
    el.setAttribute("data-echo", e.runId);
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", t("echo_aria", {x: L(e.text)}));
    var open = function (ev) { ev.stopPropagation(); if (ev.preventDefault) ev.preventDefault(); openCodex(null, false, "records", {run: e.runId}); };
    el.onclick = open;
    el.onkeydown = function (ev) { if (ev.key === "Enter" || ev.key === " ") open(ev); };
    el.hidden = false;
    if (visible) el.classList.add("show");
  }
  function echoPool() {
    return WH.Save.runs().filter(function (r) { return r && r.echo && (!UI.game || r.runId !== UI.game.state.runId); })
      .map(function (r) { return {runId: r.runId, endingId: r.endingId, echo: r.echo}; });
  }
  function gameOpts() {
    return {rng: newRng(), rumors: UI.settings.rumors !== false, echoes: UI.settings.echoes !== false, echoPool: echoPool(), rewind: UI.settings.rewind === true};
  }
  function revealRumor() {
    var el = $("dlg-rumor");
    if (el && !el.hidden && !el.classList.contains("show")) {
      el.classList.add("show");
      if (UI.fxOn) el.classList.add("fade-in");
      updateDlgH();
    }
    var ids = UI.rumorCodex;
    UI.rumorCodex = null;
    if (ids && ids.length) codexToast(ids);
    if (UI.rumorHeard) { UI.rumorHeard = false; bumpAchStat(function (st) { st.rumorsHeard = (st.rumorsHeard || 0) + 1; }); }
  }

  function reqHint(req) {
    var st = UI.game.state, parts = [];
    [].concat(req || []).forEach(function (q) {
      if (WH.Rules.requireOK(q, st)) return;
      if (q.flag !== undefined && !st.flags[q.flag]) parts.push(t("req_flag"));
      if (q.notFlag !== undefined && st.flags[q.notFlag]) parts.push(t("req_notflag"));
      if (q.stat) {
        var v = st.stats[q.stat];
        if (q.min !== undefined && v < q.min) parts.push(t("req_min", {s: statLabel(q.stat), v: q.min}));
        if (q.max !== undefined && v > q.max) parts.push(t("req_max", {s: statLabel(q.stat), v: q.max}));
      }
    });
    return parts.join(" · ");
  }

  function renderChoices(hidden) {
    var g = UI.game, box = clear($("choices"));
    box.classList.toggle("hidden-until", !!hidden);
    if (g.state.ended) {
      box.classList.add("one");
      box.appendChild(h("button", {class: "btn choice ending px", type: "button", onclick: showEnding}, t("to_ending")));
      return;
    }
    var list = g.choices();
    box.classList.toggle("one", list.length === 1);
    list.forEach(function (v, i) {
      var label, cls = "btn choice px", kids = [];
      if (v.forced) { label = t("death_" + v.death); cls += " forced"; }
      else label = L(v.choice.text);
      kids.push(h("span", {class: "num", "aria-hidden": "true"}, v.locked ? "🔒" : String(i + 1)));
      var ct = h("span", {class: "ct"}, label);
      if (v.locked) { cls += " locked"; ct.appendChild(h("span", {class: "hint"}, reqHint(v.choice.require) || t("locked"))); }
      var gnote = (v.grudge && !v.locked && v.grudge.note) ? L(v.grudge.note) : "";       // SPEC §28: ⚠ tag + why it is riskier
      if (v.grudge && !v.locked) { cls += " grudge"; if (gnote) ct.appendChild(h("span", {class: "gnote"}, gnote)); }
      kids.push(ct);
      if (v.grudge && !v.locked) kids.push(h("span", {class: "badge grudge-tag", "aria-hidden": "true", title: gnote}, "\u26A0"));
      if (v.roll && !v.locked) kids.push(h("span", {class: "badge", title: v.roll.stat ? statLabel(v.roll.stat) : ""}, t("risky") + " " + Math.round(v.roll.pEff * 100) + "%"));
      var aria = (i + 1) + ". " + label + (v.locked ? " (" + t("locked") + ": " + reqHint(v.choice.require) + ")" : "") +
                 (v.roll && !v.locked ? " (" + t("risky") + " " + Math.round(v.roll.pEff * 100) + "%)" : "") +
                 (gnote ? " (" + t("grudge_aria", {x: gnote}) + ")" : "");
      box.appendChild(h("button", {class: cls, type: "button", disabled: v.locked, "aria-label": aria, "data-i": i,
        title: gnote || null, onclick: function () { choose(i); }}, kids));
    });
  }

  function revealChoices() {
    revealGrudgeLine();
    revealRumor();
    flushLore();
    var box = $("choices");
    box.classList.remove("hidden-until");
    Array.prototype.forEach.call(box.children, function (c, i) {
      c.classList.add("fade-in");
      c.style.animationDelay = (i * 60) + "ms";
    });
  }

  function choose(i) {
    var g = UI.game;
    if (!g || UI.busy || UI.eventOpen || UI.modals.length || UI.lore || UI.conseq) return;
    if (UI.typer.active) { UI.typer.finish(); return; }
    if (g.state.ended) { showEnding(); return; }
    var v = g.choices()[i];
    if (!v || v.locked) return;
    Array.prototype.forEach.call($("choices").children, function (b) { b.disabled = true; });
    var prevId = g.state.nodeId, step;
    try { step = g.choose(i); } catch (e) { toast(t("missing_node", {x: e.message})); console.error(e); renderChoices(); return; }
    if (!step) { renderChoices(); return; }
    if (!v.forced && UI.settings.consequences !== false && step.consequence && step.consequence.show) {
      showConsequence(step, v.choice, prevId);
      return;
    }
    if (step.roll) toast(t("risky") + " " + Math.round(step.roll.pEff * 100) + "% → " + (step.roll.success ? t("roll_ok") : t("roll_fail")));
    playStep(step);
  }
  UI.choose = choose;

  /* afterCq: the consequence panel already showed the choice's deltas / roll / time skip */
  function playStep(step, afterCq) {
    var g = UI.game;
    UI.busy = true;
    if (step.codexNew && step.codexNew.length) codexToast(step.codexNew);
    if (step.kind === "event") {
      renderRumor(null);                                   // SPEC §20: never under an event
      renderGrudgeLine(null);
      renderHud();
      if (!afterCq) floatDeltas(step.choiceDeltas);
      UI.busy = false;
      openEvent(step.event);
      return;
    }
    var isDeath = step.ending && step.ending.kind === "death";
    UI.rumorCodex = step.rumorCodex && step.rumorCodex.length ? step.rumorCodex.slice() : null;
    UI.rumorHeard = !!step.rumor && UI.settings.rumors !== false;      // SPEC §25 global rumours-heard counter
    if (UI.rumorHeard) {                                               // SPEC §30: hearing the same rumour again after a rewind does not count twice
      var hk = g.state.runId + ":" + step.rumor.id;
      UI.heardRumors = UI.heardRumors || {};
      if (UI.heardRumors[hk]) UI.rumorHeard = false; else UI.heardRumors[hk] = 1;
    }
    var pre = (step.chapterChanged && !isDeath) ? chapterCard(g.state.chapter) : Promise.resolve();
    pre.then(function () {
      renderNode();
      renderHud(!!step.time && !step._timeShown);
      runStepFx(step, afterCq);
      autosave(step);
      UI.busy = false;
    });
  }

  /* ======================= CONSEQUENCE BEAT (SPEC §11) ======================= */
  var STAT_ICON = {hp: "icon_hp", sanity: "icon_sanity", corruption: "icon_corruption"};
  function signed(n) { return (n > 0 ? "+" : "\u2212") + Math.abs(n); }
  /* compact "♥ 生命 −10 · ◎ 理智 −5" line; big = it is the whole consequence (choice had no result text) */
  function deltaLine(d, big) {
    var ks = WH.Rules.STATS.filter(function (k) { return d && d[k]; });
    if (!ks.length) return null;
    var f = UI.game && UI.game.faction;
    return h("div", {class: "cq-deltas" + (big ? " big" : "")}, ks.map(function (k, i) {
      var bad = k === "corruption" ? d[k] > 0 : d[k] < 0;
      return [i ? h("span", {class: "sep", "aria-hidden": "true"}, "·") : null,
        h("span", {class: "cq-d " + (bad ? "bad" : "good") + " k-" + k},
          art("ui", k === "renown" ? (f && f.renownIcon) || "icon_faith" : STAT_ICON[k]), statLabel(k) + " " + signed(d[k]))];
    }));
  }
  function timeChip(tm) {
    return h("span", {class: "cq-time" + (tm.warp ? " warp" : "")}, "⌛ " + (tm.warp ? t("time_warp") + " · " : "") + timeLabel(tm));
  }
  /* shared panel for node choices and event choices. o: {pick, roll, text, deltas, death, time} */
  function conseqBlock(o, onContinue) {
    var textEl = h("div", {class: "cq-text", "aria-hidden": "true", hidden: !o.text});
    var live = h("div", {class: "sr-only", "aria-live": "polite"});
    var btn = h("button", {class: "btn choice ending cq-go px", type: "button", onclick: onContinue}, t("cont_btn") + " ▸");
    var meta = [deltaLine(o.deltas, !o.text), o.time ? timeChip(o.time) : null].filter(Boolean);
    var el = h("div", {class: "conseq" + (o.death ? " fatal" : "") + (o.text ? "" : " no-text")},
      o.grudge ? h("div", {class: "cq-grudge", role: "note"}, h("span", {class: "gmark", "aria-hidden": "true"}, "\u26A0"), h("span", {class: "gtx"}, o.grudge)) : null,
      o.pick ? h("div", {class: "cq-pick"}, h("span", {class: "k"}, t("cq_you_chose")), h("span", {class: "v"}, o.pick)) : null,
      o.roll ? h("div", {class: "cq-roll " + (o.roll.success ? "ok" : "fail")},
        h("span", {class: "die", "aria-hidden": "true"}, "⚄"), t("risky") + " " + Math.round(o.roll.pEff * 100) + "%",
        h("span", {class: "arr", "aria-hidden": "true"}, "→"), h("b", null, o.roll.success ? t("roll_ok") : t("roll_fail"))) : null,
      textEl, live,
      h("div", {class: "cq-foot"},
        h("div", {class: "cq-left"},
          meta.length ? h("div", {class: "cq-meta"}, meta) : null,
          o.death ? h("div", {class: "cq-death"}, h("span", {class: "tag"}, t("cq_fatal")), t("death_" + o.death)) : null),
        h("div", {class: "cq-btns"}, btn)));
    var typer = new Typer(textEl, live);
    typer.linkify = true;
    return {el: el, typer: typer, btn: btn, live: live,
      run: function (text, instant, done) {
        if (!text) { live.textContent = el.textContent; done(); return; }
        el.classList.add("typing");
        typer.run(text, instant ? "instant" : UI.settings.textSpeed, function () { el.classList.remove("typing"); done(); });
      }};
  }

  function showConsequence(step, choice, prevId) {
    var g = UI.game, view = {stats: {}, chapter: g.state.chapter};
    WH.Rules.STATS.forEach(function (k) { view.stats[k] = g.state.stats[k] - ((step.nodeDeltas && step.nodeDeltas[k]) || 0); });
    if (step.chapterChanged && step.fromChapter) view.chapter = step.fromChapter;
    UI.conseq = {step: step, choice: choice, prevId: prevId, view: view};
    sfx("consequence");
    renderConseq(false);
    renderHud(!!step.time);
    floatDeltas(step.choiceDeltas);
    if (step.choiceDeltas.hp < 0) { shake($("scr-game")); flash(); if (UI.actorKeys.right) actorAnim("right", "lunge"); }
    if (step.roll && step.roll.success && UI.actorKeys.right) actorAnim("right", "hit");
    if (step.time && step.kind !== "event") {
      timeSkip(step.time);
      if (step.time.warp) glitch($("scr-game"), 1500);
      step._timeShown = true;
    }
    applyStateFx();
  }
  UI.showConsequence = showConsequence;

  function renderConseq(instant) {
    var c = UI.conseq;
    if (!c) return;
    var cq = c.step.consequence, old = $("conseq");
    if (old) old.remove();
    if (c.block) c.block.typer.stop();
    var box = $("dialogue");
    box.classList.add("cq-mode");
    $("choices").hidden = true;
    var b = conseqBlock({pick: L(c.choice.text), roll: cq.roll, text: cq.text ? L(cq.text) : null, deltas: cq.deltas,
                         death: cq.death, time: c.step.kind === "event" ? null : cq.time,
                         grudge: cq.grudge && cq.grudge.note ? L(cq.grudge.note) : null}, consequenceContinue);
    b.el.id = "conseq";
    box.appendChild(b.el);
    c.block = b;
    b.run(cq.text ? L(cq.text) : null, instant, function () {
      if (UI.conseq !== c) return;
      if (!UI.lore && !UI.modals.length) b.btn.focus({preventScroll: true});
      updateDlgH();
    });
    updateDlgH();
  }

  function consequenceContinue() {
    var c = UI.conseq;
    if (!c) return;
    if (c.block && c.block.typer.active) { c.block.typer.finish(); return; }
    closeConseq();
    playStep(c.step, true);
  }
  UI.consequenceContinue = consequenceContinue;

  function closeConseq() {
    var c = UI.conseq;
    if (c && c.block) c.block.typer.stop();
    UI.conseq = null;
    var el = $("conseq");
    if (el) el.remove();
    $("dialogue").classList.remove("cq-mode");
    $("choices").hidden = false;
  }

  function autosave(step) {
    var g = UI.game;
    if (g.state.ended) { WH.Save.remove("auto"); return; }
    if (step.chapterChanged || g.state.visits % 5 === 0) WH.Save.write("auto", g.toRecord({lang: WH.lang}));
  }

  /* ---------- FX ---------- */
  function runStepFx(step, afterCq) {
    var g = UI.game, node = g.node();
    var d = afterCq ? (step.nodeDeltas || {}) : step.deltas;
    floatDeltas(d);
    if (d.hp < 0) {
      shake($("scr-game"));
      flash();
      if (node.foe) actorAnim("right", "lunge");
    }
    if (!afterCq && step.roll && step.roll.success && node.foe) actorAnim("right", "hit");
    if (step.time && !step._timeShown) {
      timeSkip(step.time);
      if (step.time.warp) glitch($("scr-game"), 1500);
    }
    applyStateFx();
  }

  function deltaSfx(d) {
    if (!d) return;
    if (d.hp < 0) sfx("damage");
    else if (d.corruption > 0) sfx("corrupt");
    else if (d.sanity < 0) sfx("sanity");
    else if (d.hp > 0 || d.sanity > 0) sfx("heal");
  }
  function floatDeltas(d) {
    if (!d) return;
    deltaSfx(d);
    var i = 0;
    WH.Rules.STATS.forEach(function (k) {
      if (!d[k]) return;
      var host = $("stat-" + k);
      if (!host) return;
      var el = h("span", {class: "floater " + (d[k] > 0 ? "pos" : "neg") + (k === "corruption" ? " bad" : ""), "aria-hidden": "true"},
        (d[k] > 0 ? "+" : "") + d[k]);
      el.style.animationDelay = (i++ * 120) + "ms";
      host.appendChild(el);
      setTimeout(function () { el.remove(); }, 1900);
    });
  }

  function shake(el) {
    if (!UI.fxOn) return;
    el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake");
    setTimeout(function () { el.classList.remove("shake"); }, 450);
  }
  function flash() {
    var f = $("flash");
    f.classList.remove("on"); void f.offsetWidth; f.classList.add("on");
    setTimeout(function () { f.classList.remove("on"); }, 500);
  }
  function actorAnim(side, cls) {
    if (!UI.fxOn) return;
    var a = $("actor-" + side);
    a.classList.remove(cls); void a.offsetWidth; a.classList.add(cls);
    setTimeout(function () { a.classList.remove(cls); }, 500);
  }
  function glitch(el, ms) {
    if (!UI.fxOn) return;
    el.classList.add("glitching");
    clearTimeout(el._gt);
    el._gt = setTimeout(function () { el.classList.remove("glitching"); }, ms);
  }

  function timeLabel(tm) {
    var a = tm.added;
    if (a >= 8760 * 0.95) { var y = a / 8760; return t("time_y", {n: y >= 10 ? Math.round(y) : Math.round(y * 10) / 10}); }
    if (a >= 24) return t("time_d", {n: Math.round(a / 24)});
    return t("time_h", {n: a});
  }

  function timeSkip(tm) {
    var tk = $("ticker"), dateEl = $("date"), g = UI.game, sd = g.faction.startDate;
    var final = function () { dateEl.classList.remove("warping"); dateEl.textContent = WH.fmtDate(g.date()); };
    tk.className = "ticker px" + (tm.warp ? " warp" : "");
    tk.textContent = tm.warp ? "⌛ " + t("time_warp") + " · ???" : "⌛ " + timeLabel(tm);
    void tk.offsetWidth; tk.classList.add("show");
    clearTimeout(tk._t); tk._t = setTimeout(function () { tk.classList.remove("show"); }, 2000);
    cancelAnimationFrame(UI.dateAnim);
    if (!UI.fxOn) { final(); return; }
    var roll = function () {
      var t0 = performance.now(), dur = 950;
      var frame = function (now) {
        var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        var hrs = Math.round(tm.from + (tm.to - tm.from) * e);
        dateEl.textContent = WH.fmtDate(WH.Rules.dateParts(hrs - (hrs % 1), sd));
        if (p < 1) UI.dateAnim = requestAnimationFrame(frame); else final();
      };
      UI.dateAnim = requestAnimationFrame(frame);
    };
    if (tm.warp) {
      sfx("warp");
      dateEl.classList.add("warping");
      var n = 0, iv = setInterval(function () {
        dateEl.textContent = (n++ % 2) ? t("date_unknown") : "???.M4? · " + Math.floor(Math.random() * 999);
        if (n > 9) {
          clearInterval(iv);
          dateEl.classList.remove("warping");
          tk.textContent = "⌛ " + t("time_warp") + " · " + timeLabel(tm);
          roll();
        }
      }, 85);
    } else roll();
  }

  /* SPEC §18: the god with the highest hidden taint ≥ 50 (for subtle tells only — never shown as a number) */
  function taintTell() {
    var g = UI.game, tt = g && g.state.taint, best = null;
    if (!tt) return null;
    WH.Rules.GODS.forEach(function (gd) { if ((tt[gd] || 0) >= 50 && (!best || tt[gd] > tt[best])) best = gd; });
    return best;
  }
  function taintWhisper() {
    var gd = taintTell();
    if (!gd || !UI.fxOn || UI.screen !== "game" || Math.random() > 0.18) return;
    var list = t("tw_" + gd), box = $("whispers");
    if (!Array.isArray(list) || !box) return;
    var w = h("span", {class: "whisper taint-w god-" + gd}, list[Math.floor(Math.random() * list.length)]);
    w.style.left = (8 + Math.random() * 50) + "%";
    w.style.top = (20 + Math.random() * 36) + "%";
    box.appendChild(w);
    setTimeout(function () { w.remove(); }, 3300);
  }
  function applyStateFx() {
    var g = UI.game, s = g.state.stats, scr = $("scr-game");
    scr.classList.toggle("insane", UI.fxOn && s.sanity < 30);
    scr.classList.toggle("corrupt", s.corruption > 60);
    var tell = taintTell();
    if (tell) scr.setAttribute("data-taint", tell); else scr.removeAttribute("data-taint");
    if (UI.fxOn && s.sanity < 30 && UI.screen === "game") startWhispers(); else stopWhispers();
  }
  function startWhispers() {
    if (UI.whisperTimer) return;
    var spawn = function () {
      var list = t("whispers"), box = $("whispers");
      var w = h("span", {class: "whisper"}, list[Math.floor(Math.random() * list.length)]);
      w.style.left = (4 + Math.random() * 62) + "%";
      w.style.top = (16 + Math.random() * 44) + "%";
      box.appendChild(w);
      setTimeout(function () { w.remove(); }, 3300);
    };
    spawn();
    UI.whisperTimer = setInterval(spawn, 2300);
  }
  function stopWhispers() { clearInterval(UI.whisperTimer); UI.whisperTimer = null; var b = $("whispers"); if (b) clear(b); }

  function chapterCard(n) {
    return new Promise(function (resolve) {
      var f = UI.game.faction, title = f.chapters && f.chapters[n];
      var done = false, el;
      var finish = function () {
        if (done) return; done = true;
        UI.cardDone = null;
        if (el.parentNode) el.parentNode.removeChild(el);
        resolve();
      };
      el = h("div", {class: "chapter-card", role: "dialog", "aria-label": t("chapter_n", {n: n}) + " " + L(title), onclick: finish},
        h("div", {class: "k"}, t("chapter_card", {n: WH.chapterNum(n)})),
        h("div", {class: "rule"}),
        h("div", {class: "t"}, L(title) || "· · ·"),
        h("div", {class: "rule"}),
        h("div", {class: "f"}, L(f.name) + " · " + WH.fmtDate(UI.game.date())));
      if (!UI.fxOn) el.style.animation = "none";
      $("overlay-root").appendChild(el);
      UI.cardDone = finish;
      setTimeout(finish, UI.fxOn ? 2600 : 1300);
    });
  }

  /* ---------- toasts ---------- */
  function toast(msg) {
    var root = $("overlay-root"), box = root.querySelector(".toasts");
    if (!box) { box = h("div", {class: "toasts", role: "status", "aria-live": "polite"}); root.appendChild(box); }
    var el = h("div", {class: "toast px"}, msg);
    while (box.children.length >= 3) box.removeChild(box.firstChild);
    box.appendChild(el);
    setTimeout(function () { el.remove(); }, 2700);
  }
  UI.toast = toast;
  /* ids newly unlocked in this run. Settings (all persisted):
   *   loreCards: "new"  (default) card for entries never seen before; already-collected ones → knownHint
   *              "all"  card for every unlock; already-collected ones are marked 已收录 (unless knownHint is "silent")
   *              "codex" no cards; toasts only
   *   knownHint: "toast" (default) small toast for already-collected entries · "silent" nothing (still recorded in the run) */
  function codexToast(ids) {
    var glob = WH.Save.codexGlobal(), st = UI.settings;
    var mode = st.loreCards === "all" || st.loreCards === "codex" ? st.loreCards : "new";
    var silent = st.knownHint === "silent";
    var valid = ids.filter(function (id) { return WH.codex[id]; });
    var fresh = valid.filter(function (id) { return glob.indexOf(id) < 0; });
    var known = valid.filter(function (id) { return glob.indexOf(id) >= 0; });
    var cardIds = mode === "codex" ? [] : fresh.concat(mode === "all" && !silent ? known : []);
    cardIds.forEach(function (id) { if (UI.loreQueue.indexOf(id) < 0) UI.loreQueue.push(id); });
    known.forEach(function (id) { UI.loreKnown[id] = 1; });
    var toastIds = valid.filter(function (id) {
      if (cardIds.indexOf(id) >= 0) return false;
      return fresh.indexOf(id) >= 0 || !silent;
    });
    var names = toastIds.map(function (id) { return L(WH.codex[id].name); });
    if (names.length) { toast("▤ " + t("codex_new", {x: names.join(WH.lang === "zh" ? "、" : ", ")})); sfx("codex"); }
    WH.Save.addCodexGlobal(ids);
    updateCodexBadge();
    checkAchievements();
  }

  /* ======================= EVENTS ======================= */
  function openEvent(e) {
    var g = UI.game, god = e.god || "other";
    closeEventOverlay();
    UI.eventOpen = true;
    var sideSprite = e.speaker && e.speaker.sprite;
    var sigilKey = ["khorne", "nurgle", "tzeentch", "slaanesh", "undivided"].indexOf(god) >= 0 ? "sigil_" + god : null;
    var textEl = h("div", {class: "event-text", "aria-hidden": "true"});
    var live = h("div", {class: "sr-only", "aria-live": "polite"});
    var resEl = h("div", {class: "event-result", hidden: true});
    var chEl = h("div", {class: "choices hidden-until", role: "group"});
    var isClaim = e.trigger === "claim";
    var back = h("div", {class: "event-back god-" + god + (isClaim ? " claim" : ""), id: "event-overlay", role: "dialog", "aria-modal": "true", "aria-label": t("event_tag")},
      h("div", {class: "ebg"}, art("scene", e.scene || "warp")),
      h("div", {class: "scan"}),
      h("div", {class: "event-panel px", onclick: function (ev) {
        if (ev.target.closest("button")) return;
        if (UI.evTyper.active) UI.evTyper.finish();
        else if (UI.event && UI.event.cq && UI.event.cq.typer.active) UI.event.cq.typer.finish();
      }},
        h("div", {class: "event-side"}, sideSprite ? art("sprite", sideSprite) : (sigilKey ? art("sprite", sigilKey) : null),
          sideSprite && sigilKey ? h("div", {class: "sigil"}, art("sprite", sigilKey)) : null),
        h("div", {class: "event-main"},
          h("div", {class: "event-tag"}, "✶ " + (isClaim ? t("claim_tag") : t("event_tag")) + " · " + t("god_" + god)),
          h("div", {class: "event-name"}, e.speaker ? L(e.speaker.name) : t("god_" + god)),
          textEl, live, resEl, chEl)));
    $("overlay-root").appendChild(back);
    sfx("event");
    mood("warp");
    UI.evTyper = new Typer(textEl, live);
    UI.evTyper.linkify = true;
    UI.event = {e: e, back: back, resEl: resEl, chEl: chEl};
    glitch(back, 1300);
    var dateEl = $("date");
    if (UI.fxOn) { dateEl.classList.add("warping"); setTimeout(function () { dateEl.classList.remove("warping"); }, 1300); }
    if (g.state.eventChoice !== null) {                 // resumed from a save / language switch after choosing
      UI.evTyper.run(L(e.text), "instant");
      showEventResult(e.choices[g.state.eventChoice], UI.eventLast && UI.eventLast.e === e.id ? UI.eventLast.r : null, true);
      return;
    }
    // SPEC §19: event choices honour `require` / hideIfLocked (e.g. a claim's forced second-time choice)
    (g.eventChoices ? g.eventChoices() : e.choices.map(function (c, i) { return {index: i, choice: c, locked: false}; })).forEach(function (v, pos) {
      var ct = h("span", {class: "ct"}, L(v.choice.text));
      if (v.locked) ct.appendChild(h("span", {class: "hint"}, reqHint(v.choice.require) || t("locked")));
      chEl.appendChild(h("button", {class: "btn choice px" + (v.locked ? " locked" : ""), type: "button", disabled: v.locked, "data-i": v.index,
        onclick: function () { eventChoose(v.index); }},
        h("span", {class: "num"}, v.locked ? "🔒" : String(pos + 1)), ct));
    });
    UI.evTyper.run(L(e.text), UI.settings.textSpeed, function () {
      flushLore();
      chEl.classList.remove("hidden-until");
      Array.prototype.forEach.call(chEl.children, function (c, i) { c.classList.add("fade-in"); c.style.animationDelay = i * 60 + "ms"; });
      var first = chEl.querySelector("button"); if (first) first.focus({preventScroll: true});
    });
  }

  function eventChoose(i) {
    var g = UI.game;
    if (!UI.event || UI.evTyper.active) { if (UI.evTyper && UI.evTyper.active) UI.evTyper.finish(); return; }
    var r = g.eventChoose(i);
    if (!r) return;
    if (r.codexNew.length) codexToast(r.codexNew);
    renderHud();
    applyStateFx();
    deltaSfx(r.deltas);
    if (r.deltas.hp < 0) { shake(UI.event.back.querySelector(".event-panel")); flash(); }
    glitch(UI.event.back, 500);
    floatDeltas(r.deltas);
    UI.eventLast = {e: UI.event.e.id, r: r};
    showEventResult(r.choice, r, false);
  }

  /* same consequence panel as node choices: chosen option, result (typewriter), stat line, fatal line, Continue */
  function showEventResult(c, r, instant) {
    var ev = UI.event, g = UI.game;
    clear(ev.chEl);
    ev.chEl.hidden = true;
    ev.resEl.hidden = false;
    clear(ev.resEl);
    var cq = (r && r.consequence) || {deltas: {}, death: g.state.eventDeath || null};
    var b = conseqBlock({pick: L(c.text), text: L(c.result) || "……", deltas: cq.deltas, death: cq.death}, eventContinue);
    b.btn.classList.add("event-go");
    if (!instant) sfx("consequence");
    ev.resEl.appendChild(b.el);
    ev.cq = b;
    b.run(L(c.result) || "……", instant, function () {
      if (UI.event !== ev) return;
      flushLore();
      if (!UI.lore) b.btn.focus({preventScroll: true});
    });
  }

  function eventContinue() {
    var g = UI.game;
    if (UI.event && UI.event.cq && UI.event.cq.typer.active) { UI.event.cq.typer.finish(); return; }
    closeEventOverlay();
    var step;
    try { step = g.eventContinue(); } catch (e) { toast(t("missing_node", {x: e.message})); return; }
    if (step) playStep(step);
  }

  function closeEventOverlay() {
    var o = $("event-overlay");
    if (o) o.remove();
    if (UI.evTyper) UI.evTyper.stop();
    if (UI.event && UI.event.cq) UI.event.cq.typer.stop();
    UI.eventOpen = false;
    UI.event = null;
  }

  /* ======================= LORE CARDS + KEYWORD LINKS ======================= */
  var GODS = ["khorne", "nurgle", "tzeentch", "slaanesh"];

  function entryColor(c, id) { return raceColor(raceOf(c, id)); }

  function flushLore() {
    if (UI.settings.loreCards === "codex") { UI.loreQueue = []; return; }
    if (!UI.loreQueue.length || UI.lore || UI.modals.length) return;
    var ids = UI.loreQueue.splice(0);
    showLore(ids, 0, true);
  }

  /* ids: codex ids; i: index; auto: popped by an unlock (vs. opened from a keyword) */
  function showLore(ids, i, auto) {
    var c = WH.codex[ids[i]];
    if (!c) { if (i + 1 < ids.length) showLore(ids, i + 1, auto); else closeLore(); return; }
    var prev = UI.lore ? UI.lore.prev : document.activeElement;
    var old = $("lore-overlay"); if (old) old.remove();
    UI.lore = {ids: ids, i: i, auto: auto, prev: prev};
    var last = i + 1 >= ids.length;
    var cont = h("button", {class: "btn primary px", type: "button", onclick: loreNext}, last ? t("cont_btn") : t("cont_btn") + " ▸");
    var auto_ = null, isKnown = auto && !!UI.loreKnown[ids[i]];
    if (auto) {
      var cb = h("input", {type: "checkbox", id: "lore-auto-off"});
      cb.checked = UI.settings.loreCards === "codex";
      cb.addEventListener("change", function () { UI.settings.loreCards = cb.checked ? "codex" : "new"; WH.Save.saveSettings(UI.settings); });
      var kb = h("input", {type: "checkbox", id: "lore-known-off"});
      kb.checked = UI.settings.knownHint === "silent";
      kb.addEventListener("change", function () {
        UI.settings.knownHint = kb.checked ? "silent" : "toast";
        if (kb.checked && UI.settings.loreCards === "all") UI.settings.loreCards = "new";
        WH.Save.saveSettings(UI.settings);
      });
      auto_ = h("div", {class: "lore-opts"},
        h("label", {class: "lore-auto", for: "lore-auto-off"}, cb, t("lore_auto_off")),
        h("label", {class: "lore-auto", for: "lore-known-off"}, kb, t("lore_known_off")));
    }
    var isPlace = typeOf(c) === "place" || c.cat === "place";
    var rc = entryColor(c, ids[i]);
    var back = h("div", {class: "lore-back", id: "lore-overlay", role: "dialog", "aria-modal": "true", "aria-label": L(c.name)},
      h("div", {class: "lore-card px" + (isPlace ? " place" : ""), "data-race": raceOf(c, ids[i]), vars: {"--cat": rc, "--cat-ink": inkOn(rc)}},
        isPlace ? h("div", {class: "lore-banner"}, art("scene", c.scene || "void"))
                : isChronicle(c) && !c.sprite ? h("div", {class: "lore-pic chr-seal", "aria-hidden": "true"}, h("span", {class: "px"}, chrMill(c) === 0 ? t("chr_ancient") : chrMill(c) ? "M" + chrMill(c) : "M??"))
                : h("div", {class: "lore-pic"}, art("sprite", c.sprite, null, rc)),
        h("div", {class: "lore-main"},
          h("div", {class: "lore-top"},
            h("span", {class: "lore-cat"}, badgeText(ids[i])),
            c.date ? h("span", {class: "lore-date"}, L(c.date)) : null,
            auto ? (isKnown ? h("span", {class: "lore-new known"}, "✓ " + t("lore_known")) : h("span", {class: "lore-new"}, "✦ " + t("lore_new"))) : null,
            ids.length > 1 ? h("span", {class: "lore-count"}, (i + 1) + "/" + ids.length) : null),
          h("h3", {class: "lore-name"}, L(c.name)),
          h("p", {class: "lore-text"}, L(c.text)),
          c.more ? h("p", {class: "lore-more"}, L(c.more)) : null,
          h("div", {class: "lore-btns"}, auto_,
            auto && !last ? h("button", {class: "btn small px", type: "button", onclick: function () { closeLore(); }}, t("lore_skip")) : null,
            cont))));
    back.addEventListener("mousedown", function (e) { if (e.target === back) { e.preventDefault(); loreNext(); } });
    $("overlay-root").appendChild(back);
    if (auto && i === 0) sfx(raceOf(c, ids[i]) === "necrons" ? "scan" : "codex");
    setTimeout(function () { cont.focus({preventScroll: true}); }, 0);
  }
  function loreNext() {
    var lo = UI.lore;
    if (!lo) return;
    if (lo.i + 1 < lo.ids.length) showLore(lo.ids, lo.i + 1, lo.auto); else closeLore();
  }
  function closeLore() {
    var lo = UI.lore, o = $("lore-overlay");
    if (o) o.remove();
    UI.lore = null;
    if (lo && lo.prev && lo.prev.focus && document.contains(lo.prev) && lo.prev.tagName === "BUTTON") lo.prev.focus({preventScroll: true});
    else if (UI.screen === "game" && !UI.eventOpen) $("dialogue").focus({preventScroll: true});
  }
  UI.showLore = showLore;
  UI.closeLore = closeLore;

  function unlockedSet() {
    var s = {};
    WH.Save.codexGlobal().forEach(function (id) { s[id] = 1; });
    if (UI.game) UI.game.state.codex.forEach(function (id) { s[id] = 1; });
    return s;
  }
  function codexTerms() {
    var terms = [], un = unlockedSet(), en = WH.lang === "en";
    Object.keys(un).forEach(function (id) {
      var c = WH.codex[id];
      if (!c) return;
      var names = [L(c.name)].concat((c.aliases && c.aliases[WH.lang]) || []);
      if (en && /^the\s+/i.test(names[0])) names.push(names[0].replace(/^the\s+/i, ""));
      names.forEach(function (n) {
        n = (n || "").trim();
        if (n.length >= (en ? 3 : 2)) terms.push({term: en ? n.toLowerCase() : n, id: id});
      });
    });
    terms.sort(function (a, b) { return b.term.length - a.term.length; });
    return terms;
  }
  function linkify(el, text) {
    clear(el);
    var terms = codexTerms();
    if (!terms.length) { el.textContent = text; return; }
    var en = WH.lang === "en", hay = en ? text.toLowerCase() : text, ranges = [], used = {};
    var wordCh = /[a-z0-9]/i;
    terms.forEach(function (tm) {
      if (used[tm.id]) return;
      var from = 0, idx;
      while ((idx = hay.indexOf(tm.term, from)) >= 0) {
        var end = idx + tm.term.length;
        var okB = !en || ((idx === 0 || !wordCh.test(hay[idx - 1])) && (end >= hay.length || !wordCh.test(hay[end]) || hay[end] === "s"));
        var overlap = ranges.some(function (r) { return idx < r.e && end > r.s; });
        if (okB && !overlap) { ranges.push({s: idx, e: end, id: tm.id}); used[tm.id] = 1; return; }
        from = idx + 1;
      }
    });
    ranges.sort(function (a, b) { return a.s - b.s; });
    var pos = 0;
    ranges.forEach(function (r) {
      if (r.s > pos) el.appendChild(document.createTextNode(text.slice(pos, r.s)));
      var c = WH.codex[r.id];
      el.appendChild(h("span", {class: "kw", "data-id": r.id},
        text.slice(r.s, r.e),
        h("span", {class: "kw-tip", "aria-hidden": "true"}, h("b", null, L(c.name)), " · " + badgeText(r.id), h("br"), L(c.text))));
      pos = r.e;
    });
    if (pos < text.length) el.appendChild(document.createTextNode(text.slice(pos)));
  }

  function godsMet() {
    var g = UI.game;
    if (!g) return [];
    return GODS.filter(function (god) {
      var ev = g.state.seenEvents.some(function (eid) { var e = g.event(eid); return e && e.god === god; });
      var cx = g.state.codex.some(function (id) { return WH.codex[id] && WH.codex[id].cat === "god" && id.indexOf(god) >= 0; });
      return ev || cx;
    });
  }
  function godCodex(god) {
    if (WH.codex["god_" + god]) return WH.codex["god_" + god];
    var id = Object.keys(WH.codex).filter(function (k) { return WH.codex[k].cat === "god" && k.indexOf(god) >= 0; })[0];
    return id ? WH.codex[id] : null;
  }
  function godName(god) { var c = godCodex(god); return c ? L(c.name) : t("god_" + god); }
  /* ending-only reveal of the hidden taint (SPEC §18) */
  function taintVerdict(god, v) {
    var claimed = UI.game && (UI.game.state.flags["claimed_" + god] ||
      UI.game.state.seenEvents.some(function (id) { var e = UI.game.event(id); return e && e.trigger === "claim" && e.god === god; }));
    var owned = UI.game && UI.game.state.ended && claimGod() === god;      // SPEC §19 claim ending
    var k = owned ? "tv_owned" : claimed || v >= 100 ? "tv_claimed" : v >= 70 ? "tv_brand" : v >= 30 ? "tv_watch" : v > 0 ? "tv_glance" : "tv_none";
    return t(k, {g: godName(god)});
  }
  /* SPEC §19: the god whose claim ending this run reached (node id contains "_end_claim_<god>"), else null */
  function claimGod() { var g = UI.game; return g && g.state.ended && WH.Rules.claimGodOf ? WH.Rules.claimGodOf(g.state.nodeId) : null; }
  /* claim ending: big sigil + bar + "你已归属于<神>" at the top of the ending's scroll area */
  function claimBanner(god, v) {
    return h("div", {class: "claim-banner god-" + god, role: "note", "data-god": god},
      h("div", {class: "cb-sigil"}, art("sprite", "sigil_" + god, "fit", "#8a4fd0")),
      h("div", {class: "cb-body"},
        h("div", {class: "cb-k"}, t("claim_tag") + " · " + godName(god)),
        h("div", {class: "cb-verdict"}, t("tv_owned", {g: godName(god)})),
        taintReveal(god, v)));
  }
  function taintReveal(god, v) {
    return h("div", {class: "taint-rev" + (v >= 70 ? " hi" : v >= 30 ? " mid" : ""), "data-god": god},
      h("div", {class: "tbar", role: "meter", "aria-valuenow": v, "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": t("taint_label") + " " + godName(god)},
        h("i", {style: "width:" + v + "%"})),
      h("div", {class: "tverdict"}, taintVerdict(god, v)));
  }

  /* ---------- run records ---------- */
  function causeOf(f, id, node) {
    if (node && node.ending && node.ending.cause) return node.ending.cause;
    var k = null, dn = f.deathNodes || {};
    for (var key in dn) if (dn[key] === id) k = key;
    if (!k && id && id.indexOf("__death_") === 0) k = id.slice(8);
    if (k && WH.I18N.zh["cause_" + k]) return {zh: WH.I18N.zh["cause_" + k], en: WH.I18N.en["cause_" + k]};
    return (node && node.ending && node.ending.title) || {zh: "—", en: "—"};
  }
  /* "出身" display name: the run's origin, else a stored name, else the faction role */
  function originLabel(f, oid, stored) {
    var list = WH.Game.origins(f), o = null;
    for (var i = 0; i < list.length; i++) if (list[i].id === oid) o = list[i];
    if (!o && stored) return L(stored);
    return L((o || list[0] || {}).name || f.role);
  }
  function survivedHours(g) { return Math.max(0, g.state.hours - WH.Rules.startHours(g.faction)); }
  function recordRun() {
    var g = UI.game, f = g.faction, node = g.node(), end = node.ending || {kind: "bad"};
    if (UI.lastRun && UI.lastRun.run.runId === g.state.runId && UI.lastRun.run.endingId === g.state.nodeId && (UI.lastRun.run.rewinds || 0) === (g.rewindCount || 0)) return UI.lastRun;
    var run = {
      runId: g.state.runId, at: new Date().toISOString(), faction: f.id,
      origin: g.state.origin, originName: (g.origin() || {}).name || f.role,
      facName: f.name, role: f.role, color: fcolor(f), startDate: f.startDate,
      endingId: g.state.nodeId, kind: end.kind, title: end.title || {zh: "终", en: "The End"},
      cause: causeOf(f, g.state.nodeId, node), survived: survivedHours(g), finalHours: g.state.hours,
      playMs: Math.round(g.state.playMs), visits: g.state.visits, gods: godsMet(),
      taint: JSON.parse(JSON.stringify(g.state.taint || WH.Rules.zeroTaint())),
      // SPEC §25: what achievements need from a finished run
      flags: Object.keys(g.state.flags || {}).filter(function (k) { return g.state.flags[k]; }),
      resists: WH.Rules.GODS.filter(function (gd) { return g.state.flags && g.state.flags["resisted_" + gd]; }).length,
      claims: JSON.parse(JSON.stringify(g.state.claims || {})), claimedBy: WH.Rules.claimGodOf(g.state.nodeId),
      chosen: /_end_claim_(khorne|nurgle|tzeentch|slaanesh)_chosen$/.test(g.state.nodeId),
      endStats: {hp: g.state.stats.hp, sanity: g.state.stats.sanity}, rumorsHeard: (g.state.seenRumors || []).length,
      rewinds: g.rewindCount || 0                                  // SPEC §30: clean-run achievements only count rewinds == 0
    };
    if (end.kind === "bad" || end.kind === "death") {      // SPEC §27: a later run may overhear this one
      var og = g.origin() || {};
      run.echo = {faction: f.id, role: og.name || f.role || f.name, world: og.world || f.world || (WH.sector && WH.sector.name) || f.name,
                  cause: run.cause, kind: end.kind, dateKey: WH.Rules.dateKey(g.state.hours, f.startDate),
                  date: WH.Rules.dateParts(g.state.hours, f.startDate), claimedBy: run.claimedBy || null};
    }
    UI.lastRun = WH.Save.addRun(run);
    if (UI.lastRun.added) bumpAchStat(function (st) { WH.Achievements.applyRun(st, run); });
    return UI.lastRun;
  }

  /* ======================= ACHIEVEMENTS (SPEC §25) ======================= */
  function achStats() {
    var st = WH.Save.achStats();
    if (st) return st;
    st = WH.Achievements.emptyStats();                     // first boot with §25: backfill from the stored run records
    WH.Save.runs().slice().reverse().forEach(function (r) { WH.Achievements.applyRun(st, r); });
    st.backfilled = new Date().toISOString();
    WH.Save.setAchStats(st);
    return st;
  }
  function bumpAchStat(fn) { var st = achStats(); fn(st); WH.Save.setAchStats(st); checkAchievements(); }
  function achState() {
    return {endingStats: WH.Save.endingStats(), codexGlobal: WH.Save.codexGlobal(), eggTiers: WH.Save.eggTiers(), stats: achStats(), data: WH};
  }
  UI.achState = achState;
  /* evaluate every achievement; newly true ones are stored and announced (one summary toast when many arrive at once) */
  function checkAchievements(quietMany) {
    if (!WH.achievements || !WH.achievements.length || !WH.Achievements) return [];
    var added = WH.Save.markAchievements(WH.Achievements.unlockedNow(achState()));
    if (!added.length) return added;
    var byId = {};
    WH.achievements.forEach(function (a) { byId[a.id] = a; });
    if (added.length > 3 && quietMany) toast("★ " + t("ach_many", {n: added.length}));
    else added.slice(0, 3).forEach(function (id) { toast("★ " + t("ach_unlocked", {x: L(byId[id].name)})); });
    if (added.length > 3 && !quietMany) toast("★ " + t("ach_many", {n: added.length}));
    sfx("codex");
    updateAchBadge();
    return added;
  }
  UI.checkAchievements = checkAchievements;
  function updateAchBadge() {
    var b = $("ach-count");
    if (!b) return;
    var got = WH.Save.achievements(), n = WH.achievements.filter(function (a) { return got[a.id]; }).length;
    b.textContent = n + "/" + WH.achievements.length;
  }
  function achIcon(key, color) {
    if (key && WH.ui[key] || /^icon_/.test(key || "")) return art("ui", key, "ach-ui");
    return art("sprite", key, "ach-sp", color);
  }
  var TIER_COLOR = {bronze: "#c08a52", silver: "#c9d1d9", gold: "#e3c47c"};
  function openAchievements(replace) {
    var got = WH.Save.achievements(), S = achState(), list = WH.achievements || [];
    var n = list.filter(function (a) { return got[a.id]; }).length;
    var order = {gold: 0, silver: 1, bronze: 2};
    var tiles = list.map(function (a, i) {
      var open = !!got[a.id], hid = a.hidden && !open, col = TIER_COLOR[a.tier] || TIER_COLOR.bronze;
      var pr = !open && !hid ? WH.Achievements.evaluate(a.cond, S) : null;
      return h("div", {class: "ach-tile tier-" + (a.tier || "bronze") + (open ? " open" : " locked") + (hid ? " hidden" : ""), "data-id": a.id, vars: {"--tc": col}},
        h("div", {class: "ach-ic"}, hid ? h("span", {class: "ach-q"}, "?") : achIcon(a.icon, col)),
        h("div", {class: "ach-body"},
          h("div", {class: "ach-name"}, hid ? "???" : L(a.name)),
          h("div", {class: "ach-desc"}, hid ? t("ach_hidden") : L(a.desc)),
          open ? h("div", {class: "ach-when"}, "✓ " + fmtSavedAt(got[a.id]))
               : pr && pr.t > 1 ? h("div", {class: "ach-prog"}, h("i", {style: "width:" + Math.round(100 * pr.n / pr.t) + "%"}), h("span", null, pr.n + "/" + pr.t)) : null));
    });
    var body = h("div", {class: "ach-grid"}, tiles);
    if (!list.length) body = h("p", {class: "empty-msg"}, t("ach_none"));
    openModal({title: t("ach_title"), sub: t("ach_progress", {n: n, t: list.length}), body: body, replace: replace === true, reopen: function () { openAchievements(true); }});
    void order;
  }
  UI.openAchievements = openAchievements;

  /* ======================= ENDING ======================= */
  /* opts.badge: show "type · race" chip (codex window); opts.isNew: NEW badge */
  function codexEntry(id, unlocked, withMore, opts) {
    opts = opts || {};
    var c = WH.codex[id];
    if (!c) return h("div", {class: "centry locked"}, h("div", {class: "pic"}), h("div", null, h("div", {class: "nm"}, "??? (" + id + ")")));
    var rc = entryColor(c, id);
    var pic = h("div", {class: "pic"}, art("sprite", c.sprite, "fit", rc));
    var badge = opts.badge ? h("span", {class: "rbadge", vars: {"--rc": rc, "--rc-ink": inkOn(rc)}}, badgeText(id)) : null;
    if (!unlocked) return h("div", {class: "centry locked", "data-id": id, vars: {"--rc": rc}}, pic,
      h("div", null, h("div", {class: "nm"}, t("codex_locked")), opts.badge ? h("div", {class: "bd"}, badge) : null, h("div", {class: "tx"}, "……")));
    var fac = !opts.badge && c.faction && WH.factions[c.faction] ? L(WH.factions[c.faction].name) : "";
    return h("div", {class: "centry" + (opts.isNew ? " is-new" : ""), "data-id": id, vars: {"--rc": rc}}, pic, h("div", {class: "cbody"},
      h("div", {class: "chead"}, h("span", {class: "nm"}, L(c.name)), fac ? h("span", {class: "fa"}, fac) : null,
        opts.isNew ? h("span", {class: "new-badge"}, t("cx_new")) : null),
      opts.badge ? h("div", {class: "bd"}, badge) : null,
      h("div", {class: "tx"}, L(c.text)),
      withMore && c.more ? h("div", {class: "tx more"}, L(c.more)) : null));
  }

  /* SPEC §17: first death (bad/death ending) on each faction → a Tip card about the faction stat; persisted per faction */
  function tipCard(f, end, g) {
    if (!f.renownHelp || end.kind === "good") return null;
    var key = g.state.runId + ":" + g.state.nodeId;
    if (UI.tipFor !== key) {
      if (WH.Save.tipSeen(f.id)) return null;
      WH.Save.markTipSeen(f.id);
      UI.tipFor = key;
    }
    return h("div", {class: "tip-card", role: "note"}, h("span", {class: "tip-k"}, t("tip")), renownHelpBody(f));
  }

  function showEnding() {
    var g = UI.game;
    if (!g || !g.state.ended) return;
    var node = g.node(), end = node.ending || {kind: "bad", title: {zh: "终", en: "The End"}}, f = g.faction;
    WH.Save.remove("auto");
    WH.Save.addCodexGlobal(g.state.codex);
    stopWhispers();
    var cs = codexStats();
    var rr = recordRun();
    var cgod = claimGod();
    var surv = survivedHours(g);
    var met = h("div", {class: "met"});
    [["leaders", "learn_leaders"], ["enemies", "learn_enemies"], ["boss", "learn_boss"]].forEach(function (grp) {
      var ids = (f.learn && f.learn[grp[0]]) || [];
      met.appendChild(h("div", null, h("h5", null, t(grp[1])),
        ids.map(function (id) { return codexEntry(id, g.state.codex.indexOf(id) >= 0); })));
    });
    var s = clear($("scr-ending"));
    s.style.setProperty("--accent", fcolor(f));
    s.appendChild(h("div", {class: "bg"}, art("scene", node.scene || "void")));
    s.appendChild(h("div", {class: "corner"}, soundButton(), langButton()));
    var again = h("button", {class: "btn primary px", type: "button", onclick: function () { startGame(f.id, g.state.origin); }}, "↻ " + t("again"));
    var back = UI.settings.rewind === true && g.canRewind() ?              // SPEC §30
      h("button", {class: "btn px rewind-end", type: "button", id: "rewind-end", "aria-keyshortcuts": "Z", title: t("rewind_end") + " (Z)", onclick: function () { rewindStep(); }}, "\u21B6 " + t("rewind_end")) : null;
    s.appendChild(h("div", {class: "ending-wrap"},
      h("div", {class: "ending-panel px", role: "region", "aria-label": L(end.title)},
        h("div", {class: "ending-head"},
          h("span", {class: "kind " + end.kind}, t("ending_" + end.kind)),
          h("h2", {class: "ending-title"}, L(end.title)),
          h("span", {class: "ending-fac"}, L(f.name) + " · " + originLabel(f, g.state.origin))),
        h("p", {class: "ending-text"}, L(node.text)),
        h("div", {class: "ending-fate " + end.kind},
          end.kind !== "good" ? h("div", {class: "fate"}, h("span", {class: "k"}, t("cause")), h("span", {class: "v cause"}, L(causeOf(f, g.state.nodeId, node)))) : null,
          h("div", {class: "fate"}, h("span", {class: "k"}, t("survived")), h("span", {class: "v"}, WH.fmtDur(surv))),
          rr && rr.newRecord ? h("span", {class: "new-record"}, "★ " + t("new_record")) : null,
          g.rewindCount > 0 ? h("span", {class: "run-rw", title: t("rewinds_title", {n: g.rewindCount})}, "\u21B6" + g.rewindCount) : null),
        h("div", {class: "ending-stats"},
          h("div", null, h("div", {class: "k"}, t("final_date")), h("div", {class: "v"}, WH.fmtDate(g.date()))),
          h("div", null, h("div", {class: "k"}, t("play_time")), h("div", {class: "v"}, WH.fmtPlay(g.state.playMs))),
          h("div", null, h("div", {class: "k"}, t("nodes_visited")), h("div", {class: "v"}, String(g.state.visits))),
          h("div", null, h("div", {class: "k"}, t("codex_completion")), h("div", {class: "v"}, cs.pct + "%  (" + cs.n + "/" + cs.t + ")"))),
        h("div", {class: "ending-scroll"},
          cgod ? claimBanner(cgod, Math.round((g.state.taint && g.state.taint[cgod]) || 0)) : null,
          tipCard(f, end, g),
          h("h3", {class: "met-title"}, t("you_met")),
          met,
          h("h3", {class: "met-title"}, t("gods_met_title")),
          h("div", {class: "gods"}, GODS.map(function (god) {
            var tv = Math.round((g.state.taint && g.state.taint[god]) || 0);
            var met_ = godsMet().indexOf(god) >= 0 || tv > 0 || god === cgod, c = godCodex(god);
            var pic = h("div", {class: "pic"}, art("sprite", "sigil_" + god, "fit", "#8a4fd0"));
            var bar = taintReveal(god, tv);
            if (!met_) return h("div", {class: "centry god-card locked god-" + god}, pic,
              h("div", {class: "cbody"}, h("div", {class: "nm"}, t("codex_locked")), h("div", {class: "tx"}, t("god_not_met")), bar));
            return h("div", {class: "centry god-card god-" + god + (god === cgod ? " claimed" : "")}, pic, h("div", {class: "cbody"},
              h("div", {class: "nm"}, godName(god)),
              bar,
              c ? h("div", {class: "tx"}, L(c.text)) : null,
              c && c.more ? h("div", {class: "tx more"}, L(c.more)) : null));
          }))),
        h("div", {class: "ending-btns"},
          again,
          back,
          h("button", {class: "btn px", type: "button", onclick: function () { show("select"); }}, t("other_faction")),
          h("button", {class: "btn px home-btn", type: "button", onclick: function () { show("title"); }}, "⌂ " + t("home"))))));
    var firstShow = UI.screen !== "ending";
    show("ending");
    if (firstShow) {
      mood(end.kind === "death" ? "death" : end.kind === "bad" ? "bad" : "happy");
      sfx(end.kind === "good" ? "ending_good" : "death");
    }
    again.focus({preventScroll: true});
  }
  UI.showEnding = showEnding;

  /* ======================= MODALS ======================= */
  function openModal(o) {
    var prev = document.activeElement;
    var closeBtn = h("button", {class: "btn small px", type: "button", "aria-label": t("close"), onclick: function () { closeTop(); }}, "✕");
    var modal = h("div", {class: "modal px" + (o.narrow ? " narrow" : ""), role: "dialog", "aria-modal": "true", "aria-label": o.title},
      h("div", {class: "modal-head"}, o.icon ? art("ui", o.icon) : null, h("h3", null, o.title), o.sub ? h("span", {class: "sub"}, o.sub) : null, closeBtn),
      h("div", {class: "modal-body"}, o.body),
      o.foot ? h("div", {class: "modal-foot"}, o.foot) : null);
    var back = h("div", {class: "modal-back"}, modal);
    back.addEventListener("mousedown", function (e) { if (e.target === back) closeTop(); });
    var rec = {el: back, onClose: o.onClose, prev: prev, reopen: o.reopen};
    if (o.replace && UI.modals.length) {
      var old = UI.modals[UI.modals.length - 1];
      old.el.remove();
      rec.prev = old.prev;
      UI.modals[UI.modals.length - 1] = rec;
    } else UI.modals.push(rec);
    $("overlay-root").appendChild(back);
    var f = modal.querySelector(o.focus || ".modal-body button:not(:disabled), .modal-foot button:not(:disabled)") || closeBtn;
    setTimeout(function () { f.focus({preventScroll: true}); }, 0);
    return rec;
  }
  function closeTop(silent) {
    var m = UI.modals.pop();
    if (!m) return;
    m.el.remove();
    if (m.onClose && !silent) m.onClose();
    if (m.prev && m.prev.focus && document.contains(m.prev)) m.prev.focus({preventScroll: true});
  }
  function trapFocus(e, box) {
    var top = box ? {el: box} : UI.modals[UI.modals.length - 1];
    if (!top) return;
    var f = top.el.querySelectorAll("button:not(:disabled), input, [tabindex='0']");
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    else if (!top.el.contains(document.activeElement)) { first.focus(); e.preventDefault(); }
  }

  function confirmBox(msg) {
    return new Promise(function (resolve) {
      var answered = false;
      var done = function (v) { if (answered) return; answered = true; closeTop(true); resolve(v); };
      openModal({title: "?", narrow: true, body: h("p", {class: "confirm-msg"}, msg),
        foot: [h("button", {class: "btn px", type: "button", onclick: function () { done(false); }}, "✕"),
               h("button", {class: "btn primary px", type: "button", onclick: function () { done(true); }}, "✓ OK")],
        focus: ".modal-foot .primary",
        onClose: function () { if (!answered) { answered = true; resolve(false); } }});
    });
  }
  UI.confirmBox = confirmBox;

  /* ---------- codex (taxonomy v2, SPEC §13) ---------- */
  function codexViews(view) {
    var bar = h("div", {class: "views", role: "tablist"});
    [["entries", "view_entries"], ["places", "view_places"], ["chronicle", "view_chronicle"], ["endings", "view_endings"], ["records", "view_records"]].forEach(function (v) {
      bar.appendChild(h("button", {class: "btn px", type: "button", role: "tab", "data-view": v[0], "aria-selected": String(v[0] === view),
        onclick: function () { openCodex(null, true, v[0]); }}, t(v[1])));
    });
    return bar;
  }

  /* "NEW" badge count on the codex buttons (title menu + game toolbar) */
  function newBadge() { return h("span", {class: "nbadge", "aria-hidden": "true"}); }
  function updateCodexBadge() {
    var n = WH.Save.codexUnseen().filter(function (id) { return WH.codex[id] && !isHidden(WH.codex[id]); }).length;
    Array.prototype.forEach.call(document.querySelectorAll(".nbadge"), function (b) {
      b.textContent = n > 99 ? "99+" : String(n);
      b.hidden = !n;
      if (b.parentNode) b.parentNode.setAttribute("data-new", String(n));
    });
  }
  UI.updateCodexBadge = updateCodexBadge;

  /* discovery order: position in the cross-run unlock list (then this run's list) */
  function discoveryIndex() {
    var idx = {}, n = 0;
    WH.Save.codexGlobal().forEach(function (id) { if (idx[id] === undefined) idx[id] = n++; });
    if (UI.game) UI.game.state.codex.forEach(function (id) { if (idx[id] === undefined) idx[id] = n++; });
    return idx;
  }
  function nameKey(id) {
    var c = WH.codex[id], n = L(c.name) || id;
    return WH.lang === "en" ? n.replace(/^the\s+/i, "") : n;
  }
  function azCompare(a, b) {
    try { return nameKey(a).localeCompare(nameKey(b), WH.lang === "zh" ? "zh-Hans-CN-u-co-pinyin" : "en", {sensitivity: "base"}); }
    catch (e) { return nameKey(a) < nameKey(b) ? -1 : 1; }
  }
  function matchesQuery(id, q) {
    var c = WH.codex[id], al = c.aliases || {};
    var names = [c.name && c.name.zh, c.name && c.name.en].concat(al.zh || [], al.en || []);
    return names.some(function (n) { return n && String(n).toLowerCase().indexOf(q) >= 0; });
  }

  /* race filter chips with counts + progress bar; ids = the pool the chips filter */
  function raceChips(ids, cur, onPick) {
    var un = unlockedSet(), bar = h("div", {class: "race-chips", role: "tablist", "aria-label": t("race_all")});
    var mk = function (r, list) {
      var n = list.filter(function (id) { return un[id]; }).length, tt = list.length, pct = tt ? Math.round(100 * n / tt) : 0;
      var col = r === "all" ? "#e3c47c" : raceColor(r);
      return h("button", {class: "rchip", type: "button", role: "tab", "data-race": r, "aria-selected": String(r === cur),
          "aria-label": t("race_" + r) + " " + n + "/" + tt + " (" + pct + "%)", title: pct + "%",
          vars: {"--rc": col, "--rc2": RACE_COLOR2[r] || col, "--rc-ink": inkOn(col)}, onclick: function () { onPick(r); }},
        h("span", {class: "rn"}, t("race_" + r)),
        h("span", {class: "rcount"}, n + "/" + tt),
        h("span", {class: "rpct"}, pct + "%"),
        h("i", {class: "rbar", "aria-hidden": "true"}, h("b", {style: "width:" + pct + "%"})));
    };
    bar.appendChild(mk("all", ids));
    RACES.forEach(function (r) {
      var l = ids.filter(function (id) { return raceOf(WH.codex[id], id) === r; });
      if (l.length) bar.appendChild(mk(r, l));
    });
    return bar;
  }

  function entriesView() {
    var o = UI.cx, un = unlockedSet(), isNew = UI.cxNew || {};
    var all = codexIds().filter(function (id) { return typeOf(WH.codex[id]) !== "place" && !isChronicle(WH.codex[id]); });
    if (o.race !== "all" && !all.some(function (id) { return raceOf(WH.codex[id], id) === o.race; })) o.race = "all";
    var byRace = o.race === "all" ? all : all.filter(function (id) { return raceOf(WH.codex[id], id) === o.race; });
    if (o.type !== "all" && !byRace.some(function (id) { return typeOf(WH.codex[id]) === o.type; })) o.type = "all";
    var body = h("div", {class: "entries-view"});
    body.appendChild(raceChips(all, o.race, function (r) { o.race = r; openCodex(null, true, "entries", {focus: ".race-chips [aria-selected='true']"}); }));
    var tabs = h("div", {class: "tabs type-tabs", role: "tablist"});
    ["all"].concat(TYPES).forEach(function (ty) {
      var l = ty === "all" ? byRace : byRace.filter(function (id) { return typeOf(WH.codex[id]) === ty; });
      if (ty !== "all" && !l.length) return;
      var n = l.filter(function (id) { return un[id]; }).length;
      tabs.appendChild(h("button", {class: "btn px", type: "button", role: "tab", "data-type": ty, "aria-selected": String(ty === o.type),
        onclick: function () { o.type = ty; openCodex(null, true, "entries", {focus: ".type-tabs [aria-selected='true']"}); }},
        t("type_" + ty), h("span", {class: "tc"}, n + "/" + l.length)));
    });
    var search = h("input", {type: "search", class: "cx-search", id: "cx-search", placeholder: t("cx_search"), "aria-label": t("cx_search"), autocomplete: "off"});
    search.value = o.q;
    var sort = h("div", {class: "seg cx-sort", role: "group", "aria-label": t("cx_sort")}, [["disc", "sort_disc"], ["az", "sort_az"], ["race", "sort_race"]].map(function (sv) {
      return h("button", {class: "btn small px", type: "button", "data-sort": sv[0], "aria-pressed": String(sv[0] === o.sort),
        onclick: function () { o.sort = sv[0]; openCodex(null, true, "entries", {focus: ".cx-sort [aria-pressed='true']"}); }}, t(sv[1]));
    }));
    body.appendChild(h("div", {class: "cx-bar"}, tabs, h("div", {class: "cx-tools"}, search, sort)));
    var list = h("div", {class: "cx-list", "aria-live": "polite"});
    body.appendChild(list);
    var fill = function () {
      clear(list);
      var q = o.q.trim().toLowerCase();
      var ids = byRace.filter(function (id) { return o.type === "all" || typeOf(WH.codex[id]) === o.type; });
      if (q) ids = ids.filter(function (id) { return un[id] && matchesQuery(id, q); });
      var di = discoveryIndex();
      var open = ids.filter(function (id) { return un[id]; }), locked = ids.filter(function (id) { return !un[id]; });
      if (o.sort === "az") open.sort(azCompare);
      else open.sort(function (a, b) { return (di[a] === undefined ? 1e9 : di[a]) - (di[b] === undefined ? 1e9 : di[b]); });
      locked.sort(function (a, b) { return TYPES.indexOf(typeOf(WH.codex[a])) - TYPES.indexOf(typeOf(WH.codex[b])) || (a < b ? -1 : 1); });
      var ordered = open.concat(locked);
      var tile = function (id) { return codexEntry(id, !!un[id], true, {badge: true, isNew: !!isNew[id]}); };
      if (!ordered.length) { list.appendChild(h("p", {class: "empty-msg"}, q ? t("cx_no_match") : "—")); return; }
      if (o.sort === "race") {
        RACES.forEach(function (r) {
          var l = ordered.filter(function (id) { return raceOf(WH.codex[id], id) === r; });
          if (!l.length) return;
          l = l.filter(function (id) { return un[id]; }).sort(azCompare).concat(l.filter(function (id) { return !un[id]; }));
          var n = l.filter(function (id) { return un[id]; }).length;
          list.appendChild(h("section", {class: "codex-sec race-sec", vars: {"--rc": raceColor(r)}},
            h("h4", null, t("race_" + r) + "  " + n + "/" + l.length), h("div", {class: "codex-grid"}, l.map(tile))));
        });
      } else list.appendChild(h("div", {class: "codex-grid"}, ordered.map(tile)));
    };
    search.addEventListener("input", function () { o.q = search.value; fill(); });
    fill();
    var n = all.filter(function (id) { return un[id]; }).length;
    return {body: body, sub: t("codex_progress", {n: n, t: all.length})};
  }

  function placesView(filter, detail) {
    var un = unlockedSet(), isNew = UI.cxNew || {}, body = h("div", {class: "places-view"});
    var ids = codexIds().filter(function (id) { return typeOf(WH.codex[id]) === "place" || WH.codex[id].cat === "place"; });
    var n = ids.filter(function (id) { return un[id]; }).length;
    if (detail && WH.codex[detail] && un[detail]) {
      var c = WH.codex[detail], rc = entryColor(c, detail);
      body.appendChild(h("button", {class: "btn small px", type: "button", onclick: function () { openCodex(null, true, "places"); }}, "◂ " + t("back")));
      body.appendChild(h("div", {class: "place-detail"},
        h("div", {class: "place-big"}, art("scene", c.scene || "void")),
        h("div", {class: "place-info"},
          h("div", {class: "lore-top"}, h("span", {class: "lore-cat", vars: {"--cat": rc, "--cat-ink": inkOn(rc)}}, badgeText(detail))),
          h("h3", {class: "lore-name"}, L(c.name)),
          h("p", {class: "lore-text"}, L(c.text)),
          c.more ? h("p", {class: "lore-more"}, L(c.more)) : null)));
      return {body: body, sub: t("unlocked_n", {n: n, t: ids.length})};
    }
    var o = UI.cx;
    if (o.placeRace !== "all" && !ids.some(function (id) { return raceOf(WH.codex[id], id) === o.placeRace; })) o.placeRace = "all";
    body.appendChild(raceChips(ids, o.placeRace, function (r) { o.placeRace = r; openCodex(null, true, "places", {focus: ".race-chips [aria-selected='true']"}); }));
    var list = ids.filter(function (id) { return o.placeRace === "all" || raceOf(WH.codex[id], id) === o.placeRace; });
    var di = discoveryIndex();
    list.sort(function (a, b) { return (un[b] ? 1 : 0) - (un[a] ? 1 : 0) || ((di[a] === undefined ? 1e9 : di[a]) - (di[b] === undefined ? 1e9 : di[b])); });
    body.appendChild(h("div", {class: "place-grid"}, list.map(function (id) {
      var c = WH.codex[id], open = !!un[id];
      return h("button", {class: "place-tile px" + (open ? "" : " locked") + (open && isNew[id] ? " is-new" : ""), type: "button", disabled: !open, "data-id": id,
        vars: {"--rc": entryColor(c, id)}, "aria-label": open ? L(c.name) : t("codex_locked"),
        onclick: function () { openCodex(null, true, "places", {detail: id}); }},
        h("div", {class: "thumb"}, art("scene", c.scene || "void"), open && isNew[id] ? h("span", {class: "new-badge"}, t("cx_new")) : null),
        h("div", {class: "pn"}, open ? L(c.name) : "???"));
    })));
    if (!ids.length) body.appendChild(h("p", {class: "empty-msg"}, "—"));
    return {body: body, sub: t("unlocked_n", {n: n, t: ids.length})};
  }

  /* ---------- 战史 / Chronicle (SPEC §20): vertical timeline by sortKey, millennium separators, dates always shown,
   * locked entries tease "???" at their date; race chips filter; progress 已知 n/t ---------- */
  function millLabel(m) {
    if (WH.lang === "zh") return t("chr_mill", {n: m});
    var suf = (m % 100 >= 11 && m % 100 <= 13) ? "th" : ({1: "st", 2: "nd", 3: "rd"}[m % 10] || "th");
    return t("chr_mill", {n: m}).replace(/^(\d+)th/, m + suf);
  }
  function chronicleIds() {
    return codexIds().filter(function (id) { return isChronicle(WH.codex[id]); })
      .sort(function (a, b) { return chrKey(WH.codex[a]) - chrKey(WH.codex[b]) || (a < b ? -1 : 1); });
  }
  function chronicleView() {
    var o = UI.cx, un = unlockedSet(), isNew = UI.cxNew || {}, body = h("div", {class: "chronicle-view"});
    var ids = chronicleIds(), n = ids.filter(function (id) { return un[id]; }).length;
    var sub = t("chr_known", {n: n, t: ids.length});
    if (!ids.length) { body.appendChild(h("p", {class: "empty-msg"}, t("chr_empty"))); return {body: body, sub: sub}; }
    if (!o.chrRace) o.chrRace = "all";
    if (o.chrRace !== "all" && !ids.some(function (id) { return raceOf(WH.codex[id], id) === o.chrRace; })) o.chrRace = "all";
    body.appendChild(raceChips(ids, o.chrRace, function (r) { o.chrRace = r; openCodex(null, true, "chronicle", {focus: ".race-chips [aria-selected='true']"}); }));
    body.appendChild(h("p", {class: "chr-hint"}, t("chr_hint")));
    var list = ids.filter(function (id) { return o.chrRace === "all" || raceOf(WH.codex[id], id) === o.chrRace; });
    var tl = h("ol", {class: "timeline", "aria-label": t("view_chronicle")}), lastM;
    list.forEach(function (id) {
      var c = WH.codex[id], m = chrMill(c), open = !!un[id], rc = entryColor(c, id);
      if (m !== lastM) {
        tl.appendChild(h("li", {class: "tl-mill" + (m === 0 ? " ancient" : ""), "data-mill": m === null ? "?" : m, "aria-hidden": "true"},
          h("span", {class: "tl-m px"}, m === null ? "M??" : m === 0 ? t("chr_ancient") : "M" + m),
          m === null ? null : h("span", {class: "tl-mn"}, m === 0 ? t("chr_ancient_sub") : millLabel(m))));
        lastM = m;
      }
      var date = h("div", {class: "tl-date"}, L(c.date) || "—");
      var card = open
        ? h("div", {class: "tl-card"},
            h("div", {class: "tl-head"}, h("span", {class: "tl-name"}, L(c.name)),
              isNew[id] ? h("span", {class: "new-badge"}, t("cx_new")) : null),
            h("div", {class: "bd"}, h("span", {class: "rbadge", vars: {"--rc": rc, "--rc-ink": inkOn(rc)}}, badgeText(id))),
            h("p", {class: "tl-text"}, L(c.text)),
            c.more ? h("p", {class: "tl-more"}, L(c.more)) : null)
        : h("div", {class: "tl-card"}, h("span", {class: "tl-name"}, t("codex_locked")), h("p", {class: "tl-tease"}, t("chr_tease")));
      tl.appendChild(h("li", {class: "tl-item" + (open ? "" : " locked") + (open && isNew[id] ? " is-new" : ""), "data-id": id, vars: {"--rc": rc},
        "aria-label": (L(c.date) || "") + " — " + (open ? L(c.name) : t("codex_locked"))},
        date, h("div", {class: "tl-dot", "aria-hidden": "true"}), card));
    });
    body.appendChild(tl);
    return {body: body, sub: sub};
  }

  var KIND_ORDER = {good: 0, bad: 1, death: 2};
  function endingsView() {
    var es = WH.Save.endingStats(), body = h("div", {class: "endings-view"}), tot = 0, got = 0;
    factionList().forEach(function (f) {
      var ids = Object.keys(f.nodes || {}).filter(function (id) { return f.nodes[id].ending; });
      ids.sort(function (a, b) { return (KIND_ORDER[f.nodes[a].ending.kind] || 0) - (KIND_ORDER[f.nodes[b].ending.kind] || 0); });
      var n = ids.filter(function (id) { return es[f.id + ":" + id]; }).length;
      tot += ids.length; got += n;
      body.appendChild(h("section", {class: "codex-sec", vars: {"--accent": fcolor(f)}},
        h("h4", null, L(f.name) + "  ·  " + t("unlocked_n", {n: n, t: ids.length})),
        h("div", {class: "end-grid"}, ids.map(function (id) {
          var node = f.nodes[id], k = node.ending.kind, st = es[f.id + ":" + id];
          if (!st) return h("div", {class: "end-tile locked"}, h("span", {class: "kind sm " + k}, t("ending_" + k)), h("div", {class: "et"}, "???"));
          return h("div", {class: "end-tile " + k},
            h("div", {class: "etop"}, h("span", {class: "kind sm " + k}, t("ending_" + k)), h("span", {class: "cnt"}, t("times", {n: st.count}))),
            h("div", {class: "et"}, L(node.ending.title)),
            k !== "good" ? h("div", {class: "ec"}, t("cause") + "：" + L(causeOf(f, id, node))) : null,
            h("div", {class: "ed"}, t("first_surv") + " " + WH.fmtDur(st.first) + (st.best !== st.first ? "  ·  " + t("best_surv") + " " + WH.fmtDur(st.best) : "")));
        }))));
    });
    if (!tot) body.appendChild(h("p", {class: "empty-msg"}, "—"));
    return {body: body, sub: t("unlocked_n", {n: got, t: tot})};
  }

  function recordsView(opt) {
    opt = opt || {};
    var runs = WH.Save.runs(), st = WH.Save.runStats(), body = h("div", {class: "records-view"});
    var common = null;
    Object.keys(st.causes || {}).forEach(function (k) { var c = st.causes[k]; if (!common || c.count > common.count) common = c; });
    body.appendChild(h("div", {class: "rec-sum"},
      h("div", null, h("div", {class: "k"}, t("runs_total")), h("div", {class: "v"}, String(st.runs || 0))),
      h("div", null, h("div", {class: "k"}, t("deaths")), h("div", {class: "v"}, String(st.deaths || 0))),
      h("div", null, h("div", {class: "k"}, t("longest")), h("div", {class: "v"}, st.runs ? WH.fmtDur(st.longest) : "—")),
      h("div", null, h("div", {class: "k"}, t("common_cause")), h("div", {class: "v"}, common ? L(common.label) + " " + t("times", {n: common.count}) : "—"))));
    if (!runs.length) body.appendChild(h("p", {class: "empty-msg"}, t("no_runs")));
    runs.forEach(function (r) {
      var f = WH.factions[r.faction], color = (f && fcolor(f)) || r.color || FACTION_COLOR[r.faction] || "#c9a227";
      var gods = (r.gods || []).length ? h("span", {class: "run-gods"}, r.gods.map(function (gd) {
        var el = art("sprite", "sigil_" + gd, "sig", "#8a4fd0"); if (el && el.setAttribute) el.setAttribute("title", godName(gd)); return el; })) : "—";
      var cell = function (k, v) { return h("div", null, h("div", {class: "k"}, k), h("div", {class: "v"}, v)); };
      body.appendChild(h("div", {class: "run-row" + (opt.run && r.runId === opt.run ? " hl" : ""), "data-run": r.runId, vars: {"--accent": color}},
        h("div", {class: "run-top"},
          h("span", {class: "kind sm " + r.kind}, t("ending_" + r.kind)),
          h("b", {class: "run-title"}, L(r.title)),
          h("span", {class: "run-fac"}, L((f && f.name) || r.facName) + " · " + (f ? originLabel(f, r.origin, r.originName) : L(r.originName || r.role))),
          r.rewinds > 0 ? h("span", {class: "run-rw", title: t("rewinds_title", {n: r.rewinds}), "aria-label": t("rewinds_title", {n: r.rewinds})}, "\u21B6" + r.rewinds) : null,
          h("span", {class: "run-at"}, fmtSavedAt(r.at))),
        h("div", {class: "run-grid"},
          cell(t("cause"), r.kind === "good" ? t("ending_good") : L(r.cause)),
          cell(t("survived"), [WH.fmtDur(r.survived), h("div", {class: "sub"}, t("final_short") + " " + WH.fmtDate(WH.Rules.dateParts(r.finalHours, r.startDate || (f && f.startDate))))]),
          cell(t("play_time"), WH.fmtPlay(r.playMs)),
          cell(t("nodes_visited"), String(r.visits)),
          cell(t("gods_short"), gods))));
    });
    var foot = runs.length || st.runs ? [h("button", {class: "btn small danger px", type: "button", onclick: function () {
      confirmBox(t("clear_confirm")).then(function (ok) { if (ok) { WH.Save.clearRuns(); openCodex(null, true, "records"); } });
    }}, t("clear_records"))] : null;
    return {body: body, sub: runs.length ? t("last_n", {n: runs.length}) : "", foot: foot};
  }

  /* openCodex(_, replace, view, opt): view = entries | places | chronicle | endings | records; opt = {detail, focus}.
   * A fresh open (replace falsy) snapshots the NEW set (unlocked since the codex was last opened) and marks everything seen. */
  function openCodex(_tab, replace, view, opt) {
    view = view || "entries";
    opt = opt || {};
    if (!replace) {
      UI.cxNew = {};
      WH.Save.codexUnseen().forEach(function (id) { UI.cxNew[id] = 1; });
      WH.Save.markCodexSeen(Object.keys(unlockedSet()));
      if (UI.game) WH.Save.addCodexGlobal(UI.game.state.codex);
      updateCodexBadge();
    }
    var pr = !replace && egg() ? eggProgress() : null, lastLine = null;
    if (pr && eggFresh("last", pr)) { eggFire("last"); lastLine = h("span", {class: "egg-last"}, L(eggTier("last").text)); }
    var v = view === "endings" ? endingsView() : view === "places" ? placesView(null, opt.detail) : view === "records" ? recordsView(opt)
          : view === "chronicle" ? chronicleView() : entriesView();
    openModal({title: view === "records" ? t("records_title") : t("codex_title"), icon: "icon_codex", sub: lastLine || v.sub, replace: replace,
      body: h("div", {class: "codex-body view-" + view}, codexViews(view), v.body), foot: v.foot,
      focus: opt.focus || (opt.detail ? ".place-detail, .modal-body button" : ".views [aria-selected='true']"),
      reopen: function () { openCodex(null, true, view, {detail: opt.detail, run: opt.run}); }});
    if (opt.run) setTimeout(function () { var r = document.querySelector('.modal .run-row.hl'); if (r && r.scrollIntoView) r.scrollIntoView({block: "center"}); }, 0);
    startJoke();
    if (pr && eggFresh("planned", pr)) { eggFire("planned"); setTimeout(eggPlanned, 250); }
  }
  UI.openCodex = openCodex;
  UI.recordRun = recordRun;

  /* ---------- save / load ---------- */
  function fmtSavedAt(iso) {
    try {
      return new Date(iso).toLocaleString(WH.lang === "zh" ? "zh-CN" : "en-GB",
        {year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"});
    } catch (e) { return iso || ""; }
  }
  function slotLabel(s) { return s === "auto" ? t("autosave") : t("slot", {n: s.slice(4)}); }

  function slotCard(entry, mode) {
    var rec = entry.rec, s = entry.slot;
    var canClick = mode === "save" ? (s !== "auto" && UI.game && !UI.game.state.ended) : !!rec;
    var kids = [h("div", {class: "sh"}, h("span", null, slotLabel(s)), rec ? h("span", null, fmtSavedAt(rec.savedAt)) : null)];
    if (rec) {
      var f = WH.factions[rec.faction], ct = f.chapters && f.chapters[rec.chapter];
      kids.push(h("div", {class: "fac", style: "color:" + fcolor(f)}, L(f.name) + " · " + originLabel(f, rec.origin)));
      kids.push(h("div", {class: "ln"}, t("chapter_n", {n: WH.chapterNum(rec.chapter || 1)}) + (ct ? " · " + L(ct) : "")));
      kids.push(h("div", {class: "ln dim"}, WH.fmtDate(WH.Rules.dateParts(rec.hours, f.startDate)) + "   ⏱ " + WH.fmtPlay(rec.playMs)));
    } else kids.push(h("div", {class: "emp"}, entry.raw ? "⚠ " + t("err_schema") : t("empty")));
    var card = h("button", {class: "slot px", type: "button", disabled: !canClick,
      "aria-label": slotLabel(s) + (rec ? "" : " — " + t("empty")),
      onclick: function () { onSlot(s, rec, mode); }}, kids);
    var wrap = h("div", {class: "slot-wrap"}, card);
    if (entry.raw) wrap.appendChild(h("button", {class: "btn small danger px del", type: "button", "aria-label": t("del") + " " + slotLabel(s),
      onclick: function () { confirmBox(t("del") + " — " + slotLabel(s) + "?").then(function (ok) { if (ok) { WH.Save.remove(s); toast(t("deleted")); openSaves(mode, true); } }); }}, t("del")));
    return wrap;
  }

  function onSlot(s, rec, mode) {
    if (mode === "save") {
      var write = function () {
        WH.Save.write(s, UI.game.toRecord({lang: WH.lang}));
        sfx("save");
        toast(t("saved", {x: slotLabel(s)}));
        openSaves(mode, true);
      };
      if (rec) confirmBox(t("confirm_overwrite")).then(function (ok) { if (ok) write(); });
      else write();
    } else if (rec) {
      while (UI.modals.length) closeTop(true);
      loadRecord(rec);
      toast(t("loaded", {x: slotLabel(s)}));
    }
  }

  function openSaves(mode, replace) {
    var list = WH.Save.list();
    var input = h("input", {type: "file", accept: ".json,application/json", hidden: true, id: "import-file"});
    input.addEventListener("change", function () {
      var file = input.files && input.files[0];
      WH.Save.importFile(file, function (r) {
        if (!r.ok) { toast(t("import_bad", {x: t(r.error, {x: r.arg})})); return; }
        while (UI.modals.length) closeTop(true);
        loadRecord(r.rec);
        toast(t("import_ok"));
      });
    });
    var canExport = UI.game && !UI.game.state.ended;
    var foot = [
      !WH.Save.isPersistent() ? h("span", {class: "note"}, t("storage_off")) : null,
      h("button", {class: "btn px", type: "button", disabled: !canExport, title: canExport ? "" : t("export_none"),
        onclick: function () { WH.Save.exportRecord(UI.game.toRecord({lang: WH.lang})); }}, "⇩ " + t("export_json")),
      h("button", {class: "btn px", type: "button", onclick: function () { input.click(); }}, "⇧ " + t("import_json")),
      input];
    openModal({title: mode === "save" ? t("save_title") : t("load_title"), icon: "icon_save", replace: replace,
      body: h("div", {class: "slots"}, list.map(function (e) { return slotCard(e, mode); })), foot: foot,
      reopen: function () { openSaves(mode, true); }});
  }
  UI.openSaves = openSaves;

  function loadRecord(rec) {
    var g;
    try { g = WH.Game.fromRecord(rec, gameOpts()); }
    catch (e) { toast(t("import_bad", {x: e.message})); return false; }
    UI.game = g;
    enterGameScreen();
    if (g.state.ended) { showEnding(); return true; }
    renderNode({instant: true});
    renderHud();
    applyStateFx();
    if (g.state.pendingEvent) openEvent(g.currentEvent());
    return true;
  }
  UI.loadRecord = loadRecord;

  /* ---------- settings ---------- */
  function seg(options, current, onPick) {
    return h("div", {class: "seg", role: "group"}, options.map(function (o) {
      return h("button", {class: "btn small px", type: "button", "aria-pressed": String(o[0] === current), onclick: function () { onPick(o[0]); }}, o[1]);
    }));
  }
  function slider(id, key, fn) {
    var st = UI.settings, v = st[key] === undefined ? 70 : st[key];
    var out = h("span", {class: "vol-val"}, v + "%");
    var inp = h("input", {type: "range", id: id, min: 0, max: 100, step: 5, value: v, class: "vol"});
    inp.addEventListener("input", function () {
      st[key] = +inp.value; out.textContent = inp.value + "%";
      au(fn, st[key] / 100);
    });
    inp.addEventListener("change", function () { WH.Save.saveSettings(st); if (key === "sfxVol") sfx("click"); });
    return h("span", {class: "vol-wrap"}, inp, out);
  }
  /* SPEC §29: "配乐风格" selector — radio cards with a ▶ preview each; applies immediately, kept in settings.musicStyle */
  function styleRow() {
    var st = UI.settings, list = styleList(), cur = currentStyle(), prev = canPreviewStyle(), playing = null, timer = null;
    var cards = list.map(function (sty) {
      var pick = h("button", {class: "style-pick", type: "button", role: "radio", "aria-checked": String(sty.id === cur), "data-style": sty.id,
        tabindex: sty.id === cur ? 0 : -1},
        h("span", {class: "sn"}, L(sty.name)), sty.desc ? h("span", {class: "sd"}, L(sty.desc)) : null);
      var pv = prev ? h("button", {class: "btn small px style-prev", type: "button", "data-style": sty.id, "aria-pressed": "false",
        "aria-label": t("style_preview_aria", {x: L(sty.name)}), title: t("style_preview_aria", {x: L(sty.name)})}, "\u25B6 " + t("style_preview")) : null;
      var card = h("div", {class: "style-card" + (sty.id === cur ? " on" : ""), "data-style": sty.id}, pick, pv);
      return {card: card, pick: pick, pv: pv, id: sty.id};
    });
    var choose = function (id, focus) {
      st.musicStyle = id; WH.Save.saveSettings(st);
      au("setStyle", id);
      cards.forEach(function (c) {
        var on = c.id === id;
        c.card.classList.toggle("on", on); c.pick.setAttribute("aria-checked", String(on)); c.pick.tabIndex = on ? 0 : -1;
        if (on && focus) c.pick.focus();
      });
    };
    var stopMark = function () {
      if (timer) { clearTimeout(timer); timer = null; }
      cards.forEach(function (c) { if (c.pv) { c.pv.setAttribute("aria-pressed", "false"); c.pv.classList.remove("playing"); } });
      playing = null;
    };
    cards.forEach(function (c, i) {
      c.pick.addEventListener("click", function () { choose(c.id, false); });
      c.pick.addEventListener("keydown", function (e) {
        var d = (e.key === "ArrowDown" || e.key === "ArrowRight") ? 1 : (e.key === "ArrowUp" || e.key === "ArrowLeft") ? -1 : 0;
        if (!d) return;
        e.preventDefault(); e.stopPropagation();
        choose(cards[(i + d + cards.length) % cards.length].id, true);
      });
      if (c.pv) c.pv.addEventListener("click", function () {
        stopMark();
        au("previewStyle", c.id);
        playing = c.id; c.pv.setAttribute("aria-pressed", "true"); c.pv.classList.add("playing");
        timer = setTimeout(stopMark, 8500);                           // the preview stops itself after ~8 s
      });
    });
    return h("div", {class: "setrow style-row"},
      h("span", {class: "k", id: "style-label"}, t("music_style")),
      h("div", {class: "style-list", role: "radiogroup", "aria-labelledby": "style-label"}, cards.map(function (c) { return c.card; })));
  }
  function openSettings(replace) {
    var st = UI.settings;
    var save = function () { WH.Save.saveSettings(st); };
    var body = h("div", null,
      h("div", {class: "setrow"}, h("span", {class: "k"}, t("text_speed")),
        seg([["slow", t("speed_slow")], ["normal", t("speed_normal")], ["fast", t("speed_fast")], ["instant", t("speed_instant")]], st.textSpeed,
          function (v) { st.textSpeed = v; save(); openSettings(true); })),
      h("div", {class: "setrow"}, h("span", {class: "k"}, t("effects")),
        seg([[true, t("on")], [false, t("off")]], !!st.effects, function (v) {
          st.effects = v; save(); applyFxSetting(); if (UI.game && UI.screen === "game") applyStateFx(); openSettings(true);
        })),
      h("div", {class: "setrow"}, h("label", {for: "vol-music"}, t("music_vol")), slider("vol-music", "musicVol", "setMusicVolume")),
      h("div", {class: "setrow"}, h("label", {for: "vol-sfx"}, t("sfx_vol")), slider("vol-sfx", "sfxVol", "setSfxVolume")),
      h("div", {class: "setrow"}, h("span", {class: "k"}, t("sound")),
        seg([[false, "🔊 " + t("on")], [true, "🔇 " + t("mute")]], !!st.muted, function (v) { if (!!st.muted !== v) toggleMute(); else openSettings(true); })),
      h("div", {class: "setrow"}, h("span", {class: "k"}, t("consequences")),
        seg([[true, t("on")], [false, t("off")]], st.consequences !== false, function (v) { st.consequences = v; save(); openSettings(true); })),
      h("div", {class: "setrow"}, h("span", {class: "k"}, t("echoes")),
        seg([[true, t("on")], [false, t("off")]], st.echoes !== false, function (v) {
          st.echoes = v; save();
          if (UI.game) { UI.game.echoes = v; if (UI.screen === "game" && !UI.conseq) renderRumor(UI.game.currentRumor(), !UI.typer.active); }
          openSettings(true);
        })),
      h("div", {class: "setrow"}, h("span", {class: "k"}, t("rumors")),
        seg([[true, t("on")], [false, t("off")]], st.rumors !== false, function (v) {
          st.rumors = v; save();
          if (UI.game) { UI.game.rumors = v; if (UI.screen === "game" && !UI.conseq) renderRumor(v ? UI.game.currentRumor() : null, !UI.typer.active); }
          openSettings(true);
        })),
      h("div", {class: "setrow rewind-row"}, h("span", {class: "k"}, t("rewind_set")),
        seg([[true, t("on")], [false, t("off")]], st.rewind === true, function (v) {
          st.rewind = v; save();
          if (UI.game) UI.game.setRewind(v);                          // off: the snapshot stack is dropped (zero overhead)
          buildTools(); updateRewindBtn();
          openSettings(true);
        }), h("p", {class: "set-hint"}, t("rewind_hint"))),
      styleRow(),
      eggDone("planned") ? h("div", {class: "setrow tz-row"}, h("span", {class: "k"}, t("tz_joke")),
        seg([[true, t("on")], [false, t("off")]], st.tzeentchJoke !== false, function (v) { st.tzeentchJoke = v; save(); openSettings(true); })) : null,
      h("div", {class: "setrow"}, h("span", {class: "k"}, t("lore_cards")),
        seg([["new", t("lore_new_only")], ["all", t("lore_all")], ["codex", t("lore_codex_only")]],
          st.loreCards === "all" || st.loreCards === "codex" ? st.loreCards : "new", function (v) { st.loreCards = v; save(); openSettings(true); })),
      h("div", {class: "setrow"}, h("span", {class: "k"}, t("known_hint")),
        seg([["toast", t("hint_toast")], ["silent", t("hint_silent")]], st.knownHint === "silent" ? "silent" : "toast",
          function (v) { st.knownHint = v; save(); openSettings(true); })),
      h("div", {class: "setrow"}, h("span", {class: "k"}, t("data")),
        h("button", {class: "btn small px", type: "button", id: "data-btn", onclick: function () { openData(); }}, "⇅ " + t("data_manage"))),
      h("div", {class: "setrow"}, h("span", {class: "k"}, t("language")),
        seg([["zh", "中文"], ["en", "English"]], WH.lang, function (v) { setLang(v); })),
      UI.reduced ? h("p", {style: "font-size:12px;color:var(--ink-dim)"}, t("reduced_motion")) : null);
    openModal({title: t("settings_title"), narrow: true, body: body, replace: replace === true,
      focus: ".modal-body [aria-pressed='true']", reopen: function () { openSettings(true); }});
  }
  UI.openSettings = openSettings;

  /* ---------- SPEC §22: full backup (export / merge import; clipboard + paste box where downloads are blocked) ---------- */
  function framed() { try { return window.top !== window.self; } catch (e) { return true; } }
  function importSummary(sum) {
    return t("import_all_ok", {r: sum.runs, c: sum.codex, e: sum.endings, s: sum.slots.length}) + (sum.skipped.length ? t("import_skipped", {n: sum.skipped.length}) : "");
  }
  function doImportAll(text) {
    var r = WH.Save.parseBackup(text);
    if (!r.ok) { toast(t("import_bad", {x: t(r.error)})); return Promise.resolve(null); }
    var conf = WH.Save.backupConflicts(r.backup);
    var ask = conf.length ? confirmBox(t("import_overwrite", {n: conf.length})) : Promise.resolve(false);
    return ask.then(function (ow) {
      var sum = WH.Save.importAll(r.backup, {overwrite: !!ow});
      UI.lastImport = sum;
      toast(importSummary(sum));
      updateCodexBadge();
      if (UI.screen === "title") renderTitle();
      openData(true);
      return sum;
    });
  }
  UI.importAllText = doImportAll;
  function openData(replace) {
    var area = h("textarea", {class: "data-paste", id: "data-paste", rows: 4, placeholder: t("paste_box"), spellcheck: "false"});
    var out = h("textarea", {class: "data-paste", id: "data-out", rows: 3, readonly: true, hidden: true});
    var file = h("input", {type: "file", accept: "application/json,.json", hidden: true});
    file.addEventListener("change", function () {
      var f = file.files && file.files[0];
      if (!f) return;
      var fr = new FileReader();
      fr.onload = function () { doImportAll(String(fr.result)); };
      fr.onerror = function () { toast(t("import_bad", {x: t("err_json")})); };
      fr.readAsText(f);
      file.value = "";
    });
    var copy = function () {
      var txt = JSON.stringify(WH.Save.exportAll());
      out.value = txt; out.hidden = false;
      var fallback = function () { out.focus(); out.select(); toast(t("copy_fail")); };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { toast(t("copied")); }, fallback);
        else { out.select(); if (document.execCommand && document.execCommand("copy")) toast(t("copied")); else fallback(); }
      } catch (e) { fallback(); }
    };
    var body = h("div", {class: "data-view"},
      h("p", {class: "data-intro"}, t("data_intro")),
      framed() ? h("p", {class: "data-note"}, t("data_frame")) : null,
      h("div", {class: "data-row"},
        h("button", {class: "btn px", type: "button", id: "data-export", onclick: function () { WH.Save.downloadAll(); }}, "⇩ " + t("export_all")),
        h("button", {class: "btn px", type: "button", id: "data-copy", onclick: copy}, "⧉ " + t("copy_clip"))),
      out,
      h("div", {class: "data-row"},
        h("button", {class: "btn px", type: "button", id: "data-import-file", onclick: function () { file.click(); }}, "⇧ " + t("import_file")), file),
      area,
      h("div", {class: "data-row"},
        h("button", {class: "btn px", type: "button", id: "data-import-paste", onclick: function () { if (area.value.trim()) doImportAll(area.value); }}, "⇧ " + t("import_paste"))),
      h("p", {class: "data-count"}, t("data_keys", {n: WH.Save.keys().length})));
    openModal({title: t("data_title"), narrow: true, body: body, replace: replace === true, reopen: function () { openData(true); }});
  }
  UI.openData = openData;

  /* ---------- language ---------- */
  function setLang(l) {
    if (l !== "zh" && l !== "en") return;
    WH.lang = l;
    UI.settings.lang = l;
    WH.Save.saveSettings(UI.settings);
    document.documentElement.lang = l === "zh" ? "zh-CN" : "en";
    renderFooter();
    buildTools();
    if (UI.screen === "title") renderTitle();
    else if (UI.screen === "select") renderSelect();
    else if (UI.screen === "ending") showEnding();
    else if (UI.screen === "game" && UI.game) {
      buildStats();
      renderHud();
      if (UI.conseq) { renderNode({instant: true, nodeId: UI.conseq.prevId}); renderConseq(true); }
      else if (!UI.busy) renderNode({instant: true});
      if (UI.event) {
        var ev = UI.event.e, g = UI.game;
        openEvent(ev);
        if (g.state.eventChoice === null) { UI.evTyper.finish(); }
      }
    }
    if (UI.lore) showLore(UI.lore.ids, UI.lore.i, UI.lore.auto);
    var top = UI.modals[UI.modals.length - 1];
    if (top && top.reopen) top.reopen();
  }
  function toggleLang() { setLang(WH.lang === "zh" ? "en" : "zh"); }
  UI.setLang = setLang;

  /* ---------- keyboard ---------- */
  function onKey(e) {
    var k = e.key, tag = (e.target && e.target.tagName) || "";
    var onButton = tag === "BUTTON" || tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA";
    if (k === "Tab" && UI.modals.length) { trapFocus(e); return; }
    if (UI.cardDone) {
      if (k === " " || k === "Enter" || k === "Escape") { e.preventDefault(); UI.cardDone(); }
      return;
    }
    var ep = $("egg-planned");
    if (ep) {                                              // SPEC §21 full-screen scene: Enter/Space/Esc advance
      if (k === " " || k === "Enter" || k === "Escape") {
        e.preventDefault();
        if (UI.eggTyper && UI.eggTyper.active) UI.eggTyper.finish(); else { var gb = ep.querySelector(".egg-full-btns button"); if (gb && !gb.hidden) gb.click(); }
      }
      return;
    }
    if (UI.lore && !UI.modals.length) {
      var lo = $("lore-overlay");
      if (k === "Escape") { e.preventDefault(); closeLore(); }
      else if ((k === " " || k === "Enter") && !onButton) { e.preventDefault(); loreNext(); }
      else if (k === "Tab" && lo) trapFocus(e, lo);
      else if (/^[1-4]$/.test(k)) e.preventDefault();
      return;
    }
    if (k === "Escape") {
      if (UI.modals.length) { e.preventDefault(); closeTop(); }
      else if (UI.screen === "select" && UI.sel.faction) { e.preventDefault(); UI.sel.faction = null; renderSelect(); }
      return;
    }
    if (UI.modals.length || e.ctrlKey || e.metaKey || e.altKey) return;
    if ((k === "h" || k === "H") && UI.screen === "game" && UI.game && !/^(INPUT|TEXTAREA|SELECT)$/.test(tag) && !(e.target && e.target.isContentEditable)) {
      e.preventDefault(); goHome(); return;
    }
    if ((k === "z" || k === "Z") && UI.settings.rewind === true && UI.game && (UI.screen === "game" || UI.screen === "ending")
        && !/^(INPUT|TEXTAREA|SELECT)$/.test(tag) && !(e.target && e.target.isContentEditable)) {
      e.preventDefault(); rewindStep(); return;                        // SPEC §30
    }
    if (UI.eventOpen && UI.event) {
      var ecq = UI.event.cq;
      if (/^[1-3]$/.test(k)) { var b = ecq ? null : UI.event.chEl.querySelectorAll("button")[+k - 1]; e.preventDefault(); if (b) b.click(); }
      else if ((k === " " || k === "Enter") && UI.evTyper.active) { e.preventDefault(); UI.evTyper.finish(); }
      else if ((k === " " || k === "Enter") && ecq && !onButton) { e.preventDefault(); eventContinue(); }
      return;
    }
    if (UI.screen !== "game" || !UI.game) return;
    if (UI.conseq) {
      if (/^[1-4]$/.test(k)) e.preventDefault();
      else if ((k === " " || k === "Enter") && !onButton) { e.preventDefault(); consequenceContinue(); }
      return;
    }
    if (/^[1-4]$/.test(k)) { e.preventDefault(); if (UI.typer.active) UI.typer.finish(); else choose(+k - 1); return; }
    if ((k === " " || k === "Enter") && !onButton) {
      e.preventDefault();
      if (UI.typer.active) UI.typer.finish();
      else if (UI.game.state.ended) showEnding();
    }
  }
})();
