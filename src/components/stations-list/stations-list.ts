import Vue from 'vue';
import Component from 'vue-class-component';
import Station from '../station/Station.vue';
import ErrorMessage from '../error-message/ErrorMessage.vue';
import Spinner from '../spinner/Spinner.vue';
import { stationModule } from '@/store/station-module';
import { DEFAULT_REQUEST_PAYLOAD } from '@/constants';

@Component({
  name: 'StationsList',
  components: {
    Station,
    Spinner,
    ErrorMessage,
  },
})
export default class StationsList extends Vue {
  get stations() {
    return stationModule.stations;
  }

  get error() {
    return stationModule.error;
  }

  reload() {
    stationModule.getStations(DEFAULT_REQUEST_PAYLOAD);
  }
}
