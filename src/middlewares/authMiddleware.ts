import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv'; 

dotenv.config({path: './.env'})

/**
 * i implemented faux token as measure to enable authentcation to be carried on without the necessary standings of a jwt token,
 * cookie, or other 
 */


// Faux token for authentication
const FAUX_TOKEN = process.env['FAUX_TOKEN'];
const NODE_ENV = process.env['NODE_ENV'];

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (NODE_ENV === 'development') {
    // Skip token check in development for easier testing
    next();
    return;
  }
  
  const token = req.headers["authorization"];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  if (token !== `Bearer ${FAUX_TOKEN}`) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  next();
};

export default authMiddleware;