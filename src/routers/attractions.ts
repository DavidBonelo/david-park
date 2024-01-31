import type express from "express";
import { getAllAttractions, rideAttraction } from "../controllers/attractions";

export default (router: express.Router): void => {
  router.get("/attractions", getAllAttractions);
  router.post("/attractions/:id/ride", rideAttraction);
};
