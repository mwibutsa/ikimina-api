-- AlterTable
ALTER TABLE "users"
ADD COLUMN "firstName" TEXT,
    ADD COLUMN "lastName" TEXT,
    ALTER COLUMN "email"
SET DEFAULT NULL,
    ALTER COLUMN "password"
SET DEFAULT NULL,
    ALTER COLUMN "phoneNumber"
SET DEFAULT NULL;