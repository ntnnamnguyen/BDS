-- CreateEnum
CREATE TYPE "SalesStatus" AS ENUM ('OPEN_FOR_SALE', 'COMING_SOON', 'HANDED_OVER');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'FOLLOWING', 'CLOSED', 'CANCELLED');

-- AlterTable
ALTER TABLE "projects"
ADD COLUMN "location" TEXT,
ADD COLUMN "price_range" TEXT,
ADD COLUMN "sales_status" "SalesStatus" NOT NULL DEFAULT 'COMING_SOON',
ADD COLUMN "legal_status" TEXT,
ADD COLUMN "expected_yield" TEXT,
ADD COLUMN "features" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN "analysis" JSONB,
ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "published_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "legacy_customer_id" INTEGER,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "message" TEXT,
    "project_id" UUID,
    "interest_data" JSONB,
    "source_path" TEXT,
    "client_request_id" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leads_legacy_customer_id_key" ON "leads"("legacy_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "leads_client_request_id_key" ON "leads"("client_request_id");

-- CreateIndex
CREATE INDEX "leads_project_id_idx" ON "leads"("project_id");

-- CreateIndex
CREATE INDEX "leads_status_created_at_idx" ON "leads"("status", "created_at");

-- CreateIndex
CREATE INDEX "leads_phone_idx" ON "leads"("phone");

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "leads"("email");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_legacy_customer_id_fkey" FOREIGN KEY ("legacy_customer_id") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill legacy contact submissions. The unique legacy_customer_id plus
-- ON CONFLICT makes this copy safe to repeat while retaining customer intact.
INSERT INTO "leads" (
    "legacy_customer_id",
    "full_name",
    "phone",
    "email",
    "message",
    "source_path",
    "status",
    "created_at",
    "updated_at"
)
SELECT
    "id",
    COALESCE(NULLIF(BTRIM("name"), ''), 'Khách hàng #' || "id"::TEXT),
    COALESCE("phone_number", ''),
    "email",
    "note",
    '/contact',
    'NEW'::"LeadStatus",
    "created_at",
    "created_at"
FROM "customer"
ON CONFLICT ("legacy_customer_id") DO NOTHING;
