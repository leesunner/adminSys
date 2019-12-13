const Login = ()=> import('@/views/Login')
const ErrorPage = ()=> import('@/views/Error')
//不涉及权限的路由
export default [
  {
    path: '/',
    name: '/',
    redirect: '/login',
    meta: {
      title: '百问数据系统'
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: '系统登录页'
    },
  },
  {
    path: '*',
    name: '404',
    component: ErrorPage,
    meta: {
      title: '没找到页面'
    },
  },
]
