import { listBooking, postBooking, updateBooking } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import Router from "express";

const bookingsRouter = Router();

bookingsRouter.all("/*", authenticateToken);
bookingsRouter.get("/", listBooking);
bookingsRouter.post("/", postBooking);
bookingsRouter.put("/:bookingId", updateBooking); 

export { bookingsRouter };
