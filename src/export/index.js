import Vue from 'vue';
// 解决导航菜单嵌套导致菜单折叠文字部分不隐藏的问题
import {Plugin} from 'vue-fragment'
Vue.use(Plugin)

// 自定义指令(暂时飞废弃)
// import '../directive'

//导入全局过滤器
import '../filters'

// import 'element-ui/lib/theme-chalk/index.style'
import '../assets/styles/global.css'
import request from '../request'
//element-ui组件引入文件
import '../elementComponents'
//element-ui样式变量覆盖文件
import '../assets/styles/element-variables.scss'

import VueParticles from 'vue-particles'
Vue.use(VueParticles)

//引入接口列表
import {apiList,gateway} from "../request/api/apiList";
import url from '@/request/api/realmnUrl';
//引入通用工具函数
import * as funs from '../tools/utilTools';
//引入字典配置
import config from '../config';
//引入session设置
import _session from '../tools/sessionTool';

Vue.config.productionTip = false

//vue对象上添加公用属性和方法
//axios
Vue.prototype.$request = request
//接口地址
Vue.prototype.$apiList = apiList
//工具函数
Vue.prototype._funs = funs
//配置字典
Vue.prototype._config= config
//缓存
Vue.prototype._session= _session
//请求域名
Vue.prototype.$baseUrl= url
//网关
Vue.prototype.$gateway = gateway
