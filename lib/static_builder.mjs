#! node

import { StaticBuilder } from "../core/staticBuilder.mjs";
import { readFile } from "node:fs/promises";

const ARGS_MAP = {
  "input": ["-i", "--input"],
  "output": ["-o", "--output"],
  "log": ["-l", "--log", "-lw", "-wl"],
  // TODO: implement watch files and its dependencies change
  "watch": ["-w", "--watch", "-lw", "-wl"],
  // "importMap": ["-m", "--import-map"]
  "config": ["-c", "--config"],
  "match": ["-m", "--match"]
};

const PLURAL_ARGS = ["input"];

async function getConfig(args = process.argv.slice(2)) {
  const params = {};
  for (let i = 0; i < args.length; i += 1) {
    const values = Object.entries(ARGS_MAP).filter(([param, flags]) => flags.includes(args[i]));
    values.forEach(([param]) => {
      if (["watch", "log"].includes(param)) {
        params[param] = true;
      }
      else {
        i += 1;
        const value = args[i];
        if (PLURAL_ARGS.includes(param)) {
          params[param] = params[param] ? params[param].concat(value) : [value];
        }
        else {
          params[param] = value;
        }
      }
    })
  }

  const config = params.config ? JSON.parse(await readFile(params.config)) : {};
  return { workdir: process.cwd(), ...config, ...params };
}

const builder = new StaticBuilder(await getConfig());

await builder.build();
await builder.output();

