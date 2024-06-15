import { Request, Response, NextFunction } from "express";
/**
 * i implemented faux token as measure to enable authentcation to be carried on with
 * provided a token is provided in the request headers.
 */


// Faux token for authentication
const FAUX_TOKEN = "your-faux-token";

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
