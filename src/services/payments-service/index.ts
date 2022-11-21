import { notFoundError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import getPayment from "@/repositories/payment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function searchPayment(ticketId: number, userId: number) {
  const ticket = (await ticketRepository.getTicketById(ticketId));
  if (!ticket) {
    throw notFoundError();
  }
  const ticketEnrollmentId = ticket.enrollmentId;
  
  const userEnrollmentId = (await enrollmentRepository.findWithAddressByUserId(userId)).id;
  if (ticketEnrollmentId !== userEnrollmentId) {
    throw unauthorizedError();
  }
  
  return await getPayment(ticketId);
}

export { searchPayment };
