-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "membersPerRound" INTEGER DEFAULT 1;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DEFAULT NULL,
ALTER COLUMN "password" SET DEFAULT NULL;
