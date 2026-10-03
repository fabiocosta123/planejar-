-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "user_settings" ADD COLUMN     "plan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE';
