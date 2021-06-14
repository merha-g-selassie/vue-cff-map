import Vue from 'vue';
import Component from 'vue-class-component';
import { locationModule } from '@/store/location-module';
import { stationModule } from '@/store/station-module';
import {
  HOME_TITLE,
  HOME_SUBTITLE,
  DEFAULT_REQUEST_PAYLOAD,
} from '@/constants';
import Map from '../map/GoogleMap.vue';
import StationsList from '../stations-list/StationsList.vue';
import SbbLogo from '../sbb-logo/SbbLogo.vue';

@Component({
  name: 'Container',
  components: {
    Map,
    StationsList,
    SbbLogo,
  },
})
export default class Container extends Vue {
  title = HOME_TITLE;
  subtitle = HOME_SUBTITLE;
  get userLocation() {
    return locationModule.userLocation;
  }

  async created() {
    await locationModule.getUserLocation();
    await stationModule.getStations(DEFAULT_REQUEST_PAYLOAD);
  }
}
