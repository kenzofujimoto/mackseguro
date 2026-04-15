import { describe, expect, it } from "vitest";
import { getClerkPublishableKey, isCourseAuthRequired } from "./clerkConfig.ts";

describe("getClerkPublishableKey", () => {
  it("throws when key is missing", () => {
    expect(() => getClerkPublishableKey("")).toThrow(/publishable key/i);
  });

  it("throws when key has invalid format", () => {
    expect(() => getClerkPublishableKey("sk_test_invalid")).toThrow(/must start with pk_/i);
  });

  it("returns normalized key when valid", () => {
    expect(getClerkPublishableKey("  pk_test_abc123  ")).toBe("pk_test_abc123");
  });
});

describe("isCourseAuthRequired", () => {
  it("returns true for supported truthy values", () => {
    expect(isCourseAuthRequired("true")).toBe(true);
    expect(isCourseAuthRequired(" TRUE ")).toBe(true);
    expect(isCourseAuthRequired("1")).toBe(true);
    expect(isCourseAuthRequired("yes")).toBe(true);
  });

  it("returns false for supported falsy values", () => {
    expect(isCourseAuthRequired("false")).toBe(false);
    expect(isCourseAuthRequired(" FALSE ")).toBe(false);
    expect(isCourseAuthRequired("0")).toBe(false);
    expect(isCourseAuthRequired("no")).toBe(false);
    expect(isCourseAuthRequired("off")).toBe(false);
  });

  it("uses false as default for invalid or blank explicit values", () => {
    expect(isCourseAuthRequired("")).toBe(false);
    expect(isCourseAuthRequired("   ")).toBe(false);
    expect(isCourseAuthRequired("random-value")).toBe(false);
  });
});
