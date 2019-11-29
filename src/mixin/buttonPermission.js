export default {
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     console.log('路由未进来')
  //     //
  //   })
  // },
  created(){
    console.log(this.$route)
    // const id = this.$route.meta.menuId
    // id?this.getButtonPermission(id):''
  },
  methods: {
    //获取对应页面菜单权限
    getButtonPermission(id) {
      this.$request.get(`${this.$apiList.menu}/${id}/buttons`).then(res => {
        this._session.setSession('buttonPermission',res.data.data)
      }).catch(error =>{

      })
    },
  }
}
