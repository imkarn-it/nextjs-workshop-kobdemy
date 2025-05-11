-- CreateEnum
CREATE TYPE "CatagoryStatus" AS ENUM ('Active', 'Inactive');

-- CreateTable
CREATE TABLE "Catagory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "CatagoryStatus" NOT NULL DEFAULT 'Active',
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Catagory_pkey" PRIMARY KEY ("id")
);
