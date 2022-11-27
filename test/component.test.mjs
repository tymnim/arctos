
import assert from "assert";
import { Tests, Test } from "unit-tester";

import { reactive } from "../core/reactivity/hooks.mjs";
import { div, span, input, ul, li } from "../core/framework/elements.mjs";
import { component } from "../core/framework/component.mjs";

function wait(time = 0) { return new Promise(resolve => setTimeout(resolve, time))};

const todoList = component(todos => {
  const items = todos();
  if (!items.length) {
    return span({}, "No items found");
  }

  return ul({ }, items.map(todo => li(
    { class: () =>  todo.done.get() ? "green" : "grey" },
    todo.text
  )));
});

export default Tests("component",
  Tests("Base",
    Test("basic component, static content (todo list)", async () => {
      const task1 = { text: "feed cat", done: new reactive(false) };
      const task2 = { text: "clean room", done: new reactive(false) };
      const task3 = { text: "finish assignment", done: new reactive(false) };

      const items = () => [task1, task2, task3];

      const list = await todoList(items);

      assert.equal(list.toString(), `<ul><li class="grey">feed cat</li><li class="grey">clean room</li><li class="grey">finish assignment</li></ul>`);
      await task1.done.set(true);
      assert.equal(list.toString(), `<ul><li class="green">feed cat</li><li class="grey">clean room</li><li class="grey">finish assignment</li></ul>`);
      await task2.done.set(true);
      assert.equal(list.toString(), `<ul><li class="green">feed cat</li><li class="green">clean room</li><li class="grey">finish assignment</li></ul>`);

    }),
    Test("basic component, dynamic content (todo list)", async () => {
      const task1 = { text: "feed cat", done: new reactive(false) };

      const [items,,setItems] = reactive([]);

      const list = await div({}, todoList(items));

      assert.equal(list.toString(), `<div><span>No items found</span></div>`);
      await setItems(items => items.concat(task1));
      assert.equal(list.toString(), `<div><ul><li class="grey">feed cat</li></ul></div>`);
      await task1.done.set(true);
      assert.equal(list.toString(), `<div><ul><li class="green">feed cat</li></ul></div>`);
    }),
  ),
  Tests("#then (rendered)",
    Test("single then", async () => {
      const success = Symbol("success");

      const rendered = await new Promise(async resolve => {
        const [state, setState] = reactive();
        reactive(scope => {
          const value = state();
          if (!scope.firstRun) {
            scope.stop();
            resolve(value);
          }
        });
        const task1 = { text: "feed cat", done: new reactive(false) };
        const [items,,setItems] = reactive([task1]);
        todoList.then((list) => {
          assert.equal(list.toString(), `<ul><li class="grey">feed cat</li></ul>`);
          setState(success);
        });

        const list = div({}, todoList(items));
        assert.notEqual(state(), success);
        assert.equal((await list).toString(), `<div><ul><li class="grey">feed cat</li></ul></div>`);
      });

      assert.equal(rendered, success);
    }),
    Test("chaining then", async () => {
      const success = Symbol("success");

      const rendered = await new Promise(async resolve => {
        const [state, setState] = reactive();
        reactive(scope => {
          const value = state();
          if (!scope.firstRun) {
            scope.stop();
            resolve(value);
          }
        });
        const task1 = { text: "feed cat", done: new reactive(false) };
        const [items,,setItems] = reactive([task1]);
        todoList.then((list, contextData) => {
          assert.equal(list.toString(), `<ul><li class="grey">feed cat</li></ul>`);
          return contextData;
        }).then((data, d) => {
          assert.equal(data, items, "data's not the same");
          setState(success);
        });

        const list = div({}, todoList(items));
        assert.notEqual(state(), success);
        assert.equal((await list).toString(), `<div><ul><li class="grey">feed cat</li></ul></div>`);
      });

      assert.equal(rendered, success);
    })
  )
);
