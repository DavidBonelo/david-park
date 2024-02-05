import { type RequestHandler } from "express";
import { asyncHandler } from "../utils";
import * as stationsService from "../services/stations";
import * as customersService from "../services/customers";
import { BadRequestError } from "../utils/errors";

export const getAllStations: RequestHandler = asyncHandler(
  async (_req, res) => {
    res.json(stationsService.getAllStations());
  }
);

export const buyCredits: RequestHandler = asyncHandler(async (req, res) => {
  const amountToBuy = Number(req.body.amount);
  const stationName = req.params.name;
  const customerData = req.body.customer as Record<string, any>;

  if (Number.isNaN(amountToBuy)) {
    throw new BadRequestError("Missing credits amount");
  }
  const station = stationsService.getStationByName(stationName);
  if (!station.open || station.employee === undefined) {
    throw new BadRequestError(`Station: ${stationName} isn't ready`);
  }
  const customer = await customersService.getCustomerByIdentification(
    customerData.identification
  );

  const oldCredits = customer.credits;
  await station.employee.sellCredits(customer, amountToBuy);
  res.json({
    receipt: {
      oldCredits,
      newCredits: customer.credits,
      soldAt: station.name,
      soldBy: station.employee,
      customer,
    },
  });
});
