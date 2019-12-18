//配置接口信息列表/center-users
const gateway = '/center-users-ljw'//网关
const version = '/v1'//版本号
const apiList = {
  login: `${gateway+version}/m/sys/login`,//账户密码登录
  account: `${gateway+version}/m/sys/user/account`,//用户修改自己信息
  menu: `${gateway+version}/m/sys/menu`,//菜单管理
  permission: `${gateway+version}/m/sys/permission`,//权限管理
  button: `${gateway+version}/m/sys/button`,//按钮管理
  role: `${gateway+version}/m/sys/role`,//角色管理
  user: `${gateway+version}/m/sys/user`,//用户管理
  user_group: `${gateway+version}/m/sys/user-group`,//用户组管理
  dept: `${gateway+version}/m/sys/dept`,//部门管理
  location: `${gateway+version}/m/dict/localtion`,//位置信息
  sendCode: `${gateway+version}/m/sys/send`,//发动验证码
  ueditorFileUpload: `${gateway+version}/m/cms/ueditor/execute`,//富文本文件上传
  fileUpload:`${gateway+version}/m/file/oss`,//非文件上传
  article: `${gateway+version}/m/cms/article`,//文章管理
  category: `${gateway+version}/m/cms/category`,//栏目管理
  website: `${gateway+version}/m/cms/site`,//站点管理
  workFlow:`${gateway+version}/m/activiti`,//工作流（事务/BPM）
}

export {apiList,gateway}
