// Audio: voorlezen (Web Speech API, Nederlands) en korte feedbackgeluidjes (WebAudio).
// Geen audiobestanden nodig, dus alles werkt offline.

import { getSound, setSound } from "./state.js";

let dutchVoice = null;

function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  // Kies bij voorkeur een Nederlandse stem.
  dutchVoice =
    voices.find((v) => /nl[-_]NL/i.test(v.lang)) ||
    voices.find((v) => /^nl/i.test(v.lang)) ||
    null;
}

if ("speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

/** Lees tekst voor in het Nederlands. */
export function speak(text, { rate = 0.95, pitch = 1.05, onEnd } = {}) {
  if (!getSound()) {
    if (onEnd) onEnd();
    return;
  }
  if (!("speechSynthesis" in window)) {
    if (onEnd) onEnd();
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "nl-NL";
  if (dutchVoice) u.voice = dutchVoice;
  u.rate = rate;
  u.pitch = pitch;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
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
