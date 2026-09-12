// Kleine DOM-helpers, zodat we zonder framework overzichtelijk blijven.

/**
 * Maak een element.
 * @param {string} tag
 * @param {Object} [props] - attributen/props. class, text, html, onClick, style, dataset, aria...
 * @param {(Node|string)[]} [children]
 */
export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key === "html") node.innerHTML = value;
    else if (key === "style" && typeof value === "object") Object.assign(node.style, value);
    else if (key === "dataset") Object.assign(node.dataset, value);
    else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === "aria" && typeof value === "object") {
      for (const [a, v] of Object.entries(value)) node.setAttribute("aria-" + a, v);
    } else {
      node.setAttribute(key, value);
    }
  }
  for (const child of [].concat(children)) {
    if (child == null || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

/** Vervang de inhoud van een container. */
export function mount(container, ...nodes) {
  container.replaceChildren(...nodes);
  return container;
}

/** Fisher-Yates shuffle (nieuwe array). */
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Willekeurig geheel getal in [min, max]. */
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Willekeurig element uit een array. */
export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** n verschillende willekeurige elementen. */
export function sample(arr, n) {
  return shuffle(arr).slice(0, n);
}

/** Uniek id. */
let _id = 0;
export function uid(prefix = "id") {
  return `${prefix}${++_id}`;
}
