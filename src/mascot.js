// De beloningsmascotte: een vrolijk wezentje dat groeit en accessoires krijgt.
// Volledig als SVG getekend, dus geen plaatjes nodig.

/**
 * @param {Object} opts
 * @param {string} opts.color - hoofdkleur
 * @param {number} opts.level - 1..n, bepaalt de grootte
 * @param {string[]} opts.accessories - ontgrendelde accessoire-ids
 * @param {string} opts.variant - 'blob' | 'dino' | 'unicorn'
 */
export function mascotSVG({ color = "#8B5CF6", level = 1, accessories = [], variant = "blob" }) {
  const has = (id) => accessories.includes(id);
  const scale = Math.min(1.15, 0.62 + (level - 1) * 0.06);

  const cape = has("cape")
    ? `<path d="M55 95 C 30 120, 30 180, 45 195 L 100 175 L 155 195 C 170 180, 170 120, 145 95 Z"
         fill="#E11D48" opacity="0.92"/>
       <path d="M55 95 C 30 120, 30 180, 45 195 L 100 175 Z" fill="#BE123C" opacity="0.5"/>`
    : "";

  // Vorm-specifieke onderdelen (spikes voor dino, hoorn/manen voor eenhoorn).
  let features = "";
  if (variant === "dino") {
    features = `
      <polygon points="100,44 108,60 92,60" fill="#15803d"/>
      <polygon points="118,52 126,70 108,70" fill="#15803d"/>
      <polygon points="82,52 92,70 74,70" fill="#15803d"/>
      <ellipse cx="100" cy="150" rx="26" ry="14" fill="#ffffff" opacity="0.35"/>`;
  } else if (variant === "unicorn") {
    features = `
      <polygon points="100,40 106,70 94,70" fill="#facc15" stroke="#eab308" stroke-width="1.5"/>
      <path d="M78 66 q -18 -6 -26 10" stroke="#a78bfa" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M122 66 q 18 -6 26 10" stroke="#a78bfa" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  }

  const body = `
    ${features}
    <ellipse cx="100" cy="122" rx="62" ry="66" fill="${color}"/>
    <ellipse cx="100" cy="135" rx="40" ry="44" fill="#ffffff" opacity="0.28"/>
    <ellipse cx="66" cy="184" rx="18" ry="12" fill="${color}"/>
    <ellipse cx="134" cy="184" rx="18" ry="12" fill="${color}"/>
    <ellipse cx="44" cy="128" rx="12" ry="20" fill="${color}"/>
    <ellipse cx="156" cy="128" rx="12" ry="20" fill="${color}"/>
    <!-- ogen -->
    <circle cx="82" cy="112" r="16" fill="#fff"/>
    <circle cx="118" cy="112" r="16" fill="#fff"/>
    <circle cx="85" cy="115" r="7" fill="#1f2937"/>
    <circle cx="121" cy="115" r="7" fill="#1f2937"/>
    <circle cx="88" cy="112" r="2.5" fill="#fff"/>
    <circle cx="124" cy="112" r="2.5" fill="#fff"/>
    <!-- wangen -->
    <circle cx="64" cy="132" r="9" fill="#fb7185" opacity="0.6"/>
    <circle cx="136" cy="132" r="9" fill="#fb7185" opacity="0.6"/>
    <!-- lach -->
    <path d="M84 140 Q 100 156 116 140" stroke="#1f2937" stroke-width="4"
      fill="none" stroke-linecap="round"/>
  `;

  const glasses = has("glasses")
    ? `<g stroke="#1f2937" stroke-width="3" fill="none">
         <circle cx="82" cy="112" r="18"/>
         <circle cx="118" cy="112" r="18"/>
         <line x1="100" y1="112" x2="100" y2="112"/>
         <path d="M100 110 q 0 -2 0 0"/>
         <line x1="99" y1="110" x2="101" y2="110"/>
       </g>`
    : "";

  const bow = has("bow")
    ? `<g transform="translate(52,58)">
         <polygon points="0,0 20,-12 20,12" fill="#f472b6"/>
         <polygon points="40,0 20,-12 20,12" fill="#f472b6"/>
         <circle cx="20" cy="0" r="7" fill="#db2777"/>
       </g>`
    : "";

  const hat = has("hat")
    ? `<g transform="translate(100,52)">
         <polygon points="0,-40 -24,8 24,8" fill="#22c55e"/>
         <polygon points="0,-40 -24,8 0,8" fill="#16a34a"/>
         <circle cx="0" cy="-40" r="6" fill="#f59e0b"/>
         <circle cx="-10" cy="-8" r="4" fill="#fff"/>
         <circle cx="8" cy="-20" r="4" fill="#fde047"/>
       </g>`
    : "";

  const crown = has("crown")
    ? `<g transform="translate(100,${has("hat") ? 6 : 50})">
         <polygon points="-30,10 -30,-14 -16,2 0,-22 16,2 30,-14 30,10"
           fill="#facc15" stroke="#eab308" stroke-width="2"/>
         <circle cx="0" cy="-22" r="4" fill="#ef4444"/>
         <circle cx="-30" cy="-14" r="3.5" fill="#3b82f6"/>
         <circle cx="30" cy="-14" r="3.5" fill="#3b82f6"/>
       </g>`
    : "";

  return `
    <svg viewBox="0 0 200 210" width="100%" height="100%" role="img" aria-label="mascotte">
      <g transform="translate(100,120) scale(${scale.toFixed(3)}) translate(-100,-120)">
        ${cape}
        ${body}
        ${glasses}
        ${bow}
        ${hat}
        ${crown}
      </g>
    </svg>`;
}
