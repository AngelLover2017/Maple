import Vue from 'vue';
import App from './App.vue';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
// import electronVue from './libs/electronVue'


Vue.config.productionTip = false
// Vue.use(electronVue)
Vue.use(ViewUI);

new Vue({
  render: h => h(App),
}).$mount('#app');

