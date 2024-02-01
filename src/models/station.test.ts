import { Park } from "./park";

const park = Park.getInstance();
describe("Station", () => {
  test("stations are created", () => {
    expect(park.stations[0].name).toBe("central");
    expect(park.stations[1].name).toBe("east");
    expect(park.stations[2].name).toBe("west");
    expect(park.stations[3].name).toBe("north");
    expect(park.stations[4].name).toBe("south");
  });
});
