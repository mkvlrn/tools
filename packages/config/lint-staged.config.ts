import type { Configuration } from "lint-staged";

export default {
  "*.{json,jsonc}": ["biome check --no-errors-on-unmatched"],
} satisfies Configuration;
