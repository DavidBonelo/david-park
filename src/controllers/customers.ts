import type express from "express";
import { type RequestHandler } from "express";
import { asyncHandler } from "../utils";
import * as customerService from "../services/customers";
import { type Customer } from "../models/customer";
import { Park } from "../models/park";

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
    // const park = Park.getInstance();
    // check if park is full
    // update Park visits
    // park.addVisitor();

    // find customer
    const existingCustomer = await customerService.getCustomerByIdentification(
      customerData.identification
    );
    if (existingCustomer != null) {
      // aldready registered: increment customer visits field
      const updatedCustomer = await incrementCustomerVisits(existingCustomer);
      res.json(updatedCustomer);
      return;
    }
    // create new customer
    const newCustomer = await customerService.createCustomer(customerData);
    console.log("Customer created", newCustomer);

    res.json(newCustomer);
  }
);

async function incrementCustomerVisits(
  existingCustomer: Customer
): Promise<Customer | null> {
  const updatedCustomer = await customerService.updateCustomerById(
    existingCustomer._id.toString(),
    {
      visits: existingCustomer.visits + 1,
    }
  );
  console.log("Customer updated, welcome back :)", updatedCustomer);
  return updatedCustomer;
}
