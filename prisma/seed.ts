import { PrismaClient, RoomStatus } from "@prisma/client";

const prisma = new PrismaClient();

const roomType = async (type: string) => {
  try {
    const result = await prisma.roomType.findFirst({
      where: {
        name: type
      },
    })
    // console.info(result)
    return result
  } catch (error) {
    console.info(error);
  }
}



async function main() {
  const TWIN = await roomType("Deluxe Twin")
  const KING = await roomType("Deluxe Room")

  if (!TWIN || !KING) {
    throw new Error("Room type tidak ditemukan");
  }
  const twinRooms = [
    "203","205","209","212","213","216","217",
    "229","225","224","222","221",
    "239","236","242"
  ];

  const rooms = [];

  for (let i = 201; i <= 250; i++) {
    const roomNumber = i.toString();

    const isTwin = twinRooms.includes(roomNumber);

    rooms.push({
      roomNumber,
      floor: 2,
      status: RoomStatus.ACTIVE,
      roomTypeId: isTwin ? TWIN.id : KING.id 
    });
  }

  // insert ke database
  await prisma.room.createMany({
    data: rooms,
    skipDuplicates: true
  });

  console.log("✅ 50 kamar berhasil di-seed!");
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