import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// 自定义指令
import './directive'
// import 'element-ui/lib/theme-chalk/index.css'
import './assets/styles/global.css'
import request from './request/api/requestMethods'
//element-ui组件引入文件
import './elementComponents'
//element-ui样式变量覆盖文件
import './assets/styles/element-variables.scss'
//粒子背景效果
import VueParticles from 'vue-particles'
Vue.use(VueParticles)

Vue.config.productionTip = false
Vue.prototype.$request = request
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: c => c(App)
})
