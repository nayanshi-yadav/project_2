import Vue from 'vue'
import App from './App.vue'
import './../node_modules/bulma/css/bulma.css';
import VueGeolocation from "vue-browser-geolocation";
Vue.use(VueGeolocation);
Vue.config.productionTip = false

require('@/assets/main.scss');

new Vue({
  render: h => h(App)
}).$mount('#app')
