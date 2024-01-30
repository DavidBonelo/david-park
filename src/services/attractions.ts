import { type Attraction, AttractionModel } from "../models/attraction";

export const getAllAttractions = async (): Promise<Attraction[]> =>
  await AttractionModel.find({});
