import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getAdminUiCredentials,
  isAdminUiAuthRequired,
  isValidAdminAuthorization,
} from "@/lib/admin-basic-auth";

export function proxy(request: NextRequest) {
  if (!isAdminUiAuthRequired()) return NextResponse.next();

  const credentials = getAdminUiCredentials();
  if (!credentials) {
    return new NextResponse("Admin UI is not configured.", {
      status: 503,
      headers: { "cache-control": "private, no-store" },
    });
  }

  if (
    !isValidAdminAuthorization(
      request.headers.get("authorization"),
      credentials,
    )
  ) {
    return new NextResponse("Authentication required.", {
      status: 401,
      headers: {
        "cache-control": "private, no-store",
        "www-authenticate": 'Basic realm="Hanoi Estate Admin", charset="UTF-8"',
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set("cache-control", "private, no-store");
  return response;
}

export const config = {
  matcher: "/admin/:path*",
};
