import { AuthenticatedRequest } from "@/middlewares";
import { getTicket, getTicketTypes, insertTicket } from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

async function listTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const types = await getTicketTypes();
    return res.status(httpStatus.OK).send(types);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

async function listTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const ticket = await getTicket(userId);
    if (!ticket) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

async function postTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body;
  const { userId } = req;

  try {
    await insertTicket(userId, ticketTypeId); 
    const ticket = await getTicket(userId);
    res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export { listTicketTypes, listTicket, postTicket };
