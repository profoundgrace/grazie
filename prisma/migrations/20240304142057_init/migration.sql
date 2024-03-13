/*
  Warnings:

  - Added the required column `type` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "search" TEXT,
    "meta" TEXT,
    "type" TEXT NOT NULL,
    CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Note" ("authorId", "body", "createdAt", "id", "meta", "pinned", "search", "title", "updatedAt") SELECT "authorId", "body", "createdAt", "id", "meta", "pinned", "search", "title", "updatedAt" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
CREATE INDEX "idx_note_author" ON "Note"("authorId");
CREATE INDEX "idx_note_created" ON "Note"("createdAt");
CREATE INDEX "idx_note_updated" ON "Note"("updatedAt");
CREATE INDEX "idx_note_pinned" ON "Note"("pinned");
CREATE INDEX "idx_note_title" ON "Note"("title");
CREATE INDEX "idx_note_search" ON "Note"("search");
CREATE INDEX "idx_note_type" ON "Note"("type");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
