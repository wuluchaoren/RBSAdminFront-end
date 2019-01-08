// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from 'axios'


Vue.use(iView);
Vue.prototype.$http = axios
Vue.prototype.$axios = axios
Vue.use(ElementUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  created(){
    axios.defaults.baseURL='http://119.29.24.35:8000//'
    // axios.defaults.baseURL='http://ncg4bc.natappfree.cc//'
  }
})
