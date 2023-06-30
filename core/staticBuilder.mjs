import { Document, docRegistery } from "./static.mjs";
import { join } from "node:path";
import { readdir, mkdir, writeFile, readFile } from "node:fs/promises";

export class StaticBuilder {
  constructor({
    input = ["./views"],
    output = "./build",
    watch = false,
    log = false,
    workDir = process.cwd(),
    match = ".static.mjs"
  }) {
    this.workdir = workDir;
    this.inputPaths = input;
    this.outputPath = join(this.workdir, output);
    this.watch = watch;
    this.logging = log;
    this.match = match;
  }

  log(message) {
    if (this.logging) {
      console.log(message);
    }
  }

  async _inputFiles() {
    return (await Promise.all(this.inputPaths.map(dir => {
      return readdir(join(this.workdir, dir)).then(files => {
        return files
        .filter(file => file.includes(this.match))
        .map(file => join(dir, file));
      });
    }))).flat();
  }

  async build() {
    for (let path of await this._inputFiles()) {
      const document = docRegistery.push(new Document(path));
      this.log(`⏳ compling: ${path}`);
      const view = await import(join(this.workdir, path));
      this.log(`✅ compiled ${path} as ${view.name || path}`);
    }
  }

  async output() {
    const outputDir = await mkdir(this.outputPath, { recursive: true });
    while(docRegistery.current) {
      const name = docRegistery.current.path.split("/").at(-1).replace(".mjs", ".html");
      this.log(`✏️ Saving ${docRegistery.current.path} as ${name}`);
      await writeFile(join(this.outputPath, name), docRegistery.current.toString());
      docRegistery.pop();
    }
  }
}
