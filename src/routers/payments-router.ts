import { listPayment } from "@/controllers/payments-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", listPayment);

export { paymentsRouter };
