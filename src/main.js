// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vuex from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import request from './request/api/requestMethods'
//element-ui组件引入文件
import './globalJs/elementJs'

Vue.config.productionTip = false
Vue.prototype.$request = request

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  vuex,
  render: c => c(App)
})
