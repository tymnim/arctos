
import fs from "fs/promises";

function logger(scoped) {
  return (message) => console.log("\t".repeat(scoped) + message);
}

async function test(args) {
  const [node, path, dirpath, filePath] = args;

const files = filePath ? [filePath] : await readDir(dirpath, /\.test\./);

  if (!files.length) {
    return;
  }

  for (let file of files) {
    const testCases = (await import(file)).default;
    console.log("_".repeat(96));
    console.log("\x1b[36m%s\x1b[0m", `\t${file}`);
    const { failed } = await exec(testCases, file);
    if (failed.length) {
      console.log("\n\x1b[31m%s\x1b[0m", `\t\t SOME TESTS FAILED =(\n`)
      failed.forEach(fail => console.log("‼️  \x1b[31m%s\x1b[0m", fail))
    }
    else {
      console.log("\n\x1b[32m%s\x1b[0m", `\t\t ✅|All Tests Passed|✅`)
    }
  }
}

async function exec(testCases, scope, depth = 0, currentLog = logger(0), results = { failed: [] }) {
  for (let testCase of testCases) {
    const log = logger(depth + 1);
    if (testCase instanceof Array) {
      currentLog(`🧪 ${testCase.name}`);
      await exec(testCase, scope + ` -> ${testCase.name}`, depth, log, results);
      continue;
    }
    try {
      await testCase.exec();
      log(`✅  -> ${testCase.name}`);
    }
    catch(e) {
      results.failed.push(scope + ` -> ${testCase.name}`);
      log(`‼️   -> ${testCase.name}\n\t\t(${e.message})`);
      if (e.code !== "ERR_ASSERTION") {
        console.error(e);
      }
    }
  }
  return results;
}

test(process.argv)

async function readDir(path, pattern) {
  return (await fs.readdir(path))
  .filter(file => pattern.test(file))
  .map(file => `./${path}/${file}`);
}
