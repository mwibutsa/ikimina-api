-- AlterTable
ALTER TABLE "draws" ADD COLUMN     "groupCycle" INTEGER DEFAULT 1;

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "activeCycle" INTEGER DEFAULT 1;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DEFAULT NULL,
ALTER COLUMN "password" SET DEFAULT NULL,
ALTER COLUMN "phoneNumber" SET DEFAULT NULL;
