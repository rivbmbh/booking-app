import { Prisma } from "@prisma/client";

export type RoomProps = Prisma.RoomGetPayload<{
  include: { RoomAmenities: { select: { amenitiesId: true } } };
}>;
export type RoomDetailProps = Prisma.RoomGetPayload<{
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
