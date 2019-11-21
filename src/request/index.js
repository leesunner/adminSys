import axios from 'axios'
import _session from '../tools/sessionTool'
import {Loading} from 'element-ui';

// const url = 'http://172.16.9.254:8091'
const AXIOS = axios.create({
  timeout: 10000
})
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
AXIOS.interceptors.request.use(config => {
  open()
  const TOKEN = _session.getSessoin('AUTH_TOKEN')
  if (!(TOKEN == 'undefined' || !TOKEN)) {
    config.headers['Authorization'] = `Bearer ${TOKEN}`
  }
  console.log(config)
  return config
}, error => {
  return Promise.reject(error)
})

//响应拦截器
AXIOS.interceptors.response.use(res => {
  close()
  console.log(res)
  return res.data
}, error => {
  close()
  return Promise.reject(error)
})
export default AXIOS
