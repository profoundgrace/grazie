/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RoleUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "roleId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RoleUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RoleUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "authorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "search" TEXT,
    "meta" TEXT,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorId", "body", "id", "meta", "published", "search", "slug", "title") SELECT "authorId", "body", "id", "meta", "published", "search", "slug", "title" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE INDEX "idx_post_author" ON "Post"("authorId");
CREATE INDEX "idx_post_created" ON "Post"("createdAt");
CREATE INDEX "idx_post_updated" ON "Post"("updatedAt");
CREATE INDEX "idx_post_search" ON "Post"("search");
CREATE UNIQUE INDEX "unq_post_slug" ON "Post"("slug");
CREATE TABLE "new_Page" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "authorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "search" TEXT,
    "meta" TEXT,
    CONSTRAINT "Page_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Page" ("authorId", "body", "id", "meta", "published", "search", "slug", "summary", "title") SELECT "authorId", "body", "id", "meta", "published", "search", "slug", "summary", "title" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
CREATE INDEX "idx_page_author" ON "Page"("authorId");
CREATE INDEX "idx_page_created" ON "Page"("createdAt");
CREATE INDEX "idx_page_updated" ON "Page"("updatedAt");
CREATE INDEX "idx_page_search" ON "Page"("search");
CREATE INDEX "idx_page_summary" ON "Page"("summary");
CREATE UNIQUE INDEX "unq_page_slug" ON "Page"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "idx_role_active" ON "Role"("active");

-- CreateIndex
CREATE UNIQUE INDEX "unq_role_name" ON "Role"("name");

-- CreateIndex
CREATE INDEX "idx_user_role_active" ON "RoleUser"("active");

-- CreateIndex
CREATE INDEX "idx_user_role_user" ON "RoleUser"("userId");

-- CreateIndex
CREATE INDEX "idx_user_role_created" ON "RoleUser"("createdAt");

-- CreateIndex
CREATE INDEX "idx_user_role_updated" ON "RoleUser"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "unq_user_role" ON "RoleUser"("roleId", "userId");

-- CreateIndex
CREATE INDEX "idx_user_createdAt" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "idx_user_lastLogindAt" ON "User"("lastLoginAt");

-- CreateIndex
CREATE UNIQUE INDEX "unq_user_email" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "unq_user_username" ON "User"("username");
