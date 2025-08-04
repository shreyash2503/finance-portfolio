import { Request, Response } from "express";
import prisma from "../prisma/client";
import logger from "../utils/logger";
import yahooFinance from "yahoo-finance2";

export const getAssetAllocation = async (req: Request, res: Response) => {
  const { portfolioId } = req.params;
  const userId = req.user.userId;

  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });

    if (!portfolio || portfolio.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this portfolio." });
    }

    const items = await prisma.portfolioItem.findMany({
      where: { portfolioId },
    });
    if (!items.length)
      return res.status(404).json({ message: "No items found." });

    const symbols = items.map((i) => i.symbol);
    const quotes = await yahooFinance.quote(symbols);
    const priceMap = new Map<string, number>();

    (Array.isArray(quotes) ? quotes : [quotes]).forEach((q) => {
      if (q.symbol && q.regularMarketPrice)
        priceMap.set(q.symbol, q.regularMarketPrice);
    });

    const allocation = items.map((item) => ({
      symbol: item.symbol,
      value: item.quantity * (priceMap.get(item.symbol) ?? 0),
    }));

    res.json(allocation);
  } catch (err) {
    logger.error(`Asset allocation error: ${err}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTopMovers = async (req: Request, res: Response) => {
  const { portfolioId } = req.params;
  const userId = req.user.userId;

  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });

    if (!portfolio || portfolio.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this portfolio." });
    }

    const items = await prisma.portfolioItem.findMany({
      where: { portfolioId },
    });
    if (!items.length)
      return res.status(404).json({ message: "No items found." });

    const symbols = items.map((i) => i.symbol);
    const quotes = await yahooFinance.quote(symbols);

    const changes = (Array.isArray(quotes) ? quotes : [quotes])
      .filter((q) => q.symbol && q.regularMarketChangePercent !== undefined)
      .map((q) => ({
        symbol: q.symbol!,
        changePercent: q.regularMarketChangePercent!,
      }));

    const gainers = [...changes]
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5);
    const losers = [...changes]
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5);

    res.json({ gainers, losers });
  } catch (err) {
    logger.error(`Top movers error: ${err}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPortfolioPerformanceOverTime = async (
  req: Request,
  res: Response
) => {
  console.log("Fetching portfolio performance over time");
  const userId = req.user.userId;
  const portfolioId = req.params.portfolioId;
  const range = req.query.range || "1y"; // e.g., 1mo, 3mo, 6mo, 1y

  try {
    // Step 1: Verify ownership
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: { items: true },
    });

    if (!portfolio || portfolio.userId !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const items = portfolio.items;
    if (!items.length) {
      return res.status(404).json({ message: "No items in portfolio" });
    }

    const historyMap: { [symbol: string]: any[] } = {};

    for (const item of items) {
      try {
        const history = await yahooFinance.historical(item.symbol, {
          period1: rangeToStartDate(range.toString()),
          interval: "1mo",
        });
        // console.log(`Fetched history for ${item.symbol}:`, history);
        historyMap[item.symbol] = history;
      } catch (err) {
        logger.warn(`Failed to fetch history for ${item.symbol}: ${err}`);
      }
    }

    const dateMap: { [date: string]: number } = {};

    for (const item of items) {
      const history = historyMap[item.symbol];
      if (!history) continue;

      for (const h of history) {
        const date = h.date.toISOString().split("T")[0];
        const value = h.close * item.quantity;

        if (!dateMap[date]) {
          dateMap[date] = 0;
        }
        dateMap[date] += value;
      }
    }

    const performanceData = Object.entries(dateMap)
      .map(([date, totalValue]) => ({ date, totalValue }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    logger.info(`Portfolio performance fetched for user: ${userId}`);
    return res.json(performanceData);
  } catch (error) {
    logger.error("Error in getPortfolioPerformanceOverTime", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Helper function
function rangeToStartDate(range: string): string {
  const now = new Date();
  const date = new Date();

  switch (range) {
    case "1mo":
      date.setMonth(now.getMonth() - 1);
      break;
    case "3mo":
      date.setMonth(now.getMonth() - 3);
      break;
    case "6mo":
      date.setMonth(now.getMonth() - 6);
      break;
    case "1y":
    default:
      date.setFullYear(now.getFullYear() - 1);
      break;
  }

  return date.toISOString().split("T")[0];
}
