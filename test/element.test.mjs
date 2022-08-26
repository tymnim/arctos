
import { div, span } from "../core/framework/elements.mjs";
import assert from "assert";
import { Tests, Test } from "unit-tester";

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
  })
);

const spanTests = Tests("<span>",
  Test("classes", () => {
    assert.equal(span({ class: "my-span" }, "I am a span").toString(), `<span class="my-span">I am a span</span>`);
  })
);

export default [divTests, spanTests];
