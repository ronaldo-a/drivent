import { AuthenticatedRequest } from "@/middlewares";
import bookingsService from "@/services/bookings-service";
import { Response } from "express";
import httpStatus from "http-status";

async function listBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingsService.getBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  try {
    const bookingId = await bookingsService.insertBooking(userId, roomId);
    return res.status(httpStatus.OK).send(bookingId); 
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(403);
    }
  }
}

export {
  listBooking,
  postBooking
};
