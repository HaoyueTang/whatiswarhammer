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
  }
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
               icon_clock: "◷", icon_codex: "▤", icon_save: "▣", icon_lang: "文"};
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
    loreQueue: [], lore: null,
    accent: null, debug: /[?&]debug=1(&|$)/.test(location.search)
  };

  UI.init = function () {
    UI.settings = WH.Save.loadSettings();
    WH.lang = UI.settings.lang;
    document.documentElement.lang = WH.lang === "zh" ? "zh-CN" : "en";
    try { UI.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { UI.reduced = false; }
    var m = /[?&]seed=(\d+)/.exec(location.search);
    if (m) UI.seed = parseInt(m[1], 10);
    applyFxSetting();
    UI.typer = new Typer($("dlg-text"), $("dlg-live"));
    UI.typer.linkify = true;
    document.addEventListener("click", function (e) {
      var k = e.target.closest && e.target.closest(".kw");
      if (k) { e.stopPropagation(); sfx("click"); showLore([k.getAttribute("data-id")], 0, false); }
    });
    $("dialogue").addEventListener("click", function (e) {
      if (e.target.closest("button")) return;
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
    if (name === "select") renderSelect();
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
    var all = Object.keys(WH.codex), g = WH.Save.codexGlobal();
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
        h("button", {class: "btn px", type: "button", onclick: function () { openCodex(); }}, art("ui", "icon_codex"), t("codex")),
        h("button", {class: "btn px", type: "button", onclick: openSettings}, t("settings"))),
      h("div", {class: "title-meta"},
        h("span", null, t("codex_global", {n: cs.n, t: cs.t})),
        h("span", {class: "meter", role: "progressbar", "aria-valuenow": cs.pct, "aria-valuemin": 0, "aria-valuemax": 100},
          h("i", {style: "width:" + cs.pct + "%"})),
        h("span", null, cs.pct + "%"))));
    s.appendChild(h("div", {class: "version"}, "v" + WH.VERSION + (WH.SAMPLE ? " · sample" : "")));
    if (errs.length) s.appendChild(h("div", {class: "notice", role: "status"}, t("load_errors") + " " +
      errs.map(function (e) { return e.file + (e.msg && e.msg !== "missing" ? " (" + e.msg + ")" : ""); }).join(", ")));
    setTimeout(function () { if (UI.screen === "title" && !UI.modals.length) newBtn.focus({preventScroll: true}); }, 0);
  }

  /* ======================= FACTION SELECT ======================= */
  function factionList() {
    var order = ["imperium", "chaos", "tau"];
    return Object.keys(WH.factions).sort(function (a, b) {
      var ia = order.indexOf(a), ib = order.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    }).map(function (id) { return WH.factions[id]; });
  }

  function statChip(icon, v, title) { return h("span", {title: title}, art("ui", icon), String(v)); }

  function renderSelect() {
    var s = clear($("scr-select"));
    s.appendChild(h("div", {class: "bg"}, art("scene", "title")));
    s.appendChild(h("div", {class: "corner corner-left"},
      h("button", {class: "btn small px", type: "button", onclick: function () { show("title"); }}, "◂ " + t("back"))));
    s.appendChild(h("div", {class: "corner"}, langButton()));
    var cards = h("div", {class: "cards", role: "list"});
    var list = factionList();
    list.forEach(function (f) {
      var ss = f.startStats || {};
      cards.appendChild(h("button", {class: "fcard px", type: "button", role: "listitem", vars: {"--accent": f.color || "#c9a227"},
          "aria-label": L(f.name) + " — " + L(f.role) + ". " + L(f.tagline), "data-sfx": "select", onclick: function () { startGame(f.id); }},
        h("div", {class: "portrait"}, art("sprite", f.playerSprite, null, f.color)),
        h("div", {class: "fname"}, L(f.name)),
        h("div", {class: "frole"}, L(f.role)),
        h("div", {class: "ftag"}, "“" + L(f.tagline) + "”"),
        h("div", {class: "fstats", title: t("start_stats")},
          statChip("icon_hp", ss.hp !== undefined ? ss.hp : 100, t("hp")),
          statChip("icon_sanity", ss.sanity !== undefined ? ss.sanity : 100, t("sanity")),
          statChip("icon_corruption", ss.corruption || 0, t("corruption")),
          statChip(f.renownIcon, ss.renown || 0, L(f.renownLabel))),
        h("div", {class: "go"}, "▶ " + t("start"))));
    });
    if (!list.length) cards.appendChild(h("div", {class: "empty-msg"}, h("p", null, t("no_factions")), h("p", null, h("small", null, t("no_factions_hint")))));
    s.appendChild(h("div", {class: "select-wrap"}, h("h2", null, t("choose_faction")), cards));
    var first = cards.querySelector("button");
    if (first) setTimeout(function () { first.focus({preventScroll: true}); }, 0);
  }

  /* ======================= GAME ======================= */
  function newRng() { return WH.RNG(UI.seed !== null ? UI.seed : undefined); }

  function startGame(fid) {
    var g;
    try { g = new WH.Game(fid, {rng: newRng()}); var step = g.start(); }
    catch (e) { toast(t("missing_node", {x: e.message})); console.error(e); return; }
    UI.game = g;
    enterGameScreen();
    playStep(step);
  }
  UI.startGame = startGame;

  function enterGameScreen() {
    var f = UI.game.faction;
    UI.accent = f.color || "#c9a227";
    $("stage").style.setProperty("--accent", UI.accent);
    UI.sceneKey = null; UI.actorKeys = {left: null, right: null};
    clear($("scene-img")); clear($("actor-left")); clear($("actor-right"));
    $("scr-game").classList.remove("insane", "corrupt", "glitching");
    closeEventOverlay();
    closeLore();
    UI.loreQueue = [];
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
    tools.appendChild(b("icon_codex", t("codex"), function () { openCodex(); }));
    tools.appendChild(b("icon_save", t("save"), function () { openSaves("save"); }));
    tools.appendChild(b(null, t("load"), function () { openSaves("load"); }));
    tools.appendChild(b(null, t("settings"), openSettings));
    tools.appendChild(soundButton());
    tools.appendChild(b("icon_lang", t("lang_toggle"), toggleLang, t("language") + ": " + t("lang_toggle")));
    tools.appendChild(b(null, "⌂", function () {
      confirmBox(t("quit_confirm")).then(function (ok) { if (ok) show("title"); });
    }, t("to_title")));
  }

  function statLabel(k) {
    if (k === "renown") return L(UI.game.faction.renownLabel) || "Renown";
    return t(k);
  }

  function buildStats() {
    var f = UI.game.faction, box = clear($("stats"));
    [["hp", "icon_hp", "var(--c-hp)"], ["sanity", "icon_sanity", "var(--c-sanity)"],
     ["corruption", "icon_corruption", "var(--c-corruption)"], ["renown", f.renownIcon, "var(--accent)"]].forEach(function (d) {
      box.appendChild(h("div", {class: "stat", id: "stat-" + d[0], vars: {"--c": d[2]}, role: "group", "aria-label": statLabel(d[0])},
        art("ui", d[1]),
        h("div", {class: "col"},
          h("div", {class: "lab"}, h("span", null, statLabel(d[0])), h("b", {id: "sv-" + d[0]}, "0")),
          h("div", {class: "bar", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, id: "sb-" + d[0]}, h("i", null)))));
    });
    clear($("clock-icon")).appendChild(art("ui", "icon_clock"));
  }

  function renderHud(skipDate) {
    var g = UI.game;
    if (!g) return;
    var s = g.state.stats;
    WH.Rules.STATS.forEach(function (k) {
      var v = Math.round(s[k]);
      var bar = $("sb-" + k);
      if (!bar) return;
      $("sv-" + k).textContent = v;
      bar.firstChild.style.width = v + "%";
      bar.setAttribute("aria-valuenow", v);
      var danger = (k === "hp" || k === "sanity") ? v < 30 : (k === "corruption" ? v > 60 : false);
      $("stat-" + k).classList.toggle("low", danger);
    });
    if (!skipDate) $("date").textContent = WH.fmtDate(g.date());
    $("playtime").textContent = "⏱ " + WH.fmtPlay(g.state.playMs);
    var ch = g.state.chapter, ct = g.faction.chapters && g.faction.chapters[ch];
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

  /* render the current node; opts.instant = no typewriter (language switch / load) */
  function renderNode(opts) {
    opts = opts || {};
    var g = UI.game, node;
    try { node = g.node(); } catch (e) { toast(t("missing_node", {x: e.message})); return; }
    setScene(node.scene);
    setActor("left", node.speaker ? node.speaker.sprite : g.faction.playerSprite, !node.speaker);
    setActor("right", node.foe || null);
    var np = $("nameplate"), name = nodeSpeakerName(node);
    np.textContent = name;
    np.className = "nameplate" + (name ? "" : " narration");
    $("dlg-text").classList.toggle("narr", !node.speaker);
    renderChoices(true);
    if (!UI.eventOpen) mood(au("moodFor", node, g.state, g.faction));
    var text = L(node.text);
    if (node.ending) {
      var gm = godsMet();
      if (gm.length) text += "\n\n" + t("gods_watched", {x: gm.map(godName).join(WH.lang === "zh" ? "、" : ", ")});
    }
    UI.typer.run(text, opts.instant ? "instant" : UI.settings.textSpeed, revealChoices);
    updateDlgH();
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
      kids.push(ct);
      if (v.roll && !v.locked) kids.push(h("span", {class: "badge", title: v.roll.stat ? statLabel(v.roll.stat) : ""}, t("risky") + " " + Math.round(v.roll.pEff * 100) + "%"));
      var aria = (i + 1) + ". " + label + (v.locked ? " (" + t("locked") + ": " + reqHint(v.choice.require) + ")" : "") +
                 (v.roll && !v.locked ? " (" + t("risky") + " " + Math.round(v.roll.pEff * 100) + "%)" : "");
      box.appendChild(h("button", {class: cls, type: "button", disabled: v.locked, "aria-label": aria, "data-i": i,
        onclick: function () { choose(i); }}, kids));
    });
  }

  function revealChoices() {
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
    if (!g || UI.busy || UI.eventOpen || UI.modals.length || UI.lore) return;
    if (UI.typer.active) { UI.typer.finish(); return; }
    if (g.state.ended) { showEnding(); return; }
    var v = g.choices()[i];
    if (!v || v.locked) return;
    Array.prototype.forEach.call($("choices").children, function (b) { b.disabled = true; });
    var step;
    try { step = g.choose(i); } catch (e) { toast(t("missing_node", {x: e.message})); console.error(e); renderChoices(); return; }
    if (!step) { renderChoices(); return; }
    if (step.roll) toast(t("risky") + " " + Math.round(step.roll.pEff * 100) + "% → " + (step.roll.success ? t("roll_ok") : t("roll_fail")));
    playStep(step);
  }
  UI.choose = choose;

  function playStep(step) {
    var g = UI.game;
    UI.busy = true;
    if (step.codexNew && step.codexNew.length) codexToast(step.codexNew);
    if (step.kind === "event") {
      renderHud();
      floatDeltas(step.choiceDeltas);
      UI.busy = false;
      openEvent(step.event);
      return;
    }
    var isDeath = step.ending && step.ending.kind === "death";
    var pre = (step.chapterChanged && !isDeath) ? chapterCard(g.state.chapter) : Promise.resolve();
    pre.then(function () {
      renderNode();
      renderHud(!!step.time);
      runStepFx(step);
      autosave(step);
      UI.busy = false;
    });
  }

  function autosave(step) {
    var g = UI.game;
    if (g.state.ended) { WH.Save.remove("auto"); return; }
    if (step.chapterChanged || g.state.visits % 5 === 0) WH.Save.write("auto", g.toRecord({lang: WH.lang}));
  }

  /* ---------- FX ---------- */
  function runStepFx(step) {
    var g = UI.game, node = g.node();
    floatDeltas(step.deltas);
    if (step.deltas.hp < 0) {
      shake($("scr-game"));
      flash();
      if (node.foe) actorAnim("right", "lunge");
    }
    if (step.roll && step.roll.success && node.foe) actorAnim("right", "hit");
    if (step.time) timeSkip(step.time);
    if (step.time && step.time.warp) glitch($("scr-game"), 1500);
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

  function applyStateFx() {
    var g = UI.game, s = g.state.stats, scr = $("scr-game");
    scr.classList.toggle("insane", UI.fxOn && s.sanity < 30);
    scr.classList.toggle("corrupt", s.corruption > 60);
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
  function codexToast(ids) {
    var glob = WH.Save.codexGlobal();
    var cards = UI.settings.loreCards !== "codex";
    var fresh = ids.filter(function (id) { return WH.codex[id] && glob.indexOf(id) < 0; });
    if (cards) fresh.forEach(function (id) { if (UI.loreQueue.indexOf(id) < 0) UI.loreQueue.push(id); });
    var names = ids.filter(function (id) { return !(cards && fresh.indexOf(id) >= 0); })
      .map(function (id) { return WH.codex[id] ? L(WH.codex[id].name) : null; }).filter(Boolean);
    if (names.length) { toast("▤ " + t("codex_new", {x: names.join(WH.lang === "zh" ? "、" : ", ")})); sfx("codex"); }
    WH.Save.addCodexGlobal(ids);
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
    var back = h("div", {class: "event-back god-" + god, id: "event-overlay", role: "dialog", "aria-modal": "true", "aria-label": t("event_tag")},
      h("div", {class: "ebg"}, art("scene", e.scene || "warp")),
      h("div", {class: "scan"}),
      h("div", {class: "event-panel px", onclick: function (ev) { if (!ev.target.closest("button") && UI.evTyper.active) UI.evTyper.finish(); }},
        h("div", {class: "event-side"}, sideSprite ? art("sprite", sideSprite) : (sigilKey ? art("sprite", sigilKey) : null),
          sideSprite && sigilKey ? h("div", {class: "sigil"}, art("sprite", sigilKey)) : null),
        h("div", {class: "event-main"},
          h("div", {class: "event-tag"}, "✶ " + t("event_tag") + " · " + t("god_" + god)),
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
    if (g.state.eventChoice !== null) {                 // resumed from a save after choosing
      UI.evTyper.run(L(e.text), "instant");
      showEventResult(e.choices[g.state.eventChoice], null);
      return;
    }
    e.choices.forEach(function (c, i) {
      chEl.appendChild(h("button", {class: "btn choice px", type: "button", onclick: function () { eventChoose(i); }},
        h("span", {class: "num"}, String(i + 1)), h("span", {class: "ct"}, L(c.text))));
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
    showEventResult(r.choice, r.deltas);
  }

  function showEventResult(c, deltas) {
    var ev = UI.event, chEl = clear(ev.chEl);
    ev.resEl.hidden = false;
    clear(ev.resEl).appendChild(document.createTextNode(L(c.result) || "……"));
    if (deltas) {
      var parts = WH.Rules.STATS.filter(function (k) { return deltas[k]; }).map(function (k) {
        return statLabel(k) + " " + (deltas[k] > 0 ? "+" : "") + deltas[k];
      });
      if (parts.length) ev.resEl.appendChild(h("div", {style: "margin-top:6px;font-size:13px;color:var(--ink-dim)"}, parts.join("   ")));
    }
    chEl.classList.remove("hidden-until");
    chEl.classList.add("one");
    var btn = h("button", {class: "btn choice ending px", type: "button", onclick: eventContinue}, t("cont_btn") + " ▸");
    chEl.appendChild(btn);
    btn.focus({preventScroll: true});
    flushLore();
  }

  function eventContinue() {
    var g = UI.game;
    closeEventOverlay();
    var step;
    try { step = g.eventContinue(); } catch (e) { toast(t("missing_node", {x: e.message})); return; }
    if (step) playStep(step);
  }

  function closeEventOverlay() {
    var o = $("event-overlay");
    if (o) o.remove();
    if (UI.evTyper) UI.evTyper.stop();
    UI.eventOpen = false;
    UI.event = null;
  }

  /* ======================= LORE CARDS + KEYWORD LINKS ======================= */
  var GODS = ["khorne", "nurgle", "tzeentch", "slaanesh"];
  var CAT_COLOR = {leader: "#d9b45a", enemy: "#c8574a", boss: "#b03a8a", god: "#8a4fd0", lore: "#5f9bc4", place: "#6fae8f"};

  function entryColor(c) {
    var fc = WH.factions[c.faction] && WH.factions[c.faction].color;
    return fc || (c.faction === "xenos" ? "#7fae4f" : c.faction === "chaos" ? "#b0304a" : null);
  }

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
    var auto_ = null;
    if (auto) {
      var cb = h("input", {type: "checkbox", id: "lore-auto-off"});
      cb.checked = UI.settings.loreCards === "codex";
      cb.addEventListener("change", function () { UI.settings.loreCards = cb.checked ? "codex" : "auto"; WH.Save.saveSettings(UI.settings); });
      auto_ = h("label", {class: "lore-auto", for: "lore-auto-off"}, cb, t("lore_auto_off"));
    }
    var isPlace = c.cat === "place";
    var back = h("div", {class: "lore-back", id: "lore-overlay", role: "dialog", "aria-modal": "true", "aria-label": L(c.name)},
      h("div", {class: "lore-card px" + (isPlace ? " place" : ""), vars: {"--cat": CAT_COLOR[c.cat] || "#a8834c"}},
        isPlace ? h("div", {class: "lore-banner"}, art("scene", c.scene || "void"))
                : h("div", {class: "lore-pic"}, art("sprite", c.sprite, null, entryColor(c))),
        h("div", {class: "lore-main"},
          h("div", {class: "lore-top"},
            h("span", {class: "lore-cat"}, t("lc_" + c.cat)),
            auto ? h("span", {class: "lore-new"}, "✦ " + t("lore_new")) : null,
            ids.length > 1 ? h("span", {class: "lore-count"}, (i + 1) + "/" + ids.length) : null),
          h("h3", {class: "lore-name"}, L(c.name)),
          h("p", {class: "lore-text"}, L(c.text)),
          c.more ? h("p", {class: "lore-more"}, L(c.more)) : null,
          h("div", {class: "lore-btns"}, auto_,
            auto && !last ? h("button", {class: "btn small px", type: "button", onclick: function () { closeLore(); }}, t("lore_skip")) : null,
            cont))));
    back.addEventListener("mousedown", function (e) { if (e.target === back) { e.preventDefault(); loreNext(); } });
    $("overlay-root").appendChild(back);
    if (auto && i === 0) sfx("codex");
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
        h("span", {class: "kw-tip", "aria-hidden": "true"}, h("b", null, L(c.name)), " · " + t("lc_" + c.cat), h("br"), L(c.text))));
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

  /* ---------- run records ---------- */
  function causeOf(f, id, node) {
    if (node && node.ending && node.ending.cause) return node.ending.cause;
    var k = null, dn = f.deathNodes || {};
    for (var key in dn) if (dn[key] === id) k = key;
    if (!k && id && id.indexOf("__death_") === 0) k = id.slice(8);
    if (k && WH.I18N.zh["cause_" + k]) return {zh: WH.I18N.zh["cause_" + k], en: WH.I18N.en["cause_" + k]};
    return (node && node.ending && node.ending.title) || {zh: "—", en: "—"};
  }
  function survivedHours(g) { return Math.max(0, g.state.hours - WH.Rules.startHours(g.faction)); }
  function recordRun() {
    var g = UI.game, f = g.faction, node = g.node(), end = node.ending || {kind: "bad"};
    if (UI.lastRun && UI.lastRun.run.runId === g.state.runId && UI.lastRun.run.endingId === g.state.nodeId) return UI.lastRun;
    var run = {
      runId: g.state.runId, at: new Date().toISOString(), faction: f.id,
      facName: f.name, role: f.role, color: f.color, startDate: f.startDate,
      endingId: g.state.nodeId, kind: end.kind, title: end.title || {zh: "终", en: "The End"},
      cause: causeOf(f, g.state.nodeId, node), survived: survivedHours(g), finalHours: g.state.hours,
      playMs: Math.round(g.state.playMs), visits: g.state.visits, gods: godsMet()
    };
    UI.lastRun = WH.Save.addRun(run);
    return UI.lastRun;
  }

  /* ======================= ENDING ======================= */
  function codexEntry(id, unlocked, withMore) {
    var c = WH.codex[id];
    if (!c) return h("div", {class: "centry locked"}, h("div", {class: "pic"}), h("div", null, h("div", {class: "nm"}, "??? (" + id + ")")));
    var fc = WH.factions[c.faction] && WH.factions[c.faction].color;
    var pic = h("div", {class: "pic"}, art("sprite", c.sprite, "fit", fc || (c.faction === "xenos" ? "#7fae4f" : c.faction === "chaos" ? "#b0304a" : null)));
    if (!unlocked) return h("div", {class: "centry locked"}, pic, h("div", null, h("div", {class: "nm"}, t("codex_locked")), h("div", {class: "tx"}, "……")));
    var fac = c.faction && WH.factions[c.faction] ? L(WH.factions[c.faction].name) : "";
    return h("div", {class: "centry"}, pic, h("div", null,
      h("div", null, h("span", {class: "nm"}, L(c.name)), fac ? h("span", {class: "fa"}, fac) : null),
      h("div", {class: "tx"}, L(c.text)),
      withMore && c.more ? h("div", {class: "tx more"}, L(c.more)) : null));
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
    var surv = survivedHours(g);
    var met = h("div", {class: "met"});
    [["leaders", "learn_leaders"], ["enemies", "learn_enemies"], ["boss", "learn_boss"]].forEach(function (grp) {
      var ids = (f.learn && f.learn[grp[0]]) || [];
      met.appendChild(h("div", null, h("h5", null, t(grp[1])),
        ids.map(function (id) { return codexEntry(id, g.state.codex.indexOf(id) >= 0); })));
    });
    var s = clear($("scr-ending"));
    s.style.setProperty("--accent", f.color || "#c9a227");
    s.appendChild(h("div", {class: "bg"}, art("scene", node.scene || "void")));
    s.appendChild(h("div", {class: "corner"}, soundButton(), langButton()));
    var again = h("button", {class: "btn primary px", type: "button", onclick: function () { startGame(f.id); }}, "↻ " + t("again"));
    s.appendChild(h("div", {class: "ending-wrap"},
      h("div", {class: "ending-panel px", role: "region", "aria-label": L(end.title)},
        h("div", {class: "ending-head"},
          h("span", {class: "kind " + end.kind}, t("ending_" + end.kind)),
          h("h2", {class: "ending-title"}, L(end.title)),
          h("span", {class: "ending-fac"}, L(f.name) + " · " + L(f.role))),
        h("p", {class: "ending-text"}, L(node.text)),
        h("div", {class: "ending-fate " + end.kind},
          end.kind !== "good" ? h("div", {class: "fate"}, h("span", {class: "k"}, t("cause")), h("span", {class: "v cause"}, L(causeOf(f, g.state.nodeId, node)))) : null,
          h("div", {class: "fate"}, h("span", {class: "k"}, t("survived")), h("span", {class: "v"}, WH.fmtDur(surv))),
          rr && rr.newRecord ? h("span", {class: "new-record"}, "★ " + t("new_record")) : null),
        h("div", {class: "ending-stats"},
          h("div", null, h("div", {class: "k"}, t("final_date")), h("div", {class: "v"}, WH.fmtDate(g.date()))),
          h("div", null, h("div", {class: "k"}, t("play_time")), h("div", {class: "v"}, WH.fmtPlay(g.state.playMs))),
          h("div", null, h("div", {class: "k"}, t("nodes_visited")), h("div", {class: "v"}, String(g.state.visits))),
          h("div", null, h("div", {class: "k"}, t("codex_completion")), h("div", {class: "v"}, cs.pct + "%  (" + cs.n + "/" + cs.t + ")"))),
        h("div", {class: "ending-scroll"},
          h("h3", {class: "met-title"}, t("you_met")),
          met,
          h("h3", {class: "met-title"}, t("gods_met_title")),
          h("div", {class: "gods"}, GODS.map(function (god) {
            var met_ = godsMet().indexOf(god) >= 0, c = godCodex(god);
            var pic = h("div", {class: "pic"}, art("sprite", "sigil_" + god, "fit", "#8a4fd0"));
            if (!met_) return h("div", {class: "centry god-card locked god-" + god}, pic,
              h("div", null, h("div", {class: "nm"}, t("codex_locked")), h("div", {class: "tx"}, t("god_not_met"))));
            return h("div", {class: "centry god-card god-" + god}, pic, h("div", null,
              h("div", {class: "nm"}, godName(god)),
              c ? h("div", {class: "tx"}, L(c.text)) : null,
              c && c.more ? h("div", {class: "tx more"}, L(c.more)) : null));
          }))),
        h("div", {class: "ending-btns"},
          again,
          h("button", {class: "btn px", type: "button", onclick: function () { show("select"); }}, t("other_faction")),
          h("button", {class: "btn px", type: "button", onclick: function () { show("title"); }}, t("to_title"))))));
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

  /* ---------- codex ---------- */
  var CATS = ["leader", "enemy", "boss", "god", "lore"];
  function codexViews(view) {
    var bar = h("div", {class: "views", role: "tablist"});
    [["entries", "view_entries"], ["places", "view_places"], ["endings", "view_endings"], ["records", "view_records"]].forEach(function (v) {
      bar.appendChild(h("button", {class: "btn px", type: "button", role: "tab", "aria-selected": String(v[0] === view),
        onclick: function () { openCodex(v[0] === "entries" ? "all" : null, true, v[0]); }}, t(v[1])));
    });
    return bar;
  }

  function placesView(filter, detail) {
    var un = unlockedSet(), body = h("div", {class: "places-view"});
    var ids = Object.keys(WH.codex).filter(function (id) { return WH.codex[id].cat === "place"; });
    var n = ids.filter(function (id) { return un[id]; }).length;
    if (detail && WH.codex[detail] && un[detail]) {
      var c = WH.codex[detail], fac = WH.factions[c.faction] ? L(WH.factions[c.faction].name) : t("f_" + (c.faction || "any"));
      body.appendChild(h("button", {class: "btn small px", type: "button", onclick: function () { openCodex(null, true, "places", {filter: filter}); }}, "◂ " + t("back")));
      body.appendChild(h("div", {class: "place-detail"},
        h("div", {class: "place-big"}, art("scene", c.scene || "void")),
        h("div", {class: "place-info"},
          h("div", {class: "lore-top"}, h("span", {class: "lore-cat", style: "--cat:" + CAT_COLOR.place}, t("lc_place")), h("span", {class: "fa"}, fac)),
          h("h3", {class: "lore-name"}, L(c.name)),
          h("p", {class: "lore-text"}, L(c.text)),
          c.more ? h("p", {class: "lore-more"}, L(c.more)) : null)));
      return {body: body, sub: t("unlocked_n", {n: n, t: ids.length})};
    }
    filter = filter || "all";
    var fbar = h("div", {class: "tabs", role: "tablist"});
    ["all", "imperium", "chaos", "tau", "any"].forEach(function (fk) {
      var cnt = fk === "all" ? ids.length : ids.filter(function (id) { return (WH.codex[id].faction || "any") === fk || (fk === "any" && WH.codex[id].faction === "xenos"); }).length;
      if (fk !== "all" && !cnt) return;
      fbar.appendChild(h("button", {class: "btn px", type: "button", role: "tab", "aria-selected": String(fk === filter),
        onclick: function () { openCodex(null, true, "places", {filter: fk}); }}, t("f_" + fk)));
    });
    body.appendChild(fbar);
    var list = ids.filter(function (id) {
      var fa = WH.codex[id].faction || "any";
      return filter === "all" || fa === filter || (filter === "any" && fa === "xenos");
    });
    list.sort(function (a, b) { return (un[b] ? 1 : 0) - (un[a] ? 1 : 0); });
    body.appendChild(h("div", {class: "place-grid"}, list.map(function (id) {
      var c = WH.codex[id], open = !!un[id];
      return h("button", {class: "place-tile px" + (open ? "" : " locked"), type: "button", disabled: !open, "data-id": id,
        "aria-label": open ? L(c.name) : t("codex_locked"),
        onclick: function () { openCodex(null, true, "places", {filter: filter, detail: id}); }},
        h("div", {class: "thumb"}, art("scene", c.scene || "void")),
        h("div", {class: "pn"}, open ? L(c.name) : "???"));
    })));
    if (!ids.length) body.appendChild(h("p", {class: "empty-msg"}, "—"));
    return {body: body, sub: t("unlocked_n", {n: n, t: ids.length})};
  }

  var KIND_ORDER = {good: 0, bad: 1, death: 2};
  function endingsView() {
    var es = WH.Save.endingStats(), body = h("div", {class: "endings-view"}), tot = 0, got = 0;
    factionList().forEach(function (f) {
      var ids = Object.keys(f.nodes || {}).filter(function (id) { return f.nodes[id].ending; });
      ids.sort(function (a, b) { return (KIND_ORDER[f.nodes[a].ending.kind] || 0) - (KIND_ORDER[f.nodes[b].ending.kind] || 0); });
      var n = ids.filter(function (id) { return es[f.id + ":" + id]; }).length;
      tot += ids.length; got += n;
      body.appendChild(h("section", {class: "codex-sec", vars: {"--accent": f.color || "#c9a227"}},
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

  function recordsView() {
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
      var f = WH.factions[r.faction], color = (f && f.color) || r.color || "#c9a227";
      var gods = (r.gods || []).length ? h("span", {class: "run-gods"}, r.gods.map(function (gd) {
        var el = art("sprite", "sigil_" + gd, "sig", "#8a4fd0"); if (el && el.setAttribute) el.setAttribute("title", godName(gd)); return el; })) : "—";
      var cell = function (k, v) { return h("div", null, h("div", {class: "k"}, k), h("div", {class: "v"}, v)); };
      body.appendChild(h("div", {class: "run-row", vars: {"--accent": color}},
        h("div", {class: "run-top"},
          h("span", {class: "kind sm " + r.kind}, t("ending_" + r.kind)),
          h("b", {class: "run-title"}, L(r.title)),
          h("span", {class: "run-fac"}, L((f && f.name) || r.facName) + " · " + L((f && f.role) || r.role)),
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

  function openCodex(tab, replace, view, opt) {
    view = view || "entries";
    opt = opt || {};
    if (view !== "entries") {
      var v = view === "endings" ? endingsView() : view === "places" ? placesView(opt.filter, opt.detail) : recordsView();
      openModal({title: view === "records" ? t("records_title") : t("codex_title"), icon: "icon_codex", sub: v.sub, replace: replace,
        body: h("div", null, codexViews(view), v.body), foot: v.foot,
        focus: opt.detail ? ".place-detail, .modal-body button" : ".views [aria-selected='true']", reopen: function () { openCodex(null, true, view, opt); }});
      return;
    }
    tab = tab || "all";
    var unlocked = WH.Save.codexGlobal().slice();
    if (UI.game) UI.game.state.codex.forEach(function (id) { if (unlocked.indexOf(id) < 0) unlocked.push(id); });
    var ids = Object.keys(WH.codex);
    var n = ids.filter(function (id) { return unlocked.indexOf(id) >= 0; }).length;
    var tabs = h("div", {class: "tabs", role: "tablist"});
    ["all"].concat(CATS).forEach(function (c) {
      var cnt = c === "all" ? ids.length : ids.filter(function (id) { return WH.codex[id].cat === c; }).length;
      if (c !== "all" && !cnt) return;
      tabs.appendChild(h("button", {class: "btn px", type: "button", role: "tab", "aria-selected": String(c === tab),
        onclick: function () { openCodex(c, true, "entries"); }}, t("cat_" + c)));
    });
    var body = h("div", null, codexViews("entries"), tabs);
    CATS.forEach(function (c) {
      if (tab !== "all" && tab !== c) return;
      var list = ids.filter(function (id) { return WH.codex[id].cat === c; });
      if (!list.length) return;
      list.sort(function (a, b) { return (unlocked.indexOf(b) >= 0) - (unlocked.indexOf(a) >= 0); });
      var un = list.filter(function (id) { return unlocked.indexOf(id) >= 0; }).length;
      body.appendChild(h("section", {class: "codex-sec"}, h("h4", null, t("cat_" + c) + "  " + un + "/" + list.length),
        h("div", {class: "codex-grid"}, list.map(function (id) { return codexEntry(id, unlocked.indexOf(id) >= 0, true); }))));
    });
    if (!ids.length) body.appendChild(h("p", {class: "empty-msg"}, "—"));
    openModal({title: t("codex_title"), icon: "icon_codex", sub: t("codex_progress", {n: n, t: ids.length}), body: body, replace: replace,
      focus: ".views [aria-selected='true']", reopen: function () { openCodex(tab, true, "entries"); }});
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
      kids.push(h("div", {class: "fac", style: "color:" + (f.color || "inherit")}, L(f.name) + " · " + L(f.role)));
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
    try { g = WH.Game.fromRecord(rec, {rng: newRng()}); }
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
      h("div", {class: "setrow"}, h("span", {class: "k"}, t("lore_cards")),
        seg([["auto", t("lore_auto")], ["codex", t("lore_codex_only")]], st.loreCards || "auto", function (v) { st.loreCards = v; save(); openSettings(true); })),
      h("div", {class: "setrow"}, h("span", {class: "k"}, t("language")),
        seg([["zh", "中文"], ["en", "English"]], WH.lang, function (v) { setLang(v); })),
      UI.reduced ? h("p", {style: "font-size:12px;color:var(--ink-dim)"}, t("reduced_motion")) : null);
    openModal({title: t("settings_title"), narrow: true, body: body, replace: replace === true,
      focus: ".modal-body [aria-pressed='true']", reopen: function () { openSettings(true); }});
  }
  UI.openSettings = openSettings;

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
      if (!UI.busy) renderNode({instant: true});
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
    if (UI.lore && !UI.modals.length) {
      var lo = $("lore-overlay");
      if (k === "Escape") { e.preventDefault(); closeLore(); }
      else if ((k === " " || k === "Enter") && !onButton) { e.preventDefault(); loreNext(); }
      else if (k === "Tab" && lo) trapFocus(e, lo);
      else if (/^[1-4]$/.test(k)) e.preventDefault();
      return;
    }
    if (k === "Escape") { if (UI.modals.length) { e.preventDefault(); closeTop(); } return; }
    if (UI.modals.length || e.ctrlKey || e.metaKey || e.altKey) return;
    if (UI.eventOpen && UI.event) {
      if (/^[1-3]$/.test(k)) { var b = UI.event.chEl.querySelectorAll("button")[+k - 1]; if (b) { e.preventDefault(); b.click(); } }
      else if ((k === " " || k === "Enter") && UI.evTyper.active) { e.preventDefault(); UI.evTyper.finish(); }
      return;
    }
    if (UI.screen !== "game" || !UI.game) return;
    if (/^[1-4]$/.test(k)) { e.preventDefault(); if (UI.typer.active) UI.typer.finish(); else choose(+k - 1); return; }
    if ((k === " " || k === "Enter") && !onButton) {
      e.preventDefault();
      if (UI.typer.active) UI.typer.finish();
      else if (UI.game.state.ended) showEnding();
    }
  }
})();
