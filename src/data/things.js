// Voorwerpen om te tellen, en kleuren/vormen voor de matchoefening.

// Telbare voorwerpen (emoji + enkelvoud/meervoud voor het voorlezen).
export const COUNTABLES = [
  { emoji: "🍎", one: "appel", many: "appels" },
  { emoji: "⭐", one: "ster", many: "sterren" },
  { emoji: "🐟", one: "visje", many: "visjes" },
  { emoji: "🚗", one: "auto", many: "auto's" },
  { emoji: "🌸", one: "bloem", many: "bloemen" },
  { emoji: "🎈", one: "ballon", many: "ballonnen" },
  { emoji: "🐝", one: "bij", many: "bijen" },
  { emoji: "🍓", one: "aardbei", many: "aardbeien" },
  { emoji: "🦋", one: "vlinder", many: "vlinders" },
  { emoji: "🐸", one: "kikker", many: "kikkers" },
  { emoji: "🍪", one: "koekje", many: "koekjes" },
  { emoji: "🎁", one: "cadeau", many: "cadeautjes" },
];

// Kleuren met naam en hexwaarde.
export const COLORS = [
  { id: "rood", name: "rode", hex: "#EF4444" },
  { id: "blauw", name: "blauwe", hex: "#3B82F6" },
  { id: "geel", name: "gele", hex: "#F59E0B" },
  { id: "groen", name: "groene", hex: "#22C55E" },
  { id: "paars", name: "paarse", hex: "#8B5CF6" },
  { id: "oranje", name: "oranje", hex: "#FB923C" },
];

// Vormen (worden als SVG getekend).
export const SHAPES = [
  { id: "cirkel", name: "cirkel" },
  { id: "vierkant", name: "vierkant" },
  { id: "driehoek", name: "driehoek" },
  { id: "ster", name: "ster" },
  { id: "hart", name: "hart" },
];

/** SVG-pad/vorm voor een gegeven vorm-id, gevuld met kleur. Viewbox 0 0 100 100. */
export function shapeSVG(shapeId, color) {
  const inner = {
    cirkel: `<circle cx="50" cy="50" r="42" fill="${color}"/>`,
    vierkant: `<rect x="12" y="12" width="76" height="76" rx="10" fill="${color}"/>`,
    driehoek: `<polygon points="50,10 90,88 10,88" fill="${color}"/>`,
    ster: `<polygon points="50,6 61,38 95,38 67,58 78,90 50,70 22,90 33,58 5,38 39,38" fill="${color}"/>`,
    hart: `<path d="M50 86 C 12 58, 16 20, 40 20 C 50 20, 50 30, 50 30 C 50 30, 50 20, 60 20 C 84 20, 88 58, 50 86 Z" fill="${color}"/>`,
  }[shapeId];
  return `<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">${inner}</svg>`;
}
