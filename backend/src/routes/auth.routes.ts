import { Router } from "express";
import { register, login, profile } from "../controllers/auth.controller";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticateJWT, profile);

export default router;
