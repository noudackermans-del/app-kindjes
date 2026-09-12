// Rekenmodules. Elke generate(level) schaalt van kleuter (niveau 1) tot
// ongeveer groep 6 / 10 jaar (niveau 7-8).

import { randInt, pick, sample, shuffle } from "../ui.js";
import { COUNTABLES } from "../data/things.js";

// Hulpje: maak keuze-opties rond het juiste getalantwoord.
// Eerst dichtbije getallen (binnen 'spread'), daarna aanvullen uit de hele reeks.
function numberChoices(answer, spread, count = 4, min = 0, max = 999) {
  const set = new Set([answer]);
  const nearby = [];
  for (let v = Math.max(min, answer - spread); v <= Math.min(max, answer + spread); v++) {
    if (v !== answer) nearby.push(v);
  }
  for (const v of shuffle(nearby)) {
    if (set.size >= count) break;
    set.add(v);
  }
  // Nog te weinig opties? Vul aan met andere getallen uit de reeks.
  for (let v = min; v <= max && set.size < count; v++) set.add(v);
  return shuffle([...set]).map((n) => ({ id: String(n), label: String(n) }));
}

// --- Tellen: voorwerpen tellen en het juiste aantal kiezen ---
export const tellen = {
  id: "tellen",
  title: "Tellen",
  icon: "🍎",
  domain: "rekenen",
  generate(level, ctx) {
    const max = [5, 8, 10, 12, 15, 20, 20, 20][Math.min(level - 1, 7)];
    const list = (ctx && ctx.theme && ctx.theme.countables) || COUNTABLES;
    const thing = pick(list);
    const n = randInt(1, max);
    const options = numberChoices(n, 3, 4, 1, 20);
    return {
      speak: `Hoeveel ${thing.many} zie je?`,
      prompt: `Hoeveel ${thing.many} zie je?`,
      visual: { type: "objects", emoji: thing.emoji, count: n },
      input: { type: "choice", options, correctId: String(n), columns: 4 },
    };
  },
};

// --- Cijfers herkennen: "Tik op de N" ---
export const cijfers = {
  id: "cijfers",
  title: "Cijfers",
  icon: "🔢",
  domain: "rekenen",
  generate(level) {
    const max = [5, 10, 20, 20, 50, 100, 100, 100][Math.min(level - 1, 7)];
    const n = randInt(0, max);
    const spread = Math.max(2, Math.round(max / 6));
    const options = numberChoices(n, spread, 4, 0, max);
    return {
      speak: `Tik op de ${n}`,
      prompt: `Welke is de ${n}?`,
      input: { type: "choice", options, correctId: String(n), columns: 4, big: true },
    };
  },
};

// --- Optellen & aftrekken met visuele hulp (blokjes), meerkeuze ---
export const optellenVisueel = {
  id: "optellen-visueel",
  title: "Plus & min",
  icon: "➕",
  domain: "rekenen",
  generate(level) {
    // per niveau: bovengrens en of aftrekken meedoet
    const cfg = [
      { max: 10, sub: false, visual: true },
      { max: 10, sub: true, visual: true },
      { max: 20, sub: true, visual: true },
      { max: 20, sub: true, visual: true },
      { max: 50, sub: true, visual: false },
      { max: 100, sub: true, visual: false },
      { max: 100, sub: true, visual: false },
      { max: 100, sub: true, visual: false },
    ][Math.min(level - 1, 7)];

    const plus = !cfg.sub || Math.random() < 0.5;
    let a, b, answer, op;
    if (plus) {
      a = randInt(1, cfg.max - 1);
      b = randInt(1, cfg.max - a);
      answer = a + b;
      op = "+";
    } else {
      a = randInt(2, cfg.max);
      b = randInt(1, a);
      answer = a - b;
      op = "−";
    }
    const options = numberChoices(answer, Math.max(2, Math.round(cfg.max / 8)), 4, 0, cfg.max);
    return {
      speak: `Hoeveel is ${a} ${plus ? "plus" : "min"} ${b}?`,
      prompt: `${a} ${op} ${b} = ?`,
      visual: cfg.visual ? { type: "blocks", a, b, op: plus ? "+" : "-" } : { type: "text", text: `${a} ${op} ${b} =` },
      input: { type: "choice", options, correctId: String(answer), columns: 4, big: true },
    };
  },
};

// --- Sommen invullen met cijferpad (plus/min tot 100) ---
export const sommenInvullen = {
  id: "sommen-invullen",
  title: "Sommen invullen",
  icon: "✏️",
  domain: "rekenen",
  generate(level) {
    const max = [10, 20, 20, 50, 100, 100, 1000, 1000][Math.min(level - 1, 7)];
    const plus = Math.random() < 0.5;
    let a, b, answer, op;
    if (plus) {
      a = randInt(1, max - 1);
      b = randInt(1, max - a);
      answer = a + b;
      op = "+";
    } else {
      a = randInt(2, max);
      b = randInt(1, a);
      answer = a - b;
      op = "−";
    }
    return {
      speak: `Wat is ${a} ${plus ? "plus" : "min"} ${b}?`,
      prompt: `${a} ${op} ${b} =`,
      visual: { type: "text", text: `${a} ${op} ${b} =` },
      input: { type: "number", answer },
    };
  },
};

// --- Tafels (vermenigvuldigen) ---
export const tafels = {
  id: "tafels",
  title: "Tafels",
  icon: "✖️",
  domain: "rekenen",
  generate(level) {
    // welke tafels doen mee
    const tables = [
      [1, 2, 5, 10],
      [1, 2, 3, 4, 5, 10],
      [2, 3, 4, 5, 6, 10],
      [2, 3, 4, 5, 6, 7, 8, 9, 10],
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    ][Math.min(level - 1, 4)];
    const a = pick(tables);
    const b = randInt(1, level >= 5 ? 12 : 10);
    const answer = a * b;
    return {
      speak: `Hoeveel is ${a} keer ${b}?`,
      prompt: `${a} × ${b} =`,
      visual: { type: "text", text: `${a} × ${b} =` },
      input: { type: "number", answer },
    };
  },
};

// --- Delen (op basis van de tafels) ---
export const delen = {
  id: "delen",
  title: "Delen",
  icon: "➗",
  domain: "rekenen",
  generate(level) {
    const maxTable = [5, 10, 10, 12][Math.min(level - 1, 3)];
    const b = randInt(2, maxTable);
    const answer = randInt(1, maxTable);
    const a = b * answer;
    return {
      speak: `Hoeveel is ${a} gedeeld door ${b}?`,
      prompt: `${a} : ${b} =`,
      visual: { type: "text", text: `${a} : ${b} =` },
      input: { type: "number", answer },
    };
  },
};

// --- Klokkijken (analoge klok) ---
const KLOK_UUR = ["twaalf", "één", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien", "elf"];
function uurNaam(h) {
  return KLOK_UUR[((h % 12) + 12) % 12];
}
function tijdInWoorden(h, m) {
  const nextH = (h + 1) % 12;
  if (m === 0) return `${uurNaam(h)} uur`;
  if (m === 15) return `kwart over ${uurNaam(h)}`;
  if (m === 30) return `half ${uurNaam(nextH)}`;
  if (m === 45) return `kwart voor ${uurNaam(nextH)}`;
  if (m < 30) return `${m} over ${uurNaam(h)}`;
  return `${60 - m} voor ${uurNaam(nextH)}`;
}

export const klok = {
  id: "klok",
  title: "Klokkijken",
  icon: "🕐",
  domain: "rekenen",
  generate(level) {
    // welke minuten mogen voorkomen
    const minutes = [
      [0],
      [0, 30],
      [0, 15, 30, 45],
      [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    ][Math.min(level - 1, 3)];
    const h = randInt(1, 12);
    const m = pick(minutes);
    const correct = tijdInWoorden(h % 12, m);

    // afleiders
    const distract = new Set([correct]);
    let guard = 0;
    while (distract.size < 4 && guard++ < 50) {
      const dh = randInt(1, 12);
      const dm = pick(minutes);
      distract.add(tijdInWoorden(dh % 12, dm));
    }
    const options = shuffle([...distract]).map((t) => ({ id: t, label: t }));
    return {
      speak: "Hoe laat is het?",
      prompt: "Hoe laat is het?",
      visual: { type: "clock", h: h % 12, m },
      input: { type: "choice", options, correctId: correct, columns: 2 },
    };
  },
};
