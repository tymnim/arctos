import { Document, docRegistery, pathRegistery } from "./static.mjs";
import { join } from "node:path";
import { readdir, mkdir, writeFile } from "node:fs/promises";


// NOTE: code is node.js specific
export class StaticBuilder {
  constructor({ input = "./views", output = "./build", watch = false, log = false }) {
    this.inputPath = join(process.cwd(), input);
    this.outputPath = join(process.cwd(), output);
    this.watch = watch;
    this.logging = log;
  }

  log(message) {
    if (this.logging) {
      console.log(message);
    }
  }


  async build() {
    for (let path of await readdir(this.inputPath)) {
      const document = docRegistery.push(new Document(path));
      this.log(`⏳ compling: ${path}`);
      const view = await import(join(this.inputPath, path));
      this.log(`✅ compiled ${path} as ${document.path}`);
    }
  }

  async output() {
    const outputDir = await mkdir(this.outputPath, { recursive: true });
    while(docRegistery.current) {
      const name = docRegistery.current.path.replace(".mjs", ".html");
      this.log(`✏️ Saving ${docRegistery.current.path} as ${name}`);
      await writeFile(join(this.outputPath, name), docRegistery.current.toString());
      docRegistery.pop();
    }
  }
}
