import { Response } from "express";

import { Account } from "../database/db";

import { ExtendedAuthStatsAttachedRequest, ExtendedTranferAttachedRequest } from "../interfaces/request";
import mongoose from "mongoose";

export async function handleGetBalance(req: ExtendedAuthStatsAttachedRequest, res: Response) {
  try {
    const accountData = await Account.findOne({ userId: req.userId });
    if (!accountData) {
      res.status(404).json({ error: "Account not found" });
      return;
    }

    res.status(200).json({ balance: accountData.balance });
    return;
  } catch (error) {
    console.log("Error from handleGetBalance");
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

export async function handleTransfer(req: ExtendedTranferAttachedRequest, res: Response) {
  try {
    if (!req.transferData) {
      res.status(400).json({ error: "No transfer data provided" });
      return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();


    const senderAccount = await Account.findOne({ userId: req.userId }).session(session);
    if (!senderAccount) {
      await session.abortTransaction();
      res.status(404).json({ error: "Sender account not found" });
      return;
    }

    if (senderAccount.balance < req.transferData.amount) {
      await session.abortTransaction();
      res.status(400).json({ error: "Insufficient balance" });
      return;
    }

    const receiverAccount = await Account.findOne({ userId: req.transferData.to }).session(session);
    if (!receiverAccount) {
      await session.abortTransaction();
      res.status(404).json({ error: "Receiver account not found" });
      return;
    }

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -req.transferData.amount } }).session(session);
    await Account.updateOne({ userId: req.transferData.to }, { $inc: { balance: req.transferData.amount } }).session(session);

    await session.commitTransaction();

    res.status(200).json({ message: "Transfer successful" });
    return;


  } catch (error) {
    console.log("Error from handleTransfer");
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}