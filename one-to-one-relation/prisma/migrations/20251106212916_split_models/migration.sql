-- CreateTable
CREATE TABLE "UserWithBio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Bio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserWithBio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bio" ("id", "text", "userId") SELECT "id", "text", "userId" FROM "Bio";
DROP TABLE "Bio";
ALTER TABLE "new_Bio" RENAME TO "Bio";
CREATE UNIQUE INDEX "Bio_userId_key" ON "Bio"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
