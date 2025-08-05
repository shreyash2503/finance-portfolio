import express from "express";

import { createTransaction } from "../controllers/transaction.controller";

const router = express.Router();

router.post("/", createTransaction);
export default router;
