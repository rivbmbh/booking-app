import { PrismaClient, RoomStatus } from "@prisma/client";

const prisma = new PrismaClient();

const roomType = async (type: string) => {
  try {
    const result = await prisma.roomType.findFirst({
      where: { name: type },
    });
    return result;
  } catch (error) {
    console.error(error);
  }
};

async function main() {
  const standard = await roomType("Standard Room");
  const deluxeDouble = await roomType("Deluxe Double");
  const deluxeKing = await roomType("Deluxe King");

  if (!standard || !deluxeKing || !deluxeDouble) {
    throw new Error("Room type tidak ditemukan");
  }

  const standardRooms = ["203", "212", "216", "217", "229", "224", "221", "239"];
  const deluxeDoubleRooms = ["205", "209", "213", "225", "222", "236", "242"];

  const rooms = [];

  for (let i = 201; i <= 250; i++) {
    const roomNumber = i.toString();
    const isStandard = standardRooms.includes(roomNumber);
    const isDouble = deluxeDoubleRooms.includes(roomNumber);

    // Tentukan roomTypeId berdasarkan kategori kamar
    let roomTypeId: string;
    if (isStandard) {
      roomTypeId = standard.id;
    } else if (isDouble) {
      roomTypeId = deluxeDouble.id;
    } else {
      roomTypeId = deluxeKing.id; // default: Deluxe King
    }

    rooms.push({
      roomNumber,
      floor: 2,
      status: RoomStatus.ACTIVE,
      roomTypeId,
    });
  }

  // Batch insert ke database
  const result = await prisma.room.createMany({
    data: rooms,
    skipDuplicates: true,
  });

  console.log(`✅ ${result.count} kamar berhasil di-seed!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });