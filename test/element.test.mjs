
import { div, span } from "../core/framework/elements.mjs";
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
      span({},"hi"),
      span({},"!")
    ]);
    assert.equal(element.toString(), `<div><span>hi</span><span>!</span></div>`);
  }),
  Test("div with some async children", async () => {
    const element = await div({}, [
      span({},"hi".in(50)),
      span({},", ".in(800)),
      span({},"Tim".in(300)),
      span({},"!".in(100))
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

export default [divTests, spanTests];
