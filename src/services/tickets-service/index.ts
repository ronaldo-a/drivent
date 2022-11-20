import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";

async function getTicketTypes() {
  const ticketTypes = await ticketRepository.getTypes();
  return ticketTypes;
}

async function getTicket(userId: number) {
  const enrollmentId = (await enrollmentRepository.findWithAddressByUserId(userId)).id;
  const ticketEntity = await ticketRepository.getTicket(enrollmentId);
  if (!enrollmentId || !ticketEntity) {
    throw notFoundError();
  }
  const ticketType = await ticketRepository.getTypeById(ticketEntity.ticketTypeId);

  const ticket = { ...ticketEntity, TicketType: ticketType };
  return ticket;
}

async function insertTicket(userId: number, ticketTypeId: number) {
  const enrollmentId = (await enrollmentRepository.findWithAddressByUserId(userId)).id;
  if (!enrollmentId) {
    throw notFoundError();
  }
  await ticketRepository.insertTicket(enrollmentId, ticketTypeId);
}

export { getTicketTypes, getTicket, insertTicket };
