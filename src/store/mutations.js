export default {
  //设置内容区打开的导航菜单
  setMenuNavTabs(state, data) {
    let itemIndex,arr = state.menuNavTabs;
    if (data.type == 'remove') {
      //处理删除tab时
      for(let i=0;i<arr.length;i++){
        if (arr[i].name === data.value) {
          itemIndex = i;
          break
        }
      }
      itemIndex > -1 ? state.menuNavTabs.splice(itemIndex, 1) : ''
    } else {
      if (data.value.path!=='/index'){
        //非首页显示tab，并过滤是否存在tab数组中
        let record = false
        for(let i=0;i<arr.length;i++){
          if (arr[i].title === data.value.title) {
            record = true
            break
          }
        }
        record?'':arr.push(data.value)
      }
    }
  },
}
