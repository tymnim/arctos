/**
 * TODO; write a good comment description
 * you may have:
 * 1. elements - api to create custom html elements
 * 2. components - a way to combine elements
*/

import { Node as SSRNode, TextNode as SSRTextNode } from "./ssr.mjs";
import { reactiveFunction } from "../../core/reactivity/hooks.mjs";

const { createElement, createTextNode, Node } = (function() {
  const isSSR = global && !global.document && !global.window;
  if (isSSR) {
    return {
      createElement: tag => new SSRNode(tag),
      createTextNode: value => new SSRTextNode(value),
      Node: SSRNode
    };
  }
  return {
    createElement: document.createElement.bind(document),
    createTextNode: document.createTextNode.bind(document),
    // NOTE: Node is global in browser
    Node
  }
})();

const PropertyNotAttributeList = ["checked"];

export function element(tagName, [attributes = {}, children = []], existingNode) {
  const node = existingNode || createElement(tagName);

  applyEvents(node, attributes.on);
  applyAttributes(node, attributes);
  const content = replaceChildrenOf(node, normalize(children));
  // console.log(content);
  if (content instanceof Promise) {
    return new Promise(async resolve => {
      await content;
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
  let allKids = [];
  for (let child of children) {
    const kids = normalize(renderChild(child));
    allKids = allKids.concat(kids.flat());
  }
  // console.log(allKids);

  if (allKids.some(kid => kid instanceof Promise)) {
    return new Promise(resolve => {
      Promise.all(allKids).then(kids => {
        node.appendChild(...kids)
        resolve(node);
      });
    });
  }

  node.appendChild(...allKids);
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
    return new Promsie(async resolve => { resolve(renderChild(await child)) });
  }
  if (child instanceof Array) {
    return child.map(kid => renderChild(kid))
  }
  return createTextNode(child)
}
