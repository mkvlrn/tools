import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  fixedExtension: false,
  outDir: "./build",
  sourcemap: true,
});
