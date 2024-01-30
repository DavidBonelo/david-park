import type express from "express";
import { buyCredits, getAllStations } from "../controllers/stations";

export default (router: express.Router): void => {
  router.get("/stations", getAllStations);
  router.post("/station/:name/buy", buyCredits);
};
