
export const cssRegistery = {};

function uid(seed) {
  return seed.toString(36).substring(2);
}

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}

export function parse(css) {
  const parts = css.split("{");
  const betterParts = parts.map(part => part.split("}").map(part => part.trim())).flat();
  const registery = {};
  const parsed = {}
  for (let i = 0; i < betterParts.length -1; i += 2) {
    // i === selector
    const selector = betterParts[i];
    const properties = betterParts[i + 1];
    const parsedSelector = parseSelector(selector);
    const uniqId = parsedSelector.concat(uid(Math.random())).join("-");
    parsed[uniqId] = properties;
    combine(registery, parsedSelector, uniqId);
  }

  return { parsed, registery };
}

function combine(acc, selector, uniqId) {
  let current = acc;
  let previous = {};
  for (let part of selector) {
    if (!current[part]) {
      current[part] = {};
    }
    previous = current;
    current = current[part];
  }
  const last = selector[selector.length - 1];
  previous[last] = Object.assign(String(uniqId), previous[last]);
  return acc;
}

function parseSelector(selector) {
  const identity = x => x
  const parts = selector.split(/[>\s]/g).filter(identity).map(part => {
    const innerParts = part.split(/[-.]/).filter(identity);
    return innerParts[0] + innerParts.slice(1).map(capitalize).join("");
  });
  return parts;
}

function getStyle(parsed) {
  let css = "";
  for (let [selector, properties] of Object.entries(parsed)) {
    css += ` .${selector} { ${properties} }`;
  }
  const style = document.createElement("style");
  style.textContent = css;
  return style;
}

export function use(src) {
  // NOTE: relyes on src being absolute
  if (!cssRegistery[src]) {
    return fetch(src)
    .then(res => res.text())
    .then(css => {
      const { parsed, registery } = parse(css);
      document.head.appendChild(getStyle(parsed));
      cssRegistery[src] = registery;
      return registery;
    });
  }
  return Promise.resolve(cssRegistery[src]);
}