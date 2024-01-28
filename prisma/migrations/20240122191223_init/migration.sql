-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    "lastActivityAt" INTEGER,
    "parentId" INTEGER,
    "postId" INTEGER NOT NULL,
    "repliesCount" INTEGER NOT NULL DEFAULT 0,
    "path" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "search" TEXT,
    "meta" TEXT,
    CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Note" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "search" TEXT,
    "meta" TEXT,
    CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Label" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT
);

-- CreateTable
CREATE TABLE "NoteLabel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "noteId" INTEGER NOT NULL,
    "labelId" INTEGER NOT NULL,
    CONSTRAINT "NoteLabel_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NoteLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "authorId" INTEGER NOT NULL,
    "commentsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" INTEGER NOT NULL,
    "publishedAt" INTEGER,
    "updatedAt" INTEGER NOT NULL,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
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
CREATE INDEX "idx_post_comments_count" ON "Post"("commentsCount");
CREATE INDEX "idx_post_created" ON "Post"("createdAt");
CREATE INDEX "idx_post_published" ON "Post"("published");
CREATE INDEX "idx_post_publishedAt" ON "Post"("publishedAt");
CREATE INDEX "idx_post_updated" ON "Post"("updatedAt");
CREATE INDEX "idx_post_views_count" ON "Post"("viewsCount");
CREATE INDEX "idx_post_search" ON "Post"("search");
CREATE UNIQUE INDEX "unq_post_slug" ON "Post"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "idx_comment_author" ON "Comment"("authorId");

-- CreateIndex
CREATE INDEX "idx_comment_created" ON "Comment"("createdAt");

-- CreateIndex
CREATE INDEX "idx_comment_updated" ON "Comment"("updatedAt");

-- CreateIndex
CREATE INDEX "idx_comment_last_activity" ON "Comment"("lastActivityAt");

-- CreateIndex
CREATE INDEX "idx_comment_locked" ON "Comment"("locked");

-- CreateIndex
CREATE INDEX "idx_comment_pinned" ON "Comment"("pinned");

-- CreateIndex
CREATE INDEX "idx_comment_parent" ON "Comment"("parentId");

-- CreateIndex
CREATE INDEX "idx_comment_post" ON "Comment"("postId");

-- CreateIndex
CREATE INDEX "idx_comment_replies_count" ON "Comment"("repliesCount");

-- CreateIndex
CREATE INDEX "idx_comment_path" ON "Comment"("path");

-- CreateIndex
CREATE INDEX "idx_comment_search" ON "Comment"("search");

-- CreateIndex
CREATE INDEX "idx_note_author" ON "Note"("authorId");

-- CreateIndex
CREATE INDEX "idx_note_created" ON "Note"("createdAt");

-- CreateIndex
CREATE INDEX "idx_note_updated" ON "Note"("updatedAt");

-- CreateIndex
CREATE INDEX "idx_note_pinned" ON "Note"("pinned");

-- CreateIndex
CREATE INDEX "idx_note_search" ON "Note"("search");

-- CreateIndex
CREATE INDEX "idx_label_created" ON "Label"("createdAt");

-- CreateIndex
CREATE INDEX "idx_label_updated" ON "Label"("updatedAt");

-- CreateIndex
CREATE INDEX "idx_label_name" ON "Label"("name");

-- CreateIndex
CREATE INDEX "idx_label_slug" ON "Label"("slug");

-- CreateIndex
CREATE INDEX "idx_note_label_noteId" ON "NoteLabel"("noteId");

-- CreateIndex
CREATE INDEX "idx_note_label_labelId" ON "NoteLabel"("labelId");

-- CreateIndex
CREATE UNIQUE INDEX "unq_note_label" ON "NoteLabel"("noteId", "labelId");
