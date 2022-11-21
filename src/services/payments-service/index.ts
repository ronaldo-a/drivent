import { notFoundError, unauthorizedError } from "@/errors";
import { NewPayment } from "@/protocols";
import enrollmentRepository from "@/repositories/enrollment-repository";
import paymentRepository from "@/repositories/payment-repository";
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
  
  return await  paymentRepository.getPayment(ticketId);
}

async function postPayment(userId: number, newPayment: NewPayment) {
  const ticketId = newPayment.ticketId;
  const ticket = await ticketRepository.getTicketById(ticketId);
  if (!ticket) {
    throw notFoundError();
  }

  const ticketEnrollmentId = ticket.enrollmentId;
  const userEnrollmentId = (await enrollmentRepository.findWithAddressByUserId(userId)).id;
  if (ticketEnrollmentId !== userEnrollmentId) {
    throw unauthorizedError();
  }

  const ticketTypeId = ticket.ticketTypeId;
  const ticketType = await ticketRepository.getTypeById(ticketTypeId);

  const payment = {
    ticketId: ticketId,
    value: ticketType.price,
    cardIssuer: newPayment.cardData.issuer, // VISA | MASTERCARD
    cardLastDigits: newPayment.cardData.number.toString().slice(-4),
  };
  
  await paymentRepository.insertPayment(payment);
  await ticketRepository.updateTicket(ticketId);
  const addedPayment = paymentRepository.getPayment(ticketId); 
  return addedPayment;
}

export { searchPayment, postPayment };
