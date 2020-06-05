//需要获取对应页面菜单按钮权限的的 都要导入该mixin
export default {
  data(){
    return{
      //初始化控制按钮显隐
      buttonControl:{},
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm=>{
      //防止不可预知的问题(不在created钩子中使用该逻辑是为了防止不当的引入导致多次请求)
      if (!(vm.$route.path === '/' || vm.$route.path === '/login')) {
        const id = vm.$route.meta.menuId
        if (id) {
          vm.getButtonPermission(id)
        }
      }
    })
  },
  methods: {
    //获取对应页面菜单权限
    getButtonPermission(id) {
      this.$request.get(`${this.$apiList.menu}/${id}/buttons`).then(res => {
        const arr =  res.data.data
        const obj = {}
        arr.forEach(item =>{
          //设置对应按钮为显示
          obj[item.buttonCode]=true
        })
        this.buttonControl = obj
      })
    },
  }
}
