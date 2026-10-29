export interface StationsResponse {
  total_count: number;
  results: ServicePoint[];
}

export interface ServicePoint {
  designationofficial: string;
  localityname?: string | null;
  cantonname?: string | null;
  geopos?: {
    lat: number;
    lon: number;
  } | null;
}
