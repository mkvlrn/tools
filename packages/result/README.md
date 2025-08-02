# @mkvlrn/result

Type-safe Result pattern for TypeScript representing success or error. Anything to avoid try/catch hell.

## Installation

```bash
npm add @mkvlrn/result
```

## Usage

```typescript
import { Result, AsyncResult, R } from "@mkvlrn/result";

// Success
const success = R.ok(42);

// Error
const failure = R.error(new Error("Something went wrong"));

// Check result
const result = R.ok(42);
if (result.error) {
  console.log("Error:", result.error.message);
} else {
  console.log("Value:", result.value);
}
```

## Examples

### Basic Function

```typescript
function divide(a: number, b: number): Result<number, Error> {
  if (b === 0) {
    return R.error(new Error("Division by zero"));
  }
  return R.ok(a / b);
}

const result = divide(10, 2);
if (!result.error) {
  console.log(result.value); // 5
}
```

### Async Operations

```typescript
async function fetchUser(id: number): AsyncResult<User, Error> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return R.error(new Error(`HTTP ${response.status}`));
    }
    const user = await response.json();
    return R.ok(user);
  } catch (error) {
    return R.error(error instanceof Error ? error : new Error("Unknown error"));
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
    return Result.error(new ValidationError(400, "custom"));
  }
  return Result.ok(email);
}

const result = validateEmail("invalid-email");
if (result.error) {
  console.log(`${result.error.customField}: ${result.error.message}`);
}
```

## License

MIT
