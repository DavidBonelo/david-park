import { Park } from "../models/park";
import { type Station } from "../models/station";
import { NotFoundError } from "../utils/errors";

const park = Park.getInstance();

export const getStationByName = (name: string): Station => {
  const station = park.stations.find((station) => station.name === name);
  if (station === undefined) {
    throw new NotFoundError(`Station: ${name} not found`);
  }
  return station;
};
export const getAllStations = (): Station[] => park.stations;

export function updateStationsAttractions(): void {
  for (const station of getAllStations()) {
    if (station.open) {
      void station.updateAttractions();
    }
  }
}
