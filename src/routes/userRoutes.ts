import express from "express";
import { createUserController } from "../controllers/userController";

const router = express.Router();

router.post("/create-account", createUserController);

export default router;