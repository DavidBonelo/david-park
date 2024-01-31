import { type RequestHandler } from "express";
import { asyncHandler } from "../utils";
import * as attractionsService from "../services/attractions";
import { getCustomerByIdentification } from "../services/customers";
import { type OperatorStaff } from "../models/staff";

export const getAllAttractions: RequestHandler = asyncHandler(
  async (_req, res) => {
    const attractions = await attractionsService.getAllAttractions();
    res.json(attractions);
  }
);

export const rideAttraction: RequestHandler = asyncHandler(async (req, res) => {
  const attractionId = req.params.id;
  const customerData = req.body.customer as Record<string, any>;

  if (attractionId === undefined) {
    res.status(400).send("Missing attraction id");
    return;
  }
  if (customerData?.identification === undefined) {
    res.status(400).send("Missing identification data");
    return;
  }

  const attraction = await attractionsService.getAttractionById(attractionId);
  if (attraction === null) {
    res.status(404).send(`Attraction not found`);
    return;
  }

  if (attraction.operator === undefined || !attraction.available) {
    res.status(400).send(`Attraction: ${attraction.name} isn't ready`);
    return;
  }

  const customer = await getCustomerByIdentification(
    customerData.identification
  );
  if (customer === null) {
    res.status(404).send(`Customer not found`);
    return;
  }
  const canRide = (attraction.operator as OperatorStaff).customerCanRide(
    customer,
    attraction
  );
  if (!canRide) {
    res.status(400).send(`Customer can't ride`);
    return;
  }

  const previousCredits = customer.credits;
  await attractionsService.rideAttraction(attraction, customer);
  res.json({
    message: "Ride successful",
    operatedBy: attraction.operator,
    attraction: attraction.name,
    previousCredits,
    newCredits: customer.credits,
  });
});
