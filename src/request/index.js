import axios from 'axios'
import _session from '../tools/sessionTool'
import {Loading,Message} from 'element-ui';

axios.defaults.timeout = 20000

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
  // const TOKEN = _session.getSessoin('AUTH_TOKEN')
  // if (!(TOKEN == 'undefined' || !TOKEN)) {
  //   config.headers['Authorization'] = `Bearer ${TOKEN}`
  // }
  const USER_INFO = _session.getSessoin('USER_INFO')
  if (USER_INFO){
    config.headers['userId'] = USER_INFO.id
  }
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
  if (res.data.code===200){
    return res
  }else{
    Message({
      showClose: true,
      message: res.data.msg,
      type: 'error'
    });
  }
}, error => {
  close()
  Message({
    showClose: true,
    message: '接口响应有误',
    type: 'error'
  });
  return Promise.reject(error)
})
export default axios
