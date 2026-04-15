import { describe, expect, it } from "vitest";
import {
  resolveSupabaseRuntimeConfig,
  shouldReadFromSupabase,
  shouldSyncToSupabase,
} from "./supabaseConfig.ts";

describe("resolveSupabaseRuntimeConfig", () => {
  it("disables reads and sync when url/key are missing", () => {
    const config = resolveSupabaseRuntimeConfig({
      VITE_SUPABASE_URL: "",
      VITE_SUPABASE_ANON_KEY: "",
      VITE_ENABLE_SUPABASE_SYNC: "true",
      VITE_ENABLE_SUPABASE_READS: "true",
    });

    expect(config.configured).toBe(false);
    expect(config.syncEnabled).toBe(false);
    expect(config.readEnabled).toBe(false);
  });

  it("enables sync and reads only when explicitly configured", () => {
    const config = resolveSupabaseRuntimeConfig({
      VITE_SUPABASE_URL: "https://example.supabase.co",
      VITE_SUPABASE_ANON_KEY: "anon-key",
      VITE_ENABLE_SUPABASE_SYNC: "yes",
      VITE_ENABLE_SUPABASE_READS: "1",
    });

    expect(config.configured).toBe(true);
    expect(config.syncEnabled).toBe(true);
    expect(config.readEnabled).toBe(true);
    expect(shouldSyncToSupabase(config)).toBe(true);
    expect(shouldReadFromSupabase(config)).toBe(true);
  });

  it("keeps features disabled by default", () => {
    const config = resolveSupabaseRuntimeConfig({
      VITE_SUPABASE_URL: "https://example.supabase.co",
      VITE_SUPABASE_ANON_KEY: "anon-key",
    });

    expect(config.configured).toBe(true);
    expect(config.syncEnabled).toBe(false);
    expect(config.readEnabled).toBe(false);
  });
});
