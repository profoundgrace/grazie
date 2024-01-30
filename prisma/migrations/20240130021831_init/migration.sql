-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Privilege" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subject" TEXT NOT NULL,
    "action" TEXT NOT NULL
);
INSERT INTO "new_Privilege" ("action", "id", "subject") SELECT "action", "id", "subject" FROM "Privilege";
DROP TABLE "Privilege";
ALTER TABLE "new_Privilege" RENAME TO "Privilege";
CREATE INDEX "idx_privilege_subject" ON "Privilege"("subject");
CREATE INDEX "idx_privilege_action" ON "Privilege"("action");
CREATE UNIQUE INDEX "unq_privilege" ON "Privilege"("subject", "action");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
