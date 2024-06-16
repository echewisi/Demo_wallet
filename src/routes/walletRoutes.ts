import express from "express";
import {
  fundAccountController,
  transferFundsController,
  withdrawFundsController,
} from "../controllers/walletController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/fund-wallet", authMiddleware, fundAccountController);
router.post("/transfer-funds", authMiddleware, transferFundsController);
router.post("/withdraw-funds", authMiddleware, withdrawFundsController);

export default router;
