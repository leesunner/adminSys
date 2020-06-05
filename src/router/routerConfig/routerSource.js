import Vue from 'vue'
import vueRouter from 'vue-router'
import pages from './publicRouter'

//解决点击相同路由是报错的问题
const routerPush = vueRouter.prototype.push
vueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
Vue.use(vueRouter)

const RouterSource = new vueRouter({
  routes: pages
})

export default RouterSource
