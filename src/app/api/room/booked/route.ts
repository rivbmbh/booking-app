import { prisma } from "@/lib/prisma";
import { RoomStatus } from "@prisma/client";

export async function POST(req: Request) {
  const { start, end } = await req.json();

  const rooms = await prisma.room.findMany({
    where: {
      OR: [
        {
          status: RoomStatus.INACTIVE
        },
        {
          status: RoomStatus.ACTIVE,
          Reservations: {
          some: {
            status: {
              in: ["PENDING", "CONFIRMED"]
            },
            AND: [
              {
                startDate: {
                  lte: new Date(end)
                }
              },
              {
                endDate: {
                  gte: new Date(start)
                }
              }
            ]
          }
        }
        }
      ]
    }
  });

  return Response.json(
    rooms.map((room) => room.roomNumber)
  );
}