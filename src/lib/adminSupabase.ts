import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "./supabaseConfig.ts";

export async function requireSupabaseClient(): Promise<SupabaseClient> {
  const client = await getSupabaseClient();

  if (!client) {
    throw new Error("Supabase não configurado.");
  }

  return client;
}

export function getSupabaseErrorMessage(error: { message?: string } | null): string {
  return error?.message ?? "Não foi possível concluir a operação.";
}

export function getUnknownErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Não foi possível concluir a operação.";
}
