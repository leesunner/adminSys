import router from './routerConfig/routerSource';
import {permissionRouters} from '../tools/routerTool';
import _session from '../tools/sessionTool';
import store from '../store/index';

//路由全局拦截器
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  //获取和解析路由列表
  if (to.path === '/' || to.path === '/login') {
    next()
  } else {
    const USER_INFO = _session.getSessoin('USER_INFO')
    const ROUTERS_LIST = _session.getSessoin('ROUTERS_LIST')
    const routerTree = store.state.login.ROUTERS_LIST
    if (!ROUTERS_LIST) {
      _session.setSession('ROUTERS_LIST',routerTree)
      addRouterData(routerTree)
      next('/index')
    } else {
      if(routerTree.length<=0){
        addRouterData(ROUTERS_LIST)
        store.state.login.ROUTERS_LIST = ROUTERS_LIST
        store.state.login.USER_INFO = USER_INFO
        next('/index')
      }else{
        next()
      }
    }
  }
})
function addRouterData(data){
  let RoutersArr = permissionRouters(data)
  router.addRoutes(RoutersArr)
}
export default router
