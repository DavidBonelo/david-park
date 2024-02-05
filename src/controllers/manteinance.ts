import { type RequestHandler } from "express";
import { asyncHandler } from "../utils";
import { getAttractionById } from "../services/attractions";
import { getMaintenanceStaffById } from "../services/staff";
import { updateStationsAttractions } from "../services/stations";
import { BadRequestError } from "../utils/errors";

export const inspectAttraction: RequestHandler = asyncHandler(
  async (req, res) => {
    const attractionId = req.params.id;
    const maintenanceStaffId = req.body.staff?.id as string;

    const attraction = await getAttractionById(attractionId);
    if (!attraction.available) {
      throw new BadRequestError("The attraction is already under maintenance");
    }

    const staff = await getMaintenanceStaffById(maintenanceStaffId);

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

export const fixAttraction: RequestHandler = asyncHandler(async (req, res) => {
  const attractionId = req.params.id;
  const maintenanceStaffId = req.body.staff?.id as string;

  const attraction = await getAttractionById(attractionId);
  if (attraction.available) {
    throw new BadRequestError("The attraction is already working fine");
  }

  const staff = await getMaintenanceStaffById(maintenanceStaffId);

  const result = await staff.fixAttraction(attraction);
  updateStationsAttractions();
  res.json({
    result,
    message: "Sharing fix result with stations...",
    maintenanceBy: staff,
    attraction,
  });
});
