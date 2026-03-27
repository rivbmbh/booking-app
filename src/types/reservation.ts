import { Prisma } from "@prisma/client";

export type reservationProps = Prisma.ReservationGetPayload<{
  include: {
    Room: {
      include: {
        RoomType: {
          select: {
            name: true;
            image: true;
            price: true;
            bedType: true;
        };
        }
      }
    },
  };
}>;
