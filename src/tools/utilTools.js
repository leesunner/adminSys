/**
 * 加密工具类
 */
import CryptoJS from 'crypto-js'
//加密key
const key = '201991022019ndit';
//加密偏移值
const piv = 1234567876543210;
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
  const test = /^\w+@[A-Za-z\d]+(.){1}([A-Za-z]{2,})$/g
  return test.test(value)
}
/**
 * 加密
 */
export const Encrypt = (val) => {
  const message = CryptoJS.enc.Utf8.parse(val);
  const secret_key = CryptoJS.enc.Utf8.parse(key);//key
  const iv = CryptoJS.enc.Utf8.parse(piv);//偏移
  // Encrypt
  const ciphertext = CryptoJS.AES.encrypt(message, secret_key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Base64.stringify(ciphertext.ciphertext)
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
