import type express from "express";
import { getAllCustomers } from "../controllers/customers";

export default (router: express.Router): void => {
  router.get("/customers", getAllCustomers);
};
