# @mkvlrn/env

Environment variable parser powered by zod.

## Installation

```bash
npm add @mkvlrn/env zod
```

## Usage

```ts
import { setupEnv } from "@mkvlrn/env";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

const env = setupEnv(process.env, schema);

// Bootstrap validation
env();

// Access environment variables
const port = env("PORT"); // port is inferred as `number`
const nodeEnv = env("NODE_ENV"); // nodeEnv is inferred as "development" | "production" | "test"

console.log(`Server running on port: ${port}, Environment: ${nodeEnv}`);
```

## Error Handling

If environment variables don't match the provided schema, an error will be thrown during the bootstrap call. This is intentional - the application should not start with invalid configuration.

### Example Failure

Given the following invalid environment variables:

```bash
PORT=abc
NODE_ENV=invalid
```

```bash
Validation of environment variables failed:
  'PORT': Invalid input, expected number
  'NODE_ENV': Invalid enum value. Expected 'development' | 'production' | 'test'
```

This ensures configuration issues are caught immediately at startup rather than causing problems later during runtime.

## License

MIT
