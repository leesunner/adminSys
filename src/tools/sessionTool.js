export default {
  /**
   * @description 存放session
   * @param (id:String,data:数据源)
   * */
  setSession(id, data) {
    if (data) {
      const source = JSON.stringify(data)
      window.sessionStorage.setItem(id, source)
    }
  },
  /**
   * @description 获取session
   * @param (id:String)
   * */
  getSessoin(id) {
    let source = null;
    if (id) {
      const data = window.sessionStorage.getItem(id)
      source = JSON.parse(data)
    }
    return source
  }
}
