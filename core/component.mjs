// @ts-check
import { reactive } from "atomi";
import { normalize, unwrap } from "./utils.mjs";
import { isSSR } from "./renderer.mjs";

const onRendered = Symbol("rendered");
const onDestroyed = Symbol("destroyed");

function flattenTree(node) {
  if (node.childNodes.length) {
    return [node, ...Array.from(node.childNodes).map(flattenTree)].flat();
  }
  return [node];
}

if (!isSSR) {
  // TODO: think how to pass onRender and onDestroyed to the client side
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        flattenTree(node).forEach(node => node[onRendered]?.());
      });
      mutation.removedNodes.forEach(node => {
        flattenTree(node).forEach(node => node[onDestroyed]?.());
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

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

function addRenderedHandler(self, nodes, contextData) {
  // doing nothing is using ssr
  // TODO: figure out a way how to call it when it's rendered on the client side.
  if (isSSR) {
    return; //self._rendered(nodeOrNodes, contextData);
  }

  let rendered = false;
  const renderedCallback = () => {
    if (!rendered) {
      self._rendered(unwrap(nodes), contextData);
    }
  };
  const destroyedCallback = () => {
    self._destroyed(unwrap(nodes), contextData);
  };
  nodes.forEach(node => {
    node[onRendered] = renderedCallback;
    node[onDestroyed] = destroyedCallback;
  });
}

export function component(func) {
  const self = (...contextData) => {
    return new Promise(resolve => {
      reactive(async scope => {
        const nodes = await Promise.all(normalize(func(...contextData)));
        if (!scope.space.nodes) {
          scope.space.nodes = nodes;
          addRenderedHandler(self, nodes, contextData);

          resolve(unwrap(nodes));
        }
        else {
          scope.space.nodes = replace(scope.space.nodes, nodes);
        }
      });
    });
  };

  self._renderedListeners = [];
  self._destroyedListeners = [];

  self._rendered = async (instance, contextData) => {
    let listenerResult = [instance, contextData];
    // NOTE: chaining then statements based on returns of previous then statement
    for (let listener of self._renderedListeners) {
      // NOTE: if listener returned no result we want to keep the previous one.
      listenerResult = (await listener(...listenerResult)) ?? listenerResult;
    }
  };

  self._destroyed = async (instance, contextData) => {
    let listenerResult = [instance, contextData];
    // NOTE: chaining finally statements based on returns of previous then statement
    for (let listener of self._destroyedListeners) {
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
    self._destroyedListeners.push(listener);
    return self;
  };

  return self;
}
