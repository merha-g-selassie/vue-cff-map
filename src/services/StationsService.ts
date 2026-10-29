import groupBy from 'lodash.groupby';
import map from 'lodash.map';
import sortBy from 'lodash.sortby';
import { StationsApi } from '@/api';
import { GeoLocation, ServicePoint, CustomError } from '@/types';
import { Station } from '@/types';
import { calculateDistance } from '@/utils';
import { requestError } from '@/utils';

export class StationsService {
  private stationsApi = StationsApi.getInstance();

  public async getAllStations(
    dataset: string,
    nbRows: number,
    startAt: number,
  ): Promise<Station[] | CustomError> {
    try {
      const servicePoints = await this.getStations(
        dataset,
        nbRows,
        startAt,
        [],
      );
      return this.convertStations(servicePoints);
    } catch (err) {
      return requestError(err);
    }
  }

  public aggregateStations = (stations: Station[]): Station[] => {
    const groupedStations = groupBy(stations, 'name');
    const mappedStations = map(groupedStations, (objs, key) => ({
      name: key,
      address: objs[0].address,
      mail: objs[0].mail,
      location: objs[0].location,
      service: Array.from(new Set(objs.map(obj => obj.service).flat())),
    }));

    return mappedStations;
  };

  public getStationsWithDistances(
    userLocation: GeoLocation,
    stations: Station[],
  ): Station[] {
    const stationsWithDistances: Station[] = [];
    stations.forEach(station => {
      if (station.location && userLocation) {
        const distance = this.getDistanceFromUser(
          userLocation,
          station.location,
        );
        const newStation: Station = {
          distanceFromUser: distance,
          ...station,
        };
        stationsWithDistances.push(newStation);
      }
    });

    return sortBy(stationsWithDistances, station => station.distanceFromUser);
  }

  public isStations(station: Station[] | CustomError): station is Station[] {
    return Array.isArray(station as Station[]);
  }

  private getStations = async (
    dataset: string,
    nbRows: number,
    startAt: number,
    results: ServicePoint[],
  ): Promise<ServicePoint[]> => {
    const res = await this.stationsApi.getStations(dataset, nbRows, startAt);
    const { results: records, total_count: totalCount } = res;
    const requestResults = [...results, ...records];

    if (startAt + nbRows < totalCount) {
      const newStartAt = startAt + nbRows;

      return await this.getStations(
        dataset,
        nbRows,
        newStartAt,
        requestResults,
      );
    }

    return requestResults;
  };

  private convertStations = (servicePoints: ServicePoint[]): Station[] => {
    return servicePoints.map(servicePoint => this.convertStation(servicePoint));
  };

  private convertStation = (servicePoint: ServicePoint): Station => {
    const { geopos, localityname, cantonname } = servicePoint;
    return {
      name: servicePoint.designationofficial,
      mail: '',
      address: [localityname, cantonname].filter(Boolean).join(', '),
      location: geopos ? { latitude: geopos.lat, longitude: geopos.lon } : null,
      service: [],
    };
  };

  private getDistanceFromUser(
    userLocation: GeoLocation,
    stationLocation: GeoLocation,
  ): number {
    return calculateDistance(userLocation, stationLocation);
  }
}
