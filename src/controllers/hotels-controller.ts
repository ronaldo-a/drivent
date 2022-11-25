import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

async function listHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotels = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

async function listRooms(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params.hotelId);

  try {
    const rooms = await hotelsService.getRooms(hotelId);
    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export { 
  listHotels,
  listRooms
};
