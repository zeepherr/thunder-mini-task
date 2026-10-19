import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/config/env";

let browserClient: SupabaseClient | undefined;

export function isSupabaseConfigured() {
  return getSupabasePublicConfig() !== null;
}

export function getSupabaseBrowserClient() {
  const config = getSupabasePublicConfig();

  if (!config) {
    throw new Error("Supabase browser environment variables are missing.");
  }

  browserClient ??= createClient(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return browserClient;
}
