# ARCTOS

A JavaScript framework to render some interactive html in the browser and on the server.

# Motivation

It is a success when it fulfils the following criteria:

- Functional looking code (as much as you can with JS)
- Built-in reactivity
- All component code must be able to fit into one file (no .html, .css, .js)
- Components must work in isolation from each other
- Bonus points for SSR and static site compilation

# Table of contents

<!--ts-->
  * [Spoilers](#spoilers)
  * [Installation](#installation)
  * [Usage](#usage)
    * [Elements](#elements)
        * [Basic Elements](#basic-elements)
        * [Event Listeners](#event-listeners)
        * [Data Attributes](#data-attributes)
        * [Nested Elements](#nested-elements)
        * [Async Elements](#async-elements)
        * [Class Map](#class-map)
    * [Render/Mount](#rendermount)
    * [Custom Elements](#custom-elements)
    * [Reactivity](#built-in-reactivity)
    * [Attribute Binding](#attribute-binding)
    * [`once` element](#once-element)
    * [Components](#components)
    * [Styling](#styling)
    * [Static Compilation](#static-compilation)
        * [Built-in CLI Compiler](#built-in-cli-compiler)
        * [Creating static files](#creating-static-files)
        * [Client-side Scripts](#client-side-scripts)
    * [SSR](#ssr)
<!--te-->

# Spoilers

```js
import { mount, button, input, div, span, css, br } from "arctos"
import { atom, inc } from "atomi"

const style = css`
.counter {
  display: flex;
  flex-direction: column;
  align-items: center;
}
`

function app() {
  const [counter,, setCounter] = atom(0)
  return div({ class: style.counter }, [
    span({}, () => `Counter is: ${counter()}`),
    button({ on: { click() { setCounter(inc) } } }, "+")
  ])
}

mount(app)
```

# Installation

```
npm i arctos
```

# Usage

### Elements

```js
import { div, span, button } from "arctos"
```

All html tags are represented by functions. The full list of elements can be found in [core/elements.mjs](https://github.com/tymnim/alt-html/blob/master/core/elements.mjs).

Element function explanation:
```js
elementName({ ...attributes, data: { ...attributes }, on: { ...eventListeners }, children)
```

`atrributes` and `data-atributes` can be strings or functions that return a string.

`eventListeners` are a dictionary `{ <string>: <function> }` where keys are event names and the values event listeners.

`childredn` of an element can be: elements or strings, or arrays, promises, and functions that unlimately resolve into elements or strings.

Note that if any of the children are promises, current element will return a promise too. It will resolve when all children are resolved and it's ready to render. See [Async Elements](#async-elements) for more information.

###### Basic Elements
```js
// <span id="text">Hello World!</span>
const text = span({ id: "text" }, "Hello World!")
```

###### Event Listeners
```js
// <button>Click!</button>
const btn = button({ on: { click() { console.log("Hello World!") } } }, "Click!")
```

###### Data attributes
```js
// <button data-target="world">Hello!</button>
const btn = button({ data: { target: "world" }, on: { click(e) { console.log(`Hello ${btn.dataset.target}!) } })
```

###### Nested Elements:
```js
// <div class="container"><span>Hello World</span></div>
div({ class: "container" }, span({}, "Hello World"))
```

###### Async Elements:
```js
// <span>Hello World</span>
await span({}, new Promise(resolve => setTimeout(() => resolve("Hello World"), 1000)))
```

###### Class Map:
```js
const [isVisible, setVisible] = atom(false);
const container = div({ class: { container: true, visible: isVisible } })

// <div class="container"></div>
console.log(container);

await setVisible(true);

// <div class="container visible"></div>
console.log(container)
```

All element functions are "optionally async". This means that they normally will resolve into an element immidiately unless a promise is encountered among the children.

### Render/Mount

```js
import { render, mount } from "arctos"
```

Elements and components can be added into the dom tree by using `Node[render]` [rendrer.mjs](https://github.com/tymnim/alt-html/blob/master/core/renderer.mjs) method that is present on all elements.

```js
import { render, span } from "arctos"

const text = span({}, "Hello world!")
document.body[render](text)
```

The code above will render `<span>Hello world!</span>` inside the `<body>`.

`render` is a Symbol that's been added to the Node prototype. This allows the elements to be renderer anywhere in an existing dom tree. This way the root of your application can be anywhere.

Note that `render` acting just the same as `Node.appendChild` method, but it also can to accept functions, promises, arrays of elements or strings, not just elements.

`mount` is a special case of `render` that is applied on the `document.body`.

```js
import { mount, h1 } from "arctos"

function app() {
    return h1({ align: "center" }, "Hello World!")
}

// NOTE: a shorthand to document.body[render]
mount(app) // or mount(app()) in case you'd need to pass some arguments to the app
```

### Custom Elements

All elemert functions are just fancy wrappers around actual HTML Elements. All of them utilize internal function `element` [/core/element.mjs](https://github.com/tymnim/alt-html/blob/master/core/element.mjs).

An example is `span` function from [/core/elements.mjs](https://github.com/tymnim/alt-html/blob/master/core/elements.mjs):

```js
export function span(...args) {
  return element("span", args)
}
```

This also allows to create custom elements.

```js
import { element } from "arctos"

class WordCount extends HTMLParagraphElement {
  constructor() {
    super()
    // Element functionality written in here
  }
}

customElements.define("word-count", WordCount, { extends: "p" })

export function wordCount(...args) {
    return element("word-count", args)
}
```

### Reactivity

Arctos uses [atomi](https://github.com/tymnim/atomi) for its reactivity. You can find all the documentation about it on the [atomi's github page](https://github.com/tymnim/atomi).

Reactivity is used to add interactivity to your elements. Elements internally utilize reactivity to mutate dom. An example of this is attributes and children. They both, an attribute and a child, can be represented by an `atom`.

In other languages concept of an `atom` is represented by states(React), signals(SolidJS, Angular) or reactive declarations(Svelte). Conceptually they all are the same. They all are used to store some state, share the state with a reactive function (`useEffect`, `autorun`, `$:`) and then invoke that function when the state changes.

```js
// logs counter any time it changes
reactive(function() {
    console.log(`Count is ${counter()}`)
})
```

Atoms can be passed to elements directly or wraped in a function(see the example bellow). The invokation of an atom inside of a function keeps the reactivity so if you have a structure like `A` calls `B`, `B` calls `C` and `C` invokes an atom inside and `A` is called inside a `reactive scope`, the atom will be regitered as a dependency of such scope.

```js
const [counter, setCounter] = atom(0)
const A = () => B()
const B = () => C()
const C = () => counter()
// This will be triggered any time counter updates
reactive(() => console.log(A()))
```

All functions that are passed as attributes or children to an element are executed in a `reactive scope`. See `bindAttribute` in [/core/element.mjs](https://github.com/tymnim/alt-html/blob/static-builder/core/element.mjs#L62).


```js
import { atom, reactive } from "atomi"
import { span, mount } from "arctos"

const [time,, setTime] = atom(0)

// NOTE: that data-time will be updated reactively in the dom because
//       time is passed as a function to the element and it will be executed inside a reactive scope
//       and data-original is not reactive because it's called when creating data object,
//       not inside a reactive scope
mount(span({ data: { time: time, original: time() } }, () => `You've been ${time()} seconds on this page`))

setInterval(() => setState(s => s + 1), 1000)
```

Password validation code example:

```js
import { atom, guard, reactive } from "atomi"
import { span, input, button, mount, div, br } from "arctos"

const rules = [
    { text: "contain at least one special character", test: text => /[^A-Za-z0-9]/.test(text) },
    { text: "contain at least one upper case character", test: text => /[A-Z]/.test(text) },
    { text: "contain at least one number", test: text => /[0-9]/.test(text) },
    { text: "be at least 8 characters long", test: text => text.length > 7 }
]

function passwordField(rulesToSatisfy = 3) {
    const [password, setPassword] = atom("")
    const [valid, setValid] = atom()

    reactive(() => {
        // NOTE: Triggered by password change. Sets valid. Also, we call password multiple times
        //       while iterating through the rules, but this is fine, it will be registered only once
        setValid(rules.filter(rule => rule.test(password())).length >= rulesToSatisfy)
    })

    const passwordInput = input({
        type: "password",
        value: password,
        placeholder: "password",
        on: {
            input() { setPassword(passwordInput.value) }
        }
    })

    const userWarning = span({
        style: () => `color: ${!valid() ? "red" : "green"}`
    }, () => {
        // NOTE: this function accesses valid, hence it will trigger any time valid changes.
        //       To improve performance, we wrapped it in guard hook. This way
        //       it will not trigger twice if valid is set to false multiple times while the user's typing
        if (!guard(valid)) {
            return `Your password must satisfy at least ${rulesToSatisfy} of the following rules: ${rules.map(r => r.text).join(", ")}`
        }
        return "Strong password"
    })

    return div({ class: "container" }, [
        passwordInput,
        button({
            disabled: () => !valid(),
            on: { click() { if (valid()) { alert(`Good Job! Your password is ${password()}`) } } }
        }, "Submit"),
        br(),
        userWarning
    ])
}

mount(passwordField(3))
```

### Attribute Binding

Attribute binding can be used on:

- `input({ value: bind(atom) })`
- `select({ value: bind(atom) }, [...])`
- `input({ type: "checkbox|radio", checked: bind(atom) })`

```js
import { atom } from "atomi"
import { input, bind } from "arctos"

const [name] = atom("")
reactive(() => {
    console.log(name())
})

input({ type: "text", value: bind(name) }) // console.log name when input's value changes
```

### `once` Element

`once` can be used to lazy-render elements on the page

```js
import { div, once } from "arctos"
import { atom } from "atomi"

const [ready, setReady] = atom(flase)
div({}, once(ready, () => "It's just a string but can be a complex element to render"))
```

### Components

See: [core/component.mjs](https://github.com/tymnim/alt-html/blob/master/core/component.mjs).

### Styling

See: [core/cssParser.mjs](https://github.com/tymnim/alt-html/blob/master/core/cssParser.mjs).

```js
import { css, importCssFrom } from "arctos"
```

Component specific styling is done through `css` and `importCssFrom` methods.

```
const color = "red"
const styles = css`
    .centered-colored {
        color: ${color};
        display: flex;
        justify-content: center;
    }
`

const container = div({ class: styles.centeredColored }, "hello world")
```

`css` method creates an isolated styles map so the classes can be used by your components without fear of redefining an existing class.

If you prefer to keep your css separate from your code you can use `importCssFrom`

```js
import { importCssFrom } from "arctos"

const styles = importCssFrom("./styles.css")

const container = div({ class: styles.centeredColored }, "hello world")
```

### Static Compilation

acrctos has a way to statically compile code into servable html files

Example:

`/layouts/main.mjs`
```js
import { head, body, meta } from "arctos"

export function mainLayout(content) {
  return [
    head({}, [
      meta({ name: "viewport", content: "width=device-width, initial-scale=1.0" }),
      meta({ charset: "UTF-8" })
    ]),
    body({}, content)
  ]
}
```

`/counter.static.mjs`
```js
import { Document, clientScript, button, div, span, css } from "arctos"
import { mainLayout } from "./layouts/main.mjs"

const style = css`
  .counter {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

function app() {
  // const [counter,, setCounter] = atom(0)
  return div({ class: style.counter }, [
    span({ id: "counterText" }, () => `Counter is: 0`),
    button({ id: "inc" }, "+")
  ])
}

const [head, body] = mainLayout(app())

clientScript(async () => {
  const { reuse } = await import("arctos")
  const { atom, inc } = await import("atomi")

  const [count,, setCount] = atom(0)
  reuse(document.querySelector("#inc"), { on: { click() { setCount(inc) } } }, "+")
  reuse(document.querySelector("#counterText"), {}, () => `Counter is: ${count()}`)
})

export default Document({
  title: "Counter",
  path: "home/counter",
  importmap: { some_module: "node_modules/some_module/.index.mjs" },
  head,
  body
})
```

This code produced:

`/build/counter.html`
```html
<!DOCTYPE html>
<html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta charset="UTF-8"><style>.counter-3iaydslpb1m { display: flex; flex-direction: column; align-items: center; }</style><script type="importmap">{"imports":{"atomi":"/node_modules/atomi/index.mjs","arctos":"/node_modules/arctos/index.mjs","some_module":"node_modules/some_module/.index.mjs"}}</script><title>Counter</title><script defer="true" type="module">
  const { reuse } = await import("arctos")
  const { atom, inc } = await import("atomi")

  const [count,, setCount] = atom(0)
  reuse(document.querySelector("#inc"), { on: { click() { setCount(inc) } } }, "+")
  reuse(document.querySelector("#counterText"), {}, () => `Counter is: ${count()}`)
</script></head><body><div class="counter-3iaydslpb1m"><span id="counterText">Counter is: 0</span><button id="inc">+</button></div></body></html>
```

###### Built-in CLI Compiler

arctos has an built-in compiler to html. It lives in [arctos/lib/static_builder.mjs](https://github.com/tymnim/alt-html/blob/master/lib/static_builder.mjs).

```bash
./node_modules/arctos/lib/static_builder.mjs
    [--input/-i input_folder_1]
    [-i input_folder_n]
    [--output/-o output_folder]
    [--log/-l]
    [--match/-m .static.mjs]
    [--config/-c config_file.json]
```
Config File Example:

```json
{
  "log": true,
  "output": "./build",
  "input": [
    "test/views/"
  ],
  match: ".static."
}
```

Note that you can specify all settings in the config file and pass it along side the other flags, but the command line flags will override the settings in the config file.

###### Creating static files

```js
export default Document({
  title: "Page Title",
  path: "path/to/file/inside/the/output/folder[.html]",
  importmap: { "some_module": "path/to/some/module.mjs" },
  head,
  body
})
```

[/core/static.mjs](https://github.com/tymnim/alt-html/blob/master/core/static.mjs) is the module that handles all static compilation.

###### Client-side Scripts

When compiling into html to provide interactivity to your page, you might want to provide some client side scripts. For that, see `clientScript` method in [/core/static.mjs](https://github.com/tymnim/alt-html/blob/master/core/static.mjs).

If you need to add reactivity to your html elements, you can use `reuse` method.

```js
reuse(document.querySelector("#inc"), { on: { click() { setCount(inc) } } }, "+")
reuse(document.querySelector("#counterText"), {}, () => `Counter is: ${count()}`)
```

By default all statically compiled files will also have an importmap containing path to `arctos` and `atomi` pointing at the module's `index.mjs` in `node_modules`, so you can just import from `atomi` or `arctos` in your client side script.

To override the default path, you can provide `importmap: { "atomi": "...", arctos: "..." }` parameter in your document configuration.

### SSR

SSR is just a static compilation process, but one that is done in the runtime.

All element functions can be used in your node environment and converted to string using `.toString()` method to be served to the client. See [/core/ssr.mjs](https://github.com/tymnim/alt-html/blob/master/core/ssr.mjs) for more information on `Node` behaviour on the server side.

See `_Document` in [/core/static.mjs](https://github.com/tymnim/alt-html/blob/master/core/static.mjs) to learn how to render pages on the server side and serve them to clients.

