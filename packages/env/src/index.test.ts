/** biome-ignore-all lint/style/useNamingConvention: mocking node ENV */
/** biome-ignore-all lint/style/noProcessEnv: mocking node ENV */

import { afterEach } from "node:test";
import { assert, beforeEach, describe, it, vi } from "vitest";
import { z } from "zod";
import { setupEnv } from "./index.js";

describe("setupEnv", () => {
  beforeEach(() => {
    vi.stubEnv("PORT", "");
    vi.stubEnv("NODE_ENV", "");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("valid environment variables", () => {
    const schema = z.object({
      PORT: z.coerce.number(),
      NODE_ENV: z.enum(["development", "production", "test"]),
    });
    vi.stubEnv("PORT", "1234");
    vi.stubEnv("NODE_ENV", "development");

    const env = setupEnv(process.env, schema);
    env();

    assert.strictEqual(env("PORT"), 1234);
    assert.strictEqual(env("NODE_ENV"), "development");
  });

  it("invalid environment variables", () => {
    const schema = z.object({
      PORT: z.coerce.number(),
      NODE_ENV: z.enum(["development", "production", "test"]),
    });
    vi.stubEnv("PORT", "abc");
    vi.stubEnv("NODE_ENV", "invalid");
    let expectedErrorMessage = "Validation of environment variables failed:\n";
    expectedErrorMessage += "  'PORT': Invalid input: expected number, received NaN\n";
    expectedErrorMessage +=
      '  \'NODE_ENV\': Invalid option: expected one of "development"|"production"|"test"';

    const env = setupEnv(process.env, schema);
    let error: unknown;
    try {
      env();
    } catch (err) {
      error = err;
    }

    assert.ok(error instanceof Error, "Error was not thrown as expected");
    assert.strictEqual((error as Error).message, expectedErrorMessage);
  });

  it("parse environment variables only once", () => {
    const schema = z.object({
      PORT: z.coerce.number(),
      NODE_ENV: z.enum(["development", "production", "test"]),
    });
    vi.stubEnv("PORT", "8080");
    vi.stubEnv("NODE_ENV", "development");
    const parseSpy = vi.spyOn(schema, "safeParse");

    const env = setupEnv(process.env, schema);
    env();
    env("PORT");
    env("NODE_ENV");

    assert.deepStrictEqual(parseSpy.mock.calls, [[process.env]]);
  });

  it("undefined return without arguments after successful validation", () => {
    const schema = z.object({
      PORT: z.coerce.number(),
      NODE_ENV: z.enum(["development", "production", "test"]),
    });
    vi.stubEnv("PORT", "8080");
    vi.stubEnv("NODE_ENV", "development");

    const env = setupEnv(process.env, schema);

    assert.strictEqual(env(), undefined);
  });

  it("correct type inference", () => {
    const schema = z.object({
      PORT: z.coerce.number(),
      NODE_ENV: z.enum(["development", "production", "test"]),
    });
    vi.stubEnv("PORT", "80");
    vi.stubEnv("NODE_ENV", "production");

    const env = setupEnv(process.env, schema);
    const port = env("PORT");
    const nodeEnv = env("NODE_ENV");

    assert.strictEqual(port, 80);
    assert.strictEqual(nodeEnv, "production");
  });
});
