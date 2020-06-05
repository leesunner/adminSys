import router from '../router';
import  store from '../store';
//路由处理函数
//filePath:views/....
const arr = []
//处理路由（将路由全部变成main的子路由，并存放到缓存中）
export const permissionRouters = function(datas){
  let arr = dataRecursion(datas)
  //合并分离后的路由信息
  if (arr[0].children){
    Array.prototype.push.apply( arr[0].children, arr.splice(1,arr.length));
  }
  router.addRoutes(arr)
}
//将所有路由信息父子分离，并存放在数组中
function dataRecursion (datas) {
  datas.forEach((item, index) => {
    //先处理父路由数据
    arr.push({
      path: item.url || '',
      name: item.menuName || '',
      component: () => import('@/' + (item.menuPath.indexOf('views/')>-1 ?item.menuPath: '@/views/Error')),
      redirect: item.redirect || '',
      meta: {
        title: item.menuName || '百问数据',
        menuId:item.id || ''
      },
      children: []
    })
    //组合路由的时候就判断有没有数据报表页面权限，不用再而外去处理了。
    if(item.url=='/index'){
      store.commit('setHasIndex',true)
    }
    //递归处理子路由
    if (item.children && item.children.length > 0) {
      dataRecursion(item.children)
    }
  })
  return arr
}
