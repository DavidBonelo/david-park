import * as staffService from "../services/staff";
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
    this.stations = Station.initialStations;
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

  getClosedStation(): Station | undefined {
    return this.stations.find((station) => !station.open);
  }

  async openStation(): Promise<void> {
    const station = this.getClosedStation();
    if (station === undefined) {
      console.warn("No more stations to open");
      return;
    }
    const admin = await staffService.getFreeAdminStaff();
    const logistic = await staffService.getFreeLogisticStaff();
    if (admin != null && logistic != null)
      await admin.openStation(station, logistic);
  }

  async addVisitor(): Promise<void> {
    if (this._visitors >= this.maxVisitors) {
      throw new Error("Park is full");
    }

    if (this.getRequiredStations() > this.getOpenStations()) {
      await this.openStation();
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
