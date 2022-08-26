
import assert from "assert";
import { ReactiveVar, Scope } from "../core/reactivity/core.mjs";
import { reactive } from "../core/reactivity/hooks.mjs";


const reactiveVarTests = [{
  name: "#set",
  exec() {
    const reactiveVar = new ReactiveVar();
    reactiveVar.set("something");
    assert.equal(reactiveVar.get(), "something");
  }
}, {
  name: "#get",
  exec() {
    const reactiveVar = new ReactiveVar();
    reactiveVar.set("something");
    assert.equal(reactiveVar.get(), "something");
  }
}]
reactiveVarTests.name = "ReactiveVar";

const scopeTests = [{
  name: "#firstRun",
  exec() {
    let hasRun = false;
    const scope = new Scope(scope => {
      hasRun = true;
    });
    scope.execute();
    assert.equal(scope.firstRun, true);
    assert.equal(hasRun, true);
    scope.execute();
    assert.equal(scope.firstRun, false);
  }
}];
scopeTests.name = "Scope";

const coreTests = [reactiveVarTests, scopeTests];
coreTests.name = "Reactivity Core";

const reactiveHook = [{
  name: "#get",
  exec() {
    const [state] = reactive(5);

    assert.equal(state(), 5);
  }
}, {
  name: "#set",
  exec() {
    const [state, setState] = reactive(5);
    assert.equal(state(), 5);
    setState(3);
    assert.equal(state(), 3);
  }
}, {
  name: "#fset",
  exec() {
    const [state,,setState] = reactive(5);
    setState(current => {
      assert.equal(current, 5);
      return 3;
    });
    assert.equal(state(), 3);
  }
}, {
  name: "#fset (none)",
  exec() {
    const [state,,setState] = reactive(3);
    setState((current, none) => {
      assert.equal(current, 3);
      return none;
    });
    assert.equal(state(), 3);
  }
}, {
  name: "#fset (scope dependand)",
  exec() {
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
  }
}];
reactiveHook.name = "reactive";

const hooksTests = [reactiveHook];
hooksTests.name = "Hooks";

export default [coreTests, hooksTests];
