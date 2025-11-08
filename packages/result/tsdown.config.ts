import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  fixedExtension: false,
  outDir: "./build",
  unbundle: true,
  sourcemap: false,
  dts: true,
  minify: true,
});
