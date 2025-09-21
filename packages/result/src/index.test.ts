import { setTimeout } from "node:timers/promises";
import { assert, describe, expect, test } from "vitest";
import { type AsyncResult, R, type Result } from "./index.ts";

class CustomError extends Error {
  readonly customField: number;

  constructor(customField: number, message: string) {
    super(message);
    this.name = "CustomField";
    this.customField = customField;
  }
}

function division(a: number, b: number): Result<number, Error> {
  if (b === 0) {
    return R.error(new Error("cannot divide by zero"));
  }

  return R.ok(a / b);
}

async function longRunning(shouldFail: boolean): AsyncResult<number, CustomError> {
  await setTimeout(1);

  return shouldFail ? R.error(new CustomError(42, "wrong")) : R.ok(3);
}

describe("default Error type", () => {
  test("ok result", () => {
    const result = division(4, 2);

    assert.isFalse(result.isError);
    expect(result.value).toBe(2);
  });

  test("error result", () => {
    const result = division(4, 0);

    assert.isTrue(result.isError);
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe("cannot divide by zero");
  });
});

describe("custom error", () => {
  test("ok result", async () => {
    const result = await longRunning(false);

    assert.isFalse(result.isError);
    expect(result.value).toBe(3);
  });

  test("error result", async () => {
    const result = await longRunning(true);

    assert.isTrue(result.isError);
    expect(result.error).toBeInstanceOf(CustomError);
    expect(result.error.message).toBe("wrong");
    expect(result.error.customField).toBe(42);
  });
});
