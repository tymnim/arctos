import { Document, getDocument, defineDocument } from "./static.mjs";
import { join, dirname } from "node:path";
import { readdir, mkdir, writeFile, readFile } from "node:fs/promises";

/**
 * @param inputFolder[]
 * @param workdir
 * @return fileList[] - filenames prefixed with respective input folder
 **/
async function inputFiles(inputPaths, workdir, match) {
  const folders = inputPaths.map(async dir => {
    const files = await readdir(join(workdir, dir));
    return files
    .filter(file => match.test(file))
    .map(file => join(dir, file))
  });
  return (await Promise.all(folders)).flat();
}

const documentRegistery = new Map();

// TODO: concurrent compilation and building (worker threads)
// TODO: Observe module changes and module dependecy changes
export class StaticBuilder {
  constructor({
    input = ["./views"],
    output = "./build",
    watch = false,
    log = false,
    workdir = process.cwd(),
    match = ".static.mjs"
  }) {
    this.workdir = workdir;
    this.inputPaths = input;
    this.outputPath = join(this.workdir, output);
    this.watch = watch;
    this.logging = log;
    this.match = new RegExp(match);
  }

  log(message) {
    if (this.logging) {
      console.log(message);
    }
  }

  async build() {
    const paths = inputFiles(this.inputPaths, this.workdir, this.match);
    for (let path of await paths) {
      // NOTE: this must be done before importing the page
      defineDocument(path);
      this.log(`⏳ compling: ${path}`);
      const document = (await import(join(this.workdir, path))).default;
      documentRegistery.set(path, document);
      this.log(`✅ compiled ${path} as ${document.path}`);
    }
  }

  async output() {
    const outputDir = await mkdir(this.outputPath, { recursive: true });
    for (let [path, document] of documentRegistery.entries()) {
      const name = document.path.replace(".mjs", ".html");
      this.log(`✏️ Saving ${document.path}`);
      const fullPath = join(this.outputPath, name);
      await mkdir(dirname(fullPath), { recursive: true });
      await writeFile(join(this.outputPath, name), document.toString());
      this.log(`✅ Saved ${name}`);
    }
  }
}

