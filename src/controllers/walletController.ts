import { Request, Response } from "express";
import { fundAccountService, withdrawFundsService, transferFundsService } from "../services/walletService";




export const fundAccountController = async (req: Request, res: Response) => {
    const { userId, amount, password } = req.body;
    try {
      const result = await fundAccountService(userId, amount, password);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: `unable to fund account! ${error}` });
    }
  };
  
  export const transferFundsController = async (req: Request, res: Response) => {
    const { userId, recipient_wallet_Id, amount, password } = req.body;
    try {
      const result = await transferFundsService(userId, recipient_wallet_Id, amount, password);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: `unable to transfer funds! ${error}` });
    }
  };
  
  export const withdrawFundsController = async (req: Request, res: Response) => {
    const { userId, amount, password } = req.body;
    try {
      const result = await withdrawFundsService(userId, amount, password);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: `unable to withdraw funds! ${error}` });
    }
  };
  