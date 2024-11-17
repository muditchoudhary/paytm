import express, { Router, Response, NextFunction } from "express";
import { z } from "zod";

import { authMiddleware } from "../middleware";
import { handleGetBalance, handleTransfer } from "../controllers/account";
import { ExtendedTranferAttachedRequest } from "../interfaces/request";


const router: Router = express.Router();

async function validateTranfer(req: ExtendedTranferAttachedRequest, res: Response, next: NextFunction): Promise<undefined> {
  const schema = z.object({
    to: z.string(),
    amount: z.number(),
  });

  try {
    const parsedData = schema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ error: JSON.parse(parsedData.error.message) });
      return;
    }
    req.transferData = parsedData.data;
    next();
    return;
    
  } catch (error) {
    console.log("Error from validateUpdate");
    console.error(error);
    
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

router.get("/balance", authMiddleware, handleGetBalance);
router.post("/transfer", authMiddleware, validateTranfer, handleTransfer);

export default router;
