import { type RequestHandler } from "express";
import { asyncHandler } from "../utils";
import * as customerService from "../services/customers";
import { Park } from "../models/park";

const park = Park.getInstance();

export const getCustomersInPark: RequestHandler = (_req, res) => {
  res.json({ visitors: park.visitors });
};

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

export const sendEmails: RequestHandler = asyncHandler(async (req, res) => {
  const customersData = req.body.customers as Array<Record<string, any>>;
  const message = req.body.message as string;

  const notFound = await customerService.sendEmails(customersData, message);
  res.json({ message: "Emails sent", notFound });
});

export const registerCustomer: RequestHandler = asyncHandler(
  async (req, res) => {
    const customerData = req.body as Record<string, any>;

    try {
      // find customer
      const existingCustomer =
        await customerService.getCustomerByIdentification(
          customerData?.identification
        );
      // try to increment visits
      const updatedCustomer =
        await customerService.incrementCustomerVisits(existingCustomer);
      res.json(updatedCustomer);
    } catch (_) {
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
  const deletedCustomer = await customerService.deleteCustomerById(id);

  console.log({ deletedCustomer });
  res.json(deletedCustomer);
});

export const customerLeft: RequestHandler = (req, res): void => {
  park.removeVisitor();
  res.send("Goodbye!");
};
