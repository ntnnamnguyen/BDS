import "server-only";

import { headers } from "next/headers";

import {
  getAdminUiCredentials,
  isAdminUiAuthRequired,
  isValidAdminAuthorization,
} from "@/lib/admin-basic-auth";
import { ApiError } from "@/lib/api/errors";

export async function assertAdminUiAccess(): Promise<void> {
  if (!isAdminUiAuthRequired()) return;

  const credentials = getAdminUiCredentials();
  if (!credentials) {
    throw new ApiError("Admin UI chưa được cấu hình thông tin đăng nhập hợp lệ.", {
      status: 503,
      code: "ADMIN_UI_AUTH_MISSING",
    });
  }

  const requestHeaders = await headers();
  if (
    !isValidAdminAuthorization(
      requestHeaders.get("authorization"),
      credentials,
    )
  ) {
    throw new ApiError("Không có quyền truy cập giao diện quản trị.", {
      status: 401,
      code: "ADMIN_UI_UNAUTHORIZED",
    });
  }
}
