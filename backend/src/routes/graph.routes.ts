import { Router } from "express";
import {
  getAssetAllocation,
  getPortfolioPerformanceOverTime,
  getTopMovers,
} from "../controllers/graph.controller";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateJWT);
router.get("/portfolio/:portfolioId/allocation", getAssetAllocation);
router.get("/portfolio/:portfolioId/top-movers", getTopMovers);
router.get(
  "/portfolio/:portfolioId/historical-performance",
  getPortfolioPerformanceOverTime
);

export default router;
