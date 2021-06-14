import Vue from 'vue';
import Vuex, { createLogger } from 'vuex';
import { isProd } from '@/utils';
Vue.use(Vuex);

export default new Vuex.Store({
  strict: isProd,
  plugins: isProd ? [createLogger()] : [],
});
