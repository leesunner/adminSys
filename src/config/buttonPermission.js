/**
 * 按钮代码，buttonCode配置
 * key绑定在页面的按钮中（不要修改）,value跟用户给的值做绑定
 */
export default {
  B_DELETE: 'B_DELETE',//基础的删除
    B_LIST: 'B_LIST',//基础的查看列表
    B_UPDATE: 'B_UPDATE',//基础的编辑(修改)
    B_CREATE: 'B_CREATE',//基础的创建
    B_DETAIL: 'B_DETAIL',//基础的查看详情
    B_EXPORT: 'B_EXPORT',//基础的导出
    B_MENU_TREE:'B_MENU_TREE',//获取权限菜单树
    B_BUTTON_TREE:'B_BUTTON_TREE',//获取权限按钮树
    B_MENU_TREE_UPDATE:'B_MENU_TREE_UPDATE',//修改权限菜单树
    B_BUTTON_TREE_UPDATE:'B_BUTTON_TREE_UPDATE',//修改权限按钮树
    B_ROLE_PERMISSION_LIST:'B_ROLE_PERMISSION_LIST',//查看角色权限列表
    B_ROLE_PERMISSION_OTHERS:'B_ROLE_PERMISSION_OTHERS',//查看角色未拥有权限列表
    B_EDIT_PERMISSION:'B_EDIT_PERMISSION',//角色添加权限
    B_USER_ROLE_LIST:'B_USER_ROLE_LIST',//查看用户角色
    B_USER_UNROLE_LIST:'B_USER_UNROLE_LIST',//查看用户未有角色
    B_EDIT_USER_ROLE:'B_EDIT_USER_ROLE',//编辑用户角色
    B_USER_STATUS:'B_USER_STATUS',//修改用户状态
    B_EDIT_PSW:'B_EDIT_PSW',//修改用户密码
    B_USERS_GROUP_ROLES:'B_USERS_GROUP_ROLES',//查看用户组已拥有的角色列表
    B_USER_GROUP_MENBER:'B_USER_GROUP_MENBER',//查看用户组已拥有的用户列表
    B_DELETE_USER_GROUP:'B_DELETE_USER_GROUP',//用户组移除用户成员
    B_DELETE_ROLE_GROUP:'B_DELETE_ROLE_GROUP',//用户组移除角色
    B_UNOWNE_USERLIST:'B_UNOWNE_USERLIST',//查询用户组未拥有的用户
    B_UNOWNE_ROLELIST:'B_UNOWNE_ROLELIST',//查询用户组未拥有的角色
    B_GROUP_ADD_USER:'B_GROUP_ADD_USER',//用户组添加成员
    B_GROUP_ADD_ROLE:'B_GROUP_ADD_ROLE',//用户组添加角色
    // 部门管理
    B_DEPT_TREE:'B_DEPT_TREE',//  获取部门树
    B_STATUS:'B_STATUS',//禁用-启用/显示-隐藏
    B_DEPT_ROLE_LIST:'B_DEPT_ROLE_LIST',//部门角色列表
    B_UNOWN_ROLE_LIST:'B_UNOWN_ROLE_LIST',//未拥有角色列表
    B_DEPT_USER_LIST:'B_DEPT_USER_LIST',//部门用户列表
    B_UNOWN_USER_LIST:'B_UNOWN_USER_LIST',//未拥有用户列表
    B_LIST:'B_LIST',//查询部门列表
    B_INTO_DEPT_ROLE:'B_LIST',//角色绑定部门
    B_INTO_DEPT_USERS:'B_INTO_DEPT_USERS',//用户绑定部门
    B_DELETE_ROLE:'B_DELETE_ROLE',//移除角色
    B_DELETE_USERS:'B_DELETE_USERS',//移除用户
    //文章
    B_TOP:'B_TOP',//置顶文章
    B_EXAMINE:'B_EXAMINE',//审核文章
    //站点
    B_DETAIL_COLUMN:'B_DETAIL_COLUMN',//站点已拥有的栏目
    B_ALL_COLUMN:'B_ALL_COLUMN',//站点所有的栏目
    B_SUBMIT_COLUMN:'B_SUBMIT_COLUMN',//给站点分配栏目
}
