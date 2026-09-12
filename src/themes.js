// Thema's per kind: kleuren, achtergrond-emoji, mascotte-vorm, voorwerpen om te
// tellen en aanmoedig-emoji. Zo voelt de app persoonlijk. Makkelijk uit te breiden.

export const THEMES = {
  // Julian: dino's & superhelden
  dino: {
    id: "dino",
    label: "Dino's & superhelden",
    mascot: "dino",
    colors: {
      primary: "#16A34A", // dinogroen
      accent: "#EF4444", // heldenrood
      bg1: "#DCFCE7",
      bg2: "#DBEAFE",
      card: "#ffffff",
    },
    decor: ["🦖", "🦕", "⚡", "💥", "🌋", "🦸", "🛡️", "🚀"],
    praise: ["Te gek! 🦖", "Superheld! 🦸", "Kaboem! 💥", "Sterk! ⚡", "Yes! 🦕"],
    countables: [
      { emoji: "🦖", one: "dino", many: "dino's" },
      { emoji: "🦕", one: "dino", many: "dino's" },
      { emoji: "🦴", one: "bot", many: "botten" },
      { emoji: "🥚", one: "ei", many: "eieren" },
      { emoji: "🌋", one: "vulkaan", many: "vulkanen" },
      { emoji: "⚡", one: "bliksem", many: "bliksemschichten" },
      { emoji: "🛡️", one: "schild", many: "schilden" },
      { emoji: "🚀", one: "raket", many: "raketten" },
      { emoji: "💥", one: "knal", many: "knallen" },
      { emoji: "⭐", one: "ster", many: "sterren" },
    ],
  },

  // Lieke: eenhoorns & regenbogen
  unicorn: {
    id: "unicorn",
    label: "Eenhoorns & regenbogen",
    mascot: "unicorn",
    colors: {
      primary: "#EC4899",
      accent: "#8B5CF6",
      bg1: "#FCE7F3",
      bg2: "#EDE9FE",
      card: "#ffffff",
    },
    decor: ["🦄", "🌈", "⭐", "🌸", "🦋", "💖", "🍓", "✨"],
    praise: ["Prachtig! 🌈", "Magisch! 🦄", "Super! ⭐", "Mooi zo! 🌸", "Yes! 💖"],
    countables: [
      { emoji: "🦄", one: "eenhoorn", many: "eenhoorns" },
      { emoji: "🌈", one: "regenboog", many: "regenbogen" },
      { emoji: "⭐", one: "ster", many: "sterren" },
      { emoji: "🌸", one: "bloem", many: "bloemen" },
      { emoji: "🦋", one: "vlinder", many: "vlinders" },
      { emoji: "🍓", one: "aardbei", many: "aardbeien" },
      { emoji: "💎", one: "diamant", many: "diamanten" },
      { emoji: "🧁", one: "cupcake", many: "cupcakes" },
      { emoji: "💖", one: "hartje", many: "hartjes" },
    ],
  },

  // Neutraal thema, valt terug als een kind geen thema heeft.
  neutraal: {
    id: "neutraal",
    label: "Sterren",
    mascot: "blob",
    colors: {
      primary: "#7C5CE7",
      accent: "#00B8A9",
      bg1: "#EDE9FE",
      bg2: "#CCFBF1",
      card: "#ffffff",
    },
    decor: ["⭐", "🌟", "✨", "🎈", "🎉"],
    praise: ["Goed zo!", "Knap!", "Super!", "Top!", "Yes!"],
    countables: null, // gebruikt de standaardlijst
  },
};

export function themeFor(themeId) {
  return THEMES[themeId] || THEMES.neutraal;
}

/** Zet de themakleuren als CSS-variabelen en toont achtergrond-decor. */
export function applyTheme(theme) {
  const root = document.documentElement;
  root.style.setProperty("--primary", theme.colors.primary);
  root.style.setProperty("--accent", theme.colors.accent);
  root.style.setProperty("--bg1", theme.colors.bg1);
  root.style.setProperty("--bg2", theme.colors.bg2);
  root.style.setProperty("--card", theme.colors.card);

  let layer = document.getElementById("decor");
  if (!layer) {
    layer = document.createElement("div");
    layer.id = "decor";
    layer.setAttribute("aria-hidden", "true");
    document.body.prepend(layer);
  }
  layer.replaceChildren();
  const emojis = theme.decor || [];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("span");
    s.className = "decor-item";
    s.textContent = emojis[i % emojis.length];
    s.style.left = Math.random() * 96 + "vw";
    s.style.top = Math.random() * 92 + "vh";
    s.style.fontSize = 1.4 + Math.random() * 2.2 + "rem";
    s.style.animationDelay = -Math.random() * 8 + "s";
    s.style.animationDuration = 7 + Math.random() * 8 + "s";
    layer.append(s);
  }
}
