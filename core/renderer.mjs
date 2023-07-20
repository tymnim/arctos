
import { normalize } from "./utils.mjs";
import { Node } from "./createElement.mjs";
import { getDocument as getDocumentSSR } from "./static.mjs";

export const render = Symbol("renderer");

export const isSSR = typeof global !== "undefined" && !global.document && !global.window;

async function renderer(...components) {
  for (let component of components) {
    const elements = await (component instanceof Function ? component() : component);
    (await Promise.all(normalize(elements))).forEach(element => this.appendChild(element))
  }
}

Object.defineProperty(Node.prototype, render, { get() { return renderer.bind(this) } });

export function getDocument() {
  if (isSSR) {
    return getDocumentSSR();
  }
  return document;
}

// TODO: body creating and parsing from html
export const mount = !isSSR ? document.body[render] : undefined;

