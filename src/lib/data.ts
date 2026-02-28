import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RoomProps } from "@/types/room";
import { BedType } from "@prisma/client";


export const getAmenities = async () => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized Access");
  }
  try {
    const result = await prisma.amenities.findMany();
    return result;
  } catch (error) {
    console.info(error);
  }
};

export const getRooms = async () : Promise<RoomProps[]> => {
  try {
    const result = await prisma.room.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        RoomType: true,
      }
    });
    return result;
  } catch (error) {
    console.info(error);
    return [];
  }
};

export const getRoomById = async (roomId: string) => {
  try {
    const result = await prisma.room.findUnique({
      where: {id: roomId},
      include: {
        RoomType: { select: {name: true}}
      }
    })
    return result
  } catch (error) {
    console.info(error);
  }
}

export const getRoomType = async () => {
  try {
    const result = await prisma.roomType.findMany({
      orderBy: { createdAt: "desc" },
      include:{
        RoomAmenities: {
          include: {
            Amenities: {  select: { name: true } },
          },
        },
        rooms: {
          select: { id: true },
        }
      }
    });
    return result;
  } catch (error) {
    console.info(error);
  }
};

export const getBedType = async () => {
  return Object.values(BedType);
};

export const getRoomTypeById = async (roomId: string) => {
  try {
    const result = await prisma.roomType.findUnique({
      where: { id: roomId },
      include: { RoomAmenities: { select: { amenitiesId: true } } },
    });
    return result;
  } catch (error) {
    console.info(error);
  }
};

export const getRoomDetailById = async (roomId: string) => {
  try {
    const result = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        RoomType: {
          include: {
            RoomAmenities: {
              include: {
                Amenities: { select: { name: true } },
              },
            },
          },
        },
      },
    });
    return result;
  } catch (error) {
    console.info(error);
  }
};

export const getRoomTypeDetailById = async (roomId: string) => {
  try {
    const result = await prisma.roomType.findUnique({
      where: { id: roomId },
      include: {
        RoomAmenities: {
          include: {
            Amenities: { select: { name: true } },
          },
        },
      },
    });
    return result;
  } catch (error) {
    console.info(error);
  }
};

export const getReservationById = async (id: string) => {
  try {
    const result = await prisma.reservation.findUnique({
      where: { id },
      include: {
        Room: {
          include:{
            RoomType:{
              select: {
                name: true,
                image: true,
                price: true,
              },
            }
          }
        },
        User: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        Payment: true,
      },
    });
    return result;
  } catch (error) {
    console.info(error);
  }
};

export const getDisabledRoomById = async (roomId: string) => {
  try {
    const result = await prisma.reservation.findMany({
      select: {
        startDate: true,
        endDate: true,
      },
      where: {
        roomId: roomId,
        Payment: { status: { not: "failure" } },
      },
    });
    return result;
  } catch (error) {
    console.info(error);
  }
};

export const getReservationByUserId = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized Access");
  }

  try {
    const result = await prisma.reservation.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        Room: {
          include:{
            RoomType: {
              select: {
                name: true,
                image: true,
                price: true,
              },
            }
          }
        },
        User: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        Payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return result;
  } catch (error) {
    console.info(error);
  }
};

export const getRevenueAndReserve = async () => {
  try {
    const result = await prisma.reservation.aggregate({
      _count: true,
      _sum: { price: true },
      where: { Payment: { status: { not: "failure" } } },
    });
    return {
      revenue: result._sum.price || 0,
      reserve: result._count,
    };
  } catch (error) {
    console.info(error);
  }
};

export const getTotalCustomers = async () => {
  try {
    const result = await prisma.reservation.findMany({
      distinct: ["userId"],
      where: { Payment: { status: { not: "failure" } } },
      select: { userId: true },
    });
    console.info(result);
    return result;
  } catch (error) {
    console.info(error);
  }
};

export const getReservation = async () => {
  const session = await auth();
  if (
    !session ||
    !session.user ||
    !session.user.id ||
    session.user.role !== "admin"
  ) {
    throw new Error("Untauthorized Access");
  }

  try {
    const result = await prisma.reservation.findMany({
      include: {
        Room: {
         include: {
          RoomType:{
            select: {
            name: true,
            image: true,
            price: true,
          },
          }
         }
        },
        User: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        Payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return result;
  } catch (error) {
    console.info(error);
  }
};
