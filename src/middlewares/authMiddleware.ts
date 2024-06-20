import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv'; 

dotenv.config({path: './.env'})

/**
 * i implemented faux token as measure to enable authentcation to be carried on without the necessary standings of a jwt token,
 * cookie, or other 
 */


// Faux token for authentication
const FAUX_TOKEN = process.env.FAUX_TOKEN;
const NODE_ENV = process.env.NODE_ENV;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (NODE_ENV === 'development') {
    // Skip token check in development for easier testing
    next();
  } else {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    if (token !== `Bearer ${FAUX_TOKEN}`) {
      return res.status(401).json({ message: "Invalid token" });
    }

    next();
  }
};

export default authMiddleware;