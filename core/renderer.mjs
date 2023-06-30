
import { normalize } from "./utils.mjs";
import { Node } from "./createElement.mjs";
import { mountSSR as ssr, docRegistery } from "./static.mjs";

export const render = Symbol("renderer");

export const isSSR = typeof global !== "undefined" && !global.document && !global.window;

async function renderer(...components) {
  for (let component of components) {
    // const c = component instanceof Promise ? await component : component;
    const elements = await (component instanceof Function ? component() : component);
    (await Promise.all(normalize(elements))).forEach(element => this.appendChild(element))
  }
}
// TODO: SSR option
// if (! isSSR) {
Object.defineProperty(Node.prototype, render, { get() { return renderer.bind(this) } });
// }

export function getDocument() {
  if (isSSR) {
    return docRegistery.current;
  }
  return document;
}

// TODO: body creating and parsing from html
export const mount = !isSSR ? document.body[render] : undefined;
export const mountSSR = ssr(renderer);
