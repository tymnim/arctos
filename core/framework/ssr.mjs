
export class Node {
  constructor(tag) {
    this.#tag = tag;
  }

  #tag = ""
  #children = []
  #attributes = {}

  toString() {
    const { data = {}, area = {}, ...attributes } = this.#attributes;
    // NOTE: overriding attributes with properties. Eg if checked prop is conflicted with checked attr, we want to use prop
    Object.assign(attributes, Object.getOwnPropertyNames(this).reduce((acc, prop) => { acc[prop] = prop; return acc; }, {}));
    const apply = (attrs, prefix) => Object.entries(attrs)
      .map(([name, value]) => `${prefix ? prefix + "_" : ""}${name}="${value}"`)
      .join(" ");

    const trimmedAttributes = `${apply(attributes)} ${apply(data, "data")} ${apply(area, "area")}`.trim();
    return `<${this.#tag}${trimmedAttributes ? ` ${trimmedAttributes}` : ""}>${
      this.#children.map(child => child.toString()).join("")
    }</${this.#tag}>`;
  }

  get firstChild() {
    return this.#children[0];
  }

  get lastChild() {
    return this.#children[this.#children.length - 1];
  }

  appendChild(...children) {
    this.#children = this.#children.concat(children);
  }

  setAttribute(name, value) {
    this.#attributes[name] = value;
  }

  addEventListener() {
    // TODO: research how smart people do it for ssr
  }
}

export class TextNode extends Node {
  constructor(value) {
    super();
    this.value = value;
  }

  toString() {
    return this.value;
  }
}