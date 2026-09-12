// Taalmodules: letters, spelling en woorden. Schalen van kleuter tot ~groep 6.

import { randInt, pick, sample, shuffle } from "../ui.js";
import {
  WORDS_T1, WORDS_T2, WORDS_T3,
  LETTERS_EASY, LETTERS_ALL, LETTER_EXAMPLES, SPELLING_TRICKY,
} from "../data/words.js";
import { COLORS, SHAPES } from "../data/things.js";

// Kies een woordenlijst passend bij het niveau.
function wordsForLevel(level) {
  if (level <= 2) return WORDS_T1;
  if (level <= 4) return [...WORDS_T1, ...WORDS_T2];
  return [...WORDS_T2, ...WORDS_T3];
}

// --- Letters herkennen + klank ("welke letter hoor je?") ---
export const letters = {
  id: "letters",
  title: "Letters",
  icon: "🔤",
  domain: "taal",
  generate(level) {
    const pool = level <= 2 ? LETTERS_EASY : LETTERS_ALL;
    const nOptions = level <= 1 ? 3 : 4;
    const target = pick(pool);
    const others = sample(pool.filter((l) => l !== target), nOptions - 1);
    const options = shuffle([target, ...others]).map((l) => ({ id: l, label: l }));
    const voorbeeld = LETTER_EXAMPLES[target];
    return {
      speak: `Welke letter hoor je? ${target}. ${voorbeeld ? `${target} van ${voorbeeld}.` : ""}`,
      prompt: "Welke letter hoor je?",
      input: { type: "choice", options, correctId: target, columns: nOptions, big: true },
    };
  },
};

// --- Kleuren & vormen matchen (opwarmer) ---
export const kleurenVormen = {
  id: "kleuren-vormen",
  title: "Kleuren & vormen",
  icon: "🔷",
  domain: "taal",
  generate(level) {
    const useShape = level >= 2;
    const color = pick(COLORS);
    const shape = pick(SHAPES);
    // opties
    const options = [];
    const correctId = "goed";
    options.push({ id: correctId, shape: shape.id, color: color.hex });
    const distractCount = level >= 3 ? 3 : 2;
    const used = new Set([`${shape.id}|${color.id}`]);
    let guard = 0;
    while (options.length < distractCount + 1 && guard++ < 50) {
      const s = useShape ? pick(SHAPES) : shape;
      const c = pick(COLORS);
      const key = `${s.id}|${c.id}`;
      if (used.has(key)) continue;
      used.add(key);
      options.push({ id: "d" + options.length, shape: s.id, color: c.hex });
    }
    const label = useShape ? `de ${color.name} ${shape.name}` : `de ${color.name} kleur`;
    return {
      speak: `Tik op ${label}.`,
      prompt: `Tik op ${label}`,
      input: { type: "choice", options: shuffle(options), correctId, columns: options.length > 3 ? 2 : options.length },
    };
  },
};

// --- Luister & kies het woord ---
export const luisterWoord = {
  id: "luister-woord",
  title: "Luister & kies",
  icon: "👂",
  domain: "taal",
  generate(level) {
    const list = wordsForLevel(level);
    const target = pick(list);
    const others = sample(list.filter((w) => w.word !== target.word), 3);
    const options = shuffle([target, ...others]).map((w) => ({ id: w.word, label: w.word }));
    return {
      speak: `Welk woord hoor je? ${target.word}.`,
      prompt: "Welk woord hoor je?",
      visual: target.emoji ? { type: "picture", emoji: target.emoji } : undefined,
      input: { type: "choice", options, correctId: target.word, columns: 2, big: true },
    };
  },
};

// --- Spel het woord met lettertegels ---
export const spelWoord = {
  id: "spel-woord",
  title: "Spel het woord",
  icon: "🧩",
  domain: "taal",
  generate(level) {
    const list = wordsForLevel(level);
    const target = pick(list);
    const letters = target.word.split("");
    // extra afleider-letters, meer bij hoger niveau
    const extra = Math.min(6, 1 + level);
    const distractors = sample(LETTERS_ALL.filter((l) => !letters.includes(l)), extra);
    const pool = shuffle([...letters, ...distractors]);
    return {
      speak: `Spel het woord: ${target.word}.`,
      prompt: "Maak het woord",
      visual: target.emoji ? { type: "picture", emoji: target.emoji } : undefined,
      input: { type: "letters", answer: target.word, pool },
    };
  },
};

// --- Woord bij plaatje koppelen ---
export const woordPlaatje = {
  id: "woord-plaatje",
  title: "Woord bij plaatje",
  icon: "🖼️",
  domain: "taal",
  generate(level) {
    const list = wordsForLevel(level).filter((w) => w.emoji);
    const target = pick(list);
    const others = sample(list.filter((w) => w.word !== target.word), 3);
    // richting wisselen: plaatje -> kies woord, of woord -> kies plaatje
    if (Math.random() < 0.5) {
      const options = shuffle([target, ...others]).map((w) => ({ id: w.word, label: w.word }));
      return {
        speak: "Welk woord hoort bij het plaatje?",
        prompt: "Welk woord hoort hierbij?",
        visual: { type: "picture", emoji: target.emoji },
        input: { type: "choice", options, correctId: target.word, columns: 2, big: true },
      };
    } else {
      const options = shuffle([target, ...others]).map((w) => ({ id: w.word, emoji: w.emoji }));
      return {
        speak: `Tik op het plaatje van: ${target.word}.`,
        prompt: `Waar is: ${target.word}?`,
        input: { type: "choice", options, correctId: target.word, columns: 2 },
      };
    }
  },
};

// --- Lastige spelling: kies het goed geschreven woord ---
export const spellingKeuze = {
  id: "spelling-keuze",
  title: "Goed gespeld?",
  icon: "🅰️",
  domain: "taal",
  generate(level) {
    const item = pick(SPELLING_TRICKY);
    // unieke foute varianten, niet gelijk aan het juiste woord
    const uniqueWrong = [...new Set(item.wrong)].filter((w) => w !== item.correct);
    const wrongs = sample(uniqueWrong, Math.min(uniqueWrong.length, level >= 3 ? 3 : 2));
    const opts = wrongs.length ? wrongs : uniqueWrong.slice(0, 1);
    const options = shuffle([item.correct, ...opts]).map((w) => ({ id: w, label: w }));
    return {
      speak: `Welk woord is goed geschreven? ${item.correct}.`,
      prompt: "Welk woord is goed geschreven?",
      input: { type: "choice", options, correctId: item.correct, columns: 1, big: true },
    };
  },
};
