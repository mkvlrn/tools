import type { ZodObject, ZodRawShape, z } from "zod";

/**
 * Validates and parses environment variables based on a given schema and returns a function to access them.
 *
 * @param env - The `process.env` object or any object representing environment variables.
 * @param schema - A Zod schema defining the structure and constraints of the expected environment variables.
 * @returns A `getEnv` function that performs two tasks:
 *  - If called **without arguments**, it validates the environment variables during application bootstrap.
 *  - If called **with a key**, it retrieves the value of the specified environment variable, ensuring proper types.
 *
 * @example
 * ```typescript
 * import { setupEnv } from "./setup-env";
 * import { z } from "zod";
 *
 * const schema = z.object({
 *   PORT: z.coerce.number(),
 *   NODE_ENV: z.enum(["development", "production", "test"]),
 * });
 *
 * const env = setupEnv(process.env, schema);
 *
 * // Bootstrap validation
 * env();
 *
 * // Access environment variables
 * const port = env("PORT"); // port is inferred as `number`
 * const nodeEnv = env("NODE_ENV"); // nodeEnv is inferred as "development" | "production" | "test"
 * ```
 */
export function setupEnv<T extends ZodRawShape>(env: NodeJS.ProcessEnv, schema: ZodObject<T>) {
  type ParsedEnv = z.infer<typeof schema>;
  let parsed: ReturnType<typeof schema.safeParse> | null = null;

  // overloads
  function getEnv<K extends keyof ParsedEnv>(key: K): ParsedEnv[K];
  function getEnv(): undefined;

  // implementation
  function getEnv<K extends keyof ParsedEnv>(key?: K): ParsedEnv[K] | undefined {
    if (!parsed) {
      parsed = schema.safeParse(env);
    }

    if (!parsed.success) {
      const issueSummaries: string[] = parsed.error.issues.map((issue) => {
        const path = issue.path.join(".");
        return `  ${path ? `'${path}'` : "root"}: ${issue.message}`;
      });

      throw new Error(`Validation of environment variables failed:\n${issueSummaries.join("\n")}`);
    }

    return key ? parsed.data[key] : undefined;
  }

  return getEnv;
}
