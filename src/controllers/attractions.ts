import { type RequestHandler } from "express";
import { asyncHandler } from "../utils";
import * as attractionsService from "../services/attractions";
import { getCustomerByIdentification } from "../services/customers";
import { type OperatorStaff } from "../models/staff";
import { getOperatorById } from "../services/staff";
import { isValidObjectId } from "mongoose";
import { BadRequestError, NotAllowedError, NotFoundError } from "../utils/errors";

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

    if (!isValidObjectId(attractionId)) {
      throw new BadRequestError("Missing or invalid attraction id");
    }
    if (!isValidObjectId(operatorId)) {
      throw new BadRequestError("Missing or invalid operator id");
    }

    const attraction = await attractionsService.getAttractionById(attractionId);
    if (attraction === null) {
      throw new NotFoundError(`Attraction not found`);
    }

    const operator = await getOperatorById(operatorId);
    if (operator === null) {
      throw new NotFoundError(`Operator not found`);
    }

    const oldOperator = attraction.operator;
    await attractionsService.updateAttractionOperator(attraction, operator);
    res.json({ message: "Operator updated", attraction, oldOperator });
  }
);

export const rideAttraction: RequestHandler = asyncHandler(async (req, res) => {
  const attractionId = req.params.id;
  const customerData = req.body.customer as Record<string, any>;

  if (!isValidObjectId(attractionId)) {
    throw new BadRequestError("Missing or ivalid attraction id");
  }
  if (customerData?.identification === undefined) {
    throw new BadRequestError("Missing identification data");
  }

  const attraction = await attractionsService.getAttractionById(attractionId);
  if (attraction === null) {
    throw new NotFoundError(`Attraction not found`);
  }

  if (attraction.operator === undefined || !attraction.available) {
    throw new BadRequestError(`Attraction: ${attraction.name} isn't ready`);
  }

  const customer = await getCustomerByIdentification(
    customerData.identification
  );
  if (customer === null) {
    throw new NotFoundError(`Customer not found`);
  }
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
