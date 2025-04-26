-- Delete records with null phone numbers first
DELETE FROM "users"
WHERE "phoneNumber" IS NULL;
-- Then alter the table
ALTER TABLE "users"
ALTER COLUMN "email"
SET DEFAULT NULL,
  ALTER COLUMN "password"
SET DEFAULT NULL,
  ALTER COLUMN "phoneNumber"
SET NOT NULL,
  ALTER COLUMN "phoneNumber"
SET DATA TYPE VARCHAR(16);