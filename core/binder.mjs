import { ReactiveVar } from "atomi";

const BINDMAP = new Map();

implementBindMap("INPUT", {
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
});

implementBindMap("SELECT", {
  value: [
    { event: "change" }
  ]
});

/**
 * @param {string} nodeName
 * @param {Object.<string, {types?: string[], event: string}[]>} bindData
 */
export function implementBindMap(nodeName, bindData) {
  const existingData = BINDMAP.get(nodeName) || {};
  BINDMAP.set(nodeName, Object.assign(existingData, bindData));
}

/**
 * @template T
 */
export class Binder {
  /**
   * @param {ReactiveVar<T>} reactiveVar
   * @param {function(T, T):T} [format]
   */
  constructor(reactiveVar, format = (x, _) => x) {
    this.atom = reactiveVar;
    this.format = format;
  }

  getValue() {
    return this.atom.get();
  }

  /**
   * @param {string} attribute
   * @param {Node}   node
   */
  bind(attribute, node) {
    const binders = BINDMAP.get(node.nodeName)?.[attribute];
    if (!binders) {
      // TODO: provide info where to look what elements are bindable
      throw new Error(`Binding of "${attribute}" is not implemented on `
        + `${node.nodeName.toLowerCase()}. See \`implementBindMap\` method for more info.`);
    }

    const binder = binders.find(binder => {
      if (binder.types) {
        return binder.types.includes(node.type);
      }
      return binder;
    });
    if (!binder) {
      throw new Error(`Cannot find a suitable binder for "${attribute}" `
        + `on ${node.nodeName.toLowerCase()} [type="${node.type}"]`);
    }

    node.addEventListener(binder.event, e => {
      const newValue = e?.currentTarget?.[attribute];
      const currentValue = this.atom.value;
      this.atom.set(this.format(newValue, currentValue));
    });
  }
}

/**
 * @template T
 * @typedef {import("atomi").Atom<T>} Atom
 */

/**
 * To bind attribute/property value to an atom.
 *
 * @example
 * ```js
 * const [isChecked, setIsChecked] = atom(false);
 * input({ type: "checkbox", checked: bind(isChecked) });
 * ```
 *
 * @template {(string|boolean)} T
 * @param {Atom<T>[0]|ReactiveVar<T>} atomicGetter
 * @param {function(T, T):T}          [format]     - optional function to be called with new value,
 *                                                   can be used for formatting or validation.
 */
export function bind(atomicGetter, format) {
  if (atomicGetter instanceof ReactiveVar) {
    return new Binder(atomicGetter, format);
  }
  return new Binder(atomicGetter.reactiveVar, format);
}

