// Tekent een vraag: het visuele deel (voorwerpen, blokjes, klok, plaatje, som)
// en het antwoord-deel (keuzeknoppen, cijferpad of lettertegels).

import { el, shuffle } from "./ui.js";
import { shapeSVG } from "./data/things.js";

// ---------- VISUEEL ----------

export function renderVisual(visual) {
  if (!visual) return null;
  switch (visual.type) {
    case "objects": {
      const wrap = el("div", { class: "objects" });
      for (let i = 0; i < visual.count; i++) {
        wrap.append(el("span", { class: "object", text: visual.emoji }));
      }
      return wrap;
    }
    case "picture":
      return el("div", { class: "big-picture", text: visual.emoji });
    case "text":
      return el("div", { class: "sum-text", text: visual.text });
    case "blocks":
      return renderBlocks(visual);
    case "clock":
      return renderClock(visual.h, visual.m);
    default:
      return null;
  }
}

function renderBlocks({ a, b, op }) {
  const wrap = el("div", { class: "blocks" });
  const group = (n, cls, crossed) => {
    const g = el("div", { class: "block-group " + cls });
    for (let i = 0; i < n; i++) {
      g.append(el("span", { class: "block" + (crossed && i >= n - b ? " crossed" : "") }));
    }
    return g;
  };
  if (op === "+") {
    wrap.append(group(a, "g1"), el("span", { class: "block-op", text: "+" }), group(b, "g2"));
  } else {
    // aftrekken: toon a blokjes waarvan de laatste b doorgestreept zijn
    wrap.append(group(a, "g1", true));
  }
  return wrap;
}

function renderClock(h, m) {
  const cx = 100, cy = 100, r = 92;
  let ticks = "";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * 2 * Math.PI;
    const x1 = cx + Math.sin(a) * (r - 6);
    const y1 = cy - Math.cos(a) * (r - 6);
    const x2 = cx + Math.sin(a) * (r - 16);
    const y2 = cy - Math.cos(a) * (r - 16);
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#94a3b8" stroke-width="3"/>`;
    const nx = cx + Math.sin(a) * (r - 32);
    const ny = cy - Math.cos(a) * (r - 32) + 7;
    const num = i === 0 ? 12 : i;
    ticks += `<text x="${nx}" y="${ny}" text-anchor="middle" font-size="18" font-weight="700" fill="#475569">${num}</text>`;
  }
  const hourAngle = ((h % 12) + m / 60) * 30 * (Math.PI / 180);
  const minAngle = m * 6 * (Math.PI / 180);
  const hx = cx + Math.sin(hourAngle) * (r * 0.5);
  const hy = cy - Math.cos(hourAngle) * (r * 0.5);
  const mx = cx + Math.sin(minAngle) * (r * 0.72);
  const my = cy - Math.cos(minAngle) * (r * 0.72);
  const svg = `
    <svg viewBox="0 0 200 200" width="100%" height="100%" aria-label="klok">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#cbd5e1" stroke-width="5"/>
      ${ticks}
      <line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="#1f2937" stroke-width="7" stroke-linecap="round"/>
      <line x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}" stroke="#3b82f6" stroke-width="5" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="6" fill="#1f2937"/>
    </svg>`;
  return el("div", { class: "clock", html: svg });
}

// ---------- ANTWOORD ----------

/**
 * @returns {{node: HTMLElement, markWrong: Function, solve: Function}}
 */
export function renderInput(input, { onSubmit }) {
  switch (input.type) {
    case "choice":
      return renderChoice(input, onSubmit);
    case "number":
      return renderNumberPad(input, onSubmit);
    case "letters":
      return renderLetters(input, onSubmit);
    default:
      return { node: el("div"), markWrong() {}, solve() {} };
  }
}

function renderChoice(input, onSubmit) {
  const grid = el("div", { class: "choices cols-" + (input.columns || 2) });
  const buttons = new Map();
  for (const opt of input.options) {
    let content;
    if (opt.shape) content = el("span", { class: "opt-shape", html: shapeSVG(opt.shape, opt.color) });
    else if (opt.emoji) content = el("span", { class: "opt-emoji", text: opt.emoji });
    else content = el("span", { class: "opt-label", text: opt.label });
    const btn = el(
      "button",
      {
        class: "choice" + (input.big ? " big" : "") + (opt.color && !opt.shape ? " swatch" : ""),
        type: "button",
        dataset: { id: opt.id },
        onClick: () => onSubmit(opt.id),
        aria: { label: opt.label || opt.id },
      },
      [content]
    );
    buttons.set(opt.id, btn);
    grid.append(btn);
  }
  return {
    node: grid,
    markWrong(id) {
      const b = buttons.get(id);
      if (b) {
        b.classList.add("wrong");
        b.disabled = true;
      }
    },
    solve() {
      for (const [id, b] of buttons) {
        b.disabled = true;
        if (id === input.correctId) b.classList.add("correct");
      }
    },
  };
}

function renderNumberPad(input, onSubmit) {
  let value = "";
  const display = el("div", { class: "np-display", text: "" });
  const update = () => (display.textContent = value || "…");
  const keypad = el("div", { class: "keypad" });
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "wis", "0", "ok"];
  for (const k of keys) {
    let label = k, cls = "key";
    if (k === "wis") { label = "⌫"; cls += " key-del"; }
    if (k === "ok") { label = "Klaar"; cls += " key-ok"; }
    keypad.append(
      el("button", {
        class: cls,
        type: "button",
        text: label,
        onClick: () => {
          if (k === "wis") value = value.slice(0, -1);
          else if (k === "ok") { if (value !== "") onSubmit(Number(value)); return; }
          else if (value.length < 4) value += k;
          update();
        },
      })
    );
  }
  update();
  const node = el("div", { class: "numberpad" }, [display, keypad]);
  return {
    node,
    markWrong() {
      display.classList.remove("shake");
      void display.offsetWidth; // herstart animatie
      display.classList.add("shake");
      value = "";
      update();
    },
    solve() {
      value = String(input.answer);
      update();
      display.classList.add("solved");
      keypad.querySelectorAll("button").forEach((b) => (b.disabled = true));
    },
  };
}

function renderLetters(input, onSubmit) {
  const answer = input.answer;
  const chosen = []; // gekozen letters (in volgorde)
  const slots = el("div", { class: "slots" });
  const pool = el("div", { class: "letter-pool" });

  const renderSlots = () => {
    slots.replaceChildren();
    for (let i = 0; i < answer.length; i++) {
      slots.append(el("span", { class: "slot", text: chosen[i] || "" }));
    }
  };

  const tileButtons = [];
  input.pool.forEach((letter, idx) => {
    const btn = el("button", {
      class: "letter-tile",
      type: "button",
      text: letter,
      onClick: () => {
        if (btn.disabled) return;
        if (chosen.length >= answer.length) return;
        chosen.push(letter);
        btn.disabled = true;
        btn.classList.add("used");
        renderSlots();
        if (chosen.length === answer.length) {
          onSubmit(chosen.join(""));
        }
      },
    });
    tileButtons.push(btn);
    pool.append(btn);
  });

  const undo = el("button", {
    class: "undo",
    type: "button",
    text: "⌫ terug",
    onClick: () => {
      const last = chosen.pop();
      if (last != null) {
        // eerste geblokkeerde tegel met die letter weer vrijgeven
        const b = tileButtons.find((t) => t.disabled && t.textContent === last && t.classList.contains("used"));
        if (b) { b.disabled = false; b.classList.remove("used"); }
        renderSlots();
      }
    },
  });

  renderSlots();
  const node = el("div", { class: "letters-input" }, [slots, pool, undo]);
  return {
    node,
    markWrong() {
      slots.classList.remove("shake");
      void slots.offsetWidth;
      slots.classList.add("shake");
      chosen.length = 0;
      tileButtons.forEach((b) => { b.disabled = false; b.classList.remove("used"); });
      renderSlots();
    },
    solve() {
      chosen.length = 0;
      for (const ch of answer) chosen.push(ch);
      renderSlots();
      slots.classList.add("solved");
      tileButtons.forEach((b) => (b.disabled = true));
      undo.disabled = true;
    },
  };
}

// ---------- CONTROLE ----------

export function isCorrect(question, response) {
  const input = question.input;
  if (input.type === "choice") return response === input.correctId;
  if (input.type === "number") return Number(response) === Number(input.answer);
  if (input.type === "letters") return String(response) === String(input.answer);
  return false;
}
