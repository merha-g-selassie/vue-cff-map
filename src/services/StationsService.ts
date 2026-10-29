import groupBy from 'lodash.groupby';
import map from 'lodash.map';
import sortBy from 'lodash.sortby';
import { StationsApi } from '@/api';
import {
  GeoLocation,
  ServicePoint,
  StationFurniture,
  TicketMachine,
  WifiStation,
  CustomError,
  Service,
} from '@/types';
import {
  STATION_FURNITURE_DATASET,
  TICKET_MACHINE_DATASET,
  WIFI_DATASET,
} from '@/constants';
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
      const [
        servicePoints,
        ticketMachines,
        wifiStations,
        lockers,
      ] = await Promise.all([
        this.getRecords<ServicePoint>(
          dataset,
          nbRows,
          startAt,
          [
            "isocountrycode='CH'",
            "meansoftransport='TRAIN'",
            "businessorganisationabbreviationde='SBB'",
            "stoppoint='true'",
            "operatingpointwithtimetable='true'",
          ].join(' AND '),
        ),
        this.getRecords<TicketMachine>(
          TICKET_MACHINE_DATASET,
          nbRows,
          startAt,
          "eigentumer='SBB Personenverkehr'",
        ).catch((): TicketMachine[] => []),
        this.getRecords<WifiStation>(
          WIFI_DATASET,
          nbRows,
          startAt,
          'bpuic IS NOT NULL',
        ).catch((): WifiStation[] => []),
        this.getRecords<StationFurniture>(
          STATION_FURNITURE_DATASET,
          nbRows,
          startAt,
          "bezeichnung='Schliessfächer'",
        ).catch((): StationFurniture[] => []),
      ]);
      return this.convertStations(
        servicePoints,
        new Set(
          ticketMachines
            .map(machine => machine.bps)
            .filter((code): code is string => Boolean(code)),
        ),
        new Set(
          wifiStations
            .map(station => station.bpuic)
            .filter(
              (bpuic): bpuic is number => bpuic !== null && bpuic !== undefined,
            ),
        ),
        new Set(
          lockers
            .map(locker => locker.bpuic)
            .filter(
              (bpuic): bpuic is string | number =>
                bpuic !== null && bpuic !== undefined,
            )
            .map(String),
        ),
      );
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

  private getRecords = async <T>(
    dataset: string,
    nbRows: number,
    startAt: number,
    where: string,
    results: T[] = [],
  ): Promise<T[]> => {
    const res = await this.stationsApi.getRecords<T>(
      dataset,
      nbRows,
      startAt,
      where,
    );
    const { results: records, total_count: totalCount } = res;
    const requestResults = [...results, ...records];

    if (startAt + nbRows < totalCount) {
      const newStartAt = startAt + nbRows;

      return await this.getRecords(
        dataset,
        nbRows,
        newStartAt,
        where,
        requestResults,
      );
    }

    return requestResults;
  };

  private convertStations = (
    servicePoints: ServicePoint[],
    ticketMachineCodes: Set<string>,
    wifiBpuics: Set<number>,
    lockerBpuics: Set<string>,
  ): Station[] => {
    return servicePoints.map(servicePoint =>
      this.convertStation(
        servicePoint,
        ticketMachineCodes,
        wifiBpuics,
        lockerBpuics,
      ),
    );
  };

  private convertStation = (
    servicePoint: ServicePoint,
    ticketMachineCodes: Set<string>,
    wifiBpuics: Set<number>,
    lockerBpuics: Set<string>,
  ): Station => {
    const { geopos, localityname, cantonname } = servicePoint;
    const services: Service[] = [];

    if (
      servicePoint.abbreviation &&
      ticketMachineCodes.has(servicePoint.abbreviation)
    ) {
      services.push(Service.TICKET_MACHINE);
    }
    if (wifiBpuics.has(servicePoint.number)) {
      services.push(Service.WIFI);
    }
    if (lockerBpuics.has(String(servicePoint.number))) {
      services.push(Service.LOCKERS);
    }
    if (servicePoint.categories?.split('|').includes('PARK_AND_RAIL')) {
      services.push(Service.PARK_AND_RIDE);
    }

    return {
      name: servicePoint.designationofficial,
      mail: '',
      address: [localityname, cantonname].filter(Boolean).join(', '),
      location: geopos ? { latitude: geopos.lat, longitude: geopos.lon } : null,
      service: services,
    };
  };

  private getDistanceFromUser(
    userLocation: GeoLocation,
    stationLocation: GeoLocation,
  ): number {
    return calculateDistance(userLocation, stationLocation);
  }
}
