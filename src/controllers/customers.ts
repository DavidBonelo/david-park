import type express from "express";
import { type RequestHandler } from "express";
import { asyncHandler } from "../utils";
import * as customerService from "../services/customers";
import { type Customer } from "../models/customer";

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

    // find customer
    const existingCustomer = await customerService.getCustomerByIdentification(
      customerData.identification
    );
    if (existingCustomer != null) {
      // aldready registered: increment customer visits field
      const updatedCustomer =
        await customerService.incrementCustomerVisits(existingCustomer);
      res.json(updatedCustomer);
      return;
    }
    // create new customer
    const newCustomer = await customerService.createCustomer(customerData);
    console.log("Customer created", newCustomer);

    res.json(newCustomer);
  }
);

export const deleteCustomer: RequestHandler = asyncHandler(async (req, res) => {
  const id = req.params.id;

  console.log("Deleting customer", id);
  const deletedCustomer = await customerService.deleteCustomerById(id);

  if (deletedCustomer === null) {
    console.log(`Customer ${id} not found`);
    res.status(404);
    return;
  }
  console.log({ deletedCustomer });
  res.json(deletedCustomer);
});
