import { prisma } from "@/config";

async function getPayment(ticketId: number) {
  return prisma.payment.findFirst({
    where: { ticketId }
  });
}

export default getPayment;
