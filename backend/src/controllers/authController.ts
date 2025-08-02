import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
  updateUserToken,
  findUserById,
} from "../models/userModel";
import { Request, Response } from "express";
import logger from "../utils/logger";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;
  logger.info("Register attempt", { email });
  if (!email || !password) {
    logger.warn("Register failed: missing email or password");
    return res.status(400).json({ error: "Email and password required" });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    logger.warn("Register failed: user already exists", { email });
    return res.status(409).json({ error: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(email, passwordHash);

  logger.info("User registered", { userId: user.id, email: user.email });
  res.status(201).json({
    message: "User registered",
    user: { id: user.id, email: user.email },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  logger.info("Login attempt", { email });
  if (!email || !password) {
    logger.warn("Login failed: missing email or password");
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    logger.warn("Login failed: user not found", { email });
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    logger.warn("Login failed: invalid password", { email });
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
  await updateUserToken(user.id, token);

  logger.info("Login successful", { userId: user.id, email: user.email });
  res.json({ token });
}

export async function profile(req: Request, res: Response) {
  logger.info("Profile request", { userId: req.user.userId });
  const user = await findUserById(req.user.userId);
  if (!user) {
    logger.warn("Profile failed: user not found", { userId: req.user.userId });
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ id: user.id, email: user.email });
}
