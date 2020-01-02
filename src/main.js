import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from 'axios'
import qs from 'qs'

Vue.config.productionTip = false;
//  加载请求插件
Vue.prototype.$axios = axios
Vue.prototype.qs = qs

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
