import { z } from "zod";

import {
  createDataEnvelopeSchema,
  createListEnvelopeSchema,
  isoDateTimeSchema,
  jsonObjectSchema,
  jsonValueSchema,
  type ListEnvelope,
} from "@/lib/api/schemas";

export const PROJECT_BLOCK_TYPES = [
  "HERO",
  "LOCATION",
  "LOCATION_MAP",
  "PRICING_TABLE",
  "FINANCIAL_LAB",
  "RICH_TEXT",
  "IMAGE_GALLERY",
  "FACILITIES_GRID",
  "FLOOR_PLAN",
  "TIMELINE_PROGRESS",
  "RELATED_PROJECTS",
  "SALES_POLICY",
] as const;

export const projectBlockTypeSchema = z.enum(PROJECT_BLOCK_TYPES);
export type ProjectBlockType = z.output<typeof projectBlockTypeSchema>;

const blockIdentityShape = {
  // Optional until persisted legacy blocks have stable identifiers backfilled.
  id: z.string().min(1).optional(),
};

const geoPointSchema = z
  .object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  })
  .catchall(jsonValueSchema);

export const locationBlockDataSchema = z
  .object({
    tagline: z.string(),
    heading: z.string(),
    description: z.string(),
    mapConfig: z
      .object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        zoom: z.number().min(0).max(24),
        style: z.enum(["luxury-dark", "minimal-light", "satellite"]),
        address: z.string(),
      })
      .catchall(jsonValueSchema),
    poiGroups: z.array(
      z
        .object({
          groupName: z.string(),
          items: z.array(
            z
              .object({
                name: z.string(),
                value: z.string(),
                unit: z.enum(["min", "km", "m"]),
                coordinates: geoPointSchema,
                highlight: z.boolean().optional(),
              })
              .catchall(jsonValueSchema),
          ),
        })
        .catchall(jsonValueSchema),
    ),
    highlights: z.array(
      z
        .object({
          title: z.string(),
          content: z.string(),
        })
        .catchall(jsonValueSchema),
    ),
  })
  .catchall(jsonValueSchema);

export const facilitiesBlockDataSchema = z
  .object({
    heading: z.string(),
    subHeading: z.string(),
    layout: z.enum(["grid", "scroll", "feature"]),
    items: z.array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          image: z.string().optional(),
          iconName: z.string().optional(),
          category: z.string().optional(),
        })
        .catchall(jsonValueSchema),
    ),
  })
  .catchall(jsonValueSchema);

const floorPlanImageSchema = z
  .object({
    src: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  })
  .catchall(jsonValueSchema);

const floorPlanSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    images: z.array(floorPlanImageSchema),
    areaNet: z.string(),
    areaGross: z.string(),
    bedroom: z.number().int().nonnegative(),
    bathroom: z.number().int().nonnegative(),
    direction: z.string(),
    highlights: z.array(z.string()),
  })
  .catchall(jsonValueSchema);

export const floorPlanBlockDataSchema = z
  .object({
    heading: z.string(),
    description: z.string(),
    tabs: z.array(
      z
        .object({
          tabName: z.string(),
          plans: z.array(floorPlanSchema),
        })
        .catchall(jsonValueSchema),
    ),
  })
  .catchall(jsonValueSchema);

export const timelineBlockDataSchema = z
  .object({
    heading: z.string(),
    subHeading: z.string(),
    currentStatus: z.string(),
    steps: z.array(
      z
        .object({
          id: z.string(),
          date: z.string(),
          title: z.string(),
          description: z.string().optional(),
          status: z.enum(["completed", "ongoing", "upcoming"]),
          image: z.string().optional(),
        })
        .catchall(jsonValueSchema),
    ),
  })
  .catchall(jsonValueSchema);

export const pricingBlockDataSchema = z
  .object({
    heading: z.string(),
    subHeading: z.string(),
    image: z.string().optional(),
    priceList: z.array(
      z
        .object({
          unitType: z.string(),
          minPrice: z.number().nonnegative(),
          maxPrice: z.number().nonnegative().optional(),
          areaRange: z.string().optional(),
          status: z.enum(["available", "booking", "sold-out"]),
        })
        .catchall(jsonValueSchema),
    ),
  })
  .catchall(jsonValueSchema);

export const salesPolicyBlockDataSchema = z
  .object({
    heading: z.string(),
    subHeading: z.string(),
    image: z.string().optional(),
    policies: z.array(
      z
        .object({
          title: z.string(),
          description: z.string(),
          iconName: z.string(),
        })
        .catchall(jsonValueSchema),
    ),
    policyFileUrl: z.string().optional(),
  })
  .catchall(jsonValueSchema);

export const galleryBlockDataSchema = z
  .object({
    heading: z.string().optional(),
    subHeading: z.string().optional(),
    layout: z.enum(["grid", "carousel", "masonry", "fullscreen-slider"]),
    aspectRatio: z.enum(["square", "video", "portrait"]),
    images: z.array(
      z
        .object({
          id: z.string(),
          url: z.string(),
          alt: z.string(),
          caption: z.string().optional(),
          category: z.string().optional(),
        })
        .catchall(jsonValueSchema),
    ),
  })
  .catchall(jsonValueSchema);

export const locationBlockSchema = z
  .object({
    ...blockIdentityShape,
    type: z.literal("LOCATION"),
    data: locationBlockDataSchema,
  })
  .catchall(jsonValueSchema);

/** Legacy discriminator accepted while existing page JSON is migrated. */
export const locationMapBlockSchema = z
  .object({
    ...blockIdentityShape,
    type: z.literal("LOCATION_MAP"),
    data: locationBlockDataSchema,
  })
  .catchall(jsonValueSchema);

export const facilitiesBlockSchema = z
  .object({
    ...blockIdentityShape,
    type: z.literal("FACILITIES_GRID"),
    data: facilitiesBlockDataSchema,
  })
  .catchall(jsonValueSchema);

export const floorPlanBlockSchema = z
  .object({
    ...blockIdentityShape,
    type: z.literal("FLOOR_PLAN"),
    data: floorPlanBlockDataSchema,
  })
  .catchall(jsonValueSchema);

export const timelineBlockSchema = z
  .object({
    ...blockIdentityShape,
    type: z.literal("TIMELINE_PROGRESS"),
    data: timelineBlockDataSchema,
  })
  .catchall(jsonValueSchema);

export const pricingBlockSchema = z
  .object({
    ...blockIdentityShape,
    type: z.literal("PRICING_TABLE"),
    data: pricingBlockDataSchema,
  })
  .catchall(jsonValueSchema);

export const salesPolicyBlockSchema = z
  .object({
    ...blockIdentityShape,
    type: z.literal("SALES_POLICY"),
    data: salesPolicyBlockDataSchema,
  })
  .catchall(jsonValueSchema);

export const galleryBlockSchema = z
  .object({
    ...blockIdentityShape,
    type: z.literal("IMAGE_GALLERY"),
    data: galleryBlockDataSchema,
  })
  .catchall(jsonValueSchema);

function createOpaqueBlockSchema<TType extends string>(type: TType) {
  return z
    .object({
      ...blockIdentityShape,
      type: z.literal(type),
      // These persisted block kinds do not have a render contract yet.
      data: jsonObjectSchema,
    })
    .catchall(jsonValueSchema);
}

export const heroBlockSchema = createOpaqueBlockSchema("HERO");
export const financialLabBlockSchema = createOpaqueBlockSchema("FINANCIAL_LAB");
export const richTextBlockSchema = createOpaqueBlockSchema("RICH_TEXT");
export const relatedProjectsBlockSchema =
  createOpaqueBlockSchema("RELATED_PROJECTS");

export const projectBlockSchema = z.discriminatedUnion("type", [
  heroBlockSchema,
  locationBlockSchema,
  locationMapBlockSchema,
  pricingBlockSchema,
  financialLabBlockSchema,
  richTextBlockSchema,
  galleryBlockSchema,
  facilitiesBlockSchema,
  floorPlanBlockSchema,
  timelineBlockSchema,
  relatedProjectsBlockSchema,
  salesPolicyBlockSchema,
]);

export const projectBlocksSchema = z.array(projectBlockSchema).max(100);

export const projectPageContentSchema = z
  .object({
    blocks: projectBlocksSchema,
    version: z.number().int().min(1),
  })
  .catchall(jsonValueSchema);

export type LocationBlockData = z.output<typeof locationBlockDataSchema>;
export type FacilitiesBlockData = z.output<typeof facilitiesBlockDataSchema>;
export type FloorPlanBlockData = z.output<typeof floorPlanBlockDataSchema>;
export type TimelineBlockData = z.output<typeof timelineBlockDataSchema>;
export type PricingBlockData = z.output<typeof pricingBlockDataSchema>;
export type SalesPolicyBlockData = z.output<typeof salesPolicyBlockDataSchema>;
export type GalleryBlockData = z.output<typeof galleryBlockDataSchema>;

export type LocationBlock = z.output<typeof locationBlockSchema>;
export type LocationMapBlock = z.output<typeof locationMapBlockSchema>;
export type FacilitiesBlock = z.output<typeof facilitiesBlockSchema>;
export type FloorPlanBlock = z.output<typeof floorPlanBlockSchema>;
export type TimelineBlock = z.output<typeof timelineBlockSchema>;
export type PricingBlock = z.output<typeof pricingBlockSchema>;
export type SalesPolicyBlock = z.output<typeof salesPolicyBlockSchema>;
export type PolicyBlock = SalesPolicyBlock;
export type GalleryBlock = z.output<typeof galleryBlockSchema>;
export type ProjectBlock = z.output<typeof projectBlockSchema>;
export type ProjectBlockData = ProjectBlock["data"];
export type ProjectBlockOfType<TType extends ProjectBlockType> = Extract<
  ProjectBlock,
  { type: TType }
>;
export type ProjectBlockDataOfType<TType extends ProjectBlockType> =
  ProjectBlockOfType<TType>["data"];
export type ProjectPageContent = z.output<typeof projectPageContentSchema>;

export function parseProjectBlock(input: unknown): ProjectBlock {
  return projectBlockSchema.parse(input);
}

export function safeParseProjectBlock(input: unknown) {
  return projectBlockSchema.safeParse(input);
}

export function isProjectBlock(input: unknown): input is ProjectBlock {
  return projectBlockSchema.safeParse(input).success;
}

export function parseProjectBlocks(input: unknown): ProjectBlock[] {
  return projectBlocksSchema.parse(input);
}

export function safeParseProjectBlocks(input: unknown) {
  return projectBlocksSchema.safeParse(input);
}

export function parseProjectPageContent(input: unknown): ProjectPageContent {
  return projectPageContentSchema.parse(input);
}

export function safeParseProjectPageContent(input: unknown) {
  return projectPageContentSchema.safeParse(input);
}

export const PUBLICATION_STATUSES = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
] as const;

export const publicationStatusSchema = z.enum(PUBLICATION_STATUSES);
export type PublicationStatus = z.output<typeof publicationStatusSchema>;

export const SALES_STATUSES = [
  "OPEN_FOR_SALE",
  "COMING_SOON",
  "HANDED_OVER",
] as const;

export const salesStatusSchema = z.enum(SALES_STATUSES);
export type SalesStatus = z.output<typeof salesStatusSchema>;

export const projectAnalysisSchema = z.object({
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  investmentTarget: z.string(),
});

export type ProjectAnalysis = z.output<typeof projectAnalysisSchema>;

const nullableTextSchema = z.string().nullable();

export const projectSummarySchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  slug: z.string(),
  description: nullableTextSchema,
  thumbnailUrl: nullableTextSchema,
  publicationStatus: publicationStatusSchema,
  // Nullable remains accepted for legacy rows and the current UI fallback.
  salesStatus: salesStatusSchema.nullable(),
  location: nullableTextSchema,
  priceRange: nullableTextSchema,
  legalStatus: nullableTextSchema,
  expectedYield: nullableTextSchema,
  features: z.array(z.string()),
  analysis: projectAnalysisSchema.nullable(),
  featured: z.boolean(),
  sortOrder: z.number().int(),
  seoTitle: nullableTextSchema,
  seoDescription: nullableTextSchema,
  // Development mock projects predate this response field.
  updatedAt: isoDateTimeSchema.optional(),
});

export type ProjectSummary = z.output<typeof projectSummarySchema>;

export const projectDetailSchema = projectSummarySchema.extend({
  page: projectPageContentSchema.nullable(),
  publishedAt: isoDateTimeSchema.nullable().optional(),
  createdAt: isoDateTimeSchema.optional(),
});

export type ProjectDetail = z.output<typeof projectDetailSchema>;

/**
 * Transitional response contract: NestJS currently returns the project
 * directly, while older adapters may still receive `{ data: project }`.
 * The schema always normalizes either representation to `ProjectDetail`.
 */
export const projectDetailPayloadSchema = z
  .union([
    projectDetailSchema,
    createDataEnvelopeSchema(projectDetailSchema),
  ])
  .transform((payload) => ("data" in payload ? payload.data : payload));

export const projectListResponseSchema =
  createListEnvelopeSchema(projectSummarySchema);

export type ProjectListResponse = ListEnvelope<ProjectSummary>;

export const projectListQuerySchema = z
  .object({
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    featured: z.boolean().optional(),
    salesStatus: salesStatusSchema.optional(),
  })
  .strict();

export type ProjectListQuery = z.output<typeof projectListQuerySchema>;

export const createProjectInputSchema = z
  .object({
    name: z.string().trim().min(2).max(160),
  })
  .strict();

export type CreateProjectInput = z.output<typeof createProjectInputSchema>;

const SALES_STATUS_LABELS = {
  OPEN_FOR_SALE: "Đang mở bán",
  COMING_SOON: "Sắp ra mắt",
  HANDED_OVER: "Đã bàn giao",
} satisfies Record<SalesStatus, string>;

export function getSalesStatusLabel(status: SalesStatus | null): string {
  return status ? SALES_STATUS_LABELS[status] : "Đang cập nhật";
}

export function parseProjectSummary(input: unknown): ProjectSummary {
  return projectSummarySchema.parse(input);
}

export function safeParseProjectSummary(input: unknown) {
  return projectSummarySchema.safeParse(input);
}

export function parseProjectDetail(input: unknown): ProjectDetail {
  return projectDetailSchema.parse(input);
}

export function safeParseProjectDetail(input: unknown) {
  return projectDetailSchema.safeParse(input);
}

export function parseProjectDetailPayload(input: unknown): ProjectDetail {
  return projectDetailPayloadSchema.parse(input);
}

export function safeParseProjectDetailPayload(input: unknown) {
  return projectDetailPayloadSchema.safeParse(input);
}

export function parseProjectListResponse(input: unknown): ProjectListResponse {
  return projectListResponseSchema.parse(input);
}

export function safeParseProjectListResponse(input: unknown) {
  return projectListResponseSchema.safeParse(input);
}

export function parseProjectListQuery(input: unknown): ProjectListQuery {
  return projectListQuerySchema.parse(input);
}

export function parseCreateProjectInput(input: unknown): CreateProjectInput {
  return createProjectInputSchema.parse(input);
}
