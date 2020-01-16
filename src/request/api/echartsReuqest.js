import axios from 'axios'
import _session from '../../tools/sessionTool'
import {Loading, Message} from 'element-ui';
import router from '../../router';
import url from './realmnUrl'

let _axios = axios.create({
  timeout:20000,
  baseURL:url,
})

//请求拦截器
_axios.interceptors.request.use(config => {
  config.headers['requestOrigin'] = 1//识别登录方式（pc）
  const TOKEN = _session.getSessoin('AUTH_TOKEN')
  if (!(TOKEN == 'undefined' || !TOKEN)) {
    config.headers['Authorization'] = `Bearer ${TOKEN}`
  }
  return config
}, error => {
  Message({
    showClose: true,
    message: '接口请求有误',
    type: 'error'
  });
  return Promise.reject(error)
})

//响应拦截器
_axios.interceptors.response.use(res => {
  if (res.data.code === 200) {
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
export default _axios
