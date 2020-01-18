import request from '@/request';
//引入接口列表
import {apiList} from "@/request/api/apiList";
import {setCacheInfo,getCacheInfo} from '../../tools/utilTools';
import _session from '../../tools/sessionTool';
import router from '../../router';
import {Notification} from 'element-ui';
import {permissionRouters} from '../../tools/routerTool';
import menuRouter from '@/router/routerConfig/menuRouter';

export default {
  state: {
    ROUTERS_LIST: [],
    USER_INFO: null,
  },
  getters: {
    getUserInfo(state) {
      return state.USER_INFO
    },
    getRouterTree(state) {
      return state.ROUTERS_LIST
    }
  },
  mutations: {
    setUserInfo(state, data) {
      state.USER_INFO = data
    },
    setRouterTree(state, data) {
      state.ROUTERS_LIST = data
    }
  },
  actions: {
    //用户名登录
    Login({dispatch,commit},data) {
      return request.get(apiList.login, {params:data}).then(res => {
        if (res) {
          Notification.success({
            message:'登录成功',
            duration:1500,
            offset:35,
          })
          //设置登录时间（用来限制菜单树刷新页面接口的频繁请求）
          setCacheInfo('LOGIN_TIME', new Date().getTime())
          setCacheInfo('USER_INFO', res.data.data)
          setCacheInfo('AUTH_TOKEN', res.data.data.accessToken)
          commit('setUserInfo', res.data.data)
          return dispatch('routerTree')
        }
      })
    },
    //手机号登录
    LoginByPhone({dispatch,commit},data) {
      return request.get(`${apiList.login}/phone`, {params:data}).then(res => {
        if (res){
          Notification.success({
            message:'登录成功',
            duration:1500,
            offset:35,
          })
          //设置登录时间
          setCacheInfo('LOGIN_TIME', new Date().getTime())
          setCacheInfo('AUTH_TOKEN', res.data.data.accessToken)
          setCacheInfo('USER_INFO', res.data.data)
          commit('setUserInfo', res.data.data)
          return dispatch('routerTree')
        }
      })
    },
    //登出
    loginOut() {
      request.get(apiList.loginOut)
      setTimeout(()=>{
        _session.clearSession()
        _session.clearLocalStorage()
        router.go(0)
      },5)
    },
    //获取路由树
    routerTree({dispatch, commit, state}) {
      //为了刷新时正确使用数据
      let userInfo = getCacheInfo('USER_INFO')
      let tree = getCacheInfo('ROUTERS_LIST')
      if (userInfo){
        //新开页面保持登录信息
        let token = getCacheInfo('AUTH_TOKEN')
        setCacheInfo('AUTH_TOKEN',token)
        commit('setUserInfo', userInfo)
      }
      //获取之前登录的时间
      let time = getCacheInfo('LOGIN_TIME'),nowTime = new Date().getTime();
      //1800000ms=30分钟
      if (nowTime-time>1800000){
        setCacheInfo('ROUTERS_LIST',null)
        tree = getCacheInfo('ROUTERS_LIST')
      }
      //超过半小时的 刷新重新请求接口
      if (!tree||tree == 'null'){
        //需要重新获取数据后，重置时间
        setCacheInfo('LOGIN_TIME', new Date().getTime())
        return request.get(`${apiList.menu}/user`).then(res => {
          //导入菜单公共页面路由
          const arr = menuRouter
          if (res.data.data[0]){
            //加到main路由中去
            Array.prototype.push.apply(arr[0].children, res.data.data[0].children)
          }
          commit('setRouterTree', arr)
          permissionRouters(arr)
          setCacheInfo('ROUTERS_LIST', arr)
        })
      }else{
        commit('setRouterTree', tree)
        permissionRouters(tree)
        return Promise.resolve(true)
      }
    },
  }
}
