import { Park } from "./park";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

describe("Park", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  const park = Park.getInstance();

  test("stations are created", () => {
    expect(park.stations.length).toBe(5);
  });

  test("required stations is 0", () => {
    expect(park.getRequiredStations()).toBe(0);
  });

  test("add visitor", async () => {
    await park.addVisitor();
    expect(park.visitors).toBe(1);
  });

  test("required stations is 1", () => {
    expect(park.getRequiredStations()).toBe(1);
  });

  test("central station is open", () => {
    expect(park.stations[0].name).toBe("central");
    expect(park.stations[0].open).toBe(true);
    expect(park.getOpenStations()).toBe(1);
  });
});
