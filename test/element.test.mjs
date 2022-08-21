
import { div, span } from "../core/framework/elements.mjs";
import assert from "assert";

const divTests = [
  {
    name: "simple",
    exec() {
      assert.equal(div().toString(), "<div></div>");
    }
  },
  {
    name: "classes",
    exec() {
      assert.equal(div({ class: "my-div" }).toString(), `<div class="my-div"></div>`);
    }
  },
  {
    name: "div with text",
    exec() {
      assert.equal(div({ id: "unique" }, "I am a div").toString(), `<div id="unique">I am a div</div>`);
    }
  },
  {
    name: "div with children",
    exec() {
      const element = div({}, [
        span({},"hi"),
        span({},"!")
      ]);
      assert.equal(element.toString(), `<div><span>hi</span><span>!</span></div>`);
    }
  }
];
divTests.name = "<div>";

const spanTests = [
  {
    name: "classes",
    exec() {
      assert.equal(span({ class: "my-span" }, "I am a span").toString(), `<span class="my-span">I am a span</span>`);
    }
  },
];
spanTests.name = "<span>";
const inputTests = [

]
spanTests.name = "<span>";

// const ssrTest = [
//   name: "<div>",
//   async exec() {
//     assert.equal((div().toString()), "<div></div>");
//   }
// }]

export default [divTests, spanTests];
