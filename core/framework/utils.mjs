
export function normalize(children) {
  return (children instanceof Array ? children : [children])
}

export function unwrap(array) {
  return array.length > 1 ? array : array[0];
}

export function focus(element) {
  if (! element.parentElemet) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach((m) => {
        m.addedNodes.forEach(node => {
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
