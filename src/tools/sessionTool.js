export default {
  /**
   * @description 存放session
   * @param (id:String,data:数据源)
   * */
  setSession(id, data) {
    const source = JSON.stringify(data)
    window.sessionStorage.setItem(id, source)
  },
  /**
   * @description 获取session
   * @param (id:String)
   * */
  getSessoin(id) {
    let source = null;
    if (id) {
      const data = window.sessionStorage.getItem(id)
      data?source = JSON.parse(data):''
    }
    return source
  },
  /**
   * @description 清除所有session
   * @param (id:String)
   * */
  clearSession() {
    window.sessionStorage.clear()
  },
  /**
   * @description 存放LocalStorage
   * @param (id:String,data:数据源)
   * */
  setLocalStorage(id, data) {
    const source = JSON.stringify(data)
    window.localStorage.setItem(id, source)
  },
  /**
   * @description 获取LocalStorage
   * @param (id:String)
   * */
  getLocalStorage(id) {
    let source = null;
    if (id) {
      const data = window.localStorage.getItem(id)
      data?source = JSON.parse(data):''
    }
    return source
  },
  /**
   * @description 清除所有LocalStorage
   * @param (id:String)
   * */
  clearLocalStorage() {
    window.localStorage.clear()
  }
}
