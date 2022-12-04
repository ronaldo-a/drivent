import { notFoundError, unauthorizedError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getBooking(userId: number) {
  const booking = await bookingRepository.searchBooking(userId);
  if (!booking) {
    throw notFoundError();
  }

  const room = await hotelRepository.searchRoomById(booking.roomId);

  return { id: booking.id, Room: room };
}

async function insertBooking(userId: number, roomId: number) {
  const enrollmentId = (await enrollmentRepository.findWithAddressByUserId(userId)).id;
  const ticket = await ticketRepository.getTicket(enrollmentId);
  const ticketType = await ticketRepository.getTypeById(ticket.ticketTypeId);
  if (ticket.status !== "PAID" || ticketType.isRemote !== false || ticketType.includesHotel !== true) {
    throw unauthorizedError();
  }

  const roomCapacity = (await hotelRepository.searchRoomById(roomId)).capacity;
  const roomBookingsNumber = (await bookingRepository.searchBookingsByRoomId(roomId)).length;
  if (roomBookingsNumber === roomCapacity) {
    throw unauthorizedError();
  }

  const bookingId = await bookingRepository.createBooking(userId, roomId);
  return bookingId.id;
}

const bookingsService = {
  getBooking,
  insertBooking
};

export default bookingsService;
