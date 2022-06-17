/**
 * you may have:
 * 1. elements - api to create custom html elements
 * 2. components - a way to combine elements
*/

import { reactiveFunction } from "/core/reactivity/hooks.mjs";

const createElement = document.createElement.bind(document);
const createTextNode = document.createTextNode.bind(document);

const PropertyNotAttributeList = ["checked"]

export function span(...args) {
  return element("span", args);
}

export function button(...args) {
  return element("button", args);
}

export function input(...args) {
  return element("input", args);
}

function element(tagName, [attributes = {}, children = [], existingNode = null]) {
  const node = existingNode || createElement(tagName);

  replaceChildrenOf(node, normalize(children));
  applyEvents(node, attributes.on);
  applyAttributes(node, attributes);
  return node;
}

function applyEvents(node, eventMap = {}) {
  for (let [event, listener] of Object.entries(eventMap)) {
    // TODO: think if should allow listener be an array.
    //       is it a valid use case have multiple click events on the same element ?
    node.addEventListener(event, listener);
  }
}

function applyAttribute(node, attr, value) {
  const newValue = value instanceof Function ? value() : value;
  if (PropertyNotAttributeList.includes(attr)) {
    node[attr] = newValue;
  }
  else {
    node.setAttribute(attr, newValue);
  }
  return node;
}

function bindAttribute(node, attr, value) {
  reactiveFunction(scope => {
    applyAttribute(node, attr, value)//.then(() => {;
      // NOTE: if after function execution scope did not register any dependencies,
      //       then there's none. We want just to forget about it.
      if (scope.deps.size === 0) {
        scope.die();
      }
    //});
  });
}

function applyAttributes(node, {on, ...attributes}) {
  // NOTE: ignoring 'on' attribute since it's used not as an attrinute, but a way to provide event listeners;
  Object.entries(attributes)
  .reduce(parseAttribute, [])
  .forEach(([attribute, values])  => bindAttribute(node, attribute, values));
}

function parseAttribute(attributes = [], [name, value]) {
  // NOTE: aria and data a special cases and can be nested
  if (name === "aria" || name === "data") {
    return attributes.concat(Object.entries(value).map(([key, val]) => [`${name}-${key}`, val]));
  }
  return attributes.concat([[name, value]]);
}

function normalize(children) {
  return (children instanceof Array ? children : [children])
}

function replaceChildrenOf(node, children) {
  while (node.firstChild) { node.removeChild(node.lastChild) }
  for (let child of children) {
    if (! (child instanceof Node)) {
      child = createTextNode(child);
    }
    node.appendChild(child);
  }
  return node;
}
