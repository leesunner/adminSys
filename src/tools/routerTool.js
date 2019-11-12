//路由处理函数
//filePath:views/....
export const permissionRouters =  function (datas = [], arr = []) {
  datas.forEach((item, index) => {
    //先处理父路由数据
    arr.push({
      path: item.path,
      name: item.name,
      component: () => import('@/' + item.filePath || '@/views/404'),
      meta: {
        title: item.title || '百问数据'
      },
      children: []
    })
    //递归处理子路由
    if (item.children !== null && item.children.length > 0) {
      let childDatas = permissionRouters(item.children)
      //添加到当前遍历的路由上
      arr[index].children = childDatas
    }
  })
  return arr
}
