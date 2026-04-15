const CLERK_PUBLISHABLE_KEY_PREFIX = "pk_";
const TRUTHY_VALUES = new Set(["1", "true", "yes", "on"]);
const FALSY_VALUES = new Set(["0", "false", "no", "off"]);

export function getClerkPublishableKey(
  rawKey: string | undefined = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
): string {
  const normalizedKey = rawKey?.trim();

  if (!normalizedKey) {
    throw new Error(
      "Missing Clerk publishable key. Define VITE_CLERK_PUBLISHABLE_KEY in your environment.",
    );
  }

  if (!normalizedKey.startsWith(CLERK_PUBLISHABLE_KEY_PREFIX)) {
    throw new Error("Clerk publishable key must start with pk_.");
  }

  return normalizedKey;
}

export function parseBooleanEnv(
  rawValue: string | undefined,
  fallback = false,
): boolean {
  const normalizedValue = rawValue?.trim().toLocaleLowerCase("en-US");

  if (!normalizedValue) {
    return fallback;
  }

  if (TRUTHY_VALUES.has(normalizedValue)) {
    return true;
  }

  if (FALSY_VALUES.has(normalizedValue)) {
    return false;
  }

  return fallback;
}

export function isCourseAuthRequired(
  rawValue: string | undefined = import.meta.env.VITE_REQUIRE_AUTH_FOR_COURSE,
): boolean {
  return parseBooleanEnv(rawValue, false);
}
