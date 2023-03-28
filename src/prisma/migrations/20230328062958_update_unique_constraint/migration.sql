/*
  Warnings:

  - A unique constraint covering the columns `[id,businessId,name]` on the table `roles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "roles_name_businessId_key";

-- CreateIndex
CREATE UNIQUE INDEX "roles_id_businessId_name_key" ON "roles"("id", "businessId", "name");
