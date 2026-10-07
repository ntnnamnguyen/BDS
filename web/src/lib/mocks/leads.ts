import type { ActionResult } from "@/lib/api/schemas";
import {
  createLeadInputSchema,
  leadCreatedSchema,
  leadStatusSchema,
  type LeadStatus,
} from "@/features/leads/schemas";

export type LeadActionFixtureName =
  | "success"
  | "conflict"
  | "validation"
  | "error";

export type LeadMockOutcome = Exclude<
  LeadActionFixtureName,
  "validation"
>;

export interface LeadMockUiConfig {
  enabled: boolean;
  defaultOutcome: LeadMockOutcome;
}

const leadStatusLabels: Record<LeadStatus, string> = {
  NEW: "Mới",
  CONTACTED: "Đã liên hệ",
  FOLLOWING: "Đang theo dõi",
  CLOSED: "Đã chốt",
  CANCELLED: "Đã hủy",
};

export const leadStatusFixtures = leadStatusSchema.options.map((status) => ({
  value: status,
  label: leadStatusLabels[status],
}));

export const createLeadInputFixture = createLeadInputSchema.parse({
  fullName: "Nguyễn Minh Anh",
  phone: "+84901234567",
  email: "minh.anh@example.com",
  message: "Tôi muốn nhận tư vấn về căn hộ ba phòng ngủ.",
  projectId: "8ca7965c-47ef-4e99-895d-5da7e05e9f19",
  sourcePath: "/projects/hanoi-signature",
  clientRequestId: "8a7ab1af-5ad1-4cdd-aec9-c1a558b1b78d",
});

export const leadCreatedFixture = leadCreatedSchema.parse({
  id: "92c88ec3-0f14-4706-9a86-36cbf68e1cdb",
  status: "NEW",
  createdAt: "2026-08-02T09:30:00.000Z",
});

export const leadActionResultFixtures = {
  success: { success: true },
  conflict: {
    success: false,
    error: "Thông tin này đã tồn tại trong hệ thống ưu tiên.",
  },
  validation: {
    success: false,
    error: "Số điện thoại chưa đúng định dạng, vui lòng kiểm tra lại.",
  },
  error: {
    success: false,
    error: "Hệ thống đang bận, Quý khách vui lòng thử lại sau ít phút.",
  },
} as const satisfies Record<LeadActionFixtureName, ActionResult>;
