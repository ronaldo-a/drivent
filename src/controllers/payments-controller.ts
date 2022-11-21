import { AuthenticatedRequest } from "@/middlewares";
import { postPayment, searchPayment } from "@/services";
import { Response } from "express";
import httpStatus from "http-status";

async function listPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticketId = Number(req.query.ticketId);
  if (!ticketId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const payment = await searchPayment(ticketId, userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}

async function addPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const newPayment = req.body;
  
  try {
    const addedPayment = await postPayment(userId, newPayment);
    return res.status(httpStatus.OK).send(addedPayment);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}

export { listPayment, addPayment };
