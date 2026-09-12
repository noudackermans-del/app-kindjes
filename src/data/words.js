// Klankzuivere woordjes (3-4 letters) met een bijpassend plaatje (emoji).
// Klankzuiver = geschreven zoals je het hoort. Uitbreiden mag: voeg gewoon toe.

export const WORDS = [
  { word: "maan", emoji: "🌙" },
  { word: "vis", emoji: "🐟" },
  { word: "bal", emoji: "⚽" },
  { word: "zon", emoji: "☀️" },
  { word: "kat", emoji: "🐱" },
  { word: "boom", emoji: "🌳" },
  { word: "huis", emoji: "🏠" },
  { word: "roos", emoji: "🌹" },
  { word: "muis", emoji: "🐭" },
  { word: "boot", emoji: "⛵" },
  { word: "neus", emoji: "👃" },
  { word: "koe", emoji: "🐮" },
  { word: "kip", emoji: "🐔" },
  { word: "pen", emoji: "🖊️" },
  { word: "jas", emoji: "🧥" },
  { word: "sok", emoji: "🧦" },
  { word: "pet", emoji: "🧢" },
  { word: "tas", emoji: "👜" },
  { word: "bel", emoji: "🔔" },
  { word: "vuur", emoji: "🔥" },
  { word: "boek", emoji: "📖" },
  { word: "hoed", emoji: "👒" },
  { word: "ster", emoji: "⭐" },
  { word: "sap", emoji: "🧃" },
  { word: "bril", emoji: "👓" },
  { word: "slak", emoji: "🐌" },
  { word: "hart", emoji: "❤️" },
];

// Tier 1 = de klankzuivere woordjes hierboven (3-4 letters, groep 2-3).
export const WORDS_T1 = WORDS;

// Tier 2 = iets langere woorden (groep 4), meestal nog met plaatje.
export const WORDS_T2 = [
  { word: "appel", emoji: "🍏" },
  { word: "bloem", emoji: "🌷" },
  { word: "stoel", emoji: "🪑" },
  { word: "trein", emoji: "🚂" },
  { word: "wolk", emoji: "☁️" },
  { word: "paard", emoji: "🐴" },
  { word: "schaap", emoji: "🐑" },
  { word: "sleutel", emoji: "🔑" },
  { word: "kikker", emoji: "🐸" },
  { word: "spin", emoji: "🕷️" },
  { word: "klok", emoji: "🕐" },
  { word: "ballon", emoji: "🎈" },
  { word: "banaan", emoji: "🍌" },
  { word: "raket", emoji: "🚀" },
  { word: "vlinder", emoji: "🦋" },
  { word: "worst", emoji: "🌭" },
];

// Tier 3 = langere/lastigere woorden (groep 5-6), plaatje optioneel.
export const WORDS_T3 = [
  { word: "olifant", emoji: "🐘" },
  { word: "krokodil", emoji: "🐊" },
  { word: "vulkaan", emoji: "🌋" },
  { word: "regenboog", emoji: "🌈" },
  { word: "kasteel", emoji: "🏰" },
  { word: "pinguïn", emoji: "🐧" },
  { word: "dinosaurus", emoji: "🦕" },
  { word: "fabriek", emoji: "🏭" },
  { word: "computer", emoji: "💻" },
  { word: "telefoon", emoji: "📱" },
  { word: "gitaar", emoji: "🎸" },
  { word: "paraplu", emoji: "☂️" },
];

// Lastige spelling (groep 5-6): kies het goed geschreven woord.
// Elke rij: het juiste woord + veelgemaakte foute varianten.
export const SPELLING_TRICKY = [
  { correct: "trein", wrong: ["trijn"] },
  { correct: "ijs", wrong: ["eis"] },
  { correct: "reis", wrong: ["rijs"] },
  { correct: "fijn", wrong: ["fein"] },
  { correct: "blauw", wrong: ["blouw"] },
  { correct: "vrouw", wrong: ["vrauw"] },
  { correct: "koud", wrong: ["kouwd", "kout"] },
  { correct: "hond", wrong: ["hont"] },
  { correct: "hand", wrong: ["hant"] },
  { correct: "bord", wrong: ["bort"] },
  { correct: "held", wrong: ["helt"] },
  { correct: "eend", wrong: ["eent"] },
  { correct: "bomen", wrong: ["boomen"] },
  { correct: "wielen", wrong: ["wiellen"] },
  { correct: "lopen", wrong: ["loopen"] },
  { correct: "meisje", wrong: ["meissje", "meisie"] },
  { correct: "nieuw", wrong: ["niew", "nieew"] },
  { correct: "schaats", wrong: ["schaadts", "schats"] },
];

// Losse letters voor letterherkenning (kleine letters, veelvoorkomend eerst).
export const LETTERS_EASY = "mksbtprnaeiou".split("");
export const LETTERS_ALL = "abcdefghijklmnopqrstuvwxyz".split("");

// Voorbeeldwoord per letter, om de klank te koppelen ("m van maan").
export const LETTER_EXAMPLES = {
  a: "aap", b: "bal", c: "citroen", d: "das", e: "eend", f: "fiets",
  g: "geit", h: "huis", i: "ijs", j: "jas", k: "kat", l: "lamp",
  m: "maan", n: "neus", o: "oog", p: "pen", q: "quiz", r: "roos",
  s: "sok", t: "tas", u: "uil", v: "vis", w: "wolk", x: "xylofoon",
  y: "yoghurt", z: "zon",
};
