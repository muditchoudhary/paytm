import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Account, User } from "../database/db";
import { SALT_ROUNDS } from "../constants";
import { JWT_SECRET } from "../config";
import { ExtendedNewUserDataAttachedRequest } from "../interfaces/request";

export async function handleSignup(req: Request, res: Response){
  try {
    const userData = req.body;
    userData["password"] = await bcrypt.hash(userData["password"], SALT_ROUNDS);
    const dbResult = await User.create(userData);

    const randomBalance = Math.floor(Math.random() * 10001);
    await Account.create({
      userId: dbResult._id,
      balance: randomBalance
    });

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

export async function handleUpdateUser(req: ExtendedNewUserDataAttachedRequest, res: Response) {
  try {
    const userId = req.userId;
    const newUserData = req.newUserData;
    if (!newUserData) {
      res.status(400).json({ error: "No new user data provided" });
      return;
    }
    if (newUserData.password) {
      newUserData.password = await bcrypt.hash(newUserData.password, SALT_ROUNDS);
    }
    console.log(newUserData);
    await User.updateOne({ _id: userId }, { $set: newUserData });
    res.status(200).json({ message: "User updated successfully" });
    return;
  } catch (error) {
    console.log("Error from handleUpdateUser");
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}


export async function handleBulk(req: Request, res: Response) {
  try {
    const filter = req.query.filter;
    if (!filter || Array.isArray(filter) || typeof filter !== "string" ) {
      res.status(400).json({ error: "No filter provided" });
      return;
    }
    
    const users = await User.find(
      { $or: [
        { firstName: {$regex: filter, $options: "i"} }, 
        { lastName: {$regex: filter, $options: "i"} }
      ] }
    );

    res.status(200).json({ users: users.map((user) => {
      return {
        _id: user._id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName
      };
    }) });
    return;
  } catch (error) {
    console.log("Error from handleBulk");
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}