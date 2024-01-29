import type express from "express";
import { type RequestHandler } from "express";
import { asyncHandler } from "../utils";
import * as customerService from "../services/customers";

export const getAllCustomers: RequestHandler = asyncHandler(
  async (_req: express.Request, res: express.Response) => {
    const customers = await customerService.getAllCustomers();
    res.json(customers);
  }
);

