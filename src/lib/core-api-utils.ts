import "server-only";

import { ApiError } from "@/lib/api-utils";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function requireUuid(value: string, field: string) {
  if (!UUID_PATTERN.test(value)) {
    throw new ApiError(`Invalid input: ${field} must be a valid UUID.`, 400);
  }
  return value;
}

export function internalError(summary: string, cause: unknown) {
  console.error(`${summary}:`, cause);
  return new ApiError(summary, 500);
}
