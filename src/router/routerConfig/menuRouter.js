//进入系统后公共页面
export default [
  {
    url: '/main',
    menuName: 'main',
    menuPath: 'views/Main',
    redirect: '/index',
    children: [
      {
        url: '/index',
        menuName: '首页',
        menuPath: 'views/Index',
        title: '首页',
        children: null,
      },
      {
        url: '/currentUserInfo',
        menuName: '个人信息',
        menuPath: 'views/userManagement/LoginUserInfo',
        title: '个人信息',
        children: null,
      },
    ],
  },
]
