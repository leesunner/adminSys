import router from '../router'
//路由处理函数
//filePath:views/....
const arr = []
//处理路由（将路由全部变成main的子路由，并存放到session中）
export const permissionRouters = function(datas){
  let arr = dataRecursion(datas)
  //合并分离后的路由信息
  Array.prototype.push.apply( arr[0].children, arr.splice(1,arr.length));
  router.addRoutes(arr)
}
//将所有路由信息父子分离，并存放在数组中
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
