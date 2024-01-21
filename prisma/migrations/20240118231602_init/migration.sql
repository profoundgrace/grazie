-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CategoryPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "catId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "CategoryPost_catId_fkey" FOREIGN KEY ("catId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CategoryPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CategoryPost" ("catId", "id", "postId") SELECT "catId", "id", "postId" FROM "CategoryPost";
DROP TABLE "CategoryPost";
ALTER TABLE "new_CategoryPost" RENAME TO "CategoryPost";
CREATE INDEX "idx_category_post_cat" ON "CategoryPost"("catId");
CREATE INDEX "idx_category_post" ON "CategoryPost"("postId");
CREATE UNIQUE INDEX "unq_category_post" ON "CategoryPost"("catId", "postId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
