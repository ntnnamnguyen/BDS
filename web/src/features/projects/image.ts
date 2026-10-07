const FALLBACK_PROJECT_IMAGE = "/window.svg";
const ALLOWED_REMOTE_HOSTS = new Set([
  "images.unsplash.com",
  "res.cloudinary.com",
]);

export function getProjectImageSource(source?: string | null): string {
  const value = source?.trim();
  if (!value) return FALLBACK_PROJECT_IMAGE;

  if (value.startsWith("/") && !value.startsWith("//")) return value;

  try {
    const url = new URL(value);
    if (url.protocol === "https:" && ALLOWED_REMOTE_HOSTS.has(url.hostname)) {
      return url.toString();
    }
  } catch {
    // Invalid or unsupported CMS URL: use the stable local placeholder.
  }

  return FALLBACK_PROJECT_IMAGE;
}
