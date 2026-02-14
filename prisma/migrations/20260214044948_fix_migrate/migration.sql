-- CreateEnum
CREATE TYPE "BedType" AS ENUM ('KING', 'QUEEN', 'TWIN', 'DOUBLE');

-- AlterTable
ALTER TABLE "RoomType" ADD COLUMN     "bedType" "BedType" NOT NULL DEFAULT 'KING';
