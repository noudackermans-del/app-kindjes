// De oefensessie: een reeks vraagjes met directe feedback (geluid + animatie).

import { el, mount, pick } from "./ui.js";
import { renderVisual, renderInput, isCorrect } from "./render.js";
import { speak, stopSpeaking, playCorrect, playWrong, getSound, setSound } from "./audio.js";

const QUESTIONS_PER_SESSION = 8;

const DEFAULT_PRAISE = ["Goed zo!", "Knap gedaan!", "Yes!", "Super!", "Top!", "Hoera!"];
const NUDGE = ["Bijna!", "Probeer nog eens.", "Oeps, nog een keer.", "Net niet!"];

/**
 * @param {Object} opts
 * @param {HTMLElement} opts.container
 * @param {Object} opts.module - module met generate(level)
 * @param {number} opts.level
 * @param {Function} opts.onFinish - ({correctFirstTry, total}) => void
 * @param {Function} opts.onExit - () => void
 */
export function runSession({ container, module, level, theme, onFinish, onExit }) {
  let index = 0;
  let correctFirstTry = 0;
  const total = QUESTIONS_PER_SESSION;
  const PRAISE = (theme && theme.praise) || DEFAULT_PRAISE;
  const ctx = { theme };

  // Kop met terugknop, voortgangsstippen, geluid- en herhaalknop.
  const dots = el("div", { class: "dots" });
  const soundBtn = el("button", {
    class: "icon-btn",
    type: "button",
    text: getSound() ? "🔊" : "🔇",
    aria: { label: "geluid aan of uit" },
    onClick: () => {
      setSound(!getSound());
      soundBtn.textContent = getSound() ? "🔊" : "🔇";
      if (!getSound()) stopSpeaking();
    },
  });
  const replayBtn = el("button", {
    class: "icon-btn",
    type: "button",
    text: "🔁",
    aria: { label: "nog eens voorlezen" },
    onClick: () => current && speak(current.speak),
  });
  const backBtn = el("button", {
    class: "icon-btn",
    type: "button",
    text: "←",
    aria: { label: "terug" },
    onClick: () => { stopSpeaking(); onExit(); },
  });
  const header = el("div", { class: "session-header" }, [
    backBtn,
    dots,
    el("div", { class: "header-right" }, [replayBtn, soundBtn]),
  ]);

  const card = el("div", { class: "card" });
  const banner = el("div", { class: "feedback-banner", "aria-live": "polite" });
  const wrap = el("div", { class: "session" }, [header, card, banner]);
  mount(container, wrap);

  let current = null;

  function renderDots() {
    dots.replaceChildren();
    for (let i = 0; i < total; i++) {
      dots.append(el("span", { class: "dot" + (i < index ? " done" : i === index ? " active" : "") }));
    }
  }

  function flash(text, cls) {
    banner.textContent = text;
    banner.className = "feedback-banner show " + cls;
    setTimeout(() => (banner.className = "feedback-banner"), 900);
  }

  function nextQuestion() {
    if (index >= total) {
      stopSpeaking();
      onFinish({ correctFirstTry, total });
      return;
    }
    renderDots();
    current = module.generate(level, ctx);
    if (window.__TEST__) window.__CURRENT__ = current; // alleen voor geautomatiseerde tests
    let firstTry = true;
    let tries = 0;
    let done = false;

    const ctrl = renderInput(current.input, {
      onSubmit: (response) => {
        if (done) return;
        if (isCorrect(current, response)) {
          done = true;
          ctrl.solve();
          playCorrect();
          const praise = pick(PRAISE);
          speak(praise);
          flash(praise, "good");
          if (firstTry) correctFirstTry++;
          card.classList.add("celebrate");
          setTimeout(() => { card.classList.remove("celebrate"); index++; nextQuestion(); }, 1150);
        } else {
          firstTry = false;
          tries++;
          ctrl.markWrong(response);
          playWrong();
          if (tries >= 2) {
            done = true;
            ctrl.solve();
            flash("Kijk, zo! 👇", "reveal");
            speak("Kijk, zo!");
            setTimeout(() => { index++; nextQuestion(); }, 1700);
          } else {
            flash(pick(NUDGE), "bad");
            speak(pick(NUDGE));
          }
        }
      },
    });

    const promptEl = el("h2", { class: "prompt", text: current.prompt });
    const visual = renderVisual(current.visual);
    const parts = [promptEl];
    if (visual) parts.push(el("div", { class: "visual" }, [visual]));
    parts.push(el("div", { class: "answer" }, [ctrl.node]));
    mount(card, ...parts);

    // Automatisch voorlezen bij een nieuwe vraag.
    speak(current.speak);
  }

  nextQuestion();
}
