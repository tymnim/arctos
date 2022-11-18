# alt-html

JavaScript framework to render some interactive html in the browser and on the server.

# Usage Notes

```js
// Creating reactive variable using hooks
const [email, setEmail] = reactive("");
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
4. `renderer` & `mount` - methods to add your components/elements into the webpage.
5. Stores - an api to store something in a long term (internally uses `localStorage` api)
6. SSR - server side rendering seems to get a lot of hype nowadays, so why not? This is a way to generate html code on the server side.

# Getting started

