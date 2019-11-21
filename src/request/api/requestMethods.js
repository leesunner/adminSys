import qs from 'qs'
import axios from '../index'
//配置接口工具函数
export default {
  get:function (api,data) {
    return axios.get(api,{
      params:data
    })
  },
  post:function (api,data={}) {
    return axios.post(api,qs.stringify(data))
  },
  put:function (api,data) {
    return axios.put(api,qs.stringify(data))
  },
  patch:function (api,data) {
    return axios.patch(api,qs.stringify(data))
  },
  delete:function (api,data) {
    return axios.delete(api,{
      params:data
    })
  },
}
