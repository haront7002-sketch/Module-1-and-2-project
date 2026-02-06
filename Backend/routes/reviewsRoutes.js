import express from "express";
import { getReviews, addReview, deleteReview } from "../controllers/reviewsController.js";

const router = express.Router();

router.get("/", getReviews);
router.post("/", addReview);
router.delete("/", deleteReview);

export default router;