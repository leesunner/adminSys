import router from './routerConfig/routerSource';
import _session from '../tools/sessionTool';
import store from '../store/index';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {setCacheInfo,getCacheInfo} from '../tools/utilTools';
// 配置NProgress进度条选项 —— 动画效果
NProgress.configure({ease: 'ease', speed: 300})
// const routerCross = ['/login']

//路由全局拦截器
router.beforeEach((to, from, next) => {
  NProgress.start()
  document.title = to.meta.title
  //获取和解析路由列表
  const ROUTERS_LIST = getCacheInfo('ROUTERS_LIST')
  const routerTree = store.state.login.ROUTERS_LIST
  //未登陆(或登录过期)
  if (!ROUTERS_LIST) {
    if(!(from.path==='/'||from.path ==='/login')){
      //为了解决退出登录时，动态路由信息不清除的问题
      location.reload()
    }else{
      // clearLocalData()
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
      store.dispatch('routerTree').then(res => {
        //刷新时动态路由记录的name是404，但路由path是刷新的页面路由，默认next()跳转的是name路由，现指定刷新页面路由不变
        const data = getCacheInfo('MENU_ITEM')
        if (data){
          store.commit('setMenuNavTabs',{
            type: 'add',//remove
            value: data,
          })
        }
        next(to.path)
      }).catch(error=>{
        NProgress.done()
      })
    } else {
      if(to.path==='/login'||to.path==='/'){
        clearLocalData()
        location.reload()
      }else{
        //更新每次停留的路由信息
        let data = {url:to.path,menuName:to.name}
        setCacheInfo('MENU_ITEM',data)
        next()
      }
    }
  }
})
//清楚数据
function clearLocalData(){
  _session.clearSession()
  _session.clearLocalStorage()
  store.commit('setRouterTree',[])
}

router.afterEach((to, from) => {
  NProgress.done()
})
export default router
