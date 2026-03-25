import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["packages/*"],
    watch: false,
    coverage: {
      exclude: ["**/*.{test,spec}.ts", "**/build", "**/*.config.ts"],
    },
  },
});
