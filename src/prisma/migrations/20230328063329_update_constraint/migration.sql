/*
  Warnings:

  - A unique constraint covering the columns `[id,businessId]` on the table `roles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "roles_id_businessId_key" ON "roles"("id", "businessId");
