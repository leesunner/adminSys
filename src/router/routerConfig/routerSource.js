import Vue from 'vue'
import vueRouter from 'vue-router'
import pages from './pageList'
Vue.use(vueRouter)

const RouterSource = new vueRouter({
  routes: [
    {
      path: '/',
      name: '/',
      redirect:'/Login',
      meta:{
        title:'百问数据系统'
      },
    },
    {
      path: '/Login',
      name: 'Login',
      component: pages.Login,
      meta:{
        title:'系统登录页'
      },
    },
    {
      path: '/Index',
      name: 'Index',
      component: pages.Index,
      meta:{
        title:'首页'
      },
    },
    {
      path: '*',
      name: '404',
      component: pages.errorPage,
      meta:{
        title:'没找到页面'
      },
    },
  ]
})
export default RouterSource
