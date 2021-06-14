import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { stationModule } from '@/store/station-module';

@Component({
  name: 'ErrorMessage',
})
export default class ErrorMessage extends Vue {
  get error() {
    return stationModule.error;
  }

  retry() {
    this.$emit('reload');
  }
}
