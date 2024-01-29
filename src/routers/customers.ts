import type express from "express";
import { getAllCustomers, registerCustomer , deleteCustomer} from "../controllers/customers";

export default (router: express.Router): void => {
  router.post("/entrance/register", registerCustomer);
  router.get("/customers", getAllCustomers);
  router.delete("/customers/:id/delete", deleteCustomer)
};
