
import { element } from "./element.mjs";

export function div(...args) {
  return element("div", args);
}

export function span(...args) {
  return element("span", args);
}

export function button(...args) {
  return element("button", args);
}

export function input(...args) {
  return element("input", args);
}

export function main(...args) {
  return element("main", args);
}

export function img(...args) {
  return element("img", args);
}