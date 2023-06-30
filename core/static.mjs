import { body, head, html, meta, script } from "./elements.mjs";
import { atom } from "atomi";

const DEFAULT_IMPORT_MAP = { "atomi": "/node_modules/atomi/index.mjs", "arctos": "/node_modules/arctos/index.mjs" };

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
  #importmap = {};
  body = null;
  head = null;
  path = "";
  root = null;
  setImports() {}
  constructor(path = "") {
    this.body = body({});
    // TODO: default meta tags
    this.path = path;

    this.#importmap = script({ type: "importmap" }, JSON.stringify({ imports: DEFAULT_IMPORT_MAP }));
    this.head = head({}, [this.#importmap]);
    this.root = html({ lang: "en" }, [this.head, this.body]);
  }

  toString() {
    return `<!DOCTYPE html>\n${this.root.toString()}`;
  }

  appendImportMap(importMap) {
    const currentMap = JSON.parse(this.#importmap.innerText).imports;
    this.#importmap.innerText = JSON.stringify({ imports: Object.assign(currentMap, importMap) });
  }

  get importMap() {
    return this.#importmap;
  }
}

export const docRegistery = new Stack();

export function mountSSR(renderer) {
  return (...components) => {
    const document = docRegistery.current;
    return renderer.call(document.body, ...components);
  }
}

export function importMap(imports = {}) {
  return docRegistery.current.appendImportMap(imports);
}

export function clientScript(urlOrFuncton) {
  if (urlOrFuncton instanceof Function) {
    const code = urlOrFuncton.toString().match(/[^{]+\{([\s\S]*)\}$/)[1];
    const block = script({ defer: true, type: "module" }, code);
    docRegistery.current.head.appendChild(block);
  }
  else if (typeof urlOrFuncton === "string") {
    docRegistery.current.head.appendChild(script({ defer: true, type: "module", src: urlOrFuncton }));;
  }
  else {
    throw new Error(`clientScript(<String>|<Function>) acccepts only arguments of type of string or function`);
  }
}
