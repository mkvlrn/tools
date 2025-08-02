# @mkvlrn/env

Environment variable parser powered by zod.

## Installation

```bash
npm add @mkvlrn/env
```

## Usage

```typescript
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

## License

MIT
