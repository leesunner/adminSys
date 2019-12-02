import request from '@/request'
//引入接口列表
import apiList from "@/request/api/apiList";
import _session from '../../tools/sessionTool'
import router from '../../router'
import {permissionRouters} from '../../tools/routerTool'

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
    Login({dispatch,commit}) {
      return request.get(apiList.login, {params:arguments[1]}).then(res => {
        if (res) {
          _session.setSession('USER_INFO', res.data.data)
          commit('setUserInfo', res.data.data)
          return dispatch('routerTree')
        }
      })
    },
    //手机号登录
    LoginByPhone({dispatch,commit}) {
      return request.get(apiList.loginByPhone, {params:arguments[1]}).then(res => {
        if (res){
          _session.setSession('USER_INFO', res.data.data)
          commit('setUserInfo', res.data.data)
          return dispatch('routerTree')
        }
      })
    },
    //登出
    loginOut() {
      _session.clearSession('USER_INFO')
      _session.clearSession('ROUTERS_LIST')
      router.go(0)
    },
    //获取路由树
    async routerTree({dispatch, commit, state}) {
      //为了刷新时正确使用数据
      let userInfo = _session.getSessoin('USER_INFO')
      if (userInfo){
        commit('setUserInfo', userInfo)
      }
      return request.get(`${apiList.menu}/user/${userInfo.id}`).then(res => {
        const arr = [
          {
            url: '/main',
            menuName: 'main',
            menuPath: 'views/Main',
            redirect: '/index',
            children: [
              {
                url: '/index',
                menuName: '首页',
                menuPath: 'views/Index',
                title: '首页',
                children: null,
              },
            ],
          },
        ]
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
