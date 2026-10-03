-- AlterTable
ALTER TABLE "recurring_transactions" ADD COLUMN "dayOfMonth" INTEGER;

UPDATE "recurring_transactions"
SET "dayOfMonth" = EXTRACT(DAY FROM ("startDate" AT TIME ZONE 'America/Sao_Paulo'))
WHERE "dayOfMonth" IS NULL;

ALTER TABLE "recurring_transactions" ALTER COLUMN "dayOfMonth" SET NOT NULL;
