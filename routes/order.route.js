import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { getOrders, getOrder, confirm, intent } from "../controllers/order.controller.js";
const  router = express.Router();

// router.post("/:gigId", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.get("/:id", verifyToken, getOrder);
router.post("/create-payment-intent/:gigID", verifyToken, intent);
router.put("/", verifyToken, confirm);
export  default router;

