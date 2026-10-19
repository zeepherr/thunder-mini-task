import "server-only";

import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/config/server-env";

function createSupabaseClient(accessToken?: string) {
  if (!serverEnv.supabaseUrl || !serverEnv.supabaseAnonKey) {
    throw new Error("Supabase server configuration is missing.");
  }

  return createClient(serverEnv.supabaseUrl, serverEnv.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    ...(accessToken
      ? { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
      : {}),
  });
}

export function createAnonClient() {
  return createSupabaseClient();
}

export function createUserClient(accessToken: string) {
  return createSupabaseClient(accessToken);
}
