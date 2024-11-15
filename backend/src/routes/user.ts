import express, { NextFunction, Router, Request, Response } from "express";
import {z} from "zod";
import { User } from "../database/db";
import { handleSignin, handleSignup } from "../controllers/user";

const router: Router = express.Router();
async function validateSignup(req: Request, res: Response, next: NextFunction): Promise<undefined> {
  const schema = z.object({
    firstName: z.string().trim().min(3).max(50),
    lastName: z.string().trim().min(3).max(50),
    userName: z.string().trim().toLowerCase().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(12),
  });
  try {
    const parsedData = schema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ error: JSON.parse(parsedData.error.message) });
      return;
    }

    const user = await User.findOne({ $or: [{ userName: req.body.userName }, { email: req.body.email }] });
    if (user) {
      res.status(400).json({ error: "User already exists with this email or username" });
      return;
    }

    next();
    return;
    
  } catch (error) {
    console.log("Error from validateSignup");
    console.error(error);
    
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

async function validateSignin(req: Request, res: Response, next: NextFunction): Promise<undefined> {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(12),
  });
  try {
    const parsedData = schema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ error: JSON.parse(parsedData.error.message) });
      return;
    }
    
    next();
    return;
    
  } catch (error) {
    console.log("Error from validateSignup");
    console.error(error);
    
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}
router.post("/signup", validateSignup, handleSignup);
router.post("/signin", validateSignin, handleSignin);

export default router;
