
import { Tracker, ReactiveVar, Scope } from ".core.mjs";

function reactiveFunction(func) {
  const currentScope = new Scope(func);
  Tracker.currentScope = currentScope;
  // NOTE: initial run; registers dependencies
  currentScope.execute();
  Tracker.currentScope = null;
  return currentScope;
}

function reactiveState(reactiveVar) {
  return [
    function get() {
      return reactiveVar.get();
    },
    function set(value) {
      reactiveVar.set(value);
    },
    function fset(func) {
      reactiveVar.set(func(reactiveVar.value));
    }
  ];
}

export function nonreactive(func) {
  const scope = Tracker.currentScope;
  Tracker.currentScope = null;
  const result = func();
  Tracker.currentScope = scope;
  return result;
}

export function reactive(variable) {
  if (variable instanceof Function) {
    return reactiveFunction(variable);
  }
  const reactiveVar = new ReactiveVar(variable);
  return new.target === undefined ? reactiveState(reactiveVar) : reactiveVar;
}

export default reactive;
