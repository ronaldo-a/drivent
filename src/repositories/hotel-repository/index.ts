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

const hotelRepository = {
  searchHotels,
  searchHotelById,
  searchRooms
};

export default hotelRepository;
