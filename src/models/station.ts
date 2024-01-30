import { type Attraction } from "./attraction";
import { type LogisticStaff } from "./staff";
import * as attractionsService from "../services/attractions";
import { type DocumentType } from "@typegoose/typegoose";

export class Station {
  name: string;
  private _open: boolean = false;
  attractions?: Attraction[];
  employee?: DocumentType<LogisticStaff>;

  public static initialStations = [
    "central",
    "east",
    "west",
    "north",
    "south",
  ].map((name) => new Station(name));

  constructor(name: string) {
    this.name = name;
  }

  get open(): boolean {
    return this._open;
  }

  async openStation(employee: DocumentType<LogisticStaff>): Promise<void> {
    employee.available = false;
    this.employee = employee;
    await employee.save();
    this._open = true;
    void this.updateAttractions();
  }

  closeStation(): void {
    if (this.employee !== undefined) {
      this.employee.available = true;
      void this.employee.save();
    }
    this.employee = undefined;
    this._open = false;
  }

  async updateAttractions(): Promise<void> {
    this.attractions = await attractionsService.getAllAttractions();
  }
}
