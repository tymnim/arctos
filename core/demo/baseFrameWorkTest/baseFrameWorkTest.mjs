
// purpuse: render p tag with text that is received from a promise in 1;
// while it's not received it should print loading
// as soon as it loads it should set class .redFont

import { reactive, reactiveState } from "/core/reactivity/hooks.mjs";
import { button, span, input, Body, component } from "/core/framework/core.mjs";

// const text1 = span({ class: "red", id: "red-text" }, "I should be red");
// const text2 = span({ class: "blue", id: "red-text" }, "I should be blue");
// const text3 = span({}, [
//   "Click on the button:",
//   button({
//     id: "the-button",
//     data: { target: "something", id: "something-else", name: "a-button" },
//     on: {
//       click: e => { console.log("click", e) }
//     } },
//     "yeah, click on me"
//   )
// ]);

const friendCard = component((name, checked, setChecked) => {//console.log(`📗 - friend card created (${name})`);
  console.log(`📕 - friend card created (${name})`);
  const card = span({ class: "friend-card" }, [
    input({
      data: { target: name },
      checked,
      type: "checkbox",
      on: { change: e => setChecked(e.currentTarget.checked) }
    }),
    span({ class: () => `friend-name ${checked() ? "active" : ""}` }, name)
  ]);

  return card;
}).then((cardElement, [name]) => {
  // currentData is the array or arguments passed to the component as contextData
  // console.log(`friendCard rendered for { ${name} }`, `card element height is: ${cardElement.clientHeight}`);
  return 2;
}).then(res => {
  // console.log(`then chaining test. It should be two: ${res}`);
}).finally(([name]) => {
  // console.log(`friendCard destroyed for { ${name} }`);
});

const friends = [
  { name: "tim", isChecked: new reactive(false) },
  { name: "tom", isChecked: new reactive(false) },
  { name: "jake", isChecked: new reactive(false) }
];

friends.forEach(friend => {
  reactive(() => {
    console.log(`current state of ${friend.name} is ${friend.isChecked.get() ? "checked" : "unchecked"}.`);
  });
});

const friendCards = friends.map(({ name, isChecked }) => {
  const [checked, setChecked] = reactiveState(isChecked);
  const card = friendCard(name, checked, setChecked);
  return card;
});

Body.render(...friendCards);

// console.log(button, span, button(), span());



// function app() {

//   const [text, setText] = reactive("");

//   wait(3000).then(() => setText("Hello world!"));

//   const loading = loader();

//   reactive(() => {
//     const greeting = text();

//     if (text) {
//       render(p({ class: "redFont" }).then(() => greeting);
//     } else {
//       render(loading);
//     }
//   });

// }

// function loader(loadingText /* what if it's reactive */) {
//   const [dots, setDots] = reactive(0);
//   const [text, setText] = reactive("Loading...");
//   // TODO: destroy scopes and variables when the element is destroyed
//   reactive(() => {
//     setText(`Loading${".".repeat(dots() % 3)}`);
//   });

//   // TODO: figure a way to clear intervals timeouts of destroyed templates
//   setInterval(() => setDots(dots() + 1), 400);

//   const loaderElement = p({ class: "loader" }, text);

//   return loader;
// }
