import { prisma } from "@/config";

async function getTypes() {
  return prisma.ticketType.findMany();
}

async function getTypeById(id: number) {
  return prisma.ticketType.findFirst({
    where: { id }
  });
}

async function getTicket(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId }
  });
}

async function getTicketById(id: number) {
  return prisma.ticket.findFirst({
    where: { id }
  });
}

async function insertTicket(enrollmentId: number, ticketTypeId: number) {
  return prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status: "RESERVED"
    }
  });
}

async function updateTicket(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId
    },
    data: {
      status: "PAID"
    }
  });
}

const ticketRepository = {
  getTypes,
  getTypeById,
  getTicket,
  getTicketById,
  insertTicket,
  updateTicket
};

export default ticketRepository;
