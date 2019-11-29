//配置接口信息列表
const apiList =  {
  login:'/m/sys/login',//账户密码登录
  loginByPhone:'',//手机号登录
  account: `/m/sys/user/account`,//用户修改自己信息
  menu: '/m/sys/menu',//菜单管理
  permission: `/m/sys/permission`,//权限管理
  button: `/m/sys/button`,//按钮管理
  role: `/m/sys/role`,//角色管理
  user: `/m/sys/user`,//用户管理
  user_group: `/m/sys/user-group`,//用户组管理
  dept: `/m/sys/dept`,//部门管理
}

export default apiList
