# @mkvlrn/result

Type-safe Result pattern for TypeScript representing success or error. Anything to avoid try/catch hell.

[![npm](https://img.shields.io/npm/v/@mkvlrn/result)](https://www.npmjs.com/package/@mkvlrn/result)

## Installation

```bash
pnpm add @mkvlrn/result
```

## Usage

```typescript
import { Result, AsyncResult, ok, err } from "@mkvlrn/result";

// Success
const success = ok(42);

// Error
const failure = err(new Error("Something went wrong"));

// Check result
const result = ok(42);
if (result.isError) {
  console.log("Error:", result.error.message);
} else {
  console.log("Value:", result.value);
}
```

## API

| Export              | Description                                  |
| ------------------- | -------------------------------------------- |
| `Result<T, E>`      | Union type representing success or failure   |
| `AsyncResult<T, E>` | `Promise<Result<T, E>>` for async operations |
| `ok(value)`         | Creates a success result                     |
| `err(error)`        | Creates an error result                      |

## Examples

### Basic Function

```typescript
function divide(a: number, b: number): Result<number, Error> {
  if (b === 0) {
    return err(new Error("Division by zero"));
  }
  return ok(a / b);
}

const result = divide(10, 2);
if (result.isOk) {
  console.log(result.value); // 5
}
```

### Async Operations

```typescript
async function fetchUser(id: number): AsyncResult<User, Error> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return err(new Error(`HTTP ${response.status}`));
    }
    const user = await response.json();
    return ok(user);
  } catch (error) {
    return err(error instanceof Error ? error : new Error("Unknown error"));
  }
}
```

### Custom Error Types

```typescript
class ValidationError extends Error {
  readonly customField: number;

  constructor(customField: number, message: string) {
    super(message);
    this.name = "ValidationError";
    this.customField = customField;
  }
}

function validateEmail(email: string): Result<string, ValidationError> {
  if (!email.includes("@")) {
    return err(new ValidationError(400, "custom"));
  }
  return ok(email);
}

const result = validateEmail("invalid-email");
if (result.isError) {
  console.log(`${result.error.customField}: ${result.error.message}`);
}
```

## License

MIT
