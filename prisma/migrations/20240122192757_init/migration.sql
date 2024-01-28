-- CreateTable
CREATE TABLE "Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'string'
);

-- CreateTable
CREATE TABLE "UserSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'string',
    CONSTRAINT "UserSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "idx_setting_type" ON "Setting"("type");

-- CreateIndex
CREATE UNIQUE INDEX "unq_setting_name" ON "Setting"("name");

-- CreateIndex
CREATE INDEX "idx_user_setting_user" ON "UserSetting"("userId");

-- CreateIndex
CREATE INDEX "idx_user_setting_name" ON "UserSetting"("name");

-- CreateIndex
CREATE INDEX "idx_user_setting_type" ON "UserSetting"("type");

-- CreateIndex
CREATE UNIQUE INDEX "unq_user_setting_name" ON "UserSetting"("userId", "name");
