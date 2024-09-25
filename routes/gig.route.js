import express from "express";
import { verifyToken } from "../middleware/jwt.js";
const  router = express.Router();
import { createGig, deleteGig, getGig, getGigs } from "../controllers/gig.controller.js";

router.post("/", verifyToken, createGig);
router.delete("/:id", verifyToken, deleteGig);
router.get("/single/:id",  getGig);
router.get("/", getGigs)

export  default router;
