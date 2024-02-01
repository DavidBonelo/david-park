import type express from "express";
import {
  getAllCustomers,
  registerCustomer,
  deleteCustomer,
  customerLeft,
  getMarketableCustomers,
  getCustomersInPark,
} from "../controllers/customers";

export default (router: express.Router): void => {
  router.post("/entrance/register", registerCustomer);
  router.get("/customers", getAllCustomers);
  router.get("/customers/now", getCustomersInPark);
  router.get("/customers/marketable/:greaterThan", getMarketableCustomers);
  router.delete("/customers/:id/delete", deleteCustomer);
  router.post("/exit", customerLeft);
};
