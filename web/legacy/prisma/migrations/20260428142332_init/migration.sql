-- CreateTable
CREATE TABLE "customer" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone_number" TEXT,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);
