import { type DocumentType } from "@typegoose/typegoose";
import { type Attraction, AttractionModel } from "../models/attraction";
import { type Customer } from "../models/customer";

export const getAllAttractions = async (): Promise<Attraction[]> =>
  await AttractionModel.find({});

export const getAttractionById = async (
  attractionId: string
): Promise<DocumentType<Attraction> | null> =>
  await AttractionModel.findById(attractionId).populate("operator").exec();

export const rideAttraction = async (
  attraction: DocumentType<Attraction>,
  customer: DocumentType<Customer>
): Promise<void> => {
  attraction.visitors++;
  attraction.usagesSinceLastMaintenance++;
  void attraction.save();
  customer.credits -= attraction.price;
  await customer.save();
};
