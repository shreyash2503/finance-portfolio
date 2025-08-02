import jwt from "jsonwebtoken";
import logger from "../utils/logger";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    logger.warn("JWT auth failed: No token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn("JWT auth failed: Invalid token");
      return res.status(403).json({ error: "Invalid token" });
    }
    if (user && typeof user === "object" && "userId" in user) {
      logger.info("JWT auth success", { userId: (user as any).userId });
    } else {
      logger.info("JWT auth success", { user });
    }
    req.user = user;
    next();
  });
}
