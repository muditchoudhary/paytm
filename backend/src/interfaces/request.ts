import { Request } from "express";

export interface ExtendedAuthStatsAttachedRequest extends Request {
  userId?: string;
}

export interface ExtendedNewUserDataAttachedRequest extends ExtendedAuthStatsAttachedRequest, Request {
  newUserData?: {
    password?: string;
    firstName?: string;
    lastName?: string;
  }
}

export interface ExtendedTranferAttachedRequest extends ExtendedAuthStatsAttachedRequest, Request {
  transferData?: {
    to: string;
    amount: number;
  }
}
