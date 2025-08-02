import express from "express";
import authRoutes from "./routes/authRoutes";
import logger from "./utils/logger";
import { Request, Response, NextFunction } from "express";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", authRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ error: "Internal server error" });
});

app.listen(process.env.port || 3000, () => {
  logger.info(`Server is running on port ${process.env.port || 3000}`);
});
