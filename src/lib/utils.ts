import { prisma } from "./prisma";

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  });
  return formatter.format(date);
};

export const getCountdown = (targetDateStr: string) => {
  const now = new Date().getTime();
  const target = new Date(targetDateStr).getTime();

  const diff = target - now;

  if (diff <= 0) {
    return "00:00:00";
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = (num: number) => num.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const formatCurrency = (amount: number) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumSignificantDigits: 3,
  });
  return formatter.format(amount);
};

export const isRoomNumberExists = async (
  roomNumber: string,
  excludeRoomId?: string
) => {
  const room = await prisma.room.findFirst({
    where: {
      roomNumber,
      ...(excludeRoomId && {
        NOT: { id: excludeRoomId }
      })
    }
  });

  return !!room;
};