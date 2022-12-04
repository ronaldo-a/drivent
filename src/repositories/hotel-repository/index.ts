import { prisma } from "@/config";

async function searchHotels() {
  return prisma.hotel.findMany();
}

async function searchHotelById(hotelId: number) {
  return prisma.hotel.findFirst({
    where: { id: hotelId }
  });
}

async function searchRooms(hotelId: number) {
  return prisma.room.findMany({
    where: { hotelId }
  });
}

async function searchRoomById(roomId: number) {
  return prisma.room.findFirst({
    where: { id: roomId }
  });
}

const hotelRepository = {
  searchHotels,
  searchHotelById,
  searchRooms,
  searchRoomById
};

export default hotelRepository;
