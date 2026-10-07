import "server-only";

import { assertAdminUiAccess } from "@/lib/admin-access.server";
import { ApiError } from "@/lib/api/errors";
import { getApiBaseUrl, getBackendAdminApiKey } from "@/lib/env.server";

const DEFAULT_TIMEOUT_MS = 10_000;

type NextFetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

export interface ApiRequestOptions
  extends Omit<RequestInit, "body" | "headers"> {
  body?: unknown;
  headers?: HeadersInit;
  admin?: boolean;
  timeoutMs?: number;
  next?: NextFetchOptions;
}

function getErrorMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === "object") {
    const candidate = payload as {
      message?: string | string[];
      error?: string;
    };

    if (Array.isArray(candidate.message)) {
      return candidate.message.join(" ");
    }

    if (typeof candidate.message === "string") {
      return candidate.message;
    }

    if (typeof candidate.error === "string") {
      return candidate.error;
    }
  }

  return `Backend trả về lỗi HTTP ${status}.`;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || undefined;
}

export async function apiRequest(
  path: string,
  options: ApiRequestOptions = {},
): Promise<unknown> {
  const {
    admin = false,
    body,
    headers: incomingHeaders,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    ...requestInit
  } = options;

  const headers = new Headers(incomingHeaders);
  headers.set("accept", "application/json");

  if (admin) {
    await assertAdminUiAccess();
    headers.set("x-admin-api-key", getBackendAdminApiKey());
  }

  let requestBody: BodyInit | undefined;
  if (body !== undefined) {
    if (body instanceof FormData || typeof body === "string") {
      requestBody = body;
    } else {
      headers.set("content-type", "application/json");
      requestBody = JSON.stringify(body);
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const response = await fetch(url, {
      ...requestInit,
      body: requestBody,
      headers,
      signal: controller.signal,
    });
    const payload = await parseResponseBody(response);

    if (!response.ok) {
      throw new ApiError(getErrorMessage(payload, response.status), {
        status: response.status,
        details: payload,
      });
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Backend phản hồi quá thời gian cho phép.", {
        status: 504,
        code: "API_TIMEOUT",
      });
    }

    throw new ApiError("Không thể kết nối tới backend NestJS.", {
      status: 503,
      details: error,
      code: "API_UNAVAILABLE",
    });
  } finally {
    clearTimeout(timeout);
  }
}
