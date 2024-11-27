import * as path from "node:path"

import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import { defineConfig } from "rollup"
import { dts } from "rollup-plugin-dts"
import { terser } from "rollup-plugin-terser"

import pkg from "./package.json" with { type: "json" }

// define the entry point
const input = path.resolve(__dirname, "src/index.ts")

// define external dependencies (dependencies that should not be included in the bundle)
const external = [...Object.keys(pkg.devDependencies)]

const config = defineConfig([
  {
    input,
    external,
    cache: false,

    plugins: [
      resolve(), // resolves node modules
      commonjs(), // converts commonjs modules to es6
      typescript({
        outputToFilesystem: false,
      }), // handle typescript files
      terser(), // minifies the production build
    ],

    output: [
      {
        format: "esm",
        file: path.resolve(__dirname, "dist/nepali-number.esm.js"),
      },
      {
        format: "cjs",
        file: path.resolve(__dirname, "dist/nepali-number.cjs.js"),
      },
      {
        format: "umd",
        name: "BikramSambat", // the global variable name
        file: path.resolve(__dirname, "dist/nepali-number.umd.js"),
      },
      {
        format: "iife",
        name: "BikramSambat", // the global variable name
        file: path.resolve(__dirname, "dist/nepali-number.iife.js"),
      },
    ],
  },

  // add a second config for generating typescript declarations
  {
    input,
    external,

    plugins: [
      dts(), // generates typescript declarations
    ],

    output: [
      {
        format: "esm",
        file: path.resolve(__dirname, "dist/nepali-number.d.ts"),
        sourcemap: false,
      },
      {
        format: "cjs",
        file: path.resolve(__dirname, "dist/nepali-number.d.cts"),
        sourcemap: false,
      },
    ],
  },
])

export default config
