import { Park } from "./park";

describe("Park", () => {
  const park = Park.getInstance();
  test("stations are created", () => {
    expect(park.stations.length).toBe(5);
  });

  test("central station is open", () => {
    expect(park.stations[0].name).toBe("central");
    expect(park.stations[0].open).toBe(true);
    expect(park.getOpenStations()).toBe(1);
  });

  test("required stations is 0", () => {
    expect(park.getRequiredStations()).toBe(0);
  });

  test("add visitor", () => {
    park.addVisitor();
    expect(park.visitors).toBe(1);
  });

  test("required stations is 1", () => {
    expect(park.getRequiredStations()).toBe(1);
  });
});
