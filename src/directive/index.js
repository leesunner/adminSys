import Vue from 'vue'
import _sessions from '../tools/sessionTool'
//自定义指令控制按钮的显示和隐藏 v-power='boolean值'
Vue.directive('buttonP', {
  inserted: function (el, binding, vnode) {
    console.log('指令进来')
    const PERMISSION = _sessions.getSessoin('buttonPermission')
    if (PERMISSION && PERMISSION.length > 0) {
      for (let i = 0; i < PERMISSION.length; i++) {
        if (PERMISSION[i].buttonCode === binding.value) {
          //查到在按钮权限中，优化代码直接打断循环
          break
        } else {
          i === PERMISSION.length - 1 ? el.parentNode.removeChild(el) : ''
        }
      }
    } else {
      el.parentNode.remove()
    }
  }
})
