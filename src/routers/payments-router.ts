import { addPayment, listPayment } from "@/controllers/payments-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { newPaymentSchema } from "@/schemas/payments-schemas";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", listPayment)
  .post("/process", validateBody(newPaymentSchema), addPayment);

export { paymentsRouter };
