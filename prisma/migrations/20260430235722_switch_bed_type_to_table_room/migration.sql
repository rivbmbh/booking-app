/*
  Warnings:

  - You are about to drop the column `bedType` on the `RoomType` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BedType" ADD VALUE 'SINGLE';
ALTER TYPE "BedType" ADD VALUE 'SUPER_KING';

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "bedType" "BedType" NOT NULL DEFAULT 'KING';

-- AlterTable
ALTER TABLE "RoomType" DROP COLUMN "bedType";
