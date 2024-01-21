-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "displayName", "email", "id", "lastLoginAt", "password", "username") SELECT "createdAt", "displayName", "email", "id", "lastLoginAt", "password", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE INDEX "idx_user_createdAt" ON "User"("createdAt");
CREATE INDEX "idx_user_lastLogindAt" ON "User"("lastLoginAt");
CREATE INDEX "idx_user_updated" ON "User"("updatedAt");
CREATE UNIQUE INDEX "unq_user_email" ON "User"("email");
CREATE UNIQUE INDEX "unq_user_username" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
