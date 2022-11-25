import { listHotels, listRooms } from "@/controllers";
import { Router } from "express";

const hotelsRouter = Router();

hotelsRouter
  .get("/", listHotels)
  .get("/:hotelId", listRooms);

export { hotelsRouter };
