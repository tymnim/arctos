
import { reactive } from "/core/reactivity/hooks.mjs";

console.log("script mounted");

const counter = document.getElementById("counter");
const inc = document.getElementById("inc");
const desc = document.getElementById("desc");

const [count, setCount] = reactive(0);
const [countMinusOne, setCountMinusOne] = reactive(count());

inc.addEventListener("click", e => setCount(count() + 1));
desc.addEventListener("click", e => setCount(count() - 1));

const scope = reactive(() => {
  const current = count();

  console.log("count dependand function");
  counter.innerText = `counter is ${current}`;
});

reactive(() => {
  console.log("count dependand function 2");
  setCountMinusOne(count());
});

reactive(() => {
  console.log("count-1 dependand function", countMinusOne());
});

reactive(() => {
  console.log("both variable dependand function");
  count();
  countMinusOne();
});

