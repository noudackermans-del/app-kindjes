// Opslag van profielen en voortgang. Alles lokaal (localStorage), per kind gescheiden.

const KEY = "kindjes:v1";

/** Vaste profielen. Pas hier gerust naam/kleur/emoji/thema aan. */
export const PROFILES = [
  { id: "julian", name: "Julian", color: "#22C55E", emoji: "🦖", theme: "dino" },
  { id: "lieke", name: "Lieke", color: "#EC4899", emoji: "🦄", theme: "unicorn" },
];

// Accessoires voor de mascotte, ontgrendeld op puntendrempels.
export const ACCESSORIES = [
  { id: "bow", label: "Strik", points: 40, emoji: "🎀" },
  { id: "hat", label: "Feesthoed", points: 120, emoji: "🎉" },
  { id: "glasses", label: "Bril", points: 250, emoji: "👓" },
  { id: "cape", label: "Cape", points: 450, emoji: "🦸" },
  { id: "crown", label: "Kroon", points: 700, emoji: "👑" },
];

const POINTS_PER_LEVEL = 100;

function emptyChild() {
  return {
    points: 0,
    correct: 0, // totaal aantal goede antwoorden (sterren)
    sessions: 0,
    streak: { count: 0, lastDate: null },
    modules: {}, // moduleId -> { level, best }
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultData();
    const data = JSON.parse(raw);
    // Zorg dat beide profielen bestaan (bij toekomstige uitbreiding).
    for (const p of PROFILES) if (!data.children[p.id]) data.children[p.id] = emptyChild();
    if (typeof data.sound !== "boolean") data.sound = true;
    return data;
  } catch {
    return defaultData();
  }
}

function defaultData() {
  const children = {};
  for (const p of PROFILES) children[p.id] = emptyChild();
  return { sound: true, children };
}

let data = load();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* opslag kan vol/uit staan; app blijft werken zonder bewaren */
  }
}

export function getChild(childId) {
  if (!data.children[childId]) data.children[childId] = emptyChild();
  return data.children[childId];
}

export function getProfile(childId) {
  return PROFILES.find((p) => p.id === childId);
}

/** Niveau van een module voor een kind (start op startLevel, standaard 1). */
export function getModuleLevel(childId, moduleId, startLevel = 1) {
  const m = getChild(childId).modules[moduleId];
  return m ? m.level : startLevel;
}

/**
 * Zet startniveaus voor modules die dit kind nog nooit gedaan heeft.
 * Zo begint een ouder kind niet bij de allereenvoudigste oefening.
 * @param {string} childId
 * @param {Record<string, number>} seedMap - moduleId -> startniveau
 */
export function ensureModuleLevels(childId, seedMap) {
  const child = getChild(childId);
  let changed = false;
  for (const [moduleId, level] of Object.entries(seedMap)) {
    if (!child.modules[moduleId]) {
      child.modules[moduleId] = { level, best: 0 };
      changed = true;
    }
  }
  if (changed) save();
}

/** Huidige mascotte-level op basis van punten. */
export function getLevel(childId) {
  return Math.floor(getChild(childId).points / POINTS_PER_LEVEL) + 1;
}

/** Voortgang binnen huidig level (0..1) voor een voortgangsbalk. */
export function getLevelProgress(childId) {
  return (getChild(childId).points % POINTS_PER_LEVEL) / POINTS_PER_LEVEL;
}

/** Ontgrendelde accessoires (op basis van punten). */
export function getAccessories(childId) {
  const pts = getChild(childId).points;
  return ACCESSORIES.filter((a) => pts >= a.points).map((a) => a.id);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Verwerk het resultaat van een sessie.
 * @returns {Object} samenvatting met o.a. gained points, oldLevel, newLevel, newAccessories, streak
 */
export function recordSession(childId, moduleId, { correctFirstTry, total }) {
  const child = getChild(childId);
  const before = {
    points: child.points,
    level: getLevel(childId),
    accessories: getAccessories(childId),
  };

  const gained = correctFirstTry * 10;
  child.points += gained;
  child.correct += correctFirstTry;
  child.sessions += 1;

  // Niveau van de module aanpassen op basis van score.
  const mod = child.modules[moduleId] || { level: 1, best: 0 };
  const ratio = total > 0 ? correctFirstTry / total : 0;
  if (ratio >= 0.8) mod.level = Math.min(5, mod.level + 1);
  else if (ratio < 0.4) mod.level = Math.max(1, mod.level - 1);
  mod.best = Math.max(mod.best, correctFirstTry);
  child.modules[moduleId] = mod;

  // Dagstreak bijwerken.
  const today = todayStr();
  const last = child.streak.lastDate;
  if (last !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    child.streak.count = last === yesterday ? child.streak.count + 1 : 1;
    child.streak.lastDate = today;
  }

  save();

  const after = {
    level: getLevel(childId),
    accessories: getAccessories(childId),
  };
  const newAccessories = after.accessories.filter((a) => !before.accessories.includes(a));

  return {
    gained,
    correctFirstTry,
    total,
    oldLevel: before.level,
    newLevel: after.level,
    leveledUp: after.level > before.level,
    newAccessories,
    streak: child.streak.count,
    moduleLevel: mod.level,
  };
}

// Geluid aan/uit.
export function getSound() {
  return data.sound !== false;
}
export function setSound(on) {
  data.sound = !!on;
  save();
}
