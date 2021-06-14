import { StationsService } from '@/services';
import { Station, CustomError } from '@/types';
import {
  Action,
  Module,
  Mutation,
  RegisterOptions,
  VuexModule,
} from 'vuex-class-modules';
import store from './index';
import { locationModule } from './location-module';

@Module
class StationModule extends VuexModule {
  private stationsService: StationsService;
  private allStations: Station[] = [];
  private requestError: CustomError | null = null;
  private station: Station | null = null;

  constructor(options: RegisterOptions) {
    super(options);
    this.stationsService = new StationsService();
  }

  get stations() {
    let processedStations = this.stationsService.aggregateStations(
      this.allStations,
    );

    if (locationModule.userLocation && this.allStations) {
      processedStations = this.stationsService.getStationsWithDistances(
        locationModule.userLocation,
        processedStations,
      );
    }

    return processedStations;
  }

  get selectedStation() {
    return this.station;
  }

  get error() {
    return this.requestError;
  }

  @Mutation
  private setStations(stations: Station[]) {
    this.allStations = stations;
  }

  @Mutation
  private setStation(station: Station) {
    this.station = station;
  }

  @Mutation
  private setError(error: CustomError | null) {
    this.requestError = error;
  }

  @Action
  async getStations(payload: {
    dataset: string;
    facet: string;
    nbRows: number;
    startAt: number;
  }) {
    this.setError(null);
    const res = await this.stationsService.getAllStations(
      payload.dataset,
      payload.facet,
      payload.nbRows,
      payload.startAt,
    );

    if (this.stationsService.isStations(res)) {
      this.setStations(res);
    } else {
      this.setError(res);
    }
  }

  @Action
  setCurrentStation(payload: { station: Station }) {
    this.setStation(payload.station);
  }
}

export const stationModule = new StationModule({ store, name: 'station' });
