import request from '@/request';
//引入接口列表
import {apiList} from "@/request/api/apiList";
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
          _session.setSession('USER_INFO', res.data.data)
          _session.setSession('AUTH_TOKEN', res.data.data.accessToken)
          commit('setUserInfo', res.data.data)
          return dispatch('routerTree')
        }
      })
    },
    //手机号登录
    LoginByPhone({dispatch,commit},data) {
      return request.get(`${apiList.login}/phone`, {params:data}).then(res => {
        if (res){
          console.log('登录进来了')
          // _session.setSession('AUTH_TOKEN',res.data.data.token)
          _session.setSession('USER_INFO', res.data.data)
          commit('setUserInfo', res.data.data)
          return dispatch('routerTree')
        }
      })
    },
    //登出
    loginOut() {
      _session.clearSession()
      router.go(0)
    },
    //获取路由树
    routerTree({dispatch, commit, state}) {
      //为了刷新时正确使用数据
      let userInfo = _session.getSessoin('USER_INFO')
      if (userInfo){
        commit('setUserInfo', userInfo)
      }
      return request.get(`${apiList.menu}/user`).then(res => {
        //导入菜单公共页面路由
        const arr = menuRouter
        if (res.data.data[0]){
          Array.prototype.push.apply(arr[0].children, res.data.data[0].children)
        }
        commit('setRouterTree', arr)
        permissionRouters(arr)
        _session.setSession('ROUTERS_LIST', arr)
      })
    },
  }
}
