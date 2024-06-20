import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import userRoutes from "./routes/userRoutes";
import walletRoutes from "./routes/walletRoutes";

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Faux authentication middleware
import authMiddleware from "./middlewares/authMiddleware";
app.use(authMiddleware);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/wallets", walletRoutes);

// Basic route for health check
app.get("/", (req: Request, res: Response) => {
  res.send("Demo Credit Wallet Service API is ready");
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
