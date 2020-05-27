//配置接口信息列表/center-users
const gateway = '/center-users'//网关
// const gateway = '/center-users-sam'//网关
const version = '/v1'//版本号
function headString(url) {
  return gateway + version + url
}
const apiList = {
  login: headString(`/m/index/sys/login`),//账户密码登录
  loginOut: headString(`/m/sys/logout`),//账户登出
  account: headString(`/m/sys/user/account`),//用户修改自己信息
  banner: headString(`/m/banner`),//banner管理
  menu: headString(`/m/sys/menu`),//菜单管理
  permission: headString(`/m/sys/permission`),//权限管理
  button: headString(`/m/sys/button`),//按钮管理
  role: headString(`/m/sys/role`),//角色管理
  user: headString(`/m/sys/user`),//用户管理
  user_group: headString(`/m/sys/user-group`),//用户组管理
  dept: headString(`/m/sys/dept`),//部门管理
  location: headString(`/m/dict/localtion`),//位置信息
  sendCode: headString(`/m/index/sys/send`),//发动验证码
  ueditorFileUpload: headString(`/m/cms/ueditor/execute`),//富文本文件配置获取
  fileUpload: headString(`/m/file/oss`),//oss外部文件上传
  inFileUpload: headString(`/m/file/weed`),//内部（非OSS）文件上传
  article: headString(`/m/cms/article`),//文章管理
  category: headString(`/m/cms/category`),//栏目管理
  website: headString(`/m/cms/site`),//站点管理
  workFlow: headString(`/m/activiti`),//工作流（事务/BPM）
  summary: headString(`/api/summary`),//数据图形统计
  feedBack: headString('/m/sys/feedback'),//系统反馈
  allChildren: headString(`/m/activiti/allChildren`),//所有业务
  applyProc: headString(`/m/activiti/applyProc`),//业务详情(我的申请任务历史流转)/{actProcInstId}

  commentList: headString(`/m/activiti/task/comments`),//评论列表、评论详情/{id}--评论删除/{id}
  commentGrades: headString(`/m/activiti/task/comment/grades`),//评价等级列表
  deptScoreList: headString(`/m/activiti/task/dept/comment/avgscore`),//部门评分列表
}

export { apiList, gateway }
