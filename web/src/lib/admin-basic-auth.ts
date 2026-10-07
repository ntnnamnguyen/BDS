import { timingSafeEqual } from "node:crypto";

interface AdminCredentials {
  password: string;
  username: string;
}

export function isPlaceholderSecret(value: string): boolean {
  return /^(?:replace|change)(?:[-_\s]|$)/i.test(value);
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function isAdminUiAuthRequired(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.ADMIN_UI_USERNAME !== undefined ||
    process.env.ADMIN_UI_PASSWORD !== undefined
  );
}

export function getAdminUiCredentials(): AdminCredentials | null {
  const username = process.env.ADMIN_UI_USERNAME?.trim();
  const password = process.env.ADMIN_UI_PASSWORD;

  if (!username || username.includes(":") || !password) return null;
  if (process.env.NODE_ENV === "production") {
    if (password.length < 16 || isPlaceholderSecret(password)) return null;
  }

  return { username, password };
}

export function isValidAdminAuthorization(
  authorization: string | null,
  credentials: AdminCredentials,
): boolean {
  if (!authorization?.toLowerCase().startsWith("basic ")) return false;

  try {
    const encoded = authorization.slice(6).trim();
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator < 0) return false;

    const username = decoded.slice(0, separator);
    const password = decoded.slice(separator + 1);

    return (
      safeEqual(username, credentials.username) &&
      safeEqual(password, credentials.password)
    );
  } catch {
    return false;
  }
}
