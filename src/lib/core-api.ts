import "server-only";

import { serverEnv } from "@/config/server-env";

export async function coreApiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  if (!serverEnv.coreApiUrl || !serverEnv.coreApiKey) {
    throw new Error("Core API is not configured.");
  }

  const headers = new Headers(init.headers);
  headers.set("x-api-key", serverEnv.coreApiKey);
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  return fetch(new URL(`/api/core/v1${path}`, serverEnv.coreApiUrl), {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function readCoreApiData<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof body?.error === "string" ? body.error : "Core API request failed.";
    throw new CoreApiResponseError(message, response.status);
  }

  return body?.data as T;
}

export class CoreApiResponseError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "CoreApiResponseError";
  }
}
