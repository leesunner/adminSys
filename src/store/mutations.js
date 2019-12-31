import route from '../router';
export default {
  //设置内容区打开的导航菜单
  setMenuNavTabs(state, data) {
    let itemIndex, arr = state.menuNavTabs;
    if (data.type == 'remove') {
      //处理删除tab时
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].url === data.value) {
          itemIndex = i;
          break
        }
      }
      arr.splice(itemIndex, 1)
      //跳转对应路由
      arr.length <1 ? route.push('/index'):route.push(arr[0].url)
    } else {
      if (data.value.url !== '/index') {
        //非首页显示tab，并过滤是否存在tab数组中
        let record = false
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].url === data.value.url) {
            record = true
            break
          }
        }
        record ? '' : arr.push(data.value)
      }
    }
  },
  setLeftControl(state, data){
    state.leftControl = data
  },
}
