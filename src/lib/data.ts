import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RoomProps } from "@/types/room";
import { BedType, BookingStatus, UserRole } from "@prisma/client";


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

export const getRooms = async (
  sortBy: string = "updatedAt",
  sortOrder: string = "desc",
  search: string = "",
  floor: string = "all",
  roomTypeId: string = "all"
): Promise<RoomProps[]> => {
  try {
    const validSortFields = ["updatedAt", "roomNumber", "floor", "status"];
    const field = validSortFields.includes(sortBy) ? sortBy : "updatedAt";
    const order = sortOrder === "asc" ? "asc" : "desc";

    const result = await prisma.room.findMany({
      orderBy: { [field]: order },
      where: {
        ...(search && {
          roomNumber: { contains: search }
        }),
        ...(floor !== "all" && {
          floor: parseInt(floor)
        }),
        ...(roomTypeId !== "all" && {
          roomTypeId
        }),
      },
      include: { RoomType: true },
    });
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getRoomById = async (roomId: string) => {
  try {
    const result = await prisma.room.findUnique({
      where: {id: roomId},
      include: {
        RoomType: { select: {id: true, name: true}}
      }
    })
    return result
  } catch (error) {
    console.info(error);
  }
}


export const getAvailableRooms = async (startDate: Date, endDate: Date) => {
  try {
    const availableRooms = await prisma.room.findMany({
      where: {
        Reservations: {
          none: {
            status: {
              in: ["PENDING", "CONFIRMED"]
            },
            expiresAt: {
              gt: new Date()
            },
            AND: [
              {
                startDate: {
                  lte: endDate
                }
              },
              {
                endDate: {
                  gte: startDate
                }
              }
            ]
          },
        }
      }
    });
  return availableRooms
  } catch (error) {
    console.info(error)
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
          select: { 
            id: true,
            status: true
          },
        }
      }
    });
    return result;
  } catch (error) {
    console.info(error);
  }
};

export const getRoomAmenities = async () => {
  try {
    const result = await prisma.amenities.findMany({
      orderBy: { createdAt: "desc"},
      select:{
        id: true,
        name: true,
        createdAt: true
      }
    })
    return result
  } catch (error) {
    console.log(error)
  }
}

export const getRoomTypeOptions = async () => {
  try {
    const result = await prisma.roomType.findMany({
      select:{
        id: true,
        name: true,
        bedType: true,
      }
    })
    return result
  } catch (error) {
    console.info(error);
  }
};

export const getBedType = async () => {
  return Object.values(BedType);
};

// export const getRoomBedTypes = async () => {
//   try {
//     const rooms = await prisma.room.findMany({
//       select: {
//         roomNumber: true,
//         RoomType: {
//           select: {
//             bedType: true,
//           }
//         }
//       },
//     });
//     return rooms.reduce((acc, room) => {
//     acc[room.roomNumber] = room.RoomType.bedType.toLowerCase();
//     return acc;
//   }, {} as Record<string, string>);
//   } catch (error) {
//     console.info(error);
//   }
// }

export const getRoomTypeById = async (roomId: string) => {
  try {
    const result = await prisma.roomType.findUnique({
      where: { id: roomId },
      include: { 
        RoomAmenities: { 
          select: { 
            amenitiesId: true, 
            Amenities: {
              select: { id:true, name: true }
            }
          } 

        } 
      },
    });
    return result;
  } catch (error) {
    console.info(error);
    // return null
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

export const getBookingById = async (bookingId: string) => {
  if (!bookingId) {
    throw new Error("ID undefined");
  }

  try {
    const result = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        Reservations: {
          where: {
            status: BookingStatus.PENDING // ← hanya tampilkan reservation yang aktif
          },
          include: {
            Room: {
              include: {
                RoomType: {
                  select: {
                    name: true,
                    price: true,
                    image: true,
                  },
                },
              },
            },
          },
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

export const getBookingDetailById = async (bookingId: string) => {
  try {
    const result = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        User: true,
        Payment: true,
        Reservations: {
          include: {
            Room: {
              include: {
                RoomType: true
              }
            }
          }
        }
      }
    });
    return result;
  } catch (error) {
    console.info(error);
  }
}

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
        Booking: {
          select:{
            User: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
            Payment: true,
          }
        }
      },
    });
    return result;
  } catch (error) {
    console.info(error);
  }
};

export const getDisabledRoomTypeById = async (roomId: string) => {
  try {
    const result = await prisma.booking.findMany({
      select: {
        Reservations: {
          select: {
            startDate: true,
            endDate: true,
          },
          where: {
            roomId: roomId,
          },
        },
      },
      where: {
        Payment: { status: { not: "failed" } },
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
    const result = await prisma.booking.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        Reservations: {
          // createdAt: true,
          include: {
            Room:{
              include: {
                RoomType:true
              }
            }
          }
        },
        User:{
          select: {
            name: true,
            phone: true,
            email: true
          }
        },
        Payment: true
      },
      orderBy: {createdAt: "desc"}
    });
    return result;
  } catch (error) {
    console.info(error);
    throw new Error("Failed to fetch reservations");
  }
};

export const getRevenueAndReserve = async () => {
  try {
    const result = await prisma.booking.aggregate({
      _count: true,
      _sum: { totalPrice: true },
      where: {
        Payment: {
          status: { not: "failed" },
        },
      },
    });
    return {
      revenue: result._sum.totalPrice || 0,
      reserve: result._count,
    };
  } catch (error) {
    console.info(error);
  }
};

export const getTotalCustomers = async () => {
  try {
    const result = await prisma.booking.findMany({
      distinct: ["userId"],
      where: {
        Payment: {
          status: { not: "failed" },
        },
      },
      select: { userId: true },
    });
    return result.length; // jumlah customer unik
  } catch (error) {
    console.info(error);
  }
};

export const getReservation = async (
  sortBy: string = "createdAt",
  sortOrder: string = "desc",
  search: string = "",
  floor: string = "all",
  roomTypeId: string = "all"
) => {
  const session = await auth();
  if (
    !session ||
    !session.user ||
    !session.user.id ||
    session.user.role !== UserRole.admin
  ) {
    throw new Error("Unauthorized Access");
  }

  try {
    const validSortFields = ["createdAt", "updatedAt", "startDate", "endDate", "status"];
    const field = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const order = sortOrder === "asc" ? "asc" : "desc";

    const result = await prisma.reservation.findMany({
      orderBy: { [field]: order },
      where: {
        ...((floor !== "all" || roomTypeId !== "all") && {
          Room: {
            ...(floor !== "all" && { floor: parseInt(floor) }),
            ...(roomTypeId !== "all" && { roomTypeId: roomTypeId }),
          },
        }),
        ...(search && {
          OR: [
            { guestName: { contains: search, mode: "insensitive" } },
            { Room: { roomNumber: { contains: search, mode: "insensitive" } } },
            { Room: { RoomType: { name: { contains: search, mode: "insensitive" } } } },
            { Booking: { User: { name: { contains: search, mode: "insensitive" } } } },
          ],
        }),
      },
      include: {
        Room: {
          include: {
            RoomType: {
              select: { name: true, image: true, price: true },
            },
          },
        },
        Booking: {
          include: {
            User: { select: { name: true, email: true, phone: true } },
            Payment: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
};
