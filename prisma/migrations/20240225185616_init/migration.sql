-- AlterTable
ALTER TABLE "Note" ADD COLUMN "title" TEXT;

-- CreateIndex
CREATE INDEX "idx_note_title" ON "Note"("title");
