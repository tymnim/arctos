
export const render = Symbol("renderer");

const isSSR = typeof global !== "undefined" && !global.document && !global.window;

async function renderer(...components) {
  for (let i in await Promise.all(components)) {
    const component = components[i] instanceof Function ? components[i]() : components[i];
    this.appendChild(await component);
  }
}

// TODO: SSR option
if (! isSSR) {
  Object.defineProperty(Node.prototype, render, { get() { return renderer.bind(this) } });
}

export const mount = !isSSR ? document.body[render] : undefined;
