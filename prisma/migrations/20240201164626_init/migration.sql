-- AlterTable
ALTER TABLE "Setting" ADD COLUMN "description" TEXT;

-- CreateIndex
CREATE INDEX "idx_setting_description" ON "Setting"("description");
