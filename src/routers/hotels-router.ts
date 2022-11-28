import { listHotels, listRooms } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", listHotels)
  .get("/:hotelId", listRooms);

export { hotelsRouter };
