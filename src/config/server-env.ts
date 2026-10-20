import "server-only";

// Server-only credentials for the BFF and versioned Core API routes.
export const serverEnv = {
  coreApiUrl: process.env.CORE_API_URL ?? "",
  coreApiKey: process.env.CORE_API_KEY ?? "",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
} as const;

export function hasServerApiConfig() {
  return Boolean(
    serverEnv.coreApiUrl &&
      serverEnv.coreApiKey &&
      serverEnv.supabaseUrl &&
      serverEnv.supabaseAnonKey,
  );
}
