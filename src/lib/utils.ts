import { prisma } from "./prisma";

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  });
  return formatter.format(date);
};

export const formatCurrency = (amount: number) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumSignificantDigits: 3,
  });
  return formatter.format(amount);
};

export async function isRoomNumberExists(roomNumber: string) {
  const room = await prisma.room.findUnique({
    where: {
      roomNumber
    },
  });
  return !!room;
}