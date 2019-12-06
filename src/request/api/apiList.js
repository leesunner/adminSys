//配置接口信息列表
const version = '/v1'//版本号
const apiList =  {
  login:`${version}/m/sys/login`,//账户密码登录
  account: `${version}/m/sys/user/account`,//用户修改自己信息
  menu: `${version}/m/sys/menu`,//菜单管理
  permission: `${version}/m/sys/permission`,//权限管理
  button: `${version}/m/sys/button`,//按钮管理
  role: `${version}/m/sys/role`,//角色管理
  user: `${version}/m/sys/user`,//用户管理
  user_group: `${version}/m/sys/user-group`,//用户组管理
  dept: `${version}/m/sys/dept`,//部门管理
  location:`${version}/m/dict/localtion`,//位置信息
  sendCode:`${version}/m/sys/send`,//发动验证码
}

export default apiList
