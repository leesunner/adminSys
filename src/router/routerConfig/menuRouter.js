//进入系统后公共页面
export default [
  {
    url: '/main',
    menuName: 'main',
    menuPath: 'views/Main',
    redirect: '/currentUserInfo',
    children: [
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
