//配置接口信息列表/center-users
// const version = '/v1'//版本号
const version = '/center-users-ljw/v1'//版本号
const apiList = {
  login: `${version}/m/sys/login`,//账户密码登录
  account: `${version}/m/sys/user/account`,//用户修改自己信息
  menu: `${version}/m/sys/menu`,//菜单管理
  permission: `${version}/m/sys/permission`,//权限管理
  button: `${version}/m/sys/button`,//按钮管理
  role: `${version}/m/sys/role`,//角色管理
  user: `${version}/m/sys/user`,//用户管理
  user_group: `${version}/m/sys/user-group`,//用户组管理
  dept: `${version}/m/sys/dept`,//部门管理
  location: `${version}/m/dict/localtion`,//位置信息
  sendCode: `${version}/m/sys/send`,//发动验证码
  ueditorFileUpload: `${version}/m/cms/ueditor/execute`,//富文本文件上传
  fileUpload:`${version}/m/file/oss`,//非文件上传
  article: `${version}/m/cms/article`,//文章管理
  category: `${version}/m/cms/category`,//栏目管理
  website: `${version}/m/cms/site`,//站点管理
  workFlow:`${version}/m/activiti`,//工作流（事务/BPM）
}

export default apiList
