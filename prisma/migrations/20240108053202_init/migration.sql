-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "authorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
