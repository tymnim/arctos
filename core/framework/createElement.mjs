
/**
 * Exports createElement(), createTextNode();
 * Automatially will decide which one to use ether for server side or client side;
 */

import { Node as SSRNode, TextNode as SSRTextNode } from "./ssr.mjs";

const nodeGlobal = typeof global !== "undefined" && global;
const browserGlobal = typeof window !== "undefined" && window;

export const { createElement, createTextNode, Node, Text } = (function(global) {
  const isSSR = (global && !global.document && !global.window) ? true : false;
  if (isSSR) {
    return {
      createElement: tag => new SSRNode(tag),
      createTextNode: value => new SSRTextNode(value),
      Node: SSRNode,
      Text: SSRTextNode
    };
  }
  return {
    createElement: document.createElement.bind(document),
    createTextNode: document.createTextNode.bind(document),
    // NOTE: Node and Text are global in browser
    Node: global.Node,
    Text: global.Text
  }
})(nodeGlobal || browserGlobal);

export default { createElement, createTextNode, Node, Text };


