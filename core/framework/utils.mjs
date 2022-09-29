
export function normalize(children) {
  return (children instanceof Array ? children : [children])
}

export function unwrap(array) {
  return array.length > 1 ? array : array[0];
}
