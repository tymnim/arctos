import { ReactiveVar } from "atomi";


const bindmap = {
  INPUT: {
    checked: [
      { types: ["checkbox", "radio"], event: "change" },
    ],
    value: [
      // NOTE: completely ignored: type: ["submit", "image", "button", "hidden"], since not sure what to do with them
      { types: ["text", "number", "password", "email", "range", "search", "tel", "url"], event: "input" },
      { types: ["date", "color", "datetime-local", "file", "month", "time", "week"], event: "checked" },
    ]
  },
  SELECT: {
    value: [
      { event: "change" }
    ]
  }
};

export class Binder {
  constructor(reactiveVar) {
    this.atom = reactiveVar;
  }

  getValue() {
    return this.atom.get();
  }

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
      throw new Error(`Cannot find a suitable binder for "${attribute}" on ${node.nodeName.toLowerCase()}`);
    }

    node.addEventListener(binder.event, (e) => {
      const newValue = e.currentTarget[attribute];
      this.atom.set(newValue);
    });
  }
}

/**
 * Indicates that attribute can be bound to an atom.
 * @param {function} atomicGetter
 */
export function bind(atomOrGetter) {
  if (atomOrGetter instanceof ReactiveVar) {
    return new Binder(atomic);
  }
  return new Binder(atomOrGetter.reactiveVar);
}

