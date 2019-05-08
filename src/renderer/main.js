import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import Notify from '../renderer/components/Notification'
import VCalendar from 'v-calendar/lib/v-calendar.umd';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(Notify);
Vue.use(VCalendar, {
  paneWidth: 180,
  popoverAlign: 'bottom',
  popoverDirection: 'bottom'
});


/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
