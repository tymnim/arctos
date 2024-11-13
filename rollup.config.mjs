import terser from "@rollup/plugin-terser";

export default {
  input: "index.mjs",
  output: {
    file: "dist/bundle.mjs",
    format: "es",
    compact: true
  },
  external: ["atomi"],
  plugins: [terser()]
};
