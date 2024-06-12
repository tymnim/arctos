// @ts-check

/**
 * @template {any} T
 * @param {T|T[]} entity
 * @returns {T[]}
 */
export function normalize(entity) {
  return (entity instanceof Array ? entity : [entity]);
}

/**
 * @template {any} T
 * @param {T[]} array
 * @returns {T|T[]}
 */
export function unwrap(array) {
  return array.length > 1 ? array : array[0];
}

/**
 * Used to focus elements
 * @param {HTMLElement} element
 */
export function focus(element) {
  if (!element.parentElement) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.contains(element)) {
            element.focus();
            observer.disconnect();
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  else {
    element.focus();
  }
}
