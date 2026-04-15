import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { parseBooleanEnv } from "./clerkConfig.ts";

type SupabaseEnv = Readonly<
  Partial<{
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    VITE_ENABLE_SUPABASE_SYNC: string;
    VITE_ENABLE_SUPABASE_READS: string;
  }>
>;

export interface SupabaseRuntimeConfig {
  url: string;
  anonKey: string;
  configured: boolean;
  syncEnabled: boolean;
  readEnabled: boolean;
}

let cachedConfig: SupabaseRuntimeConfig | null = null;
let cachedClient: SupabaseClient | null | undefined;
let customTokenGetter: (() => Promise<string | null>) | null = null;

export function setSupabaseTokenGetter(
  getter: (() => Promise<string | null>) | null,
): void {
  customTokenGetter = getter;
}

function normalizeEnvValue(value: string | undefined): string {
  return value?.trim() ?? "";
}

export function resolveSupabaseRuntimeConfig(
  env: SupabaseEnv = import.meta.env as SupabaseEnv,
): SupabaseRuntimeConfig {
  const url = normalizeEnvValue(env.VITE_SUPABASE_URL);
  const anonKey = normalizeEnvValue(env.VITE_SUPABASE_ANON_KEY);
  const configured = url.length > 0 && anonKey.length > 0;

  const syncEnabled =
    configured && parseBooleanEnv(env.VITE_ENABLE_SUPABASE_SYNC, false);
  const readEnabled =
    configured && parseBooleanEnv(env.VITE_ENABLE_SUPABASE_READS, false);

  return {
    url,
    anonKey,
    configured,
    syncEnabled,
    readEnabled,
  };
}

export function getSupabaseRuntimeConfig(): SupabaseRuntimeConfig {
  if (!cachedConfig) {
    cachedConfig = resolveSupabaseRuntimeConfig();
  }

  return cachedConfig;
}

export function shouldSyncToSupabase(
  config: SupabaseRuntimeConfig = getSupabaseRuntimeConfig(),
): boolean {
  return config.configured && config.syncEnabled;
}

export function shouldReadFromSupabase(
  config: SupabaseRuntimeConfig = getSupabaseRuntimeConfig(),
): boolean {
  return config.configured && config.readEnabled;
}

export function getSupabaseClient(
  config: SupabaseRuntimeConfig = getSupabaseRuntimeConfig(),
): SupabaseClient | null {
  if (!config.configured) {
    return null;
  }

  if (cachedClient !== undefined) {
    return cachedClient;
  }

  const options: Record<string, unknown> = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: async (
        url: RequestInfo | URL,
        options: RequestInit = {},
      ): Promise<Response> => {
        const headers = new Headers(options.headers);
        if (customTokenGetter) {
          try {
            const token = await customTokenGetter();
            if (token) {
              headers.set("Authorization", `Bearer ${token}`);
            }
          } catch (e) {
            console.error("[supabaseConfig] Expected error getting auth token:", e);
          }
        }
        return fetch(url, { ...options, headers });
      },
    },
  };

  cachedClient = createClient(config.url, config.anonKey, options);

  return cachedClient;
}
