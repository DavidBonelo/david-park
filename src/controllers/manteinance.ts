import { type RequestHandler } from "express";
import { asyncHandler } from "../utils";
import { getAttractionById } from "../services/attractions";
import { getMaintenanceStaffById } from "../services/staff";
import { updateStationsAttractions } from "../services/stations";

export const inspectAttraction: RequestHandler = asyncHandler(
  async (req, res) => {
    const attractionId = req.params.id;
    const maintenanceStaffId = req.body.staff?.id as string;

    if (attractionId === undefined) {
      res.status(400).send("Missing attraction id");
      return;
    }
    if (maintenanceStaffId === undefined) {
      res.status(400).send("Missing staff id");
      return;
    }

    const attraction = await getAttractionById(attractionId);
    if (attraction === null) {
      res.status(404).send(`Attraction not found`);
      return;
    }
    const staff = await getMaintenanceStaffById(maintenanceStaffId);
    if (staff === null) {
      res.status(404).send(`Staff not found`);
      return;
    }

    const result = await staff.inspectAttraction(attraction);
    updateStationsAttractions();
    res.json({
      result,
      message: "Sharing inspection result with stations...",
      inspector: staff,
      attraction,
    });
  }
);

