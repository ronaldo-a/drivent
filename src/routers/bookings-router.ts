import { listBooking, postBooking } from "@/controllers";
import Router from "express";

const bookingsRouter = Router();

bookingsRouter.get("/", listBooking);
bookingsRouter.post("/", postBooking); 

export { bookingsRouter };
