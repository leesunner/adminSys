/**
 * 加密工具类
 */
import CryptoJS from 'crypto-js'
//加密key
const key = '201991022019ndit';
//加密偏移值
const piv = 1234567876543210;
import _session from '../tools/sessionTool'
/**
 * 文件类型
 * @param 默认识别txt/word/xsml
 */
export const checkFile = (value) => {
  const test = /(text|word|sheetml)/g
  return test.test(value)
}
/**
 * 验证手机号
 */
export const checkPhone = (value) => {
  const test = /^1[3|4|5|7|8|9]\d{9}$/g
  return test.test(value)
}
/**
 * 验证邮箱
 */
export const checkEmail = (value) => {
  const test = /^\w+@[A-Za-z\d]+\.([A-Za-z]{2,})$/g
  return test.test(value)
}
/***
 * 信息空校验
 * @param (_this:vue对象，data:数据校验对象)
 * */
export const checkInfoEmpty = (_this, data = {}) => {
  let control = false
  for (let item in data) {
    if (!data[item]) {
      _this.$message.error(`${item}不能为空`)
      control = false
      break
    } else {
      control = true
    }
  }
  return control
}

/**
 * 加密
 */
export const Encrypt = (val) => {
  if(typeof val =='object'){
    val = JSON.stringify(val)
  }
  const message = CryptoJS.enc.Utf8.parse(val);
  const secret_key = CryptoJS.enc.Utf8.parse(key);//key
  const iv = CryptoJS.enc.Utf8.parse(piv);//偏移
  // Encrypt
  const ciphertext = CryptoJS.AES.encrypt(message, secret_key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Base64.stringify(ciphertext.ciphertext)
}
/**
 * 解密
 * */
export const Decrypt = (val) => {
  const secret_key = CryptoJS.enc.Utf8.parse(key);
  const iv = CryptoJS.enc.Utf8.parse(piv);
  const ciphertext = CryptoJS.AES.decrypt(val, secret_key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return ciphertext.toString(CryptoJS.enc.Utf8)
}
/**
 * 获取本地缓存加密信息
 * 
*/
export const getCacheInfo = (str) => {
  let info = _session.getLocalStorage(Encrypt(str));
  if (info) {
    info = str=='AUTH_TOKEN'?info:Decrypt(info)
    let test = /[\[\]{}]/g
    if(test.test(info)){
      return JSON.parse(info)
    }else{
      return info
    }
  }else{
    return null
  }
}

/**
 * 存放本地缓存加密信息
 * @param name:要存放进缓存的key；data：数据对象；dataEncrypt 是否加密数据 ;type：local/session
 * 
*/
export const setCacheInfo = (name, data,type = 'local') => {
  if (type === 'local') {
    _session.setLocalStorage(Encrypt(name), name=='AUTH_TOKEN'?data:Encrypt(data));//加密
  } else {
    _session.setSession(Encrypt(name), name=='AUTH_TOKEN'?data:Encrypt(data));//加密
  }
}
/**
 * 清空对象的所有属性的值
 */
export const emptyObj = (obj) => {
  if (typeof (obj) == 'object') {
    for (var key of Object.keys(obj)) {
      if (obj[key] != null && obj[key].constructor == Array) {
        obj[key] = []
      } else {
        obj[key] = ''
      }
    }
    return obj;
  }
}

/**
 * 深拷贝对象
 *
 */
export const copyObject = (obj) => {
  let newObj, ISEMPTY;
  if (!(obj === null || obj === undefined || obj === '' || obj === NaN)) {
    if (obj.constructor === Array) {
      newObj = []
      ISEMPTY = obj.length <= 0;
    } else if (obj.constructor === Object) {
      newObj = {}
      ISEMPTY = Object.keys(obj).length <= 0 || JSON.stringify(obj) == '{}';
    } else {
      ISEMPTY = true
    }
  } else {
    ISEMPTY = true
  }
  if (ISEMPTY) return obj;
  for (let name in obj) {
    if (obj[name] === undefined || obj[name] === null || obj[name] === NaN) {
      newObj[name] = '';
    } else {
      if (obj[name].constructor === Array || obj[name].constructor === Object) {
        newObj[name] = this.copyObject(obj[name]);
      } else {
        newObj[name] = obj[name];
      }
    }
  }
  return newObj
}
