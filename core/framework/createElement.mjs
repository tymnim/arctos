
/**
 * Exports createElement(), createTextNode();
 * Automatially will decide which one to use ether for server side or client side;
 */

import { Node as SSRNode, TextNode as SSRTextNode } from "./ssr.mjs";

export const { createElement, createTextNode, Node, Text } = (function() {
  const isSSR = global && !global.document && !global.window;
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
    Node,
    Text
  }
})();

export default { createElement, createTextNode, Node, Text };


