"use client";

import { MockDataBadge } from "@/components/ui/mock-data-badge";
import type {
  LeadMockOutcome,
  LeadMockUiConfig,
} from "@/lib/mocks/leads";

const outcomeOptions = [
  { value: "success", label: "Thành công" },
  { value: "conflict", label: "Trùng thông tin (409)" },
  { value: "error", label: "Lỗi hệ thống" },
] as const satisfies readonly {
  value: LeadMockOutcome;
  label: string;
}[];

interface LeadMockControlsProps {
  config: LeadMockUiConfig;
  controlId: string;
  theme?: "dark" | "light";
}

export function LeadMockControls({
  config,
  controlId,
  theme = "light",
}: LeadMockControlsProps) {
  if (!config.enabled) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <div
      className={
        isDark
          ? "space-y-3 border border-amber-400/25 bg-amber-400/5 p-4"
          : "space-y-3 border border-amber-700/20 bg-amber-50 p-4"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <MockDataBadge
          className={
            isDark
              ? "border-amber-300/40 bg-amber-300/10 text-amber-200"
              : "border-amber-700/30 bg-amber-100 text-amber-900"
          }
        />
        <span
          className={
            isDark
              ? "text-[9px] uppercase tracking-widest text-white/40"
              : "text-[9px] uppercase tracking-widest text-amber-900/60"
          }
        >
          Chỉ development
        </span>
      </div>

      <div className="space-y-2">
        <label
          className={
            isDark
              ? "block text-[10px] uppercase tracking-widest text-white/60"
              : "block text-[10px] uppercase tracking-widest text-amber-950/70"
          }
          htmlFor={controlId}
        >
          Kết quả gửi thử
        </label>
        <select
          className={
            isDark
              ? "w-full border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none focus:border-amber-300"
              : "w-full border border-amber-900/20 bg-white px-3 py-2 text-sm text-luxury-ink outline-none focus:border-luxury-bronze"
          }
          defaultValue={config.defaultOutcome}
          id={controlId}
          name="mockLead"
        >
          {outcomeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
