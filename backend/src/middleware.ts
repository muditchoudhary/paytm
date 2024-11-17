import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "./config";
import { ExtendedAuthStatsAttachedRequest } from "./interfaces/request";

interface AuthPayload {
  userId: string;
}

export async function authMiddleware(req: ExtendedAuthStatsAttachedRequest, res: Response, next: NextFunction): Promise<undefined> {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.userId = payload.userId;
    next();
    return;
  } catch (error) {
    console.log("Error from authMiddleware");
    console.error(error);
    res.status(403).json({ error: "Unauthorized" });
    return;
  }
}