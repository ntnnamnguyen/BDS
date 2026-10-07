/** Mock UI chỉ được phép hoạt động ngoài production. */
export function isUiMockModeEnabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;

  const configuredValue = process.env.NEXT_PUBLIC_UI_ENABLE_MOCKS?.trim();
  if (configuredValue) return configuredValue === "true";

  return process.env.NODE_ENV === "development";
}
