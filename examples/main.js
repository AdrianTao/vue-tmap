import Vue from 'vue'
import App from './App.vue'

import VueTMap from '../src/index'

Vue.use(VueTMap, {
  key: 'd9c77c5a27476f013670171941a157c5',
  v: '4.0'
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
