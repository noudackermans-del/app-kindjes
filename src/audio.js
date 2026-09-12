// Audio: voorlezen (Web Speech API, Nederlands) en korte feedbackgeluidjes (WebAudio).
// Geen audiobestanden nodig, dus alles werkt offline.

import { getSound, setSound } from "./state.js";

let dutchVoice = null;

// Rustige, kindvriendelijke instellingen.
const RATE = 0.78; // langzaam praten
const WORD_RATE = 0.6; // losse woorden/letters nóg langzamer
const PITCH = 1.2; // wat hoger = vriendelijker
const GAP = 420; // pauze (ms) tussen zinsdelen, zodat woorden niet op elkaar plakken

function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  const nl = voices.filter((v) => /^nl/i.test(v.lang));
  // Kies bij voorkeur een natuurlijke, vriendelijke (vaak vrouwelijke) NL-stem.
  const liked = /(google|ellen|lotte|femke|claire|saskia|xander|fenna|colette)/i;
  dutchVoice =
    nl.find((v) => /nl[-_]NL/i.test(v.lang) && liked.test(v.name)) ||
    nl.find((v) => liked.test(v.name)) ||
    nl.find((v) => /nl[-_]NL/i.test(v.lang)) ||
    nl[0] ||
    null;
}

if ("speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

// Volgnummer zodat een nieuwe speak() een lopende voorleesreeks netjes stopt.
let speakSeq = 0;

// Splits tekst in korte stukjes (op .!? of een nieuwe regel of |), zodat we
// tussen elk stukje een duidelijke pauze kunnen laten.
// Emoji en symbolen weghalen, die willen we niet láten uitspreken.
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu;

function splitParts(text) {
  return String(text)
    .split(/(?<=[.!?])\s+|\n+|\|/)
    .map((s) => s.replace(EMOJI, "").trim())
    .filter(Boolean);
}

/** Lees tekst rustig voor in het Nederlands, met pauzes tussen de zinsdelen. */
export function speak(text, { onEnd } = {}) {
  const mySeq = ++speakSeq;
  if (!getSound() || !("speechSynthesis" in window)) {
    if (onEnd) onEnd();
    return;
  }
  window.speechSynthesis.cancel();
  const parts = splitParts(text);
  let i = 0;

  const next = () => {
    if (mySeq !== speakSeq) return; // een nieuwere speak() heeft het overgenomen
    if (i >= parts.length) {
      if (onEnd) onEnd();
      return;
    }
    const part = parts[i++];
    const u = new SpeechSynthesisUtterance(part);
    u.lang = "nl-NL";
    if (dutchVoice) u.voice = dutchVoice;
    // Losse woorden of een enkele letter extra langzaam uitspreken.
    const words = part.replace(/[.!?]/g, "").trim().split(/\s+/);
    u.rate = words.length <= 2 ? WORD_RATE : RATE;
    u.pitch = PITCH;
    const cont = () => {
      if (mySeq === speakSeq) setTimeout(() => next(), GAP);
    };
    u.onend = cont;
    u.onerror = cont;
    window.speechSynthesis.speak(u);
  };

  next();
}

export function stopSpeaking() {
  speakSeq++; // stopt ook een lopende voorleesreeks tussen de pauzes
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

// ---- Feedbackgeluidjes via WebAudio ----
let ctx = null;
function audioCtx() {
  if (!getSound()) return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq, start, dur, type = "sine", gain = 0.18) {
  const ac = audioCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = ac.currentTime + start;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

/** Vrolijk stijgend deuntje bij goed antwoord. */
export function playCorrect() {
  tone(523.25, 0, 0.14, "triangle"); // C5
  tone(659.25, 0.12, 0.14, "triangle"); // E5
  tone(783.99, 0.24, 0.22, "triangle"); // G5
}

/** Zacht "boop" bij fout, niet ontmoedigend. */
export function playWrong() {
  tone(311.13, 0, 0.16, "sine", 0.14);
  tone(233.08, 0.14, 0.22, "sine", 0.14);
}

/** Fanfare bij einde van een sessie. */
export function playFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => tone(f, i * 0.14, 0.3, "triangle", 0.16));
}

export { getSound, setSound };
