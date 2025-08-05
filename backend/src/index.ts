import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import logger from "./utils/logger";
import { Request, Response, NextFunction } from "express";

import portfolioRouter from "./routes/portfolio.routes";
import portfolioItemRouter from "./routes/portfolioItems.routes";
import graphRouter from "./routes/graph.routes";
import metricsRouter from "./metrics/client";
import transactionRouter from "./routes/transaction.routes";

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});
app.use(metricsRouter);

app.use("/api/auth", authRoutes);
app.use("/api/v1/portfolio", portfolioRouter);
app.use("/api/v1/portfolio-item", portfolioItemRouter);
app.use("/api/v1/transaction", transactionRouter);
app.use("/api/v1/graph", graphRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ error: "Internal server error" });
});

app.listen(process.env.port || 3000, () => {
  logger.info(`Server is running on port ${process.env.port || 3000}`);
});
