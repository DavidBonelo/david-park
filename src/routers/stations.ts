import type express from "express";
import { buyCredits } from "../controllers/stations";

export default (router: express.Router): void => {
  router.post("/station/:name/buy", buyCredits);
};
