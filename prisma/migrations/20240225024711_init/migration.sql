-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Label" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    "notesCount" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT
);
INSERT INTO "new_Label" ("createdAt", "id", "name", "slug", "updatedAt") SELECT "createdAt", "id", "name", "slug", "updatedAt" FROM "Label";
DROP TABLE "Label";
ALTER TABLE "new_Label" RENAME TO "Label";
CREATE INDEX "idx_label_created" ON "Label"("createdAt");
CREATE INDEX "idx_label_updated" ON "Label"("updatedAt");
CREATE INDEX "idx_label_name" ON "Label"("name");
CREATE INDEX "idx_label_slug" ON "Label"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
