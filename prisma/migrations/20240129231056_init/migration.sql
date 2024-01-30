-- CreateTable
CREATE TABLE "Privilege" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subject" INTEGER NOT NULL,
    "action" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RolePrivilege" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roleId" INTEGER NOT NULL,
    "privilegeId" INTEGER NOT NULL,
    "inverted" BOOLEAN NOT NULL DEFAULT false,
    "conditions" TEXT,
    "description" TEXT,
    CONSTRAINT "RolePrivilege_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RolePrivilege_privilegeId_fkey" FOREIGN KEY ("privilegeId") REFERENCES "Privilege" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Page" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "authorId" INTEGER NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "publishedAt" INTEGER,
    "updatedAt" INTEGER NOT NULL,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
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
CREATE INDEX "idx_page_views_count" ON "Page"("viewsCount");
CREATE UNIQUE INDEX "unq_page_slug" ON "Page"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "idx_privilege_subject" ON "Privilege"("subject");

-- CreateIndex
CREATE INDEX "idx_privilege_action" ON "Privilege"("action");

-- CreateIndex
CREATE UNIQUE INDEX "unq_privilege" ON "Privilege"("subject", "action");

-- CreateIndex
CREATE INDEX "idx_role_privilege_role" ON "RolePrivilege"("roleId");

-- CreateIndex
CREATE INDEX "idx_role_privilege" ON "RolePrivilege"("privilegeId");

-- CreateIndex
CREATE INDEX "idx_role_privilege_inverted" ON "RolePrivilege"("inverted");

-- CreateIndex
CREATE INDEX "idx_role_privilege_description" ON "RolePrivilege"("description");
