-- AlterTable
ALTER TABLE "Page" ADD COLUMN "publishedAt" DATETIME;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN "publishedAt" DATETIME;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "location" TEXT,
    "profile" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bannedAt" DATETIME,
    "lastLoginAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" DATETIME
);
INSERT INTO "new_User" ("avatar", "createdAt", "displayName", "email", "id", "lastLoginAt", "password", "updatedAt", "username") SELECT "avatar", "createdAt", "displayName", "email", "id", "lastLoginAt", "password", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE INDEX "idx_user_banned" ON "User"("banned");
CREATE INDEX "idx_user_bannedAt" ON "User"("bannedAt");
CREATE INDEX "idx_user_createdAt" ON "User"("createdAt");
CREATE INDEX "idx_user_lastLogin" ON "User"("lastLoginAt");
CREATE INDEX "idx_user_updated" ON "User"("updatedAt");
CREATE INDEX "idx_user_verified" ON "User"("verified");
CREATE INDEX "idx_user_verifiedAt" ON "User"("verifiedAt");
CREATE UNIQUE INDEX "unq_user_email" ON "User"("email");
CREATE UNIQUE INDEX "unq_user_username" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "idx_page_published" ON "Page"("published");

-- CreateIndex
CREATE INDEX "idx_page_publishedAt" ON "Page"("publishedAt");

-- CreateIndex
CREATE INDEX "idx_post_published" ON "Post"("published");

-- CreateIndex
CREATE INDEX "idx_post_publishedAt" ON "Post"("publishedAt");
