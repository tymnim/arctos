#!node

import { StaticBuilder } from "../core/staticBuilder.mjs";

const argsMap = {
  "input": ["-i", "--input"],
  "output": ["-o", "--output"],
  "log": ["-l", "--log", "-lw", "-wl"],
  "watch": ["-w", "--watch", "-lw", "-wl"]
};


const args = process.argv.slice(2);
const params = {};
for (let i = 0; i < args.length; i += 1) {
  const values = Object.entries(argsMap).filter(([param, flags]) => flags.includes(args[i]));
  values.forEach(([param]) => {
    if (["watch", "log"].includes(param)) {
      params[param] = true;
    }
    else {
      i += 1;
      const value = args[i];
      params[param] = value;
    }
  })
}

const builder = new StaticBuilder(params);

await builder.build();
await builder.output();
