import Vue from 'vue';
import App from './App';
import router from './router';
import api from './http';
import i18n from './i18n';
import store from './store';
import global from '@/utils/global';
//import qs from "qs";
import 'echarts'
import VueCompositionAPI from '@vue/composition-api';
import VCharts from 'vue-echarts';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';
import '@/assets/iconfont/iconfont.css';

Vue.use(ElementUI);
Vue.use(api);
Vue.prototype.global = global;
//配全局属性配置，在任意组件内可以使用this.$qs获取qs对象 
//Vue.prototype.$qs = qs;
// 全局注册组件（也可以使用局部注册）
Vue.use(VueCompositionAPI);
Vue.component('v-chart', VCharts);

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
});