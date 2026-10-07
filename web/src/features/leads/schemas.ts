import { z } from "zod";

export const leadStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "FOLLOWING",
  "CLOSED",
  "CANCELLED",
]);

export type LeadStatus = z.infer<typeof leadStatusSchema>;

export const createLeadInputSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().regex(/^\+?\d{8,15}$/),
  email: z.string().trim().email().max(254).optional(),
  message: z.string().trim().max(2_000).optional(),
  projectId: z.string().uuid().optional(),
  interestData: z.record(z.string(), z.unknown()).optional(),
  sourcePath: z.string().max(500).optional(),
  clientRequestId: z.string().max(120).optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadInputSchema>;

export const leadCreatedSchema = z.object({
  id: z.string().uuid(),
  status: leadStatusSchema,
  createdAt: z.string().optional(),
});

export type LeadCreated = z.infer<typeof leadCreatedSchema>;
