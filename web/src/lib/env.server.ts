import "server-only";

import { isPlaceholderSecret } from "@/lib/admin-basic-auth";
import { ApiError } from "@/lib/api/errors";
import { isUiMockModeEnabled } from "@/lib/mocks/config";

const DEFAULT_API_BASE_URL = "http://localhost:3001/api/v1";
const MOCK_LEAD_RESULTS = ["success", "conflict", "error"] as const;

export type MockLeadResult = (typeof MOCK_LEAD_RESULTS)[number];

export function getApiBaseUrl(): string {
  const configuredUrl = process.env.API_BASE_URL?.trim();

  if (!configuredUrl && process.env.NODE_ENV === "production") {
    throw new ApiError(
      "Web chưa được cấu hình API_BASE_URL cho môi trường production.",
      { status: 500, code: "API_BASE_URL_MISSING" },
    );
  }

  const candidate = configuredUrl || DEFAULT_API_BASE_URL;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Unsupported protocol");
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    throw new ApiError("API_BASE_URL không phải là một HTTP(S) URL hợp lệ.", {
      status: 500,
      code: "API_BASE_URL_INVALID",
    });
  }
}

export function getBackendAdminApiKey(): string {
  const apiKey = process.env.BACKEND_ADMIN_API_KEY?.trim();
  if (
    !apiKey ||
    apiKey.length < 32 ||
    (process.env.NODE_ENV === "production" && isPlaceholderSecret(apiKey))
  ) {
    throw new ApiError(
      "Web chưa được cấu hình BACKEND_ADMIN_API_KEY hợp lệ để truy cập API quản trị.",
      { status: 500, code: "ADMIN_API_KEY_MISSING" },
    );
  }

  return apiKey;
}

export function isApiMockFallbackEnabled(): boolean {
  if (!isUiMockModeEnabled()) return false;

  return process.env.API_ENABLE_MOCK_FALLBACK?.trim() !== "false";
}

export function getMockLeadResult(requestedResult?: string): MockLeadResult {
  const configuredResult =
    requestedResult?.trim() || process.env.API_MOCK_LEAD_RESULT?.trim();
  return MOCK_LEAD_RESULTS.includes(configuredResult as MockLeadResult)
    ? (configuredResult as MockLeadResult)
    : "success";
}
