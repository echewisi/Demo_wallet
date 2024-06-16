import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv'; 

dotenv.config()

/**
 * i implemented faux token as measure to enable authentcation to be carried on without the necessary standings of a jwt token
 */


// Faux token for authentication
const FAUX_TOKEN = process.env.FAUX_TOKEN;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (token !== `Bearer ${FAUX_TOKEN}`) {
    return res.status(401).json({ message: "Invalid token" });
  }

  next();
};

export default authMiddleware;
