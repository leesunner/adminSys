import router from './routerConfig/routerSource';
import pages from "./routerConfig/pageList";

//路由全局拦截器
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  // const RoutersArr = permissionRouters(routeObj)
  // router.addRoutes(RoutersArr)
  next()
})

export default router
