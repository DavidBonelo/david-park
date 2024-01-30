import { type RequestHandler } from "express";
import { asyncHandler } from "../utils";
import * as attractionsService from "../services/attractions";

export const getAllAttractions: RequestHandler = asyncHandler(
  async (_req, res) => {
    const attractions = await attractionsService.getAllAttractions();
    res.json(attractions);
  }
);
