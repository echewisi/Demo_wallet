import { Request, Response } from "express";
import { createUserService, loginService, fundAccountService, transferFundsService, withdrawFundsService } from "../services/userService";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await loginService(email, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const fundAccountController = async (req: Request, res: Response) => {
  const { userId, amount, password } = req.body;
  try {
    const result = await fundAccountService(userId, amount, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const transferFundsController = async (req: Request, res: Response) => {
  const { userId, recipientId, amount, password } = req.body;
  try {
    const result = await transferFundsService(userId, recipientId, amount, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const withdrawFundsController = async (req: Request, res: Response) => {
  const { userId, amount, password } = req.body;
  try {
    const result = await withdrawFundsService(userId, amount, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
