
import { reactiveFunction } from "../reactivity/hooks.mjs";
import { normalize, unwrap } from "./utils.mjs";

function replace(oldNodes, newNodes) {
  const lastNode = oldNodes[oldNodes.length - 1];
  const parent = lastNode.parentElement;
  if (parent) {
    const nextNode = lastNode.nextSibling;
    oldNodes.forEach(node => parent.removeChild(node));
    newNodes.forEach(node => parent.insertBefore(node, nextNode));
  }
  return newNodes;
}


export function component(func) {
  const self = (...contextData) => {
    return new Promise(async resolve => {
      await reactiveFunction(async scope => {
        const nodes = await Promise.all(normalize(func(...contextData)));
        if (!scope.space.nodes) {
          scope.space.nodes = nodes;
          const nodeOrNodes = unwrap(nodes);
          await self._rendered(nodeOrNodes, contextData);
          resolve(nodeOrNodes);
        }
        else {
          scope.space.nodes = replace(scope.space.nodes, nodes);
        }
      });
    });
  }

  self._renderedListeners = [];

  self._rendered = async (instance, contextData) => {
    let listenerResult = [instance, contextData];
    // NOTE: chaining then statements based on returns of previous then statement
    for (let listener of self._renderedListeners) {
      // NOTE: if listener returned no result we want to keep the previous one.
      listenerResult = (await listener(...listenerResult)) ?? listenerResult;
    }
  };

  self.then = listener => {
    // is an event listener that is triggered when component is rendered
    self._renderedListeners.push(listener);
    return self;
  };

  self.finally = listener => {
    // is an event listener that is triggered when component is destroyed
    // listener(self.currentData);
    return self;
  };

  return self;
}