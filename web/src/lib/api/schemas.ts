import { z } from "zod";

export type JsonPrimitive = boolean | null | number | string;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = { [key: string]: JsonValue };

/** Runtime representation of values that can safely cross a JSON boundary. */
export const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number().finite(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

export const jsonObjectSchema: z.ZodType<JsonObject> = z.record(
  z.string(),
  jsonValueSchema,
);

export const isoDateTimeSchema = z.iso.datetime({ offset: true });
export type IsoDateTime = z.output<typeof isoDateTimeSchema>;

export const paginationMetaSchema = z
  .object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  })
  .catchall(jsonValueSchema);

export type PaginationMeta = z.output<typeof paginationMetaSchema>;

export type ListEnvelope<T> = {
  data: T[];
  meta: PaginationMeta;
};

export function createListEnvelopeSchema<TSchema extends z.ZodType>(
  itemSchema: TSchema,
) {
  return z
    .object({
      data: z.array(itemSchema),
      meta: paginationMetaSchema,
    })
    .catchall(jsonValueSchema);
}

export type DataEnvelope<T> = {
  data: T;
};

export function createDataEnvelopeSchema<TSchema extends z.ZodType>(
  dataSchema: TSchema,
) {
  return z
    .object({ data: dataSchema })
    .catchall(jsonValueSchema);
}

const actionSuccessSchema = z
  .object({ success: z.literal(true) })
  .catchall(jsonValueSchema);

const legacyCompatibleActionFailureSchema = z
  .object({
    success: z.literal(false).optional(),
    error: z.string(),
  })
  .catchall(jsonValueSchema)
  .transform((result) => ({ ...result, success: false as const }));

export const actionResultSchema = z.union([
  actionSuccessSchema,
  legacyCompatibleActionFailureSchema,
]);

export type ActionResult = z.output<typeof actionResultSchema>;

export function parseActionResult(input: unknown): ActionResult {
  return actionResultSchema.parse(input);
}

export function safeParseActionResult(input: unknown) {
  return actionResultSchema.safeParse(input);
}
