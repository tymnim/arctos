# alt-html

JavaScript framework to render some interactive html in the browser and on the server.

# Usage Notes

```js
// Creating reactive variable using hooks
const [email, setEmail] = atom("");
// Creating an input element
const inputForm = input({ value: email, on: { input(e) { setEmail(inputForm.value) } } });
// Adding element to our body. Normally this would be done to the "app" function
mount(inputForm);
// Logging email in the console any time it changes.
reactive(scope => {
  console.log(`email is: ${email()}`);
});
```

We can break down this framework into the following parts:

0. Elements: a set of functions to create html elements e.g. `input`, `button`, `div`
1. `element` - an api that is used by all elements to create itself, render children, manipulater attributes and of all of the above reactively
2. Reactivity - a way make some parts of code depend on other or in human language to add interactivity to your webpage without direct dom manipulations
3. `component` - an api to combine elements together and do it reactivly
4. `render` & `mount` - methods to add your components/elements into the webpage.
5. Stores - an api to store something in a long term (internally uses `localStorage` api)
6. SSR - server side rendering seems to get a lot of hype nowadays, so why not? This is a way to generate html code on the server side.

# Getting started

You need to get the code on your page first. It is recommended to use npm module for that.

```shell
~$ npm i alt-html
```

From there it's up to you how to get it on the web site. If you use express or some other node server you can include the code from `node_modules/alt-html/index.mjs` to your bundle or if you just learning and using a local server with `npx serve`, consider just creating a `<script type="importmap">` with the following entery in it `"alt-html": "./node_modules/alt-html/index.mjs"` in your `index.html`.

##### Hello World:

- `index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script type="importmap">
    {
      "imports": {
        "alt-html": "./node_modules/alt-html/index.mjs"
      }
    }
  </script>
  <script type="module" defer src="./main.mjs"></script>
</head>
<body>
</body>
</html>
```

- `main.mjs`
```js
import { mount, h1 } from "alt-html";
mount(h1({}, "Hello World!"));
```


The rest of the code will go into you main JavaScript file and its dependencies.

# Overview

### Elements and `element`

This is pretty straight forward. These are just functions that you would use to create your regular html elements.

To start using them you need to import them on your page
```js
import { input, div } from "/path/to/module/index.mjs"; // use `alt-html`, if decided to use the importmap.
```

##### Basic Elements

Reference:
- `core/framework/elements.mjs`
- `core/framework/element.js`

To create an element you can simply call that function:
```js
console.log(input());
// logs: <input>
```
All elments accept 2 arguments:
- Object containing all of the attributes and event listeners
```js
console.log(input({ class: "my-input" }));
// logs: <input class="my-input">
```
- Element content (children)
```js
console.log(div({}, input()));
// logs: <div><input></div>
```
Also elements may accept arrays, promises or functions as children.
```js
console.log(div({}, [input(), input()]));
// logs: <div><input><input></div>
console.log(div({}, Promise.resolve(input())));
// logs: Promise {<pending>}
```
The entry above is not a bug. Elements are "optionally async". This means that they will try to be syncronious unless one of their dependencies like children or attributes are async. Then they will turn into a Promise.
```js
console.log(await div({}, Promise.resolve(input())));
// logs: <div><input></div>
```
##### Event Listeners

Event listeners are passed along side attributes wrapped in `on: {}`
```js
input({ on: { keyup: (e) => console.log("key pressed") } });
```

### Reactivity

Reference:
- `core/reactivity/hooks.mjs`
- `core/reactivity/core.js`

Reactivity is sincerely trying to be simple, but it is for you to judge. Basic concept is that you have variables that are called reactive and there are some functions that are also called reactive. And those reactive functions depend on reactive variables inside them, causing islelf to rerun any time a reactive variable from inside updates.

```js
import { input, div } from "/path/to/module/index.mjs";
// reactive variable
const [count, setCount] = atom(0);
// reactive function
reactive(() => {
  console.log(`count is: ${count()}`);
}
await setCount(1);
await setCount(2);
```

Element attributes and children may be reactive
```js
const input = input({ value: count });
```

### Components

Reference:
- `core/framework/component.mjs`

Components is a way to combine elements together and add some rendering logic to it

```js
import { component, li, ul, reactive } from "/path/to/module/index.mjs";
function wait(time) { return new Promise(resolve => setTimeout(resolve, time)) }
const list = component(items => {
  items = items();
  if (!items) {
    return "Loading...";
  }
  return ul({}, items.length ? items.map(text => li({}, text)) : "No Items");
});
const [items, setItems] = atom();
wait(3000).then(() => setItems([1,2,3,4]));
mount(list(items));
```

Components use reactive functions internally. One must be careful with unwraping unwanted reactive variables inside a component to avoid redundand DOM updates. If value of reactive variable is needed inside a component/reactive function, but we want to avoid reactivity updates, `nonreactive` hook can be used

### `render` & `mount`

`render` is a method that is created on all of the nodes on the web page. It accepts a component/element, array of such, promise, function or array of functions and will make sure to render such a thing inside of node.
```js
import { render, div, input } from "/path/to/module/index.mjs";
// NOTE: render is a Symbol, but <div>[render] is a method
div()[render](input);
```

`mount` is a `render` called on the body element. Normally all your application will start with passing the main function into it.
```js
import { mount, h1 } from "/path/to/module/index.mjs";
mount(h1({}, "Hello World!"));
```

### Stores

Stores is an api to store something in a long term and make it keep it reactive
```js
import { store, useStore as use } from "/path/to/module/index.mjs";
const userStore = store("user", { name: "default username" });
const [user, setUser] = use(userStore);
```

### SSR

You can use the frame work same way on the server side and produce html code as text

```js
import { h1 } from "alt-html";
console.log(h1({}, "Hello World!").toString());
// logs: <h1>Hello World!</h1>
```
