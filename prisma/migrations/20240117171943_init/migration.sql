-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parentId" INTEGER,
    "postsCount" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CategoryPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "catId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "CategoryPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CategoryPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "idx_category_parent" ON "Category"("parentId");

-- CreateIndex
CREATE INDEX "idx_category_posts" ON "Category"("postsCount");

-- CreateIndex
CREATE INDEX "idx_category_description" ON "Category"("description");

-- CreateIndex
CREATE UNIQUE INDEX "unq_category_name" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "unq_category_slug" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "unq_category_path" ON "Category"("path");

-- CreateIndex
CREATE INDEX "idx_category_post_cat" ON "CategoryPost"("catId");

-- CreateIndex
CREATE INDEX "idx_category_post" ON "CategoryPost"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "unq_category_post" ON "CategoryPost"("catId", "postId");
