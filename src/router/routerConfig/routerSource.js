import Vue from 'vue'
import vueRouter from 'vue-router'
import pages from './pageList'

//解决点击相同路由是报错的问题
const routerPush = vueRouter.prototype.push
vueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

Vue.use(vueRouter)

const RouterSource = new vueRouter({
  routes: [
    {
      path: '/',
      name: '/',
      redirect: '/login',
      meta: {
        title: '百问数据系统'
      },
    },
    {
      path: '/login',
      name: 'login',
      component: pages.Login,
      meta: {
        title: '系统登录页'
      },
    },
    {
      path: '*',
      name: '404',
      component: pages.ErrorPage,
      meta: {
        title: '没找到页面'
      },
    },
  ]
})

export default RouterSource
