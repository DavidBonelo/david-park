import { type RequestHandler } from "express";
import { asyncHandler } from "../utils";
import * as attractionsService from "../services/attractions";
import { getCustomerByIdentification } from "../services/customers";
import { type OperatorStaff } from "../models/staff";
import { getOperatorById } from "../services/staff";
import {
  BadRequestError,
  NotAllowedError,
} from "../utils/errors";

export const getAllAttractions: RequestHandler = asyncHandler(
  async (_req, res) => {
    const attractions = await attractionsService.getAllAttractions();
    res.json(attractions);
  }
);

export const getAllAtractionsSorted: RequestHandler = asyncHandler(
  async (_req, res) => {
    const attractions = await attractionsService.getAllAttractionsSorted();
    res.json(attractions);
  }
);

export const updateAttractionOperator: RequestHandler = asyncHandler(
  async (req, res, _next) => {
    const attractionId = req.params.id;
    const operatorId = req.body.operator?.id as string;

    const attraction = await attractionsService.getAttractionById(attractionId);
    const operator = await getOperatorById(operatorId);

    const oldOperator = attraction.operator;
    await attractionsService.updateAttractionOperator(attraction, operator);
    res.json({ message: "Operator updated", attraction, oldOperator });
  }
);

export const rideAttraction: RequestHandler = asyncHandler(async (req, res) => {
  const attractionId = req.params.id;
  const customerData = req.body.customer as Record<string, any>;

  const attraction = await attractionsService.getAttractionById(attractionId);

  if (attraction.operator === undefined || !attraction.available) {
    throw new BadRequestError(`Attraction: ${attraction.name} isn't ready`);
  }

  const customer = await getCustomerByIdentification(
    customerData.identification
  );
  const canRide = (attraction.operator as OperatorStaff).customerCanRide(
    customer,
    attraction
  );
  if (!canRide) {
    throw new NotAllowedError(`Customer can't ride`);
  }

  const previousCredits = customer.credits;
  await attractionsService.rideAttraction(attraction, customer);
  res.json({
    canRide,
    message: "Ride successful",
    operatedBy: attraction.operator,
    attraction: attraction.name,
    previousCredits,
    newCredits: customer.credits,
  });
});
