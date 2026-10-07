import { z } from "zod";

export const postMetadataSchema = z.object({
  title: z.string().trim().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.string().trim().min(1),
  author: z.string().trim().min(1).optional(),
  readTime: z.string().trim().min(1).default("5 phút đọc"),
  excerpt: z.string().trim().default(""),
  cover: z.string().trim().min(1).default("/window.svg"),
});

export type PostMetadata = z.infer<typeof postMetadataSchema>;

export const postSummarySchema = postMetadataSchema.extend({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export type PostSummary = z.infer<typeof postSummarySchema>;
