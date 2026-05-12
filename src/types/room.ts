import { Prisma } from "@prisma/client";

export type RoomTypeProps = Prisma.RoomTypeGetPayload<{
  include: { RoomAmenities: { select: { amenitiesId: true, Amenities: { select: { id:true, name: true } } } } };
}>;

export type RoomWithDetailsProps = Prisma.RoomGetPayload<{
  include: {
    RoomType: {
      select: {
        image: true;
        name: true;
        price: true;
        bedType: true;
        description: true;
        RoomAmenities: {
          select: {
            Amenities: {
              select: {
                name: true;
              };
            };
          };
        };
      };
    };
    Reservations: {
      select: {
        price: true;
      };
    };
  };
}>;

export type RoomTypeOptionsProps = Prisma.RoomTypeGetPayload<{
  select: { 
    id: true, 
    name: true, 
    bedType: true
  }
}>;


export type RoomProps = Prisma.RoomGetPayload<{
  include: { RoomType: { select: { id: true,name: true } } };
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

export type RoomDetailProps = Prisma.RoomGetPayload<{
  include: {
    RoomType: {
      include: {
        RoomAmenities: {
          select: { amenitiesId: true, Amenities: { select: { name: true } } };
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
  SUPER_KING = "SUPER_KING",
  SINGLE = "SINGLE"
}

export type DisabledDateProps = Prisma.ReservationGetPayload<{
  select: {
    startDate: true;
    endDate: true;
  };
}>;
