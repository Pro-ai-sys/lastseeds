-- AlterTable
ALTER TABLE "User" ADD COLUMN     "mollieAccessToken" TEXT,
ADD COLUMN     "mollieOnboarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mollieOrganizationId" TEXT,
ADD COLUMN     "mollieRefreshToken" TEXT;
