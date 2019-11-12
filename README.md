百问数字政务系统前端架构说明
基础框架：vue全家桶；
ui框架：element-ui；
ajax框架：axios;
css预处理：sass；
数据可视化框架：

###########文件系统说明（src文件夹下）##########
assets -img 图片文件
       -styles 样式文件
components 项目组件库
directive  自定义指令
elementComponents 按需导入element-ui的组件
request -index.js axios导出主文件，包含拦截器，接口请求域名设置
        -api/apiList.js 接口url导出列表
        -api/requestMethods.js 接口函数调用导出列表
router -index.js 路由全局拦截器，路由主入口
       -routerConfig/pageList.js  路由对应page文件导出
       -routerConfig/routerSource.js  初始化路由文件导出
stores -index.js 状态管理导出主入口
       -modules 拆分文件
tools  -工具函数存放文件
views  系统页面文件

