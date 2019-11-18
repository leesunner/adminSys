import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/Login'
import GETTERS from './gettes'
import MUTATIONS from './mutations'
Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
    menuNavTabs:[],//存放导航信息列表
  },
  getters:GETTERS,
  mutations:MUTATIONS,
  modules:{login}
})
export default store
