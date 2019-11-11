import Vue from 'vue'
import vueRouter from 'vue-router'
import pages from './routerPage'
Vue.use(vueRouter)

const router= new vueRouter({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: pages.Login
    }
  ]
})

//路由全局拦截器
router.beforeEach((to,from, next) => {
  console.log(to)
  next()
})

export default router
