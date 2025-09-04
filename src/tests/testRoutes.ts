import express from "express";
import {
  fundAccountController,
  transferFundsController,
  withdrawFundsController,
} from "../controllers/walletController";
import { createUserController } from "../controllers/userController";

const router = express.Router();

// User routes without authentication
router.post("/create-account", createUserController);

// Wallet routes without authentication
router.post("/fund-wallet", fundAccountController);
router.post("/transfer-funds", transferFundsController);
router.post("/withdraw-funds", withdrawFundsController);

export default router;



