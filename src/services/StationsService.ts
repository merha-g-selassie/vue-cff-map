import groupBy from 'lodash.groupby';
import map from 'lodash.map';
import sortBy from 'lodash.sortby';
import { StationsApi } from '@/api';
import {
  BUSINESS_TRAVEL_SERVICE_CENTER,
  GELDWESCHEL,
  GEPACKAUFBEWAHRUNG,
  GEPACKAUSGABE,
  WESTERN_UNION,
} from '@/constants';
import { GeoLocation, Record, Service, CustomError } from '@/types';
import { Station } from '@/types';
import { calculateDistance } from '@/utils';
import { requestError } from '@/utils';

export class StationsService {
  private stationsApi = StationsApi.getInstance();

  public async getAllStations(
    dataset: string,
    facet: string,
    nbRows: number,
    startAt: number,
  ): Promise<Station[] | CustomError> {
    try {
      const records = await this.getStations(
        dataset,
        facet,
        nbRows,
        startAt,
        [],
      );
      const filteredStations = this.removeUselessServices(records);
      const convertedStations = this.convertStations(filteredStations);
      return convertedStations;
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
    facet: string,
    nbRows: number,
    startAt: number,
    results: Record[],
  ): Promise<Record[]> => {
    const res = await this.stationsApi.getStations(
      dataset,
      facet,
      nbRows,
      startAt,
    );
    const { records, nhits } = res;
    const requestResults = [...results, ...records];

    if (startAt + nbRows < nhits) {
      const newStartAt = startAt + nbRows;

      return await this.getStations(
        dataset,
        facet,
        nbRows,
        newStartAt,
        requestResults,
      );
    }

    return requestResults;
  };

  private removeUselessServices = (records: Record[]): Record[] => {
    const res = records.filter(record => {
      return (
        record.fields.service === GEPACKAUFBEWAHRUNG ||
        record.fields.service === GEPACKAUSGABE ||
        record.fields.service === BUSINESS_TRAVEL_SERVICE_CENTER ||
        record.fields.service === GELDWESCHEL ||
        record.fields.service === WESTERN_UNION
      );
    });
    return res;
  };

  private convertStations = (records: Record[]): Station[] => {
    const convertedStations = records.map(record =>
      this.convertStation(record),
    );

    return convertedStations;
  };

  private convertStation = (record: Record): Station => {
    const { fields } = record;

    return {
      name: fields.bezeichnung_offiziell,
      mail: fields.mail || '',
      address: this.createAddress(fields.plz, fields.ort, fields.adresse),
      location: this.createLocation(fields.geopos),
      service: [this.mapServices(fields.service)],
    };
  };

  private getDistanceFromUser(
    userLocation: GeoLocation,
    stationLocation: GeoLocation,
  ): number {
    return calculateDistance(userLocation, stationLocation);
  }

  private createAddress = (
    postcode: number,
    location: string,
    address?: string,
  ): string => {
    const fullAddress = `${address || ''} ${postcode} ${location}`;

    return fullAddress;
  };

  private createLocation = (location: number[]): GeoLocation | null => {
    if (location.length === 2) {
      return {
        latitude: location[0],
        longitude: location[1],
      };
    } else {
      return null;
    }
  };

  private mapServices = (service: string): Service => {
    if (service === GEPACKAUFBEWAHRUNG || service === GEPACKAUSGABE) {
      return Service.LUGGAGE;
    } else if (service === BUSINESS_TRAVEL_SERVICE_CENTER) {
      return Service.LOUNGE;
    }
    return Service.MONEY_EXCHANGE;
  };
}
