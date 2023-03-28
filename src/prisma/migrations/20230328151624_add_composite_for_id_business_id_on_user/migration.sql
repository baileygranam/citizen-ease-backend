/*
  Warnings:

  - A unique constraint covering the columns `[id,businessId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_id_businessId_key" ON "users"("id", "businessId");
