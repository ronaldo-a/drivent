import { prisma } from "@/config";

async function searchBooking(userId: number) {
  return await prisma.booking.findFirst({
    where: { userId }
  });
}

async function searchBookingsByRoomId(roomId: number) {
  return await prisma.booking.findMany({
    where: { roomId }
  });
}

async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId
    }
  });
}

async function putBooking(bookingId: number, roomId: number) {
  return await prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      roomId
    }
  });
}

const bookingRepository = {
  searchBooking,
  searchBookingsByRoomId,
  createBooking,
  putBooking
};

export default bookingRepository;
