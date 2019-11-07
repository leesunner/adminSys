import axios from 'axios'

const url = 'http://192.168.1.10'

const AXIOS = axios.create({
  baseURL:url,
  timeout:20000
})

//请求拦截器
AXIOS.interceptors.request.use(config=>{
  console.log(config)
  return config
},error=>{
  return Promise.reject(error)
})

//响应拦截器
AXIOS.interceptors.response.use(res=>{
  console.log(res)
  return res
},error=>{
  return Promise.reject(error)
})
export default AXIOS
