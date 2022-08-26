
import assert from "assert";
import { Tests, Test } from "unit-tester";
import { ReactiveVar, Scope } from "../core/reactivity/core.mjs";
import { reactive } from "../core/reactivity/hooks.mjs";


const reactiveVarTests = Tests("ReactiveVar",
  Test("#set", () => {
    const reactiveVar = new ReactiveVar();
    reactiveVar.set("something");
    assert.equal(reactiveVar.get(), "something");
  }),
  Test("#get", () => {
    const reactiveVar = new ReactiveVar();
    reactiveVar.set("something");
    assert.equal(reactiveVar.get(), "something");
  }),
);

const scopeTests = Tests("Scope",
  Test("#firstRun", () => {
    let hasRun = false;
    const scope = new Scope(scope => {
      hasRun = true;
    });
    scope.execute();
    assert.equal(scope.firstRun, true);
    assert.equal(hasRun, true);
    scope.execute();
    assert.equal(scope.firstRun, false);
  })
);

const coreTests = Tests("Reactivity Core", reactiveVarTests, scopeTests);

const hooksTests = Tests("Hooks",
  Tests("reactive",
    Test("#get", () => {
      const [state] = reactive(5);

      assert.equal(state(), 5);
    }),
    Test("#set", () => {
      const [state, setState] = reactive(5);
      assert.equal(state(), 5);
      setState(3);
      assert.equal(state(), 3);
    }),
    Test("#fset", () => {
      const [state,,setState] = reactive(5);
      setState(current => {
        assert.equal(current, 5);
        return 3;
      });
      assert.equal(state(), 3);
    }),
    Test("#fset (none)", () => {
      const [state,,setState] = reactive(3);
      setState((current, none) => {
        assert.equal(current, 3);
        return none;
      });
      assert.equal(state(), 3);
    }),
    Test("#fset (scope dependand)", () => {
      const [state,,setState] = reactive(3);
      return new Promise((resolve, reject) => {
        const scope = reactive((scope) => {
          state();
          if (!scope.firstRun) {
            reject(new Error("Scope was executed"));
          }
        });
        setState((current, none) => {
          assert.equal(current, 3);
          return none;
        });
        setTimeout(() => {
          assert.equal(state(), 3);
          resolve();
        }, 500);
      });
    })
  )
);

export default [coreTests, hooksTests];
