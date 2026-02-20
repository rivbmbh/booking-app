import { Prisma } from "@prisma/client";

export type RoomTypeProps = Prisma.RoomTypeGetPayload<{
  include: { RoomAmenities: { select: { amenitiesId: true, Amenities: { select: { name: true } } } } };
}>;
export type RoomTypeDetailProps = Prisma.RoomTypeGetPayload<{
  include: {
    RoomAmenities: {
      include: {
        Amenities: {
          select: { name: true };
        };
      };
    };
  };
}>;

export enum BedType {
  KING = "KING",
  QUEEN = "QUEEN",
  TWIN = "TWIN",
  DOUBLE = "DOUBLE",
}

export type DisabledDateProps = Prisma.ReservationGetPayload<{
  select: {
    startDate: true;
    endDate: true;
  };
}>;
