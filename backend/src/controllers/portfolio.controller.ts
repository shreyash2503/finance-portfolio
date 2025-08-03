import { Request, Response } from "express";
import prisma from "../prisma/client";
import logger from "../utils/logger";

export const getAllPortfolios = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    logger.info(`Fetching logs from user ${userId}`);
    const portfolios = await prisma.portfolio.findMany({
      where: { userId },
      include: { items: true, performances: true },
    });
    res.status(200).json(portfolios);
  } catch (error) {
    logger.error("Error fetching portfolios", { error });
    res.status(500).json({ error: "Failed to fetch portfolios" });
  }
};

export const getPortfolioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
      include: { items: true, performances: true },
    });
    if (!portfolio || portfolio.userId !== req.user.userId) {
      logger.warn(`Unauthorized access attempt or portfolio not found: ${id}`);
      return res.status(404).json({ error: "Portfolio not found" });
    }
    logger.info(`Portfolio ${id} retrieved`);
    res.json(portfolio);
  } catch (err) {
    logger.error("Error fetching portfolio by ID", { error: err });
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
};

export const createPortfolio = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const portfolio = await prisma.portfolio.create({
      data: {
        name,
        description,
        userId: req.user.userId,
      },
    });
    logger.info(`Created portfolio ${portfolio.id} for user ${req.user!.id}`);
    res.status(201).json(portfolio);
  } catch (err) {
    logger.error("Error creating portfolio", { error: err });
    res.status(500).json({ error: "Failed to create portfolio" });
  }
};

export const updatePortfolio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const existing = await prisma.portfolio.findUnique({ where: { id } });

    if (!existing || existing.userId !== req.user.userId) {
      logger.warn(`Unauthorized update attempt or portfolio not found: ${id}`);
      return res.status(404).json({ error: "Portfolio not found" });
    }
    if (
      (name === undefined && description === undefined) ||
      (name === "" && description === "")
    ) {
      logger.warn("Update failed: No fields provided for update");
      return res.status(400).json({ error: "No fields provided for update" });
    }

    const updateData = {
      ...(name !== "" && { name }),
      ...(description !== "" && { description }),
    };

    const updated = await prisma.portfolio.update({
      where: { id },
      data: { ...updateData },
    });

    logger.info(`Updated portfolio ${id}`);
    res.json(updated);
  } catch (err) {
    logger.error("Error updating portfolio", { error: err });
    res.status(500).json({ error: "Failed to update portfolio" });
  }
};

export const deletePortfolio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.portfolio.findUnique({ where: { id } });

    if (!existing || existing.userId !== req.user.userId) {
      logger.warn(`Unauthorized delete attempt or portfolio not found: ${id}`);
      return res.status(404).json({ error: "Portfolio not found" });
    }

    await prisma.portfolio.delete({ where: { id } });
    logger.info(`Deleted portfolio ${id}`);
    res.status(204).send();
  } catch (err) {
    logger.error("Error deleting portfolio", { error: err });
    res.status(500).json({ error: "Failed to delete portfolio" });
  }
};
