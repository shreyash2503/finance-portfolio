import { Request, Response } from "express";
import prisma from "../prisma/client";
import logger from "../utils/logger";
import yahooFinance from "yahoo-finance2";

export const getPortfolioItems = async (req: Request, res: Response) => {
  try {
    const { portfolioId } = req.params;
    const userId = req.user.userId;
    console.log(userId);

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });
    if (!portfolio || portfolio.userId !== userId) {
      logger.warn(`Unauthorized item list access for portfolio ${portfolioId}`);
      return res.status(403).json({ error: "Forbidden" });
    }

    const items = await prisma.portfolioItem.findMany({
      where: { portfolioId },
    });

    logger.info(`Fetched ${items.length} items for portfolio ${portfolioId}`);
    res.json(items);
  } catch (err) {
    logger.error("Error fetching portfolio items", { error: err });
    res.status(500).json({ error: "Failed to fetch portfolio items" });
  }
};

export const addPortfolioItem = async (req: Request, res: Response) => {
  try {
    const { portfolioId } = req.params;
    const { symbol, quantity } = req.body;
    const userId = req.user.userId;

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });
    if (!portfolio || portfolio.userId !== userId) {
      logger.warn(`Unauthorized add item attempt for portfolio ${portfolioId}`);
      return res.status(403).json({ error: "Forbidden" });
    }

    const quote = await yahooFinance.quote(symbol);
    const quoteObj = Array.isArray(quote) ? quote[0] : quote;
    const price = quoteObj?.regularMarketPrice;
    if (!price) {
      logger.warn(`Invalid symbol or no price data for ${symbol}`);
      return res.status(400).json({ error: "Invalid symbol or no price data" });
    }

    const newItem = await prisma.portfolioItem.create({
      data: {
        name: quoteObj.shortName || symbol,
        symbol,
        quantity,
        price,
        portfolioId,
      },
    });

    logger.info(
      `Added item ${symbol} to portfolio ${portfolioId} at price ${price}`
    );
    res.status(201).json(newItem);
  } catch (err) {
    logger.error("Error adding portfolio item", { error: err });
    res.status(500).json({ error: "Failed to add portfolio item" });
  }
};

export const deletePortfolioItem = async (req: Request, res: Response) => {
  try {
    const { portfolioId, itemId } = req.params;
    const userId = req.user.userId;

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });
    if (!portfolio || portfolio.userId !== userId) {
      logger.warn(`Unauthorized delete attempt for portfolio ${portfolioId}`);
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.portfolioItem.delete({ where: { id: itemId } });
    logger.info(`Deleted item ${itemId} from portfolio ${portfolioId}`);
    res.status(204).send();
  } catch (err) {
    logger.error("Error deleting portfolio item", { error: err });
    res.status(500).json({ error: "Failed to delete portfolio item" });
  }
};

export const getPortfolioPerformance = async (req: Request, res: Response) => {
  try {
    const { portfolioId } = req.params;
    const userId = req.user.userId;

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });
    if (!portfolio || portfolio.userId !== userId) {
      logger.warn(
        `Unauthorized performance access for portfolio ${portfolioId}`
      );
      return res.status(403).json({ error: "Forbidden" });
    }

    const items = await prisma.portfolioItem.findMany({
      where: { portfolioId },
    });

    let totalValue = 0;
    let totalCost = 0;
    const performance = [];

    for (const item of items) {
      const quote = await yahooFinance.quote(item.symbol);
      const currentPrice = quote?.regularMarketPrice || 0;
      const currentValue = currentPrice * item.quantity;
      const costValue = item.price * item.quantity;
      const gainLoss = currentValue - costValue;

      totalValue += currentValue;
      totalCost += costValue;

      performance.push({
        symbol: item.symbol,
        name: item.name,
        quantity: item.quantity,
        costPrice: item.price,
        currentPrice,
        gainLoss,
      });
    }

    logger.info(`Performance calculated for portfolio ${portfolioId}`);
    res.json({
      performance,
      totalValue,
      totalCost,
      totalGainLoss: totalValue - totalCost,
    });
  } catch (err) {
    logger.error("Error calculating performance", { error: err });
    res
      .status(500)
      .json({ error: "Failed to calculate portfolio performance" });
  }
};
