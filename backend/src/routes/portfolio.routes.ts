import express from "express";
import {
  getAllPortfolios,
  createPortfolio,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
} from "../controllers/portfolio.controller";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authenticateJWT);

router.get("/", getAllPortfolios);
router.post("/", createPortfolio);
router.get("/:id", getPortfolioById);
router.put("/:id", updatePortfolio);
router.delete("/:id", deletePortfolio);

export default router;
