
import { reactive, atom } from "atomi";

export function store(uid, defaultValue) {
  const value = JSON.parse(window.localStorage.getItem(uid) || null) ?? defaultValue;
  const reactiveVar = new atom(value);
  reactive(scope => {
    const value = reactiveVar.get();
    if (!scope.firstRun) {
      window.localStorage.setItem(uid, JSON.stringify(value));
    }
  });
  return reactiveVar;
}

export function useStore(store) {
  return atom(store);
}
