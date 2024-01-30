import { Park } from "../models/park";
import { type Station } from "../models/station";

const park = Park.getInstance();

export const getStationByName = (name: string): Station | undefined => {
  return park.stations.find((station) => station.name === name);
};
export const getAllStations = (): Station[] => park.stations;
