import { notFoundError, unauthorizedError } from "@/errors";
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

async function getRooms(userId: number, hotelId: number) {
  const enrollmentId = (await enrollmentRepository.findWithAddressByUserId(userId)).id;
  const ticketId = await ticketRepository.getTicket(enrollmentId);
  const ticketTypeId = ticketId.ticketTypeId;
  const doesIncludesHotel = (await ticketRepository.getTypeById(ticketTypeId)).includesHotel;
  const ticketPaymentStatus = ticketId.status;
  if (!doesIncludesHotel || ticketPaymentStatus !== "PAID") {
    throw unauthorizedError();
  }
  
  const hotelEntity = await hotelRepository.searchHotelById(hotelId);

  const rooms = await hotelRepository.searchRooms(hotelId);
  if (!rooms) {
    throw notFoundError();
  }

  const roomsReturn = { ...hotelEntity, Rooms: rooms };

  return roomsReturn;
}

const hotelsService = {
  getHotels,
  getRooms
};

export default hotelsService;
