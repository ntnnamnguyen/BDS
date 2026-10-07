-- AlterTable
ALTER TABLE "customer" ADD COLUMN     "note" TEXT,
ALTER COLUMN "email" DROP NOT NULL;
