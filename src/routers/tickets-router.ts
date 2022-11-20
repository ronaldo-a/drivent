import { listTicket, listTicketTypes, postTicket } from "@/controllers/tickets-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { ticketTypeIdSchema } from "@/schemas";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", listTicketTypes)
  .get("/", listTicket)
  .post("/", validateBody(ticketTypeIdSchema), postTicket);

export { ticketsRouter };
