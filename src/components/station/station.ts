import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import VueScrollTo from 'vue-scrollto';
import { Station } from '../../types';
import Services from '../services/Services.vue';
import NearestStationBanner from '../nearest-station-banner/NearestStationBanner.vue';
import { stationModule } from '@/store/station-module';
import { locationModule } from '@/store/location-module';
import { MAP_ID } from '@/constants';
Vue.use(VueScrollTo);

@Component({
  name: 'Station',
  components: {
    Services,
    NearestStationBanner,
  },
})
export default class StationItem extends Vue {
  @Prop({ type: Object as () => Station })
  station: Station | undefined;
  mapId = MAP_ID;

  get selectedStation() {
    return stationModule.selectedStation;
  }

  isSelected(): boolean {
    return stationModule.selectedStation === this.station;
  }

  isNearestStation(): boolean {
    if (locationModule.userLocation && stationModule.stations) {
      return stationModule.stations[0] === this.station;
    }
    return false;
  }

  onStationClicked(station: Station) {
    stationModule.setCurrentStation({ station });
  }
}
