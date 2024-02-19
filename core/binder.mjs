import { ReactiveVar } from "atomi";

const bindmap = {
  INPUT: {
    checked: [
      { types: ["checkbox", "radio"], event: "change" }
    ],
    value: [
      // NOTE: completely ignored:
      //       type: ["submit", "image", "button", "hidden"], since not sure what to do with them
      { types: ["text", "number", "password", "email", "range", "search", "tel", "url"],
        event: "input" },
      { types: ["date", "color", "datetime-local", "file", "month", "time", "week"],
        event: "checked" }
    ]
  },
  SELECT: {
    value: [
      { event: "change" }
    ]
  }
};

export class Binder {
  /**
   * @param {ReactiveVar} reactiveVar
   */
  constructor(reactiveVar) {
    this.atom = reactiveVar;
  }

  getValue() {
    return this.atom.get();
  }

  /**
   * @param {string} attribute
   * @param {Node}   node
   */
  bind(attribute, node) {
    const binders = bindmap[node.nodeName]?.[attribute];
    if (!binders) {
      // TODO: provide info where to look what elements are bindable
      throw new Error(`Cannot bind: "${attribute}" on ${node.nodeName.toLowerCase()}.`);
    }

    const binder = binders.find(binder => {
      if (binder.types) {
        return binder.types.includes(node.type);
      }
      return binder;
    });
    if (!binder) {
      throw new Error(`Cannot find a suitable binder for "${attribute}"`
        + `on ${node.nodeName.toLowerCase()}`);
    }

    node.addEventListener(binder.event, e => {
      const newValue = e?.currentTarget?.[attribute];
      this.atom.set(newValue);
    });
  }
}

/**
 * @typedef {Function & {reactiveVar: ReactiveVar}} AtomicGetter
 *
 * @prop {ReactiveVar} reactiveVar
 *
 * Indicates that attribute can be bound to an atom.
 * @param {AtomicGetter|ReactiveVar} atomicGetter
 */
export function bind(atomicGetter) {
  if (atomicGetter instanceof ReactiveVar) {
    return new Binder(atomicGetter);
  }
  return new Binder(atomicGetter.reactiveVar);
}

