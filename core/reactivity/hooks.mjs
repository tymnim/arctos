
import { Tracker, ReactiveVar, Scope } from "./core.mjs";

const NONE = Symbol("none");

export function reactiveFunction(func, ignoreAsync = false) {
  const currentScope = new Scope(func);
  Tracker.currentScope = currentScope;
  // NOTE: initial run; registers dependencies
  const ret = currentScope.execute();
  Tracker.currentScope = null;
  if (ret instanceof Promise && !ignoreAsync) {
    return new Promise(resolve => ret.then(() => resolve(currentScope)));
  }

  return currentScope;
}

export function reactiveState(reactiveVar) {
  return [
    function get() {
      return reactiveVar.get();
    },
    function set(value) {
      return reactiveVar.set(value);
    },
    function fset(func) {
      // NOTE: none is normally not used. May return it back if do not want to trigger updates.
      // Usage case: you have an array of unique things in your array and you want to perform
      //             verification that the new item is unique or any other validation.
      // Code:
      //  setSomething((someThings, none) =>
      //    someThings.includes(thing) ? none : someThings.concat(thing)
      //  );
      // Code example is a little silly, but it maybe used for all kinds of functionality and
      // passing NONE allows to manually optimize your code
      const result = func(reactiveVar.value, NONE);
      if (result !== NONE) {
        return reactiveVar.set(result);
      }
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
