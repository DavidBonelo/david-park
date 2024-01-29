import { Station } from "./station";

export class Park {
  private static instance: Park;

  stations: Station[];

  private constructor() {
    this.stations = [
      new Station("central", true),
      new Station("east", false),
      new Station("west", false),
      new Station("north", false),
      new Station("south", false),
    ];
  }

  public static getInstance(): Park {
    if (typeof Park.instance === "undefined") {
      Park.instance = new Park();
    }
    return Park.instance;
  }

  getOpenStations(): number {
    return this.stations.reduce((prev, cur) => (cur.open ? prev + 1 : prev), 0);
  }
}
