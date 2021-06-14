import Vue from 'vue';
import { Service } from '@/types';
import { Component, Prop } from 'vue-property-decorator';

@Component({ name: 'Services' })
export default class Services extends Vue {
  @Prop({ type: Array as () => Service[], default: () => [] })
  services!: Service[];

  LOUNGE = Service.LOUNGE;
  LUGGAGE = Service.LUGGAGE;
  MONEY_EXCHANGE = Service.MONEY_EXCHANGE;
}
