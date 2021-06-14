import { Action, Module, Mutation, VuexModule } from 'vuex-class-modules';
import { GeoLocation } from '@/types';
import { getLocation } from '@/utils/getLocation';
import store from './index';

@Module
class LocationModule extends VuexModule {
  private location: GeoLocation | null = null;

  get userLocation() {
    return this.location;
  }

  @Mutation
  private setUserLocation(location: GeoLocation) {
    this.location = location;
  }

  @Action
  async getUserLocation() {
    const location = await getLocation();
    if (location) {
      this.setUserLocation(location);
    }
  }
}

export const locationModule = new LocationModule({ store, name: 'location' });
