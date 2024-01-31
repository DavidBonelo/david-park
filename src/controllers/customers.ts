import { type RequestHandler } from "express";
import { asyncHandler } from "../utils";
import * as customerService from "../services/customers";
import { Park } from "../models/park";

const park = Park.getInstance();

export const getAllCustomers: RequestHandler = asyncHandler(
  async (_req, res) => {
    const customers = await customerService.getAllCustomers();
    res.json(customers);
  }
);

export const getMarketableCustomers: RequestHandler = asyncHandler(
  async (req, res) => {
    let greaterThan = Number(req.params.greaterThan ?? 3);
    if (isNaN(greaterThan)) greaterThan = 0;

    const customers = await customerService.getMarketableCustomers(greaterThan);
    res.json({ customers });
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
    } else {
      // create new customer
      const newCustomer = await customerService.createCustomer(customerData);
      console.log("Customer created", newCustomer);
      res.json(newCustomer);
    }
    // update Park visitors
    void park.addVisitor();
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

export const customerLeft: RequestHandler = (req, res): void => {
  park.removeVisitor();
  res.send("Goodbye!");
};
