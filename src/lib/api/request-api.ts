import axios from "axios";
import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/api-error";

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  error?: string;
};

export async function requestApi<T>(
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  path: string,
  data?: unknown,
): Promise<T> {
  try {
    const response = await apiClient.request<ApiEnvelope<T> | T>({
      url: path,
      method,
      data,
      validateStatus: () => true,
    });
    const body = response.data;

    if (body && typeof body === "object" && "error" in body) {
      const message =
        typeof body.error === "string" ? body.error : "API request failed.";
      throw new ApiError(message, response.status);
    }

    if (response.status < 200 || response.status >= 300) {
      throw new ApiError(`API request failed (${response.status}).`, response.status);
    }

    if (
      body &&
      typeof body === "object" &&
      "success" in body &&
      "data" in body
    ) {
      return body.data as T;
    }

    return body as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (axios.isAxiosError(error)) {
      throw new ApiError("Could not reach the server. Check your connection and retry.", 0);
    }
    throw error;
  }
}
