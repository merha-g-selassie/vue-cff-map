import Vue from 'vue';
import { Service } from '@/types';
import { Component, Prop } from 'vue-property-decorator';

@Component({ name: 'Services' })
export default class Services extends Vue {
  @Prop({ type: Array as () => Service[], default: () => [] })
  services!: Service[];

  TICKET_MACHINE = Service.TICKET_MACHINE;
  LOCKERS = Service.LOCKERS;
  WIFI = Service.WIFI;
  PARK_AND_RIDE = Service.PARK_AND_RIDE;
}
