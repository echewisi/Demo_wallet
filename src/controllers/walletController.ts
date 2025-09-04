import { Request, Response } from "express";
import { fundAccountService, withdrawFundsService, transferFundsService } from "../services/walletService";
import { WalletError } from "../utils/errors";

export const fundAccountController = async (req: Request, res: Response): Promise<void> => {
  const { userId, amount, password } = req.body;
  try {
    const result = await fundAccountService(userId, amount, password);
    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        newBalance: result.newBalance
      }
    });
  } catch (error) {
    if (error instanceof WalletError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        error: error.name
      });
    } else {
      console.error('Unexpected error in fundAccountController:', error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: "InternalServerError"
      });
    }
  }
};

export const transferFundsController = async (req: Request, res: Response): Promise<void> => {
  const { userId, recipientWalletId, amount, password } = req.body;
  try {
    const result = await transferFundsService(userId, recipientWalletId, amount, password);
    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        transactionId: result.transactionId
      }
    });
  } catch (error) {
    if (error instanceof WalletError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        error: error.name
      });
    } else {
      console.error('Unexpected error in transferFundsController:', error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: "InternalServerError"
      });
    }
  }
};

export const withdrawFundsController = async (req: Request, res: Response): Promise<void> => {
  const { userId, amount, password } = req.body;
  try {
    const result = await withdrawFundsService(userId, amount, password);
    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        newBalance: result.newBalance
      }
    });
  } catch (error) {
    if (error instanceof WalletError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        error: error.name
      });
    } else {
      console.error('Unexpected error in withdrawFundsController:', error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: "InternalServerError"
      });
    }
  }
};
  