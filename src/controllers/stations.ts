import { type RequestHandler } from "express";
import { asyncHandler } from "../utils";
import * as stationsService from "../services/stations";
import * as customersService from "../services/customers";

export const buyCredits: RequestHandler = asyncHandler(async (req, res) => {
  const amountToBuy = Number(req.body.amount);
  const stationName = req.params.name;
  const customerData = req.body.customer as Record<string, any>;

  if (Number.isNaN(amountToBuy)) {
    res.status(400).send("Missing amount");
    return;
  }
  const station = stationsService.getStationByName(stationName);
  if (station === undefined) {
    res.status(404).send(`Station ${stationName} not found`);
    return;
  } else if (!station.open || station.employee === undefined) {
    res.status(400).send(`Station ${stationName} isn't ready`);
    return;
  }
  const customer = await customersService.getCustomerByIdentification(
    customerData.identification
  );
  if (customer === null) {
    res.status(404).send(`Customer not found`);
    return;
  }

  const credits = customer.credits;
  await station.employee.sellCredits(customer, amountToBuy);
  res.json({ oldCredits: credits, newCredits: customer.credits, customer });
});
