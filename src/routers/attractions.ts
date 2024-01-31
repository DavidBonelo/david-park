import type express from "express";
import {
  getAllAttractions,
  rideAttraction,
  updateAttractionOperator,
} from "../controllers/attractions";

export default (router: express.Router): void => {
  router.get("/attractions", getAllAttractions);
  router.post("/attractions/:id/ride", rideAttraction);
  router.post("/attractions/:id/operator/edit", updateAttractionOperator);
};
