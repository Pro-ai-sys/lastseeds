-- CreateTable
CREATE TABLE "MotherPlant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "yearAcquired" INTEGER NOT NULL,
    "description" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MotherPlant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MotherPlant" ADD CONSTRAINT "MotherPlant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MotherPlant" ADD CONSTRAINT "MotherPlant_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "SeedSpecies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
