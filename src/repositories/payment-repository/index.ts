import { prisma } from "@/config";
import { Payment } from "@/protocols";

async function getPayment(ticketId: number) {
  return prisma.payment.findFirst({
    where: { ticketId }
  });
}

async function insertPayment(payment: Payment) {
  return prisma.payment.create({
    data: payment
  });
}

const paymentRepository = {
  getPayment, 
  insertPayment
};

export default paymentRepository;
