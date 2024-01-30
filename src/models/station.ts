import { type Attraction } from "./attraction";
import { type LogisticStaff } from "./staff";
import * as attractionsService from "../services/attractions";

export class Station {
  name: string;
  private _open: boolean = false;
  attractions?: Attraction[];
  employee?: LogisticStaff;

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

  openStation(): void {
    if (this.employee === undefined) {
      throw new Error(`Can't open station ${this.name}: No employee assigned`);
    }
    this._open = true;
    void this.updateAttractions();
  }

  closeStation(): void {
    this._open = false;
  }

  async updateAttractions(): Promise<void> {
    this.attractions = await attractionsService.getAllAttractions();
  }
}
