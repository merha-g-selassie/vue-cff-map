import { GeoLocation } from './GeoLocation';
import { Service } from './Service';

export type Station = {
  name: string;
  address: string;
  mail: string;
  service: Service[];
  location: GeoLocation | null;
  distanceFromUser?: number;
};
