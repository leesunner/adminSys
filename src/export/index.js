import Vue from 'vue';
// 解决导航菜单嵌套导致菜单折叠文字部分不隐藏的问题
import {Plugin} from 'vue-fragment'
Vue.use(Plugin)
//按钮权限混入
import buttonMixin from '../mixin/buttonPermission'
// 自定义指令


//导入整体过滤器
import '../fillters'

// import 'element-ui/lib/theme-chalk/index.css'
import '../assets/styles/global.css'
import request from '../request'
//element-ui组件引入文件
import '../elementComponents'
//element-ui样式变量覆盖文件
import '../assets/styles/element-variables.scss'
//粒子背景效果
import VueParticles from 'vue-particles'

Vue.use(VueParticles)
//引入接口列表
import apiList from "../request/api/apiList";
//引入通用工具函数
import * as funs from '../tools/utilTools'
//引入字典
import config from '../config'
//引入session设置
import _session from '../tools/sessionTool'

Vue.config.productionTip = false

Vue.mixin(buttonMixin)
Vue.prototype.$request = request
Vue.prototype.$apiList = apiList
Vue.prototype._funs = funs
Vue.prototype._config= config
Vue.prototype._session= _session
