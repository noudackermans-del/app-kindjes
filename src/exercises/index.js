// Register van alle modules + welk kind wat kan doen en wanneer iets vrijkomt.
// De app groeit mee: geavanceerde modules openen pas als de basis goed zit.

import { getModuleLevel, getLevel } from "../state.js";
import * as R from "./rekenen.js";
import * as T from "./taal.js";

// Alle modules op een rij (makkelijk uit te breiden).
export const MODULES = {
  tellen: R.tellen,
  cijfers: R.cijfers,
  "optellen-visueel": R.optellenVisueel,
  "sommen-invullen": R.sommenInvullen,
  tafels: R.tafels,
  delen: R.delen,
  klok: R.klok,
  letters: T.letters,
  "kleuren-vormen": T.kleurenVormen,
  "luister-woord": T.luisterWoord,
  "spel-woord": T.spelWoord,
  "woord-plaatje": T.woordPlaatje,
  "spelling-keuze": T.spellingKeuze,
};

// Ontgrendelregels. always = altijd zichtbaar.
// prereq = open als een andere module dit niveau haalt.
// mascot = open bij dit mascotte-level.
const UNLOCK = {
  tellen: { type: "always" },
  cijfers: { type: "always" },
  letters: { type: "always" },
  "kleuren-vormen": { type: "always" },
  "optellen-visueel": { type: "always" },
  "sommen-invullen": { type: "always" },
  "luister-woord": { type: "always" },
  "spel-woord": { type: "always" },
  "woord-plaatje": { type: "always" },
  tafels: { type: "prereq", module: "sommen-invullen", level: 3, hint: "Oefen eerst Sommen invullen" },
  delen: { type: "prereq", module: "tafels", level: 3, hint: "Oefen eerst de Tafels" },
  klok: { type: "mascot", level: 3, hint: "Speel nog wat om de klok te openen" },
  "spelling-keuze": { type: "prereq", module: "spel-woord", level: 3, hint: "Oefen eerst Spel het woord" },
};

/**
 * Curriculum per kind: volgorde van modules + startniveau.
 * Beide kinderen kunnen dezelfde ladder op; Lieke begint een stapje hoger.
 * Voeg hier gerust modules toe of pas startniveaus aan.
 */
export const CURRICULUM = {
  julian: {
    order: [
      "tellen", "cijfers", "letters", "kleuren-vormen",
      "optellen-visueel", "luister-woord", "spel-woord", "woord-plaatje",
      "sommen-invullen", "klok", "tafels", "delen", "spelling-keuze",
    ],
    start: {
      tellen: 1, cijfers: 1, letters: 1, "kleuren-vormen": 1,
      "optellen-visueel": 1, "luister-woord": 1, "spel-woord": 1, "woord-plaatje": 1,
    },
  },
  lieke: {
    order: [
      "optellen-visueel", "sommen-invullen", "luister-woord", "spel-woord",
      "woord-plaatje", "tellen", "cijfers", "letters",
      "klok", "tafels", "delen", "spelling-keuze", "kleuren-vormen",
    ],
    start: {
      tellen: 3, cijfers: 3, letters: 2, "kleuren-vormen": 2,
      "optellen-visueel": 2, "sommen-invullen": 2, "luister-woord": 2,
      "spel-woord": 2, "woord-plaatje": 2,
    },
  },
};

/** Startniveaus voor een kind (om via state.ensureModuleLevels te seeden). */
export function seedFor(childId) {
  return CURRICULUM[childId]?.start || {};
}

/**
 * Is een module vrij voor dit kind? Retourneert { unlocked, hint }.
 */
export function unlockState(childId, moduleId) {
  const rule = UNLOCK[moduleId] || { type: "always" };
  if (rule.type === "always") return { unlocked: true };
  if (rule.type === "mascot") {
    return { unlocked: getLevel(childId) >= rule.level, hint: rule.hint };
  }
  if (rule.type === "prereq") {
    const start = seedFor(childId)[rule.module] || 1;
    return { unlocked: getModuleLevel(childId, rule.module, start) >= rule.level, hint: rule.hint };
  }
  return { unlocked: true };
}

/** Lijst met modules voor het startscherm van een kind, met status. */
export function modulesForChild(childId) {
  const cur = CURRICULUM[childId] || CURRICULUM.julian;
  return cur.order
    .filter((id) => MODULES[id])
    .map((id) => {
      const mod = MODULES[id];
      const start = cur.start[id] || 1;
      const level = getModuleLevel(childId, id, start);
      const { unlocked, hint } = unlockState(childId, id);
      return { ...mod, level, unlocked, hint };
    });
}
