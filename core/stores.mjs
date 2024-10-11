import { reactive, atom } from "atomi";

/**
 * @template T
 * @typedef {import("atomi").Atom<T>} Atom<T>
 */

/**
 * To store something long term for it to be consitent between page refreshes.
 * `store` utilizes `window.localStorage`. Returns an atom to interact with the stored value.
 *
 * @example
 * ```js
 * const [theme, setTheme] = store("settings.theme", "light");
 * ```
 *
 * @template T
 * @param {string} uid          - unique store identifier. It is used for `localStorage`
 * @param {T}      defaultValue - must be JSON stringifiable
 * @returns Atom<T>
 */
export function store(uid, defaultValue) {
  const value = JSON.parse(window.localStorage.getItem(uid) || "null") ?? defaultValue;
  const reactiveVar = atom(value);
  reactive(scope => {
    const value = reactiveVar[0]();
    if (!scope.firstRun) {
      window.localStorage.setItem(uid, JSON.stringify(value));
    }
  });
  return reactiveVar;
}

