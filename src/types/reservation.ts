import { Prisma } from "@prisma/client";

export type reservationProps = Prisma.ReservationGetPayload<{
  include: {
    Room: {
      RoomType: {
        select: {
          name: true;
          image: true;
          price: true;
      };
      }
    },
    Booking: {
      select: {
        User: {
          select: {
            name: true;
            email: true;
            phone: true;
          };
        };
        Payment: true;
      }
    }
  };
}>;
