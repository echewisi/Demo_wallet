import { Request, Response } from "express";
import { createUserService} from "../services/userService";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: `unable to create user! ${error}`  });
  }
};


