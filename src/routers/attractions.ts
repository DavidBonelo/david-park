import type express from "express";
import {
  getAllAttractions,
  rideAttraction,
  updateAttractionOperator,
} from "../controllers/attractions";
import { fixAttraction, inspectAttraction } from "../controllers/manteinance";

export default (router: express.Router): void => {
  router.get("/attractions", getAllAttractions);
  router.post("/attractions/:id/ride", rideAttraction);
  router.patch("/attractions/:id/operator/edit", updateAttractionOperator);
  router.patch("/attractions/:id/inspect", inspectAttraction);
  router.patch("/attractions/:id/fix", fixAttraction);
};
