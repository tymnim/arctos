
import { normalize } from "./utils.mjs";

export const render = Symbol("renderer");

const isSSR = typeof global !== "undefined" && !global.document && !global.window;

async function renderer(...components) {
  for (let component of components) {
    const c = component instanceof Promise ? await component : component;
    const elements = await (component instanceof Function ? component() : component);
    (await Promise.all(normalize(elements))).forEach(element => this.appendChild(element))
  }
}
// TODO: SSR option
if (! isSSR) {
  Object.defineProperty(Node.prototype, render, { get() { return renderer.bind(this) } });
}

// TODO: body creating and parsing from html
export const mount = !isSSR ? document.body[render] : undefined;
