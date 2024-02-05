import { type RequestHandler } from "express";
import { asyncHandler } from "../utils";
import { getAttractionById } from "../services/attractions";
import { getMaintenanceStaffById } from "../services/staff";
import { updateStationsAttractions } from "../services/stations";
import { BadRequestError, NotFoundError } from "../utils/errors";
import { isValidObjectId } from "mongoose";

export const inspectAttraction: RequestHandler = asyncHandler(
  async (req, res) => {
    const attractionId = req.params.id;
    const maintenanceStaffId = req.body.staff?.id as string;

    if (!isValidObjectId(attractionId)) {
      throw new BadRequestError("Missing or invalid attraction id");
    }
    if (!isValidObjectId(maintenanceStaffId)) {
      throw new BadRequestError("Missing or invalid staff id");
    }

    const attraction = await getAttractionById(attractionId);
    if (attraction === null) {
      throw new NotFoundError(`Attraction not found`);
    }
    if (!attraction.available) {
      throw new BadRequestError("The attraction is already under maintenance");
    }

    const staff = await getMaintenanceStaffById(maintenanceStaffId);
    if (staff === null) {
      throw new NotFoundError(`Staff not found`);
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

export const fixAttraction: RequestHandler = asyncHandler(async (req, res) => {
  const attractionId = req.params.id;
  const maintenanceStaffId = req.body.staff?.id as string;

  if (!isValidObjectId(attractionId) ) {
    throw new BadRequestError("Missing or invalid attraction id");
  }
  if (!isValidObjectId(maintenanceStaffId)) {
    throw new BadRequestError("Missing or invalid staff id");
  }

  const attraction = await getAttractionById(attractionId);
  if (attraction === null) {
    throw new NotFoundError(`Attraction not found`);
  }
  if (attraction.available) {
    throw new BadRequestError("The attraction is already working fine");
  }

  const staff = await getMaintenanceStaffById(maintenanceStaffId);
  if (staff === null) {
    throw new NotFoundError(`Staff not found`);
  }

  const result = await staff.fixAttraction(attraction);
  updateStationsAttractions();
  res.json({
    result,
    message: "Sharing fix result with stations...",
    maintenanceBy: staff,
    attraction,
  });
});

// TODO: refactor DRY!
