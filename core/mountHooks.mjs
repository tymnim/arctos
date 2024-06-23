// @ts-check
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
        flattenTree(node).forEach(node => node[onRendered]?.(node));
      });
      mutation.removedNodes.forEach(node => {
        flattenTree(node).forEach(node => node[onDestroyed]?.(node));
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

export function onMount(node, callback) {
  node[onRendered] = callback;
}
export function onUnmount(node, callback) {
  node[onDestroyed] = callback;
}

