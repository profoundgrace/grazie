-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RoleUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "roleId" INTEGER NOT NULL,
    "userId" INTEGER,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    CONSTRAINT "RoleUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RoleUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_RoleUser" ("active", "createdAt", "id", "roleId", "updatedAt", "userId") SELECT "active", "createdAt", "id", "roleId", "updatedAt", "userId" FROM "RoleUser";
DROP TABLE "RoleUser";
ALTER TABLE "new_RoleUser" RENAME TO "RoleUser";
CREATE INDEX "idx_user_role_active" ON "RoleUser"("active");
CREATE INDEX "idx_user_role_user" ON "RoleUser"("userId");
CREATE INDEX "idx_user_role_created" ON "RoleUser"("createdAt");
CREATE INDEX "idx_user_role_updated" ON "RoleUser"("updatedAt");
CREATE UNIQUE INDEX "unq_user_role" ON "RoleUser"("roleId", "userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
