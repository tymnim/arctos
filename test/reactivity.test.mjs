
import assert from "assert";
import { Tests, Test } from "unit-tester";
import { ReactiveVar, Scope } from "../core/reactivity/core.mjs";
import { reactive } from "../core/reactivity/hooks.mjs";

const wait = time => new Promise(resolve => setTimeout(resolve, time));

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
    Test("#fset (none, scope dependand)", () => {
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
    }),
    Test("#fset (scope dependand, await for update)", async () => {
      const [state,,setState] = reactive(3);
      const [depState, setDepState] = reactive();
      assert.equal(depState(), undefined);
      const scope = await reactive(async (scope) => {
        const st = state();
        await wait(200);
        setDepState(st);
      });
      assert.equal(depState(), state());
      await setState(current => current + 1);
      assert.equal(depState(), state());
    }),
    Test("#set (scope dependand, await for update)", async () => {
      const [state, setState] = reactive(3);
      const [depState, setDepState] = reactive();
      assert.equal(depState(), undefined);
      const scope = await reactive(async (scope) => {
        const st = state();
        await wait(200);
        setDepState(st);
      });
      assert.equal(depState(), state());
      await setState(4);
      await setState(5);
      assert.equal(depState(), state());
    }),
  ),
  Tests("reactiveFunction",
    Test("Making sure reactiveFunction executes exactly once", async () => {
      const [state, setState] = reactive(false);
      let timesExecuted = 0;
      const scope = reactive(() => {
        state();
        timesExecuted += 1;
      });
      assert.equal(timesExecuted, 1);
      await setState(true);
      assert.equal(timesExecuted, 2);
      await setState(true);
      assert.equal(timesExecuted, 3);
    }),
    Test("Making sure reactiveFunction executes exactly once with multiple dependencies", async () => {
      const [state1, setState1] = reactive(false);
      const [state2, setState2] = reactive(false);
      let timesExecuted = 0;
      const scope = reactive(() => {
        state1();
        state2();
        timesExecuted += 1;
      });
      assert.equal(timesExecuted, 1);
      setState1(true);
      await setState2(true);
      assert.equal(timesExecuted, 2);
      setState2(true);
      await setState1(true);
      assert.equal(timesExecuted, 3);
    })
  )
);

export default [coreTests, hooksTests];
