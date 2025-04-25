/*
  Warnings:

  - A unique constraint covering the columns `[groupId,membershipId,groupCycle]` on the table `draws` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DEFAULT NULL,
ALTER COLUMN "password" SET DEFAULT NULL,
ALTER COLUMN "phoneNumber" SET DEFAULT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "draws_groupId_membershipId_groupCycle_key" ON "draws"("groupId", "membershipId", "groupCycle");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");
