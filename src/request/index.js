import axios from 'axios'
import _session from '../tools/sessionTool'
import {setCacheInfo,getCacheInfo} from '../tools/utilTools';
import {Loading, Message} from 'element-ui';
import router from '../router';
import url from './api/realmnUrl'

axios.defaults.timeout = 20000
axios.defaults.baseURL = url

let loadingInstance = null
let count = 0

function close() {
  count--
  if (count === 0) {
    loadingInstance.close()
  }
}

function open() {
  count++
  loadingInstance = Loading.service({
    text: '加载中...',
    spinner: '',
    background: 'rgba(0, 0, 0, 0.62)',
  });
}

//请求拦截器
axios.interceptors.request.use(config => {
  open()
  config.headers['requestOrigin'] = 1//识别登录方式（pc）
  const TOKEN = getCacheInfo('AUTH_TOKEN')
  if (!(TOKEN == 'undefined' || !TOKEN)) {
    config.headers['Authorization'] = `Bearer ${TOKEN}`
  }
  // const USER_INFO = _session.getSessoin('USER_INFO')
  // if (USER_INFO){
  //   config.headers['userId'] = USER_INFO.id
  // }
  return config
}, error => {
  close()
  Message({
    showClose: true,
    message: '接口请求有误',
    type: 'error'
  });
  return Promise.reject(error)
})

//响应拦截器
axios.interceptors.response.use(res => {
  close()
  if (res.headers['content-type'] !== undefined && (res.headers['content-type'].indexOf('image') > -1||res.headers['content-type'].indexOf('xml')>-1)) {
    //获取系统中图片时，文件流传递过来做的拦截
    return res
  }
  if (res.data.code === 200||res.data.type=='FeatureCollection') {
    return res
  } else {
    //有需要可以根据code的值给出对应的提示
    switch (res.data.code) {
      case 401:
        _session.clearSession()
        _session.clearLocalStorage()
        Message.error('登录已过期')
        setTimeout(() => {
          router.go(0)
        }, 150)
        break;
      case 403:
        Message.error('暂无权限')
        break;
      case 500:
        Message.error('服务器错误')
        break;
      default:
        Message.error(res.data.msg)
        break;
    }
  }
}, error => {
  close()
  Message({
    showClose: true,
    message: '接口响应超时',
    type: 'error'
  });
  return Promise.reject(error)
})
export default axios
