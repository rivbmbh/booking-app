import { Prisma } from "@prisma/client";

export type bookingProps = Prisma.BookingGetPayload<{
    include: {
      Reservations: {
        include: {
          Room: {
            include: {
              RoomType: {
                select: {
                  name: true,
                  price: true,
                  image: true
                }
              }
            }
          }
        }
      },
      User: {
        select: {
          name: true,
          email: true,
          phone: true
        }
      },
      Payment: true
    }
}>;