import { setTimeout } from "node:timers/promises";
import { assert, describe, expect, test } from "vitest";
import { type AsyncResult, err, ok, type Result } from "#/index";

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
    return err(new Error("cannot divide by zero"));
  }
  return ok(a / b);
}

async function longRunning(shouldFail: boolean): AsyncResult<number, CustomError> {
  await setTimeout(1);
  return shouldFail ? err(new CustomError(42, "wrong")) : ok(3);
}

describe("default Error type", () => {
  test("ok result", () => {
    // act
    const result = division(4, 2);
    // assert
    assert.isFalse(result.isError);
    expect(result.value).toBe(2);
  });

  test("error result", () => {
    // act
    const result = division(4, 0);
    // assert
    assert.isTrue(result.isError);
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe("cannot divide by zero");
  });
});

describe("custom error", () => {
  test("ok result", async () => {
    // act
    const result = await longRunning(false);
    // assert
    assert.isFalse(result.isError);
    expect(result.value).toBe(3);
  });

  test("error result", async () => {
    //act
    const result = await longRunning(true);
    // assert
    assert.isTrue(result.isError);
    expect(result.error).toBeInstanceOf(CustomError);
    expect(result.error.message).toBe("wrong");
    expect(result.error.customField).toBe(42);
  });
});
