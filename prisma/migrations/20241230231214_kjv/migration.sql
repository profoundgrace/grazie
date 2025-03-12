-- CreateTable
CREATE TABLE "KJVBook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chs" INTEGER NOT NULL,
    "book" TEXT NOT NULL,
    "abbr" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "KJVVerse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bid" INTEGER NOT NULL,
    "ch" INTEGER NOT NULL,
    "ver" INTEGER NOT NULL,
    "txt" TEXT NOT NULL,
    "coding" TEXT NOT NULL,
    CONSTRAINT "KJVVerse_bid_fkey" FOREIGN KEY ("bid") REFERENCES "KJVBook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "unq_kjv_abbr" ON "KJVBook"("abbr");

-- CreateIndex
CREATE UNIQUE INDEX "unq_kjv_book" ON "KJVBook"("book");

-- CreateIndex
CREATE UNIQUE INDEX "unq_kjv_slug" ON "KJVBook"("slug");

-- CreateIndex
CREATE INDEX "idx_kjv_verse_book" ON "KJVVerse"("bid");

-- CreateIndex
CREATE INDEX "idx_kjv_verse_chapter" ON "KJVVerse"("ch");

-- CreateIndex
CREATE INDEX "idx_kjv_verse_book_chapter" ON "KJVVerse"("bid", "ch");

-- CreateIndex
CREATE INDEX "idx_kjv_verse_text" ON "KJVVerse"("txt");

-- CreateIndex
CREATE INDEX "idx_kjv_verse_coding" ON "KJVVerse"("coding");
