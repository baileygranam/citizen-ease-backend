-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "Disposition" AS ENUM ('GUILTY', 'NOT_GUILTY', 'ACQUITTAL', 'PROBATION', 'PLEA_BARGAIN', 'DEFERRED_ADJUDICATION', 'DISMISSAL', 'EXPUNGEMENT', 'DIVERSION_PROGRAMS', 'NOLO_CONTENDERE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPROVED', 'DENIED');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'SPANISH', 'CHINESE', 'TAGALOG', 'VIETNAMESE', 'ARABIC', 'FRENCH', 'ITALIAN', 'KOREAN', 'RUSSIAN', 'PORTUGUESE', 'HINDI');

-- CreateEnum
CREATE TYPE "MartialStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'SEPARATED', 'WIDOWED', 'DOMESTIC_PARTNERSHIP', 'CIVIL_UNION', 'ANNULLED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT');

-- CreateTable
CREATE TABLE "application_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "application_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cases" (
    "id" TEXT NOT NULL,
    "status" "CaseStatus" NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "businessId" TEXT NOT NULL,
    "caseManagerId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "birthdate" DATE,
    "gender" "Gender",
    "maritalStatus" "MartialStatus",
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "addressCity" TEXT,
    "addressState" TEXT,
    "addressZipcode" TEXT,
    "addressCountry" TEXT,
    "preferredLanguage" "Language",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "businessId" TEXT NOT NULL,
    "referralSourceId" TEXT NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "criminal_history" (
    "id" TEXT NOT NULL,
    "caseNumber" TEXT,
    "jurisdiction" TEXT,
    "convictionDate" DATE,
    "offenseDate" DATE,
    "offenseType" TEXT,
    "offenseSeverity" TEXT,
    "offenseDescription" TEXT,
    "disposition" "Disposition",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "clientId" TEXT NOT NULL,

    CONSTRAINT "criminal_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "caseId" TEXT,
    "clientId" TEXT,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entries" (
    "id" TEXT NOT NULL,
    "entryPort" TEXT,
    "entryDate" DATE,
    "exitDate" DATE,
    "exitReason" TEXT,
    "statusAtEntry" TEXT,
    "caughtAtBorder" BOOLEAN NOT NULL,
    "fingerprinted" BOOLEAN NOT NULL,
    "photoTaken" BOOLEAN NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "clientId" TEXT NOT NULL,

    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "immigration_history" (
    "id" TEXT NOT NULL,
    "notes" TEXT,
    "filingDate" DATE,
    "decisionDate" DATE,
    "status" "ApplicationStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "clientId" TEXT NOT NULL,
    "applicationTypeId" TEXT NOT NULL,

    CONSTRAINT "immigration_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timesheets" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "minutes" INTEGER NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,

    CONSTRAINT "timesheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "businessId" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral_sources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "businessId" TEXT NOT NULL,

    CONSTRAINT "referral_sources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cases_id_businessId_key" ON "cases"("id", "businessId");

-- CreateIndex
CREATE UNIQUE INDEX "clients_id_businessId_key" ON "clients"("id", "businessId");

-- CreateIndex
CREATE UNIQUE INDEX "criminal_history_id_clientId_key" ON "criminal_history"("id", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "entries_id_clientId_key" ON "entries"("id", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "immigration_history_id_clientId_key" ON "immigration_history"("id", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "notes_id_caseId_key" ON "notes"("id", "caseId");

-- CreateIndex
CREATE UNIQUE INDEX "timesheets_id_caseId_key" ON "timesheets"("id", "caseId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_businessId_key" ON "users"("id", "businessId");

-- CreateIndex
CREATE UNIQUE INDEX "referral_sources_name_key" ON "referral_sources"("name");

-- CreateIndex
CREATE UNIQUE INDEX "referral_sources_id_businessId_key" ON "referral_sources"("id", "businessId");

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_caseManagerId_fkey" FOREIGN KEY ("caseManagerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_referralSourceId_fkey" FOREIGN KEY ("referralSourceId") REFERENCES "referral_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criminal_history" ADD CONSTRAINT "criminal_history_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entries" ADD CONSTRAINT "entries_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immigration_history" ADD CONSTRAINT "immigration_history_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immigration_history" ADD CONSTRAINT "immigration_history_applicationTypeId_fkey" FOREIGN KEY ("applicationTypeId") REFERENCES "application_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_sources" ADD CONSTRAINT "referral_sources_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
