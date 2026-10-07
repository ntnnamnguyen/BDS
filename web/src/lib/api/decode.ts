import type { z } from "zod";

import { ApiError } from "@/lib/api/errors";

export function decodeApiResponse<TSchema extends z.ZodType>(
  schema: TSchema,
  payload: unknown,
  contractName: string,
): z.output<TSchema> {
  const result = schema.safeParse(payload);
  if (result.success) return result.data;

  throw new ApiError(
    `Backend trả về ${contractName} không đúng hợp đồng dữ liệu.`,
    {
      status: 502,
      code: "INVALID_API_RESPONSE",
      details: result.error.flatten(),
    },
  );
}
