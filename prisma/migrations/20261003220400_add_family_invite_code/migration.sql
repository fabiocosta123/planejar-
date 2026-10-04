ALTER TABLE "families" ADD COLUMN "inviteCode" TEXT;

UPDATE "families"
SET "inviteCode" = upper(substr(md5("id"), 1, 6))
WHERE "inviteCode" IS NULL;

ALTER TABLE "families" ALTER COLUMN "inviteCode" SET NOT NULL;

CREATE UNIQUE INDEX "families_inviteCode_key" ON "families"("inviteCode");
