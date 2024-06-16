import express from "express";
import { createUserController, loginController } from "../controllers/userController";

const router = express.Router();

router.post("/create-account", createUserController);
router.post("/login", loginController);

export default router;