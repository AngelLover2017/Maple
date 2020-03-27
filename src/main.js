import Vue from 'vue'
import App from './App.vue'
import electronVue from './libs/electronVue'


Vue.config.productionTip = false
Vue.use(electronVue)

new Vue({
  render: h => h(App),
}).$mount('#app')
