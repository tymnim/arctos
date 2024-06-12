const upairedTags = ["br", "img", "input", "meta"];

export class Node {
  constructor(tag) {
    this.#tag = tag;
  }

  #tag = "";

  #children = [];

  #attributes = {};

  #parentElement = null;

  toString() {
    const { data = {}, area = {}, ...attributes } = this.#attributes;
    // NOTE: overriding attributes with properties.
    //       Eg if 'checked' prop is conflicted with checked attr, we want to use prop
    Object.assign(
      attributes,
      Object.getOwnPropertyNames(this)
      .reduce((acc, prop) => Object.assign(acc, { [prop]: this[prop] }))
    );
    const apply = (attrs, prefix) => Object.entries(attrs)
      .map(([name, value]) => `${prefix ? prefix + "_" : ""}${name}="${value}"`)
      .join(" ");

    const trimmedAttributes = `${apply(attributes)} ${apply(data, "data")} ${apply(area, "area")}`
    .trim();

    if (upairedTags.includes(this.#tag)) {
      return `<${this.#tag}${trimmedAttributes ? ` ${trimmedAttributes}` : ""}>`;
    }
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

  get parentElement() {
    return this.#parentElement;
  }

  get previousSibling() {
    if (this.#parentElement) {
      return this.#parentElement.childNodes[this.#parentElement.childNodes.indexOf(this) - 1];
    }
  }

  get nextSibling() {
    if (this.#parentElement) {
      return this.#parentElement.childNodes[this.#parentElement.childNodes.indexOf(this) + 1];
    }
  }

  get childNodes() {
    return this.#children;
  }

  get innerText() {
    return this.#children[0].toString();
  }

  set innerText(text) {
    this.#children = [new TextNode(text)];
  }

  setParent(self) {
    if (this.#parentElement) {
      this.parentElement.removeChild(this);
    }
    this.#parentElement = self;
  }

  appendChild(child) {
    this.#children = this.#children.concat(child);
    child.setParent(this);
    return this;
  }

  append(...children) {
    this.#children = this.#children.concat(children);
    children.forEach(child => child.setParent(this));
    return this;
  }

  insertBefore(node, child) {
    const index = this.#children.indexOf(child);

    if (index >= 0) {
      this.#children = this.#children.slice(0, index).concat(node, this.#children.slice(index));
    }
    else {
      this.#children.push(node);
    }
    return node;
  }

  removeChild(child) {
    const index = this.#children.indexOf(child);
    if (index >= 0) {
      this.#children.splice(index, 1);
    }
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

