import qs from 'qs'
import apiList from "./apiList";
import axios from '../index'
//配置接口函数
export default {
  login:function (data) {
    return axios.get(apiList.login)
  }
}
