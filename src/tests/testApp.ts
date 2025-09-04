import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";

// Import test routes (without authentication)
import testRoutes from "./testRoutes";

// Initialize Express app for testing
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Mock authentication middleware for tests
app.use((_req: Request, _res: Response, next: NextFunction) => {
  // Skip authentication in test environment
  next();
});

// Routes (without authentication middleware for tests)
app.use("/api/users", testRoutes);
app.use("/api/wallets", testRoutes);

// Basic route for health check
app.get("/", (_req: Request, res: Response) => {
  res.send("Demo Credit Wallet Service API is ready");
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

export default app;
