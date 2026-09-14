/*
  Warnings:

  - You are about to drop the column `categoryId` on the `SeedListing` table. All the data in the column will be lost.
  - Added the required column `speciesId` to the `SeedListing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "SeedSpecies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "latinName" TEXT,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "SeedSpecies_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "SeedCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SeedListing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "isHeirloom" BOOLEAN NOT NULL DEFAULT true,
    "listingType" TEXT NOT NULL DEFAULT 'sale',
    "price" REAL,
    "originCountry" TEXT,
    "plantingMonth" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    CONSTRAINT "SeedListing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SeedListing_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "SeedSpecies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SeedListing" ("createdAt", "description", "id", "isHeirloom", "listingType", "ownerId", "price", "quantity", "status", "title", "updatedAt") SELECT "createdAt", "description", "id", "isHeirloom", "listingType", "ownerId", "price", "quantity", "status", "title", "updatedAt" FROM "SeedListing";
DROP TABLE "SeedListing";
ALTER TABLE "new_SeedListing" RENAME TO "SeedListing";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SeedSpecies_name_categoryId_key" ON "SeedSpecies"("name", "categoryId");
