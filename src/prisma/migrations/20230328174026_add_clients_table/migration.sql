-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'SPANISH', 'CHINESE', 'TAGALOG', 'VIETNAMESE', 'JAPANESE', 'ARABIC', 'FRENCH', 'ITALIAN', 'POLISH', 'KOREAN', 'RUSSIAN', 'PORTUGUESE', 'HINDI');

-- CreateEnum
CREATE TYPE "MartialStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'SEPARATED', 'WIDOWED', 'DOMESTIC_PARTNERSHIP', 'CIVIL_UNION', 'ANNULLED');

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "dateOfBirth" DATE,
    "gender" "Gender",
    "preferredLanguage" "Language",
    "maritalStatus" "MartialStatus",
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "addressCity" TEXT,
    "addressState" TEXT,
    "addressZipcode" TEXT,
    "addressCountry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "businessId" TEXT NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_phoneNumber_key" ON "clients"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "clients_id_businessId_key" ON "clients"("id", "businessId");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
