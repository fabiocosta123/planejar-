-- AlterTable
ALTER TABLE "user_settings" ADD COLUMN     "currentFamilyId" TEXT;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_currentFamilyId_fkey" FOREIGN KEY ("currentFamilyId") REFERENCES "families"("id") ON DELETE SET NULL ON UPDATE CASCADE;
