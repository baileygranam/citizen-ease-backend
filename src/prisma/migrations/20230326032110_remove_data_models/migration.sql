/*
  Warnings:

  - You are about to drop the `application_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cases` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `criminal_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `entries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `immigration_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `referral_sources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `timesheets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_businessId_fkey";

-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_caseManagerId_fkey";

-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_clientId_fkey";

-- DropForeignKey
ALTER TABLE "clients" DROP CONSTRAINT "clients_businessId_fkey";

-- DropForeignKey
ALTER TABLE "clients" DROP CONSTRAINT "clients_referralSourceId_fkey";

-- DropForeignKey
ALTER TABLE "criminal_history" DROP CONSTRAINT "criminal_history_clientId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_caseId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_clientId_fkey";

-- DropForeignKey
ALTER TABLE "entries" DROP CONSTRAINT "entries_clientId_fkey";

-- DropForeignKey
ALTER TABLE "immigration_history" DROP CONSTRAINT "immigration_history_applicationTypeId_fkey";

-- DropForeignKey
ALTER TABLE "immigration_history" DROP CONSTRAINT "immigration_history_clientId_fkey";

-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "notes_authorId_fkey";

-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "notes_caseId_fkey";

-- DropForeignKey
ALTER TABLE "referral_sources" DROP CONSTRAINT "referral_sources_businessId_fkey";

-- DropForeignKey
ALTER TABLE "timesheets" DROP CONSTRAINT "timesheets_authorId_fkey";

-- DropForeignKey
ALTER TABLE "timesheets" DROP CONSTRAINT "timesheets_caseId_fkey";

-- DropTable
DROP TABLE "application_types";

-- DropTable
DROP TABLE "cases";

-- DropTable
DROP TABLE "clients";

-- DropTable
DROP TABLE "criminal_history";

-- DropTable
DROP TABLE "documents";

-- DropTable
DROP TABLE "entries";

-- DropTable
DROP TABLE "immigration_history";

-- DropTable
DROP TABLE "notes";

-- DropTable
DROP TABLE "referral_sources";

-- DropTable
DROP TABLE "timesheets";

-- DropEnum
DROP TYPE "ApplicationStatus";

-- DropEnum
DROP TYPE "CaseStatus";

-- DropEnum
DROP TYPE "Disposition";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "Language";

-- DropEnum
DROP TYPE "MartialStatus";
