-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarType" TEXT DEFAULT 'preset1',
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "houseNumber" TEXT,
ADD COLUMN     "houseNumberAddition" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "street" TEXT;
