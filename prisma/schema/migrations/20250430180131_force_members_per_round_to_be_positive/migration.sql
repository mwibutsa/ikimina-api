ALTER TABLE "groups"
ALTER COLUMN "membersPerRound"
SET NOT NULL,
    ALTER COLUMN "membersPerRound"
SET DEFAULT 1,
    ALTER COLUMN "membersPerRound" TYPE INTEGER USING "membersPerRound"::INTEGER,
    ADD CONSTRAINT "membersPerRound_positive" CHECK ("membersPerRound" > 0);