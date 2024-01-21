-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "authorId" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "publishedAt" TEXT,
    "updatedAt" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "slug" TEXT,
    "search" TEXT,
    "meta" TEXT,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorId", "body", "createdAt", "id", "meta", "published", "publishedAt", "search", "slug", "title", "updatedAt") SELECT "authorId", "body", "createdAt", "id", "meta", "published", "publishedAt", "search", "slug", "title", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE INDEX "idx_post_author" ON "Post"("authorId");
CREATE INDEX "idx_post_created" ON "Post"("createdAt");
CREATE INDEX "idx_post_published" ON "Post"("published");
CREATE INDEX "idx_post_publishedAt" ON "Post"("publishedAt");
CREATE INDEX "idx_post_updated" ON "Post"("updatedAt");
CREATE INDEX "idx_post_search" ON "Post"("search");
CREATE UNIQUE INDEX "unq_post_slug" ON "Post"("slug");
CREATE TABLE "new_RoleUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "roleId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    CONSTRAINT "RoleUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RoleUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RoleUser" ("active", "createdAt", "id", "roleId", "updatedAt", "userId") SELECT "active", "createdAt", "id", "roleId", "updatedAt", "userId" FROM "RoleUser";
DROP TABLE "RoleUser";
ALTER TABLE "new_RoleUser" RENAME TO "RoleUser";
CREATE INDEX "idx_user_role_active" ON "RoleUser"("active");
CREATE INDEX "idx_user_role_user" ON "RoleUser"("userId");
CREATE INDEX "idx_user_role_created" ON "RoleUser"("createdAt");
CREATE INDEX "idx_user_role_updated" ON "RoleUser"("updatedAt");
CREATE UNIQUE INDEX "unq_user_role" ON "RoleUser"("roleId", "userId");
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
    "createdAt" TEXT NOT NULL,
    "bannedAt" TEXT,
    "lastLoginAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "verifiedAt" TEXT
);
INSERT INTO "new_User" ("avatar", "banned", "bannedAt", "createdAt", "displayName", "email", "id", "lastLoginAt", "location", "password", "profile", "updatedAt", "username", "verified", "verifiedAt") SELECT "avatar", "banned", "bannedAt", "createdAt", "displayName", "email", "id", "lastLoginAt", "location", "password", "profile", "updatedAt", "username", "verified", "verifiedAt" FROM "User";
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
CREATE TABLE "new_Page" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "authorId" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "publishedAt" TEXT,
    "updatedAt" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "search" TEXT,
    "meta" TEXT,
    CONSTRAINT "Page_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Page" ("authorId", "body", "createdAt", "id", "meta", "published", "publishedAt", "search", "slug", "summary", "title", "updatedAt") SELECT "authorId", "body", "createdAt", "id", "meta", "published", "publishedAt", "search", "slug", "summary", "title", "updatedAt" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
CREATE INDEX "idx_page_author" ON "Page"("authorId");
CREATE INDEX "idx_page_created" ON "Page"("createdAt");
CREATE INDEX "idx_page_published" ON "Page"("published");
CREATE INDEX "idx_page_publishedAt" ON "Page"("publishedAt");
CREATE INDEX "idx_page_updated" ON "Page"("updatedAt");
CREATE INDEX "idx_page_search" ON "Page"("search");
CREATE INDEX "idx_page_summary" ON "Page"("summary");
CREATE UNIQUE INDEX "unq_page_slug" ON "Page"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
