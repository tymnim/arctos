import { style } from "./elements.mjs";
import { getDocument } from "./renderer.mjs";

function uid(seed) {
  return seed.toString(36).replace(".", "");
}

function hash(str) {
  let hash = 0,
    i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function splitFirst(str, tokens) {
  for (let i = 0; i < str.length; i++) {
    if (tokens.includes(str[i])) {
      return [str.slice(0, i), str.slice(i)];
    }
  }
  return [str];
}

class CSSRule {
  constructor(selector, body) {
    this.selector = selector;
    this.body = body.split("\n").map(s => s.trim()).join(" ");
  }

  toString() {
    return `${this.selector} { ${this.body} }`;
  }
}

class AtRule {
  static regular = ["@charset", "@import", "@namespace"];

  static nestedSingular = ["@page", "@font-face", "@counter-style", "@property"];

  static nestedPlural = ["@keyframes", "@font-feature-values"];

  static nestedPluralProcessed = ["@media", "@supports", "@document", "@layer"];

  constructor(rule, content) {
    this.rule = rule;
    this.content = content;
  }

  toString() {
    return `${this.rule}${this.content ? `{${this.content}}` : ""}`;
  }
}

class NestedAtRule extends AtRule {
  toString() {
    return `${this.rule}{\n\t${this.content.map(c => c.toString()).join("\n\t")}\n}`;
  }
}

class CSSClassRegistery {
  constructor(seed = Math.random()) {
    this.map = new Map();
    this.seed = seed;
  }

  hash(className) {
    const hashed = this.map.get(className);
    if (hashed) {
      return hashed;
    }

    const newHash = uid(Math.abs(hash(className) * this.seed));
    this.map.set(className, newHash);
    return newHash;
  }

  parse(rawSelector) {
    const selectors = rawSelector.split(",").map(s => s.trim());
    return selectors.map(selector => {
      if (selector.startsWith(".")) {
        return selector.split(".").map(s => {
          if (!s) {
            return s;
          }
          const [klass, options = ""] = splitFirst(s, "#> [:~");
          return `${klass}-${this.hash(klass.replace(".", ""))}${options}`;
        }).join(".");
      }
      return selector;
    }).join(", ");
  }
}

function walk(array, iterator) {
  let current = -1;
  const accumulator = [];
  while (current + 1 < array.length) {
    accumulator.push(iterator(array[current += 1], () => array[current += 1]));
  }
  return accumulator;
}

function processesNestedAtRule(selector, next, processor) {
  const content = [];
  let innerSelector = next();
  while (innerSelector) {
    const block = next();
    const parsedSelector = processor(innerSelector);
    content.push(new CSSRule(parsedSelector, block));
    innerSelector = next();
  }
  return new NestedAtRule(selector, content);
}

function processAtRule(selector, next, registery) {
  const is = arr => arr.find(rule => selector.startsWith(rule));
  if (selector.endsWith(";") || is(AtRule.regular)) {
    return new AtRule(selector);
  }
  if (is(AtRule.nestedSingular)) {
    const content = next();
    return new AtRule(selector, content);
  }
  if (is(AtRule.nestedPlural)) {
    return processesNestedAtRule(selector, next, x => x);
  }
  if (is(AtRule.nestedPluralProcessed)) {
    return processesNestedAtRule(selector, next, registery.parse.bind(registery));
  }
}

function getCSSRuleParser(registery) {
  return (selector, next) => {
    if (selector.startsWith("@")) {
      return processAtRule(selector, next, registery);
    }
    const block = next();
    const parsed = registery.parse(selector);
    return new CSSRule(parsed, block);
  };
}

/**
 * @param {string} css
 */
export function parse(css) {
  const parts = css.split("{");
  let betterParts = parts.map(part => part.split("}").map(part => part.trim())).flat();
  if (!betterParts.at(-1)) {
    betterParts = betterParts.slice(0, -1);
  }
  const registery = new CSSClassRegistery();
  const cssRuleParser = getCSSRuleParser(registery);
  const processedCss = walk(betterParts, cssRuleParser);

  const classRegistery = Array.from(
    registery.map.entries(),
    ([className, hash]) => [parseSelector(className), `${className}-${hash}`]
  )
  .reduce((acc, [name, selector]) => Object.assign(acc, { [name]: selector }), {});

  return { parsed: processedCss, registery: classRegistery };
}

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}

function parseSelector(selector) {
  const identity = x => x;
  const parts = selector.split(/[>\s]/g).filter(identity).map(part => {
    const innerParts = part.split(/[-.]/).filter(identity);
    return innerParts[0] + innerParts.slice(1).map(capitalize).join("");
  });
  return parts;
}

export const cssRegistery = {};

function getStyle(parsed) {
  return style({}, parsed.map(css => css.toString()).join("\n"));
}

/**
 * @param {string} src - url to the file containing css
 */
export function importFromFile(src) {
  // NOTE: relyes on src being absolute
  if (!cssRegistery[src]) {
    return fetch(src)
    .then(res => res.text())
    .then(css => {
      const { parsed, registery } = parse(css);
      getDocument().head.appendChild(getStyle(parsed));
      cssRegistery[src] = registery;
      return registery;
    });
  }
  return Promise.resolve(cssRegistery[src]);
}

/**
 * @param {string[]} strs
 * @param {...string[]} args
 */
export function importCss(strs, ...args) {
  const css = [];
  for (let i = 0; i < strs.length; i++) {
    css.push(strs[i], args[i]);
  }
  const { registery, parsed } = parse(css.join(""));
  getDocument().head.appendChild(getStyle(parsed));
  return registery;
}

