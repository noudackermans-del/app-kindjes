// App-opbouw: profielkeuze -> startscherm -> oefensessie -> beloningsscherm.

import { el, mount } from "./ui.js";
import {
  PROFILES, getProfile, getChild, getLevel, getLevelProgress,
  getAccessories, ensureModuleLevels, recordSession, getSound, setSound,
  ACCESSORIES,
} from "./state.js";
import { MODULES, modulesForChild, seedFor } from "./exercises/index.js";
import { themeFor, applyTheme } from "./themes.js";
import { mascotSVG } from "./mascot.js";
import { runSession } from "./engine.js";
import { speak, stopSpeaking, playFanfare } from "./audio.js";

const app = document.getElementById("app");

// ---------- Profielkeuze ----------
function showProfiles() {
  stopSpeaking();
  applyTheme(themeFor("neutraal"));
  document.body.dataset.screen = "profiles";

  const cards = PROFILES.map((p) => {
    const theme = themeFor(p.theme);
    return el(
      "button",
      {
        class: "profile-card",
        type: "button",
        style: { "--pc": p.color, background: `linear-gradient(160deg, ${theme.colors.bg1}, ${theme.colors.bg2})` },
        onClick: () => enterChild(p.id),
      },
      [
        el("div", { class: "profile-mascot", html: mascotSVG({ color: p.color, level: getLevel(p.id), accessories: getAccessories(p.id), variant: theme.mascot }) }),
        el("div", { class: "profile-name", text: p.name }),
        el("div", { class: "profile-theme", text: theme.label }),
      ]
    );
  });

  mount(
    app,
    el("div", { class: "screen profiles" }, [
      el("h1", { class: "app-title", text: "Wie gaat er spelen?" }),
      el("div", { class: "profile-row" }, cards),
    ])
  );
}

function enterChild(childId) {
  const profile = getProfile(childId);
  const theme = themeFor(profile.theme);
  applyTheme(theme);
  ensureModuleLevels(childId, seedFor(childId));
  speak(`Hoi ${profile.name}! Wat wil je oefenen?`);
  showHome(childId);
}

// ---------- Startscherm ----------
function showHome(childId) {
  stopSpeaking();
  document.body.dataset.screen = "home";
  const profile = getProfile(childId);
  const theme = themeFor(profile.theme);
  const child = getChild(childId);

  const header = el("div", { class: "home-header" }, [
    el("button", { class: "icon-btn", type: "button", text: "⇄", aria: { label: "ander kind" }, onClick: showProfiles }),
    el("div", { class: "home-title", text: `Hoi ${profile.name}!` }),
    el("button", {
      class: "icon-btn", type: "button", text: getSound() ? "🔊" : "🔇", aria: { label: "geluid" },
      onClick: (e) => { setSound(!getSound()); e.currentTarget.textContent = getSound() ? "🔊" : "🔇"; },
    }),
  ]);

  const stats = el("div", { class: "stats" }, [
    el("div", { class: "stat" }, [el("span", { class: "stat-num", text: "⭐ " + child.correct }), el("span", { class: "stat-label", text: "sterren" })]),
    el("div", { class: "stat" }, [el("span", { class: "stat-num", text: "🔥 " + child.streak.count }), el("span", { class: "stat-label", text: "dagen" })]),
    el("div", { class: "stat" }, [el("span", { class: "stat-num", text: "🏅 " + getLevel(childId) }), el("span", { class: "stat-label", text: "level" })]),
  ]);

  const mascotBox = el("div", { class: "mascot-box" }, [
    el("div", { class: "mascot", html: mascotSVG({ color: profile.color, level: getLevel(childId), accessories: getAccessories(childId), variant: theme.mascot }) }),
    el("div", { class: "level-bar" }, [el("div", { class: "level-fill", style: { width: Math.round(getLevelProgress(childId) * 100) + "%" } })]),
  ]);

  const tiles = modulesForChild(childId).map((m) => {
    if (!m.unlocked) {
      return el("button", { class: "tile locked", type: "button", onClick: () => toast(m.hint || "Nog even oefenen om dit te openen") }, [
        el("span", { class: "tile-lock", text: "🔒" }),
        el("span", { class: "tile-icon", text: m.icon }),
        el("span", { class: "tile-title", text: m.title }),
        el("span", { class: "tile-level", text: m.hint || "" }),
      ]);
    }
    return el("button", { class: "tile", type: "button", style: { "--tile": theme.colors.primary }, onClick: () => startModule(childId, m.id) }, [
      el("span", { class: "tile-icon", text: m.icon }),
      el("span", { class: "tile-title", text: m.title }),
      el("span", { class: "tile-level", text: "niveau " + m.level }),
    ]);
  });

  mount(
    app,
    el("div", { class: "screen home" }, [
      header,
      mascotBox,
      stats,
      el("div", { class: "tiles" }, tiles),
    ])
  );
}

// ---------- Sessie ----------
function startModule(childId, moduleId) {
  const profile = getProfile(childId);
  const theme = themeFor(profile.theme);
  const mod = MODULES[moduleId];
  const level = modulesForChild(childId).find((m) => m.id === moduleId).level;
  document.body.dataset.screen = "session";
  runSession({
    container: app,
    module: mod,
    level,
    theme,
    onFinish: (result) => {
      const summary = recordSession(childId, moduleId, result);
      showReward(childId, moduleId, summary);
    },
    onExit: () => showHome(childId),
  });
}

// ---------- Beloningsscherm ----------
function showReward(childId, moduleId, summary) {
  stopSpeaking();
  document.body.dataset.screen = "reward";
  const profile = getProfile(childId);
  const theme = themeFor(profile.theme);
  playFanfare();

  const goedText = `Je had er ${summary.correctFirstTry} van de ${summary.total} in één keer goed!`;
  let extra = "";
  if (summary.leveledUp) extra = " Je bent gegroeid! 🎉";
  speak("Goed gedaan! " + goedText + extra);

  const stars = el("div", { class: "reward-stars" });
  for (let i = 0; i < summary.total; i++) {
    stars.append(el("span", { class: "rstar" + (i < summary.correctFirstTry ? " on" : ""), text: i < summary.correctFirstTry ? "⭐" : "☆" }));
  }

  const newAcc = summary.newAccessories
    .map((id) => ACCESSORIES.find((a) => a.id === id))
    .filter(Boolean);

  const nodes = [
    el("h1", { class: "reward-title", text: "Goed gedaan!" }),
    el("div", { class: "mascot reward-mascot" + (summary.leveledUp ? " grow" : ""), html: mascotSVG({ color: profile.color, level: summary.newLevel, accessories: getAccessories(childId), variant: theme.mascot }) }),
    stars,
    el("div", { class: "reward-points", text: `+${summary.gained} punten` }),
  ];
  if (summary.leveledUp) nodes.push(el("div", { class: "reward-levelup", text: `🎉 Level ${summary.newLevel}!` }));
  if (newAcc.length) {
    nodes.push(el("div", { class: "reward-unlock" }, [
      el("div", { class: "unlock-label", text: "Nieuw voor je mascotte:" }),
      el("div", { class: "unlock-items" }, newAcc.map((a) => el("span", { class: "unlock-item", text: `${a.emoji} ${a.label}` }))),
    ]));
  }
  nodes.push(
    el("div", { class: "reward-buttons" }, [
      el("button", { class: "btn btn-primary", type: "button", text: "Nog een keer", onClick: () => startModule(childId, moduleId) }),
      el("button", { class: "btn", type: "button", text: "Andere oefening", onClick: () => showHome(childId) }),
    ])
  );

  mount(app, el("div", { class: "screen reward" }, nodes));
}

// ---------- Toast ----------
let toastTimer = null;
function toast(text) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    document.body.append(t);
  }
  t.textContent = text;
  t.classList.add("show");
  speak(text);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2500);
}

// ---------- Service worker (offline) ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(new URL("../sw.js", import.meta.url)).catch(() => {});
  });
}

showProfiles();
