// Browser-safe settings only. Keep secrets in server-env.ts.
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/proxy",
} as const;
