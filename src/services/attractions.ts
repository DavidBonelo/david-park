import { type DocumentType } from "@typegoose/typegoose";
import { type Attraction, AttractionModel } from "../models/attraction";
import { type Customer } from "../models/customer";
import { type OperatorStaff } from "../models/staff";
import { BadRequestError } from "../utils/errors";
import { startSession } from "mongoose";

export const getAllAttractions = async (): Promise<Attraction[]> =>
  await AttractionModel.find({}).populate("operator");

export const getAllAttractionsSorted = async (): Promise<
  Array<DocumentType<Attraction>>
> => await AttractionModel.find({}).sort({ visitors: "descending" });

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

export async function updateAttractionOperator(
  attraction: DocumentType<Attraction>,
  operator: DocumentType<OperatorStaff>
): Promise<void> {
  const session = await startSession();
  session.startTransaction();
  try {
    if (!operator.available) {
      throw new BadRequestError("Operator is not available");
    }
    if (attraction.operator !== undefined) {
      const oldOperator = attraction.operator as DocumentType<OperatorStaff>;
      oldOperator.available = true;
      await oldOperator.save({ session });
    }
    operator.available = false;
    await operator.save({ session });
    attraction.operator = operator;
    await attraction.save({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}

export async function removeAttractionOperator(
  attraction: DocumentType<Attraction>
): Promise<void> {
  if (attraction.operator !== undefined) {
    const operator = attraction.operator as DocumentType<OperatorStaff>;
    operator.available = true;
    await operator.save();
    attraction.operator = undefined;
    await attraction.save();
  }
}
