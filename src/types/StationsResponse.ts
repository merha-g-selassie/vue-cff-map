export interface StationsResponse<T = ServicePoint> {
  total_count: number;
  results: T[];
}

export interface ServicePoint {
  designationofficial: string;
  number: number;
  abbreviation?: string | null;
  categories?: string | null;
  localityname?: string | null;
  cantonname?: string | null;
  geopos?: {
    lat: number;
    lon: number;
  } | null;
}

export interface TicketMachine {
  bps?: string | null;
}

export interface WifiStation {
  bpuic?: number | null;
}

export interface StationFurniture {
  bpuic?: string | number | null;
  bezeichnung: string;
}
