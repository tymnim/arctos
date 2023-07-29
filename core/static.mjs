import { body, head, html, meta, script, title } from "./elements.mjs";

const DEFAULT_IMPORT_MAP = { "atomi": "/node_modules/atomi/index.mjs", "arctos": "/node_modules/arctos/index.mjs" };

export let document = null;

export function defineDocument(path) {
  document = new _Document({
    path
  });
  return document;
}

export function getDocument() {
  return document;
}

// NOTE: intended for internal use of by SSR
export class _Document {
  #importmap = {}
  #title = ""
  #head = null
  body = null
  path = ""
  lang = "en"
  clientScripts = []

  constructor(path = "") {
    this.body = body({});
    // TODO: default meta tags
    this.path = path;

    this.#importmap = script({ type: "importmap" }, JSON.stringify({ imports: {... DEFAULT_IMPORT_MAP } }));
    this.#title = title({}, path);
    this.#head = head({}, [this.#importmap, this.#title]);
    this.body = body({});
  }

  toString() {
    const root = html({ lang: this.lang }, [
      this.head, this.body
    ]);
    return `<!DOCTYPE html>\n${root.toString()}`;
  }

  set head(head) {
    this.#head.childNodes.forEach(node => head.appendChild(node));
    this.#head = head;
    this.#head.appendChild(this.#importmap);
    this.#head.appendChild(this.#title);
    this.clientScripts.forEach(script => this.#head.appendChild(script));
  }

  get head() {
    return this.#head;
  }

  set title(title) {
    this.#title.innerText = title;
  }

  get title() {
    return this.#title.innerText;
  }

  set importmap(imports) {
    const current = JSON.parse(this.#importmap.innerText) || {};
    const newImports = Object.assign(current.imports, imports);
    this.#importmap.innerText = JSON.stringify({ imports: newImports });
    return newImports;
  }

  get importmap() {
    const { imports } = JSON.parse(this.#importmap.innerText) || {};
    return imports;
  }
}

/**
 * @param config: { lang, title, importmap, head, body }
 * @return document
 **/
export function Document(config) {
  const expected = ["lang", "title", "importmap", "head", "body", "path"];
  Object.entries(config).forEach(([key, val]) => {
    // NOTE: nice to have in case of typo
    if (!expected.includes(key)) {
      console.warn(`Opps! Unknown value has been passed to the Document: "${key}"\nvalue:`, val);
    }

    document[key] = val;
  });
  return document;
}

export function clientScript(urlOrFuncton) {
  if (urlOrFuncton instanceof Function) {
    const code = urlOrFuncton.toString().match(/[^{]+\{([\s\S]*)\}$/)[1];
    const block = script({ defer: true, type: "module" }, code);
    document.clientScripts.push(block);
  }
  else if (typeof urlOrFuncton === "string") {
    document.clientScripts.push(script({ defer: true, type: "module", src: urlOrFuncton }));
  }
  else {
    throw new Error(`clientScript(<String>|<Function>) acccepts only arguments of type of string or function`);
  }
}

