import { Request, Response } from "express";
import { createUserService } from "../services/userService";
import { WalletError } from "../utils/errors";

export const createUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user
    });
  } catch (error) {
    if (error instanceof WalletError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        error: error.name
      });
    } else {
      console.error('Unexpected error in createUserController:', error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: "InternalServerError"
      });
    }
  }
};


