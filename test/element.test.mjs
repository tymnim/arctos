
import { div, span, input, ul, li, ol } from "../core/framework/elements.mjs";
import { reactive } from "../core/reactivity/hooks.mjs";
import assert from "assert";
import { Tests, Test } from "unit-tester";

function wait(time) { return new Promise(resolve => setTimeout(resolve, time)) }
String.prototype.in = async function(time) { await wait(time); return this; }

const divTests = Tests("<div>",
  Test("simple", () => {
    assert.equal(div().toString(), "<div></div>");
  }),
  Test("classes", () => {
    assert.equal(div({ class: "my-div" }).toString(), `<div class="my-div"></div>`);
  }),
  Test("div with text", () => {
    assert.equal(div({ id: "unique" }, "I am a div").toString(), `<div id="unique">I am a div</div>`);
  }),
  Test("div with children", () => {
    const element = div({}, [
      span({}, "hi"),
      span({}, "!")
    ]);
    assert.equal(element.toString(), `<div><span>hi</span><span>!</span></div>`);
  }),
  Test("div with some async children", async () => {
    const element = await div({}, [
      span({}, "hi".in(50)),
      span({}, ", ".in(800)),
      span({}, "Tim".in(300)),
      span({}, "!".in(100))
    ]);
    assert.equal(element.toString(), `<div><span>hi</span><span>, </span><span>Tim</span><span>!</span></div>`);
  })
);

const spanTests = Tests("<span>",
  Test("classes", () => {
    assert.equal(span({ class: "my-span" }, "I am a span").toString(), `<span class="my-span">I am a span</span>`);
  }),
  Test("async", async () => {
    const sp = await span({}, "hello world".in(100));

    assert.equal("<span>hello world</span>", sp.toString());
  }),
  Test("reactive argument update", async () => {
    const [spanClass, setSpanClass] = reactive("there-span");
    const sp = span({ class: spanClass });
    assert.equal(`<span class="there-span"></span>`, sp.toString());
    setSpanClass("their-span");
    await wait(100);
    assert.equal(`<span class="their-span"></span>`, sp.toString());
  }),
);

const inputTests = Tests("<input>",
  Test("reactive value update", async () => {
    const [value, setValue] = reactive("");
    const inputElement = input({ value });
    assert.equal(inputElement.toString(), `<input value="">`);
    setValue("hello");
    await wait(100);
    assert.equal(inputElement.toString(), `<input value="hello">`);

  }),
  Test("[type='checkbox']", async () => {
    const [checked, setChecked] = reactive(false);
    const inputElement = input({ type: "checkbox", checked: checked });
    assert.equal(inputElement.toString(), `<input type="checkbox" checked="false">`);
    setChecked(true);
    await wait(100);
    assert.equal(inputElement.toString(), `<input type="checkbox" checked="true">`);
  })
);

export default [
  divTests,
  spanTests,
  inputTests,
  Tests("<ul>",
    Test("basic list", () => {
      const list = ul();
      assert.equal(list.toString(), "<ul></ul>");
    }),
    Test("list with children", () => {
      const list = ul({}, [1,2,3].map(number => li({}, number)));
      assert.equal(list.toString(), "<ul><li>1</li><li>2</li><li>3</li></ul>");
    })
  ),
  Tests("<ol>",
    Test("basic list", () => {
      const list = ol();
      assert.equal(list.toString(), "<ol></ol>");
    }),
    Test("list with async children", async () => {
      const list = await ol({}, [1,2,3].map(number => li({}, number.toString().in(200))));
      assert.equal(list.toString(), "<ol><li>1</li><li>2</li><li>3</li></ol>");
    }),
    Test("list with reactive children (append, remove children)", async () => {
      const [children, setChildren] = reactive([1, 2, 3]);
      const list = await ol({}, () => children().map(number => li({}, number.toString())));
      assert.equal(list.toString(), "<ol><li>1</li><li>2</li><li>3</li></ol>");
      setChildren([1, 2, 3, 4]);
      await wait(100);
      assert.equal(list.toString(), "<ol><li>1</li><li>2</li><li>3</li><li>4</li></ol>");
      setChildren([1, 2]);
      await wait(100);
      assert.equal(list.toString(), "<ol><li>1</li><li>2</li></ol>");
    })
  )
];
