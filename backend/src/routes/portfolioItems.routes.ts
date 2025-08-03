import { Router } from "express";
import {
  addPortfolioItem,
  getPortfolioItems,
  deletePortfolioItem,
  getPortfolioPerformance,
} from "../controllers/portfolioItem.controller";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();

router.get("/:portfolioId/items", authenticateJWT, getPortfolioItems);
router.post("/:portfolioId/items", authenticateJWT, addPortfolioItem);

router.delete(
  "/:portfolioId/items/:itemId",
  authenticateJWT,
  deletePortfolioItem
);

router.get(
  "/portfolio/:portfolioId/performance",
  authenticateJWT,
  getPortfolioPerformance
);

export default router;
