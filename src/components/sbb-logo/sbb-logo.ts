import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { LOGO_TEXT } from '@/constants';

@Component({ name: 'SbbLogo' })
export default class SbbLogo extends Vue {
  text = LOGO_TEXT;
}
