import Vue from 'vue'
import _sessions from '../tools/sessionTool'
//自定义指令控制按钮的显示和隐藏 v-power='boolean值'
Vue.directive('power', {
  inserted: function (el, binding, vnode) {
    const PERMISSION = _sessions.getSessoin('buttonPermission')
    // if (PERMISSION) {
    //   if (PERMISSION.name != binding.value) {
    //     el.parentNode.removeChild(el)
    //   }
    // } else {
    //   el.parentNode.remove()
    // }
  }
})
