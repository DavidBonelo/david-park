import { Station } from "./station";

export class Park {
  private static instance: Park;
  private _visitors = 0;
  private readonly maxVisitors = 10;

  public get visitors(): number {
    return this._visitors;
  }

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

  getRequiredStations(): number {
    return Math.ceil(
      this._visitors / (this.maxVisitors / this.stations.length)
    );
  }

  getOpenStations(): number {
    return this.stations.reduce((prev, cur) => (cur.open ? prev + 1 : prev), 0);
  }

  addVisitor(): void {
    if (this._visitors >= this.maxVisitors) {
      throw new Error("Park is full");
    }

    if (this.getRequiredStations() > this.getOpenStations()) {
      // call to open a new Station
    }
    this._visitors++;
    console.table({ visitors: this._visitors });
  }

  removeVisitor(): void {
    if (this.getRequiredStations() < this.getOpenStations()) {
      // call to close an open Station
    }
    this._visitors--;
  }
}
