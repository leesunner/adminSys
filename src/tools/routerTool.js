//路由处理函数
//filePath:views/....
const arr = []
export const permissionRouters = function(datas){
  let arr = dataRecursion(datas)
  Array.prototype.push.apply( arr[0].children, arr.splice(1,arr.length));
  return arr
}
function dataRecursion (datas) {
  datas.forEach((item, index) => {
    //先处理父路由数据
    arr.push({
      path: item.path || '',
      name: item.name || '',
      component: () => import('@/' + item.filePath || '@/views/404'),
      redirect: item.redirect || '',
      meta: {
        title: item.title || '百问数据'
      },
      children: []
    })
    //递归处理子路由
    if (item.children !== null && item.children && item.children.length > 0) {
      dataRecursion(item.children)
    }
  })
  return arr
}
