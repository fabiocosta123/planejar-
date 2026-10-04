-- AlterEnum
ALTER TYPE "RecurrenceFrequency" ADD VALUE 'DAILY';

-- AlterTable
ALTER TABLE "recurring_transactions" ADD COLUMN "weekdays" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
