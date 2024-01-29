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

export const registerCustomer: RequestHandler = asyncHandler(
  async (req, res) => {
    const customerData = req.body as Record<string, any>;
    if (customerData.identification === undefined) {
      throw new Error("Identification is required");
    }
    // create new customer
    const newCustomer = await customerService.createCustomer(customerData);
    console.log("Customer created", newCustomer);

    res.json(newCustomer);
  }
);
