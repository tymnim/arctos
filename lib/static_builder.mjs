#! node

import { StaticBuilder } from "../core/staticBuilder.mjs";
import { readFile } from "node:fs/promises";

const argsMap = {
  "input": ["-i", "--input"],
  "output": ["-o", "--output"],
  "log": ["-l", "--log", "-lw", "-wl"],
  // TODO: implement watch files and its dependencies change
  "watch": ["-w", "--watch", "-lw", "-wl"],
  // "importMap": ["-m", "--import-map"]
  "config": ["-c", "--config"],
  "match": ["-m", "--match"]
};

const pluralParams = ["input"]

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
      if (pluralParams.includes(param)) {
        params[param] = params[param] ? params[param].concat(value) : [value];
      }
      else {
        params[param] = value;
      }
    }
  })
}

const config = params.config ? JSON.parse(await readFile(params.config)) : {};

const builder = new StaticBuilder({ workDir: process.cwd(), ...config, ...params });

await builder.build();
await builder.output();
