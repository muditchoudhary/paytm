import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../database/db";
import { SALT_ROUNDS } from "../constants";
import { JWT_SECRET } from "../config";

export async function handleSignup(req: Request, res: Response){
  try {
    const userData = req.body;
    userData["password"] = await bcrypt.hash(userData["password"], SALT_ROUNDS);
    const dbResult = await User.create(userData);

    const payload = { userId: dbResult._id };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User created successfully",
      token: token, 
    });
    return;
  } catch (error) {
    console.log("Error from handleSignup");
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

export async function handleSignin(req: Request, res: Response){
  try {
    const userData = req.body;
    
    const dbResult = await User.findOne({ email: userData["email"] });
    if (!dbResult) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    
    const passwordMatch = await bcrypt.compare(userData["password"], dbResult["password"]);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const payload = { userId: dbResult._id };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User logged in successfully",
      token: token, 
    });
    return;
  } catch (error) {
    console.log("Error from handleSignin");
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}