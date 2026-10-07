"use server";

import type { ActionResult } from "@/lib/api/schemas";
import { apiRequest } from "@/lib/api/client.server";
import { decodeApiResponse } from "@/lib/api/decode";
import { getApiErrorMessage, isApiError } from "@/lib/api/errors";
import {
  getMockLeadResult,
  isApiMockFallbackEnabled,
} from "@/lib/env.server";

import {
  createLeadInputSchema,
  leadCreatedSchema,
  type CreateLeadInput,
  type LeadCreated,
} from "./schemas";

async function createLead(input: CreateLeadInput): Promise<LeadCreated> {
  const validatedInput = createLeadInputSchema.parse(input);
  const payload = await apiRequest("/leads", {
    method: "POST",
    cache: "no-store",
    body: validatedInput,
  });

  const candidate =
    payload && typeof payload === "object" && "data" in payload
      ? payload.data
      : payload;

  return decodeApiResponse(leadCreatedSchema, candidate, "lead");
}

export async function submitContact(formData: FormData): Promise<ActionResult> {
  const readString = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };

  const name = readString("name");
  const rawPhone = readString("phone_number");
  const message = readString("message");
  const email = readString("email");
  const projectId = readString("projectId");
  const sourcePath = readString("sourcePath");
  const clientRequestId = readString("clientRequestId");
  const requestedMockResult = readString("mockLead");

  if (!name || !rawPhone) {
    return {
      success: false,
      error:
        "Quý khách vui lòng cung cấp đầy đủ Danh xưng và Số điện thoại.",
    };
  }

  if (name.length < 2) {
    return {
      success: false,
      error: "Danh xưng quá ngắn, vui lòng kiểm tra lại.",
    };
  }

  const cleanPhone = rawPhone.replace(/[^\d+]/g, "");

  if (!/^\+?\d{8,15}$/.test(cleanPhone)) {
    return {
      success: false,
      error: "Số điện thoại chưa đúng định dạng, vui lòng kiểm tra lại.",
    };
  }

  if (
    !clientRequestId ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      clientRequestId,
    )
  ) {
    return {
      success: false,
      error: "Phiên gửi biểu mẫu không hợp lệ, vui lòng tải lại trang.",
    };
  }

  if (isApiMockFallbackEnabled()) {
    const { leadActionResultFixtures } = await import("@/lib/mocks/leads");

    return leadActionResultFixtures[
      getMockLeadResult(requestedMockResult)
    ];
  }

  try {
    await createLead({
      fullName: name,
      phone: cleanPhone,
      email: email || undefined,
      message: message || "Khách hàng quan tâm dự án",
      projectId: projectId || undefined,
      sourcePath: sourcePath || undefined,
      clientRequestId,
    });

    return { success: true };
  } catch (error: unknown) {
    if (isApiError(error) && error.status === 409) {
      return {
        success: false,
        error: "Thông tin này đã tồn tại trong hệ thống ưu tiên.",
      };
    }

    return {
      success: false,
      error: getApiErrorMessage(
        error,
        "Hệ thống đang bận, Quý khách vui lòng thử lại sau ít phút.",
      ),
    };
  }
}
