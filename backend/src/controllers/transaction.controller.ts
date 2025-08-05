import prisma from "../prisma/client";
import { Request, Response } from "express";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { portfolioItemId, action, quantity, price } = req.body;

    if (!["BUY", "SELL"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const portfolioItem = await prisma.portfolioItem.findUnique({
      where: { id: portfolioItemId },
    });

    if (!portfolioItem) {
      return res.status(404).json({ error: "Portfolio item not found" });
    }

    // Validate SELL operation
    if (action === "SELL" && quantity > portfolioItem.quantity) {
      return res.status(400).json({ error: "Not enough quantity to sell" });
    }

    // Update quantity
    const updatedQuantity =
      action === "BUY"
        ? portfolioItem.quantity + quantity
        : portfolioItem.quantity - quantity;

    // Save transaction
    const transaction = await prisma.transaction.create({
      data: {
        portfolioItemId,
        action,
        quantity,
        price,
      },
    });

    // Update portfolio item quantity & price (optional: average price logic)
    await prisma.portfolioItem.update({
      where: { id: portfolioItemId },
      data: {
        quantity: updatedQuantity,
        price, // optional: or calculate average buy price
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Transaction Error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
};
