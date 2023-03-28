/*
  Warnings:

  - A unique constraint covering the columns `[name,businessId]` on the table `roles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "roles_name_businessId_key" ON "roles"("name", "businessId");
