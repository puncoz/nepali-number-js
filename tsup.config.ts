import { defineConfig } from "tsup"

export default defineConfig({
  // entry file
  entry: ["src/index.ts"],
  // output directory
  outDir: "dist-tsup",
  // commonjs, esmodule and umd formats
  format: ["cjs", "esm", "iife"],
  // target the latest ES features
  target: "esnext",
  // minify the output
  minify: true,
  // generate typescript declarations
  dts: true,
  // include sourcemaps
  sourcemap: false,
  // clean output directory before build
  clean: true,
  // the global variable name for IIFE (UMD)
  globalName: "BikramSambat",
  // explicitly enable tree shaking
  treeshake: true,
  outExtension({ format }) {
    return {
      js: `.${format}.js`,
    }
  },
})
