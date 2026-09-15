-- CreateTable
CREATE TABLE "WantedListing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WantedListing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WantedListing" ADD CONSTRAINT "WantedListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WantedListing" ADD CONSTRAINT "WantedListing_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "SeedSpecies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
