import request from '@/request/api/requestMethods'
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
    //登录
    Login({commit}) {
      // return request.get(apiList.login,arguments[1]).then(res=>{
      //   console.log('登录进来了')
      //   console.log(res.data)
      //   _session.setSession('USER_INFO',res.data)
      //   commit('setUserInfo', res.data)
      // })
      return new Promise((resolve, reject)=>{
        //模拟登录接口提交
        setTimeout(() => {
          console.log('登录进来了')
          const data = {userName:'小明'}
          _session.setSession('USER_INFO',data)
          commit('setUserInfo', data)
          resolve(data)
        }, 150)
      })
    },
    //登出
    loginOut() {
      _session.clearSession('USER_INFO')
      _session.clearSession('ROUTERS_LIST')
      router.push('login')
    },
    //获取路由树
    async routerTree({dispatch, commit, state}) {
      await dispatch('Login',arguments[1])
      return new Promise((resolve, reject)=>{
        //模拟菜单接口信息获取
        setTimeout(() => {
          const arr = [
            {
              path: '/main',
              name: 'main',
              filePath: 'views/Main',
              redirect:'/index',
              children: [
                {
                  path: '/index',
                  name: 'index',
                  filePath: 'views/Index',
                  title: '首页',
                  children: [],
                },
              ],
            },
          ]
          const resArrs = [{
            title: '角色权限',
            name: 'permissions',
            path: '/permissions',
            filePath: 'views/permission/permissionTree',
            children: [],
          },
            {
              title: '测试页面',
              path:'test1',
              children: [
                {
                  path: '/error',
                  name: 'error',
                  filePath: 'views/Error',
                  title: '没找到页面',
                  children: [],
                },
                {
                  title: '数据图表',
                  name: 'dataGraph',
                  path: '/dataGraph',
                  filePath: 'views/dataChart/persons',
                  children: [],
                }
              ]
            }]
          Array.prototype.push.apply(arr[0].children, resArrs)
          commit('setRouterTree', arr)
          permissionRouters(arr)
          _session.setSession('ROUTERS_LIST',arr)
          resolve()
        }, 450)
      })
    },
  }
}
