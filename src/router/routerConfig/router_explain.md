/**
路由页面的说明
------------------
页面根目录都是：views
//工作流
{
    path: '/bpm',
    name: 'bpm',
    component: ()=> import('@/views/workFlowManagement/resources/WorkFlow'),
    meta: {
      title: 'bpm'
    },
  }
//用户管理
{
    path: '/users',
    name: 'users',
    component: ()=> import('@/views/userManagement/User')
  }
//用户组管理
{
    path: '/userGroup',
    name: 'userGroup',
    component: ()=> import('@/views/userManagement/UserGroup')
  }
//用户个人信息中心
{
    path: '/currentUserInfo',
    name: 'currentUserInfo',
    component: ()=> import('@/views/userManagement/LoginUserInfo')
  }
//系统设置 -------------
//权限管理
{
    path: '/permissions',
    name: 'permissions',
    component: ()=> import('@/views/systemManagement/Authority')
  }
//按钮管理
{
    path: '/buttons',
    name: 'buttons',
    component: ()=> import('@/views/systemManagement/Button')
  }
//菜单管理
{
    path: '/menu',
    name: 'menu',
    component: ()=> import('@/views/systemManagement/Menu')
  }
//角色管理
{
    path: '/roles',
    name: 'roles',
    component: ()=> import('@/views/systemManagement/Role')
  }
//部门管理
{
    path: '/dept',
    name: 'dept',
    component: ()=> import('@/views/deptManagment/Dept')
  }
//地址管理
{
    path: '/address',
    name: 'address',
    component: ()=> import('@/views/addressManagement/Address')
  }

//cms管理
//栏目管理
{
    path: '/cmsColumn',
    name: 'cmsColumn',
    component: ()=> import('@/views/cmsManagement/Column')
  }
//内容管理
{
    path: '/cmsContent',
    name: 'cmsContent',
    component: ()=> import('@/views/cmsManagement/Content')
  }
//站点管理
{
    path: '/Website',
    name: 'Website',
    component: ()=> import('@/views/cmsManagement/Website')
  }


**/


