import router from './routerConfig/routerSource';
import {permissionRouters} from '../tools/routerTool';
import _session from '../tools/sessionTool';
import store from '../store/index';

//路由全局拦截器
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  if (to.path === '/' || to.path === '/login') {
    next()
  } else {
    //获取和解析路由列表
    const USER_INFO = _session.getSessoin('USER_INFO')
    const ROUTERS_LIST = _session.getSessoin('ROUTERS_LIST')
    const routerTree = store.state.login.ROUTERS_LIST
    //未登陆 拦截直接跳登陆界面（不想跳登陆界面可以不要这个if语句单独把else的拿出来跳error页）
    if (!ROUTERS_LIST) {
      next('/login')
    } else {
      //因为vuex里面的刷新页面会丢失数据，所以重新赋值
      if(routerTree.length<=0){
        permissionRouters(ROUTERS_LIST)
        store.state.login.ROUTERS_LIST = ROUTERS_LIST
        store.state.login.USER_INFO = USER_INFO
        next('/index')
      }else{
        next()
      }
    }
  }
})

export default router
