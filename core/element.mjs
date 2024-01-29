import { reactive, ReactiveVar } from "atomi";

import { createElement, createTextNode, Node, Text } from "./createElement.mjs";
import { normalize } from "./utils.mjs";
import { Binder } from "./binder.mjs";

const PropertyNotAttributeList = ["checked", "disabled"];

export function reuse(node, attributes, ...children) {
  return element("", [attributes, children], node);
}

export function element(tagName, [attributes = {}, children = []], existingNode) {
  const node = existingNode || createElement(tagName);

  applyEvents(node, attributes.on);
  applyAttributes(node, attributes);

  const { space } = reactive((scope) => {
    scope.space.content = replaceChildrenOf(node, normalize(children));
  });

  if (space.content instanceof Promise) {
    return new Promise(async resolve => {
      await space.content;
      resolve(node);
    });
  }

  return node;
}

function applyEvents(node, eventMap = {}) {
  for (let [event, listener] of Object.entries(eventMap)) {
    // TODO: think if should allow listener be an array.
    //       is it a valid use case have multiple click events on the same element ?
    // TODO: think if reactive event listeners should be a thing
    node.addEventListener(event, listener);
  }
}

/**
 * @param {(string|function|Promise)} value
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
 * @param {node}    node
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
 * @param {node}              node
 * @param {string}            attr
 * @param {(string|function)} value
*/
function applyAttribute(node, attr, value) {
  // TODO: accept promises as attribute values
  // const newValue = value instanceof Function ? value() : value;
  const newValue = unwrapAttribute(value);
  if (newValue instanceof Promise) {
    return newValue.then(unwraped => applyUnwrapedAttribute(node, attr, unwraped));
  }
  return applyUnwrapedAttribute(node, attr, newValue);
}

/**
 * @param {Node}              node
 * @param {string}            attr
 * @param {(string|function|ReactiveVar)} value
 */
function bindAttribute(node, attr, value) {
  reactive(async scope => {
    await applyAttribute(node, attr, value);

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

function applyAttributes(node, { on, ...attributes }) {
  // NOTE: ignoring 'on' attribute since it's used not as an attrinute, but a way to provide event listeners;
  Object.entries(attributes)
  .reduce(parseAttribute, [])
  .forEach(([attribute, values]) => bindAttribute(node, attribute, values));
}

function parseAttribute(attributes = [], [name, value]) {
  // NOTE: aria and data a special cases and can be nested
  if (name === "aria" || name === "data") {
    return attributes.concat(Object.entries(value).map(([key, val]) => [`${name}-${key}`, val]));
  }
  return attributes.concat([[name, value]]);
}

function replaceChildrenOf(node, children) {
  let allKids = [];
  for (let child of children) {
    const kids = normalize(renderChild(child));
    allKids = allKids.concat(kids.flat());
  }

  if (allKids.some(kid => kid instanceof Promise)) {
    return new Promise(resolve => {
      Promise.all(allKids).then(kids => {
        while (node.firstChild) { node.removeChild(node.lastChild) }
        node.append(...kids)
        resolve(node);
      });
    });
  }

  while (node.firstChild) { node.removeChild(node.lastChild) }
  node.append(...allKids);
  return node;
}

// children are:
//
// 1. Rendered HTML element
// 2. Array of rendered HTML elements
// 3. Component (promise)
// 4. Array of Components (promises)
// 5. Function ?
// 6. child: String - createTextNode(child)
//

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
    return new Promise(async resolve => { resolve(renderChild(await child)) });
  }
  if (child instanceof Array) {
    return child.map(kid => renderChild(kid))
  }
  return createTextNode(child)
}
