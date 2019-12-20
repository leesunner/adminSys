import router from './routerConfig/routerSource';
import _session from '../tools/sessionTool';
import store from '../store/index';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
// 配置NProgress进度条选项 —— 动画效果
NProgress.configure({ease: 'ease', speed: 300})
// const routerCross = ['/login']

//路由全局拦截器
router.beforeEach((to, from, next) => {
  NProgress.start()
  document.title = to.meta.title
  //获取和解析路由列表
  const ROUTERS_LIST = _session.getLocalStorage('ROUTERS_LIST')
  const routerTree = store.state.login.ROUTERS_LIST
  //未登陆
  if (!ROUTERS_LIST) {
    if(!(from.path==='/'||from.path ==='/login')){
      //为了解决退出登录时，动态路由信息不清除的问题
      location.reload()
    }else{
      _session.clearSession()
      _session.clearLocalStorage()
      //login和首次进来的直接过
      if (to.path==='/login'||to.path==='/'){
        next()
      }else{
        //其它未登录的都跳登录
        next('/login')
      }
    }
  } else {
    //已登录（或已登录刷新）
    //因为vuex里面的刷新页面会丢失数据，所以重新赋值
    if (routerTree.length <= 0) {
      _session.setLocalStorage('ROUTERS_LIST', null)
      store.dispatch('routerTree').then(res => {
        next('/index')
      }).catch(error=>{
        NProgress.done()
      })
    } else {
      next()
    }
  }
})

router.afterEach((to, from) => {
  NProgress.done()
})
export default router
