import { div, span, input, ul, li, ol } from "../index.mjs";
import { atom } from "atomi";
import assert from "assert";

function wait(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * @template {any} T
 * @param {T}       data
 * @param {number}  time
 * @returns {Promise<T>}
 */
async function resolveIn(data, time) {
  await wait(time);
  return data;
}

const divTests = {
  "simple": () => {
    assert.equal(div().toString(), "<div></div>");
  },
  "classes": () => {
    assert.equal(div({ class: "my-div" }).toString(), "<div class=\"my-div\"></div>");
  },
  "div with text": () => {
    assert.equal(div({ id: "unique" }, "I am a div").toString(),
      "<div id=\"unique\">I am a div</div>");
  },
  "div with children": () => {
    const element = div({}, [
      span({}, "hi"),
      span({}, "!")
    ]);
    assert.equal(element.toString(), "<div><span>hi</span><span>!</span></div>");
  },
  "div with some async children": async () => {
    const element = await div({}, [
      span({}, resolveIn("hi", 50)),
      span({}, resolveIn(", ", 800)),
      span({}, resolveIn("Tim", 300)),
      span({}, resolveIn("!", 100))
    ]);
    assert.equal(element.toString(),
      "<div><span>hi</span><span>, </span><span>Tim</span><span>!</span></div>");
  }
};

const spanTests = {
  "classes": () => {
    assert.equal(span({ class: "my-span" }, "I am a span").toString(),
      "<span class=\"my-span\">I am a span</span>");
  },
  "async": async () => {
    const sp = await span({}, resolveIn("hello world", 100));

    assert.equal("<span>hello world</span>", sp.toString());
  },
  "reactive argument update": async () => {
    const [spanClass, setSpanClass] = atom("there-span");
    const sp = span({ class: spanClass });
    assert.equal("<span class=\"there-span\"></span>", sp.toString());
    await setSpanClass("their-span");
    assert.equal("<span class=\"their-span\"></span>", sp.toString());
  }
};

const inputTests = {
  "reactive value update": async () => {
    const [value, setValue] = atom("");
    const inputElement = input({ value });
    assert.equal(inputElement.toString(), "<input value=\"\">");
    await setValue("hello");
    assert.equal(inputElement.toString(), "<input value=\"hello\">");
  },
  "[type='checkbox']": async () => {
    const [checked, setChecked] = atom(false);
    const inputElement = input({ type: "checkbox", checked: checked });
    assert.equal(inputElement.toString(), "<input type=\"checkbox\" checked=\"false\">");
    await setChecked(true);
    assert.equal(inputElement.toString(), "<input type=\"checkbox\" checked=\"true\">");
  }
};

const elementTests = {
  "<div>": divTests,
  "<span>": spanTests,
  "<input>": inputTests,
  "<ul>": {
    "basic list": () => {
      const list = ul();
      assert.equal(list.toString(), "<ul></ul>");
    },
    "list with children": () => {
      const list = ul({}, [1, 2, 3].map(number => li({}, number)));
      assert.equal(list.toString(), "<ul><li>1</li><li>2</li><li>3</li></ul>");
    }
  },
  "<ol>": {
    "basic list": () => {
      const list = ol();
      assert.equal(list.toString(), "<ol></ol>");
    },
    "list with async children": async () => {
      const list = await ol({}, [1, 2, 3].map(number => li({}, resolveIn(number.toString(), 200))));
      assert.equal(list.toString(), "<ol><li>1</li><li>2</li><li>3</li></ol>");
    },
    "list with reactive children (append, remove children)": async () => {
      const [children, setChildren] = atom([1, 2, 3]);
      const list = await ol({}, () => children().map(number => li({}, number.toString())));
      assert.equal(list.toString(), "<ol><li>1</li><li>2</li><li>3</li></ol>");
      setChildren([1, 2, 3, 4]);
      await wait(100);
      assert.equal(list.toString(), "<ol><li>1</li><li>2</li><li>3</li><li>4</li></ol>");
      setChildren([1, 2]);
      await wait(100);
      assert.equal(list.toString(), "<ol><li>1</li><li>2</li></ol>");
    }
  }
};

const attributeTests = {
  "string": async () => {
    const element = div({ class: "container" });
    assert.equal(element.toString(), "<div class=\"container\"></div>");
  },
  "function -> string": async () => {
    const element = div({ class: () => "container" });
    assert.equal(element.toString(), "<div class=\"container\"></div>");
  },
  "atom": async () => {
    const [className, setClassName] = atom("container");
    const element = div({ class: className });
    assert.equal(element.toString(), "<div class=\"container\"></div>");
    await setClassName("container-1");
    assert.equal(element.toString(), "<div class=\"container-1\"></div>");
  },
  "Promise": async () => {
    const element = await div({ class: wait(100).then(() => "container") });
    await wait(200);
    assert.equal(element.toString(), "<div class=\"container\"></div>");
  },
  "function -> Promise": async () => {
    const element = await div({ class: () => wait(100).then(() => "container") });
    await wait(200);
    assert.equal(element.toString(), "<div class=\"container\"></div>");
  },
  "bind": async () => {},
  "Class map": async () => {
    const [visible, setVisible] = atom(false);
    const container = div({ class: { container: true, visible } });
    assert.equal(container.toString(), "<div class=\"container\"></div>");
    await setVisible(true);
    assert.equal(container.toString(), "<div class=\"container visible\"></div>");
    await setVisible(false);
    assert.equal(container.toString(), "<div class=\"container\"></div>");
  }
};

export default {
  "Element Tests": elementTests,
  "Attrbute Tests": attributeTests
};
