import { body, head, html, meta } from "./elements.mjs";

export class Stack {
  #entities = []
  constructor(current = []) {
    this.#entities = current;
  }

  push(doc) {
    this.#entities.push(doc);
    return doc;
  }

  pop(doc) {
    return this.#entities.pop();
  }

  get current() {
    return this.#entities.at(-1);
  }
}

export class Document {
  body = null;
  head = null;
  path = "";
  root = null;
  constructor(path = "") {
    this.body = body({});
    this.head = head({});
    this.path = path;
    this.root = html({ lang: "en" }, [this.head, this.body]);
  }

  toString() {
    return `<!DOCTYPE html>\n${this.root.toString()}`;
  }
}

export const docRegistery = new Stack();
export const pathRegistery = new Stack();

export function mountSSR(renderer) {
  return (...components) => {
    const document = docRegistery.current;
    return renderer.call(document.body, ...components);
  }
}
