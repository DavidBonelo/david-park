import { type DocumentType } from "@typegoose/typegoose";
import { type Attraction, AttractionModel } from "./attraction";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;
let attraction: DocumentType<Attraction>;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  attraction = await AttractionModel.create({
    name: "Roller Coaster",
    classification: "Extreme",
    price: 10,
    usagesForMaintenance: 5,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Attraction", () => {
  test("should disable and save", async () => {
    await attraction.disableAndSave();
    expect(attraction.available).toBe(false);
    expect(attraction.operator).toBe(undefined);
  });

  it("should enable and save", async () => {
    await attraction.enableAndSave();
    expect(attraction.usagesSinceLastMaintenance).toBe(0);
    expect(attraction.available).toBe(true);
  });

  it("should increase visitors and save", async () => {
    const initialVisitors = attraction.visitors;
    await attraction.increaseVisitorsAndSave();
    expect(attraction.visitors).toBe(initialVisitors + 1);
  });
});
