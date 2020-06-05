import Vue from 'vue'
import _sessions from '../tools/sessionTool'
//自定义指令控制按钮的显示和隐藏 v-power='boolean值'
Vue.directive('buttonP', {
  update: function (el, binding, vnode) {
    const PERMISSION = _sessions.getSessoin('buttonPermission')
    if (PERMISSION){
      if (PERMISSION.length>0){
        for (let i = 0; i < PERMISSION.length; i++) {
          if (PERMISSION[i].buttonCode === binding.value) {
            //查到在按钮权限中，优化代码直接打断循环
            break
          } else {
            i === PERMISSION.length - 1 ? (el.parentNode ? el.parentNode.removeChild(el) : '') : ''
          }
        }
      }else{
        //没有按钮权限全部移除
        el.parentNode.remove()
      }
    }
  }
})
