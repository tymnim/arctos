// @ts-check
import { reactive, ReactiveVar, guard } from "atomi";
import { createElement, createTextNode, Node, Text } from "./createElement.mjs";
import { normalize } from "./utils.mjs";
import { Binder } from "./binder.mjs";
import { onMount, onUnmount } from "./mountHooks.mjs";

/**
 * @typedef {HTMLElement|string|number|undefined} CleanRenderable
 * @typedef {CleanRenderable
 *  | CleanRenderable[]
 *  | Promise<CleanRenderable>
 *  | Promise<CleanRenderable[]>
 *  | {dom:Renderable}
 *  | function():Renderable
 *  | function():Renderable[]} Renderable
 * @typedef {any} RenderableChild
 */

const PropertyNotAttributeList = [
  "checked", "disabled", "open", "value", "tabIndex", "selected",
  "maxLength"
];

const specialAttributes = {
  /**
   * @param {Object|""}      classes
   * @param {HTMLElement} node
   * @returns {string}
   */
  class: (classes = "", node) => {
    if (classes instanceof Array) {
      return classes.join(" ");
    }
    if (classes.constructor === Object) {
      // NOTE: detected a class map;
      return Object.entries(classes)
        .filter(([_classname, condition]) => {
          if (condition instanceof Function) {
            return guard(condition);
          }
          return condition;
        }).map(entry => entry[0])
        .join(" ");
    }
    return classes;
  }
};

/**
 * @param {HTMLElement} node
 * @param {Object} attributes
 * @param {RenderableChild} children
 * @param {Object}          hooks
 */
export function reuse(node, attributes, children, hooks) {
  return element("", attributes, children, hooks, node);
}

/**
 * @param {string}          tagName
 * @param {Object}          [attributes={}]
 * @param {RenderableChild} [children=[]]
 * @param {HTMLElement}     [existingNode]
 * @returns {HTMLElement|Promise<HTMLElement>}
 */
export function element(tagName, attributes = {}, children = [], hooks = {}, existingNode) {
  const node = existingNode || createElement(tagName);

  // @ts-ignore
  const scope = reactive(scope => {
    scope.space.content = replaceChildrenOf(
      node,
      normalize(children).filter(child => child !== undefined)
    );
    return scope.space.content;
  });
  applyEvents(node, attributes.on);
  applyAttributes(node, attributes);
  applyHooks(node, hooks);

  if (scope instanceof Promise) {
    return scope.then(() => node);
  }

  return node;
}

/**
 * @param {HTMLElement}                node
 * @param {Object}                     hooks
 * @param {function(HTMLElement):void} [hooks.mount]
 * @param {function(HTMLElement):void} [hooks.unmount]
 */
function applyHooks(node, { mount, unmount }) {
  if (mount) {
    onMount(node, mount);
  }
  if (unmount) {
    onUnmount(node, unmount);
  }
  return node;
}

/**
 * @param {HTMLElement} node
 * @param {Object?} eventMap
 */
function applyEvents(node, eventMap = {}) {
  for (let [event, listener] of Object.entries(eventMap)) {
    // TODO: think if should allow listener be an array.
    //       is it a valid use case have multiple click events on the same element ?
    // TODO: think if reactive event listeners should be a thing
    node.addEventListener(event, listener);
  }
}

/**
 * @param {(string|function|Promise|Binder)} value
 * @returns {string|Promise}
 */
function unwrapAttribute(value) {
  if (value instanceof Function) {
    return unwrapAttribute(value());
  }
  if (value instanceof Promise) {
    return value.then(unwrapAttribute);
  }
  if (value instanceof Binder) {
    return value.atom.get();
  }
  return value;
}

/**
 * @param {HTMLElement}    node
 * @param {string}  attr
 * @param {string}  value
*/
function applyUnwrapedAttribute(node, attr, value) {
  if (PropertyNotAttributeList.includes(attr)) {
    node[attr] = value;
  }
  else {
    node.setAttribute(attr, value);
  }
  return node;
}

/**
 * @param {HTMLElement}                      node
 * @param {string}                    attr
 * @param {(string|function|Binder)}  value
*/
function applyAttribute(node, attr, value) {
  // TODO: accept promises as attribute values
  // const newValue = value instanceof Function ? value() : value;
  const newValue = unwrapAttribute(value);
  // NOTE: async atrribnutes cannot be reactive. If you refer to any atoms incide,
  //       they would not bind and your attribute would execute exactly once
  if (newValue instanceof Promise) {
    return newValue.then(unwraped => applyUnwrapedAttribute(node, attr, unwraped));
  }
  return applyUnwrapedAttribute(node, attr, newValue);
}

/**
 * @param {HTMLElement}              node
 * @param {string}            attr
 * @param {(string|function|Binder)} value
 */
function bindAttribute(node, attr, value) {
  reactive(async scope => {
    const attrParser = specialAttributes[attr];
    if (attrParser) {
      const parsedValue = attrParser(value);
      await applyAttribute(node, attr, parsedValue);
    }
    else {
      await applyAttribute(node, attr, value);
    }
    // NOTE: if after function execution scope did not register any dependencies,
    //       then there's none. We want just to forget about it.
    if (scope.deps.size === 0) {
      scope.die();
    }
  });
  if (value instanceof Binder) {
    value.bind(attr, node);
  }
}

/**
 * @param {HTMLElement}    node
 * @param {Object}  attributes
 */
function applyAttributes(node, { on, ...attributes }) {
  // NOTE: ignoring 'on' attribute since it's used not as an attribute,
  //       but a way to provide event listeners;
  Object.entries(attributes)
  .reduce(parseAttribute, [])
  .forEach(([attribute, values]) => bindAttribute(node, attribute, values));
}

/**
 * @param {[string, string][]} attributes
 * @param {[string, string]}   nameValuePair
 */
function parseAttribute(attributes = [], [name, value]) {
  // NOTE: aria and data a special cases and can be nested
  if (name === "aria" || name === "data") {
    return attributes.concat(Object.entries(value).map(([key, val]) => [`${name}-${key}`, val]));
  }
  return attributes.concat([[name, value]]);
}

/*
 * @param {HTMLElement} node (mutates)
 * @param {RenderableChild[]} children
 *
 * @returns {HTMLElement}
 */
function replaceChildrenOf(node, children) {
  let allKids = [];
  for (let child of children) {
    const kids = normalize(renderChild(child));
    allKids = allKids.concat(kids.flat());
  }

  if (allKids.some(kid => kid instanceof Promise)) {
    return new Promise(resolve => {
      Promise.all(allKids).then(kids => {
        node.replaceChildren(...kids.filter(child => child !== undefined));
        resolve(node);
      });
    });
  }

  node.replaceChildren(...allKids.filter(child => child !== undefined));
  return node;
}

/*
 * @param {RenderableChild[]} child
 * @returns {HTMLElement | HTMLElement[]}
 */
function renderChild(child) {
  if (child instanceof Node) {
    return child;
  }
  if (child instanceof Object && child.dom) {
    return renderChild(child.dom);
  }
  if (child instanceof Function) {
    return renderChild(child());
  }
  if (child instanceof Promise) {
    return new Promise(resolve => child.then(renderChild).then(resolve));
    // return new Promise(async resolve => resolve(renderChild(await child)));
  }
  if (child instanceof Array) {
    return child.map(kid => renderChild(kid));
  }
  if (child !== undefined) {
    return createTextNode(child);
  }
  return child;
}
