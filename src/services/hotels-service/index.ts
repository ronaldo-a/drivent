import { notFoundError, unauthorizedError } from "@/errors";
import { RoomReturn } from "@/protocols";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getHotels(userId: number) {
  const enrollmentId = (await enrollmentRepository.findWithAddressByUserId(userId)).id;
  const ticketId = await ticketRepository.getTicket(enrollmentId);
  const ticketTypeId = ticketId.ticketTypeId;
  const doesIncludesHotel = (await ticketRepository.getTypeById(ticketTypeId)).includesHotel;
  const ticketPaymentStatus = ticketId.status;

  if (!doesIncludesHotel || ticketPaymentStatus !== "PAID") {
    throw unauthorizedError();
  }

  const hotels = await hotelRepository.searchHotels();
  return hotels;
}

async function getRooms(hotelId: number) {
  const rooms = await hotelRepository.searchRooms(hotelId);
  if (!rooms) {
    throw notFoundError();
  }

  const hotelEntity = await hotelRepository.searchHotelById(hotelId);

  const roomsReturn: RoomReturn[] = rooms.map(room => (
    { ...room, hotel: { name: hotelEntity.name, image: hotelEntity.image } }
  ));

  return roomsReturn;
}

const hotelsService = {
  getHotels,
  getRooms
};

export default hotelsService;
